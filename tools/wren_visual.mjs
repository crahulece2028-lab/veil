import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = pathToFileURL(resolve(HERE, "..", "index.html")).href;
const OUT = process.env.WREN_SHOTS || resolve(HERE, "..", ".wren-shots");
const VIEWS = [
  ["discover", null],
  ["matches", '[data-act="tab"][data-v="matches"]'],
  ["you", '[data-act="tab"][data-v="you"]'],
];
const SIZES = [[360, 640], [390, 844], [768, 1024], [1440, 900]];
const browser = await chromium.launch();
const problems = [];

for (const [w, h] of SIZES) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => problems.push(`${w}x${h} ${theme} JS: ${e.message}`));
    await page.goto(FILE);
    await page.evaluate((t) => {
      const x = new Date();
      const today = x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
      localStorage.setItem("wren.state.v1", JSON.stringify({
        v: 1, onboardDone: true, step: 3, tab: "discover",
        me: { name: "Rahul", age: 27, gender: "woman", orientation: "straight", lookingFor: "anyone",
              photos: [portrait("me:0"), portrait("me:1"), portrait("me:2")], prompts: [{ q: "A shower thought I recently had.", a: "Sea otters hold hands while they sleep so they do not drift apart." }], selfie: true, selfieState: "done" },
        form: { code: "", sent: true, openPrompt: null }, swiped: [], likedItems: {},
        matches: [{ id: "m1", pid: "p05", at: Date.now() - 1000, expires: Date.now() + 9e6, msgs: [{ from: "them", text: "ok that is a very specific hill to die on", at: Date.now() - 400000 }], unread: 1, firstMsg: true, gifts: [] },
                 { id: "m2", pid: "p09", at: Date.now() - 1000, expires: Date.now() + 9e6, msgs: [], unread: 0, firstMsg: false, gifts: [] },
                 { id: "m3", pid: "p12", at: Date.now() - 1000, expires: Date.now() + 9e6, msgs: [{ from: "me", text: "hi", at: Date.now() - 90000 }], unread: 0, firstMsg: true, gifts: [] }],
        prefs: { ageMin: 24, ageMax: 40, distance: 25, genders: ["woman", "man", "nonbinary"], seeking: "any" },
        settings: { msgFirst: "anyone", visibility: "everyone", remotePhotos: false, theme: t },
        blocks: [], reports: [], likesUsed: 3, likesDay: today, expiredCount: 0, ui: {},
      }));
    }, theme);
    await page.reload();
    await page.waitForTimeout(600);

    for (const [name, sel] of VIEWS) {
      if (sel) { await page.click(sel); await page.waitForTimeout(500); }
      await page.screenshot({ path: `${OUT}/${w}-${theme}-${name}.png` });

      const overflow = await page.evaluate(() => {
        const bad = [];
        const vw = document.documentElement.clientWidth;
        document.querySelectorAll("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.right > vw + 1.5 || r.left < -1.5) {
            const cs = getComputedStyle(el);
            if (cs.position === "fixed" && cs.transform !== "none") return;
            bad.push(`${el.tagName}.${String(el.className).split(" ")[0]} [${Math.round(r.left)}..${Math.round(r.right)}] vs ${vw}`);
          }
        });
        return [...new Set(bad)].slice(0, 6);
      });
      overflow.forEach((o) => problems.push(`${w}x${h} ${theme} ${name} overflow: ${o}`));

      const hScroll = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (hScroll > 1) problems.push(`${w}x${h} ${theme} ${name}: horizontal scroll ${hScroll}px`);
    }

    /* onboarding at this size, since it is the first thing a visitor sees */
    await page.evaluate(() => { localStorage.clear(); });
    await page.reload();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${w}-${theme}-onboard.png` });
    const obOverflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > vw + 1.5) bad.push(`${el.tagName}.${String(el.className).split(" ")[0]}`);
      });
      return [...new Set(bad)].slice(0, 5);
    });
    obOverflow.forEach((o) => problems.push(`${w}x${h} ${theme} onboard overflow: ${o}`));

    await ctx.close();
  }
}
await browser.close();
console.log("--- LAYOUT PROBLEMS (" + problems.length + ") ---");
[...new Set(problems)].forEach((p) => console.log("  x " + p));
console.log(problems.length === 0 ? "\nALL CLEAN" : "\nDONE WITH ISSUES");
