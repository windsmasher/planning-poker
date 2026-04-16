import { useCallback, useEffect } from 'react'

type AudioContextWithWebkit = typeof AudioContext & {
  new (): AudioContext
}

let audioContext: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null
let unlockBound = false

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextCtor = (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: AudioContextWithWebkit })
      .webkitAudioContext
  ) as AudioContextWithWebkit | undefined
  if (!AudioContextCtor) return null
  if (!audioContext) {
    audioContext = new AudioContextCtor()
  }
  return audioContext
}

function getNoiseBuffer(context: AudioContext) {
  if (noiseBuffer) return noiseBuffer
  const length = Math.max(1, Math.floor(context.sampleRate * 0.35))
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)

  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1
  }

  noiseBuffer = buffer
  return buffer
}

function shapeGain(
  param: AudioParam,
  now: number,
  peak: number,
  attack: number,
  decay: number,
) {
  param.cancelScheduledValues(now)
  param.setValueAtTime(0.0001, now)
  param.linearRampToValueAtTime(peak, now + attack)
  param.exponentialRampToValueAtTime(0.0001, now + attack + decay)
}

function playNoiseBurst(options: {
  startAt?: number
  duration: number
  peak: number
  filterFrequency: number
  q?: number
}) {
  const context = getAudioContext()
  if (!context) return

  const source = context.createBufferSource()
  source.buffer = getNoiseBuffer(context)

  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(options.filterFrequency, context.currentTime)
  filter.Q.setValueAtTime(options.q ?? 0.9, context.currentTime)

  const gain = context.createGain()
  const startAt = options.startAt ?? context.currentTime
  shapeGain(gain.gain, startAt, options.peak, 0.004, options.duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(context.destination)

  source.start(startAt)
  source.stop(startAt + options.duration + 0.05)
}

function playTone(options: {
  startAt?: number
  duration: number
  peak: number
  fromHz: number
  toHz: number
  type: OscillatorType
}) {
  const context = getAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const startAt = options.startAt ?? context.currentTime

  oscillator.type = options.type
  oscillator.frequency.setValueAtTime(options.fromHz, startAt)
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(1, options.toHz),
    startAt + options.duration,
  )

  shapeGain(gain.gain, startAt, options.peak, 0.003, options.duration)

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start(startAt)
  oscillator.stop(startAt + options.duration + 0.03)
}

async function unlockAudio() {
  const context = getAudioContext()
  if (!context || context.state === 'running') return

  try {
    await context.resume()
  } catch {
    /* ignored */
  }
}

export function useCardSounds() {
  useEffect(() => {
    if (typeof window === 'undefined' || unlockBound) return

    const handleUnlock = () => {
      void unlockAudio()
    }

    window.addEventListener('pointerdown', handleUnlock, { passive: true })
    window.addEventListener('keydown', handleUnlock)
    unlockBound = true

    return () => {
      window.removeEventListener('pointerdown', handleUnlock)
      window.removeEventListener('keydown', handleUnlock)
      unlockBound = false
    }
  }, [])

  const playCardHover = useCallback(() => {
    const context = getAudioContext()
    if (!context || context.state !== 'running') return
    const now = context.currentTime

    playNoiseBurst({
      startAt: now,
      duration: 0.035,
      peak: 0.015,
      filterFrequency: 3600,
      q: 1.2,
    })
    playNoiseBurst({
      startAt: now + 0.012,
      duration: 0.03,
      peak: 0.01,
      filterFrequency: 2400,
      q: 0.8,
    })
  }, [])

  const playCardSelect = useCallback(() => {
    const context = getAudioContext()
    if (!context || context.state !== 'running') return
    const now = context.currentTime

    playNoiseBurst({
      startAt: now,
      duration: 0.04,
      peak: 0.028,
      filterFrequency: 2100,
      q: 1,
    })
    playTone({
      startAt: now,
      duration: 0.065,
      peak: 0.028,
      fromHz: 210,
      toHz: 140,
      type: 'triangle',
    })
    playTone({
      startAt: now + 0.01,
      duration: 0.05,
      peak: 0.012,
      fromHz: 560,
      toHz: 360,
      type: 'square',
    })
  }, [])

  const playReveal = useCallback(() => {
    const context = getAudioContext()
    if (!context || context.state !== 'running') return
    const now = context.currentTime

    playNoiseBurst({
      startAt: now,
      duration: 0.045,
      peak: 0.024,
      filterFrequency: 2600,
    })
    playNoiseBurst({
      startAt: now + 0.045,
      duration: 0.045,
      peak: 0.022,
      filterFrequency: 3000,
    })
    playNoiseBurst({
      startAt: now + 0.09,
      duration: 0.05,
      peak: 0.026,
      filterFrequency: 3400,
    })
    playTone({
      startAt: now + 0.09,
      duration: 0.14,
      peak: 0.032,
      fromHz: 240,
      toHz: 170,
      type: 'triangle',
    })
  }, [])

  const playReset = useCallback(() => {
    const context = getAudioContext()
    if (!context || context.state !== 'running') return
    const now = context.currentTime

    playNoiseBurst({
      startAt: now,
      duration: 0.06,
      peak: 0.02,
      filterFrequency: 1800,
      q: 0.7,
    })
    playNoiseBurst({
      startAt: now + 0.05,
      duration: 0.07,
      peak: 0.018,
      filterFrequency: 1500,
      q: 0.7,
    })
    playTone({
      startAt: now,
      duration: 0.12,
      peak: 0.026,
      fromHz: 170,
      toHz: 115,
      type: 'triangle',
    })
  }, [])

  return {
    playCardHover,
    playCardSelect,
    playReveal,
    playReset,
  }
}
