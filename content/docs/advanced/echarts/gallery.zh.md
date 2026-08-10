---
title: ECharts 图表示例集
linkTitle: 图表示例集
description: 复制适合文档页面的声明式 ECharts 实用模式。
weight: 10
icon: fa-solid fa-chart-simple
---

本页示例只使用结构化 YAML，不需要回调代码，因此处于最简单的 ECharts 创作与审查边界内。所有数字均为演示数据。

## 复用数据集 {#reuse-a-dataset}

ECharts `dataset`
把记录与视觉编码分开。序列可以按名称引用维度，比重复维护多组平行数组更容易审查。

## 从数据集创建柱状图 {#bar-chart-from-a-dataset}

```go-html-template
{{</* echarts height="320px" */>}}
dataset:
  source:
    - [stage, minutes]
    - [草稿, 18]
    - [评审, 11]
    - [发布, 4]
xAxis: { type: category }
yAxis: { type: value, name: 分钟 }
series:
  - type: bar
    encode: { x: stage, y: minutes }
{{</* /echarts */>}}
```

示例表示中位耗时从撰写草稿的 18 分钟，逐步下降到发布阶段的 4 分钟。

<!-- prettier-ignore-start -->

{{< echarts height="320px" >}}
dataset:
  source:
    - [stage, minutes]
    - [草稿, 18]
    - [评审, 11]
    - [发布, 4]
xAxis: { type: category }
yAxis: { type: value, name: 分钟 }
series:
  - type: bar
    encode: { x: stage, y: minutes }
{{< /echarts >}}

<!-- prettier-ignore-end -->

## 折线与面积对比 {#line-and-area-comparison}

多个序列描述同一组时间区间时，可以共用分类轴。面积填充突出总量，折线则保留各序列的趋势。

```go-html-template
{{</* echarts height="340px" */>}}
tooltip: { trigger: axis }
legend: { data: [英文, 中文] }
xAxis:
  type: category
  data: [周一, 周二, 周三, 周四, 周五]
yAxis: { type: value, name: 页面 }
series:
  - name: 英文
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [5, 8, 7, 11, 13]
  - name: 中文
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [4, 6, 8, 9, 13]
{{</* /echarts */>}}
```

两种语言的评审队列都在周五达到 13 页；中文队列起点少一页，随后逐步追平。

<!-- prettier-ignore-start -->

{{< echarts height="340px" >}}
tooltip: { trigger: axis }
legend: { data: [英文, 中文] }
xAxis:
  type: category
  data: [周一, 周二, 周三, 周四, 周五]
yAxis: { type: value, name: 页面 }
series:
  - name: 英文
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [5, 8, 7, 11, 13]
  - name: 中文
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [4, 6, 8, 9, 13]
{{< /echarts >}}

<!-- prettier-ignore-end -->

## 环形占比图 {#donut-breakdown}

环形图适合类别较少的部分与整体对比。请限制类别数量、直接显示标签，并在正文中给出总数。

```go-html-template
{{</* echarts height="340px" */>}}
tooltip: { trigger: item }
legend: { bottom: 0 }
series:
  - name: 文档页面
    type: pie
    radius: [42%, 68%]
    avoidLabelOverlap: true
    label: { formatter: "{b}: {c}" }
    data:
      - { name: 指南, value: 28 }
      - { name: 参考, value: 17 }
      - { name: 教程, value: 11 }
      - { name: 概念, value: 8 }
{{</* /echarts */>}}
```

这组 64 页文档包含 28 页指南、17 页参考、11 页教程与 8 页概念说明。

<!-- prettier-ignore-start -->

{{< echarts height="340px" >}}
tooltip: { trigger: item }
legend: { bottom: 0 }
series:
  - name: 文档页面
    type: pie
    radius: [42%, 68%]
    avoidLabelOverlap: true
    label: { formatter: "{b}: {c}" }
    data:
      - { name: 指南, value: 28 }
      - { name: 参考, value: 17 }
      - { name: 教程, value: 11 }
      - { name: 概念, value: 8 }
{{< /echarts >}}

<!-- prettier-ignore-end -->

## 使用视觉编码的散点图 {#scatter-plot-with-visual-encoding}

`visualMap` 无需回调即可编码第三个维度。下面把构建规模同时映射为点的大小与颜色。

```go-html-template
{{</* echarts height="360px" */>}}
tooltip: { trigger: item }
xAxis: { type: value, name: 构建秒数 }
yAxis: { type: value, name: 页面数 }
visualMap:
  - type: continuous
    dimension: 2
    min: 10
    max: 50
    inRange: { symbolSize: [10, 32], color: ["#60a5fa", "#f97316"] }
    right: 0
    top: middle
series:
  - type: scatter
    encode: { x: 0, y: 1, tooltip: [0, 1, 2] }
    data:
      - [1.8, 24, 12]
      - [2.6, 41, 22]
      - [3.9, 67, 35]
      - [5.1, 92, 48]
{{</* /echarts */>}}
```

在这组演示数据中，页面较多的站点构建时间也更长。点的大小和颜色同时编码第三个数值，因此颜色不是唯一线索。

<!-- prettier-ignore-start -->

{{< echarts height="360px" >}}
tooltip: { trigger: item }
xAxis: { type: value, name: 构建秒数 }
yAxis: { type: value, name: 页面数 }
visualMap:
  - type: continuous
    dimension: 2
    min: 10
    max: 50
    inRange: { symbolSize: [10, 32], color: ["#60a5fa", "#f97316"] }
    right: 0
    top: middle
series:
  - type: scatter
    encode: { x: 0, y: 1, tooltip: [0, 1, 2] }
    data:
      - [1.8, 24, 12]
      - [2.6, 41, 22]
      - [3.9, 67, 35]
      - [5.1, 92, 48]
{{< /echarts >}}

<!-- prettier-ignore-end -->

## 生产环境说明 {#production-notes}

数据量较小且属于编辑内容时，可以把示例数据放在图表旁边。对于大型或生成的数据集，应在站点内容流水线中生成选项，并审查最终页面源码。Oink不会自动从远程端点获取图表数据；增加网络请求属于站点主动选择的集成，也会改变本地优先与隐私边界。
