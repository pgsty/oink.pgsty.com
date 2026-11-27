---
title: Publish, deploy and keep up to date
linkTitle: Ship
description: Choose what the site publishes for printers, feed readers and AI assistants, run the production build, deploy with the Starter's workflow, and upgrade OINK without surprises.
book_kind: chapter
book_number: 10
weight: 100
aliases:
  - /book/06-ship/
---

A site is finished when readers can reach it and it stays correct as OINK
moves on. The Starter already carries the build settings and the deployment
workflows, so this chapter is mostly about knowing what each one does: what the
build publishes besides HTML, how to deploy Acme DB's site, and how to take the
next OINK release.

## Publish more than HTML {#outputs}

Every page can be published in several forms at once. The Starter lists them
under `outputs` in `hugo.yaml`:

```yaml {title="hugo.yaml"}
outputs:
  home: [HTML, RSS, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| Output | Published at | Who it serves |
| --- | --- | --- |
| `HTML` | Every page | Readers in a browser |
| `markdown` | The page address plus `index.md` | AI assistants, and the Copy Markdown and View Markdown page actions |
| `LLMS` | `/llms.txt`, one per language | An agent finding out what the site contains |
| `print` | `/_print/` plus the section path | Readers printing or saving a whole section as a PDF |
| `RSS` | The section path plus `index.xml` | Feed readers |
| `LLMSFULL` | `/docs/llms-full.txt`, when the Docs root lists it | An agent reading the whole manual in one request |
| `NAVJSON` | `/navigation.json`, when the home page lists it | An agent planning which pages to read |
{#tbl-outputs num="10-1" caption="What the build can publish besides HTML."}

Each key replaces the whole list for that kind of page, so when you add a
format, keep the ones already there; a format left out simply stops being
published, without a warning. This site publishes all seven, so you can try
them here: press {{< kbd "M" >}} for this page's Markdown, or open
[`/llms.txt`](/llms.txt).

Two more page actions hand the page to an assistant: **Open in ChatGPT** and
**Open in Claude**. They send the page's address to that service, so they stay
off until you turn them on:

```yaml {title="hugo.yaml"}
params:
  ui:
    page_context_menu:
      assistant_links: true
```

## Build for production {#build}

Run the production build from [Chapter 2](/book/02-take-over/#review) before
every deployment that changes configuration. It is the same command the
Starter's workflows run, so a warning you see locally is a warning your host
would print. Then commit `hugo.yaml`, `go.mod` and `go.sum` with your content.
Never commit a local module replacement: the host would look for a theme path
that exists only on your machine.

## Deploy {#deploy}

The Starter ships two workflows in `.github/workflows/`. Pick the host and
follow its steps:

1. **GitHub Pages.** In the repository's **Settings → Pages**, set **Source**
   to **GitHub Actions**. Every push to `main` then builds the site and
   publishes it, with GitHub's Pages address, subpath included, passed in as
   `baseURL`.
1. **Cloudflare Pages.** Create a Pages project of the **Direct Upload** kind,
   then add the repository secrets `CLOUDFLARE_ACCOUNT_ID` and
   `CLOUDFLARE_API_TOKEN`. The workflow builds in GitHub Actions and uploads
   the result.
1. **Check the live site.** Open the address the workflow prints, switch
   languages, search, and open one page's `index.md`.
{.steps}

On your own domain, set `baseURL` to it in `hugo.yaml` first: canonical links,
feeds, `llms.txt` and social cards are all written with it.
[Deploy](/docs/admin/deploy/) covers other hosts, preview deployments that
search engines should not index, and rollback.

## Comments and analytics {#integrations}

Anything that would contact another service, comments through Giscus, Google
Analytics, a hosted search, stays off until it is configured completely. A
half-filled block keeps the feature off rather than falling back to a public
default, and analytics run only in production builds,
so previews are never tracked. [Comments](/docs/admin/comments/) and
[Analytics](/docs/admin/analytics/) list the keys.

## Upgrade OINK {#upgrade}

The site is pinned to one OINK release in `go.mod`, so it builds the same way
until you decide otherwise. To move to a new release, read its notes first,
then pin the exact tag:

```bash
hugo mod get github.com/pgsty/oink@v1.6.0
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

Pin a published tag, never a branch or `@latest`, so the same commit of your
site always builds the same site. Run the production build, read the warnings,
which name any setting the release renamed, look at a few pages in both
languages, and commit `go.mod` and `go.sum` together.
[Upgrade](/docs/admin/upgrade/) lists what changed in each release. If you
installed the OINK skill, download it again too: it names the release it was
written for.

## Know which stage you are at {#stages}

"It works" means different things at different stages. Say which one you
mean, in a pull request or to your agent:

| Stage | What it proves | What it does not |
| --- | --- | --- |
| Local preview | Pages render and edits show up | That the production build is clean |
| Production build | Content, configuration and the pinned release build together | That the host builds it the same way |
| Workflow passed | The host built and uploaded the site | That the live pages look right |
| Live site checked | Readers get the site you reviewed | Anything about the next change |
{#tbl-delivery-stages num="10-2" caption="Four stages from preview to a live site, and what each one leaves open."}

## Check your work {#checkpoint}

- The production build ends with `Total in …`, and you have read every warning above it.
- The live site serves both languages, search, `llms.txt` and a page's `index.md`.
- `go.mod` names an exact OINK tag, and `hugo mod graph` shows the same one.

## Ask your agent {#agent}

```text {num="10-1" caption="Prompt: prepare a release of the site." #eg-agent-ship}
Prepare this site for deployment. Check that hugo.yaml has the production
baseURL <https://docs.acme.example/>, that outputs keep HTML, markdown, LLMS,
print and RSS, and that go.mod pins an exact published OINK tag. Run the
production build and fix every warning. Do not push, deploy or change the
pinned release; list what you changed and which stage of
https://oink.pgsty.com/book/10-ship/#stages the site has reached.
```

## Where to go next {#next}

You have built every layer of an OINK site once. From here, the reference
answers the questions this book did not:

- [Components](/docs/components/) — One page per component, with every option and its output in print and Markdown.
- [Customization](/docs/customize/) — Navigation, search, languages, versions and print, setting by setting.
- [Case library](/case/) — Forty-odd production sites, each with what it demonstrates and how.
- [Get started](/docs/start/#agent-skill) — The OINK skill, to install for your agent.
{.cards}
