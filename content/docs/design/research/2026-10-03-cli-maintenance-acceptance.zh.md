---
title: 2026-10-03 CLI 维护验收
linkTitle: 2026-10-03 CLI 维护
description: R1–R8/A18 本地实施的带日期源码与二进制证据，保留初始审计、失败试验与最终受支持验收范围。
weight: 55
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] 历史源码与二进制证据
> 本记录保留此前 R1–R8/A18 验收，不随命令调整重写历史结果。2026-10-04 的
> CLI 精简与 Cobra/文本/JSON/YAML 界面以[当前契约](/zh/docs/design/decisions/cli/)和
> [指南](/zh/docs/start/cli/)为准；旧运行时资格不能自动证明修改后的二进制。


> [!IMPORTANT] 有限实现已本地验证
> 下文保留初始审计。R1 实现与归属检查已通过其本地范围，
> 包括刷新后的消费站报告和限定范围的中英文产物验收。R2 本地范围门禁也已接受，
> 数值相等比较补充单独测试。R3 运行与双语文档门禁通过，阶段已本地接受。
> R4 受支持实现与只读语料门禁已本地通过；受保护规范文档验证在下文单独记录。
> R5 修正实现/只读语料及受保护规范文档门禁通过，受支持范围已本地接受。
> R6 显式工作区与可选适配器通过冻结归属/运行时、精确二进制消费者及受保护
> 规范源码/渲染门禁；R6/A07/A15 受支持范围已本地接受。R7 只读 Studio/A16 也通过
> 浏览器、四消费者及受保护规范渲染门禁。R8 受审阅编辑/A17 通过修正冻结
> 归属/浏览器、精确二进制消费者及受保护规范源码/渲染门禁。R1–R8 受支持范围
> 已本地接受。2026-10-04 增补刷新变动后端，并完成三个声明目标的当前 A18
> 运行时/归档验收。规范生命周期晋升/渲染具有独立准确字节收据边界；没有公开发布、
> 采用或部署。

## 范围与证据规则 {#scope}

[维护路线图](/zh/docs/design/proposals/oink-cli-maintenance-roadmap/)
定义已授权的 R1–R8 范围，[当前 CLI 契约](/zh/docs/design/decisions/cli/)
定义兼容基线。[原路线图](/zh/docs/design/proposals/oink-cli-roadmap/)
不会把 Docsy 迁移、版本生命周期、OpenAPI、主题发布或条件性 E1–E4 扩展
加入本计划。Hugo 继续作为外部渲染器，生成站点仍是普通 Hugo 项目。

各阶段按依赖顺序验收。每阶段都需要完整可用的流程、归属测试、相关真实 Hugo
集成、已知限制、可审阅 diff，以及已验收的中英文契约和指南更新。
汇总命令通过不能自动关闭用例。新公开行为只有在实现和验收证据齐备后，
才从提案移入归属契约。

下表中的 **已有，未重跑** 表示已经检查代码或具名测试，但尚未确认本轮运行结果。
**部分已有** 表示首个候选提供了所需行为的一部分。**未完成** 表示缺少新实现或决定性验收证据。
后续记录 **通过**、**失败**、**未验证** 和 **不支持** 时，必须说明具体执行输入和范围。
历史结果不会改标为本轮通过。

## 已检查输入与工具 {#inputs}

2026-10-03 的初始审计读取了两个仓库的指令、文档站 README 和翻译规则、
维护 PRD 的中英文文件、原提案、当前 CLI 契约，以及已有 Go 包和测试名称。
本次只执行版本与 Git 检查命令，没有运行归属测试套件，也没有写入消费站源码。

| 输入 | 初始观察状态 |
| --- | --- |
| 主机与 Go | `darwin/arm64`；`go version go1.27.1 darwin/arm64` |
| Hugo | `hugo v0.166.0+extended+withdeploy darwin/arm64`；Homebrew 构建日期为 2026-09-09 |
| Node 与 npm | `v26.9.0`；`11.19.1`；属于贡献者/文档工具，不是 CLI 消费者要求 |
| Git | `2.54.0 (Apple Git-157)` |
| CLI 源码 | `e623d93d589c49e5c58b8fae1bd5db720fc904cb`，`main`；初始 tracked/untracked 状态干净；生成的 `bin/`、`dist/`、`tmp/` 已忽略 |
| 文档源码 | `907d873eb05cfc2e194f492462dfa94849e93474`，`main`；初始 porcelain 状态有 184 项，含已有提案、契约、指南及无关内容修改 |
| 内嵌 Starter | `137843b25bacd76ddd1f7ce71330bf2e3155b954`；`internal/starter` 已记录来源和许可证 |
| 声明的主题基线 | Starter 与三个选定站点声明 `github.com/pgsty/oink v1.1.0`；有效解析字节仍须在每次验收中确认 |

[2026-09-29 验收记录](/zh/docs/design/research/2026-09-29-cli-acceptance/)
包含首个候选的历史检查，可提供复现输入，但不能证明新的维护范围。
保留已有脏文件；此次初始研究记录不会验收或覆盖它们。

## 阶段需求与实现证据 {#stages}

| 阶段 | 所需完整流程与不变量 | 初始实现证据 | 仍需验收证据 |
| --- | --- | --- | --- |
| R1 | 由 Hugo 提供共享页面身份、语言、发布状态、来源、实际输出、翻译和观察到的引用；`oink.yaml` 只管理检查政策；链接/翻译/风格共享分析；严重程度和排除项不能隐藏必需未完成；位置可信 | 部分已有：`internal/site` 隔离快照与 `Page.OutputFormats` 探针、`internal/outputcheck`、`internal/report`；初始审计时尚无共享翻译/页面事实或政策命令 | 真实 Hugo 路由、别名、挂载、未列出/生成来源场景与语言关系；公共分类检查/政策用例；必需未知、工具、构建、输入失败仍为 `2`；仅在可靠时报告源码位置 |
| R2 | 三种语言组织；严格/手册和本地化政策；重复、缺失和草稿状态；显式版本化审阅记录绑定源语言及源/译文哈希；有语法边界的原生规则；有效主题覆盖；可见版本化基线；审阅修复先验证再窄范围应用 | 未完成：初始审计时无翻译/审阅/原生规则/基线公共命令；可复用产物引用检查 | A04–A07；经审阅的有效/无效内容语料；不用 mtime 推断审阅；处理禁用/本地化语言；已确认问题仍可见；必需检查缺失仍为未完成；修复保留文件 |
| R3 | 保留默认透明 build/dev；`build --check` 在一次严格 Hugo 输出上检查和生成 manifest，只导出到新建/空目标；摘要/来源 manifest 和可选最小公开身份；两种本地 CI 模板上传同一树；发布诊断；显式联网公网验证 | 部分已有：直接封装、严格隔离检查和有许可证的工作流输入；初始审计时缺少受管理构建/导出、摘要验证、CI 计划和公网 verify | A08–A10；恰好一次 Hugo 构建；拒绝字节漂移；revision/dirty/input/theme/tool/settings/coverage 来源不含秘密或本机路径；工作流定制/冲突/来源及不可变源码输入；示例地址政策；回退/语言/资源/canonical/超时/认证/限流 HTTP 夹具 |
| R4 | `new`、片段和编辑器配置创建普通输入且不覆盖；docs/blog/book/project 配置组合复用一个有许可证的 Starter；升级提供可读 diff 及新旧路由、别名、启用输出；不支持迁移给出人工操作；保留原有保护 | 部分已有：固定归档语言配置、绑定哈希的单站模块升级、候选验证、备份，以及脏文件/workspace/replacement/vendor 保护 | A11–A12；所有新增配置/语言组合可用普通 Hugo 构建；保留未知编辑器设置；升级路由/能力回归和可读 diff；保留来源与许可证 |
| R5 | `inspect`、`impact --since`、受限 `context`、默认预览 `move`；共享计划包含文件、diff、基线哈希、翻译、附件、输出/路由变化和别名建议；候选验证与过期/并发安全恢复；含糊引用要求审阅 | 部分已有：模块专用升级计划/应用基础；初始审计时无共享内容计划或 inspect/impact/context/move 流程 | A13–A15；删除 B 包含未改入站 A；翻译/附件/派生产物影响；不确定/全局变化强制全量检查；不执行内容；候选/过期/写入失败保护及含糊链接处理 |
| R6 | 显式版本化站点注册复用单站引擎；逐站与汇总完成状态；只写选定站点；已配置且预先供应的 markdownlint/Vale/lychee 适配器规范发现项并声明语法/网络覆盖 | 未完成：初始审计时无 workspace/adapter 公共命令 | A07/A15/A18；直接/逐站一致；无同级发现、隐式安装或默认格式化写入；必需工具缺失为 `2`，可选遗漏可见，外网不确定性明确区分 |
| R7 | 只读 loopback Studio，提供概览、问题、翻译比较、页面关系和发布视图；筛选、已知来源、真实 Hugo 预览、比较与复制操作；CLI 一致；预构建资源；显式 allowlist、独立预览 origin、Host/Origin/session 保护 | 未完成：初始审计时无 Studio 服务或资源 | A16；真实浏览器/键盘/读屏/移动端/深浅色/长列表流程；使用相同 CLI 结果；拒绝未授权 host/origin/session 和预览到管理接口请求；消费者运行不需要 Node |
| R8 | Markdown/文本和 front matter 表单、选定组件与不覆盖附件复用计划；授权允许范围内写入须有可见 diff、哈希和候选验证；无修改字节及未知字段/注释/顺序/编码/空白保留；表单不支持的语法保留文本模式 | 未完成：编辑在只读 R7 验收后实施；初始审计时无编辑 API | A17/A14；无修改字节一致、YAML 字段定点更新与文本回退；外部编辑器过期保存、路径穿越/符号链接逃逸及预览请求安全失败；附件不覆盖；静态发布无管理 API |

## R1 本地验证 {#r1}

R1 现已提供共享 Hugo 页面/翻译/来源事实、产物引用与锚点证据、严格
`oink.policy/v1` 输入、`check links`、`--format json`、可见的经审阅排除/外部范围，
以及必需工作优先级。翻译和风格选择明确报告必需但不支持的覆盖，并非已实现引擎。
默认 build/dev 继续直接调用 Hugo。下列证据接受所测共享事实/政策范围，
不关闭 R2–R8 或完整 A01–A18 用例。

| 需求 | 已执行证据 | 当前结果 |
| --- | --- | --- |
| 公共结果/政策与未完成优先级 | `make test`：所有包与 vet；公共严重度/排除/未实现分组/JSON 别名测试；`TestEveryRequiredUncompletedCoverageFails` | R1 范围通过；任何必需未完成状态（含 `not_checked`）仍为 `2` |
| 一次构建与共享事实 | `TestPublicCheckSharesOneBuildAndRenderedFacts` | 通过；一次严格 Hugo 构建提供页面和实际目标/锚点事实 |
| Hugo 权威与来源映射 | 真实 `TestPageFacts*` 夹具：translationKey、实际路由/别名、未知生成节点、自定义挂载、未发布页面分析及失败保护 | 通过；独立分析保留生产事实/产物字节及源码字节/模式 |
| 可复现真实 Hugo 验收 | 修正后的 `make test-hugo` 包含 `TestPageFacts*`、`TestHugoRendered*` 及 Starter/manifest 夹具 | 通过；覆盖范围内的路由/引用、经审阅外部范围和原始产物保留场景 |
| 新 Starter | 双语 `init`、`check links`，使用隔离且已供应的 v1.1.0 模块归档运行普通严格 Hugo | 退出码 `0`；223 个文件、4,461 个引用、66 个页面事实；依赖预备仍须显式进行 |
| R1 文档源码与 Schema | `content/docs` Markdown 风格；双语源码检查；CLI/文档结果 Schema JSON 解析及相同检查；限定 diff 空白检查 | 通过：88 个中文 docs、137/137 组源码、1,085 个标题；Schema 保持可增补的 `oink.result/v1` 和退出码 0/1/2 |
| 最终候选报告与中英文产物 | 刷新后的当前二进制消费站报告；下文真实产物源码/Markdown/链接归属检查 | R1 范围通过；生产环境中已有草案发布页缺失单独记录 |

较早离线 R1 试验在三个消费站上均返回 `0` 且无发现项：

| 较早试验 | 源文件 | 产物文件 | HTML 文件 | 引用 | 页面事实 | 字节/模式/Git 清单 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK 文档站 | 421 | 1,139 | 512 | 74,689 | 341 | 前后精确相同 |
| PIG 项目站 | 858 | 1,392 | 424 | 64,440 | 248 | 前后精确相同 |
| 软件仓库目录 | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | 前后精确相同 |

这些较早报告把可选未选中覆盖写为 `not_selected`，不属于已有结果 Schema 的枚举值。
最终代码已修正为 `not_checked` 并包含 `project.pages` 覆盖。
计数及精确清单仍是较早二进制的有效观察；下方最终刷新报告证明 JSON 合规。
原始证据保留在消费站源码外、带任务名称的本地验收目录。
这些试验不证明外链可访问性、部署、Linux 运行环境或翻译/风格验收。

最终 R1 二进制由基于 `e623d93d589c49e5c58b8fae1bd5db720fc904cb` 的 CLI
脏工作树重新构建。记录的输入清单包含文件哈希、模式和 Git 状态身份，
按排序后的 JSON 序列化计算 SHA-256 为
`518260f07f3c916468ee3d56c4eeca03c131514155aa82539564ccd2f3c1f664`。
实际运行二进制 SHA-256 为
`3deb7e357fc86f6907df60da0769d93f2d41ba5e01949b641548a67d7f459d12`。
它们标识本地输入和已执行二进制，不表示维护提交、公开归档或已发布模块。

| 最终当前二进制试验 | 源文件 | 产物文件 | HTML 文件 | 引用 | 页面事实 | 验收 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK 文档站 | 421 | 1,139 | 512 | 74,755 | 341 | 退出码 `0`、结果有效、页面事实完整、源码字节/模式/Git 精确保留 |
| PIG 项目站 | 858 | 1,392 | 424 | 64,440 | 248 | 退出码 `0`、结果有效、页面事实完整、源码字节/模式/Git 精确保留 |
| 软件仓库目录 | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | 退出码 `0`、结果有效、页面事实完整、源码字节/模式/Git 精确保留 |

最终结果均有必需的 `check.links: complete` 和 `project.pages: complete`。
未选中翻译/风格覆盖为可选的 `not_checked`。最终离线 `make test` 与 vet 通过，
修正后的真实 Hugo 归属目标也通过。记录的工具仍为 macOS arm64 上的 Go 1.27.1、
Hugo Extended 0.166.0、Git 2.54.0。编写本记录时独立比较了三个精确前后清单。

生产产物通过 Markdown 和链接检查。全站翻译检查返回 `1`，唯一原因是已有草稿
`content/blog/release/1.2.0.md` / `.zh.md` 正确地没有进入生产产物。
R1 修改页面均已双语渲染。另一个显式分析构建将 `HUGO_BUILDDRAFTS`、
`HUGO_BUILDFUTURE` 和 `HUGO_BUILDEXPIRED` 设为 `true`，三项归属检查均通过：
137/137 组源码、1,085 个标题、产物 Markdown 与产物链接。
该视图属于不可发布的排除源码证据，从未替代生产产物，也不修改或发布草稿。
没有为了让全站生产检查变绿而修改已有草稿文件。

## R2 本地验收 {#r2}

本地候选已实现翻译政策/状态/diff/哈希审阅、有界原生内容规则、可见的经审阅基线，
以及共享 `oink.plan/v1` 预览/验证/应用。默认 `check` 要求链接、翻译和风格。
生产输出与显式草稿/未来/过期分析相互独立，后者不可发布。稳定行为与示例见
[契约](/zh/docs/design/decisions/cli/#translations)与
[指南](/zh/docs/start/cli/#translations)。R2 本地门禁已通过归属检查、最终冻结输入
消费站报告及产物双语文档。下文分别记录确切实测二进制和后续有界相等比较修复，
不表示公开发布或消费站写入。

| 需求 | 已执行归属证据 | 结果与限制 |
| --- | --- | --- |
| A04 翻译关系/政策 | 真实 `TestHugoFilenameDirectoryAndTranslationKeyLayouts`；范围、重复/缺失/禁用语言、草稿、严格/本地化和选定约束测试 | 归属测试通过；不要求普遍标题/代码/本地化一致 |
| A05 显式审阅和 diff | 完整字节哈希/当前/源/译文/双方变化、不依赖 mtime、未知/不可读/含糊和错误记录；公共 status/diff/review 预览/应用 | 归属测试通过；审阅状态是变化证据，不是语义判断 |
| A06 源码边界和来源 | 真实 Hugo 规范 `title`/块属性开关和配置透传夹具；front matter/CRLF/BOM/短代码/代码/HTML；每个公开 v1.1.0 源码/许可证 SHA 验证 | 归属测试通过；不支持语法仍未完成，自定义钩子不在目录证明范围内 |
| A07 基线范围 | 捕获/可见确认/新问题/未完成优先级及错误记录；公共基线预览/应用 | R2 基线范围通过；外部工具适配器验收归 R6 |
| A14 共享元数据计划 | 过期字节/模式/存在/保护条件；验证中编辑；排他提交碰撞；部分恢复；后续字节/模式/删除；旧打开 inode 写入；新目录子文件；范围/身份/diff | 归属测试与 vet 通过；拒绝候选/源码重叠；move/引用歧义仍归 R5 |
| 冻结运行门禁 | macOS arm64 `make test`/vet、归属真实 Hugo、聚焦 race | 通过；日志 `/tmp/oink-r2-frozen-go-gate.log`、`/tmp/oink-r2-frozen-hugo-gate.log`、`/tmp/oink-r2-frozen-race-gate.log`；最终全部归属包 Hugo 门禁 `/tmp/oink-r2-owning-hugo-final.log` 明确包含配置透传 |
| 双语文档 | 限定源码风格/配对/ID、相等结果 Schema、范围内空白及真实生产/分析 node 检查 | 范围门禁通过：88 份中文文档、137/137 源码配对、1,092 标题；生产草稿缺失在下文单独记录 |

冻结解析器语料位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-source-corpus-lqx25kwr/summary.json`，
解析器输入 SHA-256 为
`a601200ec4fe275d2bd4baf11d4db7d46a2cc6f1674900c1fd801769e55d12de`。
每项范围均完整解析且无发现项。核心范围使用已记录配置下 Hugo 实际站点源码身份；
补充 Markdown 包含禁用/未发布文件，不虚构路由或关系。这些捕获早于已授权的 R2
文档修改。

| 语料 | Hugo 实际源码去重文件数 | 补充本地 Markdown | 源码清单文件数 | 字节/模式/Git |
| --- | ---: | ---: | ---: | --- |
| Starter | 52 | 78 | 97 | 精确前后相等 |
| OINK 文档站 | 272 | 274 | 421 | 精确前后相等 |
| PIG | 212 | 212 | 858 | 精确前后相等 |
| 软件仓库目录 | 1,568 | 1,572 | 2,294 | 精确前后相等 |

初步公共命令报告位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-final-qu_zprps/summary.json`，
使用二进制 `c8d87e6d73d3101fefcb62c5d6845518573c02c400f474dc9f4603afafc774d5`，
CLI 输入清单为 `d8a75be0e074365a4164b7aaaa27d82a1e844e04406a36c3dd6d39ff2b6e873f`。
这些报告早于最终解析器/文档冻结，不是最终验收证据。最初 Starter 命令错误选择了
外层证据目录并返回 `2`，属于验证环境选择错误。改选其实际 `site` 子目录后返回
`0`，证据位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-starter-27vmi0w5`。

| 初步检查 | 退出码 | 页面事实 | 构建文件 | 引用 | 翻译状态 | 结果 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 正确 Starter 子目录 | 0 | 66 | 223 | 4,461 | 28 | 完成；97 个源码文件/清单不变 |
| 文档站 | 0 | 341 | 1,139 | 74,755 | 144 | 完成；421 个源码文件/清单不变 |
| PIG | 0 | 248 | 1,392 | 64,440 | 120 | 完成；858 个源码文件/清单不变 |
| 软件仓库目录 | 1 | 1,572 | 3,287 | 851,535 | 788 | 已完成政策检查：既有合并打印输出中有 10,462 项实际 `HTML_ID_DUPLICATE`；2,294 个源码文件/清单不变 |

软件仓库目录的结果是已完成的发现项结果，不是站点通过或实现失败。
没有降级政策，也没有修改消费站源码。信息性审阅状态仍保持可见。
最终冻结输入报告位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-candidate-6xzcs7fk/summary.json`，
实测二进制 SHA-256 为
`ff88b407a6cddb9007f94275c65a80ed4c9c4fd13f5e821f9b7a4a8973abaa56`，
CLI 输入清单为 `bd8c71b55250a89dc15c7534924bb82a5447d6f2628eba23c8cb3d864309ee9f`。
独立比对确认四份源码字节/模式/Git 清单操作前后均精确相等，替代初步公共命令试验：

| 最终检查 | 退出码 | 源码文件 | 页面事实 | 构建文件 | 引用 | 翻译状态 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Starter | 0 | 97 | 66 | 223 | 4,461 | 28 |
| 文档站 | 0 | 421 | 341 | 1,139 | 74,825 | 144 |
| PIG | 0 | 858 | 248 | 1,392 | 64,440 | 120 |
| 软件仓库目录 | 1 | 2,294 | 1,572 | 3,287 | 851,535 | 788 |

最终报告均无未完成诊断。软件仓库目录保留 10,462 项实际合并打印
`HTML_ID_DUPLICATE` 和 788 项信息性审阅状态；其他站点保留信息性的未知审阅状态。
这接受实测检查行为和源码保护，并未将软件仓库目录称为通过的发布。

保留的生产文档位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-2201601475/public`，
产物 Markdown 和链接通过。全站翻译检查返回 `1`，仅因既有草稿 release `1.2.0`
双语页面未进入生产。另一个明确不可发布的草稿/未来/过期分析位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-3698773232/public`，
三项 node 检查均通过：137 配对/1,092 标题、216 内容页面/41,586 文本节点，
347 页面/48,682 内链/4,171 片段。证据日志为
`/tmp/oink-r2-docs-production-{translations,markdown,links}.log` 和
`/tmp/oink-r2-docs-analysis-{translations,markdown,links}.log`。
分析输出或创作草稿均未替代生产，也未发布。

最终审阅发现可选 `equal_fields` 仍按表示形式比较 JSON `7.0` 和 YAML/TOML
数值 `7`。有界补充现将已解码数值递归规范为精确有理数标签，保留字符串与数值、
映射键及数组顺序的区别。测试覆盖小数/指数、负零、超出 float64 精度的整数、
嵌套差异、源码字节保护，以及不可表示值导致必需未完成。
真实 Hugo 翻译测试在 `/tmp/oink-r2-numeric-translations-gate.log` 中通过，
全部公共维护真实 Hugo 用例在 `/tmp/oink-r2-numeric-public-gate.log` 中通过，
归属 vet 和空白检查通过。补充源码 SHA-256 为：

| 源码 | SHA-256 |
| --- | --- |
| `internal/translations/check.go` | `24664377e14b4ae2fc554d0d7fde2ec33cc987707250e130fd88d9a25d5e1637` |
| `internal/translations/translations_test.go` | `f58f4a305fe9fe3f5500ddfcf85faf3cfa37d72f8c220a1cb16ce4ccfbddb74d` |

冻结真实站点报告及上下文 Linux 验收早于该补充。对应站点没有配置数值相等约束，
记录的输出不受影响，因此没有为这项有界修复重跑。后续完整运行与归档验收必须
刷新后续源码。本次证据修订属于验收运行后已授权文档写入，前后源码保护范围结束
于修订之前。

A18 仍未完成。macOS arm64 已实测；本机尝试 Darwin amd64 运行时，
`arch -x86_64` 返回 `posix_spawn: Bad CPU type in executable`
（`/tmp/oink-r2-darwin-amd64-gate.log`）。这是主机运行支持不可用，不是代码失败，
也不是 Darwin amd64 验收通过，未安装系统组件。原生 Linux arm64 和 Docker
Desktop Rosetta 模拟的 Linux amd64 均实际执行，同一运行/Schema/许可证输入
SHA-256 为 `0f786df68ef3c4844c983a51595f79242d1cb1d2bf6c5b5eb7f2c6415fb8d861`。
证据保留在
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-a18-linux-ajbbnvki`
的 `arm64-results`、`amd64-results`、`commands.json`、`candidate-inputs.json`、
`preparation.json` 和 `qualify.sh`。每个目标均通过 270 个测试/子测试，无失败，
仅跳过两项可选外部语料/来源验证：完整真实 Hugo `go test ./...`、vet、构建 CLI
版本/双语 init/doctor/完整 check/翻译 status，以及缺失 Hugo 退出 `2` smoke。
JSON stdout 和源码字节/模式清单均核对。Go 1.27.1 运行在 Linux arm64，
Hugo Extended 0.166.0 各架构资源已核对 SHA。这证明对应源码运行路径，
不证明最终归档或托管 CI。Darwin amd64 仍未完成，交叉编译不能关闭它。
后续阶段及未来命令/适配器/浏览器验收仍未完成。

## R3 本地验证 {#r3}

R3 新增受管理 `build --check`、`oink.artifact/v1` 封存/导出/本地验证、
显式联网 HTTP 验证、发布诊断和受保护的本地 CI 生成。默认 build/dev 保持普通 Hugo。
已执行运行和中英文契约/指南门禁通过，R3 已本地接受；未运行托管 CI 或部署。

| 需求 | 已执行归属证据 | 结果与限制 |
| --- | --- | --- |
| A08 单份检查产物 | 公共模拟/真实 Hugo 单渲染器测试；精确导出、manifest/标记、检查后字节/模式/缺失/新增/符号链接篡改、失败/并发及源码保护测试 | 本地范围通过；失败/未完成检查不能封存或导出；本地产物验证不重建 |
| A09 两种 CI 服务商 | 离线确定性生成、固定源码/Hugo 归档和 action revision；安全 bootstrap 归档；受保护公共预览/应用/过期输入；真实 Hugo 原始输入绑定 | 本地配置范围通过；拒绝所有已存在生成目标，定制工作流不变 |
| A09 上传身份 | 两种本地服务商演练及 `TestProviderUploadRehearsalPreservesActualSealedManifestIdentity` | 通过：一次受管理构建、单独验证、再使用同一树；GitHub tar 包含隐藏标记，Cloudflare 演练接收已验证目录；未执行服务商上传 |
| A09 定制工作流诊断 | 已生成加其他定制、无元数据定制公共测试，真实 Hugo 预览与归属 vet | 补充通过，日志为 `/tmp/oink-r3-ci-custom-owning-gate.log` 和 `/tmp/oink-r3-ci-custom-vet-gate.log`；未被元数据表示的工作流保持 `unknown`、信息级及可选 `release.ci: not_checked`，有效生成元数据旁也可见 |
| A10 部署身份 | 本地 HTTP 全部记录文件/路由/语言、标记、canonical/base/惰性 template、HTTP 200 回退、错误字节/语言/构建、缺失资源/Markdown/搜索 JSON 夹具 | 本地夹具范围通过；确定差异为 `1`，浏览器 JavaScript 明确未检查 |
| A10 网络未知状态 | 显式联网/凭据拒绝、响应头前/响应体中超时、认证/限流/服务错误、必需标记缺失、有界响应/gzip、重定向/无 cookie 夹具 | 本地夹具范围通过；未完成为 `2`，剩余请求为未知；未访问公开部署 |
| 冻结运行门禁 | 完整测试/vet、归属真实 Hugo 和聚焦 race | macOS arm64 通过，日志为 `/tmp/oink-r3-frozen-go-gate.log`、`/tmp/oink-r3-frozen-hugo-gate.log`、`/tmp/oink-r3-frozen-race-gate.log`；后续定制 CI 修改由上述聚焦补充覆盖 |

最新单二进制语料位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-ci-final-ahc4csjk/summary.json`。
从精确捕获的 CLI 输入副本编译，二进制 SHA-256 为
`425845c1d2db7b1cd3c3cdb5f28475cb06ba6f656054909759e2359a39925dd2`，
67 个运行/Schema/许可证输入 SHA-256 为
`6789a3a0235ff8d81453b9bfde37824979eac7d56af3710da390e4d2ef8479dc`，
108 个更广 CLI 输入 SHA-256 为
`4ca473a4cb586d232baeb4cee029b281469c5bb03c831cc199b95451e6832c60`。
全部运行后运行输入仍精确相等。实时工具为 Darwin arm64 上 Go 1.27.1 和
Hugo Extended 0.166.0；manifest 的规范 Hugo 版本排除发行方构建文本与私有路径。

每次离线 `build --check` 使用消费站外的新导出/manifest 路径、可选标记和保留隔离
目录。已有本地消费站未使用 `--release`，保留其配置的 workspace。每份原始报告
均恰好一次严格 Hugo 渲染、零未完成诊断、零必需未完成覆盖。

| 最终受管理构建 | 退出码 | 源码文件 | 复制源码输入 | 页面事实 | 构建文件 | 引用 | 导出文件 | 本地产物验证 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Starter | 0 | 97 | 94 | 66 | 223 | 4,461 | 224 | 0 |
| 文档站 | 0 | 421 | 427 | 341 | 1,139 | 74,825 | 1,140 | 0 |
| PIG | 0 | 858 | 861 | 248 | 1,392 | 64,440 | 1,393 | 0 |
| 软件仓库目录 | 1 | 2,294 | 2,299 | 1,572 | 3,287 | 851,535 | 无 | 未导出 |

两份清单均精确比较操作前后字节、模式与文件类型，主清单还比较逻辑 Git 状态。
Git 站点包括 tracked 和未被忽略的 untracked 源码；无 Git Starter 包括既有生成
文件与锁。补充复制源码清单还包括快照读取的被忽略 workspace/编辑器元数据，
排除已有生成输出/缓存树。文件数不是证明，四份对比均精确相等。

软件仓库目录保留 10,462 项既有合并打印 `HTML_ID_DUPLICATE`，未创建导出或 manifest。
这是完整政策发现，不是通过的发布，也不是实现失败。生产审阅状态为 28/143/120/786；
分析包括未发布页，解释此前 R2 的 144/788。既有定制工作流信息仍可见，
Starter 示例地址在此次非发布运行为警告。

三份新导出在全部原始文件 SHA-256、大小与模式上匹配保留的独立普通 Hugo 产物。
唯一新增文件为 `.well-known/oink-build.json`。原始源码清单与完整 manifest 输入哈希
均匹配此前捕获，复用普通产物未替换输入。辅助源码 SHA-256 为
`13e4957a3d7847eb28c8b1eeba3588a4f4a9982c2bfca2ebc729ab2827159607`，
二进制 SHA-256 为
`b2699fe7a7aa3a34c41f9e4aba4b22d39cf8d0c156a369f3dfc4ca8c8c0fbce5`。
原始辅助与普通产物证据位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-candidate-wb643dhh`；
编译辅助程序后删除临时构建源码。

此前 R3 捕获保留为历史：首次捕获早于运行冻结，首份冻结捕获
`oink-r3-final-pisrr21h` 早于定制 CI 诊断。最初选择 `/Users/vonng/pgsty/PIG`
返回 `2`，因为不同仓库不是目标站；改用 `pig.pgsty.com` 后通过。
保留这些环境选择试验，不改标为候选失败；最新语料替代此前受管理构建结果。
CI 模板/bootstrap 根据已记录服务商第一方契约独立编写，未纳入服务商实现源码。

限定 R3 文档门禁通过，证据为
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-docs-render-pljj5aqd/summary.json`。
十份成对契约/指南/路线图/索引/概览修改只有匹配原始字节/模式后才安装，哈希位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-doc-drafts-s0b3g48l/applied-files.json`。
源码风格通过 88 个中文文档，翻译通过 137 配对/1,099 标题，Schema 保持相等且限定
空白检查通过。真实生产 Markdown 通过 214 页面/41,871 文本节点，链接通过
345 页面/48,344 内链/4,171 片段。生产翻译仅因未修改的草稿 release `1.2.0`
未进入生产返回 `1`。另一个明确不可发布的草稿/未来/过期分析通过 Hugo 及三项
归属检查：137 配对/1,099 标题、216 页面/42,177 文本节点、347 页面/48,720 内链/
4,199 片段。产物检查期间 421 个规范源码和 488 个复制源码文件均保持精确字节/模式。
分析没有发布或替代生产，本次验收修订发生于该冻结保护边界之后。

该门禁不宣称托管工作流执行、上传、公开发布、最低版本组合、浏览器行为或本轮
Linux/Darwin amd64 验收。A18 仍未完成，历史 Linux R2 结果保留原始源码哈希。
已授权双语证据/契约/指南写入发生于保护清单之后，不属于其无写入范围。

## R4 创作与升级验收 {#r4}

受支持 R4 实现与只读语料范围在冻结归属/全量门禁后已本地接受。本记录覆盖配置、
普通创作/编辑器/片段和有界升级视图。受保护规范文档推广与新产物限定验证也已通过，
详见下文；R5–R8 和最终 A18 验证保持未完成。

| 已执行配置证据 | 结果与限制 |
| --- | --- |
| 同一固定许可证归档 | 针对提交 `137843b25bacd76ddd1f7ce71330bf2e3155b954` 的快照核对未使用 `--write` 且通过；归档 SHA `e55bde279715f6d8d19d3d88671a2cf7561b515be46915b0f12c640d0ce1d958` 和 MIT 许可证不变，投影元数据/脚本匹配 |
| 组合与保护 | 默认/显式 project 字节一致，选定归档模型/本地化首页、无效配置、非空目标、并发验证/发布和取消恢复测试通过；单元/vet/race 门禁通过 |
| 普通 Hugo | 四种配置 × 三种语言 × 根/子路径，共 24 次真实严格离线构建通过，使用预备的公开 OINK v1.1.0；完整源码字节/模式/无额外文件及产物引用检查通过 |
| 公共 init 流程 | 四种配置 en/en,zh、后续根/子路径实际 Hugo URL 事实/检查、工作流/许可证保护与默认一致通过；未知/非空拒绝 `1`，Hugo 缺失/失败 `2`，空/不存在目标及纯 JSON/独立日志已验证 |
| 公共创作与来源身份 | 实际候选/应用/普通 Hugo、未知审阅与源码保护通过，见 `/tmp/oink-r4-authoring-public-gate.log`；新目录/站点保护与 vet 通过，见 `/tmp/oink-r4-new-input-race.log`、`/tmp/oink-r4-public-core-vet.log`。实际被忽略输入即使源码检查组关闭也拒绝 `2`，不保存计划、不写源码；选定译文草稿仍强制分析来源身份，见 `/tmp/oink-r4-authoring-sourceproof-gate.log`。受支持归属范围通过 |
| 有界升级归属门禁 | 七个真实 Hugo 固定合成模块用例、观察流摘要/产物清单一致、独立跨页面 alias 改指向阻断，以及源码/并发/排他写入和保留后续编辑的回滚保护通过 race；vet 通过。最终加固日志 `/tmp/oink-r4-hardening-owning-gate.log`、`/tmp/oink-r4-hardening-final-focused.log`、`/tmp/oink-r4-hardening-vet.log`；最终公共/全量冻结门禁通过 |
| 创作/编辑器集成加固 | 实际 Hugo 语言目录计划/应用/普通构建、link/never 新来源拒绝、外部 Schema/许可证/完整模式/模块身份及旧 Schema 重新证明、共享翻译/基线/CI 回归，以及完整 Starter docs→新译文草稿→编辑器→检查→普通 Hugo 流程通过。`/tmp/oink-r4-app-authoring-hardening-gate.log`（58.241s），聚焦 race/vet 通过；候选后外部修改证明 `/tmp/oink-r4-app-external-during-validation.log` 通过。不透明保存输入哈希与规范 workspace 来源保护见 `/tmp/oink-r4-external-plan-binding-final.log`、`/tmp/oink-r4-workspace-origin-gate.log` 及其 vet 日志。冻结全阶段、语料和限定规范产物文档门禁通过 |
| 实际语言挂载 | 独立的逐语言 contentDir 和显式站点矩阵夹具均通过 config/mounts/严格构建，源码字节/模式不变。Hugo0.166 输出 `sites.matrix.languages`，不同物理文件具有互为译文的公共关系。`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-language-mounts-lgmve1sk/summary.json`；公共实际语言目录计划/应用/普通 Hugo 集成通过 |

归属证据保留于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-starter-owning-0pv41lw5/summary.json`。
日志为 `/tmp/oink-r4-starter-{unit,hugo,vet,snapshot,race}-gate.log`、
`/tmp/oink-r4-public-init-gate.log` 与 `/tmp/oink-r4-public-init-vet-gate.log`。
生成源码数量为 project 94、docs 58、blog 40、book 34。未编辑 Starter checkout，
未公开发布、消费站采用或部署。


最终冻结门禁均为 `0`：`make test`/vet 见 `/tmp/oink-r4-frozen-go-gate.log`，
`make test-hugo` 见 `/tmp/oink-r4-frozen-hugo-gate.log`，真实 Hugo 核心 race 见
`/tmp/oink-r4-frozen-core-race-gate.log`。最终公共流程覆盖 Starter docs → 主页面/
译文草稿 → 编辑器 → 检查 → 普通 Hugo；候选验证后的外部 Schema 修改仍在写源码前
拒绝。17 份归属与三份最终门禁日志及哈希原样保留在最终语料 `owning-gates.json`。

准确四站证据为
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-corpus-lw2cjyq6/summary.json`，
另有有界 `summary.compact.json`、原始 JSON/日志和逐命令清单。二进制 SHA 为
`c169b3d4d046c811dca80867068b86fb66ada5c8ce6910dd5cda7353c406f377`；82 份运行时输入
SHA 为 `fdff7f50d49b44f03fa1db79eec6b6c9b9bd5e52f8967a88aed84b3207a7b3c6`，
与最后根清单完全相等，无运行时修改。139 份完整 CLI 输入 SHA 为
`562e838d9eccb628eac86ae59b9b9587c1e23ad52991ec50eafb1e604e3924da`。
驱动 SHA 为 `d3ac41dc2e18295bfb26134d1a696935c8174913e2801a5766dbf7a1139d89f8`。
实际工具为 macOS arm64 上的 Go 1.27.1 与 Hugo 0.166.0 Extended。

| 冻结消费站 | 主/复制源码文件 | 页面；输出文件；引用 | 受管理构建 / 产物验证 | 只读 upgrade / new / editor |
| --- | --- | --- | --- | --- |
| Starter | 97 / 94 | 66；223；4,461 | `0` / `0`；含 marker 导出 224 份 | `0` / `0` / `0` |
| 文档站 | 421 / 427 | 341；1,139；74,937 | `0` / `0`；含 marker 导出 1,140 份 | `0` / `0` / `0` |
| PIG | 858 / 861 | 248；1,392；64,440 | `0` / `0`；含 marker 导出 1,393 份 | `0` / `0` / `0` |
| Repository | 2,294 / 2,299 | 1,572；3,287；851,535 | 已完成发现 `1`；无导出/manifest | 已完成发现 `1`；阻断后未尝试 new/editor |

每次受管理构建恰好使用一次严格生产 Hugo 渲染，没有必需未完成或未完成的必需覆盖。
Git 可见主源码字节/完整模式/逻辑 Git 状态、补充复制输入以及源码目录模式在每条命令
和完整站点流程前后均精确相等。Repo 既有 `merged_print` 中 `10,462` 处重复 HTML ID
保持可见；其已完成发现既不是通过产物，也不是实现失败。未调整政策或消费站输入。

消费站升级预览选择已有公开 v1.1.0 pin，不应用写入；跨版本路由/alias/输出回归采用
明确合成夹具 pin，不虚构已发布主题版本。New/editor 计划为已验证预览，未在消费站
保存或应用计划。多主机及未知相对 alias 身份保持未完成。非确定性产物可能需要重新
预览 v2 计划；浏览器/普遍兼容、配置迁移及当前跨平台/归档验证不在此限定结果内。
此前 Linux R2 输入哈希仍属历史证据；Darwin amd64 与最终 A18 刷新仍未验证。
获授权的中英文规范写入只在这份冻结无写入证据边界之后发生。

父任务应用十份受保护文件后，新的规范文档验收通过。证据为
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-docs-render-v01eima0/summary.json`；
推广清单为
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-doc-drafts-3i8bw994/applied-files.json`。
冻结 `c169b3…` CLI 执行一次严格生产构建，定点链接检查返回 `0`。

| 新规范文档门禁 | 已执行结果 |
| --- | --- |
| 源码归属检查 | 翻译 `0`：137/137 对、1,104 标题；完整规范样式 `0`：137 份中文文件、181 处加粗、无强调；十文件空白检查与公共 JSON Schema 一致检查通过 |
| 生产 Markdown/链接产物 | 均为 `0`：214 个内容页面 / 42,214 个文本节点；345 个页面 / 48,360 个内部链接 / 4,187 个片段 |
| 生产翻译 | `1` 仅因既有草稿 `content/blog/release/1.2.0.md` 不在生产产物中；无新增配对/标题问题 |
| 单独不可发布分析 | 新普通 Hugo 使用实际原快照环境/重定位路径及显式草稿、未来、过期选项，返回 `0`；三个归属检查均 `0`：Markdown 216 页 / 42,520 节点，链接 347 页 / 48,736 链接 / 4,215 片段，翻译 137/137 对 / 1,104 标题 |
| 源码保护 | 规范 Git 清单 421 份文件和复制输入 427 份的字节、模式、Git 状态与目录模式完全不变；生产复制 428 份、分析复制 427 份文件在检查中不变；分析构建也保留复制文件完整模式 |

生产产物保持独立，未被分析树替换；分析不可发布。临时辅助程序复制冻结核心而不
修改它：辅助源码 SHA
`7faea7e726a6c6fb2e0747be1a4428f4c5fb5734fa52b6f981157a5fe37d9989`，
辅助二进制 SHA
`532638e76f96f8b173c122e512b3bf5fc2c4d4a7130f59c99c2c69e135e87073`，
与原始日志一并保留。获授权的双语研究补录发生于精确无写入捕获边界之后，另行接受
定点源码检查。R4 本地限定文档门禁已接受；该结果不宣称公开发布、部署、R5–R8
完成或最终 A18 验证。

## R5 实现与文档验收 {#r5}

R5 受支持范围在聚焦公开命令/核心、修正冻结全阶段、精确二进制只读消费者及
受保护规范源码/渲染文档门禁后已本地接受。有界结果保持明确，见下文。R6–R8、
workspace A15 与最终 A18 验收保持未完成。首次晋升与单独授权的渲染后状态/证据
修订保留不同的保护边界。

实际公开 Git/Hugo 流程在 `/tmp/oink-r5-public-final-flow.log` 以 53.963 秒通过。
已提交的合成站点拥有本地主题、双语页面及二进制附件；普通 `0640`、`0600` 保持为
完整当前事实，历史 Git 比较仅使用可执行位。删除乙后纳入未改入站甲、剩余翻译、
删除的附件与实际 RSS 输出。实际 alias 入站归属不确定性、全局配置/模板/数据及
未知输入变更扩大为全范围。

完成的 inspect/impact/context 返回 `0`，单独展示当前检查发现 `1`；check-since
保留当前质量 `1` 与完整验证范围。缺失、未提交或外部历史返回 `2`，保留全部已知
当前页面、附件、引用、输出，不虚构旧身份或变更。已测试无效选择器/限额、缺失工具
及失败渲染器日志。有界上下文提供理由、版本、源码及摘要哈希、可见遗漏/截断，不
执行文档字面指令。

保存移动预览/应用及随后普通 Hugo 已通过，保留二进制字节、原始完整模式、无关
文件与 Git index/revision。实际不透明 HTML/shortcode 引用保持人工动作；inline、
fence 与不透明片段保持不变。它们的最终断链候选返回 `1`，无保存计划或源文件
写入。源码、配置、附件、模式或新目标漂移返回 `2`，保留后续编辑。实际候选渲染器
之后的确定性变更同样在写前拒绝，保留编辑者字节/模式。聚焦实际移动 race 在
`/tmp/oink-r5-public-move-race.log` 以 8.286 秒通过；app vet 在
`/tmp/oink-r5-public-vet.log` 通过。

缓存模块补充之前，冻结父级 `make test`/vet 与 `make test-hugo` 分别在
`/tmp/oink-r5-frozen-go-gate.log`、`/tmp/oink-r5-frozen-hugo-gate.log` 通过
（实际 app 夹具 185.709 秒）。实际移动/源码 race 与 vet 在
`/tmp/oink-r5-move-hugo-gate.log`、`/tmp/oink-r5-source-move-race-gate.log`
及其 vet 日志通过；完整清单/模式/选择器计划保护在
`/tmp/oink-r5-plan-owning-final.log` 通过。

首轮冻结消费者试验发现实际缓存公开模块保护缺口：原始关系图含已解析模块输入，
新的外层候选哈希却未纳入它们，产生错误未完成 `2`，没有源码写入。内容计划现先
解析/捕获同一模块输入再比较，并保留旧元数据/创作计划范围。独立的校验和验证公开
OINK v1.1.0 回归在 `/tmp/oink-r5-public-cached-module-move.log` 以 27.42 秒
（package 28.220）通过预览、重新验证已保存应用与普通双语 Hugo，保留原始模式、
二进制字节、无关输入与 Git。修正当前二进制语料及补充 race 证据与旧未接受试验
分别记录。

修正当前候选的完整 `make test`/vet 在
`/tmp/oink-r5-corrected-frozen-go-gate.log` 通过；实际 `make test-hugo` 在
`/tmp/oink-r5-corrected-frozen-hugo-gate.log` 通过（app 278.787 秒）。缓存公开/
已提交站点内部移动保护 race 在 `/tmp/oink-r5-public-cached-seam-race.log` 以
38.578 秒通过，app vet 也通过。

`/tmp/oink-r5-corrected-runtime-freeze.json` 记录 96 个运行输入，SHA-256 为
`e5b6e0eda972116dbb94a8086668e6ef34bfaa56138cf31f1f71f4832c477842`；
165 个较广 CLI 输入的 SHA-256 为
`4965a0c92cb6126f67a6dabd548c7c25ee5d7c9c57e14cce5e55ebb7a22fca2d`。
修正二进制 SHA-256 为
`d7675aecca2f77b1eb37bb4f664c3314cf5207149e6abbb86523686c5c50bff0`。
这些是本地工作输入/可执行文件身份，不是新 commit 或发布归档。修正四消费者捕获
在 831.825 秒内完成 16 个命令，证据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-corpus-corrected-y2eue81h`。
有界 `final-receipt.json` 的 SHA-256 为
`b86e0e6c7dbfbaed62c845c03a55d963068f7d9a16771de5ff3b0974e76fce3b`；
记录保留 12 份归属门禁日志、全部 20 条实际移动路由，以及完整原始 JSON/日志和
各移动分类文件的位置。

| 站点 | 主源码/复制输入/目录 | Inspect/context | 当前检查 | Impact | 移动预览 |
| --- | --- | --- | --- | --- | --- |
| Starter | 97/94/21 | `0`/`0` | `0` | `2`：无 Git 基线 | `0`：已验证，未应用 |
| 文档站 | 421/427/109 | `0`/`0` | `0` | `0`：完整历史比较 | `1`：六条候选缺失引用 |
| PIG | 858/861/52 | `0`/`0` | `0` | `2`：历史外部输入来源未完成 | `1`：32 条候选缺失引用 |
| 仓库站 | 2294/2299/48 | `0`/`0` | `1`：已有 10,462 个重复 HTML ID | `2`：未提交 HEAD 基线不可用 | `1`：同一批已有重复 ID |

Starter 与仓库站 impact 保留已知当前事实，不虚构旧页面或变更。PIG 实际基线
完整（主题 v1.0.0 对当前 v1.1.0），但必需外部输入来源未完成，因此比较扩大为
全范围并返回 `2`。这些结果分别记录。文档站 impact 完成，包含 192 个捕获输入
变更、343 个受影响旧/当前页面并采用全范围。已完成事实查询独立展示当前质量发现；
仓库站 inspect/context 仍为 `0`。

文档站移动证明 18 处重写及四条路由。`content/docs/customize/repository.md`
第 216、313 行两个普通字面 `/docs/admin/comments/` 目标保持人工动作，因为
普通/打印输出的重复源码/输出出现位置无法精确归属。六条候选缺失引用阻止验证。
PIG 移动两个 Markdown 文件及四个二进制附件，证明八条页面/处理后资源路由。
配对且字节相同的输出证明处理后 `featured_hu_*` 资源，但未证明四个原始绝对图片
引用 `/article/pgext-day/{featured,topic,venue,schedule}.webp` 的新 URL。
32 条候选缺失引用阻止验证，不猜测重写原始资源 URL。这些普通 Markdown 边界
与不透明 HTML/shortcode 边界分别记录。

仓库站移动证明十处重写及四条路由；候选只有同一批已有 10,462 个重复 ID 发现，
没有新缺失引用或必需未完成发现。Starter 无入链的双语移动已验证。四次移动均未
应用，未保存消费者计划或写入消费者源码。失败候选为 `validated: false`。
全部 JSON stdout 纯净；主源码、复制输入、完整模式、目录清单及逻辑 Git/index
状态保持不变，包含忽略的复制输入。Git 元数据清单不包含不可变对象存储。
运行与较广 CLI 清单仍匹配捕获身份。本记录不验证其他平台、浏览器运行或部署。

首次十文件受保护规范晋升使用上述修正冻结二进制/运行哈希，在 62.37 秒内
完成验证。独立渲染记录为
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-docs-render-ks2tw82c/summary.json`，
SHA-256 为 `06ae844a4b3f1c01bb5faa8a21091d5461c28aab592d12c4310fb34bc176c5d4`。

| 规范文档门禁 | 已执行结果 |
| --- | --- |
| 源码归属检查 | 翻译 `0`：137/137 对、1,109 标题；样式 `0`：137 份中文文件、181 处加粗、无强调；限定空白与公共 JSON Schema 一致检查通过 |
| 冻结 CLI | 使用精确修正二进制的生产 `check links` 返回 `0` |
| 新普通生产 Hugo | 构建 `0`；Markdown `0`：214 页面/42,571 节点；链接 `0`：345 页面/48,376 链接/4,203 片段 |
| 生产翻译归属检查 | `1` 仅为普通生产输出中已有 draft release-1.2 缺失；无新 R5 差异 |
| 独立普通分析 Hugo | 新的不可发布 `-DFE` 构建 `0`，不使用 CLI probe；Markdown `0`：216 页面/42,877 节点；链接 `0`：347 页面/48,752 链接/4,231 片段；翻译 `0`：137 对/1,109 标题 |
| 输入保护 | 全部逐命令及总体保护条件通过：421 主源码、427 复制输入、109 目录、36 可变 Git 文件保留字节/完整模式/逻辑 Git 状态；两个隔离源码副本均不变 |

分析树没有替换生产输出，也不可发布。首次晋升的永久 `applied-files.json` 位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-doc-drafts-t3_klnck`，
保留十个授权文件及其原始模式。这次单独授权的渲染后修订仅触及成对提案/索引/研究
六个文件，发生在已记录无写入边界之后；已验证契约与指南字节保持冻结。受保护原文、
准备 diff 与定点源码检查单独保留。不追溯宣称后续证据字节属于先前渲染捕获，也不
从修订推断完整语料或渲染重跑。

核心归属日志 `/tmp/oink-r5-frozen-core-hugo.log`、
`/tmp/oink-r5-owning-race.log`、`/tmp/oink-r5-owning-vet.log` 已通过。A13 影响
与 A14 移动保护所需受支持 CLI 范围通过；A15 有界上下文通过，workspace/direct
一致性仍属于 R6。不宣称消费者写入、提交、发布、网络部署、远程模型集成或增量提速。

## R6 工作区与适配器验收证据 {#r6}

R6 受支持范围在冻结归属/运行时、精确二进制消费者一致性/保护及受保护规范
源码/渲染门禁后已本地接受。受支持登记/工具字段归属
[契约](/zh/docs/design/decisions/cli/#workspace-registry)与
[指南](/zh/docs/start/cli/#optional-checkers)。R1–R6 已本地接受；历史收据保持不变。
A07 适配器与 A15 工作区/直接/context 受支持范围通过下列门禁；R7/R8 与最终 A18 仍未完成。

登记独立版本为 `oink.workspace/v1`：严格单文档普通 YAML、1–64 个条目、最多
256 KiB、准确 ASCII 名称、字面相对/绝对目录、已证明的规范身份，以及重叠拒绝。
缺失站点保持逐站未完成，后续选定站点继续运行。选择保留登记顺序；不提供默认登记
站点、同级发现、Hugo 设置复制或自动多站应用。可选工具扩展 `oink.policy/v1`，
固定协议版本，提供配置/完整模式来源，以及类型化遗漏/覆盖。

### 工作区归属收据 {#r6-workspace-gates}

| 聚焦门禁 | 已执行本地证据 |
| --- | --- |
| 登记核心 | 严格字段/文档/大小/名称/字面路径、现存别名/大小写 inode 祖先、重复/重叠拒绝、缺失目录列出与准确子集顺序；`go test -race ./internal/workspace -count=1` 通过，1.414 秒，`/tmp/oink-r6-workspace-core-race.log` |
| 公共实际 Hugo | `OINK_TEST_HUGO=1 go test ./internal/app -run '^TestPublicR6Workspace' -count=1 -v` 通过，10.498 秒，`/tmp/oink-r6-workspace-public-hugo.log` |
| 公共 race | 相同公共工作区套件加 `-race` 通过，12.426 秒，`/tmp/oink-r6-workspace-public-race.log`；排除的命令明确拒绝登记选择 |
| Vet | `go vet ./internal/workspace ./internal/app` 退出 `0`，`/tmp/oink-r6-workspace-vet.log` |
| 公共结果 | 实际双语已提交夹具站点在 `links` 与完整检查中保留直接诊断/覆盖/退出一致性。首个缺失站点为 `2`，后续干净/有问题站点分别为 `0`/`1`；显式子集保留登记顺序，错误的未登记同级站点保持原样，人类输出保留发现项 |
| 选定应用 | 保存翻译审阅预览已验证、未应用；改选其他登记名称在写入前拒绝，保留计划/源码字节/完整模式/Git。显式匹配名称应用只写计划中的审阅文件；其他登记及未登记站点保持原样 |

这些是归属夹具结果，不是消费者采用，也不授权对真实消费者应用计划。已检查核心
`workspace.go` 的 SHA-256 为
`cf2cbc9509e8c83eedf6d8833c9eb0ea6492de9a85c959798112fa3f105213f4`；
归属测试为
`9070a8e2c3e58680f6567f2394160ec682bf0457c068c2addf354921e7612d6b`；
公共测试为
`3e57a6417ae2e7604f7cb06933759bb06a2f40758ff7059848593cedbaa6570a`。
这三份已检查文件均保留 `0600` 模式。下方冻结全部运行时清单覆盖这些归属源码
捕获；单独文件哈希不代表实际运行二进制身份。

### 修正协议与阶段门禁 {#r6-pending-gates}

| 协议或门禁 | 记录状态 |
| --- | --- |
| 实际 markdownlint-cli `0.49.1` 与 Vale `3.24.0` | 修正公共试验通过：恰好一个发现项映射到原始 UTF-8/BOM/CRLF 行；排除的 front matter/短代码/数学公式/原始 HTML/已启用属性/代码不产生错误原文归因 |
| 实际 lychee `0.24.2` | 修正试验实际到达本地 HTTP 夹具：`200` → `0`，`404` → `1`，`401`/`403`/`429`/`503`/超时 → 必需 `2`。可选离线 → `0`，必需离线 → `2`，两者均零 HTTP 请求 |
| 最终聚焦实际工具收据 | `/tmp/oink-r6-public-actual-tools-final.log` 通过，15.192 秒；先前修正后的 14.686 秒运行保留为已有证据。Node 预加载与发现的 JS 配置没有执行；源码完整模式/Git 保留 |
| 假工具/协议失败收据 | `/tmp/oink-r6-public-fake-tools-final.log` 通过，13.089 秒：错误输出、版本不符、超时、不安全配置、必需缺失/可选/检查组遗漏与原始 stderr 规范化 |
| 聚焦公共 race/vet | `/tmp/oink-r6-public-tools-race.log` 假工具和实际用例通过，30.273 秒；`/tmp/oink-r6-public-tools-vet.log` 退出 `0` |
| 冻结运行时输入 | 父任务在 `2026-10-03T10:58:01.807947Z` 冻结，`/tmp/oink-r6-runtime-freeze.json`：103 运行时输入绑定 `b85affd96378b45bfc56a996b0c5672d02ee4c6cc9bc95335fa5072f6c42a03b`；179 更广 CLI 输入绑定 `fbb8176ebc58f1aa26336f4e6036cf9bd5f7a0d62b142f16532b50a8071e9fbe`。实际运行的 `0.3.0-r6-local` 二进制 SHA-256 为 `aa8b347fbe01071f9da729f4d98aa2f50d7264456be6c5f05771bcfadadc371f` |
| 冻结归属套件 | 完整 Go/vet 退出 `0`，`/tmp/oink-r6-frozen-go-gate.log`；完整实际 Hugo 与固定工具退出 `0`，`/tmp/oink-r6-frozen-hugo-gate.log`（app 382.832 秒）。工作区/核心/协议/源码遮蔽/政策/报告 race 与 vet 收据通过，副本保留在最终收据中 |
| 四个消费者站点 | 已验证：全部四站精确二进制直接/汇总诊断、覆盖、退出、身份及登记顺序一致；逐命令/整体源码字节/完整模式/类型/逻辑与可变 Git/被忽略输入/目录保护通过。汇总完成 `4`，有问题 `1`，未完成 `0`，退出 `1` |
| 规范中英文 | 通过：受保护首次十文件晋升、源码归属检查与新鲜普通生产/不可发布渲染证据；仅保留已知生产 draft 发布文档缺失 |
| 阶段决策 | 必需收据齐备后 R6/A07/A15 受支持范围已本地接受；R7/R8/最终 A18 未完成；没有公开版本发布、消费者源码写入、采用或部署 |

永久聚焦工具收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-tools-6bf67ltv/r6-public-tools-acceptance.json`，
SHA-256 为 `16b6e47fc0618c76d2f9e3680a4112b6e47b478af8aabd3f2fc84821f840cc8a`。
它绑定工具准备记录、可执行文件/配置证据与 1,422 个已解析 Node 包文件。Markdownlint
报告原始 `content/tools.md` 第 7 行，`bytes[80:92]`（`ppears here.`）；Vale
报告同一行，`bytes[71:78]`（`BADTERM`）。七个网络用例每个均实际发出一个 HTTP
请求。这些记录不认证全部传递解释器、其他运行时目标或完整消费者语料。

精确二进制消费者收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-corpus-59_asiyr/final-receipt.json`，
42,212 字节，SHA-256 为
`0ad86afaf235bdcff0c474e76b08e0591591a7b22c7992b02e20fb17975d029e`；
完成摘要绑定
`467b66eb6d178829508115050d4243909313acf1b4d59317ecda37ab7383ca55`。
它保留 14 份归属/完成门禁日志副本。六个原始操作合计 314.912887 秒，不计候选编译
和仅收据修正。`workspace list` 返回 `0`；四个直接完整检查返回 `0`/`0`/`0`/`1`；
汇总返回 `1`，全部四站完成。

| 站点 | 保留源码文件 | 直接/汇总子结果退出 | 诊断/覆盖 | 已记录发现项边界 |
| --- | --- | --- | --- | --- |
| Starter | 97 | `0`/`0` | 28/29 | 仅翻译审阅信息 |
| 文档站 | 421 | `0`/`0` | 144/34 | 仅翻译审阅信息 |
| PIG | 858 | `0`/`0` | 120/41 | 仅翻译审阅信息 |
| Repository | 2,294 | `1`/`1` | 11,250/29 | 已有 10,462 重复 ID 发现及 788 翻译审阅信息项 |

直接和汇总子结果的身份、顺序、每项诊断与覆盖记录均一致。全部四消费者源码在每次
操作后及整体保留完整模式/类型、逻辑与可变 Git 元数据、被忽略复制输入和目录清单；
完整根 CLI 清单也仍等于冻结捕获。478,603,149 字节 repository 直接 JSON 与
635,470,795 字节汇总 JSON 通过流式完整验证，没有截断。可选工具协议归属独立
固定工具夹具；消费者登记只存在任务临时目录，不写消费者政策。

初始验收驱动将摘要结果的 `command` 字符串覆盖为调用 argv，六个 CLI 操作及其
逐操作保护全部完成后，产生错误的一致性异常。失败驱动与摘要仍保留为
`pre-correction.r6_qualify.py` 与 `pre-correction.summary.json`。收据完成只修正
调用元数据，验证原始结果 SHA-256 和头部命令不变，保留全部原始完整流诊断/覆盖
摘要，并重查整体消费者/根目录保护。无需 CLI 运行时修正或 Hugo/CLI 重跑。仅收据
完成耗时 2.002 秒，`/tmp/oink-r6-corpus-receipt-completion.log` 退出 `0`。

实际执行驱动 SHA-256 为
`4d2a360c6f7f6f96c38698bd189bc4d4b2cb02a7509858920d752897fdd85988`；
修正后驱动为
`4870f5c0374fcc11ad1a6b2e3aefe36f493b6f9f4666c293993dc6a59df8a11b`；
收据完成驱动为
`cd50d3fe704370f73fa4e7d94ce8e4bc925d11ec8ef04d463aacec37c2053daf`。
流式辅助程序绑定
`144f778cdb7907372797b47b97f817f340e70423701a2a958dee589281a9a11c`，
清单辅助程序绑定
`d3ac41dc2e18295bfb26134d1a696935c8174913e2801a5766dbf7a1139d89f8`。
此收据验证本地 darwin/arm64，使用 Go 1.27.1、Hugo Extended 0.166.0、Node
26.9.0 与 Apple Git 2.54.0。它不刷新最终 A18，不验证 Darwin amd64 或其他平台，
不应用消费者计划，不公开发布或部署。语料捕获时，规范晋升与实际渲染中英文
归属门禁是独立待完成工作；后续收据在下方关闭该边界。首次晋升字节不能追溯
宣称本次渲染后修订。

初次实际工具试验属于预备证据，不是验证通过证据。它暴露了 Darwin `/var` 与
`/private/var` 暂存身份、实际回环代理路由，以及 Vale 夹具中无效的行内块属性/行号
断言。暂存现在使用规范路径；Vale 夹具改为真实独立行块属性，源码遮蔽边界不变。
已验证子环境传入字面的 `NO_PROXY`/`no_proxy` 主机列表数据，不传代理 URL/凭据
和 Node 预加载设置。空代理环境与 `NO_PROXY=*` 都未建立已测试 Darwin 回环路径；
不宣称通用操作系统代理绕过。

受支持源码诊断需要已证明原始范围；渲染 lychee 位置仍是输出文件/DOM pointer，
不推断 Markdown 行号。离线时不调用 lychee。鉴权/限流/服务器/传输不确定性不能
通过严重度、排除项或基线确认变成必需成功。外部片段、浏览器执行与远端内容身份
未经证明。声明、结果封套与必需未完成优先级独立于最终平台/归档验证；Darwin
amd64 与最终 A18 仍未完成。

首次受保护十文件晋升及其新鲜渲染验证现已完成。收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-docs-render-dcwtcmyl/summary.json`，
555,297 字节，SHA-256 为
`ee153932900dc6f1ec62beef1a75927fc60b857efccfbcc558bf0e2c2b12cc04`。
64.17 秒运行使用上方记录的精确已验证 `aa8b347f…371f` 二进制及不变的
103 输入 `b85affd9…a03b` 运行时清单。

| 首次晋升文档归属检查 | 实际结果 |
| --- | --- |
| CLI 生产链接 | `0`；一次严格生产 Hugo 渲染器，无分析构建 |
| 普通生产 Hugo / Markdown / 链接 | `0` / `0` / `0`；214 内容页、43,376 文本节点；345 HTML 页、48,438 内部引用、4,259 片段 |
| 普通生产翻译 | `1` 仅为已有 draft `content/blog/release/1.2.0.md` 未进入生产；不是新增 R6 失败 |
| 独立普通不可发布 Hugo / Markdown / 链接 / 翻译 | 全部 `0`；216 内容页、43,682 文本节点；347 HTML 页、48,814 内部引用、4,287 片段；137/137 组、1,118 标题 |
| 源码归属 / Schema | 翻译、风格与空白全部 `0`；137/137 组、1,118 标题；137 中文文件、181 粗体标记、零强调标记；CLI/文档结果 Schema 均绑定 `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda` |
| 保护 | 全部 12 个归属命令、CLI/Schema 检查及整体比对保留 421 主源码、427 复制输入、109 目录、36 可变 Git 文件的完整模式/类型/字节及逻辑 Git；两个私有普通源码副本和全部 103 运行时输入不变 |

首次晋升安装器收据 `oink-r6-doc-drafts-ymjop499/applied-files.json` 绑定
`13c965592d64056d8365aed1927d2d422fadec8adc54ee7050b22e2ea0ad6270`。
它在私有临时存储中保留捕获的实际原始 inode，保护后续旧打开句柄写入；恢复也保留
后续目标修改或删除。随后双语状态/证据修订具有独立完整字节/模式保护及源码归属
收据，只更新当前说明、命令状态和本台账，保留此前收据和配置示例。新字节不是
64.17 秒渲染运行的输入，不将该运行宣称为新字节重渲染。这些门禁后，R6/A07/A15
受支持范围已本地接受；R7/R8 与最终 A18 仍未完成。不宣称重复语料验收、公开
发布、消费者计划应用/采用或部署。

## R7 只读 Studio 候选证据 {#r7}

R7 已实现[契约](/zh/docs/design/decisions/cli/#studio)与
[指南](/zh/docs/start/cli/#studio)描述的内嵌五视图浏览器及鉴权回环 API 候选。
R1–R6 历史章节及准确收据保持不变。冻结核心/浏览器及精确二进制四消费者验收
及受保护规范渲染门禁在声明范围内通过；R7/A16 受支持只读范围已本地接受。
R1–R7 已本地接受。R8 编辑与最终 A18 未完成。

### 聚焦原生与浏览器证据 {#r7-focused-gates}

| 归属边界 | 证据状态 |
| --- | --- |
| 原生/公共一致性 | 实际共享检查在 `0`/`1`/`2` 下保留诊断/覆盖/退出身份；显式选定工作区启动、清理/信号及无源码写入证明由归属测试收据单独记录 |
| HTTP 管理/源码/预览 | 字面回环选择；准确 Host/origin/Bearer 检查；无任意请求路径/写入；捕获源码/diff 限制及源码模式/输出清单保护；下方聚焦核心/新浏览器及本轮语料收据绑定该受支持范围 |
| 首次保持界面浏览器 | 14 次 axe 零违规、14 张截图；五个桌面浅色视图、捕获 BOM/CRLF 源码/diff、桌面深色、移动深色、全部五个 320 像素浅色视图及捕获变化。合成实际 Hugo 夹具保留 228 原生诊断和覆盖一致；建议复制使用私有测试剪贴板，不改宿主剪贴板 |
| 浏览器预览攻击 | 实际攻击脚本在隔离预览执行，但 parent 访问、管理 fetch 与弹窗被阻断；拒绝 token query。仅 draft 页面在生产仍为 `404`。这证明已测试浏览器/CSP 范围，不是操作系统网络沙箱 |
| 快照保护 | 捕获源码指令/HTML 保持字面数据；显式任务夹具外部编辑后、刷新前，初始捕获仍保留旧字节。除已声明夹具编辑外，源码完整模式/Git/目录保留；changes 展示实际修改捕获输入 |
| 前一份保持浏览器 | 刷新保持 UI/后端收据通过：全部 14 次 axe 零违规、14 张截图，包含声明/捕获主题行。它先于局部预览运行时修正，不证明该新运行时 |
| 新局部预览浏览器 | 新冻结局部预览运行时通过：14 次 axe 零违规、14 张截图；实际 Hugo 正常 HTML `200` 与 67,108,865 字节产物 `413`；原生 `1`/228 条诊断及覆盖保留，必需局部覆盖可见，Studio/刷新 `2` |

首次浏览器收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-AfwaYi/summary.json`，
SHA-256 为 `930fbd1ab86806069b963bff2e3e95aaa07e3634400cec65e2b8c7922e2a1707`；
准确二进制绑定
`92e5b962e40fbe828a0b006f3ae76a2bddf4ad7e8b1c5b6967e365b8f1827879`。
后续声明/捕获主题元数据行不宣称由此前二进制测试。本地验证版本为 Node 26.9.0、
Playwright 1.62.1、`@axe-core/playwright` 4.13.0、Chromium 151.0.7922.34；
它们是明确预备的贡献者依赖，不是消费者运行时需求或自动安装。剪贴板证据覆盖
实际 UI 点击和私有剪贴板实现，不覆盖完整宿主剪贴板。

刷新保持 UI/后端浏览器收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-vn0ofb/summary.json`，
SHA-256 为 `520603779f712539865c6e9ef7a9ad3ad21ec1906adfb067ec607cc69d071b7e`，
准确二进制为 `73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`。
全部 14 次 axe 与 14 张截图通过，包含声明/捕获主题元数据及全部五个 320 像素
视图。它保留上方针对前一运行时的有界合成夹具/源码/预览/剪贴板声明，不证明
后续局部预览修正；新浏览器、全阶段、消费者及渲染文档验收保持独立。

初次并行完整套件试跑
`/tmp/oink-r7-frozen-go-gate.log` 与
`/tmp/oink-r7-frozen-hugo-gate.log` 失败，不属于验收收据。失败原因是并行包负载下
既有 CI 测试十秒截止时间，以及图测试观察器刷新自身 Git 索引。单独 CI 目标组随后
分别用 12.149、2.291 秒通过；受控 Git 观察器图运行用 1.354 秒通过。仅
`internal/projectgraph/hugo_test.go` 改动：其只读观察器关闭 Git optional locks、
filesystem monitoring 与 untracked cache。该测试修正后，普通实际 Hugo 图运行
用 1.562 秒通过。运行时与内嵌 UI 字节均未改动。

修正冻结收据为 `/tmp/oink-r7-corrected-runtime-freeze.json`：113 运行时输入保持
`15a7de85a1ae9e6a73d8ea6570aa4f97bdd0ad5677ad7ca996fdd081ad43f7b5`；
193 更广输入现绑定
`67c6d36cf91d175f208f79cdd4d337aab6d2ef71e43453b20394b677678725e8`，
相对前一份 `85ad60d24c93e899020fbdcd34f8252c578253ce5afaf8652e561a432ecc8067`
冻结只改变测试观察器文件。修正后的串行 Go 测试与 vet 已通过，日志为
`/tmp/oink-r7-corrected-go-gate.log`。修正后的串行实际 Hugo/固定版本工具套件也
已通过，日志为 `/tmp/oink-r7-corrected-hugo-gate.log`，SHA-256 为
`2aed822ff6fc8be04919aa74ca6ada721789232c14c1d77f1d44113bc0d235a7`；
应用包耗时 220.782 秒。独立 Go 后源码保护审计收据为
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-postgo-audit-qygh7bcc/receipt.json`，
SHA-256 为 `5ee45fe041536243bc1229054516835c61b27909a4f296ac226b1a138e4bc8dc`。
它验证完整物理/逻辑输入保护，不证明 Hugo 或消费者结果。

持久修正归属门禁收据为 `/tmp/oink-r7-corrected-owning-gates.json`，SHA-256 为
`c7f94a740e33a7349886b3f3689419719f857f39031375e80ca384a3dac36e67`。
它将两份串行成功运行绑定到修正冻结，并保留失败试跑为未验收。预备文档渲染驱动
现要求完整消费者收据证明私有捕获源码重建与最终浏览器二进制字节相同。独立
源码审计 `oink-r7-docdriver-audit-ig_r8ud1/receipt.json` 绑定 SHA-256
`858cc48bf602fbdb26fcbda03c78ca485338b1295d64257d32cfb14b24f1ade3`，
以及预备驱动
`f25d9ac4bf1a7ef43d5526b7b3cbadf84dd64ad8a57fd82d1c82e76fdb2b3435`。
该审计没有执行或验收规范渲染。

首次消费者驱动试跑 `oink-r7-corpus-h1lOFl` 因
`KeyError('preview_base_path')` 停止：驱动直接索引实际预览基路径为空时合理省略的
字段。该私有重建与最终浏览器二进制
`73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`
字节相同；四消费者源码清单与根清单全部保留。失败的驱动运行不构成四消费者
门禁验收。新 `oink-r7-corpus-corrected-cByXTa` 驱动仅将这两个访问改为
`get(..., '')`，SHA-256 为
`4c409acacbb9b82e658e6705eddefd9a3541def5c63c340b65678a6c9a8354e4`。
该新运行随后因仓库产物中一个清单文件超过 64 MiB 而失败：前一运行时拒绝全部
生产预览。原生检查保持结果 `1`，必需预览不可用使 Studio 结果为 `2`。
Starter、docs、PIG 在本次运行完成并返回 `0`；四消费者源码清单与根清单保持
不变。失败 `cByXTa` 试跑保留，不构成四消费者门禁验收。空基路径驱动修正均未
改动运行时或消费者源码。

父任务随后授权局部预览的窄运行时/测试修正：保持 64 MiB 限制，开放限制内受保护
生产文件，准确跳过的超大路径返回 `413`，必需 `studio.preview` 覆盖保持未完成。
原生检查结果不变；必需预览未完成仍使 Studio 返回 `2`。内嵌 UI 保持不变。
此前浏览器/归属/二进制/语料收据都只描述各自旧运行时边界，不证明此新运行时。
新归属/浏览器门禁在下方独立记录，不从旧收据推断；精确二进制四消费者验收
保持独立。
旧失败捕获证明有产物超过 64 MiB，但未暴露其捕获路径/大小；被忽略仓库产物不
构成该捕获身份的证据。新的有界覆盖 detail 将记录实际省略相对路径、大小与总数。
预备实际 Hugo 浏览器夹具增加 64 MiB 加一字节的 `static/oversized.bin`，用于
验证可用受保护 HTML 预览、准确跳过文件的 `413`、原生结果 `1` 及必需局部视图
结果 `2`。该夹具准备本身不是浏览器验收；随后已完成浏览器证明在下方记录。

新局部预览冻结收据为 `/tmp/oink-r7-partial-preview-runtime-freeze.json`，SHA-256
为 `c426ce3e641ed7b39bb711a26006306cab22e761c5062f2164f10deb4bea8765`。
113 运行时输入绑定
`4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84`；
193 更广输入绑定
`8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`。
运行时输入仅改动 `internal/studio/preview.go`；更广改动还包含其测试及
`scripts/test-studio.mjs`。三个 UI 文件字节与模式全部保持相同。聚焦核心最终 race
用 1.748 秒通过，vet 与限定空白检查也通过。收据
`oink-r7-partial-preview-owning-a56dunn4/receipt.json` 绑定 SHA-256
`7b6ecb491f283d04fe54347e564dba426b1a84d152040a1d945af54bc67756ac`。
初次稀疏夹具模式试跑排除：宿主 umask `0077` 使请求 `0640` 的文件实际为 `0600`；
夹具显式 chmod 到 `0640` 修正该设置，未改变生产行为。聚焦证明覆盖正常 `200`、超大
`GET`/`HEAD` 的 `413`、身份变化 `409`、私有路径 `404` 及其他未知产物错误拒绝。
它不替代随后独立的更广浏览器/归属/语料/渲染门禁。

新局部预览冻结的完整串行 Go 测试随后用 61.481 秒通过，vet 用 0.571 秒通过。
完整日志为 `/tmp/oink-r7-partial-preview-go-gate.log`，SHA-256
`be7d6eccf99a6f4c1b8f09d1fb782455c7cbd3bad4a2f37e2f0e9da916bcb313`，
以及 `/tmp/oink-r7-partial-preview-vet-gate.log`，空文件 SHA-256 为
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`。
独立保持输入审计 `oink-r7-partial-held-audit-o6p98i1l/receipt.json`，SHA-256
`e567efc5f580db9395afab8ad36c4db842c3db95db442eb1cb1c740dbd43ec31`，
在父任务 Go/vet 运行期间验证全部 113/193 输入及物理/逻辑身份。它不构成套件后
或浏览器/语料/渲染完成声明。新完整实际 Hugo/固定版本工具调用随后用 285.649 秒
完成，退出 `1`。唯一失败是父任务使用不可用 Markdownlint 准备路径
`/md/node_modules`；其他实际案例全部通过。该日志保留为失败调用：
`/tmp/oink-r7-partial-preview-hugo-gate.log`，SHA-256 为
`1ab6b8cfd399d484e08a1d1f05d25475754caa731991dd1eec1cca03cf6ce970`。
唯一归属案例改用准确预备的 `/markdownlint/node_modules` 可执行文件重跑，源码/
运行时不变，通过：应用包 2.317 秒，墙钟 3.265 秒。收据为
`/tmp/oink-r7-partial-preview-corrected-tools-gate.json`，SHA-256
`62b75e563e8074995ed9dd354434e653b2f5f2c6d20767226286d0c08d4c667c`；
日志 SHA-256 为
`e9bddac210654d219d9c5d6ebabaa3b91a0f5f4de4daf228b3ae21aeaac7673a`。
可执行文件来自预备收据
`268e601e81bc03a263296d57257b85635371bda642d0632532a7d9318c981461`。
独立案例矩阵/保持源码审计验证失败完整调用加该修正案例形成累计已执行实际
归属案例覆盖 `0`。收据 `oink-r7-partial-case-matrix-audit-16_bl9hr/receipt.json`
绑定 SHA-256
`0a9e4a1a1e1a08f597becb2f27e743c9f23df672c713c2757241704edb16b51e`。
全部 113/193 物理/逻辑输入保持冻结。可选 `TestArtifactCorpus` 与
`TestPublishedRuleSourceProvenance` 案例明确跳过。不能将完整调用重新标为退出
`0`，也不能宣称跳过案例已经执行。

新 Go 后输入审计 `oink-r7-partial-postgo-audit-g1hcqdtl/receipt.json`，SHA-256
`b369737ec48456f673c850ea702cb3cb7efffb8ecc129d87e00dc03af82b2e3b`，
随后确认 Go/vet 后全部保持的 113/193 物理/逻辑输入。该范围不宣称完整 Hugo、
浏览器或消费者完成。

新局部预览浏览器基于准确二进制
`f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e`
通过，版本 `0.4.0-r7-local`，16,000,578 字节、模式 `0700`。摘要为
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-cE9be3/summary.json`，
SHA-256 为 `9099e6c407fd0f9de3c29ce80e03f034a4223d7d7a7c1f1378052e8b9084e0ae`；
来源收据 SHA-256 为
`85b9f537fb09eecbb09d133b53a297c78184c11200ab0938734c0d10f3449095`。
私有 `oink-r7-browser-partial-ZZIqzZ/source-binding.build.json`，SHA-256
`7a89ab8318c3a38455ab6ce12bcdbc53ae5ce0674fb5aaaa1df0fcf68a093399`，
将捕获/构建前后全部 113 运行时及 193 更广源码输入和物理身份绑定到新冻结；
根输入保持不变。全部 14 次 axe 零违规、14 张截图通过，保留上方键盘/移动/深浅色/
源码/剪贴板/安全检查。实际 Hugo 生成 67,108,865 字节 `oversized.bin`，经渲染
`/sub/oversized.bin` 链接实际到达并返回 `413`；普通实际 HTML 返回 `200`。
必需局部预览覆盖保持可见；228 条类型化原生诊断、原生覆盖/结果 `1` 在 CLI/API/UI
中一致，Studio 及随后刷新返回 `2`。源码保护仍仅排除明确任务夹具外部编辑。
这是有界合成浏览器证明，不是完整四消费者或规范渲染门禁。

另一份未执行的预备语料驱动假定正常可用预览总会附加 `studio.preview` 覆盖行。
实际正常 Starter/docs/PIG Overview 不输出该行；准备假设已修正，未改变原生覆盖。
修正后的新 `oink-r7-corpus-partial-pZLwY0` 驱动，SHA-256
`47778df62505beeb7432985be927f1b001e03824e9dee3a6dbed9d9b2dbe049c`，
已针对这三份保留实际 Overview 及当前局部浏览器捕获复核。正常可用仍需实际
预览 URL 和独立 HTML `200`；局部捕获保留真实必需覆盖行、省略总数/身份和 `413`。
准备审计为 `oink-r7-partial-driver-correction-audit-sa98cm6k/receipt.json`，SHA-256
`a519a5bc6ae83438146ff4710d53f5edb0e656a05d0532c02123e5771416f07e`。
此前 `f762` 准备没有执行或验收。父任务随后释放修正驱动重新运行全部四站点；
其完整验收记录如下。

新四消费者验收用 234.6425 秒完成，驱动结果 `0`。本轮摘要为
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-corpus-partial-pZLwY0/summary.json`，
SHA-256 `d7b5a4f1607b6f75ae6a596c19cbab28685fb67dac750096173060ed097c8bf5`；
日志 `/tmp/oink-r7-partial-corpus-gate.log` 绑定 SHA-256
`a7b724500569bd594d8e01502ec1956eb089cc9153b04b693992a9322013c811`。
持久本轮语料 `qualification.receipt.json` 绑定 SHA-256
`4e5df7c3fda9f0b763091af3e6cb85c68c736c319a1de68030b81d5cd5b384bc`；
主源码清单分别包含 97/421/858/2,294 个文件。
私有捕获源码重建与新浏览器二进制
`f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e`
字节相同。113 运行时/193 更广输入及根物理身份保持冻结；每次操作与整体边界均
保留四消费者字节、完整模式/类型、逻辑/可变 Git、被忽略捕获输入和目录。

| 消费者 | 原生结果 | 类型化诊断 | Studio 结果 | 实际捕获页面 |
| --- | --- | --- | --- | --- |
| Starter | `0` | 28 条审核信息记录 | `0` | 66 |
| docs | `0` | 144 条审核信息记录 | `0` | 343 |
| PIG | `0` | 120 条审核信息记录 | `0` | 248 |
| repo | `1` | 10,462 条既有重复 ID 发现加 788 条审核信息记录 | `2` | 1,576 |

四站嵌套原生 header、类型化诊断、覆盖及退出与直接 CLI 检查准确一致。Issues
完整分页；其他视图采用有界样本，四站均有捕获物理源码及翻译 diff。前三站实际
生产预览 HTML 返回 `200`；它们不输出 `studio.preview` 省略行，驱动没有虚构该行。
仓库正常 HTML 返回 `200`、60,100 字节。当前捕获准确暴露四个超大 print 路径；
每个实际 `HEAD` 返回 `413`，响应体零字节：

| 捕获省略相对路径 | 捕获字节大小 |
| --- | --- |
| `_print/pkg/index.html` | 73,976,221 |
| `_print/pkg/pgsql/index.html` | 69,903,999 |
| `zh/_print/pkg/index.html` | 73,086,240 |
| `zh/_print/pkg/pgsql/index.html` | 69,052,754 |

这些身份来自本轮有界捕获 detail 与实际请求，不来自此前被忽略产物线索。必需
`studio.preview` 保持未完成，仓库 Studio `2` 因而保留原生 `1`。docs 与 repo 实际
仅分析 draft 路由在生产返回 `404`；Starter/PIG 缺少唯一捕获 draft 路由，该测试
明确不适用。工作区子集/全集/健康子集会话仅选登记站点，不捕获并关闭监听器；
未知或选定缺失站点在启动前返回 `2`。这是本地 Darwin/arm64 CLI/API 证据，使用
Hugo 0.166.0 Extended、Go 1.27.1、Git 2.54.0；浏览器范围保持为独立合成夹具。
没有源码写入、安装、公开发布、采用或部署。独立最终语料审计
`oink-r7-final-corpus-audit-xr3_u5dt/receipt.json`，SHA-256
`b8a8eedf5c899fe5830bdde959783c46b3f191ab144c0d3798077555d55238fc`，
不重渲染、不新增 HTTP 请求，验证原始类型化原生/API/退出一致、132 项操作保护
比较及四项整体保护。仅受保护规范晋升/渲染及显式
R7/A16 阶段决策仍待完成；R8 与最终 A18 未完成。

临时磁盘容量准备期间，父任务仅清理三个明确创建的私有 Go build cache，共
366,184,826 字节，收据为 `/tmp/oink-r7-private-cache-retirement.json`。
源码、二进制与验收证据均保留；未删除全局、用户或系统缓存。此准备操作不是
运行时修正或验收门禁。

### 剩余阶段门禁与晋升边界 {#r7-pending-gates}

| 必需门禁 | 当前状态 |
| --- | --- |
| 冻结运行时输入/二进制身份 | 新局部预览冻结绑定 113 运行时输入 `4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84` 和 193 更广输入 `8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`；所有 UI 字节/模式保持不变。源码绑定浏览器二进制 `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` 已通过；新私有消费者重建字节相同 |
| 完整 Go/vet 与实际 Hugo | 新完整串行 Go/vet 与浏览器已通过。新实际 Hugo/固定版本工具完整调用保持因准备路径退出 `1`；唯一修正归属案例通过 `0`，独立验证累计已执行实际案例覆盖 `0`；两个可选案例明确跳过 |
| 四消费者 | 精确二进制 CLI/API 验收完成；原生 `0/0/0/1`、Studio `0/0/0/2`，准确嵌套原生一致及源码字节/完整模式/类型/Git/被忽略输入/目录保护；仓库局部预览保持必需未完成 |
| 规范配对源码/渲染 | 首次受保护 TEN 晋升及限定实际渲染通过；渲染后状态修订采用独立新源码检查，不宣称重渲染 |
| 阶段决策 | R7/A16 受支持本地范围已接受；R1–R7 已本地接受，R8 与最终 A18 未完成 |

下一份预备文档安装器在成功与恢复时都将捕获的实际旧 inode 保留在规范源码外，
不会在较早目标身份检查后取消其最后名称。此私有辅助程序加固及新恢复夹具属于
新的预备边界；已执行 R6 安装器/哈希/收据保持不可变，不追溯宣称包含该修正。
R6 成功晋升已保留原始 inode。本候选文档或本地浏览器夹具不推断消费者计划写入、
公开发布、采用或部署。

首次晋升渲染门禁完成，收据为 `/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-docs-render-n8tw2tbw/summary.json`，SHA-256 `35e79f51d39803b3e4cdf134ed277957dd627acba42e0e0dc785e4745ec3c481`，日志 SHA-256 `de3a07eac661c15805070e0ed2e364a71ebbd38e15d8907aab3bdf716e95131d`，耗时 63.33 秒。准确已验证二进制 `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` 在一次严格 Hugo 构建下通过生产 CLI 链接。无 probe 普通生产 Hugo 通过渲染 Markdown（214 页/44,075 文本节点）及链接（345 页/48,482 内链/4,303 片段）。其翻译归属仅因既有未发布 release `1.2.0` draft 保留退出 `1`。独立 draft/future/expired 分析通过 Markdown（216 页/44,381 节点）、链接（347 页/48,858 内链/4,331 片段）及翻译（137 对/1,129 标题）；未替换生产产物。源码翻译/样式/空白检查通过，CLI/文档 schema `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda` 保持相同。十二项操作、schema 及整体保护均保留 421 主文件、427 捕获输入、109 目录、36 可变 Git 文件和 113 运行时输入。

首次受保护晋升收据 `oink-r7-root-promotion-p9g1u7pz/summary.json`，SHA-256 `323a5ce267e39aaf8f97dc4a12cccbdde83730155a199efb5f3815e29b334e4a`，验证实际原始 inode 保留在规范源码外。写入后收据查找曾使用 `0` 而非 `00`；该仅元数据驱动失败保留，随后使用不变原始保护完成收据。已成功源码安装没有重复执行。已执行 R6/R7 辅助程序与首次晋升收据保持不可变。

R7/A16 受支持只读本地范围在上述冻结累计归属案例/浏览器/语料及规范门禁后已接受。原完整 Hugo 调用仍退出 `1`；唯一修正工具案例加独立矩阵形成累计已执行案例覆盖。仓库原生 `1` 与必需局部预览/Studio `2` 保持可见。R1–R7 已本地接受；R8 编辑与最终 A18 未完成。此渲染后状态/证据修订具有独立字节/完整模式保护、不变标题/命令围栏、配对源码检查及保留 inode 安装器夹具。其新字节不宣称由此前 63.33 秒渲染测试；不推断额外渲染、消费者写入、公开发布、采用或部署。

## R8 已接受受审阅编辑证据 {#r8}

R8/A17 受支持编辑范围在下文修正冻结归属/浏览器/语料及受保护规范渲染门禁
后已本地接受。CLI `edit text`、`field`、
`snippet`、`attachment` 预览与显式 `studio --edit` 相同的绑定 `oink.edit/v1`
意图。保存计划应用或 Editor 显式确认 Apply 拥有选定源码写入；默认 Studio 会话
保持只读。本节保留捕获时的候选事实和试验，随后记录已完成当前验证；不把先前
R1–R7 证据延伸到变动代码。

### 候选范围与保护 {#r8-scope}

已知站点所有 UTF-8 Markdown 上限 1 MiB。完整文本及受支持普通顶层 YAML 标量
表单保留声明的 BOM/换行及源码区间保护边界，不支持表单形态保留文本。准确
`value_json` 数值避免浏览器 Number 舍入。标量表单把数值字面量限制为 4,096 字节、
十进制指数绝对值 10,000，更大/非有限构造保留手工文本。字段 JSON 最多 1 MiB；
转义孤立 surrogate 拒绝，有效 Unicode 对受支持。目录组件使用原始 UTF-8 正文字节偏移；
附件要求实际 leaf-bundle 身份、最多 4 MiB、独占干净新 basename。源码哈希、
完整模式、全部站点/外部输入、重新生成意图及新实际 Hugo 验证绑定同一共享保护
应用路径。

Editor 展示完整 UTF-8 审阅、选中文件基准/结果身份及原生候选结果；审阅上限
2 MiB，确认前对准确可见字节验证哈希。实际选定候选 HTML 是 draft/future/expired
分析，明确不可发布，与原生产预览独立。必需候选视图未完成可以把提议/会话升为
`2`，而不改写原生发现。页面文件编辑的选定候选源码哈希/完整模式须匹配已审阅
After 状态；附件/no-op 提议的选定页面保持已审阅 Base 状态。
过期/重放计划、附件冲突及不可信预览请求会拒绝；已应用但刷新失败保持明确已应用。

### 聚焦准备收据 {#r8-focused-gates}

| 候选证据 | 当前观察与边界 |
| --- | --- |
| 纯编辑核心 | 归属聚焦准确数值测试通过：`18446744073709551615`、`7.12345678901234567890123456789`、准确 no-op 原始字节及末位小数改动；更广冻结收据待完成 |
| 实际 DFE 输出所有权 | 活跃普通输出通过受限 `os.Root`、独占目标文件及保护流式读取复制；超过 64 MiB 的文件可捕获，服务限制仍不变 |
| 复制取消/race | 上下文 helper 聚焦 `0`/0.703 秒、race `0`/1.856 秒、vet/空白 `0`；实际首块取消保留部分输出，源码字节/模式/身份不变；源码 FIFO 替换不能在 fd 证明前阻塞 |
| Helper 日志身份 | 聚焦 `c227a88210ab0dc46b24eaff50a347d5c494e9ce23f5bdef5d5b822efab4976f`；race `13f0616d55fd4df791ecded0712a18096392c88cb9b849383414c305e50b6779`；vet 为空 SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 只读候选集成审查 | 审查选定实际 HTML URI/base 前缀/清单、保留私有 DFE 生命周期、源码 SHA/完整模式一致、原生与视图覆盖及取消；本次代码审查范围未发现新实质缺陷 |
| 首次 Editor 浏览器试验 | 驱动因全局 Open editor 选择器歧义停止；保留失败试验，不宣称 UI 验证 |
| 修正选择器 Editor 试验 | 桌面字段/组件/二进制应用及 axe 检查通过后，320 px draft 审阅横向溢出失败；保留原试验，不是最终浏览器通过 |
| 定点布局修正 | Editor 审阅哈希/收据文本可换行，固有宽度受限；此前 CSS 与失败证据独立保留。开发重跑通过 12 项 axe/截图，包含真实 320 px 暗色审阅及亮色收据/拒绝；最终冻结源码/二进制重跑待完成 |

Helper 证据只验证聚焦文件复制/取消，不是整个编辑应用或全部平台支持。浏览器
试验只描述实际停止范围，不构成最终 A17、消费者采用、部署或当前冻结浏览器
二进制成功证明。

前述准备行记录于首次完整 R8 冻结之前，保持开发历史边界。后续首次完整冻结
门禁通过，二进制为 `84b804d3246a5be581e44884ed910fa3f45d8be29734b8babdeeb763a11fa882`
（`0.5.0-r8-local`），运行时 123/`58517b8e98b80df6642be4ee6275a0074ec187768b20e009f41da2607b635d46`，
更广源码 212/`d81335c78413acc60e27adee0ac794862285e41cb2a3a7687ec820c1065ba003`。
完整门禁摘要为 `b49f4a3272af3e3dcc92e7e9b38d4289bb49cb19aa3e9354ea148d2d8cb2cea8`：
Go 测试 `0`/56.523 秒、vet `0`/0.904 秒、完整实际 Hugo 及三个固定工具
`0`/320.044 秒、核心 race `0`/16.610 秒、公共 R8/helper race `0`/48.319 秒。
源码保护通过，这些收据只验证此前对应字节。

首次冻结浏览器收据
`eb6977235ef9ae6cec28651b5654eb101685af67abe0cbed0acb0f8375458d9c`
绑定相同二进制及源码冻结。Editor 12 项 axe 零违规、12 张截图；保留只读
Studio 为 14/零/14。实际表单保留 `1e400` 字面量、计划 after 哈希及 diff，随后
丢弃；指数 ±10,001 与 4,097 字节数值在本地拒绝，不发送 API 请求。四次确认的
字段/组件/二进制/draft 应用只发生于一次性夹具。默认只读拒绝、过期输入保留、
no-op 源码字节、预览隔离及原生结果独立性通过。这是首次冻结的开发浏览器
证据，不是四消费者或当前修正运行时的阶段接受。

首次准确二进制消费者试验随后在 Starter 停止，耗时 37.533 秒。不可变失败试验
收据为 `853a8397ba4c527c03aa3cc9ac7cacc41c0ab0379549d145b874f1d1ecc3901c`。
两项失败分别记录：驱动事件哈希依赖 JSON 对象键顺序，但递归比较证明 API/CLI
数组相等，均为 28 条诊断、29 条覆盖、原生退出 `0`/`0`。另一个是真实运行时
问题：重复解析缓存捕获产生 `.gitattributes` 模块输入重复；必需候选图捕获不完整，
修改结果为 `2`，原生检查仍为 `0`，没有实际选定 DFE HTML 或可应用 lease。
公共发布缓存夹具重现该缺陷，保留失败日志为
`50ab704e715665096e0f36391bb1364841c3a2b2ac88dd262915ce53fb66afa6`。
全部 48 份已记录逐操作源码证明及四份消费者整体保护保留字节、完整模式、类型、
Git、忽略但复制的输入与目录，根输入准确不变。没有 Apply 或保存计划；停止的
试验不构成完成四消费者验证。

定点运行时修正先收集完整解析模块行，再提交新增记录。相同重复或重新排序的
捕获保留原清单。既有范围内哈希/完整模式变化、路径增删、整个范围缺失、身份
冲突或捕获错误都拒绝，不刷新此前证据或追加部分结果；非模块行保持准确。
site 归属收据 `e7b284b9dece1c5f2b696cd76166d2286fcbec69e6c48912ab9a78204bdb980b`
记录聚焦 `0`/0.746 秒、site `0`/2.123 秒、聚焦 race `0`/1.958 秒、vet
`0`/0.167 秒。这比较重新观察的完整行，不锁定模块文件阻止并发写入。

修正公共发布缓存收据
`6358dc81f06e34b789cb47a0f4442d6d036d2e33423a06f5dbe85b3064766da6`
使用任务本地复制、校验过的 `github.com/pgsty/oink@v1.1.0` 归档，没有下载或
replacement。原始/候选图各有 1,256 条唯一输入，含 1,198 条模块输入。完整
API/CLI 类型化诊断、覆盖、退出及计划身份一致，实际选定 DFE HTML 返回 `200`，
源码字节/完整模式/Git 不变，没有 Apply 或保存计划。归属 race 30.255 秒通过，
vet 通过；修正 race 日志为
`c7d21a30b8af141d9d9604a80ddf9cf3f608320b97a441a06a742376e2119551`。

当前完整修正冻结为
`fb276500a3d2643bd0aa220f8bebb380fce2c98493d62b0502b6497b2f02949f`，
运行时 123/`cdf629eeb4bbef6d4d88ee27fe3fb0a73b07b6bf6438336e033a18fb7feb1c17`，
更广源码 212/`f6e305e792733a550814eb841615d12fa14a9a6bb2a97c4ada85f7275183e579`。
相对首次冻结只变动 `source_inputs.go`、其归属测试及公共发布缓存测试；受控
UI/helper 字节及全部完整模式不变。重建候选为
`bd25f9e0b35ec10e227aabf9582ae40b0b367390f64b93668de6ae85222c3d71`
（`0.5.0-r8-local`）。已观察的修正源码绑定浏览器收据
`33a698985a55c14c3e64e981da1f8e74c686497083dc0edb241406f185e3eeb8`
再次记录 Editor 12/零/12、只读 14/零/14，完整 123/212 前后源码保护通过。
本次证据修订时，修正完整归属门禁、新四消费者语料及受保护规范渲染仍待完成。
R8/A17 尚未阶段接受，最终 A18 保持未完成。

下一次证据观察时，修正完整门禁已完成，绑定前述受控 `bd25f9e0…22c3d71`
二进制及 `fb276500…02949f` 冻结。摘要
`208f156c0954e803eccbada678a4689683dc1576c543c379e5cc04b3497ef772`
记录 Go 测试 `0`/57.826 秒、vet `0`/0.521 秒、完整实际 Hugo 及三个固定工具
`0`/378.847 秒、核心/site/Studio race `0`/17.937 秒、公共 R8/附件/输出 helper
race `0`/85.159 秒。每项门禁源码前后保护通过。实际 Hugo 日志有 434 项顶层
通过、零失败；两个可选外部夹具 `TestArtifactCorpus` 与
`TestPublishedRuleSourceProvenance` 明确保留跳过状态，不宣称已执行对应语料或
来源验证。

修正完整实际 Hugo 日志为
`4eb1a2afdce2adbe570b10922fd53b6d8954f7c95747370c3c661e94d2f71a05`；
Go 日志 `ea59463e9649ffe2f8aff9da66c91cf6895c86fde96a524db23c89cd4eb35925`，
核心 race `cdd3d761b5ca7b5e986b25aee3129d65663e3e5ebb83eecb6fbb080387298a58`，
公共 race `bb610bdcd7a299cb9b66f4c69e30e246c20546efae47653c01d350b1026ea2de`。
前述修正浏览器专项证据继续绑定相同当前源码及二进制。独立授权的新四消费者
试验正在执行；不由这些归属门禁推断完成语料、规范渲染、R8/A17 接受或最终
A18 验证。

前述 434 项通过与两个可选跳过是顶层计数。同次完整调用还跳过嵌套 Unix
socket 拒绝夹具，原因是 Darwin 临时路径超过 socket 限制。首次缩短私有路径
试验仍跳过：收据
`93106854ca890b497d3c74522b895f597ac60cec55ced42cad7b187d334da200`
保留进程退出 `0`，但明确记录未实际执行 socket、验证失败，不改称夹具通过。

后续不解析别名的短私有 `TMPDIR` 在 race 下实际执行相同冻结 socket 夹具，
没有跳过，`0`/2.954 秒。收据
`531a503b3b91e1b423c2be61b92ed806d3a813738c38d57e5ec122577b4337f9`
与日志 `236c84f1842ffce76174c834f3888718a109cec6377ada6f3242b02f551f00b3`
绑定 `fb276500…02949f`，全部 123/212 逻辑/物理/Git 输入前后不变。这补充实际
socket 拒绝用例，没有改动源码或原始完整调用跳过历史。语料、规范渲染、R8/A17
阶段接受及最终 A18 仍待完成。

前述语料待完成陈述记录各自观察时点。随后，修正四消费者试验于 845.705 秒
完成。摘要
`af4fc53326163c4a03aa2982c1f01363fbbdd5a447c9baed3639bd8599d46370`
与验证收据
`4d6fd02543c1920497e1a1bb0a68fcf89b0546130fd9cc12c1df391b7e673e75`
绑定逐字节相同私有重建 `bd25f9e0…22c3d71`、完整受控
123/`cdf629ee…feb1c17` 运行时及 212/`f6e305e7…5183e579` 输入。原失败语料、
发布缓存回归与首次冻结浏览器/门禁字节保持独立历史证据；首次失败试验全部
2,383 项准确保留字节/完整模式/类型。

| 修正消费者 | 原生当前及原生候选退出 | API 候选结果 | 完整诊断/覆盖 | 实际选定分析 HTML |
| --- | --- | --- | --- | --- |
| Starter | `0` / `0` | `0` | `28` / `29` | `200`，48,149 字节，`/blog/design/content-model/` |
| 文档 | `0` / `0` | `0` | `144` / `34` | `200`，61,738 字节，`/blog/oink/immersive-reading/` |
| PIG | `0` / `0` | `0` | `120` / `41` | `200`，55,641 字节，`/404/` |
| 仓库 | `1` / `1` | `2` | `11,250` / `29` | `200`，92,352 字节，`/blog/infra/2020-12/` |

这些是独立、明确不可发布 draft/future/expired 候选视图中的实际选定 Hugo HTML
路由，预期候选 marker 均存在。API 与 CLI 的完整类型化诊断/覆盖、原生退出、
计划 ID、Base/After 哈希及完整模式、unified diff 和选定页面提议源码一致。
完整准确 API 审阅及其哈希独立验证。
没有消费者 Apply 或保存计划，没有遗留监听器。仓库保留 10,462 条已有重复 ID
发现和 788 条信息记录，四个实际 PRINT 输出仍为必需局部预览未完成：
`_print/pkg/index.html` 73,976,221 字节、
`_print/pkg/pgsql/index.html` 69,903,999 字节、
`zh/_print/pkg/index.html` 73,086,240 字节、
`zh/_print/pkg/pgsql/index.html` 69,052,754 字节。每次有界 HEAD 请求均返回
`413`、正文为零，选定限内 HTML 保持 `200`。原生 `1` 未改动，提议/会话 `2`
及拒绝 Apply 保持可见。其余三站完整预览不编造显式完整覆盖行，而以实际受保护
HTML `200` 作为证据。

准确 53 次受保护操作每次检查全部四站：212 次逐操作源码证明加四次整体证明，
源码字节/完整模式/类型、复制的忽略输入、目录及逻辑/可变 Git 均未改变。每次源码
证明比较四类清单，因此含整体比较共 864 对原始清单。全部 53 次根目录保护及
最终完整 123/212 逻辑/物理输入也相同。所有 issues 与 pages 分页遍历，其他五个
视图端点仅取前 50 项，每站一个已知源码及一个有界 diff。完整原生/CLI 记录
一致性使用已声明有界完整记录 codec；对象顺序规范化，数组顺序、类型、null 和
字段存在性仍有意义。不宣称已人工查看每条关系或编辑每个源码文件。

独立审计收据
`6b72ca06d8392a5271fc40757f176f26e1144c21eec93dbd035e0a1bd645657b`
验证 69 项产物哈希、完整有界 API/spool/关闭类型化记录及大型原生/CLI 原始文件
摘要绑定，没有单独重复数 GB 原生语义扫描。追加收据
`335f137663d4ec0b2a0d3e49c8d70b9918f86078ab6264855171a2644d8aa6c6`
还把当前根目录完整逻辑 Git 清单与冻结重新验证，原审计保持不可变。修正归属、
socket、浏览器及四消费者受支持范围已验证。规范 TEN 晋升/渲染、R8/A17 阶段
决策及最终 A18 仍待完成。

前述 R8 候选/试验陈述保留各自捕获时范围。随后，经审阅首次 TEN 晋升通过
受保护保留 inode 安装器，根收据为
`7cd9b4604d2340b9e46965a26281c921b967060909d518b8b4b31e5f42d0120c`。
实际原源码 inode 保留在文档站外；未选中源码/复制输入、目录和 Git，以及完整
CLI 123/212 逻辑/物理输入保持不变。

独立授权规范渲染随后仅执行一次，于 67.21 秒完成，摘要为
`bb0d0710294f810fb14284f7b5b0329befbd290b66c21397b9a45e8382287fb6`，
验证收据为
`32d3ffeca43bc9ad4615edcca0d3cc47cc932bbc93c6576724c800e0a62405b1`。
它使用准确已验证 `bd25f9e0…22c3d71` 二进制及修正 123/212 冻结。实际 CLI 生产
链接通过 `0`，只有一次严格 Hugo 构建。独立普通无探针生产 Hugo/Markdown/链接
通过：214 个 Markdown 页面/44,691 个节点，以及 345 个链接页面/48,532 条内部
引用/4,351 个片段。生产翻译归属仅因已有 `release/1.2.0` draft 不在生产而保持
`1`。独立明确不可发布 draft/future/expired Hugo 分析的 Markdown（216 页面/
44,997 节点）、链接（347 页面/48,908 引用/4,379 片段）及全部翻译均通过 `0`。
分析没有替换生产输出。

源码翻译通过 137/137 对、1,143 个标题；中文样式通过 137 文件/181 个加粗区间/
零强调，空白通过，Schema SHA-256
`7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda`
准确相同。全部 12 个命令、Schema 及整体保护保持 421 个主源码文件、427 个复制
输入、109 个目录和 36 个可变 Git 文件，以及全部 123 运行时/212 更广 CLI
逻辑/物理输入不变。验证收据绑定 60 对规范清单、15 对 CLI 保护及六对私有复制
源码，不宣称消费者写入或部署。

R8/A17 受支持本地编辑范围在修正归属、socket、源码绑定浏览器、精确二进制
四消费者保护及这些受保护规范门禁后已接受。R1–R8 已本地接受；仓库原生发现及
必需局部预览 `2`/拒绝 Apply 保持可见。最终 A18 当前 Linux/运行时/归档验证仍
未完成。独立平台权限依据审计
`762571dab9a07651ac8e4c71764bfef292f8d5eba729a089e72d9d755b7e2d7c`
确认初始契约验证实际执行架构：macOS arm64、原生 Linux arm64 与模拟 Linux
amd64。Darwin amd64 保持实验归档，实际执行失败/运行时未验证；历史保持不变，
交叉编译成功不能成为运行通过。两种当前 Linux 运行时与最终归档仍须新证明。

本次渲染后状态/证据增补独立保护完整字节/完整模式和 inode，稳定 ID/命令围栏
不变，并有双语源码检查和保留 inode 安装器夹具。新增字节没有经前述 67.21 秒
运行渲染；不推断重复渲染、消费者源码写入、公开发布、采用或部署。

### 必需门禁矩阵 {#r8-pending-gates}

| 必需门禁 | 当前状态 |
| --- | --- |
| 最终不可变运行时/源码冻结与准确 CLI 二进制 | 修正完整冻结 123/212 与 `bd25f9e0…22c3d71` 绑定完整归属/浏览器/语料/规范范围；首次冻结试验保持独立 |
| 公共 CLI/JSON/退出、过期源码/配置/外部输入及保护写入器测试 | 修正公共 R8/附件/输出 helper race、完整 Go/vet/实际 Hugo 及规范阶段门禁通过 |
| 冻结完整 Go/race/vet 与选定应用后实际 Hugo/普通 Hugo | 修正完整 Go/vet/实际 Hugo 及核心/公共 race 通过；434 项顶层通过、零失败、两个可选外部夹具跳过明示，首次试验保持独立 |
| Editor 浏览器五视图一致、文本/表单/组件/二进制附件、准确数值/no-op、过期拒绝及预览隔离 | 修正二进制源码绑定 Editor 12 项 axe 零违规/12 截图及只读 14/零/14 通过；已绑定完成语料与规范接受 |
| 准确二进制四消费者只读验证 | 修正全四站于 845.705 秒完成；完整类型化原生/API/CLI 候选一致，212 次逐操作源码证明加四次整体，无 Apply/保存/源码写入；首次失败试验保留 |
| 受保护规范 TEN 晋升、中英文源码/schema/样式/空白及实际生产/分析渲染 | 受保护首次晋升与独立准确二进制 67.21 秒渲染通过；生产仅保留已知 draft 翻译遗漏；渲染字节与本次状态字节分别绑定 |
| R8/A17 阶段决策 | 受支持本地范围在修正完整归属/浏览器/语料/规范门禁后接受；R1–R8 已本地接受 |
| 最终 A18/平台/归档交付 | 未完成；仅编译成功不构成运行时验证 |

通过与待完成条目明确列出，不推断后续门禁成功。先前 R1–R7 节、完整调用失败及限定接受
收据保持不变。临时验收文件留在规范内容和 Git 外；首次规范晋升与渲染已有准确收据，但本次状态增补仍为受保护提议，
不宣称公开发布或部署。

## 2026-10-04 当前运行时完成增补 {#a18}

本增补记录 2026-10-04（Asia/Shanghai）的当前候选。带日期页面 URL 与初始
2026-10-03/R1–R7 记录保持不变。此前 R8 阶段及浏览器/渲染收据只证明各自冻结
输入，不验证后来变动的后端字节。三个 UI 文件与已通过浏览器验证的字节/完整模式
准确相同；当前 Go、Hugo、平台、归档与四消费者检查刷新变动后端。

首次当前 ARM 离线单元运行发现真实产物复制完整性缺口：ext4 上增加目录项时，
父目录分配大小和实际观察时间戳可能不变。该失败运行在后续验收前停止。有界
修正捕获并重新验证实际排序目录成员及项身份，同时保留常规文件字节/完整模式
证明。仅 `internal/app/studio_output.go` 与其归属测试变更。失败收据和独立审计
保留，失败运行不会改标为通过。

前一完整性修正验收的完整冻结为 `683daca0e522193c7ff1b0de6ac2fee5d2fca080811bf184a8dfd5b90a33f224`：
123 个运行输入哈希为 `d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`，
212 个完整 CLI 输入哈希为 `2abd1a044d8192b07f9bbc06b55dc8b4544d66ca17b8867971cec702ba3af088`。
`0.5.0-r8-local` Darwin arm64 候选为
`74ad94e73557f6538cd64edd1766d6df92c596d98411031159d94af072c186ec`。
下列已观察的完整性修正收据绑定前一源码范围；旧 R2 Linux 与此前 R8 二进制收据保持历史范围。
后续单个归属夹具修改具有独立完整源码身份和已完成的正式验收边界，如下记录。

当前完整源码冻结现为
`196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`。
123 个运行时输入准确保持
`d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`；
212 个完整 CLI 输入为
`2c487bfb4c65ed40ff78356b2860de627e6ac1afa0da2df433b09345dab7f5b0`。
只修改发布缓存归属测试，其源码为 `54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`。
夹具修改有独立保护，生产字节与全部语义断言保持不变。该完整源码的八项当前
归属门禁、刷新归档与完整 plain-Go AMD/ARM 正式验收已通过。根 A18 证明
`2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` 绑定全部三个声明支持目标与五份复现归档。此前收据保持自身捕获范围，
不改称新测试源码的运行。

| 当前证明与保留的此前输入边界 | 已观察结果与绑定收据 |
| --- | --- |
| 新完整源码的正式验收 | 冻结 `196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`、归属测试 `54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`、运行时 123 个输入未变。当前八门禁、host/归档及完整 plain-Go 双 Linux 流程通过，由根 A18 证明 `2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` 绑定；不宣称最终文档字节已渲染 |
| 有界完整性修正 | 归属收据 `6966d768025497b45958073d4c53a2a2981065c8a95857834dcf6a4faa4f0201`；独立审计 `6cb5d2eabf57b41079026a38a674f46def9f56a15df17ad27e671e4f765798df` |
| 前一源码六项归属门禁 | 构建、完整离线 Go 单元/vet、完整实际 Hugo/固定工具、核心 race 与公共 R8/输出 helper race 均为 `0`；耗时 3.501/68.257/3.909/333.801/37.070/79.670 秒。汇总 `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`；独立审计 `20780662b7ff35019b2c8c84e6dc763f9351ae0816f6ef7a7789f7a15be99167` |
| 八项当前冻结归属门禁 | 发布缓存实际 Hugo 与 race、构建、完整离线单元/vet、完整实际 Hugo/固定工具、核心 race 与公共 R8/输出 helper race 均为 `0`。当前汇总 `d6272fcc4dfab114aecfcdf19a7e2b78f1e931817331b460f43ff2056bf754a4`；完整 Hugo 原始记录 435 项顶层通过、零失败、两项可选顶层跳过及明确长路径 socket 子项跳过，运行时/二进制字节未变 |
| 前一源码 Darwin arm64 与归档 | 当前提取候选在 checkout 外运行，无消费者 Node 要求。17 个命令和八项实际进程测试（含子进程信号）通过，进程测试无跳过。两个新 release 目录中的五份归档/校验和字节相同，源码/许可证/来源/规范 tar 验证通过。汇总 `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1`；独立审计 `60a04771365d8be15ac91fbbd8d485b019aae081598e468018861ca5734e387c` |
| 当前 Darwin arm64 与确定归档 | 17 项提取归档/普通 Hugo/进程命令达到预期退出，缺少 Hugo 明确为 `2`；八项实际信号/进程案例无跳过。两个独立新构建从当前完整源码复现五份字节相同归档。汇总 `3890fd8468b6bce5271bb32ffa1a18bd5daf99c19c43becac0be8e3b908a5d57`；源码、工具、模块缓存与 smoke 源码保护准确一致 |
| 前一源码 Linux arm64 | 在 ext4 上以非 root 用户实际运行 Linux arm64，Go 1.27.1、Hugo Extended 0.166.0、Git 2.47.3：完整离线 Go 单元/vet、13 项必需纯测试顶层通过记录，目录成员项及四个子项无跳过、10 项选定实际 Hugo（无跳过）、原生重构归档身份、安装后二语言/离线/普通 Hugo/缺少 Hugo 为 `2` 的 JSON 与信号/源码模式检查均通过。guest 汇总 `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7`；外层收据 `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898`；导出记录审计 `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` |
| 当前 Linux arm64 | 当前 Linux arm64 在 ext4 上以非 root 用户实测（QEMU HVF 原生 ARM），Go1.27.1/HugoExtended0.166.0/Git2.47.3：完整离线单元/vet（370 项顶层通过）、13 项决定性纯测试及四项成员子项无跳过、10 项选定实际 Hugo 无跳过、当前归档原生/安装字节身份、双语/离线/普通 Hugo/信号流程通过。24 命令达到预期退出，含缺少 Hugo 为2。guest `268102f69c0950f9d2994d22cd2fd290fc11e24bd6d6f916fd70a93ca4946c74`；外层 `f3c066fdc9b97feff92160346185a1af978a5172eed5c81904ac7c0e5fc6c982`；源码/SDK/借用输入/旧任务保护准确一致，独占 VM 回收。默认可选单元跳过保留具名门控原因，不宣称完整 Linux Hugo 套件/浏览器/linter |
| 前一源码 Linux amd64 失败试验 | 当前 TCG 试验失败，尚未完成验证；原外层收据 `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`、guest 汇总 `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240` 保持不变。完整离线单元（370 项顶层通过）、vet 和前三项选定 Hugo 案例通过；发布缓存候选请求触发测试 HTTP 客户端的 90 秒截止时间，候选一致性、其余六项选定 Hugo、原生重构归档及安装归档 smoke 尚未执行。截止时间审查 `12917b9eb89e3abc5893e08da3b6b6e20743dcb4c14e6f7ba8561628e3566934`。A18 未关闭，不推断后续 preflight 或完整验收结果 |
| 当前 Linux amd64 | 当前 Linux amd64 在 ext4 上以非 root 用户实测（QEMU TCG 模拟），Go1.27.1/HugoExtended0.166.0/Git2.47.3：完整离线单元/vet（370 项顶层通过）、13 项决定性纯测试及四项成员子项无跳过、10 项选定实际 Hugo 无跳过、当前归档原生/安装字节身份、双语/离线/普通 Hugo/信号流程通过。49 命令达到预期退出，含缺少 Hugo 为2。guest `3a1a32979efc843de8b95b7c13824026e17f71c06d4c458b738c0b9583fb4723`；外层 `30cf4950cc83fa0732047d9a0f89bb59e68779ee2e8f5c755724c9679be265e3`；源码/SDK/借用输入/旧任务保护准确一致，独占 VM 回收。默认可选单元跳过保留具名门控原因，不宣称完整 Linux Hugo 套件/浏览器/linter |
| 运行时等价的此前四消费者候选语料 | 源码时期 `683daca0…33f224`；运行时 123/二进制 74ad 与当前 `196245a3…42d43` 字节相同，单测试修改后未重跑语料。853.249 秒；原生/候选原生 `0/0/0/1`，API/视图 `0/0/0/2`；诊断 `28/144/120/11250`、覆盖 `29/34/41/29`。汇总 `a1e98ca3e10095a1134381666bacf256f8e8827cd3900c9e811b7120de4c2974`、收据 `05c4562a50d9f83ba2c99879ec841870c5e753199e41792bd5bc718cf8046e7b`、独立审计 `3a1b0b6e3a8c6b1a0d82c5f82b46c84b1e44d6c30bab655610cb9e86e6a30b47`；最终 TEN 字节具有独立渲染边界 |
| 最终规范生命周期与渲染检查 | 准确晋升 TEN 字节需要独立规范渲染及导航/URL 收据，此前渲染证明不验证这些修订字节 |

此前六门禁 `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`、host/归档 `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1` 与 ARM 外层 `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898` / guest `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7` / 审计 `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` 仅验证自身捕获源码，与新准确源码证明共同保留，不覆盖或改称新结果。历史 26 项 axe/截图与 22 项 codec 案例依据未变 UI/codec/运行时输入复用，不宣称重新执行。

首次 `max` CPU 的 AMD 试验保持失败：收据 `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`、guest 汇总 `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240`。测试客户端等待候选响应头 90 秒后超时，候选一致性、其余六项选定 Hugo、原生重构/安装 smoke 未执行。guest 输入保持准确；host 保护只记录 `.git` 目录时间戳变化，原因未证明。独立 qemu64 单案例 preflight 也在未变更的 90 秒 HTTP 客户端截止时间失败：外层收据 `fc68173ccdfd8ce263ecdf082a533d9da666a4cc2e1e5e29880ee827286132ac`、guest 汇总 `e350ff65feeee166ffac1d337db9bbd70d3895b1fb6d93df0a30ca4de09019fc`。具名案例耗时 177.71 秒，首次为 176.64 秒，不能推断 CPU 模型提速。其输入准确保留、VM 已回收；两次失败均不改称通过。

随后明确不构成验收的 Go overlay 诊断保留相同生产源码与全部原语义断言。
外层收据 `0bc6d563b7cd9ca862717c2123ee0836d83b6b927d00204a0b031049c38e93f0`
与原始记录绑定分类
`66a1422cdb79ab9f1cf683f441ade0ce4adb4a7a666d524c4b9ed98ebee28708`
记录具名案例在 352.40 秒内通过。原始捕获耗时 26.254 秒、Studio 捕获 26.211、
候选 HTTP 94.312、直接预览 94.318、CLI 预览 81.962。两份图均保留 1,256 个
唯一输入，其中模块输入 1,198 个。HTTP 返回时旧的原始捕获 context 已过期；
独立的新直接/CLI context 正常完成。全部 20,564 项 host 保护与五对 guest 命令
保护准确一致，独占 VM 正常回收。该诊断改变测试预算，不构成准确源码或完整
A18 验收。限定归属夹具修改现为该候选请求及独立直接/CLI 操作各提供 300 秒，
约为已观察最慢操作的 3.18 倍。一般/原始捕获 90 秒限制、共享客户端恢复、
15 秒 shutdown 与 Go 默认十分钟上限不变。这是测试夹具上限，不是产品性能 SLA。
正式 plain-Go AMD/ARM 与当前归档验收归上表当前记录；该诊断本身仍不构成验收。

前次语料验证未变更的运行时 CLI 与所捕获、未变更的最终 TEN 修订前消费者输入，不验证
随后修改的规范文档字节；最终 TEN 有独立渲染收据边界。

消费者 driver 比较 API 与 CLI 的完整类型化诊断、覆盖、原生退出、PlanID、所选
Base/After/完整模式、统一 diff 与所选源码，另外独立验证完整字面 API 审阅及其
哈希。附件和 no-op 的所选页面保持审阅 Base，页面文件编辑匹配审阅 After。
非问题视图为有界样本，所有问题/页面分页读取。53 个保护操作具有 212 次全四站
逐操作源码证明与四次整体证明（四种清单类别共 864 对原始清单），以及 53 对
根清单。绑定 71 份保留产物。没有 Apply、保存计划或消费者写入。已完成语料的
纯文件 collector 因旧试验/self-test 文件不在新目录而保留两次元数据修正；未重跑
CLI/Hugo 操作。现有 22 个负向 codec 案例是相同 codec 字节的历史检查，不能
宣称本轮新执行 self-test。

仓库保留 10,462 项已有重复 ID 发现和 788 项审阅信息。所选实际 DFE HTML 可用，
四份过大实际 PRINT 文件保持不服务（`413`，响应正文零字节）：
`_print/pkg/index.html` 73,976,221 字节、`_print/pkg/pgsql/index.html` 69,903,999、
`zh/_print/pkg/index.html` 73,086,240、`zh/_print/pkg/pgsql/index.html` 69,052,754。
逐文件 64 MiB 预览上限不变：必需局部预览未完成仍为 `2`，原生发现仍为 `1`，
Apply 被拒绝。这是预期诊断结果，不是保护检查失败。

Linux 前置条件在独占私有 guest 中依据签名 Debian 元数据预备：准确十个新包和
三个获准既有包升级，安装前后均验证。SDK/Hugo/模块缓存独立供应后离线复用。
验收在 ext4 上以普通用户运行，缓存输入及全部 212 个源码文件的字节/完整模式受保护。
缺少前置工具的 guest 不隐含可选工具/浏览器通过：默认单元跳过保留实际门控或
不适用原因，所有必需纯测试顶层、无跳过目录成员子项、选定 Hugo 与信号案例必须执行。Linux amd64 在
ARM 主机上通过 QEMU TCG 明确模拟。Darwin amd64 保持实验归档：实际执行
返回 Bad CPU type（errno 86），没有安装 Rosetta 或宣称受支持运行时。Windows
不在声明范围。

当前 Linux 归档摘要为 `ac883e54a1df0b820696279c63881ba75a00d279f507330128fe8d5aff59c52e`
（arm64，4,552,687 字节）与 `2dde43bf94ef35aac2111b07dcb9b2766fbf9f883fe39ccd646d14a98b94d734`
（amd64，5,034,668 字节）。此前 `683daca0…33f224` 的摘要
`c191383af21913be6940ec41be11755b3d985344bbc0f65cc3f5de16424a96a4` 与
`6531b27d889260afe804c1f49f37541fbae46e57b5d17a20178c28cb51968794` 保持历史范围。交叉编译本身不证明运行支持。SDK/guest 准备失败、
首次 ext4 成员检查失败及此前私有 host 元数据/resources 试验保持不可变证据。
本地完成不建立提交、公开版本、消费者采用、托管 CI 执行、部署或公网站点验证。
未启动 E1–E4 是独立非活动范围，不使有限 R1–R8 完成保持未决。

## 验收用例台账 {#cases}

下表结合初始审计、已接受 R1–R7 证据与已验证 R8 候选门禁。
每个完整用例只有在全部结果记录后才能关闭；
已验收阶段不关闭后续阶段范围。

| 用例 | 所需结果 | 代码或检查证据 | 状态与缺少的决定性证据 |
| --- | --- | --- | --- |
| A01 | 单个 `oink.result/v1` JSON；stderr 日志；政策为 `1`，必需未完成为 `2` |协议/公共 R1–R8 命令、冻结归属测试及精确二进制 CLI/API 报告；未改变结果 Schema；当前八项归属门禁/Linux 验收与未变运行时复用的此前语料见 #a18 | 受支持当前命令范围通过；后续新增命令需要自身证据 |
| A02 | Hugo 解析 slug/url/permalinks/aliases、挂载、未列出页面和语言根 | 真实 PageFacts/manifest/自定义挂载/translationKey 夹具；普通产物保留；最终消费站事实 | R1 范围通过；后续阶段使用这些事实仍须自身验收 |
| A03 | 确定本地缺失路由失败；真实分类 origin/path 外引用和声明外部范围 | 真实产物引用夹具、子路径/政策回归及最终真实站点 | 所需 A03 范围通过；外链可访问性仍明确未检查 |
| A04 | 文件名、目录和 `translationKey`；重复/缺失/草稿；严格/本地化政策 | R2 翻译引擎、真实 Hugo/公共命令、最终报告和数值补充 | 所需 R2 范围通过 |
| A05 | 无记录为未知；源/译文哈希变化可见；不依赖 mtime | R2 哈希/status/diff、公共预览/应用和最终报告 | 所需 R2 范围通过 |
| A06 | 真实围栏、行内代码、短代码、HTML、属性、未知字段和受保护文本边界 | R2 真实语法/来源夹具、经审阅语料和最终报告 | 所需 R2 范围通过；目录及不支持源码限制仍明确 |
| A07 | 已确认问题可见；新问题按政策阻断；必需工具缺失不能通过 | R2 基线/公共计划；R6 假/实际协议、缺失/不安全/离线/网络不确定及必需优先级夹具通过 | 受支持范围通过；必需不可用/不确定工具保持 `2` |
| A08 | 检查后字节变化使 manifest 无效；服务商上传已验证树而不再次构建 | R3 manifest/导出/篡改/公共单构建测试，最终普通 Hugo 对比及服务商演练 | 所需 R3 本地范围通过；未执行服务商上传 |
| A09 | 两种 CI 模板；保留定制工作流；权限/变量/来源和过期计划保护 | R3 离线生成/bootstrap、公共预览/应用/过期输入、定制工作流补充及本地演练 | 所需 R3 本地范围通过；定制工作流未知且不变，未运行托管 CI |
| A10 | 拒绝 HTTP 200 回退、错误语言/构建、缺失资源/canonical 差异；超时/认证/限流为未完成 | R3 显式联网本地 HTTP 和公共结果夹具，含必需身份缺失 | 所需 R3 夹具范围通过；未验证公开部署或浏览器运行 |
| A11 | 所有声明配置/语言；目标保护；普通 Hugo；保留未知编辑器设置 | R4 24 次普通 Hugo/公共配置、完整 Starter 创作/编辑器流程、片段、实际挂载、来源身份、JSONC 保护与外部 Schema 重新证明 | 所需受支持 R4 本地实现/语料范围通过；已声明不支持编辑器输入仍明确 |
| A12 | 可读 diff 和路由比较；脏文件/workspace/replacement/vendor；恢复/并发 | 冻结真实 Hugo 七个固定合成模块用例、公共升级、源码/外部保护、实际 alias 改指向与受保护部分回滚 | 所需有界 R4 本地实现/语料范围通过；未知重定向/多主机仍未完成，不宣称自动配置迁移 |
| A13 | 删除 B 找到未改入站 A；翻译/附件/派生产物；全局全量范围 | R5 已提交 Git/实际 Hugo 删除、alias 入站、全局/不确定输入和不可用基线夹具；精确二进制消费者报告 | 所需受支持 R5 范围通过；不可用或未证明历史输入明确为 `2` |
| A14 | 应用前候选；过期/哈希/写入失败保留后续编辑；含糊引用不变 |R2/R4 共享保护、R5 完整模式/清单移动及 R8 重新生成意图/新输入候选验证、保护写入器及过期/后续编辑/附件测试；当前八项归属门禁/Linux 验收与未变运行时复用的此前语料见 #a18 | 受支持 R5 CLI 与 R8 CLI/Studio 编辑范围通过；含糊或必需不可用输入仍阻断 |
| A15 | 工作区/直接一致；只写选定站；上下文受限且有路径/版本/原因；不执行内容 | R5 有界捕获源码/context 夹具与四站查询；R6 登记/直接/汇总一致及显式名称保存应用、其他站保留 | 受支持 context/工作区范围通过；无隐式批量写入 |
| A16 | 五个实用 CLI 一致视图；键盘/移动端/深浅色；来源/预览隔离 |已接受 R7 证据保留；历史源码绑定 R8 只读 14 项 axe/截图及 Editor 12 项 axe/截图，UI 字节未变；当前后端门禁、ARM 与语料独立验证、原生/API 一致、预览隔离、四消费者及规范渲染通过；当前八项归属门禁/Linux 验收与未变运行时复用的此前语料见 #a18 | 受支持本地视图通过；必需局部预览未完成/原生发现仍可见；不宣称通用浏览器/平台认证 |
| A17 | 无修改字节；YAML 未知/注释/顺序保留；拒绝过期保存和附件冲突 |修正冻结核心/公共/保护写入器 race、实际 Hugo/工具、源码绑定 Editor/只读浏览器、精确二进制四消费者提议一致性/保护及受保护规范源码/渲染在 #r8 通过；当前八项归属门禁/Linux 验收与未变运行时复用的此前语料见 #a18 | 受支持本地编辑范围通过；必需局部预览/原生发现仍阻断 Apply；最终 A18 独立 |
| A18 | 实测声明 macOS/Linux 环境、子进程信号、已供应离线运行与明确不支持输入 | 当前冻结/源码与五归档重复复现；Darwin arm64、原生 Linux arm64、模拟 Linux amd64 非 root ext4/完整离线单元-vet/选定 Hugo/原生归档/信号 smoke 在 #a18 通过 | 当前声明运行时/归档范围通过；可选 guest 前置条件保持明确跳过；Darwin amd64 实验/未验证，Windows 不在范围 |

## 候选站点与源码保护 {#sites}

选定验收输入为内嵌 Starter 和三个不同的维护中消费站，复用历史语料但不写入消费站源码。
Starter 源 checkout 是来源输入；生成的配置试验使用临时目录。

| 同级 checkout 布局中的输入 | 初始观察身份与用途 | 本轮候选验收 |
| --- | --- | --- |
| `oink-starter` / 生成 Starter | 源码 `137843b`，初始状态两项；有许可证的固定归档，语言/配置/根路径/子路径试验 | R1 双语 init/check 与 R4 全配置普通/公共创作流程通过；归档/许可证不变 |
| `oink.pgsty.com` | 源码 `907d873` 和已有修改；双语文档/回归与显式本地主题试验 | 最终 R1 检查与源码保护通过；本地主题证据仍与公开固定版本分开 |
| `pig.pgsty.com` | 源码 `75050c0`，初始状态五项；Docs/Blog 根路由重写、不渲染侧栏条目；声明 v1.1.0 | 最终 R1 检查与源码保护通过 |
| `repo.pgsty.com` | 未产生提交的 `main`，无 HEAD revision；已物化的未跟踪源码、生成目录和声明的 v1.1.0 | 最终 R1 检查与源码保护通过；revision 仍未知 |

每次运行记录有效模块来源和版本、参数/网络政策、退出码/结果/覆盖、原始证据位置和保护结果。
前后清单必须包含所有 tracked 和未被忽略的 untracked 源码字节与模式、Git 状态/index、
workspace/replacement 文件及有效 vendor 输入。比较精确清单；文件数相同不能证明保留。
报告、隔离候选、产物和缓存放在消费站源码外，并保持不入 Git。
承诺增量速度前，全量构建耗时必须基于同一份当前输入比较。

## 归属检查与文档验收 {#checks}

先执行最小受影响 Go 包和公共行为测试。仓库现有门槛为 `make test`（离线测试和 vet）
及 `make test-hugo`（真实 Hugo Starter、快照、manifest 与公共命令夹具）。
归属 Hugo 门禁现运行全部归属包，不再使用旧的窄测试名称过滤器；新增夹具必须保持在门禁中。
并发计划/服务修改在归属测试需要时使用 race 检查。单元夹具保持离线，联网须显式调用。

文档保留中英文标题数量、顺序和稳定显式 ID。最小源码检查为：

```sh
node scripts/check-markdown-style.mjs content/docs/design/research
node scripts/check-doc-translations.mjs
```

添加本记录及中文对应文件后，两项源码检查均通过：八个中文研究文件通过风格检查；
翻译源码覆盖为 137/137 组，共检查 1,082 个源码标题。
这些检查只证明源码风格、配对和中文显式 ID；此次文档审计没有执行产物验收。

构建相关站点后，完成产物文档验收：

```sh
npm run _check:markdown-style
npm run _check:translations
npm run _check:rendered-markdown
npm run _check:rendered-links
```

`make build` 验证声明的公开固定版本；`make check` 选用同级主题执行完整非浏览器回归套件。
两种输入不能互相替代。Studio 需要自身的真实浏览器和无障碍验收。
文案源码检查通过不能证明双语渲染输出或 Studio 交互。

## 交付状态与剩余限制 {#delivery}

| 状态 | 当前完成证据，历史保留于上文 |
| --- | --- |
| 本地实现 | 有限 R1–R8 受支持实现本地完成，包含只读 Studio 与显式受审阅编辑；当前 A18 运行时/归档通过。规范生命周期渲染独立绑定这些准确字节 |
| 本地验证 | 历史 R1–R8 归属/浏览器/语料/渲染记录保留；2026-10-04 当前后端修正和八项当前归属门禁、三个实际目标运行时/归档，以及运行时未变的此前四消费者保护/一致性证据复用在 #a18 通过。必需仓库发现/局部预览保持可见。渲染导航/URL 检查具有独立准确字节收据边界 |
| 提交 | 已识别 CLI 基线提交；本记录未建立维护提交证据 |
| 归档与运行环境验收 | 当前修正源码：Darwin arm64、原生 Linux arm64 与 QEMU TCG 模拟 Linux amd64 的安装归档/离线/信号/文件系统流程通过，两个新构建复现全部五归档；Darwin amd64 实际执行失败，保持实验/未验证 |
| 公开分发与消费站采用 | 本轮未执行 |
| 部署与公网内容验证 | 本轮未执行；本地 HTTP 夹具可在无云凭据时证明验证器 |

有限 R1–R8 实现与必需当前 A01–A18 运行时/归档范围已有决定性本地证据。
规范生命周期渲染需要这些准确新文档字节的独立收据，此前渲染证据不证明新字节。
未启动 E1–E4 和实验/
不支持平台不增加未完成核心要求。公开发布、推送、部署、托管 CI 和消费者写入
保持独立未执行；已知仓库发现及必需预览未完成是诊断限制，不隐含通过。
