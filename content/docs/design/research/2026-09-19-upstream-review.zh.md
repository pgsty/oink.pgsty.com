---
title: 社区 Issue 与 PR 调研，2026-09-19
linkTitle: 2026-09-19 社区反馈调研
description: 对社区 Issue 40、41、42、44 与 PR 43 的证据核查、接收建议和具体解决方案。
weight: 40
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK 调研, 侧栏, 焦点, 栏目切换器, 搜索扩展, 社区反馈]
design_kind: research
design_status: review-snapshot
last_verified: 2026-09-19
---

> [!NOTE] 原始调研快照
> 本文记录 2026-09-19 的源码审查、GitHub 实时状态、本地构建与定向浏览器观察。
> 初始调研完成时，这些建议尚未成为已接受契约，功能也尚未实现；当时没有合并 PR、
> 发布版本或向贡献者发送回复。文末的实施补记单独记录了随后完成的变更。

以下保留最初的调研快照。随后维护者决定先合并 PR #43，再直接在 main 实施其余修复；
最新进展见[同日实施与验收补记](#implementation-acceptance)。

## 判断结论 {#verdict}

这些反馈都有值得处理的内容，但不能全部归为同一种缺陷。应优先修复隐藏导航仍能获得焦点的问题。
PR #43 的小修复方向正确，明确边界并补齐测试后可以接收。搜索尾部扩展与侧栏状态公开接口则属于
新增 API，应分别设计和验收。

| 项目 | 判断 | 建议 |
| --- | --- | --- |
| [PR #43](https://github.com/pgsty/oink/pull/43)，MagicFollower | 收集自根分区时忽略显式的 `sidebar_root_menu: false`，已复现 | 有条件接收：补丁正确修复全站候选集合，合并前说明当前根例外、补回归测试并取得 CI 成功记录 |
| [#41](https://github.com/pgsty/oink/issues/41)，imbajin | 整个侧栏隐藏后仍可聚焦；展开状态存在多处写入，缺少公开 API | 拆成无障碍修复与可选 API 两项工作，前者优先 |
| [#44](https://github.com/pgsty/oink/issues/44)，lloydsun | 点击后按键出现边框的现象真实，已在另一平台复现 | 改进正文容器的焦点样式，保留滚动区域必要的键盘提示；浏览器的判断机制本身符合预期 |
| [#42](https://github.com/pgsty/oink/issues/42)，aucru | 现有隐藏和分隔选项不能完整表达“不可跳转的分区标题，下面保留子页” | 先解释配置区别并获取作者的最小示例，确认后补齐分组能力 |
| [#40](https://github.com/pgsty/oink/issues/40)，imbajin | 当前确实没有受支持的接口，向搜索结果追加依赖本次查询的操作 | 合理的小范围扩展需求，不是现有本地搜索失效；优先级低于正确性修复 |

## 基线与方法 {#baseline-and-method}

通过 GitHub API 查到 4 个未关闭的外部 Issue 和 1 个未关闭的外部 PR。另一个未关闭的
[#37](https://github.com/pgsty/oink/issues/37) 是维护者自己的版本发布跟踪项。
截至本次快照，这些外部反馈尚无讨论评论，PR 也没有已提交的 review。

| 输入 | 已核实的快照 |
| --- | --- |
| 主题远端 `main` | `93ac292014a3cd81f7c41caec4df98ed9d2dc45a` |
| 本地主题 | `75ddc95`，相对远端仅有 `CHANGELOG.md` 发布文字差异 |
| PR #43 HEAD | `8eeb8ecaf525097cc56572fe22234db381bfc16a`，只改一行模板 |
| 本地文档站 | `ff0ba39`，`go.mod` 仍依赖 OINK `v1.0.0` |
| 公开版本 | GitHub 最新 Release 为 `v1.0.0`，远端查询没有返回 `v1.1.0` 标签 |
| 构建工具 | Hugo Extended 0.166.0、Node 26.9.0、npm 11.19.1 |
| 浏览器观察 | macOS、Chromium 153.0.0.0、浅色主题；真实同级文档站通过单次命令的模块替换使用本地主题 |

Design 中的 `released-v1.1.0` 标记和本地发布准备提交，不构成 v1.1.0 已经公开发布的证据。
源码修改、标签、消费站版本固定与线上部署仍是不同状态。本次没有升级公开消费站。

调研覆盖完整 Issue/PR 正文与评论、精确 diff、双语 Design 契约、相关模板和 JavaScript、
部署在 `/sub/` 下的临时双语站点，以及真实文档站的定向浏览器交互。共享工作区中的主题实现未改动。

## PR 43：接收小修复，明确它解决到哪里 {#pr-43}

[root-menu-roots.html](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/root-menu-roots.html#L7-L26)
第一轮收集顶层分区时会检查 `sidebar_root_menu`；第二轮收集
`sidebar_root_for: self` 分区时没有检查。于是第一轮已排除的节点又被第二轮加回来。

PR 给第二轮补上同样的显式 false 判断：

```go-html-template
{{- if and .IsSection (ne .Params.sidebar_root_menu false) -}}
```

这保留了未配置和配置为 true 时的默认行为，也保留了分区类型约束与 URL 去重，不改变侧栏树及
翻页顺序，不破坏按语言缓存。没有必要为这一个遗漏重构整个导航系统。

但是，后面的
[root-menu-entries.html](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/root-menu-entries.html#L1-L12)
还会把不在集合中的当前根追加回来。这是已有行为，导航指南也提到最后追加当前根，不能误报为 PR
引入的新回归；但它意味着不能宣称“设成 false 后，在所有页面都不再显示”。

临时复现站包含一个顶层 Blog 自根、一个嵌套 Docs 自根，二者均设
`sidebar_root_for: self` 和 `sidebar_root_menu: false`，另有可见 Docs 根和未覆盖可见性的自根。
英文、中文结果一致，URL 都正确保留 `/sub/` 与语言前缀：

| 当前浏览页面 | 修改前 | 应用 PR 后 |
| --- | --- | --- |
| 不相关的 Docs 页面 | 两个隐藏自根都出现 | 两个都消失 |
| 隐藏 Blog 根下的页面 | Blog 出现 | Blog 仍被当前根回退逻辑加回来 |
| 隐藏嵌套根下的页面 | 嵌套根出现 | 嵌套根仍被当前根回退逻辑加回来 |
| 可见自根 | 出现 | 继续出现且不重复 |

建议把契约明确为：false 将节点排除在全站可选根集合之外，但当前根可为位置提示而保留。
保留这个已有例外是改动最小、最兼容的解释，需要在两种语言中写清楚。如果真正希望 false
表示绝对排除，就要另行协调修改当前根回退和切换器标题逻辑，并检查零入口、单入口状态。
只再加一个条件，不足以完成这项语义变化。

合并前应补齐：

1. 在 `bin/check-shell.py` 增加输出测试，覆盖顶层与嵌套隐藏自根、未设置/true、去重、当前根
   例外、单入口退化，以及 EN/ZH 子路径。
2. 同步更新 Shell 契约与导航指南。PR 描述示例里的 YAML 注释 `//` 也应改成 `#`，保证可复制。
3. 处理工作流的
   [action_required 状态](https://github.com/pgsty/oink/actions/runs/34597562431)，在最终 HEAD 上运行
   必要检查。截至快照，PR HEAD 没有成功的 check run 或 commit status。API 返回
   `MERGEABLE`、`UNSTABLE`，这两个状态都不等于测试通过。

维护者可以保留贡献者的提交并补上这些收尾工作。不应把实现 #40 或完整 #41 作为接收这行修复的前提。

## Issue 41：先修隔离，再公开状态 {#issue-41}

这里有两件不同的事。

第一，整栏隐藏主要依靠 transform，桌面还使用 opacity；抽屉和折叠控制器没有将隐藏控件移出键盘
导航。在浏览器实测中，点击折叠按钮后，焦点留在已经透明的折叠按钮上，再按 Tab 就进入隐藏的根
切换按钮。此时面板 opacity 为零，也没有生效的 `inert` 或 `aria-hidden` 祖先。这是可复现的
使用缺陷，不只是缺少给集成方调用的接口。移动端关闭面板的实现同样仅移到屏幕外，没有显式隔离。

第二，展开状态分别由
[点击控制器、响应式搬迁](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/docs-shell.js#L374-L487)
和
[缓存活动路径补全](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/sidebar-nav.js#L43-L62)
直接写入，没有公开 setter、getter 或状态提交事件。现在对整栏折叠、宽度和滚动位置的存储，并不
等于每个分支的展开选择能跨页面持久保存。创作指南中“读者的展开状态保存在本地”也需要说明这个区别。

建议分步处理：

1. 集中处理整栏隔离，在初始化及打开、关闭、折叠、悬浮展开、恢复和断点切换时同步更新。
   先解除隔离再把焦点移进去；关闭时先把焦点归还给可见的外部控件，再使内容 inert。
2. 隔离内容区，同时保留外部恢复按钮和桌面边缘的悬浮感应区域。直接把感应区域一起 inert 会破坏
   已有悬浮行为。仅用 `aria-hidden` 不能阻止键盘进入；
   [HTML 的 inert 定义](https://html.spec.whatwg.org/multipage/interaction.html#inert)
   同时约束交互与无障碍树暴露。
3. 将分支展开修改另行收敛到一个提交函数：更新 `aria-expanded`、展开 class 和本地化标签后，
   再发送一次事件；重复写入同一状态不重复通知。
4. 在定义稳定 ID、非法 ID 处理、初始化就绪信号和恢复次序后，再公开最小 setter/getter 与事件。
   版本和语言的存储命名空间继续由下游管理，恢复后以当前活动路径展开为准。

原提案有一处范围需要校正：TOC、反向链接和分类法分组在宽屏时会从侧栏移回右栏。
如果控制器只查询“当前侧栏 DOM 下的后代”，就无法同时管理宽屏时的这些写入。
应按 OINK 管理的目标注册元素，不依赖其当下 DOM 父节点；对外的侧栏 API 则只开放约定的注册子集。

验收必须检查隐藏状态下的真实 Tab 顺序与无障碍树、初次载入时恢复折叠、悬浮进出、焦点归还、
Escape、遮罩关闭、滚动解锁，以及 768/1200 断点。还要保留 #24 已修好的无 JavaScript 导航。
静态 axe 扫描通过、或者测试“抽屉可以打开”，不能证明这些状态转换正确。

## Issue 44：现象真实，部分行为符合预期 {#issue-44}

在文档站配置页分别点击文章标题、表头单元格和代码块，会让 `main#td-main-content`、
`div.td-table-scroll`、`pre.chroma` 获得焦点。三者在点击后都不匹配 `:focus-visible`，按下未绑定
快捷键的字母 `z` 后都开始匹配。正文和代码块出现浏览器的 auto outline，表格使用主题的实线
outline。这说明不需要作者的 Linux 桌面或 Super 键，也能复现相同机制。

[Selectors 规范](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)
明确描述了这种情况：键盘交互可以改变焦点提示，即使焦点元素没有变化。因此，这是一条有价值的
阅读体验反馈，但“鼠标聚焦之后，无论再按什么键都不该出现框”不是浏览器必须遵守的正确性要求。

建议这样处理：

- 保留 main 作为跳过导航的目标以及它的可聚焦性，把包围整栏的 outline 改成正文入口附近的局部
  可见提示，例如标题区提示，并实际验证 skip link。
- 保留可滚动表格和代码块的键盘焦点提示，必要时统一其视觉样式。可聚焦性使键盘滚动成为可能。
- 不做全局 `outline: none`，不删除所有 `tabindex`，不在任意按键后主动 blur。
- 如果产品仍决定抑制“鼠标先聚焦再阅读按键”这一路径，需要明确新增语义，只限定这些非编辑容器，
  并验证鼠标、Tab、skip link、程序聚焦、深色及强制颜色模式。为这条反馈建立全站输入模式框架
  并不划算。

本次证据支持小范围的显示改进，不支持为了消除现象而直接取消表格和代码块的键盘提示。

## Issue 42：区分隐藏与分组 {#issue-42}

提问写的是 `_index.json`，并依赖截图而没有提供源码复现。本次未能成功完成原始截图的视觉核验，
第一项需求具体想改变哪里仍需澄清。回复时应请作者提供小目录树及实际 index/front matter，
不能没有证据就断言 `_index.json` 是受支持的页面源文件或只是笔误。

现有选项的含义并不相同：

| 选项 | 当前行为与限制 |
| --- | --- |
| `no_list: true` | 隐藏分区正文里的子页面列表，不隐藏其侧栏节点 |
| `hide_summary: true` | 隐藏父分区正文列表中的某一项，不改变侧栏分组 |
| `toc_hide: true` | 内容树遍历在递归前过滤该节点，也会从这棵树中移除其子树 |
| `sidebar_root_menu: false` | 控制顶部根切换器候选，不控制阅读树中的行；另见 PR #43 |
| `sidebar_root_link_self: false` | 将自根的链接指向父节点，不会变成不可跳转的分组标题 |
| `sidebar_divider: true` | 输出无链接标题，但共享渲染器在这个分支中没有输出已传入的子项 |
| `build.render: link` | 不生成分区 HTML，但保留 permalink；当前侧栏仍会输出指向它的链接，不能单独解决问题 |

临时站点确认：带 divider 的分区，其子页面 HTML 仍然存在，但侧栏子链接消失；仅设置
`build.render: link` 的分区没有自己的 HTML，侧栏中却仍有可点击的分区链接和子页。
这与 Hugo 的
[构建选项定义](https://gohugo.io/content-management/build-options/)
以及主题的
[共享节点渲染器](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/sidebar-node.html#L48-L89)
一致。

如果真实需求就是“保留分组标题和子链接，但标题不跳转到目录页”，优先考虑补齐
`sidebar_divider` 在分区节点上的行为：叶子分隔项保持原样，有子项的分区保留 children，允许折叠
时使用真正的 disclosure button。决定前应检查已有消费站；只有现有 divider 契约无法兼容表达时，
才增加独立的节点级开关。“是否生成分区页面”与“导航标题是否可点击”应分别处理。

实现必须保留两套遍历器中的层级和活动路径展开，使子页继续进入翻页顺序。如果目录页确实不发布，
还要检查面包屑、搜索、根切换器、Print 和机器可读导航，不能留下死链接。直接用 CSS 隐藏整个节点
解决不了这个需求。

## Issue 40：可以接受范围受限的扩展方向 {#issue-40}

源码核实了提案指出的限制：
[groupsFor](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/command-palette.js#L350-L368)
只组合内置页面和操作；公开 Palette 对象没有 provider 注册接口；
[registerExecutor](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/action-registry.js#L238-L263)
只允许内置 action ID。静态 URL command 无法替代携带当前查询的结果行。
现有 Palette/controller 测试通过，证明已有功能能工作，不能证明该扩展能力已经存在。

提议的 search-tail 位置是合理的上游接口边界：同步返回纯数据行、异步执行操作、本地结果优先，
由 OINK 管理渲染、选择、键盘和 ARIA。OINK 不需要因此内置 AI 服务商、凭据、远程搜索或通用插件系统。

接受 API 前，需要定清并测试：

1. 只在哪些已完成的文本搜索状态调用 provider；保留空查询、命令、选择、加载中，以及未注册扩展时
   的原有行为。
2. 保存生成每一行时的 query/locale 快照，保留原生空结果、索引错误及重试提示，区分本地页面数与
   全部可选择操作数。
3. 校验并复制 descriptor，把标题和描述当文本渲染；隔离 provider 异常、重复 ID 和非法描述符。
4. 同时处理同步 throw、Promise rejection、pending 释放、重复激活、旧会话取消，以及 ID 重用后的
   旧 unregister 句柄。
5. 验证向另一个对话框移交焦点。现有 Palette 关闭逻辑已经会在焦点移出后避免强行归还，应保留这个
   判断。还要区分“成功把交互交给新界面”和“取消”，否则“任何 close 都 abort 激活”的规则可能
   把刚打开的助手操作一并取消。
6. 保持默认查询不出浏览器和按需加载资源的行为。对受信任站点脚本约定 `rows()` 纯净，不等于主题
   有能力建立安全沙箱。

实现前，应把接受的 API 形状沉淀为双语 Design 提案。下游 Ask AI 包装可以继续使用，直到公开标签
包含该接口。它不应成为小型正确性修复的发布前提。

## 实施顺序与归属 {#delivery-order}

| 顺序 | 交付内容 | 对应验收与文档 |
| --- | --- | --- |
| 第一批 | PR #43 收尾与隐藏侧栏隔离，分别交付 | `check-shell.py`；文档站响应式、键盘、无障碍用例；双语 Shell 契约与导航指南 |
| 第二批 | 正文焦点样式，以及确认后的分组行为 | 对应内容、阅读、导航检查器；浏览器焦点、滚动、skip link 用例；双语架构、外壳与创作说明 |
| 后续 | 公开展开状态控制器，再做 search-tail API | 主题 JS 测试及 `check-navigation-contract.py` / `check-palette.py`；真实站点 fixture；已接受的双语 API 契约 |

每项公共行为修改先跑对应检查器，再通过同级文档站的 `make check`、`make browser`、`make dev`
做相关集成与视觉验收。不要把这些不同需求绑成一次大规模侧栏/搜索重写，也不要等待所有新功能
完成才交付小修复。

建议回复内容，尚未发送：对 #43 承认过滤遗漏并解释当前根例外；对 #41 接受隔离缺陷、拆开 API
诉求；对 #44 确认复现并说明标准焦点机制；给 #42 解释配置区别并索取最小输入；把 #40 归为受限
扩展需求，而非本地搜索故障。

历史外部反馈已经关闭：[#22](https://github.com/pgsty/oink/issues/22) 通过开启 Goldmark passthrough
解决，提问者明确确认有效；[#21](https://github.com/pgsty/oink/issues/21) 已提供 Mermaid 查看器与
固定居中展示，任意右对齐选项则明确没有纳入。二者不应被算作新的待处理缺陷。

## 验证结果与边界 {#validation-and-limits}

本次实际执行：

- 本地基线及 PR #43 精确 HEAD 的隔离 checkout 均通过 `python3 bin/check-shell.py`。
- Palette 控制器和模型测试通过，共 2 个测试文件，零失败。
- 对真实 PR diff 应用前后分别进行严格 Hugo 临时构建，在 EN/ZH 与 `/sub/` 下复现自根过滤和
  当前根回退；同一 fixture 验证了分组配置的限制。
- 真实双语文档站使用本地主题，通过带 `--panicOnWarning` 的构建；Chromium 定向交互复现三个
  容器的焦点边框，以及桌面侧栏隐藏后的焦点问题。
- 文档站双语覆盖、渲染与链接检查通过，非浏览器套件的 57 项测试均已通过。首次 `make check`
  因新增报告改变 `llms.txt` 索引而停在快照检查；确认仅新增报告这一行、同步快照后，重跑该组
  及其余测试组全部成功。

新增缺陷断言属于调研探针，尚未成为提交到仓库的回归测试。本次不是完整发布验收，也没有跑所有
浏览器矩阵。本地 Hugo 为 0.166.0，并非 CI 固定的 0.165.0 或声明的 0.160.1 兼容性下限。
Linux Super 键、移动端无障碍树隔离、深色/强制颜色模式及作者 #42 的精确截图，还需要上述验收覆盖。
本次未改变线上部署、公开版本、消费站依赖或上游讨论。

## 实施与验收补记 {#implementation-acceptance}

维护者决定先合并贡献者补丁，再直接在 main 完成修复与扩展，不另提 PR。
[PR #43](https://github.com/pgsty/oink/pull/43) 已合并为
[`6e814089`](https://github.com/pgsty/oink/commit/6e8140891bffe9d627c27a5676fbc26983250ea0)，
随后拉取到本地，保留原有发布说明提交。第二阶段实施提交为
[`56bfe37`](https://github.com/pgsty/oink/commit/56bfe37)。

| 项目 | 已实现的行为 | 对应验收 |
| --- | --- | --- |
| #43 | 两条根收集路径都遵守显式 false，保留当前根的位置提示；分隔项和未发布分区不成为切换器链接 | 严格 EN/ZH 子路径 fixture 覆盖顶层／嵌套隐藏根、未设置／true、去重、当前根回退以及零／单入口 |
| #41 | 单一控制器统一提交 ARIA、类名、标签和 inert 状态；提供晚加载安全的 API，支持下游持久化；隔离隐藏侧栏内容，保留悬浮恢复和抽屉行为 | 运行时与浏览器测试覆盖事件原子性、重复写入、作用域、活动路径、存储禁用、响应式搬移、焦点归还、真实 Tab 遍历、Escape、遮罩与断点 |
| #44 | 记录指针来源焦点，抑制后续无关按键触发的容器边框；Tab 与新程序化焦点保留提示，跳转正文时突出标题 | 正文、表格、代码块在亮色／暗色／强制颜色下的浏览器测试，以及键盘与 skip link 回归 |
| #42 | 分隔分区显示不带链接的标题并保留子页，配合 `build.render: never` 省略自身页面；面包屑、搜索、翻页、导航 JSON、Book 目录／Markdown、Print 保持一致；显式导航兼容双语子路径 | 内容树／数据树严格 fixture、Book 三级标题检查、EN/ZH 浏览器 fixture 和无 JavaScript 遍历 |
| #40 | 受信任站点脚本可注册同步纯数据搜索尾部行及异步激活；排序、ARIA、校验、异常隔离、取消、注销和焦点移交仍由 OINK 管理 | 运行时生命周期测试，以及中文页面的鼠标／键盘选择、纯文本显示、上下文快照、外部对话框焦点和注销场景 |

使用同级主题 checkout，在 macOS、Hugo Extended 0.166.0、Node 26.9.0 与 Chromium 上完成：

- 主题 JavaScript 测试 44 项全部通过。
- `check-shell.py`、`check-reading.py`、`check-palette.py`、`check-keyboard.py` 通过。
  按主题 CI 配置扩大检查，另外 31 条命令中 29 条通过；本地两项失败来自媒体检查器固定的图片处理
  指纹，以及四份黄金文件中 Hugo 0.166 改变的 KaTeX 输出。保留原有空白格式后，普通导航标记与
  黄金文件一致。固定 CI 工具链的结果单独核验，不因此改写无关预期。
- `make -C ../oink.pgsty.com check` 通过：双语源文件、渲染与链接检查，以及 57 项非浏览器测试。
- `make -C ../oink.pgsty.com browser` 共 141 项通过：无障碍 30，响应式／博客／Palette 45，
  键盘 16，内容 10，代码块 18，场景 4，主题色 5，社区回归 13。无障碍套件包含完整双语站点地图逐页扫描。
- 主题 fixture 严格构建、输出与命名空间检查通过。Book 本地打包生成五章 EPUB，检查零错误；
  PDF 为 23 页，包含全部五个预期 Book 页面，检查零错误。
- 通过 `make dev` 在真实文档站实测桌面亮色、中文暗色、折叠侧栏恢复，以及 375px 移动抽屉。
  Escape 关闭后焦点回到可见的打开按钮。验收后已恢复浏览器视口并清理临时开发服务。

已接受的契约写入 [Shell](/docs/design/shell/) 与[架构](/docs/design/architecture/)，
中英文同步，并更新导航、组织内容、Palette 和 Print 指南。集成回归留在文档站仓库，主题只保留
专项检查器和合成输入。

PR 合并提交的[固定工具链 CI](https://github.com/pgsty/oink/actions/runs/35449159584)
三个任务全部通过。最终实施提交的 [CI](https://github.com/pgsty/oink/actions/runs/35451830483)
也已全部通过，精确版本为 `56bfe37092a43fc12c0e16f865d3d3407c55cbde`：Hugo 0.165.0、
浏览器运行时测试与 Book 出版三个任务均成功，包含本地 Hugo 0.166.0 出现差异的媒体和
四状态黄金文件检查，以及根路径／子路径出版。声明的 0.160.1 兼容性下限没有额外复测；
本项目固定的持续测试工具链仍为 0.165.0。

这是源码与集成验收，并非新版本发布：没有创建新标签，文档站仍固定 `v1.0.0`，生产站没有升级。
同级文档与测试变更在本地 main 为下一次主题发布准备；若立即推送新增浏览器门禁，远端会拿旧公开
依赖测试新接口，无法构成正确验收。本次没有发送贡献者回复，#40、#41、#42、#44 仍保持打开状态。
#42 原始截图和报告中的 Linux Super 键环境没有独立复现；明确的纯分组需求及等价的“点击后按键”
路径已按上表实测。
