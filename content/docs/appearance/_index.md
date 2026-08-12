---
title: Appearance
linkTitle: Appearance
weight: 50
icon: fa-solid fa-palette
description: Typography presets, colors, and style overrides.
---

OINK's appearance customization rests on semantic CSS custom properties: a site
overrides a small number of variables to reskin, without copying the theme's
component selectors.

## In this chapter {#in-this-chapter}

- [Typography presets](typography/): seven semantic font roles and two presets
- [Styling](styling/): colors, layout, and Sass variables
- [Advanced customization](customize/): template overrides and site-owned
  components

## Precedence {#precedence}

Lowest to highest:

1. theme defaults
2. presets (`typography.preset`)
3. Sass variables in `_variables_project.scss`
4. custom-property overrides in `_styles_project.scss`

Site settings always take precedence over preset defaults.
