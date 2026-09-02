import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { PrimaryButton, Card, spring } from '../components/ui.jsx'

/** S7 — Confirm & send via WhatsApp deep link (the one and only action). */
export default function Send({ choice, onNext }) {
  const cfg = data.send
  const contact = data.contact

  const day = choice?.day || 'our date'
  const vibe = choice?.vibe || 'a surprise'
  const message = t(cfg.messageTemplate, { day, vibe })

  const waNumber = (contact.whatsappNumber || '').replace(/[^\d]/g, '')
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`

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
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 font-display text-xl italic leading-relaxed text-cream md:text-2xl">
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
        <PrimaryButton onClick={() => { window.open(waUrl, '_blank', 'noopener'); onNext() }}>
          {t(cfg.sendLabel)}
        </PrimaryButton>
      </motion.div>
    </div>
  )
}
