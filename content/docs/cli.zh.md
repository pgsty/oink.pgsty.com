---
title: OINK CLI
linkTitle: CLI
description: 面向 Hugo 站点的可选 OINK 命令行工具草案介绍。
weight: 80
type: docs
icon: fa-solid fa-terminal
comments: false
aliases:
  - /docs/start/cli/
  - /docs/start/cli-overview/
---

`oink` 是面向 OINK 站点的可选命令行辅助工具，用于初始化站点、检查 Hugo 构建产物，以及审阅内容或主题变更。站点渲染仍由 Hugo 完成，项目本身保持标准的 Hugo 目录结构。

> [!NOTE] 可选草案 · 常规建站无需安装
> 日常使用 OINK 建站只需标准的 `hugo` 与 `hugo server` 命令，无需安装或编译 `oink-cli`。OINK CLI 在独立的 `oink-cli` 仓库中开发，本页介绍本地 `0.1.0-dev` 候选版，目前尚未发布正式版本或公开安装入口，命令接口仍可能调整。

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

此外，CLI 支持输出 JSON/YAML 结构化报告、管理多站点工作区，以及生成带校验结果的构建产物。早期草案中的 Studio 界面与通用源码编辑命令已移除：日常写作请用 `oink dev` 预览、用常规编辑器改稿，并通过 `inspect` 或 `check` 获取结构化诊断。

## 本地试用 {#try-locally}

在 `oink-cli` 源码仓库中使用 Go 1.27.3+ 和 Make 构建可执行文件：

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

将 `../my-docs` 替换为目标站点路径。执行站点命令需要 Hugo Extended 0.168.0+，模块操作需要 Go 1.27+。`oink init` 使用 CLI 内置的 Starter 快照初始化项目；若需升级至 OINK v1.4.0，请参考[升级指南](/zh/docs/admin/upgrade/)。

`make deps` 会下载 Go 编译依赖。CLI 命令默认离线运行，需要拉取未缓存的远程依赖时请显式传入 `--network`。检查与变更预览命令（`new`、`move`、`upgrade`）不会直接修改站点源文件，只有执行显式应用步骤时才会落盘；`dev` 与 `build` 则会正常写入 Hugo 构建产物与缓存。

## 延伸阅读 {#further-reading}

- [CLI 契约](/zh/docs/design/decisions/cli/)：支持的行为与维护规则。
- [维护路线图](/zh/docs/design/proposals/oink-cli-maintenance-roadmap/)：历史开发阶段及其退役状态。
