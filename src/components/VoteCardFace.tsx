import { motion } from 'framer-motion'
import type { StoryPoint } from '../types'

type Props = {
  revealed: boolean
  vote: StoryPoint | undefined
  compact?: boolean
}

export function VoteCardFace({ revealed, vote, compact }: Props) {
  const height = compact ? 'h-16 w-11' : 'h-24 w-16 sm:h-28 sm:w-[4.5rem]'

  return (
    <div className={`perspective-1000 ${height}`}>
      <motion.div
        className="relative h-full w-full preserve-3d"
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 border-ink-200 bg-gradient-to-br from-ink-800 to-ink-950 shadow-card backface-hidden ${
            compact ? 'text-xs' : 'text-lg font-bold'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-display text-white/90">?</span>
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 border-accent bg-white shadow-card-hover backface-hidden ${
            compact ? 'text-sm font-bold' : 'text-2xl font-bold'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="font-display text-accent-muted">
            {vote !== undefined ? vote : '—'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
