---
title: Video
linkTitle: Video
description: Embed product demos, screen recordings and muted loops that replace GIFs, and link YouTube, Bilibili or Vimeo talks without contacting the platform until a reader clicks.
weight: 172
search_keywords: [Video, mp4, webm, poster, subtitles, WebVTT, autoplay, GIF, YouTube, Bilibili, Vimeo, embed, video_embeds]
---

A video is written like an image, `![name](tour.mp4)`, with an optional
attribute line below it. A video file plays in the browser's own `<video>`
player, so it needs no configuration and no third-party service. A YouTube,
Bilibili or Vimeo URL in the same place becomes a card that links to the
platform; it plays in the page only on a site that has opted that platform in,
because playing there connects the reader to the platform.

Use a file for product demos, screen recordings and the short silent loops
usually published as animated GIFs, and a platform card for talks and
interviews that already live on a video site. There is no video shortcode, and
a page loads no video JavaScript unless it has an autoplay video or a card for
an opted-in platform.

## Shortest form {#minimal}

````markdown {title="Source"}
![A tour of three OINK pages](tour.mp4)
````

![A tour of three OINK pages](tour.mp4)

The file sits beside this page in its bundle: a 9-second, 1200×600 MP4 of
123 KB. The bracket text is the player's accessible name, so write it as you
would alt text. When it is empty the caption names the player, and when both
are empty the theme warns and falls back to the file name (or the watch URL for
platform links).

The player has native controls and `preload="metadata"`, so until the reader
presses play the browser fetches only enough to show the duration. Without a
known size the box reserves 16:9, then takes the video's own shape once its
metadata arrives; add a local `poster` or `width` and `height` if the video is
not 16:9 and you want zero layout shift.

Like a block image, a video needs
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`; see
[Images · Inline versus block](/docs/components/image/#inline-vs-block).

## Where videos come from {#sources}

Video files resolve in the same order as images:

| Placement | How it is written | Recognized by |
| --- | --- | --- |
| Beside the page (a bundle) | `![…](tour.mp4)` | Hugo media type `video/*` |
| Current section bundle | `![…](post/tour.mp4)` | Hugo media type `video/*` |
| Global resource `assets/…` | `![…](videos/tour.mp4)` | Hugo media type `video/*` |
| Static directory `static/…` | `![…](/videos/tour.mp4)` | Extension `mp4`, `m4v`, `webm`, `ogv` or `mov` |
| Object storage or a CDN | `![…](https://cdn.example.com/tour.mp4)` | The same extensions |

A path that matches no resource is written out as a static path, and the theme
checks neither static paths nor remote URLs. Only the path part decides the
extension, so a signed URL such as `…/tour.mp4?sig=…` is still a video, while a
destination with any other extension stays an image:
`https://example.com/stream?id=42` renders as a broken `<img>`.

## Inline versus block {#inline-vs-block}

Only a video in a paragraph of its own becomes a player. Inside a sentence it
is a plain link to the file, with the bracket text as the link text:

````markdown {title="Source"}
Inside a sentence, ![the same tour](tour.mp4) is a link to the file.
````

Inside a sentence, ![the same tour](tour.mp4) is a link to the file.

An inline platform URL links to its watch page. Inline videos take no
attributes.

## Poster, subtitles and caption {#poster-track}

````markdown {title="Source"}
![A tour of three OINK pages](tour.mp4)
{caption="The documentation shell, its Docsy upstream and a release page, in nine seconds" poster="tour-poster.jpg" track="tour.en.vtt"}
````

![A tour of three OINK pages](tour.mp4)
{caption="The documentation shell, its Docsy upstream and a release page, in nine seconds" poster="tour-poster.jpg" track="tour.en.vtt"}

- `poster` is the picture shown before playback, found the same way as an
  image. A local raster poster also gives the player its width and height
  (1200×600 here), so the box has the right shape before the video loads.
- `track` is one WebVTT subtitle file, found the same way. The theme writes
  `kind="subtitles"`, takes `srclang` from the page language, labels the track
  with the language name and turns it on by default. Each translation names
  its own file: the Chinese page uses `tour.zh.vtt`. Keep `.vtt` files on the
  same origin (in the page bundle or `static/`) when possible; when `track` is
  a remote URL, `<video>` adds `crossorigin="anonymous"`, so both the subtitle
  and video hosts must send CORS headers.
- `caption` is plain text in a `<figcaption>`, exactly as for images; it is
  not parsed as Markdown.

`num` makes the video a numbered Book figure, as for an image: the caption
gains a "Figure N" prefix in the page's language, `#id` defaults to
`fig-<num>`, and links and `xref` can reach the video. See
[Books](/docs/write/book/).

## Size {#size}

`width` and `height` take positive integers and must be given together; they
set the player or card box's aspect ratio, overriding the poster's ratio while
leaving the poster image's own dimensions intact in Print and RSS. Use them for
a video without a local poster whose shape is not 16:9:

```markdown {title="Source"}
![A 4:3 screen recording](https://cdn.example.com/oink/settings.mp4)
{width="1024" height="768"}
```

Unlike image sizes they do not shrink a landscape player, which spans the
reading width; portrait boxes still cap at 80% of the viewport height and
center horizontally. A non-positive value or a single dimension without its
pair warns and is ignored.

## Looping demos instead of GIFs {#autoplay}

````markdown {title="Source"}
![OINK switching between light and dark](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="A muted loop: it plays while in view and pauses when you scroll away"}
````

![OINK switching between light and dark](appearance.mp4)
{autoplay=true poster="appearance-poster.jpg" caption="A muted loop: it plays while in view and pauses when you scroll away"}

`autoplay=true` is for the short, silent demos usually published as animated
GIFs, and it costs far less: this 6-second clip is 246 KB, while the same clip
as a 15 fps GIF is 4.4 MB and cannot be paused.

The video is written out `muted loop` with a `data-td-media-autoplay` marker
but without the `autoplay` attribute, and the small `js/chunks/media.js`
runtime plays it only while all three of these hold:

- at least half of the video is visible;
- the page itself is visible, not in a background tab;
- the reader has not asked for reduced motion.

It pauses as soon as one stops holding. If the reader pauses or plays the
video, their choice wins until it next leaves the viewport. The native
controls stay, so the motion can always be stopped (WCAG 2.2.2, Pause, Stop,
Hide) and the sound turned on. Without JavaScript nothing starts by itself:
the reader sees the poster and presses play. `autoplay=false` is the same as
leaving it out, and any other value warns and counts as `false`.

## Video platforms {#platforms}

A YouTube, Bilibili or Vimeo URL renders as a card:

````markdown {title="Source"}
![Pigsty: an OSChina interview](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="OSChina talks with this site's author about Pigsty, 2022"}
````

![Pigsty: an OSChina interview](https://www.bilibili.com/video/BV1o3411w7hP)
{caption="OSChina talks with this site's author about Pigsty, 2022"}

The card is one link to the watch page, showing the `poster` or a plain
surface, a play glyph, the bracket text and the platform name. Rendering it
contacts no one: there is no iframe, no platform script and no thumbnail
request. This site has opted Bilibili in, so a click on the card above loads
the player in place; see [the next section](#embeds).

The accepted URLs:

- YouTube: `youtube.com/watch?v=ID`, `music.youtube.com/watch?v=ID`,
  `youtu.be/ID`, `youtube.com/shorts/ID`, `/live/ID`, `/embed/ID`, and
  `youtube-nocookie.com/embed/ID`, with an 11-character ID. `t`, `start` or
  `#t=` sets the start time, in seconds (`90`) or as `1m30s`. Shorts default
  to a `9:16` frame unless a `poster` or `width`/`height` overrides it.
- Bilibili: `bilibili.com/video/BV…`, `bilibili.com/video/av…`,
  `b23.tv/BV…` / `b23.tv/av…`, or the `src` of Bilibili's embed code,
  `https://player.bilibili.com/player.html?bvid=…` (or `?aid=…`; prefix the
  `//` it is copied with by `https:`). `p` picks a part of a multi-part video and `t`
  sets the start time.
- Vimeo: `vimeo.com/NUMBER`, `vimeo.com/manage/videos/NUMBER`, or
  `player.vimeo.com/video/NUMBER`, with `/HASH` or `?h=HASH` for an unlisted
  video. `#t=` or `t` sets the start time.

Hosts may carry `www.` or `m.`. The theme validates the video ID and builds
the player address from it, so no author text ever reaches an iframe. A URL on
these hosts without a recognizable ID warns and renders a card without a
player. So does an opaque `b23.tv` short link (such as `b23.tv/abc`), which
cannot be resolved without the network; write the full `bilibili.com/video/BV…`
URL instead.

Cards accept `caption`, `num`, `id`, `poster`, `width` and `height`; `track`
and `autoplay` warn on a card. The theme never fetches the platform's
thumbnail, so save a still into the bundle as the `poster` if you want a
picture.

## Playing in place {#embeds}

Every platform card only links out until the site opts its platform in:

```yaml {title="hugo.yml"}
params:
  video_embeds: [bilibili, youtube]
```

`params.video_embeds` is a list drawn from `youtube`, `bilibili` and `vimeo`,
and it is empty by default. Playing in place loads the platform's player in
your page, and the reader's browser then talks to the platform, which sees
their address and applies its own privacy terms. Whether that is acceptable is
the site owner's decision, so nothing loads until you list the platform. A list
rather than a switch lets you play one platform in place and only link to
another that part of your audience cannot reach; this site plays Bilibili and
YouTube in place and leaves Vimeo as a link. A value that is not a list warns
and leaves every card as a link, and an unknown name warns and is ignored.

For an opted-in platform, a plain click replaces the card with the platform's
player and moves focus into it. The player takes the bracket text as its title,
loads in a sandboxed iframe (`allow-scripts allow-same-origin
allow-presentation allow-popups allow-popups-to-escape-sandbox`,
`allow="autoplay; picture-in-picture; fullscreen"`,
`referrerpolicy="strict-origin-when-cross-origin"`), and starts at once from
the URL's start time. A click with <kbd>Ctrl</kbd>, <kbd>Cmd</kbd>,
<kbd>Shift</kbd> or <kbd>Alt</kbd>, or with the middle button, still opens the
link, and without JavaScript the card stays a link. Each player loads with its
platform's most private settings:

| Platform | Player host | Privacy setting |
| --- | --- | --- |
| YouTube | `www.youtube-nocookie.com` | The privacy-enhanced domain |
| Bilibili | `player.bilibili.com` | Danmaku (scrolling comments) off |
| Vimeo | `player.vimeo.com` | `dnt=1`, do not track |

If your site sends a Content Security Policy, add the hosts of the platforms
you list to `frame-src`: `player.bilibili.com`, `www.youtube-nocookie.com`
and `player.vimeo.com`. Otherwise the browser blocks the player after the
click.

## Large files {#large-files}

A video in a page bundle is committed to Git with the page, which suits clips
like the two on this page, 123 KB and 246 KB. Anything beyond a few megabytes
makes every clone of the repository heavier, so upload it to object storage or
a CDN and write its HTTPS URL. The poster and subtitle file can stay in the
bundle:

```markdown {title="Source"}
![Installing Pigsty on a fresh node](https://cdn.example.com/oink/install.mp4)
{poster="install-poster.webp" track="install.en.vtt" caption="A single-node install, start to finish"}
```

Use a stable public URL on a host that supports HTTP Range requests (standard
on object storage and CDNs) so browsers can read metadata and seek without
downloading the whole file. A signed URL that expires breaks the page later,
and the theme does not check remote files. An H.264 MP4 plays in every current
browser, and a command such as this keeps a screen recording small:

```sh
ffmpeg -i recording.mov -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart demo.mp4
```

`-an` drops the sound track, which a muted loop never plays, and `+faststart`
puts the index first so the browser can show the duration without downloading
the whole file.

## Output {#outputs}

In HTML a video is a `<figure class="td-media td-media--video">` around a
native `<video controls preload="metadata" playsinline>`; a caption or number
adds `td-figure` and a `<figcaption>`, and a platform URL is an
`<a class="td-media-card">` that carries `data-td-media-embed` when its
platform is opted in. Paper and feeds have no player, so Print and RSS show the
poster if there is one, the name as a link, the platform name when applicable,
the full file or watch URL, and the caption, with absolute URLs in RSS.
Printing the HTML page from the browser shows the poster or the current frame
with the file or watch URL below it, and still prints the title, platform and
watch URL even after an opted-in card has been replaced by an iframe. Markdown
and LLMS output keep the image line and attribute line as written.

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

`link`, `command`, `options` and other keys warn as unknown attributes and are
dropped; `style` and `on*` warn as unsafe.

The site setting:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `params.video_embeds` | list | `[]` | Platforms whose player loads in place after a click: `youtube`, `bilibili`, `vimeo` |
{.fields meta="type default"}

## Limits {#limits}

- One subtitle track per video. Each language page names its own file; there
  is no track list or subtitle menu.
- One source file: no codec fallbacks across several `<source>` elements, no
  adaptive streaming (HLS or DASH), and no chapters, playlists or custom
  controls.
- Three platforms only. Other video sites and arbitrary iframe addresses are
  not supported; link to them in prose.
- No remote thumbnails. A card shows your `poster` or a plain surface.
- `width` and `height` set the aspect ratio, not pixel dimensions, and must be
  paired. A player or card is never taller than 80% of the viewport, so a
  portrait recording is pillarboxed inside `<video>` and a portrait card or
  embedded player centers within that height.
- Static paths and URLs are recognized by extension only, so a streaming URL
  without a video extension renders as an image.
- The theme measures no file sizes and checks no static or remote files.

## Related {#related}

- [Images](/docs/components/image/) — the same syntax, attribute line and figure numbering
- [Audio](/docs/components/audio/) — recordings with a visible title and a transcript
- [Asciinema](/docs/components/asciinema/) — terminal sessions as selectable text, not video
- [Books](/docs/write/book/) — numbered figures and `xref` cross-references
