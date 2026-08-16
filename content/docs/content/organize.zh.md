---
title: 组织内容
weight: 30
description: 围绕读者目标与内容类型组织文档。
aliases:
  [/docs/best-practices/organizing-content/, /docs/tutorial/organize-content/]
---

Oink 根据 Hugo 内容树生成文档侧栏，因此目录结构也是读者体验的一部分，而不只是源码组织细节。先明确读者需要解决的问题，再建立能够快速找到答案的最小层级。

## 从读者目标出发 {#start-from-reader-goals}

为新读者提供一条从产品背景到首次成功操作的短路径；为回访读者提供直达操作指南、参考资料与故障排查的入口。一套实用文档通常需要：

- 说明范围与产品边界的概览；
- 能得到可运行结果的快速上手路径；
- 围绕常见工作的任务指南；
- 参数、API 与兼容性的参考页面；
- 覆盖常见故障的诊断与恢复说明。

当示例能够直接复制或对比时，它们很有价值，但不应取代解释行为的操作步骤与参考资料。

## 使用可预测的内容类型 {#use-predictable-content-types}

每个页面只聚焦一种读者意图：

| 内容类型 | 读者的问题                   |
| -------- | ---------------------------- |
| 概览     | 这是什么，什么时候应该使用？ |
| 教程     | 怎样得到第一个可运行结果？   |
| 操作指南 | 怎样完成一项具体任务？       |
| 参考     | 有哪些字段、命令或接口？     |
| 解释     | 系统为什么采用这种行为？     |
| 故障排查 | 怎样诊断故障并恢复？         |

不要为了复刻组织架构而建立空的一级目录。只有当多篇页面共享稳定的读者目标时，才增加新的分区。

## 保持浅层结构 {#keep-the-hierarchy-shallow}

优先使用简短明确的 URL，不要建立过深的分类树。通过页面权重安排学习顺序，并让同一分区的权重保持一致间隔，便于插入新页面。每个可导航页面都应提供图标与精简描述，让侧栏和分区索引便于扫描。

Hugo 页面包与分区模型详见[添加内容](/zh/docs/content/writing/#organizing-your-documentation)，侧栏行为详见[导航与菜单](/zh/docs/configure/navigation/)。

## 同步规划多语言内容 {#plan-languages-together}

在同一目录中同时创建英文源页面与简体中文译文。页面顺序、读者意图、示例与稳定标题 ID 应保持一致。两种语言的篇幅不必相同，但必须传达等价信息。

## 检查完整访问路径 {#review-the-complete-route}

移动或新增页面后，检查文档首页、分区索引、侧栏、面包屑、前后页导航、本地搜索与全部首页链接。发布前应构建两种语言，并验证渲染后的片段链接。

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

{{< badge text="EXPERIMENTAL" tone="info" >}}

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
