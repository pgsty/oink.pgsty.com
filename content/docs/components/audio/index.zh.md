---
title: 音频
linkTitle: 音频
description: 用 Markdown 图片语法写音频：渲染为带标题的原生播放器，适用于播客单集、语音样例与录音；文字稿写在折叠提示块里，不加载 JavaScript。
weight: 174
search_keywords: [音频, Audio, mp3, m4a, ogg, wav, flac, 播客, podcast, 语音样例, 文字稿, transcript, 播放器]
---

音频的写法与图片相同：`![标题](episode.mp3)`，下一行可以跟一行属性。它渲染为一个带边框的 figure：方括号文字作为可见标题，下方是浏览器原生的 `<audio>` 播放器。适用于播客单集、语音样例、读音示范与讲座录音。主题没有音频短代码，不需要配置，也不加载任何音频 JavaScript。

## 最简例子 {#minimal}

````markdown {title="源码"}
![欢迎使用 OINK](welcome-zh.mp3)
````

![欢迎使用 OINK](welcome-zh.mp3)

录音没有画面，所以方括号文字既是可见标题，也是播放器的无障碍名称。它为空时告警，并用文件名作为标题；方括号里的 Markdown 格式会被还原为纯文本。播放器使用 `preload="metadata"`，浏览器不下载整段录音就能显示时长。原生控件提供播放、拖动进度、音量与键盘操作；基于 Chromium 的浏览器还在控件菜单里提供播放速度。

这个文件与本页放在同一个页面包里：10 秒、63 KB 的 MP3。与块级图片一样，播放器需要站点设置 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`，见[图片 · 行内与块级](/zh/docs/components/image/#inline-vs-block)。

## 音频来源 {#sources}

音频文件的解析顺序与图片、视频相同：

| 放法 | 源码里怎么写 | 识别依据 |
| --- | --- | --- |
| 与页面同目录（页面包） | `![…](welcome-zh.mp3)` | Hugo 媒体类型 `audio/*` |
| 当前分区的页面包 | `![…](post/episode.mp3)` | Hugo 媒体类型 `audio/*` |
| 全局资源 `assets/…` | `![…](audio/episode.mp3)` | Hugo 媒体类型 `audio/*` |
| 静态目录 `static/…` | `![…](/audio/episode.mp3)` | 扩展名 `mp3`、`m4a`、`aac`、`oga`、`ogg`、`opus`、`wav`、`flac` |
| 对象存储或 CDN | `![…](https://cdn.example.com/episode-12.mp3)` | 同上扩展名 |

主题不检查静态路径与远程 URL 是否存在。页面包里的录音会随页面提交进 Git，本页这两段短样例适合这样放；较长的单集上传到对象存储，写它的 HTTPS 地址，做法见[视频 · 大文件](/zh/docs/components/video/#large-files)。

## 行内与块级 {#inline-vs-block}

只有独立成段的音频才渲染为播放器；夹在句子里时是一个普通链接：

````markdown {title="源码"}
夹在句子里的 ![欢迎录音](welcome-zh.mp3) 是指向文件的链接。
````

夹在句子里的 ![欢迎录音](welcome-zh.mp3) 是指向文件的链接。

方括号文字成为链接文字。行内音频不能带属性。

## 说明与样例组 {#caption}

`caption` 在标题后面加一段纯文本说明，窄屏上换到标题下方。紧挨着的几个音频 figure 会收紧间距，一组样例读起来就是一个整体：

````markdown {title="源码"}
![欢迎使用 OINK，英文版](welcome-en.mp3)
{caption="用英文朗读的标语"}

![欢迎使用 OINK，中文版](welcome-zh.mp3)
{caption="同一句话的简体中文朗读"}
````

![欢迎使用 OINK，英文版](welcome-en.mp3)
{caption="用英文朗读的标语"}

![欢迎使用 OINK，中文版](welcome-zh.mp3)
{caption="同一句话的简体中文朗读"}

说明不解析 Markdown。不要在说明里手写时长：播放器自己会显示，而且不会与文件不一致。`#id` 给 figure 一个锚点，链接可以直接指向某一段录音。

## 文字稿 {#transcript}

文字稿、节目笔记或歌词作为普通内容写在播放器之后；较长的文字稿放进折叠提示块，不占篇幅：

````markdown {title="源码"}
![语音样例 1 · 英文](welcome-en.mp3)

> [!DETAILS]- 文字稿
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![语音样例 2 · 中文](welcome-zh.mp3)

> [!DETAILS]- 文字稿
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。
````

![语音样例 1 · 英文](welcome-en.mp3)

> [!DETAILS]- 文字稿
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![语音样例 2 · 中文](welcome-zh.mp3)

> [!DETAILS]- 文字稿
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。

文字稿是 WCAG 1.2.1 对预录音频要求的文本替代，也照顾到当下不方便放出声音的读者。HTML 中这个提示块是收起的原生 `<details>`；打印与 RSS 把折叠提示块静态展开，Markdown 输出保留它的源码。因此文字稿在每一种静态输出里都是完整的，不需要任何音频专用规则。见[提示块 · DETAILS](/zh/docs/components/callout/#details)。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | `<figure class="td-media td-media--audio">`：`<figcaption>` 里是标题与说明，其后是原生 `<audio controls preload="metadata">`，内含一个回退链接 |
| 打印 | 标题、说明，以及作为链接的文件完整地址；没有播放器 |
| Markdown / LLMS | 原样输出图片行与属性行；后面的文字稿提示块保留源码 |
| RSS | 与打印相同，地址为绝对 URL |

音频总是渲染为 figure，因为它总有一个可见标题。在浏览器里打印 HTML 页面时，播放器隐藏，原位置印出文件地址。音频不加载 JavaScript。

## 参数参考 {#reference}

属性行 `{…}`（块级音频之后紧接的一行）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `caption` | 纯文本 | — | 显示在标题之后；不解析 Markdown |
| `#id` | 标识符 | — | figure 的锚点 |
| `class` | class 列表 | — | 透传到 figure，供站点 CSS 使用 |
| `data-*` / `aria-*` | 字符串 | — | 透传到 figure |
{.fields meta="type default"}

`num`、`poster`、`autoplay`、`track`、`width`、`height`、`link` 以及其他键作为未知属性告警并丢弃；`style` 与 `on*` 作为不安全属性告警。录音不是 Book 意义上的图，所以没有编号。

## 限制与常见问题 {#limits}

- 没有封面图、章节与波形：标题和说明就是整个框。
- 没有「同时只播一个」：开始播放一个播放器，不会暂停页面上的其他播放器。
- 主题不提供倍速控件：基于 Chromium 的浏览器在原生控件菜单里提供倍速，其他浏览器各不相同。
- 原生播放器在各浏览器中的外观略有差异，会跟随站点的浅色或深色模式。
- 每段录音只有一个源文件，没有编码回退；MP3 在所有现行浏览器中都能播放。
- 没有播客订阅源：RSS 输出不带 `<enclosure>`，播客分发由站点自行处理。
- 主题不测量文件大小，也不检查静态或远程文件。

## 相关 {#related}

- [视频](/zh/docs/components/video/) — 同样的语法，用于视频文件与视频平台
- [提示块](/zh/docs/components/callout/) — 承载文字稿的 `[!DETAILS]` 折叠块
- [图片](/zh/docs/components/image/) — 媒体共用的属性行与图片查找顺序
