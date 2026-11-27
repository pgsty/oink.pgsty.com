---
title: 社交帖子
linkTitle: 社交帖子
description: 用 `social` 短代码引用 X、Bluesky、Mastodon 等平台上的帖子。正文和署名都写在页面里，无需平台脚本。
weight: 176
search_keywords: [社交帖子, 引用帖子, 推文, 微博, 知乎, Telegram, 离线嵌入, 头像, 引用帖, social, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, Zhihu, LinkedIn]
image_zoom: true
---

文章要引用某人在 X、Mastodon 或其他平台上发的帖子时，`social` 短代码把它引用成一张卡片：头像、名字、账号、平台图标、帖子正文，以及带日期的原帖链接。引用文字保存在页面中，原帖被修改或删除后仍可阅读。头像和附件也使用本地文件时，整张卡片都由自己的站点提供。卡片的颜色跟随站点的预设与深浅色。引用书籍或论文的段落，用普通的 Markdown 引用块就够了。

## 最简例子 {#minimal}

一张卡片需要 `author` 或 `handle` 之一，再加一段用 Markdown 写的帖子正文。

````markdown {title="源码"}
{{</* social author="林舒" handle="@linshu_dba" */>}}
周末把报表集群升级到了 PostgreSQL 18，`pg_upgrade --link`，四分钟搞定。
{{</* /social */>}}
````

{{< social-preview unavailable="本页保留了示例源码。构建文档站的主题包含 OINK 1.6.0 之后新增的 social 短代码时，示例也会显示为卡片。" >}}
{{</* social author="林舒" handle="@linshu_dba" */>}}
周末把报表集群升级到了 PostgreSQL 18，`pg_upgrade --link`，四分钟搞定。
{{</* /social */>}}
{{< /social-preview >}}

没有 `avatar` 时，卡片在圆形里画出 `author`（或 `handle`）的第一个字符（先去掉开头的 `@`、空白以及零宽空格等不可见字符，保留完整 emoji 与组合字符；去掉后没有可见字符时回退到人物图标），不会去请求默认头像或 Gravatar。顶层卡片省略 `platform` 时显示 X 图标。参数只接受命名形式，位置参数会告警并被忽略。

## 完整卡片 {#full}

六个参数全部写上，帖子里再附一张图：

````markdown {title="源码"}
{{</* social author="冈田纯" handle="@jun_draws" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/jun_draws/status/1001" */>}}
文档站的字标画好了：一支钢笔笔尖，一行衬线字，**不用渐变**。

![Oink 字标，旁边是圆形的钢笔徽标](/images/oink.webp)
{{</* /social */>}}
````

{{< social-preview >}}
{{</* social author="冈田纯" handle="@jun_draws" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/jun_draws/status/1001" */>}}
文档站的字标画好了：一支钢笔笔尖，一行衬线字，**不用渐变**。

![Oink 字标，旁边是圆形的钢笔徽标](/images/oink.webp)
{{</* /social */>}}
{{< /social-preview >}}

- `avatar` 按普通图片的规则解析：远程图片由读者的浏览器直接加载；其他值依次查找页面资源（或所在栏目分支包的资源）、`assets/` 下的全局资源，都找不到时作为站点静态文件的路径使用。建议优先使用页面资源或 `assets/`，构建期一定能找到。名字就在旁边，所以头像是装饰图（`alt=""`）。卡片把它缩小并裁切填满头像框，最好用方图。
- `date` 是纯文本，按原样显示。写成年月（`2026-11`）、日期（`2026-11-23`），或带时分、可选秒数和可选 `Z`／`±HH:MM` 时区偏移的日期时间（`2026-11-23 08:30`、`2026-11-23T08:30:00+08:00`），并且是真实存在的日历日期时，会生成机器可读的 `<time datetime>`；时间前的空格在属性里写成 `T`。其他写法，包括带小数秒或 `+0800` 偏移的，都按纯文本输出，不套 `<time>`。
- `url` 让日期这一行变成“查看原帖”链接。支持原帖的 HTTP(S) 地址（附带 `rel="external"`）或站内路径，无效的 URL 会告警并被丢弃。它是可选的，原帖已经不在了也照样可以引用。
- 附图就是普通的 Markdown 图片。本页开启了[图片缩放](/zh/docs/components/image/#zoom)，点击可以看大图。

## 平台 {#platforms}

`platform` 只决定品牌图标，以及读屏器、Markdown 和 RSS 里出现的平台名，别的都不变：所有平台共用一种版式，颜色由预设决定，卡片也不模仿任何平台的界面。引用的平台不在列表内时，可设为 `none`。

| `platform` | 图标 |
| --- | --- |
| `x`（顶层卡片默认） | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `zhihu` | `fa-brands fa-zhihu` |
| `telegram` | `fa-brands fa-telegram` |
| `linkedin` | `fa-brands fa-linkedin` |
| `none`（嵌套默认） | 无（省略图标与平台名） |

````markdown {title="源码"}
{{</* social author="林舒" handle="@linshu@fosstodon.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@linshu/1002" */>}}
升级笔记也同步到这里：`pg_upgrade --link`，停机四分钟，一切顺利。
{{</* /social */>}}

{{</* social handle="@pgnotes.example" platform="bluesky" */>}}
VACUUM 不是可选项，盯着它也不是。
{{</* /social */>}}
````

{{< social-preview >}}
{{</* social author="林舒" handle="@linshu@fosstodon.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@linshu/1002" */>}}
升级笔记也同步到这里：`pg_upgrade --link`，停机四分钟，一切顺利。
{{</* /social */>}}

{{</* social handle="@pgnotes.example" platform="bluesky" */>}}
VACUUM 不是可选项，盯着它也不是。
{{</* /social */>}}
{{< /social-preview >}}

第二张卡片只用账号引用，所以没有名字、日期和链接。图标是装饰性的，读屏器读到的是平台名称，卡片把它作为视觉隐藏文字放在图标旁边（`platform="none"` 时省略）。未知或空的 `platform` 会告警并回退到 `x`（嵌套卡片回退到 `none`）。`handle` 完全按原样显示，主题既不补 `@`，也没有各平台的账号规则：X 写 `@name`，Mastodon 写 `@user@instance`。

## 正文 {#body}

正文是普通 Markdown，作为独立的块渲染，段落、链接、行内代码、列表都照常可用。帖子里的其他内容都用 OINK 已有的语法来写，所以卡片不需要为它们增加参数。

| 帖子内容 | 写法 |
| --- | --- |
| 文字、链接、代码 | 普通 Markdown |
| 一张附图 | Markdown 图片；符合条件时参与图片缩放 |
| 多张图片 | 正文里放一个 `gallery` 围栏 |
| 引用帖 | 嵌套一个 `social`，见[引用帖](#quote) |
| 视频 | 用图片语法写的[视频](/zh/docs/components/video/)：`![名称](clip.mp4)` |

````markdown {title="源码"}
{{</* social author="林舒" handle="@linshu_dba" avatar="/favicon.svg" date="2026-11-24" */>}}
同一个首页，两种配色：

```gallery
![浅色模式下的 OINK 首页](/images/hero-light.webp)
![深色模式下的 OINK 首页](/images/hero-dark.webp)
```
{{</* /social */>}}
````

{{< social-preview >}}
{{</* social author="林舒" handle="@linshu_dba" avatar="/favicon.svg" date="2026-11-24" */>}}
同一个首页，两种配色：

```gallery
![浅色模式下的 OINK 首页](/images/hero-light.webp)
![深色模式下的 OINK 首页](/images/hero-dark.webp)
```
{{</* /social */>}}
{{< /social-preview >}}

正文里的脚注引用会告警，这一点与所有短代码正文相同，脚注请写在页面自己的 Markdown 里。

## 引用帖 {#quote}

帖子本身引用了另一条帖子时，把被引用的那条写成正文里的第二个 `social`。内层卡片更紧凑：头像更小，名字和账号排在同一行，省略 `platform` 时默认为 `none`（不重复图标与隐藏平台名），但保留自己的日期和链接。跨平台引用时，在内层显式写明 `platform` 即可显示紧凑平台图标并供读屏器播报。嵌套超过一层引用帖会发出告警。

````markdown {title="源码"}
{{</* social author="林舒" handle="@linshu_dba" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/linshu_dba/status/1003" */>}}
所以我们的日历上一直留着恢复演练。

{{</* social author="周远" handle="@zhouyuan_ops"
           date="2026-11-24" url="https://example.com/zhouyuan_ops/status/2001" */>}}
从没恢复过的备份只是一个愿望，算不上备份。
{{</* /social */>}}
{{</* /social */>}}
````

{{< social-preview >}}
{{</* social author="林舒" handle="@linshu_dba" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/linshu_dba/status/1003" */>}}
所以我们的日历上一直留着恢复演练。

{{</* social author="周远" handle="@zhouyuan_ops"
           date="2026-11-24" url="https://example.com/zhouyuan_ops/status/2001" */>}}
从没恢复过的备份只是一个愿望，算不上备份。
{{</* /social */>}}
{{</* /social */>}}
{{< /social-preview >}}

## 缺失与无效输入 {#degraded}

无效输入会告警。只要有正文，被引用的文字就不会丢。

| 输入 | 结果 |
| --- | --- |
| `author` 和 `handle` 都没有，有正文 | 告警；正文渲染为普通引用块，不出卡片。`url` 只保留为引用块的 `cite` 属性，Markdown 输出里不出现；`date`、`platform` 和 `avatar` 被忽略 |
| `author` 和 `handle` 都没有，空正文但有 `url` | 告警；渲染为包含原帖链接的普通引用块 |
| 正文为空，有 `url` | 告警；只渲染作者行和“查看原帖”的链接卡片 |
| 正文为空，没有 `url` | 告警；什么也不渲染 |
| 未知、为空或非字符串的 `platform` | 告警；回退到 `x`（嵌套时为 `none`） |
| 非字符串的 `author`、`handle` 或 `date` | 告警；忽略 |
| 无效的 `url` 或 `avatar` | 告警；丢弃该属性 |
| 项目 `static/` 目录里找不到的静态 `avatar` | 存在 `static/` 目录时离线告警（ID 为 `social:avatar-static`）；保留路径 |
| 用 `..` 越出站点根目录的静态 `avatar` | 告警；保留路径 |
| 嵌套超过一层引用帖 | 告警；正常渲染且不丢失正文 |
| 未知参数或位置参数 | 告警；忽略 |

## Hugo 的 `x` 短代码 {#hugo-x}

Hugo 自带一个 `x` 短代码 `{{</* x user="…" id="…" */>}}`，OINK 不改动它。它在构建期向 X 的 oEmbed 服务请求帖子，所以干净构建需要联网，原帖一删，引用也跟着消失。需要离线构建、长期可读的引用时，请用 `social`；两个短代码名字不同，互不影响。

## 输出形态 {#outputs}

卡片不加载 JavaScript。打印时无论屏幕配色如何都切换为纸张调色板，并在“查看原帖”后面印出原帖 URL。在 Markdown 与 LLMS 输出中，卡片变成一个引用块：先是正文各行，再是 ``— 作者 (`@handle`) · 平台 · 日期 · [查看原帖](url)``（`platform="none"` 时省略平台段），引用帖则是嵌套的引用块。RSS 输出正文（仅含链接的卡片不输出空 `<blockquote>`）和带绝对 URL 的署名行，不带头像。

## 参数参考 {#reference}

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `author` | 纯文本 | — | 显示名。`author` 与 `handle` 至少写一个 |
| `handle` | 纯文本 | — | 按原样显示：`@name`、`@user@instance` |
| `avatar` | 图片来源 | — | 远程 URL / 页面或分支包资源 / 全局资源 / 静态路径；装饰图。没有时画出第一个字符或人物图标 |
| `date` | 纯文本 | — | 按原样显示；真实日期上的年月、日期或日期时间（`HH:MM`，可选秒数，可选 `Z` 或 `±HH:MM`）生成 `<time datetime>` |
| `url` | URL | — | 原帖地址（HTTP(S) 或站内路径）；日期行链接到它 |
| `platform` | 枚举 | `x`（嵌套为 `none`） | `x` `bluesky` `mastodon` `threads` `weibo` `zhihu` `telegram` `linkedin` `none`；决定图标和播报的平台名 |
| 正文 | Markdown | — | 帖子内容；可以包含图片、`gallery` 围栏、视频或嵌套的 `social` |
{.fields meta="type default"}

没有互动数、认证徽章、图片列表或引用帖的参数，图片和引用帖都写在正文里。

## 限制与常见问题 {#limits}

- 可以引用什么、在仓库里保留哪些头像和媒体，由你自己决定。原帖链接失效时删掉 `url` 即可，引用本身仍然保留。
- 没有点赞、转发、浏览量和认证徽章，因为这些数字只是快照，很快就会过时。
- 各平台只有图标不同，没有按平台区分的皮肤或品牌色。
- 不支持串帖、回复与投票。要引用多条帖子，就写多张卡片。
- 参数都是纯文本，`author`、`handle`、`date` 里的 Markdown 按字面显示。
- 静态头像检查只读项目自己的 `static/` 目录，而且只在该目录存在时进行。由模块挂载或自定义 `staticDir` 发布的文件同样会告警，可在站点配置的 `ignoreLogs` 中加入 `social:avatar-static` 关闭这条告警。构建时跳过远程头像检查；建议优先使用页面包或 `assets/` 图片，并在发布前查看渲染结果。

## 相关 {#related}

- [图片](/zh/docs/components/image/) — 附图、图片来源与缩放开关
- [画廊](/zh/docs/components/gallery/) — 一条帖子里的多张图
- [视频](/zh/docs/components/video/) — 帖子里附带的视频
- [卡片](/zh/docs/components/cards/) — 链接卡片，而不是引用
- [提示块](/zh/docs/components/callout/) — 不属于引用的说明与警告
