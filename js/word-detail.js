/* ============================================================
   韩小语 · 词根串联精讲模块（新增，不改原词库模块）
   ------------------------------------------------------------
   依赖：data-word-detail.js（ROOT_GROUPS / SENTENCE_GUIDE）
   功能：词根串记 / 例句主谓宾拆解 / 关联词 / 造句教学
   ============================================================ */
(function (global) {
  'use strict';

  var panel = null;
  var curGroup = 0;
  var curTab = 'root';   // root | guide
  var expanded = {};     // 记录展开的词

  function esc(s){ return String(s??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function groups(){ return (typeof ROOT_GROUPS !== 'undefined') ? ROOT_GROUPS : []; }
  function guide(){ return (typeof SENTENCE_GUIDE !== 'undefined') ? SENTENCE_GUIDE : null; }

  function ensurePanel(){
    if(panel) return panel;
    panel = document.createElement('div');
    panel.className = 'root-panel';
    panel.innerHTML = `
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
    panel.querySelector('#rpBack').onclick = close;
    panel.querySelector('#rpClose').onclick = close;
    panel.querySelectorAll('.rp-tab').forEach(function(b){
      b.onclick = function(){
        curTab = b.dataset.tab;
        panel.querySelectorAll('.rp-tab').forEach(function(x){ x.classList.toggle('active', x===b); });
        render();
      };
    });
    return panel;
  }

  function open(){
    ensurePanel();
    panel.classList.add('show');
    if(!groups().length){ panel.querySelector('#rpBody').innerHTML = '<div class="rp-empty">词库加载失败，请刷新重试</div>'; return; }
    render();
  }
  function close(){ if(panel) panel.classList.remove('show'); }

  function render(){
    if(curTab === 'guide') renderGuide();
    else renderRoot();
  }

  /* ---------- 词根串记 ---------- */
  function renderRoot(){
    var gs = groups();
    var g = gs[curGroup] || gs[0];
    var tabsHtml = gs.map(function(x,i){
      return '<button class="rp-rootchip '+(i===curGroup?'active':'')+'" data-i="'+i+'">'+esc(x.root)+'<small>'+esc(x.rootKo)+'</small></button>';
    }).join('');
    var wordsHtml = g.words.map(function(w,wi){
      var key = curGroup+'-'+wi;
      var open = !!expanded[key];
      var partsHtml = (w.example.parts||[]).map(function(p){
        return '<span class="rp-part rp-role-'+p.role+'"><b>'+esc(p.roleCn)+'</b>'+esc(p.w)+'</span>';
      }).join('<span class="rp-part-plus">+</span>');
      var relateHtml = (w.relate||[]).map(function(r){ return '<span class="rp-relate">'+esc(r)+'</span>'; }).join('');
      return `<div class="rp-word ${open?'open':''}" data-key="${key}">
        <div class="rp-word-head">
          <div class="rp-word-main">
            <div class="rp-ko">${esc(w.ko)} <button class="rp-say" data-say="${esc(w.ko)}">🔊</button></div>
            <div class="rp-roman">${esc(w.roman)}</div>
            <div class="rp-cn">${esc(w.cn)} · ${esc(w.pos)}</div>
          </div>
          <span class="rp-expand">${open?'收起':'例句 ▾'}</span>
        </div>
        ${open?`<div class="rp-word-detail">
          <div class="rp-parts-label">📝 例句拆解（主 + 宾/地点 + 谓）</div>
          <div class="rp-example-ko">${esc(w.example.ko)} <button class="rp-say" data-say="${esc(w.example.ko)}">🔊</button></div>
          <div class="rp-example-cn">${esc(w.example.cn)}</div>
          <div class="rp-parts">${partsHtml}</div>
          <div class="rp-parts-label">🔗 关联词</div>
          <div class="rp-relates">${relateHtml}</div>
        </div>`:''}
      </div>`;
    }).join('');

    panel.querySelector('#rpBody').innerHTML = `
      <div class="rp-rootchips">${tabsHtml}</div>
      <div class="rp-intro">
        <div class="rp-intro-title"><span class="rp-big-root">${esc(g.root)}</span> ${esc(g.rootKo)} · ${esc(g.meaning)}</div>
        <p class="rp-intro-text">${esc(g.intro)}</p>
        <div class="rp-tip">💡 ${esc(g.tip)}</div>
      </div>
      <div class="rp-section-label">这个词根下的词 · 点开看造句</div>
      <div class="rp-words">${wordsHtml}</div>`;

    panel.querySelectorAll('.rp-rootchip').forEach(function(b){
      b.onclick = function(){ curGroup = +b.dataset.i; expanded = {}; render(); };
    });
    panel.querySelectorAll('.rp-word-head').forEach(function(h){
      h.onclick = function(){
        var card = h.parentElement, key = card.dataset.key;
        expanded[key] = !expanded[key];
        render();
      };
    });
    bindSay();
  }

  /* ---------- 主谓宾造句课 ---------- */
  function renderGuide(){
    var gd = guide();
    if(!gd){ panel.querySelector('#rpBody').innerHTML = '<div class="rp-empty">内容加载失败</div>'; return; }
    var particleHtml = gd.particles.map(function(p){
      return `<div class="rp-guide-card">
        <div class="rp-p-particle">${esc(p.p)} <span>${esc(p.use)}</span></div>
        <div class="rp-p-rule">${esc(p.rule)}</div>
        <div class="rp-p-ex">例：${esc(p.ex)}</div>
      </div>`;
    }).join('');
    var roleHtml = gd.roles.map(function(r){
      return `<div class="rp-role-item"><span class="rp-role-badge rp-role-${r.k}">${esc(r.k)}</span><b>${esc(r.name)}</b><span>${esc(r.desc)}</span></div>`;
    }).join('');
    panel.querySelector('#rpBody').innerHTML = `
      <div class="rp-guide-order">${esc(gd.order)}</div>
      <div class="rp-section-label">① 认清句子成分</div>
      <div class="rp-roles">${roleHtml}</div>
      <div class="rp-section-label">② 核心助词（给单词贴标签）</div>
      <div class="rp-guides">${particleHtml}</div>
      <div class="rp-guide-demo">
        <div class="rp-section-label">③ 实战拆解</div>
        <div class="rp-demo-ko">저는 학교에서 친구를 만나요.</div>
        <div class="rp-demo-cn">我在学校见朋友。</div>
        <div class="rp-demo-parts">
          <span class="rp-part rp-role-S"><b>主语</b>저는(我)</span>
          <span class="rp-part rp-role-L"><b>地点</b>학교에서(在学校)</span>
          <span class="rp-part rp-role-O"><b>宾语</b>친구를(朋友)</span>
          <span class="rp-part rp-role-V"><b>谓语</b>만나요(见)</span>
        </div>
        <div class="rp-tip">💡 先找谓语定句意，再看助词找主语和宾语，最后补时间地点。动词永远在句尾！</div>
      </div>`;
  }

  function bindSay(){
    if(typeof speak !== 'function' && !(global.speak)){
      $$('.rp-say').forEach(function(b){ b.style.display='none'; });
      return;
    }
    $$('.rp-say').forEach(function(b){
      b.onclick = function(e){
        e.stopPropagation();
        var fn = global.speak || (typeof speak==='function'?speak:null);
        if(fn) fn(b.dataset.say, 1);
      };
    });
  }
  function $$(s){ return Array.prototype.slice.call(panel.querySelectorAll(s)); }

  global.WordDetail = { open:open, close:close };
})(window);
