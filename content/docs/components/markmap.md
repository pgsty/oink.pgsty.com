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
The bottom-right toolbar has zoom, fit-to-window, and SVG download controls.

## Depth {#depth}

Deeper levels use smaller text, and the canvas arranges itself.
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

The Markmap runtime includes local KaTeX. `$…$` in nodes renders as a formula.

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
`initialExpandLevel` initially expands only the first levels. Readers can open the rest.
`colorFreezeLevel` sets the level from which a branch keeps one color.

````markdown {title="Source"}
```markmap
---
markmap:
  initialExpandLevel: 2
  colorFreezeLevel: 2
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
  initialExpandLevel: 2
  colorFreezeLevel: 2
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
> - scss/ tokens and component styles
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
> - scss/ tokens and component styles
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
| Print | Same as HTML: the print view loads the runtime too |
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
Put per-map behavior in the `markmap:` YAML header at the start of the body, such as `initialExpandLevel`, `colorFreezeLevel`, or `maxWidth`.
This is Markmap syntax. See the [Markmap documentation](https://markmap.js.org/docs/json-options) for accepted keys.

## Limits {#limits}

- Inline SVG output is fixed at 300px tall by one `.markmap > svg` rule. Fences cannot change this height.
  For many levels, use `initialExpandLevel` or split the map. `{#id num=}` numbering and image zoom do not apply to inline SVG.
- Markmap uses its own link-color palette and does not follow the site's color scheme. Check contrast in both modes.
- Without `params.markmap`, the fence remains a code block. Sites that do not use Markmap load no runtime.
- The toolbar's "Download SVG" action exports a browser snapshot of the current expansion state.
- Avoid `<`, `>`, `&`, and `"` in outlines. The current theme double-escapes them, displaying literal `&gt;` or `&#34;`.
  Use `[text](URL)` links instead of angle-bracket autolinks.

## Related {#related}

- [Mermaid](/docs/components/mermaid/) — diagrams with direction and conditions
- [File trees](/docs/components/filetree/) — more precise for directory structure
- [Callouts](/docs/components/callout/) — everything `[!DETAILS]` can do
- [Configuration](/docs/customize/config/) — `params.markmap`
