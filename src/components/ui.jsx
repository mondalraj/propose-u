import { motion } from 'motion/react'

export const spring = { type: 'spring', stiffness: 260, damping: 20 }

export function PrimaryButton({ children, onClick, className = '', disabled, ...rest }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={spring}
      className={`cursor-pointer rounded-full bg-gradient-to-r from-rose to-rose-deep px-8 py-4 text-lg font-semibold text-cream shadow-[0_8px_32px_rgba(255,94,138,0.35)] transition-shadow hover:shadow-[0_8px_44px_rgba(255,94,138,0.55)] disabled:cursor-not-allowed disabled:opacity-50 md:px-10 md:py-4 md:text-xl ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function GhostButton({ children, onClick, className = '', ...rest }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={`cursor-pointer rounded-full border border-white/20 bg-white/5 px-6 py-3 text-base font-medium text-mauve backdrop-blur-sm transition-colors hover:border-rose/50 hover:text-cream md:text-lg ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function Chip({ selected, onClick, children, className = '' }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      aria-pressed={selected}
      transition={spring}
      className={`cursor-pointer rounded-full border px-6 py-3 text-base font-medium transition-colors md:text-lg ${
        selected
          ? 'border-rose bg-rose/20 text-cream shadow-[0_0_20px_rgba(255,94,138,0.3)]'
          : 'border-white/15 bg-white/5 text-mauve hover:border-rose/40 hover:text-cream'
      } ${className}`}
    >
      {children}
    </motion.button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-night-card/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-10 ${className}`}
    >
      {children}
    </div>
  )
}

export function SkipButton({ onClick, label = 'Skip ✨' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 cursor-pointer rounded-full px-5 py-2 text-sm text-mauve/70 underline-offset-4 transition-colors hover:text-cream hover:underline md:text-base"
    >
      {label}
    </button>
  )
}

/** Word-by-word staggered text reveal. */
export function RevealWords({ text, className = '', delay = 0 }) {
  const words = String(text).split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${i}-${w}`}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: 14, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ ...spring, delay: delay + i * 0.06 }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
