---
title: 社交帖子
linkTitle: 社交帖子
description: 用 `social` 短代码引用 X、Bluesky、Mastodon 等平台上的帖子。卡片内容写在页面里，不抓取任何数据，也不加载脚本。
weight: 176
search_keywords: [社交帖子, 引用帖子, 推文, 微博, 离线嵌入, 头像, 引用帖, social, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, LinkedIn]
image_zoom: true
---

`social` 短代码把社交平台上的一条帖子引用成一张卡片：头像、名字、账号、平台图标、帖子正文，以及带日期的原帖链接。
所有内容都来自页面本身，构建期和读者浏览器里都不抓取任何数据，卡片也不加载 JavaScript。
原帖被修改或删除后，引用照样可读，并且跟随站点的预设与深浅色。
文章需要引用某人发过的帖子时使用它；引用书籍或论文的段落，用普通的 Markdown 引用块就够了。

## 最简例子 {#minimal}

一张卡片需要 `author` 或 `handle` 之一，再加一段正文。正文就是用 Markdown 写的帖子内容。

````markdown {title="源码"}
{{</* social author="OINK 示例" handle="@oink_example" */>}}
帖子正文就写在页面里，所以这条引用完全不需要网络。
{{</* /social */>}}
````

{{< social author="OINK 示例" handle="@oink_example" >}}
帖子正文就写在页面里，所以这条引用完全不需要网络。
{{< /social >}}

没有 `avatar` 时，卡片在圆形里画出 `author`（或 `handle`）的第一个字符，不请求默认头像或 Gravatar。
没有 `platform` 时显示 X 图标。参数只接受命名形式，位置参数会告警并被忽略。

## 完整卡片 {#full}

六个参数全部写上，帖子里再附一张图：

````markdown {title="源码"}
{{</* social author="OINK 示例" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/oink_example/status/1001" */>}}
用 `social` 引用帖子，文字就留在 **你自己的页面** 上：没有嵌入脚本，没有构建期请求，
原帖删了，引用还在。

![OINK 的文档外壳](/images/oink.webp)
{{</* /social */>}}
````

{{< social author="OINK 示例" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/oink_example/status/1001" >}}
用 `social` 引用帖子，文字就留在 **你自己的页面** 上：没有嵌入脚本，没有构建期请求，
原帖删了，引用还在。

![OINK 的文档外壳](/images/oink.webp)
{{< /social >}}

- `avatar` 走共用的图片解析：页面资源 → `assets/` 下的全局资源 → 静态路径 → 远程 URL。
  头像是装饰图（`alt=""`），因为名字就在旁边。卡片把它缩小并裁切到头像框里，所以最好用方图。
- `date` 是纯文本，按原样显示。写成 ISO 8601 日期或日期时间（如 `2026-11-23`、`2026-11-23 08:30`）时，还会生成 `<time datetime>`。
- `url` 让日期这一行成为“查看原帖”链接。它是可选的，原帖已经不存在时也能引用。
  请填写原帖的 HTTP(S) 地址，无效的 URL 会告警并被丢弃。
- 附图就是普通的 Markdown 图片。本页开启了[图片缩放](/zh/docs/components/image/#zoom)，点击可以看大图。

## 平台 {#platforms}

`platform` 只决定品牌图标，别的都不变。所有平台共用一种版式，颜色由预设决定，卡片不模仿任何平台的界面。

| `platform` | 图标 |
| --- | --- |
| `x`（默认） | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `linkedin` | `fa-brands fa-linkedin` |

````markdown {title="源码"}
{{</* social author="OINK 示例" handle="@oink@social.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@oink/1002" */>}}
同一张卡片放到 Mastodon 上，只有右上角的图标变了。
{{</* /social */>}}

{{</* social handle="@oink.example" platform="bluesky" */>}}
只用一个账号引用 Bluesky 帖子：没有名字、没有日期、也没有链接。
{{</* /social */>}}
````

{{< social author="OINK 示例" handle="@oink@social.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@oink/1002" >}}
同一张卡片放到 Mastodon 上，只有右上角的图标变了。
{{< /social >}}

{{< social handle="@oink.example" platform="bluesky" >}}
只用一个账号引用 Bluesky 帖子：没有名字、没有日期、也没有链接。
{{< /social >}}

图标是装饰性的。读屏器读到的是平台名称，卡片把它作为视觉隐藏文字放在里面。
未知的 `platform` 会告警并改用 `x`。
`handle` 完全按原样显示：主题不补 `@`，也没有各平台的账号规则。X 写 `@name`，Mastodon 写 `@user@instance`。

## 正文 {#body}

正文是普通 Markdown，作为独立的块渲染：段落、链接、行内代码、列表都可以。
帖子里的其他内容都用 OINK 已有的语法来写，卡片不需要为它们增加参数。

| 帖子内容 | 写法 |
| --- | --- |
| 文字、链接、代码 | 普通 Markdown |
| 一张附图 | Markdown 图片；符合条件时参与图片缩放 |
| 多张图片 | 正文里放一个 `gallery` 围栏 |
| 引用帖 | 嵌套一个 `social`，见[引用帖](#quote) |
| 视频 | 用图片语法写的[视频](/zh/docs/components/video/)：`![名称](clip.mp4)` |

````markdown {title="源码"}
{{</* social author="OINK 示例" handle="@oink_example" avatar="/favicon.svg" date="2026-11-24" */>}}
同一个首页，两种配色：

```gallery
![浅色模式下的 OINK 首页](/images/hero-light.webp)
![深色模式下的 OINK 首页](/images/hero-dark.webp)
```
{{</* /social */>}}
````

{{< social author="OINK 示例" handle="@oink_example" avatar="/favicon.svg" date="2026-11-24" >}}
同一个首页，两种配色：

```gallery
![浅色模式下的 OINK 首页](/images/hero-light.webp)
![深色模式下的 OINK 首页](/images/hero-dark.webp)
```
{{< /social >}}

正文里的脚注引用会告警，这一点与所有短代码正文相同。脚注请写在页面自己的 Markdown 里。

## 引用帖 {#quote}

被引用的帖子写成正文里的第二个 `social`。
内层卡片更紧凑：头像更小，名字和账号排在同一行，不显示平台图标。它保留自己的日期和链接。

````markdown {title="源码"}
{{</* social author="OINK 示例" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/oink_example/status/1003" */>}}
同意。依赖第三方嵌入的引用，会跟着原帖一起消失。

{{</* social author="示例读者" handle="@example_reader"
           date="2026-11-24" url="https://example.com/example_reader/status/2001" */>}}
帖子截图搜不到，读屏器也读不出来。
{{</* /social */>}}
{{</* /social */>}}
````

{{< social author="OINK 示例" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/oink_example/status/1003" >}}
同意。依赖第三方嵌入的引用，会跟着原帖一起消失。

{{< social author="示例读者" handle="@example_reader"
           date="2026-11-24" url="https://example.com/example_reader/status/2001" >}}
帖子截图搜不到，读屏器也读不出来。
{{< /social >}}
{{< /social >}}

在 Markdown 与 LLMS 输出中，引用帖变成嵌套的引用块。

## 缺失与无效输入 {#degraded}

无效输入会告警。只要有正文，被引用的文字就不会丢。

| 输入 | 结果 |
| --- | --- |
| `author` 和 `handle` 都没有 | 告警；正文渲染为普通引用块，不出卡片 |
| 正文为空，有 `url` | 告警；只渲染作者行和“查看原帖”的链接卡片 |
| 正文为空，没有 `url` | 告警；什么也不渲染 |
| 未知的 `platform` | 告警；改用 `x` |
| 无效的 `url` | 告警；丢弃链接 |
| 未知参数或位置参数 | 告警；忽略 |

## Hugo 的 `x` 短代码 {#hugo-x}

Hugo 自带一个 `x` 短代码 `{{</* x user="…" id="…" */>}}`，OINK 不改动它。
它在构建期向 X 的 oEmbed 服务请求帖子，所以干净构建需要联网，引用能否显示也取决于原帖是否还在。
需要离线构建、长期可读的引用时，请用 `social`。两个短代码名字不同，互不影响。

## 版权与存档 {#rights}

原帖删除后卡片依然存在，这正是离线引用的意义。
主题自己不保存任何东西：卡片只显示你写进页面的内容。
可以引用什么、在仓库里保留哪些头像和媒体，由作者自己决定。原帖链接失效时，删掉 `url` 即可。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | `<figure class="td-social">`：作者行是 `<figcaption>`，正文在 `<blockquote cite>` 里，下面是日期行；不加载 JavaScript |
| 打印 | 同样的静态卡片；“查看原帖”后面印出原帖 URL |
| Markdown | 引用块：先是正文各行，再是 `— 作者 (@handle), 日期, [查看原帖](url)`；引用帖是嵌套的引用块 |
| RSS | 带正文的 `<blockquote cite>`，后跟一行署名；没有头像 |

## 参数参考 {#reference}

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `author` | 纯文本 | — | 显示名。`author` 与 `handle` 至少写一个 |
| `handle` | 纯文本 | — | 按原样显示：`@name`、`@user@instance` |
| `avatar` | 图片来源 | — | 页面资源 / 全局资源 / 静态路径 / 远程 URL；装饰图。没有时画出第一个字符 |
| `date` | 纯文本 | — | 按原样显示；ISO 8601 日期或日期时间还会填入 `<time datetime>` |
| `url` | URL | — | 原帖地址，HTTP(S)；日期行链接到它 |
| `platform` | 枚举 | `x` | `x` `bluesky` `mastodon` `threads` `weibo` `linkedin`；只决定图标 |
| 正文 | Markdown | — | 帖子内容；可以包含图片、`gallery` 围栏、视频或嵌套的 `social` |
{.fields meta="type default"}

没有互动数、认证徽章、图片列表或引用帖的参数。图片和引用帖都写在正文里。

## 限制与常见问题 {#limits}

- 不抓取任何数据：正文要自己复制，头像和媒体要自己保存。
- 没有点赞、转发、浏览量和认证徽章。这些数字只是快照，很快就会过时。
- 没有按平台区分的皮肤或品牌色，各平台只有图标不同。
- 没有串帖、回复与投票。引用多条帖子就写多张卡片。
- 参数都是纯文本，`author`、`handle`、`date` 里的 Markdown 按字面显示。
- 主题不检查静态路径或远程头像是否存在，发布前请看一眼渲染结果。

## 相关 {#related}

- [图片](/zh/docs/components/image/) — 附图、图片来源与缩放开关
- [画廊](/zh/docs/components/gallery/) — 一条帖子里的多张图
- [视频](/zh/docs/components/video/) — 帖子里附带的视频
- [卡片](/zh/docs/components/cards/) — 链接卡片，而不是引用
- [提示块](/zh/docs/components/callout/) — 不属于引用的说明与警告
