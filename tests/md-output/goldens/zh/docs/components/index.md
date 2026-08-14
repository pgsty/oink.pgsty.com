# 组件参考

> 写文档时可用的全部组件，按使用频率排列。

---

LLMS index: [llms.txt](/zh/llms.txt)

---

OINK 的组件分两类：**每天都会用到的写作原语**，和特定场景才需要的大型组件。跨多个页面的完整出版工作流位于[场景组件](/zh/docs/scenarios/)。

所有组件都遵循同一套契约：语义化 HTML、非交互组件不加载 JavaScript、在打印和 Markdown 输出下都有明确的呈现方式、参数非法时构建直接失败而不是静默降级。

## 日常写作 {#everyday}

| 组件                             | 用途                            | 需要 JS        |
| -------------------------------- | ------------------------------- | -------------- |
| [代码块与代码分组](code-blocks/) | 文件名、复制、折叠、同步标签页  | 有代码块的页面 |
| [Badge](badge/)                  | Beta、Deprecated 之类的状态标签 | 否             |
| [Kbd](kbd/)                      | 键盘快捷键                      | 否             |
| [Fields](fields/)                | 配置项、参数、返回字段说明      | 否             |
| [FileTree](filetree/)            | 目录结构                        | 否             |

## 媒体 {#media}

| 组件                    | 用途                 | 需要 JS        |
| ----------------------- | -------------------- | -------------- |
| [Gallery](gallery/)     | 多图网格             | 复用缩放运行时 |
| [图片缩放](image-zoom/) | 点击放大截图与架构图 | 启用时按页加载 |

## 版式与结构 {#layout}

| 组件                             | 用途                             |
| -------------------------------- | -------------------------------- |
| [Tabs、Cards、Steps 等](layout/) | 标签页、卡片、步骤、折叠块、轮播 |

## 图表与可视化 {#visualization}

| 组件                        | 用途                              | 运行时   |
| --------------------------- | --------------------------------- | -------- |
| [图表与公式](diagrams/)     | Mermaid、KaTeX、Markmap、PlantUML | 按页加载 |
| [ECharts](echarts/)         | 交互式数据图表                    | 按页加载 |
| [Infographic](infographic/) | 流程与信息图                      | 按页加载 |

## 场景工作流 {#scenario-workflows}

| 场景                                     | 协同能力                          |
| ---------------------------------------- | --------------------------------- |
| [顺序阅读](../scenarios/reading/)        | 翻页顺序、head 关系、本地数学公式 |
| [版本发布与下载](../scenarios/releases/) | 事实、校验和、滚动/固定渠道       |
| [Landing 页面](../scenarios/landing/)    | 全宽外壳、本地数据、21 种分区     |
| [Book 出版](../scenarios/book/)          | 编号媒体、xref、索引、整本打印    |

这些场景会把多个原语与导航、数据和输出规则组合起来。对应页面是采用场景时的权威指南，不要只看一个 shortcode 示例就推断完整场景契约。

## 共同约定 {#shared-contract}

- 使用标准短代码写法 `{{< … >}}`
- 嵌套名称（`filetree/folder`、`gallery/image`、`field`）只能出现在对应父组件内部
- 参数非法会中断构建，并报出源码位置——严格失败优于静默降级
- 只有 Fields 的描述接受 Markdown，其余公开字符串参数一律按纯文本处理
- 页面没用到的组件，其运行时不会被下发

---

Section pages:

- [代码块与代码组](/zh/docs/components/code-blocks/): 为 Hugo 代码示例添加文件名、精确复制、换行、折叠与可分享的代码组。
- [Badge](/zh/docs/components/badge/): 使用紧凑的语义状态标签，无需自定义颜色或 JavaScript。
- [Kbd](/zh/docs/components/kbd/): 使用具备无障碍语义的静态按键序列编写快捷键。
- [Fields 与 Field](/zh/docs/components/fields/): 使用响应式语义 HTML 描述配置、参数、属性与响应字段。
- [FileTree](/zh/docs/components/filetree/): 使用语义化渐进展开列表展示仓库与目录结构。
- [Gallery](/zh/docs/components/gallery/): 使用响应式静态网格组织相关图片，并可复用 Image Zoom。
- [Image Zoom](/zh/docs/components/image-zoom/): 使用可选的原生对话框查看有意义的独立图片细节。
- [短代码](/zh/docs/components/layout/): 安全、无障碍地使用 OINK 的本地优先内容组件。
- [图表与公式](/zh/docs/components/diagrams/): 在页面中添加本地图表、思维导图与科学公式。
- [Apache ECharts](/zh/docs/components/echarts/): 使用结构化 JSON 或 YAML 创建响应式、本地优先图表。
- [使用 AntV 创建信息图](/zh/docs/components/infographic/): 把简洁的声明式数据转换成本地 SVG 信息图。
