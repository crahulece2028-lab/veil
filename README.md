# Veil — Anonymous Confessions for Campus

**The drafts folder for your campus. Say the thing you never said — anonymously, to someone you already know.**

A complete, buildable concept package: strategy, product spec, design system, user flows, annotated wireframes, safety architecture, and an engineering handoff.

---

## Read in this order

| # | Document | What it answers |
|---|---|---|
| 00 | **This file** | Orientation, the core loop, the one-page pitch |
| 01 | [`docs/01-concept-strategy.md`](docs/01-concept-strategy.md) | Is this compelling? Who is it for? Why campus? What kills it? Go-to-market, business model, metrics, kill criteria, naming |
| 02 | [`docs/02-product-spec.md`](docs/02-product-spec.md) | How does matching/connection actually work? How do confessions flow? What are the rules, limits, edge cases, and v1 scope? |
| 03 | [`docs/03-design-system.md`](docs/03-design-system.md) | Tokens, type, motion, the anonymity visual language, copy voice, accessibility |
| 04 | [`docs/04-user-flows.md`](docs/04-user-flows.md) | Step-by-step onboarding, sending, receiving, responding, signing, and the abuse paths |
| 05 | [`docs/05-wireframes.md`](docs/05-wireframes.md) | Annotated ASCII mockups of 24 mobile screens at 390 × 844 |
| 06 | [`docs/06-safety-and-trust.md`](docs/06-safety-and-trust.md) | Threat model, anonymity architecture, moderation UX, escalation, legal posture |
| 07 | [`docs/07-build-spec.md`](docs/07-build-spec.md) | Data model, API, delivery worker, analytics, DoD, build sequence, pre-launch gate |
| — | [`prototype/index.html`](prototype/index.html) | **The interactive prototype** — 32 tappable screens. Open it in a browser; no build, no server, no dependencies |
| — | [`tools/contrast_check.py`](tools/contrast_check.py) | Validates all 47 design-token contrast pairs against WCAG 2.2. Run: `python tools/contrast_check.py` |
| — | [`tools/prototype_check.mjs`](tools/prototype_check.mjs) | Renders all 32 routes and asserts the product invariants. No dependencies. Run: `node tools/prototype_check.mjs` |
| — | [`tools/prototype_audit.mjs`](tools/prototype_audit.mjs) | Walks all 32 screens in both themes checking overflow, 44pt tap targets, safe areas, and font fallback. Needs Playwright. Run: `node tools/prototype_audit.mjs prototype` |

---

## The one-paragraph version

Every anonymous app today gives you freedom to speak and no reason to. Every named app gives you the reason and no freedom. Veil is the only one that keeps the relationship and removes the exposure: you can only write to people you already have a verified connection to, there are no public feeds, no follower counts, and no reply counts — and the identity that "knows" you is never the person you're talking to. The payoff is a moment we call **Sign it**: either side can reveal their name, but only voluntarily, only mutually, never silently, never to anyone else. Students don't need a place to speak. They need somewhere to say the thing *and have it land with the right person*. That's the whole company.

## The core loop, in five moves

```
  verify .edu  ──►  build a Circle of people you know
        │                    │
        │                    ├── suggested by MUTUAL DEGREE, never by looks
        │                    ├── every add opens a channel immediately
        │                    └── hard gate: 3 channels before you can write
        ▼
     WRITE  ──►  pick a person (or a 5–8 person Circle Drop)
        │        draft-first · prompt seeds · pre-send tone pass
        │        seal mode: Sealed · 48h (default) · Circle Drop
        │        ⚠ PII hard-block · ⚠ crisis check · everything else advisory
        ▼
   DELIVER  ──►  cover traffic + 10–90 min jitter + nightly waves
        │        so arrival time reveals nothing about send time
        │        ⏱ 48h dissolve if unopened  (kills social pressure)
        ▼
    READ  ──►  sealed envelope → a deliberate tap → the seal breaks (420ms)
        │        one optional warmth tap, 3/day, no counts anywhere
        ▼
   REPLY / SIGN  ──►  reply stays anonymous
                        │
                        └── ▸ Sign it  ← THE MOMENT
                            mutual, consensual, never silent,
                            never to anyone else, forever optional
```

## What makes it different, in one line each

- **No cold DMs, ever.** A channel must exist before you can write. One rule kills most abuse.
- **No avatars, ever.** Anonymity is enforced by the interface, because a policy can be leaked and a design cannot.
- **No counts, ever.** Reply counts turn people into content; the moment someone has a visible "12 confessions received," every sender optimizes for cruelty.
- **No public feed, ever.** Not in v1, not behind a flag, not for engagement. The most-requested and most dangerous feature.
- **Text only, no images.** In a small graph, a photo is an identity. Revisiting this requires a new anonymity design, not an upload endpoint.
- **The privacy receipt.** The trust panel is typeset like a security tool, not an About page. It is the most shareable asset the product owns.

## The pitch, for an investor

College is the ideal launch market for a graph-based anonymous product: everyone is inside a three-mile radius, "we go to the same school" is trust that costs nothing, and every graduating class wipes the network and re-seeds it. Distribution is an RA with a sticker sheet and a QR code on a vending machine. The product is socially viral by construction, because "someone should confess to you" is a gift, not an ad.

**North Star: signed confessions per weekly active user.** It only increments when someone was brave enough to write, someone was willing to read, and both accepted each other. It cannot be inflated by engagement mechanics, and it is the only metric that measures a connection actually completed.

**Revenue:** campus partnerships (orgs, career fairs, bookstore, later institutional advising dashboards) plus safety-as-premium — sign faster, unsend any time, more Circle members, Stealth mode. No ads, ever, in the content surface. No paid visibility boost, ever: a purchased impression would be a lie about a relationship.

**The honest risk, stated up front:** in a small graph, a determined person may work out who sent something. That cannot be engineered away. What we can do is make the app's promise precisely true, make inference expensive and noisy, and say so plainly in the product. An app that overclaims here is worse than one that admits the limit.

**Kill criteria, written down in advance** (`01` §11) so they can't be renegotiated when the numbers dip: under 15% week-one send rate twice running, report rate above 8 per 1,000, any unexplained deanonymization event, or median first-reply above 72 hours.

## Try it

Open [`prototype/index.html`](prototype/index.html) in any modern browser. It is a static
file — no build step, no server, no `npm install`. Fonts load from Google Fonts; offline
they fall back to the system stack and nothing breaks.

What you get, on the left, is a full **screen index** — all 32 routes, named. Inside the
phone is the real thing: tap anything. Things worth trying:

| Try this | Why it matters |
|---|---|
| **Welcome → How it works → Age gate** | The `.edu` and 18+ boundary, including the refusal path |
| **Verify → Build your circle** | Watch the **3-channel hard gate** block writing until it is satisfied |
| **Inbox → a thread → Sign it** | The whole thesis in one flow. It is mutual, and it is forever optional |
| **Sign sheet → share my name** | The moment. Note that *they* are asked, separately, and the answer is never shown to you |
| **Composer → "contains a phone number"** | PII is a **hard block**, not a warning. Then pick a seal mode |
| **Report → Rate limit → Crisis** | The three screens that decide whether this is a product or a liability |
| **The theme toggle, top right** | Every screen is designed in both light and dark, not just inverted |
| **The annotation strip under the phone** | On every screen, stating the intent and the rule being enforced |

The prototype is deliberately honest about being a prototype: cover traffic, delivery
jitter, and the delivery worker are *described*, not simulated. Nothing sends anywhere.

## Repo

```
docs/
  01-concept-strategy.md
  02-product-spec.md
  03-design-system.md
  04-user-flows.md
  05-wireframes.md
  06-safety-and-trust.md
  07-build-spec.md
prototype/
  index.html      entry point — open this
  tokens.css      light + dark tokens, typography
  app.css         device frame, components, responsive + reduced motion
  data.js         icons and fixture data
  app.js          state machine, all 32 routes
tools/
  contrast_check.py    WCAG 2.2 token contrast — no dependencies
  prototype_check.mjs  route + invariant harness (needs playwright)
  prototype_audit.mjs  layout / tap-target / safe-area audit (needs playwright)
```

### Checks

```bash
python tools/contrast_check.py            # 47/47 token pairs pass WCAG 2.2
node tools/prototype_check.mjs            # 32/32 routes render, all invariants hold
node tools/prototype_audit.mjs prototype  # 64 screen-theme pairs, no layout problems
```

The first two have **no dependencies** — the route harness stands up a small DOM stub
rather than pulling in a browser. The audit is the only script that needs one:

```bash
npm i -D playwright && npx playwright install chromium
```

Current results: 47/47 contrast pairs pass · 32/32 routes render with invariants intact ·
64/64 screen-theme combinations free of overflow, sub-44pt tap targets, safe-area
collisions, and webfont fallback.

## Status

The written package is complete: strategy, spec, design system, flows, wireframes, threat
model, and build spec. The **interactive prototype is also complete** — 32 screens, both
themes, real state transitions, and the flows an investor or a first engineer will
actually press through.

No production software exists yet, and that distinction matters. The prototype demonstrates
that the product can be *designed coherently*; it does not demonstrate that the anonymity
architecture *works*. The first two engineering sprints (`07` §7) are foundations and
motion, not product — the first shippable milestone is the minimum honest product, and the
second is the sprint that makes the anonymity promise true. **Do not launch before that
second sprint.**
