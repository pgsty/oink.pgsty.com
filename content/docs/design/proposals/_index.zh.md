---
title: 设计提案与 PRD
linkTitle: 提案
description: 仍在评估中的 OINK PRD 与设计草案的唯一双语归档位置。
weight: 80
icon: fa-solid fa-compass-drafting
no_list: true
search_keywords: [提案, PRD, 设计草案, 路线图, RFC]
design_kind: proposal-index
design_status: active
---

> [!WARNING] 非规范性材料
> 提案描述的行为可能尚不存在。当前行为由契约、已接受决策、实现与归属检查器定义。不能把提案
> 当作配置参考。

本栏目是 OINK 产品需求文档、RFC 风格设计与未决维护者提案的唯一正本位置。不要在主题仓库或
文档仓库中另建本地 `plan/`、`plans/`、`proposal/` 或其它并行设计树。

## 当前提案 {#active-proposals}

| 提案                                                             | 当前边界                                                               |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [反向链接与知识图谱](/zh/docs/design/proposals/knowledge-graph/) | G1（静态反向链接）已接受，已在主题 main 分支实现，随 OINK 0.8.0 发布；局部与全站图谱（G2/G3）保持草案 |
| [媒体收敛](/zh/docs/design/proposals/media-convergence/)         | 部分已实现；media-result 契约与 Landing 资源元数据已交付，M3 决议为原生图片处理，退役（M4）保持开放 |
| [Agent 批量索引](/zh/docs/design/proposals/agent-indexes/)       | 已接受（2026-08-27）；两类输出都已在主题 main 分支实现，随 OINK 0.8.0 发布，之后本提案退役 |
| [Book 出版链路](/zh/docs/design/proposals/book-publication/)     | manifest 与 EPUB/PDF 工具已随版本发布，见[架构](/zh/docs/design/architecture/)；本页只剩消费站迁移未决 |

生成式配置 Schema 提案已按生命周期退役：行为的规范位置是[配置总览](/zh/docs/customize/config/#editor-schema)，
长期理由进入[生成式配置 Schema 决策](/zh/docs/design/decisions/config-schema/)，草案原文由 Git 历史保存。

## 新 PRD 放在哪里 {#where-a-new-prd-goes}

创建一份英文主页面及其简体中文对页：

```text
content/docs/design/proposals/<slug>.md
content/docs/design/proposals/<slug>.zh.md
```

两份文件都使用显式、稳定的英文标题 ID。中文页面中的代码、键、路径、版本与 API 名称保持原样。
提案开头要有可见的草案状态，并包含：

1. 状态、负责人、日期和受影响契约面；
2. 背景与证据；
3. 目标与明确非目标；
4. 提议行为，以及输出、无障碍、安全边界；
5. 兼容与迁移影响；
6. 实现与归属检查器计划；
7. 验收标准与待决问题；
8. 记录提案自身变化的决策日志。

大型实验可以在 [`../research/`](/zh/docs/design/research/) 下增加带日期的页面；临时日志与生成
产物不进入 Hugo 内容，也不进入 Git。

## 生命周期 {#lifecycle}

```text
草案提案
    ├── 拒绝或被替代 → 从活动树移除，由 Git 历史保存
    └── 接受
          ├── 实现与归属检查器
          ├── 受影响的中英文契约
          ├── 理由具有长期价值时新增已接受 Design 决策
          └── 相关受众需要时更新变更记录、迁移与用户文档
```

提案被接受后不会自动成为第二份契约。稳定行为进入归属契约，稳定理由进入 Decisions，用户步骤进入
相关指南，然后把提案退出活动导航。本地构建、提交、tag、公开模块、消费站 pin 与部署仍是相互独立
的完成状态。

## 评审门禁 {#review-gate}

实施前，评审者确认提案没有重复已有外壳、resolver、组件族或数据权威。实施期间，如果设计改变，
先更新这份双语提案，不能让代码悄悄漂移。验收至少覆盖主题的最窄归属检查、真实文档站、渲染后的
中英文、相关输出、无障碍与响应式检查。
