---
title: Authoring
linkTitle: Authoring
description: Writing documentation pages, blog posts, books, release pages and API references — what a page looks like, and how content is organized.
weight: 30
icon: fa-solid fa-pen-nib
search_keywords: [authoring, writing, content, front matter, page, blog, book, release, OpenAPI]
cascade:
  categories: [Authoring]
aliases:
  - /docs/content/
  - /docs/scenarios/
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
