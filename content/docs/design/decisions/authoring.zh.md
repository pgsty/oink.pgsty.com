---
title: Markdown 优先创作
linkTitle: Markdown 优先创作
description: 原生 Markdown 承载常见语义；shortcode 只填补真实能力缺口，各内容模型延长共享外壳而不是分叉。
weight: 30
icon: fa-brands fa-markdown
search_keywords: [Markdown 优先, 创作 API, shortcode, 渲染钩子, 内容模型]
design_kind: decision
design_status: accepted
decision_date: 2026-08-17
---

> [!IMPORTANT] 决策
> Goldmark 能保留目标语义时，优先提供原生 Markdown 形态。只有原生形态无法表达真实能力时，
> 才保留 shortcode。新增内容场景时延长既有外壳和数据模型，不另建一套并行渲染系统。

## 背景 {#context}

OINK 同时服务短手册、大型参考文档、发布归档、落地页和书籍。对十一个消费站点、五千多篇
Markdown 的盘点呈现了两个极端：有些页面几乎不用主题语法，有些页面则由大量嵌套 shortcode
与站点自有 layout 拼成。

只为后一类优化的组件 API 会变成私有 DSL；只支持纯 Markdown 又会迫使书籍、富图、标签页和
结构化发布退回站点自有 HTML。真正有用的边界是能力，而不是语法看起来是否新颖。

## 决策 {#decision}

OINK 按以下顺序设计：

1. **原生 Markdown 优先。** 列表可以成为 Steps、Cards 或 FileTree 标记；表格可以成为 Fields
   或矩阵；blockquote 可以成为 callout；代码围栏、图片与 passthrough 块通过渲染钩子携带属性。
2. **shortcode 只补能力。** CommonMark 缩进、嵌套容器、处理选项或跨页登记无法安全表达同一结果时，
   才保留全量 shortcode 形态。
3. **语义实现只有一套。** 原生形态与全量形态进入同一组规范化 partial 和输出契约，不能只是两种
   外观相似的组件。
4. **沿一条系统延长。** 新 Landing 区块进入 section 注册表；新 Blog 呈现仍是 Blog 变体；Book
   编号接入内容原语与导航系统。OINK 不为一个功能再造第二套卡片、落地页、导航或 Article 外壳。
5. **事实不藏在呈现字符串里。** 版本、仓库、日期与有序记录来自 front matter、站点参数或数据文件。
   shortcode 参数不能成为第二个事实来源。

## 输出契约 {#output-contract}

只有在每种已启用输出中都得到明确语义结果，一种创作形态才算完整：

| 输出            | 要求                                                        |
| --------------- | ----------------------------------------------------------- |
| HTML            | 服务器端先输出完整语义内容，JavaScript 只做增强             |
| Print           | 静态、展开，不包含依赖交互的控件                            |
| Markdown / LLMS | 保持源码形态的正文、链接、列表、表格与围栏，不泄漏组件 HTML |
| RSS             | 安全的静态内容，或者明确省略                                |

这一要求避免一个漂亮的 HTML-only 组件悄悄破坏 Agent 输出、订阅源或整书打印。

## 信任与呈现 {#trust-and-presentation}

渲染钩子与 shortcode 使用明确的属性白名单。不安全 URL scheme、内联事件处理器和任意 style
输入会被丢弃。只有在文档明确规定、下游站点 CSS 已属于既有创作契约的表面，才接受作者 class。
图标使用一对 Font Awesome class；OINK 不再发明第二种图标 ID 语言。

## 后果 {#consequences}

- 提议新组件时，必须先说明 Markdown 加既有渲染钩子为什么不够。
- 保留全量 shortcode 时，必须点明它独有的能力，并测试两种形态进入相同的规范化输出。
- 外壳变体使用相互独立的呈现键，因此启用 Hero 或流式大纲不会改变分类法、订阅源、翻页顺序或
  内容类型。
- 消费站证据是带日期的研究，不是永久冻结偶然语法的理由。当前公开面仍由
  [组件契约](/zh/docs/design/components/)与[外壳契约](/zh/docs/design/shell/)定义。

## 验证 {#verification}

主题的组件、Book、输出与 golden 检查器先验证创作契约，本站的双语示例与浏览器套件再完成集成
验收。原生形态背后的 Goldmark 事实记录在
[块属性研究](/zh/docs/design/research/goldmark-attributes/)中。
