---
title: Social posts
linkTitle: Social posts
description: Quote a post from X, Bluesky, Mastodon, or another platform with the `social` shortcode. The card is written in the page, so nothing is fetched and no script loads.
weight: 176
search_keywords: [social, social post, quote a post, tweet, X, Twitter, Bluesky, Mastodon, Threads, Weibo, LinkedIn, offline embed, avatar, quoted post]
image_zoom: true
---

The `social` shortcode quotes a post from a social platform as a card: avatar, name, handle, platform icon, the post text, and a dated link to the original.
Everything comes from the page. Nothing is fetched at build time or in the reader's browser, and the card loads no JavaScript.
The quote stays readable after the original is edited or deleted, and it follows the site's presets and color schemes.
Use it when an article cites what someone posted. For a passage from a book or a paper, an ordinary Markdown blockquote is enough.

## Shortest form {#minimal}

A card needs `author` or `handle`, and a body. The body is the post text in Markdown.

````markdown {title="Source"}
{{</* social author="OINK Example" handle="@oink_example" */>}}
The post text lives in the page, so this quote needs no network at all.
{{</* /social */>}}
````

{{< social author="OINK Example" handle="@oink_example" >}}
The post text lives in the page, so this quote needs no network at all.
{{< /social >}}

Without `avatar`, the card draws the first character of `author` (or of `handle`) in a circle. No default avatar or Gravatar is requested.
Without `platform`, the card shows the X icon. Parameters are named only. Positional parameters warn and are ignored.

## A complete card {#full}

All six parameters, with an image attached to the post:

````markdown {title="Source"}
{{</* social author="OINK Example" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/oink_example/status/1001" */>}}
Quoting a post with `social` keeps the words on **your own page**: no embed
script, no build-time request, and the quote outlives a deleted original.

![The OINK documentation shell](/images/oink.webp)
{{</* /social */>}}
````

{{< social author="OINK Example" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-23" url="https://example.com/oink_example/status/1001" >}}
Quoting a post with `social` keeps the words on **your own page**: no embed
script, no build-time request, and the quote outlives a deleted original.

![The OINK documentation shell](/images/oink.webp)
{{< /social >}}

- `avatar` uses the shared image resolver: page resource → global resource in `assets/` → static path → remote URL.
  It is decorative (`alt=""`) because the name sits beside it. The card shows it small and crops it to fill its frame, so use a square image.
- `date` is plain text and is shown as written. An ISO 8601 date or date-time, such as `2026-11-23` or `2026-11-23 08:30`, also becomes `<time datetime>`.
- `url` turns the date line into a "View original" link. It is optional, so a post that no longer exists can still be quoted.
  Use the post's HTTP(S) address. An invalid URL warns and is dropped.
- The attached image is an ordinary Markdown image. This page enables [image zoom](/docs/components/image/#zoom), so the image opens at full size.

## Platforms {#platforms}

`platform` selects the brand icon and nothing else. Every platform shares one layout, and the preset owns the colors.
The card does not imitate any platform's interface.

| `platform` | Icon |
| --- | --- |
| `x` (default) | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `linkedin` | `fa-brands fa-linkedin` |

````markdown {title="Source"}
{{</* social author="OINK Example" handle="@oink@social.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@oink/1002" */>}}
The same card on Mastodon. Only the icon in the corner changes.
{{</* /social */>}}

{{</* social handle="@oink.example" platform="bluesky" */>}}
A Bluesky post quoted with a handle alone: no name, no date, no link.
{{</* /social */>}}
````

{{< social author="OINK Example" handle="@oink@social.example" platform="mastodon"
           date="2026-11-20 08:30" url="https://example.com/@oink/1002" >}}
The same card on Mastodon. Only the icon in the corner changes.
{{< /social >}}

{{< social handle="@oink.example" platform="bluesky" >}}
A Bluesky post quoted with a handle alone: no name, no date, no link.
{{< /social >}}

The icon is decorative. Screen readers hear the platform name, which the card carries as visually hidden text.
An unknown `platform` warns and uses `x`.
`handle` is shown exactly as written. The theme adds no `@` and has no per-platform handle rules: write `@name` for X and `@user@instance` for Mastodon.

## The body {#body}

The body is ordinary Markdown, rendered as its own block: paragraphs, links, inline code, lists.
Everything else in a post is written with syntax OINK already has, so the card needs no parameters for it.

| Post content | Write it as |
| --- | --- |
| Text, links, code | Ordinary Markdown |
| One attached image | A Markdown image; image zoom applies when it is eligible |
| Several images | A `gallery` fence in the body |
| A quoted post | A nested `social`; see [Quoted posts](#quote) |
| A video | A [video](/docs/components/video/) written as an image, `![name](clip.mp4)` |

````markdown {title="Source"}
{{</* social author="OINK Example" handle="@oink_example" avatar="/favicon.svg" date="2026-11-24" */>}}
One home page, two color schemes:

```gallery
![The OINK home page in light mode](/images/hero-light.webp)
![The OINK home page in dark mode](/images/hero-dark.webp)
```
{{</* /social */>}}
````

{{< social author="OINK Example" handle="@oink_example" avatar="/favicon.svg" date="2026-11-24" >}}
One home page, two color schemes:

```gallery
![The OINK home page in light mode](/images/hero-light.webp)
![The OINK home page in dark mode](/images/hero-dark.webp)
```
{{< /social >}}

A footnote reference in the body warns, as in every shortcode body. Keep footnotes in the page's own Markdown.

## Quoted posts {#quote}

Write the quoted post as a second `social` inside the body.
The inner card is compact: a smaller avatar, the name and handle on one line, and no platform icon. It keeps its own date and link.

````markdown {title="Source"}
{{</* social author="OINK Example" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/oink_example/status/1003" */>}}
Agreed. A quote that depends on a third-party embed disappears with the post.

{{</* social author="Example Reader" handle="@example_reader"
           date="2026-11-24" url="https://example.com/example_reader/status/2001" */>}}
Screenshots of posts are not searchable, and screen readers cannot read them.
{{</* /social */>}}
{{</* /social */>}}
````

{{< social author="OINK Example" handle="@oink_example" avatar="/favicon.svg"
           date="2026-11-25" url="https://example.com/oink_example/status/1003" >}}
Agreed. A quote that depends on a third-party embed disappears with the post.

{{< social author="Example Reader" handle="@example_reader"
           date="2026-11-24" url="https://example.com/example_reader/status/2001" >}}
Screenshots of posts are not searchable, and screen readers cannot read them.
{{< /social >}}
{{< /social >}}

In Markdown and LLMS output, the quoted post becomes a nested blockquote.

## Missing or invalid input {#degraded}

Invalid input warns. Whenever there is a body, the quoted words are kept.

| Input | Result |
| --- | --- |
| Neither `author` nor `handle` | Warns; the body renders as a plain blockquote, without the card |
| Empty body, with `url` | Warns; a link-only card with the author line and "View original" |
| Empty body, no `url` | Warns; nothing renders |
| Unknown `platform` | Warns; uses `x` |
| Invalid `url` | Warns; the link is dropped |
| Unknown or positional parameters | Warn; ignored |

## Hugo's `x` shortcode {#hugo-x}

Hugo ships its own `x` shortcode, `{{</* x user="…" id="…" */>}}`, and OINK leaves it untouched.
It requests the post from X's oEmbed service at build time. A clean build therefore needs network access, and the quote depends on the post still being online.
Use `social` for quotes that must build offline and stay readable. The two shortcodes have different names and do not interact.

## Rights and archiving {#rights}

A card persists after the original is deleted. That is the purpose of an offline quote.
The theme stores nothing by itself: the card shows only what you wrote into the page.
You decide what you may quote, and which avatars and media you keep in the repository. Remove `url` when the original no longer resolves.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<figure class="td-social">`: the author line as `<figcaption>`, the body in `<blockquote cite>`, and a date line; no JavaScript |
| Print | The same static card; the original URL is printed after "View original" |
| Markdown | A blockquote: the body lines, then `— Author (@handle), date, [View original](url)`; a quoted post is a nested blockquote |
| RSS | `<blockquote cite>` with the body, then an attribution line; no avatar |

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

There are no parameters for engagement counts, verification badges, image lists, or quoted posts.
Write images and quoted posts in the body.

## Limits {#limits}

- Nothing is fetched. You copy the text and save the avatar and media yourself.
- There are no likes, reposts, view counts, or verification badges. Such numbers are snapshots that go stale.
- There are no per-platform skins or brand colors. Platforms differ only by their icon.
- There are no threads, replies, or polls. Quote several posts as several cards.
- Parameters are plain text. Markdown in `author`, `handle`, or `date` appears literally.
- The theme does not check whether a static or remote avatar exists. Check the rendered card before publishing.

## Related {#related}

- [Images](/docs/components/image/) — attached images, sources, and the zoom switch
- [Gallery](/docs/components/gallery/) — several images in one post
- [Video](/docs/components/video/) — a video attached to a post
- [Cards](/docs/components/cards/) — link cards, not quotations
- [Callouts](/docs/components/callout/) — notes and warnings that are not quotations
