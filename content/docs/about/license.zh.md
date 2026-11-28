---
title: 开源许可与致谢
linkTitle: 开源许可与致谢
description: 查清主题、本站文档与随主题分发的每个第三方运行时各自适用哪份许可证，以及复用时必须保留什么。
weight: 30
search_keywords: [许可证, License, Apache-2.0, CC BY 4.0, 致谢, VENDOR.json, 第三方依赖, Docsy, 字体许可, Font Awesome]
---

OINK 由三类材料组成，各自适用自己的许可证：主题源码、本站文档，以及随主题分发的第三方资源。三者不会被重新授权为一份统一作品。下面每张表都链接到仓库里的权威文件，**摘要与许可证原文不一致时以文件为准**。

## 许可证对应关系 {#license-map}

| 范围                                                       | 许可证                                         | 权威文件                                                                                                                                          |
|------------------------------------------------------------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| OINK 主题源码（布局、partial、 shortcode、CSS、JS、i18n）  | Apache License 2.0                             | 主题 [`LICENSE`](https://github.com/pgsty/oink/blob/main/LICENSE)、[`NOTICE`](https://github.com/pgsty/oink/blob/main/NOTICE)                     |
| 本站的站点代码、构建脚本与源自 Docsy 的材料                | Apache License 2.0                             | 站点 [`LICENSE`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE)、[`NOTICE`](https://github.com/pgsty/oink.pgsty.com/blob/main/NOTICE) |
| 本站的原创文档内容（另有声明的除外）                       | Creative Commons Attribution 4.0 International | 站点 [`LICENSE-CC-BY-4.0`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE-CC-BY-4.0)                                                   |
| 随主题分发的浏览器库、字体与图标                           | 各组件自己的许可证                             | 主题 [`VENDOR.json`](https://github.com/pgsty/oink/blob/main/VENDOR.json) 与资源旁的许可证文件                                                    |

CC BY 4.0 只覆盖原创文档内容，不覆盖主题代码、商标、截图与第三方资源；同样，主题采用 Apache-2.0，也不改变随附依赖各自的许可证。

## 社区贡献者 {#community-contributors}

OINK 由 PGSTY 维护。感谢 [@imbajin](https://github.com/imbajin) 报告并贡献了下列阅读体验修复，并一同提供了夹具、回归测试与双语文档。这些修复首次随 1.3.1 发布，**1.7.0** 继续保留。

| 贡献 | Pull request |
| --- | --- |
| Markmap 节点文字适配明暗模式与视觉预设 | [主题 #48](https://github.com/pgsty/oink/pull/48) |
| 固定 TOC 的页脚避让 | [主题 #50](https://github.com/pgsty/oink/pull/50) |
| 完整 FileTree 注释，最终通过 `wrap=true` 显式开启 | [主题 #52](https://github.com/pgsty/oink/pull/52) |
| 显式开启的技术表格可读宽度布局 | [主题 #54](https://github.com/pgsty/oink/pull/54) |
| 双语契约、发布文档与伴生站回归覆盖 | [文档 #11](https://github.com/pgsty/oink.pgsty.com/pull/11) |

[1.3.1 发布说明](/zh/release/1.3.1/#thanks)记录了这些修复的集成过程。想参与纠错、翻译或修复，请参阅[贡献指南](/zh/docs/about/contributing/)。

## 上游：Docsy {#upstream-docsy}

主题的 `NOTICE` 记录了以下事实：

- OINK 派生自 [Docsy](https://github.com/google/docsy)，Copyright 2018 Google LLC and Docsy contributors。
- OINK 自身的主题工作 Copyright 2026 PGSTY contributors。
- 项目与上游同为 Apache License 2.0；第三方浏览器依赖的许可、来源、版本与校验值记录在 `VENDOR.json`，各自要求的 NOTICE 文件与对应资源放在一起分发。
- Docsy 名称与 Google 商标归各自权利人所有，此处引用只用于标识上游项目，**不表示背书**。

本站同样派生自 Docsy 项目网站，站点自己的 `NOTICE` 记录了这一来源。Docsy 是 OINK 唯一的代码上游：OINK 完整保留 Docsy 的源码历史、Apache-2.0 义务与版权声明，修改过的文件按 Apache-2.0 的要求附有修改声明。

## 随主题分发的第三方运行时 {#vendored-runtimes}

浏览器需要的资源全部提交在主题仓库的 `assets/third_party/` 与 `static/webfonts/` 下，无需 npm 步骤，构建时也不下载任何东西；以 Hugo Module 方式解析主题时仍需要 Go 与可用的模块来源。`VENDOR.json` 是这批资源的机器可读清单，逐项记录名称、固定版本、来源 URL、许可证文件路径，以及每个选取产物的 SHA-256；清单还为两棵资源目录各记录一个整体校验值。

下表与 [OINK v1.7.0 清单](https://github.com/pgsty/oink/blob/v1.7.0/VENDOR.json)一致（`VENDOR.json` 生成于 2026-11-28，schema 1，共 26 项）。版本随主题发布而变化，**请以所固定主题版本的清单为准**。全部来源都是 npm registry（`https://registry.npmjs.org/…`）。

| 项目                               | 版本     | 许可证                        | 在主题里做什么                             |
|------------------------------------|----------|-------------------------------|--------------------------------------------|
| bootstrap                          | 5.3.8    | MIT                           | 栅格、组件样式与 RTL 样式包                |
| @fortawesome/fontawesome-free      | 7.3.1    | CC-BY-4.0 AND OFL-1.1 AND MIT | 全站图标                                   |
| @fontsource-variable/inter         | 5.3.0    | OFL-1.1                       | 界面与正文字体                             |
| @fontsource-variable/ibm-plex-sans | 5.3.0    | OFL-1.1                       | Paper 预设正文与 Terminal 预设打印字体     |
| @fontsource/chakra-petch           | 5.3.0    | OFL-1.1                       | 品牌展示字体                               |
| @fontsource/ibm-plex-mono          | 5.3.0    | OFL-1.1                       | 代码字体（及 Terminal 预设屏幕字体）       |
| @docsearch/js                      | 5.2.0    | MIT                           | 可选的 Algolia DocSearch 前端              |
| @docsearch/css                     | 5.2.0    | MIT                           | 同上的样式                                 |
| mermaid                            | 12.4.0   | MIT                           | Mermaid 图表                               |
| katex                              | 0.19.1   | MIT                           | 数学公式样式与字体                         |
| swagger-ui-dist                    | 5.36.0   | Apache-2.0                    | OpenAPI 文档页                             |
| redoc                              | 3.2.0    | MIT                           | OpenAPI 文档页                             |
| asciinema-player                   | 3.19.0   | Apache-2.0                    | 终端录像回放                               |
| echarts                            | 6.1.0    | Apache-2.0                    | 图表                                       |
| @antv/infographic                  | 0.2.20   | MIT                           | 信息图                                     |
| leaflet                            | 1.9.4    | BSD-2-Clause                  | 交互地图（经 `params.map` 显式启用）       |
| pako                               | 3.0.3    | MIT AND Zlib                  | 解压（图表数据）                           |
| external-svg-loader                | 1.7.1    | MIT                           | 内联外部 SVG                               |
| idb-keyval                         | 6.3.0    | Apache-2.0                    | 浏览器端缓存                               |
| @plantuml/core                     | 1.2026.10 | MIT                           | 本地 PlantUML 图表引擎                     |
| @viz-js/viz                        | 3.31.0   | MIT AND EPL-2.0               | 本地 PlantUML 的 Graphviz 布局             |
| @markmap/core                      | 1.1.1    | MIT                           | 思维导图（核心模型）                       |
| @markmap/parse                     | 1.1.1    | MIT                           | 思维导图（Markdown 解析器）                |
| @markmap/render                    | 1.1.1    | MIT                           | 思维导图（SVG 渲染器）                     |
| @markmap/view                      | 1.1.1    | MIT                           | 思维导图（交互视图）                       |
| @markmap/plugin-math               | 1.1.1    | MIT                           | 思维导图公式渲染（MathJax）                |
{.wide .expand}

各许可证原文都放在 `assets/third_party/` 下对应资源的旁边，例如 `assets/third_party/bootstrap/LICENSE` 与 `assets/third_party/katex/LICENSE`；Mermaid 附带上游的 `THIRD_PARTY_NOTICES`。Swagger UI、ReDoc 与 ECharts 还保留了各自的 `NOTICE` 或随包依赖声明。`@viz-js/viz` 3.31.0 内含 Graphviz 16.1.0（**EPL-2.0**，替代原 EPL-1.0）与 Expat 2.8.5（MIT），它们的许可声明与上游源码链接随脚本存放在 `assets/third_party/plantuml/`。Markmap 1.1.1 的各个 scoped 包把内嵌的全部子包（含 MathJax 与 D3 原语）列在 `assets/third_party/markmap/PACKAGES.json` 与 `LICENSES.txt` 中。1.5.1 及更早版本随附的以下包已不再分发：Bootstrap 的 JavaScript bundle、`@popperjs/core`、`lunr`（连同 `assets/js/third_party/` 目录），以及旧版 Markmap 0.18、独立 D3、highlight.js 与 WebFontLoader；移除经过见 [1.6.0 发布说明](/zh/release/1.6.0/#leaner-runtime)。

再分发主题时，必须一并保留上述全部许可与声明材料。更新某个运行时，要在同一次变更里同时更新产物、许可证文件、来源与校验值。

## 字体与图标 {#fonts-and-icons}

Inter、IBM Plex Sans、Chakra Petch 与 IBM Plex Mono 四种字体采用 SIL Open Font License 1.1。OINK 1.7.0 在 `static/webfonts/` 下包含 33 个文件：14 个 Inter 子集、12 个 IBM Plex Sans 子集、4 个品牌字体文件和 3 个 Font Awesome 文件。Font Awesome Free 7.3.1 采用复合许可：图标图形为 CC BY 4.0，字体文件为 SIL OFL 1.1，代码为 MIT，原文见 `assets/third_party/Font-Awesome/LICENSE.txt`。

主题不向任何远程字体服务发出请求：仓库里没有 Google Fonts 链接，字体只从站点自己的 `baseURL` 下发。更换字体或改用系统字体栈，见[品牌外观](/zh/docs/customize/brand/)。

## 设计参考 {#design-references}

代码上游只有 Docsy 一个。下面这些项目只在设计语言上提供了参考：OINK 没有移植它们的代码，运行时也不依赖其中任何一个。

- [Fumadocs](https://www.fumadocs.dev/) — 以内容为中心的呈现、信息层级、文件树与参数表一类的写作组件（主题 `NOTICE` 记录了这条致敬）。
- [Nextra](https://nextra.site/) — 精炼的文档外壳、代码块的文件名与复制交互、按页布局开关。
- [Hextra](https://imfing.github.io/hextra/) — Hugo 原生的实现取向、文件树、徽章、标签页。
- [Mintlify](https://mintlify.com/) — 结构化导航分层、同步的代码分组、API 参考的阅读体验。
{.cards .td-cards-list}

[Hugo](https://gohugo.io/) 是构建平台，以 Hugo Module 方式安装主题时由 Go 解析模块。两者都是前提条件，主题不重新分发它们的可执行文件。

提及这些名称只为说明来源、依赖或设计参考，**不表示相关项目为 OINK 背书**；各项目与产品名称归其权利人所有。

## 复用这份文档 {#reusing-the-docs}

CC BY 4.0 允许出于任何目的分享与改编本文档，条件是：给出署名，提供许可证链接，说明是否做过修改，并且不暗示 OINK、PGSTY 或任何上游项目为改编内容背书。下面这段署名即可满足要求：

> 本文改编自 PGSTY 贡献者编写的 OINK 文档，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可，并做了修改。

页面中单独署名的图片或引文，保留它们各自的署名与许可。删掉页脚并不能免除署名义务。

## 复用这个主题 {#reusing-the-theme}

Apache-2.0 允许按其条款使用、修改与分发主题源码及构建产物：保留许可证、版权与归属声明以及 `NOTICE` 的内容，分发修改后的源码时标明改过哪些文件。主题发行包应当包含 `LICENSE`、`NOTICE`、`VENDOR.json`，以及清单引用的全部第三方许可证文件。

Apache-2.0 不授予商标使用权，也不会把第三方资源变成 Apache 许可的作品。

## 相关 {#related}

- [参与贡献](/zh/docs/about/contributing/) — 报告问题，改进文档与提交修复
- [OINK 是什么](/zh/docs/about/) — 项目定位与来历
- [特性](/zh/docs/about/features/) — 本地优先具体指什么
- [配置总览](/zh/docs/customize/config/) — 哪些功能会引入外部服务
- [品牌外观](/zh/docs/customize/brand/) — 换字体与图标
