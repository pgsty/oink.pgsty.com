---
title: ECharts
linkTitle: ECharts
description: 在 `echarts` 围栏里用 YAML 或 JSON 写 ECharts 选项，画出跟随深浅色的柱状图、折线图与饼图。
weight: 340
search_keywords: [ECharts, 图表, 统计图, 柱状图, 折线图, 饼图, chart, bar, line, pie, height, theme, OinkEchartsFunctions, OinkEchartsThemes, registerTheme, 主题]
---

`echarts` 围栏用来画带坐标轴、序列与图例的统计图：各张表的大小、版本发布时间线、各类别在总量中的占比。图表写成一个 YAML 或 JSON 形式的 ECharts 选项对象，所以围栏里是数据而不是代码，数字就写在 Markdown 里，每次改动在 diff 中一目了然。Hugo 在构建时检查选项，读者的浏览器用随主题分发的 ECharts 绘图，颜色跟随深浅色切换。不需要任何配置，没有图表的页面什么也不加载。关系与流程请用 [Mermaid](/zh/docs/components/mermaid/)，顺序与层级请用 [Infographic](/zh/docs/components/infographic/)。

## 最简例子 {#minimal}

柱状图需要 `xAxis`、`yAxis` 与 `series` 三项。下面是一个业务数据库里六张表的大小：

````markdown {title="源码"}
```echarts {height="320px"}
tooltip:
  trigger: axis
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
  name: GB
series:
  - name: 大小
    type: bar
    data: [4, 4, 8, 22, 15, 7]
```
````

```echarts {height="320px"}
tooltip:
  trigger: axis
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
  name: GB
series:
  - name: 大小
    type: bar
    data: [4, 4, 8, 22, 15, 7]
```

YAML 与 JSON 都可以，YAML 不需要引号和逗号，写起来更短。选项解析失败，或者解析出来是列表而不是映射时，构建会给出带源码行号的警告，页面上显示你写的源码，而不是一张空白图。

## 多序列折线 {#line}

`series` 是一个列表，每一项是一条线；有了 `legend`，读者点击图例名称就能隐藏对应的线。下面是 PostgreSQL 各大版本的发布年份，以及按社区五年支持策略计算的支持终止年份：

````markdown {title="源码"}
```echarts {height="360px"}
tooltip:
  trigger: axis
legend:
  data: [发布年份, 支持终止]
grid:
  left: 56
  right: 24
  top: 48
  bottom: 40
xAxis:
  type: category
  name: 大版本
  data: ["9.6", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
yAxis:
  type: value
  min: 2015
  max: 2031
  name: 年份
series:
  - name: 发布年份
    type: line
    smooth: false
    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  - name: 支持终止
    type: line
    lineStyle:
      type: dashed
    data: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
```
````

```echarts {height="360px"}
tooltip:
  trigger: axis
legend:
  data: [发布年份, 支持终止]
grid:
  left: 56
  right: 24
  top: 48
  bottom: 40
xAxis:
  type: category
  name: 大版本
  data: ["9.6", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
yAxis:
  type: value
  min: 2015
  max: 2031
  name: 年份
series:
  - name: 发布年份
    type: line
    smooth: false
    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  - name: 支持终止
    type: line
    lineStyle:
      type: dashed
    data: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
```

版本号加了引号，因为 YAML 会把不带引号的 `10`、`9.6` 读成数字，而分类轴上的标签必须是字符串。

## 饼图与环形图 {#pie}

给 `radius` 两个值，饼图中间就挖出一个洞，成为环形图。下面是 OINK 的 30 个 shortcode 按用途的构成：

````markdown {title="源码"}
```echarts {height="340px"}
tooltip:
  trigger: item
  formatter: "{b}：{c} 个（{d}%）"
legend:
  bottom: 0
series:
  - type: pie
    radius: [42%, 70%]
    itemStyle:
      borderRadius: 6
      borderWidth: 2
    label:
      formatter: "{b} {c}"
    data:
      - { value: 15, name: 核心组件 }
      - { value: 10, name: Book 编号与索引 }
      - { value: 3, name: 发布与下载 }
      - { value: 2, name: OpenAPI }
```
````

```echarts {height="340px"}
tooltip:
  trigger: item
  formatter: "{b}：{c} 个（{d}%）"
legend:
  bottom: 0
series:
  - type: pie
    radius: [42%, 70%]
    itemStyle:
      borderRadius: 6
      borderWidth: 2
    label:
      formatter: "{b} {c}"
    data:
      - { value: 15, name: 核心组件 }
      - { value: 10, name: Book 编号与索引 }
      - { value: 3, name: 发布与下载 }
      - { value: 2, name: OpenAPI }
```

`{b}`、`{c}`、`{d}` 是 ECharts 的占位符，分别代表名称、数值与百分比。大多数标签与提示框用带占位符的格式字符串就能写出来，用不着函数。

## 高度与通栏 {#size}

`height` 默认 `400px`，接受 `px`、`rem`、`em`、`vh`、`vw` 与 `%`。`full=true` 让图表突破正文栏宽，铺满整个内容区，数据点多或标签长时就有了足够的空间：

````markdown {title="源码"}
```echarts {height="260px" full=true}
tooltip:
  trigger: axis
grid:
  left: 48
  right: 16
  top: 24
  bottom: 32
xAxis:
  type: category
  data: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
yAxis:
  type: value
  name: 每秒查询数
series:
  - type: bar
    data: [310, 280, 260, 250, 255, 290, 420, 780, 1150, 1320, 1380, 1400, 1290, 1350, 1410, 1380, 1300, 1180, 960, 820, 700, 590, 470, 380]
```
````

```echarts {height="260px" full=true}
tooltip:
  trigger: axis
grid:
  left: 48
  right: 16
  top: 24
  bottom: 32
xAxis:
  type: category
  data: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
yAxis:
  type: value
  name: 每秒查询数
series:
  - type: bar
    data: [310, 280, 260, 250, 255, 290, 420, 780, 1150, 1320, 1380, 1400, 1290, 1350, 1410, 1380, 1300, 1180, 960, 820, 700, 590, 470, 380]
```

`360`、`36pt` 这样的无效高度会告警，并使用 `400px`。

## 深浅色 {#theme}

不写 `theme` 时，图表采用读者当前的配色模式，读者切换时就地重绘，不刷新页面；容器尺寸变化时图表也会随之调整。把本页切换到深色模式，上面每张图的底色与文字都会跟着变。

写定 `theme` 后，两种模式下颜色都不变：

````markdown {title="源码"}
```echarts {height="240px" theme="dark"}
xAxis:
  type: category
  data: [replica-1, replica-2, replica-3, replica-4]
yAxis:
  type: value
  name: 延迟（毫秒）
series:
  - type: bar
    data: [12, 8, 15, 9]
```
````

```echarts {height="240px" theme="dark"}
xAxis:
  type: category
  data: [replica-1, replica-2, replica-3, replica-4]
yAxis:
  type: value
  name: 延迟（毫秒）
series:
  - type: bar
    data: [12, 8, 15, 9]
```

ECharts 内置的主题只有 `dark`。除非品牌要求固定配色，否则不写 `theme`，让图表与页面其它部分保持一致。

要用自己的主题，就以围栏里写的主题名为键，把它定义在 `window.OinkEchartsThemes` 上。ECharts 要等第一张图表进入视野才加载，站点脚本找不到时机自己调用 `echarts.registerTheme()`；因此每张图表在绘制前，会先注册它在这里找到的全部主题：

````markdown {title="源码"}
<script>
  window.OinkEchartsThemes = window.OinkEchartsThemes || {};
  window.OinkEchartsThemes.brand = {
    color: ['#0b5394', '#e69138', '#6aa84f', '#a64d79'],
    backgroundColor: '#f7f9fc',
  };
</script>

```echarts {height="240px" theme="brand"}
legend: {}
xAxis:
  type: category
  data: [周一, 周二, 周三, 周四, 周五]
yAxis:
  type: value
  name: 查询（千次/秒）
series:
  - name: 主库
    type: bar
    data: [42, 45, 51, 48, 39]
  - name: 从库
    type: bar
    data: [31, 33, 36, 35, 30]
```
````

<script>
  window.OinkEchartsThemes = window.OinkEchartsThemes || {};
  window.OinkEchartsThemes.brand = {
    color: ['#0b5394', '#e69138', '#6aa84f', '#a64d79'],
    backgroundColor: '#f7f9fc',
  };
</script>

```echarts {height="240px" theme="brand"}
legend: {}
xAxis:
  type: category
  data: [周一, 周二, 周三, 周四, 周五]
yAxis:
  type: value
  name: 查询（千次/秒）
series:
  - name: 主库
    type: bar
    data: [42, 45, 51, 48, 39]
  - name: 从库
    type: bar
    data: [31, 33, 36, 35, 30]
```

主题是 ECharts 主题格式的普通对象，例如其主题构建工具导出的 JSON。要让每个页面都能用，把这段脚本放进 `layouts/_partials/hooks/body-end.html`，而不是写在某个页面里。哪里都没有定义的名字会以 ECharts 默认配色绘制，不会告警；名为 `dark` 的条目会替换未设置 `theme` 的图表在深色模式下使用的配色。

## 回调：`$fn:` {#callbacks}

围栏里是数据，不能写 JavaScript。某个选项需要函数时，例如要计算占比的提示框、随数值变化的颜色，在选项里写字符串 `"$fn:名字"`，再在 `window.OinkEchartsFunctions` 上用这个名字注册一个函数：

````markdown {title="源码"}
<script>
  window.OinkEchartsFunctions = window.OinkEchartsFunctions || {};
  window.OinkEchartsFunctions.tableShare = function (params) {
    var p = params[0];
    return p.name + '：' + p.value + ' GB，占整个数据库的 ' + Math.round((p.value / 60) * 100) + '%';
  };
</script>

```echarts {height="300px"}
tooltip:
  trigger: axis
  formatter: "$fn:tableShare"
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
series:
  - type: bar
    data: [4, 4, 8, 22, 15, 7]
```
````

<script>
  window.OinkEchartsFunctions = window.OinkEchartsFunctions || {};
  window.OinkEchartsFunctions.tableShare = function (params) {
    var p = params[0];
    return p.name + '：' + p.value + ' GB，占整个数据库的 ' + Math.round((p.value / 60) * 100) + '%';
  };
</script>

```echarts {height="300px"}
tooltip:
  trigger: axis
  formatter: "$fn:tableShare"
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
series:
  - type: bar
    data: [4, 4, 8, 22, 15, 7]
```

把鼠标移到任意一根柱子上，提示框里就是这个函数拼出的句子。没有注册的名字会变成 `undefined`，图表按没有这个选项的样子绘制，构建时和浏览器里都不会有任何警告，所以把脚本紧挨着围栏放，两者一起修改。这段脚本是站点自己的代码，要像其它代码一样经过审查；站点设置了内容安全策略（CSP）时，按[部署](/zh/docs/admin/deploy/#csp)中的说明放行它。只有带 `{b}`、`{c}`、`{d}` 的格式字符串做不到时，才写函数。

## 数据位置 {#data}

Hugo 不会在围栏里展开 shortcode、front matter 值或 `data/` 目录下的文件，所以数字就写在围栏里。这样两张图无法共用一份数据，但每张图都和自己的数据放在一起，diff 能准确显示改了哪个数。

经常变动的数据，例如版本矩阵、下载清单，不适合做成图表，改用[表格](/zh/docs/components/table/)，或者[发布与下载页](/zh/docs/write/releases/)里由 `data/` 驱动的组件。

## 输出形态 {#outputs}

打印与 RSS 中显示的是围栏里的选项源码而不是图表，页面的 Markdown 输出则原样保留围栏。图表要说明的结论请在正文里写出来，这些读者也能看到。

## 参数参考 {#reference}

围栏属性行（```` ```echarts {…} ````）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `height` | CSS 长度 | `400px` | 只接受非负数字加 `px` `rem` `em` `vh` `vw` `%`；其它写法告警并使用默认值 |
| `theme` | string | 未设置 | 固定使用某个 ECharts 主题，不再跟随站点配色；内置 `dark`，其它名字来自 `window.OinkEchartsThemes` |
| `full` | bool | `false` | `true` 去掉正文栏宽限制，图铺满内容区；`true`、`false` 以外的值告警并使用 `false` |
| `class` | 空格分隔的 class | — | 透传给容器，供站点 CSS 使用 |
{.fields meta="type default"}

未知属性告警并忽略；`style` 被 Hugo 当作高亮选项取走，`on*` 被 Hugo 剥离，二者静默忽略。空围栏会告警，什么也不渲染。选项键本身属于 ECharts，以它的[选项手册](https://echarts.apache.org/zh/option.html)为准。ECharts 在 `hugo.yml` 里没有任何站点级设置。

## 限制与常见问题 {#limits}

- 围栏里不能写 JavaScript；函数要通过 `$fn:` 传入，主题要通过 `window.OinkEchartsThemes` 提供，名字没有注册时会悄无声息地失效。
- 围栏读不到 `data/`、front matter 或 shortcode，数字必须写在围栏里。
- 分类轴上的 `10`、`9.6`、`on`、`yes` 要加引号，否则 YAML 会把它们变成数字或布尔值。
- 不要只靠颜色区分序列，同时变换线型或标记形状，并在两种配色模式下检查图例的对比度。

## 相关 {#related}

- [Infographic](/zh/docs/components/infographic/) — 表达结构与顺序的信息图，不是统计图
- [表格](/zh/docs/components/table/) — 数据少、需要精确读数时用表格
- [Mermaid](/zh/docs/components/mermaid/) — 关系图与流程图
- [代码块](/zh/docs/components/code/) — 围栏属性行的通用规则
