---
downstream_modified: true
title: Contribution guidelines
description: Contribute code and bilingual documentation to Oink.
aliases: [contribution-guidelines, /docs/contributing/]
weight: 40
icon: fa-solid fa-code-pull-request
---

OINK is an independent theme derived from Docsy. Contributions must preserve the
Apache-2.0 history and applicable third-party notices while improving the single
canonical implementation.

## Before opening a change

- Search existing issues and pull requests in the [OINK repository][repo].
- For a bug, record the Hugo version, installation mode, language, route,
  production command, and smallest reproducible input.
- For a feature, explain why it belongs in the reusable theme rather than in a
  consuming site's business layer.
- Do not introduce an `oink.enabled` switch, an `oink.*` configuration tree, or
  a parallel visual shell. OINK's standard layouts are the product.

Small fixes can go directly to implementation. Larger behavior changes should
state their compatibility, offline, accessibility, security, and migration
impact before code is written.

## Development environment

Consumer sites need only Hugo Extended, Go, and Git. The theme repository is a
direct Hugo Module. The project-site repository uses its pinned Node.js and npm
versions for formatting, links, translations, and regression tests.

Install the maintainer dependencies from the repository root using the lockfile.
Do not update dependencies as a side effect of an unrelated change.

The project is split across:

- `github.com/pgsty/oink`: published theme source and `VENDOR.json`;
- `github.com/pgsty/oink.pgsty.com`: documentation, examples, and tests.

## Build the consumer contract

Always verify the path that users run from a consuming site:

```sh
hugo --gc --minify
```

This build must succeed without npm installation in the consumer site and
without a network request for theme-owned browser assets.

For a local theme candidate, clone both repositories as siblings and activate an
ignored Hugo workspace:

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
HUGO_MODULE_WORKSPACE=go.work npm run build
```

## Run focused tests

Choose the smallest relevant suite first:

```sh
npm run test:hugo-build
npm run test:alt-site
npm run test:md-output
npm run test:favicons
```

Run `npm test` for the complete site suite.

Multilingual changes should cover the one-, two-, three-, and four-or-more
language states, missing-page fallback, RTL, canonical URLs, `hreflang`, and
Open Graph locale metadata.

Content-component changes should cover single and multiple instances, no asset
load on unused pages, invalid parameters, subpath builds, print, keyboard use,
reduced motion, and offline behavior.

## Write bilingual documentation

All user-facing pages added under `content/docs/` or `content/blog/` need a
`.zh.md` peer. Follow `TRANSLATION.md` for terminology and Chinese typography.

Translated Markdown headings use explicit IDs copied from the English rendered
HTML. Check source coverage and, after building, rendered heading IDs:

```sh
node scripts/check-doc-translations.mjs
node scripts/check-doc-translations.mjs --public public
```

Preserve code, configuration keys, URLs, release facts, authorship, and link
definitions. Translate visible metadata, alternative text, callouts, UI labels,
and shortcode strings. Do not submit placeholder or untranslated prose merely to
satisfy the filename check.

## Preview documentation

Run the project website with the pinned public module, or activate the local
workspace described above:

```sh
npm run serve
```

Review English and Chinese versions of the changed pages at desktop and mobile
widths. Check light and dark modes, table of contents, language switching,
search, code blocks, tables, callouts, print output, and fragment links.

A local build proves only local rendering. CI, release packaging, hosted
preview, and production publication are separate verification layers.

## Keep changes compatible

- Reuse existing partials, shortcodes, SCSS helpers, and asset loaders.
- Load browser runtimes only on pages that use them, and at most once per page.
- Keep default behavior local-first and same-origin.
- Serialize structured data safely; arbitrary JavaScript requires an explicit
  unsafe boundary.
- Use logical CSS properties and test LTR and RTL.
- Preserve site-owned business components and documented compatibility aliases.
- Keep legal attribution and vendor metadata with redistributed assets.

## Open the pull request

Keep commits and messages lean and explain user-visible behavior and migration
impact. Include the focused commands run and their results.

If a change intentionally diverges from Docsy, update the relevant migration or
release documentation. Do not remove upstream copyright, license, or history.

[repo]: https://github.com/pgsty/oink
