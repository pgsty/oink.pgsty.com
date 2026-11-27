---
title: 特性
linkTitle: 特性
description: 逐项查看 OINK 在普通 Hugo 主题之上增加了什么、用哪个配置打开，以及去哪篇指南了解详情。
weight: 10
search_keywords: [特性, Features, 亮点, Markdown 原生组件, 本地优先, 四态输出, 双语, 命令面板, 键盘导航, llms.txt]
aliases:
  - /docs/about/local-first/
---

下面这些能力都随主题提供。有的只要页面用到就会生效，其余的只差一个配置项，每节都写明了这个配置项以及讲解它的指南。如果还在判断 OINK 是否适合你的项目，先读 [OINK 是什么](/zh/docs/about/)。

## 组件写在 Markdown 里 {#native-components}

多数组件就是普通 Markdown 加一行属性，源码在 GitHub 和任何编辑器里都照样可读。提示块是 `> [!NOTE]` 块引用，有十种语义类型和一个中性折叠块；参数表是表格下面加一行 `{.fields}`；步骤与卡片是列表加 `{.steps}` 或 `{.cards}`；图注是图片下面一行 `{caption="…"}`。标签页是几个相邻的代码围栏，各带一个 `{tab="…"}` 属性；文件树、画廊、Mermaid、ECharts 则是以数据语言命名的围栏。离开 OINK，这些写法会退化为块引用、表格、列表与代码块，内容一点不丢。

原生 Markdown 表达不了的场景，比如带图标与图片的卡片、正文长达几段的参数条目，交给 30 个 shortcode。

→ [组件总览](/zh/docs/components/)

## 用 Hugo 构建 {#hugo-only}

任意 edition 的 Hugo 都能构建站点，构建过程中不运行其它任何工具。主题的样式表是由 Hugo 拼接的纯 CSS，没有 Sass、PostCSS、npm 或 webpack 步骤。Go 只在以 Hugo Module 方式获取主题时需要，模块可以来自网络，也可以来自本地模块缓存；改用离线归档或 Git submodule 后，只有 Hugo 也能完成构建。

在浏览器里，搜索、命令面板、图表与标签页都以 JavaScript 运行。这些脚本随主题分发，每个页面只加载其内容用到的那几个。

→ [快速上手](/zh/docs/start/)

## 本地优先 {#local-first}

浏览器需要的一切都提交在主题仓库里：Bootstrap 样式、Font Awesome、四款字体、Mermaid、KaTeX、Markmap、Swagger UI、Redoc、Asciinema、ECharts、Infographic、本地 PlantUML 引擎等。`VENDOR.json` 逐项记录它们的版本、来源、许可证文件与 SHA-256 校验值，站点实际下发了什么，一查便知。

凡是可能连接其它服务器的功能，配置完整之前都保持关闭。PlantUML 默认在浏览器内渲染，除非设置了 `params.plantuml.svg_image_url`。Diagrams.net 需要 `params.drawio.drawio_server`，Algolia 需要 `appId`、`apiKey` 与 `indexName`；缺少任何一项，构建时都会告警并保持关闭，而不会退回到某个公共服务。交互地图同样要等你在 `params.map` 里指定瓦片服务；视频卡片只有在站点把平台列入 `params.video_embeds`、并且读者点击之后，才会连接该平台。

本地优先管的是主题本身，不包括作者自己添加的内容。外部链接、远程图片与视频、iframe、远程 API 规范；Algolia、Google 自定义搜索这类托管搜索；分析、评论与其它 SaaS 集成；以及远程 PlantUML 或 Diagrams.net 渲染器，都是你主动做出的联网选择，用到它们的页面在阅读时需要访问网络。

→ [开源许可与致谢](/zh/docs/about/license/) · [配置总览](/zh/docs/customize/config/)

## 一份内容，四种输出 {#four-outputs}

每个组件在四种输出里都有确定的形态，页面无论出现在哪里都能正确阅读：交互式 HTML；去掉缩放与复制控件、所有折叠块全部展开的打印视图；纯 Markdown；RSS。打印视图按栏目整份生成（本栏目是 `/zh/_print/docs/about/`），页面的 Markdown 版本就是页面地址加 `index.md`。

站点在 `outputs` 里列出要发布的输出，主题不会自行添加。

→ [打印支持](/zh/docs/customize/print/) · [Agent 支持](/zh/docs/customize/agents/)

## 多语言站点与 32 个界面语言 {#multilingual}

OINK 沿用 Hugo 原生的多语言模型：译文路由、按权重排序的语言选择器、缺译回退、从右到左书写的文字，以及供搜索引擎使用的 canonical 与 alternate 链接。界面文案有 32 份语言包，键完全一致，覆盖 Docsy 支持的全部 31 个 locale 文件名，再加通用的 `zh`。每份语言包都由目标语言写成，没有英文占位；`zh` 与 `zh-cn` 是简体中文，`zh-tw` 是繁体中文。开启 `params.ui.compare: true` 后，读者可以在当前页面旁打开已有译文，两个版本同步滚动。

→ [多语言](/zh/docs/customize/i18n/) · [双列视图](/zh/docs/customize/i18n/#bilingual-view)

## 全文检索不出站 {#search}

打开 `params.offline_search`，Hugo 就为每种语言生成一份搜索索引，由浏览器里的扫描式 BM25 引擎检索，不依赖 Lunr，也不依赖任何外部服务。它能匹配经过 Porter 词干还原并带拼写纠错的英文单词、代码标识符与符号串，以及不加空格输入的中文、日文、韩文查询（按重叠的二字组匹配）。超过 2 MiB 的索引会把正文拆到单独的文件里分阶段加载；搜索参数名可以直接打开参数表中的对应条目。页面可以用 `search_boost` 提高排名，用 `search_keywords` 补充同义词。

→ [全文检索](/zh/docs/customize/search/)

## 命令面板 {#command-palette}

`Cmd/Ctrl + K` 打开一个输入框，里面同时有页面、命令与页面动作，例如切换语言、切换主题、把页面复制为 Markdown，查找与操作共用一个入口。裸按 `/` 直接进入搜索；查询以 `>` 开头时只列出命令。

→ [命令面板](/zh/docs/customize/panel/)

## 键盘导航 {#keyboard}

三十个单键快捷键默认开启，导航、操作与样式各十个，可以按站点、栏目或单个页面关闭。`w` `s` 在侧栏树中上下移动，`a` `d` 折叠与展开，`q` `e` 跳到上一篇与下一篇，`k` `j` 跳到上一个与下一个标题，`h` 列出最近读过的页面，`g` 回到首页。其它按键用来搜索、编辑或打印页面，把页面交给 ChatGPT、Claude 或 Gemini，一次展开或折叠全部内容，切换视觉预设、明暗模式与语言，打开双列视图，切换禅意模式，以及加宽或收窄正文栏。在文本框中输入或输入法正在组字时，所有快捷键都会让行。按 `'` 或点击页脚的问号按钮，即可分三栏看到全部三十个快捷键，当前页面用不上的键会变暗显示。

→ [键盘导航](/zh/docs/customize/keyboard/)

## 反向链接 {#backlinks}

打开 `params.ui.backlinks` 后，每个页面都会列出链接到它的页面。列表在构建时从你本来就写的普通链接中得出，没有新语法，也不需要 JavaScript。它显示在右栏的「反链」组里，超过八条会折叠；本站已经开启，看本页右侧即可。

→ [反向链接](/zh/docs/customize/navigation/#backlinks)

## 文档之外的四种内容 {#content-types}

有四类页面需要比普通文档更多的结构，主题都已内置：

- 书籍：章节自动编号；`{#id num=}` 为图、表、公式与示例编号，`xref` 做交叉引用，`book-toc`、`book-figures` 等 shortcode 生成索引，整本书可以作为一份文档打印。
- 发布与下载页：由 `data/download/*.yaml` 生成发布卡片、资产表与校验和，发布与否由数据决定。
- 落地页：用 `data/home/<lang>.yaml` 拼装首页分区；任意页面加上 `layout: landing` 也能使用 `data/landing/` 下的数据。
- API 参考：由随主题分发的 Swagger UI 与 Redoc 渲染，规范文件可以直接放在站内。

→ [书籍出版](/zh/docs/write/book/) · [发布与下载页](/zh/docs/write/releases/) · [首页与落地页](/zh/docs/customize/home/) · [API 文档](/zh/docs/write/openapi/)

## 面向 AI 助手的输出 {#agent-output}

在 `outputs` 里加上 `markdown`，每个页面就会多发布一份 `.md`：HTML 的 `<head>` 用 `rel="alternate"` 指向它，页面动作里也可以复制或查看它。`LLMS` 输出格式在站点根目录生成 `llms.txt` 内容清单（本站是 <https://oink.pgsty.com/zh/llms.txt>）。

另有两种输出，服务于想一次拿到全部内容的 Agent。栏目开启 `LLMSFULL` 后，整个栏目拼成一份 `llms-full.txt`，Agent 一次请求即可取完；站点开启 `NAVJSON` 后，每种语言发布一份 `navigation.json`，把侧栏树作为数据提供。本站两者都已开启：<https://oink.pgsty.com/zh/docs/llms-full.txt> 与 <https://oink.pgsty.com/zh/navigation.json>。

「在 ChatGPT / Claude / Gemini 中打开」链接默认关闭，因为读者一点击，当前页面的 URL 就会交给第三方。站点需要显式打开 `params.ui.page_context_menu.assistant_links`。

→ [Agent 支持](/zh/docs/customize/agents/)

## 多版本 {#versions}

配置 `params.versions` 后，顶部导航栏会出现版本菜单。已归档的版本在页面顶部显示横幅，链接到当前版本；菜单是跳到对应页面还是跳到各版本首页，由站点决定。每个版本都是分别构建、分别部署的静态站点，不需要任何运行时服务。

→ [多版本](/zh/docs/customize/versions/)

## 自己验证 {#verify}

本站开启了上面的大部分特性，可以这样快速检查：

1. 在任意页面按 `Cmd/Ctrl + K`，输入 `postgres` 查看本地搜索结果；再以 `>` 开头输入，只看命令。
2. 在本页地址后加上 `index.md`，得到本页的 Markdown 版本。
3. 打开 <https://oink.pgsty.com/zh/llms.txt>，这是给 AI 助手的站点清单，从中能找到文档栏目的 `llms-full.txt` 与 `navigation.json`。
4. 看本页右栏的「反链」组，它列出了链接到本页的页面。

## 相关 {#related}

- [OINK 是什么](/zh/docs/about/) — 定位、适用场景与对比
- [示例站点](/zh/docs/about/showcase/) — 这些特性在生产站点里怎么用
- [快速上手](/zh/docs/start/) — 从克隆到部署
- [配置总览](/zh/docs/customize/config/) — 上面提到的参数在哪查
