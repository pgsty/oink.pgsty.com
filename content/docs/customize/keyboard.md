---
title: Keyboard navigation
linkTitle: Keyboard navigation
description: Use single-key shortcuts and understand when typing disables them. Disable shortcuts for the site or individual pages.
weight: 80
search_keywords: [keyboard navigation, shortcuts, WASD, zen mode, keyboard_nav, accessibility, skip link]
aliases:
  - /docs/advanced/keyboard/
---

OINK's interactive pages have single-key shortcuts. WASD moves through the
sidebar tree. {{< kbd "J" >}} {{< kbd "K" >}} move between headings.
{{< kbd "Q" >}} {{< kbd "E" >}} open previous and next pages. Other shortcuts
switch the theme, language, and command palette. Shortcuts are on by default.
Typing disables every binding. You can disable shortcuts per site or per page.

Keyboard navigation keeps no separate state. Expansion and collapse use the
sidebar's arrow buttons. Section jumps use the right-hand outline. Language
and theme switching use command palette actions. Keyboard and mouse navigation
therefore use the same order.

## Sidebar {#sidebar}

| Key | Behaviour |
| --- | --- |
| {{< kbd "W" >}} {{< kbd "S" >}} {{< kbd "↑" >}} {{< kbd "↓" >}} | Move focus to the previous / next visible entry |
| {{< kbd "A" >}} {{< kbd "D" >}} {{< kbd "←" >}} {{< kbd "→" >}} | Collapse / expand a group. On a leaf, {{< kbd "A" >}} opens the parent and {{< kbd "D" >}} does nothing |
| {{< kbd "Enter" >}} {{< kbd "Space" >}} {{< kbd "G" >}} | Activate the focused entry: open a page link or toggle a group button |
| {{< kbd "Esc" >}} | Leave the tree. Return focus to the body |

You can use the four letter keys before entering the tree. With focus in the
body, {{< kbd "S" >}} starts from the current page's sidebar entry. It moves
down one entry and takes focus. The focused row is darker than the "current
page" row. Readers can distinguish the two states.

If the sidebar is in a narrow-screen drawer or collapsed on desktop, the first
key press opens it. If a page has no sidebar tree, these keys do nothing.

Arrow keys control the tree **only after focus enters the sidebar**. In the
body, they retain native browser scrolling. For a right-to-left language,
{{< kbd "←" >}} {{< kbd "→" >}} swap with the reading direction.
{{< kbd "A" >}} {{< kbd "D" >}} always mean "collapse / expand".

Since OINK 1.1, groups without their own pages use disclosure buttons for
keyboard navigation. From a child, {{< kbd "A" >}} first returns to the group.
Press it again to collapse the group. {{< kbd "D" >}} opens a collapsed group.
If the group is open, it moves to the first visible child. Page navigation with
{{< kbd "Q" >}} / {{< kbd "E" >}} skips group buttons.

## Reading {#reading}

| Key | Behaviour |
| --- | --- |
| {{< kbd "J" >}} {{< kbd "K" >}} | Jump to the next / previous section along the page outline |
| {{< kbd "N" >}} | Home page only: jump to the next top-level section (a mnemonic alias for {{< kbd "J" >}} there) |
| {{< kbd "Q" >}} {{< kbd "E" >}} | Previous / next page |
| {{< kbd "H" >}} | Focused reading: hide / restore the navigation shell |

{{< kbd "J" >}} {{< kbd "K" >}} use the same target sequence as the right-hand
outline. They reach the same location as an outline click. Each jump uses a
100 ms ease, regardless of distance. You can press again before the animation
finishes. If you have scrolled into a section, {{< kbd "K" >}} first returns
to its start. A second press opens the previous section. Without headings,
the keys perform a short scroll.

{{< kbd "Q" >}} {{< kbd "E" >}} follow the **sidebar tree's visible order**.
They do not sort by date. Section indexes are tree entries. At a blog section
boundary, the sequence is "last post of the previous section → next section's index →
first post of the next section". Collapsed branches are excluded. Paging and
focus use the same order. Without a sidebar tree, paging uses the page-end
pager. Without that pager, it uses `rel=prev/next` in `<head>`.

On the home page, {{< kbd "H" >}} hides only the navbar and footer. On a
documentation page, it also hides the left and right columns and floating
buttons. The tab session stores this state and restores it before the first
frame. Paging with {{< kbd "Q" >}} {{< kbd "E" >}} preserves it without flicker.
While the shell is hidden, WASD cannot focus the invisible sidebar.

## Appearance, language and routing {#appearance}

| Key | Behaviour |
| --- | --- |
| {{< kbd "L" >}} {{< kbd "Y" >}} | Cycle the language (the two keys are equivalent) |
| {{< kbd "T" >}} | Toggle light and dark |
| {{< kbd "R" >}} | Cycle among same-origin top-level navbar entries |

These three shortcuts work on every interactive page, including pages outside
the documentation shell. {{< kbd "L" >}} does nothing on a single-language site.
{{< kbd "T" >}} does nothing if the light/dark menu is off. {{< kbd "R" >}}
does nothing if there is only one top-level entry. {{< kbd "R" >}} cycles only
same-origin top-level menu items. It excludes external links and navbar utility
controls.

## Search and commands {#search}

| Key | Behaviour |
| --- | --- |
| {{< kbd "F" >}} or {{< kbd "/" >}} | Open the command palette in full search mode |
| {{< kbd "C" >}} or the backslash key | Open the command palette in command-only mode |
| {{< kbd "⌘" "K" >}} or {{< kbd "Ctrl" "K" >}} | Open the palette; press again to close |

{{< kbd "/" >}} and backslash belong to search. They work when keyboard
navigation is off. Keyboard navigation adds {{< kbd "F" >}} {{< kbd "C" >}}
as aliases for the same palette. Backslash is difficult to use on some non-US
layouts. You can also type a `>` prefix in the palette to select command-only
mode. See [Command palette](/docs/customize/panel/) for its contents.

## Expo image viewer {#expo-viewer}

The [Expo viewer](/docs/write/expo/#shortcuts) has its own
shortcuts. Page-level single-key navigation pauses while an image is open.
It resumes when the viewer closes.

| Key | Viewer action |
| --- | --- |
| W / A / S / D | Move the enlarged image up / left / down / right |
| Q or H, E or L | Previous image, next image |
| J or −, K or + | Zoom out, zoom in |
| R or 0 | Reset size and position |
| F | Expand to fit the whole image in the viewing area |
| Escape | Close the viewer |

These actions apply inside the viewer. `keyboard_nav: false` disables page
shortcuts; it does not disable the viewer controls. Expo is available in OINK 1.3.0.

## Keys deliberately left free {#reserved}

{{< kbd "?" >}} is reserved and unbound. The cheatsheet uses the question mark
button in the footer's bottom bar. It opens on hover, keyboard focus, or touch.
It lists only keys available on the current page. A single-language site
therefore has no language row.

{{< kbd "G" >}} {{< kbd "G" >}}, {{< kbd "Shift" "G" >}} and the digits are
likewise reserved, as possible future jump sequences.

## When shortcuts stand down {#stand-down}
Each binding is a bare single key. The following conditions disable all
bindings to prevent conflicts with typing or overlays:

- Focus is in an input, textarea, select or `contenteditable` region;
- An input method is composing (a hard requirement on a Chinese site);
- A modifier is held. {{< kbd "⌘" "C" >}} still copies, and {{< kbd "Shift" "↓" >}} remains a browser action;
- The command palette, another open native dialog, or a visible ARIA dialog owns the keyboard. This includes fixed-position ARIA dialogs; hidden ARIA dialogs do not block shortcuts.

The comment section uses an iframe. Its key events do not propagate to the
page. No additional isolation is needed.

## Focus order and accessibility {#a11y}

Since OINK 1.1, hidden sidebar and drawer content is removed from
keyboard focus. Clicking the article, a table viewport or a code block no
longer produces a large outline after a later keypress. Keyboard focus remains
visible: the skip link highlights the article title, and scrollable tables
and code keep their own focus indication and keyboard scrolling.

- **Skip link**: the first {{< kbd "Tab" >}} on a page reveals "skip to main content". It skips the navbar and sidebar in one action.
- **Real focus**: tree navigation moves actual DOM focus instead of a virtual cursor. A screen reader announces the link name and "current page" marker. {{< kbd "Enter" >}} retains the link's native behavior. The Tab order remains unchanged.
- **High contrast**: under `forced-colors`, the focused row's background is removed. A system highlight outline replaces it.
- **Reduced motion**: with `prefers-reduced-motion` enabled, section jumps and paging scroll position instantly without an ease.
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

The key accepts only a boolean. Passing `"false"` or any other non-boolean
value warns (`params.ui.keyboard_nav must be a boolean`) and uses the site default. See the complete definition in
[Configuration](/docs/customize/config/).

If you disable keyboard navigation, its runtime is excluded from the JavaScript
bundle. {{< kbd "/" >}}, backslash, and {{< kbd "⌘" "K" >}} belong to search
and still work. The footer's collapsible link-grid arrows are unaffected.

## Verify {#verify}

Run from your site's root after a production build. In the commands below, replace
`public/docs/getting-started/index.html` with an actual generated documentation
page in your site (including a language prefix if needed).

1. After a build, confirm the cheatsheet button is in the page:

   ```bash
   hugo --printPathWarnings
   PAGE=public/docs/getting-started/index.html
   test -f "$PAGE" && grep -c 'td-shell-keyboard__trigger' "$PAGE"
   ```

   With keyboard navigation off and local search not enabled, the button is not
   generated at all.

2. Open a documentation page. Leave focus in the body and press {{< kbd "S" >}} repeatedly. Confirm that the sidebar moves down from the current page's entry. The body should not move.

3. Press {{< kbd "E" >}} several times. Confirm that paging follows the sidebar from top to bottom. Collapse a group and page again. Confirm that paging skips collapsed pages.

4. Click in the search box and press {{< kbd "J" >}}. The page should **not** scroll. The character should appear normally. Repeat with a Chinese input method.

5. Enable "reduce motion" in the system and press {{< kbd "J" >}}. Confirm instant positioning without animation.

6. For the 1.1 focus fixes, follow the skip link and check the title's focus
   indication. Collapse the sidebar and use {{< kbd "Tab" >}}: its hidden links
   should be skipped, while the restore control remains reachable.

## Related {#related}

- [Command palette](/docs/customize/panel/) — the dialog {{< kbd "F" >}} {{< kbd "C" >}} open
- [Search](/docs/customize/search/) — where the palette's page results come from
- [Layouts and page types](/docs/customize/layout/) — which pages have a sidebar and outline, and so which keys apply
- [Kbd](/docs/components/kbd/) — writing key caps in your own documentation
- [Configuration](/docs/customize/config/) — the full definition of `ui.keyboard_nav`
