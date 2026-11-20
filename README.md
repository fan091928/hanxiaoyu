# 韩小语 · 韩语学习工作台

淡紫色波点蝴蝶结风格的韩语学习 H5，适配 iPhone 与微信小程序 web-view。功能包含打卡、TOPIK 词典、四十音、练习默写、语法、听力、闯关、韩剧台词、敬语平语、每日一句、K-pop 歌词跟唱等。

## 本地预览

这是一个纯静态站点，无需构建。用任意静态服务器打开即可：

```bash
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 部署到 GitHub Pages（自动）

本仓库已配置 `.github/workflows/deploy.yml`，推送代码后会自动部署。

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**
2. 把代码 push 到 `main` 分支
3. 等 Actions 跑完，访问链接：`https://<你的用户名>.github.io/<仓库名>/`

> 音频文件较大（约 48MB / 60 首），首次 push 会慢一些，属正常现象。

## 数据与存储

- 学习数据默认保存在浏览器本地（localStorage + IndexedDB），多副本冗余，支持导出/导入备份。
- 应用内已预留云同步接口（`js/cloud-config.js`、`js/cloud-sync.js`），填写云开发环境 ID 后可启用多设备同步。

## 目录结构

```
├── index.html          主页面
├── css/style.css       样式
├── js/                 逻辑与数据
├── audio/kpop/         K-pop 歌曲片段（60 首）
├── quotes.json         每日一句 / 金句（可更新）
└── .github/workflows/   自动部署配置
```
