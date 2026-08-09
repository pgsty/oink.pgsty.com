---
title: 开始之前
date: 2021-12-08
weight: 1
description: 构建 OINK 站点的前提条件。
---

消费端唯一必需的工具是 Hugo
Extended。是否需要 Git 和 Go，取决于主题源码的获取方式。

<a id="install-hugo"></a>

## 安装 Hugo Extended {#install-hugo-extended}

安装 `{{% param hugoMinVersion %}}` 或更高版本。当前验证基线为
`0.164.0`。如果发布版本调整了这些数值，应以对应版本的支持矩阵为准。

核对实际选中的二进制文件：

```sh
hugo version
```

输出必须包含
`extended`；标准版 Hugo 无法编译主题的 SCSS。请根据平台使用 Hugo 官方[安装指南][installation guides]，并在本地开发与 CI 中固定同一版本。

## 按需安装 Git {#install-git-when-needed}

克隆站点、使用 submodule、保留 `.GitInfo`
或获取主题 checkout 时需要 Git。运行以下命令验证：

```sh
git --version
```

从已经解压的离线归档构建站点时，Hugo 可以在没有网络的情况下运行；不过仍建议使用版本控制管理源码。

## 只有 Hugo 模块需要 Go {#install-go-only-for-hugo-modules}

Hugo 模块命令会使用 Go。如果站点以 Hugo 模块形式导入主题，请安装 Go 并运行：

```sh
go version
hugo mod graph
```

使用固定版本归档、相邻主题目录或 Git submodule 时，站点构建不需要 Go。

<a id="install-postcss"></a>

## 不要安装前端工具链 {#do-not-install-a-frontend-toolchain}

OINK 将 Bootstrap、Font Awesome、LTR 与 RTL
CSS、字体、搜索和浏览器运行时作为有版本的本地资源提供。消费站点不需要为主题安装 Node.js、npm、PostCSS、Autoprefixer 或 RTLCSS。

项目站点仓库中的 Node 命令只供维护者使用。消费端的生产命令是：

```sh
hugo --gc --minify
```

## 检查完整发行物 {#check-the-complete-distribution}

用于离线或网络隔离环境时，请确认主题归档包含 `go.mod`、`hugo.yaml`、
`assets/`、`layouts/`、`static/`、`i18n/`、`LICENSE`、`NOTICE` 与
`VENDOR.json`。进入隔离环境前安装 Hugo
Extended，然后在禁用网络的情况下运行同一个构建命令。

## 后续步骤 {#whats-next}

- [查看双语项目站点](example-site-as-template/)
- [从零创建站点](start-from-scratch/)
- [比较发行方式](/zh/docs/get-started/other-options/)

[installation guides]: https://gohugo.io/installation/
