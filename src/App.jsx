import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { data } from './lib/data.js'
import FloatingHearts from './components/FloatingHearts.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import LoveMeter, { LoveMeterProvider } from './components/LoveMeter.jsx'
import Landing from './scenes/Landing.jsx'
import HeartCatch from './scenes/HeartCatch.jsx'
import Reasons from './scenes/Reasons.jsx'
import Quiz from './scenes/Quiz.jsx'
import Scratch from './scenes/Scratch.jsx'
import Question from './scenes/Question.jsx'
import Celebration from './scenes/Celebration.jsx'
import Planner from './scenes/Planner.jsx'
import Send from './scenes/Send.jsx'
import Finale from './scenes/Finale.jsx'

const g = data.games

/** Build the scene chain from config flags (disabled games are simply skipped). */
function buildScenes() {
  const s = [{ id: 'landing', C: Landing }]
  if (g.enabled && data.landing.unlockGame && g.heartCatch?.enabled)
    s.push({ id: 'heartcatch', C: HeartCatch })
  s.push({ id: 'reasons', C: Reasons })
  if (g.enabled && g.quiz?.enabled && g.quiz.questions?.length) s.push({ id: 'quiz', C: Quiz })
  if (g.enabled && g.scratchCard?.enabled) s.push({ id: 'scratch', C: Scratch })
  s.push({ id: 'question', C: Question })
  s.push({ id: 'celebration', C: Celebration })
  s.push({ id: 'planner', C: Planner })
  s.push({ id: 'send', C: Send })
  s.push({ id: 'finale', C: Finale })
  return s
}

export default function App() {
  const scenes = useMemo(buildScenes, [])
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState({ day: null, vibe: null })

  const goTo = useCallback(
    (i) => setIndex(Math.max(0, Math.min(scenes.length - 1, i))),
    [scenes.length],
  )

  // Hash deep-links + back-button support (#question, #celebrate, …)
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace('#', '')
      const i = scenes.findIndex((s) => s.id === h)
      if (i >= 0) setIndex(i)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [scenes])

  useEffect(() => {
    const id = scenes[index]?.id
    if (id && window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`)
      document.title = data.meta.title
    }
  }, [index, scenes])

  // Central double-fire guard: rapid/double clicks (or a guard race in a scene)
  // must never advance more than one scene. 800ms debounce, sync via ref.
  const lastNextRef = useRef(0)
  const next = useCallback(
    (payload) => {
      const now = Date.now()
      if (now - lastNextRef.current < 800) return
      lastNextRef.current = now
      if (payload && typeof payload === 'object' && ('day' in payload || 'vibe' in payload)) {
        setChoice((c) => ({ ...c, ...payload }))
      }
      setIndex((i) => Math.min(scenes.length - 1, i + 1))
    },
    [scenes.length],
  )

  const Scene = scenes[index]?.C

  return (
    <LoveMeterProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-rose focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <FloatingHearts enabled={data.effects.floatingHearts} />
      <CursorTrail enabled={data.effects.cursorTrail} />
      <LoveMeter />
      <main id="main" className="relative z-10">
        {/* Keyed enter-only animation: an exit phase that can never jam the flow. */}
        <motion.div
          key={scenes[index]?.id || index}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          {Scene ? <Scene onNext={next} choice={choice} /> : null}
        </motion.div>
      </main>
    </LoveMeterProvider>
  )
}
