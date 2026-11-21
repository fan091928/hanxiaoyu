/* ============================================================
   韩小语 · 交互逻辑
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 工具 ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'hanxiaoyu_v1';

  /* ---------- 真机安全区适配（iPhone 全系 / 微信 web-view）----------
     布局高度完全交给 CSS 100dvh（浏览器原生跟随地址栏收放），
     不再用 JS 写死 innerHeight——真机上 innerHeight 常小于物理屏幕，
     写死会把 app 截断、下方露出断层。这里只用探针读底部安全区作兜底。 */
  function fitScreen() {
    try {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;left:-9999px;bottom:0;width:1px;height:0;padding-bottom:env(safe-area-inset-bottom,0px)';
      document.body.appendChild(probe);
      const sb = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
      probe.remove();
      document.documentElement.style.setProperty('--safe-b', sb + 'px');
    } catch (e) {}
  }
  fitScreen();
  window.addEventListener('resize', fitScreen);
  window.addEventListener('orientationchange', () => setTimeout(fitScreen, 150));

  const defaultState = () => ({
    checkins: [], goal: 30, challengeName: '我的韩语挑战',
    completedUnits: [], learnedWords: [], favorites: [], listenLogs: [],
    lastOpen: '',
    // 个人资料：昵称 + 头像（emoji 或图片 dataURL），登录页与"我的"页均可修改
    nickname: '韩小语同学', avatar: '🐱',
    // 闯关等级进度：当前所在韩语等级(1-6)，通关本级全部关卡后自动升级并生成新挑战
    userLevel: 1, levelHistory: [],
    // 默写进度：pending=未完成(跳过/答错会保留并累计)，done=已完成。按已学单词出题
    spellProgress: { pending: [], done: [], totalSeen: 0 },
    // 学习计划：目标等级/方向/每日任务（focus 影响关卡主题，目标等级为长期目标）
    plan: { targetLevel: 2, dailyWords: 10, dailyMinutes: 15, focus: '日常会话', intensity: '适中' }
  });
  // 使用 Store 统一存储层：多副本冗余 + IndexedDB 备份 + 版本升级深度合并
  let state = (window.Store ? Store.load(defaultState) : loadFallback());
  if (!state.plan) state.plan = defaultState().plan;
  if (!state.nickname) state.nickname = defaultState().nickname;
  if (!state.avatar) state.avatar = defaultState().avatar;
  if (!state.spellProgress || !Array.isArray(state.spellProgress.pending) || !Array.isArray(state.spellProgress.done)) {
    state.spellProgress = defaultState().spellProgress;
  }

  function loadFallback() {
    try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return defaultState(); }
  }
  function save() {
    if (window.Store) Store.save(state);
    else { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- TTS 发音（Web Speech API · 甜美播音女声） ---------- */
  let koVoice = null;
  // 女声优先关键词（各平台常见韩语女声命名）
  const FEMALE_KEYS = /female|woman|yeo|she|siri|google|naver|yuna|jihye|seoyoung|sunmi|minji|소라|유나|지혜|서영|여성/i;
  const MALE_KEYS = /male|man|nam|junho|daniel|도현|준호|남성|junho/i;
  function pickVoice() {
    try {
      const vs = speechSynthesis.getVoices();
      const ko = vs.filter(v => /^ko(-|_)?/i.test(v.lang));
      // 优先：韩语 + 女声关键词；其次韩语任意女声；再退而求其次韩语默认
      koVoice =
        ko.find(v => FEMALE_KEYS.test(v.name) && !MALE_KEYS.test(v.name)) ||
        ko.find(v => FEMALE_KEYS.test(v.name)) ||
        ko.find(v => !MALE_KEYS.test(v.name)) ||
        ko[0] || null;
    } catch (e) {}
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  /* ---------- 真人发音（在线 TTS 音频，替代机器人合成声） ----------
     关键修复：浏览器加载 <audio> 时会带 Referer，百度 gettts 一旦检测到
     Referer 就返回 0 字节空音频（实测），导致韩剧长句台词无法发音。
     解决：所有音频元素统一设置 referrerPolicy='no-referrer'，去掉 Referer。
     优先级：百度 TTS（支持任意长度长句，需 no-referrer）→ 有道（短句≤10字更清晰）
            → Web Speech 女声（离线兜底）
  ------------------------------------------------------------------ */
  let audioPlayer = null;          // 当前音频对象（用于打断上一段）
  const audioCache = {};           // URL 缓存，避免重复请求
  let realVoiceOK = false;         // 真人发音是否至少成功过一次
  const Usee = s => encodeURIComponent(s);
  function ttsUrlBaidu(text, rate) {
    const spd = rate >= 1.3 ? 9 : (rate >= 0.9 ? 5 : (rate >= 0.65 ? 3 : 1));
    return `https://fanyi.baidu.com/gettts?lan=kor&text=${Usee(text)}&spd=${spd}&source=web`;
  }
  function ttsUrlYoudao(text) {
    return `https://dict.youdao.com/dictvoice?audio=${Usee(text)}&le=ko`;
  }
  // 创建音频元素并强制去掉 Referer：百度 TTS 带 Referer 会返回空音频
  function newAudioNoRef(url) {
    const a = new Audio();
    try { a.referrerPolicy = 'no-referrer'; } catch (e) {}
    a.src = audioCache[url] || url;
    a.preload = 'auto';
    return a;
  }
  // 候选发音源：百度优先（支持长句），短句追加有道（更清晰）
  function ttsCandidates(text, rate) {
    const list = [ttsUrlBaidu(text, rate)];
    if (Array.from(text).length <= 10) list.push(ttsUrlYoudao(text));
    return list;
  }
  // Web Speech 女声兜底（绝不使用男声）
  function speakFallback(text, rate) {
    if (!('speechSynthesis' in window)) { toast('当前环境暂不支持语音朗读'); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR';
      u.volume = 1;
      u.pitch = 1.15;
      u.rate = (rate || 1) * 0.95;
      if (koVoice) u.voice = koVoice;
      speechSynthesis.speak(u);
    } catch (e) { toast('朗读失败，请重试'); }
  }
  // 用 <audio> 播放真人音频；失败自动降级（referrerPolicy 去掉 Referer 是关键）
  function playRealAudio(text, rate) {
    const candidates = ttsCandidates(text, rate);
    let idx = 0;
    function tryNext() {
      if (idx >= candidates.length) { speakFallback(text, rate); return; }
      const url = candidates[idx++];
      try {
        if (audioPlayer) { audioPlayer.pause(); audioPlayer = null; }
        const a = newAudioNoRef(url);
        audioPlayer = a;
        let settled = false;
        const fallbackTimer = setTimeout(() => {
          if (!settled && a.paused) { settled = true; tryNext(); }
        }, 4500);
        a.oncanplay = () => { clearTimeout(fallbackTimer); };
        a.onplaying = () => { clearTimeout(fallbackTimer); realVoiceOK = true; };
        a.onerror = () => { if (!settled) { settled = true; clearTimeout(fallbackTimer); tryNext(); } };
        const p = a.play();
        if (p && p.catch) p.catch(() => { /* 自动播放受限时等待用户手势，onerror 会兜底 */ });
      } catch (e) { tryNext(); }
    }
    tryNext();
  }
  // 本地 Edge 韩语女声(ko-KR-SunHiNeural)：自然、贴近生活、有感情。
  // 若该台词已预生成 mp3，则优先播放本地音频（微信/PWA 稳定不依赖外网）。
  function localVoiceUrl(text) {
    try {
      const map = window.DRAMA_VOICE_MAP;
      const f = map && map[text];
      if (f) return 'audio/drama/' + f;
    } catch (e) {}
    return null;
  }
  // 播放本地 Edge 女声；onEnd 结束回调；返回是否成功启动
  function playLocalVoice(text, rate, onEnd) {
    const url = localVoiceUrl(text);
    if (!url) return false;
    try {
      if (audioPlayer) { try { audioPlayer.pause(); } catch (e) {} audioPlayer = null; }
      const a = new Audio();
      a.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=20261121x';
      a.preload = 'auto';
      a.playbackRate = rate || 1;
      audioPlayer = a;
      realVoiceOK = true;
      let done = false;
      const fin = () => { if (done) return; done = true; if (onEnd) onEnd(); };
      a.onended = fin;
      a.onerror = () => {
        if (!done) {
          done = true;
          if (onEnd) onEnd();              // 连读：结束回调让下一句继续
          else playRealAudio(text, rate);  // 逐句：本地音频缺失时降级在线音源
        }
      };
      const p = a.play();
      if (p && p.catch) p.catch(() => { /* 手势受限时降级 */ });
      return true;
    } catch (e) { return false; }
  }
  // ===== 韩剧台词按角色分声线：A=男性(沉稳磁力男声 InJoonNeural)，B=女性(sunhi) =====
  // 男性台词本地音频 URL（ko-KR-InJoonNeural，与 sunhi 同引擎的自然男声）
  function localMaleVoiceUrl(text) {
    try {
      const map = window.MALE_VOICE_MAP;
      const f = map && map[text];
      if (f) return 'audio/male/' + f;
    } catch (e) {}
    return null;
  }
  // 播放本地男声；返回是否成功启动。onEnd 用于连读串联
  function playMaleVoice(text, rate, onEnd) {
    const url = localMaleVoiceUrl(text);
    if (!url) return false;
    try {
      if (audioPlayer) { try { audioPlayer.pause(); } catch (e) {} audioPlayer = null; }
      const a = new Audio();
      a.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=20261121x';
      a.preload = 'auto';
      a.playbackRate = rate || 1;
      audioPlayer = a;
      realVoiceOK = true;
      let done = false;
      const fin = () => { if (done) return; done = true; if (onEnd) onEnd(); };
      a.onended = fin;
      a.onerror = () => {
        if (!done) {
          done = true;
          if (onEnd) onEnd();
          else playRealAudio(text, rate);
        }
      };
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
      return true;
    } catch (e) { return false; }
  }
  // 韩剧台词专用发音：按角色选声线
  //  - speaker 'A'(男)：本地男声优先，缺失则降级在线音源
  //  - 其他(女)：沿用 sunhi 本地女声 / 原逻辑
  function speakDrama(text, speaker, rate = 1, onEnd = null) {
    if (!text) { if (onEnd) onEnd(); return; }
    if (speaker === 'A') {
      // 男声：逐句用 playMaleVoice；连读(onEnd)也用它保证串联
      if (playMaleVoice(text, rate, onEnd)) return;
      // 男声本地缺失时降级：有连读回调用 speakWithEnd，否则在线音源
      if (onEnd) speakWithEnd(text, rate, onEnd);
      else playRealAudio(text, rate);
      return;
    }
    // 女性角色：保持原 sunhi 发音链路
    if (onEnd) { if (playLocalVoice(text, rate, onEnd)) return; speakWithEnd(text, rate, onEnd); }
    else speak(text, rate);
  }

  // 统一发音入口（兼容旧的 opts 参数，但忽略角色性别——全部使用清晰真声）
  function speak(text, rate = 1, opts = null) {
    if (!text) return;
    const r = (opts && opts.rate != null) ? opts.rate : rate;
    if (playLocalVoice(text, r, null)) return;   // 优先本地 Edge 女声
    playRealAudio(text, r);                       // 否则在线音源
  }
  window.__speak = speak;
  window.speakDrama = speakDrama;

  // Kpop 专用发音：强制走原来的在线音源（百度/有道），不使用本地 Edge 女声，
  // 保留用户精心挑选的 Kpop 原声听感（歌曲原声片段 kc.clip 本就独立、从未改动）。
  function speakKpop(text, rate = 1) {
    if (!text) return;
    playRealAudio(text, rate);
  }

  // 按文本长度估算音频播放上限（毫秒）——仅作 onended 不触发时的兜底，
  // 绝不再用固定 8 秒把正在播放的长句掐断（那正是"跳句/时断时续"的根因）。
  function estSpeakMs(text) {
    const n = Array.from(text || '').length;
    return Math.max(6000, n * 750 + 3500);
  }
  // 带"播放结束回调"的发音——用于全段连读串联（多源降级 + no-referrer）
  // 修复要点：
  //  1) 音频一旦 onplaying 真正开播，立刻清除"卡住兜底"定时器，播放中绝不被超时切走；
  //  2) "卡住兜底"只负责 3 秒内迟迟不播的情况，切换下一个音源；
  //  3) "最长兜底"按句长动态计算，仅当 onended 偶发不触发（iOS 微信）时收尾，避免卡死；
  //  4) done() 加 finished 幂等锁，回调只会触发一次，不会跳句或重复。
  function speakWithEnd(text, rate, onEnd) {
    if (!text) { if (onEnd) onEnd(); return null; }
    // 优先本地 Edge 女声（带结束回调，保证连读串联）
    if (playLocalVoice(text, rate, onEnd)) return audioPlayer;
    const candidates = ttsCandidates(text, rate);
    let idx = 0, firstAudio = null, finished = false;
    const maxWait = estSpeakMs(text);
    function done() { if (finished) return; finished = true; if (onEnd) onEnd(); }
    function webFallback() {
      try { speechSynthesis.cancel(); } catch (e) {}
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ko-KR'; u.rate = rate || 1; u.pitch = 1.05;
        if (koVoice) u.voice = koVoice;
        let fired = false;
        const fin = () => { if (!fired) { fired = true; clearTimeout(ft); done(); } };
        u.onend = fin; u.onerror = fin;
        const ft = setTimeout(fin, estSpeakMs(text));
        speechSynthesis.speak(u);
      } catch (e) { done(); }
    }
    function tryNext() {
      if (idx >= candidates.length) { webFallback(); return; }
      const url = candidates[idx++];
      try {
        if (audioPlayer) { try { audioPlayer.pause(); } catch (e) {} audioPlayer = null; }
        const a = newAudioNoRef(url);
        audioPlayer = a;
        if (!firstAudio) firstAudio = a;
        let stuckTimer = null, maxTimer = null;
        const clearAll = () => {
          if (stuckTimer) { clearTimeout(stuckTimer); stuckTimer = null; }
          if (maxTimer) { clearTimeout(maxTimer); maxTimer = null; }
        };
        // 卡住兜底：3 秒内音频还没真正开播，才切换下一个音源
        stuckTimer = setTimeout(() => {
          if (a.paused || a.readyState < 3) { clearAll(); tryNext(); }
        }, 3000);
        // 最长兜底：仅当 onended 未触发时用估算时长收尾
        maxTimer = setTimeout(() => { clearAll(); done(); }, maxWait);
        a.onplaying = () => { realVoiceOK = true; if (stuckTimer) { clearTimeout(stuckTimer); stuckTimer = null; } };
        a.onended = () => { clearAll(); done(); };
        a.onerror = () => { clearAll(); tryNext(); };
        const p = a.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) { tryNext(); }
    }
    tryNext();
    return firstAudio;
  }
  // 预加载下一句音频：提前把接下来 2 句的音频请求出去并放进浏览器缓存，
  // 轮到播放时秒开，消除全段连读时句与句之间的网络等待空档。
  function preloadLines(lines, from) {
    for (let j = from; j < Math.min(from + 2, lines.length); j++) {
      try {
        const a = newAudioNoRef(ttsUrlBaidu(lines[j].ko, 1));
        a.preload = 'auto';
        a.load();
      } catch (e) {}
    }
  }

  /* ---------- 日期 ---------- */
  const ds = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const todayStr = () => ds(new Date());
  function calcStreak() {
    const set = new Set(state.checkins);
    let cur = new Date();
    if (!set.has(ds(cur))) cur = addDays(cur, -1);
    let n = 0;
    while (set.has(ds(cur))) { n++; cur = addDays(cur, -1); }
    return n;
  }
  /* ---------- 个人资料：头像 + 昵称（登录页 / 我的页均可改） ---------- */
  const AVATAR_CHOICES = ['🐱','🐶','🐰','🐻','🐼','🦊','🐯','🐨','🐸','🐧','🦄','🐙','🌸','🌼','⭐','🎀','🍓','🍒','🐳','🦋'];
  function isImageAvatar(a) { return typeof a === 'string' && a.indexOf('data:image') === 0; }
  function avatarHTML(a, cls) {
    return isImageAvatar(a)
      ? `<img src="${a}" class="${cls}">`
      : `<span class="${cls}">${esc(a || '🐱')}</span>`;
  }
  function renderProfile() {
    const nick = state.nickname || '韩小语同学';
    const av = state.avatar || '🐱';
    const inner = isImageAvatar(av)
      ? `<img src="${av}" alt="头像">`
      : esc(av || '🐱');
    const sa = $('#splashAvatar'), sn = $('#splashNickname');
    if (sa) sa.innerHTML = inner;
    if (sn) sn.textContent = nick;
    const ma = $('#meAvatar'), mn = $('#meNickname');
    if (ma) ma.innerHTML = inner;
    if (mn) mn.textContent = nick;
  }
  function openProfileEditor() {
    const nick = state.nickname || '韩小语同学';
    const av = state.avatar || '🐱';
    openModal(`
      <div class="modal-title">✎ 修改个人资料</div>
      <div class="profile-edit-avatar" id="profileEditAvatar">${avatarHTML(av, 'pea-img')}</div>
      <div class="profile-avatar-grid" id="avatarGrid">
        ${AVATAR_CHOICES.map(a => `<button class="avatar-choice ${a === av ? 'active' : ''}" data-av="${a}">${a}</button>`).join('')}
      </div>
      <label class="profile-upload" for="avatarFile">📷 上传自定义头像</label>
      <input type="file" id="avatarFile" accept="image/*" style="display:none">
      <div class="form-group" style="margin-top:12px"><label>昵称</label>
        <input class="modal-input" id="nickInput" maxlength="16" value="${esc(nick)}" placeholder="给自己起个昵称"></div>
      <div class="modal-btns">
        <button class="modal-cancel" data-act="cancel">取消</button>
        <button class="modal-ok" data-act="ok">保存</button>
      </div>`);
    let pickedAvatar = av;
    $$('#avatarGrid .avatar-choice').forEach(b => b.onclick = () => {
      $$('#avatarGrid .avatar-choice').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      pickedAvatar = b.dataset.av;
      $('#profileEditAvatar').innerHTML = `<span class="pea-img">${pickedAvatar}</span>`;
    });
    $('#avatarFile').onchange = e => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = ev => {
        // 压缩到 128px 以内，避免 localStorage 超限
        const img = new Image();
        img.onload = () => {
          const size = 128, c = document.createElement('canvas');
          c.width = c.height = size;
          const ctx = c.getContext('2d');
          const s = Math.min(img.width, img.height);
          ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
          pickedAvatar = c.toDataURL('image/jpeg', 0.8);
          $('#profileEditAvatar').innerHTML = `<img src="${pickedAvatar}" class="pea-img">`;
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(f);
    };
    $('#modalCard [data-act="cancel"]').onclick = closeModal;
    $('#modalCard [data-act="ok"]').onclick = () => {
      const n = $('#nickInput').value.trim();
      state.nickname = n || '韩小语同学';
      state.avatar = pickedAvatar;
      save(); renderProfile(); closeModal();
      toast('✅ 个人资料已保存');
    };
  }
  function refreshStats() {
    const streak = calcStreak();
    renderProfile();
    $('#topStreak .ts-num').textContent = streak;
    $('#statStreak').textContent = streak;
    $('#statTotal').textContent = state.checkins.length;
    $('#statGoal').textContent = state.goal;
    $('#meDays').textContent = state.checkins.length;
    const pct = Math.min(100, Math.round(state.checkins.length / state.goal * 100));
    $('#progressFill').style.width = pct + '%';
    $('#progressTip').textContent = `已打卡 ${state.checkins.length} / ${state.goal} 天，完成 ${pct}%`;
    $('#challengeName').textContent = `🎯 ${state.challengeName}`;
    const done = state.checkins.includes(todayStr());
    const btn = $('#checkinBtn');
    btn.classList.toggle('done', done);
    $('.cb-text', btn).textContent = done ? '今日已打卡' : '今日打卡';
    $('.cb-icon', btn).textContent = done ? '✅' : '📅';
    $('#heroHint').textContent = done ? '太棒了！今天也坚持住了 ✨' : '点击按钮，开启今天的学习吧';
  }

  /* ---------- 通用弹层 ---------- */
  function openModal(html) {
    $('#modalCard').innerHTML = html;
    $('#modalOverlay').classList.add('show');
  }
  function closeModal() { $('#modalOverlay').classList.remove('show'); if (typeof stopKgClip === 'function') stopKgClip(); if (typeof stopSing === 'function') stopSing(); }
  $('#modalOverlay').addEventListener('click', e => { if (e.target.id === 'modalOverlay') closeModal(); });

  function modalPrompt(title, value, placeholder, onOk) {
    openModal(`
      <div class="modal-title">${esc(title)}</div>
      <input class="modal-input" id="mInput" value="${esc(value)}" placeholder="${esc(placeholder)}">
      <div class="modal-btns">
        <button class="modal-cancel" data-act="cancel">取消</button>
        <button class="modal-ok" data-act="ok">确定</button>
      </div>`);
    $('#mInput').focus();
    $('#modalCard [data-act="cancel"]').onclick = closeModal;
    $('#modalCard [data-act="ok"]').onclick = () => {
      const v = $('#mInput').value.trim();
      if (v) { onOk(v); closeModal(); }
    };
  }

  /* ---------- 收藏 ---------- */
  function isFav(key) { return state.favorites.some(f => f.key === key); }
  function toggleFav(item) {
    if (isFav(item.key)) {
      state.favorites = state.favorites.filter(f => f.key !== item.key);
      toast('已取消收藏');
    } else {
      state.favorites.push(item);
      toast('已加入收藏本 ⭐');
    }
    save();
    renderCollect();
    $$('[data-fav]').forEach(b => b.classList.toggle('on', isFav(b.dataset.fav)));
  }

  /* ============================================================
     启动弹窗
     ============================================================ */
  function initSplash() {
    // 固定主推名言；也可随机取备用
    const q = QUOTES[0];
    $('#quoteKo').textContent = q.ko;
    $('#quoteCn').textContent = q.cn;
    $('#cheerKo').textContent = q.cheerKo;
    $('#cheerCn').textContent = q.cheerCn;
    renderProfile();
    const sp = $('#splashProfile');
    if (sp) sp.onclick = e => { e.stopPropagation(); openProfileEditor(); };
    const mh = $('#meHero');
    if (mh) mh.onclick = e => { openProfileEditor(); };
    $('#splashStart').onclick = () => {
      $('#splashOverlay').style.transition = 'opacity .3s';
      $('#splashOverlay').style.opacity = '0';
      setTimeout(() => $('#splashOverlay').remove(), 300);
      checkBreakIn();
    };
  }
  function checkBreakIn() {
    const last = state.lastOpen;
    const today = todayStr();
    if (last && last !== today && state.checkins.length > 0) {
      const diff = Math.round((new Date(today) - new Date(last)) / 86400000);
      if (diff > 1) setTimeout(() => toast('💔 已断签，今天重新出发吧！'), 500);
    }
    state.lastOpen = today;
    save();
  }

  /* ============================================================
     导航
     ============================================================ */
  $$('.tab-item').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab-item').forEach(t => t.classList.remove('active'));
    $$('.page').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    $('#page-' + tab.dataset.page).classList.add('active');
    $('.page-wrap').scrollTop = 0;
    // 返回置顶键仅在词典页可用
    var btt = document.getElementById('dictBackTop');
    if (btt) btt.classList.remove('show');
    if (tab.dataset.page === 'checkin') { refreshStats(); renderCalendar(); }
    if (tab.dataset.page === 'me') refreshStats();
  }));

  /* 词典页：滚动超过两页显示返回置顶键 */
  (function initDictBackTop(){
    var wrap = document.querySelector('.page-wrap');
    var btt = document.getElementById('dictBackTop');
    var dictPage = document.getElementById('page-dict');
    if (!wrap || !btt || !dictPage) return;
    wrap.addEventListener('scroll', function(){
      if (!dictPage.classList.contains('active')) { btt.classList.remove('show'); return; }
      var twoPages = (wrap.clientHeight || window.innerHeight) * 2;
      if (wrap.scrollTop > twoPages) btt.classList.add('show');
      else btt.classList.remove('show');
    }, { passive: true });
    btt.addEventListener('click', function(){
      if (wrap.scrollTo) wrap.scrollTo({ top: 0, behavior: 'smooth' });
      else wrap.scrollTop = 0;
    });
  })();

  /* ============================================================
     首页
     ============================================================ */
  // 根据当前韩语等级生成关卡：每升一级生成全新一关，题目适配该等级
  function buildAdaptiveUnits() {
    const lv = state.userLevel || 1;
    const p = state.plan;
    // 每个等级固定 6 个关卡，通关本级全部关卡即可升级
    const count = 6;
    const topics = {
      '日常会话': ['日常问候', '场景对话', '生活短语', '购物点餐', '交通出行', '问路指路', '电话沟通', '情绪表达', '天气季节', '校园职场'],
      '考级备考': ['基础发音', '核心词汇', '初级语法', '阅读精练', '听力强化', '中级词汇', '中级语法', '写作训练', '高级词汇', '真题冲刺'],
      '旅行实用': ['出行用语', '机场值机', '酒店入住', '餐厅点餐', '购物砍价', '问路指路', '紧急情况', '就医用语', '交友寒暄', '文化礼仪'],
      'TOPIK冲刺': ['TOPIK词汇', 'TOPIK语法', '听力真题', '阅读真题', '写作模板', '高频词组', '易混语法', '高级表达', '模拟测试', '错题复盘']
    }[p.focus] || ['日常问候', '场景对话', '生活短语', '购物点餐', '交通出行', '问路指路'];
    const cnNum = ['一','二','三','四','五','六'];
    const units = [];
    for (let i = 0; i < count; i++) {
      units.push({
        id: i + 1,
        title: `第${cnNum[i]}关`,
        desc: `${topics[(lv + i - 1) % topics.length]} · TOPIK ${lv}级词库 · 3题`,
        reward: 3 + lv,
        level: lv
      });
    }
    return { units, levelLabel: `TOPIK ${lv}级`, count, level: lv };
  }
  // 当前等级词池：优先本级词，不足时用相邻等级补足（保证题目真正适配等级）
  function levelWordPool(lv) {
    let pool = TOPIK_WORDS.filter(w => w.level === lv);
    if (pool.length < 30) pool = pool.concat(TOPIK_WORDS.filter(w => Math.abs(w.level - lv) === 1));
    return pool.length ? pool : TOPIK_WORDS;
  }

  function renderHome() {
    const p = state.plan;
    const lv = state.userLevel || 1;
    const lvName = ['','TOPIK 1级','TOPIK 2级','TOPIK 3级','TOPIK 4级','TOPIK 5级','TOPIK 6级'][lv];
    // 学习计划摘要
    $('#planSummary').textContent = `目标 ${['','TOPIK 1级','TOPIK 2级','TOPIK 3级','TOPIK 4级','TOPIK 5级','TOPIK 6级'][p.targetLevel]} · 每日 ${p.dailyWords} 词 / ${p.dailyMinutes} 分钟 · ${p.focus}`;
    $('#planStats').innerHTML = `
      <div class="plan-chip"><span class="plan-chip-num">${lv}级</span><span class="plan-chip-label">当前等级</span></div>
      <div class="plan-chip"><span class="plan-chip-num">${p.targetLevel}级</span><span class="plan-chip-label">目标等级</span></div>
      <div class="plan-chip"><span class="plan-chip-num">${p.dailyWords}</span><span class="plan-chip-label">每日词量</span></div>
      <div class="plan-chip"><span class="plan-chip-num">${state.completedUnits.length}</span><span class="plan-chip-label">本级过关</span></div>`;

    // 自适应单元：按当前等级生成，通关本级全部关卡自动升级刷新挑战
    const { units, levelLabel, count } = buildAdaptiveUnits();
    const doneCount = units.filter(u => state.completedUnits.includes(u.id)).length;
    $('#unitModeTag').textContent = `第 ${lv} 级 · ${doneCount}/${count} 关`;
    $('#adaptiveHint').innerHTML = `✨ 当前挑战：<b>${levelLabel}</b>，题目全部取自该等级词库。通关全部 ${count} 关将自动升级，生成新的等级挑战。`;
    // 升级进度条
    const hud = $('#levelHud');
    if (hud) {
      const pct = Math.round(doneCount / count * 100);
      const cleared = (state.levelHistory || []).length;
      hud.innerHTML = `
        <div class="lv-hud-top">
          <div class="lv-hud-badge">Lv.${lv}</div>
          <div class="lv-hud-info">
            <div class="lv-hud-title">${lvName} 闯关中${cleared ? ` · 已通过 ${cleared} 个等级` : ''}</div>
            <div class="lv-hud-sub">已通关 ${doneCount} / ${count} 关 · ${pct}%</div>
          </div>
          ${lv < 6 ? `<div class="lv-hud-next">下一级 ↑<br>Lv.${lv + 1}</div>` : `<div class="lv-hud-next max">MAX</div>`}
        </div>
        <div class="lv-hud-bar"><span style="width:${pct}%"></span></div>`;
    }
    $('#unitList').innerHTML = units.map(u => {
      const done = state.completedUnits.includes(u.id);
      // 所有关卡均可直接打开，无需先完成前面的关卡
      return `<div class="unit ${done ? 'done' : ''}" data-uid="${u.id}">
        <div class="unit-num">${u.id}</div>
        <div class="unit-info">
          <div class="unit-title">${u.title} <span class="word-lv lv${u.level}">Lv${u.level}</span></div>
          <div class="unit-desc">${u.desc}</div>
          <div class="unit-reward">🎁 奖励 ${u.reward} 份 scrap</div>
        </div>
        <div class="unit-tag ok">${done ? '✓ 已完成' : '可挑战'}</div>
      </div>`;
    }).join('');
    $$('#unitList .unit').forEach(el => el.addEventListener('click', () => {
      const uid = +el.dataset.uid;
      const u = units.find(x => x.id === uid);
      // 任何关卡都可随时打开练习，已完成的可重玩
      openAdaptiveQuiz(u);
    }));

    // 学习模块
    $('#moduleGrid').innerHTML = MODULES.map((m, i) => `
      <div class="module" data-mi="${i}">
        <div class="module-icon">${m.icon}</div>
        <div class="module-title">${m.title}</div>
        <div class="module-ko">${m.ko}</div>
        <div class="module-cn">${m.cn}</div>
      </div>`).join('');
    $$('#moduleGrid .module').forEach(el => el.addEventListener('click', () => openModule(+el.dataset.mi)));

    renderDailySentence();
  }

  // ---------- 每日一句：北京时间零点准时更新，整句可点读 ----------
  let dailyDateKey = '';
  function beijingDateKey(d = new Date()) {
    // 用北京时间(UTC+8)计算日期键 YYYY-MM-DD
    const bj = new Date(d.getTime() + 8 * 3600 * 1000);
    return `${bj.getUTCFullYear()}-${String(bj.getUTCMonth() + 1).padStart(2, '0')}-${String(bj.getUTCDate()).padStart(2, '0')}`;
  }
  // 当日金句池：内置名言 + 网络拉取的韩语金句（去重），由日期稳定选一句
  function quotePool() {
    const base = (typeof KOREAN_QUOTES !== 'undefined' && KOREAN_QUOTES.length) ? KOREAN_QUOTES : [];
    const online = (window.__onlineQuotes && window.__onlineQuotes.length) ? window.__onlineQuotes : [];
    const seen = new Set(), out = [];
    [...online, ...base].forEach(s => {
      if (s && s.ko && !seen.has(s.ko)) { seen.add(s.ko); out.push(s); }
    });
    return out.length ? out : DAILY_SENTENCES;
  }
  // 由北京时间日期键稳定推导当日金句（同一天固定、零点更新、两处一致）
  function pickDailySentence() {
    const key = beijingDateKey();
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    const pool = quotePool();
    return { s: pool[hash % pool.length], key };
  }
  // 接入网络：站点随附的 quotes.json 就是可远程更新的金句源；
  // 替换/发布新的 quotes.json 即可联网更新金句，无需改代码。
  async function loadOnlineQuotes() {
    const SOURCES = ['quotes.json'];
    for (const url of SOURCES) {
      try {
        const ctl = new AbortController();
        const tid = setTimeout(() => ctl.abort(), 4000);
        const res = await fetch(url, { signal: ctl.signal, cache: 'no-store' });
        clearTimeout(tid);
        if (!res.ok) continue;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.quotes || []);
        const valid = list.filter(q => q && q.ko && /[가-힣]/.test(q.ko));
        if (valid.length) {
          window.__onlineQuotes = valid;
          return true;
        }
      } catch (e) { /* 离线时静默用内置库 */ }
    }
    return false;
  }
  function renderDailySentence() {
    const { s, key } = pickDailySentence();
    dailyDateKey = key;
    $('#bannerKo').textContent = s.ko;
    $('#bannerCn').textContent = s.cn;
    $('#bannerKo').dataset.say = s.ko;
    $('#bannerCn').textContent = s.cn + ' · 点击朗读';
    // 播放按钮 + 整句点读
    $('#bannerPlay').onclick = e => { e.stopPropagation(); speak(s.ko); };
    const banner = $('#bannerDaily');
    banner.onclick = () => speak(s.ko);
    banner.style.cursor = 'pointer';
    // 标注今日日期
    const tag = banner.querySelector('.banner-tag');
    let isCustom = false;
    if (window.Publisher) {
      const pcfg = Publisher.getConfig();
      if (pcfg.daily && pcfg.daily.length) isCustom = pcfg.daily.some(d => d.ko === s.ko);
    }
    if (tag) tag.textContent = (isCustom ? '发布者精选 · ' : '每日一句 · ') + key.slice(5).replace('-', '/');
  }
  // 暴露给定时器：跨零点时刷新（每日一句 + 练习今日推荐 同步更新）
  window.__refreshDaily = function () {
    if (beijingDateKey() !== dailyDateKey) {
      renderDailySentence();
      if (typeof renderSentences === 'function') renderSentences();
      toast('🌅 新的一天，每日一句已更新');
    }
  };
  // 每分钟检查一次日期，确保零点后一分钟内自动更新
  setInterval(() => window.__refreshDaily(), 60 * 1000);
  // 页面启动时尝试联网拉取韩语金句，成功后重绘两处
  if (typeof loadOnlineQuotes === 'function') {
    loadOnlineQuotes().then(ok => {
      if (ok) {
        dailyDateKey = '';
        renderDailySentence();
        if (typeof renderSentences === 'function') renderSentences();
      }
    });
  }

  // 学习计划设置弹窗
  window.__openPlan = function () {
    const p = state.plan;
    openModal(`
      <div class="modal-title">🎯 设置我的学习计划</div>
      <div style="font-size:11px;color:var(--sub);margin-bottom:10px">设置后闯关学习内容会自动调整</div>
      <div class="form-group"><label>目标等级</label>
        <select id="planLevel" class="modal-input">
          ${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${p.targetLevel===n?'selected':''}>TOPIK ${n} 级</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>学习方向</label>
        <select id="planFocus" class="modal-input">
          ${['日常会话','考级备考','旅行实用','TOPIK冲刺'].map(f=>`<option ${p.focus===f?'selected':''}>${f}</option>`).join('')}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label>每日词量</label>
          <select id="planWords" class="modal-input">
            ${[5,10,15,20,30].map(n=>`<option value="${n}" ${p.dailyWords===n?'selected':''}>${n} 词</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>每日时长</label>
          <select id="planMinutes" class="modal-input">
            ${[10,15,30,45,60].map(n=>`<option value="${n}" ${p.dailyMinutes===n?'selected':''}>${n} 分钟</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-btns">
        <button class="modal-cancel" data-act="cancel">取消</button>
        <button class="modal-ok" data-act="ok">保存并自动调整</button>
      </div>`);
    $('#modalCard [data-act="cancel"]').onclick = closeModal;
    $('#modalCard [data-act="ok"]').onclick = () => {
      state.plan = {
        targetLevel: +$('#planLevel').value,
        focus: $('#planFocus').value,
        dailyWords: +$('#planWords').value,
        dailyMinutes: +$('#planMinutes').value,
        intensity: p.intensity
      };
      save(); closeModal(); renderHome();
      toast('✅ 计划已保存，闯关内容已自动调整');
    };
  };

  // 一题一页闯关：题目从当前等级词库抽取，答完一题翻下一题，通关本级全部关卡自动升级刷新挑战
  function openAdaptiveQuiz(u) {
    const lv = state.userLevel || 1;
    const pool = levelWordPool(lv);
    // 按单元id + 等级稳定取 3 题，确保同一关卡题目固定、且随等级升级而更新
    const picked = [];
    const usedKo = new Set();
    for (let k = 0; picked.length < 3 && k < 60; k++) {
      const w = pool[(u.id * 11 + lv * 7 + k * 13) % pool.length];
      if (usedKo.has(w.ko)) continue;
      usedKo.add(w.ko); picked.push(w);
    }
    const qs = picked.map((w, qi) => {
      // 干扰项优先同等级词，保证"选项也在同一难度带"
      const sameLv = pool.filter(x => x.cn !== w.cn && x.level === lv);
      const dSrc = sameLv.length >= 3 ? sameLv : pool.filter(x => x.cn !== w.cn);
      const distract = [];
      const usedCn = new Set([w.cn]);
      for (let d = 0; distract.length < 3 && d < 80; d++) {
        const cand = dSrc[(u.id * 5 + qi * 9 + d * 17) % dSrc.length];
        if (!cand || usedCn.has(cand.cn)) continue;
        usedCn.add(cand.cn); distract.push(cand.cn);
      }
      const opts = [w.cn, ...distract];
      // 稳定洗牌
      for (let s = opts.length - 1; s > 0; s--) {
        const j = (u.id * 3 + qi * 5 + s * 7) % (s + 1);
        const tmp = opts[s]; opts[s] = opts[j]; opts[j] = tmp;
      }
      return { q: `「${w.ko}」的意思是？`, opts, ans: opts.indexOf(w.cn), word: w };
    });

    let cur = 0, score = 0, answered = false;
    function renderStep() {
      const q = qs[cur];
      openModal(`
        <div class="quiz-step-head">
          <div class="quiz-step-title">${u.title} <span class="word-lv lv${lv}">Lv${lv}</span></div>
          <div class="quiz-step-count">${cur + 1} / ${qs.length}</div>
        </div>
        <div class="quiz-step-bar"><span style="width:${Math.round((cur + 1) / qs.length * 100)}%"></span></div>
        <div class="quiz-step-card">
          <div class="quiz-step-word">${esc(q.word.ko)}</div>
          <div class="quiz-step-roman">${esc(q.word.roman)}</div>
          <button class="quiz-step-say" id="quizSay">🔊 听发音</button>
          <div class="quiz-step-q">${esc(q.q)}</div>
          <div class="quiz-step-opts" id="quizOpts">
            ${q.opts.map((o, j) => `<button class="quiz-step-opt" data-opt="${j}"><span class="qo-key">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}
          </div>
          <div class="quiz-step-feedback" id="quizFeedback"></div>
        </div>
        <div class="modal-btns" id="quizStepBtns">
          <button class="modal-cancel" id="quizQuit">退出</button>
          <button class="modal-ok" id="quizNext" style="visibility:hidden">${cur === qs.length - 1 ? '查看结果' : '下一题 →'}</button>
        </div>`);
      $('#quizSay').onclick = () => speak(q.word.ko, 0.9);
      $('#quizQuit').onclick = closeModal;
      $$('#quizOpts .quiz-step-opt').forEach(btn => btn.onclick = () => {
        if (answered) return;
        answered = true;
        const pick = +btn.dataset.opt;
        const ok = pick === q.ans;
        if (ok) score++;
        $$('#quizOpts .quiz-step-opt').forEach((b, j) => {
          b.disabled = true;
          if (j === q.ans) b.classList.add('right');
          else if (j === pick) b.classList.add('wrong');
        });
        const fb = $('#quizFeedback');
        fb.className = 'quiz-step-feedback show ' + (ok ? 'ok' : 'no');
        fb.innerHTML = ok
          ? `<span class="fb-mark ok">✓</span> 答对了！<b>${esc(q.word.ko)}</b> = ${esc(q.word.cn)}`
          : `<span class="fb-mark no">✕</span> 答错了，正确答案是 <b>${esc(q.opts[q.ans])}</b>（${esc(q.word.ko)} = ${esc(q.word.cn)}）`;
        $('#quizNext').style.visibility = 'visible';
      });
      $('#quizNext').onclick = () => {
        if (cur < qs.length - 1) { cur++; answered = false; renderStep(); }
        else finishQuiz();
      };
    }
    function finishQuiz() {
      const pass = score >= 2; // 3题答对2题即通关
      if (!pass) {
        openModal(`<div class="modal-title">再接再厉 💪</div>
          <p style="text-align:center;font-size:13px;line-height:1.9">答对 ${score} / ${qs.length} 题，答对 2 题即可通关。<br>题目来自 TOPIK ${lv} 级词库，再复习一下吧！</p>
          <div class="modal-btns"><button class="modal-cancel" data-act="cancel">退出</button><button class="modal-ok" data-act="retry">再挑战一次</button></div>`);
        $('#modalCard [data-act="cancel"]').onclick = closeModal;
        $('#modalCard [data-act="retry"]').onclick = () => { cur = 0; score = 0; answered = false; renderStep(); };
        return;
      }
      if (!state.completedUnits.includes(u.id)) state.completedUnits.push(u.id);
      const { units, count } = buildAdaptiveUnits();
      const allDone = units.every(x => state.completedUnits.includes(x.id));
      if (allDone && lv < 6) {
        // 通关本级全部关卡 → 升级，生成全新挑战
        if (!state.levelHistory.includes(lv)) state.levelHistory.push(lv);
        state.userLevel = lv + 1;
        state.completedUnits = [];
        save(); renderHome();
        openModal(`<div class="modal-title" style="color:var(--green);text-align:center">🎉 恭喜升级！</div>
          <p style="text-align:center;font-size:13px;line-height:2">TOPIK ${lv} 级全部 ${count} 关已通关！<br>答对 ${score} / ${qs.length} 题，获得 <b>${u.reward} 份 scrap</b><br>
          已为你生成 <b>TOPIK ${lv + 1} 级</b> 全新闯关挑战，<br>题目将全部取自 ${lv + 1} 级词库。</p>
          <div class="modal-btns"><button class="modal-ok" data-act="ok">开始新等级挑战</button></div>`);
        $('#modalCard [data-act="ok"]').onclick = closeModal;
      } else if (allDone && lv >= 6) {
        if (!state.levelHistory.includes(lv)) state.levelHistory.push(lv);
        save(); renderHome();
        openModal(`<div class="modal-title" style="color:var(--green);text-align:center">👑 全部通关！</div>
          <p style="text-align:center;font-size:13px;line-height:2">恭喜完成 TOPIK 1-6 全部等级闯关！<br>你的韩语已达最高级，太棒了！</p>
          <div class="modal-btns"><button class="modal-ok" data-act="ok">太棒了</button></div>`);
        $('#modalCard [data-act="ok"]').onclick = closeModal;
      } else {
        save(); renderHome();
        const nowDone = units.filter(x => state.completedUnits.includes(x.id)).length;
        openModal(`<div class="modal-title" style="color:var(--green);text-align:center">🎉 挑战成功！</div>
          <p style="text-align:center;font-size:13px;line-height:2">答对 ${score} / ${qs.length} 题，获得 <b>${u.reward} 份 scrap</b><br>
          本级进度 ${nowDone} / ${count} 关<br>
          <span style="color:var(--sub);font-size:12px">通关全部 ${count} 关即可升级并解锁新挑战</span></p>
          <div class="modal-btns"><button class="modal-ok" data-act="ok">继续闯关</button></div>`);
        $('#modalCard [data-act="ok"]').onclick = closeModal;
      }
    }
    renderStep();
  }

  function openQuiz(u) {
    const qs = QUIZ[u.id] || [];
    openModal(`
      <div class="modal-title">${u.title} · 小测（5题）</div>
      <form id="quizForm">
        ${qs.map((q, i) => `
          <div style="margin-bottom:14px">
            <div style="font-size:12px;font-weight:600;margin-bottom:7px">${i + 1}. ${esc(q.q)}</div>
            ${q.opts.map((o, j) => `<label class="quiz-opt"><input type="radio" name="q${i}" value="${j}" style="margin-right:8px">${esc(o)}</label>`).join('')}
          </div>`).join('')}
        <div class="modal-btns"><button type="button" class="modal-cancel" data-act="cancel">放弃</button>
        <button type="submit" class="modal-ok">提交答案</button></div>
      </form>`);
    $('#modalCard [data-act="cancel"]').onclick = closeModal;
    $('#quizForm').onsubmit = e => {
      e.preventDefault();
      let score = 0;
      qs.forEach((q, i) => {
        const sel = $(`input[name="q${i}"]:checked`, e.target);
        if (sel && +sel.value === q.ans) score++;
      });
      if (score >= 3) {
        if (!state.completedUnits.includes(u.id)) state.completedUnits.push(u.id);
        save(); renderHome();
        openModal(`<div class="modal-title" style="color:var(--green)">🎉 挑战成功！</div>
          <p style="text-align:center;font-size:13px;line-height:1.8">答对 ${score} / ${qs.length} 题<br>获得 <b>${u.reward} 份 scrap</b> 奖励<br>${u.id < 6 ? '下一单元已解锁 🔓' : '全部单元已通关，太棒了！'}</p>
          <div class="modal-btns"><button class="modal-ok" data-act="ok">继续加油</button></div>`);
        $('#modalCard [data-act="ok"]').onclick = closeModal;
      } else {
        openModal(`<div class="modal-title">再接再厉 💪</div>
          <p style="text-align:center;font-size:13px">答对 ${score} / ${qs.length} 题，达到 3 题即可通关。<br>复习一下再来挑战吧！</p>
          <div class="modal-btns"><button class="modal-ok" data-act="ok">知道了</button></div>`);
        $('#modalCard [data-act="ok"]').onclick = closeModal;
      }
    };
  }

  // 学习模块 → 目标位置映射：点击直接跳到对应功能/场景，不用再找
  const MODULE_TARGETS = [
    { tab: 'sentence', scene: '식당 餐厅点餐' },   // 餐厅点餐
    { tab: 'sentence', scene: '교통 交通出行' },   // 乘坐地铁
    { tab: 'sentence', scene: '교통 交通出行' },   // 乘坐公交
    { tab: 'sentence', scene: '길찾기 问路指路' },  // 问路
    { tab: 'sentence', scene: '숙박 酒店住宿' },   // 入住酒店
    { tab: 'sentence', scene: '일상대화 日常沟通' }, // 日常沟通
    { tab: 'drama' },                               // 口语跟读 → 韩剧台词
    { tab: 'pron' }                                 // 韩语听写 → 发音检验(听音辨词)
  ];
  function openModule(i) {
    const m = MODULES[i];
    const target = MODULE_TARGETS[i] || { tab: 'sentence' };
    // 点击反馈
    const el = $(`#moduleGrid .module[data-mi="${i}"]`);
    if (el) { el.classList.remove('jump-active'); void el.offsetWidth; el.classList.add('jump-active'); }
    // 切换到练习页
    $$('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.page === 'practice'));
    $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-practice'));

    if (target.tab === 'drama') {
      switchPracticeTab('drama');
    } else if (target.tab === 'pron') {
      switchPracticeTab('words');
      switchReciteMode('pron');
    } else {
      switchPracticeTab('sentence');
      // 定位到对应场景：设置场景筛选并滚动
      if (window.__selectScene) window.__selectScene(target.scene);
    }
    const wrap = $('.page-wrap');
    if (wrap) wrap.scrollTop = 0;
    toast(`已跳转到「${m.title}」`);
  }

  /* ============================================================
     打卡
     ============================================================ */
  let calYear, calMonth;
  function initCheckin() {
    const now = new Date();
    calYear = now.getFullYear(); calMonth = now.getMonth();
    $('#checkinBtn').onclick = () => {
      const t = todayStr();
      if (state.checkins.includes(t)) { toast('今天已经打过卡啦 ✅'); return; }
      state.checkins.push(t);
      save(); refreshStats(); renderCalendar();
      openModal(`<div class="modal-title">🎉 打卡成功！</div>
        <p style="text-align:center;font-size:13px;line-height:1.9">连续打卡 <b>${calcStreak()}</b> 天<br>累计 <b>${state.checkins.length}</b> 天<br>坚持住，你超棒！✨</p>
        <div class="modal-btns"><button class="modal-ok" data-act="ok">好的</button></div>`);
      $('#modalCard [data-act="ok"]').onclick = closeModal;
    };
    $('#editGoal').onclick = () => modalPrompt('修改挑战目标', state.goal, '目标天数（如 60）', v => {
      const n = parseInt(v); if (n > 0) { state.goal = n; save(); refreshStats(); toast('目标已更新 🎯'); }
    });
    $('#challengeName').onclick = () => modalPrompt('修改挑战名称', state.challengeName, '给挑战起个名字', v => {
      state.challengeName = v; save(); refreshStats(); toast('名称已更新');
    });
    $('#calPrev').onclick = () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); };
    $('#calNext').onclick = () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); };
    renderCalendar(); refreshStats();
  }
  function renderCalendar() {
    $('#calMonth').textContent = `${calYear}年${calMonth + 1}月`;
    const first = new Date(calYear, calMonth, 1);
    const days = new Date(calYear, calMonth + 1, 0).getDate();
    const start = first.getDay();
    const set = new Set(state.checkins);
    const today = todayStr();
    let html = ['日', '一', '二', '三', '四', '五', '六'].map(w => `<div class="cal-w">${w}</div>`).join('');
    for (let i = 0; i < start; i++) html += `<div class="cal-d empty"></div>`;
    for (let d = 1; d <= days; d++) {
      const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cls = set.has(key) ? 'done' : (key === today ? 'today' : '');
      html += `<div class="cal-d ${cls}">${set.has(key) ? '✓' : d}</div>`;
    }
    $('#calendar').innerHTML = html;
  }

  /* ============================================================
     词典
     ============================================================ */
  let dictCat = 'all', dictLevel = 'all', dictQuery = '', dictShown = 60;
  function renderDict(reset) {
    if (reset) dictShown = 60;
    // 等级筛选
    $('#dictLevels').innerHTML = [{ key: 'all', label: '全部等级' }, ...LEVELS.map(l => ({ key: l, label: `${l}级` }))]
      .map(c => `<button class="chip lv ${String(dictLevel) === String(c.key) ? 'active' : ''}" data-lv="${c.key}">${c.label}</button>`).join('');
    $$('#dictLevels .chip').forEach(b => b.onclick = () => { dictLevel = b.dataset.lv; renderDict(true); });
    // 主题筛选
    $('#dictCats').innerHTML = WORD_CATEGORIES
      .map(c => `<button class="chip ${dictCat === c.key ? 'active' : ''}" data-cat="${c.key}">${c.icon} ${c.label}</button>`).join('');
    $$('#dictCats .chip').forEach(b => b.onclick = () => { dictCat = b.dataset.cat; renderDict(true); });
    $('#dictTotalCount').textContent = TOPIK_WORDS.length + ' 词';

    let list = TOPIK_WORDS.filter(w =>
      (dictCat === 'all' || w.cat === dictCat) &&
      (dictLevel === 'all' || w.level === +dictLevel) &&
      (!dictQuery || (w.ko + w.cn + w.roman).toLowerCase().includes(dictQuery.toLowerCase()))
    );
    $('#dictCount').textContent = `筛选出 ${list.length} 个词` + (list.length > dictShown ? `（显示 ${Math.min(dictShown, list.length)}）` : '');
    const slice = list.slice(0, dictShown);
    $('#dictList').innerHTML = slice.length ? slice.map((w) => {
      const key = 'w:' + w.ko + ':' + w.cat;
      const cat = WORD_CATEGORIES.find(c => c.key === w.cat);
      return `<div class="word-item">
        <div class="word-main" data-open-word='${esc(JSON.stringify({ ko: w.ko, cn: w.cn, roman: w.roman, level: w.level, cat: w.cat }))}'>
          <div class="word-ko">${esc(w.ko)}<span class="word-lv lv${w.level}">${w.level}级</span></div>
          <div class="word-roman">${esc(w.roman)}</div>
          <div class="word-cn">${esc(w.cn)} · ${cat ? cat.label : ''}</div>
        </div>
        <button class="play-btn" data-say="${esc(w.ko)}">🔊</button>
        <button class="star-btn ${isFav(key) ? 'on' : ''}" data-fav="${key}" data-item='${esc(JSON.stringify({ key, type: '单词', ko: w.ko, cn: w.cn, roman: w.roman }))}'>⭐</button>
      </div>`;
    }).join('') + (list.length > dictShown ? `<button class="load-more" id="dictMore">加载更多（还有 ${list.length - dictShown} 个）↓</button>` : '')
      : `<div class="empty-tip">没有找到相关单词 🔍</div>`;
    const more = $('#dictMore');
    if (more) more.onclick = () => { dictShown += 60; renderDict(); };
    bindSay(); bindFav();
    // 点词条打开单词详情卡片
    $$('#dictList [data-open-word]').forEach(el => {
      el.onclick = function(){
        try { var w = JSON.parse(this.dataset.openWord); if (window.WordDetail) window.WordDetail.openWord(w); } catch(e){}
      };
    });
  }
  function bindSay() {
    $$('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say, 1));
  }
  function bindFav() {
    $$('[data-fav]').forEach(b => b.onclick = () => toggleFav(JSON.parse(b.dataset.item)));
  }

  /* ============================================================
     练习 - Tab 切换
     ============================================================ */
  function switchPracticeTab(tab) {
    $$('#practiceTabs .subtab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    $$('.subpage').forEach(p => p.classList.toggle('active', p.id === 'sub-' + tab));
  }
  $$('#practiceTabs .subtab').forEach(b => b.onclick = () => switchPracticeTab(b.dataset.tab));

  function renderSentences() {
    const { s: d } = pickDailySentence();
    const key = 's:' + d.ko;
    $('#dailyPick').innerHTML = `
      <span class="dp-tag">✨ 今日推荐</span>
      <div class="dp-ko">${esc(d.ko)}</div>
      <div class="dp-roman">${esc(d.roman || '')}</div>
      <div class="dp-cn">${esc(d.cn)}${d.from ? ' —— ' + esc(d.from) : ''}</div>
      <div class="dp-actions">
        <button data-say="${esc(d.ko)}">🔊 标准发音</button>
        <button data-say-slow="${esc(d.ko)}">🐢 慢速</button>
        <button data-fav="${key}" data-item='${esc(JSON.stringify({ key, type: '金句', ko: d.ko, cn: d.cn, roman: d.roman || '' }))}' class="${isFav(key) ? 'on' : ''}" style="${isFav(key) ? 'color:var(--pink)' : ''}">⭐ ${isFav(key) ? '已收藏' : '收藏'}</button>
      </div>`;
    bindSay();
    $('[data-say-slow]').onclick = e => speak(e.currentTarget.dataset.saySlow, 0.6);
    bindFav();

    // 场景筛选（14 大场景，762+ 句，按程度区分）
    const sceneNames = Object.keys(SCENE_LIBRARY);
    let curScene = sceneNames[0], curDegree = 'all', sentShown = 30;
    const parseSent = l => { const [ko, cn, roman, degree] = l.split('|'); return { ko, cn, roman, degree }; };
    // 更新小标题
    const totalSent = sceneNames.reduce((n, k) => n + SCENE_LIBRARY[k].split('\n').filter(x=>x.trim()).length, 0);
    const titleEl = $('#sub-sentence .mini-title');
    if (titleEl) titleEl.textContent = `📖 场景对话库（${sceneNames.length} 大场景 · ${totalSent} 句）`;

    function drawSceneChips() {
      $('#sceneFilter').innerHTML = sceneNames.map((s, i) =>
        `<button class="chip ${s === curScene ? 'active' : ''}" data-scene="${esc(s)}">${esc(s)}</button>`).join('');
      $$('#sceneFilter .chip').forEach(b => b.onclick = () => {
        curScene = b.dataset.scene; sentShown = 30; drawSceneChips(); drawDegreeChips(); renderList();
      });
    }
    // 供学习模块跳转时选中指定场景
    window.__selectScene = function (scene) {
      if (!sceneNames.includes(scene)) scene = sceneNames[0];
      curScene = scene; curDegree = 'all'; sentShown = 30;
      drawSceneChips(); drawDegreeChips(); renderList();
    };
    function drawDegreeChips() {
      let bar = $('#degreeFilter');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'chip-scroll degree-bar'; bar.id = 'degreeFilter';
        $('#sceneFilter').after(bar);
      }
      const cnt = SCENE_LIBRARY[curScene].split('\n').filter(x=>x.trim()).length;
      bar.innerHTML = `<button class="chip lv ${curDegree==='all'?'active':''}" data-deg="all">全部程度(${cnt})</button>` +
        ['初','中','高'].map(dg => `<button class="chip lv ${curDegree===dg?'active':''}" data-deg="${dg}">${{初:'初级',中:'中级',高:'高级'}[dg]}</button>`).join('');
      $$('#degreeFilter .chip').forEach(b => b.onclick = () => { curDegree = b.dataset.deg; sentShown = 30; drawDegreeChips(); renderList(); });
    }
    function renderList() {
      let list = SCENE_LIBRARY[curScene].split('\n').filter(x=>x.trim()).map(parseSent);
      if (curDegree !== 'all') list = list.filter(s => s.degree === curDegree);
      const slice = list.slice(0, sentShown);
      $('#sentenceList').innerHTML = slice.length ? slice.map(s => {
        const key = 's:' + s.ko;
        const lvName = {初:'初级',中:'中级',高:'高级'}[s.degree] || s.degree;
        return `<div class="sent-item">
          <div class="sent-scene">${esc(curScene)} · <span class="deg-tag deg-${s.degree}">${lvName}</span></div>
          <div class="sent-ko">${esc(s.ko)}</div>
          <div class="sent-roman">${esc(s.roman)}</div>
          <div class="sent-cn">${esc(s.cn)}</div>
          <div class="sent-btns">
            <button data-say="${esc(s.ko)}">🔊 标准</button>
            <button data-say-slow="${esc(s.ko)}">🐢 慢速</button>
            <button data-fav="${key}" data-item='${esc(JSON.stringify({ key, type: '短句', ko: s.ko, cn: s.cn, roman: s.roman }))}' class="${isFav(key) ? 'on' : ''}">⭐</button>
          </div>
        </div>`;
      }).join('') + (list.length > sentShown ? `<button class="load-more" id="sentMore">加载更多（还有 ${list.length - sentShown} 句）↓</button>` : '')
        : `<div class="empty-tip">该程度暂无句子</div>`;
      const sm = $('#sentMore');
      if (sm) sm.onclick = () => { sentShown += 30; renderList(); };
      bindSay();
      $$('#sentenceList [data-say-slow]').forEach(b => b.onclick = () => speak(b.dataset.saySlow, 0.6));
      bindFav();
    }
    drawSceneChips(); drawDegreeChips(); renderList();
  }

  /* ============================================================
     韩剧台词（完整对话）
     ============================================================ */
  let curDrama = null;
  function renderDramas() {
    const dramaNames = [...new Set(DRAMA_GROUPS.map(g => g.drama))];
    if (!curDrama) curDrama = dramaNames[0];
    $('#dramaDramas').innerHTML = dramaNames.map(d =>
      `<button class="chip ${d === curDrama ? 'active' : ''}" data-drama="${esc(d)}">${esc(d)}</button>`).join('');
    $$('#dramaDramas .chip').forEach(b => b.onclick = () => { curDrama = b.dataset.drama; renderDramas(); });
    const groups = DRAMA_GROUPS.filter(g => g.drama === curDrama);
    const voice = DRAMA_VOICE[curDrama] || {};
    $('#dramaScenes').innerHTML = `<div class="drama-scene-title">🎬 ${esc(curDrama)} · ${groups.length} 段场景</div>` +
      `<div class="voice-bar">
        <div class="voice-info">🎙️ <b>清晰真人发音</b> <span>标准韩语朗读 · 非机械合成</span></div>
        <div class="voice-btns">
          <button id="voiceReadAll" class="voice-btn">🔊 全段连读</button>
          <a class="voice-btn origin" href="${esc(voice.clip || '#')}" target="_blank" rel="noopener">▶️ 听原剧原声</a>
        </div>
        <p class="voice-note">逐句/全段均为清晰真声朗读；如需演员原声表演，点「听原剧原声」跳转国内平台观看</p>
      </div>` +
      groups.map((g, gi) => `<button class="chip ${gi === 0 ? 'active' : ''}" data-scene-idx="${gi}" style="margin:0 6px 6px 0">${esc(g.theme)} <span class="deg-tag deg-${g.level}">${g.level}</span></button>`).join('');
    // 全段连读：真人发音依次播放（跟随当前选中的场景）
    const readAll = $('#voiceReadAll');
    if (readAll) {
      readAll._playing = false;
      readAll.onclick = () => {
        if (readAll._playing) { stopReadingAll(); return; }
        const sel = $('#dramaScenes [data-scene-idx].active');
        const sceneIdx = sel ? +sel.dataset.sceneIdx : 0;
        const lines = (groups[sceneIdx] || groups[0]).dialog;
        if (!lines || !lines.length) { toast('这段场景暂无台词'); return; }
        let i = 0;
        readAll._playing = true;
        readAll.textContent = '⏹ 停止连读';
        // 高亮当前朗读的句子，让用户清楚听到哪一句、不会以为"跳过"
        const highlight = (ko) => {
          $$('#dramaDialog .dialog-ko').forEach(x => x.classList.remove('playing'));
          const koEl = $$('#dramaDialog .dialog-ko[data-say]').find(b => b.dataset.say === ko);
          if (koEl) {
            koEl.classList.add('playing');
            const bubble = koEl.closest('.dialog-bubble');
            if (bubble) bubble.classList.add('reading');
          }
        };
        const playNext = () => {
          if (!readAll._playing) return;
          if (i >= lines.length) {
            $$('#dramaDialog .dialog-bubble').forEach(x => x.classList.remove('reading'));
            $$('#dramaDialog .dialog-ko').forEach(x => x.classList.remove('playing'));
            stopReadingAll(); toast('✅ 全段连读完成'); return;
          }
          const line = lines[i];
          i++;
          highlight(line.ko);
          preloadLines(lines, i);          // 提前缓冲接下来的两句
          speakDrama(line.ko, line.speaker, 1, () => {
            // 上一句真正结束后立即接下一句；仅用很短间隔避免音频引擎抢播
            setTimeout(() => { if (readAll._playing) playNext(); }, 90);
          });
        };
        preloadLines(lines, 0);
        playNext();
        toast('🔊 开始全段连读，再点一次可停止');
      };
    }
    function stopReadingAll() {
      const b = $('#voiceReadAll');
      if (!b) return;
      b._playing = false;
      b.textContent = '🔊 全段连读';
      clearTimeout(b._fallback);
      if (audioPlayer) { try { audioPlayer.pause(); } catch (e) {} }
      try { speechSynthesis.cancel(); } catch (e) {}
    }
    // 默认显示第一段场景对话
    drawDramaDialog(groups[0]);
    $$('#dramaScenes [data-scene-idx]').forEach(b => b.onclick = () => {
      stopReadingAll();
      $$('#dramaScenes [data-scene-idx]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      drawDramaDialog(groups[+b.dataset.sceneIdx]);
    });
  }
  // 按剧目取男女主头像：有该剧映射就用对应剧照，否则回退通用头像
  function dramaAvatar(drama, speaker) {
    try {
      const map = window.DRAMA_AVATARS || {};
      const pair = map[drama];
      const f = pair && (speaker === 'B' ? pair.f : pair.m);
      if (f) return f;
    } catch (e) {}
    return 'img/avatars/' + (speaker === 'B' ? 'drama_female' : 'drama_male') + '.jpg';
  }
  function drawDramaDialog(g) {
    if (!g) return;
    $('#dramaDialog').innerHTML = `
      <div class="drama-scene-title">💬 ${esc(g.theme)} · <span class="deg-tag deg-${g.level}">${{初:'初级',中:'中级',高:'高级'}[g.level]}</span></div>
      ${g.dialog.map((d, i) => `
        <div class="dialog-bubble ${i % 2 === 1 ? 'b' : ''}">
          <div class="dialog-avatar"><img src="${dramaAvatar(g.drama, d.speaker)}?v=20261121x" alt="${esc(d.speaker)}"></div>
          <div class="dialog-content">
            <div class="dialog-ko" data-say="${esc(d.ko)}" data-spk="${esc(d.speaker)}">${esc(d.ko)}</div>
            <div class="dialog-roman">${esc(d.roman)}</div>
            <div class="dialog-cn">${esc(d.cn)}</div>
            <span class="sent-spk" title="点击发音">🔊</span>
          </div>
        </div>`).join('')}`;
    // 点整句或右下角小喇叭都能发音
    $$('#dramaDialog .dialog-ko[data-say]').forEach(b => {
      const fire = () => {
        $$('#dramaDialog .dialog-ko').forEach(x => x.classList.remove('playing'));
        b.classList.add('playing');
        const content = b.closest('.dialog-content');
        if (content) { const sp = content.querySelector('.sent-spk'); if (sp) sp.classList.add('playing'); }
        speakDrama(b.dataset.say, b.dataset.spk, 1);
        clearTimeout(b._pt);
        b._pt = setTimeout(() => {
          b.classList.remove('playing');
          if (content) { const sp = content.querySelector('.sent-spk'); if (sp) sp.classList.remove('playing'); }
        }, 3500);
      };
      b.onclick = fire;
      const content = b.closest('.dialog-content');
      const spk = content && content.querySelector('.sent-spk');
      if (spk) spk.onclick = fire;
    });
  }

  let wordQuery = '', onlyUnlearned = false;
  function renderBasicWords() {
    let list = BASIC_WORDS.filter(w =>
      (!wordQuery || (w.ko + w.cn + w.roman).toLowerCase().includes(wordQuery.toLowerCase())) &&
      (!onlyUnlearned || !state.learnedWords.includes(w.ko))
    );
    $('#wordCount').textContent = `共 ${list.length} 词 · 已学 ${state.learnedWords.length}`;
    $('#basicWordList').innerHTML = list.length ? list.map(w => {
      const learned = state.learnedWords.includes(w.ko);
      const key = 'bw:' + w.ko;
      return `<div class="word-item">
        <div class="word-learned ${learned ? 'on' : ''}" data-learn="${esc(w.ko)}">✓</div>
        <div class="word-main">
          <div class="word-ko">${esc(w.ko)}</div>
          <div class="word-roman">${esc(w.roman)}</div>
          <div class="word-cn">${esc(w.cn)}</div>
        </div>
        <button class="play-btn" data-say="${esc(w.ko)}">🔊</button>
        <button class="star-btn ${isFav(key) ? 'on' : ''}" data-fav="${key}" data-item='${esc(JSON.stringify({ key, type: '单词', ko: w.ko, cn: w.cn, roman: w.roman }))}'>⭐</button>
      </div>`;
    }).join('') : `<div class="empty-tip">没有相关单词</div>`;
    bindSay(); bindFav();
    $$('[data-learn]').forEach(b => b.onclick = () => {
      const w = b.dataset.learn;
      state.learnedWords = state.learnedWords.includes(w) ? state.learnedWords.filter(x => x !== w) : [...state.learnedWords, w];
      save(); renderBasicWords();
    });
  }

  /* ============================================================
     单词背诵（结合词典 · 词库背诵 / 拼写测试 / 发音检验）
     ============================================================ */
  let reciteLevel = 'all', reciteCat = 'all', reciteOnlyUn = false, reciteShuffled = false;
  function switchReciteMode(mode) {
    $$('#reciteModeTabs .rm-tab').forEach(b => b.classList.toggle('active', b.dataset.rm === mode));
    $$('.rm-panel').forEach(p => p.classList.toggle('active', p.id === 'rm-' + mode));
    if (mode === 'list') renderReciteList();
    if (mode === 'spell') { if (!spellState.pool.length) initSpell(); }
    if (mode === 'pron') { if (!pronState.pool.length) initPron(); }
  }
  $$('#reciteModeTabs .rm-tab').forEach(b => b.onclick = () => switchReciteMode(b.dataset.rm));

  function getRecitePool() {
    let pool = TOPIK_WORDS.filter(w =>
      (reciteLevel === 'all' || w.level === +reciteLevel) &&
      (reciteCat === 'all' || w.cat === reciteCat) &&
      (!reciteOnlyUn || !state.learnedWords.includes(w.ko))
    );
    if (reciteShuffled) pool = pool.slice().sort(() => Math.random() - 0.5);
    return pool;
  }
  function renderReciteFilters() {
    const lvSel = $('#reciteLevel'), catSel = $('#reciteCat');
    lvSel.innerHTML = `<option value="all">全部等级</option>` + LEVELS.map(l => `<option value="${l}" ${String(reciteLevel) === String(l) ? 'selected' : ''}>${l}级</option>`).join('');
    catSel.innerHTML = `<option value="all">全部主题</option>` + WORD_CATEGORIES.filter(c => c.key !== 'all').map(c => `<option value="${c.key}" ${reciteCat === c.key ? 'selected' : ''}>${c.label}</option>`).join('');
    lvSel.onchange = () => { reciteLevel = lvSel.value; renderReciteList(); };
    catSel.onchange = () => { reciteCat = catSel.value; renderReciteList(); };
  }
  function renderReciteList() {
    renderReciteFilters();
    let pool = getRecitePool();
    const shown = pool.slice(0, 80);
    $('#reciteCount').textContent = `共 ${pool.length} 词` + (pool.length > 80 ? `（显示前 80）` : '');
    $('#reciteWordList').innerHTML = shown.length ? shown.map(w => {
      const learned = state.learnedWords.includes(w.ko);
      const key = 'w:' + w.ko + ':' + w.cat;
      return `<div class="word-item">
        <div class="word-learned ${learned ? 'on' : ''}" data-rlearn="${esc(w.ko)}">✓</div>
        <div class="word-main">
          <div class="word-ko">${esc(w.ko)}<span class="word-lv lv${w.level}">${w.level}级</span></div>
          <div class="word-roman">${esc(w.roman)}</div>
          <div class="word-cn">${esc(w.cn)}</div>
        </div>
        <button class="play-btn" data-say="${esc(w.ko)}">🔊</button>
        <button class="star-btn ${isFav(key) ? 'on' : ''}" data-fav="${key}" data-item='${esc(JSON.stringify({ key, type: '单词', ko: w.ko, cn: w.cn, roman: w.roman }))}'>⭐</button>
      </div>`;
    }).join('') : `<div class="empty-tip">没有符合条件的单词</div>`;
    bindSay(); bindFav();
    $$('[data-rlearn]').forEach(b => b.onclick = () => {
      const w = b.dataset.rlearn;
      state.learnedWords = state.learnedWords.includes(w) ? state.learnedWords.filter(x => x !== w) : [...state.learnedWords, w];
      save(); renderReciteList();
    });
  }
  $('#reciteShuffle').onclick = () => { reciteShuffled = !reciteShuffled; renderReciteList(); toast(reciteShuffled ? '🔀 已打乱顺序' : '已恢复顺序'); };
  $('#reciteOnlyUnlearned').onclick = e => { reciteOnlyUn = !reciteOnlyUn; e.target.textContent = reciteOnlyUn ? '显示全部' : '只看未学'; renderReciteList(); };

  // ---- 拼写测试（按学习进度出题 · 未完成累计直到完成） ----
  // 出题来源：已学单词(learnedWords)优先；不足时用车企常用词补充。
  // pending=未完成(跳过/答错保留并累计)，done=已答对。只要 pending 非空就继续出，直到清空。
  let spellState = { pool: [], idx: 0, correct: 0, wrong: 0, cur: null };
  function spellWordPool() {
    const ok = w => w && w.ko && w.ko.length >= 2 && w.roman && !/\s/.test(w.ko);
    // 合并两个词库建索引：用户在词典标记的已学词(BASIC_WORDS)也要能出题
    const allSrc = (typeof BASIC_WORDS !== 'undefined' ? BASIC_WORDS : []).concat(typeof TOPIK_WORDS !== 'undefined' ? TOPIK_WORDS : []);
    const byKo = new Map();
    allSrc.forEach(w => { if (ok(w) && !byKo.has(w.ko)) byKo.set(w.ko, w); });
    const eligible = Array.from(byKo.values());
    const learned = state.learnedWords
      .map(ko => byKo.get(ko))
      .filter(w => ok(w));
    // 进度词库：已学词优先，其余合格词作为保底补充（保证有题做）
    eligible.forEach(w => { if (!byKo.has(w.ko)) byKo.set(w.ko, w); });
    return { eligible, learned, all: Array.from(byKo.values()) };
  }
  function initSpell() {
    const { all } = spellWordPool();
    // 按当前筛选缩小候选
    let cand = all.slice();
    if (reciteLevel !== 'all') cand = cand.filter(w => w.level === +reciteLevel);
    if (reciteCat !== 'all') cand = cand.filter(w => w.cat === reciteCat);
    const candKo = new Set(cand.map(w => w.ko));
    const pg = state.spellProgress;
    // 清理 pending 中已不在候选或已完成的词
    pg.pending = pg.pending.filter(ko => candKo.has(ko) && !pg.done.includes(ko));
    // 组池：pending 优先（未完成累计），再补"已学且未完成"的词
    const koToWord = new Map(cand.map(w => [w.ko, w]));
    const pool = [];
    pg.pending.forEach(ko => { if (koToWord.has(ko)) pool.push(koToWord.get(ko)); });
    const inPool = new Set(pool.map(w => w.ko));
    cand.forEach(w => {
      if (!state.learnedWords.includes(w.ko)) return;   // 只按学习进度：已学词
      if (!pg.done.includes(w.ko) && !inPool.has(w.ko)) pool.push(w);
    });
    // 保底：若一个已学词都没有，给前 10 个合格词试练（不计入进度完成）
    if (!pool.length) {
      const learned2 = cand.filter(w => state.learnedWords.includes(w.ko));
      const backup = learned2.length ? learned2 : cand.slice(0, 10);
      backup.slice().sort(() => Math.random() - 0.5).slice(0, 10).forEach(w => pool.push(w));
      toast('💡 先在「词库背诵」标记已学单词，默写会按你的进度出题');
    }
    pg.totalSeen = (pg.totalSeen || 0) + 1;
    save();
    spellState = { pool, idx: 0, correct: 0, wrong: 0, cur: null };
    showSpell();
  }
  function showSpell() {
    const s = spellState, pg = state.spellProgress;
    const pendingN = pg.pending.length;
    if (!s.pool.length) {
      $('#spellQuestion').textContent = '🎉';
      $('#spellRoman').textContent = '暂无可默写单词';
      $('#spellInput').value = ''; $('#spellInput').disabled = true;
      $('#spellFeedback').className = 'quiz-feedback correct';
      $('#spellFeedback').textContent = '去「词库背诵」标记已学单词后再来默写吧';
      $('#spellProgress').textContent = '待完成 0';
      return;
    }
    if (s.idx >= s.pool.length) {
      // 本轮列表做完，但 pending 可能仍有词（跳过/答错的）→ 自动再组一轮继续，直到 pending 清空
      if (pendingN > 0) { initSpell(); return; }
      $('#spellQuestion').textContent = '🎉';
      $('#spellRoman').textContent = '本轮完成！全部掌握';
      $('#spellInput').value = ''; $('#spellInput').disabled = true;
      $('#spellFeedback').className = 'quiz-feedback correct';
      $('#spellFeedback').textContent = `答对 ${s.correct} / ${s.pool.length} 题 · 待完成 0`;
      $('#spellProgress').textContent = '已完成 · 待完成 0';
      return;
    }
    s.cur = s.pool[s.idx];
    $('#spellInput').disabled = false;
    $('#spellQuestion').textContent = s.cur.cn;
    $('#spellRoman').textContent = s.cur.roman;
    $('#spellInput').value = '';
    $('#spellFeedback').textContent = '';
    $('#spellFeedback').className = 'quiz-feedback';
    $('#spellProgress').textContent = `第 ${s.idx + 1} / ${s.pool.length} 题 · 待完成 ${pendingN}`;
    $('#spellScore').textContent = `✅ ${pg.done.length} 已掌握 · ⏳ ${pendingN} 待完成`;
  }
  function markSpellDone(ko) {
    const pg = state.spellProgress;
    pg.pending = pg.pending.filter(x => x !== ko);
    if (!pg.done.includes(ko)) pg.done.push(ko);
    save();
  }
  function markSpellPending(ko) {
    const pg = state.spellProgress;
    if (!pg.done.includes(ko) && !pg.pending.includes(ko)) pg.pending.push(ko);
    save();
  }
  $('#spellSubmit').onclick = () => {
    const s = spellState; if (!s.cur) return;
    const val = $('#spellInput').value.trim().replace(/\s/g, '');
    if (!val) { toast('请输入拼写'); return; }
    const ok = val === s.cur.ko;
    const fb = $('#spellFeedback');
    if (ok) {
      s.correct++;
      markSpellDone(s.cur.ko);       // 答对：移出待完成，计入已掌握
      fb.className = 'quiz-feedback correct'; fb.textContent = `✅ 正确！${s.cur.ko} · 已掌握`; speak(s.cur.ko, 1);
    } else {
      s.wrong++;
      markSpellPending(s.cur.ko);    // 答错：加入待完成，继续累计
      fb.className = 'quiz-feedback wrong'; fb.textContent = `❌ 正确答案：${s.cur.ko} · 已加入待完成，稍后会再出现`;
    }
    setTimeout(() => { s.idx++; showSpell(); }, ok ? 600 : 1200);
  };
  $('#spellInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#spellSubmit').click(); });
  $('#spellSkip').onclick = () => {
    const s = spellState;
    if (s.cur) markSpellPending(s.cur.ko);   // 跳过：加入待完成，继续累计，稍后再出
    s.idx++; showSpell();
    toast('⏭ 已跳过，加入待完成，稍后会再出现');
  };
  $('#spellHint').onclick = () => { if (spellState.cur) { $('#spellFeedback').className = 'quiz-feedback'; $('#spellFeedback').textContent = `💡 首字：${spellState.cur.ko[0]}　罗马音：${spellState.cur.roman}`; } };
  $('#spellRestart').onclick = () => { initSpell(); toast('已按你的学习进度重新出题（未完成继续累计）'); };

  // ---- 发音检验（听音辨词） ----
  let pronState = { pool: [], idx: 0, correct: 0, wrong: 0, cur: null, opts: [], answered: false };
  function initPron() {
    let pool = TOPIK_WORDS.filter(w => w.ko.length >= 2 && w.roman && !/\s/.test(w.ko));
    if (reciteLevel !== 'all') pool = pool.filter(w => w.level === +reciteLevel);
    if (reciteCat !== 'all') pool = pool.filter(w => w.cat === reciteCat);
    pool = pool.slice().sort(() => Math.random() - 0.5).slice(0, 20);
    pronState = { pool, idx: 0, correct: 0, wrong: 0, cur: null, opts: [], answered: false };
    showPron();
  }
  function showPron() {
    const s = pronState;
    if (s.idx >= s.pool.length) {
      $('#pronOptions').innerHTML = '';
      $('#pronFeedback').className = 'quiz-feedback correct';
      $('#pronFeedback').textContent = `🎉 本轮完成！答对 ${s.correct} / ${s.pool.length} 题`;
      $('#pronProgress').textContent = '已完成';
      $('#pronPlay').disabled = true;
      return;
    }
    $('#pronPlay').disabled = false;
    s.cur = s.pool[s.idx]; s.answered = false;
    // 生成 4 个选项（1 正确 + 3 干扰）
    const others = TOPIK_WORDS.filter(w => w.ko !== s.cur.ko && w.ko.length === s.cur.ko.length).sort(() => Math.random() - 0.5).slice(0, 3);
    s.opts = [s.cur, ...others].sort(() => Math.random() - 0.5);
    $('#pronOptions').innerHTML = s.opts.map((o, i) => `<button class="pron-option" data-po="${i}">${esc(o.ko)}</button>`).join('');
    $$('#pronOptions .pron-option').forEach(b => b.onclick = () => {
      if (s.answered) return;
      s.answered = true;
      const pick = s.opts[+b.dataset.po];
      if (pick.ko === s.cur.ko) { s.correct++; b.classList.add('correct'); $('#pronFeedback').className = 'quiz-feedback correct'; $('#pronFeedback').textContent = `✅ 正确！${s.cur.ko}`; }
      else { s.wrong++; b.classList.add('wrong'); $('#pronFeedback').className = 'quiz-feedback wrong'; $('#pronFeedback').textContent = `❌ 正确答案：${s.cur.ko}`; $$('#pronOptions .pron-option').forEach(x => { if (x.textContent === s.cur.ko) x.classList.add('correct'); }); }
      $('#pronScore').textContent = `✅ ${s.correct} · ❌ ${s.wrong}`;
      setTimeout(() => { s.idx++; showPron(); }, 1200);
    });
    $('#pronFeedback').textContent = ''; $('#pronFeedback').className = 'quiz-feedback';
    $('#pronProgress').textContent = `第 ${s.idx + 1} / ${s.pool.length} 题`;
    $('#pronScore').textContent = `✅ ${s.correct} · ❌ ${s.wrong}`;
    // 自动播放一次
    setTimeout(() => speak(s.cur.ko, 1), 200);
  }
  $('#pronPlay').onclick = () => { if (pronState.cur) speak(pronState.cur.ko, 1); };
  $('#pronRestart').onclick = () => { initPron(); toast('已重新出题'); };

  /* ---------- 四十音 ---------- */
  let comboI = 0, comboM = 0;
  function renderSounds() {
    // 元音
    const vowelsHtml = (arr, isBasic) => `<div class="group-label">${isBasic ? '基本元音' : '复合元音'}</div>
      <div class="sound-grid">${arr.map(v => `
        <div class="sound-cell" data-say="${esc(v.ex)}">
          <div class="sc-char">${v.char}</div>
          <div class="sc-roman">${v.roman}</div>
          <div class="sc-name">${v.name}</div>
          <div class="sc-ex">${esc(v.ex)}</div>
        </div>`).join('')}</div>`;
    $('#sound-vowel').innerHTML = vowelsHtml(VOWELS.slice(0, 10), true) + vowelsHtml(VOWELS.slice(10), false);

    // 辅音
    const consHtml = (arr, isBasic) => `<div class="group-label">${isBasic ? '基本辅音（14个）' : '紧音 / 双辅音（5个）'}</div>
      <div class="sound-grid">${arr.map(c => `
        <div class="sound-cell" data-say="${esc(c.ex)}">
          <div class="sc-char">${c.char}</div>
          <div class="sc-roman">${c.roman || '(无声)'}</div>
          <div class="sc-name">${c.name}</div>
          <div class="sc-ex">${esc(c.ex)}</div>
        </div>`).join('')}</div>`;
    $('#sound-consonant').innerHTML = consHtml(CONSONANTS.filter(c => c.type === 'basic'), true) + consHtml(CONSONANTS.filter(c => c.type === 'tense'), false);

    // 收音
    $('#sound-batchim').innerHTML = `<div class="group-label">收音规则（按发音归类）</div>` + BATCHIM.map(b => `
      <div class="batchim-item" data-say="${esc(b.ex.replace(' milk → ',''))}">
        <div class="batchim-char">${b.char}</div>
        <div style="flex:1">
          <div class="batchim-sound">发音 [${b.sound}]</div>
          <div class="batchim-tip">${esc(b.tip)}</div>
          <div class="batchim-ex">例：${esc(b.ex)} ${esc(b.exCn)}</div>
        </div>
        <button class="play-btn">🔊</button>
      </div>`).join('');

    // 组合拼读器
    $('#comboInitials').innerHTML = INITIALS.map((c, i) => `<div class="combo-cell ${i === 0 ? 'active' : ''}" data-ci="${i}">${c}</div>`).join('');
    $('#comboMedials').innerHTML = MEDIALS.map((m, i) => `<div class="combo-cell ${i === 0 ? 'active' : ''}" data-cm="${i}">${m}</div>`).join('');
    $$('[data-ci]').forEach(el => el.onclick = () => {
      comboI = +el.dataset.ci;
      $$('[data-ci]').forEach(x => x.classList.toggle('active', x === el));
      updateCombo();
    });
    $$('[data-cm]').forEach(el => el.onclick = () => {
      comboM = +el.dataset.cm;
      $$('[data-cm]').forEach(x => x.classList.toggle('active', x === el));
      updateCombo();
    });
    $('#comboPlay').onclick = () => speak(makeSyllable(comboI, comboM), 0.9);
    updateCombo();
    buildComboTable();
    bindSay();
  }
  function updateCombo() {
    $('#comboSyllable').textContent = makeSyllable(comboI, comboM);
    $('#comboRoman').textContent = comboRoman(comboI, comboM);
  }
  // 组合音节的辅音/元音名称映射（用于拼写拆解）
  const INITIAL_NAME = {}; CONSONANTS.forEach(c => { INITIAL_NAME[c.char] = c.name || c.char; });
  const MEDIAL_NAME = {}; VOWELS.forEach(v => { MEDIAL_NAME[v.char] = v.name || v.char; });
  // 含该音节的示例词（从词库动态取，去重，最多 4 个）
  function syllableExamples(syl) {
    const out = [], seen = {};
    for (const w of TOPIK_WORDS) {
      if (w.ko && w.ko.indexOf(syl) >= 0 && !seen[w.ko]) {
        seen[w.ko] = 1; out.push(w); if (out.length >= 4) break;
      }
    }
    return out;
  }
  function showComboDetail(i, m) {
    const ini = INITIALS[i], med = MEDIALS[m];
    const syl = makeSyllable(i, m), roman = comboRoman(i, m);
    const code = 'U+' + syl.charCodeAt(0).toString(16).toUpperCase();
    const exs = syllableExamples(syl);
    const box = $('#comboDetail');
    if (!box) return;
    box.innerHTML = `
      <div class="cd-card">
        <div class="cd-top">
          <div class="cd-syl">${syl}</div>
          <div class="cd-topinfo">
            <div class="cd-roman">${roman || '(无声母)'}</div>
            <button class="cd-play" id="cdPlay">🔊 听标准发音</button>
          </div>
        </div>
        <div class="cd-section-t">✍️ 怎么拼写</div>
        <div class="cd-spell">
          <div class="cd-spell-part"><span class="cd-jamo">${ini}</span><span class="cd-jamo-name">${INITIAL_NAME[ini] || '辅音'}</span><span class="cd-jamo-role">初声</span></div>
          <span class="cd-plus">+</span>
          <div class="cd-spell-part"><span class="cd-jamo">${med}</span><span class="cd-jamo-name">${MEDIAL_NAME[med] || '元音'}</span><span class="cd-jamo-role">中声</span></div>
          <span class="cd-eq">=</span>
          <div class="cd-spell-part cd-result"><span class="cd-jamo">${syl}</span><span class="cd-jamo-name">${roman}</span></div>
        </div>
        <div class="cd-note">发音方法：先读初声 <b>${ini}</b>，再接中声 <b>${med}</b>，快速连读成 <b>${syl}</b>（${roman}）。字符编码 ${code}。</div>
        <div class="cd-section-t">📚 含「${syl}」的常用词</div>
        <div class="cd-examples">
          ${exs.length ? exs.map(w => `<div class="cd-ex" data-say="${esc(w.ko)}"><b>${esc(w.ko)}</b><span>${esc(w.roman || '')}</span><em>${esc(w.cn)}</em><button class="cd-ex-play">🔊</button></div>`).join('') : '<div class="cd-noex">词库中暂无以此音节开头的常用词，试着点击其他音节</div>'}
        </div>
      </div>`;
    $('#cdPlay').onclick = () => speak(syl, 0.9);
    $$('#comboDetail [data-say]').forEach(el => el.onclick = e => { e.stopPropagation(); speak(el.dataset.say, 0.95); });
    // 滚动到详情
    try { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
  }
  function buildComboTable() {
    let html = `<tr><th>辅音＼元音</th>${MEDIALS.map(m => `<th>${m}</th>`).join('')}</tr>`;
    for (let i = 0; i < INITIALS.length; i++) {
      html += `<tr><th>${INITIALS[i]}</th>`;
      for (let m = 0; m < MEDIALS.length; m++) {
        const syl = makeSyllable(i, m);
        html += `<td data-ci="${i}" data-cm="${m}" title="${comboRoman(i, m)}">${syl}</td>`;
      }
      html += '</tr>';
    }
    $('#comboTable').innerHTML = html;
    $$('#comboTable td').forEach(td => td.onclick = () => {
      $$('#comboTable td').forEach(x => x.classList.remove('sel'));
      td.classList.add('sel');
      showComboDetail(+td.dataset.ci, +td.dataset.cm);
    });
  }
  $$('#soundTabs .sound-tab').forEach(b => b.onclick = () => {
    $$('#soundTabs .sound-tab').forEach(x => x.classList.toggle('active', x === b));
    $$('.sound-panel').forEach(p => p.classList.toggle('active', p.id === 'sound-' + b.dataset.s));
  });

  function renderCollect() {
    if (!state.favorites.length) {
      $('#collectList').innerHTML = `<div class="empty-tip">收藏本还是空的 ⭐<br>在短句 / 单词 / 语法页点击 ☆ 收藏</div>`;
      return;
    }
    $('#collectList').innerHTML = state.favorites.map((f, i) => `
      <div class="collect-item">
        <span class="collect-type">${esc(f.type)}</span>
        <div class="collect-main">
          <div class="collect-ko">${esc(f.ko)}</div>
          <div class="collect-cn">${esc(f.cn)}${f.roman ? ' · ' + esc(f.roman) : ''}</div>
        </div>
        <button class="play-btn" data-say="${esc(f.ko)}">🔊</button>
        <button class="del-btn" data-del-fav="${i}">🗑️</button>
      </div>`).join('');
    bindSay();
    $$('[data-del-fav]').forEach(b => b.onclick = () => {
      state.favorites.splice(+b.dataset.delFav, 1);
      save(); renderCollect();
      $$('[data-fav]').forEach(x => x.classList.toggle('on', isFav(x.dataset.fav)));
      toast('已删除');
    });
  }

  /* ============================================================
     敬语 vs 平语 区别学习
     ============================================================ */
  function renderHonorific() {
    // 基本概念
    $('#honor-intro').innerHTML = HONORIFIC_INTRO.map(c => `
      <div class="honor-card">
        <div class="honor-card-title">${c.icon} ${esc(c.title)}</div>
        <div class="honor-card-cn">${esc(c.cn)}</div>
        <div class="honor-ko">${esc(c.ko)}<div class="honor-roman">${esc(c.roman)}</div></div>
      </div>`).join('');
    // 语体对照（例句可点读）
    $('#honor-style').innerHTML = `<div class="honor-card"><div class="honor-card-title">📊 四种语体 · 同一句话对照</div>
      <div class="honor-read-tip">🔊 点击例句即可朗读</div>
      <table class="honor-table"><tr><th>语体</th><th>例句(点读)</th><th>使用场景</th><th>语气</th></tr>
      ${HONORIFIC_STYLES.map(s => `<tr><td class="honor">${esc(s.cn)}</td><td><b class="honor-say" data-say="${esc(s.ko)}">🔊 ${esc(s.ko)}</b><div class="honor-ex-text"><span class="ro">${esc(s.roman)}</span></div></td><td>${esc(s.use)}</td><td>${esc(s.tone)}</td></tr>`).join('')}
      </table></div>`;
    // 变化规则（敬语/平语示例可点读）
    $('#honor-rules').innerHTML = `<div class="honor-read-tip">🔊 点击表格中的词例即可听发音</div>` + HONORIFIC_RULES.map(r => `
      <div class="honor-card">
        <div class="honor-card-title">📐 ${esc(r.title)}</div>
        <table class="honor-table"><tr><th>类别</th><th>敬语形式</th><th>平语形式</th><th>示例(点读)</th></tr>
        ${r.rows.map(row => {
          // 从示例「선생님이 계세요 / 친구가 있어」拆出两句供点读
          const parts = row.example.split('/').map(x => x.trim()).filter(Boolean);
          const honorSay = parts[0] || '', informalSay = parts[1] || '';
          return `<tr><td>${esc(row.type)}</td>
            <td class="honor">${esc(row.honorific)}${honorSay ? `<div class="honor-say" data-say="${esc(honorSay)}">🔊 听例句</div>` : ''}</td>
            <td class="informal">${esc(row.informal)}${informalSay ? `<div class="honor-say" data-say="${esc(informalSay)}">🔊 听例句</div>` : ''}</td>
            <td><span class="honor-say" data-say="${esc(honorSay || informalSay)}">${esc(row.example)}</span></td></tr>`;
        }).join('')}
        </table>
      </div>`).join('');
    // 场景例句
    $('#honor-examples').innerHTML = HONORIFIC_EXAMPLES.map(ex => `
      <div class="honor-compare">
        <div class="honor-scene-title">${ex.icon} ${esc(ex.scene)}</div>
        ${ex.items.map(it => `
          <div class="honor-ex-row">
            <div class="honor-ex-cn">${esc(it.cn)}</div>
            <div class="honor-ex-pair">
              <span class="honor-ex-badge h">敬语</span>
              <div class="honor-ex-text"><span class="ko" data-say="${esc(it.honorific)}">${esc(it.honorific)}</span><div class="ro">${esc(it.hr)}</div></div>
            </div>
            <div class="honor-ex-pair">
              <span class="honor-ex-badge i">平语</span>
              <div class="honor-ex-text"><span class="ko" data-say="${esc(it.informal)}">${esc(it.informal)}</span><div class="ro">${esc(it.ir)}</div></div>
            </div>
          </div>`).join('')}
      </div>`).join('');
    // 所有可点读元素（语体例句 / 变化规则 / 场景例句）
    $$('#honor-style [data-say], #honor-rules [data-say], #honor-examples [data-say]').forEach(el => {
      el.style.cursor = 'pointer';
      el.onclick = () => speak(el.dataset.say, 1);
    });
    // 避坑指南
    $('#honor-tips').innerHTML = HONORIFIC_TIPS.map(t => `<div class="honor-tip">${esc(t)}</div>`).join('');
  }
  $$('#honorTabs .honor-tab').forEach(b => b.onclick = () => {
    $$('#honorTabs .honor-tab').forEach(x => x.classList.toggle('active', x === b));
    $$('.honor-panel').forEach(p => p.classList.toggle('active', p.id === 'honor-' + b.dataset.ht));
  });

  /* ============================================================
     我的 - 语法 / 听力
     ============================================================ */
  let grammarLevel = 'all', grammarPage = 0;
  const GRAMMAR_PAGE_SIZE = 10;
  function renderGrammar() {
    const all = grammarLevel === 'all' ? GRAMMAR_EXT : GRAMMAR_EXT.filter(g => g.level === +grammarLevel);
    const totalPages = Math.max(1, Math.ceil(all.length / GRAMMAR_PAGE_SIZE));
    if (grammarPage >= totalPages) grammarPage = totalPages - 1;
    if (grammarPage < 0) grammarPage = 0;
    const pageList = all.slice(grammarPage * GRAMMAR_PAGE_SIZE, (grammarPage + 1) * GRAMMAR_PAGE_SIZE);

    $('#grammarCount').textContent = all.length + ' 组 · 每 ' + GRAMMAR_PAGE_SIZE + ' 组一组';
    $('#grammarLevels').innerHTML = [{key:'all',label:'全部等级'}, ...LEVELS.map(l=>({key:l,label:`${l}级`}))]
      .map(c=>`<button class="chip lv ${String(grammarLevel)===String(c.key)?'active':''}" data-gl="${c.key}">${c.label}</button>`).join('');
    $$('#grammarLevels .chip').forEach(b=>b.onclick=()=>{grammarLevel=b.dataset.gl;grammarPage=0;renderGrammar();});

    $('#grammarList').innerHTML = pageList.map((g, i) => {
      const key = 'g:' + g.title;
      const globalIdx = grammarPage * GRAMMAR_PAGE_SIZE + i;
      return `<div class="grammar-item" data-gi="${globalIdx}">
        <div class="gi-head">
          <span class="gi-title"><span class="gi-level lv${g.level}">Lv${g.level}</span>${esc(g.title)}</span>
          <span class="star-btn ${isFav(key) ? 'on' : ''}" data-fav="${key}" data-item='${esc(JSON.stringify({ key, type: '语法', ko: g.ex, cn: g.exCn, roman: '' }))}'>⭐</span>
        </div>
        <div class="gi-struct">${esc(g.struct)}</div>
        <div class="gi-detail">
          <div class="gi-usage">${esc(g.usage)}</div>
          <div class="gi-ex">
            <div style="flex:1"><div class="gi-ex-ko">${esc(g.ex)}</div><div class="gi-ex-cn">${esc(g.exCn)}</div></div>
            <button class="play-btn" data-say="${esc(g.ex)}">🔊</button>
          </div>
          <div class="gi-tip">💡 ${esc(g.tip)}</div>
        </div>
      </div>`;
    }).join('');
    $$('.grammar-item .gi-head').forEach(h => h.onclick = e => {
      if (e.target.classList.contains('star-btn')) return;
      h.parentElement.classList.toggle('open');
    });
    bindSay(); bindFav();

    // 分页控件：一组 10 条，默认全部折叠
    let pager = $('#grammarPager');
    if (!pager) {
      pager = document.createElement('div');
      pager.id = 'grammarPager';
      pager.className = 'grammar-pager';
      $('#grammarList').parentElement.appendChild(pager);
    }
    pager.innerHTML = `
      <button class="gp-btn" id="gpPrev" ${grammarPage === 0 ? 'disabled' : ''}>‹ 上一组</button>
      <span class="gp-info">第 ${grammarPage + 1} / ${totalPages} 组</span>
      <button class="gp-btn" id="gpNext" ${grammarPage >= totalPages - 1 ? 'disabled' : ''}>下一组 ›</button>`;
    $('#gpPrev').onclick = () => { if (grammarPage > 0) { grammarPage--; renderGrammar(); } };
    $('#gpNext').onclick = () => { if (grammarPage < totalPages - 1) { grammarPage++; renderGrammar(); } };
  }

  // 听力素材库：本地自建内容（点读/跟唱/发音）+ TOPIK真题外部跳转
  let materialType = 'all';
  function renderMaterials() {
    $('#materialCount').textContent = MATERIALS.length + ' 个';
    const types = ['all', ...new Set(MATERIALS.map(m => m.type))];
    $('#materialTypes').innerHTML = types.map(t =>
      `<button class="chip ${materialType === t ? 'active' : ''}" data-mt="${esc(t)}">${t === 'all' ? '全部素材' : esc(t)}</button>`).join('');
    $$('#materialTypes .chip').forEach(b => b.onclick = () => { materialType = b.dataset.mt; renderMaterials(); });
    const list = materialType === 'all' ? MATERIALS : MATERIALS.filter(m => m.type === materialType);
    $('#materialList').innerHTML = list.map(m => {
      const isLink = m.kind === 'link';
      const icon = { '影子跟读':'🗣️','韩国广播':'📻','K-POP':'🎵','韩综片段':'📺','TOPIK真题':'📝','韩语播客':'🎧','系统课程':'🎓','音乐平台':'🎶' }[m.type] || '🎧';
      const tag = m.lib === 'kpop' ? '<span class="material-tag hot">原声+歌词</span>' : (isLink ? '' : '<span class="material-tag hot">本地30句</span>');
      const action = isLink
        ? `<a class="material-go" href="${esc(m.url)}" target="_blank" rel="noopener" title="跳转官网">↗</a>`
        : `<button class="material-go local" data-mat-id="${m.id}" title="打开学习">›</button>`;
      return `<div class="material-item">
        <div class="material-icon">${icon}</div>
        <div class="material-main">
          <div class="material-title">${esc(m.title)}</div>
          <div class="material-meta">${esc(m.host)} · ${esc(m.desc)}</div>
          <div class="material-tags"><span class="material-tag">${esc(m.type)}</span><span class="material-tag lv">${esc(m.level)}</span>${tag}</div>
        </div>
        ${action}
      </div>`;
    }).join('');
    $$('#materialList [data-mat-id]').forEach(b => b.onclick = () => {
      const m = MATERIALS.find(x => x.id === +b.dataset.matId);
      if (!m) return;
      if (m.lib === 'kpop') openKpopLibrary(m.kpFilter || 'all');
      else if (m.lib === 'variety') openVarietyClips(m.vSet || 0);
      else openLocalScript(m.cat || '影子跟读', m.title, m.id);
    });
    // 实时更新时间展示
    $('#liveUpdateText').textContent = `${MATERIALS_META.source} · ${MATERIALS_META.version} · 更新于 ${MATERIALS_META.updatedAt}`;
  }

  /* ---------- 本地素材播放器：K-POP 60 首（先选歌 + 歌词跟唱 + 发音学习） ---------- */
  let kpopLevel = 'all';
  let kgAudio = null; // 酷狗原声片段播放器
  function stopKgClip() {
    if (kgAudio) { try { kgAudio.pause(); } catch (e) {} }
    const b = $('#kgPlay'); if (b) { b.textContent = '▶ 播放原声'; b.classList.remove('playing'); }
    $$('#lyricScroll .lyric-line').forEach(el => el.classList.remove('active'));
  }
  /* ---------- 麦克风跟唱 AI 打分（Web Audio 音量/音高分析） ---------- */
  let singState = null; // { ctx, stream, raf, samples, running }
  function stopSing() {
    if (!singState) return;
    try { cancelAnimationFrame(singState.raf); } catch (e) {}
    try { if (singState.stream) singState.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { if (singState.ctx) singState.ctx.close(); } catch (e) {}
    singState = null;
    stopKgClip();
  }
  // 计算评分：按每个歌词时间窗内的平均音量与稳定性打分
  function scoreSinging(samples, lines, duration) {
    // samples: [{t, vol(0-1)}] 每 ~100ms 一个
    if (!samples.length) return null;
    const volArr = samples.map(s => s.vol);
    const avg = volArr.reduce((a, b) => a + b, 0) / volArr.length;
    const peak = Math.max(...volArr);
    // 歌声覆盖度：有多少采样点检测到声音
    const activeRatio = volArr.filter(v => v > 0.035).length / volArr.length;
    // 节奏/持续稳定性：相邻采样音量变化平滑度
    let smooth = 0;
    for (let i = 1; i < volArr.length; i++) smooth += Math.abs(volArr[i] - volArr[i - 1]);
    smooth = 1 - Math.min(1, smooth / volArr.length / 0.25);
    // 逐句覆盖：每句歌词时间窗内是否有声音
    let lineCover = 0, lineCnt = 0;
    (lines || []).forEach(ln => {
      const t0 = parseFloat(ln.dataset ? ln.dataset.t : (ln[0] || 0));
      if (isNaN(t0)) return;
      lineCnt++;
      const win = samples.filter(s => s.t >= t0 - 0.3 && s.t <= t0 + 2.8);
      if (win.length && win.some(s => s.vol > 0.04)) lineCover++;
    });
    const coverScore = lineCnt ? (lineCover / lineCnt) : activeRatio;
    // 综合分：覆盖度为主 + 音量 + 稳定
    let score = Math.round(
      coverScore * 45 +
      Math.min(1, avg / 0.18) * 25 +
      Math.min(1, peak / 0.35) * 15 +
      smooth * 15
    );
    score = Math.max(20, Math.min(100, score));
    let grade, comment;
    if (score >= 90) { grade = 'S'; comment = '太棒了！跟唱完整、节奏稳定，几乎是原唱水准！'; }
    else if (score >= 80) { grade = 'A'; comment = '很棒！大部分歌词都跟上了，继续保持！'; }
    else if (score >= 68) { grade = 'B'; comment = '不错哦，再大声一点、跟上节奏会更好！'; }
    else if (score >= 50) { grade = 'C'; comment = '有在唱啦，试着更大声、更贴合每句歌词。'; }
    else { grade = 'D'; comment = '声音有点小，靠近麦克风、跟着歌词大胆唱出来！'; }
    return { score, grade, comment, cover: Math.round(coverScore * 100), volume: Math.round(Math.min(1, avg / 0.2) * 100), rhythm: Math.round(smooth * 100) };
  }
  async function startSing(song, kc) {
    const box = $('#singScoreBox'), btn = $('#kpopSing');
    const statusEl = $('#ssStatus'), scoreEl = $('#ssScore'), barEl = $('#ssBar'), detailEl = $('#ssDetail');
    if (!box || !btn) return;
    box.style.display = 'block';
    scoreEl.textContent = '--'; barEl.style.width = '0%'; detailEl.innerHTML = '';
    statusEl.textContent = '正在请求麦克风权限…';
    btn.classList.add('singing'); btn.textContent = '⏹ 停止打分';
    // 权限/环境检测
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AC) {
      statusEl.textContent = '当前环境不支持麦克风打分';
      detailEl.innerHTML = '<div class="ss-tip">请在手机浏览器或微信小程序中打开并允许麦克风权限；也可点"播放原声"先跟唱练习。</div>';
      btn.classList.remove('singing'); btn.textContent = '🎤 麦克风跟唱 · AI 打分';
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    } catch (e) {
      statusEl.textContent = '未获得麦克风权限';
      detailEl.innerHTML = '<div class="ss-tip">需要允许麦克风才能打分哦～请在弹出的提示里点"允许"，然后重试。也可先点"播放原声"跟唱。</div>';
      btn.classList.remove('singing'); btn.textContent = '🎤 麦克风跟唱 · AI 打分';
      return;
    }
    const ctx = new AC();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    singState = { ctx, stream, raf: 0, samples: [], running: true };
    statusEl.textContent = '准备开唱，音乐马上开始！';
    // 播放原声（复用 kgAudio）
    if (kc && $('#kgPlay')) {
      stopKgClip();
      if (!kgAudio) kgAudio = new Audio();
      kgAudio._kgId = song.id;
      kgAudio.src = kc.clip;
      kgAudio.onplay = () => { statusEl.textContent = '正在跟唱…打分中'; };
      kgAudio.onended = () => finishSing();
      kgAudio.onerror = () => { statusEl.textContent = '原声加载失败，仍可清唱打分'; };
      kgAudio.play().catch(() => { statusEl.textContent = '点下方播放键开始，同时开唱'; });
    }
    // 采样循环
    const startTs = performance.now();
    const sample = () => {
      if (!singState || !singState.running) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
      const rms = Math.sqrt(sum / data.length);
      const t = (performance.now() - startTs) / 1000;
      singState.samples.push({ t, vol: rms });
      // 实时显示音量条
      barEl.style.width = Math.min(100, rms * 400) + '%';
      // 到时结束（若无音频约 12 秒；有音频随结束）
      const dur = (kgAudio && kgAudio.duration) || 60;
      if (t >= Math.min(dur + 0.5, 62)) { finishSing(); return; }
      singState.raf = requestAnimationFrame(sample);
    };
    sample();
  }
  function finishSing() {
    if (!singState) return;
    const box = $('#singScoreBox'), statusEl = $('#ssStatus'), scoreEl = $('#ssScore');
    const barEl = $('#ssBar'), detailEl = $('#ssDetail'), btn = $('#kpopSing');
    const lyricLines = $$('#lyricScroll .lyric-line');
    const samples = singState.samples.slice();
    singState.running = false;
    try { cancelAnimationFrame(singState.raf); } catch (e) {}
    try { singState.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { singState.ctx.close(); } catch (e) {}
    singState = null;
    if (kgAudio) { try { kgAudio.pause(); } catch (e) {} }
    if (btn) { btn.classList.remove('singing'); btn.textContent = '🎤 麦克风跟唱 · AI 打分'; }
    const r = scoreSinging(samples, lyricLines, kgAudio ? kgAudio.duration : 0);
    if (!r) { if (statusEl) statusEl.textContent = '没有采集到声音'; return; }
    // 动画涨分
    statusEl.textContent = '打分完成 · 评级 ' + r.grade;
    barEl.style.width = r.score + '%';
    let cur = 0;
    const t = setInterval(() => {
      cur += Math.max(1, Math.round((r.score - cur) / 6));
      if (cur >= r.score) { cur = r.score; clearInterval(t); }
      scoreEl.textContent = cur;
    }, 45);
    detailEl.innerHTML = `
      <div class="ss-comment">${esc(r.comment)}</div>
      <div class="ss-metrics">
        <div><b>${r.cover}%</b><span>歌词覆盖</span></div>
        <div><b>${r.volume}%</b><span>声音响度</span></div>
        <div><b>${r.rhythm}%</b><span>节奏稳定</span></div>
      </div>`;
  }
  const GIRL_GROUP_RE = /BLACKPINK|TWICE|NewJeans|aespa|IVE|ITZY|G\)I-DLE|Red Velvet|IZ\*ONE|NMIXX|LE SSERAFIM|BABYMONSTER|少女时代|f\(x\)/;
  const BOY_GROUP_RE = /BTS|방탄|SEVENTEEN|Stray Kids|TXT|TOMORROW|EXO|NCT|ENHYPEN|ATEEZ|TREASURE/;
  const KPOP_PAGE_SIZE = 10;
  let kpopPage = 0, kpopSongId = null, kpopFollow = false; // 自动跟随默认关闭

  function kpopPool() {
    if (kpopLevel === 'girl') return KPOP_SONGS.filter(s => GIRL_GROUP_RE.test(s.artist));
    if (kpopLevel === 'solo') return KPOP_SONGS.filter(s => !GIRL_GROUP_RE.test(s.artist) && !BOY_GROUP_RE.test(s.artist));
    if (kpopLevel === 'all') return KPOP_SONGS;
    return KPOP_SONGS.filter(s => s.level === kpopLevel);
  }

  /* ===== 第一级：歌曲列表（每页 10 首），点击再进歌词跟唱页 ===== */
  function openKpopLibrary(preset) {
    stopSing(); stopKgClip();
    kpopLevel = (preset && preset !== 'all') ? preset : 'all';
    kpopPage = 0; kpopSongId = null;
    renderKpopHome();
  }

  function renderKpopHome() {
    openModal(`<div class="modal-title">♫ K-POP 歌词学习 · ${KPOP_SONGS.length} 首</div>
      <div class="media-hint">先选歌，再打开歌词跟唱页 · 每页 10 首</div>
      <div class="kpop-filter" id="kpopFilter"></div>
      <div class="kpop-grid" id="kpopGrid"></div>
      <div class="kpop-pager" id="kpopPager"></div>
      <div class="modal-btns"><button class="modal-ok" data-act="close">收起</button></div>`);
    const levels = ['all', 'girl', 'solo', '初级', '中级'];
    const labels = { all: '全部', girl: '女团', solo: '独立歌手', 初级: '初级', 中级: '中级' };
    $('#kpopFilter').innerHTML = levels.map(l =>
      `<button class="chip ${kpopLevel === l ? 'active' : ''}" data-kl="${l}">${labels[l]}</button>`).join('');
    $$('#kpopFilter .chip').forEach(b => b.onclick = () => {
      kpopLevel = b.dataset.kl; kpopPage = 0;
      $$('#kpopFilter .chip').forEach(x => x.classList.toggle('active', x.dataset.kl === kpopLevel));
      renderKpopGrid();
    });
    $('#modalCard [data-act="close"]').onclick = closeModal;
    renderKpopGrid();
  }

  function renderKpopGrid() {
    const pool = kpopPool();
    const pages = Math.max(1, Math.ceil(pool.length / KPOP_PAGE_SIZE));
    if (kpopPage >= pages) kpopPage = 0;
    const slice = pool.slice(kpopPage * KPOP_PAGE_SIZE, kpopPage * KPOP_PAGE_SIZE + KPOP_PAGE_SIZE);
    $('#kpopGrid').innerHTML = slice.map((s, i) => `
      <button class="kpop-song-item" data-song="${s.id}">
        <span class="ksi-num">${kpopPage * KPOP_PAGE_SIZE + i + 1}</span>
        <span class="ksi-main"><b>${esc(s.ko)}</b><small>${esc(s.title)} · ${esc(s.artist)}</small></span>
        <span class="ksi-tag">${esc(s.level)}</span>
        <span class="ksi-arrow">›</span>
      </button>`).join('') || '<div class="lyric-empty">该分类暂无歌曲</div>';
    $('#kpopPager').innerHTML = `
      <button class="gp-btn" id="kpPrev" ${kpopPage === 0 ? 'disabled' : ''}>‹ 上一组</button>
      <span class="kpop-page-num">第 ${kpopPage + 1} / ${pages} 组 · 共 ${pool.length} 首</span>
      <button class="gp-btn" id="kpNext" ${kpopPage >= pages - 1 ? 'disabled' : ''}>下一组 ›</button>`;
    $$('#kpopGrid [data-song]').forEach(b => b.onclick = () => openKpopSong(+b.dataset.song));
    const prev = $('#kpPrev'), next = $('#kpNext');
    if (prev) prev.onclick = () => { if (kpopPage > 0) { kpopPage--; renderKpopGrid(); } };
    if (next) next.onclick = () => { if (kpopPage < pages - 1) { kpopPage++; renderKpopGrid(); } };
  }

  /* ===== 第二级：单曲歌词跟唱页 ===== */
  function openKpopSong(id) {
    stopSing(); stopKgClip();
    kpopSongId = id;
    renderKpopDetail();
  }
  function backToKpopHome() { stopSing(); stopKgClip(); kpopSongId = null; renderKpopHome(); }

  function renderKpopDetail() {
    const s = KPOP_SONGS.find(x => x.id === kpopSongId);
    if (!s) { renderKpopHome(); return; }
    const kc = (typeof KUGOU_CLIPS !== 'undefined' && KUGOU_CLIPS[s.id]) || null;
    openModal(`<div class="modal-title">♫ K-POP 歌词跟唱</div>
      <div class="media-hint">点歌词可读该句 · 不强制跟随，可自由滚动</div>
      <div class="kpop-scroll" id="kpopScroll"></div>
      <div class="modal-btns"><button class="modal-cancel" data-act="back">‹ 返回歌单</button><button class="modal-ok" data-act="close">收起</button></div>`);
    $('#modalCard [data-act="back"]').onclick = backToKpopHome;
    $('#modalCard [data-act="close"]').onclick = closeModal;
    renderKpopSongBody(s, kc);
  }

  function renderKpopSongBody(s, kc) {
    $('#kpopScroll').innerHTML = `
      <div class="kpop-card">
        <div class="kpop-head">
          <div class="kpop-cover">♫</div>
          <div class="kpop-info">
            <div class="kpop-title">${esc(s.ko)}</div>
            <div class="kpop-sub">${esc(s.title)} · ${esc(s.artist)}</div>
            <div class="kpop-meta"><span class="deg-tag deg-${s.level === '中级' ? '中' : '初'}">${esc(s.level)}</span> · ${s.year}</div>
          </div>
        </div>
        ${kc ? `<div class="kugou-clip">
          <div class="kg-title">♫ K-pop 原声副歌 · 60 秒</div>
          <div class="kg-src">音源：${esc(kc.src)} · 来自酷狗音乐</div>
          <div class="kg-ctrls">
            <button class="kg-play" id="kgPlay">▶ 播放原声</button>
            <a class="kg-full" href="${esc(kc.share)}" target="_blank" rel="noopener">在酷狗听完整版 ›</a>
          </div>
          <div class="kg-bar"><div class="kg-bar-fill" id="kgBar"></div></div>
        </div>` : ''}
        <div class="lyric-box">
          <div class="lyric-head">
            <span class="lyric-title">同步歌词（韩语 / 音译 / 翻译）</span>
            <button class="follow-toggle ${kpopFollow ? 'on' : ''}" id="followToggle">${kpopFollow ? '跟随:开' : '跟随:关'}</button>
          </div>
          <div class="lyric-scroll" id="lyricScroll">
            ${(kc && kc.lyrics && kc.lyrics.length)
              ? kc.lyrics.map((ln, i) => `<div class="lyric-line" data-li="${i}" data-t="${ln[0]}" data-say="${esc(ln[1])}">
                  <div class="ly-ko">${esc(ln[1])}</div>
                  ${ln[2] ? `<div class="ly-roman">${esc(ln[2])}</div>` : ''}
                  ${ln[3] ? `<div class="ly-cn">${esc(ln[3])}</div>` : ''}
                </div>`).join('')
              : '<div class="lyric-empty">该曲目暂无歌词，仍可听原声跟唱</div>'}
          </div>
        </div>
        <div class="kpop-section-title">🎤 跟唱金句（点句子听真人发音）</div>
        ${s.lines.map((ln) => `
          <div class="kline" data-ksay="${esc(ln.ko)}">
            <div class="kline-ko">${esc(ln.ko)}</div>
            <div class="kline-roman">${esc(ln.roman)}</div>
            <div class="kline-cn">${esc(ln.cn)}</div>
            <button class="kline-play" data-ksay="${esc(ln.ko)}">🔊 听发音 / 跟唱</button>
          </div>`).join('')}
        <div class="kpop-actions">
          <button class="kpop-btn sing-btn" id="kpopSing">🎤 麦克风跟唱 · AI 打分</button>
        </div>
        <div class="sing-score-box" id="singScoreBox" style="display:none">
          <div class="ss-head"><span id="ssStatus">准备中…</span><span class="ss-score" id="ssScore">--</span></div>
          <div class="ss-bar"><div class="ss-bar-fill" id="ssBar"></div></div>
          <div class="ss-detail" id="ssDetail"></div>
          <button class="ss-close" id="ssClose">收起结果</button>
        </div>
      </div>
      <div class="media-nav">
        <button class="gp-btn" id="kpopPrev">‹ 上一首</button>
        <button class="gp-btn" id="kpopNext">下一首 ›</button>
      </div>`;

    // 歌词行：点击任意一句 -> 点读发音（保留 Kpop 原在线音源）+（若正在播放）跳到该句时间点；绝不锁死滚动
    $$('#lyricScroll .lyric-line').forEach(el => el.onclick = () => {
      const say = el.dataset.say || '';
      if (say) speakKpop(say, 0.95);
      if (kpopFollow && kgAudio && !kgAudio.paused) {
        const t = parseFloat(el.dataset.t);
        if (!isNaN(t)) { try { kgAudio.currentTime = t; } catch (e) {} }
      }
      $$('#lyricScroll .lyric-line').forEach(x => x.classList.remove('picked'));
      el.classList.add('picked');
    });
    // 自动跟随开关：开启后歌词随播放进度平滑滚动；只滚歌词框内部，不影响页面其它点击
    const ft = $('#followToggle');
    if (ft) ft.onclick = () => {
      kpopFollow = !kpopFollow;
      ft.classList.toggle('on', kpopFollow);
      ft.textContent = kpopFollow ? '跟随:开' : '跟随:关';
      if (!kpopFollow) $$('#lyricScroll .lyric-line').forEach(x => x.classList.remove('active'));
      toast(kpopFollow ? '已开启歌词自动滚动' : '已关闭自动跟随');
    };

    $$('#kpopScroll [data-ksay]').forEach(el => el.onclick = e => { e.stopPropagation(); speak(el.dataset.ksay, 0.95); });

    // 上一首 / 下一首：基于当前筛选后的曲库
    const pool = kpopPool();
    const at = pool.findIndex(x => x.id === s.id);
    $('#kpopPrev').disabled = at <= 0;
    $('#kpopNext').disabled = at < 0 || at >= pool.length - 1;
    $('#kpopPrev').onclick = () => { if (at > 0) { stopSing(); stopKgClip(); openKpopSong(pool[at - 1].id); } };
    $('#kpopNext').onclick = () => { if (at >= 0 && at < pool.length - 1) { stopSing(); stopKgClip(); openKpopSong(pool[at + 1].id); } };

    // 原声片段播放：更新进度条 + 高亮 +（跟随开启时）歌词平滑滚动
    if (kc && $('#kgPlay')) {
      const kgBtn = $('#kgPlay'), kgBar = $('#kgBar');
      const lyricLines = $$('#lyricScroll .lyric-line');
      const lyricScroll = $('#lyricScroll');
      let lastActive = -1;
      let userScrollingUntil = 0;   // 用户手动滑歌词后，短暂暂停自动滚动，避免打架
      // 用户触摸/滚动歌词框：记录暂停时间点（不影响点击其它按钮——只监听歌词框本身）
      if (lyricScroll) {
        const markUserScroll = () => { userScrollingUntil = Date.now() + 3500; };
        lyricScroll.addEventListener('touchstart', markUserScroll, { passive: true });
        lyricScroll.addEventListener('wheel', markUserScroll, { passive: true });
      }
      // 只滚动歌词框内部 scrollTop，绝不动页面本体，故不阻挡任何其它点击
      const scrollLyricTo = (idx) => {
        if (!lyricScroll || !lyricLines[idx]) return;
        const el = lyricLines[idx];
        // 用相对视口差值计算，避免 offsetParent/contain 影响；只滚歌词框内部
        const delta = (el.getBoundingClientRect().top - lyricScroll.getBoundingClientRect().top)
          + lyricScroll.scrollTop - (lyricScroll.clientHeight - el.clientHeight) / 2;
        const top = Math.max(0, delta);
        try { lyricScroll.scrollTo({ top, behavior: 'smooth' }); }
        catch (e) { lyricScroll.scrollTop = top; }
      };
      kgBtn.onclick = () => {
        if (kgAudio && !kgAudio.paused && kgAudio._kgId === s.id) { stopKgClip(); return; }
        stopKgClip();
        try { speechSynthesis.cancel(); } catch (e) {}
        if (!kgAudio) { kgAudio = new Audio(); kgAudio.preload = 'auto'; }
        kgAudio._kgId = s.id;
        kgAudio.src = kc.clip;
        kgAudio.onplay = () => { kgBtn.textContent = '⏸ 暂停原声'; kgBtn.classList.add('playing'); };
        kgAudio.onpause = () => { kgBtn.textContent = '▶ 播放原声'; kgBtn.classList.remove('playing'); };
        kgAudio.ontimeupdate = () => {
          const cur = kgAudio.currentTime;
          if (kgBar && kgAudio.duration) kgBar.style.width = (cur / kgAudio.duration * 100) + '%';
          if (!kpopFollow) return;               // 默认不跟随
          let active = -1;
          for (let i = 0; i < lyricLines.length; i++) {
            if (cur + 0.15 >= parseFloat(lyricLines[i].dataset.t)) active = i; else break;
          }
          if (active !== lastActive) {
            lyricLines.forEach((el, i) => el.classList.toggle('active', i === active));
            // 跟随开启且用户未在手动滑歌词时，把当前句滚到歌词框中央
            if (active >= 0 && Date.now() >= userScrollingUntil) scrollLyricTo(active);
            lastActive = active;
          }
        };
        kgAudio.onended = () => { stopKgClip(); if (kgBar) kgBar.style.width = '0%'; lyricLines.forEach(el => el.classList.remove('active')); lastActive = -1; };
        kgAudio.onerror = () => { toast('原声片段加载失败，可用上方链接到酷狗收听'); stopKgClip(); };
        const p = kgAudio.play();
        if (p && p.catch) p.catch(() => toast('点击播放原声'));
      };
    }
    // 麦克风跟唱 AI 打分
    const singBtn = $('#kpopSing');
    if (singBtn) singBtn.onclick = () => {
      if (singState && singState.running) { finishSing(); return; }
      startSing(s, kc);
    };
    const ssClose = $('#ssClose');
    if (ssClose) ssClose.onclick = () => { stopSing(); const b = $('#singScoreBox'); if (b) b.style.display = 'none'; };
  }

  /* ---------- 本地素材播放器：韩综精选片段 ---------- */
  let varietyIdx = 0, varietySet = 0;
  const VARIETY_SET_SIZE = 3; // 每个板块显示 3 个片段
  function varietyPool() {
    const start = varietySet * VARIETY_SET_SIZE;
    return VARIETY_CLIPS.slice(start, start + VARIETY_SET_SIZE);
  }
  function openVarietyClips(setIdx) {
    varietySet = setIdx || 0;
    varietyIdx = 0;
    const pool = varietyPool();
    openModal(`<div class="modal-title">📺 韩综精选片段 · 对话跟读</div>
      <div class="media-hint">真实综艺语境 · 逐句真人发音 · 生活口语 · 本板块 ${pool.length} 个片段</div>
      <div class="variety-scroll" id="varietyScroll"></div>
      <div class="modal-btns"><button class="modal-ok" data-act="close">收起</button></div>`);
    $('#modalCard [data-act="close"]').onclick = closeModal;
    renderVarietyClip();
  }
  function renderVarietyClip() {
    const pool = varietyPool();
    if (varietyIdx >= pool.length) varietyIdx = 0;
    const g = pool[varietyIdx];
    $('#varietyScroll').innerHTML = `
      <div class="media-counter">${varietyIdx + 1} / ${pool.length}</div>
      <div class="drama-scene-title">🎬 ${esc(g.show)} · ${esc(g.theme)} · ${esc(g.level)}</div>
      ${g.dialog.map((d, i) => `
        <div class="dialog-bubble ${i % 2 === 1 ? 'b' : ''}">
          <div class="dialog-avatar">${esc(d.speaker.slice(0, 2))}</div>
          <div class="dialog-content">
            <div class="dialog-ko">${esc(d.ko)}</div>
            <div class="dialog-roman">${esc(d.roman)}</div>
            <div class="dialog-cn">${esc(d.cn)}</div>
            <button class="dialog-play" data-vsay="${esc(d.ko)}">🔊 真人发音</button>
          </div>
        </div>`).join('')}
      <div class="media-nav">
        <button class="gp-btn" id="vPrev" ${varietyIdx === 0 ? 'disabled' : ''}>‹ 上一片段</button>
        <button class="gp-btn" id="vNext" ${varietyIdx >= pool.length - 1 ? 'disabled' : ''}>下一片段 ›</button>
      </div>`;
    $$('#varietyScroll [data-vsay]').forEach(b => b.onclick = () => speak(b.dataset.vsay, 1));
    $('#vPrev').onclick = () => { if (varietyIdx > 0) { varietyIdx--; renderVarietyClip(); } };
    $('#vNext').onclick = () => { if (varietyIdx < pool.length - 1) { varietyIdx++; renderVarietyClip(); } };
  }

  /* ---------- 本地素材播放器：通用文案（跟读/广播/播客/课程） ---------- */
  function openLocalScript(cat, title, matId) {
    // 每个板块使用独立内容（30 句），避免换个名字内容不变
    const lines = (typeof MATERIAL_CONTENT !== 'undefined' && MATERIAL_CONTENT[matId])
      ? MATERIAL_CONTENT[matId]
      : LOCAL_SCRIPTS.filter(s => s.cat === cat);
    openModal(`<div class="modal-title">🗣️ ${esc(title)}</div>
      <div class="media-hint">${esc(cat)} · 共 ${lines.length} 句 · 逐句真人发音跟读</div>
      <div class="script-scroll" id="scriptScroll">
        ${lines.map((s, i) => `
          <div class="script-line" data-ssay="${esc(s.ko)}">
            <div class="script-num">${i + 1}</div>
            <div class="script-body">
              <div class="script-ko">${esc(s.ko)}</div>
              <div class="script-roman">${esc(s.roman)}</div>
              <div class="script-cn">${esc(s.cn)}</div>
            </div>
            <button class="script-play" data-ssay="${esc(s.ko)}">🔊</button>
          </div>`).join('')}
      </div>
      <div class="modal-btns"><button class="modal-ok" data-act="close">收起</button></div>`);
    $$('#scriptScroll [data-ssay]').forEach(el => el.onclick = e => { e.stopPropagation(); speak(el.dataset.ssay, 0.95); });
    $('#modalCard [data-act="close"]').onclick = closeModal;
  }
  let ttsRate = 1;
  function initTTS() {
    $$('#speedBtns button').forEach(b => b.onclick = () => {
      $$('#speedBtns button').forEach(x => x.classList.toggle('active', x === b));
      ttsRate = +b.dataset.rate;
    });
    $('#ttsPlay').onclick = () => {
      const t = $('#ttsText').value.trim();
      if (!t) { toast('请输入韩语句子'); return; }
      speak(t, ttsRate);
    };
  }
  function renderListenLog() {
    if (!state.listenLogs.length) {
      $('#listenLogList').innerHTML = `<div class="empty-tip" style="padding:16px 0">还没有记录，点击 + 添加</div>`;
      return;
    }
    $('#listenLogList').innerHTML = state.listenLogs.map((l, i) => `
      <div class="log-item">
        <span class="log-check ${l.done ? 'done' : ''}" data-log-check="${i}">${l.done ? '✅' : '⬜'}</span>
        <div class="log-main">
          <div class="log-name">${esc(l.name)}</div>
          <div class="log-src">${esc(l.source || '未填来源')}</div>
        </div>
        <button class="del-btn" data-log-del="${i}">🗑️</button>
      </div>`).join('');
    $$('[data-log-check]').forEach(b => b.onclick = () => {
      state.listenLogs[+b.dataset.logCheck].done = !state.listenLogs[+b.dataset.logCheck].done;
      save(); renderListenLog();
    });
    $$('[data-log-del]').forEach(b => b.onclick = () => {
      state.listenLogs.splice(+b.dataset.logDel, 1); save(); renderListenLog(); toast('已删除');
    });
  }
  function initListenLog() {
    $('#addLogBtn').onclick = () => {
      openModal(`
        <div class="modal-title">添加听力记录</div>
        <input class="modal-input" id="logName" placeholder="素材名称（如：韩剧片段）">
        <input class="modal-input" id="logSrc" placeholder="来源备注（如：某剧第1集）">
        <div class="modal-btns">
          <button class="modal-cancel" data-act="cancel">取消</button>
          <button class="modal-ok" data-act="ok">添加</button>
        </div>`);
      $('#modalCard [data-act="cancel"]').onclick = closeModal;
      $('#modalCard [data-act="ok"]').onclick = () => {
        const name = $('#logName').value.trim();
        if (!name) { toast('请填写名称'); return; }
        state.listenLogs.push({ name, source: $('#logSrc').value.trim(), done: false });
        save(); renderListenLog(); closeModal(); toast('已添加 📝');
      };
    };
  }

  /* ---------- 输入框事件 ---------- */
  $('#dictSearch').addEventListener('input', e => { dictQuery = e.target.value; renderDict(true); });

  /* ---------- 时钟 ---------- */
  function tickClock() {
    const el = $('#sbTime');
    if (el) { const d = new Date(); el.textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; }
  }

  /* ---------- 数据安全中心（备份 / 恢复 / 自动保存） ---------- */
  function fmtSavedAt(ts) {
    if (!ts) return '尚未保存';
    const d = new Date(ts);
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return '刚刚已自动保存';
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前已自动保存`;
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')} 已自动保存`;
  }
  function initDataCenter() {
    const savedEl = $('#dataSavedAt');
    if (savedEl && window.Store) savedEl.textContent = fmtSavedAt(Store.lastSaved());
    // 自动保存回调：更新"最近保存"文案
    if (window.Store) {
      window.__onAutoSaved = ts => { if (savedEl) savedEl.textContent = fmtSavedAt(ts); };
      window.__onDataRestored = msg => { toast('💾 ' + msg); location.reload(); };
      Store.startAutoSave(() => state); // 后台自保存：每15秒 + 页面隐藏/关闭前
    }
    // 复制备份码
    const btnExp = $('#btnExportCode');
    if (btnExp) btnExp.onclick = async () => {
      if (!window.Store) { toast('当前环境不支持备份'); return; }
      const code = Store.exportCode();
      try {
        await navigator.clipboard.writeText(code);
        toast('✅ 备份码已复制，请粘贴到备忘录保存');
      } catch (e) {
        openModal(`<div class="modal-title">📋 你的备份码</div>
          <textarea id="backupCodeArea" class="tts-input" rows="5" style="font-size:11px">${esc(code)}</textarea>
          <p class="mini-title" style="margin-top:8px">请长按全选复制并妥善保存</p>
          <div class="modal-btns"><button class="modal-ok" data-act="cancel">完成</button></div>`);
        $('#modalCard [data-act="cancel"]').onclick = closeModal;
      }
    };
    // 导出文件
    const btnFile = $('#btnExportFile');
    if (btnFile) btnFile.onclick = () => {
      if (!window.Store) { toast('当前环境不支持导出'); return; }
      Store.exportFile(); toast('💽 备份文件已下载');
    };
    // 导入备份码
    const btnImp = $('#btnImportCode');
    if (btnImp) btnImp.onclick = () => {
      openModal(`<div class="modal-title">📥 导入备份码</div>
        <p style="text-align:center;font-size:11px;color:var(--sub)">粘贴之前保存的备份码，恢复全部学习数据</p>
        <textarea id="importCodeArea" class="tts-input" rows="5" placeholder="在这里粘贴备份码…" style="font-size:11px"></textarea>
        <div class="modal-btns"><button class="modal-cancel" data-act="cancel">取消</button>
        <button class="modal-ok" data-act="import">恢复数据</button></div>`);
      $('#modalCard [data-act="cancel"]').onclick = closeModal;
      $('#modalCard [data-act="import"]').onclick = () => {
        const code = $('#importCodeArea').value.trim();
        if (!code) { toast('请先粘贴备份码'); return; }
        const restored = window.Store ? Store.importCode(code, defaultState) : null;
        if (!restored) { toast('❌ 备份码无效，请检查是否复制完整'); return; }
        closeModal();
        state = restored;
        toast('✅ 数据恢复成功，正在重新加载…');
        setTimeout(() => location.reload(), 600);
      };
    };
  }

  /* ---------- 发布者权限管理 ---------- */
  function applyPublisherConfig() {
    if (!window.Publisher) return;
    const cfg = Publisher.getConfig();
    // 自定义每日一句（追加到 DAILY_SENTENCES 前面）
    if (cfg.daily && cfg.daily.length && typeof DAILY_SENTENCES !== 'undefined') {
      cfg.daily.forEach(item => {
        if (item && item.ko && !DAILY_SENTENCES.some(d => d.ko === item.ko)) {
          DAILY_SENTENCES.unshift({ ko: item.ko, cn: item.cn || '', roman: item.roman || '' });
        }
      });
      if (typeof renderDailySentence === 'function') {
        dailyDateKey = ''; // 强制重新取句
        renderDailySentence();
      }
      if (typeof renderSentences === 'function') renderSentences();
    }
  }
  function refreshPublisherUI() {
    const isPub = !!(window.Publisher && Publisher.isPublisher());
    const guest = $('#pubGuest'), admin = $('#pubAdmin'), role = $('#pubRole');
    if (role) role.textContent = isPub ? '发布者 · 可管理' : '访客 · 只读体验';
    if (guest) guest.style.display = isPub ? 'none' : '';
    if (admin) admin.style.display = isPub ? '' : 'none';
  }
  function initPublisher() {
    if (!window.Publisher) return;
    applyPublisherConfig();
    refreshPublisherUI();
    const login = $('#btnPublisherLogin');
    if (login) login.onclick = () => {
      openModal(`<div class="modal-title">🔐 发布者登录</div>
        <p style="font-size:12px;color:var(--sub);line-height:1.7;margin:4px 0 12px">请输入发布者密钥以解锁内容管理。访客无需登录，可直接学习全部内容。</p>
        <input class="modal-input" id="pubSecret" type="password" placeholder="发布者密钥">
        <div class="modal-btns"><button class="modal-cancel" data-act="cancel">取消</button>
        <button class="modal-ok" data-act="ok">解锁</button></div>`);
      $('#modalCard [data-act="cancel"]').onclick = closeModal;
      $('#modalCard [data-act="ok"]').onclick = async () => {
        const v = $('#pubSecret').value;
        const ok = await Publisher.authorize(v);
        if (ok) {
          closeModal(); refreshPublisherUI(); toast('✓ 发布者模式已开启');
        } else {
          toast('密钥不正确');
        }
      };
    };
    const logout = $('#btnPubLogout');
    if (logout) logout.onclick = () => { Publisher.revoke(); refreshPublisherUI(); toast('已退出发布者模式'); };
    const exportBtn = $('#btnPubExport');
    if (exportBtn) exportBtn.onclick = () => {
      const code = Publisher.exportConfig();
      openModal(`<div class="modal-title">📤 发布配置码</div>
        <p style="font-size:12px;color:var(--sub);line-height:1.7;margin:4px 0 10px">把此码发给维护方回填即可让所有访客看到你改的内容。</p>
        <textarea id="pubCfgCode" class="tts-input" rows="5" style="font-size:10px">${esc(code)}</textarea>
        <div class="modal-btns"><button class="modal-ok" data-act="copy">复制配置码</button></div>`);
      $('#modalCard [data-act="copy"]').onclick = async () => {
        try { await navigator.clipboard.writeText(code); toast('✅ 已复制'); } catch (e) { $('#pubCfgCode').select(); }
      };
    };
    const importBtn = $('#btnPubImport');
    if (importBtn) importBtn.onclick = () => {
      openModal(`<div class="modal-title">📥 导入配置码</div>
        <textarea id="pubCfgIn" class="tts-input" rows="4" placeholder="粘贴 HXYCFG1: 开头的配置码"></textarea>
        <div class="modal-btns"><button class="modal-cancel" data-act="cancel">取消</button>
        <button class="modal-ok" data-act="ok">导入</button></div>`);
      $('#modalCard [data-act="cancel"]').onclick = closeModal;
      $('#modalCard [data-act="ok"]').onclick = () => {
        const cfg = Publisher.importConfig($('#pubCfgIn').value.trim());
        if (cfg) { closeModal(); applyPublisherConfig(); toast('✓ 配置已导入'); }
        else toast('配置码无效');
      };
    };
    const dailyBtn = $('#btnPubDaily');
    if (dailyBtn) dailyBtn.onclick = () => {
      const cfg = Publisher.getConfig();
      const list = cfg.daily || [];
      const render = () => {
        openModal(`<div class="modal-title">✎ 管理每日一句</div>
          <div class="media-hint">发布者自定义的句子会置顶显示（访客只读，不可修改）</div>
          ${list.length ? list.map((d, i) => `<div class="pub-daily-item"><b>${esc(d.ko)}</b><span>${esc(d.cn)}</span><button class="pub-del" data-pd="${i}">删</button></div>`).join('') : '<p class="mini-title">暂无自定义句子</p>'}
          <input class="modal-input" id="pdKo" placeholder="韩语句子">
          <input class="modal-input" id="pdCn" placeholder="中文意思">
          <input class="modal-input" id="pdRo" placeholder="罗马音（可选）">
          <div class="modal-btns"><button class="modal-cancel" data-act="cancel">关闭</button>
          <button class="modal-ok" data-act="add">+ 添加</button></div>`);
        $('#modalCard [data-act="cancel"]').onclick = closeModal;
        $('#modalCard [data-act="add"]').onclick = () => {
          const ko = $('#pdKo').value.trim();
          if (!ko) { toast('请填写韩语句子'); return; }
          list.push({ ko, cn: $('#pdCn').value.trim(), roman: $('#pdRo').value.trim() });
          cfg.daily = list; Publisher.saveConfig(cfg);
          applyPublisherConfig(); render(); toast('已添加');
        };
        $$('#modalCard [data-pd]').forEach(b => b.onclick = () => {
          list.splice(+b.dataset.pd, 1); cfg.daily = list; Publisher.saveConfig(cfg);
          applyPublisherConfig(); render(); toast('已删除');
        });
      };
      render();
    };
  }

  /* ---------- 启动 ---------- */
  function init() {
    tickClock(); setInterval(tickClock, 20000);
    initSplash();
    renderHome();
    initCheckin();
    renderDict();
    renderSentences();
    renderDramas();
    renderReciteList();
    renderSounds();
    renderCollect();
    renderHonorific();
    renderGrammar();
    renderMaterials();
    initTTS();
    initListenLog();
    renderListenLog();
    initDataCenter();
    initPublisher();
    // 素材"实时更新"：点刷新重新渲染并更新时间戳
    const refreshBtn = $('#refreshMaterials');
    if (refreshBtn) refreshBtn.onclick = () => {
      renderMaterials();
      const now = new Date();
      $('#liveUpdateText').textContent = `已同步最新素材 · ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')} 更新`;
      toast('🔄 素材库已刷新到最新');
    };
    refreshStats();
  }
  init();
})();
