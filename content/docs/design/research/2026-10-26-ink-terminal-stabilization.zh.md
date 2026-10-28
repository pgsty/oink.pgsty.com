---
title: Ink 与 Terminal 仍需阅读验收
linkTitle: Ink 与 Terminal 评审
description: 2026-10-26 Ink 与 Terminal 的源码审查、有限视觉证据、现存缺陷与稳定化边界。
weight: 70
icon: fa-solid fa-flask
design_kind: research
design_status: local-verification
research_date: 2026-10-26
---

> [!WARNING] 发布前研究快照（2026-10-26）
> 本文保留 OINK 1.4.0 发布准备前的输入与测量。在 320px 视口、32px 根字号／默认字号下，页脚链接使全部四个预设出现整页溢出。Ink 与 Terminal 仍为实验预设；[稳定化提案](/zh/docs/design/proposals/ink-terminal-stabilization/)规定目标行为与晋升门禁。

**Ink 应保持中性无衬线编辑风格，Terminal 应成为易读的工程手册。** 两者可以通过既有字体角色和共用外壳形成连贯的官方风格。新增衬线身份会削弱 Ink 与未来 Folio 的区别，模拟终端则会削弱工程长文阅读。近期工作应聚焦共用文字布局韧性、克制的层级和组件一致性。

## 证据对应一个明确的本地快照 {#inputs}

本次 2026-10-26 评审结合了一手文字／HTML／CSS 资料、导出的源码快照、真实文档渲染和有限的注入 CSS 对比。主题 HEAD 为 `7bc8658bc1be13ef0ad3050b9d9f6862f8f1f65f`，文档 HEAD 为 `99751179eefada3fa7a91318c792ddac46d7e6bf`。快照还包含未提交修改（含并行表格工作），保留的源码清单记录了完整状态。公开标签查询观察到 v1.3.2，解引用为 `bd2e856e6e2f7027a9189af009701f5b8cf562cf`；文档固定 v1.3.2。历史背景见 [早期实验](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/) 与 [组件评审](/zh/docs/design/research/2026-10-25-component-refinement/)。

文档服务器使用同级快照及 `hugo.yml,tests/fixtures/browser.yml`，关闭两种工作区机制，采用内存渲染，不监听、不注入实时刷新。由于导出目录没有 Git 元数据，设置 `enableGitInfo=false`。工具为 macOS ARM64、Hugo Extended 0.168.0、Go 1.27.3、Node 26.12.0、npm 11.20.0 与 Playwright 1.62.1；引擎为 Chromium 151.0.7922.34、Firefox 153.0、WebKit 26.5（[Playwright WebKit 范围](https://playwright.dev/docs/browsers#webkit)）。

复现方法是在各宽度加载相同真实路由、语言、模式与预设，比较基线及所列覆盖样式，记录整页尺寸和计算样式，再截取相关组件。源码清单、`review-metrics.json`、`api-supplement.json`、`text-resize-findings.json`、`stress-metrics.json`、`reference-rendering.json` 及截图保留在 Git 外。

## 整页溢出优先于专项检查通过 {#results}

在 320px／32px 根字号下，英文 Ink 的 `scrollWidth=424`（超出 104px），Terminal 为 408（超出 88px）。中文 Chromium 分别超出 12px／21px；英文 Terminal 在 768px 下也超出 11px。覆盖样式产生相同缺陷。Firefox 的真实 `font.size.variable.x-western=32` 偏好复现了全部四个预设的英文溢出；Paper 达到 413px，Slate 约 400px。“Customization”“Components”“Docsy discussions”等页脚链接超出了两列窄网格。这是全部预设共有的 **基线阻塞项**。

这些探测使用 CSS 根字号放大和原生默认字号偏好。320px 与放大文字叠加，比独立重排要求更严格。完整的手动 200% 文字放大和 400% 浏览器缩放仍待完成（[文字放大](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)、[重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)）。

**归属检查**：`check-presets.py` 通过三个界面的文字／链接／强调色、深浅模式一致性、冻结 Slate 与配置输出检查；`check-font-tokens.py` 通过。

**既有套件**：28 项外观引擎、文字重排及组件测试通过；其页面上下文／顶部断言未覆盖页脚。加入文档前，源码快照的 `make check` 通过 64 项非浏览器测试。加入文档后，站点构建、Markdown、双语标题与站内链接检查通过；64 项非浏览器测试中 63 项通过，剩余 `llms.txt` golden 仅多出两份新英文文档的条目。

**主要测量矩阵**：Chromium：11 条有效路由 × 两个预设 × 两种模式 × 中英文 × 320/390/768/1440px × 基线／覆盖样式。Firefox／WebKit 仅覆盖 Presentation／Configuration／Book，宽度 320/1440px。正常字号未观察到整页溢出。

**计数校正**：初始账本的 960 项是计算状态观察。错误 API 路由造成 32 次测试工具 404；纠正后的 `/docs/write/openapi/` 补充了 64 项有效观察，均为 HTTP 200 且无整页溢出。

**补充压力探测**：64 项同时覆盖间距的观察使用行高 1.5、段落 margin 2em、字距 .12em、词距 .16em，未观察到整页／标题溢出。16 项 320px 连续长标题／Field 标签探测保留了文字，未出现整页溢出。

**axe**：32 次 390px 正文扫描覆盖 Presentation／Configuration、两种语言／模式／预设及基线／覆盖样式。未报告违规，仅在包含非文字字符且带 `aria-hidden=true` 的翻页箭头 span 上留有对比度待复核项，需人工核对图形对比度。

**视觉材料**：归档含 352 张对比图，包括 Blog／Expo／Mermaid／ECharts 场景，另有 8 张外部参考图，从中抽检了代表性桌面／移动、深浅色页面与控件。

**长文阅读**：真实中英文 `/blog/oink/oink-implementation-diary/` 长文检查四组条件：Ink 英文／1440／浅色、Ink 中文／390／深色、Terminal 英文／390／浅色、Terminal 中文／1440／深色。基线／覆盖样式各取顶部／中段／页脚，共新增 24 张图片；正常字号的整页溢出均为零。检查了 8 张代表图，包括英文正文前后对比、中文正文、Terminal 英文手机页脚及 Ink 英文桌面开头。

Chromium 路由包括首页、Presentation、Configuration、Fields、Code、Table、Book 结构、沉浸阅读 Blog、Expo studies、Mermaid、ECharts，以及纠正后的 OpenAPI 指南，并覆盖中文对页。后续截图还验证了首个 Mermaid 渲染图与 ECharts canvas。对比画廊有 11 个场景，其中 7 个控件场景覆盖两个预设、两种模式、两种语言与两种宽度。主要矩阵阻止了包括 Giscus 在内的站外请求。

### 覆盖样式只验证有限的编辑调整 {#overlay}

Ink 保留配色／字体，将正文 `h1` 从 800／`-.035em` 改为 750／`-.025em`，`h2/h3` 从 750／`-.025em` 改为 700／`-.012em`，将 2px 强调色顶线改为既有强线条角色的 1px 线。取消次级／表格／提示块标题的强制大写与字距，中文标题字距归零；原生下划线比较使用 `max(1px,.06em)`／`.22em`，中文另比较 `.25em` 与 `skip-ink: none`。

Terminal 保留青绿／薄荷色及琥珀色，标题使用 600 字重／零字距，移除生成的标题前缀与提示块括号，将描述性表头改为正文 `0.875rem/600`、搜索标题／摘要改为正文角色，并将装饰性代码／Tabs／表格／提示块边框降为既有边框角色。技术路径／控件仍为等宽，Field 名称仍无框。此前漏入预设形状规则的 FileTree 固定 0.6rem 圆角，改为 Ink 0px／Terminal 2px。扁平 Tabs、移动目标及 vendor 边界保持不变。**覆盖实验仅验证 CSS 样式调整，未新增主题模板、字体、运行时或配置。**

真实页面的作者强调色为文档蓝色 `#245f94/#5da2dd`、Book 橙色 `#9a3412/#fb923c`、Blog 紫色 `#6d28d9/#a78bfa`。单独标注的配色探针在两个变体上仅把作者强调色重置为预设默认值，用于受控对照。[架构契约](/zh/docs/design/architecture/#visual-presets) 保留覆盖优先级与共用外壳。

### 配色计算揭示状态风险 {#contrast}

不透明 sRGB 配对与 alpha 合成计算使用源码 token 和 WCAG 亮度公式；展示比值经过四舍五入，是否通过则使用未舍入值（[对比度方法](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)、[配色源码](https://github.com/pgsty/oink/blob/v1.3.2/assets/scss/td/_experimental-presets.scss)）。

| 配对，浅色／深色 | 计算对比度 | 含义 |
| --- | --- | --- |
| Ink 强调色 `#c8102e`／白色，`#ff5c4d`／`#0b0b0b` | 5.88 / 6.46 | 保留分模式红色；控制红色装饰线的出现频率，保持重点突出。 |
| Terminal 正文／画布 | 14.88 / 13.64 | 中性阅读配对具有充足对比度。 |
| Terminal 链接／画布及次级界面 | 6.31 / 9.54；5.75 / 8.73 | 既有青绿／薄荷色适用于这些具体界面。 |
| Terminal 第三级文字／次级界面 | 4.63 / 5.93 | 浅色弱化文字继续加色或降低不透明度的余量较小。 |
| Terminal 琥珀色／画布 | 5.47 / 9.44 | 琥珀色继续承担独立强调角色。 |
| Terminal alpha 32% 边框／画布 | 1.97 / 2.36 | 适合装饰性分隔线；不足以单独标识必要控件或状态。 |
| Terminal alpha 55% 强线条／画布 | 3.63 / 4.73 | 可作为这些画布上的功能边界候选。 |
| 白色／深色模式薄荷色 `#4cc9bd` | 2.02 | 避免在浅薄荷色填充上使用白色文字标签。 |

跨模式复用不满足普通文字对比度：薄荷色／浅色画布为 1.85，深青绿／深色画布为 2.79。语义色、作者强调色、语法注释、选中搜索摘要、焦点与文字选择合成色仍需逐状态评审。非文字对比度针对必要的识别边界（[WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)）。

## 成熟先例支持角色分工，不支持照搬 {#precedents}

所有外部参考访问日期均为 **2026-10-26**。外部 Chromium 在 1440/390px 渲染 Tufte、GOV.UK Headings、Effective Go 和 A List Apart，均返回 HTTP 200。保存了 8 张截图，重点检查了 **Tufte 桌面、GOV.UK 移动、Go 移动、A List Apart 桌面** 视图；其余先例通过源码审查。

**[Practical Typography](https://practicaltypography.com/typography-in-ten-minutes.html)**。优先处理正文，提出面向拉丁文字的字号、间距与行长建议；其 [下划线观点](https://practicaltypography.com/underlining.html) 反对链接下划线。

先审查完整段落，再调整展示标题，同时保留 OINK 的双语排版节奏与开源字体约束。

**[Tufte CSS](https://edwardtufte.github.io/tufte-css/)**。已检查的桌面视图具有窄衬线阅读栏和下划线。[CSS](https://edwardtufte.github.io/tufte-css/tufte.css) 声明 ET Book、浅色 `#fffff8/#111`、深色 `#151515/#ddd` 及移动端注释开关。

借鉴解释与插图的邻近关系及注释层级；衬线与边注布局留待后续 Folio 探索。

**[GOV.UK Headings](https://design-system.service.gov.uk/styles/headings/)**。已检查的移动视图有充足的无衬线标题与下划线链接，Cookie 横幅可见。当前 [字号阶梯](https://design-system.service.gov.uk/styles/type-scale/) 在小屏／大屏均使用 19px/25px 正文。[链接](https://design-system.service.gov.uk/styles/links/) 区分正文与导航，[表格](https://design-system.service.gov.uk/components/table/) 强调结构。

对 Ink 无衬线层级及持续链接提示最有直接参考价值，并适配 OINK 的双语字号与深色模式。

**[A List Apart：A Dao of Web Design](https://alistapart.com/article/dao/)**。已检查的桌面视图区分衬线正文与无衬线标题／控件。[当前 CSS](https://alistapart.com/wp-content/themes/ala/style.css?ver=1757090064) 使用 Georgia `1.125rem/1.7`、红色 `#ba3925` h2 与蓝色链接。

分离阅读／界面／代码角色并保持内容适应性，同时维持 Ink 的无衬线定位和克制的红色强调频率。

**[Rust Book：Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)**。源码呈现编号章节、解释与代码；[CSS](https://doc.rust-lang.org/book/css/general-e96d0476.css) 分离 Open Sans 正文与等宽代码。

是 Terminal 区分解释／语法及保留真实章节编号的重要先例，同时保留 OINK 的等宽标题与标准浏览器快捷键。

**[Effective Go](https://go.dev/doc/effective_go)**。源码／CSS 分离平台无衬线与等宽；已检查的移动目录密集且为两列。

借鉴直接的技术层级，同时保留 OINK 自身的响应式目录。

**[man7 open(2)](https://man7.org/linux/man-pages/man2/open.2.html)**。稳定的参考分区、签名、链接及预格式化文字；`(2)` 表示手册分区。

保留可预测的查阅结构与完整标识符，不把双语正文排成固定终端字符格。

**[CLI Guidelines](https://clig.dev/#output)**。有导航结构的解释性网页指南，建议有意且有限地使用颜色。

借鉴克制与清晰标签，同时保持标准网页交互语义。

Paper 的温暖通用阅读、Slate 的既有技术展示、Ink 的中性编辑克制、Terminal 的技术角色对比，可以在同一外壳中保持鲜明区分。

## 语言与无障碍需要独立证据 {#language-accessibility}

macOS 上的 Chromium 逐字形检查确认：Ink 拉丁文字使用 Inter，Terminal 正文使用 IBM Plex Sans，标题使用 IBM Plex Mono，两者中文均使用 PingFang SC。Windows 与 Android 的回退字体表现仍需在真实设备上核验（[CSS 字体匹配](https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm)、[Windows 字体](https://learn.microsoft.com/en-us/typography/fonts/windows_11_font_list)、[Android 回退](https://source.android.com/docs/core/fonts/custom-font-fallback)）。

中文下划线与字形的间距仍待定稿。CSS Text Decoration 工作草案解释了汉字碰线与跳墨碎裂问题；CLReq 工作组说明草案讨论行间标记，但没有禁止超链接下划线。后续应比较按语言限定的 `text-underline-position: under` 加小偏移，先使用 `skip-ink: auto`，覆盖英文页内中文和混排跨行链接（[CSS 草案](https://www.w3.org/TR/css-text-decor-4/#text-underline-position-property)、[CLReq](https://www.w3.org/TR/clreq/)）。

WCAG A／AA 规定非颜色语义、文字／非文字对比度、键盘操作、放大、重排、间距、语言及状态播报。OINK 拟议的 44px 常用触控目标、7:1 正文及更强的 2px 面积焦点处理，作为高于 AA 下限的项目目标单独追踪（[WCAG 2.2](https://www.w3.org/TR/WCAG22/)、[axe-core](https://github.com/dequelabs/axe-core)、[焦点外观](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)）。

仍待完成：真实 Windows／Android 的字体加载／阻止／系统字体对比，品牌版 Safari／iOS 渲染，人工 NVDA、VoiceOver、TalkBack 任务，完整手动 200%／400% 缩放，以及覆盖导航、Book 编号、表格关系、字段错误、中文搜索输入、状态反馈及对话框返回焦点的全面键盘、强制颜色和状态对比度审查。

## 稳定化应以完整阅读验收为前提 {#implications}

页脚溢出表明，除了正文顶部检查外，还必须补齐整页回归测试。因此共用修复与整页回归应先于预设升级。FileTree 的圆角遗漏和 Terminal 装饰标点竞争属于可以在现有模块内收敛的调整。

1.4 应精修既有实现，待门禁关闭后分别决定 Ink 或 Terminal 是否升级；否则保持实验状态。Folio（学术衬线）与 Canvas（创作者几何风格）继续暂缓，避免在本周期引入额外的字体许可与 QA 成本。
