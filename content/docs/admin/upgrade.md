---
title: Upgrade
linkTitle: Upgrade
description: Move to a new theme version, convert 0.4 shortcodes to v5 syntax with the migration toolkit, migrate from Docsy, and roll back when something goes wrong.
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
shortcodes becoming v5's native Markdown forms — a dry-run-first migration tool
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

A production site pins a release tag or an immutable commit, follows no branch,
and does not use `@latest`:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v0.7.0   # the tag from the release notes
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

The last command must show that tag itself resolving, not a pseudo-version
(`v0.0.0-2026...-abcdef`) or `main`. The pinned version lands in `go.mod` and is
committed with the code:

```go {title="go.mod"}
module github.com/pgsty/oink.pgsty.com

go 1.26.6

require github.com/pgsty/oink v0.7.0
```

> [!DANGER] A local module replacement overrides that pin
> `make dev` and `make check` set `HUGO_MODULE_REPLACEMENTS` for that command
> only, using the sibling theme checkout. To judge whether a release tag works,
> use `make build` without a replacement; otherwise what is verified is the
> local copy.

One line for each other install method. Git submodule: fetch the new ref with
`git submodule update --remote themes/oink` and commit the submodule pointer.
Offline archive and clone: replace `themes/oink/` wholesale with the new
version's unpacked tree, and confirm `theme:` still matches the directory name.
Weighing the three is in
[From scratch and other install methods](/docs/start/from-scratch/).

## What to do after upgrading {#after-upgrade}

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning --logLevel info
```

That does three things at once: clears possibly stale caches, rebuilds with the
new version, and turns any warning into a failure.

`--logLevel info` is there to surface Hugo's deprecation notices. Hugo
deprecates in two stages: first a `WARN` (still usable), then an `ERROR` in the
next version (the build fails). Carrying `--panicOnWarning` finds them a version
early and leaves you the time to fix them.

Once the build passes, look with your own eyes: the home page, a documentation
page, a blog page, the 404, both languages, both colour schemes, the print view,
and anywhere the site customized something.

## The content migration toolkit {#migration-toolkit}

A batch of 0.4 shortcodes became native Markdown forms in v5. The theme
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

## The 0.4 → v5 syntax map {#syntax-map}

| The 0.4 form | The v5 form | `--only` key |
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

1. Convert the shortcodes. Docsy's `alert`, `pageinfo`, `tabpane` and `card` families all have a v5 counterpart; convert them in bulk with the [migration toolkit](#migration-toolkit) above, one `--only` class at a time.

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

A home page built from Docsy's `blocks/*` fails the v5 build with
`template for shortcode "blocks/cover" not found`: the theme has no such
shortcode family. Switch to home page sections in
`data/home/<language>.yaml`, or give the page `layout: landing` — see
[Home and landing pages](/docs/customize/home/).

## Upgrading from 0.4 {#from-0-4}

0.4 changed several defaults. If the page gained or lost something after the
upgrade, check these first:

- Sequential paging is on by default. `docs`, `book` and `blog` pages all have previous / next at the page end; documentation follows the sidebar tree and the blog follows time. A page deliberately outside any sequence opts out with `pager: false`.
- The navbar shows on every layout. Its compact state is one row of icon navigation, with no second mobile accordion menu, so local scripts and tests that depend on the old mobile menu have to go. A whole section without a navbar uses `navbar_enabled: false` in a cascade.
- The footer defaults to `fat` site-wide. Only `fat` / `slim` / `none` are accepted, and footer data must live in `data/footer/<language>.yaml` (or `data/footer.yaml` on a single-language site); a leftover `footer` key in `data/home` fails the build with the new location.
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
npm test           # build assertions, Markdown and favicon goldens, translation parity, rendered links
npm run test:browser   # Playwright: accessibility, responsive shell, keyboard navigation, content components, code blocks, scenario components
```

Another site runs the equivalent build, link, output and browser checks; the
details are in
[Troubleshooting](/docs/admin/troubleshooting/#site-checks).

> [!IMPORTANT] A successful local build is not a completed release
> The source building, the tag being signed and resolvable through the Go proxy,
> the site pinning that tag, and production being deployed are four things, each
> recorded separately. Do not let one green local build stand in for them.

The last step happens in the real environment: deploy a preview, verify the
pages and the browser's network requests on the real URL, merge once reviewed,
and smoke-test production afterwards.

## Rollback {#rollback}

What rolls back is the version pin, not the working tree:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v0.4.0   # the last known-good tag
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
- [Components](/docs/components/) — each component's v5 form
