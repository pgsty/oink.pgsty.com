---
title: Get started
linkTitle: Get started
description: Clone the OINK docs site to run a full site locally in two minutes, then build your own personal or project site with an AI agent, from scratch, or inside a project's docs/ folder.
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords:
  [
    get started,
    quick start,
    AI agent,
    agent skill,
    prompt,
    clone,
    Hugo,
    hugo serve,
    install,
    personal site,
  ]
aliases:
  - /docs/start/starter/
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

The fastest way to understand OINK is to clone this documentation site and run
it on your machine. In two minutes you have a complete live site to click
through—with real Markdown source right beside it—and from there you can hand
one prompt to an AI coding agent to build your own site.

## Prerequisites {#tools}

You need Git, Go 1.27.4 or newer, and Hugo {{% param hugoMinVersion %}} or
newer in any edition. Go is required because Hugo fetches the theme as a Go
module; building an OINK site never needs Node.js, npm or a Sass compiler.

```console
$ go version
go version go1.27.4 darwin/arm64
$ hugo version
hugo v0.170.1+withdeploy darwin/arm64
```

On macOS, `brew install git go hugo` installs all three. On Linux and Windows,
follow the [Hugo installation guide](https://gohugo.io/installation/) and the
[Go downloads page](https://go.dev/dl/).

## Step 1: Clone the docs site and run it locally {#clone}

Instead of staring at an empty skeleton, clone `oink.pgsty.com` itself and
start Hugo's local server:

```bash {title="Terminal"}
git clone https://github.com/pgsty/oink.pgsty.com.git
cd oink.pgsty.com
hugo serve
```

The first run takes a moment while Hugo downloads the pinned OINK theme into
your local Go module cache; every subsequent start takes a second. Open
<http://localhost:1313/> to explore the live site:

- Click through **Docs**, **Book**, **Case** and **Blog**, and open the
  **Appearance** menu to switch between Paper, Slate, Ink and Terminal in both
  light and dark mode.
- Press {{< kbd "/" >}} to try local full-text search, and switch between
  English and Chinese from the top bar.
- Open any page under `content/docs/components/` in your editor, change a
  sentence, and save: the browser reloads automatically so you can see how
  Markdown maps to rendered components.

Because this repository doubles as OINK's integration test suite, treat it as a
live reference rather than a template to deploy. Once you know what you want,
create your own site in a fresh directory below.

## Step 2: Build your own site with an AI agent {#agent-skill}

Once Git, Go and Hugo work on your machine, the fastest way to build your own
site is to open a coding agent such as Claude Code or Codex in an empty folder
and give it a concrete prompt backed by the OINK site-building skill
(`oink-site`):

```bash {title="Terminal"}
mkdir my-site && cd my-site
claude   # or codex, or any coding agent that runs shell commands
```

Paste this prompt after replacing the `<angle brackets>` with your own details:

```text {title="Prompt: build a personal site with Hugo and OINK"}
Read https://oink.pgsty.com/skill.md and follow it to build my personal site
with Hugo and the OINK theme in this empty directory.

About me: <Your Name>, <one-line bio, e.g. backend engineer writing about
databases and distributed systems>.
Domain: <https://you.example.com>.
Languages: <English, or English and Simplified Chinese>.

Site structure:
- Home page assembled from OINK landing data: a concise hero introducing me,
  cards linking to my main sections, and links to GitHub / X.
- A Blog section with card-grid indexes, tags, RSS feed, and three realistic
  starter posts in my voice.
- A Notes section using the Docs shell for evergreen technical notes.
- An About page with my bio, current projects, and contact links.

Appearance and hygiene:
- Default to the Paper preset, enable dark mode, and offer Paper, Slate, Ink
  and Terminal in the Appearance menu.
- Enable local search, Markdown outputs, and llms.txt; include a .gitignore
  that excludes public/, resources/, .hugo_build.lock and .hugo_cache/.
- Pin the latest published OINK release in go.mod rather than tracking main.

When the production build passes with zero unexpected warnings, run hugo serve,
check the site in a browser on desktop and mobile widths, and tell me what
placeholders I should replace next.
```

The skill file (`https://oink.pgsty.com/skill.md`, or
`https://oink.pgsty.com/skill.zh.md` for Simplified Chinese) sends the agent to
these docs for current OINK syntax, warns it away from retired Docsy or older
OINK keys, and maps each kind of site to real examples in the
[case library](/case/).

To keep the skill installed across sessions instead of referencing its URL each
time, download it once and start a new agent session:

```bash {tab="Claude Code"}
mkdir -p ~/.claude/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.md -o ~/.claude/skills/oink-site/SKILL.md
```

```bash {tab="Codex"}
mkdir -p ~/.codex/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.md -o ~/.codex/skills/oink-site/SKILL.md
```

Download the file again whenever you want to refresh it; the header notes the
OINK release it targets. For more prompt patterns—open-source project sites,
CLI manuals and books—read [Build a site from one prompt](/book/01-start/).

## Choose your next guide {#choose}

From here, follow the guide that matches where your site lives today:

| Your situation | Read | What you learn |
| --- | --- | --- |
| You already have an OINK repository and want to read, edit, or follow an AI agent's output locally | [Browse locally](/docs/start/local/) | Run `hugo serve`, read live docs in the browser, edit with auto-reload, and monitor reports written by coding agents |
| You want to assemble a minimal standalone site file by file, or switch an existing Hugo site to OINK | [From scratch](/docs/start/from-scratch/) | Minimal project layout, `hugo.yml` prerequisites, first page, and offline / submodule install methods |
| You already have an open-source codebase and want a documentation site inside its `docs/` directory | [Add docs to a project](/docs/start/add-docs/) | Isolated `docs/` Hugo sub-project, `.gitignore` hygiene, and GitHub Pages + Cloudflare Pages auto-builds |
| You are upgrading an older OINK site or migrating from Docsy | [Upgrade](/docs/admin/upgrade/) | Version upgrades, syntax migration, and override review |
