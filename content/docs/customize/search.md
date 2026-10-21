---
title: Search
linkTitle: Search
description: Enable local search. Control index size and result ranking, and configure useful CJK query matches.
weight: 60
search_keywords: [offline_search, full-text search, search, local search, index, Lunr, CJK, search_boost, search_keywords, search_exclude, Algolia, DocSearch, Google CSE]
aliases:
  - /docs/advanced/search/
---

OINK uses local search. Hugo generates one JSON index per language at build
time. The reader's browser downloads the index and runs the search locally.
Search requires no crawler, account, CDN, or external search service. It is off by
default. Enable it with one configuration line.

Search opens through the command palette. See [Command palette](/docs/customize/panel/)
for opening methods and its other contents.

## Turning on local search {#enable}

```yaml {title="hugo.yml"}
params:
  offline_search: true
```

This key controls the page's index reference, Lunr runtime, and search dialog.
All three conditions must hold:

- `params.offline_search` is true;
- The page is the home page, or uses a shell layout (`docs` / `book` / `blog` / `swagger` — see [Layouts and page types](/docs/customize/layout/)), or is a landing page with `params.ui.landing_search` on;
- The current output is not print.

If any condition fails, the build includes no dialog, index reference, or
Lunr runtime on that page. The resources are not hidden. They are not generated.

By default, `hugo server` **also** generates the index, so preview matches
production. On a very large site, rebuilding the complete index can noticeably
slow each preview change. To disable preview index generation, use:

```yaml {title="hugo.yml"}
params:
  offline_search: true
  # skip index building during preview; only needed on very large sites
  offline_search_on_serve: false
```

## Controlling index size {#index-scope}

The `offline_search_index` key sets how much page content the index contains.
It determines whether readers can find body text and the download size for
their first search.

```yaml {title="hugo.yml"}
params:
  offline_search: true
  offline_search_index: summary
  offline_search_summary_length: 70
  offline_search_max_results: 10
```

| Value | What is indexed | When to use it |
| --- | --- | --- |
| `title` | Title, tags, categories, `search_keywords` | A very large site where titles alone locate a page |
| `heading` | The above plus every heading in the page | When headings are specific enough |
| `summary` | The above plus description and summary | Sites with thousands of pages. This site uses it |
| `content` | The above plus the full plain text | The default, suitable up to a few hundred pages |

In normal preview, any other value warns and uses `content`. A strict
publishing build fails on `invalid params.offline_search_index`.

The `offline_search_summary_length` key limits result excerpts (default 70).
The `offline_search_max_results` key limits result count (default 10).
The full definitions are in [Configuration](/docs/customize/config/).

> [!IMPORTANT] One index per language, budgeted at 2 MiB raw and 512 KiB gzipped.
> The browser downloads the complete index before the first search. If it
> exceeds this budget, reduce `offline_search_index` from `content` to `summary`.

## Adjusting ranking {#ranking}

A page influences its own ranking from front matter:

```yaml {title="content/docs/reference/pgsql.md"}
---
title: PostgreSQL parameters
search_keywords: [postgres, postgresql, pg, database parameters, GUC]
search_boost: 1.5
---
```

The `search_keywords` key adds matching terms as a string or array. It is more
useful than the boost setting. Readers searching `pg` or `GUC` can find a page
titled only "PostgreSQL parameters". Keywords have less ranking weight than
the title and more than the body.

The `search_boost` key is a positive multiplier applied to the text match score.
Its default is `1.0`. A value of `1.5` does not guarantee first place. It
raises the rank only among results that already match. Zero, negative numbers,
and non-numbers warn and use `1.0`.

Set a section-wide default once with a cascade:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  search_boost: 1.25
---
```

A page's own value overrides its inherited value. Pages under this site's
`docs/` use `search_keywords` for Chinese phrasing, English terms, and
configuration key names.

## Keeping a page out of the index {#exclude}

```yaml {title="content/internal/draft-plan.md"}
---
title: Internal plan
search_exclude: true
---
```

Use only `search_exclude`. The theme ignores the removed `exclude_search`
and `excludeSearch` keys, so they do not exclude a page. The migration checker
reports them. The index also excludes pages with empty bodies.

> [!WARNING] The index is a static JSON file anyone can download; it is not access control.
> Do not put content that should stay private on the site, and do not use
> `search_exclude` to protect it.

## Chinese and CJK {#cjk}

Lunr cannot reliably tokenize Chinese. If the palette detects a CJK character,
it uses substring matching for the complete query. It compares title, keywords,
in-page headings, description, and body in order. It scores the matching layer,
then multiplies by `search_boost`. Both search paths use the same ranking rules.

In the 1.2.0 working implementation, a keyword-only match shows the page
description or excerpt. Result summaries therefore omit synonym lists. Body
matches still show surrounding text for context.

This behavior has three effects:

- A CJK query uses **substring** matching. Searching 主从复制 matches only those four consecutive characters. The query 复制主从 returns nothing.
- The `search_keywords` key is therefore especially useful for Chinese sites. Add synonyms, English terms, and abbreviations that readers might search.
- During input-method composition, the palette does not recompute results. It searches after text is committed. Chinese typing therefore does not refresh results for each character.

If a Chinese query finds nothing, first confirm that the Chinese index contains
the page. See Verify below. Then investigate tokenization.

## Optional: hosted search {#hosted}
The theme also provides two hosted search integrations. Both are off by default.
**Enable only one at a time**. If more than one is configured,
the build warns `You have more than one site-search option configured`.

If you enable hosted search, you accept its crawling behavior, availability,
and privacy boundary. Document these in the site's privacy statement.

### Algolia DocSearch {#algolia}

```yaml {title="hugo.yml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

You must supply all three values explicitly. A missing value warns and disables
Algolia. Normal preview continues. Review the warning and confirm Algolia is disabled.
OINK never falls back to another project's public index. The theme bundles
DocSearch JS and CSS locally. They do not load from a CDN. However, every
query sends a request to Algolia. The integration requires real credentials
and an index, so this page renders no demonstration.

### Google Programmable Search {#google-cse}

```yaml {title="hugo.yml"}
params:
  gcs_engine_id: YOUR_ENGINE_ID
```

A landing page for the results is needed too:

```yaml {title="content/search.md"}
---
title: Search results
layout: search
---
```

The search box submits queries to `<baseURL>/search/?q=…`. Google's script
renders results on that page, which requires access to `cse.google.com`. This
integration uses an external service. This page renders no demonstration.

## Verify {#verify}

1. Build, and confirm one index per language was generated:

   ```bash
   hugo --printPathWarnings
   ls public/offline-search-index.*
   ```

   A development build uses `offline-search-index.zh.json`. A production build
   fingerprints the filename, such as `offline-search-index.zh.7ab….json`.
   Confirm one file per language. If a file is missing, that language's pages
   never reached an index.

2. Inspect the index first when diagnosing "Chinese finds nothing":

   ```bash
   python3 -c "import glob,json; f=sorted(glob.glob('public/offline-search-index.zh*.json'))[0]; \
     d=json.load(open(f)); print(f, len(d)); print(d[0])"
   ```

   The entry count should be close to the number of Chinese pages, and the
   `keywords` and `boost` fields should show what the front matter set.

3. Open the site and press <kbd>/</kbd>. Search an English word, then a Chinese word. Confirm that results group by content root. Each group uses the first breadcrumb segment as its name.

4. For a subpath deployment, such as `https://example.com/docs/`, open the browser's network panel. Confirm that the index request includes the subpath. An index request to the domain root can return 404 while the page works. This is the most common cause of "search returns nothing".

## Related {#related}

- [Command palette](/docs/customize/panel/) — search's entry point, and the commands and page actions beside it
- [Keyboard navigation](/docs/customize/keyboard/) — the four single keys that open search and commands
- [Languages](/docs/customize/i18n/) — per-language indexes and untranslated fallback
- [Configuration](/docs/customize/config/) — full definitions of the `offline_search*` keys
- [Page parameters](/docs/write/frontmatter/) — `search_keywords` / `search_boost` / `search_exclude`
