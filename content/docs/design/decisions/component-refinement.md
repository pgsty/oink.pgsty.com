---
title: Component refinement across four visual presets
linkTitle: Component refinement
description: Consistent component surfaces and controls, with three optional Markdown presentation variants.
weight: 50
icon: fa-solid fa-sliders
search_keywords: [component refinement, Paper, Slate, Ink, Terminal, Markdown]
design_kind: decision
design_status: accepted
decision_date: 2026-10-26
aliases:
  - /docs/design/proposals/component-refinement/
---

> [!NOTE] Accepted in OINK 1.4.0
> Shared component styling and three optional presentation variants ship in 1.4.0.
> The [component contract](/docs/design/components/#component-refinement) owns
> their behavior; the [comparison guide](/docs/components/presentation/) shows them together.

## Context {#context}

Cards, disclosures, Tabs and code controls had accumulated different spacing,
borders and feedback treatments. A shared refinement keeps familiar authoring
syntax while making related components feel consistent. The
[dated review](/docs/design/research/2026-10-25-component-refinement/) records
implementation and acceptance evidence, including the original staged plan.

## Accepted style rules {#style-rules}

Use the existing page, content and floating surface tokens. Independent cards
have their own boundaries; grouped lists share a frame and internal dividers.
Nested code and tables should not accumulate redundant borders.

Keep labels and hit targets fixed during press feedback. Reserve space for
localized copy feedback, show success only after copying succeeds, and preserve
visible failures. Keyboard focus is immediate; touch controls have usable hit
areas. Reduced motion keeps state changes clear without travel.

Paper and Slate retain rounded surfaces. Ink keeps square, flat geometry;
Terminal keeps compact, flat geometry. Paper's decorative heading tails are
removed. Ink and Terminal remain opt-in experiments; component refinement does
not promote them to stable presets.

## Optional authoring variants {#variants}

The default grid, steps and code blocks remain available. Authors select a
variant only when it suits the content.

### Divided card list {#card-list}

```markdown
- [Installation](/docs/start/) — Set up a local site.
- [Configuration](/docs/customize/config/) — Configure the site.
{.cards .td-cards-list}
```

This produces a single-column group with internal dividers. The full shortcode
accepts `cards variant="list"`. Item order, links and descriptions are preserved.

### Compact command block {#command-block}

````markdown
```bash {class="td-code-command"}
hugo server
```
````

A marked one-line command becomes a compact strip with a dedicated copy control.
Multiline, numbered or collapsed blocks warn and retain regular presentation.
Literal source and copied text are preserved.

### Compact steps {#compact-steps}

```markdown
1. Prepare configuration.
1. Run the local preview.
1. Review the generated page.
{.steps .td-steps-compact}
```

The full shortcode accepts `steps variant="compact"`. Smaller markers and
spacing suit short procedures while retaining numbering, nesting and anchors.
Unsupported shortcode variants warn and use the default presentation.

## Scope and compatibility {#implementation}

The same style rules cover tables, Fields, badges, Landing actions and shell
rows. Existing renderers, clipboard behavior and tokens remain the owners.
There is no new JavaScript dependency, font download, global density setting
or external Sass executable. Native Markdown, no-JavaScript reading, Print and
machine-readable outputs retain their content.

A moving selection background was evaluated but deferred. OINK 1.4.0 keeps
static selection feedback. Any later motion trial needs its own acceptance.

## Validation and delivery {#acceptance}

Focused theme checks cover components, content primitives, code blocks,
reading, shell, presets and namespace boundaries. The real site's component
presentation and appearance suites cover EN/ZH, light/dark, desktop/mobile,
keyboard, touch, reduced motion and printing. The three variants and shared
styling ship in 1.4.0.
