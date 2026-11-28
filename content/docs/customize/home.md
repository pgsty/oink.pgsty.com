---
title: Home and landing pages
linkTitle: Home and landing pages
description: Build the home page, or any product or pricing page, from sections listed in a YAML data file, with no template to write.
weight: 30
search_keywords: [home page, landing page, landing, hero, sections, data/home, data/landing, product page]
aliases:
  - /docs/scenarios/landing/
---

An OINK home page is data, not a template. `data/home/<language>.yaml` lists
the sections from top to bottom (a hero, a grid of cards, pricing, a closing
call to action) and holds the content of each, so you change the page by
editing YAML and never touch HTML. Any other page can use the same sections as
a [landing page](#landing-page).

## Edit the Starter's home page {#minimal}

The [OINK Starter](/docs/start/) ships a three-section home page in
`data/home/en.yaml`. Replace the text and links with your own and the browser
reloads with the result:

```yaml {title="data/home/en.yaml"}
sections: [hero, cards, cta]

hero:
  align: center
  eyebrow: Open-source time-series database
  title_lines:
    - words: [{ text: Acme DB. }]
    - words: [{ text: Fast queries over years of metrics. }]
  lead: Install it, load your data and run your first query in ten minutes.
  actions:
    - { label: Install, url: docs/install/, icon: fa-solid fa-download, style: primary }
    - { label: Read the docs, url: docs/, style: ghost }

cards:
  eyebrow: Where to start
  title: Everything has a place
  columns: 3
  items:
    - title: Install
      desc: Packages for Linux and macOS, a container image, and a Helm chart.
      icon: fa-solid fa-download
      url: docs/install/
    - title: Query language
      desc: Every function and operator, with an example for each.
      icon: fa-solid fa-terminal
      url: docs/reference/
    - title: Release notes
      desc: What changed in each version, and how to upgrade.
      icon: fa-solid fa-tag
      url: blog/

cta:
  title: Run your first query today.
  text: The quick start takes ten minutes on a laptop.
  label: Get started
  url: docs/install/
  style: primary
```

Write internal links as site paths without a leading slash, such as
`docs/install/`; the theme adds the language prefix, so the same link reaches
`/zh/docs/install/` from the Chinese home page. To add a section, append its
name to `sections` and give it a key of the same name; to reorder the page,
reorder the list. The [section types](#registry) table lists everything
available.

## Where the data lives {#home-data}

The home page's content file holds only its title and description:

```yaml {title="content/_index.md"}
---
title: Acme DB
description: An open-source time-series database
---
```

The sections live in one data file per language:

```filetree {title="home page data"}
- data/
  - home/
    - en.yaml            # English home page
    - zh.yaml            # Chinese home page
```

For each language the theme reads `data/home/<language>.yaml`, falls back to
`data/home/en.yaml`, and on a single-language site accepts a plain
`data/home.yaml`.

Each file has two levels: the `sections` list, and the keys it names. A section
normally reads the key that matches its type; give it a `key` to read another,
which is how one page shows two card grids:

```yaml {title="data/home/en.yaml"}
sections:
  - hero          # reads hero:
  - cards         # reads cards:
  - type: cards   # a second card grid, reading release:
    key: release
  - cta

hero: { … }
cards: { … }
release: { … }
cta: { … }
```

### Section entries {#entry}

An entry in `sections` is either a type name or a map:

| Key | What it does |
| --- | --- |
| `type` | The section type. If omitted, `key` is used as the type |
| `key` | The top-level key that holds the data. Defaults to the type name; use it to tell two sections of the same type apart |
| `data` | The section's data inline, instead of under a top-level key |
| `id` | The section's anchor ID, generated from `key` or `type` by default |
| `enabled: false` | Hides the section and keeps its data |
| `partial` | Renders the data with one of the site's own partials. This ties the data to your templates, so it no longer moves between sites |

Type names use hyphens (`logo-wall`); underscores are accepted and normalized.
A misspelled type warns with `unknown section type` and the section is
skipped. A home page migrated from Docsy's `blocks/*` shortcodes has to be
rebuilt this way; see [Migrating from Docsy](/docs/admin/upgrade/#from-docsy).

## Hero {#hero}

The hero is the first screen, and the only section with a large title and an
illustration:

```yaml {title="data/home/en.yaml"}
hero:
  eyebrow: Acme DB 3.0 · Open source         # small text above the title, with a status dot
  title_lines:                               # the large title, one entry per line
    - words:
        - { text: Acme DB }
  lead: One sentence saying what this is.    # inline Markdown and <br> allowed
  note: Runs on a single binary              # a supplementary line with an icon
  note_icon: fa-solid fa-circle-check
  title_size: 4.25rem                        # rem, em or px only
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp              # with only one, both modes use it
    alt: Query latency dashboard
  media:
    ratio: '1fr 240px'                       # column widths of text and image
    max_width: 240px
    hide_below: md                           # hide the image below sm | md | lg | xl
  actions:
    - { label: Get started, url: docs/install/, icon: fa-solid fa-rocket, style: primary }
    - { label: GitHub, url: 'https://github.com/example/acme-db', external: true, style: ghost }
  detail: { label: See a live demo, url: docs/demo/ }
```

An image path names a file under the site's `static/` or `assets/`; the example
expects `static/images/hero-light.webp` and `static/images/hero-dark.webp`.
The image is a CSS background: with `alt` its container is announced as an image with
that label, and without `alt` it is hidden from assistive technology. Without
`title_lines` the hero shows `title`, and without either it shows the site
title.

`align: center` gives a text-only first screen, as in the Starter: the text
block widens and centers, title lines are balanced, and `note` moves below the
buttons. A centered hero cannot hold an image, so when both are present the
theme warns and keeps `start` alignment and the image.

## Section types {#registry}

There are 22 section types. Every type except `hero` accepts the same heading
fields, `eyebrow`, `title` and `desc` (or `text`), plus a `class` for your own
CSS.

| Type | What it holds |
| --- | --- |
| `hero` | The first screen: large title, buttons, an image that follows light and dark mode |
| `metrics` | Numeric facts, with optional count animation and source links |
| `capabilities` | Capabilities described one per row, alternating sides, each with a visual panel |
| `principles` | Numbered product principles |
| `cards` | A general card grid: features, use cases, entry points |
| `logo-wall` | Tools and partners, as a grid or a pure-CSS marquee |
| `gallery` | A wall of screenshots |
| `testimonials` | Quotations with attribution |
| `contributors` | People, roles, avatars and links |
| `faq` | Questions and answers, collapsible or flat |
| `markdown` | Free Markdown content |
| `cta` | The closing call to action |
| `pricing` | Pricing tier cards |
| `pricing-compare` | A tier-by-feature comparison matrix |
| `command-box` | One copyable command |
| `steps` | An ordered procedure, optionally with commands |
| `timeline` | Dated milestones |
| `code-plate` | Code inside a presentation panel |
| `preview` | Markdown source beside its rendered result |
| `case-study` | A case: metrics, a quotation and its source |
| `download` | One or more `data/download/` records |
| `bar-chart` | Numeric comparison drawn without chart JavaScript |

## Common sections {#section-examples}

`cards` sets its column count with `columns`:

```yaml {title="data/home/en.yaml"}
cards:
  title: Use cases
  columns: 4
  link_label: Learn more
  items:
    - title: Monitoring
      meta: Metrics
      icon: fa-solid fa-chart-line
      desc: Keep a year of per-second metrics queryable in milliseconds.
      url: docs/use-cases/monitoring/
```

`capabilities` gives each capability a row of its own with a visual panel
beside it. `visual.type` is one of `shell`, `components`, `code`, `image` or
`card`:

```yaml {title="data/home/en.yaml"}
capabilities:
  eyebrow: Why Acme DB
  title: Built for data that only grows
  items:
    - ref: 01 / Operations
      title: One binary, no cluster to babysit
      url: docs/install/
      motto: From the first install to the hundredth upgrade
      bullets:
        - 'Rolling [upgrades](docs/upgrade/) without downtime'
        - 'Built-in [backups](docs/backup/) and point-in-time recovery'
      value: Teams spend their time on queries, not on the database.
      visual:
        type: code
        title: install.sh
        lines:
          - { class: c, prefix: '# ', text: One command, one running server }
          - { class: p, prefix: '$ ', text: acme-db start --data ./data }
          - { class: ok, prefix: '✓ ', text: listening on :5433 }
```

> [!DETAILS] Minimal YAML for eleven more sections
>
> ```yaml
> metrics:
>   title: Facts
>   animate: true
>   items:
>     - { value: 2189, compact: true, label: Stars, source: { label: Local CI data, url: 'https://example.org/' } }
>     - { value: 32, suffix: '+', label: Languages }
>
> command-box:
>   title: Install
>   code: hugo mod get github.com/pgsty/oink
>   lang: bash
>   note: The copy button comes from the on-demand landing runtime.
>
> steps:
>   title: Three steps to publish
>   items:
>     - { title: Clone, desc: Copy the documentation site repository. }
>     - { title: Configure, desc: Change three settings., cmd: { code: hugo server } }
>     - { title: Publish, desc: Push to GitHub Pages. }
>
> timeline:
>   title: Project history
>   items:
>     - { date: '2024', title: Prototype, desc: The first data-driven sections. }
>     - { date: '2026', title: Scenario components, desc: Landing becomes a reusable shell. }
>
> code-plate:
>   title: Page configuration
>   aria_label: Example configuration
>   lang: yaml
>   code: |
>     layout: landing
>     landing: pricing
>
> preview:
>   title: What you write is what you get
>   file: guide.md            # the filename in the source panel header, default page.md
>   source: |                 # the right side renders this Markdown with the site's own hooks
>     > [!TIP] Markdown only
>     > Callouts, steps and tabs are all ordinary syntax.
>
>     1. Write Markdown
>     2. Run `hugo`
>     {.steps}
>
> case-study:
>   title: Migration outcome
>   stats:
>     - { value: 12, label: Reusable sections }
>     - { value: 0, label: Remote requests }
>   quote: "One YAML file replaced a bespoke page template."
>   source: A site maintainer
>
> pricing:
>   title: Pricing
>   tiers:
>     - name: Community
>       price: Free
>       period: forever
>       desc: The full open-source capability.
>       features: [Every component, Community support]
>       cta: { label: Download, url: docs/start/ }
>     - name: Professional
>       featured: true
>       price: $3.4K
>       period: /year
>       features: [Priority response, Release packages]
>       cta: { label: Contact us, url: 'mailto:example@example.org' }
>
> pricing-compare:
>   title: Tier comparison
>   tiers: [Community, Professional]
>   groups:
>     - name: Support
>       rows:
>         - { name: Priority response, cells: [N, Y] }
>         - { name: Annual fee, price_row: true, cells: [Free, $3.4K] }
>
> download:
>   title: Download
>   keys: [prd5]
>
> bar-chart:
>   title: Build time
>   unit: seconds
>   items:
>     - { label: Cold build, value: 12.3, group: cold }
>     - { label: Warm cache, value: 1.6, group: warm, note: A repeat build on the same machine. }
> ```

The `download` section reads the same `data/download/<key>.yaml` records as
[Releases and downloads](/docs/write/releases/), so a version number is
written once for both.

## Landing pages {#landing-page}

A pricing page, a product overview or an event page can use the same sections
as the home page. Two front matter lines turn an ordinary page into a
full-width landing page that keeps the navbar, the command palette and the
footer and drops the sidebar and outline:

```yaml {title="content/pricing.md"}
---
title: Pricing
layout: landing
landing: pricing
---
```

`landing: pricing` names the data, which sits beside the home page's and is
split by language the same way:

```filetree {title="landing page data"}
- data/
  - landing/
    - pricing/
      - en.yaml
      - zh.yaml
```

A single `data/landing/pricing.yaml` also works: with `sections` at its top
level it serves every language, and with one map per language code it works
like the directory form. For a language tagged `zh-cn`, the theme tries
`zh-cn`, then `zh`, then `en`. When it finds nothing, the page warns and
renders the landing shell without sections.

A page with only a section or two can write them in its front matter instead,
each with its data inline. Use either `landing:` or `sections:`, not both; with
both, the theme warns and uses the inline sections.

```yaml {title="content/pricing.md"}
---
title: Pricing
layout: landing
sections:
  - type: hero
    data:
      title: Acme DB Cloud, priced per node
      actions:
        - { label: Read the docs, url: docs/, style: primary }
  - type: cta
    data:
      title: Ready to start?
      label: Read the docs
      url: docs/
---
```

Landing pages show the search button and command palette when the site has
[local search](/docs/customize/search/) on. To leave search off landing pages
other than the home page, set `params.ui.landing_search: false`.

## Languages and local facts {#i18n}

Put each language's text in its own file (`en.yaml`, `zh.yaml`). A record that
is mostly shared facts, such as a pricing tier, can instead carry per-language
fields: the theme reads `<field>_<language>`, then `<field>_<base language>`,
then `<field>`, with `-` in the language tag written as `_`. A page in `zh-cn`
therefore reads `title_zh_cn`, then `title_zh`, then `title`. CamelCase
suffixes are not recognized.

Section text is site data and does not go through the theme's interface
strings; only the theme's own controls, such as the marquee's pause button and
pricing states, are translated by the theme. For the rest of a multilingual
setup, see [Languages](/docs/customize/i18n/).

No section fetches anything in the browser: prices, star counts, screenshots,
avatars and download states must all be in the repository when Hugo runs. The
same holds for the two navbar facts you can set in `hugo.yml`:

```yaml {title="hugo.yml"}
params:
  ui:
    github_stars: 2189            # shown on the GitHub link; never fetched from GitHub
    alt_site: { label: 中文站, url: 'https://example.cn/' }  # sister-site link on a single-language site
```

The footer has its own data, `data/footer/<language>.yaml` or `data/footer.yaml`
on a single-language site; see [Navigation and menus](/docs/customize/navigation/#footer).
A `footer` key left in `data/home/<language>.yaml` is ignored with a warning
that names the new location.

## Output {#outputs}

- **HTML:** every section rendered on the server, plus `landing.js`, loaded only when needed, for reveal effects, counters, copy buttons and light/dark image switching.
- **Print:** the content, with moving parts such as the marquee laid out as a static grid and controls removed.
- **Markdown:** titles, prose, lists, tables and code, without component classes.
- **RSS:** no landing sections.

Without JavaScript, or if `landing.js` fails to load, every section is still
visible: metrics already show their final formatted value, prefix and suffix,
and the marquee's pause control works without script. Readers who ask for
reduced motion get no movement or reveal effects.

## Verify {#verify}

1. Run `hugo --printPathWarnings`. Misspelled types, missing data keys and a
   page with both `landing` and `sections` are reported here.
2. Open the home page and each landing page in every language, and compare the
   sections with their data files.
3. Reload with JavaScript disabled; the content stays, only the motion goes.
4. Switch between light and dark mode and check that `image.light` and
   `image.dark` each appear in the right one.
5. On a site deployed under a subpath, check that internal links and images
   carry the prefix.

## Related {#related}

- [Brand and appearance](/docs/customize/brand/) — site name, logo, colors and fonts
- [Navigation and menus](/docs/customize/navigation/) — navbar, footer and the language menu
- [Releases and downloads](/docs/write/releases/) — the data behind the `download` section
- [Languages](/docs/customize/i18n/) — enabling languages and splitting data by language
- [Configuration](/docs/customize/config/) — `params.ui.landing_search`, `github_stars`, `alt_site` and the rest
