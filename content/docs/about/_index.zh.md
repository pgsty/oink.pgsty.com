---
title: OINK 是什么
linkTitle: 简介
description: 一套从 Docsy 演化而来的本地优先 Hugo 文档框架：组件在 Markdown 中仍然可读，资源随主题分发，十五个生产站点持续验证它。
weight: 10
icon: fa-solid fa-circle-info
search_keywords: [OINK, Hugo 主题, Docsy, 技术文档, 文档站, 本地优先, Markdown 原生, Hugo theme]
cascade:
  categories: [简介]
aliases:
  - /docs/about/contributing/
---

OINK 是一款独立的 [Hugo](https://gohugo.io/) 主题，用于搭建中大型技术文档站。它从 [Docsy](https://github.com/google/docsy) 演化而来：保留 Docsy 的内容模型与多语言行为，替换外壳、导航、搜索与内容组件。

消费站点的构建依赖只有一个 Hugo Extended 二进制，不需要 Node.js、npm 或 PostCSS，也不请求 CDN。Bootstrap、Font Awesome、字体、本地搜索、图表与 API 文档运行时都提交在主题仓库里，只在页面用到时下发。

组件不是另一套模板语言：`> [!NOTE]` 是提示块，表格加一行 `{.fields}` 是参数表，图片下面加 `{caption=}` 就有图注。当前有[十五个生产站点](/zh/docs/about/showcase/)在用它，本站是其中之一。

![OINK 把 Markdown 内容、配置与本地资源汇成一个静态文档站](/images/hero-light.webp)
{width="900" height="600" caption="一次 Hugo 构建，产出可直接托管的静态站点"}

## 主题的职责 {#what-oink-provides}
- 文档与博客外壳：导航、侧栏树、目录、面包屑、翻页、深色模式、打印视图与无障碍交互。
- 多语言框架：译文路由、缺译回退、语言权重、RTL，以及 32 份完整界面语言包。
- 本地运行时：Mermaid、KaTeX、Markmap、Swagger UI、Redoc、Asciinema、ECharts、Infographic 与本地全文检索。
- 内容组件：提示块、标签页、步骤、卡片、参数表、文件树、画廊、徽章、按键等，多数有 Markdown 原生形态。
- 内容类型：普通文档之外，还内置书籍编号与交叉引用、发布与下载页、数据驱动的 Landing 首页、OpenAPI 文档页。

主题不负责源码托管与部署：站点可以放在 GitHub、GitLab 或私有 Git 上，Hugo 生成的静态文件可用任何托管平台发布。站点自己的内容、品牌与业务组件仍归站点管理，主题只提供通用外壳与可复用组件。

## 适用范围 {#is-oink-for-me}
| 这些情况适合 | 这些情况不适合 |
| --- | --- |
| 页面多、内容类型杂：文档、博客、书、发布页与 API 参考共处一个站点 | 只有一两页内容、不需要结构化导航；README 或更轻的 Hugo 主题更简单 |
| 需要完整的多语言，而不是给英文站挂一个翻译入口 | 站点主体是应用界面而不是文档：可以用 OINK 承载文档部分，业务组件留在站点层 |
| 对可复现构建与网络隔离有要求，构建机不能出网 | 需要在正文里写交互组件（React / MDX） |
| 多个站点共享同一套外壳，不必复制布局与 shortcode | 想用一个开关换成另一套视觉：主题没有品牌开关，改外观要走 CSS token 与 partial 覆盖 |
| 团队没有前端，也不维护 Node 工具链 | 需要主题内置内容管理后台或所见即所得编辑器 |

## 与其它文档方案的差别 {#comparison}

下表只列结构性差别，且只写能从各项目自身文档与仓库确认的部分。各项目的版本会变动，选型前以其当前文档为准。

| 维度 | OINK | Docsy | Hextra | Docusaurus |
| --- | --- | --- | --- | --- |
| 构建工具 | Hugo Extended，单个二进制 | Hugo Extended + Node/npm | Hugo | Node.js 工具链 |
| 消费站点要不要 npm | 不要 | 要：Bootstrap 与 Font Awesome 从 `node_modules/` 挂载 | 不要 | 要 |
| 前端资源从哪来 | 全部提交在主题仓库，`VENDOR.json` 记录版本、来源、许可与校验值 | 每页无条件加载 CDN 上的 jQuery；Mermaid、KaTeX 等还会在构建期请求 CDN | 预编译产物提交在仓库 | npm 依赖 |
| 组件写法 | Markdown 原生属性与围栏为主，29 个 shortcode 兜底 | shortcode（19 个） | shortcode（29 个）为主，提示块有 `> [!NOTE]` 原生形态 | MDX（React 组件） |
| 多语言 | Hugo 多语言 + 32 份完整界面语言包 | Hugo 多语言 + 31 个界面 locale 文件 | Hugo 多语言 + 21 个界面语言包 | 内置 i18n 框架 |
| 书籍编号与交叉引用 / 发布下载页 / 数据驱动落地页 | 主题内置 | 无 | 无 | 需自建或找插件 |

两点补充。每页 Markdown 输出与 `llms.txt` 不是 OINK 独有的能力，Docsy 与 Hextra 也有，三者都要站点在 `outputs` 里显式打开。表格最后一行的三项只有 OINK 内置，它们来自 PGSTY 自己的生产站点，不是通用文档站的必需品。主题的交互功能默认关闭，搜索、缩放、评论与反馈都要站点显式打开。

OINK 不是叠在 Docsy 上的皮肤，而是 fork 之后独立演化的主题。Docsy 的源码历史、Apache-2.0 义务与署名完整保留，细节见[开源许可与致谢](/zh/docs/about/license/)。

## 入口 {#start-here}
- [快速上手](/zh/docs/start/) — 使用官方 Starter，分层定制，再发布上线。
- [组件总览](/zh/docs/components/) — 一个组件一页，先源码后效果。
- [示例站点](/zh/docs/about/showcase/) — 十五个生产站点，各自用了 OINK 的哪部分。
{.cards}

[亮点特性](/zh/docs/about/features/)按能力逐条列出主题提供的东西，每条链接到讲它的指南页。
