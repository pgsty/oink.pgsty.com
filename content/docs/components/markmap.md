---
title: Markmap
linkTitle: Markmap
description: Use a `markmap` fence for an expandable mind map with zoom controls. Its source remains a readable Markdown outline.
weight: 130
search_keywords: [Markmap, mind map, outline, tree diagram]
---

A `markmap` fence contains a Markdown outline. Headings and lists define the hierarchy.
The browser displays an expandable, collapsible tree. Use it to give an overview of a section.
For flows with direction or conditions, use [Mermaid](/docs/components/mermaid/).

> [!NOTE] Unreleased dependency upgrade
> These examples target Markmap 1 in the theme checkout after OINK v1.5.1.
> Published v1.5.1 still uses Markmap 0.18; see the [migration notes](#migration).

## Shortest form {#minimal}

Enable Markmap in site configuration first. It is off by default. Without this setting, the fence stays a readable code block.

```yaml {title="hugo.yml"}
params:
  markmap: true
```

Then put the outline in a `markmap` fence:

````markdown {title="Source"}
```markmap
# OINK
## Local-first
- every runtime ships with the theme
- no CDN involved
## Markdown-native
- components are fences and attribute lines
- usable without writing a shortcode
## Four output states
- HTML
- print
- Markdown
- RSS
```
````

```markmap
# OINK
## Local-first
- every runtime ships with the theme
- no CDN involved
## Markdown-native
- components are fences and attribute lines
- usable without writing a shortcode
## Four output states
- HTML
- print
- Markdown
- RSS
```

The first-level heading is the root. Indentation places other headings and list items below it.
Click a node's dot to expand or collapse its branch. Scroll to zoom, and drag to pan.
In OINK 1.4.0, **Fit to window** below the map restores the whole
outline and resumes automatic fitting when the column changes width. Dragging or
zooming suspends automatic fitting to preserve your reading position. The button
also works with Tab and Enter.

## Depth {#depth}

The renderer arranges each level and fits the tree to the canvas.
This example shows the theme documentation site's six sections and their page counts.

````markdown {title="Source"}
```markmap
# OINK documentation
## Introduction (4 pages)
### What it is
### Feature tour
### Showcase
### Licences
## Get started (4 pages)
### Choose a path
### OINK Starter
### Repository tour
### From scratch
## Authoring (8 pages)
### Organizing content
### Writing pages
### Front matter
### Blog
### Books
### Releases and downloads
### OpenAPI
## Components (22 pages)
### Callouts / tabs / steps / cards
### Images / galleries / tables / fields
### Diagrams: Mermaid / PlantUML / Markmap / ECharts
## Customization (15 pages)
### Branding / navigation / search / languages
### Landing / versions / taxonomies / print
## Operations (7 pages)
### Preview / deploy / upgrade
### Comments / analytics / troubleshooting
```
````

```markmap
# OINK documentation
## Introduction (4 pages)
### What it is
### Feature tour
### Showcase
### Licences
## Get started (4 pages)
### Choose a path
### OINK Starter
### Repository tour
### From scratch
## Authoring (8 pages)
### Organizing content
### Writing pages
### Front matter
### Blog
### Books
### Releases and downloads
### OpenAPI
## Components (22 pages)
### Callouts / tabs / steps / cards
### Images / galleries / tables / fields
### Diagrams: Mermaid / PlantUML / Markmap / ECharts
## Customization (15 pages)
### Branding / navigation / search / languages
### Landing / versions / taxonomies / print
## Operations (7 pages)
### Preview / deploy / upgrade
### Comments / analytics / troubleshooting
```

## Links, code and emphasis {#inline-markdown}

Nodes accept inline Markdown. Links are clickable, inline code is monospaced, and bold and italic text display normally.

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

## Mathematics in nodes {#math}

The Markmap runtime loads local MathJax when `$…$` appears in nodes.
Ordinary page formulas continue to use KaTeX.

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

The fence body can start with Markmap's YAML header. This is not Hugo front matter.
`foldLevel` initially expands only the first levels. Readers can open the rest.
`colorDepth` sets the level from which a branch keeps one color.

````markdown {title="Source"}
```markmap
---
markmap:
  foldLevel: 1
  colorDepth: 2
---

# Check scripts in the theme repository
## Source-level contracts
### check-i18n.py
### check-taxonomy.py
### check-font-tokens.py
## Output-level checks
### check-output.py
### check-goldens.py
### check-code-blocks.py
### check-content-primitives.py
### check-media-primitives.py
## Browser runtimes
### node --test tests/js/**/*.test.js
```
````

```markmap
---
markmap:
  foldLevel: 1
  colorDepth: 2
---

# Check scripts in the theme repository
## Source-level contracts
### check-i18n.py
### check-taxonomy.py
### check-font-tokens.py
## Output-level checks
### check-output.py
### check-goldens.py
### check-code-blocks.py
### check-content-primitives.py
### check-media-primitives.py
## Browser runtimes
### node --test tests/js/**/*.test.js
```

## Folded into a disclosure {#in-details}

Every map is 300 pixels tall. Three consecutive maps occupy considerable page space.
Put a large overview in `> [!DETAILS]` so readers can open it.
Start every disclosure line with `>`, including fence lines.

````markdown {title="Source"}
> [!DETAILS] What the theme repository looks like
> ```markmap
> # pgsty/oink
> ## layouts/
> - baseof.html and the per-type shells
> - _partials/shell/
> - _markup/ render hooks
> - _shortcodes/
> ## assets/
> - css/ tokens and component styles
> - js/ browser runtimes
> - third_party/ libraries shipped with the theme
> ## i18n/
> - 32 locale files with identical keys
> ## docs/
> - maintainer contracts
> ```
````

> [!DETAILS] What the theme repository looks like
> ```markmap
> # pgsty/oink
> ## layouts/
> - baseof.html and the per-type shells
> - _partials/shell/
> - _markup/ render hooks
> - _shortcodes/
> ## assets/
> - css/ tokens and component styles
> - js/ browser runtimes
> - third_party/ libraries shipped with the theme
> ## i18n/
> - 32 locale files with identical keys
> ## docs/
> - maintainer contracts
> ```

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<pre><code class="language-markmap">` first; the runtime replaces it with `<div class="markmap">` and draws the SVG |
| Print | The outline source, with no runtime |
| Markdown | The `markmap` fence and its outline, kept as written |
| RSS | The outline source only — a readable outline for subscribers |

The outline supplies the content. Without JavaScript, the complete hierarchy remains readable.

## Parameter reference {#reference}

A `markmap` fence reads no attribute line. The theme fixes its height at 300px through `.markmap > svg`.
Its width fills the reading column.

Site parameters (`hugo.yml`):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.markmap` | bool | `false` | With it off, the fence stays a code block and no runtime loads |
{.fields meta="type default"}

[Configuration](/docs/customize/config/) defines the site key.
Put per-map behavior in the `markmap:` YAML header at the start of the body, such as `foldLevel`, `colorDepth`, or `wrapWidth`.
This is Markmap syntax. See the [Markmap documentation](https://markmap.js.org/docs/options) for accepted keys.

## Limits {#limits}

- Inline SVG output is fixed at 300px tall by one `.markmap > svg` rule. Fences cannot change this height.
  For many levels, use `foldLevel` or split the map. `{#id num=}` numbering and image zoom do not apply to inline SVG.
- Node text follows the site's text color; connecting lines retain Markmap's own palette. Check custom colors in both modes.
- Without `params.markmap`, the fence remains a code block. Sites that do not use Markmap load no runtime.
- OINK 1.4.0 provides a fit control below each map; it is hidden in print.
- Literal punctuation is escaped once. Raw HTML is not a node format in Markmap 1.

## Migrating to Markmap 1 {#migration}

> [!NOTE] Unreleased
> These examples target the dependency upgrade after OINK v1.5.1.

| Previous option | Markmap 1 option |
| --- | --- |
| `initialExpandLevel: N` | `foldLevel: N-1` for positive integers; omit for `-1` |
| `maxWidth` | `wrapWidth` |
| `spacingHorizontal` | `levelGap` |
| `spacingVertical` | `siblingGap` |
| `colorFreezeLevel` | `colorDepth` |

The root now has depth 0. Old keys produce a build warning and are ignored.
Review options in each fence before upgrading. `paddingX`, `lineWidth`,
`extraJs`, `extraCss`, `embedAssets`, `htmlParser`, and `activeNode` are no
longer options; use supported themes and layouts instead of injecting assets.

Headings and list items remain nodes. Paragraphs, tables and fenced code become
node notes. Raw HTML is dropped except supported image tags and magic comments.
Math uses locally bundled MathJax; ordinary page formulas still use KaTeX.
Notes and math load their local chunks only when needed. The fit button, live
appearance changes and source fallback remain available. Dedicated Print,
Markdown and RSS contain the outline without loading an engine.
SVG links retain their Markdown labels as accessible names after folding and redraws.
Tab to a note marker and press Enter or Space to read its note. Escape closes
the note and returns focus to the marker.
Open notes follow appearance changes and are hidden during browser printing.
If a note cannot load, its map restores the complete Markdown source and focus;
other maps remain usable.

## Related {#related}

- [Mermaid](/docs/components/mermaid/) — diagrams with direction and conditions
- [File trees](/docs/components/filetree/) — more precise for directory structure
- [Callouts](/docs/components/callout/) — everything `[!DETAILS]` can do
- [Configuration](/docs/customize/config/) — `params.markmap`
