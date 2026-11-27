---
title: 地图
linkTitle: 地图
description: 在 `map` 围栏里列出地点。每种输出都显示带编号的地点列表；站点配置了瓦片服务时，HTML 还会加上一张交互地图，标记点编号与列表一一对应。
weight: 178
search_keywords: [地图, 地点, 标记点, 路线, 弹窗, 瓦片, 坐标, 旅行, map, OpenStreetMap, Leaflet, tiles, WGS 84]
---

`map` 围栏的正文是一份 YAML 或 JSON 地点列表。每种输出都把它渲染成带编号的列表：名称、备注、缩略图，以及链接到 OpenStreetMap 的坐标。
这份列表就是内容本身。站点配置了瓦片服务时，HTML 页面还会在列表上方显示一张交互地图，标记点的编号与列表对应。
适用于有先后顺序的一组地点：游记、场馆与办公地点、实地考察、图片随笔。
只需列出地址、不需要地图时用[表格](/zh/docs/components/table/)；地图本身是一张绘制好的图时用[图片](/zh/docs/components/image/)。

## 最简例子 {#minimal}

每个地点需要 `name`、`lat` 和 `lng`。

````markdown {title="源码"}
```map
- name: 金阁寺
  lat: 35.0394
  lng: 135.7292
- name: 清水寺
  lat: 34.9949
  lng: 135.7850
- name: 伏见稻荷大社
  lat: 34.9671
  lng: 135.7727
```
````

```map
- name: 金阁寺
  lat: 35.0394
  lng: 135.7292
- name: 清水寺
  lat: 34.9949
  lng: 135.7850
- name: 伏见稻荷大社
  lat: 34.9671
  lng: 135.7727
```

本站配置了瓦片服务，所以列表上方出现了地图。标记点带着列表编号；地点不止一个时，地图会缩放到恰好容纳全部地点。
每组坐标都链接到 openstreetmap.org 上的对应位置。这是一个普通的外链，页面本身不会发出请求。
正文按 YAML 解析。JSON 也是合法的 YAML，所以 `[{"name": "京都站", "lat": 34.9858, "lng": 135.7589}]` 同样可用。

## 地点字段 {#places}

除了 `name` 和坐标，一个地点还可以有备注、缩略图和链接：

```yaml {title="一个地点写全所有字段"}
- name: 金阁寺
  lat: 35.0394
  lng: 135.7292
  text: 开门时就到，可以避开人潮。
  image: kinkakuji.webp
  link: "#day-1"
```

- `name` 与 `text` 是纯文本，其中的 Markdown 和 HTML 按字面显示。弹窗由这些文本构建，从不使用 HTML。
- `image` 走共用的图片解析：页面资源 → 全局资源 → 静态路径 → 远程 URL。
  本地位图会缩放到 480×360 以内，用于列表和弹窗；远程图片原样使用。
  缩略图是装饰图（`alt=""`），旁边的名称已经说明了它是什么。
- `link` 让名称在列表和弹窗里成为链接，最常见的是同一页面上的 `#anchor`。
  请给它加引号：YAML 会把不加引号的 `#` 当作注释的开始。
- 缺少名称、坐标不是数字、或坐标超出范围的地点会告警并被跳过。
  加了引号的数字（如 `lat: "35.0394"`）是字符串，这样的地点同样会被跳过。
- 未知字段会告警并被忽略。没有任何有效地点的围栏会告警，什么也不渲染。

## 路线与图注 {#route}

`route=true` 按列表顺序用一条线连起各个地点。`caption` 在列表下方加一行纯文本图注，同时作为地图区域供读屏器朗读的名称。

````markdown {title="源码"}
```map {caption="京都一日游" route=true}
- name: 京都站
  lat: 34.9858
  lng: 135.7589
  text: 从这里出发，车站的单独地图见下一节。
  link: "#single"
- name: 伏见稻荷大社
  lat: 34.9671
  lng: 135.7727
  text: 成千上万座朱红鸟居沿山而上。
- name: 清水寺
  lat: 34.9949
  lng: 135.7850
  text: 木造舞台俯瞰整座城市。
- name: 银阁寺
  lat: 35.0270
  lng: 135.7982
  text: 哲学之道从寺门前开始。
- name: 金阁寺
  lat: 35.0394
  lng: 135.7292
  text: 贴满金箔的楼阁倒映在池中。
```
````

```map {caption="京都一日游" route=true}
- name: 京都站
  lat: 34.9858
  lng: 135.7589
  text: 从这里出发，车站的单独地图见下一节。
  link: "#single"
- name: 伏见稻荷大社
  lat: 34.9671
  lng: 135.7727
  text: 成千上万座朱红鸟居沿山而上。
- name: 清水寺
  lat: 34.9949
  lng: 135.7850
  text: 木造舞台俯瞰整座城市。
- name: 银阁寺
  lat: 35.0270
  lng: 135.7982
  text: 哲学之道从寺门前开始。
- name: 金阁寺
  lat: 35.0394
  lng: 135.7292
  text: 贴满金箔的楼阁倒映在池中。
```

选中一个标记点会打开它的弹窗：名称、备注，有缩略图时还有缩略图。第一个地点链接到下一节。
这条线是地点之间的直线连接，不是计算出来的步行或驾车路线。

## 单个地点与缩放 {#single}

只有一个地点时，地图以 15 级缩放打开。`zoom` 可以指定别的级别，从 1（整个世界）到 19（一个街角）。
`height` 用 CSS 长度指定地图高度。

````markdown {title="源码"}
```map {zoom=17 height="18rem"}
- name: 京都站
  lat: 34.9858
  lng: 135.7589
  text: 从大阪和东京来的列车都到这里。
```
````

```map {zoom=17 height="18rem"}
- name: 京都站
  lat: 34.9858
  lng: 135.7589
  text: 从大阪和东京来的列车都到这里。
```

有多个地点时，`zoom` 替换自动适配出的缩放级别，中心点保持不变。
不写 `height` 时，地图高度是 `min(26rem, 60vh)`，在手机上总能把它滚动过去。
`height` 接受数字加 `px`、`rem`、`em`、`vh`、`vw` 或 `%`，其他写法会告警并保留默认值。

## 交互地图 {#interactive}

- 主题内置 Leaflet 1.9.4。只有含地图的页面才引用它的样式表，
  引擎脚本也只在地图进入视口 320px 范围内时才加载。
- 滚轮缩放是关闭的，滚动页面永远不会缩放地图。
  可以用缩放按钮、键盘（先聚焦地图，再用方向键和 <kbd>+</kbd> / <kbd>-</kbd>）或双指捏合来缩放。
- 标记点的编号与列表一致。用指针或 <kbd>Enter</kbd> 选中一个标记点会打开它的弹窗。
  弹窗由文本构建，作者写的 HTML 不会进入弹窗。
- 深色模式下，站点配置了 `dark_tiles` 时地图改用它，读者切换配色时随之切换；没有 `dark_tiles` 时保持浅色瓦片。
- 地图随容器尺寸变化、标签页显示、折叠内容展开而重新计算大小。
- 浏览器打印时隐藏地图，只打印列表。
- 引擎或瓦片加载失败时，列表依然在。

列表始终留在地图下方，既是图例，也是无障碍的替代内容。宽屏上它排成两栏。

## 站点配置 {#configuration}

地图默认关闭。站点通过 `params.map` 和自己选定的瓦片服务开启它。本站的配置如下：

```yaml {title="hugo.yml"}
params:
  map:
    enable: true
    tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    attribution: "© OpenStreetMap contributors"
```

- 主题不指定默认的瓦片服务。`enable: true` 但缺少有效的 `tiles` 或 `attribution` 时会告警，地图保持关闭，围栏仍然渲染地点列表。
- `tiles` 是一个 `https://` URL 模板，必须包含 `{z}`、`{x}` 和 `{y}`。`dark_tiles` 规则相同。
- `attribution` 是瓦片服务要求的署名纯文本，显示在每张地图的角落。
- `max_zoom` 是 1 到 22 的整数，默认 19。

瓦片服务各有使用政策、配额与署名条款，所以选择权属于站点。
本站使用 OpenStreetMap 的标准瓦片。OpenStreetMap 基金会的[瓦片使用政策](https://operations.osmfoundation.org/policies/tiles/)允许在注明署名的前提下少量使用。
访问量大的站点应改用带域名限制密钥的商业瓦片服务，或自建瓦片服务。写在瓦片 URL 里的密钥对每位读者都是可见的。

瓦片请求会把读者的 IP 地址和正在查看的区域发送给瓦片服务。
只有开启了地图的站点才会发出这些请求，而且只在地图进入视野时才开始。

## 坐标 {#coordinates}

坐标使用 WGS 84 十进制度数，也就是 GPS、照片元数据和 OpenStreetMap 采用的坐标系。
显式的 `lat` 与 `lng` 键避免了 GeoJSON `[lng, lat]` 数组那样的顺序混淆。
要查某个地点的坐标，在 openstreetmap.org 上打开它，地址栏末尾就是 `#map=缩放级别/纬度/经度`。

中国大陆的瓦片服务通常使用 GCJ-02 或 BD-09 坐标。
在这些瓦片上，WGS 84 标记点会偏移数百米。主题不做坐标转换，请使用以 WGS 84 为准的瓦片服务。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML，地图关闭 | `<figure class="td-map">`，内含 `<ol class="td-map__places">` 与图注；没有脚本、样式表或瓦片 URL |
| HTML，地图开启 | 同一个 figure 加上 `data-td-map`、列表上方的地图画布和一份地点 JSON；读者接近时加载 Leaflet |
| 打印 | 列表与图注；没有地图 |
| Markdown | 原样输出 `map` 围栏 |
| RSS | 地点列表，缩略图使用绝对 URL |

## 参数参考 {#reference}

地点字段：

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `name` | 纯文本 | — | 必填。列表条目与弹窗标题 |
| `lat` | 数字 | — | 必填。WGS 84 纬度，−90 到 90 |
| `lng` | 数字 | — | 必填。WGS 84 经度，−180 到 180 |
| `text` | 纯文本 | — | 名称下方与弹窗里的备注 |
| `image` | 图片来源 | — | 页面资源 / 全局资源 / 静态路径 / 远程 URL；本地位图会被缩放 |
| `link` | URL | — | 让名称成为链接；常用同页 `#anchor` |
{.fields meta="type default"}

围栏属性：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `caption` | 纯文本 | — | 列表下方的图注，同时作为地图区域的名称 |
| `route` | 布尔 | `false` | `true` 按列表顺序连起各个地点 |
| `zoom` | 整数 | 自动适配 | 1 到 19。不写时：一个地点用 15，否则容纳全部地点 |
| `height` | CSS 长度 | `min(26rem, 60vh)` | 数字加 `px` `rem` `em` `vh` `vw` `%` |
| `tab` | 纯文本 | — | 让这张地图成为一组[标签页](/zh/docs/components/tabs/)里的一页 |
| `group` / `value` | 字符串 | — | 标签页分组与同步值；必须与 `tab` 同时出现 |
| `id` | 元素 ID | 自动生成 | figure 的 ID，便于链接到这张地图 |
| `class` | class 列表 | — | 透传到 figure，供站点 CSS 使用 |
{.fields meta="type default"}

`num`、`style`、`on*` 以及其他属性会告警并被忽略。不写 `id` 时，figure 的 ID 由主题生成。

站点参数（`hugo.yml`）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.map.enable` | 布尔 | `false` | 开启交互地图；需要 `tiles` 与 `attribution` |
| `params.map.tiles` | URL 模板 | — | `https://`，包含 `{z}`、`{x}`、`{y}` |
| `params.map.attribution` | 字符串 | — | 瓦片服务要求的纯文本署名 |
| `params.map.dark_tiles` | URL 模板 | — | 可选；深色模式下使用 |
| `params.map.max_zoom` | 整数 | `19` | 1 到 22 |
{.fields meta="type default"}

## 限制与常见问题 {#limits}

- 只支持 WGS 84 坐标。在 GCJ-02 或 BD-09 瓦片上，标记点会出现偏移。
- 不支持 GPX 或 GeoJSON 轨迹、标记点聚合、搜索、地理编码与自定义标记点图标。
- 暂不从照片的 GPS 元数据生成标记点，请手写坐标。
- 站点没有配置瓦片服务时没有地图，只有列表。打印、RSS 与 LLMS 的读者总是拿到列表或围栏源码。
- `name`、`text` 与 `caption` 都是纯文本。富文本请写在围栏旁边的段落里。
- 远程缩略图在构建期不下载，也不缩放。

## 相关 {#related}

- [画廊](/zh/docs/components/gallery/) — 地图上这些地点拍下的照片
- [图片](/zh/docs/components/image/) — 缩略图从哪里来
- [标签页](/zh/docs/components/tabs/) — 旅程中每天一张地图
- [Expo 布局](/zh/docs/write/expo/) — 图片随笔与展览
- [Draw.io](/zh/docs/components/drawio/) — 另一个在站点指定服务之前保持关闭的功能
