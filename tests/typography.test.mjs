import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("self-hosted variable fonts are versioned and imported at root", () => {
  const deps = JSON.parse(read("package.json")).dependencies;
  assert.equal(deps["@fontsource-variable/manrope"], "5.3.0");
  assert.equal(deps["@fontsource-variable/vazirmatn"], "5.3.0");
  const layout=read("app/layout.tsx");
  assert.match(layout, /@fontsource-variable\\/manrope\\/wght\\.css/);
  assert.match(layout, /@fontsource-variable\\/vazirmatn\\/wght\\.css/);
  assert.doesNotMatch(layout, /fonts\\.googleapis\\.com/);
});

test("all English sections use a soft, consistent real typeface", () => {
  const global = read("styles/globals.css");
  const premium=read("styles/premium.css");
  for (const css of [global, premium]) {
    assert.match(css, /--font-text:.*Manrope Variable/);
    assert.match(css, /--font-display:.*Manrope Variable/);
  }
  assert.match(global, /input, textarea, select \\{ font-family: inherit; \\}/);
  assert.match(premium, /\\.hero h1 \\{font-weight:750;letter-spacing:-\\.057em/);
  assert.match(premium, /\\.feature-row-copy h3 \\{[^}]+font-weight:700/);
});

test("Dari and Pashto share Arabic-script font with natural character spacing", () => {
  const css=read("styles/locales.css");
  assert.match(css, /html\\[dir="rtl"\\]\\{--font-text:"Vazirmatn Variable"/);
  assert.match(css, /html\\[dir="rtl"\\] body\\{font-family:var\\(--font-text\\);line-height:1\\.85;letter-spacing:0/);
  assert.match(css, /html\\[dir="rtl"\\] :is\\(button,input,select,textarea\\)/);
  assert.doesNotMatch(css, /font-family:Tahoma,"Noto Naskh Arabic"/);
});
