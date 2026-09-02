import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/confetti.js'

/** Canvas game loop for the heart-catch scene (kept in a hook for readability). */
export function useHeartsGame({ canvasRef, poppedRef, doneRef, setPopped, add, target, finish }) {
  const finishRef = useRef(finish)
  finishRef.current = finish

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const hearts = []
    const sparks = []

    function spawnHeart() {
      hearts.push({
        x: 30 + Math.random() * Math.max(60, W - 60),
        y: H + 30,
        r: 16 + Math.random() * 12,
        vy: 60 + Math.random() * 70,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 1.5 + Math.random() * 2,
        dead: false,
        scale: 1,
      })
    }

    function resize() {
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function heartPath(x, y, size) {
      ctx.moveTo(x, y + size * 0.3)
      ctx.bezierCurveTo(x - size, y - size * 0.35, x - size * 0.5, y - size, x, y - size * 0.35)
      ctx.bezierCurveTo(x + size * 0.5, y - size, x + size, y - size * 0.35, x, y + size * 0.3)
    }

    let last = performance.now()
    let spawnAcc = 0
    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, W, H)

      spawnAcc += dt
      if (spawnAcc > 0.45 && hearts.filter((h) => !h.dead).length < 7) {
        spawnAcc = 0
        spawnHeart()
      }

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i]
        if (h.dead) {
          h.scale += dt * 6
          if (h.scale > 1.9) hearts.splice(i, 1)
          continue
        }
        h.y -= h.vy * dt
        h.sway += h.swaySpeed * dt
        const x = h.x + Math.sin(h.sway) * 18
        if (h.y < -40) {
          hearts.splice(i, 1)
          continue
        }
        const g = ctx.createRadialGradient(x, h.y, 0, x, h.y, h.r * 2.2)
        g.addColorStop(0, 'rgba(255,94,138,0.25)')
        g.addColorStop(1, 'rgba(255,94,138,0)')
        ctx.fillStyle = g
        ctx.fillRect(x - h.r * 2.2, h.y - h.r * 2.2, h.r * 4.4, h.r * 4.4)
        ctx.fillStyle = '#ff5e8a'
        ctx.beginPath()
        heartPath(x, h.y, h.r * h.scale)
        ctx.fill()
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life -= dt * 2.2
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.vy += 220 * dt
        ctx.globalAlpha = Math.max(0, s.life)
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, 3 * s.life + 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(frame)
    }

    function popAt(px, py) {
      if (doneRef.current) return
      for (const h of hearts) {
        if (h.dead) continue
        const x = h.x + Math.sin(h.sway) * 18
        const dx = px - x
        const dy = py - h.y
        if (dx * dx + dy * dy <= (h.r + 12) ** 2) {
          h.dead = true
          for (let i = 0; i < 10; i++) {
            const a = (Math.PI * 2 * i) / 10
            sparks.push({
              x,
              y: h.y,
              vx: Math.cos(a) * 130,
              vy: Math.sin(a) * 130 - 40,
              life: 1,
              color: i % 3 === 0 ? '#f3c77b' : '#ff5e8a',
            })
          }
          poppedRef.current += 1
          setPopped(poppedRef.current)
          add(3)
          if (poppedRef.current >= target) finishRef.current()
          break
        }
      }
    }

    function onPointer(e) {
      const rect = canvas.getBoundingClientRect()
      popAt(e.clientX - rect.left, e.clientY - rect.top)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointerdown', onPointer)
    raf = requestAnimationFrame(frame)
    for (let i = 0; i < 4; i++) spawnHeart()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
