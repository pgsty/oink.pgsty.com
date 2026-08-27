---
title: 生成式配置 Schema
linkTitle: 配置 Schema
description: 编辑器 Schema 是从既有配置权威投影生成的，CI 漂移门禁保证它永远不会成为第三个权威。
weight: 40
icon: fa-solid fa-list-check
search_keywords: [JSON Schema, 配置, front matter, 编辑器补全, yaml-language-server, 漂移门禁]
design_kind: decision
design_status: accepted
decision_date: 2026-08-24
---

> [!IMPORTANT] 决策
> `schema/` 下的两份 JSON Schema 由 `bin/generate-config-schema.py` 从主题的
> `hugo.yaml` 与模板读取点投影生成，手工编辑无法通过 CI。Schema 是既有权威的
> 只读投影，不是第三个配置权威。

## 背景 {#context}

主题已有两个配置权威：`hugo.yaml` 在注释旁声明每个默认值；`check-params.py`
的读取点扫描知道模板实际消费的每一个键。编辑器对两者一无所知，作者只能凭记忆
敲 `params.ui.*` 和 front matter。

JSON Schema 能给编辑器补全与悬浮文档，风险在于 Schema 悄悄变成会漂移的第三个
权威。任何手工维护的 Schema 都终将与实现脱节，而脱节的补全比没有补全更危险。

## 决策 {#decision}

`bin/generate-config-schema.py` 在 `schema/` 下生成两个文件：
`site-params.schema.json` 校验站点的 `hugo.yaml`（类型与默认值取自主题自己的
`hugo.yaml`，描述取自其注释块）；`front-matter.schema.json` 校验页面 front
matter（模板作为创作面读取的全部键，描述继承自对应站点键）。仅为提示「已重命名
或已移除」而读取的键按名排除。

两个刻意的克制成为决策的一部分：

- front-matter Schema **不带类型约束**。多个键在站点类型之外还接受裸布尔退出
  （`share: false`、`theme_color: false`）；对合法输入画红线比没有提示更糟。
- `hugo.yaml` 读取器只解析该文件实际使用的形态——嵌套映射、标量、行内列表。
  读不懂的构造是硬错误，超出能力时漂移门禁会大声失败而不是错误生成。

## 后果 {#consequences}

改变 Schema 的唯一途径是修改 `hugo.yaml` 或扫描所读的模板：公开配置面变化时，
Schema 在同一次提交中随之再生，不存在需要单独记得维护的第二份清单。代价是
生成器与读取点扫描成为公开配置面的隐含门禁——新增参数键必须能被它们理解，
否则 CI 直接失败。

## 验证 {#verification}

`python3 bin/generate-config-schema.py --check` 在内存中重新生成，`schema/`
过期或缺失即失败；主题 CI 把它放在参数契约检查旁边运行。编辑器接入方法与
行为描述的规范位置是[配置总览](/zh/docs/customize/config/#editor-schema)。
