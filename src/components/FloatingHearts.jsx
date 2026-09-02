import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/confetti.js'

/** Ambient floating hearts on a full-screen canvas. Pauses when tab hidden. */
export default function FloatingHearts({ enabled = true, density = 16 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true
    let W = 0
    let H = 0

    const hearts = Array.from({ length: density }, () => spawn(true))

    function spawn(anywhere = false) {
      return {
        x: Math.random(),
        y: anywhere ? Math.random() : 1.05 + Math.random() * 0.1,
        r: 6 + Math.random() * 14,
        vy: 0.0004 + Math.random() * 0.0009,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.002 + Math.random() * 0.004,
        alpha: 0.05 + Math.random() * 0.12,
        hue: Math.random() > 0.75 ? '#f3c77b' : '#ff5e8a',
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawHeart(x, y, size, color, alpha) {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(size / 32, size / 32)
      ctx.beginPath()
      ctx.moveTo(0, 10)
      ctx.bezierCurveTo(-16, -6, -8, -18, 0, -8)
      ctx.bezierCurveTo(8, -18, 16, -6, 0, 10)
      ctx.closePath()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    }

    let last = performance.now()
    function frame(now) {
      if (!running) return
      const dt = Math.min(now - last, 50)
      last = now
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i]
        h.y -= h.vy * dt
        h.sway += h.swaySpeed * dt
        const x = h.x * W + Math.sin(h.sway) * 24
        if (h.y * H < -30) hearts[i] = spawn()
        drawHeart(x, h.y * H, h.r, h.hue, h.alpha)
      }
      raf = requestAnimationFrame(frame)
    }

    function onVisibility() {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled, density])

  if (!enabled) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
