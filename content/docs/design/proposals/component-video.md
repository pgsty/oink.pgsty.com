---
title: "Video component"
linkTitle: Video component
description: Video through ordinary Markdown image syntax — local or object-storage files, muted looping demos that replace GIFs, and privacy-first cards for YouTube, Bilibili, and Vimeo.
weight: 28
icon: fa-solid fa-film
search_keywords: [video, mp4, webm, gif replacement, youtube, bilibili, vimeo, embed, facade, subtitles, component]
design_kind: proposal
design_status: accepted
proposal_date: 2026-11-27
---

> [!NOTE] Accepted in OINK 1.7.0
> Shipped in OINK v1.7.0, documented in the [Video guide](/docs/components/video/),
> and governed by the [Components contract](/docs/design/components/#timeline-media-social-and-maps).
> Shared decisions are in the [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Accepted and shipped in OINK v1.7.0 (implemented 2026-11-27) |
| Owner | OINK maintainers |
| Delivery stages | S2 (files, autoplay), S4 (platform cards and players) |
| Form | Native: a block Markdown image whose destination is a video file or a recognized video-platform URL |
| New public API | Image attributes `poster`, `track`, `autoplay` for video; configuration `params.video_embeds` |
| Runtime | Shared `js/chunks/media.js` for file players and enabled platform cards |
| Affected surface | `render-image.html`, the shared resource lookup, a media partial, a stylesheet layer, the configuration schema, a new guide at `/docs/components/video/` |

## Summary {#summary}

Video uses the syntax authors already use for images:

```markdown
![Installing OINK in one command](install.mp4)
{caption="One-command setup" poster="install.webp" track="install.vtt"}

![Switching visual presets](presets.webm)
{autoplay=true caption="Paper, Slate, Ink, and Terminal"}

![OINK architecture talk](https://www.bilibili.com/video/BV1xx411c7mD?t=42)
{poster="talk.webp" caption="Conference talk, 2026"}
```

The image hook recognizes a video destination and hands it to a shared media
partial. A file becomes a native `<video>` with controls. `autoplay=true` turns
it into a muted, looping demo that plays only while visible and never under
reduced motion. A YouTube, Bilibili, or Vimeo URL becomes a static card that
links to the platform; when the site lists that platform in
`params.video_embeds`, clicking the card loads the platform's player in place.

## Problem {#problem}

- `![](demo.mp4)` warns and drops today, because the image resolver accepts
  only image resources.
- Authors fall back to raw `<video>` with no caption, numbering, Print, or RSS
  form, and to raw `<iframe>` players that load third-party scripts and cookies
  on page view, shift the layout, fail where the platform is blocked, and rot
  when videos disappear.
- Animated GIF demos are large and cannot be paused; the usual replacement is a
  hand-written `autoplay loop muted` video that ignores reduced motion.

Evidence from local Markdown under `~/www` and `~/pgsty` (2026-11-27): two
blogs embed the same Bilibili `<iframe>` directly; a travel post uses raw
`<video controls>`; repository READMEs in the same corpus use `autoplay loop
muted` videos whose URLs carry expiring signatures. No checkout uses Hugo's
built-in `youtube` or `vimeo` shortcode.

## Design principles {#principles}

1. **A video is a figure.** It has a source, an accessible name, an optional
   caption, and an optional Book number, exactly like an image. The image hook
   already owns all four, so video extends it instead of adding a shortcode.
2. **Precedent exists.** GitLab Flavored Markdown renders image syntax that
   points at a video or audio file as a player, and Obsidian embeds YouTube
   videos written with image syntax. OINK's own Draw.io component is a native
   image form.
3. **The URL is the identity.** A platform URL is what readers, feeds, and
   agents understand, and it carries the start time. The theme derives player
   URLs from it at build time; nothing is fetched.
4. **No third-party request without consent.** By default nothing leaves the
   page. With a site opt-in, the platform is contacted only after a reader
   clicks.
5. **Progressive enhancement.** Every form works without JavaScript; the runtime
   colors file playback progress, coordinates audible players, gates autoplay on visibility, and opens enabled embeds in place.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- Local, page-bundle, global-asset, `static/`, and object-storage (HTTPS)
  video files.
- Poster, one subtitle track, caption, Book numbering, and layout without
  shift when a size is known.
- A GIF replacement that is small, pausable, and respects reduced motion.
- YouTube, Bilibili, and Vimeo without third-party requests by default.
- Static, readable Print, RSS, Markdown, and LLMS forms.

### Non-goals {#non-goals}

- A `video` shortcode, or overriding Hugo's built-in `youtube` and `vimeo`.
- Codec fallbacks with several `<source>` elements; MP4 (H.264) plays
  everywhere OINK supports.
- Streaming (HLS/DASH), custom player chrome, playlists, chapters.
- Remote platform thumbnails, oEmbed, or any build-time request.
- Platforms beyond the three, or arbitrary iframe URLs.

## Proposed behavior {#design}

### Detection {#detection}

A block image is a video when its destination is one of:

| Destination | Recognized by |
| --- | --- |
| Page, branch-bundle, or global resource | Hugo media type `video/*` |
| `static/` path or HTTPS URL | Extension `mp4`, `m4v`, `webm`, `ogv`, or `mov` |
| Platform URL | A strict pattern below |

An inline image with a video destination renders as a plain link to the file or
watch page, with the bracket text as link text. Anything else keeps today's
image behavior.

### Attributes {#attributes}

| Attribute | Applies to | Rule |
| --- | --- | --- |
| `caption`, `num`, `id` | All video | The shared figure contract; `num` registers a Book `fig` target |
| `poster` | All video | Image path through the shared image resolver. A local raster also supplies `width`/`height` |
| `track` | Files | One WebVTT file through the shared lookup. `srclang` is the page language; the label is the language name |
| `autoplay` | Files | `true` or `false`; see below. Warns and is ignored for platform URLs |
| `width`, `height` | All video | Positive integers; intrinsic size or aspect hint, overriding the poster's |

`link`, `command`, and `options` warn and are dropped. The bracket text is the
accessible name. Without `width`/`height` or a local poster, the box reserves
16:9 until metadata loads.

### Files {#files}

```html
<figure class="td-figure td-media td-media--video">
  <video controls preload="metadata" playsinline src="…/install.mp4" poster="…/install.webp" width="1280" height="720" aria-label="Installing OINK in one command">
    <track kind="subtitles" src="…/install.vtt" srclang="en" label="English" default>
    <a href="…/install.mp4">Installing OINK in one command</a>
  </video>
  <figcaption><span class="td-fig-caption">One-command setup</span></figcaption>
</figure>
```

Unlike a block image, a video always renders inside a `<figure>`, with or
without `caption` or `num`.

`autoplay=true` emits `muted loop playsinline` and a `data-td-media-autoplay`
marker, but not the `autoplay` attribute. The runtime starts playback when at
least half of the video is visible, the page is visible, and the reader has not
asked for reduced motion; it pauses when the video leaves the viewport. Native
controls stay, so the motion can always be paused. Without JavaScript the
reader sees the poster or first frame and plays it by hand.

### Platform URLs {#platforms}

| Platform | Accepted URLs | Derived player |
| --- | --- | --- |
| YouTube | `youtube.com/watch?v=<id>`, `youtu.be/<id>`, `youtube.com/shorts/<id>` with an 11-character ID; `t` or `start` | `https://www.youtube-nocookie.com/embed/<id>?start=…&autoplay=1` |
| Bilibili | `bilibili.com/video/BV<id>` or `/video/av<number>`; `p` and `t` | `https://player.bilibili.com/player.html?bvid=…&p=…&t=…&autoplay=1&danmaku=0` |
| Vimeo | `vimeo.com/<number>`, optionally `/<hash>` for unlisted videos | `https://player.vimeo.com/video/<number>?h=…&dnt=1&autoplay=1` |

IDs are validated against these patterns before any URL is built; author text
never enters a player URL. A `b23.tv/BV…` short link resolves to the player;
only an opaque short link that cannot be resolved offline, such as
`b23.tv/abc`, renders the card without a player and warns with the full-URL
form.

Default output is a card: the poster or a neutral surface, a play glyph, the
bracket text, and the platform name, all inside one link to the canonical watch
URL. No iframe, script, or thumbnail request.

With the platform listed in `params.video_embeds`, the card also carries the
derived player URL. On click, the runtime replaces the card with an iframe that
has the bracket text as `title`,
`allow="autoplay; picture-in-picture; fullscreen"`,
`sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`,
`allowfullscreen`, and `referrerpolicy="strict-origin-when-cross-origin"`, and
moves focus into it. Without JavaScript the link still opens the platform.

### Configuration {#configuration}

```yaml
params:
  # Platforms whose player may load in place after a reader clicks.
  # Any of: youtube, bilibili, vimeo. Empty: cards only link out.
  video_embeds: []
```

A non-list warns and keeps cards only; unknown names warn and are ignored. A
list (rather than a boolean) lets a site enable Bilibili without YouTube when
part of its audience cannot reach YouTube. Sites with a Content Security Policy
add the enabled player hosts to `frame-src`; the guide lists them.

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML | File players and enabled platform cards load the shared `media.js` |
| Print | Poster when present, caption and Book label, and the file or watch URL as visible text; no `<video>` or `<iframe>` |
| Markdown / LLMS | The authored source |
| RSS | Poster (absolute URL) when present and a link with the bracket text; no `<video>` or `<iframe>` |

Ordinary browser printing of HTML shows the poster or current frame; print
rules reveal the URL beneath it.

### Large files {#large-files}

A video in a page bundle is committed to Git. The guide recommends an
object-storage or CDN URL for anything beyond a few megabytes, in line with the
repository rules for binary assets. The theme does not measure file sizes at
build time; a size report belongs to `oink-cli` checks.

## Trade-offs and alternatives {#alternatives}

| Option | Decision | Reason |
| --- | --- | --- |
| First-draft `{{</* video */>}}` with `src`, `youtube`, `bilibili`, `vimeo`, `webm`, `mp4`, `controls`, `muted`, `loop`, `gif`, `ratio`, and more | Rejected | About twenty parameters restate what image syntax and figure attributes already express, and a shortcode would be a second way to place video |
| Overriding Hugo's `youtube` and `vimeo` | Rejected | Hugo's `vimeo` can fetch from Vimeo at build time (its simple mode); each override widens divergence from Hugo (see the [X parse finding](/docs/design/proposals/component-social/#hugo-x)); a URL is clearer than an ID |
| `gif=true` that removes controls | Renamed and changed | `autoplay` describes the behavior. Removing controls fails WCAG 2.2.2 (pause, stop, hide) |
| The `autoplay` HTML attribute | Rejected | It ignores reduced motion and keeps playing off-screen; the runtime gate is the accessible form |
| Remote platform thumbnails | Rejected | A third-party request on every view |
| A boolean `params.video_embeds` | Rejected | Reachability differs by platform and region |

Costs of the chosen form:

- Image syntax for video is a convention, not CommonMark semantics. Renderers
  other than GitLab show a broken image; the Markdown output keeps the URL, so
  agents still understand it.
- Discoverability shifts from a shortcode's parameter list to the image guide;
  the cheatsheet gets its own Video row.
- `render-image.html` gains a dispatch. The media branch lives in its own
  partial so the image path stays readable and its goldens unchanged.

## Compatibility {#compatibility}

Additive. A video destination produces a warning and no output today, so no
page depends on that behavior. Image output must stay byte-identical, which the
existing goldens verify. `params.video_embeds` is a new key.

## Implementation plan {#implementation}

1. Extract the lookup from `content/image-resolve.html` into a shared partial;
   image goldens must not change.
2. Add `content/media.html` (detection, attributes, outputs) and dispatch to it
   from `render-image.html` before image-only work.
3. Add `assets/js/media.js` as the stable chunk `js/chunks/media.js`, selected
   from a Page Store flag in `scripts.html`; unit tests under `tests/js/` with
   mocked `IntersectionObserver` and `matchMedia`.
4. S4: platform patterns, `params.video_embeds` in `hugo.yaml`,
   `bin/check-params.py`, and the generated configuration schema.
5. Locale keys in all 32 files: `ui_video_play` ("Play video") and
   `ui_video_open` ("Open on the video site"), checked by
   `bin/check-i18n.py`.
6. Fixtures: files from each source kind, poster with and without size,
   subtitles, autoplay, inline video, each platform pattern, invalid IDs, short
   links, and each output. Owning checks: `check-media-primitives.py` (the
   image hook and shared resolution), `check-runtime-isolation.py` (the chunk
   flag), `check-output.py`, `check-output-security.py`, `check-goldens.py`,
   `check-stylesheets.py`, `check-params.py`, `check-i18n.py`, `node --test`.
7. Browser review on this site: keyboard, focus after the player loads, reduced
   motion, presets, mobile, and print.

## Acceptance criteria {#acceptance}

- Pages with only plain platform links omit the media runtime.
- With `video_embeds: []`, the HTML contains no player host URL.
- Autoplay never starts under `prefers-reduced-motion: reduce` and pauses
  off-screen.
- Print, RSS, Markdown, and LLMS contain no `<video>`, `<iframe>`, or runtime
  marker.
- Existing image goldens are byte-identical.

## Open decisions {#open-decisions}

1. **Uncaptioned video (resolved).** The shipped implementation always wraps
   videos in `<figure class="td-media">` for a uniform frame and consistent
   print and typeset-copy output.
2. **Subtitles.** Recommended: one `track` per page; each language page names
   its own file. A list form is deferred.
3. **Bilibili comments.** Recommended: `danmaku=0` with no option in S4.
4. **Unknown size.** Recommended: reserve 16:9; vertical videos set
   `width`/`height` or a poster.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** `video` shortcode with source modes, about
  twenty parameters, `gif=true`, and opt-in facades.
- **2026-11-27 (review).** Moved to native image syntax with three media
  attributes, an accessible autoplay gate, platform URLs as identity, and a
  per-platform `params.video_embeds` list.
- **2026-11-27 (implementation).** Implemented in `content/media-detect.html`, `content/media.html`, `content/video-embeds.html`, `assets/js/media.js` and `assets/css/td/media.css`, with the lookup extracted into `content/resource-lookup.html`. Differences from this draft: the configuration key is the flat list `params.video_embeds` (the parameter contract flattens single-key maps); a video without caption or number keeps a `td-media` wrapper without a figcaption; Print and RSS name the video beside its URL; the locale keys are `ui_video_play` and `ui_video_open`. Both network settings are validated on every page. Eight invalid-input cases were added to `bin/check-media-primitives.py`, and `tests/js/media.test.js` covers the runtime.
- **2026-11-27 (review hardening).** Fixed decimal parsing for leading-zero timestamps (`08s`, `010`), expanded platform URL parsing (`youtube-nocookie.com`, `music.youtube.com`, `player.vimeo.com`, Vimeo `?h=` and `#t=`, uppercase `AV`, `b23.tv/BV…`, trailing slashes, and `9:16` default ratio for YouTube Shorts), decoupled poster image dimensions from paired `width`/`height` aspect ratios, replaced `setTimeout(0)` autoplay event tracking with a FIFO expected-event queue, added iframe `sandbox` and tightened `allow` and the runtime player-URL regex, excluded `.td-media-card__poster` from Draw.io detection, fixed dark-mode play-button contrast, poster scrim contrast, narrow-screen card grid overlap, portrait `80vh` symmetry, forced-colors styling, RTL play-icon alignment, and Print/RSS watch URLs (including browser print after iframe replacement). Added zero-binary media-type and video matrix checks in `bin/check-media-primitives.py`, `video_embeds` item enum generation in `bin/generate-config-schema.py`, and `tests/browser/video.spec.mjs`.
- **2026-11-27 (acceptance review fixes).** Cards carry their ratio as `--td-media-ratio` and cap their width at `min(100%, 80vh × ratio)` (card and player), because WebKit does not narrow a box whose `aspect-ratio` height `max-block-size` clamps; where container units exist the ratio is a minimum height measured from the figure, because WebKit also keeps an `aspect-ratio` box at its ratio height and clipped wrapped titles. Browser print gives poster-less card text the paper ink in dark mode. Draw.io skips only images inside `a.td-media-card` again, leaving other linked diagrams editable. Bilibili's embed-code `src`, `player.bilibili.com/player.html?bvid=…|aid=…`, is recognized instead of rendering as a remote image. Covered by the video matrix and a stylesheet contract in `bin/check-media-primitives.py`, `tests/js/drawio.test.js` and `tests/browser/video.spec.mjs`.
