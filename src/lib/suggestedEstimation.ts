import { STORY_POINTS, type StoryPoint } from '../types'

export type SuggestedEstimationResult =
  | { kind: 'consensus'; value: StoryPoint; voteCount: number }
  | {
      kind: 'discuss'
      voteCount: number
      min: StoryPoint
      max: StoryPoint
    }
  | { kind: 'insufficient'; voteCount: number }

function storyPointIndex(sp: StoryPoint): number {
  return STORY_POINTS.indexOf(sp)
}

function medianOfSorted(sorted: number[]): number {
  const n = sorted.length
  const mid = Math.floor(n / 2)
  if (n % 2 === 1) return sorted[mid]!
  return (sorted[mid - 1]! + sorted[mid]!) / 2
}

function nearestStoryPoint(n: number): StoryPoint {
  let best: StoryPoint = STORY_POINTS[0]
  let bestDist = Math.abs(best - n)
  for (const sp of STORY_POINTS) {
    const d = Math.abs(sp - n)
    if (d < bestDist || (d === bestDist && sp > best)) {
      best = sp
      bestDist = d
    }
  }
  return best
}

/**
 * When at least two estimates differ strongly (wide numeric range or many
 * Fibonacci steps apart), we ask the team to discuss instead of picking one card.
 */
export function computeSuggestedEstimation(
  votes: StoryPoint[],
): SuggestedEstimationResult {
  if (votes.length === 0) {
    return { kind: 'insufficient', voteCount: 0 }
  }

  const sorted = [...votes].sort((a, b) => a - b)
  const min = sorted[0]!
  const max = sorted[sorted.length - 1]!
  const numericSpread = max - min
  const indexSpread = storyPointIndex(max) - storyPointIndex(min)

  const divergent =
    votes.length >= 2 &&
    (numericSpread >= 5 || indexSpread >= 4)

  if (divergent) {
    return { kind: 'discuss', voteCount: votes.length, min, max }
  }

  const median = medianOfSorted(sorted.map(Number))
  const value = nearestStoryPoint(median)
  return { kind: 'consensus', value, voteCount: votes.length }
}
