---
title: 设计决策
linkTitle: 决策
description: 解释 OINK 现行公开契约与实现为何采用当前形态的已接受选择。
weight: 60
icon: fa-solid fa-gavel
no_list: true
search_keywords: [设计决策, ADR, 理由, 已接受, 维护者]
design_kind: decision-index
design_status: active
---

> [!NOTE] 已接受的理由
> 决策记录解释 OINK 为什么在多个兼容方案中选择了当前设计。上方五份契约仍是
> 现行行为的规范描述；实现与归属检查器仍是可执行事实。

OINK 过去把评审、PRD 与执行记录放在本地 `plan/` 目录中。这样既不便发现有价值的
推理，也容易让已经放弃的设计看起来仍有权威。已经接受的理由现在统一进入这座双语、
版本化的文档站，与它所支撑的契约放在一起。

## 决策地图 {#decision-map}

| 决策                                                      | 解决的问题                                                                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [警告与安全回退](/zh/docs/design/decisions/diagnostics/)  | 为什么普通预览能容忍错误输入，而发布仍保持严格                               |
| [配置模型](/zh/docs/design/decisions/configuration/)      | 配置放在哪里、页面如何覆盖，以及 OINK 为什么不另造配置命名空间               |
| [Markdown 优先创作](/zh/docs/design/decisions/authoring/) | 为什么优先使用原生 Markdown，以及 Docs、Blog、Book、Landing 如何延长共享系统 |
| [生成式配置 Schema](/zh/docs/design/decisions/config-schema/) | 为什么编辑器 Schema 是生成的投影，以及漂移门禁如何阻止第三个配置权威出现 |

## 记录格式 {#record-format}

一份已接受决策应记录背景、选择、后果，以及证明该选择仍然成立的证据。它不重复参数
参考或教程。每份决策都要链接到归属契约与验证面，中英文页面必须同步修改。

决策发生变化时，应在同一次交付中更新实现、检查器、受影响契约与决策记录。旧答案留在
Git 历史和版本变更记录中，不在导航树里并列保留两套“现行”答案。

## 相关 {#related}

- [设计契约](/zh/docs/design/) — 当前规范行为
- [研究](/zh/docs/design/research/) — 为决策提供依据的定期快照
- [提案](/zh/docs/design/proposals/) — 尚未接受的想法
