---
title: Taxonomy support
tags: [Tagging, Structuring Content, Labelling]
categories: [Taxonomies]
weight: 110
description: Organize content with tags, categories, and custom taxonomies.
cSpell:ignore: taxo
---

Oink supports Hugo [taxonomies][] in its docs and blog sections. You can see the
default layout and can test the behavior of the generated links on this page.

## Terminology {#terminology}

To understand the usage of taxonomies you should understand the following
terminology:

- **Taxonomy**: a categorization that can be used to classify content - e.g.:
  Tags, Categories, Projects, People

- **Term**: a key within the taxonomy - e.g. within projects: Project A, Project
  B

- **Value**: a piece of content assigned to a term - e.g. a page of your site,
  that belongs to a specific project

A [movie-website sample][] taxonomy is provided by the Hugo docs.

[movie-website sample]:
  https://gohugo.io/content-management/taxonomies/#example-taxonomy-movie-website

## Parameters {#parameters}

There are various parameters to control the functionality of taxonomies in the
project [configuration file][]. Taxonomies are [enabled by default][] for `tags`
and `categories` in Hugo. To **disable** taxonomies, add the following to your
project config:

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="Configuration file:" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
disableKinds = ["taxonomy"]
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
disableKinds: [taxonomy]
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "disableKinds": [ "taxonomy" ]
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

With the default settings, Hugo generates taxonomy pages for `tags` and
`categories`. If you want to use other taxonomies you have to define them in
your [configuration file][]. If you want to use beside your own taxonomies also
the default taxonomies `tags` and `categories`, you also have to define them
beside your own taxonomies. You need to provide both the plural and singular
labels for each taxonomy.

With the following example you define a additional taxonomy `projects` beside
the default taxonomies `tags` and `categories`:

<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="Configuration file:" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[taxonomies]
tag = "tags"
category = "categories"
project = "projects"
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
taxonomies:
  tag: tags
  category: categories
  project: projects
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "taxonomies": {
    "tag": "tags",
    "category": "categories",
    "project": "projects"
  }
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->

You can use the following parameters in your project's config to control the
output of the assigned taxonomy terms for each article resp. page of your docs
and blog sections, plus a taxonomy cloud in Oink's right sidebar:

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="Configuration file:" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params.taxonomy]
taxonomyCloud = ["projects", "tags"] # set taxonomyCloud = [] to hide taxonomy clouds
taxonomyCloudTitle = ["Our Projects", "Tag Cloud"] # if used, must have same length as taxonomyCloud
taxonomyPageHeader = ["tags", "categories"] # set taxonomyPageHeader = [] to hide taxonomies on the page headers
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  taxonomy:
    taxonomyCloud:
      - projects    # remove all entries
      - tags        # to hide taxonomy clouds
    taxonomyCloudTitle:   # if used, must have the same
      - Our Projects      # number of entries as taxonomyCloud
      - Tag Cloud
    taxonomyPageHeader:
      - tags        # remove all entries
      - categories  # to hide taxonomy clouds
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "taxonomy": {
      "taxonomyCloud": [
        "projects",
        "tags"
      ],
      "taxonomyCloudTitle": [
        "Our Projects",
        "Tag Cloud"
      ],
      "taxonomyPageHeader": [
        "tags",
        "categories"
      ]
    }
  }
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

The settings above would only show a taxonomy cloud for `projects` and `tags`
(with the headings "Our Projects" and "Tag Cloud") in Oink's right sidebar and
the assigned terms for the taxonomies `tags` and `categories` for each page.

To disable any taxonomy cloud you have to set the Parameter `taxonomyCloud = []`
resp. if you don't want to show the assigned terms you have to set
`taxonomyPageHeader = []`.

By default, the plural label of a taxonomy is used as its cloud title. You can
override the default cloud title with `taxonomyCloudTitle`. But if you do so,
you have to define a manual title for each enabled taxonomy cloud
(`taxonomyCloud` and `taxonomyCloudTitle` must have the same length!).

If you don't set the parameters `taxonomyCloud` resp. `taxonomyPageHeader` the
taxonomy clouds resp. assigned terms for all defined taxonomies will be
generated.

## Sidebar and right rail {#sidebar-and-rail}

Clouds are **scoped to the reader's current top-level section**: on a docs page
each term counts only its docs members, and on a blog page only its blog
members. The counts therefore describe the section the reader is browsing rather
than the whole site.

A taxonomy term page has no place in the content tree, so it borrows one. If
every page carrying the term lives under the same top-level section, the term
page adopts that section for its sidebar tree, its root link, and its own clouds
— following a docs tag keeps you inside the docs navigation. When the term's
members span several sections, the term page falls back to the site-wide tree
and shows no root row.

Each cloud renders as a right-rail group with the same header treatment as the
page outline, and its icon can be set per plural taxonomy name:

```yaml {filename="hugo.yaml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: fa-solid fa-tags
      projects: fa-solid fa-diagram-project
```

`categories` and `tags` have the defaults shown above; a taxonomy that is not
named here gets a generic shapes glyph. See
[Right-rail groups](/docs/configure/navigation/#rail-groups).

## Partials {#partials}

The partials used by default for displaying taxonomies are defined so that you
can easily use them in your own layouts.

### `taxonomy_terms_article` {#taxonomy_terms_article}

The partial `taxonomy_terms_article` shows all assigned terms of a given
taxonomy (partial parameter `taxo`) of an article respectively page (partial
parameter `context`, most of the time the current page or context `.`).

Example usage in `layouts/docs/list.html` for the header of each page in the
docs section:

```go-html-template
{{ $context := . }}
{{ range $taxo, $taxo_map := .Site.Taxonomies }}
  {{ partial "taxonomy_terms_article.html" (dict "context" $context "taxo" $taxo ) }}
{{ end }}
```

This will give you for each in the current page (resp. context) defined taxonomy
a list with all assigned terms:

```html
<div class="taxonomy taxonomy-terms-article taxo-categories">
  <h5 class="taxonomy-title">Categories:</h5>
  <ul class="taxonomy-terms">
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/taxonomies/"
        data-taxonomy-term="taxonomies"
        ><span class="taxonomy-label">Taxonomies</span></a
      >
    </li>
  </ul>
</div>
<div class="taxonomy taxonomy-terms-article taxo-tags">
  <h5 class="taxonomy-title">Tags:</h5>
  <ul class="taxonomy-terms">
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/tags/tagging/"
        data-taxonomy-term="tagging"
        ><span class="taxonomy-label">Tagging</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/tags/structuring-content/"
        data-taxonomy-term="structuring-content"
        ><span class="taxonomy-label">Structuring Content</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/tags/labelling/"
        data-taxonomy-term="labelling"
        ><span class="taxonomy-label">Labelling</span></a
      >
    </li>
  </ul>
</div>
```

### `taxonomy_terms_article_wrapper` {#taxonomy_terms_article_wrapper}

The partial `taxonomy_terms_article_wrapper` is a wrapper for the partial
`taxonomy_terms_article` with the only parameter `context` (most of the time the
current page or context `.`) and checks the taxonomy parameters of your
project's `hugo.toml`/`hugo.yaml`/`hugo.json` to loop through all listed
taxonomies in the parameter `taxonomyPageHeader` resp. all defined taxonomies of
your page, if `taxonomyPageHeader` isn't set.

### `taxonomy_terms_cloud` {#taxonomy_terms_cloud}

The partial `taxonomy_terms_cloud` shows all used terms of a given taxonomy
(partial parameter `taxo`) for your site (partial parameter `context`, most of
the time the current page or context `.`) and with the parameter `title` as
headline.

Example usage in partial `taxonomy_terms_clouds` for showing all defined
taxonomies and its terms:

```go-html-template
{{ $context := . }}
{{ range $taxo, $taxo_map := .Site.Taxonomies }}
  {{ partial "taxonomy_terms_cloud.html" (dict "context" $context "taxo" $taxo "title" ( humanize $taxo ) ) }}
{{ end }}
```

This will give you the following HTML markup for the taxonomy `categories`:

```html
<div class="taxonomy taxonomy-terms-cloud taxo-categories">
  <h5 class="taxonomy-title">Cloud of Categories</h5>
  <ul class="taxonomy-terms">
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-1/"
        data-taxonomy-term="category-1"
        ><span class="taxonomy-label">category 1</span
        ><span class="taxonomy-count">3</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-2/"
        data-taxonomy-term="category-2"
        ><span class="taxonomy-label">category 2</span
        ><span class="taxonomy-count">1</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-3/"
        data-taxonomy-term="category-3"
        ><span class="taxonomy-label">category 3</span
        ><span class="taxonomy-count">2</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-4/"
        data-taxonomy-term="category-4"
        ><span class="taxonomy-label">category 4</span
        ><span class="taxonomy-count">6</span></a
      >
    </li>
  </ul>
</div>
```

### `taxonomy_terms_clouds` {#taxonomy_terms_clouds}

The partial `taxonomy_terms_clouds` is a wrapper for the partial
`taxonomy_terms_cloud` with the only parameter `context` (most of the time the
current page or context `.`) and checks the taxonomy parameters of your
project's config to loop through all listed taxonomies in the parameter
`taxonomyCloud` resp. all defined taxonomies of your page, if `taxonomyCloud`
isn't set.

## Multilingual taxonomy support {#multi-language-support-for-taxonomies}

For [multilingual sites][], taxonomy terms get counted and linked _within_ the
language site only. Taxonomy config parameters can be adjusted per language.

[configuration file]:
  https://gohugo.io/configuration/introduction/#configuration-file
[enabled by default]:
  https://gohugo.io/content-management/taxonomies/#default-destinations
[multilingual sites]:
  https://gohugo.io/configuration/params/#multilingual-projects
[taxonomies]: https://gohugo.io/content-management/taxonomies/
