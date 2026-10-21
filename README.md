# oink.pgsty.com

This repository contains the source for
[oink.pgsty.com](https://oink.pgsty.com), the documentation and regression site
for the [Oink Hugo theme](https://github.com/pgsty/oink).

The bilingual maintainer contracts under `content/docs/design/` are the
canonical prose source for OINK architecture, components, reading shells,
Landing pages, and migration boundaries.

The site documents OINK `v1.3.2`. The bilingual release notes explain the
restored Hugo-only build and the accepted Hugo 0.168.0 LibSass warning. Local
development uses the sibling checkout. Published module resolution, consumer
pins, and hosted deployment require separate validation.
`content/docs/cli{,.zh}.md` is a one-page introduction to the separate,
unreleased OINK CLI.

## OINK 1.3.2

[OINK v1.3.2](https://github.com/pgsty/oink/releases/tag/v1.3.2) was released on
2026-10-18. It restores Hugo-only builds with built-in LibSass and keeps the
community repairs to Markmap text, TOC footer clearance, technical tables, and
opt-in FileTree comment wrapping.

- Release notes: [English](https://oink.pgsty.com/blog/release/1.3.2/) /
  [简体中文](https://oink.pgsty.com/zh/blog/release/1.3.2/)
- Contribution guide: [English](https://oink.pgsty.com/docs/about/contributing/) /
  [简体中文](https://oink.pgsty.com/zh/docs/about/contributing/)
- [Upgrade and migration](https://oink.pgsty.com/docs/admin/upgrade/)

Current development and maintained sites use Hugo Extended **0.168.0**. Historical
release notes retain the toolchain facts of their own versions.

## Starting a new OINK site

Do not clone this regression repository as a project template. Use the small,
public GitHub template at
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter), then follow the
[Starter tutorial](https://oink.pgsty.com/docs/start/starter/). It pins a
published release and includes neutral Docs, Blog, Book, language profiles, and
GitHub Pages / Cloudflare Pages workflows without this site's test harness or
project-specific configuration.

## Local development

Use Go 1.27.2 and Hugo Extended 0.168.0 for development, CI, and production
builds. Do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`. Keep warnings
visible, including the accepted upstream LibSass deprecation warning. No
separate Sass installation is required. See the [architecture contract](content/docs/design/architecture.md#hugo-toolchain).

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
1.3.2. [Acknowledgements](https://oink.pgsty.com/docs/about/license/#community-contributors)
link each contribution to its pull request. OINK preserves Docsy's history and
notices; bundled runtimes, fonts, and icons keep their own licences, recorded in
the theme's [v1.3.2 VENDOR.json](https://github.com/pgsty/oink/blob/v1.3.2/VENDOR.json).

## License

Site code, build tooling, and material derived from the Docsy project site are
licensed under the [Apache License 2.0](LICENSE).

Unless otherwise noted, original Oink documentation content is licensed under
the [Creative Commons Attribution 4.0 International License](LICENSE-CC-BY-4.0).
