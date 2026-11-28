---
title: Contributing to OINK
linkTitle: Contributing
description: Report a problem or send a fix to the repository that owns it, with the checks a theme or documentation change needs before review.
weight: 40
icon: fa-solid fa-code-pull-request
search_keywords: [contributing, contributors, pull request, bug report, translation, OINK 1.8.0]
---

Bug reports, corrections, translations and focused pull requests are all
welcome. Three repositories share the work, so start by finding the one that
owns the behavior you want to change.

## Where to contribute {#where-to-contribute}

- [pgsty/oink](https://github.com/pgsty/oink) — Templates, styles, browser runtimes, defaults, and focused theme checkers.
- [pgsty/oink.pgsty.com](https://github.com/pgsty/oink.pgsty.com) — Documentation, translations, examples, integration tests, and browser regression coverage.
- [pgsty/oink-cli](https://github.com/pgsty/oink-cli) — Optional CLI commands and native site checks.
{.cards .td-cards-list}

Report a problem in the repository that owns the affected behavior. The CLI
has its own version and release cycle, and ordinary Hugo sites do not need it.

## Report a reproducible problem {#report-a-problem}

A report that someone else can reproduce gets fixed fastest, so first check
that the problem still occurs on the [latest release](/release/). Then include
the OINK version, the output of `hugo version`, the relevant configuration and
a minimal content example.
For a display problem, add the page, the viewport width, the browser, the
visual preset and whether light or dark mode was on, and say what you expected
and what happened instead. Remove credentials and private content from the
report and any reproduction.

## Build and check {#build-and-check}

Theme work needs the theme and this site cloned side by side, because the
site's checks build against the sibling theme checkout:

```text
~/src/
├── oink/
└── oink.pgsty.com/
```

Use Hugo (tested on `0.170+`) and Go for Hugo Modules; the theme declares no
minimum Hugo release, and its CI tests against `latest` without maintaining
older-Hugo compatibility jobs. The site's
regression tests also need Node.js 26.13.0 and npm 12.2.2 or newer, although
no theme or site build uses them. Before you start, read each repository's
`AGENTS.md`, this site's `WRITING.md` and `TRANSLATION.md`, and the
[Design](/docs/design/) contract for the area you are changing.

The theme's stylesheet is plain CSS: edit the layer files under
`assets/css/td/`, which Hugo concatenates. Editing a layer is the whole
change, with no build step and no generated file to commit, and
`python3 bin/check-stylesheets.py` checks the layers and how they are
assembled.

Run the theme checker that covers your change first; the theme's `AGENTS.md`
lists them. Then run the site suites from this repository:

```sh
npm ci
make check
make browser
```

`make check` runs the non-browser suite against the sibling theme, and
`make browser` runs the browser suite, which you need whenever rendering or
interaction changed. Finally, look at the affected English and Chinese pages
at desktop and mobile widths, in light and dark mode. The
[repository README](https://github.com/pgsty/oink.pgsty.com#local-development)
explains how to build against the published theme release instead of your
sibling checkout.

Do not add `--panicOnWarning` or `HUGO_PANICONWARNING` to a build or CI job.
OINK reports invalid input as a warning and keeps building with a safe
fallback, and its tests trigger those warnings on purpose, so the flag would
fail the build.

## Prepare a pull request {#prepare-a-pull-request}

Keep a pull request to one change, and describe the problem, the resulting
behavior and how you validated it. Update English and Chinese pages together
and keep their heading IDs, because other pages and the theme's warnings link
to them. A change to public theme behavior ships with its implementation, the
checker that covers it, and both language versions of the affected Design
contract; new design proposals go in the bilingual
[Design proposals](/docs/design/proposals/) section.

Commit only source and reviewed test expectations. Generated output, caches,
binaries and filesystem module replacements stay out of Git, and in a shared
worktree, other people's unrelated changes stay as they are. Leave historical
release notes and dated research as written, because they record the evidence
of their time.

## Credit and licences {#credit-and-licenses}

The [acknowledgements](/docs/about/license/#community-contributors) credit
each community fix to its author and pull request. Theme code and site tooling
are licensed under Apache-2.0 and original documentation under CC BY 4.0; keep
third-party license and notice files intact. See
[License and acknowledgements](/docs/about/license/) for the full scope.
