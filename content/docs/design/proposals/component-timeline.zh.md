---
title: "Timeline 组件"
linkTitle: Timeline 组件
description: 用原生定义列表呈现正文中按日期或顺序排列的事件，不需要短代码，也没有运行时。
weight: 27
icon: fa-solid fa-timeline
search_keywords: [时间轴, timeline, 时间线, 里程碑, 故障复盘, postmortem, 议程, 定义列表, 组件]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] 已实现，等待接受
> 已在主题 main 分支的工作区中实现，并写入了[时间轴指南](/zh/docs/components/timeline/)。尚未提交，也未发布。共同决策见[总览](/zh/docs/design/proposals/content-components-expansion/)。

| 记录 | 内容 |
| --- | --- |
| 状态 | 2026-11-27 实现；尚未提交；等待接受 |
| 负责人 | OINK 维护者 |
| 交付阶段 | S1，与 [Update](/zh/docs/design/proposals/component-update/) 同批 |
| 形态 | 原生：Markdown 定义列表后接 `{.timeline}` |
| 新增公共 API | 作者标记 `.timeline`；不新增短代码、属性或配置键 |
| 运行时 | 无 |
| 影响面 | 组件契约、一个新的样式表层、位于 `/docs/components/timeline/` 的新指南 |

## 概要 {#summary}

时间轴是一串成对的条目：一个标记（日期、时刻、版本号、“Day 2”）加上当时发生的事。Markdown 本来就有表达成对内容的结构，即定义列表。OINK 把带 `{.timeline}` 的定义列表渲染成一条纵向轴线，分为标记列和事件列。除此之外不新增任何东西。

```markdown
2024-05
: **First prototype.** The theme renders its own documentation.

2025-08
: **Markdown-first authoring.** Native forms replace most shortcodes.

2026-11
: **Plain CSS.** The stylesheet needs nothing but the Hugo binary.
{.timeline}
```

## 问题 {#problem}

正文页面经常按顺序叙述事件：故障复盘、项目里程碑、产品历史、会议议程、人物生平。作者目前的写法是带粗体日期的无序列表、表格、`steps`（其自动生成的编号会曲解原意）或原始 HTML。这些写法都不能把时间呈现为可视的轴线，也都没有稳定的结构。

视觉语法其实已经存在。Landing 的 `timeline` 区块（`layouts/_partials/landing/sections/timeline.html`）在轴线上渲染日期、标题和描述，但只能读取落地页上的 Landing 数据，正文用不到它。

## 设计原则 {#principles}

1. **结构是成对的。** 每个条目恰好由一种标记和一段正文组成。定义列表直接编码了这种结构（`<dt>`/`<dd>`）；首词加粗的无序列表只是在模仿。
2. **原生优先。** [Markdown 优先决策](/zh/docs/design/decisions/authoring/#decision)规定，只要 Goldmark 能保留含义，就优先采用原生形态。这里可以：Goldmark 会把 class 加到 `<dl>` 上，每个定义也能保留完整的块级内容。
3. **标记是自由文本。** “2024-05”“09:02”“v1.6.0”“Day 2”和“Q3 2026”都是合法标记。组件不解析日期，因此绝不会拒绝现实中的任何标记。
4. **统一的视觉语法。** 正文时间轴与 Landing 区块使用同一套轴线、节点和标记列词汇，只是改用文章 token 来表达。

## 目标与非目标 {#goals}

### 目标 {#goals-list}

- 用普通 Markdown 在 HTML 中得到易读的时间轴线。
- 事件正文可以很丰富：段落、列表、代码、图片、提示块。
- Print、RSS、Markdown 和 LLMS 中含义一致，且不新增输出分支。
- 零 JavaScript，零配置。

### 非目标 {#non-goals}

- `timeline`/`event` 短代码组合，以及以参数形式提供的逐事件图标、色调、徽章或链接。
- 日期解析、排序、按年分组或相对时间（“3 天前”）。
- 横向、可缩放或甘特图式的时间轴（排期类需求可以用 Mermaid 已有的甘特图和时间线图）。
- 让条目进入页面大纲；那是 [Update](/zh/docs/design/proposals/component-update/) 组件的职责。
- 取代 Landing 的 `timeline` 区块或 `steps`。

## 提议行为 {#design}

### 创作 {#authoring}

- 每个术语（不以冒号开头的行）就是一个标记。术语是单行的行内 Markdown，建议使用纯文本。
- 每个定义（`: …`）是一段事件正文。续行段落、列表和围栏按普通定义的规则缩进。
- 一个标记可以带多个定义，它们渲染为同一标记下的连续事件。
- `{.timeline}` 必须写在最后一个定义的下一行，中间不能有空行。与所有 Goldmark 块属性一样，空行会让它脱离列表，作者标记随之静默丢失；指南会在示例旁说明这一点。
- 事件标题按惯例写成开头的一段粗体短语。这只是写作约定，不是语法。

原生形态依赖 Goldmark 定义列表（`markup.goldmark.extensions.definitionList`），Hugo 默认启用。组件契约的前置条件列表将补上这一行。

### 渲染 {#rendering}

HTML 结构由 Goldmark 生成；主题只添加 CSS，并把作用域限定在 `.td-content dl.timeline`，以免与站点中无关的 `.timeline` 规则冲突：

| 条件 | 布局 |
| --- | --- |
| 宽栏 | 两列网格：标记列按内容定宽并设上限（约 10rem），另一列为事件列。轴线沿事件列的起始边延伸，每个标记所在行上有一个节点 |
| 窄栏 | 单列：标记位于正文上方，轴线和节点位于起始边 |
| Ink、Terminal | 平面表面；方形节点；标记使用等宽字体和表格数字（tabular numerals） |
| 强制颜色 | 轴线和节点使用系统颜色；不靠颜色传达含义 |
| Print | 轴线呈现为细边框；无背景；短条目避免内部分页 |
| RTL | 逻辑属性使轴线镜像 |
| 长词 | 标记换行，不撑宽标记列 |

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML | Goldmark 生成的 `<dl class="timeline">`，样式由主题提供；无运行时 |
| Print | 同一份 HTML 结构，加上打印规则 |
| Markdown / LLMS | 作者编写的源码（原生形态保留源码） |
| RSS | 按渲染结果输出的 `<dl>`；feed 阅读器显示术语和定义 |

### 无障碍 {#accessibility}

屏幕阅读器按源码顺序播报定义列表中的术语/定义对。标记是文本，因此任何信息都不依赖轴线图形；这些图形只是装饰性的伪元素。

## 权衡与备选方案 {#alternatives}

| 方案 | 决定 | 理由 |
| --- | --- | --- |
| 初稿中的 `timeline` + `event` 短代码，带 `time`、`title`、`badge`、`icon`、`tone`、`link` | 第一阶段否决 | 两个短代码加一个父子收集器，换来的是装饰，而不是缺失的能力。纯文本 `title` 参数不如 Markdown 正文，而且 Markdown 输出还得另行合成 |
| 带粗体日期并加 `{.timeline}` 的无序列表 | 否决 | 标记在结构上不独立；CSS 将依赖 `li > p:first-child > strong:first-child`，条目换一种开头就会失效 |
| `steps` 变体 | 否决 | 步骤会生成编号；时间轴标记是作者写下的文本 |
| 通过数据文件复用 Landing 区块 | 正文场景否决 | 每条时间轴一个数据文件，会把正文移出页面。改为共享视觉 token |
| `<ol>` 语义 | 未采用 | 有序列表能传达顺序，但表达不了标记/正文的成对关系。`<dl>` 中的顺序同样是源码顺序 |

所选形态的代价：

- 定义列表语法不如无序列表常见。指南开头先给出可复制的示例。
- GitHub 和部分编辑器不渲染定义列表。即便如此，源码读起来仍是一行标记后接若干 `: event` 行。
- 无法为单个事件添加装饰。如果有证据表明确有需要，后续提案可以增加完整形态；原生形态仍是主要形态。

## 兼容性 {#compatibility}

纯增量变更。主题目前没有赋予 `.timeline` 任何含义。对本地消费者站点的扫描发现，只有一个站点样式表用到 `.timeline`，且限定在该站点自己的应用 class 之下，因此带作用域的主题选择器不会与它冲突。

## 实现计划 {#implementation}

1. 新增一个样式表层（例如 `assets/css/td/timeline.css`），并在 `layouts/_partials/css/layers.html` 中把它列在 RTL、预设、无障碍和打印层之前。
2. 在 `tests/site/` 中添加一个夹具页面，覆盖每个标记带单个和多个定义、丰富正文、含长词的标记，以及 RTL 页面；用 `bin/check-goldens.py --update` 记录 HTML、Print、Markdown 和 RSS golden。
3. 归属检查器：`bin/check-stylesheets.py`、`bin/check-goldens.py` 和 `hugo --source tests/site --printPathWarnings`。
4. 更新双语[组件契约](/zh/docs/design/components/#steps-cards-fields-and-tables)（原生形态与前置条件），并新增 EN/ZH 指南及速查表中的对应行。
5. 在本站评审：四种预设、浅色与深色、桌面与移动端、RTL、强制颜色和浏览器打印。

## 验收标准 {#acceptance}

- 带 `{.timeline}` 的定义列表无须修改模板、无须运行时即可渲染出轴线布局。
- Markdown 与 LLMS 输出与作者源码完全一致。
- 不带该作者标记的定义列表渲染结果与之前完全相同。
- 所有预设、两种配色方案、窄屏、RTL、强制颜色和打印的评审全部通过。

## 待决问题 {#open-decisions}

1. **标记列宽度。** 建议：按内容定宽并设上限。像 Landing 区块那样使用固定宽度，对齐效果更好，但会截断“Q3 2026 – Q1 2027”。
2. **紧凑修饰类。** 建议：S1 不提供；只有夹具显示确有需要时，才增加 `{.timeline .td-timeline-compact}`。
3. **与 Landing 共享 CSS。** 建议：共享 token 和比例，不共享选择器；两种场景的容器不同。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）。** `timeline`/`event` 短代码，外加 `.timeline` 列表标记。
- **2026-11-27（评审）。** 只保留原生定义列表；第一阶段移除短代码、图标、色调和徽章。
- **2026-11-27（实现）。** 按设计实现：`assets/css/td/timeline.css`（标记列按内容定宽，并以 `fit-content(10rem)` 设上限）、在 `bin/check-namespace.py` 中登记 `.timeline` 作者标记，以及带 HTML、Markdown 与 Print golden 的 `timeline-update` 夹具。
