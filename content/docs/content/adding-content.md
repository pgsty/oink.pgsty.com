---
downstream_modified: true
title: Adding Content
description:
  Structure and author bilingual documentation and blog content in OINK.
---

OINK uses Hugo's content model: Markdown carries the information, front matter
carries page metadata, and layouts turn both into a static site. This guide
describes the conventions used by the bundled English and Simplified Chinese
sample site.

## Content root directory

Site content lives below `content/`. A multilingual site can use separate roots
such as `content/en/` and `content/zh/`, or translated filename suffixes in one
mounted tree. This repository uses the second form:

```text
content/docs/content/
├── adding-content.md
└── adding-content.zh.md
```

The English file is the source page and the `.zh.md` file is its Simplified
Chinese translation. Both files share the same logical path after Hugo applies
the language suffix.

Keep generated files and files that must be copied byte-for-byte outside the
content tree. Put those in `static/` as described in
[Adding static content](#adding-static-content).

## Content sections and templates

Every top-level content directory is a Hugo section. OINK includes layouts for:

- `docs`: documentation with a section tree, table of contents, breadcrumbs,
  previous/next navigation, and repository links;
- `blog`: dated articles, taxonomy metadata, feeds, and chronological lists;
- `community`: project and contributor links;
- default pages: landing pages without the documentation sidebar.

Hugo chooses a layout from the content section. A page below `content/docs/`
therefore uses the `docs` layout. Set `type` in front matter only when a page
must use another section's layout.

### Custom sections

Create a directory below the content root, then give its pages a type when the
default layout is not sufficient:

```yaml
---
title: Architecture decisions
description: Accepted design decisions for the project.
type: docs
weight: 30
---
```

For section-wide behavior, put shared values in the section's `_index.md`
`cascade` rather than repeating them on every page. Add a project layout under
`layouts/` only when no existing OINK layout or partial is suitable.

## Doc-rooted sites <a id="alternative-site-structure"></a>

{{% _param BADGE EXPERIMENTAL info %}}

A documentation-first site can publish the `docs` section at the URL root while
keeping source files under `content/.../docs/`:

```yaml
permalinks:
  page:
    docs: /:sections[1:]/:slug/
  section:
    docs: /:sections[1:]
```

The docs section landing page then becomes the home page. Add this front matter
to the physical site-root index for each language so it can still act as a link
without competing for the same output path:

```yaml
build: { render: link }
```

### Check for path conflicts

Docs now share the URL root with blog, community, and other sections. Build with
`--printPathWarnings` and resolve every duplicate target before publishing:

```bash
hugo --printPathWarnings
```

### Legacy _docs-only_ setup

Older Docsy examples used a front matter cascade to force page types. Remove
that workaround when moving to the permalink-based doc-rooted setup; otherwise
the home page and section layouts can resolve inconsistently.

## Page front matter

Front matter is page metadata written in YAML, TOML, or JSON. OINK's sample site
uses YAML:

```yaml
---
title: Local-first architecture
linkTitle: Local-first
description: How OINK removes browser and build-time CDN dependencies.
weight: 20
date: 2026-08-08
tags: [architecture, offline]
---
```

`title` is the practical minimum. In maintained documentation, also provide a
concise `description` for search and metadata, and a `weight` when order
matters. Use `linkTitle` only when navigation needs a shorter label.

Translations should localize human-facing metadata while preserving structural
values:

```yaml
---
title: 本地优先架构
linkTitle: 本地优先
description: OINK 如何消除浏览器端与构建期的 CDN 依赖。
weight: 20
date: 2026-08-08
tags: [架构, 离线]
---
```

Do not translate keys, shortcode names, configuration keys, file paths, or
stable identifiers.

### Footer metadata

Docs and blog pages render a compact metadata block above the site footer. The
last-modified date comes from Hugo's `.Lastmod` value. Two optional front matter
fields add provenance notices:

```yaml
lastmod: 2026-08-09
upstream_attribution: https://upstream.example/docs/page/
downstream_modified: true
```

`upstream_attribution` links to the upstream source and its attribution.
`downstream_modified: true` states that the downstream project changed the page.
Omit either field when its notice does not apply.

## Page content

Write pages in Markdown unless a layout genuinely requires HTML. Hugo renders
Markdown with Goldmark and supports attributes, footnotes, tables, task lists,
render hooks, and fenced code blocks.

### Markdown

Keep source readable without the rendered site:

- use ATX headings (`## Heading`);
- put blank lines around lists, blocks, and fenced code;
- specify the language of every code fence when one exists;
- use descriptive link text and image alternative text;
- wrap prose at a review-friendly width, but never reflow code or URLs.

OINK adds render hooks for blockquote alerts and for Mermaid, math, chemistry,
Markmap, and PlantUML code blocks. See
[Diagrams and Formulae](/docs/content/diagrams-and-formulae/).

### Markup, shortcodes, and content features {#markup-and-content-features}

Use standard Markdown for ordinary prose. Use a
[shortcode](/docs/content/shortcodes/) when it supplies meaningful behavior such
as tabs, cards, a terminal recording, an API viewer, or a safe chart. Shortcodes
are part of the content contract: verify their arguments in both languages and
avoid copying rendered HTML into translations.

### Alerts

OINK supports GitHub-style blockquote alerts and optional Obsidian-style titles:

```markdown
> [!TIP]
>
> Run the translation audit before every release.

> [!WARNING] Stable anchors required
>
> A translated heading must keep the English page's rendered ID.
```

Supported semantic types include `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and
`CAUTION`, plus the Bootstrap-compatible types and `NB`. Use alerts sparingly:
important instructions must still make sense to screen readers and in print. See
[Alerts](/docs/content/lookandfeel/#alerts) for appearance.

### Links

Use root-relative links for stable public routes and ordinary relative links for
nearby pages or bundle resources. Hugo's `ref` and `relref` shortcodes validate
content references and account for language and permalink rules:

```markdown
[Configuration]({{</* ref "/docs/oink/configuration" */>}})
```

For bilingual pages:

- link to the logical page, not directly to a `.zh.md` filename;
- keep fragment IDs language-neutral;
- verify that both language variants resolve the same fragment;
- use `relref` when the destination must remain relative to the current host.

Run the internal-link check after changing routes or headings.

### Content style

Write task-oriented documentation in direct language. Introduce a concept before
its configuration, state defaults explicitly, and distinguish local build
verification from deployment or publication. The Chinese edition follows the
terminology and typography rules in `oink.pgsty.com/TRANSLATION.md`.

## Page bundles

A standalone page is a single Markdown file. A leaf bundle is a directory with
an `index.md` and page resources:

```text
content/docs/tutorial/
├── index.md
├── index.zh.md
├── architecture.svg
└── example.yaml
```

Both language pages can use the same image and downloadable file. Hugo normally
shares page resources across language variants on a single host, so do not
duplicate identical binary assets. Localize an image only when it contains
meaningful text; give the localized resource a clear language suffix.

Use branch bundles (`_index.md`) for sections that contain child pages and leaf
bundles (`index.md`) for terminal pages with resources.

## Adding docs and blog posts

Create every maintained English page and its Chinese peer in the same directory:

```text
guide.md
guide.zh.md
```

For bundle pages, pair `index.md` with `index.zh.md`. Keep routing metadata,
dates, weights, aliases, and resource declarations aligned unless a
language-specific difference is intentional.

### Organizing your documentation

Use directories to reflect the reader's information architecture, not the
implementation's package tree. Each documentation subsection needs an
`_index.md` and an `_index.zh.md`. Child pages appear in the sidebar ordered by
`weight`, then by the configured fallback ordering.

Prefer a shallow hierarchy. Split a page when it serves a distinct task or
audience; do not split merely to shorten a file. See
[Organizing Your Content](/docs/best-practices/organizing-content/).

#### Docs section landing pages

A docs `_index.md` renders child-page summaries by default. Use:

```yaml
simple_list: true
```

to render a compact list, or:

```yaml
no_list: true
```

to suppress the generated list. Give each language variant a localized title and
description, and keep the structural option identical.

### Organizing your blog posts

Blog posts can live directly below `blog/` or in year/category directories. OINK
uses dated directories and pairs each article:

```text
blog/2026/
├── oink-release.md
└── oink-release.zh.md
```

A post normally supplies:

```yaml
---
title: OINK 1.0
description: A local-first Docsy distribution.
date: 2026-08-08
author: OINK maintainers
tags: [release]
---
```

Keep the publication date and author identity consistent across translations.
Translate the title, description, taxonomy labels, caption text, and body. Do
not translate commit IDs, release tags, commands, or URLs.

## Working with top-level landing pages

Default-layout pages are suitable for the home page, product overview, and other
destinations that do not need the docs sidebar.

### Customizing the example site pages

The bundled home page is `content/_index.md` with `content/_index.zh.md` as its
translation. It uses the same local assets and theme pipeline as the rest of
OINK. Change content and project assets in the site; do not edit vendored
runtime files merely to alter branding.

### Building your own landing pages

Compose landing pages from standard Markdown and
[`blocks/*` shortcodes](/docs/content/shortcodes/#blocks). Keep essential
information in text, make call-to-action links meaningful, and test the page at
mobile and desktop widths in both languages.

## Adding a community page

Create `community/_index.md` and `community/_index.zh.md`. The community layout
uses `params.links.user` and `params.links.developer`:

```yaml
params:
  links:
    user:
      - name: User forum
        url: https://community.example.org/
        icon: fa-solid fa-comments
        desc: Ask questions and share solutions
    developer:
      - name: GitHub
        url: https://github.com/pgsty/oink
        icon: fa-brands fa-github
        desc: Source, issues, and pull requests
```

Entries may set `rel`; OINK also adds `noopener` to external HTTP links where
appropriate. Set `params.contributingUrl` in the community page front matter if
the contribution guide is not at the conventional docs route.

## Adding static content

Files below `static/` are copied to the published root without Markdown
rendering or fingerprinting:

```text
static/reference/api/index.html
```

is published as `/reference/api/index.html`. Use this for externally generated
reference sites, verification files, and downloads that require stable names.
Prefer page resources or Hugo Pipes for assets that need resizing,
fingerprinting, or bundle-relative lookup.

OINK's browser runtime is intentionally shipped from the theme or site itself.
When adding a library, vendor and pin it, record it in `theme/VENDOR.json`, and
do not introduce an implicit CDN fallback.

## RSS feeds

Hugo creates feeds for the home page and list sections. Disable them globally
only when the site has no feed consumers:

```yaml
disableKinds: [RSS]
```

If a section declares custom outputs, retain RSS explicitly:

```yaml
outputs:
  section: [HTML, RSS, print]
```

Check the generated language-specific feed URLs and ensure titles, summaries,
dates, canonical URLs, and `hreflang` relationships are correct.

## Sitemap

Hugo generates `sitemap.xml` by default. Site-wide settings are:

```yaml
sitemap:
  changefreq: monthly
  filename: sitemap.xml
  priority: 0.5
```

A page can override these values:

```yaml
---
title: Release notes
sitemap:
  priority: 0.8
---
```

Treat `changefreq` and `priority` as hints, not promises. Exclude drafts,
private material, and noncanonical duplicates before deployment, then inspect
the generated sitemap for every published language.
