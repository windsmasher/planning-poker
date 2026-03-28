import { get, ref, remove, set, update } from 'firebase/database'
import { db } from '../firebase'
import { generateRoomId } from './roomId'
import type { StoryPoint } from '../types'

const MAX_SHORT_ID_ATTEMPTS = 16

/** Hard cap on concurrent rooms; oldest (by createdAt) are removed when exceeded. */
const MAX_ROOMS = 3

/**
 * Flat index: roomId -> createdAt (number only). Deep reads of `rooms/` often hit
 * PERMISSION_DENIED under RTDB rules when aggregating many rooms with nested data;
 * this path stays shallow so list + delete stays allowed with simple rules.
 */
const ROOM_LEDGER_PATH = 'roomLedger'

async function enforceMaxRooms(maxRooms: number): Promise<void> {
  const ledgerRef = ref(db, ROOM_LEDGER_PATH)
  const snap = await get(ledgerRef)
  const val = snap.val() as Record<string, number> | null
  if (!val) return

  const ids = Object.keys(val)
  if (ids.length <= maxRooms) return

  const oldestFirst = [...ids].sort((a, b) => {
    const ca = val[a] ?? 0
    const cb = val[b] ?? 0
    if (ca !== cb) return ca - cb
    return a.localeCompare(b)
  })

  const removeCount = ids.length - maxRooms
  const toRemove = oldestFirst.slice(0, removeCount)

  for (const id of toRemove) {
    await remove(ref(db, `rooms/${id}`))
    await remove(ref(db, `${ROOM_LEDGER_PATH}/${id}`))
  }
}

export async function createRoomWithUniqueId(): Promise<string> {
  for (let attempt = 0; attempt < MAX_SHORT_ID_ATTEMPTS; attempt++) {
    const roomId = generateRoomId()
    const roomRef = ref(db, `rooms/${roomId}`)
    const taken = (await get(roomRef)).val() != null
    if (taken) continue

    const createdAt = Date.now()
    await set(roomRef, {
      revealed: false,
      participants: {},
      createdAt,
    })
    await set(ref(db, `${ROOM_LEDGER_PATH}/${roomId}`), createdAt)

    try {
      await enforceMaxRooms(MAX_ROOMS)
    } catch (err) {
      console.warn('[planning-poker] Room cap cleanup failed:', err)
    }

    return roomId
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
