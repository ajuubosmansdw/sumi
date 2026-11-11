// N5 kanji (+ a few trip extras), ordered: ones in your phrases first, then signs, then the rest.
// k | meaning | on (Chinese reading, katakana) | kun (Japanese reading, hiragana) | mnemonic | examples (word,kana,meaning;...) | tag
const KANJI_RAW = `
日|sun, day|ニチ、ジツ|ひ、か|A window with a bar across it: the sun shining through, one day at a time.|日本,にほん,Japan;毎日,まいにち,every day;日曜日,にちようび,Sunday|phrase
本|book, origin|ホン|もと|A tree (木) with a line at the roots: the origin of things, where books come from.|日本,にほん,Japan;本当,ほんとう,really;本,ほん,book|phrase
語|language, word|ゴ|かた(る)|Words (言) from five (五) mouths (口): a language.|日本語,にほんご,Japanese;英語,えいご,English|phrase
人|person|ジン、ニン|ひと|A person walking: two legs, mid-stride.|日本人,にほんじん,Japanese person;一人,ひとり,one person;三人,さんにん,three people|phrase
何|what|カ|なに、なん|A person (亻) next to a box (可) asking "what's in it?"|何時,なんじ,what time;何ですか,なんですか,what is it;何歳,なんさい,how old|phrase
時|time, o'clock|ジ|とき|The sun (日) next to a temple (寺) bell that rings the hours.|何時,なんじ,what time;四時,よじ,4 o'clock;時間,じかん,time, hours|phrase
分|minute, part, understand|ブン、フン|わ(かる)|A knife (刀) splitting something in two (八): divide. Divided time = minutes. Split ideas = understand.|五分,ごふん,5 minutes;何分,なんぷん,how many minutes;分かります,わかります,I understand|phrase
今|now|コン|いま|A roof over a single moment: right now, under this roof.|今,いま,now;今日,きょう,today;今年,ことし,this year|phrase
円|yen, circle|エン|まる(い)|A coin in a wallet frame. Every price tag ends with it.|五百円,ごひゃくえん,500 yen;千円,せんえん,1,000 yen|phrase
百|hundred|ヒャク|—|One (一) on top of white (白): one white bag of a hundred coins.|五百,ごひゃく,500;三百,さんびゃく,300;八百,はっぴゃく,800|phrase
千|thousand|セン|ち|Ten (十) with a slash on top: ten hundreds, a thousand.|千円,せんえん,1,000 yen;三千,さんぜん,3,000|phrase
万|ten thousand|マン、バン|—|Looks like a big hook that holds a stack of 10,000 yen.|一万円,いちまんえん,10,000 yen;万,まん,10,000|phrase
一|one|イチ、イツ|ひと(つ)|One stroke, one thing.|一人,ひとり,one person;一番,いちばん,number one;一度,いちど,once|phrase
二|two|ニ|ふた(つ)|Two strokes.|二十二,にじゅうに,22;二人,ふたり,two people|phrase
三|three|サン|みっ(つ)|Three strokes.|三週間,さんしゅうかん,three weeks;三番線,さんばんせん,platform 3|phrase
四|four|シ|よ、よん、よっ(つ)|A box with legs inside: four walls. Careful: 4 o'clock is よじ.|四時,よじ,4 o'clock;四人,よにん,four people|phrase
五|five|ゴ|いつ(つ)|A stool with a seat and legs: five strokes in a shape like a 5 lying down.|五分,ごふん,5 minutes;五百円,ごひゃくえん,500 yen|phrase
六|six|ロク|むっ(つ)|A person with a hat and spread legs: a six-pointed stance.|六百,ろっぴゃく,600;六時,ろくじ,6 o'clock|phrase
七|seven|シチ|なな(つ)|An upside-down 7 with a line through it.|七時,しちじ,7 o'clock;七つ,ななつ,seven things|phrase
八|eight|ハチ|やっ(つ)|Two lines spreading out like the bottom of an 8.|八時,はちじ,8 o'clock;八百,はっぴゃく,800|phrase
九|nine|キュウ、ク|ここの(つ)|A hook-shaped 9 with an arm. 9 o'clock is くじ.|九時,くじ,9 o'clock;九,きゅう,nine|phrase
十|ten|ジュウ|とお|A cross: 10 like the Roman X turned.|十時,じゅうじ,10 o'clock;十分,じゅっぷん,10 minutes;二十,にじゅう,20|phrase
半|half|ハン|なか(ば)|A line cut straight down the middle: half.|十時半,じゅうじはん,10:30;半分,はんぶん,half|phrase
食|eat, food|ショク|た(べる)|A roof (人) over a good (良) meal: eat.|食べ物,たべもの,food;食べられません,たべられません,can't eat;食事,しょくじ,meal|phrase
肉|meat|ニク|—|A cut of meat on a frame, with the ribs (人人) showing.|豚肉,ぶたにく,pork;牛肉,ぎゅうにく,beef;鶏肉,とりにく,chicken|extra
水|water|スイ|みず|A stream splashing out to both sides.|水,みず,water;水曜日,すいようび,Wednesday|phrase
入|enter|ニュウ|い(る)、はい(る)、い(れる)|A person bending forward to walk in through a door.|入って,はいって,(is) inside;入口,いりぐち,entrance|sign
出|exit, go out|シュツ|で(る)、だ(す)|Two mountains (山) stacked: climbing up and out.|出口,でぐち,exit;出身,しゅっしん,hometown|sign
口|mouth, opening|コウ|くち|A square open mouth. On signs: an opening, a gate.|入口,いりぐち,entrance;出口,でぐち,exit;東口,ひがしぐち,east exit|extra
店|shop|テン|みせ|A roof (广) over a fortune-teller's stand (占): a little shop.|店内,てんない,inside the shop;お店,おみせ,shop|extra
駅|station|エキ|—|A horse (馬) at a stop: once horses changed here, now trains do.|駅,えき,station;渋谷駅,しぶやえき,Shibuya Station|extra
電|electricity|デン|—|Rain (雨) over a field with a lightning tail: electricity.|電車,でんしゃ,train;電話,でんわ,phone|phrase
車|car, vehicle|シャ|くるま|A cart seen from above: axle, two wheels, body.|電車,でんしゃ,train;車,くるま,car|phrase
行|go|コウ、ギョウ|い(く)、おこな(う)|A crossroads: you have to pick a way and go.|行きます,いきます,go;行って,いって,go (te-form);銀行,ぎんこう,bank|phrase
来|come|ライ|く(る)、き(ます)|A tree (木) with arms reaching toward you: come here.|来ました,きました,came;来年,らいねん,next year|phrase
右|right|ウ、ユウ|みぎ|A hand reaching over to a mouth (口): the right hand you eat with.|右,みぎ,right;右側,みぎがわ,right side|phrase
左|left|サ|ひだり|A hand holding a tool (工): the left hand that holds while the right works.|左,ひだり,left;左側,ひだりがわ,left side|phrase
前|before, front|ゼン|まえ|Someone at the front of a boat with a knife (刂), cutting ahead.|名前,なまえ,name;駅前,えきまえ,in front of the station;午前,ごぜん,a.m.|phrase
名|name|メイ、ミョウ|な|Evening (夕) and a mouth (口): in the dark you call out your name.|名前,なまえ,name;何名様,なんめいさま,how many people|phrase
大|big|ダイ、タイ|おお(きい)|A person with arms stretched wide: this big!|大丈夫,だいじょうぶ,okay;大好き,だいすき,love;大きい,おおきい,big|phrase
小|small|ショウ|ちい(さい)、こ|A small hook with two tiny drops beside it.|小さい,ちいさい,small;小学校,しょうがっこう,primary school|phrase
上|up, above|ジョウ|うえ、あ(がる)|A line pointing up from the ground.|上手,じょうず,good at;上,うえ,above|phrase
下|down, below|カ、ゲ|した、くだ(さい)|A line hanging down under the ground.|下手,へた,bad at;下,した,below;地下鉄,ちかてつ,subway|phrase
学|study|ガク|まな(ぶ)|A child (子) under a roof with things buzzing above: school.|学生,がくせい,student;大学,だいがく,university|phrase
生|life, birth|セイ、ショウ|い(きる)、う(まれる)|A plant sprouting from the ground: life.|学生,がくせい,student;先生,せんせい,teacher|phrase
先|ahead, previous|セン|さき|Legs (儿) stepping out ahead of everyone.|先生,せんせい,teacher;先週,せんしゅう,last week|core
年|year|ネン|とし|A person carrying a harvest: one harvest, one year.|今年,ことし,this year;来年,らいねん,next year|core
月|moon, month|ゲツ、ガツ|つき|A crescent moon with two lines of light.|一月,いちがつ,January;月曜日,げつようび,Monday;月,つき,moon|core
火|fire|カ|ひ|A campfire with sparks flying from both sides.|火曜日,かようび,Tuesday;火,ひ,fire|core
木|tree|モク、ボク|き|A tree: trunk, branches, roots.|木,き,tree;木曜日,もくようび,Thursday|core
金|gold, money|キン|かね|A roof over gold nuggets buried in the earth.|お金,おかね,money;金曜日,きんようび,Friday|core
土|earth, soil|ド|つち|A plant just poking out of a flat line of ground.|土曜日,どようび,Saturday;土,つち,soil|core
見|see|ケン|み(る)|An eye (目) on legs walking around to look.|見る,みる,to watch;見ない,みない,don't watch|phrase
話|talk|ワ|はな(す)、はなし|Words (言) from a tongue (舌): talking.|話せます,はなせます,can speak;会話,かいわ,conversation;電話,でんわ,phone|phrase
聞|listen, ask|ブン|き(く)|An ear (耳) pressed against a gate (門): listening in.|聞いて,きいて,ask/listen;新聞,しんぶん,newspaper|phrase
書|write|ショ|か(く)|A hand holding a brush over a page (日).|書いて,かいて,write;辞書,じしょ,dictionary|phrase
読|read|ドク|よ(む)|Words (言) you sell (売) by reading them out loud.|読む,よむ,to read;読書,どくしょ,reading|core
休|rest|キュウ|やす(む)|A person (亻) leaning against a tree (木): taking a rest.|休み,やすみ,holiday, break;休む,やすむ,to rest|core
間|interval, between|カン、ケン|あいだ、ま|The sun (日) shining through the gap between two gate doors (門).|三週間,さんしゅうかん,three weeks;時間,じかん,time|phrase
高|tall, expensive|コウ|たか(い)|A tall tower with floors stacked up.|高い,たかい,expensive / tall;高校,こうこう,high school|core
長|long|チョウ|なが(い)|An old man with long flowing hair.|長い,ながい,long;社長,しゃちょう,company boss|core
外|outside|ガイ|そと|Evening (夕) and a fortune stick (卜): outside, at night.|外国人,がいこくじん,foreigner;外,そと,outside|core
国|country|コク|くに|A jewel (玉) inside borders (囗): a country.|外国,がいこく,foreign country;中国,ちゅうごく,China|core
中|middle, inside|チュウ|なか|A line going straight through the middle of a box.|中国,ちゅうごく,China;中,なか,inside|core
東|east|トウ|ひがし|The sun (日) rising behind a tree (木): east.|東京,とうきょう,Tokyo;東口,ひがしぐち,east exit|sign
西|west|セイ、サイ|にし|A bird settling into its nest as the sun goes down in the west.|西口,にしぐち,west exit;関西,かんさい,Kansai|sign
南|south|ナン|みなみ|A warm tent with a fire inside: the warm south.|南口,みなみぐち,south exit|sign
北|north|ホク|きた|Two people sitting back to back, turning away from the cold north wind.|北口,きたぐち,north exit;北海道,ほっかいどう,Hokkaido|sign
男|man|ダン、ナン|おとこ|A rice field (田) and strength (力): the one working the field. On toilets!|男,おとこ,man;男の人,おとこのひと,man|sign
女|woman|ジョ|おんな|A woman kneeling gracefully, arms crossed. On toilets!|女,おんな,woman;女の人,おんなのひと,woman|sign
子|child|シ|こ|A baby wrapped up with arms out.|子供,こども,child;女の子,おんなのこ,girl|core
父|father|フ|ちち|Two crossed sticks under two flicks: dad's tools.|父,ちち,(my) father;お父さん,おとうさん,father|core
母|mother|ボ|はは|A woman's shape with two dots: mom.|母,はは,(my) mother;お母さん,おかあさん,mother|core
友|friend|ユウ|とも|Two hands (ナ and 又) shaking: friends.|友達,ともだち,friend|core
毎|every|マイ|—|A person with a hat over mother (母): mom does it every day.|毎日,まいにち,every day;毎朝,まいあさ,every morning|core
午|noon|ゴ|—|A sundial stick at its highest point: noon.|午前,ごぜん,a.m.;午後,ごご,p.m.|core
後|after, behind|ゴ、コウ|あと、うし(ろ)|Walking (彳) slowly behind, with short little steps.|午後,ごご,p.m.;後で,あとで,later|core
校|school|コウ|—|A tree (木) by a meeting place (交): the schoolyard.|学校,がっこう,school;高校,こうこう,high school|core
山|mountain|サン|やま|Three peaks.|富士山,ふじさん,Mt Fuji;山,やま,mountain|core
川|river|セン|かわ|Three lines of flowing water.|川,かわ,river|core
天|heaven, sky|テン|あめ|A big person (大) with a line above: the sky over their head.|天気,てんき,weather|core
気|spirit, air|キ|—|Steam rising from rice: energy, mood, air.|天気,てんき,weather;元気,げんき,healthy, well|core
雨|rain|ウ|あめ|A window with raindrops falling inside.|雨,あめ,rain|core
白|white|ハク|しろ(い)|The sun (日) with a ray on top: bright white.|白い,しろい,white|core
歳|age, years old|サイ、セイ|とし|A stop sign (止) under a roof with a little blade: each year marks a stop in your life.|何歳,なんさい,how old;二十二歳,にじゅうにさい,22 years old|extra
勉|effort|ベン|つと(める)|Strength (力) bent under a heavy load: making an effort.|勉強,べんきょう,study|extra
強|strong|キョウ、ゴウ|つよ(い)|A bow (弓) next to a bug with a big head: a small thing that's surprisingly strong.|勉強,べんきょう,study;強い,つよい,strong|extra
手|hand|シュ|て|A hand: wrist at the bottom, fingers spread across.|上手,じょうず,good at;下手,へた,bad at;手,て,hand|extra
週|week|シュウ|—|Walking (辶) around a full circle (周): one full round = one week.|三週間,さんしゅうかん,three weeks;今週,こんしゅう,this week;来週,らいしゅう,next week|extra
少|a little, few|ショウ|すく(ない)、すこ(し)|Small (小) with a slash taking even more away: just a little.|少し,すこし,a little;少々,しょうしょう,a little (polite)|extra
願|request, wish|ガン|ねが(う)|A spring (原) next to a head (頁): bowing your head at a spring to make a wish.|お願いします,おねがいします,please|extra
豚|pig|トン|ぶた|Meat (月) next to a pig (豕): pig. Check menus for this one!|豚肉,ぶたにく,pork;豚,ぶた,pig;豚カツ,とんかつ,pork cutlet|extra
酒|alcohol|シュ|さけ、さか|Water drops (氵) next to a jar (酉): what's in the jar is alcohol.|お酒,おさけ,alcohol;日本酒,にほんしゅ,sake;居酒屋,いざかや,izakaya|extra
鶏|chicken|ケイ|にわとり、とり|A bird (鳥) on the right, with a hand reaching for it: the bird you keep and catch.|鶏肉,とりにく,chicken (meat);鶏,にわとり,chicken (bird)|extra
牛|cow|ギュウ|うし|A cow's face from the front with one horn sticking up.|牛肉,ぎゅうにく,beef;牛乳,ぎゅうにゅう,milk;牛,うし,cow|extra
魚|fish|ギョ|さかな、うお|A fish: head on top, scaly body, and a tail fanning out (灬).|魚,さかな,fish;金魚,きんぎょ,goldfish|extra
辛|spicy, painful|シン|から(い)、つら(い)|A needle standing up: a sharp, stinging taste.|辛い,からい,spicy|extra
会|meet|カイ、エ|あ(う)|A roof (人) over people talking (云): a meeting.|会話,かいわ,conversation;会社,かいしゃ,company;会う,あう,to meet|extra
計|measure, total|ケイ|はか(る)|Words (言) and ten (十): counting it all up. The bill!|お会計,おかいけい,the bill;時計,とけい,clock|extra
様|(honorific) Mr/Ms, way|ヨウ|さま|A tree (木) next to sheep and water: a fancy title, like adding "honoured" to someone.|何名様,なんめいさま,how many people;お客様,おきゃくさま,customer|extra
注|pour, attention|チュウ|そそ(ぐ)|Water (氵) next to a master (主): the master pours, and you pay attention.|ご注文,ごちゅうもん,your order;注意,ちゅうい,caution|extra
文|writing, sentence|ブン、モン|ふみ|A person with a tattoo on their chest: writing.|ご注文,ごちゅうもん,your order;文,ぶん,sentence|extra
決|decide|ケツ|き(める)、き(まる)|Water (氵) bursting through a dam: once it breaks, it's decided.|お決まり,おきまり,decided;決める,きめる,to decide|extra
待|wait|タイ|ま(つ)|Walking (彳) to a temple (寺) and waiting outside.|待って,まって,wait;お待ちください,おまちください,please wait|extra
飲|drink|イン|の(む)|Food (食) next to a yawning mouth (欠): drink it down.|お飲み物,おのみもの,drinks;飲む,のむ,to drink|extra
物|thing|ブツ、モツ|もの|A cow (牛) and a flag (勿): goods at the market.|食べ物,たべもの,food;飲み物,のみもの,drink;買い物,かいもの,shopping|extra
内|inside|ナイ|うち|A person (人) stepping into a frame (冂): inside.|店内,てんない,inside the shop;案内,あんない,guidance|extra
召|summon, (polite)|ショウ|め(す)|A sword (刀) over a mouth (口): a lord calling you in. Used in polite speech.|お召し上がり,おめしあがり,eating (polite)|extra
持|hold|ジ|も(つ)|A hand (扌) next to a temple (寺): holding offerings.|持って,もって,holding;お持ち帰り,おもちかえり,take-away|extra
帰|return home|キ|かえ(る)|A broom (帚) next to a knife-shape: sweep up and go home.|持ち帰り,もちかえり,take-away;帰る,かえる,to go home|extra
袋|bag|タイ|ふくろ|Clothing (衣) under a dynasty (代): a cloth bag.|袋,ふくろ,bag;紙袋,かみぶくろ,paper bag|extra
利|profit, benefit|リ|き(く)|Rice (禾) and a knife (刂): harvesting rice is a benefit.|ご利用,ごりよう,use;便利,べんり,convenient|extra
用|use|ヨウ|もち(いる)|A fence or bucket: something you use.|ご利用,ごりよう,use;用事,ようじ,errand|extra
丈|length, sturdy|ジョウ|たけ|A hand holding a measuring stick: tall and sturdy.|大丈夫,だいじょうぶ,okay|extra
夫|husband, man|フ、フウ|おっと|A big man (大) with a hairpin line: a grown man, a husband.|大丈夫,だいじょうぶ,okay;夫,おっと,husband|extra
温|warm|オン|あたた(かい)、あたた(める)|Water (氵), sun (日) and a bowl (皿): a sunny bowl of warm water.|温めます,あたためます,heat up;温泉,おんせん,hot spring|extra
箸|chopsticks|チョ (rare)|はし|Bamboo (⺮) on top of a person (者): what that person eats with.|お箸,おはし,chopsticks|extra
付|attach|フ|つ(ける)、つ(く)|A person (亻) with a hand (寸) stuck to them: attach.|お付け,おつけ,include (polite);付ける,つける,to attach|extra
支|support, branch|シ|ささ(える)|Ten (十) over a hand (又): a hand holding up a branch.|お支払い,おしはらい,payment|extra
払|pay|フツ|はら(う)|A hand (扌) and a tiny "ム": handing over a little something to pay.|お支払い,おしはらい,payment;払う,はらう,to pay|extra
現|present, real|ゲン|あらわ(れる)|A jewel (王) and seeing (見): a real jewel right in front of you. Real money = cash.|現金,げんきん,cash|extra
開|open|カイ|あ(く)、ひら(く)|A gate (門) with a bar being lifted: open. Look for it on doors.|開きます,あきます,opens;開ける,あける,to open|extra
閉|close|ヘイ|し(まる)、と(じる)|A gate (門) with a bar (才) jammed in it: closed.|閉まります,しまります,closes;閉める,しめる,to close|extra
渋|astringent|ジュウ|しぶ(い)|Water (氵) and a frown: a bitter taste.|渋谷,しぶや,Shibuya;渋い,しぶい,bitter / tasteful|extra
谷|valley|コク|たに、や|Water splitting (八八) around an opening (口): a valley.|渋谷,しぶや,Shibuya;谷,たに,valley|extra
京|capital|キョウ、ケイ|—|A tall building with a lid on top: the capital.|東京,とうきょう,Tokyo;京都,きょうと,Kyoto|extra
都|metropolis|ト、ツ|みやこ|A person (者) next to a village (阝): a big city.|京都,きょうと,Kyoto;都合,つごう,convenience|extra
番|number, turn|バン|—|A rice field (田) with seeds sorted on top: everyone gets a number.|一番,いちばん,number one;三番線,さんばんせん,platform 3;交番,こうばん,police box|extra
線|line|セン|—|Thread (糸) next to a spring (泉): a long line.|何番線,なんばんせん,which platform;山手線,やまのてせん,Yamanote Line|extra
歩|walk|ホ、ブ|ある(く)|Stop (止) on top, a few small steps below: walking one step at a time.|歩いて,あるいて,on foot;散歩,さんぽ,a walk|extra
曲|bend, song|キョク|ま(がる)、ま(げる)|A field with bent lines: a curve. Also a song.|曲がって,まがって,turn;曲,きょく,song|extra
次|next|ジ|つぎ|Two drops (冫) beside a yawning person (欠): yawn... next!|次,つぎ,next;次は,つぎは,next is|extra
近|near|キン|ちか(い)|Walking (辶) up to an axe (斤): close enough to touch.|近く,ちかく,nearby;近い,ちかい,near|extra
度|degree, times|ド|たび|A roof over a hand: counting how many times.|一度,いちど,once;もう一度,もういちど,once more|extra
英|England, brilliant|エイ|—|Grass (艹) over the centre (央): a brilliant flower. Also England.|英語,えいご,English|extra
写|copy, photograph|シャ|うつ(す)|A cover (冖) over a copy: a photograph.|写真,しゃしん,photo|extra
真|true|シン|ま|Ten (十) eyes (目) on a stand: seen by many, so it's true.|写真,しゃしん,photo;真ん中,まんなか,middle|extra
撮|take (photo)|サツ|と(る)|A hand (扌) grabbing the best shot (最).|撮って,とって,take (a photo);撮影,さつえい,filming|extra
楽|fun, music, easy|ガク、ラク|たの(しい)|White (白) drum on a wooden (木) stand: music is fun.|楽しい,たのしい,fun;音楽,おんがく,music|extra
観|view|カン|み(る)|A bird with big eyes and seeing (見): taking in the view.|観光,かんこう,sightseeing|extra
光|light|コウ|ひかり、ひか(る)|Rays of light shining down on a person.|観光,かんこう,sightseeing;光,ひかり,light|extra
好|like|コウ|す(き)、この(む)|A woman (女) holding a child (子): what you love.|好き,すき,like;大好き,だいすき,love|extra
辺|area, vicinity|ヘン|あた(り)、べ|Walking (辶) around with a knife (刀): the area around you.|この辺,このへん,around here|extra
練|practice, train|レン|ね(る)|Thread (糸) worked over and over: practise until it's smooth.|練習,れんしゅう,practice|extra
習|learn|シュウ|なら(う)|Two wings (羽) over white (白): a baby bird learning to fly again and again.|練習,れんしゅう,practice;習う,ならう,to learn|extra
身|body|シン|み|A pregnant body seen from the side.|出身,しゅっしん,hometown;身長,しんちょう,height|extra
阪|slope (Osaka)|ハン|さか|A hill (阝) next to "against" (反): a slope.|大阪,おおさか,Osaka|extra
寿|long life|ジュ|ことぶき|A long life stacked up in layers. In 寿司 it's read す.|お寿司,おすし,sushi|extra
司|official, administer|シ|—|A hand over a mouth (口): the one who gives orders.|お寿司,おすし,sushi;上司,じょうし,boss|extra
仕|serve, do|シ、ジ|つか(える)|A person (亻) next to a samurai (士): serving.|お仕事,おしごと,work;仕方,しかた,way of doing|extra
事|thing, matter|ジ、ズ|こと|A hand holding a brush to write things down: matters, things.|仕事,しごと,work;食事,しょくじ,meal;大事,だいじ,important|extra
社|company, shrine|シャ|やしろ|An altar (礻) on the earth (土): a shrine, where people gather like a company.|会社員,かいしゃいん,office worker;会社,かいしゃ,company;神社,じんじゃ,shrine|extra
員|member|イン|—|A mouth (口) over a shell (貝): members get paid.|会社員,かいしゃいん,office worker;店員,てんいん,shop staff;駅員,えきいん,station staff|extra
趣|interest, taste|シュ|おもむき|Running (走) to grab (取) what interests you.|趣味,しゅみ,hobby|extra
味|taste|ミ|あじ|A mouth (口) next to "not yet" (未): tasting before it's ready.|意味,いみ,meaning;趣味,しゅみ,hobby;味,あじ,taste|extra
映|reflect, project|エイ|うつ(る)|The sun (日) shining in the centre (央): projecting a picture.|映画,えいが,movie|extra
画|picture, stroke|ガ、カク|—|A field (田) in a frame: a picture.|映画,えいが,movie;漫画,まんが,manga|extra
場|place|ジョウ|ば|Earth (土) and sunshine (昜): an open place.|場所,ばしょ,place;駐車場,ちゅうしゃじょう,car park|extra
所|place|ショ|ところ|A door (戸) and an axe (斤): the place where the woodcutter lives.|場所,ばしょ,place;台所,だいどころ,kitchen|extra
浅|shallow|セン|あさ(い)|Water (氵) over a small weapon: shallow enough to wade in.|浅草,あさくさ,Asakusa;浅い,あさい,shallow|extra
草|grass|ソウ|くさ|Grass (艹) over early (早): the first thing to grow.|浅草,あさくさ,Asakusa;草,くさ,grass|extra
兄|older brother|ケイ、キョウ|あに|A big mouth (口) on legs (儿): the older brother who bosses you around.|兄,あに,(my) older brother;兄弟,きょうだい,siblings;お兄さん,おにいさん,older brother|extra
弟|younger brother|ダイ、テイ、デ|おとうと|A bow wrapped with string: the little brother tagging along.|弟,おとうと,(my) younger brother;兄弟,きょうだい,siblings|extra
姉|older sister|シ|あね|A woman (女) next to the market (市): big sister going shopping.|姉,あね,(my) older sister;お姉さん,おねえさん,older sister|extra
当|hit, correct|トウ|あ(たる)|A little crown (⺌) over a broom-hand: hitting the mark exactly.|本当,ほんとう,true, really;弁当,べんとう,bento|extra
私|I, private|シ|わたし、わたくし|Rice (禾) next to a small "ム": my own private rice.|私,わたし,I;私立,しりつ,private (school)|extra
声|voice|セイ|こえ|A samurai (士) over a door: a loud voice through the door.|声,こえ,voice;大きい声,おおきいこえ,loud voice|extra
意|mind, meaning|イ|—|Sound (音) over a heart (心): what your heart means to say.|意味,いみ,meaning;注意,ちゅうい,caution|extra
交|mix, exchange|コウ|まじ(わる)|A person with crossed legs: things crossing over each other.|交換,こうかん,exchange;交番,こうばん,police box|extra
換|exchange|カン|か(える)|A hand (扌) swapping one thing for another.|交換,こうかん,exchange|extra
福|luck, blessing|フク|—|An altar (礻) next to a full jar: blessings.|社会福祉,しゃかいふくし,social welfare;福岡,ふくおか,Fukuoka|extra
祉|welfare|シ|—|An altar (礻) next to stop (止): a place where you're cared for.|社会福祉,しゃかいふくし,social welfare;福祉,ふくし,welfare|extra
漫|loose, comic|マン|—|Water (氵) spreading out loosely: relaxed, rambling pictures = manga.|漫画,まんが,manga|extra
初|first|ショ|はじ(め)、はつ|Clothing (衤) and a knife (刀): the first cut when making clothes.|初めて,はじめて,for the first time;初めまして,はじめまして,nice to meet you|extra
感|feeling|カン|—|A heart (心) under a big weapon: a strong feeling.|感じ,かんじ,feeling;感謝,かんしゃ,gratitude|extra
応|respond|オウ|こた(える)|A heart (心) under a roof: responding from the heart.|一応,いちおう,for now / after all|extra
難|difficult|ナン|むずか(しい)|A bird (隹) stuck in a muddy place: a difficult spot.|難しい,むずかしい,difficult|extra
別|separate|ベツ|わか(れる)|A knife (刂) cutting something away: separate.|別に,べつに,not particularly;特別,とくべつ,special|extra
普|universal|フ|—|The sun (日) shining evenly over everything: universal.|普通,ふつう,normal|extra
通|pass through|ツウ|とお(る)、かよ(う)|Walking (辶) through a passage: pass through.|普通,ふつう,normal;通り,とおり,street|extra
`;
const KANJI = KANJI_RAW.trim().split("\n").map((l, i) => {
  const [k, m, on, kun, mn, ex, tag] = l.split("|");
  return { k, m, on, kun, mn, tag, order: i,
    ex: ex.split(";").map(s => { const [w, kana, en] = s.split(","); return { w, kana, en }; }) };
});
const N5_SET = new Set("日一国人年大十二本中長出三時行見月後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨分");
KANJI.forEach(x => { x.n5 = N5_SET.has(x.k); });
const PRIO = { phrase: 0, sign: 1, extra: 2, core: 3 };
KANJI.sort((a, b) => (PRIO[a.tag] - PRIO[b.tag]) || (a.order - b.order));
const KANJI_BY = Object.fromEntries(KANJI.map(x => [x.k, x]));

// Compounds whose meaning really adds up from their parts. w|kana|meaning|why|special reading?
const COMP_RAW = `
外国人|がいこくじん|foreigner|outside + country + person
外国|がいこく|foreign country|outside + country
入口|いりぐち|entrance|enter + opening
出口|でぐち|exit|exit + opening
東口|ひがしぐち|east exit|east + opening
入国|にゅうこく|entering a country|enter + country
出国|しゅっこく|leaving a country|exit + country
外出|がいしゅつ|going out|outside + exit
外食|がいしょく|eating out|outside + eat
電車|でんしゃ|train|electric + vehicle
電話|でんわ|telephone|electric + talk
電気|でんき|electricity, lights|electric + energy
火山|かざん|volcano|fire + mountain
大雨|おおあめ|heavy rain|big + rain
小雨|こさめ|light rain|small + rain|1
雨天|うてん|rainy weather|rain + sky
天気|てんき|weather|sky + spirit: the sky's mood
水中|すいちゅう|underwater|water + middle
大学|だいがく|university|big + study
学校|がっこう|school|study + school
高校|こうこう|high school|high + school
入学|にゅうがく|starting school|enter + study
学生|がくせい|student|study + life
小学生|しょうがくせい|primary school pupil|small + study + life
先生|せんせい|teacher|ahead + life: someone born before you
人生|じんせい|(a person's) life|person + life
毎日|まいにち|every day|every + day
毎週|まいしゅう|every week|every + week
今週|こんしゅう|this week|now + week
来週|らいしゅう|next week|coming + week
先週|せんしゅう|last week|previous + week
今月|こんげつ|this month|now + month
来月|らいげつ|next month|coming + month
先月|せんげつ|last month|previous + month
来年|らいねん|next year|coming + year
今年|ことし|this year|now + year|1
今日|きょう|today|now + day|1
本日|ほんじつ|today (formal)|this + day
休日|きゅうじつ|day off|rest + day
午前|ごぜん|a.m., morning|noon + before
午後|ごご|p.m., afternoon|noon + after
半分|はんぶん|half|half + part
時間|じかん|time, hours|time + interval
名前|なまえ|name|name + front: what you put in front of yourself
日本人|にほんじん|Japanese person|Japan + person
日本語|にほんご|Japanese (language)|Japan + language
英語|えいご|English (language)|England + language
中国|ちゅうごく|China|middle + country: the "Middle Kingdom"
母国|ぼこく|home country|mother + country
母国語|ぼこくご|native language|mother + country + language
父母|ふぼ|parents|father + mother
男女|だんじょ|men and women|man + woman
男子|だんし|boy|man + child
女子|じょし|girl|woman + child
大人|おとな|adult|big + person|1
友人|ゆうじん|friend|friend + person
人口|じんこう|population|person + mouth: mouths to feed
年上|としうえ|older (than you)|year + up
年下|としした|younger (than you)|year + down
中年|ちゅうねん|middle age|middle + year
少年|しょうねん|boy, youth|few + years
上手|じょうず|good at|up + hand: a skilled hand
下手|へた|bad at|down + hand|1
店内|てんない|inside the shop|shop + inside
店員|てんいん|shop staff|shop + member
駅員|えきいん|station staff|station + member
会社員|かいしゃいん|office worker|company + member
会話|かいわ|conversation|meet + talk
写真|しゃしん|photo|copy + true: a true copy
牛肉|ぎゅうにく|beef|cow + meat
豚肉|ぶたにく|pork|pig + meat
鶏肉|とりにく|chicken (meat)|chicken + meat
食事|しょくじ|meal|eat + matter
飲食|いんしょく|eating and drinking|drink + eat
読書|どくしょ|reading (books)|read + writing
一番|いちばん|number one, best|one + number
近所|きんじょ|neighbourhood|near + place
意味|いみ|meaning|mind + taste: what the mind tastes in a word
出身|しゅっしん|hometown, origin|exit + body: where your body came from
東京|とうきょう|Tokyo|east + capital
京都|きょうと|Kyoto|capital + metropolis
`;
const COMPOUNDS = COMP_RAW.trim().split("\n").map(l => { const [w, kana, en, why, irr] = l.split("|"); return { w, kana, en, why, irr: !!irr }; });
