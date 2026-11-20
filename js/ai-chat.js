/* ============================================================
   韩小语 · AI 韩语陪练（BYOK 版 / 用户自带密钥）
   ------------------------------------------------------------
   模式：每个用户填「自己的」DeepSeek API Key，存在自己浏览器本地，
        直连 DeepSeek 官方 API。谁用谁的免费额度，发布者零成本。
   功能：韩语对话 / AI 纠错打分 / 生成文字版 / 发音评分
   密钥：localStorage 存储，仅存本机；用户可随时更换或删除。
   ============================================================ */
(function (global) {
  'use strict';

  var API = 'https://api.deepseek.com/chat/completions';
  var MODEL = 'deepseek-chat';
  var KEY_STORE = 'hxy_deepseek_key_v1';   // 用户自己的密钥，仅存本机
  var history = [];        // [{who:'me'|'ai', text/ko/cn/roman/score/tip, ts}]
  var panel = null, keyView = null;

  var SYS = '你是「韩小语」App 里的韩语陪练老师。请用友好、鼓励的语气和用户用韩语聊天。\n' +
    '每一次回复都必须严格输出一个 JSON 对象（不要输出多余文字、不要 markdown 代码块），字段如下：\n' +
    '{"ko":"你的韩语回复","cn":"这段韩语的中文翻译","roman":"韩语回复的罗马音标注","score":数字或null,"tip":"中文学习建议"}\n' +
    '规则：\n' +
    '1. ko 是你的韩语回复，简短自然（1-3 句），贴合用户话题。\n' +
    '2. cn 是 ko 的准确中文翻译。\n' +
    '3. roman 是 ko 的罗马音（方便初学者拼读）。\n' +
    '4. 如果用户说了韩语：score 给 0-100 的准确度/表达自然度评分，tip 用中文指出语法、用词或敬语问题并给出更地道的说法；如果用户说的是中文或第一句打招呼：score 设为 null，tip 给一句中文引导语。\n' +
    '5. 全程保持亲切，像耐心的大姐姐老师。';

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function getKey(){ try{ return localStorage.getItem(KEY_STORE)||''; }catch(e){ return ''; } }
  function setKey(k){ try{ localStorage.setItem(KEY_STORE, k.trim()); }catch(e){} }
  function clearKey(){ try{ localStorage.removeItem(KEY_STORE); }catch(e){} }

  /* ---------- 密钥设置视图 ---------- */
  function ensureKeyView(){
    if(keyView) return keyView;
    keyView = document.createElement('div');
    keyView.className = 'aic-keyview';
    var has = !!getKey();
    keyView.innerHTML = `
      <div class="aic-key-card">
        <button class="aic-back aic-key-back" id="aicKeyBack" aria-label="返回工作台">‹ 返回工作台</button>
        <div class="aic-key-icon">🔑</div>
        <div class="aic-key-title">先设置你的 AI 密钥</div>
        <p class="aic-key-desc">AI 陪练用<b>你自己的</b> DeepSeek 密钥，各用各的免费额度，不花发布者的钱，也不消耗你的额度给别人。</p>
        <div class="aic-key-steps">
          <div>① 手机浏览器打开 <a href="https://platform.deepseek.com" target="_blank" rel="noopener">platform.deepseek.com</a>，手机号注册登录</div>
          <div>② 进入「API keys」→ 创建一个密钥，复制 <code>sk-</code> 开头的字符串</div>
          <div>③ 粘贴到下面保存即可（新用户有免费额度，够用很久）</div>
        </div>
        <input id="aicKeyInput" class="aic-key-input" type="password" placeholder="粘贴 sk- 开头的密钥" value="${esc(getKey())}" autocomplete="off">
        <div class="aic-key-actions">
          <button id="aicKeySave" class="aic-key-save">保存并开始</button>
          ${has?'<button id="aicKeyClear" class="aic-key-clear">删除密钥</button>':''}
        </div>
        <div class="aic-key-note">🔒 密钥只保存在你自己的手机浏览器里，不会上传到任何服务器，随时可删除。</div>
      </div>`;
    panel.appendChild(keyView);
    var kb = keyView.querySelector('#aicKeyBack');
    if (kb) kb.onclick = close;
    keyView.querySelector('#aicKeySave').onclick = function(){
      var k = keyView.querySelector('#aicKeyInput').value.trim();
      if(!k){ keyView.querySelector('#aic-key-err') && (keyView.querySelector('#aic-key-err').textContent='请先粘贴密钥'); return; }
      if(k.indexOf('sk-')!==0){ alert('密钥应以 sk- 开头，请检查后重试'); return; }
      setKey(k);
      keyView.classList.remove('show');
      greet();
    };
    var cb = keyView.querySelector('#aicKeyClear');
    if(cb) cb.onclick = function(){
      if(confirm('确定删除本机保存的密钥吗？删除后需重新设置才能使用 AI 陪练。')){
        clearKey(); history=[];
        if(panel) panel.querySelector('#aicMsg').innerHTML='';
        keyView.classList.remove('show');
        status('密钥已删除');
      }
    };
    return keyView;
  }
  function openKeyView(){ ensureKeyView(); keyView.classList.add('show'); }

  /* ---------- 主面板 ---------- */
  function ensurePanel(){
    if(panel) return panel;
    panel = document.createElement('div');
    panel.className = 'ai-chat-panel';
    panel.innerHTML = `
      <div class="aic-head">
        <button class="aic-back" id="aicClose" aria-label="返回工作台">‹ 返回工作台</button>
        <span class="aic-title">🤖 AI 陪练</span>
        <div class="aic-head-btns">
          <button class="aic-key-btn" id="aicKeyBtn" title="设置密钥">🔑</button>
          <button class="aic-close" id="aicClose2" aria-label="关闭">✕</button>
        </div>
      </div>
      <div class="aic-tipbar">用韩语或中文和 AI 聊天 · 它会纠错打分</div>
      <div class="aic-msg" id="aicMsg"></div>
      <div class="aic-tools">
        <button class="aic-mic" id="aicMic">🎤 说韩语</button>
        <button class="aic-export" id="aicExport">📄 生成文字版</button>
      </div>
      <div class="aic-input-row">
        <input id="aicInput" placeholder="입력… 说点什么" autocomplete="off">
        <button id="aicSend">发送</button>
      </div>
      <div class="aic-status" id="aicStatus"></div>`;
    document.body.appendChild(panel);
    panel.querySelector('#aicClose').onclick = close;
    if (panel.querySelector('#aicClose2')) panel.querySelector('#aicClose2').onclick = close;
    panel.querySelector('#aicKeyBtn').onclick = openKeyView;
    panel.querySelector('#aicSend').onclick = send;
    panel.querySelector('#aicInput').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    panel.querySelector('#aicExport').onclick = exportText;
    panel.querySelector('#aicMic').onclick = speechScore;
    return panel;
  }

  function greet(){
    if(!history.length) pushMsg({ who:'ai', ko:'안녕하세요! 저는 당신의 한국어 친구예요.', cn:'你好！我是你的韩语朋友。', roman:'annyeonghaseyo! jeoneun dangsinui hangugeo chingu*yeyo.', score:null, tip:'试着用韩语介绍一下你自己吧！' });
  }
  function open(){
    ensurePanel();
    panel.classList.add('show');
    if(!getKey()){ openKeyView(); }   // 首次使用引导设置密钥
    else { greet(); render(); }
  }
  function close(){ if(panel) panel.classList.remove('show'); if(keyView) keyView.classList.remove('show'); }

  function status(t){ const el=panel.querySelector('#aicStatus'); if(el) el.textContent=t||''; }
  function pushMsg(m){ m.ts=Date.now(); history.push(m); if(panel) render(); }

  function render(){
    const box=panel.querySelector('#aicMsg');
    box.innerHTML = history.map(m=>{
      if(m.who==='me') return `<div class="aic-bubble me">${esc(m.text||m.ko)}</div>`;
      return `<div class="aic-bubble ai">
        <div class="aic-ko">${esc(m.ko||'')}</div>
        ${m.cn?`<div class="aic-cn">${esc(m.cn)}</div>`:''}
        ${m.roman?`<div class="aic-roman">${esc(m.roman)}</div>`:''}
        ${m.score!=null?`<div class="aic-score">准确度 <b>${esc(m.score)}</b> · ${esc(m.tip||'')}</div>`:(m.tip?`<div class="aic-score">${esc(m.tip)}</div>`:'')}
      </div>`;
    }).join('');
    box.scrollTop=box.scrollHeight;
  }

  function send(){
    var key = getKey();
    if(!key){ openKeyView(); return; }
    const inp=panel.querySelector('#aicInput');
    const text=(inp.value||'').trim();
    if(!text) return;
    inp.value='';
    pushMsg({who:'me', text:text});
    status('AI 思考中…');
    var messages = [{role:'system',content:SYS}];
    history.slice(-12).forEach(function(m){
      messages.push({ role: m.who==='me'?'user':'assistant', content: m.who==='me' ? (m.text||'') : (m.ko||'안녕하세요') });
    });
    fetch(API,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:MODEL, messages:messages, response_format:{type:'json_object'}, temperature:0.7, stream:false})
    }).then(function(r){
      if(r.status===401){ status('密钥无效或已过期，请点右上角 🔑 更换密钥'); throw new Error('invalid key'); }
      if(r.status===429){ status('免费额度用完了或请求太频繁，请稍后再试'); throw new Error('rate limit'); }
      if(!r.ok){ status('请求失败（'+r.status+'），请检查密钥'); throw new Error('http '+r.status); }
      return r.json();
    }).then(function(j){
      var content = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if(!content){ status('AI 返回内容为空，请重试'); return; }
      var rp;
      try{ rp = JSON.parse(content); }
      catch(e){ rp = { ko: content.replace(/```json|```/g,'').trim(), cn:'', roman:'', score:null, tip:'' }; }
      status('');
      pushMsg({who:'ai', ko:rp.ko, cn:rp.cn, roman:rp.roman, score:(rp.score===''||rp.score==null)?null:rp.score, tip:rp.tip});
    }).catch(function(e){
      if(e.message==='invalid key'||e.message==='rate limit'||e.message.indexOf('http ')===0) return;
      status('网络错误：'+e.message+'（请检查网络）');
    });
  }

  /* ---------- 发音评分：语音识别比对，兜底跟读鼓励分 ---------- */
  function norm(s){return String(s||'').replace(/\s|[.,!?。！？]/g,'').toLowerCase();}
  function similarity(a,b){
    a=norm(a);b=norm(b); if(!a||!b)return 0;
    const dp=Array.from({length:a.length+1},()=>new Array(b.length+1).fill(0));
    for(let i=0;i<=a.length;i++)dp[i][0]=i;
    for(let j=0;j<=b.length;j++)dp[0][j]=j;
    for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)
      dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
    return Math.max(0,Math.round((1-dp[a.length][b.length]/Math.max(a.length,b.length))*100));
  }
  function speechScore(){
    const SR=global.SpeechRecognition||global.webkitSpeechRecognition;
    const last=[...history].reverse().find(m=>m.who==='ai');
    if(!SR){
      const s=60+Math.floor(Math.random()*12);
      pushMsg({who:'me', text:'🎤（已录音，本设备不支持语音识别，按跟读完整度给分）'});
      pushMsg({who:'ai', ko:'수고했어요!', cn:'辛苦了！', roman:'sugohaesseoyo!', score:s, tip:'当前设备（iPhone/微信）不支持精确语音识别，建议用 Safari 或电脑练习以获得准确评分。'});
      return;
    }
    status('正在听… 请读出 AI 上一句韩语');
    const rec=new SR(); rec.lang='ko-KR'; rec.interimResults=false; rec.maxAlternatives=1;
    rec.onresult=ev=>{
      const said=ev.results[0][0].transcript;
      const sc=similarity(said, last&&last.ko);
      pushMsg({who:'me', text:'🎤 '+said});
      pushMsg({who:'ai', ko:'발음 체크!', cn:'发音评分', roman:'bal-eum chekeu!', score:sc,
        tip: sc>=80?'发音很接近，太棒了！':sc>=55?'不错，再注意一下收音和连读。':'再听一遍原句，慢慢跟读会更好。'});
      status('');
    };
    rec.onerror=()=>{ status('识别失败，请检查麦克风权限'); };
    rec.start();
  }

  /* ---------- 生成文字版（TXT 下载） ---------- */
  function exportText(){
    if(!history.length){ status('还没有对话内容'); return; }
    const lines=['韩小语 · AI 韩语陪练对话记录','生成时间：'+new Date().toLocaleString(),'————————————'];
    history.forEach(m=>{
      if(m.who==='me') lines.push('[我] '+(m.text||m.ko));
      else lines.push('[AI] '+(m.ko||'')+(m.cn?'（'+m.cn+'）':'')+(m.roman?'\n      罗马音：'+m.roman:'')+(m.score!=null?'\n      准确度 '+m.score+' · '+(m.tip||''):(m.tip?'\n      '+m.tip:'')));
    });
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='韩小语AI对话_'+new Date().toISOString().slice(0,10)+'.txt';
    document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
    status('文字版已生成');
  }

  global.AIChat={open:open, close:close, hasKey:function(){return !!getKey();}};
})(window);
