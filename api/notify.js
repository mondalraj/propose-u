// Vercel serverless function — receives her booking and logs it to your
// Google Sheet via an Apps Script Web App webhook.
//
// Configure in Vercel (Project → Settings → Environment Variables):
//   GOOGLE_SHEET_WEBHOOK_URL — the /exec URL from the Apps Script deployment
//                              (full setup steps in README.md)
//
// Secrets stay server-side; the client never sees the sheet URL. This proxy
// also avoids CORS: Apps Script web apps don't send CORS headers, but this
// server-to-server call doesn't need them.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method-not-allowed' })
    return
  }

  let booking = null
  try {
    booking = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    booking = null
  }
  if (!booking || typeof booking !== 'object' || !booking.day || !booking.vibe) {
    res.status(400).json({ ok: false, reason: 'bad-booking' })
    return
  }

  const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!sheetUrl) {
    // Not configured yet — her flow still continues gracefully on the client.
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }

  try {
    const r = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...booking, deliveredAt: new Date().toISOString() }),
    })
    res.status(200).json({ ok: r.ok })
  } catch {
    // Network hiccups must never break her flow — report softly.
    res.status(200).json({ ok: false, reason: 'delivery-failed' })
  }
}

