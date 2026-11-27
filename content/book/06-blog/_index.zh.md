---
title: 发布文章与版本说明
linkTitle: 博客
description: 写带日期、作者、系列与封面图的文章，选择博客索引的样式，像 vonng.com 那样让文章以通栏大图开篇，并为每个版本发布公告。
book_kind: chapter
book_number: 6
weight: 60
aliases:
  - /book/05-publishing/
---

文档回答“怎么做”，而且始终保持最新；博客回答“改了什么、为什么改”，而且带着日期。OINK 为博客准备了一套自己的外壳：文章按日期排列，作者有个人主页，系列可以按顺序读下去，每个栏目都有自己的 Feed，文末附有分享链接。Starter 已经在 `content/blog/` 下带了一个博客；本章为 Acme DB 写第一篇正式文章，以及 3.0 版的发布说明。

## 写一篇文章 {#post}

带有自己图片的文章是一个页面包：一个目录，里面放着 `index.md` 和图片。把它放进 Starter 的 `post/` 子栏目：

```filetree {title="content/blog/post/"}
- why-monthly-partitions/
  - index.md
  - index.zh.md
  - featured.webp   # 文章的缩略图与分享图，按文件名自动识别
```

````markdown {title="content/blog/post/why-monthly-partitions/index.md" num="6-1" caption="一篇带作者、系列与标签的博客文章。" #eg-blog-post}
---
title: Why Acme DB partitions by month
date: 2026-11-02
description: Monthly partitions make retention a file deletion and keep most queries inside one directory.
authors: [mei-lin]
series: [storage-internals]
series_weight: 10
tags: [storage, design]
---

Retention used to mean deleting billions of rows. Since 2.0 it means deleting
one directory.

## One directory per month {#layout}

```filetree
- tables/cpu/
  - 2026-10/
  - 2026-11/
```
````

和文档页相比，文章里有三个键更要紧。`date` 决定文章在索引里的位置和 Feed 时间戳；日期在未来的文章要到当天才会进入构建，可以用 `hugo server -F` 提前预览。`description` 会作为导语显示在正文上方，所以要写成一句完整的话。名为 `featured.webp` 的图片不需要任何 front matter，就会成为索引里的缩略图和社交卡片上的配图；想用别的文件时，写 `images: [cover.png]`。

## 作者与系列 {#authors}

`authors` 和 `series` 是 Hugo 分类法，需要由站点声明。写出 `taxonomies` 会替换 Hugo 的默认设置，所以要把 tags 和 categories 重新列上：

```yaml {title="hugo.yaml"}
taxonomies:
  tag: tags
  category: categories
  author: authors
  series: series
```

现在文章会显示 Mei Lin 的署名，并链接到一个列出她全部文章的页面。这个页面就是分类法的 term 页，给它写一个 `_index.md`，它就有了个人简介：

```markdown {title="content/authors/mei-lin/_index.md"}
---
title: Mei Lin
description: Maintains the Acme DB storage engine.
images: [portrait.webp]
---

Mei has worked on time-series storage since 2018 and wrote the partition layer.
```

署名使用简介页的 `title`；想显示更短的名字时，改用它的 `linkTitle`。系列也是同样的道理：写了 `storage-internals` 的文章会在正文上方显示一条横幅，标明本篇在系列中的位置，并链接到下一篇，顺序由 `series_weight` 决定；`content/series/storage-internals/_index.md` 则是这个系列的引言。

## 选择索引样式 {#index}

博客首页按从新到旧的顺序列出全部文章。`blog_index` 设置布局，`blog_index_toggle` 让读者自己切换：

```yaml {title="content/blog/_index.md"}
blog_index: cards
blog_index_toggle: true
```

| 取值 | 读者看到什么 |
| --- | --- |
| `list` | 一行一篇，带缩略图、日期、标签和摘要。默认值 |
| `cards` | 卡片网格，每个标题上方是一张裁切过的封面 |
| `table` | 每篇文章一行紧凑条目，一页就是全部文章的归档 |
| `gallery` | 封面按原有比例排列，适合以图片为主的博客 |
{#tbl-blog-index num="6-1" caption="博客索引的四种布局。"}

打开切换后，标题旁会出现一个切换按钮；启用键盘导航时，按 {{< kbd "L" >}} 可以在各种布局之间轮换。可以在本站的[博客](/zh/blog/)上试一试。

## 以大图开篇的文章 {#immersive}

vonng.com 的每篇文章都以一张通栏大图开篇，大纲随正文栏排列，侧栏则被去掉，读起来像一本杂志。它的首页也用同一类图片定下基调：

![vonng.com 首页：湖景之上是作者首屏，下方是专栏列表](/case/vonng-com/featured.webp)
{#fig-vonng-home num="6-1" caption="vonng.com：风景照上的作者首屏，下方是六个专栏，每个专栏都有自己的 Feed。" width=900 height=506}

这种文章布局只需要四个普通的键。在栏目的 `cascade` 里写上它们，就只作用于这一个专栏，博客的其余部分不受影响：

```yaml {title="content/blog/post/_index.md"}
cascade:
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
```

`featured_image` 可取 `none`、`banner`、`wash` 或 `hero`；没有图片的文章就不显示题图。这样的文章仍是普通的博客文章，Feed、署名和系列横幅都一样不少。本站的[沉浸式阅读](/zh/blog/immersive-reading/)一文用的正是这几个键。

## 发布版本公告 {#releases}

版本公告是 `blog/release/` 下的一篇普通文章，短标题就是版本号。一个 front matter 键关联 GitHub Release，`release-card` 短代码据此画出一张卡片，上面有版本标签、日期和源码归档：

```markdown {title="content/blog/release/3.0.0.md"}
---
title: Acme DB 3.0 — tiered storage and a faster ingest path
linkTitle: v3.0.0
date: 2026-10-20
description: Tiered storage moves old partitions to object storage, and the ingest path is three times faster.
release_url: https://github.com/acme/acme-db/releases/tag/v3.0.0
tags: [release]
---

{{</* release-card */>}}

## Highlights {#highlights}

- Tiered storage moves partitions older than `retention.hot` to S3.
- Ingest throughput is up from 1.2 to 3.4 million points per second.
```

发布公告交代某项功能何时上线、为何上线；怎么使用，仍以文档页为准。两者之间互相链接，不要复制内容。[发布与下载页](/zh/docs/write/releases/)还介绍了带校验和的资产表，以及由 `data/download/` 驱动的下载页。

## Feed 与分享 {#feeds}

每个带 `RSS` 输出的栏目都有自己的 Feed，而 Starter 已经列上了这项输出，所以 `/blog/index.xml` 包含全部文章，`/blog/release/index.xml` 只包含版本公告；RSS 按钮就在标题那一行。分享链接默认关闭，写明分享目标后才会出现：

```yaml {title="hugo.yaml"}
params:
  ui:
    share: [x, linkedin, hackernews, email, copy]
```

每个目标都只是一个普通链接或一个复制按钮，不加载任何第三方脚本。评论在完整配置后使用 Giscus，见[启用评论](/zh/docs/admin/comments/)。

## 检查成果 {#checkpoint}

- 新文章带着封面图排在 `/blog/` 的第一位，按 {{< kbd "L" >}} 可以让索引在四种布局之间切换。
- 点击文章上 Mei Lin 的名字会打开她的个人主页，系列横幅显示这是 Storage internals 的第 1 篇。
- 加上 cascade 之后，`post/` 下的文章以通栏大图开篇，大纲位于正文栏中。
- `/blog/release/index.xml` 列出了 3.0 版的发布说明。

## 交给 agent {#agent}

```text {num="6-2" caption="提示词：照 vonng.com 的方式搭建博客。" #eg-agent-blog}
按照 https://oink.pgsty.com/zh/docs/write/blog/ 配置博客。启用 authors 和 series
两个分类法（保留 tags 和 categories），根据 <个人简介> 创建我的作者主页，并把每篇带
图片的文章改成页面包，图片命名为 featured.webp。给 post/ 专栏加上沉浸式阅读的
cascade：featured_image 设为 hero，toc_style 设为 flow，toc_taxonomies 设为 false，
sidebar_enabled 设为 false。博客索引用卡片布局，并打开布局切换。根据 CHANGELOG.md
为 <版本号> 写发布说明，带上 release_url 和 release-card。最后在浏览器里检查各种
索引布局、一个作者页和 Feed。
```
