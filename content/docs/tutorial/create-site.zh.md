---
title: 创建站点
linkTitle: 创建站点
weight: 30
description: 从空目录到第一个可预览的双语页面。
---

这一页从零建一个最小双语站点。如果你想要一个已经配置完整的参考，直接看[项目站点](../project-site/)。

## 建立骨架 {#create-the-skeleton}

```sh
hugo new site --format yaml my-docs
cd my-docs
hugo mod init github.com/example/my-docs
hugo mod get github.com/pgsty/oink@{{% param tdVersion.latest %}}
```

## 最小配置 {#minimum-configuration}

把下面的内容存为
`hugo.yaml`。这是能跑起来的最小集合，逐项含义见[基础配置](../configuration/)：

```yaml {title="hugo.yaml" collapse=34}
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

提交 `go.mod` 与 `go.sum`。不要添加 npm 挂载或 PostCSS 管线。

> [!NOTE] `markup.goldmark.renderer.unsafe: true`
> 允许在 Markdown 里写内联 HTML。它面向的是受信任的项目作者，不是给不受信任投稿用的过滤器。

## 组织双语内容 {#organize-bilingual-content}

OINK 用文件名后缀区分语言，译文和原文并排放在同一个目录：

- content/
  - _index.md
  - _index.zh.md
  - docs/
    - _index.md
    - _index.zh.md
    - getting-started.md
    - getting-started.zh.md
  - blog/
    - _index.md
    - _index.zh.md
{.filetree}

## 稳定的标题 ID {#stable-heading-ids}

这是双语站点最容易踩的坑：**Hugo 从标题文本生成 ID**，所以中文标题会生成中文ID，导致
`/docs/page/#install` 和 `/zh/docs/page/#安装` 指向同一个语义位置却是两个锚点。

解决办法是在译文标题里显式写上英文原文的 ID：

```markdown {title="getting-started.md"}
---
title: Getting started
weight: 10
---

## Install {#install}

Install the product.
```

```markdown {title="getting-started.zh.md"}
---
title: 开始使用
weight: 10
---

## 安装 {#install}

安装产品。
```

这样两种语言的 `#install` 锚点都能用，站内深链在切换语言时不会失效。

翻译已有页面时，ID 要从英文渲染出的 HTML 里复制，不要凭标题文本猜。

## 预览与构建 {#preview-and-build}

```sh
hugo server --disableFastRender
```

再单独验证一次生产构建——开发服务器和生产构建的资源管线不完全相同：

```sh
hugo --gc --minify
```

在加自定义布局之前，先确认这几项正常：

- `/docs/` 和 `/zh/docs/` 都能打开
- 语言选择器能切换
- 本地搜索有结果
- 浏览器控制台没有报错

## 逐步添加功能 {#add-features-incrementally}

先放 Logo 和品牌素材，再配仓库链接和菜单。图表、API 文档、内容组件只加在真正需要的页面上——OINK会按页面用到的功能决定发布哪些本地运行时，没用到就不下发。

如果站点需要带业务语义的短代码，放在站点自己的 `layouts/_shortcodes/`
下。只有当接口已经不含站点假设、并且确实要被多个站点复用时，才考虑移进主题。

## 下一步 {#next-steps}

- [基础配置](../configuration/)：把配置补完整
- [创作内容](/zh/docs/content/)：内容组织与写作规范
- [部署](/zh/docs/deploy/)：选一个托管目标
