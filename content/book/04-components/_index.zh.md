---
title: 用 Markdown 组件组织页面
linkTitle: 组件
description: 用提示块、步骤、标签页、带标题的代码、参数表、文件树和卡片，把 Quick start 改成读者能顺着做下去的页面；这些全都写成 Markdown，放到 GitHub 上照样好读。
book_kind: chapter
book_number: 4
weight: 40
aliases:
  - /book/03-compose/
---

读者扫视一篇技术文档时，会寻找几种固定的形状：不能错过的警告、按顺序执行的步骤、适合自己平台的命令、专门来查的那个设置项。OINK 用普通 Markdown 外加至多一行属性画出每种形状，所以同一份源码在 GitHub 上、打印出来、交给 AI 助手时，依然是引用块、列表或表格。本章把这些形状逐一加到 Acme DB 的页面上；下面每段源码之后紧跟着它的渲染效果。

## 选用原则 {#pattern}

按读者正在做的事挑选组件，而不是按外观：

| 读者需要 | 组件 | 你要写的 |
| --- | --- | --- |
| 一个不能错过的条件 | 提示块 | 以 `[!IMPORTANT]` 或其他类型开头的引用块 |
| 按顺序执行的流程 | 步骤 | 下一行紧跟 `{.steps}` 的有序列表 |
| 在几个等价方案中选一个 | 标签页 | 相邻的多个代码围栏，各带一个 `{tab="…"}` |
| 要复制的文件或命令 | 带标题的代码 | 带 `{title="…"}` 的代码围栏 |
| 要查阅的设置项 | 参数表 | 下一行紧跟 `{.fields}` 的表格 |
| 目录结构 | 文件树 | `filetree` 代码围栏 |
| 接下来去哪里 | 卡片 | 下一行紧跟 `{.cards}` 的链接列表 |
| 要按的键、状态标签 | 按键、徽章 | `kbd` 和 `badge` 短代码 |
{#tbl-component-choice num="4-1" caption="按读者正在做的事选择组件。"}

其余内容都写成普通正文。如果每一段都装进框里，页面只剩一片噪音，读者也就不再留意这些框了。

## 读者不能错过的条件 {#callout}

Acme DB 在 32 位主机上拒绝启动，跳过这句话的读者会白白浪费十分钟。把它放在 Quick start 顶部、导语下方：

```markdown {title="源码"}
> [!IMPORTANT]
> Acme DB 需要 64 位的 Linux 或 macOS 主机，并且至少有 2 GB 空闲内存。
```

> [!IMPORTANT]
> Acme DB 需要 64 位的 Linux 或 macOS 主机，并且至少有 2 GB 空闲内存。

按读者跳过这个框会有什么后果来选类型：`NOTE` 和 `TIP` 可以放心跳过，`IMPORTANT` 表示缺了它任务就会失败，`WARNING` 和 `CAUTION` 表示会有东西出错或变慢，`DANGER` 标出无法撤销的操作。[提示块](/zh/docs/components/callout/)列出了全部十种类型，以及可折叠的 `[!DETAILS]` 写法。

## 分步骤的操作 {#steps}

在“Start the server”这一节，读者要按顺序做三件事。在有序列表紧接着的下一行写上 `{.steps}`，它就会画成一列带编号的步骤，每一步里都可以放代码：

````markdown {title="源码"}
1. 创建数据目录。

   ```bash
   mkdir -p ./acme-data
   ```

1. 在前台启动服务。

   ```bash
   acme server --data ./acme-data
   ```

1. 在第二个终端里确认服务有响应。

   ```bash
   curl http://localhost:8086/health
   ```
{.steps}
````

1. 创建数据目录。

   ```bash
   mkdir -p ./acme-data
   ```

1. 在前台启动服务。

   ```bash
   acme server --data ./acme-data
   ```

1. 在第二个终端里确认服务有响应。

   ```bash
   curl http://localhost:8086/health
   ```
{.steps}

每一项都编号为 `1.`，让 Markdown 替你计数，增加步骤时就不必重新编号。`{.steps}` 必须紧贴最后一项：中间隔了一个空行，它就不再附着到列表上，而是作为带花括号的文字显示在页面上。

## 用标签页呈现选择 {#tabs}

有的读者直接运行二进制程序，有的读者用容器。两个相邻、带 `tab` 属性的代码围栏会合成一组标签页，读者只会看到适用于自己的那一个：

````markdown {title="源码"}
```bash {tab="二进制" group="runtime" value="binary"}
acme server --data ./acme-data
```
```bash {tab="Docker" value="docker"}
docker run -d -p 8086:8086 -v acme-data:/var/lib/acme acme/acme-db:3.0
```
````

```bash {tab="二进制" group="runtime" value="binary"}
acme server --data ./acme-data
```
```bash {tab="Docker" value="docker"}
docker run -d -p 8086:8086 -v acme-data:/var/lib/acme acme/acme-db:3.0
```

`group` 把所有同名的标签页组联动起来：在这里选中 Docker，全站每一组 `runtime` 标签页都会跟着切换，而且这个选择会被记住。用 URL 片段 `#runtime-docker` 打开本页时，会直接选中 Docker。在 GitHub 上、打印时以及没有 JavaScript 的环境里，两个代码块会先后全部显示，任何内容都不会被藏起来。

## 供读者复制的代码 {#code}

读者会把配置复制进文件，所以要告诉他们是哪个文件，并标出关键的那一行：

````markdown {title="源码"}
```toml {title="/etc/acme/acme.toml" hl_lines="3"}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"

[retention]
default = "90d"
```
````

```toml {title="/etc/acme/acme.toml" hl_lines="3"}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"

[retention]
default = "90d"
```

终端会话用 `console` 代码围栏，并写出提示符。这样复制按钮只复制命令本身，既不带 `$`，也不带输出：

````markdown {title="源码"}
```console
$ acme sql "SELECT host, usage FROM cpu LIMIT 1"
 host | usage
------+-------
 web1 |  0.64
$ acme sql "SELECT count(*) FROM cpu"
```
````

```console
$ acme sql "SELECT host, usage FROM cpu LIMIT 1"
 host | usage
------+-------
 web1 |  0.64
$ acme sql "SELECT count(*) FROM cpu"
```

[代码块](/zh/docs/components/code/)介绍了行号、用 `collapse` 折叠长文件，以及链接到单独某一行。

## 用参数表列出设置项 {#fields}

Starter 的 `content/docs/reference/configuration.md` 是读者查配置项的地方。在表格下一行加上 `{.fields}`，每个键就各占一条，类型和默认值显示为小标签，说明文字占满整行。四列表格在手机上会挤得没法读，这种写法却依然清楚：

```markdown {title="源码"}
| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `server.listen` | string | `":8086"` | HTTP 写入和查询使用的地址与端口 |
| `server.data_dir` | string | `"./acme-data"` | 存放数据文件和预写日志的目录 |
| `retention.default` | duration | `"90d"` | 表没有设置自己的保留期时，数据点保留多久 |
{.fields meta="type default"}
```

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `server.listen` | string | `":8086"` | HTTP 写入和查询使用的地址与端口 |
| `server.data_dir` | string | `"./acme-data"` | 存放数据文件和预写日志的目录 |
| `retention.default` | duration | `"90d"` | 表没有设置自己的保留期时，数据点保留多久 |
{.fields meta="type default"}

`meta` 依次指明中间各列的角色，于是 `type` 和 `default` 渲染为小标签。每一条都有自己的锚点，读者在本地搜索里搜某个键名时，会直接打开这一条。

## 目录结构 {#filetree}

第一次写入之后，读者想知道服务往磁盘上放了什么、哪些可以删除。`filetree` 代码围栏把它们一条一条说清楚：

````markdown {title="源码"}
```filetree {title="首次写入后的 ./acme-data"}
- acme-data/
  - wal/          # 预写日志，崩溃后重放
  - tables/
    - cpu/        # 每张表一个目录
      - 2026-11/  # 每月一个分区
  - acme.lock     # 服务运行期间一直持有
```
````

```filetree {title="首次写入后的 ./acme-data"}
- acme-data/
  - wal/          # 预写日志，崩溃后重放
  - tables/
    - cpu/        # 每张表一个目录
      - 2026-11/  # 每月一个分区
  - acme.lock     # 服务运行期间一直持有
```

缩进决定层级，结尾的 `/` 表示目录，`#` 后面的文字会成为对齐的注释。读者可以折叠目录。

## 用卡片指明下一步 {#cards}

Quick start 的结尾要把读者送往下一站。在链接列表下一行加上 `{.cards}`，列表就变成网格，破折号后面的文字成为每张卡片的描述：

```markdown {title="源码"}
- [备份服务器](/docs/operations/backup/) — 为运行中的服务器做快照，并在另一台主机上恢复。
- [配置](/docs/reference/configuration/) — acme.toml 里的每个键，以及它的类型和默认值。
{.cards}
```

下面用同样的写法，指向本书接下来的几章：

- [图表与媒体](/zh/book/05-media/) — 画出架构图，为基准测试做图表，播放一段终端录像。
- [博客](/zh/book/06-blog/) — 发布版本说明和文章，附上作者和系列。
- [书籍](/zh/book/07-book/) — 为图和表编号、交叉引用，打印整本书。
{.cards}

## Markdown 写不出来的时候 {#shortcodes}

要按的键和状态标签没有对应的 Markdown 语法，所以它们是短代码：

```markdown {title="源码"}
用 {{</* kbd "Ctrl" "C" */>}} 停止服务。分层存储在 Acme DB 3.0 中仍是 {{</* badge text="实验性" tone="warning" */>}} 功能。
```

用 {{< kbd "Ctrl" "C" >}} 停止服务。分层存储在 Acme DB 3.0 中仍是 {{< badge text="实验性" tone="warning" >}} 功能。

OINK 共有 29 个短代码，用于带图标的卡片、包含多段内容的标签页、带编号的书籍插图等；[组件](/zh/docs/components/)为每一个都准备了单独的页面。只有 Markdown 写法表达不了时才用短代码，因为短代码是 Hugo 语法，在 GitHub 上会原样显示出来。

## 看看它如何降级 {#fallback}

打开 Quick start 按 {{< kbd "M" >}}，或者在它的地址末尾加上 `index.md`。在 Markdown 副本里，提示块保留为 `> [!IMPORTANT]`，步骤是带编号的列表，标签页是两个代码围栏，参数表是一张表格。打印视图也是如此，每个标签页面板都会展开。这就是组件以 Markdown 为先的原因：GitHub 上的读者、打印出来的纸页和 AI 助手，拿到的都是完整内容。

## 检查成果 {#checkpoint}

- Quick start 以 IMPORTANT 提示块开头，启动流程显示为带编号的步骤，步骤里含有代码。
- 在任意一组 `runtime` 标签页里选中 Docker，全站其他各组都会跟着切换。
- 配置参考页显示三条带类型和默认值标签的条目，搜索 `retention.default` 会打开对应的条目。
- 页面的 Markdown 副本里没有组件产生的 HTML。

## 交给 agent {#agent}

```text {num="4-1" caption="提示词：用组件重新组织页面。" #eg-agent-components}
用 OINK 的 Markdown 组件改写 content/docs/get-started/quick-start.md：硬件要求
用 IMPORTANT 提示块，启动流程用 {.steps}，二进制和 Docker 两种启动命令写成
group 为 "runtime" 的标签页，页尾加上卡片，指向备份页和配置页。把配置参考页
改成带类型列和默认值列的 {.fields} 表格。语法参考
https://oink.pgsty.com/zh/docs/components/ 下的各个组件页面。正文和命令一律
保持不变，对中文版本做同样的修改，然后在浏览器里检查两个页面及其 Markdown 副本。
```
