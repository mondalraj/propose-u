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

All content lives in **`src/data.json`** — her name, reason cards, quiz questions and reactions, date options, the finale letter. Edit that one file, redeploy, send the link. 💘

## Get her booking delivered to you (automatic!)

When she taps **"Book our date 💖"**, the full recap (the question, her quiz answers, the day and vibe she chose) is POSTed to `/api/notify` — a Vercel serverless function that forwards it to you. Her flow never breaks, even if delivery fails.

**Recommended: Telegram (2 minutes)**
1. In Telegram, message **@BotFather** → `/newbot` → follow steps → copy the **bot token**
2. Message your new bot once (press Start), then open `https://api.telegram.org/bot<TOKEN>/getUpdates` in your browser and copy the `chat.id` from the response
3. In Vercel: *Project → Settings → Environment Variables* → add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
4. Redeploy — every booking now lands in your Telegram instantly 📲

**Optional: Google Sheet log**
1. Create a Sheet → *Extensions → Apps Script* → paste a doPost script that appends `JSON.parse(e.postData.contents)` fields to the sheet → Deploy as **Web app** (access: "Anyone")
2. Add the web-app URL as the `GOOGLE_SHEET_WEBHOOK_URL` env var in Vercel

## Deploy

Zero-config on **Vercel** (or Netlify): build command `pnpm run build`, output directory `dist`. The `api/` folder deploys as serverless functions automatically on Vercel.
