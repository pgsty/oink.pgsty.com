---
title: 帖子
linkTitle: 帖子
description: 用 `> [!SOCIAL]` 提示块引用 X、Bluesky、Mastodon 等平台上的帖子。正文和署名都写在页面里，无需平台脚本；在纯 Markdown 查看器里它就是一个普通引用块。
weight: 360
search_keywords: [帖子, 社交帖子, 引用帖子, 推文, 微博, 知乎, Telegram, 离线嵌入, 头像, 引用帖, 提示块, social, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, Zhihu, LinkedIn, callout]
image_zoom: true
---

文章要引用某人在 X、Mastodon 或其他平台上发的帖子时，`> [!SOCIAL]` 提示块把它引用成一张卡片：头像、名字、账号、平台图标、帖子正文，以及带日期的原帖链接。引用文字保存在页面中，原帖被修改或删除后仍可阅读。头像和附件也使用本地文件时，整张卡片都由自己的站点提供；卡片的颜色跟随站点的预设与深浅色。

源码本身就是一个普通的引用块。在 GitHub、编辑器预览或 Obsidian 里，不经过主题也能看到名字、帖子正文、附图和被引用的帖子。引用书籍或论文的段落，用普通的 Markdown 引用块就够了。

## 最简例子 {#minimal}

提示块的标题写作者名，账号写成名字后面的行内代码，然后是用 Markdown 写的帖子正文。

````markdown {title="源码"}
> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 并不是一个简单的关系型数据库，而是一个数据管理的抽象框架，具有囊括一切、吞噬整个数据库世界的潜力。用 Postgres 替代 Kafka、ES、Mongo 和 Redis 是一种切实可行的方式，可以极大降低系统复杂度。
````

> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 并不是一个简单的关系型数据库，而是一个数据管理的抽象框架，具有囊括一切、吞噬整个数据库世界的潜力。用 Postgres 替代 Kafka、ES、Mongo 和 Redis 是一种切实可行的方式，可以极大降低系统复杂度。

- 标题按原样渲染，其中的行内 Markdown 也照常生效。标题里的行内代码就是账号：卡片把它放在名字下方，并按从左到右的文字隔离。账号写成行内代码，还能避免 Markdown 查看器把 `@user@instance` 识别成邮件链接。
- 标题后的空 `>` 行对 Hugo 可有可无。不认识 `[!SOCIAL]` 的查看器（比如 GitHub）会把标题和正文第一行并成一段，空一行就不会。
- 没有 `avatar` 时，卡片在圆形里画出标题纯文本的第一个字符：先去掉开头的 `@`、空白以及零宽空格等不可见字符，保留完整 emoji 与组合字符；去掉后没有可见字符时回退到人物图标。卡片不会去请求默认头像或 Gravatar。

## 完整卡片 {#full}

其余信息写在紧跟提示块的块属性行里，两者之间不能空行：

````markdown {title="源码"}
> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 扩展管理工具暨 Pigsty 管控命令行 `pig` 发布了。一条命令在主流 Linux 发行版上配置 PG 仓库，并用系统原生包管理器丝滑安装 **数百个 PostgreSQL 扩展**。
>
> ![pig.pgsty.com 首页：PostgreSQL 扩展包管理器](/case/pig/featured.webp)
{avatar="images/ron-vonng.webp" date="2024-12-23" url="https://x.com/RonVonng/status/1871040275575124082" platform="x"}
````

> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 扩展管理工具暨 Pigsty 管控命令行 `pig` 发布了。一条命令在主流 Linux 发行版上配置 PG 仓库，并用系统原生包管理器丝滑安装 **数百个 PostgreSQL 扩展**。
>
> ![pig.pgsty.com 首页：PostgreSQL 扩展包管理器](/case/pig/featured.webp)
{avatar="images/ron-vonng.webp" date="2024-12-23" url="https://x.com/RonVonng/status/1871040275575124082" platform="x"}

- `avatar` 按普通图片的规则解析：远程图片由读者的浏览器直接加载；其他值依次查找页面资源（或所在栏目分支包的资源）、`assets/` 下的全局资源，都找不到时作为站点静态文件的路径使用。建议优先使用页面资源或 `assets/`，构建期一定能找到。名字就在旁边，所以头像是装饰图（`alt=""`）。卡片把它缩小并裁切填满头像框，最好用方图。
- `date` 是纯文本，按原样显示。写成年月（`2026-11`）、日期（`2026-11-23`），或带时分、可选秒数和可选 `Z`／`±HH:MM` 时区偏移的日期时间（`2026-11-23 08:30`、`2026-11-23T08:30:00+08:00`），并且是真实存在的日历日期时，会生成机器可读的 `<time datetime>`；时间前的空格在属性里写成 `T`。其他写法，包括带小数秒或 `+0800` 偏移的，都按纯文本输出，不套 `<time>`。
- `url` 让日期这一行变成“查看原帖”链接。支持原帖的 HTTP(S) 地址（附带 `rel="external"`）或站内路径，无效的 URL 会告警并被丢弃。它是可选的，原帖已经不在了也照样可以引用。
- 附图就是普通的 Markdown 图片。本页开启了[图片缩放](/zh/docs/components/image/#zoom)，点击可以看大图。
- 块属性需要 `markup.goldmark.parser.attribute.block: true`。OINK 的提示块图标和原生 Book 图本来就要求这项设置。

## 平台 {#platforms}

`platform` 只决定品牌图标，以及读屏器和 RSS 里出现的平台名，别的都不变：所有平台共用一种版式，颜色由预设决定，卡片也不模仿任何平台的界面。不写 `platform` 时卡片不显示图标，所以请写明帖子来自哪个平台。

| `platform` | 图标 |
| --- | --- |
| `x` | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `zhihu` | `fa-brands fa-zhihu` |
| `telegram` | `fa-brands fa-telegram` |
| `linkedin` | `fa-brands fa-linkedin` |
| `none`（默认） | 无（不显示图标和平台名） |

````markdown {title="源码"}
> [!SOCIAL] Ron `@ron@fosstodon.example`
>
> OpenAI 的核心业务跑在一套不分片的 PostgreSQL 集群上（一主四十多从）。垂直扩展加上严谨的索引设计，依然能走得很远。
{platform="mastodon" date="2025-05-19 11:27" url="https://fosstodon.example/@ron/1002"}

> [!SOCIAL] `@pigsty.io`
>
> PostgreSQL 是数据库世界的 Linux：一个内核，数百个扩展，没有厂商锁定。
{platform="bluesky"}
````

> [!SOCIAL] Ron `@ron@fosstodon.example`
>
> OpenAI 的核心业务跑在一套不分片的 PostgreSQL 集群上（一主四十多从）。垂直扩展加上严谨的索引设计，依然能走得很远。
{platform="mastodon" date="2025-05-19 11:27" url="https://fosstodon.example/@ron/1002"}

> [!SOCIAL] `@pigsty.io`
>
> PostgreSQL 是数据库世界的 Linux：一个内核，数百个扩展，没有厂商锁定。
{platform="bluesky"}

第二张卡片只写了账号，所以没有名字、日期和链接。读屏器能听到平台名：卡片在装饰图标旁放了一段视觉隐藏的平台名文字。未知或为空的 `platform` 会告警，并且不显示图标。账号按书写原样显示，主题不会补 `@`，也没有按平台区分的规则：X 写 `@name`，Mastodon 写 `@user@instance`。

## 正文 {#body}

正文就是提示块自己的 Markdown，随页面一起渲染，段落、链接、行内代码、列表和脚注都照常可用。帖子里的其他内容都用 OINK 已有的语法书写，所以卡片不为它们设置属性。

| 帖子内容 | 写法 |
| --- | --- |
| 文字、链接、代码 | 普通 Markdown |
| 一张附图 | Markdown 图片；符合条件时启用图片缩放 |
| 多张图片 | 正文中的 `gallery` 围栏 |
| 引用帖 | 嵌套的 `> [!SOCIAL]`，见[引用帖](#quote) |
| 视频 | 写成图片形式的[视频](/zh/docs/components/video/)：`![名称](clip.mp4)` |

````markdown {title="源码"}
> [!SOCIAL] Ron `@RonVonng`
>
> 同一套 PostgreSQL 文档主题，两种配色：
>
> ```gallery
> ![OINK 首页的浅色模式](/images/hero-light.webp)
> ![OINK 首页的深色模式](/images/hero-dark.webp)
> ```
{avatar="images/ron-vonng.webp" date="2026-11-24" platform="x"}
````

> [!SOCIAL] Ron `@RonVonng`
>
> 同一套 PostgreSQL 文档主题，两种配色：
>
> ```gallery
> ![OINK 首页的浅色模式](/images/hero-light.webp)
> ![OINK 首页的深色模式](/images/hero-dark.webp)
> ```
{avatar="images/ron-vonng.webp" date="2026-11-24" platform="x"}

## 引用帖 {#quote}

帖子引用了另一条帖子时，把被引用的帖子写成正文里嵌套的提示块。它的属性行前面带一个 `>`，因此属于内层提示块；外层的属性行不带 `>`，写在最后。内层卡片更紧凑（头像更小，名字和账号在同一行），并保留自己的日期和链接。内层卡片不写 `platform` 就不会重复显示图标；跨平台引用时再写上。

````markdown {title="源码"}
> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 17 发布：社区官宣 PG 是世界上最先进的开源数据库。用不了多久，“开源”这个定语可能都会成为多余的。
>
> > [!SOCIAL] PostgreSQL `@PostgreSQL`
> >
> > News: PostgreSQL 17 Released!
> {date="2024-09-26" url="https://x.com/PostgreSQL/status/1839292604854223176"}
{avatar="images/ron-vonng.webp" date="2024-09-27" url="https://x.com/RonVonng/status/1839521052843442618" platform="x"}
````

> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 17 发布：社区官宣 PG 是世界上最先进的开源数据库。用不了多久，“开源”这个定语可能都会成为多余的。
>
> > [!SOCIAL] PostgreSQL `@PostgreSQL`
> >
> > News: PostgreSQL 17 Released!
> {date="2024-09-26" url="https://x.com/PostgreSQL/status/1839292604854223176"}
{avatar="images/ron-vonng.webp" date="2024-09-27" url="https://x.com/RonVonng/status/1839521052843442618" platform="x"}

## 缺失与无效输入 {#degraded}

无效输入会告警。只要有正文，被引用的文字就不会丢。

| 输入 | 结果 |
| --- | --- |
| 没有标题，有正文 | 告警；正文渲染为普通引用块，不出卡片。`url` 只保留为引用块的 `cite` 属性；`date`、`platform` 和 `avatar` 被忽略 |
| 没有标题，空正文但有 `url` | 告警；渲染为包含原帖链接的普通引用块 |
| 正文为空，有 `url` | 告警；只渲染作者行和“查看原帖”的链接卡片 |
| 正文为空，没有 `url` | 告警；什么也不渲染 |
| 未知或为空的 `platform` | 告警；不显示图标 |
| `[!SOCIAL]-` 或 `[!SOCIAL]+` | 告警；忽略折叠标记 |
| 无效的 `url` 或 `avatar` | 告警；丢弃该属性 |
| 项目 `static/` 目录里找不到的静态 `avatar` | 存在 `static/` 目录时离线告警（ID 为 `social:avatar-static`）；保留路径 |
| 用 `..` 越出站点根目录的静态 `avatar` | 告警（ID 同为 `social:avatar-static`）；丢弃头像，卡片改画首字符 |
| 未知属性 | 告警；忽略。`class`、`data-*` 与 `aria-*` 传给卡片 |

## Hugo 的 `x` 短代码 {#hugo-x}

Hugo 自带一个 `x` 短代码 `{{</* x user="…" id="…" */>}}`，OINK 不改动它。它在构建期向 X 的 oEmbed 服务请求帖子，所以干净构建需要联网，原帖一删，引用也跟着消失。需要离线构建、长期可读的引用时，请用 `[!SOCIAL]` 提示块。

## 输出形态 {#outputs}

卡片不加载 JavaScript。打印时无论屏幕配色如何都切换为纸张调色板，并在“查看原帖”后面印出原帖 URL。Markdown 与 LLMS 输出按原样保留提示块及其属性行，Agent 读到的就是作者写下的那个引用块。RSS 输出正文（仅含链接的卡片不输出空 `<blockquote>`）和带绝对 URL 的署名行，不带头像。

## 参考 {#reference}

| 部分 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| 标题 | 行内 Markdown | — | 身份行，必填。其中的行内代码就是账号 |
| `avatar` | 图片来源 | — | 远程 URL / 页面或分支包资源 / 全局资源 / 静态路径；装饰图。没有时画出第一个字符或人物图标 |
| `date` | 纯文本 | — | 按原样显示；真实日期上的年月、日期或日期时间（`HH:MM`，可选秒数，可选 `Z` 或 `±HH:MM`）生成 `<time datetime>` |
| `url` | URL | — | 原帖地址（HTTP(S) 或站内路径）；日期行链接到它 |
| `platform` | 枚举 | `none` | `x` `bluesky` `mastodon` `threads` `weibo` `zhihu` `telegram` `linkedin` `none`；决定图标和播报的平台名 |
| 正文 | Markdown | — | 帖子内容；可以包含图片、`gallery` 围栏、视频、脚注或嵌套的 `[!SOCIAL]` |
{.fields meta="type default"}

没有互动数、认证徽章、图片列表或引用帖的属性，图片和引用帖都写在正文里。

## 限制与常见问题 {#limits}

- 可以引用什么、在仓库里保留哪些头像和媒体，由你自己决定。原帖链接失效时删掉 `url` 即可，引用本身仍然保留。
- 没有点赞、转发、浏览量和认证徽章，因为这些数字只是快照，很快就会过时。
- 各平台只有图标不同，没有按平台区分的皮肤或品牌色。
- 不支持串帖、回复与投票。要引用多条帖子，就写多张卡片，中间空一行。
- 纯 Markdown 查看器会把 `[!SOCIAL]` 标记和属性行当作文字显示；头像写在属性里，所以那里看不到头像。
- 静态头像检查只读项目自己的 `static/` 目录，而且只在该目录存在时进行。由模块挂载或自定义 `staticDir` 发布的文件同样会告警，可在站点配置的 `ignoreLogs` 中加入 `social:avatar-static` 关闭这条告警。构建时跳过远程头像检查；建议优先使用页面包或 `assets/` 图片，并在发布前查看渲染结果。

## 相关 {#related}

- [提示块](/zh/docs/components/callout/) — 这张卡片共用的引用块写法
- [图片](/zh/docs/components/image/) — 附图、图片来源与缩放开关
- [画廊](/zh/docs/components/gallery/) — 一条帖子里的多张图
- [视频](/zh/docs/components/video/) — 帖子里附带的视频
- [卡片](/zh/docs/components/cards/) — 链接卡片，而不是引用
