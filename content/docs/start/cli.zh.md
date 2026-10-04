---
title: 使用 OINK CLI
linkTitle: OINK CLI
description: 在本地构建可选的 Go 命令行工具，初始化固定 Starter、检查既有站点，并在写入前验证单站点主题升级。
weight: 40
icon: fa-solid fa-terminal
search_keywords: [OINK CLI, oink, doctor, check, init, upgrade, 离线, JSON]
last_verified: 2026-10-04
---

`oink` 是 Hugo 的可选 Go 命令行工具。当前本地 `0.1.0-dev` 候选专注于诊断、
真实产物检查、初始化、构建、主题升级与有保护的维护计划。Hugo 继续负责渲染，
站点可以使用普通 Hugo 构建。

> [!IMPORTANT] 本地实现
> 本指南描述 2026-10-04 的收缩命令界面。CLI 尚未公开发布或分发；旧 R1–R8
> 验收属于对应历史源码与二进制。当前范围由[CLI 契约](/zh/docs/design/decisions/cli/)
> 定义，Studio、通用编辑、context、snippets、editor 与 CI 生成已撤下。

当前缓存模块移动流程的集成验证首次失败、单用例重跑通过，间歇失败尚待调查。详见
[验证限制](/zh/docs/design/decisions/cli/#verification)。

## 本地构建与安装 {#install}

在已有的 `oink-cli` 源码 checkout 中，使用 Go 1.26 或更新版本及 Make：

```sh
make deps                    # 显式联网预备 Go 依赖
make build                   # 使用本地工具链，离线构建到 bin/oink
./bin/oink --version
./bin/oink --help
make install                 # 默认安装到 $HOME/.local/bin
export PATH="$HOME/.local/bin:$PATH"
```

`export` 只影响当前 shell。CLI 不安装系统工具，也不修改 shell 配置文件。
`make install PREFIX=/你的前缀` 可选择其他前缀，`BINDIR=/你的目录` 可指定准确目录。
源码构建需要 `go.sum` 中的依赖；`make deps` 在有网络时显式预备这些依赖。
之后的构建与安装目标使用本地工具链，不下载依赖或其他 Go 编译器。

[带日期的运行时验收记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/#a18)
对其绑定的历史候选实测 macOS arm64、原生 Linux arm64 和通过 QEMU TCG 模拟的
Linux amd64，使用 Go 1.27.1、Hugo Extended 0.166.0 与公开 OINK v1.1.0 模块。Hugo 版本检查接受 Extended 0.160.1 或更新版本，但这不代表
每个被接受的版本都经过测试。内嵌 Starter 的文档要求 Hugo Extended 0.165.0
或更新版本，以及 Go 1.27。当时的 Linux 测试在 ext4 上以非 root 用户运行，使用
已供应离线依赖，实际执行必需文件系统/信号与选定实际 Hugo 案例。guest 缺少
的可选工具保持明确跳过，拥有独立 host 协议证据。两个新构建复现全部五份归档，
三个声明运行归档在 checkout 外提取/执行，无 Node 依赖。Darwin amd64 为实验
归档，实际 Bad CPU type 后仍未验证；交叉编译不证明运行支持。Windows 不在声明范围。
这些结果只适用于记录绑定的源码与归档，不能自动证明后续收缩后的 CLI 或新构建的可执行文件。

`make release VERSION=0.1.0-dev DIST=dist` 在新目录或空目录中准备四份二进制
归档、一份源码归档及 `SHA256SUMS`，不会公开发布。已验证平台与可复现性边界见
[归档验收与复现步骤](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/#a18)。

## 从固定 Starter 创建站点 {#init}

如果尚未缓存公开主题，先预备一次。下面是显式的依赖预备命令，可能访问网络：

```sh
GOWORK=off GOTOOLCHAIN=local go mod download github.com/pgsty/oink@v1.1.0
export GOMODCACHE="$(go env GOMODCACHE)"
oink init my-docs --profile docs --languages en,zh
```

`init` 接受新目录或已有空目录，父目录必须存在。它拒绝包含既有文件的目标
（包括隐藏文件），也拒绝以符号链接作为目标。创建任何目标文件之前，它会先验证临时
候选站点，并检测操作期间目标发生的变化。

选择 `--profile project`（默认）、`docs`、`blog` 或 `book`。`project` 保留此前
完整 Starter 投影；其他配置保留对应归档内容分区，并将已有本地化站名、首页卡片/
动作和导航投影到该分区。选定内容及共享资源/示例/工作流/许可证保留归档字节，
生成配置与首页 YAML 是唯一序列化的配置投影。归档工作流示例不变，不是 `ci init`
的校验和绑定 CI 计划。

语言仍独立选择 `en`（默认）、`en,zh`、`all`（英语、中文、法语）。全部配置使用同一
份内嵌 MIT 许可证 Starter 提交 `137843b25bacd76ddd1f7ce71330bf2e3155b954`，
按记录的 Go 校验和固定 OINK v1.1.0，并在首次 Git 提交前关闭 `enableGitInfo`。
不在运行时抓取模板、初始化 Git 或提交。未知配置在写入前失败，必需 Hugo 缺失或
验证失败保留新建/空目标。

修改 `my-docs/hugo.yaml` 中的站名与 `baseURL`，再按
[Starter 教程](/zh/docs/start/starter/)修改首页数据和示例内容。自行创建 Git 历史后，
可以按需启用 `enableGitInfo`。生成站点无需 CLI，普通 Hugo 即可构建：

```sh
cd my-docs
GOWORK=off HUGO_MODULE_WORKSPACE=off GOPROXY=off HUGO_MODULE_PROXY=off \
  GOTOOLCHAIN=local hugo --environment production --panicOnWarning
cd ..
```

这里使用上文导出的 `GOMODCACHE` 与预备依赖。全部 12 种配置/语言组合均以普通
Hugo 的严格模式通过根 URL 与 `/manual/` 构建，共 24 次。产物本地引用已检查，
完整源码字节/模式/文件清单前后精确相等。公共 init/check 测试另覆盖四种配置的
英语和双语选择、默认 project 字节/模式一致，以及失败路径。

## 创建普通内容 {#authoring}

从上文初始化的双语站点开始。预览新页面包和中文草稿，检查 diff 与候选结果，
再应用保存的计划：

```sh
oink new content/docs/guide --site ./my-docs --title "Getting started" --translations zh --kind docs --plan new-guide.json
oink plans apply new-guide.json --site ./my-docs
```

`--language` 默认采用生效默认语言，`--kind` 默认为 `page`，也支持 `docs`、`blog`、
`book`。站点相对包路径必须通过实际内容挂载及语言站点矩阵得到明确映射。语言
目录保留不同物理索引，共享文件名采用实际语言关系。已有包或占用同一页面
的同级文件被保留。主文件是普通页面，选定译文是以输入标题为占位内容的草稿。
只有显式人工审阅后才有审阅状态。每份新文件须由实际 Hugo 识别为一个具有实际
渲染输出的站点自有页面；仅链接/无输出、忽略或 build-never 新文件不能仅凭既有
内容构建正常而通过。保存计划
不写对应站点文件，应用重新核对绑定的新目录/源码状态，失败时保留后续编辑器附件。

编辑器设置与片段由普通编辑器管理，CLI 不再生成这些配置。

## 检查页面与已提交变更影响 {#project-graph}

使用实际页面 ID、Hugo Path、permalink 或捕获的源文件路径。language:path ID
可避免多语言选择歧义：

```sh
oink inspect 'en:/docs/old' --site my-docs --offline --json
oink impact --since HEAD --site my-docs --offline --json
oink check links --since HEAD --site my-docs --offline --json
```

从实际捕获页面事实中选择 ID；示例页面需要在你的站点中存在。`inspect` 展示观察到
的引用、实际输出、翻译同伴与物理 bundle 输入。`impact` 渲染选定 Git 已提交树及
当前站点，纳入已删除的旧身份和未修改的入站页面。全局配置、模板、数据或不确定
归属的变更扩大范围。观察到无法证明页面归属的 alias 输出时也扩大为全范围，不按
front matter 猜测归属。

`check --since` 当前执行完整当前检查。分别阅读 `data.check_scope: full` 与
描述因果范围的 `data.impact.full_scope`。完成的 `inspect`/`impact` 事实查询返回 `0`，
质量发现保留在 `data.current_check`；完整检查仍按政策返回发现 `1`。历史缺失或
不能渲染为必需未完成 `2`：已知当前事实继续可见，旧身份与变更保持未知。不会借用
当前外部本地依赖作为历史字节。支持已提交的站点内部主题；符号链接、submodule、
必需历史不受支持或不完整均明确声明。

## 预览并应用内容移动 {#content-moves}

```sh
oink move content/docs/old content/docs/new --site my-docs --offline \
  --plan /tmp/oink-move-plan.json --json
oink plans apply /tmp/oink-move-plan.json --site my-docs --offline --json
```

使用干净的物理站点相对文件/bundle 路径，将新计划保存在选定站点之外。预览展示
原始检查、临时路由探测、最终验证、翻译/附件映射、字节/完整模式 diff、实际新旧
路由、alias 建议与人工引用。临时探测可能产生旧链接发现 `1`；只有最终候选能验证
计划。不重写原始 HTML、shortcode 输出、变换或歧义目标。它们的最终断链返回 `1`，
不保存计划。重复的普通 Markdown 目标若无法证明精确源码/输出出现位置归属，也
保持人工处理，包括聚合/打印输出。在编辑器中审阅人工源码位置与实际输出 pointer，
再创建新预览。附件移动需要证明新的发布 URL，不能只依据新物理路径。配对且字节
相同的处理后图片输出可被证明，而绝对原始资源 URL 仍可能人工处理；不自动构造
这些未证明 URL。alias 仅供审阅，不自动序列化 front matter。

显式应用已保存计划前重新捕获并生成实际证明，再写选定文件。完整源码哈希、模式、
清单、外部输入与新目标目录持续受保护。已有目标、后续源码/附件/配置编辑或模式
变化返回 `2`，不覆盖这些改动。移动保留原始模式、二进制字节、无关文件与 Git
index，不提交。所得普通 Hugo 输入可脱离 CLI 继续构建。若应用在写入期间失败，
检查报告中命名的恢复目录。

## 诊断并验证既有站点 {#check}

可以在任意目录运行，并明确选择一个站点：

```sh
oink doctor --site ./my-docs
oink check --site ./my-docs
oink check links --site ./my-docs --format json
oink check --site ./my-docs --base-url https://example.org/manual/
oink check --site ./my-docs --release --keep-work
```

`doctor` 报告实际 Hugo 可执行文件与版本、所需工具、声明的主题 pin、生效 Hugo
配置、模块图与挂载、workspace、replacement、vendor 状态、语言及启用输出。
它不会构建站点。调查 Hugo 错误时，应将原始子进程证据与结构化发现一并保留。

`check` 将输入复制到临时目录，隔离构建产物与缓存，以 `--panicOnWarning` 运行
Hugo，再根据渲染文件检查受支持的站内链接、锚点、资源与机器输出引用。每种语言下
每个页面实际启用的输出格式与 URL 都由 Hugo 枚举，包括 front matter 覆盖和未进入
普通页面列表的静态页面。临时验证输出仅加入隔离副本，并在产物检查前移除。CLI
不根据 Markdown 文件名推导路由。未启用的机器输出不构成错误。覆盖条目说明哪些检查
已完成、未执行、不支持或未完成。浏览器交互、无障碍、外部 URL 可访问性、服务端
重定向与部署不属于静态检查范围。

JSON 的 `data.pages` 提供 Hugo 页面身份、实际路由、别名、语言、翻译、发布设置、
已知来源及输出；`data.references` 提供观察到的产物引用和已检查的锚点状态。
没有可靠文件来源的生成页面明确保留未知状态。这些是生产视图事实；
其存在不证明未声明的翻译覆盖，也不会虚构 Markdown 源码行号。
人类可读输出汇总页面/引用数量；完整数组请使用 JSON。

这两个命令都会保留源文件。`--keep-work` 保留临时目录并报告路径，便于检查；未指定
时会删除临时目录。站点需要特定配置、环境或 Hugo 可执行文件时，可使用
`--config FILE`、`--environment NAME` 和 `--hugo PATH`。配置文件必须位于
选定站点内部。诊断时，`--environment` 优先于 `HUGO_ENVIRONMENT`；均未指定时
使用 `production` 环境。如果 Hugo 在临时副本中添加或修改 `go.mod`、`go.sum`，
CLI 会报告依赖预备尚未审阅，不会把修改应用到源码，也不将原始输入静默报告为就绪。

`--release` 关闭 Go 与 Hugo 两套 workspace，并在隔离副本中禁用环境变量及 Hugo
配置中的 replacement，但保留 `go.mod` replacement。在声称完成公开 pin 检查前，必须明确
处理本地 OINK replacement；CLI 不会静默删除它。vendor 证据也独立存在：
`go.mod` 中声明了公开版本，不代表 `_vendor` 中的实际字节与该版本一致。

首期隔离检查具有以下范围限制：

| 输入形态 | 当前行为 |
| --- | --- |
| 自带 `.git` 目录的普通 checkout，或不含 Git 的实际文件副本 | 在其他已说明边界内支持 |
| 使用 `.git` 文件的关联 Git worktree | 拒绝；需要 Git 历史时，使用有独立 Git 元数据的实际文件副本 |
| 已挂载符号链接，或仍指向隔离快照外部的挂载项 | 拒绝；将输入实际复制到选定站点或受支持的本地依赖内 |
| 未挂载的辅助符号链接 | 不复制到快照；这不代表其内容已验证 |
| 将排除的 `public`、`resources`、`node_modules` 或 `tmp` 目录作为输入的挂载项 | 作为必需源码时拒绝；将创作或生成源码放入专门的源码目录 |
| 自定义 `HUGO_CONFIGDIR`，未使用支持的 `config` 位置 | 拒绝；使用站点内 `config` 树，或显式选择站点内的 `--config` 文件 |
| Hugo 内容适配器（`_content.gotmpl`） | 不支持完整的启用输出枚举；`check` 与候选验证返回必要工作未完成 |
| 多主机语言配置 | 不支持完整产物验证；返回必要工作未完成，不将不同主机当成单一输出树 |

同样，禁用页面渲染或选择使某个启用语言缺少验证输出的 render segment，不能得到
完整检查通过的结果。这些是覆盖边界，不要求删除 worktree、replacement、符号链接
或创作内容。`doctor` 仍可以检查受支持的配置，但不会声称已完成产物构建。

## 选择检查并记录项目政策 {#project-policy}

项目需要显式检查政策时，在站点根目录创建普通文件 `oink.yaml`，在一个 YAML
文档中使用 `schema_version: oink.policy/v1`。语言、菜单、URL 和主题版本保留在
已有 Hugo/模块输入中。未知政策字段/分组、无效审阅和禁用的必需分组返回 `2`。

下面保留必需链接，并演示经审阅的问题与单独部署的 URL 范围。
请将示例路径和审阅元数据替换为项目的实际决策：

```yaml
schema_version: oink.policy/v1
checks:
  links: {enabled: true, required: true}
rules:
  ANCHOR_MISSING: warning
exclusions:
  - rule_id: REFERENCE_MISSING
    file: docs/legacy/index.html
    reason: Reviewed legacy reference awaiting removal
    reviewed_by: site-maintainer
    reviewed_at: "2026-10-03T00:00:00Z"
external_scopes:
  - url: https://example.org/status/
    reason: Separately deployed status application
    reviewed_by: site-maintainer
    reviewed_at: "2026-10-03T00:00:00Z"
```

规则使用确切诊断 ID 和 `error`、`warning` 或 `info`。
排除 glob 使用规范相对路径，不支持递归 `**` 和逃逸路径。
被排除的问题仍可见，附有 `disposition: "excluded"` 和审阅元数据。
检查不会把创建审阅记录作为副作用；政策不会改变必需构建/输入/工具失败和不支持覆盖的 `2`。

站点位于 `https://example.org/manual/` 时，同 origin 的 `/status/` HTML
引用通常会因位于发布 base path 之外而失败。经审阅的范围声明该应用单独部署，
但可访问性仍未检查。按完整路径段匹配，不包含 `/status-other/`。
范围不能隐藏 `/manual/` 内缺失目标，也不能豁免机器输出的必需本地引用。

没有政策时，`check` 启用必需的链接、翻译和风格检查。`check links`、
`check translations`、`check style` 分别选择一个必需引擎；未选中分组报告
可选 `not_checked`。显式政策分组可以关闭可选检查。每次检查仍保留其严格 Hugo 前提。

## 声明翻译覆盖 {#translations}

先读取 `check --json` 的 `data.pages` 中 Hugo 实际页面身份，再声明源 `Page.Path`
范围与必需的已启用语言。路径是 Hugo 源页面身份，不受 slug、URL、别名或语言
前缀影响。扩展同一个 `oink.yaml` 对象；下面的完整示例同时声明受保护正文与基线路径：

```yaml
schema_version: oink.policy/v1
checks:
  links: {enabled: true, required: true}
  translations: {enabled: true, required: true}
  style: {enabled: true, required: true}
translations:
  scopes:
    - path: /docs/handbook
      source_language: en
      required_languages: [zh]
      mode: localized
      drafts: include
      constraints:
        explicit_ids: true
        ids: [setup]
        placeholders: ["${SERVICE_NAME}"]
        code_labels: [bash]
        required_fields: [title]
        equal_fields: [weight]
style:
  protected:
    - file: content/docs/handbook.md
      literal: "${SERVICE_NAME}"
      count: 1
baseline: .oink/baseline.json
```

请使用项目实际页面路径、文件名、ID 和受保护字符串。`mode` 默认 `localized`，
`drafts` 默认 `include`。严格模式配合 `explicit_ids: true` 要求完整的已识别
显式 ID 对应；本地化模式保护选定 `ids`。占位符数量、指定围栏代码、必需点分字段
和点分值相等分别是显式约束。其他正文、标题数量和代码可以不同。

`drafts: ignore` 跳过草稿源页面，并将草稿目标视为不可用；`require-published`
要求源页面与必需目标存在于生产视图。Hugo 已知但禁用的语言为可选
`not_applicable`；未知语言导致政策加载失败。没有范围时，检查已有默认语言配对及
重复关系，但不要求全站普遍本地化。JSON `data.translations` 分别展示缺失、草稿
和哈希审阅状态。显式不可发布的分析包含草稿/未来/过期页面，从不替代生产输出或
发布这些页面。

## 检查源码规则与来源 {#native-content}

```sh
oink check style --site ./my-docs --json
```

通用规则检查已识别的显式 ID 和声明的受保护正文。解析器遵循 Hugo 生效的
`markup.goldmark.parser.attribute.title` 和 `.block`，以及
`markup.goldmark.extensions.passthrough.enable` 和配置的 `.delimiters`。
这些设置保留在 Hugo 配置中。解析器保留原始 UTF-8/CRLF/BOM 偏移，并接受未知但合法的
YAML/TOML/JSON front matter。代码、短代码主体、原始 HTML 和数学内容不参与
正文证据；围栏后面的属性不会被当作受支持的代码属性。必需源码语法不支持，或
声明的受保护输入不存在时，返回 `2`。

小型 OINK v1.1.0 原生目录对代码/表格冲突、弃用归属字段和公开主题丢弃的属性
提供建议。`data.native_rule_provenance` 记录不可变源码/许可证哈希。
只有实际公开模块缓存挂载经过 SHA 验证时才运行目录。其他版本、replacement、
vendor 副本和未知身份报告可选 `native-theme-rules: not_checked`，通用规则仍运行。
判断某个组件是否检查完整前，应先审阅这项覆盖。

## 审阅翻译并应用元数据计划 {#review-plans}

使用报告中的确切 Hugo ID 或无歧义捕获源文件名：

```sh
oink translations status --site ./my-docs --json
oink translations diff 'en:/docs/handbook' --site ./my-docs
oink translations review 'en:/docs/handbook' 'zh:/docs/handbook' \
  --site ./my-docs --reviewed-by site-maintainer \
  --reason 'Reviewed source and translation together' --plan /tmp/oink-review.json
oink plans apply /tmp/oink-review.json --site ./my-docs
```

审阅在候选验证后预览 `.oink/translations.json`（`oink.translations/v1`），
预览阶段不写站点。记录绑定完整源文件/译文的字节 SHA-256 和显式审阅人/理由/时间。
`--reviewed-at RFC3339` 可选，默认当前 UTC。无记录为 `unknown`；`current`、
`source_changed`、`translation_changed`、`both_changed` 描述审阅后的哈希变化，
不判断翻译准确度。修改时间不是审阅证据，`diff` 展示捕获的源码文本供比较。

明确确认已完成检查中审阅过的既有问题，并保持其可见：

```sh
oink baseline capture --site ./my-docs --reviewed-by site-maintainer \
  --reason 'Reviewed existing findings for this maintenance baseline' \
  --plan /tmp/oink-baseline.json
oink plans apply /tmp/oink-baseline.json --site ./my-docs
```

默认基线为 `.oink/baseline.json`（`oink.baseline/v1`）；政策 `baseline` 可以
选择其他规范相对文件。确认过的确切规则、规范化位置/指针及条件仍保留
`disposition: "baseline"` 和审阅元数据。严重度变化不会改变指纹，新条件仍阻断。
必需但未完成的工作不能被捕获或经基线隐藏。

两种预览命令均要求审阅人和理由。`--plan FILE` 创建新的 `oink.plan/v1` 文件而
不覆盖；省略时只打印已验证计划。运行 `plans apply` 前，审阅可读 diff、站点、
文件列表及基础字节/模式保护条件。该命令重新验证隔离候选，拒绝过期保护条件、
逃逸、`.git`、符号链接和非普通文件，仅写入计划选定文件；这些命令不使用
`--write`。部分写入失败会还原本次拥有且未变化的文件，保留编辑器后续字节、模式
或删除状态。报告的恢复目录保留原始/并发证据。

## 预览并应用单站点主题升级 {#upgrade}

选择明确的版本标签。下面的命令验证候选站点，输出模块文件变更计划，但不应用：

```sh
oink upgrade --site ./my-docs --to v1.1.0 --json > upgrade-plan.json
```

普通文本显示统一模块 diff、模式变化和有界路由/alias/能力变化。JSON 中检查
`data.plan_id`、`data.changes`、`data.comparison`、基线/候选检查摘要与原始证据。
旧 URL/输出缺失会阻断更新，除非其旧输出文件处的实际重定向证明保留；未知定制
alias 身份保持未完成。这不证明普遍主题或浏览器兼容。应用重新验证的审阅计划时，
使用已记录 ID：

```sh
oink upgrade --site ./my-docs --to v1.1.0 --write \
  --expect-plan 'COPY_PLAN_ID_FROM_PREVIEW'
```

CLI 在候选验证通过后，只修改选定的 `go.mod` 与 `go.sum` 字节，并保留无关依赖、
replacement 指令、注释及无关的未提交工作。`--write` 拒绝这两个目标文件中的
未提交修改，并检测计划建立后的变化。恢复证据会指出备份位置，以及因文件被并发修改
而无法安全完成的回滚。

计划 ID 绑定当前复制源码字节/模式/清单和实际比较，不仅是模块文件文本。
后续源码/workspace/依赖修改需新预览，只应用选定模块文件。未知实际 pin 或变化/
未知渲染器/环境不能通过。比较支持单个 HTTP(S) base origin/path，多主机输入保持
未完成。生成字节哈希也绑定 ID，因此非确定性模板可能需要重新预览。不自动迁移
配置，不支持变化交由人工审阅。

OINK 的 `go.mod replace` 会阻断这条公开 pin 升级流程。包含 `_vendor` 的站点也会
被拒绝，因为本版本不刷新 vendor 内容。请在单独、可审查的副本中修改目标 pin，显式
运行 `hugo mod vendor`，再审查并验证完整 vendor 变更。仅修改 `go.mod` 永远不会
被报告为 vendor 已升级。

## 通过 Hugo 预览与构建 {#hugo}

```sh
oink dev --site ./my-docs -- --port 1315 --bind 127.0.0.1
oink build --site ./my-docs -- --minify
```

`--` 后面的参数直接传给 Hugo。CLI 展示生效命令并转发进程取消。
`dev` 运行 `hugo server`；`build` 默认选择生产环境，并添加 `--panicOnWarning`。
这两项默认直接调用 Hugo，可能创建站点通常使用的产物与缓存文件，不执行
`oink check` 所包含的引用检查。

## 检查并导出一次构建 {#checked-artifacts}

在 `OINK_PUBLIC_BASE_URL` 中设置实际发布 URL，预备站点的准确依赖，再使用新产物
目录和单独的新清单：

```sh
OINK_ARTIFACT_DIR=$(mktemp -d)
oink build --check --site ./my-docs --release \
  --base-url "$OINK_PUBLIC_BASE_URL" \
  --destination "$OINK_ARTIFACT_DIR/public" \
  --manifest "$OINK_ARTIFACT_DIR/build-manifest.json" --marker
```

仅当本次操作需要下载依赖或必需远程资源时，才添加 `--network`。示例/本地发布地址
属于发布错误；普通诊断报告警告。`--release` 也独立检查实际公开主题解析，不以本地
Git 历史或声明 pin 代替证据。

Hugo 只渲染一份隔离生产产物。CLI 检查、封装并导出同一目录树，不重新构建，也不
修改站点源码。必需覆盖未完成时返回 `2`，发现阻断项时返回 `1`；两种结果都不会
产生已验证导出。显式翻译范围政策需要被排除发布的 Hugo 身份时，返回 `2`。
可以运行独立 `check`/`translations` 获取完整不可发布维护视图，或明确选择生产
政策。命令不根据文件名推断身份。

目标必须是新目录或空目录，且父目录已存在。清单必须是公开产物树之外的新文件。
既有条目保持不变；部分导出失败后仍明确标记为未验证。可选 `--marker` 仅在
`.well-known/oink-build.json` 添加产物身份；不传该参数时不添加标记。本地
`oink.artifact/v1` 清单记录原始输入身份、已知 Git 状态、生效设置/主题/工具、
必需覆盖、Hugo 路由及准确文件摘要/模式，不包含本机绝对路径或日志，以 `0600`
模式保存。请将它保留在上传树之外。

受管理构建仅允许 `--` 后的 `--minify`、`--gc`、`--ignoreCache` 与 `--noTimes`，
以及可选布尔形式 `=true`/`=false`。上文普通 `build` 示例仍透明透传 Hugo 参数。

## 验证产物与已部署站点 {#artifact-verification}

上传前立即离线检查导出目录：

```sh
oink artifacts verify --artifact "$OINK_ARTIFACT_DIR/public" \
  --manifest "$OINK_ARTIFACT_DIR/build-manifest.json"
```

这项检查比对准确文件集合、字节及完整模式。文件缺失、新增或修改会使先前身份失效。
上传这个目录，不再构建；启用标记时保留隐藏的 `.well-known` 文件。

完成单独授权的部署后，显式验证公开 URL：

```sh
oink verify --site "$OINK_PUBLIC_BASE_URL" \
  --manifest "$OINK_ARTIFACT_DIR/build-manifest.json" --network
```

验证读取每个声明文件与不同的实际 Hugo 路由，包括语言/子路径 URL，并比对有界
解码后的响应摘要、已记录的 HTML 规范 URL/语言身份及启用的标记。HTTP 无法检查本地
文件模式。错误内容、soft-404 或不同的已捕获身份返回 `1`。超时、认证/限流失败、
服务不可用及缺少必需标记返回 `2`；离开选定 origin/path 的跳转会被阻止。
命令不发现或发送凭据。构建的 `--network` 权限不授权这次后续请求或任何上传。

## 已撤下 CI 生成 {#ci-generation}

移除 `ci init`。CI 配置保留在站点或 Starter 中。
本地 CLI 验证不执行托管 CI，也不部署站点。`plans apply` 拒绝旧 CI 计划。

## 检查显式登记的站点 {#workspace-registry}

> [!NOTE] R6 受支持本地范围已接受
> 工作区与适配器示例通过归属/运行时、实际协议、四消费者一致性/保护及规范
> 源码/渲染门禁。A07/A15 受支持范围已在
> [R6 记录](/zh/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6)中本地接受。
> 这些示例不代表 CLI 已公开发布或平台刷新已经完成。

在选定项目旁创建独立登记文件，例如 `oink.workspace.yaml`。站点字段只有 `name`
与 `directory`；Hugo 设置保留在各站，检查政策保留在该站的 `oink.yaml`。

```yaml
schema_version: oink.workspace/v1
sites:
  - name: docs
    directory: ../docs-site
  - name: blog
    directory: ../blog-site
```

```sh
oink workspace list --workspace ./oink.workspace.yaml
oink workspace check --workspace ./oink.workspace.yaml --offline --json
oink workspace check links --workspace ./oink.workspace.yaml \
  --sites docs,blog --offline --json
oink check style --workspace ./oink.workspace.yaml --site docs --offline --json
```

| 命令 | 选择范围 |
| --- | --- |
| `workspace list --workspace FILE` | 不运行 Hugo，只列出显式条目 |
| `workspace check [GROUP] --workspace FILE [--sites NAME,NAME]` | 按登记顺序检查全部或准确子集 |
| `check ... --workspace FILE --site NAME` | 对一个登记名称运行普通单站检查 |
| `plans apply FILE --workspace FILE --site NAME` | 重新验证并只应用绑定该名称规范目录的计划 |

名称是区分大小写的 ASCII 标识符，符合 `[A-Za-z][A-Za-z0-9_-]{0,63}`。
非符号链接的普通登记文件只含一份严格 YAML 文档、1–64 个不重叠站点，最多
256 KiB。目录是相对其实际父目录的字面路径，或绝对路径；不展开环境变量/glob，
不发现同级站点。规范别名识别同一站点，不能重复登记。缺失目录仍列出；检查它
返回 `2`，其余显式站点仍继续检查。汇总优先级是 `2`、`1`、`0`，保留完整逐站
发现项与覆盖。省略 `--sites` 选择全部登记站点；显式列表拒绝空项、重复项和未知
名称，仍按登记顺序处理。

直接命令必须提供 `--site NAME`，没有默认登记站点。`init`、`artifacts`、`verify`
不接受登记选择。将审阅计划保存到站点外，再显式应用到同一个名称：

```sh
oink translations review en:/docs/manual zh:/docs/manual \
  --workspace ./oink.workspace.yaml --site docs \
  --reviewed-by 'Maintainer' --reason 'Reviewed terminology and examples' \
  --reviewed-at 2026-10-03T00:00:00Z --plan ./review.plan.json --offline
oink plans apply ./review.plan.json \
  --workspace ./oink.workspace.yaml --site docs --offline
```

审阅选择器使用你自己站点检查返回的实际页面身份。将绑定 `docs` 的计划改选为
`blog` 时，在源码写入前返回 `2`。预览、验证、新鲜度与字节/模式保护和直接单站
使用相同；不会自动更新其他登记或邻近站点。

## 配置已预备的可选工具 {#optional-checkers}

CLI 不安装 markdownlint、Vale 或 lychee。独立预备工具后，在选定站点的
`oink.yaml` 中增加显式配置。当前协议为 markdownlint-cli `0.49.1`、Vale `3.24.0`
与 lychee `0.24.2`；其他上报版本在完成验证前仍不受支持。

```yaml
schema_version: oink.policy/v1
tools:
  markdownlint:
    required: false
    config: .markdownlint.yaml
    timeout_seconds: 60
  vale:
    required: false
    config: .vale.ini
    timeout_seconds: 60
  lychee:
    required: false
    config: lychee.toml
    timeout_seconds: 60
```

`enabled` 默认 `true`，`required` 默认 `false`，`command` 默认与工具种类同名。
可以按名称或绝对路径选择一个已预备可执行文件；命令不是 shell 片段。配置必须是
捕获站点内的干净相对路径。进程时间默认 60 秒，非默认值限 1–300。缺失的可选工具
显示遗漏；必需工具缺失或协议不受支持返回 `2`。问题基线或降低规则严重度不能把
必需工作未完成变成成功。

Markdownlint 与 Vale 归属 `style`；lychee 归属 `links`。选择你准备运行工具的
检查组：

```sh
oink check style --workspace ./oink.workspace.yaml --site docs --offline --json
oink check links --workspace ./oink.workspace.yaml --site docs --network --json
```

第二条命令显式允许实际外部 HTTP 请求。没有 `--network` 时，不调用 lychee：
可选覆盖为 `not_checked`，必需覆盖返回 `2`。原生本地链接检查通过不能证明外部
可用性。HTTP `401`、`403`、`408`、`425`、`429`、`5xx`、DNS/TLS 失败与超时
是不确定结果，不是确定的断链。其他失败 `4xx` 响应是类型化发现项。外部位置保持
实际输出文件与 DOM pointer；CLI 不猜测其 Markdown 行号。

Markdownlint 使用声明式 JSON、YAML 或 TOML，例如：

```yaml
default: true
MD013: false
```

不支持 JS/JSONC 配置、自定义规则与 `extends`。CLI 将私有规则对象放在不可预测
JSON pointer 后，上游 rc 数据不会改变其有效规则。Vale 需要显式 INI 与捕获的风格。
受支持的最小配置是：

```ini
StylesPath = styles
MinAlertLevel = warning

[*.md]
BasedOnStyles = Project
```

在 `styles/Project/` 提供声明式规则文件。支持的规则种类是 `existence`、
`substitution`、`repetition`、`occurrence`、`consistency`、`capitalization` 与
`sequence`。Actions、scripts、packages、sync、转换资产与风格流水线需要人工
审阅，此适配器不执行它们。Lychee 只接受这些有界请求设置：

```toml
timeout = 10
max_retries = 0
max_concurrency = 8
```

允许范围为 1–300 秒、0–3 次重试、1–32 个并发请求。还接受字面 `cache = false`，
拒绝 `cache = true`。关闭缓存与预处理器，不接受任意额外工具参数。适配器不修复
或格式化源文件。代码正文不参与源码归因；markdownlint 仍能读取 Markdown 结构
和围栏/行内代码边界，Vale 使用纯正文遮蔽。私有遮蔽保留 front matter、短代码、
原始 HTML、已配置数学公式与属性周围已证明的 UTF-8/BOM/CRLF 边界；排除/生成
文本的发现项保留为遗漏。文字工具只读取已捕获的站点自有 Markdown。

解释退出码之前，检查 `data.adapters`、`adapter.KIND` 覆盖和原始 `evidence`。
每个适配器保留版本/可执行文件/配置哈希与协议来源。不传入调用者的代理 URL/凭据
与 Node 预加载设置；已验证运行时可以保留字面的 `NO_PROXY`/`no_proxy` 主机列表
数据。这不禁用所有操作系统代理路由，也不构成网络沙箱。网络检查不验证外部片段、
浏览器行为或远端内容身份。

## 已撤下本地 Studio {#studio}

CLI 移除 `studio`。使用普通编辑器与 `oink dev` 预览站点；通过 `inspect`
及结构化报告读取维护事实。带日期 R7 验收保留为对应输入的历史证据。

### 已撤下 Studio 视图 {#studio-views}

使用 `inspect`、`check` 与结构化报告读取页面和质量事实。

### 已撤下浏览器目标 {#studio-tests}

Studio 浏览器测试目标随实现移除。当前 CLI 验证使用 Go 与真实 Hugo 测试。

## 已撤下通用编辑 {#editing}

移除 `edit` 与 Studio 编辑。使用普通编辑器修改源码，再运行 `check`。
`new`、`move`、审阅记录与基线计划继续保留候选验证和字节/模式保护。
旧编辑计划会被拒绝，带日期 R8 记录保留为历史证据。

### 已撤下 edit 命令 {#editing-cli}

移除 `edit text|field|snippet|attachment` 命令族。
保留的有界文件流程见 `new --help` 或 `move --help`。

### 已撤下 Studio 编辑 {#editing-studio}

CLI 不提供编辑器，也不接受浏览器 Apply 请求。

### 保留计划审阅 {#editing-review}

保留的预览展示完整拟议 diff。保存新计划后，显式运行
`plans apply FILE --site DIR`。候选验证、源码/外部输入保护与并发编辑恢复仍为必要条件。

## 网络与离线运行 {#offline}

默认禁止网络访问；`--offline` 可以显式表达这一选择。缺少依赖会返回未完成结果。
CLI 不安装 Hugo，不下载 Go 工具链，不修改全局配置，也不启用遥测。只有明确需要时，
才允许当前操作联网：

```sh
oink check --site ./my-docs --network
```

`--network` 和 `--offline` 不能同时使用。诊断与验证操作使用临时缓存，在其中下载
依赖，并不意味着下一次离线运行已有持久缓存。需要可重复的离线工作流时，应在普通
Go 模块缓存中预备确切版本，并按上文显式设置 `GOMODCACHE`，同时包含站点所需的
全部传递依赖。隔离验证复用已预备的模块下载制品，不复用 Hugo 全局远程资源
（`GetRemote`）缓存。仅预热远程资源缓存，不能使这项检查离线运行。应将必需的远程
内容实际保存为站点本地资源，或为该次构建显式使用 `--network`。主题已经以内置本地
文件提供的资源无需这样的下载。

## 文本、JSON、YAML 与自动化 {#json}

```sh
oink check --site ./my-docs
oink check --site ./my-docs --verbose
oink check --site ./my-docs -J > check.json 2> check.log
oink check --site ./my-docs -Y > check.yaml 2> check.log
oink translations review --help
```

| 选项 | 输出 |
| --- | --- |
| 默认 | 简洁彩色英文文本 |
| `--json`、`-J` | 一个 JSON `oink.result/v1` 对象 |
| `--yaml`、`-Y` | 一个具有相同结果字段与类型的 YAML 文档 |
| `--verbose`、`-v` | 全部发现、覆盖明细与工具日志 |
| `--no-color` | 无颜色英文文本 |

只能选择一种结构化格式。非空 `NO_COLOR` 或 `TERM=dumb` 也会关闭文本颜色。
结构化输出不添加终端颜色，工具日志写入 stderr。`--format json|yaml` 与
`--non-interactive` 保留为隐藏兼容选项；所有命令均不交互。

默认文本展示状态、计数、最多八条活动发现及明确的未检查覆盖。详细事实与已审阅
发现保留在结构化结果中。计划与升级预览展示完整 diff。Cobra 管理命令分发与各级
帮助。CLI 提示采用 ASD-STE100 风格的简短主动英文句，不宣称认证；用户内容与
外部工具证据保留原语言。

| 退出码 | 含义 |
| --- | --- |
| `0` | 请求的工作已完成，且没有阻断项 |
| `1` | 已完成的检查发现政策问题 |
| `2` | 必要工作未完成，包括工具、构建或 I/O 失败 |

应同时检查退出码与覆盖状态。`doctor` 返回零不能证明构建通过，静态检查成功也不能
证明浏览器行为或公开部署正确。这些命令不会提交、推送、发布主题或部署站点。
