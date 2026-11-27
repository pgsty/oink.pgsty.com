---
title: 打印支持
linkTitle: 打印支持
description: 单页交给浏览器的 Cmd/Ctrl+P，整个栏目用 print 输出格式合成一份连续文档。
weight: 130
search_keywords:
  [打印, 打印整章, 打印视图, PDF, 导出, print, outputs, _print, no_print, disable_toc]
aliases:
  - /docs/advanced/print/
---

文档被打印出来的机会比想象中多：带进没有网络的机房的操作手册，培训时发下去的一章讲义，附在变更申请里的一份 PDF。单个页面不需要任何配置，用浏览器的 `Cmd/Ctrl+P` 就能干净地打印：顶栏、侧栏、目录与各种按钮都带 Bootstrap 的 `d-print-none` 类，不会出现在纸上，所以主题没有「打印本页」按钮。要打印一整个栏目或一整本书，启用 `print` 输出格式。之后每个栏目都有一个打印视图，把其中的页面按侧栏顺序合成一份带目录的文档，可以直接打印，也可以存成 PDF。

## 启用整章打印 {#enable}

`print` 输出格式由主题定义，但交给站点决定是否启用，因为它会让每次构建为每个栏目多生成一个页面。在自己的 `hugo.yml` 里把它加到 `section`：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

`outputs` 下的每个键都会整体替换该页面类型的格式列表，而不是追加，所以要把该类型原有的格式（这里是 `HTML`、`RSS`、`markdown`）一并写上；漏掉哪一种，哪一种就不再生成。

每个栏目的打印视图位于 `_print` 下，`_print` 紧跟在语言前缀之后：

| 页面 | 打印视图 |
| --- | --- |
| `/zh/docs/customize/` | [`/zh/_print/docs/customize/`](/zh/_print/docs/customize/) |
| `/zh/docs/` | `/zh/_print/docs/` |
| `/zh/blog/release/` | `/zh/_print/blog/release/` |

读者通过页面操作菜单里的 **打印完整章节** 进入打印视图，也可以在命令面板里搜到同一个操作（`print_section`）。它打印的是当前页所属的栏目：在 `/zh/docs/customize/print/` 上点它，得到的是整个「定制站点」栏目，而不只是这一页。

## 打印视图的结构 {#anatomy}

打印视图从上到下依次是：

1. 一条提示：「这是本节的多页打印视图。点击此处打印。返回本页常规视图。」它只在屏幕上显示，不会印到纸上。
2. 栏目标题与摘要。
3. 整个栏目的目录，按层级编号为 `1:`、`2:`、`2.1:`，链接指向文档内的锚点。
4. 各个页面依次排列，标题写成「编号 - 标题」（例如「1 - 配置总览」），描述作为导语，正文原样呈现。

页面按侧栏顺序（`weight`）排列，子栏目就地展开。从第二个页面起，每页都从新的一张纸开始；第一个页面只有在栏目索引页自身正文超过 50 个词时才另起一页，免得只有一句话的索引页单独占一张纸。调整这个阈值：

```yaml {title="hugo.yml"}
params:
  print:
    section_break_wordcount: 120
```

全站去掉目录：

```yaml {title="hugo.yml"}
params:
  print:
    toc: false
```

或者只对某个栏目去掉，写在该栏目索引页的 front matter 里：

```yaml {title="content/docs/components/_index.zh.md"}
---
title: 组件
print:
  toc: false
---
```

## 把某些页面排除在外 {#exclude-pages}

有些页面印在纸上没有意义：只有链接的页面、一段跳转说明、一张巨大的截图。给它们设置 `no_print`：

```yaml {title="content/docs/about/showcase.zh.md"}
---
title: 示例站点
no_print: true
---
```

`no_print` 只影响整章打印视图，这一页本身仍然可以用 `Cmd/Ctrl+P` 打印。侧栏分隔项（`sidebar_divider`）会自动排除；但分隔项本身是分区时，它的子页面仍保留在打印顺序中。

## 组件在打印态的形态 {#components}

纸上的内容不能点击也不能展开，所以整章打印视图与浏览器打印单页遵循同一条规则：可交互的组件变成静态，折叠的内容全部展开。

| 组件 | 打印形态 |
| --- | --- |
| [提示块](/zh/docs/components/callout/) | 静态块，所有可折叠类型（`-` / `+` / `DETAILS`）全部展开；边框变灰，去掉底色 |
| [标签页](/zh/docs/components/tabs/) | 标签条消失，所有面板依次打印，每个面板带自己的标题 |
| [代码块](/zh/docs/components/code/) | 去掉复制与折叠按钮，取消最大高度与滚动，长行自动折行 |
| [表格](/zh/docs/components/table/) | 完整的静态表格；屏幕上的打印视图保留键盘滚动，纸上则完整展开，表头在每页重复 |
| [图片](/zh/docs/components/image/) | 保留图片与图注，去掉缩放，宽度限制在正文栏内 |
| [画廊](/zh/docs/components/gallery/) | 网格改为竖向堆叠 |
| [文件树](/zh/docs/components/filetree/) | 所有目录展开的静态面板；分栏布局保持构建时的宽度 |
| [参数表](/zh/docs/components/fields/) | 完整的定义列表，与屏幕上相同 |
| [公式](/zh/docs/components/math/) | 静态渲染的 KaTeX / MathML |
| [Mermaid](/zh/docs/components/mermaid/) | 打印视图保留源码，不加载引擎；浏览器打印的页面显示已渲染的图，尚未渲染时显示源码 |
| [Markmap](/zh/docs/components/markmap/) | 打印视图保留大纲源码，不加载运行时；浏览器打印的页面显示已渲染的导图（不含浮层注释），尚未挂载时显示源码 |
| [PlantUML](/zh/docs/components/plantuml/) | 打印视图保留源码，不加载运行时；浏览器打印的页面显示已渲染的图片，尚未渲染时显示源码 |
| [ECharts](/zh/docs/components/echarts/) · [Infographic](/zh/docs/components/infographic/) | 打印视图保留围栏源码，不绘制图表；浏览器打印的页面显示已渲染的图表，尚未挂载时显示声明的配置或 DSL |
| [Asciinema](/zh/docs/components/asciinema/) · [OpenAPI](/zh/docs/write/openapi/) | 一个带标题的静态链接，指向录像或规范；三套运行时都不加载 |
| 卡片 / 步骤 / 徽章 / 按键 | 静态呈现，内容不变 |

除了页面外壳，页面操作菜单、反馈组件、标题旁的锚点链接和行内复制按钮也不会打印。用浏览器打印含图表的页面前，先等图表绘制完成。

## 浏览器打印样式 {#print-css}

主题自带一组 `@media print` 规则，单页打印与整章打印共用，负责纸面排版：

- 纸张 `A4`，页边距 `18mm 16mm 20mm`，正文 10.5pt；即使读者在深色模式下浏览，也使用浅色配色。
- 字体使用 `--td-print-font-family` 排印令牌，见[品牌外观](/zh/docs/customize/brand/)。
- 标题不与后面的正文分开（`break-after: avoid-page`），段落与列表项在分页处至少保留三行在一起。
- 表格、图片、块引用、提示块、卡片与标签页尽量不跨页断开；代码块允许跨页，长行折行而不是被截断。
- 收起的 `<details>` 一律展开打印，折叠的提示块与文件树目录因此内容完整。
- 链接显示为深蓝色并带下划线，后面不打印 URL。读者需要在纸上看到地址时，自己加上：

```css {title="assets/css/project.css"}
@media print {
  .td-content a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 0.85em;
    word-break: break-all;
  }
}
```

其它打印样式也写在 `assets/css/project.css` 的 `@media print` 块中，不需要改模板。

## 复制到富文本编辑器 {#typeset-copy}

读者还会把文章复制到微信公众号、Word 或邮件里。复制文章的一部分并粘贴到富文本编辑器时，得到的是排好版的文本，配色与打印相同的浅色色板，不带页面背景、深色模式配色、标题锚点、复制按钮和行号。全选页面（<kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>A</kbd>）只复制文章本身：标题、描述与正文。

- 标题、列表、引用、提示块、表格与代码块保留结构，尺寸使用像素，不保留样式表的编辑器也能正确显示。
- 代码块保留语法着色。在深色模式下复制时，代码块仍是深色卡片，周围正文是白底深色字。
- 在一个段落内只选中几个词时，复制结果不带格式，沿用粘贴目标文档的样式。
- 以纯文本粘贴的结果不变。

要调整粘贴结果的外观，在 `assets/css/project.css` 中覆盖打印色板，例如 `--td-print-ink` 或 `--td-print-quote-line`。要保留浏览器原本的复制行为，全站设置 `rich_copy: false`，或在页面 front matter 中只为该页设置：

```yaml {title="hugo.yml"}
params:
  ui:
    rich_copy: false
```

每个编辑器过滤粘贴内容的方式都不一样，重要的文章请先在实际发布用的编辑器里检查一遍。

## 替换打印模板 {#customize-templates}

需要改结构时，例如加页眉、换编号格式，覆盖 `layouts/_partials/print/` 下范围最小的那个 partial：

| Partial | 负责 |
| --- | --- |
| `print/render.html` | 整章视图的骨架：提示、目录、按顺序排列的页面 |
| `print/page-heading.html` | 文档开头的标题与导语 |
| `print/content.html` | 单个页面在整章视图中的呈现 |
| `print/toc-li.html` | 目录中的一行 |

后三个还可以按内容类型单独覆盖：`print/page-heading-blog.html`、`print/content-book.html` 这样的文件，对该类型的页面优先于通用 partial。

整本书（`type: book`）走自己的打印路径，章节编号、图表编号与交叉引用在全书范围内连续，见[书籍出版](/zh/docs/write/book/)。

## 验证 {#verify}

在站点根目录构建，确认启用了 `print` 的栏目生成了打印视图。把示例路径换成该栏目实际的产物路径，有语言前缀时一并写上：

```bash
hugo --printPathWarnings
PRINT_PAGE=public/zh/_print/docs/index.html
test -f "$PRINT_PAGE"
```

然后在运行中的站点上打开 **打印完整章节**：

- 打印视图包含该栏目的页面，不含标记了 `no_print: true` 的页面。
- 按 `Cmd/Ctrl+P`，预览中没有提示、顶栏和按钮。
- 在含[标签页](/zh/docs/components/tabs/)与折叠提示块的页面上，预览中所有面板都已展开。
- 存成 PDF 后，分页落在合适的位置；不合适时调整 `section_break_wordcount`。

## 相关 {#related}

- [书籍出版](/zh/docs/write/book/) — 整本书的编号、索引与打印
- [组织内容](/zh/docs/write/organize/) — 打印顺序就是侧栏顺序
- [品牌外观](/zh/docs/customize/brand/) — 打印字体令牌
- [Agent 支持](/zh/docs/customize/agents/) — 另一种非 HTML 输出
- [配置总览](/zh/docs/customize/config/) — `outputs` 与 `params.print.*` 的完整定义
