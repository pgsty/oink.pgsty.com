---
title: Home and landing pages
linkTitle: Home and landing pages
description: Build a home page from one local YAML file. Add hero, cards, capability panels, timeline, pricing, case studies, and downloads. Reuse these sections on landing pages.
weight: 30
search_keywords: [home page, landing page, landing, hero, sections, data/home, data/landing, product page]
aliases:
  - /docs/scenarios/landing/
---

Configure home page content in a data file. The `sections` list in
`data/home/<language>.yaml` sets the sections and their order from top to bottom.
The theme finds each section's content by name in the same file. An ordinary
page with `layout: landing` uses the same sections.

Hugo renders every section on the server. Prices, star counts, screenshots,
avatars, and download states must exist in the repository before Hugo starts.
No section fetches data in the browser.

If you migrate a Docsy `blocks/*` home page, you must rewrite it. OINK has no
`blocks/cover`, `blocks/section`, or `blocks/feature` shortcodes. If you retain
them, the build fails with `template for shortcode "blocks/cover" not found`.
Use the `data/home/<language>.yaml` file described here, or set
`layout: landing` on an ordinary page.

## Where the home page's data lives {#home-data}
The home page's content file keeps only a title and a description:

```yaml {title="content/_index.md"}
---
title: OINK
description: A local-first, Hugo-only theme for technical documentation
---
```

Section data is a file per language:

```filetree {title="home page data"}
- data/
  - home/
    - en.yaml            # English home page
    - zh.yaml            # Chinese home page
```

The lookup order is `data/home/<current language>.yaml` → `data/home/en.yaml` →
`data/home.yaml` for a single-language site.

The file has two levels: a `sections` list and the named keys that the list
references.

```yaml {title="the skeleton of data/home/en.yaml"}
sections:
  - hero          # uses the hero: key
  - capabilities
  - type: cards   # uses the cards section, reading the release: key
    key: release
  - cta

hero: { … }
capabilities: { … }
release: { … }
cta: { … }
```

This site uses that structure for its home page. The complete file is
`data/home/en.yaml` in the repository.

## A minimal working home page {#minimal}

Create the data file below. Replace the text and links with your own content.
Put the two hero images in `static/images/hero-light.webp` and
`static/images/hero-dark.webp`. For a text-only opening, omit the entire
`hero.image` block. Write internal links as site paths without a leading slash.
The theme adds the current language prefix (`docs/start/` → `/docs/start/`).

```yaml {title="data/home/en.yaml"}
sections:
  - hero
  - cards
  - cta

hero:
  eyebrow: Local-first · Hugo only
  title_lines:
    - words:
        - { text: PGSTY OINK }
  lead: Components are written in Markdown, assets ship with the theme, and one source produces four outputs.
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp
    alt: OINK engineering documentation illustration
  actions:
    - { label: Quick start, url: docs/start/, icon: fa-solid fa-rocket, style: primary }
    - { label: See the components, url: docs/components/, style: ghost }

cards:
  eyebrow: What it does
  title: Everything engineering documentation needs
  columns: 3
  items:
    - title: Markdown-native components
      desc: Callouts, tabs, field lists and file trees are all part of Markdown syntax.
      icon: fa-solid fa-cubes
      url: docs/components/
    - title: Four outputs
      desc: HTML, print, Markdown and RSS share one source; interactive components use static or source fallbacks.
      icon: fa-solid fa-file-export
      url: docs/customize/agents/
    - title: Local-first
      desc: Fonts, icons, search and diagram runtimes all ship with the theme; no CDN.
      icon: fa-solid fa-plug-circle-xmark
      url: docs/about/features/

cta:
  title: Start from a bilingual site that already works.
  text: Start from OINK Starter, replace the project identity and content, then publish.
  label: Get started
  url: docs/start/
  style: primary
```

## Hero {#hero}

The hero is the first screen. It is the only section with a large title and
an illustration.

```yaml {title="data/home/en.yaml"}
hero:
  eyebrow: PROJECT 1.0 · Local-first       # small text above the title, with a status dot
  title_lines:                             # the large title, controlled line by line
    - words:
        - { text: PGSTY OINK }
  lead: One sentence saying what this is.  # inline Markdown and <br> allowed
  note: No Node.js required                # a supplementary line with an icon
  note_icon: fa-solid fa-circle-check
  title_size: 4.25rem                      # rem / em / px only
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp            # with only one, both modes share it
    alt: First-screen illustration
  media:
    ratio: '1fr 240px'                     # column widths for text and image
    max_width: 240px
    hide_below: md                         # hide the image below sm | md | lg | xl
  actions:
    - { label: Get started, url: docs/start/, icon: fa-solid fa-rocket, style: primary }
    - { label: GitHub, url: 'https://github.com/pgsty/oink', external: true, style: ghost }
  detail: { label: See what it looks like, url: docs/about/showcase/ }
```

If `title_lines` is absent, the hero uses `title`. If both are absent, it uses
the site title. The image is a CSS background. If `alt` is present, its
container has `role="img"`. Otherwise, the image is hidden from assistive technology.

The setting `align: center` creates a text-only centered first screen. It widens
and centers the text block, balances title line breaks, and moves `note` below
the buttons. If an image is also present, the theme warns and falls back
to `start` so the image is preserved.

## The section registry {#registry}

There are 22 section types. Their names use hyphens. The theme normalizes
underscores in older data. Except for the hero, each type has three heading
fields, `eyebrow` / `title` / `desc` (or `text`), and a `class`.

| Type | What it holds |
| --- | --- |
| `hero` | The first screen: large title, buttons, a theme-following image |
| `metrics` | Numeric facts, with optional count animation and source links |
| `capabilities` | Alternating left-right capability descriptions with a dedicated visual panel |
| `principles` | Numbered product principles |
| `cards` | A general card set: features, scenarios, entry points |
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
| `case-study` | A case: metrics plus a quotation plus a source |
| `download` | One or more `data/download/` records |
| `bar-chart` | Numeric comparison without chart JavaScript |

If a type is misspelled, the build emits an `unknown section type` warning
and skips the section.

## The commonest sections, minimally {#section-examples}

Cards and capability panels are the most common sections. The `cards` section
sets its column count with `columns`:

```yaml {title="data/home/en.yaml"}
cards:
  title: Use cases
  columns: 4
  link_label: Learn more
  items:
    - title: Book publishing
      meta: Long form
      icon: fa-solid fa-book-open
      desc: Numbered figures and examples, cross-references, indexes and whole-book print.
      url: docs/write/book/
```

The `capabilities` section shows one capability per screen with a structured
visual panel on the right. The `visual.type` must be `shell`, `components`,
`code`, `image`, or `card`:

```yaml {title="data/home/en.yaml"}
capabilities:
  eyebrow: Value
  title: What engineering documentation needs, out of the box
  items:
    - ref: 01 / Engineering docs
      title: Built for engineers and their documentation sites
      url: docs/start/
      motto: No extra friction from the first build to long-term maintenance
      bullets:
        - 'A [deployment](docs/admin/deploy/) experience that works out of the box'
        - 'Built-in [search](docs/customize/search/) and [languages](docs/customize/i18n/)'
      value: Content teams spend their time on documentation rather than rebuilding a site.
      visual:
        type: code
        title: build.sh
        lines:
          - { class: c, prefix: '# ', text: One command, one deterministic output }
          - { class: p, prefix: '$ ', text: hugo --gc --minify }
          - { class: ok, prefix: '✓ ', text: public/ is ready to deploy }
```

> [!DETAILS] Minimal YAML for the other ten scenario sections
> These fragments come from the theme repository's executable regression
> fixture [`tests/site/data/landing/demo/en.yaml`](https://github.com/pgsty/oink/blob/main/tests/site/data/landing/demo/en.yaml).
> You can copy the field names.
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

The `download` section uses the same `data/download/<key>.yaml` record described
in [Releases and downloads](/docs/write/releases/). It introduces no second
version model.

## Turning any page into a landing page {#landing-page}

Two front matter lines convert an ordinary content page to a landing page.
This full-width canvas retains the navbar, command palette, and footer. It
removes the sidebar and outline.

```yaml {title="content/pricing.md"}
---
title: Pricing
layout: landing
landing: pricing
---
```

The data lives in a directory parallel to the home page's, likewise split by
language:

```filetree {title="landing page data"}
- data/
  - landing/
    - pricing/
      - en.yaml
      - zh.yaml
```

A non-home landing page searches for data in this order. If it finds no data,
the theme warns and renders the landing shell without sections:

1. `sections` in the page's front matter;
2. `data/landing/<key>/<exact language>.yaml`;
3. The exact-language entry inside a single `data/landing/<key>.yaml`;
4. The English or language-less record.

You can put small amounts of data in front matter. However, `landing:` and
`sections:` are **mutually exclusive**:

```yaml {title="content/pricing.md"}
---
title: Pricing
layout: landing
sections:
  - type: hero
    data:
      title: Publish a product page with Hugo alone
      actions:
        - { label: Read the docs, url: docs/, style: primary }
  - type: cta
    data:
      title: Ready to start?
      label: Read the docs
      url: docs/
---
```

## Writing a section entry {#entry}
Each item in `sections` is either a type-name string or a map:

| Key | What it does |
| --- | --- |
| `type` | The section type. If omitted, uses `key` as the type |
| `key` | The key that supplies data. Defaults to the name in `type`. Use it to distinguish two instances of one section |
| `data` | Inline data. No top-level key lookup is needed |
| `id` | The section's anchor ID, generated from `key` / `type` by default |
| `enabled: false` | Disables the section while keeping its data |
| `partial` | Uses the site's own partial. This is a local template convention, not portable landing data |

## Languages and local facts {#i18n}

Put descriptive text in per-language files (`zh.yaml` / `en.yaml`). A shared
fact record can also use per-field fallback: `<field>_<exact language>` →
`<field>_<base language>` → `<field>`. The theme normalizes `-` in a language
tag to `_`. A Chinese site resolves `title_zh_cn`, then `title_zh`, then
`title`. The theme does not accept camelCase suffixes.

Section display text belongs to site data. It does not use the theme's i18n
strings. Only theme controls, such as marquee pause and pricing states, use
translation keys. To configure the whole multilingual site, see
[Languages](/docs/customize/i18n/).

A few optional facts on the landing shell are local too, written in `hugo.yml`
and never fetched at runtime:

```yaml {title="hugo.yml"}
params:
  offline_search: true
  ui:
    landing_search: true          # boolean; the palette appears only if the site enabled offline_search
    github_stars: 2189            # a committed number, never a GitHub API request
    alt_site: { label: 中文站, url: 'https://example.cn/' }
```

The footer uses separate data in `data/footer/<language>.yaml`, or
`data/footer.yaml` for a single-language site. This site has one file per
language. If `data/home/<language>.yaml` still contains a `footer` key, the
theme warns, ignores it, and points to the new location. See
[Navigation and menus](/docs/customize/navigation/) for authoring instructions.

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | The full static section content, plus `landing.js` loaded on demand for reveal, counting, copying and theme image switching |
| Print | Retains content. Converts dynamic surfaces, such as the marquee, to a static grid. Removes controls |
| Markdown | Titles, prose, lists, tables and code, with no component classes |
| RSS | Landing sections are not emitted |

If JavaScript is disabled or `landing.js` is unavailable, all server-rendered
sections remain visible. Metrics include their configured number formatting,
prefix, and suffix. Count animations finish on the same display text.
The marquee's duplicate track stays outside the accessibility tree. Its pause
checkbox works without JavaScript. If the reader enables reduced motion,
movement and reveal are disabled.

## Verify {#verify}

1. Run `hugo --printPathWarnings`. This detects misspelled types, missing data keys, and simultaneous `landing` and `sections`.
2. Open the home page and any landing page. Compare sections with their data files. Check every language.
3. Reload with JavaScript disabled. Confirm that content remains visible without motion.
4. Check light and dark modes. Confirm that `image.light` and `image.dark` show the correct images.
5. For a subpath deployment, confirm that all internal links and images include the prefix.

## Related {#related}

- [Brand and appearance](/docs/customize/brand/) — site name, logo, colors, and fonts
- [Navigation and menus](/docs/customize/navigation/) — navbar, footer and the language menu
- [Releases and downloads](/docs/write/releases/) — the data behind the `download` section
- [Languages](/docs/customize/i18n/) — enabling languages and splitting data by language
- [Configuration](/docs/customize/config/) — full definitions of `params.ui.landing_search` and the rest
