---
title: "Timeline component"
linkTitle: Timeline component
description: A native definition-list timeline for dated or ordered events in prose, with no shortcode and no runtime.
weight: 27
icon: fa-solid fa-timeline
search_keywords: [timeline, chronology, milestones, postmortem, agenda, definition list, component]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] Implemented, awaiting release
> Implemented on the theme's `main` branch and documented in the
> [Timeline guide](/docs/components/timeline/).
> Not yet in a tagged release. The shared decisions are in the
> [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Implemented 2026-11-27 on `main`; awaiting release |
| Owner | OINK maintainers |
| Delivery stage | S1, with [Update](/docs/design/proposals/component-update/) |
| Form | Native: a Markdown definition list followed by `{.timeline}` |
| New public API | The author marker `.timeline`; no shortcode, attribute, or configuration key |
| Runtime | None |
| Affected surface | Component contract, a new stylesheet layer, a new guide at `/docs/components/timeline/` |

## Summary {#summary}

A timeline is a sequence of pairs: a marker (a date, a time, a version, "Day 2")
and what happened. Markdown already has a construct for pairs, the definition
list. OINK styles a definition list marked `{.timeline}` as a vertical axis
with a marker column and an event column. Nothing else is added.

```markdown
2024-05
: **First prototype.** The theme renders its own documentation.

2025-08
: **Markdown-first authoring.** Native forms replace most shortcodes.

2026-11
: **Plain CSS.** The stylesheet needs nothing but the Hugo binary.
{.timeline}
```

## Problem {#problem}

Prose pages often narrate events in order: incident postmortems, project
milestones, a product's history, a conference agenda, a biography. Authors
write these today as bullet lists with a bold date, as tables, as `steps`
(whose generated numbers misstate the meaning), or as raw HTML. None of them
shows time as a visual axis, and none has a stable structure.

The visual grammar already exists. The Landing `timeline` section
(`layouts/_partials/landing/sections/timeline.html`) renders date, title, and
description on an axis, but only from Landing data on a landing page. Prose
cannot reach it.

## Design principles {#principles}

1. **The structure is a pair.** Each entry has exactly one kind of marker and a
   body. A definition list encodes that directly (`<dt>`/`<dd>`); a bullet list
   with a bold first word only imitates it.
2. **Native first.** The [Markdown-first decision](/docs/design/decisions/authoring/#decision)
   prefers a native form when Goldmark can keep the meaning. It can: Goldmark
   attaches the class to the `<dl>`, and a definition keeps full block content.
3. **The marker is free text.** "2024-05", "09:02", "v1.6.0", "Day 2", and
   "Q3 2026" are all valid. The component does not parse dates, so it never
   rejects a real-world marker.
4. **One visual grammar.** The prose timeline uses the same axis, node, and
   marker-column vocabulary as the Landing section, expressed with article
   tokens.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- A readable chronological axis in HTML from ordinary Markdown.
- Rich event bodies: paragraphs, lists, code, images, callouts.
- Identical meaning in Print, RSS, Markdown, and LLMS, with no new output
  branch.
- Zero JavaScript and zero configuration.

### Non-goals {#non-goals}

- A `timeline`/`event` shortcode pair, per-event icons, tones, badges, or
  links as parameters.
- Date parsing, sorting, grouping by year, or relative times ("3 days ago").
- Horizontal, zoomable, or Gantt-style timelines (Mermaid already offers Gantt
  and timeline diagrams for schedules).
- Entries in the page outline; that is the [Update](/docs/design/proposals/component-update/) component.
- Replacing the Landing `timeline` section or `steps`.

## Proposed behavior {#design}

### Authoring {#authoring}

- Each term (a line without a leading colon) is a marker. Terms are inline
  Markdown on one line; plain text is recommended.
- Each definition (`: …`) is an event body. Continuation paragraphs, lists,
  and fences are indented as for any definition.
- A marker may have several definitions; they render as consecutive events
  under one marker.
- `{.timeline}` sits on the line directly after the last definition, with no
  blank line. As with every Goldmark block attribute, a blank line detaches
  it and the marker is silently lost; the guide states this next to the
  example.
- The conventional event title is a leading bold phrase. It is a writing
  convention, not syntax.

The native form requires Goldmark definition lists
(`markup.goldmark.extensions.definitionList`), which Hugo enables by default.
The component contract's prerequisite list gains this line.

### Rendering {#rendering}

Goldmark produces the markup; the theme adds only CSS, scoped to
`.td-content dl.timeline` so a site's unrelated `.timeline` rules do not
collide:

| Condition | Layout |
| --- | --- |
| Wide column | Two-column grid: a marker column sized to its content and capped (about 10rem), and an event column. An axis line runs along the start edge of the event column, with a node on each marker row |
| Narrow column | One column: marker above body, axis and nodes on the start edge |
| Ink, Terminal | Flat surfaces; square nodes (`0px` in Ink, `2px` radius in Terminal); preset `--td-meta-font-family` (`Inter` sans-serif in Ink, `IBM Plex Mono` in Terminal) with tabular numerals |
| Forced colors | Axis and nodes use system colors; no meaning carried by color |
| Print | Axis as a thin border; no backgrounds; short entries avoid page breaks inside |
| RTL | Logical properties mirror the axis |
| Long tokens | Markers wrap rather than widen the column |

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML | `<dl class="timeline">` from Goldmark, styled by the theme; no runtime |
| Print | The same markup with print rules |
| Markdown / LLMS | The authored source (native forms keep source) |
| RSS | The `<dl>` as rendered; feed readers show terms and definitions |

### Accessibility {#accessibility}

Screen readers announce a definition list with term/definition pairs in source
order. Markers are text, so nothing depends on the axis graphics, which are
decorative pseudo-elements.

## Trade-offs and alternatives {#alternatives}

| Option | Decision | Reason |
| --- | --- | --- |
| First-draft `timeline` + `event` shortcodes with `time`, `title`, `badge`, `icon`, `tone`, `link` | Rejected for the first stage | Two shortcodes and a parent/child collector for decoration, not a missing capability. A plain-text `title` parameter is weaker than a Markdown body, and the Markdown output would have to be synthesized |
| Bullet list with a bold date and `{.timeline}` | Rejected | The marker is not structurally separate; CSS would depend on `li > p:first-child > strong:first-child` and break when an item starts differently |
| A `steps` variant | Rejected | Steps generate numbers; a timeline marker is authored text |
| Reusing the Landing section through a data file | Rejected for prose | A data file per timeline moves prose out of the page. The visual tokens are shared instead |
| `<ol>` semantics | Not chosen | An ordered list announces order but not the marker/body pair. Order is still the source order in a `<dl>` |

Costs of the chosen form:

- Definition-list syntax is less familiar than bullets. The guide leads with a
  copyable example.
- GitHub and some editors do not render definition lists. The source still
  reads as a marker line followed by `: event` lines.
- Per-event decoration is out of reach. If evidence shows it is needed, a later
  proposal can add a full form; the native form stays the primary one.

## Compatibility {#compatibility}

Purely additive. The theme gives `.timeline` no meaning today. A local consumer
scan found one site stylesheet using `.timeline`, scoped under its own
application class, so the scoped theme selector does not collide with it.

## Implementation plan {#implementation}

1. Add a stylesheet layer (for example `assets/css/td/timeline.css`) and list
   it in `layouts/_partials/css/layers.html` before the RTL, preset,
   accessibility, and print layers.
2. Add a fixture page to `tests/site/` covering single and multiple
   definitions per marker, rich bodies, a marker with long tokens, and an RTL
   page; record HTML, Print, Markdown, and RSS goldens with
   `bin/check-goldens.py --update`.
3. Owning checks: `bin/check-stylesheets.py`, `bin/check-goldens.py`, and
   `hugo --source tests/site --printPathWarnings`.
4. Update the bilingual [component contract](/docs/design/components/#steps-cards-fields-and-tables)
   (native form and prerequisite) and add EN/ZH guides with the cheatsheet row.
5. Review on this site: four presets, light and dark, desktop and mobile, RTL,
   forced colors, and browser print.

## Acceptance criteria {#acceptance}

- A definition list with `{.timeline}` renders the axis layout with no
  template change and no runtime.
- Markdown and LLMS outputs equal the authored source.
- A definition list without the marker renders exactly as before.
- Reviews pass for all presets, both color schemes, narrow screens, RTL,
  forced colors, and print.

## Open decisions {#open-decisions}

1. **Marker column width.** Recommended: content-sized with a cap. A fixed
   width, as on the Landing section, aligns better but truncates "Q3 2026 –
   Q1 2027".
2. **A compact modifier.** Recommended: none in S1; add
   `{.timeline .td-timeline-compact}` only if fixtures show a need.
3. **Shared CSS with Landing.** Recommended: share tokens and proportions, not
   selectors; the two contexts have different containers.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** `timeline`/`event` shortcodes plus a
  `.timeline` list marker.
- **2026-11-27 (review).** Native definition list only; shortcodes, icons,
  tones, and badges removed from the first stage.
- **2026-11-27 (implementation).** Implemented as specified: `assets/css/td/timeline.css` (a content-sized marker column capped by `fit-content(10rem)`), the `.timeline` author marker registered in `bin/check-namespace.py`, and the `timeline-update` fixture with HTML, Markdown and Print goldens.
