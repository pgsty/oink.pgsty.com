# Get started

> Start from the official OINK Starter. Verify the local site, then customize content, language, brand, integrations, and deployment in that order.

---

LLMS index: [llms.txt](/llms.txt)

---

The fastest way to a working OINK site is the
[OINK Starter](https://github.com/pgsty/oink-starter), a GitHub template
repository. It pins the current OINK release, builds as soon as you clone it,
and already contains a three-language Docs, Blog and Book site with deployment
workflows. You begin by editing a site that works instead of assembling one
from parts.

## Choose a path {#choose}

| You have | Take this path | You end up with |
| --- | --- | --- |
| Nothing yet | [OINK Starter](/docs/start/starter/) | A small Docs, Blog and Book site in English, Chinese and French, with GitHub Pages and Cloudflare Pages workflows |
| A Hugo site with its own content | [From scratch](/docs/start/from-scratch/) | Your existing content rendered by OINK, after adding the module and three Goldmark settings |
| A Docsy site or an older OINK site | [Upgrade](/docs/admin/upgrade/) | The same content, with supported syntax migrated and your overrides reviewed |

## Five-minute baseline {#baseline}

1. ### Install the tools {#tools}

   You need Git, Go 1.27.4 or newer, and Hugo 0.169.0 or
   newer in any edition. Go is there because Hugo downloads the theme as a Go
   module; nothing in the build needs Node.js, npm or a Sass compiler.

   ```console
   $ go version
   go version go1.27.4 darwin/arm64
   $ hugo version
   hugo v0.169.0+extended+withdeploy darwin/arm64
   ```

   On macOS, `brew install git go hugo` installs all three. On Linux and
   Windows, follow the [Hugo installation guide](https://gohugo.io/installation/)
   and the [Go downloads page](https://go.dev/dl/).

1. ### Create the site {#clone}

   To keep what you build, open the
   [Starter](https://github.com/pgsty/oink-starter), choose
   **Use this template**, and clone the repository GitHub creates for you. To
   try it first, clone the original:

   ```bash
   git clone https://github.com/pgsty/oink-starter.git my-docs
   cd my-docs
   hugo server
   ```

   The first start takes longer while Hugo downloads the theme into its module
   cache.

1. ### Look around {#open}

   Open <http://localhost:1313/>. Before you change anything, click through
   Docs, Blog and Book, switch to Chinese (`/zh/`) and French (`/fr/`), try
   search, and toggle light and dark mode. Anything that misbehaves now was
   not caused by your edits, which makes it much easier to report or fix.

1. ### Make one visible change {#first-change}

   Change `title` and `baseURL` at the top of `hugo.yaml`, then edit a
   sentence in `data/home/en.yaml`. The browser reloads by itself. When both
   changes show up, your configuration, your content and the pinned theme are
   wired together.
{.steps}

## Make it yours {#learning-path}

Change one layer at a time and preview after each, so that when something
breaks you know which change did it.

- [Use OINK Starter](/docs/start/starter/) — The full walkthrough: languages, identity, home page, content, navigation, brand, integrations and deployment, in that order.
- [Starter repository tour](/docs/start/anatomy/) — Which file controls which part of the site, and what you can delete.
- [Writing pages](/docs/write/pages/) — Front matter, headings, links, images and drafts.
- [Components](/docs/components/) — Callouts, tabs, diagrams and the rest, once your content tree has settled.
- [Brand and appearance](/docs/customize/brand/) — Logo, accent color, fonts, page width and your own CSS.
- [Deploy](/docs/admin/deploy/) — The supplied GitHub Pages or Cloudflare Pages workflow, and how to check the live site.
{.cards}

## Before you publish {#publication-gate}

Run the same production build the Starter's workflows run:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

It ends with a `Total in …` line, and `public/` holds one folder per language
plus your Docs, Blog and Book pages. Read the warnings before you push. OINK
reports a mistyped setting or an incomplete integration as a warning and keeps
building with a safe default, so a warning usually means a feature you expect
is switched off. After you push, check that the workflow passed and open the
live URL.

## Build with an AI agent {#agent-skill}

OINK publishes an agent skill, **Oink 建站** (`oink-site`): one Markdown file
that teaches a coding agent to build, migrate and polish an OINK site, carrying
the review standards of OINK's own sites and lessons from the
[case library](/case/). It sends the agent to this documentation for syntax and
has it check its work in a browser.

- English: <https://oink.pgsty.com/skill.md>
- 简体中文: <https://oink.pgsty.com/skill.zh.md>

Install it as a skill, then start a new agent session:

```bash {tab="Claude Code"}
mkdir -p ~/.claude/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.md -o ~/.claude/skills/oink-site/SKILL.md
```

```bash {tab="Codex"}
mkdir -p ~/.codex/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.md -o ~/.codex/skills/oink-site/SKILL.md
```

Then describe the site you want, for example "Use the oink-site skill to build
a bilingual documentation site for this project." An agent without a skills
directory can read the file straight from its URL. Download it again to
update; the file names the OINK release it was written for.

---

Section pages:

- [Use OINK Starter](/docs/start/starter/): Turn the OINK Starter into your project's site one layer at a time: languages, identity, home page, content, brand, integrations, and deployment.
- [Starter repository tour](/docs/start/anatomy/): Find the OINK Starter file behind each part of your site, what you can delete, and what the build depends on.
- [From scratch and other install methods](/docs/start/from-scratch/): Add OINK to an existing Hugo site or build a minimal one by hand, and install the theme as a Module, submodule, offline archive, or source copy.

---

Backlinks:

- [Six years to Oink](/blog/oink-release/)
- [Le Shi Handbook](/case/le-shi/)
- [Docs](/docs/)
- [Introduction](/docs/about/)
- [Highlights](/docs/about/features/)
- [Cases](/docs/about/showcase/)
- [Local preview](/docs/admin/preview/)
- [Cards](/docs/components/cards/)
- [Presentation](/docs/components/presentation/)
- [Steps](/docs/components/steps/)
- [Configuration](/docs/customize/config/)
- [Home and landing pages](/docs/customize/home/)
- [From scratch](/docs/start/from-scratch/)
- [OINK Starter](/docs/start/starter/)
- [Writing pages](/docs/write/pages/)
