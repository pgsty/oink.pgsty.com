---
title: Install OINK
linkTitle: Install OINK
weight: 20
description:
  Pin an OINK version with Hugo Modules, or choose the offline archive,
  submodule, or clone alternatives.
---

OINK is published as the Hugo Module `github.com/pgsty/oink`. **Modules are the
recommended method for every site** — it is the only one where Hugo resolves the
version, verifies checksums, and leaves an audit record in `go.sum`.

The other three methods exist for specific constraints: network isolation, a
platform that requires a complete source tree, or an organization that reviews
its own copy of the theme. They are covered under
[Other installation methods](#other-installation-methods).

## Prerequisites {#prerequisites}

The module method needs Git, Go, and Hugo Extended
`{{% param hugoMinVersion %}}` or newer:

```sh
git --version
go version
hugo version
```

The `hugo version` output must contain `extended`. Standard Hugo cannot compile
the theme's SCSS and fails the build.

Platform-specific instructions are in [Prerequisites](../prerequisites/).

## Add the module {#add-the-module}

Initialize a module in the site root if it does not have one, then pin an OINK
version:

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{% param tdVersion.latest %}}
```

Import it in `hugo.yaml`:

```yaml {filename="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

Commit the generated `go.mod` and `go.sum`.

> [!IMPORTANT] A production site must pin a release tag or an immutable commit
> rather than following `main`. `@latest` is a one-time resolution, not a
> version policy: it writes whatever is newest at that moment into `go.mod`, and
> someone running it later can resolve something different.

## Preview and build {#preview-and-build}

```sh
hugo server --disableFastRender   # local preview
hugo --gc --minify                # production build
```

Bootstrap, Font Awesome, fonts, search, diagrams, API documentation runtimes,
and content components all ship with the theme. **A consuming site needs no
`node_modules` directory** and installs no frontend toolchain for the theme.

## Develop against a local checkout {#develop-against-a-local-checkout}

This section applies only when you change the theme and the site together. Clone
both repositories as siblings:

```text {title="Sibling layout" copy=false}
~/pgsty/
├── oink/            # theme
└── product-docs/    # your site
```

Point the module at the local copy with a Go workspace:

```sh
cd ~/pgsty/product-docs
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
hugo server
```

> [!WARNING] Do not commit `go.work`. The committed `go.mod` still pins the
> public module; the workspace only substitutes the sibling checkout on your
> machine. CI and production builds never see `go.work` and use the pinned
> version.

## Other installation methods {#other-installation-methods}

These three methods do not need Go, and the site references the theme with
`theme: oink` instead of `module.imports`. Their shared cost is that **version
resolution and integrity verification become your responsibility**.

### Offline archive {#offline-archive}

The first choice for network-isolated environments. A complete archive contains
the theme, local browser runtimes, fonts, `LICENSE`, `NOTICE`, `VENDOR.json`,
and checksums.

```text {title="Theme directory layout" copy=false}
site/
├── hugo.yaml
└── themes/
    └── oink/
```

```yaml {filename="hugo.yaml"}
theme: oink
```

Verify the archive checksum before extracting. Use only archives attached to a
published release; a locally assembled file must not be described as a published
distribution.

### Git submodule {#git-submodule}

Records the exact theme commit in the site repository:

```sh
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{% param tdVersion.latest %}}
git add .gitmodules themes/oink
git commit -m "Add OINK theme at {{% param tdVersion.latest %}}"
```

CI must initialize the submodule before running Hugo, or `themes/oink` is empty:

```sh
git submodule update --init --recursive
```

### Pinned clone {#pinned-clone}

Use this when the hosting platform requires the build input to contain a
complete theme tree:

```sh
git clone https://github.com/pgsty/oink.git themes/oink
git -C themes/oink checkout {{% param tdVersion.latest %}}
```

Record the resolved commit and the restore procedure. If these files are
committed to the site repository, **OINK's `LICENSE`, `NOTICE`, and
`VENDOR.json` must be preserved**.

### Comparing the four methods {#comparison}

| Method          | Needs Go | Version auditable             | Use when                       |
| --------------- | -------- | ----------------------------- | ------------------------------ |
| **Hugo Module** | yes      | `go.sum` verifies it          | the default                    |
| Offline archive | no       | manual checksum               | network isolation              |
| Git submodule   | no       | repository records the commit | theme source must live in-repo |
| Pinned clone    | no       | you record it                 | platform requires a full tree  |

## Next steps {#next-steps}

- [Create a site](../create-site/): from an empty directory to a first page
- [Basic configuration](../configuration/): identity, languages, search
