---
title: Update
linkTitle: Update
description: Mark a heading `{.update}`, with an optional `date` and `tags`, to make it a changelog entry. The entry stays an ordinary heading in the TOC, search and Print.
weight: 74
search_keywords: [Update, changelog, what's new, release notes, heading attributes, date, tags, time]
---

An update is a changelog entry written as an ordinary Markdown heading with the `{.update}` marker.
Optional `date` and `tags` attributes add a metadata line below the heading: a machine-readable date and neutral tag chips.
Each entry heading also gets extra space and a separator rule above it, which gives a long stream its rhythm.
The entry is still a heading, so it keeps its table-of-contents entry, anchor, search section and Print ID. No script loads.
Use updates for a single-page changelog, a "What's new" page, weekly notes, or a policy-change log.
Use [release pages](#which) when each version needs a page of its own.

## Shortest form {#minimal}

Put `{.update}` at the end of a heading, with `date` and `tags` inside the same braces.
The optional `#id` written first gives the entry a short anchor that does not change when its title does.
A changelog page usually writes each entry as `##`. The examples on this page use `###` so they nest under their section in the table of contents on the right.

```markdown {title="Source"}
### v1.6.0 — Plain CSS stylesheets {#v1-6-0 .update date="2026-11-23" tags="Breaking, Performance"}

The stylesheet is now plain CSS layers. A site build needs only the Hugo binary.
```

### v1.6.0 — Plain CSS stylesheets {#v1-6-0 .update date="2026-11-23" tags="Breaking, Performance"}

The stylesheet is now plain CSS layers. A site build needs only the Hugo binary.

## Date {#date}

`date` takes a year, a month or a day: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. It renders as `<time datetime="…">` and shows exactly as written, so `2026-11` stays `2026-11`.

```markdown
## 2026 in review {.update date="2026"}
## November notes {.update date="2026-11"}
## v1.6.0 {.update date="2026-11-23"}
```

Any other value warns, naming the heading and the page, and the date is dropped; the heading and the rest of the entry stay.
The check is a pattern, not a calendar: the month must be 01–12 and the day 01–31, so `2026-02-30` passes. Times and time zones are not accepted.

## Tags {#tags}

`tags` is a comma-separated list of plain text. Each item is trimmed and empty items are skipped, so `tags=" Fix ,, Docs "` gives two chips, Fix and Docs.
Chips are neutral: every tag looks the same whatever it says, and the preset sets their color. Markdown inside a tag shows literally.

These are not Hugo taxonomy tags. They create no term pages and link nowhere. Write them in the page's language; the theme does not translate them.

## Entries without metadata {#no-metadata}

Both attributes are optional. `## Unreleased {.update}` is a valid entry: it gets the entry spacing and separator rule, and no metadata line.
The metadata line is also left out when `tags` holds only commas and spaces and there is no date.

Text under an entry is ordinary Markdown. Lower headings inside an entry are ordinary headings: they nest under it in the TOC and take no marker.

## Still a heading {#heading}

The marker changes nothing a heading already does:

- The TOC shows the heading text only, without the date or tags.
- The anchor and the self-link that appears on hover work as usual.
- [Keyboard navigation](/docs/customize/keyboard/#reading) stops at each entry with <kbd>J</kbd> and <kbd>K</kbd>.
- Local search indexes the entry as a section titled with the heading text; the date and tags are part of that section's text.
- Multi-page Print namespaces the heading ID as it does for any heading.

The metadata line follows the heading instead of sitting inside it, so the heading text, its accessible name and its search title stay exactly as written.
Without an explicit `#id`, the anchor comes from the heading text, and renaming the entry changes its link. Give entries an `#id` when other pages link to them.

`date` and `tags` on a heading without `.update` are unknown attributes: they warn and are dropped.

## A changelog on one page {#demo}

A stream of entries, newest first. The three entries and the subsection below appear in this page's table of contents on the right, under this section.

```markdown {title="Source"}
### Unreleased {#demo-unreleased .update}

Timeline and Update join the native components.

### v1.6.0 {#demo-v1-6-0 .update date="2026-11-23" tags="Breaking"}

The stylesheet is now plain CSS, assembled from the layers under `assets/css/td/`.

#### Upgrade notes {#demo-v1-6-0-upgrade}

- Move rules from the retired SCSS hooks into `assets/css/project.css`.
- Replace `shown.bs.tab` listeners with `td:tab-shown`.

### v1.5.1 {#demo-v1-5-1 .update date="2026-11" tags="Changed, Fixed"}

The translation reader is renamed Duo View in all 32 interface languages.
```

### Unreleased {#demo-unreleased .update}

Timeline and Update join the native components.

### v1.6.0 {#demo-v1-6-0 .update date="2026-11-23" tags="Breaking"}

The stylesheet is now plain CSS, assembled from the layers under `assets/css/td/`.

#### Upgrade notes {#demo-v1-6-0-upgrade}

- Move rules from the retired SCSS hooks into `assets/css/project.css`.
- Replace `shown.bs.tab` listeners with `td:tab-shown`.

### v1.5.1 {#demo-v1-5-1 .update date="2026-11" tags="Changed, Fixed"}

The translation reader is renamed Duo View in all 32 interface languages.

## Update or release pages {#which}

| Need | Use |
| --- | --- |
| One readable stream of entries on one page | `.update` headings |
| One page per version, with its own URL, feed item, release assets or GitHub release | [release pages](/docs/write/releases/#release-index) collected by `layout: releases` |
| A short dated sequence inside other prose | [Timeline](/docs/components/timeline/) |

A version that already has a release page needs no second description in an update stream. Link to the release page from the entry.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | The heading with `class="update"`, then `<div class="td-update-meta">` holding `<time datetime>` and a `<span class="td-update-tag">` per tag |
| Print | The same; multi-page Print namespaces the heading ID, and print styles keep the heading with its metadata line |
| Markdown and LLMS | The authored heading line, attribute block included |
| RSS | The heading and metadata line as static HTML |

Updates load no JavaScript. The page remains one page with one URL; entries are not separate feed items.

## Parameter reference {#reference}

The attribute block at the end of the heading:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `.update` | marker | — | Makes the heading an entry; any level, usually `##` |
| `date` | `YYYY`, `YYYY-MM` or `YYYY-MM-DD` | — | Rendered as `<time datetime>` and shown as written; any other value warns and is dropped |
| `tags` | comma-separated plain text | — | One neutral chip per non-empty item, trimmed |
| `id` | anchor | from the heading text | The usual heading ID, written first: `{#v1-6-0 .update …}` |
{.fields meta="type default"}

`date` and `tags` take effect only together with `.update`. Without the marker they warn as unknown attributes and are dropped.

## Limits {#limits}

- There is no sticky label rail or two-column layout. The table of contents already tracks the entries.
- Entries get no URLs or feed items of their own. Use [release pages](/docs/write/releases/) when each version needs one.
- The TOC shows the heading text only. Put the date in the heading text when readers should see it there.
- Tags are not translated, colored or linked.
- Entries appear in source order. There is no sorting, filtering or generation from data.
- Dates are checked against the pattern only, not against the calendar.

## Related {#related}

- [Timeline](/docs/components/timeline/) — a short dated sequence inside prose
- [Releases and downloads](/docs/write/releases/) — one page per version, release cards and assets
- [Keyboard navigation](/docs/customize/keyboard/) — jumping between entries as between headings
