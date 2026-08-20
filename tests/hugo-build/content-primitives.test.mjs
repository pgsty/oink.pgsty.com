import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const publicDir = path.join(siteDir, 'public');
const moduleWorkspace = path.join(siteDir, 'go.work');

function runHugo(contentDir, destination, { panicOnWarning = false } = {}) {
  const overlayConfig = path.join(
    path.dirname(contentDir),
    'content-mount.yml',
  );
  writeFileSync(
    overlayConfig,
    `module:
  mounts:
    - source: ${JSON.stringify(contentDir)}
      target: content
      sites: { matrix: { languages: [en, zh] } }
`,
  );
  const args = [
    '--source',
    siteDir,
    '--config',
    `${path.join(siteDir, 'hugo.yml')},${overlayConfig}`,
    '--destination',
    destination,
    '--baseURL',
    'http://localhost',
    '--cleanDestinationDir',
    '--logLevel',
    'warn',
    '--noBuildLock',
  ];
  if (panicOnWarning) args.push('--panicOnWarning');
  return spawnSync(
    'hugo',
    args,
    {
      cwd: siteDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        ...(existsSync(moduleWorkspace)
          ? { HUGO_MODULE_WORKSPACE: moduleWorkspace }
          : {}),
      },
    },
  );
}

test('bilingual component docs publish semantic HTML and Markdown fallbacks', () => {
  // The docs tree is content/docs (formerly docs2). The English tree is a
  // placeholder copy of the Chinese pages until translation lands, so the
  // fixture asserts structure and shared strings rather than per-language prose.
  for (const prefix of ['', 'zh']) {
    const root = path.join(publicDir, prefix);
    const components = path.join(root, 'docs', 'components');
    const read = (...parts) => readFileSync(path.join(components, ...parts), 'utf8');
    const overview = read('index.html');
    const badgeHTML = read('badge', 'index.html');
    const kbdHTML = read('kbd', 'index.html');
    const fieldsHTML = read('fields', 'index.html');
    const fileTreeHTML = read('filetree', 'index.html');
    const imageHTML = read('image', 'index.html');
    const galleryHTML = read('gallery', 'index.html');
    const print = readFileSync(
      path.join(root, '_print', 'docs', 'index.html'),
      'utf8',
    );

    // Overview: the two-forms rule, the cheat sheet, and one link per component.
    assert.match(overview, /<h2 id="two-forms">/);
    assert.match(overview, /<h2 id="cheatsheet">/);
    for (const pageName of ['callout', 'image', 'code', 'tabs', 'table', 'fields', 'steps', 'cards', 'filetree', 'gallery', 'badge', 'kbd']) {
      assert.match(
        overview,
        new RegExp(`href="/(?:zh/)?docs/components/${pageName}/"`),
      );
    }
    assert.match(badgeHTML, /<span class="td-badge td-badge--warning/);
    assert.match(kbdHTML, /<span class="td-kbd-sequence"><kbd>Ctrl<\/kbd>/);
    assert.match(fieldsHTML, /<dl class="td-fields__list"/);
    // FileTree is the ```filetree fence: a td-filetree panel with a title bar,
    // native <details> directories (open by default, {open=false} closed) and
    // a comment-less plain variant; no tree role and no legacy list marker.
    assert.doesNotMatch(fileTreeHTML, /role="tree"|<ul class="filetree">/);
    assert.match(fileTreeHTML, /<p class="td-filetree__title" id="td-filetree-/);
    assert.match(fileTreeHTML, /<details class="td-filetree__details" open><summary class="td-filetree__summary">/);
    assert.match(fileTreeHTML, /<details class="td-filetree__details"><summary/);
    assert.match(fileTreeHTML, /td-filetree td-filetree--plain/);
    assert.match(fileTreeHTML, /<span class="td-filetree__hash" aria-hidden="true">#<\/span><span class="td-filetree__comment-text">/);
    assert.match(fileTreeHTML, /<span class="td-filetree__name" title="content\/">content\/<\/span>/);
    // Gallery is a data fence rendered by the theme: grid, per-item image, one
    // shared Zoom dialog per page.
    assert.match(galleryHTML, /<ul class="td-gallery/);
    assert.doesNotMatch(galleryHTML, /<ul class="gallery"/);
    const galleryLists = galleryHTML.match(/<ul class="td-gallery[^"]*">[\s\S]*?<\/ul>/g) || [];
    assert.ok(galleryLists.length >= 3, 'Gallery page lost its grids');
    for (const list of galleryLists) {
      const items = (list.match(/<li class="td-gallery__item"/g) || []).length;
      assert.ok(items >= 1);
      assert.equal((list.match(/class="td-gallery__image"/g) || []).length, items);
    }
    assert.equal((galleryHTML.match(/data-td-image-zoom-dialog/g) || []).length, 1);
    // Markdown images render through the image hook: figures with captions,
    // processed images as ordinary figures whose Zoom marker carries the
    // full-size original, and linked images that stay links.
    assert.match(
      imageHTML,
      /<figure class="td-figure"[\s\S]*?<figcaption>[\s\S]*?<\/figcaption>/,
    );
    assert.doesNotMatch(imageHTML, /td-figure--processed/);
    assert.match(imageHTML, /data-td-image-zoom="[^"]+\.webp"/);
    assert.equal((imageHTML.match(/data-td-image-zoom-dialog/g) || []).length, 1);
    assert.match(
      imageHTML,
      /<a href="\/(?:zh\/)?docs\/about\/features\/">\s*<img[^>]+alt="[^"]+"/,
    );

    const markdownByPage = Object.fromEntries(
      ['badge', 'kbd', 'fields', 'filetree', 'image', 'gallery'].map((name) => [
        name,
        read(name, 'index.md'),
      ]),
    );
    assert.match(markdownByPage.badge, /\*\*Beta\*\*/);
    assert.match(markdownByPage.kbd, /Ctrl \+ K/);
    // The table form of Fields stays a Markdown table with its marker line.
    assert.match(markdownByPage.fields, /^\| `offline_search` \| boolean/m);
    assert.match(markdownByPage.fields, /^\{\.fields/m);
    // Native list forms and the filetree / gallery fences stay source Markdown.
    assert.match(markdownByPage.filetree, /^```filetree \{title="[^"]+"\}$/m);
    assert.doesNotMatch(markdownByPage.filetree, /^\{\.filetree\}$/m);
    assert.match(markdownByPage.gallery, /^```gallery$/m);
    assert.doesNotMatch(markdownByPage.gallery, /^\{\.gallery\}$/m);
    for (const markdown of Object.values(markdownByPage)) {
      assert.doesNotMatch(
        // Rendered component markup, not the class names themselves: the
        // output-format tables quote `class="td-…"` inside inline code, so
        // code spans are stripped before the check.
        markdown.replace(/`[^`\n]*`/g, ''),
        /class="td-(?:badge|kbd-sequence|fields|filetree|gallery|image-zoom)|<ul class=/,
      );
    }

    const printGallery = print.match(
      /<ul class="td-gallery[^"]*">[\s\S]*?<\/ul>/,
    )?.[0];
    assert.ok(printGallery, 'Print output lost the Gallery grid');
    const printGalleryImage = printGallery.match(/<img [^>]+>/)?.[0];
    assert.ok(printGalleryImage, 'Print output lost Gallery images');
    assert.doesNotMatch(
      printGalleryImage,
      /data-td-image-zoom|data-zoom-src|data-no-zoom/,
    );
    assert.doesNotMatch(print, /<dialog class="td-image-zoom/);
  }
});

test('isolated primitives keep static Markdown, print, and RSS representations', () => {
  const fixtureDir = mkdtempSync(path.join(tmpdir(), 'oink-primitives-site-'));
  const contentDir = path.join(fixtureDir, 'content');
  const destination = path.join(fixtureDir, 'public');

  try {
    const sectionDir = path.join(contentDir, 'docs');
    mkdirSync(sectionDir, { recursive: true });
    writeFileSync(
      path.join(sectionDir, '_index.md'),
      '---\ntitle: Primitive probe\n---\n',
    );
    writeFileSync(
      path.join(sectionDir, 'item.md'),
      `---
title: Primitive item
date: 2020-08-12
image_zoom: true
---

Status {{< badge text="Probe badge" tone="warning" >}}.

Press {{< kbd "Ctrl" "K" >}}.

{{< fields label="Probe fields" >}}
  {{< field name="enabled" type="boolean" default=false required=true >}}
  Static **field description**.
  {{< /field >}}
{{< /fields >}}

\`\`\`filetree
- closed/   # probe dir
  - nested.md
\`\`\`

\`\`\`gallery
![Probe overview](images/content-primitives/oink.webp) # Probe caption one.
![Probe feedback](/images/feedback.png) # Probe caption two.
\`\`\`

<!--more-->

Content after the explicit feed summary boundary.
`,
    );

    const result = runHugo(contentDir, destination);
    assert.equal(
      result.status,
      0,
      `Primitive fixture build failed:\n${result.stdout}${result.stderr}`,
    );

    const html = readFileSync(
      path.join(destination, 'docs', 'item', 'index.html'),
      'utf8',
    );
    const markdown = readFileSync(
      path.join(destination, 'docs', 'item', 'index.md'),
      'utf8',
    );
    const print = readFileSync(
      path.join(destination, '_print', 'docs', 'index.html'),
      'utf8',
    );
    const rss = readFileSync(
      path.join(destination, 'docs', 'index.xml'),
      'utf8',
    );

    assert.match(html, /data-td-image-zoom-dialog/);
    assert.match(markdown, /\*\*Probe badge\*\*/);
    assert.match(markdown, /Ctrl \+ K/);
    assert.match(
      markdown,
      /- `enabled` — `boolean`; required; default: `false`/,
    );
    assert.match(markdown, /```filetree\n- closed\/   # probe dir\n  - nested\.md\n```/);
    assert.match(markdown, /!\[Probe overview\]/);
    assert.match(markdown, /```gallery\n.*# Probe caption one\./);
    assert.doesNotMatch(markdown, /td-badge|td-filetree|td-gallery|<dialog/);
    assert.match(
      html,
      /<div class="td-filetree" style="--td-filetree-name-col:[\d.]+ch" data-td-filetree>[\s\S]*?<span class="td-filetree__divider" role="separator"[\s\S]*?<details class="td-filetree__details" open><summary[\s\S]*?title="closed\/">closed\/<\/span>[\s\S]*?probe dir[\s\S]*?title="nested\.md">nested\.md<\/span>/,
    );
    assert.match(
      html,
      /<ul class="td-gallery[^"]*">\s*<li class="td-gallery__item"><img [^>]*alt="Probe overview"/,
    );

    for (const source of [print, rss]) {
      assert.match(source, /Probe badge/);
      assert.match(source, /Ctrl/);
      assert.match(source, /Probe fields/);
      assert.match(source, /field description/);
      assert.match(source, /nested.md/);
      assert.match(source, /Probe caption one/);
      assert.doesNotMatch(
        source,
        /data-td-image-zoom|data-zoom-src|data-no-zoom|<dialog class="td-image-zoom/,
      );
    }
    assert.match(print, /<div class="td-filetree td-filetree--static"/);
    assert.match(print, /<ul class="td-gallery[^"]*">/);
    // Print keeps the grid but in its stacked variant, and expands disclosures.
    assert.match(print, /td-gallery--static/);
    assert.doesNotMatch(print, /<details/);
    assert.match(rss, /&lt;pre class=&#34;td-filetree-source&#34;&gt;/);
    // RSS renders the gallery grid statically (FileTree falls back to source),
    // so the stacked variant is expected there and disclosures are not.
    assert.match(rss, /td-gallery--static/);
    assert.doesNotMatch(rss, /td-filetree__row|&lt;details/);
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true });
  }
});

test('invalid primitive parameters warn, fall back, and remain strict-build failures', () => {
  const fixtureDir = mkdtempSync(
    path.join(tmpdir(), 'oink-primitives-invalid-'),
  );
  const contentDir = path.join(fixtureDir, 'content');
  const destination = path.join(fixtureDir, 'public');

  try {
    const docsDir = path.join(contentDir, 'docs');
    mkdirSync(docsDir, { recursive: true });
    writeFileSync(path.join(docsDir, '_index.md'), '---\ntitle: Docs\n---\n');
    writeFileSync(
      path.join(docsDir, 'invalid.md'),
      '---\ntitle: Invalid primitive\n---\n\n{{< badge text="Bad" tone="loud" >}}\n',
    );

    const result = runHugo(contentDir, destination);
    const output = `${result.stdout}${result.stderr}`;
    assert.equal(result.status, 0, `Invalid primitive stopped the preview build:\n${output}`);
    assert.match(output, /tone must be one of/);
    assert.match(output, /content\/docs\/invalid\.md:\d+:/);
    assert.match(
      readFileSync(path.join(destination, 'docs', 'invalid', 'index.html'), 'utf8'),
      /class="td-badge td-badge--neutral">Bad<\/span>/,
    );

    const strict = runHugo(contentDir, `${destination}-strict`, {
      panicOnWarning: true,
    });
    const strictOutput = `${strict.stdout}${strict.stderr}`;
    assert.notEqual(strict.status, 0, 'Invalid primitive survived --panicOnWarning');
    assert.match(strictOutput, /tone must be one of/);
    assert.match(strictOutput, /content\/docs\/invalid\.md:\d+:/);
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true });
  }
});
