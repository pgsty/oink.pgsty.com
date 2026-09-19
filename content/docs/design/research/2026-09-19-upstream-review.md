---
title: Community issue and PR review, 2026-09-19
linkTitle: 2026-09-19 community review
description: Evidence, acceptance advice, and focused remedies for community issues 40, 41, 42, 44 and pull request 43.
weight: 40
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK review, sidebar, focus, root menu, search tail, community issues]
design_kind: research
design_status: review-snapshot
last_verified: 2026-09-19
---

> [!NOTE] Original review snapshot
> This research records source inspection, live GitHub status, local builds, and
> targeted browser observations on 2026-09-19. At the initial review checkpoint,
> the recommendations were not yet accepted contracts or implemented features,
> and no PR had been merged, release published, or contributor reply posted.
> The implementation follow-up at the end records the subsequent changes.

The initial review is preserved below. The maintainer subsequently authorized
merging PR #43 and implementing the remaining items directly on main; see the
[same-day implementation and acceptance follow-up](#implementation-acceptance).

## Verdict {#verdict}

The reports identify useful problems, but they are not all defects of the same
kind. Fix hidden navigation focus first. Accept the direction of PR #43 as a
small correctness fix, after clarifying its boundary and adding coverage. Treat
search-tail registration and public sidebar state as additive APIs with their
own acceptance work.

| Item | Finding | Recommendation |
| --- | --- | --- |
| [PR #43](https://github.com/pgsty/oink/pull/43), MagicFollower | Self-root collection ignores an explicit `sidebar_root_menu: false`. Reproduced. | Conditional acceptance: the patch is correct for the global candidate list; document the current-root exception, add regression tests, and obtain successful CI. |
| [#41](https://github.com/pgsty/oink/issues/41), imbajin | Hidden whole-sidebar content remains focusable; disclosure state has several writers and no public API. | Split a correctness repair from an optional API. The former has higher priority. |
| [#44](https://github.com/pgsty/oink/issues/44), lloydsun | Pointer focus followed by a key produces the reported outlines. Reproduced on another platform. | Improve the main-content focus treatment; retain useful keyboard cues for scrollable content. The browser heuristic itself is expected. |
| [#42](https://github.com/pgsty/oink/issues/42), aucru | Existing hiding and divider options do not provide a complete non-link section group with its children. | Explain the options separately, obtain the author's exact minimal example, and implement the missing group behavior if confirmed. |
| [#40](https://github.com/pgsty/oink/issues/40), imbajin | There is no supported way to append a query-dependent action to local search. | A reasonable small extension proposal, not a failure of existing local search. Lower priority than correctness repairs. |

## Baseline and method {#baseline-and-method}

GitHub API reads found four open external issues and one open external PR. The
other open issue, [#37](https://github.com/pgsty/oink/issues/37), is the
maintainer's release tracker. The reviewed external items had no discussion
comments or submitted PR reviews at the snapshot time.

| Input | Verified snapshot |
| --- | --- |
| Remote theme `main` | `93ac292014a3cd81f7c41caec4df98ed9d2dc45a` |
| Local theme | `75ddc95`; its only difference from remote `main` is release text in `CHANGELOG.md` |
| PR #43 head | `8eeb8ecaf525097cc56572fe22234db381bfc16a`, one changed template line |
| Local documentation | `ff0ba39`; `go.mod` still requires OINK `v1.0.0` |
| Published release | GitHub's latest release is `v1.0.0`; no remote `v1.1.0` tag was returned |
| Build tools | Hugo Extended 0.166.0, Node 26.9.0, npm 11.19.1 |
| Browser observation | macOS, Chromium 153.0.0.0, light theme, real sibling documentation site using a command-scoped module replacement |

The Design section's `released-v1.1.0` labels and the local release-preparation
commits do not establish that version's publication. A source change, tag,
consumer pin, and hosted deployment remain separate facts. The public consumer
was not upgraded as part of this review.

The method combined the complete issue/PR bodies and comments, the exact diff,
the bilingual Design contracts, owning templates and JavaScript, a temporary
bilingual site under a `/sub/` base path, and targeted browser interactions on
the documentation site. No theme implementation was changed in the shared
checkout.

## PR 43: accept the small fix with a precise boundary {#pr-43}

The first pass in
[root-menu-roots.html](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/root-menu-roots.html#L7-L26)
filters top-level sections by `sidebar_root_menu`. The second pass collects
sections whose `sidebar_root_for` is `self`, but omits that filter. A section
excluded by the first pass can therefore re-enter through the second pass.

The PR adds the same explicit-false predicate to the second pass:

```go-html-template
{{- if and .IsSection (ne .Params.sidebar_root_menu false) -}}
```

This preserves the existing default for an absent or true value, retains the
section constraint and URL deduplication, and does not change navigation-tree
or pager ordering. It also preserves language-specific caching. There is no
reason to replace this with a broad navigation refactor.

However,
[root-menu-entries.html](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/root-menu-entries.html#L1-L12)
subsequently appends the current resolved root when absent. That behavior
already exists and is described in the navigation guide. It is not a new PR
regression, but it prevents the broad claim that false now hides the root on
every page.

The local probe used a top-level Blog root and a nested Docs root, both with
`sidebar_root_for: self` and `sidebar_root_menu: false`, plus a visible Docs
root and a self-root with no visibility override. Results were identical for
English and Chinese, retaining the `/sub/` language-aware URLs:

| Viewed page | Before the PR | With the PR |
| --- | --- | --- |
| An unrelated Docs page | Both hidden self-roots appear | Both disappear |
| A page inside the hidden Blog root | Blog appears | Blog still appears through current-root fallback |
| A page inside the hidden nested root | Nested root appears | Nested root still appears through current-root fallback |
| A visible self-root | Appears | Still appears; no duplicate |

Recommended contract: false removes a root from the site-wide selectable
candidate set, while the current root may remain available for orientation.
Keeping that existing exception is the smallest compatible interpretation.
State it explicitly in both languages. If the intended contract instead means
absolute exclusion, the current-root fallback and switcher trigger need a
separate, coordinated change; adding one more predicate without checking zero
and one-entry states is insufficient.

Before merging:

1. Add an output-based case to `bin/check-shell.py` for hidden top-level and
   nested self-roots, absent/true values, deduplication, and current-root
   behavior. Cover one-entry degradation and EN/ZH subpaths.
2. Update the Shell contract and navigation guide together. Correct the PR
   description's YAML comment from `//` to `#` so its example is pasteable.
3. Resolve the workflow's
   [action_required result](https://github.com/pgsty/oink/actions/runs/34597562431)
   and run the required checks on the final head. At this snapshot there are
   no successful check runs or commit statuses for the PR head. The API reports
   `MERGEABLE` and `UNSTABLE`; neither is evidence that tests passed.

The maintainer can add these small finishing changes while preserving the
contribution. Do not make acceptance depend on implementing #40 or all of #41.

## Issue 41: repair isolation, then expose state {#issue-41}

There are two separate findings.

First, whole-sidebar hiding uses transforms and, on desktop, opacity. The
drawer and collapse controllers do not remove hidden controls from keyboard
navigation. In the browser probe, clicking Collapse sidebar left focus on the
now-transparent collapse button; pressing Tab moved focus to the hidden root
switcher. The panel had opacity zero and no effective `inert` or
`aria-hidden` ancestor. This is a reproducible usability defect, not merely a
missing integration hook. The mobile closed-panel implementation uses the same
kind of off-screen positioning without explicit isolation.

Second, disclosure writes are duplicated across
[the click controller and responsive relocation](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/docs-shell.js#L374-L487)
and
[cached active-path hydration](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/sidebar-nav.js#L43-L62).
There is no public setter, getter, or committed-state event. Existing storage
for overall collapse, width, and scroll position does not persist each branch's
disclosure state across navigation. The authoring guide's statement that reader
expansion state is stored locally needs this distinction.

Recommended repair:

1. Centralize whole-sidebar isolation at initialization and every open,
   close, collapse, hover-overlay, restore, and breakpoint transition.
   Remove isolation before moving focus inside; restore focus to a visible
   external control before making the content inert.
2. Isolate the content, preserving the external restore button and the
   deliberate desktop edge hover target. Applying `inert` to that pointer
   sensor would break the existing hover interaction. `aria-hidden` alone
   does not prevent keyboard focus; the
   [HTML inert contract](https://html.spec.whatwg.org/multipage/interaction.html#inert)
   addresses interaction as well as accessibility exposure.
3. Separately route disclosure changes through one commit function, updating
   `aria-expanded`, the open class, and localized label before emitting one
   event. Repeated writes of the current value should be no-ops.
4. Expose a small setter/getter and event only after specifying stable IDs,
   invalid-ID behavior, initialization readiness, and restoration order.
   Keep version/locale storage policy downstream-owned and let the active
   path win after restoration.

The proposal needs one scope correction: the responsive TOC/backlink/taxonomy
groups can move out of the sidebar into the right rail. A controller that only
looks up descendants of the current sidebar cannot also own those wide-layout
writes. Register OINK-owned targets independently of their current DOM parent,
and keep the public sidebar API restricted to its intended registered subset.

Acceptance must check real Tab order and the accessibility tree in hidden
states, restored desktop collapse on first load, hover entry/exit, focus return,
Escape, backdrop close, scroll unlock, and the 768/1200 breakpoints. Preserve
the visible no-JavaScript fallback from #24. Static axe scans and assertions
that a drawer can open do not establish these state-transition properties.

## Issue 44: real symptom, partly expected behavior {#issue-44}

On the documentation configuration page, clicking the article heading, a table
header cell, or a code block focused `main#td-main-content`,
`div.td-table-scroll`, or `pre.chroma`, respectively. In each case,
`:focus-visible` was false after the click and true after pressing the unbound
letter `z`. The main/code outline changed from none to the browser's auto
outline; the table used the theme's solid outline. This reproduces the
mechanism without the reporter's Linux compositor or Super key.

The
[Selectors specification](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)
explicitly describes keyboard activity changing focus indication even when the
focused element does not change. Therefore the report is useful UX feedback,
but the expectation that a mouse-focused element must never acquire a ring
after keyboard activity is not a browser correctness requirement.

Recommended treatment:

- Keep the main element's skip-link target and focusability. Replace its
  oversized container outline with a localized, visible content-entry cue,
  such as a title-area indicator, and verify actual skip-link activation.
- Keep keyboard-visible focus for scrollable tables and code. Normalize its
  appearance if needed. Their focusability enables keyboard scrolling.
- Do not apply global `outline: none`, remove all `tabindex` attributes, or
  blur the active element on arbitrary key presses.
- If OINK chooses to suppress only the pointer-origin reading path, define
  that additional behavior explicitly and scope it to these non-editable
  containers. It needs focused pointer/Tab/skip-link/programmatic-focus tests,
  including dark and forced-colors modes. A global input-modality framework is
  disproportionate to this report.

This review supports a focused presentation improvement. It does not support
removing the table/code keyboard cues simply to make the symptom disappear.

## Issue 42: distinguish hiding from grouping {#issue-42}

The question names `_index.json` and relies on screenshots rather than a source
fixture. The original screenshots were not successfully visually inspected in
this review; the author's exact intended first change remains unresolved.
Request a small directory tree and its actual index/front matter when replying.
Do not assume `_index.json` is either a supported page source or a typo without
that evidence.

The existing options have different meanings:

| Option | Current behavior and limitation |
| --- | --- |
| `no_list: true` | Removes the child list from the section's content body; does not hide its sidebar row. |
| `hide_summary: true` | Removes an item from a parent section's body list; does not change sidebar grouping. |
| `toc_hide: true` | In the content-tree walker, filters out the node before recursion, also removing its subtree from that tree. |
| `sidebar_root_menu: false` | Controls root-switcher candidates, not the node's row in the reading tree; see PR #43. |
| `sidebar_root_link_self: false` | Redirects a self-root's row to its parent; does not turn it into a non-link group. |
| `sidebar_divider: true` | Emits a non-link heading, but the shared renderer does not emit the supplied children in that branch. |
| `build.render: link` | Suppresses the section HTML while retaining its permalink; the current sidebar still emits a link to it. It is not sufficient by itself. |

The temporary site confirmed that a divider section's child HTML still exists
while its sidebar link disappears. A section with only `build.render: link`
has no section HTML but keeps a clickable sidebar row and its child. This
matches Hugo's documented
[build-option semantics](https://gohugo.io/content-management/build-options/)
and the theme's
[shared node renderer](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/sidebar-node.html#L48-L89).

For a real "group label with child links, but no directory-page navigation"
requirement, first consider completing `sidebar_divider` for section nodes:
retain the existing leaf divider, preserve children for a section, and use a
real disclosure button when folding is enabled. Check existing consumers before
settling that interpretation; introduce a separate node-level switch only if
the divider contract cannot express it compatibly. Keep publishing a section
page separate from whether its navigation label is a link.

The change must preserve hierarchy and active-path expansion in both walkers,
keep children in the pager, and avoid dead targets in breadcrumbs, search,
root switching, Print, and machine-readable navigation when the section page
is intentionally unpublished. Hiding a whole node with CSS is not a solution.

## Issue 40: a narrow extension is reasonable {#issue-40}

Source inspection confirms the stated gap:
[groupsFor](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/command-palette.js#L350-L368)
only composes built-in page/action groups, the public Palette object exposes no
provider registration, and
[registerExecutor](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/action-registry.js#L238-L263)
accepts only built-in action IDs. Static URL commands cannot substitute for a
row that carries the current query. The existing Palette/model tests pass;
that is evidence that the present feature works, not that this extension exists.

The proposed search-tail slot is a useful upstream boundary if kept small:
synchronous data-only row creation, asynchronous activation, local results
first, and OINK-owned rendering, selection, keyboard handling, and ARIA. It
does not require OINK to bundle an AI provider, credentials, remote search, or
a generic plugin system.

Before adopting the proposed API, settle and test:

1. Exactly which settled text-search states call the provider; preserve empty,
   command, choice, loading, and default no-extension behavior.
2. Snapshot the query/locale used to render each row. Preserve native empty
   and index-error messages, retry behavior, and the distinction between local
   page count and total selectable rows.
3. Validate and copy descriptors; render titles and descriptions as text;
   isolate provider exceptions, duplicate IDs, and invalid descriptors.
4. Handle synchronous throws and rejected promises, release pending state,
   reject duplicate activation, cancel stale sessions, and make unregister
   handles safe when an ID is later reused.
5. Test handoff to another dialog. Existing Palette close already avoids
   restoring focus when focus has moved outside; preserve that guard. Define
   how successful surface handoff differs from cancellation, since a blanket
   "every close aborts activation" rule can cancel the assistant being opened.
6. Preserve the default local-only network behavior and conditional bundles.
   A trusted extension's documented purity is not an enforceable sandbox.

Promote the accepted API shape into a bilingual Design proposal before
implementation. A downstream Ask AI wrapper can continue operating until a
tagged release provides the hook. This is not a prerequisite for shipping the
small correctness fixes.

## Delivery order and ownership {#delivery-order}

| Order | Delivery | Owning checks and documentation |
| --- | --- | --- |
| First | PR #43 completion and hidden-sidebar isolation as separate small changes | `check-shell.py`; site responsive/keyboard/accessibility cases; EN/ZH Shell contract and navigation guide |
| Next | Main-content focus styling and clarified grouping behavior | Content/reading and navigation checkers as appropriate; browser focus/scroll/skip tests; EN/ZH architecture, shell, and authoring guidance |
| Later | Public disclosure controller, then search-tail API | Theme JS tests and `check-navigation-contract.py` / `check-palette.py`; real site fixtures; accepted bilingual API contracts |

For every behavior change, first run its owning checker, then use the sibling
site's `make check`, `make browser`, and `make dev` workflow for the relevant
integration and visual review. Do not make these unrelated proposals into one
large sidebar/search rewrite or delay small fixes until every feature exists.

Suggested response content, not posted: acknowledge #43's filter bug while
explaining the current-root exception; accept #41's isolation defect and split
its API request; acknowledge #44's reproduction with the standard focus
explanation; give #42 the option distinctions and request its minimal input;
mark #40 as a scoped enhancement rather than a local-search failure.

Historical external issues are already closed. [#22](https://github.com/pgsty/oink/issues/22)
was resolved by enabling Goldmark passthrough, with confirmation from its
reporter. [#21](https://github.com/pgsty/oink/issues/21) received the Mermaid
viewer and fixed centered presentation; arbitrary right alignment was
explicitly not included. Neither should be silently counted as a new open bug.

## Validation and limits {#validation-and-limits}

Executed for this review:

- The owning `python3 bin/check-shell.py` passed on the local baseline and in
  an isolated checkout of PR #43's exact head.
- The Palette controller and model test files passed, two test files and no
  failures.
- Strict temporary Hugo builds before/after the actual PR diff reproduced
  self-root filtering and fallback in EN/ZH under `/sub/`; the same fixture
  demonstrated the grouping limitations.
- The real bilingual documentation site built with `--panicOnWarning` using
  the local theme. Targeted Chromium interactions reproduced all three focus
  outlines and the desktop hidden-focus defect.
- The site's bilingual, rendered-content, and link checks passed, as did all
  57 tests in its non-browser suite. The initial `make check` stopped at the
  `llms.txt` snapshot because this report added an index entry. After verifying
  that one-line addition and updating the golden, the affected and remaining
  test groups were rerun successfully.

The new bug assertions are investigative probes, not committed regression
tests. This was not a full release certification or an all-browser matrix.
The local Hugo version was 0.166.0, not the CI-pinned 0.165.0 or the declared
0.160.1 floor. Linux Super-key behavior, mobile accessibility-tree isolation,
dark/forced-colors cases, and the author's exact #42 screenshots still need
the acceptance coverage described above. No hosted deployment, release,
consumer upgrade, or upstream discussion was changed.

## Implementation and acceptance follow-up {#implementation-acceptance}

The maintainer chose to merge the contributor's patch first, then complete the
repairs and extensions directly on main without another pull request.
[PR #43](https://github.com/pgsty/oink/pull/43) merged as
[`6e814089`](https://github.com/pgsty/oink/commit/6e8140891bffe9d627c27a5676fbc26983250ea0).
The merge was pulled while preserving the existing local release-note commit.
The implementation follow-up is
[`56bfe37`](https://github.com/pgsty/oink/commit/56bfe37).

| Item | Implemented behavior | Owning acceptance |
| --- | --- | --- |
| #43 | Both root collectors honor explicit false. Current-root orientation remains compatible; dividers and unpublished sections do not become switcher links. | Strict EN/ZH subpath fixtures cover hidden top-level/nested roots, absent/true values, deduplication, current-root fallback, zero and one entry. |
| #41 | One disclosure controller commits ARIA, classes, labels and inert state. A late-safe API supports downstream persistence. Hidden whole-sidebar content is isolated while hover and drawer restoration remain usable. | Runtime tests plus browser checks for atomic events, no-op writes, scope, active paths, blocked storage, responsive relocation, focus return, real Tab traversal, Escape, backdrop and breakpoints. |
| #44 | A pointer-origin mark suppresses later incidental container outlines. Tab and fresh programmatic focus retain visible cues; the skip destination outlines the title. | Browser checks for article/table/code in light, dark and forced-colors modes, plus keyboard and skip-link regression coverage. |
| #42 | Divider sections keep their children under a non-link label. `build.render: never` suppresses their own page. Breadcrumb, search, pager, navigation JSON, Book TOC/Markdown and Print agree. Explicit navigation also works under bilingual subpaths. | Strict generic/data-tree fixtures, Book depth-three heading checks, EN/ZH browser fixtures and no-JavaScript traversal. |
| #40 | Trusted site scripts can register synchronous data-only search-tail rows and asynchronous activation. Native ordering, ARIA, validation, error isolation, cancellation, unregistering and focus handoff remain OINK-owned. | Runtime lifecycle tests and a Chinese browser scenario covering pointer/keyboard selection, literal display text, context snapshots, external-dialog focus and unregistering. |

Acceptance against the sibling theme checkout completed on macOS with Hugo
Extended 0.166.0, Node 26.9.0 and Chromium:

- All 44 theme JavaScript tests passed.
- `check-shell.py`, `check-reading.py`, `check-palette.py` and
  `check-keyboard.py` passed. A broader run passed 29 of the other 31 commands
  from the theme CI configuration. The two local failures were the media
  checker's version-specific processed-image hashes and four goldens containing
  Hugo 0.166's changed KaTeX output; ordinary navigation markup matched after
  preserving its existing whitespace. The fixed CI toolchain is verified
  separately below, rather than rewriting unrelated expected output.
- `make -C ../oink.pgsty.com check` passed: bilingual source/rendered/link
  checks and all 57 non-browser tests.
- `make -C ../oink.pgsty.com browser` passed all 141 tests: 30 accessibility,
  45 responsive/blog/palette, 16 keyboard, 10 content, 18 code-block, 4 scenario,
  5 theme-color and 13 community regressions. The accessibility suite included
  the complete multilingual sitemap scan.
- Strict theme fixture output and namespace checks passed. Local Book packaging
  produced an EPUB with five chapters and zero checker errors, and a 23-page
  PDF containing all five expected Book pages with zero checker errors.
- `make dev` served the real documentation site for visual inspection of desktop
  light, Chinese dark, collapsed-sidebar restore and a 375px mobile drawer.
  Escape returned focus to the visible drawer opener. The temporary browser
  viewport and development server were cleaned up afterwards.

The accepted contracts are in [Shell](/docs/design/shell/) and
[Architecture](/docs/design/architecture/), with matching Chinese sources and
updated navigation, organization, palette and Print guides. The regression
suite belongs to the documentation repository; the theme keeps only its
focused checkers and synthetic inputs.

The merged PR's
[fixed-toolchain CI](https://github.com/pgsty/oink/actions/runs/35449159584)
passed all three jobs. The final implementation's
[CI run](https://github.com/pgsty/oink/actions/runs/35451830483) also passed on
exact revision `56bfe37092a43fc12c0e16f865d3d3407c55cbde`: Hugo 0.165.0, browser
runtime tests and Book publication all succeeded. This includes the media and
four-state golden checks that differed locally on Hugo 0.166.0, plus publication
under root and subpath URLs. The supported 0.160.1 floor was not separately
retested; the declared continuous-test toolchain remains 0.165.0.

This is source and integration acceptance, not a new release. No new tag was
created, the documentation consumer still pins `v1.0.0`, and production was not
upgraded. The sibling documentation changes are prepared on local main for the
next theme publication; pushing their new browser gate against the old public
pin would test the wrong implementation. No contributor reply was sent, and issues #40, #41, #42 and #44 remain open. The exact original #42 screenshots and the reported Linux
Super-key setup were not independently reproduced; the explicit grouping
requirement and equivalent pointer-plus-key behavior were tested as described.

## Image-copy follow-up {#image-copy-follow-up}

The maintainer also reported preview instructions appearing below images after
copying a blog article into a rich-text editor. The blog pins OINK `v1.0.0` and
enables `params.ui.image_zoom`. That release and the reviewed main revision
inserted a visually hidden text span after each eligible image. Native Chromium
copy reproduced the extra `Open image preview` and Chinese equivalent in the
clipboard; this is a theme defect independent of the destination editor.

Theme commit [`75052f8`](https://github.com/pgsty/oink/commit/75052f8) moves the
image description and localized action into the button's `aria-label`. No helper
text node is added to the article. The image alt text, authored captions, native
button operation and dialog focus return are preserved. The
[component contract](/docs/design/components/#images-gallery-filetree-and-fences)
and [image guide](/docs/components/image/#zoom) document the copy behavior.

`check-image-zoom.py` passed, as did all 57 non-browser site tests. The focused
browser run passed 16 tests: the 14 content-component cases, including four new
EN/ZH image/gallery clipboard regressions, and two desktop-light/mobile-dark
dialog accessibility cases. The regressions read both plain-text and HTML
clipboard data, check text after removing its styling context, and verify
retained image URLs, alt text and captions. They also check accessible names.

No live Zhihu editor was used for acceptance. The blog dependency and hosted
deployment were not changed; the fix reaches that published consumer after its
theme dependency is upgraded and the site is rebuilt.
