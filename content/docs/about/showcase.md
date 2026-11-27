---
title: Case Guide
linkTitle: Cases
description: Find the OINK production case closest to your documentation, book, blog, catalog, or community site.
weight: 20
search_keywords: [case guide, showcase, examples, production sites, community sites, Apache HugeGraph, Pigsty, who uses OINK]
aliases:
  - /docs/about/examples/
---

The quickest way to design an OINK site is to find a live one shaped like
yours and see how it was built. The [case library](/case/) documents 45 of
them: 14 independent community sites and 31 from the PGSTY and Vonng
ecosystem, this documentation site included. Each case links to the live site
(and to its source repository where that is public), explains the design and
its trade-offs, and separates the code the site wrote itself from what the
theme provides. Read
the case for the architecture, then follow its links to the guides for exact
configuration. Page counts and similar figures come from the snapshot taken
when the case was written.

## Choosing a starting point {#choosing-a-starting-point}

- A branded open-source project: look at
  [Apache HugeGraph](/case/apache-hugegraph/), [Stashix](/case/stashix/) or
  [Barn](/case/barn/).
- A conventional product manual: start with [PIG](/case/pig/),
  [SOW](/case/sow/) or [AGW](/case/agw/).
- A large multilingual or migrated corpus: compare
  [PG.CENTER](/case/doc-pg-center/), [SILO](/case/silo/) and
  [Red Hat CAI](/case/redhat-cai/).
- A book or course library: compare [TPME](/case/tpme/),
  [SSG Book](/case/ssg-book/) and [DDIA](/case/ddia/), or see
  [PG Internal](/case/pg-internal/) for a single-language edition.
- A personal blog or digital garden: compare [VONNG](/case/vonng-com/),
  [Nekonull's Garden](/case/nekonull/) and [blog.xjkj.org](/case/xjkj-blog/).
- A standard, an archive or a queryable dataset: look at
  [Cloud Exit](/case/cloudexit/), [Feng Zhenbiao Archive](/case/fzb/) or
  [ext.pgsty.com](/case/pgext-cloud/).
- A landing page or an interactive tool: start with
  [pgsty.com](/case/pgsty-com/), [CASSA](/case/cassa/) or
  [Capslock](/case/capslock/).
- The broadest reference of all: [OINK Docs](/case/oink/).

Start the site itself from the [Starter](/docs/start/), not from the theme
repository's `tests/site/`: that folder is a test fixture whose pages exist to
exercise rendering edge cases, not a design to copy.

## Third-party and community sites {#community-sites}

### [Apache HugeGraph](/case/apache-hugegraph/) {#apache-hugegraph}

This Apache Software Foundation full-stack graph database platform applies a
custom brand hero on OINK Slate across nearly 300 bilingual English and Chinese
documentation pages.

### [Red Hat AI Services (CAI)](/case/redhat-cai/) {#redhat-cai}

This Red Hat AI Services Business Unit team portal configures nine languages on
OINK Paper and pairs with companion OpenShift AI field manuals.

### [Stashix](/case/stashix/) {#stashix}

This self-hosted comic and manga library website uses OINK's high-contrast Ink
preset with a custom violet accent, announcement bar, and dark product preview.

### [SSG Book](/case/ssg-book/) {#ssg-book}

*Static Site Generators in the Age of AI* uses OINK's dark-mode Book shell,
lecture slides, learning paths, and playground under a clean subpath deployment.

### [CASSA](/case/cassa/) {#cassa}

This Australian university student association site uses OINK's centered landing
hero for membership onboarding, timelines, club news, and merchandise.

### [AGW](/case/agw/) {#agw}

This self-hosted AI Agent Workspace and Gateway keeps its centered product site
and 88 bilingual documentation pages inside the `site/` directory of its main
application repository.

### [Nekonull's Garden](/case/nekonull/) {#nekonull}

This bilingual personal engineering blog and digital garden organizes 144
long-form essays, short shares, and TIL notes behind a typography-led landing
page.

### [Sanbei's Blog](/case/sanbei-blog/) {#sanbei-blog}

This popular Go engineering and AI coding blog pairs dated essays with a
structured AI playbook section on OINK Paper.

### [Homelab IaC](/case/homelab-iac/) {#homelab-iac}

This Proxmox cluster Terraform and Ansible operations manual co-locates docs
with infrastructure code and publishes HTML, Markdown, and `llms.txt` together.

### [System Design Notes](/case/system-design-notes/) {#system-design-notes}

This 28-chapter Chinese study guide mounts numbered chapters directly into
OINK's Book reading shell with local Chinese search.

### [hongyu](/case/hongyu-docs/) {#hongyu-docs}

This bilingual personal writing hub combines essays, a data systems knowledge
base, and book and film reviews inside one OINK shell.

### [blog.xjkj.org](/case/xjkj-blog/) {#xjkj-blog}

This Chinese Oracle database and homelab blog skips a marketing hero and uses
OINK's three-column card-grid blog shell directly as its entry experience.

### [Vianlex's Wiki](/case/vianlex-wiki/) {#vianlex-wiki}

This 150-page personal software engineering knowledge base uses landing cards
to route readers straight into deep backend documentation trees.

### [Le Shi Handbook](/case/le-shi/) {#le-shi}

This living personal systems manual records verified Linux Mint and Windows 11
configurations and recovery steps in a focused Chinese docs tree.

## Distribution documentation {#pigsty-sites}

### [pigsty.io](/case/pigsty-io/) {#pigsty-io}

This very large English site combines a distribution manual, editorial blog,
extension catalog, taxonomies, version navigation, and pricing landing pages.

### [pigsty.cc](/case/pigsty-cc/) {#pigsty-cc}

This Chinese peer is deployed as an independent single-language site. This
approach is useful when each language corpus has become a separate product.

### [pgsty.pro](/case/pgsty-pro/) {#pgsty-pro}

This bilingual version archive renders many release pages from reusable,
structured release data.

### [PG.CENTER](/case/doc-pg-center/) {#doc-pg-center}

This eight-language PostgreSQL kernel and component documentation hub spans
nearly 5,000 Markdown files, exercising split BM25 search indexes and Arabic
RTL layout in one repository.

## Product documentation {#product-sites}

### [PIG](/case/pig/) {#pig-pgsty-com}

This compact bilingual CLI manual has a data-driven home page and a much larger
companion blog.

### [SOW](/case/sow/) {#sow-pgsty-com}

This bilingual operations manual has a dedicated download content type that uses
release metadata.

### [SILO](/case/silo/) {#silo-pgsty-com}

This large upstream migration uses a checked manifest to generate bilingual
documentation navigation.

### [PG Exporter](/case/pg-exporter/) {#exp-pgsty-com}

This metrics manual combines generated navigation, a structured catalog, and
system fonts.

### [Piglet](/case/piglet/) {#piglet-run}

This agentic Postgres runtime product site pairs an asymmetric dark terminal
hero with concise bilingual setup documentation.

### [Barn](/case/barn/) {#barn-pgsty-com}

This bilingual manual for local Linux labs and native macOS VMs combines warm
editorial hero artwork with terminal quick-start previews, docs, and a blog.

### [Vchord](/case/vchord/) {#vchord-pgsty-com}

This 366-page bilingual manual for PostgreSQL vector and BM25 search extensions
pairs technical architecture diagrams with benchmark comparisons and downloads.

### [Mooncake](/case/mooncake/) {#mooncake-pgsty-com}

This bilingual manual for PostgreSQL columnstore and Apache Iceberg lakehouse
tables shares a diagram-led product identity with sibling PGSTY extension sites.

### [Crib](/case/crib/) {#crib-pgsty-com}

This focused Chinese product site for a native macOS offline PostgreSQL docs
app pairs a centered Paper hero with a full-width dark app showcase.

### [Capslock App](/case/caps-pgsty/) {#caps-pgsty-com}

This bilingual native macOS utility site expands on the two-page configurator
with a centered hero, visual keymap diagram, docs, blog, and downloads.

## Books and training {#book-sites}

### [Designing Data-Intensive Applications](/case/ddia/) {#ddia-vonng-com}

This multilingual, multi-edition book is the strongest example of numbered
figures, cross-references, chapter navigation, and indexes.

### [The Product-Minded Engineer](/case/tpme/) {#tpme-vonng-com}

This focused bilingual publication needs only OINK's Book shell.

### [PG Internal](/case/pg-internal/) {#pgint-vonng-com}

This finished Chinese translation is deliberately published as a single-language
Book. It has no documentation tree or other language to select.

### [PG 36 Stratagems](/case/pg36g/) {#pg36g-vonng-com}

This 36-chapter bilingual PostgreSQL and Pigsty production engineering book
pairs custom 3D cover art with reproducible labs and multi-axis indexes.

### [Empire of AI](/case/aiempire/) {#aiempire-vonng-com}

This focused bilingual non-fiction book uses OINK's Paper preset, cover hero,
contributor cards, and whole-book print output.

### [PG 18 Internals](/case/int18-pgsql/) {#int18-pgsql-cc}

This trilingual Chinese, English, and Russian technical book demonstrates Book
navigation and Duo View comparison across three scripts.

### [Dalibo Training](/case/dalibo-pgsql/) {#dalibo-pgsql-cc}

This trilingual Chinese, French, and English training portal gathers twelve
open-licensed PostgreSQL course manuals under one shared shell.

### [PGPRO Training](/case/pgpro-pgsql/) {#pgpro-pgsql-cc}

This 441-page trilingual Chinese, English, and Russian course library embeds a
visual curriculum learning-path roadmap directly in the landing hero.

### [Postgres by Example](/case/pgexp-pgsql/) {#pgexp-pgsql-cc}

This 57-lesson bilingual tutorial book pairs syntax-highlighted SQL examples
with downloadable runnable script bundles.

## Blogs, standards, catalogs, and custom sites {#other-sites}

### [VONNG](/case/vonng-com/) {#vonng-com}

This 1,344-page bilingual personal technical blog organizes six long-running
editorial columns with per-column RSS feeds alongside books and project pages.

### [Cloud Exit](/case/cloudexit/) {#cloudexit-org}

This 690-page bilingual open standard, public cost ledger, and playbook uses a
centered editorial Paper hero to anchor six structured content sections.

### [Feng Zhenbiao Archive](/case/fzb/) {#fzb-vonng-com}

This 601-page personal biography, memoir, poetry collection, and Expo
photography archive shows OINK serving humanities and long-term archival
publishing.

### [PostgreSQL ecosystem library](/case/pgsql-cc/) {#pgsql-cc}

This aggregate operations library combines several upstream manuals and partially
translated language trees. They share one search and visual system.

### [pgsty.com](/case/pgsty-com/) {#pgsty-com}

This small bilingual corporate site shows how OINK can primarily serve as a
data-driven landing-page system.

### [Capslock](/case/capslock/) {#caps-vonng-com}

This project has two pages per language. Its custom shell hosts an interactive,
data-driven configuration generator.

### [oink.pgsty.com](/case/oink/) {#oink-pgsty-com}

This full reference site contains public documentation, live component examples,
design contracts, multiple content shells, and regression coverage in one repository.

### [pgext.cloud](/case/pgext-cloud/) {#pgext-cloud}

This PostgreSQL extension catalog uses a queryable dataset as its primary object.
It indexes 2,241 extensions and 576 packaged builds across 16 platforms.

→ [Browse all cases](/case/) · [Get started](/docs/start/) · [Starter repository tour](/docs/start/anatomy/)
