---
title: Goldmark block-attribute evidence
linkTitle: Goldmark attributes
description: Repeatable probes of lists, images, tables, passthrough blocks, fences, callouts, and nested containers on Hugo 0.160.1 and 0.164.0.
weight: 10
icon: fa-solid fa-code
search_keywords:
  [Goldmark, block attributes, render hook, IsBlock, shortcode, Hugo 0.160.1]
design_kind: research
design_status: verified-snapshot
last_verified: 2026-08-16
---

> [!NOTE] Verified snapshot
> These probes produced identical relevant output bytes on Hugo Extended
> 0.160.1 and 0.164.0. They explain OINK's native component forms.
> The current [component contract](/docs/design/components/) defines required behavior.

## Method {#method}

The probe used a minimal Hugo site without OINK templates, with render hooks
printing their context fields and `.Attributes` as visible markers.
The site enabled Goldmark block attributes and passthrough delimiters for inline
and block math, allowed unsafe rendering to inspect raw HTML, and
set `wrapStandAloneImageWithinParagraph: false`.

Each source shape was rendered with the minimum supported Hugo and the then
current Hugo version, comparing relevant output byte for byte to record
Goldmark's structural behavior.

## Findings {#findings}

| Source shape                                                                 | Hook result                                                              | Design consequence                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Ordered list with paragraphs, fences, callouts, nested lists, and `{.steps}` | The class attaches to the outer `<ol>` and rich list-item blocks survive | A Markdown list is the native Steps form                                      |
| Heading inside a list item                                                   | The heading remains inside `<li>` and enters `.TableOfContents`          | Native Steps can carry navigable headings                                     |
| Nested list with `{.filetree}`                                               | The class attaches to the outer `<ul>`                                   | FileTree needs no outer wrapper to preserve hierarchy                         |
| Standalone image plus `{#id num= caption= .class}`                           | `render-image` receives `IsBlock=true` and all attributes                | A Book figure can have a native image form                                    |
| Inline image inside a paragraph                                              | `IsBlock=false`; the image receives no block attributes                  | Inline images cannot use the block-figure contract                            |
| Block math plus `{#id num=}`                                                 | `render-passthrough` receives block type and attributes                  | A numbered equation can use the native passthrough form                       |
| Table plus `{.fields #id num= caption=}`                                     | `render-table` receives the class and named attributes                   | Field tables, matrix markers, captions, and Book numbering can share one hook |
| Fenced code plus `{#id num= caption=}`                                       | The code-block hook receives the attributes                              | A numbered example can be the fence itself                                    |
| Callout plus `{icon= tab=}`                                                  | The blockquote hook receives callout metadata and attributes             | Folding, inline title markup, icon, and tab metadata can coexist              |
| Attribute line separated from its block by a blank line                      | The attribute silently disappears                                        | Source checks must reject orphan attribute lines                              |
| Adjacent tables with `tab=`                                                  | Each table hook receives its own tab label                               | Adjacent-block tabs can extend beyond code fences                             |

## Container boundary {#container-boundary}

Hugo's `%` shortcode delimiter renders `.Inner` as Markdown.
Its template must put a blank line before and after the inner Markdown.
Without both blank lines, Hugo may treat a following list as literal HTML-block
content instead of Markdown.

A multi-line `%` container inside a CommonMark list item has another limitation:
its generated HTML lacks list-content indentation, so the list closes before
the container and restarts after it. OINK therefore keeps a full Steps form for
steps that must contain another full container. Ordinary rich blocks, fences,
and `<` shortcodes do not have this limitation.

In the applicable collector shape, nested `%` shortcodes receive inner HTML
that is already rendered. If a collector requires the child's original
Markdown, it uses `<` delimiters and renders the captured body through the
shared scoped block renderer.

## Attribute ownership {#attribute-ownership}

Each hook enforces an explicit attribute allowlist, rejects `style` and inline
`on*` handlers, and validates URL-bearing values through the shared URL policy.
A hook retains a site class only where downstream CSS is an established
extension mechanism.

The experiment showed that gallery images inside list items can be block images,
but the image hook still does not receive their parent list's marker. A runtime
therefore relies on a theme-emitted marker or a structural fallback.

## Limits and verification {#limits-and-verification}

These results cover Hugo 0.160.1 and 0.164.0 with the stated Goldmark settings.
Before updating this snapshot for a minimum-version change, rerun the
focused component, Book, table, gallery, and Markdown-output checks.
