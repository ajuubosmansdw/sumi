// Sentence building: frames with swappable slots, verb forms, question toggle and add-ons.
// Every combination a frame allows is correct Japanese, so the voice can say anything you build.
"use strict";
const bw = (ja, kana, en) => ({ ja, kana, en });
const BW = {
  place:   [bw("京都","きょうと","Kyoto"), bw("大阪","おおさか","Osaka"), bw("東京","とうきょう","Tokyo"), bw("渋谷","しぶや","Shibuya"), bw("福岡","ふくおか","Fukuoka"), bw("駅","えき","the station"), bw("ホテル","ホテル","the hotel"), bw("コンビニ","コンビニ","the konbini")],
  where:   [bw("駅","えき","the station"), bw("トイレ","トイレ","the toilet"), bw("出口","でぐち","the exit"), bw("入口","いりぐち","the entrance"), bw("ホテル","ホテル","the hotel"), bw("コンビニ","コンビニ","the konbini"), bw("交番","こうばん","the police box")],
  country: [bw("オランダ","オランダ","the Netherlands"), bw("日本","にほん","Japan"), bw("中国","ちゅうごく","China"), bw("アメリカ","アメリカ","America"), bw("ドイツ","ドイツ","Germany"), bw("東京","とうきょう","Tokyo")],
  food:    [bw("ラーメン","ラーメン","ramen"), bw("お寿司","おすし","sushi"), bw("カレー","カレー","curry"), bw("豚肉","ぶたにく","pork"), bw("鶏肉","とりにく","chicken"), bw("牛肉","ぎゅうにく","beef"), bw("魚","さかな","fish")],
  drink:   [bw("水","みず","water"), bw("お茶","おちゃ","tea"), bw("コーヒー","コーヒー","coffee"), bw("ジュース","ジュース","juice"), bw("ビール","ビール","beer")],
  buy:     [bw("水","みず","water"), bw("切符","きっぷ","a ticket"), bw("お土産","おみやげ","souvenirs"), bw("漫画","まんが","manga"), bw("Tシャツ","ティーシャツ","a T-shirt")],
  media:   [bw("アニメ","アニメ","anime"), bw("映画","えいが","a movie"), bw("テレビ","テレビ","TV")],
  give:    [bw("これ","これ","this"), bw("それ","それ","that"), bw("水","みず","water"), bw("お茶","おちゃ","tea"), bw("袋","ふくろ","a bag"), bw("お箸","おはし","chopsticks")],
  have:    [bw("水","みず","water"), bw("トイレ","トイレ","a toilet"), bw("ワイファイ","ワイファイ","Wi-Fi"), bw("袋","ふくろ","bags"), bw("英語のメニュー","えいご の メニュー","an English menu")],
  like:    [bw("ラーメン","ラーメン","ramen"), bw("お寿司","おすし","sushi"), bw("アニメ","アニメ","anime"), bw("漫画","まんが","manga"), bw("日本","にほん","Japan"), bw("コーヒー","コーヒー","coffee")],
  price:   [bw("これ","これ","this"), bw("それ","それ","that"), bw("このTシャツ","この ティーシャツ","this T-shirt"), bw("切符","きっぷ","the ticket"), bw("ラーメン","ラーメン","the ramen")],
  shop:    [bw("お店","おみせ","the shop"), bw("コンビニ","コンビニ","the konbini"), bw("美術館","びじゅつかん","the museum"), bw("駅","えき","the station")],
  adjsubj: [Object.assign(bw("これ","これ","this"),{ok:[0,1,2,3,4]}), Object.assign(bw("それ","それ","that"),{ok:[0,1,2,3,4]}), Object.assign(bw("ラーメン","ラーメン","the ramen"),{ok:[0,1,2,3,4]}), Object.assign(bw("日本","にほん","Japan"),{ok:[1,2,5]}), Object.assign(bw("日本語","にほんご","Japanese"),{ok:[5,6]})],
  adj:     [bw("おいしい","おいしい","tasty"), bw("高い","たかい","expensive"), bw("安い","やすい","cheap"), bw("辛い","からい","spicy"), bw("大きい","おおきい","big"), bw("楽しい","たのしい","fun"), bw("難しい","むずかしい","difficult")],
  act:     [bw("写真を撮って","しゃしん を とって","take a photo"), bw("ここに座って","ここ に すわって","sit here"), bw("入って","はいって","come in"), bw("これを食べて","これ を たべて","eat this"), bw("ここで待って","ここ で まって","wait here"), bw("見て","みて","have a look")],
};
// verbs: kanji stem, kana stem, English base / past
const BV = {
  go:    { ja:"行き", kana:"いき", en:"go", past:"went" },
  come:  { ja:"来", kana:"き", en:"come", past:"came" },
  back:  { ja:"帰り", kana:"かえり", en:"go back", past:"went back" },
  eat:   { ja:"食べ", kana:"たべ", en:"eat", past:"ate" },
  drink: { ja:"飲み", kana:"のみ", en:"drink", past:"drank" },
  buy:   { ja:"買い", kana:"かい", en:"buy", past:"bought" },
  watch: { ja:"見", kana:"み", en:"watch", past:"watched" },
  open:  { ja:"開き", kana:"あき", en:"open", past:"opened" },
  close: { ja:"閉まり", kana:"しまり", en:"close", past:"closed" },
};
const VFORMS = {
  masu:   { ja:"ます", label:"do (ます)" },
  masen:  { ja:"ません", label:"don't (ません)" },
  mashita:{ ja:"ました", label:"did (ました)" },
  masendeshita:{ ja:"ませんでした", label:"didn't (ませんでした)" },
  tai:    { ja:"たいです", label:"want to (たいです)" },
  masenka:{ ja:"ませんか", label:"shall we? (ませんか)", noQ:true },
  mashou: { ja:"ましょう", label:"let's (ましょう)", noQ:true },
};
const PAST = new Set(["mashita","masendeshita"]);
const ADD = {
  time:  [bw("今日","きょう","today"), bw("明日","あした","tomorrow"), bw("昨日","きのう","yesterday")],
  means: [bw("電車で","でんしゃ で","by train"), bw("バスで","バス で","by bus"), bw("タクシーで","タクシー で","by taxi"), bw("歩いて","あるいて","on foot")],
  qty:   [bw("一つ","ひとつ","one"), bw("二つ","ふたつ","two"), bw("三つ","みっつ","three")],
  how:   [bw("とても","とても","very"), bw("ちょっと","ちょっと","a bit")],
};
const BT = (ja, kana, g) => ({ ja, kana: kana || ja, g: g || "w" });   // g: w word, p particle, v verb, x fixed
const BP = (ja, kana) => BT(ja, kana, "p");

function enVerb(v, form, q, rest, time){
  const b=v.en, r=rest?" "+rest:"", t=time?" "+time.en:"";
  const fut = time && time.kana==="あした";
  if(form==="masenka") return `Shall we ${b}${r}${t}?`;
  if(form==="mashou") return q ? `Shall we ${b}${r}${t}?` : `Let's ${b}${r}${t}.`;
  if(q) return { masu:`Do you ${b}${r}${t}?`, masen:`Don't you ${b}${r}${t}?`, mashita:`Did you ${b}${r}${t}?`, masendeshita:`Didn't you ${b}${r}${t}?`, tai:`Do you want to ${b}${r}${t}?` }[form];
  return { masu: fut?`I'll ${b}${r}${t}.`:`I ${b}${r}${t}.`, masen: fut?`I won't ${b}${r}${t}.`:`I don't ${b}${r}${t}.`, mashita:`I ${v.past}${r}${t}.`, masendeshita:`I didn't ${b}${r}${t}.`, tai:`I want to ${b}${r}${t}.` }[form];
}
const vtok = (v, form) => BT(v.ja+VFORMS[form].ja, v.kana+VFORMS[form].ja.replace("たいです","たい です"), "v");
const qtok = q => q ? [BP("か")] : [];
const timeTok = c => c.add.time!=null ? [BT(ADD.time[c.add.time].ja+"、", ADD.time[c.add.time].kana+"、")] : [];

// Frame: id, title, pattern, why, slots {name: wordlist}, verbs?, forms?, q (true = toggle, "always"), adds [time, means, mo, dake, qty, how, sumimasen]
const FRAMES = [
 { id:"go", title:"Going somewhere", pattern:"[place] に 行きます", why:"に marks where you're going. で marks how (電車で = by train). The verb ending carries the meaning: ます do, ません don't, ました did, たいです want to, ませんか shall we?, ましょう let's. Add か to ask.",
   slots:{ place:"place" }, verbs:["go","come","back"], forms:["masu","masen","mashita","masendeshita","tai","masenka","mashou"], q:true, adds:["time","means","mo"],
   make(c){ const pl=BW.place[c.n.place], v=BV[c.v], m=c.add.means!=null?ADD.means[c.add.means]:null;
     const toks=[...timeTok(c), ...(m?[BT(m.ja.replace(/で$/,""), m.kana.replace(/ で$/,"")), ...(m.ja.endsWith("で")?[BP("で")]:[])]:[]), BT(pl.ja,pl.kana), BP(c.add.mo?"にも":"に", c.add.mo?"に も":"に"), vtok(v,c.form), ...qtok(c.q)];
     const rest=`to ${pl.en}${c.add.mo?" too":""}${m?" "+m.en:""}`; return { toks, en: enVerb(v,c.form,c.q,rest,c.add.time!=null?ADD.time[c.add.time]:null) }; } },
 { id:"eat", title:"Eating", pattern:"[food] を 食べます", why:"を marks the thing you act on. Swap を for も to say \"too\" (ラーメンも食べます).",
   slots:{ food:"food" }, verbs:["eat"], forms:["masu","masen","mashita","masendeshita","tai","masenka","mashou"], q:true, adds:["time","mo"],
   make(c){ const f=BW.food[c.n.food], v=BV.eat; const toks=[...timeTok(c), BT(f.ja,f.kana), BP(c.add.mo?"も":"を"), vtok(v,c.form), ...qtok(c.q)];
     return { toks, en: enVerb(v,c.form,c.q,f.en+(c.add.mo?" too":""),c.add.time!=null?ADD.time[c.add.time]:null) }; } },
 { id:"drink", title:"Drinking", pattern:"[drink] を 飲みます", why:"Same pattern as eating: thing + を + verb. 飲みます = drink.",
   slots:{ drink:"drink" }, verbs:["drink"], forms:["masu","masen","mashita","masendeshita","tai","masenka","mashou"], q:true, adds:["time","mo"],
   make(c){ const d=BW.drink[c.n.drink], v=BV.drink; const toks=[...timeTok(c), BT(d.ja,d.kana), BP(c.add.mo?"も":"を"), vtok(v,c.form), ...qtok(c.q)];
     return { toks, en: enVerb(v,c.form,c.q,d.en+(c.add.mo?" too":""),c.add.time!=null?ADD.time[c.add.time]:null) }; } },
 { id:"buy", title:"Buying", pattern:"[thing] を 買います", why:"Thing + を + 買います (buy). Works for anything you buy.",
   slots:{ buy:"buy" }, verbs:["buy"], forms:["masu","masen","mashita","masendeshita","tai","mashou"], q:true, adds:["time","mo"],
   make(c){ const d=BW.buy[c.n.buy], v=BV.buy; const toks=[...timeTok(c), BT(d.ja,d.kana), BP(c.add.mo?"も":"を"), vtok(v,c.form), ...qtok(c.q)];
     return { toks, en: enVerb(v,c.form,c.q,d.en+(c.add.mo?" too":""),c.add.time!=null?ADD.time[c.add.time]:null) }; } },
 { id:"watch", title:"Watching", pattern:"[show] を 見ます", why:"見ます means see / watch. Thing + を + 見ます.",
   slots:{ media:"media" }, verbs:["watch"], forms:["masu","masen","mashita","masendeshita","tai","masenka","mashou"], q:true, adds:["time","mo"],
   make(c){ const d=BW.media[c.n.media], v=BV.watch; const toks=[...timeTok(c), BT(d.ja,d.kana), BP(c.add.mo?"も":"を"), vtok(v,c.form), ...qtok(c.q)];
     return { toks, en: enVerb(v,c.form,c.q,d.en+(c.add.mo?" too":""),c.add.time!=null?ADD.time[c.add.time]:null) }; } },
 { id:"give", title:"Asking for things", pattern:"[thing] を ください", why:"を ください = please give me. Put a count after the thing (二つ). だけ = only: これだけください = just this.",
   slots:{ give:"give" }, q:false, adds:["qty","dake","sumimasen"],
   make(c){ const g=BW.give[c.n.give], qy=c.add.qty!=null?ADD.qty[c.add.qty]:null;
     const toks=[...(c.add.sumimasen?[BT("すみません、")]:[]), BT(g.ja,g.kana), ...(c.add.dake?[BP("だけ")]:[BP("を")]), ...(qy?[BT(qy.ja,qy.kana)]:[]), BT("ください","ください","x")];
     return { toks, en: cap(`${c.add.sumimasen?"Excuse me, ":""}${c.add.dake?"Just "+g.en:(qy?qy.en+(g.ja==="これ"||g.ja==="それ"?" of "+(g.ja==="これ"?"these":"those"):" "+g.en):g.en)}, please.`) }; } },
 { id:"have", title:"Is there… / Do you have…", pattern:"[thing] は あります か", why:"あります = there is (for things). ありません = there isn't. は marks the topic; も = also.",
   slots:{ have:"have" }, forms:["arimasu","arimasen"], q:true, adds:["mo","sumimasen"],
   make(c){ const h=BW.have[c.n.have]; const v=c.form==="arimasen"?"ありません":"あります";
     const toks=[...(c.add.sumimasen?[BT("すみません、")]:[]), BT(h.ja,h.kana), BP(c.add.mo?"も":"は"), BT(v,v,"v"), ...qtok(c.q)];
     const too=c.add.mo?" too":""; const ex=c.add.sumimasen?"Excuse me, ":"";
     const en = c.q ? (c.form==="arimasen"?`${ex}Don't you have ${h.en}${too}?`:`${ex}Do you have ${h.en}${too}?`) : (c.form==="arimasen"?`${ex}There's no ${h.en}${too}.`:`${ex}There's ${h.en}${too}.`);
     return { toks, en }; } },
 { id:"where", title:"Where is…?", pattern:"[place] は どこ です か", why:"は marks what you're asking about, どこ = where, ですか turns it into a polite question.",
   slots:{ where:"where" }, q:"always", adds:["sumimasen"],
   make(c){ const p=BW.where[c.n.where]; return { toks:[...(c.add.sumimasen?[BT("すみません、")]:[]), BT(p.ja,p.kana), BP("は"), BT("どこ"), BT("です","です","v"), BP("か")], en:`${c.add.sumimasen?"Excuse me, where":"Where"} is ${p.en}?` }; } },
 { id:"contains", title:"Is there … in this?", pattern:"これ に [food] が 入っています か", why:"に = in, が marks the thing inside, 入っています = is contained. 入っていません = isn't. も = also.",
   slots:{ food:"food" }, forms:["is","isnt"], q:true, adds:["mo"],
   make(c){ const f=BW.food[c.n.food]; const v=c.form==="isnt"?"入っていません":"入っています", vk=c.form==="isnt"?"はいって いません":"はいって います";
     const toks=[BT("これ"), BP("に"), BT(f.ja,f.kana), BP(c.add.mo?"も":"が"), BT(v,vk,"v"), ...qtok(c.q)];
     const too=c.add.mo?" too":"";
     const en=c.q?(c.form==="isnt"?`Isn't there ${f.en} in this${too}?`:`Is there ${f.en} in this${too}?`):(c.form==="isnt"?`There's no ${f.en} in this${too}.`:`There's ${f.en} in this${too}.`);
     return { toks, en }; } },
 { id:"like", title:"Liking things", pattern:"[thing] が 好きです", why:"が marks what you like. 好きじゃないです = don't like, 大好きです = love. も = also.",
   slots:{ like:"like" }, forms:["suki","sukijanai","daisuki"], q:true, adds:["mo","how"],
   make(c){ const l=BW.like[c.n.like]; const how=c.add.how!=null&&c.form!=="daisuki"?ADD.how[c.add.how]:null;
     const v={suki:["好きです","すき です"], sukijanai:["好きじゃないです","すき じゃ ない です"], daisuki:["大好きです","だいすき です"]}[c.form];
     const toks=[BT(l.ja,l.kana), BP(c.add.mo?"も":"が"), ...(how?[BT(how.ja,how.kana)]:[]), BT(v[0],v[1],"v"), ...qtok(c.q)];
     const too=c.add.mo?" too":""; const hw=how?(how.kana==="とても"?" a lot":" a bit"):"";
     const en=c.q?{suki:`Do you like ${l.en}${too}${hw}?`, sukijanai:`Don't you like ${l.en}${too}?`, daisuki:`Do you love ${l.en}${too}?`}[c.form]
       :{suki:`I like ${l.en}${too}${hw}.`, sukijanai:`I don't like ${l.en}${too}.`, daisuki:`I love ${l.en}${too}.`}[c.form];
     return { toks, en }; } },
 { id:"price", title:"How much?", pattern:"[thing] は いくら です か", why:"いくら = how much (money). は marks what you're asking about.",
   slots:{ price:"price" }, q:"always", adds:["sumimasen"],
   make(c){ const p=BW.price[c.n.price]; return { toks:[...(c.add.sumimasen?[BT("すみません、")]:[]), BT(p.ja,p.kana), BP("は"), BT("いくら"), BT("です","です","v"), BP("か")], en:`${c.add.sumimasen?"Excuse me, how":"How"} much is ${p.en}?` }; } },
 { id:"opens", title:"Opening times", pattern:"[place] は 何時に 開きます か", why:"何時に = at what time. 開きます = opens, 閉まります = closes.",
   slots:{ shop:"shop" }, verbs:["open","close"], q:"always", adds:["time"], timeOnly:[0,1],
   make(c){ const s=BW.shop[c.n.shop], v=BV[c.v]; const tm=c.add.time!=null?ADD.time[c.add.time]:null;
     const toks=[...timeTok(c), BT(s.ja,s.kana), BP("は"), BT("何時","なんじ"), BP("に"), BT(v.ja+"ます",v.kana+"ます","v"), BP("か")];
     return { toks, en:`What time does ${s.en} ${v.en}${tm?" "+tm.en:""}?` }; } },
 { id:"from", title:"Where you're from", pattern:"[country] から 来ました", why:"から = from. 来ました = came. Add か to ask someone else.",
   slots:{ country:"country" }, q:true, adds:[],
   make(c){ const k=BW.country[c.n.country]; return { toks:[BT(k.ja,k.kana), BP("から"), BT("来ました","きました","v"), ...qtok(c.q)], en: c.q?`Are you from ${k.en}?`:`I'm from ${k.en}.` }; } },
 { id:"may", title:"May I…?", pattern:"[action]て も いい です か", why:"Verb in て-form + もいいですか = may I…? The て-form is the verb's linking shape: 撮る → 撮って.",
   slots:{ act:"act" }, q:"always", adds:["sumimasen"],
   make(c){ const a=BW.act[c.n.act]; return { toks:[...(c.add.sumimasen?[BT("すみません、")]:[]), BT(a.ja,a.kana,"v"), BP("も"), BT("いい"), BT("です","です","v"), BP("か")], en:`${c.add.sumimasen?"Excuse me, may":"May"} I ${a.en}?` }; } },
 { id:"adj", title:"Describing things", pattern:"[this] は [adjective] です", why:"い-adjectives change their own ending: 高い → 高くない (not) → 高かった (was) → 高くなかった (wasn't). とても = very, ちょっと = a bit.",
   slots:{ adjsubj:"adjsubj", adj:"adj" }, forms:["pres","neg","past","pastneg"], q:true, adds:["how"],
   make(c){ const s=BW.adjsubj[c.n.adjsubj], a=BW.adj[c.n.adj]; const how=c.add.how!=null?ADD.how[c.add.how]:null;
     const st=a.ja.slice(0,-1), sk=a.kana.slice(0,-1);
     const v={pres:[a.ja+"です",a.kana+" です"], neg:[st+"くないです",sk+"く ない です"], past:[st+"かったです",sk+"かった です"], pastneg:[st+"くなかったです",sk+"く なかった です"]}[c.form];
     const toks=[BT(s.ja,s.kana), BP("は"), ...(how?[BT(how.ja,how.kana)]:[]), BT(v[0],v[1],"v"), ...qtok(c.q)];
     const ad=(how?how.en+" ":"")+a.en, S=cap(s.en);
     const en=c.q?{pres:`Is ${s.en} ${ad}?`, neg:`Isn't ${s.en} ${ad}?`, past:`Was ${s.en} ${ad}?`, pastneg:`Wasn't ${s.en} ${ad}?`}[c.form]
       :{pres:`${S} is ${ad}.`, neg:`${S} isn't ${ad}.`, past:`${S} was ${ad}.`, pastneg:`${S} wasn't ${ad}.`}[c.form];
     return { toks, en }; } },
];
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
const FORM_LABEL = Object.assign({}, Object.fromEntries(Object.entries(VFORMS).map(([k,v])=>[k,v.label])),
  { arimasu:"there is (あります)", arimasen:"there isn't (ありません)", is:"is in it", isnt:"isn't in it", suki:"like (好き)", sukijanai:"don't like (好きじゃない)", daisuki:"love (大好き)",
    pres:"is (〜いです)", neg:"isn't (〜くない)", past:"was (〜かった)", pastneg:"wasn't (〜くなかった)" });
const ADD_LABEL = { time:"time", means:"how", mo:"も also", dake:"だけ only", qty:"how many", how:"how much", sumimasen:"すみません" };

// choices
function blankChoice(f){
  const c={ n:{}, v: f.verbs?f.verbs[0]:null, form: f.forms?f.forms[0]:null, q: f.q==="always", add:{ time:null, means:null, qty:null, how:null, mo:false, dake:false, sumimasen:false } };
  Object.keys(f.slots).forEach(s=>c.n[s]=0); return c;
}
function normalize(f, c){
  if(c.add.time!=null && f.forms && f.forms.includes("mashita")){
    const t=ADD.time[c.add.time].kana;
    if(t==="きのう" && !PAST.has(c.form)) c.form = c.form==="masen"?"masendeshita":"mashita";
    if(t==="あした" && PAST.has(c.form)) c.form = c.form==="masendeshita"?"masen":"masu";
  }
  if(f.timeOnly && c.add.time!=null && !f.timeOnly.includes(c.add.time)) c.add.time=null;
  if(c.form==="masen" && c.q){ c.form="masenka"; c.q=false; }   // ませんか is an invitation, so treat it as "shall we?"
  if(c.form && VFORMS[c.form] && VFORMS[c.form].noQ) c.q=false;
  if(f.id==="adj"){ const ok=BW.adjsubj[c.n.adjsubj].ok; if(!ok.includes(c.n.adj)) c.n.adj=ok[0]; }
  if(f.q==="always") c.q=true;
  if(f.q===false) c.q=false;
  if(c.add.dake) c.add.qty=null;
  if(c.form==="daisuki") c.add.how=null;
  return c;
}
function randChoice(f){
  const c=blankChoice(f);
  Object.entries(f.slots).forEach(([s,list])=>c.n[s]=Math.random()*BW[list].length|0);
  if(f.verbs) c.v=f.verbs[Math.random()*f.verbs.length|0];
  if(f.forms) c.form=Math.random()<0.5?f.forms[0]:f.forms[Math.random()*f.forms.length|0];
  if(f.q===true) c.q=Math.random()<0.35;
  return normalize(f,c);
}
const clone = c => JSON.parse(JSON.stringify(c));
function sentence(f, c){
  const r=f.make(c);
  const ja=r.toks.map(t=>t.ja).join(""), kana=r.toks.map(t=>t.kana).join(" ").replace(/\s+/g," ").replace(/ (?=[、。])/g,"");
  return { ja: ja.replace(/、$/,""), kana, en:r.en, toks:r.toks };
}
// one random change, described in plain words (what the swap drill says)
function mutate(f, c){
  const opts=[];
  Object.entries(f.slots).forEach(([s,list])=>{ if(BW[list].length>1) opts.push("slot:"+s); });
  if(f.verbs && f.verbs.length>1) opts.push("verb");
  if(f.forms && f.forms.length>1) opts.push("form","form");
  if(f.q===true && !(c.form && VFORMS[c.form] && VFORMS[c.form].noQ)) opts.push("q");
  (f.adds||[]).forEach(a=>opts.push("add:"+a));
  const pick=opts[Math.random()*opts.length|0], n=clone(c);
  if(pick.startsWith("slot:")){ const s=pick.slice(5), L=BW[f.slots[s]].length; let i; do{ i=Math.random()*L|0; }while(i===c.n[s]); n.n[s]=i; }
  else if(pick==="verb"){ let v; do{ v=f.verbs[Math.random()*f.verbs.length|0]; }while(v===c.v); n.v=v; }
  else if(pick==="form"){ let fm; do{ fm=f.forms[Math.random()*f.forms.length|0]; }while(fm===c.form); n.form=fm; }
  else if(pick==="q"){ n.q=!c.q; }
  else { const a=pick.slice(4);
    if(["mo","dake","sumimasen"].includes(a)) n.add[a]=!c.add[a];
    else { const L=ADD[a].length; const cur=c.add[a]; let i; if(cur!=null && Math.random()<0.35) i=null; else { do{ i=Math.random()*L|0; }while(i===cur); } n.add[a]=i; } }
  normalize(f,n);
  return n;
}
function describeDiff(f, a, b){
  const out=[];
  Object.entries(f.slots).forEach(([s,list])=>{ if(a.n[s]!==b.n[s]) out.push(BW[list][b.n[s]].en); });
  if(a.v!==b.v) out.push(BV[b.v].en);
  if(a.form!==b.form) out.push(FORM_LABEL[b.form].replace(/ \(.*\)/,""));
  if(a.q!==b.q) out.push(b.q?"as a question":"as a statement");
  Object.keys(ADD_LABEL).forEach(k=>{ if(a.add[k]!==b.add[k]){
    if(typeof b.add[k]==="boolean") out.push((b.add[k]?"add ":"drop ")+({mo:"also (も)",dake:"only (だけ)",sumimasen:"excuse me"}[k]));
    else out.push(b.add[k]==null?"drop "+ADD[k][a.add[k]].en:ADD[k][b.add[k]].en); } });
  return out.join(", ");
}

// ───────── Build tab ─────────
let bz=null;           // running tiles / pick game
let freeF=null, freeC=null;
function renderBuild(){
  if(bz) return renderBz();
  if(freeF) return renderFree();
  $("#app").innerHTML=`
    <h1>Build</h1>
    <p class="sub">Make your own sentences. Every frame below is a pattern you can bend: swap words, change the verb, ask instead of tell.</p>
    <h2>Practice</h2>
    <div class="card" style="padding:4px 16px">
      ${[["swap","🎧 Swap drill","Audio: change one or two things, say it, hear it"],["tiles","🧩 Tile builder","Put the blocks and particles in order"],["pick","☑️ Pick the right one","Spot the version that matches"],["free","✏️ Free play","Build anything and hear it"]]
        .map(([k,t,s])=>`<div class="phrase" data-bm="${k}"><div class="t"><div style="font-weight:600">${t}</div><div class="en">${s} · all frames mixed</div></div><span class="sub">›</span></div>`).join("")}
    </div>
    <h2>Frames</h2>
    <div class="card" style="padding:4px 16px">
      ${FRAMES.map(f=>`<div class="phrase" data-bf="${f.id}"><div class="t"><div style="font-weight:600">${esc(f.title)}</div><div class="jp" style="font-size:15px">${esc(f.pattern)}</div></div><span class="sub">›</span></div>`).join("")}
    </div>`;
  document.querySelectorAll("[data-bm]").forEach(b=>b.onclick=()=>startBuildMode(b.dataset.bm, null));
  document.querySelectorAll("[data-bf]").forEach(b=>b.onclick=()=>{ bFrame=FRAMES.find(f=>f.id===b.dataset.bf); renderFrameMenu(); });
}
let bFrame=null;
function renderFrameMenu(){
  const f=bFrame; const ex=sentence(f, normalize(f, blankChoice(f)));
  $("#app").innerHTML=`
    <button class="chip" id="bback" style="margin-top:6px">← Build</button>
    <h1 style="font-size:24px">${esc(f.title)}</h1>
    <div class="card"><div class="jp" style="font-size:20px">${esc(f.pattern)}</div><p style="margin:8px 0 0">${esc(f.why)}</p>
      <div class="hint"><small>Example</small><span class="jp">${esc(ex.ja)}</span><div class="sub" style="font-size:14px">${esc(ex.en)}</div></div>
      <button class="play" data-sayt="${esc(ex.ja)}" style="margin-top:8px">▶ Play</button></div>
    <div class="stack" style="margin-top:14px">
      <button class="btn" data-bm="swap">🎧 Swap drill</button>
      <button class="btn ghost" data-bm="tiles">🧩 Tile builder</button>
      <button class="btn ghost" data-bm="pick">☑️ Pick the right one</button>
      <button class="btn ghost" data-bm="free">✏️ Free play</button></div>`;
  $("#bback").onclick=()=>{ bFrame=null; render(); };
  document.querySelectorAll("[data-bm]").forEach(b=>b.onclick=()=>startBuildMode(b.dataset.bm, f));
}
const pickFrame = f => f || FRAMES[Math.random()*FRAMES.length|0];
function startBuildMode(mode, f){
  if(mode==="free"){ freeF=f||FRAMES[0]; freeC=normalize(freeF, blankChoice(freeF)); render(); return; }
  if(mode==="swap"){ startLesson({ id:"swap", title: f?"Swap drill: "+f.title:"Swap drill", sub:"", frame:f, steps: swapSteps(f) }); tab="listen"; render(); return; }
  const items=[]; for(let i=0;i<8;i++){ const fr=pickFrame(f); items.push({ f:fr, c:randChoice(fr) }); }
  bz={ mode, items, i:0, right:0, st:null, frame:f }; render();
}
function swapSteps(f){
  const steps=[]; let fr=pickFrame(f), c=randChoice(fr);
  for(let round=0; round<(f?1:3); round++){
    if(round>0){ fr=pickFrame(null); c=randChoice(fr); }
    const s0=sentence(fr,c);
    steps.push({ t:"swapbase", it:{ ja:s0.ja, kana:s0.kana, en:s0.en }, why:fr.why, _lid:"swap" });
    const n = f ? 8 : 3;
    for(let i=0;i<n;i++){
      let nc=mutate(fr,c); if(i>=Math.ceil(n/2)) nc=mutate(fr,nc);   // later swaps change two things at once
      const cue=describeDiff(fr,c,nc); if(!cue){ i--; continue; }
      const s=sentence(fr,nc); steps.push({ t:"swap", cue, it:{ ja:s.ja, kana:s.kana, en:s.en }, _lid:"swap" }); c=nc;
    }
  }
  return steps;
}
// variants for "pick the right one": wrong particle, other verb form, toggled question
function variants(f, c, right){
  const out=new Map(); out.set(right.ja, right);
  const parts=["に","を","が","で","は","から"];
  for(let tries=0; tries<40 && out.size<4; tries++){
    const r=Math.random(); let s=null;
    if(r<0.45){ const toks=sentence(f,c).toks.map(t=>Object.assign({},t)); const idx=toks.map((t,i)=>t.g==="p"&&parts.includes(t.ja)?i:-1).filter(i=>i>=0);
      if(idx.length){ const i=idx[Math.random()*idx.length|0]; const alt=parts.filter(p=>p!==toks[i].ja); toks[i].ja=toks[i].kana=alt[Math.random()*alt.length|0];
        s={ ja: toks.map(t=>t.ja).join("").replace(/、$/,""), kana: toks.map(t=>t.kana).join(" ") }; } }
    else { const nc=mutate(f,c); const t=sentence(f,nc); if(t.en!==right.en) s=t; }
    if(s && !out.has(s.ja)) out.set(s.ja, s);
  }
  return shuffle([...out.values()]);
}
function tilesFor(f, c, s){
  const toks=s.toks.map((t,i)=>({ id:"t"+i, ja:t.ja.replace(/、$/,""), kana:t.kana.replace(/、$/,""), g:t.g })).filter(t=>t.ja);
  const extra=[]; const ps=["に","を","が","で","は","も"].filter(p=>!toks.some(t=>t.ja===p));
  if(toks.some(t=>t.g==="p") && ps.length) extra.push({ id:"d0", ja:ps[Math.random()*ps.length|0], g:"p" });
  const nc=mutate(f,c), alt=sentence(f,nc).toks.find(t=>t.g==="v" && !toks.some(x=>x.ja===t.ja));
  if(alt) extra.push({ id:"d1", ja:alt.ja, kana:alt.kana, g:"v" });
  return { need: toks, tiles: shuffle(toks.concat(extra)) };
}
function renderBz(){
  const z=bz; if(z.i>=z.items.length) return renderBzDone();
  const it=z.items[z.i], s=sentence(it.f,it.c);
  if(!z.st){ z.st = z.mode==="tiles" ? Object.assign(tilesFor(it.f,it.c,s), { picked:[], done:false }) : { opts: variants(it.f,it.c,s), picked:null }; }
  const st=z.st; let body="", done=false, ok=false;
  if(z.mode==="tiles"){
    done=st.done; const built=st.picked.map(id=>st.tiles.find(t=>t.id===id).ja).join(""); ok=done && built===s.ja.replace(/、/g,"");
    body=`<div class="prompt">${esc(s.en)}</div>
      <div class="card jp" style="min-height:64px;font-size:22px;margin-top:10px;${done?(ok?"border-color:var(--good)":"border-color:var(--bad)"):""}">${st.picked.map(id=>`<span class="w">${esc(st.tiles.find(t=>t.id===id).ja)}</span>`).join(" ")||'<span class="sub" style="font-size:15px">Tap the blocks in order</span>'}</div>
      ${done?"":`<div class="row" style="flex-wrap:wrap;gap:8px;margin-top:12px">${st.tiles.map(t=>`<button class="opt jp" data-bt2="${t.id}" style="width:auto;padding:10px 14px;font-size:19px;${t.g==="p"?"color:var(--ok)":""}" ${st.picked.includes(t.id)?"disabled":""}>${esc(t.ja)}</button>`).join("")}</div>
        <div class="row" style="gap:8px;margin-top:12px"><button class="btn ghost" id="bundo" style="flex:1" ${st.picked.length?"":"disabled"}>Undo</button><button class="btn" id="bcheck" style="flex:1" ${st.picked.length?"":"disabled"}>Check</button></div>`}`;
  } else {
    done=st.picked!==null; ok=done && st.picked===s.ja;
    body=`<div class="prompt">${esc(s.en)}</div><p class="sub">Which one says that?</p>
      <div class="opts">${st.opts.map(o=>`<button class="opt jp ${done&&o.ja===s.ja?"right":""} ${done&&st.picked===o.ja&&o.ja!==s.ja?"wrong":""}" data-bo="${esc(o.ja)}" ${done?"disabled":""} style="font-size:18px">${esc(o.ja)}${S.set.romaji?`<div class="romaji" style="font-size:12px">${esc(romaji(o.kana||o.ja))}</div>`:""}</button>`).join("")}</div>`;
  }
  $("#app").innerHTML=`
    <div class="top"><button class="x" id="bq">✕</button><div class="bar"><i style="width:${z.i/z.items.length*100}%"></i></div><span class="sub">${z.i+1}/${z.items.length}</span></div>
    <span class="tag">${z.mode==="tiles"?"Tile builder":"Pick the right one"} · ${esc(it.f.title)}</span>
    ${body}
    ${done?`<div class="verdict ${ok?"good":"bad"}">${ok?"Correct.":"Not quite."}</div>
      <div class="card" style="margin-top:10px"><div class="row between"><div><div class="jp chipline" style="font-size:22px">${s.toks.map(t=>`<span class="w" ${LEX[t.kana]?`data-w="${esc(t.kana)}"`:""} style="${t.g==="p"?"color:var(--ok)":""}">${esc(t.ja.replace(/、$/,""))}</span>`).join("")}</div><div class="romaji">${esc(romaji(s.kana))}</div></div><button class="play" data-sayt="${esc(s.ja)}">▶</button></div>
        <div class="hint"><small>Why</small>${esc(it.f.why)}</div></div>
      <div style="margin-top:14px"><button class="btn" id="bnext">Next</button></div>`:""}`;
  $("#bq").onclick=()=>{ bz=null; render(); };
  document.querySelectorAll("[data-bt2]").forEach(b=>b.onclick=()=>{ st.picked.push(b.dataset.bt2); renderBz(); });
  if($("#bundo")) $("#bundo").onclick=()=>{ st.picked.pop(); renderBz(); };
  if($("#bcheck")) $("#bcheck").onclick=()=>{ st.done=true; const built=st.picked.map(id=>st.tiles.find(t=>t.id===id).ja).join(""); if(built===s.ja.replace(/、/g,"")) z.right++; renderBz(); say(s.ja); };
  document.querySelectorAll("[data-bo]").forEach(b=>b.onclick=()=>{ st.picked=b.dataset.bo; if(st.picked===s.ja) z.right++; renderBz(); say(s.ja); });
  if($("#bnext")) $("#bnext").onclick=()=>{ z.i++; z.st=null; renderBz(); };
  window.scrollTo(0,0);
}
function renderBzDone(){
  const z=bz;
  $("#app").innerHTML=`<h1>Done</h1><div class="card"><div style="font-size:40px;font-weight:700">${z.right}/${z.items.length}</div><div class="sub">${z.mode==="tiles"?"Tile builder":"Pick the right one"}${z.frame?" · "+esc(z.frame.title):" · mixed frames"}</div></div>
    <div class="stack" style="margin-top:16px"><button class="btn" id="bagain">Another round</button><button class="btn ghost" id="bhome">Back to Build</button></div>`;
  $("#bagain").onclick=()=>startBuildMode(z.mode, z.frame);
  $("#bhome").onclick=()=>{ bz=null; render(); };
}
function renderFree(){
  const f=freeF, c=normalize(f, freeC), s=sentence(f,c);
  const chipsRow=(label, items, isOn, attr)=>`<div class="sec" style="margin:14px 0 6px">${label}</div><div class="chips">${items.map((it,i)=>`<button class="chip ${isOn(i)?"on":""}" ${attr}="${i}">${esc(it)}</button>`).join("")}</div>`;
  let ctl="";
  const adjOk = f.id==="adj" ? BW.adjsubj[c.n.adjsubj].ok : null;
  Object.entries(f.slots).forEach(([sl,list])=>{ if(list==="adj"){ ctl+=`<div class="sec" style="margin:14px 0 6px">adjective</div><div class="chips">${BW.adj.map((x,i)=>`<button class="chip ${c.n.adj===i?"on":""}" data-fs-adj="${i}" ${adjOk.includes(i)?"":"disabled style='opacity:.35'"}>${esc(x.ja+" · "+x.en)}</button>`).join("")}</div>`; return; }
    ctl+=chipsRow(list==="adjsubj"?"subject":list==="adj"?"adjective":list, BW[list].map(x=>x.ja+" · "+x.en), i=>c.n[sl]===i, `data-fs-${sl}`); });
  if(f.verbs && f.verbs.length>1) ctl+=chipsRow("verb", f.verbs.map(v=>BV[v].ja+"ます · "+BV[v].en), i=>c.v===f.verbs[i], "data-fv");
  if(f.forms) ctl+=chipsRow("form", f.forms.map(x=>FORM_LABEL[x]), i=>c.form===f.forms[i], "data-ff");
  if(f.q===true) ctl+=chipsRow("type", ["Statement","Question (か)"], i=>c.q===(i===1), "data-fq");
  (f.adds||[]).forEach(a=>{
    if(["mo","dake","sumimasen"].includes(a)) ctl+=chipsRow(ADD_LABEL[a], ["off","on"], i=>c.add[a]===(i===1), `data-fa-${a}`);
    else ctl+=chipsRow(ADD_LABEL[a], ["none"].concat(ADD[a].map(x=>x.ja.replace(/、$/,"")+" · "+x.en)), i=>(c.add[a]==null?0:c.add[a]+1)===i, `data-fa-${a}`);
  });
  $("#app").innerHTML=`
    <button class="chip" id="fback" style="margin-top:6px">← Build</button>
    <div class="row between"><h1 style="font-size:24px">Free play</h1>
      <select id="fframe" style="width:auto">${FRAMES.map(x=>`<option value="${x.id}" ${x.id===f.id?"selected":""}>${esc(x.title)}</option>`).join("")}</select></div>
    <div class="card" style="position:sticky;top:0;z-index:2">
      <div class="jp chipline" style="font-size:24px">${s.toks.map(t=>`<span class="w" ${LEX[t.kana]?`data-w="${esc(t.kana)}"`:""} style="${t.g==="p"?"color:var(--ok)":""}">${esc(t.ja.replace(/、$/,""))}</span>`).join("")}</div>
      <div class="romaji">${esc(romaji(s.kana))}</div>
      <div style="font-weight:600;margin-top:4px">${esc(s.en)}</div>
      <div class="row" style="gap:8px;margin-top:10px"><button class="play" data-sayt="${esc(s.ja)}">▶ Play</button><button class="play" data-sayslow="${esc(s.ja)}">🐢 Slow</button><button class="play" id="fsave">＋ Save card</button></div>
      ${freeMsg?`<p class="note" style="color:var(--good);margin-top:6px">${esc(freeMsg)}</p>`:""}
    </div>
    <p class="note">${esc(f.why)}</p>
    ${ctl}`;
  $("#fback").onclick=()=>{ freeF=null; freeMsg=""; render(); };
  $("#fframe").onchange=e=>{ freeF=FRAMES.find(x=>x.id===e.target.value); freeC=normalize(freeF, blankChoice(freeF)); freeMsg=""; render(); };
  Object.keys(f.slots).forEach(sl=>document.querySelectorAll(`[data-fs-${sl}]`).forEach(b=>b.onclick=()=>{ c.n[sl]=+b.getAttribute(`data-fs-${sl}`); freeMsg=""; renderFree(); }));
  document.querySelectorAll("[data-fv]").forEach(b=>b.onclick=()=>{ c.v=f.verbs[+b.dataset.fv]; freeMsg=""; renderFree(); });
  document.querySelectorAll("[data-ff]").forEach(b=>b.onclick=()=>{ c.form=f.forms[+b.dataset.ff];
    if(c.add.time!=null){ const t=ADD.time[c.add.time].kana; if((t==="きのう"&&!PAST.has(c.form))||(t==="あした"&&PAST.has(c.form))) c.add.time=null; }
    freeMsg=""; renderFree(); });
  document.querySelectorAll("[data-fq]").forEach(b=>b.onclick=()=>{ c.q=b.dataset.fq==="1"; freeMsg=""; renderFree(); });
  (f.adds||[]).forEach(a=>document.querySelectorAll(`[data-fa-${a}]`).forEach(b=>b.onclick=()=>{ const i=+b.getAttribute(`data-fa-${a}`);
    if(["mo","dake","sumimasen"].includes(a)) c.add[a]=i===1; else c.add[a]= i===0?null:i-1; freeMsg=""; renderFree(); }));
  $("#fsave").onclick=()=>{ if(S.mine.some(m=>m.ja===s.ja)){ freeMsg="Already in My cards."; return renderFree(); }
    S.mine.push({ id:"m"+Date.now(), pack:"mine", kind:"say", en:s.en, ja:s.ja, kana:s.kana }); save(); freeMsg="Saved to My cards. It shows up in Text drills."; renderFree(); };
}
let freeMsg="";
// test hook: ids of the correct tiles in order (used by automated tests only)
function tilesNeed(){ if(!bz||!bz.st) return []; return bz.st.need.map(t=>t.id); }
