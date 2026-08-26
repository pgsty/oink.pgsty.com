---
title: 亮点特性
linkTitle: 亮点特性
description: 逐条列出 OINK 与普通 Hugo 主题的差别，每条链接到讲它的指南页。
weight: 10
search_keywords: [特性, Features, 亮点, Markdown 原生组件, 本地优先, 四态输出, 双语, 命令面板, 键盘导航, llms.txt]
aliases:
  - /docs/about/local-first/
---

本页逐条列出 OINK 与普通 Hugo 主题的差别，每条末尾给出讲它的指南页。要立即安装，见[十分钟上手](/zh/docs/start/)。

## 组件写在 Markdown 里 {#native-components}

提示块是 `> [!NOTE]` 块引用（十种语义类型加一个中性折叠块），参数表是表格加一行 `{.fields}`，步骤与卡片是列表加 `{.steps}` / `{.cards}`，图注是图片下面一行 `{caption="…"}`。标签页是几个相邻围栏各带一个 `{tab="…"}`；文件树、画廊、Mermaid、ECharts 是以语言命名的数据围栏。这些写法在 GitHub 或普通 Markdown 阅读器中退化为块引用、表格、列表与代码块，内容不丢失。

29 个 shortcode 覆盖原生形态表达不了的场景：卡片带图标与图片、参数表条目正文是多段 Markdown。

→ [组件总览](/zh/docs/components/)

## 只要一个 Hugo 二进制 {#hugo-only}

消费站点的全部构建依赖是 Hugo Extended 0.160.1 或更新版本。SCSS 由 Hugo 内置的 Sass 转译器编译，主题不调用 `postCSS`；没有 npm、没有 webpack、没有构建期下载。用 Hugo Module 方式安装主题时需要本机有 Go 来解析模块，用离线归档或 submodule 则不需要。

「仅依赖 Hugo」指的是构建依赖。界面交互仍在浏览器中执行 JavaScript：搜索、命令面板、图表、标签页都是页面脚本，区别在于这些脚本随主题分发、按页面用到的功能下发。

→ [十分钟上手](/zh/docs/start/)

## 本地优先 {#local-first}

浏览器需要的资源全部提交在主题仓库里：Bootstrap、Font Awesome、四款字体、Lunr、Mermaid、KaTeX、Markmap、Swagger UI、Redoc、Asciinema、ECharts、Infographic。`VENDOR.json` 逐项记录 26 个依赖的版本、来源、许可证文件与 SHA-256 校验值，更新某个运行时要同时更新产物、许可证与校验值。

对可能引起网络请求的功能，主题让它保持关闭而不是静默连出去：PlantUML 缺 `params.plantuml.svg_image_url`、Diagrams.net 缺 `params.drawio.drawio_server`、Algolia 缺 `appId` / `apiKey` / `indexName`，都会告警并保持禁用；带 `--panicOnWarning` 的发布关卡会把这条告警变成失败。

本地优先不覆盖作者自己添加的内容。以下都是显式的网络选择：外部链接、远程图片与视频、iframe、远程 API 规范；Algolia、Google 自定义搜索这类托管搜索；分析、评论与其它 SaaS 集成；作者主动配置远程渲染器的 PlantUML 与 Diagrams.net。用到它们的页面仍然是有效页面，但站点不应再宣称这些页面可以完全离线使用。

→ [开源许可与致谢](/zh/docs/about/license/) · [配置总览](/zh/docs/customize/config/)

## 一份内容，四种输出 {#four-outputs}

每个组件在四种输出下都有确定的形态：交互式 HTML；去掉缩放与复制控件、折叠块完全展开的打印页；纯 Markdown；RSS。打印视图按栏目整份生成（本栏目是 `/zh/_print/docs/about/`），Markdown 版本是同一页面地址加 `index.md`。

站点在 `outputs` 里显式选择需要哪几种，主题不替站点决定。

→ [打印支持](/zh/docs/customize/print/) · [Agent 支持](/zh/docs/customize/agents/)

## 双语与 32 个界面语言 {#multilingual}

多语言走 Hugo 原生机制：译文路由、按权重排序的语言选择器、缺译回退、RTL、以及 canonical 与 alternate 元数据。界面文案有 32 个语言包，共用同一套 key；英语、简体中文（`zh-cn` 与通用 `zh`）与繁体中文（`zh-tw`）经过人工审校，其余语言保留 Docsy 继承下来的翻译，OINK 新增的键先用英文兜底。

→ [多语言](/zh/docs/customize/i18n/)

## 全文检索不出站 {#search}

打开 `params.offline_search` 后，Hugo 为每种语言生成一份索引，浏览器用本地 Lunr 检索拉丁文字、用子串回退检索中日韩文本，查询内容不发给任何第三方。页面可以用 `search_boost` 调权重、用 `search_keywords` 补同义词。

→ [全文检索](/zh/docs/customize/search/)

## 命令面板 {#command-palette}

`Cmd/Ctrl + K` 打开命令面板；裸按 `/` 进入搜索态，裸按 `\` 进入纯命令态。面板里同时有页面、命令与页面动作（切换语言、切换主题、复制 Markdown 等），搜索与操作共用一个入口。

→ [命令面板](/zh/docs/customize/panel/)

## 键盘导航 {#keyboard}

默认开启，可按站点或按栏目关闭。`w` `s` 在侧栏树上下移动，`a` `d` 折叠展开，`q` `e` 上一篇下一篇，`j` `k` 沿页面目录跳转，`t` 切换深浅色，`l` 切换语言，`h` 隐藏阅读外壳。输入框、文本域获得焦点或输入法处于组字状态时，单键快捷键全部让行。页脚最底层栏的问号按钮打开速查卡。

→ [键盘导航](/zh/docs/customize/keyboard/)

## 文档之外的四种内容 {#content-types}

主题还内置四类需要额外结构的页面：

- 书籍：章节编号，图 / 表 / 式 / 例用 `{#id num=}` 编号、用 `xref` 交叉引用，`book-toc`、`book-figures` 一类 shortcode 生成索引，整本可打印。
- 发布与下载页：`data/download/*.yaml` 生成发布卡片、资产表与校验和，发布状态可控。
- Landing 首页：`data/home/<lang>.yaml` 拼装首页分区；任意页面加 `layout: landing` 也能用 `data/landing/` 的数据。
- API 文档：Swagger UI 与 Redoc 都是本地运行时，spec 放站内即可。

→ [书籍出版](/zh/docs/write/book/) · [发布与下载页](/zh/docs/write/releases/) · [首页与落地页](/zh/docs/customize/home/) · [API 文档](/zh/docs/write/openapi/)

## 面向 AI 助手的输出 {#agent-output}
`outputs` 里加上 `markdown`，每个页面就多一份 `.md`，HTML 的 `<head>` 里带 `rel="alternate"` 指过去，页面动作里也多出「复制 Markdown」与「查看源码」。`LLMS` 输出格式在站点根目录生成 `llms.txt` 内容清单（本站是 <https://oink.pgsty.com/zh/llms.txt>）。

「在 ChatGPT / Claude 中打开」默认关闭：读者点击时会把当前 URL 交给第三方，需要站点显式打开 `params.ui.page_context_menu.assistant_links`。

→ [Agent 支持](/zh/docs/customize/agents/)

## 多版本 {#versions}

配置 `params.versions` 后顶栏出现版本菜单，旧版本站点顶部显示归档横幅，提示读者查看最新版本；菜单是否逐页跳转由站点决定。多个版本是分别构建、分别部署的静态站点，不需要运行时支持。

→ [多版本](/zh/docs/customize/versions/)

## 自己验证 {#verify}

本站启用了上面多数特性，三条自查：

1. 在任意页面按 `Cmd/Ctrl + K`，输入 `postgres` 查看本地搜索结果；按 `\` 进入纯命令态。
2. 在当前页面地址后加 `index.md`，得到这一页的 Markdown 版本。
3. 打开 <https://oink.pgsty.com/zh/llms.txt>，那是给 AI 助手的站点清单。

## 相关 {#related}

- [OINK 是什么](/zh/docs/about/) — 定位、适用场景与对比
- [示例站点](/zh/docs/about/showcase/) — 这些特性在生产站点里怎么用
- [十分钟上手](/zh/docs/start/) — 从克隆到上线
- [配置总览](/zh/docs/customize/config/) — 上面提到的参数在哪查
