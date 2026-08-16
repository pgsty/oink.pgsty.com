---
title: Hugo 0.152.0–0.155.x 升级指南
linkTitle: Docsy 与 Hugo 0.152+ 升级
date: 2026-02-09
aliases: [/blog/2026/hugo-0.152.0+/]
author: >-
  [Patrice Chalin](https://github.com/chalin)（[CNCF](https://www.cncf.io/)），
  代表 [Docsy 指导委员会](/zh/blog/docsy/hello/#introducing-the-psc)
body_class: release-highlights
tags: [Docsy, Release]
params:
  hugoMinVersion: 0.157.0
---

本文总结 Hugo 0.152.0 至 0.155.3 的破坏性变更与重要变化，是 Docsy
[0.14.0](/zh/blog/docsy/0.14.0/) 与 [0.13.0](/zh/blog/docsy/0.13.0/)
发布和升级指南的配套文章。

## 升级摘要 {#upgrade-summary}

本指南重点说明 Hugo 0.152.0–0.155.x 的破坏性变更，以及可能需要执行的操作。

- 审阅 {{< badge text="BREAKING" tone="warning" >}} 变更：<a id="breaking-changes"></a>
  - <i class="fa-solid fa-triangle-exclamation fa-lg text-warning px-1"></i> [YAML yes/no Token 变为字符串](#yaml-yes-no-etc)
  - <i class="fa-solid fa-triangle-exclamation fa-lg text-warning px-1"></i> [多维站点的构建顺序发生变化](#build-order)
- 审阅 **弃用项**（不具破坏性，但建议处理）：<a id="deprecations"></a>
  - Mount 的 [`lang` 选项已弃用](#lang-mount-deprecation)
  - [`includeFiles`/`excludeFiles` 已弃用](#use-files)
- 可以快速浏览：
  - [已知问题与修复](#known-issues)
  - [重要变化](#notable-changes)
- <i class="fa-solid fa-rocket text-primary px-1"></i>
  准备好后，直接阅读[升级到 Hugo 0.155.x](#upgrade)

## <i class="fa-solid fa-triangle-exclamation fa-lg text-warning px-1"></i> YAML yes/no Token 变为字符串（0.152.0）<a id="0.152.0"></a> {#yaml-yes-no-etc}

[0.152.0][]（2025-10-21）升级到更现代的 YAML 库，导致配置文件和页面 Front
Matter 中某些 Token 的解释方式发生破坏性变化。

过去，未加引号的 `yes`、`no`、`on`、`off`
等 Token 会被视为布尔值；现在它们会被视为字符串。完整 Token 列表见
[0.152.0 发布说明][yes-no-list]。

### 操作：必需与可选 {#yaml-actions}

- <i class="fa-solid fa-triangle-exclamation fa-lg text-warning px-1"></i> **适用条件**：项目 YAML 中存在未加引号的
  `yes`、`no`、`on`、`off` 等 Token。请把它们改为 `true` 或 `false`。

  搜索以下未加引号的键或值：

  - `yes`、`Yes`、`YES`、`y`、`Y`、`on`、`On`、`ON`：改为 `true`；
  - `no`、`No`、`NO`、`n`、`N`、`off`、`Off`、`OFF`：改为 `false`。

  示例：

  ```yaml
  # OLD (now broken in 0.152.0+)
  enabled: yes
  disabled: no

  # NEW (correct)
  enabled: true
  disabled: false
  ```

- **适用条件**：项目有自定义页面[反馈][]配置。现在可以删除包含 [`yes`、`no`
  等][yes-no-list] Token 的键（或值）外层引号。

  ```yaml
  # OLD
  params:
    ui:
      feedback:
        enable: true
        'yes': Glad to hear it! ...
        'no': Sorry to hear that. ...

  # NEW
  params:
    ui:
      feedback:
        enable: true
        yes: Glad to hear it! ...
        no: Sorry to hear that. ...
  ```

[反馈]: /zh/docs/advanced/analytics/#user-feedback

## 多维内容模型（0.153.0） {#0.153.0}

[0.153.0][]（2025-12-19）引入了强大的[多维内容模型][]。借助新的 [sites.matrix][]
配置，除原有语言维度外，还能按版本和角色组织站点。

下面总结与多维站点相关的破坏性变更和弃用项。

### <i class="fa-solid fa-triangle-exclamation fa-lg text-warning px-1"></i> 多维站点的构建顺序 {#build-order}

Hugo 现在根据排序后的维度构建站点——先按权重，再按名称——而不再从默认内容语言开始。`.Site.Sites`
的排序也会受到影响。

### 操作：必需与可选 {#build-order-actions}

**适用条件**：项目依赖特定的站点构建顺序，或按位置索引
`.Site.Sites`，例如通过下标访问。请改为显式选择默认站点。

具体修复取决于访问站点的方式。例如，代码包含 `index site.Sites 0` 时，应替换为
`site.Sites.Default`。更多实际示例见 [open-telemetry/opentelemetry.io#8850][]。

## 弃用项 {#deprecations}

### Mount 的 `lang` 选项已弃用 {#lang-mount-deprecation}

#### 操作（建议） {#sites-matrix-actions}

**适用条件**：Mount 使用 `lang`。请切换到 [sites.matrix][]，以消除弃用警告。

示例：

```yaml
# OLD (deprecated)
- source: content/fr
  target: content
  lang: fr

# NEW
- source: content/fr
  target: content
  sites:
    matrix:
      languages: ['fr']
```

实际示例见 [open-telemetry/opentelemetry.io#9070][]。

### `includeFiles`/`excludeFiles` 已弃用 {#use-files}

Mount 的 `includeFiles`/`excludeFiles` 选项已经弃用，请改用支持取反的 [files][]
Filter。

#### 操作（建议） {#files-actions}

**适用条件**：Mount 使用 `includeFiles` 或 `excludeFiles`。请切换到
[files][]，以消除弃用警告。

示例：

```yaml
# OLD (deprecated)
- source: content
  target: content
  excludeFiles: ['drafts/**']

# NEW
- source: content
  target: content
  files: ['! drafts/**']
```

> [!CAUTION]
>
> 文件排除语法以 `!` 开头，且其后
> **必须紧跟一个空格**。缺少空格时，Glob 模式会被视为以 `!`
> 开头的字面路径，无法排除目标文件。相关讨论见[为什么 Glob 取反要求在感叹号后加空格？][56651]

实际示例见 [open-telemetry/opentelemetry.io#9070][]。

## 已知问题与修复 {#known-issues}

### 0.153.x 中的别名处理 {#aliases-issues}

<details>
<summary class="h6 text-primary"><b>别名</b>的已知问题</summary>

Hugo 0.153.x 的别名处理出现回归，至少影响了一个 Docsy 站点（[docsy.dev][]）：

- **默认语言别名**：行为变化可能导致刷新页面异常，见
  [gohugoio/hugo#14363][#14363] 与 [gohugoio/hugo#14361][#14361]；
- **页面别名**：在部分配置中可能指向错误语言，见
  [Docsy #2433](https://github.com/google/docsy/issues/2433)。别名处理改进已经在 0.154.0 和 0.155.0 中修复此问题。

[#14361]: https://github.com/gohugoio/hugo/issues/14361
[#14363]: https://github.com/gohugoio/hugo/pull/14363

</details>

[docsy.dev]: https://docsy.dev

## 重要变化 {#notable-changes}

以下重要变化不具破坏性。

### 0.155.0 {#notable-0.155.0}

- Sites Matrix 支持版本与维度范围查询，例如 `>= v1.0.0`；
- 页面别名可以在多维站点中正确工作；
- 新增 XMP 与 IPTC 图片元数据支持。

### 0.154.0–0.154.5 {#notable-0.154.x}

- 引入 [Partial Decorator][]（`inner` 关键字），提供强大的模板组合能力；
- 新增 [`Page.OutputFormats.Canonical`][] 方法（[0.154.4][]）；
- 新增 `reflect.*` 函数，例如 `reflect.IsPage`；
- 修复多维/多主机环境中的关键别名与站点重定向问题。

### 0.153.0 {#notable-0.153.0}

- WebP 编解码改为通过 WASM 使用 `libwebp`，处理 WebP 不再需要 Extended 版本；
- 支持动态 WebP，包括与动态 GIF 相互转换；
- `GoogleAnalytics.RespectDoNotTrack` 默认值改为 `true`；
- 删除重复内容路径警告，输出更安静，但也可能隐藏问题；
- **macOS 发行包** 现在只提供经过签名与公证的 `.pkg` 安装程序，不再支持
  `.tar.gz`。详见下方说明。

> [!NOTE] macOS 发行包与 `hugo-extended` NPM 软件包
>
> - 仍可以从 macOS `.pkg` 安装包中提取 Hugo 可执行文件；`pkgutil` 命令见
>   [hugo-extended#183][]；
> - [hugo-extended][] NPM 软件包在 0.153.0–0.153.3 期间曾短暂要求 `sudo`。

## <i class="fa-solid fa-rocket text-primary px-1"></i> 升级到 Hugo 0.155.x {#upgrade}

处理所有[破坏性变更](#breaking-changes)和[弃用项](#deprecations)后，升级到 Hugo
0.155.x 的最新版本。使用 [hugo-extended][] NPM 软件包时，可以运行：

```sh
npm install hugo-extended@latest
```

使用 [hvm][] 管理 Hugo 版本时，可以运行：

```sh
hvm use latest
```

<section class="td-checkbox-list-wrapper">

### 基本检查 {#sanity-checks}

把项目升级到 Hugo 0.155.x 后，请检查：

- [ ] **构建输出**：站点构建没有错误、警告与弃用通知；
- [ ] **别名**：默认语言重定向正确，页面别名指向正确的语言版本（见
      [0.153.x 中的别名处理](#aliases-issues)）；
- [ ] **Sites
      Matrix 构建顺序**：使用多维站点时，确认构建顺序假设依然成立（见[多维站点的构建顺序](#build-order)）。

### 交叉检查 {#cross-checks}

确认所有[破坏性变更](#breaking-changes)都已处理。下面汇总各节的必需与可选操作。

#### 必需操作（如适用） {#required-actions}

- [ ] [YAML Token 操作](#yaml-actions)
- [ ] [`sites.matrix` 操作](#sites-matrix-actions)
- [ ] [`files` 操作](#files-actions)
- [ ] [构建顺序操作](#build-order-actions)

#### 可选审阅 {#optional-review}

- [ ] [别名已知问题](#aliases-issues)
- [ ] [重要变化](#notable-changes)

</section>

### 建议的最低 Hugo 版本 {#min-hugo-version}

使用新 Sites
Matrix 功能，而且希望获得多维站点中最新别名修复与支持的项目，建议使用 Hugo
[{{% param hugoMinVersion %}}][hugo-min-version] 或更高版本：

```yaml
module:
  hugoVersion:
    min: '{{< param hugoMinVersion >}}'
```

[0.152.0]: https://github.com/gohugoio/hugo/releases/tag/v0.152.0
[0.153.0]: https://github.com/gohugoio/hugo/releases/tag/v0.153.0
[0.154.4]: https://github.com/gohugoio/hugo/releases/tag/v0.154.4
[56651]:
  https://discourse.gohugo.io/t/why-does-glob-negation-require-a-space-after/56651
[files]: https://gohugo.io/configuration/module/#files
[hugo-extended]: https://www.npmjs.com/package/hugo-extended
[hugo-min-version]:
  <https://github.com/gohugoio/hugo/releases/tag/v{{% param hugoMinVersion %}}>
[hvm]: https://github.com/jmooring/hvm
[多维内容模型]: https://gohugo.io/about/features/#multidimensional-content-model
[open-telemetry/opentelemetry.io#8850]:
  https://github.com/open-telemetry/opentelemetry.io/pull/8850
[open-telemetry/opentelemetry.io#9070]:
  https://github.com/open-telemetry/opentelemetry.io/pull/9070
[hugo-extended#183]: https://github.com/jakejarvis/hugo-extended/issues/183
[Partial Decorator]:
  https://gohugo.io/quick-reference/glossary/#partial-decorator
[`Page.OutputFormats.Canonical`]:
  https://gohugo.io/methods/page/outputformats/#canonical
[sites.matrix]: https://gohugo.io/quick-reference/glossary/#sites-matrix
[yes-no-list]: https://github.com/gohugoio/hugo/releases/tag/v0.152.0
