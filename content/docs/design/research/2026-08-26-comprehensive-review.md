---
title: OINK comprehensive review, 2026-08-26
linkTitle: 2026-08-26 review
description: Evidence-based review of post-v0.7.0 implementation, configuration, outputs, security, tests, performance, bilingual contracts, and the real integration site.
weight: 30
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK review, configuration validation, OpenAPI, Swagger, output contract, security, testing]
design_kind: research
design_status: verified-review-snapshot
last_verified: 2026-08-26
---

> [!NOTE] Historical review snapshot (2026-08-26)
> This page records the 2026-08-26 audit of `github.com/pgsty/oink` and its integration site.
> **OINK 0.7.1 subsequently fixed code findings F01–F06** (see the [0.7.1 release notes](/blog/release/0.7.1/)). Current behavior is defined by the [Design contracts](/docs/design/).

## Review verdict {#verdict}

OINK's main-line quality was substantially higher than that of a typical Hugo theme: the default path built successfully, bilingual coverage was strong, and component tests were broad.
The project treated output and trust boundaries seriously.
The real site showed no general breakage on desktop, mobile, light/dark modes, or primary accessibility paths.
Theme and site worktrees were clean. Their latest remote checks succeeded, and every locally rerun first-party suite passed.

While those checks passed, this review found **4 P1, 9 P2, and 5 P3 findings**, where some early or peripheral features fell short of OINK's modern contract.
The gates preserved selected positive scenarios very well, but did not systematically cover configuration combinations, static-output behavior, or the semantic accuracy of public documentation.

Before the next release tag, at minimum:

1. Disable Swagger UI's default online validator. Verify no implicit outbound requests with a non-localhost browser test.
2. Apply common type, range, URL, and CSS-value validation to all public configuration and Landing data.
3. Redesign Swagger, Redoc, and Asciinema behavior in static outputs and their runtime gates.
4. Repair generated schemas. Update public configuration and front matter references to match behavior.

## Baseline and method {#baseline-and-method}

### Review baseline {#review-baseline}

| Item | Snapshot |
| --- | --- |
| Theme repository | clean `main` at `fe439fdb1d7c2df745088c9bfcbb8c350403ee63`, equal to `origin/main` |
| Current stable tag | `v0.7.0` at `cbb6f4e0bfe47e17ba7aa41d04b8651c943cf858` |
| Documentation site | clean `main` at `fd5fcde`, publicly pinned to `github.com/pgsty/oink v0.7.0` |
| Local tools | Hugo Extended 0.164.0, Python 3.14.6, Node 26.4.0, npm 11.17.0 |
| Remote CI | theme HEAD [GitHub Actions run 32792753866](https://github.com/pgsty/oink/actions/runs/32792753866) succeeded |

### Validation executed {#executed-validation}

- All 31 theme checkers passed.
- All 85 migration unit tests passed.
- All 38 theme browser-runtime unit tests passed.
- All 40 HTML/Print/Markdown/RSS/LLMS golden surfaces passed.
- The strict `tests/site` Hugo build passed.
- The real bilingual site's `npm test` passed: 121/121 page pairs, 886 heading IDs, 24,860 internal links, and 3,172 fragments.
- The full real-site Playwright suite passed: sitemap-wide axe, 29 accessibility cases, and 45 responsive/navigation cases.
  It also passed 16 keyboard, 10 content-component, 18 code-block, 4 PRD5, and 5 theme-color cases.
- Extra visual review at 320 CSS px covered EN Home, ZH configuration, ZH Book, and OpenAPI/Redoc, with no page-level horizontal overflow.
- `npm audit` found no advisory among the site's 79 npm dependencies.
  An [OSV Query API](https://google.github.io/osv.dev/post-v1-querybatch/) batch for 26 exact `VENDOR.json` versions found no known advisory.
- `measure-baseline.py assets --fixture-site` passed its isolated strict build.

### Severity {#severity}

| Level | Meaning |
| --- | --- |
| P1 | Breaks a core product, security/privacy, or ordinary-editing invariant; fix before the next tag |
| P2 | Material behavior, contract, or compatibility defect; fix soon with a behavior gate |
| P3 | Maintainability, performance, process, or documentation-governance debt |

## Finding summary {#finding-summary}

| ID | Level | Finding | Default-site impact |
| --- | --- | --- | --- |
| F01 | P1 | Swagger UI enables its online validator on production URLs | Pages using `swagger` only |
| F02 | P1 | Invalid configuration can crash ordinary Hugo or silently emit bad output | Depends on authored configuration |
| F03 | P1 | Swagger/Redoc/Asciinema violate static-output and runtime-isolation contracts | Pages using those shortcodes |
| F04 | P1 | Landing sends unvalidated data to `safeCSS` and lets other bad values pass silently | Related Landing fields |
| F05 | P2 | Custom page-action and archived-version URLs bypass the shared URL policy | Sites configuring those options |
| F06 | P2 | Generated JSON Schemas contain wrong defaults, types, descriptions, and candidate keys | Authors using editor schemas |
| F07 | P2 | The supposedly complete configuration/front-matter references lag v0.7 behavior | All maintainers and consumers |
| F08 | P2 | Design contracts and proposal lifecycle present conflicting authorities | Maintainers |
| F09 | P2 | OpenAPI accessibility defects are excluded while Redoc is presented as an alternative | OpenAPI readers |
| F10 | P2 | Strict-CSP guidance omits theme-owned inline script and style | Strict-CSP consumers |
| F11 | P2 | No browser support baseline; automation is Chromium-only | Firefox, Safari, RTL, forced-color users |
| F12 | P2 | Output-security and rendered-Markdown gates have systematic blind spots | Consumers relying on those verdicts |
| F13 | P2 | Real cross-repository candidate integration is manual and non-atomic | Every public behavior change |
| F14 | P3 | Checker duplication and source-string coupling are high | Maintainers and isolated worktrees |
| F15 | P3 | Baseline CSS and fonts remain the main first-visit payload | Every HTML page |
| F16 | P3 | Vendor integrity is strong, but vulnerability/SBOM and CI supply-chain gates are manual | Release maintainers |
| F17 | P3 | Changelog, implemented proposals, and behaviorless metadata reduce signal | Maintainers and upgraders |
| F18 | P3 | The Print `isHTML` FIXME no longer explains the real dependency | Print-template maintainers |
{.wide .expand}

## Detailed findings {#detailed-findings}

### F01 — Swagger UI implicitly contacts the online validator (P1) {#f01-swagger-validator}

`layouts/_shortcodes/swagger.html` initializes `SwaggerUIBundle` without `validatorUrl: null`.
Vendored `swagger-ui-bundle.js` defaults to `https://validator.swagger.io/validator`.
It suppresses the badge only when specification URLs contain `localhost` or `127.0.0.1`.
On deployed hosts, it creates an online-validator badge whose request includes the specification URL.

This violates the promises of disabled-by-default theme network features, local same-origin specifications, and local-first operation, and can disclose internal hostnames or specification URLs on intranet deployments.
The localhost exemption explains why every local browser test missed the request.

Set `validatorUrl: null` explicitly.
Any future online validator should require an explicit opt-in URL, use the shared URL policy, and have privacy/CSP integration documentation.
Test a production-like, non-localhost origin while intercepting every request.
Require same-origin specifications to fetch only first-party resources.

### F02 — Invalid configuration does not consistently warn and fall back (P1) {#f02-config-validation}

`ui-param.html` says callers validate types. Some callers do not. Minimal builds produced these results:

| Input | Actual result |
| --- | --- |
| `ui.blog_index_size: nope` | ordinary build fails because `.Paginate` requires a positive integer |
| `ui.sidebar_expand_levels: nope` | ordinary build fails in `add` |
| `ui.sidebar_menu_truncate: nope` | ordinary build fails while `first` casts the value |
| `offline_search_summary_length: nope` | ordinary build fails while `truncate` casts the value |
| `ui.sidebar_width_min: "1; color: red"` | warning-free build emits `--td-shell-sidebar-min: ZgotmplZpx` |
| `ui.sidebar_width_min: -50` | warning-free build emits `-50px` |
| `blog_index_columns: 2.5` / `section_index_columns: 2.5` | warning-free build feeds `2.5` to CSS `repeat()` |
| `ui.sidebar_item_overflow: clip` | warning-free build silently behaves as `ellipsis` |
| `ui.sidebar_menu_foldable: definitely` | the non-boolean string is truthy and enables folding |
| `ui.blog_index_size: 0` | Hugo `default` silently converts it back to 12 |

Landing `marquee.rows`/`capabilities.columns` and Asciinema numeric parameters also call `int`/`float` directly.
Other invalid types, including `print.toc` and `offline_search_max_results`, silently change behavior.

This directly contradicts the Diagnostics decision: ordinary `hugo server` can become unusable, while some invalid input passes strict publishing gates without warnings.
Add shared validators for integers, positive integers, ranges, paired ranges, and grid counts.
Normalize values before arithmetic or output.
For every public key, test valid site and page cases, invalid ordinary cases with warnings/fallbacks, and invalid strict cases with failures.
Domain resolvers should enforce cross-field rules such as `min <= max`, pager size `>= 1`, and integer grid counts.

### F03 — OpenAPI and Asciinema remain HTML-only islands (P1) {#f03-static-output-leakage}

Architecture and Components require Markdown/LLMS without theme markup, static Print, and safe static RSS or explicit omission.
The observed behavior conflicts with these requirements:

- Redoc emits `<style>`, `<div class="td-redoc">`, and `<redoc spec-url=...>` into generated `.md`.
- Swagger puts an executable inline initializer in its shortcode.
- Asciinema `.md` contains the complete `td-asciinema` tree and JSON script.
- Asciinema Print loads about 185 KB of player JS/CSS and prints only an incidental frame.
- Swagger/Redoc leave empty Print containers and can select 1–2 MB runtimes.
- These shortcodes are absent from the Markdown/RSS/Print golden matrix.

The result is theme HTML in agent output, empty shells for paper/EPUB readers, useless runtime in Print, and a strict-CSP violation from Swagger.
Reader-facing guides describe these defects as output behavior, conflicting with normative contracts.

Make all three branch on `tdOutputFormat`. Provide full behavior in interactive HTML.
For Print/Markdown/RSS, provide a titled static link with the specification or cast address, or explicitly omit the component.
Only interactive HTML should set capability flags.
Move Swagger initialization to a stable chunk and Redoc styles to a stylesheet.
Add four-output goldens and assertions that unwanted runtimes are absent.

### F04 — Landing CSS, URL, and numeric inputs do not share one trust boundary (P1) {#f04-landing-validation}

`hero.html` validates `title_size`, but concatenates `media.ratio` and `media.max_width` unchanged before marking the full string `safeCSS`.
This input:

```yaml
sections:
  - type: hero
    data:
      title: Probe
      image: /icons/logo.svg
      media:
        ratio: "1fr; background-image: url(https://example.invalid/x)"
        max_width: "240px; color: red"
```

passes a strict build without warnings and emits:

```html
style="--td-hero-columns: 1fr; background-image: url(https://example.invalid/x);
       --td-hero-media-max: 240px; color: red;"
```

Landing accepts inline `sections` in page front matter, so authors can supply these values directly.
Other sections handle `columns`, `rules`, dimensions, styles, icons, and URLs inconsistently.
A `javascript:` URL often becomes `#ZgotmplZ` without warnings. Invalid columns become `ZgotmplZ`.
Some direct integer casts abort builds.

Add section normalization with common handling for classes, icons, URLs, CSS lengths, grid counts, booleans, and enums.
`hero.media.ratio` should accept two constrained track values, not arbitrary CSS.
`max_width` should use the length validator. All Landing actions should use `content/url.html`.
Each built-in section needs negative tests.

### F05 — Two configuration URL surfaces bypass shared policy (P2) {#f05-url-policy-bypass}

`params.ui.page_context_menu.links` passes through `url-template.html` directly to `safeURL`.
`url_latest_version` is also treated as trusted configuration and marked `safeURL`.
Neither path validates schemes, hosts, whitespace, or protocol-relative URLs. Warning-free builds can produce:

```html
<a class="td-page-actions__item"
   href="javascript:document.body.dataset.pwned=1;undefined">
```

Clicking executes JavaScript, which violates the published safe-URL model and gives copied configuration fragments unnecessary execution capability.

Use the shared resolver to allow only HTTP(S) and explicitly supported first-party relative URLs.
Also validate archived-version URLs.
The browser action registry's second check provides useful defense, but progressive-enhancement anchors must not bypass it.

### F06 — Generated schemas disagree with actual YAML (P2) {#f06-schema-generation}

The small parser in `generate-config-schema.py` does not remove inline comments. At least 11 defaults become strings.
These include `print.toc`, which becomes `"true # ..."` instead of a boolean, and `print.section_break_wordcount`.
Both index column counts and enum defaults such as `footer_style`, `blog_index`, and `typography` are also affected.

Comment association is also incorrect.
Breadcrumb commentary attaches to `section_index`; quick-link commentary attaches to `sidebar_icon_policy`.
Taxonomy-icon commentary attaches to `pager_types`; local-interface commentary attaches to `image_zoom`.

The front matter schema offers removed detector keys: `release`, `upstream_attribution`, and `downstream_modified`.
It incorrectly treats navbar-menu `Params.columns` as page front matter.
The drift check compares the same defective generator with committed output, preserving the error.

Use a real comment-preserving parser or explicit machine metadata markers. Do not extend the ad hoc parser.
The scanner must distinguish page, menu, shortcode, and legacy-detector contexts.
Tests should compare schema defaults with Hugo's actual parsed values and exclude removed keys from completion.

### F07 — Public configuration and front-matter references are not current (P2) {#f07-public-doc-drift}

Both reference pages claim to list every key read by the theme. Material differences include:

- Long English date defaults, although `hugo.yaml` uses ISO `2006-01-02`.
- Blog docs omit `hero`, `table`, toggle, size, `toc_style`, and `toc_taxonomies`.
- Removed `release` maps and filters are presented as current, while `release_url` is absent.
- `images: []` is described as disabling featured images, although bundle discovery continues.
- `upstream_modified` is described as adding a line, although it changes the attribution verb.
- Invalid-input claims conflict: immediate failure versus warnings in ordinary previews and failure only at strict gates.
- The Book guide says OINK stops at Print HTML, although v0.7 shipped BookManifest/EPUB/PDF tools.
- Asciinema/OpenAPI guides present static-output defects as product contracts.
- Features lists 28 vendor dependencies, although the authoritative manifest has 26.

English and Chinese usually share the same outdated answer. Translation parity cannot detect that error.
Treat both references as a focused contract migration.
Derive comparable key inventories from implementation/schema. Review semantics manually.
Check current-key coverage, placement of removed keys, enums, and defaults.

### F08 — The Design tree contains conflicting authorities and unretired proposals (P2) {#f08-design-governance}

Shell retires navbar `columns`/mega panels and promises a warning with one column.
Landing still says navbar mega-menu columns accept 1–4. Implementation and tests follow Shell.

The lifecycle is also incomplete. `config-schema` is marked implemented but remains an Active proposal.
Book publication has shipped the manifest, EPUB, PDF, and most CI work, but a Draft proposal duplicates the Architecture contract.
Media convergence keeps implemented milestones and open M4 in the original design record.

Correct Landing. Move stable config-schema facts to Architecture/Decision and retire the proposal.
Reduce Book publication to the remaining consumer-migration question, or replace it with a focused follow-up.
Active proposals should not define a second current API.

### F09 — OpenAPI accessibility claims conflict with test exclusions (P2) {#f09-openapi-accessibility}

The axe suite excludes `.td-swagger-ui` and `.td-redoc`.
Its comments identify Swagger's unnamed server selector and version stamp that cannot scroll by keyboard.
They also identify Redoc operation-description contrast.
The guide discloses only Swagger defects and presents rendered Redoc as the alternative.
This implies that Redoc meets the site's zero-violation gate.

Publish the actual boundary in both languages. Fix Redoc contrast in theme CSS where possible.
Use a narrow post-render adapter for fixable Swagger DOM.
For remaining upstream defects, provide versioned waivers, upstream issue links, and a separate axe report.
Do not exclude the entire supported feature while claiming zero site-wide violations.

### F10 — The current theme does not directly support a strict CSP (P2) {#f10-csp}

Deployment guidance says strict CSP is workable.
It lists only author scripts, ECharts callbacks, analytics, remote specifications or diagram services, and Giscus.
Ordinary Docs pages already emit two theme-owned inline scripts for initial theme display and shell prepaint, plus inline styles.
Markmap, Swagger, Algolia, and Google CSE add more theme-owned inline initializers.
There is no nonce API, hash manifest, or complete sample policy.

`script-src 'self'` blocks initial theme display and shell-state restoration.
`style-src 'self'` blocks theme colors, font roles, Landing, and several inline custom properties.
Consumers must add `'unsafe-inline'`, maintain hashes, or override templates. The guide states none of these requirements.

Move stable initializers to same-origin chunks with data/JSON configuration.
For unavoidable inline content, provide a generated hash manifest or one nonce hook.
Publish policies for minimal core, Markmap/OpenAPI, and third-party integrations. State the `style-src` requirements.

### F11 — Browser compatibility has no baseline or cross-engine proof (P2) {#f11-browser-compatibility}

CI installs only Chromium. Product documentation gives no minimum Chrome, Firefox, or Safari version.
The implementation uses or enhances content with `:has()`, `dialog`, `inert`, `color-mix()`, `@property`, logical properties, and discrete display transitions.
Some paths have fallbacks, but there is no engine matrix.

RTL checks mostly use source markers, small JS tests, and one element-level geometry change.
They do not use a complete RTL-language site.
Most forced-color checks verify SCSS strings instead of computed behavior.

Publish a small support matrix. Test core shell, navigation, content, and dialogs on Chromium, Firefox, and WebKit.
Add a real `languageDirection: rtl` integration configuration.
Also test forced colors, reduced motion, 320 px, and 200% zoom.

### F12 — Output-security and Markdown gates do not inspect every claimed surface (P2) {#f12-checker-blind-spots}

For `.md`, `check-output-security.py` checks only Markdown links. It does not send raw HTML through the HTML scanner.
Redoc/Asciinema scripts, `spec-url`, and raw `href` are therefore invisible.
It also ignores CSS and JSON URLs. The fixture uses a broad `--third-party` allowance.

`check-rendered-markdown.mjs` has a misleading name. It scans generated HTML text for leftover Markdown syntax, not generated `.md`.
The actual Markdown golden set covers 15 pages and omits OpenAPI/Asciinema.

Use clearly named gates for HTML trust, machine-output purity, and rendered-text residue.
Give generated Markdown a narrow raw-HTML allowlist.
Deliberately parse CSS URLs, form actions, JSON URLs, and non-executable JSON scripts.
Every public shortcode should have at least one Markdown/Print/RSS behavior case.

### F13 — Candidate integration across the two repositories is manual (P2) {#f13-cross-repo-gate}

Theme CI tests only synthetic `tests/site`. Documentation-site CI tests only the public tag in `go.mod`.
Real EN/ZH and Playwright validation for theme PRs depends on local maintainer `HUGO_MODULE_REPLACEMENTS`.
Changes in both repositories cannot be committed atomically.

Both repositories can pass checks while public references differ from implementation, as this review shows.
The written separation of release states is correct, but automation does not enforce delivery of implementation, owning checker, and paired contract together.

Add a read-only candidate workflow. Check out a theme PR SHA and a declared documentation-site SHA.
Apply a temporary module replacement, then run `npm test` and critical browser suites.
Allow Design-contract PRs to identify candidate theme SHAs.
Tag, pin, and deployment remain distinct. The candidate pair gains one traceable joint result.

### F14 — Checker maintenance cost and source coupling are high (P3) {#f14-checker-maintainability}

Coverage is valuable, but 34 `check-*.py` files contain 546 `read_text()` calls.
Many repeat `require`, temporary-site creation, file writes, Hugo invocation, and error aggregation.
Many assertions preserve template/SCSS spelling, nearby comments, or complete file equality instead of observable behavior.

Some helpers hard-code `theme: oink` with `--themesDir <repo-parent>`, making the checkout or worktree basename an implicit requirement.
Without a common Python lint/type gate, checkers are quick to add but can retain shared testing omissions.

Create a common fixture builder and assertion library. Put negative cases in table-driven data.
Keep source checks only for actual topology rules. Move other checks to parsed output or computed styles.
Load themes through explicit symlinks or module replacements instead of repository basenames.

### F15 — Runtime splitting succeeded, but baseline CSS/fonts dominate first visit (P3) {#f15-performance}

The isolated strict fixture baseline was:

| Metric | Value |
| --- | ---: |
| Cold/warm build | 1.256 s / 1.273 s |
| Pages | 249 |
| Stable JS chunks | 18 |
| Main + Font Awesome CSS | 549.8 KB raw / 91.1 KB gzip |
| Fonts total (FA portion) | 999.7 KB raw / 248.5 KB gzip |
| Median Docs-page JS | 176.9 KB raw / 55.3 KB gzip |
| Generated public | 26.2 MB |
| v0.7.0 Go module zip | 7.8 MB (about 20.5 MB and 1,140 files expanded) |

Stable first-party capability chunks removed bundles for feature combinations correctly. Large third-party runtimes remain page-local.
Bootstrap/theme/Landing CSS and the complete Font Awesome distribution are the remaining common cost.

Do not prune Font Awesome based on theme template usage. That would violate the authoring contract.
Measure whether Landing, Book, or Swagger CSS can be independently cached and limited to relevant pages.
Inspect fonts requested on first visits. Maintain a trend report instead of an arbitrary hard threshold.

### F16 — Vendor builds are reproducible, but advisory and CI supply-chain gates remain manual (P3) {#f16-supply-chain}

Positive evidence: `VENDOR.json` pins 26 packages, 56 artifacts, 31 license files, and tree hashes.
`check-vendor.py` passed. OSV and npm audit found no known advisory in this snapshot.

The custom manifest is outside common SBOM/advisory gates. `npm audit` cannot inspect vendored browser packages.
Two documentation-site workflows download Hugo `.deb` files and immediately run `sudo dpkg -i` without checking a checksum.
Actions use movable major tags. Theme CI uses floating Python `3.x`.

Generate CycloneDX/SPDX from `VENDOR.json`. Schedule OSV scans.
Pin Hugo archive/deb SHA-256 values and trusted release actions to commit SHAs.
Select a specific Python version or matrix.

### F17 — Design and release records have lost signal (P3) {#f17-governance-noise}

`CHANGELOG.md` has 1,768 lines. Its v0.7.0 section has about 300 lines, and Unreleased uses about 20 lines for one checker retry.
These narratives provide useful engineering history, but make breaking changes, migrations, and observable behavior harder for upgraders to find.

Contracts recognize `book_kind` and `book_part`, and content front matter repeats them, but templates explicitly do not read them.
They impose API-like authoring work without behavior. Implemented proposals that remain active provide another duplicate answer.

Keep changelog entries focused on observable changes, breaking/migration notes, and concise fixes.
Move long design accounts to Blog/Research and link them.
Give metadata without behavior a consumer/schema, or make it site-owned.

### F18 — The Print `isHTML` FIXME is no longer accurate (P3) {#f18-print-ishtml}

`hugo.yaml` says to leave `isHTML` unset until Hugo fixes issue #14381.
Hugo closed it on 2026-01-17, and the fix shipped before OINK's 0.160.1 floor.
Enabling `isHTML: true` still produces missing page/section/landing Print-layout warnings in this theme, which fail strict builds.

The dependency changed from “waiting for an alias fix” to “the current Print template names rely on non-HTML lookup
rules.” Do not simply remove the workaround.
First complete the HTML-classified Print lookup matrix and alias/subpath tests.
If false remains intentional, explain the actual reason in the comment.
Add a test to prevent cleanup based only on the closed issue.

## Strengths {#strengths}

- Source, local validation, commit, tag, public module, consumer pin, and deployment are explicitly separated.
- The Hugo 0.160.1 floor plus 0.164/0.165 theme matrix is strong.
- Most newer components follow warning/fallback, four-output, shared URL/attribute, and capability-flag contracts.
- The 32 locale schemas match, with strong real EN/ZH page, heading-ID, link, and narrow-navigation gates.
- Search, keyboard behavior, surface coordination, page actions, and theme color have both unit and browser behavior tests.
- Vendor license/hash checks and EPUB/PDF path, loopback, CSP, and overwrite boundaries are thoughtfully designed.
- Manual 320 px review found no page-level overflow; current core visual quality is good.
- Builds are fast, and first-party JS now uses stable capability chunks.

## Recommended remediation roadmap {#remediation-roadmap}

### Phase 0: before the next tag {#phase-0}

1. Set Swagger `validatorUrl: null` and add a production-origin no-network test.
2. Build the public-parameter inventory and validate every F02/F04 field with negative cases.
3. Redesign four-output behavior and runtime gates for Swagger, Redoc, and Asciinema.
4. Validate custom action and archived-version URLs.
5. Repair the schema parser/scanner and regenerate both schemas.
6. Synchronize paired Config, Front matter, OpenAPI, Asciinema, Book, Features, and Landing-contract pages.

### Phase 1: contract gates {#phase-1}

1. Create a minimum HTML/Print/Markdown/RSS coverage map for all 29 shortcodes.
2. Split and strengthen output-trust and machine-output-purity gates.
3. Normalize all Landing section input centrally.
4. Externalize theme-owned inline initializers and publish CSP guidance.
5. Add a cross-repository candidate workflow.

### Phase 2: compatibility and structure {#phase-2}

1. Add Firefox/WebKit, real RTL, forced colors, and 200% zoom.
2. Consolidate the Python checker harness and source-string assertions.
3. Evaluate surface-specific CSS and actual font requests.
4. Generate an SBOM, schedule OSV, and pin CI download digests.
5. Retire implemented proposals and reduce changelog volume.

## Acceptance criteria {#acceptance-criteria}

- A same-origin Swagger specification on a production-like origin makes no third-party request.
- Every invalid public configuration warns and falls back/omits in ordinary builds, fails strictly, and emits no `ZgotmplZ`.
- Generated `.md` contains no `td-*`, theme script/style, or empty interactive container.
- Print loads no Swagger/Redoc/Asciinema runtime and provides an understandable static alternative.
- Schema default types exactly match Hugo parsing, and removed keys are absent from completion.
- EN/ZH configuration and front-matter key/enum/default inventories match implementation.
- Core Playwright passes on Chromium, Firefox, and WebKit, with real RTL and forced-color behavior assertions.
- Every candidate theme SHA has a traceable joint validation against the real documentation site.

## Review limits {#limits}

This review did not individually audit consumer repositories, production response headers/CDN caches, real Firefox/Safari, or screen readers.
It did not manually reverse-engineer 13 MB of minified third-party source.
Advisory checks are a 2026-08-26 snapshot and may change.
Existing CI/contract evidence covered DDIA/TPME EPUB/PDF consumers.
