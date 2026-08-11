---
title: Enhanced code blocks
description:
  Browser and output regression fixtures for code blocks and Code Groups.
weight: 20
---

## Exact copy source

```yaml {id="copy-source" filename="config/very-long-service-configuration-file-name.yml" copy="all"}
message: '你好, OINK'
items:
  - first

  - third
```

## Numbered source

```go {id="numbered-inline" lineNos="inline" lineNoStart=7 anchorLineNos=true hl_lines="8" collapse=2}
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

```bash {id="copy-disabled" copy=false}
echo "no copy control"
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

<!-- prettier-ignore -->
{{< code-group id="install-client" sync="package-manager" persist=true label="Choose a package manager" copy="all" >}}
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

<!-- prettier-ignore -->
{{< code-group id="install-tool" sync="package-manager" persist=true >}}
  {{< code-tab title="npm" value="npm" lang="bash" >}}
npm install --global @example/tool
  {{< /code-tab >}}
  {{< code-tab title="pnpm" value="pnpm" lang="bash" >}}
pnpm add --global @example/tool
  {{< /code-tab >}}
{{< /code-group >}}

<!-- prettier-ignore -->
{{< code-group id="literal-markers" persist=false collapse=2 >}}
  {{< code-tab title="Backticks **literal** [label]" value="ticks" lang="text" >}}
before ``` marker
after
  {{< /code-tab >}}
  {{< code-tab title="Plain" value="plain" lang="text" >}}
one
two
three
  {{< /code-tab >}}
{{< /code-group >}}

## Legacy tabpane

<!-- prettier-ignore -->
{{< tabpane persist="lang" >}}
  {{< tab header="YAML" lang="yaml" selected=true >}}
message: legacy-compatible
  {{< /tab >}}
  {{< tab header="JSON" lang="json" >}}
{"message":"legacy-compatible"}
  {{< /tab >}}
{{< /tabpane >}}
