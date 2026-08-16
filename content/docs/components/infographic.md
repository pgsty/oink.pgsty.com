---
title: Infographics with AntV
linkTitle: Infographics
description:
  Turn concise declarative data in an infographic fence into local SVG
  infographics.
weight: 110
aliases:
  [
    /docs/feature/infographic/,
    /docs/content/infographic/,
    /docs/advanced/infographics/,
  ]
---

An `infographic` fenced code block renders the AntV Infographic DSL with the
versioned runtime bundled by OINK. Use it for processes, timelines, cycles,
funnels, roadmaps, and compact visual summaries where a statistical chart would
be too literal.

The DSL is serialized as data, not inserted as arbitrary HTML or executable code
— the fence stays a readable code block on GitHub. The browser runtime turns it
into SVG and loads only on pages that use the fence.

## Quick start {#quick-start}

````markdown
```infographic
infographic list-row-simple-horizontal-arrow
data
  title Documentation workflow
  items
    - label Draft
      desc Write the first version
    - label Review
      desc Check facts and language
    - label Publish
      desc Build and verify the site
```
````

The same three steps appear below. Drafting creates the first version, review
checks facts and language, and publication builds and verifies the site.

<!-- prettier-ignore-start -->

```infographic
infographic list-row-simple-horizontal-arrow
data
  title Documentation workflow
  items
    - label Draft
      desc Write the first version
    - label Review
      desc Check facts and language
    - label Publish
      desc Build and verify the site
```

<!-- prettier-ignore-end -->

## Syntax anatomy {#syntax-anatomy}

An infographic normally contains:

1. `infographic TEMPLATE`, which selects a built-in AntV template;
2. a `data` block with an optional `title` and `desc`;
3. an `items` list with `label`, `desc`, optional `value`, and optional nested
   `children` fields;
4. an optional `theme` block for a built-in theme or explicit colors.

Indentation defines structure. Keep labels short, use descriptions for context,
and choose a template whose visual relationship matches the prose. A decorative
sequence is not a substitute for an actual hierarchy or comparison.

## Fence attributes {#shortcode-parameters}

| Attribute | Default | Behavior                                                                          |
| --------- | ------- | --------------------------------------------------------------------------------- |
| `height`  | `auto`  | Accepts `auto` or a nonnegative number with `px`, `rem`, `em`, `vh`, `vw`, or `%` |
| `full`    | `false` | Set to `true` to remove OINK's normal content-width clamp                         |

Write them on the fence line: ` ```infographic {height="480px" full=true} `.
Invalid height values, unknown attributes, and an empty DSL body fail the Hugo
build. DSL schema or template errors are reported by the browser runtime in the
infographic container; print, Markdown, and RSS output show the fence source.

AntV themes belong to the DSL rather than the fence attributes. They do not
automatically follow Oink's site color mode, so verify foreground, background,
and surrounding-page contrast in both modes.

## Choose a guide {#choose-a-guide}

- Processes, timelines, and cycles: demonstrates three common ways to explain a
  sequence.
- Layouts, funnels, and themes: demonstrates grids, narrowing stages, template
  selection, and a built-in hand-drawn theme.

The AntV package contains many templates. Start with the smallest visual form
that clarifies the relationship, not the most decorative form available.

## Authoring and accessibility {#authoring-and-accessibility}

- Summarize the same conclusion in ordinary text before or after the graphic.
- Keep the reading order meaningful and labels concise.
- Do not use color or shape as the only carrier of status.
- Check long translated labels, narrow screens, printing, and both site color
  modes.
- Avoid remote image or icon identifiers in a local-first page unless their
  network and license boundary has been reviewed explicitly.
- Record the source and date when values are not illustrative.

SVG improves visual fidelity, but it does not guarantee that every template
exposes the same semantic structure as native headings, lists, and tables.
Essential instructions must remain available in adjacent prose.

## Further reference {#further-reference}

OINK documents its fence and delivery boundary. For the full DSL, template
gallery, and theme model, use the
[AntV Infographic documentation](https://infographic.antv.vision/learn),
[gallery](https://infographic.antv.vision/gallery), and
[source repository](https://github.com/antvis/Infographic). The Oink theme's
`VENDOR.json` records the exact bundled version, checksum, and MIT license file.
