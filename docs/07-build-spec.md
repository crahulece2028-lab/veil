# 07 — Build Spec (developer handoff)

Stack-agnostic. Suggested: React Native (Expo) + TypeScript, Postgres, Redis, a queue worker for delivery batching, and a small inference service for the tone pass and triage. Nothing here requires a specific framework; the boundaries are what matter.

---

## 1. Data model

```
campus            id, name, domain, slug, status(live|waitlist), cohort_floor=250,
                 created_at
cohort            id, campus_id, kind(residence|org|year|major), label, member_count
person            id, campus_id, real_name_enc, real_name_key_id, class_year_self,
                 major_self, verification_tier(1..4), verified_at, heat, status,
                 created_at, deleted_at
person_veil       person_id PK, color_token, pronoun_set, mood_word, updated_at
person_org        person_id, cohort_id, verified(source: admin|self), created_at
person_contact    person_id, contact_person_id, source(mutual|invite|org|cohort),
                 created_at           -- the social graph
channel           id, campus_id, a_person_id, b_person_id, state(open|closed),
                 created_at, closed_at
                  UNIQUE(a,b) with a<b enforced by normalisation
confession        id, campus_id, thread_id, sender_id (NEVER in recipient queries),
                 recipient_id NULL (null => circle_drop), drop_set_id NULL,
                 body, seal_mode(sealed|timer|drop), seal_expires_at,
                 state(pending_batched|released|opened|answered|dissolved|recalled|
                       removed), created_at_hour, released_at, opened_at
                  CHECK ((recipient_id IS NULL) = (drop_set_id IS NOT NULL))
confession_target confession_id, recipient_id, delivered_at, opened_at,
                   responded_at
                  -- cover traffic writes here too, indistinguishable by design
thread            id, campus_id, state(anonymous|one_signed|both_signed|archived),
                   created_at, last_message_at
sign              id, thread_id, person_id, signed_at, visible_to_person_id
                  -- a sign is a SELF-disclosure record, not an unmasking
drop_set          id, sender_id, campus_id, size(5..8), created_at
draft             id, person_id, body, recipient_id NULL, seal_mode, unsend_expires_at,
                 updated_at
warmth            thread_id, from_person_id, value, created_at
report            id, confession_id NULL, thread_id NULL, reporter_id,
                 reason, context, status(new|triaged|actioned|dismissed),
                 priority(A..F), created_at, resolved_at, resolved_by
mod_action        id, person_id, action, reason_class, report_id NULL,
                 created_at, created_by, logged_reason, appeal_id NULL
mod_access_log    id, moderator_id, person_id, purpose, report_id, created_at
audit_log         id, actor, action, object_type, object_id, created_at
pulse_bucket      campus_id, cohort_id, window_start, window_end, k, metric, value
                  -- refuses to persist a row when k < 25
```

**Two invariants a reviewer must check, because everything depends on them:**
1. `confession.sender_id` is never selected on a recipient-scoped code path. Enforce with a separate repository interface (`RecipientView` has no `sender_id` field) plus a CI grep and a contract test.
2. `pulse_bucket` cannot be written with `k < 25`. A DB constraint or a trigger, not an application check.

## 2. API surface (high level)

```
POST /auth/start              { campus_id, email }        → challenge (18+ gate first)
POST /auth/verify             { challenge_id, code }      → session
GET  /me                                       → person, veil, trust, heat-visible
PATCH /me/veil

GET  /campus/search?q                          → enabled campuses only, K-12 excluded
POST /circle/contacts/match                    → { matches[], discarded_count }
GET  /circle/suggestions                       → ranked by mutual degree + reason
POST /circle/invite                            → 6-char CODE, not a link
POST /channel/respond                          → mutual accept

GET  /confessions/queue                        → sealed rows ONLY (no sender, no body)
POST /confessions/{id}/open                    → seal break + body (one-way)
GET  /threads/{id}                             → messages, veil chips, sign state
POST /threads/{id}/reply                       → 2000 char cap, re-sealed
POST /threads/{id}/sign                        → mutual self-disclosure
POST /threads/{id}/warmth                      → 3/day
POST /confessions/{id}/not-for-me              → removes; sender gets neutral notice
POST /confessions/{id}/mute                    → closes channel, silent
POST /confessions/{id}/unsend                  → hard delete, 24h window
POST /confessions/{id}/recall                  → 24h, blocked if replied

POST /drafts                                   → autosave, 30d TTL
GET  /drafts
DELETE /drafts/{id}

POST /tone-check                               → { flags[], advisories[] }
POST /crisis-check                             → interstitial or P1 flag

GET  /pulse?cohort=…                            → k<25 returns []
GET  /privacy/receipt                           → itemised, 34 items
POST /privacy/export                           → async, 24h
DELETE /me                                     → hard delete ≤24h incl. backups

POST /reports
GET  /reports/mine                             → status only, never findings
POST /appeals

# moderator only — separate auth domain, separate deploy, MFA required
GET  /mod/queue?priority=A
POST /mod/action
GET  /mod/identity/{personId}                  → requires report_id; writes mod_access_log
GET  /mod/audit
POST /mod/case/{personId}/label                → QA set contribution
```

Notes for the implementer:
- `POST /confessions/queue` is the only endpoint that could leak, and it cannot, because it has no join to `person`. Cover-traffic rows are inserted by the delivery worker into `confession_target` with `confession_id` pointing at a synthetic confession whose `sender_id` is a system principal.
- The moderator identity endpoint is the most dangerous route in the system. It requires a `report_id` in the request, it cannot be batched, it writes an immutable access log, and it is unavailable to any moderator role that is not explicitly granted `identity_read`.
- Deploy the moderator surface separately from the consumer app. A consumer-app compromise must not reach the identity endpoint.

## 3. Delivery worker

```
for each send in the last hour:
    if cohort.campus.member_count < 250: hold, notify sender with copy
    if heat >= 5: refuse
    rate limits → refuse with the exact limit + reset time in the response
    tone pass (server-side confirm) → PII ⇒ refuse; crisis ⇒ interstit
    insert confession (state=pending_batched, created_at_hour truncated)
    enqueue for the next wave with jitter 10–90 min
    inject cover traffic into the recipient's target set to the batch floor
on wave release (7/12/17/21/23h local, jittered):
    deliver → set released_at, opened_at=null
    schedule seal_expires_at from RELEASE time
    push generic notification (never templated with person data)
on expiry:
    hard delete content, set state=dissolved
    notify sender once, notify recipient once, then silence
```

Push payloads are string constants in one file, reviewed in PR. No template interpolation, ever. A lock screen is a deanonymization channel.

## 4. Analytics

North Star: **`signed_confessions_created` per WAU** — a `sign` insert where the counterpart `sign` exists within 30 days.

Funnel: `verified` → `circle_3_channels` → `first_confession_sent` (activation) → `first_confession_received` → `first_reply` → `first_sign`.

Guardrail events, emitted server-side (never client-side, so a tampered client cannot lie): `report_filed`, `report_class_A`, `mod_action`, `heat_transition`, `not_for_me`, `mute`, `channel_closed`, `rate_limit_hit`, `cooldown_entered`, `identity_accessed` (moderator), `pulse_suppressed_under_k`.

Explicitly **not** instrumented: which confession was opened by whom, in what order, at what time, beyond the aggregate counters. If a metric cannot be computed without correlating two people's content, it does not get computed. This is a product rule, not a privacy-compliance afterthought — write it into the analytics repo as a comment so a future growth hire doesn't add it.

Dashboards: per-campus, per-cohort-launch. Every dashboard a campus ambassador can see is aggregate-only, k ≥ 25.

## 5. Feature flags

`cover_traffic` (per-campus, default on, must be on to serve writes) · `batch_minutes` · `cohort_floor` (default 250) · `tone_pass_model_v` · `tier3_id_verification` · `circle_drop` · `pulse` (per-campus, requires ≥ 25 contributors) · `heat_enforcement` (shadow mode first: compute heat, log the action, take none) · `premium_visibility` — **this flag must not exist.** Add it and someone will use it.

## 6. Definition of done (per feature)

- [ ] Sender identity is unreachable from any recipient-scoped query, verified by a contract test and a CI grep
- [ ] `tools/contrast_check.py` passes 47/47
- [ ] No avatar component instantiated; `EnvelopeRow` cannot accept sender or body
- [ ] Every rate limit, dissolve, and cooldown is stated to the user in plain numbers
- [ ] Every destructive action is a real labelled control, never swipe-only
- [ ] Zero autoplay, zero carousels, reduced-motion path implemented and tested
- [ ] Dynamic Type 200% verified on the smallest supported device
- [ ] Light and dark both reviewed against tokens — no hardcoded hex
- [ ] Push payloads contain no person data
- [ ] Every state in `04-user-flows.md` §9 copy templates is implemented verbatim
- [ ] Accessibility: labels, states, focus order, focus trap on both modals, 44pt targets
- [ ] Feature is behind a flag with a documented kill switch
- [ ] Analytics event is server-emitted and appears on the campus dashboard

## 7. Build sequence

**Sprint 1–2 — Foundations**
Design tokens (export from `03-design-system.md` to a single TS module), the three signature animations, the type scale with Dynamic Type, CI running the contrast checker, and the local moderation-free shell. Nothing product yet. If the foundation is not right, every later screen is rework.

**Sprint 3–5 — The minimum honest product**
`.edu` verification + 18+ gate · K-12 exclusion in the campus directory · Circle build with mutuals · channel gating at 3 · 1:1 send · sealed queue · seal break · thread + reply · 48h dissolve · unsend 24h · the two per-recipient rate limits · report + "Not for me" · the privacy receipt with real export and real delete.
Ship this to a single residence hall behind a flag. Nothing else.

**Sprint 6–7 — The promise, made true**
Cover traffic · batched delivery · cohort floor · PII hard block · crisis interstitial · content identity separation with its access log · retention jobs and the 24h hard-delete guarantee · the two invariants as automated tests.
**Do not launch before this sprint.** A version without it is a version that leaks.

**Sprint 8–9 — Loop and growth**
Circle Drop · warmth · threads > 5 · cooldown · prompt seeds · trust ledger · Sign it and the 640ms reveal · drafts autosync · heat in shadow mode.

**Sprint 10+ — After one campus proves the loop**
Campus Pulse with k and the 48h delay · Share card · T3 ID verification · org admin verification · signed archive · institutional admin (gated on legal).

## 8. Pre-launch gate (nothing ships without all of these)

- [ ] Red-team deanonymization pass completed and findings fixed
- [ ] Moderator tooling live with MFA, separate deploy, audit logging
- [ ] Staffed P0 response with a name and a number attached
- [ ] Incident playbook dated and rehearsed
- [ ] Transparency report published, showing zero incidents
- [ ] Counsel sign-off: 18+, K-12 exclusion, jurisdiction posture for the launch state, ToS, privacy policy that matches the receipt line for line
- [ ] Campus relationship: at least one counseling office and one student org aware and willing
- [ ] Legal review of `.edu` domain usage and non-affiliation language
- [ ] Content moderation runbook + 200-example QA set + calibration session held
- [ ] `tools/contrast_check.py` green in CI
- [ ] Kill criteria from `01-concept-strategy.md` §11 wired to the dashboard as alerts
