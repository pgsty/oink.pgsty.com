---
title: "Video 组件"
linkTitle: Video 组件
description: 用普通 Markdown 图片语法插入视频：本地或对象存储中的文件、替代 GIF 的静音循环演示，以及隐私优先的 YouTube、Bilibili 与 Vimeo 卡片。
weight: 28
icon: fa-solid fa-film
search_keywords: [视频, Video 组件, mp4, webm, GIF 替代, youtube, bilibili, vimeo, 嵌入, facade, 隐私占位, 字幕, 组件]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] 已实现，等待接受
> 已在主题 main 分支的工作区中实现，并写入了[视频指南](/zh/docs/components/video/)。尚未提交，也未发布。共同决策见[总览](/zh/docs/design/proposals/content-components-expansion/)。

| 记录 | 内容 |
| --- | --- |
| 状态 | 2026-11-27 实现；尚未提交；等待接受 |
| 负责人 | OINK 维护者 |
| 交付阶段 | S2（文件、自动播放），S4（平台卡片与播放器） |
| 形态 | 原生形态：目标地址为视频文件或可识别视频平台 URL 的块级 Markdown 图片 |
| 新增公共 API | 视频专用的图片属性 `poster`、`track`、`autoplay`；配置项 `params.video_embeds` |
| 运行时 | 默认没有；自动播放视频和已启用的播放器使用 `js/chunks/media.js`（约 2 KB） |
| 受影响范围 | `render-image.html`、共享资源查找、一个媒体 partial、一个样式表层、配置 schema，以及新指南 `/docs/components/video/` |

## 概要 {#summary}

视频沿用作者插入图片时已经在用的语法：

```markdown
![Installing OINK in one command](install.mp4)
{caption="One-command setup" poster="install.webp" track="install.vtt"}

![Switching visual presets](presets.webm)
{autoplay=true caption="Paper, Slate, Ink, and Terminal"}

![OINK architecture talk](https://www.bilibili.com/video/BV1xx411c7mD?t=42)
{poster="talk.webp" caption="Conference talk, 2026"}
```

图片钩子识别出视频目标地址后，交给一个共享的媒体 partial 处理。文件渲染为带控件的原生 `<video>`。`autoplay=true` 把它变成静音、循环的演示：只在可见时播放，开启减少动态效果时绝不播放。YouTube、Bilibili 或 Vimeo 的 URL 渲染为链接到平台的静态卡片；站点在 `params.video_embeds` 中列出该平台时，点击卡片会就地加载该平台的播放器。

## 问题 {#problem}

- `![](demo.mp4)` 目前会告警并被丢弃，因为图片解析器只接受图片资源。
- 作者只能退回原始 `<video>`，它没有图注、编号、Print 或 RSS 形态；或者退回原始 `<iframe>` 播放器，它们在页面浏览时就加载第三方脚本和 cookie，造成布局偏移，在平台被屏蔽的地方无法使用，视频下架后也随之失效。
- 动画 GIF 演示体积大，而且无法暂停；常见的替代做法是手写 `autoplay loop muted` 视频，却忽略了减少动态效果偏好。

来自 `~/www` 与 `~/pgsty` 下本地 Markdown 的证据（2026-11-27）：两个博客直接嵌入了同一个 Bilibili `<iframe>`；一篇游记使用原始 `<video controls>`；同一批语料中的仓库 README 使用 `autoplay loop muted` 视频，其 URL 带有会过期的签名。没有任何检出使用 Hugo 内置的 `youtube` 或 `vimeo` 短代码。

## 设计原则 {#principles}

1. **视频就是一幅插图**：和图片完全一样，它有来源、无障碍名称、可选的图注和可选的 Book 编号。图片钩子已经负责这四项，因此视频扩展图片钩子，而不是新增一个短代码。
2. **已有先例**：GitLab Flavored Markdown 会把指向视频或音频文件的图片语法渲染为播放器，Obsidian 也会嵌入用图片语法书写的 YouTube 视频。OINK 自己的 Draw.io 组件就是一种原生图片形态。
3. **URL 即身份**：读者、订阅源和 Agent 能理解的是平台 URL，它还携带起始时间。主题在构建期由它推导出播放器 URL，不抓取任何内容。
4. **未经同意，不发第三方请求**：默认情况下，没有任何请求离开页面。站点显式启用后，也只在读者点击之后才连接平台。
5. **渐进增强**：所有形态在没有 JavaScript 时都可用；运行时只增加感知视口的自动播放和就地播放器。

## 目标与非目标 {#goals}

### 目标 {#goals-list}

- 来自本地、页面包、全局 assets、`static/` 与对象存储（HTTPS）的视频文件。
- 海报图、一条字幕轨道、图注、Book 编号，以及尺寸已知时不发生偏移的布局。
- 一种体积小、可暂停、尊重减少动态效果偏好的 GIF 替代方案。
- 默认不发起第三方请求的 YouTube、Bilibili 与 Vimeo 支持。
- 静态、可读的 Print、RSS、Markdown 与 LLMS 形态。

### 非目标 {#non-goals}

- `video` 短代码，或覆盖 Hugo 内置的 `youtube` 与 `vimeo`。
- 用多个 `<source>` 元素做编解码器回退；MP4（H.264）在 OINK 支持的所有环境中都能播放。
- 流媒体（HLS/DASH）、自定义播放器界面、播放列表、章节。
- 远程平台缩略图、oEmbed，或任何构建期请求。
- 上述三家之外的平台，或任意 iframe URL。

## 提议行为 {#design}

### 识别 {#detection}

块级图片的目标地址属于以下任一情况时，按视频处理：

| 目标地址 | 识别依据 |
| --- | --- |
| 页面资源、分支包资源或全局资源 | Hugo 媒体类型 `video/*` |
| `static/` 路径或 HTTPS URL | 扩展名 `mp4`、`m4v`、`webm`、`ogv` 或 `mov` |
| 平台 URL | 符合下文的某个严格模式 |

目标地址为视频的行内图片渲染为指向文件或观看页的普通链接，以方括号文本作为链接文字。其余情况保持现有的图片行为。

### 属性 {#attributes}

| 属性 | 适用于 | 规则 |
| --- | --- | --- |
| `caption`、`num`、`id` | 所有视频 | 共享的插图契约；`num` 注册一个 Book `fig` 目标 |
| `poster` | 所有视频 | 经共享图片解析器处理的图片路径。本地位图还会提供 `width`/`height` |
| `track` | 文件 | 一个经共享查找处理的 WebVTT 文件。`srclang` 取页面语言；标签为该语言的名称 |
| `autoplay` | 文件 | `true` 或 `false`，见下文。用于平台 URL 时告警并忽略 |
| `width`、`height` | 所有视频 | 正整数；作为固有尺寸或宽高比提示，优先于海报图的尺寸 |

`link`、`command` 与 `options` 会告警并被丢弃。方括号文本即无障碍名称。既没有 `width`/`height` 也没有本地海报图时，容器在元数据加载前预留 16:9 的空间。

### 文件 {#files}

```html
<figure class="td-figure td-media td-media--video">
  <video controls preload="metadata" playsinline src="…/install.mp4" poster="…/install.webp" width="1280" height="720" aria-label="Installing OINK in one command">
    <track kind="subtitles" src="…/install.vtt" srclang="en" label="English" default>
    <a href="…/install.mp4">Installing OINK in one command</a>
  </video>
  <figcaption><span class="td-fig-caption">One-command setup</span></figcaption>
</figure>
```

与块级图片一样，没有 `caption` 或 `num` 的视频不带 `<figure>` 包裹。

`autoplay=true` 输出 `muted loop playsinline` 和 `data-td-media-autoplay` 标记，但不输出 `autoplay` 属性。只有当视频至少一半可见、页面处于可见状态、且读者没有要求减少动态效果时，运行时才开始播放；视频离开视口时暂停。原生控件保留，因此动画随时可以暂停。没有 JavaScript 时，读者看到海报图或首帧，可以手动播放。

### 平台 URL {#platforms}

| 平台 | 接受的 URL | 推导出的播放器 |
| --- | --- | --- |
| YouTube | `youtube.com/watch?v=<id>`、`youtu.be/<id>`、`youtube.com/shorts/<id>`，ID 为 11 个字符；接受 `t` 或 `start` 参数 | `https://www.youtube-nocookie.com/embed/<id>?start=…&autoplay=1` |
| Bilibili | `bilibili.com/video/BV<id>` 或 `/video/av<number>`；接受 `p` 与 `t` 参数 | `https://player.bilibili.com/player.html?bvid=…&p=…&t=…&autoplay=1&danmaku=0` |
| Vimeo | `vimeo.com/<number>`，未公开列出的视频可附加 `/<hash>` | `https://player.vimeo.com/video/<number>?h=…&dnt=1&autoplay=1` |

构建任何 URL 之前，先按这些模式校验 ID；作者文本绝不会进入播放器 URL。无法离线解析的短链接（例如 `b23.tv`）只渲染不带播放器的卡片，并告警提示改用完整 URL 形式。

默认输出是一张卡片：海报图或中性底面、播放符号、方括号文本和平台名称，全部包在一个指向规范观看 URL 的链接内。不产生 iframe、脚本或缩略图请求。

平台列在 `params.video_embeds` 中时，卡片还携带推导出的播放器 URL。点击后，运行时把卡片替换为 iframe，并把焦点移入其中。该 iframe 以方括号文本作为 `title`，并带有 `allow="autoplay; picture-in-picture; fullscreen"`、`sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`、`allowfullscreen` 和 `referrerpolicy="strict-origin-when-cross-origin"`。没有 JavaScript 时，链接仍会打开平台页面。

### 配置 {#configuration}

```yaml
params:
  # Platforms whose player may load in place after a reader clicks.
  # Any of: youtube, bilibili, vimeo. Empty: cards only link out.
  video_embeds: []
```

值不是列表时告警，并保持仅输出卡片；未知名称告警并被忽略。之所以用列表而不是布尔值，是为了让部分受众无法访问 YouTube 的站点只启用 Bilibili，而不启用 YouTube。设置了内容安全策略（Content Security Policy）的站点需要把已启用的播放器主机加入 `frame-src`；指南会列出这些主机。

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML | 如上所述；仅在有自动播放视频或已启用的播放器时加载 `media.js` |
| Print | 有海报图时显示海报图，加上图注与 Book 标签，并以可见文本列出文件或观看 URL；不含 `<video>` 或 `<iframe>` |
| Markdown / LLMS | 作者编写的源码 |
| RSS | 有海报图时输出海报图（绝对 URL），再加一个以方括号文本为文字的链接；不含 `<video>` 或 `<iframe>` |

在浏览器中直接打印 HTML 时，显示海报图或当前帧；打印样式会在其下方显示 URL。

### 大文件 {#large-files}

页面包中的视频会被提交到 Git。按照仓库关于二进制素材的规则，指南建议超过几 MB 的视频改用对象存储或 CDN URL。主题不在构建期测量文件大小；体积报告属于 `oink-cli` 检查的职责。

## 权衡与备选方案 {#alternatives}

| 方案 | 决定 | 理由 |
| --- | --- | --- |
| 初稿中的 `{{</* video */>}}`，带 `src`、`youtube`、`bilibili`、`vimeo`、`webm`、`mp4`、`controls`、`muted`、`loop`、`gif`、`ratio` 等参数 | 否决 | 约二十个参数重复表达了图片语法与插图属性已能表达的内容，而且短代码会成为放置视频的第二种方式 |
| 覆盖 Hugo 的 `youtube` 与 `vimeo` | 否决 | Hugo 的 `vimeo` 可能在构建期向 Vimeo 发起抓取（其 simple 模式）；每多一个覆盖，就扩大一分与 Hugo 的分歧（见 [X 提案中的解析器发现](/zh/docs/design/proposals/component-social/#hugo-x)）；URL 比 ID 更清晰 |
| 会移除控件的 `gif=true` | 改名并修改 | `autoplay` 描述的是行为本身。移除控件不满足 WCAG 2.2.2（暂停、停止、隐藏） |
| HTML 的 `autoplay` 属性 | 否决 | 它忽略减少动态效果偏好，离开屏幕后仍继续播放；运行时门控才是无障碍的形态 |
| 远程平台缩略图 | 否决 | 每次浏览都会发出第三方请求 |
| 布尔型的 `params.video_embeds` | 否决 | 不同平台、不同地区的可达性各不相同 |

所选形态的代价：

- 用图片语法表示视频是一种约定，而非 CommonMark 语义。GitLab 以外的渲染器会显示一张损坏的图片；Markdown 输出保留 URL，因此 Agent 仍能理解。
- 可发现性从短代码的参数列表转移到图片指南；速查表为 Video 单独增加一行。
- `render-image.html` 增加一处分派。媒体分支放在独立的 partial 中，使图片路径保持可读，其 golden 保持不变。

## 兼容性 {#compatibility}

纯增量变更。目前视频目标地址只产生告警、没有输出，因此没有页面依赖这一行为。图片输出必须保持逐字节一致，由现有 golden 验证。`params.video_embeds` 是新增的键。

## 实现计划 {#implementation}

1. 把 `content/image-resolve.html` 中的查找逻辑提取为共享 partial；图片 golden 不得变化。
2. 新增 `content/media.html`（识别、属性、输出），并在 `render-image.html` 中、进入图片专属处理之前分派给它。
3. 新增 `assets/js/media.js`，作为稳定 chunk `js/chunks/media.js`，由 `scripts.html` 根据 Page Store 标志选择加载；在 `tests/js/` 下编写单元测试，模拟 `IntersectionObserver` 与 `matchMedia`。
4. S4：平台模式、`hugo.yaml` 中的 `params.video_embeds`、`bin/check-params.py`，以及生成的配置 schema。
5. 在全部 32 个语言文件中加入 `ui_video_play`（英文 “Play video”）与 `ui_video_open`（英文 “Open on the video site”）两个键，由 `bin/check-i18n.py` 检查。
6. 测试夹具：每种来源的文件、带尺寸和不带尺寸的海报图、字幕、自动播放、行内视频、每种平台模式、无效 ID、短链接，以及每种输出。所属检查器：`check-media-primitives.py`（图片钩子与共享解析）、`check-runtime-isolation.py`（chunk 标志）、`check-output.py`、`check-output-security.py`、`check-goldens.py`、`check-stylesheets.py`、`check-params.py`、`check-i18n.py`、`node --test`。
7. 在本站进行浏览器评审：键盘操作、播放器加载后的焦点、减少动态效果、预设、移动端与打印。

## 验收标准 {#acceptance}

- 没有自动播放视频或已启用播放器的页面，不加载媒体运行时。
- `video_embeds: []` 时，HTML 中不出现任何播放器主机 URL。
- 在 `prefers-reduced-motion: reduce` 下绝不自动播放，离开屏幕时暂停。
- Print、RSS、Markdown 与 LLMS 中不含 `<video>`、`<iframe>` 或运行时标记。
- 现有图片 golden 逐字节一致。

## 待决问题 {#open-decisions}

1. **无图注的视频**：建议与图片一致（不加 `<figure>`）。备选：始终包裹，以获得统一的框架。
2. **字幕**：建议每页一个 `track`，各语言页面各自指定字幕文件。列表形式推迟。
3. **Bilibili 弹幕**：建议在 S4 中固定 `danmaku=0`，不提供选项。
4. **未知尺寸**：建议预留 16:9；竖屏视频需设置 `width`/`height` 或海报图。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）**：`video` 短代码，带多种来源模式、约二十个参数、`gif=true` 以及需显式启用的 facade 占位。
- **2026-11-27（评审）**：改用原生图片语法，包含三个媒体属性、无障碍的自动播放门控、以平台 URL 为身份，以及按平台配置的 `params.video_embeds` 列表。
- **2026-11-27（实现）。** 在 `content/media-detect.html`、`content/media.html`、`content/video-embeds.html`、`assets/js/media.js` 与 `assets/css/td/media.css` 中实现，查找逻辑抽取到 `content/resource-lookup.html`。与本草案的差异：配置键是扁平列表 `params.video_embeds`（参数契约要求拍平单键 map）；没有图注或编号的视频保留 `td-media` 包裹，但没有 figcaption；Print 与 RSS 在 URL 旁写出视频名称；语言键为 `ui_video_play` 与 `ui_video_open`。两项联网设置在每个页面上校验。`bin/check-media-primitives.py` 新增八个无效输入用例，`tests/js/media.test.js` 覆盖运行时。
- **2026-11-27（评审加固）。** 修复前导零时间戳（`08s`、`010`）按十进制解析；扩展平台 URL 识别（`youtube-nocookie.com`、`music.youtube.com`、`player.vimeo.com`、Vimeo `?h=` 与 `#t=`、大写 `AV`、`b23.tv/BV…`、尾部斜杠，以及 YouTube Shorts 默认 `9:16` 比例）；解耦海报图尺寸与成对 `width`/`height` 宽高比；用 FIFO 预期事件队列替代 `setTimeout(0)` 自动播放事件追踪；为 iframe 增加 `sandbox` 并收紧 `allow` 与运行时白名单正则；排除 Draw.io 对 `.td-media-card__poster` 的检测；修复深色模式播放按钮对比度、海报渐变对比度、窄屏卡片文字与播放按钮重叠、竖屏 `80vh` 高度一致、强制颜色样式、RTL 播放三角偏移以及 Print/RSS 观看地址（含点击替换为 iframe 后的浏览器打印恢复）。在 `bin/check-media-primitives.py` 补齐零二进制媒体类型与视频矩阵测试，在 `bin/generate-config-schema.py` 推导 `video_embeds` 平台枚举，并在文档站补充 `tests/browser/video.spec.mjs`。
- **2026-11-27（验收评审修复）。** 卡片以 `--td-media-ratio` 携带比例，卡片与播放器的宽度上限改为 `min(100%, 80vh × 比例)`，因为 WebKit 不会在 `max-block-size` 截住 `aspect-ratio` 高度时相应收窄宽度；支持容器单位时，比例改为按 figure 宽度计算的最小高度，因为 WebKit 还会把 `aspect-ratio` 盒子固定在比例高度、裁掉换行的长标题。深色模式下浏览器打印时，无海报卡片的文字改用纸面墨色。Draw.io 恢复为只跳过 `a.td-media-card` 内的图片，其他带链接的图表仍可编辑。识别 Bilibili 嵌入代码中的 `src`，即 `player.bilibili.com/player.html?bvid=…|aid=…`，不再渲染为远程图片。由 `bin/check-media-primitives.py` 的视频矩阵与样式表契约、`tests/js/drawio.test.js` 和 `tests/browser/video.spec.mjs` 覆盖。
