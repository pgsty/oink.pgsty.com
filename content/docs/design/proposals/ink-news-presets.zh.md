---
title: Ink 与 News：写本与印本
linkTitle: Ink 与 News
description: 把 Ink 定为书写风格、News 定为出版风格的设计提案，已部分实现，包含字体覆盖、亮暗两套色板、细节规格与验收门禁。
weight: 65
icon: fa-solid fa-feather-pointed
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-11-28
---

> [!NOTE] 已随 OINK v1.8.0 发布（2026-11-28）
> 本提案的主体已随 OINK v1.8.0 实现并发布；有三项保持开放，见[实现记录](#implementation-record)。
> 当前行为以[架构契约](/zh/docs/design/architecture/#visual-presets)与
> [视觉预设决策](/zh/docs/design/decisions/visual-presets/)为准。

## 状态与影响面 {#status}

**状态与日期**：2026-11-28 起草，主体随 OINK v1.8.0 实现并发布

**负责人**：OINK 维护者

**基线**：OINK v1.7.0 加上 v1.8.0 的预设调整：`newsprint` 更名为 `news`；菜单排成
Paper、Slate、GitHub 在上，Ink、News、Terminal 在下；深色 Terminal 改为荧光屏；Ink 改为
楷体标题、宋体正文、Palatino 西文。这些调整记录在
[视觉预设决策](/zh/docs/design/decisions/visual-presets/)中。

**受影响契约**：[架构 · 视觉预设](/zh/docs/design/architecture/#visual-presets)、
[视觉预设决策](/zh/docs/design/decisions/visual-presets/)

**受影响实现**：`assets/css/td/tokens-typography.css`、`assets/css/td/brand.css`
（本地字体别名）、`assets/css/td/experimental-presets.css`、`assets/css/td/print.css`、
`layouts/_partials/_funcs/preset-canvases.html`、`assets/css/giscus-ink-*.css`、
`assets/css/giscus-news-*.css`、`bin/check-presets.py`

**版本意向**：OINK v1.8.0；两套预设继续保持显式启用

## 背景与证据 {#context}

六套预设中，四套的定位已经确定：Paper 是默认的暖色纸面，Slate 是 OINK 1.1 以来的技术
风格，GitHub 还原 GitHub 渲染 README 的样子，Terminal 是终端（浅色是工程手册，深色是
荧光屏）。剩下的 Ink 和 News 都和“纸”与“衬线”有关，容易混在一起。

- **Ink**：1.7.0 中是白底、黑字、红色强调的无衬线编辑风格，观感接近 Hextra 一类现代
  文档主题，和 Paper、GitHub 区分不足。工作区草案已把它改为笔墨书写。
- **News**：即 1.7.0 的象牙色 Paper，参照 Typora 的 Newsprint 主题。它的衬线正文、宋体、
  楷体引文和象牙纸色，与笔墨方向的 Ink 大面积重叠。草案中的深色 News 是“烛光夜报”：
  暖褐底、羊皮纸色文字、金色链接，又用到了 Ink 想要的羊皮纸与金色。

本提案在两者之间划一条线：**Ink 是写出来的，News 是印出来的。**

### 字体覆盖 {#font-coverage}

主题不分发字体文件，只能引用读者已经安装的字体。各平台预装了哪些字体，决定了多少读者
能看到设计稿的样子。下表依据 Microsoft、Apple、AOSP、Ubuntu 与 Fedora 的官方字体清单
整理（2026-11-28）：“随中文”指添加中文语言时 Windows 自动安装的“中文（简体）补充
字体”；“按需”指需要下载，macOS 上可能在系统语言为中文时自动下载，Apple 没有说明。

| 字体类别 | Windows 中文 | Windows 英文 | macOS | iOS / iPadOS | Android | Linux 桌面 |
| --- | --- | --- | --- | --- | --- | --- |
| 黑体 | 微软雅黑 | 微软雅黑 | 冬青黑体、华文黑体（苹方自 macOS 15 起为按需） | 苹方（按需） | Noto Sans CJK | Noto Sans CJK |
| 宋体 | 宋体 | 宋体 | 宋体-简（预装） | 宋体-简（按需） | Noto Serif CJK，只作为 `serif` 回退 | Noto Serif CJK |
| 仿宋 | 仿宋 | 无（随中文） | 华文仿宋（按需） | 按需 | 无 | 无 |
| 楷体 | 楷体 | 无（随中文） | 楷体-简（按需） | 按需 | 无 | Ubuntu 中文安装带 AR PL UKai |
| Palatino | Palatino Linotype | Palatino Linotype | Palatino | Palatino | 无 | URW P052 |
| 书写体 | Gabriola、Segoe Script | 同左 | Apple Chancery、Zapfino、Snell Roundhand | Zapfino、Snell Roundhand（Apple Chancery 按需） | Dancing Script，只作为 `cursive` | URW Z003 |
| 报纸衬线 | Times New Roman、Georgia | 同左 | Times New Roman、Georgia、Charter、Didot | Times New Roman、Georgia、Charter、Didot | Noto Serif | Liberation Serif |

由此得出三点：

1. **没有一款中文字体在所有平台都存在。** 按类别看，只有黑体处处都有；宋体除 iOS 外基本
   都有。iOS 上的中文衬线大概率回落到苹方，这一点尚未核实。
2. **仿宋和楷体的覆盖完全相同。** 中文 Windows 都有，macOS 需要读者自己下载，手机和多数
   Linux 没有。因此“默认仿宋、回落宋体”在技术上成立，但只在中文 Windows 和下载过字体的
   Mac 上能看到仿宋，其余读者看到的都是宋体。
3. **按名称查找和 `local()` 的结果不同。** 2026-11-28 在一台已下载楷体的 Mac 上测得：
   WebKit 按 `font-family: "Kaiti SC"` 查不到楷体，Chromium 查得到；通过 `@font-face` 的
   `local("Kaiti SC")` 起别名，两者都能命中。主题的 `OINK Kai` 已经采用后一种写法，仿宋
   应照此办理。

## 目标与非目标 {#goals}

**目标**

- Ink 和 News 无论在亮色还是暗色、中文还是西文页面上，都能一眼分开。
- 两者各有一套暗色。暗色只改颜色和少量细节，不改字体。
- 六套暗色互不相撞：Slate 与 GitHub 已占蓝黑，Paper 占暖灰，Terminal 占磷光绿。
- 楷体、仿宋缺失时，两者依然能区分开，不能只靠字体撑住风格。

**非目标**

- 不分发任何字体文件，不加图片资源，不加运行时脚本。
- 不做竖排、水墨晕染背景、祥云纹样、毛笔字图片或印章图片。
- 不改 Paper、Slate、GitHub、Terminal 的现有设计。
- 不改配置键名：`ink` 与 `news` 保持不变。

## 区分原则 {#distinction}

| 维度 | Ink · 写本 | News · 印本 |
| --- | --- | --- |
| 隐喻 | 一个人用一支笔写成的卷子：熟宣或羊皮纸 | 机器按栏排出的版面：新闻纸与油墨 |
| 节奏 | 疏：一栏到底，天头留白大 | 密：报头、眉题、副题、栏线 |
| 层级手段 | 换字形：楷体、意大利体、朱色首字，不加粗 | 加字重：粗标题、细副题、粗细双线 |
| 中文 | 楷体标题，仿宋正文（缺失时宋体），朱笔着重号 | 粗宋标题（Windows 回落粗黑），宋体正文，加粗强调 |
| 西文 | Palatino 正文与意大利体标题；书写体只用于大标题、首字和站名 | Charter / Georgia 正文，Times New Roman 粗体标题，Didot 报头 |
| 颜色 | 纸色加两种墨：墨与朱 | 新闻纸灰加油墨黑，外加一种专色蓝 |
| 当前位置 | 朱色圆点 | 黑色栏线加粗体 |
| 暗色 | 绀纸金字 | 暗房 |

楷体和仿宋都缺失时，Ink 的中文退成宋体，和 News 用的是同一类字体。这时仍有四处差别：
Ink 标题用常规字重、字距疏朗，News 标题用最粗的字重、字距收紧；Ink 用朱色着重号，News
用加粗；Ink 是纸色加径向渐变，News 是平整的灰色新闻纸；Ink 没有规线，News 处处是规线。

## Ink：写本 {#ink}

### 字体 {#ink-type}

| 角色 | 中文 | 西文 | 说明 |
| --- | --- | --- | --- |
| 展示（页面标题、Landing 大标题） | `OINK Kai` | Apple Chancery → Gabriola → URW Z003 → Palatino 意大利体 | 书写体只用于大字号；不用通用族 `cursive`，Windows 上的 Chrome 会把它解析成 Comic Sans |
| 标题（h2–h4） | `OINK Kai` | Palatino 意大利体 | 意大利体是 Zapf 依据文艺复兴书写体设计的 |
| 正文 | `OINK Fangsong` → 宋体 | Palatino → Palatino Linotype → URW P052 → TeX Gyre Pagella | 仿宋放大 8%，只作用于汉字 |
| 引用 | `OINK Kai` | Palatino 意大利体 | 沿用共享引用角色 |
| 界面（导航、搜索、菜单） | 平台黑体 | 平台无衬线 | 宋体、楷体在控件字号下发虚 |
| 代码 | 共享等宽 | 共享等宽 | 不变 |

- **新增 `OINK Fangsong` 别名。** 写法与 `OINK Kai` 相同：`local()` 依次引用华文仿宋和
  Windows 仿宋，`unicode-range` 只覆盖汉字与全角标点，`size-adjust: 108%` 弥补仿宋偏细
  偏小。两款仿宋都只有常规字重，强调不用加粗（见下文着重号）。
- **楷体标题用常规字重。** 只有 macOS 的楷体-简带真粗体，Windows 楷体没有，合成粗体
  很难看。标题层级靠字号和留白区分。
- **不用 Papyrus。** 它是公认被用滥的“古风”字体，而且 Windows、Android、Linux 都没有。
  如果想要更粗犷的效果，macOS 上的 Luminari、Trattatello 可以作为展示字体的备选，但不进入
  默认字体栈。

### 颜色 {#ink-color}

亮色名为“熟宣与朱墨”，用写本的两种墨：黑墨写字，朱墨圈点。

| Token | 值 | 对最暗边缘色 `#e8dabd` 的对比度 |
| --- | --- | --- |
| 纸（画布） | `#f3ead7` | — |
| 纸边（径向渐变终点） | `#e8dabd` | — |
| 代码底 | `#e9dcc1` | — |
| 墨（正文） | `#241a10` | 12.35:1 |
| 淡墨（次要文字） | `#574634` | 6.52:1 |
| 清墨（辅助文字） | `#6e5c47` | 4.63:1 |
| 朱（强调色） | `#a8321b` | 4.84:1 |
| 印（站名印章底色） | `#b8371d`，印内文字用纸色 | 4.88:1 |

链接沿用正文墨色，用朱色下划线标出，悬停时变朱色。

### 细节 {#ink-details}

- **朱点**：导航当前项前加一个朱色圆点，代替背景色块。
- **着重号**：中文 `strong` 不加粗，改用 `text-emphasis: filled dot` 在字下加朱色圆点，
  这是中文原有的强调方式，只作用于 `:lang(zh)`。代价是同一个 `strong` 里的西文字母下也会
  出现圆点。
- **首字**：正文首段的首字母用书写体放大三行、朱色，只用于 Blog 与 Book 正文，Docs 不用。
  浮动方向用逻辑属性，RTL 页面随之翻转。
- **印章**：站名可选加朱色方框，像钤印。这一项最容易显得俗，默认关闭还是开启待定。
- **纸张**：画布上叠一层径向渐变，中央是纸色，边缘略深。不加噪点图片；打印时去掉。
- **天头**：页面标题上方留白加大。
- **红色只用在小处**：圆点、着重号、首字、印章、下划线。标题不用红色，否则仿宋正文配红色
  标题就成了红头公文。

工作区草案中已有的笔触细节（节首收锋笔触、`hr` 短画、引用旁渐淡的朱砂笔触）与上述细节
方向一致，可以保留。

### 暗色：绀纸金字 {#ink-dark}

取自泥金写经：在深青透紫的绀纸上，用金、银两色书写。东亚有绀纸金字经，欧洲有紫色羊皮纸
上的金字抄本，两地各自走到了同一种做法，所以这套色板对中文和西文页面同样成立。

| Token | 值 | 对最暗边缘色 `#120f22` 的对比度 |
| --- | --- | --- |
| 绀纸（画布） | `#1b1730` | — |
| 纸边 | `#120f22` | — |
| 代码底 | `#241f3d` | — |
| 泥银（正文） | `#e3ddd0` | 13.89:1 |
| 泥金（标题与强调色） | `#dcb766` | 9.85:1 |
| 次要文字 | `#b4ad9f` | 8.43:1 |
| 辅助文字 | `#958e82` | 5.79:1 |
| 印（亮化） | `#e06a4c`，印内文字用绀纸色 | 5.23:1 |

首字、着重号、当前位置圆点都改用泥金；印章仍是红色，写经上的收藏印本来就是红的。

草案中的深色 Ink 是“碑拓”：青黑底、宣纸色字、朱砂印。它和书法的关系更直接（学书法就是
临碑帖），但色板接近通用暗色，和 Paper 深色的暖灰（`#161513`）难以区分。本提案建议改用
绀纸金字，碑拓留作备选。

## News：印本 {#news}

### 字体 {#news-type}

| 角色 | 中文 | 西文 | 说明 |
| --- | --- | --- | --- |
| 报头（站名） | 宋体粗体 | Didot → Bodoni 72 → Times New Roman | 仅 macOS 有 Didot |
| 标题 | 宋体-简 Black / Bold → 微软雅黑粗体 | Times New Roman 粗体 | Times 原本就是为《泰晤士报》设计的 |
| 正文 | 宋体 | Charter → Iowan Old Style → Georgia → Cambria | 沿用现有字体栈 |
| 眉题、署名、表头、界面 | 平台黑体 | 平台无衬线，大写加字距 | 报纸用无衬线排栏目标签和日期 |
| 引用 | `OINK Kai` | 衬线意大利体 | 沿用现有设定 |

副题（页面描述）在西文中用意大利体；汉字没有真正的斜体，中文副题保持直立。

### 颜色 {#news-color}

亮色名为“新闻纸”：灰白新闻纸、黑色油墨，只有一种专色。

| Token | 值 | 对代码底 `#e6e3da` 的对比度 |
| --- | --- | --- |
| 新闻纸（画布） | `#f0eee8` | — |
| 代码底 | `#e6e3da` | — |
| 油墨（正文） | `#161616` | 14.10:1 |
| 次要文字 | `#4a4844` | 7.11:1 |
| 辅助文字 | `#625f59` | 4.96:1 |
| 专色蓝（链接与强调色） | `#1f4f7a` | 6.66:1 |

现有 News 的陶土色强调（`#9b4a28`）与 Ink 的朱色都是红褐色，两者并排时难以区分，因此改为
单一专色蓝。新闻纸比 Paper 的 `#f7f6f3` 更灰、更暗，与 Ink 偏黄的纸色也拉开距离。

### 细节 {#news-details}

- **报头**：站点页头下缘一道双线。样张中线间的日期与版本号需要新增标记，暂不实现。
- **眉题、副题与署名**：栏目名作眉题，放在标题上方，用专色、大写；页面描述作副题，放在
  标题下方；署名与日期夹在两道细线之间。现有标记中有副题（`.lead`）与日期线
  （`.td-article-info`），没有眉题，眉题需要新增标记，暂不实现。
- **粗细双线**：h2 上方加一道粗线和一道细线，代替 Ink 的笔触。
- **拉引**：引用上方一道粗线、下方一道细线，字号放大一级，左侧不加竖线。文档中的引用
  常有多段，居中会损害可读性，因此保持起始对齐。
- **栏线**：Blog 列表和章节索引在宽屏上分栏，加 `column-rule`；正文保持单栏，因为代码块
  不适合分栏。Blog 列表在运行时于卡片、表格、画廊三种形态之间切换，分栏暂不实现。
- **表格**：上下各一道墨线，数字用等宽数字，表头大写。
- **当前位置**：导航当前项左侧加黑色栏线并加粗，不用颜色。
- **不做首字下沉**：首字归 Ink 所有。

### 暗色：暗房 {#news-dark}

报社冲洗新闻照片的暗房：纯黑、银盐照片的灰、安全灯的橙光。

| Token | 值 | 对代码底 `#1a1a1a` 的对比度 |
| --- | --- | --- |
| 底 | `#0f0f0f` | — |
| 代码底 | `#1a1a1a` | — |
| 银盐（正文） | `#d8d6d1` | 11.98:1 |
| 标题 | `#f3f1ec` | 15.42:1 |
| 次要文字 | `#a4a19a` | 6.75:1 |
| 辅助文字 | `#8a877f` | 4.85:1 |
| 安全灯橙（链接与强调色） | `#f2804a` | 6.60:1 |

页面右上角加一层很淡的橙色径向光晕（不透明度 7%），只在屏幕上显示。安全灯橙的色相比 Ink
深色的泥金偏红约 20°，饱和度也更高，两者并排也能分开。

草案中的“烛光夜报”用了暖褐底、羊皮纸色字和金色链接，而羊皮纸与金色在本提案中归 Ink。
它的暖褐底也接近 Paper 深色。因此建议改用暗房；如果更想保留单色气质，可以选“微缩胶片”
作为备选：中性黑底、银灰字，以专色蓝提亮作链接。

## 六套暗色 {#dark-lineup}

| 预设 | 画布 | 正文 | 强调色 | 意象 |
| --- | --- | --- | --- | --- |
| Paper | `#161513` | `#ece9e3` | `#7db5e6` | 暖灰 |
| Slate | `#0b1119` | `#e8eef6` | `#5da2dd` | 冷蓝黑 |
| GitHub | `#0d1117` | `#f0f6fc` | `#4493f8` | Primer 暗色 |
| Ink（提议） | `#1b1730` | `#e3ddd0` | `#dcb766` | 绀纸金字 |
| News（提议） | `#0f0f0f` | `#d8d6d1` | `#f2804a` | 暗房 |
| Terminal | `#020703` | `#7ee89a` | `#3dff7a` | 荧光屏 |

## 其他文字 {#other-scripts}

Ink 的“书写”原则也适用于其他文字：每种文字的展示与标题角色找一款本地已安装的书法或手写
传统字体，正文用该文字的书籍字体；找不到时退回书籍字体，不强求。日文和韩文原本需要
`:lang(ja)`、`:lang(ko)` 单独的字体栈，否则汉字会按中文字形显示；但预设的字体角色只能
写在根元素的裸选择器上，`typography: system` 与 `params.ui.fonts` 才能覆盖它们，所以这
一项没有实现，日文与韩文沿用主题现有的处理。阿拉伯文与希伯来文的书写体按字形回退进入
标题字体栈，波斯文因此也使用三一体，而不是波斯体。

| 文字 | 展示与标题 | 正文 |
| --- | --- | --- |
| 日文 | 教科书体（Windows UD Digi Kyokasho；macOS 按需） | 明朝体 |
| 韩文 | 宫书体（Windows Gungsuh；macOS 按需） | 明朝体（Myeongjo / Batang） |
| 阿拉伯文 | 三一体（macOS Diwan Thuluth） | 纳斯赫体 |
| 波斯文 | 波斯体（Noto Nastaliq Urdu，macOS 预装） | 纳斯赫体 |
| 希伯来文 | Corsiva Hebrew（macOS） | 系统希伯来衬线 |
| 西里尔文 | Palatino 意大利体（书写体不含西里尔字母） | Palatino |
| 天城文、孟加拉文 | 无合适的书写体，用正文字体 | 系统字体 |

News 不需要按文字区分：每种文字都用各自的书籍衬线字体和粗体标题。

## 输出、无障碍与安全 {#boundaries}

- **对比度**：所有文字色按画布最暗处计算，即径向渐变的终点色，而不是中央的纸色。
  `check-presets.py` 需要把渐变终点纳入 AA 检查。
- **打印**：纸张渐变、光晕、首字颜色和印章都去掉；打印沿用各预设现有的打印色板。
- **强制颜色**：渐变、着重号颜色、栏线颜色交给系统颜色；着重号本身保留。
- **RTL**：首字浮动和导航圆点使用逻辑属性。
- **Markdown、LLMS 与 RSS**：不受影响，它们不带预设样式。
- **网络与资源**：不新增字体文件、图片或外部请求；`local()` 别名只在读者已安装时生效。

## 兼容与迁移 {#compatibility}

- `ink` 已随 1.7.0 发布。使用 `preset: ink` 或在菜单中列出 `ink` 的站点，外观会明显改变。
  它是显式启用的实验预设，可以接受，但 `CHANGELOG.md` 需要写明。
- `news` 尚未发布，调整它没有兼容成本。
- 保留名 `folio` 原本预留给衬线书籍风格，与本提案的 Ink、News 有重叠。是否继续保留由
  维护者决定。
- 两套预设的 giscus 色板（`giscus-ink-*.css`、`giscus-news-*.css`）需要随色板一起更新。

## 实现与检查器计划 {#implementation}

1. 在 `brand.css` 中新增 `OINK Fangsong` 别名，`tokens-typography.css` 中按上表改写 Ink 与
   News 的字体角色。
2. 在 `experimental-presets.css` 中改写 Ink 与 News 的亮暗色板及细节；同步
   `preset-canvases.html` 的画布与墨色。
3. 在 `print.css` 中去掉纸张效果。
4. 更新四个 giscus 色板。
5. 在 `check-presets.py` 中加入渐变终点的 AA 检查与新色板的 token 一致性检查。
6. 在文档站中审查 Ink、News 的中英文、桌面与手机、亮色与暗色，并检查 Windows 上无楷体、
   无仿宋时的回落效果。

## 验收标准 {#acceptance}

- 在同一明暗模式下，把六套预设的截图并排，评审者能分辨出每一套，且不需要读标签。
- 在无楷体、无仿宋的环境中（如 iOS 或英文 Windows），Ink 与 News 的中文页面仍能分辨出来。
- 所有文字色在画布最暗处达到 WCAG AA，正文达到 4.5:1。
- 打印预览中没有渐变、光晕或印章。
- `check-presets.py`、`check-stylesheets.py` 通过，文档站 `make check` 与 `make browser`
  通过。

## 实现记录 {#implementation-record}

2026-11-28 按本提案修改主题，待决问题按提案的倾向落定：正文用仿宋；印章默认开启，
只作用于站点页头的文字字标（Docs、Book、Blog 外壳的侧栏品牌区不受影响）；首字只用于
Blog 与 Book；暗色选绀纸金字与暗房；News 去掉陶土色。实现与设计稿的出入：

- 展示字体栈加入 Linux 的 URW Z003。
- 日文与韩文的分语言字体栈、News 的眉题、报头线间的日期与版本号、Blog 列表分栏没有
  实现，原因见上文各节。
- 拉引保持起始对齐，不居中。
- 菜单图标随预设改色：Ink 为朱色、深色为泥金；News 为专色蓝、深色为安全灯橙。
- 同晚维护者审阅后做了校准：Ink 去掉书写体展示字与印章，西文处处用 Palatino，汉字在
  标题与界面中用楷体；News 的界面、菜单与列表改用正文衬线字体，界面部件改为直角。
  上文的展示字体表与印章细节因此不再适用。

主题侧的 `check-presets.py`、`check-font-tokens.py`、`check-stylesheets.py`、
`check-goldens.py` 等检查器通过；文档站构建当时因 Social 组件的并行改动失败，文档站检查
待其完成后再跑。

## 待决问题 {#open-questions}

1. `folio` 是否继续保留？

## 决策记录 {#decision-log}

| 日期 | 变化 |
| --- | --- |
| 2026-11-28 | 起草。以“写本与印本”区分 Ink 与 News；提出 Ink 的仿宋正文与书写体展示字，以及绀纸金字、暗房两套暗色。设计样张在仓库外制作，未纳入文档站 |
| 2026-11-28 | 依据 Microsoft、Apple、AOSP、Ubuntu 与 Fedora 的官方字体清单更正字体覆盖表 |
| 2026-11-28 | 在主题中部分实现，见[实现记录](#implementation-record) |
| 2026-11-28 | 审阅后校准：去掉书写体展示字与印章，Ink 与 News 的界面字体与正文统一 |
