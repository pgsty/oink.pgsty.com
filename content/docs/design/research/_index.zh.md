---
title: 设计研究
linkTitle: 研究
description: 用于形成 OINK 设计决策的定期实验与消费站证据，不具备规范效力。
weight: 70
icon: fa-solid fa-flask
no_list: true
search_keywords: [设计研究, 证据, 实验, 消费站盘点, Hugo]
design_kind: research-index
design_status: active
---

> [!NOTE] 证据，不是契约
> 研究记录测量了什么、使用了哪些输入与工具版本。它可以解释决策，但不能覆盖当前契约或实现。

只有其他维护者能够检查方法、理解边界并复现相关检查时，研究才适合进入公开 Design 内容树。
原始 Agent 对话、临时构建日志和本机绝对路径不符合这一标准。

## 研究地图 {#research-map}

| 记录                                                             | 证据                                                                   |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Goldmark 块属性](/zh/docs/design/research/goldmark-attributes/) | 支持的 Hugo 下限版本上，渲染钩子能看到什么，以及 CommonMark 容器的边界 |
| [消费站与迁移证据](/zh/docs/design/research/consumer-evidence/)  | 带日期的语料盘点与确定性 Book 迁移结果                                 |

## 发布规则 {#publication-rules}

研究记录必须说明日期、输入、相关版本、方法、结果与已知边界。容易变化的数字明确标为快照。
涉及外部框架的比较，公开前要依据一手资料重新核验，并提炼成与 OINK 有关的结论，不能直接
复制成竞品目录。

研究结果成为稳定产品选择后，从已接受的[决策](/zh/docs/design/decisions/)链接它；如果它提出的
行为尚不存在，则把设计问题放入[提案](/zh/docs/design/proposals/)。
