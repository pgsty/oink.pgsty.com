---
title: 关于 OINK
linkTitle: 关于
description: OINK 是一款本地优先、仅依赖 Hugo 的多语言技术文档主题
type: docs
aliases: [/about/]
weight: 99
icon: fa-solid fa-circle-info
---

OINK 把 Markdown、配置与本地资源转换为完整的技术文档站点。站点只要取得主题源码并安装 Hugo
Extended，就能构建文档、博客、多语言导航、本地搜索、图表、API 参考与可复用内容组件，无需安装前端工具链。

你可以先阅读[文档](/zh/docs/)、查看[可运行示例](/zh/examples/)，或浏览
[OINK 产品参考](/zh/docs/oink/)。

## OINK 是什么 {#what-oink-is}

OINK 是一款直接从 Docsy 演化而来的独立主题。它保留了 Docsy 成熟的 Hugo 内容模型，同时确立了一套标准产品形态：

- 品牌化、响应式的文档外壳；
- 消费站点仅依赖 Hugo 的构建方式；
- 版本明确的本地浏览器运行时；
- 多语言路由、元数据、搜索与导航；
- 可复用并兼顾无障碍的内容组件；
- 双语 starter，以及可验证的离线发行包。

OINK 是项目当前使用的名称。在公开版本正式确定最终品牌、模块路径与发行坐标之前，请使用明确的检出内容、归档包或不可变版本，不要根据继承而来的元数据自行推断。

<a id="so-whats-a-technical-documentation-site"></a>

## 怎样的技术文档才真正有用 {#what-makes-technical-documentation-work}

技术文档应帮助读者理解产品，并以尽可能低的阻力完成任务。一套好用的文档应当具备以下特征：

- **可靠**：陈述、命令、版本与示例都与产品实际情况一致。
- **全面**：不同角色的读者都能找到所需的概念、操作步骤、参考资料与故障排查内容。
- **组织清晰**：相关信息采用一致方式编排，并可通过导航、搜索与稳定链接找到。
- **无障碍**：内容、组件、配色、焦点状态与键盘操作能够服务广泛的读者。
- **便于维护**：作者无需依赖脆弱的交付流水线，就能审阅、翻译、测试和发布变更。

面对国际读者，同一信息还应在不同语言之间保持等价。OINK 把语言标识、译文路由、稳定标题 ID、搜索索引与多语言替代元数据视为基础设施，而不是可有可无的装饰。

<a id="how-does-docsy-help"></a>

## OINK 提供什么 {#what-oink-provides}

| 能力                 | 主题提供的内容                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 文档与博客布局       | 响应式导航、面包屑、目录（TOC）、页面元数据、意见反馈、打印输出与内容索引                                                   |
| 自动导航             | Hugo 内容结构会自动形成分区导航，无需另行维护菜单清单                                                                       |
| 多语言行为           | 使用语言本名的选择器、译文路由、首页回退、`hreflang`、locale 元数据与分语言本地搜索                                         |
| 本地优先的浏览器能力 | Bootstrap、Font Awesome、字体、Mermaid、KaTeX、Markmap、Swagger UI、Redoc、Asciinema、ECharts 与 Infographic 资源随主题交付 |
| 内容组件             | 标签页、折叠块、卡片、导航卡片、轮播、图示、终端录屏、数据图表与参数替换                                                    |
| 站点自主定制         | Hugo 配置、菜单、内容、项目 SCSS、模板与业务组件仍由站点自己掌控                                                            |
| 可复现交付           | 仅依赖 Hugo 的生产命令、双语 starter、第三方清单、离线归档、迁移指南与自动化 fixture                                        |

<a id="simple-authoring-and-publishing"></a>

### 简单地创作与发布 {#author-and-publish-simply}

使用 Markdown 或 HTML 编写内容，通过 Hugo 本地服务器预览，再把生成的 `public/`
目录发布到任意静态托管平台。消费站点的生产构建命令是：

```sh
hugo --gc --minify
```

请参阅[部署方案](/zh/docs/deployment/)，了解本地环境、GitHub Pages、Cloudflare
Pages、Netlify 与对象存储的部署方式。

<a id="built-in-integration-with-common-tools"></a>

### 在本地构建与搜索 {#build-and-search-locally}

OINK 的默认路径不会在构建时下载文件，也不会产生由主题发起的第三方浏览器请求。搜索使用同源、按语言划分的索引，并为简体中文提供 CJK 子字符串回退。作者仍可配置远程分析、媒体、图表服务或托管搜索，但这些边界必须由站点显式决定。

<a id="get-organized"></a>

### 服务多语言读者 {#serve-a-multilingual-audience}

译文可以与源页面并置保存为 `page.md` 和
`page.zh.md`。主题根据 Hugo 页面模型生成语言切换与 SEO 元数据。本站以英文为首要语言、简体中文为第二语言。

请阅读[多语言支持](/zh/docs/language/)，了解内容组织、显式稳定标题 ID、RTL 行为与翻译检查。

<a id="make-it-your-own"></a>

### 无需复制外壳即可定制 {#customize-without-forking-the-shell}

站点负责自己的 Logo、配色、字体、菜单、内容与业务组件；OINK 负责标准外壳和通用基础组件。这种职责划分既避免维护一份复制出来的布局树，也保留了在真实产品需求下使用 Hugo 常规覆盖机制的能力。

请参阅[外观与样式](/zh/docs/content/lookandfeel/)和[内容组件](/zh/docs/oink/components/)。

<a id="keep-up-to-date"></a> <a id="focus-on-great-content"></a>

## 上游项目与致谢 {#relationship-to-docsy}

OINK 建立在成熟的开源成果之上。Hugo、Docsy 与 Fumadocs 以不同方式影响了这个项目：Hugo 是构建平台，Docsy 是直接上游，而 Fumadocs 是设计参考。

| 项目         | 与 OINK 的关系 | OINK 延续的部分                                            |
| ------------ | -------------- | ---------------------------------------------------------- |
| [Hugo][]     | 构建平台       | 内容模型、模板、资源管线、多语言路由、分类法与静态站点生成 |
| [Docsy][]    | 直接上游       | 仓库历史、文档约定、布局、Bootstrap 基础与兼容 API         |
| [Fumadocs][] | 设计参考       | 克制且以内容为中心的外壳、清晰的信息层级与细腻的导航交互   |

### Hugo：基础平台 {#hugo-the-platform}

[Hugo][] 是 OINK 的静态站点生成器。OINK 依靠 Hugo
Extended 完成内容发现、模板渲染、多语言页面、分类法、资源处理与静态文件输出。OINK 是 Hugo 主题，并不是 Hugo 的分支。

### Docsy：直接上游 {#docsy-the-direct-upstream}

[Docsy][]
是 OINK 在代码与内容模型上的直接上游。OINK 保留 Docsy 的 Apache-2.0 历史与归属信息，也延续了对现有站点仍有价值的内容约定和兼容 API。

OINK 并不是叠加在另一套 Docsy 安装之上的可选皮肤，而是把继承的主题发展成一个独立产品：提供统一的标准外壳、消费端仅依赖 Hugo 的构建方式、本地浏览器运行时、通用多语言模型，以及更多内容组件。

### Fumadocs：设计参考 {#fumadocs-design-inspiration}

[Fumadocs][] 是一款 React.js 文档框架，其设计者是 Fuma
Nama。在 OINK 的项目传承与依赖关系中，它是设计参考，而不是直接代码上游或构建平台。

OINK 当前的视觉语言与文档外壳参考了 Fumadocs：克制且以内容为中心的呈现方式、信息层级、导航几何、侧边栏交互，以及页内目录的处理。OINK 针对 Hugo 与源自 Docsy 的代码库重新实现这些设计思路，而不是逐像素复制。

感谢 Fuma
Nama 与 Fumadocs 社区的贡献者。感谢他们开放分享这些成果，并提升了技术文档设计的标准。

### 归属与边界 {#attribution-and-boundaries}

对 Hugo、Docsy 与 Fumadocs 的引用分别用于说明项目传承、平台依赖或设计灵感，并不表示这些项目为 OINK 背书。相关名称与商标归各自所有者所有。源码与发行包会保留适用的许可证和声明文件。

[Docsy]: https://www.docsy.dev/
[Fumadocs]: https://www.fumadocs.dev/
[Hugo]: https://gohugo.io/

<a id="whats-next-for-docsy"></a>

## 项目状态与后续步骤 {#project-status-and-next-steps}

当前检出内容是一份实现与文档预览。本地构建成功，本身并不能证明公开版本、托管部署或稳定的远程模块路径已经存在。

- [构建双语 starter](/zh/docs/oink/getting-started/)；
- 查看[架构](/zh/docs/oink/architecture/)与[本地优先契约](/zh/docs/oink/local-first/)；
- 阅读[实现日记](/zh/blog/2026/oink-implementation-diary/)；
- 遵循[发布检查表](/zh/docs/oink/release/)；
- 加入[社区](/zh/community/)，或阅读[贡献指南](/zh/docs/contributing/)。

<!-- There must not be a blank line at the end of this file otherwise it creates an empty paragraph in the rendered page -->
