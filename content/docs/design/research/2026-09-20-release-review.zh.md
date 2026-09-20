---
title: OINK 1.1 发布审查，2026-09-20
linkTitle: 2026-09-20 发布审查
description: OINK 1.1 的五项已复现运行时缺陷、文档修订、验证证据与发布后续。
weight: 50
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK 1.1, 发布审查, 侧栏就绪, 命令面板, 焦点, 键盘导航]
design_kind: research
design_status: review-snapshot
last_verified: 2026-09-20
---

> [!NOTE] 发布准备，不是发布声明
> 本文分别记录审查基线、已提交修复、已完成验证与尚待执行的发布步骤。基线 CI 通过不能
> 证明后续修复也已通过验收。从正文到“限制”保留发布前快照；后续已核实的发布证据追加在
> [发布后续](#publication-follow-up)中。

## 范围与基线 {#scope-and-baseline}

审查从主题提交
[`75052f8a3106d13ef313644836a5ad545135f484`](https://github.com/pgsty/oink/commit/75052f8a3106d13ef313644836a5ad545135f484)
开始，此时社区反馈与图片复制修复已经进入 main。范围包括 `v1.0.0..main` 差异、
[#40](https://github.com/pgsty/oink/issues/40)、
[#41](https://github.com/pgsty/oink/issues/41)、
[#42](https://github.com/pgsty/oink/issues/42)、
[#44](https://github.com/pgsty/oink/issues/44) 与已合并
[PR #43](https://github.com/pgsty/oink/pull/43) 所要求的行为，以及双语文档和发布边界。
[前一轮调研](/zh/docs/design/research/2026-09-19-upstream-review/)
记录了原始反馈及其实施过程。

方法是检查拥有相关行为的 JavaScript、模板与契约，通过定向回归覆盖状态转换，比较修复前
失败断言与修复后的实现，再运行主题检查器和真实同级文档站的集成、浏览器套件。本轮不扩展
新的功能计划，也不声称进行无边界的完整安全审计。

截至本次快照，公开版本、文档站 `go.mod` 固定依赖与配置中的公开版本仍为 `v1.0.0`。
博客消费站固定的主题版本保持不变。

## 发现与修复 {#findings-and-repairs}

本轮复现并修复了五项 P2 正确性缺陷，已提交为
[`08f6563`](https://github.com/pgsty/oink/commit/08f656303ba4b1299db92973bc02a4c5d3ba1ca3)
并推送 main。它们涉及新增 API 的时序和既有焦点、导航行为，
不需要新增配置格式或迁移正文内容。

| 发现 | 触发条件与观察到的问题 | 最小修复 |
| --- | --- | --- |
| P2：侧栏就绪早于活动路径补全 | 消费代码等待 `OinkSidebar.ready` 或监听 `oink:sidebar-ready`；就绪微任务可能在两个 `DOMContentLoaded` 监听器之间执行，早于缓存侧栏的活动路径补全，读到不完整的初始状态。 | 把就绪通知放入下一任务，等待初始化监听器与右侧内容搬迁完成，保留 ready Promise 和事件契约。 |
| P2：待完成操作仍可进入原生选择菜单 | 启动异步搜索扩展操作后，再激活主题切换等原生选择项；pending 检查位于选择分支之后，选择菜单会替换待完成操作的结果行。 | 将 pending 检查移到所有行类型分支之前；操作完成后恢复正常的选择项激活。 |
| P2：右侧 TOC 整栏折叠后仍可聚焦 | 桌面端收起右栏后，隐藏的按钮与链接仍是键盘目标，焦点也可能留在隐藏面板内。 | 为右栏面板设置 `inert` 和 `aria-hidden`，把焦点交给可见恢复按钮，恢复时归还栏内按钮；右侧内容搬迁后不继承原栏隔离。 |
| P2：方向键跳过无链接分组 | 从分隔分组的子页按 Left/`a`，无法稳定回到父分组按钮并折叠；分组按钮不在树的焦点序列中。 | 将分组展开按钮纳入树焦点导航，按直接父级回退；Right/`d` 展开或进入分组，上一页/下一页仍只遍历页面链接。 |
| P2：抽屉焦点循环计入 inert 后代 | 在移动抽屉中折叠右侧搬入的分组，再按 Shift+Tab 循环；隐藏后代仍被计作可聚焦元素，可能导致循环失败或焦点停滞。 | 从抽屉可聚焦集合排除 `inert`、`hidden` 祖先内的元素，以及 visibility 为 hidden/collapse 的控件。 |

实现与回归归属：

| 发现 | 主题实现 | 拥有该行为的回归检查 |
| --- | --- | --- |
| 就绪时序 | `assets/js/sidebar-state.js` | `tests/js/sidebar-state.test.js`；站点 `tests/browser/community-feedback.spec.mjs` 在两种就绪信号中读取 EN/ZH 活动路径快照 |
| 待完成选择 | `assets/js/command-palette.js` | `tests/js/command-palette.test.js` 覆盖扩展待完成 → 原生选择 → 完成 → 选择恢复可用 |
| 右栏焦点 | `assets/js/docs-shell.js` | 站点 `tests/browser/community-feedback.spec.mjs` 覆盖 EN/ZH 折叠、Tab 遍历、恢复、重载和桌面/平板/手机搬迁 |
| 分组按键 | `assets/js/keyboard-nav.js` | `tests/js/keyboard-nav.test.js` 覆盖 LTR/RTL、方向键/WASD 与仅链接翻页；站点社区回归覆盖真实 EN/ZH 分组 |
| 抽屉循环 | `assets/js/docs-shell.js` | 站点社区回归折叠已搬迁分组，执行 Shift+Tab 与 Tab 循环，并断言焦点不进入 inert 或 hidden 子树 |

修复前，就绪时序与待完成选择的新增单测在旧实现上失败；右栏隔离的浏览器断言也在中英文
两种页面上失败。修复保持局部：调整就绪通知时序、提前一项 pending 检查、明确右栏隔离、
补齐树焦点目标和抽屉可见性过滤。

这些改动保留已有结果：两个根收集器都遵守 `sidebar_root_menu: false`；无链接分组保留
子页；指针聚焦不引入正文大边框，键盘提示仍然可见；搜索扩展保留取消与交接契约。图片预览
继续通过无障碍名称表达操作，不向复制的正文插入辅助文字。最终回归结果在下方单独记录，
不由源码检查推断通过。

## 文档准备 {#documentation-readiness}

当前使用文档更新覆盖 28 个文件、14 组 EN/ZH 页面：

- 六组 Design 契约使用 `candidate-v1.1.0`，描述 main 已实现行为，不提前声明正式发布。
- 导航、布局和 front matter 指南对齐根过滤、分隔分组、双语部署路径、居中顶栏、窄屏抽屉
  与原位淡入的顶栏行为。
- 内容组织和命令面板指南说明运行时加载顺序、就绪、能力检测，以及站点负责的持久化和集成。
  键盘与图片指南说明修复行为和旧版本边界。
- 安装指南区分验收工具链与公开版本；既有标题 ID 保持稳定，新增侧栏 API 标题的中英文
  ID 匹配。

另已准备两份 1.1.0 发布注记和两份升级指南。发布注记保持 draft/candidate 状态，首页中英
发布入口都回到已公开的 1.0 版本。这些源码修改没有更新站点模块依赖，也不代表新行为已经
部署。历史研究继续保留当时的观察，不为消除旧状态而重写。

## 验证快照 {#validation-snapshot}

下表数字是主题 `08f6563` 在 2026-09-20 的验证快照。站点验收通过命令作用域内的模块
替换使用同级 checkout，不证明尚未发布的模块标签可用，也不代表已经部署到生产环境。
本地站点检查使用 Hugo Extended 0.166.0、Node 26.9.0 和 Playwright 1.62.1；候选版本
CI 使用固定的 Hugo 0.165.0 工具链。0.160.1 下限使用官方二进制单独验证。

| 检查 | 结果与范围 |
| --- | --- |
| 基线 `75052f8` CI | 三项全部通过：固定 Hugo 工具链、浏览器运行时测试和 Book 出版。[精确基线运行](https://github.com/pgsty/oink/actions/runs/35453496911)。 |
| 修复后的 JavaScript 单测 | 通过：44 项。 |
| 官方 Hugo Extended 0.160.1 | 定向 i18n 与 shell 检查通过；i18n 覆盖 32 份语言包 × 194 条消息。真实文档站也以本地候选主题通过 `--panicOnWarning` 生产构建，每种语言 376 页；不输出发布草稿，两个首页入口均指向 1.0.0。这是部分兼容下限证据，不是第二套完整 CI 矩阵。 |
| 双语源码与样式检查 | 包含本报告后通过：129/129 组页面、988 个源标题、Markdown 样式和 `git diff --check`。 |
| 最终定向主题检查器 | shell、palette、keyboard 与 image zoom 全部通过。 |
| 最终真实站点非浏览器套件 | `make check` 全部 57 项通过；检查 200 个正文页面、331 个含链接 HTML 页面、39,803 条内部链接与 3,863 个锚点链接。仅更新发布摘要和文档索引这两份预期变动的 Markdown golden。下限版本的生产构建也通过链接检查：327 页、39,059 条内部链接与 3,833 个锚点。 |
| 最终浏览器套件 | `make browser` 的八组 Chromium 测试全部 149 项通过：无障碍 30、响应式/博客/Palette 45、键盘 16、内容组件 14、代码块 18、场景 4、主题色 5、社区回归 17。包含完整多语言 sitemap、六种屏宽、深浅色、强制配色、剪贴板与无脚本场景。 |
| Agent 文档抽样 | 50 个同源页面得分 93/100（A）；抽样链接均可解析，49 页提供 Markdown，270 处代码围栏均正确闭合。检查器提示 HTML 中的 `llms.txt` 发现提示缺失或位置过深。 |
| 渲染审查 | 查看了中文发布注记的桌面深色布局与英文窄屏浅色布局。右栏收起后，其后代从无障碍树移除，焦点交给恢复按钮；恢复后焦点返回栏内可见按钮。 |
| 最终主题版本及其 CI | `08f6563` 的 Hugo 0.165.0、浏览器运行时测试和 Book 出版三项全部通过。[精确候选运行](https://github.com/pgsty/oink/actions/runs/35477171223)。 |
| 公开 v1.1.0 标签、消费站点升级与部署 | 未执行。 |

在本轮审查与验收范围内，未发现尚未解决的实现阻断项，可以进入下方发布流程。

在同级 checkout 中复核，开发期间保留公开依赖固定版本：

```sh
# 在主题仓库执行
node --test tests/js/*.test.js
python3 bin/check-shell.py
python3 bin/check-palette.py
python3 bin/check-keyboard.py
python3 bin/check-image-zoom.py

# 站点 Make 目标使用命令作用域内的同级模块替换。
make -C ../oink.pgsty.com check
make -C ../oink.pgsty.com browser
```

## 待执行发布步骤 {#remaining-publication-steps}

尚未执行发布。最终版本通过验收后：

1. 确定 `CHANGELOG.md`、发布日期与发布记录，从通过验证的主题提交发布 v1.1.0 标签
   和 GitHub Release。
2. 验证模块代理可将该标签解析到预期提交。
3. 一并更新文档站固定依赖、版本配置、首页发布入口、契约状态，以及发布注记的
   `draft: false` 状态。
4. 不使用 `HUGO_MODULE_REPLACEMENTS`，从已发布依赖重新构建并验收文档站，再部署
   并检查公开路由。

最终结论必须标明被测主题提交，分别说明本地源码验收、公开模块可用与实际部署结果。

可以后续改进的是：为从 HTML 进入的 Agent 提供位置更靠前、一致的 `llms.txt` 发现提示。
这项评分告警不影响现有 Markdown 输出，也不要求在 1.1 前增加新功能。Safari/Firefox
检查与真实知乎编辑器粘贴验证也是有用的后续工作，本轮 Chromium 验收不涵盖它们。

## 限制 {#limits}

浏览器证据来自 Chromium，不是 Safari/Firefox 矩阵。无障碍门禁覆盖主题自有界面，保留
对 vendored Redoc 与 Swagger UI 的既有排除。原生剪贴板回归覆盖纯文本、富文本
HTML、图片描述与作者图注，但不证明真实知乎编辑器的粘贴行为。本轮没有修改或验收博客的
依赖固定版本及线上产物。Hugo 下限的定向检查，也不代表该版本上所有出版路径都已执行。

这是对明确源码与行为的发布准备审查，不声称无边界的安全覆盖、生产上线，或支持额外的新功能。

## 发布后续 {#publication-follow-up}

审查之后，[v1.1.0 正式版](https://github.com/pgsty/oink/releases/tag/v1.1.0) 已于
2026-09-20 从提交
[`3a18234`](https://github.com/pgsty/oink/commit/3a18234aa3af15ae12e2d53839ffd321ef4bcb62)
发布。该版本相对已验收的 `08f6563` 实现只修改更新日志。创建附注标签并发布稳定版
GitHub Release 前，全部三项[发布提交 CI](https://github.com/pgsty/oink/actions/runs/35482327047)
均已通过。

仅使用官方 Go 模块代理、从全新缓存下载的版本准确解析到该提交。`.info`、`.mod`、
`.zip`、版本列表条目与签名校验和记录均已验证。模块校验和为
`h1:121L5g57ChRCPyidzEBBcln2Co+0zYRQ+XDDXjymd0Q=`，`go.mod` 校验和为
`h1:pHvbUhJCfseB41n5RGwsF7abT3i32VSTpofLQoq4b7Y=`。
公开记录见[代理版本信息](https://proxy.golang.org/github.com/pgsty/oink/@v/v1.1.0.info)与
[校验和条目](https://sum.golang.org/lookup/github.com/pgsty/oink@v1.1.0)。

文档站发布更新在 `go.mod` 与 `go.sum` 中固定 `v1.1.0`，同步公开版本标识和双语首页
入口，公开两篇发布注记，并将六对契约标记为 `released-v1.1.0`。上方历史验收表继续
描述此前的同级 checkout 运行。公开依赖的验证单独记录在本站的
[Site checks](https://github.com/pgsty/oink.pgsty.com/actions/workflows/site-checks.yml) 和
[Browser quality](https://github.com/pgsty/oink.pgsty.com/actions/workflows/browser-quality.yml)
工作流中，两者均关闭 Go 与 Hugo 模块工作区。

本地使用该公开模块通过了全部 57 项非浏览器测试、26 项命令面板与社区问题浏览器测试，
以及严格生产构建（每种语言 378 页）。这些检查均设置 `GOWORK=off`、
`HUGO_MODULE_WORKSPACE=off`，且未使用 `HUGO_MODULE_REPLACEMENTS`。完整的 149 项
浏览器套件另由发布提交的 Browser quality 工作流执行；其结果与此前本地候选版本的
运行记录分别记录。
