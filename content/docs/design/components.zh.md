---
title: 组件契约
linkTitle: 组件
description: OINK 创作原语、校验、Book、发布行为与输出降级的维护者契约。
weight: 20
icon: fa-solid fa-cubes-stacked
search_keywords: [OINK 组件契约, shortcode API, Markdown 组件, Book, 发布, 校验]
contract_status: v1.3.2
---

> [!NOTE] OINK 1.3.2 契约
> 本契约描述 OINK v1.3.2。主题开发使用同级 checkout；发布验收在关闭替换与
> 工作区后验证公开模块。消费站升级与部署分别检查。

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

只有 `{{%/* steps */%}}` 使用百分号分隔符，因为它的正文属于页面大纲；其它
shortcode 一律使用尖括号分隔符。复合正文通过 `content/render-block.html`
处理，并使用唯一的 ID 作用域。Shortcode 与组件参数中的 caption、label、title
和 name 是纯文本，Markdown 应放在正文里。落地页叙述字段遵循自己的契约。图标
由一对 Font Awesome class 表示。组件暴露安全的 class 与属性，不接受任意颜色
或内联样式。

## 公共 API {#public-api}

OINK 有 29 个 shortcode：

- 核心：`tabs`、`tab`、`steps`、`cards`、`card`、`fields`、`field`、`include`、
  `kbd`、`badge`、`param`、`comment`、`contributors`、`asciinema`；
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
| 表格 | 属性、caption、编号或标签页 | 复合 Book 表格使用 `tbl` | 只有标签页表格加载 tabs |
| Book 目标 | 图片、表格、passthrough、围栏加 `{num=}` | `fig`、`tbl`、`eq`、`eg` | 无 |
| 发布资产 | `checksums` 数据围栏 | `release-assets` | HTML 中加载复制功能 |
| 数学与化学公式 | passthrough、`math`、`chem` 围栏 | `eq` | 无；构建期渲染并加载本地样式 |
| 图表与数据 | `mermaid`、`plantuml`、`markmap`、`echarts`、`infographic` 围栏 | 无 | 只加载选中的本地运行时 |

## 校验 {#validation}

无效的作者输入遵循[架构契约](/zh/docs/design/architecture/)：发出警告，使用文档
规定的安全回退或省略组件，再由 `--panicOnWarning` 在发布门禁中把同一条诊断
变为致命错误。命名参数与位置参数不能混用。Book 目标 ID 匹配
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

表格渲染钩子负责响应式包装与 caption。`.matrix` 把第一列变为行表头；
`.full-width` 加宽外层视口以占满文章可用宽度。在屏幕显示中，`.td-table--wide`
让技术表格按内容尺寸排版，在容器内横向滚动；单元格使用 `overflow-wrap: break-word`
与 `word-break: normal` 保留标识符，正文单元格以 `max-width: 40ch` 作为软宽度约束，
让长描述适当换行。普通表格保持现有布局。该标记不影响定义列表形式的 `.fields`，
也不影响静态与打印输出。`.fields` 不能与 matrix、full-width、编号或标签页组合；
编号与标签页也互斥。此宽度标记从 OINK 1.3.1 起可用。

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
分隔条操作、目录折叠和打印展开保持现有行为。无效值告警并回退到 false，严格
发布检查拒绝该告警。Markdown 保留显式 wrap 参数和文件树源文；打印输出渲染
展开的静态图片与文件树。

所有代码高亮都使用 Chroma。通用围栏属性包括 `title`、`copy`、`wrap`、
`collapse`、`label`、`id`、行选项、标签页，以及 Book 的 `num`/`caption`。复制
操作返回作者源文。Mermaid 色板按明暗切换，与视觉预设独立；默认深色连线标签
背景使用 `#404040`，使标签文字达到 AA 对比度。显式
`params.mermaid.themeVariables` 配置仍然优先。

ECharts 输入是声明式 JSON/YAML；回调使用
`window.OinkEchartsFunctions` 中的 `$fn:<name>`，绝不执行嵌入脚本。

Markmap 节点文字在屏幕显示下通过 `--markmap-text-color` 继承页面正文颜色
（`--bs-body-color`），在明暗模式切换、预设风格变更或恢复用户偏好时均可实时同步，
确保足够的对比度；打印时则保留默认深色文字，以适配白底纸张。该映射作用于正文
容器及生成的 SVG，站点仍可通过同优先级的自定义 CSS 或 SVG 内联属性进行覆盖。
（OINK 1.3.1 新增。）

数学公式使用 Hugo 构建时生成的 KaTeX 产物和本地 CSS，不加载浏览器数学运行时。
HTML 和 Print 使用本地样式表，并保留 MathML 与作者的 TeX 源文。
数学公式按[架构契约](/zh/docs/design/architecture/#hugo-toolchain)中的当前 Hugo
基线验证。Markmap 使用与样式配套的本地 KaTeX 运行时。
窄屏中，编号公式的标题在阅读列内换行，长标题不得撑宽整页。

Swagger 与 Redoc 接受 HTTP(S) 规范 URL 或以 `static/` 为根的路径，都不解析页面
资源。Redoc 将开头有无斜杠视为等价，并把本地路径与 `baseURL` 拼接。只有 HTML
输出可交互；Print、Markdown 与 RSS 输出静态规范链接。

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
Unicode 标题的普通 Markdown 链接在聚合后仍能到达原目标。显式目标 ID 保持不变。
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
