import confetti from 'canvas-confetti'

const heartShape = confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
})

const roseColors = ['#FF5E8A', '#FFC2D4', '#F3C77B', '#E0406E', '#FFF5F7']

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/** Small burst at a viewport position (x, y in 0..1). */
export function microBurst(x = 0.5, y = 0.5, count = 14) {
  if (prefersReducedMotion()) return
  try {
    confetti({
      particleCount: count,
      spread: 70,
      startVelocity: 22,
      origin: { x, y },
      shapes: [heartShape],
      colors: roseColors,
      scalar: 0.7,
      ticks: 120,
      disableForReducedMotion: true,
    })
  } catch { /* never break the flow on confetti errors */ }
}

/** The big celebration barrage. */
export function bigCelebration() {
  if (prefersReducedMotion()) return
  try {
    const end = Date.now() + 1800
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        shapes: [heartShape],
        colors: roseColors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        shapes: [heartShape],
        colors: roseColors,
        disableForReducedMotion: true,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { x: 0.5, y: 0.6 },
      shapes: [heartShape],
      colors: roseColors,
      scalar: 1.1,
      disableForReducedMotion: true,
    })
  } catch { /* noop */ }
}

export { heartShape, roseColors }
