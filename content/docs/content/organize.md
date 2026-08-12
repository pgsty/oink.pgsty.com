---
title: Organize your content
weight: 30
description: Structure documentation around reader goals and content types.
aliases:
  [/docs/best-practices/organizing-content/, /docs/tutorial/organize-content/]
---

Oink derives the documentation sidebar from Hugo's content tree. The directory
structure is therefore part of the reader experience, not just a source-code
detail. Start with the questions readers need answered, then create the smallest
hierarchy that makes those answers easy to find.

## Start from reader goals {#start-from-reader-goals}

Give new readers a short path from product context to a successful first task.
Give returning readers direct routes to procedures, reference material, and
troubleshooting. A practical documentation set usually needs:

- an overview that establishes scope and product boundaries;
- a get-started path that produces a working result;
- task-oriented guides for common jobs;
- reference pages for parameters, APIs, and compatibility;
- troubleshooting for predictable failure modes.

Examples are useful when readers can copy or compare them, but they should not
replace the procedure or reference that explains the behavior.

## Use predictable content types {#use-predictable-content-types}

Keep pages focused on one reader intent:

| Content type    | Reader question                               |
| --------------- | --------------------------------------------- |
| Overview        | What is this, and when should I use it?       |
| Tutorial        | How do I reach a first working result?        |
| How-to guide    | How do I complete one specific task?          |
| Reference       | What fields, commands, or interfaces exist?   |
| Explanation     | Why does the system behave this way?          |
| Troubleshooting | How do I diagnose and recover from a failure? |

Do not create an empty top-level section merely to mirror an organization chart.
Add a section when several pages share a stable reader purpose.

## Keep the hierarchy shallow {#keep-the-hierarchy-shallow}

Prefer a short, explicit route over a deep classification tree. Use page weights
to establish a learning sequence, and keep related page weights spaced
consistently so new pages can be inserted without renumbering the entire
section. Add an icon and concise description to every navigable page so the
sidebar and section indexes remain scannable.

See [Adding content](/docs/content/writing/#organizing-your-documentation) for
Hugo's bundle and section model, and
[Navigation and menus](/docs/configure/navigation/) for sidebar behavior.

## Plan languages together {#plan-languages-together}

Create the English source and Simplified Chinese peer in the same directory.
Keep page order, intent, examples, and stable heading IDs aligned. If the two
languages need different prose lengths, preserve the same information rather
than forcing sentence-for-sentence symmetry.

## Review the complete route {#review-the-complete-route}

After moving or adding pages, review the documentation landing page, section
index, sidebar, breadcrumbs, previous/next navigation, local search, and every
homepage link. Build both languages and validate rendered fragment links before
publishing.

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
When adding a library, vendor and pin it, record it in `VENDOR.json`, and do not
introduce an implicit CDN fallback.

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
