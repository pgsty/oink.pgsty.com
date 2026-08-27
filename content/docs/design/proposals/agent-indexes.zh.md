---
title: Agent 批量索引
linkTitle: Agent 索引
description: 基于 OINK 既有 Markdown 输出与导航权威，可选生成按 section 分包的全文包和稳定导航 JSON。
weight: 30
icon: fa-solid fa-robot
search_keywords: [llms-full.txt, 导航 JSON, Agent 输出, 机器可读, LLMS]
design_kind: proposal
design_status: accepted
proposal_date: 2026-08-20
---

> [!IMPORTANT] 已接受，排入实现
> 2026-08-27 决议全部待决问题后接受本提案。范围是两类可选输出：按顶层 section
> 分包的 `llms-full.txt` 与语言根下的导航 JSON。OINK 已经支持每页 Markdown、
> 语言内 `llms.txt`、HTML discovery link 与 Copy Markdown；本页只覆盖剩余两类。

## 当前基线 {#current-baseline}

站点可以为 page 与 section 启用 Hugo 的 Markdown 输出，并为 home 启用生成 `llms.txt` 的 `LLMS`
输出。OINK 把 shortcode 渲染成语义化 Markdown，保留源码 URL 和语言内 LLMS 索引发现信息，Copy
Markdown 也读取同一个 alternative output URL。主题声明输出格式，但不强迫站点选择哪些 `outputs`。

导航已经存在权威链：有显式 `data/docs_nav.json` 树时使用它，否则使用内容树与 weight。侧栏、
pager 与已声明 section index 共用这一权威。机器导航输出必须从同一棵树派生，不能再造排序。

## 目标与非目标 {#goals-and-non-goals}

目标：

- 为显式启用的顶层 section 可选装配语言内全文包；
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

`llms-full.txt` 输出拼接每页输出所用的同一份语义化 Markdown。页面之间使用稳定、可见的
分隔符与来源 URL。第 1 版只实现按顶层 section 分包：每个在自身 `_index` front matter 的
`outputs` 中显式启用该格式的顶层 section，在语言内得到一个文件。整站单文件形态被推迟，
待真实站点证据表明按 section 分包不够用时再议——巨型单文件既容易超出模型上下文，又会
把所有 section 的更新耦合到一个产物上。

由 Hugo output 配置决定哪些 section 获得该格式，而不是由主题参数决定。主题提供检查器，
报告意图与实际输出不一致，但不能修改站点输出集合。

全文包在 Hugo 内部通过共享页面渲染 partial 组装，不读取 `public/` 中的兄弟产物，也不依赖输出
构建顺序。文件大小作为证据报告；任意阈值不能通过警告让 `--panicOnWarning` 拒绝原本合法的发布。

## 导航 JSON {#navigation-json}

导航 JSON 是 home output，与 `llms.txt` 同级：每种语言在语言根下一个文件。内容包含
schema 版本、语言、根节点与递归有序节点。页面节点包含稳定 ID（语言内 permalink 路径）、
标题、HTML URL、启用时的 Markdown URL、kind 与 children；有 description 时一并携带。
显式外部导航节点只包含标签、URL 与 external kind。

节点不序列化 `weight`：数组顺序就是契约，weight 是派生顺序的私有机制，公开它会诱导
消费者重新排序。输出遵循渲染侧栏相同的可见性与排序规则，排除 draft、headless resource、
隐藏导航项与当前语言不可用页面，永不序列化本机文件名。

该格式拥有自己的 JSON Schema（`schema/nav.v1.schema.json`，手工编写的版本化契约产物，
不属于生成式配置 Schema 的漂移门禁）与 golden 夹具，并标记为 `notAlternative`，避免 Hugo
把它广告为页面级 alternate。

## 发现信息与输出边界 {#discovery-and-output-boundaries}

`llms.txt` 默认列出已经启用的全文包与导航 JSON——发现信息属于索引文件，这正是它存在的
理由。HTML head 继续发现每页 Markdown 和语言内 LLMS 索引，不把每个批量产物塞进每一页。

shortcode、Landing section、Book 目标与交互组件继续使用当前 Markdown 降级。新输出无权增加组件
HTML、脚本、评论、反馈控件或导航 chrome。

## 兼容与迁移影响 {#compatibility}

两种输出都默认关闭，未启用的站点字节不变。启用是站点侧的 Hugo `outputs` 配置，没有新的
`params` 键，没有重命名，没有迁移步骤。关闭输出即完全退出，不留残余。

## 实现与归属检查器计划 {#implementation-plan}

1. 输出格式：`LLMSFULL`（`text/plain`、`baseName: llms-full`、`notAlternative`、
   section 级）与 `NAVJSON`（`application/json`、`notAlternative`、home 级），
   与既有 `MARKDOWN`/`LLMS` 定义并列声明。
2. 模板：section 的 `llms-full` 布局复用每页 Markdown 输出的共享渲染 partial 按导航
   顺序拼接；home 的导航 JSON 布局走既有导航权威 partial，不引入第二套树遍历。
3. 归属检查器：新增 `bin/check-agent-indexes.py`，在 `tests/site` 夹具上验证语言隔离、
   链接可解析、顺序与侧栏一致、schema 合规、字节稳定重建，并报告每个包的字节数与页数
   （只报告，不设上限门禁）。
4. Golden：`check-goldens.py` 矩阵增加 llms-full 与导航 JSON 夹具。
5. 文档：站点新增双语 Agent 索引指南；`llms.txt` 发现行为并入既有 LLMS 文档；
   本提案按生命周期退役。

## 验收标准 {#acceptance-criteria}

- EN 与 ZH 输出只包含各自语言的页面和 URL。
- 每个列出的 Markdown URL 都存在；每个导航 URL 都可解析，或明确标记为外部节点。
- 同一根下的顺序与渲染侧栏、pager 一致。
- 导航 JSON 通过 `schema/nav.v1.schema.json` 校验。
- 固定 Hugo 版本与输入时，相同源码重建得到字节稳定输出。
- 新格式关闭时，HTML、Markdown、Print、RSS 与 LLMS golden 均无回归。
- 大站夹具能证明按顶层 section 分包，而不是为每个嵌套 section 都生成文件。

## 决策日志 {#decision-log}

- 2026-08-20：起草；全文包给出全站与按 section 两种形态，导航 JSON 位置未定。
- 2026-08-27：决议五个待决问题并接受提案。全文包第 1 版只做按顶层 section 分包，
  整站单文件推迟到有真实证据；导航 JSON 定为 home output；schema v1 节点元数据取
  最小集（稳定 ID、标题、HTML URL、Markdown URL、kind、children、可选 description），
  不序列化 `weight`；`llms.txt` 默认列出已启用的两类产物；检查器只报告体积证据，
  不执行任何模型上下文上限。
