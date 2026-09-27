const state = {
  route: 'welcome',
  back: [],
  theme: 'dark',
  channels: 0,
  added: new Set(),
  draftBody: '',
  warmth: 0,
  peerSigned: false,
  meSigned: false,
  note: '',
  railsOpen: false,
  specOpen: false,
};

const GROUPS = ['Onboarding', 'Surfaces', 'Writing', 'Safety & states'];

const people = (id) => D.people.find((p) => p.id === id);

const arcs = (n) => `<span class="arcs">${Array.from({ length: Math.min(n, 4) }, () => '<span class="arc"></span>').join('')}</span>`;

const veilChip = (peer, sub) => `
  <span class="veilchip">
    <span class="veil veil--xs"></span>
    <span class="veilchip__text">
      <span class="veilchip__top">${peer.pronouns} <span class="veilchip__mood">&ldquo;${peer.mood}&rdquo;</span></span>
      <span class="veilchip__sub">${sub || `${peer.mutuals} mutuals`}</span>
    </span>
  </span>`;

const topbar = (o = {}) => {
  const left = o.back
    ? `<button class="iconbtn" data-act="back" aria-label="Back">${I.left(22)}</button>`
    : o.left || '';
  const right = o.right || '';
  return `
    <div class="topbar${o.divided === false ? '' : ' topbar--divided'}">
      <div class="topbar__row">
        ${left}
        <div class="topbar__title">${o.title || ''}</div>
        ${right}
      </div>
      ${o.sub ? `<div class="tiny dim" style="margin-top:2px">${o.sub}</div>` : ''}
    </div>`;
};

const tabbar = (active) => {
  const tab = (id, label, ic) => `
    <button class="tab${id === 'write' ? ' tab--write' : ''}" data-tab="${id}" ${active === id ? 'aria-current="true"' : ''}>
      ${id === 'write'
        ? `<span class="tab__pen">${I.pen(24)}</span>`
        : `<span>${ic(21)}</span>`}
      <span class="tab__label">${label}</span>
    </button>`;
  return `
    <nav class="tabbar" aria-label="Primary">
      ${tab('inbox', 'Inbox', I.inbox)}
      ${tab('write', 'Write', I.pen)}
      ${tab('circle', 'Circle', I.users)}
      ${tab('pulse', 'Pulse', I.chart)}
      ${tab('you', 'You', I.user)}
    </nav>`;
};

const progress = (n) => `
  <div class="row" style="gap:6px">
    ${Array.from({ length: 5 }, (_, i) => `<span style="flex:1;height:3px;border-radius:2px;background:${i < n ? 'var(--accent)' : 'var(--border)'}"></span>`).join('')}
  </div>`;

const swatchBlock = (names) => `
  <div class="block">
    <div class="h">Tokens on this screen</div>
    <div class="tokens">${names.map((n) => `<div class="swatch"><div class="swatch__chip" style="background:var(--${n})"></div><div class="swatch__name">${n}</div></div>`).join('')}</div>
  </div>`;

const R = {};

R.welcome = {
  group: 'Onboarding', title: 'Value prop', tab: 'circle', chrome: 'none', tokens: ['bg', 'surface', 'primary', 'text-primary'],
  notes: [
    'One claim, one button. No social proof above the fold and no counters — the claim is the proof, and a testimonial carousel would immediately read as a novelty confession app.',
    'The seal renders at rest, with a low glow. It is the only element in the system permitted to glow, which is what makes a sealed envelope recognisable in a fast dark-room scroll.',
  ],
  render: () => `
    <div class="scroll center pad-top" style="display:flex;flex-direction:column;justify-content:center;min-height:100%">
      <div class="seal seal--glow" style="display:flex;justify-content:center">${I.seal(72)}</div>
      <div class="stack stack-2" style="margin-top:28px">
        <h1 class="type-display">The drafts folder<br>for your campus.</h1>
      </div>
      <p class="type-body muted" style="margin-top:14px">
        Say the thing you never said. To someone you already know.<br>They won't know it was you.
      </p>
      <div class="stack stack-3" style="margin-top:36px">
        <button class="btn" data-go="age-gate">Verify your campus</button>
        <button class="linkbtn" data-go="how-it-works">How it works</button>
      </div>
    </div>`,
};

R['how-it-works'] = {
  group: 'Onboarding', title: 'How it works', chrome: 'none', tokens: ['surface-raised', 'primary', 'seal', 'accent'],
  notes: [
    'The only onboarding animation worth the budget. It teaches the seal-break ritual and the Sign moment before asking for anything, so the first real confession is not a surprise.',
    'Order matters: show the ritual, then the payoff, then the rules. Students tolerate constraints far better once they understand what the constraints are buying them.',
  ],
  render: () => `
    ${topbar({ back: true, title: 'How it works' })}
    <div class="scroll scroll--pad stack stack-5">
      <div class="stack stack-3">
        <div class="row"><span class="veil veil--sm"></span><span class="strong">1 &nbsp;Write to someone you know</span></div>
        <p class="tiny muted" style="padding-left:52px;margin-top:-8px">No strangers, ever. A channel has to exist before you can write to it.</p>
      </div>
      <div class="stack stack-3">
        <div class="row"><span class="seal">${I.seal(40)}</span><span class="strong">2 &nbsp;It arrives sealed</span></div>
        <p class="tiny muted" style="padding-left:52px;margin-top:-8px">They choose when to break it. Yours dissolves in 48 hours if they don't.</p>
      </div>
      <div class="stack stack-3">
        <div class="row"><span class="seal" style="color:var(--accent)">${I.seal(40, 'signed')}</span><span class="strong">3 &nbsp;Either of you can sign it</span></div>
        <p class="tiny muted" style="padding-left:52px;margin-top:-8px">Sharing a name is mutual and voluntary. It is never shown to anyone else, ever.</p>
      </div>
      <div class="note tiny">
        <span class="strong">Nothing is public.</span> No feed, no counts, no profiles, no images. One person reads what you write, and they don't know it's you.
      </div>
      <button class="btn" data-go="age-gate">Verify your campus</button>
    </div>`,
};

R['age-gate'] = {
  group: 'Onboarding', title: 'Age gate', chrome: 'none', tokens: ['bg', 'primary', 'border', 'text-secondary'],
  notes: [
    'Runs before any data entry. "No" is a dead end, not a dismissible sheet — an under-18 user collecting a session is a legal exposure, not a policy preference.',
    'Copy justifies the check in one line. A bare age gate reads as suspicion and costs you the first conversion.',
  ],
  render: () => `
    ${topbar({ back: true, left: `<span></span>`, title: '' })}
    <div class="scroll scroll--pad stack stack-5" style="padding-top:40px">
      <div class="stack stack-3">
        <h1 class="type-title">Are you 18 or older?</h1>
        <p class="type-body muted">This app is for college students 18 and over. We check this once because anonymous speech is something we take seriously.</p>
      </div>
      <button class="btn" data-go="campus-search">Yes, I'm 18+</button>
      <button class="btn btn--outline" data-go="age-no">No</button>
    </div>`,
};

R['age-no'] = {
  group: 'Onboarding', title: 'Under 18 dead end', chrome: 'none', tokens: ['bg', 'surface', 'text-primary', 'text-tertiary'],
  notes: [
    'Static, no lecture, no account creation, no scolding. One sentence and a way out.',
    'K-12 institutions are also excluded at the directory level so the check cannot be bypassed by typing a school name.',
  ],
  render: () => `
    ${topbar({ back: true, title: '' })}
    <div class="scroll center" style="display:flex;flex-direction:column;justify-content:center">
      <div class="stack stack-4" style="max-width:280px">
        <h1 class="type-title">This one's for college students.</h1>
        <p class="type-body muted">You can still use the internet.</p>
      </div>
    </div>`,
};

R['campus-search'] = {
  group: 'Onboarding', title: 'Find your campus', chrome: 'none', tokens: ['bg', 'surface', 'primary', 'border'],
  notes: [
    'K-12 institutions are absent from the directory entirely, not merely unselectable.',
    'An unopened campus is a demand signal, not a dead end: it collects the waitlist for the launch-queue decision in 01 §9 and offers an invite path so interest is productive.',
  ],
  render: () => `
    ${topbar({ back: true, left: `<span></span>`, title: '' })}
    <div class="scroll scroll--pad stack stack-4">
      <h1 class="type-title">Find your campus</h1>
      <label class="row" style="gap:10px;background:var(--surface);border:1px solid var(--primary);border-radius:var(--r-sm);padding:0 14px;min-height:48px">
        <span class="dim">${I.search(20)}</span>
        <input value="Northside" aria-label="Search campuses" style="flex:1;background:none;border:0;outline:none;font-size:15px" />
      </label>
      <div>
        <div class="group-label" style="padding-top:4px">Open</div>
        <button class="card row" style="width:100%;padding:14px 16px;text-align:left;border-color:var(--primary)">
          <span class="grow">
            <span class="strong" style="display:block">Northside University</span>
            <span class="tiny dim">14,200 &middot; 82% on-campus housing</span>
          </span>
          <span class="seal">${I.seal(22)}</span>
        </button>
        <div class="card row" style="width:100%;padding:14px 16px;text-align:left;margin-top:8px">
          <span class="grow">
            <span class="strong" style="display:block">Lakeside College</span>
            <span class="tiny dim">4,100 &middot; 91% on-campus housing</span>
          </span>
          <span class="dim">${I.right(20)}</span>
        </button>
      </div>
      <div>
        <div class="group-label">Not yet open</div>
        <p class="tiny dim" style="padding-left:2px">Fairhaven Institute &middot; Westbrook Polytechnic</p>
        <button class="linkbtn" style="text-align:left;padding-left:0" data-act="noop">Ask a friend to invite 5 people</button>
      </div>
    </div>
    <div style="position:absolute;left:20px;right:20px;bottom:34px">
      <button class="btn" data-go="email-verify">Continue with Northside</button>
    </div>`,
};

R['email-verify'] = {
  group: 'Onboarding', title: 'Email verify', chrome: 'none', tokens: ['bg', 'surface', 'primary', 'warn'],
  notes: [
    'Prefer .edu typing over contact autofill — the address is a verification artefact, not an identity, and the copy says so.',
    'The inline error appears only after submit. Validating on keystroke while someone types a six-character domain suffix is hostile.',
    'This screen points at the privacy receipt before the user has any data worth hiding. Establishing the pattern early is what makes the receipt credible later.',
  ],
  render: () => `
    ${topbar({ back: true, left: `<span></span>`, title: '' })}
    <div class="scroll scroll--pad stack stack-5">
      <h1 class="type-title">Verify your campus email</h1>
      <label class="row" style="gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:0 14px;min-height:48px">
        <input value="sam@northside.edu" aria-label="Campus email" style="flex:1;background:none;border:0;outline:none;font-size:15px" />
      </label>
      <div class="banner banner--warn">
        <span class="banner__icon">${I.alert(20)}</span>
        <p class="tiny">Must be your campus address. Free email isn't accepted.</p>
      </div>
      <p class="tiny muted">
        We use this once to confirm you're a student. We never show it to anyone on Veil,
        and you can see exactly what we hold under <span class="strong">You</span>.
      </p>
    </div>
    <div style="position:absolute;left:20px;right:20px;bottom:34px">
      <button class="btn" data-go="veil-setup">Send the code</button>
    </div>`,
};

R['veil-setup'] = {
  group: 'Onboarding', title: 'Your veil', chrome: 'none', tokens: ['veil', 'surface-raised', 'primary', 'text-tertiary'],
  notes: [
    'No avatar slot. No handle field. No "how others will see you" row with a face in it. The screen is deliberately a little anticlimactic — that absence is the message.',
    'Eight swatches, all AA against both themes. Colour is the only visual differentiator a person gets, and it is deliberately not distinctive enough to be a fingerprint.',
    'The mood word is optional and skippable in one tap. It is the single volunteered attribute that helps a reader address the sender correctly.',
  ],
  render: () => `
    ${topbar({ back: true, left: `<span></span>`, title: '' })}
    <div class="scroll scroll--pad stack stack-5">
      <div class="stack stack-2">
        <h1 class="type-title">Your veil</h1>
        <p class="type-body muted">This is how you'll appear. No photo, no name, no handle.</p>
      </div>
      <div>
        <div class="group-label" style="padding-top:0">Colour</div>
        <div class="row" style="gap:10px;flex-wrap:wrap">
          ${[1, 2, 3, 4, 5, 6, 7, 8]
            .map((n) => `<span class="veil" role="radio" aria-label="Veil colour ${n}" style="width:40px;height:40px;background:var(--veil-${n});${n === 1 ? 'outline:2px solid var(--text-primary);outline-offset:3px' : ''}"></span>`)
            .join('')}
        </div>
      </div>
      <div>
        <div class="group-label">Pronouns</div>
        <div class="row" style="gap:8px;flex-wrap:wrap">
          ${['she/her', 'he/him', 'they/them', 'ask me', 'he/they', 'any']
            .map((p, i) => `<span class="chip${i === 2 ? ' chip--accent' : ''}">${p}</span>`)
            .join('')}
        </div>
      </div>
      <div>
        <div class="group-label">One word <span class="dim" style="text-transform:none;letter-spacing:0;font-weight:400">(optional)</span></div>
        <div style="background:var(--surface-sunken);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 14px;min-height:52px">
          <span class="type-letter-italic" style="font-size:17px">tender</span>
        </div>
        <p class="tiny dim" style="margin-top:6px">How you'd describe the energy of what you send</p>
      </div>
    </div>
    <div style="position:absolute;left:20px;right:20px;bottom:34px" class="stack stack-2">
      <button class="btn" data-go="build-circle">Continue</button>
      <button class="linkbtn" data-act="noop">Skip for now</button>
    </div>`,
};

R['build-circle'] = {
  group: 'Onboarding', title: 'Build your circle', tab: 'circle', tokens: ['veil', 'arcs', 'primary', 'surface-raised'],
  notes: [
    'The cold-start workhorse. Every Add opens a channel immediately, so the user never reaches a dead end and never sees an empty composer.',
    'Every suggestion states its reason. "4 mutuals · Northside" is trust; a bare name is a stranger list, which is the thing this product promised not to be.',
    'Progress bar uses the accent for completed segments only — no celebratory fill animation.',
  ],
  render: () => {
    const n = state.channels;
    return `
    ${topbar({ title: 'Who do you know here?', sub: `Add people you already know. You'll be able to write to them anonymously.`, right: `<span class="tiny dim">Step 3 of 5</span>`, divided: false })}
    <div class="scroll scroll--tabbed stack stack-4">
      ${progress(n)}
      <div class="group-label" style="padding-top:4px">Suggested</div>
      ${D.people.filter((p) => p.state === 'no channel').map((p) => `
        <div class="card row" style="padding:12px 14px">
          <span class="veil veil--sm"></span>
          <span class="grow">
            <span class="strong" style="display:block">${p.name}</span>
            <span class="row row--tight tiny dim" style="margin-top:2px">${arcs(p.mutuals)}<span>${p.reason}</span></span>
          </span>
          <button class="btn btn--sm" style="width:78px" data-add="${p.id}" ${added(p.id) ? 'disabled' : ''}>${added(p.id) ? 'Added' : 'Add'}</button>
        </div>`).join('')}
      <button class="linkbtn" style="margin-top:4px">Show more</button>
      <p class="tiny dim center" style="padding:8px 0 0">You have <span class="strong">${n} of 3</span> people to write to</p>
    </div>
    <div style="position:absolute;left:20px;right:20px;bottom:78px">
      <button class="btn" ${n >= 3 ? 'data-go="channel-gate"' : 'disabled'}>${n >= 3 ? 'Continue' : `Add ${3 - n} more`}</button>
    </div>
    ${tabbar('circle')}`;
  },
};

R['channel-gate'] = {
  group: 'Onboarding', title: 'Channel gate', tab: 'circle', tokens: ['veil', 'surface-raised', 'primary', 'text-tertiary'],
  notes: [
    'A hard product gate: no Write tab until three channels exist. This is why onboarding converts — the user always lands somewhere they can send.',
    'Copy is a progress state, not an error, and it explains the reason. A gate without a reason reads as friction and gets uninstalled.',
    'Search is offered but visually discouraged. Honest about capability, uninviting on purpose.',
  ],
  render: () => `
    ${topbar({ title: 'Add two more', sub: "You'll be able to write once you have 3." })}
    <div class="scroll scroll--tabbed center stack stack-5" style="padding-top:36px">
      <div class="row" style="justify-content:center;gap:6px">
        <span class="veil veil--sm"></span><span class="veil veil--sm"></span><span class="veil veil--sm" style="opacity:.28"></span>
      </div>
      <h1 class="type-title" style="max-width:280px">You have 1 of 3 people to write to.</h1>
      <p class="type-body muted" style="max-width:290px">Adding people you already know is how Veil stays quiet and anonymous. Strangers are the thing we're built to avoid.</p>
      <div class="stack stack-2" style="text-align:left">
        <div class="card row" style="padding:12px 14px">
          <span class="veil veil--sm"></span><span class="grow row row--tight">Ana ${arcs(4)}<span class="tiny dim">Northside</span></span>
          <button class="btn btn--sm" style="width:78px" data-add="ana">Add</button>
        </div>
        <div class="card row" style="padding:12px 14px">
          <span class="veil veil--sm"></span><span class="grow row row--tight">Theo ${arcs(2)}<span class="tiny dim">Rowing</span></span>
          <button class="btn btn--sm" style="width:78px" data-add="theo">Add</button>
        </div>
      </div>
      <button class="btn btn--quiet" data-go="pulse">Not ready? See what your campus is saying</button>
    </div>
    ${tabbar('circle')}`,
};

R.circle = {
  group: 'Surfaces', title: 'Your circle', tab: 'circle', tokens: ['veil', 'surface', 'primary', 'arcs'],
  notes: [
    'The sign-in artefact is a 6-character code, never a link. A link encodes your friend list and leaks your graph to anyone who intercepts it — including a screenshot.',
    'Activity is coarse and relative: "this week", "a while ago". On this product a precise timestamp is a location.',
    'Tabs put Circle third, not first. It is heavy early and light later, and it must not occupy the most valuable slot in the navigation.',
  ],
  render: () => `
    ${topbar({ title: 'Your circle', right: `<button class="btn btn--sm" style="width:auto" data-act="noop">${I.plus(16)} Add</button>` })}
    <div class="scroll scroll--tabbed stack stack-2">
      <div class="group-label" style="padding-top:2px">People who know you &nbsp;<span class="dim">${state.channels || 14}</span></div>
      ${D.people.filter((p) => p.state === 'channel open' || (p.state === 'no channel' && state.channels)).map((p) => `
        <div class="sealrow" style="position:relative;border-radius:var(--r-lg);border-bottom:0;background:var(--surface);border:1px solid var(--border)">
          <span class="veil veil--sm"></span>
          <span class="grow">
            <span class="strong" style="display:block">${p.name}</span>
            <span class="row row--tight tiny dim" style="margin-top:2px">${arcs(p.mutuals)}<span>${p.state === 'channel open' ? 'this week' : 'a while ago'}</span></span>
          </span>
          ${p.state === 'channel open' ? `<span class="chip chip--success">${I.check(13)} verified</span>` : `<span class="chip">no channel</span>`}
          <button class="iconbtn" data-go="person" aria-label="Open ${p.name}">${I.right(20)}</button>
        </div>`).join('')}
      <div class="group-label">Suggested</div>
      ${D.people.filter((p) => p.state === 'no channel').map((p) => `
        <div class="card row" style="padding:12px 14px;margin-bottom:8px">
          <span class="veil veil--sm"></span>
          <span class="grow">
            <span class="strong" style="display:block">${p.name}</span>
            <span class="row row--tight tiny dim" style="margin-top:2px">${arcs(p.mutuals)}<span>${p.reason}</span></span>
          </span>
          <button class="btn btn--sm" style="width:78px" data-add="${p.id}">${added(p.id) ? 'Added' : 'Add'}</button>
        </div>`).join('')}
      <div class="card row" style="padding:14px;margin-top:8px">
        <span class="dim">${I.key(20)}</span>
        <span class="grow">
          <span class="proof strong" style="letter-spacing:.14em">NORTH-4K2X</span>
          <span class="tiny dim" style="display:block">Share this with someone you know here.</span>
        </span>
      </div>
      <div class="group-label">Invites</div>
      <div class="card row" style="padding:12px 14px">
        <span class="veil veil--sm"></span>
        <span class="grow"><span class="strong">Sam</span><span class="tiny dim" style="display:block">invited you</span></span>
        <button class="btn btn--sm" style="width:88px" data-act="noop">Accept</button>
      </div>
    </div>
    ${tabbar('circle')}`,
};

R.person = {
  group: 'Surfaces', title: 'Person sheet', tab: 'circle', tokens: ['veil', 'success', 'warn', 'border'],
  notes: [
    'The trust ledger is the product. Verification tiers each carry a distinct glyph and label so state never depends on colour alone.',
    'Mutual names are listed. "You both know: Jordan, Ana, Leo" is the concrete form of trust; an abstract "4 mutuals" is weaker and less persuasive.',
    'Confessions render as a blur strip. There is no preview, no excerpt, no length. A recipient learns what a person is like by reading, not by scrolling.',
    'Close channel is one tap and is never disclosed to the other party. Both directions are informationless.',
  ],
  render: () => `
    ${topbar({ back: true, right: `<button class="iconbtn" data-act="noop" aria-label="Close">${I.x(22)}</button>`, title: '' })}
    <div class="scroll scroll--tabbed stack stack-5" style="align-items:center;padding-top:8px">
      <span class="veil veil--lg"></span>
      <div class="center stack stack-1">
        <h1 class="type-title">Priya</h1>
        <span class="row row--tight muted" style="justify-content:center">${arcs(3)}<span class="type-body">3 mutuals</span></span>
      </div>
      <div class="card" style="width:100%">
        ${[[I.checkCircle(17), 'campus email verified', 'success', 'tier 1'],
           [I.checkCircle(17), 'class year 2028 · confirmed by 2 mutuals', 'success', 'tier 2'],
           [I.dashed(17), 'dorm · self reported', 'warn', 'unverified']]
          .map(([ic, t, c, tag]) => `<div class="row" style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:14px">
              <span class="${c === 'success' ? 'dim' : ''}" style="${c === 'warn' ? 'color:var(--warn)' : ''}">${ic}</span><span class="grow">${t}</span>
              <span class="tiny dim">${tag}</span>
            </div>`).join('')}
        <div style="padding:12px 16px">
          <p class="tiny dim">You both know</p>
          <p class="type-body" style="margin-top:4px">Jordan, Ana, Leo</p>
        </div>
      </div>
      <div class="blurtext" style="width:100%">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</div>
      <div class="stack stack-2" style="width:100%">
        <button class="btn" data-go="composer">Write anonymously</button>
        <button class="btn btn--quiet" data-go="channel-closed">Close channel</button>
      </div>
    </div>
    ${tabbar('circle')}`,
};

R.inbox = {
  group: 'Surfaces', title: 'Inbox', tab: 'inbox', tokens: ['surface', 'seal', 'primary', 'text-tertiary'],
  notes: [
    'A sealed row is the component with the strictest contract: it has no prop for sender and no prop for body. The anonymity promise is enforced at the type level, not by discipline.',
    'Meta lines are states, not content. "A confession dissolved · there is nothing to see" is a terminal row, not a teaser for something deleted.',
    'The unread marker is a 2px accent bar, not a badge count on the row. A count invites triage; the point of a sealed envelope is that it gets opened, not managed.',
  ],
  render: () => `
    ${topbar({ title: 'Inbox', right: `<button class="iconbtn" data-act="noop" aria-label="More">${I.dots(22)}</button>` })}
    ${state.note ? `<div style="padding:0 20px 8px"><div class="banner"><span class="banner__icon" style="color:var(--success)">${I.checkCircle(20)}</span><p class="tiny">${state.note}</p></div></div>` : ''}
    <div class="scroll scroll--tabbed">
      <div class="group-label" style="padding-top:2px">Today</div>
      ${D.inbox.slice(0, 3).map(sealRow).join('')}
      <div class="group-label">This week</div>
      ${D.inbox.slice(3).map(sealRow).join('')}
    </div>
    ${tabbar('inbox')}`,
};

function sealRow(c) {
  const clickable = c.state === 'sealed' ? 'data-go="seal-break"' : c.state === 'open' ? 'data-go="thread"' : 'data-act="noop"';
  return `
    <button class="sealrow" style="position:relative;background:var(--surface);border:1px solid var(--border);border-bottom:0;border-radius:var(--r-lg);margin-bottom:8px;${c.unread ? 'border-color:color-mix(in srgb, var(--primary) 45%, var(--border))' : ''}" ${clickable} aria-label="${c.line}">
      ${c.unread ? '<span class="sealrow__unread"></span>' : ''}
      <span class="seal" style="${c.dim ? 'opacity:.4' : ''}">${I.seal(40, c.seal)}</span>
      <span class="sealrow__text">
        <span class="sealrow__state" style="${c.dim ? 'color:var(--text-tertiary)' : ''}">${c.state === 'signed' ? 'signed' : c.line}</span>
        <span class="sealrow__meta">${c.meta}</span>
      </span>
      ${c.state === 'sealed' ? `<span class="dim">${I.right(20)}</span>` : `<span class="dim">${I.dots(20)}</span>`}
    </button>`;
}

R['inbox-empty'] = {
  group: 'Safety & states', title: 'Inbox — empty', tab: 'inbox', tokens: ['bg', 'seal', 'primary', 'text-tertiary'],
  notes: [
    'The worst moment in the product\'s life. The fix is a real number pulled from the real graph — never a joke, an illustration, or "check back later".',
    'One primary action. A second path to the Pulse is offered, because a student who has nothing to receive still has a reason to stay.',
  ],
  render: () => `
    ${topbar({ title: 'Inbox', right: `<button class="iconbtn" data-act="noop" aria-label="More">${I.dots(22)}</button>` })}
    <div class="scroll center" style="display:flex;flex-direction:column;justify-content:center;padding-bottom:80px">
      <div class="stack stack-5" style="max-width:290px">
        <span class="seal" style="align-self:center;opacity:.5">${I.seal(56)}</span>
        <h1 class="type-title">Nothing sealed yet.</h1>
        <p class="type-body muted"><span class="strong">14 people who know you</span> are on Veil right now.</p>
        <button class="btn" data-go="composer">Write your first one</button>
        <button class="linkbtn" data-go="pulse">see what your campus is saying</button>
      </div>
    </div>
    ${tabbar('inbox')}`,
};

R.thread = {
  group: 'Surfaces', title: 'Thread', tab: 'inbox', dock: true, tokens: ['surface', 'primary', 'accent', 'surface-raised'],
  notes: [
    'Confession body is Newsreader 20/32, measure capped at 34em and centred. Switching to a serif the moment a user reads something personal is the cheapest signal in the system.',
    'Warmth and Sign it are siblings at equal visual weight. Signing must never look like the reward for reacting — the moment it does, the product becomes an extraction mechanic.',
    'No read receipt, no typing indicator, no "active now", no reply count. Anything time-shaped is a deanonymisation channel on this product.',
    'Last reply must stay reachable: the composer docks with a scrim and the scroll area carries 132px of bottom inset.',
  ],
  render: () => {
    const t = D.thread[0];
    const meSigned = state.meSigned, peerSigned = state.peerSigned;
    const signed = meSigned && peerSigned;
    return `
    ${topbar({ back: true, title: '', right: `<button class="iconbtn" data-go="report" aria-label="Thread options">${I.dots(22)}</button>`, divided: false })}
    <div class="scroll scroll--composer">
      <div class="msg" style="padding-top:20px">
        <div class="msg__meta">${arcs(2)} 2 mutuals &middot; sealed 6h ago</div>
        <div class="letter">${D.sampleLetter}</div>
      </div>
      <div class="msg__rule"></div>
      <div class="msg">
        <div>${veilChip(t.peer, signed ? 'signed 2h ago' : '2 hours ago')}</div>
        ${t.messages.map((m) => `
          <div class="${m.side === 'me' ? 'stack stack-2' : ''}">
            ${m.side === 'me' ? `<div class="msg__meta" style="justify-content:flex-end">${D.me.pronouns} · you${meSigned ? ' · signed' : ''}</div>` : ''}
            <div class="letter letter--small" style="${m.side === 'me' ? 'text-align:right' : ''}">${m.text}</div>
          </div>`).join('')}
      </div>
      ${peerSigned ? signRevealBlock() : ''}
    </div>
    <div class="composer-dock">
      <div class="row" style="gap:10px;margin-bottom:10px">
        <button class="btn btn--sm btn--outline" style="flex:1" data-act="warmth" ${state.warmth >= 3 ? 'disabled' : ''}>
          <span class="seal" style="color:${state.warmth ? 'var(--accent)' : 'inherit'}">${I.heart(16)}</span>
          ${state.warmth ? 'warmth sent' : 'warmth'}${state.warmth ? ` · ${3 - state.warmth} left` : ''}
        </button>
        ${peerSigned
          ? (meSigned
            ? `<span class="btn btn--sm btn--outline" style="flex:1;color:var(--accent);border-color:color-mix(in srgb,var(--accent) 40%,transparent)">signed</span>`
            : `<button class="btn btn--sm btn--honey" style="flex:1" data-go="sign-sheet">Sign it back</button>`)
          : `<button class="btn btn--sm btn--outline" style="flex:1" data-go="sign-sheet">Sign it</button>`}
      </div>
      <div class="row row--tight" style="background:var(--surface-sunken);border:1px solid var(--border);border-radius:var(--r-md);padding:10px 12px">
        <input placeholder="Reply anonymously&hellip;" aria-label="Reply" style="flex:1;background:none;border:0;outline:none;font-family:var(--font-content);font-size:17px" />
        <span class="seal">${I.seal(20)}</span>
      </div>
    </div>`;
  },
};

function signRevealBlock() {
  return `
    <div class="msg" style="align-items:center;text-align:center;padding-bottom:32px">
      <span class="seal" style="color:var(--accent)">${I.seal(48, 'signed')}</span>
      <div class="signed-rule" style="width:100%"></div>
      <p class="type-body" style="max-width:280px"><span class="strong">They signed first.</span> You can sign back, or keep this anonymous. Both are fine.</p>
    </div>`;
}

R['thread-signed'] = {
  group: 'Surfaces', title: 'Thread — both signed', tab: 'inbox', dock: true, tokens: ['accent', 'surface', 'primary', 'text-tertiary'],
  notes: [
    'Signed is a moment or it is nothing, so the honey rule is the only permanent marker in the system. It also makes a signed thread the only content eligible for the strength-boosted Share sheet.',
    'Both parties get a one-time Keep / Remove choice. There is no retroactive purge — by the time you sign, you have both consented to it existing.',
  ],
  render: () => `
    ${topbar({ back: true, title: '', right: `<button class="iconbtn" data-go="report" aria-label="Thread options">${I.dots(22)}</button>`, divided: false })}
    <div class="scroll scroll--composer">
      <div class="msg" style="padding-top:20px">
        <div class="msg__meta">${arcs(2)} 2 mutuals &middot; signed yesterday</div>
        <div class="letter">${D.signedLetter}</div>
      </div>
      <div class="msg__rule"></div>
      <div class="msg">
        <div>${veilChip({ pronouns: 'they/them', mood: 'stupid', mutuals: 2 }, 'signed 2h ago')}</div>
        <div class="letter letter--small">it was you the whole time. i would have said something. i definitely would have said something.</div>
      </div>
      <div class="msg" style="align-items:center;text-align:center;padding-bottom:28px">
        <span class="seal" style="color:var(--accent)">${I.seal(48, 'signed')}</span>
        <div class="signed-rule" style="width:100%"></div>
        <p class="type-signature" style="color:var(--accent)">you both signed</p>
        <p class="tiny dim" style="max-width:260px">No one else on campus can see either of your names. Not even moderators.</p>
      </div>
    </div>
    <div class="composer-dock">
      <div class="row" style="gap:10px;margin-bottom:10px">
        <button class="btn btn--sm btn--outline" style="flex:1">${I.check(16)} Keep this thread</button>
        <button class="btn btn--sm btn--quiet" style="flex:1">Remove from archive</button>
      </div>
      <div class="row row--tight" style="background:var(--surface-sunken);border:1px solid var(--border);border-radius:var(--r-md);padding:10px 12px">
        <input placeholder="Reply&hellip;" aria-label="Reply" style="flex:1;background:none;border:0;outline:none;font-family:var(--font-content);font-size:17px" />
        <span class="seal">${I.seal(20)}</span>
      </div>
    </div>`,
};

R.pulse = {
  group: 'Surfaces', title: 'Campus pulse', tab: 'pulse', tokens: ['surface', 'primary', 'text-primary', 'border'],
  notes: [
    'The number is the hero. No chart chrome, no card-inside-card, no illustration — a chart on one aggregate sentence would be decoration pretending to be analysis.',
    'Bucket size is shown because hiding it would be a lie about method. k >= 25 is enforced in the database, not in the query, and the under-threshold case returns nothing rather than a fallback.',
    'The "How this works" footnote is not optional legal small print. It is the reason the feature is trustworthy, and it is what makes the share card defensible.',
    'This screen is the organic acquisition loop: the share card is designed for screenshots to Stories, with the aggregate number prominent and the campus optionally blurred.',
  ],
  render: () => `
    ${topbar({ title: 'Pulse', sub: 'What your campus said this week', divided: false })}
    <div class="scroll scroll--tabbed stack stack-3">
      ${D.pulse.map((p) => `
        <div class="card" style="padding:16px">
          <p class="type-caption dim">${p.scope} &nbsp;&middot;&nbsp; ${p.count.toLocaleString()} CONFESSIONS</p>
          <p class="pulse-num" style="margin-top:10px">${p.line}</p>
          <div class="divider" style="margin:14px 0 8px"></div>
          <button class="btn--bare row row--tight" style="color:var(--primary)">${I.arrowU(17)}<span class="type-label">share</span></button>
        </div>`).join('')}
      <div class="note" style="margin-top:8px">
        <p class="tiny dim">How this works</p>
        <p class="tiny muted" style="margin-top:6px">
          Numbers only appear when at least 25 people are in the group, and always 48 hours after
          the week closes. Nothing here can be traced back to you, and no bucket ever falls back to
          a smaller group to find something to show.
        </p>
      </div>
    </div>
    ${tabbar('pulse')}`,
};

R.you = {
  group: 'Surfaces', title: 'You', tab: 'you', tokens: ['veil', 'surface', 'primary', 'border'],
  notes: [
    'The privacy receipt is an entry inside your profile, not a tab of its own. It is part of who you are here, not a destination.',
    'Rate limits are printed in plain numbers on the profile rather than hidden in settings. Users should never have to guess a limit they cannot see.',
    'You cannot change your veil once someone has signed with you. A mutable veil turns a signed promise into a moving target.',
  ],
  render: () => `
    ${topbar({ title: 'You' })}
    <div class="scroll scroll--tabbed stack stack-3">
      <div class="card row" style="padding:16px">
        <span class="veil veil--md"></span>
        <span class="grow">
          <span class="strong" style="display:block">${D.me.pronouns} &middot; &ldquo;${D.me.mood}&rdquo;</span>
          <span class="tiny dim">${I.check(12)} verified &middot; Northside &rsquo;28</span>
        </span>
      </div>
      <div class="group-label">Your privacy</div>
      <button class="card row" style="width:100%;padding:14px 16px;text-align:left" data-go="receipt">
        <span class="seal">${I.lock(20)}</span>
        <span class="grow"><span class="strong">What we hold about you</span><span class="tiny dim" style="display:block">34 items, itemised</span></span>
        <span class="dim">${I.right(20)}</span>
      </button>
      <button class="card row" style="width:100%;padding:14px 16px;text-align:left;margin-top:8px" data-go="thread-signed">
        <span style="color:var(--accent)">${I.checkCircle(20)}</span>
        <span class="grow"><span class="strong">Sealed and signed threads</span><span class="tiny dim" style="display:block">1 signed</span></span>
        <span class="dim">${I.right(20)}</span>
      </button>
      <button class="card row" style="width:100%;padding:14px 16px;text-align:left;margin-top:8px" data-go="noop">
        <span class="dim">${I.flag(20)}</span>
        <span class="grow"><span class="strong">What you can control</span></span>
        <span class="dim">${I.right(20)}</span>
      </button>
      <div class="group-label">Limits</div>
      <div class="note">
        <p class="type-proof" style="color:var(--text-secondary)">3 to a person / 7 days &nbsp;·&nbsp; 5 a day<br>20 a week &nbsp;·&nbsp; 3 Circle Drafts &nbsp;·&nbsp; 3 warmth a day</p>
        <p class="tiny dim" style="margin-top:8px">Everyone gets the same. These are limits, not judgments.</p>
      </div>
      <div class="group-label">More</div>
      <div class="stack stack-1">
        ${['Your report history', 'Our transparency report', 'Campus rules', 'Block list', 'Sign out']
          .map((t) => `<button class="sealrow" style="border-bottom:1px solid var(--border)" data-act="noop"><span class="grow type-body">${t}</span><span class="dim">${I.right(20)}</span></button>`).join('')}
      </div>
    </div>
    ${tabbar('you')}`,
};

R.receipt = {
  group: 'Surfaces', title: 'Privacy receipt', tab: 'you', tokens: ['surface-sunken', 'primary', 'text-secondary', 'border'],
  notes: [
    'This is the most important screen in the product and the most shareable asset it owns. It is typeset in monospace with dotted leaders like a bank statement or a Tor receipt, because overclaiming is ugly.',
    'The aesthetic argument is the argument: a screenshot of this should look like something you would find in a security tool, not an About page.',
    'Warn-coloured values are the two lines that cost us something. A receipt with no sharp edges is marketing; these are the lines a sceptical friend is actually checking for.',
    'The last line is the whole promise in one sentence, and it is the only place the app is allowed to be emphatic.',
  ],
  render: () => `
    ${topbar({ back: true, title: 'What we hold about you' })}
    <div class="scroll scroll--tabbed stack stack-3">
      <div class="receipt">
        <div class="receipt__head">WHAT WE HOLD ABOUT YOU</div>
        <div class="receipt__rule"></div>
        ${D.receipt.map(([k, v, c]) => `
          <div class="receipt__line">
            <span class="receipt__key">${k || '&nbsp;'}</span>
            <span class="receipt__dots"></span>
            <span class="receipt__val${c ? ` receipt__val--${c}` : ''}">${v}</span>
          </div>`).join('')}
        <div class="receipt__rule"></div>
        <div class="receipt__line" style="color:var(--text-tertiary)">
          <span class="receipt__key">▸ 34 items</span><span class="receipt__dots"></span><span class="receipt__val">see all</span>
        </div>
        <div class="receipt__line" style="color:var(--text-tertiary)">
          <span class="receipt__key">▸ delete this account</span><span class="receipt__dots"></span><span class="receipt__val">24h</span>
        </div>
        <div class="receipt__line" style="color:var(--text-tertiary)">
          <span class="receipt__key">▸ export everything</span><span class="receipt__dots"></span><span class="receipt__val">24h</span>
        </div>
      </div>
      <div class="note">
        <p class="tiny"><span class="strong">There is no setting that makes us share your identity with the person you wrote to.</span></p>
      </div>
    </div>
    ${tabbar('you')}`,
};

R.composer = {
  group: 'Writing', title: 'Composer', tab: 'write', dock: true, tokens: ['surface-sunken', 'primary', 'surface-raised', 'border'],
  notes: [
    'Drafts-first. The thought is usually the easy part and the recipient is the hard part, so the composer never forces the choice up front and autosaves continuously with the save time always visible.',
    'The prompt seed is Newsreader italic, dismissible, and never emotionally loaded toward a named individual. It exists to defeat the blank page, not to steer the confession.',
    'Recipient selection is a channel picker sorted by relationship strength, one tap, no search-first. Sending to 3 is a Circle Drop; sending to 25 is not offered at all.',
    'The composer docks over the scroll area with a scrim so the last draft line is never occluded on a 360 x 640 device.',
  ],
  render: () => `
    ${topbar({ left: `<button class="iconbtn" data-act="noop" aria-label="Close">${I.x(22)}</button>`, right: `<span class="tiny dim">Draft saved 14:02</span>`, title: '', divided: false })}
    <div class="scroll scroll--composer stack stack-4" style="padding-top:4px">
      <div class="row" style="align-items:flex-start;gap:10px">
        <span class="type-letter-italic" style="font-size:19px;line-height:29px;flex:1;color:var(--text-secondary)">${D.prompts[0]}</span>
        <button class="iconbtn" data-act="noop" aria-label="Dismiss prompt" style="margin-top:-6px">${I.x(18)}</button>
      </div>
      <div style="background:var(--surface-sunken);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;min-height:180px">
        <textarea id="draft" placeholder="" aria-label="Confession" style="width:100%;min-height:150px;background:none;border:0;outline:none;resize:none;font-family:var(--font-content);font-size:20px;line-height:32px;color:var(--text-primary)">${state.draftBody}</textarea>
        <p class="tiny dim" style="text-align:right"><span id="draftCount">${state.draftBody.length}</span> / 2000</p>
      </div>
      <div class="row row--tight" style="flex-wrap:wrap">
        ${['neutral', 'cruel', 'crush', 'pii'].map((k, i) => `<button class="chip chip--tap${i === 0 ? ' chip--accent' : ''}" data-tone="${k}">${k === 'pii' ? 'contains a phone number' : k}</button>`).join('')}
      </div>
      <div class="group-label">To</div>
      ${[people('priya'), people('marcus')].map((p, i) => `
        <div class="card row" style="padding:12px 14px;margin-bottom:8px">
          <span class="veil veil--sm"></span>
          <span class="grow"><span class="strong">${p.name}</span><span class="row row--tight tiny dim" style="margin-top:2px">${arcs(p.mutuals)}</span></span>
          <span class="chip${i === 0 ? ' chip--accent' : ''}">${i === 0 ? 'Sealed' : '48h'}</span>
          <button class="iconbtn" data-act="noop" aria-label="Change seal mode for ${p.name}">${I.dots(20)}</button>
        </div>`).join('')}
      <button class="btn btn--outline btn--sm" data-go="drop-picker">${I.plus(16)} Circle Drop (5&ndash;8 people)</button>
    </div>
    <div class="composer-dock">
      <div class="row row--tight">
        <p class="tiny dim grow">${state.draftBody ? 'Goes out within the hour. Unsends for 24h.' : 'Write something first'}</p>
        <button class="btn" style="width:auto;padding:0 22px" data-act="send" ${state.draftBody ? '' : 'disabled'}>Seal and send</button>
      </div>
    </div>`,
};

R['composer-tone'] = {
  group: 'Writing', title: 'Tone advisory', tab: 'write', dock: true, tokens: ['surface-raised', 'warn', 'primary', 'border'],
  notes: [
    'Non-blocking, and the "send anyway" line is explicit. A hard block on tone creates a moderation-evasion incentive: people learn to obfuscate and retry, which is strictly worse than an ugly confession.',
    'Warn colour, not danger. This is an advisory about a person\'s behaviour, and using the destructive-action red here would be a category error in the palette.',
    'PII is the one hard block, because it protects a third party who never consented. The contrast between the two is the whole design: advice for your words, a stop for someone else\'s data.',
    'The chips along the top are the classifier states, exposed as a dev affordance. In production this strip is not rendered.',
  ],
  render: () => `
    ${topbar({ left: `<button class="iconbtn" data-go="composer" aria-label="Close">${I.x(22)}</button>`, right: `<span class="tiny dim">Draft saved 14:04</span>`, title: '', divided: false })}
    <div class="scroll scroll--composer stack stack-3" style="padding-top:4px">
      <div class="banner banner--warn">
        <span class="banner__icon">${I.alert(20)}</span>
        <div class="stack stack-2">
          <p class="type-body-strong">This reads as an attack on Priya.</p>
          <p class="tiny muted">Rewrite it, or send it to a Circle Drop instead of a person.</p>
          <div class="row row--tight" style="margin-top:4px">
            <button class="btn btn--sm" style="width:auto" data-go="drop-picker">Send to a Circle Drop</button>
            <button class="btn btn--sm btn--quiet" style="width:auto" data-go="composer">Keep editing</button>
          </div>
          <p class="tiny dim" style="margin-top:6px">You can send it anyway.</p>
        </div>
      </div>
      <div style="background:var(--surface-sunken);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;min-height:150px">
        <div class="letter" style="font-size:19px;line-height:30px">you're so fake and everyone knows it. you had a whole speech at the party and it was about nothing.</div>
      </div>
      <div class="group-label">To</div>
      <div class="card row" style="padding:12px 14px">
        <span class="veil veil--sm"></span>
        <span class="grow"><span class="strong">Priya</span><span class="row row--tight tiny dim" style="margin-top:2px">${arcs(3)}</span></span>
        <span class="chip chip--accent">Sealed</span>
      </div>
    </div>
    <div class="composer-dock">
      <button class="btn" data-go="post-send">Seal and send anyway</button>
    </div>`,
};

R['composer-pii'] = {
  group: 'Writing', title: 'PII hard block', tab: 'write', tokens: ['danger', 'surface', 'border', 'text-secondary'],
  notes: [
    'The single ⛔ in the app. Everything else advisory; this is the only refusal, because it protects someone who is not in the conversation.',
    'The removed text is shown struck through rather than silently deleted. A silent strip teaches people the filter is arbitrary; a visible one teaches them what not to write.',
    'Both exits persist the draft. Losing a 2,000-character confession to a safety check is the fastest way to lose a user permanently.',
  ],
  render: () => `
    ${topbar({ back: true, left: `<span></span>`, title: '' })}
    <div class="scroll scroll--tabbed stack stack-5" style="padding-top:24px">
      <div class="row row--tight"><span style="color:var(--danger)">${I.ban(22)}</span><span class="type-title">That message can't be sent</span></div>
      <p class="type-body muted">You included someone's phone number. Confessions are read by one person, but their details are still theirs to share.</p>
      <div>
        <p class="type-caption dim" style="margin-bottom:8px">Removed from your draft</p>
        <div style="padding:12px 14px;border-radius:var(--r-sm);background:var(--surface-sunken);border:1px solid var(--border)">
          <span class="letter" style="font-size:18px;line-height:28px;color:var(--text-tertiary);text-decoration:line-through">and my number is 555-0142 if you ever need it</span>
        </div>
      </div>
    </div>
    <div style="position:absolute;left:20px;right:20px;bottom:96px" class="stack stack-2">
      <button class="btn" data-go="composer">Edit and send</button>
      <button class="btn btn--quiet" data-go="drafts">Save as draft</button>
    </div>
    ${tabbar('write')}`,
};

R['drop-picker'] = {
  group: 'Writing', title: 'Circle Drop', tab: 'write', tokens: ['veil', 'surface-raised', 'primary', 'border'],
  notes: [
    '5&ndash;8 people, no per-person attribution, no individual reply tracking, and no way to forward the drop back to the sender. Above 8 it becomes a broadcast, which is a different product with different risks.',
    'The strongest pattern in the product: "has anyone else&hellip;". It is the highest-viral item in the P1 tier and the least abusable, because the content is aimed at a group rather than a person.',
  ],
  render: () => `
    ${topbar({ back: true, title: 'Circle Drop', right: `<span class="chip">6 of 8</span>` })}
    <div class="scroll scroll--tabbed stack stack-2" style="padding-top:4px">
      <p class="tiny muted" style="padding-bottom:8px">Nobody is named or attributed. No one can reply to this individually, and it can't be traced back to you.</p>
      ${D.people.map((p, i) => `
        <div class="card row" style="padding:12px 14px;margin-bottom:8px">
          <span class="veil veil--sm"></span>
          <span class="grow"><span class="strong">${p.name}</span><span class="row row--tight tiny dim" style="margin-top:2px">${arcs(p.mutuals)}</span></span>
          <span class="chip${i < 6 ? ' chip--accent' : ''}">${i < 6 ? 'in' : 'out'}</span>
        </div>`).join('')}
    </div>
    <div style="position:absolute;left:20px;right:20px;bottom:96px">
      <button class="btn" data-go="post-send">Seal for 6 people</button>
    </div>
    ${tabbar('write')}`,
};

R['post-send'] = {
  group: 'Writing', title: 'Post-send confirmation', chrome: 'none', tokens: ['primary', 'accent', 'surface', 'border'],
  notes: [
    'The word "delivered" must not exist in any sender-facing string. The product is built on the sender not knowing when, or whether, anyone is looking, and the copy has to be literally true.',
    'The unsend window is stated in hours with a live countdown, not as a vague "recently". Certainty is the whole value of offering it.',
  ],
  render: () => `
    <div class="overlay overlay--center">
      <div class="sheet sheet--inline stack stack-4" style="text-align:center">
        <span class="seal seal--glow" style="align-self:center">${I.seal(56)}</span>
        <div class="stack stack-1">
          <p class="type-title">Sealed.</p>
        </div>
        <p class="type-body muted">It arrives within the hour and dissolves in 48 hours if it isn't opened.<br><br>You can unsend for 24 hours.</p>
        <button class="btn" data-go="drafts">Unsend</button>
        <button class="btn btn--quiet" data-go="inbox">Done</button>
      </div>
    </div>`,
};

R.drafts = {
  group: 'Writing', title: 'Drafts', tab: 'write', tokens: ['surface', 'veil', 'primary', 'warn'],
  notes: [
    'The list clamps a preview to two lines; the editor never truncates. Truncation in the list is fine because the full text is one tap away, and truncation in the thread is not.',
    'A draft with no recipient chosen yet is a first-class state. Forcing recipient selection is the single most common way a writing tool loses a confession before it is sent.',
    'The footer line "3 drafts. Send one to keep writing." is a soft nudge, never a guilt mechanism.',
  ],
  render: () => `
    ${topbar({ back: true, title: 'Drafts', right: `<span class="tiny dim">Unsends in 23h</span>` })}
    <div class="scroll scroll--tabbed stack stack-3">
      ${[["i still think about what you said in the hallway after orientation…", "Priya", "Sealed", true],
         ["has anyone else completely given up on their major", "Circle Drop (6)", "48h", false],
         ["", "not chosen yet", "no seal", false]]
        .map(([t, to, seal, timed]) => `
          <div class="card" style="padding:14px">
            <p class="letter" style="font-size:17px;line-height:26px;min-height:26px">${t || '<span style="color:var(--text-tertiary)">(untitled draft)</span>'}</p>
            <div class="divider" style="margin:12px 0 10px"></div>
            <div class="row row--tight">
              <span class="veil veil--xs"></span>
              <span class="tiny muted grow">to ${to} &middot; ${seal}</span>
              ${timed ? `<span class="chip chip--warn">23h</span>` : ''}
              <button class="iconbtn" data-act="noop" aria-label="Draft options">${I.dots(20)}</button>
            </div>
          </div>`).join('')}
      <p class="tiny dim center" style="padding-top:8px">3 drafts. Send one to keep writing.</p>
    </div>
    ${tabbar('write')}`,
};

R['seal-break'] = {
  group: 'Safety & states', title: 'Seal break', base: 'inbox', tab: 'inbox', tokens: ['bg', 'seal', 'primary', 'text-tertiary'],
  notes: [
    'The only full-screen takeover in the app, so it has to be perfect and skippable at once. One action, one text exit, both at 44pt minimum hit area.',
    'The blurred strip reveals no sender, no length and no excerpt. It exists purely to signal that something is there.',
    'Modal semantics are non-negotiable: focus trapped, focus moved to the heading on open, returned to the originating row on close, Escape and swipe both dismiss.',
    'Reduced motion: 160ms cross-fade, no split, no glow, no scale. The ritual is decoration; the access to the content is not.',
  ],
  render: () => `
    <div class="overlay overlay--center break-anim">
      <div class="sheet sheet--inline stack stack-5 center" style="background:var(--bg);padding:32px 24px">
        <span class="seal seal--glow" style="align-self:center">${I.seal(120)}</span>
        <span class="blurtext">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span>
        <div class="stack stack-2">
          <p class="type-title">This seal is yours to break.</p>
          <p class="type-body muted">Whoever sent this will never know it was them.</p>
        </div>
        <button class="btn" data-go="thread">Break the seal</button>
        <button class="linkbtn" data-go="inbox">not yet</button>
      </div>
    </div>`,
};

R['sign-sheet'] = {
  group: 'Safety & states', title: 'Sign sheet', base: 'thread', tab: 'inbox', tokens: ['surface', 'primary', 'accent', 'border'],
  notes: [
    'Eight lines that have to be emotionally warm and legally unambiguous at the same time. The mutual-mechanics paragraph is not optional decoration — it is the only thing stopping the sheet from reading as a one-sided unmasking.',
    '"Keep it anonymous" has equal visual weight to the primary action. A ghost button on the opt-out is the single most manipulative thing this screen could do.',
    'The Veil preview tells you exactly what the other person will see, so nobody signs into a surprise.',
  ],
  render: () => `
    <div class="overlay overlay--sheet">
      <div class="sheet stack stack-4">
        <div class="sheet__grab"></div>
        <div class="row"><span class="grow type-title">Sign it</span><button class="iconbtn" data-go="thread" aria-label="Close">${I.x(22)}</button></div>
        <p class="type-body muted">Signing shares <span class="strong">your</span> name with the person you're writing to.</p>
        <p class="type-body muted">It does not share theirs. Signing is mutual &mdash; they choose their own.</p>
        <p class="tiny dim">You stay anonymous to everyone else, always.</p>
        <div class="card" style="padding:12px 14px">
          ${veilChip({ pronouns: 'they/them', mood: 'stupid', mutuals: 2 })}
        </div>
        <button class="btn" data-go="sign-confirm">Share my name</button>
        <button class="btn btn--quiet" data-go="thread">Keep it anonymous</button>
      </div>
    </div>`,
};

R['sign-confirm'] = {
  group: 'Safety & states', title: 'Sign confirmation', base: 'thread', tab: 'inbox', tokens: ['primary', 'accent', 'surface', 'border'],
  notes: [
    'A mandatory second step. Signing is irreversible-in-spirit and hands another human a real piece of information, so it should never be one tap.',
    'The revocation clause is the trust line: "until they sign back or reply again". It converts an irreversible act into a reversible window and is the reason this sheet can afford to be warm.',
  ],
  render: () => `
    <div class="overlay overlay--center">
      <div class="sheet sheet--inline stack stack-4">
        <div class="stack stack-2">
          <p class="type-title">Share your name with one person?</p>
          <p class="type-body muted">They'll see your name and pronouns. Nobody else will &mdash; not the rest of your campus, and not moderators.</p>
        </div>
        <div class="card" style="padding:12px 14px">
          <div class="row">
            <span class="veil veil--sm"></span>
            <span class="grow"><span class="strong">You, as ${D.me.pronouns}</span><span class="tiny dim" style="display:block">name visible to 1 person</span></span>
          </div>
        </div>
        <p class="tiny dim">You can change your mind until they sign back or reply again.</p>
        <button class="btn btn--honey" data-act="sign">Sign it</button>
        <button class="btn btn--quiet" data-go="thread">Cancel</button>
      </div>
    </div>`,
};

R['sign-reveal'] = {
  group: 'Safety & states', title: 'Sign reveal', base: 'thread', tab: 'inbox', tokens: ['accent', 'seal', 'primary', 'text-secondary'],
  notes: [
    '640ms, once, never on a list, never repeated: honey stroke draws across the open seal, their Veil fades in, a 1px honey rule draws left-to-right, the signature lands.',
    'A signed stroke is rendered with stroke-dashoffset so the reveal is literally the act of signing. The one piece of narrative motion in the product.',
    'After the reveal the copy says "That is fine" explicitly. This is the moment the pressure-to-peel is highest and the design has to actively decline it.',
  ],
  render: () => `
    <div class="overlay overlay--center">
      <div class="sheet sheet--inline stack stack-4 center" style="text-align:center">
        <span class="seal strokewrap" style="align-self:center;color:var(--accent)">${I.seal(64, 'signed')}</span>
        <div class="signed-rule" style="width:100%"></div>
        <div class="stack stack-2">
          <p class="type-title">Someone shared their name.</p>
          <p class="type-body muted">You can sign back, or keep this anonymous.<br><span class="strong">Both are fine.</span></p>
        </div>
        <div class="stack stack-1" style="text-align:left;width:100%">
          <p class="tiny dim">&middot; they can see your name now</p>
          <p class="tiny dim">&middot; no one else can</p>
          <p class="tiny dim">&middot; you can change your mind until they sign back</p>
        </div>
        <button class="btn btn--honey" data-go="thread">Sign it too</button>
        <button class="btn btn--quiet" data-go="thread">Keep it anonymous</button>
      </div>
    </div>`,
};

R.report = {
  group: 'Safety & states', title: 'Report sheet', base: 'thread', tab: 'inbox', tokens: ['surface', 'primary', 'text-secondary', 'border'],
  notes: [
    'Deliberately calm: surface background, no red bleed, no warning triangle above 20pt. Reporting should feel like paperwork, not a trapdoor.',
    '"Not for me &mdash; just remove it" sits beside Submit, not buried. Burying the lighter action is a dark pattern; the reader should be able to decline without also filing a case.',
    'The assurance is specific: a person, not a bot queue, and they will never know who reported them. "Your privacy is protected" would be worthless here; "they will never know who reported them" is checkable.',
    'No severity picker. The reporter classifies the content, not the seriousness of the punishment.',
  ],
  render: () => `
    <div class="overlay overlay--sheet">
      <div class="sheet stack stack-4">
        <div class="sheet__grab"></div>
        <div class="row"><span class="grow type-title">Report</span><button class="iconbtn" data-go="thread" aria-label="Close">${I.x(22)}</button></div>
        <p class="type-body muted">This goes to a person, not a bot queue. They will never know who reported them.</p>
        <p class="type-body strong">What's wrong?</p>
        <div class="stack stack-1">
          ${['Harassment or threats', 'Cruel or degrading', 'Sexual', 'Self-harm or crisis', "Someone's private info", 'Not a student here']
            .map((r, i) => `<label class="row" style="gap:10px;min-height:var(--tap);font-size:15px"><input type="radio" name="reason" ${i === 0 ? 'checked' : ''} style="accent-color:var(--primary);width:18px;height:18px" /><span>${r}</span></label>`).join('')}
        </div>
        <p class="type-body strong" style="padding-top:4px">Anything else? <span class="dim" style="font-weight:400">(optional)</span></p>
        <div style="min-height:72px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--r-sm);background:var(--surface-sunken)"></div>
        <button class="btn" data-act="report">Submit report</button>
        <button class="btn btn--quiet" data-go="inbox">Not for me &mdash; just remove it</button>
      </div>
    </div>`,
};

R['rate-limit'] = {
  group: 'Safety & states', title: 'Rate limit notice', tab: 'inbox', tokens: ['surface-raised', 'warn', 'primary', 'border'],
  notes: [
    'States the number, the reset time, and the reason, then closes with "that is a limit, not a judgment". Shaming a sender does not reduce abuse and it makes them leave instead.',
    'Warn colour rather than danger. A limit is not a violation, and the palette should not overstate it.',
    'The "see all limits" link exists because a limit the user cannot find is indistinguishable from arbitrary enforcement.',
  ],
  render: () => `
    ${topbar({ back: true, title: 'Confession limits' })}
    <div class="scroll scroll--tabbed">
      <div class="banner banner--warn" style="margin-top:8px">
        <span class="banner__icon">${I.clock(20)}</span>
        <div class="stack stack-2">
          <p class="type-body-strong">3 to a person, every 7 days</p>
          <p class="type-body muted">You've sent 3 confessions to them in the last 7 days.</p>
          <p class="type-body muted">You can send again on Tuesday.</p>
          <div class="divider" style="margin:10px 0"></div>
          <p class="tiny dim">That's a limit, not a judgment. Everyone gets the same.</p>
          <button class="btn btn--sm btn--quiet" style="width:auto;padding:0;color:var(--primary)">See all limits</button>
        </div>
      </div>
    </div>
    ${tabbar('inbox')}`,
};

R.crisis = {
  group: 'Safety & states', title: 'Crisis interstitial', chrome: 'none', tokens: ['danger', 'surface', 'warn', 'primary'],
  notes: [
    'role="alertdialog", focus trapped, never auto-dismissed, resources reachable by keyboard. It is the only screen in the app that behaves like a system dialog.',
    'The product says plainly that it is not a crisis service. That sentence is load-bearing: it is the reason the screen is showing, and a product that implied otherwise would be lying to someone at the worst moment.',
    'Nothing was sent and the draft is saved. "Send anyway" is never offered for a self-harm signal about the author &mdash; the P0 review path handles the third-party case instead.',
    'Every crisis interaction is reviewed within 7 days for whether the check actually helped. If the honest answer is "we interrupted something that was not a crisis and lost the confession", that is a finding to fix.',
  ],
  render: () => `
    <div style="position:absolute;inset:0;z-index:70;background:var(--bg);display:flex;align-items:center;padding:20px;overflow-y:auto">
      <div class="card" style="width:100%;padding:24px;border-color:color-mix(in srgb, var(--danger) 40%, var(--border))">
        <div class="stack stack-4">
          <div class="row row--tight"><span style="color:var(--danger)">${I.shield(22)}</span><span class="type-title">This sounds like something heavier than a confession</span></div>
          <p class="type-body muted">This app isn't a crisis service. Please talk to someone who can actually help, right now.</p>
          <div class="stack stack-2">
            ${[['Northside Counseling', '(555) 010-0142 · 24/7', I.phone(18)],
               ['988 Suicide & Crisis', 'call or text · 24/7', I.phone(18)],
               ['Text someone you trust', 'anonymously, through us', I.smile(18)]]
              .map(([t, s, ic]) => `
                <div class="card row" style="padding:12px 14px">
                  <span class="dim">${ic}</span>
                  <span class="grow"><span class="strong">${t}</span><span class="tiny dim" style="display:block">${s}</span></span>
                  <span class="dim">${I.right(18)}</span>
                </div>`).join('')}
          </div>
          <p class="tiny dim">Your draft is saved. Nothing has been sent.</p>
          <button class="btn" data-go="composer">Back to my draft</button>
        </div>
      </div>
    </div>`,
};

R['channel-closed'] = {
  group: 'Safety & states', title: 'Channel closed', tab: 'circle', tokens: ['surface', 'primary', 'warn', 'text-secondary'],
  notes: [
    'Symmetric and informationless in both directions: the person you blocked is not told, and if you are blocked you get no signal at all. No bounce, no hint, no "they blocked you".',
    'Unsealed drafts to that person are deleted, and the copy says so, because a silent draft deletion looks like data loss.',
    'The reassurance line is the reason this screen is not anxiety-inducing: "Sam was not told, and will not be able to tell it was you."',
  ],
  render: () => `
    ${topbar({ back: true, left: `<span></span>`, title: '' })}
    <div class="scroll scroll--tabbed" style="padding-top:32px">
      <div class="stack stack-5" style="max-width:300px">
        <span class="dim">${I.lock(28)}</span>
        <h1 class="type-title">This channel is closed</h1>
        <p class="type-body muted">You and Sam can no longer write to each other.</p>
        <p class="type-body muted">Sam wasn't told, and won't be able to tell it was you.</p>
        <p class="tiny dim" style="padding-top:4px">Your unsealed drafts to Sam were deleted.</p>
        <button class="btn" data-go="circle">Back to your circle</button>
      </div>
    </div>
    ${tabbar('circle')}`,
};

function added(id) { return state.added.has(id); }

const ORDER = [
  'welcome', 'how-it-works', 'age-gate', 'age-no', 'campus-search', 'email-verify', 'veil-setup', 'build-circle', 'channel-gate',
  'circle', 'person', 'inbox', 'inbox-empty', 'thread', 'thread-signed', 'pulse', 'you', 'receipt',
  'composer', 'composer-tone', 'composer-pii', 'drop-picker', 'post-send', 'drafts',
  'seal-break', 'sign-sheet', 'sign-confirm', 'sign-reveal', 'report', 'rate-limit', 'crisis', 'channel-closed',
];

const stage = document.getElementById('screen');
const rail = document.getElementById('rail');
const specEl = document.getElementById('spec');
const backBtn = document.getElementById('backBtn');
const fwdBtn = document.getElementById('fwdBtn');
const themeBtn = document.getElementById('themeBtn');
const motionBtn = document.getElementById('motionBtn');

function go(id, push = true) {
  if (!R[id]) return;
  if (push && state.route !== id) state.back.push(state.route);
  state.route = id;
  state.railsOpen = false;
  render();
}

function back() {
  if (state.back.length) { state.route = state.back.pop(); render(); }
  else { state.route = 'welcome'; render(); }
}

function body(id) {
  const r = R[id];
  return `${r.tab && r.chrome !== 'none' ? tabbar(r.tab) : ''}${r.render()}`;
}

function render() {
  const r = R[state.route];
  stage.setAttribute('data-chrome', r.chrome || 'tabs');
  stage.innerHTML = `
    <div class="notch"></div>
    <div class="statusbar"><span>9:41</span><span class="statusbar__icons">${I.spark(14)}${I.inbox(14)}</span></div>
    ${r.base ? body(r.base) + r.render() : body(state.route)}
    <div class="homebar"></div>`;
  renderRail();
  renderSpec();
  backBtn.disabled = state.back.length === 0;
  fwdBtn.disabled = state.back.length === 0;
}

function renderRail() {
  rail.innerHTML = GROUPS.map((g) => {
    const ids = ORDER.filter((id) => R[id].group === g);
    if (!ids.length) return '';
    return `
      <div class="rail__group">
        <div class="rail__label">${g}</div>
        ${ids.map((id) => `
          <button class="rail__item" data-go="${id}" ${id === state.route ? 'aria-current="true"' : ''}>
            <span class="rail__dot"></span><span>${R[id].title}</span>
          </button>`).join('')}
      </div>`;
  }).join('');
  rail.classList.toggle('rail--open', state.railsOpen);
}

function renderSpec() {
  const r = R[state.route];
  const notes = (r.notes || []).map((n) => `<p class="p">${n}</p>`).join('');
  specEl.innerHTML = `
    <div class="spec__head">
      <div class="spec__kicker">${r.group}</div>
      <div class="spec__title">${r.title}</div>
    </div>
    <div class="spec__body">
      ${swatchBlock(r.tokens || ['bg', 'surface', 'primary', 'text-primary'])}
      <div class="block">
        <div class="h">Design intent</div>
        ${notes || '<p class="p">—</p>'}
      </div>
      <div class="block">
        <div class="h">Wireframe reference</div>
        <p class="p">See <code>docs/05-wireframes.md</code>. Tokens in <code>docs/03-design-system.md</code>.</p>
      </div>
      <div class="block">
        <div class="h">Contract</div>
        <p class="p spec__ok">Sender identity is unreachable from any recipient-scoped query.</p>
        <p class="p spec__warn">No reply counts, no likes, no read receipts.</p>
        <p class="p spec__warn">Never reveal one party to the other without both consenting.</p>
      </div>
    </div>`;
  specEl.classList.toggle('spec--open', state.specOpen);
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('overlay')) { back(); return; }

  const goEl = e.target.closest('[data-go]');
  const actEl = e.target.closest('[data-act]');
  const tabEl = e.target.closest('[data-tab]');
  const addEl = e.target.closest('[data-add]');

  if (addEl) {
    if (!state.added.has(addEl.dataset.add) && state.channels < 3) {
      state.added.add(addEl.dataset.add);
      state.channels += 1;
    }
    render();
    return;
  }
  if (tabEl) {
    const t = tabEl.dataset.tab;
    if (t === 'write') go('composer');
    else if (t === 'inbox') go('inbox');
    else if (t === 'circle') go('circle');
    else if (t === 'pulse') go('pulse');
    else if (t === 'you') go('you');
    return;
  }
  if (goEl) { go(goEl.dataset.go); return; }

  const act = actEl && actEl.dataset.act;
  if (act === 'back') { back(); return; }
  if (act === 'noop') return;
  if (act === 'warmth') { if (state.warmth < 3) { state.warmth += 1; render(); } return; }
  if (act === 'sign') { state.meSigned = true; state.peerSigned = true; go('sign-reveal'); return; }
  if (act === 'report') { state.note = 'Thanks. A person is reviewing this. They will never know who reported them.'; go('inbox'); return; }
  if (act === 'send') { state.draftBody = ''; go('post-send'); return; }
});

document.addEventListener('input', (e) => {
  if (e.target.id !== 'draft') return;
  state.draftBody = e.target.value;
  const c = document.getElementById('draftCount');
  if (c) c.textContent = String(state.draftBody.length);
  const btn = e.target.closest('.screen').querySelector('[data-act="send"]');
  if (btn) btn.disabled = !state.draftBody;
});

const scrimEl = document.getElementById('scrim');
const menuBtn = document.getElementById('menuBtn');

function syncChrome() {
  rail.classList.toggle('rail--open', state.railsOpen);
  specEl.classList.toggle('spec--open', state.specOpen);
  scrimEl.style.display = state.railsOpen || state.specOpen ? 'block' : 'none';
  menuBtn.innerHTML = `${I.menu(15)} Screens`;
}

backBtn.addEventListener('click', back);
fwdBtn.addEventListener('click', () => {
  const next = ORDER[Math.min(ORDER.indexOf(state.route) + 1, ORDER.length - 1)];
  if (next === state.route) return;
  state.back.push(state.route);
  go(next, false);
});
themeBtn.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  themeBtn.innerHTML = state.theme === 'dark' ? `${I.moon(15)} Dark` : `${I.sun(15)} Light`;
});
motionBtn.addEventListener('click', () => {
  const on = document.documentElement.classList.toggle('reduce-motion');
  motionBtn.textContent = on ? 'Motion: reduced' : 'Motion: full';
});
menuBtn.addEventListener('click', () => { state.railsOpen = !state.railsOpen; syncChrome(); });
document.getElementById('specBtn').addEventListener('click', () => { state.specOpen = !state.specOpen; syncChrome(); });
scrimEl.addEventListener('click', () => { state.railsOpen = false; state.specOpen = false; syncChrome(); });

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { back(); } });

document.documentElement.dataset.theme = state.theme;
themeBtn.innerHTML = `${I.moon(15)} Dark`;
syncChrome();
render();
