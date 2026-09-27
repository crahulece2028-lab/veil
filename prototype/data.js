const S = (inner, size = 22, w = 1.5) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const I = {
  x: (s) => S('<path d="M18 6 6 18M6 6l12 12"/>', s),
  left: (s) => S('<path d="m15 18-6-6 6-6"/>', s),
  right: (s) => S('<path d="m9 18 6-6-6-6"/>', s),
  search: (s) => S('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', s),
  plus: (s) => S('<path d="M12 5v14M5 12h14"/>', s),
  dots: (s) => S('<circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/>', s),
  check: (s) => S('<path d="m4 12 5 5L20 6"/>', s),
  checkCircle: (s) => S('<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>', s),
  alert: (s) => S('<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17.5v.5"/>', s),
  ban: (s) => S('<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>', s),
  heart: (s) => S('<path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20Z"/>', s),
  lock: (s) => S('<rect x="4.5" y="10" width="15" height="10" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>', s),
  shield: (s) => S('<path d="M12 3 5 6v5.5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6l-7-3Z"/>', s),
  smile: (s) => S('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5v.5M15 9.5v.5"/>', s),
  phone: (s) => S('<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/>', s),
  key: (s) => S('<circle cx="8" cy="14" r="4"/><path d="m11 11 8-8M17 5l2 2M14.5 7.5l2 2"/>', s),
  clock: (s) => S('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>', s),
  inbox: (s) => S('<path d="M3.5 13.5 6 5.5h12l2.5 8v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5Z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/>', s),
  pen: (s) => S('<path d="M4 20h4L20 8a2.5 2.5 0 0 0-4-4L4 16v4Z"/><path d="m14.5 5.5 4 4"/>', s),
  users: (s) => S('<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M15.5 6.2a3.2 3.2 0 0 1 0 5.9M17 14.6a5.5 5.5 0 0 1 3.5 4.9"/>', s),
  chart: (s) => S('<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 20v-6M13 20V9M18 20v-9"/>', s),
  user: (s) => S('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>', s),
  arrowR: (s) => S('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>', s),
  arrowU: (s) => S('<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/>', s),
  down: (s) => S('<path d="M12 4v15"/><path d="m6 13 6 6 6-6"/>', s),
  trash: (s) => S('<path d="M4.5 7h15"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M6.5 7l.8 12A1.5 1.5 0 0 0 8.8 20.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7"/>', s),
  info: (s) => S('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>', s),
  sun: (s) => S('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>', s),
  moon: (s) => S('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>', s),
  menu: (s) => S('<path d="M4 7h16M4 12h16M4 17h16"/>', s),
  list: (s) => S('<path d="M8 6h12M8 12h12M8 18h12M4 6h.5M4 12h.5M4 18h.5"/>', s),
  eye: (s) => S('<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/>', s),
  spark: (s) => S('<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.9L12 18.5l-1.8-5.8L4.5 10.8 10.2 9 12 3.5Z"/>', s),
  flag: (s) => S('<path d="M6 21V4"/><path d="M6 4.5h11l-2 3.5 2 3.5H6"/>', s),
  dashed: (s) => S('<circle cx="12" cy="12" r="8" stroke-dasharray="3 3.2"/>', s),
  seal: (size = 24, state = 'sealed') => sealSvg(size, state),
};

function sealSvg(size, state) {
  const stroke = 'currentColor';
  const ring = `<circle cx="24" cy="24" r="15" fill="none" stroke="${stroke}" stroke-width="2"/>`;
  const notchOpen = `<path d="M18.2 15.6 24 24" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
  if (state === 'signed') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" aria-hidden="true" class="seal__svg">
      <g class="seal__body">${ring}<path d="M11 24h26" stroke="${stroke}" stroke-width="2" opacity="0.35"/><circle cx="24" cy="24" r="15" stroke="var(--accent)" stroke-width="2" fill="none"/></g>
      <path class="seal__stroke" d="M11 24h26" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="220" stroke-dashoffset="0"/>
    </svg>`;
  }
  if (state === 'open') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" aria-hidden="true" class="seal__svg">
      <g class="seal__body">${ring}${notchOpen}</g>
    </svg>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" aria-hidden="true" class="seal__svg">
    <g class="seal__body">
      <circle class="seal__glow" cx="24" cy="24" r="21" fill="currentColor" opacity="0"/>
      <circle cx="24" cy="24" r="15" fill="none" stroke="${stroke}" stroke-width="2"/>
      <path d="M24 16.5 27 24l-3 7.5-3-7.5 3-7.5Z" fill="currentColor" opacity="0.55"/>
    </g>
  </svg>`;
}

const D = {
  me: { pronouns: 'they/them', mood: 'tender', name: 'Sam', campus: "Northside University", year: '2028' },

  people: [
    { id: 'priya', name: 'Priya', mutuals: 3, reason: 'you both know Jordan, Ana', org: null, cohort: null, state: 'channel open', mood: 'brave', pronouns: 'she/her' },
    { id: 'marcus', name: 'Marcus', mutuals: 2, reason: 'both in Rowing', org: 'Rowing', cohort: null, state: 'channel open', mood: 'stupid', pronouns: 'he/him' },
    { id: 'ana', name: 'Ana', mutuals: 4, reason: '4 mutuals · Northside', org: null, cohort: 'Northside Hall', state: 'no channel', mood: 'sorry', pronouns: 'she/her' },
    { id: 'theo', name: 'Theo', mutuals: 2, reason: 'both in Rowing', org: 'Rowing', cohort: null, state: 'no channel', mood: 'quiet', pronouns: 'he/they' },
    { id: 'jordan', name: 'Jordan', mutuals: 3, reason: 'you both know Ana, Leo', org: null, cohort: null, state: 'channel open', mood: 'honest', pronouns: 'they/them' },
    { id: 'leo', name: 'Leo', mutuals: 2, reason: 'same dorm floor', org: null, cohort: 'Northside Hall', state: 'no channel', mood: 'lonely', pronouns: 'he/him' },
  ],

  inbox: [
    { id: 'c1', state: 'sealed', seal: 'sealed', line: 'a confession is waiting', meta: 'dissolves in 14 hours', unread: true },
    { id: 'c2', state: 'sealed', seal: 'sealed', line: 'a confession is waiting', meta: '2 hours ago', unread: true },
    { id: 'c3', state: 'open', seal: 'open', line: 'someone replied', meta: '"still anonymous" · 6h ago', unread: false },
    { id: 'c4', state: 'signed', seal: 'signed', line: 'signed', meta: '"I still think about this" · 3d', unread: false },
    { id: 'c5', state: 'open', seal: 'open', line: 'opened', meta: '4d ago', unread: false },
    { id: 'c6', state: 'dissolved', seal: 'open', line: 'a confession dissolved', meta: '5d ago · there is nothing to see', unread: false, dim: true },
  ],

  thread: [
    {
      id: 't1',
      peer: { pronouns: 'they/them', mood: 'stupid', mutuals: 2 },
      peerSigned: false,
      meSigned: false,
      messages: [
        { side: 'them', text: `that's a lot. i didn't know it was that bad. i was just bad at being there.`, at: '2 hours ago' },
        { side: 'them', text: `you were.`, at: '1 hour ago' },
        { side: 'me', text: `i know. that's why i'm saying it here instead of to your face.`, at: '48 min ago' },
      ],
    },
  ],

  sampleLetter:
    "You never posted the thing you told me you were fine on the night you stopped answering. I'm not mad. I just want you to know I noticed.\n\nI keep drafting a version of this and deleting it, which is the whole reason this app exists.",

  signedLetter:
    "I sat two rows behind you in Chem for a whole semester and said nothing the entire time. You turned around once, in October, and I forgot my own name.\n\nYou probably have no idea who this is. That's the part that made it possible to write.",

  prompts: [
    'Say the thing you said three times in the group chat.',
    'Finish this: "I never told you that…"',
    'Confess something you did that was braver than it felt.',
    "Name the thing you're pretending is fine.",
    'Confess something you only told yourself.',
  ],

  pulse: [
    { scope: 'SENIORS', count: 412, line: 'are going to grad school against their will.', share: true },
    { scope: 'CAMPUS', count: 3104, line: 'Most-named word in confessions this week: "sorry."', share: true },
    { scope: 'ROWING', count: 38, line: 'Nobody has signed one. Not one.', share: true },
  ],

  receipt: [
    ['real identity', 'encrypted', 'ok'],
    ['campus', 'Northside', ''],
    ['class year', '2028 (self)', ''],
    ['send timestamps', 'discarded', 'ok'],
    ['delivery timing', 'randomised', 'ok'],
    ['your drafts', 'only you', ''],
    ['a moderator can see you', 'only to answer a', 'warn'],
    ['', 'report, and it is logged', 'warn'],
    ['the person you wrote to', 'never. ever.', 'ok'],
    ['screenshots we can see', 'none', 'ok'],
  ],
};
