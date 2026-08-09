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

Start Hugo with the sibling theme checkout:

```sh
make dev
```

The shortcut creates or refreshes the ignored `go.work` file and serves the
site at <http://127.0.0.1:1313/>. Override the port or theme checkout when
needed:

```sh
make dev PORT=1314
make dev THEME_DIR=/path/to/oink
```

Published builds ignore the workspace and resolve the version of
`github.com/pgsty/oink` recorded in `go.mod`.

## License

The site is derived from the Docsy project site and is licensed under the Apache
License 2.0.
