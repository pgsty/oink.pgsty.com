# 内容组件

> 使用 Oink 提供的本地可复用组件丰富文档。

---

LLMS index: [llms.txt](/llms.txt)

---

OINK 把已经在多个 PGSTY 站点证明具有复用价值的内容组件纳入主题。每个组件都有稳定的作者接口、唯一实例 ID、本地资源和明确的安全边界。站点专用的数据控件仍然留在主题之外。

## 加载模型 {#loading-model}

交互式短代码会标记页面实际使用的功能。OINK 随后为每个所需样式或运行时只加入一次，即使页面中存在多个组件实例也不例外。普通页面不会下载从未使用的组件代码。

相对资源与链接参数会经过 Hugo URL 处理，因此部署到 `baseURL`
子路径时仍然正确。在适用情况下，组件标记还覆盖打印、深色模式、移动端、键盘操作与减少动态效果偏好。

## 日常内容原语 {#everyday-content-primitives}

日常内容原语用于表达工程文档中反复出现的小型结构。下面每份指南都会说明适用场景，并把实际渲染结果、作者源码和第一版的完整接口放在一起。

### 选择合适的原语 {#choose-a-primitive}

| 文档需求                   | 参考页面                   | JavaScript                   |
| -------------------------- | -------------------------- | ---------------------------- |
| 发布状态、生命周期或短状态 | [Badge](badge/)            | 无                           |
| 快捷键或按键序列           | [Kbd](kbd/)                | 无                           |
| 配置、参数或响应字段       | [Fields 与 Field](fields/) | 无                           |
| 仓库或目录结构             | [FileTree](filetree/)      | 无；目录使用原生 `details`   |
| 查看截图或架构图细节       | [Image Zoom](image-zoom/)  | 可选，按需加载               |
| 对比多张相关图片           | [Gallery](gallery/)        | 复用可选的 Image Zoom 运行时 |

### 统一作者契约 {#shared-authoring-contract}

除 Kbd 外，这些原语都使用命名参数与标准 `{{< ... >}}`
短代码写法。参数名区分大小写。未知参数、带引号的布尔值或整数、空的必填字符串、非法枚举值，以及错误的父子关系都会让构建停止，并报告源文件位置。

公共接口不接受任意
`class`、`style`、颜色或事件处理器。可见标签由作者提供或来自 Oink 翻译。静态原语不添加 JavaScript；交互式原语会标记当前页面，使所需运行时只加载一次。

### 校验与回退 {#validation-and-fallbacks}

输出契约保证没有浏览器运行时也能获得相同信息：

| 原语     | HTML                   | Markdown           | 打印与 RSS      | JavaScript            |
| -------- | ---------------------- | ------------------ | --------------- | --------------------- |
| Badge    | 语义化状态 span 或链接 | 强调文本或链接     | 静态行内内容    | 无                    |
| Kbd      | 嵌套 `kbd` 序列        | `Ctrl + K`         | 纯文本按键表示  | 无                    |
| Fields   | 响应式定义列表         | 元数据项目列表     | 完整字段定义    | 无                    |
| FileTree | 嵌套列表与原生折叠元素 | 嵌套列表           | 完全展开的树    | 无                    |
| 共享图片 | figure、图片与说明文字 | 普通图片与说明文字 | 静态 figure     | 启用时复用 Image Zoom |
| Gallery  | 响应式 figure 网格     | 图片与说明文字     | 连续静态 figure | 启用时复用 Image Zoom |

缺少必填参数或参数值非法时，Hugo 会让构建失败，而不是悄悄改变语义。历史位置参数形式的
`imgproc` 继续兼容，但新内容应使用具备无障碍要求的命名形式。

### 有意保留的边界 {#deliberate-limits}

第一版不提供公共 Icon 短代码，也不为 Badge 增加 `icon`
参数。Oink 的私有界面 SVG 注册表继续与作者可用的内容图标分离。自动解析 TypeScript、API
Playground、读取本地目录、下载远程图片，以及复杂的拖拽或滚轮缩放，也都留在仅依赖 Hugo 的主题边界之外。

## Asciinema {#asciinema}

使用 `asciinema` 播放保存在本地的 `.cast` 终端录像：

```go-html-template
{{< asciinema file="images/install.cast" speed="1.5" >}}
```

<div id="td-asciinema-edf082c1ea965cbb56f3428da4246fe2-0" class="td-asciinema td-max-width-on-larger-screens" data-td-asciinema
  data-timer-label="播放时间">
  <div class="td-asciinema__chrome">
    <span class="td-asciinema__lights" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="td-asciinema__title" dir="auto">images/install.cast</span>
  </div>
  <div data-td-asciinema-player></div>
  <script type="application/json" data-td-asciinema-config>{"options":{"autoPlay":false,"fit":"width","loop":false,"preload":false,"speed":1.5,"startAt":0},"src":"/images/install.cast","theme":"auto"}</script>
</div>


`file` 是必填参数，也可以作为第一个位置参数传入。终端窗口优先显示显式传入的
`title`，没有 `title` 时显示 `file` 的值。支持的选项包括 `title`、`theme`、
`fit`（`width`、`height`、`both` 或 `none`）、`autoplay`、`loop`、`preload`、
`speed`、`startAt`、`poster`、`cols`、`rows`、`idleTimeLimit`、
`pauseOnMarkers`，以及逗号分隔的 `markers`。

为了离线使用，请把 cast 文件保存在本地。只有作者显式提供远程 URL 时，组件才会访问远端。

## 高级可视化 {#advanced-visualizations}

ECharts 与 Infographic 仍然是 Oink 内容组件，但现在分别在“高级特性”中拥有独立章节。本页只保留精简的可复用组件总览，并链接到更丰富的示例。

### Apache ECharts {#echarts}

需要使用结构化 JSON 或 YAML 创建定量图表时，请阅读
[Apache ECharts](/zh/docs/advanced/echarts/)。
[图表示例集](/zh/docs/advanced/echarts/gallery/)提供多种实际渲染模式；
[回调与可信代码](/zh/docs/advanced/echarts/callbacks/)则说明显式的可执行代码边界。

### AntV Infographic {#infographic}

需要创建声明式流程、时间线、循环、网格或漏斗时，请阅读
[使用 AntV 创建信息图](/zh/docs/advanced/infographic/)。独立页面会解释模板语义、主题、本地优先约束与无障碍文字后备。

## 卡片与轮播 {#cards-and-carousel}

`doc-card` 与 `nav-card` 共用同一套卡片实现；`doc-cards` 与 `nav-cards`
可以创建一至四列的响应式卡片组。这些别名让现有站点内容继续使用语义最贴切的名称，同时避免复制标记与样式。

```go-html-template
{{< nav-cards cols="3" >}}
  {{< nav-card
    title="架构"
    link="/zh/docs/about/architecture/"
    icon="fa-solid fa-diagram-project"
    desc="了解构建与运行时边界。"
  >}}
  {{< nav-card
    title="部署"
    link="/zh/docs/deploy/"
    badge="仅依赖 Hugo"
  >}}发布静态输出。{{< /nav-card >}}
{{< /nav-cards >}}
```

<!-- prettier-ignore-start -->

<div id="td-nav-cards-edf082c1ea965cbb56f3428da4246fe2-1" class="td-content-cards" style="--td-card-columns: 3">
<article id="td-nav-card-edf082c1ea965cbb56f3428da4246fe2-nav-cards-1-0" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><i class="fa-solid fa-diagram-project td-content-card__icon" aria-hidden="true"></i><a class="td-content-card__title" href="/zh/docs/about/architecture/">架构</a></div><p class="td-content-card__description">了解构建与运行时边界。</p>
  </div>
</article>

<article id="td-nav-card-edf082c1ea965cbb56f3428da4246fe2-nav-cards-1-1" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><a class="td-content-card__title" href="/zh/docs/deploy/">部署</a><span class="td-content-card__badge">仅依赖 Hugo</span></div>
    <div class="td-content-card__links">发布静态输出。</div>
  </div>
</article>

</div>


<!-- prettier-ignore-end -->

卡片接受 `title`、`link`、`image`、`alt`、`icon`、`desc`、`accent` 与
`badge`。卡片正文可以包含 Markdown 链接。`desc` 中的 `{version}`
之类 token，在站点参数存在同名值时会被替换。

把文档卡片放进 `doc-carousel`，即可生成无障碍横向轮播：

```go-html-template
{{< doc-carousel label="OINK 工作流" >}}
  {{< doc-card title="编写" >}}创建成对内容。{{< /doc-card >}}
  {{< doc-card title="构建" >}}运行 Hugo Extended。{{< /doc-card >}}
  {{< doc-card title="验证" >}}检查静态站点。{{< /doc-card >}}
{{< /doc-carousel >}}
```

<!-- prettier-ignore-start -->

<section id="td-carousel-edf082c1ea965cbb56f3428da4246fe2-2" class="td-doc-carousel" data-td-carousel role="region"
  aria-roledescription="carousel" aria-label="OINK 工作流">
  <button class="td-doc-carousel__button" type="button" data-td-carousel-action="previous"
    aria-controls="td-carousel-edf082c1ea965cbb56f3428da4246fe2-2-track" aria-label="上一张卡片">‹</button>
  <div id="td-carousel-edf082c1ea965cbb56f3428da4246fe2-2-track" class="td-doc-carousel__track" data-td-carousel-track tabindex="0">
<article id="td-doc-card-edf082c1ea965cbb56f3428da4246fe2-doc-carousel-2-0" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><strong class="td-content-card__title">编写</strong></div>
    <div class="td-content-card__links">创建成对内容。</div>
  </div>
</article>

<article id="td-doc-card-edf082c1ea965cbb56f3428da4246fe2-doc-carousel-2-1" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><strong class="td-content-card__title">构建</strong></div>
    <div class="td-content-card__links">运行 Hugo Extended。</div>
  </div>
</article>

<article id="td-doc-card-edf082c1ea965cbb56f3428da4246fe2-doc-carousel-2-2" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><strong class="td-content-card__title">验证</strong></div>
    <div class="td-content-card__links">检查静态站点。</div>
  </div>
</article>

</div>
  <button class="td-doc-carousel__button" type="button" data-td-carousel-action="next"
    aria-controls="td-carousel-edf082c1ea965cbb56f3428da4246fe2-2-track" aria-label="下一张卡片">›</button>
</section>


<!-- prettier-ignore-end -->

`label`
提供轮播的无障碍名称。方向键与可见的上一个/下一个按钮都能移动轨道；启用减少动态效果偏好时，不必要的动画会被禁用。

## 折叠块 {#details}

`details` 输出原生 `details` 与 `summary` 元素：

```go-html-template
{{% details title="为什么只依赖 Hugo？" closed="false" %}}
已经提交的浏览器资源让消费端构建保持可复现。
{{% /details %}}
```

<!-- prettier-ignore-start -->

<details id="td-details-edf082c1ea965cbb56f3428da4246fe2-3" class="td-details" open>
  <summary>为什么只依赖 Hugo？</summary>
  <div class="td-details__body">
已经提交的浏览器资源让消费端构建保持可复现。
</div>
</details>


<!-- prettier-ignore-end -->

`title` 设置摘要。折叠块默认关闭；设置 `closed=false` 可让它初始展开。

## 标签页 {#tabs}

OINK 沿用 Docsy 的 `tabpane` 与 `tab` 创作模型，同时保留导入站点依赖的
`selected=true` 与空白处理行为：

```go-html-template
{{< tabpane text=true >}}
  {{< tab header="本地" selected=true >}}
  使用完整本地主题构建。
  {{< /tab >}}
  {{< tab header="Cloudflare" >}}
  从源分支运行同一条 Hugo 命令。
  {{< /tab >}}
{{< /tabpane >}}
```

<!-- prettier-ignore-start -->

**本地**

使用完整本地主题构建。

**Cloudflare**

从源分支运行同一条 Hugo 命令。

<!-- prettier-ignore-end -->

Markdown 内容应设置
`text=true`；否则标签页会按代码进行语法高亮。标签页还支持按语言保存选择、禁用标签，以及右对齐条目。生成的标签与面板 ID 会形成正确的 ARIA 对应关系。

## 参数 {#parameters}

`param` 输出页面参数；页面没有该参数时，会回退到同名站点参数：

```go-html-template
当前版本：{{< param version >}}
```

当前版本：`v0.2.0`

指定参数不存在时，短代码会让构建失败。这是有意设计：缺少发布版本或仓库信息时，不应悄悄生成误导性文档。

## 现有富内容能力 {#existing-rich-content}

OINK 也为继承而来的内容功能提供本地运行时：

- `mermaid`、`math` 与 `markmap` 围栏代码块；
- `swaggerui` 与 `redoc` API 文档短代码；
- Docsy blocks、alert、image、include、readfile、cards 等既有短代码。

完整创作参考详见[短代码](/zh/docs/content/shortcodes/)与[图表和公式](/zh/docs/content/diagrams-and-formulae/)。

## 创作规则 {#authoring-rules}

- 优先使用结构化数据，而不是可执行内容。
- 为图片编写有意义的 `alt` 文本，并为轮播设置清晰的 `label`。
- 除非内容确实需要，否则不要启用自动播放。
- 创建新包装组件时，要在同一页测试多个完全相同的实例。
- 检查键盘导航、焦点可见性、深浅色主题、移动布局、打印输出与减少动态效果行为。
- 把带有业务语义的数据组件留在消费站点。

---

Section pages:

- [Badge](/zh/docs/content/components/badge/): 使用紧凑的语义状态标签，无需自定义颜色或 JavaScript。
- [Kbd](/zh/docs/content/components/kbd/): 使用具备无障碍语义的静态按键序列编写快捷键。
- [Fields 与 Field](/zh/docs/content/components/fields/): 使用响应式语义 HTML 描述配置、参数、属性与响应字段。
- [FileTree](/zh/docs/content/components/filetree/): 使用语义化渐进展开列表展示仓库与目录结构。
- [Image Zoom](/zh/docs/content/components/image-zoom/): 使用可选的原生对话框查看有意义的独立图片细节。
- [Gallery](/zh/docs/content/components/gallery/): 使用响应式静态网格组织相关图片，并可复用 Image Zoom。
