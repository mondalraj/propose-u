# Say Yes 💖 — A Date Proposal Website

A playful, gamified, one-page experience for asking someone out. They catch hearts, win a quiz where every answer is right, scratch to reveal the question, watch the "No" button give up, pick a date, and confirm via WhatsApp — all in under two minutes.

## Stack

- **React 18 + Vite 6** — fast static SPA, deploys anywhere
- **Tailwind CSS 4** — "midnight love letter" dark theme
- **Motion (Framer Motion)** — spring physics animations
- **canvas-confetti** — heart-shaped celebration bursts
- **GSAP** — choreographed word reveals

## Run locally

```bash
pnpm install
pnpm run dev      # http://localhost:5173
pnpm run build    # production build → dist/
```

## Personalize

All content lives in **`src/data.json`** — her name, your WhatsApp number, reason cards, quiz questions, date options, the finale letter. Edit that one file, redeploy, send the link. 💘

## Deploy

Zero-config on **Vercel** (or Netlify): build command `pnpm run build`, output directory `dist`.
