import { useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { PrimaryButton, spring } from '../components/ui.jsx'

export default function Landing({ onNext }) {
  const [opening, setOpening] = useState(false)
  const cfg = data.landing
  const hasGame = data.games.enabled && cfg.unlockGame && data.games.heartCatch?.enabled

  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onNext, hasGame ? 500 : 900)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className="font-display text-2xl italic text-blush md:text-4xl"
      >
        {t(cfg.greeting)}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.5 }}
        className="mt-4 max-w-md text-base text-mauve md:text-xl"
      >
        {t(cfg.subtitle)}
      </motion.p>

      {/* Envelope */}
      <motion.button
        type="button"
        onClick={open}
        aria-label="Open the letter"
        initial={{ opacity: 0, scale: 0.7, y: 30 }}
        animate={
          opening
            ? { scale: [1, 1.12, 1.06], rotate: [0, -4, 0] }
            : { opacity: 1, scale: 1, y: 0 }
        }
        whileHover={{ scale: 1.06 }}
        transition={{ ...spring, delay: opening ? 0 : 0.8 }}
        className="group relative mt-12 cursor-pointer"
      >
        <motion.div
          animate={opening ? { scale: 1.15 } : {}}
          className={`relative flex h-44 w-64 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-night-soft to-night-card shadow-[0_20px_60px_rgba(255,94,138,0.25)] md:h-52 md:w-80 ${
            opening ? 'animate-wobble' : 'animate-pulse-glow'
          }`}
        >
          {/* envelope flap */}
          <div className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl border-b border-rose/20 bg-gradient-to-b from-rose/25 to-transparent transition-transform duration-700 group-hover:[transform:rotateX(35deg)]" />
          <motion.span
            className="relative z-10 text-6xl md:text-7xl"
            animate={opening ? { scale: [1, 1.6, 0], opacity: [1, 1, 0] } : {}}
            transition={{ duration: 0.7 }}
          >
            💋
          </motion.span>
          <span className="absolute bottom-4 text-sm tracking-wide text-mauve/80 md:text-base">
            {hasGame ? '🔒 sealed — complete a tiny mission' : 'a letter for you'}
          </span>
        </motion.div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12"
      >
        <PrimaryButton onClick={open}>{t(cfg.cta)}</PrimaryButton>
      </motion.div>
    </div>
  )
}
