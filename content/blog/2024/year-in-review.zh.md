---
title: Docsy 2024 年回顾：采用与增强
linkTitle: 2024 年回顾：采用与增强
date: 2024-12-12
author: >-
  [Patrice Chalin](https://github.com/chalin)（[CNCF](https://www.cncf.io/)），
  代表 [Docsy 指导委员会](/zh/blog/2022/hello/#introducing-the-psc)
description: >-
  回顾 Docsy 2024 年在功能与采用方面的增长：使用量提高 57%，新增深色模式，
  并改进国际化支持。
---

回顾 2024 年，我们很高兴看到项目稳步实现 [2024
年工作重点][]中提出的目标。今年，我们专注于增强稳定性、改进国际化，并交付深色模式和持续集成（CI）测试等期待已久的功能。

> <i class="fa-solid fa-chart-line"></i>
> 2024 年，Docsy 的使用量从 1,400 个项目增长到 2,200 个，**增幅达到 57%**！[^1]

下面一起回顾 2024 年的开发亮点，也展望一下后续计划。

[2024 年工作重点]: ../2023/priorities-for-2024/

## 版本亮点 {#release-highlights}

今年我们发布了三个版本。每个版本都以稳定性为核心，同时至少引入一项重要功能增强：

- **[0.9.0](0.9.0/)** 增加了几项 _期待已久_ 的能力：
  - 通过 GitHub Actions 运行
    **CI 测试**，保障 Linux 与 Windows 上的质量和可靠性；
  - **Footer 定制**——解决 Docsy
    [存在时间最长的 Issue（#2）][#2]！——同时改进仓库链接、无障碍能力与外观风格。
- **[0.10.0](0.10.0/)**：
  - 升级到 Bootstrap 5.3，启用颜色主题和 **深色模式**，标志着 2021 年启动的
    [Bootstrap 5 迁移][]正式完成；同时调整短代码与样式，以兼容深色模式；
  - 处理核心 Hugo 升级到 0.123.0 带来的破坏性变更。
- **[0.11.0](https://github.com/google/docsy/releases/tag/v0.11.0)**：
  - 利用 Bootstrap 的 RTL 能力重新引入 **从右向左（RTL）语言支持**，增强国际化。

[#2]: https://github.com/google/docsy/issues/2
[Bootstrap 5 迁移]: https://github.com/google/docsy/issues/470

## 主要功能增强 {#enhancements}

除了有助于提升 Docsy 稳定性的关键开发功能 CI 测试，2024 年还引入了以下主要用户功能。

### 深色模式支持 {#dark-mode-support}

[深色模式][]在 v0.10.0 亮相之前，是 Docsy
**得票最高的功能请求**。该功能以 Bootstrap
5.3 颜色主题为基础，并内置浅色/深色模式菜单选择器，便于项目启用。

我们计划在 [Docsy
示例][]中[启用深色模式][]，进一步降低采用成本。OpenTelemetry 等知名项目已经采用深色模式（[opentelemetry.io#4023][]）。

[启用深色模式]: https://github.com/google/docsy-example/issues/285
[Docsy 示例]: https://github.com/google/docsy-example
[opentelemetry.io#4023]:
  https://github.com/open-telemetry/opentelemetry.io/issues/4023

### 从右向左（RTL）语言支持 {#right-to-left-rtl-language-support}

[RTL 语言支持（#1933）][#1933]借助 Bootstrap 使用的成熟、经过充分检验的
[RTLCSS][] 框架重新实现，取代了 Docsy 在 2023 年弃用的自定义 RTL 方案。

这项增强满足了多语言文档长期以来的需求。多个使用 Docsy 的大型站点都曾请求 RTL 支持，其中包括 CNCF
2024 年两个[开发活跃度最高的项目][]：

- [Kubernetes][]：
  - [从右向左语言支持 #22730](https://github.com/kubernetes/website/issues/22730)
  - [将网站本地化为阿拉伯语（ar）#22726](https://github.com/kubernetes/website/issues/22726)
  - [将网站本地化为波斯语（fa）#22727](https://github.com/kubernetes/website/issues/22727)
- [OpenTelemetry][]：
  - [增加网站页面的波斯语版本 #4990](https://github.com/open-telemetry/opentelemetry.io/issues/4990)

[#1933]: https://github.com/google/docsy/pull/1933
[深色模式]: 0.10.0/#color-themes-and-dark-mode-support
[Kubernetes]: https://kubernetes.io
[OpenTelemetry]: https://opentelemetry.io
[开发活跃度最高的项目]:
  https://www.cncf.io/blog/2024/07/11/as-we-reach-mid-year-2024-a-look-at-cncf-linux-foundation-and-top-30-open-source-project-velocity/
[RTLCSS]: https://rtlcss.com/

## 项目采用与 Docsy Starter {#adoptions-and-the-docsy-starter}

Docsy 使用量持续增长，是 2024 年最令人振奋的进展之一。GitHub 分析数据显示，截至本文写作时，使用量
**增长 57%**，达到 **2,200 个项目**。

与 [2023 年报告][]相比，CNCF 项目的采用量也有所增加。今年，[Linux
Foundation 导师项目学员][LFX] [Sandra Dindi][] 与 [Dariksha Ansari][] 使用 [CNCF
Docsy Starter][]，把以下站点迁移到 Docsy：

- **[The Update Framework](https://theupdateframework.io)**（[theupdateframework.io#105][]）
- **[in-toto](https://in-toto.io)**（[in-toto.io#76][]）

此外，[Kubernetes
网站][]正在进行一次从 v0.2 起步的大规模 Docsy 升级，以对齐最新版本并减少技术债务：

- [与上游 Docsy 对齐 kubernetes.io#41171](https://github.com/kubernetes/website/issues/41171)
- [逐步把 Docsy 升级到最新版本 kubernetes.io#44002](https://github.com/kubernetes/website/issues/44002)

升级进展顺利，可以查看正在推进的 [0.3.x 升级][]和 [0.5.x 升级][]。

[0.3.x 升级]: https://github.com/kubernetes/website/pull/48721
[0.5.x 升级]: https://github.com/kubernetes/website/issues/48807
[theupdateframework.io#105]:
  https://github.com/theupdateframework/theupdateframework.io/pull/105
[CNCF Docsy Starter]: https://github.com/chalin/docsy-starter
[LFX]:
  https://www.cncf.io/blog/2024/09/27/congratulations-to-45-cncf-term-1-2024-lfx-program-mentees/
[2023 年报告]:
  https://www.cncf.io/blog/2023/01/19/fast-and-effective-tools-for-cncf-and-open-source-project-websites/
[in-toto.io#76]: https://github.com/in-toto/in-toto.io/issues/76
[Kubernetes 网站]: https://github.com/kubernetes/website
[Dariksha Ansari]:
  https://mentorship.lfx.linuxfoundation.org/project/34314eb1-0fc3-4802-ab04-2265418c2e48
[Sandra Dindi]:
  https://mentorship.lfx.linuxfoundation.org/project/e35f28f9-f333-47a8-a76a-119567cf10ca

## 未来展望 {#whats-ahead}

展望未来，我们很高兴能继续支持 [gRPC（grpc.io#1389）][]与
[Jaeger（jaegertracing#746）][]等项目升级和采用 Docsy。

2025 年首个版本暂定功能见
[0.12.0 发布准备][0.12.0 发布准备 #2108]。目前得票最高的增强请求包括：[^2]

- [右侧目录的导航指示 #349](https://github.com/google/docsy/issues/349)
- [仓库/页面元数据链接修复与改进 #1841](https://github.com/google/docsy/issues/1841)，尤其是
  [GitLab](https://github.com/google/docsy/issues/375) 支持
- [删除 jQuery #1436](https://github.com/google/docsy/issues/1436)

感谢所有贡献者和用户，让 2024 年成为 Docsy 意义非凡的一年。祝大家在 2024 年末一切顺利，并以美好开局迎接 2025 年！让我们继续共同打造卓越的文档。

[^1]: 基于本文写作时 GitHub 分析页面中的 [Docsy Dependents][] 数据。

[^2]: 请记得为[最期待的功能投票](https://github.com/google/docsy/issues)。

[Docsy Dependents]: https://github.com/google/docsy/network/dependents
[gRPC（grpc.io#1389）]: https://github.com/grpc/grpc.io/issues/1389
[Jaeger（jaegertracing#746）]:
  https://github.com/jaegertracing/documentation/issues/746
[0.12.0 发布准备 #2108]: https://github.com/google/docsy/issues/2108
