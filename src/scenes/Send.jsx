import { useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { PrimaryButton, Card, spring } from '../components/ui.jsx'

/** S7 — She books the date; the recap is delivered to you automatically via /api/notify. */
export default function Send({ choice, quizAnswers, onNext }) {
  const cfg = data.send
  const [status, setStatus] = useState('idle') // idle | sending | done

  const day = choice?.day || 'a surprise'
  const vibe = choice?.vibe || 'a surprise'

  // Full journey recap that gets delivered to you.
  const question = t(data.question.line)
  const quizText =
    quizAnswers?.length
      ? quizAnswers.map((a) => `• ${a.q} → ${a.a}`).join('\n')
      : '(skipped it — went straight to the yes 😌)'
  const message = t(cfg.messageTemplate, { question, quiz: quizText, day, vibe })

  const book = async () => {
    if (status !== 'idle') return
    setStatus('sending')
    // Fire-and-forget: whatever happens with the network, her flow never breaks.
    const booking = {
      herName: data.people.herName,
      yourName: data.people.yourName,
      question,
      answers: quizAnswers || [],
      day,
      vibe,
      message,
      bookedAt: new Date().toISOString(),
    }
    try {
      const r = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      // Visible in the browser console — handy while testing the pipeline.
      const result = await r.json().catch(() => null)
      console.log('[booking] /api/notify →', result)
    } catch (e) {
      console.warn('[booking] notify request failed:', String(e))
      // ignore — delivery issues must never surface to her
    }
    setStatus('done')
    setTimeout(onNext, 1800)
  }

  const label =
    status === 'sending'
      ? t(cfg.sendingLabel || 'Booking it… 💞')
      : status === 'done'
        ? t(cfg.bookedLabel || "It's official! 💖")
        : t(cfg.sendLabel)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-display text-3xl italic text-cream md:text-5xl">{t(cfg.heading)}</h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className="mt-10 w-full max-w-lg"
      >
        <Card className="text-left">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-rose/15 px-4 py-1.5 text-sm text-blush md:text-base">
              📅 {day}
            </span>
            <span className="rounded-full bg-gold/15 px-4 py-1.5 text-sm text-gold md:text-base">
              💫 {vibe}
            </span>
          </div>
          <p className="mt-6 whitespace-pre-line rounded-2xl border border-white/10 bg-white/5 p-5 text-left font-display text-lg italic leading-relaxed text-cream md:text-xl">
            {message}
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <PrimaryButton onClick={book} disabled={status === 'sending'}>
          {label}
        </PrimaryButton>
      </motion.div>

      {status === 'done' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-sm text-mauve"
        >
          He just found out. 🤭
        </motion.p>
      )}
    </div>
  )
}
