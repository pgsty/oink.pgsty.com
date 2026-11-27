---
title: "Update 组件"
linkTitle: Update 组件
description: 把更新日志条目写成带 .update 标记、附有日期与标签的普通标题，使每个条目无需短代码即可进入大纲、搜索与 Print。
weight: 27
icon: fa-solid fa-clock-rotate-left
search_keywords: [update, 更新日志, 最新动态, 发布说明, 标题属性, Mintlify Update, 组件]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] 已实现，等待发布
> 已在主题 `main` 分支中实现，并写入了[更新指南](/zh/docs/components/update/)。尚未包含在发布标签中。共同决策见[总览](/zh/docs/design/proposals/content-components-expansion/)。

| 记录 | 内容 |
| --- | --- |
| 状态 | 2026-11-27 在 `main` 实现；等待发布 |
| 负责人 | OINK 维护者 |
| 交付阶段 | S1，与 [Timeline](/zh/docs/design/proposals/component-timeline/) 同批 |
| 形态 | 原生形态：带 `{.update date="…" tags="…"}` 的 Markdown 标题 |
| 新增公共 API | 作者标记 `.update`，以及 `date`、`tags` 两个标题属性 |
| 运行时 | 无 |
| 受影响面 | `layouts/_markup/render-heading.html`、组件契约、一个样式表层，以及位于 `/docs/components/update/` 的新指南 |

## 概要 {#summary}

更新条目就是一个标题。加上 `.update` 标记后，条目会多出一行元数据，包含机器可读的日期与中性的标签 chip，并由此获得自己的视觉节奏。条目仍是普通标题，因此照常进入 TOC，保留自链接、键盘标题导航与搜索小节，并在多页 Print 中获得命名空间——这一切都无需任何新机制。

```markdown
## v1.6.0 — Plain CSS stylesheets {.update date="2026-11-23" tags="Breaking, Performance"}

Stylesheets now assemble from plain CSS layers with only the Hugo binary.

### Highlights {#v1-6-0-highlights}

- SCSS hooks retired in favor of `assets/css/project.css`.
- Bootstrap JavaScript removed.

## Unreleased {.update}

Work merged after the latest tag.
```

## 问题 {#problem}

单页更新日志、「最新动态」页面、周报与政策变更记录，本质上都是一串带日期的小节。如今作者的写法是先写标题，再随手补一行日期和几枚徽章。这样的日期没有 `<time>` 语义，每个站点各自发明一套版式，而写进标题的徽章还会泄漏到 TOC 和锚点中。

Mintlify 的 `<Update>` 说明了这类需求的存在。OINK 已有 `layout: releases`，但它服务另一种场景：每个 GitHub 发布对应一个内容页面，拥有自己的 URL、订阅项与资产。产品若想在一个页面上呈现一条可读的更新流，目前没有组件可用。

## 设计原则 {#principles}

1. **条目就是标题。** 属于大纲是它的本质属性；标题已经具备的一切能力都必须继续有效。
2. **原生优先。** 标题渲染钩子已经能收到块属性；探查已确认 `class`、`date` 与 `tags` 原样传入，TOC 也只显示标题文本。
3. **页面即权威。** 更新页面是其自身条目的事实来源。已有发布页面的版本不在这里再描述一遍，这遵循[事实不藏在呈现字符串里](/zh/docs/design/decisions/authoring/#decision)的规则。
4. **不与 TOC 争抢。** docs 外壳已经在右侧栏显示大纲，并跟踪滚动位置。

## 目标与非目标 {#goals}

### 目标 {#goals-list}

- 用普通 Markdown 标题写出带日期与标签的条目。
- TOC、锚点、自链接、键盘导航、搜索小节、Print 命名空间与脚注全部保持不变。
- 在 Print、RSS、Markdown 与 LLMS 中含义完全一致。
- 零 JavaScript，零配置。

### 非目标 {#non-goals}

- `{{%/* update */%}}` 短代码、容器或两栏粘性侧栏。
- 独立的 `label` 与 `title` 字段、`level` 参数或 `link` 参数；标题文本、标题级别与正文已经表达了它们。
- 标签颜色词表（例如「breaking」→ 红色）。
- 条目级 URL、订阅项或 GitHub 发布绑定；这些属于 `layout: releases`。
- 从数据生成条目、排序或筛选。

## 提议行为 {#design}

### 创作 {#authoring}

| 属性 | 规则 | 无效输入 |
| --- | --- | --- |
| `.update` | 作者标记，可用于任意级别的标题；条目通常用 `##` | — |
| `date` | 可选。字符串 `YYYY`、`YYYY-MM` 或合法日历 `YYYY-MM-DD` | 非字符串或无效日历日期告警并丢弃日期；条目与有效标签保留 |
| `tags` | 可选。`,` 或 `，` 分隔的纯文本字符串；各项去除首尾空白，跳过空项 | 非字符串值告警并丢弃标签 |
| `id` | 沿用现有标题规则；版本条目建议显式写出 `#id` | 沿用现有行为 |

不带 `.update` 的标题上出现 `date` 与 `tags` 时，会告警并被丢弃。这本就是标题钩子对不支持属性的现有规则，因此无需新增诊断路径。没有日期的条目（例如「Unreleased」）同样有效。

标题文本同时充当条目的 label 与 title：`## v1.6.0`、`## v1.6.0 — Plain CSS stylesheets` 或 `## 2026-11 weekly notes`。条目内的子小节是普通的低一级标题，在 TOC 中嵌套于该条目之下。

### 渲染 {#rendering}

```html
<h2 id="v160--plain-css-stylesheets" class="update">v1.6.0 — Plain CSS stylesheets<a class="td-heading-self-link" …></a></h2>
<div class="td-update-meta"><time datetime="2026-11-23">2026-11-23</time><span class="td-update-sep">, </span><span class="td-update-tag">Breaking</span><span class="td-update-sep">, </span><span class="td-update-tag">Performance</span></div>
```

元数据行位于标题之后，而不在标题内部，因此标题文本、无障碍名称、自链接与搜索小节标题都保持干净。日期直接显示作者写下的 ISO 字符串，它在所有语言区域中都已与 OINK 的默认日期格式一致。

样式限定在文章范围内：

- 条目标题上方增加额外间距，并加一条分隔线，为长更新流提供节奏。
- 日期使用元信息字体与等宽数字。
- 标签是与徽章共用几何形状的中性 chip，颜色由各预设决定。
- Ink 与 Terminal 保持扁平、直角的几何形状；强制颜色模式使用系统颜色；打印时去掉背景，保留分隔线。

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML | 标题加元数据行；无运行时 |
| Print | 同上；多页 Print 像处理其他标题一样，为标题 ID 加上命名空间 |
| Markdown / LLMS | 作者书写的源码，包括属性块 |
| RSS | 标题加元数据行，以静态 HTML 输出 |

### 如何在 Update 与发布页面之间选择 {#boundary}

| 需求 | 使用 |
| --- | --- |
| 在一个页面上呈现一条可读的更新流 | `.update` 标题 |
| 每个版本一个页面，拥有独立 URL 与订阅项、发布资产和 GitHub 绑定 | `layout: releases` |
| 嵌在其他正文中的简短日期序列 | [Timeline](/zh/docs/design/proposals/component-timeline/) |

## 权衡与备选方案 {#alternatives}

| 方案 | 决定 | 理由 |
| --- | --- | --- |
| 初稿的 `{{%/* update label date title tags level id link */%}}`，配两栏粘性侧栏 | 否决 | 它在 Hugo 中可行（输出标题的百分号短代码确实会进入 TOC），但七个参数重复编码了标题语法已经表达的内容；label 必须转义后才能写入生成的 Markdown；Markdown 输出需要另行合成；而且它会成为继 `steps` 之后的第二个百分号短代码 |
| 粘性侧栏本身 | 否决 | 在 docs 外壳中，左侧导航、右侧 TOC 再加一条侧栏，留给代码和表格的宽度只剩约 38rem，而且侧栏重复了 TOC 已在跟踪的内容。`position: sticky` 还要求为每个条目加一层包裹元素，因此侧栏必然要求短代码 |
| 一个内含标题的 `{{%/* updates */%}}` 容器 | 否决 | 粘性子元素共享同一个包含块，会层层堆叠；网格也无法让标题跨满它所在的小节。这点视觉收益不足以支撑一个容器 |
| 由 front matter 开启的页面模式，把每个 `##` 都变成条目 | 推迟 | 过于隐式，且会把引言标题与条目混在一起。只有实际页面证明显式标记过于繁琐时才重新考虑 |
| 按关键字映射标签颜色 | 否决 | 这是一套隐藏的英文词表，永远匹配不了中文标签，而且彩色 chip 会与预设配色相争 |
| 把徽章写进标题文本 | 否决 | 徽章会泄漏到 TOC、锚点与搜索标题中 |

所选形态的代价：

- 没有 Mintlify 式侧栏。呈现的是一条干净的条目流，而非照搬。
- 标题上的属性语法不如具名短代码容易发现；指南与速查表会把它放在最前面。
- Markdown 输出会在标题行上保留 `{.update …}`。Agent 很容易读懂；每种原生形态都做了同样的取舍。
- `render-heading.html` 会在每个页面的每个标题上运行，因此新分支必须保持低成本：先检测 `update` class，再做其他任何工作。

## 兼容性 {#compatibility}

纯增量。不带 `.update` 的标题渲染结果逐字节不变。如今标题上的 `date` 与 `tags` 已经会告警并被丢弃，因此不可能有现有页面依赖它们。

## 实现计划 {#implementation}

1. 在 `render-heading.html` 中，当校验后的 class 列表包含 `update` 时，允许 `date` 与 `tags`，对其进行校验，并在标题之后输出元数据行。
2. 新增一个样式表层（或在现有内容层中新增一节），并将其列入 `layers.html`。
3. 夹具：带日期与不带日期的条目、无效日期、含空白与空项的标签、嵌套子小节、位于多页 Print 分区内的条目，以及带 `date` 但没有标记的标题。记录 HTML、Print、Markdown 与 RSS 的 golden。
4. 所属检查器：`bin/check-content-primitives.py`（属性政策）、`bin/check-output.py`、`bin/check-goldens.py`、`bin/check-stylesheets.py`。确认 `search/sections.html` 仍以标题文本作为小节标题。
5. 更新中英文[组件契约](/zh/docs/design/components/)，新增 EN/ZH 指南，并在速查表中加入对应行。

## 验收标准 {#acceptance}

- 标记不改变 TOC 项、锚点、键盘标题跳转与搜索小节。
- `<time datetime>` 只为有效日期输出；无效输入告警，并保留条目。
- 不带标记的标题与当前输出逐字节一致。
- 多页 Print 像处理其他标题一样，为更新标题加上命名空间。
- 预设、明暗模式、窄屏、RTL、强制颜色与打印评审全部通过。

## 待决问题 {#open-decisions}

1. **视觉分量。** 建议：只用分隔线与元数据行。为每个条目在起始边加一条轴线需要包裹元素，暂缓。
2. **TOC 中是否显示日期。** 建议：不显示；TOC 保持紧凑，若日期本身就是条目的 label，作者可以把它写进标题文本。
3. **标签的语言键。** 建议：不设；标签 chip 不附带额外标签文字。如果确有必要提供无障碍分组名称，复用现有的分类法 label。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）**：百分号分隔的 `update` 短代码，带粘性侧栏与七个参数。
- **2026-11-27（评审）**：改为带 `date` 与 `tags` 的 `.update` 标题标记；移除侧栏、色调映射与条目级链接。
- **2026-11-27（实现）。** 在 `render-heading.html` 与 `assets/css/td/timeline.css` 中实现。不带标记的标题保持逐字节一致（由主题 golden 证明）；无效输入由 `bin/check-content-primitives.py` 中的 `check_update_headings` 覆盖。无需新增语言键。
- **2026-11-27（评审后加固）。** 将样式拆出至独立的 `assets/css/td/update.css`；在 `.td-update-meta` 各项间插入视觉隐藏的 `, ` 分隔符以解决搜索索引、RSS、读屏与复制粘连；补充 `rich-copy.js` 支持；修复暗色模式打印对比度（`--td-print-*`）与 `h2.update` 打印双线夹心；用 `:has(+ .td-update-meta)` 取代负外边距并修正首条条目与 `h2 + h3.update` 间距；对齐 Ink 顶边线与标签底色；在标题钩子中加入 `if not .Attributes` 快速路径、`printf "%T"` 字符串类型校验、`time.AsTime` 真实日历校验及中文全角 `，` 分隔支持。
- **2026-11-27（验收评审）。** Firefox 复制时标签仍然粘连（`FixDocs`），WebKit 则把每个逗号单独放在一行，原因是 flex 子项会被块级化，而 `user-select: none` 把分隔符排除出了选区。元数据行改为行内排版，分隔符改为 `font-size: 0` 的 `<span class="td-update-sep">, </span>`，三个引擎复制出的都是 `2026-11-23, Fix, Docs`。`if not .Attributes` 快速路径从未生效，因为 Goldmark 会给每个标题加 `id`；现在改为 id 是唯一属性时走快速路径，文档站上标题钩子的模板耗时约减半，输出逐字节不变。测试夹具的 golden 记录了新的分隔符标记与字数。
