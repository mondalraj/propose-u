import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/confetti.js'
import { data } from '../lib/data.js'

/** Desktop-only cursor heart trail. Throttled, pointer-events-none, auto-cleaning. */
export default function CursorTrail({ enabled }) {
  const layerRef = useRef(null)
  const active = enabled && data.effects.cursorTrail

  useEffect(() => {
    if (!active || prefersReducedMotion()) return
    if (window.matchMedia?.('(pointer: coarse)').matches) return // touch devices: skip
    const layer = layerRef.current
    if (!layer) return

    let last = 0
    const spawned = new Set()

    const onMove = (e) => {
      const now = performance.now()
      if (now - last < 90) return
      last = now
      const el = document.createElement('span')
      el.textContent = '💗'
      el.style.cssText = `position:fixed;left:${e.clientX - 8}px;top:${e.clientY - 8}px;font-size:14px;pointer-events:none;z-index:35;opacity:0.85;transition:transform 1s ease-out, opacity 1s ease-out;will-change:transform,opacity;`
      layer.appendChild(el)
      spawned.add(el)
      requestAnimationFrame(() => {
        el.style.transform = `translate(${(Math.random() - 0.5) * 30}px, 46px) scale(0.4) rotate(${(Math.random() - 0.5) * 60}deg)`
        el.style.opacity = '0'
      })
      setTimeout(() => {
        el.remove()
        spawned.delete(el)
      }, 1100)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      spawned.forEach((el) => el.remove())
    }
  }, [active])

  if (!active) return null
  return <div ref={layerRef} aria-hidden="true" className="pointer-events-none" />
}
