---
title: 音频
linkTitle: 音频
description: 用图片语法把播客单集、语音样例或讲座录音放进页面，渲染为带标题的播放器，文字稿紧随其后。
weight: 340
search_keywords: [音频, Audio, mp3, m4a, ogg, wav, flac, 播客, podcast, 语音样例, 文字稿, transcript, 播放器]
---

像写图片一样写音频文件：`![标题](episode.mp3)`，它就成为一个带标题的播放器。适用于播客单集、语音样例、读音示范与讲座录音。没有新的 shortcode 要学，也不需要任何配置。共享的媒体脚本为播放器换上主题的控件栏：播放、已播放时间、一条进度条、总时长、倍速与声音。进度条只有一条，用三种颜色区分：已播放部分用当前页面的强调色，已缓冲部分是较深的中性色，其余是浅色。开始播放一段录音时，脚本还会暂停同页其他有声播放器。关闭 JavaScript 时仍使用浏览器自带的播放控件。

## 最简例子 {#minimal}

````markdown {title="源码"}
![欢迎使用 OINK](welcome-zh.mp3)
````

![欢迎使用 OINK](welcome-zh.mp3)

录音没有画面，方括号文字承担了图片替代文字的职责：它既是可见的标题，也通过 `aria-labelledby` 作为播放器的无障碍名称。留空时构建会告警，并用文件名作为标题；方括号里的 Markdown 格式按纯文本显示，URL 后面的 Markdown `"title"` 会被忽略。不要把音频再包进外层 Markdown 链接（`[![…](episode.mp3)](…)`）：原生播放器内部已含回退链接，再套链接会生成非法的嵌套 `<a>`。

页面上前 6 个音频播放器默认使用 `preload="metadata"`，不必下载整段录音就能显示时长；从第 7 个起默认切换为 `preload="none"`，避免多样例页面集中发起大量元数据请求。计数沿用 Hugo 的渲染顺序：先数直接写在页面里的播放器，再数标签页、include、卡片等 shortcode 正文里的播放器。也可以用 `{preload="none"}` 或 `{preload="metadata"}` 显式覆盖；shortcode 里的播放器如果必须显示时长，请显式写上 `{preload="metadata"}`。

这个文件是与本页放在同一页面包里的 MP3，时长 10 秒，大小 63 KB。与块级图片一样，播放器需要 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`，这是[站点前置配置](/zh/docs/components/#prerequisites)之一。

## 音频来源 {#sources}

音频文件的查找顺序与图片、视频相同：

| 放法 | 源码里怎么写 | 识别依据 |
| --- | --- | --- |
| 与页面同目录（页面包） | `![…](welcome-zh.mp3)` | 扩展名 `mp3`、`m4a`、`aac`、`oga`、`ogg`、`opus`、`wav`、`flac`，不区分大小写 |
| 当前分区的页面包 | `![…](post/episode.mp3)` | 同上扩展名 |
| 全局资源 `assets/…` | `![…](audio/episode.mp3)` | 同上扩展名 |
| 静态目录 `static/…` | `![…](/audio/episode.mp3)` | 同上扩展名 |
| 对象存储或 CDN | `![…](https://cdn.example.com/episode-12.mp3)` | 同上扩展名 |
{.wide}

Hugo 本身不定义任何 `audio/*` 媒体类型。如果站点在 `mediaTypes` 中声明了一个，那么属于该类型的页面资源或全局资源无论文件名如何都按音频处理。

本地资源与远程 URL 都会按原写法（包括百分号编码）保留查询参数和 Media Fragments 时间片段（如 `#t=30,60`），无须裁剪新文件即可定位到指定片段：

````markdown {title="带时间片段的远程单集"}
![第 12 期：告别 Sass，回归纯 CSS](https://cdn.example.com/podcast/episode-12.mp3#t=30,90)
{caption="OINK Radio · 2026 年 11 月录制" preload="none"}
````

页面包里的录音会随页面一起提交进 Git，适合本页这样的短样例。完整的一期节目请上传到对象存储，写它的 HTTPS 地址，做法见[视频 · 大文件](/zh/docs/components/video/#large-files)。主题不检查静态文件或远程文件是否存在，所以发布后打开页面实际播放一次。

## 行内与块级 {#inline-vs-block}

只有独立成段的音频才会渲染成播放器。夹在句子里时，它是指向文件的普通链接，方括号文字就是链接文字：

````markdown {title="源码"}
夹在句子里的 ![欢迎录音](welcome-zh.mp3) 是指向文件的链接。
````

夹在句子里的 ![欢迎录音](welcome-zh.mp3) 是指向文件的链接。

行内音频不能带属性行。

## 说明与样例组 {#caption}

`caption` 在标题后面加一行纯文本说明，窄屏上换到标题下方（并通过 `aria-describedby` 关联到播放器）。紧挨着的几个音频 figure 间距会收紧，一组样例读起来就是一个整体；开始播放其中一段时，页面上正在播放的其它音视频会自动暂停：

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

说明不解析 Markdown。不要在说明里写时长：播放器自己会显示，而且不会像手写的文字那样与文件对不上。加上 `#id` 可以给 figure 一个锚点，供链接直接指向这段录音。如果同页另一个音视频 figure 或编号图已经用了这个 ID，构建会告警，后出现的一方失去该 ID。标题和普通图片不在检查范围内，它们的 ID 需要你自己保持不重复。

## 文字稿 {#transcript}

文字稿、节目笔记或歌词作为普通内容紧跟在播放器后面。紧接在音频之后的 `[!DETAILS]` 折叠提示块会自动收紧与播放器的间距，让录音与文字稿在视觉上成对出现，同时在展开前不占版面。为每段文字稿起一个区分得开的标题，方便屏幕阅读器和键盘用户在多段样例间辨认：

````markdown {title="源码"}
![语音样例 1 · 英文](welcome-en.mp3)

> [!DETAILS]- 文字稿：语音样例 1
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![语音样例 2 · 中文](welcome-zh.mp3)

> [!DETAILS]- 文字稿：语音样例 2
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。
````

![语音样例 1 · 英文](welcome-en.mp3)

> [!DETAILS]- 文字稿：语音样例 1
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![语音样例 2 · 中文](welcome-zh.mp3)

> [!DETAILS]- 文字稿：语音样例 2
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。

文字稿是 WCAG 1.2.1 对预录音频要求的文本替代，也照顾到当下不方便放出声音的读者。打印与 RSS 会把折叠提示块完整展开，文字稿在那里同样完整。见[提示块 · DETAILS](/zh/docs/components/callout/#details)。

## 输出形态 {#outputs}

纸面和订阅源都放不出声音，静态输出会把播放器替换为可用链接：

- **专用 Print（`/_print/`）与浏览器打印**：无论屏幕处于浅色还是深色模式，均在纸面调色板上显示标题、说明，以及独占一行的可点击完整 URL。
- **RSS**：将标题直接链接到录音的绝对 URL，旁边保留说明。
- **Markdown 与 LLMS**：原样保留你写的图片行与属性行，紧随其后的文字稿提示块保持为可读文本。
- **从页面复制**：富文本复制保留标题、说明、起始对齐以及可点击的录音链接。

## 参数参考 {#reference}

属性行 `{…}`（紧跟在块级音频之后的一行）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `caption` | 纯文本 | — | 显示在标题之后并通过 `aria-describedby` 关联；不解析 Markdown |
| `#id` | 标识符 | — | figure 的锚点；与另一个媒体 figure 或编号图重复时告警并丢弃 |
| `preload` | `metadata` \| `none` | 前 6 个 `metadata`，第 7 个起 `none` | 控制播放前是否预取音频元数据 |
| `class` | class 列表 | — | 追加到 `<figure class="td-media td-media--audio">`，供站点 CSS 使用 |
| `data-*` / `aria-*` | 字符串 | — | 透传到 figure |
{.fields meta="type default"}

`num`、`poster`、`autoplay`、`track`、`width`、`height`、`link`、`command`、`options` 以及其它键会作为未知属性告警并丢弃；`style` 作为不安全属性告警；`on*` 事件属性在主题读到之前已被 Hugo 剥离，静默丢弃。录音不是 Book 意义上的图，所以没有编号。

## 限制与常见问题 {#limits}

- 没有封面图、章节与波形：标题和说明就是整个框。
- 同页互斥播放：播放器变为有声时（带声音开始播放，或正在播放时被取消静音），会暂停页面上其它有声的 `<audio>` 与 `<video>` 播放器。静音或没有声音的播放器（例如自动播放循环）继续播放。打开平台卡片时会先暂停有声播放器；平台播放器开始播放后，本地无法再暂停它。
- 倍速按钮依次切换 1×、1.25×、1.5×、2× 与 0.75×。指向或聚焦喇叭按钮时，旁边展开音量条；触屏设备使用设备自身的音量键。
- 控件栏在各浏览器中外观一致，跟随当前预设与浅色、深色模式。关闭 JavaScript 时保留浏览器的原生播放器及其自身样式。
- 焦点位于播放器控件内时，全站单键快捷键自动让位。
- 每段录音只有一个源文件，没有备用格式。MP3 在所有现行浏览器中都能播放。
- 没有播客订阅源：RSS 输出不带 `<enclosure>`，播客分发由站点自行处理。

## 相关 {#related}

- [视频](/zh/docs/components/video/) — 同样的语法，用于视频文件与视频平台
- [提示块](/zh/docs/components/callout/) — 承载文字稿的 `[!DETAILS]` 折叠块
- [图片](/zh/docs/components/image/) — 媒体共用的属性行与图片查找顺序
