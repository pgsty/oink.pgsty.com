# oink.pgsty.com

This repository contains the source for
[oink.pgsty.com](https://oink.pgsty.com), the documentation and regression site
for the [Oink Hugo theme](https://github.com/pgsty/oink).

The bilingual maintainer contracts under `content/docs/design/` are the
canonical prose source for OINK architecture, components, reading shells,
Landing pages, and migration boundaries.

The site documents OINK `v1.3.2`. The guides, homepage, Design contracts, and
bilingual `content/blog/release/1.3.2{,.zh}.md` notes cover the restored Hugo-only
build and retain the readability repairs and optional FileTree wrapping from 1.3.1. Local development uses
the sibling checkout. Published module resolution, consumer version pins, and
hosted deployment each require separate validation.
`content/docs/cli{,.zh}.md` is a one-page introduction to the separate,
unreleased OINK CLI.

## Starting a new OINK site

Do not clone this regression repository as a project template. Use the small,
public GitHub template at
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter), then follow the
[Starter tutorial](https://oink.pgsty.com/docs/start/starter/). It pins a
published release and includes neutral Docs, Blog, Book, language profiles, and
GitHub Pages / Cloudflare Pages workflows without this site's test harness or
project-specific configuration.

## Local development

Hugo Extended 0.166.0 is the minimum and pinned default for development and
strict CI. Styles use built-in LibSass; ordinary users do not install Dart Sass.
Hugo 0.168.0 can build with its upstream LibSass warning; use 0.166.0 with
`--panicOnWarning`. Go 1.27.0 is the module minimum; local release validation
uses Go 1.27.2. See the [architecture contract](content/docs/design/architecture.md#hugo-toolchain).

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

## License

Site code, build tooling, and material derived from the Docsy project site are
licensed under the [Apache License 2.0](LICENSE).

Unless otherwise noted, original Oink documentation content is licensed under
the [Creative Commons Attribution 4.0 International License](LICENSE-CC-BY-4.0).
