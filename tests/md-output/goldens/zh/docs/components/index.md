# 组件参考

> 写文档时可用的全部组件，按使用频率排列。

---

LLMS index: [llms.txt](/zh/llms.txt)

---

OINK 的组件分两类：**每天都会用到的写作原语**，和特定场景才需要的大型组件。跨多个页面的完整出版工作流位于[场景组件](/zh/docs/scenarios/)。

大多数组件都是 **Markdown 原生** 的：一个普通块，加上 `{.steps}` 之类的标记或
`{tab="npm"}`
之类的属性行，在 GitHub 和任何 Markdown 编辑器里都可读。只有普通块表达不了内容时才保留短代码。所有组件都遵循同一套契约：语义化 HTML、非交互组件不加载 JavaScript、在打印和 Markdown 输出下都有明确的呈现方式、参数非法时构建直接失败而不是静默降级。

## 日常写作 {#everyday}

| 组件                           | 形态                                       | 用途                            | 需要 JS        |
| ------------------------------ | ------------------------------------------ | ------------------------------- | -------------- |
| [Callouts](layout/#callouts)   | `> [!TYPE] 标题` 块引用                    | 说明、提示、警告、可折叠细节    | 否             |
| [代码块与标签页](code-blocks/) | 围栏属性 `{title= copy= tab=}`             | 文件名、复制、折叠、同步标签页  | 有代码块的页面 |
| [Badge](badge/)                | `{{< badge >}}`                        | Beta、Deprecated 之类的状态标签 | 否             |
| [Kbd](kbd/)                    | `{{< kbd >}}` 或原始 `<kbd>`           | 键盘快捷键                      | 否             |
| [Fields](fields/)              | 表格 + `{.fields}` 或 `{{< fields >}}` | 配置项、参数、返回字段说明      | 否             |
| [表格](tables/)                | `{.matrix}` `{caption=}` `{.full-width}` … | 矩阵、标题、编号与标签页表格    | 仅标签页表格   |
| [FileTree](filetree/)          | 嵌套列表 + `{.filetree}`                   | 目录结构                        | 否             |

## 媒体 {#media}

| 组件                          | 形态                                              | 用途                   | 需要 JS        |
| ----------------------------- | ------------------------------------------------- | ---------------------- | -------------- |
| [图片与图片缩放](image-zoom/) | `![alt](src)` + `{caption=}`、`{{< image >}}` | 图注、处理型预览、放大 | 启用时按页加载 |
| [Gallery](gallery/)           | 图片列表 + `{.gallery}`                           | 多图网格               | 复用缩放运行时 |

## 版式与结构 {#layout}

| 组件                                    | 形态                                                                                     | 用途                             |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------- |
| [Callouts、标签页、步骤与卡片](layout/) | `{.steps}` `{.cards}` 列表、`{{< tabs >}}`、`{{< cards >}}`、`{{% steps %}}` | 标签页、步骤序列、卡片网格、引入 |

## 图表与可视化 {#visualization}

| 组件                        | 形态                                       | 用途                              | 运行时   |
| --------------------------- | ------------------------------------------ | --------------------------------- | -------- |
| [图表与公式](diagrams/)     | `mermaid` `math` `markmap` `plantuml` 围栏 | Mermaid、KaTeX、Markmap、PlantUML | 按页加载 |
| [ECharts](echarts/)         | `echarts` 围栏                             | 交互式数据图表                    | 按页加载 |
| [Infographic](infographic/) | `infographic` 围栏                         | 流程与信息图                      | 按页加载 |

## 场景工作流 {#scenario-workflows}

| 场景                                     | 协同能力                              |
| ---------------------------------------- | ------------------------------------- |
| [顺序阅读](../scenarios/reading/)        | 翻页顺序、head 关系、本地数学公式     |
| [版本发布与下载](../scenarios/releases/) | 事实、`checksums` 围栏、滚动/固定渠道 |
| [Landing 页面](../scenarios/landing/)    | 全宽外壳、本地数据、21 种分区         |
| [Book 出版](../scenarios/book/)          | 编号媒体、xref、索引、整本打印        |

这些场景会把多个原语与导航、数据和输出规则组合起来。对应页面是采用场景时的权威指南，不要只看一个 shortcode 示例就推断完整场景契约。

## 共同约定 {#shared-contract}

- 原生形态使用紧跟在块下一行的 Goldmark 块属性（`{.steps}`、`{tab="…"}`）；站点需启用
  `attribute.block` 与 `renderer.unsafe`。
- `{{% steps %}}` 是唯一的 `{{% %}}` 短代码；其余短代码一律使用
  `{{< … >}}`，并自行渲染 Markdown 正文。嵌套名称（`tab`、`card`、`field`）只能出现在对应父组件内部。
- 参数或属性非法会中断构建，并报出源码位置——严格失败优于静默降级。`style`
  与事件处理器永远不被接受；`class`、`data-*` 与 `aria-*` 透传。
- 公开的字符串参数（标题、标签、说明）是纯文本；只有 Markdown
  _正文_（tab、card、field、image 图注）才是 Markdown。
- 页面没用到的组件，其运行时不会被下发。

---

Section pages:

- [代码块与标签页](/zh/docs/components/code-blocks/): 为 Hugo 代码示例添加标题、精确复制、换行、折叠与可分享的标签页。
- [Badge](/zh/docs/components/badge/): 使用紧凑的语义状态标签，无需自定义颜色或 JavaScript。
- [Kbd](/zh/docs/components/kbd/): 使用具备无障碍语义的静态按键序列编写快捷键。
- [Fields 与 Field](/zh/docs/components/fields/): 使用响应式语义 HTML 描述配置、参数、属性与响应字段。
- [表格](/zh/docs/components/tables/): 在普通 Markdown 表格下方加一行属性，即可选择表格种类——参考列表、兼容矩阵、带标题、带编号、标签页或全宽。
- [FileTree](/zh/docs/components/filetree/): 用一个普通的嵌套 Markdown 列表展示带注释的仓库与目录结构。
- [Gallery](/zh/docs/components/gallery/): 用响应式静态网格排列相关图片，并复用图片缩放。
- [图片与图片缩放](/zh/docs/components/image-zoom/): 用普通 Markdown 写图片，添加图注与处理型预览，并让读者在原生对话框中查看大图。
- [Callouts、标签页、步骤与卡片](/zh/docs/components/layout/): 用 Markdown 原生的 callout、标签页、步骤、卡片以及少数保留短代码组织页面结构。
- [图表与公式](/zh/docs/components/diagrams/): 在页面中添加本地图表、思维导图与科学公式。
- [Apache ECharts](/zh/docs/components/echarts/): 用 echarts 围栏中的结构化 JSON 或 YAML 创建响应式、本地优先图表。
- [使用 AntV 创建信息图](/zh/docs/components/infographic/): 把 infographic 围栏中简洁的声明式数据转换成本地 SVG 信息图。
