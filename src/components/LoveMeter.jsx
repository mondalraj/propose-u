import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { data } from '../lib/data.js'

const LoveMeterCtx = createContext({ value: 0, add: () => {} })

export function useLoveMeter() {
  return useContext(LoveMeterCtx)
}

export function LoveMeterProvider({ children }) {
  const [value, setValue] = useState(0)
  const add = useCallback((points) => {
    setValue((v) => Math.min(100, v + points))
  }, [])
  const ctx = useMemo(() => ({ value, add }), [value, add])
  return <LoveMeterCtx.Provider value={ctx}>{children}</LoveMeterCtx.Provider>
}

const MILESTONE_EMOJI = ['💗', '💖', '💘']

/** Fixed top-right love-o-meter with a fill bar. */
export default function LoveMeter() {
  const { value } = useLoveMeter()
  const cfg = data.games.loveMeter
  if (!cfg?.enabled) return null

  const emoji = MILESTONE_EMOJI[Math.min(Math.floor(value / 40), MILESTONE_EMOJI.length - 1)]

  return (
    <div
      className="fixed top-4 right-4 z-40 flex items-center gap-2.5 rounded-full border border-white/10 bg-night-card/70 px-4 py-2 shadow-lg backdrop-blur-md"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={cfg.label || 'Love meter'}
    >
      <motion.span
        key={emoji}
        aria-hidden="true"
        initial={{ scale: 0.4, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
        className="text-lg leading-none"
      >
        {emoji}
      </motion.span>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10 md:w-28">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose to-gold"
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <span className="sr-only">{`${Math.round(value)}% full`}</span>
    </div>
  )
}
