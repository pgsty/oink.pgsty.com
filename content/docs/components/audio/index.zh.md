---
title: 音频
linkTitle: 音频
description: 用图片语法把播客单集、语音样例或讲座录音放进页面，渲染为带标题的原生播放器，文字稿紧随其后。
weight: 174
search_keywords: [音频, Audio, mp3, m4a, ogg, wav, flac, 播客, podcast, 语音样例, 文字稿, transcript, 播放器]
---

像写图片一样写音频文件：`![标题](episode.mp3)`，它就成为一个带标题的 figure，里面是浏览器自带的音频播放器。适用于播客单集、语音样例、读音示范与讲座录音。没有新的 shortcode 要学，也不需要任何配置；页面不为它加载脚本，因为原生 `<audio>` 元素本身就提供了播放、拖动进度、音量与键盘操作。

## 最简例子 {#minimal}

````markdown {title="源码"}
![欢迎使用 OINK](welcome-zh.mp3)
````

![欢迎使用 OINK](welcome-zh.mp3)

录音没有画面，方括号文字承担了图片替代文字的职责：它既是可见的标题，也是播放器的无障碍名称。留空时构建会告警，并用文件名作为标题；方括号里的 Markdown 格式按纯文本显示。读者按下播放之前，播放器只加载文件的元数据，不必下载整段录音就能显示时长。基于 Chromium 的浏览器还在播放器菜单里提供播放速度。

这个文件是与本页放在同一页面包里的 MP3，时长 10 秒，大小 63 KB。与块级图片一样，播放器需要 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`，这是[站点前置配置](/zh/docs/components/#prerequisites)之一。

## 音频来源 {#sources}

音频文件的查找顺序与图片、视频相同：

| 放法 | 源码里怎么写 | 识别依据 |
| --- | --- | --- |
| 与页面同目录（页面包） | `![…](welcome-zh.mp3)` | Hugo 媒体类型 `audio/*` |
| 当前分区的页面包 | `![…](post/episode.mp3)` | Hugo 媒体类型 `audio/*` |
| 全局资源 `assets/…` | `![…](audio/episode.mp3)` | Hugo 媒体类型 `audio/*` |
| 静态目录 `static/…` | `![…](/audio/episode.mp3)` | 扩展名 `mp3`、`m4a`、`aac`、`oga`、`ogg`、`opus`、`wav`、`flac` |
| 对象存储或 CDN | `![…](https://cdn.example.com/episode-12.mp3)` | 同上扩展名 |

页面包里的录音会随页面一起提交进 Git，适合本页这样的短样例。完整的一期节目请上传到对象存储，写它的 HTTPS 地址，做法见[视频 · 大文件](/zh/docs/components/video/#large-files)。主题不检查静态文件或远程文件是否存在，所以发布后打开页面实际播放一次。

## 行内与块级 {#inline-vs-block}

只有独立成段的音频才会渲染成播放器。夹在句子里时，它是指向文件的普通链接，方括号文字就是链接文字：

````markdown {title="源码"}
夹在句子里的 ![欢迎录音](welcome-zh.mp3) 是指向文件的链接。
````

夹在句子里的 ![欢迎录音](welcome-zh.mp3) 是指向文件的链接。

行内音频不能带属性行。

## 说明与样例组 {#caption}

`caption` 在标题后面加一行纯文本说明，窄屏上换到标题下方。紧挨着的几个音频 figure 间距会收紧，一组样例读起来就是一个整体：

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

说明不解析 Markdown。不要在说明里写时长：播放器自己会显示，而且不会像手写的文字那样与文件对不上。加上 `#id` 可以给 figure 一个锚点，供链接直接指向这段录音。

## 文字稿 {#transcript}

文字稿、节目笔记或歌词作为普通内容写在播放器后面。较长的文字稿放进折叠提示块，读者需要时再展开：

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

文字稿是 WCAG 1.2.1 对预录音频要求的文本替代，也照顾到当下不方便放出声音的读者。打印与 RSS 会把折叠提示块完整展开，文字稿在那里同样完整。见[提示块 · DETAILS](/zh/docs/components/callout/#details)。

## 输出形态 {#outputs}

纸面和订阅源都放不出声音，所以打印与 RSS 不显示播放器，而是显示标题、说明，以及作为链接的文件完整地址；在浏览器里打印 HTML 页面时也是如此。页面的 Markdown 输出原样保留你写的图片行与属性行。

## 参数参考 {#reference}

属性行 `{…}`（紧跟在块级音频之后的一行）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `caption` | 纯文本 | — | 显示在标题之后；不解析 Markdown |
| `#id` | 标识符 | — | figure 的锚点 |
| `class` | class 列表 | — | 追加到 `<figure class="td-media td-media--audio">`，供站点 CSS 使用 |
| `data-*` / `aria-*` | 字符串 | — | 透传到 figure |
{.fields meta="type default"}

`num`、`poster`、`autoplay`、`track`、`width`、`height`、`link` 以及其它键会作为未知属性告警并丢弃；`style` 与 `on*` 作为不安全属性告警。录音不是 Book 意义上的图，所以没有编号。

## 限制与常见问题 {#limits}

- 没有封面图、章节与波形：标题和说明就是整个框。
- 开始播放一个播放器，不会暂停页面上的其它播放器。
- 主题不提供倍速控件。基于 Chromium 的浏览器在原生控件菜单里提供倍速，其它浏览器各不相同。
- 原生播放器在各浏览器中的外观略有差异，会跟随站点的浅色或深色模式。
- 每段录音只有一个源文件，没有备用格式。MP3 在所有现行浏览器中都能播放。
- 没有播客订阅源：RSS 输出不带 `<enclosure>`，播客分发由站点自行处理。

## 相关 {#related}

- [视频](/zh/docs/components/video/) — 同样的语法，用于视频文件与视频平台
- [提示块](/zh/docs/components/callout/) — 承载文字稿的 `[!DETAILS]` 折叠块
- [图片](/zh/docs/components/image/) — 媒体共用的属性行与图片查找顺序
