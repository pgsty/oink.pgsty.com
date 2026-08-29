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

一本书是一棵 `type: book` 的内容树：目录决定章节顺序，front matter 决定章节编号，图 / 表 / 式 / 例各带一个手写编号与稳定锚点。交叉引用在四种输出里都能解析，书根页面可以生成整本打印 HTML。

前提两条：站点的 `markup.goldmark` 已开启属性行与 passthrough（见[组件总览](/zh/docs/components/)）；`params.ui.shell_types` 保留 `book`（主题默认包含）。

## 一本书的目录 {#layout}

书根是一个普通的 Hugo section，章是它的子目录，节是章里的页面。没有第二份章节清单：侧栏、翻页器、生成的目录读的都是这棵树。

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

章节编号手写：`book_number` 写什么就显示什么，主题不按目录顺序自动编号。图 / 表 / 式 / 例的 `num` 同理，是作者掌握的字符串（`2-1`、`5.3`、`A-2` 均合法），不是渲染时计算的序号。重排目录因此不会让已经印出去的编号漂移。

## 书首页与章首页 {#front-matter}

书根声明类型、级联给后代，并显式请求 `print` 输出。这项聚合输出构建代价高，主题不替消费站开启：

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

分区书对应 Hugo 的 `section` 输出类型，书位于站点根时才用 `home`：

```yaml {title="hugo.yml"}
outputs:
  section: [HTML, print, markdown]
params:
  ui:
    sidebar_headings: 3     # 当前章节行下投射 h2–h3 标题树
    book_draft_banner: true # 草稿章节页首多一条本地化提示
```

章首页只需要编号与顺序：

```yaml {title="content/handbook/ch02/_index.md"}
---
title: 复制与故障切换
book_number: 2
book_status: draft
weight: 20
---
```

`book_number` 显示在页面标题、侧栏与生成目录里。`book_status: draft` 是可见的编辑状态标签，不改变 Hugo 的发布状态：草稿章节照常构建、照常发布。

`sidebar_headings` 接受 `false`、`true`（只到 h2）或 2–4 的最大层级。要被引用的标题一律写显式 ID，如 `## 同步复制 {#sync-replication}`：自动生成的 slug 适合导航，不适合作为长期引用目标。

配置键的完整定义在[配置总览](/zh/docs/customize/config/)，页面参数在[页面参数](/zh/docs/write/frontmatter/)。

## 编号：原生形态 {#numbering-native}

四种编号对象各有一种原生形态：一个 Markdown 块，紧跟其后一行属性行。属性行里 `num=` 是编号，`#id` 是锚点，`caption=` 是纯文本题注。

### 图 {#figure}

图片块后面跟属性行。`#id` 省略时默认是 `fig-<num>`。

```markdown {title="源码"}
![OINK 发布注记页面](/images/releasenote.webp)
{#book-release-note num="2-1" caption="发布注记页面同时是发布事实的唯一来源。" width=600 height=300}
```

![OINK 发布注记页面](/images/releasenote.webp)
{#book-release-note num="2-1" caption="发布注记页面同时是发布事实的唯一来源。" width=600 height=300}

原生图形态要求站点设置 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`，否则属性行会挂到段落上被忽略。替代文字取自 Markdown 图片本身，不会被题注替代。

### 表 {#table}

管道表后面跟属性行，默认 ID 是 `tbl-<num>`。

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

`$$` 块后面跟属性行，默认 ID 是 `eq-<num>`。编号与题注排在公式右侧的同一行里，不换行；题注写长了会挤压公式那一列，公式随之变成需要横向滚动的区域。公式的题注要短。

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

原生形态依赖站点开启 Goldmark passthrough。未开启时用下面的 `eq` shortcode，它走本地服务端 KaTeX。

### 例 {#example}

代码围栏加 `num=` 与 `caption=` 即编号例，默认 ID 是 `eg-<num>`。围栏里写的 `#id`
命名外层 `<figure>`，即引用目标，不是代码块本身。例的题注必填：只写 caption 时
忽略它，只写编号时丢弃编号并告警；严格发布构建拒绝这条警告。编号例渲染成一个
整体：题注是框的表头，正文在框内；正文恰好是一个代码块时贴着框排，不再另画一圈边框。

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

## 编号：shortcode 形态 {#numbering-shortcodes}

四个 shortcode `fig` `tbl` `eq` `eg` 渲染出与原生形态一致的 `<figure>`，注册到同一个目标表，按源码位置排序。仅在原生形态做不到时使用：图片要外链跳转、表格要在一个编号下放多张表、站点未开 passthrough、例子体是多个围栏加说明文字。

`fig` 用 `src=`（也接受内部 Markdown 内容，二者互斥），并额外支持 `link` `alt` `width` `height` `class` 与迁移用的 `title` 别名：

```markdown {title="源码"}
{{</* fig num="2-2" src="/images/docsy.webp" alt="Docsy 主题的默认外壳"
    caption="OINK 的上游：Docsy 的内容模型仍在下面。" width="600" height="300" /*/>}}
```

{{< fig num="2-2" src="/images/docsy.webp" alt="Docsy 主题的默认外壳" caption="OINK 的上游：Docsy 的内容模型仍在下面。" width="600" height="300" />}}

`tbl` 把标签、表格、题注与锚点包进一个语义 figure：

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

`eq` 的内容交给本地服务端 KaTeX，因此不依赖 passthrough：

```markdown {title="源码"}
{{</* eq num="2-2" caption="连接池饱和度。" */>}}U = \frac{\lambda}{\mu \cdot c}{{</* /eq */>}}
```

{{< eq num="2-2" caption="连接池饱和度。" >}}U = \frac{\lambda}{\mu \cdot c}{{< /eq >}}

不带参数的 `{{</* eq */>}}` 是无编号的块级公式兜底：不注册目标，不能被 `xref` 引用，也不出现在公式索引里。

`eg` 是包装型 shortcode，正文按页面的 Markdown 策略渲染，通常装一个或多个围栏：

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

同一页里 ID 必须唯一，同一类里一个编号也只能对应一个 ID。重复时告警并保留第一项；
严格发布构建拒绝这条警告，消息指出先占用它的那一处在哪行。

> [!IMPORTANT] shortcode 正文里不能写脚注
> Hugo 把 shortcode 的正文当作独立 Goldmark 文档渲染，脚注是页面级的。`tbl`、
> `eg`、`fig`、`card`、`tab`、`field`、`include` 的正文里出现 `[^label]` 会告警，
> 消息给出文件、行号与标签；严格发布构建拒绝这条警告。定义写在页面上时该引用会
> 原样印出 `[^label]`，定义写在正文里则生成第二份脚注列表、`fn:N` 与页面自身 ID
> 冲突——两种结果都不该发布。
>
> 需要脚注的表格或代码块改用原生形态：表格、图片、围栏加 `{num=… caption=…}`，内容留在页面文档里，脚注照常编号、跳转与回链。渲染出来的图表与 shortcode 形态一致，所以这通常是一行改动。代码里形似脚注的文本（列表里的 `[^0-9]` 字符类、行内代码）不受影响。

## 交叉引用 {#xref}

引用同页目标可以用普通 Markdown 链接：[表 2-1](#tbl-2-1) 指向上面那张隔离级别表。代价是标签与编号手写，改编号时需要自己检索。

`xref` 把标签、编号与锚点合成一处，并支持跨页与跨语言：

```markdown {title="源码"}
参见 {{</* xref fig="2-2" /*/>}} 与 {{</* xref eg="2-1" /*/>}}；
显式锚点：{{</* xref fig="2-1" anchor="book-release-note" /*/>}}。
```

参见 {{< xref fig="2-2" />}} 与 {{< xref eg="2-1" />}}；
显式锚点：{{< xref fig="2-1" anchor="book-release-note" />}}。

规则：

- 最多一个类型键（`fig` `tbl` `eq` `eg`）。类型提供本地化标签（图 / 表 / 公式 / 示例）并推导出默认锚点 `<kind>-<num>`。
- `anchor=` 覆盖推导出的锚点，用于目标写了显式 `#id` 的情况。
- `page=` 跨页引用，走 Hugo 当前语言的页面查找，源码里不必硬编码 `/zh/` 前缀。
- 不给类型时必须同时给 `anchor=` 和内部链接文字：`{{</* xref page="../ch01/install" anchor="sync-replication" */>}}同步复制{{</* /xref */>}}`。
- 引用可以出现在目标之前，渲染时不读注册表，因此前向引用合法。

跨页的普通 Markdown 链接在整本打印里仍然是站点 URL。需要在聚合文档里也能跳转的引用写成 `xref`。

## 索引：目录与图表清单 {#indexes}

五个索引 shortcode 遍历同一棵书树，触发后代内容并聚合注册结果。它们通常放在书首页（`_index.md`）或专门的「插图目录」页上。

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

这五个 shortcode 在本页只给源码。它们从当前页所在的导航根向下遍历，放在一棵普通文档树里会把整棵 docs 树当作书列出。真实效果见[《使用 OINK 创作优美的内容》](/zh/book/)，源码位于
[`content/book/_index.md`](https://github.com/pgsty/oink.pgsty.com/blob/main/content/book/_index.md)。

- `book-toc` 的 `depth` 取 1–3：1 列章，2 加入嵌套分区，3 再投射每页的标题树；`drafts=false` 只把 `book_status: draft` 的行从这份生成列表里滤掉，不影响页面发布。
- `book-figures` / `book-tables` / `book-equations` / `book-examples` 不接受任何参数，各列一类，条目形如「图 2-1 — 题注」并链到稳定 ID。
- 整本打印时，这些链接全部变成文档内片段。

## 顺序阅读与草稿 {#reading}

翻页器默认对 `docs`、`book`、`blog` 三种类型开启，顺序是侧栏那棵树的前序遍历：分区首页在前，子页按 `weight`。关闭整类改 `params.ui.pager_types`，关闭单页写 `pager: false`。

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book]
```

`toc_hide`、`manual_link` 纯链接占位、`sidebar_divider` 分隔行都不会成为翻页目的地。

草稿章节除了侧栏上的「草稿」标签，还可以开启页首横幅：

```yaml {title="hugo.yml"}
params:
  ui:
    book_draft_banner: true
```

横幅只在 `type: book` 且 `book_status: draft` 的页面出现，文案来自本地化键 `book_draft_notice`。

## 打印整本 {#print}

书根有了 `print` 输出后，按可见的阅读顺序生成封面、本地目录、根页面正文与每个后代章节，全部装在一个 HTML 文档里。`no_print: true` 的页面、纯链接节点、分隔行与隐藏占位不会成为章节。

聚合文档里，编号组件的 ID 逐字节保留。页面内的 Markdown 标题与脚注 ID
会加上来源页面前缀，避免多章共有 `summary` 这类锚点、或都从 `fn:1` 开始时冲突；
生成的链接同步改写。页面单独渲染为 Print 时，与普通 HTML 保持相同的页面局部
ID——只有多页分区或整书聚合才增加命名空间。

产物是面向打印的 HTML。可选的 `BookManifest` 输出会把同一份阅读顺序记成 JSON，
主题另外提供 `bin/book-epub.py` 与 `bin/book-pdf.py`，把清单与打印 HTML 打包成
EPUB 和 PDF。

具体开关与整章打印见[打印支持](/zh/docs/customize/print/)。

## 迁移既有书稿 {#migrate}

已有的中文书稿通常用站点自己的 `figure` shortcode、加粗的假题注、指向 `#fig_*` 的裸链接来表示图表编号。主题仓库带一个迁移脚本，把这些旧形态改写成 `fig`、`tbl` 与 `xref`，并保留原有的公开锚点。站点先固定到一个包含 Book 组件的已发布 OINK 版本，再迁移内容。

```bash {title="干跑：只看 diff 与报告，不改文件"}
python3 ~/pgsty/oink/bin/migrations/book_figures.py \
  --profile tpme \
  --root /path/to/your-book \
  --report /tmp/book-migrate.json > /tmp/book-migrate.diff
```

四个配方对应三份真实书稿的旧约定（DDIA 的 v1 与 v2 各一个），只识别在那些书稿里观测到的形态：

| `--profile` | 识别的旧形态 |
| --- | --- |
| `tpme` | 假 h6 题注加相邻图片、题注加相邻表格、`/en/...#fragment` 裸链接 |
| `ddia-v2` | 站点自有的 `figure` shortcode，按编号图 / 表 / 代码例分类 |
| `ddia-v1` | 裸图片加相邻的一条加粗编号题注，ID 由图片文件名推导 |
| `pg-internal` | 加粗或斜体的中英文「图 N」题注紧邻一张图片，编号表题注紧邻一张表格 |

| 选项 | 作用 |
| --- | --- |
| `--profile` | 必填，取上表四个值之一 |
| `--root` | 必填，消费站仓库根目录 |
| `--path` | 限定 `--root` 下的文件或目录，可重复；默认扫描整棵内容树 |
| `--write` | 应用改写。默认是干跑，不写任何文件 |
| `--no-diff` | 不打印 diff，仍输出摘要与报告 |
| `--report` | 写出机器可读的 JSON 报告 |
{.fields}

diff 走标准输出，摘要走标准错误，报告含 `files_scanned`、`files_changed`、`counts`、`skipped`、`idempotent` 五项。脚本只改写能唯一确定的目标：无法确定编号、题注不唯一、标记形态不认识的地方原样保留，逐条记进 `skipped` 供人工处理。旧题注里的粗体、行内代码与公式会降级为纯文本，因为 Book 的题注契约是纯文本。

审阅 diff 之后在专用分支上应用，再运行第二遍确认幂等：

```bash {title="应用并验证幂等"}
python3 ~/pgsty/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --write \
  --report /tmp/book-migrate-written.json

python3 ~/pgsty/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --no-diff \
  --report /tmp/book-migrate-second.json
```

第二份报告应当是 `files_changed: 0`、`counts` 为空、`idempotent: true`；脚本以退出码 0 表示幂等。

配方只识别这三份书稿里实际观测到的旧形态；书稿的旧约定不在这四个配方之内时，脚本不适用，需要按[编号：原生形态](#numbering-native)手工改写。主题仓库的 `bin/check-book-migrations.py` 用干跑与幂等两项检查覆盖这四个配方。

## 验证 {#verify}

1. 构建零告警：`hugo --printPathWarnings --panicOnWarning`。编号写错、ID 重复、题注缺失都在这一步失败。
2. 页面上应看到「图 2-1」这样的本地化标签、可点的 `xref` 链接，以及点击后正确跳转的锚点。
3. 对比侧栏、翻页器、`book-toc` 与整本打印四处的章节顺序是否一致。
4. 检查 Markdown 输出：`curl -s http://localhost:1313/zh/handbook/ch02/index.md`。shortcode 形态应退化成 `**图 2-2.** 题注` 加原始正文，原生形态原样保留源码块与属性行。
5. 从主题仓库对构建产物跑一遍锚点检查：

```bash
python3 ~/pgsty/oink/bin/check-book.py --site-public public
```

它校验每个引用的目标锚点存在、类型与编号匹配、页内 ID 唯一，以及编号图片有与题注相称的替代文字。

## Book shortcode 参数 {#reference}

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

- 没有自动编号。章节号、图号、表号都手写；改编号是一次有意的编辑，不是构建的副作用。
- 属性行必须紧贴块，中间不能有空行。被 Prettier 之类工具移动过的属性行静默失效，图退化成普通图片。
- `book_kind` 与 `book_part` 是契约认可的元数据键，当前主题模板不渲染它们；有视觉效果的是 `book_number` 与 `book_status`。
- 索引 shortcode 会触发后代内容渲染，在超大树上明显拉长构建时间。整本 `print` 需要显式开启也是同一原因。
- shortcode 正文里不能出现脚注引用；出现时告警并指出改用原生形态，严格发布构建
  拒绝这条警告，见上文[编号：shortcode 形态](#numbering-shortcodes)。
- 打包是可选的，且在构建之外运行。`BookManifest` 加上 `bin/book-epub.py` / `bin/book-pdf.py` 可以产出 EPUB 与 PDF，但没有任何一次 Hugo 构建会自己生成这两个文件；专业排版的分页、字体嵌入与索引编制仍在契约之外。

## 相关 {#related}

- [组织内容](/zh/docs/write/organize/) — 目录树怎么变成侧栏与阅读顺序
- [图片](/zh/docs/components/image/) — 图注、尺寸、缩放与图片处理
- [表格](/zh/docs/components/table/) — 表格属性行与全宽表
- [公式](/zh/docs/components/math/) — KaTeX 与 passthrough 配置
- [打印支持](/zh/docs/customize/print/) — 整章与整本打印
