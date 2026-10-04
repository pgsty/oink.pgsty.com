---
title: 可选 CLI 与结果契约
linkTitle: CLI 契约
description: 当前本地 CLI 候选的独立 Go 可执行文件边界、版本化诊断、隔离验证与有保护的维护计划。
weight: 50
icon: fa-solid fa-terminal
search_keywords: [OINK CLI, oink.result/v1, 诊断, 退出码, 覆盖范围, 离线, 升级]
design_kind: decision
design_status: accepted
decision_date: 2026-09-29
last_verified: 2026-10-04
implementation_status: local-candidate-not-released
---

> [!IMPORTANT] 当前范围；本地候选
> 本契约描述 2026-10-04 收缩后的本地 `0.1.0-dev` 命令界面。保留站点诊断、
> 真实 Hugo 检查、初始化、构建、升级及有保护的维护计划；使用 Cobra、默认彩色
> 英文文本与 JSON/YAML 结果。Studio、通用编辑、context、snippets、editor 与
> CI 生成已撤下。历史 R1–R8 验收只对记录中的源码和二进制成立，不能替代当前验证。
> 尚未建立公开 CLI 发布、Homebrew 分发或部署。

## 背景与归属 {#ownership}

主题是 Hugo 模块；消费站工具是可选的可执行文件，具有不同的安装和版本发布周期。
`pgsty/oink-cli` 负责名为 `oink` 的可执行文件及其 Go 测试。它调用外部 Hugo
二进制，不引入 Hugo 私有运行时，也不在运行时依赖同级 checkout、Python、Node.js
或未发布的主题脚本。

配置解析、渲染、路由与锚点由 Hugo 负责。CLI 检查 Hugo 的生效配置、模块图、挂载
与渲染文件，不另建路由解析器、导航权威或配置命名空间。仅针对主题的回归脚本继续
作为维护者工具。[架构契约](/zh/docs/design/architecture/)仍负责主题行为；本页
负责首期 CLI 边界与结果封套。

配置预处理仅在临时副本中重定位 workspace、replacement 与缓存路径。默认值、
配置合并、语言选择、验证和渲染语义仍由 Hugo 负责。

[使用指南](/zh/docs/start/cli/)提供安装与命令示例。
[带日期的验收记录](/zh/docs/design/research/2026-09-29-cli-acceptance/)将已执行
检查、未解决限制和发布状态分开说明。
[维护验收记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
保留历史 R1–R8 计划与绑定源码的验收证据。
[路线图](/zh/docs/design/proposals/oink-cli-roadmap/)继续保留后续提案和采用假设，
不再重复当前命令参考。

## 命令与修改边界 {#commands}

命令帮助按日常、维护与发布分组，使用 `oink COMMAND --help` 查看准确选项。

| 命令 | 行为与写入边界 |
| --- | --- |
| `doctor` | 只读工具链、生效配置、模块来源、workspace/replacement/vendor 诊断 |
| `check [links\|translations\|style]` | 在隔离副本中检查真实 Hugo 输出及声明的源码/翻译政策 |
| `init DIRECTORY` | 先验证固定 Starter，再创建新的或空站点 |
| `dev`、`build` | 普通 Hugo 进程；正常输出与缓存写入由 Hugo 管理 |
| `upgrade --to TAG` | 默认预览，只有 `--write` 才应用验证后的模块修改 |
| `translations status`、`translations diff PAGE` | 只读关系、哈希审阅状态和差异 |
| `translations review SOURCE TARGET`、`baseline capture` | 必须提供审阅者与理由，默认预览，可保存新 `--plan` |
| `new BUNDLE --title TEXT`、`move SOURCE TARGET` | 验证候选并预览完整 diff，可保存新 `--plan` |
| `plans apply FILE` | 重新验证受支持的已保存计划，仅写选定站点的指定文件 |
| `inspect PAGE`、`impact --since REF` | 只读真实页面与历史/当前影响事实 |
| `workspace list`、`workspace check [GROUP]` | 仅选择显式登记的站点 |
| `build --check` | 检查、封存并导出同一次隔离生产渲染 |
| `artifacts verify` | 离线比较本地产物与清单 |
| `verify` | 显式 `--network` 后比较部署 HTTP 响应与清单 |

联网默认关闭，所有命令均不交互。Hugo 参数仅在 `dev`/`build` 的 `--` 后透传。
已撤下命令与其旧计划不能应用；受支持计划类型仅为 `authoring.new`、
`translations.review`、`baseline.capture`、`content.move`。

## 版本化结果封套 {#result}

| 选项 | 输出 |
| --- | --- |
| 默认 | 简洁彩色英文文本 |
| `--json`、`-J` | 一个 JSON `oink.result/v1` 对象 |
| `--yaml`、`-Y` | 一个具有相同结果字段与类型的 YAML 文档 |
| `--verbose`、`-v` | 全部发现、覆盖明细与工具日志 |
| `--no-color` | 无颜色英文文本 |

只能选择一种结构化格式。非空 `NO_COLOR` 或 `TERM=dumb` 也会关闭文本颜色。
结构化输出不添加终端颜色，工具日志写入 stderr。`--format json|yaml` 与
`--non-interactive` 保留为隐藏兼容选项；所有命令均不交互。

默认文本展示状态、计数、最多八条活动发现及明确的未检查覆盖。详细事实与已审阅
发现保留在结构化结果中。计划与升级预览展示完整 diff。Cobra 管理命令分发与各级
帮助。CLI 提示采用 ASD-STE100 风格的简短主动英文句，不宣称认证；用户内容与
外部工具证据保留原语言。

| 字段 | 类型与含义 |
| --- | --- |
| `schema_version` | 字符串；本契约使用 `oink.result/v1` |
| `version` | 字符串；CLI 构建版本，开发版本保留相应后缀 |
| `command` | 字符串；请求的命令，或 `help` / `version` |
| `site` | 可选字符串；可取得时的选定源目录或生成目标目录 |
| `exit_code` | 整数；下文定义的 CLI 结果码 |
| `diagnostics` | 发现项数组；空数组表示没有记录发现项 |
| `coverage` | 带范围的覆盖声明数组；调用者必须将它与发现项一并检查 |
| `evidence` | 子进程记录数组；未运行子进程时为空 |
| `data` | 可选的命令专有 JSON 值；当前命令返回诊断事实、初始化来源或升级计划等对象 |

首版允许添加字段与新规则 ID。消费者应忽略未知字段，将 ID 作为不透明字符串，
不解析其拼写。改变已有封套字段的含义或类型，需要新的 Schema 版本。命令专有事实
与原始工具输出属于证据，不是供用户导入内部 Go 包的 SDK。

机器可读 Schema 随 CLI 仓库提供，路径为 `schema/result.v1.schema.json`。
其标识符不证明 Schema 端点或 CLI 公开版本已经部署。

每份证据记录包含 `command`（参数数组）、可选的 `directory`、`stdout`、
`stderr` 和子进程自己的 `exit_code`。捕获的诊断与构建输出保留在结果中。
`dev` / `build` 直接流式输出的内容进入日志流，不再重复缓冲进证据。子进程状态与
CLI 的 `0` / `1` / `2` 结果码不同；负的子进程状态可能表示未取得正常退出码。

[JSON Schema](/schema/cli-result.v1.schema.json) 定义了该结果封装的结构。

## 发现项、严重度与位置 {#diagnostics}

每个诊断包含 `rule_id`、`severity`、`message`、`action`，以及可选的 `location`。
稳定规则 ID 标识问题条件。原始 Hugo 文案、翻译后的消息、路径和特定构建细节不是
稳定 ID。已有 ID 不得重新分配给不同条件。

可选的 `incomplete: true` 标识必需工作失败，政策不能降级这种失败。
经过审阅的排除项和基线确认仍保留在 `diagnostics` 中，附带
`disposition: "excluded"` 或 `"baseline"`，
以及含 `reason`、`reviewed_by` 和 RFC 3339 `reviewed_at` 的 `review`。
被排除的问题保留已记录严重度并保持可见，但不阻断已完成的政策检查。
任何未完成的必需覆盖（包括 `not_checked`）都决定退出码 `2`；
只有 `complete` 或 `not_applicable` 满足必需覆盖。

严重度取值为 `info`、`warning` 和 `error`。`error` 是阻断项，`info` 与 `warning`
是信息或建议项。但如果所需 Hugo 构建因
`--panicOnWarning` 失败，则必要工作未完成。信息性的完成说明与范围解释放在覆盖
详情中。自动化必须读取结果退出码与覆盖状态，不能只统计严重度。

提供 `location` 时，其中包含 `file`，以及可选的 `kind`、`line` 和 `pointer`。
`kind` 区分 `source` 与 `output`。渲染产物中的问题指向实际产物，可以在 `pointer`
中给出元素、属性或 JSON 位置提示；这个字段并不统一承诺采用 RFC 6901 语法。
只有明确知道行号时才提供 `line`。渲染链接失败不能成为编造 Markdown 源码行号的理由。

CLI 不会仅因生成的编辑器 Schema 未列出某个字段，就拒绝合法的自定义 front matter。
配置有效性继续服从 Hugo 与所属主题解析器、检查器；参见
[生成式 Schema 决策](/zh/docs/design/decisions/config-schema/)。

## 覆盖范围与退出语义 {#coverage}

每个覆盖条目包含 `id`、`status`、`required`（布尔值）和 `detail`，描述实际运行的
范围。一份报告可能对同一大类提供多条声明，应全部检查。

| 状态 | 含义 |
| --- | --- |
| `complete` | 所述操作、检查或产物检查范围已完成 |
| `not_checked` | 本次没有检查所述范围 |
| `not_applicable` | 对于当前输入，无需执行所述检查 |
| `unsupported` | 不支持所述契约或必需输入形态 |
| `incomplete` | 所述工作属于必要项，但未能完成 |

| CLI 退出码 | 含义 |
| --- | --- |
| `0` | 请求中的必要工作已完成，没有阻断项 |
| `1` | 已完成的检查发现政策问题，例如损坏的本地链接或不安全的写入请求 |
| `2` | 必要工作未完成，包括参数、工具、构建、I/O、取消或必需契约不受支持等失败 |

未完成状态的优先级高于政策问题。未完成的必需覆盖不能返回成功；
只有 `complete` 或 `not_applicable` 能满足必需覆盖。
Hugo 构建失败时保留原始证据并停止产物验收，不会把旧产物或部分产物报告为检查通过。
未启用的可选机器输出不构成缺失输出错误。

渲染引用范围包括受支持的 HTML URL、锚点和已输出的机器契约。覆盖声明明确排除
浏览器交互、无障碍、视觉呈现、外部 URL 可访问性、托管重定向及生产部署，也列出
未检查的动态资源与内容语义。静态产物证据不能证明未声明的翻译覆盖、翻译语义等价
或浏览器执行结果。

Hugo 公共 `Page.OutputFormats` 按页面和启用语言给出预期产物名称与 URL。隔离
副本添加带有本次运行唯一标识、不会进入普通列表的探针；每个启用语言都必须输出
自己的有效清单。产物检查前会移除已识别的探针文件，不改动已有页面选择的输出。
未进入普通列表的静态内容通过 Hugo `GetPage` 解析，不从源码语法推导路由或输出
文件名。枚举还提供每种语言的生效 base URL 与本地搜索设置。已启用且受支持的机器
产物按这些确切预期检查；未启用的可选输出仍然可选。

同一 Hugo 探针通过公共 `Page.Path`、`Page.File`、`Page.Translations`、
`Page.Aliases` 和 `Page.OutputFormats` 提供 `data.pages`，保留语言、实际 URL、
发布设置、翻译关系及声明输出。没有可靠来源时，`sourceKnown: false` 和
`sourceScope: "unknown"` 明确说明未知；生成分区不会得到虚构的源文件。
站点所属的已知路径相对于选定站点，已复制的已知依赖输入明确标记依赖范围。
这些事实描述生产视图；独立的内部分析视图可以包含草稿、未来和过期页面，
但不改变生产产物，也不把它们声称为已发布。

`data.references` 记录实际观察到的 HTML 和机器输出引用、解析后的实际 URL、
产物文件/位置、存在时的本地目标和已检查时的锚点状态，不推断 Markdown 源码行号。
页面与引用数据仍是可增补的命令证据，不是公开 Go SDK。

## 项目检查政策 {#project-policy}

选定站点根目录可以提供普通文件 `oink.yaml`，使用
`schema_version: oink.policy/v1`，管理检查选择、严重度覆盖、经审阅的问题排除、
外部 URL 范围、翻译范围、受保护正文声明和可选基线文件路径。
语言、标题、URL、菜单及配置继续归 Hugo 输入所有；依赖版本归模块文件。
符号链接、未知字段/分组、不支持版本、无效审阅元数据或多个 YAML 文档属于必需输入失败
（退出码 `2`）。诊断与检查只读取这项政策。

没有政策时，链接、翻译和风格均启用且必需。`check links`、
`check translations` 或 `check style` 显式选择一个必需分组，不受政策选择影响。
未选中或禁用的可选分组报告 `not_checked`。每次检查仍保留必需的严格 Hugo
构建和输出枚举前提。独立检查的翻译与源码引擎另用显式且不可发布的草稿/未来/过期
分析视图，从不替代生产产物。受管理的 `build --check` 只渲染生产视图，遇到未知且
必需的范围身份时返回 `2`。

`rules` 映射向确切且不透明的规则 ID 指定 `error`、`warning` 或 `info`。
经审阅的 `exclusions` 项须有 `rule_id`、规范相对 `file` glob、`reason`、
`reviewed_by` 和 RFC 3339 `reviewed_at`；不支持 `**` 和路径逃逸形式。
站点内部源码位置使用相对站点路径匹配；选定站点之外的源码路径不能匹配排除项。
问题及审阅元数据保持可见。必需构建、输入、工具或覆盖失败不能经严重度更改或排除变成成功。

同 origin 但位于配置 base path 之外的 HTML 引用属于政策问题，除非经审阅的
`external_scopes` URL 声明其为单独部署的路径范围。每项范围要求同样的审阅元数据，
以及不含凭据、query 或 fragment 的绝对 HTTP(S) URL；匹配按完整路径段进行。
范围不能豁免项目内部缺失目标或机器输出的必需本地目标。
不同 origin 的引用在离线静态检查中仍明确标记为未验证。

## 翻译政策与审阅证据 {#translations}

`translations.scopes` 按规范绝对 Hugo `Page.Path` 前缀选择源页面，再通过 Hugo
翻译身份寻找目标，不从文件名推断公开路由或语言。每项范围包含 `path`、
`source_language`、`required_languages`、`mode` 和 `drafts`。
`mode` 默认 `localized`，也支持 `strict`。`drafts` 默认 `include`；
`ignore` 排除草稿源页面/目标，`require-published` 要求选定源页面和必需目标实际
存在于生产发布视图。Hugo 已知但禁用的语言为 `not_applicable`；未知语言属于
无效政策。最具体的匹配路径决定源页面所属范围。

没有范围时，检查以 Hugo 已启用默认语言为源的已有配对及重复关系，不要求全站普遍
本地化；`translations.coverage` 将未配置语言覆盖记为可选 `not_checked`。
缺失必需目标和选定关系重复属于政策问题。草稿/发布状态与审阅状态分别记录。

约束均须显式选择：严格模式的 `explicit_ids` 比较完整的已识别显式 ID 映射，
本地化模式要求选定 `ids` 列表。`ids` 要求两份文件均有指定 ID，`placeholders`
比较指定正文字符串的确切数量，`code_labels` 保护指定语言/info token 的围栏代码。
`required_fields` 要求双方指定的点分 front matter 字段非空；`equal_fields`
比较其实际值。默认没有规则要求标题数量、翻译正文或所有代码块一致。

`.oink/translations.json` 使用 `oink.translations/v1`。显式审阅记录绑定 Hugo
源/目标 ID、源语言、完整源文件/译文的字节 SHA-256、审阅人、理由和 RFC 3339
时间。无记录为 `unknown`；哈希相等为 `current`；仅源、仅译文或双方改变分别为
`source_changed`、`translation_changed`、`both_changed`。这些状态只证明审阅后
发生变化，不判断翻译语义。文件修改时间不能建立审阅状态。来源未证实则保持未知；
已有审阅或受保护约束无法验证时，返回必需工作未完成。

## 原生内容规则与覆盖 {#native-content}

源码规则从 Markdown 结构和独立的已启用 Hugo 属性提取证据，保留原始 UTF-8
字节、CRLF/BOM、源码偏移及含未知字段的 YAML/TOML/JSON front matter。
实际生效的 Hugo 属性开关和数学透传分隔符控制识别。围栏/行内代码、短代码主体、
原始 HTML 和透传内容不会成为正文或虚构标题。不支持的正文语法保持可见；
必需源码覆盖不能静默通过。

通用规则检测重复的已识别显式 ID，并检查 `style.protected` 声明中的 `file`、
确切正文 `literal` 和预期 `count`。有界 OINK v1.1.0 目录另提供代码/表格属性、
弃用 front matter 和被丢弃的不安全属性建议。每项规则在
`data.native_rule_provenance` 中记录模块、版本、不可变 revision、模块 sum、
许可证及确切来源文件的 SHA-256。

只有实际挂载的公开 v1.1.0 模块缓存输入匹配这些哈希时，才运行该目录。
replacement、vendor 副本、其他版本或未知来源不选择最新主题回退：
`native-theme-rules` 为可选 `not_checked`，通用语法检查仍运行。
这份目录不保证覆盖每个自定义组件或主题功能。

## 基线与经审阅文件计划 {#review-plans}

`baseline` 选择规范相对文件，默认 `.oink/baseline.json`，使用
`oink.baseline/v1`。捕获要求工作已完成并有显式审阅元数据。指纹绑定确切规则 ID、
规范化位置/指针和条件消息，不包含严重度。已确认问题保留原严重度，附带
`disposition: "baseline"` 并保持可见；新条件仍按政策阻断。
必需但未完成的发现项或覆盖不能被确认豁免。

审阅和捕获预览 `oink.plan/v1`：选定编辑、可读 diff、基础存在状态/字节/模式、
修改后字节及只读保护条件。计划 ID 不包含可变的验证/应用/恢复状态。
`--plan FILE` 排他保存计划；这些命令不接受 `--write`。
`plans apply FILE --site DIR` 要求确切选定站点、通过相同检查重新验证隔离候选，
并在任何写入前重新检查源码保护条件。逃逸、`.git`、符号链接和非普通文件受保护，
候选与源码目录重叠会被拒绝。过期计划安全失败。可选 `external_inputs_hash` 将
捕获的非站点输入字节、完整模式和清单绑定计划 ID。这个不透明 SHA-256 不授予
外部路径或读取权限；归属验证器比较新证明的输入，选定写入前后重新核对可信原始
外部保护条件。

排他安装保留提交期间新创建的文件。部分失败只还原本次拥有且未变化的写入，保留
后续编辑器字节、模式或删除状态。报告的恢复目录保存原字节/模式及实际捕获的并发
证据。无关文件和编辑器新建子文件均保留。文件内容不能授权 shell 执行或发布。

## 捕获页面查询与影响 {#project-graph}

`inspect PAGE` 按精确的 language:path ID、Hugo Path、permalink 或已证明的
站点源文件选择实际 Hugo 页面。已知默认语言可消解同一 Path 的多语言匹配；仍有
歧义或未知选择器时返回必需未完成 `2`。`data.inspection` 展示源码字节哈希、完整
模式、实际输出身份、观察到的入站/出站引用、翻译与物理 bundle 附件。物理附件与
观察到的发布资源分别记录。

`impact --since REF` 比较捕获的当前输入与隔离的 Git 已提交树，二者由同一 Hugo
引擎渲染。保留已删除的旧页面与其入站边，纳入未修改的引用页面、翻译同伴、附件及
实际派生产物。全局或不确定输入扩大因果范围；alias 等无法证明页面归属的实际
HTML 输出也会保守扩大为全范围。不会按 alias 声明猜测路由归属。只有证明归属 Git
模式范围的历史输入比较可执行位；其他模块/外部输入与当前事实保留完整模式。

历史 materialization 读取有界 Git 对象，不运行 checkout hook、filter、smudge
或文档内容。上限为 10,000 个文件、单文件 16 MiB、树总计 128 MiB；必需的私有
历史上限为 256 MiB。符号链接、submodule、超限/缺失对象、必需历史不完整及不支持
的 monorepo GitInfo 均明确为未完成。已提交的站点内部依赖可被证明；当前外部本地
replacement/workspace 字节不能替代历史证据。

`data.impact.baseline_state` 为 `complete`、`incomplete` 或 `unavailable`。
必需基线不可用时返回 `2`，保留全部已知当前页面、附件、引用与输出，并扩大范围。
不虚构旧页面或变更；只记录实际解析出的 commit。`check [GROUP] --since REF`
有意执行完整当前检查，并声明 `data.check_scope: full`，不承诺增量提速或部分
验证。`data.impact.full_scope` 单独描述因果不确定性，与验证范围分别表达。

完成的 `inspect`、`impact` 事实查询返回 `0`，即使单独报告的
`data.current_check` 含已完成质量发现 `1`。必需捕获失败仍为顶层 `2`。
`check --since` 保留当前政策的质量退出码和必需完成状态优先级。


`context` 已移除，页面事实可通过 `inspect` 的 JSON/YAML 报告读取。

## 内容移动计划 {#content-moves}

`move SOURCE TARGET [--plan FILE]` 预览物理站点相对文件或 bundle 的迁移。
由实际 Hugo 身份确定翻译同伴与新旧输出。计划包含保留字节/完整模式的文件及二进制
附件、可读 diff、已证明的 Markdown 目标重写、观察到的路由变化及 alias 建议。
不通过重写 front matter 自动安装 alias。原始 HTML、shortcode 输出、经过变换的
目标及源码/输出归属歧义保持为可见人工动作；不修改不透明源码片段。重复的普通
Markdown 目标也可能缺少唯一源码/输出出现位置证明，包括聚合/打印视图。仅 URL
匹配不足以授权重写这些出现位置。物理附件迁移不证明新的发布 URL。资源 URL
变化需要配对实际渲染边及相同产物字节；已证明的处理后图片 URL 不证明绝对原始
资源 URL。未证明的原始 URL 保持人工处理，不按目录迁移构造。

原始 `before` 检查与临时 `route_probe` 独立于最终候选检查。临时迁移可能因旧入站
链接产生发现 `1`。只有最终隔离候选及引用证明通过，计划才标记验证或保存。不支持
的身份或必需捕获失败返回 `2`；实际最终质量失败保持 `1`，不能保存可应用计划。

内容移动计划必须保存在选定站点之外。`oink.plan/v1` 的新增 `move` 选择器与
`source_inputs_hash` 绑定完整原始源码清单、字节及完整模式，同时应用外部输入与新
目录保护。应用已保存计划时重新生成原始/迁移 Hugo 证明，并在最终引用验证前要求
期望 plan ID 与文件完全一致。写前重新核对当前保护条件，恢复原始模式而非隔离
副本模式，拒绝或受保护恢复时保留后续编辑者的字节/模式。过期输入或已有新目标
无法提供必需证明，返回 `2`。只有显式 `plans apply` 写选定文件；预览不 stage
也不提交 Git 变更。

## 支持的输入边界 {#supported-inputs}

首期完整验证支持普通 checkout 或无 Git 元数据的实际文件，包括复制到隔离目录中
的受支持本地模块 replacement。它不会沿已挂载符号链接或外部挂载项返回用户工作区。
有效挂载范围之外的辅助符号链接不复制到快照，也不视为已验证。使用 `.git` 文件的
关联 Git worktree 需要实际文件审查副本；依赖 Git 的行为需要副本具有自己的 Git
元数据。

快照排除顶层 `public`、`resources`、`node_modules`、`tmp` 和 Hugo 构建锁。
挂载项需要这些被排除的输入时，不能静默通过。支持根配置与标准 `config` 树；显式
配置文件必须在选定站点内，自定义 `HUGO_CONFIGDIR` 位置会被拒绝。受支持的配置
路径重定位不构成第二套 Hugo 验证实现。

内容适配器（`_content.gotmpl`）可能生成无法通过受支持公共 Hugo API 完整枚举的
隐藏页面，因此完整产物验证对这类输入返回必要工作未完成。禁用页面类型或选择
render segment 导致某个启用语言缺少探针，也属于未完成。多主机语言配置不在首期
完整检查范围内，返回必要工作未完成；单主机的多语言路径仍受支持。上述情况不能
被报告为成功的部分检查。

## 普通内容计划 {#authoring}

`new BUNDLE --title TEXT [--language LANG] [--translations LANGS]`
`[--kind page|docs|blog|book] [--plan FILE]` 根据捕获的站点自有内容挂载预览普通
Hugo 叶子包。主语言默认采用生效默认语言，选定译文必须是不同的已启用语言。
共享文件名与语言目录布局跟随真实 Hugo 挂载，包括实际 `sites.matrix.languages`
选择，不假定旧 `lang` 字段。含糊、过滤或不支持映射需要人工创作。已有包或占用同一页面的同级内容文件会被拒绝。

主索引 `draft: false`，选定译文索引 `draft: true`。标题文本来自显式输入，不会
自动翻译，也不创建审阅记录。完整质量分析和隔离候选验证先于共享受保护计划。每份新文件必须对应恰好一个
实际站点自有 Hugo 源页面且有实际渲染输出，译文草稿使用显式分析视图。仅链接/无
输出、忽略、隐藏或 build-never 内容不能仅凭既有站点构建正常而通过，即使普通源码检查组关闭也须验证
必需来源身份。
`--plan` 只保存新计划文件，显式 `plans apply FILE --site DIR` 重新验证源码字节/
模式、存在状态、新目录和后续附件冲突，再应用修改。新目录状态绑定计划身份，
在验证前后、写入之间和完成时核对。回滚保留后续编辑器附件并报告恢复，
不删除无关目录条目。

编辑器设置与 Markdown 片段由站点编辑器管理，`editor` 与 `snippets` 已移除。

## 初始化配置 {#init-profiles}

`init DIR [--profile project|docs|blog|book] [--languages en|en,zh|all]`
组合同一份内嵌 MIT 许可证 Starter 归档。默认 `project` 按字节保留此前完整语言投影。
语言选择独立于内容配置，`all` 表示英语、中文、法语。

显式 `docs`、`blog`、`book` 保留对应归档内容分区及共享首页、资源、示例、工作流与
许可证。原生分区 front matter 定义文档、博客或连续书籍模型与导航。各语言站名/
描述来自其归档分区，已有本地化首页卡片/动作/CTA 投影到该分区。只序列化这些配置
生成的 `hugo.yaml` 和 `data/home` YAML，保留内容与许可证字节不变。
没有四份复制 Starter 树，也不在运行时下载模板。

未知配置在候选验证或写入前拒绝，政策退出 `1`；必需 Hugo 缺失/验证失败为未完成
`2`。新建/空目标、先候选验证再发布、排他创建与并发编辑恢复保护适用于全部配置。
预备依赖后，普通 Hugo 可以构建生成站点。归档工作流仍为来源示例，`init` 不生成或
执行 R3 的校验和绑定 CI 模板。

## 有界升级比较 {#upgrade-comparison}

`upgrade --to TAG` 现根据同一原始站点输入捕获基线与候选视图，返回可读模块 diff
及完整模式变化。比较记录实际 Hugo 页面/输出/语言设置、生成文件哈希/大小/模式，
以及原始 alias 声明和单独观察的重定向文件。报告删除/新增 URL、已证明重定向、
alias 目标/字节变化及启用语言/输出/搜索变化。候选构建正常本身不能证明路由或能力
得到保留。

只有在确切旧输出文件处观察到指向对应实际候选页面的重定向，才能证明旧 URL 被保留。
未知/相对定制 alias 身份仍为必需未完成 `2`；删除此前生成路由或输出为阻断发现 `1`。
两个实际解析主题版本必须匹配明确选择的 pin；未知/替换 pin、未知/不同的规范 Hugo
版本或环境、意外其他输入变化均保持未完成。比较支持单个 HTTP(S) base origin/path，
多主机输入保持未完成。不宣称配置迁移转换或普遍浏览器/主题兼容，人工审阅保持
明确的可选未检查覆盖。观察到 alias 改指向另一个唯一 Hugo 页面时，独立于同页 URL
移动而阻断。

升级 v2 计划 ID 绑定选定模块计划、复制源码字节/完整模式/文件清单和规范实际比较。
`--expect-plan ID` 核对新的捕获/比较，不复用此前成功构建。生成文件哈希也绑定计划，
因此非确定性模板即使源码看似不变，也可能需要重新预览。预览返回前、每次写入前及
写入后重新核对保护条件，包括只读核对已证明的本地依赖/workspace 输入。只写选定
模块文件，回滚只恢复该操作拥有且未变化的文件，保留后续编辑器字节。已有脏目标、
replacement 与 vendor 保护继续生效。

## 文件保护与发布检查 {#preservation}

初始化内嵌完整 Starter 提交并保留许可证。来源清单记录其哈希和每项投影：选择已有
语言配置、确切的公开主题 pin 与校验和，以及为新目录关闭 Git 元数据。候选验证先于
目标写入。排他创建拒绝既有文件；回滚只移除本次操作创建且未发生变化的文件，并保留
并发用户编辑、给出恢复证据。

升级只处理单站点选定的 `go.mod` 与 `go.sum` 变更。它保留无关依赖与指令，
`--write` 拒绝有未提交修改的目标文件；传入审阅后的计划 ID 时核对该 ID，写入前
再次检查目标，并记录备份与恢复信息。无关的脏源文件不应阻止只读诊断，更不能成为
覆盖这些文件的理由。

`check --release` 关闭 `GOWORK` 与 `HUGO_MODULE_WORKSPACE`，并移除子进程的
环境 replacement。它保留 `go.mod` replacement，报告冲突的本地 OINK 替换政策，
并将 vendor 证据与公开 requirement 分开。升级拒绝 OINK replacement，也拒绝
`_vendor`；vendor 刷新保留为单独的显式流程。修改模块 pin 不会被描述为已更新
vendor 字节。实际选中 vendor 主题时，`--release` 将公开来源验证报告为必需但未完成（退出码 `2`）；仅版本元数据相同不足以证明 vendor 字节来自该公开标签。普通 `check` 仍可验证 vendor 的实际产物。

Hugo 配置中的模块 replacement 也仅在发布快照中禁用。如果 Hugo 在解析或构建时
修改了该快照的模块文件，CLI 会报告依赖输入需要显式预备和审查，保留原始字节，
而不会静默接受依赖未审查模块文件变更的构建。

## 已检查构建与产物身份 {#checked-artifacts}

`build --check --destination DIR --manifest FILE` 在隔离环境中严格构建生产视图。
Hugo 只渲染一次；检查引擎检查该产物，再封装并导出同一份字节。CLI 不调用第二个
渲染器生成发布目录，源码 checkout 保持不变。只有结果为 `0`，且必需覆盖已完成
或不适用时，才能封装产物。阻断项或未完成检查不会产生已验证导出。

这个生产视图不包含单独的不可发布维护渲染。显式翻译范围政策所需的 Hugo 身份
因源码被排除发布而未知时，返回 `2`。CLI 不根据文件名推断缺失翻译，也不静默
跳过范围。独立 `check` 与 `translations` 命令保留完整维护视图。

目标必须为新目录或空目录，且父目录已存在；本地清单必须是产物树之外的新文件。
导出通过独占创建保留准确字节和普通文件的完整模式，不受 umask 影响，并按清单
重新检查源树与目标树。既有条目、符号链接和重叠目录树会被拒绝。部分导出失败后，
目标仍是未验证证据并予以保留。空目录和目录模式不属于发布文件清单。

`--marker` 可选，默认关闭。它添加 `.well-known/oink-build.json`，只包含
`oink.build-marker/v1` 和产物 ID。计算产物 ID 时排除该文件条目以避免循环哈希，
再将其准确摘要纳入最终清单。既有标记路径会被拒绝。本地清单不会自动复制到公开
产物树。

单独保存的 `oink.artifact/v1` 清单记录源码输入哈希、已知源码 Git revision 与
dirty 状态、实际解析的主题身份、CLI/Hugo 版本、生效环境/base URL/发布设置、
必需覆盖、实际 Hugo 路由上下文，以及每个文件的相对路径、大小、完整模式和
SHA-256。规范 URL 和 HTML 语言来自实际 HTML；Hugo 语言键单独保留。
未知 Git 状态仍是未知。原始输入字节和模式在添加临时探针、重定位 workspace 或
replacement 路径之前捕获。公开清单不包含本机绝对路径、任意参数、进程日志或
覆盖条目的自由文本。哈希证明字节身份，不是签名，也不证明本地 checkout 已公开发布。

受管理构建仅接受 `--` 后的布尔 Hugo 参数 `--minify`、`--gc`、`--ignoreCache`
和 `--noTimes`，包括 `=true`/`=false` 形式。其他透传参数属于不支持的输入。
普通 `build` 保持既有透明透传行为。生效的示例/本地地址在普通诊断中是警告，
在已检查发布构建中是错误。`--release` 仍需独立的实际公开主题解析证据；本地
Git revision 或声明 pin 不能证明 vendor/replacement 字节的公开身份。

## 本地产物与部署验证 {#artifact-verification}

`artifacts verify --artifact DIR --manifest FILE` 只读且离线，比对准确文件集合、
字节、大小和完整模式。文件修改、缺失、新增、不安全或模式变化会使身份失效
（`1`）。无效清单、不可读输入以及不支持或中断的检查返回 `2`。上传器消费产物
之前应立即重新验证；后续编辑不能沿用先前的成功结果。

`verify --site URL --manifest FILE --network` 显式授权 HTTP 读取。它按清单限制
响应大小并比对解码后的字节摘要，检查每个声明文件和不同的实际 Hugo 路由 URL，包括全部语言与
子路径上下文。已记录的 HTML 规范 URL/语言值和启用的标记也会接受检查。
共享 URL/文件的请求可以合并，但保留其上下文。HTTP 无法验证本地文件模式位。

错误正文、soft-404、错误路由、已捕获规范 URL/语言值变化或错误标记是确定的
发现项（`1`）。超时、认证失败、限流、服务不可用或缺少必需标记属于未完成工作
（`2`）。跳转离开选定 origin/base path 时会被阻止；命令不发现或发送凭据。
静态构建检查不执行部署验证。构建联网权限不授权后续验证请求或上传。

## 已撤下 CI 生成 {#ci-generation}

移除 `ci init`。CI 配置保留在站点或 Starter 中。
本地 CLI 验证不执行托管 CI，也不部署站点。`plans apply` 拒绝旧 CI 计划。

## 显式工作区登记 {#workspace-registry}

> [!NOTE] R6 受支持本地范围已接受
> 登记与可选工具边界通过冻结归属/运行时、实际协议、四消费者一致性/保护及
> 规范源码/渲染门禁。A07 适配器与 A15 工作区受支持范围已在
> [维护记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6)中本地接受。
> 记录中的 R1–R8 与 A18 范围通过其历史源码与二进制的验收；当前 CLI 的后续修改需要新证据。

工作区是一份显式指定的 YAML 登记文件，独立版本为 `oink.workspace/v1`。
它只包含站点名称与目录：

```yaml
schema_version: oink.workspace/v1
sites:
  - name: docs
    directory: ../docs-site
  - name: blog
    directory: ../blog-site
```

登记文件必须是非符号链接的普通文件，只包含一份 YAML 文档和已知字段，登记
1–64 个站点，最多 256 KiB。名称符合 `[A-Za-z][A-Za-z0-9_-]{0,63}`，区分大小写。
目录是相对登记文件实际父目录的字面路径，或绝对路径；不展开变量、glob 或扫描同级
目录。显式目录符号链接与操作系统路径别名解析到规范身份。拒绝重名、实际根目录
重复或重叠、文件系统根目录、悬空符号链接，以及非目录祖先。若缺失目录有已证明的
现存祖先，仍可列出；检查该站点返回 `2`，不会阻止后续选定站点继续检查。

`workspace list|check [GROUP] --workspace FILE [--sites NAME,NAME]` 在省略
`--sites` 时选择全部登记站点。显式选择必须使用准确、非空、不重复的登记名称；即使
参数顺序不同，仍保留登记顺序。`list` 不需要 Hugo 渲染器。`check` 复用单站引擎、
各站自己的 Hugo 输入与 `oink.policy/v1` 政策，不在登记文件中复制 Hugo 配置。

现有 `oink.result/v1` 封套包含 `data.registry`、`selected_sites`、
`sites: [{name, path, result}]`、`completed_sites`、`finding_sites` 和
`incomplete_sites`。每个子项是完整单站结果。已完成站点包括退出 `0` 与 `1`；发现
问题的站点是退出 `1` 的子集。只要有选定站点未完成，汇总退出为 `2`；否则有阻断项
时为 `1`，其余为 `0`。人类可读输出包含逐站结果与发现项，不推断未选站点已完成。

受支持的单站命令接受 `--workspace FILE --site NAME`，必须显式选一个登记名称，
没有默认站点。`init`、`artifacts` 与 `verify` 不接受这种选择。
保存的 `plans apply FILE` 必须绑定选定规范目录；改选其他登记站点时，在写入前
返回 `2`。不自动批量应用计划或升级。既有候选验证及源码/依赖字节与模式保护条件
继续生效。列出或检查登记不会创建缺失站点、安装工具、提交或写入消费者配置。

## 可选检查适配器 {#optional-checkers}

各站 `oink.yaml` 中的显式 `tools` 项选择已预备的可执行程序。这些项扩展
`oink.policy/v1`，不是另一份 Hugo 配置，也不是安装器。每种工具包含 `enabled`
（默认 `true`）、`required`（默认 `false`）、`command`（默认与工具种类同名）、
`config`（提供时为站点内干净相对路径的普通文件）与 `timeout_seconds`
（默认 60 秒；非默认值限 1–300）。命令是单个可执行文件名称或绝对路径，不能是
shell 表达式。

| 种类 | 归属检查组 | 当前支持协议 | 配置边界 |
| --- | --- | --- | --- |
| `markdownlint` | `style` | markdownlint-cli `0.49.1` | 可选声明式 JSON/YAML/TOML；不支持 JS、JSONC、自定义规则或 `extends` |
| `vale` | `style` | Vale `3.24.0` | 显式 INI 与已捕获的受支持声明式风格子集 |
| `lychee` | `links` | lychee `0.24.2` | 可选有界请求设置；显式联网授权 |

未配置的工具不会自动发现。工具不属于选定检查组时，明确显示 `not_checked`。
已配置的可选工具若缺失、不受支持或无法完成，会保留遗漏；必需工作未完成返回
`2`，不能通过规则严重度、排除项或问题基线降级。不能同时设为必需和禁用。
已完成的类型化发现项仍按政策处理：阻断项返回 `1`。未知工具版本或无效协议输出
不能算作检查完成。

`data.adapters` 记录每种工具的必需属性、状态、类型化诊断、`adapter.KIND`
覆盖、原始进程证据、遗漏与来源。来源包含已观察的受支持版本、可执行文件 SHA-256、
捕获配置/风格路径及其 SHA-256 和完整模式，以及固定的公开协议源码。工具日志写入
stderr 和证据；JSON stdout 仍只有一份结果。每个进程的时间与输出受限；可执行文件、
捕获配置发生变化，或工具修改私有输入时，其证据失效。

文字工具接收已证明站点自有 Markdown 的私有遮蔽副本。Front matter、BOM/CRLF
与 UTF-8 偏移、代码、短代码、原始 HTML、已配置数学公式与属性保留其源码边界。
代码正文不参与源码归因；markdownlint 仍能读取 Markdown 结构和围栏/行内代码
边界，Vale 使用纯正文遮蔽。触及排除区域或遮蔽生成文本的发现项不会归因到原文。
只有已证明的原始行/范围才输出源码位置；不支持语法与被抑制发现项保留可见遗漏。
适配器不格式化或改写原文。

Markdownlint 通过不可预测的生成 JSON pointer，在上游 rc 合并之后隔离捕获的规则
对象。拒绝可执行配置、自定义规则加载器与递归 `extends`。Vale 使用显式捕获 INI、
`--no-global` 和复制的声明式风格；不支持 sync、packages、actions、scripts、转换
或风格流水线。Lychee 接受有界 `timeout`、`max_retries` 与 `max_concurrency`
设置，以及字面 `cache = false`；缓存保持关闭，拒绝 `cache = true`。拒绝预处理器
与任意命令选项。

默认离线。没有显式 `--network` 时，不调用 lychee，连版本探测也不运行：可选覆盖
为 `not_checked`，必需覆盖为未完成 `2`。它只接收实际 Hugo 输出观察到的外部
HTTP(S) 引用；本地链接仍归原生检查。确定失败的 `4xx` 响应属于政策发现项，但
`401`、`403`、`408`、`425` 与 `429` 除外；这些状态、`5xx`、DNS/TLS 失败和
超时属于不确定结果，必需时返回 `2`，可选时保留遗漏。不验证外部片段、浏览器行为
或远端内容身份。发现项保留渲染输出文件与 DOM pointer，不从外部 URL 臆造
Markdown 行号。

子进程不接收调用者的代理 URL/凭据设置或 Node 预加载变量。已验证运行时可以传入
字面的 `NO_PROXY`/`no_proxy` 主机列表数据。这不保证所有操作系统代理路由都被
禁用，也不是操作系统网络沙箱。工具预备与任何联网操作仍是独立显式动作；这些
命令不安装工具。

## 离线与兼容性边界 {#offline}

受管理子进程默认离线。依赖缺失属于未完成工作。`--network` 为当前操作显式启用
联网，不能与 `--offline` 同时使用。隔离检查可以从已准备的本地模块为临时缓存提供
依赖。在临时缓存下载，并不承诺下一次调用拥有持久缓存。

只有模块下载制品会用于预备缓存，隔离资源缓存从空目录开始。CLI 不复用全局
`GetRemote` 缓存来承诺远程资源构建可离线运行。必需资源应作为本地输入提供，或为
该次操作显式启用联网。

CLI 不下载 Go 工具链，不安装软件包，不修改全局配置，也不启用遥测。进程政策不是
操作系统网络沙箱。兼容验证记录应区分普通离线执行与确实在操作系统边界禁止出站的
测试。

兼容性依据已执行证据声明，不从交叉编译成功推导。本地候选已经实测 macOS arm64、
Hugo Extended 0.166.0 和公开 OINK v1.1.0；版本门禁接受 Hugo Extended 0.160.1
或更新版本，但不声称这些版本都已测试。初始化站点保留普通 Hugo 输入，移除 CLI 后
只需要站点文档要求的依赖。

## 已撤下本地 Studio {#studio}

CLI 移除 `studio`。使用普通编辑器与 `oink dev` 预览站点；通过 `inspect`
及结构化报告读取维护事实。带日期 R7 验收保留为对应输入的历史证据。

### 已撤下管理 API {#studio-api}

CLI 不再提供管理 API，旧 Studio API 验收不代表当前可执行程序。

### 历史捕获限制 {#studio-limits}

历史 R7 限制归属带日期验收记录；当前命令覆盖与输入范围以本契约为准。

## 已撤下通用编辑 {#editing}

移除 `edit` 与 Studio 编辑。使用普通编辑器修改源码，再运行 `check`。
`new`、`move`、审阅记录与基线计划继续保留候选验证和字节/模式保护。
旧编辑计划会被拒绝，带日期 R8 记录保留为历史证据。

### 已撤下文本和字段编辑 {#editing-text-fields}

CLI 不再承担通用文本或 front matter 编辑表单。

### 已撤下片段和附件编辑 {#editing-components-attachments}

使用站点编辑器编写 Markdown、添加附件。CLI 不再提供片段目录或通用附件编辑命令。

### 已撤下 Studio 编辑 {#editing-studio}

CLI 不提供编辑器，也不接受浏览器 Apply 请求。

## 验证与剩余范围 {#verification}

使用 `make test` 验证离线 Go 测试与 vet；使用 `make test-hugo` 验证真实 Hugo，
并为已配置可选工具运行 `make test-tools`。跳过集成不等于通过。
当前实现修改需要绑定新的源码与二进制证据；历史记录不自动赋予当前版本运行资格。

> [!WARNING] 当前集成门禁尚未通过
> 2026-10-04，在 macOS arm64、Go 1.27.1 与 Hugo Extended 0.166.0 上，
> `make test` 通过，`make test-hugo` 的
> `TestPublicR5CachedPublicModuleMovePreviewApplyAndOrdinaryHugo` 失败：
> 模块收集文本出现在配置 JSON 之前，移动操作返回 `2`，报错
> `Hugo config did not return JSON`。候选验证拒绝操作，诊断报告源码未改变。
> 随后的单用例重跑通过，但间歇失败原因尚未明确；单次重跑不构成当前候选的
> 完整集成门禁通过。

带日期[维护验收记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
保留旧 R1–R8 与 A18 证据。声明目标为 macOS arm64、Linux arm64/amd64，
Darwin amd64 是未取得资格的实验目标，Windows 不受支持。归档生成、签名、
分发、消费者采用与部署是不同状态。此契约不授权自动提交、推送、发布或部署。
