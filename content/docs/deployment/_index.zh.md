---
title: 部署与预览
linkTitle: 部署
weight: 7
icon: fa-solid fa-cloud-arrow-up
description: 部署 Docsy 站点。
---

Hugo 站点有多种部署方式，包括 Netlify、Firebase
Hosting、Bitbucket 搭配 Aerobatic 等；完整列表请参阅
[托管与部署](https://gohugo.io/hosting-and-deployment/)。Hugo 也能轻松地在本地运行站点，以便快速预览内容。

## 构建环境与索引 {#build-environments-and-indexing}

默认情况下，使用 `hugo` 构建的站点（相对于在本地通过 `hugo server`
提供服务）会采用 Hugo 的 `production` 构建环境。以 `production`
环境构建并部署的 Docsy 站点可以被搜索引擎索引，包括
[Google 自定义搜索引擎](/zh/docs/content/search/#google-search)。生产构建还会针对线上部署优化 JavaScript 和 CSS，例如输出压缩后的 JS，而不是更易阅读的原始源码。

如果不希望已部署的站点被搜索引擎索引（例如线上站点仍在开发），或者需要构建开发版本用于离线分析，可以把 Hugo 构建环境设为其他值，例如
`development`（使用 `hugo server`
本地运行时的默认值）、`test`，或任意自定义的环境名称。

最简单的设置方式是在 `hugo` 命令中使用 `-e` 参数，例如：

```
hugo -e development
```
