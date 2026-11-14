import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html = fs.readFileSync(new URL('../preview/index.html',import.meta.url), 'utf8');

test('visual preview includes six source-backed cards and no unshipped internal navigation', () => {
  assert.equal((html.match(/class="project-card /g) ?? []).length, 6);
  assert.doesNotMatch(html, /href="\/(projects|about|contact|writing)(\/|\?|"|#)/);
  assert.doesNotMatch(html, /mailto:/);
  assert.doesNotMatch(html, /fake screenshot|testimonial|thousands of users/i);
  assert.match(html, /name="robots" content="noindex,nofollow"/);
});

test('public links in preview are HTTPS GitHub or existing-page anchor/home links', () => {
  for (const match of html.matchAll(/\shref="([^"]+)"/g)) {
    const href=match[1];
    assert.ok(href === '../styles/globals.css' || href === '/' || href.startsWith('#') || /^https:\/\/github\.com\/Alisina137(\/[-a-zA-Z0-9._]+)?$/.test(href), `Unexpected href: ${href}`);
  }
});
