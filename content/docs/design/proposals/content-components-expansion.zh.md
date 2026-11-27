---
title: "内容组件扩展：评审与共享设计"
linkTitle: 内容组件扩展
description: 六个新内容组件（Timeline、Update、社交帖子、Video、Audio 与 Map）经评审后的方案、它们共享的设计决策，以及交付顺序。
weight: 26
icon: fa-solid fa-puzzle-piece
search_keywords: [内容组件, 组件扩展, 时间线, timeline, 更新日志, update, changelog, x, tweet, 社交帖子, 视频, video, 音频, audio, 地图, map, openstreetmap, leaflet, 评审]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] 已实现，等待发布
> 六个组件都已在主题 `main` 分支中实现，写入了[组件指南](/zh/docs/components/)，并记录在[组件契约](/zh/docs/design/components/#timeline-media-social-and-maps)中。尚未包含在发布标签中。本页取代同日写成的第一版单页草案；每个组件各有一份提案。

| 记录 | 内容 |
| --- | --- |
| 状态 | 2026-11-27 在 `main` 实现；等待发布 |
| 负责人 | OINK 维护者 |
| 范围 | OINK 主题；本文档站；一个可选的 `oink-cli` 辅助命令（另有提案） |
| 受影响契约 | [组件](/zh/docs/design/components/)、[架构](/zh/docs/design/architecture/)、[组件指南](/zh/docs/components/)、配置参考 |
| 证据快照 | 主题 `9738dcf`、文档站 `b749ba4`、Hugo 0.170.1、`~/www` 与 `~/pgsty` 下消费站点的本地检出 |

## 六项提案 {#proposals}

| 组件 | 最终形态 | 新增公共 API | 运行时 | 提案 |
| --- | --- | --- | --- | --- |
| Timeline | 定义列表加 `{.timeline}` | 无（作者标记） | 无 | [Timeline 组件](/zh/docs/design/proposals/component-timeline/) |
| Update | 标题加 `{.update date="…" tags="…"}` | 两个标题属性 | 无 | [Update 组件](/zh/docs/design/proposals/component-update/) |
| 社交帖子 | `{{</* social */>}}…{{</* /social */>}}` | 一个短代码 | 无 | [社交帖子组件](/zh/docs/design/proposals/component-social/) |
| Video | `![name](demo.mp4)` 与平台 URL | 图片钩子上的媒体属性；`params.video_embeds` | 仅自动播放或已启用的嵌入需要 | [Video 组件](/zh/docs/design/proposals/component-video/) |
| Audio | `![name](episode.mp3)` | 图片钩子上的媒体属性 | 单播放器无；2 个及以上共享 `media.js` | [Audio 组件](/zh/docs/design/proposals/component-audio/) |
| Map | `map` 数据围栏 | 一个围栏；`params.map` | 随主题内置（vendored）的 Leaflet，仅在启用时加载 | [Map 组件](/zh/docs/design/proposals/component-map/) |

文档中的组件目录从 21 个增加到 27 个，短代码从 29 个增加到 30 个（新增 `social`）。图片与标题渲染钩子各增加分支，另新增一个围栏钩子（`map`）。

## 评审结论 {#verdict}

六个组件都填补了真实的缺口，第一版草案对 OINK 基础设施的理解也很到位。它的问题在于形态：几乎给每个组件都配了新短代码、一长串参数和一个运行时。合计起来是 7 个新短代码、约一百个参数、字段与配置键、3 个新运行时 chunk，以及 16 个语言键。最终设计只有一个新短代码、约 35 个参数与键（大多是已有的 figure 与围栏属性）、一个小 chunk 加一个随主题内置引擎，以及五个语言键。已接受的 [Markdown 优先决策](/zh/docs/design/decisions/authoring/#consequences)要求提案先说明为什么 Markdown 加已有钩子不够用。逐个组件套用这项检验后，大部分接口都被去掉了：

| 草案要素 | 最终决定 | 主要理由 |
| --- | --- | --- |
| `timeline` + `event` 短代码、`.timeline` 列表标记 | 只保留定义列表加 `{.timeline}` | 时间轴由标记与事件两两配对组成，Markdown 本来就有配对结构 |
| 带七个参数和粘性侧栏的 `{{%/* update */%}}` | 带 `date` 与 `tags` 的 `.update` 标题标记 | 标题已经承载大纲、锚点、搜索与 Print ID；侧栏与 TOC 重复 |
| 带互动指标、认证徽章、图片列表、引用参数、数据文件和作者注册表的 `x` | 带六个参数和 Markdown 正文的 `social` | 图片、画廊与引用帖子都能由已有语法组合而成；数据快照会过时 |
| 约二十个参数的 `video` 短代码 | 视频文件与平台 URL 使用图片语法 | 图片钩子已经负责资源解析、caption、编号与媒体降级；它目前会丢弃 `.mp4` |
| 带章节、倍速、互斥播放和文字稿正文的 `audio` 短代码 | 图片语法；文字稿使用折叠提示块 | 原生控件已覆盖播放；章节与互斥播放等有证据再说 |
| `map` 围栏加单点短代码、命名样式、默认 CARTO | 一个围栏；不设默认瓦片服务商 | 只保留一种形态；主题不应替所有站点选定商业瓦片服务 |
| 新增 `file-resolve.html`，照搬图片的查找顺序 | 抽出现有查找逻辑并共享 | 只有一套查找顺序，而不是两套 |

评审还发现了两个不做探针就无从得知的事实：

- 用接受正文的短代码覆盖 Hugo 内置的 `x`，会让旧式未闭合写法 `{{</* x user="…" id="…" */>}}` 直接导致构建失败（`shortcode "x" must be closed or self-closed`，Hugo 0.170.1）。模板告警没有机会先执行。负责人随后把组件改名为 `social`，Hugo 的 `x` 因此不受影响。见[社交帖子](/zh/docs/design/proposals/component-social/#hugo-x)。
- `Image.Exif` 已在 Hugo 0.155 中移除。只有站点的 `imaging.meta.fields` 包含 GPS 时，`Image.Meta` 才返回 GPS 坐标，而 Hugo 默认不包含。因此，根据照片自动添加地图标记需要站点级显式启用。见 [Map](/zh/docs/design/proposals/component-map/#exif)。

## 证据 {#evidence}

| 探针或调研 | 结果 | 用于 |
| --- | --- | --- |
| 定义列表后接 `{.timeline}` | Goldmark 输出 `<dl class="timeline">`；一个定义可以包含多个段落 | Timeline |
| 带 `{.update date="2026-11-23" tags="Breaking, Performance"}` 的标题 | `render-heading` 收到 `class`、`date` 与 `tags`；TOC 只显示标题文字 | Update |
| 页面包中的 `![Install demo](demo.mp4)` 与 `![Episode](ep.mp3)` | 图片钩子收到 `IsBlock`、属性，以及类型为 `video/mp4` 与 `audio/mpeg` 的资源 | Video、Audio |
| 当前的 `content/image-resolve.html` | 非图片资源告警并被丢弃 | Video、Audio |
| 输出 Markdown 标题的百分号短代码 | 该标题进入 `.TableOfContents` | Update 的备选方案 |
| 被接受正文的模板覆盖的内置 `x` | 未闭合的旧式调用无法解析 | 社交帖子（改名的依据） |
| 对带 GPS EXIF 的 JPEG 调用 `Image.Meta` | 只有在 `imaging.meta.fields` 中启用 GPS 字段后才返回坐标 | Map |
| npm 上的 Leaflet，2026-11-27 | `latest` 为 1.9.4；2.0 处于 beta 阶段（beta.5，2026-11-19） | Map |
| `~/www` 与 `~/pgsty` 下消费站点的 Markdown | 没有使用 Hugo 的 `x`、`tweet`、`youtube` 或 `vimeo` 短代码；两个博客中有原始 Bilibili `<iframe>` 嵌入；有原始 `<video>`；用 `autoplay loop muted` 视频代替 GIF，却指向会过期的签名 URL | 社交帖子、Video |

这些探针运行在一个采用 OINK 必需 Goldmark 设置的最小 Hugo 站点上，证实的是 Hugo 的行为，而不是 OINK 的输出。每个实现阶段都会把它们重新做成夹具。

## 共享设计规则 {#shared-rules}

### 创作入口 {#entry-points}

每个组件要么使用已有入口，要么使用一个理由充分、范围很窄的新入口：

| 入口 | 现状 | 新增 |
| --- | --- | --- |
| 列表上的 Goldmark 块属性 | `.steps`、`.cards`、`.filetree` | 定义列表上的 `.timeline` |
| 标题渲染钩子 | `id`、class 透传 | 带 `date` 与 `tags` 的 `.update` |
| 图片渲染钩子 | 图片、figure、Book 编号、图片缩放、Draw.io 候选 | 视频文件、音频文件、可识别的视频平台 URL |
| 数据围栏 | `gallery`、`filetree`、`echarts`、… | `map` |
| 带 Markdown 正文的尖括号短代码 | `card`、`tab`、`field`、… | `social` |

没有组件新增百分号分隔的短代码，`steps` 仍是唯一一个。

### 资源查找 {#resource-lookup}

视频、音频、海报图、字幕轨、帖子头像和地图缩略图，都需要 `content/image-resolve.html` 目前执行的那套查找：页面包、分支包、全局 `assets/`，然后是 `static/` 或显式的 HTTP(S) URL。实现会把这段查找抽成一个 partial，由图片解析器和媒体解析器共同调用。图片解析器保留只适用于图片的规则（图片处理、alt 元数据、署名行）。重构前后图片输出必须逐字节一致，由现有 golden 证明。

构建期从不抓取远程 URL。与现在的图片一样，使用远程媒体 URL 是作者的显式选择。

### 网络策略 {#network-policy}

[架构契约](/zh/docs/design/architecture/#configuration-and-diagnostics)要求具备联网能力的功能必须显式且完整地配置。六个组件中有两个具备这类功能：

| 功能 | 默认 | 启用方式 | 配置不完整时 |
| --- | --- | --- | --- |
| 视频平台播放器 | 静态链接卡片；不发出第三方请求 | `params.video_embeds: [youtube, bilibili, vimeo]`（任意子集） | 未知名称告警并被忽略 |
| 地图瓦片 | 带坐标链接的地点列表 | `params.map.enable` 加 `tiles` 与 `attribution` | 告警并保持关闭，与 Draw.io 未配置服务器时一样 |

两项功能都没有由主题选定的默认服务商。Timeline、Update、社交帖子以及本地或对象存储中的媒体都无需配置。

### 运行时预算 {#runtime-budget}

| 组件 | HTML 运行时 | 加载条件 |
| --- | --- | --- |
| Timeline、Update、社交帖子、Audio | 无 | — |
| 视频文件 | 无 | 默认 |
| 视频 `autoplay=true` | `js/chunks/media.js`（约 2 KB） | 页面中有自动播放视频 |
| 视频平台播放器 | 同一个 chunk | 页面中有已启用服务商的卡片 |
| Map | `content-components.js` 适配器，加随主题内置的 Leaflet 及其 CSS | `params.map` 配置完整，且页面中有地图 |

Markdown、Print 与 RSS 不设置其中任何标志。

### 样式、无障碍与语言文件 {#styles-and-locales}

新规则写在 `assets/css/td/` 下的纯 CSS 层文件中，在 `layouts/_partials/css/layers.html` 里排在 `rtl`、各预设、`accessibility` 与 `print` 之前。它们使用 `--td-*` token、逻辑属性和预设几何（Ink 与 Terminal 的平面表面），并覆盖强制颜色、减少动态效果、窄屏、长 token 与打印。作者标记（`.timeline`、`.update`）保持无前缀，生成的 class 使用 `td-`。

六个组件合计新增五个语言键（社交帖子一个，Video 两个，Map 两个，其缩放按钮复用图表的现有键），已加入全部 32 个语言文件并提供母语翻译，由 `bin/check-i18n.py` 检查。

## 对第一版草案问题的答复 {#draft-questions}

| 问题 | 答复 |
| --- | --- |
| `params.map.enable` 为 true 时的默认瓦片 | 没有。与 Draw.io 一样，设置 `tiles` 与 `attribution` 之前地图保持关闭（[Map](/zh/docs/design/proposals/component-map/#configuration)） |
| 一条更新同时有 label 与 title 时的 TOC 文字 | 使用标题文字；不再有单独的 label 或 title（[Update](/zh/docs/design/proposals/component-update/#authoring)） |
| 何时从照片中提取 GPS 坐标 | 排在显式坐标之后的某个后续阶段，作为站点级 `imaging.meta` 显式启用项（[Map](/zh/docs/design/proposals/component-map/#exif)） |
| Bilibili 弹幕层 | 关闭（`danmaku=0`），S4 不提供开关（[Video](/zh/docs/design/proposals/component-video/#platforms)） |
| 视频与地图的 Book 编号 | 视频作为 figure 原生接受 `num`；地图与其他图表围栏一样包在 `fig` 中；音频不编号（[Audio](/zh/docs/design/proposals/component-audio/#attributes)） |

## 交付顺序 {#delivery}

| 阶段 | 范围 | 排在此处的理由 |
| --- | --- | --- |
| S1 | Timeline 与 Update | CSS 加一个标题钩子分支；没有运行时，也无需配置 |
| S2 | 视频与音频文件、抽取共享查找、用于自动播放的 `media.js` | 实际使用最多；取代原始 `<video>` 与 GIF |
| S3 | 社交帖子 | 一个短代码、一个语言键 |
| S4 | 视频平台卡片与显式启用的播放器（`params.video_embeds`） | 涉及第三方 iframe；需要 CSP 与隐私评审 |
| S5 | Map：随主题内置的 Leaflet、`params.map`、围栏 | 唯一新增的随主题内置引擎 |
| 以后 | 根据 GPS 元数据为照片添加地图标记；音频章节与同时只播放一个音频；`oink fetch social` | 各自等待自己的证据 |

每个阶段交付时都附带 `tests/site/` 下的夹具、有意的 golden 更新、`/docs/components/` 下的中英文指南、契约更新，以及在本站进行的浏览器审阅。各阶段相互独立，放弃后面的阶段无须返工前面的阶段。

## 待决问题 {#open-decisions}

1. **接受与发布。** 六个组件一次性纳入下一个版本，还是按阶段逐个接受。接受后，行为转入契约（契约中已起草），本组提案随之退役。
2. **演示媒体是否入 Git。** 指南中的视频与音频演示为本站仓库增加约 600 KB 二进制文件。可以留在页面包中，也可以移到对象存储，以 HTTPS URL 引用，媒体形态本身支持这种写法。

## 决策日志 {#decision-log}

- **2026-11-27（第一版草案）。** 在一个页面中写出六个组件的需求与架构：`timeline`/`event`、`{{%/* update */%}}`、带 `platform` 枚举的离线 `x`、`audio`、`video`，以及显式启用的 OpenStreetMap `map`。
- **2026-11-27（评审）。** 拆分为六项提案加本概览页。把公共接口缩减为一个短代码（`x`）、一个围栏（`map`），以及图片与标题钩子中的分支。记录了上文的探针证据、`x` 解析问题、EXIF 配置要求和路线图冲突。
- **2026-11-27（负责人）。** 把离线帖子组件改名为 `social`，不再与 Hugo 的 `x` 冲突。删去主题路线图中“不再新增组件家族”的表述，它从来不是负责人的决定；本页的路线图冲突一节随之删除。
- **2026-11-27（实现）。** 六个组件都已在主题 main 分支的工作区中实现，附带夹具、golden、无效输入用例和运行时单元测试，主题完整检查全部通过；本站补齐了指南与演示。与草案的差异记录在各组件提案的决策日志中。
