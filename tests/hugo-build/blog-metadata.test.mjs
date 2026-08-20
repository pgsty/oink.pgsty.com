import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const blogDir = path.join(siteDir, 'content', 'blog');
const sectionMetadata = {
  release: { weight: '10', tags: '[Oink, Release]' },
  oink: { weight: '20', tags: '[Oink]' },
};

function frontMatter(file) {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${path.relative(siteDir, file)} has no YAML front matter`);
  return match[1];
}

function field(frontMatterText, name) {
  return frontMatterText.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1];
}

function articleFiles(section) {
  return readdirSync(path.join(blogDir, section))
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .sort();
}

test('blog section weights are identical in English and Chinese', () => {
  for (const [section, expected] of Object.entries(sectionMetadata)) {
    for (const name of ['_index.md', '_index.zh.md']) {
      const file = path.join(blogDir, section, name);
      assert.equal(
        field(frontMatter(file), 'weight'),
        expected.weight,
        `${path.relative(siteDir, file)} has the wrong section weight`,
      );
    }
  }
});

test('blog article tags use the canonical bilingual values', () => {
  for (const [section, expected] of Object.entries(sectionMetadata)) {
    for (const name of articleFiles(section)) {
      const file = path.join(blogDir, section, name);
      assert.equal(
        field(frontMatter(file), 'tags'),
        expected.tags,
        `${path.relative(siteDir, file)} has the wrong tags`,
      );
    }
  }
});

test('blog translations preserve ordering metadata', () => {
  for (const section of Object.keys(sectionMetadata)) {
    for (const name of articleFiles(section).filter(
      (article) => !article.endsWith('.zh.md'),
    )) {
      const source = path.join(blogDir, section, name);
      const target = source.replace(/\.md$/, '.zh.md');
      assert.ok(
        existsSync(target),
        `${path.relative(siteDir, target)} is missing`,
      );

      const sourceFrontMatter = frontMatter(source);
      const targetFrontMatter = frontMatter(target);
      for (const name of ['date', 'weight', 'tags']) {
        assert.equal(
          field(targetFrontMatter, name),
          field(sourceFrontMatter, name),
          `${path.relative(siteDir, source)} and its translation differ in ${name}`,
        );
      }
    }
  }
});
