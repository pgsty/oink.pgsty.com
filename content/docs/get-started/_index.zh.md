---
title: 开始使用
description: 使用 Hugo Extended 构建中英双语 Oink 文档站。
date: 2018-07-30
aliases: [getting-started]
weight: 2
icon: fa-solid fa-rocket
---

Oink 是一款将完整浏览器运行时随主题提供的 Hugo 主题。消费站点只需 Hugo
Extended 即可构建；默认流程不安装 Node.js 软件包、不运行 PostCSS、不依赖 CDN，也不会在构建期间远程下载主题资源。

## 选择起点 {#choose-a-starting-point}

- **Hugo Module（推荐）**：在已有或新建 Hugo 站点中导入
  `github.com/pgsty/oink`。参阅
  [Oink 快速开始](/zh/docs/oink/getting-started/)。
- **项目站点**：把独立的
  [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
  仓库作为完整双语配置与回归参考。
- **现有 Docsy 站点**：按照[迁移指南](/zh/docs/oink/migration/)删除公共覆盖和消费端 npm 资源管线，无需重写正文。

## 安装前提条件 {#install-the-prerequisites}

安装 Git、Go 与 Hugo Extended `{{% param hugoMinVersion %}}`
或更高版本。平台说明和验证命令请参阅[开始之前](docsy-as-module/installation-prerequisites/)。

## 添加 Oink {#add-oink}

在站点根目录运行：

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@THEME_REF
```

然后在 `hugo.yaml` 中导入主题：

```yaml
module:
  imports:
    - path: github.com/pgsty/oink
```

把 `THEME_REF` 固定为发布标签或不可变 commit，并提交 `go.mod` 与 `go.sum`。

## 构建契约 {#build-contract}

所有受支持的模块消费站点都使用相同的预览与构建命令：

```sh
hugo server --disableFastRender
hugo --gc --minify
```

## 后续步骤 {#next-steps}

1. 完成[基础配置](basic-configuration/)。
2. 设置代码仓库、版权信息、Logo 和菜单。
3. 以 `page.md` 和 `page.zh.md` 的形式并置译文。
4. 添加并自定义[内容](/zh/docs/content/)。
5. 选择[部署目标](/zh/docs/deployment/)。
