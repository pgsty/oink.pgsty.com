---
title: Home and landing pages
linkTitle: Home and landing pages
description: Assemble a home page from one local YAML file — hero, cards, capability panels, timeline, pricing, case studies, downloads. Any page can become a landing page with the same sections.
weight: 30
search_keywords: [home page, landing page, landing, hero, sections, data/home, data/landing, product page]
aliases:
  - /docs/scenarios/landing/
---

The home page is not a template but a data file: the `sections` list in
`data/home/<language>.yaml` decides which sections the page has from top to
bottom, and each section's content is looked up by name in the same file. An
ordinary page with `layout: landing` uses the same sections.

Every section is rendered on the server. Prices, star counts, screenshots,
avatars and download states all have to exist in the repository before Hugo
starts; no section fetches data in the browser.

A site migrating from Docsy's `blocks/*` home page has to rewrite it: the theme
has no `blocks/cover`, `blocks/section` or `blocks/feature` shortcodes, and
keeping them fails the build with
`template for shortcode "blocks/cover" not found`. The two ways forward are the
`data/home/<language>.yaml` described here, or `layout: landing` on an ordinary
page.

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

The file has only two levels: a `sections` list, and the same-named keys that
list references.

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

That is how this site's home page is written; the complete file is
`data/home/en.yaml` in the repository.

## A minimal working home page {#minimal}

Paste the following, replace the text and links, and it publishes. Write
internal links as site paths without a leading slash, and the theme adds the
current language prefix (`docs/start/` → `/docs/start/`).

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
      desc: HTML, print, Markdown and RSS from one source, losing nothing.
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

The hero is the first screen, and the only section with a large title and an
illustration.

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

Without `title_lines` it uses `title`, and without either the site title. The
image is a CSS background: with an `alt` the container carries `role="img"`, and
without one it is hidden from assistive technology.

`align: center` gives a text-only centred first screen: the text block widens
and centres, the title balances its line breaks, and `note` moves below the
buttons. When an image is present too, ordinary preview warns and falls back to
`start` so the image is preserved; a strict publishing build rejects the warning.

## The section registry {#registry}

There are 22 section types, named with hyphens (underscores in older data are
normalized). Apart from the hero, each shares the three heading fields
`eyebrow` / `title` / `desc` (or `text`) plus a `class`.

| Type | What it holds |
| --- | --- |
| `hero` | The first screen: large title, buttons, a theme-following image |
| `metrics` | Numeric facts, with optional count animation and source links |
| `capabilities` | Alternating left-right capability narratives with a dedicated visual panel |
| `principles` | Numbered product principles |
| `cards` | A general card set: features, scenarios, entry points |
| `logo-wall` | Tools and partners, as a grid or a pure-CSS marquee |
| `gallery` | A wall of screenshots |
| `testimonials` | Quotations with attribution |
| `contributors` | People, roles, avatars and links |
| `faq` | Questions and answers, collapsible or flat |
| `markdown` | A stretch of free Markdown |
| `cta` | The closing call to action |
| `pricing` | Pricing tier cards |
| `pricing-compare` | A tier-by-feature comparison matrix |
| `command-box` | One copyable command |
| `steps` | An ordered procedure, optionally with commands |
| `timeline` | Dated milestones |
| `code-plate` | Code inside a presentation panel |
| `preview` | A stretch of Markdown source beside what it renders as |
| `case-study` | A case: metrics plus a quotation plus a source |
| `download` | One or more `data/download/` records |
| `bar-chart` | Numeric comparison without any chart JS |

A misspelled type does not silently disappear: the build emits an
`unknown section type` warning and skips the section. Adding
`--panicOnWarning` in CI turns that into a build failure.

## The commonest sections, minimally {#section-examples}

Cards and capability panels are the two used most. `cards` controls its column
count with `columns`:

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

`capabilities` is one capability per screen with a structured visual panel on
the right, and `visual.type` must be one of `shell`, `components`, `code`,
`image` or `card`:

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
> fixture [`tests/site/data/landing/demo/en.yaml`](https://github.com/pgsty/oink/blob/main/tests/site/data/landing/demo/en.yaml),
> and the field names can be copied.
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

The `download` section consumes exactly the `data/download/<key>.yaml` from
[Releases and downloads](/docs/write/releases/), introducing no second version
model.

## Turning any page into a landing page {#landing-page}

Two lines of front matter make an ordinary content page a landing page: a
full-width canvas that keeps the navbar, the command palette and the footer, and
drops the sidebar and the outline.

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

A non-home landing page looks for its data in this order. When nothing is
found, ordinary preview warns and renders the landing shell with no sections;
a strict publishing build rejects the warning:

1. `sections` in the page's front matter;
2. `data/landing/<key>/<exact language>.yaml`;
3. The exact-language entry inside a single `data/landing/<key>.yaml`;
4. The English or language-less record.

Small amounts of data can go in front matter, but `landing:` and `sections:` are
**mutually exclusive**:

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
  - type: download
    data: { title: Download, keys: [prd5] }
  - cta
---
```

## Writing a section entry {#entry}
Each item in `sections` is either a type-name string or a map:

| Key | What it does |
| --- | --- |
| `type` | The section type; omitted, `key` is used as the type |
| `key` | Which key to read data from, defaulting to the same name as `type`; use it to distinguish two uses of one section |
| `data` | Inline data, so no top-level key is looked up |
| `id` | The section's anchor ID, generated from `key` / `type` by default |
| `enabled: false` | Disables the section while keeping its data |
| `partial` | Swaps in the site's own partial. A local template convention, not portable landing data |

## Languages and local facts {#i18n}

Narrative text belongs in per-language files (`zh.yaml` / `en.yaml`). A shared
record of facts can also fall back field by field: `<field>_<exact language>` →
`<field>_<base language>` → `<field>`, with `-` in a language tag normalized to
`_`. A Chinese site resolves `title_zh_cn`, then `title_zh`, then `title`.
camelCase suffixes are not accepted.

Display text inside a section is site data, not the theme's i18n strings. Only
the theme's own controls — marquee pause, pricing states — use translation keys.
Configuring a multilingual site as a whole is in
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

The footer is not home page data: it reads `data/footer/<language>.yaml` (or
`data/footer.yaml` on a single-language site), and this site has one per
language. A leftover `footer` key in `data/home/<language>.yaml` warns and is
ignored in ordinary preview; `--panicOnWarning` rejects it while naming the new
location. How to write it is in
[Navigation and menus](/docs/customize/navigation/).

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | The full static section content, plus `landing.js` loaded on demand for reveal, counting, copying and theme image switching |
| Print | Content kept; dynamic surfaces such as the marquee become a static grid, and controls are removed |
| Markdown | Titles, prose, lists, tables and code, with no component classes |
| RSS | Landing sections are not emitted |

With JavaScript disabled the server-rendered document is still complete. The
marquee's duplicate track stays out of the accessibility tree, and pausing uses a
checkbox that needs no JavaScript; with the reader's reduced-motion preference
on, movement and reveal are switched off.

## Verify {#verify}

1. The build is warning-free: `hugo --printPathWarnings --panicOnWarning`. A misspelled type, a missing data key, and `landing` alongside `sections` all surface here.
2. Open the home page and any landing page, compare each section against the data file, and look at every language.
3. Reload with JavaScript disabled: the content is still there, only without motion.
4. Look at both light and dark, confirming `image.light` and `image.dark` are each correct.
5. When deploying to a subpath, confirm internal links and images all carry the prefix.

## Related {#related}

- [Brand and appearance](/docs/customize/brand/) — site name, logo, colours and fonts
- [Navigation and menus](/docs/customize/navigation/) — navbar, footer and the language menu
- [Releases and downloads](/docs/write/releases/) — the data behind the `download` section
- [Languages](/docs/customize/i18n/) — enabling languages and splitting data by language
- [Configuration](/docs/customize/config/) — full definitions of `params.ui.landing_search` and the rest
