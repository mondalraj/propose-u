import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { useLoveMeter } from '../components/LoveMeter.jsx'
import SurpriseWheel from '../components/SurpriseWheel.jsx'
import { Chip, PrimaryButton } from '../components/ui.jsx'
import { microBurst } from '../lib/confetti.js'

/** S6 — Date planner: real day chips + vibe chips, with the wheel living in "Surprise me 🎡". */
export default function Planner({ onNext }) {
  const cfg = data.planner
  const wheelCfg = data.games.surpriseWheel
  const { add } = useLoveMeter()
  const [day, setDay] = useState(null)
  const [vibe, setVibe] = useState(null)
  const [wheelOpen, setWheelOpen] = useState(false)
  const [wheelResult, setWheelResult] = useState(null)

  const surpriseVibe = cfg.vibeOptions?.find((v) => v.includes('Surprise') || v.includes('🎡'))
  const ready = Boolean(day) && Boolean(vibe)

  const selectDay = (d) => {
    setDay(d)
    add(6)
  }

  const selectVibe = (v) => {
    if (surpriseVibe && v === surpriseVibe && wheelCfg?.enabled) {
      // "Surprise me" spins the wheel — the outcome becomes her vibe.
      setWheelOpen(true)
      microBurst(0.5, 0.7)
    } else {
      setWheelOpen(false)
      setVibe(v)
    }
    add(6)
  }

  const confirm = () => {
    microBurst(0.5, 0.6, 24)
    add(10)
    onNext({ day, vibe })
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="max-w-2xl font-display text-3xl italic text-cream md:text-5xl">
        {t(cfg.heading)}
      </h1>

      <div className="mt-12 w-full max-w-2xl">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-mauve/70">{t(cfg.dayLabel)}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {cfg.dayOptions?.map((d) => (
            <Chip key={d} selected={day === d} onClick={() => selectDay(d)}>
              {t(d)}
            </Chip>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {wheelOpen && wheelCfg?.segments?.length > 0 && (
          <SurpriseWheel
            segments={wheelCfg.segments}
            onResult={(seg) => {
              setVibe(seg)
              setWheelResult(seg)
              setWheelOpen(false)
              add(8)
            }}
          />
        )}
      </AnimatePresence>

      <div className="mt-12 w-full max-w-2xl">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-mauve/70">{t(cfg.vibeLabel)}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {cfg.vibeOptions?.map((v) => (
            <Chip
              key={v}
              selected={vibe === v || (surpriseVibe && wheelResult && v === surpriseVibe)}
              onClick={() => selectVibe(v)}
            >
              {t(v)}
            </Chip>
          ))}
        </div>
        {wheelResult && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-display text-lg italic text-gold md:text-xl"
            aria-live="polite"
          >
            🎡 The wheel has spoken — {wheelResult}
          </motion.p>
        )}
      </div>

      <div className="mt-14">
        <PrimaryButton onClick={confirm} disabled={!ready}>
          {t(cfg.confirmLabel)}
        </PrimaryButton>
      </div>
    </div>
  )
}
