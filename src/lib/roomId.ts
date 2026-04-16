const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function generateRoomId(length = 8): string {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!
  }
  return id
}

export function participantStorageKey(roomId: string): string {
  return `planning-poker:${roomId}:participantId`
}

export function roomOwnerStorageKey(roomId: string): string {
  return `planning-poker:${roomId}:ownerKey`
}
