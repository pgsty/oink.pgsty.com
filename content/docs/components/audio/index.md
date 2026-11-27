---
title: Audio
linkTitle: Audio
description: Put a podcast episode, voice sample or recorded talk on a page with image syntax, as a titled native player with its transcript beside it.
weight: 174
search_keywords: [Audio, mp3, m4a, ogg, wav, flac, podcast, voice sample, transcript, player]
---

Write an audio file the way you write an image, `![title](episode.mp3)`, and
it becomes a titled figure with the browser's own audio player. Use it for
podcast episodes, voice samples, pronunciation guides and recorded talks. There
is no shortcode to learn and nothing to configure, and the page loads no
script for it, because the native `<audio>` element already provides play,
seek, volume and keyboard control.

## Shortest form {#minimal}

````markdown {title="Source"}
![Welcome to OINK](welcome-en.mp3)
````

![Welcome to OINK](welcome-en.mp3)

A recording has no picture, so the bracket text does the work alt text does
for an image: it is both the visible title and the player's accessible name.
If you leave it empty, the build warns and the file name becomes the title;
Markdown inside the brackets is shown as plain text. The player loads only the
file's metadata until the reader presses play, so the duration appears without
downloading the whole recording. Chromium-based browsers also put a playback
speed control in the player's menu.

This file is an 8-second, 50 KB MP3 stored beside the page in its bundle. Like
a block image, the player needs
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`, one of the
[site prerequisites](/docs/components/#prerequisites).

## Where audio comes from {#sources}

Audio files are looked up in the same order as images and video:

| Placement | How it is written | Recognized by |
| --- | --- | --- |
| Beside the page (a bundle) | `![…](welcome-en.mp3)` | Hugo media type `audio/*` |
| Current section bundle | `![…](post/episode.mp3)` | Hugo media type `audio/*` |
| Global resource `assets/…` | `![…](audio/episode.mp3)` | Hugo media type `audio/*` |
| Static directory `static/…` | `![…](/audio/episode.mp3)` | Extension `mp3`, `m4a`, `aac`, `oga`, `ogg`, `opus`, `wav` or `flac` |
| Object storage or a CDN | `![…](https://cdn.example.com/episode-12.mp3)` | The same extensions |

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
narrow screen. Audio figures that follow each other directly sit closer
together, so a set of samples reads as one group:

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
`#id` to give the figure an anchor that a link can point to.

## Transcripts {#transcript}

Put the transcript, show notes or lyrics after the player as ordinary
content. A folded callout keeps a long transcript out of the way until a
reader wants it:

````markdown {title="Source"}
![Voice sample 1 · English](welcome-en.mp3)

> [!DETAILS]- Transcript
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![Voice sample 2 · Chinese](welcome-zh.mp3)

> [!DETAILS]- Transcript
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。
````

![Voice sample 1 · English](welcome-en.mp3)

> [!DETAILS]- Transcript
> OINK is a local-first Hugo theme. Every component reads as Markdown,
> prints on paper, and needs nothing but the Hugo binary.

![Voice sample 2 · Chinese](welcome-zh.mp3)

> [!DETAILS]- Transcript
> OINK 是一个本地优先的 Hugo 主题。每个组件都能当作 Markdown 阅读，可以打印成纸面，而且只需要 Hugo 这一个程序。

A transcript is the text alternative WCAG 1.2.1 asks for prerecorded audio,
and it also serves anyone who cannot play sound where they are. Print and RSS
show folded callouts expanded, so the transcript is complete there too. See
[Callouts · DETAILS](/docs/components/callout/#details).

## Output {#outputs}

Paper and feeds cannot play sound, so print and RSS show the title, the
caption and the file's full address as a link instead of a player, and so does
a browser printing the HTML page. The page's Markdown output keeps your image
line and attribute line as written.

## Parameter reference {#reference}

The attribute line `{…}` directly after a block audio file:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | plain text | — | Shown after the title; not parsed as Markdown |
| `#id` | identifier | — | The figure's anchor |
| `class` | class list | — | Added to the `<figure class="td-media td-media--audio">` for site CSS |
| `data-*` / `aria-*` | string | — | Passed through to the figure |
{.fields meta="type default"}

`num`, `poster`, `autoplay`, `track`, `width`, `height`, `link` and any other
key warn as unknown and are dropped; `style` and `on*` warn as unsafe. A
recording takes no figure number, because it is not a figure in the Book
sense.

## Limits {#limits}

- No cover art, chapters or waveform: the title and caption are the whole
  frame.
- Starting one player does not pause another on the page.
- The theme adds no speed control. Chromium-based browsers offer one in the
  native control menu; other browsers vary.
- The native player looks slightly different in each browser, and it follows
  the site's light or dark mode.
- One source file per recording, with no fallback formats. MP3 plays in every
  current browser.
- No podcast feed: the RSS output carries no `<enclosure>`, so podcast
  distribution is up to the site.

## Related {#related}

- [Video](/docs/components/video/) — the same syntax for video files and video platforms
- [Callouts](/docs/components/callout/) — the folded `[!DETAILS]` block that holds a transcript
- [Images](/docs/components/image/) — the attribute line and image lookup order shared by media
