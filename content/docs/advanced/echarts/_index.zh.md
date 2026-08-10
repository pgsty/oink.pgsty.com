---
title: Apache ECharts
linkTitle: ECharts
description: 使用结构化 JSON 或 YAML 创建响应式、本地优先图表。
weight: 40
icon: fa-solid fa-chart-column
aliases: [/docs/feature/echarts/, /docs/content/echarts/]
---

`echarts` 短代码使用 Oink 随主题分发的固定版本 Apache
ECharts 运行时渲染选项对象。Hugo 在构建阶段解析 JSON 或 YAML，把结果序列化到页面中，并且只在实际使用该组件的页面加载 ECharts。

当定量图表需要精确控制坐标轴、视觉编码、提示或序列时，请使用 ECharts。图表旁边仍要提供文字摘要，不能让结论依赖颜色、指针交互或 JavaScript。

## 快速开始 {#quick-start}

```go-html-template
{{</* echarts height="300px" */>}}
xAxis:
  type: category
  data: [草稿, 评审, 发布]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
{{</* /echarts */>}}
```

这个示例表示有 12 页草稿、9 页正在评审，另有 4 页可以发布。

<!-- prettier-ignore-start -->

{{< echarts height="300px" >}}
xAxis:
  type: category
  data: [草稿, 评审, 发布]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
{{< /echarts >}}

<!-- prettier-ignore-end -->

## Oink 如何加载图表 {#how-oink-loads-a-chart}

短代码会创建唯一的图表容器，并把解析后的选项保存到 `application/json`
元素中。即使同一页包含多个图表，页面也只会加入一次本地 ECharts 运行时与 Oink 初始化脚本。

未设置 `theme`
时，Oink 会按照站点当前配色模式初始化图表，并在读者切换模式时重新绘制。`ResizeObserver`
会让图表随容器缩放。显式指定 ECharts 主题后，该图表不再自动跟随站点配色模式。

## 短代码参数 {#shortcode-parameters}

| 参数     | 默认值  | 行为                                                      |
| -------- | ------- | --------------------------------------------------------- |
| `height` | `400px` | 接受非负数字与 `px`、`rem`、`em`、`vh`、`vw` 或 `%` 单位  |
| `theme`  | 未设置  | 使用指定的 ECharts 主题；未设置时跟随站点的深色或浅色模式 |
| `full`   | `false` | 设为 `true` 后移除 Oink 的常规正文宽度限制                |

无效高度会让 Hugo 构建失败。短代码正文必须能够解析成 ECharts 选项对象；格式错误的 JSON 或 YAML 同样会在构建期报错，而不是静默生成空白图表。

## 选择指南 {#choose-a-guide}

- [图表示例集](gallery/)演示数据集、柱状图、折线图、面积图、饼图、散点图、图例与视觉编码；
- [回调与可信代码](callbacks/)解释格式化函数、数据驱动样式、`$fn:name`
  桥接方式及其安全边界。

请先使用声明式 JSON 或 YAML；只有 ECharts 选项无法用数据表达时，才添加 JavaScript 回调。

## 创作检查清单 {#authoring-checklist}

- 在正文中说明图表结论与数据范围；
- 明确标注坐标轴、单位、序列与时间范围；
- 不要只依靠颜色区分重要数值；
- 在站点深浅两种配色模式中检查图例与提示；
- 使用窄屏和较长译文标签测试图表；
- 多个序列共用记录时，优先使用共享 `dataset`；
- 非演示数据应注明来源与观察日期；
- 动画无助于理解时不要启用，自定义效果还应尊重减少动态效果偏好。

## 延伸参考 {#further-reference}

OINK 负责记录包装层与交付行为，完整选项 Schema 则以 Apache
ECharts 为准。图表专用配置请查阅
[ECharts 概念手册](https://echarts.apache.org/handbook/zh/concepts/chart-size/)、
[数据集指南](https://echarts.apache.org/handbook/zh/concepts/dataset/)与
[选项参考](https://echarts.apache.org/zh/option.html)。主题发行版随附的准确运行时版本与许可证记录在
`VENDOR.json` 中。
