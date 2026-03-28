import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCreateRoomError } from '../lib/formatCreateRoomError'
import { createRoomWithUniqueId } from '../lib/roomService'

export function Home() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setError(null)
    setCreating(true)
    try {
      const roomId = await createRoomWithUniqueId()
      navigate(`/room/${roomId}`)
    } catch (e) {
      console.error('[planning-poker] createRoom', e)
      setError(formatCreateRoomError(e))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
          Planning Poker
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-600">
          Create a room, share the link, and estimate together in real time.
        </p>
        <motion.button
          type="button"
          disabled={creating}
          whileHover={creating ? undefined : { scale: 1.03 }}
          whileTap={creating ? undefined : { scale: 0.97 }}
          onClick={() => void handleCreate()}
          className="mt-10 rounded-2xl bg-ink-900 px-10 py-4 font-display text-base font-semibold text-white shadow-card transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? 'Creating…' : 'Create a room'}
        </motion.button>
        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </motion.div>
    </div>
  )
}
