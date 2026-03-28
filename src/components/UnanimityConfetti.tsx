import { useEffect, useRef } from 'react'
import { fireUnanimityConfetti } from '../lib/unanimityConfetti'

type Props = {
  /** When this becomes true after a reset, confetti runs once per reveal cycle. */
  active: boolean
}

export function UnanimityConfetti({ active }: Props) {
  const firedForRevealRef = useRef(false)

  useEffect(() => {
    if (!active) {
      firedForRevealRef.current = false
      return
    }
    if (firedForRevealRef.current) return
    firedForRevealRef.current = true
    fireUnanimityConfetti()
  }, [active])

  return null
}
