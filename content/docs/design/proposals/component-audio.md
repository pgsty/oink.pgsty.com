---
title: "Audio component"
linkTitle: Audio component
description: Audio through ordinary Markdown image syntax — a labeled native player for podcasts, voice samples, and recordings, with transcripts in a folded callout and shared single-active playback when multiple players appear on a page.
weight: 28
icon: fa-solid fa-headphones
search_keywords: [audio, mp3, podcast, voice sample, transcript, player, component]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] Implemented, awaiting release
> Implemented on the theme's `main` branch and documented in the
> [Audio guide](/docs/components/audio/). Not yet in a tagged release. The shared decisions
> are in the [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Implemented 2026-11-27 on `main`; awaiting release |
| Owner | OINK maintainers |
| Delivery stage | S2, with video files |
| Form | Native: a block Markdown image whose destination is an audio file |
| New public API | None beyond accepting audio destinations; attributes `caption`, `id`, and `preload` |
| Runtime | None for a single player; shared `js/chunks/media.js` when a page has 2+ `<audio>`/`<video>` players (single-active playback) |
| Affected surface | The media partial shared with Video, a stylesheet section, a new guide at `/docs/components/audio/` |

## Summary {#summary}

```markdown
![Episode 12: Leaving Sass for plain CSS](episode-12.mp3)
{caption="OINK Radio · 24 minutes · recorded November 2026"}

> [!DETAILS]- Transcript
> Welcome back. This week we removed the last Sass compiler …
```

An audio file renders as a figure: the bracket text as a visible title, the
browser's native `<audio controls>`, and an optional caption. The transcript,
show notes, or lyrics are ordinary content after it; a folded callout keeps
them out of the way in HTML and expanded in Print.

## Problem {#problem}

Podcast episodes, text-to-speech and voice-model samples, pronunciation guides,
music excerpts, and recorded talks need a player inside prose. Today
`![](episode.mp3)` warns and drops, and raw `<audio>` has no title, caption,
Print, or RSS form. A bare player tells the reader nothing about what it plays.

## Design principles {#principles}

1. **Same syntax and branch as video.** One media partial owns detection,
   lookup, and static outputs for both.
2. **The name is visible.** A video shows its picture; audio has none, so the
   bracket text doubles as the visible title and the player's accessible name.
3. **Native controls are the player.** Every supported browser provides play,
   seek, volume, and keyboard access; Chromium-based browsers also offer speed
   and download in the control menu.
4. **Compose, don't absorb.** A transcript is content, and OINK already has a
   folded container that prints expanded. The component does not grow a body.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- Local, bundle, global-asset, `static/`, and object-storage audio files.
- A visible, accessible title; an optional caption.
- Static Print, RSS, Markdown, and LLMS forms with a usable link.
- Zero JavaScript for a single player; shared `js/chunks/media.js` for single-active playback when a page has two or more players; zero configuration.

### Non-goals {#non-goals}

- An `audio` shortcode or a transcript body inside the component.
- Hand-typed metadata that can drift from the file: `duration`, `artist`.
- Codec fallbacks (`mp3=`, `ogg=`, `m4a=`).
- In the first stage: cover art, chapters, a custom speed control, waveforms.
- Podcast feeds or RSS `<enclosure>` elements; podcast distribution is a site
  concern.

## Proposed behavior {#design}

### Detection {#detection}

A block image is audio when its destination ends in `mp3`, `m4a`, `aac`,
`oga`, `ogg`, `opus`, `wav`, or `flac` in any letter case (a page or global
resource, a `static/` path, or an HTTPS URL), or is a resource whose Hugo
media type is `audio/*`. Hugo defines no `audio/*` type by default, so the
media type only matters when a site declares one. Resolved local resources
preserve query strings and fragments (such as Media Fragments `#t=30,60`) with
their percent-encoding as written. An inline
audio destination renders as a plain link.

### Attributes {#attributes}

| Attribute | Rule |
| --- | --- |
| `caption` | Plain text below the title, linked via `aria-describedby` |
| `id` | Validated like other figure IDs; an ID that another unnumbered audio or video figure or a numbered Book target already uses warns and is dropped from whichever comes second. Heading and plain image IDs are not compared |
| `preload` | `metadata` or `none`; defaults to `metadata` for the first 6 audio players on a page and `none` from the 7th onward |

`num`, `poster`, `autoplay`, `track`, `width`, `height`, `link`, `command`,
and `options` warn and are dropped. Book numbering is left out because
OINK's numbered kinds are figures, tables, equations, and examples; calling a
recording a figure would mislabel it. An empty bracket text warns and the file
name becomes the title.

### Rendering {#rendering}

```html
<figure class="td-media td-media--audio">
  <figcaption>
    <span class="td-media__title" id="td-audio-…-a0-title">Episode 12: Leaving Sass for plain CSS</span>
    <span class="td-fig-caption" id="td-audio-…-a0-caption">OINK Radio · recorded November 2026</span>
  </figcaption>
  <audio controls preload="metadata" src="…/episode-12.mp3"
    aria-labelledby="td-audio-…-a0-title" aria-describedby="td-audio-…-a0-caption">
    <a href="…/episode-12.mp3">Episode 12: Leaving Sass for plain CSS</a>
  </audio>
  <p class="td-media__url"><a href="…/episode-12.mp3">https://…/episode-12.mp3</a></p>
</figure>
```

Audio is always a figure (without `.td-figure`, so its header stays
start-aligned), because it always has a visible title. The player spans the
reading width; consecutive audio figures and an immediately following
`.td-callout--details` transcript use `:has()` positive margins so each
audio-transcript pair groups tighter than adjacent pairs: 8px between a
recording and its transcript, 16px between consecutive recordings, and the
ordinary media margins, 1.5rem above and 1.75rem below, around each group
(`:where(.td-media):not(.td-figure)`, one class of weight above Bootstrap's
`figure` reset). Presets style the
frame and title (the card takes `--td-code-radius` like callouts; Paper and Ink align its surface with adjacent callouts;
Terminal uses `--td-brand-line-strong` and `--td-ui-font-family`); the native
control keeps the browser's look, with `color-scheme` following light and dark
mode in Chromium-based browsers (Firefox and Safari keep fixed native bar
chrome).

`preload="metadata"` lets the browser show the duration without downloading
the file; switching the default to `preload="none"` from the seventh audio
player onward prevents connection bursts on long sample pages.

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML | As above; no runtime for one player, `js/chunks/media.js` for 2+ players |
| Print | Title, caption, and the file URL as a visible `.td-media__link` on screen and paper (paper-palette overrides in `@media print`) |
| Markdown / LLMS | The authored source; a following transcript callout stays readable text |
| RSS | Title as a direct link to the file (absolute URL) and the caption |
| Rich copy | Start-aligned figure preserving title, caption, and clickable URL link |

The callout hook already renders folded callouts as static, expanded blocks in
dedicated Print and RSS, and Markdown keeps their source. A transcript written
as `> [!DETAILS]-` is therefore complete in every static output without any
audio-specific rule.

### Large files {#large-files}

The [Video guidance](/docs/design/proposals/component-video/#large-files)
applies: prefer object storage for long recordings; page-bundle audio is
committed to Git.

## Trade-offs and alternatives {#alternatives}

| Option | Decision | Reason |
| --- | --- | --- |
| First-draft `{{</* audio */>}}` with `src`, `mp3`, `ogg`, `m4a`, `title`, `artist`, `cover`, `duration`, `chapters`, `caption`, `preload`, `loop`, `download`, `compact`, and a transcript body | Rejected | Codec fallbacks are obsolete, `duration` and `artist` are facts that drift from the file, `cover` and `compact` create two layouts, and the body duplicates a folded callout |
| A runtime for a speed toggle and chapters | Deferred | Native controls cover speed in Chromium-based browsers; chapters need WebVTT evidence before growing the UI. Single-active playback was promoted into `js/chunks/media.js` only when 2+ players exist on a page |
| Hidden bracket text, as for images | Rejected | A bare player is unlabeled for sighted readers |
| Numbering as a Book figure | Rejected | A recording is not a figure; a numbered audio kind would need its own Book index, which nothing requests |

Costs of the chosen form: no podcast-style card with cover art, and the player
looks slightly different in each browser. Both are acceptable for a first
stage whose job is to make audio publishable at all.

## Later candidates {#later}

Each needs its own evidence and adds to `js/chunks/media.js`, which video
already introduces:

- **Chapters**: from a WebVTT `chapters` track (the standard carrier) rather
  than a parameter mini-language.
- **Cover art**: `poster` on audio, if podcast pages ask for it.

## Compatibility {#compatibility}

Additive; today an audio destination warns and renders nothing.

## Implementation plan {#implementation}

Audio lands with video files in S2 and reuses the same lookup extraction, media
partial, and fixtures. Specific work:

1. Audio detection, the figure layout, and static outputs in
   `content/media.html`.
2. Fixtures: each source kind, an empty bracket text, an unsupported attribute,
   inline audio, consecutive samples, and a transcript callout in each output.
3. Owning checks: `check-media-primitives.py`, `check-output.py`,
   `check-output-security.py`, `check-goldens.py`, `check-stylesheets.py`,
   `tests/js/media.test.js`, `tests/js/rich-copy.test.js`, and
   `tests/browser/audio.spec.mjs`. No locale key is needed.
4. EN/ZH guide and cheatsheet row; contract update.

## Acceptance criteria {#acceptance}

- Single-audio pages load no runtime; pages with 2+ players load `js/chunks/media.js` for single-active playback.
- Each audio figure has a visible title and an accessible name via `aria-labelledby` (plus `aria-describedby` when captioned).
- Print, RSS, Markdown, and LLMS contain no `<audio>` element and keep a usable
  link (visible on screen and paper in Print; linked title in RSS).
- A following `> [!DETAILS]-` transcript is expanded in dedicated Print and pairs tightly with its player on screen.

## Open decisions {#open-decisions}

1. **Title placement.** Resolved: above the player, start-aligned.
2. **Single-active playback in S2.** Resolved: enabled via `js/chunks/media.js` only on pages with 2+ players (zero JS on single-audio pages).

## Decision log {#decision-log}

- **2026-11-27 (first draft).** `audio` shortcode with chapters, speed control,
  mutex runtime, cover, duration, and transcript body.
- **2026-11-27 (review).** Native image syntax with `caption` and `id`;
  transcripts composed from a folded callout; runtime features deferred.
- **2026-11-27 (implementation).** Implemented in the shared media partial and `assets/css/td/media.css`; no runtime and no locale key. Two invalid-input cases were added to `bin/check-media-primitives.py`.
- **2026-11-27 (review revision).** Addressed deep-review findings: dedicated Print now uses visible `.td-media__link`; `@media print` resets audio cards to paper-palette tokens in dark mode; removed `.td-figure` from audio and enforced start alignment; switched `<audio>` accessible naming to `aria-labelledby`/`aria-describedby` (with `render-block.html` ID rewriting); preserved query strings and `#t=` Media Fragments on local resources; replaced negative margins with `:has()` positive margins for consecutive cards and Audio+Transcript pairing; aligned Paper and Terminal frame/title styling; preserved audio URL and start alignment in `rich-copy.js`; added `preload` attribute with 6-player auto-threshold (`none` from 7th onward); added unnumbered duplicate `#id` detection and accurate `audio:` warning prefix; enabled single-active playback in `js/chunks/media.js` only when 2+ players exist on a page; added nested `<a>` guard in `check-output.py`, expanded `check-media-primitives.py`, JS unit tests, and `tests/browser/audio.spec.mjs`.
- **2026-11-27 (adversarial review fixes).** Restored the 24px/28px margins that `:where(.td-media)` had lost to Bootstrap's `figure { margin: 0 0 1rem }` (now `:where(.td-media):not(.td-figure)`), so the 8px/24px pairing holds; single-active playback now treats any muted or zero-volume player as silent and also reacts to `volumechange`, so unmuting a playing loop pauses other audio and an author's own muted loop is left alone; `book/register-target.html` checks unnumbered media IDs, making the duplicate-ID check two-way; local fragments keep their percent-encoding (`EscapedFragment`); `preload` warns only in HTML; the audio card takes `--td-code-radius` in every preset and Ink's callout surface. The browser suite asserts absolute spacing and uses real `play()`; `check_audio_matrix()` covers upper-case extensions, a site-defined `audio/*` media type, encoded fragments, Book-target ID clashes in both orders, and a subpath `baseURL`.
