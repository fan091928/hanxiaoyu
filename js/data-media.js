/* ============================================================
   韩小语 · 本地听力/跟唱素材库
   全部为自建内容（韩语 + 罗马音 + 中文），点读即真人女声 TTS。
   - KPOP_SONGS：热门 K-POP 60 首，含跟唱金句 + 发音学习
   - VARIETY_CLIPS：韩综精选片段对话
   - LOCAL_SCRIPTS：影子跟读/广播/播客/课程等本地文案
   注：仅 TOPIK 真题保留外部跳转，其余全部本地可点读。
   ============================================================ */

/* ---------- 热门 K-POP 60 首（自建跟唱金句）----------
   格式：韩文歌名|英文名|歌手|等级|年份|金句1韩|金句1罗马|金句1中|金句2韩|金句2罗马|金句2中
*/
const KPOP_RAW = `
봄날|Spring Day|BTS 방탄소년단|初级|2017|보고 싶다|bogo sipda|想你|봄날은 간다|bomnal-eun ganda|春天走了
피 땀 눈물|Blood Sweat & Tears|BTS 방탄소년단|中级|2016|피 땀 눈물|pi ttam nunmul|血汗泪|내가 선 이 길|naega seon i gil|我选的这条路
작은 것들을 위한 시|Boy With Luv|BTS 방탄소년단|初级|2019|모든 것이 다 새로운|modeun geosi da saeroun|一切都是崭新的|너와 나|neowa na|你和我
두두두두|DDU-DU DDU-DU|BLACKPINK|初级|2018|착한 얼굴에|chakhan eolgule|乖巧外表下|우린 예쁘장한 savage|urin yeppeujathan savage|我们是漂亮的野性
소원을 말해봐|Genie|소녀시대 少女时代|中级|2009|그래요 난 널 사랑해|geuraeyo nan neol sarathae|是的 我爱你|난 그대 소원을 이뤄주고 싶은|nan geudae sowoneul irwojugo sieun|我想为你实现心愿
하우 유 라이크 댓|How You Like That|BLACKPINK|初级|2020|보란 듯이 무너졌어|boran deusi muteojyeosseo|堂堂正正地崩塌吧|실컷 비웃어라 꼴좋으니까|silkeot biuteora kkoljoeunikka|尽情嘲笑吧反正我活该
소녀시대|Girls Generation|소녀시대 少女时代|初级|2007|어리다고 놀리지 말아요|eoridago nolriji malayo|别说我年纪小就取笑我|스쳐가는 얘기 뿐인걸|seuchyeoganeun yaegi ppuningeol|只是擦肩而过的话题而已
마지막처럼|As If It's Your Last|BLACKPINK|初级|2017|너 뭔데 자꾸 생각나|neon mwonde jakku saenggangna|你算什么总让我想起|거짓말처럼 키스해줘 내가 너에게|geojitmalcheoreom kiseuhaejwo naega neoege|像谎言般吻我吧轮到我
치어럽|Cheer Up|TWICE|初级|2016|샤샤샤|syasyasya|沙沙沙|청춘은 신나|cheongchuneun sinna|青春真欢乐
티티|TT|TWICE|初级|2016|티티|titi|TT|보고 싶은 맘|bogo sipeun mam|想念的心
시그널|Signal|TWICE|初级|2017|시그널|sigineol|信号|너의 마음 읽어|neoui maeum ilgeo|读懂你的心
판시|FANCY|TWICE|中级|2019|판시|pansi|幻想|내 맘대로|nae mamdaero|随我心意
오엠지|OMG|NewJeans|初级|2023|이 노래는 it's about you baby|i notaeneun its about you baby|这首歌是关于你的baby|단 너뿐이야|dan neoppuniya|只有你一个
슈퍼 쉬|Super Shy|NewJeans|初级|2023|떨리는 지금도|tteollineun jigeumdo|颤抖的此刻也|Super shy super shy|Super shy super shy|超级害羞 超级害羞
쿠키|Cookie|NewJeans|初级|2022|내가 만든 쿠키|naega madeon kuki|我亲手做的饼干|달콤한 맛만 디저트만 만|dalkomhan matman tijeoteuman man|只有甜味只有甜点
새비지|Savage|aespa|中级|2020|새비지|saebiji|野性|나는 나|naneun na|我就是我
스파이시|Spicy|aespa|初级|2023|스파이시|seupaisi|辛辣|매운 맛|maeun mat|辣的味道
드라마|Drama|aespa|中级|2024|드라마|deurama|戏剧|환영해|hwanyeonghae|欢迎
톰보이|Tomboy|(G)I-DLE|初级|2022|톰보이|tombo-i|假小子|나는 톰보이|naneun tombo-i|我是假小子
퀸카|Queencard|(G)I-DLE|初级|2023|퀸카|kwinka|女王卡|나는 퀸카|naneun kwinka|我是女王
더 보이즈|The Boys|소녀시대 少女时代|中级|2011|전 세계가 너를 주목해|jeon segyega neoreul jumokhae|全世界都注视着你|내가 이끌어 줄게 come out|naega ikkeuleo julge come out|我来带你走出来吧
오!|Oh!|소녀시대 少女时代|初级|2010|전에 알던 내가 아냐 Brand New Sound|jeone aldeon naega anya Brand New Sound|已不是从前的我 Brand New Sound|오빠 잠깐만 잠깐만 들어봐|oppa jatkkanman jatkkanman deuleobwa|哥哥 等一下 等一下 听我说
다시 만난 세계|Into the New World|소녀시대 少女时代|中级|2007|희미한 빛을 난 쫓아가|huimihan biteul nan jjotaga|我追寻着那微弱的光|변치않을 사랑으로 지켜줘|byeonchianeul sarateuro jikyeojwo|用不变的爱守护我吧
나를 보여줄게|I Will Show You|에일리 Ailee|中级|2015|보여줄게|boyeojulge|展示给你看|훨씬 더 예뻐진 나|hwolssin deo yeppeojin na|变得更美的我
네가 참 궁금해|LOVE DIVE|IVE 아이브|初级|2022|네가 참 궁금해|nega chat gutgeuthae|我对你充满好奇|숨 참고 love dive|sut chatgo love dive|屏住呼吸 love dive
쏘리 쏘리|Sorry Sorry|SUPER JUNIOR|初级|2009|미안해|mianhae|对不起|내가 내가 내가 먼저|naega naega naega meonjeo|是我先
배터 업|BATTER UP|베이비몬스터 BABYMONSTER|初级|2023|예쁘고 착한 내가 어떻게 변할지 monster|yeppeugo chakhan naega eotteoge byeonhalji monster|漂亮善良的我会变成什么样 monster|좀 더 강하게|jot deo gathage|再强烈一点
리얼리 라이크 유|Really Like You|베이비몬스터 BABYMONSTER|初级|2024|말하고 싶어|malhago sieo|我想对你说|추워 나 감기고 싶어|chuwo na gatgigo sieo|好冷 我想感冒
음악의 신|God of Music|세븐틴 SEVENTEEN|中级|2023|세상에 음악의 신이 있다면|sesate eutakui sini ikdamyeon|如果世上真有音乐之神|음|eut|嗯
손오공|Super|세븐틴 SEVENTEEN|中级|2023|영웅본색 Like This|yeotutbonsaek Like This|英雄本色 Like This|포기를 모르고 날뛰는 중|pogireul moreugo nalttwineun jut|也不知放弃 正在飞奔
핫|HOT|세븐틴 SEVENTEEN|中级|2022|밤이 없는 낮 하늘은 붉은색|bati eotneun nap haneuleun buleunsaek|没有夜晚的白昼 天空赤红|태양 위를 달리는 마차|taeyat wireul dalrineun macha|在太阳上奔跑的马车
스윗 독|Sweet Venom|엔하이픈 ENHYPEN|中级|2023|데려가 새로운 세계로|deryeoga saeroun segyero|带你去全新的世界|입술은 여전히 널 불러|ingsuleun yeojeonhi neol bulreo|双唇依然呼唤着你
갓스 메뉴|God's Menu|Stray Kids|中级|2020|갓스 메뉴|goseu menyu|神之菜单|맛있어|masisseo|好吃
러브 인 마이 하트|Love in My Heart|베이비몬스터 BABYMONSTER|初级|2024|어떤 말도 들리질 않아|eotteon maldo deulrijil ana|任何话都听不见|내 맘은 불길처럼|nae mateun bulgilcheoreot|可我的心像火焰
다른 문을 열어|I AM|IVE 아이브|初级|2023|다른 문을 열어|dareun muneul yeoleo|推开另一扇门|I'm on my way 넌 그냥 믿으면 돼|I'm on my way neon geunyat miteumyeon dwae|I'm on my way 你只要相信就好
눈, 코, 입|眼鼻嘴|TAEYANG 太阳|中级|2014|사랑해 사랑했지만|sarathae sarathaekjiman|爱你 虽然爱过|이젠 널 추억이라 부를게|ijen neol chueokira bureulge|如今我会称你为回忆
굿 보이 고너 배드|Good Boy Gone Bad|TXT (TOMORROW X TOGETHER)|中级|2022|나쁜 아이|nappeun ai|坏孩子|변했어|byeonhaesseo|变了
애텐션|Attention|NewJeans|初级|2022|가끔은 정말|gakkeuteun jeotmal|偶尔真的|내 맘은 설레이지|nae mateun seolreiji|我的心在悸动
배드 보이|Bad Boy|Red Velvet|中级|2018|나는 배드 보이|naneun baedeu boi|我是坏男孩|두근거려|dungeungeoryeo|心跳加速
피어리스|Fearless|LE SSERAFIM|中级|2022|나는 두렵지 않아|naneun duryeopji ana|我无所畏惧|앞으로 가|apeuro ga|向前走
언포기븐|Unforgiven|LE SSERAFIM|中级|2023|용서하지 않아|yongseohaji ana|不会原谅|나는 강해|naneun ganghae|我很坚强
슈퍼 레이디|Super Lady|(G)I-DLE|中级|2024|나는 슈퍼 레이디|naneun syupeo reidi|我是超级女士|당당해|dangdanghae|自信满满
지니|Gee|少女时代|初级|2009|지지지 지니|jijiji jini|Gee Gee Gee Gee|너의 마음|neoui maeum|你的心
눈꽃|Nu ABO|f(x)|中级|2010|나는 특별해|naneun teukbyeolhae|我很特别|새로운 세계|saeroun segye|新世界
해피니스|Happiness|Red Velvet|初级|2014|행복해|haengbokhae|幸福|웃어|useo|笑吧
러시안 룰렛|Russian Roulette|Red Velvet|中级|2016|러시안 룰렛|reosian rullet|俄罗斯轮盘|같이 가자|gachi gaja|一起走吧
밤편지|夜信|IU 아이유|初级|2017|난 파도가 머물던|nan padoga meomuldeon|我曾像那停留在浪里的|모래 위에 적힌 글씨처럼|morae wie jeokhin geulssicheoreot|写在沙滩上的字一样
팔레트|Palette|IU 아이유|初级|2017|좀 짓궂은 장난들|jot jitgupeun jatnandeul|那些有点促狭的玩笑|날 좋아하는 거 알아|nal joahaneun geo ala|我知道你喜欢我呀
좋은 날|好日子 Good Day|IU 아이유|初级|2010|눈물이 차올라서 고갤 들어|nunmuli chaolraseo gogael deuleo|眼泪涌上来 便抬起了头|흐르지 못하게 또 살짝 웃어|heureuji mothage tto saljjak uteo|为了不让它落下 又轻轻一笑
사계|四季 Four Seasons|태연 太妍|中级|2019|내 겨울을 주고 또 여름도 주었지|nae gyeouleul jugo tto yeoreutdo jueokji|我把冬天给了你 连夏天也给了|뜨겁고 차갑던 그 계절에|tteugeonggo chagangdeon geu gyejeole|在那个又热又冷的季节里
인뷰|INVU|태연 太妍|中级|2022|난 너를 못 이겨|nan neoreul mot igyeo|我也赢不了你|넌 반짝이는 아이러니|neon banjjakineun aireoni|你越闪闪发亮 多讽刺
한숨|叹息 Breathe|이하이 Lee Hi|中级|2016|그 무거운 숨을|geu mugeoun suteul|那沉重的呼吸|헤아릴 수가 있을까요|hearil suga ikeulkkayo|能体量得尽呢
양화대교|杨花大桥|자이언티 Zion.T|中级|2015|아프지 말고 좀 아프지 말고|apeuji malgo jot apeuji malgo|别疼了 求你别再疼了|행복하자 행복하자|haetbokhaja haetbokhaja|要幸福啊 要幸福啊
모든 날 모든 순간|所有日子所有瞬间|폴킴 Paul Kim|初级|2018|나는 너 하나로 충분해|naneun neo hanaro chutbunhae|我只要有你一个就足够了|긴 말 안 해도 눈빛으로 다 아니깐|gin mal an haedo nunbiteuro da anikkan|不用多说 一个眼神就都懂
비도 오고 그래서|因为下雨所以|헤이즈 Heize|中级|2017|비도 오고 그래서|bido ogo geuraeseo|下起了雨 所以呢|네 생각이 났어|ne saetgaki nakeo|就想起了你
광화문에서|在光化门|규현 圭贤|中级|2014|그 자리에 서 있는|geu jarie seo ikneun|就站在那个位置|비가 내리면 흠뻑 젖으며|biga naerimyeon heutppeok jeopeumyeo|一下起雨 就淋得湿透
어떻게 이별까지 사랑하겠어|怎能连离别都爱你|악뮤 AKMU 乐童音乐家|中级|2019|일부러 몇 발자국 물러나|ilbureo myeot baljaguk mulreona|故意往后退了几步|내가 없이 혼자 걷는 널 바라본다|naega eoti honja geotneun neol barabonda|望着没有我 独自走着的你
후라이의 꿈|Fry's Dream|악뮤 AKMU 乐童音乐家|初级|2023|난 차라리 흘러갈래|nan charari heulreogalrae|我宁可随波流走|모두 높은 곳을 우러러볼 때|modu noeun goteul ureoreobol ttae|当所有人都仰望高处时
가시나|Gashina|선미 宣美|中级|2017|왜 예쁜 날 두고 가시나|wae yeppeun nal dugo gasina|怎么抛下这么美的我就走了呢|날 두고 가시나|nal dugo gasina|就这么把我丢下了吗
벌써 12시|已经12点 Gotta Go|청하 请夏|中级|2018|음악에 맞춰 사랑을 속삭이고 싶어|eutake mapchwo sarateul soksakigo sieo|想和着音乐 轻声说些情话|솔직히 우리 둘 맘이 같은 걸|soljikhi uri dul mati gaeun geol|老实说 我们俩心意是一样的
`;
const KPOP_SONGS = KPOP_RAW.trim().split('\n').map((line, id) => {
  const p = line.split('|');
  return {
    id: id + 1, ko: p[0], title: p[1], artist: p[2], level: p[3], year: p[4],
    lines: [
      { ko: p[5], roman: p[6], cn: p[7] },
      { ko: p[8], roman: p[9], cn: p[10] }
    ]
  };
});

/* ---------- 韩综精选片段（自建对话）----------
   格式：节目|主题|等级|说话人:韩语|罗马音|中文;;说话人:韩语|罗马音|中文;;...
*/
const VARIETY_RAW = `
런닝맨|见面打招呼|初级|지석진:안녕하세요! 반갑습니다.|annyeonghaseyo! bangapseumnida.|你好！很高兴见面。;;유재석:오늘 컨디션 어때요?|oneul keondisyeon eottaeyo?|今天状态怎么样？;;개리:아주 좋아요! 기분 최고예요.|aju joayo! gibun choegoyeyo.|非常好！心情最棒。
무한도전|接受任务|中级|정형돈:이번 미션 뭐예요?|ibeon misyeon mwoyeyo?|这次任务是什么？;;유재석:서울에서 부산까지 가는 거예요.|seoureo busan kkaji ganeun geoyeyo.|从首尔到釜山。;;정준하:아이고, 힘들겠네요.|aigo, himdeulgenneyo.|哎呀，看来很累呢。
1박 2일|出发旅行|初级|강호동:자, 출발합시다!|ja, chulbalhapsida!|好，出发吧！;;이수근:배고파요. 뭐 먹어요?|baegopayo. mwo meogeoyo?|我饿了，吃点什么？;;김종민:김치찌개 어때요?|gimchijjigae eottaeyo?|泡菜汤怎么样？
아는 형님|互相调侃|中级|강호동:너 오늘 왜 이렇게 늦었어?|neo oneul wae ireoke neujeoss-eo?|你今天怎么这么晚？;;서인국:교통 체증이 심했어요.|gyotong chejeung-i simhaesseoyo.|交通堵得厉害。;;이영자:그래도 잘 왔으니까 됐어.|geuraedo jal wass-eunikka dwaesseo.|不过来了就好。
유 퀴즈 온 더 블럭|人生故事|中级|유재석:오늘 이야기 주제가 뭔가요?|oneul iyagi jujega mongayo?|今天故事主题是什么？;;조세호:팬들과의 특별한 추억이요.|paendeulgwaui teukbyeolhan chueog-iyo.|和粉丝们的特别回忆。;;유재석:정말 감동적이네요.|jeongmal gamdongjeogineyo.|真的很感人。
나 혼자 산다|独居日常|初级|화사:오늘 아침 뭐 먹었어요?|oneul achim mwo meogeoss-eoyo?|今天早上吃了什么？;;박나래:간단히 토스트 먹었어요.|gandanhi toseuteu meogeoss-eoyo.|简单吃了吐司。;;화사:저도 아침 잘 먹어야겠어요.|jeodo achim jal meogeoyagesseoyo.|我也得好好吃早饭。
삼시세끼|做饭聊天|初级|차승원:김치찌개 끓일게요.|gimchijjigae kkeuilgeyo.|我来煮泡菜汤。;;은석:와, 냄새가 정말 좋아요!|wa, naesega jeongmal joayo!|哇，闻起来真香！;;차승원:밥 먹을 준비 다 됐어요?|bab meogeul junbi da dwaesseoyo?|准备好吃饭了吗？
효리네 민박|招待客人|中级|이효리:어서 오세요. 환영합니다.|eoseo oseyo. hwanyeonghamnida.|快请进，欢迎。;;이상순:차 한 잔 드릴까요?|cha han jan deurilkka-yo?|给您倒杯茶好吗？;;손님:감사합니다. 너무 편안해요.|gamsahamnida. neomu pyeonanhae-yo.|谢谢，太舒服了。
`;
const VARIETY_CLIPS = VARIETY_RAW.trim().split('\n').map((line, id) => {
  const p = line.split('|');
  // p[0]节目 p[1]主题 p[2]等级；其余用 ;; 分段，每段 说话人:韩语|罗马音|中文
  const rest = p.slice(3).join('|');
  const segs = rest.split(';;').filter(Boolean);
  const dialog = segs.map(seg => {
    const q = seg.split('|');
    const colon = q[0].indexOf(':');
    return {
      speaker: q[0].slice(0, colon),
      ko: q[0].slice(colon + 1),
      roman: q[1] || '',
      cn: q[2] || ''
    };
  });
  return { id: id + 1, show: p[0], theme: p[1], level: p[2], dialog };
});

/* ---------- 影子跟读 / 广播 / 播客 / 课程本地文案 ----------
   格式：类别|韩语|罗马音|中文
*/
const LOCAL_SCRIPT_RAW = `
影子跟读|처음 뵙겠습니다. 잘 부탁드려요.|cheoeum boepgetseumnida. jal butakdeuryeoyo.|初次见面，请多关照。
影子跟读|오늘 날씨가 정말 좋아요.|oneul nalssiga jeongmal joayo.|今天天气真好。
影子跟读|이것이 얼마인가요?|igeosi eolmangayo?|这个多少钱？
影子跟读|다시 한 번 말해 주세요.|dasi han beon malhae juseyo.|请再说一遍。
影子跟读|정말 감사합니다.|jeongmal gamsahamnida.|非常感谢。
影子跟读|어디에 가고 싶어요?|eodie gago sipeoyo?|想去哪里？
影子跟读|맛있게 드세요.|masitge deuseyo.|请慢用。
影子跟读|조심해서 가세요.|josimhaeseo gaseyo.|小心慢行。
影子跟读|또 만나요!|tto mannayo!|再见！
韩国广播|오늘의 날씨를 알려드리겠습니다.|oneurui nalssireul allyeodeurigetseumnida.|为您播报今日天气。
韩国广播|서울 지역은 맑고 쾌청하겠습니다.|seoul jiyeogeun maltgo kwaecheonghagetseumnida.|首尔地区晴朗清爽。
韩国广播|내일 아침부터 비가 내릴 예정입니다.|naeil achimbuto biga naeril yejeongimnida.|预计明早开始下雨。
韩国广播|교통 상황을 전해드립니다.|gyotong sanghwangeul jeonhaeodeurimnida.|为您播报交通状况。
韩国广播|지하철 2호선은 정상 운행 중입니다.|jihacheol i- hoseoneun jeongsang unhaeng jungimnida.|地铁2号线正常运行。
韩国广播|주요 뉴스를 전해드립니다.|juyo nyuseureul jeonhaeodeurimnida.|为您播报主要新闻。
韩国广播|경제 지표가 소폭 상승했습니다.|gyeongje jipyo ga sopok sangseunghaetseumnida.|经济指标小幅上升。
韩国广播|이상으로 뉴스를 마칩니다.|isang-euro nyuseureul machimnida.|新闻播报到此结束。
韩语播客|오늘은 한국 음식에 대해 이야기해요.|oneureun hanguk eumsige daehae iyagihaeyo.|今天聊聊韩国美食。
韩语播客|여러분의 생각은 어떠세요?|yeoreobunui saenggageun eottaeseyo?|大家觉得怎么样？
韩语播客|저는 김치찌개를 아주 좋아해요.|jeoneun gimchijjigaereul aju joahaeyo.|我非常喜欢泡菜汤。
韩语播客|한국어 공부는 꾸준함이 중요해요.|hangugeo gongbuneun kkujunham-i jungyohaeyo.|学韩语贵在坚持。
韩语播客|매일 조금씩 연습해 보세요.|maeil jeogeumssik yeonseuphae boseyo.|每天练习一点点吧。
韩语播客|이번 주 주제는 여행이에요.|ibeon ju jujeneun yeohaeng-ieyo.|这周的主题是旅行。
韩语播客|제 경험을 나눠볼게요.|je gyeongheomeul nanwobolgeyo.|分享我的经验。
韩语播客|다음 시간에 또 만나요.|daeum sigane tto mannayo.|下期再见。
系统课程|한글은 24개 기본 글자로 이루어져요.|hangeureun isip-sa gae gibon geuljaro ireojeoyo.|韩文由24个基本字母组成。
系统课程|모음은 21개, 자음은 19개예요.|moeumeun isip-han gae, jaeumeun sip-gu gaeyeyo.|元音21个，辅音19个。
系统课程|받침은 글자 아래에 오는 자음이에요.|batchim-eun geulja arae-e oneun jaeum-ieyo.|收音是位于字下方的辅音。
系统课程|연음 규칙을 알아볼까요?|yeoneum gyuchigeul arabolkkayo?|来了解一下连音规则吧。
系统课程|높임말은 상황에 따라 달라져요.|nopimmareun sanghwange ttara dallajyoyo.|敬语会根据场合变化。
系统课程|토픽 1급은 기초 회화를 다뤄요.|topik il-geubeun gicho hoebwareul dallwoyo.|TOPIK 1级涉及基础会话。
系统课程|단어는 문장 속에서 외우면 쉬워요.|daneoneun munjang sok-eseo oemyeon swiwoyo.|单词放在句子里记更容易。
系统课程|오늘 배운 내용을 복습해 보세요.|oneul baeun naeyongeul bokseuphae boseyo.|复习今天学的内容吧。
影子跟读|아침 일찍 일어나는 습관이 있어요.|achim iljjik ireonaneun seupgwani isseoyo.|我有早起的习惯。
影子跟读|가방 안에 책과 노트가 들어 있어요.|gabang an-e chaekgwa noteuga deul-eo isseoyo.|包里装着书和笔记本。
影子跟读|버스를 타고 회사에 가요.|beoseureul tago hoesae gayo.|坐公交车去公司。
影子跟读|저녁에 친구와 전화 통화를 했어요.|jeonyeoge chinguwa jeonhwa tonghwaleul haesseoyo.|晚上和朋友通了电话。
韩国广播|내일 오후부터 눈이 내릴 것으로 보입니다.|naeil ohubuteo nuni naeil geoseuro boimnida.|预计明天下午开始下雪。
韩国广播|오늘 교통이 다소 혼잡할 수 있습니다.|oneul gyotong-i daso honjaphal su itseumnida.|今天交通可能有些拥堵。
韩国广播|주말에는 공원에서 다양한 행사가 열립니다.|jumareneun gongwon-eseo dayanghan haengsaga yeollimnida.|周末公园将举办各种活动。
韩语播客|저는 매일 아침 커피를 한 잔 마셔요.|jeoneun maeil achim keopireul han jan masyeoyo.|我每天早上喝一杯咖啡。
韩语播客|한국 노래를 들으면서 발음을 연습해요.|hanguk noraereul deuleumyeonseo bareumeul yeonseuphaeyo.|听韩国歌曲练习发音。
韩语播客|여행 갈 때는 미리 계획을 세워요.|yeohaeng gal ttaeneun miri gyehoeg-eul sewoyo.|旅行时会提前做好计划。
系统课程|한국어 문장은 주어와 서술어가 중요해요.|hangugeo munjangeun jueowa seosureoga jungyohaeyo.|韩语中主语和谓语很重要。
系统课程|존댓말과 반말은 상황에 따라 써요.|jondaenmalgwa banmareun sanghwange ttara sseoyo.|敬语和平语按场合使用。
系统课程|단어를 외울 때는 예문과 함께 외우세요.|daneoreul oeul ttaeneun yemungwa hamkke ouseyo.|背单词时要连同例句一起背。
系统课程|매일 10분씩 복습하는 것이 효과적이에요.|maeil 10bunssik bokseuphaneun geosi hyogwajeog-ieyo.|每天复习10分钟很有效。
`;
const LOCAL_SCRIPTS = LOCAL_SCRIPT_RAW.trim().split('\n').map(line => {
  const [cat, ko, roman, cn] = line.split('|');
  return { cat, ko, roman, cn };
});
