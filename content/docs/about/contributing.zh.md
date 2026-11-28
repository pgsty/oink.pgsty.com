---
title: 参与 OINK 贡献
linkTitle: 参与贡献
description: 把问题报告或修复提交到负责它的仓库，并在评审前跑完主题或文档改动所需的检查。
weight: 40
icon: fa-solid fa-code-pull-request
search_keywords: [参与贡献, 贡献者, pull request, 问题报告, 翻译, OINK 1.7.0]
---

欢迎报告问题、纠错、翻译，以及提交范围明确的 pull request。OINK 的工作分布在三个仓库里，第一步是找到负责你要改动的那部分行为的仓库。

## 选择贡献仓库 {#where-to-contribute}

| 改动 | 仓库 |
| --- | --- |
| 模板、样式、浏览器运行时、默认配置与主题专项检查器 | [pgsty/oink](https://github.com/pgsty/oink) |
| 文档、翻译、示例、集成测试与浏览器回归覆盖 | [pgsty/oink.pgsty.com](https://github.com/pgsty/oink.pgsty.com) |
| 可选 CLI 命令与原生站点检查 | [pgsty/oink-cli](https://github.com/pgsty/oink-cli) |

问题请报告到负责相应行为的仓库。CLI 有独立的版本与发布周期，普通 Hugo 站点用不到它。

## 提供可复现的问题报告 {#report-a-problem}

别人能复现的问题修得最快，所以请先确认问题在[最新版本](/zh/release/)上依然存在。报告中写明 OINK 版本、`hugo version` 的输出、使用 Hugo Module 构建时的 Go 版本、相关配置与最小内容示例。显示类问题再补充页面、视口宽度、浏览器、视觉预设以及当时是浅色还是深色模式，并说明预期效果与实际表现。提交报告与复现材料之前，先移除其中的凭据与私有内容。

## 构建与检查 {#build-and-check}

开发主题时，需要把主题与本站克隆到同级目录，因为本站的检查会使用旁边的主题检出来构建：

```text
~/src/
├── oink/
└── oink.pgsty.com/
```

Go 需要 1.27.4 或更新版本（即模块声明的最低版本）；Hugo 用本机已安装的即可，{{< param hugoMinVersion >}} 或更新、任意 edition 均可。主题不固定 Hugo 版本，CI 使用当前最新版本测试。本站的回归测试还需要 Node.js 26.13.0 与 npm 12.2.2 或更新版本，但主题与站点的构建都用不到它们。动手之前，请先阅读各仓库的 `AGENTS.md`、本站的 `WRITING.md` 与 `TRANSLATION.md`，以及你要改动部分对应的[设计契约](/zh/docs/design/)。

主题的样式表是纯 CSS：直接编辑 `assets/css/td/` 下的分层文件，由 Hugo 负责拼接。改完某一层就是全部改动，没有构建步骤，也没有需要提交的生成文件；`python3 bin/check-stylesheets.py` 会检查各层及其拼接结果。

先运行覆盖本次改动的主题检查器（主题的 `AGENTS.md` 列出了全部检查器），再在本仓库运行站点测试：

```sh
npm ci
make check
make browser
```

`make check` 使用同级主题运行非浏览器测试；渲染或交互有变化时，还要运行 `make browser` 跑浏览器测试。最后，在桌面与手机宽度、浅色与深色模式下查看受影响的中英文页面。[仓库 README](https://github.com/pgsty/oink.pgsty.com#local-development) 说明了如何改用已发布的主题版本、而不是同级检出来构建。

不要在构建或 CI 任务中加入 `--panicOnWarning` 或 `HUGO_PANICONWARNING`。OINK 遇到无效输入会告警，并以安全的回退值继续构建，其测试也会有意触发这类告警，加上这个参数构建就会失败。

## 准备 pull request {#prepare-a-pull-request}

一个 pull request 只做一件事，并说明问题是什么、修改后的行为如何、怎样验证。中英文页面同步更新，并保留标题 ID，因为其它页面与主题告警都会链接到它们。改动主题的公开行为时，要连同实现、覆盖它的检查器，以及相关设计契约的中英文两个版本一起提交；新的设计提案放在双语的[设计提案](/zh/docs/design/proposals/)栏目。

只提交源码与审阅过的测试预期。生成文件、缓存、二进制文件与文件系统模块替换都不进入 Git；在共享工作树中，别人那些无关的改动保持原样。历史发布说明与带日期的研究记录保持原文，因为它们记录的是当时的证据。

## 署名与许可 {#credit-and-licenses}

[致谢](/zh/docs/about/license/#community-contributors)把每一项社区修复与它的作者和 pull request 对应起来。主题代码与站点工具采用 Apache-2.0，原创文档采用 CC BY 4.0；第三方许可证与 NOTICE 文件请保持完整。完整范围见[开源许可与致谢](/zh/docs/about/license/)。
