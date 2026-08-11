---
title: Hugo authoring tips
weight: 40
icon: fa-solid fa-lightbulb
description: Avoid common pitfalls when writing content for an Oink site.
aliases: [/docs/best-practices/site-guidance/, /docs/tutorial/writing-guide/]
---

Oink is a Hugo theme, so ordinary Markdown and Hugo's content model remain the
authoring foundation. These conventions keep pages readable in source form and
stable after translation, reorganization, or subpath deployment.

## Link to published routes {#link-to-published-routes}

Link readers to the canonical published URL, not to a neighboring source-file
path. Root-relative links such as `/docs/content/` are easy to audit across the
site. When a link should follow a page through source moves, Hugo's `ref` and
`relref` shortcodes can resolve the target page:

```markdown
[Configuration]({{</* ref "/docs/content/configuration" */>}})
```

After moving a page, add an alias for the old public route and update every
internal link to the new canonical route. Do not rely on the alias as the site's
permanent navigation path. See
[Adding content](/docs/content/adding-content/#links) for link and image
behavior.

## Keep front matter useful {#keep-front-matter-useful}

Every navigable page needs a clear `title`, concise `description`, intentional
`weight`, and suitable Font Awesome `icon`. Keep descriptions to one sentence
that fits on one line in a normal desktop content card. Add `linkTitle` only
when the navigation label genuinely needs to differ from the page title.

English is the primary source language. Add the Simplified Chinese peer beside
it as `.zh.md`, and translate reader-facing metadata as carefully as the body.

## Preserve stable headings {#preserve-stable-headings}

Use explicit heading IDs when pages are translated or widely linked:

```markdown
## Failure recovery {#failure-recovery}
```

Copy the same ID to the corresponding Chinese heading. When renaming a heading,
preserve an established ID unless its meaning also changes.

## Write procedures as tasks {#write-procedures-as-tasks}

State prerequisites before commands, use imperative steps, and show the expected
result or verification command. Separate local preview, production build, hosted
deployment, and public release evidence; success at one layer does not establish
the next.

## Make code examples actionable {#make-code-examples-actionable}

Name a block when it represents a real file, use `console` for a transcript with
prompts and output, and collapse long reference listings that readers do not
need to scan before continuing. Use a Code Group only when panels are
interchangeable ways to complete the same task.

```yaml {filename="hugo.yaml" hl_lines="3"}
params:
  offlineSearch: true
  print:
    disable_toc: false
```

Metadata should clarify an example, not decorate every fence. See
[Code blocks and Code Groups](/docs/content/code-blocks/) for filenames, Copy
policies, wrapping, collapse, line links, and synchronized alternatives.

## Review rendered states {#review-rendered-states}

Build both languages and inspect representative pages on desktop and mobile, in
light and dark modes. Verify headings, fragments, code, tables, alerts,
navigation, search, print output, and page descriptions in the rendered site.
