---
title: OINK 1.1 release review, 2026-09-20
linkTitle: 2026-09-20 release review
description: Five reproduced runtime defects, documentation corrections, validation evidence, and the OINK 1.1 publication follow-up.
weight: 50
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK 1.1, release review, sidebar readiness, command palette, focus, keyboard navigation]
design_kind: research
design_status: review-snapshot
last_verified: 2026-09-20
---

> [!NOTE] Release preparation, not publication
> This record separates the reviewed baseline, committed fixes,
> completed validation, and remaining publication steps. A passing baseline CI run
> does not certify the later fixes. The sections through Limits preserve that
> pre-publication snapshot; later release evidence is appended under
> [Publication follow-up](#publication-follow-up).

## Scope and baseline {#scope-and-baseline}

The review starts at theme commit
[`75052f8a3106d13ef313644836a5ad545135f484`](https://github.com/pgsty/oink/commit/75052f8a3106d13ef313644836a5ad545135f484),
after the community fixes and image-copy repair. It examines the `v1.0.0..main`
change set, the behavior requested by issues
[#40](https://github.com/pgsty/oink/issues/40),
[#41](https://github.com/pgsty/oink/issues/41),
[#42](https://github.com/pgsty/oink/issues/42),
[#44](https://github.com/pgsty/oink/issues/44), and merged
[PR #43](https://github.com/pgsty/oink/pull/43), plus the bilingual documentation
and release boundary. The
[previous review](/docs/design/research/2026-09-19-upstream-review/)
records those original reports and their implementation.

Method: inspect owning JavaScript, templates and contracts; exercise transition
boundaries with focused regressions; compare failing assertions before a fix
with the repaired implementation; then run the theme checkers and the real
sibling documentation site's integration and browser suites. The review does
not add another feature program or claim a comprehensive security audit.

At this snapshot, the public release, documentation `go.mod` pin and configured
public version are still `v1.0.0`. The blog consumer's theme pin is unchanged.

## Findings and repairs {#findings-and-repairs}

Five P2 correctness defects were reproduced and repaired in theme commit
[`08f6563`](https://github.com/pgsty/oink/commit/08f656303ba4b1299db92973bc02a4c5d3ba1ca3),
pushed to main. They concern the new
APIs' ordering and existing focus/navigation behavior; they do not require a
new configuration format or a content migration.

| Finding | Trigger and observed failure | Minimal repair |
| --- | --- | --- |
| P2: sidebar readiness fires before hydration | A consumer awaits `OinkSidebar.ready` or handles `oink:sidebar-ready`. The readiness microtask can run between `DOMContentLoaded` listeners, before the cached sidebar's active path is hydrated. Consumers see incomplete initial state. | Resolve readiness in the next task, after all initialization listeners and aside placement finish; preserve the existing ready Promise and event contract. |
| P2: a pending action can enter a native choice menu | Start an asynchronous search-tail action, then activate a native choice such as theme selection. The pending guard ran after the choice branch, allowing that menu to replace the pending action's rows. | Check pending activation before any row-type branch. After completion, ordinary choice activation is available again. |
| P2: a collapsed right TOC rail remains focusable | Collapse the desktop right rail. Its hidden control and links remain keyboard targets; focus can stay inside the hidden panel. | Apply `inert` and `aria-hidden` to the rail panel, move focus to the visible restore control, and return it to the column control on restoration. Keep the movable aside outside that isolation when relocated. |
| P2: arrow navigation skips non-link groups | From a child of a divider-only group, Left/`a` cannot consistently return to the parent disclosure and fold it; the group button is absent from the tree's focus sequence. | Include group disclosure buttons in tree focus navigation and direct-parent traversal. Right/`d` opens or enters the group; previous/next page navigation still uses links only. |
| P2: drawer focus wrapping counts inert descendants | In the mobile drawer, collapse an aside group and wrap with Shift+Tab. Hidden descendants still counted as focusable can make the wrap fail or leave focus stuck. | Exclude controls under `inert` or `hidden`, and controls with hidden/collapsed visibility, from the drawer's focusable set. |

Implementation and regression ownership:

| Finding | Theme implementation | Owning regression |
| --- | --- | --- |
| Readiness | `assets/js/sidebar-state.js` | `tests/js/sidebar-state.test.js`; site `tests/browser/community-feedback.spec.mjs` snapshots the active path from both readiness signals in EN/ZH |
| Pending choice | `assets/js/command-palette.js` | `tests/js/command-palette.test.js` exercises pending extension → native choice → completion → available choice |
| Right rail | `assets/js/docs-shell.js` | Site `tests/browser/community-feedback.spec.mjs` covers EN/ZH collapse, Tab traversal, restoration, reload and aside relocation across desktop/tablet/mobile |
| Group keys | `assets/js/keyboard-nav.js` | `tests/js/keyboard-nav.test.js` covers LTR/RTL, arrows/WASD and link-only paging; site community tests exercise real EN/ZH groups |
| Drawer trap | `assets/js/docs-shell.js` | Site community tests collapse the relocated groups, wrap Shift+Tab and Tab, and assert focus never enters an inert or hidden subtree |

The readiness and pending-choice regressions failed against the previous
implementation before their fixes. The right-rail browser assertions also
failed in both English and Chinese before isolation was added. The repaired
code is kept small: timing, one earlier pending guard, explicit rail isolation,
tree focus targets and the drawer's visibility filter.

These changes preserve the already accepted behavior: both root collectors
honor `sidebar_root_menu: false`; non-link groups retain their children; pointer
focus avoids incidental article outlines while keyboard cues remain visible;
search-tail callbacks retain their cancellation and handoff contract. The image
preview fix continues to use an accessible name without inserting helper text
into copied article content. Final regression results are recorded separately
below rather than inferred from code inspection.

## Documentation readiness {#documentation-readiness}

The current documentation update covers 28 files in 14 EN/ZH pairs:

- The six Design contract pairs use `candidate-v1.1.0` and describe implemented
  main behavior without announcing a published release.
- Navigation, layout and front-matter guides match the current root filtering,
  divider groups, bilingual deployment paths, centered navbar, narrow-screen
  drawer and in-place navbar reveal behavior.
- Organization and palette guides explain runtime load order, readiness,
  feature detection and site-owned persistence/integrations. Keyboard and image
  guides explain the fixes and the older-version boundary.
- Installation guidance distinguishes the validation toolchain from the public
  version. Existing heading IDs remain stable; the new sidebar API heading has
  a matching Chinese ID.

The two 1.1.0 release-note files and two upgrade-guide files are also prepared.
The release note remains a draft/candidate. Both home-page release entries point
back to the published 1.0 version. These source edits neither update the site's
module dependency nor deploy new behavior. Historical research remains a dated
record and is not rewritten to erase its earlier release-state observations.

## Validation snapshot {#validation-snapshot}

Counts below are the 2026-09-20 snapshot for theme `08f6563`. Site acceptance
uses the sibling checkout through a command-scoped module replacement; it does
not certify an unpublished module tag or a production deployment.
Local site checks used Hugo Extended 0.166.0, Node 26.9.0 and Playwright 1.62.1;
the candidate CI used the pinned Hugo 0.165.0 toolchain. The 0.160.1 floor was
checked separately with the official binary.

| Check | Result and scope |
| --- | --- |
| Baseline `75052f8` CI | Passed all three jobs: pinned Hugo toolchain, browser runtime tests and Book publication. [Exact baseline run](https://github.com/pgsty/oink/actions/runs/35453496911). |
| JavaScript unit suite after the fixes | Passed: 44 tests. |
| Official Hugo Extended 0.160.1 | Passed the focused i18n and shell checkers; i18n covers 32 catalogs × 194 messages. The real documentation site also passed a production build with `--panicOnWarning` against the local candidate: 376 pages per language. The draft release is absent and both home-page links point to 1.0.0. This is selected compatibility-floor evidence, not a second complete CI matrix. |
| Bilingual source and style checks | Passed including this report: 129/129 page pairs, 988 source headings, Markdown style and `git diff --check`. |
| Final focused theme checkers | Passed: shell, palette, keyboard and image zoom. |
| Final real-site non-browser suite | `make check` passed all 57 tests; 200 rendered content pages, 331 linked HTML pages, 39,803 internal links and 3,863 fragment links were checked. Only the two expected Markdown goldens changed, for the release summary and documentation index. The floor production build also passed links: 327 pages, 39,059 internal links and 3,833 fragments. |
| Final browser suite | `make browser` passed all 149 Chromium tests in eight suites: 30 accessibility, 45 responsive/blog/palette, 16 keyboard, 14 content components, 18 code blocks, 4 scenarios, 5 theme-color and 17 community regressions. Includes the full multilingual sitemap, six viewport widths, light/dark, forced colors, clipboard and no-script cases. |
| Agent documentation sample | 93/100 (A) across 50 same-origin sampled pages. Sampled links resolve; 49 provide Markdown and all 270 sampled code fences close correctly. The checker warns that the HTML `llms.txt` discovery hint is missing or too deep. |
| Rendered review | Reviewed the Chinese release note in a desktop dark view and English in a narrow light view. Right-rail collapse removes its descendants from the accessibility tree and moves focus to the restore button; restoring returns focus to the visible rail button. |
| Final theme revision and its CI | `08f6563` passed all three jobs: Hugo 0.165.0, browser runtime tests and Book publication. [Exact candidate run](https://github.com/pgsty/oink/actions/runs/35477171223). |
| Public v1.1.0 tag, consumer upgrade and deployment | Not performed. |

Within this review's scope, no unresolved implementation blocker remains. The
candidate is ready for the publication steps below.

Repeat the checks from sibling checkouts, keeping the published dependency pin
intact during development:

```sh
# From the theme repository
node --test tests/js/*.test.js
python3 bin/check-shell.py
python3 bin/check-palette.py
python3 bin/check-keyboard.py
python3 bin/check-image-zoom.py

# The site Make targets apply a command-scoped sibling module replacement.
make -C ../oink.pgsty.com check
make -C ../oink.pgsty.com browser
```

## Remaining publication steps {#remaining-publication-steps}

Publication has not been executed. After the final revision passes acceptance:

1. Finalize `CHANGELOG.md`, release date and the release record; publish the
   v1.1.0 tag and GitHub Release from the verified theme revision.
2. Verify that the module proxy resolves that tag to the intended revision.
3. Update the documentation consumer pin and version configuration together
   with its home-page release entry, contract status and release-note
   `draft: false` state.
4. Rebuild and accept the documentation site using the published dependency,
   without `HUGO_MODULE_REPLACEMENTS`; deploy it and verify the public routes.

The final sign-off must identify the tested theme revision and distinguish
local source acceptance, public module availability and deployed output.

The remaining optional improvement is an earlier, consistent `llms.txt`
discovery hint for agents entering through HTML. This scorecard warning does
not invalidate the current Markdown outputs or require a new feature before
1.1. A Safari/Firefox pass and a real Zhihu paste check are useful follow-ups;
neither is claimed by this Chromium acceptance run.

## Limits {#limits}

Browser evidence is from Chromium, not a Safari/Firefox matrix. The automated
accessibility gate covers theme-owned surfaces and retains its existing
exclusions for vendored Redoc and Swagger UI. The native
clipboard regressions cover plain text and rich-text HTML, image descriptions
and authored captions; they do not certify the live Zhihu editor's paste
behavior. Neither the blog's dependency pin nor its hosted output was changed
or accepted in this review. The focused Hugo floor checks do not establish that
every publication path was exercised on that version.

This is a release-readiness review of the named source and behavior. It does
not claim unbounded security coverage, production rollout, or support for
additional requested features.

## Publication follow-up {#publication-follow-up}

After this review, the [v1.1.0 release](https://github.com/pgsty/oink/releases/tag/v1.1.0)
was published on 2026-09-20 from
[`3a18234`](https://github.com/pgsty/oink/commit/3a18234aa3af15ae12e2d53839ffd321ef4bcb62).
This revision changes only the changelog from the accepted `08f6563`
implementation. All three [release-commit CI jobs](https://github.com/pgsty/oink/actions/runs/35482327047)
passed before the annotated tag and stable GitHub Release were published.

A fresh-cache download using only the official Go module proxy resolved the
tag to that exact commit. Its `.info`, `.mod`, `.zip`, version-list entry and
signed checksum record were verified. The module checksum is
`h1:121L5g57ChRCPyidzEBBcln2Co+0zYRQ+XDDXjymd0Q=`; the `go.mod` checksum is
`h1:pHvbUhJCfseB41n5RGwsF7abT3i32VSTpofLQoq4b7Y=`.
The public records are the [proxy version](https://proxy.golang.org/github.com/pgsty/oink/@v/v1.1.0.info)
and [checksum entry](https://sum.golang.org/lookup/github.com/pgsty/oink@v1.1.0).

The documentation publication update pins `v1.1.0` in `go.mod` and `go.sum`,
aligns the advertised version and both home-page release entries, publishes
both release notes, and promotes the six contract pairs to `released-v1.1.0`.
The historical acceptance tables above continue to describe the earlier
sibling-checkout run. Published-dependency validation is tracked separately by
the site's [Site checks](https://github.com/pgsty/oink.pgsty.com/actions/workflows/site-checks.yml)
and [Browser quality](https://github.com/pgsty/oink.pgsty.com/actions/workflows/browser-quality.yml)
workflows, with both Go and Hugo module workspaces disabled.

Local validation of this published module passed all 57 non-browser tests,
26 focused Palette/community browser tests, and the strict production build
(378 pages per language). The checks ran with `GOWORK=off`,
`HUGO_MODULE_WORKSPACE=off`, and no `HUGO_MODULE_REPLACEMENTS`. The complete
149-test browser suite is also run by the publication commit's Browser quality
workflow; its result is separate from the earlier local candidate run.
