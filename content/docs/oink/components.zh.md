---
title: 内容组件
weight: 40
description: OINK 新增的本地、可复用内容组件
---

OINK 把已经在多个 PGSTY 站点证明具有复用价值的内容组件纳入主题。每个组件都有稳定的作者接口、唯一实例 ID、本地资源和明确的安全边界。站点专用的数据控件仍然留在主题之外。

## 加载模型 {#loading-model}

交互式短代码会标记页面实际使用的功能。OINK 随后为每个所需样式或运行时只加入一次，即使页面中存在多个组件实例也不例外。普通页面不会下载从未使用的组件代码。

相对资源与链接参数会经过 Hugo URL 处理，因此部署到 `baseURL`
子路径时仍然正确。在适用情况下，组件标记还覆盖打印、深色模式、移动端、键盘操作与减少动态效果偏好。

## Asciinema {#asciinema}

使用 `asciinema` 播放保存在本地的 `.cast` 终端录像：

```go-html-template
{{</* asciinema file="images/install.cast" speed="1.5" */>}}
```

{{< asciinema file="images/install.cast" speed="1.5" >}}

`file` 是必填参数，也可以作为第一个位置参数传入。终端窗口优先显示显式传入的
`title`，没有 `title` 时显示 `file` 的值。支持的选项包括 `title`、`theme`、
`fit`（`width`、`height`、`both` 或 `none`）、`autoplay`、`loop`、`preload`、
`speed`、`startAt`、`poster`、`cols`、`rows`、`idleTimeLimit`、
`pauseOnMarkers`，以及逗号分隔的 `markers`。

为了离线使用，请把 cast 文件保存在本地。只有作者显式提供远程 URL 时，组件才会访问远端。

## ECharts {#echarts}

短代码接受 JSON 或 YAML，并把解析后的值序列化到 `application/json` 元素中：

{{< echarts height="520px" >}}

```js
var fmt = function (params) {
  if (!params || !params.length || params[0].name === '') return '';
  return (
    '<b>' +
    params[0].name +
    '</b><br/>' +
    params
      .filter((p) => p.value !== '-' && p.value != null)
      .map((p) => p.marker + ' ' + p.seriesName + ': ' + p.value + 's')
      .join('<br/>')
  );
};
```

```yaml
tooltip: { trigger: axis, axisPointer: { type: shadow }, formatter: $fn:fmt }
legend: { top: 0, itemGap: 12, data: [租约过期, 从库检测, 抢锁提拔, 健康检查] }
grid: { left: 64, right: 24, bottom: 32, top: 40 }
xAxis:
  {
    type: value,
    name: 秒,
    nameLocation: end,
    max: 160,
    axisLine: { show: true },
    axisTick: { show: true },
    splitLine: { show: true, lineStyle: { type: dashed, opacity: 0.5 } },
    minorTick: { show: true, splitNumber: 5 },
    minorSplitLine: { show: true, lineStyle: { type: dotted, opacity: 0.2 } },
  }
yAxis:
  {
    type: category,
    axisLine: { show: true },
    axisTick: { show: true },
    splitLine: { show: false },
    axisLabel: { fontSize: 10, fontFamily: monospace },
    data:
      [
        wide-max,
        wide-avg,
        wide-min,
        '',
        safe-max,
        safe-avg,
        safe-min,
        '',
        norm-max,
        norm-avg,
        norm-min,
        '',
        fast-max,
        fast-avg,
        fast-min,
      ],
  }
series:
  - {
      name: 租约过期,
      type: bar,
      stack: main,
      barWidth: 20,
      z: 2,
      emphasis: { focus: series },
      itemStyle: { color: '#e15759' },
      data: [120, 110, 100, '-', 60, 55, 50, '-', 30, 27, 25, '-', 20, 17, 15],
    }
  - {
      name: 从库检测,
      type: bar,
      stack: main,
      z: 2,
      emphasis: { focus: series },
      itemStyle: { color: '#edc949' },
      data: [20, 10, 0, '-', 10, 5, 0, '-', 5, 3, 0, '-', 5, 3, 0],
    }
  - {
      name: 抢锁提拔,
      type: bar,
      stack: main,
      z: 2,
      emphasis: { focus: series },
      itemStyle: { color: '#59a14f' },
      data: [2, 1, 0, '-', 2, 1, 0, '-', 2, 1, 0, '-', 2, 1, 0],
    }
  - {
      name: 健康检查,
      type: bar,
      stack: main,
      z: 2,
      emphasis: { focus: series },
      itemStyle: { color: '#4e79a7' },
      data: [8, 6, 4, '-', 6, 5, 3, '-', 4, 3, 2, '-', 2, 2, 1],
    }
  - {
      name: RTO总计,
      type: bar,
      barGap: '-100%',
      barWidth: 20,
      z: 1,
      itemStyle: { color: '#888', opacity: 0 },
      emphasis: { itemStyle: { opacity: 0 } },
      data: [150, 127, 104, '-', 78, 66, 53, '-', 41, 34, 27, '-', 29, 23, 16],
    }
  - {
      name: RTO预算,
      type: bar,
      barGap: '-100%',
      barWidth: 20,
      z: 0,
      itemStyle: { color: 'rgba(0,0,0,0.08)' },
      emphasis: { itemStyle: { color: 'rgba(0,0,0,0.12)' } },
      data: [150, 150, 150, '-', 90, 90, 90, '-', 45, 45, 45, '-', 30, 30, 30],
    }
```

{{< /echarts >}}

`height` 默认为 `400px`，并且必须使用安全的 CSS 长度单位。`theme`
用来选择 ECharts 主题，`full=true` 则移除通常的正文宽度限制。

需要回调的图表可以加入 JavaScript 围栏代码块，再从 JSON/YAML 选项中通过
`$fn:name`
引用其中声明的函数。代码会在访问者的浏览器中执行，因此只能使用受信任作者提交并经过审查的代码；无需回调时应优先使用结构化选项。

## Infographic {#infographic}

`infographic` 使用本地运行时渲染 AntV Infographic DSL：

```go-html-template
{{</* infographic */>}}
infographic list-row-simple-horizontal-arrow
data
  items
    - label 源码
      desc Markdown 与配置
    - label 构建
      desc Hugo Extended
    - label 发布
      desc 静态文件
{{</* /infographic */>}}
```

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-row-simple-horizontal-arrow
data
  title 租约过期故障切换流程
  desc 当整个节点宕机，Patroni 无法主动释放租约，只能等待 TTL 过期
  items
    - label 租约过期
      desc Patroni 失联，被动等待主库租约 TTL 过期
      icon mingcute/close-circle-fill
    - label 从库检测
      desc 从库从循环中醒来后发现租约过期，开始竞选
      icon mingcute/key-2-fill
    - label 抢锁提拔
      desc 从库相互比较并抢锁，胜利者提升自己的PG
      icon mingcute/radar-fill
    - label 健康检查
      desc HAPROXY 健康检查发现新主上线，分配流量
      icon mingcute/arrow-up-circle-fill
theme light
  palette antv
{{< /infographic >}}

<!-- prettier-ignore-end -->

`height` 接受 `auto` 或安全 CSS 长度；`full=true`
会移除通常的正文宽度限制。DSL 会作为数据序列化，而不是作为可执行脚本插入页面。

## 卡片与轮播 {#cards-and-carousel}

`doc-card` 与 `nav-card` 共用同一套卡片实现；`doc-cards` 与 `nav-cards`
可以创建一至四列的响应式卡片组。这些别名让现有站点内容继续使用语义最贴切的名称，同时避免复制标记与样式。

```go-html-template
{{</* nav-cards cols="3" */>}}
  {{</* nav-card
    title="架构"
    link="/zh/docs/oink/architecture/"
    icon="fa-solid fa-diagram-project"
    desc="了解构建与运行时边界。"
  */>}}
  {{</* nav-card
    title="部署"
    link="/zh/docs/oink/deployment/"
    badge="仅依赖 Hugo"
  */>}}发布静态输出。{{</* /nav-card */>}}
{{</* /nav-cards */>}}
```

<!-- prettier-ignore-start -->

{{< nav-cards cols="3" >}}
{{< nav-card title="架构" link="/zh/docs/oink/architecture/" icon="fa-solid fa-diagram-project" desc="了解构建与运行时边界。" />}}
{{< nav-card title="部署" link="/zh/docs/oink/deployment/" badge="仅依赖 Hugo" >}}发布静态输出。{{< /nav-card >}}
{{< /nav-cards >}}

<!-- prettier-ignore-end -->

卡片接受 `title`、`link`、`image`、`alt`、`icon`、`desc`、`accent` 与
`badge`。卡片正文可以包含 Markdown 链接。`desc` 中的 `{version}`
之类 token，在站点参数存在同名值时会被替换。

把文档卡片放进 `doc-carousel`，即可生成无障碍横向轮播：

```go-html-template
{{</* doc-carousel label="OINK 工作流" */>}}
  {{</* doc-card title="编写" */>}}创建成对内容。{{</* /doc-card */>}}
  {{</* doc-card title="构建" */>}}运行 Hugo Extended。{{</* /doc-card */>}}
  {{</* doc-card title="验证" */>}}检查静态站点。{{</* /doc-card */>}}
{{</* /doc-carousel */>}}
```

<!-- prettier-ignore-start -->

{{< doc-carousel label="OINK 工作流" >}}
{{< doc-card title="编写" >}}创建成对内容。{{< /doc-card >}}
{{< doc-card title="构建" >}}运行 Hugo Extended。{{< /doc-card >}}
{{< doc-card title="验证" >}}检查静态站点。{{< /doc-card >}}
{{< /doc-carousel >}}

<!-- prettier-ignore-end -->

`label`
提供轮播的无障碍名称。方向键与可见的上一个/下一个按钮都能移动轨道；启用减少动态效果偏好时，不必要的动画会被禁用。

## 折叠块 {#details}

`details` 输出原生 `details` 与 `summary` 元素：

```go-html-template
{{%/* details title="为什么只依赖 Hugo？" closed="false" */%}}
已经提交的浏览器资源让消费端构建保持可复现。
{{%/* /details */%}}
```

<!-- prettier-ignore-start -->

{{% details title="为什么只依赖 Hugo？" closed="false" %}}
已经提交的浏览器资源让消费端构建保持可复现。
{{% /details %}}

<!-- prettier-ignore-end -->

`title` 设置摘要。折叠块默认关闭；设置 `closed=false` 可让它初始展开。

## 标签页 {#tabs}

OINK 沿用 Docsy 的 `tabpane` 与 `tab` 创作模型，同时保留导入站点依赖的
`selected=true` 与空白处理行为：

```go-html-template
{{</* tabpane text=true */>}}
  {{</* tab header="本地" selected=true */>}}
  使用完整本地主题构建。
  {{</* /tab */>}}
  {{</* tab header="Cloudflare" */>}}
  从源分支运行同一条 Hugo 命令。
  {{</* /tab */>}}
{{</* /tabpane */>}}
```

<!-- prettier-ignore-start -->

{{< tabpane text=true >}}
{{< tab header="本地" selected=true >}}
使用完整本地主题构建。
{{< /tab >}}
{{< tab header="Cloudflare" >}}
从源分支运行同一条 Hugo 命令。
{{< /tab >}}
{{< /tabpane >}}

<!-- prettier-ignore-end -->

Markdown 内容应设置
`text=true`；否则标签页会按代码进行语法高亮。标签页还支持按语言保存选择、禁用标签，以及右对齐条目。生成的标签与面板 ID 会形成正确的 ARIA 对应关系。

## 参数 {#parameters}

`param` 输出页面参数；页面没有该参数时，会回退到同名站点参数：

```go-html-template
当前版本：{{</* param version */>}}
```

当前版本：`{{< param version >}}`

指定参数不存在时，短代码会让构建失败。这是有意设计：缺少发布版本或仓库信息时，不应悄悄生成误导性文档。

## 现有富内容能力 {#existing-rich-content}

OINK 也为继承而来的内容功能提供本地运行时：

- `mermaid`、`math` 与 `markmap` 围栏代码块；
- `swaggerui` 与 `redoc` API 文档短代码；
- Docsy blocks、alert、image、include、readfile、cards 等既有短代码。

完整创作参考详见[短代码](/zh/docs/content/shortcodes/)与[图表和公式](/zh/docs/content/diagrams-and-formulae/)。

## 创作规则 {#authoring-rules}

- 优先使用结构化数据，而不是可执行内容。
- 为图片编写有意义的 `alt` 文本，并为轮播设置清晰的 `label`。
- 除非内容确实需要，否则不要启用自动播放。
- 创建新包装组件时，要在同一页测试多个完全相同的实例。
- 检查键盘导航、焦点可见性、深浅色主题、移动布局、打印输出与减少动态效果行为。
- 把带有业务语义的数据组件留在消费站点。
