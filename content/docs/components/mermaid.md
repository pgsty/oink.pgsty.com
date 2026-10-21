---
title: Mermaid
linkTitle: Mermaid
description: Use a `mermaid` fence for flowcharts, sequence diagrams, Gantt charts, class diagrams, and state diagrams. Bundled Mermaid follows the color scheme; source diffs show changes.
weight: 110
search_keywords: [Mermaid, flowchart, sequence, gantt, classDiagram, erDiagram, stateDiagram, diagram]
aliases:
  - /docs/components/diagrams/
---

A `mermaid` fence displays text as a flowchart, sequence diagram, Gantt chart, class diagram, ER diagram, or state diagram.
Git stores the diagram source, diffs show changes, and search can find it.
The reader's browser renders it with bundled Mermaid. It contacts no external service.
If a diagram needs precise pixel control, use SVG as an [image](/docs/components/image/).

## Shortest form {#minimal}

````markdown {title="Source"}
```mermaid
flowchart LR
  content["content/"] --> Hugo
  config["hugo.yml"] --> Hugo
  theme["OINK theme"] --> Hugo
  Hugo --> site["public/"]
```
````

```mermaid
flowchart LR
  content["content/"] --> Hugo
  config["hugo.yml"] --> Hugo
  theme["OINK theme"] --> Hugo
  Hugo --> site["public/"]
```

Use `mermaid` as the fence language. No other switch is needed.
Only pages with this fence load the Mermaid runtime. Even ten diagrams on one page load it only once.

## Sequence diagrams {#sequence}

`sequenceDiagram` describes messages between participants over time. Use it for request paths and loading order.

````markdown {title="Source"}
```mermaid
sequenceDiagram
  autonumber
  participant Reader as Reader's browser
  participant CDN as Static hosting
  participant JS as Page script bundle
  Reader->>CDN: GET /docs/components/mermaid/
  CDN-->>Reader: HTML (a figure plus the fence source)
  Reader->>CDN: GET this page's bundle
  CDN-->>Reader: mermaid.min.js
  JS->>JS: render the fence source into SVG
  Note over JS: runtimes the page never used are not downloaded
```
````

```mermaid
sequenceDiagram
  autonumber
  participant Reader as Reader's browser
  participant CDN as Static hosting
  participant JS as Page script bundle
  Reader->>CDN: GET /docs/components/mermaid/
  CDN-->>Reader: HTML (a figure plus the fence source)
  Reader->>CDN: GET this page's bundle
  CDN-->>Reader: mermaid.min.js
  JS->>JS: render the fence source into SVG
  Note over JS: runtimes the page never used are not downloaded
```

## Gantt charts {#gantt}

`gantt` displays intervals. This example shows each PostgreSQL major version's five-year community support period, measured from release.
`1825d` means five years.

````markdown {title="Source"}
```mermaid
gantt
  title Five-year community support per PostgreSQL major version
  dateFormat YYYY-MM-DD
  axisFormat %Y
  section PG 15
  released 2022-10-13 :2022-10-13, 1825d
  section PG 16
  released 2023-09-14 :2023-09-14, 1825d
  section PG 17
  released 2024-09-26 :2024-09-26, 1825d
  section PG 18
  released 2025-09-25 :active, 2025-09-25, 1825d
```
````

```mermaid
gantt
  title Five-year community support per PostgreSQL major version
  dateFormat YYYY-MM-DD
  axisFormat %Y
  section PG 15
  released 2022-10-13 :2022-10-13, 1825d
  section PG 16
  released 2023-09-14 :2023-09-14, 1825d
  section PG 17
  released 2024-09-26 :2024-09-26, 1825d
  section PG 18
  released 2025-09-25 :active, 2025-09-25, 1825d
```

## Class and ER diagrams {#class-and-er}

`classDiagram` displays types and relationships. `erDiagram` displays entities and cardinality. Use either to explain a data model.

````markdown {title="Source"}
```mermaid
classDiagram
  class Page {
    +string Title
    +string Description
    +int Weight
    +Content()
    +OutputFormats()
  }
  class Resource {
    +string Name
    +string RelPermalink
    +Resize(spec)
  }
  class OutputFormat {
    +string Name
    +string MediaType
  }
  Page "1" --> "0..*" Resource : page bundle resources
  Page "1" --> "1..*" OutputFormat : html / print / markdown / rss
```
````

```mermaid
classDiagram
  class Page {
    +string Title
    +string Description
    +int Weight
    +Content()
    +OutputFormats()
  }
  class Resource {
    +string Name
    +string RelPermalink
    +Resize(spec)
  }
  class OutputFormat {
    +string Name
    +string MediaType
  }
  Page "1" --> "0..*" Resource : page bundle resources
  Page "1" --> "1..*" OutputFormat : html / print / markdown / rss
```

````markdown {title="Source"}
```mermaid
erDiagram
  pg_database ||--o{ pg_namespace : "contains schemas"
  pg_namespace ||--o{ pg_class : "contains relations"
  pg_class ||--o{ pg_attribute : "has columns"
  pg_class ||--o{ pg_index : "is indexed by"
  pg_class {
    oid oid PK
    name relname
    char relkind
  }
  pg_attribute {
    oid attrelid FK
    name attname
    smallint attnum
  }
```
````

```mermaid
erDiagram
  pg_database ||--o{ pg_namespace : "contains schemas"
  pg_namespace ||--o{ pg_class : "contains relations"
  pg_class ||--o{ pg_attribute : "has columns"
  pg_class ||--o{ pg_index : "is indexed by"
  pg_class {
    oid oid PK
    name relname
    char relkind
  }
  pg_attribute {
    oid attrelid FK
    name attname
    smallint attnum
  }
```

## State diagrams {#state}

`stateDiagram-v2` displays states and transition conditions.
This example shows five OINK release states. They are not interchangeable. A successful local build establishes none of them.

````markdown {title="Source"}
```mermaid
stateDiagram-v2
  [*] --> SourceComplete
  SourceComplete --> Validated : theme checks + site suite green
  Validated --> Published : an immutable signed vX.Y.Z tag is pushed
  Published --> Documented : the site's go.mod pins that tag
  Documented --> Deployed : the production build goes live
  Deployed --> [*]
  Published --> SourceComplete : a problem means a new patch version; tags never move
```
````

```mermaid
stateDiagram-v2
  [*] --> SourceComplete
  SourceComplete --> Validated : theme checks + site suite green
  Validated --> Published : an immutable signed vX.Y.Z tag is pushed
  Published --> Documented : the site's go.mod pins that tag
  Documented --> Deployed : the production build goes live
  Deployed --> [*]
  Published --> SourceComplete : a problem means a new patch version; tags never move
```

## Per-diagram title and configuration {#per-diagram-config}

A fence body can start with Mermaid's YAML header. This is not Hugo front matter.
`title` sets the diagram title. `config` overrides Mermaid configuration for this diagram only.
If a diagram fixes `config.theme`, it no longer follows the site's color scheme.

````markdown {title="Source"}
```mermaid
---
title: Only the runtimes a page used are bundled
config:
  flowchart:
    curve: linear
---
flowchart TD
  Page --> Which{which components?}
  Which -->|Mermaid fence| M[mermaid.min.js]
  Which -->|ECharts fence| E[echarts.min.js]
  Which -->|none| B[base bundle only]
```
````

```mermaid
---
title: Only the runtimes a page used are bundled
config:
  flowchart:
    curve: linear
---
flowchart TD
  Page --> Which{which components?}
  Which -->|Mermaid fence| M[mermaid.min.js]
  Which -->|ECharts fence| E[echarts.min.js]
  Which -->|none| B[base bundle only]
```

## Light and dark {#dark-mode}

At initialization, the theme reads the current color scheme. Dark mode uses Mermaid's `dark` theme.
Light mode uses the site's configured theme. Changing the color scheme redraws diagrams in place without reloading the page.
Each diagram keeps its height during redrawing, so page content does not move.

Put site-wide defaults in `hugo.yml` with lowercase keys. The theme maps them to Mermaid's key casing:

```yaml {title="hugo.yml"}
params:
  mermaid:
    theme: neutral
    flowchart:
      diagrampadding: 6
```

[Configuration](/docs/customize/config/) lists all keys.
See the [Mermaid configuration reference](https://mermaid.js.org/config/schema-docs/config.html) for accepted values.

## Inside tabs and steps {#compose}

A `mermaid` fence has no `tab` attribute. Adjacent-fence tabs apply only to ordinary code fences.
To compare two diagrams, use the `tabs` shortcode.

````markdown {title="Source"}
{{</* tabs */>}}
{{</* tab label="By data flow" */>}}
```mermaid
flowchart LR
  Markdown --> Goldmark --> RenderHooks --> HTML
```
{{</* /tab */>}}
{{</* tab label="By output format" */>}}
```mermaid
flowchart LR
  Page --> HTML
  Page --> Print
  Page --> Markdown
  Page --> RSS
```
{{</* /tab */>}}
{{</* /tabs */>}}
````

{{< tabs >}}
{{< tab label="By data flow" >}}
```mermaid
flowchart LR
  Markdown --> Goldmark --> RenderHooks --> HTML
```
{{< /tab >}}
{{< tab label="By output format" >}}
```mermaid
flowchart LR
  Page --> HTML
  Page --> Print
  Page --> Markdown
  Page --> RSS
```
{{< /tab >}}
{{< /tabs >}}

Each step in `{{%/* steps */%}}` uses page-level Markdown and can contain a `mermaid` fence.
See [Steps](/docs/components/steps/).

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | A `figure` holding an empty stage and the fence source as JSON; the page's Mermaid runtime draws the SVG into it |
| Print | The source inside `<pre class="td-mermaid-source">`, static — no runtime runs there |
| Markdown | The `mermaid` fence and its source, kept as written |
| RSS | The source inside `<pre class="td-mermaid-source">` — subscribers see text |

## Parameter reference {#reference}

A `mermaid` fence reads no attribute line. `{height=…}` and `{class=…}` have no effect and produce no error.
The diagram and container width determine the size. The diagram is centered.

Site parameters (`hugo.yml`):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.mermaid` | map | unset | The whole map is passed to Mermaid's `initialize()`; write keys in lowercase and the theme matches them back to Mermaid's casing |
| `params.mermaid.theme` | string | Mermaid's default | The light-mode theme; dark mode forces `dark` |
{.fields meta="type default"}

Put per-diagram configuration (`title`, `config`) in the YAML header at the start of the fence body.
These are Mermaid keys, not theme parameters.

## Enlarging a diagram {#zoom}

Mermaid centers diagrams and scales them to fit the column. Wide sequence diagrams can shrink to about one third on phones.
Hover or focus a diagram to reveal its corner control. Open it to render it again at full size.
Drag to pan. Zoom with the wheel, a pinch, or `+` and `-`. Press `0` to reset and `Esc` to close.
If fitting would shrink a diagram below half size, it opens at 1:1 from its starting corner instead of as a thumbnail.
Zooming out can always show the complete diagram, regardless of size.
The viewer is bundled with the fence. It downloads nothing extra and needs no switch.

## Limits {#limits}

- Mermaid emits inline SVG instead of `<img>`, so `{#id num=}` numbering does not apply.
  If you need numbering, export an image and use [image](/docs/components/image/) numbering.
- Fence attributes have no effect. Control width through diagram syntax, such as flowchart direction or class-diagram layout, or CSS.
  There is no alignment attribute. Diagrams are always centered.
- Syntax errors appear only in the browser because Hugo does not parse Mermaid.
  Invalid diagrams display an alert with the parse error and source, but the build still passes. Check the browser before publishing.
- RSS, Markdown, and Print include source instead of pictures. State conclusions in prose as well as in diagrams.

## Related {#related}

- [PlantUML](/docs/components/plantuml/) — more complete UML, at the price of a rendering server
- [Markmap](/docs/components/markmap/) — outline-shaped hierarchies
- [ECharts](/docs/components/echarts/) — charts with numbers in them
- [Images](/docs/components/image/) — hand-drawn SVG and numbering
