import { get, ref, set, update } from 'firebase/database'
import { db } from '../firebase'
import { generateRoomId } from './roomId'
import type { StoryPoint } from '../types'

const MAX_CREATE_ATTEMPTS = 8

export async function createRoomWithUniqueId(): Promise<string> {
  for (let i = 0; i < MAX_CREATE_ATTEMPTS; i++) {
    const roomId = generateRoomId()
    const roomRef = ref(db, `rooms/${roomId}`)
    const snap = await get(roomRef)
    if (snap.val() == null) {
      await set(roomRef, {
        revealed: false,
        participants: {},
        createdAt: Date.now(),
      })
      return roomId
    }
  }
  throw new Error('Could not create a unique room. Please try again.')
}

export async function joinRoom(roomId: string, name: string): Promise<string> {
  const participantId = crypto.randomUUID()
  await update(ref(db, `rooms/${roomId}/participants/${participantId}`), {
    name: name.trim(),
  })
  return participantId
}

export async function updateParticipantName(
  roomId: string,
  participantId: string,
  name: string,
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/participants/${participantId}`), {
    name: name.trim(),
  })
}

export async function setParticipantVote(
  roomId: string,
  participantId: string,
  vote: StoryPoint,
): Promise<void> {
  await update(ref(db, `rooms/${roomId}`), {
    [`participants/${participantId}/vote`]: vote,
  })
}

export async function revealVotes(roomId: string): Promise<void> {
  await update(ref(db, `rooms/${roomId}`), { revealed: true })
}

export async function resetRound(
  roomId: string,
  participantIds: string[],
): Promise<void> {
  const updates: Record<string, unknown> = { revealed: false }
  for (const id of participantIds) {
    updates[`participants/${id}/vote`] = null
  }
  await update(ref(db, `rooms/${roomId}`), updates)
}
