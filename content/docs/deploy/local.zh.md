---
title: 在本地运行站点
linkTitle: 本地预览
weight: 10
description: 使用 Hugo 开发服务器在本地预览内容。
aliases: [/docs/deployment/local/]
---

根据所选部署方式，你可能需要在开发期间于本地运行站点，以便预览内容变更。具体步骤如下：

1. 确认已经从代码仓库克隆站点文件，并将本地副本更新至最新状态。

1. 按照[前提条件与安装][prereq]中的说明，安装 Hugo
   Extended，以及所选主题安装方式获取源码时需要的工具。Node.js 和 PostCSS 不是站点构建的前提条件。
1. 在站点根目录运行 `hugo server`。默认情况下，可以通过 <http://localhost:1313>
   访问站点。

站点在本地运行后，Hugo 会监视内容变更并自动刷新页面。如果本地有多个 Git 分支，切换分支后，本地站点也会随之反映当前分支中的文件。

[prereq]: /zh/docs/tutorial/prerequisites/
