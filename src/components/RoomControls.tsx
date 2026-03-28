import { motion } from 'framer-motion'

type Props = {
  allVoted: boolean
  revealed: boolean
  onReveal: () => void
  onReset: () => void
  busy: boolean
}

export function RoomControls({
  allVoted,
  revealed,
  onReveal,
  onReset,
  busy,
}: Props) {
  const showCardsDisabled = !allVoted || revealed || busy
  const resetDisabled = !revealed || busy

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <motion.button
        type="button"
        whileHover={showCardsDisabled ? undefined : { scale: 1.02 }}
        whileTap={showCardsDisabled ? undefined : { scale: 0.98 }}
        disabled={showCardsDisabled}
        onClick={() => onReveal()}
        className={`rounded-xl px-6 py-3 font-display text-sm font-semibold transition-colors ${
          showCardsDisabled
            ? 'cursor-not-allowed bg-ink-200 text-ink-500'
            : 'bg-accent text-white shadow-card hover:bg-accent-muted'
        }`}
      >
        Show cards
      </motion.button>
      <motion.button
        type="button"
        whileHover={resetDisabled ? undefined : { scale: 1.02 }}
        whileTap={resetDisabled ? undefined : { scale: 0.98 }}
        disabled={resetDisabled}
        onClick={() => onReset()}
        className={`rounded-xl px-6 py-3 font-display text-sm font-semibold transition-colors ${
          resetDisabled
            ? 'cursor-not-allowed border-2 border-ink-200 bg-transparent text-ink-400'
            : 'border-2 border-ink-800 bg-transparent text-ink-900 hover:bg-ink-100'
        }`}
      >
        Reset
      </motion.button>
    </div>
  )
}
