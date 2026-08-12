---
title: Hugo 内容技巧
weight: 40
description: 避免为 Oink 站点编写内容时的常见陷阱。
aliases: [/docs/best-practices/site-guidance/, /docs/tutorial/writing-guide/]
---

Oink 是一款 Hugo 主题，因此普通 Markdown 与 Hugo 内容模型仍是创作基础。遵循以下约定，可以让页面在翻译、重组或部署到子路径后继续保持清晰与稳定。

## 链接到发布后的路由 {#link-to-published-routes}

面向读者的链接应指向规范发布 URL，而不是相邻源码文件路径。`/zh/docs/content/`
这样的根相对链接便于全站审计。如果链接需要在源码移动后继续跟随目标页面，可以使用 Hugo 的
`ref` 或 `relref` 短代码：

```markdown
[配置]({{</* ref "/docs/content/configuration" */>}})
```

移动页面后，应为旧公开路径添加 alias，并把所有站内链接更新为新的规范路由。不要让 alias 长期承担站点导航职责。链接与图片行为详见[添加内容](/zh/docs/content/writing/#links)。

## 让 front matter 提供有效信息 {#keep-front-matter-useful}

每个可导航页面都需要清晰的 `title`、精简的 `description`、经过安排的 `weight`
与合适的 Font Awesome
`icon`。描述只用一句话，并确保在普通桌面内容卡片中可以单行显示。只有当导航标签确实需要与页面标题不同时，才添加
`linkTitle`。

英文是主要源语言；简体中文译文以 `.zh.md`
形式与其并置。面向读者的元数据必须与正文一样认真翻译。

## 保持标题 ID 稳定 {#preserve-stable-headings}

多语言页面或经常被引用的页面应使用显式标题 ID：

```markdown
## 故障恢复 {#failure-recovery}
```

对应中文标题使用同一个 ID。重命名标题时，只要语义没有改变，就应继续保留已经公开的 ID。

## 把操作流程写成任务 {#write-procedures-as-tasks}

在命令之前说明前提条件，步骤使用祈使句，并给出预期结果或验证命令。区分本地预览、生产构建、托管部署与公开发布证据；前一层成功不能证明后一层已经完成。

## 让代码示例可以直接使用 {#make-code-examples-actionable}

代码块对应真实文件时应标出文件名；包含提示符与输出的会话应使用
`console`；不必在继续阅读前看完的长参考配置可以折叠。只有当多个面板是完成同一任务的可互换方案时，才使用代码组。

```yaml {filename="hugo.yaml" hl_lines="3"}
params:
  offlineSearch: true
  print:
    disable_toc: false
```

元数据应帮助读者理解示例，而不是装饰每一个围栏。文件名、复制策略、换行、折叠、行链接与同步替代方案的完整说明参见[代码块与代码组](/zh/docs/components/code-blocks/)。

## 告警 {#alerts}

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
`NB`。告警应节制使用：关键信息在屏幕阅读器和打印版中也必须成立。外观设置参见[告警](/zh/docs/appearance/styling/#alerts)。

## 链接 {#links}

稳定公开路由使用根路径相对链接，相邻页面或页面包资源使用普通相对链接。Hugo 的
`ref` 与 `relref` 短代码可以校验内容引用，并处理语言和永久链接规则：

```markdown
[配置]({{</* ref "/docs/about/configuration" */>}})
```

编写双语页面时：

- 链接到逻辑页面，不要直接链接 `.zh.md` 文件名；
- 片段 ID 应保持语言中立；
- 验证两种语言能否解析到相同片段；
- 目标必须相对于当前主机时使用 `relref`。

调整路由或标题后，应运行站内链接检查。

## 内容风格 {#content-style}

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

## 组织文档 {#organizing-your-documentation}

目录应反映读者看到的信息架构，而不是实现代码的包结构。每个文档子分区都需要
`_index.md` 与 `_index.zh.md`。子页面会按 `weight`
排列在侧边栏中，权重相同时再使用配置的后备顺序。

层级应尽量浅。页面面向独立任务或受众时才拆分，不要仅仅因为文件较长而拆分。详见[组织内容](/zh/docs/content/organize/)。

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

## 组织博客文章与发布注记 {#organizing-blog-posts-and-release-notes}

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

## 自定义样例站页面 {#customizing-the-example-site-pages}

随项目提供的首页是 `content/_index.md`，其中文译文是
`content/_index.zh.md`。它与 OINK 其余页面使用同一套本地资源和主题流水线。品牌调整应修改站点内容与项目资源，不要为了品牌外观去编辑已经纳管的运行时文件。

## 构建自己的落地页 {#building-your-own-landing-pages}

使用标准 Markdown 和[`blocks/*` 短代码](/zh/docs/components/layout/#blocks)组合落地页。关键信息必须保留为文本，行动链接应说明实际去向，并在两种语言中分别测试移动端和桌面端布局。

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
`VENDOR.json` 中登记，而且不得引入隐式 CDN 后备地址。

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

## 检查渲染后的状态 {#review-rendered-states}

构建两种语言，并在桌面端、移动端、浅色与深色模式下检查代表页面。验证渲染后的标题、片段链接、代码、表格、提示、导航、搜索、打印输出与页面描述。
