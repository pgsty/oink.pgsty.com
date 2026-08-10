---
title: 迁移到 Bootstrap 5.2
linkTitle: Docsy Bootstrap 5 迁移
description: >
  Docsy 从 Bootstrap 4 迁移到 5.2 的经验总结、技术洞察与操作建议。
author: >
  [Patrice Chalin](https://github.com/chalin)（[CNCF](https://www.cncf.io/) &
  [Docsy 指导委员会](/zh/blog/docsy/hello/#introducing-the-psc)）
date: 2023-06-05
canonical_url: https://www.cncf.io/blog/docsy/06/05/migrating-docsy-to-bootstrap-5/
aliases: [/blog/2023/bootstrap-5-migration/]
---

[Docsy](https://docsy.dev)
以及使用 Docsy 的项目网站（[包括 CNCF 项目][cncf-docsy]）从一开始便一直愉快地采用
[Bootstrap CSS 框架](https://getbootstrap.com)。今年一月，Docsy 过去几年使用的 Bootstrap
4
[终止维护](https://endoflife.date/bootstrap)。Docsy 指导委员会一直期待 Bootstrap
5 带来的改进，却也担心迁移工作量及其对下游项目的影响，因此尽可能推迟了迁移。2022 年 12 月 Bootstrap
4 停止接收关键更新后，我们宣布
[Docsy 进入功能冻结期](https://github.com/google/docsy/discussions/1308)，并把维护工作集中到 Bootstrap
5 迁移上。

本文记录 Docsy 迁移到
[**Bootstrap 5.2**](https://blog.getbootstrap.com/2022/07/19/bootstrap-5-2-0/)[^*]
的历程：重点介绍其中最值得关注的步骤，并特别分析最出人意料的部分。我们希望本文能帮助其他准备升级到 Bootstrap
5 的项目，尤其是 Docsy 下游项目——不过，我们还会另写一篇专门面向下游项目的文章。

## 摘要 {#tldr}

准备直接投入项目的 Bootstrap 迁移？除了仔细通读
[Bootstrap 迁移页面](https://getbootstrap.com/docs/5.2/migration/)，还要特别留意：

- `media-breakpoint-down()` Mixin 的断点参数需要上移；
- 网格 `.row` 与 `.col` 样式变更具有破坏性；
- Bootstrap Sass 文件的导入顺序：必须先导入函数。

下文将逐项说明。

## 技术细节 {#technical-details}

如果你习惯通过阅读 Changelog、逐项检查提交来升级 Docsy 及其依赖，本节可以作为若干重要变更的摘要。这里记录的技术问题之所以令我意外，是因为它们要么需要格外谨慎地修复，要么没有文档，或者在 Bootstrap
[迁移页面](https://getbootstrap.com/docs/5.2/migration/)中解释得不够充分。

### `media-breakpoint-down()` Mixin 参数上移 {#mixin-media-breakpoint-down-argument-shift}

传给 `media-breakpoint-down()`
Mixin 的[断点](https://getbootstrap.com/docs/5.2/layout/breakpoints)参数需要提升到下一个更高断点。值得庆幸的是，`media-breakpoint-up()`
不需要类似调整。Docsy 下游项目也必须完成这项变更。如果漏掉这个并不直观的破坏性布局变化，项目的响应式布局很可能以看似莫名其妙的方式失常。

<!-- markdownlint-disable no-shortcut-ref-link -->

详情与示例请参阅：

- 迁移页面的 [Sass](https://getbootstrap.com/docs/5.2/migration/#sass) 一节；
- [[BSv5] 调整 `media-breakpoint-down()` 参数 · Docsy PR #1367](https://github.com/google/docsy/pull/1367)。

### 网格 `.row` 与 `.col` 样式变更具有破坏性 {#grid-row-and-col-style-changes-are-breaking}

截至本文写作时，本节讨论的主要问题尚未出现在 Bootstrap 5
[迁移页面](https://getbootstrap.com/docs/5.2/migration/)中。

Bootstrap 5 似乎假定 `.row` 的直接子元素应当是
`.col`，但我并不确定这一假设究竟有多严格。我曾在 Bootstrap 文档中寻找明确表述，却没有找到——如果你知道出处，欢迎告诉我们。

这项假设在 Bootstrap
4 中并不明显，也没有被强制执行，因此 Docsy 的部分布局没有遵守它。[多数情况下](https://github.com/google/docsy/issues/1466)，只需用
`.col` 包裹 `.row` 的子元素即可修复；但
[Docsy Footer](https://github.com/google/docsy/blob/v0.7.0/layouts/partials/footer.html)
经过几轮迭代才正确适配。

我的第一版 Footer 调整把
[`flex-shrink`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink)
恢复为默认值（PR
[#1373](https://github.com/google/docsy/pull/1373)）。后来，在更准确地理解如何处理 Row
Margin 后（PR
[#1523](https://github.com/google/docsy/pull/1523)），才发现这并无必要——我也是[最近才知道](https://github.com/google/docsy/pull/1502#issue-1678874640)，Row 使用负外边距，这一点值得牢记。

Bootstrap 5 对 `.col`
的以下样式变更影响了 Docsy 专属样式更新，也可能影响下游项目：

- `position` 从
  [`relative`](https://github.com/twbs/bootstrap/pull/28517/files#diff-41667d8b9901aa9fa52483b538bb9026c287f2c663d2fdc01acffa06888cc087L13)
  恢复为[默认值 `static`](https://developer.mozilla.org/en-US/docs/Web/CSS/position#values)；
- `flex-shrink`
  的[默认值 1](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink#values)被覆盖为
  [0](https://github.com/twbs/bootstrap/pull/28517/files#diff-41667d8b9901aa9fa52483b538bb9026c287f2c663d2fdc01acffa06888cc087R18)。

参考资料：

- [[BSv5] Row/Col 格式破坏 Docsy 组件 #1466](https://github.com/google/docsy/issues/1466)，尤其是：
  - [[BSv5] Footer 修复：重置 flex-shrink 等 · Docsy PR #1373](https://github.com/google/docsy/pull/1373)；
  - [[BSv5] Footer：删除 flex-shrink 调整及其他修改 · Docsy PR #1523](https://github.com/google/docsy/pull/1523)；
- [为什么所有 Col 类都使用 `position: relative`？· Bootstrap v4 Issue #25254](https://github.com/twbs/bootstrap/issues/25254)；
- [为什么所有 Column 都设置 `flex-shrink: 0`？· Bootstrap Discussion #37951](https://github.com/orgs/twbs/discussions/37951)。

### Bootstrap Sass 文件导入顺序：函数优先 {#import-ordering-of-bootstrap-sass-files-functions-first}

项目既可以一次性[导入](https://getbootstrap.com/docs/5.2/customize/sass/)全部 Bootstrap
Sass 源码（使用
[bootstrap.scss](https://github.com/twbs/bootstrap/blob/v5.2.3/scss/bootstrap.scss)），也可以从
[40 多个](https://github.com/twbs/bootstrap/blob/v5.2.3/scss/bootstrap.scss)
Bootstrap Partial、布局与组件中按需导入。无论选择哪种策略，由于 Sass
Map 初始化限制，使用 Bootstrap 的项目都必须做到（着重号为本文所加）：

> ……变量定制必须位于 `@import "functions"` **之后**，但在 `@import "variables"`
> 及 [Bootstrap] 其余导入栈 **之前**。

详情请参阅迁移页面的[新增 `_maps.scss`](https://getbootstrap.com/docs/5.2/migration/#new-_mapsscss)，以及 Bootstrap
Sass 定制文档中的[导入](https://getbootstrap.com/docs/5.2/customize/sass/)。

维护几十项自定义导入列表——哪怕列表相对稳定——也是本可避免的负担。因此，在 Docsy 的
[main.scss](https://github.com/google/docsy/blob/v0.7.0/assets/scss/main.scss)
中，我们先导入 `functions`，再加载 Docsy 与项目变量覆盖，最后导入整套 Bootstrap
SCSS。这样
[`_functions.scss`](https://github.com/twbs/bootstrap/blob/v5.2.3/scss/_functions.scss)
会被导入两次；不过根据
[Sass `@import` 文档](https://sass-lang.com/documentation/at-rules/import)：

> 同一份样式表导入多次时，每次都会重新求值。如果其中只定义函数与 Mixin，通常问题不大；若包含样式规则，则会多次编译进 CSS。

[`_functions.scss`](https://github.com/twbs/bootstrap/blob/v5.2.3/scss/_functions.scss)
只包含函数定义，因此应该没有问题。与直接内联
[bootstrap.scss](https://github.com/twbs/bootstrap/blob/v5.2.3/scss/bootstrap.scss)
中 40 多项导入的策略相比，这点成本可以接受。

参考资料：

- [[BSv5] 修复 SCSS 函数导入问题……·](https://github.com/google/docsy/pull/1388)
  [Docsy PR](https://github.com/google/docsy/pull/1367)
  [#1388](https://github.com/google/docsy/pull/1388)；
- 迁移页面的[新增 `_maps.scss`](https://getbootstrap.com/docs/5.2/migration/#new-_mapsscss)；
- Bootstrap
  Sass 定制文档中的[导入](https://getbootstrap.com/docs/5.2/customize/sass/)。

## 系统化、分步骤迁移 {#systematic-and-stepwise-migration}

只要粗略看过 Bootstrap 5
[迁移页面](https://getbootstrap.com/docs/5.2/migration/)，就会发现需要处理的变化非常多。为了不漏掉任何一项，我们系统地逐段审阅迁移指南，并通过
[Docsy Issue #470](https://github.com/google/docsy/issues/470)
跟踪每项变化的状态。Issue 首条说明对应迁移页面的各个章节：不适用于 Docsy 的会明确注明，其余则加入跟踪清单，并列出包含相应 Docsy 修改的 PR。若想了解最终过程，请查看[升级到 Bootstrap 5.2 · Docsy Issue #470](https://github.com/google/docsy/issues/470)。

## Docsy 的首个 Bootstrap 5 版本 {#first-bootstrap-5-release-of-docsy}

迁移的大部分工作已经完成，因此我们计划在六月初发布首个基于 Bootstrap
5 的 Docsy 版本。部分更新被推迟，其中最显著的是从右向左（[RTL](https://getbootstrap.com/docs/5.2/migration/#rtl)）文字支持。完整后续事项请查看
[BSv5.2 升级后续 · Docsy Issue #1510](https://github.com/google/docsy/issues/1510)。

如前所述，首个版本将支持
[Bootstrap 5.2](https://blog.getbootstrap.com/2022/07/19/bootstrap-5-2-0/)。我们计划通过另一轮迁移把 Docsy 升级到
[Bootstrap 5.3](https://blog.getbootstrap.com/2023/05/30/bootstrap-5-3-0/)，尤其希望利用新版[颜色模式](https://blog.getbootstrap.com/2023/05/30/bootstrap-5-3-0/#custom-color-modes)。进度可在
[Docsy Issue #1528](https://github.com/google/docsy/issues/1528) 中跟踪。

## 迁移 Docsy 下游项目 {#migrating-docsy-based-projects}

本节先为下游项目提供初步、通用的建议。我们计划另写文章覆盖更多迁移细节。

### 通读 Bootstrap 迁移页面 {#bootstrap-migration-page-walkthrough}

每个项目使用的 Bootstrap 功能组合都不同，因此多数项目都应逐项检查 Bootstrap 5.2
[迁移页面](https://getbootstrap.com/docs/5.2/migration/)。当然，也可以直接升级，看看哪里损坏或失效；但除了最简单的项目，仅仅这样做而不进行系统复查并不可取——想想前文所述，漏改一个
`media-breakpoint-down()` 参数会多么难以发现和恢复。

### Docsy 特有变更 {#docsy-specific-changes}

迁移过程中，我们也借机完成了一些迟来的 Docsy 清理工作。Docsy 特有的破坏性与非破坏性变化详见
[Changelog](/zh/project/about/changelog/#v0.7.0)。尤其值得注意的一项非破坏性重要变化是：[[BSv5] Docsy 变量清理……PR #1462](https://github.com/google/docsy/pull/1462)。

<!-- markdownlint-enable no-shortcut-ref-link -->

## 动手试一试！ {#give-it-a-try}

要快速获得升级对项目影响的第一印象，直接升级 Docsy 并观察哪里损坏往往很有帮助。Docsy 团队迁移 Bootstrap
5 时就是这样做的。真正令 Docsy 用户指南构建失败的只有一项变化：`color-yiq()`
[函数重命名](https://getbootstrap.com/docs/5.2/migration/#sass)。

完成烟雾测试后，仍建议按照前述方式系统审阅 Bootstrap
[迁移页面](https://getbootstrap.com/docs/5.2/migration/)与 Docsy
[Changelog](/zh/project/about/changelog/#v0.7.0)。我在
[opentelemetry.io](https://opentelemetry.io/)
上采用了这一方法；它是第一个升级到 Bootstrap
5 预发布版 Docsy 的下游项目。整个过程[相当顺利](https://github.com/open-telemetry/opentelemetry.io/issues/2419)。OTel 网站最大的难点是升级 Bootstrap
5
[表单](https://getbootstrap.com/docs/5.2/migration/#forms)；Docsy 只使用最简单的表单，因此没有遇到这项问题。

我们会在[后续博客文章][]中继续分享 OTel 迁移经验与项目专属建议。与此同时，希望这篇技术文章已经对你的迁移有所帮助。

急于迁移的 [CNCF 项目](https://www.cncf.io/projects/)网站可以在 CNCF
[#techdocs Slack 频道](https://cloud-native.slack.com/archives/CUJ6W5TLM)提问。CNCF 与其他 Docsy 项目也可以在 Docsy 仓库[发起讨论](https://github.com/google/docsy/discussions/new)。祝迁移顺利！

衷心感谢 Docsy 指导委员会和其他审阅者对早期草稿提出意见，也感谢所有参与迁移工作的贡献者。

[^*]:
    [Bootstrap 5.3 已于 5 月 30 日正式发布](https://blog.getbootstrap.com/2023/05/30/bootstrap-5-3-0/)。我们会通过独立的迁移工作[将 Docsy 升级到 Bootstrap 5.3](https://github.com/google/docsy/issues/1528)。

_本文另有一个版本首发于 [CNCF 博客][]，题为[将 Docsy 迁移到 Bootstrap
5][原文]。_

[CNCF 博客]: https://www.cncf.io/blog/
[cncf-docsy]:
  https://www.cncf.io/blog/docsy/01/19/fast-and-effective-tools-for-cncf-and-open-source-project-websites/
[后续博客文章]: /zh/blog/docsy/0.7.x/
[原文]: <{{% param canonical_url %}}>
