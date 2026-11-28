---
title: Component presentation
linkTitle: Presentation
description: Cards, disclosures, tabs, and compact procedures across OINK's six visual presets.
weight: 910
outputs: [HTML, markdown, print]
search_keywords: [component styles, card list, compact steps, command strip, presets]
---

This page shows the everyday components side by side with their compact
variants, so you can judge how each looks before choosing it: switch between
Paper, Slate, GitHub, Ink, News and Terminal, light or dark, from the
Appearance menu and compare. Each variant is one extra class or a `variant` parameter on the
Markdown you already write. None loads a script or changes links, keyboard
use, copied text, print or Markdown output, and an unknown variant warns and
falls back to the regular look.

## Cards and card lists {#cards}

The regular card grid:

- [Start a site](/docs/start/)

  Install the theme and preview a first page locally.

- [Configure your site](/docs/customize/config/)

  Set navigation, languages, appearance, and search.
{.cards #presentation-cards}

For a compact directory of resources, `{.cards .td-cards-list}` turns the
same link list into a single framed list with dividers, each row as tall as
its description needs.

- [Writing content](/docs/write/) — Organize articles, guides, and release notes; see also the **[configuration guide](/docs/customize/config/)**.
- [Component reference with a longer title](/docs/components/) — Choose native Markdown or a compound shortcode.
{.cards .td-cards-list #presentation-card-list}

When the rows need icons, badges or longer descriptions, use the shortcode
form with `cards variant="list"`:

{{< cards variant="list" >}}
{{< card title="Installation" link="/docs/start/" icon="fa-solid fa-rocket" badge="Start here" >}}
Build a local preview before changing the site configuration.
{{< /card >}}
{{< card title="Reference material" icon="fa-solid fa-book" >}}
Read the [configuration guide](/docs/customize/config/) or the [writing guide](/docs/write/). A card without a title link remains ordinary content.
{{< /card >}}
{{< /cards >}}

## Notes and disclosures {#disclosures}

Callouts have no variants; compare their colors and the disclosure row in each
preset.

> [!NOTE] Keep a local preview
> Review the page at a narrow width as well as on your desktop.

> [!WARNING] Check the destination
> Confirm the destination before publishing a new version.

> [!DETAILS] How does this work without JavaScript?
> The disclosure is a native HTML `details` element. It remains usable with scripts disabled.
>
> The title, chevron, and focus outline share one stable summary row.

> [!TIP]+ Longer titles can wrap without displacing the chevron or reducing the interactive area
> Each disclosure opens independently. Other content stays in its current state.

## Tabs and commands {#tabs}

```bash {tab="macOS / Homebrew" group="presentation-os" value="macos"}
brew install hugo
```
```bash {tab="Debian / Ubuntu" value="debian"}
sudo apt install hugo
```

Add `{class="td-code-command"}` to a one-line fence to make it a command
strip. The copy button gets its own column, so a long command scrolls or wraps
without running under it.

```bash {class="td-code-command" id="presentation-command"}
hugo server --bind 127.0.0.1 --port 1313
```

```bash {class="td-code-command" wrap=true id="presentation-command-wrap"}
hugo --environment production --baseURL https://example.com/documentation/ --destination public
```

`wrap`, `copy` and accessible labels work as on any code block. A command
strip holds exactly one line, so a multiline, numbered or collapsed block with
this class warns and renders as a regular code block.

## Short procedures {#steps}

For a short procedure, add `.td-steps-compact` to the marker:
`{.steps .td-steps-compact}`. Keep the regular `.steps` for long tutorials,
where the extra spacing helps.

3. Review the configuration.
1. Run the local preview.
1. Check the generated output.
{.steps .td-steps-compact #presentation-steps}

A procedure with headings uses the shortcode with `variant="compact"`, written
with percent delimiters:

{{% steps variant="compact" %}}

### Preview {#preview}

Run the development server and open the changed page.

### Review {#review}

Check the page in the language and appearance your readers use.

{{% /steps %}}

## Tables and metadata {#metadata}

Tables, field lists, badges and key sequences have no variants either; they
are here so you can check them against the rest of the preset.

| View | Purpose | Input |
| --- | --- | --- |
| Cards | Related resources | Link list |
| Steps | Ordered procedure | Ordered list |
| Tabs | Equivalent alternatives | Adjacent blocks |

| Name | Type | Description |
| --- | --- | --- |
| title | string | A concise title that may wrap naturally. |
| description | string | Supporting information, separate from the main label. |
{.fields}

{{< badge text="Preview" tone="info" >}} {{< badge text="Validated" tone="success" >}} {{< badge text="Review needed" tone="warning" >}}

Open search with {{< kbd "Ctrl" "K" >}} and move between results with the arrow keys.
