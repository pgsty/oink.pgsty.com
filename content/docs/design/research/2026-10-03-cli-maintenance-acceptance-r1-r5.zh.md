---
title: 2026-10-03 CLI 维护验收：R1–R5
linkTitle: 2026-10-03 CLI 维护 · R1–R5
description: 带日期的 CLI 维护记录中 R1–R5 的本地验证与验收证据。
weight: 56
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] 属于[CLI 维护验收记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
> 带日期记录中的 R1–R5 小节于 2026-11-06 原样迁移至此，使每个页面都能被完整读取。
> 范围、证据规则、验收案例台账与交付状态仍保留在主页面。

## R1 本地验证 {#r1}

R1 现已提供共享 Hugo 页面/翻译/来源事实、产物引用与锚点证据、严格
`oink.policy/v1` 输入、`check links`、`--format json`、可见的经审阅排除/外部范围，
以及必需工作优先级。翻译和风格选择明确报告必需但不支持的覆盖。
默认 build/dev 继续直接调用 Hugo。

| 需求 | 已执行证据 | 当前结果 |
| --- | --- | --- |
| 公共结果/政策与未完成优先级 | `make test`：所有包与 vet；公共严重度/排除/未实现分组/JSON 别名测试；`TestEveryRequiredUncompletedCoverageFails` | R1 范围通过；任何必需未完成状态（含 `not_checked`）仍为 `2` |
| 一次构建与共享事实 | `TestPublicCheckSharesOneBuildAndRenderedFacts` | 通过；一次严格 Hugo 构建提供页面和实际目标/锚点事实 |
| Hugo 权威与来源映射 | 真实 `TestPageFacts*` 夹具：translationKey、实际路由/别名、未知生成节点、自定义挂载、未发布页面分析及失败保护 | 通过；独立分析保留生产事实/产物字节及源码字节/模式 |
| 可复现真实 Hugo 验收 | 修正后的 `make test-hugo` 包含 `TestPageFacts*`、`TestHugoRendered*` 及 Starter/manifest 夹具 | 通过；覆盖范围内的路由/引用、经审阅外部范围和原始产物保留场景 |
| 新 Starter | 双语 `init`、`check links`，使用隔离且已供应的 v1.1.0 模块归档运行普通严格 Hugo | 退出码 `0`；223 个文件、4,461 个引用、66 个页面事实；依赖预备仍须显式进行 |
| R1 文档源码与 Schema | `content/docs` Markdown 风格；双语源码检查；CLI/文档结果 Schema JSON 解析及相同检查；限定 diff 空白检查 | 通过：88 个中文 docs、137/137 组源码、1,085 个标题；Schema 保持可增补的 `oink.result/v1` 和退出码 0/1/2 |
| 最终候选报告与中英文产物 | 刷新后的当前二进制下游站点报告；下文真实产物源码/Markdown/链接归属检查 | R1 范围通过；生产环境中已有草案发布页缺失单独记录 |

较早离线 R1 试验在三个下游站点上均返回 `0` 且无发现项：

| 较早试验 | 源文件 | 产物文件 | HTML 文件 | 引用 | 页面事实 | 字节/模式/Git 清单 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK 文档站 | 421 | 1,139 | 512 | 74,689 | 341 | 前后精确相同 |
| PIG 项目站 | 858 | 1,392 | 424 | 64,440 | 248 | 前后精确相同 |
| 软件仓库目录 | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | 前后精确相同 |
{.wide .expand}

这些较早报告把可选未选中覆盖写为 `not_selected`，不属于已有结果 Schema 的枚举值。
最终代码已修正为 `not_checked` 并包含 `project.pages` 覆盖。
原始证据保留在站点源码外、带任务名称的本地验收目录。

最终 R1 二进制由基于 `e623d93d589c49e5c58b8fae1bd5db720fc904cb` 的 CLI
工作树重新构建。记录的输入清单包含文件哈希、模式和 Git 状态身份，
按排序后的 JSON 序列化计算 SHA-256 为
`518260f07f3c916468ee3d56c4eeca03c131514155aa82539564ccd2f3c1f664`。
实际运行二进制 SHA-256 为
`3deb7e357fc86f6907df60da0769d93f2d41ba5e01949b641548a67d7f459d12`。

| 最终当前二进制试验 | 源文件 | 产物文件 | HTML 文件 | 引用 | 页面事实 | 验收 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK 文档站 | 421 | 1,139 | 512 | 74,755 | 341 | 退出码 `0`、结果有效、页面事实完整、源码字节/模式/Git 精确保留 |
| PIG 项目站 | 858 | 1,392 | 424 | 64,440 | 248 | 退出码 `0`、结果有效、页面事实完整、源码字节/模式/Git 精确保留 |
| 软件仓库目录 | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | 退出码 `0`、结果有效、页面事实完整、源码字节/模式/Git 精确保留 |
{.wide .expand}

最终结果均有必需的 `check.links: complete` 和 `project.pages: complete`。
未选中翻译/风格覆盖为可选的 `not_checked`。最终离线 `make test` 与 vet 通过，
修正后的真实 Hugo 归属目标也通过。记录的工具仍为 macOS arm64 上的 Go 1.27.1、
Hugo Extended 0.166.0、Git 2.54.0。编写本记录时独立比较了三个精确前后清单。

生产产物通过 Markdown 和链接检查。全站翻译检查返回 `1`，唯一原因是已有草稿
`content/blog/release/1.2.0.md` / `.zh.md` 没有进入生产产物。
R1 修改页面均已双语渲染。另一个显式分析构建将 `HUGO_BUILDDRAFTS`、
`HUGO_BUILDFUTURE` 和 `HUGO_BUILDEXPIRED` 设为 `true`，三项检查均通过：
137/137 组源码、1,085 个标题、产物 Markdown 与产物链接。

## R2 本地验收 {#r2}

本地候选已实现翻译策略、状态、diff、哈希审阅、有界原生内容规则、可见的经审阅基线，
以及共享 `oink.plan/v1` 预览、验证与应用。默认 `check` 要求链接、翻译和风格。
生产输出与显式草稿、未来和过期分析相互独立。稳定行为与示例见
[契约](/zh/docs/design/decisions/cli/#translations)。R2 本地门禁已通过对应检查、最终冻结输入
站点报告及生成的双语文档。下文分别记录实测二进制和后续有界相等比较修复。

| 需求 | 已执行归属证据 | 结果与限制 |
| --- | --- | --- |
| A04 翻译关系/策略 | 真实 `TestHugoFilenameDirectoryAndTranslationKeyLayouts`；范围、重复/缺失/禁用语言、草稿、严格/本地化和选定约束测试 | 归属测试通过；不要求全局标题、代码或本地化一致 |
| A05 显式审阅和 diff | 完整字节哈希/当前/源/译文/双方变化、不依赖 mtime、未知/不可读/含糊和错误记录；公开 status/diff/review 预览/应用 | 归属测试通过；审阅状态记录变更情况 |
| A06 源码边界和来源 | 真实 Hugo 规范 `title`/块属性开关和配置透传夹具；front matter/CRLF/BOM/短代码/代码/HTML；每个公开 v1.1.0 源码/许可证 SHA 验证 | 归属测试通过；不支持语法仍报未完成，自定义钩子不在目录检查范围内 |
| A07 基线范围 | 捕获/可见确认/新问题/未完成优先级及错误记录；公开基线预览/应用 | R2 基线范围通过；外部工具适配器验收归 R6 |
| A14 共享元数据计划 | 过期字节/模式/存在/保护条件；验证中编辑；排他提交碰撞；部分恢复；后续字节/模式/删除；旧打开 inode 写入；新目录子文件；范围/身份/diff | 归属测试与 vet 通过；拒绝候选/源码重叠；move/引用歧义仍归 R5 |
| 冻结运行门禁 | macOS arm64 `make test`/vet、归属真实 Hugo、聚焦 race | 通过；日志 `/tmp/oink-r2-frozen-go-gate.log`、`/tmp/oink-r2-frozen-hugo-gate.log`、`/tmp/oink-r2-frozen-race-gate.log`；最终全部归属包 Hugo 门禁 `/tmp/oink-r2-owning-hugo-final.log` 明确包含配置透传 |
| 双语文档 | 限定源码风格/配对/ID、相等结果 Schema、范围内空白及真实生产/分析 node 检查 | 范围门禁通过：88 份中文文档、137/137 源码配对、1,092 标题；生产草稿缺失在下文单独记录 |

冻结解析器语料位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-source-corpus-lqx25kwr/summary.json`，
解析器输入 SHA-256 为
`a601200ec4fe275d2bd4baf11d4db7d46a2cc6f1674900c1fd801769e55d12de`。
每项范围均完整解析且无问题项。核心范围使用已记录配置下 Hugo 实际站点源码身份；
补充 Markdown 包含禁用和未发布文件，不自动补齐路由或关系。这些捕获早于 R2 文档修改。

| 语料 | Hugo 实际源码去重文件数 | 补充本地 Markdown | 源码清单文件数 | 字节/模式/Git |
| --- | ---: | ---: | ---: | --- |
| Starter | 52 | 78 | 97 | 精确前后相等 |
| OINK 文档站 | 272 | 274 | 421 | 精确前后相等 |
| PIG | 212 | 212 | 858 | 精确前后相等 |
| 软件仓库目录 | 1,568 | 1,572 | 2,294 | 精确前后相等 |

初步公开命令报告位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-final-qu_zprps/summary.json`，
使用二进制 `c8d87e6d73d3101fefcb62c5d6845518573c02c400f474dc9f4603afafc774d5`，
CLI 输入清单为 `d8a75be0e074365a4164b7aaaa27d82a1e844e04406a36c3dd6d39ff2b6e873f`。
这些报告早于最终解析器与文档冻结。最初 Starter 命令误选了
外层证据目录并返回 `2`。改选其实际 `site` 子目录后返回
`0`，证据位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-starter-27vmi0w5`。

| 初步检查 | 退出码 | 页面事实 | 构建文件 | 引用 | 翻译状态 | 结果 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 正确 Starter 子目录 | 0 | 66 | 223 | 4,461 | 28 | 完成；97 个源码文件/清单不变 |
| 文档站 | 0 | 341 | 1,139 | 74,755 | 144 | 完成；421 个源码文件/清单不变 |
| PIG | 0 | 248 | 1,392 | 64,440 | 120 | 完成；858 个源码文件/清单不变 |
| 软件仓库目录 | 1 | 1,572 | 3,287 | 851,535 | 788 | 已完成策略检查：既有合并打印输出中有 10,462 项实际 `HTML_ID_DUPLICATE`；2,294 个源码文件/清单不变 |
{.wide .expand}

软件仓库目录返回了完整的问题诊断结果。
期间未降级策略，也未修改下游站点源码，提示级审阅状态仍保持可见。
最终冻结输入报告位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-candidate-6xzcs7fk/summary.json`，
实测二进制 SHA-256 为
`ff88b407a6cddb9007f94275c65a80ed4c9c4fd13f5e821f9b7a4a8973abaa56`，
CLI 输入清单为 `bd8c71b55250a89dc15c7534924bb82a5447d6f2628eba23c8cb3d864309ee9f`。
独立比对确认四份源码字节/模式/Git 清单操作前后均精确相等，替代初步公开命令试验：

| 最终检查 | 退出码 | 源码文件 | 页面事实 | 构建文件 | 引用 | 翻译状态 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Starter | 0 | 97 | 66 | 223 | 4,461 | 28 |
| 文档站 | 0 | 421 | 341 | 1,139 | 74,825 | 144 |
| PIG | 0 | 858 | 248 | 1,392 | 64,440 | 120 |
| 软件仓库目录 | 1 | 2,294 | 1,572 | 3,287 | 851,535 | 788 |
{.wide .expand}

最终报告均无未完成诊断。软件仓库目录保留 10,462 项实际合并打印
`HTML_ID_DUPLICATE` 和 788 项提示级审阅状态；其他站点保留提示级的未知审阅状态。

保留的生产文档位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-2201601475/public`，
生成的 Markdown 和链接检查通过。全站翻译检查返回 `1`，仅因既有草稿 release `1.2.0`
双语页面未进入生产。另一个草稿/未来/过期分析构建位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-3698773232/public`，
三项 node 检查均通过：137 配对/1,092 标题、216 内容页面/41,586 文本节点，
347 页面/48,682 内链/4,171 片段。证据日志为
`/tmp/oink-r2-docs-production-{translations,markdown,links}.log` 和
`/tmp/oink-r2-docs-analysis-{translations,markdown,links}.log`。

最终审阅发现可选 `equal_fields` 仍按表示形式比较 JSON `7.0` 和 YAML/TOML
数值 `7`。有界补充现将已解码数值递归规范为精确有理数标签，保留字符串与数值、
映射键及数组顺序的区别。测试覆盖小数/指数、负零、超出 float64 精度的整数、
嵌套差异、源码字节保护，以及不可表示值导致必需未完成。
真实 Hugo 翻译测试在 `/tmp/oink-r2-numeric-translations-gate.log` 中通过，
全部公开维护真实 Hugo 用例在 `/tmp/oink-r2-numeric-public-gate.log` 中通过，
归属 vet 和空白检查通过。补充源码 SHA-256 为：

| 源码 | SHA-256 |
| --- | --- |
| `internal/translations/check.go` | `24664377e14b4ae2fc554d0d7fde2ec33cc987707250e130fd88d9a25d5e1637` |
| `internal/translations/translations_test.go` | `f58f4a305fe9fe3f5500ddfcf85faf3cfa37d72f8c220a1cb16ce4ccfbddb74d` |

冻结真实站点报告及 Linux 验收早于该补充。对应站点未配置数值相等约束，
已记录的输出不受影响，因此未为这项有界修复重跑。

该阶段结束时 A18 仍待完成。macOS arm64 已实测；本机尝试 Darwin amd64 运行时，
`arch -x86_64` 因缺少 Rosetta 返回 `posix_spawn: Bad CPU type in executable`
（`/tmp/oink-r2-darwin-amd64-gate.log`）。原生 Linux arm64 和 Docker
Desktop Rosetta 模拟的 Linux amd64 均实际执行，同一运行/Schema/许可证输入
SHA-256 为 `0f786df68ef3c4844c983a51595f79242d1cb1d2bf6c5b5eb7f2c6415fb8d861`。
证据保留在
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-a18-linux-ajbbnvki`
的 `arm64-results`、`amd64-results`、`commands.json`、`candidate-inputs.json`、
`preparation.json` 和 `qualify.sh`。每个目标均通过 270 个测试/子测试，无失败，
仅跳过两项可选外部语料/来源验证：完整真实 Hugo `go test ./...`、vet、构建 CLI
版本/双语 init/doctor/完整 check/翻译 status，以及缺失 Hugo 退出 `2` 冒烟测试。
JSON stdout 和源码字节/模式清单均核对。Go 1.27.1 运行在 Linux arm64，
Hugo Extended 0.166.0 各架构资源已核对 SHA。

## R3 本地验证 {#r3}

R3 新增受管理 `build --check`、`oink.artifact/v1` 封存/导出/本地验证、
显式联网 HTTP 验证、发布诊断和受保护的本地 CI 生成。默认 build/dev 保持普通 Hugo。
已执行运行和中英文契约/指南门禁通过，R3 已本地接受。

| 需求 | 已执行归属证据 | 结果与限制 |
| --- | --- | --- |
| A08 单份检查产物 | 公共模拟/真实 Hugo 单渲染器测试；精确导出、manifest/标记、检查后字节/模式/缺失/新增/符号链接篡改、失败/并发及源码保护测试 | 本地范围通过；失败/未完成检查不能封存或导出；本地产物验证不重建 |
| A09 两种 CI 服务商 | 离线确定性生成、固定源码/Hugo 归档和 action revision；安全 bootstrap 归档；受保护公共预览/应用/过期输入；真实 Hugo 原始输入绑定 | 本地配置范围通过；拒绝所有已存在生成目标，定制工作流不变 |
| A09 上传身份 | 两种本地服务商演练及 `TestProviderUploadRehearsalPreservesActualSealedManifestIdentity` | 通过：一次受管理构建、单独验证、再使用同一树；GitHub tar 包含隐藏标记，Cloudflare 演练接收已验证目录 |
| A09 定制工作流诊断 | 已生成加其他定制、无元数据定制公共测试，真实 Hugo 预览与归属 vet | 补充通过，日志为 `/tmp/oink-r3-ci-custom-owning-gate.log` 和 `/tmp/oink-r3-ci-custom-vet-gate.log`；未被元数据表示的工作流保持 `unknown`、信息级及可选 `release.ci: not_checked`，有效生成元数据旁也可见 |
| A10 部署身份 | 本地 HTTP 全部记录文件/路由/语言、标记、canonical/base/惰性 template、HTTP 200 回退、错误字节/语言/构建、缺失资源/Markdown/搜索 JSON 夹具 | 本地夹具范围通过；确定差异为 `1`，浏览器 JavaScript 未检查 |
| A10 网络未知状态 | 显式联网/凭据拒绝、响应头前/响应体中超时、认证/限流/服务错误、必需标记缺失、有界响应/gzip、重定向/无 cookie 夹具 | 本地夹具范围通过；未完成为 `2`，剩余请求为未知 |
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

每次离线 `build --check` 使用站点外的新导出/manifest 路径、可选标记和保留隔离
目录。已有本地站点未使用 `--release`，保留其配置的 workspace。每份原始报告
均恰好一次严格 Hugo 渲染、零未完成诊断、零必需未完成覆盖。

| 最终受管理构建 | 退出码 | 源码文件 | 复制源码输入 | 页面事实 | 构建文件 | 引用 | 导出文件 | 本地产物验证 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Starter | 0 | 97 | 94 | 66 | 223 | 4,461 | 224 | 0 |
| 文档站 | 0 | 421 | 427 | 341 | 1,139 | 74,825 | 1,140 | 0 |
| PIG | 0 | 858 | 861 | 248 | 1,392 | 64,440 | 1,393 | 0 |
| 软件仓库目录 | 1 | 2,294 | 2,299 | 1,572 | 3,287 | 851,535 | 无 | 未导出 |
{.wide .expand}

两份清单均精确比较操作前后字节、模式与文件类型，主清单还比较逻辑 Git 状态。
Git 站点包括 tracked 和未被忽略的 untracked 源码；无 Git Starter 包括既有生成
文件与锁。补充复制源码清单还包括快照读取的被忽略 workspace/编辑器元数据，
排除已有生成输出/缓存树。四份对比均精确相等。

软件仓库目录保留 10,462 项既有合并打印 `HTML_ID_DUPLICATE`，未创建导出或 manifest。
生产审阅状态为 28/143/120/786；
分析包括未发布页，对应此前 R2 的 144/788。既有定制工作流信息仍可见，
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
返回 `2`；改用 `pig.pgsty.com` 后通过。
CI 模板/bootstrap 根据已记录服务商第一方契约独立编写。

限定 R3 文档门禁通过，证据为
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-docs-render-pljj5aqd/summary.json`。
十份成对契约/指南/路线图/索引/概览修改在匹配原始字节/模式后安装，哈希位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-doc-drafts-s0b3g48l/applied-files.json`。
源码风格通过 88 个中文文档，翻译通过 137 配对/1,099 标题，Schema 保持相等且限定
空白检查通过。真实生产 Markdown 通过 214 页面/41,871 文本节点，链接通过
345 页面/48,344 内链/4,171 片段。生产翻译仅因未修改的草稿 release `1.2.0`
未进入生产返回 `1`。另一个明确不可发布的草稿/未来/过期分析通过 Hugo 及三项
归属检查：137 配对/1,099 标题、216 页面/42,177 文本节点、347 页面/48,720 内链/
4,199 片段。产物检查期间 421 个规范源码和 488 个复制源码文件均保持精确字节/模式。

## R4 创作与升级验收 {#r4}

受支持 R4 实现与只读语料范围在冻结归属/全量门禁后已本地接受。本记录覆盖配置、
普通创作/编辑器/片段和有界升级视图。受保护规范文档推广与新产物限定验证也已通过，
详见下文。

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
生成源码数量为 project 94、docs 58、blog 40、book 34。

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
保持可见。

下游站点升级预览选择已有公开 v1.1.0 pin，不应用写入；跨版本路由/alias/输出回归采用
合成夹具 pin。New/editor 计划为已验证预览，未在下游站点
保存或应用计划。多主机及未知相对 alias 身份保持未完成。非确定性产物可能需要重新
预览 v2 计划。

应用十份受保护文件后，新的规范文档验收通过。证据为
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

临时辅助程序复制冻结核心：辅助源码 SHA
`7faea7e726a6c6fb2e0747be1a4428f4c5fb5734fa52b6f981157a5fe37d9989`，
辅助二进制 SHA
`532638e76f96f8b173c122e512b3bf5fc2c4d4a7130f59c99c2c69e135e87073`，
与原始日志一并保留。

## R5 实现与文档验收 {#r5}

R5 受支持范围在聚焦公开命令/核心、修正冻结全阶段、精确二进制只读消费者及
受保护规范源码/渲染文档门禁后已本地接受。

实际公开 Git/Hugo 流程在 `/tmp/oink-r5-public-final-flow.log` 以 53.963 秒通过。
已提交的合成站点拥有本地主题、双语页面及二进制附件；普通 `0640`、`0600` 保持为
完整当前事实，历史 Git 比较仅使用可执行位。删除乙后纳入未改入站甲、剩余翻译、
删除的附件与实际 RSS 输出。实际 alias 入站归属不确定性、全局配置/模板/数据及
未知输入变更扩大为全范围。

完成的 inspect/impact/context 返回 `0`，单独展示当前检查发现 `1`；check-since
保留当前质量 `1` 与完整验证范围。缺失、未提交或外部历史返回 `2`，保留全部已知
当前页面、附件、引用、输出。已测试无效选择器/限额、缺失工具
及失败渲染器日志。有界上下文提供理由、版本、源码及摘要哈希、可见遗漏/截断。

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
二进制字节、无关输入与 Git。

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
修正四消费者捕获
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
{.wide .expand}

Starter 与仓库站 impact 保留已知当前事实。PIG 实际基线
完整（主题 v1.0.0 对当前 v1.1.0），但必需外部输入来源未完成，因此比较扩大为
全范围并返回 `2`。文档站 impact 完成，包含 192 个捕获输入
变更、343 个受影响旧/当前页面并采用全范围。已完成事实查询独立展示当前质量发现；
仓库站 inspect/context 仍为 `0`。

文档站移动证明 18 处重写及四条路由。`content/docs/customize/repository.md`
第 216、313 行两个普通字面 `/docs/admin/comments/` 目标保持人工动作，因为
普通/打印输出的重复源码/输出出现位置无法精确归属。六条候选缺失引用阻止验证。
PIG 移动两个 Markdown 文件及四个二进制附件，证明八条页面/处理后资源路由。
配对且字节相同的输出证明处理后 `featured_hu_*` 资源，但未证明四个原始绝对图片
引用 `/article/pgext-day/{featured,topic,venue,schedule}.webp` 的新 URL。
32 条候选缺失引用阻止验证。

仓库站移动证明十处重写及四条路由；候选只有同一批已有 10,462 个重复 ID 发现，
没有新缺失引用或必需未完成发现。Starter 无入链的双语移动已验证。四次移动均未
应用，未保存计划或写入站点源码。失败候选为 `validated: false`。
全部 JSON stdout 纯净；主源码、复制输入、完整模式、目录清单及逻辑 Git/index
状态保持不变，包含忽略的复制输入。Git 元数据清单不包含不可变对象存储。
运行与较广 CLI 清单仍匹配捕获身份。

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

首次晋升的永久 `applied-files.json` 位于
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-doc-drafts-t3_klnck`，
保留十个授权文件及其原始模式。

核心归属日志 `/tmp/oink-r5-frozen-core-hugo.log`、
`/tmp/oink-r5-owning-race.log`、`/tmp/oink-r5-owning-vet.log` 已通过。A13 影响
与 A14 移动保护所需受支持 CLI 范围通过；A15 有界上下文通过。
