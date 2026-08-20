---
title: 博客与文章
linkTitle: 博客与文章
description: 开一个博客栏目：目录约定、文章的 front matter、封面图、按年份分组的列表页与 RSS。
weight: 40
search_keywords: [博客, 文章, blog, post, RSS, Feed, 封面图, featured image, 作者, 日期, 分页]
---

博客文章与文档页的正文写法相同，区别在外壳：文章带日期、作者、标签与封面图，列表按年份倒序排列，栏目带 RSS。本页覆盖博客栏目的建立、文章 front matter、封面图、列表分页与 Feed。

## 博客目录结构 {#layout}
博客是 `content/` 下的一个栏目，`type: blog` 使它使用博客外壳。子目录按发布方与受众划分，文章平铺其中。不要建年份目录，年份分组由列表页自动生成：

```filetree {title="本站的 content/blog/"}
- content/
  - blog/
    - _index.md                      # type: blog + cascade
    - _index.zh.md
    - oink/                          # 工程实践与公告
      - _index.zh.md                 # cascade: images: [/images/oink.webp]
      - oink-announcement.md
      - oink-announcement.zh.md
    - release/                       # 带版本号的发布注记
      - _index.zh.md                 # cascade: images: [/images/releasenote.webp]
      - 0.4.0.md
      - 0.4.0.zh.md
```

栏目根把类型下推给整棵子树，并设定该栏目共用的行为：

```yaml {title="content/blog/_index.zh.md"}
---
title: 博客
description: OINK 工程实践与发布注记
type: blog
icon: fa-solid fa-blog
sidebar_root_for: self      # 博客有自己的侧栏树
cascade:
  type: blog
  feedback: false           # 文章不问「这页有帮助吗」
  comments: true            # 但开评论
---
```

`params.ui.blog_section`（默认 `blog`）指明博客根的位置。目录另起名字时改这个参数，或按上面的写法用 `sidebar_root_for: self`。

侧栏里博客栏目默认展开，条目按日期倒序；给某篇文章写上 `weight` 会把它固定在最前。

## 一篇文章的 front matter {#front-matter}

```yaml {title="content/blog/release/0.4.0.zh.md"}
---
title: Oink 0.4.0 — 面向完整发布流程的场景组件体系
linkTitle: Oink v0.4.0        # 侧栏与翻页器里的短名
date: 2026-08-14              # 发布日期，决定排序与分组
lastmod: 2026-08-14
description: >-
  Oink 0.4.0 交付连续阅读与发布界面、可复用 Landing 页面、
  带稳定引用的 Book 出版能力，以及键盘优先的站点外壳。
author: OINK 维护者
categories: [发布]
tags: [Oink, Release]
---
```

与文档页不同的几点：

- `date` 必填。它决定文章在列表里的位置、年份分组与 RSS 时间。写在未来的日期默认不构建，`hugo server -F` 可以预览。
- `description` 渲染成正文上方的导语，不只是搜索摘要，因此写成给读者阅读的一句话。
- `author` 支持行内 Markdown，可以写成 `[Vonng](https://vonng.com)`。需要多位作者、头像或作者主页时，改用下面的 `authors` taxonomy；两者互不干扰，没写 `authors` 的文章照旧渲染 `author`。
- 日期显示格式由 `params.time_format_blog` 决定，可以按语言分别设置（本站英文是 `Monday, January 02, 2006`，中文是 `2006年1月2日`）。

双语文章成对存放，两种语言的 `date`、`author`、`weight`、`aliases` 保持一致；标题、描述、标签要翻译，提交 ID、版本号、命令和 URL 不翻译。

## 封面图 {#featured-image}

列表页与标签页的每一行左侧有一张缩略图，按以下顺序解析，第一个命中的生效：

1. 文章 front matter 的 `images`，取第一项；
2. 页面包里文件名含 `featured` 的图片资源（会被裁切成缩略图，图片资源自己的 `byline` 会作为图注）；
3. 从祖先栏目 `cascade` 继承来的 `images`，就近生效。

栏目级默认封面用 Hugo 原生的 `cascade` 覆盖整棵子树，本站两个子栏目各设一张：

```yaml {title="content/blog/release/_index.zh.md"}
cascade:
  images: [/images/releasenote.webp]
```

某一篇不要封面时，在它的 front matter 写 `images: []`；整个子栏目都不要，就把 `images: []` 写进那一层的 `cascade`。站点级的 `params.images` 不受影响 —— 它只做分享卡片，不会渲染成列表缩略图。

### 渲染到文章正文里 {#featured-image-article}

默认情况下，解析出来的这张图只出现在列表行与社交卡片里，文章本身什么都不显示——手写一个题图，迟早会和卡片对不上。`params.ui.featured_image` 让主题用同一个解析结果把它渲染出来：

| 模式 | 文章里显示什么 |
| --- | --- |
| `none` | 什么都不显示。主题默认值，所以今天不渲染题图的站点，升级后渲染出的字节完全一样 |
| `banner` | 标题上方一张固定 16:9 的图，连着读一串文章时节奏统一 |
| `wash` | 图铺在文章头部背后，只留十分之一的不透明度，在正文开始之前渐隐为无——文章从自己的主题里取到一点颜色，却不消耗任何对比度 |

```yaml {title="hugo.yml"}
params:
  ui:
    featured_image: banner
```

页面键是 `featured_image`，所以某个子栏目的 `cascade` 可以只为那棵树打开它，单篇文章也可以退出。没有题图的文章在两种模式下都不渲染任何东西——正因如此，一个题图有一搭没一搭的栏目也可以整体打开这个开关。两种模式都不引入脚本，也不增加打包成员。

```yaml {title="content/blog/release/_index.md"}
cascade:
  featured_image: wash
```

## 列表页与分页 {#list}

栏目 `_index.md` 的正文之后，主题自动接上文章列表：按年份分组（「撰写于 2026」），年份倒序，每条显示标题、日期、所属子栏目、标签、缩略图与正文前 250 字的摘要。

分页用 Hugo 原生的分页器，默认每页 10 篇，在 `hugo.yml` 里调整：

```yaml {title="hugo.yml"}
pagination:
  pagerSize: 20
```

取值与其余分页选项见 [Hugo 文档](https://gohugo.io/configuration/pagination/)。

### 卡片形态 {#list-cards}

`params.ui.blog_index: cards` 把同一份列表渲染成内容卡片网格而不是行列表：文章题图的 16:9 裁切在上，标题、日期与子栏目行居中，下面三行摘要。

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index: cards
    blog_index_columns: 3
```

这个选择纯粹是呈现层面的——按年分组、分页与 `manual_link` 的行为完全一致，行列表那一路的输出一个字节都没变。列数只在 xl 断点以上生效；md 到 xl 之间恒为两列，md 以下一列。博客根目录的 front matter `blog_index` 或它的 `cascade` 可以按栏目设置。Term 页与 taxonomy 页保持行列表，读者侧没有在两种形态之间切换的开关。

卡片题图只要资源可处理就走 Hugo 的 `.Fill`，一屏卡片不会为此下载一堆原图。

## RSS {#rss}

哪些页面产出 Feed 由 `outputs` 决定。给 `section` 加上 `RSS`，每个栏目就有自己的 Feed：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

`outputs` 一旦写出就整体替换 Hugo 的默认值，`RSS` 必须显式写回。漏写等于关闭该类页面的 Feed，构建不会报错。

本站因此有 `/zh/blog/index.xml`（整个博客）与 `/zh/blog/release/index.xml`（只有发布注记）。栏目 Feed 递归包含所有子栏目的文章，订阅 `/zh/blog/` 即可收到全部。单篇文章没有自己的 `.xml`。

每种语言有各自的 Feed，地址是该语言路由加 `index.xml`。条数上限由 Hugo 的 `services.rss.limit` 控制。在博客根与它的一级子栏目页上，标题行右侧操作按钮的首位是 RSS 链接，读者不必手拼地址。

全站不需要 Feed 时用 `disableKinds` 关闭这一类输出，比逐个页面类型删除 `RSS` 更彻底：

```yaml {title="hugo.yml"}
disableKinds: [RSS]
```

组件在 Feed 里退化成静态形态：折叠块展开、交互控件去掉。四态输出的规则对博客与文档一致。

## 分类与标签 {#taxonomy}

`tags` 与 `categories` 是 Hugo 的分类体系，主题把它们渲染成文章头部的 chip、右栏的标签云和顶栏的筛选菜单。启用、双语标签与按内容类型开关见[分类体系](/zh/docs/customize/taxonomy/)。

## 发布注记 {#release-notes}

带版本号的发布公告写成普通文章，惯例放在 `blog/release/` 下，`linkTitle` 带版本号（`Oink v0.4.0`）。需要发布卡片、资产表与校验和的下载页见[发布与下载页](/zh/docs/write/releases/)。

## 文章里用组件 {#components}

提示块、标签页、代码块、图片、表格的用法与文档页相同，语法见[组件总览](/zh/docs/components/)。文章正文的标题同样写显式英文 `{#id}`。

文章末尾的反馈 / 最后修改 / 翻页器 / 评论四块与文档页一致，见[编写页面](/zh/docs/write/pages/#page-end)。博客通常关闭反馈、保留评论。

## 作者与署名 {#authors}

声明这个 taxonomy 就是全部开关，主题不为此增加任何参数：

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
```

文章按顺序写出作者：

```yaml
authors: [vonng, ada-example]
```

文章头部就按这个顺序渲染头像与带链接的名字——front matter 里的序列既是集合也是顺序——列表行渲染名字，博客 feed 为每篇文章的每位作者发一条 `<dc:creator>`，与站点级的 `managingEditor` 并存。名字之间用 CSS 的 gap 分隔而不是连接词，因为「和」是个逐语言的决定，而这里有 32 种语言。

作者主页就是 term 页本身，所以不存在另一份 `data/authors` 和它打架：

```markdown {title="content/authors/vonng/_index.md"}
---
title: Vonng
description: OINK 与 Pigsty 的维护者。
images: [portrait.webp]
---

正文是长介绍，渲染在主页上名字下方。
```

显示名取的是 term 页的链接标题——写了 `linkTitle` 就用它，否则用 `title`——所以主页可以挂全名、署名处用短昵称。`description` 是一句话介绍，正文是长介绍，头像则是题图解析器为这一页选中的那张——`images:` 与页面包里的肖像文件，走的是文章题图那套同样的规则。双语主页就是旁边一个 `_index.zh.md`。文章写了、但没人给它建主页的名字照样出署名：链接标题、一个首字母，以及指向归档页的链接。

0.4 的 `author:` 字符串在没有 `authors` 的地方原样保留，两种写法互不告警。

## 系列 {#series}

系列是一条穿过若干篇各自独立成文的文章的阅读路径。编号、交叉引用与聚合输出属于[书籍](/zh/docs/write/book/)，这里是更轻的那个东西。声明 taxonomy 同样就是全部开关：

```yaml {title="hugo.yml"}
taxonomies:
  series: series
```

文章写出系列名，也可以给自己定个位置：

```yaml
series: [shell-internals]
series_weight: 20
```

它的正文上方就会出现一条横幅，写明系列名、自己是第几篇、下一篇是哪篇，以及折在 `<details>` 里的完整列表——不用 JavaScript，也不增加打包成员。term 页 `content/series/<name>/_index.md` 是系列的引言，旁边放一个 `_index.zh.md` 就成双语。

阅读顺序由主题自己算，因为 term 页给不出这个顺序：Hugo 的 taxonomy weight 既到不了 `Page.Weight`，也进不了 `GroupByParam`。带权重的成员按 `series_weight` 升序排在前，其余按日期升序跟在后面，同序时用 `Path` 决胜。横幅与 term 页读同一个解析结果，所以它们不可能对「第二篇是哪篇」有分歧——这也意味着系列 term 页是由旧到新排列的，和其它所有 term 页相反。这正是这个功能本身。

一篇文章属于多个系列时只显示一条横幅，取它写在最前面的那个系列。只有一篇的系列不显示横幅。

`authors` 与 `series` 都不出现在文章的通用 taxonomy 标签行里，因为它们各自有专门的呈现面。想把某一个放回去，就在 `params.taxonomy.page_header` 里写上它的名字。

## 分享 {#share}

`params.ui.share` 在页尾最前面放一条分享栏。它默认为空，所以在站点写出目标之前什么都不渲染；写出来的顺序就是渲染顺序：

```yaml {title="hugo.yml"}
params:
  ui:
    share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
```

可选的目标有十六个：`x`、`bluesky`、`mastodon`、`facebook`、`linkedin`、`reddit`、`hackernews`、`telegram`、`whatsapp`、`line`、`pinterest`、`weibo`、`chatgpt`、`claude`、`email`、`copy`。未知的名字告警并丢弃。Discord 是故意没有的：它根本没有公开的 share-intent URL，与其让主题去猜一个私有 scheme，不如用 `copy` 顶上。

页面键是 `share`，所以 `cascade` 可以把这条栏限定在一棵树里，页面自己的列表会整体替换继承来的那份，`share: false` 则让单页退出：

```yaml {title="content/blog/_index.md"}
cascade:
  share: [x, bluesky, email, copy]
```

只有普通页面渲染分享栏——列表页、term 页与首页没有「唯一被分享的那个东西」——打印、Markdown 与 RSS 一概不带。

**它不做什么**，才是它能出现在这个主题里的原因。没有分享计数、没有平台 SDK、没有 iframe、没有第三方脚本或样式表——而那三样正是这类组件通常的形态：每一页都向一家读者从未选择过的公司发一次请求。每个目标都是一个纯粹的 `<a href>` intent 链接，只带这一页自己的 permalink 与标题，不挂任何投放参数，另加一个本地复制按钮。站点构建时不取任何东西，页面加载时也不取；一次分享唯一可能引发的请求，就是读者点下去之后自己发起的那次跳转。把十六个目标全开的构建，不加 `--third-party` 也能通过 `bin/check-output-security.py`。

`chatgpt` 与 `claude` 是把同一个构建期 permalink 交给助手，附一句「请读这一页」。它们不是页面操作菜单里的「在 ChatGPT 中打开」/「在 Claude 中打开」——那两条由运行时在激活时改写成浏览器里的实时 URL，因此留在 `page_context_menu.assistant_links` 后面。

复制按钮就是内置的 `copy_link` 动作，也就是说不管有没有配分享栏，命令面板在每个站点的每一页上都带着它。

## 验证 {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

必须 `Total in …`，没有 ERROR / WARN。随后确认：

1. 文章出现在 `/zh/blog/` 的正确年份分组里，日期显示为中文格式；
2. `public/zh/blog/index.xml` 存在，里面有这篇文章，链接是完整的绝对地址；
3. 缩略图出现在列表里（缺失说明三条封面来源都没命中）；
4. 标签 chip 能点进对应的标签页。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 正文怎么写
- [页面参数](/zh/docs/write/frontmatter/) — `author`、`images` 等键的完整定义
- [组织内容](/zh/docs/write/organize/) — 目录与侧栏
- [分类体系](/zh/docs/customize/taxonomy/) — 标签与分类
- [发布与下载页](/zh/docs/write/releases/) — 版本卡片与资产表
