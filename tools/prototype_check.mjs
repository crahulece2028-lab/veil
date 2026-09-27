// Render every prototype route headlessly and assert the product invariants.
//
// Run:  node tools/prototype_check.mjs
// Exit: 0 if all routes render and all invariants hold, 1 otherwise.
//
// This is a poor-man's DOM. It is enough because app.js only touches
// innerHTML / classList / style / addEventListener / setAttribute, and
// because every screen is produced by a pure template function.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'prototype');

function makeEl(id = '') {
  const classes = new Set();
  return {
    id,
    innerHTML: '',
    textContent: '',
    disabled: false,
    style: {},
    dataset: {},
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      contains: (c) => classes.has(c),
      toggle: (c) => (classes.has(c) ? (classes.delete(c), false) : (classes.add(c), true)),
    },
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    querySelector() { return null; },
  };
}

const els = new Map();
const get = (id) => {
  if (!els.has(id)) els.set(id, makeEl(id));
  return els.get(id);
};

const documentStub = {
  documentElement: { dataset: {}, classList: makeEl().classList },
  body: makeEl('body'),
  getElementById: get,
  addEventListener() {},
  createElement: () => makeEl(),
};

const context = vm.createContext({
  document: documentStub,
  console,
  setTimeout,
  clearTimeout,
});

const source = ['data.js', 'app.js']
  .map((f) => readFileSync(join(root, f), 'utf8'))
  .join('\n')
  .concat('\nglobalThis.__probe = { ORDER, R, state, render, go };\n');

vm.runInContext(source, context, { filename: 'veil-prototype.js' });

const { ORDER, R, state, render, go } = context.__probe;

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log(`  FAIL  ${msg}`);
};

console.log(`\nROUTES (${ORDER.length})`);
console.log('-'.repeat(74));

for (const id of ORDER) {
  const r = R[id];
  if (!r) { fail(`${id}: missing from R`); continue; }
  if (typeof r.render !== 'function') { fail(`${id}: no render()`); continue; }
  if (!r.group) fail(`${id}: no group`);
  if (!r.title) fail(`${id}: no title`);
  if (!r.notes || r.notes.length < 2) fail(`${id}: fewer than 2 design notes`);
  if (!r.tokens || r.tokens.length !== 4) fail(`${id}: expected 4 tokens`);

  state.route = id;
  state.back = [];
  let html = '';
  try {
    render();
    html = get('screen').innerHTML;
  } catch (err) {
    fail(`${id}: threw ${err.message}`);
    continue;
  }
  if (!html || html.length < 200) { fail(`${id}: rendered empty`); continue; }
  if (/undefined|\[object Object\]|NaN/.test(html)) fail(`${id}: leaked undefined/NaN into output`);
  console.log(`  ok    ${id.padEnd(18)} ${String(html.length).padStart(6)} bytes`);
}

console.log(`\nINVARIANTS`);
console.log('-'.repeat(74));

const seen = new Map();
for (const id of ORDER) {
  state.route = id;
  state.back = [];
  render();
  seen.set(id, get('screen').innerHTML);
}

const all = [...seen.values()].join('\n');

const checks = [
  ['the word "delivered" never appears in any screen', !/\bdelivered\b/i.test(all)],
  ['no avatar component is ever instantiated', !/avatar|\.avi\b|initials-tile/i.test(all)],
  ['no like / reply counts anywhere', !/\b\d+\s+(likes|replies|responses|views)\b/i.test(all)],
  ['no streak or XP language', !/\bstreak\b|\bXP\b|\blevel up\b|\bday \d+ of\b/i.test(all)],
  ['no public feed / trending surface', !/\btrending\b|\bpopular\b|\bleaderboard\b/i.test(all)],
  ['no emoji used as a structural icon', !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all)],
  ['every interactive control is at least 44px via a class', !/<button(?![^>]*class=)/.test(all)],
  ['no inline raw hex colours in screens (tokens only)', !/style="[^"]*#[0-9a-f]{6}/i.test(all)],
  ['avatar-free: no img tags at all', !/<img\b/i.test(all)],
  ['no read receipt wording', !/\bseen by\b|\bread (at|just now)\b|\bdelivered\b|\bopened (at|just now)\b/i.test(all)],
  ['no "swipe" metaphor for discovery', !/\bswipe\b/i.test(all)],
  ['no confetti or celebratory send copy', !/\bconfetti\b|\bcongrats\b|\byou'?re a star\b/i.test(all)],
];

for (const [label, ok] of checks) {
  if (ok) console.log(`  ok    ${label}`);
  else fail(label);
}

console.log(`\nINTERACTION PATHS`);
console.log('-'.repeat(74));

state.peerSigned = false;
state.meSigned = false;
state.warmth = 0;
state.note = '';

const path = [
  ['build-circle', 'add ana', () => { state.added.add('ana'); state.channels = 1; }],
  ['build-circle', 'add theo', () => { state.added.add('theo'); state.channels = 2; }],
  ['build-circle', 'add priya', () => { state.added.add('priya'); state.channels = 3; }],
  ['channel-gate', 'channels reach 3', () => {}],
  ['inbox', 'warmth x1', () => { state.warmth = 1; }],
  ['seal-break', 'break the seal', () => go('thread')],
  ['thread', 'open sign sheet', () => go('sign-sheet')],
  ['sign-sheet', 'share my name', () => go('sign-confirm')],
  ['sign-confirm', 'confirm sign', () => { state.meSigned = true; state.peerSigned = true; go('sign-reveal'); }],
  ['thread', 'signed thread shows honey rule', () => go('thread')],
  ['thread', 'report', () => { state.note = 'x'; go('report'); }],
  ['inbox', 'note banner shown', () => go('inbox')],
];

for (const [route, label, mutate] of path) {
  try {
    mutate();
    state.route = route;
    state.back = [];
    render();
    if (!get('screen').innerHTML) throw new Error('empty');
    console.log(`  ok    ${label}`);
  } catch (err) {
    fail(`${label} (${route}): ${err.message}`);
  }
}

const signedThread = (() => { go('thread'); return get('screen').innerHTML; })();
if (signedThread.includes('Sign it back')) fail('signed state still offers "Sign it back"');
else console.log('  ok    signed state is terminal — no re-prompt offered');

console.log();
if (failures) {
  console.log(`${failures} FAILURE(S).`);
  process.exit(1);
}
console.log(`All ${ORDER.length} routes render. All invariants hold.`);
