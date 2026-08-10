---
title: 开源许可与致谢
linkTitle: 开源许可
description: 了解 Oink 的上游传承、依赖、致谢与许可证边界。
weight: 60
icon: fa-solid fa-scale-balanced
aliases: [/license/, /docs/about/licenses/]
---

OINK 由采用 Apache 许可证的主题、单独授权的文档站，以及各自保留许可证的第三方组件组成。这些层次不会被重新授权成一份不加区分的作品。

本页用于帮助工程维护者理解来源，不代替许可证原文。如果摘要与许可证文件存在差异，以许可证文件为准。

## 许可证对应关系 {#license-map}

| 范围                                       | 许可证                                         | 权威记录                                                        |
| ------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------- |
| Oink 主题源码与 Oink 的主题改动            | Apache License 2.0                             | 主题 [`LICENSE`][] 与 [`NOTICE`][]                              |
| 站点代码、构建工具与源自 Docsy 的材料      | Apache License 2.0                             | 站点 [`LICENSE`][site-license] 与 [`NOTICE`][site-notice]       |
| Oink 原创文档，另有说明的内容除外          | Creative Commons Attribution 4.0 International | [`LICENSE-CC-BY-4.0`][site-cc-by]，以及页面或资源自己的署名说明 |
| 浏览器库、字体、图标与其他随主题分发的资源 | 各组件自己的许可证                             | 主题 [`VENDOR.json`][] 与随资源分发的许可证文件                 |

Creative
Commons 许可证适用于原创文档内容，不自动覆盖主题代码、复制的源码、商标、截图或另有声明的第三方资源。同样，主题采用 Apache-2.0，并不会替换随附依赖自己的许可证。

## 上游渊源 {#upstream-lineage}

OINK 是直接派生自 [Docsy](https://github.com/google/docsy)
的独立主题。它保留 Docsy 的源码历史、Apache-2.0 许可证、版权声明、内容约定，以及仍属于产品合同的兼容 API。项目站也源自 Docsy 项目网站，并在自己的
`NOTICE` 中记录了这段渊源。

OINK 不是叠加在另一套 Docsy 安装之上的可选皮肤。继承而来的代码库已经演化成一套标准主题，提供仅依赖 Hugo 的消费端构建、本地浏览器运行时、多语言行为与独立发布流程。贡献者必须保留适用的上游声明，并按照 Apache-2.0 的要求标记修改过的文件。

## Oink 依赖的项目 {#projects-oink-depends-on}

[Hugo Extended](https://gohugo.io/) 是构建平台。站点采用 Hugo
Module 安装方式时由 Go 解析模块，Git 则承载源码与发布流程。这些工具属于前提条件，主题不会重新分发它们的可执行文件。

主题会随包分发固定版本的浏览器资源，让消费站点不需要 npm 或公共 CDN。下表归纳当前主要依赖；准确版本、选取的产物、来源、校验值与许可证路径，以
`VENDOR.json` 为准。

| 能力           | 随主题分发的项目                                           | 主题记录的许可证类型                         |
| -------------- | ---------------------------------------------------------- | -------------------------------------------- |
| UI 基础        | Bootstrap、Popper、jQuery                                  | MIT                                          |
| 图标与字体     | Font Awesome、Open Sans、Chakra Petch、IBM Plex Mono       | 按组件分别采用 CC BY 4.0、SIL OFL 1.1 与 MIT |
| 搜索           | Lunr、DocSearch                                            | MIT                                          |
| 图表与公式     | Mermaid、KaTeX、Markmap、D3、Highlight.js、Web Font Loader | MIT、ISC、BSD-3-Clause 与 Apache-2.0         |
| API 与终端视图 | Swagger UI、Redoc、Asciinema Player                        | Apache-2.0 与 MIT                            |
| 数据可视化     | Apache ECharts、AntV Infographic                           | Apache-2.0 与 MIT                            |
| 辅助运行时     | pako、external-svg-loader、idb-keyval、PrismJS             | 按组件分别采用 MIT、Zlib 与 Apache-2.0       |

再次分发时，必须保留各组件许可证要求的许可与声明材料。更新 vendor 文件时，应在同一变更中更新清单条目、校验值、来源、许可证文件与所有必需的 NOTICE。

## Oink 致敬的项目 {#projects-oink-acknowledges}

| 项目         | 与 Oink 的关系 | 对项目的贡献                                                 |
| ------------ | -------------- | ------------------------------------------------------------ |
| [Hugo][]     | 构建平台       | 内容模型、模板、资源流水线、多语言路由、分类法与静态站点生成 |
| [Docsy][]    | 直接上游       | 仓库历史、文档约定、布局、Bootstrap 基础与兼容 API           |
| [Fumadocs][] | 设计灵感       | 以内容为中心的呈现、信息层级、导航结构与页内目录处理         |

Fumadocs 是设计参考，不是 Oink 的代码上游或运行时依赖。OINK 针对 Hugo 与源自 Docsy 的代码库重新诠释这些思路，而不是逐像素复制。我们感谢 Hugo、Docsy、Fumadocs 与各依赖项目的社区开放并持续维护这些成果。

这些引用用于说明项目传承、依赖或设计灵感，并不表示相关项目为 OINK 背书；各项目与产品名称仍归其权利人所有。

## 复用文档 {#reusing-the-documentation}

CC BY
4.0 允许任何目的的分享与演绎，但必须给出恰当署名、提供许可证链接，并说明是否做过修改。不得暗示 Oink、PGSTY 或上游项目为改编内容背书。

简洁的署名可以写成：

> 本文改编自 PGSTY 贡献者编写的 Oink 文档，采用
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可，并做了修改。

如果页面包含单独署名的媒体或引用文字，也要保留相应材料的署名与许可证。移除页脚并不会免除在其他位置提供署名的义务。

## 复用主题 {#reusing-the-theme}

Apache-2.0 允许按照条款使用、修改和分发所涵盖的主题源码与编译产物。尤其要保留许可证、适用的版权和归属声明，并在许可证要求时保留
`NOTICE` 内容；分发修改后的源码时，还要标明修改过的文件。

主题发行包应包含
`LICENSE`、`NOTICE`、`VENDOR.json`，以及清单引用的第三方许可证文件。Apache-2.0 不授予使用项目商标的权利，也不会把第三方资源变成采用 Apache 许可证的作品。

审查源码贡献或再次分发时，请先阅读[贡献指南](../contributing/)以及下方链接的实际许可证与声明文件。

[Docsy]: https://www.docsy.dev/
[Fumadocs]: https://www.fumadocs.dev/
[Hugo]: https://gohugo.io/
[`LICENSE`]: https://github.com/pgsty/oink/blob/main/LICENSE
[`NOTICE`]: https://github.com/pgsty/oink/blob/main/NOTICE
[`VENDOR.json`]: https://github.com/pgsty/oink/blob/main/VENDOR.json
[site-cc-by]:
  https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE-CC-BY-4.0
[site-license]: https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE
[site-notice]: https://github.com/pgsty/oink.pgsty.com/blob/main/NOTICE
