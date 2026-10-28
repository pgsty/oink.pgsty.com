---
title: 参与 OINK 贡献
linkTitle: 参与贡献
description: 为 OINK 1.4.0 报告问题，贡献主题修复、文档、翻译与回归测试。
weight: 40
icon: fa-solid fa-code-pull-request
search_keywords: [参与贡献, 贡献者, pull request, 问题报告, 翻译, OINK 1.4.0]
---

欢迎纠错、翻译、报告问题和提交范围明确的 pull request。当前主题版本为
**OINK v1.4.0**。[发布说明](/zh/blog/release/1.4.0/)介绍新增的阅读器、本地渲染、
搜索改进、展示变体及阅读体验修复。

## 选择贡献仓库 {#where-to-contribute}

| 改动 | 仓库 |
| --- | --- |
| 模板、样式、浏览器运行时、默认配置与主题专项检查器 | [pgsty/oink](https://github.com/pgsty/oink) |
| 文档、翻译、示例、集成测试与浏览器回归覆盖 | [pgsty/oink.pgsty.com](https://github.com/pgsty/oink.pgsty.com) |
| 可选 CLI 命令与原生站点检查 | [pgsty/oink-cli](https://github.com/pgsty/oink-cli) |

CLI 拥有独立版本与发布周期，普通 Hugo 站点不需要安装。请在负责相应行为的仓库报告问题。

## 提供可复现的问题报告 {#report-a-problem}

报告中请提供 OINK 版本、`hugo version`、模块构建使用的 Go 版本、相关配置与最小内容示例。
显示问题还需注明页面、视口宽度、浏览器、视觉预设及明暗模式，说明预期效果与实际表现。
提交报告和复现材料前，移除凭据与私有内容。

## 构建与检查 {#build-and-check}

维护基线统一为 **OINK v1.4.0**、**Hugo Extended 0.168.0** 和 **Go 1.27.3**；
模块声明的 Go 最低版本为 1.27.3。Hugo 使用内置 LibSass，普通站点构建无需额外安装
Sass 编译器、Node.js 或 npm。

禁止启用 `--panicOnWarning` 或 `HUGO_PANICONWARNING`。告警保持可见并接受审阅；
允许出现上游 LibSass 弃用告警。开发与 CI 使用固定 Hugo 基线，不维护旧版本测试矩阵。

开发主题时，把主题与本站克隆到同级目录。阅读各仓库的 `AGENTS.md`、本站
`TRANSLATION.md` 及相关[设计契约](/zh/docs/design/)。本站回归测试需要
Node >= 24 和 npm >= 11.16.0：

```sh
npm ci
make check
make browser
```

先运行负责该改动的最小检查器。`make check` 使用同级主题运行非浏览器套件；
渲染或交互发生变化时使用 `make browser`。检查受影响中英文页面在桌面、手机及
明暗模式下的效果。[仓库 README](https://github.com/pgsty/oink.pgsty.com#local-development)
同时说明了如何单独验证公开固定版本。

## 准备 pull request {#prepare-a-pull-request}

保持改动范围明确，说明问题、修改后的行为及验证结果。中英文页面同步更新，保留稳定标题 ID。
主题公共行为变化时，一并更新实现、归属检查器与相关契约的两个语言版本。
新设计提案放在双语[设计提案](/zh/docs/design/proposals/)专栏。

共享工作树中保留无关改动。只提交源码与审阅过的测试预期；生成文件、缓存、二进制文件及
文件系统模块替换不得进入 Git。历史发布说明和带日期的研究记录应忠实保留当时的证据。

## 署名与许可 {#credit-and-licenses}

[致谢页](/zh/docs/about/license/#community-contributors)将社区修复与作者和 pull request
关联起来。[1.3.1 发布说明](/zh/blog/release/1.3.1/#thanks)记录了近期阅读体验修复；
1.4.0 继续保留这些修复，以及 1.3.2 恢复的仅依赖 Hugo 的构建方式。

主题代码与站点工具使用 Apache-2.0，原创文档使用 CC BY 4.0。请保留第三方许可证和
NOTICE 文件，具体范围见[开源许可与致谢](/zh/docs/about/license/)。
