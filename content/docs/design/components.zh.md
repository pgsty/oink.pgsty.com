---
title: 组件契约
linkTitle: 组件
description: OINK 创作原语、校验、Book、发布行为与输出降级的维护者契约。
weight: 20
icon: fa-solid fa-cubes-stacked
search_keywords: [OINK 组件契约, shortcode API, Markdown 组件, Book, 发布, 校验]
contract_status: v1.6.0
---

> [!NOTE] OINK 1.6.0 契约
> 本契约描述 OINK v1.6.0。

教程与完整示例位于面向读者的[组件](/zh/docs/components/)专栏。本页定义这些
指南所依赖的 API 与行为。

## 创作模型 {#authoring-model}

一个区块加属性便能表达组件时，使用普通 Markdown；需要复合正文或 Markdown
无法携带的事实时，使用 shortcode。OINK 没有并行的组件注册表。原生形态要求：

```yaml
markup:
  goldmark:
    renderer: { unsafe: true }
    parser:
      wrapStandAloneImageWithinParagraph: false
      attribute: { block: true }
```

原生时间轴还需要 Goldmark 定义列表（`markup.goldmark.extensions.definitionList`），Hugo 默认启用。

只有 `{{%/* steps */%}}` 使用百分号分隔符，因为它的正文属于页面大纲；其它
shortcode 一律使用尖括号分隔符。复合正文通过 `content/render-block.html`
处理，并使用唯一的 ID 作用域。Shortcode 与组件参数中的 caption、label、title
和 name 是纯文本，Markdown 应放在正文里。落地页叙述字段遵循自己的契约。图标
由一对 Font Awesome class 表示。组件暴露安全的 class 与属性，不接受任意颜色
或内联样式。

## 公共 API {#public-api}

OINK 有 30 个 shortcode：

- 核心：`tabs`、`tab`、`steps`、`cards`、`card`、`fields`、`field`、`include`、
  `kbd`、`badge`、`param`、`comment`、`contributors`、`asciinema`、`social`；
- Book：`fig`、`tbl`、`eq`、`eg`、`xref`、`book-toc`、`book-figures`、
  `book-tables`、`book-equations`、`book-examples`；
- 发布：`release-card`、`release-assets`、`download`；
- OpenAPI：`swagger`、`redoc`。

| 组件 | 原生形态 | Shortcode 形态 | HTML 运行时 |
| --- | --- | --- | --- |
| 提示块 | `> [!TYPE]`、折叠、`{icon=}` | 无 | 无 |
| 标签页 | 相邻围栏或表格加 `{tab= group= value=}` | `tabs` / `tab` | 只在使用页加载 tabs |
| 步骤 | 有序列表加 `{.steps}` | `steps` | 无 |
| 卡片 | 链接列表加 `{.cards}` | `cards` / `card` | 无 |
| 参数表 | 表格加 `{.fields}` | `fields` / `field` | 无 |
| FileTree | `filetree` 数据围栏 | 无 | 只有注释存在时加载分隔条运行时 |
| 画廊 | `gallery` 数据围栏 | 无 | 符合条件时共享图片缩放 |
| 图片 | Markdown 图片加块属性 | 无 | 符合条件时加载图片缩放 |
| 表格 | 属性、caption、编号或标签页 | 复合 Book 表格使用 `tbl` | 标签页表格加载 tabs；`.expand` 启用阅读器 |
| Book 目标 | 图片、表格、passthrough、围栏加 `{num=}` | `fig`、`tbl`、`eq`、`eg` | 无 |
| 发布资产 | `checksums` 数据围栏 | `release-assets` | HTML 中加载复制功能 |
| 数学与化学公式 | passthrough、`math`、`chem` 围栏 | `eq` | 无；构建期渲染并加载本地样式 |
| 图表与数据 | `mermaid`、`plantuml`、`markmap`、`echarts`、`infographic` 围栏 | 无 | 只加载选中的本地运行时 |
| 时间轴 | 定义列表加 `{.timeline}` | 无 | 无 |
| 更新 | 标题加 `{.update date= tags=}` | 无 | 无 |
| 视频 | 指向视频文件或平台 URL 的块级图片加 `{caption= poster= track= autoplay=}` | 无 | 自动播放、已启用播放器或同页 2 个及以上播放器时加载 `media` |
| 音频 | 指向音频文件的块级图片加 `{caption= id= preload=}` | 无 | 同页 2 个及以上播放器时加载 `media` |
| 社交帖子 | 无 | `social` | 无 |
| 地图 | `map` 数据围栏 | 无 | 仅在 `params.map` 完整时加载 Leaflet |

> [!NOTE] OINK 1.4.0 的统一图表阅读
> Mermaid 与本地 PlantUML 共用查看器，支持平移、缩放、适应窗口、源码查看与
> 复制、独立 SVG 下载。只有距离视口不超过 320px 且尺寸可用的图表才加载引擎
> 并渲染。引擎各加载一次，在主线程串行执行；隐藏内容恢复后再处理，主题变化
> 丢弃过期结果。查看器复用渲染结果，保留阅读位置，并支持触控、键盘、焦点恢复
> 与减少动态效果偏好。PlantUML 保持 Blob 图片隔离，SVG 标记不进入页面 DOM。
> 源码只经过一次 HTML 转义；箭头、引号、和号及中文保持准确。错误保留源码，
> 不阻塞后续图表。复制或导出失败有明确提示；下载仅报告请求已发起。
> 导出内含样式，不允许外部资源依赖。普通浏览器打印保留浅色 Mermaid 与 PlantUML
> 图形；暗色 Mermaid 和未完成渲染的图表使用黑字白底、可换行的源码，无须在打印
> 时异步重绘。打印后恢复源码折叠状态，保留已有图形与阅读偏好。
> 独立 Print、Markdown、RSS 保留源码回退。详见 [Mermaid](/zh/docs/components/mermaid/#zoom)
> 与 [PlantUML](/zh/docs/components/plantuml/)。显式服务端模式保持既有行为。

> [!NOTE] OINK 1.6.0 中的组件运行时
> Markmap 1 使用 SVG 文本与本地 MathJax，段落、代码和表格作为节点注释；旧配置键
> 会告警，不会被静默接受。独立 Print 保留源码，普通浏览器打印保留已有 SVG 并使用
> 黑色文字。ReDoc 3 使用隔离的本地文档且关闭遥测；Mermaid 12 保留原有主题、布局
> 与外观默认值。参见[依赖契约](/zh/docs/design/architecture/#unreleased-dependencies)。
> 文字与背景 token 改为 `--mm-text` 和 `--mm-bg`。SVG 链接具备无障碍名称，
> 注释支持键盘打开，Escape 关闭后恢复焦点。
> 已打开的注释随外观变化更新，浏览器打印时隐藏。注释 chunk 加载失败时恢复
> 对应导图的完整源码与焦点，不影响其他导图。
> 注释链接使用正文链接颜色，并带有下划线。
> 打印结束后恢复注释焦点；若浮层已关闭，则恢复到对应标记。
> Asciinema 在播放器挂载前保留录像链接，禁用 JavaScript 或播放器资源不可用时
> 也能访问原始录像。录像获取或解析失败时恢复链接，并转移播放器原有的焦点。

> [!NOTE] 尚未发布
> 已在主题 main 分支实现，晚于 v1.6.0；目前没有包含它的版本标签。
>
> Asciinema 的 `markers="时间:标签, …"` 以 `[时间, 标签]` 对的列表交给播放器，
> 标签去掉首尾空白；这是 asciinema-player 3.18 除纯数字外唯一接受的写法。标签
> 中的冒号保留，只写时间的标记得到空标签。此前的输出把这些对摊平成一个扁平列表，
> 播放器会拒绝它，所以只要写了 `markers`，页面上就只剩录像链接。

## 可选组件呈现 {#component-refinement}

OINK 1.4.0 支持以下可选呈现变体。示例见[组件呈现](/zh/docs/components/presentation/)。

| 组件 | 原生修饰类 | 完整形式 |
| --- | --- | --- |
| 分隔卡片列表 | `{.cards .td-cards-list}` | `cards variant="list"` |
| 紧凑步骤 | `{.steps .td-steps-compact}` | 百分号分隔的 `steps variant="compact"` |
| 命令条 | 带 `{class="td-code-command"}` 的单行围栏 | 沿用代码渲染器，没有新增短代码 |

未知 `variant` 值告警并回退到默认布局。命令条遇到多行、行号（包括站点默认行号）或折叠设置时，告警并使用普通代码块，保留所有源码。现有 `copy` 与 `wrap` 政策继续适用。不引入新运行时或组件注册表。

原生与完整卡片共用表面和标题规则。只有带链接的卡片显示悬停强调；正文中的独立链接保持可用，不被标题的整卡链接覆盖。标签页的单个标签平时背景透明，支持悬停的设备上才显示淡底色，选中项以细下划线和链接色标识。文字在不同状态间保持相同字重和位置，键盘焦点另有清晰轮廓。原生折叠块保留独立操作的摘要行。复制控件保持点击区域尺寸和既有成功／失败语义。粗指针设备上的复制和标签页控件高度至少为 44px。

预设颜色与字体角色继续生效。Ink／Terminal 保持平面表面以及直角／2px 圆角。打印、RSS、Markdown、LLMS 保留内容和既有输出语义，呈现变体不隐藏内容，也不向静态输出添加操作控件。

参数名在四种预设中均使用无边框的加重等宽文字，Terminal 也遵循此规则；原生 Markdown 表格与完整短代码保持一致。

## 校验 {#validation}

无效的作者输入遵循[架构契约](/zh/docs/design/architecture/)：发出警告，使用文档
规定的安全回退或省略组件。命名参数与位置参数不能混用。Book 目标 ID 匹配
`[A-Za-z][A-Za-z0-9_.:-]*`，Book 编号匹配 `[0-9A-Za-z.-]+`，class 必须通过
token 校验。渲染钩子与 shortcode 目标共享同一个页面注册表，因此冲突不会生成
重复的输出 ID。

URL 使用 `content/url.html`；不允许原始反斜杠，因为浏览器可能将其解释为 URL
分隔符。图片依次从页面资源、分区资源、全局 assets、static
或显式远程 URL 中解析。本地位图带固有尺寸；SVG、static 与远程来源仍然有效，
但不能执行 Hugo 图片操作。
资源元数据 `alt` 必须是字符串；无效值会告警并被忽略，保留正文填写的替代文本。

空的 `tabs` 会告警，在 HTML、Print、Markdown 与 RSS 中都不输出容器。
`xref` 没有可用目标或找不到目标页面时，保留文字但不生成链接。
`fig` 同时填写 `caption` 与 `title` 时会告警，所有输出都优先使用 `caption`。
块公式上的通用属性不会启用 Book 编号；没有 `num` 时，`id` 与 `caption`
会告警并被忽略，公式仍按无编号形态渲染。

## 组件行为 {#component-behavior}

### 提示块与标签页 {#callouts-and-tabs}

提示块类型包括 `note`、`tip`、`important`、`warning`、`caution`、`success`、
`danger`、`question`、`example`、`quote` 与 `details`；`-` 表示初始折叠，`+`
表示初始展开。未知类型渲染为保留原标记的普通块引用，不依赖 JavaScript。

只有连续且区块类型相同的相邻标签页才会分组。`group` 启用
`#<group>-<value>` hash 与 `td-tabs:v1:<group>` 存储键；未分组标签页两者都不用。
OINK 1.4.0 中，初始片段或 `hashchange` 指向面板或面板内标题时，会先由外
至内展开所有祖先面板，再滚动到目标。片段选择优先于已保存的偏好，并同步同名组，
但不改写存储；只有读者主动选择才持久化。标签页外的普通标题仍使用原生跳转。
HTML 在 JavaScript 运行前暴露所有面板，打印输出展开面板，Markdown 保留作者
源文，RSS 接收渲染后的文本摘要。完整形态支持任意 Markdown；`tab.label` 必填，
父级存在 `group` 时 `value` 才严格必填，孤立的 `tab` 会警告且不渲染。

HTML 与单页 Print 保持分组标签页的 ID 和本地链接不变；同页重复分组与嵌套标签页
容器的 ID 保持唯一。多页分区 Print 与整书
Print 给主题生成的标签页容器、面板 ID 加上来源页面的命名空间，并同步改写本地
链接。不同章节复用同一 group 时，链接仍须指向本章面板；指向普通 HTML 的跨页
链接保留原目标。
片段链接改写支持正常的 HTML 属性语法，并保留其他属性内的原始文本。

### 步骤、卡片、参数表与表格 {#steps-cards-fields-and-tables}

原生步骤接受普通区块内容。只有某一步必须包含百分号容器时才使用 shortcode。
原生卡片是链接列表；完整形态增加正文、徽章、图标与图片。原生参数表把第一列
映射为名称、最后一列映射为描述，中间列由 `meta=` 或表头映射；完整形态允许
区块描述。`card` 与 `field` 只能放在各自的父容器中。

参数锚点为 `field-<name>`，名称转小写，连续标点折叠为连字符，因此
`params.ui.typography` 变成 `field-params-ui-typography`。重复锚点追加位置后缀。

`field` 接受 `id`，用它替换自动生成的锚点。
值为空、不是字符串，或含有空白、引号、`<`、`>`、`&` 时，给出告警并保留自动生成的锚点。
首尾空格以及值中任意位置的 Unicode 空白字符都会触发这一回退。
同一页面上已有其他参数使用了这个 `id` 时同样如此。
每个带锚点的参数都带有 `data-td-search-entry`，值是它的纯文本名称；来自短代码和来自 `{.fields}` 表格的参数都一样。
[本地搜索](/zh/docs/design/shell/#search-engine)把它记为所在页面的条目，可以按名称直接打开。

表格渲染钩子负责响应式包装与 caption。标题在框内保留均衡留白，与单元格文字对齐；
正文中存在角落入口时，标题末尾为按钮预留空间。`.matrix` 把第一列变为行表头；
`.full-width` 加宽外层视口以占满文章可用宽度。在屏幕显示中，`.wide`
让技术表格按内容尺寸排版，在容器内横向滚动；单元格使用 `overflow-wrap: break-word`
与 `word-break: normal` 保留标识符，正文单元格以 `max-width: 40ch` 作为软宽度约束，
让长描述适当换行。普通表格保持现有布局。该标记不影响定义列表形式的 `.fields`，
也不影响静态与打印输出。`.fields` 不能与 matrix、full-width、编号或标签页组合；
编号与标签页也互斥。

> [!NOTE] OINK 1.4.0 的 `.wide`
> 这个简短的作者标记随 v1.4.0 发布。
> 它沿用 1.3.1 引入的技术宽表布局，继续兼容已有写法，可以与 `.matrix`、
> `.full-width` 组合；Markdown 保留作者原本使用的标记。

### 表格阅读 {#table-reading}

> [!NOTE] OINK 1.4.0 的 `.expand`
> 为主题渲染的 Markdown 表格显式启用，独立于 `.wide`。

只有 `.expand` 表格才生成 HTML 阅读容器并加载 `table-reader.js`。
运行时在右上角添加直接展开入口，悬停或键盘聚焦时显示，触屏和强制颜色模式常显。
不增加表格上方工具栏、全站开关、自动大小检测或整表点击事件。
`.fields .expand` 会告警并忽略展开；其他布局标记、标题、编号和标签页可正常组合。
开启 Goldmark 块属性后，`{.wide .expand}` 与 `{class="wide expand"}` 均可使用，
属性行与表格之间不能留空行。

一个原生模态对话框移动原表格与滚动容器，保留 ID、链接、选择、字号、行顺序和原生语义。
初始焦点位于标题，Tab 保持在对话框内；Escape 和关闭按钮还原原节点、表格与页面滚动位置，
并将焦点返回入口。协调器关闭时不抢回焦点。普通 caption 随表格移动，编号标题用于命名
对话框，并在打开期间为原本无名称的表格提供名称。单行表头在视口内吸附；
`.matrix` 保留原有行表头和固定首列行为。不增加排序、筛选、密度、导出或虚拟滚动控制。

缺少 JavaScript、资源被阻止或对话框不受支持时，保留可读正文且不出现无效入口。
引用移动子树外节点的表格保持正文阅读；指向表格外目标的同页链接先还原表格再导航。
浏览器打印前同步还原。专用 Print、RSS、Markdown 与 LLMS 保留原有内容边界，
不增加阅读器控件或运行时。[接受的决策](/zh/docs/design/decisions/large-table-reading/)记录设计理由。

### 图片、画廊、FileTree 与围栏 {#images-gallery-filetree-and-fences}

Markdown 图片钩子是普通图片 API。行内图片保持行内；块图片带 `caption` 或 `num`
时变为 figure。图片处理只属于这一原生形态：完整 `fig` 源形态是编号容器，其参数表
刻意不含 `command`/`options`，需要处理的编号图片写成带 `num` 的原生块图片。
允许的图片属性包括 `id`、`num`、`caption`、`width`、`height`、
`link`、`command` 与 `options`，以及共享安全属性。`command` 与 `options` 必须同时
出现，并对可处理的本地资源调用 Hugo `Fit`、`Resize`、`Fill` 或 `Crop`。普通
链接图片使用 Markdown 语法，因此 `link` 属性要求同时有 caption 或编号。链接
图片与装饰图片不加载缩放。

缩放按钮通过 ARIA 无障碍名称保留图片的 alt 与本地化预览操作，不向正文插入辅助
文字。复制纯文本或富文本 HTML 时，即使编辑器移除主题样式，也不得额外带入
预览提示；作者原有的图片与图注保持不变。资源 metadata 中的 `alt` 必须是字符串；
无效值会告警并被忽略，保留正文中编写的图片 alt。
Draw.io 与图片缩放共用一张图片时，编辑与缩放是同级的独立按钮。编辑入口支持
键盘访问，并在触摸设备和强制颜色模式下保持可见。
Draw.io 在模态对话框中打开，外层始终提供本地化的关闭按钮。关闭按钮、遮罩、编辑器
退出消息，以及焦点位于外层对话框时的 Escape 均可关闭编辑器、清理消息监听器并把
焦点归还编辑按钮。跨域 iframe 内的按键归编辑器所有，不能冒泡至外层；用户可沿
编辑器的 Tab 顺序移出 iframe，访问外层关闭按钮。重新打开时创建新的编辑会话。

画廊每行接受一张 Markdown 图片，可带描述、链接与 class。FileTree 接受缩进、
`- name`、可选 `/`、注释，以及经过校验的 icon、tone、open、type 属性。
FileTree 围栏参数 `wrap` 接受 `true` 或 `false`，默认 `false`；设置为 `true` 时，
屏幕上的长注释和无空格标识符在列内换行，行高从现有最小高度随内容增长，文件名
仍使用省略号。省略参数或设为 false 时保留桌面与平板的紧凑行；移动端堆叠、
分隔条操作、目录折叠和打印展开保持现有行为。无效值告警并回退到 false。Markdown 保留显式 wrap 参数和文件树源文；打印输出渲染
展开的静态图片与文件树。

所有代码高亮都使用 Chroma。通用围栏属性包括 `title`、`copy`、`wrap`、
`collapse`、`label`、`id`、行选项、标签页，以及 Book 的 `num`/`caption`。复制
操作返回作者源文。Mermaid 色板按明暗切换，与视觉预设独立；默认深色连线标签
背景使用 `#404040`，使标签文字达到 AA 对比度。显式
`params.mermaid.themeVariables` 配置仍然优先。

ECharts 输入是声明式 JSON/YAML；回调使用
`window.OinkEchartsFunctions` 中的 `$fn:<name>`，绝不执行嵌入脚本。

> [!NOTE] 尚未发布
> 已在主题 main 分支实现，晚于 v1.6.0；目前没有包含它的版本标签。
>
> 围栏的 `theme` 不是 ECharts 内置的 `dark` 时，指向 `window.OinkEchartsThemes`
> 中的条目；该对象把主题名映射到 ECharts 主题对象。引擎要等图表到期才加载，
> 站点脚本没有调用 `echarts.registerTheme()` 的时机，所以运行时在每张图表初始化前
> 注册其中所有对象条目，忽略其它值。这个注册表就是受支持的注册入口。名为 `dark`
> 的条目也会替换未固定主题的图表在深色模式下使用的配色；未定义的名字以 ECharts
> 默认配色绘制，不会告警。

OINK 1.4.0 中，Infographic SVG 跟随容器宽度缩放，覆盖横竖屏及外壳布局
变化，无须重复渲染 DSL。初始隐藏的容器等到可测量时再渲染；围栏 `height` 与
`full` 的含义保持不变。
透明的 Infographic 产物默认使用白色底面；显式 DSL 背景优先设置该底面。
站点明暗切换保留作者的 `light`、`dark`、`hand-drawn`、色板和 SVG 样式，
使默认深色文字保持可读，无须重新着色。作者明确选择透明背景或自定义文字颜色时，
仍须自行检查对比度。

Markmap 节点文字在屏幕显示下通过 `--markmap-text-color` 继承页面正文颜色
（`--bs-body-color`），在明暗模式切换、预设风格变更或恢复用户偏好时均可实时同步，
确保足够的对比度；打印时则保留默认深色文字，以适配白底纸张。该映射作用于正文
容器及生成的 SVG，站点仍可通过同优先级的自定义 CSS 或 SVG 内联属性进行覆盖。
（OINK 1.3.1 新增。）

OINK 1.4.0 中，Markmap 在首次可测量显示和容器尺寸变化时适配，也覆盖
隐藏面板展开的情况。读者平移或缩放后暂停自动适配，布局变化保留当前视图。
可用键盘操作的 **适应窗口** 按钮恢复完整导图并重新启用自动适配。布局适配不加
动画，减少动态效果偏好也会关闭节点过渡。打印时隐藏该按钮。解析前会移除首尾
空行和共同缩进，保留 YAML 配置与大纲层级。

数学公式使用 Hugo 构建时生成的 KaTeX 产物和本地 CSS，不加载浏览器数学运行时。
HTML 和 Print 使用本地样式表，并保留 MathML 与作者的 TeX 源文。
数学公式用满足[架构契约](/zh/docs/design/architecture/#hugo-toolchain)最低版本要求的 Hugo
验证。OINK 1.6.0 在 Markmap 中按需使用本地 MathJax 渲染导图公式（1.5.1 及更早版本使用 KaTeX）。
OINK 1.4.0 按阅读列的实际可用宽度为编号公式保留阅读空间，也覆盖侧栏
或目录挤窄的正文列。标题无法与公式并排时移到下一行，连续长词允许换行。
仅含编号的标题、MathML 与 TeX 仍然可用。打印时公式独占阅读列全宽，标题排列在
公式下方。长标题既不得把公式挤到零宽，也不得撑宽整页。

Swagger 与 Redoc 接受 HTTP(S) 规范 URL 或以 `static/` 为根的路径，都不解析页面
资源。Redoc 将开头有无斜杠视为等价，并把本地路径与 `baseURL` 拼接。只有 HTML
输出可交互；Print、Markdown 与 RSS 输出静态规范链接。

### 时间轴、更新、媒体、社交帖子与地图 {#timeline-media-social-and-maps}

> [!NOTE] 尚未发布
> 已在主题 main 分支实现，晚于 v1.6.0；目前没有包含它的版本标签。

紧跟 `{.timeline}` 的定义列表就是时间轴：术语是自由文本的标记，定义是可含块级内容的事件。
`<dl>` 由 Goldmark 生成；主题只添加作用域为 `.td-content dl.timeline` 的 CSS，宽屏时分出标记列，窄屏或位于 `.td-content-card` 容器内时保持单列。
空心节点读取 `--td-timeline-surface` 以融入提示块、卡片和标签页表面，轴线采用 `--td-brand-line-strong` 以与 Landing 时间轴保持视觉一致。
打印时无论屏幕配色如何都切换为纸张调色板令牌（`--td-print-ink`、`--td-print-meta`、`--td-print-table-line`、`--td-print-quote-line`），并避免在定义内部分页。
构建期检查 `content/check-timeline.html` 在零 JS 运行时的前提下对以下情况按页面路径告警：`{.timeline}` 被空行隔开、落到非 `<dl>` 块上（含关闭 `definitionList` 时），或提示块标题被吞入 `<dl><dt>`；`bin/check-site-markup.py` 同时校验 `markup.goldmark.extensions.definitionList: true`。
由于 Hugo 没有 `<dl>` 渲染钩子，`<dl class="timeline">` 上的属性（与 `.steps` 相同）沿用 Goldmark 默认过滤规则：剥离 `on*` 事件，但放行 `style`。

带 `{.update}` 标记的标题就是一条更新日志条目，另外接受字符串型 `date`（`YYYY`、`YYYY-MM` 或合法日历 `YYYY-MM-DD`，渲染为 `<time datetime>`）与字符串型 `tags`（支持 `,` 与中文全角 `，` 分隔的纯文本，渲染为中性 chip）。
标题本身保持不变，因此 TOC 条目、锚点、搜索小节与 Print ID 都与普通标题一样；标题之后跟一行 `td-update-meta`，各项之间插入 `<span class="td-update-sep">, </span>` 分隔符。这一行采用行内排版而非 flex，分隔符是 `font-size: 0` 的文档流内文本，且不设 `user-select: none`，因此 Chromium、Firefox 与 WebKit 的纯文本复制、离线搜索（`offline_search_index: content`）、RSS 阅读器与无障碍树都能保持词项独立；flex 子项会被块级化，复制出的文本因而断行或粘连。
无效日历日期及非字符串的 `date`、`tags` 取值会按页面路径告警并被丢弃，同时保留标题与其余合法元数据；没有该标记时，`date` 与 `tags` 属于未知属性。
Goldmark 会给每个标题加上 `id` 属性，因此当该 id 是唯一属性时，`render-heading.html` 走快速路径、跳过属性校验 partial，输出与完整路径逐字节一致。
更新样式独立于 `assets/css/td/update.css`，用 `:has(+ .td-update-meta)` 与各项自身的块向外边距替代负外边距，打印时无论屏幕配色如何都映射到 `--td-print-*` 令牌并抑制 `h2.update` 的底边线；`rich-copy.js` 在纸张调色板上将 `.td-update-meta` 格式化为分隔的元数据项。

目标为视频或音频文件，或 YouTube、Bilibili、Vimeo URL 的块级图片属于媒体，由 `content/media.html` 处理。
文件按解析到的资源的 Hugo 媒体类型识别，否则按扩展名识别；解析到的本地资源会保留查询参数与片段（如 `#t=30,60`）。图片行为、其他非图片资源的告警以及查找顺序都不变；这套顺序现在由 `content/resource-lookup.html` 统一提供给两个解析器。
视频接受 `caption`、`num`（Book `fig` 目标）、`id`、`poster`、`track`（一个页面语言的 WebVTT 文件；本地资源保留查询参数）、`autoplay`、`width` 与 `height`（须为成对正整数；只设定容器宽高比，不覆盖海报 `<img>` 的固有尺寸）。音频接受 `caption`、`id` 与 `preload`（`metadata` 或 `none`；同页前 6 个音频默认 `metadata`，第 7 个起默认 `none`；`id` 与同页另一个无编号音视频 figure 或编号 Book 目标重复时告警，无论谁先出现都从后出现的一方丢弃；不与标题或普通图片的 ID 比较）。音频 figure 不携带 `.td-figure`，将方括号文字显示为可见标题，并通过 `aria-labelledby`（带说明时另加 `aria-describedby`）关联到 `<audio>`；在 `content/render-block.html` 内会自动重写生成的 ID 作用域。
`autoplay=true` 输出 `muted loop playsinline`，但不输出 `autoplay` 属性；`js/chunks/media.js` 只在视频至少一半可见时播放，读者要求减少动态效果时绝不播放，离开视口即暂停。原生控件始终保留。页面上有两个及以上 `<audio>` 或 `<video>` 播放器时，`js/chunks/media.js` 同时负责同页互斥播放：播放器变为有声时（带声音开始播放，或正在播放时被取消静音；在捕获阶段监听 `play` 与 `volumechange`），会暂停页面上其它所有有声播放器。静音或音量为 0 的播放器（包括自动播放循环与作者自写的静音循环）既不打断别人也不被打断；跨域 iframe 中的平台播放器无法参与。只有一个音频播放器的页面不加载脚本。
平台 URL 渲染为链接卡片（YouTube `/shorts/` 在未给海报或尺寸时默认按 `9:16` 占位；空名称回退为观看地址；Draw.io 跳过 `a.td-media-card` 内的图片，其他带链接的图片照常检测）。卡片以 `--td-media-ratio` 携带比例，`media.css` 据此为卡片及替换它的播放器推导宽高比与 `min(100%, 80vh × 比例)` 的宽度上限；支持容器单位时，比例改为按 figure 宽度计算的最小高度，换行的长标题在各引擎中都会撑高卡片。对 `params.video_embeds` 列出的平台，普通点击会加载带沙箱的播放器 iframe（`allow="autoplay; picture-in-picture; fullscreen"`、`sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`），其 URL 由主题根据校验过的 ID 推导（`youtube-nocookie.com`、带 `danmaku=0` 的 Bilibili、带 `dnt=1` 的 Vimeo，支持 `youtube-nocookie.com`、`music.youtube.com`、`player.vimeo.com`、Vimeo `?h=`/`#t=`、`b23.tv/BV…`、Bilibili 嵌入代码地址 `player.bilibili.com/player.html?bvid=…|aid=…` 与十进制前导零时间戳）；点击之前不发出任何请求。
行内媒体渲染为链接。专用 Print 输出带可见 `.td-media__link` URL 的静态 figure（包含平台观看地址）；直接用浏览器打印 HTML 页面时则显示屏幕上隐藏的 `.td-media__url` 行，并在 `@media print` 下无论屏幕主题如何都重置为纸张调色板，卡片替换为 iframe 后仍保留回退地址；RSS 为视频/平台输出静态 figure（含观看地址与真实海报尺寸），为音频将标题直接链接到绝对文件 URL；Markdown 保留作者写下的那一行；`rich-copy.js` 保留起始对齐与可点击录音 URL（未点击的平台卡片不重复输出 URL，点击替换后仍保留回退地址）。不带 `.td-figure` 的媒体 figure 通过 `:where(.td-media):not(.td-figure)` 保持 1.5rem/1.75rem 外边距，比 Bootstrap 的 `figure` 重置多一级类选择器权重。连续音频 figure（间距 16px）以及紧随其后的 `.td-callout--details` 文字稿（间距 8px）通过 `:has()` 正向边距编组，使音频与文字稿的间距小于相邻两组之间的间距（24px）。

`social` 只用页面内容引用一条帖子，参数为 `author`、`handle`、`avatar`、`date`、`url` 与 `platform`（顶层卡片默认 `x`，嵌套引用默认 `none`，另有 `bluesky`、`mastodon`、`threads`、`weibo`、`zhihu`、`telegram`、`linkedin`，决定图标以及向辅助技术播报、写入 Markdown 与 RSS 的平台名；嵌套省略 `platform` 时同时省略图标与视觉隐藏平台名，显式指定则两者同时呈现）。
参数校验字符串类型并拒绝未知或位置参数；`avatar` 以 `parameter="avatar"` 经过 `content/image-resolve.html`，并在项目自己的 `static/` 目录存在时，对解码、规范化后在该目录中找不到的静态头像离线告警，告警 ID 为可关闭的 `social:avatar-static`（检查看不到模块挂载与自定义 `staticDir`）；用 `..` 越出站点根目录的静态路径总是告警。无头像时，先剥离开头的 `@`、Unicode 空白、控制字符与不可见格式字符，再按首个字素簇绘制首字符（剥离后为空时回退人物图标）。
`date` 仅在 `YYYY-MM`，或 `YYYY-MM-DD` 带可选 `HH:MM[:SS]` 与可选 `Z`／`±HH:MM`，且为真实日历日期时输出 `<time datetime>`，否则输出 `<span class="td-social__date">`；`url` 仅对外链输出 `rel="external"`。
正文是 Markdown，图片、`gallery` 围栏（在卡片内采用适配预设圆角的紧凑网格）与嵌套 `social`（超过一层时告警）都在正文中组合；HTML 在 RTL 下对账号名和 ISO 时间戳执行 LTR 双向隔离，打印时无论屏幕配色都映射至 `--td-print-*` 纸张令牌，并在原帖链接中附加视觉隐藏的作者名上下文。
Markdown 通过上下文感知的行内转义（`content/markdown-escape-inline.html`）与行内代码账号名生成可读引用块，并在其后留一个空行，使相邻卡片保持为独立的引用；RSS 在仅含链接的卡片上省略空 `<blockquote>` 并补全站内相对 URL。
缺少 `author` 与 `handle` 时，有正文则渲染为普通引用块（`url` 只保留为 `cite`，Markdown 中省略；`date`、`platform` 与 `avatar` 被忽略），空正文且有 `url` 则在全部四种输出中渲染含原帖链接的引用块并发出单条告警；正文与 `url` 皆空时不输出。Hugo 内置的 `x` 短代码不被覆盖。

`map` 围栏承载一个 YAML 或 JSON 地点列表（`name`、`lat`、`lng`、`text`、`image`、`link`），按名称以 YAML 解析，而不是靠内容猜测格式。围栏属性为 `caption`、`route`、`zoom`、`height`、`id` 以及相邻标签页的键。
所有输出都渲染带编号的地点列表：坐标链接带 `dir="ltr"` 隔离并以十进制格式化（不输出科学计数法），装饰缩略图在 DOM 顺序中位于地点文字之后。`params.map` 配置完整时（`tiles` 支持 `{s}`、`{r}` 与 `{-y}`，其他占位符因 Leaflet 无值可填会抛错而在构建时告警，必填纯文本 `attribution`，以及可选的 `attribution_url`、`dark_tiles`、`subdomains`、`max_zoom` 与 `loading: lazy | click`），HTML 另加画布和校验后的地点 JSON；`content-components.js`（在 `tabs.js` 隐藏非激活面板之后于 `DOMContentLoaded` 注册观察器）只在这些页面加载随主题内置的 Leaflet 引擎与样式表。
地图关闭滚轮缩放；由于 Leaflet 在所有支持 Pointer Events 的浏览器上都报告触屏，拖拽默认关闭，鼠标或触控笔进入或按下地图时开启、手指按下时关闭，单指滑动始终滚动页面；焦点位于画布内时全站 `keyboard-nav.js` 单键快捷键自动让位；遵守 `prefers-reduced-motion`；带编号的 HTML 标记点附带完整 `aria-label` 地名；弹窗与可选版权链接均通过 DOM API（`textContent`）构建；用 `Enter` 打开的弹窗获得焦点，按 `Escape` 或关闭按钮关闭后焦点回到标记点；点击列表条目可平移定位并打开对应弹窗；未配 `dark_tiles` 时深色模式仅温和降亮瓦片而不反色；`dark_tiles` 全部失败时改用降亮后的浅色瓦片；引擎或浅色瓦片全部加载失败时隐藏画布并保留列表，且等 Leaflet 分发完失败图层的 `load` 后才移除地图。`loading: click` 的加载按钮列出地图可能请求的全部域名（`{s}` 写作 `*`，含 `dark_tiles` 域名，按从左到右隔离显示），从键盘激活时焦点移到挂载后的地图。无效地点（含 `NaN`/`Inf` 坐标）告警并跳过；浏览器打印隐藏画布并使用打印墨色令牌；`rich-copy.js` 排除画布元素。

### Book {#book}

`book` 类型扩展 docs 外壳，并遵循内容树或 `data/docs_nav.json`。`book_number`、
`book_part`、`book_kind` 与 `book_status` 是展示元数据，不改变 Hugo 发布状态。

带编号的类型为 `fig`、`tbl`、`eq` 与 `eg`，默认 ID 是 `<kind>-<num>`。`eg`
需要 caption；不带 `num` 的 `eq` 是无编号展示公式。`xref` 要么准确指定一种类型
并可附带 `page`/`anchor`，要么指定一个 anchor 和显式文字。带编号的示例是一个
完整的边框正文与 caption。

脚注属于页面文档。原生编号表格与围栏会让脚注留在页面里。Shortcode 正文是独立
的 Goldmark 文档，因此 `tbl`、`eg`、`fig`、`card`、`tab`、`field` 或 `include`
中的脚注引用会警告并保持字面形式；该检查忽略代码形态的文本。

`book-toc` 按 1–3 层导航顺序生成目录；四个 `book-*` 索引各自收集一种目标。
单页 Print 与普通 HTML 保持完全相同的普通标题、脚注与标签页 ID。只有多页分区
Print 与整书 Print 会改写跨页链接，并给页面局部标题、脚注和主题生成的标签页 ID 增加命名
空间，避免聚合后冲突。本地标题链接在匹配前按 URL 规则解码一次片段，因此指向
Unicode 标题的普通 Markdown 链接在聚合后仍能到达原目标。编号图、表、公式和示例在章节 HTML、单页 Print 和整书 Print 中保留同一个 ID，短代码正文中的编号目标也遵循此规则。同一页的两处定义使用相同 ID 时，构建会发出警告，首处定义保留该 ID。
消费站点自行选择是否启用这些潜在成本较高的聚合输出。消费站手写的 HTML 锚点和
自定义短代码 ID 默认仍是全局 ID。给带 `id` 的元素增加布尔属性
`data-td-print-local`，可将其声明为页内锚点。聚合输出会给该 ID 和同页链接增加
命名空间，普通 HTML 与单页 Print 保留原 ID。旧别名和自定义短代码标题因此可保留
原有深链接，同时避免跨章冲突；未标记的作者 ID 必须在聚合文档中保持唯一。

### 发布与下载 {#release-and-download}

发布 front matter 使用一个
`https://github.com/<owner>/<repo>/releases/tag/<tag>` 形态的 `release_url`；owner、
项目与 tag 来自 URL，日期来自页面。构建不会抓取远程发布状态。已经移除的
`release` map、`release_products` 与 `release_group_by_product` 会警告并给出
替代项，它们不是兼容路径。分区索引列出所有页面；能解析时使用 `project tag`，
否则使用页面标题。
使用 `layout: releases` 时，HTML 保持发布索引；分区 Print 聚合完整发布正文，并使用
章节局部 ID。开发与生产构建遵循相同行为。

校验和可以接受规范行，也可以接受一个源资源，两者不能同时提供；文件名不能是
路径。HTML 增加本地复制功能，静态输出暴露完整 hash。

下载使用 `data/download/<key>.yaml`。channel 可取 `rolling` 或 `pinned`；只有
pinned URL 与命令会插值 `${version}` 和 `${tag}`。发布前，rolling channel 保持
可用，pinned channel 显示 pending。Markdown 渲染完整 channel 列表；RSS 省略
该组件。

切换标签页后，重新测量新显示面板中的可折叠代码块；字体加载完成后或没有
`ResizeObserver` 时，展开和收起控件仍须可用。

## 验证 {#verification}

共享输出规则见[架构契约](/zh/docs/design/architecture/)，例外随各组件定义。
Markdown 与 RSS 不设置浏览器运行时标志；Print 只保留渲染打印功能需要的标志。
源码检查覆盖参数、渲染钩子策略、运行时隔离与迁移；输出检查比较 HTML、Print、
Markdown、RSS 与 LLMS golden；浏览器测试覆盖交互界面。迁移行为见
[迁移边界](/zh/docs/design/migration/)。

## v1.5.1 审查修正 {#unreleased-review-corrections}

以下修正已随 v1.5.1 发布，并属于当前消费站契约。

- 只接受命名参数的短代码遇到位置参数时警告并继续普通构建。无效输入检查必须
  验证构建成功及安全输出，不再同时接受成功与失败退出码。
- Book 编号无效或缺失时保留可读的无编号内容，不生成空的 `fig-`、`tbl-`、
  `eg-`、`eq-` 目标，也不注册到图表索引中。
- 自动 ID 包含完整短代码祖先序号。独立渲染的 Markdown 正文为代码块、图表、
  FileTree 和字段的自动 ID 及引用加入作用域；作者指定的代码块 ID 保持原样。
- RSS 为 Book 图片、表格、公式、示例、链接、贡献者、接口规范链接、录屏链接和
  校验和表格输出静态 HTML，不泄漏对应的 Markdown 源码或浏览器控件。
  Release assets 仍按既有约定在 RSS 中省略。RSS 检查使用普通分区 feed。
- 复制反馈使用 `aria-disabled` 配合操作守卫，在阻止重复写入剪贴板时保留键盘焦点。
