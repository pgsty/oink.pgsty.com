---
downstream_modified: true
title: Page chrome
description:
  The theme renders its complete branded navigation shell in every page.
---

The theme renders the complete navbar, sidebar, table of contents, search entry,
and footer in each applicable page. This is the canonical production structure
for normal builds, previews, offline archives, search crawlers, and clients
without JavaScript.

The experimental upstream `td.chrome = shared` donor/restoration mode is not
part of this theme. The `params.td.chrome` setting has no effect and should be
removed from migrated site configuration. Keeping one server-rendered structure
avoids a second visual implementation and keeps navigation, language selection,
accessibility semantics, and offline behavior deterministic.

Use Hugo minification and hosting-layer compression to reduce transfer size:

```sh
hugo --gc --minify
```

The interactive shell script enhances the already rendered markup; it is not
required to reconstruct missing navigation regions.
