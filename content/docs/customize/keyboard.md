---
title: Keyboard navigation
linkTitle: Keyboard navigation
description: Every single-key shortcut, when each stands down for typing, and how to turn them off per site or per page.
weight: 80
search_keywords: [keyboard navigation, shortcuts, WASD, zen mode, keyboard_nav, accessibility, skip link]
aliases:
  - /docs/advanced/keyboard/
---

OINK's interactive pages come with a set of single-key shortcuts: WASD moves
through the sidebar tree, {{< kbd "J" >}} {{< kbd "K" >}} jump between headings,
{{< kbd "Q" >}} {{< kbd "E" >}} page back and forward, and a few more toggle the
theme, the language and the command palette. They are on by default, every
binding stands down for typing, and they can be turned off per site or per page.

Keyboard navigation keeps no second copy of any state: expanding and collapsing
reuses the sidebar's own arrow buttons, section jumps read the right-hand
outline, and switching language and theme reuse the command palette's actions.
Keyboard order and mouse order are therefore the same order.

## Sidebar {#sidebar}

| Key | Behaviour |
| --- | --- |
| {{< kbd "W" >}} {{< kbd "S" >}} {{< kbd "↑" >}} {{< kbd "↓" >}} | Move focus to the previous / next visible entry |
| {{< kbd "A" >}} {{< kbd "D" >}} {{< kbd "←" >}} {{< kbd "→" >}} | Collapse / expand a group; on a leaf, {{< kbd "A" >}} goes to the parent and {{< kbd "D" >}} does nothing |
| {{< kbd "Enter" >}} {{< kbd "Space" >}} {{< kbd "G" >}} | Open the focused page |
| {{< kbd "Esc" >}} | Leave the tree; focus returns to the body |

The four letter keys need no prior entry into the tree: with focus still in the
body, {{< kbd "S" >}} takes the current page's sidebar entry as its starting
point, moves down one and takes focus. The focused row is shaded a step darker
than the "current page" shading, so the two are distinguishable.

When the sidebar is in a drawer on a narrow screen, or collapsed on the desktop,
the first press of one of these keys opens it first. On a page with no sidebar
tree they are silent.

The arrow keys act on the tree **only after focus has entered the sidebar**; in
the body they keep native browser scrolling. In a right-to-left language
{{< kbd "←" >}} {{< kbd "→" >}} swap with the reading direction, while
{{< kbd "A" >}} {{< kbd "D" >}} always mean "collapse / expand".

## Reading {#reading}

| Key | Behaviour |
| --- | --- |
| {{< kbd "J" >}} {{< kbd "K" >}} | Jump to the next / previous section along the page outline |
| {{< kbd "N" >}} | Home page only: jump to the next top-level section (a mnemonic alias for {{< kbd "J" >}} there) |
| {{< kbd "Q" >}} {{< kbd "E" >}} | Previous / next page |
| {{< kbd "H" >}} | Focused reading: hide / restore the navigation shell |

{{< kbd "J" >}} {{< kbd "K" >}} take their target sequence from the same source
as the right-hand outline, so they land where clicking the outline lands. The
jump is a fixed 100 ms ease regardless of distance, and successive presses need
not wait for the previous animation. Once you have read some way into a section,
{{< kbd "K" >}} returns to that section's start first and only jumps to the
previous section on a second press. On a page with no headings it degrades to a
short scroll.

{{< kbd "Q" >}} {{< kbd "E" >}} page in the **sidebar tree's visible order**, not
by date. A section index is itself an entry in the tree, so a blog's section
boundary reads as "last post of the previous section → next section's index →
first post of the next section". A collapsed branch is not in that order:
paging order and focus order are the same order. On a page with no sidebar tree
it falls back to the page-end pager, and without one to `rel=prev/next` in
`<head>`.

{{< kbd "H" >}} hides only the navbar and footer on the home page, and on a
documentation page hides the left and right columns and the floating buttons too.
The state is kept in the tab's session and restored before the first frame, so
paging through with {{< kbd "Q" >}} {{< kbd "E" >}} neither loses it nor
flickers. While the shell is hidden, WASD will not send focus into an invisible
sidebar.

## Appearance, language and routing {#appearance}

| Key | Behaviour |
| --- | --- |
| {{< kbd "L" >}} {{< kbd "Y" >}} | Cycle the language (the two keys are equivalent) |
| {{< kbd "T" >}} | Toggle light and dark |
| {{< kbd "R" >}} | Cycle among same-origin top-level navbar entries |

These three work on any interactive page, not only inside the documentation
shell. {{< kbd "L" >}} on a single-language site, {{< kbd "T" >}} with the
light/dark menu off, and {{< kbd "R" >}} with only one top-level entry are all
silent. {{< kbd "R" >}} cycles only same-origin top-level menu items; external
links and navbar utility controls take no part.

## Search and commands {#search}

| Key | Behaviour |
| --- | --- |
| {{< kbd "F" >}} or {{< kbd "/" >}} | Open the command palette in full search mode |
| {{< kbd "C" >}} or the backslash key | Open the command palette in command-only mode |
| {{< kbd "⌘" "K" >}} or {{< kbd "Ctrl" "K" >}} | Open the palette; press again to close |

{{< kbd "/" >}} and backslash belong to search itself and keep working with
keyboard navigation off; {{< kbd "F" >}} {{< kbd "C" >}} are aliases keyboard
navigation adds, pointing at the same palette instance. Backslash is awkward on
some non-US layouts, and typing a `>` prefix in the palette reaches command-only
mode just as well. What the palette holds is in
[Command palette](/docs/customize/panel/).

## Keys deliberately left free {#reserved}

{{< kbd "?" >}} is reserved and unbound. The cheatsheet hangs off the question
mark button in the footer's bottom bar, opens on hover, keyboard focus or
touch, and lists the keys actually available on the current page: a
single-language site never sees the language row.

{{< kbd "G" >}} {{< kbd "G" >}}, {{< kbd "Shift" "G" >}} and the digits are
likewise reserved, as possible future jump sequences.

## When shortcuts stand down {#stand-down}
Every binding is a bare single key, and all of them are disabled wherever they
could collide with typing or an overlay:

- Focus is in an input, textarea, select or `contenteditable` region;
- An input method is composing (a hard requirement on a Chinese site);
- A modifier is held: {{< kbd "⌘" "C" >}} is still copy, {{< kbd "Shift" "↓" >}} still belongs to the browser;
- The command palette or another dialog is open, and the keyboard belongs to that overlay.

The comment section lives in an iframe, where key events do not bubble to the
page, so no extra isolation is needed.

## Focus order and accessibility {#a11y}

- **Skip link**: the first {{< kbd "Tab" >}} after landing on a page reveals "skip to main content", stepping past the navbar and sidebar in one move.
- **Real focus**: navigating the tree moves actual DOM focus rather than a virtual cursor. A screen reader therefore announces the link name and the "current page" marker, {{< kbd "Enter" >}} is the link's native behaviour, and the Tab order is not rewritten.
- **High contrast**: the focused row's background drops out under `forced-colors` and degrades to a system highlight outline.
- **Reduced motion**: with `prefers-reduced-motion` on, section jumps and paging scroll become instant positioning rather than an ease.
- The key caps in the cheatsheet share their styling with the [Kbd](/docs/components/kbd/) component used in the body.

## Turning it off {#disable}

Site-wide:

```yaml {title="hugo.yml"}
params:
  ui:
    keyboard_nav: false
```

For one page (interaction-heavy demonstration pages often need this), or for a
whole section by cascade:

```yaml {title="content/docs/playground.md"}
---
title: Interactive playground
keyboard_nav: false
---
```

The key accepts a boolean only; `"false"` or any other value warns and uses the
site default during ordinary preview. A strict publishing build fails on
`params.ui.keyboard_nav must be a boolean`. The full definition is in
[Configuration](/docs/customize/config/).

Turned off, the runtime never enters the JavaScript bundle rather than loading
and then checking. {{< kbd "/" >}}, backslash and {{< kbd "⌘" "K" >}} belong to
search and keep working; the arrows on the footer's collapsible link grid are
unaffected.

## Verify {#verify}

1. After a build, confirm the cheatsheet button is in the page:

   ```bash
   grep -c 'td-shell-keyboard__trigger' public/docs/customize/keyboard/index.html
   ```

   With keyboard navigation off and local search not enabled, the button is not
   generated at all.

2. Open a documentation page, leave the cursor in the body and press {{< kbd "S" >}} repeatedly: the sidebar should step down from the current page's entry while the body stays put.

3. Press {{< kbd "E" >}} several times and check the paging order matches the sidebar top to bottom; collapse a group and page again — the collapsed pages should be skipped.

4. Click into the search box and press {{< kbd "J" >}}: the page should **not** scroll, and the character should type normally. The same holds while typing with a Chinese input method.

5. Turn on "reduce motion" in the system and press {{< kbd "J" >}}: it should position instantly with no glide.

## Related {#related}

- [Command palette](/docs/customize/panel/) — the dialog {{< kbd "F" >}} {{< kbd "C" >}} open
- [Search](/docs/customize/search/) — where the palette's page results come from
- [Layouts and page types](/docs/customize/layout/) — which pages have a sidebar and outline, and so which keys apply
- [Kbd](/docs/components/kbd/) — writing key caps in your own documentation
- [Configuration](/docs/customize/config/) — the full definition of `ui.keyboard_nav`
