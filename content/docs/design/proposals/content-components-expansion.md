---
title: "Content components expansion: review and shared design"
linkTitle: Content components expansion
description: The reviewed plan for six new content components (Timeline, Update, offline X, Video, Audio, and Map), the shared decisions behind them, and their delivery order.
weight: 26
icon: fa-solid fa-puzzle-piece
search_keywords: [components, timeline, update, changelog, x, tweet, social post, video, audio, map, openstreetmap, leaflet, review]
design_kind: proposal
design_status: accepted
proposal_date: 2026-11-27
---

> [!NOTE] Accepted in OINK 1.7.0
> All six components ship in OINK v1.7.0, are documented in the
> [component guides](/docs/components/), and are governed by the
> [Components contract](/docs/design/components/#timeline-media-social-and-maps).
> This proposal is preserved as design rationale.

| Record | Value |
| --- | --- |
| Status | Accepted and shipped in OINK v1.7.0 (implemented 2026-11-27) |
| Owner | OINK maintainers |
| Scope | OINK theme; this documentation site; one optional `oink-cli` helper (separate proposal) |
| Affected contracts | [Components](/docs/design/components/), [Architecture](/docs/design/architecture/), the [component guides](/docs/components/), configuration reference |
| Evidence snapshot | Theme `9738dcf`, site `b749ba4`, Hugo 0.170.1, local consumer checkouts under `~/www` and `~/pgsty` |

## The six proposals {#proposals}

| Component | Final form | New public API | Runtime | Proposal |
| --- | --- | --- | --- | --- |
| Timeline | Definition list + `{.timeline}` | None (author marker) | None | [Timeline component](/docs/design/proposals/component-timeline/) |
| Update | Heading + `{.update date="…" tags="…"}` | Two heading attributes | None | [Update component](/docs/design/proposals/component-update/) |
| Social posts | `{{</* social */>}}…{{</* /social */>}}` | One shortcode | None | [Social post component](/docs/design/proposals/component-social/) |
| Video | `![name](demo.mp4)` and platform URLs | Media attributes on the image hook; `params.video_embeds` | Shared `media.js` for file players and enabled embeds | [Video component](/docs/design/proposals/component-video/) |
| Audio | `![name](episode.mp3)` | Media attributes on the image hook | Shared `media.js` for file players | [Audio component](/docs/design/proposals/component-audio/) |
| Map | `map` data fence | One fence; `params.map` | Vendored Leaflet, only when enabled | [Map component](/docs/design/proposals/component-map/) |

The documented component catalog grows from 21 to 27. The shortcode count grows
from 29 to 30 (`social`). The image and heading render hooks gain branches, and one
fence hook (`map`) is added.

## Review verdict {#verdict}

All six components close real gaps, and the first draft understood OINK's
infrastructure well. Its weakness was shape: it gave nearly every component a
new shortcode, a long parameter list, and a runtime. Taken together that was
7 new shortcodes, about a hundred parameters, fields, and configuration keys,
3 new runtime chunks, and 16 locale keys. The final design has one new
shortcode, about 35 parameters and keys (most of them existing figure and fence
attributes), one small chunk plus one vendored engine, and six locale keys.
The accepted [Markdown-first decision](/docs/design/decisions/authoring/#consequences)
requires a proposal to show first why Markdown plus an existing hook is
insufficient. Applied to each component, that test removes most of the surface:

| Draft element | Final decision | Main reason |
| --- | --- | --- |
| `timeline` + `event` shortcodes, `.timeline` list marker | Definition list + `{.timeline}` only | A timeline is marker/event pairs; Markdown already has pairs |
| `{{%/* update */%}}` with seven parameters and a sticky rail | `.update` heading marker with `date` and `tags` | A heading already carries outline, anchor, search, and Print IDs; the rail duplicates the TOC |
| `x` with metrics, verified badges, image lists, quote parameters, data files, and an author registry | `social` with six parameters and a Markdown body | Images, galleries, and quoted posts compose from existing syntax; snapshots rot |
| `video` shortcode with about twenty parameters | Image syntax for video files and platform URLs | The image hook already resolves, captions, numbers, and degrades media; it drops `.mp4` today |
| `audio` shortcode with chapters, speed, mutex, and transcript body | Image syntax; transcripts use a folded callout | Native controls cover playback; single-active playback ships in shared `media.js` for 2+ players, while chapters wait for evidence |
| `map` fence plus single-point shortcode, named styles, CARTO default | One fence; no default tile provider | One form; the theme must not choose a commercial tile service for every site |
| New `file-resolve.html` copying the image lookup order | Extract the existing lookup and share it | One lookup order, not two |

The review also found two facts the draft could not have known without probes:

- Overriding Hugo's built-in `x` with a shortcode that takes a body turns the
  legacy unclosed form `{{</* x user="…" id="…" */>}}` into a build failure
  (`shortcode "x" must be closed or self-closed`, Hugo 0.170.1). A template
  warning cannot run first. The owner then renamed the component `social`,
  which leaves Hugo's `x` untouched. See [Social posts](/docs/design/proposals/component-social/#hugo-x).
- `Image.Exif` was removed in Hugo 0.155. `Image.Meta` returns GPS coordinates
  only when the site's `imaging.meta.fields` includes GPS, which Hugo's
  defaults exclude. Photo auto-pinning therefore needs a site-level opt-in. See
  [Map](/docs/design/proposals/component-map/#exif).

## Evidence {#evidence}

| Probe or survey | Result | Used by |
| --- | --- | --- |
| Definition list followed by `{.timeline}` | Goldmark emits `<dl class="timeline">`; a definition keeps several paragraphs | Timeline |
| Heading with `{.update date="2026-11-23" tags="Breaking, Performance"}` | `render-heading` receives `class`, `date`, and `tags`; the TOC shows only the heading text | Update |
| `![Install demo](demo.mp4)` and `![Episode](ep.mp3)` in a page bundle | The image hook receives `IsBlock`, attributes, and resources typed `video/mp4` and `audio/mpeg` | Video, Audio |
| Current `content/image-resolve.html` | A non-image resource warns and is dropped | Video, Audio |
| Percent shortcode that emits a Markdown heading | The heading enters `.TableOfContents` | Update alternatives |
| Built-in `x` overridden by a body-taking template | Unclosed legacy calls fail to parse | Social posts (the rename) |
| `Image.Meta` on a JPEG with GPS EXIF | Coordinates only after enabling GPS fields in `imaging.meta.fields` | Map |
| Leaflet on npm, 2026-11-27 | `latest` 1.9.4; 2.0 in beta (beta.5, 2026-11-19) | Map |
| Consumer Markdown under `~/www` and `~/pgsty` | No use of Hugo's `x`, `tweet`, `youtube`, or `vimeo` shortcodes; raw Bilibili `<iframe>` embeds on two blogs; raw `<video>`; `autoplay loop muted` GIF replacements pointing at expiring signed URLs | Social posts, Video |

The probes ran against a minimal Hugo site with OINK's required Goldmark
settings. They confirm Hugo behavior, not OINK output. Each implementation stage
repeats them as fixtures.

## Shared design rules {#shared-rules}

### Authoring entry points {#entry-points}

Every component uses an entry point that already exists or one new, narrowly
justified one:

| Entry point | Today | Gains |
| --- | --- | --- |
| Goldmark block attributes on lists | `.steps`, `.cards`, `.filetree` | `.timeline` on a definition list |
| Heading render hook | `id`, class pass-through | `.update` with `date` and `tags` |
| Image render hook | Images, figures, Book numbering, Zoom, Draw.io candidates | Video files, audio files, recognized video platform URLs |
| Data fence | `gallery`, `filetree`, `echarts`, … | `map` |
| Angle shortcode with a Markdown body | `card`, `tab`, `field`, … | `social` |

No component adds a percent-delimited shortcode. `steps` remains the only one.

### Resource lookup {#resource-lookup}

Video, audio, posters, subtitle tracks, post avatars, and map thumbnails all need
the lookup that `content/image-resolve.html` performs today: page bundle,
branch bundle, global `assets/`, then `static/` or an explicit HTTP(S) URL. The
implementation extracts that lookup into one partial that both the image
resolver and a media resolver call. The image resolver keeps its image-only
rules (processing, alt metadata, byline). Image output must stay byte-identical
across the refactor; the existing goldens prove it.

Remote URLs are never fetched at build time. A remote media URL is the author's
explicit choice, as it is for images today.

### Network policy {#network-policy}

The [architecture contract](/docs/design/architecture/#configuration-and-diagnostics)
requires network-capable features to be explicitly and completely configured.
Two of the six components have such features:

| Feature | Default | Enabled by | Incomplete configuration |
| --- | --- | --- | --- |
| Video platform players | Static link card; no third-party request | `params.video_embeds: [youtube, bilibili, vimeo]` (any subset) | Unknown names warn and are ignored |
| Map tiles | Place list with coordinate links | `params.map.enable` plus `tiles` and `attribution` | Warns and stays off, as Draw.io does without a server |

Neither feature has a theme-chosen default provider. Timeline, Update, Social posts, and
local or object-storage media need no configuration.

### Runtime budget {#runtime-budget}

| Component | HTML runtime | Loaded when |
| --- | --- | --- |
| Timeline, Update, Social posts | None | — |
| Video or Audio | `js/chunks/media.js` | Page has a file player or an enabled platform card |
| Map | `content-components.js` adapter plus vendored Leaflet and its CSS | `params.map` is complete and the page has a map |

Markdown, Print, and RSS set none of these flags.

### Styles, accessibility, and locales {#styles-and-locales}

New rules live in plain CSS layer files under `assets/css/td/`, listed in
`layouts/_partials/css/layers.html` before `rtl`, the presets, `accessibility`,
and `print`. They use `--td-*` tokens, logical properties, and preset geometry
(flat Ink and Terminal surfaces), and cover forced colors, reduced motion,
narrow screens, long tokens, and print. Author markers (`.timeline`, `.update`)
stay unprefixed; generated classes use `td-`.

The six components together add six locale keys (Social posts: one; Video:
two; Map: three, with its zoom buttons reusing the diagram keys), in all 32 locale
files with native translations, checked by `bin/check-i18n.py`.

## Answers to the first draft's questions {#draft-questions}

| Question | Answer |
| --- | --- |
| Default tiles once `params.map.enable` is true | None. As with Draw.io, maps stay off until `tiles` and `attribution` are set ([Map](/docs/design/proposals/component-map/#configuration)) |
| TOC text when an update has both a label and a title | The heading text; there is no separate label or title ([Update](/docs/design/proposals/component-update/#authoring)) |
| When to extract GPS coordinates from photos | A later stage after explicit coordinates, as a site `imaging.meta` opt-in ([Map](/docs/design/proposals/component-map/#exif)) |
| Bilibili comment overlay | Off (`danmaku=0`), with no option in S4 ([Video](/docs/design/proposals/component-video/#platforms)) |
| Book numbering for video and map | Video accepts `num` natively as a figure; a map is wrapped in `fig`, like other diagram fences; audio is not numbered ([Audio](/docs/design/proposals/component-audio/#attributes)) |

## Delivery order {#delivery}

| Stage | Scope | Why here |
| --- | --- | --- |
| S1 | Timeline and Update | CSS plus one heading-hook branch; no runtime, no configuration |
| S2 | Video and Audio files, shared lookup extraction, `media.js` for autoplay | Highest observed use; replaces raw `<video>` and GIFs |
| S3 | Social posts | One shortcode, one locale key |
| S4 | Video platform cards and opt-in players (`params.video_embeds`) | Third-party iframes; needs CSP and privacy review |
| S5 | Map: vendored Leaflet, `params.map`, the fence | The only new vendored engine |
| Later | Map photo pins from GPS metadata; audio chapters; `oink fetch social` | Each waits for its own evidence |

Each stage ships with fixtures under `tests/site/`, intentional golden updates,
EN/ZH guides under `/docs/components/`, contract updates, and browser review on
this site. Stages are independent; a later one can be dropped without
reworking an earlier one.

## Open decisions {#open-decisions}

1. **Acceptance and release (resolved).** All six components ship in OINK v1.7.0;
   normative behavior now lives in the [Components contract](/docs/design/components/#timeline-media-social-and-maps).
2. **Demo media in Git.** The guides' video and audio demos add about 600 KB
   of binary files to this site's repository. Keep them in the page bundles,
   or move them to object storage and reference them by HTTPS URL, which the
   media form supports.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** Requirements and architecture for six
  components in one page: `timeline`/`event`, `{{%/* update */%}}`, offline `x`
  with a `platform` enum, `audio`, `video`, and opt-in OpenStreetMap `map`.
- **2026-11-27 (review).** Split into six proposals plus this overview. Reduced
  the public surface to one shortcode (`x`), one fence (`map`), and branches in
  the image and heading hooks. Recorded the probe evidence above, the `x` parse
  finding, the EXIF configuration requirement, and the roadmap conflict.
- **2026-11-27 (owner).** Renamed the offline post component `social` so it no
  longer conflicts with Hugo's `x`. Removed the theme roadmap's "add no new
  component family" sentence, which had never been an owner decision; the
  roadmap conflict section of this page went with it.
- **2026-11-27 (implementation and acceptance).** All six components were
  implemented on `main` with fixtures, goldens, invalid-input cases, and
  runtime unit tests, accepted for OINK v1.7.0, and documented with guides and
  demos on this site. Deviations from the drafts are recorded in each
  component's decision log.
