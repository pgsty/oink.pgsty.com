---
title: Paper and Slate visual presets
linkTitle: Visual presets
description: Accepted phase-one visual identity and appearance controls, with separate reader style and mode state.
weight: 50
icon: fa-solid fa-palette
design_kind: decision
design_status: accepted
decision_date: 2026-10-05
---

> [!NOTE] OINK 1.2.0
> Paper and Slate ship in 1.2.0. Ink and Terminal are included as explicit
> opt-ins; their remaining design work is recorded below.

## Decision {#decision}

Paper is the default, with warm paper/ink colors, blue links, IBM Plex Sans,
heading hairlines and framed tables. Slate retains the v1.1.0 palette,
Inter/Chakra/Plex Mono roles and Landing grid/glow. This gives reading sites a
quieter default while preserving an explicit compatibility choice. The cost is
a visible default change: existing sites can set `params.ui.preset: slate`.
The 1.2.0 release notes and upgrade guide call out this default change.

The reader menu is opt-in (`preset_menu: false`). The docs site enables it.
One Appearance disclosure combines native Style and Light radio groups;
mobile uses a modal dialog in the browser top layer. It is reachable by touch
and keyboard without relying on hover. The cost is replacing the old one-click
mode toggle with a selection panel; the `t` shortcut still toggles mode.

Style and mode use separate attributes and storage keys. Choosing the site
default preset clears the style key. Hugo renders the default without JavaScript;
an allowlisted inline script restores reader state before CSS. This prevents
the common initial preset mismatch, while keeping blocked storage usable.
Presets ship in one stylesheet, at the cost of additional CSS bytes.

`brand` separates the wordmark from display headings. Paper adds the local
OFL IBM Plex Sans variable font, including normal/italic and the six supported
small writing-system subsets. Font files download on use; system typography
and explicit role overrides retain priority. Chinese uses the system stack.
Phase 1 includes no serif face and no external font request.

Page task determines density: Landing keeps display scale, long articles keep
their reading measure, and navigation/configuration tables remain compact.
No global spacing increase, new shell, or geometry abstraction is introduced.
Giscus and print follow the preset; API vendors and charts retain their current
mode-only behavior. This keeps the first implementation bounded.

## Later work {#later-work}

On 2026-10-24, the maintainer accepted removing Paper's trailing heading
hairlines because the decoration adds visual clutter. The OINK 1.4.0 implementation
removes the line in both light and dark mode while retaining heading typography
and anchors. This revision ships in OINK 1.4.0; the 1.2.0 decision above records
the original appearance.

A subsequent October 5 experiment implements Ink and Terminal behind explicit
configuration; see the [experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/).
They are not stable defaults. `preset_menu: true` offers Paper/Slate and the site
default; an explicit list can expose either experiment. The menu uses the same
compact icon-and-name buttons for all four, without experiment badges.
This gives reviewers actual theme output without changing ordinary menu choices.
The cost is additional scoped CSS and a larger menu when experiments are enabled.

The experiment uses owned component rules for square/2 px geometry and compact
desktop navigation instead of introducing a global density framework. It reuses
existing local fonts, state handling and accessibility controls. Charts and API
vendors stay mode-only; comment palettes and print follow the experiments.
Remaining work is visual acceptance, wider device review and any decision to
promote them into the stable set.

On 2026-11-26, the maintainer asked for a refinement pass over all four
presets and for copied passages that paste cleanly into rich-text editors.
Paper's canvas became ivory `#faf9f5` and it gained a clay accent, because the
earlier grey canvas and link-blue accent left Paper too close to a warm Slate;
links stay blue and Dark Paper keeps its canvas. The cost is a visible accent
change on Paper sites that set no `theme_color`. Slate's palette stays frozen.
Ink headings dropped to weight 700, the heaviest weight the platform CJK faces
carry, with a one-pixel section rule. Terminal's heading marks were lightened
and spaced so the hashes stay distinct. All presets gained keycaps for bare
`<kbd>`, quieter list markers and zero heading tracking in CJK passages.
A second pass the same day settled reading texture. Paper and Ink links moved
from semibold to an underline at prose weight, because several bold links in
one paragraph read as emphasis the author never wrote; Slate and Terminal keep
the semibold cue. Paper and Terminal inline code dropped to weight 400 so it
stops competing with authored bold. The `v` key now steps through the offered
presets and `y` toggles light and dark; `y` no longer switches language.
On 2026-11-27 the maintainer accepted a Chinese typography for each preset.
The four Latin voices were distinct, but Han fell to the same platform Hei in
all of them. Each preset now arranges Song, Hei and Kai differently from fonts
the reader already has: Paper sets Song headings over Hei text, Ink Hei
headings over Song text, Slate stays Hei, Terminal sets mono prose. Kai carries
emphasis and quotation. The cost is a Latin change too, because a serif must
stand beside Song: Paper headings and Ink prose move to a system serif and
Terminal prose to mono. Bundling a CJK web font was rejected for its size.
Windows and Android rendering is unverified.
A follow-up shortcut pass on 2026-11-27 finalized the bindings: `t` steps
through offered presets, `y` cycles light, dark, and system color modes, `l`
switches blog/release/case index layouts, and `v` cycles site versions.
Typeset copy reuses the print palette instead of adding a third palette. The
[architecture contract](/docs/design/architecture/#typeset-copy) owns its
behavior. These changes ship in OINK 1.7.0.

On 2026-11-28 the maintainer judged the 1.7.0 Paper refresh a regression:
readers of the default preset met a different page with no setting changed.
Paper returns to its 1.6.0 look. Canvas `#f7f6f3` and ink `#21201c`, IBM Plex
Sans headings over the platform Hei, link blue as the accent, semibold prose
links, inline code at its usual weight, a hairline quote rule and the 1.6.0
print, typeset-copy and comment palettes all come back. Typography shared by
every preset stays: upright Kai for Han emphasis, keycaps, quieter list
markers, tabular figures and untracked CJK headings. The 1.7.0 look is kept
as the experimental News preset rather than discarded. It is a printed
column after Typora's Newsprint theme: the ivory palette and clay accent,
serif text and headings with Song for Han and Kai for quotations, a
text-weight title over a double rule, open tables between ink hairlines,
italic Latin quotations and underlined links. Its navigation, search and
menus keep the UI sans, because Song thins out at control sizes.
A second experiment, GitHub, reproduces Markdown as GitHub renders a README
in light and dark. Its values come from github-markdown-css 5.9.0 and
@primer/primitives 11.10.0, both MIT. Three values move for contrast: the
dark primary-button hover becomes `#268838`, the light selected-tab underline
takes `#bc4c00` instead of a 2.15:1 coral, and the dark focus ring keeps the
link blue. Han emphasis keeps OINK's Kai rather than a slanted sans.
The Style menu follows the six presets. Its trigger shows a palette whenever
it offers Style. Three, five or six presets sit in three columns over the
three mode cards, and the legends name the `t` and `y` keys while keyboard
navigation is on. `folio` and `canvas` stay reserved. The cost is that sites
which adopted 1.7.0 see Paper change back; they can choose `news`.
These changes ship in OINK 1.8.0.

Later the same day the maintainer asked for a second pass. The serif preset
is named News, and the menu reads Paper, Slate and GitHub over Ink, News and
Terminal. Each dark mode should be its own experience, with the fonts of its
light mode and a palette of its own. Dark Terminal becomes a phosphor screen
in the manner of a film's green code rain: green type on black, glowing
headings and links, faint scan lines and green monochrome syntax. Dark Ink
becomes a stone rubbing, rice-paper type on blue-black with a cinnabar seal,
and dark News a candlelit edition, parchment type and gold links on warm
brown. Paper, Slate and GitHub keep their dark palettes: Paper has just been
restored, Slate's palette is frozen, and GitHub follows GitHub. Ink is
rewritten as a brush-written page. Han headings take Kai and its text Song;
Latin takes Palatino, a roman drawn from Renaissance pen lettering. The title
is set at text weight, sections open under a tapered brush stroke, `hr` is
one stroke and quotations hang from a fading cinnabar stroke. The crimson
accent becomes a seal red and Swiss uppercase labels go. `OINK Kai` gains a
bold face that names only installed bold Kai, so Kai headings draw a real
bold. No font file ships; a system without Palatino or Kai falls back to its
serif and Song. These changes ship in OINK 1.8.0.

A third pass that evening set the two paper presets apart, following the
[Ink and News proposal](/docs/design/proposals/ink-news-presets/): Ink is the
written page and News the printed one. Ink moves to warm paper `#f3ead7` that
darkens toward the window's edges, with ink `#241a10` and vermilion `#a8321b`
as its two inks. Its Chinese text takes Fangsong through a new `local()` alias,
`OINK Fangsong`, and falls back to Song; page titles take a chancery for Latin
(Apple Chancery, Gabriola or URW Z003) beside Kai; every heading stays at text
weight, sections in Palatino's italic. Chinese `strong` becomes vermilion
emphasis dots, Blog and Book text opens on a vermilion initial, the current
row carries a vermilion dot and the header wordmark is framed as a seal. Dark
Ink replaces the stone rubbing with gold and silver writing on indigo-violet
paper `#1b1730`, because the rubbing's near-neutral black sat too close to
Paper's dark grey. News moves to grey newsprint `#f0eee8`, press black and one
spot blue `#1f4f7a`, dropping clay, which read too close to Ink's vermilion.
It sets headlines in heavy Times New Roman over Songti Black, a deck and an
uppercase dateline under the title, a thick-and-thin rule over each section,
pull quotes between rules and a masthead rule under the header, with no radius
or shadow. Dark News replaces the candlelit edition with a darkroom, silver
type on `#0f0f0f` with a safelight orange `#f2804a`, because parchment and
gold now belong to Ink. `check-presets.py` now also checks text contrast at
the extreme of a shaded canvas, `--td-preset-canvas-edge`. Three parts of the
proposal stay out: per-language Japanese and Korean stacks, because preset
font roles live on the bare root selector so `typography: system` and
`params.ui.fonts` keep winning; a kicker above the headline, which would need
new markup; and newspaper columns for Blog lists, which switch between three
forms at runtime. The cost is a visible change for sites that chose `ink` in
1.7.0. These changes ship in OINK 1.8.0.

A calibration pass followed the same night, after the maintainer reviewed the
three presets on the site. Ink's chancery and seal went: Apple Chancery on the
home page read as ornament rather than text, and a red frame round the
wordmark was a mark too many. Ink now speaks one voice, Palatino for Latin
everywhere and Kai for Han in headings and the interface, Fangsong staying in
the text; its display role is its heading face. News sets its interface,
menus and lists in its text serif rather than IBM Plex Sans, and squares its
interface parts, so each page reads as one printed sheet. Dark Terminal had
turned the whole screen green, so that text, chrome and code were hard to tell
apart; its text and chrome return to a pale grey-green, phosphor green stays
for headings, links and a cursor bar on the current row, amber takes heading
marks and quotation rules, and code regains distinct hues. The Appearance
trigger shows the reader's color choice again, a sun, moon or half-filled
circle for System, instead of a palette, and the color group is labelled
Color. Paper, Slate and GitHub are unchanged. These changes ship in OINK 1.8.0.

## Evidence {#evidence}

On 2026-10-25, the maintainer authorized component refinement using the existing
four presets. Shared surfaces, grouped rows, stable labels, and background-only
press feedback reuse current tokens and CSS. Markdown remains the primary
authoring path; the three local presentation variants are explicit opt-ins.
Paper/Slate keep rounded surfaces, while Ink/Terminal retain flat, square/2px
geometry. The moving selection trial is deferred: static states provide the
needed feedback without a second geometry or runtime layer. These changes ship in OINK 1.4.0; the [component contract](/docs/design/components/#component-refinement)
owns their supported syntax and fallback behavior.

The [architecture contract](/docs/design/architecture/#visual-presets) and
[shell contract](/docs/design/shell/#appearance-control) own behavior.
`check-presets.py` owns token parity, AA palette checks, the frozen Slate
v1.1.0 palette and strict configuration output. Font, parameter, vendor,
namespace, action and runtime checkers retain their existing ownership.
The documentation site's `appearance.spec.mjs` tests real output; the
[dated acceptance record](/docs/design/research/2026-10-05-visual-presets-acceptance/)
distinguishes executed checks from remaining experiments.
