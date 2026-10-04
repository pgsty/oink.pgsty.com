# OINK Documentation

> Build a technical content site with shared navigation, multilingual support and search for documentation, blogs, books and API references.

---

LLMS index: [llms.txt](/llms.txt)

---

New to OINK? [Start with the Starter](/docs/start/) to preview a working site,
then replace its sample content. Write in Markdown and build with Hugo Extended;
Hugo Modules also require Go to resolve the theme. Bundled theme assets need no
CDN or npm build step.

The current release is v1.1.0. See the
[1.1 release notes](/blog/release/1.1.0/) or the
[upgrade guide](/docs/admin/upgrade/#from-1-0) for an existing site.

> [!NOTE] 1.2.0 working documentation
> These guides include the current local 1.2.0 changes. The theme release is
> still pending; the site dependency remains pinned to v1.1.0.
> Review the [1.2 upgrade checklist](/docs/admin/upgrade/#preparing-1-2) for the
> affected behavior and the [CLI draft](/docs/cli/) for the separate optional tool.

## Five ways in {#five-entries}

- [Get started](/docs/start/) — create an OINK Starter repository, establish a local baseline, customize it in layers, deploy.
- [Components](/docs/components/) — one page per component, source first and rendered result after it.
- [Write Beautiful Docs](/book/) — a tutorial in progress; the first three chapters cover preview, structure and page composition.
- [Case studies](/case/) — production sites explained as reusable design and migration patterns.
- [Design and development](/docs/design/) — contracts, accepted decisions, research evidence, and active proposals for OINK maintainers.
  {.cards}

## Find it by task {#where-to-go}

| What you want to do                                   | Where to go                                    |
| ----------------------------------------------------- | ---------------------------------------------- |
| Decide whether it fits                                | [What is OINK](/docs/about/)                   |
| Install and preview                                   | [Get started](/docs/start/)                    |
| Write a documentation page                            | [Writing pages](/docs/write/pages/)            |
| Turn a directory tree into a sidebar                  | [Organizing content](/docs/write/organize/)    |
| Look up a component's syntax                          | [Components](/docs/components/)                |
| Change the name, logo, colours and fonts              | [Brand and appearance](/docs/customize/brand/) |
| Look up a configuration key's default                 | [Configuration](/docs/customize/config/)       |
| Run a bilingual or multilingual site                  | [Languages](/docs/customize/i18n/)             |
| Practice building and writing                                 | [Write Beautiful Docs](/book/)                 |
| Study a production implementation                     | [Case studies](/case/)                         |
| Deploy                                                | [Deploy](/docs/admin/deploy/)                  |
| Upgrade, or migrate from Docsy                        | [Upgrade](/docs/admin/upgrade/)                |
| Maintain the theme, review a contract, or write a PRD | [Design and development](/docs/design/)        |

The seven Docs sections are ordered the way they are read: understand, install,
write content, look up components, adjust the site, run the release, then study
or maintain the contracts and design records behind it.

---

Section pages:

- [What is OINK](/docs/about/): A local-first Hugo documentation framework evolved from Docsy. Its components stay readable in Markdown, its assets ship with the theme, and fifteen production sites exercise it.
- [Get started](/docs/start/): Start from the official OINK Starter, establish a working local baseline, then customize content, language, brand, integrations, and deployment in that order.
- [Authoring](/docs/write/): Writing documentation pages, blog posts, books, release pages and API references — what a page looks like, and how content is organized.
- [Components](/docs/components/): Every component available for writing, one page each, examples from the simplest upwards, with the parameter table at the end.
- [Customization](/docs/customize/): Site-level configuration — brand, navigation, layout, search, languages, versions, print and agent output.
- [Operations](/docs/admin/): Running the site from a laptop to production — local preview, deployment, comments, analytics and SEO, upgrades and troubleshooting.
- [Design and development](/docs/design/): OINK maintainer contracts, accepted decisions, dated research, and proposals in one canonical bilingual section.
- [OINK CLI](/docs/cli/): A draft introduction to the optional OINK command-line companion for Hugo sites.
