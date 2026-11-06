---
title: OINK 1.5.1 发布就绪审查，2026-11-06
linkTitle: 1.5.1 发布就绪审查
description: 三个已复现的候选版本回归、完整浏览器验收，以及尚待完成的发布关卡。
weight: 71
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-11-06
---

> [!NOTE] 本地修复验收完成
> 下述三个已复现的回归已在工作树中修复，针对性检查、主题、站点和浏览器检查全部通过。这份带日期的审查不代表版本发布、消费者升级或部署。

## 输入与方法 {#inputs}

审查范围为主题 `v1.5.0`（`84b93e4`）至 `c55849e`：标签后的全部六个提交、186 个变更文件。文档站版本为 `43990ac`。主题 `main` 比 `origin/main`（`d9ad654`）领先三个已提交的变更。初始审查前，两棵工作树均干净。下文保留初始证据，并单独记录后续修复。本轮未打标签、推送、升级消费者或部署。

正式本地工具链为 macOS ARM64 上的 Hugo Extended 0.168.0 及其内置 LibSass、Go 1.27.3、Node 26.12.0、npm 11.20.0 和 Python 3.14.8。CI 使用 Node 24。补充运行的 Hugo 0.169.0 检查不替代固定基线；允许的上游 LibSass 弃用警告保持可见。

方法包括实现与契约检查、主题 CI 有序命令、同级站点检查、生产构建、Chromium 测试，以及带对照组的最小复现。临时夹具和生成产物保存在 Git 外。本地主题和已发布模块分别验证，两种 workspace 机制均关闭。

## 已确认的回归 {#findings}

### P2：RSS 格式恢复污染其他渲染 {#rss-format}

`layouts/_partials/content/rss-description.html` 的最后一次赋值，把先前捕获的 `tdOutputFormat` 写回页面 Store，短代码也读取这份状态。复现中，摘要渲染把标志恢复成 `html` 时，页面自身的 RSS 短代码仍在使用该 Store，产生静态与交互内容混杂的输出。

正式运行的 `bin/check-release-assets.py` 失败：RSS 校验和表头缺失，并出现 `data-td-asset` 和 `<button>`。随后单独重跑完整检查通过，单页最小复现也连续八次通过；不能用重跑变绿来忽略第一次失败。

更可靠的复现方式是把该检查器的 RSS 夹具扩成 24 个仅输出 RSS 的页面，每页包含 `release-card` 和 20 个 `release-assets` 块。保留其自定义 `layouts/docs/single.rss.xml`：先设置 `tdOutputFormat` 为 `rss`，再调用 `.RenderShortcodes`；同时保留普通首页订阅源。用 Hugo 0.168.0 构建全新输出，检查各页面 XML 的交互标记。

候选版本连续三次都污染了 `docs/rss-9/index.xml`。其中一次包含六张静态表格、十四张交互表格和 28 个按钮。同一夹具改用已发布的 v1.5.0，连续三次正常；只在临时覆盖模板中去掉候选摘要 partial 最后的 Store 恢复，也连续三次正常。

已确认范围是必跑检查器覆盖的自定义 RSS 页面渲染，不能据此推断所有普通订阅源都受影响。修复应保证格式状态在对应渲染上下文中稳定，增加多页覆盖，并保留 HTML、Print 和普通 RSS 摘要的正确行为。临时去掉赋值只是因果验证，不是已验收的修复。

### P2：博客分页生成重复的 Print 聚合文档 {#print-pagination}

`layouts/_partials/head.html` 对所有博客分区调用 `shell/blog-index-state.html`，包括 Print。后者调用 `.Paginate`，使 Hugo 为每个归档页生成一份包含整个分区的 Print 文档。

使用三篇有日期的博客文章，设置 `outputs.section: [HTML, print]` 和 `params.ui.blog_index_size: 1`。候选版本生成 `_print/blog/index.html`、`_print/blog/page/2/index.html`、`_print/blog/page/3/index.html`，三份都包含全部三篇正文。只把 `head.html` 覆盖为 v1.5.0 版本，就只生成一份聚合文档。两个构建在 Hugo 0.168.0 下均成功。

文档站生产构建也在中英文博客根分区和发布索引中多生成四份聚合文档，总计 1,120,141 字节。大型归档会放大浪费。应把博客索引分页及其 head 链接限制在 HTML 输出，并验证 Print 只生成一份完整文档，HTML 分页链接仍正确。

### P2：Duo View 文档请求挂起后没有重试入口 {#duo-timeout}

`assets/js/document-compare.js` 在 iframe 地址为 `about:blank` 时直接返回，即使这是 15 秒超时后调用的 `ready(true)`。主文档请求一直 pending 时，会消耗超时回调，却没有调用失败处理；加载和 busy 状态一直保留，没有重试按钮或直达链接。

在同级站点浏览器夹具中，打开 `/tests/compare-reader/`，用 Playwright route 挂起 `/zh/tests/compare-reader/?oink_compare_pane=1`。打开双列视图并等待 17 秒：源窗格已就绪，目标仍为 `about:blank`，有一个加载提示、零个失败面板和零个重试按钮。

现有 404 和慢图片测试没有覆盖这种情况。超时应把仍为空白的文档判为失败，同时忽略初始空白加载事件，并保留慢图片下已解析正文的可读性。应在站点对比视图套件中增加文档挂起场景，保留[外壳契约](/zh/docs/design/shell/#translation-comparison)要求的本地化回退。

## 初始验证 {#validation}

| 检查 | 结果与范围 |
| --- | --- |
| 主题 CI 命令 | Hugo 0.168.0 下，本机可执行的 49 个步骤有 48 个通过。发布资产 RSS 步骤失败，主题验收并非全绿。 |
| 主题测试 | 81 项 JavaScript、90 项迁移、22 项快照与消费者工具测试通过。语言键一致性、schema、vendor 清单、输出 golden 和 Sass 边界检查通过。 |
| 站点 `make check` | 通过，包括 67 项 Node 测试，以及源文件、翻译、渲染 Markdown、渲染链接检查。 |
| 站点 `make browser` | 一次完整运行通过 518 项 Chromium 测试，约 23 分钟。未设置 `A11Y_PATHS`，站点地图扫描未缩小范围。 |
| 候选版本生产构建 | 本地主题与普通生产配置构建通过，仅有允许的 LibSass 警告。另行检查确认了 Print 重复。 |
| 出版隔离 | 真实 Chromium 的三项 PDF 安全测试全部通过，包括阻止远程 CSS 和禁用脚本。 |
| 出版冒烟测试 | 当前候选的 EPUB/PDF 生成及制品检查通过：五章、31 个 EPUB 目标、23 页 PDF。本地 Pandoc 为 3.12.1；未重跑 CI 固定的 Pandoc 3.10、Java 21、EPUBCheck 和子路径矩阵。 |
| 已发布基线 | Go 代理将 v1.5.0 解析到 `84b93e4`，校验和与站点记录一致。关闭模块替换和两种 workspace 后，发布 pin 检查与生产构建通过。 |

各浏览器组通过数量为：无障碍 30、响应式外壳 117、键盘 16、内容组件 70、代码与 Landing 37、PRD5 8、主题色 10、社区反馈 42、外观 53、Expo 50、博客画廊 8、PlantUML 8、图表 19、表格阅读器 15、常规对比视图 26、多语言对比视图 9。本地同级主题使用 `hugo.yml,tests/fixtures/browser.yml`，对比视图另有八语言夹具。本轮未重跑 Firefox 和 WebKit。

初始审查时的套件没有覆盖上文额外复现的文档请求挂起和 Print 输出数量问题。先前的[审查修复记录](/zh/docs/design/research/2026-11-06-review-repairs/)明确说明，其 508 项浏览器结果不包括后续 Duo View 工作；本轮为当前候选提供了新的证据。

## 修复验收 {#repair-verification}

修复基于主题 `c55849e` 与站点 `43990ac` 的工作树，尚未提交，也不在下文所链接的远端 CI 覆盖范围内。

- RSS 摘要渲染不再恢复陈旧的格式值。发布资产检查器新增 24 个 RSS 页面，每页 20 张资产表，与首页订阅源在同次构建中生成；逐项断言静态表格、完整校验和及没有交互控件。临时覆盖为修复前的 partial 时该检查失败，修复后的 partial 通过。
- 共享 head 中的博客分页仅用于 HTML。阅读检查器验证一份完整 Print 聚合、三个独立 HTML 归档页、正确的 HTML `prev`／`next` 链接，以及 Print 不含分页链接。临时覆盖为修复前的 head 时会生成三份 Print 聚合并失败，修复后的 head 通过。
- Duo View 区分文档超时与初始空白 load 事件。新增浏览器用例挂起目标文档，核对 Retry 文案和直达链接，并验证请求恢复后重试能重新打开窗格。修复后用例通过；既有慢图片用例继续覆盖正文就绪不必等待全部资源的行为。

双语架构与外壳契约、主题 Unreleased changelog 随修复同步。站点 LLMS golden 仅增加本研究页面的目录条目，更新前已审阅输出差异。

| 修复验收 | 结果 |
| --- | --- |
| 主题 CI 命令 | Hugo Extended 0.168.0 下，本地可执行的 49 步全部通过，含 81 项 JavaScript、90 项迁移、22 项快照与消费者工具测试。 |
| 站点 `make check` | 源文件与渲染检查、67 项 Node 测试全部通过。 |
| 站点 `make browser` | 最终完整运行通过 519 项 Chromium 测试：主套件 510 项，八语言对照套件 9 项。未设置 `A11Y_PATHS`，站点地图无障碍扫描未缩小范围。 |
| 生产构建 | 使用本地主题通过。中英文博客与发布索引均只保留一份 Print 聚合且没有 Print 分页链接；四份重复聚合均已消除。 |

浏览器验收使用已安装的 Playwright 浏览器，不覆盖可执行文件路径，让 bfcache 用例选择完整 Chromium。该用例与新增的文档挂起重试用例也分别通过。工具版本与上文一致，初始验证中的出版工具链限制仍然适用。

三个已复现的回归均已在本地解决。后续发布关卡仍是提交并推送已审查变更、针对该精确修订取得远端 CI 全绿，然后分别完成打标签、Go 代理验证、消费者 pin、部署与生产一致性状态。

## 发布与采用 {#publication}

本轮观察到的最新公开标签仍是 v1.5.0。成功的[主题 CI](https://github.com/pgsty/oink/actions/runs/42176246278)包含 Book 出版任务，但对应 `d9ad654`，不是本地 `c55849e`。成功的[站点检查](https://github.com/pgsty/oink.pgsty.com/actions/runs/42207218597)和[浏览器工作流](https://github.com/pgsty/oink.pgsty.com/actions/runs/42207218621)也只测试当时可取到的远端主题，不能替三个后续本地提交背书。

只读运行 `bin/update-consumers.py v1.5.0`，发现 50 个主 checkout：42 个 current、三个模块消费者因非默认分支而跳过、五个经典 `themes/oink` 消费者。45 个模块 pin 都是 v1.5.0。四个经典主题仓库干净且精确位于 v1.5.0 标签；剩余源代码副本的抽查实现文件一致，但这不是完整一致性审计。本轮没有升级或部署消费者，正式采用时须逐一处理跳过的分支和经典副本。

## 发布放行条件 {#exit-criteria}

三项修复、归属检查、浏览器覆盖与双语契约已在本地落地，上文记录的工作树验收已全绿。下一关是在最终发布提交上取得远端 CI 全绿。先前审查留下的设计与无障碍改进继续作为独立待办，本记录不宣称所有历史发现都已修复。

代码验收后，再整理 1.5.1 changelog 和当前版本引用，推送已审查提交，核对该版本的 CI。打标签、推送与 Go 代理验证、消费者 pin 和外观检查、部署、生产一致性验证，分别属于后续状态。这些是正常发布准备，应与本地修复验收分别记录。
