---
title: Agent 批量索引
linkTitle: Agent 索引
description: 基于 OINK 既有 Markdown 输出与导航权威，可选生成 llms-full 全文包和稳定导航 JSON 的设计草案。
weight: 30
icon: fa-solid fa-robot
search_keywords: [llms-full.txt, 导航 JSON, Agent 输出, 机器可读, LLMS]
design_kind: proposal
design_status: draft
proposal_date: 2026-08-20
---

> [!WARNING] PRD 草案，部分前提已经存在
> OINK 已经支持每页 Markdown、语言内 `llms.txt`、HTML discovery link 与 Copy Markdown。
> 当前不发布 `llms-full.txt` 或导航 JSON。本页只提议这两类剩余输出。

## 当前基线 {#current-baseline}

站点可以为 page 与 section 启用 Hugo 的 Markdown 输出，并为 home 启用生成 `llms.txt` 的 `LLMS`
输出。OINK 把 shortcode 渲染成语义化 Markdown，保留源码 URL 和语言内 LLMS 索引发现信息，Copy
Markdown 也读取同一个 alternative output URL。主题声明输出格式，但不强迫站点选择哪些 `outputs`。

导航已经存在权威链：有显式 `data/docs_nav.json` 树时使用它，否则使用内容树与 weight。侧栏、
pager 与已声明 section index 共用这一权威。机器导航输出必须从同一棵树派生，不能再造排序。

## 目标与非目标 {#goals-and-non-goals}

目标：

- 为小型站点可选装配语言内全文包，为大型站点可选按顶层 section 分包；
- 可选发布带版本的导航 JSON，供 Agent 与外部工具使用；
- 复用人工站点的同一 Markdown 页面渲染器、页面纳入规则与导航权威；
- 所有输出仍通过 Hugo output 配置 opt-in；
- 验证链接、语言隔离、media type 与确定性顺序。

非目标：

- 替换每页 Markdown 或 `llms.txt`；
- 新建 `params.oink.*` 配置树；
- 在 Hugo 构建期间抓取生成好的 `public/` 文件；
- 嵌入私有源码路径、草稿页面或跨语言回退；
- 承诺一个巨型全文包适合所有模型上下文。

## 全文包 {#full-text-bundle}

提议的 `llms-full.txt` 输出拼接每页输出所用的同一份语义化 Markdown。页面之间使用稳定、可见的
分隔符与来源 URL。站点从两种部署形态中选择：

| 形态         | 位置                                | 适用场景         |
| ------------ | ----------------------------------- | ---------------- |
| 全站包       | 每种语言在语言根下一个文件          | 小型、聚焦站点   |
| section 分包 | 每个显式启用的顶层 section 一个文件 | 大型参考站与书籍 |

由 Hugo output 配置决定哪些页面获得该格式，而不是由主题参数决定。主题可以提供检查器，报告意图
与实际输出不一致，但不能修改站点输出集合。

全文包在 Hugo 内部通过共享页面渲染 partial 组装，不读取 `public/` 中的兄弟产物，也不依赖输出
构建顺序。文件大小作为证据报告；任意阈值不能通过警告让 `--panicOnWarning` 拒绝原本合法的发布。

## 导航 JSON {#navigation-json}

提议的 JSON 包含 schema 版本、语言、根节点与递归有序节点。页面节点包含稳定 ID、标题、HTML URL、
启用时的 Markdown URL、kind/type、weight 与 children。显式外部导航节点只包含标签、URL 与
external kind。

输出遵循渲染侧栏相同的可见性与排序规则，排除 draft、headless resource、隐藏导航项与当前语言
不可用页面，永不序列化本机文件名。

该格式拥有自己的 JSON Schema 与 golden 夹具，并标记为 `notAlternative`，避免 Hugo 把它广告为
页面级 alternate。

## 发现信息与输出边界 {#discovery-and-output-boundaries}

`llms.txt` 可以链接已经启用的全文包与导航 JSON。HTML head 继续发现每页 Markdown 和语言内 LLMS
索引，不把每个批量产物塞进每一页。

shortcode、Landing section、Book 目标与交互组件继续使用当前 Markdown 降级。新输出无权增加组件
HTML、脚本、评论、反馈控件或导航 chrome。

## 验收标准 {#acceptance-criteria}

- EN 与 ZH 输出只包含各自语言的页面和 URL。
- 每个列出的 Markdown URL 都存在；每个导航 URL 都可解析，或明确标记为外部节点。
- 同一根下的顺序与渲染侧栏、pager 一致。
- 固定 Hugo 版本与输入时，相同源码重建得到字节稳定输出。
- 新格式关闭时，HTML、Markdown、Print、RSS 与 LLMS golden 均无回归。
- 大站夹具能证明按 section 分包，而不是为每个嵌套 section 都生成文件。

## 待决问题 {#open-decisions}

1. 两种全文部署形态是否都需要，还是只按 section 分包更安全？
2. 导航 JSON 应当是 home output，还是由 resource template 支撑的专用内容页？
3. 哪些节点元数据足够稳定，可以进入 schema version 1？
4. 导航 JSON 存在时，`llms.txt` 是否默认列出它？
5. 检查器应报告哪些体积证据，又不武断执行某个模型上下文上限？
