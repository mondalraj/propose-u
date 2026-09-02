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
  // Diagnostics: open this URL in a browser to check the configuration.
  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      configured: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
      hint: process.env.GOOGLE_SHEET_WEBHOOK_URL
        ? 'Configured. POST a booking here to log a row.'
        : 'GOOGLE_SHEET_WEBHOOK_URL is missing — add it in Vercel env vars and redeploy.',
    })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method-not-allowed' })
    return
  }

  let booking = null
  try {
    booking = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch (e) {
    console.error('[notify] failed to parse body:', String(e))
    booking = null
  }
  if (!booking || typeof booking !== 'object' || !booking.day || !booking.vibe) {
    console.error('[notify] rejected: invalid booking payload:', JSON.stringify(booking)?.slice(0, 300))
    res.status(400).json({ ok: false, reason: 'bad-booking' })
    return
  }
  console.log('[notify] booking received:', JSON.stringify(booking).slice(0, 500))

  const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!sheetUrl) {
    console.error('[notify] GOOGLE_SHEET_WEBHOOK_URL is NOT set — add it in Vercel env vars and REDEPLOY.')
    res.status(200).json({ ok: false, reason: 'not-configured' })
    return
  }
  console.log('[notify] forwarding to sheet webhook:', sheetUrl.replace(/\/exec.*$/, '/exec'), '…')

  try {
    const r = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...booking, deliveredAt: new Date().toISOString() }),
      redirect: 'follow',
    })
    const responseText = await r.text().catch(() => '')
    console.log('[notify] Apps Script responded with status:', r.status)
    console.log('[notify] Apps Script response body:', responseText.slice(0, 400))

    if (!r.ok) {
      // 401/403 → deployment access is not "Anyone"; 500 → doPost threw.
      console.error(
        '[notify] delivery FAILED. If status is 401/403, re-deploy the Apps Script web app with "Who has access: Anyone". If 500, check the Apps Script execution logs.',
      )
      res.status(200).json({ ok: false, reason: 'sheet-http-' + r.status })
      return
    }
    console.log('[notify] ✅ booking delivered to Google Sheet')
    res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[notify] delivery threw:', String(e))
    // Network hiccups must never break her flow — report softly.
    res.status(200).json({ ok: false, reason: 'delivery-failed' })
  }
}


