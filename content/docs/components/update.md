---
title: Update
linkTitle: Update
description: Write a changelog, a "What's new" page or weekly notes as ordinary headings marked `{.update}`, with an optional date and tags under each entry.
weight: 74
search_keywords: [Update, changelog, what's new, release notes, heading attributes, date, tags, time]
---

An update is a changelog entry written as an ordinary Markdown heading with
`{.update}` at the end. Each entry gets extra space and a separator rule above
it, which gives a long stream of entries its rhythm, and optional `date` and
`tags` attributes add a metadata line under the heading. Use updates for a
one-page changelog, a "What's new" page, weekly notes or a log of policy
changes.

Because the entry is still a heading, it keeps everything a heading has: its
table-of-contents entry, anchor, search section and print ID. No script loads.
When each version needs a page of its own, use [release pages](#which)
instead.

## Shortest form {#minimal}

Put `{.update}` at the end of the heading, with `date` and `tags` inside the
same braces. An `#id` written first is optional, but it gives the entry a short
anchor that survives a change of title.

```markdown {title="Source"}
### v1.6.0 — PostgreSQL 18 by default {#v1-6-0 .update date="2026-11-23" tags="Breaking, Performance"}

New clusters get PostgreSQL 18, with asynchronous I/O turned on.
```

### v1.6.0 — PostgreSQL 18 by default {#v1-6-0 .update date="2026-11-23" tags="Breaking, Performance"}

New clusters get PostgreSQL 18, with asynchronous I/O turned on.

A changelog page usually writes each entry as `##`. The examples here use
`###` so that they nest under this page's own sections in the table of
contents.

## Date {#date}

`date` takes a year, a month or a day (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`). It
renders as `<time datetime="…">` and shows exactly as written, so `2026-11`
stays `2026-11`.

```markdown
## 2026 in review {.update date="2026"}
## November notes {.update date="2026-11"}
## v1.6.0 {.update date="2026-11-23"}
```

Any other value warns, naming the heading and the page, and the date is
dropped while the heading and the rest of the entry stay. The check is a
pattern, not a calendar: the month must be 01–12 and the day 01–31, so
`2026-02-30` passes. Times and time zones are not accepted.

## Tags {#tags}

`tags` is a comma-separated list of plain text. Each item is trimmed and empty
items are skipped, so `tags=" Fix ,, Docs "` gives two chips, Fix and Docs.
Every chip looks the same whatever it says, in a color set by the preset, and
Markdown inside a tag shows literally.

These are not Hugo taxonomy tags: they create no term pages and link nowhere.
The theme does not translate them, so write them in the page's language.

## Entries without metadata {#no-metadata}

Both attributes are optional. `## Unreleased {.update}` is a valid entry with
the entry spacing and separator rule but no metadata line, and the line is
also left out when there is no date and `tags` holds only commas and spaces.

The text under an entry is ordinary Markdown, and lower headings inside an
entry are ordinary headings that nest under it in the TOC without a marker.

## Still a heading {#heading}

The marker changes nothing a heading already does:

- The TOC shows the heading text only, without the date or tags.
- The anchor and the self-link that appears on hover work as usual.
- [Keyboard navigation](/docs/customize/keyboard/#reading) stops at each entry with <kbd>J</kbd> and <kbd>K</kbd>.
- Local search indexes the entry as a section titled with the heading text; the date and tags are part of that section's text.
- Multi-page Print namespaces the heading ID as it does for any heading.

The metadata line follows the heading rather than sitting inside it, so the
heading text, its accessible name and its search title stay exactly as
written. Without an explicit `#id` the anchor comes from the heading text, and
renaming the entry changes its link, so give an `#id` to any entry that other
pages link to.

## A changelog on one page {#demo}

A stream of entries, newest first. The three entries and the subsection below
appear in the table of contents under this section.

```markdown {title="Source"}
### Unreleased {#demo-unreleased .update}

One command sets up logical replication between two clusters.

### v1.6.0 {#demo-v1-6-0 .update date="2026-11-23" tags="Breaking"}

PostgreSQL 18 is the default version for new clusters.

#### Upgrade notes {#demo-v1-6-0-upgrade}

- Set `pg_version: 17` in the inventory to keep creating PostgreSQL 17 clusters.
- Rename `pg_backup_dir` to `backup_dir`.

### v1.5.1 {#demo-v1-5-1 .update date="2026-11" tags="Changed, Fixed"}

Failover no longer times out on clusters with more than three replicas.
```

### Unreleased {#demo-unreleased .update}

One command sets up logical replication between two clusters.

### v1.6.0 {#demo-v1-6-0 .update date="2026-11-23" tags="Breaking"}

PostgreSQL 18 is the default version for new clusters.

#### Upgrade notes {#demo-v1-6-0-upgrade}

- Set `pg_version: 17` in the inventory to keep creating PostgreSQL 17 clusters.
- Rename `pg_backup_dir` to `backup_dir`.

### v1.5.1 {#demo-v1-5-1 .update date="2026-11" tags="Changed, Fixed"}

Failover no longer times out on clusters with more than three replicas.

## Update or release pages {#which}

| Need | Use |
| --- | --- |
| One readable stream of entries on one page | `.update` headings |
| One page per version, with its own URL, feed item, release assets or GitHub release | [release pages](/docs/write/releases/#release-index) collected by `layout: releases` |
| A short dated sequence inside other prose | [Timeline](/docs/components/timeline/) |

A version that already has a release page needs no second description in an
update stream; link to the release page from the entry.

## Output {#outputs}

Updates load no JavaScript. In HTML the heading gets `class="update"` and is
followed by `<div class="td-update-meta">`, which holds the `<time datetime>`
and one `<span class="td-update-tag">` per tag, for site CSS to target. Print
keeps each heading with its metadata line, Markdown and LLMS output keep the
heading line with its attribute block, and the page stays one page with one
URL, so entries never become separate feed items.

## Parameter reference {#reference}

The attribute block at the end of the heading:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `.update` | marker | — | Makes the heading an entry; any level, usually `##` |
| `date` | `YYYY`, `YYYY-MM` or `YYYY-MM-DD` | — | Rendered as `<time datetime>` and shown as written; any other value warns and is dropped |
| `tags` | comma-separated plain text | — | One neutral chip per non-empty item, trimmed |
| `id` | anchor | from the heading text | The usual heading ID, written first: `{#v1-6-0 .update …}` |
{.fields meta="type default"}

`date` and `tags` work only together with `.update`; on any other heading they
warn as unknown attributes and are dropped.

## Limits {#limits}

- There is no sticky label rail or two-column layout; the table of contents
  already tracks the entries.
- Entries get no URLs or feed items of their own. Use
  [release pages](/docs/write/releases/) when each version needs one.
- The TOC shows the heading text only, so put the date in the heading text
  when readers should see it there.
- Tags are not translated, colored or linked.
- Entries appear in source order, with no sorting, filtering or generation
  from data.

## Related {#related}

- [Timeline](/docs/components/timeline/) — a short dated sequence inside prose
- [Releases and downloads](/docs/write/releases/) — one page per version, release cards and assets
- [Keyboard navigation](/docs/customize/keyboard/) — jumping between entries as between headings
