---
title: 配置模型
linkTitle: 配置模型
description: OINK 延长 Hugo 与 Docsy 兼容配置，不另造第二套命名空间或全局 resolver。
weight: 20
icon: fa-solid fa-sliders
search_keywords: [配置模型, params.ui, front matter, 默认值, resolver]
design_kind: decision
design_status: accepted
decision_date: 2026-08-20
---

> [!IMPORTANT] 决策
> OINK 保留 Hugo 原生键与仍有价值的 Docsy 兼容键，把主题呈现和行为放在
> `params.ui.*` 下，并用同名的顶层 front matter 键提供页面覆盖。它不增加
> `params.oink.*` 配置树，也不建立一套遮蔽 Hugo 配置模型的注册表。

## 背景 {#context}

OINK 继承了成熟的配置面，又增加了阅读外壳、内容输出和本地交互。早期设计曾尝试把所有
主题自有键迁入一个新命名空间，并在每页一次性解析完整配置字典。这样会在 Hugo 原生键旁边
再造一种语言，使 section cascade 更复杂，迁移规模甚至超过它要控制的行为本身。

现行模型直接体现每一层的归属：

| 层次           | 职责                                             | 示例                                                             |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| Hugo           | 站点身份、语言、菜单、输出、分类法、markup、模块 | `baseURL`、`languages`、`outputs`                                |
| 站点事实与集成 | 仓库、版本、作者、本地搜索、评论、外部服务       | `params.github_repo`、`params.version`、`params.comments`        |
| OINK 界面      | 外壳、导航、呈现与本地交互                       | `params.ui.sidebar_*`、`params.ui.typography`、`params.ui.share` |
| 页面或栏目     | 对可覆盖站点默认值的局部调整                     | `sidebar_enabled`、`featured_image`、`share`                     |
| 数据文件       | 不是开关的结构化事实与有序内容                   | `data/landing`、`data/download`、`data/docs_nav.json`            |

## 决策 {#decision}

配置 API 遵循以下规则：

1. 站点事实保留在既有顶层；界面选择归入 `params.ui.*`。
2. 页面覆盖去掉 `ui.` 前缀，其余名称保持一致。section 的 `cascade` 可以把这个顶层键应用到后代。
3. 一个布尔值足以表达完整政策时使用标量；只有真正存在下级设置时才使用 map。既有 map 可以接受
   布尔速记。
4. 名称采用正向、snake_case，并按功能分组。密切相关的设置共用前缀，不为此再建一层 resolver。
5. 主题默认值声明在主题的 `hugo.yaml` 中。只有静态值会抹掉刻意存在的外壳差异时，模板才可以
   推导默认值。
6. 每个功能族负责自己的规范化与校验。共享 helper 提供常见形状，但不存在一套悄悄重写任意旧键的
   全局兼容注册表。

完整的现行键、类型与默认值统一放在[配置参考](/zh/docs/customize/config/)中。本决策只记录
归属规则，不再维护第二张参数表。

## 兼容策略 {#compatibility}

公开键改名时，由归属 resolver 给出定向警告，同时提供迁移说明和负向测试。已移除或拼错的键
不构成永久别名层的理由。Hugo 与第三方原生 camelCase 键继续保留原样；OINK 自有新增使用
snake_case。

页面值通过 Hugo 普通的 front matter 与 cascade 模型解析。OINK 不要求作者在 front matter
里写嵌套 `ui:` 树，也不承诺合并任意嵌套页面 map。

## 后果 {#consequences}

- 新增公开设置时，必须有声明或明确推导的默认值、归属 resolver、文档，以及正向和负向测试。
- 配置指南链接到唯一参考表，不在各处重复类型与默认值。
- 只有有序或重复事实才值得新增数据结构，不能只因为不想增加参数就造一个 data 文件。
- 无效标量值遵循[警告与回退决策](/zh/docs/design/decisions/diagnostics/)。

## 验证 {#verification}

`bin/check-params.py` 审计声明默认值、页面别名、警告行为与禁止 `errorf` 的不变量。公开参考及其
中文对页由集成站的双语和渲染链接检查覆盖。
