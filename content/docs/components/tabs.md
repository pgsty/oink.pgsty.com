---
title: Tabs
linkTitle: Tabs
description: Put equivalent alternatives such as package managers or config formats side by side, and let one reader choice follow them across every page.
weight: 210
search_keywords: [Tabs, tab, group, value, sync, persistence, localStorage, hash]
---

Tabs put equivalent alternatives side by side, such as package managers,
operating systems, YAML / TOML / JSON, or an environment variable and its
configuration key, so each reader sees the one that applies to them. Do not use
them for ordered steps or unrelated content: a reader sees one panel at a time
and may never open the others.

There are two forms with the same runtime, markup and keyboard behavior. The
common one is a `tab` attribute on adjacent code fences (as well as `filetree`,
`gallery` and `map` data fences) or tables. When a panel needs prose, lists or
callouts, use the `tabs`/`tab` shortcodes.

## Shortest form {#minimal}

Write two fences with `tab`, separated by nothing but a blank line.

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

The page itself contains two complete code blocks, each titled with its label,
and the browser joins adjacent blocks into a tab set once the page loads. On
GitHub, on paper and without JavaScript, readers see both blocks one after the
other, so nothing is ever hidden from them.

## Groups: links, sync and memory {#group}

Add `group` to the first block, and a `value` to every block of the set. The
set then gets a shareable URL hash `#<group>-<value>`, stays in step with other
sets of the same group, and remembers the reader's choice.

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

`tab` is the label people read and `value` is the identifier in URLs and
storage, matching `^[a-z0-9][a-z0-9_-]*$`, so you can reword a label without
breaking links. The pnpm panel above is `#pkgmgr-pnpm`: open this page with
that hash and it is selected.

## Groups move together {#sync}

The set below uses the same `group="pkgmgr"`, so choosing a package manager in
either set switches the other. The choice is saved in `localStorage` under
`td-tabs:v1:pkgmgr` and applies to every `pkgmgr` set on every page of the
site: a reader who picks pnpm once sees pnpm everywhere.

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

This set has no `yarn` panel. When the group switches to a value a set lacks,
that set keeps its current panel, so a set always shows something. On load, a
set takes the first of these that it can use: the URL hash, the stored choice,
the shortcode's `default` or the first block, the first tab. A hash selects a
panel without overwriting the reader's stored choice.

## Tables can be tabs too {#tables}

The same attributes on table attribute lines join adjacent tables into a set.

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

A set holds only fences or only tables; an adjacent fence and table stay
separate. To mix them, use the [shortcode form](#shortcode).

## A label and a filename together {#tab-with-title}

A fence can carry both `tab` and `title`: the label goes in the tab bar and
the filename stays in the title bar inside the panel.

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

A set needs at least two adjacent blocks of the same kind. A single block with
`tab` keeps the label as its title instead of growing a one-tab bar.

````markdown {title="Source"}
```ini {tab="on its own"}
listen_addresses = '*'
```
````

```ini {tab="on its own"}
listen_addresses = '*'
```

Only blank lines may come between the blocks of a set. Anything else ends it:
a paragraph, heading or list, an HTML comment (often a stray
`<!-- prettier-ignore-end -->`), or a block that declares its own `group`,
which starts a new set.

## Tabs around running text {#shortcode}

When a panel needs paragraphs, lists, callouts or several blocks, use the
`tabs`/`tab` shortcodes. Each `tab` body is full Markdown.

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

`default` picks the initial panel; it must match a child's `value` and needs
`group`. Without `group`, the theme numbers the tabs `tab1`, `tab2` … itself,
so a `value` is ignored with a warning, and the set switches locally without
touching the URL or storage.

The shortcode form checks the whole set at build time. The attribute form
checks each block's own attributes at build time, but blocks only become a set
in the browser, so problems of the set as a whole, such as a later block
without `value` or two blocks with the same value, show up as warnings in the
browser console.

## Output {#outputs}

Only pages that use tabs load `tabs.js`. Until it runs, and in print, RSS and
browsers without JavaScript, every panel is visible as a titled section with no
tab bar. In the Markdown output the fence form keeps its source fences,
`{tab=}` included, and each shortcode tab becomes its label in bold followed
by its body.

## Parameter reference {#reference}

Attributes on a fence info line or a table attribute line:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `tab` | non-empty string | none | The visible label; on a lone block it is simply that block's title |
| `group` | `^[a-z][a-z0-9_-]*$` | none | On the first block of a set only; enables the hash, in-page sync and persistence; requires `tab` |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | none | Required on every block of a grouped set; ungrouped it only names the panel; requires `tab` |
{.fields meta="type default"}

The `tabs` shortcode:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `group` | `^[a-z][a-z0-9_-]*$` | none | As above: hash, sync and persistence |
| `default` | a child's `value` | the first child | The initially selected panel; requires `group` |
| `label` | plain text | localized "Tabs" | Accessible name of the tab bar; not displayed |
{.fields meta="type default"}

The `tab` shortcode:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | plain text | yes | The visible label |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | when `group` is set | Forbidden without a group, where `tab1`, `tab2` … are generated |
{.fields meta="type required"}

In a group, a panel's ID is `<group>-<value>`. When the same `group` appears
twice on one page, later sets get `-2`, `-3` … suffixes and a deep link goes
to the first set; ungrouped sets get generated IDs. The storage key is
`td-tabs:v1:<group>`. A click or key press updates the hash with
`replaceState` and writes storage, while arriving with a hash only changes the
selection. Left and Right (mirrored on right-to-left pages), Home and End move
to a tab and select it, and focus stays on the tab.

## Limits {#limits}

- Invalid input warns and falls back to something safe, and build warnings
  name the source position. Unusable `group`, `value` or `default` settings
  are dropped, stray content inside `tabs` is ignored, a repeated shortcode
  `value` keeps both tabs, and a `tabs` without children renders nothing.
- An attribute-form set in which some block lacks a usable `value` loses its
  group and switches locally; the theme never invents a value for a group.
  Adjacent blocks that repeat a `value` stay separate titled blocks.
- A set holds only fences or only tables. Use the shortcodes to mix prose and
  code.
- Tabs are not a way to fold content away. To collapse long output, use
  `> [!DETAILS]`; see [Callouts](/docs/components/callout/).
- `group` names are shared across the site, so picking pnpm on one page also
  picks it in every `pkgmgr` set on other pages. Name groups by meaning, such
  as `pkgmgr` or `os`, never `tabs1`.

## Related {#related}

- [Code blocks](/docs/components/code/) — the rest of the fence attributes (title, copy, line numbers, folding)
- [Tables](/docs/components/table/) — the rest of the table attribute line
- [Callouts](/docs/components/callout/) — for folding rather than juxtaposing
- [Steps](/docs/components/steps/) — tabs inside a procedure
