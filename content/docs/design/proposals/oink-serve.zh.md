---
title: oink：在文档仓库上预览与发布多版本站点
linkTitle: oink 与多版本服务
description: PRD 草案：一个内嵌 Hugo 与 OINK 的 oink 二进制，直接在 Git 文档仓库上提供本地预览、生产服务、多版本发布、单文件包与在线功能，并列出主题需要配合的改动。
weight: 31
icon: fa-solid fa-server
search_keywords: [oink, PRD, serve, 多版本, Git, tag, 分支, SQLite, 全文搜索, .oink, Crib]
design_kind: proposal
design_status: draft
proposal_date: 2026-11-28
---

> [!WARNING] 草案，2026-11-28
> 本提案描述尚未实现的产品方向，不能当作配置或命令参考。当前行为以
> [架构契约](/zh/docs/design/architecture/)、[CLI 契约](/zh/docs/design/decisions/cli/)与
> [版本指南](/zh/docs/customize/versions/)为准。

## 状态与影响面 {#status}

**状态与日期**：草案，2026-11-28；产品需求与架构方向，不是实现契约

**负责人**：OINK 维护者

**基线**：OINK v1.7.0；本机 Hugo v0.170.1；`pgsty/oink-cli` 的本地 `0.1.0-dev` 候选（未发布，没有用户）

**受影响契约**：[CLI 契约](/zh/docs/design/decisions/cli/)（本提案被接受后将取代它）、
[架构 · 输出与运行时](/zh/docs/design/architecture/#outputs-and-runtime)、
[Shell · 搜索、操作与运行时](/zh/docs/design/shell/#search-actions-and-runtime)、
[Shell · 归档版本横幅](/zh/docs/design/shell/#archived-banner)、[版本指南](/zh/docs/customize/versions/)

**相关提案**：接替 [CLI 路线图](/zh/docs/design/proposals/oink-cli-roadmap/#version-lifecycle)中尚未实现的版本生命周期阶段；
回答[主题路线图 R2](/zh/docs/design/proposals/theme-roadmap/#version-lifecycle)的待决问题“原生版本维度还是独立构建”；
落实[本地搜索提案](/zh/docs/design/proposals/local-search-engine/)预留的数据库后端

**受影响实现**：新的 `oink` 二进制仓库（见[待决问题](#open-decisions)）；主题的版本菜单、横幅、
搜索、评论、侧栏与错误页（见[与主题的协调](#theme-coordination)）

**版本意向**：分阶段交付，见[里程碑](#milestones)；本提案不承诺发布日期

## 摘要 {#summary}

在任意 OINK 文档仓库里运行同一个 `oink` 二进制：

```sh
oink dev                      # 预览工作区，保存即刷新
oink serve                    # 生产：把分支和 tag 发布成多版本站点
oink build -o site.oink       # 把同样的版本导出为静态目录或单文件包
```

机器上不需要 Hugo、Go 或 Node。二进制内嵌上游 Hugo（作为库导入，不 fork）和 OINK 主题。

核心模型只有一句话：**Git 是内容库，版本是指向 ref 的标签，渲染结果是按内容寻址的快照。**
生产服务器只发布已提交、已成功构建的快照，版本指针原子切换。存储和计算随独立内容增长，
不随“版本数 × 页数”增长。

四条不变量贯穿全文：

1. **普通 Hugo 仍能构建站点。** oink 增加版本、服务与在线功能，不改变任何页面的含义，
   不用 oink 时什么都不会坏。
2. **生产只服务已提交且构建成功的快照。** 编辑中的文件、坏提交、构建超时都不会替换线上内容，
   上一个可用快照始终在服务。
3. **外观只有一个权威。** 所有 HTML，包括错误页、版本菜单片段和语料外壳，都由 Hugo 与 OINK
   渲染；服务器只做路由、拼接声明过的插槽和缓存，不渲染任何模板。
4. **成本跟随独立内容。** tag 只构建一次，没变的页面只存一份。

## 背景与证据 {#context}

### 现状 {#current-state}

- OINK 把每个文档版本当作独立站点：各自构建、各自部署，`params.versions` 菜单写进每个构建。
  所以增加一个版本，要在每个分支更新列表并全部重新构建（见[版本指南](/zh/docs/customize/versions/)）。
- `oink-cli` 是一个调用外部 Hugo 的本地候选，没有发布，也没有用户。所有者在 2026-11-28 明确：
  新设计可以不受它约束。
- 评论、浏览量、登录、权限和跨版本搜索在纯静态托管上没有归宿；评论目前只有 giscus。

### 逐版本静态构建为什么会爆炸 {#explosion}

2026-11-28 在 pgdoc-cn 仓库（PostgreSQL 中文手册的 pgweb HTML，559 个发布版加
`master`）和 PG 18 双语 OINK 站点上实测：

| 测量 | 结果 |
| --- | --- |
| 全部版本检出 | 6.15 GB HTML，52.9 万个文件；Git pack 只有 78 MiB |
| 按文件去重 | 52.7 万个独立文件，几乎去不掉：每个小版本改动约 1,000 个文件，多数改动只是页眉页脚里的版本号 |
| 去掉页眉页脚后按正文去重 | 9.8 万份独立正文，1.29 GB |
| 每个小版本真正改动的页面 | 中位数 107 页（p90 333）；17、18 两条版本线约 35 页 |
| 按路径跨版本排序、约 1 MiB 一簇的 zstd | 独立正文 31 MB；带页眉页脚的原页 73 MB |
| 从 Git 读一页 / 把一页转换成 OINK 正文 | p50 156 µs / p50 0.38 ms（p99 2.7 ms） |
| 单版 OINK 构建（PG 18 双语，v1.7.0） | 38 s、峰值 4.2 GB、808 MB；平均每页 431 KB，SELECT 页里 55% 是侧栏 |
| 站点自带的 OINK v1.4.0 | 在 Hugo 0.170.1 上构建失败 |

爆炸有三个来源：每页都烤进了随版本变化的外壳；存储按文件逐个保存；OINK 在每页内联整棵侧栏。
三者都与内容本身无关。去掉它们之后，全部 560 个版本的存储在 30–70 MB 之间，后台一次物化
约 1 CPU 分钟。最后一行还说明，旧版本无法用它当年的主题重新渲染。

### Hugo 已经提供的能力 {#hugo-facts}

- **整个命令行就是一个函数。** Hugo 的 `commands.Execute(args []string) error` 是公开包里的入口
  （v0.168.0 源码 `commands/commandeer.go`），内嵌 Hugo 的命令行只需要一行代码。
- **替换主题不需要 Go。** 在 `PATH` 中没有 `go` 的环境里，用 `HUGO_MODULE_REPLACEMENTS` 把
  `github.com/pgsty/oink` 指向本地目录，OINK 站点可以完整构建；不替换时 Hugo 报
  `binary with name "go" not found in PATH`（2026-11-28，Hugo v0.170.1 实测）。
- **应能静态编译。** 按 v0.168.0 源码，WebP 与 AVIF 编解码在 WASM 中运行，cgo 只服务于已移除的
  LibSass；OINK 又是纯 CSS，所以内嵌 Hugo 的二进制应能用 `CGO_ENABLED=0` 交叉编译（尚未实测）。
- **站点矩阵已有版本维度。** v0.153 起，`[versions]` 配置、挂载项上的 `sites.matrix.versions`、
  模板里的 `site.Version` 与 `.Rotate` 构成原生版本维度。它把所有版本放进一次构建，
  适合版本少的纯静态站点，见[备选方案](#alternatives)。
- **开发服务器已经很好。** `hugo server` 自带增量重建、实时刷新和浏览器里的错误页。

### 所有者输入 {#owner-inputs}

以下要求来自所有者在 2026-11-27 与 2026-11-28 的讨论，是本提案的前提。本页其它内容都是提议，
在所有者接受之前不具约束力。

- 一个 Go 二进制，名叫 `oink`，延续 OINK 风格；Git 中的本地 Markdown 是唯一权威来源。
- 直接在文档仓库上运行，既能本地预览、编辑时实时查看，也能在生产环境作为服务器发布。
- 生产要感知 Git：可以固定一个分支，也可以把一组 tag 发布成多个版本；默认分支是默认版本；
  PG 的大版本是分支、小版本是 tag；历史版本从 Git 读出并现场渲染。
- 不能因为构建了太多静态版本而让站点爆炸。
- 用 SQLite 维护状态和全文索引；提供更好的全文搜索、浏览量、评论，乃至权限控制。
- 基于 Hugo，以很薄的方式嵌入，类似 Caddy 里的 Hugo 模块。
- 提供 `.oink` 包格式，macOS 应用 Crib 可以直接打开。
- 首轮需求：评论、用户、权限、全文搜索、浏览量、多版本；覆盖 pg.center 与 pgext；
  支持 500 个以上的 PG 文档版本；首选 Cloudflare；图片可以由 nginx 提供。
- 现有 `oink-cli` 可以不管，需求本身也可以优化。

## 目标与非目标 {#goals}

目标：

- **G1 一个二进制。** 在任意 OINK 仓库运行 `oink` 即可预览，不需要 Hugo、Go 或 Node；
  同一个二进制就是生产服务器。
- **G2 Git 感知的多版本。** 从分支和 tag 生成版本，`current`、`latest` 等别名原子移动；
  pgdoc-cn 的 560 个版本全部可用。
- **G3 不爆炸。** 存储和构建成本跟随独立内容；pgdoc-cn 全部版本的内容库不超过 100 MB。
- **G4 不因编辑或坏提交宕机。** 生产只跟随提交，保留上一个可用快照，回滚在秒级完成。
- **G5 体验一致。** 同一个提交在 `hugo`、`oink dev`、`oink serve` 和 `.oink` 包中外观与行为一致；
  所有版本共享当前外观。
- **G6 在线功能可选。** 全文搜索、浏览量、账号、权限和评论都基于 SQLite，默认关闭，按站点开启。
- **G7 离线与分发。** 一个 `.oink` 文件可以被 `oink serve` 和 Crib 直接打开。

非目标（第一版）：

- 不做可视化 CMS、网页内编辑，也不从网页提交 Git。
- 不 fork Hugo，不另写渲染引擎或模板语言。
- 不在一个进程里托管多个站点，不做多实例共享状态；PostgreSQL 状态后端留待以后。
- 不内置 TLS 证书签发，放在 Cloudflare、nginx 或 Caddy 后面运行。
- 不支持非 OINK 主题使用版本插槽和在线功能（这类站点能构建，但不在支持范围内）。
- 不为旧 tag 复原它当年的主题外观。

## 用户与场景 {#scenarios}

| 角色 | 场景 | 期望 |
| --- | --- | --- |
| 作者与译者 | 在仓库里写作 | 运行 `oink`，保存即刷新；警告连同文件和行号直接显示在页面上 |
| 维护者 | 发布新版本 | 打 tag 后新版本自动上线；坏提交不影响线上；必要时一条命令回滚 |
| 运维 | 部署与升级 | 一个二进制加一个数据目录；重启后立即服务；升级不用停机重建 |
| 读者 | 阅读与查找 | 切换版本时停在同一页；旧版本有醒目横幅；可以搜索、评论 |
| 离线读者 | Crib 或隔离网络环境 | 一个 `.oink` 文件打开全部版本 |

目标站点各自用到的能力：

| 站点 | 形态 | 主要用到 |
| --- | --- | --- |
| pgsql.cc 的 PG 文档 | 560 个版本，pgweb HTML | HTML 语料渲染器、版本线与别名、跨版本搜索、`.oink` 包 |
| Pigsty 一类的产品文档 | 每个 minor 一条版本线 | Hugo 渲染器、默认版本在根路径、评论 |
| pgext | 单版本，约 1 万页 | 原子发布、服务端搜索、浏览量 |
| pg.center | Go 与 PG 的动态应用 | 文档部分由 `oink serve` 提供；作为 Go 库嵌入留待以后 |

## 产品形态 {#product}

### 命令 {#commands}

| 命令 | 作用 |
| --- | --- |
| `oink` | 在站点目录中等同 `oink dev`，在其它目录打印帮助 |
| `oink dev [目录]` | 预览工作区：保存即刷新，显示草稿，默认只监听本机 |
| `oink serve [目录 \| Git URL \| 文件.oink]` | 生产服务：从 Git ref 发布多版本，或只读服务一个包 |
| `oink build [--versions] [-o 目录 \| 文件.oink]` | 导出静态目录或单文件包 |
| `oink check [--versions]` | 构建并汇总 Hugo 与 OINK 诊断，退出码适合 CI |
| `oink versions` | 列出从 Git 解析出的版本、别名和对应的 ref，不构建 |
| `oink new [site \| page]` | 生成站点或页面骨架 |
| `oink status`、`rebuild`、`rollback`、`user` | 通过数据目录里的本地套接字管理运行中的服务器 |
| `oink hugo …` | 原样执行内嵌的 Hugo 命令行 |
| `oink --version` | 打印 oink、内嵌 Hugo 和内嵌主题的版本 |

### 开发模式 {#dev}

- **来源是工作区**，包括未提交的文件；显示草稿和未来日期的页面；默认只监听 `127.0.0.1`。
- **引擎是 Hugo 自己的开发服务器。** oink 在子进程里运行内嵌的 `hugo server`（渲染到内存、
  增量重建、实时刷新），自己在前面做反向代理，补上三件事：
  - 页面内诊断浮层：Hugo 与 OINK 的警告连同文件和行号显示在页面上，而不只在终端里；
  - 与生产相同的 `/_oink/` 接口：搜索、评论等功能可以在本地 `state.db` 上试用；
  - 按需加入 Git 中的其它版本（`--versions`），在本地看到带版本菜单的完整站点。
- **出错时不白屏。** 重建失败时保留上一个可用页面，浮层显示错误位置。
- **文件夹模式**（后续里程碑）：目录里没有 Hugo 配置时，生成临时配置并使用内嵌主题，
  `README.md` 作为分区首页，目录结构就是侧栏。

### 生产模式 {#serve}

- **只读 Git，不读工作区。** 编辑到一半的文件永远进不了生产；这是“编辑文件不会导致崩溃”
  的根本保证。
- **启动即服务。** 内容库里的快照直接可用，启动时不重建。只有引擎身份（oink、Hugo 或主题的版本）
  变化时，才在后台重建并逐个版本切换。
- **三种输入**：当前检出（使用它的 `.git`）；远程仓库 URL（在数据目录里维护镜像）；
  `.oink` 包（只读，不构建）。
- **持续跟随 ref**：解析版本，在后台构建缺失的快照，构建成功后原子切换；状态、回滚和重建
  通过 `oink status`、`oink rollback`、`oink rebuild` 完成。

### 静态与打包输出 {#build}

`oink build` 就是“冻结成文件的 `serve`”：同样的快照、同样的插槽拼接。

- `oink build` 只构建默认版本，输出到 `public/`，与 `hugo` 的用法相同。
- `oink build --versions -o dist/` 输出多版本静态目录：每个版本放在自己的前缀下，版本插槽在
  导出时就拼好，另外生成 `versions.json`，别名写成 `_redirects`。适合版本少的站点，以及
  Cloudflare Pages 这类静态托管。
- `oink build --versions -o site.oink` 输出单文件包，见[内容库与 .oink 格式](#store)。

## 核心模型 {#model}

| 概念 | 定义 |
| --- | --- |
| 仓库（source） | 一个 Git 仓库；开发模式下是工作区 |
| 版本（version） | 一个标签，绑定到一个 ref：`3.7` → `v3.7.2`，`devel` → `main` |
| 版本线（line） | 同一系列的版本发布，例如 `17` 包含 `17.0`…`17.12` |
| 别名（alias） | 指向版本的指针：`current` → `18`；可以移动 |
| 外观来源（skin） | 提供配置、布局、资源和主题版本的那个 ref，默认是默认分支 |
| 渲染器（renderer） | 把“外观来源 + 某版本内容”变成文件：`hugo` 或 `html` |
| 快照（snapshot） | 某版本在某个提交上的渲染结果：路径到对象的清单，不可变 |
| 内容库（store） | 按内容寻址的对象簇，可重建；格式即 `.oink` |
| 状态库（state） | 账号、会话、评论、计数和权限；不可重建，需要备份 |

```text
Git refs ──解析──▶ 版本 ──渲染与入库──▶ 快照 ──发布──▶ 别名与版本指针 ──服务──▶ 读者
          (标签→ref)    (Hugo 或语料)      (不可变)      (原子切换)        (拼接插槽、缓存)
```

### 从 Git ref 生成版本 {#versions}

- **没有配置时**，默认分支的头部就是唯一版本，服务在 `/`。“固定一个分支”就是这种情况，
  或者用 `--ref` 指定。
- **`tags`** 是一个带命名分组 `line` 和 `patch` 的正则表达式。每条版本线成为一个版本，
  标签就是 `line`，内容取该线 `patch` 最大的 tag。`releases: true` 时，每个 tag 另外成为一个
  精确发布版，例如 `17.4`。
- **`branches`** 把标签映射到分支，用于 `devel`、`next` 这类移动版本。
- **版本线的内容**：默认取最新的 tag；`line_branch` 可以改为发布该线分支的头部，
  适合需要在两次发布之间持续上线修订的翻译项目。
- **`aliases`** 把名字映射到版本，或映射到计算目标 `latest`（编号最大的版本线）。
- **`default`** 指定不带版本前缀服务的版本；**`archived`** 标出不再维护的版本线。
- **排序**：按点分数字逐段比较；不匹配正则表达式的 tag（例如 `v4.0.0-rc1`）不发布。

产品文档：每个 minor 一条版本线，默认版本放在根路径。

```yaml {title="oink.yaml"}
versions:
  tags: '^v(?P<line>\d+\.\d+)\.(?P<patch>\d+)$' # v3.7.2 → 版本线 3.7
  branches: { devel: main }
  default: latest # 最新版本线服务于 /
  url: '/v{label}/' # 其它版本：/v3.6/…
  archived: ['< 3.0']
```

PostgreSQL 中文手册：两种版本号写法、560 个版本。

```yaml {title="oink.yaml"}
versions:
  renderer: { type: html, profile: pgweb }
  tags: '^v(?P<line>\d+(?:\.\d+)??)\.(?P<patch>\d+)$' # v17.4 → 17；v9.6.24 → 9.6
  releases: true # 另外发布 /docs/17.4/
  branches: { devel: master }
  aliases: { current: latest }
  url: '/docs/{label}/'
  archived: ['< 15']
```

| URL | 含义 |
| --- | --- |
| `/docs/17.4/sql-select.html` | 精确发布版，不可变，`noindex` |
| `/docs/17/sql-select.html` | 版本线 17 的最新发布版 |
| `/docs/current/sql-select.html` | 别名，指向编号最大的版本线，原位服务 |
| `/docs/devel/sql-select.html` | `master` 分支头部，`noindex` |

### 内容随版本，外观用当前 {#skin}

Hugo 渲染器构建一个版本时，`content/`（以及 `versions.content` 列出的其它路径）取自 **版本提交**，
其余一切取自 **外观来源提交**：`hugo.yaml`、`layouts/`、`assets/`、`i18n/`、`data/`、`static/`、
`go.mod` 和主题版本。工作树的 `HEAD` 是版本提交，所以页面的最后修改时间与作者属于该版本，
不属于外观来源。

这样做有四个理由：

1. 旧主题在新 Hugo 上不一定能构建（v1.4.0 在 0.170.1 上已经失败）。
2. 所有版本的导航、版本菜单和搜索外观一致，读者切换版本不会进入另一个站点。
3. 一次部署只有一个主题版本，修复和改进对全部版本同时生效。
4. 模板只来自外观来源，旧 tag 和预览分支只贡献内容，不执行它们自带的模板。

代价是：旧版本的配置差异（菜单项、参数）不再生效；旧内容用到已移除的短代码时，按主题规则
警告并安全降级。`oink check --versions` 逐版本报告这些警告。确实需要按旧配置构建的版本，
可以设 `skin: self`，用它自己的配置、布局和主题版本；如果它在内嵌 Hugo 上构建失败，
该版本不可用，并在状态里报告原因。Docusaurus 采用同样的做法：版本化文档内容，主题始终是当前的。

外观来源只改了内容路径时，只重建它自己的版本（通常是 `devel`）；改了配置、布局或资源时，
其余版本在后台重建，重建期间继续服务旧快照。

### URL、规范链接与索引 {#urls}

- **默认版本服务在不带版本号的地址。** 采用多版本后，现有 URL 一个都不变。
  `/v{默认版本}/x` 以 301 指向 `/x`。
- **其它版本**：服务在 `url` 模板给出的前缀下，默认 `/{label}/`。Hugo 渲染器的前缀必须从站点根开始，
  因为整站构建是整体平移的；HTML 语料可以挂在任意前缀，例如 `/docs/{label}/`。
- **别名**：在输出与位置无关时原位服务（HTML 语料现在就是；Hugo 输出在主题完成
  [T10](#theme-later) 后也是），否则用 302 重定向。
- **规范链接**：非默认版本的页面，`canonical` 指向 `canonical` 版本（缺省等于 `default`，
  PG 示例为 `current`）中的同一页；该页不存在时指向自身。PostgreSQL 与 Python 的文档都这样做
  （2026-11-28 核对了 `docs/16` 与 `3.11` 的页面）。服务器在服务时改写这个链接，需要主题完成
  [T5](#theme-stage-two)；在此之前规范链接指向自身。
- **索引**：精确发布版和预发布版本加 `noindex`（需要 [T4](#theme-stage-one) 的构建级参数）；
  sitemap 只列默认版本。
- **版本感知的 404**：路径在某版本中不存在时，返回该版本自己的 404 页，由主题运行时调用
  `/_oink/where` 列出包含此路径的版本，例如“始于 9.4”“12 起移除”（需要 [T3](#theme-stage-one)
  与 [T8](#theme-stage-two)）。

## 架构 {#architecture}

### 流水线 {#pipeline}

```text
                ┌──────────────────────── oink serve ────────────────────────┐
 Git refs  ───▶ │ 解析 ──▶ 物化 ──▶ 渲染 ──▶ 入库 ──▶ 发布                     │ ───▶ HTTP
 fetch/webhook/ │ 版本     外观+内容   Hugo 子进程  去重、索引  原子切换指针    │      拼接插槽
 本地 push      │          worktree   或语料转换   插槽偏移                     │      缓存
                └──────────────┬──────────────────────────────┬───────────────┘
                               ▼                              ▼
                       store.oink（可重建）            state.db（需备份）
```

1. **解析**：读取外观来源 ref 上提交的 `oink.yaml`，把 refs 映射为版本和别名。每个版本的快照键
   = H(版本提交, 外观来源提交, 引擎身份, URL 基址)；键已存在就什么都不做。
2. **物化**：Hugo 渲染器以版本提交建 `git worktree`，再覆盖外观来源的文件；HTML 语料不物化，
   直接按页读取 Git 对象。
3. **渲染**：在子进程里运行内嵌 Hugo，输出到临时目录；HTML 语料逐页转换。
4. **入库**：哈希每个输出文件，只把新对象写入簇；记录 HTML 中插槽的字节偏移；提取搜索记录；
   写出清单。
5. **发布**：快照完整写入并通过检查后，在一个 SQLite 事务里把版本指针切到新快照；
   可选地通知 CDN 按前缀清缓存。
6. **服务**：按 URL 前缀找到版本和快照，读取对象，拼接版本插槽，按缓存策略返回。

### 渲染引擎 {#engine}

- **内嵌 Hugo 的命令行。** `oink` 链接 Hugo 的 `commands` 包，`oink hugo …` 就是原版 Hugo。
  构建时以子进程重新执行自身（`oink hugo --source … --destination …`），与 Hugo 的耦合只有
  它的命令行参数和输出目录，不触碰不稳定的 `hugolib` 内部 API。
- **为什么用子进程。** 单版 PG 18 构建峰值 4.2 GB；放在常驻服务进程里，一次 OOM 或卡死会拖垮
  整个服务。子进程有超时、内存上限、并发上限和较低的调度优先级，退出后内存全部归还。
- **主题注入。** 内嵌主题按版本和校验和解压到缓存目录，子进程环境设
  `HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> <目录>"`、`GOWORK=off`、
  `HUGO_MODULE_WORKSPACE=off`。已验证这样不需要 Go。
- **主题版本以外观来源的 `go.mod` 为准**，与普通 Hugo 一致。来源依次是：版本相同的内嵌主题、
  站点的 `_vendor/`、本地缓存、从 Go 模块代理下载（按 `go.sum` 校验，`--offline` 时禁止）。
  其它 Hugo 模块同样从 `_vendor/` 或缓存获取；都没有时给出明确错误。
- **构建安全策略。** 发布用的 ref 按站点自己的 Hugo `security` 配置构建；预览用的 ref 一律收紧：
  禁止 `exec`、`getenv` 和远程 HTTP，关闭内联短代码。子进程只拿到构建需要的环境变量，
  任何密钥都不会传给 Hugo。
- **增量。** 第一版在内容库层面增量：只重建变化的版本，只保存变化的对象。Hugo 层面的增量
  （常驻 Hugo 接收 Git 差异作为文件变更事件）留到测量之后再决定。

### 两种渲染器 {#renderers}

| | `hugo`（默认） | `html`（HTML 语料） |
| --- | --- | --- |
| 输入 | OINK 或 Hugo 站点的某个 ref | 已渲染的 HTML 树，例如 pgdoc-cn 的 DocBook 输出 |
| 粒度 | 每个版本构建一次 | 逐页；首次请求或后台预热时转换 |
| 页面外壳 | Hugo 构建出的完整页面 | 主题渲染的外壳模板，加上转换后的正文 |
| 实测成本 | 单版 PG 18 双语 38 s、4.2 GB | 每页 0.38 ms（p99 2.7 ms）；9.8 万份正文约 1 CPU 分钟 |
| 别名 | 302；主题完成 T10 后原位服务 | 原位服务 |

HTML 语料渲染器按内置的 profile 工作：如何取正文和标题、删除哪些原有外壳、怎样把站内链接
改写到版本前缀、把提示块和表格映射成主题组件的标记、从目录页生成导航树。第一版不提供
用户脚本，profile 从 `pgweb` 开始。转换后的正文与位置无关，可以原样放在任何别名下。

### 内容库与 .oink 格式 {#store}

内容库是一个 SQLite 文件，生产缓存、分发包和 Crib 阅读源都用这一种格式：

```text
meta(key, value)                         格式版本、生成器、站点、签名
clusters(id, codec, raw_size, data)      约 1 MiB 原始数据一簇，默认 zstd
objects(id, hash, cluster, offset, size, type)
paths(id, path)
snapshots(id, version, commit, skin, engine, base, created, state)
entries(snapshot, path, object)          WITHOUT ROWID
versions(label, snapshot, line, kind, status, sort_key)
aliases(name, target)
docs(object, lang, title, …) + fts5      每份独立正文一条搜索记录
```

- **写入端承担复杂度，读取端只按路径取字节。** 读路径：路径 → 条目 → 对象 → 簇（解压后的簇
  放在内存 LRU 里）→ 字节。
- **服务时追加，分发前紧缩。** 运行中的服务器把新对象追加到新簇；`oink build -o x.oink` 按
  “同一路径的各版本相邻”重新排序后打包，并可附加 Ed25519 签名。
- **实测体积**：pgdoc-cn 全部独立正文 31 MB；即使存带页眉页脚的整页也只有 73 MB；
  1 MiB 簇的解压 p99 在 0.3–0.43 ms 之间。
- **压缩算法逐簇标记。** Apple 的 Compression 框架没有 zstd，而 Crib 没有第三方依赖。
  要么在 Crib 引入只解码的 libzstd，要么为 Crib 打包时改用 Apple 自带的算法；需先测量，
  见[待决问题](#open-decisions)。
- **状态不进内容库。** `store.oink` 随时可以删掉重建；`state.db` 单独存放、单独备份。

### 服务路径与缓存 {#serving}

一个请求依次经过：`/_oink/` 接口分流 → 按最长前缀匹配版本或别名（无前缀即默认版本）→
权限检查 → 固定本次请求使用的快照 → 查条目 → 命中则返回，未命中则走版本感知的 404，
版本尚未构建则返回主题渲染的 503“正在构建”页并带 `Retry-After`。

插槽分两类：

- **版本插槽**：由服务器拼接，可以缓存，包括版本菜单、归档或预发布横幅、`canonical` 与 `robots`。
  它们只取决于“这是哪个版本、现在有哪些版本”，所有匿名读者拿到同一份字节，CDN 可以缓存。
- **读者插槽**：由浏览器填充，从不缓存，包括登录状态、评论、浏览量、“此页在哪些版本存在”。
  主题运行时调用 `/_oink/` 的 JSON 接口渲染；缓存的 HTML 里永远没有读者的个人数据。

版本插槽分两个阶段实现：

1. **第一阶段不改主题。** 每个 Hugo 版本构建时注入现有参数：`params.version`、`params.versions`、
   `archived_version` 和 `url_latest_version`。版本集合或外观来源变化时，在后台重建全部
   Hugo 版本。对几十个版本的站点，这只是几分钟的后台 CPU。
2. **第二阶段由主题提供插槽**（[T5](#theme-stage-two)）。页面里放空的
   `<template data-td-slot="…">` 标记；版本集合变化时，oink 对外观来源跑一次很小的“片段构建”：
   空内容，加上由内容适配器为每个版本生成的一页，复用主题现有的版本菜单与横幅 partial，
   输出每个版本的菜单、横幅，以及 HTML 语料用的外壳模板。服务器按入库时记录的偏移拼接这些字节，
   不渲染任何模板。版本数多的站点必须走这一步；HTML 语料从一开始就使用片段与外壳。

| 响应 | `Cache-Control` | 失效方式 |
| --- | --- | --- |
| 带指纹的资源（CSS、JS chunk、字体） | `public, max-age=31536000, immutable` | 文件名随内容变化 |
| 发布版与版本线的 HTML | `public, max-age=300, s-maxage=86400`，带 ETag | 发布或外观变化时清 CDN |
| 移动版本（如 `devel`）的 HTML | `public, max-age=60, s-maxage=300`，带 ETag | 每次发布时清 |
| `/_oink/versions.json` | `public, max-age=60` | 自然过期 |
| 其它 `/_oink/` 接口与受保护页面 | `private, no-store` | 不缓存 |

ETag 由对象哈希和插槽代数组成。`media` 挂载把 Git 之外的目录按前缀原样提供，支持 Range 请求、
长期缓存，不进入内容库；大图片和视频也可以继续由 nginx 或 R2 直接提供。

### 更新、失败与回滚 {#updates}

- **触发**：定时 `git fetch`（默认 60 s）；Webhook（`POST /_oink/hooks/<provider>`，HMAC 校验）；
  或者把服务器上的裸仓库当作 push 目标，直接监视其 refs。
- **队列**：默认版本优先，其次是访问量高的版本线；默认并发 1；同一版本的新提交取代排队中的旧构建。
- **原子性**：每个请求在开始时固定快照；新快照完整写入并通过检查后才切换指针。
- **失败**：构建失败、超时或检查不通过时，保留旧快照，状态里记录提交、日志尾部和警告数；
  可选外发通知。
- **保留与回滚**：移动版本保留最近 3 个快照，`oink rollback <版本>` 秒级切回；
  不再被引用的对象由垃圾回收清理，再紧缩簇。
- **升级**：替换二进制后重启，立即用现有快照服务；引擎身份变化时，后台重建并逐个版本切换。
- **崩溃安全**：两个 SQLite 文件都用 WAL；进程被 `kill -9` 后重启，已发布的快照不会丢失。

### 搜索 {#search}

- **数据**：入库时为每份独立正文生成一条记录（标题、各级标题、正文、语言），并记下它属于
  哪些版本。Hugo 渲染器优先复用主题本地搜索索引里的字段，保证两种后端检索同一份文本。
- **引擎**：SQLite FTS5 与 BM25。中日韩文本在 Go 中预先切分，与主题本地引擎和 Crib 的
  `pgdash-han2-v1` 分析器对齐；FTS5 只需 `unicode61`，不用注册自定义分词器。
- **范围**：默认当前版本线；可选全部版本，结果按页面合并并标注版本。pgdoc-cn 只需索引
  9.8 万份正文，而不是 52.9 万页。
- **权限**：结果按读者可见的范围过滤。
- **界面**：沿用主题的搜索界面，只把后端换成 `/_oink/search`；静态托管继续使用本地引擎。

### 账号、权限、评论与浏览量 {#services}

- **账号**：OAuth/OIDC 登录，先支持 GitHub；会话存在 `state.db`。第一个管理员用
  `oink user add --admin` 创建，终端打印一次性登录链接，不依赖邮件服务。
- **权限**：`oink.yaml` 按路径和版本授予角色。受保护的内容不进 CDN，不出现在他人的搜索结果里，
  `oink build` 拒绝导出它们。
- **预览**：分支、PR 或任意提交的预览只对维护者开放，并且从单独的主机名服务，
  那里没有主站的会话 cookie。
- **评论**：以页面身份为键（挂载点、语言、版本内路径；Hugo `aliases` 处理改名），默认跨版本共享，
  并标注“写于 3.7”；Markdown 子集在服务端净化；新用户首评待审，接口限速。
  giscus 继续作为静态站点的选项。
- **浏览量**：页面加载时用 `sendBeacon` 发到 `/_oink/hit`；不用 cookie，不存 IP；
  内存中累加，每分钟按天写入；是否显示由主题参数决定。

### 配置 {#configuration}

两份配置各管一件事：

- `hugo.yaml` 决定页面外观与行为，包括评论用哪个提供者、搜索用哪个后端、是否显示浏览量。
- `oink.yaml` 决定发布什么、发布到哪里，以及服务端策略：版本、外观来源、渲染器、权限、审核、
  媒体目录。它不得设置 `params.ui.*`；oink 通过内嵌 Hugo 读取有效配置，以此决定开启哪些服务。

生产读取外观来源 ref 上提交的 `oink.yaml`，改发布策略也走评审和提交。密钥只来自环境变量；
监听地址、数据目录等部署项可以用命令行参数覆盖。

```yaml {title="oink.yaml"}
origin: https://docs.example.com
skin: main
versions:
  tags: '^v(?P<line>\d+\.\d+)\.(?P<patch>\d+)$'
  branches: { devel: main }
  default: latest
  url: '/v{label}/'
access:
  - path: /internal/**
    allow: [role:staff]
previews:
  refs: refs/heads/*
  origin: https://preview.docs.example.com
  allow: [role:maintainer]
accounts:
  providers: [github] # 密钥：OINK_GITHUB_CLIENT_SECRET
comments:
  moderation: first-post
media:
  - url: /media/
    dir: /srv/media
```

## 输出、无障碍与安全边界 {#boundaries}

- **输出**：HTML 保持语义优先、渐进增强。版本菜单与横幅由服务器拼接，没有 JavaScript 也能用；
  读者插槽在没有 JavaScript 时不出现，页面依然完整可读。Print、Markdown 与 LLMS 输出逐版本
  生成，`llms.txt` 列出版本；RSS 只来自默认版本。
- **无障碍**：新增界面（版本菜单的动态形态、横幅、登录、评论、浏览量、错误页）遵循主题组件规则，
  32 种语言的字符串齐全，并通过文档站的 axe 检查。
- **构建隔离**：生产只构建配置匹配的 ref；预览从独立主机名服务，并使用收紧的构建策略；
  子进程有超时和内存上限。
- **会话与接口**：cookie 使用 `__Host-` 前缀，带 `HttpOnly`、`Secure` 和 `SameSite=Lax`；
  写接口校验 `Origin`；评论在服务端净化；CSP 由服务器设置。
- **管理面**：管理命令只走数据目录里的本地套接字；`/_oink/metrics` 只对本机或管理员开放。
- **隐私**：浏览量不收集能识别个人的数据，不使用 cookie。

## 与 OINK 主题的协调 {#theme-coordination}

要让同一个站点在普通 Hugo、`oink dev`、`oink serve` 与 `.oink` 包里体验一致，主题需要配合下列改动。
“现状”来自 2026-11-28 对主题工作区的只读盘点，路径相对于主题仓库根目录。每一项都按主题规则，
随归属检查器、32 种语言的字符串与双语契约一起交付。第一阶段只依赖 T1–T4；有了版本插槽（T5），
发布新版本才不必重建旧版本。

### 第一阶段之前（M1–M2） {#theme-stage-one}

- **T1 可嵌入的主题模块。** 现状：根目录没有 Go 文件，`go.mod` 为 `module github.com/pgsty/oink`、
  `go 1.27.4`。改动：增加一个只有几行的 `embed.go`，用 `//go:embed all:layouts all:assets …`
  把模块文件导出为 `embed.FS`。二进制从 Hugo 下载的同一个模块 zip 中取主题，二进制仓库不保存
  第二份副本，普通 Hugo 用户不受影响。
- **T2 侧栏与上下页的成本。** 现状：侧栏渲染进每个 shell 页面；页数达到 `sidebar_cache_limit`
  （500）时，整棵树 `partialCached` 后在浏览器里激活当前项。实测侧栏占页面字节的比例：
  oink.pgsty.com 为 31%（51 KB / 163 KB），pigsty.io 为 63%（203.5 KB / 313 KB，2026-11-13 的构建）。
  `pager-state.html` 为每一页线性扫描整个阅读序列。改动：完整导航树按版本输出为一个带指纹的文件，
  页面只内联当前分支；上下页改用一次预计算的索引。这样构建更快、内存更低，版本之间未变化的页面
  字节相同，内容库的去重才真正生效；对约 1 万页的 pgext 这也是前提。
- **T3 错误与状态页。** 现状：只有 `404.html`；它在生产环境输出 `index, follow`，也不包含归档横幅。
  改动：增加 401、403 和 503（正在构建）模板，状态页一律 `noindex`；404 页增加一个读者插槽，
  供运行时列出包含该路径的版本。服务器返回的每一种页面都由主题渲染。
- **T4 每个版本的编辑链接与索引控制。** 现状：编辑与历史链接由 `actions/page-urls.html` 根据
  `github_repo` 和 `github_branch`（默认 `main`）构造，分支可以按站点、分区或页面设置；robots 元标签
  只取决于是否生产环境（`head.html`），没有 `noindex` 参数；快捷键偏好与阅读历史按 `baseURL`
  的路径分区（`scripts.html`、`shell/history-dialog.html`）。改动：oink 为每个版本注入
  `github_branch`（版本线分支或默认分支），主题为只有 tag 的版本提供隐藏编辑链接的开关；
  增加构建级的 `noindex` 参数；本地存储改为按站点而不是按版本前缀分区，读者的偏好和历史在各版本
  之间保留。

### 第二阶段（M3–M4） {#theme-stage-two}

- **T5 版本插槽与片段。** 现状：版本列表在构建时写进导航栏、抽屉和页脚（`navbar.html`、
  `navbar-version-selector.html`、`shell/footer-line.html`），也写进每页约 9 KB 的命令面板 JSON
  （`actions/context.html`）；当前项的判定和 `version_menu_pagelinks` 的路径拼接
  （`content/version-url.html`）同样在构建时完成。`canonical` 固定为 `.Permalink`，没有覆盖参数
  （`seo-alternates.html`）。页数达到 500 时，`sidebar-nav.js` 依据 `link[rel="canonical"]`
  激活侧栏当前项，规范链接一旦指向别的版本，这一步就会失效。改动：版本菜单、横幅（包括 404 页）和
  `canonical` 改用 `<template data-td-slot>` 标记，并提供能单独渲染的片段布局；命令面板与 `V` 键
  从同一份片段数据取选项；侧栏改用页面自身的 URL 定位当前项；指向本站的归档横幅链接不再新开
  标签页。静态托管时，运行时从 `versions.json` 填充同一批插槽。
- **T6 搜索后端。** 现状：本地索引是资源 `offline-search-index.<lang>.json`，超过 2 MiB 时另拆
  正文文件，页面用 `data-td-index-src` 给出带基址的路径；没有服务端后端：`initSearch` 虽然接受
  `searchApi`，但面板会自动初始化，`registerSearchTail` 也只接受同步结果。改动：增加一个由配置选择的
  服务端后端（`/_oink/search`），结果结构与本地引擎相同，支持版本范围，中日韩切分与服务端一致。
  oink 入库时直接读取每个版本的本地索引文件，两种后端检索同一份文本。
- **T7 评论提供者。** 现状：`comments.type` 只支持 `giscus`，其它值会警告（`comments.html`、
  `comments-state.html`）；giscus 默认按 `pathname` 映射，同一页在不同版本前缀下会分成不同的讨论。
  改动：增加 `oink` 提供者，渲染读者插槽并沿用主题样式；giscus 在多版本站点上改用与版本无关的
  页面键。
- **T8 读者插槽运行时。** 现状：没有登录、用户菜单或浏览量组件；访问统计只有 Google Analytics。
  改动：新增一个稳定的 `js/chunks/` 目标，只在开启 oink 服务的页面加载，负责登录状态、浏览量和
  “此页在哪些版本存在”；所有新字符串进入 32 种语言文件。
- **T9 语料外壳与正文标记。** 现状：不存在。改动：提供外壳布局，让片段构建输出带插槽的整页外壳；
  发布 HTML 语料渲染器必须产出的正文标记契约（提示块、表格、代码块），让转换后的正文直接得到
  主题样式。M0 原型暂时从一张已构建的 OINK 页面切出外壳。

### 以后 {#theme-later}

- **T10 与位置无关的输出。** 现状：主题已测试子路径部署（多个检查器以 `/preview/` 为基址），
  没有写死的根相对路径，CSS 使用相对路径；但 `canonical`、hreflang、分类词链接、分享与复制链接
  使用绝对的 `.Permalink`，PlantUML 与 ReDoc 的 chunk 在构建时写入 URL，NAVJSON 与 LLMS 输出绝对
  地址，`relativeURLs` 未经支持。改动：让同一份输出能在任意前缀下服务，Hugo 版本的别名就可以
  原位服务。在此之前别名用 302，第一阶段不受影响。
- **T11 每个版本的机器输出。** LLMS、NAVJSON 与 BookManifest 带绝对地址和 `baseURL`，按版本生成即可；
  `llms.txt` 增加版本列表，让代理知道其它版本在哪里。
- **T12 Hugo 原生版本维度。** 主题目前没有使用 `site.Version`、`.Rotate` 或带版本的 `sites.matrix`。
  是否为纯静态的小型多版本站点支持原生维度，由主题路线图 R2 决定；本提案的插槽契约应与它兼容。

### 流程上的协调 {#theme-process}

- **发布顺序**：主题打 tag → 内嵌它的 oink 版本发布 → 站点更新 `go.mod` → 部署升级 oink。
  主题发布后的采用流程（`update-consumers.py`）增加一步：使用 `oink serve` 的站点同时升级二进制。
- **契约归属**：插槽、片段、`versions.json` 与语料正文标记都是主题的公开契约，写进双语 Design 契约
  并带版本号；oink 检测外观来源的主题版本，不支持插槽时退回第一阶段。
- **配置边界**：`oink.yaml` 的 schema 由二进制仓库从自己的类型生成，不进入主题的
  `schema/site-params.schema.json`；`params.ui.*` 仍只写在 `hugo.yaml` 里。
- **检查器**：`check-shell.py` 验证插槽标记与片段布局，`check-goldens.py` 记录新的 HTML 结构，
  `check-i18n.py` 保证 32 种语言一致；文档站用 `oink serve` 运行浏览器套件。

## 兼容与迁移 {#compatibility}

- **不用 oink 的站点不受影响。** 主题仓库仍是纯 Hugo 模块，不放服务端代码；
  普通 Hugo 构建的结果不变。
- **已用 `params.versions` 的多站点部署可以原样保留。** 迁移到 `oink serve` 后，第一阶段由 oink
  注入 `params.versions`；仓库里手写的列表会被覆盖，oink 给出警告。
- **现有 URL 不变。** 默认版本服务在根路径；原先放在子域名的旧版本站点，可以用 301 指向新前缀。
- **`oink-cli` 候选退役。** 其中仍有价值的检查（链接、翻译）移植到 `oink check`；没有用户的
  `oink.result/v1` 结果格式不再保留。本提案被接受时，[CLI 契约](/zh/docs/design/decisions/cli/)
  标记为被取代，CLI 路线图的版本生命周期与平台阶段一并退役。
- **对既有决定的修订。** CLI 契约要求“调用外部 Hugo、不引入 Hugo 私有运行时、不另建路由或导航权威”。
  新设计内嵌的是 Hugo 的公开命令行，单个版本内的路由与渲染仍归 Hugo；oink 只新增两项权威：
  版本维度和外部语料导入。
- **Crib**：`.crib` 格式不变；Crib 新增打开 `.oink` 的阅读模式，见里程碑 M5。

## 实现与检查器计划 {#implementation}

- **二进制仓库**：新的 `oink` 放在独立仓库（沿用 `pgsty/oink-cli` 还是新建，见待决问题）。
  Go 包大致划分为：`engine`（内嵌 Hugo、主题注入、子进程）、`gitsrc`（ref 解析、worktree、
  对象读取）、`render/hugo`、`render/html`、`store`（`.oink`）、`serve`（路由、插槽、缓存）、
  `search`、`state`（账号、评论、计数）、`admin`。
- **主题仓库**：按[与主题的协调](#theme-coordination)的优先级实现，每一项都随归属检查器和
  双语契约一起交付。
- **文档站**：本提案被接受后，新增 `oink` 用户指南与契约页；`make browser` 增加以
  `oink serve` 提供页面的 Playwright 套件。
- **检查器**：二进制仓库的 Go 测试覆盖输出与普通 Hugo 的一致性、pgdoc 子集基准、
  `kill -9` 恢复、ETag 与缓存头、权限不泄漏；主题侧由 `check-shell.py`、`check-goldens.py`、
  `check-i18n.py` 覆盖新的标记和字符串。

### 里程碑 {#milestones}

| 里程碑 | 内容 | 退出证据 |
| --- | --- | --- |
| M0 原型（约 2–3 周） | `oink serve --git pgdoc-cn`：HTML 渲染器、版本与别名、内容库、FTS；外壳暂取自一张 OINK 页面 | 560 个版本全部可访问；内容库不超过 100 MB；延迟达标；主题零改动 |
| M1 单二进制 | `oink dev`、`build`、`check`、`hugo`；主题内嵌（T1） | 只装了 oink 与 git 的机器能预览并构建文档站，输出与同一 Hugo 版本的构建一致 |
| M2 多版本服务 | Hugo 渲染器、`oink.yaml`、原子发布、保留上一个可用快照、回滚、状态、Webhook；第一阶段版本界面；主题 T2–T4 | 有 5 个以上 tag 的站点上线；坏提交不上线；`kill -9` 后恢复；版本菜单与静态构建一致 |
| M3 搜索与插槽 | FTS5、浏览量、版本插槽、语料外壳；主题 T5、T6、T8、T9 | 发布新版本无需重建旧版本；服务端搜索与本地引擎的结果一致率达标 |
| M4 账号与评论 | OAuth、角色、权限、评论、预览主机名；主题 T7 | 受保护内容不进入缓存、他人搜索和导出 |
| M5 包与 Crib | `.oink` 紧缩、签名、`oink serve x.oink`、Crib 阅读模式 | 打包往返字节一致；Crib 打开 pgdoc 全部版本 |

## 验收标准 {#acceptance}

1. 在只装了 `oink` 和 `git` 的机器上，`oink dev` 能预览本文档站，`oink build` 的输出与同一 Hugo
   版本、同一主题版本的普通 Hugo 构建一致（构建时间戳除外）。
2. `oink serve` 服务 pgdoc-cn：560 个版本全部可解析；内容库不超过 100 MB；冷启动 2 s 内开始服务；
   命中时源站 p99 延迟不超过 5 ms，簇未命中时不超过 10 ms，语料页首次转换不超过 20 ms；
   服务进程常驻内存不超过 512 MB（不含构建子进程）。
3. 推送新 tag 后，轮询模式 90 s 内、Webhook 模式 10 s 内开始构建，构建成功后指针原子切换；
   切换前后不存在新旧内容混杂的页面。
4. 在 Hugo 站点上：坏提交、构建超时和 `kill -9` 都不会替换或丢失已发布的快照；
   `oink rollback` 在 1 s 内生效。
5. 同一版本菜单在 `params.versions` 静态构建与 `oink serve` 中呈现一致（golden 比对）；
   文档站在 `oink serve` 下通过中英文、桌面与移动、亮色与暗色、axe 检查。
6. 服务端搜索在固定语料上的前 10 条结果与主题本地引擎的一致率达到约定阈值，中文查询同样达标。
7. 受保护路径对匿名读者不可见，不出现在 CDN 缓存、搜索结果和 `oink build` 输出中；
   预览主机名上没有主站的会话 cookie。
8. `oink build -o x.oink` 与 `oink serve x.oink` 往返后，每个 URL 返回的字节与原服务器一致。

## 风险 {#risks}

| 风险 | 对策 |
| --- | --- |
| Hugo 命令行或输出在升级中变化 | 钉住内嵌 Hugo 版本；CI 同时跑最新 Hugo；耦合面只有命令行参数和输出目录 |
| 二进制体积（Hugo 约 87 MB，主题文件约 36 MB） | 发布压缩包；必要时提供不内嵌主题、首次使用时下载的精简版 |
| 第一阶段的全量重建过慢 | 并发与优先级控制；侧栏外置（T2）缩短构建；第二阶段插槽（T5）消除这类重建 |
| 旧内容在当前外观下警告很多 | `oink check --versions` 逐版本报告；必要时对个别版本使用 `skin: self` |
| 插槽契约与主题版本不匹配 | 插槽契约带版本号；oink 检测外观来源的主题版本，不支持时回到第一阶段 |
| 在线功能导致范围蔓延 | M2 之前不做账号和评论；每项默认关闭，可以单独开启 |
| 预览不可信分支带来安全问题 | 独立主机名、收紧的构建策略、只取内容不取模板 |

## 备选方案 {#alternatives}

| 方案 | 结论 |
| --- | --- |
| 逐版本静态构建（mike、Read the Docs 的做法） | 存储爆炸（pgdoc-cn 原样 6.15 GB；OINK 单版 808 MB）；旧主题在新 Hugo 上构建失败；版本菜单要求每次全部重建 |
| Hugo 原生版本维度，一次构建全部版本 | 构建成本与内存随“版本数 × 页数”增长，560 版不可行，每个新 tag 都要重建全部版本；适合版本少的纯静态站点，留给主题路线图 R2 |
| fork Hugo，或在进程内调用 `hugolib` | fork 维护成本高；`hugolib` 不是稳定 API；进程内构建把内存峰值和崩溃都带进服务进程 |
| 全部内容放进数据库的 CMS | 失去 Git 与 Markdown 的权威，也失去评审流程 |
| 每个请求现场跑 Hugo 渲染单页 | Hugo 需要整站图才能渲染一页，做不到逐页 |
| Cloudflare Pages + Functions + D1 或 Hyperdrive | 多版本静态树受每次部署的文件数限制；构建时间有限；在线功能分散在 Workers 里。保留 Pages 作为 `oink build` 的静态目标，Cloudflare 作为 `oink serve` 前面的 CDN |
| `.oink` 用 tar.zst、ZIP、Git pack 或自定义 ZIM 式二进制 | tar 不能随机访问；ZIP 逐文件压缩，体积是按簇的 12 倍；Git pack 要求每个读取端都实现 Git 和渲染；自定义二进制需要另写解析器，可作为远程 Range 读取的二期选项 |

## 待决问题 {#open-decisions}

括号里是默认建议，所有者未回答时按建议推进原型，但不视为已接受。

1. 接受本提案时，正式取代 CLI 契约与 CLI 路线图的相关阶段，退役 `oink-cli` 候选？（是）
2. 二进制放在沿用的 `pgsty/oink-cli` 仓库，还是新建仓库？（沿用并改名，保留历史）
3. 外观来源默认用默认分支的头部，还是最新发布的 tag？（默认分支）
4. 规范链接：旧版本页面指向默认版本的同一页（本提案），还是保留自身（CLI 路线图草案的立场）？（指向默认版本）
5. 默认版本放在不带版本号的地址，还是所有版本都带前缀？（不带）
6. 版本线内容默认取最新 tag，还是该线分支的头部？（最新 tag；翻译项目可改为分支）
7. 评论跨版本共享，还是每个版本单独一份？（共享并标注版本）
8. 主题版本严格遵循 `go.mod`，还是允许用内嵌主题覆盖？（严格遵循）
9. `.oink` 的压缩算法：zstd 加 Crib 侧解码器，还是为 Crib 打包时用 Apple 自带算法？（先测量）
10. 第一版只支持 SQLite 状态库？（是；PostgreSQL 后端等到 pg.center 有多实例需求时再做）
11. 不带子命令的 `oink` 在站点目录里等同 `oink dev`？（是）
12. 主题是否为纯静态用户支持 Hugo 原生版本维度？（不在本提案范围，交给主题路线图 R2）

## 决策记录 {#decision-log}

| 日期 | 记录 |
| --- | --- |
| 2026-11-27 | 所有者提出在线形态的需求：评论、用户、权限、全文搜索、浏览量、多版本，覆盖 pg.center、pgext 与 500 个以上 PG 文档版本，首选 Cloudflare |
| 2026-11-28 | 所有者提出 `oink` 二进制、Git 感知的生产模式、SQLite、`.oink` 包与 Crib；在 pgdoc-cn 与 PG 18 站点上完成去重、打包与渲染测量 |
| 2026-11-28 | 所有者明确现有 `oink-cli` 可以不受约束，需求可以优化；起草本提案 |
