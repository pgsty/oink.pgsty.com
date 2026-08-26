---
title: OINK comprehensive review, 2026-08-26
linkTitle: 2026-08-26 review
description: An evidence-based review of OINK's post-v0.7.0 implementation, configuration, outputs, security, tests, performance, bilingual contracts, and real integration site.
weight: 30
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK review, configuration validation, OpenAPI, Swagger, output contract, security, testing]
design_kind: research
design_status: verified-review-snapshot
last_verified: 2026-08-26
---

> [!WARNING] Review snapshot, not a new contract
> This page records evidence collected against `github.com/pgsty/oink` and its integration site on 2026-08-26.
> It changes no API and does not mean that any recommendation below is implemented. Current Design contracts,
> implementation, and owning checkers remain authoritative.
>
> **Superseded in part by OINK 0.7.1.** The code findings F01–F06 were fixed in that release — see the
> [0.7.1 release notes](/blog/release/0.7.1/). Read the findings below as the evidence that motivated the fix,
> not as the current state of the theme.

## Review verdict {#verdict}

OINK's main-line quality is substantially above that of a typical Hugo theme. The default path builds, bilingual coverage is
strong, component tests are broad, and the project treats output and trust boundaries seriously. The real site showed no
general breakage across desktop, mobile, light/dark, and the primary accessibility paths. Theme and site worktrees were clean,
their current remote checks were green, and every locally rerun first-party suite passed.

Green checks do not prove that every published invariant holds. This review found **4 P1, 9 P2, and 5 P3 findings**.
The recurring pattern is that OINK has a strong modern contract, while several early or peripheral surfaces have not joined it;
the current gates are excellent at preserving selected positive scenarios but do not systematically cover configuration space,
static-output degradation, or the semantic accuracy of public documentation.

Before the next release tag, at minimum:

1. disable Swagger UI's default online validator and lock zero implicit egress with a non-localhost browser test;
2. place all public configuration and Landing data behind common type, range, URL, and CSS-value validation;
3. redesign Swagger, Redoc, and Asciinema output degradation and runtime gates; and
4. repair generated schemas and bring the public configuration/front-matter references back to current behavior.

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

- all 31 theme checkers passed;
- all 85 migration unit tests passed;
- all 38 theme browser-runtime unit tests passed;
- all 40 HTML/Print/Markdown/RSS/LLMS golden surfaces passed;
- the strict `tests/site` Hugo build passed;
- the real bilingual site's `npm test` passed: 121/121 page pairs, 886 heading IDs, 24,860 internal links, and
  3,172 fragments;
- the full real-site Playwright suite passed: sitemap-wide axe, 29 accessibility cases, 45 responsive/navigation cases,
  16 keyboard cases, 10 content-component cases, 18 code-block cases, 4 PRD5 cases, and 5 theme-color cases;
- extra visual review at 320 CSS px covered the EN home, ZH configuration, ZH Book, and OpenAPI/Redoc pages with no
  page-level horizontal overflow;
- `npm audit` reported no advisory among the site's 79 npm dependencies; an
  [OSV Query API](https://google.github.io/osv.dev/post-v1-querybatch/) batch for the 26 exact versions in `VENDOR.json`
  returned no known advisory;
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

## Detailed findings {#detailed-findings}

### F01 — Swagger UI implicitly contacts the online validator (P1) {#f01-swagger-validator}

`layouts/_shortcodes/swagger.html` initializes `SwaggerUIBundle` without `validatorUrl: null`. The vendored
`swagger-ui-bundle.js` defaults that option to `https://validator.swagger.io/validator` and suppresses the badge only when
the specification URL contains `localhost` or `127.0.0.1`. On a deployed host it creates an online-validator badge whose
request includes the specification URL.

This violates the promises that theme-owned network features are off by default, that same-origin specifications remain
local, and that OINK is local-first. An intranet deployment can disclose its internal hostname/specification URL. The
localhost exemption is also why every current local browser test misses the request.

Set `validatorUrl: null` explicitly. Any future online validator should be an explicit opt-in URL, pass the shared URL policy,
and be documented as a privacy/CSP integration. Test a production-like non-localhost origin while intercepting every request
and require same-origin specifications to fetch first-party resources only.

### F02 — Invalid configuration does not consistently warn and fall back (P1) {#f02-config-validation}

`ui-param.html` says callers validate types; several do not. Minimal builds produced the following results:

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

Landing `marquee.rows`/`capabilities.columns` and Asciinema numeric parameters also call `int`/`float` directly. Other bad
types, such as `print.toc` or `offline_search_max_results`, silently change behavior.

This directly contradicts the Diagnostics decision: ordinary `hugo server` may become unusable, while some bad input reaches
a strict publishing gate without any warning. Add shared integer, positive-integer, range, paired-range, and grid-count
validators. Normalize before arithmetic or output. Every public key needs legal site and page cases plus illegal ordinary
(warn/fallback) and strict (failure) cases. Cross-field invariants such as `min <= max`, pager size `>= 1`, and integer grid
counts belong in domain resolvers.

### F03 — OpenAPI and Asciinema remain HTML-only islands (P1) {#f03-static-output-leakage}

Architecture and Components require Markdown/LLMS without theme component markup, static Print, and safe static RSS or explicit
omission. Current behavior disagrees:

- Redoc emits `<style>`, `<div class="td-redoc">`, and `<redoc spec-url=...>` into generated `.md`;
- Swagger places an executable inline initializer in its shortcode;
- Asciinema `.md` contains the full `td-asciinema` tree and JSON script;
- Asciinema Print loads about 185 KB of player JS/CSS and can print only an incidental frame;
- Swagger/Redoc leave empty Print containers and can still select 1–2 MB runtimes; and
- these shortcodes are absent from the Markdown/RSS/Print golden matrix.

Agent output contains theme HTML, paper/EPUB readers receive empty shells, Print carries useless runtime, and Swagger breaks a
strict CSP. Reader-facing guides currently document these defects as output behavior, contradicting the normative contracts.

Make all three branch on `tdOutputFormat`: full behavior in interactive HTML; a titled static link and spec/cast address in
Print/Markdown/RSS, or explicit omission. Only interactive HTML should set capability flags. Move Swagger initialization into
a stable chunk and Redoc styles into a stylesheet; add four-output goldens and runtime-absence assertions.

### F04 — Landing CSS, URL, and numeric inputs do not share one trust boundary (P1) {#f04-landing-validation}

`hero.html` validates `title_size` but concatenates `media.ratio` and `media.max_width` verbatim before marking the complete
string `safeCSS`. This input:

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

builds strictly with no warning and emits:

```html
style="--td-hero-columns: 1fr; background-image: url(https://example.invalid/x);
       --td-hero-media-max: 240px; color: red;"
```

Landing permits inline `sections` in page front matter, so this is not merely an internal repository constant. Other section
`columns`, `rules`, dimensions, styles, icons, and URLs are handled ad hoc. A `javascript:` URL often becomes `#ZgotmplZ`
without warning; bad columns become `ZgotmplZ`; some direct integer casts abort the build.

Add a section normalization layer with common class, icon, URL, CSS-length, grid-count, boolean, and enum handling.
`hero.media.ratio` should be two constrained track values rather than arbitrary CSS; `max_width` should use the length
validator. All Landing actions should reuse `content/url.html`, and each built-in section needs negative tests.

### F05 — Two configuration URL surfaces bypass shared policy (P2) {#f05-url-policy-bypass}

`params.ui.page_context_menu.links` passes through `url-template.html` and directly into `safeURL`; `url_latest_version` is
also treated as trusted configuration and marked `safeURL`. Neither path validates scheme, host, whitespace, or
protocol-relative URLs. A warning-free build can produce:

```html
<a class="td-page-actions__item"
   href="javascript:document.body.dataset.pwned=1;undefined">
```

Clicking executes JavaScript. Site configuration is high-trust input, so this is not a default remote exploit, but it violates
the published safe-URL model and gives copied configuration unnecessary execution power.

Allow only HTTP(S) and explicitly supported first-party relative URLs, using the shared resolver. Validate archived-version
URLs too. The browser action registry's second check is good defense, but the progressive-enhancement anchor must not bypass it.

### F06 — Generated schemas disagree with actual YAML (P2) {#f06-schema-generation}

The small parser in `generate-config-schema.py` does not strip inline comments. At least 11 defaults become strings, including
`print.toc` (`"true # ..."` instead of boolean), `print.section_break_wordcount`, both index column counts, and enum defaults
such as `footer_style`, `blog_index`, and `typography`.

Comment association also drifts: breadcrumb commentary is attached to `section_index`; quick-link commentary to
`sidebar_icon_policy`; taxonomy-icon commentary to `pager_types`; and local-chrome commentary to `image_zoom`.

The front-matter schema advertises removed detector keys (`release`, `upstream_attribution`, `downstream_modified`) and
misclassifies navbar-menu `Params.columns` as page front matter. The drift check compares the same buggy generator with its
committed output, so it reliably preserves the error.

Use a real comment-preserving parser or explicit machine metadata markers rather than extending the ad-hoc parser. The scanner
must distinguish page, menu, shortcode, and legacy-detector contexts. Tests should compare each schema default to Hugo's actual
parsed value and keep removed keys out of completion.

### F07 — Public configuration and front-matter references are not current (P2) {#f07-public-doc-drift}

Both reference pages claim to list every key the theme reads. Material drift includes:

- long English date defaults where `hugo.yaml` now uses ISO `2006-01-02`;
- Blog docs missing `hero`, `table`, toggle, size, `toc_style`, and `toc_taxonomies`;
- the removed `release` map and release filters presented as current, while `release_url` is absent;
- `images: []` described as disabling featured images even though bundle discovery continues;
- `upstream_modified` described as adding a line, while current behavior changes the attribution verb;
- inconsistent claims that invalid input directly fails versus warns in ordinary preview and fails only at a strict gate;
- the Book guide saying OINK stops at Print HTML after v0.7 shipped BookManifest/EPUB/PDF tooling;
- Asciinema/OpenAPI guides turning static-output defects into product contracts; and
- Features saying 28 vendor dependencies when the authoritative manifest has 26.

English and Chinese usually agree on the stale answer, so translation parity cannot detect the error. Treat the two references
as a focused contract migration. Derive a comparable key inventory from implementation/schema, keep semantics reviewed by hand,
and gate current-key coverage, removed-key placement, enums, and defaults.

### F08 — The Design tree contains conflicting authorities and unretired proposals (P2) {#f08-design-governance}

The clearest contradiction is that Shell retires navbar `columns`/mega panels and promises a warning plus one column, while
Landing still says navbar mega-menu columns accept 1–4. Implementation and tests follow Shell.

Lifecycle is also incomplete. `config-schema` is marked implemented but remains an Active proposal. Book publication has shipped
manifest, EPUB, PDF, and most CI work while a Draft proposal duplicates the Architecture contract. Media convergence retains
implemented milestones and the open M4 in one original design record.

Correct Landing, move stable config-schema facts into Architecture/Decision and retire the proposal, and reduce Book publication
to the remaining consumer-migration question or replace it with a narrow follow-up. Active proposals should not contain a
second current API.

### F09 — OpenAPI accessibility claims conflict with test exclusions (P2) {#f09-openapi-accessibility}

The axe suite excludes both `.td-swagger-ui` and `.td-redoc`. Its comments name Swagger's unnamed server selector and
non-keyboard scrollable version stamp, plus Redoc operation-description contrast. The guide discloses only Swagger's defects and
presents the rendered Redoc as the alternative, implying that Redoc meets the site's zero-violation gate.

Publish the real boundary in both languages. Fix Redoc contrast in theme CSS where possible; use a narrow post-render adapter
for fixable Swagger DOM. Remaining upstream defects should have versioned waivers, upstream issue links, and a separate axe
report instead of excluding the whole supported surface while claiming a site-wide zero.

### F10 — The current theme does not directly support a strict CSP (P2) {#f10-csp}

Deployment guidance says strict CSP is workable but lists only author scripts, ECharts callbacks, analytics, remote specs or
diagram services, and Giscus. A normal Docs page already emits two theme-owned executable inline scripts (theme first paint and
shell prepaint) plus inline style. Markmap, Swagger, Algolia, and Google CSE add more theme-owned inline initializers. There is no
nonce API, hash manifest, or complete sample policy.

`script-src 'self'` blocks theme first paint and shell-state restoration; `style-src 'self'` blocks theme color, font roles,
Landing, and several inline custom properties. Consumers must add `'unsafe-inline'`, maintain hashes, or override templates,
none of which the guide states.

Move stable initializers into same-origin chunks with data/JSON configuration. For unavoidable inline content, provide a
generated hash manifest or one nonce hook. Publish minimal-core, Markmap/OpenAPI, and third-party-integration policies and state
the `style-src` requirements.

### F11 — Browser compatibility has no baseline or cross-engine proof (P2) {#f11-browser-compatibility}

CI installs Chromium only, and product documentation names no minimum Chrome, Firefox, or Safari version. The implementation
uses or enhances with `:has()`, `dialog`, `inert`, `color-mix()`, `@property`, logical properties, and discrete display
transitions. Some paths have fallbacks, but there is no engine matrix.

RTL assurance is mostly source markers, small JS tests, and one element-level geometry mutation rather than a full RTL-language
site. Most forced-color assurance only checks that strings exist in SCSS rather than computed behavior.

Publish a small support matrix and run core shell/navigation/content/dialog cases on Chromium, Firefox, and WebKit. Add a real
`languageDirection: rtl` integration configuration plus forced-colors, reduced-motion, 320 px, and 200% zoom scenarios.

### F12 — Output-security and Markdown gates do not inspect every claimed surface (P2) {#f12-checker-blind-spots}

For `.md`, `check-output-security.py` scans only Markdown-link syntax; it does not feed raw HTML through the HTML scanner, so
Redoc/Asciinema scripts, `spec-url`, and raw `href` are invisible. It also ignores URLs in CSS and JSON configuration, while the
fixture runs with a broad `--third-party` allowance.

`check-rendered-markdown.mjs` is also misleadingly named: it scans generated HTML text nodes for leftover Markdown syntax; it
does not read generated `.md`. The actual Markdown golden set covers 15 pages and omits OpenAPI/Asciinema.

Separate HTML trust, machine-output purity, and rendered-text residue into clearly named gates. Give generated Markdown a very
narrow raw-HTML allowlist; parse CSS URLs, form actions, JSON URLs, and non-executable JSON scripts deliberately. Every public
shortcode should enter at least one Markdown/Print/RSS behavior case.

### F13 — Candidate integration across the two repositories is manual (P2) {#f13-cross-repo-gate}

Theme CI tests only synthetic `tests/site`; documentation-site CI tests only the public tag pinned by `go.mod`. Real EN/ZH and
Playwright validation of a theme PR depends on a maintainer's local `HUGO_MODULE_REPLACEMENTS`, and changes in the two
repositories cannot be committed atomically.

Both repositories can therefore be green while public references drift from implementation, as this review demonstrates.
The written release-state separation is correct, but automation does not enforce the same-delivery rule for implementation,
owning checker, and paired contract.

Add a read-only candidate workflow that checks out a theme PR SHA and a declared documentation-site SHA, applies a temporary
module replacement, and runs `npm test` plus the critical browser suites. Allow a Design-contract PR to identify the candidate
theme SHA too. Tag, pin, and deployment remain distinct, but the candidate pair gains one traceable joint verdict.

### F14 — Checker maintenance cost and source coupling are high (P3) {#f14-checker-maintainability}

The coverage is valuable, but 34 `check-*.py` files contain 546 `read_text()` calls. Many repeat `require`, temporary-site
creation, file writes, Hugo invocation, and error aggregation. Numerous assertions freeze template/SCSS spelling, nearby
comments, or whole-file equality instead of observable behavior.

Some helpers hard-code `theme: oink` with `--themesDir <repo-parent>`, making the checkout/worktree basename an implicit
precondition. There is no unified Python lint/type gate. This makes checkers quick to add but encourages shared blind spots.

Create a common fixture builder and assertion library; move negative cases into table-driven data. Keep source checks for true
topology invariants only and move the rest to parsed output or computed styles. Load the theme through an explicit symlink or
module replacement rather than repository basename.

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

Stable first-party capability chunks correctly removed combinatorial bundles, and large third-party runtimes are page-local.
The remaining common cost is Bootstrap/theme/Landing CSS and the complete Font Awesome distribution.

Do not prune Font Awesome by observed template usage; that would violate the authoring contract. Instead measure whether
Landing, Book, or Swagger CSS can become independently cached/surface-local, inspect fonts actually requested on first visit,
and maintain a trend report rather than an arbitrary hard threshold.

### F16 — Vendor builds are reproducible, but advisory and CI supply-chain gates remain manual (P3) {#f16-supply-chain}

Positive evidence: `VENDOR.json` pins 26 packages, 56 artifacts, 31 license files, and tree hashes; `check-vendor.py` passed;
OSV and npm audit reported no known advisory in this snapshot.

The custom manifest is not part of a common SBOM/advisory gate, and `npm audit` cannot see vendored browser packages.
Two documentation-site workflows download a Hugo `.deb` and immediately install it with `sudo dpkg -i` without a checksum.
Actions use movable major tags, and theme CI floats Python at `3.x`.

Generate CycloneDX/SPDX from `VENDOR.json`, schedule OSV scanning, pin Hugo archive/deb SHA-256, pin high-trust release actions
to commit SHAs, and choose a specific Python version or matrix.

### F17 — Design and release records have lost signal (P3) {#f17-governance-noise}

`CHANGELOG.md` has 1,768 lines; the v0.7.0 section alone is about 300 lines, and Unreleased spends about 20 lines on one checker
retry. The narratives are useful engineering history but make breaking changes, migrations, and observable behavior harder for
upgraders to find.

`book_kind` and `book_part` are acknowledged by contract and repeated in content front matter while templates explicitly do not
read them. They impose API-like authoring cost without behavior. Implemented proposals remaining active add another duplicate
answer.

Keep the changelog to observable changes, breaking/migration notes, and concise fixes; move long design stories to Blog/Research
and link them. Give behaviorless metadata a consumer/schema or demote it to site-owned fields.

### F18 — The Print `isHTML` FIXME is no longer accurate (P3) {#f18-print-ishtml}

`hugo.yaml` says to leave `isHTML` unset until Hugo fixes issue #14381. Hugo closed that issue on 2026-01-17, and the fix shipped
before OINK's 0.160.1 floor. Simply enabling `isHTML: true` still produces missing page/section/landing Print-layout warnings in
the current theme, causing a strict build to fail.

The actual dependency has shifted from “waiting for an alias fix” to “the current Print template names rely on non-HTML lookup
rules.” Do not simply delete the workaround. First complete the HTML-classified Print lookup matrix and alias/subpath tests; if
false remains intentional, update the comment to the real reason and add a test that prevents cleanup based on a closed issue.

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

This pass did not individually audit every consumer repository, production response headers/CDN caches, real Firefox/Safari,
or screen readers, and it did not manually reverse-engineer 13 MB of minified third-party source. Advisory checks are a
2026-08-26 snapshot and may change. Existing CI/contract evidence was used for DDIA/TPME EPUB/PDF consumers; no site was
republished or deployed during this review.

