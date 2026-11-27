---
title: Timeline
linkTitle: Timeline
description: Add `{.timeline}` to a Markdown definition list to draw dated or ordered events on an axis. Markers are free text, events take block content, and no script loads.
weight: 72
search_keywords: [Timeline, chronology, milestones, history, postmortem, agenda, definition list, dl, dt, dd]
---

A timeline places events on a vertical axis, each beside its marker. A marker is whatever orders the events: a date, a time, a version, "Day 2".
Write a Markdown definition list, one term per marker and one definition per event, and put `{.timeline}` on the line below it.
The theme adds only CSS. Use a timeline for project milestones, an incident's sequence, a product's history, or an agenda.
Use [steps](/docs/components/steps/) for a procedure the reader carries out, and [update](/docs/components/update/) entries when each item needs a heading in the table of contents.

## Shortest form {#minimal}

Write each marker on its own line and its event on the next line, after `: `. Separate entries with a blank line.
Put `{.timeline}` directly under the last event.

```markdown {title="Source"}
2026-08-29
: **OINK 1.0.0.** Component, configuration and output contracts are declared stable.

2026-10-15
: **OINK 1.3.0.** Image albums arrive with `type: expo`.

2026-11-23
: **OINK 1.6.0.** The stylesheet becomes plain CSS; a site build needs only the Hugo binary.
{.timeline}
```

2026-08-29
: **OINK 1.0.0.** Component, configuration and output contracts are declared stable.

2026-10-15
: **OINK 1.3.0.** Image albums arrive with `type: expo`.

2026-11-23
: **OINK 1.6.0.** The stylesheet becomes plain CSS; a site build needs only the Hugo binary.
{.timeline}

`{.timeline}` must touch the last event. With a blank line before it, Goldmark drops the attribute line without a warning, and the list renders as an ordinary definition list.
The blank lines between entries are required: without one, the next marker becomes a line of the previous event's text.

## Markers {#markers}

A marker is one line of free text. The theme does not parse it, so `2026-11`, `09:02`, `v1.6.0`, `Day 2` and `Q3 2026 – Q1 2027` are all valid.
Events stay in the order you write them. Plain text is recommended; markers are set small and semibold, with tabular figures so times and dates line up.

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

On wide screens the marker column grows with the longest marker, up to 10rem; a longer marker wraps inside it.
Every line directly above a `: ` line is a separate marker, so a marker cannot continue onto a second source line.

## Event content {#events}

An event is a definition, so it takes block content: continuation paragraphs, lists and fenced code.
Indent them two spaces, to the column after `: `, as for any definition list. A leading bold phrase is the conventional event title.
It is a writing convention, not syntax; the theme styles it as ordinary bold text.

````markdown {title="Source"}
2026-11-23
: **OINK 1.6.0.** The stylesheet becomes plain CSS layers, and the three SCSS hooks are retired.

  A site that used the hooks upgrades in two moves:

  - put its rules in `assets/css/project.css`;
  - restate each changed Sass variable as the custom property it produced.

  ```bash
  hugo mod get github.com/pgsty/oink@v1.6.0
  ```

Unreleased
: **Timeline and Update.** Native components for dated events and changelog entries.
{.timeline}
````

2026-11-23
: **OINK 1.6.0.** The stylesheet becomes plain CSS layers, and the three SCSS hooks are retired.

  A site that used the hooks upgrades in two moves:

  - put its rules in `assets/css/project.css`;
  - restate each changed Sass variable as the custom property it produced.

  ```bash
  hugo mod get github.com/pgsty/oink@v1.6.0
  ```

Unreleased
: **Timeline and Update.** Native components for dated events and changelog entries.
{.timeline}

The axis is drawn along the start edge of each event, so it stays continuous however tall an event grows.

## Several events under one marker {#several}

Write more than one `: ` line under a marker for events that share it. They follow one another on the axis, under a single node.

```markdown {title="Source"}
2026-10-18
: **OINK 1.3.1.** Readability repairs and an opt-in FileTree comment layout.
: **OINK 1.3.2.** The same day, a patch restores the Hugo-only build that 1.3.1 broke.

2026-11-04
: **OINK 1.5.0.** Bilingual View opens a page and its translation side by side.
{.timeline}
```

2026-10-18
: **OINK 1.3.1.** Readability repairs and an opt-in FileTree comment layout.
: **OINK 1.3.2.** The same day, a patch restores the Hugo-only build that 1.3.1 broke.

2026-11-04
: **OINK 1.5.0.** Bilingual View opens a page and its translation side by side.
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
| Viewport 576px and wider | Two columns: markers end-aligned against the axis, events beside them; the marker column is content-sized and capped at 10rem |
| Narrower viewport | One column: each marker above its event, with the axis and nodes on the start edge |
| Ink and Terminal presets | Square nodes instead of round ones |
| Forced colors | The axis and nodes use the system text color |
| Right-to-left pages | The axis moves to the right; logical properties mirror the layout |

The styles are scoped to `.td-content dl.timeline`. A definition list without `{.timeline}` renders as before, and elements a site already calls `.timeline` outside article content are not touched.

## Prerequisites {#prerequisites}

Definition lists are a Goldmark extension that Hugo enables by default. The attribute line needs Goldmark block attributes, one of the [site prerequisites](/docs/components/#prerequisites) every component shares.

```yaml {title="hugo.yml"}
markup:
  goldmark:
    extensions:
      definitionList: true # Hugo's default
    parser:
      attribute:
        block: true # enable {…} attribute lines
```

With definition lists turned off, each marker and its event render as one paragraph with a literal colon.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<dl class="timeline">` from Goldmark: a `<dt>` per marker and a `<dd>` per event; the axis and nodes are CSS |
| Print | The same markup; print styles keep a marker on the same page as its event |
| Markdown and LLMS | The authored definition list and its `{.timeline}` line |
| RSS | The `<dl>` as rendered; feed readers show markers and events as terms and definitions |

Timelines load no JavaScript. Screen readers announce each marker and event as a term and its definition, in source order; the axis and nodes are decoration.

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

There are no attributes: no icon, color, badge, link or compact variant. An `id` or further classes on the same line, as in `{#history .timeline}`, pass through Goldmark onto the `<dl>`.

## Limits {#limits}

- Events take no icons, colors, badges or links as parameters. Put a link or a [badge](/docs/components/badge/) in the event text instead.
- A blank line before `{.timeline}` silently drops the marker. This is true of every Goldmark block attribute: the attribute never reaches the theme, so no warning is possible.
- GitHub and some editors do not render definition lists. The source still reads as a marker line followed by `: event` lines.
- Two marker lines in a row leave the first marker without an event, which shows as a gap in the axis on wide screens. Give every marker at least one event.
- No date parsing, sorting or grouping: events appear in source order, and markers are not localized.
- Events are not headings and do not appear in the TOC. Use [update](/docs/components/update/) headings when they should.

## Related {#related}

- [Steps](/docs/components/steps/) — numbered procedures the reader follows
- [Update](/docs/components/update/) — changelog entries that stay headings
- [Mermaid](/docs/components/mermaid/) — Gantt charts and timeline diagrams for schedules
