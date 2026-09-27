import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = pathToFileURL(resolve(HERE, "..", "index.html")).href;
const browser = await chromium.launch();
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

/* Installed in the page: a colour parser that understands every notation the
   app and Chrome produce, plus alpha compositing up the ancestor chain. */
const PROBE = () => {
  const parse = (str) => {
    if (!str) return null;
    const s = str.trim();
    let m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) { const p = m[1].split(/[,/\s]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = s.match(/^color\(srgb\s+([^)]+)\)$/i);
    if (m) {
      const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
      return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p.length > 3 ? p[3] : 1 };
    }
    if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
    m = s.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
      let h = m[1];
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      const n = parseInt(h.slice(0, 6), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
    }
    return null;
  };
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  /* Walk up compositing every translucent layer, so a 88% opaque topbar is
     measured against what it really looks like. */
  const effectiveBg = (el) => {
    const layers = [];
    let n = el;
    while (n && n.nodeType === 1) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 0.999) break; }
      n = n.parentElement;
    }
    let base = parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    let out = { ...base, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) out = over(layers[i], out);
    return out;
  };
  window.__audit = (opts) => {
    const out = [];
    document.querySelectorAll("h1,h2,h3,p,small,b,strong,span,dt,dd,button,label,li,time,em").forEach((el) => {
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) return;
      if (opts.skip && el.closest(opts.skip)) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const fg = parse(cs.color);
      if (!fg) return;
      const bg = effectiveBg(el);
      const size = parseFloat(cs.fontSize);
      const weight = +cs.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const cr = ratio(over(fg, bg), bg);
      const need = large ? 3 : 4.5;
      if (cr < need) {
        out.push(`${el.tagName}.${String(el.className).split(" ")[0] || "-"} ${cr.toFixed(2)}:1 need ${need} size ${size} "${(el.textContent || "").trim().slice(0, 34)}"`);
      }
    });
    return [...new Set(out)];
  };
  /* White card copy sits on a dark gradient scrim over a photo, which no
     ancestor background can express. The scrim fades out towards the top, so
     sample its alpha at each text block's own position. The photo base is the
     lightest tone the generated portraits use, which is the worst case. */
  window.__scrim = () => {
    const grad = document.querySelector(".dcard__grad");
    const info = document.querySelector(".dcard__info");
    if (!grad || !info) return { present: false, fails: ["no scrim"] };
    const gr = grad.getBoundingClientRect();
    /* read the real stops, never a hardcoded copy: `to top` means 0% is the
       bottom edge, which is the direction the scrim is strongest */
    const img = getComputedStyle(grad).backgroundImage;
    const STOPS = (img.match(/rgba?\([^)]+\)(\s*-?[\d.]+%)?/g) || []).map((chunk) => {
      const c = parse(chunk.match(/rgba?\([^)]+\)/)[0]);
      const pct = chunk.match(/(-?[\d.]+)%/);
      return { at: pct ? parseFloat(pct[1]) / 100 : null, a: c ? c.a : 0 };
    }).filter((s) => s.a !== null);
    if (!STOPS.length) return { present: false, fails: ["could not read gradient stops"] };
    for (let i = 0; i < STOPS.length; i++) if (STOPS[i].at === null) STOPS[i].at = i / (STOPS.length - 1);
    STOPS.sort((a, b) => a.at - b.at);
    const alphaAt = (t) => {
      if (t <= STOPS[0].at) return STOPS[0].a;
      for (let i = 1; i < STOPS.length; i++) {
        if (t <= STOPS[i].at) {
          const f = (t - STOPS[i - 1].at) / (STOPS[i].at - STOPS[i - 1].at);
          return STOPS[i - 1].a + f * (STOPS[i].a - STOPS[i - 1].a);
        }
      }
      return 0;
    };
    const PHOTO = { r: 234, g: 224, b: 199, a: 1 };
    const res = [];
    info.querySelectorAll(".dcard__name,.dcard__meta,.dcard__prompt,.dcard__prompt b,.dcard__tap").forEach((el) => {
      const cs = getComputedStyle(el);
      const fg = parse(cs.color);
      const r = el.getBoundingClientRect();
      if (r.height < 2) return;
      const t = (gr.bottom - r.top) / gr.height;
      const a = alphaAt(t);
      const bg = over({ r: 20, g: 18, b: 16, a }, PHOTO);
      const cr = ratio(over(fg, bg), bg);
      const size = parseFloat(cs.fontSize);
      const weight = +cs.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      if (cr < need) res.push(`${el.className || "prompt-b"} ${cr.toFixed(2)}:1 need ${need} at scrim a=${a.toFixed(2)}`);
    });
    return { present: true, fails: [...new Set(res)] };
  };
};

const seed = (page, theme, tab) => page.evaluate(([t, tb]) => {
  const x = new Date();
  const today = x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  localStorage.setItem("wren.state.v1", JSON.stringify({
    v: 1, onboardDone: true, step: 3, tab: tb,
    me: { name: "Rahul", age: 27, gender: "woman", orientation: "straight", lookingFor: "anyone",
          photos: [portrait("me:0"), portrait("me:1"), portrait("me:2")],
          prompts: [{ q: "A shower thought I recently had.", a: "Sea otters hold hands while they sleep so they do not drift apart." }], selfie: true, selfieState: "done" },
    form: { code: "", sent: true, openPrompt: null }, swiped: [], likedItems: {},
    matches: [{ id: "m1", pid: "p05", at: Date.now() - 1000, expires: Date.now() + 9e6, msgs: [{ from: "them", text: "ok that is a very specific hill to die on", at: Date.now() - 400000 }], unread: 1, firstMsg: true, gifts: [] },
              { id: "m2", pid: "p09", at: Date.now() - 1000, expires: Date.now() + 9e6, msgs: [], unread: 0, firstMsg: false, gifts: [] },
              { id: "m3", pid: "p12", at: Date.now() - 1000, expires: Date.now() + 9e6, msgs: [{ from: "me", text: "hi", at: Date.now() - 90000 }], unread: 0, firstMsg: true, gifts: [] }],
    prefs: { ageMin: 24, ageMax: 40, distance: 25, genders: ["woman", "man", "nonbinary"], seeking: "any" },
    settings: { msgFirst: "anyone", visibility: "everyone", remotePhotos: false, theme: t },
    blocks: [], reports: [], likesUsed: 3, likesDay: today, expiredCount: 0, ui: {},
  }));
}, [theme, tab]);

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fails.push(`${theme} JS: ${e.message}`));
  await page.goto(FILE);
  await page.addInitScript(PROBE);
  await seed(page, theme, "discover");
  await page.reload();
  await page.waitForTimeout(650);

  const scrim = await page.evaluate(() => window.__scrim());
  ok(scrim.present, `${theme} discover: card scrim missing`);
  (scrim.fails || []).forEach((f) => fails.push(`${theme} card on photo: ${f}`));

  for (const tab of ["discover", "matches", "you"]) {
    if (tab !== "discover") { await page.click(`[data-act="tab"][data-v="${tab}"]`); await page.waitForTimeout(500); }
    const bad = await page.evaluate(() => window.__audit({ skip: ".dcard__info" }));
    bad.forEach((b) => fails.push(`${theme} ${tab}: ${b}`));
  }

  /* sheets share the same tokens, so check the ones that render muted copy */
  await page.click('[data-act="tab"][data-v="you"]');
  await page.waitForTimeout(400);
  for (const s of ["settings", "blocks", "photos"]) {
    const sel = `[data-act="sheet"][data-v="${s}"]`;
    if (await page.locator(sel).count()) {
      await page.click(sel);
      await page.waitForTimeout(400);
      const bad = await page.evaluate(() => window.__audit({ skip: null }));
      bad.forEach((b) => fails.push(`${theme} sheet ${s}: ${b}`));
      await page.click('[data-act="sheet-close"]');
      await page.waitForTimeout(300);
    }
  }
  await ctx.close();
}
await browser.close();
console.log("--- PROBLEMS (" + fails.length + ") ---");
[...new Set(fails)].forEach((f) => console.log("  x " + f));
console.log(fails.length === 0 ? "\nALL CLEAN" : "\nDONE WITH ISSUES");
