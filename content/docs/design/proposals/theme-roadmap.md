---
title: "Theme roadmap: the Sass exit and the next product stage"
linkTitle: Theme roadmap
description: A draft roadmap that puts leaving Hugo's removed LibSass first, then closes small reader gaps, version lifecycle, and a static API reference.
weight: 25
icon: fa-solid fa-route
search_keywords: [roadmap, LibSass, Dart Sass, css.Build, Hugo 0.170, versioning, OpenAPI, agent output]
design_kind: proposal
design_status: draft
proposal_date: 2026-11-21
---

> [!WARNING] Draft roadmap; only R0 is implemented
> This page proposes an order of work and records the evidence behind it. R0 is implemented on the theme's main branch and unreleased: the stylesheet is plain CSS that Hugo assembles, with no compiler and nothing generated in Git; see [R0](#sass-design). Beyond that, the page defines no configuration key, output, or component. Every name below is provisional until its stage is accepted and moved to the owning contract.

| Record | Value |
| --- | --- |
| Status | Draft. The owner decided R0's compiled-CSS delivery on 2026-11-22. The source then became plain CSS, verified on 2026-11-23, which removed the compiler. R0 is implemented and unreleased. No other stage is accepted |
| Owner | OINK maintainers |
| Date | 2026-11-21 |
| Scope | OINK theme and documentation site; the CLI only where a stage names it |
| Affected contracts | Architecture (toolchain, styles, outputs), Components, Shell, and customization guides |
| Source snapshot | Theme HEAD `49b5648` plus uncommitted work, documentation HEAD `3472785`, local Hugo Extended 0.169.0 |

## Recommendation {#recommendation}

Make the next theme release about one thing: **leaving LibSass without asking consumers to install Dart Sass**. Hugo v0.170.0 removed LibSass and the extended edition. When this roadmap was drafted, OINK was pinned to 0.169.0, the last release that can build published v1.5.1, and its contract forbade the only upstream replacement. [R0](#sass-exit) settles this on the theme's main branch: the stylesheet is plain CSS, nothing compiles it, and no Hugo release is pinned. Until a release carries that work, published OINK cannot adopt any later Hugo release.

After that, add no new component family. Close what is half-built: first the small reader and author gaps that other frameworks treat as baseline, then version lifecycle, then a static API reference. Keep one content-model project active at a time, as the [CLI roadmap](/docs/design/proposals/oink-cli-roadmap/#roadmap) already requires.

| Stage | Subject | Why in this position |
| --- | --- | --- |
| R0 | Sass exit and the Hugo 0.170 baseline | Forced by upstream. It blocks every later upgrade |
| R1 | Small reader and author gaps | Low cost and frequent use. No new authority |
| R2 | Version lifecycle | Already the default next content capability. Upstream changed its premise |
| R3 | Static OpenAPI reference | API content is absent from search and agent outputs |
| Continuing | Agent output and engineering quality | Finishes existing work. Adds no service |

## Context and evidence {#evidence}

### Hugo 0.170 removes LibSass {#hugo-0170}

[Hugo v0.170.0](https://github.com/gohugoio/hugo/releases/tag/v0.170.0), published on 2026-11-13, states that the extended edition is gone and that Dart Sass is the only transpiler. Setting `transpiler` to `libsass` returns an error. `hugo.IsExtended` always returns `false`, and `module.hugoVersion.extended` is deprecated and does nothing. Sass users must install Dart Sass separately.

Published v1.5.1 compiles two stylesheets through `toCSS` with the built-in compiler: `scss/main.scss` in `head-css.html` and `scss/redoc.scss` in `scripts.html`. The [toolchain contract](/docs/design/architecture/#hugo-toolchain) says that ordinary consumers must not install Dart Sass or another Sass executable, and that later changes must preserve that boundary. For v1.5.1, both statements cannot hold on Hugo 0.170.

According to the survey below, Docsy 0.17.0 and Doks 2.0 chose to require Dart Sass. This review did not build OINK on Hugo 0.170.

### What the theme styles depend on {#style-dependencies}

Measured on the theme checkout on 2026-11-21:

| Fact | Value |
| --- | --- |
| Theme-owned SCSS | About 16,600 lines under `assets/scss/` |
| Distinct `--td-*` custom properties | 185 |
| Sass variable references | 147, to 55 variables |
| Mixin calls | 50, of which 39 are Bootstrap `media-breakpoint-*` |
| `@extend` rules | 15 |
| Bootstrap | 5.3.8. The full SCSS is imported, and `bootstrap.bundle.js` is loaded for dropdowns |

At that date the theme already expressed most of its design through custom properties. Its remaining Sass use was narrow, but Bootstrap's palette was still computed by Sass at compile time.

Two local trials set the boundary of the options below:

- Dart Sass 1.105.2 did not compile the SCSS source of that date. It stopped at the nested `@import 'chroma/dark'` in `_chroma.scss` and reported that every `@import` rule is deprecated and will be removed in Dart Sass 3.0.0. Changing the transpiler would therefore also have required source changes.
- On Hugo 0.169.0, with neither Node nor Sass on `PATH`, [`css.Build`](https://gohugo.io/functions/css/build/) bundled `@import`, expanded `hugo:vars` into `:root` custom properties, lowered native nesting for the given browser targets, and preserved `@layer`. Hugo alone can therefore bundle plain CSS.

### How consumers use the SCSS hooks {#consumer-hooks}

`bin/update-consumers.py` inventories 51 primary checkouts, 45 of them on v1.5.1. Their hook files were measured on 2026-11-21:

| Measure | Checkouts |
| --- | --- |
| Carry a non-empty `_styles_project.scss` | 46 of 51 |
| Use no mixin, `@extend`, control rule, or Sass variable in it | 38 of 46 |
| Use `//` comments | 44 of 46 |
| Use nested rules | 40 of 46 |
| Use `&-suffix` selector concatenation | 16 of 46 |
| Call a mixin | 6 of 46 |
| Set Sass variables in a variables hook | 18 of 51 |

The style hooks total about 26,000 lines; the largest has 1,893. None calls a Sass color function. The variables hooks mostly set `$primary`, `$secondary`, the four status colors, `$line-height-base`, and font families.

Most hook content is plain CSS written with Sass comments and nesting. It is still not valid CSS: `//` comments and `&-suffix` concatenation need a mechanical conversion. Eight files need real Sass semantics. Any Sass exit that ignores these hooks breaks nearly every consumer.

A later check found a second dependency. pgsty.com, pigsty.cc and pigsty.io compiled seven SCSS entries in their own templates that imported the theme's partials directly.

### What other frameworks ship {#framework-survey}

| Capability | Seen in | OINK today |
| --- | --- | --- |
| Per-page Markdown, `llms.txt`, full-text bundles, page actions | Mintlify, Fumadocs, Rspress, Docsy 0.15 (experimental) | Shipped, with `NAVJSON` and an agent-docs scorecard in CI |
| Nested or per-section `llms.txt` for large sites | Mintlify, Fern | One index per language; full text per top-level section |
| Blocks shown only to people or only to agents | Mintlify, GitBook | None |
| Copyable prompt block | Mintlify, GitBook | None |
| Page status badge in navigation | Material for MkDocs, Starlight | None |
| Inserted, deleted, and focused lines in code | Expressive Code, Fumadocs, VitePress | None; fences have title, copy, wrap, collapse, and line options |
| Glossary with hover definitions | Material for MkDocs, Mintlify | None |
| Dismissible site announcement | Material for MkDocs, Hextra, Fumadocs | None |
| Related pages | Mintlify | Backlinks only |
| Visible fallback for a missing translation | Starlight | The language switch targets the language home page |
| Version switch that stays on the equivalent page; outdated banner | Mintlify, Docusaurus | Docsy-style version menu and archived-version banner |
| One searchable page per API operation | Mintlify, Fumadocs, Scalar | Swagger UI or ReDoc embed; other outputs link to the specification |
| Output with no inline script | Relearn 9 | Inline startup scripts; the [deployment guide](/docs/admin/deploy/) explains hashes and nonces |

The Hugo statements above were read from the release page and function reference, and the two trials were run locally. The other rows come from a survey of each project's own documentation and changelog on 2026-11-21. They were read through a summarizing tool and not checked row by row, so confirm a row again before a stage depends on it.

Hugo itself added relevant capabilities since v0.153.0: a site matrix of languages, versions, and roles, with `sites.complements` to lend existing pages to another site without writing new output. Content adapters can generate pages from local data. R1 to R3 below must evaluate these before freezing a format.

### What already works {#existing-strengths}

OINK has 29 shortcodes, 22 Landing sections, Book publication, Duo View, visual presets, static backlinks, and local search with mixed CJK and Latin terms. Its static agent outputs are more complete than most open-source frameworks in the survey. Community issues mostly ask for correctness and reading comfort, not for more component families. This is why R1 closes gaps and adds no new family.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- build OINK with a current Hugo release and no other executable;
- give every existing consumer a tested migration path for its style hooks;
- close baseline reader and author gaps with static, semantic output;
- complete version lifecycle and API reference so their content reaches search, Print, Markdown, and agent outputs;
- keep every theme-owned network feature off by default.

Non-goals:

- requiring Dart Sass, Node, or the OINK CLI for an ordinary build;
- a hosted assistant, MCP server, analytics backend, or signed-in content;
- a visual editor or a new reading shell;
- type-aware code hover, page narration, or an API testing platform;
- interactive graph views (G2/G3) before the stages above ship.

## R0: the Sass exit {#sass-exit}

### Options {#sass-options}

| Option | What a consumer needs | Assessment |
| --- | --- | --- |
| A. Require Dart Sass | A second executable on every machine, CI job, and container | Rejected by the current dependency contract |
| B. Stay on Hugo 0.169.0 | Nothing | Not durable. No later upstream fix can be adopted |
| C. Publish compiled CSS; customize with custom properties and plain CSS | Hugo only | Chosen on 2026-11-22 and delivered first |
| D. Rewrite the theme source as plain CSS before anything else | Hugo only | Same consumer result as C. Doing it first would have delayed the upgrade, so it followed C as the next step and removed the maintainer-side compiler |

### Decision and delivered design {#sass-design}

On 2026-11-22 the owner chose option C: ship compiled CSS, retire the SCSS
hooks, and adjust the sites that compiled theme SCSS themselves. That first
delivery kept SCSS as the source and committed the compiled bundles, so a
maintainer still needed LibSass. The source was then converted to plain CSS,
which is option D taken as the next step, and the compiler was removed. Both
steps are implemented on the theme's main branch and are not released. The
contract is [Plain CSS stylesheet delivery](/docs/design/architecture/#stylesheet-delivery).

| Item | State |
| --- | --- |
| Stylesheet source | Done. Plain CSS layer files under `assets/css/td/`, listed in cascade order by `layouts/_partials/css/layers.html`. `assets/scss/`, the vendored SCSS, the compiled bundles under `assets/oink/` and `bin/build-css.py` are deleted. Nothing generated is kept in Git |
| Consumer build | Done. `css/bundle.html` concatenates the layers with `resources.Concat`; templates call no compiler and there is no build step. The stylesheet is not passed through `css.Build`: it needs no bundling, and `css.Build` would have to treat every font URL as external |
| Site layer | Done. `assets/css/project.css` and `assets/css/project/*.css`, plain CSS, published as one stylesheet after the theme's. Hugo minifies it and does not transform it |
| Sass variables | Done differently from the draft. No token derivation was added. A site restates the values its variables produced as plain overrides in `project.css`. In the theme, values that were Sass variables are written out in the layers |
| Site-owned shells | Added. A layout asks `css/bundle.html` for `chrome`, `landing`, `search` or `compare` by name. These replace the SCSS partials that pgsty.com, pigsty.cc and pigsty.io compiled in their own templates |
| Compiler | Closed. There is no compiler, for a site or for a maintainer, so the question of replacing LibSass with Dart Sass no longer arises |
| Hugo 0.170 baseline | Site builds verified on Hugo 0.170.1 on 2026-11-22 with only the Hugo binary, and again on 2026-11-23 after the conversion. No Hugo release is pinned: checks use the installed one, CI installs the current one, and any edition works. `theme.toml` and `hugo.yaml` still declare 0.169.0 as the minimum |
| Owning checker | `bin/check-stylesheets.py` replaces `bin/check-scss.py` |
| Bootstrap reduction | Script done, styles open. The theme no longer loads Bootstrap's JavaScript; see the 2026-11-23 entry below. Reducing the styles is not part of this delivery. Each Bootstrap component is now its own layer file under `assets/css/td/bootstrap/` |

Neither step changed how pages look. After the first delivery, for a site
without style hooks, the production stylesheet equaled the previous one except
for whitespace inside one `@starting-style` block. The conversion to plain CSS
changed no rule: on 2026-11-23, with Hugo 0.170.1, the production `main`
stylesheet was byte-identical (556,437 bytes) to the last one compiled from
Sass, and the regression fixture's 683 output files were identical apart from
the stylesheet path. The four smaller stylesheets now reuse `main`'s layers, so
they gained selectors, but no rule or declaration changed.

### Compatibility and migration {#sass-migration}

The three SCSS hooks were public surface, so retiring them is a breaking
change. Whether that makes the release a major version is still open.

- Hooks are converted by hand; the [upgrade guide](/docs/admin/upgrade/#sass-hooks) lists the steps. A site's rules now load after the theme, so they beat later theme rules of equal specificity, most visibly the visual presets. A converted site is therefore compared page by page.
- A one-time converter was written during this delivery and then removed, together with the Sass override layer it compiled through, so the theme keeps no legacy Sass path. Before its removal, on 2026-11-22, a dry run over the 46 inventoried hook files reported no failed check, and each of the 51 inventoried checkouts was copied, converted where it still had hooks, and built against the new theme on Hugo 0.170.1 with only the Hugo binary: 50 built, 55,020 pages in all, with no stylesheet warning. The remaining one, pgsty.com, timed out fetching its own remote report manifest in that harness and built completely in a separate run.
- pgsty.com, pigsty.cc and pigsty.io were adjusted by hand. After the first delivery, on 2026-11-22, their rebuilt stylesheets reproduced every declaration of the old compiled ones, and four of the seven were byte-identical after minification. They now ask for the smaller stylesheets by name.
- Classic `themes/oink` consumers and vendored copies follow the same path and are reviewed separately, as the release process already requires.
- The theme no longer contains SCSS that a site could compile for itself. A site that wants to change Bootstrap overrides the corresponding custom properties and rules in its project stylesheet. The theme does not invoke a compiler and keeps no legacy Sass path.

The remaining consumers convert when they adopt the release. Until then a site
that still carries hooks builds with a warning and the theme's default styles.

## R1: small reader and author gaps {#small-gaps}

Each item is independent, opt-in where it adds markup, static in HTML, expanded in Print, and plain text in Markdown and agent outputs. Names are provisional.

| Item | Proposed behavior | Main constraint |
| --- | --- | --- |
| Page status | A front matter value such as `new`, `beta`, or `deprecated` marks the sidebar row and article header | Closed vocabulary, 32 locales. `NAVJSON` v1 is a closed schema and stays unchanged |
| Line markers in fences | Fence attributes mark inserted, deleted, and focused lines | Attributes, not in-source comments, so Copy still returns authored source |
| Glossary | One data file per language defines terms; an explicit reference renders a definition on hover and focus, and a glossary page is generated | No automatic scan of page text in the first stage |
| Announcement | One site-level notice, dismissible, shown again when its text changes | Visible without JavaScript; absent from Print, Markdown, and feeds |
| Related pages | A page-end group from Hugo's related-content index, or an explicit front matter list | Sits beside backlinks without a second navigation authority |
| Missing-translation fallback | A language may show the source-language page with a visible notice | Never silent. The page declares its real language and canonical URL |
| Not-found suggestions | The 404 page suggests near matches from the local search index | Only when local search is enabled. No network |
| Sortable tables | An author marker adds column sorting to the table reader | Not a default; authored order stays in other outputs |

Related pages cover most of what a local graph view would add. G2 and G3 in the [knowledge-graph proposal](/docs/design/proposals/knowledge-graph/#delivery-stages) therefore stay deferred.

## R2: version lifecycle {#version-lifecycle}

The [CLI roadmap](/docs/design/proposals/oink-cli-roadmap/#version-lifecycle) keeps the detailed draft. This roadmap adds one requirement: before the manifest format is frozen, evaluate Hugo's native version dimension against independent per-version builds.

The evaluation must answer:

1. Can a version dimension coexist with the existing `params.versions` menu and external archives?
2. What do build time and output size cost for several versions in two or more languages?
3. Does the native dimension give page correspondence without a separate logical key?
4. How are canonical URLs, search indexes, and agent bundles scoped to one version?
5. Which new schema version carries version identity, given that `NAVJSON` v1 is closed?

Reader-side targets are unchanged from the CLI roadmap and gain two from the survey: switching version stays on the equivalent page, and an outdated or unreleased version says so on every page.

## R3: static OpenAPI reference {#openapi}

Swagger UI and ReDoc render only in HTML. Print, Markdown, and feeds receive a link to the specification, and operations never reach local search or agent bundles. The accessibility suite excludes both embeds.

The [CLI roadmap](/docs/design/proposals/oink-cli-roadmap/#openapi) proposes a generator that writes Markdown. Before choosing, compare it with a Hugo content adapter that generates one page per operation from a local specification at build time. An adapter needs no CLI and no generated source in Git, but must resolve references and cycles in templates. Choose with a real specification, not a toy one.

Either way, the result is ordinary pages in the existing output pipeline. Interactive requests stay out of the first increment. If added later, credentials live only in session storage and no proxy is used.

## Continuing work {#continuing-work}

### Agent output {#agent-output}

| Item | Proposed behavior |
| --- | --- |
| Sectioned `llms.txt` | A large site splits its index by section so each file stays within the size check |
| Audience markers | A block attribute keeps content in HTML only or in Markdown and agent outputs only, decided at build time |
| Prompt block | A fence renders a copyable prompt and reuses existing page actions |
| Discovery files | An opt-in experiment publishes a site-authored skill file and its well-known index. The conventions are still changing |
| Content negotiation | Documented server recipes for `Accept: text/markdown`. Static hosting cannot do this, so it is a guide and not a theme feature |

A hosted MCP server and a built-in assistant stay out of scope. The existing [search-tail extension](/docs/design/shell/#search-tail-extensions) lets a site connect its own.

### Engineering quality {#engineering-quality}

- **Strict CSP.** Move stable inline initializers to same-origin files with data configuration, and publish a hash manifest for what must stay inline. This closes [F10](/docs/design/research/2026-08-26-comprehensive-review/#f10-csp).
- **Engine matrix.** Run the core shell, navigation, content, and dialog suites on Firefox and WebKit, and publish a support matrix. This closes [F11](/docs/design/research/2026-08-26-comprehensive-review/#f11-browser-compatibility).
- **Navigation feel.** Run the Speculation Rules experiment the [performance rules](/docs/design/architecture/#outputs-and-runtime) already describe on one named production consumer, together with cross-document view transitions as a CSS-only enhancement.
- **Freshness.** Optional review date, owner, and expiry in front matter, shown in the page annotation and reported by the CLI. A modification date is never presented as verification.
- **Social cards.** Build-time images need a site-supplied font for CJK titles, so this comes last.

## Sequencing {#sequencing}

| Order | Delivery | Exit evidence |
| --- | --- | --- |
| 1 | R0 compiled CSS delivery, since superseded by the plain CSS source in row 3 | Done on Hugo 0.169.0 and 0.170.1 with no Sass executable on `PATH`: theme checkers, the documentation site's checks and browser suite, and a file-by-file comparison of the regression fixture |
| 2 | R0 migration tool, run dry on the 51 inventoried checkouts | Done, then removed: every hook file converted, with no failed declaration check and one site to review. The tool was deleted with the Sass override layer it needed; hooks are now converted by hand |
| 3 | R0 plain CSS source, implemented and unreleased | Done on 2026-11-23 with Hugo 0.170.1: the production `main` stylesheet is byte-identical to the last one compiled from Sass, and the regression fixture is identical apart from the stylesheet path. No compiler and no generated file remain |
| 4 | The release that retires the hooks, with consumer adoption | Published pin verified; consumers build with Hugo alone |
| 5 | R1 items, each on its own | Owning checker, goldens for every output, bilingual contract |
| 6 | R2 evaluation, then one accepted design | Two real repositories use it before compatibility promises |
| 7 | R3 comparison, then one accepted design | A real specification is fully accounted for |

Agent-output and quality items fit between stages when they do not compete with the active one. Bootstrap reduction was cut from R0. Its script has since been removed; reducing its styles stays open.

## Implementation and owning checkers {#implementation}

| Stage | Theme owner | Site and CLI |
| --- | --- | --- |
| R0 | `check-stylesheets.py` owns the layers and their assembly; `check-presets.py` and `check-font-tokens.py` | Browser, appearance, and visual review in EN/ZH |
| R1 | `check-shell.py`, `check-components.py`, `check-code-blocks.py`, `check-goldens.py`, `check-i18n.py`, `check-params.py` | Content, keyboard, and accessibility suites; guides in both languages |
| R2 | `check-shell.py`, `check-navigation-contract.py`, `check-agent-indexes.py`; a new navigation schema version | CLI inspection and correspondence checks |
| R3 | `check-output.py`, `check-components.py`, `check-search.py` | Real-specification fixture; accessibility with no embed exclusion |

Each stage moves its accepted behavior to the owning contract in both languages and then leaves this page.

## Acceptance criteria {#acceptance-criteria}

- R0: an unmodified consumer renders the same pages on Hugo 0.170.1 or later with only Hugo installed; the stylesheet checker fails when the layer lists and the layer files disagree or a layout calls a compiler; the upgrade guide tells a site how to convert its hooks.
- R1: each item has HTML, Print, Markdown, and RSS behavior covered by goldens, strings in all 32 locales, and keyboard, forced-colors, RTL, and narrow-screen review.
- R2 and R3: a named real consumer, a bilingual contract accepted before any compatibility promise, and no second navigation or Markdown authority.
- Every stage: ordinary `hugo server` stays usable with invalid input, and a normal build downloads nothing.

## Open decisions {#open-decisions}

1. Does the Sass exit justify a major version, or can 1.x carry a transition release?
2. Closed: the theme source is plain CSS, verified on 2026-11-23. There is no maintainer build, so no Dart Sass release has to be chosen and its 11 selector changes do not arise.
3. Resolved on 2026-11-22: no legacy path for sites that install Dart Sass themselves.
4. Resolved for now: brand and semantic colors are custom properties in site CSS. A configuration key remains possible later.
5. Is the page-status vocabulary closed?
6. Is glossary linking ever automatic?
7. Do line markers drop out of Markdown output or become a diff fence?
8. Does version lifecycle use Hugo's native dimension or independent builds?
9. Is the API reference generated by a content adapter or by the CLI?
10. Which production consumer measures Speculation Rules?

## Decision log and sources {#decision-log}

- 2026-11-21: Drafted from a review of the theme, its active proposals and community issues, a survey of other frameworks, and local trials of Dart Sass and `css.Build`.
- 2026-11-22: The owner decided on compiled CSS delivery, retirement of the SCSS hooks, and hand adjustment of the three sites that compiled theme SCSS. Implemented on the theme's main branch with the documentation site and those three sites; not committed, tagged, or deployed. The R0 design section now records what was built, which differs from the draft in three places: no `css.Build`, no token derivation, and bundles for site-owned shells.
- 2026-11-22: Verified on Hugo 0.170.1 after upgrading the local Hugo. With only the Hugo binary on `PATH`, the theme checkers pass, the regression fixture's 686 output files match the previous pipeline apart from the main stylesheet, the documentation site passes its checks and 546 browser tests, and 50 of 51 consumer checkouts build after conversion. Published v1.5.1 fails on that Hugo because it needs Dart Sass. At that point the maintainer-side compiler was still the LibSass in Hugo Extended 0.169.0.
- 2026-11-23: The stylesheet source is plain CSS, assembled by Hugo from the layer files under `assets/css/td/`. `assets/scss/`, the vendored SCSS of Bootstrap, Font Awesome, Inter and IBM Plex Sans, the compiled bundles under `assets/oink/`, `bin/build-css.py` and the CI job that recompiled the bundles are deleted. `bin/check-stylesheets.py` replaces `bin/check-scss.py`, and stylesheets are published under `/css/` instead of `/scss/`. Verified with Hugo 0.170.1: the production `main` stylesheet is byte-identical (556,437 bytes) to the last one compiled from Sass, and the regression fixture's 683 output files are identical apart from the stylesheet path. The maintainer-compiler question is closed because there is no compiler. No Hugo release is pinned. On the theme's main branch; no tag contains it.
- 2026-11-23: The theme no longer loads or vendors Bootstrap's JavaScript, and Popper went with it. Only two controls used the script: the version menu of the bottom bar and the phone drawer, and the Landing `download` channels. The first is now the hover popover the navbar version menu already was, placed by CSS; the second switches in the Landing runtime. Both keep their markup classes and look. The core script every page loads, `js/core.js`, went from 92,443 to 8,740 bytes minified. A site that uses a Bootstrap script component in its own markup must load the script itself; none of the 48 inventoried module consumers does. On the theme's main branch working tree; no tag contains it.

Sources read on 2026-11-21:

- [Hugo v0.170.0 release notes](https://github.com/gohugoio/hugo/releases/tag/v0.170.0)
- [Hugo `css.Build`](https://gohugo.io/functions/css/build/)
- [Hugo glossary](https://gohugo.io/quick-reference/glossary/) and the forum thread on [filling in missing translations](https://discourse.gohugo.io/t/using-the-multidimensional-content-model-to-fill-in-missing-translations/56741)
- [Docsy changelog](https://www.docsy.dev/project/about/changelog/)
- [Mintlify documentation](https://mintlify.com/docs/ai/llmstxt)
- [Starlight plugins](https://starlight.astro.build/resources/plugins/) and [Expressive Code](https://expressive-code.com/key-features/text-markers/)
- [Fumadocs](https://www.fumadocs.dev/docs/integrations/llms)
- [Material for MkDocs reference](https://squidfunk.github.io/mkdocs-material/reference/)
- [Relearn release notes](https://mcshelby.github.io/hugo-theme-relearn/introduction/releasenotes/index.html)
