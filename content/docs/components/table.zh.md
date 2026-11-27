---
title: 表格
linkTitle: 表格
description: 给普通 Markdown 表格加一行属性，做成带标题的表、兼容矩阵、参数表、编号表或标签页，并让宽幅技术表格有足够的阅读空间。
weight: 50
search_keywords: [表格, Table, matrix, 矩阵, full-width, 全宽, wide, 技术表格, caption, 表格标题, 编号表, 横向滚动, GFM]
aliases:
  - /docs/components/tables/
---

表格就是普通的 GFM 管道表格，在 GitHub 和任何编辑器里都照常显示。OINK 补上长篇技术表格需要的东西：宽表格在自己的区域里横向滚动，不会把整页撑宽；表格下面再写一行属性，就能把它变成带标题的表、兼容矩阵、参数表、编号表，或者一组标签页中的一页。

GFM 没有合并单元格、排序和筛选，OINK 也不补这些。需要合并表头的数据，拆成两张表或改成矩阵通常更好读；单元格里要放多段文字或列表时，改用[参数表](/zh/docs/components/fields/)。

## 最简例子 {#minimal}

不写属性行就是一张普通表格。分隔行决定各列的对齐方式，表头单元格输出为 `th scope="col"`。

```markdown {title="源码"}
| 组件 | 端口 | 用途 |
| --- | :---: | --- |
| PostgreSQL | 5432 | 数据库 |
| Pgbouncer | 6432 | 连接池 |
| Patroni | 8008 | 高可用编排 |
```

| 组件 | 端口 | 用途 |
| --- | :---: | --- |
| PostgreSQL | 5432 | 数据库 |
| Pgbouncer | 6432 | 连接池 |
| Patroni | 8008 | 高可用编排 |

## 宽表格自己滚动 {#scroll}

比正文栏更宽的表格在自己的区域里横向滚动，手机上页面的其余部分不会跟着变宽。键盘用户用 Tab 进入这块区域，再用方向键滚动；读屏器按页面语言把它读作「可横向滚动的表格」。

```markdown {title="源码"}
| 集群 | 角色 | 版本 | 状态 | 延迟 | 连接数 | 大小 | 备份 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pg-meta | primary | 18.1 | running | — | 42 | 12 GB | 2026-08-17 |
| pg-test | replica | 18.1 | streaming | 12 ms | 8 | 12 GB | 2026-08-17 |
```

| 集群 | 角色 | 版本 | 状态 | 延迟 | 连接数 | 大小 | 备份 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pg-meta | primary | 18.1 | running | — | 42 | 12 GB | 2026-08-17 |
| pg-test | replica | 18.1 | streaming | 12 ms | 8 | 12 GB | 2026-08-17 |
{.wide .expand}

## 表格标题 {#caption}

`{caption="…"}` 给表格加一个纯文本的可见 `<caption>`。它不给表格编号；需要「表 9-1」这样的编号时用 [`num`](#numbered)。

```markdown {title="源码"}
| 设置 | 取值 |
| --- | --- |
| 端口 | 5432 |
| 数据目录 | `/var/lib/pgsql/18/data` |
| 许可证 | PostgreSQL License |
{caption="全新 EL 9 节点上的 PostgreSQL 默认值"}
```

| 设置 | 取值 |
| --- | --- |
| 端口 | 5432 |
| 数据目录 | `/var/lib/pgsql/18/data` |
| 许可证 | PostgreSQL License |
{caption="全新 EL 9 节点上的 PostgreSQL 默认值"}

## 兼容矩阵 {#matrix}

`{.matrix}` 用于「什么支持什么」的对照表。第一列成为行表头（`th scope="row"`），无论横向还是纵向滚动，表头行和第一列都固定不动，因此大矩阵深处的单元格也看得到自己属于哪一行哪一列。单元格默认居中，分隔行另写了对齐方式时以分隔行为准。✅ 与 ❌ 只是你自己输入的普通字符，主题不赋予它们任何含义。

```markdown {title="源码"}
| OS / PG | PG18 | PG17 | PG16 | PG15 | PG14 |
| --- | :---: | :---: | :---: | :---: | :---: |
| EL 9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| EL 8 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Debian 13 | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ubuntu 24.04 | ✅ | ✅ | ✅ | ✅ | ❌ |
{.matrix}
```

| OS / PG | PG18 | PG17 | PG16 | PG15 | PG14 |
| --- | :---: | :---: | :---: | :---: | :---: |
| EL 9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| EL 8 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Debian 13 | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ubuntu 24.04 | ✅ | ✅ | ✅ | ✅ | ❌ |
{.matrix .wide .expand}

## 用整个画布 {#full-width}

`{.full-width}` 让表格越出正文栏，占满文章的全部宽度。列多而每列都短、否则就要横向滚动的表格适合用它。

```markdown {title="源码"}
| 语言 | 代码 | 侧栏 | 搜索 | 目录 | 打印 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 简体中文 | `zh` | ✅ | ✅ | ✅ | ✅ | 已审校 |
| English | `en` | ✅ | ✅ | ✅ | ✅ | 已审校 |
{.full-width}
```

| 语言 | 代码 | 侧栏 | 搜索 | 目录 | 打印 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 简体中文 | `zh` | ✅ | ✅ | ✅ | ✅ | 已审校 |
| English | `en` | ✅ | ✅ | ✅ | ✅ | 已审校 |
{.full-width .wide .expand}

## 技术宽表格 {#wide}

配置键、环境变量这类表格硬塞进正文栏宽，标识符会在奇怪的位置断开，行也会被挤得很高。`.wide` 让表格按内容的自然宽度排版（`width: max-content`），超出页面宽度时横向滚动。单元格只在词与词之间换行（`overflow-wrap: break-word`、`word-break: normal`），正文单元格另有 `max-width: 40ch` 的软上限，长描述会折成一栏易读的文字，而不是一整行。特别长的标识符仍可能换行，这个上限也不是固定列宽。

```markdown {title="源码"}
| 变量 | 必填 | 默认值 | 对应配置项 | 描述 |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | 是 | 无 | `grpc.host` | 对外宣告的 gRPC 主机名或 IP 地址；容器网络内部应使用容器主机名。 |
| `HG_PD_INITIAL_STORE_COUNT` | 否 | `1` | `pd.initial-store-count` | 集群可用时所需的最少存储节点数量。 |
| `HG_PD_ACTUATOR_EXPOSURE` | 否 | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | 对外开放的监控端点白名单，不允许使用通配符。 |
{.wide .expand}
```

| 变量 | 必填 | 默认值 | 对应配置项 | 描述 |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | 是 | 无 | `grpc.host` | 对外宣告的 gRPC 主机名或 IP 地址；容器网络内部应使用容器主机名。 |
| `HG_PD_INITIAL_STORE_COUNT` | 否 | `1` | `pd.initial-store-count` | 集群可用时所需的最少存储节点数量。 |
| `HG_PD_ACTUATOR_EXPOSURE` | 否 | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | 对外开放的监控端点白名单，不允许使用通配符。 |
{.wide .expand}

`.wide` 与 `.full-width` 解决的是两个问题，也可以合写成 `{.full-width .wide}`。`.full-width` 加宽表格所在的外框，适合列多而短的表；`.wide` 改变框内表格分配列宽的方式，适合长标识符。`.wide` 只作用于屏幕：打印和 RSS 保持普通排版，对 `.fields` 也不起作用。旧的 `.td-table--wide` class 仍然有效，与 `.wide` 等价。

## 展开指定表格 {#expand}

`.expand` 在表格右上角放一个小小的展开图标：桌面端悬停或键盘聚焦时出现，触屏设备上一直显示。点一下，表格就在一个占满窗口的对话框里打开，字号、链接和文字选择都与正文相同；点关闭或按 Escape，表格回到原处，阅读位置不变。窄屏上的宽表格在对话框里仍可横向滚动。本页大多数示例都带了 `.expand`，可以直接试。

```markdown {title="源码"}
| 扩展包 | 版本 | 用途 |
| --- | --- | --- |
| `pgvector` | `0.8.1` | 向量相似度检索 |
| `pg_stat_statements` | `1.11` | 语句统计 |
{.wide .expand}
```

| 扩展包 | 版本 | 用途 |
| --- | --- | --- |
| `pgvector` | `0.8.1` | 向量相似度检索 |
| `pg_stat_statements` | `1.11` | 语句统计 |
{.wide .expand caption="扩展包示例"}

只给少数确实需要更大空间的表格加：主题没有按尺寸自动判断的阈值，也没有全站开关，因为每张表都带一个图标只会添乱。`.expand` 可以单独使用，也可以与 `.wide`、`.full-width`、`.matrix`、标题、编号或标签页组合。多个 class 有两种等价写法：`{.wide .expand}` 或 `{class="wide expand"}`。

只有含 `.expand` 表格的页面才加载这个小型阅读脚本。没有 JavaScript 或浏览器不支持原生 `<dialog>` 时，读者看到的是完整的正文表格，也不会出现点不动的按钮。打印前，已展开的表格会先回到正文。表格的 `headers`、`aria-labelledby` 或 `aria-describedby` 指向表格之外的元素时，它保持在正文中不展开，因为放进对话框会切断这些引用。站点 CSS 如果通过文章的祖先元素给表格加样式，请检查这类表格在对话框里的效果。

## 参数表 {#fields}

`{.fields}` 把表格渲染成定义列表：第一列是名称，最后一列是说明，中间各列是元数据。配置项、命令参数、API 字段都适合这种形态，完整写法见[参数表](/zh/docs/components/fields/)。

```markdown {title="源码"}
| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | 构建本地搜索索引 |
| `page_width` | string | `normal` | 正文栏宽度 |
{.fields meta="type default"}
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | 构建本地搜索索引 |
| `page_width` | string | `normal` | 正文栏宽度 |
{.fields meta="type default"}

## 编号表 {#numbered}

书籍和长篇手册按编号引用表格。加上 `num`，再按需写 `#id` 与 `caption`：表格会被包进一个 `<figure>`，带有按页面语言显示的「表 N.」标签，可以被 `xref` 引用，并进入全书的表格目录。编号由你决定，主题不自动计数；`id` 缺省为 `tbl-<num>`。

```markdown {title="源码"}
| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| 读已提交 | 否 | 是 | 是 |
| 可重复读 | 否 | 否 | 是 |
| 可串行化 | 否 | 否 | 否 |
{#tbl-iso num="9-1" caption="PostgreSQL 各隔离级别允许的异象"}

参见 {{</* xref tbl="9-1" anchor="tbl-iso" */>}}。
```

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| 读已提交 | 否 | 是 | 是 |
| 可重复读 | 否 | 否 | 是 |
| 可串行化 | 否 | 否 | 否 |
{#tbl-iso num="9-1" caption="PostgreSQL 各隔离级别允许的异象"}

参见 {{< xref tbl="9-1" anchor="tbl-iso" />}}。

## 表格做成标签页 {#tabs}

相邻的表格加上 `{tab="…"}` 就组成一组标签页，规则与相邻代码围栏相同。第一张表写了 `group`，这组标签页就有可分享的 URL hash、同组联动和记住的选择，此时每张表都要写 `value`。完整规则见[标签页](/zh/docs/components/tabs/)。

```markdown {title="源码"}
| 目录 | 内容 |
| --- | --- |
| `content/` | 页面 |
| `data/` | 首页与发布数据 |
{tab="内容" group="repo-layout" value="content"}

| 目录 | 内容 |
| --- | --- |
| `assets/` | CSS 与图片资源 |
| `static/` | 原样拷贝的文件 |
{tab="资源" value="assets"}
```

| 目录 | 内容 |
| --- | --- |
| `content/` | 页面 |
| `data/` | 首页与发布数据 |
{tab="内容" group="repo-layout" value="content"}

| 目录 | 内容 |
| --- | --- |
| `assets/` | CSS 与图片资源 |
| `static/` | 原样拷贝的文件 |
{tab="资源" value="assets"}

## 输出形态 {#outputs}

HTML 中每张表都放在一个可聚焦的 `<div class="td-table-scroll">` 里；`.matrix` 与 `.full-width` 在这个外层包装上加修饰 class，你自己写的 class 留在 `<table>` 上。普通表格不加载脚本。打印与 RSS 输出完整的静态表格，没有阅读器，也没有标签栏；Markdown 输出原样保留表格和它的属性行。

## 参数参考 {#reference}

表格下一行的属性行：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `.full-width` | 标记 | 无 | 越出正文栏，占满文章宽度 |
| `.wide` | 标记 | 无 | 内部表格按 `max-content` 宽度排版，适合含长标识符的技术表格 |
| `.expand` | 标记 | 无 | 在角落加一个入口，在更大的对话框里阅读表格 |
| `.matrix` | 标记 | 无 | 第一列作行表头，表头行与第一列固定，其余单元格居中 |
| `.fields` | 标记 | 无 | 渲染成定义列表，见[参数表](/zh/docs/components/fields/) |
| `caption` | 纯文本 | 无 | 可见的表格标题；用在 `.fields` 上时是列表的标签 |
| `meta` | 角色列表 | 无 | `.fields` 中间各列的含义，取值 `type` `required` `default` `-`；需要 `.fields` |
| `#id` | 标识符 | 有 `num` 时为 `tbl-<num>` | `[A-Za-z][A-Za-z0-9_.:-]*`；写在 `<table>` 上，编号表则写在 `<figure>` 上 |
| `num` | 字符串 | 无 | `[0-9A-Za-z.-]+`；注册为 Book 表格目标，标题前加「表 N.」 |
| `tab` / `group` / `value` | 见[标签页](/zh/docs/components/tabs/) | 无 | 相邻表格组成标签页 |
| `class` | class 列表 | 无 | 留在 `<table>` 上，供站点 CSS 使用 |
| `data-*` / `aria-*` | 字符串 | 无 | 原样透传 |
{.fields meta="type default"}

其它键（包括 `style` 与 `on*` 事件属性）会被丢弃，并在构建时告警。

## 限制与常见问题 {#limits}

- 有些属性互斥。`.fields` 优先于 `.matrix`、`.full-width`、`.expand` 和 `num`，`num` 优先于 `tab`；被压下的一方告警并丢弃。`group` 与 `value` 需要 `tab`，`meta` 需要 `.fields`。
- 属性行必须紧贴表格最后一行：中间隔一个空行，Goldmark 会悄悄丢掉它，表格按普通表渲染，没有任何告警。站点没有开启 `markup.goldmark.parser.attribute.block: true`（[站点前置配置](/zh/docs/components/#prerequisites)之一）时，花括号会作为文字显示出来。Prettier 等格式化工具会挪动这一行，用 `<!-- prettier-ignore-start -->` 与 `<!-- prettier-ignore-end -->` 把表格包起来。
- 没有合并单元格、排序和筛选。带合并表头的表请拆成两张，或改成矩阵。
- 单元格只能放行内内容。多段说明、列表或代码块要用 `fields`/`field` shortcode。
- `.matrix` 的居中由 CSS 实现，分隔行里写了对齐方式就以分隔行为准。

## 相关 {#related}

- [参数表](/zh/docs/components/fields/) — `{.fields}` 的完整写法
- [标签页](/zh/docs/components/tabs/) — 相邻表格组成标签页
- [书籍出版](/zh/docs/write/book/) — 编号表、交叉引用与表格目录
- [代码块](/zh/docs/components/code/) — 属性写在信息行而不是下一行
