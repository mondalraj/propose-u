import { useEffect } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { PrimaryButton, spring } from '../components/ui.jsx'
import { bigCelebration } from '../lib/confetti.js'

/** S5 — Celebration: confetti barrage + badge ticket stamp. */
export default function Celebration({ onNext }) {
  const cfg = data.celebration
  const badge = data.games.badge

  useEffect(() => {
    const id = setTimeout(bigCelebration, 350)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <motion.h1
        initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className="font-display text-5xl italic text-cream md:text-7xl"
      >
        {t(cfg.headline)}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.6 }}
        className="mt-5 max-w-lg text-lg text-mauve md:text-2xl"
      >
        {t(cfg.note)}
      </motion.p>

      {/* Badge ticket */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 6, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
        transition={{ ...spring, delay: 1.0, damping: 14 }}
        className="relative mt-12 overflow-hidden rounded-2xl border-2 border-dashed border-gold/60 bg-night-card/80 px-10 py-6 shadow-[0_0_50px_rgba(243,199,123,0.2)] backdrop-blur-md"
      >
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-night" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-night" />
        <p className="text-xs uppercase tracking-[0.3em] text-gold/80">🎟 {t(badge.subtitle)}</p>
        <p className="mt-2 font-display text-3xl italic text-shimmer md:text-4xl">
          {t(badge.title)}
        </p>
        <p className="mt-2 text-sm text-mauve">{data.people.coupleName} · VIP access</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-12"
      >
        <PrimaryButton onClick={onNext}>Now, the important part →</PrimaryButton>
      </motion.div>
    </div>
  )
}
