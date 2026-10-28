---
title: Give large tables room to read
linkTitle: Large-table reading research
description: Framework and component evidence, measured reading concepts, and a bounded direction for OINK technical tables.
design_kind: research
design_status: candidate
date: 2026-10-26
research_date: 2026-10-26
owner: OINK maintainers
---

> [!NOTE] Historical research; see the 1.4.0 decision
> Research date: 2026-10-26. This study informed the table-reading design in OINK 1.4.0. The [accepted decision](/docs/design/decisions/large-table-reading/) and [table guide](/docs/components/table/) describe the released behavior and supersede the entrance and scope recommendations below.

**An explicit Read table action opening a large native dialog is the strongest candidate for further evaluation.** It gives desktop tables more room while preserving text size, original table semantics, and a short return path. Inline widening remains sufficient for many tables; the measured package excerpt already fits that mode on desktop. On a 390px viewport, the dialog adds only 16px of width, so horizontal scrolling remains on narrow screens. Five documentation frameworks use native tables and overflow handling by default, while third-party table libraries add data operations alongside additional integration weight.

## Evidence separates layout, content, and release state {#method}

The public tag snapshot was [v1.3.2](https://github.com/pgsty/oink/releases/tag/v1.3.2), with tag ref `68cfbbdc177064e2c28277c09c385d78e5363ffd`. Research began at theme HEAD `7bc8658bc1be13ef0ad3050b9d9f6862f8f1f65f` and site HEAD `99751179eefada3fa7a91318c792ddac46d7e6bf`, with uncommitted changes in both working trees. The short `.wide` alias tested in this experiment was subsequently shipped in OINK 1.4.0 as documented in the [component contract](/docs/design/components/#steps-cards-fields-and-tables).

The local owners inspected were `oink/layouts/_partials/content/table-render.html`, `table-body.html`, `assets/scss/td/_content.scss`, `_table.scss`, the preset/font tokens, and the surface coordinator. `.wide`/`.td-table--wide` control intrinsic sizing and token wrapping; `.full-width` reaches the available article canvas. `.matrix` supplies first-column row headers and bounded two-axis scrolling, with existing sticky header/first-column CSS. That CSS gives each header `top:0`, without accumulated multirow offsets or a mobile first-column width guard. `.fields` emits a definition list. Ordinary captions belong inside the table; numbered Book captions belong to the outer figure ([Table guide](/docs/components/table/), [output contract](/docs/design/architecture/#outputs-and-runtime)).

| Selected consumer source | Bounded sample and purpose |
| --- | --- |
| `pigsty.cc/content/docs/infra/param.md`, NGINX group | Four columns × 14 body rows; linked parameter identifiers and descriptions |
| `pgext/content/list/pkg.md`, lines 44–69 | Six columns × 24 body rows; package/version/repository/category/RPM/DEB comparison |
| `pigsty.cc/content/docs/ref/linux.md`, overview | Eight columns × 14 body rows; OS/architecture and PG18–PG14 support cells |
| `piglet.run/content/docs/reference/vscode/_index.md` | Two columns × seven body rows; small-table counterexample |

Consumer snapshots were `pigsty.cc` at `efaf7b19b442ddb284106418c78854552d949e9e`, `pgext` at `ab87fc7e5707d57f55129d3c45874abcc16fdef8`, and `piglet.run` at `5a1572e6f9110cd5e8ef6e75cd50d9c4b6429f98`; each pinned OINK v1.3.2. The separate 616-row extension catalog was left outside this prototype's scope.

These examples distinguish **many columns**, **many rows**, **long cells**, and **complex headers**. Wider viewports primarily help the first; sticky orientation helps the second; wrapping helps the third. Multirow and merged headers need explicit associations and offset handling beyond wider layout. The selected prototype tables all have one header row and no merges. GFM pipe-table syntax itself defines a single header row and inline cell content ([GFM tables](https://github.github.com/gfm/#tables-extension-), [WAI multilevel headers](https://www.w3.org/WAI/tutorials/tables/multi-level/)).

## Five frameworks make overflow the common baseline {#frameworks}

The survey inspected official documentation and pinned default-theme source across five documentation frameworks. **None of the five provides a built-in fullscreen table reader by default.** Documentation links point to pages accessed on 2026-10-26; source links pin implementation commits.

| Framework snapshot | Default table behavior | Optional/custom boundary |
| --- | --- | --- |
| Material for MkDocs, `0f044dbe`, 2026-10-24 | Markdown `tables`; original table wrapped in local horizontal-scroll containers, with unwrapped fallback | Sorting uses an opt-in Tablesort 5.3.0 recipe; no built-in table reader, sticky columns, or table copy ([Guide](https://squidfunk.github.io/mkdocs-material/reference/data-tables/), [CSS](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/src/templates/assets/stylesheets/main/_typeset.scss#L464)). |
| Docusaurus Classic 3.10.2, `f37f9035`, 2026-07-10 | MDX/GFM renders tables; Infima 0.2.0-alpha.45 applies `display:block; overflow:auto` | Custom table views are built through MDX/remark/rehype ([MDX mapping](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/packages/docusaurus-theme-classic/src/theme/MDXComponents/index.tsx#L23), [Infima CSS](https://github.com/facebookincubator/infima/blob/205b8aedc62496839991b75a8bc2922350766fe4/packages/core/styles/content/table.pcss#L24)). |
| VitePress 1.6.4, `1fc537b7`, 2025-08-05; 2.0.0-alpha.21 snapshot `d6d7a970`, 2026-10-26 | Both snapshots use block tables and horizontal overflow | The 2.0 snapshot adds default `tabindex="0"`; Vue components handle custom behavior ([1.6.4 CSS](https://github.com/vuejs/vitepress/blob/1fc537b78cda287fa23c1129a815ad9455fd8106/src/client/theme-default/styles/components/vp-doc.css#L166), [2.0 focus plugin](https://github.com/vuejs/vitepress/blob/d6d7a970fa9cd6424ae6f357bc2931565b44b3dc/src/node/markdown/plugins/table.ts)). |
| Astro Starlight 0.42.7 snapshot `af9557ea`, 2026-10-24 | Markdown table styling uses `display:block; overflow:auto` | `.not-content` supplies a styling boundary; full-view and code-fullscreen features come from community plugins ([CSS](https://github.com/withastro/starlight/blob/af9557ea8c957173ea9174e19a87d80fce22a983/packages/starlight/src/style/markdown.css#L134), [directory](https://starlight.astro.build/resources/plugins/)). |
| Nextra 4.6.5 snapshot `d6e80e1d`, 2026-06-23 | Official `Table` components wrap styled HTML with horizontal overflow | Literal MDX `<table>` requires `Table` or the documented whitelist ([Source](https://github.com/shuding/nextra/blob/d6e80e1dd627b781429a6ee989b15ebba688c8ea/packages/nextra/src/client/mdx-components/table.tsx), [HTML boundary](https://nextra.site/docs/advanced/table#literal-html-tables)). |

The inspected code licenses are MIT: [Material](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/LICENSE), [Docusaurus](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/LICENSE), [VitePress](https://github.com/vuejs/vitepress/blob/d6d7a970fa9cd6424ae6f357bc2931565b44b3dc/LICENSE), [Starlight](https://github.com/withastro/starlight/blob/af9557ea8c957173ea9174e19a87d80fce22a983/LICENSE), and [Nextra](https://github.com/shuding/nextra/blob/d6e80e1dd627b781429a6ee989b15ebba688c8ea/LICENSE). Docusaurus documentation separately uses [CC BY 4.0](https://github.com/facebook/docusaurus/blob/f37f9035584917a97a260b91fc2842cba4f8b94f/LICENSE-docs).

For static Hugo, the directly applicable patterns are semantic HTML, scoped scrolling, build-time focus attributes, and optional progressive enhancement. Material's [mounting code](https://github.com/squidfunk/mkdocs-material/blob/0f044dbe83cd52c8bcc4cf1e84536dcf9e16cdb3/src/templates/assets/javascripts/components/content/table/index.ts#L23) uses RxJS; Classic uses React/MDX, VitePress Vue/Vite, Starlight Astro, and Nextra Next/React.

## Richer libraries add data operations and ownership {#components}

Current versions matter. **DataTables 3.1.4 runs without jQuery**, unlike 1.x releases. **TanStack Table 9.3.1** uses `constructTable`, feature selection, and Store reactivity ([DataTables v3 dependency boundary](https://datatables.net/manual/core/jquery), [TanStack v9 announcement](https://tanstack.com/blog/announcing-tanstack-table-v9)).

| Component | Fit and available operations | Integration and maintenance boundary |
| --- | --- | --- |
| DataTables 3.1.4, released 2026-10-13; MIT, no required core runtime dependency | Enhances HTML tables using an internal data model; core sorting/search/paging; optional Buttons, FixedColumns, FixedHeader, Scroller | Closest candidate for later systematic table operations. Scrolling can duplicate or move headers; supports complex `thead`, not `tbody` spans ([Release](https://cdn.datatables.net/3.1.4/), [package](https://registry.npmjs.org/datatables.net/-/datatables.net-3.1.4.tgz), [span limit](https://datatables.net/manual/core/tech-notes/18)). |
| Tabulator 6.7.1, released 2026-10-22; MIT, no required runtime dependency | Grid rendering, sorting/filtering, frozen columns, grouped columns, clipboard and virtual rendering | HTML importer reads first-body `td` cells, dropping `.matrix` row-header `th` semantics, and does not preserve general caption/scope/headers ([Release](https://github.com/tabulator-tables/tabulator/releases/tag/6.7.1), [package](https://registry.npmjs.org/tabulator-tables/6.7.1), [importer](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/HtmlTableImport/HtmlTableImport.js)). |
| TanStack Table core 9.3.1, released 2026-10-12; MIT, `@tanstack/store ^0.11.2` | Headless sorting/filtering/pinning/selection/spanning logic; vanilla integration is supported | Maintainer owns HTML import, rendering, controls, styles, focus, export, and dialog; virtualizer is separate ([Metadata](https://registry.npmjs.org/@tanstack/table-core), [fixed package](https://registry.npmjs.org/@tanstack/table-core/-/table-core-9.3.1.tgz), [vanilla guide](https://tanstack.com/table/latest/docs/framework/vanilla/quick-start)). |

DataTables' FixedHeader/FixedColumns are optional extensions. Scroller requires equal-height rows, which conflicts with wrapped technical descriptions. Tabulator emits ARIA grid structures designed around cell navigation. TanStack's spanning API requires explicit column definitions rather than importing arbitrary HTML merges. None of these packages includes a built-in fullscreen reading dialog (Tabulator's `printFullscreen` targets print layout) ([Scroller](https://datatables.net/manual/extensions/scroller/), [Tabulator navigation](https://www.tabulator.info/docs/6.x/navigation/), [Print source](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/Print/Print.js), [TanStack spanning guide](https://tanstack.com/table/latest/docs/framework/react/guide/cell-spanning)).

Copy defaults also differ. Buttons 4.1.2 exports display data with current order/filter rules and span placeholders, without formula escaping by default. Tabulator 6.7.1 joins cell values with tabs/newlines without general quoting or formula neutralization. Tablesort 5.7.1 is a lightweight MIT, dependency-free sorting library that preserves table rows and handles Enter on headers without adding a reader, filter, or export layer ([Buttons source](https://github.com/DataTables/Dist-DataTables-Buttons/blob/4.1.2/js/dataTables.buttons.js), [Tabulator Clipboard](https://github.com/tabulator-tables/tabulator/blob/6.7.1/src/js/modules/Clipboard/Clipboard.js), [Tablesort source](https://github.com/tristen/tablesort/blob/5.7.1/src/tablesort.js)).

### Compare delivered bytes with their exclusions {#delivery-cost}

Measurements used 14 fixed npm tarballs verified against registry integrity. Publisher-minified files were measured unchanged. Gzip used Python 3.14.8, zlib 1.2.12, `gzip.compress(data, compresslevel=9, mtime=0)`; totals sum separately compressed files.

| Measured delivery | Minified bytes | Gzip-9 bytes |
| --- | ---: | ---: |
| DataTables 3.1.4 core JS + default CSS | 153,523 | 46,181 |
| Above + Buttons 4.1.2, FixedColumns 6.1.1, FixedHeader 5.1.2 JS/CSS | 249,015 | 72,480 |
| Scroller 3.1.1 JS/CSS, additional | 13,300 | 4,389 |
| Tabulator 6.7.1 full UMD JS + default CSS | 483,872 | 107,512 |
| TanStack 9.3.1 selected reader logic, local bundle | 49,505 | 14,248 |
| TanStack 9.3.1 all core exports plus bindings/render helper, local bundle | 115,146 | 30,983 |
| TanStack virtual-core 3.19.7, separate local bundle | 32,872 | 9,745 |
| Tablesort 5.7.1 core + number comparator | 3,756 | 1,763 |

DataTables core alone is 123,516/42,338 JS bytes and 30,007/3,843 CSS bytes, minified/gzip respectively. Extension totals use the exact [Buttons](https://registry.npmjs.org/datatables.net-buttons/-/datatables.net-buttons-4.1.2.tgz), [FixedColumns](https://registry.npmjs.org/datatables.net-fixedcolumns/-/datatables.net-fixedcolumns-6.1.1.tgz), [FixedHeader](https://registry.npmjs.org/datatables.net-fixedheader/-/datatables.net-fixedheader-5.1.2.tgz), and [Scroller](https://registry.npmjs.org/datatables.net-scroller/-/datatables.net-scroller-3.1.1.tgz) packages plus matching `-dt` CSS. Optional style-adapter JS adds 2,501/1,279 bytes to the four-package total; Scroller's adapter adds 650/326. Initialization, dialog code, translations, JSZip/pdfmake, and source maps are excluded. Buttons copy resides in its main file, so the compatibility shim is not counted again. [Tabulator's full package](https://registry.npmjs.org/tabulator-tables/-/tabulator-tables-6.7.1.tgz) includes all built-in modules; [Tablesort](https://registry.npmjs.org/tablesort/-/tablesort-5.7.1.tgz) supplies only sorting.

TanStack measurements come from local esbuild bundles. Node 26.12.0/npm 11.20.0 and esbuild 0.25.11 bundled core 9.3.1 with Store 0.11.2 using `--bundle --minify --format=esm --platform=browser --target=es2020 --legal-comments=inline` and production `NODE_ENV`. The selected entry exports `constructTable`, `tableFeatures`, sorting/filtering/pinning/spanning features, sorted/filtered row models, `storeReactivityBindings`, and `FlexRender`. The all-core entry exports the core namespace plus those two helpers; the virtual entry exports virtual-core separately. Metafiles found no external imports. **The 14,248-byte gzip logic sample covers headless state management only, excluding UI, CSS, HTML import, accessibility controls, dialog, copier, and virtualizer** ([Core package](https://registry.npmjs.org/@tanstack/table-core/-/table-core-9.3.1.tgz), [Store](https://registry.npmjs.org/@tanstack/store/0.11.2), [Virtual](https://registry.npmjs.org/@tanstack/virtual-core/-/virtual-core-3.19.7.tgz)).

## The concept widens desktops much more than phones {#prototype}

The external prototype used a real sibling documentation-site Hugo build with an external content mount. PGEXT-specific shortcodes became explicit labels/links; parameter fragments resolved to their source URLs; support icons received “Supported” text alternatives. Added captions and `.wide` were experimental adaptations. Every reading mode reused the same generated table data. The build used the sibling replacement with both workspaces disabled and external destination/cache/resource directories.

The comparison shell used a 230px rail, 40px desktop main gutters, 68ch normal measure, and 1130px available canvas, styled with generated OINK CSS and fonts. A separate generated table-guide reference measured a 770px desktop / 358px mobile viewport.

| Package-table scroll viewport | Normal measure | Inline widening | Native dialog | Separate page mode |
| --- | ---: | ---: | ---: | ---: |
| Desktop Paper/Terminal | 652.80px | 1130px | 1358px | 1408px |
| Desktop Slate/Ink | 686.38px | 1130px | 1358px | 1408px |
| Mobile, all four presets | 358px | 358px | 374px | 374px |

These are local `qa.json` measurements at 1440×1000 and 390×844, DPR 1; light/dark geometry matched within each preset. Text remained **16px** and code **14px** throughout. Mobile intrinsic table widths remained about 969–1009px. Desktop inline widening already fits the six-column excerpt; the dialog adds bounded height, persistent controls, and isolation from prose. Its desktop visible table height was 847.20px, versus 897.20px in page mode; mobile dialog heights ranged 711.02–741.20px as controls wrapped.

Inline widening has the lowest context-switching cost. The dialog gains desktop space while retaining a direct return to the article. The separate page gains only another 50px on desktop and no mobile width; its main advantage is reloadability and URL sharing, at the cost of losing article scroll/focus on return. None of these modes scales text or invokes the Fullscreen API.

Chromium **151.0.7922.34**, through Playwright 1.62.1, checked **16 preset × color × device combinations**, each with three reading concepts plus baseline. The package sample passed original-node identity, unique IDs, caption/header scopes, loaded styles/fonts, title initial focus, Enter open, Escape/Close return, both Tab boundaries, stable toolbar, separated control/table regions, and page-mode reload. No page overflow was recorded; three additional mobile samples and a 320px Terminal/dark overflow probe extended the scope. A separate inspection preserved link targets and selection and restored inline horizontal scroll to 180px. Screenshot review covered 48 concept captures and contact sheets, and a Paper/light/desktop dialog axe scan reported zero violations.

The parameter and version samples' first columns occupied 59.3% and 58.3% of the 374px mobile reader, motivating an optional mobile width guard. Preset styling remained distinct: Paper's Plex Sans and restrained framing, Slate's Inter and rounded controls, Ink's flat sharp geometry, and Terminal's mono chrome with Plex Sans prose.

Reproduction uses the external builder, source manifest/hashes, generated reference output, QA/inspection JSON, and screenshot set with Hugo 0.168.0+extended+withdeploy, Go 1.27.3 on macOS ARM64, Node 26.12.0, npm 11.20.0, and Python 3.14.8.

This prototype scoped evaluation to Chromium desktop and touch emulation with single-row headers; Firefox/WebKit, screen-reader testing, forced-colors, 200/400% zoom, merged headers, coordinator integration, and print-while-open belong to implementation acceptance.

## A small reader preserves more than a generic grid {#direction}

The recommended first stage is an explicit **Read table** action, a native dialog, and one original-node move/restore lifecycle. Hover-only entry is undiscoverable on touch and keyboard; whole-table click competes with selection, links, and scrolling. A visible title/Close control, named scroll region, initial title focus, contained Tab navigation, Escape, and guarded focus/scroll return are core requirements. Reuse OINK's surface coordination conventions. A near-full dialog is distinct from browser fullscreen, whose standard excludes `<dialog>` as the request target ([APG dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [Fullscreen Standard](https://fullscreen.spec.whatwg.org/#dom-element-requestfullscreen)).

Retain caption/th/scope/headers and original IDs. Moving the original table avoids clone collisions and divergent state, while inherited styling, outer numbered captions, external ARIA references, and footnotes still need explicit handling. Native tables can contain links and sorting buttons without becoming ARIA grids. Start with single-row sticky headers; leave complex headers scrollable without stickiness until offsets are validated. Comfortable spacing is default; compact mode changes padding while keeping font size. Optional first-column pinning must leave useful mobile reading width ([APG table](https://www.w3.org/WAI/ARIA/apg/patterns/table/), [APG grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [header semantics](https://html.spec.whatwg.org/multipage/tables.html#header-and-data-cell-semantics)).

Keep `.wide`/`.td-table--wide` layout-only, `.full-width` bounded by article canvas, `.matrix` semantics intact, and `.fields` ineligible. No-JS content remains readable; Print expands static tables, Markdown retains source, and RSS retains its static/summary boundary without leaking reading controls.

If TSV copy is added in the future, it should copy the **whole eligible table**, including offscreen rows/columns, in author order: links become labels, code text remains, hidden controls/decorative glyphs are excluded, and meaningful icons use explicit text equivalents. It should reject hidden data rows/columns, nested tables, unequal row lengths, multiple header rows, or any DOM `rowSpan`/`colSpan` other than 1 (including `rowspan="0"`), using TAB between cells, LF between rows, normalized in-cell whitespace, and a leading apostrophe for formula-like cells starting with `= + - @` ([HTML table model](https://html.spec.whatwg.org/multipage/tables.html#processing-model-1), [DOM text](https://dom.spec.whatwg.org/#dom-node-textcontent), [Clipboard 2026-06-24 Working Draft](https://www.w3.org/TR/2026/WD-clipboard-apis-20260624/#clipboard-interface), [OWASP spreadsheet-injection limits](https://community.owasp.org/attacks/CSV_Injection)).

A focused native reader leaves data-grid adoption possible later while avoiding a second data model. See the [accepted decision](/docs/design/decisions/large-table-reading/#validation) for the shipped implementation boundary.

## Accepted direction after review {#accepted-direction}

Maintainer review selected explicit `{.wide .expand}` composition and a direct corner action, revealed on hover/focus and visible on touch, omitting the above-table toolbar, ellipsis menu, and TSV copy. The [accepted decision](/docs/design/decisions/large-table-reading/) and [current contract](/docs/design/components/#table-reading) define the shipped behavior.
