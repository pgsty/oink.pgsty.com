---
title: 参数表
linkTitle: 参数表
description: 把配置项、命令参数与 API 字段写成参数表：手机上也不挤，每一条都能单独链接。
weight: 60
search_keywords: [参数表, Fields, field, 配置项, 参数, API 字段, meta, type, required, default, 定义列表, 锚点]
---

参数表（Fields）专门用来记录具名的设置项：配置键、命令行参数、API 字段。每个名称独占一行，旁边用小标签标出类型、是否必填和默认值，说明文字在下方占满整行。这样即使说明很长，在手机上也不会被挤进窄窄的一列；每一条还有自己的锚点，可以把某一个参数的链接直接贴进 issue 或聊天里。

参数表适合参考资料。读者需要按同一批列横向比较很多行时，保留普通表格；内容是一串操作时，用[步骤](/zh/docs/components/steps/)。

## 最简例子 {#minimal}

写一张至少两列的管道表格，紧接着的下一行写 `{.fields}`。第一列是名称，最后一列是说明，中间各列都是元数据。

```markdown {title="源码"}
| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | 构建本地搜索索引并启用命令面板 |
| `offline_search_max_results` | integer | `10` | 搜索结果条数上限 |
| `page_width` | string | `normal` | 正文栏宽度，可选 `normal` `wide` `full` |
{.fields}
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | 构建本地搜索索引并启用命令面板 |
| `offline_search_max_results` | integer | `10` | 搜索结果条数上限 |
| `page_width` | string | `normal` | 正文栏宽度，可选 `normal` `wide` `full` |
{.fields}

每个元数据单元格显示成「表头: 值」。主题不会揣测表头的含义，这里的 `类型` 只是一个标签；想要标准的类型、必填、默认值标签，用下一节的 `meta` 指定列的角色。单元格支持代码、强调、链接等行内 Markdown，空的元数据单元格不显示。

## 语义列 `meta=` {#meta}

`meta` 按列的顺序给每个元数据列指定角色：`type`（类型）、`required`（必填）、`default`（默认值），或 `-`（保留表头作为普通标签）。指定之后，表格渲染出的标签与 shortcode 形态完全一致。

```markdown {title="源码"}
| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `baseURL` | string | 是 | | 站点地址，含子路径 |
| `title` | string | 是 | | 站点名，出现在顶栏与页签 |
| `defaultContentLanguage` | string | | `en` | 默认语言，决定无前缀路径属于哪种语言 |
{.fields meta="type required default"}
```

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `baseURL` | string | 是 | | 站点地址，含子路径 |
| `title` | string | 是 | | 站点名，出现在顶栏与页签 |
| `defaultContentLanguage` | string | | `en` | 默认语言，决定无前缀路径属于哪种语言 |
{.fields meta="type required default"}

- 每个元数据列恰好写一个角色，个数等于总列数减二。写多或写少时构建告警，表格按没有 `meta` 的方式渲染。
- `required` 列非空即为必填：写「是」「yes」还是「✔」，显示的都是英文的 `required` 标签。可选项请留空，因为写「否」或 `no` 同样算作必填。
- `type` 与 `default` 的值如果没有自带行内标记，会自动套上代码格式，与 shortcode 形态保持一致。
- 标签总是按 `type`、`required`、`default` 的顺序显示，与列的顺序无关；`-` 列排在后面，保持原有顺序。

`-` 可以与语义角色混用，让某一列保留自己的标签：

```markdown {title="源码"}
| 环境变量 | 类型 | 读取方 | 说明 |
| --- | --- | --- | --- |
| `PGHOST` | string | libpq 客户端 | 服务器主机名，或 Unix 套接字所在目录 |
| `PGDATA` | path | 服务端工具 | 未指定 `-D` 时，`initdb` 与 `pg_ctl` 使用的数据目录 |
{.fields meta="type -"}
```

| 环境变量 | 类型 | 读取方 | 说明 |
| --- | --- | --- | --- |
| `PGHOST` | string | libpq 客户端 | 服务器主机名，或 Unix 套接字所在目录 |
| `PGDATA` | path | 服务端工具 | 未指定 `-D` 时，`initdb` 与 `pg_ctl` 使用的数据目录 |
{.fields meta="type -"}

## 标签与容器 ID {#caption-id}

`caption` 在列表上方显示一个标签，同时作为列表的无障碍名称；`id` 设置外层容器的 ID，方便从别处链接到整张表，或在站点 CSS 里单独设置样式。

```markdown {title="源码"}
| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `image_zoom` | boolean | `false` | 打开图片缩放 |
| `featured_image` | string | `none` | 文章题图模式：`none`、`banner`、`wash` 或 `hero` |
{.fields caption="params.ui" id="zoom-params" meta="type default"}
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `image_zoom` | boolean | `false` | 打开图片缩放 |
| `featured_image` | string | `none` | 文章题图模式：`none`、`banner`、`wash` 或 `hero` |
{.fields caption="params.ui" id="zoom-params" meta="type default"}

## 每一条都能单独链接 {#anchors}

每个条目都有一个 `field-<名称>` 形式的锚点，鼠标悬停时名称旁边会出现链接图标。例如本页第一张表里的 `page_width` 就是 [#field-page_width](#field-page_width)。同一页里名称重复时，第二个锚点加 `-2`，第三个加 `-3`，与 Goldmark 处理重名标题的规则相同。

如果别的页面已经链接到某个锚点，想保住它，可以给 `field` shortcode 写一个显式的 `id`，例如 `id="guc-work-mem"`；值为空、重复或含有不安全字符时会告警，并回退到自动生成的锚点。[本地搜索](/zh/docs/customize/search/)会为每个带锚点的条目建立索引，搜索参数名就能直接跳到这一条。

## shortcode 形态 {#shortcode}

表格单元格放不下段落、列表和代码块。说明需要这些内容时，改用 `fields` 与 `field` 两个 shortcode。

````markdown {title="源码"}
{{</* fields label="pig 命令常用参数" */>}}
{{</* field name="--config" type="path" required=true */>}}
配置文件路径。相对路径按当前工作目录解析。

如果同时设置了 `PIG_CONFIG` 环境变量，以命令行参数为准。
{{</* /field */>}}
{{</* field name="--log-level" type="string" default="info" */>}}
日志级别，从低到高：

- `debug`：打印每一次远程调用
- `info`：默认值
- `error`：只在失败时输出
{{</* /field */>}}
{{</* field name="--dry-run" type="boolean" default=false */>}}
只打印将要执行的动作，不做任何改动：

```bash
pig ext install pg_duckdb --dry-run
```
{{</* /field */>}}
{{</* /fields */>}}
````

{{< fields label="pig 命令常用参数" >}}
{{< field name="--config" type="path" required=true >}}
配置文件路径。相对路径按当前工作目录解析。

如果同时设置了 `PIG_CONFIG` 环境变量，以命令行参数为准。
{{< /field >}}
{{< field name="--log-level" type="string" default="info" >}}
日志级别，从低到高：

- `debug`：打印每一次远程调用
- `info`：默认值
- `error`：只在失败时输出
{{< /field >}}
{{< field name="--dry-run" type="boolean" default=false >}}
只打印将要执行的动作，不做任何改动：

```bash
pig ext install pg_duckdb --dry-run
```
{{< /field >}}
{{< /fields >}}

`required=true` 与 `default=false` 不要加引号，加了引号就成了字符串而不是布尔值。`default` 接受任何标量，`default=0` 与 `default=""` 都会如实显示，空字符串显示为 `""`；不写 `default` 就没有默认值标签。每个 `field` 必须有非空正文，并且直接放在 `fields` 里面。

## 两种形态的选择 {#which}

| 情况 | 用法 |
| --- | --- |
| 每条说明一句话，能放进表格单元格 | 表格 + `{.fields}` |
| 说明要分段、带列表或代码块 | `fields`/`field` shortcode |
| 读者需要按同一批列横向比较很多行 | 用普通表格，不转成参数表 |
| 内容是操作顺序 | 用[步骤](/zh/docs/components/steps/) |

放得下时优先用表格形态：它在 GitHub 上仍是一张可读的表，页面的 Markdown 输出也保留这张表。

## 输出形态 {#outputs}

参数表不加载脚本。打印与 RSS 输出完整列表，但不带条目锚点，因为打印视图会把许多页拼成一个文档，锚点在那里会互相冲突。在页面的 Markdown 输出里，表格形态保持源码表格；shortcode 形态则变成项目符号列表，每条是「`名称` — 类型；required；default: 值」，说明缩进在下方。

## 参数参考 {#reference}

表格属性行（紧接在表格下一行）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `.fields` | 标记 | 无 | 必需；把表格渲染成参数表 |
| `meta` | 角色列表 | 无 | 空格分隔，取值 `type` `required` `default` `-`；个数等于中间列数；语义角色不可重复 |
| `caption` | 纯文本 | 无 | 可见标签，同时是列表的无障碍名称 |
| `id` | 标识符 | 无 | 外层容器的 ID |
| `class` | class 列表 | 无 | 透传给站点 CSS |
| `data-*` / `aria-*` | 字符串 | 无 | 透传 |
{.fields meta="type default"}

`fields` shortcode：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `label` | 非空字符串 | | 可见标签，作用同表格的 `caption` |
| `id` | 标识符 | | 外层容器 ID；不能含空白、引号、`<`、`>`、`&` |
| `class` / `data-*` / `aria-*` | 字符串 | | 与表格属性行同一套策略 |
{.fields meta="type required"}

`field` shortcode：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | 非空字符串 | 是 | 字段名 |
| `id` | 标识符 | | 替换自动生成的 `field-<名称>` 锚点；不能含空白、引号、`<`、`>`、`&`，且在同页参数中唯一 |
| `type` | 非空字符串 | | 类型标签，如 `boolean` `string[]` `duration` |
| `required` | 布尔 | | `true` 时显示不翻译的 `required` 标签，默认 `false` |
| `default` | 标量 | | 字符串 / 布尔 / 整数 / 浮点；`false`、`0`、`""` 都会显示 |
{.fields meta="type required"}

## 限制与常见问题 {#limits}

- 第一列必须非空，且在同一张表内唯一；名称为空或重复的行会告警并被跳过。
- `.fields` 不能与 `.matrix`、`.full-width`、`num` 组合，`meta` 只能用在带 `.fields` 的表上。
- 表格单元格放不下块级内容，需要段落、列表、代码块时换用 shortcode 形态。
- `required` 与 `default` 在所有语言下都显示英文，因为它们是 API 词汇，不是界面文案。
- 没有 `kind`、`since`、`deprecated`、`location` 之类的元数据，没有字段级链接，也不支持嵌套，更不会从 TypeScript 或 OpenAPI schema 生成条目。

## 相关 {#related}

- [表格](/zh/docs/components/table/) — 属性行的其它取值与互斥规则
- [配置总览](/zh/docs/customize/config/) — 站点参数全表就是用参数表写的
- [页面参数](/zh/docs/write/frontmatter/) — front matter 全表
- [步骤](/zh/docs/components/steps/) — 顺序动作不要写成参数表
