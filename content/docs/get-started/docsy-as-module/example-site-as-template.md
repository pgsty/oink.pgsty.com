---
downstream_modified: true
title: 'Inspect the bilingual project site'
linkTitle: Bilingual project site
description: Use the independent Oink project site as a complete reference.
weight: 2
---

The independent
[`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) repository is
the complete bilingual example and regression site. It is intentionally more
comprehensive than a starter: use it as a reference, then keep only the content
and configuration your product needs.

## Clone the project site

After the Oink theme has a public release, clone and build the site directly:

```sh
git clone https://github.com/pgsty/oink.pgsty.com.git product-docs
cd product-docs
hugo --gc --minify
```

The committed `go.mod` pins `github.com/pgsty/oink`. For local theme
development, clone the theme as a sibling and use the workspace commands
documented in the
[Oink quick start](/docs/oink/getting-started/#develop-against-a-local-checkout).

## Run the site checks

Hugo alone builds the site. Node.js is used only for the project site's
formatting, link, translation, and regression checks:

```sh
npm install
npm test
```

Open the generated site and check both English and Chinese pages. Use the
language switcher from a translated detail page, not only from the home page.

## Replace the example identity

Edit `hugo.yaml` and the files under `config/`, then replace:

- site and per-language titles and descriptions;
- `baseURL`;
- repository and branch URLs;
- copyright holder and starting year;
- logo and brand assets;
- English and Chinese menu labels.

Do not create an `oink.*` parameter namespace. Use Hugo's language, menu,
module, output, and markup settings plus the documented theme parameters.

## Replace the example content

Keep each translation pair together:

```text
content/docs/getting-started.md
content/docs/getting-started.zh.md
```

Delete historical and regression content that the product does not need. Remove
an example asset only after no page references it.

For translated headings, use the English rendered ID explicitly:

```markdown
## Configure search
```

```markdown
## 配置搜索 {#configure-search}
```

## Put the new site in version control

Change the module path, repository metadata, and remote before publishing a
derived site. Keep the Oink version pinned in `go.mod`. Do not commit generated
`public/` output unless the hosting workflow explicitly requires it.

## What's next?

- Review [basic configuration](/docs/get-started/basic-configuration/).
- Learn the [content components](/docs/oink/components/).
- Configure [deployment](/docs/oink/deployment/).
- Use the [release checklist](/docs/oink/release/).
