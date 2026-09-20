---
title: Upgrade
linkTitle: Upgrade
description: Pin a published theme version, upgrade from 1.0 to 1.1, migrate legacy content or a Docsy site, and roll back safely.
weight: 50
search_keywords: [upgrade, migration, version, Hugo Module, hugo mod get, oink06, Docsy, jQuery, breaking changes]
aliases:
  - /docs/upgrade/
  - /docs/upgrade/upgrade/
  - /docs/upgrade/from-docsy/
  - /docs/upgrade/v0-4/
---

Upgrading OINK is changing one pinned module version and confirming the site
still builds warning-free. Most content needs no change; where it does — 0.4
shortcodes becoming the current native Markdown forms — a dry-run-first migration tool
does it, so hundreds of files need not be edited by hand.

An upgrade changes rendered output. Create an upgrade branch before starting,
and the cost of backing out is discarding a branch.

## Read the release notes first {#release-notes}

Every version's changes, breaking changes and upgrade notes are in its release
notes; read the target version's before upgrading:

- The release series in this site's [project blog](/blog/)
- The [Releases page](https://github.com/pgsty/oink/releases) on GitHub

The notes say whether content has to change, whether a configuration key was
removed, and whether a default behaviour moved. Skipping this step means
guessing afterwards why a page looks different.

## Upgrading the Hugo Module {#hugo-module}

A production site pins a published release tag or a deliberately selected
immutable commit, follows no branch, and does not use `@latest`. The example
below upgrades to the published `v1.1.0` tag. For a later release, verify its
publication and module resolution before selecting that tag:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v1.1.0   # the published release tag
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

When selecting a tag, confirm that the module graph shows that exact version.
A deliberately selected immutable commit is normally recorded as a Go
pseudo-version; that is valid if it resolves to the intended commit, but it is
not evidence of a named release. Commit the resulting `go.mod` and `go.sum`.
For the published tag in this example, `go.mod` contains:

```go {title="go.mod"}
module github.com/pgsty/oink.pgsty.com

go 1.27.0

require github.com/pgsty/oink v1.1.0
```

> [!DANGER] A local module replacement overrides that pin
> `make dev` and `make check` set `HUGO_MODULE_REPLACEMENTS` for that command
> only, using the sibling theme checkout. To judge whether a release tag works,
> use `make build` without a replacement; otherwise what is verified is the
> local copy.

For a Git submodule, check that it has no local edits, fetch the tags, and
check out the exact published version rather than following its remote branch:

```bash {title="Terminal"}
git -C themes/oink fetch origin --tags
git -C themes/oink checkout --detach v1.1.0
git add themes/oink
```

Commit the updated submodule pointer after validation. For an offline archive
or clone, replace `themes/oink/` with the selected version's complete tree and
confirm that `theme:` still matches the directory name. The install-method
tradeoffs are in
[From scratch and other install methods](/docs/start/from-scratch/).

## What to do after upgrading {#after-upgrade}

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning --logLevel info
```

That does three things at once: clears possibly stale caches, rebuilds with the
new version, and turns any warning into a failure.

`--logLevel info` includes informational diagnostics, while
`--panicOnWarning` treats warnings as failures. Review the deprecation messages
emitted by the pinned Hugo version before upgrading it; the severity and
removal schedule depend on the deprecated feature.

Once the build passes, look with your own eyes: the home page, a documentation
page, a blog page, the 404, both languages, both colour schemes, the print view,
and anywhere the site customized something.

## Upgrading from 1.0 to 1.1 {#from-1-0}

> [!IMPORTANT] OINK 1.1.0 upgrade checklist
> This checklist covers the published v1.1.0 release. Each consumer still needs
> to update its dependency pin, rebuild and deploy; theme publication does not
> upgrade an existing site automatically.

No source migration is required from 1.0.0. Hugo Extended 0.160.1 remains the
floor; CI uses the pinned 0.165.0 toolchain. The module's Go 1.27.0 directive is
unchanged from 1.0.0. On Hugo 0.160.x, a non-default generic `zh` language
alongside the regional Chinese catalogs needs `locale: zh-CN`.

Review the affected surfaces before choosing the new pin:

| Surface | 1.1 behavior and upgrade check |
| --- | --- |
| Languages | All 32 interface catalogs have the same native-message schema. Check the site's language labels, plural counts, and RTL direction; authored translations remain the site's responsibility. |
| Taxonomies | Root pages become term-card directories with a taxonomy switcher. Review any taxonomy-template or CSS overrides, author portraits, and localized breadcrumbs. |
| Sidebars | Cached trees preserve effective page settings and remain usable without JavaScript. Exercise collapse, hover restore, mobile drawer, and keyboard focus; hidden content must leave the focus order. |
| Groups | `sidebar_divider: true` retains a section's children. Add `build.render: never` only when that group's own outputs are intentionally omitted; verify child navigation, breadcrumbs, paging, Print, and Book contents. |
| Root menus | Explicit `sidebar_root_menu: false` now applies to self-root sections too. The current linkable root remains a location marker. |
| Custom scripts | Feature-detect `OinkSidebar` and `OinkCommandPalette.registerSearchTail` if an integration must also support 1.0.0. Restore branch state through the API rather than changing classes or ARIA attributes directly. |
| Copying articles | With image zoom enabled, copy an image and its caption as plain text and rich HTML. Preview instructions must not enter the copied article; zoom and its keyboard controls must still work. |
| Print and Redoc | Check page and Book aggregate Print, heading and tab links, and local Redoc specifications under the real deployment prefix. Local specification paths are rooted under `static/`. |
{.fields}

`params.ui.image_zoom` and `params.offline_search` remain off by default. The
new search hook does not enable a remote provider or add query telemetry.
`params.ui.scroll_spy` and page-level `scroll_spy` remain accepted no-ops in
1.x; removing the obsolete patch does not disable normal outline tracking.

Update or remove affected site-level copies of theme code after comparing
them with the new implementation. A copied old image-zoom script or sidebar
partial will otherwise continue to hide the upstream fix.

To test local theme changes with the documentation site, use its sibling theme
checkout without committing a filesystem replacement:

```bash {title="Terminal — from oink.pgsty.com"}
make check
make browser
make dev
```

These commands validate the local checkout. For release acceptance, pin the
published version, build without a module replacement, then validate the deployed pages.
The authoring and API details live in [content groups](/docs/write/organize/#group-only),
the [sidebar contract](/docs/design/shell/#sidebar-runtime),
[search actions](/docs/customize/panel/#search-tail), and
[image zoom](/docs/components/image/#zoom).

## The content migration toolkit {#migration-toolkit}

A batch of 0.4 shortcodes became the current native Markdown forms. The theme
repository ships a tool for that, depending only on the Python standard library:

```bash {title="Terminal"}
git clone https://github.com/pgsty/oink
cd oink

# 1. read-only inventory: what several sites would change, exportable as Markdown / JSON
python3 bin/migrations/oink06.py report --sites ~/pgsty/oink.pgsty.com ~/www/ddia --md report.md

# 2. dry run: prints a diff and counts per file, writing nothing
python3 bin/migrations/oink06.py migrate --site ~/pgsty/oink.pgsty.com

# 3. apply: written atomically
python3 bin/migrations/oink06.py migrate --site ~/pgsty/oink.pgsty.com --write

# 4. check for residue: exit code 1 while legacy syntax remains
python3 bin/migrations/oink06.py check --site ~/pgsty/oink.pgsty.com
```

Four things to remember while using it:

- A dry run is the default, and only `--write` touches disk. Dry-run, read the diff, then write.
- A second run should change nothing. A second `--write` still reporting changes means a transformation is not converging; stop and look at those files.
- Text inside fences is untouched, so a documentation site demonstrating the old syntax is not damaged.
- A construct it cannot express is left as it stands and listed with `file:line` and a reason, as a manual work list rather than a failure.

To convert one class first, use `--only` with the keys in the table's last
column:

```bash {title="Terminal"}
python3 bin/migrations/oink06.py migrate --site ~/www/ddia --only callout,tabs --write
```

Rebuild afterwards (with `--panicOnWarning`) and look at the rendered pages: the
tool guarantees correct syntax, not that the meaning is what you intended.

## The 0.4 → current syntax map {#syntax-map}

| The 0.4 form | The current form | `--only` key |
| --- | --- | --- |
| `{{%/* alert color= title= */%}}`, `{{%/* details */%}}`, `{{%/* pageinfo */%}}`, hand-written `<details><summary>` | `> [!TYPE] Title` / `> [!DETAILS]-` | `callout` |
| `{{</* tabpane */>}}` + `{{%/* tab header= */%}}`, `{{</* code-group */>}}` + `{{</* code-tab */>}}` | Adjacent fences with `{tab= group= value=}`; tabs in running text use `{{</* tabs */>}}` + `{{</* tab */>}}` | `tabs` |
| `{{</* filetree */>}}` with `filetree/folder` and `filetree/file` | The `filetree` data fence | `filetree` |
| `{{</* gallery */>}}` with `gallery/image` | The `gallery` data fence | `gallery` |
| `{{</* echarts */>}}`, `{{</* infographic */>}}` | Data fences of the same name (`$fn:` is unchanged; a `js` subfence moves to `window.OinkEchartsFunctions`) | `datafence` |
| `doc-cards` / `doc-card`, `nav-cards` / `nav-card`, `card` / `cardpane`, `doc-carousel` | `{{</* cards */>}}` + `{{</* card */>}}`, or a link list with `{.cards}` | `cards` |
| `{{</* imgproc */>}}`, `{{</* image */>}}` | `![alt](src)` with the attribute line `{command= options= caption=}` | `image` |
| `{{</* readfile file= */>}}` | `{{</* include file= */>}}` | `include` |
| The fence attribute `{filename="x"}` | `{title="x"}` | `fencetitle` |
| `{{</* badge outline= */>}}` | Drop the `outline` parameter | `badge` |
| `{{</* example */>}}` + a fence, `{{</* book-figures kind="tbl" */>}}` | `{{</* eg */>}}…{{</* /eg */>}}`, `{{</* book-tables */>}}` | `eg` |
| `{{%/* _param x */%}}`, `iframe`, `conditional-text`, `blocks/*`, `netlify`, a kindless `xref` | Reported only; handle by hand | `reportonly` |
{.fields}

What each new form looks like and what parameters it takes is on its page under
[Components](/docs/components/).

## Migrating from Docsy {#from-docsy}

OINK is a hard fork of Docsy: the content model, the `td-` naming, the Sass
variables and most front matter are still there. The core of a migration is
deleting the copies of the shared shell in the site and letting the theme's
implementation take over — not rewriting the prose.

1. Pin the target version. Change `go.mod` to an OINK release tag, or use a complete versioned archive. During evaluation, an uncommitted `go.work` can point at a local checkout.

1. Inventory the overrides. Sort every site-level file under `layouts/`, `assets/` and `static/` into four classes: copies of the shared shell (delete after verifying), components OINK already provides (delete or rename mechanically), brand customization (keep, reduced to the smallest hook), and business-specific data and interaction (stays in the site). Delete by reference order, and do not empty `layouts/` at once: the home page and download page may still call a partial you are removing.

1. Move the configuration. `title`, `languages.*`, `github_repo`, `github_branch`, `page_width` and `params.ui.*` all stay in their existing semantic positions; OINK opens no namespace of its own. Search and the logo are just keys to turn on:

   ```yaml {title="hugo.yml"}
   params:
     logo: img/product.svg
     offline_search: true
   ```

   Docsy's camelCase search keys have been renamed in OINK: `offlineSearch`,
   `offlineSearchIndex`, `offlineSearchMaxResults`, `offlineSearchOnServe` and
   `offlineSearchSummaryLength` all become their underscored forms. Rename them
   deliberately — the migration registry that used to stop the build and name
   the replacement has been removed, so an old key is now simply a key nobody
   reads, and search stays off with no message at all.

1. Fonts and styling compatibility. The Docsy Sass variables in the site's `assets/scss/_variables_project.scss` still work as the seed values for the font roles, and need not be deleted to upgrade: `$td-fonts-serif`, `$font-family-sans-serif`, `$headings-font-family` and `$font-family-code` each feed their role. Docsy's Google Fonts switches `$td-enable-google-fonts`, `$td-google-font-name` and `$td-web-font-path` are no longer read by the theme; leaving them breaks nothing and does nothing, because OINK ships Inter, Chakra Petch and IBM Plex Mono and neither preset requests anything from Google Fonts. To change fonts, go through the token layer — see [Brand and appearance](/docs/customize/brand/).

1. Convert the shortcodes. Docsy's `alert`, `pageinfo`, `tabpane` and `card` families all have a current counterpart; convert them in bulk with the [migration toolkit](#migration-toolkit) above, one `--only` class at a time.

1. Delete one group at a time, building after each. Rehearse on a scratch copy, recording the theme commit, the Hugo version, which files were removed and how many HTML files came out; only after confirming equivalence, repeat it on the production branch.
{.steps}

The "delete after verifying" class in step two is usually these files:

- `layouts/baseof.html` and the shared docs / blog `baseof*.html`;
- The navbar, footer, sidebar, TOC, search and head CSS partials and their hooks;
- The old brand documentation shell partials;
- Copies of the `asciinema`, `echarts`, `infographic`, `doc-carousel`, `details`, `tab` / `tabpane`, card and `param` shortcodes;
- The JavaScript, Lunr copy, carousel code and SCSS that served only those implementations;
- PostCSS and Autoprefixer steps no site asset needs any more.

Two kinds of problem surface after the deleting.

A site's own script reports `$ is not defined`: the theme does not bundle
jQuery, which Docsy used to load in every page's `<head>`. Nothing in the theme
needs it, and a site that still does loads it itself:

```html {title="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

A home page built from Docsy's `blocks/*` fails an OINK build with
`template for shortcode "blocks/cover" not found`: the theme has no such
shortcode family. Switch to home page sections in
`data/home/<language>.yaml`, or give the page `layout: landing` — see
[Home and landing pages](/docs/customize/home/).

## Upgrading from 0.4 {#from-0-4}

0.4 changed several defaults. If the page gained or lost something after the
upgrade, check these first:

- Sequential paging is on by default. `docs`, `book` and `blog` pages all have previous / next at the page end; documentation follows the sidebar tree and the blog follows time. A page deliberately outside any sequence opts out with `pager: false`.
- The navbar shows on every layout. Its compact state is one row of icon navigation, with no second mobile accordion menu, so local scripts and tests that depend on the old mobile menu have to go. A whole section without a navbar uses `navbar_enabled: false` in a cascade.
- The footer defaults to `fat` site-wide. Only `fat` / `slim` / `none` are accepted, and footer data must live in `data/footer/<language>.yaml` (or `data/footer.yaml` on a single-language site); a leftover `footer` key in `data/home` warns with the new location, and strict publishing rejects it.
- Single-key navigation is on by default: `/` opens full search and `\` command-only mode. Training material describing the old behaviour needs updating. Page actions have also moved to a split button beside the breadcrumbs.
- The code block DOM changed. A `.td-code` wrapper now encloses the original `.highlight` (both `.highlight` and `.chroma` are kept), so a direct child selector such as `.td-content > .highlight` in site CSS becomes the descendant selector `.td-content .highlight`.
- Two ICP footer parameters were removed: `footer_icp` and `footer_icp_url` became one string accepting inline Markdown.

  ```yaml {title="hugo.yml"}
  params:
    footer_center_info: '[京ICP备00000000号](https://beian.miit.gov.cn/)'
  ```

- Mathematics needs the site to enable passthrough. Hugo does not merge a theme's `markup` configuration, so a site using `\(…\)`, `\[…\]` or `$$…$$` must enable the Goldmark passthrough extension in its own `hugo.yml` — see [Math](/docs/components/math/).

The complete configuration for all of these is in
[Configuration](/docs/customize/config/) and
[Layouts and page types](/docs/customize/layout/).

## Verify {#verify}

An upgrade is not finished at "the build passed". Look at each surface:

| Surface | What to look at |
| --- | --- |
| Documentation / Book | Sidebar order, paging, headings, page actions, numbering and cross-references |
| Blog | Chronological paging, RSS ownership, navbar and footer |
| Home / landing | Content without JS, the compact menu, print |
| Release pages | Derived download URLs, checksums, publication state |
| Components | One page each for the components the site uses most |
| Accessibility | A keyboard-only pass, focus order, both colour schemes, forced-colors mode |
| Deployment | Internal links and assets all keep the base path prefix |
{.fields}

This site's full gate is:

```bash {title="Terminal"}
make check     # local sibling theme: build, outputs, translations, and rendered links
make browser   # local sibling theme: accessibility, responsive and interactive behavior
make build     # published theme pinned in go.mod, without a local replacement
```

Another site runs the equivalent build, link, output and browser checks; the
details are in
[Troubleshooting](/docs/admin/troubleshooting/#site-checks).

> [!IMPORTANT] A successful local build is not a completed release
> A validated source commit, a published tag that resolves through the module
> proxy, a consumer pin with its checksum, and a verified production deployment
> are separate states. One green local build does not prove the others.

The last step happens in the real environment: deploy a preview, verify the
pages and the browser's network requests on the real URL, merge once reviewed,
and smoke-test production afterwards.

## Rollback {#rollback}

What rolls back is the version pin, not the working tree:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v1.0.0   # example: the site's last known-good tag
hugo mod tidy
rm -rf public resources/_gen
hugo --gc --minify --panicOnWarning
```

Three principles:

- Keep the pre-upgrade module pin, the site commit and the known-good deployment artifact, and restore all three together.
- Do not roll back only part of it. Putting a few old layout copies back on top of a new theme produces a hybrid harder to diagnose than either complete version.
- Keep the upgrade branch and its acceptance evidence. A rollback restores production first; it does not throw away the work already done.

Rolling back the deployed output itself (republishing the previous deployment)
is in [Deploy](/docs/admin/deploy/#rollback).

## Related {#related}

- [Deploy](/docs/admin/deploy/) — rolling back deployed output
- [Troubleshooting](/docs/admin/troubleshooting/) — reading a build error after an upgrade
- [Local preview](/docs/admin/preview/) — clearing caches and the `go.work` workspace
- [From scratch and other install methods](/docs/start/from-scratch/) — weighing the four install methods
- [Components](/docs/components/) — each component's current form
