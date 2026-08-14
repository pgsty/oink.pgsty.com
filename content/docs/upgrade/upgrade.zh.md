---
title: 升级 Oink Hugo Module
linkTitle: Hugo 模块
aliases: [/docs/update/hugo-module/, /docs/updating/updating-hugo-module/]
weight: 10
description: 升级以固定版本 Hugo Module 导入 Oink 的站点。
---

## 固定版本 {#pin-a-version}

生产站点应导入发布标签或不可变的 commit，绝不能跟随未固定版本的分支。在站点根目录，把 Oink 更新到指定 ref：

```sh
hugo mod get github.com/pgsty/oink@TARGET_VERSION
hugo mod tidy
```

请把 `TARGET_VERSION` 替换为发布注记指定的不可变标签，例如
`v0.4.0`。生产升级策略不要使用未限定版本的模块路径或 `@latest`。

## 测试本地 checkout {#test-a-local-checkout}

如果要在不修改已提交模块版本的前提下测试本地 OINK checkout，请使用被忽略的 Go
workspace：

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=/absolute/path/to/oink
export HUGO_MODULE_WORKSPACE=go.work
hugo --gc --minify
```

不要把包含开发者机器专属绝对路径的 `go.work` 提交到仓库。

## 验证解析出的模块 {#verify-the-resolved-module}

检查 Hugo 的依赖图：

```sh
hugo mod graph
```

确认主题解析到预期的标签、commit 或本地 replacement。OINK 不需要运行
`hugo mod npm pack` 或 `npm install`，因为浏览器依赖已经随主题提供。

随后继续[审查主题覆盖](/zh/docs/upgrade/upgrade/)。
