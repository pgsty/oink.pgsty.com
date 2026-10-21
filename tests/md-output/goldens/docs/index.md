# OINK Documentation

> Build a technical content site. Use shared navigation, multilingual support, and search for documentation, blogs, books, and API references.

---

LLMS index: [llms.txt](/llms.txt)

---

For a new OINK site, [Start with the Starter](/docs/start/). Preview the working site,
then replace its sample content. Write in Markdown and build with Hugo Extended
with its built-in Sass compiler. Hugo Modules also require Go to resolve the theme. Bundled theme assets require
no CDN or npm build step.

The current release is v1.3.2. See the
[1.3.2 release notes](/blog/release/1.3.2/) or the
[upgrade guide](/docs/admin/upgrade/#preparing-1-3) for an existing site.

## Five ways in {#five-entries}

- [Get started](/docs/start/) — Create an OINK Starter repository. Verify the local site, customize one part at a time, then deploy it.
- [Components](/docs/components/) — Each component has one page. The source appears first, followed by the rendered result.
- [Write Beautiful Docs](/book/) — This tutorial is in progress. The first three chapters cover preview, structure, and page composition.
- [Case studies](/case/) — Learn reusable design and migration patterns from production sites.
- [Design and development](/docs/design/) — Read contracts, accepted decisions, research evidence, and active proposals for OINK maintainers.
  {.cards}

## Find it by task {#where-to-go}

| What you want to do                                   | Where to go                                    |
| ----------------------------------------------------- | ---------------------------------------------- |
| Decide whether it fits                                | [What is OINK](/docs/about/)                   |
| Install and preview                                   | [Get started](/docs/start/)                    |
| Write a documentation page                            | [Writing pages](/docs/write/pages/)            |
| Turn a directory tree into a sidebar                  | [Organizing content](/docs/write/organize/)    |
| Look up a component's syntax                          | [Components](/docs/components/)                |
| Change the name, logo, colors, and fonts              | [Brand and appearance](/docs/customize/brand/) |
| Look up a configuration key's default                 | [Configuration](/docs/customize/config/)       |
| Run a bilingual or multilingual site                  | [Languages](/docs/customize/i18n/)             |
| Practice building and writing                                 | [Write Beautiful Docs](/book/)                 |
| Study a production implementation                     | [Case studies](/case/)                         |
| Deploy                                                | [Deploy](/docs/admin/deploy/)                  |
| Upgrade, or migrate from Docsy                        | [Upgrade](/docs/admin/upgrade/)                |
| Maintain the theme, review a contract, or write a PRD | [Design and development](/docs/design/)        |

The seven Docs sections follow the reading sequence. First understand and
install OINK. Then write content, find components, adjust the site, and release
it. Finally, study or maintain its contracts and design records.

---

Section pages:

- [What is OINK](/docs/about/): A local-first Hugo documentation framework that evolved from Docsy. Its components remain readable in Markdown. The theme includes its assets. Fifteen production sites use it.
- [Get started](/docs/start/): Start from the official OINK Starter. Verify the local site, then customize content, language, brand, integrations, and deployment in that order.
- [Authoring](/docs/write/): Write documentation pages, blog posts, books, release pages, and API references. Learn the page structure and content organization.
- [Components](/docs/components/): Find each writing component, from simple examples to detailed examples, with its output matrix, parameters, and limits.
- [Customization](/docs/customize/): Configure the site brand, navigation, layout, search, languages, versions, print output, and agent output.
- [Operations](/docs/admin/): Preview, deploy, and maintain a site. Configure comments, analytics, and SEO. Upgrade the theme and diagnose problems.
- [Design and development](/docs/design/): OINK's contracts, accepted decisions, dated research, and active proposals in one bilingual section.
- [OINK CLI](/docs/cli/): An introduction to the optional OINK command-line companion for Hugo sites. The CLI is still a draft.
