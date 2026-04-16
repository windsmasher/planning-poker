import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'

type Props = {
  invitationUrl: string
  canDeleteRoom?: boolean
  deletingRoom?: boolean
  onDeleteRoom?: () => void
}

export function InvitationBar({
  invitationUrl,
  canDeleteRoom = false,
  deletingRoom = false,
  onDeleteRoom,
}: Props) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [invitationUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-ink-200/80 bg-white/90 p-4 shadow-card backdrop-blur-sm sm:p-5"
    >
      <p className="font-display text-sm font-semibold text-ink-900">
        Room invitation link
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => void copy()}
          className={`w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 ${
            canDeleteRoom ? 'sm:basis-[70%]' : 'sm:basis-full'
          }`}
        >
          {copied ? 'Copied!' : 'Copy room invitation URL'}
        </motion.button>
        {canDeleteRoom ? (
          <motion.button
            type="button"
            whileHover={deletingRoom ? undefined : { scale: 1.02 }}
            whileTap={deletingRoom ? undefined : { scale: 0.98 }}
            onClick={onDeleteRoom}
            disabled={deletingRoom}
            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:basis-[30%]"
          >
            {deletingRoom ? 'Deleting room…' : 'Delete room'}
          </motion.button>
        ) : null}
      </div>
    </motion.div>
  )
}
