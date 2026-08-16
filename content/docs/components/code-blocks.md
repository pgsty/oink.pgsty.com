---
title: Code blocks and tabs
linkTitle: Code blocks
description:
  Add titles, exact Copy behavior, wrapping, collapse, and shareable tab sets to
  Hugo code examples.
weight: 10
---

OINK enhances Hugo's ordinary fenced code blocks without replacing Chroma or
requiring a browser highlighter. The server emits the complete code and shell;
small page-scoped scripts only enable Copy, visual collapse, and tab state.

## Enhanced fences {#enhanced-fences}

Add metadata in Hugo's fence attribute list. A fence without attributes still
receives the same responsive shell and its normal Copy default. `title` adds a
visible header (`filename` is its historical alias; setting both is a build
error). With neither, OINK uses a compact overlay instead of an empty title row.

**Authoring**

````markdown {title="content/docs/example.md" copy="all"}
```yaml {title="hugo.yml" copy="all" lineNos="table" hl_lines="4 7-9" wrap=false collapse=18}
params:
  offlineSearch: true
```
````

### Live result {#live-result}

**Rendered result**

This block combines a filename, inline line numbers, a stable root ID, line
links, and highlighted source lines. Line numbers begin at 12, while `hl_lines`
still addresses the source lines inside the fence:

```yaml {id="docs-code-config" title="hugo.yaml" copy="all" lineNos="inline" lineNoStart=12 hl_lines="3 6-7" anchorLineNos=true}
markup:
  highlight:
    noClasses: false
params:
  offlineSearch: true
  ui:
    sidebar_menu_foldable: true
```

### Shell parameters {#shell-parameters}

| Attribute  | Values                               | Behavior                                                         |
| ---------- | ------------------------------------ | ---------------------------------------------------------------- |
| `title`    | string                               | Visible filename and accessible group name                       |
| `filename` | string                               | Historical alias for `title`; using both is a build error        |
| `copy`     | `all`, `command`, `false`, or `true` | Copy policy; `true` is shorthand for `all`                       |
| `wrap`     | `true` or `false`                    | Visually wrap long lines without changing text                   |
| `collapse` | positive integer                     | Initial maximum number of visible source lines                   |
| `label`    | string                               | Accessible label when no filename is suitable                    |
| `id`       | string                               | Stable public block ID and line-anchor prefix                    |
| `tab`      | string                               | Tab label; consecutive fences with `tab` form a [tab set](#tabs) |
| `group`    | lower-case token                     | Opt-in hash, sync, and persistence for the tab run               |
| `value`    | lower-case token                     | Stable tab value inside a grouped run                            |
| `num`      | `[0-9A-Za-z.-]+`                     | Numbered Book example (`eg`); requires `caption`                 |
| `caption`  | string                               | Caption of a numbered Book example; requires `num`               |

`class`, `data-*`, and `aria-*` attributes remain on the `.td-code` root. Names
beginning with `data-td-code` and `data-language` are reserved; any other
unknown attribute, event handlers, and inline styles fail the build. Use `label`
to override a filename-derived accessible name; a generic `aria-label` together
with `label` or `title` is a build error.

### Hugo options {#hugo-options}

The render hook continues to pass these options to Hugo:

- `lineNos`, `lineNoStart`, and `anchorLineNos`;
- `hl_lines`;
- `tabWidth` and `style`.

Class-based Chroma markup remains inside `.highlight` and `.chroma`, so existing
token-level overrides keep working. The new stable outer element is `.td-code`;
sites using direct-child selectors such as `.td-content > .highlight` should
update those selectors.

The visible language label normalizes the common `bash`, `sh`, and `shell` lexer
aliases to `BASH`. The original lexer value is still passed to Chroma and
retained in `data-language`.

Diffs deliberately use Chroma's standard `diff` lexer rather than a custom
transformer:

**Authoring**

````markdown {title="content/docs/configuration.md"}
```diff {title="hugo.yaml.diff"}
 params:
-  offlineSearch: false
+  offlineSearch: true
```
````

**Rendered result**

```diff {title="hugo.yaml.diff"}
 params:
-  offlineSearch: false
+  offlineSearch: true
```

## Copy semantics {#copy-semantics}

Ordinary source defaults to `copy="all"`. `console` and `shell-session` default
to `copy="command"`: only lines carrying Chroma prompt tokens are copied, and
prompt/output tokens are excluded. Use `copy="all"` when a complete transcript
is intentional. `command` on another language is a build error.

Copy preserves indentation, internal blank lines, and Unicode, removes line
numbers, trims only trailing newline characters, and appends exactly one final
newline. A session lexer that emits no prompt token reports a localized failure
and copies nothing. Set `params.disable_click2copy_chroma: true` to hard-disable
Copy for the entire site.

Copy is shown as a compact icon without adjacent text. Its localized label is
still exposed to assistive technology and as a hover tooltip; success and
failure also change the icon and update the live status message.

For a multi-line terminal command, include the continuation prompt (normally
`>`) on every continued transcript line. Chroma classifies an unprompted line as
output, so `copy="command"` deliberately excludes it.

The Copy action on this live session copies the two commands, not the prompts or
output:

**Authoring**

````markdown {title="content/docs/terminal.md"}
```console {title="Terminal session"}
$ hugo version
hugo v0.164.0+extended darwin/arm64
$ hugo --gc --minify
Total in 742 ms
```
````

**Rendered result**

```console {title="Terminal session"}
$ hugo version
hugo v0.164.0+extended darwin/arm64
$ hugo --gc --minify
Total in 742 ms
```

## Wrapping and collapse {#wrapping-and-collapse}

`wrap=true` changes presentation only; copied source is untouched. It is
incompatible with Chroma's table line-number layout because separately wrapped
gutter and source cells would drift. Use inline line numbers or disable wrap.
OINK fails the build instead of silently misaligning them.

`collapse=N` is progressive enhancement. The server always emits all source; the
browser clips only after it can measure the Nth real Chroma line. Without
JavaScript, in assistive technology, and in print, the listing remains complete.
Reduced-motion preferences disable the height animation.

The first example wraps a long value without altering copied text:

**Authoring**

````markdown {title="content/docs/downloads.md"}
```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```
````

**Rendered result**

```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```

The second emits all lines on the server but initially shows six in a browser:

**Authoring**

````markdown {title="content/docs/configuration.md"}
```yaml {title="hugo.yaml" collapse=6}
baseURL: https://docs.example.com/
title: Product Documentation
defaultContentLanguage: en
languages:
  en:
    label: English
    weight: 1
  zh:
    label: 简体中文
    weight: 2
params:
  offlineSearch: true
```
````

**Rendered result**

```yaml {title="hugo.yaml" collapse=6}
baseURL: https://docs.example.com/
title: Product Documentation
defaultContentLanguage: en
languages:
  en:
    label: English
    weight: 1
  zh:
    label: 简体中文
    weight: 2
params:
  offlineSearch: true
```

## Stable IDs and line links {#stable-ids-and-line-links}

Set a page-unique explicit `id` when publishing line-number links. IDs cannot
contain ASCII whitespace or control characters and cannot collide with another
code component's generated viewport, tab, panel, title, or line-anchor ID. OINK
reports any such collision as a build error:

**Authoring**

````markdown {title="content/docs/server.md"}
```go {id="server-start" lineNos="inline" anchorLineNos=true}
func start() {}
```
````

**Rendered result**

```go {id="server-start" lineNos="inline" anchorLineNos=true}
func start() {}
```

OINK derives unique line-anchor prefixes from that ID. Generated IDs are safe
inside a page but depend on the block ordinal and are not a permalink contract;
inserting an earlier fence can change them.

## Tabs {#tabs}

<a id="code-groups"></a>

Consecutive fences that carry a `tab` attribute become one tab set. This is the
native form of code tabs: each fence stays a complete, titled block on the
server; a small runtime regroups adjacent blocks in the browser.

**Authoring**

````markdown {title="content/docs/install.md"}
```bash {tab="npm" group="docs-package-manager" value="npm"}
npm install @example/client
```

```bash {tab="pnpm" value="pnpm"}
pnpm add @example/client
```

```bash {tab="yarn" value="yarn"}
yarn add @example/client
```
````

**Rendered result**

<!-- prettier-ignore-start -->

```bash {tab="npm" group="docs-package-manager" value="npm"}
npm install @example/client
```

```bash {tab="pnpm" value="pnpm"}
pnpm add @example/client
```

```bash {tab="yarn" value="yarn"}
yarn add @example/client
```

<!-- prettier-ignore-end -->

### Tab attributes {#group-and-tab-parameters}

| Attribute | Values                  | Behavior                                                                                   |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| `tab`     | non-empty string        | Visible tab label; also the block title without JavaScript                                 |
| `group`   | `^[a-z][a-z0-9_-]*$`    | On the first fence of a run: enables the URL hash, page-wide sync, and browser persistence |
| `value`   | `^[a-z0-9][a-z0-9_-]*$` | Stable machine value; required on every fence of a grouped run, forbidden without a group  |

`group` or `value` without `tab`, a grouped run with a missing or duplicate
`value`, and `tab` together with a Book `num` are build errors. `tab` and
`title` coexist: the tab label goes to the tab list and the filename header
stays inside the panel. Fences with different `group` values, or a non-code
block between them, start a new run.

### Selection, sync, and persistence {#selection-sync-and-persistence}

A grouped panel has the public hash `#<group>-<value>`, for example
`#docs-package-manager-pnpm`. Initial selection priority is URL hash, saved
value, then the first fence. Sets sharing a `group` select the same value when
that value exists in each set; a peer missing it stays unchanged. A user
selection updates the hash with `replaceState` and saves the value in
`localStorage` under `td-tabs:v1:<group>`. Ungrouped runs switch locally and
touch neither the hash nor storage.

### Live synchronized sets {#live-synchronized-groups}

The install set above and the run set below share the same `group`. Choose a
package manager in either and the other follows; the panels also have shareable
hashes: open this page with `#docs-package-manager-pnpm` and both sets select
pnpm.

**Authoring**

````markdown {title="content/docs/run.md"}
```bash {tab="npm" group="docs-package-manager" value="npm"}
npm run docs:dev
```

```bash {tab="pnpm" value="pnpm"}
pnpm docs:dev
```
````

**Rendered result**

<!-- prettier-ignore-start -->

```bash {tab="npm" group="docs-package-manager" value="npm"}
npm run docs:dev
```

```bash {tab="pnpm" value="pnpm"}
pnpm docs:dev
```

<!-- prettier-ignore-end -->

### Prose tabs {#prose-tabs}

When a tab holds Markdown rather than one fence, use the `tabs`/`tab` shortcode
documented in
[Callouts, tabs, steps, and cards](/docs/components/layout/#tabs-shortcode).
Both forms share one runtime, one DOM contract, and the same keyboard behavior:
Left/Right (RTL aware) and Home/End move and activate, focus stays on the tab,
and no panel is hidden before the runtime enhances the page.

## Output and compatibility {#output-and-compatibility}

Print hides controls and tab rows, expands every listing, and places each tab
title before its code. Markdown output keeps every fence, including its `tab`
attributes, and chooses a longer delimiter when source contains backticks. Feeds
and other non-interactive outputs use stacked, titled examples. Pages without
applicable code or tabs do not load their runtimes.

The Docsy `tabpane`/`tab` and the OINK `code-group`/`code-tab` shortcodes were
removed; the theme's migration toolkit rewrites existing content into adjacent
fences or the `tabs` shortcode. Prism remains a legacy alternative and does not
receive Enhanced Code Blocks or tabs. Specialized `mermaid`, `math`, `chem`,
`markmap`, and `plantuml` hooks continue using their own renderers, and the
`echarts`, `infographic`, and `checksums` fences are
[data fences](/docs/components/echarts/).
