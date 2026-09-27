// Layout, tap-target, safe-area and computed-type audit of the Veil prototype.
//
// Run:  npm i -D playwright && npx playwright install chromium
//       node tools/prototype_audit.mjs prototype
// Exit: 0 if every screen passes, 1 otherwise.
//
// Eyeballing a design system does not scale. This walks every screen in
// both themes and asserts the things that actually break: horizontal
// overflow, sub-44pt tap targets, content under the notch or the home
// indicator, and type that silently fell back to a system font because
// the webfont failed to load.
//
// This is the only script here with a dependency. tools/prototype_check.mjs
// covers routes and invariants with none.

import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    'This audit needs Playwright, which is not installed here.\n' +
    '  npm i -D playwright && npx playwright install chromium\n' +
    'Or run the dependency-free checks instead:\n' +
    '  node tools/prototype_check.mjs',
  );
  process.exit(2);
}

const dir = process.argv[2] || '.';
const url = pathToFileURL(join(dir, 'index.html')).href;

const MIN_TAP = 44;
const ALLOWED_TAP_EXCEPTIONS = new Set(['INPUT']);

const browser = await chromium.launch();
const problems = [];
const note = (screen, theme, msg) => problems.push(`[${screen} / ${theme}] ${msg}`);

for (const theme of ['dark', 'light']) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1040 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
  await page.waitForTimeout(600);

  const fonts = await page.evaluate(() => ({
    loaded: document.fonts ? document.fonts.status : 'unsupported',
    families: [...new Set([...document.fonts].map((f) => f.family))].sort(),
  }));

  const routes = await page.evaluate(() =>
    [...document.querySelectorAll('.rail__item')].map((b) => b.dataset.go));

  for (const route of routes) {
    await page.evaluate((r) => {
      [...document.querySelectorAll('.rail__item')].find((b) => b.dataset.go === r).click();
    }, route);
    await page.waitForTimeout(320);

    const r = await page.evaluate((args) => {
      const [minTap] = args;
      const screen = document.querySelector('#screen');
      const sb = screen.getBoundingClientRect();
      const out = { overflowX: [], smallTaps: [], underNotch: [], underHome: [], outOfBounds: [], fontKinds: new Set() };

      for (const el of screen.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;

        if (el.scrollWidth > el.clientWidth + 1 && /auto|scroll/.test(cs.overflowX)) {
          out.overflowX.push(`${el.className || el.tagName} scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}`);
        }
        if (r.right > sb.right + 1 || r.left < sb.left - 1) {
          out.outOfBounds.push(`${el.className || el.tagName} (${Math.round(r.left - sb.left)}..${Math.round(r.right - sb.right)})`);
        }
        if (el.tagName === 'BUTTON' || el.tagName === 'A') {
          if (el.classList.contains('rail__item')) continue;
          if (el.offsetParent === null && cs.position !== 'fixed') continue;
          if (r.height < minTap - 0.5 || r.width < minTap - 0.5) {
            out.smallTaps.push(`${el.className || el.tagName} ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
        }
        const tag = el.querySelector('.type-letter, .type-letter-small, .type-letter-italic, .type-signature');
        if (tag) out.fontKinds.add(getComputedStyle(tag).fontFamily);
        if (r.top < 47 - 1 && r.height > 4 && cs.position === 'fixed') out.underNotch.push(el.className || el.tagName);
        if (r.bottom > 844 - 20 && r.height > 4 && cs.position === 'fixed') out.underHome.push(el.className || el.tagName);
      }
      return {
        overflowX: out.overflowX,
        smallTaps: out.smallTaps,
        outOfBounds: out.outOfBounds,
        underNotch: out.underNotch,
        underHome: out.underHome,
        fontKinds: [...out.fontKinds],
      };
    }, [MIN_TAP]);

    for (const x of r.overflowX) note(route, theme, `horizontal overflow: ${x}`);
    for (const x of r.outOfBounds) note(route, theme, `element outside the device frame: ${x}`);
    for (const x of r.smallTaps) note(route, theme, `tap target under 44pt: ${x}`);
    for (const x of r.underNotch) note(route, theme, `fixed element under the notch: ${x}`);
    for (const x of r.underHome) note(route, theme, `fixed element under the home indicator: ${x}`);
    for (const f of r.fontKinds) {
      if (!/Newsreader/i.test(f)) note(route, theme, `serif content fell back to ${f}`);
    }
  }

  console.log(`\n${theme.toUpperCase()}  ${routes.length} screens walked`);
  console.log(`  webfonts: ${fonts.loaded}  families: ${fonts.families.join(', ') || 'none'}`);
  await page.close();
}

await browser.close();

console.log();
if (problems.length) {
  const seen = new Set();
  for (const p of problems) {
    const key = p.replace(/^\[[^\]]+\] /, '');
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  FAIL  ${p}`);
  }
  console.log(`\n${problems.length} problem(s) across ${seen.size} distinct class(es).`);
  process.exit(1);
}
console.log('No layout, tap-target, safe-area or font-fallback problems found.');
