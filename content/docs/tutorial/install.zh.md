---
title: 安装 Oink
weight: 20
icon: fa-solid fa-puzzle-piece
description: 为站点添加固定版本的 Oink Hugo Module。
aliases: [/docs/oink/getting-started/, /docs/get-started/docsy-as-module/]
---

Oink 以 Hugo Module `github.com/pgsty/oink` 发布。消费站点只需 Hugo
Extended 即可构建；Node.js、npm、PostCSS 和 CDN 托管的浏览器软件包不属于构建契约。

## 前置条件 {#prerequisites}

安装 Git、Go 与 Hugo Extended `0.160.1` 或更高版本。项目站点目前使用 `0.164.0`
验证：

```sh
git --version
go version
hugo version
```

Hugo 版本输出必须包含 `extended`。

## 添加模块 {#add-the-module}

在 Hugo 站点根目录中，如果站点还没有模块，先初始化模块，再固定一个 Oink 版本：

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@THEME_REF
```

请把 `THEME_REF` 替换为 `v0.2.0` 之类的已发布标签，或不可变的 commit。然后在
`hugo.yaml` 中添加导入：

```yaml
module:
  imports:
    - path: github.com/pgsty/oink
```

提交生成的 `go.mod` 与 `go.sum`。生产构建不要跟随未固定版本的分支。

## 预览站点 {#preview-the-site}

启动编辑服务器：

```sh
hugo server --disableFastRender
```

生成生产构建产物：

```sh
hugo --gc --minify
```

Oink 已随主题提供 Bootstrap、Font
Awesome、字体、搜索、图表、API 文档运行时和内容组件。消费站点不需要
`node_modules` 目录。

## 使用本地 checkout 开发 {#develop-against-a-local-checkout}

把主题与站点克隆为同级目录，再使用本地 Go workspace：

```text
~/pgsty/
├── oink/
└── product-docs/
```

```sh
cd ~/pgsty/product-docs
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
hugo server
```

不要把 `go.work` 提交到版本库。已提交的 `go.mod`
仍固定公开模块；workspace 只在本机把它替换为同级 checkout。

## 添加双语内容 {#add-bilingual-content}

先创建英文页面：

```text
content/docs/operations.md
```

然后在旁边添加译文：

```text
content/docs/operations.zh.md
```

front
matter 标识符、代码、命令、参数名与链接目标应保持语义一致；面向读者的正文则需要翻译。为了让不同语言下的深层链接保持稳定，请在中文标题中显式保留英文标题 ID：

```markdown
## 故障恢复 {#failure-recovery}
```

## 配置最小站点 {#configure-the-minimum-site}

最基本的配置很精简：

```yaml
title: Product Docs
baseURL: https://docs.example.com/
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2

params:
  logo: icons/logo.svg
  offlineSearch: true

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: 0.160.1
```

站点扩展后，再逐步加入菜单、输出格式、Markdown 扩展、仓库链接和可选功能。支持的配置模型详见[配置](/zh/docs/content/configuration/)。

## 发布前验证 {#validate-before-publishing}

至少完成以下检查：

1. 使用已经提交模块文件的全新 checkout 构建；
2. 使用固定版本的 Hugo Extended 运行 `hugo --gc --minify`；
3. 浏览具有代表性的英文与中文页面；
4. 验证语言切换、搜索、移动导航、深色模式与打印输出；
5. 如果站点承诺离线运行，检查浏览器网络请求。

这些检查只能证明构建产物成立。发布该产物并验证托管地址，是两个独立的部署步骤。
