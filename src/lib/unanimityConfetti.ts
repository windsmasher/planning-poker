import confetti from 'canvas-confetti'

const ACCENT_PALETTE = ['#3d7a6b', '#2f5f54', '#4ade80', '#fbbf24', '#6ee7b7']

export function fireUnanimityConfetti(): void {
  const scalar = typeof window !== 'undefined' ? Math.min(window.innerWidth / 1200, 1) : 1

  confetti({
    particleCount: Math.floor(100 * scalar),
    spread: 72,
    startVelocity: 48,
    origin: { y: 0.62 },
    colors: ACCENT_PALETTE,
    disableForReducedMotion: true,
  })

  window.setTimeout(() => {
    confetti({
      particleCount: Math.floor(60 * scalar),
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ACCENT_PALETTE,
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: Math.floor(60 * scalar),
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ACCENT_PALETTE,
      disableForReducedMotion: true,
    })
  }, 220)
}
