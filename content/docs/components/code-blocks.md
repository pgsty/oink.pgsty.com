---
title: Code blocks and Code Groups
description:
  Add filenames, exact Copy behavior, wrapping, collapse, and shareable groups
  to Hugo code examples.
weight: 10
---

OINK enhances Hugo's ordinary fenced code blocks without replacing Chroma or
requiring a browser highlighter. The server emits the complete code and shell;
small page-scoped scripts only enable Copy, visual collapse, and tab state.

## Enhanced fences

Add metadata in Hugo's fence attribute list. A fence without attributes still
receives the same responsive shell and its normal Copy default. `filename` adds
a visible header; `title` is its compatible alias, and setting both is a build
error. With neither, OINK uses a compact overlay instead of an empty title row.

**Authoring**

````markdown {filename="content/docs/example.md" copy="all"}
```yaml {filename="hugo.yml" copy="all" lineNos="table" hl_lines="4 7-9" wrap=false collapse=18}
params:
  offlineSearch: true
```
````

### Live result

**Rendered result**

This block combines a filename, inline line numbers, a stable root ID, line
links, and highlighted source lines. Line numbers begin at 12, while `hl_lines`
still addresses the source lines inside the fence:

```yaml {id="docs-code-config" filename="hugo.yaml" copy="all" lineNos="inline" lineNoStart=12 hl_lines="3 6-7" anchorLineNos=true}
markup:
  highlight:
    noClasses: false
params:
  offlineSearch: true
  ui:
    sidebar_menu_foldable: true
```

### Shell parameters

| Attribute  | Values                               | Behavior                                       |
| ---------- | ------------------------------------ | ---------------------------------------------- |
| `filename` | string                               | Visible filename and accessible group name     |
| `title`    | string                               | Alias for `filename` on an ordinary fence      |
| `copy`     | `all`, `command`, `false`, or `true` | Copy policy; `true` is shorthand for `all`     |
| `wrap`     | `true` or `false`                    | Visually wrap long lines without changing text |
| `collapse` | positive integer                     | Initial maximum number of visible source lines |
| `label`    | string                               | Accessible label when no filename is suitable  |
| `id`       | string                               | Stable public block ID and line-anchor prefix  |

Hugo generic `class`, safe `data-*`, `aria-*`, and global attributes remain on
the `.td-code` root. Names beginning with `data-td-code` and `data-language` are
reserved. OINK rejects event-handler and inline-style attributes. Use `label` to
override a filename-derived accessible name; a generic `aria-label` together
with `label` or `filename` is a build error.

### Hugo options

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

````markdown {filename="content/docs/configuration.md"}
```diff {filename="hugo.yaml.diff"}
 params:
-  offlineSearch: false
+  offlineSearch: true
```
````

**Rendered result**

```diff {filename="hugo.yaml.diff"}
 params:
-  offlineSearch: false
+  offlineSearch: true
```

## Copy semantics

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

````markdown {filename="content/docs/terminal.md"}
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

## Wrapping and collapse

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

````markdown {filename="content/docs/downloads.md"}
```text {filename="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```
````

**Rendered result**

```text {filename="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```

The second emits all lines on the server but initially shows six in a browser:

**Authoring**

````markdown {filename="content/docs/configuration.md"}
```yaml {filename="hugo.yaml" collapse=6}
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

```yaml {filename="hugo.yaml" collapse=6}
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

## Stable IDs and line links

Set a page-unique explicit `id` when publishing line-number links. IDs cannot
contain ASCII whitespace or control characters and cannot collide with another
code component's generated viewport, tab, panel, title, or line-anchor ID. OINK
reports any such collision as a build error:

**Authoring**

````markdown {filename="content/docs/server.md"}
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

## Code Groups

Use `code-group` when examples are alternatives rather than independent tabs:

**Authoring**

```go-html-template {filename="content/docs/install.md" wrap=true}
{{</* code-group id="docs-install-client" sync="docs-package-manager" persist=false
    label="Choose a package manager" copy="all" */>}}
  {{</* code-tab title="npm" value="npm" lang="bash" */>}}
npm install @example/client
  {{</* /code-tab */>}}
  {{</* code-tab title="pnpm" value="pnpm" lang="bash" selected=true */>}}
pnpm add @example/client
  {{</* /code-tab */>}}
  {{</* code-tab title="yarn" value="yarn" lang="bash" */>}}
yarn add @example/client
  {{</* /code-tab */>}}
{{</* /code-group */>}}
```

**Rendered result**

<!-- prettier-ignore -->
{{< code-group id="docs-install-client" sync="docs-package-manager" persist=false label="Choose a package manager" copy="all" >}}
  {{< code-tab title="npm" value="npm" lang="bash" >}}
npm install @example/client
  {{< /code-tab >}}
  {{< code-tab title="pnpm" value="pnpm" lang="bash" selected=true >}}
pnpm add @example/client
  {{< /code-tab >}}
  {{< code-tab title="yarn" value="yarn" lang="bash" >}}
yarn add @example/client
  {{< /code-tab >}}
{{< /code-group >}}

`code-tab` contains raw code, not Markdown. OINK removes the framing newline and
closing-shortcode indentation while preserving all source whitespace inside.
Because a Markdown formatter can otherwise reflow that raw body, put
`<!-- prettier-ignore -->` immediately before each live `code-group` when using
Prettier, as in the examples below.

### Group and tab parameters

Every group requires a page-unique lower-case `id`. Optional `sync`, `persist`,
`label`, `copy`, `wrap`, and `collapse` values apply to the group; the last
three are inherited defaults. `persist` defaults to `true`.

Every child requires a plain-text `title` and stable lower-case `value`. `lang`
defaults to `text`; `selected`, `copy`, `wrap`, `collapse`, and the Hugo
highlight options can override group defaults. A group cannot be empty, repeat a
value, or contain more than one `selected=true` child. Filenames are omitted
inside groups because the tab itself identifies the example.

### Selection, sync, and persistence

A selected panel has the public hash `#<group-id>-<value>`, for example
`#install-client-pnpm`. Initial selection priority is URL hash, saved value,
`selected=true`, then the first child.

Groups sharing `sync` select the same value when that value exists in each
group; a peer missing it stays unchanged. A user selection updates the hash with
`replaceState` and saves the value when persistence is enabled. Visiting a
shared hash activates the requested examples without overwriting the reader's
saved preference. `persist=false` disables storage, not in-page synchronization.

### Live synchronized groups

The rendered install group above and the run group below share the same `sync`
key. Choose a package manager in either group and the other follows. The first
group's [npm](#docs-install-client-npm), [pnpm](#docs-install-client-pnpm), and
[yarn](#docs-install-client-yarn) panels also have shareable hashes.

**Authoring**

```go-html-template {filename="content/docs/run.md" wrap=true}
{{</* code-group id="docs-run-client" sync="docs-package-manager" persist=false */>}}
  {{</* code-tab title="npm" value="npm" lang="bash" */>}}
npm run docs:dev
  {{</* /code-tab */>}}
  {{</* code-tab title="pnpm" value="pnpm" lang="bash" selected=true */>}}
pnpm docs:dev
  {{</* /code-tab */>}}
  {{</* code-tab title="yarn" value="yarn" lang="bash" */>}}
yarn docs:dev
  {{</* /code-tab */>}}
{{</* /code-group */>}}
```

**Rendered result**

<!-- prettier-ignore -->
{{< code-group id="docs-run-client" sync="docs-package-manager" persist=false >}}
  {{< code-tab title="npm" value="npm" lang="bash" >}}
npm run docs:dev
  {{< /code-tab >}}
  {{< code-tab title="pnpm" value="pnpm" lang="bash" selected=true >}}
pnpm docs:dev
  {{< /code-tab >}}
  {{< code-tab title="yarn" value="yarn" lang="bash" >}}
yarn docs:dev
  {{< /code-tab >}}
{{< /code-group >}}

## Output and compatibility

Print hides controls and tab rows, expands every listing, and places each group
title before its code. Markdown output turns every grouped or legacy tab into a
readable titled fence and chooses a longer delimiter when source contains
backticks. Feeds and other non-interactive outputs use stacked examples. Pages
without applicable code or tabs do not load their runtimes.

Existing `tabpane` source and its `td-tp-persist:*` browser keys remain
compatible. Prism remains a legacy alternative and does not receive Enhanced
Code Blocks or Code Groups. Specialized `mermaid`, `math`, `chem`, `markmap`,
and `plantuml` hooks continue using their own renderers.
