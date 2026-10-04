---
title: OINK CLI
linkTitle: CLI
description: 面向 Hugo 站点的可选 OINK 命令行工具草案介绍。
weight: 80
type: docs
icon: fa-solid fa-terminal
comments: false
---

`oink` 是 OINK 站点的可选命令行工具，帮助创建站点、检查 Hugo 产物，以及
审阅内容或主题变更。Hugo 仍负责渲染，站点仍是普通 Hugo 项目。

> [!NOTE] 草案 · 尚未正式发布
> OINK CLI 正在独立的 `oink-cli` 仓库中开发。本页介绍本地 `0.1.0-dev` 候选，
> 目前没有正式发行版或公开安装入口，命令接口仍可能调整。

## 能做什么 {#capabilities}

| 命令 | 用途 |
| --- | --- |
| `oink init` | 从固定 Starter 创建站点，选择站点类型与语言。 |
| `oink doctor` | 检查工具、配置和实际解析的主题来源。 |
| `oink check` | 检查渲染后的链接、翻译关系与源码风格政策。 |
| `oink dev` / `oink build` | 调用 Hugo 的预览服务或生产构建。 |
| `oink new` / `oink move` | 预览页面创建或移动，再应用保存的计划。 |
| `oink translations` | 查看翻译状态与差异，记录人工审阅结果。 |
| `oink upgrade` | 对比主题升级，审阅后显式写入模块变更。 |

本地候选还提供 JSON/YAML 结果、显式多站点工作区，以及经过检查的构建产物。

当前 CLI 已移除 Studio 与通用源码编辑。使用 `oink dev` 预览，普通编辑器修改，
再用 `inspect`/`check` 查看结构化报告。

## 本地试用 {#try-locally}

从已有的 `oink-cli` 源码 checkout 构建，需要 Go 1.26 或更高版本及 Make：

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

将 `../my-docs` 替换为既有站点路径。站点操作需要 Hugo Extended；OINK 的兼容
下限为 0.160.1，CLI 使用的固定 Starter 则需要 0.165.0 或更高版本，以及
Go 1.27 或更高版本。

`make deps` 会下载构建依赖。CLI 命令默认离线，当前调用需要未缓存的输入时
加入 `--network`。检查与变更预览保留站点源文件，写入经审阅变更需要显式应用；
普通 `dev` 和 `build` 可以写入 Hugo 产物与缓存。

## 延伸阅读 {#further-reading}

- [详细使用指南](/zh/docs/start/cli/)：当前命令、示例与限制。
- [CLI 契约](/zh/docs/design/decisions/cli/)：支持的行为与维护规则。
- [维护路线图](/zh/docs/design/proposals/oink-cli-maintenance-roadmap/)：历史开发阶段及其退役状态。
