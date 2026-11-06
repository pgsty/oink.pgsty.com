---
title: 2026-10-03 CLI 维护验收：R6–R8 与 A18
linkTitle: 2026-10-03 CLI 维护 · R6–R8
description: 带日期的 CLI 维护记录中 R6–R8 与 A18 的工作区、Studio、编辑与运行时证据。
weight: 57
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] 属于[CLI 维护验收记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
> 带日期记录中的 R6–R8 与 A18 小节于 2026-11-06 原样迁移至此，使每个页面都能被完整读取。
> 范围、证据规则、验收案例台账与交付状态仍保留在主页面。

## R6 工作区与适配器验收证据 {#r6}

R6 受支持范围在冻结归属/运行时、精确二进制消费者一致性/保护及受保护规范
源码/渲染门禁后已本地接受。受支持登记/工具字段归属
[契约](/zh/docs/design/decisions/cli/#workspace-registry)与
[命令契约](/zh/docs/design/decisions/cli/#optional-checkers)。
A07 适配器与 A15 工作区/直接/context 受支持范围通过下列门禁。

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

已检查核心
`workspace.go` 的 SHA-256 为
`cf2cbc9509e8c83eedf6d8833c9eb0ea6492de9a85c959798112fa3f105213f4`；
归属测试为
`9070a8e2c3e58680f6567f2394160ec682bf0457c068c2addf354921e7612d6b`；
公共测试为
`3e57a6417ae2e7604f7cb06933759bb06a2f40758ff7059848593cedbaa6570a`。
这三份已检查文件均保留 `0600` 模式。

### 修正协议与阶段门禁 {#r6-pending-gates}

| 协议或门禁 | 记录状态 |
| --- | --- |
| 实际 markdownlint-cli `0.49.1` 与 Vale `3.24.0` | 修正公共试验通过：恰好一个发现项映射到原始 UTF-8/BOM/CRLF 行；排除的 front matter/短代码/数学公式/原始 HTML/已启用属性/代码不产生错误原文归因 |
| 实际 lychee `0.24.2` | 修正试验实际到达本地 HTTP 夹具：`200` → `0`，`404` → `1`，`401`/`403`/`429`/`503`/超时 → 必需 `2`。可选离线 → `0`，必需离线 → `2`，两者均零 HTTP 请求 |
| 最终聚焦实际工具收据 | `/tmp/oink-r6-public-actual-tools-final.log` 通过，15.192 秒；先前修正后的 14.686 秒运行保留为已有证据。Node 预加载与发现的 JS 配置没有执行；源码完整模式/Git 保留 |
| 假工具/协议失败收据 | `/tmp/oink-r6-public-fake-tools-final.log` 通过，13.089 秒：错误输出、版本不符、超时、不安全配置、必需缺失/可选/检查组遗漏与原始 stderr 规范化 |
| 聚焦公共 race/vet | `/tmp/oink-r6-public-tools-race.log` 假工具和实际用例通过，30.273 秒；`/tmp/oink-r6-public-tools-vet.log` 退出 `0` |
| 冻结运行时输入 | 在 `2026-10-03T10:58:01.807947Z` 冻结，`/tmp/oink-r6-runtime-freeze.json`：103 运行时输入绑定 `b85affd96378b45bfc56a996b0c5672d02ee4c6cc9bc95335fa5072f6c42a03b`；179 更广 CLI 输入绑定 `fbb8176ebc58f1aa26336f4e6036cf9bd5f7a0d62b142f16532b50a8071e9fbe`。实际运行的 `0.3.0-r6-local` 二进制 SHA-256 为 `aa8b347fbe01071f9da729f4d98aa2f50d7264456be6c5f05771bcfadadc371f` |
| 冻结归属套件 | 完整 Go/vet 退出 `0`，`/tmp/oink-r6-frozen-go-gate.log`；完整实际 Hugo 与固定工具退出 `0`，`/tmp/oink-r6-frozen-hugo-gate.log`（app 382.832 秒）。工作区/核心/协议/源码遮蔽/政策/报告 race 与 vet 收据通过，副本保留在最终收据中 |
| 四个消费者站点 | 已验证：全部四站精确二进制直接/汇总诊断、覆盖、退出、身份及登记顺序一致；逐命令/整体源码字节/完整模式/类型/逻辑与可变 Git/被忽略输入/目录保护通过。汇总完成 `4`，有问题 `1`，未完成 `0`，退出 `1` |
| 规范中英文 | 通过：受保护首次十文件晋升、源码归属检查与新鲜普通生产/不可发布渲染证据；仅保留已知生产 draft 发布文档缺失 |
| 阶段决策 | 必需收据齐备后 R6/A07/A15 受支持范围已本地接受 |

永久聚焦工具收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-tools-6bf67ltv/r6-public-tools-acceptance.json`，
SHA-256 为 `16b6e47fc0618c76d2f9e3680a4112b6e47b478af8aabd3f2fc84821f840cc8a`。
它绑定工具准备记录、可执行文件/配置证据与 1,422 个已解析 Node 包文件。Markdownlint
报告原始 `content/tools.md` 第 7 行，`bytes[80:92]`（`ppears here.`）；Vale
报告同一行，`bytes[71:78]`（`BADTERM`）。七个网络用例每个均实际发出一个 HTTP
请求。

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
固定工具夹具；消费者登记只存在任务临时目录，不写站点政策。

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
26.9.0 与 Apple Git 2.54.0。

初次实际工具试验暴露了 Darwin `/var` 与
`/private/var` 暂存身份、实际回环代理路由，以及 Vale 夹具中无效的行内块属性/行号
断言。暂存现在使用规范路径；Vale 夹具改为真实独立行块属性，源码遮蔽边界不变。
已验证子环境传入字面的 `NO_PROXY`/`no_proxy` 主机列表数据，不传代理 URL/凭据
和 Node 预加载设置。

受支持源码诊断需要已证明原始范围；渲染 lychee 位置仍是输出文件/DOM pointer，
不推断 Markdown 行号。离线时不调用 lychee。鉴权/限流/服务器/传输不确定性不能
通过严重度、排除项或基线确认变成必需成功。

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
后续目标修改或删除。这些门禁后，R6/A07/A15
受支持范围已本地接受。

## R7 只读 Studio 候选证据 {#r7}

R7 已实现[契约](/zh/docs/design/decisions/cli/#studio)描述的内嵌五视图浏览器及鉴权回环 API 候选。
冻结核心/浏览器及精确二进制四消费者验收
及受保护规范渲染门禁在声明范围内通过；R7/A16 受支持只读范围已本地接受。

### 聚焦原生与浏览器证据 {#r7-focused-gates}

| 归属边界 | 证据状态 |
| --- | --- |
| 原生/公共一致性 | 实际共享检查在 `0`/`1`/`2` 下保留诊断/覆盖/退出身份；显式选定工作区启动、清理/信号及无源码写入证明由归属测试收据单独记录 |
| HTTP 管理/源码/预览 | 字面回环选择；准确 Host/origin/Bearer 检查；无任意请求路径/写入；捕获源码/diff 限制及源码模式/输出清单保护；下方聚焦核心/新浏览器及本轮语料收据绑定该受支持范围 |
| 首次保持界面浏览器 | 14 次 axe 零违规、14 张截图；五个桌面浅色视图、捕获 BOM/CRLF 源码/diff、桌面深色、移动深色、全部五个 320 像素浅色视图及捕获变化。合成实际 Hugo 夹具保留 228 原生诊断和覆盖一致；建议复制使用私有测试剪贴板，不改宿主剪贴板 |
| 浏览器预览攻击 | 实际攻击脚本在隔离预览执行，但 parent 访问、管理 fetch 与弹窗被阻断；拒绝 token query。仅 draft 页面在生产仍为 `404` |
| 快照保护 | 捕获源码指令/HTML 保持字面数据；显式任务夹具外部编辑后、刷新前，初始捕获仍保留旧字节。除已声明夹具编辑外，源码完整模式/Git/目录保留；changes 展示实际修改捕获输入 |
| 前一份保持浏览器 | 刷新保持 UI/后端收据通过：全部 14 次 axe 零违规、14 张截图，包含声明/捕获主题行 |
| 新局部预览浏览器 | 新冻结局部预览运行时通过：14 次 axe 零违规、14 张截图；实际 Hugo 正常 HTML `200` 与 67,108,865 字节产物 `413`；原生 `1`/228 条诊断及覆盖保留，必需局部覆盖可见，Studio/刷新 `2` |

首次浏览器收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-AfwaYi/summary.json`，
SHA-256 为 `930fbd1ab86806069b963bff2e3e95aaa07e3634400cec65e2b8c7922e2a1707`；
准确二进制绑定
`92e5b962e40fbe828a0b006f3ae76a2bddf4ad7e8b1c5b6967e365b8f1827879`。
本地验证版本为 Node 26.9.0、
Playwright 1.62.1、`@axe-core/playwright` 4.13.0、Chromium 151.0.7922.34；
它们是贡献者测试依赖，不是下游运行时需求。剪贴板证据覆盖
实际 UI 点击和私有剪贴板实现。

刷新保持 UI/后端浏览器收据位于
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-vn0ofb/summary.json`，
SHA-256 为 `520603779f712539865c6e9ef7a9ad3ad21ec1906adfb067ec607cc69d071b7e`，
准确二进制为 `73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`。
全部 14 次 axe 与 14 张截图通过，包含声明/捕获主题元数据及全部五个 320 像素
视图。

初次并行完整套件试跑
`/tmp/oink-r7-frozen-go-gate.log` 与
`/tmp/oink-r7-frozen-hugo-gate.log` 失败。失败原因是并行包负载下
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

持久修正归属门禁收据为 `/tmp/oink-r7-corrected-owning-gates.json`，SHA-256 为
`c7f94a740e33a7349886b3f3689419719f857f39031375e80ca384a3dac36e67`。
预备文档渲染驱动
现要求完整消费者收据证明私有捕获源码重建与最终浏览器二进制字节相同。独立
源码审计 `oink-r7-docdriver-audit-ig_r8ud1/receipt.json` 绑定 SHA-256
`858cc48bf602fbdb26fcbda03c78ca485338b1295d64257d32cfb14b24f1ade3`，
以及预备驱动
`f25d9ac4bf1a7ef43d5526b7b3cbadf84dd64ad8a57fd82d1c82e76fdb2b3435`。

首次消费者驱动试跑 `oink-r7-corpus-h1lOFl` 因
`KeyError('preview_base_path')` 停止：驱动直接索引实际预览基路径为空时合理省略的
字段。该私有重建与最终浏览器二进制
`73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`
字节相同；四消费者源码清单与根清单全部保留。新 `oink-r7-corpus-corrected-cByXTa` 驱动仅将这两个访问改为
`get(..., '')`，SHA-256 为
`4c409acacbb9b82e658e6705eddefd9a3541def5c63c340b65678a6c9a8354e4`。
该新运行随后因仓库产物中一个清单文件超过 64 MiB 而失败：前一运行时拒绝全部
生产预览。原生检查保持结果 `1`，必需预览不可用使 Studio 结果为 `2`。
Starter、docs、PIG 在本次运行完成并返回 `0`；四消费者源码清单与根清单保持
不变。空基路径驱动修正均未
改动运行时或消费者源码。

局部预览的窄运行时/测试修正保持 64 MiB 限制，开放限制内受保护
生产文件，准确跳过的超大路径返回 `413`，必需 `studio.preview` 覆盖保持未完成。
原生检查结果不变；必需预览未完成仍使 Studio 返回 `2`。内嵌 UI 保持不变。
新的有界覆盖 detail 记录实际省略相对路径、大小与总数。
预备实际 Hugo 浏览器夹具增加 64 MiB 加一字节的 `static/oversized.bin`，用于
验证可用受保护 HTML 预览、准确跳过文件的 `413`、原生结果 `1` 及必需局部视图
结果 `2`。

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
初次稀疏夹具模式试跑中，宿主 umask `0077` 使请求 `0640` 的文件实际为 `0600`；
夹具显式 chmod 到 `0640` 修正该设置，未改变生产行为。聚焦证明覆盖正常 `200`、超大
`GET`/`HEAD` 的 `413`、身份变化 `409`、私有路径 `404` 及其他未知产物错误拒绝。

新局部预览冻结的完整串行 Go 测试随后用 61.481 秒通过，vet 用 0.571 秒通过。
完整日志为 `/tmp/oink-r7-partial-preview-go-gate.log`，SHA-256
`be7d6eccf99a6f4c1b8f09d1fb782455c7cbd3bad4a2f37e2f0e9da916bcb313`，
以及 `/tmp/oink-r7-partial-preview-vet-gate.log`，空文件 SHA-256 为
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`。
独立保持输入审计 `oink-r7-partial-held-audit-o6p98i1l/receipt.json`，SHA-256
`e567efc5f580db9395afab8ad36c4db842c3db95db442eb1cb1c740dbd43ec31`，
在 Go/vet 运行期间验证全部 113/193 输入及物理/逻辑身份。新完整实际 Hugo/固定版本工具调用随后用 285.649 秒
完成，退出 `1`。唯一失败是使用不可用 Markdownlint 准备路径
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
`TestPublishedRuleSourceProvenance` 案例明确跳过。

新 Go 后输入审计 `oink-r7-partial-postgo-audit-g1hcqdtl/receipt.json`，SHA-256
`b369737ec48456f673c850ea702cb3cb7efffb8ecc129d87e00dc03af82b2e3b`，
随后确认 Go/vet 后全部保持的 113/193 物理/逻辑输入。

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

另一份预备语料驱动曾假定正常可用预览总会附加 `studio.preview` 覆盖行。
实际正常 Starter/docs/PIG Overview 不输出该行；准备假设已修正，未改变原生覆盖。
修正后的新 `oink-r7-corpus-partial-pZLwY0` 驱动，SHA-256
`47778df62505beeb7432985be927f1b001e03824e9dee3a6dbed9d9b2dbe049c`，
已针对这三份保留实际 Overview 及当前局部浏览器捕获复核。正常可用仍需实际
预览 URL 和独立 HTML `200`；局部捕获保留真实必需覆盖行、省略总数/身份和 `413`。
准备审计为 `oink-r7-partial-driver-correction-audit-sa98cm6k/receipt.json`，SHA-256
`a519a5bc6ae83438146ff4710d53f5edb0e656a05d0532c02123e5771416f07e`。

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
生产预览 HTML 返回 `200`；它们不输出 `studio.preview` 省略行。
仓库正常 HTML 返回 `200`、60,100 字节。当前捕获准确暴露四个超大 print 路径；
每个实际 `HEAD` 返回 `413`，响应体零字节：

| 捕获省略相对路径 | 捕获字节大小 |
| --- | --- |
| `_print/pkg/index.html` | 73,976,221 |
| `_print/pkg/pgsql/index.html` | 69,903,999 |
| `zh/_print/pkg/index.html` | 73,086,240 |
| `zh/_print/pkg/pgsql/index.html` | 69,052,754 |

必需
`studio.preview` 保持未完成，仓库 Studio `2` 因而保留原生 `1`。docs 与 repo 实际
仅分析 draft 路由在生产返回 `404`；Starter/PIG 缺少唯一捕获 draft 路由，该测试
不适用。工作区子集/全集/健康子集会话仅选登记站点，不捕获并关闭监听器；
未知或选定缺失站点在启动前返回 `2`。环境为本地 Darwin/arm64，使用
Hugo 0.166.0 Extended、Go 1.27.1、Git 2.54.0。独立最终语料审计
`oink-r7-final-corpus-audit-xr3_u5dt/receipt.json`，SHA-256
`b8a8eedf5c899fe5830bdde959783c46b3f191ab144c0d3798077555d55238fc`，
不重渲染、不新增 HTTP 请求，验证原始类型化原生/API/退出一致、132 项操作保护
比较及四项整体保护。

临时磁盘容量准备期间，仅清理三个私有 Go build cache，共
366,184,826 字节，收据为 `/tmp/oink-r7-private-cache-retirement.json`。
源码、二进制与验收证据均保留。

### 剩余阶段门禁与晋升边界 {#r7-pending-gates}

| 必需门禁 | 当前状态 |
| --- | --- |
| 冻结运行时输入/二进制身份 | 新局部预览冻结绑定 113 运行时输入 `4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84` 和 193 更广输入 `8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`；所有 UI 字节/模式保持不变。源码绑定浏览器二进制 `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` 已通过；新私有消费者重建字节相同 |
| 完整 Go/vet 与实际 Hugo | 新完整串行 Go/vet 与浏览器已通过。新实际 Hugo/固定版本工具完整调用保持因准备路径退出 `1`；唯一修正归属案例通过 `0`，独立验证累计已执行实际案例覆盖 `0`；两个可选案例明确跳过 |
| 四消费者 | 精确二进制 CLI/API 验收完成；原生 `0/0/0/1`、Studio `0/0/0/2`，准确嵌套原生一致及源码字节/完整模式/类型/Git/被忽略输入/目录保护；仓库局部预览保持必需未完成 |
| 规范配对源码/渲染 | 首次受保护 TEN 晋升及限定实际渲染通过 |
| 阶段决策 | R7/A16 受支持本地范围已接受；R1–R7 已本地接受 |

下一份预备文档安装器在成功与恢复时都将捕获的实际旧 inode 保留在规范源码外，
不会在较早目标身份检查后取消其最后名称。

首次晋升渲染门禁完成，收据为 `/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-docs-render-n8tw2tbw/summary.json`，SHA-256 `35e79f51d39803b3e4cdf134ed277957dd627acba42e0e0dc785e4745ec3c481`，日志 SHA-256 `de3a07eac661c15805070e0ed2e364a71ebbd38e15d8907aab3bdf716e95131d`，耗时 63.33 秒。准确已验证二进制 `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` 在一次严格 Hugo 构建下通过生产 CLI 链接。无 probe 普通生产 Hugo 通过渲染 Markdown（214 页/44,075 文本节点）及链接（345 页/48,482 内链/4,303 片段）。其翻译归属仅因既有未发布 release `1.2.0` draft 保留退出 `1`。独立 draft/future/expired 分析通过 Markdown（216 页/44,381 节点）、链接（347 页/48,858 内链/4,331 片段）及翻译（137 对/1,129 标题）。源码翻译/样式/空白检查通过，CLI/文档 schema `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda` 保持相同。十二项操作、schema 及整体保护均保留 421 主文件、427 捕获输入、109 目录、36 可变 Git 文件和 113 运行时输入。

首次受保护晋升收据 `oink-r7-root-promotion-p9g1u7pz/summary.json`，SHA-256 `323a5ce267e39aaf8f97dc4a12cccbdde83730155a199efb5f3815e29b334e4a`，验证实际原始 inode 保留在规范源码外。

## R8 已接受受审阅编辑证据 {#r8}

R8/A17 受支持编辑范围在下文修正冻结归属/浏览器/语料及受保护规范渲染门禁
后已本地接受。CLI `edit text`、`field`、
`snippet`、`attachment` 预览与显式 `studio --edit` 相同的绑定 `oink.edit/v1`
意图。保存计划应用或 Editor 显式确认 Apply 拥有选定源码写入；默认 Studio 会话
保持只读。

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
| 首次 Editor 浏览器试验 | 驱动因全局 Open editor 选择器歧义停止；保留失败试验 |
| 修正选择器 Editor 试验 | 桌面字段/组件/二进制应用及 axe 检查通过后，320 px draft 审阅横向溢出失败；保留原试验 |
| 定点布局修正 | Editor 审阅哈希/收据文本可换行，固有宽度受限；此前 CSS 与失败证据独立保留。开发重跑通过 12 项 axe/截图，包含真实 320 px 暗色审阅及亮色收据/拒绝；最终冻结源码/二进制重跑待完成 |

前述准备行记录于首次完整 R8 冻结之前。后续首次完整冻结
门禁通过，二进制为 `84b804d3246a5be581e44884ed910fa3f45d8be29734b8babdeeb763a11fa882`
（`0.5.0-r8-local`），运行时 123/`58517b8e98b80df6642be4ee6275a0074ec187768b20e009f41da2607b635d46`，
更广源码 212/`d81335c78413acc60e27adee0ac794862285e41cb2a3a7687ec820c1065ba003`。
完整门禁摘要为 `b49f4a3272af3e3dcc92e7e9b38d4289bb49cb19aa3e9354ea148d2d8cb2cea8`：
Go 测试 `0`/56.523 秒、vet `0`/0.904 秒、完整实际 Hugo 及三个固定工具
`0`/320.044 秒、核心 race `0`/16.610 秒、公共 R8/helper race `0`/48.319 秒。
源码保护通过。

首次冻结浏览器收据
`eb6977235ef9ae6cec28651b5654eb101685af67abe0cbed0acb0f8375458d9c`
绑定相同二进制及源码冻结。Editor 12 项 axe 零违规、12 张截图；保留只读
Studio 为 14/零/14。实际表单保留 `1e400` 字面量、计划 after 哈希及 diff，随后
丢弃；指数 ±10,001 与 4,097 字节数值在本地拒绝，不发送 API 请求。四次确认的
字段/组件/二进制/draft 应用只发生于一次性夹具。默认只读拒绝、过期输入保留、
no-op 源码字节、预览隔离及原生结果独立性通过。

首次准确二进制消费者试验随后在 Starter 停止，耗时 37.533 秒。不可变失败试验
收据为 `853a8397ba4c527c03aa3cc9ac7cacc41c0ab0379549d145b874f1d1ecc3901c`。
两项失败分别记录：驱动事件哈希依赖 JSON 对象键顺序，但递归比较证明 API/CLI
数组相等，均为 28 条诊断、29 条覆盖、原生退出 `0`/`0`。另一个是真实运行时
问题：重复解析缓存捕获产生 `.gitattributes` 模块输入重复；必需候选图捕获不完整，
修改结果为 `2`，原生检查仍为 `0`，没有实际选定 DFE HTML 或可应用 lease。
公共发布缓存夹具重现该缺陷，保留失败日志为
`50ab704e715665096e0f36391bb1364841c3a2b2ac88dd262915ce53fb66afa6`。
全部 48 份已记录逐操作源码证明及四份消费者整体保护保留字节、完整模式、类型、
Git、忽略但复制的输入与目录，根输入准确不变。没有 Apply 或保存计划。

定点运行时修正先收集完整解析模块行，再提交新增记录。相同重复或重新排序的
捕获保留原清单。既有范围内哈希/完整模式变化、路径增删、整个范围缺失、身份
冲突或捕获错误都拒绝，不刷新此前证据或追加部分结果；非模块行保持准确。
site 归属收据 `e7b284b9dece1c5f2b696cd76166d2286fcbec69e6c48912ab9a78204bdb980b`
记录聚焦 `0`/0.746 秒、site `0`/2.123 秒、聚焦 race `0`/1.958 秒、vet
`0`/0.167 秒。

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

下一次证据观察时，修正完整门禁已完成，绑定前述受控 `bd25f9e0…22c3d71`
二进制及 `fb276500…02949f` 冻结。摘要
`208f156c0954e803eccbada678a4689683dc1576c543c379e5cc04b3497ef772`
记录 Go 测试 `0`/57.826 秒、vet `0`/0.521 秒、完整实际 Hugo 及三个固定工具
`0`/378.847 秒、核心/site/Studio race `0`/17.937 秒、公共 R8/附件/输出 helper
race `0`/85.159 秒。每项门禁源码前后保护通过。实际 Hugo 日志有 434 项顶层
通过、零失败；两个可选外部夹具 `TestArtifactCorpus` 与
`TestPublishedRuleSourceProvenance` 明确保留跳过状态。

修正完整实际 Hugo 日志为
`4eb1a2afdce2adbe570b10922fd53b6d8954f7c95747370c3c661e94d2f71a05`；
Go 日志 `ea59463e9649ffe2f8aff9da66c91cf6895c86fde96a524db23c89cd4eb35925`，
核心 race `cdd3d761b5ca7b5e986b25aee3129d65663e3e5ebb83eecb6fbb080387298a58`，
公共 race `bb610bdcd7a299cb9b66f4c69e30e246c20546efae47653c01d350b1026ea2de`。

前述 434 项通过与两个可选跳过是顶层计数。同次完整调用还跳过嵌套 Unix
socket 拒绝夹具，原因是 Darwin 临时路径超过 socket 限制。首次缩短私有路径
试验仍跳过：收据
`93106854ca890b497d3c74522b895f597ac60cec55ced42cad7b187d334da200`
保留进程退出 `0` 并记录未实际执行 socket。

后续不解析别名的短私有 `TMPDIR` 在 race 下实际执行相同冻结 socket 夹具，
没有跳过，`0`/2.954 秒。收据
`531a503b3b91e1b423c2be61b92ed806d3a813738c38d57e5ec122577b4337f9`
与日志 `236c84f1842ffce76174c834f3888718a109cec6377ada6f3242b02f551f00b3`
绑定 `fb276500…02949f`，全部 123/212 逻辑/物理/Git 输入前后不变。

修正四消费者试验随后于 845.705 秒
完成。摘要
`af4fc53326163c4a03aa2982c1f01363fbbdd5a447c9baed3639bd8599d46370`
与验证收据
`4d6fd02543c1920497e1a1bb0a68fcf89b0546130fd9cc12c1df391b7e673e75`
绑定逐字节相同私有重建 `bd25f9e0…22c3d71`、完整受控
123/`cdf629ee…feb1c17` 运行时及 212/`f6e305e7…5183e579` 输入；首次失败试验全部
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
及拒绝 Apply 保持可见。其余三站完整预览以实际受保护
HTML `200` 作为证据。

准确 53 次受保护操作每次检查全部四站：212 次逐操作源码证明加四次整体证明，
源码字节/完整模式/类型、复制的忽略输入、目录及逻辑/可变 Git 均未改变。每次源码
证明比较四类清单，因此含整体比较共 864 对原始清单。全部 53 次根目录保护及
最终完整 123/212 逻辑/物理输入也相同。所有 issues 与 pages 分页遍历，其他五个
视图端点仅取前 50 项，每站一个已知源码及一个有界 diff。完整原生/CLI 记录
一致性使用已声明有界完整记录 codec；对象顺序规范化，数组顺序、类型、null 和
字段存在性仍有意义。

独立审计收据
`6b72ca06d8392a5271fc40757f176f26e1144c21eec93dbd035e0a1bd645657b`
验证 69 项产物哈希、完整有界 API/spool/关闭类型化记录及大型原生/CLI 原始文件
摘要绑定。追加收据
`335f137663d4ec0b2a0d3e49c8d70b9918f86078ab6264855171a2644d8aa6c6`
还把当前根目录完整逻辑 Git 清单与冻结重新验证，原审计保持不可变。

经审阅首次 TEN 晋升随后通过
受保护保留 inode 安装器，根收据为
`7cd9b4604d2340b9e46965a26281c921b967060909d518b8b4b31e5f42d0120c`。
实际原源码 inode 保留在文档站外；未选中源码/复制输入、目录和 Git，以及完整
CLI 123/212 逻辑/物理输入保持不变。

规范渲染随后于 67.21 秒完成，摘要为
`bb0d0710294f810fb14284f7b5b0329befbd290b66c21397b9a45e8382287fb6`，
验证收据为
`32d3ffeca43bc9ad4615edcca0d3cc47cc932bbc93c6576724c800e0a62405b1`。
它使用准确已验证 `bd25f9e0…22c3d71` 二进制及修正 123/212 冻结。实际 CLI 生产
链接通过 `0`，只有一次严格 Hugo 构建。独立普通无探针生产 Hugo/Markdown/链接
通过：214 个 Markdown 页面/44,691 个节点，以及 345 个链接页面/48,532 条内部
引用/4,351 个片段。生产翻译归属仅因已有 `release/1.2.0` draft 不在生产而保持
`1`。独立明确不可发布 draft/future/expired Hugo 分析的 Markdown（216 页面/
44,997 节点）、链接（347 页面/48,908 引用/4,379 片段）及全部翻译均通过 `0`。

源码翻译通过 137/137 对、1,143 个标题；中文样式通过 137 文件/181 个加粗区间/
零强调，空白通过，Schema SHA-256
`7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda`
准确相同。全部 12 个命令、Schema 及整体保护保持 421 个主源码文件、427 个复制
输入、109 个目录和 36 个可变 Git 文件，以及全部 123 运行时/212 更广 CLI
逻辑/物理输入不变。验证收据绑定 60 对规范清单、15 对 CLI 保护及六对私有复制
源码。

R8/A17 受支持本地编辑范围在修正归属、socket、源码绑定浏览器、精确二进制
四消费者保护及这些受保护规范门禁后已接受。R1–R8 已本地接受；仓库原生发现及
必需局部预览 `2`/拒绝 Apply 保持可见。独立平台权限依据审计
`762571dab9a07651ac8e4c71764bfef292f8d5eba729a089e72d9d755b7e2d7c`
确认初始契约验证实际执行架构：macOS arm64、原生 Linux arm64 与模拟 Linux
amd64。Darwin amd64 保持实验归档，实际执行失败/运行时未验证。

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
| 最终 A18/平台/归档交付 | 已在下文 2026-10-04 增补中完成 |

先前 R1–R7 节、完整调用失败及限定接受
收据保持不变。临时验收文件留在规范内容和 Git 外。

## 2026-10-04 当前运行时完成增补 {#a18}

本增补记录 2026-10-04（Asia/Shanghai）的当前候选。带日期页面 URL 与初始
2026-10-03/R1–R7 记录保持不变。三个 UI 文件与已通过浏览器验证的字节/完整模式
准确相同；当前 Go、Hugo、平台、归档与四消费者检查刷新变动后端。

首次当前 ARM 离线单元运行发现真实产物复制完整性缺口：ext4 上增加目录项时，
父目录分配大小和实际观察时间戳可能不变。该失败运行在后续验收前停止。有界
修正捕获并重新验证实际排序目录成员及项身份，同时保留常规文件字节/完整模式
证明。仅 `internal/app/studio_output.go` 与其归属测试变更。失败收据和独立审计
保留。

前一完整性修正验收的完整冻结为 `683daca0e522193c7ff1b0de6ac2fee5d2fca080811bf184a8dfd5b90a33f224`：
123 个运行输入哈希为 `d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`，
212 个完整 CLI 输入哈希为 `2abd1a044d8192b07f9bbc06b55dc8b4544d66ca17b8867971cec702ba3af088`。
`0.5.0-r8-local` Darwin arm64 候选为
`74ad94e73557f6538cd64edd1766d6df92c596d98411031159d94af072c186ec`。
下列已观察的完整性修正收据绑定前一源码范围。
后续单个归属夹具修改具有独立完整源码身份和已完成的正式验收边界，如下记录。

当前完整源码冻结现为
`196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`。
123 个运行时输入保持
`d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`；
212 个完整 CLI 输入为
`2c487bfb4c65ed40ff78356b2860de627e6ac1afa0da2df433b09345dab7f5b0`。
只修改发布缓存归属测试，其源码为 `54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`。
夹具修改有独立保护，生产字节与全部语义断言保持不变。该完整源码的八项当前
归属门禁、刷新归档与完整 plain-Go AMD/ARM 正式验收已通过。根 A18 证明
`2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` 绑定全部三个声明支持目标与五份复现归档。

| 当前证明与保留的此前输入边界 | 已观察结果与绑定收据 |
| --- | --- |
| 新完整源码的正式验收 | 冻结 `196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`、归属测试 `54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`、运行时 123 个输入未变。当前八门禁、host/归档及完整 plain-Go 双 Linux 流程通过，由根 A18 证明 `2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` 绑定 |
| 有界完整性修正 | 归属收据 `6966d768025497b45958073d4c53a2a2981065c8a95857834dcf6a4faa4f0201`；独立审计 `6cb5d2eabf57b41079026a38a674f46def9f56a15df17ad27e671e4f765798df` |
| 前一源码六项归属门禁 | 构建、完整离线 Go 单元/vet、完整实际 Hugo/固定工具、核心 race 与公共 R8/输出 helper race 均为 `0`；耗时 3.501/68.257/3.909/333.801/37.070/79.670 秒。汇总 `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`；独立审计 `20780662b7ff35019b2c8c84e6dc763f9351ae0816f6ef7a7789f7a15be99167` |
| 八项当前冻结归属门禁 | 发布缓存实际 Hugo 与 race、构建、完整离线单元/vet、完整实际 Hugo/固定工具、核心 race 与公共 R8/输出 helper race 均为 `0`。当前汇总 `d6272fcc4dfab114aecfcdf19a7e2b78f1e931817331b460f43ff2056bf754a4`；完整 Hugo 原始记录 435 项顶层通过、零失败、两项可选顶层跳过及明确长路径 socket 子项跳过，运行时/二进制字节未变 |
| 前一源码 Darwin arm64 与归档 | 当前提取候选在 checkout 外运行，无消费者 Node 要求。17 个命令和八项实际进程测试（含子进程信号）通过，进程测试无跳过。两个新 release 目录中的五份归档/校验和字节相同，源码/许可证/来源/规范 tar 验证通过。汇总 `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1`；独立审计 `60a04771365d8be15ac91fbbd8d485b019aae081598e468018861ca5734e387c` |
| 当前 Darwin arm64 与确定归档 | 17 项提取归档/普通 Hugo/进程命令达到预期退出，缺少 Hugo 明确为 `2`；八项实际信号/进程案例无跳过。两个独立新构建从当前完整源码复现五份字节相同归档。汇总 `3890fd8468b6bce5271bb32ffa1a18bd5daf99c19c43becac0be8e3b908a5d57`；源码、工具、模块缓存与 smoke 源码保护准确一致 |
| 前一源码 Linux arm64 | 在 ext4 上以非 root 用户实际运行 Linux arm64，Go 1.27.1、Hugo Extended 0.166.0、Git 2.47.3：完整离线 Go 单元/vet、13 项必需纯测试顶层通过记录，目录成员项及四个子项无跳过、10 项选定实际 Hugo（无跳过）、原生重构归档身份、安装后二语言/离线/普通 Hugo/缺少 Hugo 为 `2` 的 JSON 与信号/源码模式检查均通过。guest 汇总 `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7`；外层收据 `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898`；导出记录审计 `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` |
| 当前 Linux arm64 | 当前 Linux arm64 在 ext4 上以非 root 用户实测（QEMU HVF 原生 ARM），Go1.27.1/HugoExtended0.166.0/Git2.47.3：完整离线单元/vet（370 项顶层通过）、13 项决定性纯测试及四项成员子项无跳过、10 项选定实际 Hugo 无跳过、当前归档原生/安装字节身份、双语/离线/普通 Hugo/信号流程通过。24 命令达到预期退出，含缺少 Hugo 为2。guest `268102f69c0950f9d2994d22cd2fd290fc11e24bd6d6f916fd70a93ca4946c74`；外层 `f3c066fdc9b97feff92160346185a1af978a5172eed5c81904ac7c0e5fc6c982`；源码/SDK/借用输入/旧任务保护准确一致，独占 VM 回收。默认可选单元跳过保留具名门控原因 |
| 前一源码 Linux amd64 失败试验 | 当前 TCG 试验失败；原外层收据 `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`、guest 汇总 `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240` 保持不变。完整离线单元（370 项顶层通过）、vet 和前三项选定 Hugo 案例通过；发布缓存候选请求触发测试 HTTP 客户端的 90 秒截止时间，候选一致性、其余六项选定 Hugo、原生重构归档及安装归档 smoke 尚未执行。截止时间审查 `12917b9eb89e3abc5893e08da3b6b6e20743dcb4c14e6f7ba8561628e3566934` |
| 当前 Linux amd64 | 当前 Linux amd64 在 ext4 上以非 root 用户实测（QEMU TCG 模拟），Go1.27.1/HugoExtended0.166.0/Git2.47.3：完整离线单元/vet（370 项顶层通过）、13 项决定性纯测试及四项成员子项无跳过、10 项选定实际 Hugo 无跳过、当前归档原生/安装字节身份、双语/离线/普通 Hugo/信号流程通过。49 命令达到预期退出，含缺少 Hugo 为2。guest `3a1a32979efc843de8b95b7c13824026e17f71c06d4c458b738c0b9583fb4723`；外层 `30cf4950cc83fa0732047d9a0f89bb59e68779ee2e8f5c755724c9679be265e3`；源码/SDK/借用输入/旧任务保护准确一致，独占 VM 回收。默认可选单元跳过保留具名门控原因 |
| 运行时等价的此前四消费者候选语料 | 源码时期 `683daca0…33f224`；运行时 123/二进制 74ad 与当前 `196245a3…42d43` 字节相同，单测试修改后未重跑语料。853.249 秒；原生/候选原生 `0/0/0/1`，API/视图 `0/0/0/2`；诊断 `28/144/120/11250`、覆盖 `29/34/41/29`。汇总 `a1e98ca3e10095a1134381666bacf256f8e8827cd3900c9e811b7120de4c2974`、收据 `05c4562a50d9f83ba2c99879ec841870c5e753199e41792bd5bc718cf8046e7b`、独立审计 `3a1b0b6e3a8c6b1a0d82c5f82b46c84b1e44d6c30bab655610cb9e86e6a30b47` |
| 最终规范生命周期与渲染检查 | 晋升 TEN 字节使用独立规范渲染及导航/URL 收据 |

此前六门禁 `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`、host/归档 `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1` 与 ARM 外层 `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898` / guest `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7` / 审计 `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` 与新准确源码证明共同保留。历史 26 项 axe/截图与 22 项 codec 案例依据未变 UI/codec/运行时输入复用。

首次 `max` CPU 的 AMD 试验保持失败：收据 `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`、guest 汇总 `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240`。测试客户端等待候选响应头 90 秒后超时，候选一致性、其余六项选定 Hugo、原生重构/安装 smoke 未执行。guest 输入保持准确；host 保护只记录 `.git` 目录时间戳变化。独立 qemu64 单案例 preflight 也在未变更的 90 秒 HTTP 客户端截止时间失败：外层收据 `fc68173ccdfd8ce263ecdf082a533d9da666a4cc2e1e5e29880ee827286132ac`、guest 汇总 `e350ff65feeee166ffac1d337db9bbd70d3895b1fb6d93df0a30ca4de09019fc`。具名案例耗时 177.71 秒，首次为 176.64 秒。其输入准确保留、VM 已回收。

随后 Go overlay 诊断保留相同生产源码与全部原语义断言。
外层收据 `0bc6d563b7cd9ca862717c2123ee0836d83b6b927d00204a0b031049c38e93f0`
与原始记录绑定分类
`66a1422cdb79ab9f1cf683f441ade0ce4adb4a7a666d524c4b9ed98ebee28708`
记录具名案例在 352.40 秒内通过。原始捕获耗时 26.254 秒、Studio 捕获 26.211、
候选 HTTP 94.312、直接预览 94.318、CLI 预览 81.962。两份图均保留 1,256 个
唯一输入，其中模块输入 1,198 个。HTTP 返回时旧的原始捕获 context 已过期；
独立的新直接/CLI context 正常完成。全部 20,564 项 host 保护与五对 guest 命令
保护准确一致，独占 VM 正常回收。限定归属夹具修改现为该候选请求及独立直接/CLI 操作各提供 300 秒，
约为已观察最慢操作的 3.18 倍。一般/原始捕获 90 秒限制、共享客户端恢复、
15 秒 shutdown 与 Go 默认十分钟上限不变。

消费者 driver 比较 API 与 CLI 的完整类型化诊断、覆盖、原生退出、PlanID、所选
Base/After/完整模式、统一 diff 与所选源码，另外独立验证完整字面 API 审阅及其
哈希。附件和 no-op 的所选页面保持审阅 Base，页面文件编辑匹配审阅 After。
非问题视图为有界样本，所有问题/页面分页读取。53 个保护操作具有 212 次全四站
逐操作源码证明与四次整体证明（四种清单类别共 864 对原始清单），以及 53 对
根清单。绑定 71 份保留产物。没有 Apply、保存计划或消费者写入。已完成语料的
纯文件 collector 因旧试验/self-test 文件不在新目录而保留两次元数据修正；未重跑
CLI/Hugo 操作。

仓库保留 10,462 项已有重复 ID 发现和 788 项审阅信息。所选实际 DFE HTML 可用，
四份过大实际 PRINT 文件保持不服务（`413`，响应正文零字节）：
`_print/pkg/index.html` 73,976,221 字节、`_print/pkg/pgsql/index.html` 69,903,999、
`zh/_print/pkg/index.html` 73,086,240、`zh/_print/pkg/pgsql/index.html` 69,052,754。
逐文件 64 MiB 预览上限不变：必需局部预览未完成仍为 `2`，原生发现仍为 `1`，
Apply 被拒绝。

Linux 前置条件在独占私有 guest 中依据签名 Debian 元数据预备：准确十个新包和
三个获准既有包升级，安装前后均验证。SDK/Hugo/模块缓存独立供应后离线复用。
验收在 ext4 上以普通用户运行，缓存输入及全部 212 个源码文件的字节/完整模式受保护。
默认单元跳过保留实际门控或
不适用原因，所有必需纯测试顶层、无跳过目录成员子项、选定 Hugo 与信号案例必须执行。Linux amd64 在
ARM 主机上通过 QEMU TCG 明确模拟。Darwin amd64 保持实验归档：实际执行
返回 Bad CPU type（errno 86）。Windows
不在声明范围。

当前 Linux 归档摘要为 `ac883e54a1df0b820696279c63881ba75a00d279f507330128fe8d5aff59c52e`
（arm64，4,552,687 字节）与 `2dde43bf94ef35aac2111b07dcb9b2766fbf9f883fe39ccd646d14a98b94d734`
（amd64，5,034,668 字节）。此前 `683daca0…33f224` 的摘要
`c191383af21913be6940ec41be11755b3d985344bbc0f65cc3f5de16424a96a4` 与
`6531b27d889260afe804c1f49f37541fbae46e57b5d17a20178c28cb51968794` 保持历史范围。SDK/guest 准备失败、
首次 ext4 成员检查失败及此前私有 host 元数据/resources 试验保持不可变证据。
未启动 E1–E4 是独立非活动范围。
