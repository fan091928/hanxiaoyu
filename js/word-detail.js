/* ============================================================
   韩小语 · 词根串联精讲 + 单词详情卡片（升级版）
   ------------------------------------------------------------
   1) 词根串联精讲：词根串记 + 主谓宾造句课（大量例句，可朗读）
   2) 单词详情卡片：词典任一单词点开 → 独立卡片，例句/主谓宾/关联词，全部可朗读
   依赖：data-word-detail.js(ROOT_GROUPS/SENTENCE_GUIDE)、word-examples.js(buildExample)
   朗读：window.__speak（app.js 暴露）
   ============================================================ */
(function (global) {
  'use strict';

  var panel = null, detail = null;
  var curGroup = 0, curTab = 'root', expanded = {};

  function esc(s){ return String(s??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function say(text, ev){ if(ev) ev.stopPropagation(); var fn=global.__speak; if(fn&&text){ try{ fn(text, 0.9); }catch(e){} } }
  function groups(){ return (typeof ROOT_GROUPS!=='undefined')?ROOT_GROUPS:[]; }
  function guide(){ return (typeof SENTENCE_GUIDE!=='undefined')?SENTENCE_GUIDE:null; }
  function example(w){ return (typeof buildExample==='function')?buildExample(w):null; }

  /* ============================================================
     一、词根串联精讲面板
     ============================================================ */
  function ensurePanel(){
    if(panel) return panel;
    panel=document.createElement('div');
    panel.className='root-panel';
    panel.innerHTML=`
      <div class="rp-head">
        <button class="rp-back" id="rpBack">‹ 返回词典</button>
        <span class="rp-title">🔗 词根串联精讲</span>
        <button class="rp-close" id="rpClose">✕</button>
      </div>
      <div class="rp-tabs">
        <button class="rp-tab active" data-tab="root">词根串记</button>
        <button class="rp-tab" data-tab="guide">主谓宾造句课</button>
      </div>
      <div class="rp-body" id="rpBody"></div>`;
    document.body.appendChild(panel);
    panel.querySelector('#rpBack').onclick=close;
    panel.querySelector('#rpClose').onclick=close;
    panel.querySelectorAll('.rp-tab').forEach(function(b){
      b.onclick=function(){ curTab=b.dataset.tab; panel.querySelectorAll('.rp-tab').forEach(function(x){x.classList.toggle('active',x===b);}); renderRootPanel(); };
    });
    return panel;
  }
  function open(){
    ensurePanel(); panel.classList.add('show');
    if(!groups().length){ panel.querySelector('#rpBody').innerHTML='<div class="rp-empty">词库加载失败，请刷新重试</div>'; return; }
    renderRootPanel();
  }
  function close(){ if(panel)panel.classList.remove('show'); }

  function renderRootPanel(){ if(curTab==='guide') renderGuide(); else renderRoot(); }

  function partsHtml(parts){
    return (parts||[]).map(function(p,i){
      return (i?'<span class="rp-part-plus">+</span>':'')+
        '<span class="rp-part rp-role-'+p.role+'"><b>'+esc(p.roleCn||p.role)+'</b>'+esc(p.w)+'</span>';
    }).join('');
  }
  function sayBtn(text){ return '<button class="rp-say" data-say="'+esc(text)+'">🔊</button>'; }

  function renderRoot(){
    var gs=groups(), g=gs[curGroup]||gs[0];
    var tabsHtml=gs.map(function(x,i){ return '<button class="rp-rootchip '+(i===curGroup?'active':'')+'" data-i="'+i+'">'+esc(x.root)+'<small>'+esc(x.rootKo)+'</small></button>'; }).join('');
    var wordsHtml=g.words.map(function(w,wi){
      var key=curGroup+'-'+wi, open=!!expanded[key];
      var ex=example(w)||{ko:'',cn:'',parts:[],tip:''};
      var relateHtml=(w.relate||[]).map(function(r){return '<span class="rp-relate">'+esc(r)+'</span>';}).join('');
      return `<div class="rp-word ${open?'open':''}" data-key="${key}">
        <div class="rp-word-head" data-toggle>
          <div class="rp-word-main">
            <div class="rp-ko">${esc(w.ko)} <button class="rp-say" data-say="${esc(w.ko)}">🔊</button></div>
            <div class="rp-roman">${esc(w.roman)}</div>
            <div class="rp-cn">${esc(w.cn)} · ${esc(w.pos||'')}</div>
          </div>
          <span class="rp-expand">${open?'收起':'例句 ▾'}</span>
        </div>
        ${open?`<div class="rp-word-detail">
          <div class="rp-parts-label">📝 例句（点击朗读）</div>
          <div class="rp-example-ko">${esc(ex.ko)} ${sayBtn(ex.ko)}</div>
          <div class="rp-example-cn">${esc(ex.cn)}</div>
          <div class="rp-parts">${partsHtml(ex.parts)}</div>
          ${ex.tip?'<div class="rp-tip">💡 '+esc(ex.tip)+'</div>':''}
          <div class="rp-parts-label" style="margin-top:12px">🔗 关联词</div>
          <div class="rp-relates">${relateHtml}</div>
          <button class="rp-more-detail" data-open-word='${esc(JSON.stringify({ko:w.ko,cn:w.cn,roman:w.roman}))}'>查看完整单词卡 ›</button>
        </div>`:''}
      </div>`;
    }).join('');

    panel.querySelector('#rpBody').innerHTML=`
      <div class="rp-rootchips">${tabsHtml}</div>
      <div class="rp-intro">
        <div class="rp-intro-title"><span class="rp-big-root">${esc(g.root)}</span> ${esc(g.rootKo)} · ${esc(g.meaning)}</div>
        <p class="rp-intro-text">${esc(g.intro)}</p>
        <div class="rp-tip">💡 ${esc(g.tip)}</div>
      </div>
      <div class="rp-section-label">这个词根下的词 · 点开看造句（可朗读）</div>
      <div class="rp-words">${wordsHtml}</div>`;

    panel.querySelectorAll('.rp-rootchip').forEach(function(b){ b.onclick=function(){curGroup=+b.dataset.i;expanded={};renderRoot();}; });
    panel.querySelectorAll('[data-toggle]').forEach(function(h){ h.onclick=function(e){ if(e.target.closest('.rp-say')||e.target.closest('[data-open-word]'))return; var card=h.closest('.rp-word'),k=card.dataset.key; expanded[k]=!expanded[k]; renderRoot(); }; });
    bindPanelSay(panel);
    panel.querySelectorAll('[data-open-word]').forEach(function(el){ el.onclick=function(e){ e.stopPropagation(); try{openWord(JSON.parse(this.dataset.openWord));}catch(err){} }; });
  }

  /* ---------- 造句课（大量例句，全部可朗读） ---------- */
  var GUIDE_EXAMPLES = [
    {ko:'저는 밥을 먹어요.',cn:'我吃饭。',tag:'现在时·主宾谓',parts:[['저는','S','主语'],['밥을','O','宾语'],['먹어요','V','谓语']]},
    {ko:'저는 어제 밥을 먹었어요.',cn:'我昨天吃了饭。',tag:'过去时',parts:[['저는','S','主语'],['어제','T','时间'],['밥을','O','宾语'],['먹었어요','V','谓语']]},
    {ko:'저는 내일 밥을 먹을 거예요.',cn:'我明天要吃饭。',tag:'将来时',parts:[['저는','S','主语'],['내일','T','时间'],['밥을','O','宾语'],['먹을 거예요','V','谓语']]},
    {ko:'학생이 책을 읽어요.',cn:'学生读书。',tag:'主格助词이',parts:[['학생이','S','主语'],['책을','O','宾语'],['읽어요','V','谓语']]},
    {ko:'친구가 음악을 들어요.',cn:'朋友听音乐。',tag:'主格助词가',parts:[['친구가','S','主语'],['음악을','O','宾语'],['들어요','V','谓语']]},
    {ko:'저는 학교에 가요.',cn:'我去学校。',tag:'地点助词에',parts:[['저는','S','主语'],['학교에','L','地点'],['가요','V','谓语']]},
    {ko:'도서관에서 공부해요.',cn:'在图书馆学习。',tag:'地点助词에서',parts:[['도서관에서','L','地点'],['공부해요','V','谓语']]},
    {ko:'저는 커피를 마십니다.',cn:'我喝咖啡。（正式）',tag:'습니다体',parts:[['저는','S','主语'],['커피를','O','宾语'],['마십니다','V','谓语']]},
    {ko:'이거 주세요.',cn:'请给我这个。',tag:'命令·请求',parts:[['이거','O','宾语'],['주세요','V','谓语']]},
    {ko:'영화가 재미있어요?',cn:'电影好看吗？',tag:'疑问句',parts:[['영화가','S','主语'],['재미있어요','V','谓语']]},
    {ko:'날씨가 정말 좋아요!',cn:'天气真好啊！',tag:'感叹句',parts:[['날씨가','S','主语'],['정말','M','修饰'],['좋아요','V','谓语']]},
    {ko:'사과와 바나나를 샀어요.',cn:'买了苹果和香蕉。',tag:'连接助词와',parts:[['사과와','O','宾语'],['바나나를','O','宾语'],['샀어요','V','谓语']]},
    {ko:'저는 한국어를 공부하고 있어요.',cn:'我正在学韩语。',tag:'进行态',parts:[['저는','S','主语'],['한국어를','O','宾语'],['공부하고 있어요','V','谓语']]},
    {ko:'선생님이 설명해 주셨어요.',cn:'老师讲解给我们听。',tag:'敬语·给与',parts:[['선생님이','S','主语'],['설명해 주셨어요','V','谓语']]},
    {ko:'저는 학생이에요.',cn:'我是学生。',tag:'判断句이에요',parts:[['저는','S','主语'],['학생이에요','V','谓语(是)']]},
    {ko:'그분은 의사가 아니에요.',cn:'那位不是医生。',tag:'否定句아니에요',parts:[['그분은','S','主语'],['의사가','C','补语'],['아니에요','V','谓语']]}
  ];

  function renderGuide(){
    var gd=guide();
    var particleHtml=gd?gd.particles.map(function(p){
      return `<div class="rp-guide-card">
        <div class="rp-p-particle">${esc(p.p)} <span>${esc(p.use)}</span> <button class="rp-say" data-say="${esc(p.p)}">🔊</button></div>
        <div class="rp-p-rule">${esc(p.rule)}</div>
        <div class="rp-p-ex">例：${esc(p.ex)}</div>
      </div>`;
    }).join(''):'';
    var roleHtml=gd?gd.roles.map(function(r){
      return `<div class="rp-role-item"><span class="rp-role-badge rp-role-${r.k}">${esc(r.k)}</span><b>${esc(r.name)}</b><span>${esc(r.desc)}</span></div>`;
    }).join(''):'';
    var exHtml=GUIDE_EXAMPLES.map(function(e){
      return `<div class="rp-gex">
        <div class="rp-gex-tag">${esc(e.tag)}</div>
        <div class="rp-gex-ko">${esc(e.ko)} <button class="rp-say" data-say="${esc(e.ko)}">🔊</button></div>
        <div class="rp-gex-cn">${esc(e.cn)}</div>
        <div class="rp-parts">${partsHtml(e.parts.map(function(p){return {w:p[0],role:p[1],roleCn:p[2]};}))}</div>
      </div>`;
    }).join('');
    panel.querySelector('#rpBody').innerHTML=`
      <div class="rp-guide-order">${gd?esc(gd.order):''}</div>
      <div class="rp-section-label">① 认清句子成分</div>
      <div class="rp-roles">${roleHtml}</div>
      <div class="rp-section-label">② 核心助词（给单词贴标签）· 点🔊听</div>
      <div class="rp-guides">${particleHtml}</div>
      <div class="rp-section-label">③ 实战例句（${GUIDE_EXAMPLES.length} 句，逐句可朗读+拆解）</div>
      <div class="rp-gex-list">${exHtml}</div>
      <div class="rp-guide-demo">
        <div class="rp-tip">💡 造句三步：① 先定谓语（句尾，决定时态敬语）→ ② 用助词贴标签找主语宾语 → ③ 补上时间地点。记住韩语是「主+宾+谓」！</div>
      </div>`;
    bindPanelSay(panel);
  }

  function bindPanelSay(root){
    root.querySelectorAll('.rp-say').forEach(function(b){ b.onclick=function(e){ say(b.dataset.say,e); }; });
  }

  /* ============================================================
     二、单词详情卡片（词典任一词点开）
     ============================================================ */
  function ensureDetail(){
    if(detail) return detail;
    detail=document.createElement('div');
    detail.className='wd-overlay';
    detail.innerHTML=`<div class="wd-card" id="wdCard"></div>`;
    detail.addEventListener('click',function(e){ if(e.target===detail) closeWord(); });
    document.body.appendChild(detail);
    return detail;
  }
  function openWord(w){
    if(!w||!w.ko) return;
    ensureDetail();
    var ex=example(w)||{ko:'',cn:'',parts:[],tip:''};
    var posName=posOf(w);
    var card=detail.querySelector('#wdCard');
    card.innerHTML=`
      <div class="wd-top">
        <span class="wd-label">单词详情</span>
        <button class="wd-close" id="wdClose">✕</button>
      </div>
      <div class="wd-hero">
        <div class="wd-word-row">
          <div class="wd-word">${esc(w.ko)}</div>
          <button class="wd-play" id="wdPlay">▶</button>
        </div>
        <div class="wd-roman">${esc(w.roman||'')}</div>
        <div class="wd-meaning">${esc(w.cn||'')}</div>
        <div class="wd-pos">${esc(posName)}</div>
      </div>
      <div class="wd-section">
        <div class="wd-sec-title">📝 例句 <span class="wd-sec-hint">点击朗读</span></div>
        <div class="wd-example">
          <div class="wd-ex-ko">${esc(ex.ko)} <button class="wd-say" data-say="${esc(ex.ko)}">🔊</button></div>
          <div class="wd-ex-cn">${esc(ex.cn)}</div>
        </div>
      </div>
      <div class="wd-section">
        <div class="wd-sec-title">🧩 主谓宾拆解</div>
        <div class="wd-parts">${partsHtml(ex.parts)}</div>
        ${ex.tip?'<div class="wd-tip">💡 '+esc(ex.tip)+'</div>':''}
      </div>
      <div class="wd-section">
        <div class="wd-sec-title">🔗 串联记忆</div>
        <div class="wd-relate">${relateOf(w)}</div>
      </div>
      <button class="wd-speak-all" id="wdSpeakAll">▶ 连读：单词 + 例句</button>`;
    detail.classList.add('show');
    detail.querySelector('#wdClose').onclick=closeWord;
    detail.querySelector('#wdPlay').onclick=function(e){ say(w.ko,e); };
    card.querySelectorAll('.wd-say').forEach(function(b){ b.onclick=function(e){ say(b.dataset.say,e); }; });
    detail.querySelector('#wdSpeakAll').onclick=function(e){ say(w.ko+'. '+ex.ko,e); };
  }
  function closeWord(){ if(detail) detail.classList.remove('show'); }

  function posOf(w){
    if(w.cat==='verb')return'动词'; if(w.cat==='adj')return'形容词';
    if(w.cat==='person')return'名词·人称'; if(w.cat==='food')return'名词·饮食';
    if(w.cat==='place')return'名词·地点'; if(w.cat==='time')return'名词·时间';
    return'名词';
  }
  function relateOf(w){
    var rel=[], gs=groups();
    gs.forEach(function(g){ g.words.forEach(function(x){ if(x.ko!==w.ko && (x.ko.slice(-1)===w.ko.slice(-1) || x.cn===w.cn)) rel.push(x.ko+' '+x.cn); }); });
    if(!rel.length){ rel=[w.ko+' '+w.cn]; }
    return rel.slice(0,5).map(function(r){return '<span class="rp-relate">'+esc(r)+'</span>';}).join('');
  }

  global.WordDetail={ open:open, close:close, openWord:openWord, closeWord:closeWord };
})(window);
