---
title: Authoring
linkTitle: Authoring
description: Write documentation pages, blog posts, books, release pages, and API references. Learn the page structure and content organization.
weight: 30
icon: fa-solid fa-pen-nib
search_keywords: [authoring, writing, content, front matter, page, blog, book, release, OpenAPI]
cascade:
  categories: [Authoring]
aliases:
  - /docs/content/
  - /docs/scenarios/
---

This section covers all content types supported by OINK: documentation pages,
blog posts, books, Expo image albums, release and download pages, and OpenAPI
references. They share a single Markdown dialect and front matter schema, while
each content type adds its own layout conventions.

## What a documentation page is made of {#anatomy}

Every documentation page is a single Markdown file. YAML front matter between
the opening `---` lines sets the page metadata (`title`, `linkTitle`,
`description`, and `weight`), followed by standard Markdown and OINK's native
components:

```markdown {title="content/docs/install.md"}
---
title: Install Pigsty
linkTitle: Install
description: Get a working PostgreSQL cluster onto a clean EL 9 machine.
weight: 20
---

## Prerequisites {#prerequisites}

A Linux machine you can reach over SSH, passwordless `sudo`, and Python 3.11 or
newer.

> [!IMPORTANT]
> The installer rewrites `/etc/yum.repos.d/`. Back it up first.
```

Save the file as `content/docs/install.md` and run `hugo server`. The page is
served at `/docs/install/` with an **Install** entry in the left sidebar.

## Common Markdown patterns {#quick-syntax}

Most everyday components use standard Markdown plus a Goldmark attribute block
rather than custom shortcodes:

| Pattern | Syntax | Guide |
| --- | --- | --- |
| Explicit heading anchor | `## Prerequisites {#prerequisites}` | [Writing pages](/docs/write/pages/#headings) |
| Callout / admonition | `> [!NOTE]` (`TIP`, `IMPORTANT`, `WARNING`, `CAUTION`, `DETAILS`) | [Callouts](/docs/components/callout/) |
| Code tabs | Adjacent code fences with ```` ```bash {tab="macOS"} ```` | [Tabs](/docs/components/tabs/) |
| Numbered steps | An ordered list followed by `{.steps}` on the next line | [Steps](/docs/components/steps/) |
| Navigation cards | A bullet list of links followed by `{.cards}` on the next line | [Cards](/docs/components/cards/) |
| Parameter / field table | A Markdown table followed by `{.fields}` on the next line | [Fields](/docs/components/fields/) |
| Captioned or sized image | `![alt](/img.webp)` followed by `{width="800" caption="..."}` | [Images](/docs/components/image/) |
| File tree | A ```` ```filetree ```` fenced block using a YAML-like list | [FileTree](/docs/components/filetree/) |

## Content types and where they are covered {#map}

| What you are writing | Where to go |
| --- | --- |
| A documentation page: front matter, heading anchors, links, images, drafts | [Writing pages](/docs/write/pages/) |
| The tree and the sidebar: `_index.md`, `weight`, icons, folding, multiple sidebar roots | [Organizing content](/docs/write/organize/) |
| Looking up what a front matter key means | [Page parameters](/docs/write/frontmatter/) |
| A blog post, a release announcement, RSS | [Blog posts](/docs/write/blog/) |
| A book: chapter numbering, figures and tables, cross-references, whole-book print | [Books](/docs/write/book/) |
| An image album: file structure, metadata, layouts, and the image viewer | [Expo albums](/docs/write/expo/) |
| A release and download page: version cards, asset tables, checksums | [Releases and downloads](/docs/write/releases/) |
| An OpenAPI reference page | [API reference pages](/docs/write/openapi/) |
| Writing in two languages: paired files, aligned anchors, fallback for untranslated pages | [Languages](/docs/customize/i18n/) |
| A component's syntax and parameters | [Components](/docs/components/) |
