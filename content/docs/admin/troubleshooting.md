---
title: Troubleshooting
linkTitle: Troubleshooting
description: Diagnose build, language, search, and platform problems by symptom, cause, and fix. Run checks on your site.
weight: 60
search_keywords: [troubleshooting, error, build failure, no search results, 404, baseURL, checks, debug]
aliases:
  - /docs/tutorial/troubleshooting/
---

If a problem occurs, first run a clean production build. Read the first error.
Later errors usually result from it:

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --logLevel info
```

If the log includes an npm, PostCSS, Autoprefixer, or browser-asset download
step, the configuration still uses upstream Docsy's process. An OINK consumer
build requires one Hugo command.

The four tables below show each symptom, its cause, and its fix. Find the row
for your symptom. You do not need to read every row.

## Build {#build}

| Symptom | Cause | Fix |
| --- | --- | --- |
| The build demands a newer Hugo | Hugo Standard is installed instead of Extended, or the version is below {{< param hugoMinVersion >}} |`hugo version` output must contain `extended`. If several Hugo versions are installed, check `PATH` and version pins before installing another |
| `module "github.com/pgsty/oink" not found` | The theme did not resolve | Hugo Module: check `hugo mod graph`, `go.mod`, `go.sum`, and unexpected workspaces or replacements. Submodule: confirm that CI runs `git submodule update --init` before Hugo. Archive / clone: `theme:` must match the directory name under `themes/` |
| Module download hangs or times out | The Go module proxy is unreachable | Hugo downloads modules through Go, so `GOPROXY` applies. In mainland China, use `export GOPROXY=https://goproxy.cn,direct`. In an isolated environment, use an offline archive or commit `themes/oink/` |
| `{.cards}`, `{.steps}`, `{caption=…}` appear as literal text | The site has not enabled Goldmark block attributes | Put all three settings below in the site's own `hugo.yml`. Hugo does not merge a theme's `markup` configuration |
| An image with an attribute line is wrapped in `<p>` and the caption does nothing | `wrapStandAloneImageWithinParagraph: false` is missing | Add all three settings below together |
| Inline HTML is escaped into text | `renderer.unsafe: true` is missing | As above |
| `\(…\)` `$$…$$` display literally | The site has not enabled Goldmark passthrough | See [Math](/docs/components/math/). The setting `math: true` does not enable passthrough |
| `shortcode "tabs" must be closed or self-closed` | A `{{</* tabs */>}}` has no matching `{{</* /tabs */>}}` | The error identifies `file:line:column`. Add the closing marker at that location |
| `template for shortcode "tabs" not found` | The body calls a shortcode that does not exist, or quotes shortcode syntax without escaping it | Documentation that explains shortcode syntax must escape it. Add `/*` and `*/` inside the opening and closing markers. Hugo then treats it as text instead of a call. If the name is misspelled, correct it |
| `... attributes: unknown attribute "witdh" at ...` | An attribute-line key is misspelled or not permitted | The warning lists allowed keys. The theme ignores the invalid attribute and drops `style` and `on*`. Correct the attribute |
| `shortcode "field": unsupported parameter "colour" at ...` | A shortcode parameter name is wrong | The warning identifies the shortcode, parameter, file, and line. The theme ignores the unsupported parameter so preview remains usable; correct the parameter name |
| `invalid params.ui.page_width "widee" (allowed: normal \| wide \| full) -- using "normal"` | A *configuration* or front matter value is not one of the accepted ones | The theme uses a fallback instead of stopping so a typo does not produce HTTP 500 on every URL under `hugo server`. The message identifies the key, value, and fallback |
| A page setting has no effect and nothing is reported | The key was written inside a `ui:` block in front matter | Put page keys at the top level of front matter. Remove `ui.` from the site key. The theme ignores a front matter `ui:` block without reporting it. See [Page parameters](/docs/write/frontmatter/) |
| The build passes but production is missing something | An unreviewed WARNING | Review the build warnings and correct invalid configuration values, missing required giscus keys, or unsupported `comments.type` values. The upstream LibSass deprecation warning is accepted |
{.wide .expand}

The three Goldmark settings:

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      wrapStandAloneImageWithinParagraph: false
      attribute:
        block: true
    renderer:
      unsafe: true
```

The two most common shortcode errors look like this. Each ends with
`file:line:column`:

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
| Switching language lands on the home page | Hugo found no translation | If no translation exists, the switcher uses the target language's home page. To open the corresponding page, add its translation file |
| An anchor link opens the page but does not scroll | The translated heading text differs, so the generated ID does too | Set the English ID explicitly on the translated heading: `## 安装 {#installation}`. If a heading contains a shortcode or inline HTML, read its ID from the English page's rendered HTML. Do not guess it |
| Menus / home page sections are untranslated | They are not in pages but in configuration and data files | Menus are in `languages.<lang>.menus`. Home sections are in `data/home/<lang>.yaml`. Interface strings are in `i18n/<lang>.yaml`. See [Languages](/docs/customize/i18n/) |
| A page's `hreflang` points at another language's home page | The published 1.1.0 behavior or a copied older SEO partial can reuse the language-switcher fallback | The 1.2.0 development implementation omits missing translations from SEO alternates. Check the resolved theme version and template overrides; add the corresponding page when a translation is intended. The visible language switcher's home-page fallback remains valid |

## Search {#search}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A search box that never returns results | No index was generated | Check `params.offline_search` and open search. Inspect the page's `data-td-index-src` URL in Network. Production uses `offline-search-index.<language>.<hash>.json`. Development omits the hash. If the index is absent during `hugo server`, also check `offline_search_on_serve` |
| The index file 404s | A wrong `baseURL` | For a subpath deployment, an incorrect `baseURL` is the most common cause of an index 404. Check the requested index URL in the browser's network panel. See [Deploy](/docs/admin/deploy/#baseurl) |
| Search fails under `hugo server` but works in a build | The site turned the preview index off | `params.offline_search_on_serve` defaults to `true`, so preview matches production. An explicit `false` skips preview index generation. Remove that setting or restore `true` |
| Chinese queries find nothing | Usually not a tokenization problem | A CJK query uses the theme's substring fallback. First, open the Chinese page's actual `data-td-index-src` URL. Confirm that the Chinese index contains its content. Then check tokenization |
| A new page is not found while old ones are | The index is build output | Rebuild. Under `hugo server`, wait for the rebuild after editing |
| `params.search.algolia requires explicit appId, apiKey, and indexName values` | The three Algolia keys are incomplete | All three must be given explicitly; the theme will not use another project's DocSearch credentials. If Algolia is not wanted, delete the block |
| The command palette finds no content | Command actions and full-text search are separate | If the index is unavailable, the palette still opens and reports this condition. Page actions and commands still work. See [Command palette](/docs/customize/panel/) |

## Platform {#platform}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A 404 or missing styles on GitHub Pages | A project site's URL carries the repository path and `baseURL` does not | Use `--baseURL "${{ steps.pages.outputs.base_url }}/"` from the workflow. Do not hard-code the address. See the complete workflow in [Deploy](/docs/admin/deploy/#hosts) |
| "Last modified" and contributors are empty on GitHub Pages | The checkout is shallow | Add `fetch-depth: 0` to `actions/checkout`. The setting `enableGitInfo` requires the complete history |
| A Cloudflare Pages build says Hugo is too old | The build image's default Hugo is older than the theme requires | Set `HUGO_VERSION` in both the Production and Preview environments, and set `SKIP_DEPENDENCY_INSTALL=1` |
| The host's build cannot fetch the theme | The build environment has no Go | Hugo Modules require Go. If the platform does not provide it, use a submodule or commit `themes/oink/` |
| CI output differs from local | `go.work` took part in the CI build | Set `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` in CI so it reads only the version pinned in `go.mod` |
| A preview deployment got indexed | The preview was built in the production environment too | Do not pass `--environment production` for previews. A non-production build emits `noindex` and `Disallow: /`. See [Analytics and SEO](/docs/admin/analytics/#robots) |
| macOS reports too many open files | Live preview watches more files than the shell limit allows | First exclude generated and irrelevant directories from the watch. These usually cause the problem. Then, if necessary, consider `ulimit -n` |
| Slow, or missed changes, under WSL | Working across a Windows mount point | Run Hugo on paths inside the Linux filesystem. Cross-filesystem change notifications and permission behavior can break live reload |
| Bootstrap / Font Awesome / Lunr / Mermaid assets are missing | An incomplete distribution | Do not substitute a CDN URL. Confirm that `assets/third_party/`, `assets/js/third_party/`, `static/webfonts/`, and `VENDOR.json` are present. If a file is missing, download the same pinned version again |

## Checks a site can run {#site-checks}

Run the build from your site's root. Use the separate output checker from a
theme checkout that matches your pinned release. Replace `/path/to/oink`,
`/path/to/my-site/public`, and the base URL with your values. The remaining
commands are examples from this documentation repository's test harness.
They are not supplied to every OINK consumer.

| Check | Command | What it covers |
| --- | --- | --- |
| A production build | `hugo --printPathWarnings` | Duplicate output paths, invalid parameters, incomplete external integrations |
| Output trust check | `python3 /path/to/oink/bin/check-output-security.py --public /path/to/my-site/public --base-url https://my-site.example/` | Checks every `href` / `src` in all four outputs for site-relative paths or `http(s)` / `mailto` / `tel`. Rejects `javascript:` URLs and inline `on*` handlers. A cross-site `<iframe>`, `<script>`, or `<img>` requires explicit `--third-party` |
| Translation parity | `node scripts/check-doc-translations.mjs --public public` | Checks that each English page has a Chinese counterpart and that rendered heading IDs match. Detects misaligned anchors |
| The full gate | `npm test` | Runs the six below in sequence |
{.fields}

The six checks cover the following items:

- `test:base` — builds once, then runs the Markdown style, translation parity, rendered Markdown and link checks.
- `test:hugo-build` — build assertions: blog metadata, RSS, content components, and a deprecation-free build.
- `test:md-output` — compares Markdown and `llms.txt` output byte for byte against goldens. A change to a component's Markdown structure fails this check.
- `test:alt-site` — builds once for each alternate configuration in `tests/fixtures/*.yml`. Confirms that each combination still works.
- `test:favicons` — golden comparison of the head output.
- `test:release-pin-contract` — whether the version the site advertises matches the one pinned in `go.mod`.

Browser behavior has a separate suite. The command `npm run test:browser`
runs the Playwright accessibility (axe WCAG AA), responsive shell, keyboard
navigation, content component, code block, and scenario component suites in sequence.

> [!TIP] `check-output-security.py` lives in the theme repository
> It sits under the theme's `bin/`, is a product-level trust check any OINK site
> can run, and depends on no site test framework. Keep the theme-tool path and
> your site's output path distinct; the complete example is in
> [Verifying an offline build](/docs/admin/preview/#air-gapped).

## Diagnostic habits {#habits}

If the tables do not cover the problem, use these diagnostic steps:

- Reproduce the problem with a pinned Hugo Extended version. Avoid an environment with an unpinned version.
- Clear `public/` and `resources/_gen` and rebuild, to rule out stale caches.
- Compare the development and production configuration layers; many production-only problems are environment differences.
- Read the first error. Later errors may result from it.
- Use a minimal page to distinguish "theme behaviour" from "site override". Put the suspect content on its own page. Re-enable site overrides in batches until a batch causes the problem.
- Look at the failing page's browser console and network panel, especially the paths of any 404 resources.

## Getting help {#getting-help}
When you open an issue, include the complete `hugo version` output and the
theme version from `hugo mod graph | grep oink`. Include the first complete
error and a minimal page or site that reproduces it. This information avoids
an additional request for details.

- Theme and documentation issues: <https://github.com/pgsty/oink/issues>
- Issues with this site's content: <https://github.com/pgsty/oink.pgsty.com/issues>
- Upstream Docsy compatibility discussion: <https://github.com/google/docsy/discussions>

## Related {#related}

- [Local preview](/docs/admin/preview/) — clean builds, clearing caches, containers and workspaces
- [Deploy](/docs/admin/deploy/) — `baseURL`, the checklist and rollback
- [Upgrade](/docs/admin/upgrade/) — problems an upgrade introduces, and the migration toolkit
- [Search](/docs/customize/search/) — index scope, ranking and Algolia
- [Languages](/docs/customize/i18n/) — language configuration and the anchor alignment process
