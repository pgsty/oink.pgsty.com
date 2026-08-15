---
downstream_modified: true
title: Analytics, user feedback, and SEO
weight: 50
description: Configure analytics, feedback, and search metadata.
aliases: [/docs/content/feedback/, /docs/feature/analytics/]
cSpell:ignore: fabform pageviews
---

OINK does not contact analytics, form, comment, or advertising services by
default. These integrations are site decisions: enable them explicitly, document
the data boundary, and provide any consent or policy required by the site's
users and jurisdiction.

## Adding analytics

Hugo provides embedded templates for analytics services. When a site configures
Google Analytics, browser usage information such as page views and custom events
is sent to Google. This is incompatible with a fully air-gapped runtime and may
be incompatible with a strict same-origin Content Security Policy.

### Setup

Obtain a Google Analytics measurement ID for the site, then use Hugo's current
service configuration:

```yaml
services:
  googleAnalytics:
    id: G-YOUR-ID
```

Do not also set the deprecated top-level `googleAnalytics` key. Analytics are
normally emitted only for a `production` Hugo environment. Build a production
preview and inspect its HTML and browser network log before publication.

If analytics is disabled, OINK emits no Google Analytics request. Remove the
configuration entirely rather than inserting a fake identifier.

## User feedback

OINK can show a compact “Was this page helpful?” prompt. Choosing **Solved** or
**Not solved** records the structured choice immediately. A negative choice can
then be refined with one optional reason: missing information, outdated content,
failed steps, or unclear writing.

The component sends no free text and makes no feedback network request. It
remembers the choice in local storage so the reader can see or change it on a
later visit. When Google Analytics is available, the same fixed values are also
reported as events; without Analytics, the local interaction still works.

[Giscus](https://giscus.app/) remains a separate Comments component. When it is
active on the page, Feedback offers a link to the comment section for details.
OINK does not post into the Giscus iframe or create a GitHub identity on the
reader's behalf.

### How feedback data is useful

Combine feedback with context instead of treating one score as proof. Pages with
high traffic and repeated negative feedback are useful review candidates; highly
rated pages can reveal patterns worth testing elsewhere.

Make focused editorial changes when possible. For example, update one stale
tutorial, or move a code example earlier on a small group of pages, then compare
feedback over an appropriate period. Record releases, traffic shifts, support
events, and other factors that could explain the change.

Feedback is directional evidence, not a substitute for user research,
accessibility review, support data, or technical validation.

### Setup {#user-feedback-setup}

OINK keeps Feedback off by default. Enable it globally and decide whether a
negative response should offer reason chips:

```yaml
params:
  ui:
    feedback:
      enable: true
      reasons: true
```

To enable Feedback only for one section, use a cascade. Page values override the
site default:

```yaml
---
title: Documentation
cascade:
  feedback: true
---
```

Set `reasons: false` globally, or use a page-level map, when only the two
primary choices should be shown:

```yaml
---
title: Short reference
feedback:
  enable: true
  reasons: false
---
```

Legacy prototype fields such as `yes`, `no`, `max_value`, `endpoint`, and
`max_length` are no longer used and should be removed.

### Analytics event

When a global `gtag` function exists, the primary choice emits:

```text
docs_feedback { result, page_path, language }
```

`result` is either `solved` or `not_solved`. Selecting an optional reason emits
a second `docs_feedback` event containing `reason` and `refinement: true`.
Analytics failures never block the UI or local persistence.

Inspect `docs_feedback` in the analytics provider's event report and build a
page-level report if needed. An absent event may mean that no interaction
occurred, Analytics was disabled or blocked, consent was not given, or the
selected time range is wrong.

### Override feedback on one page {#disable-feedback-on-one-page}

Set `feedback` in page front matter. The page value overrides the global default
in either direction:

```yaml
---
title: Feedback example
feedback: true
---
```

Use `feedback: false` to hide the widget on a page when the global default is
enabled. For compatibility, `hide_feedback: true` also hides it when `feedback`
is not set.

### Set the default for all pages {#disable-feedback-on-all-pages}

Set the site parameter. OINK defaults it to `false`:

```yaml
params:
  ui:
    feedback:
      enable: false
```

## Add a contact form with Fabform

Fabform and similar hosted form endpoints are optional online services. After
creating an account and reviewing its data handling, a site can post a form to
its assigned endpoint:

```html
<form action="https://fabform.io/f/{form-id}" method="post">
  <label for="email">Your email</label>
  <input id="email" name="email" type="email" autocomplete="email" />
  <button type="submit">Submit</button>
</form>
```

Replace `{form-id}`, translate the visible labels, add a privacy notice, and
provide error and success states. The form will not work offline. A local or
first-party endpoint is preferable when the site must keep submissions within
its own boundary.

## Search engine optimization metadata

For each page, OINK chooses the HTML meta description from the first available
value:

1. the page's `description` front matter field;
2. Hugo's computed page summary for non-index pages;
3. the site description in `params`.

Write a concise, page-specific description in every language. Do not copy the
English description into a Chinese page. Search metadata cannot compensate for
thin, duplicated, or inaccurate content.

The theme also emits canonical and alternate-language links from Hugo's page
translations. Use a correct production `baseURL`, stable translated routes, and
explicit translated heading IDs. Add other meta tags through the site's
`layouts/_partials/hooks/head-end.html` override only when they are not already
provided by the theme.

See Hugo's [Google Analytics configuration][], [page summaries][], and Google's
[SEO starter guide][] for the underlying service and content concepts.

[Google Analytics configuration]:
  https://gohugo.io/templates/embedded/#configuration-google-analytics
[page summaries]: https://gohugo.io/content-management/summaries/
[SEO starter guide]:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
