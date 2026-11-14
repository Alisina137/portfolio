import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html = fs.readFileSync(new URL('../preview/index.html',import.meta.url), 'utf8');
const catalog = fs.readFileSync(new URL('../preview/catalog.html',import.meta.url),'utf8');

test('P02 home development preview shows six linked cases with actual Projects destination', () => {
  assert.equal((html.match(/class="project-card /g) ?? []).length, 6);
  assert.match(html,/href="\/projects"/);
  assert.match(html,/href="\/projects\/maktablink"/);
  assert.doesNotMatch(html, /href="\/(about|contact|writing)(\/|\?|"|#)/);
  assert.doesNotMatch(html, /mailto:|testimonial|thousands of users/i);
  assert.match(html, /name="robots" content="noindex,nofollow"/);
});

test('P02 catalog development-only preview includes category filters, 6 cases, and no misleading screenshots',()=>{
  assert.match(catalog,/Search projects/);
  assert.match(catalog,/Browse by category/);
  assert.equal((catalog.match(/project-card--catalog/g)??[]).length,6);
  assert.match(catalog,/CONCEPTUAL ARTWORK/);
  assert.doesNotMatch(catalog, /href="\/(about|contact|writing)(\/|\?|"|#)/);
});
