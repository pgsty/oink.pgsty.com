---
title: Steps
linkTitle: Steps
description: Add `{.steps}` to an ordered list for a numbered procedure. Use the steps shortcode when each step needs a table-of-contents heading.
weight: 70
search_keywords: [Steps, ordered list, procedure, tutorial, ol, start, TOC]
---

Steps present a procedure as a numbered column of dots joined by a line, so a
reader following an installation or an upgrade can see at a glance which step
they are on and how many remain. Add a `{.steps}` line under an ordinary
ordered list; CSS draws the dots and the line, and no script loads. Use steps
only when the order matters. Options and related links belong in a plain list
or in [cards](/docs/components/cards/).

The ordered list is the form to reach for first. Switch to the
`{{%/* steps */%}}` shortcode when each step needs its own heading in the table
of contents; [Which form to use](#which) compares the two.

## Shortest form {#minimal}

Number every item `1.` and let Markdown count, so you can add, remove or
reorder steps without renumbering, and the content indent is always three
spaces.

```markdown {title="Source"}
1. Install Hugo
1. Clone OINK Starter
1. Start the local preview
{.steps}
```

1. Install Hugo
1. Clone OINK Starter
1. Start the local preview
{.steps}

Put `{.steps}` on the line right after the last item. With a blank line in
between, it no longer attaches to the list and shows up on the page as text in
braces.

## What goes in a step {#blocks}

A step can hold any block content: paragraphs, fenced code, callouts, tables,
nested lists and images. Indent it to the item's content column, three spaces.

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

Shortcodes written as `{{</* … */>}}`, such as tabs, cards and badges, work
inside a step too. The `{{%/* … */%}}` form does not; see [Limits](#limits).

## Splitting one step per platform {#tabs-in-steps}

When one step differs by platform, write adjacent `{tab=}` fences inside that
list item; they still combine into one set of tabs.

`````markdown {title="Source"}
1. Install Hugo.

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

1. Install Hugo.

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

When prose interrupts a procedure, start the next group with its real step
number. Markdown writes that number as the list's `start`, and the dots
continue from it; starts from 2 to 40 are supported.

```markdown {title="Source"}
4. Configure `baseURL` and the deployment workflow.
1. Push to `main` and wait for GitHub Actions to finish.
{.steps}
```

4. Configure `baseURL` and the deployment workflow.
1. Push to `main` and wait for GitHub Actions to finish.
{.steps}

## Steps with headings {#shortcode}

A long procedure is easier to navigate when every step has a heading that
appears in the table of contents and can be linked to. Wrap the procedure in
`{{%/* steps */%}}`: its body is ordinary page Markdown, not indented, and
each direct child heading starts a step. The three headings below are in this
page's table of contents.

```markdown {title="Source"}
{{%/* steps */%}}

### Install the toolchain {#install-toolchain}

Install Hugo and Go; [Get started](/docs/start/) lists the versions.

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

Install Hugo and Go; [Get started](/docs/start/) lists the versions.

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

`steps` is the theme's only shortcode written with percent delimiters. That
form hands its body to Goldmark as page Markdown, which is what puts its
headings in the table of contents and lets a step hold container shortcodes
such as `tabs`, `cards` and `fields`. The cost is that it cannot sit inside a
list item or inside another percent container, another `steps` included. Give
every step in one procedure the same heading level.

## Which form to use {#which}

| Situation | Use |
| --- | --- |
| A step is a sentence or two plus a command | ordered list + `{.steps}` |
| Each step needs a heading, a link and a place in the TOC | `{{%/* steps */%}}` |
| A step must contain a `tabs`, `cards` or `fields` container | `{{%/* steps */%}}` |
| The procedure itself has to nest inside another list item | ordered list + `{.steps}` |

## Optional presentation {#presentation}

For a short procedure, `{.steps .td-steps-compact}` and
`steps variant="compact"` tighten the spacing; numbering, nesting and heading
anchors work as before. The [presentation page](/docs/components/presentation/#steps)
shows both next to the regular form.

## Output {#outputs}

Steps load no script, so they look the same with JavaScript off. Print keeps
the numbers, content and connecting line; the Markdown output keeps the source
as written, and RSS shows a plain list or titled sections.

## Parameter reference {#reference}

| Spelling | Where | Description |
| --- | --- | --- |
| `{.steps}` | line below the ordered list | Required; has no effect on an unordered list |
| `{.steps .td-steps-compact}` | line below the ordered list | Compact spacing for a short procedure |
| `1.` | every item | Let Markdown count; the content indent is always three spaces |
| `4.` (first item) | first item | Emits `<ol start="4">` and continues from 4; supported for 2–40 |
| `{{%/* steps */%}}` | around a set of headings | Direct child headings (`##`–`######`) are the steps; the body is not indented |
| `variant="compact"` | on `{{%/* steps */%}}` | Compact spacing; any other value warns and uses the regular layout |
{.fields meta="-"}

## Limits {#limits}

- Do not put a `{{%/* … */%}}` shortcode inside a list item: its multiline
  output ends the list early. To put a container in a step, write the whole
  procedure with the shortcode form instead.
- Formatters such as Prettier may separate `{.steps}` from its list. Wrap the
  list in `<!-- prettier-ignore-start -->` and `<!-- prettier-ignore-end -->`.
- `{.steps}` works only on ordered lists; a `-` list gets no numbers.
- Steps do not collapse, expand or track progress; there is no "done" state.

## Related {#related}

- [Tabs](/docs/components/tabs/) — commands split per platform
- [Callouts](/docs/components/callout/) — prerequisites and warnings inside a step
- [Code blocks](/docs/components/code/) — the commands in a step
- [Cards](/docs/components/cards/) — "what next" once the procedure is done
