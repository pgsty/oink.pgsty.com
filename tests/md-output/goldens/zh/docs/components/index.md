# 组件总览

> 写文档时可用的全部组件，一个组件一页，例子由浅入深，参数表在页尾。

---

LLMS 索引： [llms.txt](/zh/llms.txt)

---

这一栏回答一个问题：某个组件在 Markdown 里怎么写。每页的顺序相同：最简例子、逐步深入的例子、输出形态、参数表、限制。查语法见下面的速查表。

## 两种形态 {#two-forms}

组件的第一形态是 Markdown 语法本身：块引用、列表、表格、图片、围栏，加上紧跟其后的一行 `{…}` 属性。原生形态在 GitHub 与任意 Markdown 编辑器中仍然可读，Markdown 输出保留的也是源码。

原生形态表达不了的场景使用 shortcode：正文标签页、带块级描述的参数表、带图标与徽章的卡片、终端录像。规则有五条：

- 所有 shortcode 都写 `{{< 名字 >}}`，只有 `{{% steps %}}` 用 `%` 分隔符，因为它的正文是页面级 Markdown。
- 嵌套名字（`tab`、`card`、`field`）只在各自的父 shortcode 里有效。
- 参数写错不会静悄悄降级，构建失败，报错带文件名与行号。
- 公开字符串参数（图注、标签、标题）一律是纯文本，不解析 Markdown。只有正文是 Markdown：`tab`、`card`、`field` 的正文，`include` 引入的文件，以及 Book 的 `fig`、`tbl`、`eg` 正文。
- 页面没用到的组件不下发运行时。脚本按这一页实际用到的组件拼成一个包，打印、Markdown 与 RSS 输出不加载任何脚本。

## 站点前置配置 {#prerequisites}

组件依赖三项 Goldmark 设置。克隆本站起步时它们已经配好，从零建站照抄以下片段：

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

- `renderer.unsafe: true`：Goldmark 默认丢弃内容里的原始 HTML，关闭时组件正文里嵌套的 HTML 会消失。
- `parser.attribute.block: true`：属性行的总开关。关闭时 `{.steps}`、`{caption="…"}` 只是正文里的一行字符串。
- `parser.wrapStandAloneImageWithinParagraph: false`：独立成段的图片不再包进 `<p>`，图片才能成为带图注的 figure，属性行才跟得上去。

个别组件另有前置条件：公式需要开启 Goldmark 的 passthrough，PlantUML 与 Draw.io 需要自建渲染服务，各页分别说明。完整的配置键见[配置总览](/zh/docs/customize/config/)。

## 速查表 {#cheatsheet}

「形态」列的取值：原生 = Markdown 语法加属性行；围栏 = 带语言标记的代码围栏；shortcode = `{{< … >}}`。「运行时」列说明这个组件是否往页面上下发 JavaScript。

| 组件 | 一句话 | 最短写法 | 形态 | 运行时 |
| --- | --- | --- | --- | --- |
| [提示块](/zh/docs/components/callout/) | 把前提、警告与折叠说明从正文中分离 | `> [!NOTE]` | 原生 | 无 |
| [图片](/zh/docs/components/image/) | 图注、尺寸、缩放、编号与构建期图片处理 | `![说明](oink.webp)` | 原生 | 需站点开关 |
| [代码块](/zh/docs/components/code/) | 高亮、标题、复制、折叠、行链接 | ```` ```sh ```` | 围栏 | 按页加载 |
| [标签页](/zh/docs/components/tabs/) | 同一件事的多个平台或语言版本 | 属性行 `{tab="Linux"}` | 原生 + shortcode | 按页加载 |
| [表格](/zh/docs/components/table/) | 普通表格，加满宽、矩阵、标题与编号 | `{.full-width}` | 原生 | 无 |
| [参数表](/zh/docs/components/fields/) | 参数清单，带类型 / 必填 / 默认值芯片 | `{.fields meta="type default"}` | 原生 + shortcode | 无 |
| [步骤](/zh/docs/components/steps/) | 有先后的流程 | `{.steps}` | 原生 + shortcode | 无 |
| [卡片](/zh/docs/components/cards/) | 一组并列的去处 | `{.cards}` | 原生 + shortcode | 无 |
| [文件树](/zh/docs/components/filetree/) | 目录结构与对齐的注释列 | ```` ```filetree ```` | 围栏 | 按页加载 |
| [公式](/zh/docs/components/math/) | KaTeX 行内与块级公式 | `$$ … $$` | 原生 | 按页加载 |
| [Mermaid](/zh/docs/components/mermaid/) | 流程图、时序图、甘特图 | ```` ```mermaid ```` | 围栏 | 按页加载 |
| [PlantUML](/zh/docs/components/plantuml/) | UML 图；需要自建渲染服务 | ```` ```plantuml ```` | 围栏 | 需站点开关 |
| [思维导图](/zh/docs/components/markmap/) | Markdown 列表变成思维导图 | ```` ```markmap ```` | 围栏 | 需站点开关 |
| [Draw.io](/zh/docs/components/drawio/) | 可回编辑的图；需要自建服务 | `![说明](arch.drawio.svg)` | 原生 | 需站点开关 |
| [ECharts](/zh/docs/components/echarts/) | 声明式数据图表 | ```` ```echarts ```` | 围栏 | 按页加载 |
| [Infographic](/zh/docs/components/infographic/) | AntV 信息图 | ```` ```infographic ```` | 围栏 | 按页加载 |
| [画廊](/zh/docs/components/gallery/) | 一组图片共用一个缩放对话框 | ```` ```gallery ```` | 围栏 | 需站点开关 |
| [徽章](/zh/docs/components/badge/) | 行内状态标记 | `{{< badge text="Beta" >}}` | shortcode | 无 |
| [按键](/zh/docs/components/kbd/) | 键位与组合键 | `{{< kbd "Ctrl" "K" >}}` | shortcode | 无 |
| [引用](/zh/docs/components/include/) | 引入文件、插入站点参数、构建期注释 | `{{< include file="parts/x.md" >}}` | shortcode | 无 |
| [Asciinema](/zh/docs/components/asciinema/) | 终端录像 | `{{< asciinema file="images/x.cast" >}}` | shortcode | 按页加载 |

「运行时」列的四条细则：

- 代码块只在块上有复制或折叠按钮时加载 `code-block.js`；文件树只在树带注释列时加载 `filetree.js`，它负责拖动那条分栏线。
- 图片与画廊共用一个缩放对话框运行时，需要站点开启 `ui.image_zoom`，且页面上确有候选图。
- 公式在构建期由 KaTeX 渲染成 HTML 与 MathML，页面上只多一份 KaTeX 样式表与字体，没有脚本。
- Draw.io 只在渲染内容含 PNG 或 SVG 候选图的页面加载，并且每个不同的图片 URL 只检查一次。

每个组件在 HTML、打印、Markdown、RSS 四种输出下都有确定形态，见各页的「输出形态」一节。

---

本节页面：

- [提示块](/zh/docs/components/callout/): 用 `> [!NOTE]` 这样的块引用写出带颜色、图标与标题的提示、警告与折叠块，不需要短代码。
- [图片](/zh/docs/components/image/): 用普通 Markdown 图片语法写图，加一行属性就得到图注、尺寸、缩放、链接、编号与 Hugo 图片处理。
- [代码块](/zh/docs/components/code/): 普通 Markdown 围栏加一行属性，就得到文件名标题、精确复制、行号、高亮、换行、折叠与可链接的行。
- [标签页](/zh/docs/components/tabs/): 给相邻的围栏或表格加一个 `{tab=}` 属性就得到标签页；加上 group 之后可分享链接、跨组同步、记住读者的选择。
- [表格](/zh/docs/components/table/): 普通 GFM 表格加一行属性，就得到标题、兼容矩阵、参数表、编号表或标签页；宽表格自己横向滚动，不撑宽页面。
- [参数表](/zh/docs/components/fields/): 用一张普通表格加 `{.fields}` 记录配置项、命令参数与 API 字段：名称、类型、默认值、说明各就各位，窄屏不挤，每条都能单独链接。
- [步骤](/zh/docs/components/steps/): 有序列表加 `{.steps}` 就是带编号圆点与竖线的操作步骤；步骤要带标题、要进目录时改用 steps shortcode。
- [卡片](/zh/docs/components/cards/): 用带 `{.cards}` 的链接列表排出导航卡片网格；需要图标、徽章、图片时改用 shortcode。
- [文件树](/zh/docs/components/filetree/): 用 `filetree` 围栏画带注释的目录结构：对齐的注释列、逐条目图标、可折叠目录、可拖动的分栏。
- [公式](/zh/docs/components/math/): 用 KaTeX 写行内与块级数学公式，构建期渲染完毕，读者不下载任何脚本。
- [Mermaid](/zh/docs/components/mermaid/): 用 `mermaid` 围栏把文本写成流程图、时序图、甘特图、类图与状态图，本地渲染、跟随深浅色、diff 友好。
- [PlantUML](/zh/docs/components/plantuml/): 用 `plantuml` 围栏写时序图、类图、组件图、活动图与用例图；渲染必须由你自己配置一个 PlantUML 服务。
- [思维导图](/zh/docs/components/markmap/): 用 `markmap` 围栏把一段 Markdown 大纲变成可展开、可缩放的思维导图，源码本身就是能读的提纲。
- [Draw.io](/zh/docs/components/drawio/): 把带着可编辑副本的 `.drawio.svg` 当普通图片放进页面，读者鼠标移上去就能点开 Draw.io 编辑器改图。
- [ECharts](/zh/docs/components/echarts/): 在 `echarts` 围栏里用 YAML 或 JSON 写图表选项，Hugo 构建期校验，浏览器用本地 ECharts 画出跟随深浅色的统计图。
- [Infographic](/zh/docs/components/infographic/): 用 `infographic` 围栏挑一个 AntV 模板，把标题与条目渲染成流程、时间线、漏斗、网格或层级信息图。
- [画廊](/zh/docs/components/gallery/): 用 `gallery` 围栏把一组相关截图排成响应式网格，每张可带说明或链接，并复用页面的图片缩放对话框。
- [徽章](/zh/docs/components/badge/): 在功能名、版本号或表格单元格旁边放一枚语义状态标签，五种 tone，不需要自定义颜色。
- [按键](/zh/docs/components/kbd/): 用 `kbd` 写快捷键：一个 shortcode 接一串按键名，输出语义化的按键序列，打印与 Markdown 输出里同样可读。
- [引用](/zh/docs/components/include/): 用 include 插入外部文件，用 param 插入站点参数，用 comment 写不会出现在任何输出里的注释。
- [Asciinema](/zh/docs/components/asciinema/): 把 .cast 终端录像放进页面：文字仍然是可选中的文字，播放器随主题分发，不连 CDN。
