# 08 — Wren

The prototype that now serves the repository root. This is the engineering-facing note:
what the thing is made of, what it decides, and where it stops. Strategy-level argument
lives in `01`–`07` and is not repeated here.

---

## 1. What it is

A dating app, built as one file. `index.html` contains the design tokens, the CSS, the
JavaScript, the fixture data, and the generated portrait artwork. It makes no network
requests at all, which is verified rather than asserted (`tools/wren_rules.mjs` fails the
build if any request leaves the file).

| | |
|---|---|
| Language | Vanilla JS, no framework, no build |
| State | One object, persisted to `localStorage` under `wren.state.v1` |
| Rendering | `render()` writes `innerHTML` per screen; the deck mutates nodes directly |
| Dependencies | None at runtime |
| Data | 13 fixture profiles, generated SVG portraits, in-page prompt bank |

## 2. Why no framework

React would have to be loaded from a CDN, and the brief asked for a single self-contained
file. A CDN is also a network dependency, which defeats the offline guarantee. The
trade-off is real and worth naming: full re-render on every state change is fine for
eleven screens and would not be fine for a real product.

The one place the model bends is the swipe deck. Cards are direct DOM nodes, because
re-rendering mid-drag destroys the gesture. The deck is therefore the only surface with
hand-written DOM mutation, and it is the part most likely to need a rewrite.

## 3. Architecture

```
p1 / p2   design tokens, reset, components, responsive rules
p3        icon set, portrait generator, prompt bank, fixture profiles
p4        state object, load/save, day rollover, onboarding logic
p5        shell, deck + gestures, filters, expanded card, match modal
p6        matches, chat, typing indicator, canned replies, You tab
p7        sheets, delegated event handling, safety actions, boot
```

(That split was a build convenience during authoring. The shipped artefact is the
concatenated `index.html`, which is now the single source of truth.)

Three decisions are load-bearing:

**`load()` deep-merges, it does not replace.** A user who upgrades the file must not lose
their profile because one nested object was missing. Every level — `me`, `form`, `prefs`,
`settings` — merges over a fresh state. Transient UI state (`match`, `sheet`, `toast`,
`chat`, `viewing`) is explicitly cleared on load, because a restored modal is a bug, not a
feature.

**`save()` never throws.** Storage can be unavailable (private mode, quota). Writes are
wrapped; the app runs in memory rather than failing.

**Corrupt state falls back to onboarding.** A parse failure or an unknown `v` discards the
stored object instead of booting a half-valid one.

## 4. The rules, and why

| Rule | Value | Reason |
|---|---|---|
| First message | **Anyone**, configurable to one-side-only | A match where neither side can speak is a dead match. Default to the option that cannot produce one. |
| Match window | 24 hours, unless a message is sent | Closes dead conversations instead of accumulating them |
| Like allowance | 25 per calendar day | Forces a pause; the limit screen discloses that nothing is charged |
| Report reasons | Fixed list, no free text | Keeps reports triageable and blocks free-text abuse of the pipeline |
| Block | Immediate, reversible, removes from deck and matches | Reversibility matters: a mis-tap should not destroy a conversation |
| Photos | 2 minimum, 6 maximum | Both limits were real product decisions, not validation noise |

The day rollover is written through immediately on boot. A counter that only resets in
memory is a counter that comes back from the dead after a reload, which is exactly the bug
`tools/wren_rules.mjs` now guards.

## 5. The generated portraits

`portrait(id, index)` builds an SVG data URI from the id: a deterministic gradient, a
geometric figure, and per-index variation. The same id always yields the same face, so a
profile looks like the same person across every screen.

This exists so the file is genuinely self-contained. It is not a placeholder: the artwork is
what you see, and it is generated in-page with no network access.

`settings.remotePhotos` switches to real `photoUrls` when present, with an `onerror` handler
that falls back to the generated portrait. The fixture profiles ship with `photoUrls: null`,
so the remote path is implemented and reachable but not exercised by the default data.

## 6. Accessibility

Not a checklist pass. The things that are actually enforced:

- Every interactive control is at least 40 × 40 CSS px, verified in-browser
  (`tools/wren_rules.mjs`).
- Every button has an accessible name; the harness fails on unnamed buttons.
- All text meets WCAG 2.2 AA in both themes. The card's white copy is measured against the
  gradient scrim **at the position each text block actually occupies**, not against a
  nominal background, because the scrim fades and a nominal check would be a lie.
- `prefers-reduced-motion` collapses card and sheet animation, verified by computed style.
- The theme is a real token swap, not an inverted filter. Both themes were measured.

## 7. Known limits

Stated plainly, because a prototype that hides its edges is worse than useless:

- **No backend of any kind.** No accounts, no matching, no delivery, no moderation queue.
  The report flow records a report in `localStorage`; nothing is ever reviewed.
- **No payment.** The upgrade screen exists to make the daily limit honest, and it says so.
- **Remote photos are unexercised.** The code path is real; the data is not.
- **Canned replies.** Typing indicators and replies are scripted, not generated.
- **No offline write queue, no conflict handling, no multi-tab safety.** Two tabs sharing
  one `localStorage` key will overwrite each other.
- **Not tested on real devices.** Every check here ran in Chromium at four viewport sizes.
  Touch behaviour was verified with synthetic touch events, which is not the same as a thumb.
- **The deck is hand-rolled.** Drag, snap-back, and fly-out thresholds are tuned by feel and
  will need real-device tuning.

## 8. Verification

See the README for the four harnesses and how to run them. All four are clean, with zero
uncaught JavaScript errors.

The split is deliberate: `wren_audit` covers flows and persistence, `wren_rules` covers the
business rules and failure modes, `wren_visual` covers layout across viewports, and
`wren_polish` covers contrast and accessibility. A single suite would have made it too easy
to assert the happy path and quietly skip the parts that are actually likely to be wrong.
