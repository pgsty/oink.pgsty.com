# Authoring

> Write documentation pages, blog posts, books, release pages, and API references. Learn the page structure and content organization.

---

LLMS index: [llms.txt](/llms.txt)

---

This section covers the content types OINK supports: documentation pages, blog
posts, books, release and download pages, and OpenAPI references. They share one
Markdown dialect and one front matter schema. Each type adds its own conventions.

## What a documentation page is made of {#anatomy}

A documentation page is one Markdown file. Front matter appears between the
two `---` lines at the top. It contains page metadata: title, short sidebar
name, description, and order. The body follows. It uses ordinary Markdown and
OINK's native components. This is a complete page:

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

Save it as `content/docs/install.md`. Run `hugo server`. The page appears at
`/docs/install/` with an "Install" entry in the sidebar.

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

---

Section pages:

- [Writing pages](/docs/write/pages/): Create a documentation page. Learn where to save it, how to set front matter and anchors, and how links, images, and page-end controls work.
- [Organizing content](/docs/write/organize/): Use the directory structure to create the sidebar tree. Configure `_index.md`, weight, index styles, icons, folding, hidden pages, and documentation paths.
- [Page parameters](/docs/write/frontmatter/): The full front matter table — active page keys and retained 1.x compatibility no-ops, grouped by sidebar, shell, search, output, page end, Book, Expo, landing and release pages.
- [Blog posts](/docs/write/blog/): Set up a blog section. Learn directory conventions, post front matter, featured images, the date-ordered list page, and RSS.
- [Books](/docs/write/book/): Turn a directory tree into a book with `type: book`: chapter numbering, numbered figures and tables, cross-references, generated indexes and whole-book print.
- [Image albums with Expo](/docs/write/expo/): Create an image album, add optional metadata, select a layout, and use the image viewer.
- [Releases and downloads](/docs/write/releases/): Record versions, tags, archive links, checksums, and install commands locally. Release cards, asset tables, download blocks, and index pages use these records.
- [API reference pages](/docs/write/openapi/): Add an OpenAPI specification to the site. Use bundled Swagger UI or Redoc to render a browsable API reference without a CDN.

---

Backlinks:

- [Cards](/docs/components/cards/)
- [Presentation](/docs/components/presentation/)
- [Customization](/docs/customize/)
