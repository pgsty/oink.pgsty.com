---
title: OINK 是什么
linkTitle: 简介
description: 判断 OINK 是否适合你的项目：它提供什么，与 Docsy 和基于 MDX 的方案有何不同，又有哪些短板。
weight: 10
icon: fa-solid fa-circle-info
search_keywords: [OINK, Hugo 主题, Docsy, 技术文档, 文档站, 本地优先, Markdown 原生, Hugo theme]
cascade:
  categories: [简介]
---

OINK 是一款 [Hugo](https://gohugo.io/) 主题，面向已经超出一份 README 体量的技术文档：产品手册、API 参考、书籍、发布页与博客，常常还要多语言，并且由工程师而不是前端团队来维护。你写 Markdown，运行 `hugo`，得到一个静态站点：侧栏由目录结构自动生成，自带本地全文检索、打印视图，每个页面还有一份供 AI Agent 读取的 Markdown。主题自带全部脚本、字体与样式表，构建不需要 Node.js、npm、Sass 或 CDN；只要你没有接入分析、评论这类集成，主题就不会让读者的浏览器向任何第三方发请求。

OINK 由 [Docsy](https://github.com/google/docsy) fork 而来，保留了 Docsy 的内容模型与多语言行为，外壳、导航、搜索与组件则全部重写。目前已有[七十九个生产站点](/zh/docs/about/showcase/)运行在 OINK 上：48 个独立项目，包括 Apache HugeGraph 的中英双语文档、Red Hat AI Services 的九语言团队门户和 Cortrix 的 AI Agent 记忆文档；另外 31 个来自 PGSTY 与 Vonng 生态，其中最大的一个包含近 5,000 个 Markdown 文件、八种语言，阿拉伯语也在其中。

![OINK 把 Markdown 内容、配置与本地资源汇成一个静态文档站](/images/hero-light.webp)
{width="900" height="600" caption="一次 Hugo 构建，产出可直接托管的静态站点"}

## 你能得到什么 {#what-oink-provides}

- **只靠 Hugo 构建**：任意 edition 的 Hugo 都能构建站点，Go 只在以 Hugo Module 方式下载主题时需要。样式表是纯 CSS，仓库里没有 Sass 编译器、PostCSS 步骤，也没有 `package.json`。具体版本要求见[快速上手](/zh/docs/start/#tools)。
- **组件仍然是 Markdown**：`> [!NOTE]` 是提示块，表格下面加一行 `{.fields}` 是参数表，图片下面加 `{caption="…"}` 就成了带图注的插图。同一份源码在 GitHub 或任何编辑器里依然读作引用、表格和图片。
- **完整的阅读外壳**：侧栏树、目录、面包屑、翻页、`Cmd/Ctrl + K` 命令面板、键盘导航、浅色与深色模式，以及四种视觉预设。
- **不依赖服务的搜索**：Hugo 为每种语言生成一份索引，浏览器里的 BM25 引擎直接检索；不加空格输入的中文、日文、韩文同样能搜到。
- **真正的多语言站点**：沿用 Hugo 原生的翻译模型，界面文案覆盖 32 个语言区域，支持从右到左书写的文字，还可以选择开启双列视图，把页面与译文并排显示。
- **不止于文档**：带图表编号与交叉引用的书籍，由 YAML 生成的发布与下载页，用 22 种分区拼装的落地页，以及由随主题分发的 Swagger UI 与 Redoc 渲染的 OpenAPI 参考。
- **给人看，也给机器读**：整个栏目可以一次打印，任何页面都能以纯 Markdown 阅读，AI Agent 可以从 `llms.txt` 入手。

[特性](/zh/docs/about/features/)逐项介绍这些能力，并链接到对应的指南。

主题的职责止于静态站点。源码可以放在 GitHub、GitLab 或私有 Git 服务器上，Hugo 生成的文件可以部署到任何静态托管平台。内容、品牌以及产品专属的组件归站点自己管理，主题只提供外壳与可复用的部分。

## 适用范围 {#is-oink-for-me}

| 适合 OINK 的情况 | 更适合其它方案的情况 |
| --- | --- |
| 页面多，文档、博客、书、发布页与 API 参考共处一个站点 | 只有一两页、不需要导航；README 或更轻的 Hugo 主题更简单 |
| 要发布完整的多语言译文，而不是给英文站挂一个翻译入口 | 站点主体是应用界面；OINK 可以承载其中的文档，产品组件仍留在站点里 |
| 构建必须可复现，构建机可能完全不能联网 | 需要在正文里嵌入可交互的 React 组件（MDX） |
| 多个站点要共用一套外壳，而不必各自复制布局与 shortcode | 想靠一个开关换成截然不同的外观；四种预设之外的外观调整，要通过 CSS token 与 partial 覆盖完成 |
| 团队里没有前端工程师，也不想维护 Node 工具链 | 需要内容管理后台或所见即所得编辑器 |

另外还有两点值得权衡。第一，多数功能默认关闭，需要配置后才生效，包括搜索、深色模式、图片缩放、评论、反馈，以及 Markdown 与 Agent 输出；[Starter](https://github.com/pgsty/oink-starter) 已经替你打开了常用的那些。第二，OINK 还年轻，迭代很快：1.0.0 发布于 2026 年 8 月，三个月后就到了 1.7.0。每个站点都固定一个确切的版本，你不主动升级就什么都不会变；凡是需要站点配合改动的版本，[升级指南](/zh/docs/admin/upgrade/)里都有对应的章节。

## 与其它文档方案的差别 {#comparison}

常被拿来比较的是 OINK 的上游 Docsy，以及 Docusaurus 这类基于 MDX、运行在 Node 上的方案。通常决定取舍的是下面这几项差别：

| | OINK | Docsy | Docusaurus 等 MDX 方案 |
| --- | --- | --- | --- |
| 构建工具 | 任意 edition 的 Hugo，外加获取主题模块用的 Go | 编译 Sass 用的 Hugo Extended，外加运行 PostCSS 与 Autoprefixer 的 npm | Node.js 与 npm |
| 提示块与标签页 | GitHub 也能渲染的 Markdown：`> [!NOTE]`、带 `{tab="…"}` 的代码围栏 | `alert`、`tabpane` 等 shortcode | MDX，正文中可以嵌入 React 组件 |
| 搜索 | 随主题分发的 BM25 引擎，每种语言一份索引，支持不加空格的中日韩查询 | Lunr 离线搜索，或托管搜索服务 | Algolia DocSearch，或社区提供的本地搜索插件 |
| 字体与脚本 | 随主题分发，从站点自己的域名加载；不使用 jQuery | 默认使用 Google Fonts，可关闭；每个页面加载 jQuery | 脚本由 Node 构建打包 |
| 首页 | 在 `data/home/<lang>.yaml` 中列出各个分区 | 在 Markdown 页面中使用 `blocks/*` shortcode | 一个 React 页面 |
{.wide .expand}

如果你已经在用 Docsy，内容与大部分 front matter 都可以直接沿用，需要删除和转换的东西见[从 Docsy 迁移](/zh/docs/admin/upgrade/#from-docsy)。如果你在 Docsy、Hextra 等 Hugo 主题之间比较，最好用自己的内容树在每个主题上各搭一份再做决定：模板覆盖与语言需求上的差别，功能清单是看不出来的。

OINK 是 fork 之后独立演化的主题，而不是叠在 Docsy 上的一层皮肤；Docsy 的源码历史、Apache-2.0 义务与署名都完整保留，见[开源许可与致谢](/zh/docs/about/license/)。

## 入口 {#start-here}

- [快速上手](/zh/docs/start/) — 克隆 Starter、本地预览，逐步改成自己的站点，再部署上线。
- [组件总览](/zh/docs/components/) — 一个组件一页，先看源码，再看效果。
- [示例站点](/zh/docs/about/showcase/) — 79 个生产站点，以及各自用到了 OINK 的哪些能力。
{.cards}

发现问题或想提交修复，[贡献指南](/zh/docs/about/contributing/)说明了该提交到哪里。当前版本的变化见 [1.7.0 发布说明](/zh/release/1.7.0/)。
