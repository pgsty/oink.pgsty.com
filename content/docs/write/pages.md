---
title: Writing pages
linkTitle: Writing pages
description: Create a documentation page. Learn where to save it, how to set front matter and anchors, and how links, images, and page-end controls work.
weight: 10
search_keywords: [writing pages, front matter, heading ID, heading anchor, links, ref, relref, draft, Markdown]
aliases:
  - /docs/content/writing/
---

This page covers the complete process for writing a documentation page. It
explains file location, front matter, heading anchors, links, images, drafts,
and page-end controls. The site must already build locally. If it does not,
start with
[Quick start](/docs/start/).

## Creating a page {#new-page}

A page is a Markdown file under `content/`. Its location determines its URL.
For example, `content/docs/install.md` is published as `/docs/install/`. The Chinese
translation is a `.zh.md` file of the same name in the same directory, sharing
one logical path with the English page.

Use a single file for a page without attached resources. If a page has images,
cast files, or example configuration, create a directory. Name the page file
`index.md` and put the resources beside it. Hugo calls this a
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
from an archetype. See the [Hugo documentation](https://gohugo.io/commands/hugo_new_content/).
You can also write the file manually.

> [!IMPORTANT]
> When a Chinese page has no English counterpart, Hugo does not give it
> resources without a language suffix. In that case the resource filename
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

Use `description` to state in one sentence what the reader can accomplish.
It appears on section index cards, in search results, and on social cards.
`weight` determines sidebar order. Only equal weights use alphabetical order.

Other keys are optional. These include the icon, draft status, search weight,
comment switch, and page shell. For the full table, see
[Page parameters](/docs/write/frontmatter/).

## Heading levels and stable anchors {#headings}

Start body sections at `##`. Reserve `#` for `title`. The theme renders the page
heading. Another `#` in the body creates a second top-level heading. The right
column outline starts at `##`. Hugo's `markup.tableOfContents` determines its
maximum depth. This site uses `####`.

Write an explicit English anchor `{#id}` on every `##` and `###`:

```markdown {title="Source"}
## Prerequisites {#prerequisites}

### Disk and memory {#disk-and-memory}
```

There are two reasons:

- Cross-language alignment. Hugo derives an ID from heading text. A Chinese heading produces a Chinese ID. `/docs/install/#prerequisites` and `/zh/docs/install/#前提条件` identify equivalent places with different anchors. A translation audit cannot compare them. Give the translated heading the English page's ID. Both pages then share one fragment.
- Link stability. Revisions can change heading text. They should not break public links. After publication, an explicit ID is a public route. If you must rename it, leave an empty anchor for the old ID:

```markdown {title="Source: leaving a target behind for the old anchor"}
## Getting started <a id="get-started"></a> {#quickstart}
```

Use lowercase English with hyphens, unique within the page. This site's
translation audit compares the heading IDs rendered by the English and Chinese
pages and fails on a mismatch.

## Writing links {#links}
Use one of these three forms, according to its purpose:

| Form | Example | When to use it |
| --- | --- | --- |
| Absolute site path | `[Configuration](/docs/customize/config/)` | The default. It points at a published route, is easy to audit and replace site-wide, and survives source files moving |
| Relative path | `[another page](../organize/)`, `![diagram](shell.webp)` | Resources inside the same page bundle, or a neighboring page that should follow the source directory |
| The `ref` / `relref` shortcode | `[Configuration]({{</* ref "/docs/configure/overview" */>}})` | If the target must exist at build time. A missing target fails the build instead of leaving a broken link |

All three carry a trailing slash and point at directory-style routes
(`/docs/write/pages/`), matching Hugo's default permalinks.

The theme has no link render hook. It passes links to Goldmark unchanged.
External links do not automatically receive `target="_blank"`. If you need a
new tab, write HTML or use the site's `layouts/_markup/render-link.html`.

Plain Markdown links are not checked for target existence. Use these rules:

- Prefer absolute paths for internal links. After restructuring the site, use `grep` to replace them site-wide.
- When you move a page, add `aliases` for the old path. Update internal links to the new route. Do not use an alias for navigation indefinitely.
- If you are unsure that a target exists, use `ref`. The build then checks it.

In a bilingual site, link to the logical page (`/docs/write/pages/`) rather than
to a `.zh.md` filename, and keep fragment IDs language-neutral.

## Where images go {#images}
Put a page's screenshots in its page bundle. Put shared images in
`assets/images/`. Put large files that require no processing in `static/`.
Use `![alt text](source)` for all three. An attribute line controls caption,
size, zoom, and numbering. See [Images](/docs/components/image/).

## Drafts and publishing {#drafts}

A page with `draft: true` never reaches the build output:

```yaml {title="front matter"}
---
title: Migration guide, not yet final
draft: true
---
```

Preview with `hugo server -D` to show drafts (`-D` is `--buildDrafts`). A page
whose `date` is in the future is also excluded. `-F` shows those pages. A production
build uses neither switch, and plain `hugo` publishes only finished content.

## OINK's Markdown extensions {#extensions}

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
| Mathematics | A `math` fence, or display math wrapped in `$$` | [Math](/docs/components/math/) |
| Diagrams | A `mermaid` fence (also `plantuml`, `markmap`, `echarts`) | [Mermaid](/docs/components/mermaid/) |

The remaining components use shortcodes. These include badges, keys, file
includes, terminal recordings, and the Book figure and table family. For syntax
and parameters, see [Components](/docs/components/).

A combined example: code fences and a callout inside steps.

````markdown {title="Source"}
1. Install Hugo Extended, 0.168.0 at the oldest:
   ```bash
   brew install hugo
   ```
1. Clone OINK Starter and preview it:
   ```bash
   git clone https://github.com/pgsty/oink-starter my-docs
   cd my-docs && hugo server
   ```
   > [!TIP]
   > Add `-D` to preview drafts as well.
{.steps}
````

1. Install Hugo Extended, 0.168.0 at the oldest:
   ```bash
   brew install hugo
   ```
1. Clone OINK Starter and preview it:
   ```bash
   git clone https://github.com/pgsty/oink-starter my-docs
   cd my-docs && hugo server
   ```
   > [!TIP]
   > Add `-D` to preview drafts as well.
{.steps}

## What appears at the end of a page {#page-end}
The theme generates these four blocks in a fixed order. Do not write them in
the body. An optional Share bar appears before them:

| Position | What it is | Default | Where to configure |
| --- | --- | --- | --- |
| 1 | Feedback: the two "Was this page helpful?" buttons | Off | [Repository links and page info](/docs/customize/repository/) |
| 2 | Last modified: the time and the most recent commit subject, linked to GitHub | On when Git information is available | [Repository links and page info](/docs/customize/repository/) |
| 3 | Pager: previous and next, in sidebar tree order | On for docs / book / blog | [Navigation and menus](/docs/customize/navigation/) |
| 4 | Comments: giscus | When configured and enabled | [Comments](/docs/admin/comments/) |

The theme also generates the action menu beside the title. It includes copy
Markdown, edit this page, view history, open an issue, and print. Configure it in
[Repository links and page info](/docs/customize/repository/).

To turn off a control for one page, set its front matter: `feedback: false`,
`annotation: false`, `pager: false`, `comments: false`. The keys are described
in [Page parameters](/docs/write/frontmatter/).

## Verify {#verify}

After writing a page, run a production build:

```bash
hugo --printPathWarnings
```

- The output must end with `Total in …` and no ERROR; review warnings and accept only the known upstream LibSass notice. A disallowed attribute key or invalid component parameter produces a warning with a source position and uses a safe fallback. Review that output. A `ref` whose target is missing still causes a Hugo error.
- `--printPathWarnings` reports two pages resolving to the same output path, which occurs most often in multilingual sites or after changing `permalinks`.

Then confirm three things in the browser:

1. The page appears in the sidebar at the position determined by `weight`.
2. The right-hand outline lists your `##` headings. Clicking a heading adds an English anchor to the URL.
3. The English and Chinese versions of the same heading share an anchor (this site audits that with `node scripts/check-doc-translations.mjs --public public`).

## Related {#related}

- [Organizing content](/docs/write/organize/) — how the directory structure decides the sidebar
- [Page parameters](/docs/write/frontmatter/) — the full front matter table
- [Components](/docs/components/) — each component's syntax and parameters
- [Languages](/docs/customize/i18n/) — paired bilingual files and fallback for untranslated pages
- [Local preview](/docs/admin/preview/) — the `hugo server` switches worth knowing
