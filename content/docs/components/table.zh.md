---
title: 表格
linkTitle: 表格
description: 普通 GFM 表格加一行属性，就得到标题、兼容矩阵、参数表、编号表或标签页；宽表格自己横向滚动，不撑宽页面。
weight: 50
search_keywords: [表格, Table, matrix, 矩阵, full-width, 全宽, wide, 技术表格, caption, 表格标题, 编号表, 横向滚动, GFM]
aliases:
  - /docs/components/tables/
---

表格是普通的 GFM 管道表格。主题的表格渲染钩子把每张表包进一块可横向滚动的区域，表格下面那一行 `{…}` 属性决定它是哪一种表：带标题的表、兼容矩阵、参数表、编号表或标签页。合并单元格、排序与筛选不在能力范围内，需要它们的场景请改换呈现方式。

## 最简例子 {#minimal}

不写属性行就是一张普通表。对齐方式照旧来自分隔行，表头单元格是 `th scope="col"`。

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

列太多的表不会把页面撑宽，它在自己的区域里横向滚动。这块区域可以用键盘聚焦：Tab 停入后方向键滚动，无障碍名称是本地化的「可横向滚动的表格」。

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

## 表格标题 {#caption}

`{caption="…"}` 加一个可见的 `<caption>`，纯文本，不给表编号。

```markdown {title="源码"}
| 条目 | 取值 |
| --- | --- |
| 主题版本 | v0.8.1 |
| Hugo 下限 | 0.168.0 Extended |
| 许可证 | Apache-2.0 |
{caption="本站当前使用的主题事实"}
```

| 条目 | 取值 |
| --- | --- |
| 主题版本 | v0.8.1 |
| Hugo 下限 | 0.168.0 Extended |
| 许可证 | Apache-2.0 |
{caption="本站当前使用的主题事实"}

## 兼容矩阵 {#matrix}

`{.matrix}` 用于「行 × 列 = 支持与否」的对照表：第一列成为行表头（`th scope="row"`），滚动时表头行与第一列吸附不动，其余单元格居中，分隔行另有对齐时以分隔行为准。✅ 与 ❌ 是作者写的字符，主题不解析它们。

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
{.matrix}

## 用整个画布 {#full-width}

`{.full-width}` 让表格越出正文栏宽，占满文章可用的宽度。适合列多但每列都短的表。

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
{.full-width}

## 技术宽表格 {#wide}

> [!NOTE] 未发布：`.wide`
> 这个简短标记在开发版本中可用，尚未包含在已发布的 v1.3.2 中。
> 已有技术宽表写法继续兼容。

包含长配置键、环境变量或长标识符的技术表格，若默认压在正文列宽内排版，
容易导致标识符异常断行或描述列被极度压缩。在属性行中显式添加 `{.wide}`，
内部表格会采用按内容最大尺寸（`width: max-content`）排版，并在超出视口时触发
横向滚动。

```markdown {title="源码"}
| 变量 | 必填 | 默认值 | 对应配置项 | 描述 |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | 是 | 无 | `grpc.host` | 对外宣告的 gRPC 主机名或 IP 地址；容器网络内部应使用容器主机名。 |
| `HG_PD_INITIAL_STORE_COUNT` | 否 | `1` | `pd.initial-store-count` | 集群可用时所需的最少存储节点数量。 |
| `HG_PD_ACTUATOR_EXPOSURE` | 否 | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | 对外开放的监控端点白名单，不允许使用通配符。 |
{.wide}
```

| 变量 | 必填 | 默认值 | 对应配置项 | 描述 |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | 是 | 无 | `grpc.host` | 对外宣告的 gRPC 主机名或 IP 地址；容器网络内部应使用容器主机名。 |
| `HG_PD_INITIAL_STORE_COUNT` | 否 | `1` | `pd.initial-store-count` | 集群可用时所需的最少存储节点数量。 |
| `HG_PD_ACTUATOR_EXPOSURE` | 否 | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | 对外开放的监控端点白名单，不允许使用通配符。 |
{.wide}

### 与 .full-width 的区别 {#wide-vs-full-width}

- `.full-width` 控制「外层画布」：让表格外层容器突破正文栏宽限制，扩展至整页可用宽度；适合列数较多但各列内容较短的表格。
- `.wide` 控制「内部表格排版」：让内部 `<table>` 以自身内容的最大自然宽度（`width: max-content`）排版，依靠横向滚动容纳长内容；适合包含长代码标识符的技术表格。
- 两者可以结合使用：例如 `{.full-width .wide}` 既让外层容器占满全宽画布，又让内部列保持宽松的自然宽度。

### 适用边界与排版策略 {#wide-boundaries}

- **显式开启**：普通表格保持现有布局。只有 `.wide` 表格使用
  `overflow-wrap: break-word`、`word-break: normal`，并以 `max-width: 40ch`
  作为正文单元格的软宽度约束。特别长的标识符仍可换行，该约束不是固定列宽。
- **静态输出**：此策略只作用于屏幕。Print 与 RSS 使用静态包装并保留原有布局；
  Markdown 保留作者的 GFM 表格及属性行。该标记对 `.fields` 定义列表没有作用。

## 参数表 {#fields}

`{.fields}` 把表格变成定义列表：第一列是名称，最后一列是说明，中间列是元数据。它是记录配置项、命令参数、API 字段的形态，写法见[参数表](/zh/docs/components/fields/)。

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

写书或长手册时给表编号：`num` 加可选的 `#id` 与 `caption`。表格会被包进一个带本地化「表 N.」标签的 `<figure>`，并注册成 Book 目标，可以被 `xref` 引用、进入全书表格目录。编号由作者书写，主题不自动计数；`id` 缺省是 `tbl-<num>`。

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

连着的表格加 `{tab="…"}` 就组成一组标签页，规则与相邻围栏一致：第一张表上的 `group` 启用 hash、同步与持久化，此后每张表都要 `value`。完整规则见[标签页](/zh/docs/components/tabs/)。

```markdown {title="源码"}
| 目录 | 内容 |
| --- | --- |
| `content/` | 页面 |
| `data/` | 首页与发布数据 |
{tab="内容" group="repo-layout" value="content"}

| 目录 | 内容 |
| --- | --- |
| `assets/` | SCSS 与图片资源 |
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
| `assets/` | SCSS 与图片资源 |
| `static/` | 原样拷贝的文件 |
{tab="资源" value="assets"}

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | `<div class="td-table-scroll">` 可聚焦滚动区 + `<table>`；矩阵与全宽是这个包装器上的修饰 class |
| 打印 | 保留完整静态内容；浏览器预览提供可键盘滚动的区域，打印媒体样式在实际打印时展开区域 |
| Markdown | 原样输出源码表格与属性行 |
| RSS | 完整静态表格 |

表格不加载任何脚本。

## 参数参考 {#reference}

表格下一行的属性行：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `.full-width` | 标记 | 无 | 越出正文栏宽，占满文章画布 |
| `.wide` | 标记 | 无 | 内部表格采用 max-content 宽度排版，适合配置项等技术宽表 |
| `.matrix` | 标记 | 无 | 第一列作行表头，表头与首列吸附，其余单元格居中 |
| `.fields` | 标记 | 无 | 渲染成定义列表，见[参数表](/zh/docs/components/fields/) |
| `caption` | 纯文本 | 无 | 可见表格标题；在 `.fields` 上是列表的标签 |
| `meta` | 角色列表 | 无 | 命名 `.fields` 中间列的语义，取值 `type` `required` `default` `-`；必须与 `.fields` 同用 |
| `#id` | 标识符 | 有 `num` 时为 `tbl-<num>` | `[A-Za-z][A-Za-z0-9_.:-]*`；写在 `<table>`（编号表则写在 `<figure>`）上 |
| `num` | 字符串 | 无 | `[0-9A-Za-z.-]+`；注册为 Book 表目标，标题前加「表 N.」 |
| `tab` / `group` / `value` | 见[标签页](/zh/docs/components/tabs/) | 无 | 相邻表格组成标签页 |
| `class` | class 列表 | 无 | 站点 CSS 用，原样留在 `<table>` 上 |
| `data-*` / `aria-*` | 字符串 | 无 | 透传 |
{.fields meta="type default"}

`style`、`on*` 与其它键会告警并忽略；发布前应审阅告警并检查回退结果。

## 限制与常见问题 {#limits}

- 互斥规则：`.fields` 不能和 `.matrix`、`.full-width` 或 `num` 一起用；`num` 与 `tab` 互斥；`group`/`value` 需要 `tab`；`meta` 需要 `.fields`。
- 属性行必须紧贴表格：中间空一行，它就变成正文里一段可见的花括号。Markdown 格式化工具常移动这一行，把它包进 `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->`。
- 没有合并单元格、没有排序、没有筛选：GFM 管道表格能表达的就是全部。需要合并表头的复杂表请拆成两张表或改成一张矩阵。
- 单元格里放不下块内容：多段说明、列表、围栏要用 `fields`/`field` shortcode。
- `.matrix` 的居中由 CSS 实现：分隔行里写了对齐就以分隔行为准。

## 相关 {#related}

- [参数表](/zh/docs/components/fields/) — `{.fields}` 的完整写法
- [标签页](/zh/docs/components/tabs/) — 相邻表格组成标签页
- [书籍出版](/zh/docs/write/book/) — 编号表、交叉引用与表格目录
- [代码块](/zh/docs/components/code/) — 属性写在信息行而不是下一行
