---
title: 视觉预设与外观切换
linkTitle: 视觉预设
description: Paper 与 Slate 已在本地实现；Ink 与 Terminal 提供显式开启的实验，等待视觉定稿。
weight: 40
icon: fa-solid fa-swatchbook
search_keywords:
  [视觉预设, 主题预设, Paper, Slate, Ink, Terminal, 外观菜单, 深色模式, 字体, IBM Plex Sans]
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-10-04
---

> [!IMPORTANT] 第一阶段已在本地实现，Ink/Terminal 实验现已可用
> Paper、Slate 与外观菜单已在本地未发布主题中实现。当前行为与证据由
> [架构契约](/zh/docs/design/architecture/#visual-presets)、
> [已接受决策](/zh/docs/design/decisions/visual-presets/)和
> [验收记录](/zh/docs/design/research/2026-10-05-visual-presets-acceptance/)管理。
> 随后的 [Ink/Terminal 实验](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/)提供真实可切换输出；本提案继续承载两者的设计定稿。10 月 4 日注入样式生成的截图仍是研究原型，
> 与 10 月 5 日真实主题输出截图分开看待。

## 状态与影响面 {#status-and-surface}

| 字段 | 值 |
| --- | --- |
| 状态 | 第一阶段本地实现；Ink/Terminal 显式实验 |
| 负责人 | OINK 维护者 |
| 日期 | 2026-10-04 |
| 基线 | 主题 `main`（`v1.1.0` 之后，含未发布的 `1.2.0` 工作）；文档站固定 `v1.1.0` |
| 受影响契约 | [架构：信任、CSS 与无障碍](/zh/docs/design/architecture/#trust-css-and-accessibility)（字体角色、强调色角色、行内代码颜色）、[外壳](/zh/docs/design/shell/)（主题控件）、[Landing](/zh/docs/design/landing/)、[配置决策](/zh/docs/design/decisions/configuration/)、[品牌指南](/zh/docs/customize/brand/) |
| 第一阶段 | Paper 预设、Slate 预设、默认改为 Paper、读者在 Paper 与 Slate 间切换 |
| 后续阶段 | Ink/Terminal 视觉定稿；Folio 与 Canvas 只保留名称 |

## 背景与依据 {#context-and-evidence}

以下基线与限制记录 10 月 4 日实施前的研究输入。

OINK 目前只有一套视觉，本文称为 **Slate**：冷灰蓝画布（`#f1f4f8` / `#0b1119`）、
海军蓝文字、钢蓝链接（`#245f94`）、铜色点缀；Inter 用于界面与正文，Chakra Petch
用于展示标题与字标，IBM Plex Mono 用于代码与技术标注；Landing 首屏有蓝图网格与
光晕；行内代码为一组深红色。它由 `assets/scss/td/_brand.scss` 的 Bootstrap 自定义
属性、`assets/scss/td/shell/_tokens.scss` 的外壳 token，以及
`assets/scss/td/_tokens-typography.scss` 的字体角色定义。

PG.CENTER 是独立站点，具有维护者希望成为 OINK 未来默认的暖色编辑式阅读风格。
其展示层 token 位于该项目的 `media/css/pgsql.css`。在本地预览上测量
（2026-10-04，浅色与深色；首页、Docs 索引、长篇手册页、组件手册页）：

| 角色 | 浅色 | 深色 | 说明 |
| --- | --- | --- | --- |
| 画布 | `#f7f6f3` | `#161513` | 暖白 / 暖黑 |
| 抬升表面 | `#ffffff` | `#1d1c19` | 卡片、代码块 |
| 次级表面 | `#efede8` | `#262420` | 表头、悬停 |
| 墨色正文 | `#21201c` | `#ece9e3` | |
| 次级文字 | `#56534c` | `#b6b1a7` | |
| 线与淡底 | 墨色 4.5–22 % 透明度 | 浅墨色相近透明度 | 不使用带色相的灰 |
| 圆角 | 12 px / 8 px | 相同 | |
| 阴影 | `0 2px 10px rgba(33,32,28,.07)` | 以黑色为基 | 暖、柔 |
| 动效 | 160 ms `cubic-bezier(.2,.7,.2,1)` | 相同 | |

字体方面，IBM Plex Sans（可变字重 400–600）用于界面与正文；IBM Plex Mono 用于代码、
日期与版本；Chakra Petch 只用于字标。组件手册页是最好的长文样板：导语 17 px、
最宽 70ch；h2 后跟一条延伸到边缘的细线；带表头底色、无斑马纹的外框表格；
单色提示块加 3 px 竖线。

以下 PG.CENTER 元素属于站点身份，**不是可复用的阅读规则**：PostgreSQL 品牌蓝
`#336791` 系列、酒红正文链接、版本状态色、版本条、搜索类型徽标、Wiki 色调、
双色首屏，以及导入的 PostgreSQL 手册约 144 字符的行长。两个值不满足 WCAG AA
（弱化文字 3.67:1、链接悬停 4.22:1），下文予以修正而非照搬。

用于对照的 OINK 文档测量值：正文 16 px / 1.7、行长约 76ch、h1 36 px / 700、
h2 24 px / 600、代码 14 px。PG.CENTER Docs 索引：15.5 px / 1.7，约 120ch。

### 现有限制 {#current-limitations}

- 颜色只与 `data-bs-theme` 绑定，没有属性能选择第二套调色板；多个表面绕过
  token：Landing 主按钮（`#2f6793` 与海军蓝光晕）、网格、遮罩
  （`rgba(4,10,18,.45)`）、打印颜色、asciinema 表面与 giscus 样式表。
- 约 85 处字面圆角与若干字面阴影，使扁平预设在没有圆角与阴影尺度前无法实现。
- 明暗控件靠悬停或聚焦展开。触屏读者无法到达“跟随系统”；触发按钮混用
  `aria-pressed` 与 `aria-expanded`；Esc 不能关闭。Landing 手机抽屉没有主题控件。
- `contrast-on-canvas.html` 硬编码了 Slate 画布亮度，用于 `theme_color` 警告。
- `dark_mode` 默认 `false`，站点不开启就既没有深色调色板也没有菜单。

## 目标与非目标 {#goals-and-non-goals}

目标：

- 一个站点配置键选择默认视觉预设；默认改为 Paper；
- Slate 保留可选，选择它的站点得到与当前一致的输出；
- 读者可即时切换 Paper 与 Slate，无需刷新，并与浅色/深色/跟随系统彼此独立；
- 禁用 JavaScript 或存储不可用时，站点配置的默认风格照常呈现；
- 预设共享模板、组件与布局几何，只改变配色与字体；
- 只用本地字体、普通 Hugo 构建，不引入新的运行时框架或必需构建工具。

非目标：

- 第一阶段实现 Ink、Terminal、Folio 或 Canvas；
- 复制 PG.CENTER 品牌色、版本界面或页面结构；
- 按页面或栏目切换预设（栏目颜色仍由 `theme_color` 负责）；
- 第一阶段按预设改变布局几何、密度或导航结构；
- 在现有明暗处理之外为 Swagger UI、ReDoc 或第三方嵌入换肤。

## 预设模型 {#preset-model}

此表与下文第一阶段配置保留原始范围。后续实验增加显式 `ink`/`terminal` 配置及
菜单列表选项；`true` 仍提供稳定选项与站点默认值。当前行为由
[架构契约](/zh/docs/design/architecture/#visual-presets)管理。

| 预设 | 方向 | 第一阶段 | 读者菜单 |
| --- | --- | --- | --- |
| `paper` | 温暖的编辑式极简 | 实现，默认 | 是 |
| `slate` | 技术极简（当前 OINK） | 实现 | 是 |
| `ink` | 排版极简，受瑞士风格启发 | 规格 + 研究原型 | 否 |
| `terminal` | 终端工具式功能设计 | 规格 + 研究原型 | 否 |
| `folio` | 学术与书籍出版 | 仅保留名称 | 否 |
| `canvas` | 活泼几何与创作者 | 仅保留名称 | 否 |

保留名称在实现前会被校验拒绝，警告中列出可用的稳定预设。

## 配置 {#configuration}

```yaml
params:
  ui:
    preset: paper        # paper | slate        （主题默认：paper）
    preset_menu: false   # false | true | [paper, slate]
```

- `preset` 选择站点默认值。无效或保留值通过现有校验路径警告并回退到 `paper`；
  发布门禁会把警告变成失败。
- `preset_menu` 控制读者选择。`false` 不渲染风格分组、不输出预设初始化脚本；
  `true` 提供所有稳定预设；列表提供子集，且必须包含 `preset`。沿用 `dark_mode`
  的先例，默认 `false`；文档站开启，Starter 采纳不在本轮范围内。
- `preset` 只能在站点级设置，不支持页面与栏目覆盖：逐页切换视觉身份会破坏读者
  预期与已保存的选择。
- 只要 `dark_mode.show_menu` 或风格选择任一开启，外观菜单就存在。
  `dark_mode: false` 且 `preset_menu: true` 的站点只显示“风格”分组。

### 与现有配置的关系 {#existing-keys}

优先级由低到高：

1. `:root` / `[data-bs-theme]` 上的 Slate 基础 token（选择器不变）。
2. `[data-td-preset=X]` 上的预设 token。
3. `params.ui.typography: system`：在所有预设块之后把字体角色收拢为系统字体，
   因此在任何预设下都不请求品牌字体。
4. `params.ui.fonts`：在样式表之后以 `:root` 内联输出；特异性相同、源顺序靠后，
   因此覆盖预设字体角色。显式字体永远优先。
5. `theme_color` / `theme_color_dark`：只作用于页面与栏目的强调背景，覆盖预设
   强调色；从不触碰链接或行内代码。
6. 站点 `_styles_project.scss`：位于样式包最后。

`typography: technical` 仍表示“使用预设自带字体”。具体是哪些字体由预设决定
（Paper：Plex Sans；Slate：Inter + Chakra Petch）。

## 读者状态 {#reader-state}

两个彼此独立的维度：

| 维度 | 属性 | 存储 | 取值 |
| --- | --- | --- | --- |
| 风格 | `<html>` 上的 `data-td-preset` | `localStorage['td-preset']` | 稳定预设名 |
| 明暗 | `data-bs-theme`（及 `.dark-mode`、供应商 `data-theme` 镜像） | `localStorage['td-color-theme']` | `light`、`dark`、`auto` |

| 情形 | 结果 |
| --- | --- |
| 初次访问 | 服务端输出 `data-td-preset="<站点预设>"` 与 `data-td-site-preset`，不依赖脚本 |
| 读者选择预设 | 立即应用、保存，并派发 `td-preset-change` |
| 读者选择标有“默认”的预设 | 删除存储键；之后站点默认值变化能到达该读者 |
| 下一页、刷新、切换语言 | head 内联脚本在首次绘制前应用已保存的值 |
| 已保存的值不再提供 | 删除，使用站点默认值 |
| 存储不可用 | 选择只作用于当前页面，菜单提示不会保存 |
| 禁用 JavaScript | 站点默认预设以浅色调色板呈现，与当前主题无脚本时一致；风格与明暗控件不可用 |
| 切换风格 | 从不写入 `td-color-theme`；切换明暗从不写入 `td-preset` |
| 其他标签页修改 | 通过 `storage` 事件同步 |

内联脚本位于样式表之前，与现有明暗脚本并列。它用构建时嵌入的允许列表校验已保存的
值，设置属性，并按预设与明暗更新 `theme-color` meta 与首绘画布颜色。只有菜单提供
多于一个预设时才输出。与菜单无关，`head.html` 中静态的首绘 `<style>` 与单个
解析后的 `theme-color` meta 改为按站点默认预设的画布颜色渲染，取代原先硬编码的
`#0b0d12`、`#ffffff` 与 `#000000`。

切换时，运行时设置 `data-td-preset-switching` 一帧以抑制颜色过渡；记录第一个可见
标题或块作为滚动锚点；应用属性后恢复锚点偏移，并在 `document.fonts.ready` 后再校正
一次，因为 Plex Sans 与 Inter 的字形度量不同。焦点、已打开的菜单与表单状态保持不变。
第一阶段不使用淡入淡出或 View Transition。

## 外观菜单 {#appearance-menu}

比较了三个方案：

| 方案 | 评估 |
| --- | --- |
| 保留悬停菜单，增加一行风格 | 触屏与键盘缺口仍在；只能靠悬停发现 |
| 风格与明暗分成两个按钮 | 拥挤的导航栏多一个图标；手机抽屉更长 |
| **一个“外观”展开按钮 + 两组单选** | 选定：单一入口，触屏与键盘均可用，可扩展到更多预设 |

行为：

- **触发器**：一个图标按钮（`aria-expanded`、`aria-controls`，标签“外观”），替换
  导航栏与外壳页脚行中现有的主题按钮。快捷键 `t` 继续切换浅色/深色。
- **面板**：非模态弹出层，包含两个原生 `fieldset` 单选组。*风格*：预设卡片，带
  小色样（画布、墨色、强调色）与名称；站点默认值带“默认”徽标。*明暗*：浅色 /
  深色 / 跟随系统分段控件。选择立即生效，面板保持打开以便比较。
- **键盘**：Enter/Space 或 ArrowDown 打开并聚焦已选中的单选；方向键在组内移动
  （原生单选行为）；Tab 在组间移动；Esc 关闭并把焦点还给触发器；焦点离开面板或
  点击外部时关闭。
- **反馈**：选中卡片有 2 px 强调色描边与对勾；明暗分段沿用现有选中样式。变化由原生
  单选语义播报，不额外增加 live region。
- **恢复默认**：选择“默认”卡片即清除已保存的选择，无需单独的重置按钮。
- **手机（< 768 px）**：触发器保留在紧凑页头，并在文档抽屉页脚与 Landing 手机抽屉的
  新行中提供。面板以底部表单打开，44 px 触控目标，同样两组，带关闭按钮。底部表单是用
  `showModal()` 打开的模态 `<dialog>`，处于顶层：原型显示，粘性页头的
  `backdrop-filter` 否则会成为 `position: fixed` 表单的包含块，抽屉的层叠上下文
  也会把它遮住。
- **命令面板**：在 `switch_theme` 旁新增 `switch_preset` 动作。

`dark-mode.js` 保留存储键与属性，但需同步明暗单选的 `checked` 状态并监听其
`change` 事件，取代目前的 `aria-pressed` 按钮。

## Token 架构 {#token-architecture}

所有预设编译进现有的单一 `main.css`。字体通过 `@font-face` 声明，只有规则实际使用时
才下载；因此提供一个预设只增加 CSS 字节，在被选中前不增加字体字节。

```scss
// Slate：沿用现有选择器与取值
:root, [data-bs-theme='light'] { … }
[data-bs-theme='dark'] { … }

// 其他预设
[data-td-preset='paper'] { /* 浅色 token + 字体角色 */ }               // (0,1,0)
[data-td-preset='paper'][data-bs-theme='dark'],
[data-td-preset='paper'] [data-bs-theme='dark'] { /* 深色 token */ }   // (0,2,0)

// 随后：[data-td-typography='system'] 字体块（移到预设之后）
```

规则：

1. **Token 对等**：每个深色块重新声明其浅色块的全部 token，Slate 深色值不会泄漏
   到其他预设。由检查器强制。
2. **深色孤岛**：后代选择器形式覆盖嵌套的 `data-bs-theme="dark"` 孤岛
   （Landing 代码板、预览）。
3. **字体角色只用 (0,1,0)**，`params.ui.fonts` 因而继续优先。
4. **强调色间接层**：预设设置 `--td-preset-accent`（及 `-rgb`、`-hover`），
   `--td-accent` 默认取它；`theme_color` 继续写入 `--td-accent`，因此在两种明暗下
   都能覆盖预设。
5. **Slate 不依赖属性**：`data-td-preset="slate"` 不匹配任何覆盖块，现有站点对品牌
   token 的覆盖行为与今天完全相同。
6. **几何共享**：第一阶段预设不改变栅格列、侧栏宽度或断点。
7. **预设专属规则少而局部**：每个预设一个 partial，限定在 `[data-td-preset=X]` 下；
   两个预设都需要的东西就提升为 token。

Paper 之前（第一阶段）需要的新共享 token：`--td-shell-scrim`、Landing 的
`--td-grid` / `--td-glow` / 主按钮 token、`--td-callout-tint`、`--td-code-inline-bg`、
`--td-hairline`，以及 `brand` 字体角色（`--td-brand-font-family`，默认
`var(--td-display-font-family)`），使字标保留 Chakra Petch，而 Paper 的展示标题
使用 Plex Sans。

原第二阶段计划提出全局圆角、阴影与密度尺度。10 月 5 日实验改为仅作用于主题
自有组件的规则；更广泛的 token 重构不作为试用设计的前提。

契约变化：之前的架构契约把行内代码固定为一组深红色。第一阶段把 `--bs-code-color` 改为
**预设** token（Slate 保留深红，Paper 使用墨色底片）。`theme_color` 仍然从不触碰它。

## 字体 {#fonts}

| 预设 | 界面 / 正文 / 标题 | 展示 | 品牌（字标） | 元信息 | 代码 | 新增字节 |
| --- | --- | --- | --- | --- | --- | --- |
| Paper | IBM Plex Sans | IBM Plex Sans | Chakra Petch | IBM Plex Sans | IBM Plex Mono | Plex Sans |
| Slate | Inter | Chakra Petch | Chakra Petch | IBM Plex Mono | IBM Plex Mono | 无 |
| Ink | Inter | Inter | Inter | Inter（等宽数字） | IBM Plex Mono | 无 |
| Terminal | 界面用 Plex Mono，正文用 Plex Sans | IBM Plex Mono | IBM Plex Mono | IBM Plex Mono | IBM Plex Mono | Paper 之后无 |

Paper 将 `@fontsource-variable/ibm-plex-sans`（OFL-1.1）vendor 到 `third_party/`
并登记 `VENDOR.json`：拉丁、扩展拉丁、西里尔、扩展西里尔、希腊与越南语子集，正体与斜体，字重 100–700。PG.CENTER
仅正体、400–600 的子集为 40,240 B（latin）+ 25,868 B（latin-ext）；准确体积在
vendor 时记录。需要斜体，因为 OINK 正文使用强调，PG.CENTER 的合成斜体不可接受。
完整的小型子集保留现有语言覆盖，浏览器按实际字符范围加载；12 个字体文件均登记于 VENDOR.json。

中日韩文字使用排在拉丁字体之后的系统字体栈：`-apple-system, 'PingFang SC',
'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', 'Noto Sans SC',
sans-serif`。IBM Plex Sans SC 因文件达到 MB 级被否决。等宽字体栈在通用
`monospace` 之前插入 CJK 无衬线字体，使混排代码的中文字形可预期。

`typography: system` 仍不请求任何品牌字体：system 块位于所有预设块之后，并重置
包括 `brand` 在内的全部角色。

**衬线**：第一阶段不使用衬线。拉丁衬线标题与中文无衬线标题并列显得不一致；Windows
默认中文衬线在标题字号下渲染较差；衬线还要多一套字体。第一阶段之后可基于本提案的
同内容对照样稿，评审一个可选的、仅用于展示标题的衬线。

## 预设规格 {#preset-specifications}

### 共享基础 {#shared-foundation}

属于所有预设，而不是 Slate：

- 布局几何、断点、侧栏/目录宽度、约 76ch 正文行长；
- 正文 1rem / 1.7，界面 0.875rem，元信息 0.8125rem；
- 字号比例（h1 2.25rem、h2 1.5rem、h3 1.25rem、h4 1rem）——第一阶段预设只调字重与
  字距，不调字号；
- 焦点环：2 px 强调色描边、2 px 偏移，绝不移除；强制颜色模式回退不变；
- 语义状态色（note、tip、important、warning、caution）保持色相；预设只改变淡底强度
  与边框；
- 第一阶段语法高亮沿用现有 Chroma 浅色/深色调色板；
- 动效 token 100/150/250 ms；`prefers-reduced-motion` 关闭过渡；
- WCAG AA：两种明暗下正文 4.5:1，大字与界面边界 3:1。

### Paper {#paper}

*温暖的编辑式极简。* 暖纸色、墨色文字、安静的细线、柔和阴影，舒展但不松散的阅读
节奏。它服务长篇阅读：大面积画布蓝光更少，界面对比更克制，Plex Sans 字怀开阔，
16 px 下易读。

| Token | 浅色 | 深色 |
| --- | --- | --- |
| 画布 `--bs-body-bg` | `#f7f6f3` | `#161513` |
| 抬升 `--td-brand-elev`、`--td-pre-bg` | `#ffffff` | `#1f1e1a` / `#121110` |
| 次级表面 | `#efede8` | `#1f1e1a` |
| 正文 | `#21201c`（15.09:1） | `#ece9e3` |
| 次级文字 | `#56534c`（7.10:1） | `#b6b1a7` |
| 三级文字 | `#6b665d`（5.27:1） | `#958f84`（5.68:1） |
| 边框 | 墨色 12 % | 浅墨色 13 % |
| 链接 / 悬停 | `#2b5f8c`（6.23:1）/ `#1d68a5`（5.43:1） | `#7db5e6`（8.36:1）/ `#a3cdf3` |
| 强调（铜色） | `#9c5530`（5.17:1） | `#d99a6c` |
| 行内代码 | 墨色字、墨色 6 % 底片 | 浅墨色字、8 % 底片 |
| 阴影 sm / md | `0 2px 10px` / `0 14px 38px`，墨色 7 % / 13 % | 黑色 35 % / 50 % |
| 圆角 | 代码 12 px、卡片 12 px、控件 8 px | 相同 |

Paper 专属规则：标题 Plex Sans 600，字距 −0.006em（h1 −0.012em）；h2 后接延伸到
边缘的细线；外框表格（圆角 10、表头底色、无斑马纹）；提示块使用 4 %（深色 6 %）语义
淡底与单条 3 px 竖线；细线引用块；Landing 去掉网格与光晕，主按钮取自 token 并带暖色
阴影，首屏标题 600 / −0.025em；导航选中行使用暖中性底并混入 9 %（深色 12 %）强调色。
链接保持蓝色：这是阅读惯例，不是装饰。悬停与弹出层使用 160 ms ease-out；滚动时
不做动效。

### Slate {#slate}

*技术极简。* 即当前 OINK 外观，保持不变：冷灰蓝画布、海军蓝墨色、钢蓝与铜色、
Inter 正文、Chakra Petch 展示、Plex Mono 标签与元信息、蓝图网格与首屏光晕、深红
行内代码、8–12 px 圆角。选择 `preset: slate` 必须复现 `v1.1` 的 token 值，由检查器
比较。网格、光晕、Chakra 展示标题、等宽元信息与深红行内代码属于 Slate 身份；布局、
焦点、状态色与外壳结构属于共享基础。

### Ink {#ink}

*排版极简，受瑞士风格启发的信息设计。* 黑、白与中性灰，一个红色强调；层级由字号、
字重与对齐承担，而不是颜色、阴影或圆角表面。

| Token | 浅色 | 深色 |
| --- | --- | --- |
| 画布 | `#ffffff` | `#0b0b0b` |
| 正文 | `#141414` | `#ededed` |
| 次级 / 三级 | `#474747` / `#636363` | `#b5b5b5` / `#8f8f8f` |
| 表面 | `#f4f4f4` | `#161616` |
| 链接 | 墨色加下划线；悬停为红 | 浅墨色加下划线；悬停为红 |
| 强调 | `#c8102e`（5.88:1） | `#ff5c4d` |
| 圆角 / 阴影 | 0 / 无 | 0 / 无 |

与 Slate 的区别：画布无色相、无蓝色、无网格纹理、无阴影、无圆角；链接靠下划线而非
色相识别；标题使用 Inter 700–800 紧字距，而不是 Chakra Petch。与 Paper 的区别：
中性而非暖色，平面而非柔和，粗线分隔而非细线，下划线链接而非蓝色链接。标志性规则：
h2 上方 2 px 黑线；h1 800 / −0.035em；h4、表头与提示块标题大写加字距；导航选中行用
3 px 红色竖条而不是底色；等宽数字。

### Terminal {#terminal}

*终端工具式功能设计。* 体现在结构与信息表达上，而不是 CRT 特效：等宽界面、命令与
路径表达、紧凑控件、明确的面板边界、琥珀或青绿强调。

| Token | 浅色 | 深色 |
| --- | --- | --- |
| 画布 | `#f4f5f2` | `#0c0f0e` |
| 正文 | `#1d211f` | `#d3dbd6` |
| 次级 | `#4a514d` | `#9aa59f` |
| 表面 | `#e9ebe6` | `#141a18` |
| 链接（青绿） | `#0a6560`（6.31:1） | `#4cc9bd` |
| 强调（琥珀） | `#935400`（5.47:1） | `#f0a73a` |
| 圆角 | 2 px | 2 px |

等宽范围：导航、标题、标签、元信息、面包屑、按钮与代码使用 IBM Plex Mono。正文段落、
列表与表格正文使用 Plex Sans，中文使用平台回退字体，因为长段等宽文字与中英混排
等宽行都难以阅读。
标志性规则：标题前的 `## ` 前缀用 `content: '## ' / ''` 渲染，辅助技术会忽略它；
方括号提示标签（`[NOTE]`）；导航选中行反色并带 `▸` 标记；1 px 强边框面板；首屏静态
`▍` 光标。没有扫描线、辉光、闪烁或打字动画。

### 差异矩阵 {#difference-matrix}

| | Paper | Slate | Ink | Terminal |
| --- | --- | --- | --- | --- |
| 色温 | 暖 | 冷 | 中性 | 中性偏绿 |
| 浅色画布 | `#f7f6f3` | `#f1f4f8` | `#ffffff` | `#f4f5f2` |
| 深色画布 | `#161513` | `#0b1119` | `#0b0b0b` | `#0c0f0e` |
| 正文字体 | Plex Sans | Inter | Inter | Plex Sans |
| 标题字体 | Plex Sans 600 | Inter 600–700 | Inter 700–800 | Plex Mono |
| 展示 / 字标 | Plex Sans / Chakra | Chakra / Chakra | Inter / Inter | Plex Mono |
| 链接信号 | 蓝色 | 钢蓝 | 下划线 + 红色悬停 | 青绿 |
| 强调色 | 铜色 | 铜色 | 红色 | 琥珀 |
| 圆角 | 8–12 | 8–12 | 0 | 2 |
| 阴影 | 柔和暖色 | 海军蓝调 | 无 | 无 |
| 章节分隔 | h2 尾随细线 | 无 | 2 px 顶线 | `##` 标记 |
| 选中行 | 暖色底 | 强调色底 | 红色竖条 | 反色 + `▸` |
| 行内代码 | 墨色底片 | 深红 | 墨色底片 | 带框墨色底片 |
| Landing 纹理 | 无 | 网格 + 光晕 | 无 | 无 |
| 界面密度 | 标准 | 标准 | 标准 | 紧凑 |

## 页面密度 {#page-density}

密度跟随页面任务，而不是预设：Landing 首屏允许最大的展示字号与品牌表达；Docs 正文
保持 1rem / 1.7 与约 76ch；侧栏、目录、参数表、搜索结果与命令面板保持紧凑行
（0.875rem，行高 1.4–1.5）。第一阶段预设可以改变这些区域的配色，但不改变间距。
Terminal 的紧凑界面属于第二阶段的密度 token。

## 运行时表面 {#runtime-surfaces}

| 表面 | 第一阶段影响 |
| --- | --- |
| Blog、Book、分类 | 仅 token；Book 题注保持正文字体 |
| 搜索对话框与命令面板 | 遮罩 token 化；选中行使用 `--td-shell-primary-dim` |
| Mermaid、ECharts | 颜色在初始化时依 `data-bs-theme` 固化。只有图表采用预设颜色时才需观察 `data-td-preset`；第一阶段保持仅随明暗变化 |
| asciinema | 表面 token；只有代码字体变化才需重新挂载（第一阶段不变） |
| giscus | 每个预设与明暗各需一份样式表，并在 `td-preset-change` 时重新下发 |
| Swagger UI、ReDoc | 保持供应商样式与现有明暗处理 |
| 打印 | 海军蓝与冷灰 token 化；打印始终使用当前预设的浅色调色板 |
| 404 | 其自有 `<html>` 必须带上新属性 |

## 无障碍、安全与输出 {#boundaries}

- 每套调色板在两种明暗下的正文、次级与三级文字、链接与强调色均满足 WCAG AA（见上文
  数值）。`theme_color` 对比度警告按站点默认预设的画布计算。
- 菜单使用原生单选，不使用 `role="menu"`。除手机底部表单（模态并恢复焦点）外不捕获焦点。
- `prefers-reduced-motion` 与强制颜色模式保持现有行为。
- 初始化脚本内联、静态，来自已校验的配置；已保存的值使用前先与构建时允许列表比对。
- 不新增外部字体或脚本请求。输出只增加两个 `<html>` 属性、一段内联脚本与 CSS。

## 兼容与迁移 {#compatibility-and-migration}

默认改为 Paper 会改变所有未设置 `preset` 的站点。

- 想保留当前外观的站点加上 `params.ui.preset: slate`；升级说明以这一行开头。
  Slate 输出必须等于 `v1.1` 的 token。
- 在 `_styles_project.scss` 中覆盖品牌 token 的站点：`:root` 上的浅色覆盖在 Paper
  下仍按源顺序生效；`[data-bs-theme='dark']` 上的深色覆盖会被 Paper 深色块压过。
  这类站点应选择 Slate，或把覆盖改写到
  `[data-td-preset='paper'][data-bs-theme='dark']`。升级说明与品牌指南需说明。
- `theme_color`、`typography` 与 `fonts` 的含义与优先级不变。
- `dark_mode: false` 的站点仍只有一套浅色调色板，只是变为 Paper。
- 改变默认值的版本必须把它列为可见变化。该版本是次版本（`1.x`）还是主版本，
  是待决问题。
- 在发布默认值变化前，消费方盘点应报告哪些站点覆盖了品牌 token。

## 实施计划 {#implementation-plan}

第一阶段，按依赖顺序；每步注明负责的检查器。

1. **Token 化 Slate 泄漏点**：Landing 主按钮、网格、光晕、遮罩、打印颜色、asciinema
   表面；增加 `--td-preset-accent`、`brand` 字体角色，以及
   `contrast-on-canvas.html` 的按预设画布亮度。Slate 的计算颜色必须保持等价。
   检查器：`check-landing.py`、`check-output.py`、`check-font-tokens.py`。
2. **Vendor IBM Plex Sans**：`third_party/`、`VENDOR.json`、许可证文件。
   检查器：`check-vendor.py`。
3. **预设 token**：新增 `assets/scss/td/_presets.scss`（在 `_brand.scss` 之后导入）；
   当前实现将 Paper 保留在这个文件中，不另建 `presets/_paper.scss`。
   字体预设块放在 `system` 重置之前。检查器：扩展
   `check-font-tokens.py`（Plex Sans 字体族、system 块顺序、浅深块 token 对等）。
4. **配置**：`hugo.yaml` 默认值（`preset: paper`、`preset_menu: false`）；一个
   resolver partial，供 `validate.html`、`document-attrs.html`、`layouts/404.html`
   与 `head.html`（初始化脚本、`theme-color`、首绘画布）使用；重新生成 schema。
   检查器：`check-params.py`（接受、无效、保留值）、
   `generate-config-schema.py --check`、`check-namespace.py`。
5. **外观菜单**：共享 partial，供 `navbar.html`、`shell/footer-line.html` 与 Landing
   手机抽屉使用；`preset.js` 运行时（或 `dark-mode.js` 的一节）；`dark-mode.js`
   单选同步；命令面板动作 `switch_preset`；32 个语言目录的 i18n 字符串。
   检查器：`check-shell.py`、`check-actions.py`、i18n 检查器、
   `tests/js/preset.test.js`、`tests/js/dark-mode.test.js`。
6. **第三方表面**：按预设的 giscus 样式表与重新下发。
7. **文档**：EN/ZH 架构、外壳与 Landing 契约；品牌指南（预设、迁移、字体）；
   配置参考；变更日志与升级说明。
8. **站点验证**：`make -C ../oink.pgsty.com check`、`browser`（增加预设切换、持久化、
   存储失败、无 JS、EN/ZH、桌面/手机、浅色/深色用例），以及用于视觉评审的 `dev`。

## 验收标准 {#acceptance-criteria}

以下保留最初的验收目标，已执行检查与剩余限制分别记录在[10 月 5 日验收记录](/zh/docs/design/research/2026-10-05-visual-presets-acceptance/)中：

- 未设置 `preset` 时，输出带 `data-td-preset="paper"`，禁用 JavaScript 也呈现 Paper。
- `preset: slate` 在检查器样例上产生与 `v1.1` 相同的计算颜色与字体角色。
- 切换风格不改变 `td-color-theme`；切换明暗不改变 `td-preset`；两者在导航、刷新与
  切换语言后保持。
- 无效的已保存值被删除；存储失败时页面可用并显示不保存提示。
- 在 Chromium、Firefox 与 WebKit 的正常及降速 CPU 下，预设之间无首绘闪色。
- 切换后滚动位置与锚点相差不超过一行。
- 任何预设下 `typography: system` 都不触发字体请求；`params.ui.fonts` 覆盖预设字体。
- Paper 与 Slate 下，`theme_color` 在两种明暗中都覆盖强调色。
- 菜单可完全通过键盘、触屏与屏幕阅读器操作；axe 不报告新增违规。
- 所有调色板在两种明暗下满足对比度表。
- 无外部请求；`--panicOnWarning` 构建通过。

## 待决问题 {#open-decisions}

1. 第一阶段已选择 `preset_menu: false`，文档站开启。原问题：`false`（与 `dark_mode` 一样需显式开启）还是 `true`。
2. 改变默认值的版本：`1.2.0` 加醒目说明，还是 `2.0.0`。
3. 第一阶段已选择 `brand`。原问题：字标字体角色命名：`brand` 还是 `wordmark`。
4. 第一阶段之后，是否把仅用于展示标题的衬线作为 Paper 选项。
5. 第二阶段图表（Mermaid、ECharts）是否采用预设颜色。

## Ink 与 Terminal 后续清单 {#ink-terminal-backlog}

已实验实现：两套色板、现有字体角色、正文链接与选中信号、标题处理、局部几何、
Terminal 紧凑导航、Giscus 色板、打印与现有切换机制。不新增字体文件、动画或
运行时。真实输出与验证范围见[实验记录](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/)。

晋升稳定预设前，仍需评审 Ink 长页红色强调密度与中文下划线；Terminal 编号标题、
等宽换行与密集参数表；Windows/Android 回退字体，以及人工屏幕阅读器朗读。
本次实验明确保留 Mermaid/ECharts 与 API 供应商组件仅随明暗变化；全局几何与
密度 token、预设图表色板需要另行决定。

## 决策记录 {#decision-log}

| 日期 | 变化 |
| --- | --- |
| 2026-10-04 | 创建草案：Paper/Slate 第一阶段范围、Ink/Terminal 研究规格、外观菜单选择与 token 架构 |
| 2026-10-05 | 第一阶段已在本地实现；默认值、brand 角色、图表仅随明暗的范围已接受；发布版本未定，本轮没有发布 |
| 2026-10-05 | 随后实现显式开启的 Ink/Terminal 实验；保留稳定菜单策略；视觉定稿仍未完成 |
