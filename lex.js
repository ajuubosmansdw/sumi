// Word lexicon: kana token (as spaced in cards.js) → written form, type, meaning, note.
// type: w = word, x = set expression, n = name/place, g = grammar/particle
const LEX_RAW = `
はじめまして|はじめまして|x|nice to meet you|Only used the first time you meet someone.
アユーブ|アユーブ|n|Ajuub (your name)|Foreign names are written in katakana.
です|です|g|is / am / are (polite)|Ends most polite sentences. Often sounds like "des".
でした|でした|g|was (polite)|Past form of です.
オランダ|オランダ|n|the Netherlands|From Portuguese "Holanda".
から|から|g|from|Comes after the starting point: オランダから = from the Netherlands.
きました|来ました|w|came|Past polite of 来る (kuru, to come).
きます|来ます|w|come(s)|Polite form of 来る (kuru, to come).
きた|来た|w|came (casual)|Plain past of 来る (kuru).
にじゅうに|二十二|w|twenty-two|二十 (20) + 二 (2).
にじゅうさん|二十三|w|twenty-three|二十 (20) + 三 (3).
さい|歳|w|years old (counter)|Number + 歳. Note: 20 is はたち.
にほんご|日本語|w|Japanese (language)|日本 (Japan) + 語 (language).
にほん|日本|w|Japan|Literally "sun origin".
にほんじん|日本人|w|Japanese person|日本 + 人 (person).
を|を|g|object marker|Marks what the action is done to. Pronounced "o".
にかげつ|二か月|w|two months|か月 (kagetsu) counts months of duration.
べんきょう|勉強|w|study|べんきょうする = to study.
して|して|g|doing (te-form of する)|する (to do) → して. して います = is doing.
います|います|g|is (doing) / there is (living thing)|After a te-form it means an ongoing action. Alone: a person/animal exists.
いません|いません|g|is not / am not (doing)|Negative of います.
いる|いる|g|is (doing), plain form|Plain form of います.
は|は|g|topic marker ("as for…")|Written は but pronounced "wa" as a particle.
まだ|まだ|w|still / not yet|
へた|下手|w|bad at, unskilled|Opposite of 上手 (じょうず).
がくせい|学生|w|student|
さんしゅうかん|三週間|w|three weeks|週間 = a span of weeks.
に|に|g|in / at / to (point)|Marks a place you're in, a time, or a destination.
すこし|少し|w|a little|
だけ|だけ|g|only, just|すこしだけ = only a little.
はなせます|話せます|w|can speak|Potential form of 話す (hanasu, to speak).
はなして|話して|w|talk (te-form)|From 話す (hanasu, to speak/talk).
よろしく|よろしく|x|(please) treat me well|Used with おねがいします when meeting or asking a favour.
おねがい|お願い|w|request, favour|おねがいします = please (when asking for something).
します|します|g|do (polite)|Polite form of する.
しません|しません|g|don't do|Negative of します. ～しませんか = "shall we…?"
されます|されます|g|(you) do (respectful)|Honorific form of する used by staff.
これ|これ|w|this (thing)|Near you. それ = that (near them), あれ = that over there.
ぶたにく|豚肉|w|pork|豚 (pig) + 肉 (meat).
が|が|g|subject marker|Points at the subject: 豚肉が = pork (is the thing that…).
はいって|入って|w|contained / entering (te-form)|From 入る (hairu, to enter). 入っています = is inside, contains.
か|か|g|question marker|Turns a sentence into a question, like a spoken "?".
おさけ|お酒|w|alcohol, sake|Means alcohol in general, not only Japanese sake.
なん|何|w|what|なん before d/t/n sounds (なんですか); なに otherwise.
なに|何|w|what|
の|の|g|of / 's|Links nouns: なんの肉 = meat of what (what kind of meat).
にく|肉|w|meat|
たべられません|食べられません|w|can't eat|Potential negative of 食べる (taberu, to eat).
とりにく|鶏肉|w|chicken (meat)|鶏/とり = chicken, bird.
ぎゅうにく|牛肉|w|beef|牛 (cow) + 肉 (meat).
さかな|魚|w|fish|
ください|ください|g|please (give me / do)|Noun + をください = please give me…
おすすめ|おすすめ|w|recommendation|
みず|水|w|water|Restaurants usually serve it free.
からい|辛い|w|spicy|Also "salty" in some contexts.
おかいけい|お会計|w|the bill, check|
ごちそうさま|ごちそうさま|x|thanks for the meal|Say it after eating. Before eating: いただきます.
なんめいさま|何名様|w|how many people (polite)|何 (what) + 名 (people counter) + 様 (honorific).
ひとり|一人|w|one person|Two people = ふたり (二人).
ごちゅうもん|ご注文|w|(your) order|ご makes it polite.
おきまり|お決まり|w|decided|From 決まる (kimaru, to be decided).
しょうしょう|少々|w|a little (polite)|Polite version of すこし.
おまち|お待ち|w|wait (polite)|From 待つ (matsu, to wait).
おのみもの|お飲み物|w|drink(s) (polite)|飲み物 = something to drink.
いかが|いかが|w|how about (polite)|Polite version of どう.
てんない|店内|w|inside the shop|店 (shop) + 内 (inside).
で|で|g|at / by / with|Place of action (店内で) or means (カードで, 英語で).
おめしあがり|お召し上がり|w|eating (very polite)|Honorific word for eating/drinking. Staff use it.
はい|はい|x|yes|
おもちかえり|お持ち帰り|w|take-away (polite)|
もちかえり|持ち帰り|w|take-away|持つ (hold) + 帰る (return home).
ふくろ|袋|w|bag|Plastic bags cost a few yen.
ごりよう|ご利用|w|use (polite)|ご利用ですか = will you use (one)?
だいじょうぶ|大丈夫|w|okay, fine / no thanks|だいじょうぶです politely declines: "I'm fine (without it)."
あたためます|温めます|w|heat up|Polite form of 温める (atatameru).
おはし|お箸|w|chopsticks|
おつけ|お付け|w|attach, include (polite)|From 付ける (tsukeru, to attach).
ポイントカード|ポイントカード|w|point card|Loyalty card. Usually just say you don't have one.
おもち|お持ち|w|have (polite)|From 持つ (motsu, to hold/have).
もって|持って|w|holding / having (te-form)|持っていません = I don't have (one).
おしはらい|お支払い|w|payment|
どう|どう|w|how|
カード|カード|w|card|
げんきん|現金|w|cash|
いくら|いくら|w|how much (price)|Compare いくつ = how many.
いくつ|いくつ|w|how many|Compare いくら = how much money.
あります|あります|g|there is / have (things)|For objects. For people and animals use います.
ごひゃく|五百|w|500|ひゃく = 100. Sound changes: さんびゃく, ろっぴゃく, はっぴゃく.
さんびゃく|三百|w|300|ひゃく becomes びゃく after さん.
ろっぴゃく|六百|w|600|ろく + ひゃく → ろっぴゃく.
はっぴゃく|八百|w|800|はち + ひゃく → はっぴゃく.
せん|千|w|1,000|
えん|円|w|yen|
いま|今|w|now|
なんじ|何時|w|what time|何 (what) + 時 (o'clock).
いちじ|一時|w|1 o'clock|
よじ|四時|w|4 o'clock|Not よんじ!
しちじ|七時|w|7 o'clock|Not なな じ.
はちじ|八時|w|8 o'clock|
くじ|九時|w|9 o'clock|Not きゅうじ!
じゅうじ|十時|w|10 o'clock|
はん|半|w|half (past)|十時半 = 10:30.
あきます|開きます|w|opens|From 開く (aku). Opposite: 閉まります.
しまります|閉まります|w|closes|From 閉まる (shimaru). Opposite: 開きます.
なんぷん|何分|w|how many minutes|分 is ふん or ぷん depending on the number before it.
ごふん|五分|w|5 minutes|
さんぷん|三分|w|3 minutes|
じゅっぷん|十分|w|10 minutes|
かかります|かかります|w|takes (time/money)|何分かかりますか = how long does it take?
ぐらい|ぐらい|g|about, around|五分ぐらい = about five minutes.
しぶや|渋谷|n|Shibuya|
えき|駅|w|station|
どこ|どこ|w|where|
この|この|w|this (+ noun)|この電車 = this train.
でんしゃ|電車|w|train|電 (electric) + 車 (vehicle).
きょうと|京都|n|Kyoto|
いきます|行きます|w|go(es)|Polite form of 行く (iku, to go).
いきました|行きました|w|went|Past polite of 行く.
いった|行った|w|went (casual)|Plain past of 行く.
いって|行って|w|go (te-form)|まっすぐ行ってください = please go straight.
なんばんせん|何番線|w|which platform|何 + 番 (number) + 線 (line).
さんばんせん|三番線|w|platform 3|
トイレ|トイレ|w|toilet|From English "toilet".
あるいて|歩いて|w|on foot / walking|From 歩く (aruku, to walk).
まっすぐ|まっすぐ|w|straight ahead|
みぎ|右|w|right|
ひだり|左|w|left|
まがって|曲がって|w|turn (te-form)|From 曲がる (magaru, to turn).
あそこ|あそこ|w|over there|ここ (here), そこ (there), あそこ (over there).
つぎ|次|w|next|
ドア|ドア|w|door|
ちかく|近く|w|near, nearby|駅の近く = near the station.
すみません|すみません|x|excuse me / sorry|Gets attention and apologises lightly.
もう|もう|w|more / already|もう一度 = once more; もう少し = a bit more.
いちど|一度|w|one time, once|
ゆっくり|ゆっくり|w|slowly|
わかりません|わかりません|w|don't understand|Negative of わかります.
わかります|わかります|w|understand|
えいご|英語|w|English (language)|
しゃしん|写真|w|photo|
とって|撮って|w|take (photo, te-form)|From 撮る (toru, to take a photo).
も|も|g|also / even|わたしも = me too. ～てもいいですか = may I…?
いい|いい|w|good, okay|
ちょっと|ちょっと|w|a little, a moment|Also a soft way to say "not really / that's difficult".
まって|待って|w|wait (te-form)|From 待つ (matsu, to wait).
ありがとう|ありがとう|x|thank you|ありがとうございます = polite version.
ございます|ございます|g|(polite ending)|Very polite form of あります.
ごめんなさい|ごめんなさい|x|sorry|A real apology. For small things すみません works.
かいて|書いて|w|write (te-form)|From 書く (kaku, to write).
もらえます|もらえます|g|can (you do for me)|～てもらえますか = could you…for me?
おなまえ|お名前|w|(your) name|お makes it polite. Don't use お for your own name.
なんさい|何歳|w|how old|
じょうず|上手|w|good at, skilled|Opposite: 下手 (へた). Reply modestly!
ね|ね|g|…right? / isn't it|Softens a sentence, seeks agreement.
いえいえ|いえいえ|x|no no (modest)|Standard reply to a compliment.
まだまだ|まだまだ|x|still a long way to go|
とても|とても|w|very|
たのしい|楽しい|w|fun, enjoyable|
たのしかった|楽しかった|w|was fun|Past of 楽しい.
どのくらい|どのくらい|w|how long / how much|
かんこう|観光|w|sightseeing|
だいすき|大好き|w|love, really like|大 (big) + 好き (like).
すき|好き|w|like|～が好きです = I like ～.
へん|辺|w|area, around here|この辺 = around here.
あの|あの|x|um… / excuse me|Soft way to start talking to someone. Also "that (+ noun)".
かいわ|会話|w|conversation|
れんしゅう|練習|w|practice|
ゆい|ゆい|n|Yui (a name)|
しゅっしん|出身|w|hometown, where you're from|
おおさか|大阪|n|Osaka|
きいて|聞いて|w|ask / listen (te-form)|From 聞く (kiku, to listen / to ask).
たべもの|食べ物|w|food|食べる (eat) + 物 (thing).
いちばん|一番|w|number one, most|一番好き = favourite.
おすし|お寿司|w|sushi|
おしごと|お仕事|w|(your) work, job|
かいしゃいん|会社員|w|office worker|
しゅみ|趣味|w|hobby|
えいが|映画|w|movie|
みる|見る|w|to watch, see|
みない|見ない|w|don't watch|Plain negative of 見る.
こと|こと|g|thing (turns a verb into a noun)|見ること = watching.
な|な|g|(links a describing word to what follows)|好きなアニメ = an anime you like. そうなんです = it's like that. At a sentence end (難しいな) it's a casual, thinking-aloud ending.
アニメ|アニメ|w|anime|
あまり|あまり|w|not much (with negative)|あまり見ない = don't watch much.
とうきょう|東京|n|Tokyo|
ばしょ|場所|w|place|
あさくさ|浅草|n|Asakusa|
きょうだい|兄弟|w|siblings|
あね|姉|w|(my) older sister|
よく|よく|w|often / well|
ここ|ここ|w|here|
たまに|たまに|w|sometimes, occasionally|
へえ|へえ|x|oh really / huh|Shows interest.
そう|そう|w|so, that way|そうなんですね = oh, is that so.
すごい|すごい|w|amazing, great|Casually also "very": すごい好き.
ほんとう|本当|w|true, real|本当ですか = really?
なるほど|なるほど|x|I see|
わたし|私|w|I, me|
おおきい|大きい|w|big, loud|
こえ|声|w|voice|
どういう|どういう|w|what kind of|どういう意味 = what meaning.
いみ|意味|w|meaning|
くれて|くれて|g|(doing) for me|～てくれてありがとう = thanks for doing ～ for me.
インスタ|インスタ|w|Instagram|
こうかん|交換|w|exchange, swap|
しゃかいふくし|社会福祉|w|social welfare / social work|
と|と|g|and (between nouns)|アニメと漫画 = anime and manga. Also "with".
まんが|漫画|w|manga, comics|
あに|兄|w|(my) older brother|
おとうと|弟|w|(my) younger brother|
ラーメン|ラーメン|w|ramen|
どうして|どうして|w|why|
ん|ん|g|(explaining tone)|～んですか asks for an explanation; sounds softer and more curious.
だから|だから|g|because / so|～が好きだからです = it's because I like ～.
はじめて|初めて|w|for the first time|
まあ|まあ|x|well… / I guess|Filler before a so-so answer.
かな|かな|g|I wonder / I guess|Casual, thinking out loud.
って|って|g|(quoting, casual)|Casual version of と (quoting) or は (topic).
かんじ|感じ|w|feeling, kind of|～って感じ = "it's like ～".
いちおう|一応|w|for now / technically / after all|Very common hedge word.
わけ|わけ|g|reason, case|～わけじゃない = it's not that ～.
じゃ|じゃ|g|(casual では) / well then|じゃない = is not. At the start: じゃ = well then.
ない|ない|g|not (plain negative)|
けど|けど|g|but… / although|Often trails off a sentence.
えー|えー|x|uhh… / ehh?|Thinking, or surprise.
だろう|だろう|g|probably / I wonder|なんだろう = what could it be…
うーん|うーん|x|hmm|
むずかしい|難しい|w|difficult|
とか|とか|g|things like, …and so on|ラーメンとか = stuff like ramen.
めっちゃ|めっちゃ|w|super, really (slang)|Kansai slang, used everywhere now.
そうそう|そうそう|x|yeah, exactly|
まじ|まじ|w|serious (slang)|まじで？ = seriously?
べつに|別に|w|not particularly|Can sound a bit cold on its own.
ふつう|普通|w|normal, ordinary|
うまい|うまい|w|good at / tasty (casual)|Casual version of 上手 or おいしい.
え|え|x|eh? / oh|Surprise.
`;
const LEX = {};
LEX_RAW.trim().split("\n").forEach(l => { const [k, w, t, en, note] = l.split("|"); LEX[k] = { k, w, t, en, note: note || "" }; });
