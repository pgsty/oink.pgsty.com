---
title: "Map 组件"
linkTitle: Map 组件
description: map 数据围栏以地点列表为内容本体；站点显式启用后，借助随主题内置的 Leaflet 与站点自选的瓦片服务，渐进增强为 OpenStreetMap 生态的交互地图。
weight: 29
icon: fa-solid fa-map-location-dot
search_keywords: [地图, Map 组件, OpenStreetMap, Leaflet, 地点列表, 标记点, 路线, 游记, 瓦片, GPS, EXIF, 组件]
design_kind: proposal
design_status: accepted
proposal_date: 2026-11-27
---

> [!NOTE] 已随 OINK 1.7.0 接受并发布
> 已随 OINK v1.7.0 发布并写入[地图指南](/zh/docs/components/map/)，规范行为归属[组件契约](/zh/docs/design/components/#timeline-media-social-and-maps)。共同决策见[总览](/zh/docs/design/proposals/content-components-expansion/)。

| 记录 | 内容 |
| --- | --- |
| 状态 | 已接受并随 OINK v1.7.0 发布（2026-11-27 实现） |
| 负责人 | OINK 维护者 |
| 交付阶段 | S5；基于 GPS 元数据的照片标记点留待之后 |
| 形态 | 数据围栏：```` ```map ```` 加 YAML 或 JSON 地点列表 |
| 新增公共 API | `map` 围栏及其字段；配置 `params.map` |
| 运行时 | 默认无；启用地图后经 `content-components.js` 加载随主题内置（vendored）的 Leaflet |
| 受影响范围 | `layouts/_markup/render-codeblock-map.html`、`scripts.html`、`content-components.js`、`VENDOR.json`、一个样式表层、配置 schema、三个 locale 键，以及新指南 `/docs/components/map/` |

## 概要 {#summary}

````markdown
```map {caption="Kyoto in three days" route=true}
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
  text: Quietest right after opening.
  image: kinkakuji.webp
  link: "#day-1"
- name: Kiyomizu-dera
  lat: 34.9949
  lng: 135.7850
```
````

HTML、Print 和 RSS 把地点渲染为编号列表，包含名称、说明、缩略图和 OpenStreetMap 坐标链接。Markdown 和 LLMS 保留作者写的围栏。站点启用地图并指定瓦片服务后，HTML 会在列表上方显示一张交互地图，标记点编号与列表一一对应。默认情况下什么都不启用，也不选择任何瓦片服务。

## 问题 {#problem}

游记、摄影随笔与 Expo 页面、活动与办公地点、实地考察和现场参观，都需要把地点标在地图上。作者要么用截图（静态、没有链接、容易过时），要么嵌入 Google Maps iframe（需要 API key、计费、受条款约束、存在地区封锁、引入第三方脚本），要么干脆不放。OINK 目前无法表达“按这个顺序排列的这些地点”，同时还能在 Print、订阅源和 Agent 输出中保留下来。

## 设计原则 {#principles}

1. **列表是内容，地图只是增强。** 没有地图的读者（Print、RSS、禁用 JavaScript 或瓦片主机被屏蔽）也能按相同顺序看到相同的地点，链接照常可用。
2. **配置完整后才产生网络请求。** 瓦片是读者浏览器发出的第三方请求。与 Draw.io 一样，主题不附带默认服务器，完成配置前保持关闭（[架构契约](/zh/docs/design/architecture/#configuration-and-diagnostics)）。
3. **瓦片服务由站点选择。** 瓦片服务各有使用政策、配额、密钥和署名条款。主题若提供默认值，就等于替每个站点做了这项法律与运维上的选择。
4. **只有一种形态。** 一个围栏放一个地点和放二十个同样容易，因此不另设短代码作为第二种形态。
5. **使用 WGS 84 坐标。** 这是 GPS、照片元数据和 OpenStreetMap 共用的坐标系。

## 目标与非目标 {#goals}

### 目标 {#goals-list}

- 零配置即可在 HTML、Print 与 RSS 中得到静态列表，在 Markdown 与 LLMS 中读到原始地点数据。
- 可选启用的交互地图：编号标记点，包含名称、说明、缩略图和链接的弹窗，可选的路线连线，以及提供时使用的暗色瓦片。
- 不劫持页面滚动，支持键盘操作，控件已本地化。
- 引擎随主题内置，只在需要它的页面加载。

### 非目标 {#non-goals}

- 由主题捆绑 Google Maps、Mapbox SDK 或任何需要 API key 的引擎。
- 由主题选定的默认瓦片服务。
- 第一阶段的单点 `map` 短代码、命名瓦片样式、自定义标记点图标或色调，以及静态回退图片参数。
- GPX 或 GeoJSON 轨迹、标记点聚合、搜索、路径规划或地理编码。
- 针对 GCJ-02 或 BD-09 瓦片的坐标转换（见[限制](#limitations)）。
- 在构建时生成地图瓦片或图片。

## 提议行为 {#design}

### 地点 {#places}

围栏正文是一个 YAML 或 JSON 列表，每一项包含：

| 字段 | 规则 | 无效输入 |
| --- | --- | --- |
| `name` | 必填，纯文本 | 告警并跳过该项 |
| `lat` | 必填数值，−90 到 90 | 告警并跳过该项 |
| `lng` | 必填数值，−180 到 180 | 告警并跳过该项 |
| `text` | 可选，纯文本 | — |
| `image` | 可选图片，经共享图片解析器处理；本地栅格图会为列表和弹窗缩放尺寸 | 无法解析时告警，不显示缩略图 |
| `link` | 可选 URL，经共享 URL 策略处理；最常见的是同页 `#anchor` | 无效时告警并丢弃 |

未知字段会告警。没有任何有效地点的围栏会告警，且不渲染任何内容。显式的 `lat`/`lng` 键避免了 GeoJSON `[lng, lat]` 数组中经纬度顺序容易混淆的问题。

### 围栏属性 {#attributes}

| 属性 | 规则 |
| --- | --- |
| `caption` | 纯文本图注 |
| `route` | 为 `true` 时按列表顺序用一条线连接各地点 |
| `zoom` | 整数 1–22（实现范围；初稿为 1–19）。默认：只有一个地点时为 15，否则自动缩放以容纳所有地点 |
| `height` | 正的 `px`、`rem`、`em`、`vh` 或 `vw` 长度；百分比或零告警并保留默认值，即一个高度上限低于视口高度的响应式画框 |
| `id` | 经过校验的元素 ID |
| `tab`、`group`、`value` | 共享的相邻标签页行为；所在面板显示时地图重新计算尺寸 |

与其他图表围栏一样，不支持 `num`；需要 Book 编号时，用 `fig` 包裹围栏。

### 静态形态 {#static-form}

HTML、Print 和 RSS 使用以下静态列表。

```html
<figure class="td-map">
  <ol class="td-map__places">
    <li>
      <span class="td-map__name">Kinkaku-ji</span>
      <span class="td-map__text">Quietest right after opening.</span>
      <a href="https://www.openstreetmap.org/?mlat=35.0394&amp;mlon=135.7292#map=16/35.0394/135.7292" rel="external">35.0394, 135.7292</a>
    </li>
    …
  </ol>
  <figcaption>Kyoto in three days</figcaption>
</figure>
```

坐标按作者书写的原样显示。OpenStreetMap 链接只是普通的外链，不会发出请求。

### 配置 {#configuration}

```yaml
params:
  map:
    enable: false
    tiles: ""        # required: HTTPS template with {z}, {x}, {y}; {s} and {r} allowed
    attribution: ""  # required: the plain-text attribution the tile service demands
    dark_tiles: ""   # optional: used while the page is in dark mode
    max_zoom: 19     # optional
```

`enable: true` 但 `tiles` 或 `attribution` 缺失或无效时，告警并保持地图关闭。指南给出几种配置示例：OpenStreetMap 标准瓦片（按 OpenStreetMap 基金会瓦片使用政策仅限轻度使用，且必须署名）、使用域名限制密钥的商业服务，以及自托管服务器，但不把其中任何一种设为默认。瓦片 URL 中的密钥是公开的，指南会明确说明。

### 交互地图 {#interactive}

当 `params.map` 配置完整且输出为 HTML 时：

- figure 中增加一个画布和一份经过校验的地点 JSON 副本；`hasMap` 选中 `content-components.js` 适配器，并在 `data-td-component-engines` 中注册 `leaflet` 引擎。与 Asciinema 播放器的样式表一样，Leaflet 的样式表只在这些页面上链接。
- 与其他引擎一样，适配器在每张地图距视口 320px 以内时挂载。
- 标记点是与列表编号一致的带编号 HTML 标记，使用预设 token 设置样式，不使用标记图片。
- 弹窗用 DOM API（`textContent`、创建元素）根据 JSON 构建，包含名称、说明、缩略图和链接，不使用 `innerHTML`。
- 关闭滚轮缩放，阅读时滚动页面绝不会缩放地图。缩放按钮、键盘控制和双指缩放仍然可用。窄屏上画框始终比视口矮，确保页面总能滚过地图。
- 配置 `dark_tiles` 时，瓦片跟随配色模式切换；未配置时保持浅色瓦片（不对地图图像做反色处理）。
- 窗口尺寸变化、标签页面板显示以及折叠块展开时，重新计算地图尺寸。
- 署名使用 Leaflet 的署名控件，显示配置的文字。
- 引擎或瓦片加载失败时，隐藏画布，保留列表。

列表始终显示在地图下方，既是地图的图例，也是无障碍替代内容。

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML，地图关闭 | 只有静态形态；没有画布、脚本或瓦片 URL |
| HTML，地图开启 | 地图位于静态形态上方 |
| 浏览器打印 | 打印规则隐藏画布，打印列表 |
| 专用 Print 输出 | 静态形态 |
| Markdown / LLMS | 作者编写的原始围栏 |
| RSS | 静态形态，缩略图使用绝对 URL |

### 引擎 {#engine}

Leaflet（BSD-2-Clause）体积小，不需要 WebGL，支持 HTML 标记和键盘控制。截至 2026-11-27，npm 上的 `latest` 为 1.9.4，2.0 处于 beta 阶段（2.0.0-beta.5，2026-11-19）。实现时随主题内置当时的稳定版本，并在 `VENDOR.json` 中记录许可证、版本、来源和校验和。如果届时 2.0 已经稳定且只以 ES 模块形式发布，需要先相应修改引擎加载器（一个带就绪检查的经典脚本）。

长期来看，MapLibre GL 搭配矢量瓦片，或搭配存放在对象存储上的单个 PMTiles 文件，是自托管地图更有力的方案，代价是体积更大且需要 WebGL。围栏格式与引擎无关，因此后续提案可以切换或新增引擎，而无需修改内容。

### 由 GPS 元数据生成照片标记点 {#exif}

带本地照片但没有坐标的地点，可以从照片中获取位置。在 Hugo 0.170.1 上核实的情况如下：

- `Image.Exif` 在 Hugo 0.155 中弃用，现已移除。
- 只有站点的 `imaging.meta.fields` 包含 GPS 字段时，`Image.Meta` 才返回 `Lat`/`Long`。Hugo 默认的字段过滤会排除 GPS，而主题无法修改站点的 `imaging` 配置。
- 发布的原始照片除非剥离了元数据，否则会保留 GPS 数据，可能泄露私密位置。

因此这项能力放到之后的阶段：先支持显式坐标，再把基于 GPS 的标记点作为有文档说明、由站点显式启用的选项，并附上隐私提示。

### 无障碍与隐私 {#accessibility}

编号列表传达了地图的全部信息。地图控件具备本地化名称。瓦片请求会把读者的 IP 地址和所查看的区域发送给瓦片服务；这只在站点启用地图之后、且地图进入视口时才会发生。

### 限制 {#limitations}

坐标采用 WGS 84。中国大陆的地图服务通常使用 GCJ-02（或 BD-09），因此 WGS 84 标记点叠加在这些瓦片上会偏移数百米。第一阶段在文档中说明这一点，只支持 WGS 84 瓦片。如果有站点需要，之后可以增加一个 `params.map` 选项，为 GCJ-02 瓦片转换标记点坐标。

## 权衡与备选方案 {#alternatives}

| 方案 | 决定 | 理由 |
| --- | --- | --- |
| Google Maps | 否决 | 需要密钥和计费，条款限制缓存，存在地区封锁，引入第三方脚本 |
| 初稿中的单点 `{{</* map */>}}` 短代码 | 移除 | 三行围栏就能表达的内容，不需要第二种形态 |
| 以 CARTO 浅色/暗色瓦片作为默认值 | 移除 | 这是有自己使用条款的商业服务，主题不应替每个站点选择它 |
| `styles`、`center`、标记点 `icon` 与 `tone`、`fallback` 图片、`full` | 暂时移除 | 编号标记点把地图和列表绑定在一起；回退图片与列表重复 |
| 地图挂载后隐藏列表 | 否决 | 列表是图例、无障碍替代内容，也是打印形态 |
| 构建时渲染静态地图图片 | 否决 | 构建时需要瓦片，与离线构建相矛盾 |
| 点击后才加载地图 | 以 `loading: click` 提供 | 接近视口时懒加载是各引擎的常规做法，仍是默认行为；隐私评审或触控滚动有需要时，`params.map.loading: click` 改为等读者点击按钮再加载 |

代价：需要维护一个随主题内置的引擎；任何地图出现之前都要先完成配置；开箱即用时没有默认外观。这些都直接源自网络政策。

## 兼容性 {#compatibility}

纯增量变更。`map` 是新的围栏语言，`params.map` 是新的配置键。地图关闭时，含 `map` 围栏的页面完全可读。

## 实现计划 {#implementation}

1. 将 Leaflet 随主题内置到 `assets/third_party/leaflet/`，并添加 `VENDOR.json` 条目。
2. 实现 `render-codeblock-map.html`，包括一个解析 partial（校验，以及经图片解析器和图片处理生成缩略图）、静态形态和启用形态。
3. 在 `hugo.yaml` 中加入 `params.map`，实现带 Draw.io 式完整性告警的解析器，更新 `bin/check-params.py` 和生成的配置 schema。
4. 在 `content-components.js` 中增加 `leaflet` 适配器；在 `scripts.html` 中注册引擎与样式表；使用桩引擎编写单元测试。
5. 在全部 32 个 locale 文件中加入 `ui_map_label` 与 `ui_map_open_osm`；缩放控件复用 `ui_diagram_zoom_in` 与 `ui_diagram_zoom_out`。
6. 测试夹具覆盖：地图关闭与开启、单个与多个地点、无效地点、路线、每种来源的缩略图、标签页，以及每种输出。归属检查：`check-components.py`（数据围栏）、`check-runtime-isolation.py`、`check-vendor.py`、`check-output.py`、`check-output-security.py`、`check-goldens.py`、`check-stylesheets.py`、`check-params.py`、`check-i18n.py`、`node --test`。
7. 在本站配置瓦片服务后进行浏览器评审：键盘、触控滚动、暗色瓦片、标签页、预设、打印。

## 验收标准 {#acceptance}

- 地图关闭时，任何输出都不包含瓦片 URL、Leaflet 脚本或其样式表。
- 配置不完整时，构建告警，行为与地图关闭相同。
- 地图开启与关闭时，列表完全相同。
- 在地图上滚动滚轮时，滚动的是页面。
- 弹窗中不含作者编写的 HTML。

## 待决问题 {#open-decisions}

1. **地图下方列表的呈现方式。** 建议：始终可见，紧凑排列。备选：长列表可折叠。
2. **标记点样式。** 建议：S5 只显示数字；之后按需求再加图标。
3. **引擎版本。** 建议：S5 启动时在 1.9.4 与 2.x 之间做出决定。
4. **GCJ-02 支持。** 建议：在有站点提出需求之前不纳入范围。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）。** `map` 围栏加单点短代码、CARTO 默认瓦片、命名样式、标记点图标与色调、回退图片，并在 C3 中提供 EXIF 标记点。
- **2026-11-27（评审）。** 只保留一个围栏；不设默认瓦片服务；始终渲染列表；核实 Hugo `Image.Meta` 的默认行为后，EXIF 标记点移到之后的阶段。
- **2026-11-27（实现）。** 以随主题内置的 Leaflet 1.9.4（`VENDOR.json`）、`render-codeblock-map.html`、`content/map-config.html`、`content-components.js` 中的 `leaflet` 适配器与 `assets/css/td/map.css` 实现。与本草案的差异：围栏按资源名称以 YAML 解析，因为 Hugo 的内容猜测会把写成 `- {name: …}` 的 YAML 列表当作 JSON；缩放控件复用 `ui_diagram_zoom_in` 与 `ui_diagram_zoom_out`，因此新增的只有 `ui_map_label` 与 `ui_map_open_osm`；`params.map` 在每个页面上校验。无效输入由 `bin/check-content-primitives.py` 与 `bin/check-params.py` 覆盖；`tests/js/content-components-map.test.js` 覆盖适配器。
- **2026-11-27（评审加固）。** 修复 `{s}` 子域名瓦片校验与 YAML `.nan` 坐标构建崩溃；在 `map.css` 中提升选择器权重以压过页面底部引入的 `leaflet.css`，统一四种预设明暗弹窗/控件/焦点环样式，修复弹窗关闭按钮遮挡、暗色打印墨色、`slate` 暗色 `--td-on-link`、RTL 弹窗与 `dir="ltr"` 坐标、强制颜色弹窗边框与长列表分页；在运行时加入触屏单指滚动防陷阱、`keyboard-nav.js` 地图焦点让位、全瓦片失败隐藏画布、`prefers-reduced-motion`、无障碍标记 `aria-label`、`Escape` 关弹窗、本地化关闭标签、`tabs.js` 先行隐藏防提前加载、列表点击定位及 `rich-copy.js` 排除画布；新增可选配置 `attribution_url`（满足 OSM 版权链接要求）、`subdomains` 与 `loading: click`（新增 32 语种 `ui_map_load`），并补齐文档站 Playwright 回归测试 `tests/browser/map.spec.mjs`。
- **2026-11-27（对抗性评审）。** `params.map.loading` 写成列表或映射时会中止构建，因为 `cond` 会对它求值 `strings.TrimSpace`；现在改为告警并保持 `lazy`。瓦片模板只允许 `{s}`、`{z}`、`{x}`、`{y}`、`{-y}` 与 `{r}`：其他占位符无论出现在主机、路径还是查询参数中都会在构建时告警，因为 Leaflet 无值可填时会抛错，留下一张空地图。首批瓦片全部失败时，等 Leaflet 分发完图层的 `load` 再移除地图，此前会抛出 `TypeError`；`dark_tiles` 全部失败时改用降亮后的浅色瓦片，不再永久移除地图。`loading: click` 按钮列出地图可能请求的全部域名，`{s}` 写作 `*`，含 `dark_tiles` 域名。`tests/browser/map.spec.mjs` 已纳入 `test:content-components`。后续的次要修复：触控笔与鼠标一样可以拖拽地图；用 Enter 打开的弹窗获得焦点，从弹窗内关闭后焦点回到标记点；从键盘激活加载按钮后焦点移到地图；`params.map.subdomains` 的默认值写作留空（沿用 Leaflet 的 `abc`）；乌克兰语与希伯来语的 `ui_map_load` 分别改为“Завантажити мапу”与“טעינת המפה”。
