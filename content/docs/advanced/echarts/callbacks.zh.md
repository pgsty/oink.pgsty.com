---
title: ECharts 回调与可信代码
linkTitle: 回调与可信代码
description: 结构化选项不足时，使用经过审查的格式化与样式函数。
weight: 20
icon: fa-solid fa-code
---

大多数 ECharts 选项都应保持为声明式 JSON 或 YAML。自定义格式化器、数据驱动样式等合法选项需要函数时，Oink 可以通过 JavaScript 围栏代码块与
`$fn:name` 引用支持这些场景。

## 可信作者边界 {#trusted-author-boundary}

回调代码会在每位访问者的浏览器中执行，拥有页面同源环境下的常规 JavaScript 权限。Oink 会安全序列化结构化图表选项，但不会沙箱隔离作者提供的回调。只有可信的项目作者才能添加或审查这类代码。

短代码会输出行内注册脚本，因此回调还可能改变站点的内容安全策略（CSP）要求。能够用声明式选项表达同一行为时，请不要使用回调。

## 注册并引用函数 {#register-and-reference-functions}

在短代码中加入一个或多个 `js` 或 `javascript` 围栏。使用具名
`var`、`let`、`const` 赋值或函数声明定义每个函数，再从 YAML 或 JSON 中通过
`$fn:name` 引用。

````go-html-template
{{</* echarts height="320px" */>}}
```js
var formatMinutes = function (value) {
  return value + ' 分钟';
};
```

```yaml
yAxis:
  type: value
  axisLabel: { formatter: $fn:formatMinutes }
```
{{</* /echarts */>}}
````

Oink 会先移除 JavaScript 围栏，再解析剩余选项；初始化图表时注册具名函数，并在调用
`chart.setOption()` 前替换 `$fn:name` 值。

## 示例：标签与颜色 {#example-labels-and-colors}

下面的图表会格式化耗时标签，并突出显示最慢阶段。演示数据表示撰写耗时 18 分钟、评审耗时 11 分钟、发布耗时 4 分钟。

<!-- prettier-ignore-start -->

{{< echarts height="320px" >}}
```js
var formatAxisMinutes = function (value) {
  return value + ' 分钟';
};
var formatBarMinutes = function (params) {
  return params.value + ' 分钟';
};
var stageColor = function (params) {
  return params.name === '撰写' ? '#f97316' : '#3b82f6';
};
```

```yaml
tooltip: { trigger: axis }
xAxis:
  type: category
  data: [撰写, 评审, 发布]
yAxis:
  type: value
  axisLabel: { formatter: $fn:formatAxisMinutes }
series:
  - type: bar
    data: [18, 11, 4]
    itemStyle: { color: $fn:stageColor }
    label:
      show: true
      position: top
      formatter: $fn:formatBarMinutes
```
{{< /echarts >}}

<!-- prettier-ignore-end -->

## 回调检查清单 {#callback-checklist}

- 函数应保持确定性，而且只负责图表呈现；
- 不得读取 Cookie、凭据、存储或无关页面内容；
- 不得从格式化或样式回调中获取远程数据；
- 同一页包含多个图表时，使用唯一且含义清晰的函数名；
- 从外部示例复制的代码仍属于源码，必须审查并核对许可证；
- 按实际输入范围测试缺失值、`null`、字符串与数字；
- 检查站点深浅配色、窄屏、打印与减少动态效果行为。

## 故障排查 {#troubleshooting}

如果 `$fn:name`
没有解析，请确认拼写与同一页面中的具名声明完全一致，并确认围栏语言是 `js` 或
`javascript`。没有赋给名称的匿名表达式无法注册。

如果 Hugo 在渲染前失败，请先把正文缩减为有效 JSON 或 YAML，再逐个加入回调。浏览器控制台报错则表示结构化选项已经解析成功，但回调执行或某个 ECharts 选项仍需检查。
