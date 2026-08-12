---
title: 使用 AntV 创建信息图
linkTitle: 信息图
description: 把简洁的声明式数据转换成本地 SVG 信息图。
weight: 110
aliases:
  [
    /docs/feature/infographic/,
    /docs/content/infographic/,
    /docs/advanced/infographics/,
  ]
---

`infographic` 短代码使用 Oink 随主题分发的固定版本 AntV
Infographic 运行时渲染 DSL。它适合展示流程、时间线、循环、漏斗、路线图与紧凑信息摘要；如果统计图显得过于生硬，可以选择信息图。

DSL 会作为数据序列化，不会作为任意 HTML 或可执行代码插入页面。浏览器运行时把它转换成 SVG，并且只在实际使用该短代码的页面加载。

## 快速开始 {#quick-start}

```go-html-template
{{</* infographic */>}}
infographic list-row-simple-horizontal-arrow
data
  title 文档工作流
  items
    - label 草稿
      desc 写出第一个版本
    - label 评审
      desc 检查事实与语言
    - label 发布
      desc 构建并验证站点
{{</* /infographic */>}}
```

下图展示同样的三个步骤：草稿阶段写出初版，评审阶段核对事实与语言，发布阶段则构建并验证站点。

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-row-simple-horizontal-arrow
data
  title 文档工作流
  items
    - label 草稿
      desc 写出第一个版本
    - label 评审
      desc 检查事实与语言
    - label 发布
      desc 构建并验证站点
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 语法结构 {#syntax-anatomy}

信息图通常包含：

1. `infographic TEMPLATE`：选择内置 AntV 模板；
2. `data` 块：包含可选的 `title` 与 `desc`；
3. `items` 列表：包含 `label`、`desc`，以及可选的 `value` 和嵌套 `children`；
4. 可选的 `theme` 块：选择内置主题或显式颜色。

缩进决定结构。标签应保持简短，描述用于补充上下文；模板表达的视觉关系必须与正文一致。装饰性的序列不能替代真实的层级或对比关系。

## 短代码参数 {#shortcode-parameters}

| 参数     | 默认值  | 行为                                                              |
| -------- | ------- | ----------------------------------------------------------------- |
| `height` | `auto`  | 接受 `auto`，或非负数字与 `px`、`rem`、`em`、`vh`、`vw`、`%` 单位 |
| `full`   | `false` | 设为 `true` 后移除 Oink 的常规正文宽度限制                        |

无效高度与空 DSL 正文会让 Hugo 构建失败。DSL
Schema 或模板错误则由浏览器运行时显示在信息图容器中。

AntV 主题属于 DSL，而不是短代码参数。它不会自动跟随 Oink 站点配色模式，因此必须在深浅两种模式中检查前景、背景与页面周围区域的对比度。

## 选择指南 {#choose-a-guide}

- 流程、时间线与循环：演示三种常见的顺序说明方式；
- 布局、漏斗与主题：演示网格、逐步收窄的阶段、模板选择与内置手绘主题。

AntV 包含大量模板。请优先选择足以解释关系的最小视觉形式，不要只追求最具装饰性的模板。

## 创作与无障碍 {#authoring-and-accessibility}

- 在图形前后使用普通正文概括同一结论；
- 保持阅读顺序有意义，并缩短标签；
- 不要只通过颜色或形状传递状态；
- 检查长译文标签、窄屏、打印与站点深浅两种配色模式；
- 本地优先页面应避免远程图片或图标标识；确需使用时，必须显式审查网络与许可证边界；
- 非演示数值应注明来源与日期。

SVG 可以提高视觉保真度，但不能保证每种模板都能提供与原生标题、列表、表格相同的语义结构。关键指令必须继续出现在相邻正文中。

## 延伸参考 {#further-reference}

OINK 负责记录短代码与交付边界。完整 DSL、模板图库与主题模型请查阅
[AntV Infographic 文档](https://infographic.antv.vision/learn)、
[图库](https://infographic.antv.vision/gallery)与
[源码仓库](https://github.com/antvis/Infographic)。Oink 主题的 `VENDOR.json`
记录随附版本、校验值与 MIT 许可证文件。
