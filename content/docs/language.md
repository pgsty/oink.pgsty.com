---
downstream_modified: true
title: Multi-language support
weight: 7
icon: fa-solid fa-language
description: Configure languages, translations, stable links, search, and RTL.
---

OINK uses Hugo's multilingual page model rather than site-specific domain or
template assumptions. The included site makes English the primary language, and
Simplified Chinese (`zh`) the second language.

## Configure languages

Define the default language and every enabled language in `hugo.yaml`:

```yaml
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

`weight` controls both language ordering and the selector order. `label` is
shown in that language's own script. `locale` supplies standards-friendly
language tags for HTML, alternate links, and Open Graph metadata.

Language-specific parameters override global values; other parameters inherit
their global value. Put translated menus under each language when labels differ.

## Organize translated content

OINK's starter colocates translations:

```text
content/docs/
├── install.md
└── install.zh.md
```

The base name makes the files translations of one page. Keep dates, weights,
aliases, resources, and route-affecting metadata aligned unless a deliberate
language-specific difference is required.

Translate all visible text, including front matter titles and descriptions,
summaries, menu labels, tags, image alternatives, callouts, and shortcode
arguments. Preserve commands, identifiers, configuration keys, filenames, URLs,
and product names.

Sites with very large independently maintained language trees may use Hugo's
language-specific `contentDir` model instead. Do not mix layouts casually: pick
one model, document it, and verify how Hugo associates translations.

## Keep heading links stable

Automatic heading IDs depend on the heading text, so translated headings would
normally break shared fragment links. Use the English page's actual rendered ID
as an explicit ID in the translation:

```markdown
## Configure local search
```

```markdown
## 配置本地搜索 {#configure-local-search}
```

Inspect rendered HTML rather than guessing. Inline HTML, punctuation, badges,
and shortcodes can affect Hugo's generated ID. Corresponding pages should have
the same heading order and rendered ID list.

## Language selector behavior

The selector is generated from Hugo's configured sites and page translations. It
is hidden for a single language. With two or more languages it renders one
consistent language button: a direct click advances to the next language by
configured weight, while hovering for half a second or focusing the control
reveals the complete language menu.

For each target language, the selector links to the current page's translation
when it exists. If it does not exist, it links to that language's home page
instead of producing a dead or falsely translated route. The current language
has visible and `aria-current` state.

## SEO and document metadata

Every page emits:

- the correct HTML `lang` and `dir` values;
- its canonical URL;
- `rel="alternate"` links with `hreflang` for configured languages;
- Open Graph locale and alternate-locale metadata.

Alternate targets follow the same translated-page-or-language-home fallback as
the visible selector. Use a correct production `baseURL`; subpath deployments
are supported and must not be replaced by hardcoded absolute paths in layouts.

## Right-to-left languages

Set `direction: rtl` on an RTL language:

```yaml
languages:
  ar:
    label: العربية
    locale: ar
    direction: rtl
    weight: 4
```

The theme loads its committed local Bootstrap RTL artifact and uses logical CSS
properties in its own shell. LTR and RTL sites use the same command:

```sh
hugo --gc --minify
```

Consumer sites do not install RTLCSS, PostCSS, or npm. Test actual RTL content,
navigation, code, tables, diagrams, and mixed-direction strings rather than
assuming stylesheet selection is sufficient.

<a id="internationalization-bundles"></a>

## UI translation bundles

Theme UI strings live in `theme/i18n/`. OINK includes English, Simplified
Chinese, Traditional Chinese, and other inherited bundles. A site can override
only the strings it needs by creating its own `i18n/<language>.yaml`; remaining
values fall back to the theme bundle.

During translation work, run:

```sh
hugo server --printI18nWarnings
```

Contribute generally useful translations to the theme. Keep product-specific
language in the site bundle.

## Search by language

With `offlineSearch: true`, OINK generates a separate same-origin index for each
language. The Simplified Chinese index uses the theme's CJK fallback. Search
results stay within the active language.

Verify that both `offline-search-index.en.json` and
`offline-search-index.zh.json` are generated, contain the expected pages, and
resolve under the deployed `baseURL`.

## Translation checklist

- [ ] Every source page in the supported scope has a `.zh.md` peer.
- [ ] Front matter identity and route metadata match.
- [ ] Visible prose, UI strings, alternative text, and metadata are translated.
- [ ] Every translated Markdown heading has an explicit stable ID.
- [ ] English and Chinese rendered heading ID lists match.
- [ ] Internal links and fragments resolve in both languages.
- [ ] Navigation, breadcrumbs, previous/next links, and search stay in language.
- [ ] Dates, punctuation, spacing, and technical terminology follow the target
      language's editorial conventions.
- [ ] The production build emits correct canonical and alternate metadata.

For Hugo's underlying model, see [Multilingual mode][].

[Multilingual mode]: https://gohugo.io/content-management/multilingual/
