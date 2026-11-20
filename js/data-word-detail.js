/* ============================================================
   韩小语 · 词根串联精讲词库（新增模块，不改原词库）
   ------------------------------------------------------------
   每组 = 一个词根（汉字词尾字），含：
     root: 词根汉字   rootKo: 韩语词根音   meaning: 词根含义
     intro: 词根串讲说明   tip: 记忆/辨析提示
     words: [{ko,cn,roman,pos,example:{ko,cn,parts:[{w,role,roleCn}]},relate:[...]}]
   parts 里 role: S主语 / O宾语 / V谓语 / T时间 / L地点 / M修饰
   ============================================================ */

const ROOT_GROUPS = [
  {
    root: '士', rootKo: '사', meaning: '有专业资格的人 · 师/士',
    intro: '「사(士)」来自汉字「士」，表示有专业身份或资格的人，相当于中文的「师」「士」。韩语里职业名称常用「OO사」构成。',
    tip: '记住规律：名词 + 사 = 某方面的专业人士。比如 변호사(律师)就是「辩护+士」。',
    words: [
      { ko:'변호사', cn:'律师', roman:'byeonhosa', pos:'名词',
        example:{ ko:'변호사가 법정에서 변론해요.', cn:'律师在法庭上辩护。',
          parts:[{w:'변호사가',role:'S',roleCn:'主语'},{w:'법정에서',role:'L',roleCn:'地点'},{w:'변론해요',role:'V',roleCn:'谓语'}] },
        relate:['법원 法院','재판 审判','의뢰인 委托人'] },
      { ko:'간호사', cn:'护士', roman:'ganhosa', pos:'名词',
        example:{ ko:'간호사가 환자를 돌봐요.', cn:'护士照顾病人。',
          parts:[{w:'간호사가',role:'S',roleCn:'主语'},{w:'환자를',role:'O',roleCn:'宾语'},{w:'돌봐요',role:'V',roleCn:'谓语'}] },
        relate:['병원 医院','의사 医生','환자 患者'] },
      { ko:'박사', cn:'博士', roman:'baksa', pos:'名词',
        example:{ ko:'그는 박사 학위를 땄어요.', cn:'他取得了博士学位。',
          parts:[{w:'그는',role:'S',roleCn:'主语'},{w:'박사 학위를',role:'O',roleCn:'宾语'},{w:'땄어요',role:'V',roleCn:'谓语'}] },
        relate:['석사 硕士','학사 学士','대학 大学'] },
      { ko:'기사', cn:'技师／司机／记事', roman:'gisa', pos:'名词',
        example:{ ko:'기사가 차를 운전해요.', cn:'司机开车。',
          parts:[{w:'기사가',role:'S',roleCn:'主语'},{w:'차를',role:'O',roleCn:'宾语'},{w:'운전해요',role:'V',roleCn:'谓语'}] },
        relate:['운전 驾驶','기차 火车','기술 技术'] },
      { ko:'신사', cn:'绅士／神社', roman:'sinsa', pos:'名词',
        example:{ ko:'그는 신사처럼 예의가 바르다.', cn:'他像绅士一样有礼貌。',
          parts:[{w:'그는',role:'S',roleCn:'主语'},{w:'신사처럼',role:'M',roleCn:'修饰'},{w:'예의가 바르다',role:'V',roleCn:'谓语'}] },
        relate:['예의 礼貌','신사복 西装','여사 女士'] },
      { ko:'회계사', cn:'会计师', roman:'hoegyesa', pos:'名词',
        example:{ ko:'회계사가 장부를 정리해요.', cn:'会计师整理账簿。',
          parts:[{w:'회계사가',role:'S',roleCn:'主语'},{w:'장부를',role:'O',roleCn:'宾语'},{w:'정리해요',role:'V',roleCn:'谓语'}] },
        relate:['회계 会计','세무사 税务师','장부 账簿'] }
    ]
  },
  {
    root: '원', rootKo: '원', meaning: '成员 · 员',
    intro: '「원(員)」表示「成员、人员」，常见于公司、机关里的身份称谓，相当于中文的「员」。',
    tip: '「OO원」多指某个单位里的工作人员，如 회사원(公司职员)、공무원(公务员)。',
    words: [
      { ko:'회사원', cn:'公司职员', roman:'hoesawon', pos:'名词',
        example:{ ko:'회사원이 출근해요.', cn:'公司职员去上班。',
          parts:[{w:'회사원이',role:'S',roleCn:'主语'},{w:'출근해요',role:'V',roleCn:'谓语'}] },
        relate:['회사 公司','직원 职员','출근 上班'] },
      { ko:'공무원', cn:'公务员', roman:'gongmuwon', pos:'名词',
        example:{ ko:'공무원이 서류를 처리해요.', cn:'公务员处理文件。',
          parts:[{w:'공무원이',role:'S',roleCn:'主语'},{w:'서류를',role:'O',roleCn:'宾语'},{w:'처리해요',role:'V',roleCn:'谓语'}] },
        relate:['정부 政府','서류 文件','기관 机关'] },
      { ko:'점원', cn:'店员', roman:'jeomwon', pos:'名词',
        example:{ ko:'점원이 손님을 맞이해요.', cn:'店员迎接客人。',
          parts:[{w:'점원이',role:'S',roleCn:'主语'},{w:'손님을',role:'O',roleCn:'宾语'},{w:'맞이해요',role:'V',roleCn:'谓语'}] },
        relate:['가게 店铺','손님 客人','매장 卖场'] }
    ]
  },
  {
    root: '가', rootKo: '가', meaning: '专家 · 家',
    intro: '「가(家)」来自汉字「家」，表示某领域的专家、行家，相当于中文的「家」。',
    tip: '「OO가」= 某方面的大师/专家，如 화가(画家)、음악가(音乐家)。',
    words: [
      { ko:'화가', cn:'画家', roman:'hwaga', pos:'名词',
        example:{ ko:'화가가 그림을 그려요.', cn:'画家画画。',
          parts:[{w:'화가가',role:'S',roleCn:'主语'},{w:'그림을',role:'O',roleCn:'宾语'},{w:'그려요',role:'V',roleCn:'谓语'}] },
        relate:['그림 画','미술 美术','전시회 展览会'] },
      { ko:'음악가', cn:'音乐家', roman:'eumakga', pos:'名词',
        example:{ ko:'음악가가 피아노를 연주해요.', cn:'音乐家弹奏钢琴。',
          parts:[{w:'음악가가',role:'S',roleCn:'主语'},{w:'피아노를',role:'O',roleCn:'宾语'},{w:'연주해요',role:'V',roleCn:'谓语'}] },
        relate:['음악 音乐','연주 演奏','작곡가 作曲家'] },
      { ko:'소설가', cn:'小说家', roman:'seolga', pos:'名词',
        example:{ ko:'소설가가 소설을 써요.', cn:'小说家写小说。',
          parts:[{w:'소설가가',role:'S',roleCn:'主语'},{w:'소설을',role:'O',roleCn:'宾语'},{w:'써요',role:'V',roleCn:'谓语'}] },
        relate:['소설 小说','작가 作家','출판 出版'] }
    ]
  },
  {
    root: '수', rootKo: '수', meaning: '能手 · 手',
    intro: '「수(手)」来自汉字「手」，表示擅长某件事的人，相当于中文的「手」「选手」。',
    tip: '「OO수」= 某方面的高手，如 가수(歌手)、운동선수(运动员)。注意 교수 是「教授」，语义特殊。',
    words: [
      { ko:'가수', cn:'歌手', roman:'gasu', pos:'名词',
        example:{ ko:'가수가 노래를 불러요.', cn:'歌手唱歌。',
          parts:[{w:'가수가',role:'S',roleCn:'主语'},{w:'노래를',role:'O',roleCn:'宾语'},{w:'불러요',role:'V',roleCn:'谓语'}] },
        relate:['노래 歌','무대 舞台','인기 人气'] },
      { ko:'선수', cn:'选手', roman:'seonsu', pos:'名词',
        example:{ ko:'선수가 경기에서 뛰어요.', cn:'选手在比赛中奔跑。',
          parts:[{w:'선수가',role:'S',roleCn:'主语'},{w:'경기에서',role:'L',roleCn:'地点'},{w:'뛰어요',role:'V',roleCn:'谓语'}] },
        relate:['경기 比赛','운동 运动','우승 冠军'] },
      { ko:'교수', cn:'教授', roman:'gyosu', pos:'名词',
        example:{ ko:'교수가 학생에게 강의해요.', cn:'教授给学生讲课。',
          parts:[{w:'교수가',role:'S',roleCn:'主语'},{w:'학생에게',role:'O',roleCn:'对象'},{w:'강의해요',role:'V',roleCn:'谓语'}] },
        relate:['대학 大学','강의 讲课','학생 学生'] }
    ]
  },
  {
    root: '인', rootKo: '인', meaning: '人 · 人',
    intro: '「인(人)」来自汉字「人」，表示某类人，相当于中文的「人」「人士」。',
    tip: '「OO인」= 某类身份的人，如 군인(军人)、연예인(艺人)。',
    words: [
      { ko:'군인', cn:'军人', roman:'gunin', pos:'名词',
        example:{ ko:'군인이 나라를 지켜요.', cn:'军人保卫国家。',
          parts:[{w:'군인이',role:'S',roleCn:'主语'},{w:'나라를',role:'O',roleCn:'宾语'},{w:'지켜요',role:'V',roleCn:'谓语'}] },
        relate:['군대 军队','나라 国家','복무 服役'] },
      { ko:'연예인', cn:'艺人', roman:'yeonyein', pos:'名词',
        example:{ ko:'연예인이 무대에 서요.', cn:'艺人站上舞台。',
          parts:[{w:'연예인이',role:'S',roleCn:'主语'},{w:'무대에',role:'L',roleCn:'地点'},{w:'서요',role:'V',roleCn:'谓语'}] },
        relate:['연예 演艺','배우 演员','팬 粉丝'] },
      { ko:'한국인', cn:'韩国人', roman:'hangugin', pos:'名词',
        example:{ ko:'저는 한국인이에요.', cn:'我是韩国人。',
          parts:[{w:'저는',role:'S',roleCn:'主语'},{w:'한국인이에요',role:'V',roleCn:'谓语(是)'}] },
        relate:['한국 韩国','중국인 中国人','외국인 外国人'] }
    ]
  },
  {
    root: '사', rootKo: '사', meaning: '老师 · 先生',
    intro: '「선생님(先生)」是韩语里对老师的称呼，由「先生 + 님(敬称)」构成。「님」是表示尊敬的后缀。',
    tip: '「님」接在身份后表尊敬：선생님(老师)、사장님(老板)、손님(客人)。比「씨」更尊敬。',
    words: [
      { ko:'선생님', cn:'老师', roman:'seonsaengnim', pos:'名词',
        example:{ ko:'선생님이 설명해 주세요.', cn:'老师请讲解一下。',
          parts:[{w:'선생님이',role:'S',roleCn:'主语'},{w:'설명해 주세요',role:'V',roleCn:'谓语(请)'}] },
        relate:['학생 学生','교실 教室','설명 说明'] },
      { ko:'사장님', cn:'老板', roman:'sajangnim', pos:'名词',
        example:{ ko:'사장님이 회사를 경영해요.', cn:'老板经营公司。',
          parts:[{w:'사장님이',role:'S',roleCn:'主语'},{w:'회사를',role:'O',roleCn:'宾语'},{w:'경영해요',role:'V',roleCn:'谓语'}] },
        relate:['사장 社长','회사 公司','경영 经营'] },
      { ko:'손님', cn:'客人', roman:'sonnim', pos:'名词',
        example:{ ko:'손님이 가게에 들어왔어요.', cn:'客人走进了店里。',
          parts:[{w:'손님이',role:'S',roleCn:'主语'},{w:'가게에',role:'L',roleCn:'地点'},{w:'들어왔어요',role:'V',roleCn:'谓语'}] },
        relate:['가게 店铺','점원 店员','고객 顾客'] }
    ]
  }
];

/* 主谓宾造句教学固定讲解（配合每个例句展示） */
const SENTENCE_GUIDE = {
  order: '韩语基本语序是「主语 + 宾语 + 谓语（SOV）」，动词/形容词永远放在句子最后。',
  particles: [
    { p:'은 / 는', use:'主题·主语助词', rule:'辅音结尾用 은，元音结尾用 나는→는', ex:'저는 (我) · 책은 (书)' },
    { p:'이 / 가', use:'主格助词', rule:'辅音结尾用 이，元音结尾用 가', ex:'학생이 (学生) · 친구가 (朋友)' },
    { p:'을 / 를', use:'宾格助词', rule:'辅音结尾用 을，元音结尾用 를', ex:'밥을 (饭) · 커피를 (咖啡)' },
    { p:'에 / 에서', use:'时间·地点助词', rule:'에 表时间点/到达点，에서 表动作发生地', ex:'학교에 (去学校) · 도서관에서 (在图书馆)' }
  ],
  roles: [
    { k:'S', name:'主语', desc:'动作的执行者，后接 은/는 或 이/가' },
    { k:'O', name:'宾语', desc:'动作的对象，后接 을/를' },
    { k:'V', name:'谓语', desc:'动作或状态，永远在句尾，常用 -요 结尾更礼貌' },
    { k:'L', name:'地点', desc:'动作发生的地方，后接 에/에서' },
    { k:'M', name:'修饰', desc:'修饰成分，如처럼(像…一样)' }
  ]
};
