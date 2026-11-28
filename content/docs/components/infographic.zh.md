---
title: Infographic
linkTitle: Infographic
description: 用 `infographic` 围栏和一个 AntV 模板，把标题与几个条目画成流程、时间线、漏斗、网格或层级信息图。
weight: 350
search_keywords: [Infographic, 信息图, AntV, 流程图, 时间线, 漏斗, timeline, funnel, 模板, template]
---

信息图把一小串条目画成它的结构：一排三个步骤、一条五年的时间线、逐级收窄的漏斗、两层的层级关系。你在 `infographic` 围栏里用纯数据写下标题和条目，第一行指定一个 AntV 模板，由浏览器负责绘制；在 GitHub 上，这个围栏仍是一段可读的文本。

当信息的「形状」本身就是要传达的内容时，用信息图。读者需要坐标轴和精确数值时，用 [ECharts](/zh/docs/components/echarts/)；流程里有条件和分支时，用 [Mermaid](/zh/docs/components/mermaid/)。

## 最简例子 {#minimal}

第一行是 `infographic 模板名`，其后是一个 `data` 块：`title` 是标题，`items` 是条目列表，每个条目至少要有 `label`。

````markdown {title="源码"}
```infographic
infographic list-row-simple-horizontal-arrow
data
  title 升级 PostgreSQL 大版本
  items
    - label 备份
      desc 做一次基础备份，并确认能恢复
    - label 升级
      desc 先在从库上执行 pg_upgrade
    - label 切换
      desc 提升升级后的节点，下线旧节点
```
````

```infographic
infographic list-row-simple-horizontal-arrow
data
  title 升级 PostgreSQL 大版本
  items
    - label 备份
      desc 做一次基础备份，并确认能恢复
    - label 升级
      desc 先在从库上执行 pg_upgrade
    - label 切换
      desc 提升升级后的节点，下线旧节点
```

缩进决定结构，每级两个空格。标签控制在一两个词，解释放进 `desc`，因为长标签在手机上会被挤压或截断。

## 时间线 {#timeline}

`sequence-timeline-*` 系列模板把条目排在一条时间轴上：`label` 是时间点，`desc` 是事件。

````markdown {title="源码"}
```infographic {height="420px"}
infographic sequence-timeline-simple
data
  title PostgreSQL 近五个大版本
  items
    - label 2021
      desc 14：并行查询与逻辑复制的一轮改进
    - label 2022
      desc 15：MERGE 语句
    - label 2023
      desc 16：逻辑复制可以从备库进行
    - label 2024
      desc 17：增量备份与 JSON_TABLE
    - label 2025
      desc 18：异步 IO 子系统
```
````

```infographic {height="420px"}
infographic sequence-timeline-simple
data
  title PostgreSQL 近五个大版本
  items
    - label 2021
      desc 14：并行查询与逻辑复制的一轮改进
    - label 2022
      desc 15：MERGE 语句
    - label 2023
      desc 16：逻辑复制可以从备库进行
    - label 2024
      desc 17：增量备份与 JSON_TABLE
    - label 2025
      desc 18：异步 IO 子系统
```

## 漏斗 {#funnel}

`sequence-funnel-simple` 画逐级收窄的阶段，例如从第一次访问到投入生产的过程。

````markdown {title="源码"}
```infographic {height="420px"}
infographic sequence-funnel-simple
data
  title 从首次访问到投入生产
  items
    - label 访问
      desc 打开了站点的任意页面
    - label 阅读入门
      desc 打开了入门教程
    - label 安装
      desc 在测试机上运行了安装程序
    - label 首个集群
      desc 创建集群并连接成功
    - label 投入生产
      desc 承载真实业务流量
```
````

```infographic {height="420px"}
infographic sequence-funnel-simple
data
  title 从首次访问到投入生产
  items
    - label 访问
      desc 打开了站点的任意页面
    - label 阅读入门
      desc 打开了入门教程
    - label 安装
      desc 在测试机上运行了安装程序
    - label 首个集群
      desc 创建集群并连接成功
    - label 投入生产
      desc 承载真实业务流量
```

## 网格卡片 {#grid}

条目之间没有先后顺序时，`list-grid-*` 把它们排成卡片网格，而不是一条队列。写在 `data` 下的 `desc` 是副标题。

````markdown {title="源码"}
```infographic {height="380px"}
infographic list-grid-compact-card
data
  title 四种安装方式
  desc 选一种与你现有的服务器管理方式相符的
  items
    - label 软件包
      desc 项目仓库提供 RPM 与 DEB
    - label 容器
      desc 每个大版本一个镜像
    - label Ansible
      desc 用剧本搭建整个集群
    - label 源码
      desc 按自己的编译选项构建
```
````

```infographic {height="380px"}
infographic list-grid-compact-card
data
  title 四种安装方式
  desc 选一种与你现有的服务器管理方式相符的
  items
    - label 软件包
      desc 项目仓库提供 RPM 与 DEB
    - label 容器
      desc 每个大版本一个镜像
    - label Ansible
      desc 用剧本搭建整个集群
    - label 源码
      desc 按自己的编译选项构建
```

## 带数值的条目 {#values}

表达比例的模板，例如饼图、环形图和进度图，会读取每个条目上的 `value`。

````markdown {title="源码"}
```infographic {height="400px"}
infographic chart-pie-donut-plain-text
data
  title 一个 200 GB 数据库的磁盘占用
  items
    - label 表
      value 120
    - label 索引
      value 50
    - label WAL
      value 20
    - label 临时文件
      value 10
```
````

```infographic {height="400px"}
infographic chart-pie-donut-plain-text
data
  title 一个 200 GB 数据库的磁盘占用
  items
    - label 表
      value 120
    - label 索引
      value 50
    - label WAL
      value 20
    - label 临时文件
      value 10
```

## 层级与手绘风格 {#hierarchy-and-theme}

条目下面可以用 `children` 继续嵌套，`hierarchy-mindmap-*` 模板会画出两层结构。顶层的 `theme` 块改变整张图的外观，`type` 取 `light`、`dark` 或 `hand-drawn`。

````markdown {title="源码"}
```infographic {height="320px"}
infographic hierarchy-mindmap-level-gradient-compact-card
theme
  type hand-drawn
data
  root
    label Hugo 站点
    children
      - label content
        desc 页面
        children
          - label docs
            desc 文档
          - label blog
            desc 文章
      - label assets
        desc 构建输入
        children
          - label css
            desc 站点样式
          - label images
            desc 需处理的图片
          - label parts
            desc 共享片段
```
````

```infographic {height="320px"}
infographic hierarchy-mindmap-level-gradient-compact-card
theme
  type hand-drawn
data
  root
    label Hugo 站点
    children
      - label content
        desc 页面
        children
          - label docs
            desc 文档
          - label blog
            desc 文章
      - label assets
        desc 构建输入
        children
          - label css
            desc 站点样式
          - label images
            desc 需处理的图片
          - label parts
            desc 共享片段
```

每张信息图都画在自己的底面上，不跟随站点的深浅色模式。默认风格和手绘风格使用白底，DSL 里指定的背景优先，`type dark` 的图即使在浅色页面上也保持深底。切换站点明暗时，图保持原样不重绘；如果你设置了透明背景或自定义文字颜色，请在两种模式下都检查对比度。

## 挑模板 {#templates}

模板名的格式是「结构-变体」，每种结构有多个视觉变体。常用的几类：

| 结构前缀 | 表达什么 | 例子 |
| --- | --- | --- |
| `list-row-*` `list-column-*` | 一排 / 一列并列的条目 | `list-row-simple-horizontal-arrow` |
| `list-grid-*` | 网格，条目之间无先后 | `list-grid-compact-card` `list-grid-badge-card` |
| `list-pyramid-*` `sequence-funnel-*` | 逐层收窄 | `sequence-funnel-simple` |
| `sequence-timeline-*` `sequence-roadmap-vertical-*` | 时间线与路线图 | `sequence-timeline-simple` |
| `sequence-steps-*` `sequence-snake-steps-*` | 有序步骤 | `sequence-steps-simple` |
| `compare-binary-horizontal-*` `compare-quadrant-*` | 二元对比与四象限 | `compare-binary-horizontal-simple-vs` |
| `hierarchy-mindmap-*` `hierarchy-structure-*` | 层级（配合 `children`） | `hierarchy-mindmap-level-gradient-compact-card` |
| `chart-pie-*` `chart-bar-*` `chart-column-*` | 带 `value` 的示意图 | `chart-pie-donut-plain-text` |
| `relation-network-*` `relation-dagre-flow` | 网络与流向（配合 `relations`） | `relation-dagre-flow` |

选能把关系讲清楚的最简单的形式。全部模板见 [AntV Infographic 图库](https://infographic.antv.vision/gallery)，模板名与随主题分发的版本一致。

## 输出形态 {#outputs}

在网页上，主题自带的 AntV 运行时在读者滚动到附近时才把信息图画成 SVG，一页有多张图也不会拖慢加载。打印与 RSS 不画图，只在 `<pre>` 块里给出 DSL 源码，所以结论要写在周围的正文里；页面的 Markdown 输出原样保留围栏。

## 参数参考 {#reference}

围栏属性行（```` ```infographic {…} ````）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `height` | `auto` 或 CSS 长度 | `auto` | 非负数字加 `px` `rem` `em` `vh` `vw` `%`；其它写法告警并使用 `auto` |
| `full` | bool | `false` | `true` 去掉正文宽度限制 |
| `class` | 空格分隔的 class | — | 透传给容器 |
{.fields meta="type default"}

未知属性告警并忽略；`style` 被 Hugo 当作高亮选项取走，`on*` 被 Hugo 剥离，二者静默忽略。围栏为空时告警，什么也不渲染。

DSL 的顶层键（由 AntV 定义）：

| 键 | 说明 |
| --- | --- |
| `infographic` / `template` | 模板名，第一行 |
| `data` | `title`、`desc`、`items`（也可以是 `sequences` `compares` `nodes` `values` `relations` `root`，取决于模板结构）、`order` |
| `theme` | `type`（`light` / `dark` / `hand-drawn`）、`palette`、`colorPrimary`、`stylize` 等 |
| `width` / `height` | DSL 层的画布尺寸，一般交给围栏属性 `height` |
| `design` | 逐部件的细调，少用 |
{.fields}

`items` 里每个条目可用 `label`、`desc`、`value`、`icon`、`children`、`group`、`id`。完整的 DSL 以 [AntV Infographic 文档](https://infographic.antv.vision/learn)为准；主题的 `VENDOR.json` 记录了随附的版本与校验值。

## 限制与常见问题 {#limits}

- 模板名写错不会让构建失败：Hugo 只检查围栏属性，DSL 在浏览器里解析。图的位置会显示一行错误信息，所以改了模板名之后要打开页面看一眼。
- SVG 没有语义结构，屏幕阅读器读出的顺序未必是视觉顺序。标题、列表或表格能表达同样内容时，优先用它们。
- 长标签在窄屏上会被挤压或截断，修改后请在手机宽度下检查。

## 相关 {#related}

- [ECharts](/zh/docs/components/echarts/) — 需要坐标轴与精确数值时用它
- [步骤](/zh/docs/components/steps/) — 需要读者照做的流程用步骤
- [卡片](/zh/docs/components/cards/) — 可点击的入口网格
- [Mermaid](/zh/docs/components/mermaid/) — 带分支与条件的流程
