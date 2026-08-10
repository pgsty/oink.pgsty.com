---
downstream_modified: true
title: CI/CD
---

## Agent-support checks

The site has an [AFDocs][] configuration and npm script to generate a scorecard
locally:

- Config: [agent-docs.config.yml][]
- Script: `_check:afdocs` in [package.json][]

To generate a fresh scorecard, run each of these commands in separate terminals:

```sh
npm run serve             # From one terminal
npm run check:afdocs:dev  # From another terminal
```

The latter command saves the generated scorecard to
`docs/advanced/agent-support/afdocs-scorecard.txt` under `content`, which will
be included in [Scorecard examples][] on the next build.

Note that the scorecard generation is not run as a part of the full CI/CD
pipeline. It needs to be run manually.

Read more: [AFDocs config file format][afdocs-config].

[AFDocs]: https://afdocs.dev/
[afdocs-config]: https://afdocs.dev/reference/config-file
[agent-docs.config.yml]:
  https://github.com/pgsty/oink.pgsty.com/blob/main/agent-docs.config.yml

## Prettier formatting

We use [Prettier](https://prettier.io) to format the project-site files using
the following command:

```sh
npm run check:format
```

To fix formatting, run:

```sh
npm run fix:format
```

### Workaround for `i18n` files

The translation files in the `i18n` directory are formatted using Prettier. But
Prettier removes the blank line before the `# Feedback` section heading. This
seems to be a known issue, for example see:

- [Bug: Inconsistent newline formatting in YAML when changing scopes
  #15528][#15528]
- [Bug: New Line before comments at end of YAML files are removed
  #15720][#15720]

We've worked around this bug, and avoided using `prettier-ignore` directives, by
formatting the preceding entry in the YAML file to be a block scalar, like this:

```yaml
community_guideline: >-
  Contribution Guidelines
```

This ensures that the blank line is preserved. Hopefully Prettier will be fixed
and we'll be able to remove this hack.

[#15528]: https://github.com/prettier/prettier/issues/15528
[#15720]: https://github.com/prettier/prettier/issues/15720
[package.json]: https://github.com/pgsty/oink.pgsty.com/blob/main/package.json
[Scorecard examples]: /docs/advanced/agent-support/#scorecard-examples
