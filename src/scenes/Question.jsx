import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { RevealWords, spring } from '../components/ui.jsx'
import { microBurst } from '../lib/confetti.js'

/**
 * S4 — The Big Question + G7 runaway "No".
 * Desktop-first: the No button flees across the whole viewport with spring
 * physics while Yes grows. Always clickable, never traps the user.
 */
export default function Question({ onNext }) {
  const cfg = data.question
  const captions = cfg.noLoopCaptions?.length ? cfg.noLoopCaptions : ['Are you sure?']
  const maxAttempts = Math.max(2, cfg.maxDodgeAttempts || 5)
  const fieldRef = useRef(null)

  const [attempt, setAttempt] = useState(0) // 0 = resting
  const [gone, setGone] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const dodge = (e) => {
    if (gone) return
    const next = attempt + 1
    if (next >= maxAttempts) {
      setGone(true)
      return
    }
    const field = fieldRef.current
    const w = field?.clientWidth || window.innerWidth
    const h = field?.clientHeight || window.innerHeight
    // random position, biased away from the center (where Yes lives)
    let x = 0
    let y = 0
    for (let tries = 0; tries < 12; tries++) {
      x = (Math.random() - 0.5) * (w * 0.72)
      y = (Math.random() - 0.5) * (h * 0.55)
      if (Math.hypot(x, y) > Math.min(w, h) * 0.18) break
    }
    setPos({ x, y })
    setAttempt(next)
  }

  const yes = () => {
    microBurst(0.5, 0.5, 30)
    onNext()
  }

  const yesScale = 1 + Math.min(attempt, maxAttempts) * 0.14
  const noScale = Math.max(0.45, 1 - attempt * 0.16)
  const caption = gone
    ? captions[captions.length - 1]
    : attempt > 0
      ? captions[Math.min(attempt - 1, captions.length - 2)]
      : null

  return (
    <div
      ref={fieldRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16"
    >
      <h1 className="max-w-3xl text-center font-display text-4xl leading-tight text-cream md:text-6xl">
        <RevealWords text={t(cfg.line)} />
      </h1>

      {/* Buttons stage */}
      <div className="relative mt-16 flex items-center justify-center gap-8 md:gap-12">
        <motion.button
          type="button"
          onClick={yes}
          aria-label={t(cfg.yesLabel)}
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.06 }}
          whileTap={{ scale: yesScale * 0.95 }}
          transition={spring}
          className="animate-pulse-glow z-10 cursor-pointer rounded-full bg-gradient-to-r from-rose to-rose-deep px-10 py-5 text-xl font-bold text-cream md:px-14 md:py-6 md:text-2xl"
        >
          {t(cfg.yesLabel)}
        </motion.button>

        <AnimatePresence>
          {!gone && (
            <motion.button
              type="button"
              onClick={dodge}
              onPointerEnter={(e) => {
                // desktop: dodge on hover too, but only via pointer (never traps keyboard)
                if (e.pointerType === 'mouse') dodge(e)
              }}
              aria-label={t(cfg.noLabel)}
              animate={{ x: pos.x, y: pos.y, scale: noScale }}
              exit={{ opacity: 0, scale: 0.2, rotate: 30 }}
              transition={spring}
              className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-7 py-4 text-lg font-medium text-mauve md:px-9 md:py-4 md:text-xl"
            >
              {t(cfg.noLabel)}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* caption */}
      <div className="mt-14 min-h-10" aria-live="polite">
        {caption && (
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-xl italic text-gold md:text-2xl"
          >
            {t(caption)}
          </motion.p>
        )}
      </div>

      {gone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 max-w-md text-center text-sm text-mauve/80 md:text-base"
        >
          {t(cfg.giveUpLine)}
        </motion.p>
      )}
    </div>
  )
}
