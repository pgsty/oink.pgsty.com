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

单页打印不需要配置：外壳（侧栏、目录、顶栏、按钮）都带 `d-print-none`，浏览器的 `Cmd/Ctrl+P` 得到的是一份干净的正文。主题因此没有页面级的「打印本页」按钮。

需要配置的是另一件事：把一整个栏目（或一整本书）连同全部子页面合成一份带目录的连续文档。以下内容覆盖启用方式、打印视图的结构，以及排除页面的做法。

## 启用整章打印 {#enable}

`print` 是主题声明的自定义输出格式，主题不替站点打开它。在站点自己的 `hugo.yml` 里给 `section` 加上：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

这是本站的配置。`outputs` 的每个键是 **整体替换** 而不是合并：加 `print` 时要把该类型原本有的格式（`HTML`、`RSS`、`markdown`）一起写全，漏一个就丢一种输出。

开启后，每个栏目多出一个 URL。路径段 `_print` 在最前面，语言前缀之后：

| 页面 | 打印视图 |
| --- | --- |
| `/zh/docs/customize/` | [`/zh/_print/docs/customize/`](/zh/_print/docs/customize/) |
| `/zh/docs/` | `/zh/_print/docs/` |
| `/zh/blog/release/` | `/zh/_print/blog/release/` |

页面操作菜单里同时出现「打印完整章节」，命令面板里也能搜到同一条（操作 ID `print_section`）。它打印的是 **当前栏目**：在 `/zh/docs/customize/print/` 这页点它，得到的是整个「定制站点」栏目，不是这一页。

## 打印视图的结构 {#anatomy}
打开上面任意一个链接，从上到下是：

1. 一条提示条：「这是本节的多页打印视图。点击此处打印。返回本页常规视图。」它带 `d-print-none`，只在屏幕上出现，不进纸。
2. 栏目标题与摘要。
3. 全栏目目录，条目编号是 `1:`、`2:`、`2.1:` 这样的层级号，链接指向文档内的锚点。
4. 每个页面依次排列，标题变成 `1 - 配置总览` 这种「编号 - 标题」，描述作为导语，正文原样渲染。

页面顺序是侧栏顺序（`weight`），子栏目递归展开。第二页起每页都另起一页；第一页是否另起一页，取决于栏目首页自己的正文是否超过 50 个词：首页只有一句话时不单独占一张纸。阈值可以调整：

```yaml {title="hugo.yml"}
params:
  print:
    section_break_wordcount: 120
```

不需要那份目录：

```yaml {title="hugo.yml"}
params:
  print:
    toc: false
```

也可以只对某个栏目关闭，写在栏目首页 front matter 里：

```yaml {title="content/docs/components/_index.zh.md"}
---
title: 组件
print:
  toc: false
---
```

## 把某些页面排除在外 {#exclude-pages}

纯链接页、只有一段跳转说明的页、体积巨大的截图页进纸意义不大。给它们写 `no_print`：

```yaml {title="content/docs/about/showcase.zh.md"}
---
title: 示例站点
no_print: true
---
```

它只影响整章打印视图，页面自己的 HTML 与浏览器 `Cmd/Ctrl+P` 不受影响。侧栏分隔项（`sidebar_divider`）也自动排除。

## 组件在打印态的形态 {#components}

打印是四态输出之一，每个组件都有确定的打印形态。整章打印视图与浏览器打印单个页面，规则一致：**能交互的降级成静态，可折叠的一律展开**。

| 组件 | 打印形态 |
| --- | --- |
| [提示块](/zh/docs/components/callout/) | 静态块，折叠型（`-` / `+` / `DETAILS`）全部展开；边框转灰、去底色 |
| [标签页](/zh/docs/components/tabs/) | 标签条消失，所有面板依次展开，每个面板带自己的标题 |
| [代码块](/zh/docs/components/code/) | 去掉复制与展开按钮，取消最大高度与滚动，长行改为自动折行 |
| [表格](/zh/docs/components/table/) | 满宽静态表，取消横向滚动；表头在跨页时重复 |
| [图片](/zh/docs/components/image/) | 图与图注保留，缩放相关的属性被剥掉，宽度收进版心 |
| [画廊](/zh/docs/components/gallery/) | 网格改为竖排堆叠 |
| [文件树](/zh/docs/components/filetree/) | 静态面板，目录全部展开，分栏停在构建期宽度 |
| [参数表](/zh/docs/components/fields/) | 完整定义列表，两种形态一致 |
| [公式](/zh/docs/components/math/) | 静态渲染的 KaTeX / MathML |
| [Mermaid](/zh/docs/components/mermaid/) · [Markmap](/zh/docs/components/markmap/) · [PlantUML](/zh/docs/components/plantuml/) | 照常渲染成图：打印视图仍是一张 HTML 页，这几个运行时照常加载 |
| [ECharts](/zh/docs/components/echarts/) · [Infographic](/zh/docs/components/infographic/) | 降级成围栏源码块，不渲染图表 |
| [Asciinema](/zh/docs/components/asciinema/) · [OpenAPI](/zh/docs/write/openapi/) | 一行带标题的静态链接，录像或规范地址可见；三套运行时都不加载 |
| 卡片 / 步骤 / 徽章 / 按键 | 静态呈现，内容不变 |

页面外壳不进纸：侧栏、目录、顶栏、页面操作菜单、反馈组件、标题旁的锚点链接、行内复制按钮。

上表里靠浏览器端运行时绘制的那三种图（Mermaid、Markmap、PlantUML），触发打印前要确认它们已经绘制完成。

## 浏览器打印样式 {#print-css}

主题自带一层 `@media print` 规则，单页打印与整章打印共用：

- 纸张 `A4`，页边距 `18mm 16mm 20mm`；正文 `10.5pt`，强制浅色配色。
- 字体切到 `--td-print-font-family` 这个排印令牌，见[品牌外观](/zh/docs/customize/brand/)。
- 标题不与正文分家（`break-after: avoid-page`），段落与列表项保留 3 行孤行 / 寡行控制。
- 表格、图片、块引用、提示块、卡片、标签页尽量不跨页断开；代码块允许跨页，但会自动折行而不是截断。
- 链接加下划线、转深蓝色，不会在链接后面打印出 URL 文本。需要这个行为的站点自己加：

```scss {title="assets/scss/_styles_project.scss"}
@media print {
  .td-content a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 0.85em;
    word-break: break-all;
  }
}
```

- 收起的 `<details>` 一律展开：折叠的提示块与文件树目录在纸上是完整的。

自定义排版写在 `assets/scss/_styles_project.scss` 的 `@media print` 块里，不需要改模板。

## 替换打印模板 {#customize-templates}

需要改结构（例如给每页加页眉、换编号格式）时，覆盖最窄的那个 partial，都在 `layouts/_partials/print/` 下：

| Partial | 负责 |
| --- | --- |
| `print/render.html` | 整章视图的骨架：提示条、目录、递归内容 |
| `print/page-heading.html` | 文档开头的标题与导语 |
| `print/content.html` | 单个页面在整章视图里的呈现 |
| `print/toc-li.html` | 目录里的一行 |

后三个支持 **按内容类型** 分化：建 `print/page-heading-blog.html`、`print/content-book.html`，主题会优先用带类型后缀的那个。

整本书的打印（`type: book`）走另一条路径：章节编号、图表编号与交叉引用都保持全书连续，见[书籍出版](/zh/docs/write/book/)。

## 验证 {#verify}

```bash
hugo -d public
ls public/zh/_print/docs/          # 每个栏目一个目录
```

再看页面：

- 浏览器打开 `/zh/_print/docs/customize/`，确认目录条数等于栏目页数（减去 `no_print: true` 的页）。
- 在这个视图里按 `Cmd/Ctrl+P`，打印预览里应当看不到提示条、顶栏与任何按钮。
- 找一页含标签页与折叠提示块的（例如[标签页](/zh/docs/components/tabs/)），确认预览里所有面板都展开。
- 打印一份 PDF 通读分页情况，阈值不合适时调整 `section_break_wordcount`。

## 相关 {#related}

- [书籍出版](/zh/docs/write/book/) — 整本书的编号、索引与打印
- [组织内容](/zh/docs/write/organize/) — 打印顺序就是侧栏顺序
- [品牌外观](/zh/docs/customize/brand/) — 打印字体令牌
- [Agent 支持](/zh/docs/customize/agents/) — 另一种非 HTML 输出
- [配置总览](/zh/docs/customize/config/) — `outputs` 与 `params.print.*` 的完整定义
