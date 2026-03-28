import { motion } from 'framer-motion'
import type { Participant } from '../types'
import { VoteCardFace } from './VoteCardFace'

type Props = {
  entries: Array<{ id: string; participant: Participant }>
  revealed: boolean
  localParticipantId: string | null
}

export function ParticipantList({
  entries,
  revealed,
  localParticipantId,
}: Props) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-ink-900">
        Participants
      </h2>
      <ul className="space-y-2">
        {entries.map(({ id, participant }, index) => {
          const isSelf = id === localParticipantId
          const isObserver = participant.observer === true
          const hasVote = !isObserver && participant.vote !== undefined
          return (
            <motion.li
              key={id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.05,
                layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-ink-200/80 bg-white/90 px-4 py-3 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink-900">
                  {participant.name}
                  {isSelf ? (
                    <span className="ml-2 text-xs font-normal text-accent">
                      (you)
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {isObserver && 'Observing'}
                  {!isObserver && !hasVote && !revealed && 'Choosing a card…'}
                  {!isObserver && hasVote && !revealed && 'Voted'}
                  {!isObserver && revealed && hasVote && 'Revealed'}
                  {!isObserver && !hasVote && revealed && 'No card'}
                </p>
              </div>
              <div className="shrink-0">
                {isObserver ? (
                  <div className="flex h-16 w-11 items-center justify-center rounded-xl border border-ink-200/60 bg-ink-100/80 text-[0.65rem] font-medium uppercase tracking-wide text-ink-400">
                    Obs
                  </div>
                ) : hasVote ? (
                  <VoteCardFace
                    revealed={revealed}
                    vote={participant.vote}
                    compact
                  />
                ) : (
                  <div className="flex h-16 w-11 items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/80 text-xs text-ink-400">
                    …
                  </div>
                )}
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
