---
title: Browse locally
linkTitle: Browse locally
description: Clone an existing OINK repository and run hugo serve to read docs in your browser, preview edits as you type, and watch AI agents' latest reports render live.
weight: 10
search_keywords:
  [
    local browsing,
    hugo serve,
    hugo server,
    live reload,
    preview,
    AI agent reports,
    beginner,
    read locally,
  ]
---

You do not need to deploy a site—or even build one yourself—to get value from
OINK. Whenever you have an OINK repository on disk (this docs site, a
teammate's handbook, an online book, or a workspace where an AI agent writes
notes), running `hugo serve` turns that folder into a fast, searchable local
website in your browser.

## Clone and start the server {#start-server}

Install Git, Go and Hugo per [Prerequisites](/docs/start/#tools), then clone
the repository and run `hugo serve` (Hugo's short alias for `hugo server`) in
the folder that holds `hugo.yml` or `hugo.yaml`:

```bash {title="Terminal"}
git clone https://github.com/OWNER/OINK-SITE.git
cd OINK-SITE
hugo serve
```

The first start downloads the pinned OINK theme into your local Go module
cache. Once the terminal prints `Web Server is available at
http://localhost:1313/`, open <http://localhost:1313/> in any browser. Press
{{< kbd "Ctrl" "C" >}} in the terminal whenever you want to stop the server.

## Read in the browser, not raw Markdown {#reading}

Reading a documentation tree through `hugo serve` gives you the full reading
experience that plain Markdown viewers cannot render:

- **Structured navigation**: the collapsible sidebar, page outline (TOC),
  breadcrumbs, and previous/next links stay in sync with the folder tree.
- **Instant search and shortcuts**: press {{< kbd "/" >}} or
  {{< kbd "Ctrl" "K" >}} to search the whole repository locally, and press
  {{< kbd "'" >}} or click the footer `?` button to view keyboard shortcuts.
- **Rendered components**: callouts, tabs, field tables, KaTeX math, Mermaid
  and ECharts diagrams, and galleries render natively with no network
  dependencies. Maps render their place list offline too; map tiles load only
  when the site has configured a tile service.
- **Reader comfort**: switch between Paper, Slate, Ink and Terminal, toggle
  light and dark mode, open Duo View on bilingual sites, or print clean PDFs.

If the repository includes unpublished drafts (`draft: true` in front matter),
start the server with `hugo serve -D` so those pages appear in the sidebar too.

## Edit and watch changes reload live {#live-edit}

Leave `hugo serve` running in one terminal while you edit Markdown files under
`content/` or home-page YAML under `data/`. Every time you save a file—or
switch Git branches—Hugo rebuilds the affected pages in milliseconds and
refreshes your browser tab automatically.

```bash {title="Useful daily preview commands"}
hugo serve -D                     # include draft pages while writing
hugo serve -D --navigateToChanged # jump the browser straight to the file you just saved
hugo serve -D --renderToMemory    # serve from memory without writing anything to public/
```

Passing `--renderToMemory` (`-M`) is especially clean when you are reviewing a
repository in Git, because the preview never touches `public/` on disk.

## Follow AI agent reports in real time {#agent-reports}

When a coding agent such as Claude Code or Codex is working on a large task—for
example, auditing a codebase, writing design proposals, drafting documentation,
or logging experiment results—reading long Markdown tables and diagrams inside
a scrolling terminal quickly becomes tiring.

Point the agent to write its reports as ordinary Markdown pages inside an OINK
site's `content/` directory, and keep `hugo serve -D --renderToMemory` running
in a side terminal with <http://localhost:1313/> open in your browser:

1. The agent writes or updates a report (such as `content/docs/reports/audit.md`)
   with headings, `{.fields}` tables, callouts, or Mermaid / ECharts diagrams.
1. Hugo detects the file write immediately, rebuilds in memory, and reloads the
   browser tab while keeping your reading position.
1. You read formatted sections, interactive diagrams, and cross-linked pages in
   real time—and because `--renderToMemory` writes no build output to disk, the
   agent's Git working tree stays clean.
{.steps}

This turns any OINK repository into a zero-setup local reading room for both
human notes and agent-generated reports.

## Common snags {#tips}

| Symptom | Fix |
| --- | --- |
| Port `1313` is already in use by another preview | Run `hugo serve -p 1314` to pick another port |
| A change to `hugo.yml`, `data/`, or a layout did not appear | Restart with `hugo serve --disableFastRender`, then hard-reload the browser |
| A page with `draft: true` is missing from the sidebar | Add `-D` (`hugo serve -D`) |
| The site lives inside a `docs/` subfolder of a larger repo | Run `hugo serve -s docs` from the repository root, or `cd docs && hugo serve` |

For advanced server switches, phone/LAN preview, Docker containers, cache
clearing, and production builds, see [Local preview](/docs/admin/preview/).

## Related {#related}

- [Get started](/docs/start/) — clone the docs site and try building with an AI agent
- [From scratch](/docs/start/from-scratch/) — build your own standalone OINK site
- [Add docs to a project](/docs/start/add-docs/) — add a `docs/` site to an existing repository
- [Local preview](/docs/admin/preview/) — full `hugo server` reference, LAN access, containers, and caches
