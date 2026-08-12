---
title: 环境准备
linkTitle: 环境准备
weight: 10
description: 装好 Hugo Extended，按需要准备 Git 和 Go。
---

消费端唯一必需的工具是 Hugo
Extended。是否还需要 Git 和 Go，取决于你用哪种方式获取主题。

## 安装 Hugo Extended {#install-hugo-extended}

安装 `{{% param hugoMinVersion %}}` 或更高版本。项目站点当前的验证基线是
`0.164.0`。

按平台参照 Hugo 官方[安装指南][installation guides]，装完之后核对实际选中的二进制：

```sh
hugo version
```

输出必须包含 `extended`：

```console
$ hugo version
hugo v0.164.0+extended+withdeploy darwin/arm64
                  ^^^^^^^^
```

标准版 Hugo 没有内置 Sass 编译器，无法编译主题的 SCSS，构建会直接失败。

> [!TIP] 本地开发和 CI 应该固定同一个 Hugo 版本。版本漂移导致的构建差异，排查成本远高于在 CI 里写死一个版本号。

## 什么时候需要 Git {#when-git-is-needed}

以下场景需要 Git：

- 克隆站点仓库
- 用 submodule 或克隆方式获取主题
- 让 Hugo 读取 `.GitInfo`（页面的最后修改时间来自这里）

```sh
git --version
```

从已解压的离线归档构建时，Hugo 可以完全离线运行。不过源码本身仍然建议用版本控制管理。

## 什么时候需要 Go {#when-go-is-needed}

**只有 Hugo Module 方式需要 Go。** 模块命令底层调用 Go 的模块机制：

```sh
go version
hugo mod graph
```

用离线归档、submodule 或克隆方式时，站点构建不需要 Go。

## 不要安装前端工具链 {#no-frontend-toolchain}

OINK 把 Bootstrap、Font
Awesome、LTR 与 RTL 样式、字体、搜索和所有浏览器运行时作为带版本的本地资源随主题发布。

消费站点不需要为主题安装：

- Node.js / npm
- PostCSS / Autoprefixer
- RTLCSS
- 任何 CDN 上的浏览器包

如果你在某份教程里看到给 Docsy 站点装 npm 依赖的步骤，那是上游 Docsy 的流程，不适用于 OINK。

消费端的生产命令只有一条：

```sh
hugo --gc --minify
```

> [!NOTE]
> OINK 项目站点仓库（`oink.pgsty.com`）里确实有 Node 命令，但那些是主题维护者用来跑回归测试的，不是消费站点构建的一部分。

## 离线与网络隔离环境 {#offline-environments}

准备在隔离环境构建时，先确认主题归档包含这些内容：

{{< filetree >}} {{< filetree/folder name="oink" open=true >}}
{{< filetree/file name="go.mod" >}} {{< filetree/file name="hugo.yaml" >}}
{{< filetree/file name="LICENSE" >}} {{< filetree/file name="NOTICE" >}}
{{< filetree/file name="VENDOR.json" >}}
{{< filetree/folder name="assets" >}}{{< /filetree/folder >}}
{{< filetree/folder name="layouts" >}}{{< /filetree/folder >}}
{{< filetree/folder name="static" >}}{{< /filetree/folder >}}
{{< filetree/folder name="i18n" >}}{{< /filetree/folder >}}
{{< /filetree/folder >}} {{< /filetree >}}

`VENDOR.json`
记录了每个第三方组件的版本、来源、许可证路径和 SHA-256，是离线审计的依据。

进入隔离环境之前装好 Hugo Extended，然后在断网状态下运行同一条构建命令验证。

## 下一步 {#next-steps}

- [安装 OINK](../install/)：选择发行方式并固定版本
- [本地优先](/zh/docs/about/local-first/)：这套约束背后的设计原则

[installation guides]: https://gohugo.io/installation/
