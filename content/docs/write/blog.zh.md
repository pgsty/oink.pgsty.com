---
title: 博客与文章
linkTitle: 博客与文章
description: 写带日期、署名、系列与封面图的博客文章，并决定博客索引、RSS Feed 与分享栏如何呈现它们。
weight: 40
search_keywords: [博客, 文章, blog, post, RSS, Feed, 封面图, featured image, 作者, 日期, 分页, 布局, 画廊, gallery]
---

博客栏目给按日期发布的文字配上读者熟悉的那套外壳：按时间倒序、每行带缩略图的文章索引，RSS Feed，作者署名，标签，以及分享链接。文章正文就是普通 Markdown，写法与文档页完全相同；不同的只是 front matter 和文章所在的栏目。

## 写一篇文章 {#front-matter}

在博客栏目里，每篇文章一个 Markdown 文件，放在哪个子目录都可以。文件路径决定 URL；文章出现在列表的哪个位置，由 `date` 决定，而不是由目录决定：

```yaml {title="content/blog/release/2.4.0.zh.md"}
---
title: 2.4 版发布：并行恢复与更快的 VACUUM
linkTitle: v2.4.0             # 侧栏与翻页器里的短名
date: 2026-08-14              # 发布日期，决定列表顺序
lastmod: 2026-08-14
description: >-
  2.4 版支持并行恢复大型集群，把追加型表的 VACUUM 时间减半，
  并为每条升级命令加上了演练模式。
author: 项目维护者
categories: [发布]
tags: [发布, 备份]
---
```

和文档页相比，文章里有四个键更要紧：

- `date` 必填，它决定文章在索引里的位置和 RSS 时间戳。日期在未来的文章到当天才会进入构建，用 `hugo server -F` 可以提前预览。
- `description` 会作为导语显示在正文上方，也出现在搜索结果里，所以要写成给读者看的一句话，而不是关键词堆砌。
- `author` 支持行内 Markdown，可以写成 `[Alice Chen](https://example.com/alice)`。需要多位作者、头像或作者主页时，改用 [`authors`](#authors)；写了 `authors` 的文章会忽略 `author`。
- 日期按 `params.time_format_blog` 的格式显示，默认是 ISO 格式 `2006-01-02`。想要本地化的写法，就按语言分别设置：

  ```yaml {title="hugo.yml"}
  languages:
    en:
      params:
        time_format_blog: January 2, 2006
    zh:
      params:
        time_format_blog: 2006年1月2日
  ```

正文可以使用文档页能用的全部[组件](/zh/docs/components/)，标题同样要写显式的英文 `{#id}`。`tags` 与 `categories` 会显示为标题下方的 chip、右栏的词云和顶部导航栏里的筛选菜单；如何启用、如何翻译标签名，见[分类体系](/zh/docs/customize/taxonomy/)。页尾的反馈、最后修改、翻页器与评论和[编写页面](/zh/docs/write/pages/#page-end)中描述的一致；博客通常关闭反馈、保留评论。

双语文章是一对文件：`2.4.0.md` 与 `2.4.0.zh.md`，两者的 `date`、`author`、`weight`、`aliases` 保持一致。标题、描述和标签要翻译，提交 ID、版本号、命令和 URL 不翻译。

## 封面图 {#featured-image}

封面图既是文章在索引里那一行的缩略图，也是社交分享卡片上的图片。OINK 按下面的顺序取第一个找到的：

1. 文章 front matter 中 `images` 的第一项；
2. 文章页面包里文件名含 `featured` 或 `feature` 的图片，其次是含 `cover` 或 `thumbnail` 的图片；它会被裁切成合适的尺寸，图片资源自己的 `byline` 作为图注；
3. 从祖先栏目 `cascade` 继承来的 `images`，离得最近的优先。

第三种来源可以给整个栏目设一张默认图，没有自配图片的文章也能有缩略图：

```yaml {title="content/blog/release/_index.zh.md"}
cascade:
  images: [/images/release.webp]
```

要让某篇文章不继承这张图，在它的 front matter 里写 `images: []`；要让整个子栏目不继承，就写进子栏目的 `cascade`。这两种写法都不会屏蔽页面包自己提供的图片。站点级的 `params.images` 只用于分享卡片，不会成为索引缩略图。

### 显示在文章里 {#featured-image-article}

默认情况下，封面图只出现在索引行与分享卡片上。设置 `params.ui.featured_image`，就能把它也显示在文章里：

| 模式 | 文章里显示什么 |
| --- | --- |
| `none` | 文章不显示题图，默认值 |
| `banner` | 标题上方一张固定 16:9 的图，连着读几篇文章时节奏一致 |
| `wash` | 图片淡化后铺在文章头部背后，正文开始前渐隐 |
| `hero` | 占满页面宽度的图片头部 |

```yaml {title="hugo.yml"}
params:
  ui:
    featured_image: banner
```

页面键是 `featured_image`，因此可以用子栏目的 `cascade` 只为那棵树打开它，单篇文章也可以退出。没有图片的文章在任何模式下都不显示题图，所以只有部分文章配了图的栏目也可以放心整体开启。这些模式不加载脚本。页面包或全局资产中的位图会重新编码为 WebP，并先于页面上的其它图片请求；动图保留原有的帧。

```yaml {title="content/blog/release/_index.zh.md"}
cascade:
  featured_image: wash
```

## 作者与署名 {#authors}

博客有多位作者，或者读者需要看到某个人写过的全部文章时，用 `authors` 分类法。声明这个分类法就是全部开关，主题不为此增加任何参数：

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
```

文章按署名顺序写出作者：

```yaml
authors: [alice-chen, raj-patel]
```

文章头部按这个顺序显示头像与带链接的名字，索引行显示名字；博客 Feed 除了站点级的 `managingEditor`，还会列出每位作者。

作者主页就是分类法的 term 页，不需要另建 `data/authors` 文件：

```markdown {title="content/authors/alice-chen/_index.zh.md"}
---
title: Alice Chen
linkTitle: Alice
description: 负责备份与恢复工具的维护。
images: [portrait.webp]
---

正文是长介绍，显示在主页名字下方。
```

署名用的是 term 页的 `linkTitle`，没有时用 `title`，所以主页可以写全名，署名处只显示简短的名字。`description` 是一句话介绍，正文是长介绍。头像按文章[封面图](#featured-image)的同一套规则选取，`images:` 和页面包里的 `portrait.webp` 都可以。中文主页就是旁边的一个 `_index.zh.md`。文章里写了、却没有主页的作者照样有署名：名字、一个代替头像的首字母，以及指向其文章归档的链接。

## 系列 {#series}

系列是一条串起若干篇独立文章的阅读路径，例如分五篇讲透备份机制的连载。它比[书籍](/zh/docs/write/book/)轻：书籍还有章节编号、交叉引用和合并的打印视图。声明分类法即可启用：

```yaml {title="hugo.yml"}
taxonomies:
  series: series
```

文章写出所属系列，也可以给自己定个位置：

```yaml
series: [backup-internals]
series_weight: 20
```

文章正文上方随即出现一条横幅，写明系列名、本篇是第几篇、下一篇的链接，以及折叠在 `<details>` 里的完整列表，不需要 JavaScript。term 页 `content/series/<name>/_index.md` 是系列的引言，旁边放一个 `_index.zh.md` 就是双语。

写了 `series_weight` 的文章按该值升序排在前面，其余按日期从旧到新排在后面，同序时按内容路径排序。横幅与 term 页使用同一个顺序。一篇文章属于多个系列时只显示一条横幅，取它写在最前面的那个系列；只有一篇文章的系列不显示横幅。

`authors` 与 `series` 都不出现在文章的分类 chip 行里，因为它们在页面上各有自己的位置。想让其中某个也显示在那一行，就把它写进 `params.taxonomy.page_header`。

## 发布注记 {#release-notes}

版本公告就是普通文章，惯例放在 `blog/release/` 下，`linkTitle` 里写版本号（`v2.4.0`）。想加一张链接到 GitHub Release 与源码归档的卡片、一张带校验和的资产表，或者一个按时间排列的发布索引，见[发布与下载页](/zh/docs/write/releases/)。

## 建立博客栏目 {#layout}

Starter 已经带了博客。要自己建一个，在 `content/` 下新建一个栏目并设置 `type: blog` 即可。可以按受众或用途分子栏目，但不必按年份分：索引会自己按 `date` 排序。

```filetree {title="content/blog/"}
- content/
  - blog/
    - _index.md                      # type: blog + cascade
    - _index.zh.md
    - engineering/                   # 设计笔记与性能测试
      - _index.md                    # cascade: images: [/images/engineering.webp]
      - parallel-restore.md
      - parallel-restore.zh.md
    - release/                       # 每个版本一篇
      - _index.md                    # cascade: images: [/images/release.webp]
      - 2.4.0.md
      - 2.4.0.zh.md
```

栏目根为整棵子树设定类型，以及所有文章共用的行为：

```yaml {title="content/blog/_index.zh.md"}
---
title: 博客
description: 工程笔记与版本公告
type: blog
icon: fa-solid fa-blog
sidebar_root_for: self      # 博客有自己的侧栏树
cascade:
  type: blog
  feedback: false           # 文章不问「这页有帮助吗」
  comments: true            # 但开放评论
---
```

`params.ui.blog_section`（默认 `blog`）告诉主题博客根在哪里。目录换了名字时，改这个参数，或者像上面那样保留 `sidebar_root_for: self`。

在侧栏里，博客栏目默认展开，文章按时间倒序排列。写了 `weight` 的文章会固定在侧栏里这些按日期排列的文章之上；文章索引不看 `weight`，始终按日期排序。

## 列表布局与分页 {#list}

在栏目 `_index.md` 自己的正文之后，OINK 会接上文章索引：列出本栏目及其子栏目的全部文章，按时间倒序，不按年份分组。用 `blog_index` 选择它的样子：

| 值 | 布局 | 读者看到什么 |
| --- | --- | --- |
| `list` | 水平条目（默认） | 缩略图、标题、日期、所属子栏目、标签与摘要 |
| `cards` | 卡片网格 | 上方是 16:9 裁切封面，下方是标题、元数据与摘要 |
| `table` | 紧凑表格 | 每篇文章一行：日期、标题与标签 |
| `gallery` | 图片画廊 | 按原比例排布封面，附标题与描述；点击进入文章 |

在 `hugo.yml` 里用 `params.ui.blog_index` 设置全站默认，或在某个博客栏目的 `_index.md` 里写 `blog_index` 单独覆盖；栏目的 `cascade` 会把它传给下级栏目。这些设置只作用于博客栏目的索引：标签页与分类页保留自己的布局，自定义首页要展示文章，需要在自己的模板里实现。

`list`、`cards` 与 `gallery` 每页 12 篇。用 `blog_index_size` 调整：写在 `hugo.yml` 里作用于全站，写在栏目 front matter 里只作用于那个博客：

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index_size: 20
```

Hugo 的 `pagination.pagerSize` 对这些列表不起作用，因为主题会把 `blog_index_size` 直接交给分页器。

### 卡片形态 {#list-cards}

`cards` 把行列表换成内容卡片网格：每张卡片上方是封面图的 16:9 裁切，下面是标题、日期与子栏目一行，以及三行摘要：

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index: cards
    blog_index_columns: 3
```

`blog_index_columns` 只在 xl 断点以上生效；md 到 xl 之间是两列，md 以下一列。图片可以处理时，Hugo 用 `.Fill` 裁切出预览图，读者下载的是小图而不是原图。

### 表格与布局切换 {#list-switching}

`table` 是归档视图：它总是在一页里列出栏目的全部文章，不分页。想让读者自己选，就设置 `blog_index_toggle: true`。标题旁会出现切换按钮（开启键盘导航时也可以按 {{< kbd "V" >}}），按 `list` → `cards` → `table` → `gallery` → `list` 循环：

```yaml {title="content/blog/_index.zh.md"}
blog_index: cards
blog_index_toggle: true
```

切换器会记住读者的选择。开启切换后，`list`、`cards` 与 `gallery` 共用同一套 `blog_index_size` 分页与页码，`table` 仍然一次列出全部文章。每种布局都保持日期顺序与 `manual_link` 目标。未显示的布局会延迟加载图片，但它们的标记与缩略图仍会增加构建时间。设为 `blog_index_toggle: false` 时只输出配置的那一种布局，读者之前保存的选择不再生效。

### 画廊形态 {#list-gallery}

文章以图片为主的博客适合用 `gallery`。每篇文章变成一张可点击的封面，取自它的封面图；默认的展墙把封面按原比例拼成行。标题和描述在悬停或键盘聚焦时显示，触屏设备上则放在图片下方。没有封面的文章保留一个标题块。

```yaml {title="content/blog/_index.zh.md"}
blog_index: gallery
blog_index_toggle: true
blog_gallery:
  mode: wall
  size: 240
```

画廊工具栏提供三种排布：

| `blog_gallery.mode` | 排布 | 文字显示 |
| --- | --- | --- |
| `wall`（默认） | 等高拼接，保留 6px 间隙 | 悬停或键盘聚焦时显示；触屏上放在图片下方 |
| `seamless` | 相同的行布局，去掉间隙 | 悬停或键盘聚焦时显示；触屏上放在图片下方 |
| `cards` | 瀑布流 | 始终显示在图片下方 |

`blog_index: cards` 是常规的卡片网格；画廊里的瀑布流则是 `blog_index: gallery` 加 `blog_gallery.mode: cards`。`blog_gallery.size` 是目标格子尺寸，范围 160–360 CSS 像素，默认 240，与控制每页文章数的 `blog_index_size` 毫无关系。

读者可以调整排布与尺寸，这个选择与 Expo 相册分开记忆。开启键盘导航且画廊在视图中时，按 {{< kbd "M" >}} 在 `wall` → `cards` → `seamless` 之间循环，按 {{< kbd "," >}} / {{< kbd "<" >}} 或 {{< kbd "." >}} / {{< kbd ">" >}} 以 `20 px` 为步长缩小或放大格子。

全站默认值写在 `params.ui` 下的 `blog_gallery` 块里。页面或 `cascade` 里的块会整体替换它，没写的字段回退为 `wall` 与 `240`。完整参数表见[站点参数](/zh/docs/customize/config/#blog)与[页面参数](/zh/docs/write/frontmatter/#blog)。

## RSS {#rss}

哪些页面输出 Feed 由 `outputs` 决定。给 `section` 加上 `RSS`，每个栏目就有自己的 Feed：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

一旦写了 `outputs`，Hugo 的默认值就被整体替换，所以 `RSS` 必须显式写上。漏写的页面类型没有 Feed，构建也不会提醒你。

以上面的目录为例，`/zh/blog/index.xml` 包含全部文章（子栏目里的也算在内），`/zh/blog/release/index.xml` 只有版本公告。单篇文章没有自己的 Feed。每种语言各有一份 Feed，地址是该语言的路径加 `index.xml`；条目数上限由 Hugo 的 `services.rss.limit` 控制。在博客根和它的一级子栏目上，标题行的第一个按钮就是 RSS 链接，读者不必去猜地址。

全站都不要 Feed 时，直接关闭这一类输出，这比逐个页面类型删掉 `RSS` 更彻底：

```yaml {title="hugo.yml"}
disableKinds: [RSS]
```

组件在 Feed 里使用静态形态：折叠块展开，交互控件去掉。

## 分享 {#share}

`params.ui.share` 在页尾最前面加一行分享链接。它默认为空，所以在你列出想要的目标之前什么都不显示；列出的顺序就是显示顺序：

```yaml {title="hugo.yml"}
params:
  ui:
    share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
```

可选的目标共十六个：`x`、`bluesky`、`mastodon`、`facebook`、`linkedin`、`reddit`、`hackernews`、`telegram`、`whatsapp`、`line`、`pinterest`、`weibo`、`chatgpt`、`claude`、`email`、`copy`。未知的名字会告警并被丢弃。没有 `discord`，因为 Discord 不提供可以拼出分享地址的公开链接，用 `copy` 代替即可。

页面键同样叫 `share`，所以 `cascade` 可以把分享栏限定在一棵树里，页面自己的列表会整体替换继承来的列表，`share: false` 则让单个页面不显示分享栏：

```yaml {title="content/blog/_index.zh.md"}
cascade:
  share: [x, bluesky, email, copy]
```

只有普通页面显示分享栏：列表页、term 页和首页没有一个具体可分享的对象；打印、Markdown 与 RSS 输出也都不带它。每个目标都是携带页面永久链接与标题的普通链接，外加一个本地复制按钮。分享栏不加载任何第三方脚本或样式表，只有读者点击某个链接时，对应的服务才会知道这个页面。

`chatgpt` 与 `claude` 把同一个永久链接交给 AI 助手，并附一句请它阅读这一页的提示。它们与页面操作菜单里的「在 ChatGPT 中打开」「在 Claude 中打开」是两回事：后两项在点击时发送浏览器里的实时 URL，因此由 `page_context_menu.assistant_links` 单独控制。

复制按钮就是内置的 `copy_link` 动作；无论有没有配置分享栏，命令面板在每一页上都提供它。

## 验证 {#verify}

```bash
hugo --printPathWarnings
```

构建应以 `Total in …` 结束且没有 ERROR。然后确认：

1. 文章出现在 `/zh/blog/` 中，日期顺序正确，日期格式符合预期；
2. `public/zh/blog/index.xml` 存在，包含这篇文章，链接是完整的绝对地址；
3. 文章在索引里有缩略图（没有的话，说明三种封面图来源都没有命中）；
4. 每个标签 chip 都能进入对应的标签页。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 正文怎么写
- [页面参数](/zh/docs/write/frontmatter/#blog) — 全部博客相关键及其类型与默认值
- [组织内容](/zh/docs/write/organize/) — 目录与侧栏
- [分类体系](/zh/docs/customize/taxonomy/) — 标签与分类
- [发布与下载页](/zh/docs/write/releases/) — 版本卡片与资产表
