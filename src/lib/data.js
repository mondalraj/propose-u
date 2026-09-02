import raw from '../data.json'

/**
 * Data layer: merges src/data.json over sensible defaults so a partial or
 * malformed data.json can never break the experience.
 */

const defaults = {
  meta: { title: 'For You 💖', theme: 'midnight', locale: 'en' },
  people: { herName: 'Love', yourName: 'Me', coupleName: 'Us' },
  contact: { whatsappNumber: '', smsNumber: '', email: '' },
  landing: {
    greeting: 'Hey {{herName}}…',
    subtitle: 'Something is waiting for you.',
    cta: 'Open it 💌',
    unlockGame: true,
  },
  reasons: {
    title: 'Some things I should have said out loud…',
    items: [{ text: 'You make every day better.', photo: '', emoji: '✨' }],
  },
  games: {
    enabled: true,
    heartCatch: {
      enabled: true,
      title: 'Catch the hearts to unlock your letter',
      durationSeconds: 15,
      targetHearts: 8,
      unlockText: 'Letter unlocked! Opening… 💌',
      skipText: 'Skip — just open it ✨',
    },
    quiz: {
      enabled: true,
      title: 'How well do we match?',
      questions: [],
    },
    scratchCard: {
      enabled: true,
      title: 'One more thing… scratch to reveal',
      foilColor: '#f3c77b',
      hiddenText: '{{herName}}, will you go on a date with me?',
    },
    surpriseWheel: { enabled: true, segments: [] },
    loveMeter: { enabled: true, label: 'Love-o-meter', milestones: ['💗', '💖', '💘'] },
    badge: { title: 'Certified Cutie', subtitle: 'Admit One · Non-refundable · Forever' },
  },
  question: {
    line: '{{herName}}, will you go on a date with me?',
    yesLabel: 'Yes 💖',
    noLabel: 'No',
    maxDodgeAttempts: 5,
    noLoopCaptions: ['Are you sure?', 'Really really sure?', 'Think again 🥺'],
    giveUpLine: 'No worries 😊',
  },
  celebration: { headline: 'I knew it 😍', note: 'Best. Decision. Ever.' },
  planner: {
    heading: 'When do I get to see you?',
    dayLabel: 'Pick a day',
    dayOptions: ['This Saturday', 'Next Friday', 'Surprise me 🎡'],
    vibeLabel: 'Pick a vibe',
    vibeOptions: ['Coffee ☕', 'Dinner 🍽', 'Movie 🎬'],
    confirmLabel: 'Sounds perfect 💖',
    skipLabel: 'Keep it a surprise',
  },
  send: {
    heading: 'Seal the deal 📝',
    messageTemplate: "It's a YES! 💖 See you on {{day}}, {{vibe}}. Can't wait! — {{herName}}",
    sendLabel: 'Send via WhatsApp 💌',
    smsLabel: 'or send via SMS',
    copyLabel: 'or copy the message',
    copiedToast: 'Copied! Now go press send 😌',
  },
  finale: {
    title: 'See you soon 🥰',
    letter: ['Thank you for saying yes.'],
    signature: '— Yours, {{yourName}}',
    easterEgg: { taps: 3, message: 'You found it. 💘' },
  },
  effects: {
    floatingHearts: true,
    cursorTrail: true,
    cardTilt: true,
    backgroundMusic: { enabled: false, url: '' },
  },
  scheduling: {
    gate: { enabled: false, date: '', teaser: 'It’s not time yet 😉' },
  },
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

export function deepMerge(base, over) {
  if (!isPlainObject(over)) return over === undefined ? base : over
  const out = { ...base }
  for (const key of Object.keys(over)) {
    out[key] = isPlainObject(base[key]) ? deepMerge(base[key], over[key]) : over[key]
  }
  return out
}

export const data = deepMerge(defaults, raw)

/** Interpolate {{token}} strings with people names + any extra vars. */
export function t(str, extra = {}) {
  if (typeof str !== 'string') return str
  const vars = {
    herName: data.people.herName,
    yourName: data.people.yourName,
    coupleName: data.people.coupleName,
    ...extra,
  }
  return str.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m))
}

/** Global interpolation helper for pre-baked strings. */
export function T(obj, extra) {
  if (typeof obj === 'string') return t(obj, extra)
  if (Array.isArray(obj)) return obj.map((v) => T(v, extra))
  if (isPlainObject(obj)) {
    const out = {}
    for (const k of Object.keys(obj)) out[k] = T(obj[k], extra)
    return out
  }
  return obj
}
