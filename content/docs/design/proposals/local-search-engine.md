---
title: Local search without Lunr
linkTitle: Local search engine
description: A draft that replaces Lunr with one scanning engine, ranks by BM25, and reads CJK text by script instead of by language tag.
weight: 15
icon: fa-solid fa-magnifying-glass
search_keywords:
  [
    local search,
    offline_search,
    Lunr,
    BM25,
    CJK,
    bigram,
    stemming,
    typo,
    search engine,
    command palette,
  ]
design_kind: proposal
design_status: accepted
proposal_date: 2026-11-23
---

> [!IMPORTANT] Accepted for v1.6.0
> Owner: OINK maintainers. Affected contracts: [Shell](/docs/design/shell/#search-engine)
> and [Components](/docs/design/components/#steps-cards-fields-and-tables).
> All three stages are accepted for OINK v1.6.0 and defined normatively in the
> owning contracts. This page preserves the design rationale, benchmark
> evidence, and open follow-up questions.

## Status and scope {#status}

Local search stays what it is: Hugo writes one JSON index per language, and the
reader's browser searches it. A site still turns it on with `offline_search: true`
and needs nothing but the Hugo binary. This proposal changes the engine inside
that boundary, in three stages delivered together in OINK v1.6.0.

| Stage | Change | State |
| ----- | ------ | ----- |
| 1 | One scanning engine replaces Lunr and the substring fallback | Accepted for v1.6.0 |
| 2 | A large index is split: a small navigation index loads first, page text follows by size | Accepted for v1.6.0 |
| 3 | Definitions below heading level become searchable entries | Accepted for v1.6.0 |

A database-backed search is a separate, later design. [A database backend later](#backend)
states only what this proposal keeps open for it.

## Evidence {#evidence}

Measured on 2026-11-23 with Node 26.13 on one machine. Browser numbers will differ.

The engine in 1.5.1 has two paths. Every term is matched as a substring of each
field, and ASCII words also go through Lunr for English stemming and spelling.
Lunr builds its index over the whole site on the first such word.

| Problem in 1.5.1 | Measurement |
| ---------------- | ----------- |
| The first English query stalls | 271–410 ms on two sites with 1.3–1.7 MB content indexes; 2.5–3.5 s and about 800 MB of heap on a 792-page PostgreSQL manual |
| Every query is slow on long pages | 27–120 ms on those two sites, against an 80 ms input delay; up to 890 ms on the manual, spent mapping excerpt offsets over whole page bodies |
| Substring matches | `port` returns five pages titled "… Support" first; 435 pages hold the substring, 70 hold the word |
| Unspaced Chinese finds nothing | 7 of 16 queries such as `数据库连接池超时` return no result |
| A stemmed or corrected hit has no location | `vaccum` finds the VACUUM page with no section and only the page description |
| Operators are dropped | `->>` yields no term |
| Ranking ignores rarity and length | Each term weighs the same, and a page counts as one unit however long |

Capacity is a second limit. The largest maintained consumers use `summary`
scope because their `content` indexes exceed the budget; content indexes of
5–10 MB exist. Stage 2 addresses that. Stage 1 does not.

On a maintained 163-page site whose `content` index was 8.1 MB, stage 2
publishes a 609 KB navigation index (123 KB gzipped) and 7.5 MB of page text
(2.4 MB gzipped). First results need the former instead of the whole index.
In a browser, creating the engine again when the text arrives takes 64 ms, and
a query then takes 3–8 ms.

For stage 3, an experimental conversion of the PostgreSQL manual was built
unchanged. Its 7,790 fields per language became entries. A query for
`work_mem`, `shared_buffers` or `autovacuum_naptime` opens the parameter's own
entry, and does so from the navigation index alone, before any page text is
fetched. That index is 1.7 MB (335 KB gzipped) with the entries in it.

The stage 1 engine, on this site's `content` index (166 pages and 1,443
sections per language, about 1.7 MB):

| Measure | 1.5.1 | Stage 1 |
| ------- | ----- | ------- |
| First English query | 198–551 ms | 8–19 ms |
| Median query | 5.2–8.7 ms | 1.6–2.1 ms |
| 95th percentile | 13.4–19.2 ms | 3.4–4.1 ms |
| Expected page in the top five, both scopes | 43 of 46 | 46 of 46 |

The last row counts the 46 curated queries that name a page, in the `summary`
and `content` scopes together. Two more expect an empty result and pass in both
engines. The three new passes are Chinese queries typed without spaces. On the PostgreSQL
manual, creating the engine takes 65–112 ms, a query averages 10–16 ms with a
worst case of 32 ms, and retained heap is 19–32 MB. A misspelt word costs
about 140 ms once, to collect the site's vocabulary.

A prototype of the bigram matching was compared with jieba segmentation plus
BM25 on the Chinese manual. Over 35 Chinese and mixed queries the two agreed on
82% of the top ten pages. This measures agreement, not quality.

The engine source is 36.7 KB, or 11.6 KB gzipped. The 1.5.1 engine and Lunr
together are 42.1 KB and 12.7 KB.

## Goals and non-goals {#goals}

Goals:

- remove the Lunr dependency and the index it builds in the browser;
- answer unspaced Chinese, Japanese and Korean queries without a dictionary;
- match words at word boundaries, and keep identifiers and operators literal;
- rank with the rarity of a term and the length of a section;
- locate and highlight every match, including inflections and corrections;
- add no configuration key, build step, download or language switch.

Non-goals:

- a segmentation dictionary, WebAssembly, a Web Worker, or a build tool beside Hugo;
- a synonym file; `search_keywords` remains the way to add synonyms;
- folding Traditional and Simplified Chinese; this needs a vendored table and a separate decision;
- loading part of an index by query; a Hugo-only build cannot shard by term;
- a remote search provider.

## Stage 1: the engine {#engine}

No index is built. The engine joins all searchable text into one folded string
and records where each field of each page and section starts. A query term is
located by scanning that string. The scan yields the counts that BM25 needs.

### Query analysis {#analysis}

Text is folded with NFKC, lowercased, and whitespace is collapsed. The query
becomes pieces in the order typed:

| Piece | What it is | Example |
| ----- | ---------- | ------- |
| Word | Letters or digits of a script that separates words | `port`, `репликация`, `5432` |
| Identifier | A piece holding `-`, `.`, `/`, `\`, `_`, `:` or `=`; kept whole | `shared_buffers`, `--baseURL`, `/pg/data` |
| Symbol run | Two or more characters with no letter or digit | `->>`, `::` |
| CJK run | Consecutive Han, Hiragana, Katakana or Hangul characters | `连接池`, `レプリケーション`, `백업` |

A character's Unicode script decides its class. The page language never does:
an English page may quote Chinese, and a reader may type either. A piece is cut
where a CJK character meets a letter or digit, so `WAL归档` and `WAL 归档` are
the same query and `pg_upgrade升级` is an identifier and a run. A path such as
`文档/搜索.md` stays one identifier.

A CJK run of one character is one term. A longer run becomes its overlapping
bigrams: `连接池` is `连接` and `接池`. Nothing decides where a word ends.

What a page must cover is counted in atoms: each word, identifier and symbol
run, and each character of a CJK run. A query holds at most 30 atoms.

A short list of English function words and six Chinese question words still
match, at a tenth of the weight, and no page is required to contain them. A
query made only of such words is searched as written.

### Matching {#matching}

Every match is exact or loose.

| Piece | Exact | Loose |
| ----- | ----- | ----- |
| Word | The whole word | A longer word it begins; another inflection; one part of an underscore name; the inside of a compound, for words of five or more characters; a correction |
| Identifier | Bounded by non-identifier characters | Inside a longer identifier |
| Symbol run | Not next to another operator character | Inside a longer operator |
| CJK bigram | Any occurrence | — |

Inflection uses Porter's English suffix rules for `a`–`z` words. Words of other
alphabets match when they share at least four leading characters and differ by
at most three trailing ones. A word that holds a digit does not inflect.

Spelling help applies only when the selected scope holds no form of the word.
It covers `a`–`z0`–`9` words of at least five characters, with one edit, or two
from eight characters. A transposition is one edit. The three most frequent
candidates in the site are searched as whole words. Identifiers are never corrected.

### Ranking {#ranking}

A page is a complete match when it covers at least 90% of the query's atoms by
weight. An atom weighs the inverse document frequency of its commonest covering
term. A bigram that occurs nowhere in the scope is not required while its
characters are covered by other bigrams. An atom that no term can cover stays
uncovered, so every page is then a partial match.

Pages are ordered by these keys:

1. Complete matches hide partial ones. A page covered within one section, together with the page's own fields, leads a page that needs several sections.
2. Strength. Each atom takes the strongest match found for it: title 10, keywords 8, tags and categories 6, headings 5, description 3, body 1; a loose match counts 0.7 of its field. Strength is the weighted mean over atoms, multiplied by 1.5 when the pieces are adjacent and in order, and by the page's `search_boost`.
3. The BM25 score of the best section, multiplied by `search_boost`.
4. Title, then URL.

Strength depends on where the query was found and never on how often.
Repetition therefore reorders pages only within equal strength.

Partial matches are ordered by coverage in tenths, then by the same keys. They
keep the matched/total label. A word counts once in it, and a CJK run counts
by pairs of characters.

BM25 runs per section with `k1` 1.2 and `b` 0.5 over section length in
characters. Occurrences are weighted by field, scaled by match quality, and
capped at 24 per field. A bigram of a run of `n` characters weighs
`n / (2(n − 1))`, because the run holds about `n/2` words.

Each page still occupies one row and opens its best section.

### Excerpts and highlights {#excerpts}

The excerpt is the 160-character passage of the best section that shows the
most different matches. A result carries the strings that were found, so an
inflection or a corrected spelling is highlighted as written in the page. A
word is not highlighted inside another word unless it could match there.
Normalized matches still map back to the original text.

## Stage 2: staged loading {#loading}

The index template still writes every document with its body. What Hugo
publishes depends on the size of that output:

| Index size | Published files | Page text |
| ---------- | --------------- | --------- |
| Up to 2 MiB | `offline-search-index.<lang>.json`, byte for byte as before | Inside the index |
| Above 2 MiB, text up to 8 MiB | The index without `body`, and `offline-search-body.<lang>.json` | Fetched by itself after the index, then added to the results |
| Text above 8 MiB, or Save-Data | The same two files | Fetched when the reader chooses "Search page text", which shows its size |

2 MiB is the existing raw budget of one index, so a site within the budget
sees no change. The split index holds everything that locates a page: titles,
headings with anchors and byte offsets, keywords, taxonomies, descriptions.
The body file is a list of `{ref, body}` entries. Both names are fingerprinted
in production.

The palette requests the index on the first search keystroke, as before, and
shows its results at once. While the text loads, the status line says so, and
an empty result is reported as loading, not as no results. When the text
arrives the engine is created again and the reader's selected row is kept. A
failed download offers the same row to retry. Opening the palette alone still
requests nothing.

No key is added. `offline_search_index` remains a manual reduction, and a
`summary`, `heading` or `title` index has no body to move. A site template
that overrides `assets/json/offline-search-index.json` is split the same way.
The byte budget applies to the index that is fetched first.

## Stage 3: searchable entries {#entries}

Parameters and functions are usually defined in lists, not headings, so the
index could not target them. It now records search entries beside headings:
any rendered element with an `id` and a non-empty `data-td-search-entry`
title.

Every anchored field is an entry, from the `fields` shortcode and from a
`{.fields}` table. Nothing has to be configured or rewritten. A site can mark
its own elements the same way, from a shortcode or with a block attribute.

Entries join `sections` in document order with the same `id`, `title` and
`start`, so the index format and the engine are unchanged. The page text is
divided among headings and entries in that order. A section that holds
entries keeps only the text before the first one, and text inside an entry
opens that entry. `headings` still lists headings only.

`field` accepts `id`, so a reference page can keep an established anchor such
as `guc-work-mem` instead of `field-work_mem`. An unusable value, or one
another field already uses, warns and keeps the generated anchor. An id that
equals a heading's is not detected, as with any explicit id.

An entry carries no kind. Nothing displays or filters by one yet, and the
field can be added to `sections` later without breaking a reader.

## A database backend later {#backend}

A later design may add a search provider backed by PostgreSQL. This proposal
keeps two things open for it. The index file is complete enough to import as a
corpus. The engine returns plain result rows through one call, which a remote
provider can also produce once the palette awaits results. Nothing here adds a
network request.

## Compatibility and migration {#compatibility}

Configuration and front matter keys do not change, and an index within 2 MiB
keeps its fields. Indexes written by earlier releases still load.

- The theme no longer ships or loads Lunr, and `window.lunr` is undefined on OINK pages. A site that used the theme's copy must load its own.
- `OinkSearchEngine.create` takes `(documents, maxResults)`. The Lunr argument is gone.
- Results add `marks` and `strength`. The scale of `score` and `textScore` changed.
- A term no longer matches inside a short word. Queries that relied on `port` finding `support` return fewer pages.
- A contiguous phrase is a multiplier, not a tier. A large `search_boost` can outrank it.
- A CJK run no longer has to occur whole. Results that were empty may now be complete or partial matches.
- An index above 2 MiB has no `body` in its documents. A tool that read page text from the index must read `offline-search-body.<lang>.json` and join it by `ref`.
- The dialog gains `data-td-body-src` and `data-td-body-bytes` when the index is split. `offline-search-index.html` still returns the index URL.
- Two strings are added to every locale: `ui_search_body_load` and `ui_search_body_loading`.
- Rendered fields gain `data-td-search-entry`, and an index holds one more `sections` item per field. A section that contains fields no longer answers for text inside them; that text opens the field.

## Implementation and checks {#checks}

| Owner | Check |
| ----- | ----- |
| Theme | `tests/js/search-engine.test.js` for analysis, matching, ranking, excerpts and the published Porter examples; `check-search.py` for the built index and ranking on it |
| Theme | `check-palette.py`, `check-navigation-contract.py` and `check-runtime-isolation.py` assert that no page loads Lunr |
| Theme | `check-vendor.py` after removing the Lunr artifact, license and tree entry |
| Theme | `check-search.py` builds a probe above 2 MiB: one language is split, the other is not, section offsets address the separated text, and the dialog names the file and its size |
| Theme | `tests/js/command-palette.test.js` for results before the text, the loading state, the reader's request, Save-Data, and retry after a failed download; `check-i18n.py` for the two strings |
| Theme | `check-search.py` for field and custom entries on the built index: order, titles, offsets, skipped invalid entries and their warning, and opening a field by name; `check-content-primitives.py` for the `id` parameter and its fallbacks |
| Site | `tests/search/queries.json` with `scripts/check-search-corpus.mjs`, which can time an older engine with `--baseline-engine` and `--baseline-lunr` |
| Site | Palette browser tests for composition, scope, partial state and keyboard use |

User guides and the license table have been updated for v1.6.0 alongside the
normative contracts.

## Acceptance and open decisions {#acceptance}

The stages are accepted for OINK v1.6.0: the theme checks, real-corpus checks in
both `summary` and `content` scopes, and the documentation site's `check` and
`browser` targets pass against them. This site's index is within the 2 MiB
budget, so stage 2 is exercised by the theme's probe and unit tests and by
larger consumer corpora.

Open decisions (deferred beyond v1.6.0):

1. Are the weights right? Field worth, the loose factor, the phrase multiplier, and `b` come from a 48-query set and one large manual, not from labeled relevance.
2. Should partial matches follow complete ones when few pages are complete?
3. Should `offline_search` default to on? Nearly every maintained consumer sets it.
4. Should Traditional and Simplified Chinese fold together?
5. Do Arabic and Hebrew prefixes need a rule of their own?
6. Is 8 MiB the right limit for loading page text unasked? It is a first choice, not a measured one.
7. Should an entry carry a kind, and should a result show it?

## Decision log {#decision-log}

- 2026-11-23: Accepted all three stages for OINK v1.6.0; promoted behavior into the Shell and Components contracts and updated user guides and license inventory.
- 2026-11-23: Drafted. Chose scanning over an inverted index after measuring 1–8 ms per term over 12 MB of text. Chose bigrams over `Intl.Segmenter`, which split `数据库连接池超时` into six fragments and varies by browser, and over a dictionary, whose 5 MB cannot ship with a theme. Rejected segmenting the query against the site's own text after it proved unstable.
- 2026-11-23: Implemented stage 3. An entry is one more item of `sections`, so neither the index format nor the engine changed. The marker is an attribute any markup can carry; fields set it themselves. The planned `kind` was left out because nothing would read it.
- 2026-11-23: Implemented stage 2. The split happens at the existing 2 MiB budget, so compliant sites publish the same bytes. The index template stays the only author of documents, because five consumer sites override it; the split is derived from its output. Page text is not requested when the palette opens, which keeps the rule that commands never cost a download.
- 2026-11-23: Implemented stage 1 in the theme's working tree. Ranking moved from the weakest field needed to a weighted mean of field strengths after a curated query regressed. A phrase became a multiplier after it lifted low-scoring research pages over the canonical one.
