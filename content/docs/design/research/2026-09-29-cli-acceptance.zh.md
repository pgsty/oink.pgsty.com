---
title: 2026-09-29 CLI 验收快照
linkTitle: 2026-09-29 CLI 验收
description: 本地 CLI 候选已执行的 Starter、真实站点、离线、升级与可复现归档检查，以及独立记录的最终验收和发布状态。
weight: 60
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, 验收, Starter, 离线, 可复现构建, 升级, 本地候选]
design_kind: research
design_status: locally-validated
last_verified: 2026-09-29
---

> [!IMPORTANT] 本地实现与验收完成
> 本地 `0.1.0-dev` 实现已通过本文记录的检查，CLI 源码已提交为 `e623d93`。
> 公开发布、下游采用和生产部署仍是独立状态，本轮未执行。

## 输入与方法 {#inputs}

CLI 位于独立的 `oink-cli` Go 仓库。已接受的边界见
[CLI 与结果契约](/zh/docs/design/decisions/cli/)，可复现的用户步骤见
[使用指南](/zh/docs/start/cli/)。Hugo 继续作为外部渲染器，生成站点保留普通
Hugo 输入。

| 输入 | 观察到的基线 |
| --- | --- |
| 主机 | macOS，`darwin/arm64` |
| Go | `go1.27.1` |
| Hugo | `0.166.0+extended+withdeploy` |
| CLI | `0.1.0-dev`，本地提交 `e623d93d589c49e5c58b8fae1bd5db720fc904cb` |
| 内嵌 Starter | 提交 `137843b25bacd76ddd1f7ce71330bf2e3155b954`，完整、保留许可证的 Git 归档 |
| 生成站点的主题 pin | 公开 `github.com/pgsty/oink v1.1.0`，使用已记录的 Go 校验和 |
| 文档站主题 | 本地主题 HEAD `b0af631` 加未提交修改；这不等于公开模块的字节身份 |

Starter 归档哈希为
`e55bde279715f6d8d19d3d88671a2cf7561b515be46915b0f12c640d0ce1d958`。
已记录的投影包括选择已有语言配置、固定 OINK v1.1.0，以及为新目录设置
`enableGitInfo: false`。最后一项来自真实故障：原有 `enableGitInfo: true` 会让
尚无第一次 Git 提交的站点在严格构建中因警告而失败。没有通过创建 Git 仓库或提交
掩盖这一问题。

检查使用临时源副本、模块及渲染缓存、输出目录。CLI 检查没有写入原始 Starter 或
消费站源码，并保留了主题与文档已有的无关修改。下列数量是对应输入与 CLI 修订的
快照，不是要求后续文档修改继续维持的阈值。

## Starter 与普通 Hugo {#starter}

预备模块并隔离缓存后，六组普通 Hugo 用例均通过
`--environment production --panicOnWarning`：

| 语言配置 | 根 URL | `/manual/` 子路径 | Hugo 报告的页面数量 |
| --- | --- | --- | --- |
| `en` | 通过 | 通过 | EN 90 |
| `en,zh` | 通过 | 通过 | EN 91、ZH 89 |
| `all` | 通过 | 通过 | EN 91、ZH 89、FR 89 |

测试检查了预期语言根与代表性 Docs、Blog、Book 产物，并比对 Hugo 构建前后的
生成源码字节。公共 CLI 的 `init` 命令还分别通过了三种语言配置验证，每组均无诊断，
生成 94 个源文件。三种配置的区别在于选定的根配置；其他语言示例仍保留在快照中，
通过既有语言配置禁用。

Starter 包的单元测试、race 与 vet 检查通过。失败用例覆盖非空及符号链接目标、候选
验证失败、计划后目标替换、取消回滚、并发修改或删除，以及归档路径拒绝。重生成脚本
精确复现了固定归档、来源清单与许可证。

## 真实站点检查快照 {#sites}

下列每次运行均返回 CLI 退出码 `0`，没有记录诊断。数量描述渲染产物与检查的引用，
不代表作者编写的页面数或独立用户数。

| 站点形态与主题来源 | 文件 | HTML 文件 | 引用 | 机器产物 |
| --- | ---: | ---: | ---: | ---: |
| 三语 Starter，公开 v1.1.0，在 `/manual/` 做发布检查 | 316 | 142 | 7,042 | 6 |
| OINK 文档与回归站，本地主题 HEAD `b0af631` 加未提交修改 | 1,127 | 506 | 72,562 | 8 |
| PIG 项目站，根 Docs/Blog 路由重写，公开 v1.1.0 | 1,392 | 424 | 64,440 | 4 |
| 仓库文档与生成式目录，公开 v1.1.0 | 3,287 | 1,635 | 851,535 | 12 |

后三项是三个不同的本地消费站仓库。PIG 与目录站验证公开 pin 的解析；OINK 文档站
验证明确选定的本地主题修改，不能用来替代公开 pin 或部署站点的验收。执行这些只读
试点前已阅读站点指令。

检查覆盖已实现的 HTML 链接、锚点、资源及已输出的机器产物，不执行 JavaScript，
不检查外部 URL、托管重定向，也不执行浏览器、无障碍或视觉验收。最终 Hugo 清单
分别枚举了 261、766、662、3,192 项输出声明，按实际语言和 URL 要求每个受支持且
已启用的机器输出。前后清单逐项比对 tracked 与未被忽略的 untracked 源文件字节、
模式和 Git 状态：四站全部未变，分别覆盖 94、415、858、2,294 个源文件。

本轮修复了两项真实回归。仅生成英文的 NAVJSON 模板原本会掩盖中文产物缺失，
现在会返回政策退出码 `1` 并给出产物位置。PIG 有意使用的 `build.render: link`
侧栏项最初被误认为缺失页面，现在依据 Hugo 的生效参数排除，并有直接声明与
cascade 继承回归测试。双语 Starter 的普通构建与探针构建对照还证明，全部 223 个
原有产物字节完全一致。

## 离线执行与升级 {#offline-upgrade}

macOS 上，在依赖齐备后，已初始化双语 Starter 的全站 `check` 在
`sandbox-exec` 的 `(deny network*)` 限制下通过。结果为退出码 `0`、零诊断、
223 个文件、95 个 HTML 文件、4,461 条引用、4 个机器产物。另一次英语 `init`
也在相同操作系统网络禁止条件下通过，返回退出码 `0`、零诊断，并生成预期的 94 个
文件。这些是针对对应操作实际执行的网络禁止测试，不是 Linux 防火墙测试，也不代表
所有消费站的远程资源流程都已验证。

一个依赖 `example.invalid/oink-cache-miss@v0.0.1` 的冷缓存夹具返回 CLI 退出码
`2`，并保留 Hugo 原始的 `module lookup disabled by GOPROXY=off` 证据。
依赖缺失因此被报告为必要工作未完成，没有静默启用联网解析。

另一个临时站点执行了真实公开模块从 v1.0.0 到 v1.1.0 的升级，原始消费站没有作为
写入目标：

| 操作 | 观察结果 |
| --- | --- |
| 预览 | 退出码 `0`；候选验证通过；`applied: false`；计划只包含 `go.mod` 与 `go.sum` |
| `--write --expect-plan` | 退出码 `0`；匹配的计划验证通过并应用 |
| 重复同一目标版本 | 退出码 `0`；候选验证通过；没有待修改内容，`applied: false` |

无关的已修改 `README.md` 和未跟踪的 `user-note.txt` 在三次操作后均保留。预览与写入具有相同计划 ID，以及相同
模块文件前后哈希。这证明已执行的单站点路径，不代表 vendor 刷新或独立用户完成
升级。replacement、workspace、脏目标文件、回滚及失败保护场景通过了最终聚焦
Go 测试与 race 检查。写入只改变 `go.mod`、`go.sum`，备份清单保留原始字节；
预览与重复执行保留全部源码字节。

另在临时初始化站点运行了真实薄包装验收：`build --json` 返回 `0` 并生成
`index.html`；`dev --json` 提供 HTTP 200，将 SIGINT 转发给 Hugo，并关闭监听。
Hugo 返回 `0`，被取消的包装进程按约定返回 `2`。这些运行使用预备缓存，未启用
`--network`。

最终 `make test`（全部包与 vet）、`make test-hugo`（普通 Hugo、workspace/配置
优先级、输出探针及语言缺失回归）和 `go test -race ./...` 全部通过。三种公开
`init` 配置均在操作系统禁止网络的条件下重跑通过，冷依赖夹具再次返回 `2`。

## 归档与安装准备 {#archives}

一个冻结的 CLI 源码快照生成了四份二进制归档、一份源码归档，以及 `SHA256SUMS`。
从源码归档独立重建后，全部五份归档的 SHA-256 均一致。此次打包验证的输入哈希为：

```text
b07c5b98ef787dfe9924ce7b50c57d018c6149ec493124bb0103551a01535547
```

最终快照替代中途打包实验。全部五份归档的校验和均已核对，并从解压后的源码归档
精确复现。源码与二进制归档均包含版本化 JSON Schema、许可证、依赖 pin 和 Starter
来源记录。`make install` 安装到临时前缀及安装后二进制的 `--version` 检查通过。

| 目标 | 证据 |
| --- | --- |
| `darwin/arm64` | 已编译、执行本机二进制，并验证本地安装路径 |
| `darwin/amd64` | 仅交叉编译，未在该架构执行 |
| `linux/amd64` | 仅交叉编译，未在 Linux 执行 |
| `linux/arm64` | 仅交叉编译，未在 Linux 执行 |

归档构建器记录工具链、参数、源码输入哈希与平台限制，只准备本地文件。这项测试
没有建立公开下载 URL 或已发布的安装标签。

## 复现相关检查 {#reproduce}

在依赖已经预备的 CLI checkout 中执行：

```sh
make build
make test
make test-hugo
go run scripts/snapshot-starter.go --source ../oink-starter
```

按同级目录布局复现站点产物检查时，将 JSON 与日志保存在各消费站源码之外：

```sh
oink_acceptance_dir="$(mktemp -d)"
mkdir "$oink_acceptance_dir/reports"
./bin/oink init "$oink_acceptance_dir/my-docs" --languages all
./bin/oink check --site "$oink_acceptance_dir/my-docs" --release \
  --base-url https://example.org/manual/ --json \
  > "$oink_acceptance_dir/reports/starter.json" \
  2> "$oink_acceptance_dir/reports/starter.log"
HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> $(cd ../oink && pwd)" \
  ./bin/oink check --site ../oink.pgsty.com --json \
  > "$oink_acceptance_dir/reports/docs.json" \
  2> "$oink_acceptance_dir/reports/docs.log"
./bin/oink check --site ../pig.pgsty.com --release --json \
  > "$oink_acceptance_dir/reports/pig.json" \
  2> "$oink_acceptance_dir/reports/pig.log"
./bin/oink check --site ../repo.pgsty.com --release --json \
  > "$oink_acceptance_dir/reports/catalog.json" \
  2> "$oink_acceptance_dir/reports/catalog.log"
```

在提供 `sandbox-exec` 的 macOS 主机上，初始化双语站点之后执行：

```sh
./bin/oink init "$oink_acceptance_dir/my-bilingual-docs" --languages en,zh
sandbox-exec -p '(version 1) (allow default) (deny network*)' \
  ./bin/oink check --site "$oink_acceptance_dir/my-bilingual-docs" --json \
  > "$oink_acceptance_dir/reports/offline.json" \
  2> "$oink_acceptance_dir/reports/offline.log"
sandbox-exec -p '(version 1) (allow default) (deny network*)' \
  ./bin/oink init "$oink_acceptance_dir/offline-en" --languages en --json \
  > "$oink_acceptance_dir/reports/offline-init.json" \
  2> "$oink_acceptance_dir/reports/offline-init.log"
```

[升级指南](/zh/docs/start/cli/#upgrade)说明预览、计划审查与显式应用步骤。
写入路径测试应使用单独的审查副本。归档实验需保持 Go 工具链和发布版本一致：

```sh
make release VERSION=0.1.0-dev DIST=dist/first
mkdir -p dist/rebuild
tar -xzf dist/first/oink_0.1.0-dev_source.tar.gz -C dist/rebuild
make -C dist/rebuild/oink_0.1.0-dev_source release \
  VERSION=0.1.0-dev DIST=dist
cmp dist/first/SHA256SUMS \
  dist/rebuild/oink_0.1.0-dev_source/dist/SHA256SUMS
```

## 限制与交付状态 {#limits}

| 状态 | 本快照中的情况 |
| --- | --- |
| 本地实现 | 六个首期命令与版本化结果格式已存在 |
| 已执行验证 | 上述运行针对其记录的输入通过 |
| 归属检查与文档站 `make check` | 实现与双语文档更新后通过 |
| 提交、标签、推送 | CLI 已本地提交 `e623d93`；没有标签、remote 或推送。文档修改与既有工作一起保留在本地 |
| CLI 公开发布或分发 | 未执行 |
| 消费站源码采用或生产部署 | 本次检查未执行 |
| 独立用户研究或采用 | 没有已测量的“五人中四人／15 分钟”研究、留存或独立团队采用数据 |

原始 JSON、日志、源码保留清单、升级恢复证据与归档核验结果保留在 CLI checkout
已忽略的 `tmp/acceptance/` 下，归档位于 `dist/first/`。这些是本地证据，不是公开
下载。本次改变 CLI 行为和文案，不改变主题呈现或交互，因此未运行浏览器套件。

首期候选没有实现 Docsy 转换。上述试点已经使用 OINK，不能验证任意 Docsy 或 MDX
迁移。[路线图](/zh/docs/design/proposals/oink-cli-roadmap/)继续将有范围的
Docsy 评估及后续迁移、主题能力描述、版本生命周期、OpenAPI、MCP 与 Studio 作为
独立提案。本地证据记录没有接受任何后续能力，也没有将它们计为完成。
