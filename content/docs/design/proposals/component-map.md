---
title: "Map component"
linkTitle: Map component
description: A map data fence whose place list is always the content, progressively enhanced with an opt-in OpenStreetMap-ecosystem map through vendored Leaflet and a site-chosen tile service.
weight: 29
icon: fa-solid fa-map-location-dot
search_keywords: [map, openstreetmap, leaflet, places, markers, route, travel, tiles, gps, exif, component]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] Implemented, awaiting acceptance
> Implemented on the theme's main branch working tree and documented in the
> [Map guide](/docs/components/map/). Not committed or released. The shared decisions
> are in the [overview](/docs/design/proposals/content-components-expansion/).

| Record | Value |
| --- | --- |
| Status | Implemented 2026-11-27; uncommitted; awaiting acceptance |
| Owner | OINK maintainers |
| Delivery stage | S5; photo pins from GPS metadata later |
| Form | Data fence: ```` ```map ```` with a YAML or JSON list of places |
| New public API | The `map` fence and its fields; configuration `params.map` |
| Runtime | None by default; vendored Leaflet through `content-components.js` when maps are enabled |
| Affected surface | `layouts/_markup/render-codeblock-map.html`, `scripts.html`, `content-components.js`, `VENDOR.json`, a stylesheet layer, the configuration schema, two locale keys, a new guide at `/docs/components/map/` |

## Summary {#summary}

````markdown
```map {caption="Kyoto in three days" route=true}
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
  text: Quietest right after opening.
  image: kinkakuji.webp
  link: "#day-1"
- name: Kiyomizu-dera
  lat: 34.9949
  lng: 135.7850
```
````

Every output renders the places as a numbered list with names, notes,
thumbnails, and coordinate links to OpenStreetMap. That list is the content.
When a site enables maps and names its tile service, an interactive map with
matching numbered markers appears above the list in HTML. Nothing is enabled,
and no tile service is chosen, by default.

## Problem {#problem}

Travel writing, photo essays and Expo pages, event and office locations,
field trips, and site visits need places on a map. Authors use screenshots
(static, no links, stale), Google Maps iframes (API keys, billing, terms,
regional blocking, third-party scripts), or nothing. OINK has no way to say
"these places, in this order" that also survives Print, feeds, and agents.

## Design principles {#principles}

1. **The list is the content; the map enhances it.** A reader without the map
   (Print, RSS, LLMS, no JavaScript, a blocked tile host) gets the same places,
   in the same order, with working links.
2. **Network only after complete configuration.** Tiles are third-party
   requests from the reader's browser. As with Draw.io, the theme ships no
   default server and stays off until configured
   ([architecture contract](/docs/design/architecture/#configuration-and-diagnostics)).
3. **The site chooses the tile service.** Tile services have usage policies,
   quotas, keys, and attribution terms. A theme default would make that legal
   and operational choice for every site.
4. **One form.** A fence holds one place as easily as twenty; there is no
   second shortcode.
5. **WGS 84 coordinates.** The system used by GPS, photo metadata, and
   OpenStreetMap.

## Goals and non-goals {#goals}

### Goals {#goals-list}

- A readable place list in every output, with zero configuration.
- An opt-in interactive map: numbered markers, popups with name, note,
  thumbnail, and link, an optional route line, and dark tiles when provided.
- No page scroll hijacking, keyboard operation, and localized controls.
- Vendored engine, loaded only on pages that need it.

### Non-goals {#non-goals}

- Google Maps, Mapbox SDKs, or any API-keyed engine bundled by the theme.
- A theme-chosen default tile service.
- A single-point `map` shortcode, named tile styles, custom marker icons or
  tones, or a static fallback image parameter in the first stage.
- GPX or GeoJSON tracks, clustering, search, routing, or geocoding.
- Coordinate transforms for GCJ-02 or BD-09 tiles (see [limitations](#limitations)).
- Map tiles or images generated at build time.

## Proposed behavior {#design}

### Places {#places}

The fence body is a YAML or JSON list. Each item:

| Field | Rule | Invalid input |
| --- | --- | --- |
| `name` | Required, plain text | Item skipped with a warning |
| `lat` | Required number, −90 to 90 | Item skipped with a warning |
| `lng` | Required number, −180 to 180 | Item skipped with a warning |
| `text` | Optional plain text | — |
| `image` | Optional image through the shared image resolver; a local raster is resized for the list and popup | Unresolvable: warns, no thumbnail |
| `link` | Optional URL through the shared URL policy; a same-page `#anchor` is the common case | Invalid: warns and is dropped |

Unknown fields warn. A fence with no valid place warns and renders nothing.
Explicit `lat`/`lng` keys avoid the latitude/longitude order confusion of
GeoJSON's `[lng, lat]` arrays.

### Fence attributes {#attributes}

| Attribute | Rule |
| --- | --- |
| `caption` | Plain text figure caption |
| `route` | `true` connects places in list order with a line |
| `zoom` | Integer 1–19. Default: 15 for one place; fit all places otherwise |
| `height` | Same validation as the Infographic fence's `height`; default is a responsive frame capped below the viewport height |
| `id` | Validated element ID |
| `tab`, `group`, `value` | The shared adjacent-tab behavior; the map resizes when its panel is shown |

`num` is not supported, as for other diagram fences; wrap the fence in `fig`
when a Book number is needed.

### Static form {#static-form}

Always rendered, in every output:

```html
<figure class="td-map">
  <ol class="td-map__places">
    <li>
      <span class="td-map__name">Kinkaku-ji</span>
      <span class="td-map__text">Quietest right after opening.</span>
      <a href="https://www.openstreetmap.org/?mlat=35.0394&amp;mlon=135.7292#map=16/35.0394/135.7292" rel="external">35.0394, 135.7292</a>
    </li>
    …
  </ol>
  <figcaption>Kyoto in three days</figcaption>
</figure>
```

Coordinates are shown as authored. The OpenStreetMap link is an ordinary
outbound link, not a request.

### Configuration {#configuration}

```yaml
params:
  map:
    enable: false
    tiles: ""        # required: HTTPS template with {z}, {x}, {y}; {s} and {r} allowed
    attribution: ""  # required: the plain-text attribution the tile service demands
    dark_tiles: ""   # optional: used while the page is in dark mode
    max_zoom: 19     # optional
```

`enable: true` with a missing or invalid `tiles` or `attribution` warns and
leaves maps off. The guide shows configuration examples — OpenStreetMap's
standard tiles (light use under the OpenStreetMap Foundation tile usage policy,
attribution required), a commercial service with a domain-restricted key, and a
self-hosted server — without making any of them a default. A key in a tile URL
is public; the guide says so.

### Interactive map {#interactive}

When `params.map` is complete and the output is HTML:

- The figure gains a canvas and a JSON copy of the validated places;
  `hasMap` selects the `content-components.js` adapter and registers the
  `leaflet` engine in `data-td-component-engines`. Leaflet's stylesheet is
  linked only on those pages, as the Asciinema player's is.
- The adapter mounts each map within 320px of the viewport, like the other
  engines.
- Markers are numbered HTML markers matching the list numbers, styled with
  preset tokens; no marker images.
- Popups are built with DOM APIs (`textContent`, element creation) from the
  JSON: name, note, thumbnail, link. No `innerHTML`.
- Scroll-wheel zoom is off, so reading never zooms the map. Zoom buttons,
  keyboard control, and pinch remain. On narrow screens the frame stays shorter
  than the viewport so the page can always be scrolled past.
- With `dark_tiles`, tiles follow the color scheme; without it, light tiles stay
  (no color inversion of map imagery).
- Size is recomputed on resize, when a tab panel is shown, and when a
  disclosure opens.
- Attribution uses Leaflet's attribution control with the configured text.
- If the engine or tiles fail, the canvas hides and the list remains.

The list stays visible under the map as its legend and as the accessible
alternative.

### Outputs {#outputs}

| Output | Result |
| --- | --- |
| HTML, maps off | Static form only; no canvas, script, or tile URL |
| HTML, maps on | Map above the static form |
| Browser print | Print rules hide the canvas; the list prints |
| Dedicated Print | Static form |
| Markdown / LLMS | The authored fence |
| RSS | Static form with absolute thumbnail URLs |

### Engine {#engine}

Leaflet (BSD-2-Clause) is small, needs no WebGL, and supports HTML markers and
keyboard control. On 2026-11-27 npm lists 1.9.4 as `latest` and 2.0 in beta
(2.0.0-beta.5, 2026-11-19). Vendor the current stable release at
implementation time, with license, version, source, and checksums in
`VENDOR.json`. If 2.0 is stable by then and is distributed only as an ES
module, the engine loader (a classic script with a readiness check) needs a
matching change first.

MapLibre GL with vector tiles or a single PMTiles file on object storage is the
stronger long-term route to self-hosted maps, at a larger size and with WebGL.
The fence format is engine-neutral, so a later proposal can switch or add an
engine without changing content.

### Photo pins from GPS metadata {#exif}

A place with a local photo and no coordinates could take its position from the
photo. Verified on Hugo 0.170.1:

- `Image.Exif` was deprecated in Hugo 0.155 and is now removed.
- `Image.Meta` returns `Lat`/`Long` only when the site's
  `imaging.meta.fields` includes the GPS fields. Hugo's default field filter
  excludes GPS, and a theme cannot change a site's `imaging` configuration.
- Published original photos keep their GPS data unless stripped, which can
  reveal private locations.

This is therefore a later stage: explicit coordinates first, then GPS-derived
pins as a documented site opt-in with a privacy note.

### Accessibility and privacy {#accessibility}

The numbered list conveys everything the map does. Map controls get localized
names. Tile requests send the reader's IP address and the viewed area to the
tile service, only after the site enables maps and only when a map comes into
view.

### Limitations {#limitations}

Coordinates are WGS 84. Map services in mainland China commonly use GCJ-02 (or
BD-09), so WGS 84 markers on those tiles appear offset by hundreds of meters.
The first stage documents this and supports only WGS 84 tiles. A later
`params.map` option could convert markers for GCJ-02 tiles if a site needs it.

## Trade-offs and alternatives {#alternatives}

| Option | Decision | Reason |
| --- | --- | --- |
| Google Maps | Rejected | Keys and billing, terms that restrict caching, regional blocking, third-party scripts |
| First-draft single-point `{{</* map */>}}` shortcode | Removed | A second form for what a three-line fence expresses |
| CARTO light/dark tiles as the default | Removed | A commercial service with its own usage terms; the theme should not choose it for every site |
| `styles`, `center`, marker `icon` and `tone`, `fallback` image, `full` | Removed for now | Numbered markers tie the map to the list; a fallback image duplicates the list |
| Hiding the list when the map mounts | Rejected | The list is the legend, the accessible alternative, and the print form |
| Static map images rendered at build | Rejected | Needs tiles at build time, contradicting offline builds |
| Click-to-load maps | Deferred | Lazy loading on approach is the engine norm; revisit if privacy review or touch scrolling demands it |

Costs: a vendored engine to maintain, a configuration step before any map
appears, and no default look out of the box. These follow directly from the
network policy.

## Compatibility {#compatibility}

Additive. `map` is a new fence language and `params.map` a new key. With maps
off, a page with a `map` fence is fully readable.

## Implementation plan {#implementation}

1. Vendor Leaflet under `assets/third_party/leaflet/` with `VENDOR.json`
   entries.
2. `render-codeblock-map.html` with a parse partial (validation, thumbnails via
   the image resolver and processing), static form, and enabled form.
3. `params.map` in `hugo.yaml`, the resolver with Draw.io-style completeness
   warnings, `bin/check-params.py`, and the generated configuration schema.
4. A `leaflet` adapter in `content-components.js`; `scripts.html` engine and
   stylesheet registration; unit tests with a stubbed engine.
5. Locale keys in all 32 files: `ui_map_label` and `ui_map_open_osm`; the zoom
   controls reuse `ui_diagram_zoom_in` and `ui_diagram_zoom_out`.
6. Fixtures: maps off and on, one and many places, invalid places, route,
   thumbnails from each source kind, tabs, and each output. Owning checks:
   `check-components.py` (data fences), `check-runtime-isolation.py`,
   `check-vendor.py`, `check-output.py`, `check-output-security.py`,
   `check-goldens.py`, `check-stylesheets.py`, `check-params.py`,
   `check-i18n.py`, `node --test`.
7. Browser review on this site with a configured tile service: keyboard,
   touch scrolling, dark tiles, tabs, presets, print.

## Acceptance criteria {#acceptance}

- With maps off, no output contains a tile URL, the Leaflet script, or its
  stylesheet.
- With incomplete configuration, the build warns and behaves as maps off.
- The list is identical with maps on and off.
- Scroll-wheel input over a map scrolls the page.
- Popups contain no author HTML.

## Open decisions {#open-decisions}

1. **List presentation under the map.** Recommended: always visible, compact.
   Alternative: collapsible for long lists.
2. **Marker style.** Recommended: numbers only in S5; icons later on request.
3. **Engine version.** Recommended: decide between 1.9.4 and 2.x when S5
   starts.
4. **GCJ-02 support.** Recommended: out of scope until a site asks.

## Decision log {#decision-log}

- **2026-11-27 (first draft).** `map` fence plus single-point shortcode,
  CARTO default tiles, named styles, marker icons and tones, fallback images,
  and EXIF pins in C3.
- **2026-11-27 (review).** One fence; no default tile service; the list is
  always rendered; EXIF pins moved to a later stage after verifying Hugo's
  `Image.Meta` defaults.
- **2026-11-27 (implementation).** Implemented with vendored Leaflet 1.9.4 (`VENDOR.json`), `render-codeblock-map.html`, `content/map-config.html`, a `leaflet` adapter in `content-components.js` and `assets/css/td/map.css`. Differences from this draft: the fence is parsed as YAML by resource name, because Hugo's content sniffing reads a YAML list written as `- {name: …}` as JSON; the zoom controls reuse `ui_diagram_zoom_in` and `ui_diagram_zoom_out`, so only `ui_map_label` and `ui_map_open_osm` are new; `params.map` is validated on every page. Invalid input is covered in `bin/check-content-primitives.py` and `bin/check-params.py`; `tests/js/content-components-map.test.js` covers the adapter.
- **2026-11-27 (review hardening).** Fixed `{s}` subdomain tile validation and YAML `.nan` coordinate build crash; raised selector specificity in `map.css` to outrank body-end `leaflet.css`, aligned popups/controls/focus rings across all four presets and dark mode, fixed popup close-button overlap, dark-mode print ink, `slate` dark `--td-on-link`, RTL popup/coordinate direction, forced-colors popup border, and print pagination; added touch single-finger scroll pass-through, `keyboard-nav.js` map-focus yield, complete tile-failure canvas hiding, `prefers-reduced-motion` support, marker `aria-label`, `Escape` popup dismissal, localized close label, `tabs.js`-first ordering for hidden tabs, list-click panning, and `rich-copy.js` canvas exclusion; added optional `attribution_url` (OSM copyright link compliance), `subdomains`, and `loading: click` (32-locale `ui_map_load`), plus Playwright regression coverage in `tests/browser/map.spec.mjs`.
- **2026-11-27 (adversarial review).** A non-string `params.map.loading` (a list or map) stopped the build, because `cond` evaluated `strings.TrimSpace` on it; it now warns and keeps `lazy`. Tile templates may use only `{s}`, `{z}`, `{x}`, `{y}`, `{-y}` and `{r}`: any other placeholder, in the host, path or query, warns at build time, since Leaflet throws on one it cannot fill and left an empty map. When every first tile fails, the map is removed only after Leaflet finishes dispatching the layer's `load`, which otherwise threw a `TypeError`; failing `dark_tiles` fall back to the dimmed light tiles instead of removing the map for good. The `loading: click` button names every host the map may contact, `{s}` as `*` and the `dark_tiles` host included. `tests/browser/map.spec.mjs` runs in `test:content-components`. Minor follow-ups: a pen drags the map like a mouse; a popup opened with Enter takes focus and returns it to its marker when closed from inside; a load button activated from the keyboard hands focus to the map; `params.map.subdomains` is documented as empty by default (Leaflet's `abc`); `ui_map_load` reads “Завантажити мапу” in Ukrainian and “טעינת המפה” in Hebrew.
