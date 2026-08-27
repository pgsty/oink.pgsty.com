---
title: Writing pages
linkTitle: Writing pages
description: Creating a documentation page — where the file goes, what the front matter says, why heading anchors are written by hand, how links and images work, and what appears at the end of a page on its own.
weight: 10
search_keywords: [writing pages, front matter, heading ID, heading anchor, links, ref, relref, draft, Markdown]
aliases:
  - /docs/content/writing/
---

This page covers writing a documentation page end to end: where the file goes,
the front matter, heading anchors, links, images, drafts, and the page end. It
assumes the site already builds locally; if it does not yet, start with
[Quick start](/docs/start/).

## Creating a page {#new-page}

A page is a Markdown file under `content/`, and its URL follows its position
there: `content/docs/install.md` is published as `/docs/install/`. The Chinese
translation is a `.zh.md` file of the same name in the same directory, sharing
one logical path with the English page.

A page with no attached resources is a single file. When a page carries images,
cast files or example configuration, make it a directory instead, name the page
itself `index.md`, and put the resources beside it — Hugo calls this a
[page bundle](https://gohugo.io/content-management/page-bundles/):

```filetree {title="the two page shapes inside content/"}
- content/
  - docs/
    - _index.md                      # section index, English
    - _index.zh.md                   # section index, Chinese
    - install.md                     # single-file page → /docs/install/
    - install.zh.md                  # its Chinese translation
    - anatomy/                       # page bundle → /docs/anatomy/
      - index.md
      - index.zh.md
      - shell.webp                   # page resource, shared by both languages
```

`hugo new content docs/install.md` generates an empty file with front matter
from an archetype — see the [Hugo documentation](https://gohugo.io/commands/hugo_new_content/) —
and writing the file by hand works just as well.

> [!IMPORTANT]
> When a Chinese page has no English counterpart, Hugo does not hand it
> resources that carry no language suffix. In that case the resource filename
> needs the `.zh.` infix (`shell.zh.webp`) while the body still writes
> `shell.webp`.

## The front matter you need {#front-matter}
Between the two `---` lines at the top of the file is YAML front matter. Four
keys belong on every page:

```yaml {title="content/docs/install.md"}
---
title: Install Pigsty       # page heading, browser title, search result title
linkTitle: Install          # short name in the sidebar and breadcrumbs; falls back to title
description: Get a working PostgreSQL cluster onto a clean EL 9 machine.
weight: 20                  # ordering among siblings; use multiples of 10 to leave room
---
```

Let `description` say in one sentence what the page lets the reader accomplish.
It appears on the section index cards, in search results and on social cards.
`weight` decides the sidebar order, and only equal weights fall back to
alphabetical order.

The remaining keys are optional — icon, draft, search weight, comment switch,
page shell and so on. The full table is in
[Page parameters](/docs/write/frontmatter/).

## Heading levels and stable anchors {#headings}

Start sections at `##` in the body and leave `#` to `title`. The theme already
renders the page heading, so another `#` in the body produces two top-level
headings. The outline in the right column starts at `##`, and how deep it goes
is decided by Hugo's `markup.tableOfContents` — `####` on this site.

Write an explicit English anchor `{#id}` on every `##` and `###`:

```markdown {title="Source"}
## Prerequisites {#prerequisites}

### Disk and memory {#disk-and-memory}
```

There are two reasons:

- Cross-language alignment. Hugo derives an ID from the heading text, so a Chinese heading yields a Chinese ID: `/docs/install/#prerequisites` and `/zh/docs/install/#前提条件` point at the same semantic place through two different anchors, which no translation audit can compare. Give the translated heading the English page's ID and both sides share one fragment.
- Link stability. Heading text changes as wording is revised, and a public link should not break with it. An explicit ID is a public route once published; when a rename is needed, leave an empty anchor for the old ID:

```markdown {title="Source: leaving a target behind for the old anchor"}
## Getting started <a id="get-started"></a> {#quickstart}
```

Use lowercase English with hyphens, unique within the page. This site's
translation audit compares the heading IDs rendered by the English and Chinese
pages and fails on a mismatch.

## Writing links {#links}
Three forms, for different purposes:

| Form | Example | When to use it |
| --- | --- | --- |
| Absolute site path | `[Configuration](/docs/customize/config/)` | The default. It points at a published route, is easy to audit and replace site-wide, and survives source files moving |
| Relative path | `[another page](../organize/)`, `![diagram](shell.webp)` | Resources inside the same page bundle, or a neighbouring page that should deliberately follow the source directory |
| The `ref` / `relref` shortcode | `[Configuration]({{</* ref "/docs/configure/overview" */>}})` | When the target's existence must be checked at build time; a missing target fails the build instead of leaving a dead link |

All three carry a trailing slash and point at directory-style routes
(`/docs/write/pages/`), matching Hugo's default permalinks.

The theme has no link render hook: links go to Goldmark untouched. External
links get no automatic `target="_blank"`; write HTML where a new tab is needed,
or handle it in the site's own `layouts/_markup/render-link.html`.

Plain Markdown links are not checked for existence. So:

- Prefer absolute paths for internal links, and `grep` to replace them site-wide after a restructure;
- When moving a page, add `aliases` for the old path and update internal links to the new route — do not let an alias carry navigation indefinitely;
- Use `ref` for a target you are unsure of, and let the build check it for you.

In a bilingual site, link to the logical page (`/docs/write/pages/`) rather than
to a `.zh.md` filename, and keep fragment IDs language-neutral.

## Where images go {#images}
A page's own screenshots go in its page bundle, images shared by several pages
go in `assets/images/`, and large files that need no processing go in `static/`.
All three are written `![alt text](source)` in the source, and an attribute line
controls caption, size, zoom and numbering — see [Images](/docs/components/image/).

## Drafts and publishing {#drafts}

A page with `draft: true` never reaches the build output:

```yaml {title="front matter"}
---
title: Migration guide, not yet final
draft: true
---
```

Preview with `hugo server -D` to show drafts (`-D` is `--buildDrafts`). A page
whose `date` is in the future is excluded too; `-F` shows those. A production
build uses neither switch, and plain `hugo` publishes only finished content.

## OINK's Markdown extensions at a glance {#extensions}

The body is standard Markdown (Goldmark) plus the native forms below. Each is
ordinary Markdown syntax with one attribute line, and each stays readable as
source on GitHub:

| Component | Shortest syntax | Page |
| --- | --- | --- |
| Callouts | `> [!NOTE]` on the first line of a blockquote | [Callouts](/docs/components/callout/) |
| Tabs | Two adjacent fences each carrying `{tab="Homebrew"}` | [Tabs](/docs/components/tabs/) |
| Steps | An ordered list followed by a `{.steps}` line | [Steps](/docs/components/steps/) |
| Cards | A list of links followed by a `{.cards}` line | [Cards](/docs/components/cards/) |
| Field lists | A table followed by `{.fields meta="type default"}` | [Fields](/docs/components/fields/) |
| Table extras | A table followed by `{.matrix}` or `{caption="…"}` | [Tables](/docs/components/table/) |
| Code blocks | `{title="hugo.yml" copy=false}` on the fence info line | [Code Blocks](/docs/components/code/) |
| Images | A standalone image followed by `{caption="…" width="600"}` | [Images](/docs/components/image/) |
| File trees | A `filetree` fence, one `- name/  # comment` per line | [FileTree](/docs/components/filetree/) |
| Mathematics | A `math` fence, or display maths wrapped in `$$` | [Math](/docs/components/math/) |
| Diagrams | A `mermaid` fence (also `plantuml`, `markmap`, `echarts`) | [Mermaid](/docs/components/mermaid/) |

The few remaining components — badges, keys, file includes, terminal
recordings, the Book figure and table family — are shortcodes, with syntax and
parameters in [Components](/docs/components/).

A combined example: code fences and a callout inside steps.

````markdown {title="Source"}
1. Install Hugo Extended, 0.160.1 at the oldest:
   ```bash
   brew install hugo
   ```
1. Clone the documentation site and preview it:
   ```bash
   git clone https://github.com/pgsty/oink.pgsty.com my-docs
   cd my-docs && hugo server
   ```
   > [!TIP]
   > Add `-D` to preview drafts as well.
{.steps}
````

1. Install Hugo Extended, 0.160.1 at the oldest:
   ```bash
   brew install hugo
   ```
1. Clone the documentation site and preview it:
   ```bash
   git clone https://github.com/pgsty/oink.pgsty.com my-docs
   cd my-docs && hugo server
   ```
   > [!TIP]
   > Add `-D` to preview drafts as well.
{.steps}

## What appears at the end of a page {#page-end}
Five blocks are generated by the theme in a fixed order, and none is written in
the body:

| Position | What it is | Default | Where to configure |
| --- | --- | --- | --- |
| 1 | Feedback: the two "Was this page helpful?" buttons | Off | [Repository links and page info](/docs/customize/repository/) |
| 2 | Last modified: the time and the most recent commit subject, linked to GitHub | On when Git information is available | [Repository links and page info](/docs/customize/repository/) |
| 3 | Backlinks: the pages that link here | Off | [Navigation and menus](/docs/customize/navigation/#backlinks) |
| 4 | Pager: previous and next, in sidebar tree order | On for docs / book / blog | [Navigation and menus](/docs/customize/navigation/) |
| 5 | Comments: giscus | When configured and enabled | [Comments](/docs/admin/comments/) |

The action menu beside the title (copy Markdown, edit this page, view history,
open an issue, print) is automatic too, and is configured in the same place,
[Repository links and page info](/docs/customize/repository/).

To turn one of them off for a single page, use front matter: `feedback: false`,
`annotation: false`, `backlinks: false`, `pager: false`, `comments: false`. The
keys are described in [Page parameters](/docs/write/frontmatter/).

## Verify {#verify}

After writing a page, run a strict build:

```bash
hugo --printPathWarnings --panicOnWarning
```

- The output must end with `Total in …` and no ERROR and no WARN. A disallowed key on an attribute line, an invalid component parameter, or a `ref` whose target is missing all fail here naming the file and the line; the theme never degrades silently.
- `--printPathWarnings` reports two pages resolving to the same output path, which turns up most often in multilingual sites or after changing `permalinks`.

Then confirm three things in the browser:

1. The page is in the sidebar, in the position `weight` implies;
2. The right-hand outline lists the `##` headings you wrote, and clicking one puts an English anchor in the URL;
3. The English and Chinese versions of the same heading share an anchor (this site audits that with `node scripts/check-doc-translations.mjs --public public`).

## Related {#related}

- [Organizing content](/docs/write/organize/) — how the directory structure decides the sidebar
- [Page parameters](/docs/write/frontmatter/) — the full front matter table
- [Components](/docs/components/) — each component's syntax and parameters
- [Languages](/docs/customize/i18n/) — paired bilingual files and fallback for untranslated pages
- [Local preview](/docs/admin/preview/) — the `hugo server` switches worth knowing
