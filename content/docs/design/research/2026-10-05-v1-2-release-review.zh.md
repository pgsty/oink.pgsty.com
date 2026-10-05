---
title: OINK 1.2 发布前审查，2026-10-05
linkTitle: OINK 1.2 发布前审查
description: 本地 1.2.0 候选版本的审查、清理、兼容性、资源来源与出版验证，以及发布边界。
weight: 15
icon: fa-solid fa-clipboard-check
design_kind: research
design_status: local-verification
research_date: 2026-10-05
---

> [!IMPORTANT] 本地候选版本证据
> 本次审查覆盖 10 月 5 日工作树，包含尚未提交的修改。
> 它不代表某个不可变发布提交或已发布 1.2.0 模块的验收结果。
> 公开主题标签与文档站消费版本仍为 v1.1.0。

## 范围与输入 {#scope}

主题起点为 `a1979a4`，文档站起点为 `ed2d0e3`。受检工作树还包括 CJK 关键词
摘要、字面百分号大纲与仓库源文件路径修复，站点既有的英文编辑修改，以及下列
清理。独立可选 CLI 不属于本次主题发布范围。没有打标签、推送、升级消费站或部署。

多数检查使用 macOS ARM64 上的 Hugo Extended 0.166.0、Go 1.27.1、
Node 26.9.0 和 Playwright 1.62.1。选定兼容性检查使用经校验和验证的官方
Hugo Extended 0.160.1、0.165.0 二进制。这些是本地结果，不是完整 Linux CI
工具链的复跑结果。

## 审查发现与清理 {#findings}

| 发现 | 修正 | 影响 |
| --- | --- | --- |
| 1.2 发布草案遗漏新默认值与外观控件 | 同步两种语言的发布草案和升级说明，补充 Paper、Slate 兼容配置、独立持久化、当前状态图标及实验预设选择 | 读者升级前能明确看到外观变化 |
| 部分当前提案、决策、实验记录与源码注释仍描述字母预览、实验标记、独立 Default 卡片或未定发布版本 | 当前说明对齐紧凑图标/名称按钮、站点默认值恢复与 1.2 发布准备；保留有日期的历史测试证据 | 当前指南与已接受界面一致，不改写历史结果 |
| 工作树的一条忽略规则屏蔽站点整个 `tests/`，仅放行两个文件 | 删除宽泛规则，保留已有生成产物排除项 | 新增回归测试正常出现在 Git 中；没有删除测试或构建产物 |
| 开发预览不会暴露仅生产环境加载的统计服务 | 检查严格生产产物，区分核心本地资源与显式配置服务 | 本地优先承诺具有可观测边界 |

这些清理没有要求新增运行时修改。工作树原有运行时修复由各自检查器及最终集成
测试覆盖。

## 已执行验证 {#verification}

本地候选版本通过下列技术性发布前检查，在受检范围内没有发现阻塞发布的主题
缺陷。数字均为本次工作树审查的带日期快照。

| 检查 | 结果与范围 |
| --- | --- |
| 预设检查器 | 通过：7 次告警即失败的配置构建、28 个文档根节点、浅深色变量对齐、三类表面的文字/链接/强调色 AA 检查及冻结的 Slate v1.1.0 基础色板 |
| 运行时测试 | 49 项 Node 测试通过，覆盖当前状态图标、搜索摘要、大纲跟踪、剪贴板与对话框焦点 |
| 主题回归与工具检查 | 40 项检查器/工具命令通过，包含 90 项迁移测试、快照/消费站安全与现有产物 golden；随后指定浏览器复跑 PDF 检查，3 项隔离测试全部通过 |
| 文档检查 | 最终 `make check` 的 57 项测试通过；检查 143/143 份双语文件、1,197 个源标题、228 个渲染内容页及站内链接；Markdown golden 仅按审阅结果更新新增研究索引条目及发布标题/描述 |
| 标准浏览器套件 | 一次完整 `make browser` 运行的 9 个套件、219 项检查全部通过，包含 372 个路由的完整 sitemap axe 扫描；无失败、不稳定或跳过项 |
| 文档补充检查 | 用新构建单独扫描 14 个修订后的中英文路由，包含本报告新增双语页面，axe 检查通过；这补充了之前的完整 sitemap 扫描 |
| 浏览器引擎 | Chromium、Firefox、WebKit 在 390/1440 px 的 6 项外观检查通过；覆盖 CSS 前状态恢复、键盘选择、持久化与焦点返回；桌面 Chromium 还使用 4 倍 CPU 限速 |
| 视觉抽查 | 查看本轮真实产物截图：中文移动端 Paper 菜单、英文桌面深色 Paper 菜单，以及中文 Terminal 移动/桌面阅读页；确认两列图标/名称选项、当前状态图标与阅读布局 |
| Hugo 兼容下限 | 0.160.1 通过预设及阅读/数学检查器，以及真实文档站严格压缩生产构建 |
| CI 使用的 Hugo 版本 | 0.165.0 通过真实站点严格压缩生产构建、Hugo Module/include/static/print 检查、系统字体、旧 Sass 字体覆盖，并按预期拒绝非法字体预设 |
| 生产资源 | 四套风格、七类路由共 28 次访问；核心字体与脚本来自站点自身 origin，显式外部服务另行记录 |
| 生产产物安全 | 按已记录的第三方集成策略，最终严格生产构建的 921 个文件检查通过 |
| Book 出版 | 根路径与子路径 EPUB 均通过主题检查器及 EPUBCheck 5.3.0，零错误、零告警；两份 PDF 通过 23 页、5 章结构检查；根路径 PDF 脚本隔离探针通过 |
| 已发布消费版本 | 禁用环境替换及两个 workspace 后，既有 v1.1.0 解析与站点 release-pin 检查通过；这不是已发布 v1.2.0 的验证 |

完整 sitemap 扫描沿用站点现有 axe 策略：检查 OINK 维护的界面，阻断 Giscus
请求，排除 Swagger UI/Redoc 的供应商 DOM。结果不代表这些组件自身的无障碍
验收。响应式检查覆盖 360、768、820、1024、1200、1440 px，以及中英文、浅深色。

外观检查在四套预设、中英文、390/1440 px、浅深色下使用相同首页、配置、提示块
与标签页内容；也覆盖搜索、代码、表格、输入/焦点状态、Blog、Book、API、图表
与打印。Ink、Terminal 仍需显式选择，测试通过不等于把实验提升为稳定预设。

出版使用本地 Pandoc 3.11、Java 26 和 Chrome headless-shell 151.0.7922.34。
第一次使用完整 Chrome for Testing 应用时在本机超时。像 CI 一样显式选择
headless-shell 后，生成的 PDF 通过验证。结果不代表所有 Chrome 安装均兼容；
CI 在 Linux 上固定 Pandoc 3.10 与 Java 21。

## 本地优先的资源边界 {#local-resources}

IBM Plex Sans、Inter、IBM Plex Mono、Chakra Petch、图标、KaTeX 字体与
核心浏览器库均已本地化。预设切换没有引入运行时字体服务或 CDN 脚本依赖。
系统字体模式与显式字体角色覆盖保留其约定优先级。

生产审计在每套预设下访问首页、中文配置、数学、Mermaid、Markmap、ECharts
及 OpenAPI，再切换浅深色。测试保留生产 base origin，由本地产物提供响应。
请求追踪记录并阻断跨 origin 请求；本地字体与图表仍加载成功，没有未捕获
JavaScript 异常或本地 HTTP 错误。

两个已配置服务会请求外部脚本：Giscus 与 Google Analytics。Giscus 是已接受的
可选评论集成，其 OINK 色板文件来自本地。文档站原本配置了统计 ID，因此生产
产物包含 Google Tag Manager 脚本。二者都不是新预设的必要依赖。本次保留
这些配置，文档站因此不作“零外部请求”的承诺。作者引用的远程媒体与显式选用的
图表服务也保留既有可选边界。

## 复现检查 {#repeat}

先运行主题归属检查，再检查真实站点。以下命令通过约定的 Make 目标选择同级
主题，不能把文件系统模块替换提交进仓库：

```bash
python3 bin/check-presets.py
node --test 'tests/js/**/*.test.js'
make -C ../oink.pgsty.com check
env -u A11Y_PATHS -u PLAYWRIGHT_BASE_URL make -C ../oink.pgsty.com browser
```

完整主题检查器与出版命令定义在 `.github/workflows/ci.yml`。用新构建的 fixture
运行所有归属检查，覆盖参数/Schema、vendor/字体、导航/搜索/操作、组件、
产物/命名空间/golden、迁移、快照保护、消费站工具及 PDF 隔离。
文档站的独立引擎套件为 `npm run test:appearance:engines`。

兼容性检查将选定 Hugo 二进制放入 `PATH`，禁用继承的 Go/Hugo workspace，
并明确同级模块替换。真实站点用 `--environment production --minify
--printPathWarnings --panicOnWarning` 构建到独立输出目录。检查已发布 pin 时，
还须禁用模块替换；两者是不同验证目标。

## 剩余发布步骤与边界 {#release-boundary}

本地技术性发布前验收通过。正式发布仍需把受检修改整理为提交，
在这些精确提交上运行 CI，发布标签及模块归档，完成消费站采用与托管验证。
仅修改版本号不能替代这些步骤。发布说明仍为草案，既有消费站 pin 没有改变。

尚未验证真实 Windows/Android 设备上的字体表现、人工屏幕阅读器朗读与首绘
逐帧画面。Windows 源文件路径行为使用确定性 fixture 验证，没有使用 Windows
主机。Ink/Terminal 设计后续项仍见
[实验记录](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/#remaining-work)。
