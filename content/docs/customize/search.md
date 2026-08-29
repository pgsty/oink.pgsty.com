---
title: Search
linkTitle: Search
description: Turn on local search, control index size and result ranking, and make CJK queries land.
weight: 60
search_keywords: [offline_search, full-text search, search, local search, index, Lunr, CJK, search_boost, search_keywords, search_exclude, Algolia, DocSearch, Google CSE]
aliases:
  - /docs/advanced/search/
---

OINK's search is local search: Hugo generates one JSON index per language at
build time, the reader's browser downloads it, and the search runs in the
browser. No crawler, no account, no CDN, and no network access. The theme leaves
it off, and one line of configuration turns it on.

The entry point to search is the command palette; how to open it and what else
it holds are in [Command palette](/docs/customize/panel/).

## Turning on local search {#enable}

```yaml {title="hugo.yml"}
params:
  offline_search: true
```

This one key decides whether the index, the Lunr runtime and the search dialog
reach a page. Three conditions must hold together:

- `params.offline_search` is true;
- The page is the home page, or uses a shell layout (`docs` / `book` / `blog` / `swagger` — see [Layouts and page types](/docs/customize/layout/)), or is a landing page with `params.ui.landing_search` on;
- The current output is not print.

If any one fails, the build puts no dialog, no index reference and no Lunr into
that page. Those resources are not hidden; they are never generated.

Under `hugo server` the index is generated **as well** by default, so the
preview behaves like production. On a very large site, where rebuilding the
whole index on every change slows the preview noticeably, turn it off:

```yaml {title="hugo.yml"}
params:
  offline_search: true
  # skip index building during preview; only needed on very large sites
  offline_search_on_serve: false
```

## Controlling index size {#index-scope}

`offline_search_index` decides how much of each page goes into the index, and so
decides two things at once: whether a reader can find words from the body, and
how large the first search's download is.

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
| `summary` | The above plus description and summary | Sites in the thousands of pages; this site uses it |
| `content` | The above plus the full plain text | The default, suitable up to a few hundred pages |

Any other value warns and uses `content` during ordinary preview; a strict
publishing build fails on `invalid params.offline_search_index`.

`offline_search_summary_length` is where a result row's excerpt is cut (default
70), and `offline_search_max_results` caps the number of results (default 10).
The full definitions are in [Configuration](/docs/customize/config/).

> [!IMPORTANT] One index per language, budgeted at 2 MiB raw and 512 KiB gzipped.
> The reader downloads the whole index before searching for a first word. Past
> that size, step `offline_search_index` down from `content` to `summary`.

## Adjusting ranking {#ranking}

A page influences its own ranking from front matter:

```yaml {title="content/docs/reference/pgsql.md"}
---
title: PostgreSQL parameters
search_keywords: [postgres, postgresql, pg, database parameters, GUC]
search_boost: 1.5
---
```

`search_keywords` adds matching terms and takes either a string or an array. It
is the more useful of the two: a reader searching `pg` or `GUC` reaches a page
whose title only says "PostgreSQL parameters". In ranking, keywords weigh less
than the title and more than the body.

`search_boost` is a positive multiplier on the final score, defaulting to `1.0`
and applied on top of the text match score. `1.5` does not pin a page to first
place; it moves the page up among results it already matched. Zero, a negative
number and a non-number all warn and are treated as `1.0`.

Set a section-wide default once with a cascade:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  search_boost: 1.25
---
```

A page's own value overrides the inherited one. Pages under this site's `docs/`
use `search_keywords` in exactly this way: each lists the Chinese phrasing, the
English term and the configuration key name.

## Keeping a page out of the index {#exclude}

```yaml {title="content/internal/draft-plan.md"}
---
title: Internal plan
search_exclude: true
---
```

`search_exclude` is the only spelling. The removed `exclude_search` and
`excludeSearch` keys are not read and therefore do not protect a page; the
migration checker reports them. A page with an empty body is not indexed.

> [!WARNING] The index is a static JSON file anyone can download; it is not access control.
> Do not put content that should stay private on the site, and do not use
> `search_exclude` to protect it.

## Chinese and CJK {#cjk}

Lunr cannot reliably tokenize Chinese. When the palette detects a CJK character
in the query, the whole query switches to substring matching: it compares title,
keywords, in-page headings, description and body in turn, scores whichever layer
matched, and finally multiplies by `search_boost` as usual. Both paths rank by
the same rules.

Three things follow:

- A CJK query is a **substring** match. Searching 主从复制 finds only where those four characters appear consecutively; 复制主从 returns nothing.
- `search_keywords` therefore pays off most on a Chinese site: write in the synonyms, English terms and abbreviations a reader might use.
- While an input method is composing, the palette does not recompute; it searches once the text is committed, so typing Chinese does not refresh results character by character.

When a Chinese query finds nothing, first confirm the Chinese page reached the
Chinese index (see Verify below) before suspecting tokenization.

## Optional: hosted search {#hosted}
Besides local search, the theme keeps two hosted integrations, both off by
default. **Enable only one at a time**: with more than one configured the build
warns `You have more than one site-search option configured`.

Enabling hosted search means accepting that service's crawling behaviour,
availability and privacy boundary, all of which belong in the site's privacy
statement.

### Algolia DocSearch {#algolia}

```yaml {title="hugo.yml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

All three values must be written explicitly, and a missing one stops the build:
OINK never falls back to another project's public index. The DocSearch JS and
CSS ship with the theme rather than loading from a CDN, but every query is a
request to Algolia. Real credentials and a real index are needed for it to work,
so nothing is rendered here.

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

The search box submits the query to `<baseURL>/search/?q=…`, and Google's script
renders the results on that page, which needs access to `cse.google.com`. It is
likewise an external service and is not rendered here.

## Verify {#verify}

1. Build, and confirm one index per language was generated:

   ```bash
   hugo --printPathWarnings --panicOnWarning
   ls public/offline-search-index.*
   ```

   In a development build the filename is `offline-search-index.zh.json`; a
   production build fingerprints it, as in
   `offline-search-index.zh.7ab….json`. One file per language, and a missing
   one means that language's pages never reached an index.

2. Look inside the index — the first step in diagnosing "Chinese finds nothing":

   ```bash
   python3 -c "import glob,json; f=sorted(glob.glob('public/offline-search-index.zh*.json'))[0]; \
     d=json.load(open(f)); print(f, len(d)); print(d[0])"
   ```

   The entry count should be close to the number of Chinese pages, and the
   `keywords` and `boost` fields should show what the front matter set.

3. Open the site, press <kbd>/</kbd>, and search once with an English word and once with a Chinese one. Results are grouped by content root, each group named after the first breadcrumb segment.

4. On a subpath deployment (the site under something like `https://example.com/docs/`), open the browser's network panel and confirm the index request carries the subpath. An index request hitting the domain root and returning 404, while the rest of the page works, is the most common cause of "search returns nothing".

## Related {#related}

- [Command palette](/docs/customize/panel/) — search's entry point, and the commands and page actions beside it
- [Keyboard navigation](/docs/customize/keyboard/) — the four single keys that open search and commands
- [Languages](/docs/customize/i18n/) — per-language indexes and untranslated fallback
- [Configuration](/docs/customize/config/) — full definitions of the `offline_search*` keys
- [Page parameters](/docs/write/frontmatter/) — `search_keywords` / `search_boost` / `search_exclude`
