---
title: 文档对照研究，2026-10-29
linkTitle: 文档对照研究
description: 面向不同语言与版本的 OINK 通用双栏阅读模式的带日期证据。
weight: 58
icon: fa-solid fa-columns
design_kind: research
design_status: dated-evidence
research_date: 2026-10-29
---

> [!NOTE] 历史研究；请参阅 1.5.0 决策
> 研究日期：2026-10-29。本记录是针对 OINK v1.4.0 的有界源码审查，为 OINK 1.5.0 的译文阅读器提供依据。
> [已接受决策](/zh/docs/design/decisions/document-comparison/)与[外壳契约](/zh/docs/design/shell/#translation-comparison)描述已发布行为，并取代下文建议。

## 范围与证据 {#scope-and-evidence}

本次问题是：OINK 如何为约 30–40 个本地站点提供通用对照阅读模式，覆盖译文、八语言集合、校对书籍、任意语言，以及同一语言的新旧版本。研究检查了 Docusaurus、VitePress、Material for MkDocs 与 mike、Read the Docs、Hugo、Sefaria、MediaWiki ContentTranslation、OmegaT、Weblate、Joplin、VS Code 和 CodeMirror。证据来自官方文档与固定源码版本；没有启动上游应用，也没有把仅凭源码检查推导出的行为称为浏览器验证。未固定修订的官方文档仅记录 2026-10-29 当日所读内容，不是不可变源码快照。OmegaT 证据限于 6.1.0 手册，不代表已检查实现。

| 项目 | 固定文档／源码修订 | 已核实的相关性 |
| --- | --- | --- |
| Hugo | v0.168.0 源码 [`e27a6760c5547237f87d353aebe0580feadb20f4`](https://github.com/gohugoio/hugo/commit/e27a6760c5547237f87d353aebe0580feadb20f4) | 页面关系与原生版本维度轮换（`.Rotate`），不提供段落对齐。 |
| Docusaurus、VitePress、Material/mike | [Docusaurus v3.10.2](https://github.com/meta/docusaurus/tree/f37f9035584917a97a260b91fc2842cba4f8b94f)、[VitePress v1.6.4](https://github.com/vuejs/vitepress/tree/1fc537b78cda287fa23c1129a815ad9455fd8106)、[Material 9.8.0](https://github.com/squidfunk/mkdocs-material/tree/0f72ad68d1bee212f909f3b82e0189e221b06374)、[mike v2.2.0](https://github.com/jimporter/mike/tree/b01e03075315ebd2d39a93c390cf14b6a83f3d5e) | 稳定文档 ID、显式锚点、版本元数据与目标存在性感知导航。 |
| Read the Docs 与 VS Code | RTD [`9b012b1df15fc153590b4db5f4da7bd3eb8ae74a`](https://github.com/readthedocs/readthedocs.org/commit/9b012b1df15fc153590b4db5f4da7bd3eb8ae74a)、Addons [`d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce`](https://github.com/readthedocs/addons/commit/d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce)、VS Code [`d7658021df8289f549bf2af8c8dec131f2580d69`](https://github.com/microsoft/vscode/commit/d7658021df8289f549bf2af8c8dec131f2580d69) | 真实 HTML/Markdown 渲染对照和映射预览；不能证明通用 OINK 阅读器。 |
| Sefaria 与 ContentTranslation | Sefaria [`af96a1a1695a6307a3d616493455a6802455be1b`](https://github.com/Sefaria/Sefaria-Project/commit/af96a1a1695a6307a3d616493455a6802455be1b)、ContentTranslation [`8d5dde493528330efcb373dc448f352e81815115`](https://github.com/wikimedia/mediawiki-extensions-ContentTranslation/commit/8d5dde493528330efcb373dc448f352e81815115) | 独立窗格和严格段落行是两种产品。 |
| Joplin、OmegaT、Weblate、CodeMirror | Joplin [`b48e75856d81152c32e71f21075e1c043d9ea922`](https://github.com/laurent22/joplin/commit/b48e75856d81152c32e71f21075e1c043d9ea922)、OmegaT Standard Manual 6.1.0、Weblate [`503129cadb056e2ea0db629fe8e37907b41ff054`](https://github.com/WeblateOrg/weblate/commit/503129cadb056e2ea0db629fe8e37907b41ff054)、CodeMirror [`53c8f7b213332743a1f4f7d26bf40cfe2b512b53`](https://code.haverbeke.berlin/codemirror/merge/src/commit/53c8f7b213332743a1f4f7d26bf40cfe2b512b53) | 逻辑滚动映射、人工对齐、稳定消息上下文和几何留白。 |
| DDIA 消费站样本 | `Vonng/ddia` [`a6b2e6f85e1249720c8a349273455190d2fc9515`](https://github.com/Vonng/ddia/commit/a6b2e6f85e1249720c8a349273455190d2fc9515) | 四个 Hugo 成员拥有重复中文 locale 和不同版次。 |

## 身份与关系建模结论 {#identity-and-relationship-lessons}

原始的通用对照范围需要区分候选集合身份、成员身份、Hugo site key、实际 locale 与方向、edition/version、规范 URL 以及锚点对应关系。语言代码不是文档身份。[固定修订的 DDIA 配置](https://github.com/Vonng/ddia/blob/a6b2e6f85e1249720c8a349273455190d2fc9515/hugo.yaml#L25)提供了具体案例：`zh`、`tw`、`v1`、`v1_tw` 是四个配置成员，包含重复的中文 locale 和不同版次。按 locale 去重会删除合法选择，也会把版次错误标成译文。

Hugo 0.168.0 可以作为可靠起点。[`.AllTranslations`](https://gohugo.io/methods/page/alltranslations/) 包含当前页，[`.Translations`](https://gohugo.io/methods/page/translations/) 排除当前页；显式 `translationKey` 可以关联路径不同的页面。[`.Rotate "version"`](https://gohugo.io/methods/page/rotate/) 可以在保持其它维度（包括语言和 role）的前提下适配原生版本维度。这个适配器对对照是可选的，不要求消费站重组内容，也不能与 OINK 的 `params.versions` 菜单混淆：后者是导航配置，不是语义伙伴解析器。自定义版本或 role 维度仍需显式适配，避免静默接受含义不明的原生匹配。

自动译文候选应先取实际 Hugo 页面关系，再通过资格过滤：已发布、已构建、可渲染的 HTML 兄弟页面；排除当前页面；排除作为语言导航回退的首页；当集合有边界时排除其它 role 或 version。导航链接证明目标地址存在，却不能证明它是译文或可比较文档。缺失译文必须保持缺失，不能在读者不知情时复制源文。

原始的通用设计为八语言集合提供两个选择器，不需要预生成 28 个配对页面，也不需要同时加载八份文档。同语言 v1/v2 对照使用两个成员 ID 和明确标签。同一身份模型也支持章节结构不同的校对书籍，不会把相同文件名或标题文字误认为对应关系。

## 现有工具实际比较了什么 {#what-existing-tools-actually-compare}

Docusaurus 的[文档身份](https://docusaurus.io/docs/create-doc#document-id)、[本地化](https://docusaurus.io/docs/i18n/tutorial)与[版本管理](https://docusaurus.io/docs/versioning)将 ID、slug、locale 和版本树分开，其[标题指南](https://docusaurus.io/docs/markdown-features/toc#heading-ids)建议本地化页面固定标题 ID。VitePress 的[语言 helper](https://github.com/vuejs/vitepress/blob/1fc537b78cda287fa23c1129a815ad9455fd8106/src/client/theme-default/composables/langs.ts)按当前相对路径构造语言链接，并支持[自定义锚点](https://vitepress.dev/guide/markdown#custom-anchors)，但该 helper 没有建立语义伙伴注册表。Material 使用 [mike 版本元数据](https://github.com/jimporter/mike/blob/b01e03075315ebd2d39a93c390cf14b6a83f3d5e/README.md)和[目标 sitemap](https://github.com/squidfunk/mkdocs-material/blob/0f72ad68d1bee212f909f3b82e0189e221b06374/src/templates/assets/javascripts/integrations/version/index.ts) 查找对应 URL；这能确认地址可用，不能确认语义等价。这些是身份和校验模式，不是原生双栏滚动证据。

Read the Docs 提供了本次检查中可以直接核对的渲染对照证据：其 [visual-diff 文档](https://docs.readthedocs.com/platform/stable/visual-diff.html) 和 Addons 的 [`docdiff.js`](https://github.com/readthedocs/addons/blob/d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce/src/docdiff.js) 对已渲染 HTML 正文进行比较、标记变化的 DOM 区域，并用 URL 状态保存模式。这是面向审阅流程的单页渲染差异。VS Code 的官方 [Markdown diff 文档](https://code.visualstudio.com/docs/languages/markdown#%5Fmarkdown-preview-in-diff-view) 和 [`diffScrollSync.ts`](https://github.com/microsoft/vscode/blob/d7658021df8289f549bf2af8c8dec131f2580d69/extensions/markdown-language-features/preview-src/diffScrollSync.ts) 展示了两个渲染预览、逻辑映射和反馈抑制，说明渲染对照与映射滚动可组合，但 OINK 的内容身份和静态托管边界仍需自行解决。

Sefaria 明确区分独立滚动的 Compare Text 和共用 segment 的双语阅读：固定源码 [`TextRange.jsx`](https://raw.githubusercontent.com/Sefaria/Sefaria-Project/af96a1a1695a6307a3d616493455a6802455be1b/static/js/TextRange.jsx) 把两种文本放进共享 segment，[`TextColumn.jsx`](https://raw.githubusercontent.com/Sefaria/Sefaria-Project/af96a1a1695a6307a3d616493455a6802455be1b/static/js/TextColumn.jsx) 则让比较列独立滚动。MediaWiki ContentTranslation 的 [`alignSectionPair`](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-ContentTranslation/8d5dde493528330efcb373dc448f352e81815115/modules/ui/mw.cx.ui.TranslationView.js) 使用稳定 section ID，并在一个编辑流程中对成对翻译区域进行高度与边距补偿。OmegaT 的 [Align Files 手册](https://omegat.sourceforge.io/manual-standard/en/chapter.windows.and.dialogs.html) 把自动匹配与人工拆分、合并、移动和接受结合起来。Weblate 的 [`Unit` 模型](https://github.com/WeblateOrg/weblate/blob/503129cadb056e2ea0db629fe8e37907b41ff054/weblate/trans/models/unit.py) 将 message ID、上下文和文本 hash 分开保存。CodeMirror 的 [`updateSpacers`](https://code.haverbeke.berlin/codemirror/merge/src/commit/53c8f7b213332743a1f4f7d26bf40cfe2b512b53/src/deco.ts) 展示了严格行对齐的几何成本。这些证据说明自动相似度可以提出关系建议，却不能为任意多语言 HTML 静默发布段落映射。

## 三种阅读语义 {#three-reading-semantics}

设计必须命名三种不同的行为。**独立滚动** 让每个窗格保留自己的位置，是每个有效配对的可靠回退。**按锚点联动** 保留两个独立窗格，在共同语义锚点之间估算对应进度；它只是邻近章节参考，不保证永久同行，也绝不能称为“逐段齐行”。**严格行对齐** 把实际块放入成对行，用最大行高和短侧留白，对应关系还需要一对多映射、缺失块占位和明确顺序策略。这是后续独立功能。

对 OINK，默认策略应检查映射质量：满足下述保守条件时才启用锚点联动，否则使用独立滚动。控制条始终允许读者关闭联动。零个或一个有效内部锚点、重复显式目标、缺失显式目标或移动后顺序非单调的配对，都保持独立阅读。普通未匹配章节属于内容缺口，不是无效目标。即使连续同步不可用，仍可提供“跳到对应章节”。

## 渲染与隔离结论 {#rendering-and-isolation-finding}

OINK 的 [v1.4.0 Docs 外壳](https://github.com/pgsty/oink/blob/v1.4.0/layouts/docs/baseof.html#L17)、[正文渲染](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/content/render.html)、[Book ID 处理](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/book/namespace-print-headings.html#L1)、Tabs、表格阅读器、图表和按能力选择的脚本，使任意正文拼入单 DOM 成为较大的重构。两个同源文档 frame 能保留每页自己的 `lang`、`dir`、资源基址、渲染上下文、ID 和阅读器所有权。frame 是文档边界，不是独立进程或安全沙箱；同源内容仍然属于受信内容。参见 [iframe 参考](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)与[同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin%5Fpolicy)。

最初考虑的路径先在两个同源 frame 中加载普通合资格 HTML 页面，并为导航、键盘快捷键、analytics、评论和递归对照入口增加守卫，再考虑可选的 content-only HTML view。收窄后的第一阶段实现继续使用普通页面；专用输出只有在测量证明值得时才作为未来优化。Hugo 参数本身不能创建 output format；辅助输出需要明确的 output plumbing、Page Store/能力处理、相对资源规则和 SEO 策略。

## 滚动模型与有界结论 {#scroll-model-and-bounded-conclusions}

可复用的引擎模式是 Joplin 的逻辑映射和 VS Code 的渲染预览映射。Joplin 的 [`scrollmap.js`](https://github.com/laurent22/joplin/blob/b48e75856d81152c32e71f21075e1c043d9ea922/packages/app-desktop/gui/note-viewer/scrollmap.js) 和 VS Code 的 [`diffScrollSync.ts`](https://github.com/microsoft/vscode/blob/d7658021df8289f549bf2af8c8dec131f2580d69/extensions/markdown-language-features/preview-src/diffScrollSync.ts) 支持收集有效布局锚点、在区间内线性插值并限制滚动边界。收窄后的译文 MVP 从共同稳定标题 ID 自动推导严格单调的映射，不需要另行编写或审阅配对映射。锚点交叉或重排就拒绝该映射；引擎不能静默选择 LIS、丢弃移动锚点或重排文档。字体、图片、图表、Tabs、details 或宽度改变布局时，几何必须失效。状态 owner 与 sequence token 防止程序滚动事件回传。用户应保留焦点和窗格所有权；普通滚动不能打开隐藏内容或移动焦点。

普通未匹配章节在页面和两侧包围它的锚点都有效时属于内容缺口；如果缺口被有效锚点夹住，阅读器可以标明这是近似区间并进行插值。在未来的人工映射功能中，显式目标不存在、重复或与另一个显式目标交叉，则属于无效映射；这会关闭该配对的连续同步，而不是回退到序号匹配。显式跳转仍可报告具体的无效目标。

这些证据支持一份聚焦提案，却不构成实现声明。这轮上游源码调查没有运行候选对照功能、服务器、浏览器、无障碍检查或八语言消费站，也没有证明每个框架都不存在插件或实验性对照模式。这些限制会进入提案的验收矩阵，推荐也因此保持克制：先验证普通 Docs/Book 双栏阅读，再决定更复杂输出或严格行对照是否值得维护成本。

## 第一阶段范围修正 {#phase-one-scope-revision}

根据 2026-10-29 的简化要求，配套提案现在假定已有翻译兄弟页和相同标题 ID。
唯一站点设置是 `params.ui.compare: true`。Hugo 提供现有翻译链接，浏览器选择一个
目标，用两个同源 frame 显示普通页面，并提供同步滚动开关。当前语言固定，仅目标
语言需要选择器。

上文较广泛的身份讨论保留为未来版本对照的研究。第一阶段无需 compare set、member
ID、人工锚点映射、CLI、新布局、新输出或预生成语言配对。Frame 加载普通页面就是
推荐的首版实现，不代表后续必须增加正文专用输出。原宿主页保留在阅读面之后，因此
两个子文档加上宿主页共占三个文档；先测量这个成本，再决定是否增加渲染路径。

## 来源链接 {#source-links}

- [Hugo 多语言页面](https://gohugo.io/content-management/multilingual/)、[`.AllTranslations`](https://gohugo.io/methods/page/alltranslations/)、[`.Rotate`](https://gohugo.io/methods/page/rotate/) 和 [Hugo v0.168.0 源码](https://github.com/gohugoio/hugo/blob/e27a6760c5547237f87d353aebe0580feadb20f4/hugolib/page.go#L455-L551)。
- [Docusaurus 标题 ID](https://docusaurus.io/docs/markdown-features/toc#heading-ids)、[VitePress 自定义锚点](https://vitepress.dev/guide/markdown#custom-anchors) 和 [mike 版本元数据](https://github.com/jimporter/mike/blob/b01e03075315ebd2d39a93c390cf14b6a83f3d5e/README.md)。
- [Read the Docs visual diff](https://docs.readthedocs.com/platform/stable/visual-diff.html)、[RTD DOM diff 源码](https://github.com/readthedocs/addons/blob/d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce/src/docdiff.js) 和 [VS Code Markdown diff](https://code.visualstudio.com/docs/languages/markdown#%5Fmarkdown-preview-in-diff-view)。
- [Sefaria 双栏阅读](https://help.sefaria.org/hc/en-us/articles/18612972070684-How-to-View-Texts-Side-by-Side)、[Joplin sync-scroll 规范](https://joplinapp.org/help/dev/spec/sync%5Fscroll/) 和 [MDN iframe 策略](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)。
- [OINK v1.4.0 language targets](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/language-targets.html) 与 [OINK v1.4.0 content rendering](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/content/render.html)。
