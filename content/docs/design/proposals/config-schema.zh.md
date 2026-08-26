---
title: 生成式配置 Schema
linkTitle: 配置 Schema
description: 从主题既有配置权威投影出的站点参数与 front matter JSON Schema，用于编辑器补全。
weight: 40
icon: fa-solid fa-list-check
search_keywords: [JSON Schema, 配置, front matter, 编辑器补全, yaml-language-server]
design_kind: proposal
design_status: implemented
proposal_date: 2026-08-24
---

> [!IMPORTANT] 与同一发布列车一起实现
> 本页描述的 `bin/generate-config-schema.py` 与 `schema/` 产物已在主题 main
> 分支交付，CI 漂移门禁同时就位。

## 前提 {#premise}

主题已有两个配置权威：`hugo.yaml` 在注释旁声明每个默认值；`check-params.py`
的读取点扫描知道模板实际消费的每一个键。编辑器对两者一无所知，作者只能凭记忆
敲 `params.ui.*` 和 front matter。

JSON Schema 能给编辑器补全与悬浮文档，风险在于 Schema 悄悄变成会漂移的第三个
权威。本设计从构造上禁止这一点：Schema 是生成的投影，CI 在提交文件与权威产出
不一致时直接失败。

## 设计 {#design}

`bin/generate-config-schema.py` 在 `schema/` 下写两个文件：

| 文件 | 校验对象 | 内容 |
| --- | --- | --- |
| `site-params.schema.json` | 站点的 `hugo.yaml` | `params` 树：类型与默认值取自主题自己的 `hugo.yaml`，描述取自其注释块；保留的 map 类型为 `boolean` 或 `object` 以承载裸布尔简写；扫描发现但无声明默认值的键一并列出 |
| `front-matter.schema.json` | 页面 front matter | 模板作为创作面读取的全部 front matter 键，描述继承自对应站点键。仅为提示「已重命名或已移除」而读取的键按名排除，导航菜单条目的 `columns`（读点扫描无法与 front matter 区分）同样排除 |

两个刻意的克制：

- front-matter Schema **不带类型约束**。多个键在站点类型之外还接受裸布尔退出
  （`share: false`、`theme_color: false`）；对合法输入画红线比没有提示更糟。
- `hugo.yaml` 读取器只解析该文件实际使用的形态——嵌套映射、标量、行内列表。
  读不懂的构造是硬错误，超出能力时漂移门禁会大声失败而不是错误生成。

## 漂移门禁 {#drift-gate}

`python3 bin/generate-config-schema.py --check` 在内存中重新生成，`schema/`
过期或缺失即失败。主题 CI 把它放在参数契约检查旁边运行。因此手工编辑 Schema
无法通过 PR；改变它们的唯一途径是修改 `hugo.yaml` 或扫描所读的模板。

## 编辑器接入 {#editor-use}

接入 VS Code YAML language server 的方法见
[配置](/zh/docs/customize/config/#editor-schema)。
