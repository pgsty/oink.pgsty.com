---
title: Goldmark block-attribute evidence
linkTitle: Goldmark attributes
description: Reproducible findings for lists, images, tables, passthrough blocks, fences, callouts, and nested containers on Hugo 0.160.1 and 0.164.0.
weight: 10
icon: fa-solid fa-code
search_keywords:
  [Goldmark, block attributes, render hook, IsBlock, shortcode, Hugo 0.160.1]
design_kind: research
design_status: verified-snapshot
last_verified: 2026-08-16
---

> [!NOTE] Verified snapshot
> These probes produced byte-identical relevant output on Hugo Extended
> 0.160.1 and 0.164.0. They explain OINK's native component forms; the current
> [component contract](/docs/design/components/) remains authoritative.

## Method {#method}

The probe used a minimal Hugo site without OINK templates. Render hooks printed
their context fields and `.Attributes` as visible markers. The site enabled
Goldmark block attributes, passthrough delimiters for inline and block math,
unsafe rendering for the deliberately inspected raw HTML, and
`wrapStandAloneImageWithinParagraph: false`.

Each source shape was rendered with the compatibility-floor Hugo and the then
current Hugo version. Relevant output was compared byte for byte. The findings
below record platform behaviour, not visual styling.

## Findings {#findings}

| Source shape                                                                 | Hook result                                                              | Design consequence                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Ordered list with paragraphs, fences, callouts, nested lists, and `{.steps}` | The class attaches to the outer `<ol>` and rich list-item blocks survive | A Markdown list is the native Steps form                                      |
| Heading inside a list item                                                   | The heading remains inside `<li>` and enters `.TableOfContents`          | Native Steps can carry navigable headings                                     |
| Nested list with `{.filetree}`                                               | The class attaches to the outer `<ul>`                                   | FileTree needs no wrapper merely to preserve hierarchy                        |
| Standalone image plus `{#id num= caption= .class}`                           | `render-image` receives `IsBlock=true` and all attributes                | A Book figure can have a native image form                                    |
| Inline image inside a paragraph                                              | `IsBlock=false`; the image receives no block attributes                  | Inline images cannot use the block-figure contract                            |
| Block math plus `{#id num=}`                                                 | `render-passthrough` receives block type and attributes                  | A numbered equation can use the native passthrough form                       |
| Table plus `{.fields #id num= caption=}`                                     | `render-table` receives the class and named attributes                   | Field tables, matrix markers, captions, and Book numbering can share one hook |
| Fenced code plus `{#id num= caption=}`                                       | The code-block hook receives the attributes                              | A numbered example can be the fence itself                                    |
| Callout plus `{icon= tab=}`                                                  | The blockquote hook receives callout metadata and attributes             | Folding, inline title markup, icon, and tab metadata can coexist              |
| Attribute line separated from its block by a blank line                      | The attribute silently disappears                                        | Source checks must reject orphan attribute lines                              |
| Adjacent tables with `tab=`                                                  | Each table hook receives its own tab label                               | Adjacent-block tabs can extend beyond code fences                             |

## Container boundary {#container-boundary}

Hugo's `%` shortcode delimiter renders `.Inner` as Markdown, but its template
must put a blank line before and after that inner Markdown. Without both blank
lines, a following list may be treated as literal HTML-block content instead of
Markdown.

A multi-line `%` container inside a CommonMark list item has a harder limit:
the generated HTML is not indented as list content, so the list closes before
the container and restarts afterwards. This is why OINK keeps a full Steps form
for steps that must contain another full container. Ordinary rich blocks,
fences, and `<` shortcodes do not have that limitation.

Nested `%` shortcodes also receive already rendered inner HTML in the relevant
collector shape. A collector that requires the child's original Markdown uses
`<` delimiters and renders the captured body through the shared scoped block
renderer.

## Attribute ownership {#attribute-ownership}

An available attribute is not automatically a public attribute. Every hook
owns a documented allowlist. `style` and inline `on*` handlers are rejected;
URL-bearing values pass the shared URL policy. A site class is retained only on
the surfaces where downstream CSS is an established extension mechanism.

The experiment also showed that gallery images inside list items can be block
images while still receiving no knowledge of their parent list's marker. A
runtime may therefore need either a theme-emitted marker or a narrow structural
fallback; it cannot assume the image hook sees arbitrary ancestors.

## Limits and verification {#limits-and-verification}

These results cover Hugo 0.160.1 and 0.164.0 with the stated Goldmark settings.
They do not promise identical behaviour for a site that changes those settings
or for a later Hugo release. A Hugo-floor change reruns the focused component,
Book, table, gallery, and Markdown-output checks before this snapshot is
updated.
