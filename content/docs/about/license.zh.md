---
title: 开源许可与致谢
linkTitle: 开源许可与致谢
description: 查清哪一层适用哪份许可证：主题 Apache-2.0、文档 CC BY 4.0、随主题分发的第三方运行时各自保留原许可。
weight: 30
search_keywords: [许可证, License, Apache-2.0, CC BY 4.0, 致谢, VENDOR.json, 第三方依赖, Docsy, 字体许可, Font Awesome]
---

OINK 由三层材料组成：主题源码、文档内容、随主题分发的第三方资源。三者各自的许可证不会被重新授权成一份统一作品。下面每张表都指向仓库里的权威文件，**摘要与许可证原文不一致时以文件为准**。

## 许可证对应关系 {#license-map}

| 范围 | 许可证 | 权威文件 |
| --- | --- | --- |
| OINK 主题源码（布局、partial、 shortcode、SCSS、JS、i18n） | Apache License 2.0 | 主题 [`LICENSE`](https://github.com/pgsty/oink/blob/main/LICENSE)、[`NOTICE`](https://github.com/pgsty/oink/blob/main/NOTICE) |
| 本站的站点代码、构建脚本与源自 Docsy 的材料 | Apache License 2.0 | 站点 [`LICENSE`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE)、[`NOTICE`](https://github.com/pgsty/oink.pgsty.com/blob/main/NOTICE) |
| 本站的原创文档内容（另有声明的除外） | Creative Commons Attribution 4.0 International | 站点 [`LICENSE-CC-BY-4.0`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE-CC-BY-4.0) |
| 随主题分发的浏览器库、字体与图标 | 各组件自己的许可证 | 主题 [`VENDOR.json`](https://github.com/pgsty/oink/blob/main/VENDOR.json) 与资源旁的许可证文件 |

两条边界要分清：CC BY 4.0 只覆盖原创文档内容，不覆盖主题代码、商标、截图与第三方资源；主题采用 Apache-2.0，也不会把随附依赖变成 Apache 许可的作品。

## 上游：Docsy {#upstream-docsy}

主题 `NOTICE` 记录的事实：

- OINK 派生自 [Docsy](https://github.com/google/docsy)，Copyright 2018 Google LLC and Docsy contributors。
- OINK 自身的主题工作 Copyright 2026 PGSTY contributors。
- 项目与上游同为 Apache License 2.0；第三方浏览器依赖的许可、来源、版本与校验值记录在 `VENDOR.json`，各自要求的 NOTICE 文件与对应资源放在一起分发。
- Docsy 名称与 Google 商标归各自权利人所有，此处引用只用于标识上游项目，**不表示背书**。

本站也派生自 Docsy 项目网站，这段渊源记录在站点自己的 `NOTICE` 里。Docsy 是 OINK 唯一的代码上游：源码历史、Apache-2.0 义务与版权声明完整保留，按 Apache-2.0 的要求，修改过的文件需要标注。

## 随主题分发的第三方运行时 {#vendored-runtimes}

主题把浏览器要用的资源全部提交在仓库里（`assets/third_party/`、`assets/js/third_party/`、`static/webfonts/`），消费站点不需要 npm，也不会在构建期下载任何东西。`VENDOR.json` 是这批资源的机器可读清单，逐项记录名称、固定版本、来源 URL、许可证文件路径，以及每个选取产物的 SHA-256；清单里还有三棵资源目录的整体校验值。

下表是清单快照（`VENDOR.json` 生成于 2026-08-17，schema 1，共 26 项）。版本会随主题发布变动，**以仓库里的 `VENDOR.json` 为准**。全部来源都是 npm registry（`https://registry.npmjs.org/…`）。

| 项目 | 版本 | 许可证 | 在主题里做什么 |
| --- | --- | --- | --- |
| bootstrap | 5.3.8 | MIT | 栅格、组件与 RTL 样式基础 |
| @popperjs/core | 2.11.8 | MIT | Bootstrap 的浮层定位 |
| @fortawesome/fontawesome-free | 7.3.1 | CC-BY-4.0 AND OFL-1.1 AND MIT | 全站图标 |
| @fontsource-variable/inter | 5.3.0 | OFL-1.1 | 界面与正文字体 |
| @fontsource/chakra-petch | 5.3.0 | OFL-1.1 | 品牌展示字体 |
| @fontsource/ibm-plex-mono | 5.3.0 | OFL-1.1 | 代码字体 |
| lunr | 2.3.9 | MIT | 本地全文检索 |
| @docsearch/js | 5.0.1 | MIT | 可选的 Algolia DocSearch 前端 |
| @docsearch/css | 5.0.1 | MIT | 同上的样式 |
| mermaid | 11.16.1 | MIT | Mermaid 图表 |
| katex | 0.18.4 | MIT | 数学公式 |
| markmap-autoloader | 0.18.12 | MIT | 思维导图 |
| markmap-lib | 0.18.12 | MIT | 思维导图 |
| markmap-view | 0.18.12 | MIT | 思维导图 |
| markmap-toolbar | 0.18.12 | MIT | 思维导图工具条 |
| d3 | 7.9.0 | ISC | Markmap 依赖 |
| @highlightjs/cdn-assets | 11.12.0 | BSD-3-Clause | Markmap 依赖 |
| webfontloader | 1.6.28 | Apache-2.0 | Markmap 依赖 |
| swagger-ui-dist | 5.32.13 | Apache-2.0 | OpenAPI 文档页 |
| redoc | 2.5.3 | MIT | OpenAPI 文档页 |
| asciinema-player | 3.17.0 | Apache-2.0 | 终端录像回放 |
| echarts | 6.1.0 | Apache-2.0 | 图表 |
| @antv/infographic | 0.2.19 | MIT | 信息图 |
| pako | 3.0.1 | MIT AND Zlib | 解压（图表数据） |
| external-svg-loader | 1.7.1 | MIT | 内联外部 SVG |
| idb-keyval | 6.2.0 | Apache-2.0 | 浏览器端缓存 |

许可证原文与各资源放在一起：例如 `assets/third_party/bootstrap/LICENSE`、`assets/third_party/katex/LICENSE`；Swagger UI、Redoc 与 ECharts 还随包带了各自的 `NOTICE` 或打包声明文件。Lunr 是唯一的例外，代码在 `assets/js/third_party/`，许可证在 `assets/third_party/lunr/LICENSE`。

再分发主题时，这些许可与声明材料必须一并保留。更新某个运行时意味着在同一次变更里同时更新产物、许可证文件、来源与校验值。

## 字体与图标 {#fonts-and-icons}

三款字体（Inter、Chakra Petch、IBM Plex Mono）都采用 SIL Open Font License 1.1，字体文件提交在 `static/webfonts/`：Inter 十四个子集文件、品牌字体四个，加上 Font Awesome 的三个，共二十一个。Font Awesome Free 7.3.1 是复合许可：图标图形 CC BY 4.0、字体文件 SIL OFL 1.1、代码 MIT，原文在 `assets/third_party/Font-Awesome/LICENSE.txt`。

主题不向远程字体服务发请求：仓库里没有 Google Fonts 之类的外链，字体一律由站点自身 `baseURL` 下发。更换字体或改用系统字体栈见[品牌外观](/zh/docs/customize/brand/)。

## 设计参考 {#design-references}

代码上游只有 Docsy 一个。下面这些项目是设计语言上的参考，既不是代码来源也不是运行时依赖，OINK 没有移植它们的代码：

| 项目 | 借鉴之处 |
| --- | --- |
| [Fumadocs](https://www.fumadocs.dev/) | 以内容为中心的呈现、信息层级、文件树与参数表一类的写作组件（主题 `NOTICE` 记录了这条致敬） |
| [Nextra](https://nextra.site/) | 精炼的文档外壳、代码块的文件名与复制交互、按页布局开关 |
| [Hextra](https://imfing.github.io/hextra/) | Hugo 原生的实现取向、文件树、徽章、标签页 |
| [Mintlify](https://mintlify.com/) | 结构化导航分层、同步的代码分组、API 参考的阅读体验 |

[Hugo](https://gohugo.io/) 是构建平台，Go 在 Hugo Module 安装方式下负责解析模块。两者都是前提条件，主题不重新分发它们的可执行文件。

引用这些名字用于说明传承、依赖或灵感来源，**不表示相关项目为 OINK 背书**；各项目与产品名称归其权利人所有。

## 复用这份文档 {#reusing-the-docs}

CC BY 4.0 允许任何目的的分享与演绎，条件是给出署名、提供许可证链接、说明是否做过修改，并且不得暗示 OINK、PGSTY 或上游项目为改编内容背书。一段合格的署名可以是：

> 本文改编自 PGSTY 贡献者编写的 OINK 文档，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可，并做了修改。

页面里单独署名的图片或引文，要保留它们各自的署名与许可；删掉页脚不会免除署名义务。

## 复用这个主题 {#reusing-the-theme}

Apache-2.0 允许按条款使用、修改与分发主题源码及编译产物，条件是保留许可证、版权与归属声明，保留 `NOTICE` 内容，并在分发修改后的源码时标明改过哪些文件。主题发行包应当包含 `LICENSE`、`NOTICE`、`VENDOR.json`，以及清单引用的全部第三方许可证文件。

Apache-2.0 不授予商标使用权，也不会把第三方资源变成 Apache 许可的作品。

## 相关 {#related}

- [OINK 是什么](/zh/docs/about/) — 项目定位与来历
- [亮点特性](/zh/docs/about/features/) — 本地优先具体指什么
- [配置总览](/zh/docs/customize/config/) — 哪些功能会引入外部服务
- [品牌外观](/zh/docs/customize/brand/) — 换字体与图标
