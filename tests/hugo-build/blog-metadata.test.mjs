import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const blogDir = path.join(siteDir, 'content', 'blog');
const releaseDir = path.join(siteDir, 'content', 'release');

function frontMatter(file) {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${path.relative(siteDir, file)} has no YAML front matter`);
  return match[1];
}

function field(frontMatterText, name) {
  return frontMatterText.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1];
}

function sectionArticles(dir) {
  const files = [];
  for (const name of readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      for (const child of ['index.md', 'index.zh.md']) {
        const p = path.join(full, child);
        if (existsSync(p)) files.push(p);
      }
    } else if (name.endsWith('.md') && !name.startsWith('_')) {
      files.push(full);
    }
  }
  return files;
}

test('blog and release section weights are identical in English and Chinese', () => {
  for (const [dir, expectedWeight] of [
    [blogDir, '50'],
    [releaseDir, '60'],
  ]) {
    for (const name of ['_index.md', '_index.zh.md']) {
      const file = path.join(dir, name);
      assert.equal(
        field(frontMatter(file), 'weight'),
        expectedWeight,
        `${path.relative(siteDir, file)} has the wrong section weight`,
      );
    }
  }
});

test('release notes use canonical bilingual version-line tags', () => {
  for (const file of sectionArticles(releaseDir)) {
    const base = path.basename(file);
    const isZh = base.endsWith('.zh.md');
    const ver = isZh ? base.slice(0, -6) : base.slice(0, -3);
    const line = ver.startsWith('1.') ? 'v1.x' : 'v0.x';
    const expected = isZh ? `[版本发布, ${line}]` : `[Release, ${line}]`;
    assert.equal(
      field(frontMatter(file), 'tags'),
      expected,
      `${path.relative(siteDir, file)} has the wrong tags`,
    );
  }
});

test('blog and release translations preserve ordering metadata', () => {
  for (const dir of [blogDir, releaseDir]) {
    for (const source of sectionArticles(dir).filter(
      (file) => !file.endsWith('.zh.md'),
    )) {
      const target = source.replace(/\.md$/, '.zh.md');
      assert.ok(
        existsSync(target),
        `${path.relative(siteDir, target)} is missing`,
      );

      const sourceFrontMatter = frontMatter(source);
      const targetFrontMatter = frontMatter(target);
      for (const key of ['date', 'weight', 'series']) {
        assert.equal(
          field(targetFrontMatter, key),
          field(sourceFrontMatter, key),
          `${path.relative(siteDir, source)} and its translation differ in ${key}`,
        );
      }
    }
  }
});
