---
title: 使用 Oink 主题
weight: 1
date: 2021-12-08T10:33:16+01:00
description: 导入 Oink Hugo Module，或查看独立项目站点。
---

Oink 将消费站点与持续维护的主题分开。站点负责自己的内容、品牌素材、配置和业务组件；主题负责公共外壳、样式、浏览器运行时与可复用短代码。

## 推荐安装方式 {#recommended-setup}

把 `github.com/pgsty/oink` 作为固定版本的 Hugo Module 导入。独立的
[`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
仓库通过中英文内容、本地搜索、深色模式、图表、API 文档与组件示例，演示完整生产契约。

熟悉 Hugo 的用户可以[从零开始](start-from-scratch/)。现有 Docsy 站点应使用[迁移指南](/zh/docs/oink/migration/)，不要手工重新创建外壳。

## 主题源码选项 {#theme-source-options}

推荐使用已发布的 `github.com/pgsty/oink` 模块标签。完整发布归档、固定版本的 Git
submodule 或固定 commit 的 clone 也可以使用。选择之前请阅读[其他安装方式](/zh/docs/get-started/other-options/)；生产环境绝不能跟随未固定版本的分支。

## 构建契约 {#build-contract}

无论选择哪一种源码方式，都必须能够通过以下命令构建站点：

```sh
hugo --gc --minify
```

项目站点仓库中的 Node 命令只供维护者运行回归测试，不是消费站点的前提条件。
