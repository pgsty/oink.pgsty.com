---
title: OINK migration boundary
linkTitle: Migration boundary
description: Supported source, configuration, and validation boundaries for OINK migration, including the 1.2.0 changes.
weight: 50
icon: fa-solid fa-code-compare
search_keywords: [OINK migration contract, 0.4 migration, 0.5 migration, configuration rename, migration toolkit]
contract_status: v1.2.0
---

> [!NOTE] OINK 1.2.0 contract
> This contract describes the v1.2.0 release. Its canonical bilingual sources
> are in `content/docs/design/`.

This is source and configuration guidance, not a release ledger. Local source,
commit, tag, push, consumer pin, deployment, and production parity remain
separate states. For the reader-facing upgrade procedure, see
[Upgrade](/docs/admin/upgrade/).

## Toolkit scope {#toolkit-scope}

`bin/migrations/oink06.py` only scans and automatically rewrites Markdown files
under a site's content directory, including supported YAML front matter. It
does not rewrite Hugo configuration, data files, layouts, assets, modules, or
generated output. TOML/JSON front matter and ambiguous Markdown are reported
with positions for manual review.

Dry-run is the default and a completed migration is idempotent:

```sh
python3 bin/migrations/oink06.py report --sites <dir>... --md report.md --json report.json
python3 bin/migrations/oink06.py migrate --site <dir>
python3 bin/migrations/oink06.py migrate --site <dir> --write
python3 bin/migrations/oink06.py check --site <dir>
```

Code-fence contents are not rewritten, including fences that begin on the
same line as an ordered or unordered list marker, with optional blockquotes.
An extra literal quote prefix inside a code example does not close that fence.
`book_figures.py` retains narrow TPME, DDIA
v1/v2, and pg-internal profiles; it is not a generic parser.

The isolated validation tools `bin/measure-baseline.py` and
`bin/sites/build-all.py` reject snapshot destinations that overlap any input
site, the running tools checkout, the selected theme checkout, or another
snapshot before deleting existing output. This includes `--keep` destinations
reached through symlink aliases and an alternate `--theme` checkout.

## Updating consumer repositories {#updating-consumers}

After publishing a theme release, inventory maintained consumer checkouts and
upgrade their exact pins. The theme's `bin/update-consumers.py` scans immediate
project directories under the supplied roots; it does not recurse into
archives, generated sites, caches, or theme fixtures.

The tool ships with OINK 1.2.0. Run it from the theme checkout to inventory
consumers and upgrade them to the published tag.

```sh
python3 bin/update-consumers.py v1.2.0 --roots ~/www ~/pgsty
python3 bin/update-consumers.py v1.2.0 --roots ~/www ~/pgsty --write --check
```

The first command only reports adoption. The second updates `go.mod` and
OINK's `go.sum` entries, verifies the exact module graph, and builds each
selected site with warnings fatal. It disables `GOWORK`, Hugo's module
workspace, and environment module replacements. Logs and original module
files go to a temporary report directory, or an explicit `--report-dir`.
The tool restores module files if the update fails; a build failure leaves
the new pin available for diagnosis and returns a failing status.
An unreadable scan root or malformed consumer module is recorded as a failed
entry; the inventory continues through the remaining sites and exits nonzero.
An explicitly selected missing or non-consumer directory also fails visibly.

Linked worktrees, hidden copies, and non-default branches are skipped. Review
all skipped and blocked entries: `--sites <path>...` explicitly selects a
reviewed checkout, including one with existing module edits. OINK replacements
in `go.mod` require manual resolution. Vendored themes require a separate
review before `--refresh-vendor`, which backs up and regenerates `_vendor/`;
changing a module pin alone does not update a vendored theme.

Preserve unrelated work, update current theme-version references in site
READMEs and configuration, and run each site's owning checks and visual
review. The tool does not edit content, commit, push, or deploy. Record those
completion states separately, including consumers already on the target tag.

## 0.4 content to current forms {#content-to-current-forms}

| Removed form | Current form | Toolkit key |
| --- | --- | --- |
| `alert`, `details`, `pageinfo`, raw disclosure | `> [!TYPE]` callout | `callout` |
| `tabpane`, legacy `tab`, `code-group`, `code-tab` | adjacent `{tab=}` blocks or `tabs` / `tab` | `tabs` |
| FileTree shortcodes or `{.filetree}` list | `filetree` fence | `filetree` |
| Gallery shortcodes or `{.gallery}` list | `gallery` fence | `gallery` |
| ECharts / infographic shortcode | same-named data fence | `datafence` |
| Docsy card families | `.cards` list or `cards` / `card` | `cards` |
| `imgproc`, `image` | Markdown image + attributes | `image` |
| `readfile` | `include` | `include` |
| fence `filename=` | `title=` | `fencetitle` |
| `badge outline=` | remove `outline` | `badge` |
| leaf `example`, `book-figures kind=` | `eg`, explicit `book-*` index | `eg` |
| percent-delimited fields | angle-delimited `fields` / `field` | `fieldsdelim` |
| Docsy `_param` placeholders and `card header=` highlights | Font Awesome / `badge` / `param` or callout | `param_placeholders` |
| unsupported legacy shortcodes | manual review with source position | `reportonly` |

## Configuration and front matter {#configuration-and-front-matter}

The following configuration changes are manual; the toolkit may report
matching front-matter keys but never edits site configuration.

| Old | Current |
| --- | --- |
| `offlineSearch*` | `offline_search*` |
| `disable_click2copy_chroma` | `ui.code_copy` (inverted) |
| `content_width` | `reading_width: slim | normal | wide` |
| `github_url` | `github_repo` |
| `ui.no_left_sidebar` | `ui.sidebar_enabled` (inverted) |
| breadcrumb aliases | `ui.breadcrumb` |
| `ui.scrollSpy` | No behavioral replacement; `ui.scroll_spy` remains a quiet 1.x compatibility no-op |
| `ui.showLightDarkModeMenu` | `ui.dark_mode.show_menu` |
| `ui.readingtime` | `ui.reading_time` |
| `ui.ul_show` | `ui.sidebar_expand_levels` |
| `ui.docs_root` | `ui.docs_sidebar_root` |
| `ui.pager` | `ui.pager_types` |
| `{ enable: bool }` annotation/zoom/keyboard/reading maps | bare booleans |
| `ui.typography.preset` | `ui.typography` |
| `print.disable_toc` | `print.toc` (inverted) |

Prism, `rss_sections`, and `algolia_docsearch` are removed. Chroma is the only
highlighter; Algolia configuration is `search.algolia`. Page overrides drop the
`ui.` prefix. Legacy `hide_feedback`, `hide_readingtime`, `exclude_search`,
`content_width`, camelCase manual links, and nested front-matter `ui` maps are
reported with replacements.

## 0.5 to 0.6 {#from-05-to-06}

- Replace `upstream_attribution` with `upstream_link` plus
  `upstream_name`, `upstream_copyright`, `upstream_license`, and
  `upstream_notice`; rename `downstream_modified` to `upstream_modified`.
- Replace the `release` map with one GitHub `release_url`; remove
  `release_products` and `release_group_by_product` from release indexes.
- Blog and default dates now default to ISO `2006-01-02`; retain explicit
  `time_format_blog` or `time_format_default` for prose dates.

Removed names warn and take the documented safe fallback or render nothing;
ordinary previews continue, while `--panicOnWarning` rejects them at a strict
gate. `blog_index_toggle`, `featured_image: hero`, `toc_style`, and
`toc_taxonomies` are additive opt-ins. They introduce no content type;
immersive reading stays on the ordinary blog shell.

## Prerequisites and validation {#prerequisites-and-validation}

Enable Goldmark unsafe rendering, block attributes, and standalone block images
as shown in the [component contract](/docs/design/components/). Enable
passthrough explicitly for `\(...\)`, `\[...\]`, or `$$...$$`; Hugo does not
merge theme markup config.

Run the smallest source and output checks for the changed contract with the
pinned Hugo Extended 0.165.0 toolchain, JS tests when runtime changes, and
strict root and subpath builds. For maintained sites, inspect representative
EN/ZH Docs and Blog routes at desktop and narrow widths, then record pin,
deployment, and hosted parity separately.
