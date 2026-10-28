---
title: 让 Ink 与 Terminal 成为稳定的阅读风格
linkTitle: Ink 与 Terminal 稳定化
description: 两种阅读风格的条件式稳定化方案，明确共用页脚阻塞项与双语无障碍验收门禁。
weight: 60
icon: fa-solid fa-palette
design_kind: proposal
design_status: draft
proposal_date: 2026-10-26
---

> [!WARNING] 草案——稳定化升级受阻
> **放大字体会使共用页脚溢出。** 在 320px 视口、32px 根字号／默认字号下，英文 Ink 的文档宽度达到 424px，Terminal 达到 408px。对比覆盖样式没有修复这一共用缺陷。两份原型均未稳定，也未获准升级为稳定预设。

## 状态、归属与范围 {#status}

**状态与日期**：草案，2026-10-26；提出设计方向，不是实现契约

**最终负责人**：OINK 维护者；分别记录每个预设的验收决定

**交付归属**：主题维护者负责 CSS、解析器与专项检查器；文档维护者负责双语契约、真实站点夹具与浏览器审查；无障碍评审者负责人工任务证据

**基线**：OINK v1.4.0；本地源码身份与含未提交修改的快照边界见[研究记录](/zh/docs/design/research/2026-10-26-ink-terminal-stabilization/#inputs)

**受影响契约**：[架构](/zh/docs/design/architecture/#visual-presets)、[组件](/zh/docs/design/components/)、[外壳](/zh/docs/design/shell/)、[Landing](/zh/docs/design/landing/)与[视觉预设决策](/zh/docs/design/decisions/visual-presets/)

**版本意向**：面向后续版本，完成精修后分别决定是否升级为稳定预设；不建议新增预设

## 背景与证据 {#context}

Ink 与 Terminal 已作为显式启用的实验存在。共用外壳让读者切换风格后仍能沿用导航、搜索、外观控制与内容语义，这是它们的优势。剩余问题包括装饰重复、正文以外的字体分工、主题自有组件的形状不一致，以及验收覆盖不足。Ink 已经是 **中性无衬线编辑风格**；改为衬线会占用 Folio 的独立定位。Terminal 应成为 **易读的工程手册**，以等宽字体承载技术角色，以比例字体承载解释性正文。

[带日期的研究](/zh/docs/design/research/2026-10-26-ink-terminal-stabilization/)区分了源码事实、实测结果、设计判断和有限 CSS 覆盖实验。正常字号测量、间距探测及专项检查提供了积极证据，但整页页脚溢出仍然存在。手动 200% 文字放大与 400% 浏览器缩放验收仍需独立于 32px 字号偏好探测完成。

## 目标与明确排除项 {#goals}

| 预设 | 受众与主要任务 | 共用外壳内的独立定位 |
| --- | --- | --- |
| Paper | 广泛的文档读者；指南与持续阅读 | 温暖的 Plex Sans 阅读表面、克制的圆角组件；继续作为默认值 |
| Slate | 既有技术／产品站点；参考导航与产品展示 | 既有冷色调、Inter／Chakra／Plex 字体角色及更丰富的 Landing 表现；保留兼容选择 |
| Ink | 编辑、作者及长文档、随笔、设计论证的读者 | 中性 Inter／CJK 无衬线、方正扁平表面、清晰正文下划线，以及少量红色或作者强调色 |
| Terminal | 工程师与运维人员；操作流程、配置查阅与代码解释 | Plex Sans 解释性正文、等宽标题／控件／标识符、青绿／薄荷色链接、琥珀强调色及扁平 2px 形状 |

两种候选都必须适用于 Docs、Book、Blog、画廊、Expo 与 Landing，覆盖中英文、深浅色及宽窄视口。它们都不是独立外壳、无障碍模式或表格密度模式。本次排除新渲染器、全局间距改动、字体下载、运行时依赖、终端特效、移动选择轨迹、凸起 Tabs、带框 Field 名称和 Paper 标题尾线。

两个可选概念继续留在 1.4 范围之外：

| 概念 | 独立的未来用途 | 成本与处置 |
| --- | --- | --- |
| Folio | 学术与书籍出版：衬线阅读角色、学术图注／注释，无衬线导航／搜索，等宽代码 | 需要匹配的中英文衬线方案、许可、本地字体体积及回退／打印／设备验收。保留共用外壳，不引入侧边注释栏。有研究价值，但不取代 Ink。 |
| Canvas | 面向创作者的活泼几何展示：沿用无衬线字体，控制淡紫／赭色强调及少量几何标记 | 本身不必增加字体，但需新增配色／状态／形状规则、素材指引、菜单与完整回归覆盖。现有证据较弱，与 Slate 重叠明显。等待真实创作任务证明价值。 |

## 提议行为与边界 {#behavior}

### 保留配色，明确角色 {#palette}

初期保留以下源码颜色。表中为浅色／深色配对，不构成新的配置权威；[预设 SCSS](https://github.com/pgsty/oink/blob/v1.4.0/assets/scss/td/_experimental-presets.scss)仍是实现归属。在改色相之前，先减少重复强调。

| 角色 | Ink 浅色／深色 | Terminal 浅色／深色 |
| --- | --- | --- |
| 画布 | `#ffffff` / `#0b0b0b` | `#f4f5f2` / `#0c0f0e` |
| 正文 | `#141414` / `#ededed` | `#1d211f` / `#d3dbd6` |
| 强调文字 | `#000000` / `#ffffff` | `#111713` / `#edf4ef` |
| 次级文字 | `#474747` / `#b5b5b5` | `#4a514d` / `#9aa59f` |
| 第三级文字 | `#636363` / `#8f8f8f` | `#606b63` / `#8b9990` |
| 次级表面／代码标题栏 | `#f4f4f4` / `#161616` | `#e9ebe6` / `#141a18` |
| 第三级表面 | `#ffffff` / `#161616` | `#f8f9f6` / `#18201c` |
| 代码块 | `#fafafa` / `#111111` | `#ffffff` / `#0a0d0b` |
| 链接 | `#141414` / `#ededed` | `#0a6560` / `#4cc9bd` |
| 悬停链接 | `#c8102e` / `#ff5c4d` | `#084f4b` / `#7de0d7` |
| 默认强调色 | `#c8102e` / `#ff5c4d` | `#935400` / `#f0a73a` |
| 链接填充上的前景 | `#ffffff` / `#0b0b0b` | `#ffffff` / `#0c0f0e` |
| 普通边框 | 正文 RGB，alpha 24% / 24% | 正文 RGB，alpha 32% / 32% |
| 强分隔线 | 正文 RGB，alpha 55% / 50% | 正文 RGB，alpha 55% / 55% |
| 行内代码 | 正文前景；正文 RGB 填充 5% / 6% | 正文前景；正文 RGB 填充 5% / 7% |

成功、警告、错误与信息保留各自的语义色、图标和标签。不能把 Ink 的全部状态变红，也不能把 Terminal 的全部状态变成薄荷色。中性徽章不能看起来像成功状态。装饰分隔线可以较淡；识别控件所必需的边界要独立测量对比度。

作者设置的 `theme_color` 继续控制强调表面。真实文档使用蓝色 `#245f94/#5da2dd`，Book 使用橙色 `#9a3412/#fb923c`，Blog 使用紫色 `#6d28d9/#a78bfa`。它们不会取代链接／代码文字角色。作者强调色和预设默认值均需审查。

### 保留阅读角色，验证真实字体回退 {#typography}

| 角色 | Ink 默认值 | Terminal 默认值 |
| --- | --- | --- |
| `body` | Inter + 平台无衬线 | IBM Plex Sans + 平台无衬线 |
| `ui` | Inter + 平台无衬线 | Code 角色：IBM Plex Mono + 等宽回退 |
| `heading` | Body 角色 | UI 角色 |
| `code` | IBM Plex Mono + 等宽回退 | IBM Plex Mono + 等宽回退 |
| `display` | Heading 角色 | Heading 角色 |
| `meta` | UI 角色 | UI 角色 |
| `brand` | UI 角色 | UI 角色 |
| `print` | Body 角色 | Body 角色 |

Book 图注、表格描述及供人阅读的搜索标题／摘要使用正文角色。作者编写的章节编号保留其含义，沿用所属标题的字体角色。Terminal 的技术路径、命令控件和标识符保持等宽。Field 名称保持无框、600 字重。描述性 Terminal 表头改用正文角色 `0.875rem/600`；普通正文保留 `1rem/1.7` 与共用阅读宽度。展示标题沿用页面尺度并允许换行；不能为了容纳等宽界面而缩小移动端正文。

现有无衬线回退顺序为 `-apple-system`、`BlinkMacSystemFont`、PingFang SC、Hiragino Sans GB、Microsoft YaHei、Segoe UI、Roboto、Helvetica Neue、Arial、Noto Sans SC、通用 sans-serif 与 emoji。等宽列表在 IBM Plex Mono 后依次为 SFMono-Regular、Cascadia Code、Roboto Mono、Menlo、Consolas、Liberation Mono、Sarasa Mono SC、Noto Sans Mono CJK SC 和通用 monospace。列出字体名称不会安装字体。YaHei 排在 Segoe 之前，也可能承载拉丁字符。中文不必占用拉丁等宽字符格。保留语言元数据、`typography: system`、显式角色及旧 Sass 优先级；在真实 Windows／Android 上分别检查字体已加载、被阻止、系统字体和角色覆盖条件。（[字体匹配](https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm)）

### 建立层级与按语言区分的链接规则 {#hierarchy-links}

比较 Ink 正文 `h1` 的 750 字重／`-.025em` 字距、`h2/h3` 的 700／`-.012em`，以及替代现有粗线的 1px 强线条 token 顶线。中文标题字距为零。取消次级标题、表头、提示块标题的强制大写与字距。Terminal 标题使用 600／零字距；移除生成的 `##`／`###` 及提示块括号，保留作者的 Book 编号、语义标签与标题锚点。不添加伪提示符、闪烁光标特效或装饰性标题尾线。

Ink 正文链接静止时保留原生下划线，包括列表、注释与引用。Terminal 保留持续可见的非颜色链接提示；在真实正文中验证既有半粗体提示，提示不足时使用原生下划线。导航依靠位置和持续的当前状态标记。悬停不得改变布局、字重或命中区域。（[GOV.UK 链接](https://design-system.service.gov.uk/styles/links/)）

下划线位置仍待评审。覆盖实验使用 `max(1px, .06em)` 线宽、`.22em` 偏移，并对中文比较 `.25em`／`skip-ink: none`。**不接受一律使用 `.25em` 的规则。** 应比较英文 `.12–.18em` 与中文 `text-underline-position: under` 加 `0–.06em` 小偏移，先使用 `skip-ink: auto`。按实际语言限定，覆盖英文页面内的中文块。测试混合字符、标点、下伸部、行内代码及跨行链接；线条不得碰撞字形或相邻行。（[CSS Text Decoration 草案](https://www.w3.org/TR/css-text-decor-4/#text-underline-position-property)）

### 统一组件状态 {#components}

**自有组件圆角**：Ink 0px、Terminal 2px，无层叠阴影；纳入目前写死 0.6rem 的 FileTree 圆角。保留图片、头像、状态圆点与 vendor 形状。

**当前／选中**：Ink 保留静态强调色侧线；Terminal 保留中性反色行／标记。保留程序可识别状态。悬停、选中与键盘焦点相互区分，不使用移动胶囊。

**焦点**：立即呈现静态指示，在每种相邻表面上独立测量，强制颜色模式下可见；不全局清除轮廓。

**文字选择**：从现有作者强调色填充开始：alpha 浅色 22%、深色 35%；测量合成后的文字／行内代码配对。必要时通过归属角色修复，不能假定该不透明度已经合格。

**Tabs**：扁平标签、静态底部选中线、独立焦点；无凸起活动标签。保留键盘、hash／存储行为、长标签和触控区域。

**Fields 与输入框**：技术 Field 名称不加框，说明保持正文。真正的输入控件仍需持续标签、可辨边界和关联错误文字；占位文字不能单独充当标签。

**代码与表格**：克制的单层边框；保留语法语义、注释、复制、标题、表头关系与数字对齐。描述性表头可换行，不全表大写。保留作者指定的宽度／溢出策略及局部滚动入口。

**注释、引用、脚注**：重要内容持续可见；语义标记／线条克制，出处紧邻，引用／返回链接可用。不添加巨大引号、全篇中文斜体或侧边注释栏。

**卡片、步骤、徽章、折叠块**：标签与形状稳定；区分可点击与静态内容，保留真实步骤编号、原生折叠语义及带标签的状态。

**搜索与外观**：搜索标题／摘要使用正文角色，技术路径等宽；匹配、选中和弱化文字均可读。保留对话框焦点及返回、输入法编辑、加载／错误／无结果反馈，以及移动键盘展开时的可操作性。

**Landing、Blog／画廊、Book、Expo**：保留现有构图与媒体行为；展示标题、图注、署名与工具适应各自阅读任务。不对图片表面施加全局方角重置。

### 保留输出、vendor 与安全边界 {#outputs}

Mermaid／ECharts 继续 **只跟随深浅模式**；API 控件保留 vendor 配色及既有模式行为。不向 vendor DOM 增加预设重着色层。Giscus 自动配色跟随预设与模式，显式覆盖仍有优先权，但本次未验收被阻止的远程 iframe。打印在白纸上使用浅色预设；无 JavaScript 时保留站点默认浅色与可读内容。Markdown／RSS 保留语义内容，不泄漏装饰前缀或控件。继续使用现有转义、字体／颜色输入校验、本地素材和外观存储行为，不新增网络权限或脚本依赖。

## 兼容与迁移 {#compatibility}

保留预设名称、独立的模式／风格状态、外壳列宽、断点、内容语法与作者覆盖。Paper 继续默认，维护中的消费站保留显式 `[paper, slate, ink, terminal]` 菜单。精修可以随版本交付，同时继续保持实验状态。

升级为稳定预设会改变 `preset_menu: true` 的结果：它提供稳定预设与站点默认值，因此任一实验升级都会扩大自动集合。必须在 `layouts/_partials/preset-config.html`、归属检查器和双语配置／版本指引中明确处理。显式列表仍保留作者选择的成员。升级需要逐预设的维护者验收，不能只改状态标签。保留 Folio／Canvas 保留名称的警告／回退行为。

## 实现与归属检查器计划 {#implementation}

| 阶段／负责人 | 工作与证据 |
| --- | --- |
| 共用修复／外壳维护者 | 在页脚归属实现中修复收缩／换行；为全部四个预设增加覆盖到页脚的整页滚动宽度与内容可见性断言。不得用裁切或隐藏溢出代替修复。 |
| 精修／主题维护者 | 在既有预设、字体及组件归属实现中落实受审方案。先运行 `bin/check-presets.py`、`bin/check-font-tokens.py` 和受影响的组件／输出检查，保留冻结的 Slate。 |
| 集成／文档维护者 | 在真实双语页面上扩展外观、字体、组件与文字重排套件，纳入整页检查和附注视觉审查。使用同级源码运行 `make check`、`make browser`，通过 `make dev` 审查。 |
| 稳定化升级／维护者与评审者 | 关闭下列门禁；在同次交付中更新归属实现／检查器和受影响的双语契约，再记录长期理由及面向用户的迁移说明。 |

运行时修改还需 `node --test 'tests/js/**/*.test.js'`；Schema 修改需 `python3 bin/generate-config-schema.py --check`。

## 验收门禁与待决问题 {#acceptance}

### 区分无障碍要求与项目强化目标 {#accessibility}

以 WCAG 2.2 A／AA 为基线（参考资料访问日期为 **2026-10-26**）。

| 门禁 | 必须完成的评估 |
| --- | --- |
| 文字与控件 | 普通文字 4.5:1；符合大字条件的文字 3:1（常规 24px 或粗体 18⅔px，中文采用等效尺寸）。识别控件／状态所需的视觉信息与相邻颜色达到 3:1；装饰分隔线另论。纳入代码注释、占位文字及全部选中／悬停状态。（[1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)、[1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)） |
| 重排与放大 | 分别测试 320 CSS px 重排、手动 200% 文字放大，以及从 1280px 视口开始的 400% 浏览器缩放。必要的二维区域需逐项说明，代码／表格并非一概豁免。同时关闭独立的 320px／32px 字号压力阻塞项。（[1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)、[1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)） |
| 间距 | 同时覆盖行高 1.5、段后距 2em、字距 .12em、词距 .16em，不丢失内容或功能。这些是用户覆盖值，不是默认排版；评估适用的中文／混排属性。（[1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)） |
| 键盘与语义 | 焦点可见，获得焦点的控件不被作者内容完全遮挡；状态不只靠颜色，语言、标题、标签和表格关系正确。字符快捷键需可关闭、可重映射或仅在所属组件获得焦点时激活，不能仅在输入框内禁用。适用的搜索状态无需移动焦点即可播报。（[2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)、[2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)、[4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)） |
| 最小目标 | AA 要求 24×24 CSS px，或符合例外。间距例外要求：以每个小目标为中心画直径 24px 的圆，该圆既不能与其它目标相交，也不能与另一个小目标的圆相交；另有行内、等效控件、用户代理及必要表现例外。（[2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)） |
| 拟议强化目标 | 常用触控控件 44×44px；正文 7:1；整个焦点控件／轮廓可见；静态指示面积至少等于 2px 周长线，并在同一像素位置具有 3:1 状态变化，同时满足相邻颜色对比度。这些超出 AA，需明确采纳，也不意味着全页 AAA。（[2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)、[1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)、[2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)） |

### 完整任务记录先于稳定化升级 {#promotion}

两种语言、两种模式都必须覆盖 **320/390/768/1440px**，包括正常、放大及覆盖间距的文字。审查长文顶部／中段／页脚、标题／Book 编号、URL、Fields、表格、代码、搜索、外观、媒体与 Landing。检查静止／悬停／当前／选中／焦点／文字选择、强制颜色、减少动态效果，以及无 JavaScript／打印／Markdown／RSS。记录实际颜色配对与 axe 不完整结果的人工审查。

真实 Windows Chrome／Edge、Android Chrome 的字体／渲染工作仍待完成，品牌版 macOS／iOS Safari 检查也未完成。记录设备、操作系统、浏览器与字体条件。人工任务仍需 Windows 上的 NVDA、真实 Safari 上的 VoiceOver、Android 上的 TalkBack：遍历标题及有意义编号，读取表格／字段错误，使用中文输入搜索，听取简洁状态反馈，打开／关闭对话框并恢复焦点。

待决事项包括中文下划线方案、项目强化目标、必要的状态颜色修复，以及各预设是否升级。门禁未关闭时，保持实验状态或推迟精修；其它 1.4 工作无需等待新风格。

## 决策日志 {#decision-log}

| 日期 | 拟议决策与状态 |
| --- | --- |
| 2026-10-26 | Ink 保持中性无衬线编辑风格，Terminal 成为易读工程手册；保留当前配色与作者强调色。建议采纳方向，尚未完成稳定性验收。 |
| 2026-10-26 | 优先修复共用放大字号页脚；保留扁平 Tabs、无框 Fields，不恢复 Paper 尾线。通过既有归属实现移除 Terminal 装饰标点。 |
| 2026-10-26 | 中文下划线替代方案与强化无障碍目标继续待评审；探索性探测不关闭稳定化门禁。 |
| 2026-10-26 | 1.4 不新增预设；Folio／Canvas 保留独立的未来定位。逐预设升级及自动菜单扩展需明确验收。 |
