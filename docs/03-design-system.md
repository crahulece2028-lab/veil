# 03 — Design System: "Ink & Ember"

Tone in one line: **earnest, not cute; quiet, not loud; private, not performative.**

---

## 1. Direction & rationale

**Dark-first, dual-theme.** This is a functional decision, not a mood board. The dominant session is 11pm–1am, in bed, one hand, phone brightness low. A white app at 1am is a brighter app than a phone screen in a dark bedroom. Dark is the default; light exists for daytime org work, campus walking, and screenshots shared to group chats.

**Two type voices, and the split is the point.**
- **Chrome** (navigation, labels, buttons, settings) → **DM Sans**. Geometric, quiet, unambiguous at 13px.
- **Content** (confession body, thread replies, prompt text) → **Newsreader**. A serif with real italics. A confession should look like *a note someone wrote*, not like a form field. Switching to a serif the instant a user writes something personal is the cheapest, most effective signal in the whole system.
- **Proof** (privacy receipts, sealed IDs, hashes, retention copy) → **JetBrains Mono**. Monospace reads as "specification, not marketing." The anonymity promise looks credible when it is typeset like an engineering artifact.

**One accent that means one thing.** Ember `primary` is the app: actions, seals, identity. Honey `accent` is reserved *exclusively* for the two moments that matter — the sender's identity in a signed thread, and warmth. Nothing else is honey. When honey appears, something real just happened. This is the discipline that keeps a warm-toned brand from becoming noise.

**The palette is warm on purpose, and the warmth is functional.** The subject is a late-night confession, so the ground is a warm near-black ink rather than a blue-black: it reads as lamplight, not as a screen. The single ember accent is the color of a match being struck, which is exactly what "sending" and "signing" are. A cool blue-violet would have been the reflexive choice for an anonymous messenger; it is also the most common AI-era product look, and it makes the product look like infrastructure instead of a letter.

**Three warm hues, and a rule for keeping them apart.** `primary` (ember orange), `warn` (bronze), and `accent` (pale honey) all live in the warm family, separated by hue angle and lightness rather than by being in different families. That is only safe because of a checked constraint: **`warn` and `accent` are never visible in the same view** — warnings appear on verification, tone, drafts, and rate-limit screens; honey appears only on signed states and the thread. If a future screen needs both, re-tune `warn` toward ochre before shipping it.

**No emoji, anywhere, as structure.** Icons are a single family (Phosphor, 1.5px stroke, rounded terminals) so the interface reads as one hand. Emoji in a confessional app would undercut the entire tone on contact.

**Motion is expensive and rare.** Three signature animations in the whole product (seal break, send launch, sign reveal). Everything else is a 120–260ms cross-fade. Restraint is what makes the three moments land.

## 2. The anonymity visual language

This is the part that makes the concept credible in the hand, so it gets the most specification.

### 2.1 No avatars. Ever.

There is no avatar component in the system, and adding one requires a design review with the founder. Not a silhouette, not initials, not a letter tile, not a generated gradient blob — every one of those is a quasi-identifier, and in a campus of 30,000 with a dense graph, a consistent "you recognize that gradient" is enough. The anonymity promise is enforced by the *absence* of a distinguishing mark, which means the absence has to be an architectural rule rather than a stylistic preference.

**What replaces it: the Veil.** Every anonymous participant is rendered as the same neutral object — a soft-edged rounded field filled with the theme's `veil` color, carrying only:

- the person's **pronoun set** ("she/her", "they/them") — the one volunteered attribute that helps a reader address the person correctly
- an optional **single mood word** the person sets themselves ("tender", "stupid", "sorry", "brave")
- nothing else, ever, and it is the same for a senior and a freshman

### 2.2 The Seal

The core object of the system. A closed seal is a 44pt glyph in `seal` ember: a soft concentric form with a single notch, with a 1px inner highlight on the top edge only. It has exactly four states:

| State | Form | Used for |
|---|---|---|
| **Sealed** | Closed, flat | Waiting to be opened |
| **Breaking** | Notch splits, 420ms, inner glow rises | The open ritual (§5) |
| **Open** | Open ring, hollow, 60% opacity | Read, no longer new |
| **Signed** | Open ring with a honey stroke drawn across it (§5) | Both parties revealed |

**Two rules about the seal:** it is the *only* element allowed to glow, and it is the only element allowed to be ember as a decorative (non-interactive) color. That reservation is what makes a sealed envelope recognizable in a fast scroll at arm's length in a dark room.

### 2.3 Proximity as a metaphor for connection

A person's trust ledger is rendered as a stack of overlapping small circles — each one a mutual, each one with only a 2px border and no content inside. Two people with four mutuals share four arcs. You can see how strongly you're connected to a stranger before you read a word of theirs, using shape rather than text. This is the one place the UI gets decorative, and it earns it by carrying data.

### 2.4 The privacy receipt

The trust panel, and the most important screen in the product, is typeset as a **monospace receipt** — a fixed-width block with dotted leaders and itemized lines, like a bank statement or a Tor receipt:

```
┌──────────────────────────────────────┐
│ WHAT WE HOLD ABOUT YOU              │
├──────────────────────────────────────┤
│ real identity .......... encrypted  │
│ campus ................. Northside U │
│ send timestamps ......... discarded  │
│ delivery timing .......... randomised │
│ this device ............. you can    │
│                           delete it │
│ a moderator can see you .. only with │
│                           a logged   │
│                           reason,    │
│                           never the  │
│                           person you │
│                           wrote to   │
├──────────────────────────────────────┤
│ ▸ read the full list (34 items)      │
└──────────────────────────────────────┘
```

The aesthetic argument: **overclaiming is ugly.** A screenshot of this panel should look like something you'd find in a security tool, not something you'd find in an About page. It is also the single most shareable asset the product owns — it is the thing a student screenshots into a group chat to convince a friend to install.

## 3. Color tokens

Both themes fully specified and machine-verified. `tools/contrast_check.py` validates all 53 pairs against WCAG 2.2 (4.5:1 body, 3:1 large/non-text); current status: **53/53 pass**.

### 3.0 Gradient surface tokens

The public landing page paints text directly onto a warm gradient, so the gradient is
treated as a first-class color surface with its own validated text colors rather than
an ad-hoc `linear-gradient` in a stylesheet.

| Role | Token | Dark | Light | Notes |
|---|---|---|---|---|
| Gradient light stop | `grad-a` | `#F0C978` | `#F0C978` | Honey, matches `accent` |
| Gradient dark stop | `grad-b` | `#E0703A` | `#D9762B` | Ember. Lightened in light theme: the dark-theme value fails 4.5:1 against near-black text. |
| Text on gradient | `on-grad` | `#1A1004` | `#1A1004` | 11.9:1 on the light stop, 5.9:1 on the dark stop |
| Card sitting on a gradient | `grad-card` | `#FBF3E4` | `#FDF7EC` | Cream, so a card on the gradient is legible in both themes |
| Text on that card | `on-grad-card` | `#241A0C` | `#241A0C` | 16:1 |

These five exist because the marketing surface is a separate register from the app
(see 3.4). The stops are opaque, which is what lets `tools/contrast_check.py` verify
them as ordinary pairs.

### 3.1 Dark (default)

| Role | Token | Hex | Notes |
|---|---|---|---|
| Background | `bg` | `#141110` | Warm near-black ink, never pure gray — pure black reads cheap and OLED-smarteen. |
| Card | `surface` | `#1D1A17` | |
| Raised card | `surface-raised` | `#272320` | Sheets, pressed rows, tooltips |
| Sunken well | `surface-sunken` | `#0E0C0B` | Compose field, code blocks — the "inside" of a page |
| Hairline | `border` | `#3E3733` | Decorative, 1px. Never used to carry meaning alone. |
| Text primary | `text-primary` | `#F8F4EE` | 14.4:1 on surface |
| Text secondary | `text-secondary` | `#C9BDB1` | 8.4:1 on surface |
| Text tertiary | `text-tertiary` | `#A2968A` | 5.4:1 on surface — timestamps, metadata. Still AA. |
| Primary / ember | `primary` | `#E0703A` | Actions, seals, focus ring |
| Primary pressed | `primary-pressed` | `#EE8A4E` | In dark themes, pressed lightens. |
| On primary | `on-primary` | `#1A1004` | Near-black label on ember |
| Accent / warmth | `accent` | `#F0C978` | **Restricted**: signed identity + warmth only |
| On accent | `on-accent` | `#1E1503` | |
| Success / sage | `success` | `#8FC79A` | Verified, signed, delivered |
| Warning / bronze | `warn` | `#C08A4A` | Timer expiring, unverified claim |
| Danger / oxblood | `danger` | `#D1524F` | Report, delete, hard block |
| Veil field | `veil` | `#272320` | The anonymous-person object |

All 53 checked pairs are validated by `tools/contrast_check.py`, which parses
`assets/tokens.css` directly — the single stylesheet shared by the landing page and
the prototype. The checker holds no hex values of its own, so the spec and the build
cannot drift apart.

### 3.2 Light

| Role | Token | Hex | Notes |
|---|---|---|---|
| Background | `bg` | `#FAF6F0` | Warm paper |
| Card | `surface` | `#FFFFFF` |
| Raised card | `surface-raised` | `#FFFFFF` |
| Sunken well | `surface-sunken` | `#F2EBE1` |
| Hairline | `border` | `#E0D5C6` |
| Text primary | `text-primary` | `#1A1512` |
| Text secondary | `text-secondary` | `#5A4F45` |
| Text tertiary | `text-tertiary` | `#6E6155` |
| Primary | `primary` | `#A8460D` |
| Primary pressed | `primary-pressed` | `#8A380A` |
| On primary | `on-primary` | `#FFFFFF` |
| Accent | `accent` | `#8A6A1F` |
| On accent | `on-accent` | `#FFFFFF` |
| Success | `success` | `#2F6B3F` |
| Warning | `warn` | `#7A5800` |
| Danger | `danger` | `#A32B33` |
| Veil field | `veil` | `#F2EBE1` |

### 3.3 Rules that survive both themes

- **Theming is token-only.** No per-screen hex anywhere. A theme must be expressible by swapping one map.
- **Color is never the only signal.** Every state also carries a shape change, an icon, and a text label. Heat levels, verification tiers, and report severities each have a distinct glyph (`check-circle`, `seal-check`, `alert-triangle`, `shield`, `lock`).
- **No red for anything emotional.** `danger` is reserved for destructive and reporting actions. A rejected confession is *not* red; it is `text-tertiary` on `surface`. Shame is a design system, not a palette.
- **Report and block screens are deliberately calm** — `surface`, no full-bleed red, no warning triangles larger than 20pt. The goal is a user reporting a threat to feel safe doing paperwork.

### 3.4 Two registers: the app and the marketing surface

The system has two deliberately different registers, and conflating them is the mistake
to avoid.

**The app** (`prototype/`) is governed by the whole of this document. Ink-and-ember on
near-black, surface steps and hairlines, shadow reserved for genuinely floating layers.

**The public landing page** (`index.html`) is a marketing surface and borrows the
register people recognise from consumer social apps: a full-bleed warm gradient, large
rounded cards, pill buttons, a single mobile-first column. It shares every token with
the app, so both themes stay coherent.

Three of the anti-patterns in section 10 are relaxed there, on purpose and only there:

- **Full-bleed gradient background.** Allowed on the landing page only. The rule that
  survives everywhere is *gradient text* — headline text on the gradient uses the
  solid `on-grad` token, never a gradient fill, and every pairing is contrast-checked.
- **Tinted shadow on the card stack.** The hero card is a genuinely floating object, so
  a shadow is allowed. It is a `color-mix` of `on-grad`, not a coloured glow, and it
  exists to separate the stack from the gradient.
- **A card stack.** It is decoration, not a gesture. There is no drag, no fling, no
  swipe handler, and no route behind it — and the page states outright that there is no
  swiping. The product promise is *Sign it*, not discovery, so a swipe metaphor would
  contradict the thesis. The cards carry no photographs or avatars, for the same reason
  the app has none.

The app itself keeps every rule in section 10 without exception.

## 4. Typography

```
Chrome      DM Sans        400 / 500 / 700
Content     Newsreader     400 / 500 / 400italic / 600italic
Proof       JetBrains Mono 400 / 500
```

| Token | Size / Line | Weight | Family | Notes |
|---|---|---|---|---|
| `display` | 32 / 38 | 600 | DM Sans | Tight tracking (-0.02em). Onboarding only. |
| `title` | 24 / 30 | 600 | DM Sans | Screen titles |
| `section` | 17 / 24 | 700 | DM Sans | Section headers, list group labels |
| `body` | 15 / 22 | 400 | DM Sans | All chrome text |
| `bodyStrong` | 15 / 22 | 500 | DM Sans | |
| `meta` | 13 / 18 | 400 | DM Sans | Timestamps, counters. `text-tertiary`. |
| `label` | 13 / 16 | 500 | DM Sans | Buttons. +0.01em tracking. |
| `caption` | 11 / 14 | 500 | DM Sans | Badges, chips. Uppercase only, +0.06em. |
| `letter` | 20 / 32 | 400 | **Newsreader** | **The confession body.** 1.6 line-height, measure capped at 34em. |
| `letterSmall` | 17 / 28 | 400 | Newsreader | Thread replies |
| `letterItalic` | 20 / 32 | 400 italic | Newsreader | Emphasis, pull-quotes |
| `signature` | 22 / 28 | 500 | **Newsreader** | Appears only in a signed thread, `accent`, with an SVG stroke-draw (§5.3) |
| `proof` | 12 / 18 | 400 | **JetBrains Mono** | Privacy receipt, sealed IDs, retention copy |

**Dynamic Type:** all sizes are relative and must survive 200% without truncation of a confession. Since confession length is user-authored and unbounded, the thread view never clamps text — it grows and the composer floats above it with a `surface` scrim. Verify at 310pt on a 390pt-wide device, the actual worst case.

**The measure rule:** confession text is capped at 34em and centered in the column. On a tablet, the thread view never goes full-bleed — a 900pt-wide line of serif is unreadable and instantly cheap-looking.

## 5. Motion

Three signature animations. Tokens:

```
duration   instant 120   quick 180   base 260   seal 420   sign 640
easing     standard  cubic-bezier(.2,.8,.2,1)     entrances
           enter     cubic-bezier(.16,1,.3,1)     exits
           exit      cubic-bezier(.4,0,1,1)       120ms
spring     iOS      CASpringAnimation(mass .6, stiffness 220, damping 26)
```

### 5.1 Seal break (420ms) — opening a confession
Notch splits along its seam; the inner glow rises from 0 → 1 opacity while the outer form scales 1 → 1.04; the content cross-fades in beneath at +120ms, so the two never compete. `UIImpactFeedbackGenerator(style: .medium)`, Android `HAPTIC_MEDIUM`. This is the app's signature and it is allowed to be slow.

### 5.2 Send launch (260ms)
The seal forms, scales 0.9 → 1, then translates up and off with `enter` easing while fading over the final 40%. On exit it is replaced by a countdown chip that ticks — **the send is visibly a departure, not a delivery.** Reinforces batching and cover traffic, and quietly communicates that the sender is not watching.

### 5.3 Sign reveal (640ms)
The open seal's ring draws a honey stroke across itself (`stroke-dashoffset`, 420ms, `enter` easing), then the peer's mood word and pronoun set fade in beneath, then a single 1px honey rule draws left-to-right and the `signature` type lands. Restrained, one time, never on a list, never repeated. Signed is a *moment* or it is nothing.

### 5.4 Reduced motion

With `prefers-reduced-motion` / `reduce motion` enabled:
- Seal break → 160ms cross-fade. No split, no glow, no scale.
- Send launch → the seal fades in place, then is replaced. No translation.
- Sign reveal → the honey stroke and rule appear instantly; only the type cross-fades over 160ms.
- No parallax, no autoplay, no scroll-linked anything, anywhere in the app.

Nothing in this product *auto-plays*, and no screen is a carousel. There is no situation where a user cannot get information without waiting for motion.

## 6. Spacing, radius, elevation

**Spacing** — 4pt base: `2 4 8 12 16 20 24 32 40 48 64 80`. Screen gutters 20; card padding 16; card gap 12; section separation 32; between major app sections 48–64. Haptics and hit targets: **44pt minimum iOS / 48dp minimum Android**, expanded hit area wherever the visual is smaller (envelope glyph, warmth tap, chip X).

**Radius** — `sm 8` (chips, inputs) · `md 14` (buttons, small cards) · `lg 20` (cards, rows) · `xl 28` (sheets, the seal-break stage) · `full` (pills, the warmth tap). One family, no exceptions.

**Elevation** — dark themes do not use drop shadows for hierarchy; they use surface steps plus a hairline. Shadow is reserved for genuinely floating things: the sheet scrim, the composer bar, the seal-break stage. Light theme uses a single soft shadow, `0 1px 2px rgba(25,19,37,.06)` plus `0 8px 24px rgba(25,19,37,.08)` for sheets. **No glow, no gradient border, no colored shadow.**

**Safe areas** — every fixed header, tab bar, and CTA bar respects the notch and the home indicator. Scroll content gets bottom inset = bar height + 16, or the last thread reply is unreachable. Verified in `05-wireframes.md` and the pre-ship checklist.

## 7. Components

### The five tabs
`Write` (center, primary ember FAB-ish) · `Inbox` (with an unread dot, count only — never a preview) · `Circle` · `Pulse` · `You`

Order rationale: the app is a *composing* instrument, so Write is centered and permanently reachable, not buried in a corner. Inbox is adjacent because the read/write loop is the product. `Circle` is network management — frequent early, rare later, so it sits low. `You` holds the trust panel, which is deliberately not given a tab of its own: **the privacy panel is part of your profile, not a destination.**

### Component inventory
`Seal` (4 states) · `EnvelopeRow` (sealed, unread, expiring, open, signed) · `VeilChip` (pronoun set + mood word) · `TrustLedger` (verification tiers + mutual arcs) · `LetterBlock` (serif confession, generous measure) · `ThreadComposer` (floats, `surface-sunken`, serif) · `WarmthTap` (single-tap, 3/day, no counts) · `SignSheet` (bottom sheet, one primary action) · `PrivacyReceipt` (monospace block, itemized) · `RateLimitNotice` (unshaming, states the number) · `ChannelRow` (person + relationship + channel state) · `PromptSeed` (serif italic, dismissible) · `PulseCard` (aggregate + share) · `EmptyState` (always states a real number) · `SealBreakStage` (full-screen, single action)

### Component rules worth defending in review
- `EnvelopeRow` **cannot** render sender or content. There is no prop to pass them. The component's type signature enforces the product's central promise at the type level.
- `LetterBlock` has no `lines` prop. Confessions are never truncated with an ellipsis anywhere; the thread grows.
- `EmptyState` requires a `count` prop. "Nothing here" is not an acceptable string.
- `RateLimitNotice` is written in second person without blame. Templates in `04-user-flows.md` §9.

## 8. Copy voice

| We write | Not this |
|---|---|
| "Sign it when you're ready. Or don't — this stays anonymous either way." | "Ready to reveal your identity? 🔥" |
| "This will dissolve in 14 hours if it isn't opened." | "Your confession expires soon!" |
| "You've sent a few of these. Give it a few days." | "Sending limit reached. You may have been flagged." |
| "A moderator can see your identity only to respond to a report, and it's logged." | "Your privacy is protected with military-grade encryption." |
| "Someone shared their name." | "Maya wants to connect with you!" |
| "Nothing here is public. Ever." | "Share the love 💜" |

Rules: lowercase-leaning, no exclamation marks in product copy, no emoji, no confetti, no "you're a star," never quantify the reader's social worth. Every sentence about a person is about the *action*, not the *feeling of the action*. **Second person, present tense, no adjectives about the user.** The app is a quiet room; the copy's job is to leave it quiet.

## 9. Accessibility commitments

- All 53 token pairs verified by `tools/contrast_check.py` in CI on every token change. Failure blocks the build.
- Full Dynamic Type support to 200%; no truncation of user content; verified at 310pt.
- Every icon-only control has an accessible name and announces its state (`sealed`, `signed`, `expired`, `selected`).
- Decorative glyphs are `aria-hidden` / `isAccessibilityElement = false`; the seal is a single labelled element, not three nested shapes.
- The seal-break stage is a modal: focus trapped, focus moves to the heading on open, returns to the originating row on close, and the scrim is dismissible with Escape / swipe.
- Never swipe-only. Every gesture (dismiss, open, react) has a button equivalent. Delete, recall, and report each have an explicit labeled control.
- Warmth is a real `button` with a label and a pressed state, not a tap target on an image.
- Crisis interstitial: `role="alertdialog"`, focus trapped, resources reachable by keyboard, never auto-dismissed.
- Color is never the sole carrier of state; each state also has a glyph and a text label.
- `prefers-reduced-motion` fully honored per §5.4.

## 10. Anti-patterns explicitly banned

These are banned in the app without exception. The three that the public landing page
relaxes on purpose are listed in §3.4, and only that page is exempt.

Emoji as structural icon · avatar components · like counts or reply counts · public feeds · streak/XP/badge systems · red for emotional states · carousels · autoplaying anything · gradient text · colored glow shadows · hero images · a "swipe" metaphor for discovery · the word "anonymous" in a celebratory tone · confetti on any send · a "reach" or "impressions" metric surfaced to users · copy that describes security without being literally true.
