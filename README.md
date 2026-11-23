# oink.pgsty.com

This repository contains the source for
[oink.pgsty.com](https://oink.pgsty.com), the documentation and regression site
for the [Oink Hugo theme](https://github.com/pgsty/oink).

The bilingual maintainer contracts under `content/docs/design/` are the
canonical prose source for OINK architecture, components, reading shells,
Landing pages, and migration boundaries.

The site documents OINK `v1.6.0`. The bilingual release notes cover the plain
CSS architecture, Bootstrap JS and Lunr removal, scanning BM25 search, runtime
upgrades, and upgrade steps. Local theme development uses a sibling `../oink`
checkout, while `make build` and `make serve` use the published version pinned
in `go.mod`.
`content/docs/cli{,.zh}.md` introduces the separate, unreleased OINK CLI.

## OINK 1.6.0

[OINK v1.6.0](https://github.com/pgsty/oink/releases/tag/v1.6.0) is dated
2026-11-23. It moves the stylesheet to plain CSS assembled by Hugo (supporting
Hugo 0.170+ in any edition with no Sass compiler), removes Bootstrap's
JavaScript bundle and Lunr, replaces local search with a scanning BM25 engine
supporting unspaced CJK queries, field anchors, and automatic split indexes,
and upgrades Markmap, ReDoc, Mermaid, KaTeX, DocSearch, and the rest of the
vendored runtime set.

- Release notes: [English](https://oink.pgsty.com/blog/release/1.6.0/) /
  [简体中文](https://oink.pgsty.com/zh/blog/release/1.6.0/)
- Contribution guide: [English](https://oink.pgsty.com/docs/about/contributing/) /
  [简体中文](https://oink.pgsty.com/zh/docs/about/contributing/)
- [Upgrade and migration](https://oink.pgsty.com/docs/admin/upgrade/)

OINK `v1.6.0` builds with Hugo **0.169.0** or newer in any edition (validated
on **0.170.1**) and Go **1.27.4**. Historical release notes retain the
toolchain facts of their own versions.

## Starting a new OINK site

Start new sites from the [`pgsty/oink-starter`](https://github.com/pgsty/oink-starter)
template repository and follow the [Starter tutorial](https://oink.pgsty.com/docs/start/starter/).
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

Use Go 1.27.4 and Hugo 0.169.0+ (any edition; validated on 0.170.1) for sibling
theme development and checks. No Sass compiler is required (published-pin
builds on `v1.5.1` still need Hugo Extended 0.169.0 until `go.mod` pins
`v1.6.0`). Do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`. Keep
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
1.6.0. [Acknowledgements](https://oink.pgsty.com/docs/about/license/#community-contributors)
link each contribution to its pull request. OINK preserves Docsy's history and
notices; bundled runtimes, fonts, and icons keep their own licences, recorded in
the theme's [VENDOR.json](https://github.com/pgsty/oink/blob/main/VENDOR.json).

## License

Site code, build tooling, and material derived from the Docsy project site are
licensed under the [Apache License 2.0](LICENSE).

Unless otherwise noted, original Oink documentation content is licensed under
the [Creative Commons Attribution 4.0 International License](LICENSE-CC-BY-4.0).
