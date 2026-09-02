import { useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { useLoveMeter } from '../components/LoveMeter.jsx'
import { PrimaryButton, RevealWords, SkipButton, spring } from '../components/ui.jsx'
import { microBurst } from '../lib/confetti.js'

/** G2 — "How well do we match?" Every answer is a winning answer. */
export default function Quiz({ onNext }) {
  const cfg = data.games.quiz
  const questions = cfg.questions?.length ? cfg.questions : []
  const { add } = useLoveMeter()
  const [qi, setQi] = useState(0)
  const [reaction, setReaction] = useState(null)
  const [locked, setLocked] = useState(false)

  if (!questions.length) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <PrimaryButton onClick={onNext}>Continue →</PrimaryButton>
      </div>
    )
  }

  const q = questions[qi]

  const pick = (optIdx, e) => {
    if (locked) return
    setLocked(true)
    setReaction(q.reaction || 'Correct! 💘')
    add(10)
    const r = e.currentTarget.getBoundingClientRect()
    microBurst(
      (r.left + r.width / 2) / window.innerWidth,
      (r.top + r.height / 2) / window.innerHeight,
    )
    setTimeout(() => {
      setLocked(false)
      setReaction(null)
      if (qi < questions.length - 1) setQi(qi + 1)
      else onNext()
    }, 1400)
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-display text-3xl italic text-cream md:text-5xl">
        <RevealWords text={t(cfg.title)} />
      </p>
      {cfg.subtitle && <p className="mt-3 text-mauve md:text-lg">{t(cfg.subtitle)}</p>}

      <div className="mt-6 flex gap-2" aria-hidden="true">
        {questions.map((_, d) => (
          <span
            key={d}
            className={`h-2 rounded-full transition-all duration-300 ${
              d === qi ? 'w-8 bg-rose' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="mt-10 flex min-h-[220px] w-full max-w-xl items-center justify-center">
        {/* Enter-only keyed swap (no AnimatePresence — its exit phase can jam). */}
        {reaction ? (
          <motion.p
            key="reaction"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            aria-live="polite"
            className="font-display text-2xl italic text-gold md:text-3xl"
          >
            {t(reaction)}
          </motion.p>
        ) : (
          <motion.div
            key={qi}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="w-full"
          >
              <h2 className="text-xl font-medium text-cream md:text-2xl">{t(q.q)}</h2>
              <div className="mt-8 flex flex-col items-center gap-4">
                {q.options?.map((opt, oi) => (
                  <motion.button
                    key={oi}
                    type="button"
                    onClick={(e) => pick(oi, e)}
                    disabled={locked}
                    whileHover={{ scale: 1.03, x: 4 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full max-w-sm cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-left text-lg text-mauve transition-colors hover:border-rose/50 hover:bg-rose/10 hover:text-cream"
                  >
                    {t(opt)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
      </div>

      <SkipButton onClick={onNext} />
    </div>
  )
}
