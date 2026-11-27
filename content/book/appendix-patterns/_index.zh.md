---
title: Front Matter 模式
linkTitle: 附录：模式
description: 可直接复制改写的 front matter：Docs 分组与页面、博客根页、沉浸式专栏、博客文章、作者主页、Book 根页与章节，均取自本书。
book_kind: appendix
book_number: A
weight: 110
---

每个模式只保留确立页面角色所需的键；等读者确实有需要时，再加入控制展示的键。各模式下注明的章节解释了其中的每个键。

## Docs 分组 {#docs-group}

```yaml {title="content/docs/operations/_index.md"}
title: Operations
description: Back up, upgrade and monitor a running server.
weight: 35
icon: fa-solid fa-screwdriver-wrench
```

目录里放入这个 `_index.md`，就成为侧栏中的一个分组，分组页面会列出它的子页面。见[第 3 章](/zh/book/03-pages/#tree)。

## Docs 页面 {#docs-page}

```yaml {title="content/docs/get-started/quick-start.md"}
title: Quick start
description: Start a server, write a data point and query it back in five minutes.
weight: 30
search_keywords: [getting started, first query]
```

对应的中文页面 `quick-start.zh.md` 使用相同的 `weight` 和相同的标题 ID。见[第 3 章](/zh/book/03-pages/#first-page)。

## 博客根页 {#blog-root}

```yaml {title="content/blog/_index.md"}
title: Blog
type: blog
sidebar_root_for: self
blog_index: cards
blog_index_toggle: true
cascade:
  type: blog
  feedback: false
```

见[第 6 章](/zh/book/06-blog/#index)。

## 沉浸式专栏 {#immersive}

```yaml {title="content/blog/post/_index.md"}
title: Posts
cascade:
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
```

这个专栏下的文章以全宽图片开篇，大纲排进正文栏，没有侧栏；订阅源、署名和系列都不受影响。见[第 6 章](/zh/book/06-blog/#immersive)。

## 博客文章 {#post}

```yaml {title="content/blog/post/why-monthly-partitions/index.md"}
title: Why Acme DB partitions by month
date: 2026-11-02
description: Monthly partitions make retention a file deletion.
authors: [mei-lin]
series: [storage-internals]
series_weight: 10
tags: [storage, design]
```

放在 `index.md` 旁边的 `featured.webp` 会成为缩略图和分享图片。使用 `authors` 和 `series` 之前，要先在 `hugo.yaml` 中声明对应的分类法。见[第 6 章](/zh/book/06-blog/#post)。

## 作者主页 {#author}

```yaml {title="content/authors/mei-lin/_index.md"}
title: Mei Lin
description: Maintains the Acme DB storage engine.
images: [portrait.webp]
```

见[第 6 章](/zh/book/06-blog/#authors)。

## Book 根页 {#book-root}

```yaml {title="content/book/_index.md"}
title: The Acme DB Operations Handbook
type: book
book_kind: book
outputs: [HTML, print, markdown]
cascade:
  type: book
  sidebar_headings: 3
```

根页放置 `book-toc` 和各类索引短代码，它的 `print` 输出就是合成一份文档的整本书。见[第 7 章](/zh/book/07-book/#root)。

## Book 章节 {#chapter}

```yaml {title="content/book/03-capacity.md"}
title: Plan capacity
book_kind: chapter
book_number: 3
book_status: draft
weight: 30
```

`book_number` 按原样显示；`book_status: draft` 只给章节加上草稿标记，并不会取消发布。见[第 7 章](/zh/book/07-book/#chapters)。

## 每个键在哪里生效 {#key-map}

| 键 | 写在哪里 | 作用 |
| --- | --- | --- |
| `weight` | 任意页面 | 决定页面在侧栏、翻页导航和全书目录中相对同级页面的顺序 |
| `type` | 分区根页，经 `cascade` 向下传递 | 阅读外壳：`docs`、`blog` 或 `book` |
| `cascade` | 分区根页 | 把其中的键应用到下面的每个页面 |
| `blog_index` | 博客根页或专栏 | `list`、`cards`、`table` 或 `gallery` |
| `featured_image` | 博客专栏或文章 | 文章顶部的 `none`、`banner`、`wash` 或 `hero` |
| `book_number` | Book 章节 | 章节编号，按原样显示 |
| `outputs` | 分区根页 | 替换站点为该页面设置的输出列表 |
{#tbl-key-map num="A-1" caption="本书用到的 front matter 键，以及每个键在哪里生效。"}
