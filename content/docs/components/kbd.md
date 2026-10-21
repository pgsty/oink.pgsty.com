---
title: Kbd
linkTitle: Kbd
description: Use `kbd` with one key name per parameter to display a semantic key sequence. Instructions remain readable in print and Markdown.
weight: 190
search_keywords: [Kbd, shortcut, keyboard, Ctrl, Cmd, chord]
---

Use keys to show shortcuts and chords separately from prose. Supply one positional parameter per key.
The theme draws keycaps, adds separators, and gives screen readers a readable sequence.
Use inline code for command names, flags, and text to type. They are not physical keys.

## Shortest form {#minimal}

```markdown {title="Source"}
Press {{</* kbd "Ctrl" "K" */>}} to open the command palette.
```

Press {{< kbd "Ctrl" "K" >}} to open the command palette.

Quote each positional parameter and use one parameter per key.
Missing, empty, or named parameters warn. Ordinary previews do not render invalid keys. Review the warning and rendered fallback before publication.

## A single key {#single}

Each parameter represents one key. Write symbol keys as displayed on the keyboard.

```markdown {title="Source"}
{{</* kbd "Escape" */>}} closes a dialog;
{{</* kbd "/" */>}} jumps to search;
{{</* kbd "t" */>}} toggles light and dark;
{{</* kbd "l" */>}} cycles through languages.
```

{{< kbd "Escape" >}} closes a dialog;
{{< kbd "/" >}} jumps to search;
{{< kbd "t" >}} toggles light and dark;
{{< kbd "l" >}} cycles through languages.

## Chords {#combo}

Multiple parameters display in order, separated by `+`.
Assistive technology receives a localized connector instead of the visible plus sign.

```markdown {title="Source"}
{{</* kbd "⌘" "Shift" "P" */>}} and {{</* kbd "Ctrl" "Shift" "P" */>}} are the same action.
For a literal plus, treat it as a key of its own: {{</* kbd "Ctrl" "+" */>}} zooms the page in.
```

{{< kbd "⌘" "Shift" "P" >}} and {{< kbd "Ctrl" "Shift" "P" >}} are the same action.
For a literal plus, treat it as a key of its own: {{< kbd "Ctrl" "+" >}} zooms the page in.

## Platform differences {#platforms}

Use the reader's keyboard labels: `⌘` on macOS and `Ctrl` on Windows and Linux.
Never combine platform labels in one sequence. Labels such as `Ctrl/⌘` cannot be read aloud correctly.
Name the platform in the sentence or use [tabs](/docs/components/tabs/).

```markdown {title="Source"}
On macOS press {{</* kbd "⌘" "K" */>}}; on Windows and Linux, {{</* kbd "Ctrl" "K" */>}}.
```

On macOS press {{< kbd "⌘" "K" >}}; on Windows and Linux, {{< kbd "Ctrl" "K" >}}.

## Shortcut tables {#in-tables}

Keys are common in cheatsheets. This table shows some global keys that the site supports:

```markdown {title="Source"}
| Key | Action |
| --- | --- |
| {{</* kbd "Ctrl" "K" */>}} | Open the command palette ({{</* kbd "⌘" "K" */>}} on macOS) |
| {{</* kbd "/" */>}} | The palette's full search state |
| {{</* kbd "t" */>}} | Toggle light and dark |
| {{</* kbd "q" */>}} / {{</* kbd "e" */>}} | Previous / next page |
| {{</* kbd "w" */>}} {{</* kbd "s" */>}} {{</* kbd "a" */>}} {{</* kbd "d" */>}} | Move, collapse and expand in the sidebar tree |
| {{</* kbd "Escape" */>}} | Leave the sidebar tree for the article |
```

| Key | Action |
| --- | --- |
| {{< kbd "Ctrl" "K" >}} | Open the command palette ({{< kbd "⌘" "K" >}} on macOS) |
| {{< kbd "/" >}} | The palette's full search state |
| {{< kbd "t" >}} | Toggle light and dark |
| {{< kbd "q" >}} / {{< kbd "e" >}} | Previous / next page |
| {{< kbd "w" >}} {{< kbd "s" >}} {{< kbd "a" >}} {{< kbd "d" >}} | Move, collapse and expand in the sidebar tree |
| {{< kbd "Escape" >}} | Leave the sidebar tree for the article |

The complete list of site-wide shortcuts is in
[keyboard navigation](/docs/customize/keyboard/).

## In steps {#in-steps}

```markdown {title="Source"}
1. Press {{</* kbd "Ctrl" "K" */>}} to open the command palette
1. Type `>` for the command-only state, or type a keyword to search
1. Select with {{</* kbd "↑" */>}} {{</* kbd "↓" */>}} and press {{</* kbd "Enter" */>}} to go
1. {{</* kbd "Escape" */>}} closes it and focus returns where it was
{.steps}
```

1. Press {{< kbd "Ctrl" "K" >}} to open the command palette
1. Type `>` for the command-only state, or type a keyword to search
1. Select with {{< kbd "↑" >}} {{< kbd "↓" >}} and press {{< kbd "Enter" >}} to go
1. {{< kbd "Escape" >}} closes it and focus returns where it was
{.steps}

## Raw `<kbd>` tags {#raw-kbd}

Raw `<kbd>` tags get the same styles, and GitHub also displays them.
With raw tags, you maintain separators and accessible sequences yourself. Either form works for single keys. Use the shortcode for chords.

```markdown {title="Source"}
Press <kbd>F5</kbd> to reload; in an editor, <kbd>Ctrl</kbd>+<kbd>S</kbd> saves.
```

Press <kbd>F5</kbd> to reload. In an editor, <kbd>Ctrl</kbd>+<kbd>S</kbd> saves.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<span class="td-kbd-sequence">` around one `<kbd>` per key; the visible `+` is hidden from screen readers, which get a localized connector |
| Print | Same as HTML, static |
| Markdown | Plain text: `Ctrl + K`, `⌘ + Shift + P` |
| RSS | Same as print |

The instruction remains readable without CSS or JavaScript.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| Positional 1..n | string | — | At least one; each must be non-empty and quoted; order is display order |
{.fields meta="type default"}

Only positional parameters are supported. There is no `separator`, `label`, `platform`, `class`, or `size` parameter.
Hugo cannot combine positional and named parameters in one shortcode call.

## Limits {#limits}

- Each sequence represents keys pressed together. For consecutive keys, use two `kbd` calls and describe the order:
  press {{< kbd "Escape" >}}, then {{< kbd "Enter" >}}.
- There is no platform detection. The page never replaces `Ctrl` with `⌘` based on the visitor's operating system.
- There is no key mapping or recording. Menu paths, gestures, and gamepads are outside the scope.
- Missing quotes fail the build. `Ctrl` in `{{</* kbd Ctrl K */>}}` is not a string parameter.
- Do not use keys for commands. `hugo server` is inline code; `Ctrl` is a key.

## Related {#related}

- [Keyboard navigation](/docs/customize/keyboard/) — the full shortcut list and its switches
- [Command palette](/docs/customize/panel/) — what {{< kbd "Ctrl" "K" >}} opens
- [Badges](/docs/components/badge/) — the other inline shortcode
- [Steps](/docs/components/steps/) — the container for instructions
