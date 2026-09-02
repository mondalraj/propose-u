# 💖 PRD — "Say Yes" · A Romantic, Gamified Date-Proposal Website

**Version:** 1.1 (Revised after feedback — adds gamification, desktop-first design, data.json personalization)
**Author:** Cline (with Rajib)
**Status:** Awaiting approval
**Date:** 2026-09-02

---

## 1. Overview

A single-page, **desktop-first but fully responsive**, romantic web experience that Rajib sends to his girlfriend as a link. It is **gamified and playful** — not a static page she scrolls through, but a little world she plays with. She unlocks a love letter by catching hearts, plays a quick "how well do we match?" quiz, scratches a card to reveal the big question, and survives the infamous runaway **"No" button** (which shrinks while "Yes" grows — an effect that shines on a big desktop screen). On "Yes" the site erupts into confetti, she picks a **date day + vibe** (or spins a surprise wheel), and her answer lands on Rajib's **WhatsApp** via a cute pre-filled message.

**Zero backend.** All personalization lives in one `data.json` file in the repo — Rajib edits it later; the app works out of the box with placeholder values.

### 1.2 Design Philosophy (the "99% acceptance" principles)
1. **Play, don't read** — every screen has something tappable, draggable, or unlockable. Gamification keeps her engaged for 2–3 delightful minutes.
2. **One screen, one idea** — never a form, never a wall of text.
3. **Emotion before ask** — games warm her up; the question lands with weight.
4. **Personal = powerful** — her name, couple photos, inside jokes, all from `data.json`.
5. **Never stuck, ever** — every game has a visible Skip, every interaction has a guaranteed exit, nothing depends on hover-only, nothing can deadlock. Fully keyboard-accessible.
6. **Desktop-first spectacle** — the dodge-and-shrink effect, cursor heart trail, and confetti physics are designed for a large canvas first, then gracefully adapted to mobile.

---

## 2. Target User & Context

| | |
|---|---|
| **Primary user** | The girlfriend — non-technical, opens the link on **desktop or phone**. |
| **Secondary user** | Rajib — customizes only `data.json`, deploys to **Vercel**. |
| **Device priority** | **Desktop-first** (1920 / 1440 / 1024), fully responsive down to 320px mobile. |
| **Session length** | 2–3 minutes, single session. |

**Success = she plays the little games, taps Yes, picks a date, and a lovely WhatsApp message lands on Rajib's phone.**

---

## 3. User Flow (gamified)

```
S0 · LANDING "For You 💌"
     Ambient floating hearts, cursor heart-trail (desktop).
     A sealed envelope is locked: "Catch hearts to open it 💌"
        │
        ▼
G1 · HEART-CATCH UNLOCK (15s, skippable)
     Hearts drift up; click/tap to burst them. Progress bar.
     Goal reached → envelope glows and unlocks → wobbles open.
        │
        ▼
S1 · REASONS (3–4 cards, animated text reveals)
     Staggered word reveals, photos with tilt-on-hover.
        │
        ▼
G2 · "HOW WELL DO WE MATCH?" QUIZ (3 questions, skippable)
     Every answer is right — each pick fills the LOVE METER and
     shows a charming reaction. Meter hits 100% → sparkle burst.
        │
        ▼
G3 · SCRATCH CARD
     Rose-gold foil heart. Scratch (drag) to reveal the question.
     (Accessibility: [Reveal] button always available.)
        │
        ▼
S4 · THE BIG QUESTION
     "{Name}, will you go on a date with me?"
     [ Yes 💖 ]  [ No ]  ← No dodges+shrinks, Yes grows
     (desktop spectacle: No flees across the viewport w/ physics)
        │
        ▼
S5 · CELEBRATION 💥
     Heart-shaped confetti barrage + "I knew it 😍" + badge:
     "🏆 Certified Cutie — Admit One" ticket stamp animation.
        │
        ▼
S6 · PLAN THE DATE
     Day chips + Vibe chips — OR G4: SPIN THE SURPRISE WHEEL 🎡
        │
        ▼
S7 · CONFIRM & SEND 📲
     Summary ticket card + [Send via WhatsApp 💌] (wa.me deep link)
     Fallbacks: [SMS] [Copy message]. After send → S8.
        │
        ▼
S8 · FINALE
     Typewriter love letter, "See you soon 🥰",
     easter egg: tap the heart 3× → mini heart-firework.
```

**Global playful systems across all scenes:**
- **Love Meter** (persistent, top corner 💗): fills with every interaction — bursting hearts, quiz answers, scratching, saying yes. Cosmetic reward loop.
- **Confetti micro-bursts** on meaningful taps (the big barrage is saved for "Yes").
- **Cursor heart trail** on desktop; tilt-on-hover cards; spring-press buttons everywhere.

---

## 4. Gamification & Playful Effects (the anti-boring layer)

All games are **opt-out-able** via `data.json` → `games.*.enabled`, and each is individually **skippable in the UI** ("Skip ✨" link always visible). Nothing gates progress behind skill — losing a game still advances (with a playful line), so she can **never get stuck**.

| ID | Game / Effect | Mechanic | Reward | Why it's fun |
|----|---------------|----------|--------|--------------|
| **G1** | **Heart-Catch Unlock** | Hearts drift up a canvas; click/tap to pop them (burst particles + pop sound-free haptic feel). Goal e.g. 8 hearts in 15s | Envelope unlocks & wobbles open | Instant interactive hook in the first 5 seconds |
| **G2** | **"How well do we match?" quiz** | 3 playful questions from data.json (e.g. "Who said 'I love you' first?" / "Our dream snack date?"). **Every option is a winning answer** — each pick triggers a charming reaction + fills the Love Meter | Sparkle burst at 100% | Makes her smile about your memories; zero risk of "wrong" |
| **G3** | **Scratch-to-Reveal card** | Rose-gold foil over the question; scratch by dragging (desktop mouse / touch). Auto-reveals after 60% scratched | The Big Question appears with a shimmer | Anticipation + tactile delight |
| **G4** | **Surprise Wheel 🎡** | If she picks "Surprise me" (or config allows), a spinning wheel lands on a date vibe with easing + a satisfying settle wobble | Locked-in date idea | Turns a decision into a moment |
| **G5** | **Love Meter** (global) | Fills with every interaction across scenes | Cosmetic milestones (💗 → 💖 → 💘) | Constant reward feedback |
| **G6** | **Badge ticket** | After "Yes", an animated ticket stamps in: "🏆 Certified Cutie — Admit One (non-refundable)" | Shareable screenshot moment | Memorable payoff |
| **G7** | **Runaway No Button** (the classic) | No dodges with spring physics, shrinks each attempt (5 stages), captions cycle from data.json; Yes grows proportionally | On desktop, the shrinking No vs giant glowing Yes is comedy gold | The most viral mechanic of these sites |
| **G8** | **Easter egg** | Tap the finale heart 3× → mini heart firework + secret message from data.json | A hidden smile | Rewards the curious |
| **FX1** | **Cursor heart trail** (desktop only) | Hearts bloom softly behind the cursor, throttled | — | Makes the desktop feel alive |
| **FX2** | **Ambient canvas** | Floating hearts + slow hue-shifting gradient; DPR-aware, pauses when tab hidden | Atmosphere | Romantic mood |
| **FX3** | **Micro-interactions** | Spring button presses, card tilt on hover, word-by-word text reveals, scene cross-fades | Polish | "Top notch" feel |

**Anti-stuck guarantees for every game:** visible Skip button · auto-complete timers · keyboard-operable equivalents · no hover-only mechanics · no dead-ends · reduced-motion swaps dodge/particles for gentle fades.

---

## 5. Feature List

### 5.1 Core

| # | Feature | Priority | Details |
|---|---------|----------|---------|
| F1 | Personalized landing + envelope | P0 | Name from data.json; envelope unlock via G1 (skippable). |
| F2 | Reasons cards | P0 | Staggered text/photo reveals, progress dots, Next/swipe/auto. |
| F3 | Match quiz | P1 | All answers "win"; configurable questions/reactions. |
| F4 | Scratch card reveal | P1 | Pointer-drag scratch + accessible Reveal button. |
| F5 | The Question + runaway No | P0 | 5-stage dodge loop, caption cycle, Yes growth; desktop-first spectacle. |
| F6 | Celebration | P0 | Confetti barrage (heart shapes), headline, badge ticket. |
| F7 | Date planner | P0 | Day + vibe chips, live summary, Surprise Wheel (G4). |
| F8 | WhatsApp handoff | P0 | `wa.me` deep link with templated message from data.json; SMS + copy fallbacks. |
| F9 | Finale + easter egg | P1 | Typewriter letter, heart-tap firework. |

### 5.2 Non-Functional

| Area | Requirement |
|------|-------------|
| **Accessibility** | WCAG 2.1 AA: full keyboard operability, focus-visible rings, 44px+ tap targets, AA contrast, `prefers-reduced-motion` swaps animations for gentle fades, screen-reader labels on all games, no hover-only info. |
| **Never stuck** | Every scene has an enabled primary action at all times; games auto-complete on timeout; skip always visible; back button works (hash routes); no pointer-capture traps; try/catch around canvas effects degrades to static UI. |
| **Responsiveness** | Desktop-first breakpoints (1920/1440/1024 designed first) then 768/480/320. Layout never overflows, never clips, no horizontal scroll at any width. |
| **Performance** | Lighthouse ≥ 90 mobile; total JS ≤ ~200KB gz; canvas effects DPR-aware and paused when hidden. |
| **Compatibility** | iOS Safari 15+, Chrome 100+, Firefox 110+. |
| **Privacy** | No cookies, no tracking, no data leaves the page except the WhatsApp deep link she taps. |
| **Deploy** | Vercel static build (`vercel deploy`), zero config. |

---

## 6. Design System (desktop-first, modern, minimalist)

### 6.1 Art Direction
**"Midnight love letter"** — deep plum/ink night-sky background, warm rose-gold and blush accents, glowing soft light. **Minimalist**: generous whitespace, max 2 typefaces, one accent color doing the work, no visual clutter. Elegant and modern, not childish.

### 6.2 Color Tokens

| Token | Value | Use |
|-------|-------|-----|
| `bg-primary` | `#16091E` deep plum-ink | Page background |
| `bg-secondary` | `#2A1240` | Cards / wash |
| `accent-rose` | `#FF5E8A` | Primary CTA (Yes), highlights |
| `accent-blush` | `#FFC2D4` | Soft fills, chips |
| `accent-gold` | `#F3C77B` | Foil, sparkles, fine accents |
| `text-primary` | `#FFF5F7` | Headlines |
| `text-secondary` | `#D9B8C4` | Body copy |

### 6.3 Typography & Type Motion
- **Display:** *Playfair Display* (italic for romance) · **UI/Body:** *Outfit*
- Headline reveals animated word-by-word (staggered rise + fade) via GSAP SplitText or Motion stagger.
- h1 `clamp(2.5rem, 6vw, 5rem)` on desktop · body ≥ 1.05rem/1.6.

### 6.4 Shape, Spacing, Motion
- Cards 24px radius, soft rose glow; pill buttons (primary rose gradient / ghost outline / playful No).
- Spacing scale 4→64; desktop content column max 720px (wider than mobile-first designs since desktop is primary).
- **Motion stack:**
  - **Motion (prev. Framer Motion)** — primary engine: scene transitions (`AnimatePresence`), spring physics, gestures (drag/scratch), layout animations. MIT, tiny API.
  - **GSAP** — companion for choreographed **SplitText** word reveals and the wheel-spin timeline.
  - **canvas-confetti** — heart-shaped bursts.
  - Motion token: spring `stiffness 260, damping 20`; duration 200–600ms; `prefers-reduced-motion` → opacity fades only.

---

## 7. Screens (single-page app, 9 scenes)

One route (`/`) + hash deep-links (`#question`, `#celebrate`) for back-button support. Scenes cross-fade + slide via `AnimatePresence`.

| Scene | Purpose | Key elements | Skippable |
|-------|---------|--------------|-----------|
| **S0 · Landing** | Hook | Envelope lock + "catch hearts to open" | Yes (Open directly) |
| **G1 · Heart catch** | Hook | Canvas hearts, progress bar, 15s timer | Yes |
| **S1 · Reasons** | Build-up | 3–4 cards, photo tilt, dots | — |
| **G2 · Quiz** | Warm-up | 3 questions, reactions, meter fill | Yes |
| **G3 · Scratch card** | Anticipation | Foil scratch → question shimmer | Yes (Reveal button) |
| **S4 · Question** | The ask | Yes + runaway No | — |
| **S5 · Celebration** | Payoff | Confetti barrage, badge ticket | — |
| **S6 · Planner** | Schedule | Day/vibe chips or Surprise Wheel | Yes (Keep it a surprise) |
| **S7 · Send** | Handoff | Message preview, WhatsApp/SMS/Copy | — |
| **S8 · Finale** | Close | Typewriter letter, easter egg | — |

**Desktop-first layout:** generous centered stage (max 720px content on a full ambient canvas), buttons side-by-side with big presence, dodge field = entire viewport. **Mobile adaptation:** stacked layout, dodge field = viewport-safe area, cursor-trail off, touch-optimized targets.

---

## 8. Tech Stack & Architecture

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Vite + React 18** (JSX) | Simple, fast, Vercel-native. |
| Styling | **Tailwind CSS v4** | Tokens, desktop-first via `min-width` breakpoints. |
| Animation | **Motion (prev. Framer Motion)** + **GSAP (SplitText)** | Springs/gestures + choreographed text reveals. |
| Confetti | **canvas-confetti** | Heart shapes, tiny. |
| Data | **`data.json`** (static import + optional runtime override) | Single file to personalize. |
| State | React state + tiny hash router | No router lib. |
| Backend | **None** | WhatsApp/SMS deep links only. |
| Hosting | **Vercel** | Zero-config static deploy. |

### 8.1 Project structure
```
propose/
├── public/
│   └── photos/            # her photos go here (referenced from data.json)
├── src/
│   ├── data.json          # ⭐ ALL personalization — Rajib edits this
│   ├── App.jsx            # scene manager, hash router, LoveMeter state
│   ├── scenes/            # Landing, HeartCatch, Reasons, Quiz, Scratch,
│   │                      # Question, Celebration, Planner, Send, Finale
│   ├── components/        # FloatingHearts, LoveMeter, Chip, TicketCard, Wheel…
│   ├── lib/               # dataLoader, confetti, motion presets
│   └── styles/
├── data.schema.json       # validates data.json (optional but included)
├── PRD.md
└── vercel.json            # (SPA rewrites) — minimal
```

**Template engine:** any `{{herName}}`-style tokens in data.json strings are replaced at load; missing keys fall back to sensible defaults — **the app never crashes on malformed data** (validated + deep-merged with defaults).

---

## 9. `data.json` Contract (summary)

The full annotated sample ships as **`src/data.json`** in the repo root project. Structure:

```
meta            → title, theme ("midnight"|"blush"), locale
people          → herName, yourName, coupleName
contact         → whatsappNumber, smsNumber, email
landing         → greeting, subtitle, cta, unlockGame (bool)
reasons         → title, items[] { text, photo, emoji }
games           → enabled + per-game config:
  heartCatch    → durationSeconds, targetHearts, unlockText
  quiz          → title, questions[] { q, options[], reaction }
  scratchCard   → foilColor, hiddenText
  surpriseWheel → segments[]
question        → line, yesLabel, noLabel, noLoopCaptions[], maxDodgeAttempts
celebration     → headline, note, badge { title, subtitle }
planner         → heading, dayOptions[], vibeOptions[], surpriseMeLabel
send            → messageTemplate, sendLabel, fallback labels
finale          → letter paragraphs, signature, easterEgg { taps, message }
effects         → floatingHearts, cursorTrail, cardTilt, music { enabled, url }
scheduling      → optional gate { enabled, date, teaser }
```

- `{{herName}}` / `{{yourName}}` tokens are interpolated everywhere.
- Every field has a default → partial or empty data.json still renders a full experience.

---

## 10. Milestones

| Phase | Deliverable | Est. effort |
|-------|-------------|-------------|
| **M1 — Skeleton** | Vite+React+Tailwind setup, tokens, data.json + loader, scene manager, all scenes static | ~½ day |
| **M2 — Motion & Games** | Scene transitions, text reveals, G1 heart-catch, G2 quiz, G3 scratch, G7 runaway No, confetti, Love Meter | ~1 day |
| **M3 — Handoff & Polish** | WhatsApp/SMS/copy, Surprise Wheel, badge, easter egg, a11y + reduced-motion pass, desktop/mobile responsive audit, perf pass | ~½ day |
| **M4 — Personalize & ship** | Fill data.json, deploy to Vercel, test on real devices | ~¼ day |

**Acceptance checklist:**
- [ ] Desktop (1920/1440/1024) and mobile (390/320) verified — no overflow, no clipping
- [ ] Every game skippable; keyboard can complete the whole flow; reduced-motion mode clean
- [ ] No-button loop always ends; Yes always clickable; nothing traps pointer or focus
- [ ] WhatsApp deep link opens with interpolated names
- [ ] Empty/partial data.json still renders a full working site
- [ ] Lighthouse ≥ 90 mobile, ≥ 95 desktop

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Games annoy instead of delight | All skippable in 1 tap; short (≤20s); every outcome advances |
| She taps No seriously | Loop ends with gentle "No worries 😊" + graceful exit — never mocks |
| wa.me unavailable | SMS + copy-to-clipboard fallbacks on the same screen |
| Canvas perf on low-end devices | DPR-aware, throttled particles, pause on tab-hidden, try/catch → static fallback |
| Reduced-motion users | Fades replace particles/dodge/scratch (Reveal button) |
| Malformed data.json | Deep-merge with defaults + validation; app never white-screens |

---

## 12. Open Questions (answer anytime — placeholders ship by default)

1. Her name + WhatsApp number (currently placeholders in `src/data.json`).
2. Photos: real photos in Reasons cards, or typographic-only?
3. Quiz questions you'd like (3 personal ones make G2 shine).
4. Real day/vibe options for the planner.

---

*Awaiting approval to start M1.*
