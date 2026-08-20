---
title: Troubleshooting
linkTitle: Troubleshooting
description: Symptom → cause → fix for the four fault classes — build, language, search, platform — plus the checks a site can run for itself.
weight: 60
search_keywords: [troubleshooting, error, build failure, no search results, 404, baseURL, checks, debug]
aliases:
  - /docs/tutorial/troubleshooting/
---

When something goes wrong, run a clean production build first and read from the
first error; the ones after it are usually cascades:

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning --logLevel info
```

An npm, PostCSS, Autoprefixer or browser-asset download step in the log means
upstream Docsy's process has crept into the configuration. A consuming OINK
build is one Hugo command.

The four tables below are organized as symptom → cause → fix. Find the symptom
row; there is no need to read from the top.

## Build {#build}

| Symptom | Cause | Fix |
| --- | --- | --- |
| The build demands a newer Hugo | The standard build is installed rather than Extended, or the version is below {{< param hugoMinVersion >}} | `hugo version` output must contain `extended`. With several Hugos installed, check `PATH` and any version pinning before installing another |
| `module "github.com/pgsty/oink" not found` | The theme did not resolve | Hugo Module: check `hugo mod graph`, `go.mod`, `go.sum`, and any stray workspace or replace. Submodule: does CI run `git submodule update --init` before Hugo. Archive / clone: `theme:` must match the directory name under `themes/` |
| Module download hangs or times out | The Go module proxy is unreachable | Hugo pulls modules through Go, so `GOPROXY` applies. In mainland China, `export GOPROXY=https://goproxy.cn,direct`; in an isolated environment, use an offline archive or commit `themes/oink/` |
| `{.cards}`, `{.steps}`, `{caption=…}` appear as literal text | The site has not enabled Goldmark block attributes | The three settings below must be in the site's own `hugo.yml`; Hugo does not merge a theme's `markup` configuration |
| An image with an attribute line is wrapped in `<p>` and the caption does nothing | `wrapStandAloneImageWithinParagraph: false` is missing | As above; add all three together |
| Inline HTML is escaped into text | `renderer.unsafe: true` is missing | As above |
| `\(…\)` `$$…$$` display literally | The site has not enabled Goldmark passthrough | See [Math](/docs/components/math/); `math: true` is not the switch |
| `shortcode "tabs" must be closed or self-closed` | A `{{</* tabs */>}}` has no matching `{{</* /tabs */>}}` | The error carries `file:line:column`; add the closing marker there |
| `template for shortcode "tabs" not found` | The body calls a shortcode that does not exist, or quotes shortcode syntax without escaping it | Documentation that explains shortcode syntax must escape it: add `/*` and `*/` inside the opening and closing markers so Hugo treats it as text rather than a call. A misspelled name is simply corrected |
| `... attributes: unknown attribute "witdh" at ...` | An attribute-line key is misspelled or not permitted | An attribute line accepts that component's allowed keys plus `class`, `data-*` and `aria-*`; `style` and `on*` always fail the build. The allowed keys are in the error's parentheses |
| `shortcode "field": unsupported parameter "colour" at ...` | A shortcode parameter name is wrong | A *component* parameter — a shortcode parameter or an attribute-line key — always fails the build and never degrades silently. The error is always "which shortcode → which parameter → which file and line" |
| `invalid params.ui.page_width "widee" (allowed: normal \| wide \| full) -- using "normal"` | A *configuration* or front matter value is not one of the accepted ones | Configuration degrades instead of stopping, so one typo does not serve HTTP 500 on every URL under `hugo server`. The message names the key, the value and the fallback used. Build with `--panicOnWarning` and it cannot ship |
| A page setting has no effect and nothing is reported | The key was written inside a `ui:` block in front matter | Page keys sit at the top level of the front matter — the site key with `ui.` dropped. A `ui:` block there is read by nobody and reported by nobody; see [Page parameters](/docs/write/frontmatter/) |
| The build passes but production is missing something | A WARNING nobody read | Add `--panicOnWarning` to the build command. An invalid configuration value, a missing required giscus key, an unsupported `comments.type` and Hugo's deprecation notices are all warnings |

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

The two commonest shortcode errors look like this; note the trailing
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
| Switching language lands on the home page | Hugo found no translation | This is by design: with no translation it falls back to the target language's home page. Landing on the corresponding page requires that translation file to exist |
| An anchor link opens the page but does not scroll | The translated heading text differs, so the generated ID does too | Write the English ID explicitly on the translated heading: `## 安装 {#installation}`. Where a heading contains a shortcode or inline HTML, do not guess the ID from the text — read the English page's rendered HTML |
| Menus / home page sections are untranslated | They are not in pages but in configuration and data files | Menus are in `languages.<lang>.menus`, home sections in `data/home/<lang>.yaml`, interface strings in `i18n/<lang>.yaml` — see [Languages](/docs/customize/i18n/) |
| A Chinese page's `hreflang` points at the English home page | That page has no English counterpart | Add the English page, or accept the fallback: it doubles as a probe for whether Hugo recognized the pairing |

## Search {#search}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A search box that never returns results | No index was generated | With `params.offline_search: true`, the output root should have `offline-search-index.<language>.json`, one per language. Its absence means it is not enabled |
| The index file 404s | A wrong `baseURL` | On a subpath deployment, a wrong `baseURL` is the commonest cause of a 404 index. Look in the browser's network panel to see where it fetches the index — see [Deploy](/docs/admin/deploy/#baseurl) |
| Search fails under `hugo server` but works in a build | The site turned the preview index off | `params.offline_search_on_serve` defaults to `true`, so preview matches production; an explicit `false` skips index generation during preview — remove it or set it back to `true` |
| Chinese queries find nothing | Usually not a tokenization problem | A CJK query uses the theme's substring fallback. First confirm the Chinese page's content reached the Chinese index (open `offline-search-index.zh.json`), then consider tokenization |
| A new page is not found while old ones are | The index is build output | Rebuild. Under `hugo server`, wait for the rebuild after editing |
| `params.search.algolia requires explicit appId, apiKey, and indexName values` | The three Algolia keys are incomplete | All three must be given explicitly; the theme will not use another project's DocSearch credentials. If Algolia is not wanted, delete the block |
| The command palette finds no content | It and full-text search are two things | With the index unavailable the palette still opens, saying so, while page actions and commands work as usual — see [Command palette](/docs/customize/panel/) |

## Platform {#platform}

| Symptom | Cause | Fix |
| --- | --- | --- |
| A 404 or missing styles on GitHub Pages | A project site's URL carries the repository path and `baseURL` does not | Use `--baseURL "${{ steps.pages.outputs.base_url }}/"` from the workflow rather than hard-coding it. The full workflow is in [Deploy](/docs/admin/deploy/#hosts) |
| "Last modified" and contributors are empty on GitHub Pages | The checkout is shallow | Add `fetch-depth: 0` to `actions/checkout`: `enableGitInfo` needs the full history |
| A Cloudflare Pages build says Hugo is too old | The build image's default Hugo is older than the theme requires | Set `HUGO_VERSION` in both the Production and Preview environments, and set `SKIP_DEPENDENCY_INSTALL=1` |
| The host's build cannot fetch the theme | The build environment has no Go | Hugo Modules need Go. Where a platform does not provide it, use a submodule or commit `themes/oink/` |
| CI output differs from local | `go.work` took part in the CI build | Set `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` in CI so it reads only the version pinned in `go.mod` |
| A preview deployment got indexed | The preview was built in the production environment too | Do not pass `--environment production` for previews; a non-production build carries `noindex` and `Disallow: /` — see [Analytics and SEO](/docs/admin/analytics/#robots) |
| macOS reports too many open files | Live preview watches more files than the shell limit allows | Exclude generated and irrelevant directories from the watch first — usually the real cause — and only then consider `ulimit -n` |
| Slow, or missed changes, under WSL | Working across a Windows mount point | Let Hugo work on paths inside the Linux filesystem; cross-filesystem change notification and permission behaviour break live reload |
| Bootstrap / Font Awesome / Lunr / Mermaid assets are missing | An incomplete distribution | Do not paper over it with a CDN URL. Confirm `assets/third_party/`, `assets/js/third_party/`, `static/webfonts/` and `VENDOR.json` are all present, and re-fetch the same pinned version if one really is missing |

## Checks a site can run {#site-checks}

Beyond the build itself, a site can run these. The first two work on any OINK
site; the rest are this repository's npm scripts, and another site runs the
equivalent.

| Check | Command | What it covers |
| --- | --- | --- |
| A zero-warning build | `hugo --printPathWarnings --panicOnWarning` | Duplicate output paths, invalid parameters, incomplete external integrations |
| Output trust check | `python3 bin/check-output-security.py --public public --base-url https://oink.pgsty.com/` | Every `href` / `src` in all four outputs is site-relative or `http(s)` / `mailto` / `tel`; no `javascript:` URL and no inline `on*` handler; a cross-site `<iframe>`, `<script>` or `<img>` needs an explicit `--third-party` |
| Translation parity | `node scripts/check-doc-translations.mjs --public public` | Whether each English page has a Chinese counterpart, and whether the rendered heading IDs line up; misaligned anchors surface here |
| The full gate | `npm test` | Runs the six below in sequence |
{.fields}

What each of the six covers:

- `test:base` — builds once, then runs the Markdown style, translation parity, rendered Markdown and link checks.
- `test:hugo-build` — build assertions: blog metadata, RSS, content components, and a deprecation-free build.
- `test:md-output` — byte-level golden comparison of the Markdown and `llms.txt` output. Changing a component's Markdown shape fails here.
- `test:alt-site` — builds once per alternate configuration in `tests/fixtures/*.yml`, confirming the combinations still come up.
- `test:favicons` — golden comparison of the head output.
- `test:release-pin-contract` — whether the version the site advertises matches the one pinned in `go.mod`.

Browser behaviour is a separate suite: `npm run test:browser` runs the
Playwright accessibility (axe WCAG AA), responsive shell, keyboard navigation,
content component, code block and scenario component suites in turn.

> [!TIP] `check-output-security.py` lives in the theme repository
> It sits under the theme's `bin/`, is a product-level trust check any OINK site
> can run, and depends on no site test framework. Clone the theme repository and
> point it at your own `public/`; the arguments and usage are in
> [Verifying an offline build](/docs/admin/preview/#air-gapped).

## Diagnostic habits {#habits}

For problems the tables do not cover, dig along these lines:

- Reproduce with a pinned Hugo Extended version rather than judging in an environment where the version floats.
- Clear `public/` and `resources/_gen` and rebuild, to rule out stale caches.
- Compare the development and production configuration layers; many production-only problems are environment differences.
- Read the first error, not the last.
- Separate "theme behaviour" from "site override" with a minimal page: isolate the suspect content on its own page and re-enable site overrides in batches until one is implicated.
- Look at the failing page's browser console and network panel, especially the paths of any 404 resources.

## Getting help {#getting-help}
Opening an issue with these saves a round trip: the Hugo version (the full
`hugo version` output), the theme version (`hugo mod graph | grep oink`), the
first complete error, and a minimal page or site that reproduces it.

- Theme and documentation issues: <https://github.com/pgsty/oink/issues>
- Issues with this site's content: <https://github.com/pgsty/oink.pgsty.com/issues>
- Upstream Docsy compatibility discussion: <https://github.com/google/docsy/discussions>

## Related {#related}

- [Local preview](/docs/admin/preview/) — clean builds, clearing caches, containers and workspaces
- [Deploy](/docs/admin/deploy/) — `baseURL`, the checklist and rollback
- [Upgrade](/docs/admin/upgrade/) — problems an upgrade introduces, and the migration toolkit
- [Search](/docs/customize/search/) — index scope, ranking and Algolia
- [Languages](/docs/customize/i18n/) — language configuration and the anchor alignment process
