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

> [!NOTE] 带日期的研究；不是已实现功能
> 负责人：OINK 维护者。研究日期：2026-10-26，Asia/Shanghai。此候选研究为可能的 1.4.0 方向提供依据，涉及组件、架构、阅读外壳与迁移，但不改变这些契约。后续[接受的决策](/zh/docs/design/decisions/large-table-reading/)已替代下文的入口与范围建议；本页保留为历史证据。

**通过显式“阅读表格”操作打开大型原生对话框，是最值得继续评估的候选方案。** 它给桌面表格增加空间，同时保留文字大小、原表语义和简短的返回路径。许多表格只需在正文内拓宽；实测扩展包样本在桌面端采用这种模式就已能容纳全部列。在 390px 视口下，对话框仅增加 16px 宽度，不能消除横向滚动。五个文档框架共同支持的是原生表格与溢出处理这一较简单基线；更丰富的表格库提供数据操作，也增加集成成本。外部概念验证支持一个阅读方向，不代表版本验收、无障碍认证，也不意味着已经决定交付 TSV。

## 分清布局、内容与发布状态的证据 {#method}

公开标签快照为 [v1.3.2](https://github.com/pgsty/oink/releases/tag/v1.3.2)，所记录的标签引用为 `68cfbbdc177064e2c28277c09c385d78e5363ffd`。研究开始时，主题 HEAD 为 `7bc8658bc1be13ef0ad3050b9d9f6862f8f1f65f`，站点 HEAD 为 `99751179eefada3fa7a91318c792ddac46d7e6bf`，两个工作树均有未提交修改。站点固定使用 v1.3.2。这些身份描述输入，不代表某个干净提交包含了实验，也不代表线上生产输出。尤其是短标记 `.wide`，按[组件契约](/zh/docs/design/components/#steps-cards-fields-and-tables)所述，仍属尚未发布的本地工作。

本地检查的归属源包括 `oink/layouts/_partials/content/table-render.html`、`table-body.html`、`assets/scss/td/_content.scss`、`_table.scss`、预设与字体令牌，以及界面协调器。`.wide`/`.td-table--wide` 控制内在尺寸和标识符换行；`.full-width` 使用文章可用画布。`.matrix` 提供首列行表头、受限高度的双轴滚动，以及现有粘性表头/首列 CSS。该 CSS 给每个表头设置 `top:0`，没有多行累计偏移，也没有移动端首列宽度保护。`.fields` 输出定义列表。这些含义都不等于全屏阅读器。普通题注位于表格内部，编号 Book 表格题注位于外层 figure。依据见[表格指南](/zh/docs/components/table/)和[输出契约](/zh/docs/design/architecture/#outputs-and-runtime)。

| 选取的消费站源文件 | 有限样本与用途 |
| --- | --- |
| `pigsty.cc/content/docs/infra/param.md`，NGINX 分组 | 4 列 × 14 行正文；带链接的参数标识符与描述 |
| `pgext/content/list/pkg.md`，第 44–69 行 | 6 列 × 24 行正文；扩展包/版本/仓库/分类/RPM/DEB 比较 |
| `pigsty.cc/content/docs/ref/linux.md`，概览 | 8 列 × 14 行正文；OS/架构及 PG18–PG14 支持状态 |
| `piglet.run/content/docs/reference/vscode/_index.md` | 2 列 × 7 行正文；小表格反例 |

消费站快照分别为：`pigsty.cc` 的 `efaf7b19b442ddb284106418c78854552d949e9e`、`pgext` 的 `ab87fc7e5707d57f55129d3c45874abcc16fdef8`、`piglet.run` 的 `5a1572e6f9110cd5e8ef6e75cd50d9c4b6429f98`；均固定使用 OINK v1.3.2。源文件中的值仅用于内容比较，不是独立核验过的软件包或 OS 支持结论。另一张包含 616 行的扩展目录未做性能测试。

这些样本区分了 **多列**、**多行**、**长单元格** 和 **复杂表头**。拓宽视口主要帮助第一类；粘性定位帮助第二类；换行帮助第三类。多行和合并表头需要显式关联与偏移处理，不能仅靠增加宽度。原型所选表格均只有一行表头且没有合并格，因此最后一类仍是设计与验收问题。GFM 管道表格语法定义表头行和行内单元格内容，本身不定义数据网格界面。依据见 [GFM 表格](https://github.github.com/gfm/#tables-extension-)与 [WAI 多级表头](https://www.w3.org/WAI/tutorials/tables/multi-level/)。

## 五个框架以溢出处理为共同基线 {#frameworks}

调查检查了官方文档和固定提交的默认主题源码，并未穷举所有插件或部署站点。**在这一范围内，没有建立默认独立全屏表格阅读器的证据。** 横向溢出、整页布局模式、代码块全屏和整页复制插件均未计作表格阅读器。文档链接指研究日读取的页面；源码链接固定实现身份。

| 框架快照 | 默认表格行为 | 可选或自定义边界 |
| --- | --- | --- |
| Material for MkDocs，`0f044dbe`，2026-10-24 | Markdown `tables`；将原表包入局部横向滚动容器，并保留未包装回退 | 排序需要显式接入 Tablesort 5.3.0，不是默认排序。未建立默认阅读器、固定列或表格复制的证据。见[指南](https://squidfunk.github.io/mkdocs-material/reference/data-tables/)与 [CSS](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/src/templates/assets/stylesheets/main/_typeset.scss#L464)。 |
| Docusaurus Classic 3.10.2，`f37f9035`，2026-07-10 | MDX/GFM 渲染表格；Infima 0.2.0-alpha.45 使用 `display:block; overflow:auto` | MDX/remark/rehype 提供定制通道，不是内置网格或阅读对话框。见 [MDX 映射](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/packages/docusaurus-theme-classic/src/theme/MDXComponents/index.tsx#L23)与 [Infima CSS](https://github.com/facebookincubator/infima/blob/205b8aedc62496839991b75a8bc2922350766fe4/packages/core/styles/content/table.pcss#L24)。 |
| VitePress 1.6.4，`1fc537b7`，2025-08-05；2.0.0-alpha.21 快照 `d6d7a970`，2026-10-26 | 两个快照均使用块级表格和横向溢出 | 2.0 快照默认增加 `tabindex="0"`，不能倒推到 1.6.4。Vue 组件是定制通道。见 [1.6.4 CSS](https://github.com/vuejs/vitepress/blob/1fc537b78cda287fa23c1129a815ad9455fd8106/src/client/theme-default/styles/components/vp-doc.css#L166)与 [2.0 焦点插件](https://github.com/vuejs/vitepress/blob/d6d7a970fa9cd6424ae6f357bc2931565b44b3dc/src/node/markdown/plugins/table.ts)。 |
| Astro Starlight 0.42.7 快照 `af9557ea`，2026-10-24 | Markdown 表格样式使用 `display:block; overflow:auto` | `.not-content` 提供样式边界。官方目录将第三方整页阅读/代码全屏插件标为社区项目。见 [CSS](https://github.com/withastro/starlight/blob/af9557ea8c957173ea9174e19a87d80fce22a983/packages/starlight/src/style/markdown.css#L134)与[插件目录](https://starlight.astro.build/resources/plugins/)。 |
| Nextra 4.6.5 快照 `d6e80e1d`，2026-06-23 | 官方 `Table` 组件包装带样式和横向溢出的 HTML | 字面 MDX `<table>` 不会自动使用映射；需要 Table 或文档所述白名单。这不是排序/筛选/全屏 API。见[源码](https://github.com/shuding/nextra/blob/d6e80e1dd627b781429a6ee989b15ebba688c8ea/packages/nextra/src/client/mdx-components/table.tsx)与 [HTML 边界](https://nextra.site/docs/advanced/table#literal-html-tables)。 |

所检查代码的许可证均为 MIT：[Material](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/LICENSE)、[Docusaurus](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/LICENSE)、[VitePress](https://github.com/vuejs/vitepress/blob/d6d7a970fa9cd6424ae6f357bc2931565b44b3dc/LICENSE)、[Starlight](https://github.com/withastro/starlight/blob/af9557ea8c957173ea9174e19a87d80fce22a983/LICENSE)和 [Nextra](https://github.com/shuding/nextra/blob/d6e80e1dd627b781429a6ee989b15ebba688c8ea/LICENSE)。Docusaurus 文档另用 [CC BY 4.0](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/LICENSE-docs)。复制代码或素材需保留各自声明；根许可证不能概括未检查的图标依赖。

对静态 Hugo，有用的模式是语义 HTML、局部滚动、构建期焦点属性和可选增强。Material 的[挂载代码](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/src/templates/assets/javascripts/components/content/table/index.ts#L23)使用 RxJS；Classic 使用 React/MDX，VitePress 使用 Vue/Vite，Starlight 使用 Astro，Nextra 使用 Next/React。复现其表格布局思路不需要引入整套管线。本研究没有测量整个框架的交付体积或性能，快照日期也不是维护保证；未执行五框架浏览器或辅助技术比较。

## 丰富组件增加数据操作，也增加维护责任 {#components}

当前版本很关键。**DataTables 3.1.4 不要求 jQuery**，与早期版本不同。**TanStack Table 9.3.1 不是 v8**，使用 `constructTable`、按需选择功能和 Store 响应式绑定。发布包证据优先于旧印象或浮动手册。依据见 [DataTables v3 依赖边界](https://datatables.net/manual/core/jquery)和 [TanStack v9 公告](https://tanstack.com/blog/announcing-tanstack-table-v9)。

| 组件 | 适用方向与可用操作 | 集成与维护边界 |
| --- | --- | --- |
| DataTables 3.1.4，2026-10-13 发布；MIT，核心无必选运行时依赖 | 通过内部数据模型增强 HTML 表格；核心提供排序/搜索/分页；Buttons、FixedColumns、FixedHeader、Scroller 可选 | 是后续系统化表格操作最接近的候选。滚动可能复制或移动表头，仍需验证语义。支持复杂 `thead`，不支持 `tbody` 跨格。见[发布](https://cdn.datatables.net/3.1.4/)、[发布包](https://registry.npmjs.org/datatables.net/-/datatables.net-3.1.4.tgz)、[跨格限制](https://datatables.net/manual/core/tech-notes/18)。 |
| Tabulator 6.7.1，2026-10-22 发布；MIT，无必选运行时依赖 | 网格渲染、排序/筛选、冻结列、列分组、剪贴板和虚拟渲染 | HTML 导入器读取首个 tbody 的 `td`，使 `.matrix` 的行表头 `th` 面临兼容风险；不通用保留 caption/scope/headers。更适合专用记录页面。见[发布](https://github.com/tabulator-tables/tabulator/releases/tag/6.7.1)、[发布包](https://registry.npmjs.org/tabulator-tables/6.7.1)、[导入器](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/HtmlTableImport/HtmlTableImport.js)。 |
| TanStack Table core 9.3.1，2026-10-12 发布；MIT，依赖 `@tanstack/store ^0.11.2` | 无界面的排序/筛选/固定/选择/跨格逻辑；支持 vanilla 集成 | 维护者负责 HTML 导入、渲染、控件、样式、焦点、导出和对话框；虚拟化器另行接入。见[元数据](https://registry.npmjs.org/@tanstack/table-core)、[固定版本包](https://registry.npmjs.org/@tanstack/table-core/-/table-core-9.3.1.tgz)、[vanilla 指南](https://tanstack.com/table/latest/docs/framework/vanilla/quick-start)。 |

DataTables 的 FixedHeader/FixedColumns 是可选扩展。Scroller 要求等高行，与会换行的技术描述并不自然匹配，尚待实测。Tabulator 输出 ARIA grid 结构，其可编辑单元格导航不能证明只读场景的无障碍完整性。TanStack 跨格 API 不提供任意 HTML 合并格的无损导入。所检查发布包均未建立完整官方全屏阅读控件的证据；Tabulator 的 `printFullscreen` 属于打印。这些是限定范围的发现，不涵盖所有社区集成。依据见 [Scroller](https://datatables.net/manual/extensions/scroller/)、[Tabulator 导航](https://www.tabulator.info/docs/6.x/navigation/)、[Print 源码](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/Print/Print.js)、[TanStack 跨格指南](https://tanstack.com/table/latest/docs/framework/react/guide/cell-spanning)。

复制默认行为也不相同。Buttons 4.1.2 按当前排序/筛选规则导出显示数据，为跨格位置补空值；其复制路径默认不启用公式转义。Tabulator 6.7.1 的序列化器用 TAB 和换行拼接单元格值，没有通用引号处理或公式中和。这些行为都不应静默成为 OINK 的复制契约。Tablesort 5.7.1 是仅排序的轻量对照：MIT、无依赖、保留原表行、处理表头 Enter，但不提供阅读器/筛选/导出。Material 配方使用 5.3.0，不能把新版体积和键盘结论套到旧版配方上。依据见 [Buttons 源码](https://github.com/DataTables/Dist-DataTables-Buttons/blob/4.1.2/js/dataTables.buttons.js)、[Tabulator Clipboard](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/Clipboard/Clipboard.js)、[Tablesort 源码](https://github.com/tristen/tablesort/blob/5.7.1/src/tablesort.js)。

### 比较交付字节时同时说明排除项 {#delivery-cost}

测量使用 14 个固定版本 npm tarball，并核对 registry integrity。发布者提供的 minified 文件按原样测量。Gzip 使用 Python 3.14.8、zlib 1.2.12 和 `gzip.compress(data, compresslevel=9, mtime=0)`；合计为各文件分别压缩后相加。这些是制品字节，不是安装大小、CDN 耗时或同等功能基准。

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

DataTables 核心 JS 为 123,516/42,338 字节，CSS 为 30,007/3,843 字节，分别表示 minified/gzip。扩展合计使用确切的 [Buttons](https://registry.npmjs.org/datatables.net-buttons/-/datatables.net-buttons-4.1.2.tgz)、[FixedColumns](https://registry.npmjs.org/datatables.net-fixedcolumns/-/datatables.net-fixedcolumns-6.1.1.tgz)、[FixedHeader](https://registry.npmjs.org/datatables.net-fixedheader/-/datatables.net-fixedheader-5.1.2.tgz)、[Scroller](https://registry.npmjs.org/datatables.net-scroller/-/datatables.net-scroller-3.1.1.tgz) 及匹配的 `-dt` CSS。若使用可选样式适配 JS，四包合计另加 2,501/1,279 字节，Scroller 适配器另加 650/326。未计入初始化、对话框、本地化、JSZip/pdfmake 和 source maps。Buttons 复制实现已在主文件中，不重复计入兼容 shim。[Tabulator 完整包](https://registry.npmjs.org/tabulator-tables/-/tabulator-tables-6.7.1.tgz)不代表其定制构建理论最小值；[Tablesort](https://registry.npmjs.org/tablesort/-/tablesort-5.7.1.tgz)则只有排序能力。

TanStack 测量来自本地构建，不是发布者预制 minified 文件。使用 Node 26.12.0/npm 11.20.0、esbuild 0.25.11，将 core 9.3.1 与 Store 0.11.2 以 `--bundle --minify --format=esm --platform=browser --target=es2020 --legal-comments=inline` 及生产 `NODE_ENV` 打包。所选入口导出 `constructTable`、`tableFeatures`、排序/筛选/固定/跨格功能、排序/筛选行模型、`storeReactivityBindings` 和 `FlexRender`。全部核心入口导出 core 命名空间及后两个辅助项；虚拟化入口单独导出 virtual-core。Metafile 确认没有外部 import。**14,248 字节 gzip 的逻辑样本不含 UI、CSS、HTML 导入器、无障碍控件、对话框、复制器或虚拟化器。** 固定输入见 [core 包](https://registry.npmjs.org/@tanstack/table-core/-/table-core-9.3.1.tgz)、[Store](https://registry.npmjs.org/@tanstack/store/0.11.2)、[Virtual](https://registry.npmjs.org/@tanstack/virtual-core/-/virtual-core-3.19.7.tgz)。

近期发布构成维护活动证据，不构成 SLA。Tabulator 浮动 `6.x` 手册显示 6.5.0，而测量包为 6.7.1。Buttons 浮动文档已出现本研究未纳入的 4.1.3 属性。TanStack v9 指南也未逐项对 9.3.1 验证。本研究没有库级内存/CPU、屏幕阅读器或最终 OINK bundle 基准，不能据此做性能排名或确定虚拟化阈值。

## 概念验证中的桌面拓宽收益远大于手机 {#prototype}

外部原型使用真实同级文档站 Hugo 构建，内容通过仓库外挂载，未使用 `tests/site/`。PGEXT 专用短代码转成显式标签/链接，参数片段链接解析到原始来源 URL，支持状态图标增加“Supported”文字等价项。新增题注和 `.wide` 是实验适配。各阅读模式复用相同的生成表格数据。构建使用同级主题替换，关闭两个 workspace 机制，并将输出、缓存和资源目录放在仓库外；保留已接受的 LibSass 警告。

比较外壳是定制的：230px 侧栏、桌面主区 40px 留白、68ch 正常正文宽度，以及 1130px 可用画布。表格与预设样式来自实际生成的 OINK CSS/字体，没有加载完整外壳运行时或界面协调器。另行保留的真实表格指南页面测得桌面表格视口为 770px、移动端为 358px；因此概念页更窄的基线不能代表所有 OINK 文章。

| 扩展包表格滚动视口 | 正常正文宽度 | 正文内拓宽 | 原生对话框 | 独立页面模式 |
| --- | ---: | ---: | ---: | ---: |
| 桌面 Paper/Terminal | 652.80px | 1130px | 1358px | 1408px |
| 桌面 Slate/Ink | 686.38px | 1130px | 1358px | 1408px |
| 移动端，全部四种预设 | 358px | 358px | 374px | 374px |

这些是本地 `qa.json` 在 1440×1000 和 390×844、DPR 1 下的测量；各预设深浅色几何尺寸相同。文字始终为 **16px**，代码为 **14px**，只是保留现有字号，不是定义新的字号下限。移动端表格内在宽度仍约为 969–1009px。桌面正文内拓宽已能容纳六列样本；对话框主要增加受限高度、持续可见的控件，以及与正文分离的阅读界面。桌面对话框的表格可见高度为 847.20px，页面模式为 897.20px；移动端因控件换行，对话框高度为 711.02–741.20px。长正文表格的总内容高度不能作为等价的可见高度比较。

正文内拓宽的上下文切换成本最低。对话框增加桌面空间，并保留直接返回文章的路径。独立页面在桌面上只多 50px，移动端宽度没有增加；其更有力的理由是可重新加载与未来分享。这里的页面模式通过查询参数选择，只是概念页面，不是 Hugo 输出或已接受路由。返回依赖导航，跨重载不保留原文章滚动/焦点。三种模式都不缩放文字，也不调用 Fullscreen API。

通过 Playwright 1.62.1 驱动的 Chromium **151.0.7922.34** 检查了 **16 组预设 × 深浅色 × 设备组合**，每组包含三个阅读概念与基线。扩展包样本通过原节点身份、ID 唯一性、题注/表头 scope、样式/字体加载、标题初始焦点、Enter 打开、Escape/关闭返回、正反 Tab 边界、工具栏稳定性、控件与表格区域分离、页面模式重载检查。未记录整页溢出；另检查了三个移动端样本和 320px Terminal/深色溢出探针。单独检查保留了链接目标与文字选择，并把正文内横向滚动恢复到 180px。截图审阅覆盖 48 张概念截图和总览图。**一次 Paper/浅色/桌面对话框 axe 扫描报告零违规，不是 16 组无障碍审计。**

参数与版本样本的首列分别占 374px 移动端阅读视口的 59.3% 和 58.3%。这支持增加可选宽度保护，但不能建立通用百分比。原型没有启用固定首列；已测的单行粘性表头也不能证明多行偏移正确。各预设保持区别：Paper 的 Plex Sans 与克制边框、Slate 的 Inter 与圆角控件、Ink 的平面利落几何，以及 Terminal 的等宽控件和 Plex Sans 正文。深浅色均沿用现有令牌，没有新建配色。Ink/Terminal 仍保留实验状态。

复现材料包括仓库外保存的构建器、源码清单/哈希、生成的参考输出、QA/检查 JSON 和截图集。查看本次日期快照时，应直接启动保存的输出；重新构建会读取当前同级源码，并产生新清单。重建时采用外部内容挂载、所记录几何尺寸和相同样本，等待字体加载，再用相同计算字号及生命周期探针捕获 16 组组合的基线与三个概念。工具为 macOS ARM64 上的 Hugo 0.168.0+extended+withdeploy、Go 1.27.3，以及 Node 26.12.0、npm 11.20.0、Python 3.14.8。制品和日志保留在公开内容与 Git 之外。

限制直接影响结论：只有 Chromium；移动端使用触屏模拟，不是实体手机；尽管部分单元格为中文，比较控件只有英文；没有屏幕阅读器、Firefox/WebKit、强制颜色、200/400% 缩放、安全区域或软键盘验收。合并表头、外部脚注/ARIA 引用、嵌套标签页、协调器集成、快速重开、动态更新、大行数性能均未验收。Print/Markdown/RSS 静态参考输出经过检查，但阅读器打开时的原生打印预览/取消未验收。**复制 TSV 有意保持不可用。**

## 小型阅读器更容易保全现有文档 {#direction}

建议首期采用显式、始终可见的 **阅读表格** 操作、原生对话框，以及原节点的一次移动/恢复生命周期。只靠悬停无法服务触屏和键盘发现；整表点击会与选择、链接、滚动竞争。可见标题/关闭控件、具名滚动区、标题初始焦点、受限 Tab 导航、Escape，以及有保护的焦点/滚动恢复，都是实质要求。复用 OINK 界面协调约定，不复用图表平移/缩放变换。接近全视口的对话框与浏览器全屏不同，后者的标准明确不允许把 `<dialog>` 作为请求目标。依据见 [APG 对话框](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)与 [Fullscreen Standard](https://fullscreen.spec.whatwg.org/#dom-element-requestfullscreen)。

保留 caption/th/scope/headers 和原 ID。移动避免克隆冲突与状态分叉，但继承样式、外层编号题注、外部 ARIA 引用及脚注仍需明确处理。原生表格可以包含链接和排序按钮，不必变成 ARIA grid；网格意味着另一套焦点/导航责任。先支持单行粘性表头，复杂表头在累计偏移验证前保持普通滚动。默认舒适间距，紧凑模式只改内边距，不改字号。可选首列固定必须给移动端留下有用的阅读宽度。遵守减少动态效果、浏览器缩放、触屏安全区域和原生文字选择。依据见 [APG table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)、[APG grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)、[表头语义](https://html.spec.whatwg.org/multipage/tables.html#header-and-data-cell-semantics)。

`.wide`/`.td-table--wide` 仍只控制布局，`.full-width` 仍受文章画布限制，`.matrix` 保留语义，`.fields` 不符合阅读器条件。新启用标记仍属提议，尚未实现。无 JS 时内容保持可读；Print 展开静态表格，Markdown 保留源内容，RSS 保留原静态/摘要边界。阅读控件不能泄漏到这些输出。排序/筛选/列选择器需要实际任务依据和明确语义；虚拟化还会改变浏览器查找、可供辅助技术读取的行、打印和复制范围。本研究没有支持它的实测行数阈值。

若后续增加 TSV，建议按作者顺序复制 **整张符合条件的表格**，包括视口之外的行列。导出人类文本：链接变为标签，代码保留文本，排除隐藏控件/装饰符号，有实际含义的图标需要明确文字等价项。首期拒绝隐藏数据行/列、嵌套表格、行长不等、多行表头，以及任何 DOM `rowSpan`/`colSpan` 不为 1 的情况，明确包括 `rowspan="0"`。合并表格仍可阅读，复制必须可见地说明限制。未来跨格算法需要定义覆盖位置、行组和畸形输入处理，不能静默展平。依据见 [HTML 表格模型](https://html.spec.whatwg.org/multipage/tables.html#processing-model-1)。

提议的格式使用 TAB 分隔列、LF 分隔行，末尾不加分隔符；把单元格内 TAB/换行规范化为空格；字面引号保持原样，不使用 CSV 引号规则。代码字符保留，但多行空白会变化。若跳过前导空白/控制字符后以 `= + - @` 开头，在整个值前加单引号；应明确这是会改写值的风险降低措施，不是对所有软件都安全的原始数据。目标电子表格粘贴路径尚未测试。等待 Clipboard API 成功后再礼貌报告状态；拒绝或不可用时提供可选择的规范化文本。DOM 文本无法重建原始 Markdown 或结构化源数据。依据见 [DOM 文本](https://dom.spec.whatwg.org/#dom-node-textcontent)、[Clipboard 2026-06-24 工作草案](https://www.w3.org/TR/2026/WD-clipboard-apis-20260624/#clipboard-interface)、[OWASP 电子表格注入限制](https://community.owasp.org/attacks/CSV_Injection)。

下一项关键决策是：对话框对真实比较任务的改善，是否足以承担这些集成责任。聚焦原生表格的小型阅读器，既保留未来引入数据网格的可能，也避免立即建立第二套数据模型。原提案验收矩阵保留在 Git 历史中，[接受的决策](/zh/docs/design/decisions/large-table-reading/#validation)记录了缩小后的实现边界。本次带日期研究本身只建立候选方向，不代表版本承诺。

## 审阅后接受的方向 {#accepted-direction}

用户选择显式组合 `{.wide .expand}`，使用角落直接展开按钮，悬停或聚焦时显示，触屏常显。本次排除表格上方工具栏、省略号菜单和 TSV。[接受的决策](/zh/docs/design/decisions/large-table-reading/)与[当前契约](/zh/docs/design/components/#table-reading)定义最终行为。本页此前的建议和原型测量保留为当时证据，不代表最终 API。
