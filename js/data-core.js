/* ============================================================
   韩小语 · 数据层 - 核心（四十音 / 收音 / 组合 / 短句 / 语法）
   ============================================================ */

// 启动弹窗名言（固定主推 + 备用轮换）
const QUOTES = [
  {
    ko: '천천히 가도 끝까지 가는 것이 빠른 것이다.',
    cn: '走得慢，但走到终点，才是真正的快。',
    cheerKo: '오늘도 화이팅! 💪',
    cheerCn: '今天也加油吧！每一次坚持，都在靠近更流利的自己。'
  },
  {
    ko: '하루의 작은 꾸준함이 큰 변화를 만든다.',
    cn: '每天一点点坚持，终会成就巨大的改变。',
    cheerKo: '오늘도 한 걸음! 🌱',
    cheerCn: '今天也往前一步吧！积累的力量超乎想象。'
  },
  {
    ko: '언어는 마음을 여는 열쇠다.',
    cn: '语言是打开心门的钥匙。',
    cheerKo: '화이팅! ✨',
    cheerCn: '加油！每学会一句，世界就更大一点。'
  }
];

// 21 个元音：char 字母, roman 罗马音, name 韩语名称, ex 例词, exCn 词义
const VOWELS = [
  { char: 'ㅏ', roman: 'a',   name: '아', ex: '아빠',   exCn: '爸爸', exRoman: 'appa' },
  { char: 'ㅑ', roman: 'ya',  name: '야', ex: '야구',   exCn: '棒球', exRoman: 'yagu' },
  { char: 'ㅓ', roman: 'eo',  name: '어', ex: '커피',   exCn: '咖啡', exRoman: 'keopi' },
  { char: 'ㅕ', roman: 'yeo', name: '여', ex: '여자',   exCn: '女人', exRoman: 'yeoja' },
  { char: 'ㅗ', roman: 'o',   name: '오', ex: '오이',   exCn: '黄瓜', exRoman: 'oi' },
  { char: 'ㅛ', roman: 'yo',  name: '요', ex: '요리',   exCn: '料理', exRoman: 'yori' },
  { char: 'ㅜ', roman: 'u',   name: '우', ex: '우유',   exCn: '牛奶', exRoman: 'uyu' },
  { char: 'ㅠ', roman: 'yu',  name: '유', ex: '유리',   exCn: '玻璃', exRoman: 'yuri' },
  { char: 'ㅡ', roman: 'eu',  name: '으', ex: '음악',   exCn: '音乐', exRoman: 'eumak' },
  { char: 'ㅣ', roman: 'i',   name: '이', ex: '이름',   exCn: '名字', exRoman: 'ireum' },
  { char: 'ㅐ', roman: 'ae',  name: '애', ex: '개',     exCn: '狗',   exRoman: 'gae' },
  { char: 'ㅒ', roman: 'yae', name: '얘', ex: '얘기',   exCn: '故事', exRoman: 'yaegi' },
  { char: 'ㅔ', roman: 'e',   name: '에', ex: '게',     exCn: '螃蟹', exRoman: 'ge' },
  { char: 'ㅖ', roman: 'ye',  name: '예', ex: '예',     exCn: '是',   exRoman: 'ye' },
  { char: 'ㅘ', roman: 'wa',  name: '와', ex: '과일',   exCn: '水果', exRoman: 'gwail' },
  { char: 'ㅙ', roman: 'wae', name: '왜', ex: '왜',     exCn: '为什么', exRoman: 'wae' },
  { char: 'ㅚ', roman: 'oe',  name: '외', ex: '외국',   exCn: '外国', exRoman: 'oeguk' },
  { char: 'ㅝ', roman: 'wo',  name: '워', ex: '월요일', exCn: '星期一', exRoman: 'woryoil' },
  { char: 'ㅞ', roman: 'we',  name: '웨', ex: '웨딩',   exCn: '婚礼', exRoman: 'weding' },
  { char: 'ㅟ', roman: 'wi',  name: '위', ex: '위',     exCn: '上/胃', exRoman: 'wi' },
  { char: 'ㅢ', roman: 'ui',  name: '의', ex: '의사',   exCn: '医生', exRoman: 'uisa' }
];

// 19 个辅音：type 分为 basic 基本 / tense 紧音
const CONSONANTS = [
  { char: 'ㄱ', roman: 'g',  name: '기역',   ex: '가방', exCn: '包',     exRoman: 'gabang', type: 'basic' },
  { char: 'ㄴ', roman: 'n',  name: '니은',   ex: '나무', exCn: '树',     exRoman: 'namu',   type: 'basic' },
  { char: 'ㄷ', roman: 'd',  name: '디귿',   ex: '다리', exCn: '腿/桥',  exRoman: 'dari',   type: 'basic' },
  { char: 'ㄹ', roman: 'r',  name: '리을',   ex: '라면', exCn: '拉面',   exRoman: 'ramyeon',type: 'basic' },
  { char: 'ㅁ', roman: 'm',  name: '미음',   ex: '머리', exCn: '头',     exRoman: 'meori',  type: 'basic' },
  { char: 'ㅂ', roman: 'b',  name: '비읍',   ex: '바나나',exCn:'香蕉',  exRoman: 'banana', type: 'basic' },
  { char: 'ㅅ', roman: 's',  name: '시옷',   ex: '사과', exCn: '苹果',   exRoman: 'sagwa',  type: 'basic' },
  { char: 'ㅇ', roman: '',   name: '이응',   ex: '아이', exCn: '孩子',   exRoman: 'ai',     type: 'basic' },
  { char: 'ㅈ', roman: 'j',  name: '지읒',   ex: '자리', exCn: '座位',   exRoman: 'jari',   type: 'basic' },
  { char: 'ㅊ', roman: 'ch', name: '치읓',   ex: '차',   exCn: '茶/车',  exRoman: 'cha',    type: 'basic' },
  { char: 'ㅋ', roman: 'k',  name: '키읔',   ex: '키',   exCn: '身高',   exRoman: 'ki',     type: 'basic' },
  { char: 'ㅌ', roman: 't',  name: '티읕',   ex: '토마토',exCn:'西红柿',exRoman: 'tomato', type: 'basic' },
  { char: 'ㅍ', roman: 'p',  name: '피읖',   ex: '포도', exCn: '葡萄',   exRoman: 'podo',   type: 'basic' },
  { char: 'ㅎ', roman: 'h',  name: '히읗',   ex: '하늘', exCn: '天空',   exRoman: 'haneul', type: 'basic' },
  { char: 'ㄲ', roman: 'kk', name: '쌍기역', ex: '까치', exCn: '喜鹊',   exRoman: 'kkachi', type: 'tense' },
  { char: 'ㄸ', roman: 'tt', name: '쌍디귿', ex: '딸기', exCn: '草莓',   exRoman: 'ttalgi', type: 'tense' },
  { char: 'ㅃ', roman: 'pp', name: '쌍비읍', ex: '빠르다',exCn:'快',    exRoman: 'ppareuda',type: 'tense' },
  { char: 'ㅆ', roman: 'ss', name: '쌍시옷', ex: '쌀',   exCn: '米',     exRoman: 'ssal',   type: 'tense' },
  { char: 'ㅉ', roman: 'jj', name: '쌍지읒', ex: '짜장면',exCn:'炸酱面',exRoman: 'jjajangmyeon',type: 'tense' }
];

// 收音规则（26 个，按发音归纳）
const BATCHIM = [
  { char: 'ㄱ', sound: 'k', tip: '舌根抵住软腭，不爆破', ex: '국', exCn: '汤' },
  { char: 'ㄲ', sound: 'k', tip: '与ㄱ收音发音相同', ex: '낚시', exCn: '钓鱼' },
  { char: 'ㅋ', sound: 'k', tip: '与ㄱ收音发音相同', ex: '부엌', exCn: '厨房' },
  { char: 'ㄳ', sound: 'k', tip: '发ㄱ音，ㄹ不读出', ex: '몫', exCn: '份儿' },
  { char: 'ㄴ', sound: 'n', tip: '舌尖抵上齿龈', ex: '산', exCn: '山' },
  { char: 'ㄵ', sound: 'n', tip: '发ㄴ音，ㅈ不读出', ex: '앉다', exCn: '坐' },
  { char: 'ㄶ', sound: 'n', tip: '发ㄴ音，ㅎ不读出', ex: '많다', exCn: '多' },
  { char: 'ㄷ', sound: 't', tip: '舌尖抵上齿龈，不爆破', ex: '맛', exCn: '味道' },
  { char: 'ㅅ', sound: 't', tip: '与ㄷ收音发音相同', ex: '옷', exCn: '衣服' },
  { char: 'ㅆ', sound: 't', tip: '与ㄷ收音发音相同', ex: '있다', exCn: '有' },
  { char: 'ㅈ', sound: 't', tip: '与ㄷ收音发音相同', ex: '낮', exCn: '白天' },
  { char: 'ㅊ', sound: 't', tip: '与ㄷ收音发音相同', ex: '뛰어넘다', exCn: '跳过' },
  { char: 'ㅌ', sound: 't', tip: '与ㄷ收音发音相同', ex: '숲', exCn: '森林' },
  { char: 'ㅎ', sound: 't', tip: '与ㄷ收音发音相同', ex: '좋다', exCn: '好' },
  { char: 'ㄹ', sound: 'l', tip: '舌尖抵上齿龈，气流从两侧通过', ex: '물', exCn: '水' },
  { char: 'ㄺ', sound: 'k', tip: '发ㄱ音，ㄹ不读出', ex: ' milk → 우유', exCn: '牛奶' },
  { char: 'ㄻ', sound: 'm', tip: '发ㅁ音，ㄹ不读出', ex: '삶', exCn: '生活' },
  { char: 'ㄼ', sound: 'p', tip: '发ㅂ音，ㄹ不读出', ex: '밟다', exCn: '踩' },
  { char: 'ㄽ', sound: 't', tip: '发ㄷ音，ㄹ不读出', ex: '외곬', exCn: '单路' },
  { char: 'ㄾ', sound: 't', tip: '发ㄷ音，ㄹ不读出', ex: '훑다', exCn: '抚摸' },
  { char: 'ㄿ', sound: 'p', tip: '发ㅂ音，ㄹ不读出', ex: '읊다', exCn: '吟诵' },
  { char: 'ㅀ', sound: 't', tip: '发ㄷ音，ㄹ不读出', ex: '싫다', exCn: '讨厌' },
  { char: 'ㅁ', sound: 'm', tip: '双唇闭合，气流从鼻腔出', ex: '밤', exCn: '夜晚' },
  { char: 'ㅂ', sound: 'p', tip: '双唇闭合，不爆破', ex: '밥', exCn: '饭' },
  { char: 'ㅄ', sound: 'p', tip: '发ㅂ音，ㅅ不读出', ex: '값', exCn: '价格' },
  { char: 'ㅇ', sound: 'ng', tip: '舌根抵软腭，气流从鼻腔出', ex: '강', exCn: '江' }
];

// 初声/中声顺序（用于 Unicode 组合计算）
const INITIALS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const MEDIALS  = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const INITIAL_ROMAN = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const MEDIAL_ROMAN  = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];

// 生成组合字：0xAC00 + (初声索引 * 21 + 中声索引) * 28
function makeSyllable(i, m) {
  return String.fromCharCode(0xAC00 + (i * 21 + m) * 28);
}
function comboRoman(i, m) {
  return INITIAL_ROMAN[i] + MEDIAL_ROMAN[m];
}

// 每日推荐短句（10 句，带罗马音）
const DAILY_SENTENCES = [
  { ko: '안녕하세요! 오랜만이에요.', cn: '你好！好久不见。', roman: 'annyeonghaseyo! oraenmanieyo' },
  { ko: '감사합니다.', cn: '谢谢。', roman: 'gamsahamnida' },
  { ko: '앞으로 잘 부탁드려요.', cn: '以后请多多关照。', roman: 'apeuro jal butakdeuryeoyo' },
  { ko: '오늘 날씨가 좋아요.', cn: '今天天气真好。', roman: 'oneul nalssiga joayo' },
  { ko: '한 번 더 말씀해 주세요.', cn: '请再说一遍。', roman: 'han beon deo malsseumhae juseyo' },
  { ko: '요즘 한국어 공부에 푹 빠졌어요.', cn: '最近迷上了学韩语。', roman: 'yojeum hangugeo gongbue ppok ppajyeoss-eoyo' },
  { ko: '얼마예요?', cn: '多少钱？', roman: 'eolmayeyo' },
  { ko: '화장실 좀 빌릴 수 있을까요?', cn: '能借用一下洗手间吗？', roman: 'hwajangsil jom billil su isseulkkayo?' },
  { ko: '천천히 말해 주세요.', cn: '请说慢一点。', roman: 'cheoncheonhi malhae juseyo' },
  { ko: '오늘도 화이팅!', cn: '今天也加油！', roman: 'oneuldo hwaiting' },
  { ko: '좋은 아침이에요.', cn: '早上好。', roman: 'joenachim-ieyo' },
  { ko: '오늘도 좋은 하루 되세요.', cn: '祝你今天也过得愉快。', roman: 'oneuldo joen haru doeseyo' },
  { ko: '조금만 기다려 주세요.', cn: '请稍等一下。', roman: 'jogeumman gidaryeo juseyo' },
  { ko: '저도 그렇게 생각해요.', cn: '我也这么想。', roman: 'jeodo geureoke saenggakhaeyo' },
  { ko: '이거 정말 맛있어요.', cn: '这个真好吃。', roman: 'igeo jeongmal masisseoyo' },
  { ko: '도와주셔서 감사합니다.', cn: '谢谢您的帮助。', roman: 'dowajusyeoseo gamsahamnida' },
  { ko: '천천히 걸어갈게요.', cn: '我会慢慢走过去。', roman: 'cheoncheonhi georeogalgeyo' },
  { ko: '내일 다시 뵐게요.', cn: '明天再见。', roman: 'naeil dasi boelgeyo' },
  { ko: '지금 시간이 어떻게 되나요?', cn: '现在是什么时间？', roman: 'jigeum sigani eotteoke doenayo?' },
  { ko: '한국어의 매력에 빠졌어요.', cn: '我被韩语的魅力吸引了。', roman: 'hangugeoui maeryeoge ppajyeoss-eoyo' },
  { ko: '매일 조금씩 배우고 있어요.', cn: '我每天都在学一点点。', roman: 'maeil jogeumssik baeugo isseoyo' },
  { ko: '오늘 기분이 상쾌해요.', cn: '今天心情清爽。', roman: 'oneul gibuni sangkwaehaeyo' },
  { ko: '혹시 도와드릴까요?', cn: '需要我帮忙吗？', roman: 'hoksi dowadeurilkkayo?' },
  { ko: '실례합니다, 화장실이 어디예요?', cn: '不好意思，洗手间在哪里？', roman: 'sillyehamnida, hwajangsiri eodiyeyo?' },
  { ko: '이번 주말에 시간 있어요?', cn: '这个周末有时间吗？', roman: 'ibeon jumare sigan isseoyo?' },
  { ko: '정말 고마워요, 큰 도움이 됐어요.', cn: '真的很感谢，帮了大忙。', roman: 'jeongmal gomawoyo, keun doumi doesseoyo' },
  { ko: '한국 드라마를 좋아해요.', cn: '我喜欢看韩剧。', roman: 'hanguk deuramar-eul joahaeyo' },
  { ko: '발음이 조금 어려워요.', cn: '发音有点难。', roman: 'bareumi jogeum eoryeowoyo' },
  { ko: '오늘도 열심히 하겠어요.', cn: '今天也会努力学习。', roman: 'oneuldo yeolsimhi hagesseoyo' },
  { ko: '커피 한 잔 마실래요?', cn: '要喝杯咖啡吗？', roman: 'keopi han jan masillaeyo?' },
  { ko: '저 길을 좀 헷갈렸어요.', cn: '我有点迷路了。', roman: 'jeo gireul jom hetgyeoss-eoyo' },
  { ko: '사진 한 장만 부탁드려요.', cn: '能帮我拍一张照片吗？', roman: 'sajin han jangman butakdeuryeoyo' },
  { ko: '계속 연습하면 늘어요.', cn: '坚持练习就会进步。', roman: 'gyesok yeonseuphamyeon neureoyo' },
  { ko: '오늘도 수고하셨습니다.', cn: '今天也辛苦了。', roman: 'oneuldo sugohasyeotseumnida' },
  { ko: '내일 더 좋은 하루 되길 바라요.', cn: '希望明天是更好的一天。', roman: 'naeil deo joen haru doegil barayo' },
  { ko: '주말에 뭐 하실 계획이에요?', cn: '周末有什么计划？', roman: 'jumare mwo hasil gyehoeg-ieyo?' },
  { ko: '이 근처에 맛집이 있을까요?', cn: '这附近有好吃的店吗？', roman: 'i geuncheoe matjipi isseulkkayo?' },
  { ko: '가방을 여기 두어도 될까요?', cn: '包放这里可以吗？', roman: 'gabangeul yeogi dueodo doelkkayo?' },
  { ko: '조금 늦을 것 같아요, 죄송해요.', cn: '我可能会迟到一点，抱歉。', roman: 'jogeum neujeul geot gata-yo, joesonghaeyo' },
  { ko: '이 단어 발음이 어떻게 되나요?', cn: '这个单词怎么发音？', roman: 'i daneo bareumi eotteoke doenayo?' },
  { ko: '날씨가 선선해서 산책하기 좋아요.', cn: '天气凉爽，适合散步。', roman: 'nalssiga seonseonhaeseo sanchaekhagi joayo' },
  { ko: '한국 음식 중에 뭐를 좋아하세요?', cn: '韩国料理中你喜欢什么？', roman: 'hanguk eumsik jung-e mworeul joahaseyo?' },
  { ko: '저는 아침을 잘 안 먹어요.', cn: '我一般不怎么吃早饭。', roman: 'jeoneun achimeul jal an meogeoyo' },
  { ko: '이 문제를 다시 설명해 주세요.', cn: '请再讲解一下这道题。', roman: 'i munjeireul dasi seolmyeonghae juseyo' },
  { ko: '오늘 하루도 고생 많으셨어요.', cn: '今天一天也辛苦了。', roman: 'oneul harudo gosaeng maneusyeoss-eoyo' },
];

// 韩语名言金句库（网络可用时可从远程刷新补充；离线时用此内置库兜底）
const KOREAN_QUOTES = [
  { ko: '꿈을 꾸는 자에게 나라가 있다.', cn: '有梦想的人，才有未来。', roman: 'kkumeul kkuneun jaege nara ga itda', from: '韩国谚语' },
  { ko: '시작이 반이다.', cn: '良好的开端是成功的一半。', roman: 'sijagi baniida', from: '韩国谚语' },
  { ko: '고생 끝에 낙이 온다.', cn: '苦尽甘来。', roman: 'gosaeng kkeute nagi onda', from: '韩国谚语' },
  { ko: '남을 위해 사는 삶이 가장 아름답다.', cn: '为他人而活的人生最美丽。', roman: 'nameul wihae saneun sami gajang areumdapda', from: '金大中' },
  { ko: '오늘의 작은 노력이 내일의 큰 변화를 만든다.', cn: '今天小小的努力，造就明天大大的改变。', roman: 'oneurui jageun noryeogi naeirui keun byeonhwareul mandeunda', from: '励志金句' },
  { ko: '실패는 성공의 어머니이다.', cn: '失败是成功之母。', roman: 'silpaeneun seonggongui eomeoniida', from: '韩国谚语' },
  { ko: '시간은 금이다.', cn: '时间就是金钱。', roman: 'siganeun geumiida', from: '韩国谚语' },
  { ko: '배움에는 끝이 없다.', cn: '学无止境。', roman: 'baeumeneun kkeuti eopda', from: '韩国谚语' },
  { ko: '진정한 친구는 어려울 때 알 수 있다.', cn: '患难见真情。', roman: 'jinjeonghan chinguneun eoryeoul ttae al su itda', from: '韩国谚语' },
  { ko: '자신을 믿어라, 그러면 반은 이긴 것이다.', cn: '相信自己，你就已经赢了一半。', roman: 'jasineul mideora, geureomyeon baneun igeun geosida', from: '励志金句' },
  { ko: '말보다 행동이 더 크게 말한다.', cn: '行动比语言更有力量。', roman: 'malboda haengdongi deo keuge malhanda', from: '励志金句' },
  { ko: '매일 조금씩, 하지만 확실하게.', cn: '每天一点点，但扎实前进。', roman: 'maeil jogeumssik, hajiman hwaksilhage', from: '励志金句' },
  { ko: '넘어져도 다시 일어나면 된다.', cn: '跌倒也没关系，站起来就好。', roman: 'neomeojyeodo dasi ireonamyeon doenda', from: '励志金句' },
  { ko: '행복은 선택이다.', cn: '幸福是一种选择。', roman: 'haengbogeun seontaegiida', from: '励志金句' },
  { ko: '가장 어두운 밤이 새벽에 가장 가깝다.', cn: '最黑暗的夜晚离黎明最近。', roman: 'gajang eoduun bami saebyeoge gajang gakkapda', from: '韩国谚语' },
  { ko: '하루를 살아도 웃으며 살아라.', cn: '哪怕只活一天，也要笑着活。', roman: 'harureul sarado useumyeo sarara', from: '励志金句' },
  { ko: '포기하지 않는 한 가능성은 있다.', cn: '只要不放弃，就有可能。', roman: 'pogihaji annealing han ganeunseongeun itda', from: '励志金句' },
  { ko: '지식은 힘이다.', cn: '知识就是力量。', roman: 'jisigeun himiida', from: '培根·韩译' },
  { ko: '작은 씨앗이 큰 나무가 된다.', cn: '小小的种子长成参天大树。', roman: 'jageun ssiaegi keun namuga doenda', from: '韩国谚语' },
  { ko: '오늘 할 수 있는 일을 내일로 미루지 마라.', cn: '今日能做的事，勿拖到明天。', roman: 'oneul hal su inneun ireul naeillo miruji mara', from: '励志金句' },
];

// 30 句真实场景对话（按场景分组），normal / slow 两个 TTS 速度
const SCENE_SENTENCES = [
  { scene: '인사 问候', ko: '안녕하세요! 만나서 반가워요.', cn: '你好！很高兴认识你。', roman: 'annyeonghaseyo! mannaseo bangawoyo.' },
  { scene: '인사 问候', ko: '오랜만이에요. 잘 지냈어요?', cn: '好久不见，过得好吗？', roman: 'oraenmanieyo. jal jinaesseoyo?' },
  { scene: '인사 问候', ko: '안녕히 가세요.', cn: '再见（对离开的人说）。', roman: 'annyeonghi gaseyo.' },
  { scene: '쇼핑 购物', ko: '이거 얼마예요?', cn: '这个多少钱？', roman: 'igeo eolmayeyo?' },
  { scene: '쇼핑 购物', ko: '좀 깎아 주시겠어요?', cn: '能便宜一点吗？', roman: 'jom kkaka jusigesseoyo?' },
  { scene: '쇼핑 购物', ko: '카드로 계산할게요.', cn: '我用卡结账。', roman: 'kadeuro gyesanhalgeyo.' },
  { scene: '식당 餐厅', ko: '여기 주문할게요.', cn: '这里我要点餐。', roman: 'yeogi jumunhalgeyo.' },
  { scene: '식당 餐厅', ko: '비빔밥 하나 주세요.', cn: '请给我一份拌饭。', roman: 'bibimbap hana juseyo.' },
  { scene: '식당 餐厅', ko: '맛있어요!', cn: '很好吃！', roman: 'masisseoyo!' },
  { scene: '교통 交通', ko: '지하철역이 어디예요?', cn: '地铁站在哪里？', roman: 'jihacheollyeogi eodiyeyo?' },
  { scene: '교통 交通', ko: '이 버스는 시내로 가나요?', cn: '这辆公交去市区吗？', roman: 'i beoseuneun sineuro ganayo?' },
  { scene: '교통 交通', ko: '여기서 내려 주세요.', cn: '请让我在这里下车。', roman: 'yeogiseo naeryeo juseyo.' },
  { scene: '전화 电话', ko: '여보세요?', cn: '喂？', roman: 'yeoboseyo?' },
  { scene: '전화 电话', ko: '잠시만 기다려 주세요.', cn: '请稍等一下。', roman: 'jamsiman gidaryeo juseyo.' },
  { scene: '전화 电话', ko: '다시 전화할게요.', cn: '我稍后再打给你。', roman: 'dasi jeonwahalgeyo.' },
  { scene: '부탁 请求', ko: '사진 한 장만 부탁드려요.', cn: '能帮我拍一张照片吗？', roman: 'sajin han jangman butakdeuryeoyo' },
  { scene: '부탁 请求', ko: '도와주세요!', cn: '请帮帮我！', roman: 'dowajuseyo!' },
  { scene: '부탁 请求', ko: '창문 좀 닫아 주세요.', cn: '请关一下窗。', roman: 'changmun jom dada juseyo.' },
  { scene: '날씨 天气', ko: '오늘 너무 덥네요.', cn: '今天好热啊。', roman: 'oneul neomeu deopneyo.' },
  { scene: '날씨 天气', ko: '내일 비가 올까요?', cn: '明天会下雨吗？', roman: 'naeil biga olkkayo?' },
  { scene: '날씨 天气', ko: '날씨가 정말 좋다!', cn: '天气真好！', roman: 'nalssiga jeongmal jota!' },
  { scene: '표현 表达', ko: '저도 그렇게 생각해요.', cn: '我也这么想。', roman: 'jeodo geureoke saenggakhaeyo.' },
  { scene: '표현 表达', ko: '잘 모르겠어요.', cn: '我不太清楚。', roman: 'jal moreugesseoyo.' },
  { scene: '표현 表达', ko: '한 번 더 말해 주세요.', cn: '请再说一遍。', roman: 'han beon deo malhae juseyo.' },
  { scene: '감정 感受', ko: '너무 기뻐요!', cn: '太开心了！', roman: 'neomu gippeoyo!' },
  { scene: '감정 感受', ko: '조금 피곤해요.', cn: '有点累。', roman: 'jogeum pigonhaeyo.' },
  { scene: '감정 感受', ko: '걱정하지 마세요.', cn: '别担心。', roman: 'geokjeonghaji maseyo.' },
  { scene: '표현 表达', ko: '제 이름은 민지예요.', cn: '我叫敏智。', roman: 'je ireumeun minjiyeyo.' },
  { scene: '인사 问候', ko: '수고하셨습니다.', cn: '辛苦了。', roman: 'sugohasyeotseumnida.' },
  { scene: '감정 感受', ko: '사랑해요 ❤️', cn: '我爱你 ❤️', roman: 'saranghaeyo' }
];

// 15 组基础语法
const GRAMMAR = [
  { title: 'N + 이다 / 다', struct: '名词 + 이다（是）', usage: '表示"是……"，最基础判断句。名词有收音用이다，无收音用다。', ex: '저는 학생입니다.', exCn: '我是学生。', tip: '正式场合用입니다，口语用이에요/예요。' },
  { title: 'N + 은/는', struct: '名词 + 主题助词', usage: '标记句子主题，"至于……、……的话"。有收音用은，无收音用는。', ex: '저는 한국어를 좋아해요.', exCn: '我喜欢韩语。', tip: '句首常用，引出话题。' },
  { title: 'N + 이/가', struct: '名词 + 主格助词', usage: '标记主语。有收音用이，无收音用가。', ex: '학생이 와요.', exCn: '学生来了。', tip: '新信息、强调主语时用。' },
  { title: 'N + 을/를', struct: '名词 + 宾格助词', usage: '标记宾语（动作对象）。有收音用을，无收音用를。', ex: '밥을 먹어요.', exCn: '吃饭。', tip: '和动词搭配最常见。' },
  { title: 'V + 아요/어요', struct: '动词 + 非格式体现在时', usage: '现在时陈述，语气柔和。词干元音ㅏㅗ用아요，其他用어요。', ex: '저는 학교에 가요.', exCn: '我去学校。', tip: '日常会话使用频率最高。' },
  { title: 'V + 았/었어요', struct: '动词 + 过去时', usage: '过去时。词干元音ㅏㅗ用았어요，其他用었어요。', ex: '어제 영화를 봤어요.', exCn: '昨天看了电影。', tip: '描述已发生的事情。' },
  { title: 'V + 고 싶다', struct: '动词词干 + 고 싶다', usage: '表示"想做某事"。', ex: '한국에 가고 싶어요.', exCn: '我想去韩国。', tip: '表达愿望的常用句型。' },
  { title: 'V + 아야/어야 하다', struct: '动词 + 아야/어야 하다', usage: '表示"必须、得做某事"。', ex: '오늘 숙제를 해야 해요.', exCn: '今天得做作业。', tip: '口语常说 해야 해요。' },
  { title: 'A/V + 지 않다', struct: '词干 + 지 않다', usage: '否定形式，"不……"。', ex: '저는 담배를 피우지 않아요.', exCn: '我不抽烟。', tip: '正式否定常用 안 + 动词也可。' },
  { title: 'N + 도', struct: '名词 + 도', usage: '表示"也、都"。', ex: '저도 좋아해요.', exCn: '我也喜欢。', tip: '替代은/는、이/가、을/를。' },
  { title: 'N + 에', struct: '名词 + 에', usage: '表示时间、地点、方向的助词。', ex: '학교에 가요.', exCn: '去学校。', tip: '具体时间点也用에，如 3시에。' },
  { title: 'N + 에서', struct: '名词 + 에서', usage: '表示动作发生的场所，"在……"。', ex: '도서관에서 공부해요.', exCn: '在图书馆学习。', tip: '与表示方向的에区分。' },
  { title: 'A/V + 을/ㄹ 게요', struct: '词干 + 을 게요', usage: '表示说话人的意志、承诺，"我会……"。', ex: '내일 다시 전화할게요.', exCn: '明天我会再打电话。', tip: '有收音用을게요，无收音用ㄹ게요。' },
  { title: 'V + 고 있다', struct: '动词 + 고 있다', usage: '现在进行时，"正在……"。', ex: '지금 밥을 먹고 있어요.', exCn: '现在正在吃饭。', tip: '描述此刻正在进行的动作。' },
  { title: 'A + 아요/어요 (形容词)', struct: '形容词词干 + 아요/어요', usage: '形容词现在时，"很……"。', ex: '이 꽃이 예뻐요.', exCn: '这朵花很漂亮。', tip: '形容词变位规则同动词。' }
];

// 听力素材推荐类型
const LISTENING_TYPES = [
  { icon: '🗣️', title: '影子跟读', desc: '边听边跟，模仿语音语调' },
  { icon: '📻', title: '韩国广播', desc: '沉浸式磨耳朵，熟悉语速' },
  { icon: '🎵', title: 'K-POP 学韩语', desc: '歌词跟唱，轻松记忆' },
  { icon: '📺', title: '韩综片段', desc: '真实语境，生活口语' },
  { icon: '📝', title: 'TOPIK 真题', desc: '考级听力，实战训练' },
  { icon: '🌐', title: 'Naver 博主', desc: '地道表达，最新语汇' }
];

// 6 个闯关单元
const UNITS = [
  { id: 1, title: '第一单元', desc: '韩语基础发音与字母 · 5题', reward: 2 },
  { id: 2, title: '第二单元', desc: '基础问候与自我介绍 · 5题', reward: 3 },
  { id: 3, title: '第三单元', desc: '数字与时间表达 · 5题', reward: 3 },
  { id: 4, title: '第四单元', desc: '日常购物对话 · 5题', reward: 4 },
  { id: 5, title: '第五单元', desc: '餐厅点餐实战 · 5题', reward: 5 },
  { id: 6, title: '第六单元', desc: '交通出行用语 · 5题', reward: 5 }
];

// 8 个学习模块
const MODULES = [
  { icon: '🍽️', title: '餐厅点餐', ko: '주문할게요', cn: '我要点餐' },
  { icon: '🚇', title: '乘坐地铁', ko: '지하철 타요', cn: '坐地铁' },
  { icon: '🚌', title: '乘坐公交', ko: '버스 타요', cn: '坐公交' },
  { icon: '🗺️', title: '问路', ko: '길을 물어봐요', cn: '问个路吧' },
  { icon: '🏨', title: '入住酒店', ko: '체크인 할게요', cn: '我要入住' },
  { icon: '💬', title: '日常沟通', ko: '일상 대화', cn: '日常对话' },
  { icon: '🎤', title: '口语跟读', ko: '말하기', cn: '跟读练习' },
  { icon: '✍️', title: '韩语听写', ko: '받아쓰기', cn: '听写练习' }
];

// 单元小测题目
const QUIZ = {
  1: [
    { q: '元音 ㅏ 的罗马音是？', opts: ['a', 'eo', 'o', 'u'], ans: 0 },
    { q: '辅音 ㄱ 的名称是？', opts: ['니은', '기역', '디귿', '리을'], ans: 1 },
    { q: '가 的发音是？', opts: ['na', 'ga', 'ka', 'da'], ans: 1 },
    { q: '下面哪个是复合元音？', opts: ['ㅏ', 'ㅗ', 'ㅘ', 'ㅡ'], ans: 2 },
    { q: '辅音 ㅎ 的罗马音是？', opts: ['k', 't', 'h', 'p'], ans: 2 }
  ],
  2: [
    { q: '"你好"用韩语怎么说？', opts: ['감사합니다', '안녕하세요', '잘가요', '형님'], ans: 1 },
    { q: '"谢谢"是？', opts: ['죄송합니다', '안녕히', '감사합니다', '실례합니다'], ans: 2 },
    { q: '"请多关照"是？', opts: ['잘 부탁드립니다', '먼저 가겠습니다', '오랜만이에요', '반갑습니다'], ans: 0 },
    { q: '我是学生 → 저는 학생___', opts: ['이다', '입니다', '예요', ' 있어요'], ans: 1 },
    { q: '"再见（对离开者）"是？', opts: ['안녕히 가세요', '안녕히 계세요', '잘 자요', '또 봐요'], ans: 0 }
  ],
  3: [
    { q: '"一"用韩语是？', opts: ['하나', '둘', '셋', '넷'], ans: 0 },
    { q: '数字"三"是？', opts: ['하나', '둘', '셋', '다섯'], ans: 2 },
    { q: '"今天"是？', opts: ['내일', '어제', '오늘', '모레'], ans: 2 },
    { q: '"明天"是？', opts: ['오늘', '내일', '어제', '지금'], ans: 1 },
    { q: '3点 → 세 ___', opts: ['시', '분', '초', '날'], ans: 0 }
  ],
  4: [
    { q: '"多少钱？"是？', opts: ['언제예요?', '얼마예요?', '어디예요?', '무엇이에요?'], ans: 1 },
    { q: '"请给我这个" → 이거 ___', opts: ['주세요', '가세요', '보세요', '하세요'], ans: 0 },
    { q: '"信用卡"是？', opts: ['현금', '카드', '돈', '영수증'], ans: 1 },
    { q: '"便宜一点" → 좀 ___', opts: ['깎아 주세요', '비싸 주세요', '커 주세요', '봐 주세요'], ans: 0 },
    { q: '"结账"是？', opts: ['계산할게요', '주문할게요', '예약할게요', '포장할게요'], ans: 0 }
  ],
  5: [
    { q: '"我要点餐"是？', opts: ['주문할게요', '계산할게요', '예약할게요', '기다릴게요'], ans: 0 },
    { q: '"拌饭"是？', opts: ['김치', '비빔밥', '라면', '불고기'], ans: 1 },
    { q: '"好吃"是？', opts: ['맛있다', '나쁘다', '춥다', '비싸다'], ans: 0 },
    { q: '"请给我水" → 물 ___', opts: ['주세요', '가세요', '먹세요', '보세요'], ans: 0 },
    { q: '"菜单"是？', opts: [' 메뉴', '의자', '식당', '컵'], ans: 0 }
  ],
  6: [
    { q: '"地铁"是？', opts: ['버스', '지하철', '기차', '택시'], ans: 1 },
    { q: '"车站在哪里？" → 정류장이 ___', opts: ['어디예요?', '언제예요?', '얼마예요?', '누구예요?'], ans: 0 },
    { q: '"请在这里下车" → 여기서 ___', opts: ['내려 주세요', '타 주세요', '가 주세요', '와 주세요'], ans: 0 },
    { q: '"出租车"是？', opts: ['버스', '자전거', '택시', '비행기'], ans: 2 },
    { q: '"票"是？', opts: ['표', '길', '차', '문'], ans: 0 }
  ]
};
