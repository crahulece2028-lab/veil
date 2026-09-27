# 04 — User Flows

Notation: `▸` step · `⟶` transition · `⚑` decision · `⤳` branch · `⚠` safety/moderation touchpoint

---

## 1. Flow map

```
                    ┌──────────────────────────────┐
                    │  LANDING / VALUE PROP        │
                    └──────────────┬───────────────┘
                                   ▸ 18+ gate
                                   ▸ .edu verify
                    ┌──────────────▼───────────────┐
                    │  BUILD YOUR CIRCLE           │
                    │  contacts → mutuals → orgs    │
                    │  ⟶ ≥3 channels REQUIRED       │
                    └──────────────┬───────────────┘
                                   ▸
        ┌──────────────────────────┬──┴───────────────────────────┐
        ▼                          ▼                              ▼
┌───────────────┐        ┌──────────────────┐          ┌──────────────────┐
│ WRITE         │        │ INBOX            │          │ DISCOVER         │
│ prompt/draft  │        │ sealed envelopes │          │ suggested by     │
│ → tone pass   │        │ → seal break     │          │ mutual degree    │
│ → seal mode   │        │ → thread         │          │ → person sheet   │
│ → launch      │        │ → reply/warmth   │          │ → open channel   │
└───────┬───────┘        │ → sign it        │          └──────────────────┘
        │                └────────┬─────────┘
        │                         │
        └────────► THREAD ◄───────┘
                      │
                      ├── ▸ SIGN IT (mutual reveal)  → signed archive
                      ├── ▸ "not for me" / mute / report
                      └── ▸ dissolve (48h) / recall
```

## 2. Onboarding (first run, target ≤ 3 minutes to first send)

| # | Screen | Behavior | Notes |
|---|---|---|---|
| 1 | **Value prop** | One screen, one sentence, one seal animation on loop-free first render. Two buttons: `Verify your campus` / `How it works`. | The `How it works` sheet shows the seal break and a Sign example. It is the only onboarding animation worth the budget, because it teaches the core ritual before asking for anything. |
| 2 | ⚑ **Age gate** | "Are you 18 or older?" Two buttons. **No / Yes** routes to a dead-end, not a dismissible sheet. | Before email entry. Non-negotiable. |
| 3 | **Campus search** | Searchable list of enabled institutions. K-12 institutions do not appear at all — the directory simply does not contain them. | Institution unavailable → "This campus isn't open yet. Invite 5 people and we'll turn it on." Captures demand and seeds a launch queue. |
| 4 | **Email verify** | Enter `.edu` → OTP → verified. | Post-success: "You're verified at Northside." Then straight into §3. |
| 5 | **Your Veil** | Pick a **color** (from an 8-swatch set, all AA-compliant) and a **pronoun set**. Optional mood word, skippable. | No avatar, no name field, no handle. Copy: *"This is how you'll appear. No photo, no name, no handle."* The screen is deliberately a bit anticlimactic — that is the message. |
| 6 | **Contacts (optional)** | Explicit permission rationale first, then OS picker. Matches against verified campus emails only; non-matches discarded server-side. | Declining is fine and is not penalized — say so: "Skip for now. You can add people later." |
| 7 | **Mutuals** | "Who do you know here?" A grid of 4–6 candidates with the *reason*: "You and Dana both know Priya", "You're both in Rowing". Tap to add. | ⚑ Each confirmation **immediately opens a channel**. This is why the flow works: the user never reaches a dead end. |
| 8 | **Orgs & cohort** | Multi-select orgs (self-reported, marked unverified), plus dorm and class year. | Skippable in one tap. |
| 9 | ⚑ **Channel gate** | If < 3 channels: a progress state, not an error. "You have 1 of 3 people to write to. Add 2 more to start writing." Inline suggestions, no dead end. | Hard gate per `02-product-spec.md` §3.2. |
| 10 | **Pulse preview** | One aggregate card, "Here's what your campus is saying this week." | Ends onboarding on the community, not on an empty inbox. It is the best available promise that the network is alive. |

**Re-onboarding after dormancy** (returning user, 90+ days): skip 1–4, land on Circle with a single line — "3 people you know joined Veil since you were last here." Reactivation, not a quiz.

## 3. Building the network (`Circle` tab)

| Surface | Content | Primary action |
|---|---|---|
| **Suggestions** | Ranked by mutual count, reason stated on every row. Empty state: *"No suggestions yet. Add 3 more people and we'll find the ones you share."* | `Add` |
| **Your people** | Grouped by relationship (Mutuals / Org / Dorm / Class year). Each row: VeilChip, trust ledger arcs, channel state, last-activity (relative, coarse — "this week" / "a while ago" — never a timestamp). | Open sheet |
| **Sign-in codes** | Your 6-char code + "share it with someone you know here." | Copy |
| **Invites received** | Pending accepts. | Accept / Decline |

**Accepting an invite** is the only path to a channel with someone you have **zero** mutuals with, and it is symmetric: both sides must accept. UI copy on both sides: *"You'll be able to write to each other anonymously. You can close the channel any time."* Closing is one tap and is never disclosed to the other party.

## 4. Send flow

```
 Composer (serif, sunken well)
    │
    ├─▸ 0 chars ────────────► PromptSeed appears above the field
    │                          ("Say the thing you said three times
    │                           in the group chat.")   dismissible
    │
    ├─▸ tap Recipient ──────► ChannelPicker (sorted by relationship)
    │                          · 1 person  → 1:1
    │                          · 5–8       → Circle Drop
    │                          · >8       → not offered, ever
    │
    ├─▸ live tone pass (debounced 400ms, non-blocking)
    │      ├ cruelty      ──► inline advisory + "send to a Circle Drop instead"
    │      ├ crush signal ──► inline advisory + "keep it anonymous" (default)
    │      ├ crisis       ──► ⚠ CrisisInterstitial (§6.5) — send never fires
    │      └ PII          ──► ⛔ HARD BLOCK with explanation
    │
    ├─▸ tap Seal mode ─────► Sealed · 48h (default) · Circle Drop
    │
    └─▸ Send ──────────────► ▸ 24h unsend window shown
                              ▸ SealLaunch animation (260ms)
                              ▸ Batched: "Delivering within the hour."
                              ▸ Sent state in Drafts → "Sealed · 48h"
```

**Post-send confirmation** (a sheet, not a toast):
> **Sealed.** It arrives within the hour and dissolves in 48 hours if it isn't opened.
> You can unsend for 24 hours. `Unsend`

Rules: never a "sent ✓" that implies instant delivery. Never a "Delivered" state. The sender's UI must never contain the word *delivered* — the product is built on the sender not knowing when, or whether, anyone is looking.

## 5. Receive & respond flow

```
 Inbox row (sealed, unread dot, age, timer)
    │
    ▸ tap ──► SealBreakStage (full-screen, ONE action)
    │             "This seal is yours to break."
    │             content preview: ░░░░░░░░░░░ (no sender, no length, no excerpt)
    │             [ Break the seal ]
    │
    ├─► 420ms SealBreak ──► Thread view
    │        LetterBlock (serif, 20/32)
    │        VeilChip: pronoun set + mood word + mutual count
    │        "she/her · tender · 3 mutuals"
    │
    ├─▸ WarmthTap ────────► 1 tap, 3/day, no count, no reciprocity prompt
    │
    ├─▸ Reply ────────────► ThreadComposer (serif) → same thread, still anonymous
    │
    ├─▸ Sign it ──────────► SignSheet (§5.2)
    │
    └─▸ ⋯ menu ───────────► Not for me · Mute · Report · Copy text · Block
```

### 5.1 "Not for me"
One tap, no dialog. Content removed. Sender receives exactly: *"This one wasn't for you."* No reason, ever. Not a report, no heat, no cooldown for the sender. Rationale: a reader must be able to decline at zero social and zero system cost, or they will instead become a harasser in the only direction available to them.

### 5.2 Sign flow (the core moment)

```
 Thread, any point  ▸  [ Sign it ]
        │
        ▼
 ┌──────────────────────────────────────────────┐
 │  Sign it                                     │
 │                                              │
 │  Signing shares YOUR name with the person    │
 │  you're writing to. It does not share their  │
 │  name — signing is mutual, and they'll choose │
 │  their own.                                   │
 │                                              │
 │  You stay anonymous to everyone else, always.│
 │                                              │
 │  ┌────────────────────────────────────────┐  │
 │  │  they/he · "stupid" · 3 mutuals       │  │  ← the Veil you will be shown
 │  └────────────────────────────────────────┘  │
 │                                              │
 │  [ Share my name ]        [ Keep it anonymous]│
 └──────────────────────────────────────────────┘
        │                              │
        │ share                        │ keep
        ▼                              ▼
  ▸ CONFIRMATION (second step, mandatory):
    "Your name is now visible to one person on this
     campus. You can change your mind until they
     sign back or reply again."

  [ Sign it ]  [ Cancel ]
        │
        ▼
  ▸ 640ms SignReveal — honey stroke draws across the
    open seal, their pronoun set + mood word fade
    in, honey rule draws, signature lands
        │
        ▼
  ┌──────────────────────────────────────────────┐
  │  You shared your name.                       │
  │                                              │
  │  They haven't decided yet. That's fine.      │
  │                                              │
  │  [ Sign it too ]   [ Keep it anonymous ]     │
  │  ──────────────────                          │
  │  · they can see your name now                │
  │  · no one else can · not even moderators     │
  │    show it as "unverified" until they reply  │
  └──────────────────────────────────────────────┘
```

**After they sign back:** the thread becomes `signed`, both see each other's names, a honey rule marks the conversation permanently, and both get a one-time `Keep this thread` / `Remove from archive` choice.

**The states that must never exist** (spec these *out* in code review, because every one of them will be proposed):
- "Pending" / "Waiting for them to sign" states
- A re-prompt after 24h or any later push notification
- A count of how many people you could sign with
- Silently revealing a peer because they signed first
- Any indication that a peer is *considering* signing

## 6. Moderation & safety touchpoints

| Where | Trigger | Behavior |
|---|---|---|
| Composer | PII pattern (real name / number / room / handle of a third party) | ⛔ Hard block, send refused, inline explanation of what was stripped |
| Composer | Self-harm language | ⚠ CrisisInterstitial: resources first, `Send anyway` never offered for a self-harm signal about the *author*. Intervening on a third party's stated self-harm is a P1 report. |
| Any thread | Report | `ReportSheet` → reason (required) → optional context → submit. Sender is never told. |
| Inbox row | Report before opening | Available from the row's overflow without opening — reporting should not require reading the thing twice. |
| Cooldown | 5 no-replies on a channel | Channel paused 30 days. Copy: *"You've sent a few of these. Give it a few days."* |
| Rate limit | Any limit hit | `RateLimitNotice` states the number, the reset time, and the link to the limits in Settings. |
| Account | Report threshold hit | `HeatWarning` at the first one, framed informationally. Escalation ladder in `06-safety-and-trust.md` §4. |

### 6.5 CrisisInterstitial copy
Full flow and escalation in `06-safety-and-trust.md` §5. Rules: `role="alertdialog"`, focus trapped, never auto-dismissed, campus counseling and 988 both surfaced, "notify someone you trust" offered, and the text never implies the app is a crisis service — it says plainly that it is not, which is why it is showing this.

## 7. Return & re-engagement

| Trigger | Message | Why it works |
|---|---|---|
| Confession opened | "Someone responded to your confession." | The only notification that would make someone check, and it costs the sender nothing. |
| Thread reply | "Someone replied. Still anonymous." | The reassurance is the payload. |
| Peer signed | "Someone shared their name." | Once, no pressure, no count. |
| Dissolution imminent (< 4h, unopened) | "A confession is waiting. It dissolves in 4 hours." | No sender, no content. FOMO without a hook. |
| Dissolution happened | "A confession dissolved unread." | One notification, then nothing. Silence here is the humane choice. |
| Mutual joined | "3 people you know joined Veil." | Graph growth, no social cost. |
| Warmth received | "Someone sent you warmth." | No indication of who, no reciprocity prompt. |

Banned notifications: anything containing confession content, a sender name, or a counter. Push payloads are generic strings — never templated with recipient or sender data, because a lock screen is a deanonymization channel.

## 8. The five hardest screens

| Screen | What makes it hard |
|---|---|
| **SealBreakStage** | Has to feel like a threshold and still be trivially dismissible and fully accessible. It is the only full-screen takeover, so it must be perfect and must be skippable. |
| **PrivacyReceipt** | Has to be genuinely complete and still readable at 13px on a phone. The hard part is resisting the urge to be clever with the dotted leaders. |
| **SignSheet** | Has to be emotionally warm and legally unambiguous in eight lines of text, with a two-step confirm, and must not read as pressure. |
| **Empty inbox** | The worst moment in the product's life. Fixed by showing a real number ("14 people who know you are on Veil") and a single action, never by a joke, an illustration, or a "check back later." |
| **ReportSheet** | Has to be fast, calm, non-punitive-looking, and it has to be obvious that reporting is safe. No red bleed, no warning iconography at scale. |

## 9. Copy templates for states that usually get written badly

| State | Copy |
|---|---|
| No channels yet | "You have 0 people to write to. Add 3 people you know and you can start." |
| < 3 channels | "You have 1 of 3 people to write to." |
| Draft limit | "You have 3 drafts saved. Send one to keep writing." |
| Rate limit (per recipient) | "You've sent 3 confessions to them in the last 7 days. Try again on Tuesday." |
| Rate limit (daily) | "5 a day is the limit. You have 1 left." |
| Cooldown | "You've sent a few of these and they haven't come back. Give it a few days — this channel reopens on the 14th." |
| Unsends unavailable | "You can only unsend within 24 hours. This one's been out for 3 days." |
| Recall after reply | "They replied, so this can't be recalled. Delete it instead — they won't see it." |
| Empty inbox | "Nothing sealed yet. 14 people who know you are on Veil." |
| Nothing suggested | "No suggestions yet. Add 3 more people and we'll find the ones you share." |
| Not signed, and that is fine | "This stays anonymous. Signing is optional and you can do it whenever." |
| Dissolved | "A confession dissolved unread. That's all — there's nothing to see." |
| Report submitted | "Thanks. This is reviewed by a person, and they'll never know who reported them." |
| Sign confirmed | "Your name is visible to one person. No one else can see it." |
| Peer signed | "Someone shared their name. You can sign back or keep it anonymous — both are fine." |

## 10. Copy ban list

Exclamation marks in product copy · emoji · "anonymous" used admiringly · "reach", "impressions", "views" · anything implying a send was delivered · anything implying the app is encrypted "end-to-end" in a way a reader could verify but which isn't (it is encrypted at rest and in transit, and the app says exactly that) · "your privacy is safe" as a standalone claim · "unlock", "level up", "streak" · any sentence that guesses what a user feels · "we miss you" · guilt copy of any kind aimed at a user who has not sent a confession.
