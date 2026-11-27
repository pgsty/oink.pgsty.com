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
| 新增公共 API | 除接受音频目标外没有新增；属性为 `caption` 与 `id` |
| 运行时 | 无 |
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
- 零 JavaScript，零配置。

### 非目标 {#non-goals}

- `audio` 短代码，或组件内部的文字稿正文。
- 手工填写、可能与文件脱节的元数据：`duration`、`artist`。
- 编解码器回退（`mp3=`、`ogg=`、`m4a=`）。
- 第一阶段不做：封面图、章节、同页互斥播放、自定义倍速控件、波形。
- 播客 feed 或 RSS `<enclosure>` 元素；播客分发属于站点自己的事。

## 提议行为 {#design}

### 识别 {#detection}

块级图片满足以下任一条件即视为音频：目标是 Hugo 媒体类型为 `audio/*` 的资源；或者目标是
以 `mp3`、`m4a`、`aac`、`oga`、`ogg`、`opus`、`wav`、`flac` 结尾的 `static/` 路径或
HTTPS URL。目标为音频的行内图片渲染为普通链接。

### 属性 {#attributes}

| 属性 | 规则 |
| --- | --- |
| `caption` | 显示在标题下方的纯文本 |
| `id` | 与其他 figure ID 采用相同校验 |

`num`、`poster`、`autoplay`、`track`、`width`、`height`、`link`、`command` 和
`options` 会告警并被丢弃。不提供 Book 编号，因为 OINK 的编号类别只有图、表、公式和
示例；把录音称作图会贴错标签。方括号文字为空时告警，并以文件名作为标题。

### 渲染 {#rendering}

```html
<figure class="td-media td-media--audio">
  <figcaption>
    <span class="td-media__title">Episode 12: Leaving Sass for plain CSS</span>
    <span class="td-fig-caption">OINK Radio · 24 minutes · recorded November 2026</span>
  </figcaption>
  <audio controls preload="metadata" src="…/episode-12.mp3" aria-label="Episode 12: Leaving Sass for plain CSS">
    <a href="…/episode-12.mp3">Episode 12: Leaving Sass for plain CSS</a>
  </audio>
</figure>
```

音频始终渲染为 figure，因为它总有可见标题。播放器占满阅读宽度；连续的多个音频 figure
（例如一组语音样本）紧凑堆叠。预设负责外框和标题的样式；原生控件保留浏览器自身的外观，
`color-scheme` 随亮色与暗色模式切换。

`preload="metadata"` 让浏览器无须下载整个文件即可显示时长。

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML | 如上；无运行时 |
| Print | 标题、题注，以及以可见文字呈现的文件 URL |
| Markdown / LLMS | 作者编写的源码；随后的文字稿提示块保持为可读文本 |
| RSS | 指向文件的标题链接（绝对 URL）及题注 |

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
| 用运行时实现同页互斥播放、倍速切换和章节 | 推迟 | 基于 Chromium 的浏览器中，原生控件已覆盖倍速；其余浏览器可由主题提供倍速切换。同页互斥播放和章节对样本对比与长节目确有价值，但要让每个音频页面都带上脚本，各项都得先证明有需求 |
| 像图片那样隐藏方括号文字 | 否决 | 只剩一个播放器时，视力正常的读者看不到任何标签 |
| 作为 Book 图编号 | 否决 | 录音不是图；带编号的音频类别需要单独的 Book 索引，而目前没有这种需求 |

所选形态的代价：没有带封面图的播客式卡片，播放器在不同浏览器中的外观也略有差异。第一阶段
的任务是先让音频能够发布，这两点都可以接受。

## 后续候选 {#later}

每一项都需要单独的依据，并加入视频已经引入的 `js/chunks/media.js`：

- **同页互斥播放**：开始播放一个播放器时，暂停页面上的其他播放器，便于并排比较样本。
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
   `check-output-security.py`、`check-goldens.py`、`check-stylesheets.py`。
   不需要新增 locale 键。
4. 中英文指南与速查表中的一行；更新契约。

## 验收标准 {#acceptance}

- 音频页面不加载任何新运行时。
- 每个音频 figure 都有可见标题和无障碍名称。
- Print、RSS、Markdown 与 LLMS 中不含 `<audio>` 元素，并保留可用链接。
- 紧随其后的 `> [!DETAILS]-` 文字稿在专用 Print 输出中展开。

## 待决问题 {#open-decisions}

1. **标题位置。** 建议：放在播放器上方。备选：宽屏上放在播放器旁边，以便紧凑排列样本
   列表。
2. **S2 是否包含同页互斥播放。** 建议：不包含；等出现第一个比较样本的页面时再议。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）**：`audio` 短代码，带章节、倍速控件、互斥播放运行时、封面、
  时长与文字稿正文。
- **2026-11-27（审核）**：改用带 `caption` 与 `id` 的原生图片语法；文字稿由折叠提示块
  组合而成；运行时功能推迟。
- **2026-11-27（实现）。** 在共享媒体 partial 与 `assets/css/td/media.css` 中实现；没有运行时，也没有语言键。`bin/check-media-primitives.py` 新增两个无效输入用例。
