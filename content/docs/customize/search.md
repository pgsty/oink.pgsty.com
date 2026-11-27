---
title: Search
linkTitle: Search
description: Add full-text search that runs in the reader's browser, and control what it indexes and how it ranks results.
weight: 60
search_keywords: [offline_search, full-text search, search, local search, index, BM25, CJK, search_boost, search_keywords, search_exclude, Algolia, DocSearch, Google CSE]
aliases:
  - /docs/advanced/search/
---

OINK's search runs entirely in the reader's browser. Hugo writes one JSON index
per language at build time, the browser downloads it on the first search, and
every query is answered locally, so there is no crawler, account, CDN or search
service to set up, and queries never leave the page. Search is off by default;
one line turns it on.

Readers search from the command palette;
[Command palette](/docs/customize/panel/) covers how they open it and what else
it offers.

## Turning on local search {#enable}

```yaml {title="hugo.yml"}
params:
  offline_search: true
```

Search then appears on the home page, on every page with a shell layout
(`docs`, `book`, `blog`, `swagger` or `expo`; see
[Layouts and page types](/docs/customize/layout/)), and on landing pages while
`params.ui.landing_search` is on. Print output never carries it. Other pages
get no search dialog, index reference or engine at all: these are not hidden,
they are never generated.

`hugo server` builds the index too, so the preview searches exactly like
production. On a very large site, rebuilding the whole index slows every
preview noticeably, and you can skip it during preview:

```yaml {title="hugo.yml"}
params:
  offline_search: true
  # skip index building during preview; only needed on very large sites
  offline_search_on_serve: false
```

## Controlling index size {#index-scope}

`offline_search_index` decides how much of each page goes into the index. That
is a trade between what readers can find and how much their browser downloads
on the first search:

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

`offline_search_summary_length` sets the length, in characters, of the excerpt
stored for each page (default 70), which a result shows when no passage
matches. `offline_search_max_results` caps the page results of one search
(default 10). [Configuration](/docs/customize/config/#search) has the full
definitions.

A large `content` index does not delay the first search. While a language's
index stays within 2 MiB, it is published as one file. Above that, the build
moves page text into a second file, `offline-search-body.<lang>.json`, so the
first download holds only titles, headings, field entries, descriptions and
keywords, and the palette answers from those at once. It then fetches the page
text in the background when that file is 8 MiB or smaller, or waits for the
reader to choose **Search page text** when it is larger or the browser asks to
save data (`Save-Data`). To leave page text out altogether, use `summary`.

## Adjusting ranking {#ranking}

A page can help readers find it through its own front matter:

```yaml {title="content/docs/reference/pgsql.md"}
---
title: PostgreSQL parameters
search_keywords: [postgres, postgresql, pg, database parameters, GUC]
search_boost: 1.5
---
```

`search_keywords` adds the words readers type that the page itself may never
use, as a string or a list. It usually helps more than a boost: a reader who
types `pg` or `GUC` now finds a page titled only "PostgreSQL parameters".
Keywords rank just below the title and above the body.

`search_boost` multiplies a page's score, both its field strength and its
section BM25 score, and defaults to `1.0`. A value of `1.5` lifts a page
without ever letting a partial match beat a complete one. Zero, negative and
non-numeric values warn and count as `1.0`.

Set a default for a whole section once with a cascade; a page's own value
still wins over the inherited one:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  search_boost: 1.25
---
```

On this site, every page under `docs/` lists its Chinese phrasing, its English
terms and the configuration keys it documents in `search_keywords`.

## Keeping a page out of the index {#exclude}

```yaml {title="content/internal/draft-plan.md"}
---
title: Internal plan
search_exclude: true
---
```

The index also leaves out pages with an empty body. Only `search_exclude`
works: the retired `exclude_search` and `excludeSearch` keys are ignored, so a
page that still uses them stays searchable; the migration checker reports
them.

> [!WARNING] The index is a static JSON file anyone can download; it is not access control.
> Do not put content that should stay private on the site, and do not use
> `search_exclude` to protect it.

## Chinese, mixed queries, and identifiers {#cjk}

The engine scores the downloaded index with BM25 as it scans it, and builds no
index of its own in the browser. It splits text by each character's Unicode
script rather than by the page's language, so one query can mix English,
Chinese and code identifiers:

- **Unspaced CJK queries.** Runs of Chinese, Japanese and Korean match through
  overlapping character pairs, with no dictionary, so `数据库连接池超时` or
  `PostgreSQL备份` works without spaces. A single CJK character stays one
  term, and a boundary between CJK and Latin text splits automatically.
  `search_keywords` is still the place for synonyms and abbreviations.
- **Identifiers and symbol runs.** Names with underscores, hyphens or dots,
  paths, command options and runs of two or more symbols (`shared_buffers`,
  `pg_basebackup`, `--baseURL`, `/pg/data`, `->>`) match literally and are
  never spelling-corrected.
- **Word boundaries, stemming and typos.** Ordinary words match whole words
  exactly, so `port` does not match `support`. Loose matches count for 0.7 of
  the field's weight: the prefix of a longer word, a Porter inflection of an
  ASCII word, a four-character stem in other alphabets, a word of five or more
  characters inside an underscore name or compound, and a spelling
  correction. Spelling correction applies only to ASCII words of five or more
  characters that appear in no form in the selected scope: one edit for 5–7
  characters, two from 8, with a swap of adjacent letters counting as one.
- **Query terms and stop words.** Case and Unicode width are normalized, and
  up to 30 terms of a query take part. A short list of English function words
  and six Chinese question words (`为什么`, `如何`, `怎么`, `怎样`, `什么`,
  `请问`) score at 0.1 and are not required, unless the query consists of
  nothing else.

The terms of a query may match in different fields of a page. Results rank by
these rules, in order:

1. A page that covers at least 90% of the query's weight is a complete match,
   and complete matches hide partial ones. When there is none, partial matches
   appear in descending tenths of coverage, labelled with how many terms
   matched.
2. Among complete matches, a page whose match fits in one section (plus
   page-level fields) comes before one whose match spans several sections.
3. Field strength is the weighted mean of each term's strongest field (title
   10, keywords 8, tags and categories 6, headings and search entries 5,
   description 3, body 1; loose matches × 0.7), multiplied by 1.5 when the
   terms appear adjacent and in order, and then by `search_boost`.
4. Equal strength is broken by the best section's BM25 score (`k1 = 1.2`,
   `b = 0.5`) times `search_boost`, and after that by title and URL.

A boost cannot lift a partial match above a complete one. Results stay grouped
by content root in the navbar's order; the result limit applies first, and the
ranking orders each group. A page found only through its keywords shows its
description or excerpt, never the keyword list.

Each page takes one result row, however many of its sections match. The row
names the best matching section or entry, shows up to 160 characters around
the hits with inflections and corrections highlighted as the page spells them,
and opens the rendered anchor. Every anchored [field](/docs/components/fields/),
whether from `{.fields}` or `fields`/`field`, carries `data-td-search-entry`
automatically, so searching for a parameter name jumps straight to its
definition; your own markup with an `id` and a non-empty `data-td-search-entry`
works the same way. A match only in page metadata opens the page itself. The
`heading` and `summary` scopes can still land on headings and field entries,
but words that appear only in body text need `content`.

The palette's **Search in** control narrows results to the current top-level
section (the home page has none); [Command palette](/docs/customize/panel/)
describes it. While an input
method is composing, results and Enter wait until the text is committed. Empty,
loading, unavailable, result-count and partial-match states all have readable
text and are announced to screen readers.

## Optional: hosted search {#hosted}

The theme also integrates two hosted search services, both off by default.
Each sends every query to a third party, so if you enable one, describe its
crawling, availability and privacy terms in the site's privacy statement. A
site uses one search backend: when more than one of local search, Algolia and
Google is configured, the build warns
`params: more than one site-search backend is configured`.

### Algolia DocSearch {#algolia}

```yaml {title="hugo.yml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

All three values are required, and OINK never falls back to another project's
public index. DocSearch's script and styles ship with the theme, so nothing
loads from a CDN, but every query goes to Algolia. It needs real credentials
and an index, so this page shows no live demo.

### Google Programmable Search {#google-cse}

```yaml {title="hugo.yml"}
params:
  gcs_engine_id: YOUR_ENGINE_ID
```

Results also need a page of their own:

```yaml {title="content/search.md"}
---
title: Search results
layout: search
---
```

The search box submits to `<baseURL>/search/?q=…`, where Google's script
renders the results; the reader's browser must be able to reach
`cse.google.com`. Because it depends on that service, this page shows no live
demo.

## Verify {#verify}

1. Build, and confirm there is one index per language:

   ```bash
   hugo --printPathWarnings
   ls public/offline-search-index.*
   ```

   A development build names the file `offline-search-index.zh.json`; a
   production build adds a fingerprint, as in
   `offline-search-index.zh.7ab….json`. A missing file means that language's
   pages never reached an index.

2. When Chinese queries find nothing, inspect the index first:

   ```bash
   python3 -c "import glob,json; f=sorted(glob.glob('public/offline-search-index.zh*.json'))[0]; \
     d=json.load(open(f)); print(f, len(d)); print(d[0])"
   ```

   The entry count should be close to the number of Chinese pages, and the
   `keywords` and `boost` fields should show what the front matter set.

3. Open the site and press <kbd>/</kbd>. Search for an English word, then a
   Chinese one. Results are grouped by content root, each group named after
   the first breadcrumb segment.

4. For a subpath deployment such as `https://example.com/docs/`, open the
   browser's network panel and check that the index request includes the
   subpath. An index request to the domain root returns 404 while the page
   itself works, and this is the most common reason search returns nothing.

## Related {#related}

- [Command palette](/docs/customize/panel/) — search's entry point, and the commands and page actions beside it
- [Keyboard navigation](/docs/customize/keyboard/) — the four single keys that open search and commands
- [Languages](/docs/customize/i18n/) — per-language indexes and untranslated fallback
- [Configuration](/docs/customize/config/) — full definitions of the `offline_search*` keys
- [Page parameters](/docs/write/frontmatter/) — `search_keywords` / `search_boost` / `search_exclude`
