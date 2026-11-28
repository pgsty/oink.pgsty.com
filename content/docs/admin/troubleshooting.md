---
title: Troubleshooting
linkTitle: Troubleshooting
description: Find the cause and fix of a build, language, search or hosting problem from its symptom, and check a site before you publish it.
weight: 60
search_keywords: [troubleshooting, error, build failure, no search results, 404, baseURL, checks, debug]
aliases:
  - /docs/tutorial/troubleshooting/
---

When a build fails or a page looks wrong, start from a clean production build
and read the first error, because later errors usually follow from it:

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --logLevel info
```

That one Hugo command is the whole build of an OINK site. If the log shows npm,
PostCSS, Autoprefixer or a browser-asset download, the site still carries
upstream Docsy's build steps; see [Migrating from Docsy](/docs/admin/upgrade/#from-docsy).

## Build {#build}

| Symptom | Cause | Fix |
| --- | --- | --- |
| Build fails on an older Hugo release | The Hugo that runs is older than the tested `0.170+` releases | Check `hugo version` and update to a current release (`0.170+`). If several Hugo binaries are installed, check `PATH` and the version configured in CI before installing another |
| `TOCSS-DART: … You need to install Dart Sass` | The site pins OINK 1.5.1 or older, which compiles Sass, and Hugo 0.170 or newer no longer has a built-in Sass compiler | Upgrade the site to the current OINK release, see [Upgrade to 1.6.0](/docs/admin/upgrade/#preparing-1-6), or build it with Hugo Extended 0.169 or older until you do |
| `module "github.com/pgsty/oink" not found` | The theme did not resolve | Hugo Module: check `hugo mod graph`, `go.mod`, `go.sum`, and unexpected workspaces or replacements. Submodule: confirm that CI runs `git submodule update --init` before Hugo. Archive / clone: `theme:` must match the directory name under `themes/` |
| Module download hangs or times out | The Go module proxy is unreachable | Hugo downloads modules through Go, so `GOPROXY` applies. In mainland China, use `export GOPROXY=https://goproxy.cn,direct`. In an isolated environment, use an offline archive or commit `themes/oink/` |
| `{.cards}`, `{.steps}`, `{caption=…}` appear as literal text | Goldmark block attributes are off | Set `markup.goldmark.parser.attribute.block: true` in the site's own `hugo.yml`; Hugo does not merge a theme's `markup` settings. Copy the whole block from [the three Goldmark prerequisites](/docs/customize/config/#goldmark) |
| An image with an attribute line is wrapped in `<p>` and the caption does nothing | `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false` is missing | Add it, from the same block |
| Inline HTML is escaped into text | `markup.goldmark.renderer.unsafe: true` is missing | Add it, from the same block |
| `\(…\)` `$$…$$` display literally | Goldmark passthrough is off | See [Math](/docs/components/math/). `math: true` does not turn passthrough on |
| `shortcode "tabs" must be closed or self-closed` | A `{{</* tabs */>}}` has no matching `{{</* /tabs */>}}` | Add the closing marker at the `file:line:column` the error names |
| `template for shortcode "tabs" not found` | The body calls a shortcode that does not exist, or quotes shortcode syntax without escaping it | Correct a misspelled name. To show shortcode syntax as text, put `/*` and `*/` inside the opening and closing markers, so Hugo does not treat it as a call |
| `... attributes: unknown attribute "witdh" at ...` | An attribute-line key is misspelled or not permitted | Correct the key; the warning lists the allowed ones. Until then the theme ignores the attribute, and it always drops `style` and `on*` |
| `shortcode "field": unsupported parameter "colour" at ...` | A shortcode parameter name is wrong | Correct the parameter the warning names, with its file and line. Until then the theme ignores it, so the preview keeps working |
| `invalid params.ui.page_width "widee" (allowed: normal \| wide \| full) -- using "normal"` | A configuration or front matter value is outside its allowed set | Correct the value the message names. Until then the theme uses the fallback it names and keeps building; see [Configuration principles](/docs/customize/config/#principles) |
| A page setting has no effect and nothing is reported | The key was written inside a `ui:` block in front matter | Put page keys at the top level of front matter, without the `ui.` prefix of the site key. A front matter `ui:` block is ignored silently. See [Page parameters](/docs/write/frontmatter/) |
| The build passes but production is missing a feature | A warning turned the feature off | Read the build warnings. An invalid value, a missing required giscus key or an unsupported `comments.type` switches that feature off instead of failing the build |
| Site styles disappear after an upgrade, with a `stylesheet: assets/scss/… is ignored` warning | The site still has a retired SCSS hook | Move its rules to `assets/css/project.css`; see [Retired SCSS hooks](/docs/admin/upgrade/#sass-hooks) |
{.wide .expand}

Both shortcode errors end with the `file:line:column` to fix:

```text {title="build output" copy=false}
ERROR error building site: assemble: failed to create page from pageMetaSource /a:
  "…/content/docs/x.md:4:1": failed to extract shortcode:
  shortcode "tabs" must be closed or self-closed

ERROR error building site: assemble: failed to create page from pageMetaSource /a:
  "…/content/docs/x.md:4:5": failed to extract shortcode:
  template for shortcode "tabs" not found
```

## Language {#language}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A translated page does not appear | Four possibilities, in order | ① `hugo.yml` has `languages.zh` with a `weight`; ② the filename is `page.zh.md`, with `zh` lowercase; ③ the translation's front matter has no `draft: true` and no future `date`; ④ routing metadata matches the source file |
| Switching language lands on the home page | Hugo found no translation | The switcher falls back to the target language's home page when a page has no translation. Add the translation file to link the two pages |
| An anchor link opens the page but does not scroll | The translated heading text differs, so the generated ID does too | Set the English ID explicitly on the translated heading: `## 安装 {#installation}`. If a heading contains a shortcode or inline HTML, read its ID from the English page's rendered HTML instead of guessing |
| Menus or home page sections are untranslated | They live in configuration and data files, not pages | Menus are in `languages.<lang>.menus`, home sections in `data/home/<lang>.yaml`, interface strings in `i18n/<lang>.yaml`. See [Languages](/docs/customize/i18n/) |

## Search {#search}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A search box that never returns results | No index was generated | Check `params.offline_search`, then open search and find the request for the page's `data-td-index-src` URL in the network panel. Production uses `offline-search-index.<language>.<hash>.json`; development omits the hash. If the index is missing only under `hugo server`, also check `offline_search_on_serve` |
| The index file returns 404 | A wrong `baseURL` | On a subpath deployment, a wrong `baseURL` is the most common cause. Check the requested index URL in the browser's network panel; see [Deploy](/docs/admin/deploy/#baseurl) |
| Search fails under `hugo server` but works in a build | The site turned the preview index off | `params.offline_search_on_serve` defaults to `true`, so the preview matches production. Remove an explicit `false` |
| Chinese queries find nothing | Usually the page is missing from the index, or its text sits in the split body file | Open the Chinese page's `data-td-index-src` URL, and `data-td-body-src` if the index is split, to confirm the page was indexed, and check the `offline_search_index` scope. See [Chinese, mixed queries, and identifiers](/docs/customize/search/#cjk) |
| A new page is not found while old ones are | The index is build output | Rebuild. Under `hugo server`, wait for the rebuild after editing |
| `params.search.algolia requires explicit appId, apiKey, and indexName values` | The three Algolia keys are incomplete | Give all three explicitly; the theme never falls back to another project's DocSearch credentials. If you do not want Algolia, delete the block |
| The command palette finds no content | Commands and full-text search are separate | Without an index the palette still opens, says the index is unavailable, and runs page actions and commands. See [Command palette](/docs/customize/panel/) |

## Platform {#platform}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A 404 or missing styles on GitHub Pages | A project site's URL carries the repository path and `baseURL` does not | Pass `--baseURL "${{ steps.pages.outputs.base_url }}/"` from the workflow instead of hard-coding the address. See the complete workflow in [Deploy](/docs/admin/deploy/#hosts) |
| "Last modified" and contributors are empty on GitHub Pages | The checkout is shallow | Add `fetch-depth: 0` to `actions/checkout`, because `enableGitInfo` reads the complete history |
| A Cloudflare Pages build fails with Hugo template errors | The build image's default Hugo is outdated | Set `HUGO_VERSION` to a current release (for example `0.170.1`) in both the Production and Preview environments, and set `SKIP_DEPENDENCY_INSTALL=1` |
| The host's build cannot fetch the theme | The build environment has no Go | Hugo Modules need Go. If the platform does not provide it, use a submodule or commit `themes/oink/` |
| CI output differs from local | `go.work` took part in the CI build | Set `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` in CI so it uses only the version pinned in `go.mod` |
| A preview deployment got indexed | The preview was built in the production environment | Drop `--environment production` from preview builds; a non-production build emits `noindex` and `Disallow: /`. See [Analytics and SEO](/docs/admin/analytics/#robots) |
| macOS reports too many open files | Live preview watches more files than the shell limit allows | Exclude generated and irrelevant directories from the watch first, since they are the usual cause; raise `ulimit -n` only if that is not enough |
| Slow, or missed changes, under WSL | The site sits on a Windows mount point | Keep the site inside the Linux filesystem; change notifications and permissions across filesystems break live reload |
| Bootstrap / Font Awesome / Mermaid assets are missing | An incomplete copy of the theme | Do not substitute a CDN URL. Confirm that `assets/third_party/`, `static/webfonts/` and `VENDOR.json` are present, and download the same pinned release again if anything is missing |
{.wide .expand}

## Checks a site can run {#site-checks}

Run the build on every change. The two scripts come from a checkout of the
theme repository at the release your site pins, shown as `/path/to/oink`, and
need only Python 3; replace the site path and base URL with your own.

| Check | Command | What it covers |
| --- | --- | --- |
| A production build | `hugo --printPathWarnings` | Duplicate output paths, invalid parameters, incomplete external integrations |
| Output trust check | `python3 /path/to/oink/bin/check-output-security.py --public /path/to/my-site/public --base-url https://my-site.example/` | Every `href` / `src` in all four outputs is site-relative or uses `http(s)` / `mailto` / `tel`; no `javascript:` URLs or inline `on*` handlers; a cross-site `<iframe>`, `<script>` or `<img>` needs an explicit `--third-party`. Details in [Verifying an offline build](/docs/admin/preview/#air-gapped) |
| Book anchors | `python3 /path/to/oink/bin/check-book.py --site-public /path/to/my-site/public` | For a site with a [book](/docs/write/book/#verify): every cross-reference target exists, kind and number agree, and IDs are unique within each page |
{.fields}

Read the build's warnings: each one names the key, the rejected value and the
default the theme used instead, and
[When a value is wrong](/docs/customize/config/#principles) explains why OINK
warns rather than failing the build.

## Diagnostic habits {#habits}

When no row matches:

- Reproduce the problem with one known Hugo version and record its `hugo version` output, so the version cannot change between runs.
- Compare the development and production configuration; a problem that appears only online is often an environment difference.
- Separate theme behavior from a site override with a minimal page. Put the suspect content on a page of its own, then re-enable site overrides in batches until one batch brings the problem back.
- Look at the failing page's browser console and network panel, especially the paths of any 404 resources.

## Getting help {#getting-help}

When you open an issue, include the complete `hugo version` output, the theme
version from `hugo mod graph | grep oink`, the first complete error, and a
minimal page or site that reproduces it. With those four, nobody has to ask
you for more details first.

- Theme and documentation issues: <https://github.com/pgsty/oink/issues>
- Issues with this site's content: <https://github.com/pgsty/oink.pgsty.com/issues>
- Upstream Docsy compatibility discussion: <https://github.com/google/docsy/discussions>

## Related {#related}

- [Local preview](/docs/admin/preview/) — clean builds, clearing caches, containers and workspaces
- [Deploy](/docs/admin/deploy/) — `baseURL`, the checklist and rollback
- [Upgrade](/docs/admin/upgrade/) — problems an upgrade introduces, and the migration toolkit
- [Search](/docs/customize/search/) — index scope, ranking and Algolia
- [Languages](/docs/customize/i18n/) — language configuration and the anchor alignment process
