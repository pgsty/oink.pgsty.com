---
downstream_modified: true
title: Migrate from the Docsy npm package
linkTitle: From npm
aliases: [/docs/updating/updating-npm-package/]
weight: 2
description: Remove the upstream npm theme package from an OINK consumer site.
---

The upstream `@docsy/theme` npm package is not an OINK distribution channel.
OINK ships Bootstrap, Font Awesome, fonts, and browser runtimes directly with
the theme so that consumer sites build with Hugo Extended alone.

## Remove the npm theme integration

First select an OINK distribution: a versioned archive, Git submodule or clone,
or the compatibility Hugo module. Make that theme available to Hugo and confirm
that `hugo --gc --minify` can resolve it.

Then remove `@docsy/theme` and any dependencies used only to build Docsy assets
from the site's `package.json`. Remove npm mounts for Bootstrap and Font Awesome
from Hugo configuration, along with PostCSS and Autoprefixer build steps that
exist only for the old theme pipeline.

Do not delete application dependencies merely because they use npm. The
Hugo-only contract covers the documentation theme; a site-owned application or
business component may have a separate, intentional toolchain.

## Verify the migration

Build from a clean checkout with Hugo Extended and no `node_modules` directory:

```sh
hugo --gc --minify
```

Check LTR and RTL pages if the site supports both. Verify local fonts and icons,
search, diagrams, API documentation, and any migrated content components. Once
the build is clean, remove obsolete lockfiles only if no site-owned tooling uses
them.

Continue with [Review theme overrides](/docs/update/#update-overrides).
