---
title: Steps
linkTitle: Steps
description: Add `{.steps}` to an ordered list for a numbered procedure. Use the steps shortcode when each step needs a table-of-contents heading.
weight: 70
search_keywords: [Steps, ordered list, procedure, tutorial, ol, start, TOC]
---

Steps display an ordered list with numbered dots and a connecting line. Add a `{.steps}` marker line to an ordered list.
CSS draws the dots and line. No script loads. Use steps for ordered procedures.
Use plain lists or cards for unordered items.

There are two forms. Use an ordered list with `{.steps}` by default.
Use `{{%/* steps */%}}` when each step needs a heading in the table of contents.

## Optional presentation {#presentation}

Use `{.steps .td-steps-compact}` for a short procedure, or `steps variant="compact"` for the heading form. OINK 1.4.0 supports these opt-in variants; [compare the examples](/docs/components/presentation/#steps). Numbering, nesting, and heading anchors retain their existing meaning.

## Shortest form {#minimal}

Write `1.` for each item so Markdown counts automatically.
Then you can add, remove, or reorder steps without renumbering. Content always uses three spaces of indentation.

```markdown {title="Source"}
1. Install Hugo Extended
1. Clone OINK Starter
1. Start the local preview
{.steps}
```

1. Install Hugo Extended
1. Clone OINK Starter
1. Start the local preview
{.steps}

`{.steps}` must immediately follow the last list line. A blank line makes it display as text with braces.

## What goes in a step {#blocks}

List items accept block content: paragraphs, fenced code, callouts, tables, nested lists, and images.
Align content with the item's content column, using three spaces.

````markdown {title="Source"}
1. Clone OINK Starter; it is the small project template for the theme.

   ```bash
   git clone https://github.com/pgsty/oink-starter my-docs
   cd my-docs
   ```

1. Start the local server.

   ```bash
   hugo server
   ```

   > [!NOTE]
   > The first build fetches the theme through the Go module proxy, which needs
   > Go on the machine.

1. Replace three things and it is your site.

   | Where | Replace with |
   | --- | --- |
   | `title` in `hugo.yml` | your site name |
   | `baseURL` in `hugo.yml` | your domain |
   | `content/` | your content |
{.steps}
````

1. Clone OINK Starter; it is the small project template for the theme.

   ```bash
   git clone https://github.com/pgsty/oink-starter my-docs
   cd my-docs
   ```

1. Start the local server.

   ```bash
   hugo server
   ```

   > [!NOTE]
   > The first build fetches the theme through the Go module proxy, which needs
   > Go on the machine.

1. Replace three things and it is your site.

   | Where | Replace with |
   | --- | --- |
   | `title` in `hugo.yml` | your site name |
   | `baseURL` in `hugo.yml` | your domain |
   | `content/` | your content |
{.steps}

Shortcodes in `{{</* … */>}}` form, such as tabs, cards, and badges, also work inside list items.
The `{{%/* … */%}}` form does not. See [Limits](#limits).

## Splitting one step per platform {#tabs-in-steps}

If a step differs by platform, put adjacent `{tab=}` fences inside that list item. They still form a tab set.

`````markdown {title="Source"}
1. Install Hugo Extended.

1. Install the dependencies:

   ```bash {tab="EL / RHEL" group="stepdemo" value="rpm"}
   sudo dnf install golang git
   ```
   ```bash {tab="Debian / Ubuntu" value="deb"}
   sudo apt install golang-go git
   ```

1. Run `hugo server` to preview.
{.steps}
`````

1. Install Hugo Extended.

1. Install the dependencies:

   ```bash {tab="EL / RHEL" group="stepdemo" value="rpm"}
   sudo dnf install golang git
   ```
   ```bash {tab="Debian / Ubuntu" value="deb"}
   sudo apt install golang-go git
   ```

1. Run `hugo server` to preview.
{.steps}

## Continuing the numbering {#start}

If prose interrupts a procedure, start the next group with its actual step number.
Markdown emits `start` and continues numbering from that value, up to 40.

```markdown {title="Source"}
4. Configure `baseURL` and the deployment workflow.
1. Push to `main` and wait for GitHub Actions to finish.
{.steps}
```

4. Configure `baseURL` and the deployment workflow.
1. Push to `main` and wait for GitHub Actions to finish.
{.steps}

## Steps with headings {#shortcode}

For long procedures with linked headings in the table of contents, use `{{%/* steps */%}}`.
The body uses page-level Markdown without indentation. Each direct child heading is one step.
The three headings below appear in this page's table of contents.

```markdown {title="Source"}
{{%/* steps */%}}

### Install the toolchain {#install-toolchain}

You need Hugo Extended ≥ 0.168.0 and Go.

### Run the server {#run-server}

{{</* tabs group="oink-os" default="macos" */>}}
{{</* tab label="macOS" value="macos" */>}}
`brew install hugo go`
{{</* /tab */>}}
{{</* tab label="Debian" value="debian" */>}}
`sudo apt install hugo golang-go`
{{</* /tab */>}}
{{</* /tabs */>}}

### Publish {#publish}

Push to `main`; the workflow the repository ships builds and publishes.

{{%/* /steps */%}}
```

{{% steps %}}

### Install the toolchain {#install-toolchain}

You need Hugo Extended ≥ 0.168.0 and Go.

### Run the server {#run-server}

{{< tabs group="oink-os" default="macos" >}}
{{< tab label="macOS" value="macos" >}}
`brew install hugo go`
{{< /tab >}}
{{< tab label="Debian" value="debian" >}}
`sudo apt install hugo golang-go`
{{< /tab >}}
{{< /tabs >}}

### Publish {#publish}

Push to `main`; the workflow the repository ships builds and publishes.

{{% /steps %}}

This is the theme's only `{{%/* … */%}}` shortcode. The percent form gives its body to Goldmark as page-level Markdown.
This allows headings in the table of contents and container shortcodes such as `tabs`, `cards`, and `fields` inside steps.
It cannot nest inside list items or other percent containers.

Use the same heading level for every step in a procedure. Never nest `steps` inside another steps container.

## Which form to use {#which}

| Situation | Use |
| --- | --- |
| A step is a sentence or two plus a command | ordered list + `{.steps}` |
| Each step needs a heading, a link and a place in the TOC | `{{%/* steps */%}}` |
| A step must contain a `tabs`, `cards` or `fields` container | `{{%/* steps */%}}` |
| The procedure itself has to nest inside another list item | ordered list + `{.steps}` |

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | The native form is `<ol class="steps">` with numbers and rule drawn in CSS; the shortcode form is `<div class="td-steps">` plus headings |
| Print | Numbers and content unchanged, the rule stays |
| Markdown | The source as written: an ordered list plus `{.steps}`, or headings plus bodies |
| RSS | A static list or titled sections |

Steps load no script. Disabling JavaScript does not change the result.

## Parameter reference {#reference}

The local checkout supports the optional `variant="compact"` on the full form. Follow these conventions:

| Spelling | Where | Description |
| --- | --- | --- |
| `{.steps}` | line below the ordered list | Required; has no effect on an unordered list |
| `1.` | every item | Let Markdown count; the content indent is always three spaces |
| `4.` (first item) | first item | Emits `<ol start="4">` and continues from 4; supported for 2–40 |
| `{{%/* steps */%}}` | around a set of headings | Direct child headings (`##`–`######`) are the steps; the body is not indented |
{.fields meta="-"}

## Limits {#limits}

- Do not put `{{%/* … */%}}` inside list items. A percent shortcode's multiline output truncates the list.
  To put a container in a step, use the shortcode form for the whole procedure.
- `{{%/* steps */%}}` cannot be inside list items or other percent containers.
- Put the marker immediately after the list, with no blank line before `{.steps}`.
  With formatters such as Prettier, wrap it in `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->`.
- `{.steps}` applies only to ordered lists. A `-` list has no numbers.
- Steps do not collapse, expand, or track progress. There is no "done" state.

## Related {#related}

- [Tabs](/docs/components/tabs/) — commands split per platform
- [Callouts](/docs/components/callout/) — prerequisites and warnings inside a step
- [Code blocks](/docs/components/code/) — the commands in a step
- [Cards](/docs/components/cards/) — "what next" once the procedure is done
