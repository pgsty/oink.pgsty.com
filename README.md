# oink.pgsty.com

This repository contains the source for
[oink.pgsty.com](https://oink.pgsty.com), the documentation and regression site
for the [Oink Hugo theme](https://github.com/pgsty/oink).

## Local development

For theme development, clone both repositories as siblings:

```text
~/pgsty/
├── oink/
└── oink.pgsty.com/
```

Create a local Go workspace, install the site tooling, and start Hugo:

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
npm install
npm run serve
```

`go.work` is intentionally ignored. Published builds resolve the version of
`github.com/pgsty/oink` recorded in `go.mod`.

## License

The site is derived from the Docsy project site and is licensed under the Apache
License 2.0.
