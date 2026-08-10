---
title: 从零新建站点
date: 2021-12-08T09:21:54+01:00
weight: 30
icon: fa-solid fa-file-circle-plus
description: 在没有前端工具链的情况下创建最小双语 OINK 站点。
aliases: [/docs/get-started/docsy-as-module/start-from-scratch/]
---

独立的[双语项目站点](project-site/)是完整参考。需要更小、拥有自身内容结构的站点时，可以采用本流程。

## 创建站点骨架 {#create-the-site-skeleton}

运行：

```sh
hugo new site --format yaml my-new-site
cd my-new-site
```

初始化站点模块并固定 Oink：

```sh
hugo mod init github.com/example/my-new-site
hugo mod get github.com/pgsty/oink@THEME_REF
```

## 添加最低配置 {#add-minimum-configuration}

将以下内容保存为 `hugo.yaml`：

```yaml
title: Product Docs
baseURL: https://docs.example.com/
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    menus:
      main:
        - { name: Docs, pageRef: /docs, weight: 10 }
        - { name: Blog, pageRef: /blog, weight: 20 }
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    menus:
      main:
        - { name: 文档, pageRef: /docs, weight: 10 }
        - { name: 博客, pageRef: /blog, weight: 20 }

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false

params:
  offlineSearch: true
  ui:
    showLightDarkModeMenu: true
    sidebar_menu_foldable: true

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: {{% param hugoMinVersion %}}
```

提交 `go.mod` 与 `go.sum`。不要添加 npm 挂载项或 PostCSS 管线。

## 添加双语内容 {#add-bilingual-content}

创建以下文件：

```text
content/
├── _index.md
├── _index.zh.md
├── docs/
│   ├── _index.md
│   ├── _index.zh.md
│   ├── getting-started.md
│   └── getting-started.zh.md
└── blog/
    ├── _index.md
    └── _index.zh.md
```

每个页面都需要 front matter。例如，`content/docs/getting-started.md` 可以写成：

```markdown
---
title: Getting started
weight: 10
---

## Install {#install}

Install the product.
```

它的 `getting-started.zh.md` 译文保留显式标题 ID：

```markdown
---
title: 开始使用
weight: 10
---

## 安装 {#install}

安装产品。
```

在两个示例中使用相同的显式 ID 不会产生问题，还能直观展示跨语言合同。翻译现有页面时，应从英文渲染 HTML 中复制 ID。

## 预览与构建 {#preview-and-build}

启动开发服务器：

```sh
hugo server --disableFastRender
```

随后单独验证生产构建：

```sh
hugo --gc --minify
```

添加自定义布局前，请检查
`/docs/`、`/zh/docs/`、语言选择器、本地搜索索引和浏览器控制台。

## 逐步添加功能 {#add-features-incrementally}

先复制 Logo 和品牌素材，再添加代码仓库链接与菜单。只在确实需要的页面中加入图表、API 文档和内容组件；OINK 会按需发布对应的本地运行时。

如果站点需要带业务语义的短代码，请将其保留在站点自己的 `layouts/_shortcodes/`
下。只有接口已经摆脱站点假设，并且能被多个站点复用后，才应移入主题。

## 后续步骤 {#whats-next}

- 扩展[基础配置](/zh/docs/tutorial/basic-configuration/)。
- 学习如何[添加内容](/zh/docs/content/adding-content/)。
- 查看 [OINK 架构](/zh/docs/about/architecture/)。
- 选择[部署目标](/zh/docs/deploy/)。
