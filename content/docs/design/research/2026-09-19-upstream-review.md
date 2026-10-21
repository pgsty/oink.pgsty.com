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
> This research records source inspection, live GitHub status, local builds, and targeted browser observations on 2026-09-19.
> At the initial checkpoint, recommendations were not accepted contracts or implemented features.
> No PR had been merged, release published, or contributor reply posted.
> The final implementation follow-up records subsequent changes.

The initial review remains below; the maintainer later authorized merging PR #43 and implementing the other items directly on main.
See the [same-day implementation and acceptance follow-up](#implementation-acceptance).

## Verdict {#verdict}

The reports identify useful problems, but they are not all defects of the same kind.
Fix hidden navigation focus first.
Accept PR #43's direction as a small correctness fix after clarifying its boundary and adding coverage.
Treat search-tail registration and public sidebar state as additional APIs requiring their own acceptance work.

| Item | Finding | Recommendation |
| --- | --- | --- |
| [PR #43](https://github.com/pgsty/oink/pull/43), MagicFollower | Self-root collection ignores an explicit `sidebar_root_menu: false`. Reproduced. | Conditional acceptance: the patch correctly filters the global candidate list. Document the current-root exception, add regression tests, and obtain successful CI. |
| [#41](https://github.com/pgsty/oink/issues/41), imbajin | Hidden whole-sidebar content remains focusable. Several controllers write disclosure state, and no public API exists. | Split a correctness repair from an optional API. The former has higher priority. |
| [#44](https://github.com/pgsty/oink/issues/44), lloydsun | Pointer focus followed by a key produces the reported outlines. Reproduced on another platform. | Improve the main-content focus treatment. Retain useful keyboard cues for scrollable content. The browser heuristic itself is expected. |
| [#42](https://github.com/pgsty/oink/issues/42), aucru | Existing hiding and divider options do not provide a complete non-link section group with its children. | Explain the options separately and obtain the author's exact minimal example. If the missing group behavior is confirmed, implement it. |
| [#40](https://github.com/pgsty/oink/issues/40), imbajin | There is no supported way to append a query-dependent action to local search. | This is a reasonable small extension proposal. It does not identify a failure of existing local search. Correctness repairs have higher priority. |

## Baseline and method {#baseline-and-method}

GitHub API reads found four open external issues and one open external PR.
The other open issue, [#37](https://github.com/pgsty/oink/issues/37), was the maintainer's release tracker.
The external items had no discussion comments or submitted PR reviews at the snapshot time.

| Input | Verified snapshot |
| --- | --- |
| Remote theme `main` | `93ac292014a3cd81f7c41caec4df98ed9d2dc45a` |
| Local theme | `75ddc95`. Only the release text in `CHANGELOG.md` differs from remote `main`. |
| PR #43 head | `8eeb8ecaf525097cc56572fe22234db381bfc16a`, one changed template line |
| Local documentation | `ff0ba39`. `go.mod` still requires OINK `v1.0.0`. |
| Published release | GitHub's latest release is `v1.0.0`. The remote query returned no `v1.1.0` tag. |
| Build tools | Hugo Extended 0.166.0, Node 26.9.0, npm 11.19.1 |
| Browser observation | macOS, Chromium 153.0.0.0, light theme, real sibling documentation site using a command-scoped module replacement |

The Design section's `released-v1.1.0` labels and local release-preparation commits do not prove publication.
Source changes, tags, consumer pins, and hosted deployment remain separate facts.
This review did not upgrade the public consumer.

The method combined complete issue/PR bodies and comments, the exact diff, and bilingual Design contracts with inspection of owning templates and JavaScript.
It also used a temporary bilingual site under the `/sub/` base path and targeted documentation-site browser interactions.
No theme implementation changed in the shared checkout.

## PR 43: accept the small fix with a precise boundary {#pr-43}

The first pass in [root-menu-roots.html](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/root-menu-roots.html#L7-L26)
filters top-level sections by `sidebar_root_menu`.
The second pass collects sections with `sidebar_root_for` set to `self`, but omits that filter.
Sections excluded in the first pass can therefore return in the second.

The PR adds the same explicit-false predicate to the second pass:

```go-html-template
{{- if and .IsSection (ne .Params.sidebar_root_menu false) -}}
```

The patch keeps the default for absent or true values, the section constraint, and URL deduplication, while preserving navigation-tree order, pager order, and language-specific caching.
These properties make it a focused correctness fix with no need for a broader navigation refactor.

However, [root-menu-entries.html](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/root-menu-entries.html#L1-L12)
subsequently appends the current resolved root when absent.
This existing behavior is documented in the navigation guide, so it is not a new PR regression; it does prevent the broader claim that false hides the root on every page.

The local probe used a top-level Blog root and nested Docs root, both with `sidebar_root_for: self` and `sidebar_root_menu: false`.
It also included a visible Docs root and a self-root without a visibility override.
English and Chinese results were identical and retained language-aware `/sub/` URLs:

| Viewed page | Before the PR | With the PR |
| --- | --- | --- |
| An unrelated Docs page | Both hidden self-roots appear | Both disappear |
| A page inside the hidden Blog root | Blog appears | Blog still appears through current-root fallback |
| A page inside the hidden nested root | Nested root appears | Nested root still appears through current-root fallback |
| A visible self-root | Appears | Still appears without duplication |

Recommended contract: false excludes roots from site-wide selectable candidates, but the current root may remain for orientation.
Keeping this exception is the smallest compatible interpretation. State it explicitly in both languages.
If the intended contract requires absolute exclusion, change the current-root fallback and switcher trigger together.
Another predicate alone is insufficient. Check zero and one-entry states.

Before merging:

1. Add output-based `bin/check-shell.py` cases for hidden top-level and nested self-roots, absent/true values, deduplication, and current-root behavior.
   Cover one-entry degradation and EN/ZH subpaths.
2. Update the Shell contract and navigation guide together.
   Change the PR description's YAML comment from `//` to `#` so readers can paste its example.
3. Resolve the workflow's [action_required result](https://github.com/pgsty/oink/actions/runs/34597562431) and run required checks on the final head.
   At this snapshot, the PR head has no successful check runs or commit statuses.
   The API reports `MERGEABLE` and `UNSTABLE`. Neither proves that tests passed.

The maintainer can add these small changes while preserving the contribution.
Do not make acceptance depend on #40 or all of #41.

## Issue 41: repair isolation, then expose state {#issue-41}

There are two separate findings.

Whole-sidebar hiding uses transforms and, on desktop, opacity.
Drawer and collapse controllers leave hidden controls in keyboard navigation.
In the browser probe, Collapse sidebar left focus on the transparent collapse button.
Tab then moved focus to the hidden root switcher.
The panel had zero opacity and no effective `inert` or `aria-hidden` ancestor.
This is a reproducible usability defect, not just a missing integration hook.
Closed mobile panels use similar off-screen positioning without explicit isolation.

Disclosure writes are duplicated across
[the click controller and responsive relocation](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/docs-shell.js#L374-L487)
and [cached active-path hydration](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/sidebar-nav.js#L43-L62).
There is no public setter, getter, or committed-state event.
Collapse, width, and scroll storage does not preserve each branch's disclosure state across navigation.
The authoring guide's local expansion-state claim needs this distinction.

Recommended repair:

1. Centralize whole-sidebar isolation at initialization and every open, close, collapse, hover-overlay, restore, and breakpoint transition.
   Remove isolation before moving focus inside.
   Return focus to a visible external control before making content inert.
2. Isolate content while keeping the external restore button and desktop edge hover target active.
   Applying `inert` to the pointer sensor would break hover interaction.
   `aria-hidden` alone does not prevent keyboard focus.
   The [HTML inert contract](https://html.spec.whatwg.org/multipage/interaction.html#inert) controls interaction and accessibility exposure.
3. Route disclosure changes through one commit function separately.
   Update `aria-expanded`, the open class, and localized label before emitting one event.
   Repeated writes of the current value should have no effect.
4. Expose a small setter/getter and event only after defining stable IDs, invalid-ID behavior, initialization readiness, and restoration order.
   Keep version/locale storage policy downstream-owned. Let the active path take precedence after restoration.

The proposal needs a scope correction.
Responsive TOC/backlink/taxonomy groups can move from the sidebar to the right rail.
A controller searching only current-sidebar descendants cannot control wide-layout writes.
Register OINK-owned targets independently of their current DOM parent.
Restrict the public sidebar API to its intended registered subset.

Acceptance must check real Tab order and the accessibility tree in hidden states.
It must also check restored desktop collapse on first load, hover entry/exit, focus return, Escape, backdrop close, and scroll unlock.
Cover the 768/1200 breakpoints and preserve #24's visible no-JavaScript fallback.
Static axe scans and drawer-opening assertions do not prove these state transitions.

## Issue 44: real symptom, partly expected behavior {#issue-44}

On the documentation configuration page, clicking the article heading focused `main#td-main-content`.
Clicking table headers focused `div.td-table-scroll`; clicking code focused `pre.chroma`.
In each case, `:focus-visible` was false after clicking and true after pressing unbound `z`.
Main/code outlines changed from none to browser auto outlines. Tables used the theme's solid outline.
This reproduced the mechanism without the reporter's Linux compositor or Super key.

The [Selectors specification](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)
explicitly describes keyboard activity changing focus indication while focus stays on the same element.
The report therefore provides useful UX feedback.
Browsers are not required to keep mouse-focused elements free of focus rings after keyboard activity.

Recommended treatment:

- Keep the main skip-link target and focusability.
  Replace its oversized outline with a local, visible content-entry cue, such as a title-area indicator.
  Verify actual skip-link activation.
- Keep visible keyboard focus on scrollable tables and code. Normalize its appearance if needed.
  Focusability enables keyboard scrolling.
- Do not apply global `outline: none`, remove all `tabindex` attributes, or blur focus on arbitrary keypresses.
- If OINK suppresses only pointer-origin reading focus, define that behavior explicitly for these non-editable containers.
  Test pointer, Tab, skip-link, and programmatic focus, including dark and forced-colors modes.
  A global input-modality framework is disproportionate to this report.

This review supports a focused presentation improvement.
It does not support removing table/code keyboard cues merely to hide the symptom.

## Issue 42: distinguish hiding from grouping {#issue-42}

The question names `_index.json` and supplies screenshots instead of a source fixture.
This review could not visually inspect the original screenshots. The author's intended first change remains unresolved.
When replying, request a small directory tree and actual index/front matter.
Without that evidence, do not assume `_index.json` is a supported page source or a typo.

The existing options have different meanings:

| Option | Current behavior and limitation |
| --- | --- |
| `no_list: true` | Removes the child list from the section's content body. It does not hide the section's sidebar row. |
| `hide_summary: true` | Removes an item from a parent section's body list. It does not change sidebar grouping. |
| `toc_hide: true` | The content-tree walker filters out the node before recursion. This also removes its subtree from that tree. |
| `sidebar_root_menu: false` | Controls root-switcher candidates. It does not control the node's row in the reading tree. See PR #43. |
| `sidebar_root_link_self: false` | Redirects a self-root's row to its parent. It does not make the row a non-link group. |
| `sidebar_divider: true` | Emits a non-link heading. The shared renderer does not emit the supplied children in that branch. |
| `build.render: link` | Suppresses the section HTML and retains its permalink. The current sidebar still emits a link to it. This option alone is insufficient. |

The temporary site confirmed that divider sections keep child HTML while child sidebar links disappear.
Sections with only `build.render: link` have no section HTML, but keep clickable sidebar rows and children.
This matches Hugo's [build-option semantics](https://gohugo.io/content-management/build-options/)
and the theme's [shared node renderer](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/layouts/_partials/shell/sidebar-node.html#L48-L89).

For a real "group label with child links, but no directory-page navigation" requirement, first consider completing `sidebar_divider` for sections.
Keep leaf dividers and section children. Use real disclosure buttons when folding is enabled.
Check existing consumers before adopting this interpretation.
Add a separate node switch only if the divider contract cannot express it compatibly.
Keep section publication separate from whether its navigation label is linked.

The change must preserve hierarchy and active-path expansion in both walkers, and keep children in the pager.
If a section is intentionally unpublished, the change must avoid dead targets in breadcrumbs, search, root switching, Print, and machine-readable navigation.
Hiding whole nodes with CSS is not a solution.

## Issue 40: a narrow extension is reasonable {#issue-40}

Source inspection confirms the gap.
[groupsFor](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/command-palette.js#L350-L368)
creates only built-in page/action groups. The public Palette object has no provider registration.
[registerExecutor](https://github.com/pgsty/oink/blob/93ac292014a3cd81f7c41caec4df98ed9d2dc45a/assets/js/action-registry.js#L238-L263)
accepts only built-in action IDs.
Static URL commands cannot replace rows carrying the current query.
Passing Palette/model tests provide evidence that the existing feature works. They do not show that this extension exists.

The proposed search-tail slot is a useful upstream boundary if its scope stays small.
It uses synchronous data-only row creation, asynchronous activation, and local results first.
OINK controls rendering, selection, keyboard handling, and ARIA.
It needs no bundled AI provider, credentials, remote search, or generic plugin system.

Before adopting the proposed API, settle and test:

1. Define which settled text-search states call providers.
   Preserve empty, command, choice, loading, and default no-extension behavior.
2. Snapshot the query/locale used for each rendered row.
   Preserve native empty/index-error messages, retry behavior, and the difference between local page counts and all selectable rows.
3. Validate and copy descriptors. Render titles and descriptions as text.
   Isolate provider exceptions, duplicate IDs, and invalid descriptors.
4. Handle synchronous throws and rejected promises. Clear pending state and reject duplicate activation.
   Cancel stale sessions. Ensure unregister handles remain safe when IDs are reused.
5. Test handoff to another dialog.
   Palette close already avoids returning focus when focus moved outside. Preserve this guard.
   Define how successful handoff differs from cancellation.
   An "every close aborts activation" rule can cancel the assistant being opened.
6. Preserve default local-only network behavior and conditional bundles.
   Documented trusted-extension purity is not an enforceable sandbox.

Before implementation, record the accepted API in a bilingual Design proposal.
Downstream Ask AI wrappers can continue until a tagged release provides the hook.
This is not required for the small correctness fixes.

## Delivery order and ownership {#delivery-order}

| Order | Delivery | Owning checks and documentation |
| --- | --- | --- |
| First | PR #43 completion and hidden-sidebar isolation as separate small changes | `check-shell.py`; site responsive/keyboard/accessibility cases; EN/ZH Shell contract and navigation guide |
| Next | Main-content focus styling and clarified grouping behavior | Content/reading and navigation checkers as appropriate; browser focus/scroll/skip tests; EN/ZH architecture, shell, and authoring guidance |
| Later | Public disclosure controller, then search-tail API | Theme JS tests and `check-navigation-contract.py` / `check-palette.py`; real site fixtures; accepted bilingual API contracts |

For each behavior change, run its owning checker first.
Then use the sibling site's `make check`, `make browser`, and `make dev` for relevant integration and visual review.
Do not combine unrelated proposals into one large sidebar/search rewrite.
Do not delay small fixes until all features exist.

Suggested response content, not posted: acknowledge #43's filter defect and explain its current-root exception.
Accept #41's isolation defect separately from the API request.
Acknowledge #44's reproduction and explain standard focus behavior.
Explain #42's options and request minimal input.
Describe #40 as a scoped enhancement, not a local-search failure.

Historical external issues are closed.
[#22](https://github.com/pgsty/oink/issues/22) was resolved by enabling Goldmark passthrough, with reporter confirmation.
[#21](https://github.com/pgsty/oink/issues/21) received the Mermaid viewer and corrected centered presentation.
Arbitrary right alignment was explicitly excluded. Do not silently count either issue as a new open defect.

## Validation and limits {#validation-and-limits}

Executed for this review:

- `python3 bin/check-shell.py` passed on the local baseline and in an isolated checkout at PR #43's exact head.
- Palette controller and model tests passed: two test files, no failures.
- Strict temporary Hugo builds before/after the actual PR diff reproduced EN/ZH self-root filtering and fallback under `/sub/`.
  The same fixture demonstrated grouping limitations.
- The real bilingual site built with `--panicOnWarning` using the local theme.
  Targeted Chromium interactions reproduced all three focus outlines and the desktop hidden-focus defect.
- Bilingual, rendered-content, and link checks passed, along with all 57 non-browser tests.
  Initial `make check` stopped at the `llms.txt` snapshot because this report added an index entry.
  After verifying that one-line addition and updating the golden, affected and remaining groups passed on rerun.

The new defect assertions are investigative probes, not committed regression tests.
This was not full release certification or an all-browser matrix.
Local Hugo was 0.166.0, not CI-pinned 0.165.0 or the 0.160.1 floor.
Linux Super-key behavior, mobile accessibility-tree isolation, dark/forced-colors cases, and the exact #42 screenshots still need the specified acceptance coverage.
This review changed no hosted deployment, release, consumer upgrade, or upstream discussion.

## Implementation and acceptance follow-up {#implementation-acceptance}

The maintainer chose to merge the contributor patch first, then complete repairs and extensions directly on main without another PR.
[PR #43](https://github.com/pgsty/oink/pull/43) merged as
[`6e814089`](https://github.com/pgsty/oink/commit/6e8140891bffe9d627c27a5676fbc26983250ea0).
The merge was pulled while preserving the local release-note commit.
The implementation follow-up is [`56bfe37`](https://github.com/pgsty/oink/commit/56bfe37).

| Item | Implemented behavior | Owning acceptance |
| --- | --- | --- |
| #43 | Both root collectors honor explicit false. Current-root orientation remains compatible. Dividers and unpublished sections do not become switcher links. | Strict EN/ZH subpath fixtures cover hidden top-level/nested roots, absent/true values, deduplication, current-root fallback, zero and one entry. |
| #41 | One disclosure controller commits ARIA, classes, labels and inert state. A late-safe API supports downstream persistence. Hidden whole-sidebar content is isolated. Hover and drawer restoration remain usable. | Runtime tests plus browser checks for atomic events, no-op writes, scope, active paths, blocked storage, responsive relocation, focus return, real Tab traversal, Escape, backdrop and breakpoints. |
| #44 | A pointer-origin mark suppresses later incidental container outlines. Tab and fresh programmatic focus retain visible cues. The skip destination outlines the title. | Browser checks for article/table/code in light, dark and forced-colors modes, plus keyboard and skip-link regression coverage. |
| #42 | Divider sections keep their children under a non-link label. `build.render: never` suppresses their own page. Breadcrumb, search, pager, navigation JSON, Book TOC/Markdown and Print agree. Explicit navigation also works under bilingual subpaths. | Strict generic/data-tree fixtures, Book depth-three heading checks, EN/ZH browser fixtures and no-JavaScript traversal. |
| #40 | Trusted site scripts can register synchronous data-only search-tail rows and asynchronous activation. OINK continues to own native ordering, ARIA and validation. It also owns error isolation, cancellation, unregistering and focus handoff. | Runtime lifecycle tests and a Chinese browser scenario cover pointer/keyboard selection and literal display text. They also cover context snapshots, external-dialog focus and unregistering. |

Acceptance used the sibling theme checkout on macOS with Hugo Extended 0.166.0, Node 26.9.0, and Chromium:

- All 44 theme JavaScript tests passed.
- `check-shell.py`, `check-reading.py`, `check-palette.py`, and `check-keyboard.py` passed.
  A broader run passed 29 of the other 31 theme CI commands.
  Two local failures involved the media checker's version-specific processed-image hashes and four goldens with Hugo 0.166's changed KaTeX output.
  Ordinary navigation markup matched after preserving its existing whitespace.
  Fixed-toolchain verification is recorded below. Unrelated expected outputs were not rewritten.
- `make -C ../oink.pgsty.com check` passed bilingual source/rendered/link checks and all 57 non-browser tests.
- `make -C ../oink.pgsty.com browser` passed all 141 tests:
  30 accessibility, 45 responsive/blog/palette, 16 keyboard, 10 content, 18 code-block, 4 scenario, 5 theme-color, and 13 community regressions.
  Accessibility included the complete multilingual sitemap scan.
- Strict theme fixture output and namespace checks passed.
  Local Book packaging produced an EPUB with five chapters and zero checker errors.
  It also produced a 23-page PDF with all five expected Book pages and zero checker errors.
- `make dev` served the real site for desktop-light, Chinese-dark, collapsed-sidebar restore, and 375px mobile-drawer review.
  Escape returned focus to the visible drawer opener.
  The temporary viewport and development server were cleaned up afterward.

Accepted contracts are in [Shell](/docs/design/shell/) and [Architecture](/docs/design/architecture/), with matching Chinese sources.
Navigation, organization, palette, and Print guides were also updated.
The documentation repository owns regression suites. The theme keeps focused checkers and synthetic inputs.

The merged PR's [fixed-toolchain CI](https://github.com/pgsty/oink/actions/runs/35449159584) passed all three jobs.
The final implementation's [CI run](https://github.com/pgsty/oink/actions/runs/35451830483) also passed at exact revision `56bfe37092a43fc12c0e16f865d3d3407c55cbde`.
Hugo 0.165.0, browser runtime tests, and Book publication succeeded.
This included media and four-state golden checks that differed locally on Hugo 0.166.0, plus root/subpath publication.
The supported 0.160.1 floor was not separately retested. The declared continuous-test toolchain remains 0.165.0.

This is source and integration acceptance, not a new release.
No new tag was created. The documentation consumer still pins `v1.0.0`, and production was not upgraded.
Sibling documentation changes are prepared on local main for the next theme publication.
Pushing their browser gate against the old public pin would test the wrong implementation.
No contributor reply was sent. Issues #40, #41, #42, and #44 remain open.
The exact #42 screenshots and reported Linux Super-key setup were not independently reproduced.
The explicit grouping requirement and equivalent pointer-plus-key behavior were tested as described.

## Image-copy follow-up {#image-copy-follow-up}

The maintainer also reported preview instructions below images after copying blog articles to rich-text editors.
The blog pins OINK `v1.0.0` and enables `params.ui.image_zoom`.
That release and the reviewed main revision inserted a visually hidden text span after every eligible image.
Native Chromium copying reproduced `Open image preview` and its Chinese equivalent in clipboard content.
This is a theme defect independent of the destination editor.

Theme commit [`75052f8`](https://github.com/pgsty/oink/commit/75052f8) puts image descriptions and localized actions in the button's `aria-label`, keeping helper text nodes out of the article.
Image alt text, authored captions, native button behavior, and dialog focus return remain intact.
The [component contract](/docs/design/components/#images-gallery-filetree-and-fences)
and [image guide](/docs/components/image/#zoom) document this copying behavior.

`check-image-zoom.py` and all 57 non-browser site tests passed.
The focused browser run passed 16 tests: 14 content-component cases and two desktop-light/mobile-dark dialog accessibility cases.
Component cases included four new EN/ZH image/gallery clipboard regressions.
The regressions read plain-text and HTML clipboard data and check text without its original styles.
They verify retained image URLs, alt text, captions, and accessible names.

Acceptance did not use a live Zhihu editor, and the blog dependency and hosted deployment stayed unchanged.
The published consumer receives the fix after upgrading its theme dependency and rebuilding.
