---
title: Help readers find their way, in their language
linkTitle: Navigation, search and languages
description: Add menu entries, tune local search, give the command palette your own commands, learn the keyboard, show backlinks, and settle the site's languages and the duo view.
book_kind: chapter
book_number: 9
weight: 90
---

Readers rarely arrive at the home page and click down. They come from search,
jump between sections, look for one setting, or read in a second language.
OINK builds most of the way-finding from what you already wrote, the content
tree, the titles and the descriptions, and this chapter adjusts the rest for
Acme DB.

## Menu entries {#menu}

The navbar's Docs dropdown lists the Docs groups. The Starter puts each group
there from the group's own front matter, so add the Operations group from
Chapter 3 the same way:

```yaml {title="content/docs/operations/_index.md (front matter)"}
menus:
  main:
    identifier: docs-operations
    parent: docs
    weight: 35
    params:
      icon: fa-solid fa-screwdriver-wrench
```

The entry appears under Docs, between Tutorial and Reference, in every
language that has an Operations page; translate only its title in
`_index.zh.md`. Top-level entries that are not pages, such as a link to a
forum, go under `languages.<lang>.menus.main` in `hugo.yaml`; the GitHub
button at the right end of the navbar comes from `params.github_repo`.
[Navigation and menus](/docs/customize/navigation/) covers dropdowns, icons
and the footer.

## Local search {#search}

The Starter turns search on with `params.offline_search: true`. Hugo writes an
index per language while it builds, and a small engine in the browser searches
it, so no query leaves the site and the preview searches exactly like
production. It matches English with stemming and spelling fallback, code
identifiers, and Chinese typed without spaces. Press {{< kbd "/" >}} on this
page and search for `xref` to see it.

A page can teach search the words readers type but the page never uses:

```yaml {title="content/docs/get-started/quick-start.md (front matter)"}
search_keywords: [getting started, first query, hello world, tutorial]
search_boost: 1.5
```

`search_keywords` usually helps more than a boost: a reader who types "hello
world" now finds a page titled Quick start. `search_boost` multiplies the
page's score, and 1.5 lifts it without letting a partial match beat a complete
one.

## The command palette and the keyboard {#palette}

{{< kbd "Ctrl" "K" >}}, or {{< kbd "⌘" "K" >}} on a Mac, opens one box for
pages and actions: search, switch language or theme, copy the page as
Markdown, print the section. A query starting with `>` lists only actions. Add
your own under `params.ui.command_palette.commands`, the way
ddia.vonng.com offers "Start reading":

```yaml {title="hugo.yaml"}
params:
  ui:
    command_palette:
      commands:
        - id: acme_quick_start
          title: Quick start
          description: Start a server and run the first query
          url: /docs/get-started/quick-start/
          icon: fa-solid fa-rocket
          keywords: [install, first steps]
```

The keyboard reaches everything without the mouse. Twenty-nine single-key
shortcuts are on by default and stand aside while you type in a field; these
are the ones readers use most:

| Key | Action |
| --- | --- |
| {{< kbd "Q" >}} {{< kbd "E" >}} | Previous and next page, in sidebar order |
| {{< kbd "K" >}} {{< kbd "J" >}} | Previous and next heading on the page |
| {{< kbd "H" >}} | The pages you read recently |
| {{< kbd "X" >}} | The next language |
| {{< kbd "Z" >}} | Zen Mode, the article alone |
| {{< kbd "'" >}} | All twenty-nine shortcuts |
{#tbl-common-keys num="9-1" caption="The keyboard shortcuts readers use most."}

Press {{< kbd "E" >}} now to go to Chapter 10, or {{< kbd "'" >}} to see the
rest. [Keyboard navigation](/docs/customize/keyboard/) explains how to turn
shortcuts off for a site, a section or a page.

## Backlinks {#backlinks}

With `params.ui.backlinks: true`, which the Starter sets, each page lists the
pages that link to it in the right rail, under "Backlinks". Hugo works the list
out at build time from your ordinary links, so it needs no new syntax and no
script. A reader who lands on Back up a server from search sees at once that
Quick start and the configuration reference point to it, which tells them
where it sits in the rest of the site.

## Settle the languages {#languages}

The Starter ships English, Chinese and French. Acme DB publishes in English
and Chinese, so remove French: delete its block under `languages` in
`hugo.yaml`, then its content and home page data:

```bash
find content -name '*.fr.md' -delete
rm data/home/fr.yaml
```

What remains in `hugo.yaml` is one block per language:

```yaml {title="hugo.yaml"}
languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: *siteTitle
    params:
      description: Documentation for the Acme DB time-series database.
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: *siteTitle
    hasCJKLanguage: true
    params:
      description: Acme DB 时序数据库文档。
      time_format_blog: 2006年1月2日
```

`label` is the language's own name in the picker, `locale` goes into
`<html lang>` and the alternate links search engines read, and `weight` orders
the languages. The default language has no path prefix and the others live
under their own, `/zh/`. The theme's own labels, such as Search, Next and
Backlinks, come in 32 language packs, so a new language needs only your
content. [Languages](/docs/customize/i18n/) covers right-to-left scripts and
what happens to pages that have no translation yet.

## Read two languages side by side {#duo}

With `params.ui.compare: true`, also on in the Starter, a page with a
translation gets an **Open duo view** button beside the page actions: the page
on one side, its translation on the other, scrolling together section by
section. It is the quickest way to review a translation, because a missing
paragraph shows up as a gap. This chapter has a Chinese edition, so press
{{< kbd "B" >}} to try it, and {{< kbd "B" >}} again to close it.

## Check your work {#checkpoint}

- The Docs dropdown lists Operations with its icon in both languages.
- Searching for "hello world" finds Quick start first.
- The palette, opened with `\` (or by typing `>`), lists the Quick start command.
- Back up a server shows Quick start under Backlinks.
- The language picker offers English and 简体中文 only, and the duo view pairs every translated page.

## Ask your agent {#agent}

```text {num="9-1" caption="Prompt: tune navigation, search and languages." #eg-agent-navigation}
Make navigation and search work for readers, following
https://oink.pgsty.com/docs/customize/navigation/ and .../search/. Add every
Docs group to the Docs dropdown from its own front matter, with an icon. Add
search_keywords to the ten most important pages with the words readers would
type, in both languages. Add two command palette entries for the most common
tasks. Keep only <English and Chinese>: remove the other languages' blocks,
pages and home data. Then search for each keyword in the browser and confirm
the right page comes first.
```
