# Get started

> Build a bilingual Oink documentation site with Hugo Extended.

---

LLMS index: [llms.txt](/llms.txt)

---

Oink is a Hugo theme whose complete browser runtime ships with the theme. A
consumer site builds with Hugo Extended alone: no Node.js package installation,
PostCSS step, CDN, or build-time remote asset download is part of the default
path.

## Choose a starting point

- **Hugo Module — recommended:** import `github.com/pgsty/oink` in an existing
  or new Hugo site. See the [Oink quick start](/docs/oink/getting-started/).
- **Project site:** use the independent
  [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) repository
  as a complete bilingual configuration and regression reference.
- **Existing Docsy site:** follow the [migration guide](/docs/oink/migration/)
  to remove common overrides and the consumer npm asset pipeline without
  rewriting content.

## Install the prerequisites

Install Git, Go, and Hugo Extended `0.160.1` or newer. See
[Before you begin](docsy-as-module/installation-prerequisites/) for platform
notes and verification commands.

## Add Oink

From the site root:

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@THEME_REF
```

Then import the theme in `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/pgsty/oink
```

Pin `THEME_REF` to a released tag or immutable commit and commit `go.mod` and
`go.sum`.

## Build contract

The same commands preview and build every supported module consumer:

```sh
hugo server --disableFastRender
hugo --gc --minify
```

## Next steps

1. Set the [basic configuration](basic-configuration/).
2. Add repository, copyright, logo, and menu values.
3. Put translations side by side as `page.md` and `page.zh.md`.
4. Add and customize [content](/docs/content/).
5. Choose a [deployment target](/docs/deployment/).

---

Section pages:

- [Use the Oink theme](/docs/get-started/docsy-as-module/): Import the Oink Hugo Module or inspect the independent project site.
- [Other setup options](/docs/get-started/other-options/): Use an OINK archive, Git checkout, or Hugo Module.
- [Run OINK in a container](/docs/get-started/quickstart-docker/): Build and preview an OINK site with a Hugo Extended container.
- [Basic site configuration](/docs/get-started/basic-configuration/): Configure an OINK site, languages, navigation, and local features.
- [Troubleshooting and known issues](/docs/get-started/troubleshooting/): Diagnose OINK installation, build, language, search, and platform issues.
