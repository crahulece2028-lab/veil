import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));

const FILE = pathToFileURL(resolve(HERE, "..", "index.html")).href;
const KEY = "wren.state.v1";
const fails = [];
const errors = [];
const ok = (c, m) => { if (!c) fails.push(m); };

const browser = await chromium.launch();
let trap = null;
let step = 0;

async function fresh(page, patch) {
  const TODAY = (() => { const x = new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); })();
  await page.goto(FILE);
  await page.evaluate(([k, extra, today]) => {
    const base = {
      v: 1, onboardDone: true, step: 3, tab: "discover",
      me: { name: "Rahul", age: 27, gender: "woman", orientation: "straight", lookingFor: "anyone",
            photos: [portrait("me:0"), portrait("me:1")], prompts: [{ q: "We will get along if", a: "x" }], selfie: true, selfieState: "done" },
      form: { code: "", sent: true, openPrompt: null }, swiped: [], likedItems: {}, matches: [],
      prefs: { ageMin: 24, ageMax: 40, distance: 25, genders: ["woman", "man", "nonbinary"], seeking: "any" },
      settings: { msgFirst: "anyone", visibility: "everyone", remotePhotos: false, theme: "light" },
      blocks: [], reports: [], likesUsed: 0, likesDay: today, expiredCount: 0, ui: {},
    };
    localStorage.setItem(k, JSON.stringify(Object.assign(base, extra)));
  }, [KEY, patch || {}, TODAY]);
  await page.reload();
  await page.waitForTimeout(450);
}

try {
  /* ============ A. match expiry removes the match and counts it ============ */
  step = "A expiry";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("A: " + e.message));
    await fresh(page, {
      matches: [{ id: "m1", pid: "p09", at: Date.now() - 1000, expires: Date.now() + 2000,
                  msgs: [], unread: 0, firstMsg: false, gifts: [] }],
      expiredCount: 0,
    });
    await page.click('[data-act="tab"][data-v="matches"]');
    await page.waitForTimeout(300);
    ok((await page.locator(".mrow").count()) === 1, "A: seeded expiring match not shown");
    await page.waitForTimeout(2600);
    const rows = await page.locator(".mrow").count();
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    ok(rows === 0, `A: expired match was not removed from the list (${rows} rows)`);
    ok(st.expiredCount === 1, `A: expiredCount is ${st.expiredCount}, expected 1`);
    ok(st.matches.length === 0, "A: expired match still in state");
    ok(/expired without a first message/.test(await page.locator(".note").first().innerText()), "A: expiry note not shown");
    await page.close();
  }

  /* ============ B. a match with a first message never expires ============ */
  step = "B active survives";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("B: " + e.message));
    await fresh(page, {
      matches: [{ id: "m1", pid: "p09", at: Date.now() - 9000, expires: Date.now() + 1500,
                  msgs: [{ from: "me", text: "hi", at: Date.now() - 1000 }], unread: 0, firstMsg: true, gifts: [] }],
    });
    await page.click('[data-act="tab"][data-v="matches"]');
    await page.waitForTimeout(2600);
    ok((await page.locator(".mrow").count()) === 1, "B: an active match was wrongly expired");
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    ok(st.expiredCount === 0, "B: active match counted as expired");
    await page.close();
  }

  /* ============ C. daily like quota ============ */
  step = "C quota";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("C: " + e.message));
    await fresh(page, { likesUsed: 25 });
    await page.waitForTimeout(200);
    ok(/0\s*likes left today/.test((await page.locator(".quota").innerText()).replace(/\s+/g, " ")), "C: quota should read 0 left");
    await page.click('[data-act="swipe"][data-v="like"]');
    await page.waitForTimeout(400);
    ok(await page.locator(".modal").count() > 0, "C: liking past the limit did not open the limit modal");
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    ok(st.likesUsed === 25, `C: likesUsed incremented past the cap to ${st.likesUsed}`);
    await page.click('[data-act="limit-ok"]');
    await page.waitForTimeout(300);
    ok(await page.locator(".modal").count() === 0, "C: limit modal did not dismiss");
    /* passing must still work at the cap */
    const before = await page.locator(".dcard--top .dcard__name").first().innerText();
    await page.click('[data-act="swipe"][data-v="pass"]');
    await page.waitForTimeout(600);
    ok((await page.locator(".dcard--top .dcard__name").first().innerText()) !== before, "C: pass blocked at the like cap");
    /* the upgrade button must not pretend to charge */
    await page.click('[data-act="swipe"][data-v="like"]');
    await page.waitForTimeout(400);
    await page.click('[data-act="upgrade"]');
    await page.waitForTimeout(300);
    ok(/no card is asked for|nothing is charged|No payments/i.test(await page.locator(".match__exp, .toast").first().innerText()), "C: missing no-payment disclosure");
    await page.close();
  }

  /* ============ D. quota resets on a new day ============ */
  step = "D daily reset";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("D: " + e.message));
    await fresh(page, { likesUsed: 25, likesDay: "definitely-not-today" });
    await page.waitForTimeout(300);
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    ok(st.likesUsed === 0, `D: likes not reset for a new day (${st.likesUsed})`);
    ok(/^\d{4}-\d{2}-\d{2}$/.test(st.likesDay), `D: likesDay not a YYYY-MM-DD key (${st.likesDay})`);
    await page.close();
  }

  /* ============ E. undo removes a match it created ============ */
  step = "E undo match";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("E: " + e.message));
    await fresh(page, {});
    /* walk the deck until we like someone who already liked us */
    /* Like one card at a time, waiting for the fly-out and the deferred match
       modal, so the undo assertion targets the swipe that actually matched. */
    let matched = false;
    for (let i = 0; i < 13; i++) {
      await page.click('[data-act="swipe"][data-v="like"]');
      const appeared = await page.waitForSelector(".modal", { timeout: 2200 })
        .then(() => true).catch(() => false);
      if (appeared) { matched = true; break; }
      await page.waitForTimeout(350);
    }
    ok(matched, "E: never produced a match to undo");
    if (matched) {
      const pre = await page.evaluate(() => ({
        matches: state.matches.length, swiped: state.swiped.length,
        likesUsed: state.likesUsed, order: state.order.length,
        last: state.swiped[state.swiped.length - 1], matchId: state.matches[0].id,
      }));
      ok(pre.last.matchId === pre.matchId, `E: the newest swipe is not the one that matched (${JSON.stringify(pre.last)})`);
      await page.click('[data-act="closematch"]');
      await page.waitForTimeout(300);
      await page.click('[data-act="undo"]');
      await page.waitForTimeout(400);
      const st = await page.evaluate(() => JSON.parse(JSON.stringify(state)));
      ok(st.matches.length === pre.matches - 1, `E: undo did not remove the new match (${st.matches.length} vs ${pre.matches - 1})`);
      ok(!st.matches.some((m) => m.id === pre.matchId), "E: undone match still present");
      ok(st.swiped.length === pre.swiped - 1, `E: swipe log not trimmed (${st.swiped.length} vs ${pre.swiped - 1})`);
      ok(st.likesUsed === pre.likesUsed - 1, `E: like not refunded (${st.likesUsed} vs ${pre.likesUsed - 1})`);
      ok(st.order.length === pre.order + 1, `E: deck not restored (${st.order.length} vs ${pre.order + 1})`);
      ok(st.order[0] === pre.last.id, `E: undone card not put back at the front (${st.order[0]} vs ${pre.last.id})`);
    }
    await page.close();
  }

  /* ============ F. report hides the profile and any match ============ */
  step = "F report";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("F: " + e.message));
    await fresh(page, {
      matches: [{ id: "mX", pid: "p01", at: Date.now() - 1000, expires: Date.now() + 9e6,
                  msgs: [], unread: 0, firstMsg: true, gifts: [] }],
    });
    await page.click('[data-act="tab"][data-v="matches"]');
    await page.waitForTimeout(300);
    await page.locator(".mrow").first().click();
    await page.waitForTimeout(350);
    await page.click('[data-act="chatmenu"]');
    await page.waitForTimeout(300);
    await page.locator('[data-act="report"]').click();
    await page.waitForTimeout(300);
    ok(await page.locator(".sheet__p").count() > 0, "F: report sheet did not open");
    ok(/safety review/i.test(await page.locator(".sheet__b").innerText()), "F: report sheet lacks the disclosure");
    await page.locator('[data-act="doreport"]').nth(1).click();
    await page.waitForTimeout(400);
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    ok(st.reports.length === 1, `F: report not recorded (${st.reports.length})`);
    ok(st.reports[0].pid === "p01", "F: report recorded against the wrong profile");
    ok(st.matches.length === 0, "F: reporting did not remove the match");
    ok(!st.order.includes("p01"), "F: reported profile still in the deck");
    /* and it must not reappear after a reload */
    await page.reload();
    await page.waitForTimeout(400);
    await page.click('[data-act="tab"][data-v="matches"]');
    await page.waitForTimeout(300);
    ok((await page.locator(".mrow").count()) === 0, "F: reported match returned after reload");
    await page.close();
  }

  /* ============ G. block removes from deck and matches ============ */
  step = "G block";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("G: " + e.message));
    await fresh(page, {});
    await page.click('[data-act="tab"][data-v="you"]');
    await page.waitForTimeout(300);
    await page.click('[data-act="sheet"][data-v="blocks"]');
    await page.waitForTimeout(300);
    ok(/Nobody blocked/.test(await page.locator(".sheet__b").innerText()), "G: empty block list text wrong");
    await page.click('[data-act="sheet-close"]');
    await page.waitForTimeout(250);
    await page.evaluate(() => { state.blocks = ["p01"]; save(); });
    await page.reload();
    await page.waitForTimeout(450);
    await page.click('[data-act="tab"][data-v="you"]');
    await page.waitForTimeout(300);
    await page.click('[data-act="sheet"][data-v="blocks"]');
    await page.waitForTimeout(300);
    ok(await page.locator('.sheet__b .listrow').count() === 1, "G: block list did not show the blocked person");
    ok(await page.locator('.sheet__b [data-act="unblock"]').count() === 1, "G: blocked person has no unblock control");
    ok(/Blocked/.test(await page.locator(".sheet__b").innerText()), "G: block list does not label the entry");
    await page.click('[data-act="unblock"]');
    await page.waitForTimeout(300);
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    ok(st.blocks.length === 0, "G: unblock did not remove the entry");
    ok(/Nobody blocked/.test(await page.locator(".sheet__b").innerText()), "G: block list not empty after unblock");
    await page.close();
  }

  /* ============ H. blocked profiles never enter the deck ============ */
  step = "H block filters deck";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("H: " + e.message));
    await fresh(page, { blocks: ["p01", "p02", "p03"] });
    await page.waitForTimeout(200);
    const names = await page.locator(".dcard--next, .dcard--next2, .dcard--top .dcard__name").allInnerTexts();
    ok(!names.join("|").includes("Maya") && !names.join("|").includes("Theo") && !names.join("|").includes("Priya"),
       `H: blocked profiles surfaced in the deck: ${names.join("|")}`);
    await page.close();
  }

  /* ============ I. filters actually filter ============ */
  step = "I filters";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("I: " + e.message));
    await fresh(page, {});
    const all = await page.locator(".dcard").count();
    await page.click('[data-act="sheet"][data-v="filters"]');
    await page.waitForTimeout(300);
    /* only men */
    for (const g of ["woman", "nonbinary"]) { await page.locator(`[data-act="gpref"][data-v="${g}"]`).click(); await page.waitForTimeout(120); }
    await page.click('[data-act="sheet-close"]');
    await page.waitForTimeout(350);
    const first = await page.locator(".dcard--top .dcard__name").first().innerText();
    ok(!/Maya|Priya|Camille|Nadia|Grace|Iris|Amara/.test(first), `I: gender filter leaked "${first}"`);
    /* age floor above every profile */
    await page.click('[data-act="sheet"][data-v="filters"]');
    await page.waitForTimeout(300);
    await page.locator('[data-r="ageMin"]').fill("60");
    await page.click('[data-act="sheet-close"]');
    await page.waitForTimeout(350);
    ok(await page.locator(".dcard--top").count() === 0, "I: age filter did not empty the deck");
    ok(/That's everyone for now/.test(await page.locator(".empty h2").first().innerText()), "I: empty deck state missing");
    await page.close();
  }

  /* ============ J. distance filter ============ */
  step = "J distance";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("J: " + e.message));
    await fresh(page, { prefs: { ageMin: 24, ageMax: 40, distance: 2, genders: ["woman", "man", "nonbinary"], seeking: "any" } });
    await page.waitForTimeout(200);
    const metas = await page.locator(".dcard--top .dcard__meta").first().innerText();
    const km = parseInt(metas, 10);
    ok(km <= 2, `J: top card is ${km} km away under a 2 km filter`);
    await page.close();
  }

  /* ============ K. reduced motion ============ */
  step = "K reduced motion";
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push("K: " + e.message));
    await fresh(page, {});
    const durs = await page.evaluate(() => {
      const s = getComputedStyle(document.querySelector(".dcard--top"));
      return { anim: s.animationDuration, trans: s.transitionDuration };
    });
    ok(parseFloat(durs.anim) < 0.01, `K: animation not reduced (${durs.anim})`);
    await ctx.close();
  }

  /* ============ L. malformed localStorage must not brick the app ============ */
  step = "L corrupt state";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("L: " + e.message));
    await page.goto(FILE);
    await page.evaluate((k) => localStorage.setItem(k, "{not json at all"), KEY);
    await page.reload();
    await page.waitForTimeout(450);
    ok(await page.locator(".ob__h").count() > 0, "L: corrupt state did not fall back to onboarding");
    await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ v: 99, tab: "matches" })), KEY);
    await page.reload();
    await page.waitForTimeout(450);
    ok(await page.locator(".ob__h").count() > 0, "L: future state version was accepted");
    await page.close();
  }

  /* ============ M. dark theme has real contrast, not just a class swap ============ */
  step = "M dark theme";
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (e) => errors.push("M: " + e.message));
    await fresh(page, {});
    const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    await page.click('[data-act="theme"]');
    await page.waitForTimeout(300);
    const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    ok(light !== dark, `M: body background unchanged across themes (${light})`);
    const lum = await page.evaluate(() => {
      const p = (c) => { const [r, g, b] = c.match(/\d+/g).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const bg = p(getComputedStyle(document.body).backgroundColor);
      const fg = p(getComputedStyle(document.querySelector(".quota")).color);
      return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
    });
    ok(lum >= 4.5, `M: dark-theme quota text contrast is ${lum.toFixed(2)}:1`);
    await page.close();
  }

  /* ============ N. no external network requests (self-contained) ============ */
  step = "N offline";
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const external = [];
    page.on("request", (r) => { if (!r.url().startsWith("file:") && !r.url().startsWith("data:")) external.push(r.url()); });
    page.on("pageerror", (e) => errors.push("N: " + e.message));
    await fresh(page, {
      matches: [{ id: "mN", pid: "p05", at: Date.now() - 1000, expires: Date.now() + 9e6,
                  msgs: [{ from: "them", text: "hi", at: Date.now() - 900 }], unread: 1, firstMsg: true, gifts: [] }],
    });
    await page.click('[data-act="tab"][data-v="matches"]');
    await page.waitForTimeout(300);
    ok(await page.locator(".mrow").count() >= 1, "N: seeded matches missing");
    await page.locator(".mrow").first().click();
    await page.waitForTimeout(400);
    await page.click('[data-act="backchat"]');
    await page.waitForTimeout(200);
    await page.click('[data-act="tab"][data-v="you"]');
    await page.waitForTimeout(300);
    ok(external.length === 0, `N: made ${external.length} external requests: ${external.slice(0, 4).join(", ")}`);
    /* every image must resolve from a data uri */
    const imgs = await page.evaluate(() => Array.from(document.images).map((i) => i.currentSrc || i.src));
    ok(imgs.every((s) => s.startsWith("data:") || s.startsWith("blob:") || s.startsWith("file:")), `N: ${imgs.filter((s) => !s.startsWith("data:")).length} non-data images`);
    /* lazy images report naturalWidth 0 until they scroll in, so a genuinely
       broken image is one that finished loading and still has no pixels */
    const broken = await page.evaluate(async () => {
      const seen = [];
      for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
      document.querySelectorAll("img").forEach((i) => { if (i.complete && i.naturalWidth === 0) seen.push((i.src || "").slice(0, 40)); });
      return seen;
    });
    ok(broken.length === 0, `N: ${broken.length} images failed to load: ${broken.slice(0, 3).join(", ")}`);
    await ctx.close();
  }

  /* ============ O. tap targets and safe areas ============ */
  step = "O a11y";
  {
    const page = await browser.newPage({ viewport: { width: 360, height: 640 } });
    page.on("pageerror", (e) => errors.push("O: " + e.message));
    await fresh(page, {});
    const small = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("button, [role=switch], select, a").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.width < 40 || r.height < 40) out.push((el.className || el.tagName) + " " + Math.round(r.width) + "x" + Math.round(r.height));
      });
      return out;
    });
    ok(small.length === 0, `O: ${small.length} controls under 40px: ${small.slice(0, 5).join(" | ")}`);
    const unlabelled = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("button").forEach((el) => {
        const has = (el.textContent || "").trim() || el.getAttribute("aria-label") || el.getAttribute("title");
        if (!has) out.push(el.className || el.tagName);
      });
      return out;
    });
    ok(unlabelled.length === 0, `O: ${unlabelled.length} buttons with no accessible name: ${unlabelled.slice(0, 4).join(" | ")}`);
    await page.close();
  }
} catch (e) {
  trap = e;
  console.log("THREW at", step, ":", (e.message || "").split("\n")[0]);
}

await browser.close();
console.log("--- FAILURES (" + fails.length + ") ---");
fails.forEach((f) => console.log("  x " + f));
console.log("--- JS ERRORS (" + new Set(errors).size + ") ---");
[...new Set(errors)].forEach((e) => console.log("  ! " + e));
console.log(fails.length === 0 && errors.length === 0 && !trap ? "\nALL PASS" : "\nDONE WITH ISSUES");
process.exit(fails.length || errors.length || trap ? 1 : 0);
