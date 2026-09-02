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

When she taps **"Book our date 💖"**, the full recap — the question she said yes to, every quiz answer, the day and vibe she chose, and a timestamp — is POSTed to `/api/notify` (a Vercel serverless function) which writes it as a **new row in your Google Sheet**. Her flow never breaks, even if delivery fails. No WhatsApp, no manual step.

**Setup — about 5 minutes, you only do this once:**

**Step 1 — Create the Google Sheet**
1. Go to [sheets.new](https://sheets.new) and name it something like `Date Bookings 💘`
2. (Optional) Rename "Sheet1" to `Bookings`

**Step 2 — Add the Apps Script**
1. In the sheet: **Extensions → Apps Script**
2. Delete whatever is in `Code.gs` and paste this:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents)
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName('Bookings') || ss.insertSheet('Bookings')

  // Header row (only when the sheet is empty)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Booked at', 'Her name', 'The question', 'Quiz answers', 'Day', 'Vibe'])
    sheet.getRange('A1:F1').setFontWeight('bold')
  }

  var quiz = (data.answers || [])
    .map(function (a) { return '• ' + a.q + ' → ' + a.a })
    .join('\n') || '(skipped)'

  sheet.appendRow([data.bookedAt, data.herName, data.question, quiz, data.day, data.vibe])

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}
```

3. Save (💾 icon), then click **Deploy → New deployment**
4. Click the ⚙️ next to "Select type" → choose **Web app**
5. Set: *Execute as* → **Me**, *Who has access* → **Anyone**
6. Click **Deploy** → grant the permissions (it's your own script, accessing your own sheet)
7. Copy the **Web app URL** — it looks like `https://script.google.com/macros/s/AKfycb.../exec`

**Step 3 — Tell Vercel about it**
1. Go to [vercel.com](https://vercel.com) → your `propose-u` project → **Settings → Environment Variables**
2. Add: Name = `GOOGLE_SHEET_WEBHOOK_URL`, Value = the `/exec` URL you copied (Production + Preview)
3. **Redeploy** the project (Deployments tab → ⋯ → Redeploy) — env vars only apply to new builds

**Step 4 — Test it**
Open your deployed site, click through to the booking, tap **"Book our date 💖"** — a new row appears in your sheet within a second or two. 💘

> Note: keep the Web App URL private — anyone who has it can append rows to your sheet. It lives only in Vercel's server-side env vars, never in the website code.

## Deploy

Zero-config on **Vercel** (or Netlify): build command `pnpm run build`, output directory `dist`. The `api/` folder deploys as serverless functions automatically on Vercel.
