import { motion } from 'framer-motion'
import type { StoryPoint } from '../types'
import type { SuggestedEstimationResult } from '../lib/suggestedEstimation'
import { VoteCardFace } from './VoteCardFace'

type Props = {
  result: SuggestedEstimationResult
  /** All estimators picked the same card (after reveal). */
  unanimous?: boolean
  unanimousValue?: StoryPoint
}

export function SuggestedEstimationPanel({
  result,
  unanimous,
  unanimousValue,
}: Props) {
  if (result.kind === 'insufficient') {
    return null
  }

  const showUnanimity =
    unanimous === true &&
    unanimousValue !== undefined &&
    result.kind === 'consensus'

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border bg-white/90 p-5 shadow-card backdrop-blur-sm ${
        showUnanimity
          ? 'border-accent/50 ring-2 ring-accent/25'
          : 'border-ink-200/80'
      }`}
    >
      {showUnanimity ? (
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="mb-4 rounded-xl bg-gradient-to-br from-accent/15 via-white to-amber-100/40 px-4 py-3 text-center"
        >
          <p className="font-display text-base font-bold text-accent-muted">
            Perfect match
          </p>
          <p className="mt-1 text-sm text-ink-700">
            Everyone voted{' '}
            <span className="font-semibold text-ink-900">{unanimousValue}</span>
            — great alignment. On to the next story when you are ready.
          </p>
        </motion.div>
      ) : null}

      <h2 className="font-display text-lg font-semibold text-ink-900">
        Suggested estimation
      </h2>
      {result.kind === 'consensus' ? (
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <VoteCardFace revealed vote={result.value} />
          <p className="max-w-sm text-center text-sm text-ink-600 sm:text-left">
            {showUnanimity ? (
              <>Unanimous vote — no discussion needed on the number.</>
            ) : (
              <>
                Based on {result.voteCount} estimate
                {result.voteCount === 1 ? '' : 's'} (median rounded to the
                nearest card in the deck).
              </>
            )}
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
