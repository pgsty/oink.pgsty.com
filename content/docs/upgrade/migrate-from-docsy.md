---
title: Migrate an existing Docsy site
weight: 40
icon: fa-solid fa-right-left
description: Replace copied Docsy shells while preserving site-owned behavior.
aliases:
  [
    /docs/oink/migration/,
    /docs/update/convert-site-to-module/,
    /docs/updating/convert-site-to-module/,
  ]
---

OINK is intended to replace copied common shells, runtimes, and shortcodes
without forcing a bulk rewrite of ordinary content. A safe migration removes
overrides by dependency, keeps product-specific behavior in the site, and
validates a temporary copy before changing production.

## Migration principles

- Pin the target implementation; do not migrate production to an unversioned
  branch.
- Inventory overrides before deleting them.
- Remove common theme copies, not the site's business logic.
- Preserve content URLs, front matter, and shortcode behavior where the OINK API
  is compatible.
- Make unsafe or online exceptions explicit and temporary.
- Test build output, browser behavior, and hosted behavior as separate layers.

## Pin the target

Pin a published tag in `go.mod` or use the complete versioned archive. During
pre-release evaluation, a Hugo Module site can use an ignored Go workspace to
resolve a local checkout without editing the committed module version:

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=/absolute/path/to/oink
export HUGO_MODULE_WORKSPACE=go.work
hugo --gc --minify
```

The site's `hugo.yaml` imports `github.com/pgsty/oink`; the workspace
substitutes only the local checkout.

## Inventory existing overrides

Group each site-level file into one of four classes:

| Class                                    | Action                                 |
| ---------------------------------------- | -------------------------------------- |
| Exact or near-exact copy of common shell | Remove after OINK validation           |
| Reusable component now supplied by OINK  | Remove or mechanically rename          |
| Narrow brand or product customization    | Keep, then reduce to the smallest hook |
| Business-specific data or interaction    | Keep in the site                       |

Search `layouts/`, `assets/`, `static/`, configuration, and build workflows
together. A copied shortcode often has a matching JavaScript bundle, stylesheet,
vendor file, and CI install step.

## Move configuration

### Search and brand

Enable theme-owned local search and point the shell at the site's own logo:

```yaml
params:
  logo: img/product.svg
  offlineSearch: true
```

Continue using `title`, `languages.*`, `github_repo`, `github_project_repo`,
`github_branch`, `page_width`, and `ui.*` in their existing semantic locations.
Do not migrate values into an `oink.*` namespace.

### Fonts

The legacy Sass switch `$td-enable-google-fonts: true` now selects the local
Open Sans files shipped by OINK; it no longer requests Google Fonts.
`$td-web-font-path` is not part of the current build. A site that needs another
font must provide approved local assets and their licenses.

## Remove common overrides

After a temporary build proves equivalence, remove site copies of:

- `layouts/baseof.html` and common docs/blog `baseof*.html` files;
- common navbar, footer, sidebar, table-of-contents, search, head-CSS partials,
  and their hooks;
- old common branded documentation-shell partials;
- `asciinema`, `echarts`, `infographic`, `doc-carousel`, `details`,
  `tab`/`tabpane`, card, and `param` shortcode copies;
- JavaScript, Lunr copies, carousel code, and SCSS used only by those removed
  implementations;
- consumer PostCSS and Autoprefixer steps that no remaining site asset needs.

Delete by reference, not with a blanket removal of `layouts/`. Home pages,
download pages, and portals may still call local partials such as icons, search
dialogs, blog rows, or tag filters.

## Keep site-specific behavior

Keep content and code whose semantics belong to the product:

- product matrices and compatibility data;
- pricing, downloads, portals, solutions, and catalog pages;
- site-specific home-page composition;
- custom redirects, headers, analytics, or identity integrations;
- content components that encode business data rather than reusable
  presentation.

For the Pigsty family, `pgvers`, `pgext_matrix`, `pgext_os_matrix`, `home-docs`,
and the current `metric` implementation remain at the site layer.

## Reference-site matrix

The current migration plan uses these boundaries:

| Site   | Remove or migrate                                                                                                   | Keep                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| SILO   | Common docs/blog shell, core shortcodes, duplicate runtimes; set `logo: img/silo.svg`                               | Home page, download page, product data                 |
| PGSTY  | Common shell and core shortcodes; set `logo: img/logo/logo.svg`                                                     | Portal, solution, and enterprise pages                 |
| SOW    | Common docs/blog shell, core shortcodes, duplicate runtimes; set `logo: img/sow.svg`                                | Home page and repository-specific content              |
| Pigsty | Common shell, core shortcodes, duplicate runtimes; set `logo: icons/logo.svg` and retain reviewed ECharts callbacks | Extension matrices, home/pricing pages, catalog styles |

The matrix is a starting inventory, not permission to delete every similarly
named file. Resolve actual template references in the target checkout.

## Rehearsal workflow

Rehearse each migration in a disposable copy of the consuming site. Apply the
local Oink workspace, remove one planned override group, block unintended
network and frontend-tool access, and run the production build:

```sh
HUGO_MODULE_WORKSPACE=go.work hugo --gc --minify
```

Do not modify the source workspace during a rehearsal. Retain failed copies for
diagnosis and record the exact theme commit, Hugo version, removed files, and
output counts.

## Current evidence

The latest recorded rehearsal on 2026-08-08 used Hugo Extended `0.164.0`:

| Site   | Rehearsal result                                                                                                           | HTML files |
| ------ | -------------------------------------------------------------------------------------------------------------------------- | ---------: |
| SILO   | Removed 20 common overrides; built complete English and Chinese content with OINK shell, same-origin search, and site logo |      1,095 |
| PGSTY  | Removed 20 common overrides; built the bilingual portal and a temporary docs page for shell validation                     |         16 |
| SOW    | Removed 20 common overrides; built complete English and Chinese content with OINK shell, same-origin search, and site logo |        128 |
| Pigsty | Removed 24 common overrides; kept three business matrix shortcodes and existing ECharts callbacks                          |      2,473 |

These are temporary-copy build results, not proof that the four production sites
have been migrated or deployed.

## Production rollout

For each site:

1. create a dedicated migration branch;
2. pin the OINK candidate and record its source commit;
3. remove one coherent override group at a time;
4. run a clean Hugo-only build and focused automated tests;
5. compare representative home, docs, blog, special, and `404` pages;
6. check mobile navigation, both color modes, language switching, search, print,
   and the site's retained business components;
7. deploy a preview and verify its real URLs and requests;
8. merge and deploy only after review, then perform production smoke tests.

Record deliberate differences instead of forcing pixel equality where OINK
intentionally changes the shell.

## Rollback

Keep the pre-migration theme pin, site commit, and known-good deployment
artifact. A rollback should restore all three consistently. Reintroducing a
random subset of copied layouts against the new theme creates a hybrid state
that is harder to diagnose than either complete version.
