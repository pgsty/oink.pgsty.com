---
title: 视频
linkTitle: 视频
description: 在页面里放产品演示、屏幕录制和代替 GIF 的静音循环短片，并为 YouTube、Bilibili、Vimeo 上的视频生成卡片，读者点击之前不联系任何平台。
weight: 330
search_keywords: [视频, Video, mp4, webm, 海报图, poster, 字幕, subtitles, WebVTT, 自动播放, autoplay, GIF, YouTube, Bilibili, B 站, Vimeo, 嵌入, 就地播放]
---

视频的写法与图片相同：`![名称](tour.mp4)`，下一行可以跟一行属性。视频文件在页面自己的 `<video>` 元素里播放，不需要任何配置，也不依赖第三方服务。同样位置写 YouTube、Bilibili 或 Vimeo 的链接，则渲染为一张指向该平台的卡片；只有站点明确启用了这个平台，卡片才会在页面里就地播放，因为就地播放意味着读者的浏览器要连接这个平台。

产品演示、屏幕录制，以及通常做成 GIF 动图的无声短演示，适合用视频文件；已经发布在视频网站上的演讲和访谈，适合用平台卡片。视频文件在画面下方使用主题的控件栏：播放、已播放时间、一条进度条、总时长、倍速、字幕、声音与全屏。进度条只有一条，用三种颜色区分：已播放部分用当前页面的强调色，已缓冲部分是较深的中性色，其余是浅色。点击画面也可以播放或暂停。平台视频使用平台自己的控件。

## 最简例子 {#minimal}

````markdown {title="源码"}
![三个 OINK 页面的快速浏览](tour.mp4)
````

![三个 OINK 页面的快速浏览](tour.mp4)

这个文件与本页放在同一个页面包里：9 秒、1200×600、123 KB 的 MP4。方括号里的文字是播放器的无障碍名称，按替代文字的标准来写；它为空时由图注充当名称，两者都为空时，主题告警并改用文件名（平台链接则改用观看地址）。

播放器使用 `preload="metadata"`，读者按下播放之前，浏览器只取显示时长所需的那一小部分。尺寸未知时先按 16:9 占位，元数据到达后改为视频自身的比例；如果视频比例不是 16:9 又希望避免布局偏移，可补充本地 `poster` 或 `width` 与 `height`。

与块级图片一样，视频需要站点设置 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`，见[图片 · 行内与块级](/zh/docs/components/image/#inline-vs-block)。

## 视频来源 {#sources}

视频文件的解析顺序与图片相同：

| 放法 | 源码里怎么写 | 识别依据 |
| --- | --- | --- |
| 与页面同目录（页面包） | `![…](tour.mp4)` | Hugo 媒体类型 `video/*` |
| 当前分区的页面包 | `![…](post/tour.mp4)` | Hugo 媒体类型 `video/*` |
| 全局资源 `assets/…` | `![…](videos/tour.mp4)` | Hugo 媒体类型 `video/*` |
| 静态目录 `static/…` | `![…](/videos/tour.mp4)` | 扩展名 `mp4`、`m4v`、`webm`、`ogv`、`mov` |
| 对象存储或 CDN | `![…](https://cdn.example.com/tour.mp4)` | 同上扩展名 |

找不到对应资源的路径按静态路径输出，主题既不检查静态路径，也不检查远程 URL。扩展名只看路径部分，所以 `…/tour.mp4?sig=…` 这样的签名 URL 仍是视频；其他扩展名的地址则仍按图片处理，`https://example.com/stream?id=42` 会渲染成一张加载失败的 `<img>`。

## 行内与块级 {#inline-vs-block}

只有独立成段的视频才渲染为播放器。夹在句子里时，它是一个指向文件的普通链接，方括号文字就是链接文字：

````markdown {title="源码"}
夹在句子里的 ![同一段浏览视频](tour.mp4) 是指向文件的链接。
````

夹在句子里的 ![同一段浏览视频](tour.mp4) 是指向文件的链接。

行内的平台链接指向它的观看页。行内视频不能带属性。

## 海报图、字幕与图注 {#poster-track}

````markdown {title="源码"}
![三个 OINK 页面的快速浏览](tour.mp4)
{caption="文档外壳、它的上游 Docsy 与一个版本发布页，九秒看完" poster="tour-poster.jpg" track="tour.zh.vtt"}
````

![三个 OINK 页面的快速浏览](tour.mp4)
{caption="文档外壳、它的上游 Docsy 与一个版本发布页，九秒看完" poster="tour-poster.jpg" track="tour.zh.vtt"}

- `poster` 是播放前显示的海报图，查找方式与图片相同。本地位图海报还会给播放器提供宽高（这里是 1200×600），视频加载之前占位框就是正确的比例。
- `track` 是一个 WebVTT 字幕文件，查找方式相同。主题写出 `kind="subtitles"`，`srclang` 取页面语言，标签取语言名称，并默认打开字幕。每个语言版本写自己的文件：英文页用 `tour.en.vtt`，本页用 `tour.zh.vtt`。尽量把 `.vtt` 文件放在同源位置（页面包或 `static/`）；当 `track` 指向远程 URL 时，`<video>` 会附加 `crossorigin="anonymous"`，此时字幕与视频所在服务端都必须返回 CORS 响应头。
- `caption` 是 `<figcaption>` 里的纯文本，与图片完全相同，不解析 Markdown。

`num` 让视频成为 Book 编号图，与图片一样：图注前加按页面语言显示的「图 N」，`#id` 缺省为 `fig-<num>`，普通链接与 `xref` 都能引用它。见[书籍出版](/zh/docs/write/book/)。

## 尺寸 {#size}

`width` 与 `height` 取正整数且必须成对给出，用于设定播放器或卡片容器的宽高比，并覆盖海报图的比例（Print 与 RSS 中的海报 `<img>` 仍保留海报图自身尺寸）。没有本地海报图、比例又不是 16:9 的视频用它们：

```markdown {title="源码"}
![一段 4:3 的屏幕录制](https://cdn.example.com/oink/settings.mp4)
{width="1024" height="768"}
```

与图片尺寸不同，它们不会把横屏播放器缩小，播放器仍占满正文宽度；竖屏视频卡片与播放器仍以视口高度的 80% 为上限并水平居中。不是正整数或只给了一边尺寸的值都会告警并被忽略。

## 用循环短片代替 GIF {#autoplay}

````markdown {title="源码"}
![OINK 在浅色与深色之间切换](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="静音循环：进入视野时播放，滚出视野时暂停"}
````

![OINK 在浅色与深色之间切换](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="静音循环：进入视野时播放，滚出视野时暂停"}

`autoplay=true` 用于通常做成 GIF 动图的那种无声短演示，体积却小得多：这段 6 秒的短片 246 KB，同样内容转成 15 fps 的 GIF 是 4.4 MB，而且 GIF 无法暂停。

输出的视频带 `muted loop` 和一个 `data-td-media-autoplay` 标记，但不带 `autoplay` 属性。小型运行时 `js/chunks/media.js` 只在以下三个条件同时成立时播放：

- 视频至少一半处于可见区域；
- 页面本身可见，不在后台标签页里；
- 读者没有开启「减少动态效果」。

任一条件不再成立就暂停。读者自己暂停或播放后，以读者的选择为准，直到视频下一次离开视口。控件栏始终保留，动画随时可以停下（WCAG 2.2.2「暂停、停止、隐藏」），也可以打开声音。没有 JavaScript 时不会自动播放：读者看到海报图，自己按播放。`autoplay=false` 等同于不写，其他值告警并按 `false` 处理。

## 视频平台 {#platforms}

YouTube、Bilibili 或 Vimeo 的链接渲染为一张卡片：

````markdown {title="源码"}
![Pigsty：开源中国专访](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="开源中国与本站作者聊 Pigsty，2022 年"}
````

![Pigsty：开源中国专访](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="开源中国与本站作者聊 Pigsty，2022 年"}

卡片是一个指向观看页的链接，显示 `poster` 或一块素色底面、一个播放图标、方括号文字和平台名称。浏览器会从指定的地址加载作者提供的海报。点击播放前，卡片不向视频平台请求缩略图或播放器。本站启用了 Bilibili，点击上面的卡片会就地加载播放器，见[下一节](#embeds)。

接受的 URL：

- YouTube：`youtube.com/watch?v=ID`、`music.youtube.com/watch?v=ID`、`youtu.be/ID`、`youtube.com/shorts/ID`、`/live/ID`、`/embed/ID` 与 `youtube-nocookie.com/embed/ID`，ID 为 11 个字符。`t`、`start` 或 `#t=` 设定起始时间，写秒数（`90`）或 `1m30s` 形式。Shorts 链接在未指定 `poster` 或 `width`/`height` 时默认按 `9:16` 占位。
- Bilibili：`bilibili.com/video/BV…`、`bilibili.com/video/av…`、直接携带 ID 的 `b23.tv/BV…` / `b23.tv/av…`，以及 Bilibili 嵌入代码里的 `src`，即 `https://player.bilibili.com/player.html?bvid=…`（或 `?aid=…`；复制来的地址以 `//` 开头，需补上 `https:`）。嵌入地址可以用数字 `cid` 指定分 P；未指定有效 `cid` 时按 `p` 选择集数。`t` 设定起始时间。
- Vimeo：`vimeo.com/NUMBER`、`vimeo.com/manage/videos/NUMBER` 或 `player.vimeo.com/video/NUMBER`，不公开视频支持 `/HASH` 或 `?h=HASH`；`#t=` 或 `t` 设定起始时间。

起始时间写成其他形式（例如 `t=1:30`）时会告警，视频从 0 开始；请写成秒数或 `1h2m3s` 形式。

主机名可以带 `www.` 或 `m.`。主题先校验视频 ID，再用它拼出播放器地址，作者写的文字不会进入 iframe。这些主机上认不出 ID 的 URL 告警，渲染为没有播放器的卡片；不直接包含 ID 的 `b23.tv` 短链接（例如 `b23.tv/abc`）不联网无法解析，同样如此，改写完整的 `bilibili.com/video/BV…` 地址即可。

卡片接受 `caption`、`num`、`id`、`poster`、`width` 与 `height`；`track` 与 `autoplay` 写在卡片上会告警。主题从不抓取平台缩略图，想要配图就把一张截图存进页面包，作为 `poster`。

## 就地播放 {#embeds}

站点启用某个平台之前，它的卡片都只是外链：

```yaml {title="hugo.yml"}
params:
  video_embeds: [bilibili, youtube]
```

`params.video_embeds` 是从 `youtube`、`bilibili`、`vimeo` 中选取的列表，默认为空。就地播放会把平台的播放器加载进你的页面，读者的浏览器随即与该平台通信，平台能看到读者的地址，并适用它自己的隐私条款。这是否可以接受由站点所有者决定，所以在你列出平台之前，什么都不会加载。用列表而不是开关，是为了让站点就地播放一个平台，而对部分读者无法访问的另一个平台只给链接；本站就地播放 Bilibili 与 YouTube，Vimeo 保持外链。不是列表的值告警，所有卡片保持外链；未知的平台名告警并忽略。

对已启用的平台，普通点击会把卡片替换为平台播放器，并把焦点移进去。播放器以方括号文字为标题，运行在带 `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`、`allow="autoplay; picture-in-picture; fullscreen"` 与 `referrerpolicy="strict-origin-when-cross-origin"` 的 iframe 中，加载后立即从 URL 指定的起始时间播放。按住 <kbd>Ctrl</kbd>、<kbd>Cmd</kbd>、<kbd>Shift</kbd> 或 <kbd>Alt</kbd> 点击，或用中键点击时，仍按链接打开；没有 JavaScript 时卡片始终是链接。每个播放器都以该平台最注重隐私的设置加载：

| 平台 | 播放器主机 | 隐私设置 |
| --- | --- | --- |
| YouTube | `www.youtube-nocookie.com` | 隐私增强域名 |
| Bilibili | `player.bilibili.com` | 关闭弹幕 |
| Vimeo | `player.vimeo.com` | `dnt=1`，不跟踪 |

站点如果发送内容安全策略（CSP），要把所列平台的播放器主机加入 `frame-src`：`player.bilibili.com`、`www.youtube-nocookie.com`、`player.vimeo.com`，否则点击后浏览器会拦下播放器。

## 大文件 {#large-files}

页面包里的视频会随页面提交进 Git。本页这两段 123 KB 与 246 KB 的短片适合这样放；超过几 MB 的文件会让仓库的每一次克隆都变重，应上传到对象存储或 CDN，在源码里写它的 HTTPS 地址。海报图与字幕文件可以继续留在页面包里：

```markdown {title="源码"}
![在一台新节点上安装 Pigsty](https://cdn.example.com/oink/install.mp4)
{poster="install-poster.webp" track="install.zh.vtt" caption="单节点安装的完整过程"}
```

使用稳定的公开地址，并确保对象存储或 CDN 支持 HTTP Range 请求（S3、R2、GCS 与主流 CDN 默认支持），这样浏览器不必下载整个文件就能读取时长并拖动进度条；会过期的签名 URL 日后会让页面失效，而主题不检查远程文件。H.264 编码的 MP4 在所有现行浏览器中都能播放，屏幕录制可以用类似下面的命令压小：

```sh
ffmpeg -i recording.mov -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart demo.mp4
```

`-an` 去掉音轨，静音循环反正不会播放它；`+faststart` 把索引移到文件开头，浏览器不必下载整个文件就能显示时长。

## 输出形态 {#outputs}

HTML 中，视频是 `<figure class="td-media td-media--video">` 包着的原生 `<video controls preload="metadata" playsinline>`，共享脚本会把它的 `controls` 换成主题的 `.td-media__controls` 控件栏；有图注或编号时加上 `td-figure` 与 `<figcaption>`；平台链接是 `<a class="td-media-card">`，平台已启用时带 `data-td-media-embed`。纸面和订阅源里没有播放器，所以打印与 RSS 显示海报图（如果有）、作为链接的名称、平台名称（若适用）、文件或观看页的完整地址与图注，RSS 中的 URL 改为绝对地址。在浏览器里打印 HTML 页面时，显示海报图或当前画面，文件或观看地址印在下方；即便平台卡片点击后已被替换为 iframe，打印时仍会保留标题、平台名与观看地址。Markdown 与 LLMS 输出原样保留图片行与属性行。

## 参数参考 {#reference}

属性行 `{…}`（块级视频之后紧接的一行）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `caption` | 纯文本 | — | 图注；不解析 Markdown |
| `#id` | 标识符 | 有 `num` 时 `fig-<num>` | figure 的锚点与 Book 目标 ID |
| `num` | 字符串 | — | Book 图编号；注册 `fig` 目标，图注加「图 N」前缀 |
| `poster` | 路径 | — | 播放前显示的海报图，按图片解析；本地位图提供 `width`/`height` |
| `track` | 路径 | — | 一个 WebVTT 字幕文件，默认打开；`srclang` 取页面语言；仅限文件 |
| `autoplay` | `true` / `false` | `false` | 进入视野时播放的静音循环；仅限文件 |
| `width` / `height` | 正整数 | 海报图尺寸，否则 16:9 | 占位框的宽高比；播放器仍占满正文宽度 |
| `class` | class 列表 | — | 透传到 figure，供站点 CSS 使用 |
| `data-*` / `aria-*` | 字符串 | — | 透传到 figure |
{.fields meta="type default"}

`link`、`command`、`options` 以及其他键作为未知属性告警并丢弃；`style` 作为不安全属性告警；`on*` 事件属性在主题读到之前已被 Hugo 剥离，静默丢弃。

站点设置：

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.video_embeds` | 列表 | `[]` | 点击后可以就地加载播放器的平台：`youtube`、`bilibili`、`vimeo` |
{.fields meta="type default"}

## 限制与常见问题 {#limits}

- 每个视频只有一条字幕轨道：每个语言版本写自己的文件，没有字幕列表或字幕菜单。
- 只有一个源文件：没有多个 `<source>` 的编码回退，没有自适应流（HLS 或 DASH），也没有章节或播放列表。
- 字幕按钮打开或关闭这一条字幕。读者的系统字幕设置要求时，Safari 可能默认不显示字幕。
- 全屏时画面在上、控件栏在下。iPhone 上由系统播放器接管，使用它自己的控件。
- 焦点位于播放器控件内时，全站单键快捷键自动让位。
- 只支持三个平台：其他视频网站与任意 iframe 地址都不支持，在正文里给链接即可。
- 不抓取远程缩略图：卡片显示你提供的 `poster` 或素色底面。
- `width` 与 `height` 决定比例而非像素大小，且必须成对给出。播放器与卡片最高为视口高度的 80%，竖屏文件在 `<video>` 内左右留黑边（pillarbox），竖屏卡片与就地播放器则按该高度上限水平居中缩放。
- 静态路径与 URL 只按扩展名识别，没有视频扩展名的流媒体地址会按图片渲染。
- 主题不测量文件大小，也不检查静态或远程文件。

## 相关 {#related}

- [图片](/zh/docs/components/image/) — 同样的语法、属性行与图编号
- [音频](/zh/docs/components/audio/) — 带可见标题与文字稿的录音
- [Asciinema](/zh/docs/components/asciinema/) — 用可选中的文字记录终端会话，而不是视频
- [书籍出版](/zh/docs/write/book/) — 编号图与 `xref` 交叉引用
