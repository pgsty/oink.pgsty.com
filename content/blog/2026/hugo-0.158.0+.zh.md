---
title: Hugo 0.158.0–0.164.x 升级指南
linkTitle: Hugo 0.158+ 升级指南
date: 2026-07-28
lastmod: 2026-07-29
description: >-
  Docsy 站点从 Hugo 0.158.0 到 0.164.x 的变化：破坏性变更、弃用项、
  安全修复与已知回归，以及各版本对应的升级操作。
author: >-
  [Patrice Chalin](https://github.com/chalin)（[CNCF](https://www.cncf.io/)），
  代表 [Docsy 指导委员会](/zh/blog/2022/hello/#introducing-the-psc)
body_class: release-highlights
tags: [hugo, 升级]
params:
  hugoSupportedVersion: 0.164.0
---

本文是 [Docsy 0.16.0 发布文章](0.16.0/)的配套指南；后者说明了
[0.16.0 要求并验证过的 Hugo 版本](0.16.0/#hugo)。

## 升级摘要 {#upgrade-summary}

- **以下情况适合阅读本指南**：
  - [升级到 Docsy 0.16.0](0.16.0/#upgrade)；
  - 只升级 Hugo。
- 审阅 {{% _param BADGE BREAKING warning %}} 变更：<a id="breaking-changes"></a>
  - {{% _param BREAKING %}}
    [由 Hugo 管理的 Node 工具要求 Node 22+](#node-tools)；
  - {{% _param BREAKING %}} [HTML 内容与符号链接的安全规则发生变化](#security)。
- 审阅 **弃用项**：<a id="deprecations"></a>
  - [语言配置与模板 API](#language-apis)；
  - [图片处理配置与模板 API](#imaging)。
- 可以快速浏览：
  - [Markdown 链接转义](#amp-escaping)；
  - [图片 URL 变动](#image-url-churn)；
  - [模板与 Module 清理](#template-module-cleanup)；
  - [更快的构建与更严格的模板](#hugo-0-164-0)；
  - [重要变化](#notable-changes)。
- {{% _param FAS rocket primary %}}
  准备好后，直接阅读[升级到 Hugo {{% param hugoSupportedVersion %}}](#upgrade)。

## 语言 API 弃用项（0.158.0） {#language-apis}

Hugo [0.158.0][]
重命名了若干语言配置项和模板方法。按照 Hugo 的弃用时间线，旧名称会先记录弃用通知，随后升级为警告，最终变为错误。

Docsy 自身的模板和文档已经改用新名称——这也是 0.16.0
[提高 Hugo 最低版本](0.16.0/#hugo)的原因之一。

### 操作 {#language-api-actions}

**适用条件**：多语言站点配置使用旧语言字段。请适时重命名，并检查语言菜单输出：

```yaml
# OLD
languages:
  en:
    languageName: English
    languageDirection: ltr

# NEW
languages:
  en:
    label: English
    direction: ltr
```

**适用条件**：站点覆盖语言相关模板或 Partial。请在自定义模板代码中检查以下替换：

| 已弃用                           | 替代项                   |
| -------------------------------- | ------------------------ |
| `.Language.Lang`                 | `.Language.Name`         |
| `.Language.LanguageCode`         | `.Language.Locale`       |
| `.Language.LanguageName`         | `.Language.Label`        |
| `.Language.LanguageDirection`    | `.Language.Direction`    |
| `.Site.LanguageCode`             | `.Site.Language.Locale`  |
| `(Page\|Site).Language.Weight`   | 没有直接替代项           |
| 跨站点语言使用 `.Site.Languages` | `hugo.Sites` 或 `.Sites` |

> [!NOTE]
>
> 页面级 `.Lang` 不受影响：弃用的是 `.Language.Lang`，不是 `Page` 对象的 `Lang`
> 方法。例如，`where .Translations "Lang" "fr"` 无需改动。文本搜索 `.Lang`
> 会找到这类用法，应将其保留。

当前 Docsy 示例见[多语言支持][]。

## Markdown 链接转义（0.159.2，0.160.0 修复） {#amp-escaping}

Hugo [0.159.2][]
包含一项针对 Markdown 链接和图片危险 URL 的安全修复，但也引入了回归：渲染后的 Markdown 链接 URL 中，`&`
可能被重复转义，在 HTML 输出中变为 `&amp;amp;`。

Hugo [0.160.0][] 修复了该回归，而 [0.160.1][] 是更安全的 0.160.x 补丁版本。Docsy
0.16.0 的 Hugo 最低版本为 0.160.1，已经避开这一问题窗口。

### 操作 {#amp-escaping-actions}

**适用条件**：曾短暂测试或部署 Hugo 0.159.2。请在生成的 HTML 链接 URL 中搜索
`&amp;amp;`。

## 模板与 Module 清理（0.159.x–0.160.x） {#template-module-cleanup}

Hugo
0.159.x 延续了若干清理工作，旧 Docsy 站点、Docsy 分支或拥有本地模板覆盖的大型下游站点可能遇到这些问题。

### 操作 {#template-module-cleanup-actions}

**适用条件**：站点有自定义模板、Module Mount 或转换脚本。

- 用 `hugo.Data` 替代已弃用的 `site.Data`；
- 用 `files` 替代已弃用的 Module Mount 选项 `includeFiles` 与 `excludeFiles`；
- 用 `:contentbasename` 替代已弃用的永久链接占位符 `:filename`；
- 如果运行 `hugo mod npm pack`，升级后进行测试；
- 如果使用 `hugo convert`，提交前审阅生成输出。

**适用条件**：站点使用 Goldmark Passthrough、`RenderShortcodes`
或多语言根分区。Hugo [0.160.1][]
修复了此版本范围内与标题中的 Passthrough 元素、短代码渲染上下文标记和多语言根分区生成有关的回归；烟雾测试应覆盖这些页面。

## {{% _param BREAKING %}} Node 管理的工具（0.161.x） {#node-tools}

Hugo 0.161.x 在 Node 的 `--permission`
沙箱中运行 PostCSS、Babel、Tailwind 等 Node 工具，因此要求 **Node
22 或更高版本**。

Docsy 站点通常使用 PostCSS 处理 CSS，所以即使 Docsy 主题本身没有变化，这也可能是实际破坏性变更。Hugo
[0.163.2][] 与 [0.163.3][]
修复了权限模型回归，PostCSS 流水线应优先使用 0.163.3 或更高版本。

### 操作 {#node-tools-actions}

{{% _param BREAKING %}} **适用条件**：站点使用 Hugo
0.161.x 或更高版本，并在 Hugo 构建期间运行 PostCSS、Babel、Tailwind 或类似 Node 工具。

- 把 Node 升级到当前活跃 LTS；Docsy 0.16.0 使用 Node LTS 24；
- 在本地构建并检查 Node 权限错误；
- 如果 CI 把 `node_modules` 放在项目树之外——例如 Netlify 共享缓存——且构建以
  `ERR_ACCESS_DENIED` 失败，请升级到 Hugo 0.163.2 或更高版本；
- 如果 PostCSS 或 Babel 配置使用 `.mjs`/`.cjs` 变体，例如
  `postcss.config.mjs`，请使用能够解析这些变体的 Hugo 0.163.3；
- 使用 Tailwind 的项目应将 Tailwind 安装为 NPM 软件包；Hugo 不再支持这条路径中的独立 Tailwind 二进制文件；
- Node 工具确实需要创建子进程，却被 Hugo [0.161.1][] 或更高版本拦截时，请审阅
  `security.node.permissions.AllowChildProcess`。

## {{% _param BREAKING %}} 内容与资源安全（0.161.x–0.163.x） {#security}

Hugo 在这一版本范围内收紧了多项安全边界：

- `security.http.urls` 默认值更严格，`resources.GetRemote` 会重新检查重定向；
- 除非通过 `security.allowContent` 允许，否则默认拒绝 `text/html` 内容文件；
- 更多模板/资源函数会拒绝或忽略符号链接条目，包括 `resources.Get`，以及
  [0.163.1][] 中的 `os.ReadDir`、`os.ReadFile`、`os.Stat` 与 `os.FileExists`。

### 操作 {#security-actions}

{{% _param BREAKING %}} **适用条件**：站点使用远程资源、手写 `.html`
内容文件、符号链接内容/资源，或在缓存 Partial 中使用 `templates.Defer`。

- 使用目标 Hugo 版本在本地构建，审阅安全相关错误与警告；
- 有意发布 `.html` 内容文件时，显式配置 `security.allowContent`；
- 模板调用 `resources.GetRemote` 时，审阅 `security.http.urls`
  并测试会发生重定向的 URL；
- 内容或资源通过符号链接进入项目时，测试相关页面；如果 Hugo 拦截，应考虑改用 Hugo
  Mount 或真实文件；
- 模板在 `partialCached` 内使用 `templates.Defer`
  时，把延迟工作移到缓存 Partial 外部；Hugo 现在会报告这种无效组合，而不是静默产生错误结果。

## 图片处理弃用项与 URL 变动（0.163.x） {#imaging}

Hugo [0.163.0][]
弃用全局图片质量配置，改为按格式设置；同时新增 AVIF 相关配置，并修改内部缩放图片缓存键。

### 操作 {#imaging-actions}

**适用条件**：站点配置使用全局 `imaging.quality` 或 `imaging.compression`。

- 改为按格式设置；如果取值与 Hugo 默认值相同，也可以直接删除；
- 站点依赖 Docsy 风格的锐利照片缩小时，保留 `resampleFilter: CatmullRom`：

  ```yaml
  imaging:
    resampleFilter: CatmullRom
  ```

### 图片 URL 变动 {#image-url-churn}

**适用条件**：站点提交生成输出、比较 Public 构建，或使用会积极缓存生成图片资源的 CDN。

在 Hugo 0.161.x–0.163.x 中，即使源图片与视觉输出不变，包含 `_hu_<HASH>`
的缩放图片文件名也可能变化。这是预期的缓存键变动，可能产生嘈杂 Diff 与缓存未命中，但通常并非内容回归。出现差异时，应检查实际渲染图片，而不只是文件名。

## 更快的构建与更严格的模板（0.164.0） {#hugo-0-164-0}

Hugo [0.164.0][]
修复了一项影响 0.128.0 至 0.163.x 的模板渲染性能下降。大型站点收益最明显：在一个约 8,500 页的 Docsy 站点报告中，完整构建时间从 608 秒降到 117 秒（见[性能讨论][hugo-164-perf]）。

同一版本还收紧模板处理，并更新语法高亮：

- `resources.PostProcess` 已弃用，请改用 `templates.Defer`；Docsy 模板没有使用
  `resources.PostProcess`；
- 指定的 View 模板缺失时，`.Render`
  现在会令构建失败，而不是静默不输出；嵌套 View 名称恢复正常；
- 内置 Chroma 会重新 Tokenize
  protobuf、YAML、Markdown 等语言：语法高亮 class 会变化，文本内容不变；
- 多语言 Sitemap 中，每个 URL 的 `xhtml:link` 备用项现在优先列出该条目自身语言。

### 操作 {#hugo-0-164-0-actions}

**适用条件**：站点规模较大，覆盖或新增模板，或者提交生成输出。

- 对干净的生产构建进行基准测试；模板密集型站点的构建时间可能大幅改善；
- 在自定义模板中用 `templates.Defer` 替代 `resources.PostProcess`；
- 修复所有引用缺失 View 模板的 `.Render` 调用；它们现在会令构建失败；
- 把语法高亮 class 变化与 Sitemap 备用链接排序变化视为预期输出变动。

## 其他弃用项与重要变化 {#notable-changes}

### 模板与配置弃用项 {#other-deprecations}

站点有自定义模板、外部内容转换器或 JavaScript 工具配置时，请审阅以下事项：

- `.IsNode` 已弃用，请改用 `.IsBranch`；
- 已删除 `jsconfig` 的 `baseUrl` 支持；
- 如果从 Module Mount 页面读取 Git 元数据，请验证 `.Page.GitInfo` 输出。Hugo
  [0.162.0][] 修复了 `go.mod` 位于仓库子目录的 Module 的 GitInfo 处理；
- 使用 `--renderSegments` 时，优先选择修复 Segment 合并的 Hugo 0.163.1；
- 站点设置 `uglyURLs: true`，而且页面与分区同名——例如 `download.htm` 与
  `download/` 并存——时，请使用 Hugo
  0.163.3，它修复了 0.163.x 早期引入的渲染冲突；
- 通过外部转换器渲染 Pandoc 或 reStructuredText 内容时，Hugo
  0.163.2 会在缺少转换器二进制文件时
  **令构建失败**（与 AsciiDoc 一致），不再静默发布原始内容；所有构建环境都必须安装转换器。

### 安全修复 {#security-fixes}

该版本范围包含多项安全更新，包括 Go `html/template`
修复，以及更严格的 URL/内容处理。Hugo [0.163.3][]
还加强了默认代码块渲染钩子：围栏代码块的语言 Token（Info
String）现在会转义，这对渲染不可信 Markdown 的站点尤其重要。因此，与停留在 0.160.1 相比，更应优先使用 0.163.3 或更高版本。

### 值得了解的新功能 {#new-features}

- `css.Build` 以及后续 `hugo:vars`
  支持可能有助于站点专属 CSS 流水线，但 Docsy 尚未把 Sass/PostCSS 流水线迁移到
  `css.Build`；
- 0.162.x–0.163.x 新增并持续调整 AVIF 图片处理；
- Hugo 0.158.0 或更高版本为模板作者提供 `strings.ReplacePairs`；
- Hugo 0.164.0 的 `hugo gen chromastyles` 新增 `--mode` 与 `--modeSelector`
  参数，可以生成合并的浅色/深色语法高亮样式表。

## {{% _param FAS rocket primary %}} 升级到 Hugo {{% param hugoSupportedVersion %}} {#upgrade}

处理所有适用的破坏性变更与弃用项后，升级到 Hugo
[{{% param hugoSupportedVersion %}}][hugo-supported-version]。

使用 [hugo-extended][] NPM 软件包：

```sh
npm install --save-exact --save-dev hugo-extended@{{% param hugoSupportedVersion %}}
```

使用 [hvm][]：

```sh
hvm use {{% param hugoSupportedVersion %}}/extended
```

其他安装方式见[安装 Hugo][]。

### {{% _param FAS square-check primary %}} 基本检查 {#sanity-checks}

确认已经处理适用于站点的[每项操作][]，然后：

- 如果升级属于 [Docsy 0.16.0](0.16.0/)
  的一部分，请继续其[升级章节](0.16.0/#upgrade)；
- 否则，以[通用站点检查][check]收尾。

<!-- prettier-ignore-start -->
[0.158.0]: https://github.com/gohugoio/hugo/releases/tag/v0.158.0
[0.159.2]: https://github.com/gohugoio/hugo/releases/tag/v0.159.2
[0.160.0]: https://github.com/gohugoio/hugo/releases/tag/v0.160.0
[0.160.1]: https://github.com/gohugoio/hugo/releases/tag/v0.160.1
[0.161.1]: https://github.com/gohugoio/hugo/releases/tag/v0.161.1
[0.162.0]: https://github.com/gohugoio/hugo/releases/tag/v0.162.0
[0.163.0]: https://github.com/gohugoio/hugo/releases/tag/v0.163.0
[0.163.1]: https://github.com/gohugoio/hugo/releases/tag/v0.163.1
[0.163.2]: https://github.com/gohugoio/hugo/releases/tag/v0.163.2
[0.163.3]: https://github.com/gohugoio/hugo/releases/tag/v0.163.3
[0.164.0]: https://github.com/gohugoio/hugo/releases/tag/v0.164.0
[check]: /zh/docs/update/#check
[每项操作]: #upgrade-summary
[hugo-extended]: https://www.npmjs.com/package/hugo-extended
[hugo-supported-version]: <https://github.com/gohugoio/hugo/releases/tag/v{{% param hugoSupportedVersion %}}>
[hugo-164-perf]: https://discourse.gohugo.io/t/hugo-building-slowly-from-release-0-128-0/57314/21
[hvm]: https://github.com/jmooring/hvm
[安装 Hugo]: /zh/docs/get-started/docsy-as-module/installation-prerequisites/#install-hugo
[多语言支持]: /zh/docs/language/
<!-- prettier-ignore-end -->
