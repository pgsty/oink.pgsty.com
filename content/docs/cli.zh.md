---
title: OINK CLI
linkTitle: CLI
description: 了解可选的 OINK 命令行工具能做什么，以及如何构建尚未发布的本地候选版。
weight: 80
type: docs
icon: fa-solid fa-terminal
comments: false
aliases:
  - /docs/start/cli/
  - /docs/start/cli-overview/
---

`oink` 是面向 OINK 站点的可选命令行工具：检查 Hugo 实际产物中的链接、锚点与翻译关系，从 Starter 创建站点，并在写入之前预览主题升级。站点仍由 Hugo 渲染，用 `oink` 管理的项目依然是普通的 Hugo 仓库。

> [!NOTE] 尚未发布，也不是必需
> 任何 OINK 站点都可以只用 `hugo` 与 `hugo server` 构建和预览，不需要这个 CLI。它在独立仓库 [pgsty/oink-cli](https://github.com/pgsty/oink-cli) 中开发，有自己的版本与发布周期，目前是本地 `0.1.0-dev` 候选版：还没有发布可执行文件或安装入口，命令也仍可能调整。

## 能做什么 {#capabilities}

| 命令                      | 用途                                          |
|---------------------------|-----------------------------------------------|
| `oink init`               | 从固定 Starter 创建站点，选择站点配置与语言。 |
| `oink doctor`             | 检查工具链、配置及实际解析的主题来源。        |
| `oink check`              | 检查渲染后的链接、翻译配对与源码排版规范。    |
| `oink dev` / `oink build` | 调用 Hugo 的本地预览服务或生产构建。          |
| `oink new` / `oink move`  | 先预览页面新建或迁移计划，确认后再应用。      |
| `oink translations`       | 查看翻译状态与差异，并记录人工审阅结果。      |
| `oink upgrade`            | 对比主题版本差异，审阅后再写入模块变更。      |

每条命令都可以用 JSON 或 YAML（`--json`、`--yaml`）输出结果，便于脚本与 CI 读取；CLI 还能一并检查多个显式登记的站点，并生成带校验结果的构建产物。它没有自带编辑器：用你惯用的编辑器写作，用 `oink dev` 预览，用 `oink inspect` 或 `oink check` 获取结构化诊断。

## 本地试用 {#try-locally}

在 `oink-cli` 的源码检出中，用 Go 和 Make 构建可执行文件：

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

把 `../my-docs` 换成你的站点路径。只有 `make deps` 会下载东西（Go 编译依赖）；CLI 本身离线运行，只有某条命令需要尚未缓存的远程输入时，才需要显式传入 `--network`。

尽管 OINK 本身已使用纯 CSS 并在 Hugo `0.170+` 上测试，这个候选版的站点命令仍预期旧版 Hugo Extended。`oink init` 复制的 Starter 快照固定在 OINK v1.3.2，生成站点后请按[升级指南](/zh/docs/admin/upgrade/)升级到当前版本。

预览不会改动任何东西：`new`、`move` 与 `upgrade` 在你执行显式的应用步骤之前不会修改站点源文件（保存的计划用 `oink plans apply` 应用，升级用 `oink upgrade --write --expect-plan ID` 应用）。`dev` 与 `build` 则会照常写入 Hugo 的构建产物与缓存。

## 延伸阅读 {#further-reading}

- [CLI 契约](/zh/docs/design/decisions/cli/)：支持的全部命令、各自可能修改什么，以及维护规则。
- [维护路线图](/zh/docs/design/proposals/oink-cli-maintenance-roadmap/)：历史开发阶段，以及其中哪些已经退役。
