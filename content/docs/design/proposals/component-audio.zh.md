---
title: "Audio 组件"
linkTitle: Audio 组件
description: 用普通 Markdown 图片语法嵌入音频：为播客、语音样本和录音提供带标题的原生播放器，文字稿放进折叠提示块，不需要运行时。
weight: 28
icon: fa-solid fa-headphones
search_keywords: [音频, audio, mp3, 播客, 语音样本, 文字稿, 播放器, 组件]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] 已实现，等待接受
> 已在主题 main 分支的工作区中实现，并写入了[音频指南](/zh/docs/components/audio/)。尚未提交，也未发布。共同决策见[总览](/zh/docs/design/proposals/content-components-expansion/)。

| 记录 | 内容 |
| --- | --- |
| 状态 | 2026-11-27 实现；尚未提交；等待接受 |
| 负责人 | OINK 维护者 |
| 交付阶段 | S2，与视频文件一同交付 |
| 形态 | 原生形态：目标为音频文件的块级 Markdown 图片 |
| 新增公共 API | 除接受音频目标外没有新增；属性为 `caption`、`id` 与 `preload` |
| 运行时 | 单个播放器无运行时；同页有 2 个及以上 `<audio>`/`<video>` 播放器时共享 `js/chunks/media.js`（同页互斥播放） |
| 受影响范围 | 与 Video 共用的媒体 partial、一个样式表分节，以及新指南 `/docs/components/audio/` |

## 概要 {#summary}

```markdown
![Episode 12: Leaving Sass for plain CSS](episode-12.mp3)
{caption="OINK Radio · 24 minutes · recorded November 2026"}

> [!DETAILS]- Transcript
> Welcome back. This week we removed the last Sass compiler …
```

音频文件渲染为一个 figure，包含作为可见标题的方括号文字、浏览器原生的
`<audio controls>`，以及可选的题注。文字稿、节目笔记或歌词是紧随其后的普通内容；
放进折叠提示块后，它们在 HTML 中收起、不占版面，在 Print 中完整展开。

## 问题 {#problem}

播客单集、文本转语音与语音模型样本、发音指南、音乐片段和演讲录音，都需要在正文中嵌入
播放器。目前 `![](episode.mp3)` 会告警并被丢弃；裸 `<audio>` 没有标题和题注，也没有
Print 或 RSS 形态。光有一个播放器，读者无从得知它播放的是什么。

## 设计原则 {#principles}

1. **与视频共用语法和分支。** 一个媒体 partial 统一负责两者的识别、查找与静态输出。
2. **名称必须可见。** 视频有画面，音频没有，因此方括号文字同时充当可见标题和播放器的
   无障碍名称。
3. **原生控件就是播放器。** 所有受支持的浏览器都提供播放、拖动进度、音量与键盘操作；
   基于 Chromium 的浏览器还在控件菜单中提供倍速和下载。
4. **组合，而不是吸收。** 文字稿属于正文内容，而 OINK 已有打印时展开的折叠容器。组件
   不另设正文。

## 目标与非目标 {#goals}

### 目标 {#goals-list}

- 支持本地、页面包、全局 assets、`static/` 与对象存储中的音频文件。
- 可见且具备无障碍名称的标题；可选的题注。
- 带可用链接的静态 Print、RSS、Markdown 与 LLMS 形态。
- 单个播放器零 JavaScript，同页有 2 个及以上播放器时共享 `js/chunks/media.js` 实现互斥播放；零配置。

### 非目标 {#non-goals}

- `audio` 短代码，或组件内部的文字稿正文。
- 手工填写、可能与文件脱节的元数据：`duration`、`artist`。
- 编解码器回退（`mp3=`、`ogg=`、`m4a=`）。
- 第一阶段不做：封面图、章节、自定义倍速控件、波形。
- 播客 feed 或 RSS `<enclosure>` 元素；播客分发属于站点自己的事。

## 提议行为 {#design}

### 识别 {#detection}

块级图片满足以下任一条件即视为音频：目标以 `mp3`、`m4a`、`aac`、`oga`、`ogg`、`opus`、
`wav`、`flac` 结尾（不区分大小写；页面资源、全局资源、`static/` 路径或 HTTPS URL 均可）；
或者目标是 Hugo 媒体类型为 `audio/*` 的资源。Hugo 默认不定义任何 `audio/*` 类型，只有站点
自行声明时媒体类型才起作用。解析到的本地资源会按原写法保留查询参数和片段（例如 Media
Fragments `#t=30,60`），包括其中的百分号编码。
目标为音频的行内图片渲染为普通链接。

### 属性 {#attributes}

| 属性 | 规则 |
| --- | --- |
| `caption` | 显示在标题下方的纯文本，通过 `aria-describedby` 关联 |
| `id` | 与其他 figure ID 采用相同校验；与同页另一个无编号音视频 figure 或编号 Book 目标重复时告警，并从后出现的一方丢弃。不与标题或普通图片的 ID 比较 |
| `preload` | `metadata` 或 `none`；同页前 6 个音频默认 `metadata`，第 7 个起默认 `none` |

`num`、`poster`、`autoplay`、`track`、`width`、`height`、`link`、`command` 和
`options` 会告警并被丢弃。不提供 Book 编号，因为 OINK 的编号类别只有图、表、公式和
示例；把录音称作图会贴错标签。方括号文字为空时告警，并以文件名作为标题。

### 渲染 {#rendering}

```html
<figure class="td-media td-media--audio">
  <figcaption>
    <span class="td-media__title" id="td-audio-…-a0-title">Episode 12: Leaving Sass for plain CSS</span>
    <span class="td-fig-caption" id="td-audio-…-a0-caption">OINK Radio · recorded November 2026</span>
  </figcaption>
  <audio controls preload="metadata" src="…/episode-12.mp3"
    aria-labelledby="td-audio-…-a0-title" aria-describedby="td-audio-…-a0-caption">
    <a href="…/episode-12.mp3">Episode 12: Leaving Sass for plain CSS</a>
  </audio>
  <p class="td-media__url"><a href="…/episode-12.mp3">https://…/episode-12.mp3</a></p>
</figure>
```

音频始终渲染为 figure（不带 `.td-figure`，保证标题与说明保持起始对齐），因为它总有可见标题。
播放器占满阅读宽度；连续的多个音频 figure 与紧随其后的 `.td-callout--details` 文字稿使用
`:has()` 正向边距编组，让录音与对应文字稿更紧密，相邻两组之间拉开距离：录音与文字稿之间
8px，连续录音之间 16px，每组外侧保持普通媒体外边距，上方 1.5rem、下方 1.75rem
（`:where(.td-media):not(.td-figure)`，比 Bootstrap 的 `figure` 重置多一级类选择器权重）。预设负责外框和标题样式
（卡片与提示块一样使用 `--td-code-radius`；Paper 与 Ink 让卡片表面与相邻提示块一致；Terminal 使用 `--td-brand-line-strong` 边框与
`--td-ui-font-family` 标题）；原生控件保留浏览器自身外观，Chromium 浏览器中 `color-scheme`
随明暗切换，Firefox 与 Safari 保持固定原生栏样式。

`preload="metadata"` 让浏览器无须下载整个文件即可显示时长；从第 7 个音频起默认切为
`preload="none"`，避免多样例页面并发发起大量元数据请求。

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML | 如上；单个播放器无运行时，2 个及以上播放器加载 `js/chunks/media.js` |
| Print | 标题、题注，以及在屏幕与纸面均可见的 `.td-media__link` 文件 URL（`@media print` 强制纸张调色板） |
| Markdown / LLMS | 作者编写的源码；随后的文字稿提示块保持为可读文本 |
| RSS | 直接链接到文件绝对 URL 的标题，以及题注 |
| 富文本复制 | 保持起始对齐的 figure，保留标题、题注与可点击的录音 URL |

提示块渲染钩子已经在专用 Print 输出和 RSS 中把折叠提示块渲染为静态的展开区块，Markdown
则保留其源码。因此，写成 `> [!DETAILS]-` 的文字稿无须任何音频专属规则，就能在所有静态
输出中完整呈现。

### 大文件 {#large-files}

沿用 [Video 的指引](/zh/docs/design/proposals/component-video/#large-files)：较长的录音
优先放到对象存储；页面包中的音频会提交进 Git。

## 权衡与备选方案 {#alternatives}

| 方案 | 决定 | 理由 |
| --- | --- | --- |
| 初稿的 `{{</* audio */>}}`，带 `src`、`mp3`、`ogg`、`m4a`、`title`、`artist`、`cover`、`duration`、`chapters`、`caption`、`preload`、`loop`、`download`、`compact` 参数和文字稿正文 | 否决 | 编解码器回退已经过时；`duration` 与 `artist` 是会与文件脱节的事实；`cover` 与 `compact` 会造成两种布局；正文与折叠提示块重复 |
| 用运行时实现倍速切换和章节 | 推迟 | 基于 Chromium 的浏览器中，原生控件已覆盖倍速；章节需要 WebVTT 实际需求再做。同页互斥播放已在同页 2 个及以上播放器时合入 `js/chunks/media.js` |
| 像图片那样隐藏方括号文字 | 否决 | 只剩一个播放器时，视力正常的读者看不到任何标签 |
| 作为 Book 图编号 | 否决 | 录音不是图；带编号的音频类别需要单独的 Book 索引，而目前没有这种需求 |

所选形态的代价：没有带封面图的播客式卡片，播放器在不同浏览器中的外观也略有差异。第一阶段
的任务是先让音频能够发布，这两点都可以接受。

## 后续候选 {#later}

每一项都需要单独的依据，并加入视频已经引入的 `js/chunks/media.js`：

- **章节**：来自 WebVTT `chapters` 轨道（标准载体），而不是自创一套参数小语言。
- **封面图**：如果播客页面提出需求，为音频提供 `poster`。

## 兼容性 {#compatibility}

纯增量变更；目前音频目标会告警，且不渲染任何内容。

## 实现计划 {#implementation}

音频与视频文件一起在 S2 落地，复用同一套抽取出的查找逻辑、媒体 partial 与 fixture。具体
工作：

1. 在 `content/media.html` 中实现音频识别、figure 布局与静态输出。
2. Fixture：每种来源、空方括号文字、不支持的属性、行内音频、连续样本，以及各输出中的
   文字稿提示块。
3. 归属检查器：`check-media-primitives.py`、`check-output.py`、
   `check-output-security.py`、`check-goldens.py`、`check-stylesheets.py`、
   `tests/js/media.test.js`、`tests/js/rich-copy.test.js` 与 `tests/browser/audio.spec.mjs`。
   不需要新增 locale 键。
4. 中英文指南与速查表中的一行；更新契约。

## 验收标准 {#acceptance}

- 单音频页面不加载运行时；同页有 2 个及以上播放器时加载 `js/chunks/media.js` 实现互斥播放。
- 每个音频 figure 都有可见标题，并通过 `aria-labelledby`（带说明时另加 `aria-describedby`）提供无障碍名称。
- Print、RSS、Markdown 与 LLMS 中不含 `<audio>` 元素，并保留可用链接（Print 屏幕与纸面均可见；RSS 标题直链）。
- 紧随其后的 `> [!DETAILS]-` 文字稿在专用 Print 输出中展开，在屏幕上与播放器紧密配对。

## 待决问题 {#open-decisions}

1. **标题位置。** 已定：放在播放器上方并起始对齐。
2. **S2 是否包含同页互斥播放。** 已定：通过 `js/chunks/media.js` 在同页 2 个及以上播放器时启用，单音频页面保持零 JS。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）**：`audio` 短代码，带章节、倍速控件、互斥播放运行时、封面、
  时长与文字稿正文。
- **2026-11-27（审核）**：改用带 `caption` 与 `id` 的原生图片语法；文字稿由折叠提示块
  组合而成；运行时功能推迟。
- **2026-11-27（实现）。** 在共享媒体 partial 与 `assets/css/td/media.css` 中实现；没有运行时，也没有语言键。`bin/check-media-primitives.py` 新增两个无效输入用例。
- **2026-11-27（评审修订）。** 修复深度评审问题：专用 Print 改用可见 `.td-media__link`；`@media print` 强制纸张调色板以修复深色打印黑卡片；音频去掉 `.td-figure` 并强制起始对齐；`<audio>` 改用 `aria-labelledby`/`aria-describedby`（并在 `render-block.html` 中同步重写作用域 ID）；本地资源保留查询参数与 `#t=` 时间片段；用 `:has()` 正向边距替代负外边距并修复音频与文字稿的邻近层级；对齐 Paper 与 Terminal 预设边框、圆角与标题字体；`rich-copy.js` 保留录音 URL 与起始对齐；新增 `preload` 属性及 6 个以上自动切 `none` 阈值；补齐无编号重复 `#id` 检测与 `audio:` 告警前缀；在 `js/chunks/media.js` 中按需启用同页互斥播放（单音频仍零 JS）；补齐 `check-output.py` 嵌套 `<a>` 守卫、`check-media-primitives.py` 矩阵、JS 单测与 `tests/browser/audio.spec.mjs`。
- **2026-11-27（对抗评审修复）。** 恢复被 Bootstrap `figure { margin: 0 0 1rem }` 覆盖的 24px/28px 外边距（`:where(.td-media)` 改为 `:where(.td-media):not(.td-figure)`），使 8px/24px 编组成立；同页互斥播放把任何静音或音量为 0 的播放器视为无声，并同时响应 `volumechange`，因此正在播放的循环视频被取消静音时会暂停其它音频，作者自写的静音循环不受影响；`book/register-target.html` 检查无编号媒体 ID，重复 ID 检测变为双向；本地片段保留原有百分号编码（`EscapedFragment`）；`preload` 只在 HTML 中告警；音频卡片在所有预设中使用 `--td-code-radius`，Ink 下使用提示块表面。浏览器回归改为断言绝对间距并使用真实 `play()`；`check_audio_matrix()` 覆盖大写扩展名、站点自定义 `audio/*` 媒体类型、编码片段、与 Book 目标的双向 ID 冲突以及子路径 `baseURL`。
