# Welcome to OINK

> Install, customize, deploy, and maintain Oink documentation sites.

---

LLMS index: [llms.txt](/llms.txt)

---

<!-- markdownlint-disable-next-line no-space-in-links -->

<span class="badge bg-primary text-bg-primary fs-6">v0.4.0
</span>

Welcome to the OINK user guide for version `v0.4.0`. This guide
covers the theme's Hugo-only build, local-first runtime, multilingual framework,
content components, customization, and deployment.

## What is OINK?

OINK is an independent theme for the [Hugo][] static site generator, designed
for medium and large technical documentation sets. It evolves [Docsy][]
directly: Docsy's mature content model and documentation features remain
available, while OINK provides a new canonical shell, local dependencies, and
reusable components drawn from production PGSTY sites.

A consuming site can build with Hugo Extended alone. It does not need Node.js,
npm, PostCSS, Autoprefixer, or a CDN. Bootstrap, Font Awesome, fonts, local
search, diagrams, API documentation runtimes, and content components ship with
the theme and are loaded only when a page needs them.

OINK includes:

- a responsive documentation and blog shell with navigation, table of contents,
  search, print output, dark mode, and accessible interactions;
- a general multilingual framework with translated-page routing, missing-page
  fallback, language weights, RTL support, and SEO alternate metadata;
- local Mermaid, KaTeX, Markmap, Swagger UI, Redoc, Asciinema, ECharts, and
  Infographic runtimes;
- reusable details, tabs, cards, navigation cards, and document carousels;
- scenario-level reading, release, Landing, and Book publishing workflows;
- a bilingual project site, static-host deployment guides, local theme assets,
  and an auditable vendor manifest.

OINK itself does **not** provide source hosting or deploy your generated site.
Keep your project in GitHub, GitLab, a private Git service, or a local
repository, then publish Hugo's static output with the platform of your choice.

## Is OINK for me?

OINK is most useful when a documentation project has many pages, several content
types, multiple languages, or strict reproducibility and network isolation
requirements. It is also a good fit when several sites should share a single
maintained shell instead of copying layouts, scripts, and shortcodes.

For a project with only one or two pages and no structured navigation, a README
or a smaller Hugo theme may be simpler. For a heavily application-driven portal,
use OINK for the documentation surface and keep business-specific components in
the site rather than forcing them into the theme.

## Ready to get started?

If this is your first time, start with [Get started](/docs/tutorial/) — seven
pages that end with a deployable bilingual site.

To go straight to something specific:

| What you want to do                    | Where                                  |
| -------------------------------------- | -------------------------------------- |
| Install and run it                     | [Get started](/docs/tutorial/)         |
| Configure menus, languages, versions   | [Site configuration](/docs/configure/) |
| Write pages and organize the tree      | [Authoring](/docs/content/)            |
| Look up a component                    | [Components](/docs/components/)        |
| Build a release, Landing page, or Book | [Scenarios](/docs/scenarios/)          |
| Change fonts and colors                | [Appearance](/docs/appearance/)        |
| Search, print, comments, AI support    | [Advanced](/docs/advanced/)            |
| Publish it                             | [Deployment](/docs/deploy/)            |
| Upgrade or migrate from Docsy          | [Upgrade](/docs/upgrade/)              |

[Docsy]: https://github.com/google/docsy
[Hugo]: https://gohugo.io/

---

Section pages:

- [Get started](/docs/tutorial/): Build a bilingual OINK documentation site from scratch and deploy it.
- [Site configuration](/docs/configure/): Navigation menus, languages, versions, and repository links.
- [Authoring](/docs/content/): How the content tree is organized, writing conventions, media, and taxonomies.
- [Components](/docs/components/): Every component available for writing, ordered by how often you reach for it.
- [Scenario components](/docs/scenarios/): Configure complete reading, release, landing-page, and Book publishing workflows from local content and data.
- [Appearance](/docs/appearance/): Typography presets, colors, and style overrides.
- [Advanced](/docs/advanced/): Keyboard navigation, search and the Command Palette, print output, AI support, comments, and analytics.
- [Deployment](/docs/deploy/): Build once, publish to any static host.
- [Upgrade and migrate](/docs/upgrade/): Upgrade the OINK version, or migrate from Docsy.
- [About Oink](/docs/about/): Understand Oink's examples, design principles, architecture, and open-source model.
