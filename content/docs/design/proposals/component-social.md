---
title: "Social post component"
linkTitle: Social post component
description: A static, offline card for quoting a post from X or another social platform, written as a `> [!SOCIAL]` callout — author, handle, avatar, date, link, and a Markdown body — with no build-time fetch and no runtime.
weight: 29
icon: fa-solid fa-comment-dots
search_keywords: [social, x, twitter, tweet, social post, bluesky, mastodon, threads, weibo, offline embed, quote, callout, component]
design_kind: proposal
design_status: accepted
proposal_date: 2026-11-27
---

> [!NOTE] Shipped in OINK 1.8.0 as `> [!SOCIAL]`
> The `> [!SOCIAL]` callout form ships in OINK v1.8.0. The
> [Social posts guide](/docs/components/social/) documents it, the
> [Components contract](/docs/design/components/#timeline-media-social-and-maps)
> governs it, and shared decisions are in the
> [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Accepted and shipped in OINK v1.8.0 (`> [!SOCIAL]` callout form, 2026-11-28) |
| Owner | OINK maintainers |
| Delivery stage | S3 |
| Form | Callout with a Markdown body: ``> [!SOCIAL] Name `@handle` `` plus a block attribute line |
| Public API | Callout type `social`; title as the identity line; attributes `avatar`, `date`, `url`, `platform`; locale key `ui_social_view_original` |
| Runtime | None |
| Implementation | `layouts/_markup/render-blockquote-alert.html`, `layouts/_partials/content/social.html`, `assets/css/td/social.css`, fixture `tests/site/content/fixtures/social.md`, migration `bin/migrations/oink06/transforms/social.py` |

## Summary {#summary}

```markdown
> [!SOCIAL] OINK Example `@oink_example`
>
> The post text, in ordinary **Markdown**, with its line breaks and links.
>
> ![The screenshot attached to the post](demo.webp)
{avatar="/logo.svg" date="2026-02-15" url="https://example.com/oink_example/status/1" platform="x"}
```

The card shows the avatar, name, handle, platform icon, body, attached images,
date, and a link to the original. Everything comes from the page; nothing is
fetched at build or view time. `platform` (default `none`) selects the icon
for X, Bluesky, Mastodon, Threads, Weibo, Zhihu, Telegram, or LinkedIn posts
with the same layout. Outside Hugo the source is an ordinary blockquote, so
GitHub, an editor preview, or Obsidian shows the name, text, images, and any
quoted post.

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

The v1.7.0 `social` shortcode solved those, but its source read poorly outside
Hugo: in plain Markdown the opening tag and the first line of the post merge
into one paragraph, the closing tag hangs off the last one, and a parameter
avatar never shows. Its Markdown output also needed a second, hand-built
attribution renderer.

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
6. **Markdown first.** A quoted post is a blockquote with attribution, which
   Markdown already writes. The callout title is the one slot Goldmark hands
   over separately, so it carries the identity line, and block attributes
   carry the facts Markdown has no syntax for.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- A recognizable, accessible post card with zero network use and zero
  JavaScript.
- Text, links, images (with Image Zoom), multi-image grids, and one level of
  quoted post.
- The same static card in Print, the author's own blockquote in Markdown and
  LLMS, and a blockquote with attribution in RSS.
- A source that reads as a quotation in any Markdown viewer.

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

### Title and attributes {#parameters}

| Part | Rule | Invalid input |
| --- | --- | --- |
| Title | The identity line, rendered as written with inline Markdown. Each code span becomes the handle (`<span class="td-social__handle" dir="ltr">`); the rest is the name | Missing: see below |
| `avatar` | Image path through `content/image-resolve.html` (`parameter="avatar"`); decorative (`alt=""`) because the name is adjacent | Unsafe scheme or non-image resource: warns naming `avatar` and drops; a static path missing from the project's own `static/` (checked only when that directory exists, after decoding and cleaning the path): warns with the ID `social:avatar-static`, which a site using module mounts or a custom `staticDir` can list in `ignoreLogs`, and keeps the path; a static path that climbs above the site root with `..`: warns (`social:avatar-static`), is dropped, and the card draws the initial; remote HTTPS URLs are never fetched |
| `date` | Plain text. `YYYY-MM`, or `YYYY-MM-DD` optionally followed by `T` or a space, `HH:MM`, optional `:SS`, and an optional `Z` or `±HH:MM`, on a real calendar day, becomes `<time datetime>` (the space written as `T`); anything else renders as `<span class="td-social__date">` | — |
| `url` | Original post, through the shared URL policy (HTTP/HTTPS with `rel="external"`, or site-internal path without `rel="external"`). Optional, so a deleted post can still be quoted | Invalid: warns and is dropped |
| `platform` | `x`, `bluesky`, `mastodon`, `threads`, `weibo`, `zhihu`, `telegram`, `linkedin`, `none` (default at every depth) | Unknown or empty: warns, uses `none` |

`content/attributes.html` validates the attribute line: `class`, `data-*` and
`aria-*` pass to the figure, and any other name warns. Attribute values are
strings, so the shortcode's type warnings have no counterpart. A `+` or `-`
fold marker warns and is ignored.

A title is required. Without one, the callout warns and renders the body as a
plain blockquote (or a blockquote link when the body is empty and `url` is
valid), so the quoted words are not lost. With a body, `url` survives only as
the quote's `cite` attribute; `date`, `platform` and `avatar` are ignored.
Without an avatar, a circle shows the first grapheme cluster of the title's
plain text after leading `@`, spaces, and invisible format characters are
removed, falling back to a person icon if nothing visible remains; no default
avatar or Gravatar is requested.

The render hook cannot see an enclosing callout, which is why the default
platform is the same at every depth instead of `x` on top-level cards.

### Body {#body}

The body is the callout's own Markdown, rendered with the page:

| Content | Written as |
| --- | --- |
| Text, line breaks, links, code | Ordinary Markdown |
| One attached image | A Markdown image; it gets Image Zoom when eligible |
| Several images | A `gallery` fence inside the body (compact grid matching the card radius) |
| A quoted post | A nested `> [!SOCIAL]`, whose attribute line carries one `>`; it is styled by the `.td-social .td-social` descendant selector |
| A video | A Video image line |

Footnotes in the body resolve like any page footnote. An empty body warns;
with a valid `url` the card renders as a link-only card (or a blockquote link
without a title), otherwise it renders nothing.

### Rendering {#rendering}

```html
<figure class="td-social td-social--x">
  <figcaption class="td-social__author">
    <img class="td-social__avatar" src="/logo.svg" alt="" loading="lazy" decoding="async">
    <span class="td-social__names" dir="auto">OINK Example <span class="td-social__handle" dir="ltr">@oink_example</span></span>
    <i class="td-social__platform fa-brands fa-x-twitter" aria-hidden="true"></i>
    <span class="visually-hidden"> · X</span>
  </figcaption>
  <blockquote class="td-social__body" cite="https://example.com/oink_example/status/1">…</blockquote>
  <p class="td-social__meta"><a href="https://example.com/oink_example/status/1" rel="external"><time datetime="2026-02-15">2026-02-15</time> · View original<span class="visually-hidden"> — OINK Example @oink_example</span></a></p>
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
| Markdown / LLMS | The callout exactly as written, with its attribute line; a nested post stays a nested blockquote |
| RSS | A `<figure>` with `<blockquote cite>` (omitted on link-only cards) and an attribution line using absolute URLs, the handle as plain text; no avatar |

### Hugo's own `x` {#hugo-x}

Hugo's embedded `x` shortcode remains available and unchanged: it fetches
oEmbed data at build time and loads X's script in the browser. OINK does not
intercept it. The guide recommends the `[!SOCIAL]` callout for offline,
permanent quotes.

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
| The `social` shortcode with six parameters (shipped in v1.7.0) | Replaced by the `[!SOCIAL]` callout (owner, 2026-11-28) | The source reads as a quotation in any Markdown viewer, Markdown and LLMS output is the source itself, and footnotes, Image Zoom and other hooks apply to the body without a block renderer |
| A plain blockquote with a closing `— Author` line and `{.social}` | Rejected | The hook would have to parse the attribution out of rendered HTML to lay out the header and the date line |
| An avatar written as a Markdown image in the title | Rejected | A probe on Hugo 0.170.1 shows that an image ends the alert title: text after it moves into the body, and a trailing image leaves an empty paragraph |
| The date link written in the title | Rejected | It would hide the date and URL in a presentation string and lose `<time>`, `cite`, and the RSS absolute URL |
| Reusing `[!QUOTE]` with social attributes | Rejected | Attributes would decide whether one type renders as a callout box or a card |

## Companion helper {#helper}

Writing the parameters by hand is the main friction. A future
`oink fetch social <url>` in `../oink-cli` could, once at writing time,
download the avatar and media into the page bundle and print a ready
`[!SOCIAL]` callout. It is outside this proposal and needs its own `oink-cli`
proposal, because the endpoints it would use are unofficial, may change or be
restricted, and raise terms-of-use questions. The theme never depends on it.

## Compatibility {#compatibility}

- v1.7.0 added the `social` shortcode, taking the count from 29 to 30.
- The callout form removes it again (30 back to 29) and adds the `social`
  callout type. A page that still calls the shortcode fails to build with
  `template for shortcode "social" not found`.
- `bin/migrations/oink06.py migrate --only social` rewrites every call:
  `author` becomes the title text, `handle` a code span, the other parameters
  the attribute line, and a nested call a nested callout. It writes
  `platform="x"` on top-level cards that relied on the shortcode's default and
  reports calls it cannot express. On vonng.com it converted 492 calls (89
  nested) in 149 files with no findings, and 88 cards rendered from four
  converted bundles matched the v1.7.0 cards in platform, nesting, images,
  links, dates and visible text.
- Block attributes need `markup.goldmark.parser.attribute.block: true`, which
  OINK already requires.

## Implementation and checks {#implementation}

| Part | Where |
| --- | --- |
| Template | `layouts/_partials/content/social.html`, reached from the `social` branch of `layouts/_markup/render-blockquote-alert.html` (shared attribute, URL and image partials; static Print and RSS branches) |
| Styles | `assets/css/td/social.css` |
| Locale | `ui_social_view_original` in all 32 catalogs |
| Fixture | `tests/site/content/fixtures/social.md` and its Chinese peer, pinned by HTML, Markdown, Print and RSS goldens |
| Invalid input | Thirteen `social-*` cases plus `check_social_posts()` and template/CSS contract checks in `bin/check-content-primitives.py`; `bin/check-components.py` keeps the shortcode deleted and failing as missing; Playwright coverage in `tests/browser/social.spec.mjs` |
| Migration | `bin/migrations/oink06/transforms/social.py`, frozen by `tests/migrations/test_oink06.py` |
| Guide | [Social posts](/docs/components/social/) |

## Acceptance criteria {#acceptance}

- A build with network access disabled renders every fixture.
- No `social` page requests anything from a platform host, at build or view time.
- Markdown and LLMS contain the source callout and no component HTML.
- A plain Markdown viewer shows the name, handle, body, images and quoted post
  as a blockquote.
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
- **2026-11-28 (owner).** Markdown first: what Markdown can present is not
  converted. The shortcode's source read poorly in plain Markdown, so the card
  becomes the `> [!SOCIAL]` callout; the title is the identity line with the
  handle as a code span, and `avatar`, `date`, `url` and `platform` become
  block attributes. Probes on Hugo 0.170.1 confirmed that the title keeps
  inline Markdown, that attributes attach directly under a callout and under a
  nested one with a single `>`, and that an image cannot sit in the title.
- **2026-11-28 (implementation).** The shortcode and
  `content/markdown-escape-inline.html` are deleted; the card renders from
  `content/social.html`; `platform` defaults to `none` at every depth because
  the hook cannot see a parent; nested styling moves to a descendant selector
  and the deeper-nesting warning is dropped; Markdown and LLMS keep the
  source; the migration toolkit gains a `social` transformation.
