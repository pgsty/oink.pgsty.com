---
title: Upgrade
linkTitle: Upgrade
description: Move a site to a newer OINK release, or migrate it from OINK 0.4 or Docsy, with a rollback path at every step.
weight: 50
search_keywords: [upgrade, migration, version, Hugo Module, hugo mod get, oink06, Docsy, jQuery, breaking changes]
aliases:
  - /docs/upgrade/
  - /docs/upgrade/upgrade/
  - /docs/upgrade/from-docsy/
  - /docs/upgrade/v0-4/
---

Upgrading OINK means changing the release your site pins and checking what
the new release renders differently. Most content needs no edits. Where a
release retired a syntax or an interface, its section below says whom that
affects and what to change, and a migration tool rewrites old shortcodes in
bulk, dry run first. Do the work on a branch, so that abandoning an upgrade
costs nothing but the branch.

> [!IMPORTANT] Upgrade Hugo and OINK together
> OINK 1.6.0 and newer build with Hugo 0.169.0 or newer in any edition, and
> the build compiles nothing. OINK 1.5.1 and older need Hugo's Extended
> edition, which ended with Hugo 0.169, so a site on an older release cannot
> follow Hugo past 0.169 until it upgrades; see
> [Staying on 1.5.1 or older](#hugo-extended).

## Read the release notes first {#release-notes}

Each release's notes list its changes, breaking changes and upgrade steps.
Before you change the pin, read the notes of every release between yours and
the target:

- [Release notes](/release/) on this site
- [Releases](https://github.com/pgsty/oink/releases) on GitHub

They tell you which content needs editing, which configuration keys are gone
and which defaults changed, so a page that looks different after the upgrade
comes with an explanation.

## Upgrading the Hugo Module {#hugo-module}

Pin a published release tag, or an immutable commit you chose deliberately,
never a branch or `@latest`, so that building the same site commit always
produces the same site. Check that the tag is published and resolves before
you pin it:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v1.7.0   # the published release tag
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

The module graph must show exactly that version; a commit you chose appears in
`go.mod` as a Go pseudo-version. Commit `go.mod` and `go.sum`. For the tag
above, `go.mod` reads:

```go {title="go.mod"}
module github.com/example/product-docs

go 1.27.4

require github.com/pgsty/oink v1.7.0
```

If you also preview against a local theme checkout, that replacement
overrides the pin; see
[Previewing against a theme checkout](/docs/admin/preview/#theme-workspace)
before you trust a build.

For a Git submodule, confirm that it has no local edits, fetch the tags and
check out the exact release rather than following a remote branch:

```bash {title="Terminal"}
git -C themes/oink fetch origin --tags
git -C themes/oink checkout --detach v1.7.0
git add themes/oink
```

Commit the new submodule pointer once the site passes. For an offline archive
or a clone, replace `themes/oink/` with the complete tree of the new release
and confirm that `theme:` still matches the directory name. The trade-offs
between install methods are in
[From scratch and other install methods](/docs/start/from-scratch/).

## What to do after upgrading {#after-upgrade}

```bash {title="Terminal"}
rm -rf public resources/_gen
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  hugo --gc --minify --printPathWarnings --logLevel info
```

This clears caches that may still hold output of the old release, builds with
the pinned release only, with no local replacement or workspace, and prints
informational messages along with the warnings. Hugo's deprecation notices
among them say what a future Hugo will remove; resolve them before you
upgrade Hugo itself, since how urgent each one is depends on the feature.

Once the build passes, look at the result: the home page, a documentation
page, a blog page and the 404, in every language and both color schemes, the
print view, and everything the site customizes.

## Verify {#verify}

A passing build does not finish an upgrade. Check each surface the site uses:

| Surface | What to look at |
| --- | --- |
| Documentation / Book | Sidebar order, paging, headings, page actions, numbering and cross-references |
| Blog | Chronological paging, RSS ownership, navbar and footer |
| Home / landing | Content with JavaScript off, the compact menu, print |
| Release pages | Derived download URLs, checksums, publication state |
| Components | One page for each component the site uses most |
| Accessibility | Keyboard-only use, focus order, both color schemes, forced-colors mode |
| Deployment | Every internal link and asset keeps the base path prefix |
{.fields}

Then run the [checks a site can run](/docs/admin/troubleshooting/#site-checks):
the production build, the output trust check and, for a book, the anchor
check. Deploy a preview and open its pages in a browser at the real URL,
watching the network requests. Merge the upgrade only after that review, and
smoke-test production once it is live.

## Rollback {#rollback}

To roll the theme back, restore the previous pin:

```bash {title="Terminal"}
hugo mod get github.com/pgsty/oink@v1.6.0   # example: the site's last known-good tag
hugo mod tidy
rm -rf public resources/_gen
hugo --gc --minify
```

- Keep the pre-upgrade module pin, site commit and known-good deployment artifact, and restore all three together.
- Never roll back part of it. Old layout copies over a new theme make a mixture that is harder to diagnose than either complete release.
- Keep the upgrade branch and what you learned verifying it. A rollback restores production first; it does not throw the upgrade work away.

Republishing the previous deployment itself is covered in
[Deploy](/docs/admin/deploy/#rollback).

## Upgrade to 1.7.0 {#preparing-1-7}

Sites already on 1.6.0 need no template or stylesheet migration. Review the
[1.7.0 release notes](/release/1.7.0/) and check these behavior and appearance
updates before pinning `v1.7.0`:

- **Paper accent and preset typography.** Paper moves to an ivory canvas (`#faf9f5`) and a clay UI accent (`#9b4a28`, dark `#de8460`) while keeping blue underlined links in prose. To keep Paper's previous blue accent, set `params.ui.theme_color: '#2b5f8c'`. Terminal now sets screen prose in IBM Plex Mono (keeping IBM Plex Sans in print), and an explicit `params.ui.fonts.ui` or `fonts.body` reaches the headings in every preset unless `fonts.heading` names its own face. See [Brand and appearance](/docs/customize/brand/#visual-presets).
- **Updated single-key shortcuts.** The shortcut map reorganized into twenty-nine bindings (10 navigation, 9 actions, 10 view): Zen Mode moves from `H` to `Z` (`H` opens local browsing history), language cycling is `X`, preset cycling is `T`, color mode is `Y`, blog index layout is `L`, version cycling is `V`, language home is `G`, command-only palette stays on `\` (with `C`), and `[` and `]` trigger ChatGPT and Claude. `G` no longer opens the focused tree item (`Enter` and `Space` still do), and the home page's `N` section alias is gone (`J` remains). Update any site-specific help copy or keyboard tests that mention pre-1.7 keys; see [Keyboard shortcuts](/docs/customize/keyboard/).
- **Typeset copy.** Copying article prose now emits clean print-palette rich text by default so editors such as WeChat no longer keep page canvas backgrounds. Set `params.ui.rich_copy: false` (or front matter `rich_copy: false`) if your site needs the browser's default HTML copy.
- **New opt-in components and CSP.** Timeline, Update, Social, and local Video/Audio work without external requests. If you enable `params.map` or `params.video_embeds`, allow your tile origin in `img-src` and enabled video hosts in `frame-src`; see [Deploy](/docs/admin/deploy/#csp).
- **Archived-version banner.** Sites with `params.archived_version: true` now receive a styled `role="note"` notice and require a non-empty `params.version` (omitting it warns once and drops the empty banner).

## Upgrade to 1.6.0 {#preparing-1-6}

Every site moving to 1.6.0 needs this section. The release keeps the
`github.com/pgsty/oink` module path but deliberately retires Sass,
Bootstrap's JavaScript and Lunr, which is what lets Hugo 0.170 and newer
build the theme. Read the [1.6.0 release notes](/release/1.6.0/), then check
each item:

- **Toolchain.** Upgrade Go to **1.27.4** or newer and Hugo to **0.169.0** or newer, any edition. Remove `extended: true` from CI workflows once every branch you build uses OINK 1.6.0 or newer.
- **Stylesheets.** Convert retired `assets/scss/_*_project*.scss` files to plain CSS in `assets/css/project.css`, change hard-coded `/scss/*.css` paths to `/css/*.css`, and switch custom-shell layouts to `partial "css/bundle.html"`. See [Retired SCSS hooks](#sass-hooks).
- **Bootstrap JavaScript.** Remove dependencies on a theme-provided `window.bootstrap` or on `data-bs-toggle` hooks, listen for `td:tab-shown` instead of `shown.bs.tab` on Landing download tabs, and change `.dropdown-menu` selectors on version lists to `.td-version-menu__list`. See [Bootstrap's JavaScript](#bootstrap-script).
- **Local search.** Remove site-script dependencies on `window.lunr` and call `OinkSearchEngine.create(documents, maxResults)`. A `content` index over 2 MiB now moves page text into `offline-search-body.<lang>.json`. See [Local search without Lunr](#search-engine).
- **Markmap 1.1.0.** Migrate the legacy Markmap 0.18 YAML keys to `foldLevel`, `wrapWidth`, `levelGap`, `siblingGap` and `colorDepth`; the old names warn and are ignored. See [Markmap migration](/docs/components/markmap/#migration).
- **ReDoc 3.1.0.** Each specification now renders in its own same-origin reader frame, so a Content Security Policy that restricts frames must allow `frame-src 'self'`. ReDoc 2's `hide-hostname`, `hide-logo`, `suppress-warnings`, `lazy-rendering` and `native-scrollbars` defaults are gone with its v2 API; if you override the `redoc` shortcode or its styles, port those overrides to the ReDoc 3 API. Rename the specification extension `x-code-samples` to `x-codeSamples`. Old links to operations still redirect, but ReDoc 2 deep links to schemas and to individual security schemes have no ReDoc 3 equivalent, so update any link that points at one.
- **Components that load on approach.** Asciinema, ECharts, Infographic, Markmap and giscus now load as the reader nears them. If your own browser tests assert rendered charts, maps or players, scroll the component into view first.

### Retired SCSS hooks {#sass-hooks}

If your site has `assets/scss/_variables_project.scss`,
`_variables_project_after_bs.scss` or `_styles_project.scss`, convert them
by hand, once. The theme's stylesheet is plain CSS and the build runs no Sass
compiler, so each of these files is ignored with one build warning, and until
you convert them the site builds with the theme's default styles only.

1. Move the rules in `_styles_project.scss`, and in the partials it imports,
   to `assets/css/project.css` as plain CSS. Native CSS nesting is fine. Write
   out what only Sass understands: variables, mixins such as Bootstrap's
   breakpoints, `@extend`, and nested selectors that build a class name with
   `&-`.
2. For each Sass variable you assigned in the two variable hooks, set what it
   used to change. Colors and fonts have their own settings; see
   [Brand and appearance](/docs/customize/brand/). For anything else,
   override the custom property or the theme rule the variable fed.
3. Build the site and compare the pages that matter. `project.css` loads after
   the theme's stylesheet, so a theme rule of equal specificity no longer
   overrides your rule. Check elements that also carry a theme modifier class,
   and check each visual preset you offer.
4. Delete the three SCSS files and the partials only they imported. From then
   on, edit the [project stylesheet](/docs/customize/brand/#scss).

If your own templates compiled the theme's SCSS partials, ask for a
[theme stylesheet by name](/docs/customize/brand/#bundles) instead.

### Bootstrap's JavaScript {#bootstrap-script}

If your layouts, shortcodes or content use Bootstrap's dropdowns, tabs,
modals or any other Bootstrap script, load Bootstrap yourself: the theme no
longer provides `window.bootstrap` or activates Bootstrap's script hooks. To
find what depends on it, search for `bootstrap.`, `data-bs-toggle`,
`data-bs-dismiss`, `data-bs-target` and `.bs.` event listeners. Replace each
with an OINK component, or load your own Bootstrap bundle in
`layouts/_partials/hooks/body-end.html`. The color-mode attributes
`data-bs-theme` and `data-bs-theme-value` still work.

On OINK Landing download tabs, listen for `td:tab-shown` instead of
`shown.bs.tab`; the event bubbles from the channel panel that just became
visible. The version lists in the footer and drawer use
`.td-version-menu__list`, so update custom `.dropdown-menu` selectors for
them. The version trigger reports its state through `aria-expanded`; observe
that attribute where a script listened for `*.bs.dropdown`.

### Local search without Lunr {#search-engine}

If your site uses local search, its configuration, index files and front
matter keys are unchanged. After upgrading, check three things:

1. The theme no longer ships Lunr. If your own layouts or scripts used
   `window.lunr` from the theme's copy, load Lunr yourself.
2. If you call `OinkSearchEngine.create` directly, drop the Lunr argument:
   `create(documents, maxResults)`.
3. Results rank differently. A short word no longer matches inside another
   word, so `port` no longer returns pages that only say "support", and
   Chinese, Japanese and Korean queries no longer need spaces between words.
   Try the searches your readers use most.

A `content` index larger than 2 MiB is now published as two files: the index
keeps titles, headings and keywords, and `offline-search-body.<lang>.json`
holds the page text, which the palette loads after the first results. If you
set `offline_search_index: summary` only to stay within the size budget, you
can return to `content`. A script of your own that read `body` from a large
index must read the second file and join it by `ref`. An index within 2 MiB
is unchanged.

Fields are now search results: a query for a parameter name opens its entry
in a `fields` list or `{.fields}` table, with no change on your part. To keep
an established anchor, give the field an `id`. To make your own markup
searchable the same way, give the element an `id` and
`data-td-search-entry="Title"`. The [Shell contract](/docs/design/shell/#search-engine)
lists the rules.

### Staying on 1.5.1 or older {#hugo-extended}

If a site, or a branch you still build, stays on OINK 1.5.1 or older, its
build compiles Sass and needs Hugo's Extended edition, which ended with Hugo
0.169; those releases fail to build on Hugo 0.170. Everywhere that site
builds, use the Extended edition at a release no newer than 0.169:

- Locally, `hugo version` must print `extended`.
- In GitHub Actions, give `peaceiris/actions-hugo` an exact release and the Extended edition:

  ```yaml {title="the Install Hugo step of the workflow"}
  - name: Install Hugo
    uses: peaceiris/actions-hugo@v3
    with:
      hugo-version: 0.169.0
      extended: true
  ```

- In the [container image](/docs/admin/preview/#container), install `hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb` instead of `hugo_${HUGO_VERSION}_linux-${TARGETARCH}.deb`, with `HUGO_VERSION` no newer than 0.169.
- `resources/_gen/` also holds the CSS the build compiled, so clear it when a font or accent-color change does not show up.

## Upgrade to 1.5.1 {#preparing-1-5}

A site that leaves `params.ui.compare` unset needs no changes: 1.5.1 builds
exactly the same pages and outputs. The release stabilizes the opt-in
[Duo view](/docs/customize/i18n/#bilingual-view) introduced in 1.5.0 and
fixes RSS, print, navigation, validation, search and accessibility behavior;
see the [1.5.1 release notes](/release/1.5.1/).

If you turn on `params.ui.compare: true`:

- Keep explicit `{#id}` heading anchors aligned across translations, so **Sync Scroll** can match sections.
- Set `languages.<lang>.params.ui.compare: false` for any language that should neither show the reader nor appear as a target language.
- Guard custom analytics in `head-end.html` with `window.OinkComparePane` so pane loads are not counted twice. A local override of Hugo's `google_analytics.html` partial is not used while `compare` is on; see [Analytics and SEO](/docs/admin/analytics/#bilingual-view).
- Allow same-origin frames (`frame-src 'self'`) in your Content Security Policy, and make sure the server does not forbid same-origin framing with `X-Frame-Options: DENY` or `frame-ancestors 'none'`.
- Open a translated Docs, Book or blog page and check that **Open duo view** (renamed from **Open bilingual view** in 1.5.1) loads the target language, syncs scrolling across shared headings, and switches cleanly on narrow screens.

## Upgrade to 1.4.0 and 1.3.1 {#preparing-1-4}

If your site uses PlantUML, 1.4.0 can render it in the browser with no extra
software or rendering service. To switch, keep `params.plantuml: true` or
`plantuml.enable: true` and remove `svg_image_url`; the two bundled browser
scripts take over. To stay in server mode, keep a non-empty endpoint, because
an empty endpoint now selects local mode. To turn rendering off, set
`params.plantuml: false` or `plantuml.enable: false`. Before switching an
existing diagram collection, review the
[unsupported includes, libraries and CSP requirements](/docs/components/plantuml/#limits).

Beyond that, 1.4.0 keeps the Hugo-only build and adds unified diagram
reading, richer local search, the opt-in table reader and the gallery blog
layout ([1.4.0 release notes](/release/1.4.0/)). After pinning it, review
navigation, image viewing and reader settings. If you install the theme as a
source copy, refresh the copied files as well; changing `go.mod` does not
update a vendored copy.

1.3.1 repaired Markmap text contrast and the fixed table of contents'
clearance above the footer, and added opt-in layouts for technical tables and
long FileTree comments. Existing content keeps its appearance; turn on
[technical table layout](/docs/components/table/#wide) or FileTree
`wrap=true` only where the full technical text has to show. A site that offers
all four styles keeps `preset: paper` with the explicit
`[paper, slate, ink, terminal]` menu. The [1.3.1 notes](/release/1.3.1/)
describe these fixes and credit their contributor.

## Upgrade to 1.2.0 {#preparing-1-2}

> [!IMPORTANT] Paper became the default appearance
> If the site must keep its existing look, set `params.ui.preset: slate`
> before adopting 1.2.0. `preset_menu: true` turns on reader choice and still
> defaults to false. Ink and Terminal appear only when you name them as the
> preset or in the menu list, and their buttons carry no experiment badge.
> Review custom dark brand selectors as described in
> [Brand](/docs/customize/brand/#visual-presets).

Apart from the appearance change, 1.2.0 needs no content migration. Check:

- The chosen preset, the light/dark icons, keyboard and mobile menus, saved preferences, and custom font and accent overrides. Sun means light and moon means dark, and switching styles must not change the saved light/dark preference.
- Explicit navigation, hidden subtrees, page links, Blog pagination canonicals, and SEO alternates for pages without translations.
- CJK search summaries that match only keywords, and outline links whose headings contain a literal percent sign. Compare the Edit, History and Create-child links for content on Windows or in mounts; mappings must yield repository-relative paths.
- Landing content with JavaScript disabled or blocked, preserved metric formatting, dialogs and keyboard shortcuts, the copy fallback, Draw.io controls, and numbered equations at narrow widths.
- Diagram endpoints and resource alt metadata in a production build: malformed values now warn and fall back safely. To disable rendering on purpose, use `params.plantuml: false` or `params.drawio.enable: false`.
- The revised PDF and migration tools, if you publish PDFs or convert content. Review PDF remote-resource opt-ins and migration diffs, including code examples nested in lists.

## Upgrade to 1.1.0 {#from-1-0}

If your site is on 1.0.x, no source migration is needed, and the module's Go
1.27.0 directive is unchanged from 1.0.0; toolchain details are in the
[1.1 release notes](/release/1.1.0/). What changed is behavior, so review the
surfaces the site uses before choosing the new pin:

| Surface | 1.1 behavior and what to check |
| --- | --- |
| Languages | All 32 interface catalogs share one native-message schema. Check the site's language labels, plural counts and RTL direction; authored translations remain the site's responsibility. |
| Taxonomies | Root pages become term-card directories with a taxonomy switcher. Review taxonomy-template or CSS overrides, author portraits and localized breadcrumbs. |
| Sidebars | Cached trees keep each page's effective settings and work without JavaScript. Test collapse, hover restore, the mobile drawer and keyboard focus; hidden content must leave the focus order. |
| Groups | `sidebar_divider: true` keeps a section's children. Add `build.render: never` only if you mean to omit the group's own outputs, then check child navigation, breadcrumbs, paging, Print and Book contents. |
| Root menus | An explicit `sidebar_root_menu: false` now applies to self-root sections too. The current linkable root stays visible as a location marker. |
| Custom scripts | Feature-detect `OinkSidebar` and `OinkCommandPalette.registerSearchTail` if an integration must also support 1.0.0. Restore branch state through the API rather than by changing classes or ARIA attributes. |
| Copying articles | With image zoom on, copying an image and its caption yields plain text and rich HTML. Preview instructions must stay out of the copied article, and zoom and its keyboard controls must still work. |
| Print and Redoc | Check page and Book aggregate Print, heading and tab links, and local Redoc specifications under the real deployment prefix. Local specification paths are rooted under `static/`. |
{.fields}

`params.ui.image_zoom` and `params.offline_search` stay off by default, and
the new search hook enables no remote provider and adds no query telemetry.
`params.ui.scroll_spy` and the page-level `scroll_spy` are still accepted and
do nothing in 1.x, so removing an obsolete patch does not disable normal
outline tracking.

If the site keeps its own copies of theme code, such as an image-zoom script
or a sidebar partial, compare them with the new implementation and update or
remove them; otherwise the old copy keeps overriding the upstream fix. The
details are in [content groups](/docs/write/organize/#group-only), the
[sidebar contract](/docs/design/shell/#sidebar-runtime),
[search actions](/docs/customize/panel/#search-tail) and
[image zoom](/docs/components/image/#zoom).

## Upgrade from 0.4 {#from-0-4}

If your site started on OINK 0.4 and a page gained or lost a feature after
upgrading, check these changed defaults first:

- Sequential paging is on. `docs`, `book` and `blog` pages end with previous / next links; documentation follows the sidebar tree and blog posts follow time. Set `pager: false` on a page that stands outside any sequence.
- The navbar appears on every layout. Its compact state is one row of icon navigation with no second mobile accordion menu, so remove local scripts and tests that depend on the old mobile menu. To hide the navbar for a section, set `navbar_enabled: false` in a cascade.
- The footer defaults to `fat` across the site and accepts only `fat`, `slim` or `none`. Footer data lives in `data/footer/<language>.yaml`, or `data/footer.yaml` on a single-language site; a `footer` key left in `data/home` warns and names the new location.
- Single-key navigation is on: `/` opens full search and `\` opens command-only mode. Update training material that describes the old behavior. Page actions moved to a split button beside the breadcrumbs.
- The code block DOM changed: a `.td-code` wrapper now encloses the original `.highlight`, and both `.highlight` and `.chroma` remain. In site CSS, replace a child selector such as `.td-content > .highlight` with the descendant selector `.td-content .highlight`.
- The two ICP footer keys `footer_icp` and `footer_icp_url` became one string that accepts inline Markdown:

  ```yaml {title="hugo.yml"}
  params:
    footer_center_info: '[京ICP备00000000号](https://beian.miit.gov.cn/)'
  ```

- Mathematics needs Goldmark passthrough in the site's own configuration, because Hugo does not merge a theme's `markup` settings. If the site uses `\(…\)`, `\[…\]` or `$$…$$`, enable passthrough in its `hugo.yml`; see [Math](/docs/components/math/).

Every key above is documented in [Configuration](/docs/customize/config/) and
[Layouts and page types](/docs/customize/layout/). Convert the 0.4 shortcodes
with the migration toolkit below.

## The content migration toolkit {#migration-toolkit}

If your content still uses 0.4 shortcodes such as `alert`, `tabpane` or
`imgproc`, convert them with `oink06.py` instead of editing hundreds of files
by hand. It ships in the theme repository and needs only the Python standard
library:

```bash {title="Terminal"}
git clone https://github.com/pgsty/oink
cd oink

# 1. read-only inventory: what several sites would change, exportable as Markdown / JSON
python3 bin/migrations/oink06.py report --sites ~/sites/product-docs ~/sites/handbook --md report.md

# 2. dry run: prints a diff and counts per file, writing nothing
python3 bin/migrations/oink06.py migrate --site ~/sites/product-docs

# 3. apply: written atomically
python3 bin/migrations/oink06.py migrate --site ~/sites/product-docs --write

# 4. check for residue: exit code 1 while legacy syntax remains
python3 bin/migrations/oink06.py check --site ~/sites/product-docs
```

- A dry run is the default and only `--write` changes files, so run it, read the diff, then write.
- A second run must change nothing. If a second `--write` still reports changes, a transformation has not converged; stop and inspect those files.
- Text inside code fences is left alone, so documentation that shows the old syntax stays intact.
- A construct the tool cannot express is left unchanged and reported with `file:line` and a reason, as a list for manual work rather than a failure.

To convert one class at a time, pass `--only` with keys from the last column
of the syntax map:

```bash {title="Terminal"}
python3 bin/migrations/oink06.py migrate --site ~/sites/handbook --only callout,tabs --write
```

Afterwards, rebuild, read the warnings and look at the rendered pages. The
tool guarantees valid syntax; whether each page still says what you meant is
yours to check.

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

If your site runs on Docsy, most of it carries over. OINK is a hard fork of
Docsy and keeps its content model, `td-` naming and most front matter, so the
migration is mainly deleting the site's copies of the shared shell and letting
the theme supply it. The prose stays as it is.

1. Pin the target version. Point `go.mod` at an OINK release tag, or use a complete versioned archive. While you evaluate, an uncommitted `go.work` can point at a local checkout.

1. Inventory the overrides. Sort every site-level file under `layouts/`, `assets/` and `static/` into four groups: copies of the shared shell (delete once verified), components OINK already provides (delete or rename mechanically), brand customization (keep, in the smallest suitable hook), and business-specific data and interaction (keep in the site). Delete in reference order rather than emptying `layouts/` at once, because the home or download page may still call a partial you plan to remove.

1. Move the configuration. `title`, `languages.*`, `github_repo`, `github_branch`, `page_width` and `params.ui.*` keep their meaning and position; OINK adds no namespace of its own. Turn on search and the logo with these keys:

   ```yaml {title="hugo.yml"}
   params:
     logo: img/product.svg
     offline_search: true
   ```

   Rename Docsy's camelCase search keys yourself: `offlineSearch`,
   `offlineSearchIndex`, `offlineSearchMaxResults`, `offlineSearchOnServe` and
   `offlineSearchSummaryLength` all become their underscored forms. OINK
   ignores the old names without a warning, so search stays off silently
   until you rename them.

1. Fonts and styles. Docsy's SCSS hooks in `assets/scss/` are no longer compiled, so its Sass variables, including the font variables and the Google Fonts switches, have no effect. Convert the hooks as described in [Retired SCSS hooks](#sass-hooks). OINK bundles IBM Plex Sans, Inter, Chakra Petch and IBM Plex Mono, and no preset requests Google Fonts. To change fonts, use the token layer; see [Brand and appearance](/docs/customize/brand/).

1. Convert the shortcodes. Docsy's `alert`, `pageinfo`, `tabpane` and `card` families all have a current counterpart; convert them in bulk with the [migration toolkit](#migration-toolkit), one `--only` class at a time.

1. Delete one group at a time and build after each. Rehearse on a scratch copy first, recording the theme commit, Hugo version, removed files and generated HTML file count; once the result is equivalent, repeat the steps on the production branch.
{.steps}

The "delete once verified" group in step two is usually:

- `layouts/baseof.html` and the shared docs and blog `baseof*.html`;
- the navbar, footer, sidebar, TOC, search and head CSS partials and their hooks;
- the old brand documentation shell partials;
- copies of the `asciinema`, `echarts`, `infographic`, `doc-carousel`, `details`, `tab` / `tabpane`, card and `param` shortcodes;
- the JavaScript, Lunr copy, carousel code and SCSS that served only those implementations;
- PostCSS and Autoprefixer steps that no site asset needs any more.

Two problems tend to surface after the deletions.

A site script reports `$ is not defined`. Docsy loaded jQuery in every page's
`<head>`; OINK does not need it and does not bundle it. If your site still
needs it, load it from the site:

```html {title="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

A home page built from Docsy's `blocks/*` fails with
`template for shortcode "blocks/cover" not found`, because OINK has no such
shortcode family. Build the home page from sections in
`data/home/<language>.yaml`, or set `layout: landing` on the page; see
[Home and landing pages](/docs/customize/home/).

## Related {#related}

- [Deploy](/docs/admin/deploy/) — rolling back a deployment
- [Troubleshooting](/docs/admin/troubleshooting/) — reading a build error after an upgrade
- [Local preview](/docs/admin/preview/) — clearing caches and previewing against a theme checkout
- [From scratch and other install methods](/docs/start/from-scratch/) — choosing between the four install methods
- [Components](/docs/components/) — each component's current form
