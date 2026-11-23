---
title: "主题路线图：Sass 出口与下一阶段产品"
linkTitle: 主题路线图
description: 路线图草案：先让主题脱离 Hugo 已移除的 LibSass，再补齐读者侧的小缺口、版本生命周期与静态 API 参考。
weight: 25
icon: fa-solid fa-route
search_keywords: [路线图, LibSass, Dart Sass, css.Build, Hugo 0.170, 版本管理, OpenAPI, Agent 输出]
design_kind: proposal
design_status: draft
proposal_date: 2026-11-21
---

> [!WARNING] 路线图草案，仅 R0 已实现
> 本页提出工作顺序，并记录其依据。R0 已在主题 main 分支实现，尚未发布：样式表是由 Hugo 拼装的纯 CSS，没有编译器，Git 中也没有任何生成文件，见 [R0](#sass-design)。除此之外，本页不定义任何配置键、输出或组件。下文出现的名称都是暂定名，只有对应阶段被接受并移入所属契约后才生效。

| 记录 | 内容 |
| --- | --- |
| 状态 | 草案。负责人于 2026-11-22 决定了 R0 的编译样式交付。此后源码改为纯 CSS，于 2026-11-23 完成验证，编译器随之移除。R0 已实现、未发布。其余阶段均未被接受 |
| 负责人 | OINK 维护者 |
| 日期 | 2026-11-21 |
| 范围 | OINK 主题与文档站；仅在阶段明确提到时涉及 CLI |
| 受影响契约 | 架构（工具链、样式、输出）、组件、外壳，以及定制指南 |
| 源码快照 | 主题 HEAD `49b5648` 及未提交的工作、文档站 HEAD `3472785`、本地 Hugo Extended 0.169.0 |

## 核心建议 {#recommendation}

下一个主题版本只做一件事：**在不要求用户安装 Dart Sass 的前提下脱离 LibSass**。Hugo v0.170.0 移除了 LibSass 和 extended 版本。起草本路线图时，OINK 固定在 0.169.0，这是最后一个能构建已发布 v1.5.1 的版本，而主题契约又禁止使用上游给出的唯一替代方案。[R0](#sass-exit) 已在主题 main 分支解决这个问题：样式表是纯 CSS，不经过任何编译，也不再固定任何 Hugo 版本。在某个发布版本带上这项工作之前，已发布的 OINK 仍无法采用之后的任何 Hugo 版本。

在此之后，不再新增组件家族，先把做了一半的事情做完：首先是其他框架视为基线的读写小缺口，其次是版本生命周期，最后是静态 API 参考。同一时间只推进一个内容模型项目，这也是 [CLI 路线图](/zh/docs/design/proposals/oink-cli-roadmap/#roadmap)已有的要求。

| 阶段 | 主题 | 排在此处的理由 |
| --- | --- | --- |
| R0 | Sass 出口与 Hugo 0.170 基线 | 上游变更所迫，阻塞之后的每一次升级 |
| R1 | 读者与作者侧的小缺口 | 成本低、使用频繁，不引入新的权威来源 |
| R2 | 版本生命周期 | 本来就是默认的下一项内容能力，而上游改变了它的前提 |
| R3 | 静态 OpenAPI 参考 | API 内容目前进不了搜索和 Agent 输出 |
| 持续进行 | Agent 输出与工程质量 | 收尾已有工作，不增加任何服务 |

## 背景与依据 {#evidence}

### Hugo 0.170 移除了 LibSass {#hugo-0170}

[Hugo v0.170.0](https://github.com/gohugoio/hugo/releases/tag/v0.170.0) 于 2026-11-13 发布，其说明写明 extended 版本已不存在，Dart Sass 是唯一的转译器。把 `transpiler` 设为 `libsass` 会报错。`hugo.IsExtended` 恒为 `false`，`module.hugoVersion.extended` 已弃用且不再起作用。使用 Sass 的站点必须另行安装 Dart Sass。

已发布的 v1.5.1 用内置编译器通过 `toCSS` 编译两份样式表：`head-css.html` 中的 `scss/main.scss` 和 `scripts.html` 中的 `scss/redoc.scss`。[工具链契约](/zh/docs/design/architecture/#hugo-toolchain)规定，普通用户不得安装 Dart Sass 或其他 Sass 可执行文件，之后的变更也必须保持这一边界。对 v1.5.1 而言，这两条在 Hugo 0.170 上无法同时成立。

据下文的调研，Docsy 0.17.0 和 Doks 2.0 选择了要求安装 Dart Sass。本次评审没有在 Hugo 0.170 上构建 OINK。

### 主题样式依赖什么 {#style-dependencies}

以下数据于 2026-11-21 在主题仓库中测得：

| 事实 | 数值 |
| --- | --- |
| 主题自有的 SCSS | `assets/scss/` 下约 16,600 行 |
| 不重复的 `--td-*` 自定义属性 | 185 个 |
| Sass 变量引用 | 147 处，涉及 55 个变量 |
| mixin 调用 | 50 处，其中 39 处是 Bootstrap 的 `media-breakpoint-*` |
| `@extend` 规则 | 15 条 |
| Bootstrap | 5.3.8；导入了完整的 SCSS，并为下拉菜单加载 `bootstrap.bundle.js` |

在那个时间点，主题的大部分设计已经用自定义属性表达。剩下的 Sass 用法并不多，但 Bootstrap 的调色板当时仍由 Sass 在编译期计算。

两次本地试验划定了下文各方案的边界：

- Dart Sass 1.105.2 无法编译当时的 SCSS 源码。它在 `_chroma.scss` 中嵌套的 `@import 'chroma/dark'` 处停止，并提示所有 `@import` 规则已弃用，将在 Dart Sass 3.0.0 中移除。因此，当时更换转译器同样需要修改源码。
- 在 Hugo 0.169.0 上，`PATH` 中既没有 Node 也没有 Sass 时，[`css.Build`](https://gohugo.io/functions/css/build/) 能打包 `@import`，把 `hugo:vars` 展开为 `:root` 自定义属性，按给定的目标浏览器降级原生嵌套，并保留 `@layer`。可见仅依赖 Hugo 就能打包纯 CSS。

### 用户如何使用 SCSS 钩子 {#consumer-hooks}

`bin/update-consumers.py` 清点出 51 个主检出，其中 45 个位于 v1.5.1。它们的钩子文件于 2026-11-21 测得如下：

| 指标 | 检出数 |
| --- | --- |
| 带有非空的 `_styles_project.scss` | 51 个中的 46 个 |
| 其中不使用 mixin、`@extend`、控制规则和 Sass 变量 | 46 个中的 38 个 |
| 使用 `//` 注释 | 46 个中的 44 个 |
| 使用嵌套规则 | 46 个中的 40 个 |
| 使用 `&-suffix` 选择器拼接 | 46 个中的 16 个 |
| 调用 mixin | 46 个中的 6 个 |
| 在变量钩子中设置了 Sass 变量 | 51 个中的 18 个 |

样式钩子合计约 26,000 行，最大的一份有 1,893 行。没有任何一份调用 Sass 颜色函数。变量钩子设置的主要是 `$primary`、`$secondary`、四种状态色、`$line-height-base` 和字体族。

钩子内容大多是用 Sass 注释和嵌套语法写成的纯 CSS，但它们仍不是合法的 CSS：`//` 注释和 `&-suffix` 拼接需要一次机械转换。有 8 份文件确实用到了 Sass 语义。Sass 出口方案如果不处理这些钩子，几乎会破坏所有用户站点。

后续核查发现了第二类依赖：pgsty.com、pigsty.cc 和 pigsty.io 当时在自己的模板里编译 7 个 SCSS 入口，这些入口直接导入主题的 partial。

### 其他框架提供了什么 {#framework-survey}

| 能力 | 见于 | OINK 现状 |
| --- | --- | --- |
| 逐页 Markdown、`llms.txt`、全文合集、页面动作 | Mintlify、Fumadocs、Rspress、Docsy 0.15（实验性） | 已提供，另有 `NAVJSON` 和 CI 中的 Agent 文档评分 |
| 大型站点的嵌套或分区 `llms.txt` | Mintlify、Fern | 每种语言一份索引；全文按顶层分区输出 |
| 只给人看或只给 Agent 看的内容块 | Mintlify、GitBook | 无 |
| 可复制的提示词块 | Mintlify、GitBook | 无 |
| 导航中的页面状态徽标 | Material for MkDocs、Starlight | 无 |
| 代码中的新增、删除与聚焦行 | Expressive Code、Fumadocs、VitePress | 无；代码围栏已有标题、复制、折行、折叠和行选项 |
| 带悬停释义的术语表 | Material for MkDocs、Mintlify | 无 |
| 可关闭的站点公告 | Material for MkDocs、Hextra、Fumadocs | 无 |
| 相关页面 | Mintlify | 只有反向链接 |
| 缺失译文时的可见回退 | Starlight | 语言切换指向该语言的首页 |
| 切换版本时停留在对应页面；过期提示条 | Mintlify、Docusaurus | Docsy 风格的版本菜单和归档版本提示条 |
| 每个 API 操作一个可搜索的页面 | Mintlify、Fumadocs、Scalar | 嵌入 Swagger UI 或 ReDoc；其他输出只给出规范链接 |
| 不含内联脚本的输出 | Relearn 9 | 有内联启动脚本；[部署指南](/zh/docs/admin/deploy/)说明了哈希和 nonce 的做法 |

上文关于 Hugo 的陈述直接读自其发布页和函数参考，两次试验在本地执行。其余各行来自 2026-11-21 对各项目自身文档和更新日志的调研，经由摘要工具读取，没有逐行复核。某个阶段要依赖其中一行之前，应当重新确认。

Hugo 自 v0.153.0 起也增加了相关能力：由语言、版本和角色构成的站点矩阵，以及 `sites.complements`，它能把已有页面借给另一个站点而不写出新文件。内容适配器可以用本地数据生成页面。下文 R1 到 R3 在冻结格式之前必须评估这些能力。

### 已经做好的部分 {#existing-strengths}

OINK 已有 29 个短代码、22 个 Landing 区块、Book 出版、双列视图、视觉预设、静态反向链接，以及支持中日韩与拉丁文字混排的本地搜索。它的静态 Agent 输出比调研中的多数开源框架更完整。社区 issue 提出的主要是正确性和阅读舒适度，而不是更多的组件家族。因此 R1 只补缺口，不增加新的家族。

## 目标与非目标 {#goals-and-non-goals}

目标：

- 用当前的 Hugo 版本构建 OINK，不需要其他可执行文件；
- 为每一个现有用户的样式钩子提供经过测试的迁移路径；
- 用静态、语义化的输出补齐读者与作者侧的基线缺口；
- 完成版本生命周期与 API 参考，使其内容进入搜索、打印、Markdown 和 Agent 输出；
- 主题自带的联网功能继续默认关闭。

非目标：

- 普通构建需要 Dart Sass、Node 或 OINK CLI；
- 托管的问答助手、MCP 服务器、分析后端或登录后可见的内容；
- 可视化编辑器或新的阅读外壳；
- 带类型信息的代码悬停、页面朗读或 API 测试平台；
- 在上述阶段交付之前实现交互式图谱视图（G2/G3）。

## R0：Sass 出口 {#sass-exit}

### 可选方案 {#sass-options}

| 方案 | 用户需要什么 | 评估 |
| --- | --- | --- |
| A. 要求安装 Dart Sass | 每台机器、每个 CI 任务和容器都多一个可执行文件 | 被现有的依赖契约否决 |
| B. 停留在 Hugo 0.169.0 | 什么都不需要 | 不可持续，之后的上游修复都无法采用 |
| C. 发布编译好的 CSS，用自定义属性和纯 CSS 定制 | 只需要 Hugo | 2026-11-22 选定，并最先交付 |
| D. 先把主题源码全部改写为纯 CSS | 只需要 Hugo | 对用户的结果与 C 相同。先做它会推迟升级，因此排在 C 之后作为下一步完成，并移除了维护者侧的编译器 |

### 决定与已交付的设计 {#sass-design}

2026-11-22，负责人选定方案 C：随主题交付编译好的 CSS，退役 SCSS 钩子，并调整那些自行编译主题 SCSS 的站点。这第一次交付仍以 SCSS 为源码，并把编译好的样式包提交进仓库，维护者因此还需要 LibSass。随后源码改写为纯 CSS，也就是把方案 D 作为下一步完成，编译器随之移除。两步都已在主题 main 分支实现，尚未发布。其契约见[纯 CSS 样式表的交付](/zh/docs/design/architecture/#stylesheet-delivery)。

| 事项 | 状态 |
| --- | --- |
| 样式表源码 | 已完成。`assets/css/td/` 下的纯 CSS 分层文件，由 `layouts/_partials/css/layers.html` 按层叠顺序列出。`assets/scss/`、vendored SCSS、`assets/oink/` 下编译好的样式包以及 `bin/build-css.py` 均已删除。Git 中不保留任何生成文件 |
| 用户侧构建 | 已完成。`css/bundle.html` 用 `resources.Concat` 拼接各层；模板不调用任何编译器，也没有构建步骤。样式表不经过 `css.Build`：它无需打包，而 `css.Build` 还得把每个字体 URL 声明为外部资源 |
| 站点层 | 已完成。`assets/css/project.css` 与 `assets/css/project/*.css` 为纯 CSS，作为一份样式表发布在主题样式表之后。Hugo 只压缩、不转换 |
| Sass 变量 | 已完成，但做法与草案不同。没有新增令牌推导。站点把变量原本产生的取值，在 `project.css` 里写成普通覆盖规则。主题内部原先是 Sass 变量的取值，现在直接写在各层里 |
| 站点自有外壳 | 新增。布局按名称向 `css/bundle.html` 取用 `chrome`、`landing`、`search` 或 `compare`。它们取代了 pgsty.com、pigsty.cc 和 pigsty.io 在自己模板里编译的 SCSS partial |
| 编译器 | 已关闭。站点和维护者都不再需要编译器，是否用 Dart Sass 取代 LibSass 的问题不复存在 |
| Hugo 0.170 基线 | 站点构建已于 2026-11-22 在只有 Hugo 的环境下通过 Hugo 0.170.1 验证，转换完成后又于 2026-11-23 再次验证。不固定任何 Hugo 版本：检查使用本机安装的版本，CI 安装当前版本，任何 edition 均可。`theme.toml` 与 `hugo.yaml` 仍声明最低版本为 0.169.0 |
| 所属检查器 | `bin/check-stylesheets.py` 取代 `bin/check-scss.py` |
| 精简 Bootstrap | 脚本已完成，样式仍是待办。主题不再加载 Bootstrap 的 JavaScript，见下方 2026-11-23 的记录。精简样式不属于这次交付。Bootstrap 的每个组件现在都是 `assets/css/td/bootstrap/` 下独立的分层文件 |

两步都没有改变页面的外观。第一次交付之后，对没有样式钩子的站点，生产样式表与此前相同，仅有一处 `@starting-style` 块内的空白不同。改写为纯 CSS 没有改动任何规则：2026-11-23 在 Hugo 0.170.1 上，生产环境的 `main` 样式表与最后一次由 Sass 编译的结果逐字节相同（556,437 字节），回归夹具的 683 个产物文件除样式表路径外完全一致。四份较小的样式表现在复用 `main` 的各层，因此多出了一些选择器，但没有任何规则或声明发生变化。

### 兼容性与迁移 {#sass-migration}

三个 SCSS 钩子曾是公开接口，因此退役它们属于破坏性变更。这是否使该版本成为大版本，仍待决定。

- 钩子由人工转换，步骤见[升级指南](/zh/docs/admin/upgrade/#sass-hooks)。站点规则现在排在主题之后加载，会压过后面同权重的主题规则，最明显的是视觉预设，因此转换后的站点需要逐页比对。
- 这次交付期间写过一个一次性的转换工具，随后连同它编译时依赖的 Sass 覆盖层一起移除，主题因此不保留任何旧的 Sass 路径。移除之前，2026-11-22 对清点出的 46 份钩子文件做过演练，没有任何一条核对失败；同一天，对清点出的 51 个检出逐一复制副本，仍带钩子的先做转换，再在只有 Hugo 的环境下用新主题和 Hugo 0.170.1 构建：50 个构建成功，共 55,020 个页面，没有任何样式告警。剩下的 pgsty.com 在该批量环境中拉取自身的远程报告清单超时，在单独的一次构建中完整通过。
- pgsty.com、pigsty.cc 和 pigsty.io 由人工调整。第一次交付之后，2026-11-22 重新构建出的样式表复现了旧编译结果的每一条声明，七份样式中有四份压缩后逐字节相同。它们现在按名称取用那几份较小的样式表。
- 传统的 `themes/oink` 用户站点和 vendored 副本走同一条路径，并按发布流程的既有要求单独审查。
- 主题中已没有可供站点自行编译的 SCSS。需要改动 Bootstrap 的站点，在项目样式表里覆盖相应的自定义属性和规则。主题不调用编译器，也不保留旧的 Sass 路径。

其余用户站点在采用该版本时转换。在此之前，仍带钩子的站点会带一条告警、以主题默认样式构建。

## R1：读者与作者侧的小缺口 {#small-gaps}

各项相互独立。凡是增加标记的都需要显式启用；HTML 中为静态内容，打印时展开，Markdown 和 Agent 输出中为纯文本。名称均为暂定。

| 项目 | 建议的行为 | 主要约束 |
| --- | --- | --- |
| 页面状态 | 用 front matter 中的 `new`、`beta`、`deprecated` 等取值标记侧栏条目和文章标题区 | 取值集合封闭，覆盖 32 种语言。`NAVJSON` v1 是封闭 schema，保持不变 |
| 代码围栏的行标记 | 用围栏属性标出新增、删除和聚焦的行 | 用属性而不是源码内注释，这样“复制”得到的仍是作者写下的源码 |
| 术语表 | 每种语言一份数据文件定义术语；显式引用在悬停和聚焦时显示释义，并生成术语表页面 | 第一阶段不自动扫描页面文本 |
| 公告 | 一条站点级通知，可以关闭，文字变更后重新显示 | 没有 JavaScript 时仍然可见；不进入打印、Markdown 和订阅源 |
| 相关页面 | 页面末尾的一组链接，来自 Hugo 的相关内容索引或 front matter 中的显式列表 | 与反向链接并列，不形成第二个导航权威 |
| 缺失译文回退 | 某种语言可以显示源语言页面，并附可见的提示 | 绝不静默回退。页面声明自己真实的语言和规范 URL |
| 404 建议 | 404 页面根据本地搜索索引给出相近的页面 | 仅在启用本地搜索时生效，不联网 |
| 可排序表格 | 作者用标记为表格阅读器加上按列排序 | 不是默认行为；其他输出保持作者写下的顺序 |

相关页面已经覆盖了局部图谱视图能带来的大部分价值。因此[知识图谱提案](/zh/docs/design/proposals/knowledge-graph/#delivery-stages)中的 G2 和 G3 继续搁置。

## R2：版本生命周期 {#version-lifecycle}

详细草案仍在 [CLI 路线图](/zh/docs/design/proposals/oink-cli-roadmap/#version-lifecycle)中。本路线图只增加一项要求：在冻结清单格式之前，把 Hugo 原生的版本维度与各版本独立构建的做法做一次对比评估。

评估必须回答：

1. 版本维度能否与现有的 `params.versions` 菜单和外部归档并存？
2. 多个版本乘以两种或更多语言时，构建时间和输出体积要付出多少？
3. 原生维度是否不需要单独的逻辑键就能给出页面对应关系？
4. 规范 URL、搜索索引和 Agent 合集如何限定在单个版本之内？
5. 既然 `NAVJSON` v1 是封闭的，用哪个新的 schema 版本承载版本标识？

读者侧的目标沿用 CLI 路线图，并从调研中增加两条：切换版本时停留在对应的页面；过期或未发布的版本在每个页面上都明确说明。

## R3：静态 OpenAPI 参考 {#openapi}

Swagger UI 和 ReDoc 只在 HTML 中渲染。打印、Markdown 和订阅源得到的是一条指向规范的链接，各个操作进不了本地搜索和 Agent 合集。无障碍测试也排除了这两个嵌入组件。

[CLI 路线图](/zh/docs/design/proposals/oink-cli-roadmap/#openapi)建议用生成器写出 Markdown。做出选择之前，应当把它与 Hugo 内容适配器做对比：后者在构建时根据本地规范为每个操作生成一个页面。适配器不需要 CLI，也不需要把生成的源文件提交到 Git，但必须在模板中处理引用和循环引用。对比时要用真实的规范，而不是玩具示例。

无论选哪一种，结果都是进入现有输出管线的普通页面。交互式请求不在第一个增量之内。日后如果加入，凭据只保存在会话存储中，并且不使用代理。

## 持续进行的工作 {#continuing-work}

### Agent 输出 {#agent-output}

| 项目 | 建议的行为 |
| --- | --- |
| 分区 `llms.txt` | 大型站点按分区拆分索引，使每个文件都不超出体积检查的上限 |
| 受众标记 | 用块属性让内容只出现在 HTML 中，或只出现在 Markdown 与 Agent 输出中，在构建时决定 |
| 提示词块 | 用代码围栏渲染一段可复制的提示词，并复用现有的页面动作 |
| 发现文件 | 需显式启用的实验：发布站点自己编写的技能文件及其 well-known 索引。相关约定仍在变化 |
| 内容协商 | 为 `Accept: text/markdown` 提供有文档说明的服务器配置示例。静态托管做不到这一点，所以它是指南而不是主题功能 |

托管的 MCP 服务器和内置助手仍不在范围内。站点可以通过现有的[搜索尾部扩展](/zh/docs/design/shell/#search-tail-extensions)接入自己的服务。

### 工程质量 {#engineering-quality}

- **严格 CSP**：把稳定的内联初始化脚本移到同源文件中，用数据传递配置；必须保留为内联的部分，发布一份哈希清单。这样可以关闭 [F10](/zh/docs/design/research/2026-08-26-comprehensive-review/#f10-csp)。
- **浏览器引擎矩阵**：在 Firefox 和 WebKit 上运行核心外壳、导航、内容和对话框测试，并发布支持矩阵。这样可以关闭 [F11](/zh/docs/design/research/2026-08-26-comprehensive-review/#f11-browser-compatibility)。
- **导航体感**：在一个指明的生产站点上执行[性能规则](/zh/docs/design/architecture/#outputs-and-runtime)已经描述的 Speculation Rules 实验，同时试验只用 CSS 实现的跨文档视图过渡。
- **内容新鲜度**：front matter 中可选的审阅日期、负责人和过期时间，显示在页面注记中，并由 CLI 报告。修改日期绝不能当作“已核实”来展示。
- **社交卡片**：构建时生成图片需要站点自带能显示中日韩标题的字体，因此排在最后。

## 推进顺序 {#sequencing}

| 顺序 | 交付内容 | 退出依据 |
| --- | --- | --- |
| 1 | R0 编译样式的交付，已被第 3 行的纯 CSS 源码取代 | 已在 Hugo 0.169.0 与 0.170.1 上、`PATH` 中没有任何 Sass 程序时完成：主题检查器、文档站的检查与浏览器测试，以及回归夹具的逐文件比对 |
| 2 | R0 迁移工具，在清点出的 51 个检出上演练 | 已完成，随后移除：每份钩子文件都能转换，没有声明核对失败，有一个站点需要复核。该工具已连同它依赖的 Sass 覆盖层一起删除，钩子现在由人工转换 |
| 3 | R0 纯 CSS 源码，已实现、未发布 | 已于 2026-11-23 在 Hugo 0.170.1 上完成：生产环境的 `main` 样式表与最后一次由 Sass 编译的结果逐字节相同，回归夹具除样式表路径外完全一致。不再有编译器，也不再有生成文件 |
| 4 | 退役钩子的那个版本及用户站点采用 | 已发布的固定版本经过验证；用户站点仅依赖 Hugo 即可构建 |
| 5 | R1 各项，逐项独立交付 | 所属检查器、每种输出的 golden、双语契约 |
| 6 | R2 评估，随后接受一个设计 | 做出兼容性承诺之前，有两个真实仓库在使用 |
| 7 | R3 对比，随后接受一个设计 | 一份真实规范的全部内容都有着落 |

Agent 输出和质量方面的事项，在不与当前阶段争抢资源时穿插进行。Bootstrap 精简已从 R0 中砍掉。它的脚本此后已经移除，样式的精简仍是待办。

## 实现与所属检查器 {#implementation}

| 阶段 | 主题侧负责 | 文档站与 CLI |
| --- | --- | --- |
| R0 | `check-stylesheets.py` 负责各层及其拼接；`check-presets.py` 与 `check-font-tokens.py` | 中英文的浏览器、外观和视觉审查 |
| R1 | `check-shell.py`、`check-components.py`、`check-code-blocks.py`、`check-goldens.py`、`check-i18n.py`、`check-params.py` | 内容、键盘和无障碍测试；双语指南 |
| R2 | `check-shell.py`、`check-navigation-contract.py`、`check-agent-indexes.py`；新的导航 schema 版本 | CLI 的检视与页面对应关系检查 |
| R3 | `check-output.py`、`check-components.py`、`check-search.py` | 真实规范的测试夹具；不再排除嵌入组件的无障碍测试 |

每个阶段被接受后，其行为以双语形式移入所属契约，然后从本页移除。

## 验收标准 {#acceptance-criteria}

- R0：未做定制的用户站点在只安装了 Hugo 的环境中，用 Hugo 0.170.1 或更高版本渲染出相同的页面；各层清单与分层文件不一致，或布局调用了编译器时，样式表检查器失败；升级指南说明站点如何转换自己的钩子。
- R1：每一项在 HTML、打印、Markdown 和 RSS 中的行为都有 golden 覆盖，文案覆盖全部 32 种语言，并通过键盘、强制颜色、RTL 和窄屏审查。
- R2 与 R3：有一个指明的真实用户站点；做出任何兼容性承诺之前，双语契约已被接受；不出现第二个导航权威或 Markdown 权威。
- 所有阶段：输入无效时，普通的 `hugo server` 仍然可用；正常构建不下载任何内容。

## 待决事项 {#open-decisions}

1. Sass 出口是否值得一个大版本，还是可以在 1.x 中安排一个过渡版本？
2. 已关闭：主题源码是纯 CSS，已于 2026-11-23 验证。不再有维护者构建，因此无需选定 Dart Sass 版本，它带来的 11 处选择器变化也不再是问题。
3. 已于 2026-11-22 决定：不为自行安装 Dart Sass 的站点保留旧路径。
4. 暂时决定：品牌色与语义色是站点 CSS 中的自定义属性。以后仍可增加配置键。
5. 页面状态的取值集合是否封闭？
6. 术语表链接是否有朝一日自动生成？
7. 行标记在 Markdown 输出中是直接丢弃，还是转成 diff 围栏？
8. 版本生命周期采用 Hugo 原生维度，还是各版本独立构建？
9. API 参考由内容适配器生成，还是由 CLI 生成？
10. 由哪个生产站点来测量 Speculation Rules？

## 决策记录与来源 {#decision-log}

- 2026-11-21：起草。依据包括对主题、现有提案与社区 issue 的评审，对其他框架的调研，以及 Dart Sass 和 `css.Build` 的本地试验。
- 2026-11-22：负责人决定采用编译样式交付、退役 SCSS 钩子，并人工调整三个自行编译主题 SCSS 的站点。已在主题 main 分支连同文档站和这三个站点实现；尚未提交、打标签或部署。R0 设计一节现在记录实际构建的内容，它与草案有三处不同：不使用 `css.Build`，没有令牌推导，新增了供站点自有外壳使用的样式包。
- 2026-11-22：升级本机 Hugo 后在 Hugo 0.170.1 上完成验证。`PATH` 中只有 Hugo 时，主题检查器全部通过；回归夹具的 686 个产物文件除主样式表外与此前的管线一致；文档站通过其检查与 546 项浏览器测试；51 个用户站点检出中有 50 个在转换后构建成功。已发布的 v1.5.1 在该版本的 Hugo 上构建失败，因为它需要 Dart Sass。当时维护者侧的编译器仍是 Hugo Extended 0.169.0 内置的 LibSass。
- 2026-11-23：样式表源码改为纯 CSS，由 Hugo 用 `assets/css/td/` 下的分层文件拼装。`assets/scss/`，Bootstrap、Font Awesome、Inter 与 IBM Plex Sans 的 vendored SCSS，`assets/oink/` 下编译好的样式包，`bin/build-css.py`，以及重新编译样式包的 CI 任务均已删除。`bin/check-stylesheets.py` 取代 `bin/check-scss.py`，样式表改为发布在 `/css/` 下而不是 `/scss/` 下。已在 Hugo 0.170.1 上验证：生产环境的 `main` 样式表与最后一次由 Sass 编译的结果逐字节相同（556,437 字节），回归夹具的 683 个产物文件除样式表路径外完全一致。维护者侧编译器的问题就此关闭，因为已经没有编译器。不固定任何 Hugo 版本。以上位于主题 main 分支，尚无任何标签包含。
- 2026-11-23：主题不再加载、也不再随包分发 Bootstrap 的 JavaScript，Popper 随之移除。用到这份脚本的只有两个控件：底栏与手机抽屉里的版本菜单，以及 Landing `download` 的渠道切换。前者现在与导航栏的版本菜单一样是悬浮弹层，位置由 CSS 决定；后者由 Landing 运行时切换。两者的标记类名和外观都保持不变。每个页面都要加载的核心脚本 `js/core.js`，压缩后从 92,443 字节降到 8,740 字节。站点自己的标记如果用到 Bootstrap 的脚本组件，需要自行加载这份脚本；清点过的 48 个模块消费站点都没有用到。位于主题 main 分支的工作树；目前没有任何标签包含它。

以下来源读取于 2026-11-21：

- [Hugo v0.170.0 发布说明](https://github.com/gohugoio/hugo/releases/tag/v0.170.0)
- [Hugo `css.Build`](https://gohugo.io/functions/css/build/)
- [Hugo 术语表](https://gohugo.io/quick-reference/glossary/)，以及论坛中关于[补全缺失译文](https://discourse.gohugo.io/t/using-the-multidimensional-content-model-to-fill-in-missing-translations/56741)的讨论
- [Docsy 更新日志](https://www.docsy.dev/project/about/changelog/)
- [Mintlify 文档](https://mintlify.com/docs/ai/llmstxt)
- [Starlight 插件](https://starlight.astro.build/resources/plugins/)与 [Expressive Code](https://expressive-code.com/key-features/text-markers/)
- [Fumadocs](https://www.fumadocs.dev/docs/integrations/llms)
- [Material for MkDocs 参考](https://squidfunk.github.io/mkdocs-material/reference/)
- [Relearn 发布说明](https://mcshelby.github.io/hugo-theme-relearn/introduction/releasenotes/index.html)
