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

function runHugo(contentDir, destination) {
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
  return spawnSync(
    'hugo',
    [
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
    ],
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
  for (const fixture of [
    {
      prefix: '',
      heading: 'Everyday writing',
      entry: 'content/ — Page bundles and templates',
      caption: 'A global image resource with known intrinsic dimensions.',
      linkedAlt: 'Linked OINK image remains a link',
    },
    {
      prefix: 'zh',
      heading: '日常写作',
      entry: 'content/ — 页面包与模板',
      caption: '具有已知固有尺寸的全局图片资源。',
      linkedAlt: '带链接的 OINK 图片仍然保持链接',
    },
  ]) {
    const root = path.join(publicDir, fixture.prefix);
    const components = path.join(root, 'docs', 'components');
    const overview = readFileSync(path.join(components, 'index.html'), 'utf8');
    const badgeHTML = readFileSync(
      path.join(components, 'badge', 'index.html'),
      'utf8',
    );
    const kbdHTML = readFileSync(
      path.join(components, 'kbd', 'index.html'),
      'utf8',
    );
    const fieldsHTML = readFileSync(
      path.join(components, 'fields', 'index.html'),
      'utf8',
    );
    const fileTreeHTML = readFileSync(
      path.join(components, 'filetree', 'index.html'),
      'utf8',
    );
    const imageZoomHTML = readFileSync(
      path.join(components, 'image-zoom', 'index.html'),
      'utf8',
    );
    const galleryHTML = readFileSync(
      path.join(components, 'gallery', 'index.html'),
      'utf8',
    );
    const print = readFileSync(
      path.join(root, '_print', 'docs', 'index.html'),
      'utf8',
    );

    assert.match(overview, new RegExp(`<h2 id="everyday">${fixture.heading}`));
    for (const pageName of [
      'badge',
      'kbd',
      'fields',
      'filetree',
      'image-zoom',
      'gallery',
    ]) {
      assert.match(
        overview,
        new RegExp(`href="/(?:zh/)?docs/components/${pageName}/"`),
      );
    }
    assert.match(badgeHTML, /<span class="td-badge td-badge--warning/);
    assert.match(kbdHTML, /<span class="td-kbd-sequence"><kbd>Ctrl<\/kbd>/);
    assert.match(fieldsHTML, /<dl class="td-fields__list"/);
    // FileTree is a plain nested list with the `{.filetree}` marker: no
    // disclosure widgets, no tree roles, folders are nested `<ul>`s.
    assert.match(fileTreeHTML, /<ul class="filetree">/);
    assert.doesNotMatch(fileTreeHTML, /role="tree"|td-filetree|<details/);
    const fileTree = fileTreeHTML.match(
      /<ul class="filetree">[\s\S]*?<\/ul>\s*<\/li>\s*<\/ul>/,
    )?.[0];
    assert.ok(fileTree, 'FileTree lost its nested list');
    assert.ok(fileTree.includes(`<li>${fixture.entry}`));
    assert.ok((fileTree.match(/<ul>/g) || []).length >= 3);
    // Gallery is an image list with the `{.gallery}` marker.
    assert.match(galleryHTML, /<ul class="gallery">/);
    assert.doesNotMatch(galleryHTML, /td-gallery/);
    const galleryList = galleryHTML.match(
      /<ul class="gallery">[\s\S]*?<\/ul>/,
    )?.[0];
    assert.ok(galleryList, 'Gallery lost its image list');
    assert.equal((galleryList.match(/<li><img /g) || []).length, 3);
    assert.ok(galleryList.includes(fixture.caption));
    // Markdown images render through the image hook: figures with captions.
    assert.match(
      imageZoomHTML,
      /<figure class="td-figure"[\s\S]*?<figcaption>[\s\S]*?<\/figcaption>/,
    );
    assert.match(
      imageZoomHTML,
      /<figure class="td-figure td-figure--processed"/,
    );
    assert.equal(
      (imageZoomHTML.match(/data-td-image-zoom-dialog/g) || []).length,
      1,
    );
    assert.equal(
      (galleryHTML.match(/data-td-image-zoom-dialog/g) || []).length,
      1,
    );
    assert.match(
      imageZoomHTML,
      new RegExp(
        `<a href="/(?:zh/)?docs/">\\s*<img[^>]+alt="${fixture.linkedAlt}"`,
      ),
    );

    const markdownByPage = Object.fromEntries(
      ['badge', 'kbd', 'fields', 'filetree', 'image-zoom', 'gallery'].map(
        (name) => [
          name,
          readFileSync(path.join(components, name, 'index.md'), 'utf8'),
        ],
      ),
    );
    assert.match(markdownByPage.badge, /\*\*Beta\*\*/);
    assert.match(markdownByPage.kbd, /Ctrl \+ K/);
    assert.match(markdownByPage.fields, /- `offlineSearch` — `boolean`/);
    // Native list forms stay source Markdown in the Markdown output.
    assert.ok(markdownByPage.filetree.includes(`- ${fixture.entry}`));
    assert.match(markdownByPage.filetree, /^\{\.filetree\}$/m);
    assert.match(markdownByPage.gallery, /^\{\.gallery\}$/m);
    assert.ok(markdownByPage.gallery.includes(fixture.caption));
    for (const markdown of Object.values(markdownByPage)) {
      assert.doesNotMatch(
        markdown,
        /td-badge|td-kbd-sequence|td-fields|td-filetree|td-gallery|td-image-zoom|<ul class=/,
      );
    }

    const printGallery = print.match(/<ul class="gallery">[\s\S]*?<\/ul>/)?.[0];
    assert.ok(printGallery, 'Print output lost the Gallery list');
    const printGalleryImage = printGallery.match(/<img [^>]+>/)?.[0];
    assert.ok(printGalleryImage, 'Print output lost Gallery images');
    assert.doesNotMatch(
      printGalleryImage,
      /data-td-image-zoom|data-zoom-src|data-no-zoom/,
    );
    assert.doesNotMatch(print, /<dialog class="td-image-zoom/);
    assert.match(print, new RegExp(fixture.caption.replaceAll('.', '\\.')));
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
params:
  ui:
    image_zoom:
      enable: true
---

Status {{< badge text="Probe badge" tone="warning" >}}.

Press {{< kbd "Ctrl" "K" >}}.

{{< fields label="Probe fields" >}}
  {{< field name="enabled" type="boolean" default=false required=true >}}
  Static **field description**.
  {{< /field >}}
{{< /fields >}}

- closed/
  - nested.md
{.filetree}

- ![Probe overview](images/content-primitives/oink.webp) — Probe caption one.
- ![Probe feedback](/images/feedback.png) — Probe caption two.
{.gallery}

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
    assert.match(markdown, /- closed\/\n  - nested\.md\n\{\.filetree\}/);
    assert.match(markdown, /!\[Probe overview\]/);
    assert.match(markdown, /— Probe caption one\.\n.*\n\{\.gallery\}/);
    assert.doesNotMatch(markdown, /td-badge|td-filetree|td-gallery|<dialog/);
    assert.match(
      html,
      /<ul class="filetree">\s*<li>closed\/\s*<ul>\s*<li>nested\.md<\/li>/,
    );
    assert.match(
      html,
      /<ul class="gallery">\s*<li><img [^>]*alt="Probe overview"/,
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
    assert.match(print, /<ul class="filetree">/);
    assert.match(print, /<ul class="gallery">/);
    assert.doesNotMatch(print, /td-filetree|td-gallery|<details/);
    assert.match(rss, /&lt;ul class=&#34;filetree&#34;&gt;/);
    assert.doesNotMatch(rss, /td-filetree|td-gallery/);
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true });
  }
});

test('invalid primitive parameters fail with their source position', () => {
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
    assert.notEqual(result.status, 0, 'Invalid primitive unexpectedly built');
    assert.match(output, /tone must be one of/);
    assert.match(output, /content\/docs\/invalid\.md:\d+:/);
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true });
  }
});
