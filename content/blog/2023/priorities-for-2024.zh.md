---
title: Docsy 2024 年工作重点
linkTitle: 2024 年工作重点
author: >
  [Patrice Chalin](https://github.com/chalin)（[CNCF](https://www.cncf.io/)），
  代表 [Docsy 指导委员会](/zh/blog/2022/hello/#introducing-the-psc)
date: 2023-11-28
---

> **摘要：**已有 1,400 个项目使用 Docsy！2024 年面向使用方项目的首要任务，是提升 Docsy 的稳定性、易用性、可定制性与整体一致性，同时整合现有功能。

## Docsy 是广受欢迎的主题 {#docsy-is-a-popular-theme}

Hugo 与 Docsy 的组合强大而高效，我也曾在[其他文章][]中介绍过。因而，看到 Docsy 已被
[1,400 个项目使用][docsy-analytics][^0]，或许并不令人意外。Docsy 为什么受欢迎？我无法给出确切答案，但我之所以使用并推荐它，是因为它具备发布成熟技术文档站所需的核心能力：版本管理、多语言、自动生成站点导航等。它上手迅速，让项目可以把精力放在内容交付上，而不是从头编写站点模板。

## 面向使用方项目与长期愿景 {#user-project-focused-and-long-term-vision}

[指导委员会][sc]成员（包括我本人）正在积极支持 CNCF 和 Google 内部多个依赖 Docsy 的项目。作为 Docsy 的使用者与贡献者，我们都与它的长期健康发展休戚相关。我们设想的工作重点如下：

1. 通过缺陷修复和必要升级，保障 Docsy
   **核心功能的稳定性**——例如从已经停止维护的 Bootstrap 4
   [迁移到版本 5][bs5-migration]；
2. 减少**技术债务**；
3. 提升**易用性、可定制性与可维护性**，尤其要更清晰地划分并记录“**API 表面**”，也就是配置与定制边界；
4. **整合功能**，下文将进一步解释。

Google 在五年多前将 Docsy 开源。得益于社区贡献，它的稳定性和功能集合不断增强；与此同时，Docsy 也积累了相当多的技术债务，而且在我看来已经出现轻微的软件膨胀与功能蔓延。因此，除了持续投入长期稳定性与可维护性，我们还需要**重新确认 Docsy 的核心功能，并降低其他功能的优先级**[^1]，以免遭遇与
`cross-env` 等项目[类似的处境][ce]。可以把这理解为给 Docsy 做一次“功能瘦身”。

在推进 2024 年目标之前，我们计划先搭建**测试基础设施**，并逐步扩充测试套件，以确保 Docsy 在演进过程中保持完整可靠。

## 结语 {#conclusion}

这对 2024 年乃至更长时间而言是一项艰巨任务，但我相信稳扎稳打终能取胜。

我们期待听到 Docsy 社区的声音！请[分享你的看法][]，告诉我们应如何把握重点、改进 Docsy。可以查看按[季度里程碑][]整理的 Issue，粗略了解后续版本的目标。请为你关心的议题投票或留言；我们会在既定优先级范围内尽力回应并调整发布目标。更进一步，也欢迎直接参与当季任务。新年开始后，我们尤其希望得到测试与功能整合方面的帮助。

[^0]: 数据来自 [Docsy 的 GitHub 分析页面][docsy-analytics]。

[^1]:
    核心范围之外的功能甚至可以迁移到由社区维护的独立仓库。指导委员会也在考虑为部分次要功能设计“插件”架构，例如 Mermaid 支持。

[其他文章]:
  https://www.cncf.io/blog/2023/01/19/fast-and-effective-tools-for-cncf-and-open-source-project-websites/
[docsy-analytics]: https://github.com/google/docsy/network/dependents
[ce]: https://github.com/kentcdodds/cross-env/issues/257
[sc]: ../2022/hello/#introducing-the-psc
[bs5-migration]: bootstrap-5-migration/
[分享你的看法]: https://github.com/google/docsy/discussions
[季度里程碑]: https://github.com/google/docsy/milestones
