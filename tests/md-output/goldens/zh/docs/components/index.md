# 组件总览

> 按要写的内容挑选合适的组件，查它的最短写法、书写形态，以及是否加载脚本。

---

LLMS 索引： [llms.txt](/zh/llms.txt)

---

文档页面光有段落是不够的：一条读者绝不能跳过的警告、三个平台各自的安装命令、一张架构图、一张统计图、一段终端录像，这些都靠组件来写。多数组件就是普通 Markdown 加一行属性，源码在 GitHub 上照样清晰可读，Hugo 构建站点时再由主题渲染成完整的样子。先在下表里挑一个；每个组件页都以最短的源码和渲染结果开头，接着是各种变化，最后是全部参数。[组件呈现](/zh/docs/components/presentation/)把最常用的几种放在各个视觉预设下并排对照。

## 速查表 {#cheatsheet}

「形态」列说明怎么写：**原生** 是 Markdown 语法加属性行，**围栏** 是带语言标记的代码围栏，**shortcode** 是 `{{< … >}}`。「运行时」列说明读者的浏览器是否要为它下载脚本：**无**；**按页加载**，只有用到它的页面才加载；**需站点开关**，在 `hugo.yml` 里启用之前不加载，启用后同样按页加载。

### 基础写作 {#writing}

| 组件 | 用途 | 最短写法 | 形态 | 运行时 |
| --- | --- | --- | --- | --- |
| [提示块](/zh/docs/components/callout/) | 读者绝不能漏看的前提、警告或补充说明 | `> [!NOTE]` | 原生 | 无 |
| [代码块](/zh/docs/components/code/) | 命令与源码，带文件名、精确复制、折叠与行链接 | ```` ```sh ```` | 围栏 | 按页加载 |
| [表格](/zh/docs/components/table/) | 对比表与矩阵，可满宽、加标题或编号 | `{.full-width}` | 原生 | 标签页或 `.expand` 时加载 |
| [参数表](/zh/docs/components/fields/) | 参数清单，带类型、必填、默认值标签 | `{.fields meta="type default"}` | 原生 + shortcode | 无 |
| [徽章](/zh/docs/components/badge/) | 名字旁边一两个词的状态，例如 Beta | `{{< badge text="Beta" >}}` | shortcode | 无 |
| [按键](/zh/docs/components/kbd/) | 键名与快捷键 | `{{< kbd "Ctrl" "K" >}}` | shortcode | 无 |
{.wide}

### 结构与流程 {#structure}

| 组件 | 用途 | 最短写法 | 形态 | 运行时 |
| --- | --- | --- | --- | --- |
| [标签页](/zh/docs/components/tabs/) | 同一套操作在不同平台或语言下的写法 | 属性行 `{tab="Linux"}` | 原生 + shortcode | 按页加载 |
| [步骤](/zh/docs/components/steps/) | 读者要按顺序完成的操作流程 | `{.steps}` | 原生 + shortcode | 无 |
| [时间轴](/zh/docs/components/timeline/) | 轴线上按日期或先后排列的事件 | 定义列表加 `{.timeline}` | 原生 | 无 |
| [更新](/zh/docs/components/update/) | 仍然作为目录标题出现的更新日志条目 | `## v1.6 {.update date="2026-11-23"}` | 原生 | 无 |
| [卡片](/zh/docs/components/cards/) | 几个并列去处，供读者挑一个 | `{.cards}` | 原生 + shortcode | 无 |
| [引用](/zh/docs/components/include/) | 复用文件、插入站点参数、留下不进输出的注释 | `{{< include file="parts/x.md" >}}` | shortcode | 无 |
{.wide}

### 图表与公式 {#diagrams}

| 组件 | 用途 | 最短写法 | 形态 | 运行时 |
| --- | --- | --- | --- | --- |
| [Mermaid](/zh/docs/components/mermaid/) | 用文本画流程图、时序图与甘特图 | ```` ```mermaid ```` | 围栏 | 按页加载 |
| [PlantUML](/zh/docs/components/plantuml/) | UML 图，在浏览器内或由自建服务渲染 | ```` ```plantuml ```` | 围栏 | 需站点开关 |
| [Draw.io](/zh/docs/components/drawio/) | 读者可以在 Draw.io 编辑器里打开修改的图；需配置编辑器地址 | `![说明](arch.drawio.svg)` | 原生 | 需站点开关 |
| [ECharts](/zh/docs/components/echarts/) | 用数据声明的柱状图、折线图与饼图 | ```` ```echarts ```` | 围栏 | 按页加载 |
| [Infographic](/zh/docs/components/infographic/) | 表达顺序、层级或对比的 AntV 信息图 | ```` ```infographic ```` | 围栏 | 按页加载 |
| [地图](/zh/docs/components/map/) | 地点列表，启用后上方附带交互地图 | ```` ```map ```` | 围栏 | 需站点开关 |
| [思维导图](/zh/docs/components/markmap/) | 把 Markdown 大纲画成思维导图 | ```` ```markmap ```` | 围栏 | 需站点开关 |
| [文件树](/zh/docs/components/filetree/) | 目录结构，每一项旁边对齐一列注释 | ```` ```filetree ```` | 围栏 | 按页加载 |
| [公式](/zh/docs/components/math/) | 行内与块级公式，构建期由 KaTeX 渲染 | `$$ … $$` | 原生 | 无 |
{.wide}

### 媒体与嵌入 {#media}

| 组件 | 用途 | 最短写法 | 形态 | 运行时 |
| --- | --- | --- | --- | --- |
| [图片](/zh/docs/components/image/) | 截图与插图，带图注、尺寸、缩放与编号 | `![说明](oink.webp)` | 原生 | 需站点开关 |
| [画廊](/zh/docs/components/gallery/) | 一组图片，在同一个缩放对话框里翻看 | ```` ```gallery ```` | 围栏 | 需站点开关 |
| [视频](/zh/docs/components/video/) | 视频文件、循环演示、YouTube 与 Bilibili 卡片 | `![名称](demo.mp4)` | 原生 | 按页加载；播放器需站点开关 |
| [音频](/zh/docs/components/audio/) | 播客单集与语音样例，带标题的原生播放器 | `![名称](episode.mp3)` | 原生 | 按页加载 |
| [Asciinema](/zh/docs/components/asciinema/) | 回放终端会话，文字仍可选中 | `{{< asciinema file="images/x.cast" >}}` | shortcode | 按页加载 |
| [帖子](/zh/docs/components/social/) | 在页面中引用帖子，无需向社交平台取回原帖 | `{{< social author="…" >}}` | shortcode | 无 |
{.wide}

「运行时」列里有几项取决于页面上的内容：

- 代码块只在页面上有带复制或折叠按钮的块时加载 `code-block.js`。文件树只在带注释列时加载 `filetree.js`，读者可以拖动调整注释列宽度。
- 图片与画廊共用一个缩放对话框，需要 `params.ui.image_zoom: true`，且页面上至少有一张可缩放的图片。
- 公式在构建期已经渲染成 HTML 与 MathML，所以页面只加载 KaTeX 样式表与字体，不加载脚本。
- Draw.io 只在含 PNG 或 SVG 图片的页面加载，每个不同的图片地址只下载一次，用来查找可编辑副本。
- 视频与音频共用 `media.js`：页面上有本地音频或视频播放器（显示进度、同页互斥播放），或有平台列在 `params.video_embeds` 中的卡片时加载。地图只在 `params.map` 启用（`enable: true` 且 `tiles`、`attribution` 有效）时加载 Leaflet，否则就是一份地点列表。

打印、Markdown 与 RSS 输出里，任何组件都不加载脚本。这几种输出的形态与预期不同时，各组件页会单独说明。

## 两种形态 {#two-forms}

优先用原生形态：块引用、列表、表格、图片或围栏，后面跟一行 `{…}` 属性。它在 GitHub 和任何 Markdown 编辑器里都可读，页面的 Markdown 输出保留的也是你的源码，而不是渲染后的 HTML。

Markdown 表达不了的场景用 shortcode，例如装着正文段落的标签页、描述里带代码块的参数表、带图标与徽章的卡片、终端录像。所有 shortcode 遵循同样的规则：

- 一律写成 `{{< 名字 >}}`。只有 `{{% steps %}}` 用 `%`，因为它的正文是带标题的页面级 Markdown。
- 子 shortcode（`tab`、`card`、`field`）只能写在各自的父 shortcode 里。
- 标题、标签、图注这类参数是纯文本，不解析 Markdown。只有正文是 Markdown：`tab`、`card`、`field` 的正文，`include` 引入的文件，以及 Book 的 `fig`、`tbl`、`eg` 正文。
- 参数写错不会让构建失败。Hugo 会给出带文件与行号的警告，组件按其页面写明的方式回退，或者略去不安全的部分，所以发布前要看一遍警告。见[取值写错时](/zh/docs/customize/config/#principles)。

## 站点前置配置 {#prerequisites}

组件依赖三项 Goldmark 设置。Hugo 不会从主题读取 `markup` 配置，所以它们必须写在站点自己的配置里。OINK Starter 已经配好；自己搭建的站点加上这一段：

```yaml {title="hugo.yml"}
markup:
  goldmark:
    renderer:
      unsafe: true # 内容里的 HTML 不被剥掉
    parser:
      attribute:
        block: true # 启用 {…} 属性行
      wrapStandAloneImageWithinParagraph: false # 独立图片不再包进 <p>
```

- `renderer.unsafe: true` 让渲染结果保留原始 HTML。缺了它，Goldmark 会丢掉这些 HTML，组件正文里的标记随之消失。
- `parser.attribute.block: true` 是属性行的开关。缺了它，`{.steps}`、`{caption="…"}` 会原样显示成一行文字。
- `parser.wrapStandAloneImageWithinParagraph: false` 让独立成段的图片不再被包进 `<p>`，图片才能带着属性行成为有图注的 figure。

少数组件还有额外要求。用 `$$`、`\[…\]` 或 `\(…\)` 写公式需要 Goldmark 的 passthrough 扩展。PlantUML、思维导图、Draw.io、图片缩放对话框、页内视频播放器与地图各有一个站点开关，Draw.io 还需要编辑器地址。各组件页写明了自己的设置，完整的 `markup` 配置块见[配置总览](/zh/docs/customize/config/#goldmark)。

---

本节页面：

- [提示块](/zh/docs/components/callout/): 用 `> [!NOTE]` 这样的块引用写出带颜色、图标与标题的提示、警告与折叠块，不需要短代码。
- [代码块](/zh/docs/components/code/): 用普通 Markdown 围栏展示命令、配置与源码，带文件名标题、精确复制、行号、高亮、换行、折叠与可链接的行。
- [表格](/zh/docs/components/table/): 给普通 Markdown 表格加一行属性，做成带标题的表、兼容矩阵、参数表、编号表或标签页，并让宽幅技术表格有足够的阅读空间。
- [参数表](/zh/docs/components/fields/): 把配置项、命令参数与 API 字段写成参数表：手机上也不挤，每一条都能单独链接。
- [徽章](/zh/docs/components/badge/): 用五种语义 tone 之一，给功能名、版本号或表格单元格标上 Beta、已弃用这类简短状态。
- [按键](/zh/docs/components/kbd/): 用 `kbd` 写快捷键：一个 shortcode 接一串按键名，输出语义化的按键序列，打印与 Markdown 输出里同样可读。
- [标签页](/zh/docs/components/tabs/): 把包管理器、配置格式这类可互相替代的写法并排放在一组标签页里，读者选一次，全站同组的标签页都跟着切换。
- [步骤](/zh/docs/components/steps/): 有序列表加 `{.steps}` 就是带编号圆点与竖线的操作步骤；步骤要带标题、要进目录时改用 steps shortcode。
- [时间轴](/zh/docs/components/timeline/): 把 Markdown 定义列表变成一条竖直的时间轴，按日期或先后排列事件，适合里程碑、故障复盘、产品历史与议程。
- [更新](/zh/docs/components/update/): 用带 `{.update}` 标记的普通标题写更新日志、「新功能」页或周报，每个条目下方可以附上日期与标签。
- [卡片](/zh/docs/components/cards/): 把 Markdown 链接列表变成导航卡片网格；卡片需要图标、徽章或图片时改用 shortcode。
- [引用](/zh/docs/components/include/): 让多页共用一份源头：include 引入共享片段与文件，param 打印站点或页面参数，comment 写永不发布的注释。
- [Mermaid](/zh/docs/components/mermaid/): 用 `mermaid` 围栏把文本写成流程图、时序图、甘特图、类图与状态图，本地渲染、跟随深浅色、diff 友好。
- [PlantUML](/zh/docs/components/plantuml/): 使用随主题提供的资源，在浏览器中渲染时序图、类图、组件图、活动图与用例图，无需渲染服务。
- [Draw.io](/zh/docs/components/drawio/): 把 Draw.io 导出的图当普通图片发布，读者可以在 Draw.io 编辑器里打开、修改并下载。
- [ECharts](/zh/docs/components/echarts/): 在 `echarts` 围栏里用 YAML 或 JSON 写 ECharts 选项，画出跟随深浅色的柱状图、折线图与饼图。
- [Infographic](/zh/docs/components/infographic/): 用 `infographic` 围栏和一个 AntV 模板，把标题与几个条目画成流程、时间线、漏斗、网格或层级信息图。
- [地图](/zh/docs/components/map/): 在 `map` 围栏里列出地点，HTML、打印与 RSS 都显示带编号的地点列表。站点指定瓦片服务后，网页上还会多一张交互地图。
- [思维导图](/zh/docs/components/markmap/): 用 `markmap` 围栏把一段 Markdown 大纲变成可展开、可缩放的思维导图，源码本身就是能读的提纲。
- [文件树](/zh/docs/components/filetree/): 用 `filetree` 围栏画一棵带注释的目录树：注释列自动对齐，条目带图标，目录可以折叠。
- [公式](/zh/docs/components/math/): 用 KaTeX 写行内与块级数学公式，构建期渲染完毕，读者不下载任何脚本。
- [图片](/zh/docs/components/image/): 用普通 Markdown 插图，再加一行属性，就能设置图注、尺寸、缩放、链接、编号或 Hugo 图片处理。
- [画廊](/zh/docs/components/gallery/): 用 `gallery` 围栏把一组相关截图排成响应式网格，每张图可以带说明或链接。
- [视频](/zh/docs/components/video/): 在页面里放产品演示、屏幕录制和代替 GIF 的静音循环短片，并为 YouTube、Bilibili、Vimeo 上的视频生成卡片，读者点击之前不联系任何平台。
- [音频](/zh/docs/components/audio/): 用图片语法把播客单集、语音样例或讲座录音放进页面，渲染为带标题的原生播放器，文字稿紧随其后。
- [Asciinema](/zh/docs/components/asciinema/): 在页面里嵌入 .cast 终端录像，读者可以播放、暂停并从中复制文字，播放器随主题分发。
- [帖子](/zh/docs/components/social/): 用 `social` 短代码引用 X、Bluesky、Mastodon 等平台上的帖子。正文和署名都写在页面里，无需平台脚本。
- [组件呈现](/zh/docs/components/presentation/): 在 OINK 四种视觉预设中查看卡片、折叠块、标签页和紧凑流程。

---

反链：

- [OINK 实现预览](/zh/blog/oink-announcement/)
- [组件](/zh/book/04-components/)
- [上线](/zh/book/10-ship/)
- [OINK 文档](/zh/case/oink/)
- [文档](/zh/docs/)
- [简介](/zh/docs/about/)
- [特性](/zh/docs/about/features/)
- [版本升级](/zh/docs/admin/upgrade/)
- [音频](/zh/docs/components/audio/)
- [组件呈现](/zh/docs/components/presentation/)
- [表格](/zh/docs/components/table/)
- [时间轴](/zh/docs/components/timeline/)
- [组件](/zh/docs/design/components/)
- [内容组件扩展](/zh/docs/design/proposals/content-components-expansion/)
- [创作内容](/zh/docs/write/)
- [博客与文章](/zh/docs/write/blog/)
- [编写页面](/zh/docs/write/pages/)
- [OINK v0.2.0](/zh/release/0.2.0/)
- [OINK v0.3.0](/zh/release/0.3.0/)
