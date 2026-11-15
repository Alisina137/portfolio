import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("root document opts into Next.js smooth-scroll route transition handling", () => {
  const layout = read("app/layout.tsx");
  assert.match(layout, /<html\s+lang=\{locale\}[^>]*data-scroll-behavior="smooth"/);
  // Keep the locale-specific document direction and existing theme bootstrap.
  assert.match(layout, /dir=\{locale === "en" \? "ltr" : "rtl"\}/);
  assert.match(layout, /suppressHydrationWarning/);
});

test("CSS smooth anchor scrolling remains explicitly enabled", () => {
  const stylesheet = read("styles/globals.css");
  assert.match(stylesheet, /html\s*\{\s*scroll-behavior:\s*smooth\s*;/);
  assert.match(stylesheet, /prefers-reduced-motion:\s*reduce/);
});
