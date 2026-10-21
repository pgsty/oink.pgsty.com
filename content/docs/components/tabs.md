---
title: Tabs
linkTitle: Tabs
description: Add `{tab=}` to adjacent fences or tables to create tabs. Add a group to enable links, synchronization, and saved selections.
weight: 40
search_keywords: [Tabs, tab, group, value, sync, persistence, localStorage, hash]
---

Use tabs for equivalent alternatives, such as package managers, distributions, YAML / TOML / JSON, or environment variables and configuration keys.
Do not use tabs for ordered steps or unrelated content. Readers see only one panel at a time.

The native form uses a `tab` attribute on adjacent blocks.
Use `tabs`/`tab` shortcodes for panels with prose, multiple paragraphs, lists, or callouts.
Both forms share one runtime, one DOM, and the same keyboard behavior.

## Shortest form {#minimal}

Write two adjacent fences with `tab`, separated only by a blank line.

````markdown {title="Source"}
```bash {tab="Homebrew"}
brew install hugo
```
```bash {tab="Debian / Ubuntu"}
sudo apt install hugo
```
````

```bash {tab="Homebrew"}
brew install hugo
```
```bash {tab="Debian / Ubuntu"}
sudo apt install hugo
```

The server emits two complete titled code blocks. After page loading, the runtime combines adjacent blocks of the same kind into tabs.
GitHub, print, and browsers without JavaScript display both complete blocks in sequence.

## Groups: links, sync and memory {#group}

Write `group` only on the first block. This enables the public URL hash `#<group>-<value>`, in-page synchronization, and browser persistence.
Every block in the group must have `value`.

````markdown {title="Source"}
```bash {tab="npm" group="pkgmgr" value="npm"}
npm create hugo-site@latest
```
```bash {tab="pnpm" value="pnpm"}
pnpm create hugo-site
```
```bash {tab="Yarn" value="yarn"}
yarn create hugo-site
```
````

```bash {tab="npm" group="pkgmgr" value="npm"}
npm create hugo-site@latest
```
```bash {tab="pnpm" value="pnpm"}
pnpm create hugo-site
```
```bash {tab="Yarn" value="yarn"}
yarn create hugo-site
```

`value` is the machine identifier, matching `^[a-z0-9][a-z0-9_-]*$`. `tab` is the independent human label.
The pnpm panel uses `#pkgmgr-pnpm`. Opening this page with that hash selects the panel.

## Groups move together {#sync}

The set below also uses `group="pkgmgr"`. Changing either set's package manager changes the other.
The selection is saved in `localStorage` under `td-tabs:v1:pkgmgr`. It also applies to the same group on other pages.

````markdown {title="Source"}
```bash {tab="npm" group="pkgmgr" value="npm"}
npm run build
```
```bash {tab="pnpm" value="pnpm"}
pnpm build
```
````

```bash {tab="npm" group="pkgmgr" value="npm"}
npm run build
```
```bash {tab="pnpm" value="pnpm"}
pnpm build
```

This set has no `yarn` panel. If a value is missing, that set keeps its current selection. A set always has a selection.
Initial selection follows this order: URL hash, stored value, shortcode `default` or first block, then first tab.
Opening with a hash selects the panel without replacing the reader's stored preference.

## Tables can be tabs too {#tables}

Use the same attributes on table attribute lines to combine adjacent tables into tabs.

```markdown {title="Source"}
| Parameter | Default |
| --- | --- |
| `shared_buffers` | 25% RAM |
| `max_connections` | 100 |
{tab="PostgreSQL 18" group="pgver" value="pg18"}

| Parameter | Default |
| --- | --- |
| `shared_buffers` | 128MB |
| `max_connections` | 100 |
{tab="PostgreSQL 13" value="pg13"}
```

| Parameter | Default |
| --- | --- |
| `shared_buffers` | 25% RAM |
| `max_connections` | 100 |
{tab="PostgreSQL 18" group="pgver" value="pg18"}

| Parameter | Default |
| --- | --- |
| `shared_buffers` | 128MB |
| `max_connections` | 100 |
{tab="PostgreSQL 13" value="pg13"}

Fences and tables cannot form one set, even when adjacent. A native tab set contains only fences or only tables.
To combine them, use the shortcode form below.

## A label and a filename together {#tab-with-title}

A fence can have both `tab` and `title`. The tab bar displays the label. The filename title bar remains inside the panel.

````markdown {title="Source"}
```yaml {tab="YAML" title="hugo.yml" group="conffmt" value="yaml"}
params:
  ui:
    sidebar_menu_foldable: true
```
```toml {tab="TOML" title="hugo.toml" value="toml"}
[params.ui]
sidebar_menu_foldable = true
```
````

```yaml {tab="YAML" title="hugo.yml" group="conffmt" value="yaml"}
params:
  ui:
    sidebar_menu_foldable: true
```
```toml {tab="TOML" title="hugo.toml" value="toml"}
[params.ui]
sidebar_menu_foldable = true
```

## A lone block is just a titled block {#single-block}

A block needs an adjacent block of the same kind to form a tab set.
A single block keeps its title instead of creating a one-tab bar.

````markdown {title="Source"}
```ini {tab="on its own"}
listen_addresses = '*'
```
````

```ini {tab="on its own"}
listen_addresses = '*'
```

Only blank lines may separate blocks. Prose, headings, or lists between blocks break the set.
HTML comments, commonly `<!-- prettier-ignore-end -->`, also break it.
A later block with its own `group` starts a new set. Only the first block in a set may have this attribute.

## Tabs around running text {#shortcode}

For panels with paragraphs, lists, callouts, or multiple blocks, use `tabs`/`tab` shortcodes. Their bodies use full Markdown.

`````markdown {title="Source"}
{{</* tabs group="deploy" default="pages" label="Deployment target" */>}}
{{</* tab label="GitHub Pages" value="pages" */>}}
The repository ships `.github/workflows/`; a push to `main` builds and publishes.

> [!NOTE]
> `baseURL` has to be the repository's Pages address.
{{</* /tab */>}}
{{</* tab label="Cloudflare Pages" value="cloudflare" */>}}
Connect the repository in the Cloudflare dashboard; the build command is:

```bash
hugo --gc --minify
```
{{</* /tab */>}}
{{</* /tabs */>}}
`````

{{< tabs group="deploy" default="pages" label="Deployment target" >}}
{{< tab label="GitHub Pages" value="pages" >}}
The repository ships `.github/workflows/`; a push to `main` builds and publishes.

> [!NOTE]
> `baseURL` has to be the repository's Pages address.
{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}
Connect the repository in the Cloudflare dashboard; the build command is:

```bash
hugo --gc --minify
```
{{< /tab >}}
{{< /tabs >}}

`default` sets the initial panel. It must match a child's `value` and requires `group`.
Without `group`, `value` is forbidden. The theme generates `tab1`, `tab2`, and later identifiers.
These ungrouped tabs switch locally without changing the URL or storage.
The shortcode form reports mistakes at build time; the attribute form reports them in the browser.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<div class="td-tabs">` with `role="tablist"` buttons and panels; every panel is visible until the runtime takes over |
| Print | Consecutive titled static sections, no tab bar |
| Markdown | The fence form keeps the source fence, `{tab=}` included; the shortcode form emits `**Label**` plus the body |
| RSS | Same as print — stacked titled sections |

Only a page that uses tabs loads `tabs.js`; print, Markdown and RSS never do.

## Parameter reference {#reference}

Attributes on a fence info line or a table attribute line:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `tab` | non-empty string | none | The visible label; on a lone block it is simply that block's title |
| `group` | `^[a-z][a-z0-9_-]*$` | none | On the first block of a set; enables hash, in-page sync and persistence; requires `tab` |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | none | Required on every block of a group, forbidden without one; requires `tab` |
{.fields meta="type default"}

The `tabs` shortcode:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `group` | `^[a-z][a-z0-9_-]*$` | none | As above: hash, sync and persistence |
| `default` | a child's `value` | the first child | The initially selected panel; requires `group` |
| `label` | plain text | localized "Tabs" | Accessible name for the tab bar; not displayed |
{.fields meta="type default"}

The `tab` shortcode:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | plain text | yes | The visible label |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | when `group` is set | Forbidden without a group, where `tab1`, `tab2` … are generated |
{.fields meta="type required"}

In a group, panel IDs use `<group>-<value>`.
If the same `group` appears again on one page, later sets receive `-2` and `-3` suffixes. Deep links still target the first set.
Ungrouped sets have generated IDs. The storage key is `td-tabs:v1:<group>`.
Clicks or keypresses update the hash through `replaceState` and write storage. Arriving with a hash only changes the selection.
Left and right arrows follow RTL direction. These keys and Home/End move and activate tabs, while focus stays on the tab.

## Limits {#limits}

- Invalid grouping or composition warns during Hugo builds and uses a safe fallback.
  The theme removes unusable group/value/default settings, ignores stray content, keeps later duplicates, or omits empty sets.
  Warnings identify the source position. Review the warning and rendered fallback before publication.
- In the attribute form, a sequence without usable `value` loses synchronization and remains local tabs.
  Grouping never silently creates an identity.
- Fences and tables cannot form one set. Use shortcodes to combine prose and code.
- To collapse long output, use `> [!DETAILS]` instead of tabs. See [Callouts](/docs/components/callout/).
- `group` names are shared site-wide. Selecting pnpm on page A also selects pnpm in the same group on page B.
  Choose meaningful `group` names instead of `tabs1`.

## Related {#related}

- [Code blocks](/docs/components/code/) — the rest of the fence attributes (title, copy, line numbers, folding)
- [Tables](/docs/components/table/) — the rest of the table attribute line
- [Callouts](/docs/components/callout/) — for folding rather than juxtaposing
- [Steps](/docs/components/steps/) — tabs inside a procedure
