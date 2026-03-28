import { motion } from 'framer-motion'
import type { SuggestedEstimationResult } from '../lib/suggestedEstimation'
import { VoteCardFace } from './VoteCardFace'

type Props = {
  result: SuggestedEstimationResult
}

export function SuggestedEstimationPanel({ result }: Props) {
  if (result.kind === 'insufficient') {
    return null
  }

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-ink-200/80 bg-white/90 p-5 shadow-card backdrop-blur-sm"
    >
      <h2 className="font-display text-lg font-semibold text-ink-900">
        Suggested estimation
      </h2>
      {result.kind === 'consensus' ? (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <VoteCardFace revealed vote={result.value} />
          <p className="max-w-sm text-center text-sm text-ink-600 sm:text-left">
            Based on {result.voteCount} estimate
            {result.voteCount === 1 ? '' : 's'} (median rounded to the nearest
            card in the deck).
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-amber-900">
            Estimates are far apart ({result.min}–{result.max}).
          </p>
          <p className="text-sm text-ink-600">
            Align as a team before settling on a single story point — share
            assumptions and re-vote if needed.
          </p>
        </div>
      )}
    </motion.section>
  )
}
