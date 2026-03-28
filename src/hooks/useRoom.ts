import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import type { RoomState } from '../types'

type UseRoomResult = {
  room: RoomState | null
  loading: boolean
  /** True after first snapshot when the room node exists */
  exists: boolean
  /** True after first snapshot when the room was never created */
  missing: boolean
}

export function useRoom(roomId: string | undefined): UseRoomResult {
  const [room, setRoom] = useState<RoomState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) {
      setRoom(null)
      setLoading(false)
      return
    }

    const roomRef = ref(db, `rooms/${roomId}`)
    const unsub = onValue(
      roomRef,
      (snap) => {
        const val = snap.val()
        if (val == null) {
          setRoom(null)
        } else {
          setRoom({
            revealed: Boolean(val.revealed),
            participants:
              typeof val.participants === 'object' && val.participants !== null
                ? val.participants
                : {},
            createdAt:
              typeof val.createdAt === 'number' ? val.createdAt : undefined,
          })
        }
        setLoading(false)
      },
      () => {
        setRoom(null)
        setLoading(false)
      },
    )

    return () => unsub()
  }, [roomId])

  return {
    room,
    loading,
    exists: !loading && room !== null,
    missing: !loading && room === null,
  }
}
