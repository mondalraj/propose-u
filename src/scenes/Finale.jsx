import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { microBurst } from '../lib/confetti.js'

/** S8 — Finale: typewriter letter + G8 easter egg. */
export default function Finale() {
  const cfg = data.finale
  const paragraphs = cfg.letter?.length ? cfg.letter : ['Thank you for saying yes.']
  const [typed, setTyped] = useState('')
  const [paraIdx, setParaIdx] = useState(0)
  const [taps, setTaps] = useState(0)
  const [egg, setEgg] = useState(false)
  const timerRef = useRef(null)

  // simple typewriter across paragraphs
  useEffect(() => {
    const full = t(paragraphs[paraIdx] || '')
    let i = 0
    timerRef.current = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(timerRef.current)
        setTimeout(() => {
          if (paraIdx < paragraphs.length - 1) {
            setParaIdx((p) => p + 1)
            setTyped('')
          }
        }, 700)
      }
    }, 28)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paraIdx])

  const tapHeart = (e) => {
    const n = taps + 1
    setTaps(n)
    microBurst(0.5, 0.75, 12)
    if (n >= (cfg.easterEgg?.taps || 3)) {
      setEgg(true)
      microBurst(0.5, 0.75, 40)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="font-display text-4xl italic text-cream md:text-6xl"
      >
        {t(cfg.title)}
      </motion.h1>

      <div className="mt-10 min-h-32 w-full max-w-xl" aria-live="polite">
        <p className="text-lg leading-relaxed text-mauve md:text-xl">
          {t(paragraphs.slice(0, paraIdx).join(' '))}{' '}
          <span className="text-cream">{typed}</span>
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-gold align-middle" aria-hidden="true" />
        </p>
      </div>

      <p className="mt-4 font-display text-2xl italic text-blush md:text-3xl">
        {t(cfg.signature)}
      </p>

      <motion.button
        type="button"
        onClick={tapHeart}
        aria-label="A secret heart"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        className="mt-14 cursor-pointer text-6xl md:text-7xl"
      >
        💖
      </motion.button>

      {egg && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="mt-6 font-display text-xl italic text-gold md:text-2xl"
        >
          {t(cfg.easterEgg?.message)}
        </motion.p>
      )}
    </div>
  )
}
