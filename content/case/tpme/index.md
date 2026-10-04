---
title: tpme.vonng.com
linkTitle: TPME
description: >-
  TPME: the Chinese edition of The Product-Minded Engineer. A focused bilingual publication that needs only OINK's Book shell.
images: [featured.webp]
weight: 110
date: 2026-08-05
search_keywords: [tpme.vonng.com, Product-Minded Engineer, bilingual book, book shell]
tags: [Book, Bilingual, Publishing]
---

[tpme.vonng.com](https://tpme.vonng.com/) publishes *The Product-Minded
Engineer* in English and Chinese, with 18 chapters per language in the case
snapshot. Its configuration narrows the supported shell types to `[book]`.

## What it demonstrates {#what-it-demonstrates}

- A publication with exactly one content model and no documentation shell.
- Bilingual chapter peers with a shared visual and navigational system.
- A smaller Book implementation than the multi-edition DDIA site.

This is the clearer starting point for a single-title tutorial or translated
book: keep the site architecture narrow, then add numbering and indexes only as
the manuscript needs them.

## Limit the site to the reading model it needs {#implementation}

The site's [`hugo.yaml`](https://github.com/Vonng/tpme/blob/bb49bef8ea3c66f8b27231b6a80f4bb4d6c98597/hugo.yaml)
sets the relevant options under `params.ui`:

```yaml
params:
  ui:
    typography: system
    shell_types: [book]
    docs_section: ''
```

This keeps the shared shell focused on a book and uses system fonts. It does
not convert arbitrary pages into chapters: the site still owns its manuscript,
language configuration, and Book front matter. Start from the
[Book root pattern](/docs/write/book/) and add another shell type only when a
separate documentation or publishing section needs it.

→ [Writing a book](/docs/write/book/) · [DDIA case](/case/ddia/)
