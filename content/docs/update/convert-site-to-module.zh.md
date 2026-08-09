---
title: 将 Docsy 站点迁移到 OINK
aliases: [/docs/updating/convert-site-to-module/]
weight: 4
description: 用仅依赖 Hugo 的 OINK 主题替换 Docsy 消费端工具链。
---

这次迁移会删除复制到站点中的公共外壳覆盖，以及消费端 npm 资源管线，但不要求批量重写 Markdown 正文。

## 开始之前 {#before-you-begin}

新建工作分支，并确认现有站点能够构建。盘点 `layouts/`、`assets/`、`static/` 和
`i18n/` 下的自定义文件，将其分为三类：

- 已经由 OINK 提供的 Docsy 公共外壳代码；
- 已经由 OINK 提供的可复用组件；
- 必须保留的站点品牌、产品页面或业务组件。

不要删除第三类文件。

## 选择主题发行方式 {#select-a-theme-distribution}

选择固定版本的 Git checkout、版本归档、完整离线发行包或公开的 Oink Hugo
Module。如果要在本地临时演练，请导入 Oink，并使用 Go
workspace 解析本地 checkout：

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=/absolute/path/to/oink
export HUGO_MODULE_WORKSPACE=go.work
hugo --gc --minify
```

这样可以测试 OINK，而不会把开发者专属路径写入站点配置或 `go.mod`。

## 移除消费端资源管线 {#remove-the-consumer-asset-pipeline}

删除只用于获取 Bootstrap、Font
Awesome、字体或主题浏览器运行时的 npm 挂载项与构建步骤。删除仅为 Docsy 存在的
`postCSS` 调用和 Autoprefixer 步骤。如果站点自有软件仍然需要
`package.json`，请继续保留；但文档构建本身必须能够在不安装这些软件包的情况下完成。

## 移除公共覆盖 {#remove-common-overrides}

OINK 直接提供文档与博客外壳、顶部导航栏、页脚、侧栏、目录、搜索、语言选择器、head 资源和核心内容组件。请按依赖关系逐组删除站点中的对应覆盖。

自定义首页、门户、下载页、产品数据和业务短代码应继续保留，直到有明确的替代实现。详细的删除/保留矩阵请参阅[迁移指南](/zh/docs/oink/migration/)。

## 验证结果 {#verify-the-result}

从全新 checkout 开始，在系统中仅提供 Hugo Extended，然后运行：

```sh
hugo --gc --minify
```

检查双语页面集、本地搜索、深色模式、移动端导航、打印输出、图表、API 文档、内容组件和站点专属页面。查看浏览器网络日志，确认主题默认资源均来自同源地址。

只有迁移后的构建与视觉检查全部通过，才可以删除已经过时的配置、lockfile 或工作流步骤。
