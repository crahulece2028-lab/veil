# 02 — Product Specification

Companion to `01-concept-strategy.md` (which argument, this is mechanics). Read together.

---

## 1. Product principles (binding on design and engineering)

1. **Never attribute to a recipient.** There is no code path that renders a sender identity to a recipient, server-side or client-side.
2. **No cold DMs.** A channel to a person must exist before you can write to them. No exceptions for power users, no exceptions for "beta."
3. **No public feed.** Nothing a user writes is ever shown to anyone it was not addressed to. No trending, no popular, no discovery-by-content.
4. **No counts on other people's content.** No likes, no reply counts, no "X people responded," no view counts. Reactions are per-recipient and private.
5. **No paid visibility.** Ever. Monetization must never purchase a person's chance of being read.
6. **The reader is always in control.** A confession can be refused, muted, or removed at any time, and a refusal costs the sender nothing visible.
7. **Say what is true.** Any UI string that describes anonymity must be literally accurate. Overclaiming here ends the product.

## 2. Roles and objects

| Object | Notes |
|---|---|
| **Person** | One real human. Identity is verified server-side, never surfaced. |
| **Veil** | A person's anonymous in-app identity: pronoun set + color + one optional mood word. No avatar, no name-derived handle. |
| **Campus** | Hard isolation boundary. Cross-campus visibility and delivery are impossible, not merely off. |
| **Cohort** | An institution-level sub-graph used for the ≥250-member delivery floor and for cohort-scoped launches (e.g. "Northside Hall", "Class of 2028"). |
| **Channel** | A permitted 1:1 path between two people. Precondition for writing. |
| **Circle** | A person's set of real names, grouped by how they know them (mutual, org, class year, dorm). |
| **Confession** | A single addressed piece of text. 1:1 or Circle Drop. |
| **Thread** | An ordered, still-anonymous exchange. May or may not ever be signed. |
| **Sign** | A mutual, consented reveal inside a Thread. |
| **Pulse** | A k-anonymized aggregate. Never per-person. |

## 3. Onboarding and network building

### 3.1 Verification

Ordered by strength; the app tracks the highest tier achieved and shows it as a trust mark on the person.

| Tier | Method | Grants |
|---|---|---|
| T1 | `.edu` / campus-domain email OTP | Join the campus. Minimum to exist. |
| T2 | Class year + major self-report, **corroborated by ≥2 mutuals** | Full Circle write access |
| T3 | Optional student-ID photo → human review (async, ~minutes) | Verified badge on own profile |
| T4 | Optional: connect a social handle (GitHub, LinkedIn, Strava, Spotify) for corroboration only | Additional trust marks |

Hard rules:
- **18+ only.** Age gate before anything else; birthdate or a self-declaration plus .edu. K-12 institutions are not in the campus directory at all. Under-18 detected → hard stop with a clear message, not a scold.
- Email domain must map to a known campus. No free-mail fallback. No exceptions for "my school doesn't have a domain."
- T3 is genuinely optional and must be presented as optional. Making verification feel mandatory is how you get fake behavior.

### 3.2 Building the Circle (the actual cold-start work)

The first session must leave a user with a *usable* network or the product is dead on arrival. Sequence:

1. **Contact upload** (optional, up-front permission copy: *"We read your contacts to find people on this campus. We never store numbers we don't match, and never show them to anyone."*). Matches against verified campus emails only. Non-matches are discarded server-side, not retained.
2. **Mutual seeding** — the important one. Ask: *"Who do you know here?"* Present a grid of 4–6 plausible candidates derived from the shared campus graph ("You and Dana both follow @…, both in …"). Each confirmed mutual immediately **creates a channel**, so the user leaves onboarding with paths already open.
3. **Org graph** — "Pick your orgs." Membership is verified by an org admin or an email alias where possible, self-reported otherwise (marked unverified, and marked as such in the UI).
4. **Cohort selection** — dorm, class year, first-gen flag, international flag, "commuter." These power discovery and the Pulse.
5. **Threshold gate**: the user cannot reach the Write tab until they have **≥3 channels**. Do not let them into a composer with nowhere to send. This is a hard product rule, and it is why the funnel works.

Empty-state copy must be honest and specific: *"You're verified at Northside. 3 people who know you are on Veil right now."* Real numbers, from the real graph — the number itself is motivating and is proof the network is alive.

### 3.3 Discovery model

Never a swipe deck. Discovery surfaces **trust**, not appeal. Three surfaces, in priority order:

- **Suggested** (home): people you share ≥2 mutuals with, sorted by mutual count, then by recency of joining. A leaderboard of mutual count is the ranking function; attractiveness is not a variable anywhere in the ranking.
- **Your cohort**: your dorm, org, class year, shared class. Group listings, not individual cards.
- **Sign-in codes**: a physical code a trusted friend can share out of band. **A code, never a link** — a link encodes a user list and leaks your graph to anyone who intercepts it.

Notably absent: search by name for non-mutuals, proximity, "people you might know" from other campuses, and any kind of ranking by activity or photo. All of these turn a trust product into a surveillance product.

## 4. Write: the composer

### 4.1 Structure

Drafts-first, because the recipient is often the hard part and the thought is often the easy part.

- **Drafts autosave continuously** and are visible only to their author. Drafts never sync to any backup in plaintext; the trust panel states this.
- **Prompt seeds** when the composer is empty, drawn from live, benign campus patterns: *"Say the thing you said three times in the group chat."* / *"Finish this: 'I never told you that…'"* / *"Confess something you did that was braver than it felt."* Seeds are opt-out and must never be emotionally loaded toward any individual.
- **Recipient selection** is a channel picker, sorted by relationship strength. One tap to select, no search-first UX. Sending to 3 people is a Circle Drop; sending to 25 is not available at all.
- **Threading**: a composer opened from a thread replies in place. The thread view is the primary writing surface after the first message.

### 4.2 The tone pass (pre-send, non-blocking but consequential)

A client-side classification with a server-side confirmation, ~300ms, run as the user types and re-run on send. It never blocks a send; it informs and offers a fix, because a hard block creates a moderation-evasion incentive (obfuscate and retry).

Four signals:
- **Cruelty** — a person is described in a demeaning way. Offer: *"This reads as an attack on [name]. Rewrite, or send it to a Circle Drop instead of a person."*
- **Unwanted romantic signal** — "I like you" framed as a revelation. Offer: *"This may land harder than you expect. Keep it anonymous (default) or open with something lighter."* Never pre-emptively rewrite it; this is a legitimate and common use.
- **Self-harm / crisis** — routed to a resource-first interstitial, never to a send. See `06-safety-and-trust.md` §5.
- **Coercion / doxxing** — identifying information (a real name, a number, a room number, a handle) attached to a third party. Blocks: PII patterns are stripped and the send is refused with an explanation. This is the one hard block, because it protects a non-consenting third party.

### 4.3 Sealing modes

| Mode | Behavior | Default? |
|---|---|---|
| **Sealed** | No expiry. Persists until acted on. | No |
| **48-hour** | If unopened when it expires, it dissolves and the sender is told *"your confession dissolved unread."* | **Yes** — it is the default because it is the low-pressure option |
| **Circle Drop** | 5–8 people, no per-person attribution, no individual reply tracking, cannot be forwarded back to the sender, and shows no per-person open state | Yes, available from the start |

Unsent by a sender within 24h: hard delete including backups, with the count shown as a "24h" affordance on the draft. The certainty of the deletion is stated in the confirmation dialog, not implied.

After 24h, the sender can **Recall** (recipient sees nothing but a neutral "this confession was recalled" — no content, and the recall itself is not attributed). Recall after the recipient has replied is disabled; by then a relationship exists and silently retconning it would be a betrayal.

## 5. Inbox: receiving

### 5.1 The envelope

An inbound confession is **sealed** — never rendered as content on the list screen. A row shows: a neutral seal glyph, the age of the confession, the 48h timer if set, and nothing else. No sender preview, no read receipt, no "typing."

**Opening is a deliberate, two-step act.** Tap the envelope → a full-screen "this seal is yours to break" state with a single primary action. It costs a tap, and that tap is the psychological commitment that makes the product feel different from a DM.

- Breaking the seal: 420ms, haptic on iOS. Not skippable, and *the one animation in the app that is worth keeping in slow motion.*
- Unopened + expiring soon (< 4h) → one quiet push: *"A confession is waiting. It dissolves in 4 hours."* No sender, no content, no preview.
- Unopened + expired → a single, quiet notification: *"A confession dissolved unread."* The sender is told; the recipient is told once and then it is gone. Nothing is silently deleted from someone's history without a word.

### 5.2 Reactions — deliberately thin

The whole reaction surface: **warm** (a single optional tap that sends one of a small warmth set to the sender, once) and **reply**.

No likes, no counts, no rankings, no "everyone" view. Rationale, and this should be understood before it is built: **counts turn people into content.** The moment a popular person has a visible "12 confessions received," every subsequent sender optimizes for cruelty, and the product becomes a pile-on with a nice UI. Counts are the single most common design mistake in this category and they are deliberately omitted.

Warmth is rate-limited to 3 per thread per day and never combined into a public total.

### 5.3 Reader controls

Available on every confession, one tap from the thread, no confirmation dialog (a dialog here is a failure):
- **"Not for me"** — removes it, tells the sender a single neutral *"This one wasn't for you,"* never the reason. Not a report, doesn't count against them.
- **"Mute"** — that person's channel closes; the sender is not notified of the mute specifically.
- **Report** — see `06-safety-and-trust.md`.

The asymmetry is deliberate and should never be "fixed": a reader can always decline at zero social cost, a sender can never tell who declined, and no reply is ever owed.

## 6. Sign it

The product's center of gravity. Full flow in `04-user-flows.md` §5; the rules:

1. **Mutual by construction.** Signing discloses *your* Veil to *them*. You cannot reveal someone else, ever, including in a thread where they have already signed.
2. **Plain notification, no pressure.** If they sign, you get: *"Someone in this thread shared their name."* No count of pending signs, no "they're waiting for you," no countdown, no re-prompt. One notification, then silence. The design is deliberately resisting the pull-to-peel.
3. **Silence is a valid outcome.** A thread that never signs is complete. The UI never marks an unsigned thread as incomplete, or pending, or in progress. It is just a conversation. (This is a hard rule to hold in code review — the pressure to add a "pending" state is strong and the pressure is the enemy.)
4. **Declining is silent and free.** No explanation needed, no follow-up state, nothing resets.
5. **Signed threads are exportable to the person.** On sign, both get a one-time option to keep the thread. There is no retroactive purge and no "delete everything forever" — by the time you sign, you have both consented to it existing.
6. **Signed = the reward layer.** Signed threads feed a private "Signed" archive, contribute (with consent) to the Campus Pulse, and are the only content eligible for the strength-boosted Share sheet.

## 7. Campus Pulse

- **K-anonymity floor of 25.** No aggregate is published for any cohort bucket with fewer than 25 contributing members. This is enforced server-side, not in the query layer, and the under-threshold case returns nothing rather than a fallback.
- **Cohort buckets**: class year, org, dorm, campus-wide. No free-text, no user-generated questions in v1 (they are a harassment vector and a deanonymization vector at the same time).
- **Minimum dwell time.** Aggregates are computed over a rolling 7 days and published ≥ 48h after the window closes, so an individual cannot be triangulated by watching a number move right after they sent something.
- **Signed-weighted.** Pulse prefers signed and >24h-old confessions. This raises signal quality and reduces the chance a Pulse line becomes a live deanonymization instrument ("the uptick in 'I secretly hate my roommate' started 3 hours after Maya joined").
- **Share card** is designed for screenshots-to-Story, with the campus blurred-out-optional and the aggregate number prominent. This is the organic acquisition loop.

## 8. Rate limits and abuse controls (user-facing numbers)

Users should be able to find these limits without guessing. They live in Settings, stated as plain numbers, and a limit being hit shows what the limit is and when it resets.

| Control | Value | Rationale |
|---|---|---|
| Open confessions per recipient, per 7 days | 3 | 4 is indistinguishable from a campaign |
| Confessions per day | 5 | Enough to be expressive, not enough to spray |
| Confessions per week | 20 | Catches the compulsive sender before the reader does |
| Ignored-then-cooled | 5 | After 5 no-replies, a 30-day cooldown on that channel |
| Warmth per thread, per day | 3 | Prevents reaction spam |
| Circle size (free) | 60 | Bounded so the graph stays human, not a mass-follow list |
| Circle Drop size | 5–8 | Above 8 it becomes a broadcast, which is a different product with different risks |

Cooldown UX is designed to be *unembarrassing*: it never says "you are being restricted," it says *"You've sent a few of these. Give it a few days."* Shaming a sender does not reduce abuse and it makes people leave.

## 9. Edge cases (explicitly decided, so they aren't decided by accident)

| Case | Decision |
|---|---|
| Sender and recipient both enroll within the same hour of each other | Allowed. Mutual-degree gating still applies. |
| Recipient deletes the app | Content hard-deleted at the next purge cycle (≤ 24h) regardless of the sender. Sender sees nothing. |
| Sender's `.edu` expires (graduates) | Veil goes dormant, content is hard-deleted on the dormancy transition. Graduating is an anonymity risk for *the recipient* too; a "your recipient may be leaving" notice is shown and the channel is paused. |
| Both people in a Circle Drop signed | Cannot happen — a Circle Drop has no per-person identity to sign. Threads only. |
| You block a person with an open thread | Thread freezes. Unsent-by-you drafts are deleted. Nothing is disclosed. |
| You get blocked while a confession is in flight | The confession is delivered and then the channel closes. No bounce, no hint that a block occurred, ever. |
| You reported someone and it was dismissed | The sender is told nothing, ever. No "your report was reviewed." |
| Mutual block between two people with 4 mutuals | Fine. Never surfaced. The app does not detect or report "who unblocked you." |
| A confession is reported *after* the reader forwarded screenshots | Content is removed; screenshots are not recalled. The report flow asks about forwarding without moralizing. |
| Someone submits the same confession text twice | Soft-collapsed into one thread for the recipient. Duplicate delivery is a bad signal and a good signal. |
| 48h confession expires mid-thread | The thread shows a dissolved marker. Replies to a dissolved confession are disabled. |
| Campus drops below 250 verified members | Writes pause campus-wide; reads continue. Never silently discard. |

## 10. What is deliberately not in v1

Say this out loud now so it is not smuggled in later:

- **No public Campus Feed.** The single most-requested and most dangerous feature. It converts every confession into content for a third party and destroys the promise.
- **No DMs between strangers.** Ever, at any price, as a paid feature, or "temporarily."
- **No photo, video, voice, or image attachments.** Text only, 2,000 characters. Images are how you get identified in a small graph; voice is trivially recognizable; both destroy the core promise in a way no amount of engineering fixes. This is a hard v1 rule, and revisiting it requires a new anonymity design, not a new upload endpoint.
- **No free-text prompts in the Pulse.**
- **No streaks, no XP, no badges, no leaderboards.** See §5.2.
- **No read receipts or active-now status.**
- **No suggestion engine using activity, popularity, or photos.**
- **No cross-campus anything.**

## 11. Feature priority for engineering

| Tier | Feature | Why this tier |
|---|---|---|
| **P0** | .edu verification, Circle build, channel gating, 1:1 send, sealed envelope + open, reply, 48h dissolve, both rate limits per recipient, report, "Not for me", Sign, drafts | Without these it is not the product |
| **P0** | Cover traffic + batched delivery, k-anonymity floor, identity isolation, crisis interstitial | Without these the promise is false and the product is a liability |
| **P1** | Circle Drop, warmth reactions, threads > 5, cooldown, prompts, trust ledger, "Not for me" sender neutral notice | Meaningful quality-of-life; Circle Drop is the highest-viral item |
| **P1** | Campus Pulse, Share card | The organic acquisition loop; needed for portfolio expansion |
| **P2** | T3 ID verification, org admin verification, signed archive, cooldowns UI polish | Trust depth, not loop-critical |
| **P3** | Institutional admin analytics, extra Circle size (premium) | Revenue; gated on legal review |
