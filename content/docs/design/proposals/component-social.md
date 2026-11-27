---
title: "Social post component"
linkTitle: Social post component
description: A static, offline card for quoting a post from X or another social platform — author, handle, avatar, date, link, and a Markdown body — with no build-time fetch and no runtime.
weight: 29
icon: fa-solid fa-comment-dots
search_keywords: [social, x, twitter, tweet, social post, bluesky, mastodon, threads, weibo, offline embed, quote, component]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] Implemented, awaiting release
> The `social` shortcode is implemented on the theme's `main` branch
> and documented in the [Social posts guide](/docs/components/social/).
> Not yet in a tagged release. The shared decisions behind it are in the
> [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Implemented 2026-11-27 on `main`; awaiting release |
| Owner | OINK maintainers |
| Delivery stage | S3 |
| Form | Shortcode with a Markdown body: `{{</* social … */>}}…{{</* /social */>}}` |
| New public API | Shortcode `social` with `author`, `handle`, `avatar`, `date`, `url`, `platform`; locale key `ui_social_view_original` |
| Runtime | None |
| Implementation | `layouts/_shortcodes/social.html`, `layouts/_partials/content/markdown-escape-inline.html`, `assets/css/td/social.css`, fixture `tests/site/content/fixtures/social.md` |

## Summary {#summary}

```markdown
{{</* social author="OINK Example" handle="@oink_example" avatar="/logo.svg"
            date="2026-02-15" url="https://example.com/oink_example/status/1" */>}}
The post text, in ordinary **Markdown**, with its line breaks and links.

![The screenshot attached to the post](demo.webp)
{{</* /social */>}}
```

The card shows the avatar, name, handle, platform icon, body, attached images,
date, and a link to the original. Everything comes from the page; nothing is
fetched at build or view time. `platform` (default `x` on top-level cards,
`none` when nested) selects the icon for Bluesky, Mastodon, Threads, Weibo,
Zhihu, Telegram, or LinkedIn posts with the same layout, or omits the icon
with `none`.

## Problem {#problem}

Hugo's built-in `x` shortcode requests oEmbed data from X at build time (Hugo
caches the response locally, so a clean build such as CI fetches it again),
and the resulting embed loads `widgets.js` in the reader's browser. For OINK
that means:

- the build needs the network, contradicting the rule that a normal build
  downloads nothing, and fails where X is unreachable;
- readers load a third-party script with tracking and layout shift;
- the quote disappears when the post is deleted, made private, or the account
  is renamed;
- the card ignores OINK's presets, color schemes, Print, Markdown, and RSS.

The common workaround, a screenshot, is inaccessible (text in pixels), not
searchable, and absent from LLMS output.

## Design principles {#principles}

1. **A quoted post is a quotation.** It renders as
   `<figure>` + `<blockquote cite>` + attribution — an editorial card that
   reads as a citation, not a pixel copy of the platform.
2. **The page holds the content.** The author saves the text and media once;
   the theme renders what is there and never fetches.
3. **Compose the body.** Images, galleries, and quoted posts are written with
   syntax OINK already has, so the card needs no parameters for them.
4. **The platform identifies, it does not restyle.** One layout for all
   platforms; `platform` changes only the icon.
5. **Leave Hugo's names alone.** The component has its own name, so Hugo's
   embedded `x` keeps working exactly as Hugo documents it.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- A recognizable, accessible post card with zero network use and zero
  JavaScript.
- Text, links, images (with Image Zoom), multi-image grids, and one level of
  quoted post.
- The same static card in Print, and a blockquote with attribution in
  Markdown, LLMS, and RSS.

### Non-goals {#non-goals}

- Fetching anything, at build time or in the browser; the theme never calls a
  platform API.
- Overriding or changing Hugo's built-in `x` shortcode.
- Engagement counts (likes, reposts, replies, views) and verification badges.
- Per-platform skins, brand colors, or imitation of a platform's interface.
- Threads, replies, polls, or video playback inside the card. A post's video is
  written as a [Video](/docs/design/proposals/component-video/) in the body.
- GitHub issues, Hacker News, Reddit, or link-preview "bookmark" cards; their
  data shapes differ.
- A data-file form or an author registry in the first stage.

## Behavior {#design}

### Parameters {#parameters}

| Parameter | Rule | Invalid input |
| --- | --- | --- |
| `author` | Display name, plain text | Non-string: warns and ignored |
| `handle` | Plain text shown verbatim (`@name`, `@user@mastodon.social`) | Non-string: warns and ignored |
| `avatar` | Image path through `content/image-resolve.html` (`parameter="avatar"`); decorative (`alt=""`) because the name is adjacent | Unsafe scheme or non-image resource: warns naming `avatar` and drops; a static path missing from the project's own `static/` (checked only when that directory exists, after decoding and cleaning the path): warns with the ID `social:avatar-static`, which a site using module mounts or a custom `staticDir` can list in `ignoreLogs`, and keeps the path; a static path that climbs above the site root with `..`: warns and keeps the path; remote HTTPS URLs are never fetched |
| `date` | Plain text. `YYYY-MM`, or `YYYY-MM-DD` optionally followed by `T` or a space, `HH:MM`, optional `:SS`, and an optional `Z` or `±HH:MM`, on a real calendar day, becomes `<time datetime>` (the space written as `T`); anything else renders as `<span class="td-social__date">` | Non-string: warns and ignored |
| `url` | Original post, through the shared URL policy (HTTP/HTTPS with `rel="external"`, or site-internal path without `rel="external"`). Optional, so a deleted post can still be quoted | Invalid: warns and is dropped |
| `platform` | `x` (default top-level), `bluesky`, `mastodon`, `threads`, `weibo`, `zhihu`, `telegram`, `linkedin`, `none` (default nested) | Unknown, empty, or non-string: warns, uses context default |

At least one of `author` and `handle` is required. Without both, the shortcode
warns and renders the body as a plain blockquote (or a blockquote link when
the body is empty and `url` is valid), so the quoted words are not lost. With a
body, `url` survives only as the quote's `cite` attribute and is left out of
Markdown; `date`, `platform` and `avatar` are ignored. Without an avatar, a
circle shows the first grapheme cluster of `author` (or `handle`) after leading
`@`, spaces, and invisible format characters are removed, falling back to a
person icon if nothing visible remains; no
default avatar or Gravatar is requested. Named parameters only; unknown
parameters warn.

### Body {#body}

The body is rendered through `content/render-block.html` with its own ID scope:

| Content | Written as |
| --- | --- |
| Text, line breaks, links, code | Ordinary Markdown |
| One attached image | A Markdown image; it gets Image Zoom when eligible |
| Several images | A `gallery` fence inside the body (compact grid matching the card radius) |
| A quoted post | A nested `social` shortcode; `platform` defaults to `none` (or renders a compact icon + label when set explicitly); nesting deeper than one level warns |
| A video | A Video image line |

Footnote references in the body warn and stay literal, as in every shortcode
body. An empty body warns; with a valid `url` the card renders as a link-only
card (or a blockquote link if anonymous), otherwise it renders nothing.

### Rendering {#rendering}

```html
<figure class="td-social td-social--x">
  <figcaption class="td-social__author">
    <img class="td-social__avatar" src="/logo.svg" alt="" loading="lazy" decoding="async">
    <span class="td-social__names"><span class="td-social__name" dir="auto">OINK Example</span> <span class="td-social__handle" dir="ltr">@oink_example</span></span>
    <i class="td-social__platform fa-brands fa-x-twitter" aria-hidden="true"></i>
    <span class="visually-hidden"> · X</span>
  </figcaption>
  <blockquote class="td-social__body" cite="https://example.com/oink_example/status/1">…</blockquote>
  <p class="td-social__meta"><a href="https://example.com/oink_example/status/1" rel="external"><time datetime="2026-02-15">2026-02-15</time> · View original<span class="visually-hidden"> — OINK Example</span></a></p>
</figure>
```

| Platform | Icon (vendored Font Awesome 7.3.1) |
| --- | --- |
| `x` | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `zhihu` | `fa-brands fa-zhihu` |
| `telegram` | `fa-brands fa-telegram` |
| `linkedin` | `fa-brands fa-linkedin` |
| `none` | None |

The icon is decorative and monochrome; the platform name is available to
assistive technology as visually hidden text when present. The card uses
elevated surface tokens (`--td-brand-elev`) with `--bs-body-bg` for nested
quotes, keeps body typography independent of `blockquote`'s Kai rule, and
follows each preset's geometry (0px in Ink, 2px and square avatar in
Terminal). Print maps the card to `--td-print-*` tokens regardless of screen
color mode and prints the original URL after the link. RTL mirrors through
logical properties while isolating LTR handles and ISO timestamps; long
handles and URLs wrap.

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML | The card; no runtime. Body images opt into the shared Image Zoom as usual |
| Print | The static card on the paper palette with the URL visible |
| Markdown / LLMS | A blockquote: the body lines, then ``— OINK Example (`@oink_example`) · X · 2026-02-15 · [View original](url)``; a nested post becomes a nested blockquote. Attribution text goes through `content/markdown-escape-inline.html` |
| RSS | A `<figure>` with `<blockquote cite>` (omitted on link-only cards) and an attribution line using absolute URLs; no avatar |

### Hugo's own `x` {#hugo-x}

Hugo's embedded `x` shortcode remains available and unchanged: it fetches
oEmbed data at build time and loads X's script in the browser. OINK does not
intercept it. The guide recommends `social` for offline, permanent quotes.

Overriding `x` was the first plan and was rejected after a probe on Hugo
0.170.1: a shortcode template that reads `.Inner` makes Hugo's parser require
every call to be closed or self-closed, so Hugo's documented unclosed form
`{{</* x user="…" id="…" */>}}` would fail to build
(`shortcode "x" must be closed or self-closed`) before any template could warn.

### Rights and archiving {#rights}

The theme stores nothing by itself. Authors decide what they may quote and
which avatars and media they may keep; the guide says so. A card persists after
the original is deleted, which is the point of offline quoting; `url` is
optional so the author can drop a link that no longer resolves.

## Trade-offs and alternatives {#alternatives}

| First-draft element | Decision | Reason |
| --- | --- | --- |
| The name `x`, replacing Hugo's built-in | Renamed `social` (owner, 2026-11-27) | No conflict with Hugo, no parse failure for existing `x` calls, and the name reads naturally for every platform |
| `likes`, `reposts`, `replies`, `views` | Removed | Snapshots that go stale and mislead; four locale keys |
| `verified` (blue, gold, gray) | Removed | Platform-specific, changes over time, and implies verification the theme cannot perform |
| `images` and `image_alts` lists | Replaced by body images and `gallery` | Alt text stays next to each image; Zoom, processing, and resolution come for free |
| `quote_author`, `quote_handle`, `quote_date`, `quote_url`, `quote_text` | Replaced by a nested `social` | Same parameters, same rules, no parallel set |
| `data=` file form | Removed | A data file per post is a second authority; a helper can write shortcode text |
| `data/x_authors.yaml` registry and automatic `assets/avatars/<handle>.*` lookup | Removed for now | `avatar="avatars/name.jpg"` already shares one global file; implicit file lookups are hard to discover |
| `github`, `hackernews`, `reddit` platforms | Removed | Titles, threads, and missing avatars are a different component |
| Automatic handle prefixes per platform | Removed | Handles are shown as written |
| Per-platform styles | One layout | Presets own color; platform redesigns would otherwise date the theme |

## Companion helper {#helper}

Writing the parameters by hand is the main friction. A future
`oink fetch social <url>` in `../oink-cli` could, once at writing time,
download the avatar and media into the page bundle and print a ready
`social` shortcode. It is outside this proposal and needs its own `oink-cli`
proposal, because the endpoints it would use are unofficial, may change or be
restricted, and raise terms-of-use questions. The theme never depends on it.

## Compatibility {#compatibility}

- A new shortcode name; Hugo's built-in shortcodes are untouched.
- The shortcode count grows from 29 to 30.

## Implementation and checks {#implementation}

| Part | Where |
| --- | --- |
| Template | `layouts/_shortcodes/social.html` (shared parameter, URL, image and block-rendering partials; static Markdown, Print and RSS branches) |
| Styles | `assets/css/td/social.css` |
| Locale | `ui_social_view_original` in all 32 catalogs |
| Fixture | `tests/site/content/fixtures/social.md` and its Chinese peer, pinned by HTML, Markdown and Print goldens |
| Invalid input | Fifteen `social-*` cases plus `check_social_posts()` and template/CSS contract checks in `bin/check-content-primitives.py`, and Playwright coverage in `tests/browser/social.spec.mjs` |
| Guide | [Social posts](/docs/components/social/) |

## Acceptance criteria {#acceptance}

- A build with network access disabled renders every fixture.
- No `social` page requests anything from a platform host, at build or view time.
- Markdown and LLMS contain a readable blockquote with attribution and no
  component HTML.
- Invalid input warns and keeps the quoted words whenever a body exists.
- Preset, color-scheme, narrow-screen, RTL, forced-colors, and print reviews
  pass.

## Open decisions {#open-decisions}

1. **Platform list.** Expanded to `x`, `bluesky`, `mastodon`, `threads`,
   `weibo`, `zhihu`, `telegram`, `linkedin`, and `none`. Add another platform
   only with a vendored icon and an author request.
2. **Author registry.** Recommended: not yet; reconsider after real pages show
   repeated metadata.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** Offline `x` with a platform enum of eight,
  metrics, verification badges, image and quote parameter sets, a data-file
  form, and an author registry.
- **2026-11-27 (review).** Reduced to six parameters and a composed Markdown
  body; recorded the verified parse failure for legacy `x` calls.
- **2026-11-27 (owner).** Renamed to `social` to avoid conflicting with Hugo's
  `x`; `platform` keeps the other platforms.
- **2026-11-27 (implementation).** Implemented as specified, with the platform
  name added as visually hidden text and the print rule showing the original
  URL after the link.
- **2026-11-27 (deep review & hardening).** Fixed dark-mode print cutout,
  nested CSS specificity, RTL BiDi isolation, nested platform SR symmetry,
  anonymous empty+url output, HTML5 `<time>` validation, grapheme initial
  slicing, compact card gallery layout, CJK body font isolation, forced-colors
  avatar border, offline `static/` avatar warning, and context-aware Markdown
  inline escaping; added `zhihu`, `telegram`, and `none` platforms and
  Playwright regression coverage.
- **2026-11-27 (adversarial review).** Initials skip invisible leading
  characters (zero-width space, BOM, bidi marks, any Unicode space); the static
  avatar check decodes and cleans the path, warns on `..` above the site root,
  and makes its missing-file warning suppressible as `social:avatar-static`;
  Markdown ends every card with a blank line so adjacent cards stay separate
  quotations; the guide's date, avatar-resolution and anonymous-card wording
  now matches the implementation.
