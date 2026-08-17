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
      entry: 'Page bundles and templates',
      caption: 'A global image resource with known intrinsic dimensions.',
      linkedAlt: 'Linked OINK image remains a link',
    },
    {
      prefix: 'zh',
      heading: '日常写作',
      entry: '页面包与模板',
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
    // FileTree is the ```filetree fence: a td-filetree panel with a title bar,
    // native <details> directories, an aligned comment column and no tree role.
    assert.doesNotMatch(fileTreeHTML, /role="tree"|<ul class="filetree">/);
    const fileTree = fileTreeHTML.match(
      /<div class="td-filetree" style="--td-filetree-name-col:[\s\S]*?<\/ul><\/div><\/div>/,
    )?.[0];
    assert.ok(fileTree, 'FileTree lost its panel');
    assert.match(fileTree, /<p class="td-filetree__title" id="td-filetree-/);
    assert.match(fileTree, /<details class="td-filetree__details" open><summary class="td-filetree__summary">/);
    assert.match(fileTree, /<details class="td-filetree__details"><summary/); // {open=false}
    assert.ok(
      fileTree.includes(
        `<span class="td-filetree__hash" aria-hidden="true">#</span><span class="td-filetree__comment-text">${fixture.entry}</span>`,
      ),
    );
    assert.match(fileTree, /<span class="td-filetree__name" title="content\/">content\/<\/span>/);
    assert.match(fileTree, /<i class="fa-brands fa-markdown td-filetree__glyph"><\/i>/);
    assert.match(fileTree, /<i class="fa-solid fa-scale-balanced td-filetree__glyph"><\/i>/); // LICENSE
    assert.equal((fileTree.match(/<details/g) || []).length, 4);
    assert.equal((fileTree.match(/<ul/g) || []).length, (fileTree.match(/<\/ul>/g) || []).length);
    // The tree-output example and the plain (comment-less) variant render too.
    assert.match(fileTreeHTML, /<span class="td-filetree__name" title="\.">\.<\/span>/);
    assert.match(fileTreeHTML, /td-filetree td-filetree--plain/);
    // Gallery is a data fence rendered by the theme, so the grid, the per-item
    // attributes and the Zoom markers are all theme-generated markup.
    assert.match(galleryHTML, /<ul class="td-gallery/);
    assert.doesNotMatch(galleryHTML, /<ul class="gallery"/);
    const galleryList = galleryHTML.match(
      /<ul class="td-gallery[^"]*">[\s\S]*?<\/ul>/,
    )?.[0];
    assert.ok(galleryList, 'Gallery lost its grid');
    assert.equal(
      (galleryList.match(/<li class="td-gallery__item"/g) || []).length,
      3,
    );
    assert.equal(
      (galleryList.match(/class="td-gallery__image"/g) || []).length,
      3,
    );
    assert.ok(galleryList.includes(fixture.caption));
    // Markdown images render through the image hook: figures with captions.
    assert.match(
      imageZoomHTML,
      /<figure class="td-figure"[\s\S]*?<figcaption>[\s\S]*?<\/figcaption>/,
    );
    // A processed image is an ordinary figure now: the `image` shortcode and
    // its `td-figure--processed` class are gone, and the Zoom marker carries
    // the full-size original so the dialog never shows the derivative.
    assert.doesNotMatch(imageZoomHTML, /td-figure--processed/);
    assert.match(imageZoomHTML, /data-td-image-zoom="[^"]+\.webp"/);
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
    // Native list forms and the filetree fence stay source Markdown.
    assert.ok(markdownByPage.filetree.includes(`# ${fixture.entry}`));
    assert.match(markdownByPage.filetree, /^```filetree \{title="[^"]+"\}$/m);
    assert.doesNotMatch(markdownByPage.filetree, /^\{\.filetree\}$/m);
    assert.match(markdownByPage.gallery, /^```gallery$/m);
    assert.doesNotMatch(markdownByPage.gallery, /^\{\.gallery\}$/m);
    assert.ok(markdownByPage.gallery.includes(fixture.caption));
    for (const markdown of Object.values(markdownByPage)) {
      assert.doesNotMatch(
        markdown,
        // Rendered component markup, not the class names themselves: a guide
        // may legitimately name `td-gallery` in prose.
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
