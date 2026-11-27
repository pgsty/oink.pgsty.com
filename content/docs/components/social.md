---
title: Social posts
linkTitle: Social posts
description: Quote a post from X, Bluesky, Mastodon, or another platform with the `social` shortcode. The card is written in the page, so nothing is fetched and no script loads.
weight: 176
search_keywords: [social, social post, quote a post, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, LinkedIn, offline embed, avatar, quoted post]
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

Without `avatar`, the card draws the first character of `author` (or of
`handle`) in a circle rather than requesting a default image or a Gravatar.
Without `platform`, it shows the X icon. Parameters must be named; positional
ones warn and are ignored.

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

- `avatar` resolves like any image: a page resource, then a global resource
  in `assets/`, then a static path, then a remote URL. The name sits beside
  it, so it is decorative (`alt=""`). The card shows it small and crops it to
  fill its frame, so use a square image.
- `date` is plain text, shown as written. An ISO 8601 date or date-time, such
  as `2026-11-23` or `2026-11-23 08:30`, also becomes a machine-readable
  `<time datetime>`.
- `url` turns the date line into a "View original" link. Give the post's
  HTTP(S) address; an invalid URL warns and is dropped. It is optional, so you
  can still quote a post that no longer exists.
- The attached image is an ordinary Markdown image. This page turns on
  [image zoom](/docs/components/image/#zoom), so it opens at full size.

## Platforms {#platforms}

`platform` changes the brand icon and nothing else: every platform shares one
layout, the preset owns the colors, and the card never imitates a platform's
own interface.

| `platform` | Icon |
| --- | --- |
| `x` (default) | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `linkedin` | `fa-brands fa-linkedin` |

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
hidden text beside the decorative icon. An unknown `platform` warns and falls
back to `x`. `handle` appears exactly as written, because the theme adds no
`@` and knows no per-platform rules: write `@name` for X and `@user@instance`
for Mastodon.

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
on one line, no platform icon) and keeps its own date and link.

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
| Neither `author` nor `handle` | Warns; the body renders as a plain blockquote, without the card |
| Empty body, with `url` | Warns; a link-only card with the author line and "View original" |
| Empty body, no `url` | Warns; nothing renders |
| Unknown `platform` | Warns; uses `x` |
| Invalid `url` | Warns; the link is dropped |
| Unknown or positional parameters | Warn; ignored |

## Hugo's `x` shortcode {#hugo-x}

Hugo ships its own `x` shortcode, `{{</* x user="…" id="…" */>}}`, and OINK
leaves it alone. It asks X's oEmbed service for the post at build time, so a
clean build needs network access and the quote disappears when the post does.
Use `social` for quotes that must build offline and stay readable; the two
shortcodes have different names and do not interact.

## Output {#outputs}

The card loads no JavaScript. Print shows the same card with the original URL
printed after "View original". In the Markdown and LLMS output the card
becomes a blockquote: the body lines, then
`— Author (@handle), date, [View original](url)`, with a quoted post as a
nested blockquote. RSS carries the body and an attribution line, without the
avatar.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `author` | plain text | — | Display name. `author` or `handle` is required |
| `handle` | plain text | — | Shown as written: `@name`, `@user@instance` |
| `avatar` | image source | — | Page resource / global resource / static path / remote URL; decorative. Without it, the card draws the first character |
| `date` | plain text | — | Shown as written; an ISO 8601 date or date-time also fills `<time datetime>` |
| `url` | URL | — | The original post, HTTP(S); links the date line |
| `platform` | enum | `x` | `x` `bluesky` `mastodon` `threads` `weibo` `linkedin`; selects the icon only |
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
- The theme does not check that a static or remote avatar exists, so look at
  the rendered card before publishing.

## Related {#related}

- [Images](/docs/components/image/) — attached images, sources, and the zoom switch
- [Gallery](/docs/components/gallery/) — several images in one post
- [Video](/docs/components/video/) — a video attached to a post
- [Cards](/docs/components/cards/) — link cards, not quotations
- [Callouts](/docs/components/callout/) — notes and warnings that are not quotations
