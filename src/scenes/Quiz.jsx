import { useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { useLoveMeter } from '../components/LoveMeter.jsx'
import { PrimaryButton, RevealWords, spring } from '../components/ui.jsx'
import { microBurst } from '../lib/confetti.js'

/** How long each reaction stays on screen (ms) — shown as a draining bar. */
const REACTION_MS = 4500

/** G2 — "How well do we match?" Every answer is a winning answer. */
export default function Quiz({ onNext, onQuizAnswer }) {
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
  // Options may be plain strings (reaction falls back to q.reaction) or
  // { text, reaction } objects for a personalized reply per answer.
  const opts = (q.options || []).map((o) =>
    typeof o === 'string' ? { text: o, reaction: q.reaction } : o,
  )

  const pick = (option, e) => {
    if (locked) return
    setLocked(true)
    setReaction(option.reaction || q.reaction || 'Correct! 💘')
    onQuizAnswer?.({ q: t(q.q), a: t(option.text) })
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
    }, REACTION_MS)
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
          <motion.div
            key="reaction"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            className="w-full text-center"
          >
            <p aria-live="polite" className="font-display text-2xl italic text-gold md:text-3xl">
              {t(reaction)}
            </p>
            {/* Draining bar — tells her exactly how long until the next question. */}
            <div
              className="mx-auto mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-white/10 md:w-56"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Next question loading"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose to-gold"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: REACTION_MS / 1000, ease: 'linear' }}
              />
            </div>
          </motion.div>
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
                {opts.map((opt, oi) => (
                  <motion.button
                    key={oi}
                    type="button"
                    onClick={(e) => pick(opt, e)}
                    disabled={locked}
                    whileHover={{ scale: 1.03, x: 4 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full max-w-sm cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-left text-lg text-mauve transition-colors hover:border-rose/50 hover:bg-rose/10 hover:text-cream"
                  >
                    {t(opt.text)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
      </div>
    </div>
  )
}
