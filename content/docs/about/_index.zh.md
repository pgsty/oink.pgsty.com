---
title: 关于 Oink
description: 了解 Oink 的示例、设计原则、架构与开源模式。
type: docs
aliases: [/about/, /docs/oink/]
weight: 90
icon: fa-solid fa-circle-info
cascade:
  categories: [关于]
---

OINK 把 Markdown、配置与本地资源转换成完整的技术文档站。站点取得主题源码并安装 Hugo
Extended 后，无需维护前端工具链，即可构建文档、博客、多语言导航、本地搜索、图表、API 参考与可复用内容组件。

## Oink 提供什么 {#what-oink-provides}

| 能力               | 主题契约                                                   |
| ------------------ | ---------------------------------------------------------- |
| 文档与博客布局     | 响应式导航、面包屑导航、目录、页面元数据、反馈、打印与索引 |
| 多语言行为         | 译文路由、语言元数据、稳定锚点与分语言本地搜索             |
| 本地优先浏览器功能 | 固定版本的样式、字体、搜索、图表、API 参考、录像与信息图   |
| 内容组件           | 标签页、折叠块、步骤、卡片、轮播、图表、终端录像与参数替换 |
| 可复现交付         | 仅依赖 Hugo 的消费端构建、固定资源、vendor 清单与回归样例  |

OINK 把 Docsy 成熟的 Hugo 内容模型演化为独立主题，以 Hugo 作为构建平台，并从 Fumadocs 汲取设计灵感。[开源许可](license/)页面分别说明上游传承、设计致敬、依赖与许可证，避免混淆这些关系。

## 了解这个项目 {#explore-the-project}

About 章节按照从评估到维护的顺序组织：

1. [示例站点](examples/)介绍完整双语项目站、主题自带的小型示例，以及创建最小消费站点的指南。
2. [本地优先](local-first/)定义哪些构建与浏览器能力无需隐藏的网络访问。
3. [架构](architecture/)解释仓库、构建、页面外壳、运行时与扩展边界。
4. [贡献指南](contributing/)说明如何修改主题与双语文档。
5. [开源许可](license/)说明项目渊源、依赖、致谢，以及站点与主题各自适用的许可证。

## 仓库边界 {#repository-boundaries}

公开 Hugo Module 位于
[`github.com/pgsty/oink`](https://github.com/pgsty/oink)。文档、示例与回归测试位于独立的
[`github.com/pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
仓库。生产消费站点应固定已发布标签或不可变 commit。

站点自有的内容、品牌、配置与业务组件仍由站点控制。通用布局、可复用组件、本地浏览器运行时与翻译资源则属于主题。

## 从这里开始 {#start-here}

- [安装 Oink](/zh/docs/tutorial/install/)，或[创建双语站点](/zh/docs/tutorial/create-site/)；
- 阅读[内容创作指南](/zh/docs/content/)与[高级特性](/zh/docs/advanced/)；
- 阅读[实现日志](/zh/blog/oink/oink-implementation-diary/)，了解设计决策与验证证据。

本地构建成功，只能证明某份源码在某个本地环境中能够渲染；它不能证明主题标签已经公开，也不能证明线上站点包含同一 commit。
