import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardSelector } from '../components/CardSelector'
import { InvitationBar } from '../components/InvitationBar'
import { ParticipantList } from '../components/ParticipantList'
import { RoomControls } from '../components/RoomControls'
import { useRoom } from '../hooks/useRoom'
import { participantStorageKey } from '../lib/roomId'
import {
  joinRoom,
  revealVotes,
  resetRound,
  setParticipantVote,
} from '../lib/roomService'
import type { StoryPoint } from '../types'

export function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  const { room, loading, missing } = useRoom(roomId)

  const [localParticipantId, setLocalParticipantId] = useState<string | null>(
    () =>
      roomId ? sessionStorage.getItem(participantStorageKey(roomId)) : null,
  )
  const [joinName, setJoinName] = useState('')
  const [joinRole, setJoinRole] = useState<'estimator' | 'observer' | null>(
    null,
  )
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [actionBusy, setActionBusy] = useState(false)

  useEffect(() => {
    if (!roomId || !room) return
    const key = participantStorageKey(roomId)
    const raw = sessionStorage.getItem(key)
    if (raw && room.participants[raw] === undefined) {
      sessionStorage.removeItem(key)
      setLocalParticipantId(null)
    }
  }, [room, roomId])

  const invitationUrl =
    typeof window !== 'undefined' ? window.location.href.split('?')[0] ?? '' : ''

  const participantEntries = useMemo(() => {
    if (!room) return []
    return Object.entries(room.participants).map(([id, participant]) => ({
      id,
      participant,
    }))
  }, [room])

  const estimatorEntries = useMemo(
    () => participantEntries.filter((e) => !e.participant.observer),
    [participantEntries],
  )

  const allVoted = useMemo(() => {
    if (!room || estimatorEntries.length === 0) return false
    return estimatorEntries.every((e) => e.participant.vote !== undefined)
  }, [room, estimatorEntries])

  const revealed = room?.revealed ?? false

  const amObserver = useMemo(() => {
    if (!room || !localParticipantId) return false
    return room.participants[localParticipantId]?.observer === true
  }, [room, localParticipantId])

  const myVote = useMemo(() => {
    if (!room || !localParticipantId) return undefined
    return room.participants[localParticipantId]?.vote
  }, [room, localParticipantId])

  const canChangeVote = !revealed

  const handleJoin = useCallback(async () => {
    if (!roomId) return
    const name = joinName.trim()
    if (!name) {
      setJoinError('Please enter your name.')
      return
    }
    if (joinRole === null) {
      setJoinError('Choose whether you will estimate or observe.')
      return
    }
    setJoinError(null)
    setJoining(true)
    try {
      const pid = await joinRoom(roomId, name, joinRole === 'observer')
      sessionStorage.setItem(participantStorageKey(roomId), pid)
      setLocalParticipantId(pid)
    } catch {
      setJoinError('Could not join the room. Check your connection.')
    } finally {
      setJoining(false)
    }
  }, [joinName, joinRole, roomId])

  const handleSelectCard = useCallback(
    async (vote: StoryPoint) => {
      if (!roomId || !localParticipantId || revealed) return
      try {
        await setParticipantVote(roomId, localParticipantId, vote)
      } catch {
        /* sync will retry on next interaction */
      }
    },
    [roomId, localParticipantId, revealed],
  )

  const handleReveal = useCallback(async () => {
    if (!roomId || !allVoted || revealed) return
    setActionBusy(true)
    try {
      await revealVotes(roomId)
    } finally {
      setActionBusy(false)
    }
  }, [roomId, allVoted, revealed])

  const handleReset = useCallback(async () => {
    if (!roomId || !revealed || !room) return
    setActionBusy(true)
    try {
      const ids = Object.keys(room.participants)
      await resetRound(roomId, ids)
    } finally {
      setActionBusy(false)
    }
  }, [roomId, revealed, room])

  if (!roomId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-ink-600">Invalid room link.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="font-display text-sm font-medium text-ink-500"
        >
          Loading room…
        </motion.div>
      </div>
    )
  }

  if (missing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-xl font-semibold text-ink-900">
          Room not found
        </h1>
        <p className="max-w-sm text-ink-600">
          This link may be wrong or the room was removed.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Back to home
        </Link>
      </div>
    )
  }

  if (!room) {
    return null
  }

  if (!localParticipantId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl border border-ink-200/80 bg-white p-8 shadow-card"
        >
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Join the room
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Enter the name others will see in the participant list.
          </p>
          <label className="mt-6 block text-left">
            <span className="text-sm font-medium text-ink-700">
              Enter your name
            </span>
            <input
              type="text"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleJoin()}
              className="mt-2 w-full rounded-xl border border-ink-200 bg-ink-50/50 px-4 py-3 text-ink-900 outline-none ring-accent/30 transition-shadow focus:ring-2"
              placeholder="Your name"
              autoComplete="nickname"
              maxLength={64}
            />
          </label>
          <fieldset className="mt-6 text-left">
            <legend className="text-sm font-medium text-ink-700">
              How will you join?
            </legend>
            <div className="mt-3 space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 bg-ink-50/50 px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                <input
                  type="radio"
                  name="join-role"
                  checked={joinRole === 'estimator'}
                  onChange={() => setJoinRole('estimator')}
                  className="mt-1 accent-accent"
                />
                <span>
                  <span className="block font-medium text-ink-900">
                    Estimator
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-500">
                    Pick a card; you count toward revealing votes.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 bg-ink-50/50 px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                <input
                  type="radio"
                  name="join-role"
                  checked={joinRole === 'observer'}
                  onChange={() => setJoinRole('observer')}
                  className="mt-1 accent-accent"
                />
                <span>
                  <span className="block font-medium text-ink-900">
                    Observer only
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-500">
                    Watch the session; no card and not counted for show cards.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
          {joinError ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {joinError}
            </p>
          ) : null}
          <motion.button
            type="button"
            disabled={joining || joinRole === null}
            whileHover={joining ? undefined : { scale: 1.02 }}
            whileTap={joining ? undefined : { scale: 0.98 }}
            onClick={() => void handleJoin()}
            className="mt-6 w-full rounded-xl bg-accent py-3 font-display text-sm font-semibold text-white shadow-card hover:bg-accent-muted disabled:opacity-60"
          >
            {joining ? 'Joining…' : 'Join the room'}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-8 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="text-sm font-medium text-ink-500 hover:text-ink-800"
          >
            ← Home
          </Link>
          <p className="font-mono text-xs text-ink-400 sm:text-right">
            Room: {roomId}
          </p>
        </header>

        <InvitationBar invitationUrl={invitationUrl} />

        <ParticipantList
          entries={participantEntries}
          revealed={revealed}
          localParticipantId={localParticipantId}
        />

        {amObserver ? (
          <motion.section
            layout
            className="rounded-2xl border border-ink-200/80 bg-white/90 p-6 shadow-card backdrop-blur-sm"
          >
            <p className="text-center font-display text-sm font-semibold text-ink-700">
              You are observing
            </p>
            <p className="mt-2 text-center text-sm text-ink-500">
              Observers do not pick cards or appear in the vote tally.
            </p>
          </motion.section>
        ) : (
          <motion.section
            layout
            className="rounded-2xl border border-ink-200/80 bg-white/90 p-6 shadow-card backdrop-blur-sm"
          >
            <CardSelector
              selected={myVote}
              disabled={!canChangeVote}
              onSelect={handleSelectCard}
            />
          </motion.section>
        )}

        <RoomControls
          allVoted={allVoted}
          revealed={revealed}
          onReveal={handleReveal}
          onReset={handleReset}
          busy={actionBusy}
        />
      </div>
    </div>
  )
}
