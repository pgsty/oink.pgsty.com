---
title: 视频
linkTitle: 视频
description: 用 Markdown 图片语法写视频：文件用浏览器原生播放器播放，静音循环短片代替 GIF 动图，YouTube、Bilibili 与 Vimeo 链接渲染为点击之前不联系任何第三方的卡片。
weight: 172
search_keywords: [视频, Video, mp4, webm, 海报图, poster, 字幕, subtitles, WebVTT, 自动播放, autoplay, GIF, YouTube, Bilibili, B 站, Vimeo, 嵌入, 就地播放]
---

视频的写法与图片相同：`![名称](tour.mp4)`，下一行可以跟一行属性。图片渲染钩子识别出视频地址后，输出浏览器原生的 `<video>` 播放器而不是 `<img>`；同样位置写 YouTube、Bilibili 或 Vimeo 的链接，则渲染为一张指向该平台的卡片。主题没有视频短代码；页面上没有自动播放视频、也没有已启用平台的卡片时，不加载任何视频 JavaScript。

## 最简例子 {#minimal}

````markdown {title="源码"}
![三个 OINK 页面的快速浏览](tour.mp4)
````

![三个 OINK 页面的快速浏览](tour.mp4)

这个文件与本页放在同一个页面包里：9 秒、1200×600、109 KB 的 MP4。方括号里的文字是播放器的无障碍名称，按替代文字的标准来写；它为空时由图注充当名称；两者都为空时，主题告警并改用文件名。播放器带原生控件与 `preload="metadata"`：读者按下播放之前，浏览器只取显示时长所需的那一小部分。尺寸未知时先按 16:9 占位，元数据到达后改为视频自身的比例。

与块级图片一样，这需要站点设置 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`，见[图片 · 行内与块级](/zh/docs/components/image/#inline-vs-block)。

## 视频来源 {#sources}

视频文件的解析顺序与图片相同：

| 放法 | 源码里怎么写 | 识别依据 |
| --- | --- | --- |
| 与页面同目录（页面包） | `![…](tour.mp4)` | Hugo 媒体类型 `video/*` |
| 当前分区的页面包 | `![…](post/tour.mp4)` | Hugo 媒体类型 `video/*` |
| 全局资源 `assets/…` | `![…](videos/tour.mp4)` | Hugo 媒体类型 `video/*` |
| 静态目录 `static/…` | `![…](/videos/tour.mp4)` | 扩展名 `mp4`、`m4v`、`webm`、`ogv`、`mov` |
| 对象存储或 CDN | `![…](https://cdn.example.com/tour.mp4)` | 同上扩展名 |

找不到对应资源的路径按静态路径输出；主题不检查静态路径与远程 URL 是否存在。扩展名只看路径部分，所以 `…/tour.mp4?sig=…` 这样的签名 URL 仍是视频。其他扩展名的地址仍按图片处理：`https://example.com/stream?id=42` 会渲染成一张加载失败的 `<img>`。

## 行内与块级 {#inline-vs-block}

只有独立成段的视频才渲染为播放器；夹在句子里时是一个普通链接：

````markdown {title="源码"}
夹在句子里的 ![同一段浏览视频](tour.mp4) 是指向文件的链接。
````

夹在句子里的 ![同一段浏览视频](tour.mp4) 是指向文件的链接。

方括号文字成为链接文字；行内的平台链接指向它的观看页。行内视频不能带属性。

## 海报图、字幕与图注 {#poster-track}

````markdown {title="源码"}
![三个 OINK 页面的快速浏览](tour.mp4)
{caption="文档外壳、它的上游 Docsy 与一个版本发布页，九秒看完" poster="tour-poster.jpg" track="tour.zh.vtt"}
````

![三个 OINK 页面的快速浏览](tour.mp4)
{caption="文档外壳、它的上游 Docsy 与一个版本发布页，九秒看完" poster="tour-poster.jpg" track="tour.zh.vtt"}

- `poster` 是播放前显示的海报图，按图片的查找顺序解析。本地位图海报还会给播放器提供宽高（这里是 1200×600），视频加载之前占位框就是正确的比例。
- `track` 是一个 WebVTT 字幕文件，查找方式相同。主题写出 `kind="subtitles"`，`srclang` 取页面语言，标签取语言名称，并默认打开字幕。每个语言版本写自己的文件：英文页用 `tour.en.vtt`，本页用 `tour.zh.vtt`。
- `caption` 是 `<figcaption>` 里的纯文本，与图片完全相同，不解析 Markdown。

`num` 让视频成为 Book 编号图，与图片一样：图注前加本地化的「图 N」前缀，`#id` 缺省为 `fig-<num>`，并注册一个 `fig` 目标，普通链接与 `xref` 都能引用它。见[书籍出版](/zh/docs/write/book/)。

## 尺寸 {#size}

`width` 与 `height` 是正整数，同时给出时设定占位框的宽高比，并覆盖海报图的尺寸。没有本地海报图、比例又不是 16:9 的视频用它们：

```markdown {title="源码"}
![一段 4:3 的屏幕录制](https://cdn.example.com/oink/settings.mp4)
{width="1024" height="768"}
```

与图片尺寸不同，它们不会把播放器缩小：视频总是占满正文宽度。不是正整数的值告警并忽略。

## 用循环短片代替 GIF {#autoplay}

````markdown {title="源码"}
![OINK 在浅色与深色之间切换](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="静音循环：进入视野时播放，滚出视野时暂停"}
````

![OINK 在浅色与深色之间切换](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="静音循环：进入视野时播放，滚出视野时暂停"}

`autoplay=true` 适合通常用 GIF 动图发布的那种无声短演示。这段 6 秒的短片 233 KB；同一段内容转成 15 fps 的 GIF 是 4.4 MB，而且 GIF 无法暂停。

输出的标记是 `muted loop` 加一个 `data-td-media-autoplay` 标记，但不带 `autoplay` 属性。运行时 `js/chunks/media.js` 只在以下三个条件同时成立时播放：

- 视频至少一半处于可见区域；
- 页面本身可见，不在后台标签页里；
- 读者没有开启「减少动态效果」。

任一条件不再成立就暂停。读者自己暂停或播放后，以读者的选择为准，直到视频下一次离开视口。原生控件始终保留，动画随时可以停下（WCAG 2.2.2「暂停、停止、隐藏」），读者也可以取消静音。没有 JavaScript 时不会自动播放：读者看到海报图，自己按播放。`autoplay=false` 等同于不写；其他值告警并按 `false` 处理。

## 视频平台 {#platforms}

YouTube、Bilibili 或 Vimeo 的链接渲染为一张卡片：

````markdown {title="源码"}
![Pigsty：开源中国专访](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="开源中国与本站作者聊 Pigsty，2022 年"}
````

![Pigsty：开源中国专访](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="开源中国与本站作者聊 Pigsty，2022 年"}

卡片是一个指向观看页的链接，显示 `poster` 或一块素色底面、一个播放图标、方括号文字和平台名称。渲染卡片不联系任何第三方：没有 iframe、平台脚本，也不请求缩略图。本站允许 Bilibili 就地播放，点击上面的卡片会加载播放器，见[下一节](#embeds)。

接受的 URL：

- YouTube：`youtube.com/watch?v=ID`、`youtu.be/ID` 或 `youtube.com/shorts/ID`，`/live/ID` 与 `/embed/ID` 也能识别；ID 为 11 个字符。`t` 或 `start` 设定起始时间，写秒数（`90`）或 `1m30s` 形式。
- Bilibili：`bilibili.com/video/BV…` 或 `bilibili.com/video/av…`。`p` 选择多 P 视频中的某一 P，`t` 设定起始时间。
- Vimeo：`vimeo.com/NUMBER`，不公开视频为 `vimeo.com/NUMBER/HASH`。播放器总是从头开始。

主机名可以带 `www.` 或 `m.`。主题先校验视频 ID 再拼出播放器地址，作者写的文字不会进入 iframe。这些主机上认不出 ID 的 URL 告警，渲染为没有播放器的卡片。`b23.tv` 短链接不联网无法解析，同样告警并渲染为没有播放器的卡片；改写完整的 `bilibili.com/video/BV…` 地址即可。

卡片接受 `caption`、`num`、`id`、`poster`、`width` 与 `height`；`track` 与 `autoplay` 写在卡片上会告警。主题从不抓取平台缩略图，想要配图就把一张截图存进页面包。

## 就地播放 {#embeds}

站点列出某个平台之前，它的卡片只是外链：

```yaml {title="hugo.yml"}
params:
  video_embeds: [bilibili, youtube]
```

`params.video_embeds` 是从 `youtube`、`bilibili`、`vimeo` 中选取的列表，默认为空。本站启用了 Bilibili 与 YouTube，Vimeo 保持外链。用列表而不是开关，是为了让站点就地播放一个平台，而对部分读者无法访问的另一个平台只给链接。不是列表的值告警，所有卡片保持外链；未知的平台名告警并忽略。

对已启用的平台，普通点击会把卡片替换为平台播放器，并把焦点移进去。播放器的标题取方括号文字，加载后立即从 URL 指定的起始时间播放。按住 <kbd>Ctrl</kbd>、<kbd>Cmd</kbd>、<kbd>Shift</kbd> 或 <kbd>Alt</kbd> 点击、或用中键点击时，保持链接行为；没有 JavaScript 时卡片始终是链接。

| 平台 | 播放器主机 | 隐私设置 |
| --- | --- | --- |
| YouTube | `www.youtube-nocookie.com` | 隐私增强域名 |
| Bilibili | `player.bilibili.com` | 关闭弹幕 |
| Vimeo | `player.vimeo.com` | `dnt=1`，不跟踪 |

站点如果发送内容安全策略（CSP），需要把已启用的播放器主机加入 `frame-src`：`player.bilibili.com`、`www.youtube-nocookie.com`、`player.vimeo.com`。

## 大文件 {#large-files}

页面包里的视频会随页面提交进 Git。本页这两段 109 KB 与 233 KB 的短片适合这样放；超过几 MB 的文件，上传到对象存储或 CDN，在源码里写它的 HTTPS 地址。海报图与字幕文件可以继续留在页面包里：

```markdown {title="源码"}
![在一台新节点上安装 Pigsty](https://cdn.example.com/oink/install.mp4)
{poster="install-poster.webp" track="install.zh.vtt" caption="单节点安装的完整过程"}
```

使用稳定的公开地址：会过期的签名 URL 日后会让页面失效，而主题不检查远程文件。H.264 编码的 MP4 在所有现行浏览器中都能播放；屏幕录制可以用类似下面的命令压小：

```sh
ffmpeg -i recording.mov -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart demo.mp4
```

`-an` 去掉音轨，静音循环反正不会播放它；`+faststart` 把索引移到文件开头，浏览器不必下载整个文件就能显示时长。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | `<figure class="td-media td-media--video">` 包着原生 `<video controls preload="metadata" playsinline>`；有图注或编号时加 `td-figure` 与 `<figcaption>`；平台链接是 `<a class="td-media-card">`，平台已启用时带 `data-td-media-embed` |
| 打印 | 有海报图时显示海报图，名称作为链接，再加图注；文件另外写出完整地址，卡片写出平台名称；没有播放器 |
| Markdown / LLMS | 原样输出图片行与属性行 |
| RSS | 与打印相同的静态 figure，URL 改为绝对地址 |

没有图注与编号的视频同样放在 `td-media` figure 里，只是没有 `<figcaption>`。在浏览器里打印 HTML 页面时，显示海报图或当前画面，文件地址印在下方。`js/chunks/media.js` 只在 HTML 中加载，而且只在页面上有自动播放视频或已启用平台的卡片时加载。

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

`link`、`command`、`options` 以及其他键作为未知属性告警并丢弃；`style` 与 `on*` 作为不安全属性告警。

站点设置：

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.video_embeds` | 列表 | `[]` | 点击后可以就地加载播放器的平台：`youtube`、`bilibili`、`vimeo` |
{.fields meta="type default"}

## 限制与常见问题 {#limits}

- 每个视频只有一条字幕轨道：每个语言版本写自己的文件，没有字幕列表或字幕菜单。
- 只有一个源文件：没有多个 `<source>` 的编码回退，没有自适应流（HLS 或 DASH），也没有章节、播放列表或自定义控件。
- 只支持三个平台：其他视频网站与任意 iframe 地址都不支持，在正文里给链接即可。
- 不抓取远程缩略图：卡片显示你提供的 `poster` 或素色底面。
- `width` 与 `height` 决定比例而非大小。播放器最高为视口高度的 80%，竖屏录制在这个高度内加黑边显示。
- 静态路径与 URL 只按扩展名识别：没有视频扩展名的流媒体地址会按图片渲染。
- 主题不测量文件大小，也不检查静态或远程文件。

## 相关 {#related}

- [图片](/zh/docs/components/image/) — 同样的语法、属性行与图编号
- [音频](/zh/docs/components/audio/) — 带可见标题与文字稿的录音
- [Asciinema](/zh/docs/components/asciinema/) — 用可选中的文字记录终端会话，而不是视频
- [书籍出版](/zh/docs/write/book/) — 编号图与 `xref` 交叉引用
