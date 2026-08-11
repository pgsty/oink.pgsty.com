# Enhanced code blocks

> Browser and output regression fixtures for code blocks and Code Groups.

---

LLMS index: [llms.txt](/llms.txt)

---

## Exact copy source

```yaml {id="copy-source" filename="config/very-long-service-configuration-file-name.yml" copy="all"}
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
{{< code-group id="sample" >}}
{{< /code-group >}}
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
**npm**

```bash
npm install @example/client
```

**pnpm**

```bash
pnpm add @example/client
```

**yarn**

```bash
yarn add @example/client
```

<!-- prettier-ignore -->
**npm**

```bash
npm install --global @example/tool
```

**pnpm**

```bash
pnpm add --global @example/tool
```

<!-- prettier-ignore -->
**Backticks \*\*literal\*\* \[label\]**

````text
before ``` marker
after
````

**Plain**

```text
one
two
three
```

## Legacy tabpane

<!-- prettier-ignore -->
**YAML**

```yaml
message: legacy-compatible
```

**JSON**

```json
{"message":"legacy-compatible"}
```
