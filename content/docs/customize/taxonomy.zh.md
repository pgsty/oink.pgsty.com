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

目录树只有一条路径，分类体系（taxonomy）给页面加第二条：同一篇 PostgreSQL 备份文档既在「运维」目录下，又能从「备份」标签页找到。启用它只需要 Hugo 的 `taxonomies:` 配置，术语页、术语卡片、右栏分类云与顶栏分类面板都由主题自动生成，无需编写模板。

本页带着一个分类：标题下面的「分类: 定制站点」一行，以及右栏目录下面那组带计数的芯片，都不需要在页面上写配置。

## 启用分类法 {#enable}

分类法由 Hugo 决定，主题不额外提供开关。在 `hugo.yml` **顶层** 写 `taxonomies:`，键是单数名、值是复数名：

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
```

这是本站的配置。三点需要注意：

- 写了 `taxonomies:` 之后它就是 **完整列表**，不是追加。想在自定义分类法之外保留 `tags` / `categories`，必须把它们一起列出来。
- 复数名同时是 URL 段：`/zh/tags/`、`/zh/categories/`。
- 全部关闭：`disableKinds: [taxonomy, term]`。

加一个自己的分类法，例如按产品模块归类：

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
  module: modules
```

分类法的显示名：`tag` `tags` `category` `categories` `module` `modules` 这六个键在主题的每个语言文件里都有本地化标题（中文分别是「标签」「分类」「模块」）。其它分类法用复数名的 humanize 结果（`products` → `Products`）。要自己定名字，在 `content/<复数名>/_index.md` 与 `_index.zh.md` 里写 `title` / `linkTitle`，主题会优先用它：

```yaml {title="content/modules/_index.zh.md"}
---
title: 产品模块
linkTitle: 模块
---
```

## 为页面添加标签 {#assign}
front matter 里的键名用 **复数名**（`taxonomies` 的值那一列），值始终是列表，只有一项也要写成列表：

```yaml {title="content/docs/ha/patroni.zh.md"}
---
title: Patroni 高可用
description: 用 Patroni 管理 PostgreSQL 主从切换。
categories: [高可用]
tags: [PostgreSQL, Patroni, 故障切换]
---
```

整个栏目共用一个分类时，写在栏目首页的 `cascade` 里，无需每页重复：

```yaml {title="content/docs/customize/_index.zh.md"}
---
title: 定制站点
linkTitle: 定制站点
icon: fa-solid fa-sliders
cascade:
  categories: [定制站点]
---
```

本站 docs 的六个栏目都是这样配置的。页面自己写 `categories:` 会覆盖 cascade，不合并：要在栏目分类之外再加一个，两个都要写出来。

## 页面上的术语行 {#page-header}

文档页与博客页在标题、摘要下面渲染一行已分配的术语，链接指向对应的术语页，本页顶部的「分类: 定制站点」即是。这一行的容器是 `.taxonomy-terms-article`，按分类法另带一个 `.taxo-<复数名>` 类，单独调样式时用这两个选择器。

默认列出该页的 **全部** 分类法，只有 `authors` 与 `series` 这两个保留复数除外——它们各自有专门的呈现面（署名行与系列横幅），再列一遍标签等于把同一件事说两遍。在 `page_header` 里点名，就能把它放回去。

只想显示其中几种、并固定顺序：

```yaml {title="hugo.yml"}
params:
  taxonomy:
    page_header: [categories]
```

这一项由[配置总览](/zh/docs/customize/config/)收录。它不能用来隐藏这一行，见[限制](#limits)。

## 主题认识名字的两个分类法 {#authors}

`authors` 与 `series` 就是普通的 Hugo taxonomy，按普通方式声明——主题不为它们增加任何参数。主题增加的是各自的一套呈现，所以「声明」本身就是全部开关：

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
  series: series
```

| 复数名 | 声明之后打开了什么 | term 页变成什么 |
| --- | --- | --- |
| `authors` | 文章头部的头像与带链接的名字、列表行上的名字、feed 里每位作者一条 `<dc:creator>` | 作者主页：显示名取 term 页的链接标题（有 `linkTitle` 用它，否则用 `title`），`description` 是一句话介绍，正文是长介绍，头像取题图解析器为这一页选中的那张 |
| `series` | 正文上方一条横幅，写明系列名、本篇位置、下一篇，以及折在 `<details>` 里的完整列表 | 系列引言，成员按阅读顺序排列，而不是最新在前 |

两者的完整说明与各自需要的 front matter 在[写博客](/zh/docs/write/blog/#authors)。这里只提两件事：

- 主题刻意不设 `data/authors` 文件。作者主页就是 term 页本身，因此不存在第二份权威跟它打架。
- 系列 term 页是唯一不按时间倒序排列的 term 页。写了 `series_weight` 的成员按升序排在前，其余按日期升序跟在后。term 页没法把顺序交给 Hugo，所以主题自己算一次，两处呈现读同一份结果。

## 标签页与分类页 {#term-pages}

每种分类法生成两级页面：

| 页面 | URL | 内容 |
| --- | --- | --- |
| 分类法列表页 | `/zh/categories/` | 页头是分类法图标、本地化名（「分类」）与术语数，下面每个术语一张卡片，使用次数多者在前：术语图标（作者则是头像）、术语名与页面数 |
| 术语页 | `/zh/categories/定制站点/` | 页头是术语标题与页面数（关闭面包屑时另有一行「分类」kicker 链回列表页），下面按日期倒序列出该术语的全部页面，样式与博客列表一致 |

中文术语的 URL 使用中文字符（浏览器地址栏显示 `定制站点`，HTML 里是百分号编码），Hugo 不做拼音转写。需要 ASCII URL 时改用英文术语，再在 `content/categories/<术语>/_index.zh.md` 里用 `title` 给它一个中文显示名，这是 Hugo 的[术语页内容文件](https://gohugo.io/content-management/taxonomies/#add-custom-metadata-to-a-taxonomy-or-term)机制。

术语页在内容树里没有固定位置，它借用一个：某术语的成员全部位于同一个顶层栏目下时，术语页用那个栏目渲染侧栏树与根链接，读者从文档里点进标签仍留在文档导航中；成员跨栏目时回退到站点级的树。

术语卡片只出现在分类法列表页；术语页上换成右栏的分类云。

## 右栏的分类云 {#rail-cloud}

文档页、博客页与术语页的右栏（目录下面）每种分类法一组，芯片带计数，可折叠。这一组是自动的，没有开关：定义了分类法且当前范围内有术语时就会出现。

分类法列表页与术语页的右栏最上面是分类法切换器：声明的每种分类法一行，带图标、名称与术语数，链向各自的列表页，当前那一行高亮。列表页的分类云按全站统计，并略去自己这一种——它的术语就是旁边的卡片。只有一种分类法的站点不显示切换器。

计数 **不是全站计数**，而是按顶层栏目统计：先看页面的 `type` 有没有同名栏目（`type: docs` 的页面用 `/docs/` 这棵树），没有就用页面所在的顶层栏目。博客页上的「标签: release 4」说的是博客里有 4 篇，不是全站有 4 篇。

图标按复数名配置：

```yaml {title="hugo.yml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: fa-solid fa-tags
      modules: fa-solid fa-cubes
```

`categories` 与 `tags` 的默认值就是上面那两个，其它分类法默认 `fa-solid fa-shapes`。图标是一对 Font Awesome class，与站点其它地方的图标写法一致。

## 顶栏菜单里的分类面板 {#navbar-panel}

主菜单里指向分类法列表页的条目，会自动变成一块术语芯片面板（按用量降序，带计数），无需手写下拉项：

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

`pageRef: /tags` 与旧式的 `url: /zh/tags/` 都能识别：URL 形式的菜单先解析成本站页面再判断类型，从旧配置迁移时不必改写法。菜单本身的其它写法见[导航与菜单](/zh/docs/customize/navigation/)。

## 双语标签 {#bilingual}

Hugo 的分类按语言分开统计、分开链接：`/categories/` 与 `/zh/categories/` 是两棵互不相干的树，中文页只进中文那棵。术语要在各自语言的 front matter 里各写一遍：

```yaml {title="content/docs/ha/patroni.md"}
categories: [High availability]
tags: [PostgreSQL, Patroni, failover]
```

```yaml {title="content/docs/ha/patroni.zh.md"}
categories: [高可用]
tags: [PostgreSQL, Patroni, 故障切换]
```

两条要注意：

- 同一个词在两种语言里写成同样的字符串（例如 `release`），得到的仍然是 `/categories/release/` 与 `/zh/categories/release/` 两个术语页，各自只统计本语言的页面。不要为了统一而在中文页里写英文词：右栏芯片会显示英文。
- 分类法的显示名会跟着语言走（上面那六个内置键），但 **术语名不会**：术语就是你在 front matter 里写的那个字符串，主题不翻译它。英文页里写 `高可用`，英文站的芯片上显示的就是 `高可用`。

多语言站点的其余部分见[多语言](/zh/docs/customize/i18n/)。

## 按内容类型开关 {#per-type}

主题没有「文档显示、博客不显示」这类开关，控制点是给哪些页面打标签。本站的做法：

| 内容 | categories | tags | 效果 |
| --- | --- | --- | --- |
| `content/docs/**` | 栏目级 cascade（「定制站点」等六个） | 不打 | 术语行只有一行「分类」 |
| `content/blog/**` | 每篇写（`release`、`oink`） | 每篇写（`Oink`、`Release`） | 术语行两行，右栏两组芯片 |

让整个栏目从分类里消失：删掉栏目首页 cascade 里的 `categories`，不需要别的配置。让某一页不进分类：在它自己的 front matter 里写 `categories: []`，空列表覆盖 cascade。

## 验证 {#verify}

页面上看三处：

- 本页标题下面有一行「分类: 定制站点」；
- 右栏目录下面有按分类法分组的芯片，每枚带计数；
- 打开 [/zh/categories/](/zh/categories/) 能看到每个术语一张卡片，点任一张进入术语页。

命令行上查产物：

```bash
hugo -d public
ls public/zh/categories/          # 每个术语一个目录
grep -c 'taxonomy-term' public/zh/docs/customize/index.html
```

主题仓库自带一个针对性检查，验证「不写 `taxonomies:` 就不生成分类页」与「术语页在中英文下标题正确」两件事：

```bash
cd ~/pgsty/oink && python3 bin/check-taxonomy.py
```

## 限制 {#limits}

- `page_header: []` **不会** 隐藏术语行：空列表被当作未设置，回落到「列出全部分类法」。要去掉这行，就不要给这些页面打标签，或在 `assets/scss/_styles_project.scss` 里隐藏 `.taxonomy-terms-article`。
- 右栏分类云没有开关，也没有条数上限；术语数量很多的站点应当减少分类法，配置层面没有裁剪手段。
- 术语页没有跨语言对等关系：语言切换在术语页上不保证落到「同一个术语的另一种语言」。

## 相关 {#related}

- [页面参数](/zh/docs/write/frontmatter/) — `categories` / `tags` 与其它 front matter 键
- [博客与文章](/zh/docs/write/blog/) — 博客列表页与分类的配合
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单条目怎么写
- [多语言](/zh/docs/customize/i18n/) — 分语言的内容与菜单
- [配置总览](/zh/docs/customize/config/) — `params.taxonomy.*` 与 `params.ui.taxonomy_icons` 的完整定义
