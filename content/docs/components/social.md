---
title: Social
linkTitle: Social
description: Quote a post from X, Bluesky, Mastodon, or another platform with a `> [!SOCIAL]` callout. The page supplies the quote and attribution without a platform script, and plain Markdown viewers show an ordinary blockquote.
weight: 360
search_keywords: [social, social post, quote a post, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, Zhihu, Telegram, LinkedIn, offline embed, avatar, quoted post, callout]
image_zoom: true
---

When an article cites something posted on X, Mastodon or another network, a
`> [!SOCIAL]` callout quotes it as a card: avatar, name, handle, platform icon,
the post text and a dated link to the original. You write all of it into the
page, so the quoted text stays readable after the original is edited or
deleted. A local avatar and local attachments keep the card entirely on your
site, and the card takes its colors from the site's preset and color scheme.

The source is an ordinary blockquote. GitHub, an editor preview or Obsidian
shows the name, the post text, its images and any quoted post without the
theme. To quote a book or a paper, a plain blockquote is enough.

## Shortest form {#minimal}

The callout title names the author. Write the handle as a code span after the
name, then the post text in Markdown.

````markdown {title="Source"}
> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL is not just a relational database; it is a data-management framework capable of absorbing almost every workload. Replacing Kafka, Elasticsearch, MongoDB, and Redis with Postgres is a practical way to cut system complexity.
````

> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL is not just a relational database; it is a data-management framework capable of absorbing almost every workload. Replacing Kafka, Elasticsearch, MongoDB, and Redis with Postgres is a practical way to cut system complexity.

- The title renders as written, inline Markdown included. Its code span is the
  handle: the card shows it under the name, isolated as left-to-right text.
  Writing the handle as code also keeps a Markdown viewer from turning
  `@user@instance` into an email link.
- The empty `>` line after the title is optional for Hugo. It keeps a viewer
  that does not know `[!SOCIAL]`, such as GitHub, from joining the title and
  the first line of the post into one paragraph.
- Without `avatar`, the card draws the first character of the title's plain
  text in a circle, after removing leading `@`, spaces, and invisible
  characters such as a zero-width space. Emoji and combining marks stay whole,
  and a person icon replaces an empty result. The card never requests a
  default image or a Gravatar.

## A complete card {#full}

The other facts go in a block attribute line directly under the callout, with
no blank line between them:

````markdown {title="Source"}
> [!SOCIAL] Ron `@RonVonng`
>
> Released `pig`, the PostgreSQL extension package manager and Pigsty CLI. One command configures PG repositories on mainstream Linux distros and installs **hundreds of PostgreSQL extensions** through the native package manager.
>
> ![The pig.pgsty.com home page showing the Postgres Install Guide CLI](/case/pig/featured.webp)
{avatar="images/ron-vonng.webp" date="2024-12-23" url="https://x.com/RonVonng/status/1871040275575124082" platform="x"}
````

> [!SOCIAL] Ron `@RonVonng`
>
> Released `pig`, the PostgreSQL extension package manager and Pigsty CLI. One command configures PG repositories on mainstream Linux distros and installs **hundreds of PostgreSQL extensions** through the native package manager.
>
> ![The pig.pgsty.com home page showing the Postgres Install Guide CLI](/case/pig/featured.webp)
{avatar="images/ron-vonng.webp" date="2024-12-23" url="https://x.com/RonVonng/status/1871040275575124082" platform="x"}

- `avatar` resolves like any image. A value with a URL scheme is a remote
  image that the reader’s browser loads directly. Any other value is looked up
  as a page resource (or a resource of the section's branch bundle), then a
  global resource in `assets/`, and otherwise used as a path to the site's
  static files. Prefer page or `assets/` resources, which the build always
  finds. The name sits beside the avatar, so it is decorative (`alt=""`). The
  card shows it small and crops it to fill its frame, so use a square image.
- `date` is plain text, shown as written. A year-month (`2026-11`), a date
  (`2026-11-23`), or a date and time with hours and minutes, optional seconds,
  and an optional `Z` or `±HH:MM` offset (`2026-11-23 08:30`,
  `2026-11-23T08:30:00+08:00`) on a real calendar day becomes a
  machine-readable `<time datetime>`; a space before the time is written as
  `T` in the attribute. Anything else, including fractional seconds or a
  `+0800` offset, renders as plain text without `<time>`.
- `url` turns the date line into a "View original" link. Give the post's
  HTTP(S) address (which receives `rel="external"`) or a site-internal path;
  an invalid URL warns and is dropped. It is optional, so you can still quote
  a post that no longer exists.
- The attached image is an ordinary Markdown image. This page turns on
  [image zoom](/docs/components/image/#zoom), so it opens at full size.
- Block attributes need `markup.goldmark.parser.attribute.block: true`, the
  setting OINK already requires for callout icons and native Book figures.

## Platforms {#platforms}

`platform` selects the brand icon and the platform name that screen readers and
RSS carry, and nothing else: every platform shares one layout, the preset owns
the colors, and the card never imitates a platform's own interface. Without
`platform` the card shows no icon, so name the platform the post came from.

| `platform` | Icon |
| --- | --- |
| `x` | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `zhihu` | `fa-brands fa-zhihu` |
| `telegram` | `fa-brands fa-telegram` |
| `linkedin` | `fa-brands fa-linkedin` |
| `none` (default) | None (omits icon and platform name) |

````markdown {title="Source"}
> [!SOCIAL] Ron `@ron@fosstodon.example`
>
> OpenAI runs a single unsharded PostgreSQL cluster (one primary with 40+ read replicas) for its core workload. Vertical scale plus disciplined indexing still goes a very long way.
{platform="mastodon" date="2025-05-19 11:27" url="https://fosstodon.example/@ron/1002"}

> [!SOCIAL] `@pigsty.io`
>
> PostgreSQL is the Linux of databases: one kernel, hundreds of extensions, zero vendor lock-in.
{platform="bluesky"}
````

> [!SOCIAL] Ron `@ron@fosstodon.example`
>
> OpenAI runs a single unsharded PostgreSQL cluster (one primary with 40+ read replicas) for its core workload. Vertical scale plus disciplined indexing still goes a very long way.
{platform="mastodon" date="2025-05-19 11:27" url="https://fosstodon.example/@ron/1002"}

> [!SOCIAL] `@pigsty.io`
>
> PostgreSQL is the Linux of databases: one kernel, hundreds of extensions, zero vendor lock-in.
{platform="bluesky"}

The second card is quoted by handle alone, so it has no name, date or link.
Screen readers hear the platform name, which the card carries as visually
hidden text beside the decorative icon. An unknown or empty `platform` warns
and shows no icon. The handle appears exactly as written, because the theme
adds no `@` and knows no per-platform rules: write `@name` for X and
`@user@instance` for Mastodon.

## The body {#body}

The body is the callout's own Markdown, rendered with the page, so
paragraphs, links, inline code, lists and footnotes work as usual. Everything
else a post can contain is written with syntax OINK already has, which is why
the card has no attributes for it.

| Post content | Write it as |
| --- | --- |
| Text, links, code | Ordinary Markdown |
| One attached image | A Markdown image; image zoom applies when it is eligible |
| Several images | A `gallery` fence in the body |
| A quoted post | A nested `> [!SOCIAL]`; see [Quoted posts](#quote) |
| A video | A [video](/docs/components/video/) written as an image, `![name](clip.mp4)` |

````markdown {title="Source"}
> [!SOCIAL] Ron `@RonVonng`
>
> One PostgreSQL documentation theme, two color schemes:
>
> ```gallery
> ![The OINK home page in light mode](/images/hero-light.webp)
> ![The OINK home page in dark mode](/images/hero-dark.webp)
> ```
{avatar="images/ron-vonng.webp" date="2026-11-24" platform="x"}
````

> [!SOCIAL] Ron `@RonVonng`
>
> One PostgreSQL documentation theme, two color schemes:
>
> ```gallery
> ![The OINK home page in light mode](/images/hero-light.webp)
> ![The OINK home page in dark mode](/images/hero-dark.webp)
> ```
{avatar="images/ron-vonng.webp" date="2026-11-24" platform="x"}

## Quoted posts {#quote}

When the post quotes another, write the quoted post as a nested callout in
the body. Its attribute line carries one `>`, so it belongs to the inner
callout; the outer line follows without one. The inner card is compact (a
smaller avatar, name and handle on one line) and keeps its own date and link.
Leave `platform` off the inner card to keep the icon from repeating, or give
it for a cross-platform quote.

````markdown {title="Source"}
> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 17 is out — billed as the world's most advanced open-source database. Before long, "open-source" may be the redundant part.
>
> > [!SOCIAL] PostgreSQL `@PostgreSQL`
> >
> > News: PostgreSQL 17 Released!
> {date="2024-09-26" url="https://x.com/PostgreSQL/status/1839292604854223176"}
{avatar="images/ron-vonng.webp" date="2024-09-27" url="https://x.com/RonVonng/status/1839521052843442618" platform="x"}
````

> [!SOCIAL] Ron `@RonVonng`
>
> PostgreSQL 17 is out — billed as the world's most advanced open-source database. Before long, "open-source" may be the redundant part.
>
> > [!SOCIAL] PostgreSQL `@PostgreSQL`
> >
> > News: PostgreSQL 17 Released!
> {date="2024-09-26" url="https://x.com/PostgreSQL/status/1839292604854223176"}
{avatar="images/ron-vonng.webp" date="2024-09-27" url="https://x.com/RonVonng/status/1839521052843442618" platform="x"}

## Missing or invalid input {#degraded}

Invalid input warns, and as long as there is a body, the quoted words are
kept.

| Input | Result |
| --- | --- |
| No title, with body | Warns; the body renders as a plain blockquote, without the card. `url` survives only as the quote's `cite` attribute; `date`, `platform` and `avatar` are ignored |
| No title, empty body, with `url` | Warns; renders a plain blockquote linking to `url` |
| Empty body, with `url` | Warns; a link-only card with the author line and "View original" |
| Empty body, no `url` | Warns; nothing renders |
| Unknown or empty `platform` | Warns; no icon |
| `[!SOCIAL]-` or `[!SOCIAL]+` | Warns; the fold marker is ignored |
| Invalid `url` or `avatar` | Warns; the attribute is dropped |
| Static `avatar` not under the project's `static/` | Warns when `static/` exists (ID `social:avatar-static`); keeps the path |
| Static `avatar` that climbs above the site root with `..` | Warns (ID `social:avatar-static`); the avatar is dropped and the card draws the initial instead |
| Unknown attributes | Warn; ignored. `class`, `data-*` and `aria-*` pass to the card |

## Upgrading from the 1.7.0 shortcode {#migrate}

OINK 1.7.0 shipped this card as a `social` shortcode. The shortcode is gone,
and a page that still calls it fails to build with
`template for shortcode "social" not found`. The migration toolkit in the
[OINK repository](https://github.com/pgsty/oink) rewrites each call into the
callout and writes out the X icon that the shortcode drew by default on a
top-level card. Run it from a checkout of that repository:

```bash
python3 bin/migrations/oink06.py migrate --site <site> --only social
python3 bin/migrations/oink06.py migrate --site <site> --only social --write
```

The first command is a dry run that prints the diff. `author` becomes the
title text and `handle` its code span; `avatar`, `date`, `url` and `platform`
become the attribute line; a nested `social` becomes a nested callout. Calls
the toolkit cannot express, such as one with extra parameters, are listed with
their file and line and left unchanged.

## Hugo's `x` shortcode {#hugo-x}

Hugo ships its own `x` shortcode, `{{</* x user="…" id="…" */>}}`, and OINK
leaves it alone. It asks X's oEmbed service for the post at build time, so a
clean build needs network access and the quote disappears when the post does.
Use a `[!SOCIAL]` callout for quotes that must build offline and stay
readable.

## Output {#outputs}

The card loads no JavaScript. Print switches the card to the paper palette
regardless of screen color mode and prints the original URL after "View
original". The Markdown and LLMS output keep the callout as written, with its
attribute line, so an agent reads the same blockquote the author wrote. RSS
carries the body (omitting `<blockquote>` on link-only cards) and an
attribution line with absolute URLs, without the avatar.

## Reference {#reference}

| Part | Type | Default | Description |
| --- | --- | --- | --- |
| Title | inline Markdown | — | The identity line, required. A code span in it is the handle |
| `avatar` | image source | — | Remote URL / page or branch-bundle resource / global resource / static path; decorative. Without it, the card draws the first character (or a user icon) |
| `date` | plain text | — | Shown as written; a year-month, date, or date-time (`HH:MM`, optional seconds, optional `Z` or `±HH:MM`) on a real day renders as `<time datetime>` |
| `url` | URL | — | Original post (HTTP(S) or site-internal path); links the date line |
| `platform` | enum | `none` | `x` `bluesky` `mastodon` `threads` `weibo` `zhihu` `telegram` `linkedin` `none`; selects the icon and the announced platform name |
| Body | Markdown | — | The post; may contain images, a `gallery` fence, a video, footnotes, or a nested `[!SOCIAL]` |
{.fields meta="type default"}

There are no attributes for engagement counts, verification badges, image
lists or quoted posts; images and quoted posts go in the body.

## Limits {#limits}

- What you may quote, and which avatars and media you keep in the repository,
  is your decision. When the original no longer resolves, remove `url`; the
  quote itself stays.
- There are no likes, reposts, view counts or verification badges, because
  such numbers are snapshots that go stale.
- Platforms differ only by their icon; there are no platform skins or brand
  colors.
- Threads, replies and polls are not modeled. Quote several posts as several
  cards, separated by a blank line.
- A plain Markdown viewer shows the `[!SOCIAL]` marker and the attribute line
  as text, and no avatar, because the avatar is an attribute.
- The static avatar check reads only the project's own `static/` directory,
  and only when it exists. A file that a module mount or a custom `staticDir`
  publishes also warns; list `social:avatar-static` under the site's
  `ignoreLogs` to silence that warning. The build skips remote avatar checks.
  Prefer page-bundle or `assets/` images and inspect the rendered card before
  publishing.

## Related {#related}

- [Callouts](/docs/components/callout/) — the blockquote form this card shares
- [Images](/docs/components/image/) — attached images, sources, and the zoom switch
- [Gallery](/docs/components/gallery/) — several images in one post
- [Video](/docs/components/video/) — a video attached to a post
- [Cards](/docs/components/cards/) — link cards, not quotations
