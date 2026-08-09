---
downstream_modified: true
title: Search
description: Configure local multilingual search or an explicit online provider.
cSpell:ignore: GCSE docsearch
---

OINK's default and recommended search is local. Hugo generates a per-language
index; the theme serves Lunr and its CJK fallback from same-origin assets. The
site can build and search without a public crawler, external account, CDN, or
network connection.

Google Custom Search and Algolia DocSearch remain compatible online
integrations. They are disabled by default and should be enabled only when the
site accepts their external requests, indexing, availability, and privacy
boundaries.

Only one search implementation can be active at a time.

## Local search with Lunr {#local-search-with-lunr}

Enable local search in `hugo.yaml`:

```yaml
params:
  offlineSearch: true
```

Do not configure `gcs_engine_id` or `params.search.algolia` at the same time.
After a production build, the output contains one index per language, for
example:

```text
offline-search-index.en.json
offline-search-index.zh.json
```

The browser loads the active language's index and displays results without
leaving the page. Chinese content uses OINK's CJK fallback instead of depending
on whitespace tokenization.

### Build the index before testing

Run a normal build before starting a preview:

```sh
hugo --gc
hugo server --disableFastRender
```

If the server was already running when the index changed, restart it. On a
subpath deployment, confirm that the browser requests the index under the
configured `baseURL` rather than from the domain root.

### Configure result summaries and limits

Set the summary length and maximum result count:

```yaml
params:
  offlineSearch: true
  offlineSearchSummaryLength: 120
  offlineSearchMaxResults: 12
```

Choose limits that keep the search dialog responsive on mobile devices. The
summary is a discovery aid, not a replacement for a well-written page
description.

### Exclude a page

Set `exclude_search: true` in page front matter:

```yaml
---
title: Internal index
exclude_search: true
---
```

Use this for utility, duplicate, generated, or test pages. Do not exclude a page
only because its current translation is incomplete; fix the translation instead.

### Style the result panel

The result panel grows with its content. A site can constrain it in
`assets/scss/_styles_project.scss`:

```scss
.td-offline-search-results {
  max-width: 46rem;
}
```

Preserve keyboard focus, visible selection, mobile width, and dark-mode contrast
when overriding search styles.

## Search entry points

OINK exposes search from the branded shell and can also show a sidebar input. To
hide the sidebar input while retaining the main search entry, configure:

```yaml
params:
  ui:
    sidebar_search_disable: true
```

The shell's open and close controls expose their dialog relationship and state
to assistive technology. A custom implementation must preserve those semantics.

## Multilingual search

Search stays in the active language. Verify that:

- every published language has its own index;
- translated titles, descriptions, and body text appear in that index;
- a result URL contains the correct language prefix;
- English results do not replace Chinese results through content fallback;
- the language selector on a result page reaches the corresponding translation
  or the documented language-home fallback.

For Chinese search failures, inspect the generated Chinese JSON before changing
tokenization. A missing or English-only index is usually a content or build
configuration problem.

## Google Custom Search (optional) {#google-search}

Google Custom Search Engine (GCSE) searches a public site through Google's
index. It requires a deployed, crawlable production site and sends queries to a
third-party service.

After creating an engine in [Google Programmable Search][], add a search result
page:

```yaml
---
title: Search results
layout: search
---
```

Then configure its engine ID:

```yaml
params:
  gcs_engine_id: YOUR_ENGINE_ID
  offlineSearch: false
```

Create a translated result page for every supported language and use a
language-appropriate engine configuration when needed. Removing `gcs_engine_id`
disables GCSE.

Document the external request and privacy implications in the consuming site's
policy. GCSE is not available in an air-gapped deployment.

## Algolia DocSearch (optional) {#algolia-docsearch}

Algolia DocSearch provides a hosted crawler and interactive result panel for
eligible public documentation sites. Obtain the project's application ID, search
API key, and index name, then configure:

```yaml
params:
  offlineSearch: false
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_API_KEY
      indexName: YOUR_INDEX_NAME
```

Use a search-only public key, never an administrative key. Keep crawler rules,
language facets, index updates, and external-service disclosure with the site
configuration. This integration is intentionally separate from the local-first
default.

The theme partials `layouts/_partials/algolia/head.html` and
`layouts/_partials/algolia/scripts.html` can be overridden for a site-specific
integration. An empty override disables that theme partial.

## Custom search {#custom-search}

If none of the supported choices fits, a site can replace the search input,
result behavior, and styles. Reuse the shell's dialog and accessibility
contracts where possible. Keep custom code at the site layer unless it is
provider-neutral and reusable across multiple products.

A custom online provider must be opt-in and document its network, privacy,
indexing, failure, and offline behavior. A custom local provider must publish
all runtime assets from the site or theme and respect language and `baseURL`
boundaries.

[Google Programmable Search]: https://programmablesearchengine.google.com/
