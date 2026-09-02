import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { data } from '../lib/data.js'
import { useLoveMeter } from '../components/LoveMeter.jsx'
import { SkipButton } from '../components/ui.jsx'
import { prefersReducedMotion } from '../lib/confetti.js'
import { useHeartsGame } from './useHeartsGame.js'

/**
 * G1 — Heart-Catch unlock game. Tap/click drifting hearts to pop them.
 * Anti-stuck: timer auto-completes, skip always visible, reduced-motion auto-passes.
 */
export default function HeartCatch({ onNext }) {
  const cfg = data.games.heartCatch
  const { add } = useLoveMeter()
  const canvasRef = useRef(null)
  const [popped, setPopped] = useState(0)
  const [done, setDone] = useState(false)
  const poppedRef = useRef(0)
  const doneRef = useRef(false)

  const target = Math.max(3, cfg.targetHearts || 8)
  const duration = Math.max(5, cfg.durationSeconds || 15)
  const [timeLeft, setTimeLeft] = useState(duration)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setDone(true)
    add(10)
    setTimeout(onNext, 1400)
  }

  // Reduced motion → auto-pass with a kind line.
  useEffect(() => {
    if (prefersReducedMotion()) {
      const id = setTimeout(finish, 900)
      return () => clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown — time's up still unlocks (anti-stuck).
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      if (doneRef.current) {
        clearInterval(id)
        return
      }
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          finish()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useHeartsGame({ canvasRef, poppedRef, doneRef, setPopped, add, target, finish })

  const progress = Math.min(100, (popped / target) * 100)

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl italic text-cream md:text-5xl">{cfg.title}</h1>

      <div className="mt-8 flex w-full max-w-md items-center gap-4">
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose to-gold"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
          />
        </div>
        <span className="w-16 text-sm text-mauve tabular-nums md:text-base" aria-live="polite">
          {popped}/{target} 💗
        </span>
        <span className="w-12 text-sm text-mauve/80 tabular-nums md:text-base">{timeLeft}s</span>
      </div>

      <div className="relative mt-8 w-full max-w-3xl">
        <canvas
          ref={canvasRef}
          className="h-[52vh] w-full touch-none rounded-3xl border border-white/10 bg-white/[0.03]"
          aria-label={`Heart catching game. Pop ${target} hearts.`}
        />
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-night/70 backdrop-blur-sm"
          >
            <p className="font-display text-2xl italic text-gold md:text-4xl">{cfg.unlockText}</p>
          </motion.div>
        )}
      </div>

      <SkipButton onClick={finish} label={cfg.skipText || 'Skip ✨'} />
    </div>
  )
}
