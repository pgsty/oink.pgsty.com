---
title: Audio
linkTitle: Audio
description: Write audio as a Markdown image. It renders as a titled native player for podcast episodes, voice samples and recordings, with the transcript in a folded callout and no JavaScript.
weight: 174
search_keywords: [Audio, mp3, m4a, ogg, wav, flac, podcast, voice sample, transcript, player]
---

An audio file is written like an image: `![title](episode.mp3)`, with an optional attribute line below it.
It renders as a framed figure: the bracket text as a visible title, above the browser's native `<audio>` player.
Use it for podcast episodes, voice samples, pronunciation guides and recorded talks.
There is no audio shortcode, no configuration and no audio JavaScript.

## Shortest form {#minimal}

````markdown {title="Source"}
![Welcome to OINK](welcome-en.mp3)
````

![Welcome to OINK](welcome-en.mp3)

A recording has no picture, so the bracket text is both the visible title and the player's accessible name.
An empty one warns, and the file name becomes the title. Markdown inside the brackets is reduced to plain text.
The player uses `preload="metadata"`, so the browser shows the duration without downloading the recording.
Native controls provide play, seek, volume and keyboard access. Chromium-based browsers also offer playback speed in the control menu.

The file sits beside this page in its bundle: an 8-second MP3 of 50 KB.
Like a block image, the player needs `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`.
See [Images · Inline versus block](/docs/components/image/#inline-vs-block).

## Where audio comes from {#sources}

Audio files resolve in the same order as images and video:

| Placement | How it is written | Recognized by |
| --- | --- | --- |
| Beside the page (a bundle) | `![…](welcome-en.mp3)` | Hugo media type `audio/*` |
| Current section bundle | `![…](post/episode.mp3)` | Hugo media type `audio/*` |
| Global resource `assets/…` | `![…](audio/episode.mp3)` | Hugo media type `audio/*` |
| Static directory `static/…` | `![…](/audio/episode.mp3)` | Extension `mp3`, `m4a`, `aac`, `oga`, `ogg`, `opus`, `wav` or `flac` |
| Object storage or a CDN | `![…](https://cdn.example.com/episode-12.mp3)` | The same extensions |

The theme checks neither static paths nor remote URLs.
A page-bundle recording is committed to Git with the page. Short samples like the two on this page fit there.
Upload a long episode to object storage and write its HTTPS URL, as described for [large video files](/docs/components/video/#large-files).

## Inline versus block {#inline-vs-block}

Only audio in its own paragraph becomes a player. Inside a sentence it is a plain link:

````markdown {title="Source"}
Inside a sentence, ![the welcome recording](welcome-en.mp3) is a link to the file.
````

Inside a sentence, ![the welcome recording](welcome-en.mp3) is a link to the file.

The bracket text becomes the link text. Inline audio takes no attributes.

## Captions and sample sets {#caption}

`caption` adds plain text after the title. On a narrow screen it wraps below the title.
Audio figures that follow each other directly stack closer together, so a set of samples reads as one group:

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

The caption is not parsed as Markdown. Do not type a duration into it: the player already shows one that cannot drift from the file.
`#id` gives the figure an anchor, so a link can point at one recording.

## Transcripts {#transcript}

Write the transcript, show notes or lyrics as ordinary content after the player.
A folded callout keeps a long transcript out of the way:

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

A transcript is the text alternative that WCAG 1.2.1 asks for prerecorded audio. It also serves readers who cannot play sound where they are.
In HTML the callout is a closed native `<details>`. Print and RSS render folded callouts expanded, and the Markdown output keeps their source.
The transcript is therefore complete in every static output, with no audio-specific rule.
See [Callouts · DETAILS](/docs/components/callout/#details).

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | A `<figure class="td-media td-media--audio">`: a `<figcaption>` with the title and caption, then a native `<audio controls preload="metadata">` that contains a fallback link |
| Print | The title, the caption and the file's full address as a link; no player |
| Markdown / LLMS | The authored image line and attribute line; a following transcript callout keeps its source |
| RSS | The same as print, with an absolute address |

Audio is always a figure, because it always has a visible title.
Printing the HTML page from the browser hides the player and shows the file address in its place.
Audio loads no JavaScript.

## Parameter reference {#reference}

The attribute line `{…}` directly after a block audio file:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | plain text | — | Shown after the title; not parsed as Markdown |
| `#id` | identifier | — | The figure's anchor |
| `class` | class list | — | Passed through to the figure for site CSS |
| `data-*` / `aria-*` | string | — | Passed through to the figure |
{.fields meta="type default"}

`num`, `poster`, `autoplay`, `track`, `width`, `height`, `link` and other keys warn as unknown attributes and are dropped.
`style` and `on*` warn as unsafe. A recording is not a figure in the Book sense, so it takes no number.

## Limits {#limits}

- No cover art, chapters or waveform. The title and caption are the whole frame.
- No single-active playback. Starting one player does not pause another on the page.
- No speed control from the theme. Chromium-based browsers offer one in the native control menu; other browsers vary.
- The native player looks slightly different in each browser. It follows the site's light or dark mode.
- One source file per recording, with no codec fallbacks. MP3 plays in every current browser.
- No podcast feed. The RSS output carries no `<enclosure>`; podcast distribution is a site concern.
- The theme measures no file sizes and checks no static or remote files.

## Related {#related}

- [Video](/docs/components/video/) — the same syntax for video files and video platforms
- [Callouts](/docs/components/callout/) — the folded `[!DETAILS]` block that holds a transcript
- [Images](/docs/components/image/) — the attribute line and image lookup order shared by media
