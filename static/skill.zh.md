---
name: oink-site
description: "Oink 建站：用 OINK 主题（github.com/pgsty/oink，文档 oink.pgsty.com）搭建、迁移和打磨 Hugo 网站，包括产品文档、书籍与课程门户、博客、Landing 与公司站、档案馆、相册和聚合文库。适用场景：从 oink-starter 起步；为现有 Hugo 或 Docsy 站点接入 OINK；把 PDF、HTML 或上游 Markdown 转成 Docs 或 Book 页面；设计首页；增加语言；检查、升级和发布 OINK 站点。不用于修改主题本身。"
---

# Oink 建站

> OINK 建站技能的公开版。地址：<https://oink.pgsty.com/skill.zh.md> · English：<https://oink.pgsty.com/skill.md>。保存为技能目录 `oink-site/` 下的 `SKILL.md`，或直接把地址交给任何 agent。本快照对应 OINK v1.5.1，日期 2026-11-06。

OINK 是本地优先的 Hugo 模块主题，硬分叉自 Docsy。站点就是普通的 Hugo 仓库：`hugo.yaml`、固定 `github.com/pgsty/oink@<tag>` 的 `go.mod`、`content/`、`data/`，以及可选的 `assets/` 和 `layouts/` 钩子。用 Hugo Extended 构建，以模块方式安装时还需要 Go。不需要 Node、npm、Dart Sass、PostCSS 或 CDN。它提供 Docs、Book、Blog 和 Swagger 阅读外壳，Expo 相册，Landing 区块，本地搜索，内置字体与图标，32 种界面语言，外观预设，打印，以及 Markdown/LLMS 输出。它不提供 CMS、身份认证、数据库或自动翻译。

## 怎么用这份文件

语法和行为以 OINK 文档为准。本文负责的是判断：工作流程、边界、OINK 维护者审阅自家站点时采用的标准，以及此前约五十次建站中出过的错。写配置键之前先查文档，不要凭记忆或照搬其他站点的配置。

流程轻重按任务定。改一处文案，构建一次、在浏览器里看一眼即可。新建站点、迁移或转换一本书，才需要走完下面的全部内容。

设计部分是分量很重的默认值，而不是模板。用户的品牌、读者或材料不同，形态也可以不同；偏离时要说明理由。

## 权威来源

- 文档：<https://oink.pgsty.com/docs/>（中文在 `/zh/docs/` 下）。在任意页面 URL 后加 `index.md` 即可读取 Markdown；`https://oink.pgsty.com/llms.txt` 列出了全部页面。源码：<https://github.com/pgsty/oink.pgsty.com>（`content/docs/`）。
- 合同在 `docs/design/` 下。主题的默认值（`hugo.yaml`）和检查器（`bin/`）在 <https://github.com/pgsty/oink>；模板是 <https://github.com/pgsty/oink-starter>。
- 按需查阅：`start/`（starter、from-scratch、anatomy）· `write/`（organize、pages、frontmatter、blog、book、expo、releases、openapi）· `components/` · `customize/`（home、brand、navigation、layout、i18n、search、config、print、agents）· `admin/`（preview、deploy、upgrade、troubleshooting、analytics、comments）· `design/`（landing、shell、components、architecture）。
- 本快照的基线：OINK v1.5.1、Hugo Extended 0.168.0、Go 1.27.3。到 GitHub Releases 查看最新的已发布版本，读它的发布说明，并用 `hugo mod graph` 确认实际解析到的版本。较新的文档优先于本文。
- 目标站点自己的 `AGENTS.md`/`CLAUDE.md`、`README.md` 和 `Makefile` 对该站点有约束力。
- 旧教程和旧站点里有已经过时的做法。以下内容只能说明当时的意图：OINK 0.4–1.4 的键名、`exampleSite`、`type: landing`、Docsy `blocks/*`、`--panicOnWarning`、“零警告”、Dart Sass。

## 动手之前

- 说明要建的是哪个仓库、哪个域名，并确认当前工作目录就是该站点。拿来参考的站点一律只读。
- 先运行 `git status --short`。保留未提交的修改和其他会话的文件，只暂存自己的文件。绝不用 `checkout` 或 `reset` 覆盖不是自己做的修改。`git init` 或新建仓库前先询问。
- 下载原始材料之前先定好位置：放在仓库外，或放进用 `git check-ignore` 确认过的忽略路径。PDF、压缩包、克隆仓库、抓取结果和构建产物默认不进 Git，除非用户另有指示。拿不准就问。

## 理解材料与读者

**先盘点，再搭骨架。** 列出来源（README、代码、上游文档、旧站、PDF、档案、数据），写清它们的版本、语言、完整程度和许可证，以及各自的去处。大型转换把清单做成机器可读的格式，记下修订号和校验值。只就真正的歧义提问。盘点常常会改变范围：课程比预想的多，许可证禁止修改，所谓的两份“译文”其实是不同版本。这类发现要在动手前汇报。

**按读者要做的事选择页面形态。**

| 读者想要… | 页面形态 |
| --- | --- |
| 了解产品并选择下一步 | Landing：`data/home/<lang>.yaml` 或 `layout: landing`（绝不是 `type: landing`） |
| 完成任务或查阅资料 | Docs：`type: docs` |
| 按顺序阅读并引用图表 | Book：`type: book` |
| 关注按日期发布的文章和版本 | Blog：`type: blog` |
| 浏览相册 | Expo：`type: expo` |
| 下载各版本文件 | `data/download/` 中的记录 |
| 浏览 HTTP API | Swagger：`type: swagger` |

- 阅读外壳由 `type` 决定，与目录无关，所以 `/docs/x/` 和 `/x/` 都可以。放在 `content/docs/` 之外的文档树还需要 `sidebar_root_for: self`。
- 教程、任务指南、参考资料和随笔分属不同的树。

**一个站点还是多个。**
- 读者、语言、发布节奏和维护者都相同，且共用搜索有帮助时，就合并。版本、语言组合、许可证、节奏或归属不同时，就拆分。有一组 PostgreSQL 书籍起初是一个聚合站，最后拆成了一书一站。
- 同一上游的系列适合一站多书，每项一本 Book，例如每个大版本一本或每门课一本。每本 Book 是一个顶级分区，这样根切换器就兼作书籍切换器。
- 搜索会为整个站点下载每种语言一份索引。合并时要考虑体积。
- 名称宜短，目录名、域名和仓库名最好用同一个名字。
- 按主要读者选择默认语言。翻译书籍通常把目标语言放在 `/`。
- 决定会牵涉域名或仓库变化时，先问用户。

**先研究最接近的真实站点。** 先走一遍读者路径，源码公开的再读源码。借鉴组织思路，不照搬配置。最后一列都是站点代码，不是 OINK 功能。其中不少站点在[案例库](https://oink.pgsty.com/zh/case/)里有详细介绍。

| 要建的站点 | 研究 | 值得学的 | 站点私有 |
| --- | --- | --- | --- |
| 带文档的产品站 | [vchord.pgsty.com](https://vchord.pgsty.com/)（[源码](https://github.com/pgsty/vchord.pgsty.com)）；最新的 [mooncake.pgsty.com](https://mooncake.pgsty.com/)（[源码](https://github.com/pgsty/mooncake.pgsty.com)）；另有 [pig](https://pig.pgsty.com/)、[sow](https://sow.pgsty.com/)、[piglet.run](https://piglet.run/) | 首页放真实的命令和功能；一行出处说明；下载信息与实际版本发布一致；单一 `/docs/` 根配合 `upstream_*` | 带高亮的快速开始 partial、`bin/sync_download.py` |
| 翻译书籍 | [DDIA](https://ddia.vonng.com/)（[源码](https://github.com/Vonng/ddia)）；精简的 [TPME](https://tpme.vonng.com/)（[源码](https://github.com/Vonng/tpme)）；单语言的 [PG Internal](https://pgint.vonng.com/)（[源码](https://github.com/Vonng/pg-internal)） | 以阅读为先的首页；各版本分开（DDIA 中 `content/zh` 和 `tw` 是第 2 版，`v1*` 是第 1 版，`en` 仅作参考）；编号图表、`xref`、打印 | 作者、法律声明和贡献者 partial；`bin/epub`；繁体转换 |
| 转换的书籍与课程 | [intro.pgsql.cc](https://intro.pgsql.cc/)、[feat.pgsql.cc](https://feat.pgsql.cc/)、[dalibo.pgsql.cc](https://dalibo.pgsql.cc/)（仅站点） | 一章一页；逐项核算覆盖率；课程目录与章节导航分开 | 转换脚本、课程数据、生成脚本 |
| 单站多语言 | [doc.pg.center](https://doc.pg.center/)（[源码](https://github.com/pgsty/doc.pg.center)）：8 种语言，含从右到左的阿拉伯语；手册放在 `/patroni/` 等路径 | 语言配对、双列视图、上游登记表、按渲染后的锚点检查 | 首页 partial、覆盖率脚本 |
| 跨两个域名的大型文档 | [pigsty.cc](https://pigsty.cc/)（[源码](https://github.com/pgsty/pigsty.cc)）和 [pigsty.io](https://pigsty.io/)（[源码](https://github.com/pgsty/pigsty.io)） | 导引、任务、参考三分；中文到英文的同步 | 产品首页、扩展目录 |
| 个人博客 | [vonng.com](https://vonng.com/)（[源码](https://github.com/Vonng/vonng.com)） | 按专题组织的首页；克制地挑选近期文章；卡片风格一致 | `hero-featured`、`column-cards`、`recent-posts`、`link-cards`；`data/works.yaml` |
| 相册或展馆 | [OINK Expo 相册](https://oink.pgsty.com/zh/expo/)与 `docs/write/expo` | 一个主题一个相册，选定封面和排列顺序；做档案馆时，按时期或作品组织叙事，旁边配生平和作品索引 | — |
| 公司站或落地页 | [pgsty.com](https://pgsty.com/)（[源码](https://github.com/pgsty/pgsty.com)）、[caps.vonng.com](https://caps.vonng.com/)（[源码](https://github.com/Vonng/caps.vonng.com)） | 产品描述准确；事实信息放在页脚 | pgsty.com 手写的 `layouts/index.html`（别照抄）；CapsLock 配置器 |
| 专题指南 | [us.vonng.com](https://us.vonng.com/)（[源码](https://github.com/Vonng/us.vonng.com)）、[sg.vonng.com](https://sg.vonng.com/)、[cloudexit.org](https://cloudexit.org/)（[源码](https://github.com/cloudexit/cloudexit.org)） | 清晰的阅读入口胜过装饰 | us 和 sg 是较旧的 `themes/oink` 副本 |
| 起点 | [oink-starter](https://github.com/pgsty/oink-starter)；[oink.pgsty.com](https://oink.pgsty.com/)（[源码](https://github.com/pgsty/oink.pgsty.com)） | 干净的配置；可运行的组件示例 | 文档站的大型配置；绝不用主题的 `tests/site/` |

## 搭建骨架

- **新站点。** 用 Starter（“Use this template”）。每完成一层都构建一次：
  1. 语言。默认 en+zh+fr。在其他修改之前，复制 `examples/hugo.single.yaml` 或 `hugo.bilingual.yaml`，或设置 `disableLanguages`。
  2. 身份信息：`title`、`baseURL`、版权、仓库链接。
  3. 先做好一种语言的首页，再做译文。
  4. 内容与导航。
  5. 品牌与阅读功能。
  6. 外部集成。
  7. 生产构建，然后部署。
- **现有 Hugo 站点。**
  - 保留内容和配置文件名；必要时运行 `hugo mod init`。
  - 运行 `hugo mod get github.com/pgsty/oink@<tag>`，并加入 `module.imports`。
  - 合并下面的 markup 设置，而不是替换整份配置。
  - 审查站点的 `layouts/`、旧短代码以及 `type`/`layout` 取值。
- **Docsy 或旧版 OINK 站点。** 按 `docs/admin/upgrade` 操作，使用主题 `bin/migrations/` 中的迁移工具。`oink06.py` 的顺序是：`report`，干跑 `migrate`，`--write`，最后 `check`。旧的图表标记用 `book_figures.py`。第二次运行必须没有任何改动。
- **站点必备配置。** Hugo 不会合并主题的 `markup`，所以每个站点都要自己设置：
  - `goldmark.renderer.unsafe: true`
  - `goldmark.parser.attribute.block: true`
  - `goldmark.parser.wrapStandAloneImageWithinParagraph: false`
  - `markup.highlight.noClasses: false`
  - 有数学公式时开启 passthrough（绝不用单个 `$`）
- **需显式开启的功能。** 搜索要设置 `params.offline_search: true`。额外的输出要在 `outputs` 中显式列出；每种类型的列表会整体替换主题的列表。
- **Git 规范。** 提交 `go.mod` 和 `go.sum`。忽略 `public/`、`resources/`、`.hugo_build.lock` 和缓存。绝不提交 `go.work` 或模块替换。
- **常见形态。**
  - 一个有 `dev`/`build`/`check` 目标的 Makefile，设置 `GOWORK=off HUGO_MODULE_WORKSPACE=off`；检查构建输出到临时目录。
  - 一份 `AGENTS.md`：使命、来源与许可证、目录结构、硬性规则、校验门槛。
  - 一个内容为 `@AGENTS.md` 的 `CLAUDE.md`。
  - Starter 的 `make dev` 通过 `HUGO_MODULE_REPLACEMENTS` 预览同级目录下的 `../oink` 主题检出；`serve` 和 `build` 使用 pin 的版本。
- **先做一条代表性路径。** 做完首页 → 分区索引 → 内容页，以及它的译文。在这条路径上定下导航、字体、图片和转换方法，再铺开。

## 编写与转换内容

- **优先用原生 Markdown。** `> [!NOTE]` 提示框；`{.steps}`、`{.cards}`、`{.fields}` 属性行；带标签的代码块；`filetree` 代码块；图片属性行。只有文档说明原生写法不够用时才用短代码。标题里不放短代码，短代码正文里不放脚注。
- **每个目录** 都有 `_index.md`。`weight` 以 10 为步长。会被链接或翻译的标题都要写明确的 `{#id}`。每页都有一句话的 `description`。
- **出处标注是内置功能。**
  - 设置 `upstream_link`，配合 `upstream_name`、`upstream_copyright`、`upstream_license`（SPDX）和 `upstream_notice`，通常经由 `cascade` 设置，或用 `upstream_source` 引用 `data/upstreams` 中的条目。缺少任何一个键都会告警，并省略出处说明。
  - 站点许可证与上游许可证分开写。特殊条款按原文披露。
  - 许可证禁止修改或翻译时，停下来询问。
- **上游材料。**
  - 在副本上工作。对照 pin 版本的代码核实事实：曾有一份旧文档写的是 `source_uri`，代码里却是 `src_uri`。
  - 旧 URL 映射到 `aliases`；旧的大版本放进带标注的归档区。
  - 指向上游域名的链接改成站内相对链接。替换 `git://` 等协议：OINK 组件会丢弃它们，输出检查器会拒绝它们。
  - 已下线的站点：用 Wayback CDX，每个 URL 取最新的可读快照，保留记有快照时间和校验值的清单。快照时间不等于内容日期。
- **按类别核对，不按文件数。** 逐项核对来源：作品、章节、图、表、脚注、代码、图片、链接。如实标注不完整的材料：“仅摘要”“Beta，非 GA”、样例数据。
- **档案。** 一部作品一页，而不是一个文件或一张图片一页。合并碎片。提供完整索引和检索页。清除所有转换痕迹。
- **文字。** 写具体的任务和事实。不写空话，不编造数字，不写 AI 腔的文案。精简时保留限制、条件和推理。每删一句都问：删掉它，读者会做错什么？

**书籍。** 一章一页，所有链接和内部引用都要完整。
- **准备。** 写明要转换的版本和变体。
  - 根 `_index.md` 设置 `type: book`、`cascade: {type: book}` 和 `outputs: [HTML, print, markdown]`。
  - 每个章节目录都有手写的 `book_number` 和 `weight`。
  - 图片放在页面包里。
- **转换。**
  - 把转换脚本和它的 README 放在 `scripts/`，供下一版复用。
  - 先转两个样章，和用户一起审阅，再处理其余部分。
  - PDF 的陷阱：阅读顺序、断行和断开的标识符、跨页表格、被误认为标题的数字输出。
- **标记。**
  - 图、表和 `$$` 公式使用紧贴在块下方的属性行：`{#id num="2-1" caption="…"}`。
  - 示例把 `num`、`caption` 和 `#id` 写在代码块围栏上。
  - 引用用 `xref`。在书籍首页放 `book-toc` 和 `book-*` 索引短代码。
  - PostgreSQL 的 `$$` 只留在代码里；SQL 章节不应出现 KaTeX。
- **检查。**
  - 数量与来源对得上；脚注双向链接都可用。
  - 整书打印：锚点、跨章链接、页数。
  - `index.md`，以及主题的 `bin/check-book.py --site-public public`。
  - 失败就把状态留在 `failed`。勘误与原文分开。
- **多本书。** 一本书一个会话或子代理。由协调者分配任务，并分批验收结果。

**多语言。**
- **文件模型。** 新站点用成对文件（`page.md` + `page.zh.md`）。现有站点保留原有模型；DDIA 使用按语言划分的 `contentDir`。两者绝不混用。只启用有真实内容的语言。
- **对应页面。** 成对的页面共用 `weight`、`date`、`aliases`、标题 ID 和标题顺序。每种已启用的语言都需要自己的：
  - `data/home/<lang>.yaml`（缺了它，页面会悄悄显示英文）；
  - 页脚数据；
  - 标识符一致的菜单。
- **缺口。** 绝不用原文或混杂语言填补缺口。占位页要注明尚未翻译，并链接原文；否则就不要提供这个路由。不同版本不是彼此的译文。
- **页面包。** 不带语言后缀的资源为各语言共用。只有 `index.zh.md` 的页面包需要带 `.zh.` 后缀的资源。
- **双列视图**（`params.ui.compare: true`）需要：
  - 已发布的同源译文；
  - CSP 允许 `frame-src 'self'`；
  - 统计代码用 `window.OinkComparePane` 做判断。

  各语言标题 ID 对齐，同步滚动才准确。
- **署名。** 在译文发布的页面上同时署作者和译者。译者是否出现在原文语言的页面上，先问译者本人。译文措辞交给专门的翻译流程；本技能只管站点。

## 首页与设计

**容易踩坑的机制**（细节见 `customize/home`）：
- **结构。** 首页是 `data/home/<lang>.yaml`：一个 `sections` 列表加若干命名键，内置 22 种类型。类型名拼错会告警并跳过。
  - `{type: cards, key: chapters}` 用来区分同一类型的两个实例。
  - `partial:` 渲染站点模板；模板名加上站点前缀。
- **数据。**
  - 站内 URL 不加开头的斜杠。
  - 星标数、价格、头像等事实信息是提交到仓库的数据。
  - 页脚放在 `data/footer/<lang>.yaml`，绝不放在首页数据里。
- **链接。** Landing 的 `cards` 通过一行操作链接跳转，整卡可点需要限定作用域的站点 CSS。内容页中带 `{.cards}` 的 Markdown 列表本身就是整卡链接。
- **高亮。** Chroma 会高亮 `code-plate`、`preview` 以及 Markdown 字段里的代码块，不会高亮 `command-box`、`steps` 或 `capabilities` 的代码行。
- **外观预设。** OINK 项目维护的站点使用 `params.ui.preset: paper`、`preset_menu: [paper, slate, ink, terminal]` 和 `dark_mode: true`；想让读者自选外观时，这是不错的默认值。
- **品牌。** 只通过配置和公开 token 修改：
  - `params.logo`/`wordmark`，以及 `static/` 中的 favicon；
  - `theme_color`，可经 `cascade` 按分区设置；
  - `params.ui.fonts`、`--td-brand-*` 和八个字体角色属性。

  亮色和暗色成对设置。绝不修改主题文件，不加载远程字体或 CSS。

**OINK 自家站点的审阅标准：**
- **内容先行。** 第一屏点明具体的对象，并给出有用的下一步。书籍给出阅读入口和目录；产品给出能跑的命令和文档；展馆给出叙事入口。绝不编造数字、节省比例、星标数、状态灯或尚未发布的功能。
- **不留孤字。** 几个字孤零零地换到下一行，是维护者最常打回的问题。
  - 一行文字要么一行放下，要么排满均衡的两行，每种语言、每种宽度都是如此。
  - 通过改写文案、调整宽度或字号来解决。
  - 绝不用省略号、行数截断或固定的 `nowrap` 来伪装。
- **节奏跟着内容走。** 同一行的卡片行数相同。栅格按条目数来定：6 项排成 3×2，而不是 4+2。长命令给足宽度，简短的要点用紧凑卡片。
- **克制。**
  - 不要这些东西：装饰性编号、计数徽章、重复标题的 eyebrow、闪烁圆点、毛玻璃、终端窗口外框。
  - 徽章只用于真实的状态。
  - 整张卡片就是链接，不放“查看更多”按钮。
  - 文案要具体。引导语要么言之有物，要么删掉。
- **人和事实都要真实。**
  - 展示真实的作者和译者，配照片和链接。绝不把 AI 工具署为译者。
  - 出处说明要准确：“Fork of X · originally by Y · maintained by Z · licence”。
  - 法律实体和地址只放在页脚或公司页。
  - 页脚各栏均衡，标签不超过一行。
- **保留已认可的部分。** 去掉图片的边框，不等于去掉图片。

**行之有效的形态**，可作起点：
- **DDIA 书籍首页：** 带封面和三个阅读按钮的 Hero → 作者/译者卡片 → 序言 → 各篇与章节 → 权利说明 → 贡献者。
- **vchord 产品首页：** 带出处说明的 Hero → 紧凑的事实卡片 → 快速开始 → 文档栅格 → FAQ → CTA。
- **vonng.com：** 肖像、小号 eyebrow、按数量排布的栅格。
- **us.vonng.com：** 文字在左、原图在右，每篇一张卡片。

针对眼前的材料来设计；这些顺序不是配额。

**CSS 规则。**
- 站点样式写在 `assets/scss/_styles_project.scss`，限定在站点前缀或区块 `class` 之下。
- 绝不全局改写 `.td-*` 样式，也不用全局 `!important`。
- 检查菜单里的每种预设在亮色和暗色下的效果，以及 RTL、打印和窄屏。
- LibSass 中，CSS 的 `min()`/`max()` 要用 `unquote()` 包起来。

## 扩展

- **主题优先。** 先用主题功能，再考虑自己写。配置器、生成脚本、同步脚本、自定义 partial 和 CSS 都属于站点扩展。
  - 放进最窄的钩子：`layouts/_partials/hooks/head-end.html`、`body-end.html`，或区块的 `partial:`。
  - 在站点的 `AGENTS.md` 中写明，绝不把它们称为 OINK 功能。
  - 多个站点都需要同一个扩展时，通过[设计提案](https://oink.pgsty.com/zh/docs/design/proposals/)流程或在 <https://github.com/pgsty/oink> 提 issue，向上游提出。
- **不复制。** 不要为了一处改动复制整个外壳或 `baseof.html`。不要用手写的 `layouts/index.html` 加 `static/css` 做新首页。
- **外部集成默认关闭**，直到完整地做出选择。
  - Giscus 和 GA 需要项目自己的 ID。
  - `share` 是显式列出的列表。
  - AI 助手链接会把 URL 发给第三方。

在这个边界之内，尽管发挥：新的区块 partial、数据驱动的索引、别出心裁的阅读路径。只要内容需要，就去做。

## 校验、汇报与发布

```bash
unset HUGO_MODULE_REPLACEMENTS; export GOWORK=off HUGO_MODULE_WORKSPACE=off
hugo mod graph | grep github.com/pgsty/oink
hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings
git status --short
```

- **通过标准。** 构建输出 `Total in …` 且没有 ERROR，每条 WARN 都已读过。LibSass 弃用提示属于预期。
  - 绝不使用 `--panicOnWarning` 或 `HUGO_PANICONWARNING`。
  - 大多数错误输入只告警并回退；无法解析的 `ref`/`relref` 和残留的 `blocks/*` 会让构建失败。
  - 多语言站点加上 `--printI18nWarnings`。子路径部署用真实的 `--baseURL`，绝不用 `canonifyURLs`。
- **按需检查。** 主题的检查器要从 <https://github.com/pgsty/oink> 在 pin 版本标签上的检出中运行。
  - 站点自己的 `make check`；
  - `bin/check-output-security.py --public <dir> --base-url <url>`；
  - `bin/check-book.py`；
  - 站内链接；
  - 一对译文渲染后的标题 ID；
  - `index.md` 和 `llms.txt`。
- **浏览器审阅。**
  - 每个语言的根页面，以及每种页面形态各一页。
  - 桌面与约 390 px 宽度；亮色与暗色，以及提供的每种预设。
  - 切换语言后落在对应页面。
  - 搜索、锚点、长代码和长表格、键盘操作、打印、404，以及关闭 JS 时的落地页。
  - 要在大量页面中查孤字，测量文字的行框。

  用户的眼睛才是验收标准。构建通过只说明构建通过。
- **汇报。**
  - 说明参照了哪个站点、改了哪些文件、运行了哪些检查、哪些没有覆盖、在哪里预览，以及还剩什么。
  - 各状态分开报告：源码完成 → 本地验证 → 已提交 → 已推送 → 已部署 → 生产环境已核实。
  - 提交、推送、部署或改 DNS，只在用户要求时进行。按逻辑分批提交，改版前先做一次基线提交。
- **部署。**
  - 只走一条生产部署路径；Starter 自带 GitHub Pages 和 Cloudflare Direct Upload。
  - 在 CI 和托管平台上都固定 Hugo 版本；`HUGO_VERSION` 不一致曾导致构建失败。
  - 开启 `enableGitInfo` 时用 `fetch-depth: 0`；预览部署用 `--environment staging`。
  - 放在忽略路径里的文件，不会出现在从 Git 构建的部署中。
  - 部署后在公开 URL 上检查规范 URL、sitemap、robots、搜索索引、语言切换和 404。
  - 回滚靠重新部署，绝不手改生产环境。
- **升级。**
  - 读完两个 pin 之间的每一份发布说明。运行 `hugo mod get …@<tag>` 和 `hugo mod tidy`。源码副本和子模块要单独更新。
  - 用迁移工具迁移旧语法。保持站点原有的外观预设策略。
  - pin 的变更与内容分开提交。

## 值得记住的失败

- **改错了仓库。** 一个公司站在错误的目录里建了好一阵，直到维护者问：这个目录不是那个专题站吗？
- **模板拼凑。** 千篇一律的视觉被直接打回。一条全局 `!important` 覆盖了约 1,800 行站点 SCSS，随后一次 `git checkout HEAD` 毁掉了尚未提交的样式。
- **“零警告”门槛。** 它引入了一个 Dart Sass 依赖，后来被撤销；普通用户不应该需要额外安装 Sass。
- **悄无声息的破坏。**
  - SQL 里的 `$$` 被渲染成数学公式。
  - 数字被识别成标题。
  - 放在被忽略的 `static/` 里的 PDF 没有进入部署。
  - 中文页面通过错误的 `/zh/` 路由链接到英文书籍。
- **虚假的“已完成”。**
  - 用文件数宣称内容完整。
  - 把 Beta 版标成 GA。
  - 把失败的链接藏在“已完成”后面。
  - 文字精简过头，丢掉了 16 处限制条件。
