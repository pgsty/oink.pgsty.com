---
title: 安装 OINK
linkTitle: 安装 OINK
weight: 20
description:
  用 Hugo Module 固定一个 OINK
  版本，或选择离线归档、submodule、克隆三种替代方式。
---

OINK 以 Hugo Module `github.com/pgsty/oink`
发布。**推荐所有站点使用模块方式**——它是唯一能让 Hugo 自己解析版本、校验 checksum、并在
`go.sum` 里留下审计记录的方式。

另外三种方式面向特定约束：网络隔离、平台要求完整源码树、或者组织内部需要评审主题副本。它们都在[其他安装方式](#other-installation-methods)一节。

## 前置条件 {#prerequisites}

模块方式需要 Git、Go 和 Hugo Extended `{{% param hugoMinVersion %}}`
或更高版本：

```sh
git --version
go version
hugo version
```

`hugo version` 的输出必须包含
`extended`。标准版 Hugo 无法编译主题的 SCSS，会在构建时报错。

详细的平台安装说明见[环境准备](../prerequisites/)。

## 添加模块 {#add-the-module}

在站点根目录初始化模块（如果还没有），然后固定一个 OINK 版本：

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{% param tdVersion.latest %}}
```

在 `hugo.yaml` 中导入：

```yaml {title="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

提交生成的 `go.mod` 与 `go.sum`。

> [!IMPORTANT] 生产站点必须固定到发布标签或不可变 commit，不要跟随 `main`。
> `@latest` 是一次性解析动作，不是版本策略——它会把当时的最新版本写进
> `go.mod`，但下次别人执行时可能解析到不同结果。

## 预览与构建 {#preview-and-build}

```sh
hugo server --disableFastRender   # 本地预览
hugo --gc --minify                # 生产构建
```

Bootstrap、Font
Awesome、字体、搜索、图表、API 文档运行时和内容组件都随主题提供。**消费站点不需要
`node_modules` 目录**，也不需要为主题安装任何前端工具链。

## 用本地 checkout 开发主题 {#develop-against-a-local-checkout}

只有在你要同时改主题和站点时才需要这一节。把两个仓库克隆为同级目录：

```text {title="同级目录布局" copy=false}
~/pgsty/
├── oink/            # 主题
└── product-docs/    # 你的站点
```

用 Go workspace 把模块指向本地：

```sh
cd ~/pgsty/product-docs
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
hugo server
```

> [!WARNING] 不要把 `go.work` 提交到版本库。已提交的 `go.mod`
> 仍然固定公开模块版本；workspace 只在你本机把它替换成同级 checkout。CI 和生产构建看不到
> `go.work`，用的仍是 `go.mod` 里固定的版本。

## 其他安装方式 {#other-installation-methods}

以下三种方式不需要 Go，站点用 `theme: oink` 而不是 `module.imports`
引用主题。它们共同的代价是：**版本解析和完整性校验要你自己负责**。

### 离线归档 {#offline-archive}

网络隔离环境的首选。完整归档包含主题、本地浏览器运行时、字体、`LICENSE`、`NOTICE`、`VENDOR.json`
和 checksum。

```text {title="主题目录布局" copy=false}
site/
├── hugo.yaml
└── themes/
    └── oink/
```

```yaml {title="hugo.yaml"}
theme: oink
```

解压前先校验归档 checksum。只使用发布版本附带的归档——本地自己打包的文件不能对外表述为已发布发行物。

### Git submodule {#git-submodule}

在站点仓库中记录准确的主题 commit：

```sh
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{% param tdVersion.latest %}}
git add .gitmodules themes/oink
git commit -m "Add OINK theme at {{% param tdVersion.latest %}}"
```

CI 必须在运行 Hugo 之前初始化 submodule，否则 `themes/oink` 是空目录：

```sh
git submodule update --init --recursive
```

### 固定版本克隆 {#pinned-clone}

托管平台要求构建输入包含完整主题树时使用：

```sh
git clone https://github.com/pgsty/oink.git themes/oink
git -C themes/oink checkout {{% param tdVersion.latest %}}
```

记录最终解析出的 commit 和恢复流程。如果把这些文件提交到站点仓库，**必须保留 OINK 的
`LICENSE`、`NOTICE` 和 `VENDOR.json`**。

### 四种方式对比 {#comparison}

| 方式            | 需要 Go | 版本可审计        | 适用场景           |
| --------------- | ------- | ----------------- | ------------------ |
| **Hugo Module** | 是      | `go.sum` 自动校验 | 默认推荐           |
| 离线归档        | 否      | 手工核对 checksum | 网络隔离           |
| Git submodule   | 否      | 仓库记录 commit   | 需要主题源码在库内 |
| 固定版本克隆    | 否      | 需自行记录        | 平台要求完整树     |

## 下一步 {#next-steps}

- [创建站点](../create-site/)：从空目录到第一个页面
- [基础配置](../configuration/)：站点身份、语言、搜索
