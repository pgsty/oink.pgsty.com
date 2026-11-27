---
title: 分类体系
linkTitle: 分类体系
description: 用 tags / categories 给页面加一条横跨目录的索引：术语页、术语卡片、右栏分类云与顶栏分类面板都是自动的。
weight: 110
search_keywords:
  [分类体系, 分类法, 标签, 分类, 术语页, 标签云, taxonomy, taxonomies, tags, categories, term]
aliases:
  - /docs/content/taxonomy/
---

目录树只给每个页面一个位置，标签和分类给它更多入口。一篇 PostgreSQL 备份指南可以放在「运维」目录下，同时在「备份」标签页上一键可达；按主题而不是按你的目录结构找东西的读者，也能找到它。在 `hugo.yml` 里声明分类法、给页面打上术语，术语页、术语卡片、右栏分类云和顶栏分类面板就由 OINK 自动生成，不需要自己写模板。

本页就是例子：标题下方的「分类: 定制站点」一行，以及右栏目录下方那组带计数的芯片，都来自所在分区的分类，页面本身没有写任何配置。

## 启用分类法 {#enable}

分类法是 Hugo 的功能，主题没有额外的开关。在 `hugo.yml` 的 **顶层** 写 `taxonomies:`，键是单数名，值是复数名：

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
```

- 这是完整列表，不是在 Hugo 默认值上追加：一旦写了 `taxonomies:`，只有列出来的 `tags`、`categories` 才存在。
- 复数名同时是 URL 段：`/zh/tags/`、`/zh/categories/`。
- `disableKinds: [taxonomy, term]` 关闭全部分类法。

再按产品模块归类：

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
  module: modules
```

`tags`、`categories`、`modules`、`authors`、`series` 及其单数形式，在主题的每个语言文件里都有译名（中文分别是「标签」「分类」「模块」「作者」「系列」）。其它分类法以复数名命名（`products` 显示为 `Products`）。要自己定名称，在 `content/<复数名>/_index.md` 及其译文（例如 `_index.zh.md`）里写 `title` / `linkTitle`，这个名称优先：

```yaml {title="content/modules/_index.zh.md"}
---
title: 产品模块
linkTitle: 模块
---
```

## 为页面添加标签 {#assign}

front matter 里的键用 **复数名**（`taxonomies` 的值那一侧），值始终是列表，只有一个术语也要写成列表：

```yaml {title="content/docs/ha/patroni.zh.md"}
---
title: Patroni 高可用
description: 用 Patroni 管理 PostgreSQL 主从切换。
categories: [高可用]
tags: [PostgreSQL, Patroni, 故障切换]
---
```

整个分区共用一个分类时，在分区索引页的 `cascade` 里写一次，不必每页重复：

```yaml {title="content/docs/customize/_index.zh.md"}
---
title: 定制站点
linkTitle: 定制站点
icon: fa-solid fa-sliders
cascade:
  categories: [定制站点]
---
```

本站文档的六个分区都是这样配置的。页面自己写的 `categories:` 会替换 cascade 下来的值，而不是合并，所以要在分区分类之外再加一个分类，两个都要写上。

## 页面上的术语行 {#page-header}

文档页与博客页在标题和摘要下方列出本页的术语，每个术语链接到对应的术语页；本页的这一行是「分类: 定制站点」。要单独调样式，选择容器 `.taxonomy-terms-article` 以及每种分类法附加的 `.taxo-<复数名>` 类。

这一行默认列出 **所有** 分类法，只有 `authors` 与 `series` 除外：它们的术语已经出现在署名行和系列横幅里，再列成芯片等于把同一件事说两遍。只想显示其中几种、并固定顺序时，在 `page_header` 中列出；在这里写上 `authors` 或 `series`，它们也会重新出现：

```yaml {title="hugo.yml"}
params:
  taxonomy:
    page_header: [categories]
```

`page_header` 不能用来隐藏这一行，见[限制](#limits)。这个键收录在[配置总览](/zh/docs/customize/config/)中。

## 主题认识名字的两个分类法 {#authors}

`authors` 与 `series` 是普通的 Hugo 分类法，主题没有为它们增加任何参数。声明它们就是全部开关，因为主题为两者各准备了一套专门的呈现：

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
  series: series
```

| 复数名 | 声明之后打开了什么 | 术语页变成什么 |
| --- | --- | --- |
| `authors` | 文章头部的头像与带链接的姓名、列表行上的姓名、feed 中每位作者一条 `<dc:creator>` | 作者主页：显示名取 `linkTitle`，没有时取 `title`；`description` 是简短介绍，正文是详细介绍；头像由题图解析器选出 |
| `series` | 正文上方一条横幅，写明系列名、本篇的位置与下一篇，完整列表收在 `<details>` 里 | 系列引言，成员按 **阅读顺序** 排列，而不是最新在前 |

两者的完整说明以及各自需要的 front matter 见[写博客](/zh/docs/write/blog/#authors)。有两个设计取舍值得提前知道：

- 没有 `data/authors` 文件。术语页本身就是作者主页，因此永远不会有第二份数据与它冲突。
- 系列成员按阅读顺序排列：设置了 `series_weight` 的成员按升序排在前面，其余按日期升序排在后面。术语页无法把这种顺序交给 Hugo，所以主题计算一次，系列横幅和术语页共用同一结果。

## 标签页与分类页 {#term-pages}

每种分类法生成两级页面：

| 页面 | URL | 内容 |
| --- | --- | --- |
| 分类法列表页 | `/zh/categories/` | 页头是分类法图标、本地化名称（「分类」）与术语数；下面每个术语一张卡片，用得最多的在前，卡片上有术语图标（作者则是头像）、名称与页面数 |
| 术语页 | `/zh/categories/定制站点/` | 页头是术语标题与页面数，关闭面包屑时另有一行「分类」引题链接回列表页；下面按日期倒序列出成员页面，样式与博客列表相同 |

术语卡片只出现在分类法列表页上，术语页上换成右栏的分类云。

Hugo 不做拼音转写，所以中文术语得到中文 URL：浏览器地址栏显示 `定制站点`，HTML 里是百分号编码。需要 ASCII URL 时，改用英文术语，再在 `content/categories/<术语>/_index.zh.md` 里用 `title` 给它一个中文显示名，这是 Hugo 的[术语页内容文件](https://gohugo.io/content-management/taxonomies/#add-custom-metadata-to-a-taxonomy-or-term)机制。

术语页在内容树中没有自己的位置，所以借用一个。它的成员都属于同一个顶层分区时，术语页显示该分区的侧栏树与根链接，读者从文档里点进一个标签，仍留在文档的导航中；成员跨越多个分区时，显示站点级的树。

## 右栏的分类云 {#rail-cloud}

文档页、博客页与术语页的右栏在目录下方为每种分类法显示一组带计数、可折叠的芯片。只要声明了该分类法、且当前范围内有术语，这组芯片就会出现。要隐藏分类云和分类法切换器，在页面 front matter 中设置 `toc_taxonomies: false`，或在 `hugo.yml` 中设置 `params.ui.toc_taxonomies: false` 全站隐藏。这只改变右栏，页面的术语、署名、系列与分类归属都不受影响。

分类法列表页与术语页的右栏最上方是分类法切换器：每种已声明的分类法一行，带图标、名称与术语数，链接到各自的列表页，当前分类法高亮。只有一种分类法的站点不显示切换器。列表页的分类云按全站统计，并略去自己这种分类法，因为它的术语就是旁边的卡片。

其它页面上的计数 **按顶层分区统计**，而不是全站。主题先找与页面 `type` 同名的分区，`type: docs` 的页面因此在 `/docs/` 范围内计数；找不到时，使用页面所在的顶层分区。博客页上的「标签: release 4」表示博客里有 4 篇，而不是全站有 4 页。

每种分类法有两个内置图标：一个用于分组标题，一个用于每个术语芯片。

| 分类法 | 分组图标 | 术语图标 |
| --- | --- | --- |
| `categories` | `fa-solid fa-folder-open` | `fa-solid fa-folder` |
| `tags` | `fa-solid fa-tags` | `fa-solid fa-tag` |
| `modules` | `fa-solid fa-cubes` | `fa-solid fa-cube` |
| `authors` | `fa-solid fa-users` | `fa-solid fa-user-pen` |
| `series` | `fa-solid fa-book-bookmark` | `fa-solid fa-book` |
| 其它 | `fa-solid fa-shapes` | `fa-solid fa-shapes` |

按复数名覆盖。写成字符串时同时设置两个图标；写成带 `taxonomy` 与 `term` 的映射时分别设置，省略的那个保留内置图标。每个值都是一对 Font Awesome class：

```yaml {title="hugo.yml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: { taxonomy: fa-solid fa-tags, term: fa-solid fa-hashtag }
      modules: fa-solid fa-cubes
```

## 顶栏菜单里的分类面板 {#navbar-panel}

主菜单中指向分类法列表页的条目，会展开一块术语芯片面板，带计数，用得最多的在前。不需要为它写下拉子项：

```yaml {title="hugo.yml"}
languages:
  zh:
    menus:
      main:
        - identifier: tags
          name: 标签
          pageRef: /tags
          weight: 60
```

旧式的 `url: /zh/tags/` 写法同样有效：主题会先把 URL 条目解析成它指向的站内页面，再判断该页面是不是分类法，因此现有菜单不必改写。菜单的其它写法见[导航与菜单](/zh/docs/customize/navigation/)。

## 双语标签 {#bilingual}

Hugo 按语言分别统计和链接分类法：`/categories/` 与 `/zh/categories/` 是两棵互不相干的树，中文页面只属于中文那一棵。术语要在各语言的 front matter 里分别写：

```yaml {title="content/docs/ha/patroni.md"}
categories: [High availability]
tags: [PostgreSQL, Patroni, failover]
```

```yaml {title="content/docs/ha/patroni.zh.md"}
categories: [高可用]
tags: [PostgreSQL, Patroni, 故障切换]
```

- 两种语言写同一个字符串（例如 `release`），仍然得到 `/categories/release/` 与 `/zh/categories/release/` 两个术语页，各自只统计本语言的页面。为了统一而在中文页面上写英文术语，得不到任何好处，只会让中文读者看到英文芯片。
- 内置复数名对应的分类法名称会随语言翻译，但 **术语名不会**：术语就是 front matter 里写的那个字符串。在英文页面上写 `高可用`，芯片上显示的就是 `高可用`。

多语言站点的其余内容见[多语言](/zh/docs/customize/i18n/)。

## 按内容类型开关 {#per-type}

右栏分类云是显示设置。要在文档中保留、在整个博客中隐藏，就在博客索引页上设置开关并 cascade 到所有文章：

```yaml {title="content/blog/_index.zh.md front matter"}
toc_taxonomies: false
cascade:
  toc_taxonomies: false
```

页面属于哪些分类是另一件事，由你分配的术语决定。例如，本站用分类区分分区，只在博客上使用标签：

| 内容 | categories | tags | 效果 |
| --- | --- | --- | --- |
| `content/docs/**` | 分区级 cascade（「定制站点」等六个） | 不打 | 术语行只有一行「分类」 |
| `content/blog/**` | 每篇写（`release`、`oink`） | 每篇写（`Oink`、`Release`） | 术语行两行，右栏两组芯片 |

要让整个分区退出某个分类法，删掉分区索引页 cascade 里的 `categories`。要让单个页面退出，在它的 front matter 里写 `categories: []`，空列表会覆盖 cascade。

## 验证 {#verify}

在自己站点里找一个已分配术语的页面，检查：

- 标题区显示了 `params.taxonomy.page_header` 选定的分类法；
- `toc_taxonomies` 开启时，右栏有带计数的术语分组；关闭后分类云消失，页面的术语仍然保留；
- 分类法列表页（例如 `/zh/categories/`）列出了术语，点进去能看到成员页面。

在站点根目录执行，把两个示例路径换成自己的路径，并带上语言前缀：

```bash
hugo --printPathWarnings
PAGE=public/zh/docs/getting-started/index.html
TAXONOMY_DIR=public/zh/categories
ls "$TAXONOMY_DIR"
test -f "$PAGE" && grep -o 'taxonomy-term' "$PAGE"
```

## 限制 {#limits}

- `page_header: []` **不会** 隐藏术语行：空列表被当作未设置，于是列出所有分类法。要去掉这一行，就不要给这些页面打术语，或者在 `assets/css/project.css` 中隐藏 `.taxonomy-terms-article`。
- `toc_taxonomies: false` 可以隐藏右栏分类云，但没有设置能限制可见分类云显示的术语数量。
- 术语页没有跨语言配对，在术语页上切换语言，不一定落到另一种语言里的同一个术语。

## 相关 {#related}

- [页面参数](/zh/docs/write/frontmatter/) — `categories` / `tags` 与其它 front matter 键
- [博客与文章](/zh/docs/write/blog/) — 博客列表页与分类的配合
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单条目怎么写
- [多语言](/zh/docs/customize/i18n/) — 分语言的内容与菜单
- [配置总览](/zh/docs/customize/config/) — `params.taxonomy.*` 与 `params.ui.taxonomy_icons` 的完整定义
