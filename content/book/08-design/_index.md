---
title: Shape the home page and the look
linkTitle: Home and appearance
description: Compose the home page from data sections, give the site its name, logo and accent color, pick a visual preset, and let readers choose their own look and dark mode.
book_kind: chapter
book_number: 8
weight: 80
aliases:
  - /book/04-design/
---

Readers decide in seconds whether a site is for them, mostly from its first
screen and its look. In OINK neither takes a template: the home page is a YAML
file listing sections from top to bottom, and the look is a preset plus a few
settings. This chapter gives Acme DB a home page that says what it is and how
to install it, then gives the site its own identity.

## The home page is data {#home}

The Starter's `data/home/en.yaml` holds three sections. Replace it with five
that tell Acme DB's story: what it is, a few facts, where to start, the install
command, and a closing call to action:

```yaml {title="data/home/en.yaml" num="8-1" caption="A five-section home page for Acme DB." #eg-home-data}
sections: [hero, metrics, cards, command-box, cta]

hero:
  align: center
  eyebrow: Open-source time-series database
  title_lines:
    - words: [{ text: Acme DB. }]
    - words: [{ text: Years of metrics, queried in milliseconds. }]
  lead: One binary. Write over HTTP, query with SQL, keep data as long as you need.
  actions:
    - { label: Quick start, url: docs/get-started/quick-start/, icon: fa-solid fa-rocket, style: primary }
    - { label: GitHub, url: 'https://github.com/acme/acme-db', external: true, style: ghost }

metrics:
  title: Acme DB 3.0 in numbers
  items:
    - { value: 3400000, compact: true, label: points per second on 8 cores }
    - { value: 10, suffix: '×', label: typical compression }
    - { value: 1, label: binary to install }

cards:
  eyebrow: Where to start
  title: Everything has a place
  columns: 3
  items:
    - title: Quick start
      desc: Start a server, write a point and query it in five minutes.
      icon: fa-solid fa-rocket
      url: docs/get-started/quick-start/
    - title: Operations
      desc: Backups, upgrades and capacity planning for production.
      icon: fa-solid fa-screwdriver-wrench
      url: docs/operations/
    - title: Release notes
      desc: What changed in each version, and how to upgrade.
      icon: fa-solid fa-tag
      url: blog/release/

command-box:
  title: Install
  code: curl -fsSL https://get.acme.example/install.sh | sh
  lang: bash

cta:
  title: Run your first query today.
  text: The quick start takes five minutes on a laptop.
  label: Get started
  url: docs/get-started/quick-start/
  style: primary
```

To reorder the page, reorder `sections`; to hide one, write it as
`{ type: metrics, enabled: false }` and keep its data. Links to your own pages
are site paths without a leading slash, such as `docs/operations/`, because the
theme adds the language prefix: the same link reaches `/zh/docs/operations/`
from `data/home/zh.yaml`, which carries the same structure with Chinese text.
A misspelled section type warns with `unknown section type` and is skipped, so
read the build output when a section does not appear.

There are 22 section types, among them pricing tables, logo walls, FAQs, a
Markdown source beside its rendered result, and download cards fed from the
release data; [Home and landing pages](/docs/customize/home/#registry) lists
them all. Any other page can use the same sections with `layout: landing`.

## Name, logo and favicon {#identity}

The name comes from `hugo.yaml`, which you set in Chapter 3. The mark beside it
is the Starter's neutral `assets/icons/logo.svg` until you name your own:

```yaml {title="hugo.yaml"}
params:
  logo: icons/acme-mark.svg
```

Crop the SVG tightly and give it a `viewBox`, or it will not line up with the
text beside it, and choose colors that read on both light and dark
backgrounds. Favicons need no setting: put `favicon.ico`, `favicon.svg` and
`apple-touch-icon.png` in `static/` and every page links them.

## An accent color, per section {#theme-color}

The accent color marks where the reader is: the selected sidebar row, the
outline's current section, focus rings, card borders on hover. Set one for the
site, and give a section its own in a `cascade` so readers can tell the parts
apart:

```yaml {title="hugo.yaml"}
params:
  ui:
    theme_color: '#0f766e'
```

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

This book does exactly that: its root page sets `theme_color: '#9a3412'`, which
is why the selected chapter in the sidebar and the outline marker are orange
here and blue in the Docs. Prose links and inline code keep the preset's colors
everywhere, so a reader recognizes a link the same way in every section.

## A preset, and the reader's choice {#presets}

A preset is a complete look in light and dark: palette, fonts, link and table
style. Choose the one closest to your brand before changing colors by hand:

| Preset | Look |
| --- | --- |
| `paper` | Warm paper, ink text, blue links and accent, Plex Sans and framed tables. The default |
| `slate` | A cool blue-gray technical look |
| `github` | GitHub README typography, colors, ruled tables and green buttons. Experimental |
| `ink` | Written page on warm paper, Palatino and Kai with Fangsong or Song text and vermilion marks. Experimental |
| `news` | Printed page on grey newsprint, heavy serif and Song headlines, spot blue and double rules. Experimental |
| `terminal` | Monospace throughout, teal links, amber accents, compact navigation; phosphor screen at night. Experimental |
{#tbl-presets num="8-1" caption="The six visual presets."}

```yaml {title="hugo.yaml"}
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, github, ink, news, terminal]
    dark_mode: true
```

`preset` is the site's look; `preset_menu` lets readers pick another from the
Appearance menu, and `dark_mode` adds Light, Dark and System to it. A reader's
choice is saved in their browser. Try it on this page: press
{{< kbd "T" >}} to cycle the presets and {{< kbd "Y" >}} to cycle light and
dark. The orange accent survives every combination, because `theme_color` wins
in every preset.

## Fonts and your own CSS {#css}

The Latin typefaces ship with the theme and are served from your own site, so
no page calls a font service; Chinese uses fonts already on the reader's
system. `params.ui.typography: system` switches every role to the platform's
own fonts. For anything the settings cannot reach, write plain CSS in
`assets/css/project.css`, which loads after the theme's stylesheet. This
recolors the warm secondary accent used in the footer and landing sections, in
both modes, because each preset sets its own dark value:

```css {title="assets/css/project.css"}
:root {
  --td-brand-copper: #a66722;
}

[data-bs-theme='dark'],
[data-td-preset='paper'][data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
}
```

It is plain CSS, not SCSS, because Hugo publishes it without compiling. Prefer
a setting over a selector, and a selector over a copied template: an override in
`layouts/` stops receiving the theme's fixes. [Brand and appearance](/docs/customize/brand/)
lists the font roles and palette variables you can rely on across releases.

## Check your work {#checkpoint}

- The home page shows the hero, three metrics, three cards, the install command with a copy button, and the closing call to action, in both languages.
- The Quick start button leads to `/docs/get-started/quick-start/` in English and `/zh/docs/get-started/quick-start/` in Chinese.
- The blog uses the purple accent and the rest of the site teal.
- The Appearance menu offers six presets and three modes, and every combination stays readable.

## Ask your agent {#agent}

```text {num="8-2" caption="Prompt: rebuild the home page and the look." #eg-agent-design}
Rebuild data/home/en.yaml and data/home/zh.yaml as five sections: hero,
metrics, cards, command-box, cta, following
https://oink.pgsty.com/docs/customize/home/. Take every fact from README.md;
do not invent numbers. Link internal pages as site paths without a leading
slash. Set theme_color to <#0f766e> for the site and give the blog its own
color in a cascade. Keep preset paper with preset_menu [paper, slate, github,
ink, news, terminal] and dark mode on. Then check all six presets in light and
dark mode at desktop and phone widths, and report any section that warns.
```
