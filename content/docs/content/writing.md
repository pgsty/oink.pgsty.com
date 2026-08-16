---
title: Hugo authoring tips
weight: 40
description: Avoid common pitfalls when writing content for an Oink site.
aliases: [/docs/best-practices/site-guidance/, /docs/tutorial/writing-guide/]
---

Oink is a Hugo theme, so ordinary Markdown and Hugo's content model remain the
authoring foundation. These conventions keep pages readable in source form and
stable after translation, reorganization, or subpath deployment.

## Link to published routes {#link-to-published-routes}

Link readers to the canonical published URL, not to a neighboring source-file
path. Root-relative links such as `/docs/content/` are easy to audit across the
site. When a link should follow a page through source moves, Hugo's `ref` and
`relref` shortcodes can resolve the target page:

```markdown
[Site configuration]({{</* ref "/docs/configure/overview" */>}})
```

After moving a page, add an alias for the old public route and update every
internal link to the new canonical route. Do not rely on the alias as the site's
permanent navigation path. See [Adding content](/docs/content/writing/#links)
for link and image behavior.

## Keep front matter useful {#keep-front-matter-useful}

Every navigable page needs a clear `title`, concise `description`, intentional
`weight`, and suitable Font Awesome `icon`. Keep descriptions to one sentence
that fits on one line in a normal desktop content card. Add `linkTitle` only
when the navigation label genuinely needs to differ from the page title.

English is the primary source language. Add the Simplified Chinese peer beside
it as `.zh.md`, and translate reader-facing metadata as carefully as the body.

## Preserve stable headings {#preserve-stable-headings}

Use explicit heading IDs when pages are translated or widely linked:

```markdown
## Failure recovery {#failure-recovery}
```

Copy the same ID to the corresponding Chinese heading. When renaming a heading,
preserve an established ID unless its meaning also changes.

## Write procedures as tasks {#write-procedures-as-tasks}

State prerequisites before commands, use imperative steps, and show the expected
result or verification command. Separate local preview, production build, hosted
deployment, and public release evidence; success at one layer does not establish
the next.

## Make code examples actionable {#make-code-examples-actionable}

Name a block when it represents a real file, use `console` for a transcript with
prompts and output, and collapse long reference listings that readers do not
need to scan before continuing. Use a Code Group only when panels are
interchangeable ways to complete the same task.

```yaml {title="hugo.yaml" hl_lines="3"}
params:
  offlineSearch: true
  print:
    disable_toc: false
```

Metadata should clarify an example, not decorate every fence. See
[Code blocks and tabs](/docs/components/code-blocks/) for titles, Copy policies,
wrapping, collapse, line links, and synchronized alternatives.

## Alerts {#alerts}

OINK supports GitHub-style blockquote alerts and optional Obsidian-style titles:

```markdown
> [!TIP]
>
> Run the translation audit before every release.

> [!WARNING] Stable anchors required
>
> A translated heading must keep the English page's rendered ID.
```

Supported types are `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`, `SUCCESS`,
`DANGER`, `QUESTION`, `EXAMPLE`, `QUOTE`, and the neutral `DETAILS` disclosure;
a `-` or `+` after the type folds the callout. Use alerts sparingly: important
instructions must still make sense to screen readers and in print. See
[Callouts](/docs/components/layout/#callouts) for the complete reference and
[Alerts](/docs/appearance/styling/#alerts) for appearance.

## Links {#links}

Use root-relative links for stable public routes and ordinary relative links for
nearby pages or bundle resources. Hugo's `ref` and `relref` shortcodes validate
content references and account for language and permalink rules:

```markdown
[Configuration]({{</* ref "/docs/about/configuration" */>}})
```

For bilingual pages:

- link to the logical page, not directly to a `.zh.md` filename;
- keep fragment IDs language-neutral;
- verify that both language variants resolve the same fragment;
- use `relref` when the destination must remain relative to the current host.

Run the internal-link check after changing routes or headings.

## Content style {#content-style}

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

## Adding docs, blog posts, and release notes

Create every maintained English page and its Chinese peer in the same directory:

```text
guide.md
guide.zh.md
```

For bundle pages, pair `index.md` with `index.zh.md`. Keep routing metadata,
dates, weights, aliases, and resource declarations aligned unless a
language-specific difference is intentional.

## Organizing your documentation

Use directories to reflect the reader's information architecture, not the
implementation's package tree. Each documentation subsection needs an
`_index.md` and an `_index.zh.md`. Child pages appear in the sidebar ordered by
`weight`, then by the configured fallback ordering.

Prefer a shallow hierarchy. Split a page when it serves a distinct task or
audience; do not split merely to shorten a file. See
[Organizing Your Content](/docs/content/organize/).

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

## Organizing blog posts and release notes

Separate posts by publisher and audience. Keep every upstream Docsy article,
including Docsy release reports, flat under `blog/docsy/`. Keep OINK-specific
articles flat under `blog/oink/`, and reserve `blog/release/` for versioned OINK
release notes. Do not add year subdirectories; pair each article in place:

```text
content/blog/
├── docsy/
│   ├── 0.16.0.md
│   ├── 0.16.0.zh.md
│   ├── hugo-upgrade.md
│   └── hugo-upgrade.zh.md
├── oink/
│   ├── implementation-diary.md
│   └── implementation-diary.zh.md
└── release/
    ├── 0.1.0.md
    └── 0.1.0.zh.md
```

A Docsy release note normally supplies a publisher-qualified `linkTitle`:

```yaml
---
title: Release 0.16.0 report and upgrade guide
linkTitle: Docsy 0.16.0 release
date: 2026-07-29
tags: [release, upgrade]
---
```

Prefix link titles for other Docsy articles with `Docsy` as well, so mixed
sidebar and list views make ownership clear.

Keep the publication date and author identity consistent across translations.
Translate the title, description, taxonomy labels, caption text, and body. Do
not translate commit IDs, release tags, commands, or URLs.

## Working with top-level landing pages

Default-layout pages are suitable for the home page, product overview, and other
destinations that do not need the docs sidebar.

## Customizing the example site pages

The bundled home page is `content/_index.md` with `content/_index.zh.md` as its
translation. It uses the same local assets and theme pipeline as the rest of
OINK. Change content and project assets in the site; do not edit vendored
runtime files merely to alter branding.

## Building your own landing pages

Compose landing pages with `layout: landing` and the reusable sections described
in [Landing pages](/docs/scenarios/landing/); the Docsy `blocks/*` shortcodes
are [no longer available](/docs/components/layout/#blocks). Keep essential
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

## Review rendered states {#review-rendered-states}

Build both languages and inspect representative pages on desktop and mobile, in
light and dark modes. Verify headings, fragments, code, tables, alerts,
navigation, search, print output, and page descriptions in the rendered site.
