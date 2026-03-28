import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'

type Props = {
  invitationUrl: string
}

export function InvitationBar({ invitationUrl }: Props) {
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
      <p className="font-display text-sm font-semibold text-ink-700">
        Room invitation link
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <code className="block flex-1 truncate rounded-xl bg-ink-100/80 px-3 py-2.5 text-xs text-ink-800 sm:text-sm">
          {invitationUrl}
        </code>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => void copy()}
          className="shrink-0 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
        >
          {copied ? 'Copied!' : 'Copy room invitation URL'}
        </motion.button>
      </div>
    </motion.div>
  )
}
