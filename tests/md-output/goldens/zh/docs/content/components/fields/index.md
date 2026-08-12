# Fields 与 Field

> 使用响应式语义 HTML 描述配置、参数、属性与响应字段。

---

LLMS index: [llms.txt](/zh/llms.txt)

---

`fields` 与 `field`
子项用于记录具名值及其元数据。组件使用响应式定义列表，而不是固定宽度的大表格，因此长名称和长描述在窄屏上仍然可用。

## 适用场景 {#when-to-use}

Fields 适合配置键、命令或 API 参数、对象属性与响应字段。如果读者需要按相同列横向比较大量条目，请使用普通 Markdown 表格；如果条目表达的是步骤而不是定义，请使用正文。

## 快速开始 {#quick-start}

### 源码 {#source}

```go-html-template
{{< fields label="搜索配置" >}}
  {{< field name="offlineSearch" type="boolean" required=true default=true >}}
  构建 **本地** 搜索索引与命令面板。
  {{< /field >}}

  {{< field name="offlineSearchMaxResults" type="integer" default=10 >}}
  限制可见结果数量。
  {{< /field >}}
{{< /fields >}}
```

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

**搜索配置**

- `offlineSearch` — `boolean`; 必填; 默认值: `true`

  构建 **本地** 搜索索引与命令面板。

- `offlineSearchMaxResults` — `integer`; 默认值: `10`

  限制可见结果数量，同时保留键盘导航能力。

- `searchPlaceholder` — `string`; 默认值: `""`

  设置可选占位文字。空字符串默认值仍然会明确显示。

- `theme.components.media.previewMaximumWidthInCharacters` — `string`; 默认值: `auto`

  这个刻意加长的字段名用于演示正常换行，而不会撑宽页面。

<!-- prettier-ignore-end -->

描述可以使用 Markdown，包括链接、强调、行内代码与列表。每段描述应保持独立完整，因为 Markdown 输出会把它放在对应元数据下方。

## Fields 参数 {#fields-parameters}

<!-- prettier-ignore-start -->

**fields 参数**

- `label` — `string`

  与完整定义列表关联的非空可见标签。

<!-- prettier-ignore-end -->

容器至少要有一个直接 `field` 子项。直接放在 `fields`
中的普通文字或其他短代码会让构建停止。

## Field 参数 {#field-parameters}

<!-- prettier-ignore-start -->

**field 参数**

- `name` — `string`; 必填

  标识字段的非空字符串。

- `type` — `string`

  非空类型标签，例如 `boolean`、`string[]` 或 `duration`。

- `required` — `boolean`; 默认值: `false`

  为 true 时添加本地化的必填标记。

- `default` — `scalar`

  字符串、布尔值、整数或浮点数；`false`、`0` 与 `""` 都会保留。

<!-- prettier-ignore-end -->

每个 `field` 还必须包含非空正文，并且必须是 `fields`
的直接子项。参数名称与类型在构建时校验，未知参数会被视为错误。

## 语义与回退 {#semantics-and-fallback}

HTML 使用 `dl`、`dt` 与
`dd`。空间足够时，元数据按列展示；移动端会自然堆叠。可选标签会为辅助技术命名整个定义列表。Markdown 输出为带缩进的项目列表，名称、类型与默认值使用代码格式；打印与 RSS 保留所有定义。组件不会加载 JavaScript。

## 有意保留的边界 {#deliberate-limits}

第一版不实现 `kind`、`deprecated`、`since`、`location`
或字段级链接，也不会在 Hugo 内解析 TypeScript 或 API
schema。将来可以由外部生成器输出这些短代码，把编译器与 schema 运行时留在主题之外，同时保持当前输出契约。
