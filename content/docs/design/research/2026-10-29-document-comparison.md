---
title: Document comparison research, 2026-10-29
linkTitle: Document comparison research
description: Dated evidence for a generic OINK side-by-side reading mode across languages and revisions.
weight: 58
icon: fa-solid fa-columns
design_kind: research
design_status: dated-evidence
research_date: 2026-10-29
---

> [!NOTE] Historical research; see the 1.5.0 decision
> Research date: 2026-10-29. This bounded source review of OINK v1.4.0 informed
> the translation reader in OINK 1.5.0. The [accepted decision](/docs/design/decisions/document-comparison/)
> and the [shell contract](/docs/design/shell/#translation-comparison) describe
> the released behavior and supersede the recommendations below.

## Scope and evidence {#scope-and-evidence}

The question was how OINK could support a generic comparison reading mode for
roughly 30–40 local sites: translated documents, eight-language sets,
proofreading books, arbitrary languages, and old/new revisions in one language.
The review covered Docusaurus, VitePress, Material for MkDocs with mike, Read
the Docs, Hugo, Sefaria, MediaWiki ContentTranslation, OmegaT, Weblate, Joplin,
VS Code, and CodeMirror. Evidence came from official documentation and pinned
source revisions; no upstream application was started and no browser behavior
was claimed from source inspection alone. Unpinned official documentation records
what was read on 2026-10-29; it is not an immutable source snapshot. OmegaT
evidence is limited to the 6.1.0 manual, not an inspected implementation.

| Project | Fixed documentation/source revision | Verified relevance |
| --- | --- | --- |
| Hugo | v0.168.0 source commit [`e27a6760c5547237f87d353aebe0580feadb20f4`](https://github.com/gohugoio/hugo/commit/e27a6760c5547237f87d353aebe0580feadb20f4) | Page relationships and native version rotation; no paragraph alignment. |
| Docusaurus, VitePress, Material/mike | [Docusaurus v3.10.2](https://github.com/meta/docusaurus/tree/f37f9035584917a97a260b91fc2842cba4f8b94f), [VitePress v1.6.4](https://github.com/vuejs/vitepress/tree/1fc537b78cda287fa23c1129a815ad9455fd8106), [Material 9.8.0](https://github.com/squidfunk/mkdocs-material/tree/0f72ad68d1bee212f909f3b82e0189e221b06374), [mike v2.2.0](https://github.com/jimporter/mike/tree/b01e03075315ebd2d39a93c390cf14b6a83f3d5e) | Stable identity, explicit anchors, version metadata, and existence-aware navigation. |
| Read the Docs and VS Code | RTD platform commit [`9b012b1df15fc153590b4db5f4da7bd3eb8ae74a`](https://github.com/readthedocs/readthedocs.org/commit/9b012b1df15fc153590b4db5f4da7bd3eb8ae74a); Addons [`d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce`](https://github.com/readthedocs/addons/commit/d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce); VS Code [`d7658021df8289f549bf2af8c8dec131f2580d69`](https://github.com/microsoft/vscode/commit/d7658021df8289f549bf2af8c8dec131f2580d69) | Real rendered HTML/Markdown comparison and mapped previews; neither proves a generic OINK reader. |
| Sefaria and ContentTranslation | Sefaria [`af96a1a1695a6307a3d616493455a6802455be1b`](https://github.com/Sefaria/Sefaria-Project/commit/af96a1a1695a6307a3d616493455a6802455be1b); ContentTranslation [`8d5dde493528330efcb373dc448f352e81815115`](https://github.com/wikimedia/mediawiki-extensions-ContentTranslation/commit/8d5dde493528330efcb373dc448f352e81815115) | Independent panes and strict segment rows are separate products. |
| Joplin, OmegaT, Weblate, CodeMirror | Joplin [`b48e75856d81152c32e71f21075e1c043d9ea922`](https://github.com/laurent22/joplin/commit/b48e75856d81152c32e71f21075e1c043d9ea922); OmegaT Standard Manual 6.1.0; Weblate [`503129cadb056e2ea0db629fe8e37907b41ff054`](https://github.com/WeblateOrg/weblate/commit/503129cadb056e2ea0db629fe8e37907b41ff054); CodeMirror [`53c8f7b213332743a1f4f7d26bf40cfe2b512b53`](https://code.haverbeke.berlin/codemirror/merge/src/commit/53c8f7b213332743a1f4f7d26bf40cfe2b512b53) | Logical scroll maps, manual alignment, stable message context, and geometry spacers. |
| DDIA consumer sample | `Vonng/ddia` [`a6b2e6f85e1249720c8a349273455190d2fc9515`](https://github.com/Vonng/ddia/commit/a6b2e6f85e1249720c8a349273455190d2fc9515) | Four Hugo members with repeated Chinese locales and distinct editions. |

## Identity and relationship lessons {#identity-and-relationship-lessons}

For the original general-purpose scope, comparison would need to keep candidate-set identity, member identity, Hugo site key,
actual locale and direction, edition/version, canonical URL, and anchor
correspondence separate. A language code is not a document identity. The [pinned DDIA configuration](https://github.com/Vonng/ddia/blob/a6b2e6f85e1249720c8a349273455190d2fc9515/hugo.yaml#L25)
provides a concrete case: `zh`, `tw`, `v1`, and `v1_tw` are four configured members
that include repeated Chinese locales and different editions. Deduplicating by
locale would remove valid choices and mislabel editions as translations.

Hugo 0.168.0 provides a sound starting point. [`.AllTranslations`](https://gohugo.io/methods/page/alltranslations/)
includes the current page and [`.Translations`](https://gohugo.io/methods/page/translations/)
excludes it; an explicit `translationKey` can relate pages whose paths differ.
[`.Rotate "version"`](https://gohugo.io/methods/page/rotate/) can adapt native version
dimensions while holding other dimensions, including language and role, fixed.
That adapter is optional for comparison and does not require a consumer to
reorganize content. It must not be confused with an OINK `params.versions`
menu, which is a navigation configuration rather than a semantic partner
resolver. Custom version or role dimensions still need an explicit adapter so
ambiguous native matches are not silently accepted.

Automatic translation candidates should therefore begin with the actual Hugo
page relationship, then pass an eligibility filter: published, built,
renderable HTML siblings; the selected page is excluded; home pages used as
language-navigation fallbacks are excluded; foreign role or version members
are excluded when the set requires that boundary. A navigation link proves
that a destination exists, not that it is a translation or a comparable
document. Missing translations remain missing; OINK must not copy source text
behind the reader's back.

The original generic design used two selectors for an eight-language set. It
does not require 28 prebuilt pair pages or eight simultaneously loaded
documents. Same-language v1/v2 comparison uses two member IDs and explicit
labels. The same identity model also supports a proofreading book whose
chapter structures differ, without pretending that equal filenames or title
text establish correspondence.

## What existing tools actually compare {#what-existing-tools-actually-compare}

[Docusaurus document identity](https://docusaurus.io/docs/create-doc#document-id),
[localization](https://docusaurus.io/docs/i18n/tutorial), and
[versioning](https://docusaurus.io/docs/versioning) separate ID, slug, locale, and
version tree; its [heading guidance](https://docusaurus.io/docs/markdown-features/toc#heading-ids)
advises stable IDs for localized pages. VitePress constructs locale links from
the current relative path in the inspected
[language helper](https://github.com/vuejs/vitepress/blob/1fc537b78cda287fa23c1129a815ad9455fd8106/src/client/theme-default/composables/langs.ts)
and supports [custom anchors](https://vitepress.dev/guide/markdown#custom-anchors),
but that helper does not establish a semantic partner registry. Material uses
[mike version metadata](https://github.com/jimporter/mike/blob/b01e03075315ebd2d39a93c390cf14b6a83f3d5e/README.md)
and [target sitemaps](https://github.com/squidfunk/mkdocs-material/blob/0f72ad68d1bee212f909f3b82e0189e221b06374/src/templates/assets/javascripts/integrations/version/index.ts)
to find a corresponding URL;
that confirms addressability, not semantic equivalence. These are useful
identity and validation patterns, not evidence of native two-pane scrolling.

Read the Docs supplies direct fixed comparison evidence: its [visual-diff
documentation](https://docs.readthedocs.com/platform/stable/visual-diff.html) and
[Addons `docdiff.js`](https://github.com/readthedocs/addons/blob/d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce/src/docdiff.js)
compare a rendered HTML body, mark changed DOM regions, and preserve a URL mode
flag. This is a single-page rendered diff for review workflows. VS Code's
[Markdown diff documentation](https://code.visualstudio.com/docs/languages/markdown#%5Fmarkdown-preview-in-diff-view)
and [`diffScrollSync.ts`](https://github.com/microsoft/vscode/blob/d7658021df8289f549bf2af8c8dec131f2580d69/extensions/markdown-language-features/preview-src/diffScrollSync.ts)
show two rendered previews with logical mappings and feedback suppression. They
demonstrate that rendered comparison and mapped scrolling are feasible, while
leaving OINK's content identity and static-host constraints unresolved.

Sefaria explicitly distinguishes an independent Compare Text view from a
shared-segment bilingual view: [`TextRange.jsx`](https://raw.githubusercontent.com/Sefaria/Sefaria-Project/af96a1a1695a6307a3d616493455a6802455be1b/static/js/TextRange.jsx)
renders both texts inside a shared segment, while [`TextColumn.jsx`](https://raw.githubusercontent.com/Sefaria/Sefaria-Project/af96a1a1695a6307a3d616493455a6802455be1b/static/js/TextColumn.jsx)
keeps comparison columns independently scrollable. MediaWiki
ContentTranslation's [`alignSectionPair`](https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-ContentTranslation/8d5dde493528330efcb373dc448f352e81815115/modules/ui/mw.cx.ui.TranslationView.js)
uses stable section IDs and height/margin compensation for paired translation
regions in a single editing flow. OmegaT's [Align Files manual](https://omegat.sourceforge.io/manual-standard/en/chapter.windows.and.dialogs.html)
combines automatic matching with manual split, merge, move, and acceptance
operations. Weblate's [`Unit` model](https://github.com/WeblateOrg/weblate/blob/503129cadb056e2ea0db629fe8e37907b41ff054/weblate/trans/models/unit.py)
keeps message IDs and context separate from text hashes. CodeMirror's
[`updateSpacers`](https://code.haverbeke.berlin/codemirror/merge/src/commit/53c8f7b213332743a1f4f7d26bf40cfe2b512b53/src/deco.ts)
shows the geometry cost of aligned rows. Together they show why automatic
similarity can suggest a relationship but cannot silently publish a paragraph
map for arbitrary multilingual HTML.

## Three reading semantics {#three-reading-semantics}

The design must name three different behaviors. **Independent scrolling** gives
each pane its own position and is the fallback for every valid pair.
**Anchor-linked scrolling** keeps two independent panes and uses shared semantic
anchors to estimate corresponding progress between anchors. It is a nearby
section reference, not permanent paragraph or line alignment. **Strict row alignment** puts actual blocks into paired rows, uses
the maximum row height and spacers for the shorter side, and needs one-to-many
mapping, missing-block placeholders, and an explicit order policy. It is a
separate later feature.

For OINK, the proposed default depends on mapping quality: enable anchor-linked
scrolling only when the conservative conditions below pass, otherwise use
independent scrolling. The reader can always turn synchronization off.
A pair with zero or one valid internal anchor, duplicate explicit targets,
missing explicit targets, or non-monotonic moved anchors stays independently
readable. Ordinary unmatched sections are content gaps, not invalid targets. A direct “jump to counterpart” action
can still work where continuous synchronization cannot.

## Rendering and isolation finding {#rendering-and-isolation-finding}

OINK's [v1.4.0 Docs shell](https://github.com/pgsty/oink/blob/v1.4.0/layouts/docs/baseof.html#L17),
[content rendering](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/content/render.html),
[Book ID handling](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/book/namespace-print-headings.html#L1), tabs,
table reader, diagrams, and capability-selected scripts make arbitrary
single-DOM body concatenation a large refactor. Two same-origin document frames
preserve each page's `lang`, `dir`, resource base, renderer context, IDs, and
reader ownership. A frame is a document boundary, not an independent process
or a security sandbox; same-origin content remains trusted content. See the
[iframe reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
and [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin%5Fpolicy).

The initially considered path used a prototype with ordinary eligible HTML
pages in two same-origin frames and guards for navigation, keyboard shortcuts,
analytics, comments, and recursive compare entry, then considered an optional
content-only HTML view. The revised first phase keeps ordinary pages for the
implementation too; a dedicated output is only a future optimization if
measurements justify it. Hugo parameters alone cannot
create an output format; any auxiliary output needs explicit output plumbing,
Page Store/capability handling, relative-resource rules, and SEO policy.

## Scroll model and bounded conclusions {#scroll-model-and-bounded-conclusions}

The useful engine pattern is Joplin's logical map and VS Code's mapped rendered
previews. Joplin's [`scrollmap.js`](https://github.com/laurent22/joplin/blob/b48e75856d81152c32e71f21075e1c043d9ea922/packages/app-desktop/gui/note-viewer/scrollmap.js)
and VS Code's [`diffScrollSync.ts`](https://github.com/microsoft/vscode/blob/d7658021df8289f549bf2af8c8dec131f2580d69/extensions/markdown-language-features/preview-src/diffScrollSync.ts)
support collecting layout-valid anchors, interpolating within intervals, and
clamping positions. The revised translation MVP derives a strictly monotonic
mapping from shared stable heading IDs; it needs no separately authored or
reviewed pair map. Crossing or reordered anchors reject that map;
the engine must not silently choose an LIS, drop moved anchors, or reorder the
document. Geometry is invalidated when fonts, images, diagrams, tabs, details,
or width changes alter layout. A state owner and sequence token prevent
programmatic scroll events from echoing back. The user should keep focus and
pane ownership; ordinary scrolling must not open hidden content or move focus.

An unmatched section is an ordinary content gap when the page and its surrounding
anchors are valid. If valid anchors bracket it, the reader may label the interval
approximate and interpolate through it. In a future manual-mapping feature, an explicit target that does not exist,
is duplicated, or crosses another explicit target is an invalid mapping; it
disables continuous synchronization for the pair rather than becoming an
ordinal fallback. A direct explicit jump can report the invalid target.

The evidence supports a focused proposal, not an implementation claim. The
upstream source investigation did not run the candidate comparison feature,
a server, a browser, accessibility checks, or an eight-language consumer. It also did not prove that every framework lacks
plugins or experimental comparison modes. Those limits are carried into the
proposal's acceptance matrix and keep the recommendation honest: first prove
normal Docs/Book reading with two panes, then decide whether richer output or
strict row comparison earns its maintenance cost.

## Phase-one scope revision {#phase-one-scope-revision}

Following the request to simplify on 2026-10-29, the companion proposal now
assumes existing translation siblings with matching heading IDs. Its only site
setting is `params.ui.compare: true`. Hugo supplies the existing translation
links; the browser chooses one target and displays two ordinary pages in
same-origin frames, with an on/off synchronization switch. The current language
is fixed and only the target needs a selector.

The broader identity discussion above remains research for possible version
comparison. It does not require phase-one compare sets, member IDs, manual
anchor maps, a CLI, new layouts, new outputs, or prebuilt language pairs.
Ordinary pages in frames are the recommended first implementation, not a
necessary step towards a content-only output. The existing host remains behind
the reader: two child documents plus that host means three documents, a cost
to measure before adding another rendering path.

## Source links {#source-links}

- [Hugo multilingual pages](https://gohugo.io/content-management/multilingual/), [`.AllTranslations`](https://gohugo.io/methods/page/alltranslations/), [`.Rotate`](https://gohugo.io/methods/page/rotate/), and [Hugo v0.168.0 source](https://github.com/gohugoio/hugo/blob/e27a6760c5547237f87d353aebe0580feadb20f4/hugolib/page.go#L455-L551).
- [Docusaurus heading IDs](https://docusaurus.io/docs/markdown-features/toc#heading-ids), [VitePress custom anchors](https://vitepress.dev/guide/markdown#custom-anchors), and [mike version metadata](https://github.com/jimporter/mike/blob/b01e03075315ebd2d39a93c390cf14b6a83f3d5e/README.md).
- [Read the Docs visual diff](https://docs.readthedocs.com/platform/stable/visual-diff.html), [RTD DOM diff source](https://github.com/readthedocs/addons/blob/d8f99069d9a8b9647f5bd68fdedb95ffa11e63ce/src/docdiff.js), and [VS Code Markdown diff](https://code.visualstudio.com/docs/languages/markdown#%5Fmarkdown-preview-in-diff-view).
- [Sefaria side-by-side reading](https://help.sefaria.org/hc/en-us/articles/18612972070684-How-to-View-Texts-Side-by-Side), [Joplin sync-scroll specification](https://joplinapp.org/help/dev/spec/sync%5Fscroll/), and [MDN iframe policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).
- [OINK v1.4.0 language targets](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/language-targets.html) and [OINK v1.4.0 content rendering](https://github.com/pgsty/oink/blob/v1.4.0/layouts/%5Fpartials/content/render.html).
