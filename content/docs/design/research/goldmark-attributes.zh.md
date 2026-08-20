---
title: Goldmark 块属性实测
linkTitle: Goldmark 属性
description: Hugo 0.160.1 与 0.164.0 上列表、图片、表格、passthrough、围栏、callout 与嵌套容器的可复现实测。
weight: 10
icon: fa-solid fa-code
search_keywords: [Goldmark, 块属性, 渲染钩子, IsBlock, shortcode, Hugo 0.160.1]
design_kind: research
design_status: verified-snapshot
last_verified: 2026-08-16
---

> [!NOTE] 已验证快照
> 这些探针在 Hugo Extended 0.160.1 与 0.164.0 上得到字节一致的相关输出。它们解释
> OINK 的原生组件形态；当前[组件契约](/zh/docs/design/components/)仍是权威。

## 方法 {#method}

探针使用一个不带 OINK 模板的最小 Hugo 站点。渲染钩子把上下文字段与 `.Attributes` 输出为
可见标记。站点开启 Goldmark 块属性、行内与块级数学 passthrough 分隔符，以及为检查原始 HTML
而刻意启用的 unsafe 渲染，并设置 `wrapStandAloneImageWithinParagraph: false`。

每种源码形态分别用兼容下限版本和当时的当前 Hugo 版本渲染，再逐字节比较相关产物。以下结论
记录平台行为，不涉及视觉样式。

## 结论 {#findings}

| 源码形态                                                      | 钩子结果                                            | 设计意义                                       |
| ------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| 含段落、围栏、callout、嵌套列表并以 `{.steps}` 结尾的有序列表 | class 落在最外层 `<ol>`，列表项中的富块内容完整保留 | Markdown 列表可以成为 Steps 原生形态           |
| 列表项内标题                                                  | 标题保留在 `<li>` 内，并进入 `.TableOfContents`     | 原生 Steps 可以携带可导航标题                  |
| 以 `{.filetree}` 结尾的嵌套列表                               | class 落在最外层 `<ul>`                             | FileTree 不需要只为保持层级再包 wrapper        |
| 独占图片加 `{#id num= caption= .class}`                       | `render-image` 收到 `IsBlock=true` 和全部属性       | Book 图可以有原生图片形态                      |
| 段落中的行内图片                                              | `IsBlock=false`，图片收不到块属性                   | 行内图片不能使用块级 figure 契约               |
| 块级公式加 `{#id num=}`                                       | `render-passthrough` 收到 block 类型与属性          | 编号公式可以使用原生 passthrough 形态          |
| 表格加 `{.fields #id num= caption=}`                          | `render-table` 收到 class 与命名属性                | Fields、矩阵、题注和 Book 编号可以共享一个钩子 |
| 代码围栏加 `{#id num= caption=}`                              | code-block 钩子收到属性                             | 围栏本身可以成为编号示例                       |
| callout 加 `{icon= tab=}`                                     | blockquote 钩子同时收到 callout 元数据与属性        | 折叠、标题行内标记、图标和 tab 元数据可以共存  |
| 属性行与目标块之间隔一个空行                                  | 属性会静默消失                                      | 源码检查必须拒绝孤立属性行                     |
| 两张相邻表分别带 `tab=`                                       | 每个 table 钩子收到自己的 tab 标签                  | 相邻块 tab 机制可以扩展到代码围栏之外          |

## 容器边界 {#container-boundary}

Hugo 的 `%` shortcode delimiter 会把 `.Inner` 渲染成 Markdown，但模板必须在内部 Markdown
前后各输出一个空行。缺少任一空行时，后续列表可能被当作 HTML block 的字面内容，而不是 Markdown。

把多行 `%` 容器放进 CommonMark 列表项还有更硬的限制：生成的 HTML 不会随列表内容缩进，列表会在
容器之前闭合，并在容器之后重新开始。因此，当步骤中必须放另一个全量容器时，OINK 仍保留全量
Steps 形态。普通富块、围栏与 `<` shortcode 不受这一限制。

在相关收集器形态中，嵌套 `%` shortcode 收到的也是已经渲染好的内部 HTML。需要保留子项原始
Markdown 的收集器应使用 `<` delimiter，再通过共享的作用域块渲染器处理捕获到的正文。

## 属性归属 {#attribute-ownership}

钩子能看到某个属性，并不等于它自动成为公开属性。每个钩子拥有文档明确的白名单。`style` 与内联
`on*` 处理器会被拒绝；携带 URL 的值必须经过共享 URL 策略。只有下游 CSS 已属于既有扩展机制的
表面，才保留站点 class。

实验还表明：gallery 列表项中的图片可以被视为块图，却仍不知道父列表带有什么 marker。因此运行时
要么依赖主题显式输出的标记，要么保留一条窄的结构兜底，不能假设图片钩子能看到任意祖先。

## 边界与验证 {#limits-and-verification}

这些结果只覆盖 Hugo 0.160.1、0.164.0 与上述 Goldmark 设置。修改设置的站点或未来 Hugo 版本不在
承诺范围内。调整 Hugo 兼容下限时，应先重跑组件、Book、表格、gallery 与 Markdown 输出检查，再更新
这份快照。
