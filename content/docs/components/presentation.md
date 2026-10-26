---
title: Component presentation
linkTitle: Presentation
description: Cards, disclosures, tabs, and compact procedures across OINK's four visual presets.
weight: 115
outputs: [HTML, markdown, print]
search_keywords: [component styles, card list, compact steps, command strip, presets]
---

Use the Appearance menu to compare Paper, Slate, Ink, and Terminal in light or dark mode. These examples use the same content and preserve the normal Markdown authoring model.

> [!NOTE] Available in OINK 1.4.0
> The optional variants on this page ship in OINK 1.4.0.

## Related pages {#cards}

- [Start a site](/docs/start/)

  Install the theme and preview a first page locally.

- [Configure your site](/docs/customize/config/)

  Set navigation, languages, appearance, and search.
{.cards #presentation-cards}

For a compact resource directory, use `{.cards .td-cards-list}`. A divided list has one enclosing frame and grows naturally with its descriptions.

- [Writing content](/docs/write/) — Organize articles, guides, and release notes; see also the **[configuration guide](/docs/customize/config/)**.
- [Component reference with a longer title](/docs/components/) — Choose native Markdown or a compound shortcode.
{.cards .td-cards-list #presentation-card-list}

The full form accepts `cards variant="list"` for icons, badges, or block descriptions:

{{< cards variant="list" >}}
{{< card title="Installation" link="/docs/start/" icon="fa-solid fa-rocket" badge="Start here" >}}
Build a local preview before changing the site configuration.
{{< /card >}}
{{< card title="Reference material" icon="fa-solid fa-book" >}}
Read the [configuration guide](/docs/customize/config/) or the [writing guide](/docs/write/). A card without a title link remains ordinary content.
{{< /card >}}
{{< /cards >}}

## Notes and disclosures {#disclosures}

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

A marked one-line fence uses `{class="td-code-command"}`. Its copy button occupies its own column so the command can scroll or wrap without being obscured.

```bash {class="td-code-command" id="presentation-command"}
hugo server --bind 127.0.0.1 --port 1313
```

```bash {class="td-code-command" wrap=true id="presentation-command-wrap"}
hugo --environment production --baseURL https://example.com/documentation/ --destination public
```

`wrap`, `copy`, and accessible labels keep their existing meaning. Multiline, numbered, or collapsed input warns and falls back to an ordinary code block. Single-line fences without this modifier keep their usual presentation.

## Short procedures {#steps}

Add `{.steps .td-steps-compact}` to a short ordered list. The regular `.steps` layout remains available for longer tutorials.

3. Review the configuration.
1. Run the local preview.
1. Check the generated output.
{.steps .td-steps-compact #presentation-steps}

For a procedure with headings, use `steps variant="compact"` with percent delimiters:

{{% steps variant="compact" %}}

### Preview {#preview}

Run the development server and open the changed page.

### Review {#review}

Check the page in the language and appearance your readers use.

{{% /steps %}}

## Tables and metadata {#metadata}

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

## Compatibility {#compatibility}

These variants load no additional runtime. Existing links, keyboard behavior, copy text, print content, and Markdown output retain their meaning. Unsupported `cards` or `steps` variants warn and use the regular presentation. The visual refinement does not change the default preset or font policy.
