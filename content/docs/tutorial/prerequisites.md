---
title: Prerequisites
linkTitle: Prerequisites
weight: 10
description: Install Hugo Extended, plus Git and Go when your method needs them.
---

The only **required** tool on the consumer side is Hugo Extended. Whether you
also need Git and Go depends on how you obtain the theme.

## Install Hugo Extended {#install-hugo-extended}

Install `{{% param hugoMinVersion %}}` or newer. The project site currently
validates against `0.164.0`.

Follow Hugo's [installation guides][installation guides] for your platform, then
check which binary is actually selected:

```sh
hugo version
```

The output **must contain `extended`**:

```console
$ hugo version
hugo v0.164.0+extended+withdeploy darwin/arm64
                  ^^^^^^^^
```

Standard Hugo has no embedded Sass compiler, cannot build the theme's SCSS, and
fails the build outright.

> [!TIP] Pin the same Hugo version locally and in CI. Debugging a build
> difference caused by version drift costs far more than writing a version into
> CI.

## When Git is needed {#when-git-is-needed}

Git is needed to:

- clone the site repository;
- obtain the theme as a submodule or clone;
- let Hugo read `.GitInfo`, which is where page last-modified dates come from.

```sh
git --version
```

Building from an already-extracted offline archive works with no network at all.
Version control is still recommended for the source itself.

## When Go is needed {#when-go-is-needed}

**Only the Hugo Module method needs Go.** Module commands call Go's module
machinery underneath:

```sh
go version
hugo mod graph
```

The offline archive, submodule, and clone methods build without Go.

## No frontend toolchain {#no-frontend-toolchain}

OINK ships Bootstrap, Font Awesome, LTR and RTL stylesheets, fonts, search, and
every browser runtime as **versioned local assets** inside the theme.

A consuming site does **not** install any of the following for the theme:

- Node.js / npm
- PostCSS / Autoprefixer
- RTLCSS
- any CDN-hosted browser package

If a tutorial tells you to install npm dependencies for a Docsy site, that is
the upstream Docsy workflow and does not apply to OINK.

There is one production command on the consumer side:

```sh
hugo --gc --minify
```

> [!NOTE] The OINK project-site repository (`oink.pgsty.com`) does contain Node
> commands, but those belong to **theme maintainers** running regression tests.
> They are not part of a consuming site's build.

## Offline and isolated environments {#offline-environments}

Before building in an isolated environment, confirm the theme archive contains:

- oink/
  - go.mod
  - hugo.yaml
  - LICENSE
  - NOTICE
  - VENDOR.json
  - assets/
  - layouts/
  - static/
  - i18n/
{.filetree}

`VENDOR.json` records the version, source, license path, and SHA-256 of every
bundled third-party component, and is the basis for an offline audit.

Install Hugo Extended **before** entering the isolated environment, then verify
by running the same build command with the network disabled.

## Next steps {#next-steps}

- [Install OINK](../install/): choose a distribution method and pin a version
- [Local-first](/docs/about/local-first/): the reasoning behind these
  constraints

[installation guides]: https://gohugo.io/installation/
