# Wren

**A dating prototype. Swipe, match, talk.**

`index.html` is the whole product: one self-contained file, no build step, no server, no
dependencies, no network calls. Open it in a browser and it runs.

```bash
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

---

## What it is

A complete, interactive dating-app prototype. Every screen is wired to real state: onboarding
gates on a selfie check, swipes are draggable and undoable, matches open a working chat with
typing indicators and canned replies, filters actually filter, and the safety surfaces
(report, block, unmatch) really do remove people from the deck.

It is a *prototype*, and it says so on screen. There is no backend, no authentication, no
payment, and nothing is sent anywhere. All state lives in one `localStorage` key.

| Surface | What's in it |
|---|---|
| **Onboarding** | Name, age, gender, orientation, intent, verification code, open prompts, selfie check, photo grid |
| **Discover** | Draggable card deck with pass / like / super, per-card photo pips, prompt previews, tap-to-expand |
| **Matches** | Match list with a 24-hour window, unread state, and a "say something first" nudge |
| **Chat** | Threaded messages, typing indicator, delayed canned replies, per-match menu |
| **You** | Profile, photo manager, preferences, preferences summary, settings, blocked list, reset |
| **Safety** | Report with a fixed reason list, block, unmatch, re-verify, a daily like limit |

## Product decisions, written down

The brief asked for the reasoning to be explicit, so it is here rather than buried in code.

**Universal messaging is the default.** Settings also offer the Bumble-style restriction,
where only one side of a match may send the first message. Universal is the default because
the alternative has a known failure mode: a match that expires with nobody able to speak is
a bad experience, and it is the single most common complaint about that model. A match that
goes quiet should be a choice, not a rule. The restriction stays available for anyone who
prefers it.

**A match expires after 24 hours unless someone writes first.** The clock is visible from the
moment of the match, not hidden in a settings page. This is the anti-stalemate mechanism: a
dead conversation closes itself instead of sitting in an inbox forever.

**Twenty-five likes per calendar day, then a wall.** Not an upsell. The upgrade button
discloses that no card is charged and nothing is taken.

**Generated portraits, not downloaded ones.** Every profile photo is an SVG generated in the
page from the profile id, so the app is genuinely self-contained and works offline. Settings
also has a "remote photos" switch that attempts real image URLs and falls back to the
generated portrait on error, so the fallback path is real code rather than a comment.

**Vanilla JS, not React.** React would have to come from a CDN, and the brief asked for one
runnable file. State is a single object, re-rendered per screen. The swipe deck is the one
surface that mutates the DOM directly, because rebuilding it mid-drag would destroy the
gesture.

## Verification

Four Playwright harnesses. They need a browser; the app itself needs nothing.

```bash
npm i -D playwright && npx playwright install chromium
```

| Script | What it proves |
|---|---|
| `node tools/wren_audit.mjs` | Onboarding end to end, deck gestures, filters, match flow, chat, sheets, persistence across reload, both themes |
| `node tools/wren_rules.mjs` | The rules: match expiry and non-expiry, daily quota and daily rollover, undo refunding a like, report and block removing people, corrupt-state recovery, tap targets and accessible names, zero external requests |
| `node tools/wren_visual.mjs` | 4 viewports × 2 themes × 4 screens, plus onboarding: no horizontal overflow, no clipped text |
| `node tools/wren_polish.mjs` | WCAG 2.2 contrast on every text node in both themes, including card copy measured against the gradient scrim it actually sits on |

Current results: all four clean, zero uncaught JavaScript errors.

The Veil harnesses still run and still pass, because the Veil package below is untouched:

```bash
python tools/contrast_check.py            # 53/53 token pairs pass WCAG 2.2
node tools/prototype_check.mjs            # 32/32 routes render, all invariants hold
node tools/prototype_audit.mjs prototype  # 64 screen-theme pairs, no layout problems
```

The first two have **no dependencies**. The three Playwright scripts are the only ones that
need a browser.

---

## The previous concept package: Veil

This repository previously held **Veil**, an anonymous-confession product for campuses. The
written package and the 32-screen interactive prototype are still here, intact and still
verified by the tools above. Only the root page changed.

- Live Veil (still serving the old root until a push happens):
  <https://crahulece2028-lab.github.io/veil/> ·
  <https://crahulece2028-lab.github.io/veil/prototype/> ·
  <https://veil-beta-ashy.vercel.app/>
- Recover the exact previous root page with `git show d2be33f:index.html`.

| # | Document | What it answers |
|---|---|---|
| 01 | [`docs/01-concept-strategy.md`](docs/01-concept-strategy.md) | Is this compelling? Who is it for? Why campus? What kills it? |
| 02 | [`docs/02-product-spec.md`](docs/02-product-spec.md) | How does matching and confession flow? Rules, limits, edge cases, v1 scope |
| 03 | [`docs/03-design-system.md`](docs/03-design-system.md) | Tokens, type, motion, the anonymity visual language, copy voice |
| 04 | [`docs/04-user-flows.md`](docs/04-user-flows.md) | Onboarding, sending, receiving, responding, signing, abuse paths |
| 05 | [`docs/05-wireframes.md`](docs/05-wireframes.md) | Annotated ASCII mockups of 24 mobile screens |
| 06 | [`docs/06-safety-and-trust.md`](docs/06-safety-and-trust.md) | Threat model, anonymity architecture, moderation UX, legal posture |
| 07 | [`docs/07-build-spec.md`](docs/07-build-spec.md) | Data model, API, delivery worker, analytics, definition of done |
| 08 | [`docs/08-wren.md`](docs/08-wren.md) | The Wren prototype: architecture, state, decisions, known limits |

Note that Wren is a separate design system with its own tokens, defined in the page. It does
not consume `assets/tokens.css`; the Veil prototype still does, which is why that file stays.

## Repo

```
index.html            the Wren prototype — single file, this is the website root
site.css              previous Veil landing page styles, kept for reversibility
site.js               previous Veil theme toggle, kept for reversibility
assets/
  tokens.css          Veil light + dark tokens — still the source of truth for prototype/
docs/
  01…07               the Veil concept package (strategy, spec, design, flows, wireframes, safety, build)
  08-wren.md          the Wren prototype notes
prototype/
  index.html          the Veil interactive prototype — open this
  app.css  data.js  app.js
tools/
  wren_audit.mjs      Wren flows + persistence          (needs playwright)
  wren_rules.mjs      Wren rules + resilience           (needs playwright)
  wren_visual.mjs     Wren layout across viewports      (needs playwright)
  wren_polish.mjs     Wren contrast + accessibility     (needs playwright)
  contrast_check.py   Veil WCAG 2.2 token contrast      (no dependencies)
  prototype_check.mjs Veil routes + invariants          (no dependencies)
  prototype_audit.mjs Veil layout + tap targets         (needs playwright)
```

## Status

Wren is a complete front-end prototype and nothing more. The screens are real, the state
machine is real, and the rules are enforced rather than described. What does not exist is
anything behind it: no accounts, no matching service, no delivery, no moderation pipeline,
no payment. A prototype proves the interaction design holds up under a thumb; it does not
prove a dating service is viable or safe to launch.

The obvious next steps, in order, are a real identity and photo pipeline, a moderation queue
behind the report flow, and a decision about whether the 24-hour match window survives
contact with real users.
