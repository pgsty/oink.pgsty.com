---
title: Contributing to OINK
linkTitle: Contributing
description: Where to report bugs and contribute theme changes, documentation, translations, and regression tests for OINK 1.6.0.
weight: 40
icon: fa-solid fa-code-pull-request
search_keywords: [contributing, contributors, pull request, bug report, translation, OINK 1.6.0]
---

Corrections, translations, bug reports, and focused pull requests are welcome.
OINK **v1.6.0** is the current theme release. Its
[release notes](/release/1.6.0/) describe the plain CSS stylesheet,
Bootstrap JS and Lunr removal, scanning BM25 search, and runtime upgrades.

## Where to contribute {#where-to-contribute}

| Change | Repository |
| --- | --- |
| Templates, styles, browser runtimes, defaults, and focused theme checkers | [pgsty/oink](https://github.com/pgsty/oink) |
| Documentation, translations, examples, integration tests, and browser regression coverage | [pgsty/oink.pgsty.com](https://github.com/pgsty/oink.pgsty.com) |
| Optional CLI commands and native site checks | [pgsty/oink-cli](https://github.com/pgsty/oink-cli) |

The CLI has its own version and release cycle. Ordinary Hugo consumers do not
need it. Report a problem in the repository that owns the affected behavior.

## Report a reproducible problem {#report-a-problem}

Include the OINK version, `hugo version`, Go version for module builds, relevant
configuration, and a minimal content example. For display problems, include the
page, viewport width, browser, visual preset, and light/dark setting. Describe
what you expected and what happened. Remove credentials and private content
from reports and reproductions.

## Build and check {#build-and-check}

Development for **OINK v1.6.0** uses the Hugo that is installed, **0.169.0**
at the oldest and in any edition, and **Go 1.27.4** (the module's minimum Go
version). Older releases up to v1.5.1 retain their original requirements,
including Hugo's Extended edition. Starting in v1.6.0, the theme contains no
Sass: its stylesheet is the plain CSS layer files under
`assets/css/td/`, which Hugo concatenates. A site build needs no compiler,
Node.js or npm. Editing a layer is the whole change: there is no build step and
no generated file to commit. `python3 bin/check-stylesheets.py` checks the
layers and their assembly.

Never enable `--panicOnWarning` or `HUGO_PANICONWARNING`. Keep warnings visible
and review them. The theme pins no Hugo release: its checks use the installed
one and its CI installs the current release, without a legacy-version matrix.

For theme work, clone the theme and this site as siblings. Read each
repository's `AGENTS.md`, this site's `TRANSLATION.md`, and the relevant
[Design contract](/docs/design/). This site's regression tests need Node >= 26.13.0
and npm >= 12.2.2:

```sh
npm ci
make check
make browser
```

Run the smallest owning checker first. `make check` runs the non-browser suite
against the sibling theme; use `make browser` for changed rendering or
interaction. Review affected English and Chinese pages at desktop and mobile
widths in light and dark mode. The
[repository README](https://github.com/pgsty/oink.pgsty.com#local-development)
also explains how to verify the published pin separately.

## Prepare a pull request {#prepare-a-pull-request}

Keep the change focused and describe the problem, resulting behavior, and
validation. Update English and Chinese peers together and preserve stable
heading IDs. Public theme changes need the implementation, owning checker,
and both language versions of the affected contract. New design proposals
belong in the bilingual [Design proposals](/docs/design/proposals/) section.

Preserve unrelated changes in shared worktrees. Commit source and reviewed test
expectations; keep generated output, caches, binaries, and filesystem module
replacements out of Git. Keep historical release notes and dated research
faithful to their original evidence.

## Credit and licences {#credit-and-licenses}

The [acknowledgements](/docs/about/license/#community-contributors) link
community fixes to their authors and pull requests. The
[1.3.1 notes](/release/1.3.1/#thanks) record the reading repairs;
1.6.0 keeps those fixes and eliminates the Sass compiler dependency entirely.

Theme code and site tooling use Apache-2.0; original documentation uses
CC BY 4.0. Retain third-party licence and notice files. See
[License and acknowledgements](/docs/about/license/) for the full scope.
