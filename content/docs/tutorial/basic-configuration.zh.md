---
title: 站点基础配置
date: 2021-12-08T09:22:27+01:00
weight: 40
icon: fa-solid fa-sliders
description: 配置站点、语言、导航与本地功能。
aliases: [/docs/get-started/basic-configuration/]
---

Hugo 从 `hugo.yaml`、`hugo.toml` 或 `hugo.json`
读取站点级设置。Oink 项目站点使用 YAML，因为多语言菜单和主题选项更便于浏览与评审。

## 最低配置 {#minimum-configuration}

下面的节选展示了 Hugo Module 的关键结构。

```yaml
title: Product Documentation
baseURL: https://docs.example.com/
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: Product Documentation
    menus:
      main:
        - name: Docs
          pageRef: /docs
          weight: 10
        - name: Blog
          pageRef: /blog
          weight: 20
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: 产品文档
    menus:
      main:
        - name: 文档
          pageRef: /docs
          weight: 10
        - name: 博客
          pageRef: /blog
          weight: 20

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false

params:
  offlineSearch: true
  github_repo: https://github.com/example/product-docs
  github_branch: main
  copyright:
    authors: Example Authors
    from_year: 2026
  ui:
    showLightDarkModeMenu: true
    sidebar_menu_foldable: true
    breadcrumb_disable: false

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: {{% param hugoMinVersion %}}
```

英文权重为 1，也是默认语言；简体中文权重为 2；其他语言依次排列。直接点击语言按钮时会按此顺序切换，完整的悬停菜单也采用相同顺序。

## 内容译文 {#content-translations}

将译文并置存放：

```text
content/
├── _index.md
├── _index.zh.md
├── docs/
│   ├── _index.md
│   ├── _index.zh.md
│   ├── install.md
│   └── install.zh.md
└── blog/
    ├── release.md
    └── release.zh.md
```

会影响路由的元数据应保持一致。标题、描述、菜单标签、摘要、标签、图片替代文字和短代码中的可见字符串都需要翻译。每个中文标题都应显式使用英文页面实际渲染出的标题 ID，确保不同语言中的 URL 片段保持稳定。

## 本地搜索与浏览器资源 {#local-search-and-browser-resources}

`offlineSearch: true`
会启用主题的同源 Lunr 索引和 CJK 回退。索引按语言分别生成。除非站点明确接受相应的网络依赖，否则不要配置公共搜索服务。

Mermaid、KaTeX、Markmap、Swagger
UI、Redoc、Asciinema、ECharts 和 Infographic 都由主题本地提供，并按页面加载。PlantUML 和 Draw.io 属于依赖服务的例外：请显式配置获准使用的端点，否则保持禁用。

## 品牌与代码仓库链接 {#branding-and-repository-links}

在站点层设置
`title`、各语言标题、`params.logo`、代码仓库 URL、版权和菜单。OINK 不新增
`oink.*` 配置树，而是沿用 Hugo 与兼容 Docsy 参数的位置。

代码仓库元数据用于在内容页提供编辑、查看、提交问题和内容年龄信息。请确保
`github_repo`、`github_project_repo`、`github_branch` 与 `github_subdir`
同源码布局一致。

## 生产默认值 {#production-defaults}

- 使用真实的生产 `baseURL`，包括可能存在的子路径。
- 除非属于明确的产品决策，否则关闭在线分析、评论、Google
  CSE、Algolia 和远程嵌入。
- 在 CI 中固定 Hugo Extended 和主题版本。
- 使用 `hugo --gc --minify` 作为生产构建命令。
- 重新分发归档时保留 `LICENSE`、`NOTICE` 和 vendor 清单。

可构建的完整参考配置请查看项目站点的 `hugo.yaml`。
