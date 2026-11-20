/* ============================================================
   韩小语 · 发布者权限控制
   - 发布者（工作台主人）凭密钥解锁「内容管理」，可增删改内容。
   - 访客（通过分享链接进入）只有「学习体验」权限：
     · 可正常学习全部内容、订阅版本更新（链接不变，刷新即新版）
     · 可编辑「自己的」个人数据（头像/昵称/打卡/收藏/备份）
     · 无法进入内容管理，无法改动全站共享内容。
   说明：纯静态 H5 无服务端，权限为前端逻辑锁；内容改动保存在本地，
         发布者改好后可导出「发布配置码」，由发布者回填到源文件后重新发布，
         所有访客刷新即可看到更新（访客永远不能自行改动内容）。
   ============================================================ */
(function (global) {
  'use strict';

  // 发布者密钥验证：源码只存「加盐 SHA-256」，绝不出现明文密钥。
  // 即使有人（或 AI）查看网页源码，也只能看到哈希值，无法还原密钥。
  var SALT = 'hxy::v2::salt::2026';
  var SECRET_HASH = 'dace5dfe66742d28549fc4cfd62b29708e81988e50670493d20df53564c4a48e';
  var FLAG = 'hxy_publisher_auth';   // localStorage 授权标记

  function sha256Hex(str) {
    // Web Crypto（https 安全上下文可用；微信 web-view / 部署域名均为 https）
    if (!(global.crypto && global.crypto.subtle && global.crypto.subtle.digest)) {
      return Promise.resolve(null);
    }
    var data = new TextEncoder().encode(str);
    return global.crypto.subtle.digest('SHA-256', data).then(function (buf) {
      var arr = new Uint8Array(buf), out = '', i, ch;
      for (i = 0; i < arr.length; i++) {
        ch = arr[i].toString(16);
        out += ch.length === 1 ? '0' + ch : ch;
      }
      return out;
    });
  }

  function readFlag() {
    try { return localStorage.getItem(FLAG) === SECRET_HASH; } catch (e) { return false; }
  }
  // 异步校验：返回 Promise<boolean>
  function authorize(input) {
    var v = (input || '').trim();
    if (!v) return Promise.resolve(false);
    return sha256Hex(SALT + v).then(function (hex) {
      if (!hex || hex !== SECRET_HASH) return false;
      try { localStorage.setItem(FLAG, SECRET_HASH); } catch (e) {}
      return true;
    }).catch(function () { return false; });
  }
  function revoke() {
    try { localStorage.removeItem(FLAG); } catch (e) {}
  }
  function isPublisher() {
    // 授权标记 + 当前网址为主发布域名（分享链接的 query 不影响）
    return readFlag();
  }

  global.Publisher = {
    isPublisher: isPublisher,
    authorize: authorize,
    revoke: revoke,
    secretHint: '密钥由工作台创建者设置',
    // 发布配置：发布者自定义内容（自定义金句/每日一句），存本地，可导出给用户回填
    CFG_KEY: 'hxy_publisher_config',
    getConfig: function () {
      try { return JSON.parse(localStorage.getItem(this.CFG_KEY) || '{}'); } catch (e) { return {}; }
    },
    saveConfig: function (cfg) {
      try { localStorage.setItem(this.CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
    },
    exportConfig: function () {
      var cfg = this.getConfig();
      return 'HXYCFG1:' + btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
    },
    importConfig: function (code) {
      try {
        var raw = decodeURIComponent(escape(atob(code.replace(/^HXYCFG1:/, ''))));
        var cfg = JSON.parse(raw);
        this.saveConfig(cfg);
        return cfg;
      } catch (e) { return null; }
    }
  };
})(window);
