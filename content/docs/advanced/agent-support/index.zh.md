---
title: AI 智能体支持
linkTitle: 智能体支持
weight: 90
description: 向 AI 智能体与工具提供 Markdown 和发现元数据。
aliases: [/docs/content/agent-support/, /docs/feature/agent-support/]
cSpell:ignore: llmstxt
---

> [!NOTE] 早期评估
>
> 本页介绍的功能仍处于[实验阶段][]，适合早期采用和评估。后续版本可能会调整输出细节和验证范围。要跟踪智能体支持功能的阶段性演进，请参阅
> [Improve support for AI-agent doc consumption #2614][#2614]。

[#2614]: https://github.com/google/docsy/issues/2614

## 功能 {#features}

站点显式启用后，OINK 会提供以下面向用户和机器可读的行为：

- 支持 **[Markdown 输出格式](#markdown-output)**。项目的 `outputs`
  配置决定哪些页面类型发布 Markdown。
- **发现机制**：页面 HTML 的 header 会包含指向该页 Markdown 版本的
  `rel="alternate"` 链接。
- **复制文本 / 查阅源码**：当页面存在 Markdown 输出时，页面操作可以复制或打开该版本。
- **在 ChatGPT / Claude 中打开**：只有显式启用
  `params.ui.page_context_menu.assistant_links`
  后，有源文件的页面操作才会把当前浏览器 URL 交给相应助手。OINK 只在读者激活链接时构造提示词，并保留实际部署域名、查询参数与片段。完整 URL 随后会离开本站；请勿在 URL 中放置秘密信息，并披露这一第三方边界。页面正文不会被上传。
- **查阅编辑历史**：当 `github_repo`
  与仓库路径可用时，打开当前源文件的提交历史。
- **[`llms.txt`](#llms-txt)**：位于站点根目录的内容清单文件。

本页其余部分介绍如何启用各项功能，并结合示例讨论相应的[验证与指标](#validation-and-metrics)。

```yaml
params:
  ui:
    page_context_menu:
      assistant_links: true
```

可用布尔型 `assistant_links` front matter 按页面覆盖这一选择。

## 启用 Markdown 输出 {#markdown-output}

Hugo 提供多种[内置输出格式][]，其中包括
`markdown`。要启用 Markdown 输出，请在 Hugo 的 [outputs][] 配置中，把 `markdown`
加入需要支持的页面类型。例如：

{{< tabpane text=true persist=lang >}}
{{< tab header="配置文件：" disabled=true />}}
{{% tab header="hugo.yaml" lang="yaml" %}}

```yaml
outputs:
  home: [HTML, markdown]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

{{% /tab %}} {{% tab header="hugo.toml" lang="toml" %}}

```toml
[outputs]
home = [ "HTML", "markdown" ]
page = [ "HTML", "markdown" ]
section = [ "HTML", "RSS", "print", "markdown" ]
```

{{% /tab %}} {{% tab header="hugo.json" lang="json" %}}

```json
{
  "outputs": {
    "home": ["HTML", "markdown"],
    "page": ["HTML", "markdown"],
    "section": ["HTML", "RSS", "print", "markdown"]
  }
}
```

{{% /tab %}} {{< /tabpane >}}

### 让页面退出 Markdown 输出 {#opt-pages-out}

> [!TIP]
>
> 默认情况下，无论 Hugo 的 `outputs` 映射位于多文件站点配置还是页面 front
> matter 中，它都会对每种页面类型执行 **完整替换**，而不是合并[^1]。添加
> `markdown` 时，请保留站点已经依赖的所有格式，例如以上示例中分区使用的 `RSS` 和
> `print`。

[^1]:
    这与 Hugo 文档描述的 front matter 配置行为不同，但截至 Hugo
    0.158.0，我们的测试确认实际行为如此。

如果要让某些页面不输出 Markdown，请在页面 front matter 中把 `outputs` 设为仅
`HTML`，或者在排除 `markdown` 的同时列出该页原本的全部默认输出格式。例如：

```yaml
---
title: HTML-only test page
outputs: [HTML]
---
...
```

## 启用 `llms.txt` {#llms-txt}

`llms.txt`
是一种简单的文本格式，用来列出指向站点机器可读内容的链接。智能体可以轻松发现和解析它，它也能补充信息更丰富但结构更复杂的 Markdown 输出。进一步了解请参阅
[llmstxt.org][]。

OINK 会在站点根目录生成
`llms.txt`，其中包含首页、主菜单页面，以及存在时的 Markdown 备用版本链接。要启用它，请在 Hugo 的
[outputs][] 配置中为首页添加 `LLMS`。例如：

```yaml
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

本站生成的 `llms.txt` 示例请参阅 [/llms.txt](/llms.txt)。

## 自定义输出 {#customize-output}

OINK 通过 [layouts/all.html][] 渲染 Markdown 输出，并通过
`layouts/index.llms.txt` 生成 `llms.txt`。你可以在多个层级覆盖默认行为：

- **按类型**：在项目的 `layouts/` 下添加 `home.md` 或 `_default/single.md`
  等模板，为特定 [Hugo 类型][]定制 Markdown 输出。
- **按短代码**：为项目本地短代码添加[输出格式专属短代码模板][sof]，使其在适当场景输出便于 Markdown 使用的内容。
- **按页面**：为需要精心设计智能体视图的高价值页面提供专属内容或结构。

## 服务端支持 {#server-side-support}

虽然不属于 OINK 的支持范围，站点仍可通过服务端内容协商，帮助智能体发现和访问 Markdown 内容。例如，在与 HTML 相同的 URL 上响应
`Accept: text/markdown`。

## 验证与指标 {#validation-and-metrics}

我们使用 [AFDocs][]
评估面向智能体内容的基础结构支持，并验证生成的输出是否满足配置的检查项。我们也鼓励站点针对智能体访问模式实现自己的监控和指标，例如记录对 Markdown
URL 或 `llms.txt`
的请求，并统计其使用情况。详情请参阅[智能体支持检查](https://github.com/pgsty/oink.pgsty.com/blob/main/package.json)。

`oink.pgsty.com` 项目包含 [AFDocs][]
配置和 npm 脚本，维护者可据此对已部署 URL 评分。这些检查与 OINK 的智能体支持目标有重合，包括 Markdown
URL、`llms.txt` 和相关类别。

### 评分表示例 {#scorecard-examples}

评分表示例包括：

- [OpenTelemetry 智能体评分][]在线报告；

- 本站的 AFDocs 评分表：

  <details>
  <summary><code>oink.pgsty.com</code> 评分表</summary>

  ```text
  {{< readfile "afdocs-scorecard.txt" >}}
  ```

  </details>

这些检查的配置详情请参阅[智能体支持检查](https://github.com/pgsty/oink.pgsty.com/blob/main/package.json)。

[afdocs]: https://afdocs.dev/
[内置输出格式]: https://gohugo.io/configuration/output-formats/
[实验阶段]: https://github.com/google/docsy/blob/main/CHANGELOG.md
[Hugo 类型]: https://gohugo.io/templates/types/
[layouts/all.html]: https://github.com/pgsty/oink/blob/main/layouts/all.html
[llmstxt.org]: https://llmstxt.org/
[OpenTelemetry 智能体评分]:
  https://buildwithfern.com/agent-score/company/opentelemetry
[outputs]: https://gohugo.io/configuration/outputs/
[sof]: https://gohugo.io/templates/shortcode/
