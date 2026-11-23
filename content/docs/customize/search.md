---
title: Search
linkTitle: Search
description: Enable local search. Control index size and result ranking, and configure useful CJK query matches.
weight: 60
search_keywords: [offline_search, full-text search, search, local search, index, BM25, CJK, search_boost, search_keywords, search_exclude, Algolia, DocSearch, Google CSE]
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

This key controls the page's index reference, local search engine, and search dialog.
All three conditions must hold:

- `params.offline_search` is true;
- The page is the home page, or uses a shell layout (`docs` / `book` / `blog` / `swagger` / `expo` — see [Layouts and page types](/docs/customize/layout/)), or is a landing page with `params.ui.landing_search` on;
- The current output is not print.

If any condition fails, the build includes no dialog, index reference, or
search engine on that page. The resources are not hidden. They are not generated.

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

Any other value warns with `invalid params.offline_search_index` and uses
`content`.

The `offline_search_summary_length` key limits result excerpts (default 70).
The `offline_search_max_results` key limits result count (default 10).
The full definitions are in [Configuration](/docs/customize/config/).

> [!IMPORTANT] Automatic split above 2 MiB (since OINK 1.6.0)
> The initial navigation index is budgeted at 2 MiB raw and 512 KiB gzipped per
> language. When a `content` index stays within 2 MiB, Hugo publishes it as one
> file. When it exceeds 2 MiB, Hugo automatically splits page text into
> `offline-search-body.<lang>.json`: the palette answers immediately from titles,
> headings, field entries, and keywords, then loads page text up to 8 MiB
> automatically—or waits for the reader to choose **Search page text** when the
> body file exceeds 8 MiB or the browser sets `Save-Data`. You can still lower
> `offline_search_index` to `summary` to omit body text completely.

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

The `search_boost` key is a positive multiplier applied to both field strength
and section BM25 score. Its default is `1.0`. A value of `1.5` raises a page's
rank without letting a partial match beat a complete match. Zero, negative
numbers, and non-numbers warn and use `1.0`.

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

## Chinese, mixed queries, and identifiers {#cjk}

OINK 1.6.0 replaces Lunr and the old substring fallback with a single scanning
BM25 engine that builds no index in the browser. A character's Unicode script
decides how it is analyzed rather than the page language:

- **Unspaced CJK queries.** Contiguous Chinese, Japanese, and Korean runs are
  matched via overlapping bigrams without a dictionary, so queries such as
  `数据库连接池超时` or `PostgreSQL备份` work without manual spaces. A single
  CJK character stays one term; CJK/Latin boundaries split automatically.
  `search_keywords` remains useful for synonyms and abbreviations.
- **Identifiers and symbol runs.** Underscores, hyphens, dots, paths, command
  options, and symbol runs of two or more characters (`shared_buffers`,
  `pg_basebackup`, `--baseURL`, `/pg/data`, `->>`) are matched literally and
  never spelling-corrected.
- **Word boundaries, stemming, and typo fallback.** Ordinary words match
  exactly on word boundaries (`port` no longer matches `support`). Prefixes of
  longer words, Porter inflections for ASCII words, four-character stems for
  other alphabets, matches inside underscore names or compounds (five or more
  characters), and spelling fallback count as loose matches (0.7 of the field
  weight). Spelling fallback runs only when the selected scope has no form of
  an ASCII word of 5+ characters (1 edit for 5–7 characters, 2 edits from 8;
  transpositions count as 1 edit).
- **Atoms and stop words.** Case and Unicode width are normalized, and up to
  30 atoms participate in a query. A short list of English function words and
  six Chinese question words (`如何`, `怎么`, `什么`, `为什么`, `哪个`, `哪些`)
  are scored at 0.1 and not required unless the entire query consists of them.

Terms may match across indexed fields. Ranking follows these rules:

1. Pages covering at least 90% of query atom weight are complete matches and
   hide partial matches. Otherwise, partial matches appear in descending tenths
   of coverage with a matched/total label.
2. Complete matches covered within a single section (plus page-level fields)
   precede matches that span multiple sections.
3. Field strength takes the weighted mean of each atom's strongest field
   (title 10, keywords 8, tags/categories 6, headings and search entries 5,
   description 3, body 1; loose matches × 0.7), multiplied by 1.5 when the
   pieces appear adjacent and in order, and multiplied by `search_boost`.
4. The best section's BM25 score (`k1 = 1.2`, `b = 0.5`) multiplied by
   `search_boost` breaks ties within equal strength; title and URL break any
   remaining ties.

A boost cannot promote a partial match over a complete one. Results stay
grouped in the navbar's content-root order; ranking applies within those groups
after the global result limit. Keyword-only matches show the description or
excerpt, never the synonym list.

Each page occupies one result row, even when several sections match. The row
shows the best matching section or entry title and up to 160 characters around
the hits, highlighting inflections and spelling corrections as written on the
page, and opens the actual rendered anchor. Every anchored [field](/docs/components/fields/)
(from `{.fields}` or `fields`/`field`) automatically carries
`data-td-search-entry`, so querying a parameter name jumps straight to its
definition; custom markup with an `id` and non-empty `data-td-search-entry`
works the same way. A metadata-only hit opens the page when no section or entry
matches. `heading` and `summary` scopes target headings and field entries;
body-only queries require `content`. The configured summary length still
controls fallback excerpts.

The palette's **Search in** control shows two adjacent choices: all sections and the
current top-level section (such as Docs, Blog, or Book). It defaults to all
sections on each page load and retains the choice while reopening that page's
palette. Home has no current section. Commands and page actions stay available;
command mode hides the scope control. Use Tab to reach the selected scope and
the arrow keys to switch. Press Tab again to return to the query; Shift+Tab
from the query returns to the selected scope.

During input-method composition, result updates and Enter activation pause.
They resume after committed text. Empty, loading, unavailable, result-count,
and partial-match states remain readable and are announced to screen readers.

## Optional: hosted search {#hosted}
The theme also provides two hosted search integrations. Both are off by default.
**Enable only one at a time**. If more than one is configured,
the build warns `params: more than one site-search backend is configured`.

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
Algolia.
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
