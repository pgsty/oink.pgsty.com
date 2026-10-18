---
title: Contributing to OINK
linkTitle: Contributing
description: Where to report bugs and contribute theme changes, documentation, translations, and regression tests for OINK 1.3.2.
weight: 40
icon: fa-solid fa-code-pull-request
search_keywords: [contributing, contributors, pull request, bug report, translation, OINK 1.3.2]
---

Corrections, translations, bug reports, and focused pull requests are welcome.
OINK **v1.3.2** is the current theme release. Its
[release notes](/blog/release/1.3.2/) describe the Hugo-only build and the reading
repairs contributed by the community.

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

The maintained baseline is **OINK v1.3.2**, **Hugo Extended 0.168.0**, and
**Go 1.27.2**; the module's Go minimum is 1.27.0. Hugo uses its built-in LibSass.
Ordinary site builds require no external Sass compiler, Node.js, or npm.

Never enable `--panicOnWarning` or `HUGO_PANICONWARNING`. Keep warnings visible
and review them; the upstream LibSass deprecation warning is accepted.
Development and CI use the pinned Hugo baseline, without a legacy-version matrix.

For theme work, clone the theme and this site as siblings. Read each
repository's `AGENTS.md`, this site's `TRANSLATION.md`, and the relevant
[Design contract](/docs/design/). This site's regression tests need Node >= 24
and npm >= 11.16.0:

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
[1.3.1 notes](/blog/release/1.3.1/#thanks) record the recent reading repairs;
1.3.2 keeps those fixes while removing the external Sass dependency.

Theme code and site tooling use Apache-2.0; original documentation uses
CC BY 4.0. Retain third-party licence and notice files. See
[License and acknowledgements](/docs/about/license/) for the full scope.
