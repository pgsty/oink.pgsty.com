---
title: 其他安装方式
description: 使用 OINK 归档、Git checkout 或 Hugo Module。
date: 2021-12-08
weight: 2
---

推荐安装方式是使用 `github.com/pgsty/oink` Hugo
Module。以下选项只改变 Hugo 获取同一份主题源码的方式，不会改变内容，也不会改变 Hugo-only 构建命令。

## 前提条件 {#prerequisites}

所有方式都需要 Hugo Extended `{{% param hugoMinVersion %}}`
或更高版本。Git 方式需要 Git，Hugo 模块需要 Go。消费站点采用任何一种方式都不需要 Node.js、npm、PostCSS 或 Autoprefixer。

## 选项 1：完整发布归档 {#option-1-complete-release-archive}

完整离线归档包含主题、本地浏览器运行时、字体、许可证、NOTICE、vendor 清单和 checksum。它是网络隔离构建的首选输入，也是保留准确发行物最简单的方式。

把主题解压到站点的 `themes/` 目录：

```text
site/
├── hugo.yaml
└── themes/
    └── oink/
```

配置如下：

```yaml
theme: oink
```

解压前先校验归档 checksum。只能使用明确发布版本附带的归档，不要把本地组装文件表述为已经发布的发行物。

<a id="option-2-clone-the-docsy-theme"></a>

## 选项 2：Git submodule {#option-2-git-submodule}

submodule 会在站点仓库中记录准确的 OINK 仓库 commit：

```sh
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout THEME_REF
git add .gitmodules themes/oink
git commit -m "Add OINK theme at THEME_REF"
```

配置嵌套主题路径：

```yaml
theme: oink
```

CI 必须在运行 Hugo 前初始化 submodule。请将 `THEME_REF`
固定为发布标签或不可变的 commit，不要让生产环境跟随 `main`。

## 选项 3：固定版本的 Git 克隆 {#option-3-pinned-git-clone}

如果托管平台要求构建输入包含完整主题树，或者站点需要随仓库提供已经评审的副本，可以使用克隆：

```sh
git clone https://github.com/pgsty/oink.git themes/oink
git -C themes/oink checkout THEME_REF
```

同样设置
`theme: oink`。请记录最终解析出的 commit，以及恢复克隆的流程。如果把这些文件提交到站点仓库，必须保留 OINK 的
`LICENSE`、`NOTICE` 和 `VENDOR.json`。

<a id="option-3-docsy-as-an-npm-package"></a>

> OINK 不以 npm 包形式发行。现有 Docsy npm 用户应遵循
> [npm 迁移指南](/zh/docs/update/npm-package/)。

## 选项 4：Hugo Module {#option-4-hugo-module}

把公开模块固定到发布标签或不可变 commit：

```sh
hugo mod get github.com/pgsty/oink@THEME_REF
hugo mod tidy
```

在 `hugo.yaml` 中导入：

```yaml
module:
  imports:
    - path: github.com/pgsty/oink
```

本地开发主题时，请使用被忽略的 Go workspace，把站点模块与同级 OINK
checkout 一起加入。

## 预览与验证 {#preview-and-verify}

所有源码方式都使用相同命令：

```sh
hugo server --disableFastRender
hugo --gc --minify
```

请验证：全新生产构建能够在没有 `node_modules`
目录的情况下完成；本地资源能在配置的 `baseURL`
下正确解析；中英文页面与搜索索引都已经生成。

版本变更和覆盖审查请参阅[更新 OINK](/zh/docs/update/)。
