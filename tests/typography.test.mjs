import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const has = (source, expected) => assert.ok(source.includes(expected), 'Missing typography rule: ' + expected);

test('variable fonts are self-hosted and version-pinned', () => {
  const deps = JSON.parse(read('package.json')).dependencies;
  assert.equal(deps['@fontsource-variable/manrope'], '5.3.0');
  assert.equal(deps['@fontsource-variable/vazirmatn'], '5.3.0');
  const layout = read('app/layout.tsx');
  has(layout, '@fontsource-variable/manrope/wght.css');
  has(layout, '@fontsource-variable/vazirmatn/wght.css');
  assert.ok(!layout.includes('fonts.googleapis.com'));
});

test('English pages use a consistently softened Manrope type scale', () => {
  const global = read('styles/globals.css');
  const premium = read('styles/premium.css');
  for (const css of [global, premium]) {
    has(css, '--font-text:');
    has(css, 'Manrope Variable');
    has(css, '--font-display:');
  }
  has(global, 'input, textarea, select { font-family: inherit; }');
  has(premium, '.hero h1 {font-weight:750;letter-spacing:-.057em');
  has(premium, '.feature-row-copy h3 {');
  has(premium, 'letter-spacing:-.038em;font-weight:700');
});

test('Dari/Pashto have a dedicated smooth RTL font and natural shaping', () => {
  const css = read('styles/locales.css');
  has(css, 'html[dir="rtl"]{--font-text:"Vazirmatn Variable"');
  has(css, 'line-height:1.85;letter-spacing:0');
  has(css, 'html[dir="rtl"] :is(button,input,select,textarea)');
  assert.ok(!css.includes('font-family:Tahoma,"Noto Naskh Arabic"'));
});
