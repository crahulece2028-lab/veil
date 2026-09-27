# 06 — Safety, Trust & Anonymity

The load-bearing document. If this part is wrong, nothing else matters — an app that leaks an identity does more damage to a person than the one it was built to protect them from, and it happens once.

---

## 1. Threat model

| # | Threat | Who | Goal | Mitigation | Residual |
|---|---|---|---|---|---|
| T1 | **Server leaks sender to recipient** | Operator / bug | Render a sender identity where a recipient can see it | Architectural: identity is not on the recipient's read path at all. `EnvelopeRow` has no prop for it. Contract tests assert no recipient-scoped API response contains a sender identifier. | Operator subpoena. Managed (§2.6) |
| T2 | **Recipient deduces by inference** | Recipient | Work out who sent it | Cover traffic, batched delivery, ≥250 cohort floor, no timing signal, no sender-side activity status. **This threat is not fully mitigable and is not claimed to be.** It is disclosed in the privacy panel in plain language. | Accepted & disclosed |
| T3 | **Recipient forwards a screenshot** | Recipient | Spread a confession | Can't be prevented. Mitigations: the Report flow asks about forwarding; the report collects the image if the reporter has it; the sender-facing copy warns that screenshots can't be recalled; the confession's delete button is prominent post-send. | Accepted |
| T4 | **Brutality / punching bag** | Any sender | Make one person a target | No public feed. No counts. 3 per recipient / 7 days. 5 / day. 20 / week. Cooldown after 5 no-replies. Tone pass. "Not for me" at zero cost to the sender. Heat system (§4). | Medium |
| T5 | **Harassment via reciprocal accounts** | Two people | Get around anonymity | `.edu` verified, one account per person, contact-matching on verified campus emails only, device fingerprint + cohort graphs in the heat system, mutual block is silent. | Medium — needs human review |
| T6 | **Coordinated pile-on from a group chat** | A group | Pile 30 reports on one sender to force a ban | Reports are **not** attributed to the reporter and are not shown to the accused; a single report never bans; enforcement requires either a validated safety report or an independent classifier signal; a burst of same-reason reports from a near-mutual cluster is itself a heat signal *on the reporters*. | Low |
| T7 | **Doxxing a third party** | Any sender | Reveal someone who never consented | PII pattern detection is the only **hard** block. Strips and refuses with a visible explanation. | Low |
| T8 | **Minor uses the app** | A 14-year-old | Be in a space not built for them | 18+ gate before any data entry, `.edu` only, K-12 institutions absent from the directory, plus a classifier check on signup email domains. | Low |
| T9 | **Sexual content / predation** | Any sender | Abuse a confession channel | Text only. Classifier. Report reasons include Sexual. Triage P0. | Medium — classifier miss rate is real; the report path and human review are the backstop |
| T10 | **Outing a person through the Pulse** | Anyone reading Pulse | Identify who contributed a line | k ≥ 25, 48h publish delay, signed-and-aged weighting, no free-text, no per-user contribution counts. | Low |
| T11 | **Account takeover via weak verification** | Attacker | Impersonate a student | `.edu` OTP. Optional T3 ID. Channel is mutual-consent, so impersonation is socially hard even if technically possible. | Low |
| T12 | **Operative over-reach** | Us | We read more than we need | Data minimisation, short TTL, access logging, published transparency report, third-party audit annually. | Requires discipline |

**The honest framing for investors and for ourselves:** T2 and T3 cannot be engineered away. They are properties of speaking to people who know you. What we can do is make the app's *promise* precisely accurate ("we never show your identity to the person you wrote to"), make the inference path expensive and noisy, and say plainly in the product that a determined person in your own friend group may work it out. **An app that overclaims here is worse than one that admits the limit**, because the overclaim is what gets tested by the one person it hurts.

## 2. Anonymity architecture

### 2.1 What the recipient can see
Veil colour, pronoun set, optional mood word, mutual count, whether the person is verified, and — only if both signed — the name they *chose* to share. That is the complete list. There is no field that could carry an identity.

### 2.2 What the server holds
- `person.real_name` — encrypted at rest, in a separate store from content, with a distinct key. Access requires an approved, logged moderator action tied to a specific report ID.
- `confession.sender_id` — stored, never joined into any recipient-scoped query. Enforced by a repository layer that only exposes `sender_id` to a sender-scoped view, plus a CI check that greps recipient-path queries.
- `confession.created_at` — truncated to the hour for retention purposes, then discarded.
- `confession.delivered_at` — randomised.

### 2.3 Cover traffic
Every send is padded to a **fixed batch size per recipient** (minimum 3 slots). Real deliveries fill slots; the remainder are synthetic no-op rows. The recipient's inbox shows a *cohort* of items, not a broadcast, so the arrival of one confession tells them nothing about when it was sent.

This has a real cost — roughly 2/3 of inbox rows are synthetic — and it is worth paying, because the *alternative* is shipping a product whose central claim is observably false. Cheaper variant to consider at scale: pad per campus, not per recipient, and accept a weaker guarantee. Do not decide this by feel; measure the inference risk with the campus ambassadors.

### 2.4 Batched delivery
Sends are held for a randomised **10–90 minute** window, then released in nightly waves (roughly 7am / 12pm / 5pm / 9pm / 11pm local, with jitter). You cannot correlate "typed at 23:41" → "arrived at 23:58." 48h dissolution is measured from **release**, not compose.

### 2.5 Cohort floor
Confessions are deliverable only inside a campus cohort with **≥ 250 verified members**. Hard product constraint, enforced at send time with a clear message: *"Veil at Northside opens for writing when 250 people join."* This is a cold-start tax paid deliberately in exchange for making the graph less gameable.

### 2.6 Identity escrow
If compelled by legal process, we can disclose a sender's identity **to law enforcement with a documented process** — and we say so in the privacy panel, because claiming otherwise would be a lie and would also be the thing that ends us. "We will never give your identity to the person you wrote to" and "we may be compelled to give it to a court" are both true, and stating both is the only version worth publishing.

### 2.7 Data retention

| Data | TTL |
|---|---|
| Unread confession | 48h default (or indefinite if Sealed), dissolve on expiry |
| Opened thread | 90 days after the last message, then hard delete |
| Sealed (indefinite) confession | 180 days max, then hard delete with a sender notice |
| Drafts | 30 days |
| `created_at` precision | Truncated to hour at write, discarded at 30 days |
| Non-matching uploaded contacts | Discarded immediately at match time. Never stored. |
| Deleted account content | Hard delete ≤ 24h, including backup expiry |
| Moderator access logs | Retained 2 years, published in aggregate in the transparency report |

## 3. Abuse taxonomy & triage

| Class | Examples | Triage | Response |
|---|---|---|---|
| **A — Safety** | Threats, stalking, doxxing, sexual content involving a minor, self-harm of a third party | **P0, < 15 min** | Remove immediately, human review, account suspension, campus escalation if named, law enforcement where legally required |
| **B — Targeted cruelty** | Repeated demeaning confessions to one person; a sustained campaign against one recipient | **P0 if a pattern, else P1** | Remove; cooldown; account review; the recipient's "Not for me" rate is an automated tripwire |
| **C — Spam** | High-volume, low-substance, repeated unopened sends | P2 | Rate-limit escalation, then suspension. No content removal if it's not harmful |
| **D — Boundary violation** | A confession clearly intended for someone outside the recipient (wrong person entirely) | P2 | Remove with a neutral note to the recipient. No punishment — this is usually an honest mistake |
| **E — Low-quality / off-topic** | Spam, ads, nonsense, a 200-message argument in a thread | P3 | Thread collapse or removal. Minimal penalty |
| **F — Inconsequential** | Two users annoyed at each other, mutual, no pattern | P4 | None. **Do not action.** A moderation system that acts on everything trains users not to report real problems |

The F row is the one teams cut first and shouldn't. Volume of action is a vanity metric; the useful number is **A+B rate per 1,000 confessions**, and rising P3/P4 action counts are a sign the report button is being used for arguments rather than harm.

## 4. Heat system & enforcement ladder

A per-person `heat` score, decaying at ~1 point per 3 days, incremented by: validated safety reports, per-recipient ignore streaks, `Not for me` rates, classifier validation on *reported* content, and account-age-weighted send volume.

| Heat | Threshold | Response | User-visible |
|---|---|---|---|
| 0 | < 10 | Full access | — |
| 1 | 10–24 | `HeatWarning` sheet, informational, states the number and what lowers it | Yes, once |
| 2 | 25–49 | Compressed limits (2/7d, 3/day), no Circle Drop, no 48h timer (must be explicit) | Yes, with the reason |
| 3 | 50–99 | Write paused 7 days, read access kept. **Nobody stops reading because of heat** | Yes, with an appeal link |
| 4 | 100–199 | Write paused 30 days | Yes, with appeal |
| 5 | ≥ 200 or any validated A-class finding | Write revoked. Read access kept. Real-name suspension on a second A-class finding | Yes, with appeal, always human-reviewed |

Non-negotiables:
- **Reading is never punished.** A suspended sender can still receive. A product where people get locked out of their inbox for bad behavior teaches them to behave worse and then to leave.
- **No action is ever fully automated for A-class findings.** Classifier proposes; a human disposes. The classifier is a triage tool, not a judge.
- **Every enforcement beyond a rate limit is appealable**, and the appeal reaches a human.
- **The accused is never told who reported them.** Ever. No "a user reported your message."

## 5. Crisis handling

**Self-harm in the author's own draft** → `CrisisInterstitial` (wireframe G3). Resources first, campus counseling + 988, "text someone you trust" offered, draft saved, **nothing sent**, no `Send anyway` on a self-harm signal about the author. The product's position is stated plainly: this is not a crisis service, which is exactly why it is showing this.

**Self-harm stated about a third party** → do not block the send. Send it, and generate a **P1 safety flag** for human review. A confession that says "I think my roommate is going to hurt himself" is a person asking for help, and a filter that stops it is actively harmful. Review within 4 hours.

**A recipient appears to be in crisis** (pattern across multiple threads) → P1 review, no automatic contact, no automatic parent notification. A trained human decides, and the decision is logged. This is the hardest judgment in the product and it is why A-class review is staffed, not crowd-sourced.

Every crisis interaction is reviewed within 7 days for whether the interstitial actually helped. If the honest answer is "we interrupted something that wasn't a crisis and lost the confession," that is a finding to fix, not a reason to reduce the check's frequency.

## 6. Moderation UX principles

1. **Reporting is free, fast, and consequence-free for the reporter.** One tap from the row, reason required, no severity picker, no "are you sure," no upload wall.
2. **Nothing about a report is shown to the accused.** Not the count, not the reason, not "a user reported this."
3. **"Not for me" and "Report" sit side by side.** Burying the lighter action is a dark pattern; the reader should be able to decline without also filing paperwork.
4. **Enforcement copy states a number and a fact, never a motive.** "3 to a person, every 7 days. Everyone gets the same." Not "you may have been flagged."
5. **The receiver always wins the tie.** If in doubt about whether to remove, remove from the reader and warn the sender. Asymmetric cost is the correct bias for a space that holds vulnerable speech.
6. **Every moderation surface is calm.** `surface`, no red bleed, no giant warning glyphs. The report sheet is a form, not a hazard sign.

## 7. Legal & compliance posture

- **18+ only, `.edu` only, no K-12 institutions in the directory.** Non-negotiable, and the directory exclusion is an engineering constraint so it cannot be bypassed by a hand-typed school name.
- **Not affiliated with any university.** No campus email domain, no seal, no implied endorsement, stated in the ToS and in the campus-selection flow (this matters when you go campus-by-campus and every school will ask).
- **Not an educational record.** FERPA does not apply to us as a third party because we are not the educational institution and hold no student record — but counsel must confirm this per campus, and the answer is written down per campus, not assumed.
- **Anonymous speech posture, documented per jurisdiction.** Many US states and several other jurisdictions protect anonymous student expression, and the protections vary and change. Maintain a written posture per launch state, reviewed by counsel, with a launch gate that blocks a campus in a jurisdiction that has not been cleared.
- **COPPA:** under-18 collection is a legal exposure, not a policy preference. Hence the hard gate.
- **DMCA / defamation:** a confession can be defamatory. Provide a designated agent, a per-campus takedown path, and notice-and-response. Do not adjudicate defamation disputes by unilateral removal without a record — that record is a moderation log entry.
- **GDPR/UK GDPR:** lawful basis = legitimate interest for the service, consent for optional analytics; right to export and erase is implemented as a real feature (§ F2), not a support ticket.
- **Section 230 posture:** documented, and note that the app's design is deliberately arranged so that it is publishing *nothing* — which is a far better Section 230 position than a moderated public feed.

## 8. Operational readiness before launch

- [ ] **Incident playbook** for deanonymization: who decides, who is notified, what is published, within what window. Drafted, rehearsed, and dated before Phase 1.
- [ ] **Transparency report**, published from day one with zero incidents in it. An empty report is a promise; a report that starts later looks like it was hidden.
- [ ] **Moderator runbook** with the taxonomy in §3, an escalation tree, a QA set of 200 labelled examples, and a weekly calibration session.
- [ ] **Staffing model** with a real number: P0 within 15 minutes requires someone awake. Price this into the unit economics from the first day, not after Series A.
- [ ] **Student privacy advisor** or counsel on retainer, and an actual relationship with at least one campus counseling office before launch — they are the escalation partner and the trust signal.
- [ ] **Red-team pass** by someone outside the team, explicitly tasked to find the deanonymization path. Do this before Phase 1 and again before Phase 2. The first pass will find something.
- [ ] **Press kit** that includes the privacy receipt, because the press kit is what will be quoted, and the quote should be the receipt.
