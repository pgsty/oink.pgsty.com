---
title: 为大表格腾出阅读空间
linkTitle: 大表格阅读研究
description: 文档框架与表格组件证据、阅读概念测量，以及 OINK 技术表格的有限候选方向。
design_kind: research
design_status: candidate
date: 2026-10-26
research_date: 2026-10-26
owner: OINK maintainers
---

> [!NOTE] 历史研究；当前行为见 1.4.0 决策
> 研究日期：2026-10-26。本研究为 OINK 1.4.0 的表格阅读设计提供了依据。[接受的决策](/zh/docs/design/decisions/large-table-reading/) 与 [表格指南](/zh/docs/components/table/) 描述已发布行为，并替代下文的入口与范围建议。

**通过显式“阅读表格”操作打开大型原生对话框，是最值得继续评估的候选方案。** 它给桌面表格增加空间，同时保留文字大小、原表语义和简短的返回路径。许多表格只需在正文内拓宽；实测扩展包样本在桌面端采用这种模式就已能容纳全部列。在 390px 视口下，对话框仅增加 16px 宽度，窄屏下仍保持横向滚动。五个文档框架默认均采用原生表格配横向滚动容器，而第三方表格库在提供数据操作的同时也增加了集成与维护负担。

## 分清布局、内容与发布状态的证据 {#method}

当时的公开标签快照为 [v1.3.2](https://github.com/pgsty/oink/releases/tag/v1.3.2)，标签引用为 `68cfbbdc177064e2c28277c09c385d78e5363ffd`。研究开始时，主题 HEAD 为 `7bc8658bc1be13ef0ad3050b9d9f6862f8f1f65f`，站点 HEAD 为 `99751179eefada3fa7a91318c792ddac46d7e6bf`，两个工作树均有未提交修改。本实验中验证的短标记 `.wide` 随后纳入 OINK 1.4.0，详见 [组件契约](/zh/docs/design/components/#steps-cards-fields-and-tables)。

本地检查的模块包括 `oink/layouts/_partials/content/table-render.html`、`table-body.html`、`assets/scss/td/_content.scss`、`_table.scss`、预设与字体令牌，以及界面协调器。`.wide`/`.td-table--wide` 控制内在尺寸和标识符换行；`.full-width` 使用文章可用画布。`.matrix` 提供首列行表头、受限高度的双轴滚动，以及现有粘性表头/首列 CSS。该 CSS 给每个表头设置 `top:0`，未计算多行累计偏移，也未设置移动端首列宽度上限。`.fields` 输出定义列表。普通题注位于表格内部，编号 Book 表格题注位于外层 figure（见 [表格指南](/zh/docs/components/table/) 和 [输出契约](/zh/docs/design/architecture/#outputs-and-runtime)）。

| 选取的下游站点源文件 | 有限样本与用途 |
| --- | --- |
| `pigsty.cc/content/docs/infra/param.md`，NGINX 分组 | 4 列 × 14 行正文；带链接的参数标识符与描述 |
| `pgext/content/list/pkg.md`，第 44–69 行 | 6 列 × 24 行正文；扩展包/版本/仓库/分类/RPM/DEB 比较 |
| `pigsty.cc/content/docs/ref/linux.md`，概览 | 8 列 × 14 行正文；OS/架构及 PG18–PG14 支持状态 |
| `piglet.run/content/docs/reference/vscode/_index.md` | 2 列 × 7 行正文；小表格反例 |

下游站点快照分别为：`pigsty.cc` 的 `efaf7b19b442ddb284106418c78854552d949e9e`、`pgext` 的 `ab87fc7e5707d57f55129d3c45874abcc16fdef8`、`piglet.run` 的 `5a1572e6f9110cd5e8ef6e75cd50d9c4b6429f98`；均固定使用 OINK v1.3.2。另一张包含 616 行的扩展目录不在本次原型测试范围内。

这些样本区分了 **多列**、**多行**、**长单元格** 和 **复杂表头**。拓宽视口主要帮助第一类；粘性定位帮助第二类；换行帮助第三类。多行和合并表头需要显式关联与偏移计算。原型所选表格均只有单行表头且无合并单元格。GFM 管道表格语法本身定义单行表头和行内单元格内容（[GFM 表格](https://github.github.com/gfm/#tables-extension-)、[WAI 多级表头](https://www.w3.org/WAI/tutorials/tables/multi-level/)）。

## 五个框架以溢出处理为共同基线 {#frameworks}

调研检查了五个文档框架的官方文档与默认主题源码。**五个框架默认均不提供独立的全屏表格阅读器。** 文档链接对应 2026-10-26 读取的页面；源码链接锁定具体提交。

| 框架快照 | 默认表格行为 | 可选或自定义边界 |
| --- | --- | --- |
| Material for MkDocs，`0f044dbe`，2026-10-24 | Markdown `tables`；将原表包入局部横向滚动容器，并保留未包装回退 | 排序通过按需接入 Tablesort 5.3.0 实现；默认不提供阅读器、固定列或表格复制（见 [指南](https://squidfunk.github.io/mkdocs-material/reference/data-tables/) 与 [CSS](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/src/templates/assets/stylesheets/main/_typeset.scss#L464)）。 |
| Docusaurus Classic 3.10.2，`f37f9035`，2026-07-10 | MDX/GFM 渲染表格；Infima 0.2.0-alpha.45 使用 `display:block; overflow:auto` | 通过 MDX/remark/rehype 提供自定义扩展（见 [MDX 映射](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/packages/docusaurus-theme-classic/src/theme/MDXComponents/index.tsx#L23) 与 [Infima CSS](https://github.com/facebookincubator/infima/blob/205b8aedc62496839991b75a8bc2922350766fe4/packages/core/styles/content/table.pcss#L24)）。 |
| VitePress 1.6.4，`1fc537b7`，2025-08-05；2.0.0-alpha.21 快照 `d6d7a970`，2026-10-26 | 两个快照均使用块级表格和横向溢出 | 2.0 快照默认增加 `tabindex="0"`；可通过 Vue 组件定制交互（见 [1.6.4 CSS](https://github.com/vuejs/vitepress/blob/1fc537b78cda287fa23c1129a815ad9455fd8106/src/client/theme-default/styles/components/vp-doc.css#L166) 与 [2.0 焦点插件](https://github.com/vuejs/vitepress/blob/d6d7a970fa9cd6424ae6f357bc2931565b44b3dc/src/node/markdown/plugins/table.ts)）。 |
| Astro Starlight 0.42.7 快照 `af9557ea`，2026-10-24 | Markdown 表格样式使用 `display:block; overflow:auto` | `.not-content` 提供样式隔离；整页阅读与代码全屏由社区插件提供（见 [CSS](https://github.com/withastro/starlight/blob/af9557ea8c957173ea9174e19a87d80fce22a983/packages/starlight/src/style/markdown.css#L134) 与 [插件目录](https://starlight.astro.build/resources/plugins/)）。 |
| Nextra 4.6.5 快照 `d6e80e1d`，2026-06-23 | 官方 `Table` 组件包装带样式和横向溢出的 HTML | 字面 MDX `<table>` 需显式使用 `Table` 或加入白名单（见 [源码](https://github.com/shuding/nextra/blob/d6e80e1dd627b781429a6ee989b15ebba688c8ea/packages/nextra/src/client/mdx-components/table.tsx) 与 [HTML 边界](https://nextra.site/docs/advanced/table#literal-html-tables)）。 |

所检查代码的许可证均为 MIT：[Material](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/LICENSE)、[Docusaurus](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/LICENSE)、[VitePress](https://github.com/vuejs/vitepress/blob/d6d7a970fa9cd6424ae6f357bc2931565b44b3dc/LICENSE)、[Starlight](https://github.com/withastro/starlight/blob/af9557ea8c957173ea9174e19a87d80fce22a983/LICENSE) 和 [Nextra](https://github.com/shuding/nextra/blob/d6e80e1dd627b781429a6ee989b15ebba688c8ea/LICENSE)。Docusaurus 文档另用 [CC BY 4.0](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/LICENSE-docs)。

对静态 Hugo 站点，直接适用的模式是语义 HTML、局部滚动、构建期焦点属性和可选渐进增强。Material 的 [挂载代码](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/src/templates/assets/javascripts/components/content/table/index.ts#L23) 使用 RxJS；Classic 使用 React/MDX，VitePress 使用 Vue/Vite，Starlight 使用 Astro，Nextra 使用 Next/React。

## 丰富组件增加数据操作，也增加维护责任 {#components}

当前版本差异明显。**DataTables 3.1.4 已不再依赖 jQuery**。**TanStack Table 9.3.1** 使用 `constructTable`、按需功能选择和 Store 响应式绑定（见 [DataTables v3 依赖边界](https://datatables.net/manual/core/jquery) 和 [TanStack v9 公告](https://tanstack.com/blog/announcing-tanstack-table-v9)）。

| 组件 | 适用方向与可用操作 | 集成与维护边界 |
| --- | --- | --- |
| DataTables 3.1.4，2026-10-13 发布；MIT，核心无必选运行时依赖 | 通过内部数据模型增强 HTML 表格；核心提供排序/搜索/分页；Buttons、FixedColumns、FixedHeader、Scroller 可选 | 最接近系统化表格操作的候选方案。滚动可能复制或移动表头；支持复杂 `thead`，不支持 `tbody` 跨格（见 [发布](https://cdn.datatables.net/3.1.4/)、[发布包](https://registry.npmjs.org/datatables.net/-/datatables.net-3.1.4.tgz)、[跨格限制](https://datatables.net/manual/core/tech-notes/18)）。 |
| Tabulator 6.7.1，2026-10-22 发布；MIT，无必选运行时依赖 | 网格渲染、排序/筛选、冻结列、列分组、剪贴板和虚拟渲染 | HTML 导入器读取首个 tbody 的 `td`，会丢失 `.matrix` 的行表头 `th` 语义，且不保留通用 caption/scope/headers（见 [发布](https://github.com/tabulator-tables/tabulator/releases/tag/6.7.1)、[发布包](https://registry.npmjs.org/tabulator-tables/6.7.1)、[导入器](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/HtmlTableImport/HtmlTableImport.js)）。 |
| TanStack Table core 9.3.1，2026-10-12 发布；MIT，依赖 `@tanstack/store ^0.11.2` | 无界面的排序/筛选/固定/选择/跨格逻辑；支持 vanilla 集成 | 维护者需自行实现 HTML 导入、渲染、控件、样式、焦点、导出和对话框；虚拟化器另行接入（见 [元数据](https://registry.npmjs.org/@tanstack/table-core)、[固定版本包](https://registry.npmjs.org/@tanstack/table-core/-/table-core-9.3.1.tgz)、[vanilla 指南](https://tanstack.com/table/latest/docs/framework/vanilla/quick-start)）。 |

DataTables 的 FixedHeader/FixedColumns 是可选扩展；Scroller 要求等高行，不适合自动换行的技术描述。Tabulator 输出面向单元格导航的 ARIA grid 结构。TanStack 跨格 API 需要显式定义列，不支持任意 HTML 合并格的无损导入。上述发布包均未内置全屏阅读对话框（Tabulator 的 `printFullscreen` 用于打印布局）（见 [Scroller](https://datatables.net/manual/extensions/scroller/)、[Tabulator 导航](https://www.tabulator.info/docs/6.x/navigation/)、[Print 源码](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/Print/Print.js)、[TanStack 跨格指南](https://tanstack.com/table/latest/docs/framework/react/guide/cell-spanning)）。

复制默认行为也各不相同。Buttons 4.1.2 按当前排序/筛选规则导出显示数据并为跨格位置补空值，默认不开启公式转义。Tabulator 6.7.1 用 TAB 和换行拼接单元格值，不做通用引号包裹或公式转义。Tablesort 5.7.1 是轻量的无依赖 MIT 排序库，保留原表行并支持表头 Enter 键触发，不含阅读器、筛选或导出层（见 [Buttons 源码](https://github.com/DataTables/Dist-DataTables-Buttons/blob/4.1.2/js/dataTables.buttons.js)、[Tabulator Clipboard](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/Clipboard/Clipboard.js)、[Tablesort 源码](https://github.com/tristen/tablesort/blob/5.7.1/src/tablesort.js)）。

### 比较交付字节时同时说明排除项 {#delivery-cost}

测量使用 14 个固定版本 npm tarball，并核对 registry integrity。发布者提供的 minified 文件按原样测量。Gzip 使用 Python 3.14.8、zlib 1.2.12 和 `gzip.compress(data, compresslevel=9, mtime=0)`；合计为各文件分别压缩后相加。

| 测量的交付内容 | Minified 字节 | Gzip-9 字节 |
| --- | ---: | ---: |
| DataTables 3.1.4 核心 JS + 默认 CSS | 153,523 | 46,181 |
| 上述内容 + Buttons 4.1.2、FixedColumns 6.1.1、FixedHeader 5.1.2 JS/CSS | 249,015 | 72,480 |
| Scroller 3.1.1 JS/CSS，另加 | 13,300 | 4,389 |
| Tabulator 6.7.1 完整 UMD JS + 默认 CSS | 483,872 | 107,512 |
| TanStack 9.3.1 所选阅读器逻辑，本地打包 | 49,505 | 14,248 |
| TanStack 9.3.1 全部 core 导出及绑定/渲染辅助，本地打包 | 115,146 | 30,983 |
| TanStack virtual-core 3.19.7，独立本地打包 | 32,872 | 9,745 |
| Tablesort 5.7.1 核心 + 数值比较器 | 3,756 | 1,763 |

DataTables 核心 JS 为 123,516/42,338 字节，CSS 为 30,007/3,843 字节（minified/gzip）。扩展合计使用 [Buttons](https://registry.npmjs.org/datatables.net-buttons/-/datatables.net-buttons-4.1.2.tgz)、[FixedColumns](https://registry.npmjs.org/datatables.net-fixedcolumns/-/datatables.net-fixedcolumns-6.1.1.tgz)、[FixedHeader](https://registry.npmjs.org/datatables.net-fixedheader/-/datatables.net-fixedheader-5.1.2.tgz)、[Scroller](https://registry.npmjs.org/datatables.net-scroller/-/datatables.net-scroller-3.1.1.tgz) 及匹配的 `-dt` CSS。可选样式适配 JS 为四包合计另加 2,501/1,279 字节，Scroller 适配器另加 650/326，不含初始化、对话框、本地化、JSZip/pdfmake 和 source maps。Buttons 复制实现已在主文件中，不重复计入兼容 shim。[Tabulator 完整包](https://registry.npmjs.org/tabulator-tables/-/tabulator-tables-6.7.1.tgz) 包含全部内置模块；[Tablesort](https://registry.npmjs.org/tablesort/-/tablesort-5.7.1.tgz) 仅提供排序功能。

TanStack 测量来自本地 esbuild 打包：使用 Node 26.12.0/npm 11.20.0、esbuild 0.25.11，将 core 9.3.1 与 Store 0.11.2 以 `--bundle --minify --format=esm --platform=browser --target=es2020 --legal-comments=inline` 及生产 `NODE_ENV` 打包。所选入口导出 `constructTable`、`tableFeatures`、排序/筛选/固定/跨格功能、排序/筛选行模型、`storeReactivityBindings` 和 `FlexRender`。全部核心入口导出 core 命名空间及后两个辅助项；虚拟化入口单独导出 virtual-core。Metafile 确认无外部 import。**14,248 字节 gzip 的逻辑样本仅包含无界面状态管理，不含 UI、CSS、HTML 导入器、无障碍控件、对话框、复制器或虚拟化器**（见 [core 包](https://registry.npmjs.org/@tanstack/table-core/-/table-core-9.3.1.tgz)、[Store](https://registry.npmjs.org/@tanstack/store/0.11.2)、[Virtual](https://registry.npmjs.org/@tanstack/virtual-core/-/virtual-core-3.19.7.tgz)）。

## 概念验证中的桌面拓宽收益远大于手机 {#prototype}

外部原型使用真实同级文档站 Hugo 构建，内容通过仓库外挂载。PGEXT 专用短代码转成显式标签/链接，参数片段链接解析到原始来源 URL，支持状态图标增加“Supported”文字等价项。新增题注和 `.wide` 作为实验适配，各阅读模式复用相同的生成表格数据。构建使用同级主题替换，关闭两个 workspace 机制，并将输出、缓存和资源目录放在仓库外。

比较外壳采用 230px 侧栏、桌面主区 40px 留白、68ch 正常正文宽度与 1130px 可用画布，表格与预设样式来自实际生成的 OINK CSS 与字体。另行生成的真实表格指南页面测得桌面表格视口为 770px、移动端为 358px。

| 扩展包表格滚动视口 | 正常正文宽度 | 正文内拓宽 | 原生对话框 | 独立页面模式 |
| --- | ---: | ---: | ---: | ---: |
| 桌面 Paper/Terminal | 652.80px | 1130px | 1358px | 1408px |
| 桌面 Slate/Ink | 686.38px | 1130px | 1358px | 1408px |
| 移动端，全部四种预设 | 358px | 358px | 374px | 374px |

这些是本地 `qa.json` 在 1440×1000 和 390×844、DPR 1 下的测量；各预设深浅色几何尺寸一致。文字始终保持 **16px**，代码 **14px**。移动端表格内在宽度约为 969–1009px。桌面正文内拓宽已能容纳六列样本；对话框主要增加受限高度、常驻控件，以及与正文隔离的阅读视野。桌面对话框的表格可见高度为 847.20px，页面模式为 897.20px；移动端因控件换行，对话框高度为 711.02–741.20px。

正文内拓宽的上下文切换成本最低。对话框增加桌面空间，并保留直接返回文章的路径。独立页面在桌面上只多 50px，移动端宽度不变；其优势在于可重新加载与 URL 分享，但返回时不保留原文章滚动位置与焦点。三种模式均不缩放文字，也不调用 Fullscreen API。

通过 Playwright 1.62.1 驱动的 Chromium **151.0.7922.34** 检查了 **16 组预设 × 深浅色 × 设备组合**，每组包含三个阅读概念与基线。扩展包样本通过原节点身份、ID 唯一性、题注/表头 scope、样式/字体加载、标题初始焦点、Enter 打开、Escape/关闭返回、正反 Tab 边界、工具栏稳定性、控件与表格区域分离、页面模式重载检查。未记录整页溢出；另检查了三个移动端样本和 320px Terminal/深色溢出探针。单独检查保留了链接目标与文字选择，并把正文内横向滚动恢复到 180px。截图审阅覆盖 48 张概念截图和总览图，且 Paper/浅色/桌面对话框的 axe 扫描报告零违规。

参数与版本样本的首列分别占 374px 移动端阅读视口的 59.3% 和 58.3%，说明移动端适合加入可选的首列宽度上限。各预设保持鲜明区分：Paper 的 Plex Sans 与克制边框、Slate 的 Inter 与圆角控件、Ink 的平面利落几何，以及 Terminal 的等宽控件和 Plex Sans 正文。

复现材料包括仓库外保存的构建器、源码清单/哈希、生成的参考输出、QA/检查 JSON 和截图集，使用 macOS ARM64 上的 Hugo 0.168.0+extended+withdeploy、Go 1.27.3，以及 Node 26.12.0、npm 11.20.0、Python 3.14.8。

本原型验证聚焦 Chromium 桌面与触屏模拟下的单行表头场景；Firefox/WebKit、屏幕阅读器测试、强制颜色、200/400% 缩放、合并表头、协调器集成及打开状态下打印归入正式实现验收。

## 小型阅读器更容易保全现有文档 {#direction}

建议首期采用显式 **阅读表格** 操作、原生对话框，以及原节点的一次移动/恢复生命周期。只靠悬停无法兼顾触屏和键盘发现；整表点击会与选择、链接、滚动冲突。可见标题/关闭控件、具名滚动区、标题初始焦点、受限 Tab 导航、Escape，以及带保护的焦点/滚动恢复，都是核心要求。复用 OINK 界面协调约定。接近全视口的对话框与浏览器全屏不同，后者的标准不允许把 `<dialog>` 作为请求目标（见 [APG 对话框](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) 与 [Fullscreen Standard](https://fullscreen.spec.whatwg.org/#dom-element-requestfullscreen)）。

保留 caption/th/scope/headers 和原 ID。移动原表可避免克隆冲突与状态分叉，但继承样式、外层编号题注、外部 ARIA 引用及脚注仍需显式处理。原生表格可以包含链接和排序按钮，无需转为 ARIA grid。先支持单行粘性表头，复杂表头在累计偏移验证前保持普通滚动。默认使用舒适间距，紧凑模式只改内边距、不改字号。可选首列固定需给移动端留出充足的阅读宽度（见 [APG table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)、[APG grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)、[表头语义](https://html.spec.whatwg.org/multipage/tables.html#header-and-data-cell-semantics)）。

`.wide`/`.td-table--wide` 仍只控制布局，`.full-width` 仍受文章画布限制，`.matrix` 保留语义，`.fields` 不启用阅读器。无 JS 时内容保持可读；Print 展开静态表格，Markdown 保留源内容，RSS 保留静态/摘要边界且不混入阅读控件。

若后续增加 TSV 复制，建议按作者顺序复制 **整张符合条件的表格**（含视口外的行列）：链接转为文本标签，代码保留文本，排除隐藏控件与装饰符号，有实际含义的图标提供文字等价项。首期拒绝隐藏数据行/列、嵌套表格、行长不等、多行表头，以及任何 DOM `rowSpan`/`colSpan` 不为 1 的情况（包括 `rowspan="0"`），使用 TAB 分隔列、LF 分隔行、规范化单元格内空白，并对跳过前导空白后以 `= + - @` 开头的单元格前置单引号（见 [HTML 表格模型](https://html.spec.whatwg.org/multipage/tables.html#processing-model-1)、[DOM 文本](https://dom.spec.whatwg.org/#dom-node-textcontent)、[Clipboard 2026-06-24 工作草案](https://www.w3.org/TR/2026/WD-clipboard-apis-20260624/#clipboard-interface)、[OWASP 电子表格注入限制](https://community.owasp.org/attacks/CSV_Injection)）。

聚焦原生表格的小型阅读器既保留未来引入数据网格的可能，也避免立即维护第二套数据模型。缩减后的实现边界见 [接受的决策](/zh/docs/design/decisions/large-table-reading/#validation)。

## 审阅后接受的方向 {#accepted-direction}

维护者审阅后选择显式组合 `{.wide .expand}` 与角落直接展开按钮（悬停或聚焦时显示，触屏常显），排除表格上方工具栏、省略号菜单和 TSV 复制。最终发布行为由 [接受的决策](/zh/docs/design/decisions/large-table-reading/) 与 [当前契约](/zh/docs/design/components/#table-reading) 定义。
