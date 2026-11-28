# oink.pgsty.com

This repository contains the source for
[oink.pgsty.com](https://oink.pgsty.com), the documentation and regression site
for the [Oink Hugo theme](https://github.com/pgsty/oink).

The bilingual maintainer contracts under `content/docs/design/` are the
canonical prose source for OINK architecture, components, reading shells,
Landing pages, and migration boundaries.

The site documents OINK `v1.7.0`. The bilingual release notes cover the six new
content components, typeset copy, the map of 29 shortcuts with browsing history
and adjustable reading width, preset and CJK typography refinements, and
upgrade steps. Local theme development uses a sibling `../oink` checkout, while
`make build` and `make serve` use the published version pinned in `go.mod`.
`content/docs/cli{,.zh}.md` introduces the separate, unreleased OINK CLI.

## OINK 1.7.0

[OINK v1.7.0](https://github.com/pgsty/oink/releases/tag/v1.7.0) is dated
2026-11-28. It adds six content components (Timeline, Update, Video, Audio,
Social, and Map with vendored Leaflet 1.9.4), typeset rich-text copy, a
system of 29 single-key shortcuts with a top-layer sheet, local browsing
history (`H`), fold-all (`O`), reading-width steps (`-`/`=`), and a reader
opt-out; refines all four visual presets with Paper's ivory sheet, clay accent,
and preset-specific CJK system typography; and adds Markmap corner SVG download
controls, site ECharts themes (`window.OinkEchartsThemes`), and styled
archived-version banners.

- Release notes: [English](https://oink.pgsty.com/release/1.7.0/) /
  [简体中文](https://oink.pgsty.com/zh/release/1.7.0/)
- Contribution guide: [English](https://oink.pgsty.com/docs/about/contributing/) /
  [简体中文](https://oink.pgsty.com/zh/docs/about/contributing/)
- [Upgrade and migration](https://oink.pgsty.com/docs/admin/upgrade/)

OINK `v1.7.0` builds with any Hugo edition meeting the minimum in the theme's
[`theme.toml`](https://github.com/pgsty/oink/blob/main/theme.toml) and Go **1.27.4**. Historical release notes retain the
toolchain facts of their own versions.

## Starting a new OINK site

Start new sites from the [`pgsty/oink-starter`](https://github.com/pgsty/oink-starter)
template repository and follow the [Get started guide](https://oink.pgsty.com/docs/start/).
The starter pins a published release and includes neutral Docs, Blog, Book,
language profiles, and GitHub Pages / Cloudflare Pages workflows without this
repository's regression test suite.

## Building with an AI agent

The **Oink 建站** agent skill packages the site-building workflow and review
standards in one file: [English](https://oink.pgsty.com/skill.md) /
[简体中文](https://oink.pgsty.com/skill.zh.md). Its sources are
`static/skill.md` and `static/skill.zh.md`; keep them free of local paths and
private repositories. Installation is described in
[Build with an AI agent](https://oink.pgsty.com/docs/start/#agent-skill).

## Local development

Use Go 1.27.4 and an installed Hugo meeting the module minimum for both
published-pin builds and sibling theme development. No Sass compiler is
required. Do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`. Keep
warnings visible. See the [architecture contract](content/docs/design/architecture.md#hugo-toolchain).

For theme development, clone both repositories as siblings:

```text
~/pgsty/
├── oink/
└── oink.pgsty.com/
```

The five Make targets separate published-theme checks from local-theme work:

```sh
make build    # Build production output with the version pinned in go.mod
make check    # Test the sibling theme with the non-browser regression suite
make browser  # Run the browser regression suite with the sibling theme
make dev      # Start the fastest server with the sibling theme
make serve    # Preview the pinned theme in the production environment
```

`build` and `serve` invoke Hugo directly and resolve the published version of
`github.com/pgsty/oink` pinned in `go.mod`. `dev`, `check`, and `browser` set a
one-command module replacement to `../oink`; they do not create a `go.work`
file or modify `go.mod`. `dev` keeps Hugo's fast-render defaults and renders to memory;
`serve` uses the production environment, minifies the output, performs full
renders after changes, and does not inject live reload. Node and npm are needed
for the regression tests, not to build the OINK theme or site.

## Contributing and acknowledgements

Read [CONTRIBUTING.md](CONTRIBUTING.md) for repository ownership, bilingual
content rules, and validation. Public behavior changes belong with their owning
checker and the English/Chinese Design contract.

Thank you to [@imbajin](https://github.com/imbajin) for the reading repairs,
fixtures, tests, and bilingual documentation delivered in 1.3.1 and retained in
1.7.0. [Acknowledgements](https://oink.pgsty.com/docs/about/license/#community-contributors)
link each contribution to its pull request. OINK preserves Docsy's history and
notices; bundled runtimes, fonts, and icons keep their own licences, recorded in
the theme's [VENDOR.json](https://github.com/pgsty/oink/blob/main/VENDOR.json).

## License

Site code, build tooling, and material derived from the Docsy project site are
licensed under the [Apache License 2.0](LICENSE).

Unless otherwise noted, original Oink documentation content is licensed under
the [Creative Commons Attribution 4.0 International License](LICENSE-CC-BY-4.0).
