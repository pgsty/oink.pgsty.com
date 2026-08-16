---
title: Apache ECharts
linkTitle: ECharts
description: 用 echarts 围栏中的结构化 JSON 或 YAML 创建响应式、本地优先图表。
weight: 100
---

`echarts` 围栏代码块使用 OINK 随主题分发的固定版本 Apache
ECharts 运行时渲染选项对象。围栏正文是 JSON 或 YAML——数据而不是代码——因此在 GitHub 和任何 Markdown 阅读器里它仍是一段可读的代码块。Hugo 在构建阶段解析选项，把结果序列化到页面中，并且只在实际使用该围栏的页面加载 ECharts。

当定量图表需要精确控制坐标轴、视觉编码、提示或序列时，请使用 ECharts。图表旁边仍要提供文字摘要，不能让结论依赖颜色、指针交互或 JavaScript。

## 快速开始 {#quick-start}

````markdown
```echarts {height="300px"}
xAxis:
  type: category
  data: [草稿, 评审, 发布]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
```
````

示例展示了 12 篇草稿页面、9 篇评审中的页面和 4 篇待发布页面。

<!-- prettier-ignore-start -->

```echarts {height="300px"}
xAxis:
  type: category
  data: [草稿, 评审, 发布]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
```

<!-- prettier-ignore-end -->

## OINK 如何加载图表 {#how-oink-loads-a-chart}

渲染钩子会创建唯一的图表容器，并把解析后的选项保存到 `application/json`
元素中。即使同一页包含多个图表，页面也只会加入一次本地 ECharts 运行时与 OINK 初始化脚本。

未设置 `theme`
时，OINK 会按照站点当前配色模式初始化图表，并在读者切换模式时重新绘制。`ResizeObserver`
会让图表随容器缩放。显式指定 ECharts 主题后，该图表不再自动跟随站点配色模式。

## 围栏属性 {#shortcode-parameters}

| 属性     | 默认值  | 行为                                                      |
| -------- | ------- | --------------------------------------------------------- |
| `height` | `400px` | 接受非负数字与 `px`、`rem`、`em`、`vh`、`vw` 或 `%` 单位  |
| `theme`  | 未设置  | 使用指定的 ECharts 主题；未设置时跟随站点的深色或浅色模式 |
| `full`   | `false` | 设为 `true` 后移除 OINK 的常规正文宽度限制                |

无效高度、未知属性，以及无法解析成 ECharts 选项映射的正文都会让 Hugo 构建失败，而不是静默生成空白图表。

## 回调与可信代码 {#choose-a-guide}

围栏只接受声明式配置，不能携带 JavaScript。当某个 ECharts选项需要函数时——例如提示格式化器或数据驱动的颜色——在选项里写字符串
`"$fn:name"`，并在页面级 `<script>` 块或站点资源中把 `name` 注册到
`window.tdEchartsFunctions`。未注册的名称会被忽略并在控制台给出警告：

````markdown
<script>
window.tdEchartsFunctions = window.tdEchartsFunctions || {};
window.tdEchartsFunctions.bytesFormatter = (params) => `${params.value} MB`;
</script>

```echarts {height="240px"}
tooltip:
  formatter: "$fn:bytesFormatter"
series:
  - type: bar
    data: [3, 5, 8]
```
````

请先使用声明式 JSON 或 YAML；只有 ECharts 选项无法用数据表达时，才添加 JavaScript 回调，并把这段脚本当作经过评审的站点代码对待。

## 创作检查清单 {#authoring-checklist}

- 在正文中说明图表的结论与数据范围。
- 明确标注坐标轴、单位、序列和时间范围。
- 不要把颜色作为区分重要数值的唯一方式。
- 保证图例和提示在两种站点配色模式下都可读。
- 在窄屏和长翻译标签下测试图表。
- 多个序列共用同一批记录时优先使用共享 `dataset`。
- 非示意性数据要记录来源与观察日期。
- 动画无助于理解时不要使用，自定义效果要尊重减少动态偏好。

## 延伸参考 {#further-reference}

OINK 负责记录包装层与交付行为，完整选项 Schema 则以 Apache
ECharts 为准。图表专用配置请查阅
[ECharts 概念手册](https://echarts.apache.org/handbook/zh/concepts/chart-size/)、
[数据集指南](https://echarts.apache.org/handbook/zh/concepts/dataset/)与
[选项参考](https://echarts.apache.org/zh/option.html)。主题发行版随附的准确运行时版本与许可证记录在
`VENDOR.json` 中。
