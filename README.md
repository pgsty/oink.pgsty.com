# oink.pgsty.com

This repository contains the source for
[oink.pgsty.com](https://oink.pgsty.com), the documentation and regression site
for the [Oink Hugo theme](https://github.com/pgsty/oink).

The bilingual maintainer contracts under `content/docs/design/` are the
canonical prose source for OINK architecture, components, reading shells,
Landing pages, and migration boundaries.

## Starting a new OINK site

Do not clone this regression repository as a project template. Use the small,
public GitHub template at
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter), then follow the
[Starter tutorial](https://oink.pgsty.com/docs/start/starter/). It pins the
current release and includes neutral Docs, Blog, Book, language profiles, and
GitHub Pages / Cloudflare Pages workflows without this site's test harness or
project-specific configuration.

## Local development

For theme development, clone both repositories as siblings:

```text
~/pgsty/
├── oink/
└── oink.pgsty.com/
```

The four Make targets separate published-theme checks from local-theme work:

```sh
make build  # Build production output with the version pinned in go.mod
make check  # Test the sibling theme with the non-browser regression suite
make dev    # Start the fastest server with the sibling theme
make serve  # Preview the pinned theme in the production environment
```

`build` and `serve` invoke Hugo directly and resolve the published version of
`github.com/pgsty/oink` pinned in `go.mod`. `dev` and `check` set a one-command
module replacement to `../oink`; they do not create a `go.work` file or modify
`go.mod`. `dev` keeps Hugo's fast-render defaults and renders to memory;
`serve` uses the production environment, minifies the output, performs full
renders after changes, and does not inject live reload. Node and npm are needed
for the regression tests, not to build the OINK theme or site.

## License

Site code, build tooling, and material derived from the Docsy project site are
licensed under the [Apache License 2.0](LICENSE).

Unless otherwise noted, original Oink documentation content is licensed under
the [Creative Commons Attribution 4.0 International License](LICENSE-CC-BY-4.0).
