---
downstream_modified: true
title: Troubleshooting and known issues
linkTitle: Troubleshooting
weight: 60
description:
  Diagnose OINK installation, build, language, search, and platform issues.
aliases: [known_issues]
cSpell:ignore: maxfiles maxfilesperproc
---

Start diagnosis from a clean production build:

```sh
hugo --gc --minify --logLevel info
```

The consumer command should not invoke npm, PostCSS, Autoprefixer, or download
theme browser assets.

## Build issues

### Hugo is not Extended or is too old

Run `hugo version`. The output must include `extended`, and the version must be
at least `{{% param hugoMinVersion %}}`. If a shell, editor, CI runner, or
container still selects an older binary, inspect its `PATH` and pinned tool
configuration rather than installing another copy blindly.

### The theme cannot be found

An error such as `module "github.com/pgsty/oink" not found` means that Hugo
cannot resolve the configured theme. Check the selected installation mode:

- for a Git checkout, the `theme` name and directory path must agree;
- for a Hugo module, run `hugo mod graph` and inspect `go.mod`, `go.sum`, and
  any configured Hugo workspace or replacement;
- for a CI checkout, initialize the pinned submodule or restore the complete
  release archive before running Hugo.

### A local browser asset is missing

Do not fix a missing Bootstrap, Font Awesome, Lunr, Mermaid, or other OINK asset
by adding a CDN URL. Confirm that the distribution is complete and contains
`assets/third_party/`, `assets/js/third_party/`, `static/webfonts/`, and
`VENDOR.json`. Re-extract or re-fetch the same pinned release if files are
missing.

## Language and link issues

### A translated page does not appear

Check all four conditions:

1. `languages.zh` exists and has a weight in `hugo.yaml`.
2. The file is named `page.zh.md`, including lowercase `zh`.
3. The translated front matter does not set `draft: true` or a future date.
4. Route-affecting metadata matches the source unless a different route is
   intentional.

The language selector links to a page translation when Hugo reports one;
otherwise it deliberately falls back to the target-language home page.

### A fragment link opens the page but not the heading

Translated heading text normally generates a different automatic ID. Add the
English rendered ID explicitly to the translated heading:

```markdown
## 安装 {#installation}
```

Do not infer IDs for headings containing shortcodes or inline HTML. Inspect the
English rendered HTML, then compare the English and Chinese heading ID lists.

## Search issues

With `offlineSearch: true`, each language produces its own search index. Check
that `offline-search-index.en.json` and `offline-search-index.zh.json` exist in
the output and that the browser requests them from the site's base URL. A wrong
`baseURL` is a common cause of missing indexes on subpath deployments.

Chinese tokenization uses the theme's CJK fallback. If results are empty, first
verify that the Chinese page content is present in the Chinese index rather than
changing the tokenizer.

## Platform issues

### macOS reports too many open files

Large live-preview trees can exceed the shell's open-file limit. Inspect the
current limit with `ulimit -n` and raise it temporarily for the current shell if
local policy permits. Prefer excluding generated or unrelated directories from
the watched tree before applying a machine-wide limit change.

### Windows Subsystem for Linux is slow or misses changes

Run Hugo against a Linux filesystem path rather than a Windows-mounted path.
Cross-filesystem notification and permission behavior can make live reload slow
or unreliable.

## Diagnostic checklist

- Reproduce with the exact pinned Hugo Extended version.
- Remove stale `public/` and `resources/` output through the project's normal
  clean command, then rebuild.
- Compare development and production configuration layers.
- Check the first build error, not only the final cascading message.
- Test a minimal page to separate theme behavior from site overrides.
- Re-enable site overrides and content components in small groups.
- Inspect the browser console and network log for the failing page.
