---
title: 书籍出版
linkTitle: 书籍出版
description: "用 `type: book` 把一棵目录树变成一本书：章节编号、图表式例编号、交叉引用、生成式索引与整本打印。"
weight: 50
search_keywords: [书籍, 书, Book, 章节, 编号, 图表编号, 交叉引用, xref, book-toc, 整本打印, 长文档, 出版]
aliases:
  - /docs/scenarios/book/
  - /docs/scenarios/reading/
---

文档是拿来查的：读者从搜索进来，看完一页就走。书是按顺序读的，读者对它的期待来自纸书：章有编号，图和表能被引用为「图 2-1」，章节挪动后交叉引用依然有效，全书还能作为一份文档打印或导出。给一棵内容树设置 `type: book`，OINK 就提供这一切，而每一章仍然是普通的 Markdown 页面。

一本书依赖两项站点设置：Goldmark 的块级属性与 passthrough 必须开启（见[三项 Goldmark 前提](/zh/docs/customize/config/#goldmark)）；`params.ui.shell_types` 必须包含 `book`，默认列表已经包含。书稿如果已经存在于另一个 Hugo 站点，先看[迁移既有书稿](#migrate)。

## 一本最小的书 {#layout}

书根是一个普通的 Hugo 分区，子目录是章，章里的页面是节。这棵树就是唯一的章节清单：侧栏、翻页器、生成的目录和打印出来的整本书读的都是它，所以挪动一个文件，这一章在所有地方同时移动。

```filetree {title="content/handbook/ 一本书"}
- content/handbook/
  - _index.md              # 书首页：type: book + cascade，放 book-toc 与各类索引
  - ch01/
    - _index.md            # 第 1 章章首页：book_number: 1
    - install.md           # 1.x 节
    - bootstrap.md
  - ch02/
    - _index.md            # 第 2 章：编号 2（book_number），草稿可标 draft
    - replication.md
    - failover.md
  - appendix.md            # 不编号的附录，照样进侧栏与翻页顺序
```

书根页面声明类型、把类型级联给下面的所有页面，并请求 `print` 输出，用来生成整本书的聚合文档。这项输出需要显式开启，因为把每一章聚合起来会明显拖慢构建：

```yaml {title="content/handbook/_index.md"}
---
title: PostgreSQL 运维手册
type: book
book_number: B
cascade:
  type: book
outputs: [HTML, print, markdown]
---
```

front matter 里的 `outputs` 会替换站点给这一页的输出列表，所以要把书根需要保留的格式全部写上。也可以改在 `hugo.yml` 里设置：把 `print` 加进 `outputs.section`，书位于站点根时则加进 `outputs.home`；这样做会为该类型的所有页面开启打印输出。

章首页 `_index.md` 只需要标题、编号与位置：

```yaml {title="content/handbook/ch02/_index.md"}
---
title: 复制与故障切换
book_number: 2
book_status: draft
weight: 20
---
```

## 章节编号、草稿与标题 {#front-matter}

`book_number` 写什么就显示什么，出现在章标题之前、侧栏条目里和生成的目录里。主题从不按目录顺序推算编号，所以 `2`、`B`、`A` 都合法，重排目录树也不会改动读者已经引用过的编号。图、表、式、例的编号同理：每个 `num` 都是作者写下的字符串，如 `2-1`、`5.3`、`A-2`，而不是计数器。

`book_status: draft` 在侧栏和 `book-toc` 里给未完成的章节打上标签。它只是编辑状态，不是 Hugo 的 `draft`：这一章照常构建、照常发布。如果还想在每个草稿章节的正文上方显示一条本地化提示，打开默认关闭的横幅：

```yaml {title="hugo.yml"}
params:
  ui:
    book_draft_banner: true
    sidebar_headings: 3
```

横幅只出现在 `type: book` 且 `book_status: draft` 的页面上，文案来自本地化字符串 `book_draft_notice`。

`sidebar_headings` 在侧栏的当前条目下列出本页标题，章节较长时很有用。默认为 `false`；设为 `true` 列出 h2，设为 `2`、`3` 或 `4` 则指定列到哪一级。页面或分区 cascade 可以覆盖站点设置，右侧目录不受影响。

凡是打算被链接的标题，都写上显式 ID，如 `## 同步复制 {#sync-replication}`。自动生成的 ID 会随标题文字变化，用来导航没问题，用作长期引用就会失效。配置键的完整定义见[配置总览](/zh/docs/customize/config/)与[页面参数](/zh/docs/write/frontmatter/#book)。

## 编号：原生形态 {#numbering-native}

图、表、式、例都通过一行属性行获得编号。属性行紧贴在 Markdown 块下方，中间不能有空行：`num=` 是编号，`#id` 是锚点，`caption=` 是纯文本题注。优先使用这种形态：源码在任何 Markdown 阅读器里都清晰可读，块里的脚注也照常工作。

### 图 {#figure}

不写 `#id` 时，图的锚点是 `fig-<num>`。

```markdown {title="源码"}
![OINK 发布注记页面](/images/releasenote.webp)
{#book-release-note num="2-1" caption="发布注记页面同时是发布事实的唯一来源。" width=600 height=300}
```

![OINK 发布注记页面](/images/releasenote.webp)
{#book-release-note num="2-1" caption="发布注记页面同时是发布事实的唯一来源。" width=600 height=300}

原生图形态要求站点设置 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`。否则 Hugo 会把图片包进段落，属性行挂到段落上，图就得不到编号。替代文字取自图片自己的 `![…]`，不会被题注替代。要让图可点击，在同一行属性里加 `link=` 即可，不必为此改用 `fig` 短代码。

### 表 {#table}

管道表下方跟一行属性行即可编号，默认锚点是 `tbl-<num>`。

```markdown {title="源码"}
| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| Read Committed | 不可能 | 可能 | 可能 |
| Repeatable Read | 不可能 | 不可能 | 可能 |
| Serializable | 不可能 | 不可能 | 不可能 |
{#tbl-2-1 num="2-1" caption="PostgreSQL 各隔离级别下的异常现象。"}
```

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| Read Committed | 不可能 | 可能 | 可能 |
| Repeatable Read | 不可能 | 不可能 | 可能 |
| Serializable | 不可能 | 不可能 | 不可能 |
{#tbl-2-1 num="2-1" caption="PostgreSQL 各隔离级别下的异常现象。"}

### 式 {#equation}

`$$` 块下方跟一行属性行即可给公式编号，默认锚点是 `eq-<num>`。宽屏上编号与题注排在公式右侧；窄屏上换到公式下方，比屏幕还宽的公式可以横向滚动。题注写短一些，公式更容易扫读。

```markdown {title="源码"}
$$
A = \frac{\mathrm{MTBF}}{\mathrm{MTBF} + \mathrm{MTTR}}
$$
{#eq-2-1 num="2-1" caption="可用性与平均故障间隔、平均恢复时间的关系。"}
```

$$
A = \frac{\mathrm{MTBF}}{\mathrm{MTBF} + \mathrm{MTTR}}
$$
{#eq-2-1 num="2-1" caption="可用性与平均故障间隔、平均恢复时间的关系。"}

这种形态依赖 Goldmark passthrough。没有开启 passthrough 的站点改用下文的 `eq` 短代码，它在构建时用 KaTeX 渲染公式。

### 例 {#example}

代码围栏写上 `num=` 与 `caption=` 就成为编号示例，默认锚点是 `eg-<num>`。围栏上的 `#id` 命名的是外层 `<figure>`，引用指向的正是它。两个属性缺一不可：只写题注时题注被忽略，只写编号时编号被丢弃并告警。题注作为表头，与代码合成一个整体外框。

````markdown {title="源码"}
```sql {num="2-1" caption="按天统计主库写入量。" #eg-2-1}
SELECT date_trunc('day', ts) AS day, count(*)
FROM pg_stat_statements_history
GROUP BY 1 ORDER BY 1 DESC LIMIT 7;
```
````

```sql {num="2-1" caption="按天统计主库写入量。" #eg-2-1}
SELECT date_trunc('day', ts) AS day, count(*)
FROM pg_stat_statements_history
GROUP BY 1 ORDER BY 1 DESC LIMIT 7;
```

## 编号：短代码形态 {#numbering-shortcodes}

`fig`、`tbl`、`eq`、`eg` 四个短代码渲染出与原生形态相同的 `<figure>`，注册到同一张目标表，按源码位置排序。一个 Markdown 块装不下内容时才用它们：一幅图由多张图片或其他 Markdown 组成、一个编号下放多张表、站点没有开启 passthrough 却要写公式，或者示例由多个围栏加说明文字组成。

`fig` 的图片来自 `src=` 或内部 Markdown，二者只能取其一。它还接受 `link`、`alt`、`width`、`height` 与 `class`，迁移来的内容可以用 `title` 作为 `caption` 的别名：

```markdown {title="源码"}
{{</* fig num="2-2" src="/images/docsy.webp" alt="Docsy 主题的默认外壳"
    caption="OINK 的上游：Docsy 的内容模型仍在下面。" width="600" height="300" /*/>}}
```

{{< fig num="2-2" src="/images/docsy.webp" alt="Docsy 主题的默认外壳" caption="OINK 的上游：Docsy 的内容模型仍在下面。" width="600" height="300" />}}

`tbl` 把标签、表格、题注与锚点包进同一个 figure：

```markdown {title="源码"}
{{</* tbl num="2-2" caption="四种输出下编号组件的形态。" */>}}
| 输出 | 标签 | 锚点 |
| --- | --- | --- |
| HTML | 可见 | 稳定 |
| 打印 | 可见 | 稳定 |
{{</* /tbl */>}}
```

{{< tbl num="2-2" caption="四种输出下编号组件的形态。" >}}
| 输出 | 标签 | 锚点 |
| --- | --- | --- |
| HTML | 可见 | 稳定 |
| 打印 | 可见 | 稳定 |
{{< /tbl >}}

`eq` 在构建时用 KaTeX 渲染内容，因此不依赖 passthrough：

```markdown {title="源码"}
{{</* eq num="2-2" caption="连接池饱和度。" */>}}U = \frac{\lambda}{\mu \cdot c}{{</* /eq */>}}
```

{{< eq num="2-2" caption="连接池饱和度。" >}}U = \frac{\lambda}{\mu \cdot c}{{< /eq >}}

不带参数的 `{{</* eq */>}}` 就是普通的块级公式：没有编号也没有锚点，`xref` 引用不到，也不会出现在公式索引里。

`eg` 可以包住任意 Markdown，通常是一个或多个围栏：

````markdown {title="源码"}
{{</* eg num="2-2" caption="用 pg_basebackup 拉起一个新从库。" */>}}
```bash
pg_basebackup -h primary -U replicator -D /pg/data -Fp -Xs -P -R
```
{{</* /eg */>}}
````

{{< eg num="2-2" caption="用 pg_basebackup 拉起一个新从库。" >}}
```bash
pg_basebackup -h primary -U replicator -D /pg/data -Fp -Xs -P -R
```
{{< /eg >}}

无论哪种形态，ID 在同一页内必须唯一，同一类型下一个编号也只能对应一个 ID。出现重复时保留首次注册的条目，并在告警中给出首次注册所在的行号。

> [!IMPORTANT] 短代码正文里不能写脚注
> Hugo 把每个短代码的正文当作独立文档渲染，而脚注属于整个页面。因此在 `tbl`、`eg`、`fig`、`card`、`tab`、`field` 或 `include` 的正文中写 `[^label]`：脚注定义在页面正文里时，引用会原样输出为 `[^label]`；定义写在短代码内部时，会生成第二份脚注列表，其 `fn:N` 与页面自身的脚注 ID 冲突。构建时会告警，并给出文件、行号与标签。
>
> 需要脚注的表格或代码块请用原生形态。表格、图片或围栏加上 `{num=… caption=…}` 后内容仍留在页面文档里，脚注照常编号与跳转，渲染出的图表也完全相同。代码里形似脚注的文本（如字符类 `[^0-9]`）不受影响。

## 交叉引用 {#xref}

同一页内用普通链接就行：[表 2-1](#tbl-2-1) 指向上面那张隔离级别表。只是标签和编号要自己手写，改编号时还得把这些链接一一找出来。`xref` 根据类型与编号自动生成标签、编号和链接，并且可以跨页、跨语言：

```markdown {title="源码"}
参见 {{</* xref fig="2-2" /*/>}} 与 {{</* xref eg="2-1" /*/>}}；
显式锚点：{{</* xref fig="2-1" anchor="book-release-note" /*/>}}。
```

参见 {{< xref fig="2-2" />}} 与 {{< xref eg="2-1" />}}；
显式锚点：{{< xref fig="2-1" anchor="book-release-note" />}}。

- 最多给一个类型键：`fig`、`tbl`、`eq` 或 `eg`。类型决定本地化标签（图、表、公式、示例）和默认锚点 `<kind>-<num>`。
- 目标自己声明了 `#id` 时，用 `anchor=` 替换默认锚点。
- `page=` 指向另一页，按当前语言查找页面，源码里不必硬编码 `/zh/` 前缀。
- 不给类型时，必须同时给出 `anchor=` 和链接文字：`{{</* xref page="../ch01/install" anchor="sync-replication" */>}}同步复制{{</* /xref */>}}`。
- 引用可以出现在目标之前，无论目标在同一页还是在后面的章节里。

在整本打印里，`xref` 会变成文档内跳转，而指向其他页面的普通 Markdown 链接仍然指向网站。凡是在打印版里也要能跳转的引用，都写成 `xref`。

## 索引：目录与图表清单 {#indexes}

五个短代码生成纸书卷首的那些内容：目录，以及图、表、公式、示例清单。它们遍历书的目录树，渲染当前导航根以下的页面并汇总其中注册的编号对象，因此通常放在书根 `_index.md` 或一个专门的页面上：

```markdown {title="content/handbook/_index.md"}
{{</* book-toc depth=3 */>}}

## 插图目录 {#lof}
{{</* book-figures */>}}

## 表格目录 {#lot}
{{</* book-tables */>}}

## 公式索引 {#loe}
{{</* book-equations */>}}

## 示例索引 {#lox}
{{</* book-examples */>}}
```

本页只给出源码，因为放在这里它们会把整个文档树都列出来。实际效果见[《使用 OINK 创作优美的内容》](/zh/book/)，源码在
[`content/book/_index.md`](https://github.com/pgsty/oink.pgsty.com/blob/main/content/book/_index.md)。

- `book-toc` 在 `depth=1` 时只列章，`2`（默认）加入嵌套的节，`3` 再列出每页的标题。`drafts=false` 把 `book_status: draft` 的章节从这份清单里去掉，但不影响它们发布。
- `book-figures`、`book-tables`、`book-equations`、`book-examples` 不接受参数。每个条目形如「图 2-1 — 题注」，链接到目标锚点。
- 在整本打印里，这些链接全部变成文档内跳转。

## 阅读顺序 {#reading}

读者靠每页末尾的翻页器在书里前后移动。翻页顺序是侧栏目录树的前序遍历：先是分区首页，再按 `weight` 排列其子页。翻页器对 `docs`、`book`、`blog` 默认开启；用 `params.ui.pager_types` 改变这份类型列表，单页关闭则写 `pager: false`：

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book]
```

用 `toc_hide` 隐藏的条目、`manual_link` 纯链接条目和 `sidebar_divider` 分隔行都不会成为翻页目的地。

## 打印整本 {#print}

书根开启 `print` 输出后，`/_print/handbook/` 就是整本书的单一 HTML 文档：封面、目录、书根页面正文，以及按阅读顺序排列的每一章。设置了 `no_print: true` 的页面、纯链接条目、分隔行与隐藏占位不会进入。单章打印与打印相关开关见[打印支持](/zh/docs/customize/print/)。

编号的图、表、式、例在聚合文档里原样保留 ID，所以 `xref` 链接在文档内也能解析。标题与脚注 ID 会加上来源页面的前缀，因为好几章可能都有 `summary` 标题、都从脚注 `fn:1` 开始；主题生成的链接同步改写。单独打印一个页面时，ID 与普通 HTML 保持一致。

要导出 EPUB 或 PDF，再把 `BookManifest` 加进书根的 `outputs`。构建会在书根页面旁边写出 `book.json`，记录阅读顺序、标题、编号对象与引用。主题仓库里的两个脚本把这份清单和打印 HTML 转成文件：`bin/book-epub.py` 需要 Pandoc 3，以及一份写有书名、作者的 Pandoc 元数据文件；`bin/book-pdf.py` 需要 Chrome 或 Chromium，输出 A4 页面。它们在构建之后运行，Hugo 本身不会生成这两种文件。下面及后文的 `/path/to/oink` 指主题仓库的一份 checkout，版本与站点固定的发布版本一致：

```bash {title="终端"}
python3 /path/to/oink/bin/book-epub.py --manifest public/handbook/book.json \
  --public public --metadata epub.yaml --output handbook.epub
python3 /path/to/oink/bin/book-pdf.py --manifest public/handbook/book.json \
  --public public --output handbook.pdf
```

## 迁移既有书稿 {#migrate}

为其他 Hugo 主题写的书稿，通常用站点自己的 `figure` 短代码、加粗的假题注和指向 `#fig_*` 的裸链接来表示图表编号。`bin/migrations/book_figures.py` 把这些旧形态改写成 `fig`、`tbl` 与 `xref`，并保留已经公开的锚点，外部链接因此不会失效。先把站点固定到当前的 OINK 发布版本，再在专用分支上迁移内容，第一步是干跑：

```bash {title="干跑：只看 diff 与报告，不改文件"}
python3 /path/to/oink/bin/migrations/book_figures.py \
  --profile tpme \
  --root /path/to/your-book \
  --report /tmp/book-migrate.json > /tmp/book-migrate.diff
```

每个配方对应一份真实书稿的旧约定，并且只识别在那份书稿里实际出现过的形态。DDIA 的两个版本各有一个配方：

| `--profile` | 识别的旧形态 |
| --- | --- |
| `tpme` | 假 h6 题注加相邻图片、题注加相邻表格、`/en/...#fragment` 裸链接 |
| `ddia-v2` | 站点自有的 `figure` 短代码，按编号分为图 / 表 / 代码例 |
| `ddia-v1` | 裸图片加相邻的一条加粗编号题注，ID 由图片文件名推导 |
| `pg-internal` | 加粗或斜体的中英文「图 N」题注紧邻一张图片，编号表题注紧邻一张表格 |

书稿的约定与四个配方都不匹配时，需要手工改写成[原生形态](#numbering-native)。

| 选项 | 作用 |
| --- | --- |
| `--profile` | 必填，取上表四个值之一 |
| `--root` | 必填，消费站仓库根目录 |
| `--path` | 限定 `--root` 下的文件或目录，可重复；默认扫描整棵内容树 |
| `--write` | 应用改写。默认是干跑，不写任何文件 |
| `--no-diff` | 不打印 diff，仍输出摘要与报告 |
| `--report` | 写出机器可读的 JSON 报告 |
{.fields}

diff 输出到标准输出，摘要输出到标准错误。报告包含 `files_scanned`、`files_changed`、`counts`、`skipped`、`idempotent` 五项。脚本只改写能唯一确定的目标；编号不明、题注不唯一或标记形态无法识别的地方原样保留，记入 `skipped` 留给你处理。旧题注里的粗体、行内代码与公式会变成纯文本，因为 Book 的题注只能是纯文本。

审阅 diff 之后应用改写，再运行一遍，确认已经没有可改的内容：

```bash {title="应用并验证幂等"}
python3 /path/to/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --write \
  --report /tmp/book-migrate-written.json

python3 /path/to/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --no-diff \
  --report /tmp/book-migrate-second.json
```

第二份报告应当是 `files_changed: 0`、`counts` 为空、`idempotent: true`，脚本以退出码 0 结束。

## 验证 {#verify}

1. 用 `hugo --printPathWarnings` 构建，逐条阅读告警：编号格式错误、ID 重复、示例缺少题注都会各自产生一条告警。
2. 在页面上确认出现「图 2-1」这样的本地化标签，`xref` 链接点击后落在目标上。
3. 对比侧栏、翻页器、`book-toc` 与整本打印四处的章节顺序。
4. 用 `curl -s http://localhost:1313/zh/handbook/ch02/index.md` 检查 Markdown 输出。短代码形态的图会变成 `**图 2-2.** 题注` 加正文，原生形态保留原来的源码块与属性行。
5. 用主题提供的锚点检查扫描构建产物。它确认每个引用的目标存在、类型与编号一致、页内 ID 唯一、编号图片带替代文字；产物里至少要有一个编号对象和一个 `xref`。

```bash {title="终端"}
python3 /path/to/oink/bin/check-book.py --site-public public
```

## Book 短代码参数 {#reference}

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `num` | 字符串 | — | 必填（`eq` 无参形态除外）。匹配 `[0-9A-Za-z.-]+`，要加引号 |
| `id` | 字符串 | `fig-<num>` / `tbl-<num>` / `eq-<num>` / `eg-<num>` | 匹配 `[A-Za-z][A-Za-z0-9_.:-]*`，逐字节保留 |
| `caption` | 纯文本 | 空 | `eg` 必填；`fig` `tbl` `eq` 可选。不是 Markdown |
| `class` | class token | — | 追加到 `<figure>`；需要 `num` |
| `src` | 图片路径 | — | 仅 `fig`。与内部内容互斥，走共享图片解析顺序 |
| `link` `alt` `width` `height` | — | — | 仅 `fig`。宽高是正整数 |
| `title` | 纯文本 | — | 仅 `fig`。`caption` 的迁移别名，二者互斥 |
{.fields meta="type default"}

`xref`：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `fig` `tbl` `eq` `eg` | 编号字符串 | — | 至多一个。提供本地化标签并推导锚点 |
| `anchor` | ID | 由类型与编号推导 | 无类型时必填，且必须有内部链接文字 |
| `page` | 页面引用 | 当前页 | 走当前语言的页面查找，找不到时告警并渲染无链接文字 |
{.fields meta="type default"}

`book-toc`：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `depth` | 整数 1–3 | `2` | 1 章 / 2 含嵌套分区 / 3 含标题树 |
| `drafts` | 布尔 | `true` | `false` 时从生成列表里滤掉草稿章节 |
{.fields meta="type default"}

`book-figures`、`book-tables`、`book-equations`、`book-examples` 不接受任何参数。

## 限制与常见问题 {#limits}

- 属性行必须紧贴所属的块。Prettier 之类的格式化工具一旦把它隔开或挪走，编号图就会退化成普通图片，而且没有任何告警。
- `book_kind` 与 `book_part` 可以作为元数据写入，但不会改变页面；有可见效果的只有 `book_number` 与 `book_status`。
- 索引短代码会渲染书根以下的每一页，书很大时会拉长构建时间。整本 `print` 需要显式开启也是这个原因。
- EPUB 与 PDF 只能由上面两个脚本生成，Hugo 本身不会产出。专业排版的分页控制、字体嵌入与书末索引编制不在支持范围内。

## 相关 {#related}

- [组织内容](/zh/docs/write/organize/) — 目录树怎么变成侧栏与阅读顺序
- [图片](/zh/docs/components/image/) — 图注、尺寸、缩放与图片处理
- [表格](/zh/docs/components/table/) — 表格属性行与全宽表
- [公式](/zh/docs/components/math/) — KaTeX 与 passthrough 配置
- [打印支持](/zh/docs/customize/print/) — 整章与整本打印
