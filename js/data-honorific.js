/* ============================================================
   韩小语 · 敬语与平语区别学习库
   존댓말(敬语) vs 반말(平语) 全面对照 + 规则 + 例句
   ============================================================ */

/* 核心概念：敬语、平语的定义与使用场景 */
const HONORIFIC_INTRO = [
  {
    title: '什么是敬语（존댓말）？',
    icon: '🙇',
    cn: '敬语是韩国语中表达尊敬的语体，用于长辈、上级、陌生人和正式场合。是韩语社交礼仪的核心，用错会显得失礼。',
    ko: '존댓말은 높임을 나타내는 말투로, 어른·상사·낯선 사람에게 쓰요.',
    roman: 'jondaenmareun nopim-eul natanaeneun malturo, eoreun·sangsa·natseon saram-ege sseoyo.'
  },
  {
    title: '什么是平语（반말）？',
    icon: '👫',
    cn: '平语是平等或上对下使用的非敬语体，用于好朋友、同龄人、家人（晚辈）和亲密关系。对长辈用平语是非常失礼的。',
    ko: '반말은 높이지 않는 말투로, 친구·가족·아이에게 써요. 어른에게 쓰면 실례예요.',
    roman: 'banmareun nopiji anneun malturo, chingu·gajok·aiege sseoyo. eoreun-ege sseumyeon sillyeyeyo.'
  },
  {
    title: '四大敬语体系',
    icon: '📊',
    cn: '韩语有多种语体，最常用的是：합쇼체（正式敬语）、해요체（非正式敬语/半敬语）、해체（平语）、하오체（中等敬语）。日常中前三种最关键。',
    ko: '존댓말에는 합쇼체, 해요체, 해체, 하오체가 있어요.',
    roman: 'jondaenmareneun hapsyoche, haeyoche, haeche, haochega isseoyo.'
  }
];

/* 语体对照表：同一句话在不同语体下的说法 */
const HONORIFIC_STYLES = [
  { cn: '敬语·正式（합쇼체）', ko: '안녕하십니까?', roman: 'annyeonghasimnikka?', use: '正式场合、商务、对长辈上级', tone: '最尊敬' },
  { cn: '敬语·日常（해요체）', ko: '안녕하세요?', roman: 'annyeonghaseyo?', use: '日常礼貌、对陌生人、服务场合', tone: '礼貌亲切' },
  { cn: '平语（해체）', ko: '안녕?', roman: 'annyeong?', use: '好朋友、同龄人、家人', tone: '亲近随意' },
  { cn: '敬语·陈述（합쇼체）', ko: '저는 학생입니다.', roman: 'jeoneun haksaeng-imnida.', use: '正式自我介绍', tone: '最尊敬' },
  { cn: '敬语·陈述（해요체）', ko: '저는 학생이에요.', roman: 'jeoneun haksaeng-ieyo.', use: '日常自我介绍', tone: '礼貌亲切' },
  { cn: '平语·陈述（해체）', ko: '나는 학생이야.', roman: 'naneun haksaeng-iya.', use: '朋友间陈述', tone: '亲近随意' }
];

/* 词尾变化规则对照 */
const HONORIFIC_RULES = [
  {
    title: '① 终结词尾对比',
    rows: [
      { type: '陈述', honorific: '-ㅂ니다/습니다', informal: '-아요/어요 · -야/이야', example: '가요 (去) → 갑니다 / 가야' },
      { type: '疑问', honorific: '-ㅂ니까?/습니까?', informal: '-아요?/어요? · -아?/어?', example: '가요? → 갑니까? / 가?' },
      { type: '命令', honorific: '-세요/으세요', informal: '-아/어 · -아라/어라', example: '가세요 → 가 / 가라' },
      { type: '共动', honorific: '-ㅂ시다/읍시다', informal: '-아요/어요 · -자', example: '가요 → 갑시다 / 가자' }
    ]
  },
  {
    title: '② 特殊词汇变化（敬语专用词）',
    rows: [
      { type: '有/在', honorific: '계시다', informal: '있다', example: '선생님이 계세요 / 친구가 있어' },
      { type: '吃', honorific: '드시다/잡수시다', informal: '먹다', example: '할아버지가 드세요 / 내가 먹어' },
      { type: '睡', honorific: '주무시다', informal: '자다', example: '엄마가 주무세요 / 나 자' },
      { type: '说', honorific: '말씀하시다', informal: '말하다', example: '사장님이 말씀하세요 / 친구야 말해' },
      { type: '家', honorific: '댁', informal: '집', example: '댁에 계세요? / 집에 있어?' },
      { type: '姓名', honorific: '성함', informal: '이름', example: '성함이 어떻게 되세요? / 이름 뭐야?' },
      { type: '年龄', honorific: '연세', informal: '나이', example: '연세가 어떻게 되세요? / 나이 몇 살이야?' },
      { type: '生日', honorific: '생신', informal: '생일', example: '생신 축하드려요 / 생일 축하해' },
      { type: '饭', honorific: '진지', informal: '밥', example: '진지 드셨어요? / 밥 먹었어?' }
    ]
  },
  {
    title: '③ 称呼与冠词',
    rows: [
      { type: '我', honorific: '저 (谦称)', informal: '나', example: '저는요 / 나는' },
      { type: '你', honorific: '선생님/고객님/○○님', informal: '너/야', example: '고객님, 여기요 / 야, 여기' },
      { type: '后缀', honorific: '-님 / -선생님', informal: '-이 / -야 (名字)', example: '민지님 / 민지야' }
    ]
  }
];

/* 敬语 vs 平语 场景化对照例句（核心内容） */
const HONORIFIC_EXAMPLES = [
  {
    scene: '见面问候',
    icon: '👋',
    items: [
      { cn: '你好', honorific: '안녕하세요?', informal: '안녕?', hr: 'annyeonghaseyo?', ir: 'annyeong?' },
      { cn: '初次见面', honorific: '처음 뵙겠습니다.', informal: '처음 만나서 반가워.', hr: 'cheoeum boepgesseumnida.', ir: 'cheoeum mannaseo bangawo.' },
      { cn: '好久不见', honorific: '오랜만에 뵙습니다.', informal: '오랜만이야.', hr: 'oraenmane boepseumnida.', ir: 'oraenmaniya.' },
      { cn: '最近好吗', honorific: '잘 지내셨어요?', informal: '잘 지냈어?', hr: 'jal jinaesyeosseoyo?', ir: 'jal jinaesseo?' }
    ]
  },
  {
    scene: '感谢道歉',
    icon: '🙏',
    items: [
      { cn: '谢谢', honorific: '감사합니다.', informal: '고마워.', hr: 'gamsahamnida.', ir: 'gomawo.' },
      { cn: '对不起', honorific: '죄송합니다.', informal: '미안해.', hr: 'joesonghamnida.', ir: 'mianhae.' },
      { cn: '麻烦您了', honorific: '번거롭게 해 드려 죄송합니다.', informal: '번거롭게 해서 미안해.', hr: 'beongeoropge hae deuryeo joesonghamnida.', ir: 'beongeoropge haeseo mianhae.' },
      { cn: '没关系', honorific: '괜찮으십니다.', informal: '괜찮아.', hr: 'gwaenchaneusimnida.', ir: 'gwaenchana.' }
    ]
  },
  {
    scene: '询问请求',
    icon: '❓',
    items: [
      { cn: '叫什么名字', honorific: '성함이 어떻게 되세요?', informal: '이름이 뭐야?', hr: 'seongham-i eotteoke doeseyo?', ir: 'ireumi mwoya?' },
      { cn: '您多大年纪', honorific: '연세가 어떻게 되세요?', informal: '나이가 몇 살이야?', hr: 'yeonsega eotteoke doeseyo?', ir: 'naiga myeot sar-iya?' },
      { cn: '请帮帮我', honorific: '도와주시겠어요?', informal: '도와줘.', hr: 'dowajusigesseoyo?', ir: 'dowajwo.' },
      { cn: '请稍等', honorific: '잠시만 기다려 주세요.', informal: '잠깐만 기다려.', hr: 'jamsiman gidaryeo juseyo.', ir: 'jamkkanman gidaryeo.' }
    ]
  },
  {
    scene: '用餐居家',
    icon: '🍚',
    items: [
      { cn: '吃饭了吗', honorific: '진지 드셨어요?', informal: '밥 먹었어?', hr: 'jinji deusyeosseoyo?', ir: 'bap meogeosseo?' },
      { cn: '请慢用', honorific: '맛있게 드세요.', informal: '맛있게 먹어.', hr: 'masitge deuseyo.', ir: 'masitge meogeo.' },
      { cn: '晚安', honorific: '안녕히 주무세요.', informal: '잘 자.', hr: 'annyeonghi jumuseyo.', ir: 'jal ja.' },
      { cn: '我去上班了', honorific: '회사에 가 보겠습니다.', informal: '회사 간다.', hr: 'hoesae ga bogesseumnida.', ir: 'hoesa ganda.' }
    ]
  },
  {
    scene: '告辞告别',
    icon: '👋',
    items: [
      { cn: '再见（对离开者）', honorific: '안녕히 가세요.', informal: '잘 가.', hr: 'annyeonghi gaseyo.', ir: 'jal ga.' },
      { cn: '再见（对留下者）', honorific: '안녕히 계세요.', informal: '잘 있어.', hr: 'annyeonghi gyeseyo.', ir: 'jal isseo.' },
      { cn: '辛苦了', honorific: '수고하셨습니다.', informal: '수고했어.', hr: 'sugohasyeotseumnida.', ir: 'sugohaesseo.' },
      { cn: '我先走了', honorific: '먼저 가 보겠습니다.', informal: '나 먼저 간다.', hr: 'meonjeo ga bogesseumnida.', ir: 'na meonjeo ganda.' }
    ]
  },
  {
    scene: '职场商务',
    icon: '💼',
    items: [
      { cn: '请多关照', honorific: '잘 부탁드립니다.', informal: '잘 부탁해.', hr: 'jal butakdeurimnida.', ir: 'jal butakhae.' },
      { cn: '我想见一下科长', honorific: '과장님을 뵙고 싶습니다.', informal: '과장님 만나고 싶어.', hr: 'gwajangnimeul boepgo sipseumnida.', ir: 'gwajangnim mannago sipeo.' },
      { cn: '收到邮件了吗', honorific: '이메일 확인하셨습니까?', informal: '이메일 확인했어?', hr: 'imeil hwaginhasyeotseumnikka?', ir: 'imeil hwaginhaesseo?' },
      { cn: '我马上处理', honorific: '바로 처리하겠습니다.', informal: '바로 처리할게.', hr: 'baro cheorihagesseumnida.', ir: 'baro cheorihalge.' }
    ]
  }
];

/* 常见错误提醒 */
const HONORIFIC_TIPS = [
  '⚠️ 对长辈、老师、上司、陌生人绝不能用平语（반말），即使对方比你年轻。',
  '⚠️ 不确定关系亲疏时，先用敬语（해요체）总不会错，对方会主动告诉你"말 편하게 해"表示可以用平语。',
  '⚠️ "먹다/자다/있다"这类词对长辈要换成"드시다/주무시다/계시다"，只加词尾是不够的。',
  '✅ 朋友之间关系变亲近后，会经历"존댓말 → 해요체 → 반말"的过程，这是韩语社交的标志。',
  '✅ 综艺里看到的"반말"多是多年好友或情侣间，初学者日常以敬语为主最安全。'
];
