---
title: Upgrade
linkTitle: Upgrade
description: Pin a theme version, upgrade to 1.3.2, migrate legacy content or a Docsy site, and keep a rollback path.
weight: 50
search_keywords: [upgrade, migration, version, Hugo Module, hugo mod get, oink06, Docsy, jQuery, breaking changes]
aliases:
  - /docs/upgrade/
  - /docs/upgrade/upgrade/
  - /docs/upgrade/from-docsy/
  - /docs/upgrade/v0-4/
---

To upgrade OINK, change the pinned module version. Then confirm that the site
builds with reviewed diagnostics. Most content needs no changes. To convert 0.4
shortcodes to current native Markdown forms, use the migration tool. It starts
with a dry run and avoids manual edits to hundreds of files.

An upgrade changes rendered output. Before you start, create an upgrade branch.
You can discard that branch if you cancel the upgrade.

> [!IMPORTANT] Current Hugo baseline
> Current development and validation use Hugo Extended 0.168.0.
> Update Hugo workflow pins when upgrading; older-Hugo compatibility is no
> longer maintained. Version requirements in the older release sections below
> describe those releases only.

> [!NOTE] OINK 1.3.2 build requirements
> Maintained sites use Hugo Extended 0.168.0 and its built-in LibSass.
> No external Sass installation is required. Keep the upstream LibSass warning
> visible and review it; do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`.

## Upgrade to 1.3.2 {#preparing-1-3}

OINK `v1.3.2` restores built-in LibSass and removes the external Sass dependency.
Use Hugo Extended 0.168.0 for maintained sites and review the visible upstream
LibSass warning. See the [1.3.2 release notes](/blog/release/1.3.2/).

Verify public module resolution with replacements and workspaces disabled.
Pin `github.com/pgsty/oink@v1.3.2`, build with reviewed diagnostics, and review
navigation, image viewing, and reader settings. Source-copy consumers must also
refresh their fixed theme files; changing `go.mod` does not update a vendored copy.

OINK `v1.3.1` repairs Markmap text contrast and fixed-TOC footer clearance, and
adds opt-in layouts for technical tables and long FileTree comments. Existing
content keeps its default appearance. Add `.td-table--wide` or `wrap=true` only
where complete technical text is needed.

Keep `preset: paper` and the explicit `[paper, slate, ink, terminal]` menu when
the site offers all four styles. The [1.3.1 notes](/blog/release/1.3.1/) describe
these fixes and credit their contributor.

## Read the release notes first {#release-notes}

> [!NOTE] Unreleased: local PlantUML rendering
> After adopting the development change, keep `params.plantuml: true` or
> `plantuml.enable: true` and remove `svg_image_url` to use the two bundled
> browser scripts. No additional software or rendering service is required.
> Keep a nonempty endpoint to retain server mode. To disable rendering entirely,
> set `params.plantuml: false` or `plantuml.enable: false`; an empty endpoint now
> selects local mode. Published v1.3.2 still requires an endpoint. Review
> [unsupported includes, libraries, and CSP requirements](/docs/components/plantuml/#limits)
> before switching an existing diagram collection.

Each version's release notes describe its changes, breaking changes, and
upgrade steps. Before upgrading, read the target version's notes:

- The release series in this site's [project blog](/blog/)
- The [Releases page](https://github.com/pgsty/oink/releases) on GitHub

The notes identify required content changes, removed configuration keys, and
changed default behavior. Read them to understand differences in the upgraded pages.

## Upgrading the Hugo Module {#hugo-module}

For a production site, pin a published release tag or an explicitly selected
immutable commit. Do not follow a branch or use `@latest`. The example below
upgrades to the published `v1.3.2` tag. Before you select a later tag, verify
that the release is published and its module resolves:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v1.3.2   # the published release tag
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

When selecting a tag, confirm that the module graph shows that exact version.
An explicitly selected immutable commit normally uses a Go pseudo-version.
This is valid if it resolves to the intended commit. It does not prove that a
named release exists. Commit the resulting `go.mod` and `go.sum`.
For the published tag in this example, `go.mod` contains:

```go {title="go.mod"}
module github.com/pgsty/oink.pgsty.com

go 1.27.0

require github.com/pgsty/oink v1.3.2
```

> [!DANGER] A local module replacement overrides that pin
> `make dev` and `make check` set `HUGO_MODULE_REPLACEMENTS` for that command
> only, using the sibling theme checkout. To judge whether a release tag works,
> remove that environment replacement and disable both `GOWORK` and
> `HUGO_MODULE_WORKSPACE`. Inspect persistent replacements and `_vendor/` too;
> `make build` by itself does not prove which theme was resolved. See the
> [preview guide](/docs/admin/preview/#theme-workspace).

For a Git submodule, first confirm that it has no local edits. Fetch the tags.
Check out the exact published version. Do not follow its remote branch:

```bash {title="Terminal"}
git -C themes/oink fetch origin --tags
git -C themes/oink checkout --detach v1.3.2
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
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  hugo --gc --minify --printPathWarnings --logLevel info
```

These commands clear potentially stale caches, rebuild with the new version,
and review the visible diagnostics.

`--logLevel info` includes informational diagnostics, while
Warnings remain visible. Review the deprecation messages
emitted by the pinned Hugo version before upgrading it; the severity and
removal schedule depend on the deprecated feature.

After the build passes, visually check the home page, a documentation page,
a blog page, and the 404. Check both languages, both color schemes, the print
view, and every site customization.

## Upgrading from 1.0 to 1.1 {#from-1-0}

> [!IMPORTANT] OINK 1.1.0 upgrade checklist
> This checklist covers the published v1.1.0 release. Each consumer still needs
> to update its dependency pin, rebuild and deploy; theme publication does not
> upgrade an existing site automatically.

No source migration was required from 1.0.0 to 1.1.0. Its Go 1.27.0 module
directive was unchanged from 1.0.0. Validate current upgrades with Hugo Extended
0.168.0. Historical toolchain details remain in the [1.1 release note](/blog/release/1.1.0/).

Review the affected surfaces before choosing the new pin:

| Surface | 1.1 behavior and upgrade check |
| --- | --- |
| Languages | All 32 interface catalogs have the same native-message schema. Check the site's language labels, plural counts, and RTL direction. The site remains responsible for authored translations. |
| Taxonomies | Root pages become term-card directories with a taxonomy switcher. Review any taxonomy-template or CSS overrides, author portraits, and localized breadcrumbs. |
| Sidebars | Cached trees preserve effective page settings and remain usable without JavaScript. Test collapse, hover restore, mobile drawer, and keyboard focus. Hidden content must leave the focus order. |
| Groups | `sidebar_divider: true` retains a section's children. Add `build.render: never` only if you intentionally omit the group's own outputs. Verify child navigation, breadcrumbs, paging, Print, and Book contents. |
| Root menus | Explicit `sidebar_root_menu: false` now applies to self-root sections too. The current linkable root remains a location marker. |
| Custom scripts | Feature-detect `OinkSidebar` and `OinkCommandPalette.registerSearchTail` if an integration must also support 1.0.0. Restore branch state through the API rather than changing classes or ARIA attributes directly. |
| Copying articles | With image zoom enabled, copy an image and its caption as plain text and rich HTML. Preview instructions must not enter the copied article. Zoom and its keyboard controls must still work. |
| Print and Redoc | Check page and Book aggregate Print, heading and tab links, and local Redoc specifications under the real deployment prefix. Local specification paths are rooted under `static/`. |
{.fields}

`params.ui.image_zoom` and `params.offline_search` remain off by default. The
new search hook does not enable a remote provider or add query telemetry.
`params.ui.scroll_spy` and page-level `scroll_spy` remain accepted no-ops in
1.x; removing the obsolete patch does not disable normal outline tracking.

Compare affected site-level copies of theme code with the new implementation.
Then update or remove those copies. Otherwise, an old image-zoom script or
sidebar partial continues to override the upstream fix.

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

## Upgrading from 1.1 to 1.2 {#preparing-1-2}

> [!IMPORTANT] Default appearance change
> Paper is the default in OINK 1.2.0. Set `params.ui.preset: slate` before
> adopting this change if the site must retain its existing appearance.
> `preset_menu: true` enables reader choice; its default remains false.
> Ink and Terminal require an explicit preset or menu list. Their buttons do
> not carry experiment badges; the configuration opt-in remains unchanged.
> Review custom dark brand selectors as described in [Brand](/docs/customize/brand/#visual-presets).

OINK 1.2.0 is available as a published tag. Apart from the default appearance
change above, no content migration is required. Validate current upgrades with
Hugo Extended 0.168.0, then verify the site:

- Check the chosen preset, light/dark icons, keyboard and mobile menus, saved
  preferences, and custom font/accent overrides. Sun means light; moon means
  dark. Switching styles must not change the saved light/dark preference.
- Recheck explicit navigation, hidden subtrees, page links, Blog pagination
  canonicals, and SEO alternates for pages without translations.
- Check CJK keyword-only search summaries and outline links with literal
  percent signs. Compare source-derived Edit, History, and Create child links
  on Windows or mounted content; mappings must yield repository-relative paths.
- Check Landing content with JavaScript disabled or blocked, preserved metric
  formatting, dialogs and keyboard shortcuts, copy fallback, Draw.io controls,
  and numbered equations at narrow widths.
- Run a production build for diagram endpoints and resource alt metadata;
  malformed values now produce a warning and use a safe fallback. To disable
  rendering intentionally, use `params.plantuml: false` or `params.drawio.enable: false`.
- Use the revised PDF and migration tools when testing publication or content
  conversion. Review PDF remote-resource opt-ins and migration diffs, including
  code examples nested in lists. The consumer-upgrade helper ships with
  1.2.0 for inventory, module updates and exact-version validation.

The [Architecture](/docs/design/architecture/),
[Components](/docs/design/components/), [Shell](/docs/design/shell/), and
[Migration](/docs/design/migration/) contracts describe the published 1.2.0
behavior.

## The content migration toolkit {#migration-toolkit}

Several 0.4 shortcodes now use native Markdown forms. The theme repository
ships a conversion tool that requires only the Python standard library:

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

Follow these four rules when you use the tool:

- A dry run is the default. Only `--write` changes files. Run the dry run, read the diff, and then write.
- A second run should change nothing. If a second `--write` reports changes, a transformation has not converged. Stop and inspect those files.
- The tool leaves text inside fences unchanged. Documentation examples of old syntax therefore remain intact.
- If the tool cannot express a construct, it leaves that construct unchanged. It reports `file:line` and a reason for manual work. This is not a failure.

To convert one class first, use `--only` with the keys in the table's last
column:

```bash {title="Terminal"}
python3 bin/migrations/oink06.py migrate --site ~/www/ddia --only callout,tabs --write
```

After conversion, rebuild, review warnings, and inspect the rendered
pages. The tool guarantees correct syntax. You must verify the intended meaning.

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

Each page under [Components](/docs/components/) describes the new form and its
parameters.

## Migrating from Docsy {#from-docsy}

OINK is a hard fork of Docsy. It retains the content model, `td-` naming, Sass
variables, and most front matter. Migration mainly requires removing site
copies of the shared shell. The theme's implementation then supplies the shell.
You do not need to rewrite the prose.

1. Pin the target version. Change `go.mod` to an OINK release tag, or use a complete versioned archive. During evaluation, an uncommitted `go.work` can point at a local checkout.

1. Inventory the overrides. Classify each site-level file under `layouts/`, `assets/`, and `static/` into four groups. Delete verified copies of the shared shell. Delete or mechanically rename components that OINK already provides. Retain brand customization in the smallest suitable hook. Keep business-specific data and interaction in the site. Delete files in reference order. Do not empty `layouts/` at once. The home page or download page may still call a partial that you plan to remove.

1. Move the configuration. Keep `title`, `languages.*`, `github_repo`, `github_branch`, `page_width`, and `params.ui.*` in their existing semantic positions. OINK adds no separate namespace. Enable search and the logo with these keys:

   ```yaml {title="hugo.yml"}
   params:
     logo: img/product.svg
     offline_search: true
   ```

   Docsy's camelCase search keys have been renamed in OINK: `offlineSearch`,
   `offlineSearchIndex`, `offlineSearchMaxResults`, `offlineSearchOnServe` and
   `offlineSearchSummaryLength` all become their underscored forms. Rename them
   deliberately. The old migration registry stopped the build and named the
   replacement. That registry was removed. The theme now ignores an old key,
   so search remains off without a message.

1. Fonts and styling compatibility. The Docsy Sass variables in `assets/scss/_variables_project.scss` still supply seed values for font roles. You do not need to delete them for an upgrade. Each of `$td-fonts-serif`, `$font-family-sans-serif`, `$headings-font-family`, and `$font-family-code` supplies its role. The theme no longer reads Docsy's Google Fonts switches `$td-enable-google-fonts`, `$td-google-font-name`, and `$td-web-font-path`. These unused switches cause no failure and have no effect. OINK bundles Inter, Chakra Petch, and IBM Plex Mono. Neither preset requests Google Fonts. To change fonts, use the token layer. See [Brand and appearance](/docs/customize/brand/).

1. Convert the shortcodes. Docsy's `alert`, `pageinfo`, `tabpane` and `card` families all have a current counterpart; convert them in bulk with the [migration toolkit](#migration-toolkit) above, one `--only` class at a time.

1. Delete one group at a time. Build after each group. First test on a scratch copy. Record the theme commit, Hugo version, removed files, and generated HTML file count. After you confirm equivalent behavior, repeat the process on the production branch.
{.steps}

The "delete after verifying" class in step two is usually these files:

- `layouts/baseof.html` and the shared docs / blog `baseof*.html`;
- The navbar, footer, sidebar, TOC, search and head CSS partials and their hooks;
- The old brand documentation shell partials;
- Copies of the `asciinema`, `echarts`, `infographic`, `doc-carousel`, `details`, `tab` / `tabpane`, card and `param` shortcodes;
- The JavaScript, Lunr copy, carousel code and SCSS that served only those implementations;
- PostCSS and Autoprefixer steps no site asset needs any more.

Two types of problem can appear after deletion.

A site script can report `$ is not defined`. OINK does not bundle jQuery,
which Docsy loaded in each page's `<head>`. The theme does not need jQuery.
If your site needs it, load it in the site:

```html {title="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

A home page that uses Docsy's `blocks/*` fails an OINK build with
`template for shortcode "blocks/cover" not found`. OINK has no such shortcode
family. Use home page sections in `data/home/<language>.yaml`, or set
`layout: landing` on the page. See
[Home and landing pages](/docs/customize/home/).

## Upgrading from 0.4 {#from-0-4}

0.4 changed several defaults. If an upgrade adds or removes a page feature,
check these settings first:

- Sequential paging is on by default. `docs`, `book`, and `blog` pages have previous / next links at the page end. Documentation follows the sidebar tree. Blog pages follow time. For a page intentionally outside a sequence, set `pager: false`.
- The navbar appears on every layout. Its compact state has one row of icon navigation and no second mobile accordion menu. Remove local scripts and tests that depend on the old mobile menu. To disable the navbar for a section, set `navbar_enabled: false` in a cascade.
- The footer defaults to `fat` for the site. It accepts only `fat` / `slim` / `none`. Store footer data in `data/footer/<language>.yaml`, or `data/footer.yaml` for a single-language site. A remaining `footer` key in `data/home` produces a warning with the new location. Review the warning and rendered fallback before publication.
- Single-key navigation is on by default. `/` opens full search, and `\` opens command-only mode. Update training material that describes the old behavior. Page actions now use a split button beside the breadcrumbs.
- The code block DOM changed. A `.td-code` wrapper now encloses the original `.highlight`. Both `.highlight` and `.chroma` remain. In site CSS, replace a direct child selector such as `.td-content > .highlight` with the descendant selector `.td-content .highlight`.
- Two ICP footer parameters were removed. The keys `footer_icp` and `footer_icp_url` became one string that accepts inline Markdown.

  ```yaml {title="hugo.yml"}
  params:
    footer_center_info: '[京ICP备00000000号](https://beian.miit.gov.cn/)'
  ```

- For mathematics, enable passthrough in the site. Hugo does not merge a theme's `markup` configuration. If the site uses `\(…\)`, `\[…\]`, or `$$…$$`, enable Goldmark passthrough in its own `hugo.yml`. See [Math](/docs/components/math/).

The complete configuration for all of these is in
[Configuration](/docs/customize/config/) and
[Layouts and page types](/docs/customize/layout/).

## Verify {#verify}

After "the build passed", the upgrade still requires checks. Inspect each surface:

| Surface | What to look at |
| --- | --- |
| Documentation / Book | Sidebar order, paging, headings, page actions, numbering and cross-references |
| Blog | Chronological paging, RSS ownership, navbar and footer |
| Home / landing | Content without JS, the compact menu, print |
| Release pages | Derived download URLs, checksums, publication state |
| Components | One page each for the components the site uses most |
| Accessibility | Keyboard-only operation, focus order, both color schemes, forced-colors mode |
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

Complete the final checks in the real environment. Deploy a preview. Verify its
pages and browser network requests at the real URL. After review, merge the
upgrade and run a production smoke test.

## Rollback {#rollback}

To roll back the theme, restore the version pin:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v1.0.0   # example: the site's last known-good tag
hugo mod tidy
rm -rf public resources/_gen
hugo --gc --minify
```

Three principles:

- Keep the pre-upgrade module pin, the site commit and the known-good deployment artifact, and restore all three together.
- Do not perform a partial rollback. Old layout copies over a new theme produce a mixed implementation. This is harder to diagnose than either complete version.
- Keep the upgrade branch and its acceptance evidence. A rollback first restores production. It does not discard completed upgrade work.

Rolling back the deployed output itself (republishing the previous deployment)
is in [Deploy](/docs/admin/deploy/#rollback).

## Related {#related}

- [Deploy](/docs/admin/deploy/) — rolling back deployed output
- [Troubleshooting](/docs/admin/troubleshooting/) — reading a build error after an upgrade
- [Local preview](/docs/admin/preview/) — clearing caches and the `go.work` workspace
- [From scratch and other install methods](/docs/start/from-scratch/) — weighing the four install methods
- [Components](/docs/components/) — each component's current form
