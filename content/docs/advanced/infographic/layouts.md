---
title: Infographic layouts, funnels, and themes
linkTitle: Layouts and themes
description:
  Present grouped, narrowing, and stylized information without custom
  JavaScript.
weight: 20
icon: fa-solid fa-table-cells-large
---

AntV templates combine a structure with item and title treatments. Changing the
template changes the implied relationship, so review meaning before appearance.
The examples below use flat `items` data and no remote icons.

## Grid of grouped facts {#grid-of-grouped-facts}

Use `list-grid-badge-card` for peer facts that share one topic but have no
required order.

```go-html-template
{{</* infographic */>}}
infographic list-grid-badge-card
data
  title Documentation quality gates
  items
    - label Accuracy
      desc Commands and versions match the product
    - label Coverage
      desc Required concepts and tasks are present
    - label Language
      desc English and Chinese remain equivalent
    - label Delivery
      desc The hosted route matches the reviewed source
{{</* /infographic */>}}
```

The four gates are peers. None should be drawn as a prerequisite for another.

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-grid-badge-card
data
  title Documentation quality gates
  items
    - label Accuracy
      desc Commands and versions match the product
    - label Coverage
      desc Required concepts and tasks are present
    - label Language
      desc English and Chinese remain equivalent
    - label Delivery
      desc The hosted route matches the reviewed source
{{< /infographic >}}

<!-- prettier-ignore-end -->

## Narrowing funnel {#narrowing-funnel}

Use `sequence-funnel-simple` when each stage intentionally reduces a population.
Include `value` fields and repeat the numbers in prose.

```go-html-template
{{</* infographic height="460px" */>}}
infographic sequence-funnel-simple
data
  title Documentation review funnel
  items
    - label Drafted
      value 40
      desc Pages submitted
    - label Fact checked
      value 34
      desc Commands and claims verified
    - label Language reviewed
      value 31
      desc English and Chinese aligned
    - label Published
      value 28
      desc Hosted pages verified
{{</* /infographic */>}}
```

Forty drafted pages become 34 fact-checked pages, 31 language-reviewed pages,
and 28 verified published pages.

<!-- prettier-ignore-start -->

{{< infographic height="460px" >}}
infographic sequence-funnel-simple
data
  title Documentation review funnel
  items
    - label Drafted
      value 40
      desc Pages submitted
    - label Fact checked
      value 34
      desc Commands and claims verified
    - label Language reviewed
      value 31
      desc English and Chinese aligned
    - label Published
      value 28
      desc Hosted pages verified
{{< /infographic >}}

<!-- prettier-ignore-end -->

## Built-in hand-drawn theme {#built-in-hand-drawn-theme}

Themes change styling, not data meaning. The `hand-drawn` theme is useful for
informal planning material; a custom primary color can still align it with the
site.

```go-html-template
{{</* infographic */>}}
infographic sequence-stairs-front-simple
data
  title From notes to maintained documentation
  items
    - label Capture
      desc Record the observed behavior
    - label Explain
      desc Add context and reader intent
    - label Verify
      desc Test examples and links
    - label Maintain
      desc Assign an owner and update path
theme hand-drawn
  colorPrimary #2563eb
{{</* /infographic */>}}
```

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic sequence-stairs-front-simple
data
  title From notes to maintained documentation
  items
    - label Capture
      desc Record the observed behavior
    - label Explain
      desc Add context and reader intent
    - label Verify
      desc Test examples and links
    - label Maintain
      desc Assign an owner and update path
theme hand-drawn
  colorPrimary #2563eb
{{< /infographic >}}

<!-- prettier-ignore-end -->

## Choose a template family {#choose-a-template-family}

| Relationship          | Useful starting templates                                         |
| --------------------- | ----------------------------------------------------------------- |
| Ordered handoff       | `list-row-simple-horizontal-arrow`, `sequence-steps-simple`       |
| Chronology or roadmap | `sequence-timeline-simple`, `sequence-roadmap-vertical-simple`    |
| Repeating loop        | `sequence-circular-simple`, `sequence-circle-arrows-indexed-card` |
| Peer facts            | `list-grid-badge-card`, `list-grid-compact-card`                  |
| Progressive reduction | `sequence-funnel-simple`, `sequence-pyramid-simple`               |
| Hierarchy             | `hierarchy-tree-*`, `hierarchy-mindmap-*`                         |

Template availability belongs to the bundled AntV version. Before adopting a
less common template, render it with realistic English and Chinese content and
pin the Oink release whose `VENDOR.json` provides it.

## Layout checklist {#layout-checklist}

- Keep peer labels grammatically parallel.
- Use `value` only when it has a defined unit or meaning.
- Avoid a fixed height that clips translated text.
- Use `full=true` only when the surrounding page and print layout need it.
- Verify template meaning, contrast, overflow, and reading order separately.
- Keep remote icon and image references out of network-isolated documentation.
