import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const css = read('styles/type-scale.css');

test('semantic typography is loaded after all existing component rules', () => {
  const layout = read('app/layout.tsx');
  const imports = ['globals.css', 'phase08.css', 'locales.css', 'premium.css', 'type-scale.css'];
  let last = -1;
  for (const file of imports) {
    const current = layout.indexOf('styles/' + file);
    assert.ok(current > last, file + ' should be imported in precedence order');
    last = current;
  }
});

test('all main page title variants use a shared fluid scale', () => {
  for (const className of [
    '.hero h1', '.projects-intro h1', '.case-hero h1', '.identity-intro h1',
    '.contact-hero h1', '.writing-intro h1', '.writing-story-head h1',
    '.section-title-row h2', '.case-section h2', '.feature-row-copy h3',
  ]) assert.ok(css.includes(className), 'missing typography coverage: ' + className);
  for (const token of ['--type-hero:', '--type-page:', '--type-section:', '--type-card:', '--type-body:']) {
    assert.ok(css.includes(token), 'missing semantic type token: ' + token);
  }
  assert.match(css, /--type-page:\s*clamp\(/);
  assert.match(css, /--type-section:\s*clamp\(/);
});

test('important descriptions, small labels and numbers have readable floors', () => {
  for (const selector of [
    '.project-summary', '.section-title-row>p', '.method-card p',
    '.case-section>p', '.feature-row-copy p', '.case-facts strong',
    '.project-metadata', '.feature-row-index', '.method-top', '.capability-number'
  ]) assert.ok(css.includes(selector), 'missing readable override: ' + selector);
  assert.match(css, /--type-body:\s*1rem/);
  assert.match(css, /--type-label:\s*\.8125rem/);
  assert.match(css, /--type-small:\s*\.875rem/);
  assert.match(css, /font-variant-numeric:\s*tabular-nums/);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /html\[dir="rtl"\]/);
  assert.match(css, /text-size-adjust:\s*100%/);
});

test('type scale rules remain balanced and do not embed external resources', () => {
  const scrubbed = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((scrubbed.match(/\{/g) ?? []).length, (scrubbed.match(/\}/g) ?? []).length);
  assert.doesNotMatch(css, /https?:\/\//);
  assert.doesNotMatch(css, /!important.*!important/);
});
