---
title: Languages
linkTitle: Languages
weight: 30
description:
  Language configuration, translation layout, stable anchors, and RTL support.
---

OINK uses Hugo's multilingual page model directly and introduces no
site-specific domain convention or template assumption. This site treats English
as the primary language and Simplified Chinese (`zh`) as the second.

## Configure languages {#configure-languages}

```yaml {title="hugo.yaml"}
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: Product Documentation
    params:
      description: Product guides and reference
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: 产品文档
    params:
      description: 产品指南与参考资料
      time_format_default: 2006年1月2日
      time_format_blog: 2006年1月2日
```

{{< fields >}} {{< field name="label" type="string" required=true >}} The name
shown in the language selector, written in that language — `简体中文`, not
`Chinese`. {{< /field >}} {{< field name="locale" type="string" >}} The standard
language tag used for `<html lang>`, `hreflang` alternates, and Open Graph
metadata. {{< /field >}} {{< field name="weight" type="integer" >}} Sets both
the language order and the selector's cycle order; lower comes first.
{{< /field >}} {{< field name="title" type="string" >}} The site title in that
language. {{< /field >}} {{< field name="params.*" type="map" >}} Language-level
parameters override the global value of the same name; anything undefined is
inherited. Date formats usually need a per-language value. {{< /field >}}
{{< /fields >}}

When menu labels differ by language, define `menus` under each language.

## Organize translations {#organize-translations}

A translation sits **beside its source in the same directory**, distinguished by
a filename suffix:

```filetree
- content/docs/
  - install.md
  - install.zh.md
```

The shared base filename is what makes Hugo treat them as one page in two
languages.

**Keep identical**: dates, weights, aliases, page resources, and every piece of
metadata that affects routing.

**Translate**: front matter `title` and `description`, summaries, menu labels,
tags, image alt text, callouts, and visible shortcode parameters.

**Do not translate**: commands, identifiers, configuration keys, filenames,
URLs, and product names.

> [!NOTE] For a large tree maintained by separate teams, Hugo also supports a
> per-language `contentDir` model. **Do not mix the two layouts** — pick one,
> write it into your conventions, and verify that Hugo links the translations.

## Stable heading anchors {#stable-heading-anchors}

This is where multilingual documentation most often breaks. Hugo derives heading
IDs from heading text, so a Chinese heading produces a Chinese ID and
`/docs/page/#install` and `/zh/docs/page/#安装` become two unrelated anchors.

Write the source ID explicitly in the translation:

```markdown
## 安装 {#install}
```

When translating an existing page, take the ID from the **rendered English
HTML**. Do not guess from the heading text — headings containing shortcodes or
inline code often generate something other than what you expect.

This site enforces identical heading count, order, and IDs with a script:

```sh
node scripts/check-doc-translations.mjs --public public
```

## Language selector behavior {#language-selector-behavior}

The selector reads each page's `.Translations`:

- the target language **has** a translation → it links straight to that page;
- the target language **has none** → it falls back to that language's home page.

The fallback is deliberate, not a defect. Sending a reader to a URL that does
not exist would be worse.

## Search and languages {#search-and-languages}

With `offlineSearch: true`, each language gets **its own index**:

```text {copy=false}
public/offline-search-index.en.json
public/offline-search-index.zh.json
```

A reader searching from a Chinese page matches only Chinese content.

Chinese queries use the theme's CJK substring fallback: Lunr cannot tokenize
Chinese reliably, so the Command Palette switches to substring matching when it
detects CJK characters. Both paths apply the same ranking boost.

## Right-to-left languages {#right-to-left-languages}

Declare the writing direction on the language:

```yaml {title="hugo.yaml"}
languages:
  ar:
    label: العربية
    locale: ar
    languageDirection: rtl
    weight: 3
```

OINK loads Bootstrap's RTL stylesheet, and the theme's own CSS uses logical
properties (`margin-inline-start` rather than `margin-left`), so mirroring is
automatic.

Site-authored CSS should use logical properties too, or it will break under RTL.

## UI translations {#internationalization-bundles}

The theme ships interface strings for 32 locales. English, Simplified Chinese
(`zh-cn` and generic `zh`), and Traditional Chinese (`zh-tw`) are fully
reviewed; the rest keep their inherited Docsy translations, and OINK-only labels
currently fall back to English.

To override one string, create a file of the same name under the site's `i18n/`:

```yaml {title="i18n/zh.yaml"}
ui_search: 搜索文档
```

## Translation checklist {#translation-checklist}

- [ ] every `page.md` has a matching `page.zh.md`
- [ ] Chinese headings carry explicit IDs matching the rendered English IDs
- [ ] routing-affecting front matter is consistent
- [ ] commands, configuration keys, and URLs are untranslated
- [ ] the language selector is verified on pages with and without translations
- [ ] search returns results in both languages

## Next steps {#next-steps}

- [Versions](../versioning/): combining languages with versions
- [Navigation](../navigation/): per-language menus
