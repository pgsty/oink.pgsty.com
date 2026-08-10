---
title: 短代码
description: 安全、无障碍地使用 OINK 的本地优先内容组件。
---

短代码用于表达普通 Markdown 无法承载的行为。OINK 保留 Docsy 核心组件，并新增本地提供的图表、终端录像、信息图、轮播、卡片和折叠组件。浏览器运行时只在实际使用它们的页面加载。

标题、正文、列表、链接、表格和图片应优先使用 Markdown。短代码一旦投入使用，就成为内容 API 的一部分：修改名称或参数可能破坏所有调用它的页面。

## 短代码分隔符 {#shortcode-delimiters}

Hugo 支持两种形式：

- `{{</* name */>}}` 使用标准分隔符，原样传递内部内容；
- `{{%/* name */%}}`
  使用 Markdown 分隔符，在周围内容的上下文中渲染内部 Markdown。

请采用各组件文档指定的形式。嵌套、缩进和空行都会影响结果，在列表和块引用中尤其如此。示例里的
`/* ... */` 转义用于防止 Hugo 执行正在展示的短代码。

## `blocks/*` 短代码 <a id="shortcode-blocks"></a> {#blocks}

块短代码用于组合全宽落地页。`color`
参数使用 OINK/Bootstrap 语义颜色或项目自定义块样式，`height`
参数接受各组件说明的取值。

### `blocks/cover` <a id="blockscover"></a> {#blocks-cover}

使用页面包中匹配 `*background*` 的图片以及可选的 `*logo*` 创建首屏：

```markdown
{{</* blocks/cover title="OINK" subtitle="本地优先文档"
    color="dark" height="max" */>}} [开始使用](/zh/docs/get-started/){ .btn
.btn-lg .btn-primary } {{</* /blocks/cover */>}}
```

`image_anchor` 和 `logo_anchor` 控制图片裁切位置，`byline`
用于标注图片来源。高度可取 `auto`、`min`、`med`、`max` 或
`full`。即使背景无法显示，首屏关键信息也必须保持可读。

### `blocks/lead` <a id="blockslead"></a> {#blocks-lead}

创建醒目的介绍区块：

```markdown
{{%/* blocks/lead color="primary" height="min" */%}} OINK 只用 Hugo
Extended 即可构建完整文档体验。 {{%/* /blocks/lead */%}}
```

高度支持 `auto`、`min`、`med`、`max` 或 `full`。

### `blocks/section` <a id="blockssection"></a> {#blocks-section}

创建通用落地页区块：

```markdown
{{%/* blocks/section color="light" type="row" height="auto" */%}}

### 一个分区

区块内部使用普通 Markdown。 {{%/* /blocks/section */%}}
```

`type` 选择容器形式，`height` 使用块高度取值。标题级别必须与页面大纲保持一致。

### `blocks/feature` <a id="blocksfeature"></a> {#blocks-feature}

创建单个功能单元，通常放在 Section 中：

```markdown
{{%/* blocks/feature icon="fa-solid fa-box-archive"
    title="离线可用" url="/zh/docs/oink/local-first/"
    url_text="阅读设计说明" */%}} 所需浏览器资源均已锁定版本并从本地提供。
{{%/* /blocks/feature */%}}
```

图标只是装饰，含义必须由 `title` 和链接文本表达。

### `blocks/link-down` <a id="blockslinkdown"></a> {#blocks-link-down}

从当前块添加指向下一块的链接。它必须嵌套在块内。生成目标必须长期稳定时，应显式设置
`id`。

### 导航栏下方布局校正 {#td-below-navbar}

直接位于固定导航下方的块使用 `td-below-navbar`/`td-anchor-no-extra-offset`
校正导航栏高度。不要自行添加任意上边距；修改导航栏尺寸后，应验证直接访问片段链接的效果。

## 辅助短代码 <a id="helpers-shortcodes"></a> {#helpers-shortcodes}

### `alert` {#alert}

旧版告警短代码仍可使用：

```markdown
{{%/* alert title="兼容性说明" color="warning" */%}}
新内容优先使用 Markdown 块引用告警。 {{%/* /alert */%}}
```

`color`
映射到 Bootstrap 告警后缀。新内容通常应采用[添加内容](/zh/docs/content/adding-content/#alerts)介绍的 Markdown 告警语法。

#### 告警、缩进与示例 {#alerts-indentation-and-examples}

开始和结束短代码应与外层列表或块引用对齐，块级 Markdown 前后应保留空行。需要原样展示短代码时，应转义分隔符，不要把活动调用包在另一个组件中。

### `pageinfo` {#pageinfo}

在 Markdown 外渲染信息面板：

```markdown
{{%/* pageinfo color="info" */%}} 本页介绍预览接口。 {{%/* /pageinfo */%}}
```

警告信息应使用语义告警；`pageinfo` 适合提供页面上下文。

### `imgproc` {#imgproc}

处理当前页面包中的图片：

```markdown
{{%/* imgproc "architecture" Fit "960x540" */%}} OINK 运行时架构。
{{%/* /imgproc */%}}
```

命令可取 `Fit`、`Resize`、`Fill` 和
`Crop`，第三个参数遵循 Hugo 图片处理语法。内部文字会成为图注；资源存在
`params.byline` 时会附加署名。始终提供有意义的替代文字或相邻说明。

### `swaggerui` {#swaggerui}

嵌入本地纳管的 Swagger UI 运行时：

```markdown
{{</* swaggerui src="/openapi.yaml" */>}}
```

离线或严格 CSP 部署应使用同源规范。远程 `src`
是显式网络依赖，也可能向该主机暴露读者元数据。当前兼容短代码在一页中只应放置一个 Swagger
UI 实例。

### `redoc` {#redoc}

嵌入本地纳管的 Redoc 运行时：

```markdown
{{</* redoc "openapi.yaml" */>}}
```

第一个参数可以是页面相对、站点相对或显式 HTTP 规范；可选第二个参数包含 Redoc 元素选项。规范内容必须经过审查，大型 Schema 还应测试移动端表现。

### `iframe` {#iframe}

嵌入另一个页面：

```markdown
{{</* iframe src="/demo/" name="demo" id="demo-frame"
    sandbox="allow-scripts allow-same-origin" */>}}
```

请设置有描述力的 `name`、唯一的 `id`、后备 `sub` 提示，以及满足需求的最严格
`sandbox`。默认值支持宽度和自动高度，但跨域文档并不总能测量。iframe 是安全与隐私边界，不是通用布局工具。

## OINK 内容组件 {#oink-content-components}

以下组件由 OINK 新增。各运行时都在 `theme/VENDOR.json`
中锁定版本，并按需从同源加载。

### `details` {#details}

创建无障碍折叠内容：

```markdown
{{%/* details title="显示迁移说明" closed="false" */%}} 正文支持 Markdown。
{{%/* /details */%}}
```

`closed` 默认为 true。摘要应简洁，而且不得把强制操作隐藏在默认关闭的折叠区中。

### `asciinema` {#asciinema}

播放 asciinema `.cast` 录像：

```markdown
{{</* asciinema file="casts/install.cast" speed="1.25"
    markers="0:开始,18:验证" fit="width" */>}}
```

窗口标题优先使用 `title`，没有 `title` 时显示 `file`。其他主要参数包括
`theme`、`autoplay`、`loop`、`preload`、`speed`、`startAt`、`poster`、`cols`、
`rows`、`idleTimeLimit`、`pauseOnMarkers`、`markers` 和
`fit`（`width`、`height`、`both` 或 `none`）。本地录像可以来自 Hugo assets
或站点相对 URL。不要自动播放，必须清除终端历史中的机密，并为关键步骤提供相邻文字说明。

### `echarts` {#echarts}

根据 JSON 或 YAML 选项对象渲染 Apache ECharts：

{{< echarts height="820px" >}}

```js
var fnum = function (n) {
  n = Number(n);
  return Number.isFinite(n) ? n.toLocaleString('zh-CN') : '';
};
var labfmt = function (params) {
  if (!params || params.value == null) return '';
  return fnum(params.value);
};
var tipfmt = function (params) {
  if (!params || !params.length) return '';
  return (
    '<b>' +
    params[0].name +
    '</b><br/>' +
    params[0].marker +
    ' Star: ' +
    fnum(params[0].value)
  );
};
var barclr = function (params) {
  if (params.name === 'pgsty/pigsty') {
    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#d94841' },
      { offset: 1, color: '#f97316' },
    ]);
  }
  return '#7aa6c2';
};
```

```yaml
tooltip:
  trigger: axis
  axisPointer: { type: shadow }
  formatter: $fn:tipfmt
grid: { left: 320, right: 72, top: 20, bottom: 26 }
xAxis:
  type: value
  max: 5600
  name: GitHub Star
  nameLocation: middle
  nameGap: 24
  axisLabel: { formatter: $fn:fnum }
  splitLine: { show: true, lineStyle: { type: dashed, opacity: 0.45 } }
yAxis:
  type: category
  inverse: true
  axisLabel:
    align: right
    margin: 8
    width: 300
    overflow: truncate
    fontSize: 11
    fontFamily: monospace
  data:
    - 'pgsty/pigsty'
    - 'polardb/PolarDB-for-PostgreSQL'
    - 'tensorchord/pgvecto.rs'
    - 'tensorchord/VectorChord'
    - 'Tencent/TBase'
    - 'apache/cloudberry'
    - 'IvorySQL/IvorySQL'
    - 'pgplex/pgschema'
    - 'amutu/zhparser'
    - 'opengauss-mirror/openGauss-server'
    - 'HaloTech-Co-Ltd/openHalo'
    - 'jaiminpan/pg_jieba'
    - 'alitrack/duckdb_fdw'
    - 'tensorchord/VectorChord-bm25'
    - 'pgsty/pg_exporter'
    - 'ChenHuajun/pg_roaringbitmap'
    - 'pgsty/pig'
    - 'tensorchord/pg_bestmatch.rs'
    - 'wublabdubdub/PDU-PostgreSQLDataUnloader'
    - 'tensorchord/pg_tokenizer.rs'
    - 'jaiminpan/pg_scws'
    - 'pgsty/pgext'
series:
  - name: Star
    type: bar
    barWidth: 20
    showBackground: true
    backgroundStyle: { color: 'rgba(148, 163, 184, 0.16)' }
    itemStyle:
      color: $fn:barclr
      borderRadius: [0, 5, 5, 0]
    label:
      show: true
      position: right
      formatter: $fn:labfmt
      color: '#334155'
      fontWeight: 600
    data:
      [
        5502,
        3189,
        2181,
        1767,
        1439,
        1251,
        1049,
        994,
        866,
        784,
        438,
        417,
        409,
        375,
        357,
        286,
        197,
        101,
        100,
        45,
        41,
        30,
      ]
```

{{< /echarts >}}

`height` 必须是安全的 CSS 长度；`theme` 选择 ECharts 主题，`full=true`
会取消常规正文宽度限制。

短代码内部可以加入 JavaScript 围栏代码块来定义回调函数，再从 JSON/YAML 选项中通过
`$fn:name`
引用。代码会在访问者的浏览器中执行，因此只能使用受信任作者提交并经过审查的代码。无需回调时应优先使用声明式 JSON/YAML，并为图表添加相邻文字摘要、验证深色模式。

### `infographic` {#infographic}

渲染本地纳管的信息图 DSL：

```markdown
{{</* infographic height="360px" */>}} infographic
list-row-simple-horizontal-arrow data items - label 构建 - label 测试 -
label 发布 {{</* /infographic */>}}
```

`height` 可以是 `auto` 或安全 CSS 长度；`full=true`
会取消宽度限制。DSL 属于数据，并非任意 HTML。可视化不可用时，相邻正文也必须能表达相同结论。

### `doc-cards` 与 `nav-cards` {#doc-cards-and-nav-cards}

两个容器都接受 1 至 4 的 `cols`。子卡片接受
`title`、`link`、`image`、`alt`、`icon`、`desc`、`accent` 与 `badge`：

```markdown
{{</* nav-cards cols="2" */>}}
{{</* nav-card title="开始使用" link="/zh/docs/get-started/"
      icon="fa-solid fa-rocket" desc="使用 Hugo {version} 构建。" */>}} {{</* nav-card title="架构" link="/zh/docs/oink/architecture/"
      badge="设计" */>}}
{{</* /nav-cards */>}}
```

`doc-card`/`doc-cards` 与其共享渲染契约，适合编辑型内容；`nav-card`/`nav-cards`
则明确表示导航。`{version}`
等描述占位符会从站点参数解析。卡片图片采用延迟加载；除非图片纯属装饰，否则必须提供有意义的
`alt`。

### `doc-carousel` {#doc-carousel}

把 `doc-card` 放入支持键盘滚动的轮播：

```markdown
{{</* doc-carousel label="发布亮点" */>}}
{{</* doc-card title="本地资源" */>}}无需 CDN。{{</* /doc-card */>}}
{{</* doc-card title="中英双语" */>}}稳定的中英文路由。{{</* /doc-card */>}}
{{</* /doc-carousel */>}}
```

`label`
为辅助技术命名该区域。上一项/下一项按钮会本地化。信息不能只存在于屏幕外卡片中；禁用脚本后，轨道仍应可用。

### `param` {#param}

输出页面参数；根据 Hugo 的 `Page.Param` 规则，在页面缺省时回退到站点配置：

```markdown
OINK 版本 {{</* param version */>}}。
```

找不到参数会令构建失败。`param`
适合显示标量值，不应用于注入未经审查的 HTML。内部兼容短代码 `_param`
还会为旧内容执行带编号的占位符替换。

## 标签页 {#tabbed-panes}

标签页用于组织 YAML/TOML/JSON 配置等同一信息的等价表示，不应隐藏连续步骤或互不相关的选择。

```markdown
{{</* tabpane text=true persist=lang */>}}
{{</* tab header="YAML" lang="yaml" */>}} params: offlineSearch: true
{{</* /tab */>}} {{</* tab header="TOML" lang="toml" */>}} [params]
offlineSearch = true {{</* /tab */>}} {{</* /tabpane */>}}
```

选择状态保存在浏览器本地。`persist` 接受 `header`、`lang` 或
`disabled`。已弃用的 `persistLang` 不应出现在新内容中。

### 短代码细节 {#shortcode-details}

`text=true` 将内部内容渲染为正文而不是高亮代码；`right=true`
把标签对齐到末端；`langEqualsHeader=true`
根据标题推导语言标识。父级默认值可以由单个标签覆盖。

#### `tabpane` {#tabpane}

父组件会校验布尔值和持久化参数、生成唯一 ID，并确保存在选中项。只有禁用的标题标签确实能提供有用分组信息时才使用它。

#### `tab` {#tab}

`tab` 必须放在 `tabpane` 内部。它接受
`header`、`selected`、`lang`、`highlight`、`text`、`right` 和
`disabled`。只能选中一个标签。面向读者的标题需要翻译，语言标识则必须稳定。

## 卡片面板 {#card-panes}

旧版 `cardpane`/`card`
组合用于布局 Bootstrap 风格卡片。新的导航表面应优先使用 OINK 内容卡片，既有 Docsy 内容可以继续使用兼容组件。

### `card` 短代码：文本内容 {#shortcode-card-textual-content}

```markdown
{{%/* cardpane */%}}
{{%/* card header="说明" title="本地构建" footer="已验证" */%}} Markdown
**正文**。 {{%/* /card */%}} {{%/* /cardpane */%}}
```

`header`、`title`、`subtitle` 和 `footer`
接受渲染文本。并列卡片应保持简洁，不能用卡片取代标题结构。

### `card` 短代码：程序代码 {#shortcode-card-programming-code}

设置 `code=true`，并按需设置 `lang`/`highlight`：

```markdown
{{</* cardpane */>}} {{</* card code=true header="Go" lang="go" */>}}
fmt.Println("OINK") {{</* /card */>}} {{</* /cardpane */>}}
```

### 卡片组 {#card-groups}

`cardpane`
中相邻的卡片会形成响应式分组。应测试文字长度不一、移动端堆叠、代码溢出以及两种语言版本。

## 引入外部文件 {#include-external-files}

`readfile`
短代码在构建期读取仓库文件，并将其渲染为 Markdown 或高亮代码。除非路径以 `/`
开头，否则路径相对于当前内容文件。

### 复用文档 {#reuse-documentation}

```markdown
{{%/* readfile "includes/installation.md" */%}}
```

被引入的 Markdown 不是独立发布页面，因此不参加页面配对审计。如果共享正文面向读者，应有意识地创建并选择语言专属的 include 文件；Hugo 不会自动翻译 include。

## 安装 {#installation}

可复用片段应放在调用方附近的 `includes/`
目录中。需要明确其所有权，并避免多层嵌套：读者和审阅者应能迅速找到源文件。

### 引入代码文件 {#include-code-files}

```markdown
{{</* readfile file="includes/config.yaml" code="true" lang="yaml" */>}}
```

`code=true` 会用 `lang` 高亮文件。绝不能引入机密、生成的凭据或不可信路径。

### 错误报告 {#error-reporting}

找不到文件时构建会失败。`draft=true`
会把失败改为可见的草稿警告，只适合创作阶段，绝不能进入正式发布构建。

## 条件文本 {#conditional-text}

`conditional-text` 根据 `params.buildCondition` 选择内容：

```markdown
{{%/* conditional-text include-if="enterprise,preview" */%}}
这段文字只出现在匹配的构建中。 {{%/* /conditional-text */%}}
```

`include-if` 与 `exclude-if`
接受条件列表，同一条件不能同时出现在二者中。该功能适用于确实不同的发布变体，不应用来选择语言；多语言内容必须写入翻译后的页面文件。
