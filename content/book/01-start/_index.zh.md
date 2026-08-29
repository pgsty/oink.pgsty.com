---
title: 从一个能运行的站点开始
linkTitle: 跑起第一个站点
description: 安装唯一必需的工具，启动本地预览，在调整设计前先建立可见的基线。
book_kind: chapter
book_number: 1
weight: 10
---

好的教程首先要给读者一个看得见的结果。对 OINK 而言，这个结果是由 Hugo Extended
在本地提供的官方 Starter——此时还没有改标识、配色、语言组合或内容架构。

## 明确结果 {#outcome}

完成本章时，你应该拥有英文、中文、法语首页，可用的 Docs、Blog、Book 路由，本地搜索，
以及颜色模式控件。这条小基线足以在后续工作中区分内容问题、主题问题与部署问题。

![OINK 文档站第一次成功本地构建后的页面](/images/oink.webp)
{#fig-first-preview num="1-1" caption="第一个里程碑是读者能打开的站点，而不是一份仅仅看起来正确的配置文件。" width=600 height=300}

## 安装前置工具 {#prerequisite}

当前 Starter 需要 Git、Go 1.27 或更新版本，以及 Hugo Extended 0.165.0 或更新版本。
OINK 声明的较低兼容下限仍是 0.160.1，但 Starter 与它的 workflow 有意固定当前持续测试
工具链。不需要 Node.js。

```console
$ go version
go version go1.27.0 darwin/arm64
$ hugo version
hugo v0.165.0+extended+withdeploy darwin/arm64
```

## 启动本地预览 {#preview}

真实项目应通过 GitHub 的 **Use this template** 操作创建仓库。只在本地评估原始模板时，
克隆并启动 Hugo：

```console
$ git clone https://github.com/pgsty/oink-starter.git my-docs
$ cd my-docs
$ hugo server
```

打开 Hugo 输出的地址，修改 `data/home/en.yaml` 里的一句话，再确认浏览器已经显示变更。
一个能对内容修改作出响应的预览，比终端里只显示“服务已启动”更有证明力。

## 记录基线 {#baseline}

在开始定制前，记录四个事实：Hugo 版本、`go.mod` 中的主题版本、正在评审的 commit，
以及你实际打开的路由。第 2 章会在不丢失这条基线的前提下，把运行中的站点组织成内容树。

完整分层流程见[使用 OINK Starter](/zh/docs/start/starter/)，不采用模板的安装方式见
[从零建站](/zh/docs/start/from-scratch/)。
