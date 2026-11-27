---
title: Video
linkTitle: Video
description: Write a video as a Markdown image. Files play in the browser's native player, muted loops replace animated GIFs, and YouTube, Bilibili and Vimeo URLs become cards that contact nobody until clicked.
weight: 172
search_keywords: [Video, mp4, webm, poster, subtitles, WebVTT, autoplay, GIF, YouTube, Bilibili, Vimeo, embed, video_embeds]
---

A video is written like an image: `![name](tour.mp4)`, with an optional attribute line below it.
The image render hook recognizes a video destination and renders the browser's native `<video>` player instead of an `<img>`.
A YouTube, Bilibili or Vimeo URL in the same place becomes a card that links to the platform.
There is no video shortcode. A page without an autoplay video or an enabled platform card loads no video JavaScript.

## Shortest form {#minimal}

````markdown {title="Source"}
![A tour of three OINK pages](tour.mp4)
````

![A tour of three OINK pages](tour.mp4)

The file sits beside this page in its bundle: a 9-second, 1200×600 MP4 of 109 KB.
The bracket text is the player's accessible name, so write it as you would alt text. When it is empty, the caption names the player; when both are empty, the theme warns and falls back to the file name.
The player has native controls and `preload="metadata"`: until the reader presses play, the browser fetches only enough to show the duration.
Without a known size the box reserves 16:9, then takes the video's own shape once its metadata arrives.

Like a block image, this needs `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`.
See [Images · Inline versus block](/docs/components/image/#inline-vs-block).

## Where videos come from {#sources}

Video files resolve in the same order as images:

| Placement | How it is written | Recognized by |
| --- | --- | --- |
| Beside the page (a bundle) | `![…](tour.mp4)` | Hugo media type `video/*` |
| Current section bundle | `![…](post/tour.mp4)` | Hugo media type `video/*` |
| Global resource `assets/…` | `![…](videos/tour.mp4)` | Hugo media type `video/*` |
| Static directory `static/…` | `![…](/videos/tour.mp4)` | Extension `mp4`, `m4v`, `webm`, `ogv` or `mov` |
| Object storage or a CDN | `![…](https://cdn.example.com/tour.mp4)` | The same extensions |

A path that matches no resource is kept as a static path. The theme checks neither static paths nor remote URLs.
Only the path decides the extension, so a signed URL such as `…/tour.mp4?sig=…` is still a video.
A destination with any other extension stays an image: `https://example.com/stream?id=42` renders as a broken `<img>`.

## Inline versus block {#inline-vs-block}

Only a video in its own paragraph becomes a player. Inside a sentence it is a plain link:

````markdown {title="Source"}
Inside a sentence, ![the same tour](tour.mp4) is a link to the file.
````

Inside a sentence, ![the same tour](tour.mp4) is a link to the file.

The bracket text becomes the link text. An inline platform URL links to its watch page. Inline videos take no attributes.

## Poster, subtitles and caption {#poster-track}

````markdown {title="Source"}
![A tour of three OINK pages](tour.mp4)
{caption="The documentation shell, its Docsy upstream and a release page, in nine seconds" poster="tour-poster.jpg" track="tour.en.vtt"}
````

![A tour of three OINK pages](tour.mp4)
{caption="The documentation shell, its Docsy upstream and a release page, in nine seconds" poster="tour-poster.jpg" track="tour.en.vtt"}

- `poster` is the picture shown before playback. It resolves through the image lookup.
  A local raster poster also gives the player its width and height (1200×600 here), so the box has the right shape before the video loads.
- `track` is one WebVTT subtitle file, found the same way. The theme writes `kind="subtitles"`, takes `srclang` from the page language and uses the language name as the label.
  The track is on by default. Each translation names its own file: the Chinese page uses `tour.zh.vtt`.
- `caption` is plain text in a `<figcaption>`, exactly as for images. It is not parsed as Markdown.

`num` makes the video a numbered Book figure, as for an image. The caption gains a localized "Figure N" prefix.
`#id` defaults to `fig-<num>`, and the video registers a `fig` target that links and `xref` can reach. See [Books](/docs/write/book/).

## Size {#size}

`width` and `height` take positive integers. Given together, they set the box's aspect ratio and override the poster's.
Use them for a video without a local poster whose shape is not 16:9:

```markdown {title="Source"}
![A 4:3 screen recording](https://cdn.example.com/oink/settings.mp4)
{width="1024" height="768"}
```

They do not shrink the player, unlike image sizes. A video always spans the reading width.
A value that is not a positive integer warns and is ignored.

## Looping demos instead of GIFs {#autoplay}

````markdown {title="Source"}
![OINK switching between light and dark](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="A muted loop: it plays while in view and pauses when you scroll away"}
````

![OINK switching between light and dark](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="A muted loop: it plays while in view and pauses when you scroll away"}

`autoplay=true` makes the kind of short, silent demo usually published as an animated GIF.
This 6-second clip is 233 KB. The same clip as a 15 fps GIF is 4.4 MB, and a GIF cannot be paused.

The markup is `muted loop` with a `data-td-media-autoplay` marker, but it has no `autoplay` attribute.
The runtime `js/chunks/media.js` plays the video only while all three conditions hold:

- at least half of the video is visible;
- the page itself is visible, not in a background tab;
- the reader has not asked for reduced motion.

It pauses as soon as one of them stops holding. If the reader pauses or plays it, their choice wins until the video next leaves the viewport.
The native controls remain, so the motion can always be stopped (WCAG 2.2.2, Pause, Stop, Hide), and the reader can unmute it.
Without JavaScript nothing starts by itself: the reader sees the poster and presses play.
`autoplay=false` is the same as leaving it out. Any other value warns and uses `false`.

## Video platforms {#platforms}

A YouTube, Bilibili or Vimeo URL renders as a card:

````markdown {title="Source"}
![Pigsty: an OSChina interview](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="OSChina talks with this site's author about Pigsty, 2022"}
````

![Pigsty: an OSChina interview](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="OSChina talks with this site's author about Pigsty, 2022"}

The card is one link to the watch page. It shows the `poster` or a plain surface, a play glyph, the bracket text and the platform name.
Rendering it contacts nobody: there is no iframe, platform script or thumbnail request.
This site lets Bilibili play in place, so a click on the card above loads the player. See [the next section](#embeds).

The accepted URLs:

- YouTube: `youtube.com/watch?v=ID`, `youtu.be/ID` or `youtube.com/shorts/ID`, and also `/live/ID` and `/embed/ID`; the ID has 11 characters.
  `t` or `start` sets the start time, in seconds (`90`) or as `1m30s`.
- Bilibili: `bilibili.com/video/BV…` or `bilibili.com/video/av…`.
  `p` picks a part of a multi-part video, and `t` sets the start time.
- Vimeo: `vimeo.com/NUMBER`, or `vimeo.com/NUMBER/HASH` for an unlisted video. The player starts at the beginning.

Hosts may carry `www.` or `m.`. The theme validates the ID before it builds a player address, so author text never reaches an iframe.
A URL on these hosts without a recognizable ID warns and renders a card without a player.
`b23.tv` short links cannot be resolved without the network. They warn and render a card without a player; write the full `bilibili.com/video/BV…` URL instead.

Cards accept `caption`, `num`, `id`, `poster`, `width` and `height`. `track` and `autoplay` warn on a card.
The theme never fetches the platform's thumbnail, so save a still into the bundle if you want a picture.

## Playing in place {#embeds}

A card only links out until the site lists its platform:

```yaml {title="hugo.yml"}
params:
  video_embeds: [bilibili, youtube]
```

`params.video_embeds` is a list drawn from `youtube`, `bilibili` and `vimeo`. It is empty by default.
This site enables Bilibili and YouTube and leaves Vimeo as a link.
A list rather than a switch lets a site play one platform in place and only link to another that part of its audience cannot reach.
A value that is not a list warns and leaves every card as a link. An unknown name warns and is ignored.

For an enabled platform, a plain click replaces the card with the platform's player and moves focus into it.
The player's title is the bracket text, and it starts at once, from the URL's start time.
A click with <kbd>Ctrl</kbd>, <kbd>Cmd</kbd>, <kbd>Shift</kbd> or <kbd>Alt</kbd>, or with the middle button, keeps the link behavior. Without JavaScript the card stays a link.

| Platform | Player host | Privacy setting |
| --- | --- | --- |
| YouTube | `www.youtube-nocookie.com` | The privacy-enhanced domain |
| Bilibili | `player.bilibili.com` | Danmaku (scrolling comments) off |
| Vimeo | `player.vimeo.com` | `dnt=1`, do not track |

A site that sends a Content Security Policy adds the enabled player hosts to `frame-src`:
`player.bilibili.com`, `www.youtube-nocookie.com` and `player.vimeo.com`.

## Large files {#large-files}

A video in a page bundle is committed to Git with the page. That suits clips like the two on this page, 109 KB and 233 KB.
For anything beyond a few megabytes, upload the file to object storage or a CDN and write its HTTPS URL.
The poster and subtitle file can stay in the bundle:

```markdown {title="Source"}
![Installing Pigsty on a fresh node](https://cdn.example.com/oink/install.mp4)
{poster="install-poster.webp" track="install.en.vtt" caption="A single-node install, start to finish"}
```

Use a stable public URL. A signed URL that expires breaks the page later, and the theme does not check remote files.
An H.264 MP4 plays in every current browser. For a screen recording, a command such as this keeps the file small:

```sh
ffmpeg -i recording.mov -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart demo.mp4
```

`-an` drops the sound track, which a muted loop never plays. `+faststart` puts the index first, so the browser can show the duration without downloading the file.

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | A `<figure class="td-media td-media--video">` around a native `<video controls preload="metadata" playsinline>`; a caption or number adds `td-figure` and a `<figcaption>`; a platform URL is an `<a class="td-media-card">` that carries `data-td-media-embed` when its platform is enabled |
| Print | The poster if there is one, the name as a link, and the caption; a file adds its full address and a card its platform name; no player |
| Markdown / LLMS | The authored image line and attribute line |
| RSS | The same static figure as print, with absolute URLs |

A video without a caption or number still sits in a `td-media` figure, without a `<figcaption>`.
Printing the HTML page from the browser shows the poster or the current frame, with the file address below it.
`js/chunks/media.js` loads only in HTML, and only on a page with an autoplay video or a card for an enabled platform.

## Parameter reference {#reference}

The attribute line `{…}` directly after a block video:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | plain text | — | Figure caption; not parsed as Markdown |
| `#id` | identifier | `fig-<num>` when `num` is set | The figure's anchor and Book target ID |
| `num` | string | — | Book figure number; registers a `fig` target and prefixes the caption with "Figure N" |
| `poster` | path | — | Image shown before playback, resolved like an image; a local raster supplies `width`/`height` |
| `track` | path | — | One WebVTT subtitle file, on by default; `srclang` is the page language; files only |
| `autoplay` | `true` / `false` | `false` | A muted loop that plays while in view; files only |
| `width` / `height` | positive integer | the poster's size, else 16:9 | Aspect ratio of the box; the player still spans the reading width |
| `class` | class list | — | Passed through to the figure for site CSS |
| `data-*` / `aria-*` | string | — | Passed through to the figure |
{.fields meta="type default"}

`link`, `command`, `options` and other keys warn as unknown attributes and are dropped. `style` and `on*` warn as unsafe.

The site setting:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `params.video_embeds` | list | `[]` | Platforms whose player loads in place after a click: `youtube`, `bilibili`, `vimeo` |
{.fields meta="type default"}

## Limits {#limits}

- One subtitle track per video. Each language page names its own file; there is no track list or subtitle menu.
- One source file: no codec fallbacks with several `<source>` elements, no adaptive streaming (HLS or DASH), no chapters, playlists or custom controls.
- Three platforms only. Other video sites and arbitrary iframe addresses are not supported; link to them in prose.
- No remote thumbnails. A card shows your `poster` or a plain surface.
- `width` and `height` set the shape, not the size. A player is never taller than 80% of the viewport; a portrait recording is letterboxed within that height.
- Static paths and URLs are recognized by extension only. A streaming URL without a video extension renders as an image.
- The theme measures no file sizes and checks no static or remote files.

## Related {#related}

- [Images](/docs/components/image/) — the same syntax, attribute line and figure numbering
- [Audio](/docs/components/audio/) — recordings with a visible title and a transcript
- [Asciinema](/docs/components/asciinema/) — terminal sessions as selectable text, not video
- [Books](/docs/write/book/) — numbered figures and `xref` cross-references
