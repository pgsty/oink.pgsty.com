# Contributing to OINK

Corrections, translations, reproducible bug reports, and focused pull requests
are welcome. The [bilingual contribution guide](https://oink.pgsty.com/docs/about/contributing/)
explains the workflow; [acknowledgements](https://oink.pgsty.com/docs/about/license/#community-contributors)
link recent contributions to their authors.

## Choose the repository

| Change | Repository |
| --- | --- |
| Theme templates, styles, runtimes, defaults, or focused checkers | [pgsty/oink](https://github.com/pgsty/oink) |
| Documentation, translations, examples, integration or browser tests | [pgsty/oink.pgsty.com](https://github.com/pgsty/oink.pgsty.com) |
| Optional CLI commands and native checks | [pgsty/oink-cli](https://github.com/pgsty/oink-cli) |

OINK CLI has a separate version and release cycle. Ordinary Hugo users do not
need it.

## Build and review

Use OINK **v1.4.0**, Hugo Extended **0.168.0**, and Go **1.27.3** (the module's
minimum Go version). Hugo's built-in LibSass compiles theme and project SCSS
without an external Sass compiler. Do not enable `--panicOnWarning` or
`HUGO_PANICONWARNING`; keep diagnostics visible and review them (the upstream
LibSass deprecation warning is expected).

Read `AGENTS.md`, `TRANSLATION.md`, and the relevant bilingual contract under
`content/docs/design/`. Clone the theme and site as siblings for theme work.
Install Node >= 24 and npm >= 11.16.0 only when running this repository's tests.

```sh
npm ci
make check
make browser
```

Run the smallest owning check first. `make check` runs the non-browser site
suite against `../oink`; use `make browser` for changed rendering or interaction.
Review affected English and Chinese pages on desktop and mobile, in light and
dark mode. Record the commands, actual tool versions, and scope checked.

For the published theme pin, disable inherited replacements and both workspaces:

```sh
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  npm run test:release-pin
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  hugo --environment production --minify --printPathWarnings
```

## Submit a focused pull request

Include the problem, reproduction, final behavior, and relevant validation.
Update English and Chinese peers together, preserve stable heading IDs, and
keep current instructions separate from historical release evidence.
Public theme behavior changes need the implementation, owning checker, and
both language versions of the affected Design contract.

Preserve unrelated edits in shared checkouts. Commit source and reviewed test
expectations; keep generated output, caches, binaries, and filesystem module
replacements out of Git. Follow this site's Apache-2.0 / CC BY 4.0 split and keep
third-party notices, as described in [License and acknowledgements](https://oink.pgsty.com/docs/about/license/).
