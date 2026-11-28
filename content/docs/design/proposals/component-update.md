---
title: "Update component"
linkTitle: Update component
description: Changelog entries as ordinary headings marked .update, with a date and tags, so every entry joins the outline, search, and Print without a shortcode.
weight: 27
icon: fa-solid fa-clock-rotate-left
search_keywords: [update, changelog, what's new, release notes, heading attributes, Mintlify Update, component]
design_kind: proposal
design_status: accepted
proposal_date: 2026-11-27
---

> [!NOTE] Accepted in OINK 1.7.0
> Shipped in OINK v1.7.0, documented in the [Update guide](/docs/components/update/),
> and governed by the [Components contract](/docs/design/components/#timeline-media-social-and-maps).
> Shared decisions are in the [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Accepted and shipped in OINK v1.7.0 (implemented 2026-11-27) |
| Owner | OINK maintainers |
| Delivery stage | S1, with [Timeline](/docs/design/proposals/component-timeline/) |
| Form | Native: a Markdown heading with `{.update date="…" tags="…"}` |
| New public API | The author marker `.update` and two heading attributes, `date` and `tags` |
| Runtime | None |
| Affected surface | `layouts/_markup/render-heading.html`, component contract, a stylesheet layer, a new guide at `/docs/components/update/` |

## Summary {#summary}

An update entry is a heading. Marking it `.update` adds a metadata line with a
machine-readable date and neutral tag chips, and gives the entry its visual
rhythm. Because the entry is still an ordinary heading, it joins the TOC,
keeps its self-link, keyboard heading navigation, and search section, and is
namespaced in multi-page Print — all with no new mechanism.

```markdown
## v1.6.0 — Plain CSS stylesheets {.update date="2026-11-23" tags="Breaking, Performance"}

Stylesheets now assemble from plain CSS layers with only the Hugo binary.

### Highlights {#v1-6-0-highlights}

- SCSS hooks retired in favor of `assets/css/project.css`.
- Bootstrap JavaScript removed.

## Unreleased {.update}

Work merged after the latest tag.
```

## Problem {#problem}

Single-page changelogs, "What's new" pages, weekly notes, and policy-change
logs are a sequence of dated sections. Authors write them today as headings
followed by an ad-hoc date line and badges. The date has no `<time>`
semantics, every site invents its own layout, and badges written inside a
heading leak into the TOC and anchor.

Mintlify's `<Update>` shows the demand. OINK already has `layout: releases`,
but it serves a different case: one content page per GitHub release, with its
own URL, feed item, and assets. A product that wants one readable stream on
one page has no component.

## Design principles {#principles}

1. **An entry is a heading.** Membership in the outline is the essential
   property; everything that already works for headings must keep working.
2. **Native first.** The heading hook already receives block attributes; the
   probe confirmed `class`, `date`, and `tags` arrive intact and the TOC shows
   only the heading text.
3. **The page is the authority.** An update page is the source of truth for its
   own entries. A version that already has a release page is not described a
   second time here, following the rule that
   [facts stay outside presentation strings](/docs/design/decisions/authoring/#decision).
4. **Do not compete with the TOC.** The docs shell already shows the outline
   with scroll tracking in the right rail.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- Dated, tagged entries from ordinary Markdown headings.
- Unchanged TOC, anchors, self-links, keyboard navigation, search sections,
  Print namespacing, and footnotes.
- Identical meaning in Print, RSS, Markdown, and LLMS.
- Zero JavaScript and zero configuration.

### Non-goals {#non-goals}

- A `{{%/* update */%}}` shortcode, a container, or a two-column sticky rail.
- Separate `label` and `title` fields, a `level` parameter, or a `link`
  parameter; the heading text, heading level, and body already express them.
- Tag color vocabularies (for example "breaking" → red).
- Per-entry URLs, feed items, or GitHub release binding; those belong to
  `layout: releases`.
- Generating entries from data, sorting, or filtering.

## Proposed behavior {#design}

### Authoring {#authoring}

| Attribute | Rule | Invalid input |
| --- | --- | --- |
| `.update` | Author marker on any heading level; usually `##` for entries | — |
| `date` | Optional. String `YYYY`, `YYYY-MM`, or valid calendar `YYYY-MM-DD` | Non-string or invalid calendar date warns and drops the date; the entry and valid tags stay |
| `tags` | Optional. String of `,` or `，` separated plain text; items are trimmed, empty items skipped | Non-string warns and drops the tags |
| `id` | Existing heading rule; explicit `#id` recommended for version headings | Existing behavior |

`date` and `tags` on a heading without `.update` warn and are dropped. That is
the heading hook's existing rule for unsupported attributes, so no new
diagnostic path is needed. An entry without a date (for example "Unreleased")
is valid.

The heading text is the entry's label and title: `## v1.6.0`,
`## v1.6.0 — Plain CSS stylesheets`, or `## 2026-11 weekly notes`. Subsections
inside an entry are ordinary lower-level headings and nest under it in the TOC.

### Rendering {#rendering}

```html
<h2 id="v160--plain-css-stylesheets" class="update">v1.6.0 — Plain CSS stylesheets<a class="td-heading-self-link" …></a></h2>
<div class="td-update-meta"><time datetime="2026-11-23">2026-11-23</time><span class="td-update-sep">, </span><span class="td-update-tag">Breaking</span><span class="td-update-sep">, </span><span class="td-update-tag">Performance</span></div>
```

The metadata line sits after the heading, not inside it, so heading text, the
accessible name, the self-link, and the search section title stay clean. The
date shows the authored ISO string, which already matches OINK's default date
format in every locale.

Styling, scoped to the article:

- An entry heading gets extra space above it and a separator rule, which give
  a long stream its rhythm.
- The date uses the metadata font with tabular numerals.
- Tags are neutral chips sharing badge geometry. Presets own their colors.
- Ink and Terminal keep flat, square geometry; forced colors use system
  colors; print drops backgrounds and keeps the separator.

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML | Heading plus metadata line; no runtime |
| Print | The same; multi-page Print namespaces the heading ID as for any heading |
| Markdown / LLMS | The authored source, including the attribute block |
| RSS | Heading plus metadata line as static HTML |

### Choosing between Update and release pages {#boundary}

| Need | Use |
| --- | --- |
| One readable stream on one page | `.update` headings |
| One page per version, its own URL and feed item, release assets, GitHub binding | `layout: releases` |
| A short dated sequence inside other prose | [Timeline](/docs/design/proposals/component-timeline/) |

## Trade-offs and alternatives {#alternatives}

| Option | Decision | Reason |
| --- | --- | --- |
| First-draft `{{%/* update label date title tags level id link */%}}` with a sticky two-column rail | Rejected | It works in Hugo (a percent shortcode that emits a heading does enter the TOC), but seven parameters re-encode what heading syntax already says; the label must be escaped into generated Markdown; the Markdown output must be synthesized; and it would be the second percent shortcode after `steps` |
| The sticky rail itself | Rejected | In the docs shell the left navigation, right TOC, and a rail would leave about 38rem for code and tables, and the rail repeats what the TOC already tracks. A per-entry wrapper is also required for `position: sticky`, so the rail forces the shortcode |
| One `{{%/* updates */%}}` container with headings inside | Rejected | Sticky children share one containing block and pile up; a grid cannot make a heading span its section. The visual gain does not justify a container |
| A front-matter page mode that turns every `##` into an entry | Deferred | Implicit; mixes introduction headings with entries. Revisit only if pages show the explicit marker is tedious |
| Keyword-to-color tag mapping | Rejected | A hidden English vocabulary that never matches Chinese tags, and colored chips compete with presets |
| Badges inside the heading text | Rejected | They leak into the TOC, anchors, and search titles |

Costs of the chosen form:

- No Mintlify-style rail. The look is a clean entry stream, not a clone.
- Attribute syntax on headings is less discoverable than a named shortcode; the
  guide and the cheatsheet lead with it.
- The Markdown output keeps `{.update …}` on the heading line. Agents read it
  easily; it is the same trade-off every native form makes.
- `render-heading.html` runs for every heading on every page, so the new branch
  must stay cheap: test for the `update` class before any other work.

## Compatibility {#compatibility}

Additive. A heading without `.update` renders byte-identically. Today `date` and
`tags` on a heading already warn and are dropped, so no existing page can
depend on them.

## Implementation plan {#implementation}

1. In `render-heading.html`, when the validated class list contains `update`,
   allow `date` and `tags`, validate them, and emit the metadata line after the
   heading.
2. Add a stylesheet layer (or a section of an existing content layer) and list
   it in `layers.html`.
3. Fixtures: entries with and without dates, invalid dates, tags with
   whitespace and empty items, nested subsections, an entry inside a multi-page
   Print section, and a heading with `date` but no marker. Record HTML, Print,
   Markdown, and RSS goldens.
4. Owning checks: `bin/check-content-primitives.py` (attribute policy),
   `bin/check-output.py`, `bin/check-goldens.py`, `bin/check-stylesheets.py`.
   Confirm `search/sections.html` keeps the heading text as the section title.
5. Update the bilingual [component contract](/docs/design/components/) and add
   EN/ZH guides with the cheatsheet row.

## Acceptance criteria {#acceptance}

- TOC entries, anchors, keyboard heading jumps, and search sections are
  unchanged by the marker.
- `<time datetime>` appears only for valid dates; invalid input warns and keeps
  the entry.
- Headings without the marker are byte-identical to the current output.
- Multi-page Print namespaces update headings like any other heading.
- Preset, color-scheme, narrow-screen, RTL, forced-colors, and print reviews
  pass.

## Open decisions {#open-decisions}

1. **Visual weight.** Recommended: separator and metadata line only. A
   start-edge axis per entry would need a wrapper and is deferred.
2. **Date in the TOC.** Recommended: no; the TOC stays compact and authors can
   put a date in the heading text when it is the label.
3. **Locale key for tags.** Recommended: none; tag chips carry no extra label.
   If an accessible group name proves necessary, reuse the existing taxonomy
   label.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** Percent-delimited `update` shortcode with a
  sticky rail and seven parameters.
- **2026-11-27 (review).** Replaced by the `.update` heading marker with `date`
  and `tags`; rail, tone mapping, and per-entry links removed.
- **2026-11-27 (implementation).** Implemented in `render-heading.html` and `assets/css/td/timeline.css`. Headings without the marker stay byte-identical (the theme goldens prove it); invalid input is covered by `check_update_headings` in `bin/check-content-primitives.py`. No locale key was needed.
- **2026-11-27 (post-review hardening).** Extracted styles to `assets/css/td/update.css`; added visually hidden `, ` separators inside `.td-update-meta` to fix search-index, RSS, screen-reader, and copy token gluing; added `rich-copy.js` support; fixed dark-mode print contrast (`--td-print-*`) and `h2.update` bottom-border sandwich; replaced negative margin with `:has(+ .td-update-meta)` and tightened first-entry / `h2+h3.update` spacing; aligned Ink top border and tag surface; added `if not .Attributes` fast path, `printf "%T"` string type guards, real calendar date checks via `time.AsTime`, and full-width `，` tag splitting.
- **2026-11-27 (acceptance review).** Firefox still copied the tags glued (`FixDocs`) and WebKit put each comma on its own line, because flex items are blockified and `user-select: none` removed the separators from the selection. The metadata line is now inline flow with `<span class="td-update-sep">, </span>` separators at `font-size: 0`, and all three engines copy `2026-11-23, Fix, Docs`. The `if not .Attributes` fast path never ran, since Goldmark gives every heading an `id`; it now applies when that id is the only attribute, roughly halving the heading hook's template time on the documentation site with byte-identical output. The fixture goldens record the separator markup and the new word count.
