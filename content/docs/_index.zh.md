---
title: 欢迎使用 OINK
linkTitle: 文档
description: 安装、定制、部署与维护 Oink 文档站。
menu: { main: { weight: 20 } }
type: docs
icon: fa-solid fa-book
sidebar_expanded: true
sidebar_root_for: self
sidebar_root_link_self: true
comments: false
---

<!-- markdownlint-disable-next-line no-space-in-links -->

<span class="badge bg-primary text-bg-primary fs-6">{{% param version %}}
</span>

欢迎阅读 OINK `{{% param version %}}`
用户指南。本指南涵盖仅依赖 Hugo 的构建方式、本地优先运行时、多语言框架、内容组件、自定义方法与部署方案。

## OINK 是什么？ {#what-is-oink}

OINK 是一款面向中大型技术文档集的独立 [Hugo][] 主题。它从 [Docsy][]
直接演化而来：既保留 Docsy 成熟的内容模型和文档能力，也提供全新的标准外壳、本地依赖，以及从 PGSTY 生产站点提炼出的可复用组件。

消费站点只需 Hugo
Extended 即可完成构建，无需 Node.js、npm、PostCSS、Autoprefixer 或 CDN。Bootstrap、Font
Awesome、字体、本地搜索、图表、API 文档运行时和内容组件都随主题提供，并且只会在页面确实需要时加载。

OINK 提供：

- 响应式文档与博客外壳，包括导航、目录（TOC）、搜索、打印输出、深色模式和无障碍交互；
- 通用多语言框架，包括译文路由、缺失译文回退、语言权重、RTL 支持和 SEO 备用语言元数据；
- 本地 Mermaid、KaTeX、Markmap、Swagger
  UI、Redoc、Asciinema、ECharts 和 Infographic 运行时；
- 可复用的折叠块、标签页、卡片、导航卡片和文档轮播；
- 双语项目站、静态托管部署指南、本地主题资源与可审计的 vendor 清单。

OINK 本身 **不提供**
源码托管，也不会替你部署生成后的站点。你可以把项目放在 GitHub、GitLab、私有 Git 服务或本地仓库中，再通过任意合适的平台发布 Hugo 生成的静态文件。

## OINK 适合我吗？ {#is-oink-for-me}

如果文档项目页面众多、内容类型复杂、需要支持多种语言，或对可复现构建和网络隔离有严格要求，OINK 会尤其合适。当多个站点需要共享同一套持续维护的外壳，而不希望复制布局、脚本和短代码时，它也能显著降低维护成本。

如果项目只有一两页内容，也不需要结构化导航，那么 README 或更轻量的 Hugo 主题可能更简单。对于高度应用化的门户，可以使用 OINK 承载文档界面，同时把带有业务语义的组件留在站点层，不必强行纳入主题。

## 准备开始了吗？ {#ready-to-get-started}

先阅读
[Oink 概览](/zh/docs/about/)了解产品边界，再[安装 Oink](/zh/docs/tutorial/install/)或[创建双语站点](/zh/docs/tutorial/create-site/)。其余指南覆盖内容创作、高级特性、部署与升级。

[Docsy]: https://github.com/google/docsy
[Hugo]: https://gohugo.io/
