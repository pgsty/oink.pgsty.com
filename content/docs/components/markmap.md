---
title: Markmap
linkTitle: Markmap
description: Use a `markmap` fence for an expandable mind map with zoom controls. Its source remains a readable Markdown outline.
weight: 130
search_keywords: [Markmap, mind map, outline, tree diagram]
---

A mind map shows the shape of a topic at a glance: what a guide covers, how a
system breaks down, which checks belong together. A `markmap` fence draws one
from an ordinary Markdown outline, so the source stays a readable list on
GitHub, in print and in feeds, while readers on the site can fold branches,
zoom and pan. When the relationships have a direction or a condition (this
calls that, retry if it fails), draw a [Mermaid](/docs/components/mermaid/)
flowchart instead.

## Shortest form {#minimal}

Markmap is off by default, so turn it on in the site configuration. Until you
do, the fence stays a plain code block and no map script loads.

```yaml {title="hugo.yml"}
params:
  markmap: true
```

Then write the outline in a `markmap` fence:

````markdown {title="Source"}
```markmap
# Backup strategy
## Physical backups
- full and incremental with pgBackRest
- continuous WAL archiving
## Logical backups
- pg_dump per database
- restore into a scratch instance
## Verification
- weekly restore drill
- checksum every backup
```
````

```markmap
# Backup strategy
## Physical backups
- full and incremental with pgBackRest
- continuous WAL archiving
## Logical backups
- pg_dump per database
- restore into a scratch instance
## Verification
- weekly restore drill
- checksum every backup
```

The first heading is the root, and the other headings and list items hang
below it by level. Click the dot on a node to fold or unfold its branch, scroll
to zoom, and drag to pan. The map refits itself whenever the column changes
width until you drag or zoom; after that it keeps your position, and **Fit to
window** below the map shows the whole outline again and resumes refitting. The
button works from the keyboard and is hidden in print.

## Depth {#depth}

Use as many heading and list levels as the topic needs; the map lays them out
and scales the tree to fit.

````markdown {title="Source"}
```markmap
# Operations handbook
## Install
### Requirements
### Single node
### Three-node cluster
## Configure
### Connection pooling
### Memory and WAL
### Access control
## Monitor
### Dashboards
### Alert rules
## Back up and restore
### Full and incremental backups
### Point-in-time recovery
### Restore drills
## Upgrade
### Minor versions
### Major versions with pg_upgrade
```
````

```markmap
# Operations handbook
## Install
### Requirements
### Single node
### Three-node cluster
## Configure
### Connection pooling
### Memory and WAL
### Access control
## Monitor
### Dashboards
### Alert rules
## Back up and restore
### Full and incremental backups
### Point-in-time recovery
### Restore drills
## Upgrade
### Minor versions
### Major versions with pg_upgrade
```

## Links, code and emphasis {#inline-markdown}

Node text accepts inline Markdown: links are clickable and keep their text as
the accessible name, inline code is monospaced, and bold and italic work as
usual.

````markdown {title="Source"}
```markmap
# Everyday commands
## Preview
- `hugo server` — open [localhost:1313](http://localhost:1313/)
- `hugo server -D` — **including drafts**
## Build
- `hugo --printPathWarnings`
- `hugo --gc --minify` — for publishing
## Theme
- `hugo mod get -u github.com/pgsty/oink`
- [theme repository](https://github.com/pgsty/oink)
- [site source](https://github.com/pgsty/oink.pgsty.com)
```
````

```markmap
# Everyday commands
## Preview
- `hugo server` — open [localhost:1313](http://localhost:1313/)
- `hugo server -D` — **including drafts**
## Build
- `hugo --printPathWarnings`
- `hugo --gc --minify` — for publishing
## Theme
- `hugo mod get -u github.com/pgsty/oink`
- [theme repository](https://github.com/pgsty/oink)
- [site source](https://github.com/pgsty/oink.pgsty.com)
```

A paragraph, table or fenced code block under a heading or list item becomes
that node's note. The node shows a marker; clicking it, or pressing Enter or
Space after tabbing to it, opens the note, and Escape closes it and returns
focus to the marker.

## Mathematics in nodes {#math}

Write `$…$` in a node for a formula. Maps typeset these with MathJax, which
ships with the theme and loads only for maps that contain math; formulas in
ordinary page text still use [KaTeX](/docs/components/math/).

````markdown {title="Source"}
```markmap
# PostgreSQL metrics worth watching
## Cache hit ratio
- $\frac{blks\_hit}{blks\_hit + blks\_read}$
- below 0.99, look at shared_buffers
## Replication lag
- $lsn_{primary} - lsn_{replica}$
## Transaction throughput
- $TPS = \frac{\Delta xact\_commit}{\Delta t}$
```
````

```markmap
# PostgreSQL metrics worth watching
## Cache hit ratio
- $\frac{blks\_hit}{blks\_hit + blks\_read}$
- below 0.99, look at shared_buffers
## Replication lag
- $lsn_{primary} - lsn_{replica}$
## Transaction throughput
- $TPS = \frac{\Delta xact\_commit}{\Delta t}$
```

## Controlling the initial depth {#options}

A large map is easier to read when it opens folded. Start the fence body with a
Markmap YAML header (it belongs to the map, not to Hugo's front matter):
`foldLevel: 1` shows the root and its direct branches and folds everything
deeper, so readers open only the branches they care about. `colorDepth` sets
the level from which each branch keeps a single color.

````markdown {title="Source"}
```markmap
---
markmap:
  foldLevel: 1
  colorDepth: 2
---

# Incident runbook
## Primary is down
### Confirm from two monitors
### Promote the replica
### Repoint the connection pooler
## Replication lag
### Look for long-running queries
### Check network throughput
## Disk almost full
### Remove expired WAL archives
### Extend the volume
## Slow queries
### Read pg_stat_statements
### Look for missing indexes
```
````

```markmap
---
markmap:
  foldLevel: 1
  colorDepth: 2
---

# Incident runbook
## Primary is down
### Confirm from two monitors
### Promote the replica
### Repoint the connection pooler
## Replication lag
### Look for long-running queries
### Check network throughput
## Disk almost full
### Remove expired WAL archives
### Extend the volume
## Slow queries
### Read pg_stat_statements
### Look for missing indexes
```

## Folded into a disclosure {#in-details}

Every map is 300 pixels tall, so a few in a row push the prose apart. Put a
large overview that only some readers need in a `> [!DETAILS]` disclosure;
every line inside it, fence lines included, starts with `>`.

````markdown {title="Source"}
> [!DETAILS] Everything the monitoring stack collects
> ```markmap
> # Metrics
> ## Host
> - CPU, memory and disk
> - network throughput
> ## PostgreSQL
> - connections and locks
> - replication lag
> - cache hit ratio
> ## Connection pooler
> - client and server connections
> - wait time
> ## Backups
> - last successful backup
> - WAL archive delay
> ```
````

> [!DETAILS] Everything the monitoring stack collects
> ```markmap
> # Metrics
> ## Host
> - CPU, memory and disk
> - network throughput
> ## PostgreSQL
> - connections and locks
> - replication lag
> - cache hit ratio
> ## Connection pooler
> - client and server connections
> - wait time
> ## Backups
> - last successful backup
> - WAL archive delay
> ```

## Output {#outputs}

A map is drawn when the reader scrolls near it; until then, and wherever
JavaScript is off or the engine fails to load, the page shows the outline
source, so the whole hierarchy stays readable. Print, the Markdown output and
RSS always carry the outline as written.

## Parameter reference {#reference}

Site parameter (`hugo.yml`):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.markmap` | bool | `false` | With it off, the fence stays a code block and no runtime loads |
{.fields meta="type default"}

Options for a single map, such as `foldLevel`, `colorDepth` and `wrapWidth`,
go in the `markmap:` YAML header at the start of the fence body. They are
Markmap 1 options; the [Markmap documentation](https://markmap.js.org/docs/options)
lists them all. Fence attributes do not change the map: its width fills the
reading column and its height is fixed at 300px.

## Limits {#limits}

- The 300px height comes from one theme rule, `.markmap > svg`, and a fence
  cannot change it. For a deep outline, fold it with `foldLevel` or split it
  into two maps. The map is inline SVG, so `{#id num=}` numbering and image
  zoom do not apply.
- Node text follows the site's text color, but the branch lines keep Markmap's
  own palette. If your site changes colors, check maps in both light and dark
  mode.
- Characters such as `>`, `&` and quotes display as written. HTML tags in a
  node are dropped, except image tags and Markmap's magic comments.
- If a map, a note or its math fails to load, that map falls back to its
  outline source and the other maps on the page keep working.

## Older option names {#migration}

If a map's YAML header uses one of the option names on the left, rename it. The
old name is ignored and the build warns about it.

| Older option | Current option |
| --- | --- |
| `initialExpandLevel: N` | `foldLevel: N-1` for a positive N; delete it if N is `-1` |
| `maxWidth` | `wrapWidth` |
| `spacingHorizontal` | `levelGap` |
| `spacingVertical` | `siblingGap` |
| `colorFreezeLevel` | `colorDepth` |

`foldLevel` counts the root as depth 0, which is why the value drops by one.
`paddingX`, `lineWidth`, `extraJs`, `extraCss`, `embedAssets`, `htmlParser`
and `activeNode` no longer exist; delete them, because a map cannot inject its
own scripts or styles.

## Related {#related}

- [Mermaid](/docs/components/mermaid/) — diagrams with direction and conditions
- [File trees](/docs/components/filetree/) — more precise for directory structure
- [Callouts](/docs/components/callout/) — everything `[!DETAILS]` can do
- [Configuration](/docs/customize/config/) — `params.markmap`
