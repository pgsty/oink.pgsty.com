---
title: Timeline
linkTitle: Timeline
description: Turn a Markdown definition list into a vertical timeline of dated or ordered events, for milestones, incident write-ups, product history or an agenda.
weight: 380
search_keywords: [Timeline, chronology, milestones, history, postmortem, agenda, definition list, dl, dt, dd]
---

A timeline lays events along a vertical axis, each beside its marker: a date,
a time, a version, "Day 2", whatever puts the events in order. Use it for
project milestones, the sequence of an incident, a product's history or an
agenda; [Where a timeline fits](#which) compares it with steps, update entries
and Gantt charts.

You write an ordinary Markdown definition list, one term per marker and one
definition per event, and put `{.timeline}` on the line below it. The theme
adds only CSS, so the source stays plain Markdown and the page loads no script.

## Shortest form {#minimal}

Write each marker on its own line and its event on the next line after `: `,
with a blank line between entries. Put `{.timeline}` directly under the last
event.

```markdown {title="Source"}
2024-03-12
: **v1.0.** First stable release: single-node installs on EL 9 and Ubuntu 24.04.

2024-11-05
: **v2.0.** Streaming replicas and automatic failover.

2025-09-30
: **v3.0.** PostgreSQL 18 becomes the default version.
{.timeline}
```

2024-03-12
: **v1.0.** First stable release: single-node installs on EL 9 and Ubuntu 24.04.

2024-11-05
: **v2.0.** Streaming replicas and automatic failover.

2025-09-30
: **v3.0.** PostgreSQL 18 becomes the default version.
{.timeline}

Both kinds of line break matter. `{.timeline}` must touch the last event: after
a blank line Goldmark drops the attribute line and renders a plain definition
list, while the theme logs a build warning naming the page. The blank lines
between entries are required too, because without one the next marker becomes a
line of the previous event's text and its event attaches to the previous marker.

## Markers {#markers}

A marker is one line of free text. The theme does not parse it, so `2026-11`,
`09:02`, `v1.6.0`, `Day 2` and `Q3 2026 – Q1 2027` all work, and events stay
in the order you write them. Markers are set small and semibold with tabular
figures, so times and dates line up; plain text suits them best.

```markdown {title="Source"}
09:02 UTC
: **Alert.** The deploy workflow fails on the production branch.

09:14 UTC
: **Cause found.** A new page links to a heading that was renamed, and the link check stops the build.

09:40 – 10:15 UTC
: **Fix.** The link is corrected and the site rebuilds.

10:30 UTC
: **Resolved.** Production serves the new page.
{.timeline}
```

09:02 UTC
: **Alert.** The deploy workflow fails on the production branch.

09:14 UTC
: **Cause found.** A new page links to a heading that was renamed, and the link check stops the build.

09:40 – 10:15 UTC
: **Fix.** The link is corrected and the site rebuilds.

10:30 UTC
: **Resolved.** Production serves the new page.
{.timeline}

On wide screens the marker column grows with the longest marker up to 10rem,
and a longer marker wraps inside it. A marker cannot continue onto a second
source line: every line directly above a `: ` line is a marker of its own, so
two marker lines in a row leave the first without an event (the axis still
bridges across them).

## Event content {#events}

An event is a definition, so it can hold continuation paragraphs, lists and
fenced code, indented two spaces to the column after `: `. A bold phrase at the
start is the usual event title; it is a writing convention, and the theme
styles it as ordinary bold text.

````markdown {title="Source"}
2025-09-30
: **v3.0.** PostgreSQL 18 becomes the default, and PostgreSQL 13 leaves the supported list.

  A cluster still on PostgreSQL 13 upgrades in two moves:

  - take a fresh base backup;
  - run `pg_upgrade` on the primary, then rebuild the replicas from it.

  ```bash
  pg_upgrade -b /usr/pgsql-13/bin -B /usr/pgsql-18/bin -d /var/lib/pgsql/13/data -D /var/lib/pgsql/18/data --link
  ```

Next release
: **Logical replication.** One command sets up publications and subscriptions between clusters.
{.timeline}
````

2025-09-30
: **v3.0.** PostgreSQL 18 becomes the default, and PostgreSQL 13 leaves the supported list.

  A cluster still on PostgreSQL 13 upgrades in two moves:

  - take a fresh base backup;
  - run `pg_upgrade` on the primary, then rebuild the replicas from it.

  ```bash
  pg_upgrade -b /usr/pgsql-13/bin -B /usr/pgsql-18/bin -d /var/lib/pgsql/13/data -D /var/lib/pgsql/18/data --link
  ```

Next release
: **Logical replication.** One command sets up publications and subscriptions between clusters.
{.timeline}

The axis runs along the start edge of each event, so it stays unbroken however
tall an event grows.

## Several events under one marker {#several}

Write more than one `: ` line under a marker for events that share it. They
follow one another on the axis under a single node.

```markdown {title="Source"}
2025-10-14
: **v3.0.1.** Fixes a failover timeout on clusters with more than three replicas.
: **v3.0.2.** The same day, a patch restores air-gapped installs, which 3.0.1 broke.

2025-12-02
: **v3.1.** Point-in-time recovery from the command line.
{.timeline}
```

2025-10-14
: **v3.0.1.** Fixes a failover timeout on clusters with more than three replicas.
: **v3.0.2.** The same day, a patch restores air-gapped installs, which 3.0.1 broke.

2025-12-02
: **v3.1.** Point-in-time recovery from the command line.
{.timeline}

## Where a timeline fits {#which}

| Content | Use |
| --- | --- |
| Dated or ordered events inside prose | a definition list + `{.timeline}` |
| A procedure the reader carries out | [Steps](/docs/components/steps/) |
| Changelog entries, each with a heading in the TOC | [Update](/docs/components/update/) |
| A schedule with durations and dependencies | a [Mermaid](/docs/components/mermaid/#gantt) Gantt chart |

## How it renders {#rendering}

| Condition | Layout |
| --- | --- |
| Viewport 576px and wider | Two columns: markers end-aligned against the axis, events beside them; the marker column fits its content up to 10rem |
| Narrower viewport or inside cards | One column: each marker above its event, with the axis and nodes on the start edge |
| Ink and Terminal presets | Square nodes (0px in Ink, 2px radius in Terminal) instead of round ones |
| Forced colors | The axis and nodes use the system text color |
| Right-to-left pages | The axis moves to the right, and the whole layout mirrors while keeping timestamps in natural order |

The styles apply only to `dl.timeline` inside article content, so definition
lists without the marker, and any element your site already calls `.timeline`
outside the article, are left alone.

## Prerequisites {#prerequisites}

Definition lists are a Goldmark extension that Hugo enables by default. The
attribute line needs Goldmark block attributes, one of the
[site prerequisites](/docs/components/#prerequisites) every component shares.

```yaml {title="hugo.yml"}
markup:
  goldmark:
    extensions:
      definitionList: true # Hugo's default
    parser:
      attribute:
        block: true # enable {…} attribute lines
```

With definition lists turned off, each marker and its event render as one
paragraph with a literal colon.

## Output {#outputs}

Timelines load no JavaScript. Screen readers announce each marker and event as
a term and its definition, in source order; the axis and nodes are decoration.
Print switches the timeline to paper ink regardless of the screen color scheme,
keeps each marker with its event and avoids breaking inside short events;
Markdown and LLMS output keep the list and its `{.timeline}` line as written,
and feed readers show a plain definition list.

## Parameter reference {#reference}

The definition-list syntax:

| Element | Required | Description |
| --- | --- | --- |
| Marker line | yes | One line of free text; plain text recommended. Each line directly above a `: ` line is its own marker |
| `: event` | yes | At least one per marker. Continuation blocks are indented two spaces |
| Further `: ` lines | no | More events under the same marker, sharing its node |
| Blank line | yes | Between entries; without it the next marker joins the previous event's text |
| `{.timeline}` | yes | The line directly below the last event, with no blank line before it |
{.fields}

A timeline has no attributes of its own: no icon, color, badge, link or
compact variant. An `id` or further classes on the same line, as in
`{#history .timeline}`, pass through Goldmark onto the `<dl>`.

## Limits {#limits}

- When placing a timeline directly inside a [callout](/docs/components/callout/)
  (`> [!NOTE] ...`), leave one blank `>` line after the callout header;
  without it Goldmark absorbs `[!NOTE]` into the first marker and the theme
  logs a build warning.
- Events take no icon, color, badge or link parameters. Put a link or a
  [badge](/docs/components/badge/) in the event text instead.
- Because Hugo has no `<dl>` render hook, attributes on the `{.timeline}` line
  follow Goldmark's default filtering (which strips `on*` handlers but passes
  `style`), unlike render-hook components.
- GitHub and some editors do not render definition lists, but the source
  still reads naturally: a marker line followed by `: event` lines.
- Markers are not parsed, sorted, grouped or localized; events appear in
  source order.
- Events are not headings and do not appear in the TOC. Use
  [update](/docs/components/update/) headings when they should.

## Related {#related}

- [Steps](/docs/components/steps/) — numbered procedures the reader follows
- [Update](/docs/components/update/) — changelog entries that stay headings
- [Mermaid](/docs/components/mermaid/) — Gantt charts and timeline diagrams for schedules
