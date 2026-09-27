# 01 — Concept Strategy & Validation

**Working name:** Veil
**One-liner:** The drafts folder for your campus. Say the thing you never said — anonymously, to someone you actually know.

---

## 1. The wedge: *bounded* anonymity

Every failed anonymous product and every failed social product fails for opposite reasons.

| Product type | Anonymity | Relationship | Why it works / fails |
|---|---|---|---|
| Reddit, Blind, 4chan | Total | None | Total freedom to speak, zero payoff for speaking. Nothing is reciprocated, nothing changes. Brutal by default. |
| Instagram, TikTok | None | Broadcast | Maximum social proof, maximum exposure cost. The fear of being seen is the #1 reason a student doesn't say the thing. |
| Yik Yak | Pseudo (location) | Weak | Anonymity without reciprocity, plus a location that can be triangulated. Died of the same disease. |
| Discord servers | Named | Group | Great for gaming fandoms, poor for vulnerability. Nobody confesses to a guild. |
| **Veil** | **Total** | **Strong, verified, pre-existing** | Psychological safety *plus* the payoff of the relationship already existing. |

The insight: **anonymity is only worth anything when the relationship survives it.** Anonymity removes the *cost* of saying the thing. The existing relationship supplies the *reason* to say it. Most products pick one. The gap is in the middle, and the middle is where college social life actually lives.

Corollary: this is not a dating app. It sits *before* dating — in the ambiguous middle where most student relationships live (crushes that haven't happened, friendships that drifted, apologies nobody made, people you liked who you never told). It is a **social utility**, not a romance marketplace, and keeping that framing is a strategic asset: it dodges the "yet another dating app" filter in every investor's head and in every student's.

## 2. The problem, stated as a job-to-be-done

> *"When I have something honest to say to someone in my life, I want to say it without it becoming a Thing — and without the message just dying in my camera roll."*

Broken today, students use four workarounds, in descending order of frequency:

1. **The mutual friend relay.** "Oh so-and-so said…" Lossy, permanently attributed, socially explosive. Highest failure rate, highest drama.
2. **The private second account / "Finsta."** Proves the demand: students already build controlled-visibility identities for exactly this reason. An anonymous confession app is the logical endpoint of a behavior that already exists.
3. **The unsent draft.** The most honest answer: the thought exists and gets discarded. This is the wedge. We are not creating demand; we are capturing a demand that is currently being absorbed by the camera roll.
4. **The public post and the regret.** Instagram story, tweet, Reddit confession. High reach, high consequence.

**The gap:** a low-consequence, high-intimacy, private channel addressed to a *specific known person*. Nobody is building it well.

## 3. Why college is the correct beachhead (not a launch market)

Campus density is the whole strategy. Five properties stack:

1. **Geographic density.** Everyone is inside a ~3-mile radius. "People I know" is a *default*, not a search problem. Cold-start graph density solves itself off-network.
2. **A shared identity anchor that requires no names.** "We go to the same school" is trust that costs nothing to grant. On a dating app, shared school is weak signal. Here, it is the product.
3. **A hard yearly reset.** The class of '27 leaves; the class of '31 arrives with zero network on this app and an existing dense network in real life. **A built-in, recurring, self-seeding growth loop.** No app in this category has a cleaner cohort-driven reactivation.
4. **Acute social pain, high stakes, high stakes-per-sentence.** Stress, loneliness, romantic ambiguity, money, family, the grind. The content supply is emotionally dense and free.
5. **Distribution that a 20-year-old can actually execute.** RA programs, orientation weeks, student government, campus newspapers, club orgs, Greek life, career fairs, radio. CAC is a poster and a table at a Greek recruitment event. This is the single most underrated advantage of the college wedge versus going straight at 18–24 year-olds everywhere.

**Do not** launch on a K-12 basis, and see §7 on the under-18 problem.

## 4. The core mechanic: **Sign it**

Everything in the product hangs off one moment.

> A and B have an anonymous thread. Either can **Sign** — reveal their identity. **Signing is always mutual, always both-consented.** If A signs, A's handle becomes visible to B, B is notified plainly ("she shared her name"), and B chooses to sign back or walk. There is no silent one-sided unmasking. Ever.

Why this is the right center of gravity:

- **It converts anonymity from a feature into a two-act story.** Act 1 is the confession. Act 2 is the reveal. The app has something to be *about* — a payoff, not a feature set.
- **It is consensual, so it is abuse-proof by construction.** Nobody can be outed. The scariest thing about anonymity apps — coerced exposure — is structurally impossible here.
- **It is measurable in a way that matters.** "Signed Confessions" is a North Star metric that only increments when a real human connection was actually completed. It cannot be gamed by notification-bait or infinite scroll.
- **It creates a graceful exit.** A user who never signs has still had a private, safe exchange. Nobody is punished for cowardice. The app never corners anyone.

Derivative loops that fall out of Sign it: sign requests as notifications, "signed by 3 people" reputation, a signed-thread highlight, and a *signed* filter in the campus pulse (aggregates from signed confessions are more credible and more shareable).

## 5. Feature pillars

Full mechanics in `02-product-spec.md`. Strategy-level, five pillars:

**1. The Veil (your anonymous identity)**
No avatar. No handle derived from your real name. A pronoun set and a color, and that's it. The design system refuses to individuate — see `03-design-system.md` §2. Anonymity is enforced by the *interface*, not just by policy, because a policy can be leaked and a design cannot.

**2. The Circle (your verified network)**
Mutuals, orgs, shared attributes. Every person card carries a visible **trust ledger** — verified email, N mutuals, same org. This is the friction *and* the product: you can only address someone with at least one verified mutual or an accepted invite. **No cold DMs. Ever.** This one rule eliminates the majority of abuse vectors on its own.

**3. Write (the composer)**
Drafts-first: write anything, choose the recipient later, or publish to a small **Circle Drop** (5–8 chosen people, no per-person attribution). Prompt seeds to defeat the blank page. A pre-send tone pass that flags insults, unwanted crushes, and self-harm *before* send. Three sealing options: **Sealed** (no timer), **48-hour** (dissolves unread — kills social pressure), **Circle Drop**.

**4. The Inbox (sealed envelopes)**
The ritual: an envelope arrives, it sits, you open it. The physicality is the product. Reactions are intentionally thin (a warmth scale, not likes) and **always optional** — no public counts, no "X people responded," because counts create the punching-bag dynamic that kills this class of product.

**5. Campus Pulse (the shareable layer)**
Aggregated, k-anonymized (k ≥ 25) sentiment from signed and 24h-confessed content: *"63% of seniors said they're going to grad school against their will."* This is the acquisition engine (it is the content people post to their story) and it is the *only* way content reaches the "broader community" — with attribution mathematically impossible. Your promise to senders is kept by aggregate, not by policy.

## 6. Competitive posture

| Competitor | Their advantage | The gap we take |
|---|---|---|
| **Instagram / BeReal** | Distribution, network effects | Exposure cost. Nobody confesses on a feed with 400 followers. |
| **Yik Yak (2017)** | Local density, the idea | No reciprocity, weak safety, no payoff. Rebuilt, not revived. |
| **Blind (2021)** | Anonymity at scale | Anonymity at scale means strangers. We are structured the opposite way. |
| **Yours / Whisper** | Low-pressure self-expression | Same. Also: 1:1 addressing instead of a public drop box. |
| **Discord / GroupMe / BeReal** | Real social infrastructure | None of them can host a genuinely private channel of expression. |
| **Rumble / campus newspapers** | Editorial trust | Slow, public by definition, not interpersonal. |

**Defensible advantage:** the one nobody else has is a *verified dense graph of people who already know each other, attached to a channel that is genuinely un-attributable.* That is a data asset, not a feature, and it compounds per cohort.

## 7. Risks, ranked by how likely they are to kill this

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| 1 | **Inference deanonymization.** In a small graph, someone reasons "who would send this?" and is right. | **High** | See §8. The design *knows* this is a feature not a bug; the whole architecture and the batched timing exist for it. |
| 2 | **Bridging vs. bonding.** Anonymity is most valuable to weak ties; weak ties are also the most abusive. Inherent product tension. | High | Mutual-degree gating with the count shown to the recipient. Hard rate caps. Cooldown on 5 ignores. Heat system, not vibes. |
| 3 | **A punching bag.** One person becomes the campus's confessional target. | High | No public feed, ever. 1:1 only. Hard caps. No response counts. Report + block. Graduated enforcement. |
| 4 | **Under-18 users.** A "college app" that a 14-year-old opens. | Medium | 18+ hard gate, .edu verification, K-12 institutions blocked at signup, and an explicit "not for K-12" policy. Do not hand-wave this. |
| 5 | **Empty campus on launch.** | Medium | Cohort-scoped launch (one residence hall, one org, one major-year at a time) + Circle invites. See `04-user-flows.md` §2. |
| 6 | **A bad early incident.** One credible doxxing story and the campus turns on you. | Medium | Anonymity promise, publishable transparency report, no-punishment-for-victims stance, incident playbook. |
| 7 | **Regulatory / legal posture** on anonymous student speech, FERPA, state law. | Medium | 18+, no K-12, documented per-jurisdiction policy, counsel before launch, never a school-record system. |
| 8 | **Monetization corrupts the tone.** | Medium | Explicit ban on in-feed ads (see §10). |
| 9 | **Moderation cost at scale.** Human review does not scale linearly. | Medium | Classifier-first triage, human only on escalated tiers, heat-based enforcement. Cost per user is a modeled unit from day one. |
| 10 | **The campus is just not that interesting.** Some schools are dead. | Low | Launch campus selection is a data decision, not a vibe decision (§11). |

**The #1 risk is also the #1 thesis.** Students say the risky thing partly *because* the graph is small. That is the appeal and the hazard. The product must make inference expensive and make the promise technically honest rather than legally boilerplate.

## 8. The anonymity promise (engineering, not marketing)

Stated once here because it constrains every screen. Full architecture in `06-safety-and-trust.md` §2.

- **Recipient never sees sender identity.** Not obfuscated, not hashed-and-brute-forceable. There is no identifier a recipient or a recipient's friends can attack.
- **Real identity always held** server-side, encrypted, accessible only to a moderator under a logged policy, never rendered to a recipient — not even in a "reveal" flow. Sign it is **user-consented self-disclosure**, not a server-side unmasking.
- **Cover traffic.** Every send is padded with dummy deliveries so inbox arrival timing carries no signal.
- **Batched delivery.** Sends are held for a randomized window (10–90 min) and delivered in nightly waves so you cannot correlate "posted at 11:04pm" → "arrived at 11:07pm."
- **Cohort floor.** Confessions are only deliverable inside a campus cohort of ≥ 250 verified members. This is a hard product constraint, not a setting.
- **No metadata leaks.** No read receipts, no typing indicators, no "active now," no push payload naming the recipient, no analytics on the recipient side that a sender could see.
- **Delete means delete.** Unsend within 24h is a true hard delete including backup expiry, and the UI says so in plain language.
- **We publish what we hold and who can see it.** A plain-language "what we know about you" panel in the app — not a legal PDF. This is the single strongest trust signal available, and competitors who collect more cannot copy it.

## 9. Go-to-market

Land one campus. Do not spread.

**Phase 0 — Pick the campus (4 weeks).** Score candidate schools on: enrollment 8k–35k, housing ≥70% on campus, active Greek life, ≥15 student orgs, student newspaper that responds, low existing anonymous-app penetration, and a campus that is *socially legible* (few giant residence halls beat commuter sprawl). Reject any school where the graph is too dispersed to ever be dense. This decision is worth more than six months of growth work.

**Phase 1 — One floor (6 weeks).** A single residence hall, 900–1,400 students. A resident ambassador program (10 paid ambassadors, one per floor). Physical presence: table at the lobby, stickers on the bathroom mirrors, a QR code on the vending machine. Target: 60% of the floor verified within the term.
- The single-floor constraint is deliberate: it makes the graph *dense enough to be alive* on day one, and it makes a "who is this person" incident attributable to a small cohort, which makes the anonymity promise auditable.
- Success gate: **≥ 25% of verified users send a confession within 48h of verifying.** Below that, the core loop is not working; do not add features.

**Phase 2 — One campus (one term later).** Density proven in a contained blast radius. Now open to the whole school, seed the org graph, launch Campus Pulse, and start the referral mechanic ("a friend on this campus sent you a sign-in code" — a code, not a link, so it doesn't leak a list).

**Phase 3 — Portfolio.** Each new campus is an independent launch with its own ambassador cohort. Do not cross-link campuses: a confession at School A must never be visible to School B, and the campus boundary is a hard isolation boundary in the data model, not a filter.

**CAC reality check:** ambassador stipends + swag + a few campus ads. Target under $1.50 blended CAC at Phase 1 scale. A paid channel is a *failure signal* — if the loop is good, students invite each other, because the product is inherently a social artifact ("someone should confess to you" is a gift, not an ad).

## 10. Business model

The tone constraint rules out the obvious play. In-feed ads in a confessional app are self-destructing, and any investor will ask about it, so: **no ads, ever, in the content surface. Written into the product principles.**

- **Campus partnerships (primary).** Student org sponsorships, career-fair activations, campus bookstore, grad-school services, mental-health providers. Sold to the *campus*, not to users, and never placed next to a confession.
- **Safety-as-premium (only premium we're proud of).** Sign faster, unsend any time, extra Circle members, priority verification, private/Stealth mode, extra drafts. Notably **no paid visibility boost, no paid priority in anyone's inbox, no "appear first"** — a purchased impression would be a lie about a relationship. This line is load-bearing.
- **Institutional, long-term (unlocks later).** Campus mental-health and advising teams as *admin* accounts that see only aggregate pulse data, never content, never a user. Huge contract value, and it is the piece a university would actually care about. Gated on §7 risk 7 and 8.
- **Cost structure to model from day one:** classifier inference, storage (short-lived content), and human moderation review minutes. Content is intentionally ephemeral, so this is a real margin question, not a hand-wave.

## 11. Metrics

**North Star: Signed Confessions per weekly active user.** Increments only when an anonymous exchange completed into a mutual, consented reveal. It requires (a) someone brave enough to write, (b) someone willing to read, (c) both to accept each other. It is the only metric in the product that cannot be inflated by engagement tricks.

**Activation funnel** (instrument these, do not improvise them):
1. Verified `.edu` email
2. Added ≥ 3 real names to Circle
3. Sent a first confession *(the activation event — the whole product hinges on it)*
4. Received a first confession
5. Responded
6. **Signed**

**Quality guardrails** — any of these degrading is a stop-the-line signal, not a rounding error:
- Report rate per 1,000 confessions
- Block rate per 1,000 confessions
- Percentage of confessions from accounts < 24h old
- "Not for me" rate on a specific person (a punching-bag tripwire)
- Median time-to-first-reply (declining = the loop is socially dead)
- Inference complaints and deanonymization reports (target: zero)
- Retention curve shape at day 7 / day 28

**Counter-metrics to watch deliberately:** avg. confessions sent per user per week (rising monotonically = spam pressure), and repeat-send-to-the-same-person rate (rising = harassment).

**Kill criteria, written down now so they are not renegotiated later:**
- Fewer than 15% of verified users send a confession in week 1 of a campus launch, twice in a row.
- Report rate above 8 per 1,000 confessions at any point after week 4.
- Any credible deanonymization event with no acceptable explanation.
- Median time-to-first-reply above 72 hours at steady state (the network has no social value).

## 12. Naming

| Name | Read | Verdict |
|---|---|---|
| **Veil** | Anonymity without shame; not a bit, not a mask | **Recommended.** Short, ownable, elegant, and it means the thing the product promises. |
| **Unsigned** | Literary, epistolary, a little sad | Beautiful. Implies the reveal is the only goal, which pressures people to sign. Backup. |
| **Draft** | "The drafts folder" metaphor lands instantly | Great product name, poor trademark posture. |
| **Note / Passing Note** | Nostalgic, campus-appropriate, a little childish | Charming. Generic. |
| **Confess** | On the nose | Reads as a novelty confession app. Also crowded. |
| **Yapper / Whispers** | Noisy, implies gossip, not sincerity | Wrong tone. Avoid. |

The tone to protect: **earnest, not cute; quiet, not loud; private, not performative.** Every screen decision below is downstream of that sentence. The moment the app feels like a novelty, students stop putting anything real into it, and then there is no product.
