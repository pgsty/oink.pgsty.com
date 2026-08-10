---
title: ECharts gallery
linkTitle: Chart gallery
description:
  Copy practical declarative ECharts patterns for documentation pages.
weight: 10
icon: fa-solid fa-chart-simple
---

These examples use only structured YAML. They require no callback code and
therefore stay within the simplest ECharts authoring and review boundary. The
numbers are illustrative.

## Reuse a dataset {#reuse-a-dataset}

ECharts `dataset` keeps records separate from their visual encoding. Series can
refer to dimensions by name, which is easier to review than repeating parallel
arrays.

## Bar chart from a dataset {#bar-chart-from-a-dataset}

```go-html-template
{{</* echarts height="320px" */>}}
dataset:
  source:
    - [stage, minutes]
    - [Draft, 18]
    - [Review, 11]
    - [Publish, 4]
xAxis: { type: category }
yAxis: { type: value, name: Minutes }
series:
  - type: bar
    encode: { x: stage, y: minutes }
{{</* /echarts */>}}
```

The example shows the median duration falling from 18 minutes for drafting to
four minutes for publication.

<!-- prettier-ignore-start -->

{{< echarts height="320px" >}}
dataset:
  source:
    - [stage, minutes]
    - [Draft, 18]
    - [Review, 11]
    - [Publish, 4]
xAxis: { type: category }
yAxis: { type: value, name: Minutes }
series:
  - type: bar
    encode: { x: stage, y: minutes }
{{< /echarts >}}

<!-- prettier-ignore-end -->

## Line and area comparison {#line-and-area-comparison}

Use a shared category axis when several series describe the same intervals. The
area fill emphasizes volume; the lines preserve the individual trends.

```go-html-template
{{</* echarts height="340px" */>}}
tooltip: { trigger: axis }
legend: { data: [English, Chinese] }
xAxis:
  type: category
  data: [Mon, Tue, Wed, Thu, Fri]
yAxis: { type: value, name: Pages }
series:
  - name: English
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [5, 8, 7, 11, 13]
  - name: Chinese
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [4, 6, 8, 9, 13]
{{</* /echarts */>}}
```

Both language queues reach 13 reviewed pages on Friday; the Chinese queue
catches up after starting one page lower.

<!-- prettier-ignore-start -->

{{< echarts height="340px" >}}
tooltip: { trigger: axis }
legend: { data: [English, Chinese] }
xAxis:
  type: category
  data: [Mon, Tue, Wed, Thu, Fri]
yAxis: { type: value, name: Pages }
series:
  - name: English
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [5, 8, 7, 11, 13]
  - name: Chinese
    type: line
    smooth: true
    areaStyle: { opacity: 0.12 }
    data: [4, 6, 8, 9, 13]
{{< /echarts >}}

<!-- prettier-ignore-end -->

## Donut breakdown {#donut-breakdown}

A donut works for a small part-to-whole comparison. Keep the categories few,
show labels directly, and provide the totals in text.

```go-html-template
{{</* echarts height="340px" */>}}
tooltip: { trigger: item }
legend: { bottom: 0 }
series:
  - name: Documentation pages
    type: pie
    radius: [42%, 68%]
    avoidLabelOverlap: true
    label: { formatter: "{b}: {c}" }
    data:
      - { name: Guides, value: 28 }
      - { name: Reference, value: 17 }
      - { name: Tutorials, value: 11 }
      - { name: Concepts, value: 8 }
{{</* /echarts */>}}
```

The 64-page set contains 28 guides, 17 reference pages, 11 tutorials, and eight
concept pages.

<!-- prettier-ignore-start -->

{{< echarts height="340px" >}}
tooltip: { trigger: item }
legend: { bottom: 0 }
series:
  - name: Documentation pages
    type: pie
    radius: [42%, 68%]
    avoidLabelOverlap: true
    label: { formatter: "{b}: {c}" }
    data:
      - { name: Guides, value: 28 }
      - { name: Reference, value: 17 }
      - { name: Tutorials, value: 11 }
      - { name: Concepts, value: 8 }
{{< /echarts >}}

<!-- prettier-ignore-end -->

## Scatter plot with visual encoding {#scatter-plot-with-visual-encoding}

`visualMap` can encode a third dimension without callback code. The following
plot maps build size to point size and build status to color.

```go-html-template
{{</* echarts height="360px" */>}}
tooltip: { trigger: item }
xAxis: { type: value, name: Build seconds }
yAxis: { type: value, name: Pages }
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

Larger sites take longer to build in this illustrative sample; point size and
color both encode the third value so color is not the only cue.

<!-- prettier-ignore-start -->

{{< echarts height="360px" >}}
tooltip: { trigger: item }
xAxis: { type: value, name: Build seconds }
yAxis: { type: value, name: Pages }
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

## Production notes {#production-notes}

Keep example data close to the chart only when it is small and editorial. For
larger or generated datasets, produce the options during the site's content
pipeline and review the resulting page source. Oink does not fetch chart data
from a remote endpoint automatically; adding a network request is an explicit
site integration and changes the local-first and privacy boundary.
