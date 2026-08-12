---
downstream_modified: true
title: AI-agent support
linkTitle: Agent support
weight: 90
icon: fa-solid fa-robot
description: Expose Markdown and discovery metadata to AI agents and tools.
aliases: [/docs/content/agent-support/, /docs/feature/agent-support/]
cSpell:ignore: llmstxt
---

> [!NOTE] Early evaluation
>
> Features described in this page are [experimental][], and are useful for early
> adoption and evaluation. Output details and validation coverage may change in
> future releases. To track the phased evolution of the agent-support feature,
> see [Improve support for AI-agent doc consumption #2614][#2614].

[#2614]: https://github.com/google/docsy/issues/2614

## Features {#features}

When your site opts in, these are the user-facing and machine-readable behaviors
Oink enables:

- **[Markdown output format](#markdown-output)** support. Your project's
  `outputs` configuration controls which page kinds publish Markdown.
- **Discovery**: page HTML headers include `rel="alternate"` links to the
  Markdown version of the page.
- **Copy text / View source**: page actions can copy or open the Markdown
  version of the page when that output exists.
- **Open in ChatGPT / Claude**: file-backed page actions can hand the current
  browser URL to either assistant when
  `params.ui.page_context_menu.assistant_links` is explicitly enabled. Oink
  builds the prompt only when the reader activates the link, preserving the
  deployed host, query string, and fragment. The full URL then leaves the site;
  avoid secrets in URLs and disclose the third-party boundary. The page body is
  not uploaded.
- **View edit history**: opens the current source file's commit history when
  `github_repo` and its repository path are available.
- **[`llms.txt`](#llms-txt)**: site-root file listing.

The remainder of this page explains how to enable each feature, and discusses
[validation and metrics](#validation-and-metrics) supported with examples.

```yaml
params:
  ui:
    page_context_menu:
      assistant_links: true
```

Use boolean `assistant_links` front matter to override this choice on an
individual page.

## Enable Markdown output {#markdown-output}

Hugo comes with several [built-in output formats][], including `markdown`. To
enable Markdown output, add `markdown` to the Hugo [outputs][] configuration for
the page kinds you want to support. For example:

{{< tabpane text=true persist=lang >}}
{{< tab header="Configuration file:" disabled=true />}}
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

### Opt pages out {#opt-pages-out}

> [!TIP]
>
> By default, Hugo’s `outputs` map (whether in multi-file site config or page
> front matter) is a **full replacement** for each page kind, not a merge [^1].
> When you add `markdown`, keep every format your site already relies on -- for
> example `RSS` and `print` on sections as is shown in the examples above.

[^1]:
    This is contrary to the documented Hugo behavior for front-matter
    configuration, but it is confirmed with our testing as of Hugo 0.158.0.

To opt pages out of Markdown output, set `outputs` in page front matter to
`HTML` only, or whatever your page's default output formats are while excluding
`markdown`. For example:

```yaml
---
title: HTML-only test page
outputs: [HTML]
---
...
```

## Enable `llms.txt` {#llms-txt}

The `llms.txt` format is a simple text format for listing machine-readable links
to site content. It is designed to be easy for agents to discover and parse, and
to complement the richer but more complex Markdown outputs. To learn more, see
[llmstxt.org][].

Oink generates `llms.txt` at the site root, and includes links to the home page,
main menu pages, and Markdown alternates where they exist. To enable it, add
`LLMS` to the Hugo [outputs][] configuration for the home page. For example:

```yaml
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

For an example of the generated `llms.txt` for this site, see
[/llms.txt](/llms.txt).

## Customize output {#customize-output}

Oink renders Markdown output via [layouts/all.html][] and generates `llms.txt`
via `layouts/index.llms.txt`. You can override these defaults at several levels:

- **Per kind** — Add templates such as `home.md` or `_default/single.md` under
  `layouts/` in your project to tailor Markdown output for specific [Hugo
  kinds][].
- **Per shortcode** — Add [output-format-specific shortcode templates][sof] to
  project-local shortcodes so they emit Markdown-friendly content when
  appropriate.
- **Per page** — Provide page-specific content or structure for high-value pages
  that need a curated agent-facing view.

## Server-side support {#server-side-support}

While outside the scope of the theme, sites can facilitate agent discovery and
access to Markdown content by implementing server-side content negotiation. For
example, honoring `Accept: text/markdown` on the same URL as HTML.

## Validation and metrics {#validation-and-metrics}

We use [AFDocs][] to assess basic structural support for agent-facing content,
and to validate that generated outputs meet the configured checks. We also
encourage sites to implement their own monitoring and metrics on agent access
patterns—for example logging requests to Markdown URLs or `llms.txt`, and
collecting metrics on their use. For details, see
[Agent-support checks](https://github.com/pgsty/oink.pgsty.com/blob/main/package.json).

The `oink.pgsty.com` project contains [AFDocs][] configuration and npm scripts
so maintainers can score a deployed URL against checks that overlap with Oink's
agent-support goals, including Markdown URLs, llms.txt, and related categories.

### Scorecard examples {#scorecard-examples}

For scorecard examples, see:

- [OpenTelemetry agent score][] online report

- An AFDocs scorecard for this site:

  <details>
  <summary><code>oink.pgsty.com</code> scorecard</summary>

  ```text
  {{< readfile "afdocs-scorecard.txt" >}}
  ```

  </details>

For details on how these checks are configured, see
[Agent-support checks](https://github.com/pgsty/oink.pgsty.com/blob/main/package.json).

[afdocs]: https://afdocs.dev/
[built-in output formats]: https://gohugo.io/configuration/output-formats/
[experimental]: https://github.com/google/docsy/blob/main/CHANGELOG.md
[Hugo kinds]: https://gohugo.io/templates/types/
[layouts/all.html]: https://github.com/pgsty/oink/blob/main/layouts/all.html
[llmstxt.org]: https://llmstxt.org/
[OpenTelemetry agent score]:
  https://buildwithfern.com/agent-score/company/opentelemetry
[outputs]: https://gohugo.io/configuration/outputs/
[sof]: https://gohugo.io/templates/shortcode/
