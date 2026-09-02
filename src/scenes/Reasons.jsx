import { useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { useLoveMeter } from '../components/LoveMeter.jsx'
import { PrimaryButton, RevealWords, spring } from '../components/ui.jsx'
import { microBurst } from '../lib/confetti.js'

export default function Reasons({ onNext }) {
  const cfg = data.reasons
  const items = cfg.items?.length ? cfg.items : [{ text: 'You make every day better.', emoji: '✨' }]
  const [i, setI] = useState(0)
  const { add } = useLoveMeter()
  const item = items[i]

  const next = (e) => {
    microBurst(0.5, 0.7)
    if (i < items.length - 1) {
      add(6)
      setI(i + 1)
    } else {
      add(8)
      onNext()
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-10 font-display text-xl italic text-mauve md:text-2xl">
        {t(cfg.title)}
      </p>

      <div className="relative flex min-h-[300px] w-full max-w-2xl items-center justify-center md:min-h-[340px]">
        {/* Enter-only keyed animation (no exit phase — nothing to jam). */}
        <motion.figure
          key={i}
          initial={{ opacity: 0, x: 60, rotate: 1.5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={spring}
            whileHover={data.effects.cardTilt ? { rotate: -0.8, scale: 1.01 } : undefined}
            className="w-full rounded-3xl border border-white/10 bg-night-card/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-12"
          >
            {item.photo ? (
              <img
                src={item.photo}
                alt=""
                loading="lazy"
                className="mx-auto mb-6 max-h-52 rounded-2xl object-cover shadow-lg md:max-h-64"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <motion.div
                aria-hidden="true"
                className="mb-5 text-5xl md:text-6xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {item.emoji || '💖'}
              </motion.div>
            )}
            <blockquote className="font-display text-2xl leading-snug text-cream md:text-3xl">
              <RevealWords text={t(item.text)} />
            </blockquote>
        </motion.figure>
      </div>

      {/* dots */}
      <div className="mt-8 flex gap-2" aria-hidden="true">
        {items.map((_, d) => (
          <span
            key={d}
            className={`h-2 rounded-full transition-all duration-300 ${
              d === i ? 'w-8 bg-rose' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="mt-10">
        <PrimaryButton onClick={next}>
          {i < items.length - 1 ? 'Next →' : 'One more thing…'}
        </PrimaryButton>
      </div>
    </div>
  )
}
