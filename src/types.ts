export const STORY_POINTS = [1, 2, 3, 5, 8, 13] as const

export type StoryPoint = (typeof STORY_POINTS)[number]

export type Participant = {
  name: string
  /** When true, user does not estimate; omitted/false means estimator */
  observer?: boolean
  /** Present only after the user has selected a card */
  vote?: StoryPoint
}

export type RoomState = {
  revealed: boolean
  participants: Record<string, Participant>
  createdAt?: number
}
