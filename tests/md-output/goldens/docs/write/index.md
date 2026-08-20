# Authoring

> Writing documentation pages, blog posts, books, release pages and API references — what a page looks like, and how content is organized.

---

LLMS index: [llms.txt](/llms.txt)

---

This section covers the content types OINK supports: documentation pages, blog
posts, books, release and download pages, and OpenAPI references. They share one
Markdown dialect and one front matter schema, and each adds its own conventions.

## What a documentation page is made of {#anatomy}

A documentation page is one Markdown file. Between the two `---` lines at the
top is the front matter — the page's metadata: title, short sidebar name,
description, ordering. The rest is the body: ordinary Markdown plus OINK's
native components. Here is a complete page:

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

Save it as `content/docs/install.md`, run `hugo server`, and the page appears at
`/docs/install/` with an "Install" entry in the sidebar.

## Content types and where they are covered {#map}

| What you are writing | Where to go |
| --- | --- |
| A documentation page: front matter, heading anchors, links, images, drafts | [Writing pages](/docs/write/pages/) |
| The tree and the sidebar: `_index.md`, `weight`, icons, folding, multiple sidebar roots | [Organizing content](/docs/write/organize/) |
| Looking up what a front matter key means | [Page parameters](/docs/write/frontmatter/) |
| A blog post, a release announcement, RSS | [Blog posts](/docs/write/blog/) |
| A book: chapter numbering, figures and tables, cross-references, whole-book print | [Books](/docs/write/book/) |
| A release and download page: version cards, asset tables, checksums | [Releases and downloads](/docs/write/releases/) |
| An OpenAPI reference page | [API reference pages](/docs/write/openapi/) |
| Writing in two languages: paired files, aligned anchors, fallback for untranslated pages | [Languages](/docs/customize/i18n/) |
| A component's syntax and parameters | [Components](/docs/components/) |

---

Section pages:

- [Writing pages](/docs/write/pages/): Creating a documentation page — where the file goes, what the front matter says, why heading anchors are written by hand, how links and images work, and what appears at the end of a page on its own.
- [Organizing content](/docs/write/organize/): The directory structure is the sidebar tree — `_index.md` and weight, section index styles, icons and folding, hiding pages, and putting documentation at any path.
- [Page parameters](/docs/write/frontmatter/): The full front matter table — every page key the theme actually reads, grouped by sidebar, shell, search, output, page end, Book, landing and release pages.
- [Blog posts](/docs/write/blog/): Setting up a blog section — directory conventions, a post's front matter, featured images, the year-grouped list page, and RSS.
- [Books](/docs/write/book/): Turn a directory tree into a book with `type: book`: chapter numbering, numbered figures and tables, cross-references, generated indexes and whole-book print.
- [Releases and downloads](/docs/write/releases/): Record versions, tags, archive links, checksums and install commands as local facts, then let release cards, asset tables, download blocks and index pages derive from that one record.
- [API reference pages](/docs/write/openapi/): Put an OpenAPI specification on the site and render it as a browsable API reference with the bundled Swagger UI or Redoc, without touching a CDN.
