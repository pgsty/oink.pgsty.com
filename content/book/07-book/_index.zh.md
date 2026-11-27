---
title: 写一本有编号、能交叉引用的书
linkTitle: 书
description: 把一个目录变成一本书：章、图、表、公式和示例都有编号，用 xref 互相引用，自动生成各类索引，并把整本书打印成一份文档。
book_kind: chapter
book_number: 7
weight: 70
---

文档是拿来查的，书是按顺序读的。书的读者带着纸书养成的期待：章有编号，“表 3-1”可以被引用，章节挪动后引用依然有效，全书还能合成一份文档。任何标记为 `type: book` 的内容树，OINK 都提供这一切，而每一章仍是普通的 Markdown 页面。Starter 的 `content/book/` 已经是一本书；本章把它改成《Acme DB 运维手册》，下面带编号的条目都是本书中实际生效的示例。

## 书根 {#root}

书根页面声明类型，把类型传给下面的每一页，并请求 `print` 输出，用来生成整本书的文档。Starter 的书根已经做好了这三件事，你只需换上手册的标题：

```markdown {title="content/book/_index.md"}
---
title: The Acme DB Operations Handbook
linkTitle: Handbook
type: book
book_kind: book
outputs: [HTML, print, markdown]
cascade:
  type: book
  sidebar_headings: 3
---

Run Acme DB in production, from sizing the first server to recovering from a
lost disk.

{{</* book-toc depth=2 */>}}
```

front matter 里的 `outputs` 会替换站点为这一页设定的输出列表，所以书根要保留的每种格式都得写上。`sidebar_headings: 3` 会在侧栏里把每章的标题列在章名之下，章节较长时很有帮助。

## 章 {#chapters}

每一章是一个带编号和位置的页面。把 Starter 的四个示例章节换成手册自己的章节：

```markdown {title="content/book/03-capacity.md"}
---
title: Plan capacity
description: Size CPU, memory and disk for a sustained ingest rate and retention period.
book_kind: chapter
book_number: 3
book_status: draft
weight: 30
---
```

`book_number` 在侧栏、目录和打印视图中都按原样显示。主题从不根据目录顺序推算编号，所以 `3`、`A`、`B` 都是合法的，挪动文件也不会让读者已经引用过的章节改号。`book_status: draft` 给未完成的章节加上标签，但不会撤下发布；同时设置 `params.ui.book_draft_banner: true` 时，章首还会显示一条提示，本书的草稿章节也会这样显示。

## 给读者会引用的内容编号 {#numbering}

图、表、公式或代码示例的编号，来自紧贴在它下面的一行属性，中间不能有空行：`num=` 是你希望印出来的编号，`caption=` 是纯文本题注。在手册里，这些条目会按第 3 章编号；这里用的是本章的编号 7。

### 表格 {#numbered-table}

```markdown {title="源码"}
| 持续写入速率 | CPU 核数 | 内存 | 90 天所需磁盘 |
| --- | ---: | ---: | ---: |
| 100,000 points/s | 4 | 8 GB | 1.2 TB |
| 1,000,000 points/s | 8 | 32 GB | 12 TB |
| 3,000,000 points/s | 16 | 64 GB | 37 TB |
{num="7-1" caption="按持续写入速率划分的服务器规格。"}
```

| 持续写入速率 | CPU 核数 | 内存 | 90 天所需磁盘 |
| --- | ---: | ---: | ---: |
| 100,000 points/s | 4 | 8 GB | 1.2 TB |
| 1,000,000 points/s | 8 | 32 GB | 12 TB |
| 3,000,000 points/s | 16 | 64 GB | 37 TB |
{num="7-1" caption="按持续写入速率划分的服务器规格。"}

### 公式 {#numbered-equation}

磁盘那一列来自[第 5 章](/zh/book/05-media/#math)的公式，现在给它编上号：

```markdown {title="源码"}
$$
S = \frac{N \cdot f \cdot T \cdot b}{c}
$$
{num="7-1" caption="保留期内的磁盘用量。"}
```

$$
S = \frac{N \cdot f \cdot T \cdot b}{c}
$$
{num="7-1" caption="保留期内的磁盘用量。"}

### 代码示例 {#numbered-example}

代码围栏把 `num` 和 `caption` 写在自己的属性里：

````markdown {title="源码"}
```toml {num="7-1" caption="每秒写入至多一百万个点的服务器所用的 acme.toml。"}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"
memtable_size = "4GB"

[retention]
default = "90d"
```
````

```toml {num="7-1" caption="每秒写入至多一百万个点的服务器所用的 acme.toml。"}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"
memtable_size = "4GB"

[retention]
default = "90d"
```

### 图 {#numbered-figure}

单独成段的图片也接受同样的属性行：

```markdown {title="源码"}
![ddia.vonng.com 首页，带有目录、阅读与打印按钮](/case/ddia/featured.webp)
{num="7-1" caption="ddia.vonng.com：目录、第一章和整本书的打印版，都只需点一下。" width=900 height=506}
```

![ddia.vonng.com 首页，带有目录、阅读与打印按钮](/case/ddia/featured.webp)
{num="7-1" caption="ddia.vonng.com：目录、第一章和整本书的打印版，都只需点一下。" width=900 height=506}

每类条目各自计数，所以表 7-1、公式 7-1、示例 7-1 和图 7-1 可以同时存在。不写 `#id` 时，锚点由类别和编号组成，例如 `#tbl-7-1`。如果其他站点会链接到这个目标，就加一个显式 ID：`{#tbl-server-sizes num="7-1" …}`，这样重新编号也不会弄断它们的链接。属性行要紧贴所属的块：格式化工具一旦把它挪开，带编号的图就会变回普通图片，而且没有任何告警。

## 用 xref 交叉引用 {#xref}

手写的“见表 7-1”在表格重新编号后就会过时。`xref` 短代码根据类别和编号生成标签、编号和链接，并使用读者的语言：

```markdown {title="源码"}
按{{</* xref tbl="7-1" /*/>}} 选择服务器规格，这张表在每个点 16 字节、压缩比为 10 的条件下套用了{{</* xref eq="7-1" /*/>}}。第 1 章以{{</* xref eg="1-1" page="/book/01-start" anchor="eg-prompt-blog" /*/>}} 开篇。
```

按{{< xref tbl="7-1" />}} 选择服务器规格，这张表在每个点 16 字节、压缩比为 10 的条件下套用了{{< xref eq="7-1" />}}。第 1 章以{{< xref eg="1-1" page="/book/01-start" anchor="eg-prompt-blog" />}} 开篇。

`page=` 指向另一章，并在当前语言中查找，所以这句话的中文版不必在源码里写 `/zh/` 前缀，也会链接到中文章节。目标自己声明了 ID 时需要写 `anchor=`，示例 1-1 就是这样。引用可以出现在目标之前，无论目标在同一章还是后面的章节。

## 生成索引 {#indexes}

书根页面，或者一个专门的目录页，会汇集各章登记的全部条目：

```markdown {title="content/book/_index.md"}
{{</* book-toc depth=3 */>}}

## Figures {#figures}
{{</* book-figures */>}}

## Tables {#tables}
{{</* book-tables */>}}

## Equations {#equations}
{{</* book-equations */>}}

## Examples {#examples}
{{</* book-examples */>}}
```

`book-toc` 在 `depth=1` 时列出各章，为 `2` 时加上嵌套的小节，为 `3` 时再加上每页的标题。本书的[根页面](/zh/book/#figures)五样都有；本章编号的条目就列在那里，旁边是第一部分的各条提示词。

## 打印整本书 {#print}

书根带有 `print` 输出，所以 `/_print/book/` 把整本书放进一份 HTML 文档：封面、目录，以及按阅读顺序排列的每一章。每个 `xref` 都变成文档内部的跳转，引用印到纸上依然有效。打开[本书的打印视图](/zh/_print/book/)，在浏览器的打印对话框里存成 PDF。需要 EPUB 或分页 PDF 时，主题仓库提供了两个基于构建产物工作的脚本，见[书籍出版](/zh/docs/write/book/#print)。

## 检查成果 {#checkpoint}

- 手册的各章带着编号出现在侧栏里，草稿章节带有草稿标签。
- 每个编号条目都显示自己的标签（例如“表 3-1”）和题注。
- 每个 `xref` 链接都能跳到目标，包括指向其他章节的引用。
- `/_print/book/` 包含每一章，目录和各类索引都链接到文档内部。

## 交给 agent {#agent}

```text {num="7-2" caption="提示词：把书稿文件夹变成一本书。" #eg-agent-book}
按照 https://oink.pgsty.com/zh/docs/write/book/，把 ./manuscript 里的 Markdown
章节整理成 content/book/ 下的一本 OINK 书。每章一个文件，写上 book_number 和
weight；正文措辞保持不变。用原生属性行给每张图、每张表和每个代码示例按所在章编号
（3-1、3-2……），并把手写的“见图 3”之类的文字换成 xref。在书根页面放上 book-toc
和四个索引短代码，并开启 print 输出。列出所有缺少替代文字的图片，然后在浏览器里
检查编号、交叉引用和 /_print/book/。
```
