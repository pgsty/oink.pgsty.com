---
title: Social posts
linkTitle: Social posts
description: Quote a post from X, Bluesky, Mastodon, or another platform with the `social` shortcode. The card is written in the page, so nothing is fetched and no script loads.
weight: 176
search_keywords: [social, social post, quote a post, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, Zhihu, Telegram, LinkedIn, offline embed, avatar, quoted post]
image_zoom: true
---

When an article cites something posted on X, Mastodon or another network, the
`social` shortcode quotes it as a card: avatar, name, handle, platform icon,
the post text and a dated link to the original. You write all of it into the
page, so nothing is fetched at build time or in the reader's browser, no
script loads, and the quote stays readable after the original is edited or
deleted. The card takes its colors from the site's preset and color scheme.
To quote a book or a paper, an ordinary Markdown blockquote is enough.

## Shortest form {#minimal}

A card needs `author` or `handle`, and a body with the post text in Markdown.

````markdown {title="Source"}
{{</* social author="Mara Lindqvist" handle="@mara_dba" */>}}
Upgraded our reporting cluster to PostgreSQL 18 over the weekend. pg_upgrade with --link took four minutes.
{{</* /social */>}}
````

{{< social author="Mara Lindqvist" handle="@mara_dba" >}}
Upgraded our reporting cluster to PostgreSQL 18 over the weekend. pg_upgrade with --link took four minutes.
{{< /social >}}

Without `avatar`, the card draws the first character (preserving emoji and
combining marks, after removing leading `@`, spaces, and invisible characters
such as a zero-width space, or falling back to a person icon if nothing visible
remains) of `author` (or of `handle`) in a circle rather than requesting a
default image or a Gravatar. Without `platform`, a top-level card shows the X
icon. Parameters must be named; positional ones warn and are ignored.

## A complete card {#full}

All six parameters, with an image attached to the post:

````markdown {title="Source"}
{{</* social author="Jun Okada" handle="@jun_draws" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/jun_draws/status/1001" */>}}
Finished the wordmark for the documentation site: a fountain-pen nib, a serif
name, and **no gradients**.

![The Oink wordmark beside a round fountain-pen logo](/images/oink.webp)
{{</* /social */>}}
````

{{< social author="Jun Okada" handle="@jun_draws" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/jun_draws/status/1001" >}}
Finished the wordmark for the documentation site: a fountain-pen nib, a serif
name, and **no gradients**.

![The Oink wordmark beside a round fountain-pen logo](/images/oink.webp)
{{< /social >}}

- `avatar` resolves like any image. A value with a URL scheme is a remote
  image, never fetched. Any other value is looked up as a page resource (or a
  resource of the section's branch bundle), then a global resource in
  `assets/`, and otherwise used as a path to the site's static files. Prefer
  page or `assets/` resources, which the build always finds. The name sits
  beside the avatar, so it is decorative (`alt=""`). The card shows it small
  and crops it to fill its frame, so use a square image.
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

## Platforms {#platforms}

`platform` selects the brand icon and the platform name that screen readers,
Markdown and RSS carry, and nothing else: every platform shares one
layout, the preset owns the colors, and the card never imitates a platform's
own interface. Use `none` when quoting a platform that has no icon here.

| `platform` | Icon |
| --- | --- |
| `x` (default on top-level cards) | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `zhihu` | `fa-brands fa-zhihu` |
| `telegram` | `fa-brands fa-telegram` |
| `linkedin` | `fa-brands fa-linkedin` |
| `none` (default when nested) | None (omits icon and platform name) |

````markdown {title="Source"}
{{</* social author="Mara Lindqvist" handle="@mara@fosstodon.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@mara/1002" */>}}
Cross-posting the upgrade notes here: pg_upgrade with --link, four minutes of downtime, no surprises.
{{</* /social */>}}

{{</* social handle="@pgnotes.example" platform="bluesky" */>}}
Vacuum is not optional. Neither is watching it.
{{</* /social */>}}
````

{{< social author="Mara Lindqvist" handle="@mara@fosstodon.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@mara/1002" >}}
Cross-posting the upgrade notes here: pg_upgrade with --link, four minutes of downtime, no surprises.
{{< /social >}}

{{< social handle="@pgnotes.example" platform="bluesky" >}}
Vacuum is not optional. Neither is watching it.
{{< /social >}}

The second card is quoted by handle alone, so it has no name, date or link.
Screen readers hear the platform name, which the card carries as visually
hidden text beside the decorative icon (omitted for `platform="none"`). An
unknown or empty `platform` warns and falls back to `x` (or `none` on a nested
card). `handle` appears exactly as written, because the theme adds no `@` and
knows no per-platform rules: write `@name` for X and `@user@instance` for
Mastodon.

## The body {#body}

The body is ordinary Markdown rendered as its own block, so paragraphs, links,
inline code and lists work as usual. Everything else a post can contain is
written with syntax OINK already has, which is why the card has no parameters
for it.

| Post content | Write it as |
| --- | --- |
| Text, links, code | Ordinary Markdown |
| One attached image | A Markdown image; image zoom applies when it is eligible |
| Several images | A `gallery` fence in the body |
| A quoted post | A nested `social`; see [Quoted posts](#quote) |
| A video | A [video](/docs/components/video/) written as an image, `![name](clip.mp4)` |

````markdown {title="Source"}
{{</* social author="Mara Lindqvist" handle="@mara_dba" avatar="/favicon.svg" date="2026-11-24" */>}}
One home page, two color schemes:

```gallery
![The OINK home page in light mode](/images/hero-light.webp)
![The OINK home page in dark mode](/images/hero-dark.webp)
```
{{</* /social */>}}
````

{{< social author="Mara Lindqvist" handle="@mara_dba" avatar="/favicon.svg" date="2026-11-24" >}}
One home page, two color schemes:

```gallery
![The OINK home page in light mode](/images/hero-light.webp)
![The OINK home page in dark mode](/images/hero-dark.webp)
```
{{< /social >}}

Footnote references warn in the body, as in every shortcode body, so keep
footnotes in the page's own Markdown.

## Quoted posts {#quote}

When the post quotes another, write the quoted post as a second `social`
inside the body. The inner card is compact (a smaller avatar, name and handle
on one line, `platform` defaults to `none` so neither icon nor hidden platform
name repeats) and keeps its own date and link. Pass an explicit `platform` on
the inner card for a cross-platform quote to show a compact icon and announce
that platform. Nesting deeper than one quoted post warns.

````markdown {title="Source"}
{{</* social author="Mara Lindqvist" handle="@mara_dba" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/mara_dba/status/1003" */>}}
This is why the restore drill stays on our calendar.

{{</* social author="Theo Brandt" handle="@theo_ops"
           date="2026-11-24" url="https://example.com/theo_ops/status/2001" */>}}
A backup you have never restored is a hope, not a backup.
{{</* /social */>}}
{{</* /social */>}}
````

{{< social author="Mara Lindqvist" handle="@mara_dba" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/mara_dba/status/1003" >}}
This is why the restore drill stays on our calendar.

{{< social author="Theo Brandt" handle="@theo_ops"
           date="2026-11-24" url="https://example.com/theo_ops/status/2001" >}}
A backup you have never restored is a hope, not a backup.
{{< /social >}}
{{< /social >}}

## Missing or invalid input {#degraded}

Invalid input warns, and as long as there is a body, the quoted words are
kept.

| Input | Result |
| --- | --- |
| Neither `author` nor `handle`, with body | Warns; the body renders as a plain blockquote, without the card. `url` survives only as the quote's `cite` attribute and is left out of Markdown; `date`, `platform` and `avatar` are ignored |
| Neither `author` nor `handle`, empty body, with `url` | Warns; renders a plain blockquote linking to `url` |
| Empty body, with `url` | Warns; a link-only card with the author line and "View original" |
| Empty body, no `url` | Warns; nothing renders |
| Unknown, empty, or non-string `platform` | Warns; uses `x` (or `none` when nested) |
| Non-string `author`, `handle`, or `date` | Warns; ignored |
| Invalid `url` or `avatar` | Warns; the attribute is dropped |
| Static `avatar` not under the project's `static/` | Warns when `static/` exists (ID `social:avatar-static`); keeps the path |
| Static `avatar` that climbs above the site root with `..` | Warns; keeps the path |
| Nested deeper than one quoted post | Warns; renders cleanly without dropping content |
| Unknown or positional parameters | Warn; ignored |

## Hugo's `x` shortcode {#hugo-x}

Hugo ships its own `x` shortcode, `{{</* x user="…" id="…" */>}}`, and OINK
leaves it alone. It asks X's oEmbed service for the post at build time, so a
clean build needs network access and the quote disappears when the post does.
Use `social` for quotes that must build offline and stay readable; the two
shortcodes have different names and do not interact.

## Output {#outputs}

The card loads no JavaScript. Print switches the card to the paper palette
regardless of screen color mode and prints the original URL after "View
original". In the Markdown and LLMS output the card becomes a blockquote: the
body lines, then
``— Author (`@handle`) · Platform · date · [View original](url)`` (omitting
the platform segment when `platform="none"`), with a quoted post as a nested
blockquote. RSS carries the body (omitting `<blockquote>` on link-only cards)
and an attribution line with absolute URLs, without the avatar.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `author` | plain text | — | Display name. `author` or `handle` is required |
| `handle` | plain text | — | Shown as written: `@name`, `@user@instance` |
| `avatar` | image source | — | Remote URL / page or branch-bundle resource / global resource / static path; decorative. Without it, the card draws the first character (or a user icon) |
| `date` | plain text | — | Shown as written; a year-month, date, or date-time (`HH:MM`, optional seconds, optional `Z` or `±HH:MM`) on a real day renders as `<time datetime>` |
| `url` | URL | — | Original post (HTTP(S) or site-internal path); links the date line |
| `platform` | enum | `x` (`none` nested) | `x` `bluesky` `mastodon` `threads` `weibo` `zhihu` `telegram` `linkedin` `none`; selects the icon and the announced platform name |
| Body | Markdown | — | The post; may contain images, a `gallery` fence, a video, or a nested `social` |
{.fields meta="type default"}

There are no parameters for engagement counts, verification badges, image
lists or quoted posts; images and quoted posts go in the body.

## Limits {#limits}

- Nothing is fetched: you copy the text and save the avatar and media
  yourself, and the theme stores nothing beyond what you wrote into the page.
- What you may quote, and which avatars and media you keep in the repository,
  is your decision. When the original no longer resolves, remove `url`; the
  quote itself stays.
- There are no likes, reposts, view counts or verification badges, because
  such numbers are snapshots that go stale.
- Platforms differ only by their icon; there are no platform skins or brand
  colors.
- Threads, replies and polls are not modeled. Quote several posts as several
  cards.
- Parameters are plain text, so Markdown in `author`, `handle` or `date`
  appears literally.
- The static avatar check reads only the project's own `static/` directory,
  and only when it exists. A file that a module mount or a custom `staticDir`
  publishes also warns; list `social:avatar-static` under the site's
  `ignoreLogs` to silence that warning. Remote avatar URLs are never fetched
  or checked. Prefer page-bundle or `assets/` images and inspect the rendered
  card before publishing.

## Related {#related}

- [Images](/docs/components/image/) — attached images, sources, and the zoom switch
- [Gallery](/docs/components/gallery/) — several images in one post
- [Video](/docs/components/video/) — a video attached to a post
- [Cards](/docs/components/cards/) — link cards, not quotations
- [Callouts](/docs/components/callout/) — notes and warnings that are not quotations
