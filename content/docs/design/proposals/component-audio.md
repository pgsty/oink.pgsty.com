---
title: "Audio component"
linkTitle: Audio component
description: Audio through ordinary Markdown image syntax — a labeled native player for podcasts, voice samples, and recordings, with transcripts in a folded callout and no runtime.
weight: 28
icon: fa-solid fa-headphones
search_keywords: [audio, mp3, podcast, voice sample, transcript, player, component]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] Implemented, awaiting acceptance
> Implemented on the theme's main branch working tree and documented in the
> [Audio guide](/docs/components/audio/). Not committed or released. The shared decisions
> are in the [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Implemented 2026-11-27; uncommitted; awaiting acceptance |
| Owner | OINK maintainers |
| Delivery stage | S2, with video files |
| Form | Native: a block Markdown image whose destination is an audio file |
| New public API | None beyond accepting audio destinations; attributes `caption` and `id` |
| Runtime | None |
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
- Zero JavaScript and zero configuration.

### Non-goals {#non-goals}

- An `audio` shortcode or a transcript body inside the component.
- Hand-typed metadata that can drift from the file: `duration`, `artist`.
- Codec fallbacks (`mp3=`, `ogg=`, `m4a=`).
- In the first stage: cover art, chapters, single-active playback, a custom
  speed control, waveforms.
- Podcast feeds or RSS `<enclosure>` elements; podcast distribution is a site
  concern.

## Proposed behavior {#design}

### Detection {#detection}

A block image is audio when its destination is a resource with Hugo media type
`audio/*`, or a `static/` path or HTTPS URL ending in `mp3`, `m4a`, `aac`,
`oga`, `ogg`, `opus`, `wav`, or `flac`. An inline audio destination renders as
a plain link.

### Attributes {#attributes}

| Attribute | Rule |
| --- | --- |
| `caption` | Plain text below the title |
| `id` | Validated like other figure IDs |

`num`, `poster`, `autoplay`, `track`, `width`, `height`, `link`, `command`,
and `options` warn and are dropped. Book numbering is left out because
OINK's numbered kinds are figures, tables, equations, and examples; calling a
recording a figure would mislabel it. An empty bracket text warns and the file
name becomes the title.

### Rendering {#rendering}

```html
<figure class="td-media td-media--audio">
  <figcaption>
    <span class="td-media__title">Episode 12: Leaving Sass for plain CSS</span>
    <span class="td-fig-caption">OINK Radio · 24 minutes · recorded November 2026</span>
  </figcaption>
  <audio controls preload="metadata" src="…/episode-12.mp3" aria-label="Episode 12: Leaving Sass for plain CSS">
    <a href="…/episode-12.mp3">Episode 12: Leaving Sass for plain CSS</a>
  </audio>
</figure>
```

Audio is always a figure, because it always has a visible title. The player
spans the reading width; consecutive audio figures (a set of voice samples)
stack compactly. Presets style the frame and title; the native control keeps
the browser's look, with `color-scheme` following light and dark mode.

`preload="metadata"` lets the browser show the duration without downloading
the file.

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML | As above; no runtime |
| Print | Title, caption, and the file URL as visible text |
| Markdown / LLMS | The authored source; a following transcript callout stays readable text |
| RSS | Title as a link to the file (absolute URL) and the caption |

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
| A runtime for single-active playback, a speed toggle, and chapters | Deferred | Native controls cover speed in Chromium-based browsers; a theme toggle would serve the rest. Single-active playback and chapters are real for sample comparisons and long episodes, but each must show demand before every audio page carries a script |
| Hidden bracket text, as for images | Rejected | A bare player is unlabeled for sighted readers |
| Numbering as a Book figure | Rejected | A recording is not a figure; a numbered audio kind would need its own Book index, which nothing requests |

Costs of the chosen form: no podcast-style card with cover art, and the player
looks slightly different in each browser. Both are acceptable for a first
stage whose job is to make audio publishable at all.

## Later candidates {#later}

Each needs its own evidence and adds to `js/chunks/media.js`, which video
already introduces:

- **Single-active playback**: starting one player pauses the others on the
  page, for side-by-side sample comparisons.
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
   `check-output-security.py`, `check-goldens.py`, `check-stylesheets.py`.
   No locale key is needed.
4. EN/ZH guide and cheatsheet row; contract update.

## Acceptance criteria {#acceptance}

- Audio pages load no new runtime.
- Each audio figure has a visible title and an accessible name.
- Print, RSS, Markdown, and LLMS contain no `<audio>` element and keep a usable
  link.
- A following `> [!DETAILS]-` transcript is expanded in dedicated Print.

## Open decisions {#open-decisions}

1. **Title placement.** Recommended: above the player. Alternative: beside it on
   wide screens for compact sample lists.
2. **Single-active playback in S2.** Recommended: no; revisit with the first
   page that compares samples.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** `audio` shortcode with chapters, speed control,
  mutex runtime, cover, duration, and transcript body.
- **2026-11-27 (review).** Native image syntax with `caption` and `id`;
  transcripts composed from a folded callout; runtime features deferred.
- **2026-11-27 (implementation).** Implemented in the shared media partial and `assets/css/td/media.css`; no runtime and no locale key. Two invalid-input cases were added to `bin/check-media-primitives.py`.
