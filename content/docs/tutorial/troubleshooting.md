---
title: Troubleshooting
linkTitle: Troubleshooting
weight: 70
description: Locating build, language, search, upgrade, and platform problems.
cSpell:ignore: maxfiles maxfilesperproc
---

Diagnosis starts from a clean production build:

```sh
hugo --gc --minify --logLevel info
```

A consumer build command should **never** invoke npm, PostCSS, or Autoprefixer,
and should never download the theme's browser assets. Seeing those in the log
means an upstream Docsy workflow has leaked into the configuration.

## Build issues {#build-issues}

### Hugo is not Extended, or is too old {#hugo-is-not-extended-or-too-old}

```sh
hugo version
```

The output must contain `extended` and be at least
`{{% param hugoMinVersion %}}`.

If a shell, editor, CI runner, or container still selects an old binary, inspect
`PATH` and the pinned tool configuration. **Do not just install another copy** —
several coexisting Hugos make the problem harder to find.

### The theme cannot be found {#the-theme-cannot-be-found}

`module "github.com/pgsty/oink" not found` means Hugo cannot resolve the theme.
Check according to the installation method:

| Method          | Check                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| Hugo Module     | `hugo mod graph`, plus `go.mod`, `go.sum`, and any workspace or replace |
| Git submodule   | Whether CI runs `git submodule update --init` before Hugo               |
| Archive / clone | Whether `theme:` matches the directory name under `themes/`             |

### A local browser asset is missing {#a-local-browser-asset-is-missing}

When Bootstrap, Font Awesome, Lunr, or Mermaid is missing, **do not paper over
it with a CDN URL**. Confirm the distribution is complete and contains:

- `assets/third_party/`
- `assets/js/third_party/`
- `static/webfonts/`
- `VENDOR.json`

If files really are missing, re-extract or re-fetch the same pinned version.

## Issues after upgrading {#issues-after-upgrading}

### Site scripts report `$ is not defined` {#site-scripts-report-dollar-is-not-defined}

OINK 0.3.0 **removed jQuery**. It was previously loaded in every page's
`<head>`, so a site's own scripts may have depended on the global `$` without
saying so.

No theme feature needs it. Sites that still do can bundle it themselves:

```html {title="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

### Custom fonts stopped working {#custom-fonts-stopped-working}

Since 0.3.0 moved fonts behind semantic roles, the body and heading roles apply
directly to content. A site that only restyled raw `body` or heading selectors
should move to the role variables:

```scss {title="assets/scss/_styles_project.scss"}
/* Before */
body {
  font-family: 'My Sans', sans-serif;
}

/* After */
:root {
  --td-body-font-family: 'My Sans', sans-serif;
}
```

The full migration list is in [Upgrade OINK](/docs/upgrade/upgrade/).

## Language and link issues {#language-and-link-issues}

### A translated page does not appear {#a-translated-page-does-not-appear}

Check four things in order:

1. `languages.zh` exists in `hugo.yaml` and has a `weight`.
2. The filename is `page.zh.md`, with `zh` in **lower case**.
3. The translation's front matter has no `draft: true` and no future `date`.
4. Routing metadata matches the source unless a different route is intended.

When Hugo finds a translation, the language selector links straight to it;
otherwise it falls back to the target language home page by design. That is
expected behavior, not a bug.

### Fragment links open the page but do not scroll {#fragment-links-do-not-scroll}

Translated heading text produces a different automatic ID. Write the rendered
English ID explicitly in the translation:

```markdown
## 安装 {#installation}
```

For headings containing shortcodes or inline HTML, **do not guess the ID from
the text** — read the rendered English HTML.

## Search issues {#search-issues}

`offlineSearch: true` builds a separate index per language. Confirm the output
contains:

```text {copy=false}
public/offline-search-index.en.json
public/offline-search-index.zh.json
```

Then check that the browser requests them from the correct base URL. **A wrong
`baseURL` under a subpath deployment is the most common cause of a 404 index.**

Chinese queries use the theme's CJK substring fallback. When a search returns
nothing, first confirm the Chinese content actually reached the Chinese index
rather than immediately changing tokenization.

The Command Palette (`Cmd/Ctrl-K` or `/` for full search, `\` for command mode)
still works when the index is unavailable: it reports the index as unavailable
while page actions and commands continue to function.

## Platform issues {#platform-issues}

### macOS reports too many open files {#macos-too-many-open-files}

Live preview over a large content tree can exceed the shell's open-file limit:

```sh
ulimit -n
```

Before raising a machine-wide limit, **exclude generated and unrelated
directories from the watch set** — that is usually the real cause.

### WSL is slow or misses changes {#wsl-is-slow-or-misses-changes}

Let Hugo work on paths inside the Linux filesystem rather than across a Windows
mount. Cross-filesystem change notification and permission behavior make live
reload slow or unreliable.

## Diagnostic checklist {#diagnostic-checklist}

- Reproduce with a pinned, exact Hugo Extended version.
- Remove stale `public/` and `resources/` output and rebuild.
- Compare the development and production configuration layers.
- **Read the first error**, not the last cascading one.
- Use a minimal page to separate theme behavior from site overrides.
- Re-enable site overrides and content components in batches to isolate one.
- Check the browser console and network log on the failing page.
