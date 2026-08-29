---
title: 设计与开发
linkTitle: 设计
description: 在唯一的双语专栏中管理 OINK 维护者契约、已接受决策、定期研究与候选提案。
weight: 70
icon: fa-solid fa-compass-drafting
no_list: true
search_keywords: [OINK 设计, 维护者契约, 架构, 决策, 研究, 提案, PRD]
contract_status: released-v1.0.0
cascade:
  categories: [设计契约]
---

> [!IMPORTANT] OINK 1.0.0 契约
> 本专栏公开随 OINK 1.0.0 正式发布的维护者契约，兼容性下限为 Hugo Extended
> 0.160.1。持续测试只使用一个固定的 Hugo Extended 工具链，当前为 0.165.0；
> 兼容性下限不再单独作为矩阵测试项。唯一的中英文契约源文件位于本站仓库的
> `content/docs/design/`。

本专栏是 OINK 可长期维护的设计记录。站内其它专栏按任务讲解如何搭建站点；
这里集中说明现行不变量、这些选择背后的理由、用于比较方案的证据，以及仍处于
候选阶段的工作。

## 如何阅读本专栏 {#reading-this-section}

| 层次 | 含义                                       |
| ---- | ------------------------------------------ |
| 契约 | 兼容实现必须保留的规范性行为               |
| 决策 | 用于解释现行行为的已接受理由与边界         |
| 研究 | 带日期且不具规范性的证据，必要时应重新验证 |
| 提案 | PRD 与 RFC 草案；公开在这里不代表已经实现  |

## 契约目录 {#contract-map}

| 契约                                      | 权威范围                                             |
| ----------------------------------------- | ---------------------------------------------------- |
| [架构契约](/zh/docs/design/architecture/) | 构建、配置、诊断、特色图片、输出、安全、无障碍与性能 |
| [组件契约](/zh/docs/design/components/)   | 组件 API、Book 与发布原语、校验和输出降级            |
| [外壳与导航契约](/zh/docs/design/shell/)  | 导航、搜索、博客展示、操作、分类法与页尾组合         |
| [落地页契约](/zh/docs/design/landing/)    | 落地页数据、22 种区块注册表、运行时、无障碍与输出    |
| [迁移边界](/zh/docs/design/migration/)    | 从 0.4 到当前版本所支持的内容与配置迁移              |

## 设计记录 {#design-records}

| 集合                                   | 内容                                       |
| -------------------------------------- | ------------------------------------------ |
| [设计决策](/zh/docs/design/decisions/) | 已接受的诊断、配置与创作模型设计理由       |
| [设计研究](/zh/docs/design/research/)  | Goldmark 探针与真实 OINK 消费站点证据      |
| [候选提案](/zh/docs/design/proposals/) | 知识图谱、媒体收敛与机器可读索引等活跃 PRD |

以后所有 OINK PRD 或 RFC 都必须以中英文页面对的形式放入
`content/docs/design/proposals/`，不得再在仓库中创建 `plan/`、`plans/` 或
`proposal/` 目录。提案被接受后，应同步更新实现、对应检查器与相关契约，把稳定
理由沉淀到“设计决策”，并通过 Git 历史与变更日志退出草案。

## 权威来源与维护 {#authority-and-maintenance}

本目录同时管理英文与中文维护者设计文档。主题仓库管理可执行事实：`hugo.yaml`
管理公开默认值；对应的解析器与检查器定义可选结构；`layouts/` 与 `assets/`
管理渲染行为；检查脚本与 `tests/goldens/` 管理验收；`VENDOR.json` 管理内置
依赖的版本、许可证、文件与校验和。

公共行为发生变化时，必须在同一次交付中更新实现、对应检查器以及本目录下相关
契约的中英文版本。测试应验证行为和输出，不应只固定某段文字。
