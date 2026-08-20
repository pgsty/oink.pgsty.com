---
title: Enhanced code blocks
search_exclude: true
description: Browser regression fixtures for code blocks and Code Groups.
weight: 20
---

## Exact copy source

```yaml {id="copy-source" title="config/very-long-service-configuration-file-name.yml" copy="all"}
message: '你好, OINK'
enabled: true
items:
  - first

  - third
```

## Numbered source

```go {id="numbered-inline" lineNos="inline" lineNoStart=7 anchorLineNos=true hl_lines="3" collapse=2}
package main

func main() {
    println("inline numbers")
}
```

```sql {id="numbered-table" lineNos="table" lineNoStart=41 hl_lines="42-43"}
SELECT 1;
SELECT 2;
SELECT 3;
```

## Console modes

```console {id="console-commands"}
$ printf 'hello\n'
hello
$ printf 'world\n'
world
$ printf '%s\n' \
>   first \
>   second
first
second
```

```console {id="console-all" copy="all"}
$ printf 'all\n'
all
```

```shell-session {id="session-no-prompt" copy="command"}
this line deliberately has no prompt token
```

```sh {id="copy-disabled" copy=false}
echo "no copy control"
```

```go-html-template {id="template-source" copy=false}
{{</* code-group id="sample" */>}}
{{</* /code-group */>}}
```

## Wrap and collapse

```text {id="wrapped-collapsed" wrap=true collapse=4 label="Long wrapped example"}
alpha = one
beta = two
gamma = this-is-a-deliberately-long-unbroken-value-that-must-wrap-without-changing-the-copied-source
delta = four
epsilon = five
zeta = six
eta = seven
theta = eight
```

```text {id="below-collapse-threshold" collapse=20}
alpha
beta
```

## Diff

```diff {title="client.patch"}
-const client = oldClient();
+const client = newClient();
```

## Package manager groups

```bash {tab="npm" group="package-manager" value="npm" copy="all"}
npm install @example/client
```

```bash {tab="pnpm" value="pnpm" copy="all"}
pnpm add @example/client
```

```bash {tab="yarn" value="yarn" copy="all"}
yarn add @example/client
```

Install the tool with the same package manager:

```bash {tab="npm" group="package-manager" value="npm"}
npm install --global @example/tool
```

```bash {tab="pnpm" value="pnpm"}
pnpm add --global @example/tool
```

Literal markers in tab titles stay literal:

````text {tab="Backticks **literal** [label]" collapse=2}
before ``` marker
after
````

```text {tab="Plain" collapse=2}
one
two
three
```

## Legacy tabpane

```yaml {tab="YAML" group="yaml-json" value="yaml"}
message: legacy-compatible
```

```json {tab="JSON" value="json"}
{ "message": "legacy-compatible" }
```
