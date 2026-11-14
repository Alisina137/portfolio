import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const projects = JSON.parse(fs.readFileSync(new URL('../content/projects.json', import.meta.url),'utf8'));
const profile = JSON.parse(fs.readFileSync(new URL('../content/profile.json', import.meta.url),'utf8'));

test('featured projects are 4–6 vetted published, distinctly ordered records', () => {
  const published = projects.filter(p => p.publicationStatus === 'published' && p.featuredOrder != null);
  assert.ok(published.length >= 4 && published.length <= 6);
  assert.equal(new Set(published.map(p => p.featuredOrder)).size, published.length);
  assert.ok(published.every(p => p.repoUrlVerified && p.repoUrl.startsWith('https://github.com/Alisina137/')));
});

test('project publication status and product maturity are separate', () => {
  for (const project of projects) {
    assert.ok(project.publicationStatus);
    assert.ok(project.developmentStatus);
    assert.notEqual(project.publicationStatus, project.developmentStatus);
  }
});

test('the source registry never claims unverified commercial releases', () => {
  assert.ok(projects.every(p => p.developmentStatus !== 'released' || p.contentApproval === 'owner_approved'));
  assert.equal(profile.publicEmail, null);
  assert.equal(profile.publicEmailApproved, false);
});

test('all six source repository links are exact, including BazaarLink trailing hyphen', () => {
  assert.equal(projects.find(p => p.slug === 'bazaarlink')?.repoUrl,'https://github.com/Alisina137/bazaar-');
  for (const p of projects) assert.match(p.repoUrl,/^https:\/\/github\.com\/Alisina137\//);
});
