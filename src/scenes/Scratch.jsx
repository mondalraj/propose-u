import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { data, t } from '../lib/data.js'
import { useLoveMeter } from '../components/LoveMeter.jsx'
import { GhostButton, PrimaryButton } from '../components/ui.jsx'
import { prefersReducedMotion } from '../lib/confetti.js'

/** G3 — Scratch-to-reveal card. Drag to scratch; Reveal button for accessibility. */
export default function Scratch({ onNext }) {
  const cfg = data.games.scratchCard
  const { add } = useLoveMeter()
  const canvasRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const scratchedRef = useRef(false)
  const lastPointRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const paintFoil = () => {
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, '#f3c77b')
      g.addColorStop(0.35, '#ff5e8a')
      g.addColorStop(0.65, '#e0406e')
      g.addColorStop(1, '#f3c77b')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.font = '16px Outfit, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('✨ scratch me ✨', W / 2, H / 2)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintFoil()
    }
    resize()
    window.addEventListener('resize', resize)

    const scratch = (e) => {
      if (scratchedRef.current) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const last = lastPointRef.current || { x, y }
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 44
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      lastPointRef.current = { x, y }

      // sample cleared ratio every few events
      if (Math.random() < 0.12) {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let clear = 0
        const step = 4 * 40
        let total = 0
        for (let i = 3; i < data.length; i += step) {
          total++
          if (data[i] === 0) clear++
        }
        if (clear / total > 0.55) {
          scratchedRef.current = true
          add(12)
          setRevealed(true)
        }
      }
    }

    const onDown = (e) => {
      lastPointRef.current = null
      canvas.setPointerCapture?.(e.pointerId)
      scratch(e)
    }
    const onMove = (e) => {
      if (e.buttons > 0 || e.pointerType === 'touch') scratch(e)
    }
    const onUp = () => (lastPointRef.current = null)

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onUp)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const revealByButton = () => {
    scratchedRef.current = true
    add(12)
    setRevealed(true)
  }

  const question = t(cfg.hiddenText)

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-display text-2xl italic text-mauve md:text-3xl">{cfg.title}</p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-10 w-full max-w-xl overflow-hidden rounded-3xl border border-gold/30 bg-night-card shadow-[0_0_60px_rgba(243,199,123,0.15)]"
      >
        <div className="flex min-h-[240px] items-center justify-center p-8 md:min-h-[280px] md:p-12">
          <p
            className={`font-display text-3xl leading-snug text-shimmer transition-opacity duration-700 md:text-4xl ${
              revealed ? 'opacity-100' : 'opacity-90'
            }`}
          >
            {question}
          </p>
        </div>
        {!revealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
            aria-label="Scratch the foil to reveal the question"
          />
        )}
      </motion.div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {!revealed ? (
          <GhostButton onClick={revealByButton}>Tap to reveal 💫</GhostButton>
        ) : (
          <PrimaryButton onClick={onNext}>My answer is waiting… →</PrimaryButton>
        )}
      </div>
    </div>
  )
}
