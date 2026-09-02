// Vercel serverless function — receives her booking and delivers it to you.
// Configure env vars in Vercel (Project → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN        — from @BotFather (/newbot)
//   TELEGRAM_CHAT_ID          — your chat id (see README)
//   GOOGLE_SHEET_WEBHOOK_URL  — optional Apps Script webhook that logs a row
// Secrets stay server-side; the client never sees them.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method-not-allowed' })
    return
  }

  let message = ''
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    message = String(body?.message || '')
  } catch {
    message = ''
  }
  if (!message || message.length > 4000) {
    res.status(400).json({ ok: false, reason: 'bad-message' })
    return
  }

  const delivered = []

  try {
    // 1) Telegram — instant push to your phone.
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (token && chatId) {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      })
      delivered.push(`telegram:${r.status}`)
    }

    // 2) Optional Google Sheet log (Apps Script webhook).
    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
    if (sheetUrl) {
      const r = await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, at: new Date().toISOString() }),
      })
      delivered.push(`sheet:${r.status}`)
    }
  } catch {
    // Network hiccups must never break her flow — swallow and report softly.
  }

  if (!delivered.length) {
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }
  res.status(200).json({ ok: true, delivered })
}
