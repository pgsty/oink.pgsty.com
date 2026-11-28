---
title: Audio
linkTitle: Audio
description: Put a podcast episode, voice sample or recorded talk on a page with image syntax, as a titled player with its transcript beside it.
weight: 340
search_keywords: [Audio, mp3, m4a, ogg, wav, flac, podcast, voice sample, transcript, player]
---

Write an audio file the way you write an image, `![title](episode.mp3)`, and
it becomes a titled player. Use it for podcast episodes, voice samples,
pronunciation guides and recorded talks. There is no shortcode to learn and
nothing to configure. A small shared script gives the player the theme's
control row: play, the elapsed time, one progress bar, the duration, speed and
sound. The bar is a single track in three colors: played time in the page's
accent color, buffered time a deeper neutral and the rest a light one. The
script also pauses other audible players when you start a recording. With
JavaScript off, the browser's own controls remain.

## Shortest form {#minimal}

````markdown {title="Source"}
![Welcome to OINK](welcome-en.mp3)
````

![Welcome to OINK](welcome-en.mp3)

A recording has no picture, so the bracket text does the work alt text does
for an image: it is both the visible title and the player's accessible name
(linked via `aria-labelledby`). If you leave it empty, the build warns and the
file name becomes the title; Markdown inside the brackets is shown as plain
text, and any Markdown `"title"` after the URL is ignored. Do not wrap an audio
image inside a Markdown link (`[![…](episode.mp3)](…)`): the native player
already contains a fallback link, so wrapping it produces invalid nested `<a>`
markup.

The first six audio players on a page default to `preload="metadata"`, so the
duration appears without downloading the recording; from the seventh player
onward, the default switches to `preload="none"` to avoid a burst of metadata
requests on long sample pages. The count follows Hugo's render order: players
written directly in the page come first, then players inside shortcode bodies
such as tabs, includes and cards. You can override either default with
`{preload="none"}` or `{preload="metadata"}`; set `{preload="metadata"}`
explicitly on a player inside a shortcode that must show its duration.

This file is an 8-second, 50 KB MP3 stored beside the page in its bundle. Like
a block image, the player needs
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`, one of the
[site prerequisites](/docs/components/#prerequisites).

## Where audio comes from {#sources}

Audio files are looked up in the same order as images and video:

| Placement | How it is written | Recognized by |
| --- | --- | --- |
| Beside the page (a bundle) | `![…](welcome-en.mp3)` | Extension `mp3`, `m4a`, `aac`, `oga`, `ogg`, `opus`, `wav` or `flac`, in any letter case |
| Current section bundle | `![…](post/episode.mp3)` | The same extensions |
| Global resource `assets/…` | `![…](audio/episode.mp3)` | The same extensions |
| Static directory `static/…` | `![…](/audio/episode.mp3)` | The same extensions |
| Object storage or a CDN | `![…](https://cdn.example.com/episode-12.mp3)` | The same extensions |
{.wide}

Hugo defines no `audio/*` media type of its own. If your site declares one in
`mediaTypes`, a page or global resource of that type is audio whatever its
file name.

Query parameters and Media Fragments such as `#t=30,60` are preserved on both
local resources and remote URLs, exactly as written (percent-encoding
included), so you can cue an excerpt without cutting a separate file:

````markdown {title="Remote episode with time fragment"}
![Episode 12: Leaving Sass for plain CSS](https://cdn.example.com/podcast/episode-12.mp3#t=30,90)
{caption="OINK Radio · recorded November 2026" preload="none"}
````

A recording in a page bundle is committed to Git with the page, which suits
short samples like the two on this page. Upload a full-length episode to
object storage and write its HTTPS address instead, as described for
[large video files](/docs/components/video/#large-files). The theme does not
check that a static or remote file exists, so open the page and press play
once after you publish.

## Inline versus block {#inline-vs-block}

Only audio in a paragraph of its own becomes a player. Inside a sentence it is
an ordinary link to the file, with the bracket text as the link text:

````markdown {title="Source"}
Inside a sentence, ![the welcome recording](welcome-en.mp3) is a link to the file.
````

Inside a sentence, ![the welcome recording](welcome-en.mp3) is a link to the file.

Inline audio takes no attribute line.

## Captions and sample sets {#caption}

`caption` adds a line of plain text after the title, which wraps below it on a
narrow screen (and is linked to the player via `aria-describedby`). Audio
figures that follow each other directly sit closer together, so a set of
samples reads as one group, and starting one player automatically pauses any
other active player on the page:

````markdown {title="Source"}
![Welcome to OINK, in English](welcome-en.mp3)
{caption="The tagline read aloud"}

![Welcome to OINK, in Chinese](welcome-zh.mp3)
{caption="The same sentence in Simplified Chinese"}
````

![Welcome to OINK, in English](welcome-en.mp3)
{caption="The tagline read aloud"}

![Welcome to OINK, in Chinese](welcome-zh.mp3)
{caption="The same sentence in Simplified Chinese"}

The caption is not Markdown. Leave the duration out of it: the player already
shows one, and it cannot drift from the file the way typed text can. Add
`#id` to give the figure an anchor that a link can point to. If another audio
or video figure or a numbered figure on the page already uses that ID, the
build warns and the later of the two loses it. Headings and plain images are
not checked, so keep their IDs distinct yourself.

## Transcripts {#transcript}

Put the transcript, show notes or lyrics right after the player as ordinary
content. A folded `[!DETAILS]` callout placed directly after an audio figure
tightens the gap between them so the pair reads as one unit, while keeping a
long transcript out of the way until a reader wants it. Give each transcript a
distinct title so screen-reader and keyboard users can tell them apart:

````markdown {title="Source"}
![Voice sample 1 · English](welcome-en.mp3)

> [!DETAILS]- Transcript: Voice sample 1
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![Voice sample 2 · Chinese](welcome-zh.mp3)

> [!DETAILS]- Transcript: Voice sample 2
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。
````

![Voice sample 1 · English](welcome-en.mp3)

> [!DETAILS]- Transcript: Voice sample 1
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![Voice sample 2 · Chinese](welcome-zh.mp3)

> [!DETAILS]- Transcript: Voice sample 2
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。

A transcript is the text alternative WCAG 1.2.1 asks for prerecorded audio,
and it also serves anyone who cannot play sound where they are. Print and RSS
show folded callouts expanded, so the transcript is complete there too. See
[Callouts · DETAILS](/docs/components/callout/#details).

## Output {#outputs}

Paper and feeds cannot play sound, so static outputs replace the player with a
usable link:

- **Dedicated Print (`/_print/`) and browser printing** show the title, the
  caption, and the recording's full clickable URL on its own line in ink on
  paper, regardless of the screen color mode.
- **RSS** links the title directly to the recording's absolute URL, with the
  caption beside it.
- **Markdown and LLMS** keep your authored image line and attribute line as
  written, and a following transcript callout remains plain readable text.
- **Copying from the page** preserves the title, caption, start alignment and
  clickable recording URL in rich text.

## Parameter reference {#reference}

The attribute line `{…}` directly after a block audio file:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | plain text | — | Shown after the title and linked via `aria-describedby`; not parsed as Markdown |
| `#id` | identifier | — | The figure's anchor; one already used by another media figure or a numbered figure warns and drops |
| `preload` | `metadata` \| `none` | `metadata` (first 6), `none` (7th+) | Controls whether the browser fetches audio metadata before playback |
| `class` | class list | — | Added to the `<figure class="td-media td-media--audio">` for site CSS |
| `data-*` / `aria-*` | string | — | Passed through to the figure |
{.fields meta="type default"}

`num`, `poster`, `autoplay`, `track`, `width`, `height`, `link`, `command`,
`options` and any other key warn as unknown and are dropped; `style` warns as
unsafe. Hugo strips `on*` handlers before the theme sees them, so they are
dropped silently. A recording takes no figure number, because it is not a figure
in the Book sense.

## Limits {#limits}

- No cover art, chapters or waveform: the title and caption are the whole
  frame.
- Single-active playback: a player that becomes audible, by starting with
  sound or by being unmuted while it plays, pauses the other audible
  `<audio>` and `<video>` players on the page. Muted or silent players, such
  as autoplay loops, keep running. Opening a platform card pauses audible
  players; once playing, that cross-site player cannot be paused locally.
- The speed button cycles 1×, 1.25×, 1.5×, 2× and 0.75×. The volume bar opens
  beside the speaker button when you point at or focus it; touch screens use
  the device's own volume buttons.
- The control row looks the same in every browser and follows the preset and
  light or dark mode. Without JavaScript, the browser's native player and its
  own styling remain.
- Site single-key shortcuts yield while focus is in the player's controls.
- One source file per recording, with no fallback formats. MP3 plays in every
  current browser.
- No podcast feed: the RSS output carries no `<enclosure>`, so podcast
  distribution is up to the site.

## Related {#related}

- [Video](/docs/components/video/) — the same syntax for video files and video platforms
- [Callouts](/docs/components/callout/) — the folded `[!DETAILS]` block that holds a transcript
- [Images](/docs/components/image/) — the attribute line and image lookup order shared by media
