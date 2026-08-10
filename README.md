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

Use the short Make targets for common development tasks:

```sh
make b  # Build the site against the sibling theme checkout
make d  # Develop against the sibling theme checkout
make s  # Serve the site against the sibling theme checkout
make c  # Run the complete site test suite
```

These targets create or refresh the ignored `go.work` file and use the sibling
theme checkout. The `dev` and `serve` targets do not pin a port, so Hugo can
select an available one. The long target names (`build`, `dev`, `serve`, and
`check`) work too. Override the automatically selected port or theme checkout
only when needed:

```sh
make dev PORT=1314
make dev THEME_DIR=/path/to/oink
```

Published builds ignore the workspace and resolve the version of
`github.com/pgsty/oink` recorded in `go.mod`.

## License

Site code, build tooling, and material derived from the Docsy project site are
licensed under the [Apache License 2.0](LICENSE).

Unless otherwise noted, original Oink documentation content is licensed under
the [Creative Commons Attribution 4.0 International License](LICENSE-CC-BY-4.0).
