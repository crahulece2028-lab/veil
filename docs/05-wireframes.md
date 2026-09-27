# 05 — Wireframes

Mobile-first. Reference frame **390 × 844pt** (iPhone 14 / Pixel 7 class), rendered at ~40 characters wide. Minimum target **360 × 640** (small Android). Safe areas: 47pt top inset (notch/status), 34pt bottom (home indicator). All content respects them; the spec marks the insets with `~~~` and `___`.

Legend: `[ ]` tap target · `( )` control · `▓` veil field (anonymous person) · `◈` seal · `▚` serif/content type · `⋮` overflow · text shown in quotes is user-authored content

---

## A. Onboarding

### A1 — Value prop

```
┌────────────────────────────────────────┐  ← 47pt inset
│                                        
│                    ◈                   
│              (  seal, 64pt  )          
│           ~ glow, nothing else ~        
│                                        
│         The drafts folder              
│         for your campus.              
│                                        
│    Say the thing you never said.       
│    To someone you already know.        
│    They won't know it was you.         
│                                        
│                                        
│  ┌──────────────────────────────────┐  
│  │      Verify your campus          │  ← primary, 52pt
│  └──────────────────────────────────┘  
│      How it works                     
│  ___                                   
└────────────────────────────────────────┘
```
No social proof above the fold, no testimonials, no counters. The claim is the proof.

### A2 — Age gate

```
┌────────────────────────────────────────┐  ← 47pt
│  ✕                                       ← secondary, dismisses
│                                        
│                                        
│         Are you 18 or                  
│         older?                          
│                                        
│    This app is for college students    
│    18 and over. We check this once    
│    because anonymous speech is          
│    something we take seriously.        
│                                        
│  ┌──────────────────────────────────┐  
│  │            Yes, 18+              │  
│  └──────────────────────────────────┘  
│  ┌──────────────────────────────────┐  
│  │            No                    │  ← outlined, calm, not red
│  └──────────────────────────────────┘  
│  ___                                   
└────────────────────────────────────────┘
```
"No" is a dead end, not a scolding. `No` → static screen: "This one's for college students. You can still use the internet." No lecture, no account creation.

### A3 — Campus search → email verify

```
┌────────────────────────────────────────┐
│  ✕                                       │
│  ────────────────────────────────────    │
│  Find your campus                       │
│  ┌──────────────────────────────────┐  │
│  │ 🔍  Northside                    │  │  ← icon: magnifying glass (SVG)
│  └──────────────────────────────────┘  │
│                                         │
│  ENABLED                                │
│  ┌──────────────────────────────────┐  │
│  │ Northside University      14.2k │  │  ← selected: border-primary
│  │ on-campus housing 82%            │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ Lakeside College         4.1k   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  NOT YET OPEN                           │
│  · Fairhaven Institute                  │  ← muted, no chevron
│  · Westbrook Polytechnic               │
│                                         │
│           ── next screen ──              │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Continue with Northside     ›   │  │
│  └──────────────────────────────────┘  │
│  ___                                   
└────────────────────────────────────────┘
```

```
┌────────────────────────────────────────┐
│  ‹                                       │
│  ────────────────────────────────────    │
│  Verify your campus email              │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ you@northside.edu                │  │  ← .edu only, no autofill
│  └──────────────────────────────────┘  │     of personal addresses
│                                         │
│  ⚠  Must be your campus address.       │  ← only after submit
│                                         │
│  We use this once to confirm you're     │
│  a student. We never show it to        │
│  anyone on Veil, and you can see       │
│  exactly what we hold in You.          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         Send the code            │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### A4 — Your Veil (anonymous identity)

```
┌────────────────────────────────────────┐
│  ‹                                       │
│  ────────────────────────────────────    │
│  Your veil                              
│  This is how you'll appear. No photo,   │
│  no name, no handle.                     │
│                                         │
│  COLOUR                                 │
│  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓          │
│  ══  ──  ──  ──  ──  ──  ──  ──  ──       │  ← 8 AA-compliant swatches
│                                         │
│  PRONOUNS                               │
│  ( she/her )  ( he/him )  ( they/them )  │
│  ( ask me )  ( he/they )  ( any )        │
│                                         │
│  ONE WORD (optional)                    │
│  ┌──────────────────────────────────┐  │
│  │ tender                            │  │  ← serif italic inside
│  └──────────────────────────────────┘  │
│  how you'd describe the energy of       │
│  what you send                          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │           Continue               │  │
│  └──────────────────────────────────┘  │
│  Skip for now                            │
│  ___                                   
└────────────────────────────────────────┘
```
No avatar slot. No handle field. No preview-of-how-others-see-you row with a face in it. The whole screen is designed to be slightly anticlimactic — that is the message.

### A5 — Build your circle (the cold-start workhorse)

```
┌────────────────────────────────────────┐
│  ‹  Step 3 of 5                          │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░  43%         │  ← progress: current accent, rest border
│  ────────────────────────────────────    │
│  Who do you know here?                  │
│  Add people you already know. You'll    │
│  be able to write to them anonymously.  │
│                                         │
│  SUGGESTED                              │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  Priya                        │  │
│  │     ◌◌◌   You and Priya both      │  │  ← mutual arcs = 3
│  │           know Jordan            │  │
│  │                          [ Add ] │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  Marcus                      │  │
│  │     ◌◌    Both in Rowing         │  │
│  │                          [ Add ] │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  Ana                         │  │
│  │     ◌◌◌◌  4 mutuals · Northside │  │
│  │                                │  │
│  │                          [ Add ] │  │
│  └──────────────────────────────────┘  │
│  Show more                               │
│  ────────────────────────────────────    │
│  ╭──────────────────────────────╮       │
│  │ ◌  2 of 3 people to write to  │       │  ← sticky bottom, surface + hairline
│  ╰──────────────────────────────╯       │
│  ┌──────────────────────────────────┐  │
│  │          Continue               │  │  ← disabled until 3
│  └──────────────────────────────────┘  │
│  ___                                   
└────────────────────────────────────────┘
```
Each `[ Add ]` opens a channel immediately. By the time onboarding ends, there is somewhere to write.

### A6 — Channel gate (the hard product rule)

```
┌────────────────────────────────────────┐
│  ────────────────────────────────────    │
│                                        
│            ◌ ◌                         │
│         ▓▓▓▓▓▓▓▓                      │
│                                        
│      You have 1 of 3 people            
│      to write to.                      
│                                        
│      Adding people you already know    
│      is how Veil stays quiet and        
│      anonymous. You can write once      
│      you have 3.                       
│                                        
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  Priya            ◌◌◌  [Add] │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  Jordan            ◌◌    [Add] │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ Search by name · 2,140 people    │  │  ← muted, discouraging
│  └──────────────────────────────────┘  │     but honest
│                                        
│  Not ready? Browse what your campus    
│  is saying.                              │
│  ___                                   
└────────────────────────────────────────┘
```

---

## B. Core surfaces

### B1 — Tab bar (persistent)

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │  ← status inset
│                                         │
│             (content)                   │
│                                         │
│  ═══════════════════════════════════    │
│  Inbox   ✎Write   Circle   Pulse   You  │  ← 44pt min per target
│   •                        (center:     │
│   2                       ember, 56pt) │
│  ___/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/   │  ← home indicator inset
└────────────────────────────────────────┘

  Write is CENTER and PRIMARY — the app is a
  composing instrument, not a reader.
  The dot on Inbox is a count only. Never a
  preview, never a name, never a subject.
```

### B2 — Inbox (default)

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │
│  Inbox                             ⋮   │
│  ────────────────────────────────────    │
│                                         │
│  TODAY                                  │
│  ┌──────────────────────────────────┐  │
│  │ ◈  a confession is waiting       │  │  ← SEALED: no content,
│  │    dissolves in 14 hours         │  │    no sender, no length,
│  └──────────────────────────────────┘  │    no preview. Ever.
│  ┌──────────────────────────────────┐  │
│  │ ◈  a confession is waiting       │  │  ← unread: seal at 100%,
│  │    2 hours ago                    │  │    1px left accent bar
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ○  someone replied        6h ago  │  │  ← OPEN seal, hollow,
│  │    "still anonymous"              │  │    peer state as meta only
│  └──────────────────────────────────┘  │
│  THIS WEEK                              │
│  ┌──────────────────────────────────┐  │
│  │ ◎  signed                    3d  │  │  ← SIGNED: honey stroke
│  │    "I still think about this"     │  │    across open ring
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ○  opened                    4d  │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▚  a confession dissolved    5d  │  │  ← terminal state, tertiary
│  └──────────────────────────────────┘  │
│  ────────────────────────────────────    │
│  ═══════════════════════════════════    │
│  Inbox   ✎Write   Circle   Pulse   You  │
│  ___/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/   │
└────────────────────────────────────────┘

  Row anatomy, fixed:
  [seal 44pt] [ 1 line of state, meta 13pt ] [ ⋮ ]
  A sealed row CANNOT render content. The
  component has no prop for it.
```

### B3 — Seal break stage (the ritual)

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │
│                                         │
│                                         │
│                                         │
│                 ◈                      │  ← 128pt seal, centered
│                                         │
│                                         │
│           ░░░░░░░░░░░░░░              │  ← content, blurred, 1 line
│                                         │
│                                         │
│         This seal is yours             
│           to break.                     
│                                         │
│      Whoever sent this will never       
│      know it was them.                 
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         Break the seal           │  │  ← the ONE action. 420ms.
│  └──────────────────────────────────┘  │    haptic on commit
│  ✕  not yet                             │  ← text link, 44pt hit area
│  ___/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/   │
└────────────────────────────────────────┘

  Modal semantics: focus trapped, focus → 
  heading on open, returns to origin row
  on close, Escape/swipe dismisses.
  Reduced motion → 160ms cross-fade, no
  split, no glow, no scale.
```

### B4 — Thread (reading + responding)

```
┌────────────────────────────────────────┐
│  ‹  Inbox                               │
│  ────────────────────────────────────    │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      │  ← content inset top
│  ▚▚  You never posted the thing        │  │  ← Newsreader 20/32
│  ▚▚  you told me you were fine on      │  │     (serif)
│  ▚▚  the night you stopped answering.  │  │     measure ≤ 34em,
│  ▚▚  I'm not mad. I just want you      │  │     centered
│  ▚▚  to know I noticed.                │  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  they/them · "stupid" · ◌◌◌   │  │  ← VeilChip + trust ledger
│  │            2 hours ago           │  │     NO avatar
│  └──────────────────────────────────┘  │
│                                         │
│  ▚▚  that's a lot. i didn't know it     │
│  ▚▚  was that bad. i was just bad at    │
│  ▚▚  being there.                       │
│                                         │
│  ▚▚  you were.                          │
│                                         │
│  ────────────────────────────────────    │
│           ♡                              │  ← WarmthTap, single,
│         [ Sign it ]                     │    3/day, no count,
│  ────────────────────────────────────    │    no reciprocity prompt
│  ═══════════════════════════════════    │  ← composer scrim
│  ▚ Reply anonymously…              ▚   │  ← serif in sunken well
│  ┌──────────────────────────────────┐  │
│  │            Sealed                │  │  ← 48h default
│  └──────────────────────────────────┘  │
│  ═══════════════════════════════════    │
│  Inbox   ✎Write   Circle   Pulse   You  │
└────────────────────────────────────────┘

  No avatars. No "seen". No typing dots.
  No reaction counts. No scroll position
  leaks. Warmth and Sign it are siblings
  at equal weight — signing must never
  look like the reward for reacting.
```

### B5 — Sign sheet

```
┌────────────────────────────────────────┐
│                                         │
│  ═══════════════════════════════════    │  ← scrim
│                                         │
│  ╭──────────────────────────────────╮  │
│  │ Sign it                    ✕     │  │
│  │                                  │  │
│  │ Signing shares YOUR name with    │  │
│  │ the person you're writing to.    │  │
│  │                                  │  │
│  │ It does not share their name.    │  │
│  │ Signing is mutual — they choose  │  │
│  │ their own.                       │  │
│  │                                  │  │
│  │ You stay anonymous to everyone   │  │
│  │ else, always.                    │  │
│  │                                  │  │
│  │ ┌──────────────────────────────┐ │  │
│  │ │ ▓▓ they/them · "stupid" ◌◌◌  │ │  │  ← what they'll see
│  │ └──────────────────────────────┘ │  │
│  │                                  │  │
│  │ ┌──────────────────────────────┐ │  │
│  │ │     Share my name            │ │  │  ← primary
│  │ └──────────────────────────────┘ │  │
│  │      Keep it anonymous           │  │  ← equal visual weight
│  ╰──────────────────────────────────╯  │     NOT a ghost button
└────────────────────────────────────────┘
```

### B6 — Sign confirmation (mandatory second step)

```
┌────────────────────────────────────────┐
│                                         │
│         ╭───────────────────────╮       │
│         │    (  ◈  signed  ◈  )  │       │  ← honey stroke
│         │                         │       │    drawn over open ring
│         │   Someone shared        │       │
│         │   their name.           │       │
│         │                         │       │
│         │   ▓▓ they/them          │       │
│         │      "stupid"           │       │
│         │   ─────────────          │       │  ← 1px honey rule,
│         │                         │       │    drawn L→R
│         │   You can sign back     │       │
│         │   or keep this          │       │
│         │   anonymous.            │       │
│         │   Both are fine.        │       │
│         │                         │       │
│         │ ┌─────────────────────┐ │       │
│         │ │   Sign it too       │ │       │
│         │ └─────────────────────┘ │       │
│         │  Keep it anonymous       │       │
│         │ ─────────────────────── │       │
│         │  · they can see your    │       │
│         │    name now             │       │
│         │  · no one else can      │       │
│         │  · you can change your  │       │
│         │    mind until they      │       │
│         │    sign back            │       │
│         ╰───────────────────────╯       │
└────────────────────────────────────────┘

  NO "pending". NO countdown. NO "they're
  waiting for you". One notification, then
  silence. The design resists the pull.
```

---

## C. Writing

### C1 — Composer (empty, with prompt seed)

```
┌────────────────────────────────────────┐
│  ✕  Draft saved 14:02                    │  ← autosave, always visible
│  ────────────────────────────────────    │
│                                         │
│         Say the thing you said           │
│         three times in the group chat.   │  ← Newsreader italic,
│                                    ✕     │    dismissible prompt seed
│                                         │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │  ▚▚                              │  │  ← sunken well, serif,
│  │                                  │  │    grows to 2000 chars,
│  │  0 / 2000                        │  │    NEVER truncated
│  └──────────────────────────────────┘  │
│                                         │
│  TO                                    │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓ Priya        ◌◌◌    Sealed ▾  │  │  ← channel picker, no
│  └──────────────────────────────────┘  │     search-first
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓ Marcus         ◌◌    48h   ▾  │  │  ← sealing mode inline
│  └──────────────────────────────────┘  │
│  + Circle Drop (5–8 people)              │
│                                         │
│  ═══════════════════════════════════    │
│  ┌──────────────────────────────────┐  │
│  │   ⌁  Sealed and send            │  │  ← 52pt
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### C2 — Tone pass (non-blocking advisory)

```
┌────────────────────────────────────────┐
│  ✕  Draft saved 14:04                    │
│  ────────────────────────────────────    │
│  ╭───────────────────────────────────╮  │
│  │ ⚑  This reads as an attack on   │  │  ← surface-raised, warn glyph
│  │    Priya.                        │  │    (NOT red — warn, not danger)
│  │                                  │  │
│  │  Rewrite it, or send it to a    │  │
│  │  Circle Drop instead of a       │  │
│  │  person.                         │  │
│  │                                  │  │
│  │  [ Send to a Circle Drop ]      │  │
│  │  [ Keep editing ]                │  │
│  │           Send anyway            │  │
│  │                                  │  │
│  │  You can send it anyway.         │  │  ← explicit. Never a hard
│  └───────────────────────────────────╯  │    block: a hard block
│  ┌──────────────────────────────────┐  │    teaches obfuscation.
│  │ ▚▚ you're so fake and everyone  │  │
│  │     knows it…                    │  │
│  └──────────────────────────────────┘  │
│  TO  ▓▓ Priya  ◌◌◌   Sealed ▾            │
│  ═══════════════════════════════════    │
│  ┌──────────────────────────────────┐  │
│  │   ⌁  Sealed and send            │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### C3 — PII hard block (the one hard block)

```
┌────────────────────────────────────────┐
│  ✕                                       │
│  ────────────────────────────────────    │
│  ⛔  That message can't be sent          │  ← danger, the only ⛔ in the app
│                                         │
│  You included someone's phone number.    │
│  Confessions are read by one person, but │
│  their details are still theirs to share.│
│                                         │
│  REMOVED FROM YOUR DRAFT                │
│  ┌──────────────────────────────────┐   │
│  │ ~your number is 555-0142~        │   │  ← strikethrough, not
│  └──────────────────────────────────┘   │    silently deleted
│                                         │
│  ┌──────────────────────────────────┐  │
│  │          Edit and send           │  │
│  └──────────────────────────────────┘  │
│  Save as draft                           │
└────────────────────────────────────────┘
```

### C4 — Post-send confirmation

```
┌────────────────────────────────────────┐
│                                         │
│         ╭───────────────────────╮       │
│         │        (  ◈  )         │       │  ← seal launch already
│         │                         │       │    completed, glyph rests
│         │       Sealed.           │       │
│         │                         │       │
│         │  It arrives within      │       │  ← never "sent", never
│         │  the hour and dissolves │       │    "delivered". The word
│         │  in 48 hours if it      │       │    "delivered" must not
│         │  isn't opened.          │       │    appear in this codebase.
│         │                         │       │
│         │  You can unsend for     │       │
│         │  24 hours.              │       │
│         │                         │       │
│         │ ┌─────────────────────┐ │       │
│         │ │      Unsend         │ │       │
│         │ └─────────────────────┘ │       │
│         │      Done               │       │
│         ╰───────────────────────╯       │
└────────────────────────────────────────┘
```

### C5 — Drafts queue

```
┌────────────────────────────────────────┐
│  ‹  Drafts                               │
│  ────────────────────────────────────    │
│  YOU CAN UNSEND FOR 23H                  │  ← per-draft countdown
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ ▚▚ i still think about what you   │  │
│  │    said in the hallway…           │  │  ← 2 lines max in the LIST
│  │ ─────────────────────────────── │  │    (full text in the editor)
│  │ to ▓▓ Priya · ◌◌◌ · Sealed      │  │
│  │ 23h to unsend              ⋮     │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▚▚ has anyone else…              │  │
│  │ to ▓▓ Circle Drop (6) · 48h     │  │
│  │                    ⋮             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▚▚ (untitled draft)              │  │
│  │ to — not chosen yet   · no seal  │  │  ← recipient is often the
│  │                          ⋮      │  │    hard part; drafts-first
│  └──────────────────────────────────┘  │
│  ═══════════════════════════════════    │
│  ────────────────────────────────────    │
│  3 drafts. Send one to keep writing.     │
│  ___                                   
└────────────────────────────────────────┘
```

---

## D. Network

### D1 — Circle tab

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │
│  Your circle                     + Add  │
│  ────────────────────────────────────    │
│  PEOPLE WHO KNOW YOU                    │
│  14                                     │
│                                         │
│  ▓▓ Priya      ◌◌◌ ✓  a while ago   ⋮   │
│  ▓▓ Marcus     ◌◌  ✓  this week     ⋮   │
│  ▓▓ Jordan     ◌◌◌◌ ✓  this week    ⋮   │
│                                         │
│  SUGGESTED                              │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓ Ana  ◌◌◌◌  4 mutuals         │  │
│  │   you both know Priya, Jordan   │  │  ← reason always stated
│  │                          [ Add ] │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓ Theo  ◌◌  both in Rowing     │  │
│  │                          [ Add ] │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🔑  NORTH-4K2X                   │  │  ← sign-in CODE, not a link
│  │  Share this with someone you     │  │    a link encodes your graph
│  │  know here.                      │  │
│  └──────────────────────────────────┘  │
│                                         │
│  INVITES                                │
│  ▓▓ Sam invited you          [ Accept ] │
│                                         │
│  ═══════════════════════════════════    │
│  Inbox   ✎Write   Circle   Pulse   You  │
└────────────────────────────────────────┘
```
Activity is coarse and relative: `this week` / `a while ago`. Never a timestamp — on this product, a timestamp is a location.

### D2 — Person sheet

```
┌────────────────────────────────────────┐
│  ✕                                       │
│  ────────────────────────────────────    │
│            ▓▓  (veil, 72pt)              │
│                                         │
│            Priya                        │
│            ◌◌◌  3 mutuals               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ ✓ campus email verified          │  │  ← trust ledger, each row
│  │ ✓ class year 2028 · confirmed    │  │    a tier with its own glyph
│  │ ◌  dorm — self reported          │  │    (never colour alone)
│  │                                  │  │
│  │ You both know: Jordan, Ana, Leo  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ▚▚  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   ✎  Write anonymously           │  │  ← opens composer with
│  └──────────────────────────────────┘  │     channel pre-selected
│  Close channel                           │  ← one tap, never disclosed
│                                         │
└────────────────────────────────────────┘
```

---

## E. Campus pulse

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │
│  Pulse                                   │
│  What your campus said this week         │
│  ────────────────────────────────────    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ SENIORS · 412 CONFESSIONS         │  │  ← k≥25 enforced server-side
│  │                                  │  │    bucket size shown
│  │  63% are going to grad school     │  │
│  │  against their will.             │  │  ← the number IS the hero;
│  │                                  │  │    no card-in-card, no chart
│  │  ─────────────────────────────── │  │    chrome, no illustration
│  │  ⤴  share                        │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ CAMPUS · 3,104 CONFESSIONS       │  │
│  │  Most-named word: "sorry."       │  │
│  │  ─────────────────────────────── │  │
│  │  ⤴  share                        │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ROWING · 38 CONFESSIONS          │  │
│  │  Nobody has signed one.          │  │  ← under-threshold is not
│  │  ─────────────────────────────── │  │    filled with a smaller
│  │  ⤴  share                        │  │    bucket. It just doesn't
│  └──────────────────────────────────┘  │    exist. No fallback.
│                                         │
│  ────────────────────────────────────    │
│  How this works                          │
│  Numbers only appear when at least 25   │
│  people are in the group, and always    │
│  48 hours after the week closes.        │
│  Nothing here can be traced to you.     │
│  ___                                   
└────────────────────────────────────────┘
```

---

## F. Trust

### F1 — You tab

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │
│  You                                     │
│  ────────────────────────────────────    │
│  ┌──────────────────────────────────┐  │
│  │ ▓▓  (veil)                        │  │
│  │     they/them · "tender"         │  │
│  │     ✓ verified · Northside '28   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  YOUR PRIVACY                           │
│  ┌──────────────────────────────────┐  │
│  │ ⌾  What we hold about you        │  │  ← the most important
│  │ ▓▓  Privacy receipt              │  │    entry point in the app
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ☺  Sealed and signed threads     │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ ⚑  What you can control          │  │
│  └──────────────────────────────────┘  │
│                                         │
│  LIMITS                                 │
│  3 to a person / 7 days · 5 a day       │  ← the real numbers, in
│  20 a week · 3 Circle Drafts           │     plain text, not hidden
│  ────────────────────────────────────    │
│  Your report history                    │
│  Our transparency report                │
│  Campus rules ·  Block list · Sign out  │
└────────────────────────────────────────┘
```

### F2 — Privacy receipt (the trust asset)

```
┌────────────────────────────────────────┐
│  ‹  What we hold about you              │
│  ────────────────────────────────────    │
│  ┌──────────────────────────────────┐  │  ← monospace, surface-sunken,
│  │ ██ WHAT WE HOLD ABOUT YOU ██████ │  │    dotted leaders, itemised
│  ├──────────────────────────────────┤  │    like a receipt. This is
│  │ real identity ......... encrypted │  │    the screenshot students
│  │ campus .............. Northside  │  │    send to friends.
│  │ class year ......... 2028 (self) │  │
│  │ send timestamps .... discarded   │  │
│  │ delivery timing ...... randomised │  │
│  │ your drafts ........ only you    │  │
│  │ a moderator can see you           │  │
│  │   only to answer a report,       │  │
│  │   and it's logged                │  │
│  │ the person you wrote to .......... │  │
│  │   never. ever.                   │  │
│  │ screenshots we can see ........ . │  │
│  ├──────────────────────────────────┤  │
│  │ ▸ 34 items                       │  │
│  │ ▸ delete this account           │  │
│  │ ▸ export everything             │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ ⌁  There is no setting that      │  │  ← the promise, in one line,
│  │    makes us share your identity  │  │    as the last thing on screen
│  │    with the person you wrote to. │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## G. Safety & failure

### G1 — Report sheet

```
┌────────────────────────────────────────┐
│                                         │
│  ═══════════════════════════════════    │
│  ╭──────────────────────────────────╮  │
│  │ Report                        ✕  │  │  ← calm. surface, not red.
│  │                                     │  │    no warning triangle
│  │ This goes to a person, not a      │  │    over 20pt. Reporting
│  │ bot queue. They will never know    │  │    should feel like
│  │ who reported them.                 │  │    paperwork, not a
│  │                                     │  │    trapdoor.
│  │ What's wrong?                      │  │
│  │  ( ) Harassment or threats          │  │
│  │  ( ) Cruel or degrading            │  │
│  │  ( ) Sexual                        │  │
│  │  ( ) Self-harm or crisis           │  │
│  │  ( ) Someone's private info        │  │
│  │  ( ) Not a student here            │  │
│  │                                     │  │
│  │ Anything else? (optional)          │  │
│  │ ┌───────────────────────────────┐ │  │
│  │ │                               │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                     │  │
│  │ ┌───────────────────────────────┐ │  │
│  │ │          Submit report        │ │  │
│  │ └───────────────────────────────┘ │  │
│  │      Not for me — just remove it   │  │  ← the lighter action sits
│  ╰──────────────────────────────────╯  │    BESIDE report, not buried
└────────────────────────────────────────┘
```

### G2 — Rate limit notice

```
┌────────────────────────────────────────┐
│  ────────────────────────────────────    │
│  ╭───────────────────────────────────╮  │
│  │ ⏱  3 to a person, every 7 days   │  │  ← states the number,
│  │                                  │  │    the reset, and the reason
│  │  You've sent 3 confessions to     │  │    without blaming anyone
│  │  them in the last 7 days.         │  │
│  │                                  │  │
│  │  You can send again Tuesday.     │  │
│  │                                  │  │
│  │  ──────────────────────────────  │  │
│  │  That's a limit, not a judgment.  │  │  ← the anti-shaming line.
│  │  Everyone gets the same.          │  │    Ship it. It is the
│  │  See all limits            ›     │  │    difference between a
│  ╰───────────────────────────────────╯  │    limit and a punishment.
└────────────────────────────────────────┘
```

### G3 — Crisis interstitial

```
┌────────────────────────────────────────┐
│  ╔══════════════════════════════════╗  │  ← role="alertdialog"
│  ║  ⌾  This sounds like something    ║  │    focus trapped
│  ║     heavier than a confession     ║  │    never auto-dismissed
│  ║                                  ║  │
│  ║  This app isn't a crisis service. ║  │  ← says it plainly, which
│  ║  Please talk to someone who can    ║  │    is why it's showing this
│  ║  actually help, right now.        ║  │
│  ║                                  ║  │
│  ║  ┌────────────────────────────┐  ║  │
│  ║  │ ☎  Northside Counseling     │  ║  │
│  ║  │    (555) 010-0142 · 24/7    │  ║  │
│  ║  │    ⤴  call                   │  ║  │
│  ║  └────────────────────────────┘  ║  │
│  ║  ┌────────────────────────────┐  ║  │
│  ║  │ ☎  988 Suicide & Crisis     │  ║  │
│  ║  │    call or text · 24/7       │  ║  │
│  ║  │    ⤴  call                   │  ║  │
│  ║  └────────────────────────────┘  ║  │
│  ║  ┌────────────────────────────┐  ║  │
│  ║  │ ☺  Text someone you trust    │  ║  │
│  ║  └────────────────────────────┘  ║  │
│  ║                                  ║  │
│  ║  Your draft is saved. Nothing    ║  │
│  ║  has been sent.                  ║  │
│  ║                                  ║  │
│  ║  ┌────────────────────────────┐  ║  │
│  ║  │        Back to my draft     │  ║  │
│  ║  └────────────────────────────┘  ║  │
│  ╚══════════════════════════════════╝  │
└────────────────────────────────────────┘
```

### G4 — Empty inbox (the worst moment in the product)

```
┌────────────────────────────────────────┐
│  ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/      │
│  Inbox                             ⋮   │
│  ────────────────────────────────────    │
│                                         │
│                                         │
│                 ◈                       │
│                                         │
│         Nothing sealed yet.             │
│                                         │
│      14 people who know you are         │
│      on Veil right now.                 │
│                                         │
│      ─────────────────                 │
│      A real number, from the real        │
│      graph. Never a joke, never an       │
│      illustration, never "check back     │
│      later".                             │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │    ✎  Write your first one      │  │
│  └──────────────────────────────────┘  │
│       see what your campus is saying    │
│  ___                                   
└────────────────────────────────────────┘
```

### G5 — Channel closed / blocked (silent)

```
┌────────────────────────────────────────┐
│  ────────────────────────────────────    │
│  ╭───────────────────────────────────╮  │
│  │ ⌾  This channel is closed        │  │
│  │                                  │  │
│  │  You and Sam can no longer       │  │
│  │  write to each other.           │  │
│  │                                  │  │
│  │  Sam wasn't told, and won't     │  │
│  │  be able to tell it was you.     │  │
│  ╰───────────────────────────────────╯  │
│                                         │
│  Your unsealed drafts to Sam were       │
│  deleted.                                │
│                                         │
└────────────────────────────────────────┘
```
No bounce, no hint that a block occurred, no "they blocked you." Symmetric and informationless in both directions.

---

## H. Responsive & platform notes

| Case | Behavior |
|---|---|
| **360 × 640 (small Android)** | Gutter drops 20 → 16. `letter` 20 → 18px. Tab labels stay; tab bar never scrolls. Composer CTA stays pinned. |
| **Tablet / landscape** | Thread and composer center in a max-640pt column. Confession text never goes full-bleed (§ typography measure rule). Pulse goes 1-up, not 3-up. |
| **Dynamic Type 200%** | Confession text grows, thread scrolls, composer floats on a `surface` scrim with a top gradient. The last reply is never occluded. Envelope rows clamp to 2 lines of *state* text only (never content). |
| **Landscape, Seal break** | The stage stays a single centered column. The seal never becomes full-bleed. |
| **Tablet split view** | Unsupported for v1. Show a "open on your phone" state rather than a broken two-pane layout. |
| **Dark/light switch** | Instant, no transition (a fade here would look like an animation on purpose). Follows system; overridable in You. |
| **Offline** | Drafts fully editable offline. Sends queue and show `queued`. Reads unavailable. Never silently drop a draft. |
| **Push while locked** | Generic string only: `"Someone responded to your confession."` Never a name, never content, never a recipient. The lock screen is a deanonymization channel. |

## I. Pre-ship visual checklist

- [ ] No emoji used as an icon anywhere — Phosphor 1.5px only
- [ ] No avatar component instantiated on any screen
- [ ] `EnvelopeRow` type signature cannot accept sender or content
- [ ] Every icon-only control ≥ 44pt with an accessible name + state
- [ ] Safe areas respected on all 5 fixed bars; scroll insets ≥ bar + 16
- [ ] 4/8pt rhythm intact on every screen above
- [ ] `tools/contrast_check.py` passes 47/47 in CI
- [ ] Dynamic Type 200% verified at 390pt width
- [ ] Reduced-motion pass on all three signature animations
- [ ] Light and dark both reviewed — no token values assumed to transfer
- [ ] Serif measure ≤ 34em on every screen that renders confession text
- [ ] No reaction or reply count rendered anywhere in the codebase
- [ ] The word "delivered" does not appear in any sender-facing string
