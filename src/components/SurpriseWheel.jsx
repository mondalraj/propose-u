import { useState } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import { microBurst } from '../lib/confetti.js'
import { PrimaryButton, spring } from '../components/ui.jsx'

const COLORS = ['#ff5e8a', '#e0406e', '#f3c77b', '#ff5e8a', '#e0406e', '#f3c77b']

/** G4 — Surprise Wheel: spin it, it lands on a date vibe. */
export default function SurpriseWheel({ segments, onResult }) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const controls = useAnimationControls()

  const spin = () => {
    if (spinning || !segments?.length) return
    setSpinning(true)
    const idx = Math.floor(Math.random() * segments.length)
    const segAngle = 360 / segments.length
    const target = 360 * 5 + (360 - idx * segAngle - segAngle / 2)
    // Visual spin — but never await the animation promise: background tabs
    // throttle rAF and would leave the flow stuck on "Spinning…" forever.
    controls.start({
      rotate: target,
      transition: { duration: 3.2, ease: [0.15, 0.9, 0.25, 1] },
    })
    // Guaranteed resolution, whatever the animation engine is doing.
    setTimeout(() => {
      setSpinning(false)
      setResult(segments[idx])
      microBurst(0.5, 0.55, 24)
      onResult(segments[idx])
    }, 3400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={spring}
      className="mt-10 flex flex-col items-center"
      role="group"
      aria-label="Surprise wheel"
    >
      <div className="relative" style={{ width: 300, height: 300 }}>
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 text-2xl drop-shadow">▼</div>
        <motion.svg
          animate={controls}
          viewBox="0 0 200 200"
          className="h-full w-full drop-shadow-[0_0_30px_rgba(255,94,138,0.25)]"
          style={{ originY: '50%' }}
        >
          {segments.map((seg, i) => {
            const segAngle = 360 / segments.length
            const a0 = (i * segAngle - 90) * (Math.PI / 180)
            const a1 = ((i + 1) * segAngle - 90) * (Math.PI / 180)
            const x0 = 100 + 92 * Math.cos(a0)
            const y0 = 100 + 92 * Math.sin(a0)
            const x1 = 100 + 92 * Math.cos(a1)
            const y1 = 100 + 92 * Math.sin(a1)
            const mid = ((i + 0.5) * segAngle - 90) * (Math.PI / 180)
            const tx = 100 + 56 * Math.cos(mid)
            const ty = 100 + 56 * Math.sin(mid)
            return (
              <g key={i}>
                <path
                  d={`M100 100 L ${x0} ${y0} A 92 92 0 0 1 ${x1} ${y1} Z`}
                  fill={COLORS[i % COLORS.length]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7.5"
                  fill="#fff5f7"
                  fontWeight="600"
                >
                  {seg}
                </text>
              </g>
            )
          })}
          <circle cx="100" cy="100" r="14" fill="#16091e" stroke="#f3c77b" strokeWidth="2" />
          <text x="100" y="101" textAnchor="middle" dominantBaseline="middle" fontSize="12">
            💖
          </text>
        </motion.svg>
      </div>
      <div className="mt-6">
        {!result ? (
          <PrimaryButton onClick={spin} disabled={spinning}>
            {spinning ? 'Spinning… 🎡' : 'Spin the wheel 🎡'}
          </PrimaryButton>
        ) : (
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring}
            aria-live="polite"
            className="font-display text-2xl italic text-gold md:text-3xl"
          >
            The wheel says: {result}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
