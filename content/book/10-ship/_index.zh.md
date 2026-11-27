---
title: 发布、部署与升级
linkTitle: 上线
description: 决定站点要为打印、订阅阅读器和 AI 助手发布哪些格式，运行生产构建，用 Starter 自带的工作流部署，并平稳升级 OINK。
book_kind: chapter
book_number: 10
weight: 100
aliases:
  - /book/06-ship/
---

读者能访问到站点，并且站点能随着 OINK 的演进一直保持正确，才算真正完成。Starter 已经带好了构建设置和部署工作流，所以本章的重点是弄清每一项的作用：构建除了 HTML 还发布什么，Acme DB 的站点怎样部署，以及怎样升级到下一个 OINK 版本。

## 不止发布 HTML {#outputs}

每个页面都可以同时以多种形式发布。Starter 在 `hugo.yaml` 的 `outputs` 下列出了这些形式：

```yaml {title="hugo.yaml"}
outputs:
  home: [HTML, RSS, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| 输出 | 发布位置 | 服务对象 |
| --- | --- | --- |
| `HTML` | 每个页面 | 用浏览器阅读的读者 |
| `markdown` | 页面地址加 `index.md` | AI 助手，以及“复制 Markdown”“查看 Markdown 源码”这两个页面操作 |
| `LLMS` | `/llms.txt`，每种语言一份 | 想了解站点有哪些内容的 agent |
| `print` | `/_print/` 后接分区路径 | 想打印整个分区或存成 PDF 的读者 |
| `RSS` | 分区路径加 `index.xml` | 订阅阅读器 |
| `LLMSFULL` | `/docs/llms-full.txt`，需在 Docs 根页列出 | 想一次请求读完整本手册的 agent |
| `NAVJSON` | `/navigation.json`，需在首页列出 | 规划要读哪些页面的 agent |
{#tbl-outputs num="10-1" caption="构建在 HTML 之外还能发布的格式。"}

每个键都会整体替换该类页面的格式列表，所以新增一种格式时，要把已有的格式一并保留；漏掉的格式会直接停止发布，不会有任何警告。本站七种格式全部发布，你可以就地试试：按 {{< kbd "M" >}} 查看本页的 Markdown，或者打开 [`/zh/llms.txt`](/zh/llms.txt)。

另有两个页面操作会把页面交给 AI 助手：**在 ChatGPT 中打开** 和 **在 Claude 中打开**。它们会把页面地址发送给对应的服务，所以默认关闭，要由你自己打开：

```yaml {title="hugo.yaml"}
params:
  ui:
    page_context_menu:
      assistant_links: true
```

## 生产构建 {#build}

每次部署前，只要改动了配置，就先运行[第 2 章](/zh/book/02-take-over/#review)中的生产构建。它和 Starter 工作流执行的是同一条命令，所以你在本地看到的警告，托管平台上也会出现。然后把 `hugo.yaml`、`go.mod` 和 `go.sum` 与内容一起提交。不要提交本地模块替换，否则托管平台会去寻找一个只存在于你机器上的主题路径。

## 部署 {#deploy}

Starter 在 `.github/workflows/` 中带了两个工作流。选定托管平台，按对应的步骤操作：

1. **GitHub Pages**：在仓库的 **Settings → Pages** 中，把 **Source** 设为 **GitHub Actions**。此后每次推送到 `main` 都会构建并发布站点，GitHub Pages 的地址（包括子路径）会作为 `baseURL` 传入。
1. **Cloudflare Pages**：新建一个 **Direct Upload** 类型的 Pages 项目，再添加两个仓库 secret：`CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN`。工作流在 GitHub Actions 中完成构建，然后上传结果。
1. **检查线上站点**：打开工作流输出的地址，切换语言，试一下搜索，再打开某个页面的 `index.md`。
{.steps}

如果使用自己的域名，先在 `hugo.yaml` 中把 `baseURL` 设为该域名：规范链接、订阅源、`llms.txt` 和社交卡片都依据它生成。其他托管平台、不应被搜索引擎收录的预览部署以及回滚，见[发布上线](/zh/docs/admin/deploy/)。

## 评论与统计分析 {#integrations}

凡是需要联系其他服务的功能，例如 Giscus 评论、Google Analytics、托管搜索，在配置完整之前都保持关闭。配置块只填了一半时，功能仍然关闭，而不是回退到某个公共默认值；统计分析只在生产构建中运行，所以预览永远不会被追踪。所需的配置键见[启用评论](/zh/docs/admin/comments/)和[分析与 SEO](/zh/docs/admin/analytics/)。

## 升级 OINK {#upgrade}

站点在 `go.mod` 中固定到一个 OINK 版本，所以在你决定升级之前，它的构建结果始终不变。要换到新版本，先读它的发布说明，再固定到确切的标签：

```bash
hugo mod get github.com/pgsty/oink@v1.6.0
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

只固定已发布的标签，不要用分支或 `@latest`，这样站点的同一个提交总能构建出同一个站点。接着运行生产构建并阅读警告——新版本改了名的设置都会在警告里点名——再用两种语言各看几个页面，最后把 `go.mod` 和 `go.sum` 一起提交。每个版本改了什么，见[版本升级](/zh/docs/admin/upgrade/)。如果你安装了 OINK 的 agent 技能，也要重新下载一次：文件里写明了它所对应的版本。

## 弄清所处的阶段 {#stages}

“能用了”在不同阶段意味着不同的事。无论是在拉取请求里还是对你的 agent，都要说清楚你指的是哪个阶段：

| 阶段 | 证明了什么 | 没有证明什么 |
| --- | --- | --- |
| 本地预览 | 页面能渲染，修改能显示出来 | 生产构建没有问题 |
| 生产构建 | 内容、配置和固定的版本能一起构建 | 托管平台会以同样的方式构建 |
| 工作流通过 | 托管平台已经构建并上传了站点 | 线上页面显示正确 |
| 线上站点已检查 | 读者拿到的就是你审阅过的站点 | 下一次改动的任何情况 |
{#tbl-delivery-stages num="10-2" caption="从预览到线上站点的四个阶段，以及每个阶段还没有证明的事。"}

## 检查成果 {#checkpoint}

- 生产构建以 `Total in …` 结束，并且你读过它上方的每一条警告。
- 线上站点提供两种语言、搜索、`llms.txt` 以及页面的 `index.md`。
- `go.mod` 写明了确切的 OINK 标签，`hugo mod graph` 显示的也是同一个。

## 交给 agent {#agent}

```text {num="10-1" caption="提示词：为站点发布做准备。" #eg-agent-ship}
为部署准备好这个站点。
检查 hugo.yaml 中的生产 baseURL 是否为 <https://docs.acme.example/>，outputs 是否保留了 HTML、markdown、LLMS、print 和 RSS，go.mod 是否固定到一个确切的、已发布的 OINK 标签。
运行生产构建，修复每一条警告。
不要推送、部署，也不要更改固定的版本。
完成后列出你改了什么，并说明站点已经到达 https://oink.pgsty.com/zh/book/10-ship/#stages 中的哪个阶段。
```

## 下一步 {#next}

你已经亲手把 OINK 站点的每一层都搭建过一遍。接下来，本书没有回答的问题可以去参考文档里找：

- [组件](/zh/docs/components/) — 每个组件一页，列出全部选项，以及它在打印版和 Markdown 中的输出。
- [定制站点](/zh/docs/customize/) — 导航、搜索、多语言、版本与打印，逐项讲解每个设置。
- [案例库](/zh/case/) — 四十多个生产站点，各自展示了什么、又是怎样实现的。
- [快速上手](/zh/docs/start/#agent-skill) — 为你的 agent 安装 OINK 技能。
{.cards}
