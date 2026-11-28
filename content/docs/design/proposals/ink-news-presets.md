---
title: "Ink and News: the written page and the printed page"
linkTitle: Ink and News
description: A partly implemented proposal that makes Ink the written style and News the printed style, with font coverage, light and dark palettes, detail specifications and acceptance gates.
weight: 65
icon: fa-solid fa-feather-pointed
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-11-28
---

> [!NOTE] Shipped in OINK v1.8.0 (2026-11-28)
> Most of this proposal is implemented and ships in OINK v1.8.0; three parts
> remain open, see the [implementation record](#implementation-record). Current
> behavior is defined by the
> [architecture contract](/docs/design/architecture/#visual-presets) and the
> [visual presets decision](/docs/design/decisions/visual-presets/).

## Status and surface {#status}

**Status and date**: drafted 2026-11-28 and partly implemented in OINK v1.8.0

**Owner**: OINK maintainer

**Baseline**: OINK v1.7.0 plus the v1.8.0 preset pass: `newsprint` is renamed
`news`; the menu puts Paper, Slate and GitHub above Ink, News and Terminal; dark Terminal
becomes a phosphor screen; Ink takes Kai headings, Song text and Palatino for Latin. The
[visual presets decision](/docs/design/decisions/visual-presets/) records these changes.

**Affected contracts**: [Architecture · Visual presets](/docs/design/architecture/#visual-presets),
[Visual presets decision](/docs/design/decisions/visual-presets/)

**Affected implementation**: `assets/css/td/tokens-typography.css`, `assets/css/td/brand.css`
(local font aliases), `assets/css/td/experimental-presets.css`, `assets/css/td/print.css`,
`layouts/_partials/_funcs/preset-canvases.html`, `assets/css/giscus-ink-*.css`,
`assets/css/giscus-news-*.css`, `bin/check-presets.py`

**Release intent**: OINK v1.8.0; both presets stay explicitly selected

## Context and evidence {#context}

Four of the six presets have settled roles. Paper is the default warm paper surface, Slate is
the technical look OINK has had since 1.1, GitHub reproduces how GitHub renders a README, and
Terminal is a terminal: an engineering handbook in light mode and a phosphor screen in dark
mode. The remaining two, Ink and News, both draw on paper and serif type, and they blur
together.

- **Ink** in 1.7.0 is a sans-serif editorial style: white ground, black text, a red accent. It
  reads like Hextra and other modern documentation themes, and it is hard to tell apart from
  Paper and GitHub. The working-tree draft turns it into brush writing.
- **News** is the ivory Paper of 1.7.0, after Typora's Newsprint theme. Its serif text, Song,
  Kai quotations and ivory sheet overlap heavily with a brush-written Ink. The draft dark News
  is an evening paper by candlelight: a warm brown ground, parchment-colored text and gold
  links, which uses the parchment and gold that Ink wants.

This proposal draws one line between them: **Ink is written, News is printed.**

### Font coverage {#font-coverage}

The theme ships no font files and can only name fonts the reader already has. What each
platform preinstalls decides how many readers see the design as drawn. The table follows the
official font lists of Microsoft, Apple, AOSP, Ubuntu and Fedora as of 2026-11-28. "With
Chinese" means the Chinese (Simplified) Supplemental Fonts that Windows installs when Chinese
is added; "on demand" means a download, which macOS may make by itself when the system
language is Chinese, though Apple does not document it.

| Font class | Windows, Chinese | Windows, English | macOS | iOS / iPadOS | Android | Linux desktop |
| --- | --- | --- | --- | --- | --- | --- |
| Hei (sans) | Microsoft YaHei | Microsoft YaHei | Hiragino Sans GB, STHeiti (PingFang on demand since macOS 15) | PingFang (on demand) | Noto Sans CJK | Noto Sans CJK |
| Song (serif) | SimSun | SimSun | Songti SC (preinstalled) | Songti SC (on demand) | Noto Serif CJK, only as the `serif` fallback | Noto Serif CJK |
| Fangsong | FangSong | none (with Chinese) | STFangsong (on demand) | on demand | none | none |
| Kai | KaiTi | none (with Chinese) | Kaiti SC (on demand) | on demand | none | AR PL UKai on Ubuntu installed in Chinese |
| Palatino | Palatino Linotype | Palatino Linotype | Palatino | Palatino | none | URW P052 |
| Calligraphic | Gabriola, Segoe Script | same | Apple Chancery, Zapfino, Snell Roundhand | Zapfino, Snell Roundhand (Apple Chancery on demand) | Dancing Script, only as `cursive` | URW Z003 |
| Newspaper serif | Times New Roman, Georgia | same | Times New Roman, Georgia, Charter, Didot | Times New Roman, Georgia, Charter, Didot | Noto Serif | Liberation Serif |

Three conclusions follow:

1. **No Chinese face exists on every platform.** By class, only Hei is everywhere; Song is
   nearly everywhere except iOS, where Chinese serif text probably falls back to PingFang;
   that is unverified.
2. **Fangsong and Kai have identical reach.** Chinese Windows has both, macOS readers must
   download them, and phones and most Linux systems have neither. "Fangsong first, Song as the
   fallback" therefore works, but only readers on Chinese Windows or a Mac with the font
   downloaded see Fangsong. Everyone else sees Song.
3. **Lookup by name and `local()` give different results.** On 2026-11-28, on a Mac where Kai
   had been downloaded, WebKit did not match `font-family: "Kaiti SC"` while Chromium did.
   Through an `@font-face` alias with `local("Kaiti SC")`, both engines matched it. The
   theme's `OINK Kai` already uses an alias; Fangsong should do the same.

## Goals and non-goals {#goals}

**Goals**

- Ink and News are distinguishable at a glance in light and dark mode, on Chinese and Latin
  pages.
- Each has its own dark mode. Dark mode changes colors and a few details, never fonts.
- The six dark modes do not collide: Slate and GitHub already hold blue-black, Paper holds warm
  grey, and Terminal holds phosphor green.
- When Kai and Fangsong are missing, the two presets stay distinguishable; the style must not
  rest on fonts alone.

**Non-goals**

- No font files, image assets or runtime scripts.
- No vertical text, ink-wash backgrounds, cloud ornaments, images of brush lettering or seal
  images.
- No changes to Paper, Slate, GitHub or Terminal.
- No configuration renames: `ink` and `news` stay as they are.

## The dividing line {#distinction}

| Aspect | Ink · written | News · printed |
| --- | --- | --- |
| Metaphor | A scroll written by one hand: xuan paper or parchment | A page set in columns by machine: newsprint and press ink |
| Rhythm | Open: one column, a deep top margin | Dense: masthead, kicker, deck, column rules |
| Hierarchy by | Changing the letterform: Kai, italic, a red initial; no bold | Changing weight: heavy headlines, light decks, thick-and-thin rules |
| Chinese | Kai headings, Fangsong text (Song when missing), red emphasis dots | Bold Song headlines (heavy Hei on Windows), Song text, bold emphasis |
| Latin | Palatino text and italic headings; calligraphic faces only for titles, initials and the wordmark | Charter / Georgia text, Times New Roman Bold headlines, a Didot masthead |
| Color | Paper with two inks: black and vermilion | Grey newsprint, press black and one spot blue |
| Where the reader is | A vermilion dot | A black column rule and bold |
| Dark mode | Gold on indigo paper | Darkroom |

When Kai and Fangsong are both missing, Ink's Chinese falls back to Song, the same class
News uses. Four differences remain: Ink headings stay at regular weight with open spacing
while News headlines take the heaviest weight with tight spacing; Ink marks emphasis with
vermilion dots while News uses bold; Ink has a paper color with a radial shade while News is
flat grey newsprint; Ink has no rules while News has them everywhere.

## Ink: the written page {#ink}

### Type {#ink-type}

| Role | Chinese | Latin | Note |
| --- | --- | --- | --- |
| Display (page title, Landing hero) | `OINK Kai` | Apple Chancery → Gabriola → URW Z003 → Palatino Italic | Calligraphic faces at large sizes only; never the generic `cursive`, which Chrome on Windows resolves to Comic Sans |
| Headings (h2–h4) | `OINK Kai` | Palatino Italic | Zapf drew this italic from Renaissance chancery hands |
| Text | `OINK Fangsong` → Song | Palatino → Palatino Linotype → URW P052 → TeX Gyre Pagella | Fangsong is enlarged 8%, for Han only |
| Quotation | `OINK Kai` | Palatino Italic | The shared quotation role |
| Interface (navigation, search, menus) | Platform Hei | Platform sans | Song and Kai thin out at control sizes |
| Code | Shared mono | Shared mono | Unchanged |

- **Add an `OINK Fangsong` alias.** It follows `OINK Kai`: `local()` names STFangsong, then
  Windows FangSong; `unicode-range` covers only Han and full-width punctuation; and
  `size-adjust: 108%` makes up for Fangsong's light, small design. Both Fangsong faces have only
  a regular weight, so emphasis does not use bold (see the emphasis dots below).
- **Kai headings stay at regular weight.** Only macOS Kaiti SC has a true bold; Windows KaiTi
  does not, and synthesized bold looks poor. Headings rank by size and space.
- **No Papyrus.** It is the best-known overused "ancient" typeface, and Windows, Android and
  Linux do not have it. For a rougher look, Luminari and Trattatello on macOS can serve as
  display alternatives, outside the default stack.

### Color {#ink-color}

The light palette, "xuan paper and vermilion", uses a manuscript's two inks: black for writing
and vermilion for marking.

| Token | Value | Contrast on the darkest edge `#e8dabd` |
| --- | --- | --- |
| Paper (canvas) | `#f3ead7` | — |
| Paper edge (end of the radial shade) | `#e8dabd` | — |
| Code ground | `#e9dcc1` | — |
| Ink (text) | `#241a10` | 12.35:1 |
| Light ink (secondary) | `#574634` | 6.52:1 |
| Pale ink (tertiary) | `#6e5c47` | 4.63:1 |
| Vermilion (accent) | `#a8321b` | 4.84:1 |
| Seal (wordmark ground) | `#b8371d`, paper-colored text | 4.88:1 |

Links keep the text ink with a vermilion underline and turn vermilion on hover.

### Details {#ink-details}

- **Vermilion dot**: the current navigation item gets a vermilion dot instead of a tinted row.
- **Emphasis dots**: Chinese `strong` is not bold. It takes `text-emphasis: filled dot` in
  vermilion under each character, the traditional Chinese mark of emphasis, scoped to
  `:lang(zh)`. The cost is that Latin letters inside the same `strong` get dots too.
- **Initial**: the first letter of the first paragraph is set three lines tall in a
  calligraphic face and vermilion, in Blog and Book text only, not Docs. Its float uses logical
  properties, so RTL pages mirror it.
- **Seal**: the wordmark may sit in a vermilion box like a seal impression. This is the detail
  most likely to look kitsch; whether it is on by default is open.
- **Paper**: a radial shade lies over the canvas, paper-colored at the center and slightly
  darker at the edges. No noise image; print drops it.
- **Top margin**: more space above the page title.
- **Red stays small**: dots, emphasis marks, the initial, the seal and underlines. Headings are
  never red; Fangsong text under a red title reads as a Chinese government circular.

The brush details already in the working-tree draft (a tapered stroke opening each section, a
short dash for `hr`, quotations hung on a fading vermilion stroke) fit this direction and can
stay.

### Dark: gold on indigo paper {#ink-dark}

This palette follows sutras written in gold and silver on deep indigo-violet paper. East Asia
wrote sutras in gold on indigo paper and Europe wrote gold on purple parchment, two traditions
that arrived at the same practice, so the palette suits Chinese and Latin pages alike.

| Token | Value | Contrast on the darkest edge `#120f22` |
| --- | --- | --- |
| Indigo paper (canvas) | `#1b1730` | — |
| Paper edge | `#120f22` | — |
| Code ground | `#241f3d` | — |
| Silver (text) | `#e3ddd0` | 13.89:1 |
| Gold (headings and accent) | `#dcb766` | 9.85:1 |
| Secondary | `#b4ad9f` | 8.43:1 |
| Tertiary | `#958e82` | 5.79:1 |
| Seal, lifted | `#e06a4c`, text in the paper color | 5.23:1 |

The initial, emphasis dots and the current-position dot turn gold. The seal stays red, as
collectors' seals on such sutras are.

The draft dark Ink is a stone rubbing: a blue-black ground, paper-colored text and a vermilion
seal. It ties more directly to calligraphy, since calligraphers learn from rubbings, but its
palette is close to a generic dark theme and hard to tell from Paper's warm grey dark
(`#161513`). This proposal recommends gold on indigo and keeps the rubbing as the alternative.

## News: the printed page {#news}

### Type {#news-type}

| Role | Chinese | Latin | Note |
| --- | --- | --- | --- |
| Masthead (wordmark) | Bold Song | Didot → Bodoni 72 → Times New Roman | Only macOS has Didot |
| Headlines | Songti SC Black / Bold → Microsoft YaHei Bold | Times New Roman Bold | Times was drawn for The Times |
| Text | Song | Charter → Iowan Old Style → Georgia → Cambria | The current stack |
| Kicker, byline, table heads, interface | Platform Hei | Platform sans, uppercase and spaced | Papers set section labels and datelines in a sans |
| Quotation | `OINK Kai` | Serif italic | As today |

The deck (the page description) is italic in Latin. Han has no true italic, so a Chinese deck
stays upright.

### Color {#news-color}

The light palette, "newsprint", is grey newsprint, press black and a single spot color.

| Token | Value | Contrast on the code ground `#e6e3da` |
| --- | --- | --- |
| Newsprint (canvas) | `#f0eee8` | — |
| Code ground | `#e6e3da` | — |
| Press black (text) | `#161616` | 14.10:1 |
| Secondary | `#4a4844` | 7.11:1 |
| Tertiary | `#625f59` | 4.96:1 |
| Spot blue (links and accent) | `#1f4f7a` | 6.66:1 |

The current clay accent (`#9b4a28`) and Ink's vermilion are both red-brown and hard to tell
apart side by side, so News moves to a single spot blue. The newsprint is greyer and darker
than Paper's `#f7f6f3`, and further from Ink's yellower paper.

### Details {#news-details}

- **Masthead**: a double rule under the site header. The specimen's date and edition between
  the lines would need new markup and are not implemented.
- **Kicker, deck and byline**: the section name as a kicker above the headline in spot color
  and capitals; the page description as a deck below it; the byline and date between two thin
  rules. The current markup has the deck (`.lead`) and the date line (`.td-article-info`) but
  no kicker, which would need new markup and is not implemented.
- **Thick-and-thin rule**: a heavy rule over a thin rule above each h2, in place of Ink's brush
  stroke.
- **Pull quote**: a heavy rule above and a thin rule below, a step larger, with no left bar.
  Quotations in documentation often run to several paragraphs, and centering would hurt
  them, so they keep their start alignment.
- **Column rules**: Blog lists and section indexes set in columns with `column-rule` on wide
  screens. Article text stays in one column, because code blocks do not survive columns. Blog
  lists switch between cards, a table and a gallery at runtime, so columns are not
  implemented.
- **Tables**: a press-black rule above and below, tabular figures, uppercase heads.
- **Where the reader is**: a black column rule and bold on the current navigation item, with no
  color.
- **No drop cap**: the initial belongs to Ink.

### Dark: the darkroom {#news-dark}

The darkroom where a newspaper developed its photographs: true black, the grey of silver
prints and the orange of the safelight.

| Token | Value | Contrast on the code ground `#1a1a1a` |
| --- | --- | --- |
| Ground | `#0f0f0f` | — |
| Code ground | `#1a1a1a` | — |
| Silver (text) | `#d8d6d1` | 11.98:1 |
| Headlines | `#f3f1ec` | 15.42:1 |
| Secondary | `#a4a19a` | 6.75:1 |
| Tertiary | `#8a877f` | 4.85:1 |
| Safelight orange (links and accent) | `#f2804a` | 6.60:1 |

A faint orange radial glow (7% opacity) sits in the top corner, on screen only. Safelight
orange sits about 20° redder than Ink's dark gold and is more saturated, so the two stay
distinct side by side.

The draft evening paper by candlelight uses a warm brown ground, parchment text and gold
links, and parchment and gold belong to Ink in this proposal. Its warm brown is also close to
Paper's dark ground. This proposal recommends the darkroom. If a monochrome mood is preferred,
microfilm is the alternative: a neutral black ground, silver-grey text and the spot blue lifted
for links.

## The six dark modes {#dark-lineup}

| Preset | Canvas | Text | Accent | Image |
| --- | --- | --- | --- | --- |
| Paper | `#161513` | `#ece9e3` | `#7db5e6` | Warm grey |
| Slate | `#0b1119` | `#e8eef6` | `#5da2dd` | Cool blue-black |
| GitHub | `#0d1117` | `#f0f6fc` | `#4493f8` | Primer dark |
| Ink (proposed) | `#1b1730` | `#e3ddd0` | `#dcb766` | Gold on indigo paper |
| News (proposed) | `#0f0f0f` | `#d8d6d1` | `#f2804a` | Darkroom |
| Terminal | `#020703` | `#7ee89a` | `#3dff7a` | Phosphor screen |

## Other scripts {#other-scripts}

Ink's principle of writing applies to every script: the display and heading roles use an
installed face from that script's calligraphic or handwritten tradition, and the text uses
the script's book face. Where no such face exists, the book face is enough. Japanese and Korean
would need their own `:lang(ja)` and `:lang(ko)` stacks, or Han characters take Chinese forms.
Preset font roles may only sit on the bare root selector, so that `typography: system` and
`params.ui.fonts` still override them, so those stacks are not implemented and Japanese and
Korean keep the theme's existing handling. The Arabic and Hebrew calligraphic faces join the
heading stacks by glyph fallback, which gives Persian Thuluth rather than Nastaliq.

| Script | Display and headings | Text |
| --- | --- | --- |
| Japanese | Kyokasho (Windows UD Digi Kyokasho; macOS on demand) | Mincho |
| Korean | Gungsuh (Windows; macOS on demand) | Myeongjo / Batang |
| Arabic | Thuluth (macOS Diwan Thuluth) | Naskh |
| Persian | Nastaliq (Noto Nastaliq Urdu, preinstalled on macOS) | Naskh |
| Hebrew | Corsiva Hebrew (macOS) | System Hebrew serif |
| Cyrillic | Palatino Italic (the calligraphic faces lack Cyrillic) | Palatino |
| Devanagari, Bengali | No suitable calligraphic face; the text face | System face |

News needs no per-script rules: each script uses its book serif and bold headlines.

## Output, accessibility and security {#boundaries}

- **Contrast**: every text color is checked against the darkest point of the canvas, the end
  of the radial shade, not the paper color at the center. `check-presets.py` must include that
  end color in its AA checks.
- **Print**: the paper shade, glow, initial color and seal are dropped; print keeps each
  preset's existing print palette.
- **Forced colors**: shades, emphasis-mark color and rule color yield to system colors; the
  emphasis marks themselves stay.
- **RTL**: the initial's float and the navigation dot use logical properties.
- **Markdown, LLMS and RSS**: unaffected; they carry no preset styling.
- **Network and assets**: no font files, images or external requests; `local()` aliases take
  effect only where the reader has the font.

## Compatibility and migration {#compatibility}

- `ink` shipped in 1.7.0. Sites that set `preset: ink` or list `ink` in the menu will see a
  clear change. It is an explicitly selected experiment, so this is acceptable, but
  `CHANGELOG.md` must say so.
- `news` has not shipped, so changing it has no compatibility cost.
- The reserved name `folio` was held for a serif book style, which overlaps Ink and News as
  proposed here. Whether to keep the reservation is the maintainer's decision.
- Both presets' giscus palettes (`giscus-ink-*.css`, `giscus-news-*.css`) change with their
  palettes.

## Implementation and checker plan {#implementation}

1. Add the `OINK Fangsong` alias in `brand.css`, and rewrite Ink's and News's font roles in
   `tokens-typography.css` as tabled above.
2. Rewrite Ink's and News's light and dark palettes and details in
   `experimental-presets.css`; update canvases and inks in `preset-canvases.html` to match.
3. Drop the paper effects in `print.css`.
4. Update the four giscus palettes.
5. Add the shade-end AA check and token parity for the new palettes to `check-presets.py`.
6. Review Ink and News on the documentation site in English and Chinese, desktop and phone,
   light and dark, including the fallback on Windows without Kai or Fangsong.

## Acceptance criteria {#acceptance}

- With screenshots of all six presets side by side in the same mode, a reviewer can tell each
  one apart without reading a label.
- Where Kai and Fangsong are absent (iOS, English Windows), Ink's and News's Chinese pages are
  still distinguishable.
- Every text color meets WCAG AA at the darkest point of the canvas; body text reaches 4.5:1.
- Print preview shows no shade, glow or seal.
- `check-presets.py` and `check-stylesheets.py` pass, and the site's `make check` and
  `make browser` pass.

## Implementation record {#implementation-record}

On 2026-11-28 the theme was changed to this proposal, settling the open questions as it
leaned: Fangsong text; the seal on by default, on the site header's text wordmark only (the
sidebar brand of the Docs, Book and Blog shells is untouched); the initial in Blog and Book
only; gold on indigo paper and the darkroom for the dark modes; News without clay. Where the
implementation departs from the design:

- The display stack adds URW Z003 for Linux.
- Per-language Japanese and Korean stacks, News's kicker, the date and edition inside the
  masthead rule, and Blog list columns are not implemented, for the reasons given above.
- Pull quotes keep their start alignment instead of centering.
- The menu icons take each preset's accent: Ink vermilion, gold in dark; News spot blue,
  safelight orange in dark.
- A calibration after the maintainer's review the same night dropped Ink's calligraphic
  display faces and seal: Latin is Palatino everywhere and Han takes Kai in headings and the
  interface. News sets its interface, menus and lists in its text serif and squares its
  interface parts. The display-face table and the seal detail above no longer apply.

The theme's `check-presets.py`, `check-font-tokens.py`, `check-stylesheets.py`,
`check-goldens.py` and other checkers pass. The documentation site build failed at the time
on a parallel change to the Social component, so the site checks run once that change lands.

## Open questions {#open-questions}

1. Does `folio` stay reserved?

## Decision log {#decision-log}

| Date | Change |
| --- | --- |
| 2026-11-28 | Drafted. Separates Ink and News as the written and the printed page; proposes Fangsong text and calligraphic display faces for Ink, and the gold-on-indigo and darkroom dark modes. The design specimen was made outside the repository and is not part of the site |
| 2026-11-28 | Font coverage corrected against the official font lists of Microsoft, Apple, AOSP, Ubuntu and Fedora |
| 2026-11-28 | Partly implemented in the theme; see the [implementation record](#implementation-record) |
| 2026-11-28 | Calibrated after review: calligraphic display faces and the seal removed; Ink's and News's interface fonts unified with their text |
