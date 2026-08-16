---
title: Fields 与 Field
linkTitle: Fields
description: 使用响应式语义 HTML 描述配置、参数、属性与响应字段。
weight: 40
---

Fields 用响应式定义列表记录具名值及其元数据，长名称和长描述在窄屏上仍然可用。它有两种形态：普通 Markdown 表格后跟
`{.fields}`，以及提供强类型元数据与多段描述的 `fields`/`field` 短代码对。

## 适用场景 {#when-to-use}

Fields 适合配置键、命令或 API 参数、对象属性与响应字段。如果读者需要按相同列横向比较大量条目，请使用普通 Markdown 表格；如果条目表达的是步骤而不是定义，请使用正文。

## 表格形态 {#table-form}

写一张 pipe 表格，并在下一行加上 `{.fields}`。**第一列** 是字段名，**最后一列**
是说明，中间的每一列都是以表头为标签的元数据——任何语言都可以，没有固定词汇表：

<!-- prettier-ignore-start -->

```markdown
| 参数                         | 类型    | 默认值  | 说明                           |
| ---------------------------- | ------- | ------- | ------------------------------ |
| `offlineSearch`              | boolean | `false` | 构建 **本地** 搜索索引         |
| `offlineSearchMaxResults`    | integer | `10`    | 限制可见结果数量               |
| `searchPlaceholder`          | string  |         | 可选占位文字；空单元格会被省略 |
{.fields caption="搜索配置"}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

| 参数                       | 类型    | 默认值  | 说明                                   |
| -------------------------- | ------- | ------- | -------------------------------------- |
| `offlineSearch`            | boolean | `false` | 构建 **本地** 搜索索引                 |
| `offlineSearchMaxResults`  | integer | `10`    | 限制可见结果数量                       |
| `searchPlaceholder`        | string  |         | 可选占位文字；空单元格会被省略         |
{.fields caption="搜索配置"}

<!-- prettier-ignore-end -->

单元格接受行内 Markdown（链接、代码、强调）；第一个单元格必须非空且唯一。`caption`
成为可见标签。在 GitHub 上源码仍然是一张可读的表格，OINK 的 Markdown 输出也保持为表格。描述需要多个段落、列表或围栏时，请使用短代码形态。

## 短代码形态 {#quick-start}

### 源码 {#source}

```go-html-template
{{</* fields label="搜索配置" */>}}
  {{</* field name="offlineSearch" type="boolean" required=true default=true */>}}
  构建 **本地** 搜索索引与命令面板。
  {{</* /field */>}}

  {{</* field name="offlineSearchMaxResults" type="integer" default=10 */>}}
  限制可见结果数量。
  {{</* /field */>}}
{{</* /fields */>}}
```

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

{{< fields label="搜索配置" >}}
  {{< field name="offlineSearch" type="boolean" required=true default=true >}}
  构建 **本地** 搜索索引与命令面板。
  {{< /field >}}
  {{< field name="offlineSearchMaxResults" type="integer" default=10 >}}
  限制可见结果数量，同时保留键盘导航能力。
  {{< /field >}}
  {{< field name="searchPlaceholder" type="string" default="" >}}
  设置可选占位文字。空字符串默认值仍然会明确显示。
  {{< /field >}}
  {{< field name="theme.components.media.previewMaximumWidthInCharacters" type="string" default="auto" >}}
  这个刻意加长的字段名用于演示正常换行，而不会撑宽页面。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

描述可以使用 Markdown，包括链接、强调、行内代码与列表。每段描述应保持独立完整，因为 Markdown 输出会把它放在对应元数据下方。

## Fields 参数 {#fields-parameters}

<!-- prettier-ignore-start -->

{{< fields label="fields 参数" >}}
  {{< field name="label" type="string" >}}
  与完整定义列表关联的非空可见标签。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

容器至少要有一个直接 `field` 子项。直接放在 `fields`
中的普通文字或其他短代码会让构建停止。

## Field 参数 {#field-parameters}

<!-- prettier-ignore-start -->

{{< fields label="field 参数" >}}
  {{< field name="name" type="string" required=true >}}
  标识字段的非空字符串。
  {{< /field >}}
  {{< field name="type" type="string" >}}
  非空类型标签，例如 `boolean`、`string[]` 或 `duration`。
  {{< /field >}}
  {{< field name="required" type="boolean" default=false >}}
  为 true 时添加字面量 `required` 标记，该标记不做本地化。
  {{< /field >}}
  {{< field name="default" type="scalar" >}}
  字符串、布尔值、整数或浮点数；`false`、`0` 与 `""` 都会保留。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

每个 `field` 还必须包含非空正文，并且必须是 `fields`
的直接子项。参数名称与类型在构建时校验，未知参数会被视为错误。

## 语义与回退 {#semantics-and-fallback}

两种形态渲染同样的 `dl`、`dt`、`dd`
结构。每个条目把标题行——字段名及其元数据小标签——叠放在描述之上，条目之间用细线分隔。短代码形态的小标签是
`type`、`required` 与
`default`（在所有语言环境中都保持英文）；表格形态的每个小标签是
`表头: 值`。可选的标签为辅助技术命名整个定义列表。Markdown 输出保留源码表格，或为短代码形态输出带代码格式名称、类型与默认值的缩进项目符号列表；打印与 RSS 保留全部定义。不加载 JavaScript。

## 有意保留的边界 {#deliberate-limits}

第一版不实现 `kind`、`deprecated`、`since`、`location`
或字段级链接，也不会在 Hugo 内解析 TypeScript 或 API
schema。将来可以由外部生成器输出这些短代码，把编译器与 schema 运行时留在主题之外，同时保持当前输出契约。
