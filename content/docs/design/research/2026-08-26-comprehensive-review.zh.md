---
title: OINK 全面审查（2026-08-26）
linkTitle: 2026-08-26 全面审查
description: 对 OINK v0.7.0 后主线的实现、配置、输出、安全、测试、性能、双语契约与真实站点所做的证据化全面审查。
weight: 30
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK review, 深度审查, 配置验证, OpenAPI, Swagger, 输出契约, 安全, 测试]
design_kind: research
design_status: verified-review-snapshot
last_verified: 2026-08-26
---

> [!WARNING] 审查快照，不是新契约
> 本文记录 2026-08-26 对 `github.com/pgsty/oink` 主线与本站集成面的审查证据。
> 它不会改变既有 API，也不表示文中建议已经实现。当前行为仍以 Design 契约、实现与 owning checker 为准。
>
> **其中一部分已被 OINK 0.7.1 取代。** F01–F06 这些代码问题已在该版本修复，见
> [0.7.1 发布说明](/zh/blog/release/0.7.1/)。下面的发现应当读作促成修复的证据，而不是主题当前的状态。

## 审查结论 {#verdict}

OINK 的主干质量明显高于一般 Hugo 主题：默认路径可构建、双语完整、组件测试广、输出与安全意识强，
真实站点在桌面、移动端、深浅色和无障碍主路径上没有发现普遍性崩坏。当前 `main` 与远端一致，
主题 CI 和本站 CI 都是绿色；本次重新执行的主题检查、迁移单测、浏览器单测、全站链接、
Playwright 与 axe 也全部通过。

但「全部绿色」不能等价为「契约全部成立」。本次审查发现 **4 项 P1、9 项 P2、5 项 P3**。
最重要的共同原因是：项目已经建立了一套很强的原则，却仍有若干早期/边缘实现没有接入这套原则；
而现有门禁主要证明已选中的正向场景不回归，不能系统发现配置空间、静态输出和公开文档的语义漂移。

建议在下一个版本标签前至少完成以下四项：

1. 关闭 Swagger UI 默认在线 validator，并用非 localhost 的浏览器请求测试锁定「零隐式外联」；
2. 把所有公开配置和 Landing 数据纳入统一的类型、范围、URL 与 CSS 值验证；
3. 重做 Swagger、Redoc、Asciinema 的 HTML/Print/Markdown/RSS 降级和 runtime gate；
4. 修复生成 Schema，并让公开配置/Front matter 参考重新与当前实现对齐。

## 基线与方法 {#baseline-and-method}

### 审查基线 {#review-baseline}

| 项目 | 快照 |
| --- | --- |
| 主题仓库 | `main` = `fe439fdb1d7c2df745088c9bfcbb8c350403ee63`，工作树干净，与 `origin/main` 一致 |
| 当前稳定标签 | `v0.7.0` = `cbb6f4e0bfe47e17ba7aa41d04b8651c943cf858` |
| 文档站仓库 | `main` = `fd5fcde`，工作树干净，公开 pin 为 `github.com/pgsty/oink v0.7.0` |
| 本机工具 | Hugo Extended 0.164.0、Python 3.14.6、Node 26.4.0、npm 11.17.0 |
| 远端 CI | 主题 HEAD 的 [GitHub Actions run 32792753866](https://github.com/pgsty/oink/actions/runs/32792753866) 成功 |

### 实际执行的验证 {#executed-validation}

- 31 个主题 checker 全部通过；
- 85 个迁移单测全部通过；
- 38 个主题浏览器运行时单测全部通过；
- 40 个 HTML/Print/Markdown/RSS/LLMS golden 表面通过；
- `tests/site` 严格 Hugo 构建通过；
- 真实双语站点的 `npm test` 通过：121/121 中英页面配对、886 个标题 ID、24,860 个站内链接与
  3,172 个 fragment 均通过；
- 真实站点的完整 Playwright 套件通过：全站 sitemap axe 扫描、29 个无障碍场景、45 个响应式/
  导航场景、16 个键盘场景、10 个内容组件场景、18 个代码块场景、4 个 PRD5 场景与 5 个主题色场景；
- 额外在 320 CSS px 下人工检查 EN 首页、ZH 配置页、ZH Book 页、OpenAPI/Redoc 页，未发现页面级水平溢出；
- `npm audit` 对本站 79 个 npm 依赖报告 0 项漏洞；对 `VENDOR.json` 的 26 个精确 npm 版本调用
  [OSV Query API](https://google.github.io/osv.dev/post-v1-querybatch/) 未返回已知公告；
- `measure-baseline.py assets --fixture-site` 的严格隔离构建通过。

### 判级 {#severity}

| 级别 | 含义 |
| --- | --- |
| P1 | 违反核心产品承诺、安全/隐私边界或普通编辑可用性；应在下一标签前修复 |
| P2 | 明显功能/契约/兼容性缺陷；短期内修复并增加行为门禁 |
| P3 | 维护性、性能、流程或文档治理债务；排入结构化改进 |

## 发现摘要 {#finding-summary}

| ID | 级别 | 发现 | 默认站点是否受影响 |
| --- | --- | --- | --- |
| F01 | P1 | Swagger UI 在生产 URL 上默认启用在线 validator | 仅使用 `swagger` 的页面 |
| F02 | P1 | 多组非法配置会让普通 Hugo 直接失败或静默生成坏输出 | 取决于配置输入 |
| F03 | P1 | Swagger/Redoc/Asciinema 违反静态输出和 runtime 隔离契约 | 使用这些 shortcode 的页面 |
| F04 | P1 | Landing 将未验证数据送入 `safeCSS`，其它错误值静默通过 | 使用相关 Landing 字段的页面 |
| F05 | P2 | 自定义页面动作与归档版本 URL 绕过共享 URL 策略 | 配置这些可选项的站点 |
| F06 | P2 | 生成 JSON Schema 的默认值、类型、描述和候选键存在实质错误 | 使用编辑器 Schema 的作者 |
| F07 | P2 | 「完整」配置与 Front matter 参考大量落后于 v0.7 实现 | 全部维护者/消费站作者 |
| F08 | P2 | Design 契约与提案生命周期内部出现双重答案 | 维护者 |
| F09 | P2 | OpenAPI 无障碍缺口被测试排除，Redoc 推荐与实测不一致 | OpenAPI 页面读者 |
| F10 | P2 | 严格 CSP 文档没有覆盖主题自己的 inline script/style | 启用严格 CSP 的站点 |
| F11 | P2 | 浏览器兼容性没有公开基线，自动化只跑 Chromium | Firefox/Safari/RTL/强制色用户 |
| F12 | P2 | 输出安全与「Rendered Markdown」门禁存在系统盲区 | 依赖门禁判定安全/输出纯度的站点 |
| F13 | P2 | 跨仓库真实集成仍是人工、非原子的发布步骤 | 每次公共行为改动 |
| F14 | P3 | checker 体系重复且过度依赖源码字符串 | 维护者与并行工作树 |
| F15 | P3 | 全局 CSS/字体仍是首访主要负担 | 全部 HTML 页面 |
| F16 | P3 | vendor 完整性强，但漏洞/SBOM 与 CI 供应链门禁不足 | 发布维护者 |
| F17 | P3 | Changelog、已实现提案和无行为元数据造成治理噪音 | 维护者与升级读者 |
| F18 | P3 | Print `isHTML` 的 FIXME 已不能准确说明真实依赖 | Print 模板维护者 |

## 详细发现 {#detailed-findings}

### F01 — Swagger UI 会隐式联系在线 validator（P1） {#f01-swagger-validator}

**证据。** `layouts/_shortcodes/swagger.html` 初始化 `SwaggerUIBundle` 时没有声明
`validatorUrl: null`。随主题内置的 `swagger-ui-bundle.js` 把默认值设为
`https://validator.swagger.io/validator`；它只对包含 `localhost` 或 `127.0.0.1` 的 spec URL
跳过在线校验。部署到真实域名后，Swagger UI 会创建在线 validator badge，请求参数包含 spec URL。

**影响。** 这违反「主题自有网络功能默认关闭」「本地优先」「同源 spec 在浏览器中不访问外部服务」三项承诺。
内网站点尤其会把内部主机名/spec 地址暴露给第三方。由于上游特意跳过 localhost，当前所有本地浏览器测试都看不到它。

**建议。** 初始化时显式写 `validatorUrl: null`。若未来允许在线 validator，应做成明确 opt-in 的 URL 配置，
走共享 URL 验证并在隐私/CSP 文档中说明。浏览器测试应使用一个非 localhost 的虚拟 origin，拦截全部请求，
断言同源 spec 页面只请求首方资源。

### F02 — 非法配置没有统一 warn/fallback，甚至击穿普通预览（P1） {#f02-config-validation}

`ui-param.html` 明确写着「caller validates the type」，但多个 caller 没有验证。最小复现得到：

| 输入 | 实际结果 |
| --- | --- |
| `ui.blog_index_size: nope` | 普通构建失败：`.Paginate` 要求正整数 |
| `ui.sidebar_expand_levels: nope` | 普通构建失败：`add` 无法处理字符串 |
| `ui.sidebar_menu_truncate: nope` | 普通构建失败：`first` 无法转成整数 |
| `offline_search_summary_length: nope` | 普通构建失败：`truncate` 无法转成整数 |
| `ui.sidebar_width_min: "1; color: red"` | 零告警成功，输出 `--td-shell-sidebar-min: ZgotmplZpx` |
| `ui.sidebar_width_min: -50` | 零告警成功，输出 `-50px` |
| `blog_index_columns: 2.5` / `section_index_columns: 2.5` | 零告警成功，把 `2.5` 送入 CSS `repeat()` |
| `ui.sidebar_item_overflow: clip` | 零告警成功，静默当成 `ellipsis` |
| `ui.sidebar_menu_foldable: definitely` | 零告警成功，非布尔字符串按 truthy 启用 |
| `ui.blog_index_size: 0` | 被 Hugo `default` 静默吞掉，回到 12 |

Landing 的 `marquee.rows`、`capabilities.columns` 和 Asciinema 的数字参数也直接调用 `int`/`float`，
错误文本会终止模板执行。`print.toc`、`offline_search_max_results` 等错误类型则静默改变行为。

**影响。** 这是对 Diagnostics decision 的直接反例：普通 `hugo server` 可能整体不可用，而错误输入也可能在
`--panicOnWarning` 下零告警上线。

**建议。** 为整数、正整数、范围、成对范围和 CSS grid count 增加共享 validator；先归一化再参与运算或输出。
每个公开键至少需要四态用例：合法站点值、合法 page override、非法普通构建（warn+fallback）、非法严格构建（失败）。
对 `min <= max`、分页大小 `>= 1`、列数为合理整数等交叉约束加领域 resolver，不要依赖浏览器吞掉坏 CSS。

### F03 — OpenAPI 与 Asciinema 仍是 HTML-only 岛（P1） {#f03-static-output-leakage}

Architecture/Components 规定 Markdown/LLMS 不含 `td-*` 组件标记，Print 静态展开且不依赖交互，RSS 只保留安全静态内容或明确省略。
但当前实现与公开示例表明：

- `redoc` 在生成 `.md` 中原样输出 `<style>`、`<div class="td-redoc">` 与 `<redoc spec-url=...>`；
- `swagger` 把可执行 inline initializer 直接写在 shortcode 中；
- `asciinema` 的 `.md` 输出包含整套 `td-asciinema` HTML 与 JSON script；
- Asciinema 的 Print 仍加载约 185 KB 的 player JS/CSS，只能碰巧打印某一帧；
- Swagger/Redoc 在 Print 里留下空容器，并仍可能装载 1–2 MB runtime；
- 这些 shortcode 没有进入 Markdown/RSS/Print golden 矩阵。

**影响。** Agent 输出被主题 HTML 污染；纸面/EPUB 读者拿到空壳；Print/PDF 负担无意义的大 runtime；
Swagger inline script 也破坏 CSP。当前用户文档把这些缺陷写成「输出形态」，等于让 reader guide 与规范契约相互否定。

**建议。** 三者都先读取 `tdOutputFormat`：HTML 输出完整组件；Print/Markdown/RSS 输出一个有标题的静态链接、
spec/cast 地址与必要的文字说明，或者明确省略。只有交互 HTML 才设置 capability flag。Swagger initializer 应移入稳定 chunk，
Redoc 的样式移入 stylesheet，新增四输出 golden 与 runtime-absence 断言。

### F04 — Landing 的 CSS/URL/数值入口没有同一安全边界（P1） {#f04-landing-validation}

`layouts/_partials/landing/sections/hero.html` 对 `title_size` 做了 CSS 长度验证，却把
`media.ratio` 与 `media.max_width` 原样拼进字符串，再整体 `safeCSS`。最小输入：

```yaml
sections:
  - type: hero
    data:
      title: Probe
      image: /icons/logo.svg
      media:
        ratio: "1fr; background-image: url(https://example.invalid/x)"
        max_width: "240px; color: red"
```

普通和严格构建均零告警，输出：

```html
style="--td-hero-columns: 1fr; background-image: url(https://example.invalid/x);
       --td-hero-media-max: 240px; color: red;"
```

Landing 允许把 `sections` 直接写进 front matter，因此这不是只属于仓库管理员的内部常量。
其它 section 的 `columns`、`rules`、宽高、style、icon 与 URL 也各自处理；非法 `javascript:` 通常被 Go template
变成 `#ZgotmplZ`，但没有 warning，严格门禁仍通过；字符串列数会变成 `ZgotmplZ`，某些 `int` 转换则直接终止构建。

**建议。** 为 Landing 建立一层 section schema/normalizer：所有类型共享 class、icon、URL、CSS length、grid count、
boolean、enum 解析；section partial 只消费规范化结果。`hero.media.ratio` 应是两个受限 track 值而不是任意 CSS 片段，
`max_width` 走 CSS length validator。所有 link/action 复用 `content/url.html`，并给每种 section 一个负向用例。

### F05 — 两个配置 URL 面绕过共享策略（P2） {#f05-url-policy-bypass}

`params.ui.page_context_menu.links` 经 `url-template.html` 替换占位符后直接 `safeURL`；
`url_latest_version` 也被当作「trusted site configuration」直接 `safeURL`。它们没有检查 scheme、host、空白或 protocol-relative URL。

最小配置可零告警产出：

```html
<a class="td-page-actions__item"
   href="javascript:document.body.dataset.pwned=1;undefined">
```

点击该 URL 会执行 JavaScript。站点配置本身是高信任输入，因此这不是默认远程攻击面，但它与公开的「safe URL」配置模型不一致，
也让复制来的配置片段拥有不必要的执行能力。

**建议。** 自定义动作只允许 `http`/`https` 与明确支持的站内相对 URL，并复用 `content/url.html`；
归档版本 URL 也应验证。浏览器 action registry 的二次检查值得保留，但 progressive-enhancement 的 `<a>` 不能绕过它。

### F06 — 生成 Schema 与真实 YAML 不一致（P2） {#f06-schema-generation}

`generate-config-schema.py` 的小型 YAML parser 不剥离行尾注释，至少 11 个默认值被生成成字符串，例如：

- `print.toc` 的默认值是字符串 `"true # ..."`，不是 boolean `true`；
- `print.section_break_wordcount`、`section_index_columns`、`blog_index_columns` 变成字符串；
- `footer_style`、`blog_index`、`typography` 的 enum 默认值包含注释正文。

注释关联也会漂移：解释「breadcrumb 没有全站默认」的注释被挂到 `section_index`；解释 `quick_links` 的注释被挂到
`sidebar_icon_policy`；taxonomy icon 注释被挂到 `pager_types`；本地 chrome 注释被挂到 `image_zoom`。

Front matter Schema 还会把探测器读到的已移除键 `release`、`upstream_attribution`、`downstream_modified` 暴露给编辑器，
并把 navbar menu 的 `Params.columns` 误判成 page front matter。`--check` 只比较「同一个有 bug 的生成器」与已提交产物，
所以会稳定地保持错误。

**建议。** 不要继续扩展 ad-hoc YAML parser。使用能保留注释的正式 parser，或为默认值/描述建立显式机器元数据标记；
scanner 需要区分 page、menu、shortcode 和 legacy detector 上下文。生成测试必须拿 Schema 默认值与 Hugo 实际解析值逐项比对，
并维护「禁止出现在补全中的已移除键」列表。

### F07 — 配置与 Front matter 参考不是当前实现的完整参考（P2） {#f07-public-doc-drift}

`content/docs/customize/config.md` 与 `content/docs/write/frontmatter.md` 都自称「每个主题实际读取的键的唯一完整参考」，
但当前存在多类实质错误：

- 日期默认仍写成长英文日期，而 `hugo.yaml` 已是 ISO `2006-01-02`；
- Blog 只写 `none|banner|wash` 和 `list|cards`，遗漏 `hero`、`table`、toggle、size、`toc_style`、`toc_taxonomies`；
- Front matter 仍把已移除的 `release` map、`release_products`、`release_group_by_product` 当现行 API，遗漏 `release_url`；
- `images: []` 被写成「没有 featured image」，但契约明确 bundle resource discovery 仍继续；
- `upstream_modified` 被写成新增一行，而现行契约是改变 credit verb，不新增行；
- 大量页面说非法参数「直接失败」，与 warn/fallback decision 混在一起，普通预览与严格发布门禁没有说清；
- Book guide 仍说主题止于 Print HTML，而 v0.7 已发布 BookManifest、EPUB 与 PDF 工具；
- Asciinema/OpenAPI guide 将污染静态输出的现状写成产品契约；
- Features 页仍写 28 个 vendor 依赖，权威清单是 26 个。

中英文在这些旧答案上通常保持一致，所以 translation parity 不会报错。

**建议。** 先把配置参考与 Front matter 参考作为一次专门的契约迁移处理；从实现/Schema 生成一份可比对的 key inventory，
人工维护语义文字。发布门禁应检查：现行键全部出现、removed 键只出现在迁移章节、enum/default 与 `hugo.yaml`/resolver 一致。

### F08 — Design 树出现互相冲突的权威和未退休提案（P2） {#f08-design-governance}

最直接的矛盾是：Shell 契约声明 navbar `columns`/mega panel 已退役、配置会 warning 并保持单列；
Landing 契约却仍声明「Navbar mega-menu columns accept 1–4」。实现与 checker 支持前者。

提案生命周期也没有按自己的规则执行：`config-schema` 已标记 `implemented`，仍位于 Active proposals；
Book publication 已把 manifest、EPUB、PDF 和 CI 做完大半，却仍以 Draft proposal 与正式 Architecture contract 重复描述；
media-convergence 把已实现里程碑和未完成 M4 混在一份原始设计记录中。

**建议。** 修正 Landing 契约；把已实现的 config-schema 稳定事实移到 Architecture/Decision 后退休提案；
Book proposal 只保留尚未完成的 consumer migration 问题，或拆成新的窄提案。Active proposal 中不应存在第二份现行 API。

### F09 — OpenAPI 无障碍承诺与测试排除项不一致（P2） {#f09-openapi-accessibility}

本站 axe 套件明确排除 `.td-swagger-ui` 和 `.td-redoc`。注释记录的已知问题包括 Swagger UI 的无名称 server select、
不可键盘访问的 scrollable version stamp，以及 Redoc operation description 的颜色对比度。

OpenAPI guide 却只公开 Swagger 的问题，并把「真正渲染的 Redoc」作为替代；这会让读者误以为 Redoc 满足本站的零违规门禁。

**建议。** 立即在 EN/ZH guide 中公开两者的真实边界。短期可通过主题 CSS 修复可修的 Redoc contrast，
对 Swagger 的可修 DOM 用 narrow post-render adapter；不能修的上游问题应有版本化 waiver、issue 链接和单独 axe 报告，
而不是把整块 DOM 排除后仍称全站零违规。

### F10 — 当前主题不能直接配合严格 CSP（P2） {#f10-csp}

部署指南说同源资源使 strict CSP 可行，却只列作者 inline script、ECharts callback、analytics、远程 spec/diagram 和 Giscus。
主题自身在普通 Docs 页就输出两段可执行 inline script（颜色首绘与 shell prepaint）和 inline style；Markmap、Swagger、Algolia、
Google CSE 还增加主题自有 inline initializer。项目没有 nonce 参数、hash manifest 或完整的 CSP 示例。

**影响。** `script-src 'self'` 会阻止主题自己的首绘与 shell 状态恢复；`style-src 'self'` 会阻止主题色、字体角色、Landing
和多个 inline custom property。站点只能加 `'unsafe-inline'`、自行维护 hash，或覆盖模板；当前文档没有说清。

**建议。** 把稳定初始化逻辑移到同源外部 chunk，以 data/JSON 传递页面配置；剩余必须 inline 的内容提供可生成的 CSP hash 清单，
或统一 nonce hook。文档应给出「最小核心」「带 Markmap/OpenAPI」「带第三方集成」三套策略，并明确 style-src 需求。

### F11 — 浏览器兼容性承诺缺少基线与跨引擎证明（P2） {#f11-browser-compatibility}

Playwright CI 只安装 Chromium；仓库和产品文档没有写最低 Chrome/Firefox/Safari 版本。
但实现依赖或增强使用 `:has()`、`dialog`、`inert`、`color-mix()`、`@property`、logical properties、
discrete display transition 等新能力。部分功能有 fallback，但没有一个浏览器矩阵证明它们。

RTL 主要依靠源码 marker、少量 JS 单测和一个临时给元素设置 `dir=rtl` 的几何测试；没有完整 RTL 语言站。
forced-colors 多数只检查 SCSS 中是否出现字符串，没有浏览器 computed-style/交互测试。

**建议。** 发布一个小而明确的支持矩阵，并至少对核心 shell/导航/内容/对话框跑 Chromium + Firefox + WebKit。
增加一条真正 `languageDirection: rtl` 的集成配置，以及 forced-colors、reduced-motion、320px、200% zoom 场景。

### F12 — 输出安全和 Markdown 门禁没有检查自己宣称的全部表面（P2） {#f12-checker-blind-spots}

`check-output-security.py` 对 `.md` 只匹配 Markdown link 语法，不把其中 raw HTML 送入 HTML scanner；
因此 Redoc/Asciinema 的 `<script>`、`spec-url` 与 raw `href` 不会被发现。它也不检查 style 中的 `url()`、JSON config 中的 URL，
而 theme fixture 以全局 `--third-party` 运行，降低了第三方元素检查的区分度。

本站的 `check-rendered-markdown.mjs` 名字也容易误导：它扫描的是生成 HTML 的文本节点里是否残留 Markdown 标记，
并不读取生成 `.md`。真正的 md-output golden 只有 15 个页面，未覆盖 OpenAPI/Asciinema。

**建议。** 将门禁拆成三个明确工具：HTML trust、machine-output purity、rendered-text residue。
`.md` 中允许的 raw HTML 应有极窄 allowlist；CSS URL、form/action、JSON URL 与非可执行 JSON script 需要分别解析；
每个 public shortcode 至少进入一个 Markdown/Print/RSS 行为用例。

### F13 — 两个仓库之间没有自动的候选提交集成门禁（P2） {#f13-cross-repo-gate}

主题 CI 只对 `tests/site` 合成夹具运行；文档站 CI 则只测试 `go.mod` 固定的公开标签。
主题 PR 的真实 EN/ZH/Playwright 验证依赖维护者本地执行 `HUGO_MODULE_REPLACEMENTS`，两个仓库的变更也无法原子提交。

这次的结果说明两边可以分别全绿，而公开参考仍与实现漂移。现有 release-state 文字区分是正确的，但自动化没有执行
「实现 + owning checker + EN/ZH contract」同一交付规则。

**建议。** 增加一个只读的跨仓库候选 workflow：主题 PR checkout 当前 SHA，同时 checkout 文档站指定 main SHA，
用临时 module replace 跑 `npm test` 与关键浏览器套件；反向也让 Design contract PR 指向待验证主题 SHA。
发布仍保持 tag/pin/deploy 分离，但候选提交应有一个可追溯的联合验证结果。

### F14 — checker 维护成本和源码耦合过高（P3） {#f14-checker-maintainability}

当前 checker 覆盖面值得肯定，但 34 个 `check-*.py` 中有 546 次 `read_text()`；多数脚本重复实现 `require`、临时站点、
写文件、Hugo 命令和错误聚合。大量断言锁定模板/SCSS 的源码拼写、注释附近结构或整文件相等，而不是最终行为。

一部分 helper 又硬编码 `theme: oink` + `--themesDir <repo-parent>`，使 checkout/worktree 目录名成为隐藏前提。
项目没有统一的 Python lint/type gate。结果是新增 checker 很快，却更容易出现「门禁全绿但共同盲区没有人拥有」。

**建议。** 建立共享 fixture builder 和 assertion library；把负向 case 作为表驱动数据；
只给真正的 topology invariant 留源码检查，其余转到解析后的 HTML/JSON/computed style。
测试主题应通过显式 symlink/module replace 装载，不依赖仓库 basename。

### F15 — runtime 拆分成功，但基础 CSS/字体仍占主要首访成本（P3） {#f15-performance}

严格隔离 fixture 基线：

| 指标 | 数值 |
| --- | ---: |
| 冷/热构建 | 1.256 s / 1.273 s |
| 页面 | 249 |
| stable JS chunks | 18 |
| main + Font Awesome CSS | 549.8 KB raw / 91.1 KB gzip |
| 字体总量（其中 FA） | 999.7 KB raw / 248.5 KB gzip |
| Docs 页 JS 中位数 | 176.9 KB raw / 55.3 KB gzip |
| 生成 public | 26.2 MB |
| v0.7.0 Go module zip | 7.8 MB（展开约 20.5 MB、1,140 文件） |

第一方 capability chunk 已经消除了 `2^N` 组合包，这是正确方向；大第三方 runtime 也按页面隔离。
剩余主要成本来自所有页面都加载的 Bootstrap/主题/Landing CSS 与完整 Font Awesome 分发。

**建议。** 不要违背现有合同去按模板用量裁剪 Font Awesome。优先测量可独立缓存/按 surface 加载的 Landing、Book、Swagger CSS，
检查真实首访实际加载的 font subset，并给预算建立趋势报告而非武断阈值。

### F16 — vendor 可复现，但漏洞与 CI 供应链仍靠人工（P3） {#f16-supply-chain}

正面证据：`VENDOR.json` 精确记录 26 个包、56 个 artifact、31 个 license 文件和 tree hash，
`check-vendor.py` 通过；本次 OSV 与 npm audit 均未发现已知漏洞。

缺口：custom manifest 没有进入通用 SBOM/OSV gate，`npm audit` 也天然看不到这些 vendored 浏览器包；
文档站两个 workflow 通过 `curl` 下载 Hugo `.deb` 后直接 `sudo dpkg -i`，没有校验摘要；Actions 用可移动的 major tag，
主题 CI 的 Python 是浮动 `3.x`。

**建议。** 从 `VENDOR.json` 生成 CycloneDX/SPDX SBOM，增加定期 OSV 扫描；Hugo archive/deb 固定 SHA-256；
高信任 release workflow 的 action 固定 commit SHA；选择明确 Python 版本或建立版本矩阵。

### F17 — 设计记录与发行文字的信噪比下降（P3） {#f17-governance-noise}

`CHANGELOG.md` 已有 1,768 行，0.7.0 单节约 300 行；Unreleased 用约 20 行解释一次 checker retry。
这些叙事对工程复盘有价值，但升级读者很难快速找到 breaking change、迁移和行为差异。

同时，`book_kind`/`book_part` 被契约「认可」并出现在大量内容 front matter，却明确不被模板读取；
它们给作者增加了类似 API 的负担但没有行为。已实现提案仍留在 Active proposals 又放大了重复答案。

**建议。** Changelog 保留用户可观察变化、breaking/migration 与修复摘要；长设计故事移到 Blog/Research，并从 changelog 链接。
没有行为的 metadata 要么定义消费者和 schema，要么从公共契约降级为站点自有字段。

### F18 — Print `isHTML` FIXME 已经失真（P3） {#f18-print-ishtml}

`hugo.yaml` 说「等 Hugo 修复 #14381 前保持 `isHTML` 未设置」。该 Hugo issue 已于 2026-01-17 修复，
修复进入 OINK 兼容性下限之前的 Hugo 0.155 系列；OINK floor 是 0.160.1。

但在当前主题上简单启用 `isHTML: true` 仍会产生 page/section/landing print layout missing warnings，
严格构建失败。这说明真实依赖已经从「等待 Hugo alias fix」变成「当前 Print 模板命名依赖 non-HTML lookup 规则」。

**建议。** 不要直接删除 workaround。先为 HTML-classified Print 补齐 lookup matrix 与 alias/subpath 测试；
若继续保持 false，就更新注释说明当前真实原因，并增加一个测试防止未来维护者依据已关闭 issue 做错误清理。

## 做得好的地方 {#strengths}

- 主题、文档站、发布标签和消费站 pin 被明确区分，没有把本地 replacement 当成发布；
- Hugo floor 0.160.1 与 0.164/0.165 的主题矩阵覆盖扎实；
- 大多数新组件已经遵循 warn/fallback、四输出、共享 URL/attribute policy 与 capability flag；
- 32 个 locale schema 一致，EN/ZH 真实页面、标题 ID、站内链接和窄屏导航有强门禁；
- 搜索、键盘、surface coordinator、页面动作和主题色测试既有单测也有浏览器行为测试；
- vendor license/hash、EPUB/PDF 的路径边界、PDF loopback+CSP 与不可覆盖默认值设计认真；
- 320px 人工复核未发现页面级水平溢出，当前核心视觉质量良好；
- 构建性能很好，第一方 JS 已从组合 bundle 迁移到稳定 capability chunk。

## 建议修复路线 {#remediation-roadmap}

### 阶段 0：下一个标签前 {#phase-0}

1. Swagger 写死 `validatorUrl: null`，增加 production-origin no-network test；
2. 建立公开参数 inventory，为 F02/F04 中所有字段补 validator 与负向矩阵；
3. 重做 Swagger/Redoc/Asciinema 四输出和 runtime gate；
4. 修复自定义 action/归档版本 URL；
5. 修复 Schema parser/scanner，并重新生成两份 Schema；
6. 同步 EN/ZH Config、Front matter、OpenAPI、Asciinema、Book、Features 与 Landing contract。

### 阶段 1：契约门禁 {#phase-1}

1. 为 29 个 shortcode 建立最小 HTML/Print/Markdown/RSS coverage map；
2. 拆分并增强 output trust / machine-output purity 检查；
3. 将 Landing section 输入统一归一化；
4. 外部化 theme-owned inline initializer，发布 CSP 参考；
5. 建立跨仓库候选提交 workflow。

### 阶段 2：兼容性与结构 {#phase-2}

1. 加 Firefox/WebKit、真实 RTL、forced-colors、200% zoom；
2. 收敛 Python checker harness 和源码字符串断言；
3. 评估按 surface 拆 CSS 与字体实际请求；
4. 生成 SBOM、定期 OSV、固定 CI 下载摘要；
5. 退休已实现提案并精简 Changelog。

## 完成判据 {#acceptance-criteria}

- 使用同源 Swagger spec 的生产 origin 除首方资源外无请求；
- 每个公开配置错误在普通构建中 warn+fallback/omit，在严格构建中失败，且不出现 Go template `ZgotmplZ`；
- 生成 `.md` 不含 `td-*`、theme `<script>`/`<style>` 或空交互容器；
- Print 不加载 Swagger/Redoc/Asciinema runtime，并给读者可理解的静态替代；
- Schema 默认值类型与 Hugo 实际解析完全一致，removed key 不出现在补全中；
- EN/ZH 配置和 Front matter 参考的 key/enum/default 与实现 inventory 一致；
- 核心 Playwright 在 Chromium、Firefox、WebKit 通过，真实 RTL 与 forced-colors 有行为断言；
- 主题候选 SHA 有一条可追溯的真实文档站联合验证记录。

## 审查边界 {#limits}

本次没有逐一审查全部消费站仓库、真实生产响应头/CDN 缓存、Firefox/Safari 实机、读屏器，
也没有人工逆向 13 MB minified 第三方源代码。漏洞查询是 2026-08-26 的快照，之后可能变化。
DDIA/TPME 的 EPUB/PDF 真实消费站结果引用现有 CI/契约，本次没有重新发布或部署任何站点。

