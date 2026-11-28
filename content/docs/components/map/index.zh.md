---
title: 地图
linkTitle: 地图
description: 在 `map` 围栏里列出地点，HTML、打印与 RSS 都显示带编号的地点列表。站点指定瓦片服务后，网页上还会多一张交互地图。
weight: 290
search_keywords: [地图, 地点, 标记点, 路线, 弹窗, 瓦片, 坐标, 旅行, 北京, 故宫, map, OpenStreetMap, Leaflet, tiles, WGS 84]
---

`map` 围栏适合一组有先后顺序、彼此相关的地点：一次旅行的各站、公司的几处办公室、一场会议的几个场馆、一次野外调查的采样点。你用一小段 YAML 列出这些地点，HTML、打印与 RSS 把它们渲染成带编号的列表，包含名称、备注、缩略图，以及链接到 OpenStreetMap 的坐标。禁用 JavaScript 时列表仍然可读。Markdown 与 LLMS 保留原始 YAML 围栏。

列表上方的交互地图则需要站点自己开启。地图瓦片是读者浏览器从第三方瓦片服务下载的图片，每家服务都有自己的使用政策、配额和署名要求，所以主题不替你选：在 `params.map` 里写好瓦片地址和署名之前（见[站点配置](#configuration)），页面只显示列表，不发出任何地图请求。

只需列出地址、不需要地图时，用[表格](/zh/docs/components/table/)就够了；地图本身是一张绘制好的图时，用[图片](/zh/docs/components/image/)。

## 最简例子 {#minimal}

每个地点需要 `name`、`lat` 和 `lng`。

````markdown {title="源码"}
```map
- name: 故宫
  lat: 39.9159
  lng: 116.3908
- name: 天坛
  lat: 39.8822
  lng: 116.4066
- name: 颐和园
  lat: 39.9901
  lng: 116.2647
```
````

```map
- name: 故宫
  lat: 39.9159
  lng: 116.3908
- name: 天坛
  lat: 39.8822
  lng: 116.4066
- name: 颐和园
  lat: 39.9901
  lng: 116.2647
```

本站配置了瓦片服务，所以列表上方出现了地图：标记点的编号与列表一致，地图自动缩放到恰好容纳所有地点。没有配置瓦片服务的站点，同一个围栏只渲染列表。每组坐标都链接到 openstreetmap.org 上的对应位置，这是读者可以点击的普通链接，页面本身不会发出请求。

正文按 YAML 解析。JSON 也是合法的 YAML，所以 `[{"name": "故宫", "lat": 39.9159, "lng": 116.3908}]` 同样可用。

## 站点配置 {#configuration}

地图默认关闭。要开启它，先选定一家瓦片服务，再写进 `hugo.yml`。本站使用 OpenStreetMap 的标准瓦片：

```yaml {title="hugo.yml — OpenStreetMap（轻度使用）"}
params:
  map:
    enable: true
    tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    attribution: "© OpenStreetMap contributors"
    attribution_url: https://www.openstreetmap.org/copyright
```

```yaml {title="hugo.yml — 商业服务（带暗色瓦片与子域名）"}
params:
  map:
    enable: true
    tiles: https://{s}.tiles.example.com/light/{z}/{x}/{y}{r}.png?apikey=YOUR_DOMAIN_RESTRICTED_KEY
    dark_tiles: https://{s}.tiles.example.com/dark/{z}/{x}/{y}{r}.png?apikey=YOUR_DOMAIN_RESTRICTED_KEY
    subdomains: abcd
    attribution: "© Example Maps, © OpenStreetMap contributors"
    attribution_url: https://www.openstreetmap.org/copyright
    max_zoom: 20
```

```yaml {title="hugo.yml — 自建瓦片并开启点击后加载"}
params:
  map:
    enable: true
    tiles: https://tiles.your-domain.example/styles/basic/{z}/{x}/{y}.png
    attribution: "Map data © OpenStreetMap contributors"
    attribution_url: https://www.openstreetmap.org/copyright
    loading: click
```

- `tiles` 是 `https://` 开头的 URL 模板，必须包含 `{z}`、`{x}` 和 `{y}`（支持 `{s}` 子域名、`{r}` 高清后缀与按 TMS 行序编号的 `{-y}`）。其他占位符（如 `{apikey}`、`{accessToken}`）没有可填的值：请把密钥直接写进 URL，否则该模板会告警并被忽略。可选的 `dark_tiles` 规则相同，在深色模式下使用。
- `attribution` 是瓦片服务要求的纯文本署名，显示在每张地图的角落。补充 `attribution_url`（`https://`）可在不接受作者 HTML 的前提下把署名渲染为可点击链接——OpenStreetMap 的[署名规范](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines)要求网页交互地图链接到 `https://www.openstreetmap.org/copyright`。
- 浅色和深色瓦片的主机名都只允许 `{s}` 占位。缩放级别和坐标写在路径或查询参数中。
- `subdomains` 在 `tiles` 使用 `{s}` 时覆盖 Leaflet 默认的 `abc`（例如 `abcd` 或 `"01234567"`）。纯数字要加引号：YAML 会把不加引号的 `01234567` 读成数值，构建随之告警并改用 Leaflet 的默认值。
- `max_zoom` 是 1 到 22 的整数，默认 19。
- `loading` 可选 `lazy`（默认：地图位于屏幕内、视口下方 320px 以内，或位于阅读位置上方任意处时加载）或 `click`（先显示按钮，列出地图可能请求的全部瓦片域名，包括 `dark_tiles`，`{s}` 写作 `*`；读者点击后才发瓦片请求；键盘焦点仍在按钮上时，加载成功后移到地图，失败时移到首个坐标链接）。
- 写了 `enable: true` 却缺少有效的 `tiles` 或 `attribution` 时，构建告警，地图保持关闭。这样，一份没写完的配置不会把读者引向你尚未同意其条款的服务；围栏照常渲染地点列表。
- `tiles`、`dark_tiles`、`attribution_url` 与 `subdomains` 的首尾空白会被去掉。未知键会告警并被忽略，`maxZoom` 这类驼峰写法也一样（Hugo 会把它转成小写），请写 `max_zoom`。

按访问量选择服务。OpenStreetMap 基金会的[瓦片使用政策](https://operations.osmfoundation.org/policies/tiles/)允许在附带版权链接署名的前提下少量使用其标准瓦片；访问量大的站点应改用带域名限制密钥的商业瓦片服务，或自建瓦片服务。写在瓦片 URL 里的密钥对每位读者都可见，所以必须把它限制在你自己的域名上。

每次瓦片请求都会把读者的 IP 地址和正在查看的区域发给瓦片服务。只有开启了地图的站点才会发出这些请求。默认的 `lazy` 加载在地图接近视口时开始请求；读者从链接直接打开靠后的小节时，上方的所有地图会立即加载，正在读的文字就不会在稍后被推下去。如果读者同意之前不允许发出任何瓦片请求，请设为 `loading: click`，点击按钮之前什么都不请求。无论哪种方式，如果站点有隐私声明，请把这家服务写进去。

## 地点字段 {#places}

除了 `name` 和坐标，一个地点还可以带备注、缩略图和链接：

```yaml {title="一个地点写全所有字段"}
- name: 故宫
  lat: 39.9159
  lng: 116.3908
  text: 上午从午门入宫，避开中轴人流高峰。
  image: forbidden-city.webp
  link: "#single"
```

- `name` 与 `text` 是纯文本，其中的 Markdown 和 HTML 按字面显示；弹窗由这些文本构建，从不使用 HTML。
- `image` 按普通图片的顺序查找：页面资源、全局资源、静态路径、远程 URL。本地位图会缩放到 480×360 以内，用于列表和弹窗，并在两处都带上宽高，弹窗在图片加载时保持尺寸不变；远程图片原样使用。缩略图是装饰图（`alt=""`），因为旁边的名称已经说明了它是什么。下一节的路线地图就使用了放在本页 `index.zh.md` 旁边的四张本地插图。
- `link` 让名称在列表和弹窗里成为链接，最常见的是同一页面上的 `#anchor`。请给它加引号，因为 YAML 会把不加引号的 `#` 当作注释的开始。
- 缺少名称、坐标不是数字、或坐标超出范围的地点会告警并被跳过。加了引号的数字（如 `lat: "39.9159"`）是字符串，这样的地点同样会被跳过。
- 未知字段会告警并被忽略。没有任何有效地点的围栏（包括空列表 `[]`）会告警，什么也不渲染。

## 路线、图片与图注 {#route}

`route=true` 按列表顺序用一条线把各个地点连起来；`image` 会同时在地点列表和标记点弹窗里显示缩放后的缩略图。`caption` 在列表下方加一行纯文本图注，屏幕阅读器也会把它读作这张地图的名称。

````markdown {title="源码"}
```map {caption="北京中轴线漫步" route=true}
- name: 故宫
  lat: 39.9159
  lng: 116.3908
  text: 从太和殿出发，故宫单点地图见下一节。
  image: forbidden-city.webp
  link: "#single"
- name: 景山公园
  lat: 39.9245
  lng: 116.3904
  text: 登万春亭，俯瞰紫禁城金色屋顶。
  image: jingshan.webp
- name: 北海公园
  lat: 39.9264
  lng: 116.3825
  text: 过永安桥，望琼华岛白塔倒影。
  image: beihai.webp
- name: 鼓楼
  lat: 39.9393
  lng: 116.3898
  text: 沿中轴向北，在钟鼓楼广场收尾。
  image: drum-tower.webp
```
````

```map {caption="北京中轴线漫步" route=true}
- name: 故宫
  lat: 39.9159
  lng: 116.3908
  text: 从太和殿出发，故宫单点地图见下一节。
  image: forbidden-city.webp
  link: "#single"
- name: 景山公园
  lat: 39.9245
  lng: 116.3904
  text: 登万春亭，俯瞰紫禁城金色屋顶。
  image: jingshan.webp
- name: 北海公园
  lat: 39.9264
  lng: 116.3825
  text: 过永安桥，望琼华岛白塔倒影。
  image: beihai.webp
- name: 鼓楼
  lat: 39.9393
  lng: 116.3898
  text: 沿中轴向北，在钟鼓楼广场收尾。
  image: drum-tower.webp
```

选中一个标记点，或点击下方列表中的条目，都会打开对应的弹窗，显示缩略图、名称与备注；第一个地点链接到下一节。这条线是地点之间的直线，不是计算出来的步行或驾车路线。

## 单个地点与缩放 {#single}

只有一个地点时，地图以 15 级缩放打开。`zoom` 可以指定别的级别，从 1（整个世界）到 22（一个街角，受 `params.map.max_zoom` 上限约束）；`height` 用 CSS 长度指定地图高度。

````markdown {title="源码"}
```map {zoom=16 height="18rem"}
- name: 故宫
  lat: 39.9159
  lng: 116.3908
  text: 太和殿，位于紫禁城与护城河中轴线上。
  image: forbidden-city.webp
```
````

```map {zoom=16 height="18rem"}
- name: 故宫
  lat: 39.9159
  lng: 116.3908
  text: 太和殿，位于紫禁城与护城河中轴线上。
  image: forbidden-city.webp
```

有多个地点时，`zoom` 替换自动适配出的缩放级别，中心点保持不变。不写 `height` 时，地图高度是 `min(26rem, 60vh)`，手机上的读者总能把它滚动过去。`height` 接受正数加 `px`、`rem`、`em`、`vh` 或 `vw`。百分比没有可参照的高度，零高度则什么也看不见，所以两者和其它写法一样会告警并保留默认值。

## 交互地图 {#interactive}

- 主题自带 Leaflet 1.9.4。只有含地图的页面才引用它的样式表，脚本在第一张地图需要挂载时才加载：地图位于屏幕内、视口下方 320px 以内，或位于阅读位置上方（设为 `loading: click` 时则点击按钮后才加载）。
- 滚轮缩放默认关闭；在触屏设备上单指滑动会继续滚动页面，不会把读者困在地图里。读者可以用双指捏合平移和缩放、缩放按钮、鼠标或触控笔拖拽，或键盘操作（先聚焦地图，再用方向键和 <kbd>+</kbd> / <kbd>-</kbd>；焦点位于地图内时全站单键快捷键会自动让位）。
- 用指针或 <kbd>Enter</kbd> 选中标记点，或点击下方列表中的地点条目，都会平移地图并打开对应弹窗。用 <kbd>Enter</kbd> 打开的弹窗会获得焦点，接下来就能依次到达其中的链接和关闭按钮；按 <kbd>Escape</kbd> 或关闭按钮关闭弹窗后，焦点交回标记点。
- 深色模式下，站点配置了 `dark_tiles` 时地图改用它，读者切换配色时随之切回；没有配置时仅对浅色瓦片做温和降亮，不对地图图像做反色。`dark_tiles` 的请求全部失败时，地图改用降亮后的浅色瓦片。
- 地图随容器尺寸变化重新计算大小与视野，标签页切换显示、折叠内容展开时也一样，且不会为未打开的标签页提前请求瓦片。
- 脚本或浅色瓦片全部加载失败时，画布自动隐藏，地点列表依然完好。

列表始终留在地图下方，既是可点击定位的交互图例，也是无障碍的替代内容；宽屏上它排成两栏。

## 坐标 {#coordinates}

坐标使用 WGS 84 十进制度数，也就是 GPS、照片元数据和 OpenStreetMap 采用的坐标系。显式的 `lat` 与 `lng` 键避免了 GeoJSON `[lng, lat]` 顺序带来的混淆。要查某个地点的坐标，在 openstreetmap.org 上打开它，地址栏末尾就是 `#map=缩放级别/纬度/经度`。

中国大陆的瓦片服务通常使用 GCJ-02 或 BD-09 坐标，WGS 84 标记点放在这些瓦片上会偏移数百米。主题不内置非官方坐标纠偏，请选用以 WGS 84 / CGCS2000 为准的合规瓦片服务（例如自建合规瓦片、全球商业服务，或天地图 CGCS2000 并配 `subdomains: "01234567"`——注意天地图将底图与中文注记拆分为两个独立图层，而 `params.map.tiles` 仅配置单层）。

## 输出形态 {#outputs}

打印与 RSS 只显示列表和图注，没有地图，RSS 中的缩略图地址改为绝对 URL。没有配置瓦片服务的站点，网页里完全没有地图脚本、样式表或瓦片地址。页面的 Markdown 输出原样保留 `map` 围栏。

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
| `zoom` | 整数 | 自动适配 | 1 到 22（受 `params.map.max_zoom` 上限约束）。不写时：一个地点用 15，否则容纳全部地点 |
| `height` | CSS 长度 | `min(26rem, 60vh)` | 正数加 `px` `rem` `em` `vh` `vw` |
| `tab` | 纯文本 | — | 让这张地图成为一组[标签页](/zh/docs/components/tabs/)里的一页 |
| `group` / `value` | 字符串 | — | 标签页分组与同步值；必须与 `tab` 同时出现 |
| `id` | 元素 ID | 自动生成 | figure 的 ID，便于链接到这张地图 |
| `class` | class 列表 | — | 透传到 figure，供站点 CSS 使用 |
{.fields meta="type default"}

`num` 等其它未知属性会告警并被忽略。`style` 与 `on*` 在主题读到围栏之前就被 Hugo 取走或剥离，因此会被忽略且不告警。

站点参数（`hugo.yml`）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.map.enable` | 布尔 | `false` | 开启交互地图；需要 `tiles` 与 `attribution` |
| `params.map.tiles` | URL 模板 | — | `https://`，包含 `{z}`、`{x}`、`{y}`（支持 `{s}`、`{r}` 与 `{-y}`；其他占位符会告警） |
| `params.map.attribution` | 字符串 | — | 瓦片服务要求的纯文本署名 |
| `params.map.attribution_url` | URL | — | 可选的 `https://` 链接，为署名加上版权超链接 |
| `params.map.dark_tiles` | URL 模板 | — | 可选；深色模式下使用 |
| `params.map.subdomains` | 字符串 | — | 可选的 `{s}` 子域名字符集，写成带引号的字符串（如 `abcd`、`"01234567"`）；留空时沿用 Leaflet 的 `abc` |
| `params.map.max_zoom` | 整数 | `19` | 1 到 22 |
| `params.map.loading` | `lazy` \| `click` | `lazy` | `lazy` 位于阅读位置、其附近或其上方时挂载；`click` 点击按钮后再加载 |
{.fields meta="type default"}

## 限制与常见问题 {#limits}

- 只支持 WGS 84 坐标；放在 GCJ-02 或 BD-09 瓦片上，标记点会偏移。
- 路线按坐标直线连接，不会自动跨国际日期变更线折返。
- 不支持 GPX 或 GeoJSON 轨迹，没有标记点聚合、搜索、地理编码，也不能自定义标记点图标。
- 不会从照片的 GPS 元数据读取位置，请手写坐标。
- `name`、`text` 与 `caption` 都是纯文本，富文本请写在围栏旁边的段落里。
- 远程缩略图在构建期既不下载，也不缩放。

## 相关 {#related}

- [画廊](/zh/docs/components/gallery/) — 地图上这些地点拍下的照片
- [图片](/zh/docs/components/image/) — 缩略图从哪里来
- [标签页](/zh/docs/components/tabs/) — 旅程中每天一张地图
- [Expo 布局](/zh/docs/write/expo/) — 图片随笔与展览
- [Draw.io](/zh/docs/components/drawio/) — 另一个在站点指定服务之前保持关闭的功能
