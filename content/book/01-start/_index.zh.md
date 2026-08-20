---
title: 从一个能运行的站点开始
linkTitle: 跑起第一个站点
description: 安装唯一必需的工具，启动本地预览，在调整设计前先建立可见的基线。
book_kind: chapter
book_number: 1
weight: 10
---

好的教程首先要给读者一个看得见的结果。对 OINK 而言，这个结果是一个由 Hugo Extended
在本地提供的双语站点——此时还没有改标识、配色或内容架构。

## 明确结果 {#outcome}

完成本章时，你应该拥有英文首页、对应的中文页面、可用的 Docs 与 Blog 路由、本地搜索，
以及颜色模式控件。这条小基线足以在后续工作中区分内容问题、主题问题与部署问题。

![OINK 文档站第一次成功本地构建后的页面](/images/oink.webp)
{#fig-first-preview num="1-1" caption="第一个里程碑是读者能打开的站点，而不是一份仅仅看起来正确的配置文件。" width=600 height=300}

## 安装前置工具 {#prerequisite}

OINK 消费站点需要 Hugo Extended 0.160.1 或更高版本。Node.js 属于本仓库的维护者测试工具链，
不是普通消费站点的构建要求。

```console
$ hugo version
hugo v0.160.1+extended
```

## 启动本地预览 {#preview}

克隆文档站，进入 checkout，然后启动 Hugo，同时显示草稿、未来内容和已过期内容：

```console
$ git clone https://github.com/pgsty/oink.pgsty.com.git my-docs
$ cd my-docs
$ hugo server -DFE --disableFastRender
```

打开 Hugo 输出的地址，修改 `content/_index.md` 里的一句话，再确认浏览器已经显示变更。
一个能对内容修改作出响应的预览，比终端里只显示“服务已启动”更有证明力。

## 记录基线 {#baseline}

在开始定制前，记录四个事实：Hugo 版本、`go.mod` 中的主题版本、正在评审的 commit，
以及你实际打开的路由。第 2 章会在不丢失这条基线的前提下，把运行中的站点组织成内容树。

完整的安装方式见[快速上手](/zh/docs/start/)与[从零建站](/zh/docs/start/from-scratch/)。

