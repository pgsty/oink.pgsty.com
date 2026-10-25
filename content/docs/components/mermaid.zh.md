---
title: Mermaid
linkTitle: Mermaid
description: 用 `mermaid` 围栏把文本写成流程图、时序图、甘特图、类图与状态图，本地渲染、跟随深浅色、diff 友好。
weight: 110
search_keywords: [Mermaid, 流程图, 时序图, 甘特图, 类图, ER 图, 状态图, flowchart, sequence, gantt, classDiagram, erDiagram, stateDiagram, 图表]
aliases:
  - /docs/components/diagrams/
---

`mermaid` 围栏把一段文本渲染成流程图、时序图、甘特图、类图、ER 图与状态图。图以源码形式存在，可以进 Git、可以 review diff、可以被搜索命中；渲染由主题自带的 Mermaid 在读者浏览器里完成，不请求外部服务。需要像素级控制的示意图画成 SVG，按[图片](/zh/docs/components/image/)使用。

## 最简例子 {#minimal}

````markdown {title="源码"}
```mermaid
flowchart LR
  内容["content/"] --> Hugo
  配置["hugo.yml"] --> Hugo
  主题["OINK 主题"] --> Hugo
  Hugo --> 站点["public/"]
```
````

```mermaid
flowchart LR
  内容["content/"] --> Hugo
  配置["hugo.yml"] --> Hugo
  主题["OINK 主题"] --> Hugo
  Hugo --> 站点["public/"]
```

围栏语言写 `mermaid` 即可，没有其它开关。主题检测到这个围栏后才把 Mermaid 运行时加入这一页，同一页里画十张图也只加载一次。

## 时序图 {#sequence}

`sequenceDiagram` 描述参与者之间按时间发生的消息，适合说明请求链路与加载顺序。

````markdown {title="源码"}
```mermaid
sequenceDiagram
  autonumber
  participant 读者 as 读者浏览器
  participant CDN as 静态托管
  participant JS as 页面脚本包
  读者->>CDN: GET /zh/docs/components/mermaid/
  CDN-->>读者: HTML（一个 figure 加围栏源码）
  读者->>CDN: GET 本页的脚本包
  CDN-->>读者: mermaid.min.js
  JS->>JS: 把围栏源码渲染成 SVG
  Note over JS: 未使用的运行时不下载
```
````

```mermaid
sequenceDiagram
  autonumber
  participant 读者 as 读者浏览器
  participant CDN as 静态托管
  participant JS as 页面脚本包
  读者->>CDN: GET /zh/docs/components/mermaid/
  CDN-->>读者: HTML（一个 figure 加围栏源码）
  读者->>CDN: GET 本页的脚本包
  CDN-->>读者: mermaid.min.js
  JS->>JS: 把围栏源码渲染成 SVG
  Note over JS: 未使用的运行时不下载
```

## 甘特图 {#gantt}

`gantt` 画时间区间。下面是 PostgreSQL 各大版本从发布日算起的五年社区支持期，`1825d` 即五年。

````markdown {title="源码"}
```mermaid
gantt
  title PostgreSQL 大版本的五年社区支持期
  dateFormat YYYY-MM-DD
  axisFormat %Y
  section PG 15
  发布于 2022-10-13 :2022-10-13, 1825d
  section PG 16
  发布于 2023-09-14 :2023-09-14, 1825d
  section PG 17
  发布于 2024-09-26 :2024-09-26, 1825d
  section PG 18
  发布于 2025-09-25 :active, 2025-09-25, 1825d
```
````

```mermaid
gantt
  title PostgreSQL 大版本的五年社区支持期
  dateFormat YYYY-MM-DD
  axisFormat %Y
  section PG 15
  发布于 2022-10-13 :2022-10-13, 1825d
  section PG 16
  发布于 2023-09-14 :2023-09-14, 1825d
  section PG 17
  发布于 2024-09-26 :2024-09-26, 1825d
  section PG 18
  发布于 2025-09-25 :active, 2025-09-25, 1825d
```

## 类图与 ER 图 {#class-and-er}

`classDiagram` 画类型与关系，`erDiagram` 画实体与基数。两者都常用来解释数据模型。

````markdown {title="源码"}
```mermaid
classDiagram
  class Page {
    +string Title
    +string Description
    +int Weight
    +Content()
    +OutputFormats()
  }
  class Resource {
    +string Name
    +string RelPermalink
    +Resize(spec)
  }
  class OutputFormat {
    +string Name
    +string MediaType
  }
  Page "1" --> "0..*" Resource : 页面包资源
  Page "1" --> "1..*" OutputFormat : html / print / markdown / rss
```
````

```mermaid
classDiagram
  class Page {
    +string Title
    +string Description
    +int Weight
    +Content()
    +OutputFormats()
  }
  class Resource {
    +string Name
    +string RelPermalink
    +Resize(spec)
  }
  class OutputFormat {
    +string Name
    +string MediaType
  }
  Page "1" --> "0..*" Resource : 页面包资源
  Page "1" --> "1..*" OutputFormat : html / print / markdown / rss
```

````markdown {title="源码"}
```mermaid
erDiagram
  pg_database ||--o{ pg_namespace : "包含模式"
  pg_namespace ||--o{ pg_class : "包含关系"
  pg_class ||--o{ pg_attribute : "包含列"
  pg_class ||--o{ pg_index : "被索引"
  pg_class {
    oid oid PK
    name relname
    char relkind
  }
  pg_attribute {
    oid attrelid FK
    name attname
    smallint attnum
  }
```
````

```mermaid
erDiagram
  pg_database ||--o{ pg_namespace : "包含模式"
  pg_namespace ||--o{ pg_class : "包含关系"
  pg_class ||--o{ pg_attribute : "包含列"
  pg_class ||--o{ pg_index : "被索引"
  pg_class {
    oid oid PK
    name relname
    char relkind
  }
  pg_attribute {
    oid attrelid FK
    name attname
    smallint attnum
  }
```

## 状态图 {#state}

`stateDiagram-v2` 画状态与迁移条件。下面是 OINK 主题一次发布依次经过的五个状态。这五个状态互不等价，本地构建通过不属于其中任何一个。

````markdown {title="源码"}
```mermaid
stateDiagram-v2
  [*] --> 源码完成
  源码完成 --> 已验证 : 主题检查脚本 + 站点测试套件全绿
  已验证 --> 已发布 : 推送不可变的签名 vX.Y.Z 标签
  已发布 --> 已文档化 : 站点 go.mod 钉住该标签
  已文档化 --> 已部署 : 生产构建上线
  已部署 --> [*]
  已发布 --> 源码完成 : 发现问题只能出新补丁版本，标签不移动
```
````

```mermaid
stateDiagram-v2
  [*] --> 源码完成
  源码完成 --> 已验证 : 主题检查脚本 + 站点测试套件全绿
  已验证 --> 已发布 : 推送不可变的签名 vX.Y.Z 标签
  已发布 --> 已文档化 : 站点 go.mod 钉住该标签
  已文档化 --> 已部署 : 生产构建上线
  已部署 --> [*]
  已发布 --> 源码完成 : 发现问题只能出新补丁版本，标签不移动
```

## 单张图的标题与配置 {#per-diagram-config}

围栏正文最前面可以写 Mermaid 自己的 YAML 头，它不是 Hugo front matter。`title` 给图加标题，`config` 覆盖这一张图的 Mermaid 配置。写死 `config.theme` 的图不再跟随站点深浅色。

````markdown {title="源码"}
```mermaid
---
title: 只有用到的运行时才会进包
config:
  flowchart:
    curve: linear
---
flowchart TD
  页面 --> 判断{用了什么组件？}
  判断 -->|Mermaid 围栏| M[mermaid.min.js]
  判断 -->|ECharts 围栏| E[echarts.min.js]
  判断 -->|都没用| B[只有基础包]
```
````

```mermaid
---
title: 只有用到的运行时才会进包
config:
  flowchart:
    curve: linear
---
flowchart TD
  页面 --> 判断{用了什么组件？}
  判断 -->|Mermaid 围栏| M[mermaid.min.js]
  判断 -->|ECharts 围栏| E[echarts.min.js]
  判断 -->|都没用| B[只有基础包]
```

## 深浅色 {#dark-mode}

页面初始化时主题读取当前配色模式：深色模式下用 Mermaid 的 `dark` 主题，浅色模式下用站点配置的主题。读者切换配色时图会就地重绘，页面不会重载；重绘期间每张图保持原有高度，页面不会在读者眼皮底下跳动。

站点级默认写在 `hugo.yml` 里，键名小写，主题按 Mermaid 的默认配置匹配回正确的大小写：

```yaml {title="hugo.yml"}
params:
  mermaid:
    theme: neutral
    flowchart:
      diagrampadding: 6
```

完整键表见[配置总览](/zh/docs/customize/config/)，可用值以 [Mermaid 配置文档](https://mermaid.js.org/config/schema-docs/config.html)为准。

## 放进标签页与步骤 {#compose}

`mermaid` 围栏没有 `tab` 属性，相邻围栏标签页只对普通代码围栏生效。并排比较两张图用 `tabs` shortcode。

````markdown {title="源码"}
{{</* tabs */>}}
{{</* tab label="按数据流看" */>}}
```mermaid
flowchart LR
  Markdown --> Goldmark --> 渲染钩子 --> HTML
```
{{</* /tab */>}}
{{</* tab label="按输出形态看" */>}}
```mermaid
flowchart LR
  页面 --> HTML
  页面 --> 打印
  页面 --> Markdown
  页面 --> RSS
```
{{</* /tab */>}}
{{</* /tabs */>}}
````

{{< tabs >}}
{{< tab label="按数据流看" >}}
```mermaid
flowchart LR
  Markdown --> Goldmark --> 渲染钩子 --> HTML
```
{{< /tab >}}
{{< tab label="按输出形态看" >}}
```mermaid
flowchart LR
  页面 --> HTML
  页面 --> 打印
  页面 --> Markdown
  页面 --> RSS
```
{{< /tab >}}
{{< /tabs >}}

`{{%/* steps */%}}` 里的每一步是页面级 Markdown，其中可以写 `mermaid` 围栏，用法见[步骤](/zh/docs/components/steps/)。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | 一个 `figure`，保留可读源码，图表接近视口后在舞台中渲染 SVG |
| 打印 | `<pre class="td-mermaid-source">` 包着的源码，静态输出，不跑运行时 |
| Markdown | 原样保留 `mermaid` 围栏与它的源码 |
| RSS | `<pre class="td-mermaid-source">` 包着的源码，订阅端看到的是文本 |

## 参数参考 {#reference}

围栏属性：没有。`mermaid` 围栏不读属性行，写 `{height=…}`、`{class=…}` 之类既不生效也不报错；尺寸由图自身与容器宽度决定，并在其中居中。

站点参数（`hugo.yml`）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.mermaid` | map | 未设置 | 整个映射按 Mermaid 的 `initialize()` 配置传入；键名写小写，主题按 Mermaid 默认配置匹配回正确大小写 |
| `params.mermaid.theme` | string | Mermaid 默认 | 浅色模式下的主题；深色模式下被强制为 `dark` |
{.fields meta="type default"}

单张图的配置写在围栏正文最前面的 YAML 头里（`title`、`config`），属于 Mermaid 语法，不是主题参数。

## 放大查看 {#zoom}

> [!NOTE] 尚未发布的阅读体验
> 以下共用查看器与按需加载行为仅在本地开发版本中实现，不属于已发布的 v1.3.2。

Mermaid 与本地 PlantUML 共用查看器。通过图表角上的按钮打开，直接使用已渲染
结果，无需再次运行引擎。拖动或用方向键平移；滚轮、双指捏合、`+` 和 `-` 缩放。
点击“适应窗口”或按 `0` 显示整张图，按 `Esc` 关闭并把焦点还给打开按钮。
很宽的图初次打开时保持原始尺寸，便于读字；手机上的按钮保持可触控大小。
深浅色切换保留查看器中的阅读位置，减少动态效果偏好不会触发动画。

点击“源码”查看原始文本，点击“复制代码”复制。箭头、引号、和号及中文保留原样。
“下载 SVG”导出带样式的独立图片，无需远程资源。复制或导出失败时显示提示；
“已发起 SVG 下载”仅表示浏览器收到请求，最终保存位置与结果由浏览器决定。
有外部图片或样式依赖的 SVG 会拒绝导出。页面下方的源码折叠区也可查看和复制。

## 按需加载与打印 {#loading}

距离视口不超过 320px 的可见图表才加载引擎并渲染。同页多图共用引擎，两种
图表串行渲染。隐藏标签页、折叠区和宽度为零的容器在恢复可见后处理；没有
IntersectionObserver 的浏览器使用滚动和尺寸检查。快速切换主题时丢弃过期结果。
没有图表的页面不加载查看器或图表引擎。此行为不会增加安装依赖或构建步骤。

禁用 JavaScript、引擎受阻或语法错误时保留可读源码。打印普通 HTML 页面时，
已完成的图按页面宽度缩放，尚未渲染的图显示源码，不等待异步引擎。需要全是图片
时，先浏览并展开需要的图，再打印。独立 Print、Markdown、RSS 继续输出源码。

## 限制与常见问题 {#limits}

- 图不能编号：Mermaid 输出的是内联 SVG，不是 `<img>`，`{#id num=}` 编号不适用；需要编号时导出成图片，按[图片](/zh/docs/components/image/)的编号写法使用。
- 围栏属性无效：宽度在图里控制（`flowchart` 的方向、`classDiagram` 的布局），或者用 CSS。也没有对齐属性——图总是居中。
- 语法错误只在浏览器里可见：Hugo 不解析 Mermaid 语法，写错的图在页面上显示一条带解析错误与图源码的提示，构建照样通过，发布前要在浏览器里确认。
- RSS、Markdown 与打印输出里是源码而不是图：结论要写在正文里，不要只画在图上。

## 相关 {#related}

- [PlantUML](/zh/docs/components/plantuml/) — UML 图表；渲染模式与版本要求见指南
- [思维导图](/zh/docs/components/markmap/) — 大纲式的层级图
- [ECharts](/zh/docs/components/echarts/) — 有数值的统计图
- [图片](/zh/docs/components/image/) — 手绘 SVG、需要编号的图
