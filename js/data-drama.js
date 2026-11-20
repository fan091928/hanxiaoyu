/* ============================================================
   韩小语 · 韩剧日常台词对话库
   参考经典韩剧真实生活对白，每组为多轮完整对话（非单词）
   格式：
     ###剧名|场景主题|程度
     A/B|韩语台词|中文翻译|罗马音
   ============================================================ */

const DRAMA_RAW = `
###도깨비 鬼怪|初次搭讪|中
A|저기요, 혹시 실례합니다만...|那个，不好意思打扰一下……|jeogiyo, hoksi sillyehamnida-man...
B|네, 무슨 일이세요?|嗯，有什么事吗？|ne, museun iriseyo?
A|제가 길을 좀 헷갈렸어요. 여기가 어디예요?|我有点迷路了，这里是什么地方？|jega gireul jom hetgyeoss-eoyo. yeogiga eodiyeyo?
B|여기는 강릉이에요. 어디서 오셨어요?|这里是江陵。您从哪里来？|yeogineun gangneung-ieyo. eodiseo osyeosseoyo?
A|서울에서 왔는데, 이 바다가 정말 예쁘네요.|我从首尔来，这片海真漂亮。|seoul-eseo wan-neunde, i badaga jeongmal yeppeuneyo.
B|그러게요. 날씨가 좋아서 더 예뻐 보여요.|是啊，天气好所以显得更美。|geureogeyo. nalssiga joaseo deo yeppeo boyeoyo.
A|혹시 사진 좀 찍어 주시겠어요? 기념으로 남기고 싶어요.|能帮我拍张照吗？想留作纪念。|hoksi sajin jom jjigeo jusigesseoyo? ginyeomeuro namgigo sipeoyo.
B|그럼요. 여기 서 계세요. 하나, 둘, 셋!|当然可以。站这里。一、二、三！|geureomyo. yeogi seo gyeseyo. hana, dul, set!
A|와, 정말 잘 나왔어요. 감사합니다!|哇，拍得真好，谢谢！|wa, jeongmal jal nawaesseoyo. gamsahamnida!
B|천만에요. 좋은 여행 되세요.|不客气，祝您旅途愉快。|cheonman-e-yo. joen yeohaeng doeseyo.

###도깨비 鬼怪|关心叮嘱|高
A|요즘 너무 바쁘신 것 같은데, 잠은 제대로 주무세요?|最近您好像很忙，觉睡得好吗？|yojeum neomu bapeusin geot gateunde, jameun jedaero jumuseyo?
B|걱정하지 마세요. 저는 괜찮아요.|别担心，我没事。|geokjeonghaji maseyo. jeoneun gwaenchanayo.
A|그래도 몸이 먼저 아플 수 있어요. 무리하지 마세요.|不过身体会先累垮的，别太勉强。|geuraedo mom-i meonjeo apeul su isseoyo. murihaji maseyo.
B|알겠어요. 당신도 너무 걱정 마요.|知道了，你也别太担心。|algesseoyo. dangsin-do neomu geokjeong mayo.
A|저는 당신이 아프면 더 걱정돼요.|你要是病了我会更担心。|jeoneun dangsin-i apeumyeon deo geokjeongdwae-yo.
B|하하, 오늘도 참 다정하시네요.|哈哈，你今天也真温柔啊。|haha, oneuldo cham dajeonghasine-yo.
A|다정한 게 아니라 사실이에요. 약속해 주세요.|不是温柔，是实话。答应我。|dajeonghan ge animyeo sasir-ieyo. yaksokhae juseyo.
B|알았어요, 약속할게요. 걱정 좀 줄이세요.|好，我答应你，你少操点心吧。|arasseoyo, yaksokhalgeyo. geokjeong jom juriseyo.

###태양의 후예 太阳的后裔|初识自我介绍|初
A|안녕하세요. 저는 방송국 기자예요.|你好，我是电视台记者。|annyeonghaseyo. jeoneun bangsongguk gija-yeyo.
B|안녕하세요. 만나서 반갑습니다.|你好，很高兴见到你。|annyeonghaseyo. mannaseo bangapseumnida.
A|저희가 취재를 왔는데, 혹시 인터뷰 가능하실까요?|我们来采访，请问可以做采访吗？|jeohuiga chwijaereul wan-neunde, hoksi inteobyu ganeunghasilkkayo?
B|지금은 좀 바쁜데, 한 시간 후에 괜찮을까요?|现在有点忙，一小时后可以吗？|jigeumeun jom bapeunde, han sigan hue gwaenchaulkkayo?
A|네, 그럼 한 시간 후에 다시 올게요.|好的，那我一小时后再来。|ne, geureom han sigan hue dasi olgeyo.
B|감사합니다. 그때 뵐게요.|谢谢，到时候见。|gamsahamnida. geuttae boelgeyo.
A|저는 유시진이라고 합니다. 잘 부탁드립니다.|我叫柳时镇，请多关照。|jeoneun yusijin-irago hamnida. jal butakdeurimnida.
B|저도 반갑습니다. 좋은 하루 보내세요.|我也很高兴，祝您一天愉快。|jeodo bangapseumnida. joen haru bonaeseyo.

###태양의 후예 太阳的后裔|约会表白|中
A|오늘 시간이 좀 되세요? 같이 저녁이라도 먹을까요?|今天有时间吗？一起吃个晚饭？|oneul sigani jom doeseyo? gachi jeonyeog-irado meogulkkayo?
B|오늘은 약속이 있는데, 내일은 어때요?|今天有约了，明天怎么样？|oneureun yaksogi inneunde, naeireun eottaeyo?
A|내일이요? 좋죠! 내일 몇 시가 편하세요?|明天？好啊！明天几点方便？|naeir-iyo? jochyo! naeir myeot siga pyeonhaseyo?
B|저녁 일곱 시쯤 어때요?|晚上七点左右怎么样？|jeonyeok ilgop sijjeum eottaeyo?
A|완벽해요. 제가 예약해 둘게요.|完美，我来预订。|wanbyeokhaeyo. jega yeyakhae dulgeyo.
B|그럼 내일 봐요. 오늘도 수고하셨어요.|那明天见，今天也辛苦了。|geureom naeil bwayo. oneuldo sugohasyeosseoyo.
A|내일 기다릴게요. 안녕히 가세요.|明天等你，慢走。|naeil gidarilgeyo. annyeonghi gaseyo.

###별에서 온 그대 来自星星的你|拌嘴斗气|中
A|이건 또 뭐예요? 제 옷을 왜 이렇게 더럽혔어요?|这又是怎么回事？为什么把我衣服弄这么脏？|igeon tto mwoyeyo? je os-eul wae ireoke deoreophyeosseoyo?
B|그건 내가 아니야. 우리 강아지가 그랬어.|不是我，是我们家狗弄的。|geugeon naega aniya. uri gangajiga geuraesseo.
A|강아지가 옷을 더럽히면 누가 치우는 건데요?|狗弄脏了衣服谁来收拾啊？|gangajiga os-eul deoreophimyeon nuga chiuneun geondeyo?
B|...내가 치울게요. 미안해요.|……我来收拾，对不起。|...naega chiulgeyo. mianhaeyo.
A|미안하다고만 하면 다 해결되는 줄 알아요?|你以为一句对不起就都解决了吗？|mianhadagoman hamyeon da haegyeoldoeneun jul arayo?
B|그럼 어떻게 하라는 거야? 말해 줘.|那你要我怎么做？你说。|geureom eotteoke haraneun geoya? malhae jwo.
A|앞으로 조심해 주세요. 그리고 오늘 저녁은 당신이 사요.|以后小心点，还有今晚你请客。|apeuro josimhae juseyo. geurigo oneul jeonyeogeun dangsin-i sayo.
B|알았어. 비싼 거 골라도 되지?|知道了，我可以挑贵的吧？|arasseo. bissan ge geollado doeji?

###응답하라 1988 请回答1988|家人日常|初
A|엄마, 오늘 저녁에 뭐 먹어요?|妈，今晚吃什么？|eomma, oneul jeonyeoge mwo meogeoyo?
B|김치찌개 끓일 거야. 너희 아빠가 좋아하니까.|要炖泡菜汤，你爸喜欢吃。|gimchijjigae kkeuril geoya. neohui appaga joahanikka.
A|아, 진짜? 나 김치찌개 제일 좋아해요!|啊，真的？我最喜欢泡菜汤了！|a, jinjja? na gimchijjigae jeil joahaeyo!
B|그럼 밥 좀 먹으라고 이리 와.|那过来吃饭吧。|geureom bap jom meogeurago iri wa.
A|오빠는 어디 가요? 같이 먹어요.|哥哥去哪儿？一起吃吧。|oppaneun eodi gayo? gachi meogeoyo.
B|나 친구 만나러 가. 너희 먼저 먹어.|我去见朋友，你们先吃。|na chingu manmareo ga. neohui meonjeo meogeo.
A|그럼 오빠 늦지 않고 일찍 오세요!|那哥哥别迟到，早点回来！|geureom oppa neutji anhago iljjik oseyo!
B|알았어, 걱정 마. 금방 올게.|知道了，别担心，马上回来。|arasseo, geokjeong ma. geumbang olge.

###사랑의 불시착 爱的迫降|误会化解|中
A|제가 오해한 것 같아요. 정말 미안해요.|好像是我误会了，真的很抱歉。|jega oehaehan geot gateoyo. jeongmal mianhaeyo.
B|괜찮아요. 저도 설명이 부족했어요.|没关系，我也没解释清楚。|gwaenchanayo. jeodo seolmyeongi bujokhaesseoyo.
A|이제부터는 서로 솔직하게 이야기해요.|以后我们就坦诚地说吧。|ijebuteoneun seoro soljikhage iyagihaeyo.
B|좋아요. 저도 그렇게 하고 싶었어요.|好，我也正想这么做。|joayo. jeodo geureoke hago sipeosseoyo.
A|그럼 다시 시작해 볼까요?|那我们重新开始好吗？|geureom dasi sijakhae bolkkayo?
B|네, 이번에는 잘해 볼게요.|好，这次我会好好做的。|ne, ibeoneneun jalhae bolgeyo.
A|고맙습니다. 마음이 한결 편해졌어요.|谢谢，心里轻松多了。|gomapseumnida. maeumi hangyeol pyeonhaejyeosseoyo.
B|저도 그래요. 이제 친구죠?|我也是。现在是朋友了吧？|jeodo geuraeyo. ijae chingujyo?

###빈센조 文森佐|职场交涉|高
A|제안을 하나 드리겠습니다. 들어 보시죠.|我有个提议，您听听看。|jean-eul hana deurigesseumnida. deureo bosijyo.
B|어떤 제안인지 먼저 말씀해 주세요.|请先说说是什么样的提议。|eotteon jean-inji meonjeo malsseumhae juseyo.
A|서로에게 이로운 거래입니다. 조건을 협의합시다.|这是对双方都有利的交易，我们商议条件吧。|seoro-ege iroun georae-imnida. jogeon-eul hyeopuihabsida.
B|이해했습니다. 다만 몇 가지 수정이 필요해 보입니다.|明白了，不过有几处需要修改。|ihaehaesseumnida. daman myeot gaji sujeongi piryohae boimnida.
A|어떤 부분인지 말씀해 주십시오. 최대한 반영하겠습니다.|请说说是哪部分，我们会尽量采纳。|eotteon bubun-inji malsseumhae jusipsiyo. choedaehan banyeonghaesseumnida.
B|여기 계약 기간을 3년으로 늘려 주세요.|这里请把合同期延长到三年。|yeogi gyeyak gigan-eul samnyeon-euro neullyeo juseyo.
A|검토해 보겠습니다. 오늘 중으로 연락드리겠습니다.|我们研究一下，今天内联系您。|geomtohae bogesseumnida. oneul jung-euro yeonlakdeurigesseumnida.
B|그럼 기다리겠습니다. 좋은 하루 되세요.|那我等消息，祝您一天愉快。|geureom gidarigesseumnida. joen haru doeseyo.

###호텔 델루나 德鲁纳酒店|待客服务|中
A|어서 오세요. 예약하신 손님이세요?|欢迎光临，您是预约的客人吗？|eoseo oseyo. yeyakhasin sonnimi-seyo?
B|네, 오늘 밤 1박 예약했습니다.|是的，预约了今晚一晚。|ne, oneul bam ilbak yeyakhaesseumnida.
A|성함과 연락처 확인 부탁드립니다.|请确认一下姓名和联系方式。|seonghamgwa yeonlakcheo hwagin butakdeurimnida.
B|여기 있습니다. 체크인은 몇 시부터인가요?|给您。几点可以入住？|yeogi isseumnida. chekeu-in-eun myeot sibuteoin-kayo?
A|오후 3시부터 가능하십니다. 짐은 여기에 맡겨 두시면 됩니다.|下午三点起可以，行李寄存在这里即可。|ohu sam-sibuteo ganeunghasimnida. jimeun yeogie matgyeo dusimyeon doemnida.
B|감사합니다. 방까지 안내해 주시겠어요?|谢谢，能带我到房间吗？|gamsahamnida. bangkkaji annaehae jusigesseoyo?
A|그럼요. 이쪽으로 오세요. 엘리베이터는 저 끝에 있습니다.|当然，请这边走，电梯在那头。|geureomyo. ijjogeuro oseyo. ellibeiteoneun jeo kkeute isseumnida.
B|감사합니다. 시설이 정말 멋있네요.|谢谢，设施真不错。|gamsahamnida. siseori jeongmal meositneyo.

###스물다섯 스물하나 二十五二十一|朋友鼓励|初
A|오늘 시험 잘 봤어?|今天考试考得好吗？|oneul siheom jal bwasseo?
B|음... 생각보다 어려웠어. 조금 걱정돼.|嗯……比想象中难，有点担心。|eum... saenggakboda eoryeowosseo. jogeum geokjeongdwae.
A|걱정하지 마. 네가 그동안 열심히 한 거 다 알아.|别担心，你这段时间多努力我都知道。|geokjeonghaji ma. niga geudongan yeolsimhi han geo dar-a.
B|고마워. 근데 나 진짜 못한 것 같아.|谢谢，但我真的觉得没考好。|gomawo. geunde na jinjja mothan geot gata.
A|결과가 어때도 네 노력은 변하지 않아. 파이팅!|结果怎样都改变不了你的努力，加油！|gyeolgwa-ga eottaedo ne noryeogeun byeonhaji ana. paiting!
B|고마워, 덕분에 기분이 좀 나아졌어.|谢谢，多亏你我心情好点了。|gomawo, deokbune gibuni jom naajyeosseo.
A|그럼 저녁에 맛있는 거 먹으러 가자!|那晚上去吃好吃的吧！|geureom jeonyeoge masinneun geo meogeur-eo gaja!
B|좋아! 내가 쏠게.|好！我请客。|joa! naega ssolge.

###김비서가 왜 그럴까 金秘书为何那样|办公室互动|中
A|김 비서, 오늘 일정 좀 보고해 주세요.|金秘书，请汇报一下今天的日程。|gim biseo, oneul iljeong jom bogohae juseyo.
B|네, 오전 10시에 회의가 있고 오후에는 출장이 있습니다.|好的，上午十点有会议，下午有出差。|ne, ojeon sip-sie hoeuiga itgo ohue-neun chuljangi isseumnida.
A|출장 준비는 다 됐어요?|出差都准备好了吗？|chuljang junbineun da dwasseoyo?
B|네, 서류와 짐 모두 준비해 두었습니다.|是的，文件和行李都准备好了。|ne, seoryuwa jim modu junbihae dueosseumnida.
A|수고했어요. 오늘도 늦게까지 일하게 생겼네요.|辛苦了，看来今天又要工作到很晚。|sugohaesseoyo. oneuldo neutgekkaji ilhage saenggyeonne-yo.
B|괜찮습니다. 제가 도와드릴 게 더 있나요?|没关系，还有什么需要我帮忙的吗？|gwaenchansimnida. jega dowadeuril ge deo innayo?
A|커피 한 잔만 더 부탁해요.|那就再帮我倒杯咖啡吧。|keopi han janman deo butakhaeyo.
B|알겠습니다. 바로 가져오겠습니다.|好的，马上拿来。|algesseumnida. baro gajyeogesseumnida.
###미생 未生|职场新人第一天|中
A|오늘부터 인턴으로 일하게 된 장그래입니다. 잘 부탁드립니다.|今天起作为实习生来工作的张克莱，请多关照。|oneulbuteo inteoneuro ilhage doen jang keullaesi-imnida. jal butakdeurimnida.
B|반갑습니다. 먼저 사무실 구경부터 할까요?|欢迎，先参观一下办公室吧？|bangapseumnida. meonjeo samuseol gugyeong-buteo halkkayo?
A|네, 감사합니다. 업무가 어떻게 돌아가는지 좀 알고 싶어요.|好的谢谢，我想了解一下工作流程。|ne, gamsahamnida. eomuga eotteoke doraganunji jom algo sipeoyo.
B|이 팀은 바쁘지만 배울 게 많아요. 천천히 익히면 돼요.|这个团队虽然忙但能学的东西很多，慢慢熟悉就行。|i timeun bapeujiman baeul ge manayo. cheoncheonhi ikhimyeon doeyo.
A|알겠습니다. 최선을 다하겠습니다.|明白了，我会尽全力的。|algesseumnida. choeseon-eul dahagesseumnida.
B|혹시 모르는 게 있으면 언제든 물어보세요.|有不懂的随时问哦。|hoksi moreuneun ge isseumyeon eonjedeun mureoboseyo.
A|감사합니다. 선배님 덕분에 안심이 돼요.|谢谢，因为有前辈在我就放心了。|gamsahamnida. seonbaenim deokbune ansim-i dwae-yo.
B|저도 처음엔 그랬어요. 걱정 마세요.|我一开始也是那样的，别担心。|jeodo cheoeum-en geuraesseoyo. geokjeong maseyo.
A|오늘부터 열심히 배우겠어요!|今天开始我会好好学的！|oneulbuteo yeolsimhi baeugesseoyo!

###미생 未生|加班深夜对话|高
A|선배님, 아직 안 가셨어요? 이렇게 늦게까지 일하시나요?|前辈，您还没走吗？工作到这么晚？|seonbaenim, ajik an gasyeosseoyo? ireoke neutgekkaji ilhasinayo?
B|네, 오늘 마감이 있어서요. 너도 너무 무리하지 마.|嗯，今天有截止日期，你也别太勉强。|ne, oneul magami isseoseoyo. neo-do neomu murihaji ma.
A|이 일이 제게는 정말 중요해서요. 포기하고 싶지 않아요.|这项工作对我真的很重要，我不想放弃。|i il-i jegeneun jeongmal jungyohaeseoyo. pogihago sipji anayo.
B|그 마음 알아. 하지만 건강도 중요해. 밥은 먹었어?|那份心情我懂，但健康也重要，吃饭了吗？|geu maeum ar-a. hajiman geongangdo jungyohae. bab-eun meogeosseo?
A|아직이요. 잠깐만 더 하면 끝낼 수 있을 것 같아요.|还没，再一会儿应该就能做完了。|ajig-iyo. jamkkanman deo hamyeon kkeutnael su isseul geot gateoyo.
B|그럼 이따 같이 먹자. 내가 쏠게.|那待会儿一起吃吧，我请客。|geureom itta gachi meokja. naega ssolge.
A|감사합니다. 선배님 정말 고맙습니다.|谢谢，前辈真的太感谢了。|gamsahamnida. seonbaenim jeongmal gomapseumnida.
B|뭐 이런 걸로. 어서 마무리하고 가자.|这算什么，快点收尾走吧。|mwo ireon geollo. eoseo mamurihago gaja.

###응답하라 1997 请回答1997|同学聚会|初
A|야, 우리 반 친구들 다 모였어?|喂，我们班同学都到齐了吗？|ya, uri ban chingu-deul da moyeosseo?
B|아직 친구 하나가 안 왔어. 곧 올 거야.|还有个朋友没来，马上就到。|ajik chingu hanaga an wasseo. got ol geoya.
A|이거 봐, 우리가 고등학교 때 사진이네.|快看，这是我们高中时候的照片。|igeo bwa, uriga godeunghakgyo ttae sajin-ine.
B|와, 진짜 옛날이야. 저때 정말 순수했지.|哇，真是好久以前了，那时候真单纯啊。|wa, jinjja yennal-iya. jeottae jeongmal sunsuhaeji.
A|야, 너 그때 노래 진짜 잘했잖아.|喂，你那时候歌唱得真好。|ya, neo geuttae norae jinjja jalhaetjana.
B|그렸네~ 근데 지금은 못해.|是吗~不过现在不行了。|geuraetne~ geunde jigeumeun mothae.
A|오늘 다 같이 노래방 가자!|今天就一起去卡拉OK吧！|oneul da gachi norae-bang gaja!
B|좋아! 오랜만에 신나게 놀아야지.|好！好久没玩了，得好好嗨一下。|joa! oraenmane sinnage nol-ayaji.

###슬기로운 감빵생활 机智的监狱生活|狱中日常|中
A|병장님, 오늘 운동 좀 같이 하시죠?|兵长，今天一起运动一下吧？|byeongjangnim, oneul undong jom gachi hasijyo?
B|좋아. 요즘 너무 누워만 있어서 몸이 뻐근해.|好啊，最近老躺着，身体都僵了。|joa. yojeum neomu nuwoman isseoseo mom-i ppeogeunhae.
A|저도 그래요. 아침에 일어나기 힘들어요.|我也是，早上起床都费劲。|jeodo geuraeyo. achim-e ireonagi himdeureoyo.
B|여기선 규칙이 중요해. 아침 일찍 일어나는 게 좋아.|在这里规律很重要，早点起床比较好。|yeogiseon gyuchigi jungyohae. achim iljjik ireonaneun ge joa.
A|말씀 잘 들었습니다. 앞으로 일찍 일어나볼게요.|受教了，以后我试着早点起。|malsseum jal deureosseumnida. apeuro iljjik ireonabolgeyo.
B|그래. 꾸준함이 제일 중요해.|对，坚持最重要。|geurae. kkujunham-i jeil jungyohae.
A|병장님, 덕분에 마음이 좀 편해졌어요.|兵长，多亏了您我心里踏实多了。|byeongjangnim, deokbune maeumi jom pyeonhaejyeosseoyo.
B|별 거 아니야. 서로 도와가며 지내는 거지.|没什么，大家互相帮衬着过呗。|byeol geo aniya. seoro dowagamyeo jinaeneun geoji.

###런 온 Run On|初遇与误会|中
A|실례합니다, 혹시 기선겸 씨 맞으세요?|打扰一下，请问是奇善谦吗？|sillyehamnida, hoksi giseongyeom ssi maseuseyo?
B|네, 맞는데요. 어디서... 뵌 적이 있나요?|是的，请问您是……见过面吗？|ne, manneundeyo. eodiseo... boen jeogi innayo?
A|저 오미자예요. 영화 번역가라고 하셨죠?|我是吴美姿，您说自己是电影翻译家吧？|jeo omijayaeyo. yeonghwa beonyeokgarago hasyeotjyo?
B|아, 그때 그 사람이군요. 만나서 반갑습니다.|啊，原来是那时候那位，很高兴见到你。|a, geuttae geu saram-i-gunyo. mannaseo bangapseumnida.
A|저도 반가워요. 근데 왜 이렇게 자주 마주치죠?|我也很高兴，不过为什么总碰见你？|jeodo bangapaeyo. geunde wae ireoke jaju machijyo?
B|우리 사는 동네가 가까워서 그런가 봐요.|可能是因为我们住的社区近吧。|uri saneun dongnega gakkawaseo geureonga bwayo.
A|그런가요. 그럼 이 동네가 참 좋네요.|这样啊，那这个社区真不错呢。|geureongayo. geureom i dongnega cham jokneyo.
B|네, 조용하고 사람들도 친절해요.|嗯，很安静，人们也很亲切。|ne, joyonghago saramdeuldo chinjeolhaeyo.

###런 온 Run On|操场告白|高
A|저는 달리는 게 좋았어요. 숨이 차도 계속 달렸죠.|以前我喜欢跑步，就算喘不过气也一直跑。|jeoneun dallineun ge joasseoyo. sum-i chado gyesok dalyeotjyo.
B|그런데 이제는 그만둔 이유가 있나요?|那现在放弃的理由是什么呢？|geundeon ijeneun geumandun iyuga innayo?
A|다치고 나서 생각이 바뀌었어요. 새로운 길도 괜찮을 것 같아요.|受伤之后想法变了，觉得新路也不错。|dachigo naseo saenggagi bakkwoosseoyo. saeroun gil-do gwaenchanheul geot gateoyo.
B|저는 당신이 다시 달리는 모습을 보고 싶어요.|我想看你重新奔跑的样子。|jeoneun dangsin-i dasi dallineun moseubeul bogo sipeoyo.
A|당신이 옆에서 응원해 주실래요?|你能在旁边为我加油吗？|dangsin-i yeop-eseo eungwonhae jusillaeyo?
B|물론이죠. 언제든지 달려요, 저도 같이 뛸게요.|当然，随时跑吧，我也会一起跑。|muronijyo. eonjedeunji dallyeoyo, jeodo gachi ttwilgeyo.
A|그 말 듣고 싶었어요. 정말 고마워요.|我就是想听这句话，真的很感谢。|geu mal deug sipeosseoyo. jeongmal gomawoyo.
B|오늘부터 저도 러닝메이트예요.|从今天起我也是你的跑步搭档了。|oneulbuteo jeodo heoninmeiteu-yeyo.

###그녀는 예뻤다 她很漂亮|初恋重逢|中
A|야, 너 정말 그때 그 아이 맞아?|喂，你真的是那时候那个孩子吗？|ya, neo jeongmal geuttae geu ae maa?
B|응, 맞아. 오랜만이야. 많이 변했지?|嗯，是我，好久不见，变了很多吧？|eung, maa. oraenman-iya. mani byeonhaetji?
A|솔직히 너무 예뻐져서 놀랐어.|说实话，你变漂亮得让我吓一跳。|soljikhi neomu yeppeojyeoseo nollasseo.
B|너도 그때보다 훨씬 잘생겨졌어.|你也比那时候帅多了。|neo-do geuttaeboda hwam jalsaenggyeojyeosseo.
A|그때 내가 편지 썼던 거 기억나?|还记得我那时候写的信吗？|geuttae naega pyeonji sseoss-eon geo gieongna?
B|응, 다 기억해. 근데 답장을 못 보냈지.|嗯，都记得，不过我没能回信。|eung, da gieonghae. geunde dapjangeul mot bonaetji.
A|괜찮아. 이제 다시 시작하면 돼.|没关系，现在重新开始就好。|gwaenchana. ijae dasi sijakhameon doe.
B|그럼 이번엔 내가 먼저 연락할게요.|那这次我先联系你。|geureom ibeon-en naega meonjeo yeonnakhallgeyo.

###오징어 게임 鱿鱼游戏|生死游戏前夜|高
A|저 사람들 다 돈이 급한 사람들이에요?|那些人都是急需钱的人吗？|jeo saramdeul da don-i geuphan saram-deur-ieyo?
B|네, 다들 이유가 있겠죠. 저도 예외는 아니고요.|嗯，大家都有各自的理由吧，我也不例外。|ne, dadeul iyuga itgetjyo. jeodo yeoeneun anigo-yo.
A|이 게임, 진짜 목숨을 건 거예요?|这游戏，真的是拿命在赌吗？|i geim, jinjja moksum-eul geon geoyeyo?
B|그럴 리 없어요. 설마 사람을 죽이겠어요?|不会吧，难道真的会杀人吗？|geureol ri eopseoyo. seolma saram-eul jugigesseoyo?
A|저는 불안해요. 나가고 싶어요.|我很不安，想出去。|jeoneun bulgeonhaeyo. nagago sipeoyo.
B|나가려면 상금을 포기해야 해요. 다시 생각해 봐요.|要走就得放弃奖金，再想想吧。|nagaryeomyeon sanggeumeul pogihaeyo. dasi saenggakhae bwayo.
A|돈보다 목숨이 중요하잖아요!|命比钱重要啊！|donboda moksum-i jungyohajana-yo!
B|알아요. 하지만 여기서 나가면 아무것도 못 가져가요.|我知道，但从这里出去就什么都拿不到了。|arayo. hajiman yeogiseo nagamyeon amugeotdo mot gajyeogayo.

###더 글로리 黑暗荣耀|复仇对峙|高
A|너도 결국 내가 만든 거야. 난 네 인생을 망가뜨렸어.|你也是我造成的，我毁了你的人生。|neo-do gyeolguk naega mandeun geoya. nan ne insaeng-eul manggatyeosseo.
B|맞아. 근데 그 덕분에 지금의 내가 있지.|没错，不过正因为如此才有现在的我。|maja. geunde geu deokbune jigeum-ui naega itji.
A|복수가 끝나면 뭐가 남을 거 같아?|复仇结束后你觉得会剩下什么？|boksu-ga kkeutnamyeon mwaga nam-eul geot gata?
B|남는 건 없어. 그래도 멈출 수 없어.|什么都不会剩下，但我停不下来。|namneun geon eopseo. geuraedo meomchul su eopseo.
A|너는 행복한 적이 있었어?|你曾经幸福过吗？|neoneun haengbokhan jeogi isseosseo?
B|행복? 그건 나랑 상관없는 단어야.|幸福？那是和我无关的词汇。|haengbok? geugeon nawa sanggwan-eomneun dan-eoya.
A|그럼 이제 어떻게 할 거야?|那接下来你打算怎么办？|geureom ijae eotteoke hal geoya?
B|내가 해야 할 일을 끝내는 거야. 끝까지.|把我该做的事做完，到底。|naega hae-ya hal il-eul kkeutnaeneun geoya. kkeutkkaji.

###상속자들 继承者们|校园初遇|中
A|저기, 혹시 2학년이세요? 저 같은 반인데 기억 안 나세요?|那个，请问你是二年级的吗？我是同班的，不记得我了吗？|jeogi, hoksi i-hangniseyo? jeo gatan bamin gieok an naseyo?
B|아, 미안해요. 사람이 너무 많아서 잘 못 봤네요.|啊，抱歉，人太多了没看清。|a, mianhaeyo. sarami neomu manaseo jal mot bwayetneyo.
A|괜찮아요. 저 김탄이라고 해요.|没关系，我叫金叹。|gwaenchanayo. jeo gimtan-irago haeyo.
B|저는 차은상이에요. 만나서 반가워요.|我是车恩尚，很高兴认识你。|jeoneun chaeunsang-ieyo. mannaseo bangapaeyo.
A|반가워요. 혹시 점심시간인데 같이 먹을래요?|我也很高兴，午饭时间到了要一起吃吗？|bangapaeyo. hoksi jeomsimsigan-in gachi meogullae-yo?
B|아니요, 괜찮아요. 저 오늘 약속이 있어서요.|不用了，我今天有约。|aniyo, gwaenchanayo. jeo oneul yaksogi isseoseoyo.
A|그럼 다음에 기회가 되면 꼭 같이 먹어요.|那下次有机会一定一起吃。|geureom daeum-e gihoega doemyeon kkok gachi meogeoyo.
B|네, 그럼요. 먼저 갈게요.|好，那先走了。|ne, geureomyo. meonjeo galgeyo.

###내 이름은 김삼순 我叫金三顺|蛋糕店日常|初
A|어서 오세요. 케이크 주문하시나요?|欢迎光临，是来订蛋糕的吗？|eoseo oseyo. keikeu jumunhasinayo?
B|네, 생일 케이크 하나 주문하고 싶어요.|嗯，我想订一个生日蛋糕。|ne, saengil keikeu hana jumunhago sipeoyo.
A|손님 몇 명이세요? 크기는 어떻게 할까요?|请问几位客人？尺寸要做多大？|sonnim myeot myeong-iseyo? keugineun eotteoke halkkayo?
B|다섯 명 정도이고, 2호 크림 케이크로 주세요.|五个人左右，要2号奶油蛋糕。|daseot myeong jeongdoigo, i-ho keurim keikeuro juseyo.
A|문구는 뭐라고 쓸까요?|上面写什么字呢？|munguneun mwarago sseulkkayo?
B|생일 축하해 라고 써 주세요.|请写"生日快乐"。|saengil chukhaehae rago sseo juseyo.
A|알겠습니다. 내일 오후에 찾으러 오시면 됩니다.|好的，明天下午来取就行。|algesseumnida. naeil ohu-e chajeureo osimyeon doemnida.
B|감사합니다. 기대할게요!|谢谢，很期待！|gamsahamnida. gidaehalgeyo!

###커피프린스 1호점 咖啡王子一号店|咖啡店里|初
A|어서 오세요! 무엇을 드시겠어요?|欢迎光临！您要点什么？|eoseo oseyo! mueoseul deusigesseoyo?
B|아이스 아메리카노 한 잔 주세요.|请给我一杯冰美式。|aiseu amerikano han jan juseyo.
A|샷 추가하시겠어요? 오늘 원두가 아주 좋아요.|要加浓缩吗？今天的豆子很好。|syeok chugahasigesseoyo? oneul wonduga aju joayo.
B|아니요, 그냥 주세요. 그리고 이 자리에서 마실게요.|不用了，就普通的。我在这喝。|aniyo, geunyang juseyo. geurigo i jarieseo masilgeyo.
A|여기 따뜻한 물도 준비해 드릴게요.|我给您也准备一杯温水。|yeogi ttatteuthan mul-do junbihae deurilgeyo.
B|아, 감사합니다. 정말 친절하시네요.|啊，谢谢，您真亲切。|a, gamsahamnida. jeongmal chinjeolhasineyo.
A|필요하신 거 있으면 언제든 말씀해 주세요.|有需要随时叫我。|piryohasin ge isseumyeon eonjedeun malsseumhae juseyo.
B|네, 잘 먹을게요.|好，我慢慢喝。|ne, jal meogeulgeyo.

###닥터스 医生们|医院查房|高
A|환자 상태에 특별한 변화가 있나요?|患者情况有什么特别变化吗？|hwanja sangtae-e teukbyeolhan byeonhwaga innayo?
B|네, 오늘 아침부터 열이 조금 떨어졌습니다.|是，今天早上开始烧稍微退了。|ne, oneul achim-buteo yeori jogeum tteoreojyeosseumnida.
A|좋습니다. 약물 투여는 그대로 유지하세요.|很好，药物维持原剂量。|johtseumnida. yakmul tuyeoneun geudaero yujihaseyo.
B|알겠습니다. 혹시 검사를 더 해 볼까요?|明白，要不要再做些检查？|algesseumnida. hoksi geomseareul deo hae bolkkayo?
A|그렇게 하죠. 결과가 나오면 바로 저에게 보고해 주세요.|就这么办，结果出来立刻向我报告。|geureoke hajo. gyeolga-ga naomyeon baro jeogege bogohae juseyo.
B|네, 알겠습니다. 바로 연락드리겠습니다.|好的，我立刻联系您。|ne, algesseumnida. baro yeonrakdeurigesseumnida.
A|수고하셨습니다. 환자도 많이 안정됐어요.|辛苦了，患者也稳定多了。|sugohasyeosseumnida. hwanjado mani anjeongdwae-sseoyo.
B|감사합니다. 덕분에 저도 안심이 됩니다.|谢谢，我也放心了。|gamsahamnida. deokbune jeodo ansim-i doemnida.

`.trim();

// 解析韩剧台词库
const DRAMA_GROUPS = DRAMA_RAW.split(/^###/m).filter(b => b.trim()).map(block => {
  const lines = block.trim().split('\n');
  const [drama, theme, level] = lines[0].split('|');
  const dialog = lines.slice(1).filter(l => l.trim()).map(l => {
    const [speaker, ko, cn, roman] = l.split('|');
    return { speaker, ko, cn, roman };
  });
  return { drama, theme, level, dialog };
});

/* ============================================================
   韩剧角色声线配置
   说明：浏览器 TTS 无法直接播放受版权保护的原剧音频，
        这里按主角声线特征（性别/音调/语速）模拟朗读，
        并提供国内平台原剧片段链接，点击可听真实原声。
   ============================================================ */
const DRAMA_VOICE = {
  '도깨비 鬼怪':                    { clip:'https://search.bilibili.com/all?keyword=%EA%B6%8C%EA%B0%80%EB%B9%84%20%EB%AA%85%EC%9E%A5' },
  '태양의 후예 太阳的后裔':         { clip:'https://search.bilibili.com/all?keyword=%ED%83%9C%EC%96%91%EC%9D%98%20%ED%9B%84%EC%98%88%20%EB%AA%85%EC%9E%A5' },
  '별에서 온 그대 来自星星的你':    { clip:'https://search.bilibili.com/all?keyword=%EB%B3%84%EC%97%90%EC%84%9C%20%EC%98%A8%20%EA%B7%B8%EB%8C%80%20%EB%AA%85%EC%9E%A5' },
  '응답하라 1988 请回答1988':       { clip:'https://search.bilibili.com/all?keyword=%EC%9D%91%EB%8B%B5%ED%95%98%EB%9D%BC%201988%20%EB%AA%85%EC%9E%A5' },
  '사랑의 불시착 爱的迫降':         { clip:'https://search.bilibili.com/all?keyword=%EC%82%AC%EB%9E%91%EC%9D%98%20%EB%B6%88%EC%8B%9C%EC%B0%AE%20%EB%AA%85%EC%9E%A5' },
  '빈센조 文森佐':                  { clip:'https://search.bilibili.com/all?keyword=%EB%B9%88%EC%B2%9C%EC%A1%8C%20%EB%AA%85%EC%9E%A5' },
  '호텔 델루나 德鲁纳酒店':         { clip:'https://search.bilibili.com/all?keyword=%ED%98%B8%ED%85%94%20%EB%8B%AC%EB%A3%A8%EB%82%98%20%EB%AA%85%EC%9E%A5' },
  '스물다섯 스물하나 二十五二十一': { clip:'https://search.bilibili.com/all?keyword=%EC%8A%A4%EB%AC%B8%EB%8B%A4%EC%84%AF%20%EC%8A%A4%EB%AC%B8%ED%95%98%EB%82%98%20%EB%AA%85%EC%9E%A5' },
  '김비서가 왜 그럴까 金秘书为何那样':{ clip:'https://search.bilibili.com/all?keyword=%EA%B9%80%EB%B9%84%EC%84%9C%EA%B0%80%20%EC%99%9C%20%EA%B7%B8%EB%9F%B4%EA%B9%8C%20%EB%AA%85%EC%9E%A5' },
  '미생 未生':                      { clip:'https://search.bilibili.com/all?keyword=%EB%AF%B8%EC%83%9D%20%EB%AA%85%EC%9E%A5' },
  '응답하라 1997 请回答1997':      { clip:'https://search.bilibili.com/all?keyword=%EC%9D%91%EB%8B%B5%ED%95%98%EB%9D%BC%201997%20%EB%AA%85%EC%9E%A5' },
  '슬기로운 감빵생활 机智的监狱生活':{ clip:'https://search.bilibili.com/all?keyword=%EC%8A%A4%EB%A6%AC%EB%A1%9C%EC%9A%B4%20%EA%B0%90%EB%B9%B5%EC%83%9D%ED%99%9C%20%EB%AA%85%EC%9E%A5' },
  '런 온 Run On':                   { clip:'https://search.bilibili.com/all?keyword=%EB%9F%B0%EC%98%A8%20%EB%AA%85%EC%9E%A5' },
  '그녀는 예뻤다 她很漂亮':         { clip:'https://search.bilibili.com/all?keyword=%EA%B7%B8%EB%85%B8%EB%8A%94%20%EC%98%88%EB%B9%97%EB%8B%A4%20%EB%AA%85%EC%9E%A5' },
  '오징어 게임 鱿鱼游戏':           { clip:'https://search.bilibili.com/all?keyword=%EC%98%A4%EC%A7%95%EC%96%B4%20%EA%B2%8C%EC%9E%84%20%EB%AA%85%EC%9E%A5' },
  '더 글로리 黑暗荣耀':             { clip:'https://search.bilibili.com/all?keyword=%EB%8D%94%20%EA%B8%80%EB%A1%9C%EB%A6%AC%20%EB%AA%85%EC%9E%A5' },
  '상속자들 继承者们':              { clip:'https://search.bilibili.com/all?keyword=%EC%83%81%EC%86%8D%EC%9E%90%EB%93%A4%20%EB%AA%85%EC%9E%A5' },
  '내 이름은 김삼순 我叫金三顺':     { clip:'https://search.bilibili.com/all?keyword=%EB%82%B4%20%EC%9D%B4%EB%A6%84%EC%9D%80%20%EA%B9%80%EC%82%BC%EC%88%9C%20%EB%AA%85%EC%9E%A5' },
  '커피프린스 1호점 咖啡王子一号店': { clip:'https://search.bilibili.com/all?keyword=%EC%BB%A4%ED%94%BC%ED%94%84%EB%A6%B0%EC%8A%A4%201%ED%98%B8%EC%A0%90%20%EB%AA%85%EC%9E%A5' },
  '닥터스 医生们':          { clip:'https://search.bilibili.com/all?keyword=%EB%8B%A5%ED%84%B0%EC%8A%A4%20%EB%AA%85%EC%9E%A5' }
};
