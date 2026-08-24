---
title: 媒体收敛
linkTitle: 媒体收敛
description: 正文图片、编号图、Landing 媒体与代表图片选择之间剩余收敛工作的设计草案。
weight: 20
icon: fa-solid fa-images
search_keywords: [图片 resolver, figure, 图片处理, zoom, landing 媒体, 代表图片]
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-08-20
---

> [!IMPORTANT] 部分已实现
> M1（共享 media-result 契约）与 M2（Landing 资源元数据）已在主题 main 分支实现；
> M3 已决议为方案 2：图片处理只属于原生 Markdown 图片形态，完整 `fig` 源形态保持
> 容器语义，其参数表刻意不含 `command`/`options`。M4（兼容退役）在完成消费方盘点
> 之前保持开放。以下各节为原始设计记录。

## 当前基线 {#current-baseline}

正文图片钩子、编号 `fig`、卡片与 gallery 统一通过 `content/image-resolve.html` 解析页面资源、
section 资源、全局资产、static 文件与显式远程 URL。栅格资源可以提供固有尺寸与处理后派生图。
HTML Zoom 资格使用 `data-td-image-zoom` 标记；构建期检测只查找主题自己输出的标记。

独占 Markdown 图片已经可以把题注或 Book 编号与图片处理、链接组合起来。编号图片 figure 共用
`td-figure` 与 `td-book-figure` 语义。Landing 媒体经过共享 URL 信任策略；代表图片则刻意使用
排序 resolver，因为它的职责是选择代表图片，而不是渲染一个显式来源。

## 剩余问题 {#remaining-problem}

共享安全边界已经比共享媒体模型更成熟。Landing 媒体仍然拿不到与正文图片相同的页面资源元数据和
处理结果；代表图片选择与显式图片解析返回不同结果形状；部分兼容 class 仍保留在标记中；Book 的
全量 `fig` 形态也不能表达原生图片钩子的所有处理选项。

因此问题已经不再是“替换七种图片入口”，而是：能否在不抹掉各自语义差异的前提下，让剩余表面共享
一份小型结果契约。

## 目标与非目标 {#goals-and-non-goals}

目标：

- 为 URL、原始 URL、尺寸、替代文字、署名、可处理状态与外部状态定义一个规范化媒体结果形状；
- 在来源语义重合处，让显式正文图片、Landing 媒体与代表图片复用这个形状；
- 继续让 figure 标记与 Zoom 资格分别只有一个归属实现；
- 决定全量 `fig` 是否需要处理能力，还是要求处理过的编号图使用原生图片形态；
- 只有在完成消费站证据与 release note 后才退役兼容标记。

非目标：

- 增加第三方 lightbox 或远程图片服务；
- 意外把 image Zoom 从 opt-in 改成站点政策；
- 给 gallery 新增题注、序列或轮播模型；
- 把表格、公式、示例等非图片 Book 目标合并进只适用于图片的基类；
- 强迫代表图片排序与显式图片解析完全相同。

## 提议阶段 {#proposed-phases}

### M1 — 结果契约 {#m1-result-contract}

记录正文 resolver 与代表图片 resolver 的返回字段，再把交集提取成一份内部媒体结果契约。代表图片
继续负责来源排序，正文 resolver 继续负责显式来源解析。这是要求字节输出不变的内部重构。

### M2 — Landing 资源元数据 {#m2-landing-resource-metadata}

允许 Landing 条目中的合格本地资源通过媒体契约解析，获得固有尺寸与相同 URL/安全结论。Landing
数据中显式给出的宽高继续优先。远程与 static 来源仍然合法，但不能伪装成拥有可处理资源元数据。

### M3 — 全量 figure 能力决策 {#m3-full-figure-capability}

从两个答案中明确选择一个：

1. 为全量 `fig` 的来源形态增加处理参数，并通过同一处理 helper 规范化；或者
2. 处理能力只属于原生 Markdown 图片，把全量 `fig` 明确定义为任意编号块内容的容器。

实现不能让两个答案各完成一半。两种形态的 Markdown/LLMS 输出必须一致地链接到文档规定的原图
或派生图。

### M4 — 兼容标记退役 {#m4-compatibility-retirement}

移除旧图片元素 class 或属性之前，先盘点下游 CSS 与 JavaScript。兼容名称仍被使用时，要么保留一个
明确的版本窗口，要么在同一 release train 中迁移归属站点。

## 安全、输出与无障碍 {#safety-output-and-accessibility}

- 图片 URL 继续遵守共享 scheme 与远程主机策略。
- 缺少必需替代文字时发出警告，且只在现行契约允许处渲染装饰性回退。
- 宽高不能声称 SVG、static 文件或远程来源没有提供的元数据。
- 带链接的图片不是 Zoom 目标；运行时保留 dialog 焦点、键盘关闭、reduced motion 与窄屏约束。
- Print、Markdown、RSS 与 LLMS 去掉交互标记，同时保留目标图片、题注、署名、编号与链接。

## 验收标准 {#acceptance-criteria}

每个阶段分别拥有 HTML 与 Markdown 字节级证据、正文与 Landing resolver 测试、URL/安全检查、图片处理
测试、Book 目标、gallery/Zoom 浏览器测试，以及真实站中英文窄屏审查。只有 M3 的能力选择明确后，
提案才能被接受。

## 待决问题 {#open-decisions}

1. 一份共享结果结构是否足够，还是共享更底层的 URL/资源记录会让 resolver 归属更清晰？
2. Landing 应消费资源署名，还是只消费尺寸与 URL？
3. 原生图片已经能组合编号、题注、链接和处理后，全量 `fig` 处理能力是否仍有真实消费需求？
4. 哪些输出兼容名称仍被真实消费站使用？
