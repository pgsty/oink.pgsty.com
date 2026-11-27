---
title: 写一页，并给它安排位置
linkTitle: 页面
description: 搭好示例站点，用三个 front matter 键和稳定的标题写一页，再让内容树把它放进侧栏、翻页器和第二种语言。
book_kind: chapter
book_number: 3
weight: 30
aliases:
  - /book/02-structure/
---

OINK 站点的主体是页面，而一个页面就是一个 Markdown 文件，文件路径就是它的地址。导航不用你手写：目录树会变成侧栏，文件的先后顺序会变成翻页器，旁边一个带 `.zh.md` 后缀的同名文件就是它的中文版本。本章先搭好示例站点，再往里加一页。

## 搭建示例站点 {#setup}

1. 克隆 Starter，启动预览：

   ```bash
   git clone https://github.com/pgsty/oink-starter.git acme-docs
   cd acme-docs
   hugo server
   ```

1. 给站点起名。`hugo.yaml` 里的前两项设置标着 `CHANGE ME`；标题写成一个 YAML 锚点，每种语言都会复用它：

   ```yaml {title="hugo.yaml"}
   title: &siteTitle Acme DB
   baseURL: https://docs.acme.example/
   ```

1. 打开 <http://localhost:1313/docs/>。Starter 的 Docs 分区在侧栏里有四个分组：Introduction、Get Started、Tutorial 和 Reference。顶部导航栏上显示的站点名已经变成 Acme DB。
{.steps}

## 写出这一页 {#first-page}

在 Get Started 分组里新建 Quick start 页面，完整内容如下：

`````markdown {title="content/docs/get-started/quick-start.md" num="3-1" caption="一个完整的文档页：三个 front matter 键、一段导语、三个小节。" #eg-quick-start}
---
title: Quick start
description: Start Acme DB on a laptop, write a data point and query it back in five minutes.
weight: 30
---

Start one Acme DB server, write a data point over HTTP and read it back with
SQL. You need only the `acme` binary from
[Installation](/docs/get-started/installation/).

## Start the server {#start}

```bash
acme server --data ./acme-data
```

The server listens on port 8086 and keeps its files in `./acme-data`.

## Write a data point {#write}

```bash
curl -X POST http://localhost:8086/write -d 'cpu,host=web1 usage=0.64'
```

## Query it {#query}

```bash
acme sql "SELECT host, usage FROM cpu ORDER BY time DESC LIMIT 1"
```
`````

保存后看一眼预览：Quick start 出现在侧栏中 Installation 的下方，Installation 页底部的翻页器现在会通向它，右侧大纲列出了它的三个小节。

front matter（前置元数据）里的每个键各管一件事：

- `title` 是页面标题，也是浏览器标签页和搜索结果里显示的标题。侧栏需要更短的名字时，再加一个 `linkTitle`。
- `description` 用一句话说明读者能用这一页做成什么。它会出现在分区卡片、搜索结果和社交分享卡片上，决定了别人会不会点开这一页。
- `weight` 决定页面在同级页面中的顺序。Starter 里的 Requirements 和 Installation 分别用了 10 和 20，所以 30 会把 Quick start 排在它们后面；以 10 为步长，以后还能在中间插入新页。

正文开头先用一句话说清这一页能达成什么，不要一上来就写标题。主题会把 `title` 渲染成页面里唯一的 `#` 标题，所以正文小节从 `##` 开始。

## 经得起改动的标题 {#headings}

{{< xref eg="3-1" anchor="eg-quick-start" />}} 里的每个标题都带有显式 ID，例如 `{#start}`。不写 ID 时，Hugo 会根据标题文字生成 ID，于是只要把“Start the server”换个说法，所有指向它的链接都会失效，中文标题也会得到与英文不同的 ID。把 ID 写明之后，`/docs/get-started/quick-start/#start` 无论标题怎么改写、在哪种语言里都依然有效。

链接其他页面时使用站内绝对路径，就像导语里写的 `/docs/get-started/installation/`。这种路径直接对应发布后的地址，链接所在的源文件换了位置也照样有效，用全站搜索也容易找到。Hugo 不会检查普通 Markdown 链接，所以移动页面时，要把旧路径加进它 front matter 的 `aliases`，旧地址才能继续访问：

```yaml {title="移动后页面的 front matter"}
aliases:
  - /docs/tutorial/first-query/
```

## 让目录树充当导航 {#tree}

带有 `_index.md` 的目录会成为侧栏里的一个分组，这个 `_index.md` 就是分组自己的页面。下面添加一个 Operations 分组，里面放一页：

```filetree {title="本步新增的文件"}
- content/docs/
  - operations/
    - _index.md      # 分组本身：标题、描述、权重 35、图标
    - backup.md      # 组内的第一页
```

```markdown {title="content/docs/operations/_index.md"}
---
title: Operations
description: Back up, upgrade and monitor a running Acme DB server.
weight: 35
icon: fa-solid fa-screwdriver-wrench
---

Keep a production server healthy after the first install.
```

````markdown {title="content/docs/operations/backup.md"}
---
title: Back up a server
description: Take a consistent snapshot of a running server and restore it on another host.
weight: 10
---

Take snapshots while the server keeps accepting writes.

## Take a snapshot {#snapshot}

```bash
acme backup create --to /backups/acme-$(date +%F)
```
````

权重 35 让这个分组排在 Tutorial 分组（30）之后、Reference（40）之前。它的图标能显示出来，是因为 Starter 设置了 `sidebar_icon_policy: groups`：分组显示图标，叶子页面保持简洁。分组页会把子页面列成卡片，因为 Starter 设置了 `section_index: cards`；卡片上的文字取自每个子页面的 `description`，这又是一个要把它写好的理由。

有两个 front matter 键能把页面暂时挪开，而不必删除它。`toc_hide: true` 让已发布的页面不出现在侧栏和翻页器里；`draft: true` 则在页面完成之前把它排除在构建之外，用 `hugo server -D` 可以预览草稿。

## 添加中文版本 {#translation}

Starter 本来就带有中文和法语，所以翻译只是在英文文件旁边再放一个文件：文件名相同，加上语言后缀：

`````markdown {title="content/docs/get-started/quick-start.zh.md"}
---
title: 快速上手
description: 在笔记本上启动 Acme DB，写入一个数据点并查询出来，五分钟完成。
weight: 30
---

启动一个 Acme DB 服务，通过 HTTP 写入一个数据点，再用 SQL 读出来。你只需要
[安装](/zh/docs/get-started/installation/)一节里的 `acme` 程序。

## 启动服务 {#start}

```bash
acme server --data ./acme-data
```

服务监听 8086 端口，数据文件保存在 `./acme-data`。

## 写入数据点 {#write}

```bash
curl -X POST http://localhost:8086/write -d 'cpu,host=web1 usage=0.64'
```

## 查询数据 {#query}

```bash
acme sql "SELECT host, usage FROM cpu ORDER BY time DESC LIMIT 1"
```
`````

两个文件共用同一个权重和全部标题 ID，变的只有正文；命令和代码逐字节保持一致。打开英文页面，在顶部导航栏切换到简体中文，你会来到 `/zh/docs/get-started/quick-start/`，而指向 `#write` 的链接在两种语言里都落在同一个小节。[第 9 章](/zh/book/09-navigation/)介绍如何增删语言。

## 检查成果 {#checkpoint}

保持预览开着，你应该能看到：

- 侧栏里 Quick start 排在 Installation 之后，翻页器把两页前后连起来；
- Tutorial 和 Reference 之间多了一个带图标的 Operations 分组，分组页上有一张 Back up a server 的卡片；
- 在 Quick start 上切换语言，打开的是中文页面的同一小节；
- `http://localhost:1313/docs/get-started/quick-start/index.md` 以纯 Markdown 返回这一页。

## 交给 agent {#agent}

```text {num="3-2" caption="提示词：给你自己的站点添加一页。" #eg-agent-pages}
在文档的 Get started 分区里添加一个“Quick start”页面，用 weight 把它排在
Installation 之后。front matter 包含 title、一句话说明读者能完成什么的
description，以及 weight。每个标题都写上显式的英文 ID。再添加中文版本
quick-start.zh.md，使用相同的 weight 和相同的标题 ID。完成后在浏览器里打开
两个页面，检查侧栏顺序、翻页器和语言切换。
```
