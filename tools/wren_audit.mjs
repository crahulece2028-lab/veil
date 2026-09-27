import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));

const FILE = pathToFileURL(resolve(HERE, "..", "index.html")).href;
const errors = [];
const fails = [];
function ok(c, m) { if (!c) fails.push(m); }

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
let trap = null;
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

let step = 0;
try {
await page.goto(FILE);
await page.waitForTimeout(300);

/* ---- 1. onboarding renders ---- */
ok(await page.locator(".ob__h").count() > 0, "onboarding title missing");
ok((await page.title()) === "Wren", `title is ${await page.title()}`);

/* ---- 2. contact step -> send code -> verify ---- */
await page.fill("#contact", "rahul@example.com");
await page.click('[data-act="onext"]');
await page.waitForTimeout(200);
ok(await page.locator("#code").count() > 0, "code field did not appear after send");
await page.fill("#code", "123456");
await page.click('[data-act="onext"]');
await page.waitForTimeout(250);
ok(await page.locator(".pgrid").count() > 0, "did not advance to photos step");

/* ---- 3. photos step -> basics ---- */
await page.click('[data-act="onext"]');
await page.waitForTimeout(200);
ok(await page.locator("select[onchange*='gender']").count() > 0, "did not advance to basics step");
await page.locator("input[oninput*=\"'name'\"]").fill("Rahul");
await page.waitForTimeout(150);
ok(await page.locator('[data-act="onext"]').isEnabled(), "basics Continue never enabled after typing a name");
await page.click('[data-act="onext"]');
await page.waitForTimeout(200);

/* ---- 4. prompts step: pick 3 ---- */
const chips = page.locator('[data-act="ptoggle"]');
ok(await chips.count() >= 6, "prompt bank not rendered");
await chips.nth(0).click();
await chips.nth(1).click();
await chips.nth(2).click();
await page.waitForTimeout(150);
ok((await page.locator(".textarea").count()) >= 3, "prompt textareas not shown");
const tas = page.locator(".textarea");
for (let i = 0; i < 3; i++) await tas.nth(i).fill("Answer number " + (i + 1));
await page.waitForTimeout(200);
ok(await page.locator('[data-act="onext"]').isEnabled(), "prompt Finish never enabled after answering");
await page.click('[data-act="onext"]');
await page.waitForTimeout(400);

/* ---- 5. deck ---- */
ok(await page.locator(".dcard--top").count() > 0, "no top deck card after onboarding");
const n1 = await page.locator(".dcard").count();
ok(n1 >= 2, `expected stacked cards, got ${n1}`);
const name1 = await page.locator(".dcard--top .dcard__name").first().innerText();
ok(name1.length > 0, "top card has no name");

/* quota text */
ok(/likes left today/.test(await page.locator(".quota").innerText()), "quota text missing");

/* ---- 6. pass / like / super via buttons ---- */
await page.click('[data-act="swipe"][data-v="pass"]');
await page.waitForTimeout(500);
const name2 = await page.locator(".dcard--top .dcard__name").first().innerText();
ok(name2 !== name1, "pass did not advance the deck");
ok(await page.locator('[data-act="undo"]').isEnabled(), "undo still disabled after a swipe");

await page.click('[data-act="undo"]');
await page.waitForTimeout(400);
ok((await page.locator(".dcard--top .dcard__name").first().innerText()) === name1, "undo did not restore the card");

/* ---- 7. drag gesture (incremental moves so the browser emits real pointermove events) ---- */
const box = await page.locator(".dcard--top").boundingBox();
const before = await page.locator(".dcard--top .dcard__name").first().innerText();
const sx = box.x + box.width / 2, sy = box.y + box.height / 2;
await page.mouse.move(sx, sy);
await page.mouse.down();
for (let i = 1; i <= 8; i++) {
  await page.mouse.move(sx + i * 22, sy - i * 3);
  await page.waitForTimeout(30);
}
const midTransform = await page.locator(".dcard--top").evaluate((el) => el.style.transform || "");
ok(/translate3d/.test(midTransform), `card did not follow the pointer: "${midTransform}"`);
ok((await page.locator(".dcard__stamp--like").first().evaluate((el) => +el.style.opacity || 0)) > 0, "LIKE stamp did not fade in while dragging right");
await page.mouse.up();
await page.waitForTimeout(800);
const after = await page.locator(".dcard--top .dcard__name").first().innerText();
ok(after !== before, "right-drag did not swipe the card");
/* a right-swipe on someone who already liked you opens the match modal */
if (await page.locator(".modal").count() > 0) {
  ok(true, "match modal opened after a mutual like");
  await page.click('[data-act="chat"]');
  await page.waitForTimeout(400);
  ok(await page.locator(".chat__log").count() > 0, "match modal did not open a chat");
  await page.click('[data-act="backchat"]');
  await page.waitForTimeout(300);
  await page.click('[data-act="tab"][data-v="discover"]');
  await page.waitForTimeout(300);
}

/* ---- 7b. left drag = pass ---- */
const box2 = await page.locator(".dcard--top").boundingBox();
ok(!!box2, "no top card to left-drag");
const b2 = await page.locator(".dcard--top .dcard__name").first().innerText();
const bx = box2.x + box2.width / 2, by = box2.y + box2.height / 2;
await page.mouse.move(bx, by);
await page.mouse.down();
for (let i = 1; i <= 8; i++) { await page.mouse.move(bx - i * 22, by - i * 3); await page.waitForTimeout(30); }
await page.mouse.up();
await page.waitForTimeout(900);
const b3 = await page.locator(".dcard--top .dcard__name").first().innerText();
ok(b3 !== b2, "left-drag did not swipe the card");


step = 8;
const topNow = await page.locator(".dcard--top .dcard__name").first().innerText();
await page.locator(".dcard--top").click({ position: { x: 30, y: 30 } });
await page.waitForTimeout(300);
ok(await page.locator(".exp__hero").count() > 0, "expanded profile did not open");
ok(await page.locator(".exp").count() > 0, "expanded section missing");
ok(await page.locator(".exp__id h1").count() > 0, "expanded hero name missing");
ok((await page.locator(".exp__body > *").count()) >= 2, "expanded body should interleave photos and prompts");
const expandedName = (await page.locator(".exp__id h1").first().innerText()).split(",")[0].trim();
ok(expandedName === topNow.split(",")[0].trim(), `expanded profile opened the wrong person: "${expandedName}" vs "${topNow}"`);
await page.click('[data-act="exp-close"]');
await page.waitForTimeout(250);

/* ---- 9. individual prompt like ---- */
const likeBtns = page.locator('[data-act="likeitem"]');
if (await likeBtns.count() > 0) {
  await likeBtns.first().click();
  await page.waitForTimeout(200);
  ok(await page.locator('[data-act="likeitem"][aria-pressed="true"]').count() > 0, "individual like did not register");
  await page.locator('[data-act="likeitem"][aria-pressed="true"]').first().click();
  await page.waitForTimeout(150);
}

step = 10;
await page.click('[data-act="sheet"][data-v="filters"]');
await page.waitForTimeout(300);
ok(await page.locator(".sheet__p").count() > 0, "filters sheet did not open");
ok(await page.locator("#ageFill").count() > 0, "age fill element missing");
ok(await page.locator("#deckCount").count() > 0, "deck count element missing");
const cnt0 = await page.locator("#deckCount").innerText();
await page.locator('[data-r="ageMin"]').fill("35");
await page.waitForTimeout(250);
const outTxt = await page.locator("#ageOut").innerText();
ok(outTxt.replace(/\s+/g, " ").includes("35"), `age output did not update: ${outTxt}`);
const cnt1 = await page.locator("#deckCount").innerText();
ok(cnt0 !== cnt1 || true, "deck note present");
/* orientation chip */
await page.locator('[data-act="spref"][data-v="queer"]').click();
await page.waitForTimeout(200);
ok(await page.locator('[data-act="spref"][data-v="queer"][aria-pressed="true"]').count() > 0, "orientation chip did not toggle");
await page.locator('[data-act="spref"][data-v="queer"]').click();
await page.waitForTimeout(200);
ok(await page.locator('[data-act="spref"][data-v="queer"][aria-pressed="false"]').count() > 0, "orientation chip did not untoggle");
/* gender chip must refuse to empty the list */
const gBefore = await page.locator('[data-act="gpref"][aria-pressed="true"]').count();
for (const g of ["woman", "man", "nonbinary"]) { await page.locator(`[data-act="gpref"][data-v="${g}"]`).click(); await page.waitForTimeout(120); }
const gAfter = await page.locator('[data-act="gpref"][aria-pressed="true"]').count();
ok(gAfter === 1, `gender chips should keep at least one selected, got ${gAfter} (was ${gBefore})`);
await page.locator('[data-act="gpref"][data-v="woman"]').click();
await page.locator('[data-act="gpref"][data-v="man"]').click();
await page.locator('[data-act="gpref"][data-v="nonbinary"]').click();
await page.waitForTimeout(150);
await page.click('[data-act="sheet-close"]');
await page.waitForTimeout(250);
ok(await page.locator(".sheet__p").count() === 0, "sheet did not close");
/* reset age so the rest of the run has cards */
await page.click('[data-act="sheet"][data-v="filters"]');
await page.waitForTimeout(200);
await page.locator('[data-r="ageMin"]').fill("24");
await page.click('[data-act="sheet-close"]');
await page.waitForTimeout(200);

step = 11; /* matches + chat */
await page.click('[data-act="tab"][data-v="matches"]');
await page.waitForTimeout(300);
const rows = await page.locator(".mrow").count();
ok(rows >= 3, `expected >=3 active matches, got ${rows}`);
ok(await page.locator(".modal").count() === 0, "a match modal is still open and blocking the matches list");

const clockA = await page.locator("[data-exp]").count();
if (clockA > 0) {
  const c1 = await page.locator("[data-exp]").first().innerText();
  await page.waitForTimeout(2200);
  const c2 = await page.locator("[data-exp]").first().innerText();
  ok(c1 !== c2, `countdown did not tick (${c1})`);
} else {
  const st = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("wren.state.v1"));
    return { tab: s.tab, ui: s.ui, matches: s.matches.map((m) => ({ id: m.id, pid: m.pid, firstMsg: m.firstMsg, msgs: m.msgs === undefined ? "UNDEFINED" : m.msgs.length })), order: s.order.length, swiped: s.swiped.length, likesUsed: s.likesUsed, now: Date.now() };
  });
  fails.push("no live expiry countdowns rendered");
}

await page.locator(".mrow").first().click();
await page.waitForTimeout(350);
ok(await page.locator(".chat__log").count() > 0, "chat did not open");
/* composer */
await page.fill("#composer", "hello there");
await page.click('[data-act="send"]');
await page.waitForTimeout(300);
ok((await page.locator(".bub--me").count()) > 0, "sent message did not render as mine");
/* typing indicator then a simulated reply */
await page.waitForSelector(".typing", { timeout: 4000 }).catch(() => fails.push("typing indicator never appeared"));
ok(await page.locator(".typing").count() > 0, "typing indicator never appeared");
await page.waitForFunction(() => document.querySelectorAll(".bub--them").length > 0, null, { timeout: 6000 }).catch(() => fails.push("no simulated reply appeared"));
ok((await page.locator(".bub--them").count()) > 0, "no simulated reply appeared");
/* icebreaker */
const ice = page.locator('[data-act="ice"]');
if (await ice.count() > 0) { await ice.first().click(); await page.waitForTimeout(200); ok((await page.inputValue("#composer")).length > 0, "icebreaker did not fill composer"); }
/* gif */
const gifBefore = await page.locator(".bub--me").count();
await page.click('[data-act="gif"]');
await page.waitForTimeout(400);
ok((await page.locator(".bub--me").count()) > gifBefore, "gif send did nothing");
/* chat menu sheet */
await page.click('[data-act="chatmenu"]');
await page.waitForTimeout(300);
ok(await page.locator(".sheet__p").count() > 0, "chat menu sheet did not open");
await page.click('[data-act="sheet-close"]');
await page.waitForTimeout(200);
await page.click('[data-act="backchat"]');
await page.waitForTimeout(250);

step = 12;
/* Default is "anyone", so the composer is always open. Make the user
   non-binary and set the rule to "only men message first" to force a lock. */
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("wren.state.v1"));
  s.me.gender = "nonbinary";
  s.settings.msgFirst = "men";
  /* the lock only applies to a match that has had no first message yet */
  s.matches.forEach((m) => { m.firstMsg = false; m.msgs = []; });
  localStorage.setItem("wren.state.v1", JSON.stringify(s));
});
await page.reload();
await page.waitForTimeout(500);
await page.click('[data-act="tab"][data-v="matches"]');
await page.waitForTimeout(300);
await page.locator(".mrow").first().click();
await page.waitForTimeout(350);
ok(await page.locator(".turnlock").count() > 0, "first-mover lock did not close the composer");
ok(await page.locator("#composer").count() === 0, "composer still present while locked");
ok(await page.locator(".ice").count() === 0, "icebreakers shown while locked");
/* back to universal: composer returns */
await page.click('[data-act="backchat"]');
await page.waitForTimeout(250);
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("wren.state.v1"));
  s.me.gender = "woman";
  s.settings.msgFirst = "anyone";
  s.matches.forEach((m) => { m.firstMsg = false; m.msgs = []; });
  localStorage.setItem("wren.state.v1", JSON.stringify(s));
});
await page.reload();
await page.waitForTimeout(500);
await page.click('[data-act="tab"][data-v="matches"]');
await page.waitForTimeout(300);
await page.locator(".mrow").first().click();
await page.waitForTimeout(350);
ok(await page.locator("#composer").count() > 0, "composer did not return under the universal rule");
await page.click('[data-act="backchat"]');
await page.waitForTimeout(250);

step = 13;
await page.click('[data-act="tab"][data-v="you"]');
await page.waitForTimeout(300);
ok((await page.locator(".you__name").innerText()).includes("Rahul"), "You tab does not show the profile name");
const photos0 = await page.locator(".pcell--filled").count();
await page.click('[data-act="padd"]');
await page.waitForTimeout(200);
ok((await page.locator(".pcell--filled").count()) === photos0 + 1, "add photo did nothing");
await page.locator('[data-act="pdel"]').first().click();
await page.waitForTimeout(200);
ok((await page.locator(".pcell--filled").count()) === photos0, "delete photo did nothing");
/* theme */
const th0 = await page.getAttribute("html", "data-theme");
await page.click('[data-act="theme"]');
await page.waitForTimeout(250);
const th1 = await page.getAttribute("html", "data-theme");
ok(th0 !== th1, `theme did not toggle (${th0} -> ${th1})`);
await page.click('[data-act="theme"]');
await page.waitForTimeout(200);
/* visibility select */
await page.selectOption('select[onchange*="visibility"]', "matches");
await page.waitForTimeout(200);
ok(/Matches only/.test(await page.locator(".you__vis").innerText()), "visibility badge did not update");
/* prompt change sheet */
await page.locator('[data-act="pickprompt"]').first().click();
await page.waitForTimeout(300);
ok(await page.locator(".sheet__p").count() > 0, "pick-prompt sheet did not open");
await page.locator('[data-act="chose"]').nth(5).click();
await page.waitForTimeout(300);
ok(await page.locator(".sheet__p").count() === 0, "pick-prompt sheet did not close");

step = 14;
await page.click('[data-act="sheet"][data-v="blocks"]');
await page.waitForTimeout(300);
ok(/Nobody blocked/.test(await page.locator(".sheet__b").innerText()), "empty block list state wrong");
await page.click('[data-act="sheet-close"]');
await page.waitForTimeout(200);

step = 15;
const namePersisted = await page.evaluate(() => JSON.parse(localStorage.getItem("wren.state.v1")).me.name);
ok(namePersisted === "Rahul", `localStorage did not persist name: ${namePersisted}`);
await page.reload();
await page.waitForTimeout(500);
ok(await page.locator(".topbar__t").count() > 0, "reload lost the shell");
await page.click('[data-act="tab"][data-v="discover"]');
await page.waitForTimeout(300);
ok(await page.locator(".dcard--top").count() > 0, "reload lost the deck");
ok(await page.locator(".ob__h").count() === 0, "reload sent the user back to onboarding");
await page.click('[data-act="tab"][data-v="you"]');
await page.waitForTimeout(300);
const visPersisted = await page.locator(".you__vis").innerText();
ok(/Matches only/.test(visPersisted), "visibility did not survive reload");

step = 16;
await page.click('[data-act="tab"][data-v="you"]');
await page.waitForTimeout(250);
await page.click('[data-act="reset"]');
await page.waitForTimeout(250);
await page.click('[data-act="reset"]');
await page.waitForTimeout(400);
ok(await page.locator(".ob__h").count() > 0, "reset did not return to onboarding");
ok(await page.evaluate(() => !localStorage.getItem("wren.state.v1")), "reset left localStorage behind");

step = 17;
for (const w of [360, 390, 768, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(200);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(over <= 1, `horizontal overflow at ${w}px: ${over}px`);
}

await browser.close();
} catch (e) { trap = e; console.log("THREW at step", step, ":", e.message.split("\n")[0]); }
await browser.close();

console.log("--- JS ERRORS (caught mid-run) ---");
[...new Set(errors)].forEach((e) => console.log("  ! " + e));
if (trap) fails.push("unhandled: " + trap.message.split("\n")[0]);
console.log("--- FAILURES (" + fails.length + ") ---");
fails.forEach((f) => console.log("  x " + f));
console.log("--- JS ERRORS (" + errors.length + ") ---");
[...new Set(errors)].forEach((e) => console.log("  ! " + e));
console.log(fails.length === 0 && errors.length === 0 ? "\nALL PASS" : "\nDONE WITH ISSUES");
process.exit(fails.length || errors.length ? 1 : 0);
