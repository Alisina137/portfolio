import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
const pages=['about','contact'];
for (const page of pages) test(`P03 ${page} development-only preview shows complete responsive route structure and no premature claim`,()=>{
  const html=read(`../preview/${page}.html`);
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.match(html,/<main id="main"/);
  assert.match(html,/href="\/about"/);
  assert.match(html,/href="\/contact"/);
  assert.match(html,/href="\/projects"/);
  assert.doesNotMatch(html,/mailto:|<form|href="\/resume\.pdf"|href="\/writing"/);
});
