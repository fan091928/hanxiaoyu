/* ============================================================
   韩小语 · 数据安全存储层
   目标：无论版本如何更新、网址如何变化，用户学习数据都不丢失
   策略：
     1) localStorage 多副本冗余（主 + 备份 + 迁移快照）
     2) IndexedDB 持久化备份（容量大、不易被浏览器清理）
     3) 导出/导入备份码（跨设备、跨域名、换网址终极恢复手段）
     4) 版本升级深度合并（新增字段补默认值，历史数据全保留）
     5) 后台自动保存（定时 + 页面隐藏/关闭前强制保存）
   ============================================================ */
(function (global) {
  'use strict';

  var PRIMARY = 'hanxiaoyu_v1';
  var BACKUP = 'hanxiaoyu_v1_backup';
  var SNAPSHOT = 'hanxiaoyu_v1_snapshot';
  var DB_NAME = 'hanxiaoyu_db';
  var DB_STORE = 'userdata';
  var VERSION = 8;
  var savedAt = 0;

  /* ---------- 深度合并：保留所有旧字段，仅补默认值 ---------- */
  function deepMerge(def, saved) {
    if (saved === null || saved === undefined) return def;
    if (Array.isArray(def)) return Array.isArray(saved) ? saved : def;
    if (typeof def === 'object' && typeof saved === 'object') {
      var out = {}, k;
      for (k in def) if (Object.prototype.hasOwnProperty.call(def, k)) out[k] = def[k];
      // 保留 saved 中的所有字段（含未来新版本字段），递归合并已知字段
      for (k in saved) if (Object.prototype.hasOwnProperty.call(saved, k)) {
        out[k] = (k in def) ? deepMerge(def[k], saved[k]) : saved[k];
      }
      return out;
    }
    return saved;
  }

  /* ---------- localStorage 安全读写 ---------- */
  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function lsSet(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); return true; } catch (e) { return false; }
  }

  /* ---------- IndexedDB 备份 ---------- */
  var db = null;
  function openDB(cb) {
    try {
      if (!global.indexedDB) { cb(null); return; }
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(DB_STORE)) d.createObjectStore(DB_STORE);
      };
      req.onsuccess = function (e) { db = e.target.result; cb(db); };
      req.onerror = function () { cb(null); };
    } catch (e) { cb(null); }
  }
  function dbSave(obj) {
    if (!db) { openDB(function (d) { if (d) dbWrite(d, obj); }); return; }
    dbWrite(db, obj);
  }
  function dbWrite(d, obj) {
    try {
      var tx = d.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(obj, 'latest');
    } catch (e) {}
  }
  function dbLoad(cb) {
    openDB(function (d) {
      if (!d) { cb(null); return; }
      try {
        var req = d.transaction(DB_STORE, 'readonly').objectStore(DB_STORE).get('latest');
        req.onsuccess = function () { cb(req.result || null); };
        req.onerror = function () { cb(null); };
      } catch (e) { cb(null); }
    });
  }

  /* ---------- 备份码（Base64，支持 Unicode） ---------- */
  function encodeCode(obj) {
    var json = JSON.stringify({ v: VERSION, t: Date.now(), d: obj });
    var bytes = new TextEncoder().encode(json);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function decodeCode(code) {
    try {
      var bin = atob(String(code).trim());
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var obj = JSON.parse(new TextDecoder().decode(bytes));
      if (obj && obj.d && typeof obj.d === 'object') return obj.d;
    } catch (e) {}
    return null;
  }

  /* ---------- 对外 API ---------- */
  var memory = null;

  var Store = {
    VERSION: VERSION,

    // 启动加载：合并默认值 + 多副本择优 db > 主 > 备份 > 快照
    load: function (defaultState) {
      var def = defaultState();
      var candidates = [
        lsGet(PRIMARY), lsGet(BACKUP), lsGet(SNAPSHOT)
      ].filter(Boolean);
      // 选择 savedAt 最新的一份
      candidates.sort(function (a, b) { return (b.__savedAt || 0) - (a.__savedAt || 0); });
      var best = candidates[0] || null;
      memory = best ? deepMerge(def, best) : def;
      // 同步回写所有副本，防止单点损坏
      Store.save(memory, true);
      // 异步用 IndexedDB 中可能更新的数据再次校正
      dbLoad(function (dbData) {
        if (dbData && (dbData.__savedAt || 0) > (memory.__savedAt || 0)) {
          memory = deepMerge(def, dbData);
          Store.save(memory, true);
          if (global.__onDataRestored) global.__onDataRestored('已从本地备份恢复最新数据');
        }
      });
      return memory;
    },

    // 保存：三份 localStorage + IndexedDB
    save: function (data, silent) {
      if (!data) return;
      memory = data;
      savedAt = Date.now();
      try { data.__savedAt = savedAt; data.__version = VERSION; } catch (e) {}
      var ok = lsSet(PRIMARY, data);
      if (!ok) { // 主存储写入失败（容量满），清理旧快照再试
        try { localStorage.removeItem(SNAPSHOT); } catch (e) {}
        lsSet(PRIMARY, data);
      }
      lsSet(BACKUP, data);
      lsSet(SNAPSHOT, data);
      dbSave(JSON.parse(JSON.stringify(data)));
      if (!silent && global.__onAutoSaved) global.__onAutoSaved(savedAt);
      return savedAt;
    },

    get: function () { return memory; },

    // 导出备份码
    exportCode: function () { return encodeCode(memory || {}); },

    // 导入备份码，返回合并后的数据
    importCode: function (code, defaultState) {
      var d = decodeCode(code);
      if (!d) return null;
      memory = deepMerge(defaultState ? defaultState() : {}, d);
      Store.save(memory, true);
      return memory;
    },

    // 导出为文件下载
    exportFile: function (filename) {
      var data = JSON.stringify({ app: '韩小语', v: VERSION, t: Date.now(), data: memory }, null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || ('韩小语备份_' + new Date().toISOString().slice(0, 10) + '.json');
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },

    // 后台自动保存：定时 + 页面隐藏/关闭前强制保存
    startAutoSave: function (getLatest) {
      var timer = setInterval(function () {
        var cur = getLatest ? getLatest() : memory;
        if (cur) Store.save(cur, true);
      }, 15000); // 每 15 秒自动保存
      function flush() {
        var cur = getLatest ? getLatest() : memory;
        if (cur) Store.save(cur, true);
      }
      document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });
      global.addEventListener('pagehide', flush);
      global.addEventListener('beforeunload', flush);
      return timer;
    },

    lastSaved: function () { return savedAt; }
  };

  global.Store = Store;
})(window);
