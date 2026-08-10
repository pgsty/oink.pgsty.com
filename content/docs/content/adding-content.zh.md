---
title: 添加内容
description: 在 OINK 中组织和编写中英双语文档与博客内容。
---

OINK 沿用 Hugo 的内容模型：Markdown 承载信息，Front
Matter 保存页面元数据，布局则把二者渲染成静态站点。本指南说明随项目提供的中英双语样例站采用的内容约定。

## 内容根目录 {#content-root-directory}

站点内容位于 `content/` 目录下。多语言站点既可以分别使用
`content/en/`、`content/zh/`
等内容根目录，也可以在同一棵挂载目录中使用语言后缀。本仓库采用后一种形式：

```text
content/docs/content/
├── adding-content.md
└── adding-content.zh.md
```

英文文件是源页面，`.zh.md`
文件是对应的简体中文译文。Hugo 解析语言后缀后，二者具有相同的逻辑路径。

生成文件以及必须逐字节复制的文件不应放入内容树，而应放入
`static/`；详见[添加静态内容](#adding-static-content)。

## 内容分区与模板 {#content-sections-and-templates}

内容根目录下的每个一级目录都是 Hugo 分区。OINK 提供以下布局：

- `docs`：带分区树、目录、面包屑、上一篇/下一篇导航和仓库链接的文档页；
- `blog`：带日期、分类元数据、Feed 和时间倒序列表的文章页；
- `community`：展示项目与贡献者链接的社区页；
- 默认页面：不显示文档侧边栏的落地页。

Hugo 根据内容所属分区选择布局，因此 `content/docs/` 下的页面会使用 `docs`
布局。只有确实要复用其他分区布局时，才在 Front Matter 中设置 `type`。

### 自定义分区 {#custom-sections}

在内容根目录下新建目录；默认布局无法满足需求时，再为页面指定类型：

```yaml
---
title: 架构决策
description: 项目已经采纳的设计决策。
type: docs
weight: 30
---
```

如果某项行为适用于整个分区，应在 `_index.md` 的 `cascade`
中设置共享值，避免每页重复。只有现有 OINK 布局与 Partial 均不适用时，才在项目的
`layouts/` 下新增布局。

## 以文档为根的站点 <a id="alternative-site-structure"></a> {#doc-rooted-sites}

{{% _param BADGE EXPERIMENTAL info %}}

以文档为主的站点可以把 `docs` 分区发布到 URL 根路径，同时仍将源码保存在
`content/.../docs/` 下：

```yaml
permalinks:
  page:
    docs: /:sections[1:]/:slug/
  section:
    docs: /:sections[1:]
```

此时，文档分区落地页会成为站点首页。请为每种语言的物理站点根索引添加以下 Front
Matter，使其仍可作为链接使用，同时不会争抢相同的输出路径：

```yaml
build: { render: link }
```

### 检查路径冲突 {#check-for-path-conflicts}

文档会与博客、社区及其他分区共享 URL 根路径。构建时启用
`--printPathWarnings`，并在发布前解决所有重复目标：

```bash
hugo --printPathWarnings
```

### 旧版纯文档配置 {#legacy-docs-only-setup}

旧版 Docsy 示例曾通过 Front Matter 的 `cascade`
强制设置页面类型。迁移到基于永久链接的文档根配置时，应删除这项变通设置，否则首页与分区布局可能出现不一致的解析结果。

## 页面 Front Matter {#page-front-matter}

Front Matter 是用 YAML、TOML 或 JSON 编写的页面元数据。OINK 样例站使用 YAML：

```yaml
---
title: Local-first architecture
linkTitle: Local-first
description: How OINK removes browser and build-time CDN dependencies.
weight: 20
date: 2026-08-08
tags: [architecture, offline]
---
```

`title` 是实际所需的最小字段。对于持续维护的文档，还应提供简洁的 `description`
供搜索和页面元数据使用；顺序有意义时应设置
`weight`。只有导航标签需要更短文本时才使用 `linkTitle`。

译文应翻译面向读者的元数据，同时保留结构性取值：

```yaml
---
title: 本地优先架构
linkTitle: 本地优先
description: OINK 如何消除浏览器端与构建期的 CDN 依赖。
weight: 20
date: 2026-08-08
tags: [架构, 离线]
---
```

不要翻译字段名、短代码名称、配置项、文件路径或稳定标识符。

### 页脚元数据 {#footer-metadata}

文档页与博客页会在站点页脚上方显示紧凑的元数据区域。最后修改日期取自 Hugo 的
`.Lastmod` 值；以下两个可选 Front Matter 字段用于补充来源说明：

```yaml
lastmod: 2026-08-09
upstream_attribution: https://upstream.example/docs/page/
downstream_modified: true
```

`upstream_attribution` 链接到上游原文及其署名信息；`downstream_modified: true`
表示下游项目修改过本页。某项说明不适用时，请省略对应字段。

## 页面正文 {#page-content}

除非布局确实要求 HTML，否则页面应使用 Markdown。Hugo 通过 Goldmark 渲染 Markdown，并支持属性、脚注、表格、任务列表、渲染钩子和围栏代码块。

### Markdown {#markdown}

即使脱离渲染后的站点，源码也应保持可读：

- 使用 ATX 标题（`## 标题`）；
- 列表、块和围栏代码前后保留空行；
- 代码语言已知时必须标注；
- 使用能说明去向的链接文本和图片替代文本；
- 普通正文按便于审阅的宽度换行，但不要重排代码或 URL。

OINK 为块引用告警以及 Mermaid、数学公式、化学公式、Markmap 和 PlantUML 代码块提供渲染钩子。详见[图表与公式](/zh/docs/content/diagrams-and-formulae/)。

### 标记、短代码与内容功能 {#markup-and-content-features}

普通正文优先使用标准 Markdown。需要标签页、卡片、终端录像、API 查看器或安全图表等有实际行为的组件时，再使用[短代码](/zh/docs/content/shortcodes/)。短代码属于内容契约的一部分：应在两种语言中核对其参数，不要把渲染后的 HTML 复制到译文。

### 告警 {#alerts}

OINK 支持 GitHub 风格的块引用告警，也支持可选的 Obsidian 风格标题：

```markdown
> [!TIP]
>
> 每次发布前都要运行翻译审计。

> [!WARNING] 必须使用稳定锚点
>
> 译文标题必须保留英文页面渲染后的 ID。
```

语义类型包括 `NOTE`、`TIP`、`IMPORTANT`、`WARNING` 和
`CAUTION`，以及与 Bootstrap 兼容的类型和
`NB`。告警应节制使用：关键信息在屏幕阅读器和打印版中也必须成立。外观设置参见[告警](/zh/docs/content/lookandfeel/#alerts)。

### 链接 {#links}

稳定公开路由使用根路径相对链接，相邻页面或页面包资源使用普通相对链接。Hugo 的
`ref` 与 `relref` 短代码可以校验内容引用，并处理语言和永久链接规则：

```markdown
[配置]({{</* ref "/docs/oink/configuration" */>}})
```

编写双语页面时：

- 链接到逻辑页面，不要直接链接 `.zh.md` 文件名；
- 片段 ID 应保持语言中立；
- 验证两种语言能否解析到相同片段；
- 目标必须相对于当前主机时使用 `relref`。

调整路由或标题后，应运行站内链接检查。

### 内容风格 {#content-style}

任务型文档应使用直接、明确的语言：先介绍概念，再给出配置；明确说明默认值；区分本地构建验证、部署与正式发布。中文版遵循
`oink.pgsty.com/TRANSLATION.md` 中的术语与排版规则。

## 页面包 {#page-bundles}

独立页面只有一个 Markdown 文件；叶子页面包则由 `index.md` 和页面资源组成：

```text
content/docs/tutorial/
├── index.md
├── index.zh.md
├── architecture.svg
└── example.yaml
```

两种语言的页面可以共用同一图片和下载文件。在单主机多语言站点中，Hugo 通常会在语言版本之间共享页面资源，因此不要复制完全相同的二进制资源。只有图片包含需要翻译的文字时才制作本地化版本，并为资源添加清晰的语言后缀。

包含子页面的分区使用分支页面包（`_index.md`），带资源的末端页面使用叶子页面包（`index.md`）。

## 添加文档、博客文章与发布注记 {#adding-docs-blog-posts-and-release-notes}

每个持续维护的英文页面都应在同一目录下配有中文页面：

```text
guide.md
guide.zh.md
```

页面包则将 `index.md` 与 `index.zh.md`
配对。除非语言差异确有必要，否则二者的路由元数据、日期、权重、别名和资源声明应保持一致。

### 组织文档 {#organizing-your-documentation}

目录应反映读者看到的信息架构，而不是实现代码的包结构。每个文档子分区都需要
`_index.md` 与 `_index.zh.md`。子页面会按 `weight`
排列在侧边栏中，权重相同时再使用配置的后备顺序。

层级应尽量浅。页面面向独立任务或受众时才拆分，不要仅仅因为文件较长而拆分。详见[组织内容](/zh/docs/best-practices/organizing-content/)。

#### 文档分区落地页 {#docs-section-landing-pages}

文档分区的 `_index.md` 默认会渲染子页面摘要。使用：

```yaml
simple_list: true
```

可以改为紧凑列表；使用：

```yaml
no_list: true
```

可以关闭自动列表。每种语言都应提供本地化标题和描述，并保持结构选项一致。

### 组织博客文章与发布注记 {#organizing-blog-posts-and-release-notes}

按发布方与受众拆分文章：所有 Docsy 上游文章（包括 Docsy 发布报告）平铺在
`blog/docsy/`；OINK 专属普通文章平铺在 `blog/oink/`；`blog/release/`
只存放 OINK 自己带版本号的发布注记。不要增加年份子目录，每篇文章在原地配对：

```text
content/blog/
├── docsy/
│   ├── 0.16.0.md
│   ├── 0.16.0.zh.md
│   ├── hugo-upgrade.md
│   └── hugo-upgrade.zh.md
├── oink/
│   ├── implementation-diary.md
│   └── implementation-diary.zh.md
└── release/
    ├── 0.1.0.md
    └── 0.1.0.zh.md
```

Docsy 发布注记通常使用带发布方名称的 `linkTitle`：

```yaml
---
title: 0.16.0 发布报告与升级指南
linkTitle: Docsy 0.16.0 发布
date: 2026-07-29
tags: [发布, 升级]
---
```

其他 Docsy 文章的 `linkTitle` 也以 `Docsy`
开头，让混合侧边栏和列表能直接显示内容归属。

不同语言版本的发布日期与作者身份应保持一致。标题、描述、分类标签、图注和正文需要翻译；提交 ID、发布标签、命令和 URL 不应翻译。

## 使用一级落地页 {#working-with-top-level-landing-pages}

默认布局适用于首页、产品概览和其他不需要文档侧边栏的入口页。

### 自定义样例站页面 {#customizing-the-example-site-pages}

随项目提供的首页是 `content/_index.md`，其中文译文是
`content/_index.zh.md`。它与 OINK 其余页面使用同一套本地资源和主题流水线。品牌调整应修改站点内容与项目资源，不要为了品牌外观去编辑已经纳管的运行时文件。

### 构建自己的落地页 {#building-your-own-landing-pages}

使用标准 Markdown 和[`blocks/*` 短代码](/zh/docs/content/shortcodes/#blocks)组合落地页。关键信息必须保留为文本，行动链接应说明实际去向，并在两种语言中分别测试移动端和桌面端布局。

## 添加社区页面 {#adding-a-community-page}

创建 `community/_index.md` 和 `community/_index.zh.md`。社区布局会读取
`params.links.user` 与 `params.links.developer`：

```yaml
params:
  links:
    user:
      - name: 用户论坛
        url: https://community.example.org/
        icon: fa-solid fa-comments
        desc: 提问并分享解决方案
    developer:
      - name: GitHub
        url: https://github.com/pgsty/oink
        icon: fa-brands fa-github
        desc: 源码、议题与拉取请求
```

条目可以设置 `rel`；对于外部 HTTP 链接，OINK 也会按需补充
`noopener`。贡献指南不在约定的文档路径时，请在社区页 Front Matter 中设置
`params.contributingUrl`。

## 添加静态内容 {#adding-static-content}

`static/` 下的文件不会经过 Markdown 渲染或指纹处理，而是原样复制到发布根目录：

```text
static/reference/api/index.html
```

会发布为
`/reference/api/index.html`。该目录适合外部生成的参考站点、验证文件以及要求稳定文件名的下载内容。需要缩放、指纹或页面包相对寻址的资源，应优先使用页面资源或 Hugo
Pipes。

OINK 的浏览器运行时有意从主题或站点自身提供。新增依赖库时，必须本地纳管并锁定版本，在
`theme/VENDOR.json` 中登记，而且不得引入隐式 CDN 后备地址。

## RSS Feed {#rss-feeds}

Hugo 会为首页和列表分区生成 Feed。只有站点确实没有 Feed 消费者时才全局关闭：

```yaml
disableKinds: [RSS]
```

分区声明自定义输出格式时，应显式保留 RSS：

```yaml
outputs:
  section: [HTML, RSS, print]
```

检查每种语言生成的 Feed URL，并核对标题、摘要、日期、规范 URL 与 `hreflang`
关系。

## 站点地图 {#sitemap}

Hugo 默认生成 `sitemap.xml`。站点级设置如下：

```yaml
sitemap:
  changefreq: monthly
  filename: sitemap.xml
  priority: 0.5
```

页面可以覆盖这些值：

```yaml
---
title: 发布说明
sitemap:
  priority: 0.8
---
```

应把 `changefreq` 与 `priority`
视为提示而非承诺。部署前应排除草稿、私有内容和非规范副本，并检查每种发布语言生成的站点地图。
