// Audio-first lesson player. Uses globals from index.html (S, save, render, $, esc, romaji, shuffle, voice, KANJI_BY, COMPOUNDS).
"use strict";
const ABORT = { abort: true };
let LP = null;          // the running lesson
let wakeLock = null;

// ───────── speech helpers ─────────
function enVoice(){
  if(!("speechSynthesis" in window)) return null;
  const vs = speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));
  return vs.find(v=>/samantha|daniel|karen|serena|alex/i.test(v.name)) || vs.find(v=>/^en-(US|GB)/i.test(v.lang)) || vs[0] || null;
}
function speakP(text, lang, rate){
  return new Promise(res=>{
    if(!("speechSynthesis" in window) || !text) return res();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang==="ja" ? "ja-JP" : "en-US";
    const v = lang==="ja" ? voice : enVoice(); if(v) u.voice = v;
    u.rate = rate || 1;
    let done = false; const fin = ()=>{ if(!done){ done=true; clearTimeout(t); res(); } };
    u.onend = fin; u.onerror = fin;
    const est = (lang==="ja" ? text.length*230 : text.split(/\s+/).length*380) / u.rate + 1200;
    const t = setTimeout(fin, est*2);   // safety net: iOS sometimes skips onend
    speechSynthesis.speak(u);
  });
}
const sleep = ms => new Promise(r=>setTimeout(r, ms));
const ttsText = it => (it.kana && !/\s|、|。/.test(it.kana.trim())) ? it.kana : it.ja;   // single words from kana, sentences from ja
const kanaLen = it => (it.kana||it.ja||"").replace(/[\s、。？！]/g,"").length;
const turnMs = (it, extra=0) => Math.min(7000, 1600 + 170*kanaLen(it) + extra) * (LP && LP.slow ? 1.35 : 1);
const jaRate = slow => slow ? 0.62 : (LP && LP.slow ? S.set.rate*0.8 : S.set.rate);

const alive = tok => LP && LP.token===tok && LP.playing;
async function E(tok, text){ if(!alive(tok)) throw ABORT; LP.ui.speaker="en"; renderLP(); await speakP(text,"en",1); if(!alive(tok)) throw ABORT; }
async function J(tok, it, slow){ if(!alive(tok)) throw ABORT; LP.ui.speaker="ja"; LP.ui.shown=it; renderLP(); await speakP(ttsText(it),"ja",jaRate(slow)); if(!alive(tok)) throw ABORT; }
async function TURN(tok, it, extra){ if(!alive(tok)) throw ABORT; const ms=turnMs(it,extra); LP.ui.speaker="you"; LP.ui.turnMs=ms; LP.ui.turnAt=Date.now(); renderLP(); await sleep(ms); if(!alive(tok)) throw ABORT; LP.ui.turnMs=0; }
async function P(tok, ms){ await sleep(ms); if(!alive(tok)) throw ABORT; }
function TAP(tok, q, opts, kanaMap){ if(!alive(tok)) throw ABORT; LP.ui.speaker="tap"; LP.ui.q=q; LP.ui.opts=opts; LP.ui.optKana=kanaMap||null; LP.ui.picked=null; renderLP();
  return new Promise(res=>{ LP.tapResolve=v=>{ LP.tapResolve=null; res(v); }; }); }

// ───────── lesson compile (adds spaced recalls inside a lesson) ─────────
function compileLesson(lesson){
  const out=[], pend=[];
  const base = lesson.steps.map(s=>Object.assign({_lid:lesson.id}, s));
  const learnable = base.filter(s=>(s.t==="new"||s.t==="build") && s.en);
  base.forEach(st=>{
    if(st.t==="kanji"){   // flush pending recalls before the kanji outro
      pend.splice(0).forEach(p=>out.push({t:"recall", ref:p.st, _lid:lesson.id}));
      const fin=shuffle(learnable.slice()).slice(0,2); fin.forEach(r=>out.push({t:"recall", ref:r, _lid:lesson.id}));
    }
    out.push(st);
    if((st.t==="new"||st.t==="build") && st.en) pend.push({due:out.length+3, st});
    for(let i=0;i<pend.length;i++) if(out.length>=pend[i].due){ out.push({t:"recall", ref:pend[i].st, _lid:lesson.id}); pend.splice(i--,1); }
  });
  pend.forEach(p=>out.push({t:"recall", ref:p.st, _lid:lesson.id}));
  return out;
}
const itemId = st => (st._lid||"x")+":"+((st.ref&&(st.ref.id||st.ref.ja))||st.id||st.ja);
function lxMark(st, ok){ S.lx=S.lx||{}; const id=itemId(st); const q=S.lx[id]||(S.lx[id]={r:0,w:0,t:0}); ok?q.r++:q.w++; q.t=Date.now(); }

// ───────── Daily mix: built from finished lessons, misses first ─────────
function buildMix(){
  const done=COURSE.filter(l=>S.lessons&&S.lessons[l.id]);
  const cands=[];
  done.forEach(l=>l.steps.forEach(st=>{
    const s=Object.assign({_lid:l.id}, st);
    let step=null;
    if(st.t==="new"||st.t==="build"||st.t==="say") step={t:"recall", ref:s, _lid:l.id};
    else if(st.t==="ask"||st.t==="hear") step=s;
    else if(st.t==="kanji") step={t:"khear", ref:s, _lid:l.id};
    if(!step) return;
    const q=(S.lx||{})[itemId(step)]||{r:0,w:0,t:0};
    const ageDays=(Date.now()-(q.t||0))/864e5;
    cands.push({step, score: q.w*3 - q.r + Math.min(ageDays,5) + Math.random()*1.5});
  }));
  cands.sort((a,b)=>b.score-a.score);
  const cap={khear:3, hear:3, ask:4, recall:12}, used={}, pick=[];
  for(const c of cands){ const t=c.step.t; if((used[t]||0)>=cap[t]) continue; used[t]=(used[t]||0)+1; pick.push(c.step); if(pick.length>=12) break; }
  // mix types so it doesn't feel like a block of the same thing
  const by={}; pick.forEach(s=>(by[s.t]=by[s.t]||[]).push(s));
  const out=[]; const keys=Object.keys(by); let i=0;
  while(keys.some(k=>by[k].length)){ const k=keys[i++%keys.length]; if(by[k].length) out.push(by[k].shift()); }
  return out;
}

// ───────── lesson quiz: ~8 questions from one lesson, mostly by ear ─────────
function buildQuiz(lesson){
  const L=lesson.steps.map(s=>Object.assign({_lid:lesson.id}, s));
  const pools={
    respond: shuffle(L.filter(s=>s.t==="hear"&&s.reply)).map(s=>({t:"respond", ref:s, _lid:lesson.id, id:"q-"+(s.ja)})),
    hear:    shuffle(L.filter(s=>s.t==="hear")),
    ask:     shuffle(L.filter(s=>s.t==="ask")),
    qsay:    shuffle(L.filter(s=>(s.t==="new"||s.t==="build"||s.t==="say")&&s.en)).map(s=>({t:"qsay", ref:s, _lid:lesson.id})),
    khear:   L.filter(s=>s.t==="kanji").map(s=>({t:"khear", ref:s, _lid:lesson.id})),
  };
  const caps={respond:2, hear:2, ask:3, qsay:3, khear:1}, out=[];
  Object.keys(caps).forEach(k=>out.push(...pools[k].slice(0,caps[k])));
  const rest=Object.keys(pools).flatMap(k=>pools[k].slice(caps[k]));
  while(out.length<8 && rest.length) out.push(rest.shift());
  // spread types out
  const by={}; shuffle(out.slice(0,8)).forEach(s=>(by[s.t]=by[s.t]||[]).push(s));
  const res=[]; const ks=Object.keys(by); let i=0; while(ks.some(k=>by[k].length)){ const k=ks[i++%ks.length]; if(by[k].length) res.push(by[k].shift()); }
  return { id:"quiz:"+lesson.id, quizOf:lesson.id, title:"Quiz: "+lesson.title, sub:"", steps:res };
}

// ───────── steps → speech ─────────
async function playStep(st, tok){
  LP.ui={step:st, speaker:null};
  const missKey = itemId(st);
  switch(st.t){
    case "tip":
      LP.ui.title="Tip"; LP.ui.en=st.en; await E(tok, st.en); await P(tok, 500); break;
    case "new":
      LP.ui.title="New"; LP.ui.en=st.en;
      await E(tok, st.en); await P(tok,250);
      await J(tok, st, true); await TURN(tok, st);
      await J(tok, st); await TURN(tok, st, -400);
      if(st.note){ LP.ui.note=st.note; await E(tok, st.note); }
      lxMark(st, !LP.miss.has(missKey)); break;
    case "build": {
      LP.ui.title="Build it up"; LP.ui.en=st.en;
      await E(tok, st.en+". Let's build it from the end.");
      for(const part of st.parts){ const it={kana:part, ja:part}; LP.ui.part=part; await J(tok, it, part!==st.parts[st.parts.length-1]); await TURN(tok, it); }
      LP.ui.part=null; await E(tok, "Once more, at normal speed."); await J(tok, st); await TURN(tok, st, -300);
      lxMark(st, !LP.miss.has(missKey)); break; }
    case "say": case "recall": {
      const it = st.t==="recall" ? st.ref : st;
      LP.ui.title = st.t==="recall" ? "Remember?" : "Your turn"; LP.ui.en=it.en;
      await E(tok, (st.t==="recall" ? "Do you remember how to say: " : "How would you say: ")+it.en.replace(/^(Ask|Answer)[^:]*:\s*/,""));
      await TURN(tok, it, 900);
      await J(tok, it); await TURN(tok, it, -400);
      lxMark(st, !LP.miss.has(missKey)); break; }
    case "hear": {
      LP.ui.title="Listen";
      await E(tok, "Listen. What does this mean?");
      await J(tok, st);
      const opts=shuffle([st.en].concat(st.opts));
      const pick=await TAP(tok, "What did they say?", opts);
      const ok=pick===st.en; LP.taps++; if(ok) LP.right++; else LP.miss.add(missKey);
      LP.ui.picked=pick; LP.ui.correct=st.en; renderLP();
      await E(tok, ok ? "Right." : "That was: "+st.en+".");
      await J(tok, st, true);
      if(st.reply){ LP.ui.reply=st.reply; await E(tok, st.reply.en); await TURN(tok, st.reply, 600); await J(tok, st.reply); await TURN(tok, st.reply, -400); }
      lxMark(st, ok); break; }
    case "ask": {
      LP.ui.title="Ask";
      LP.ui.en=st.en; await E(tok, st.en); await TURN(tok, st, 900);
      await J(tok, st); await TURN(tok, st, -400);
      const r = st.replies[Math.random()*st.replies.length|0];
      LP.ui.reply=null; LP.ui.en="They answer…"; await E(tok, "They answer.");
      LP.ui.answer=r; await J(tok, r);
      const opts=shuffle([...new Set(st.replies.map(x=>x.a))]);
      const pick=await TAP(tok, st.q, opts);
      const ok=pick===r.a; LP.taps++; if(ok) LP.right++; else LP.miss.add(missKey);
      LP.ui.picked=pick; LP.ui.correct=r.a; renderLP();
      await E(tok, ok ? "Right: "+r.a+"." : "They said: "+r.a+".");
      await J(tok, r, true); await P(tok, 300);
      lxMark(st, ok); break; }
    case "kanji": {
      LP.ui.title="How it's written"; LP.ui.kanji=st;
      await E(tok, "You know "+st.en+". Here's how it's written.");
      await J(tok, st);
      await E(tok, st.why+".");
      await P(tok, 1200); break; }
    case "swapbase": {
      LP.ui.title="Start sentence"; LP.ui.en=st.it.en; LP.ui.note=st.why;
      await E(tok, "Here's your sentence: "+st.it.en);
      await J(tok, st.it, true); await TURN(tok, st.it); await J(tok, st.it); await TURN(tok, st.it, -300);
      break; }
    case "swap": {
      LP.ui.title="Change it"; LP.ui.cue=st.cue; LP.ui.en=st.it.en;
      await E(tok, "Now: "+st.cue+".");
      await TURN(tok, st.it, 1600);
      await J(tok, st.it); await TURN(tok, st.it, -300);
      lxMark(st, !LP.miss.has(missKey)); break; }
    case "qsay": {
      const it=st.ref; LP.ui.title="Say it"; LP.ui.en=it.en;
      await E(tok, "Say: "+it.en.replace(/^(Ask|Answer)[^:]*:\s*/,""));
      await TURN(tok, it, 900); await J(tok, it); await P(tok, 300);
      const pick=await TAP(tok, "Did you get it?", ["Got it", "Missed it"]);
      const ok=pick==="Got it"; LP.taps++; if(ok) LP.right++; else LP.miss.add(missKey);
      LP.ui.picked=pick; LP.ui.correct="Got it"; renderLP(); await P(tok, 300);
      lxMark(st, ok); break; }
    case "respond": {
      const h=st.ref; LP.ui.title="Respond";
      await E(tok, "They say this. Pick the best reply.");
      await J(tok, h);
      const others=shuffle(COURSE.flatMap(l=>l.steps).filter(x=>x.t==="hear"&&x.reply&&x.reply.ja!==h.reply.ja).map(x=>x.reply)).filter((r,i,a)=>a.findIndex(y=>y.ja===r.ja)===i).slice(0,2);
      const all=shuffle(others.concat(h.reply)); const km={}; all.forEach(r=>km[r.ja]=r.kana);
      const pick=await TAP(tok, "Best reply?", all.map(r=>r.ja), km);
      const ok=pick===h.reply.ja; LP.taps++; if(ok) LP.right++; else LP.miss.add(missKey);
      LP.ui.picked=pick; LP.ui.correct=h.reply.ja; renderLP();
      await E(tok, ok?"Right.":"The best reply:"); await J(tok, h.reply); await P(tok, 300);
      lxMark(st, ok); break; }
    case "khear": {   // daily mix: hear a word, pick how it's written
      const k=st.ref; LP.ui.title="Which is written?";
      await E(tok, "Listen. Which one is it?");
      await J(tok, k);
      const pool=shuffle(COMPOUNDS.filter(c=>c.w!==k.ja && c.w.length===k.ja.length)).slice(0,3).map(c=>c.w);
      const pick=await TAP(tok, "Which word did you hear?", shuffle(pool.concat(k.ja)));
      const ok=pick===k.ja; LP.taps++; if(ok) LP.right++; else LP.miss.add(missKey);
      LP.ui.picked=pick; LP.ui.correct=k.ja; LP.ui.kanji=k; renderLP();
      await E(tok, (ok?"Right. ":"It was this one. ")+k.why+"."); await P(tok, 800);
      lxMark(st, ok); break; }
  }
}

async function runLP(){
  if(!LP) return;
  const tok=++LP.token; LP.playing=true; keepAwake(true);
  try{
    while(LP && LP.si<LP.steps.length){
      await playStep(LP.steps[LP.si], tok);
      if(!alive(tok)) return;
      LP.si++; save();
    }
    if(alive(tok)) finishLP();
  }catch(e){ if(e!==ABORT) { console.error(e); } }
}
function pauseLP(){ if(!LP) return; LP.playing=false; LP.token++; if(LP.tapResolve) LP.tapResolve=null; speechSynthesis.cancel(); keepAwake(false); renderLP(); }
function startLesson(lesson){
  const steps = COURSE.some(l=>l.id===lesson.id) ? compileLesson(lesson) : lesson.steps;
  LP={lesson, steps, back: LP&&LP.back ? LP.back : (tab==="build"?"build":"listen"), si:0, token:0, playing:false, ui:{}, miss:new Set(), taps:0, right:0, slow:false, done:false};
  say("");   // unlock speech inside the tap
  render(); runLP();
}
function finishLP(){
  LP.done=true; LP.playing=false; keepAwake(false);
  if(COURSE.some(l=>l.id===LP.lesson.id)){ S.lessons=S.lessons||{}; const prev=S.lessons[LP.lesson.id]; S.lessons[LP.lesson.id]={n:(prev?prev.n:0)+1, t:Date.now()}; }
  else if(LP.lesson.id==="mix") S.mixDate=dayKey();
  if(LP.lesson.quizOf){ S.lq=S.lq||{}; const pct=LP.taps?Math.round(LP.right/LP.taps*100):0; S.lq[LP.lesson.quizOf]=Math.max(S.lq[LP.lesson.quizOf]||0, pct); }
  const k=dayKey(); S.log[k]=S.log[k]||{n:0,r:0}; S.log[k].n+=LP.taps||1; S.log[k].r+=LP.right;
  save(); renderLP();
}
async function keepAwake(on){
  try{
    if(on && "wakeLock" in navigator && !wakeLock){ wakeLock=await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release",()=>{ wakeLock=null; }); }
    if(!on && wakeLock){ await wakeLock.release(); wakeLock=null; }
  }catch(e){ wakeLock=null; }
}
document.addEventListener("visibilitychange", ()=>{ if(document.hidden && LP && LP.playing) pauseLP(); });

// ───────── screens ─────────
function lessonMinutes(l){ return Math.max(3, Math.round(compileLesson(l).length*13/60)); }
function renderListen(){
  const done=COURSE.filter(l=>S.lessons&&S.lessons[l.id]);
  const next=COURSE.find(l=>!(S.lessons&&S.lessons[l.id]));
  const mixN=done.length?Math.min(12, buildMix().length):0;
  $("#app").innerHTML=`
    <h1 class="jp">墨 Sumi</h1>
    <p class="sub">Listen, say it out loud, catch the answer. Headphones help.</p>
    ${next?`<h2>Next up</h2>
    <div class="card">
      <div class="sub" style="font-size:13px">Lesson ${COURSE.indexOf(next)+1} · about ${lessonMinutes(next)} min</div>
      <div style="font-size:21px;font-weight:700;margin:2px 0">${esc(next.title)}</div>
      <div class="sub">${esc(next.sub)}</div>
      <button class="btn" data-ls="${next.id}" style="margin-top:14px">▶ Start lesson</button>
    </div>`:""}
    ${mixN?`<h2>Daily mix</h2>
    <div class="card">
      <div style="font-weight:600">${mixN} items from your lessons</div>
      <div class="sub">What you missed comes first, plus a few older ones.${S.mixDate===dayKey()?" Done today ✓":""}</div>
      <button class="btn ${next?"ghost":""}" id="mix" style="margin-top:12px">▶ Play daily mix</button>
    </div>`:""}
    <h2>Lessons</h2>
    <div class="card" style="padding:4px 16px">
      ${COURSE.map((l,i)=>{ const d=S.lessons&&S.lessons[l.id];
        const q=S.lq&&S.lq[l.id];
        return `<div class="phrase"><span class="dot ${d?"l2":""}"></span><div class="t" data-ls="${l.id}">
          <div style="font-weight:600">${i+1}. ${esc(l.title)}</div><div class="en">${esc(l.sub)}${d?` · done${d.n>1?` ${d.n}×`:""}`:""}</div></div>
          <button class="chip ${q>=80?"on":""}" data-lqz="${l.id}" style="flex:none">${q!=null?(q>=80?"✓ ":"")+"Quiz "+q+"%":"Quiz"}</button><span class="sub" data-ls="${l.id}" style="padding-left:6px">▶</span></div>`; }).join("")}
    </div>
    <button class="btn ghost" id="drill" style="margin-top:14px">Text drills (old practice)</button>`;
  document.querySelectorAll("[data-ls]").forEach(b=>b.onclick=()=>startLesson(COURSE.find(l=>l.id===b.dataset.ls)));
  document.querySelectorAll("[data-lqz]").forEach(b=>b.onclick=()=>startLesson(buildQuiz(COURSE.find(l=>l.id===b.dataset.lqz))));
  if($("#mix")) $("#mix").onclick=()=>startLesson({id:"mix", title:"Daily mix", sub:"", steps:buildMix()});
  $("#drill").onclick=()=>{ tab="drill"; render(); };
}

function renderLP(){
  if(!LP || $("#sheet")) return;
  if(tab!=="listen") return;
  const L=LP, ui=L.ui||{};
  if(L.done){
    const miss=[...L.miss].map(id=>{ const st=L.steps.find(s=>itemId(s)===id); const it=st&&(st.ref||st); return it; }).filter(Boolean);
    const baseId=L.lesson.quizOf||L.lesson.id; const ix=COURSE.findIndex(l=>l.id===baseId); const nextL=ix>=0?COURSE[ix+1]:null;
    $("#app").innerHTML=`
      <h1>${L.lesson.id==="mix"?"Mix done":L.lesson.quizOf?"Quiz done":L.lesson.id==="swap"?"Drill done":"Lesson done"}</h1>
      <div class="card"><div style="font-size:20px;font-weight:700">${esc(L.lesson.title)}</div>
        <div class="sub">${L.taps?`Caught ${L.right} of ${L.taps} answers.`:"Nice."} ${miss.length?"The misses come back in your Daily mix.":""}</div></div>
      ${miss.length?`<h2>Worth another listen</h2><div class="card" style="padding:4px 16px">${miss.map(it=>`<div class="phrase"><div class="t"><div class="ja jp">${esc(it.ja)}</div><div class="en">${esc(it.en||"")}</div></div><button class="play" data-sayt="${esc(ttsText(it))}">▶</button></div>`).join("")}</div>`:""}
      <div class="stack" style="margin-top:16px">
        ${COURSE.some(l=>l.id===L.lesson.id)?`<button class="btn" id="takeQ">Take the quiz</button>`:""}
        ${nextL?`<button class="btn ${COURSE.some(l=>l.id===L.lesson.id)?"ghost":""}" id="nextL">▶ Next: ${esc(nextL.title)}</button>`:""}
        <button class="btn ghost" id="again">Play again</button>
        <button class="btn ghost" id="back">Back</button></div>`;
    if($("#nextL")) $("#nextL").onclick=()=>startLesson(nextL);
    if($("#takeQ")) $("#takeQ").onclick=()=>startLesson(buildQuiz(L.lesson));
    $("#again").onclick=()=>{ if(L.lesson.id==="mix") startLesson({id:"mix",title:"Daily mix",sub:"",steps:buildMix()});
      else if(L.lesson.quizOf) startLesson(buildQuiz(COURSE.find(l=>l.id===L.lesson.quizOf)));
      else if(L.lesson.id==="swap"){ const f=L.lesson.frame||null; startLesson({ id:"swap", title:L.lesson.title, sub:"", frame:f, steps: swapSteps(f) }); }
      else startLesson(L.lesson); };
    $("#back").onclick=()=>{ const b=L.back; LP=null; tab=b; render(); };
    return;
  }
  const showText=!!S.set.lShow, it=ui.shown;
  const speakerLbl = {en:"🎧 Listen", ja:"🇯🇵 Japanese", you:"🗣 Your turn: say it out loud", tap:"👆 "+(ui.q||"Pick one")}[ui.speaker] || (L.playing?"…":"Paused");
  const pct=L.si/L.steps.length*100;
  const opts = ui.speaker==="tap" || ui.picked ? (ui.opts||[]) : [];
  $("#app").innerHTML=`
    <div class="top"><button class="x" id="lq">✕</button><div class="bar"><i style="width:${pct}%"></i></div><span class="sub">${L.si+1}/${L.steps.length}</span></div>
    <div class="row between"><span class="tag">${esc(ui.title||L.lesson.title)}</span><span class="sub" style="font-size:13px">${esc(L.lesson.title)}</span></div>
    <div class="lp-stage ${ui.speaker||""}">
      <div class="lp-who">${speakerLbl}</div>
      ${ui.cue?`<div style="font-size:22px;font-weight:700;margin-top:10px">→ ${esc(ui.cue)}</div>`:""}
      ${ui.speaker==="you"?`<div class="lp-ring"><i style="animation-duration:${ui.turnMs}ms;animation-delay:-${Math.min(ui.turnMs,Date.now()-ui.turnAt)}ms"></i></div>`:""}
      ${ui.kanji?`<div class="jp" style="font-size:56px;font-weight:700;margin-top:8px">${esc(ui.kanji.ja)}</div>
        <div class="row" style="justify-content:center;gap:14px;flex-wrap:wrap">${[...ui.kanji.ja].filter(ch=>KANJI_BY[ch]).map(ch=>`<div class="center" data-kj="${ch}"><div class="jp" style="font-size:24px">${ch}</div><div class="sub" style="font-size:12px">${esc(KANJI_BY[ch].m.split(",")[0])}</div></div>`).join("")}</div>
        <div class="sub jp" style="margin-top:6px">${esc(ui.kanji.kana)} · ${esc(ui.kanji.en)}</div>`:""}
    </div>
    ${showText && (ui.en || ui.part || ui.note || (it && !(ui.speaker==="tap" && !ui.picked)))?`<div class="card" style="margin-top:12px">
        ${ui.en?`<div style="font-weight:600">${esc(ui.en)}</div>`:""}
        ${ui.part?`<div class="jp" style="font-size:20px;margin-top:6px">${esc(ui.part)}</div>`:""}
        ${it && !(ui.speaker==="tap" && !ui.picked)?`<div class="jp chipline" style="font-size:22px;margin-top:6px">${chips(it.ja,it.kana)}</div><div class="romaji">${esc(romaji(it.kana||it.ja))}</div>`:""}
        ${ui.note?`<p class="note">${esc(ui.note)}</p>`:""}
      </div>`:""}
    ${opts.length?`<div class="opts" style="margin-top:12px">${opts.map(o=>`<button class="opt ${ui.picked&&o===ui.correct?"right":""} ${ui.picked===o&&o!==ui.correct?"wrong":""} ${ui.optKana?"jp":/[一-鿿]/.test(o)?"jp optk":""}" data-lo="${esc(o)}" ${ui.picked?"disabled":""}>${esc(o)}${ui.optKana&&ui.optKana[o]&&S.set.romaji?`<div class="romaji" style="font-size:12px">${esc(romaji(ui.optKana[o]))}</div>`:""}</button>`).join("")}</div>
      ${ui.speaker==="tap"?`<div class="row" style="justify-content:center;margin-top:10px"><button class="play" id="rep1">▶ Again</button><button class="play" id="rep2">🐢 Slow</button></div>`:""}`:""}
    <div class="lp-controls">
      <button class="play" id="lback" aria-label="previous">⏮</button>
      <button class="play" id="lrep" aria-label="repeat">⟲</button>
      <button class="play huge" id="lpp" style="width:76px;height:76px;margin:0">${L.playing?"❚❚":"▶"}</button>
      <button class="play" id="lskip" aria-label="skip">⏭</button>
      <button class="play ${L.slow?"on":""}" id="lslow" aria-label="slower">🐢</button>
    </div>
    <div class="row" style="justify-content:center;gap:8px;margin-top:10px">
      <button class="chip ${showText?"on":""}" id="ltxt">Show text</button>
      ${ui.speaker==="you"?`<button class="chip" id="lmiss">${L.miss.has(itemId(ui.step||{}))?"Marked ✓":"✗ Didn't know it"}</button>`:""}
    </div>`;
  const restart=()=>{ pauseLP(); runLP(); renderLP(); };
  $("#lq").onclick=()=>{ const b=L.back; pauseLP(); LP=null; save(); tab=b; render(); };
  $("#lpp").onclick=()=>{ if(L.playing) pauseLP(); else { say(""); runLP(); } };
  $("#lrep").onclick=restart;
  $("#lskip").onclick=()=>{ L.si=Math.min(L.si+1, L.steps.length-1); restart(); };
  $("#lback").onclick=()=>{ L.si=Math.max(0, L.si-1); restart(); };
  $("#lslow").onclick=()=>{ L.slow=!L.slow; renderLP(); };
  $("#ltxt").onclick=()=>{ S.set.lShow=!S.set.lShow; save(); renderLP(); };
  if($("#lmiss")) $("#lmiss").onclick=()=>{ L.miss.add(itemId(ui.step)); renderLP(); };
  document.querySelectorAll("[data-lo]").forEach(b=>b.onclick=()=>{ if(L.tapResolve) L.tapResolve(b.dataset.lo); });
  const replayIt = ui.answer || ui.shown || (ui.step && ui.step.ref) || null;
  if($("#rep1")) $("#rep1").onclick=()=>replayIt&&speakP(ttsText(replayIt),"ja",S.set.rate);
  if($("#rep2")) $("#rep2").onclick=()=>replayIt&&speakP(ttsText(replayIt),"ja",0.62);
}
