import { motion } from 'framer-motion'
import { STORY_POINTS, type StoryPoint } from '../types'

type Props = {
  selected: StoryPoint | undefined
  disabled: boolean
  onSelect: (value: StoryPoint) => void
}

export function CardSelector({ selected, disabled, onSelect }: Props) {
  return (
    <div>
      <p className="mb-3 font-display text-sm font-semibold text-ink-700">
        Your estimate
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {STORY_POINTS.map((point, index) => {
          const isSelected = selected === point
          return (
            <motion.button
              key={point}
              type="button"
              disabled={disabled}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.04,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={
                disabled
                  ? undefined
                  : { y: -6, scale: 1.04, transition: { duration: 0.2 } }
              }
              whileTap={disabled ? undefined : { scale: 0.96 }}
              onClick={() => !disabled && onSelect(point)}
              className={`relative flex h-16 w-12 items-center justify-center rounded-xl border-2 font-display text-lg font-bold shadow-card transition-colors sm:h-[4.5rem] sm:w-14 sm:text-xl ${
                isSelected
                  ? 'border-accent bg-accent text-white shadow-card-hover'
                  : 'border-ink-200 bg-white text-ink-800 hover:border-ink-300'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <motion.span
                  layoutId="card-selection-ring"
                  className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-accent ring-offset-2 ring-offset-ink-50"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              {point}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
