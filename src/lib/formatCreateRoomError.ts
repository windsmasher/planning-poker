export function formatCreateRoomError(e: unknown): string {
  const code =
    e !== null &&
    typeof e === 'object' &&
    'code' in e &&
    typeof (e as { code: unknown }).code === 'string'
      ? (e as { code: string }).code
      : null
  const message = e instanceof Error ? e.message : String(e)

  if (code === 'PERMISSION_DENIED' || /permission denied/i.test(message)) {
    return [
      'Firebase blocked read/write (permission denied).',
      'Check: Realtime Database → Rules (publish open rules for `rooms`),',
      'Google Cloud → API key → Application restrictions → add your site URL,',
      'and App Check (turn off enforcement for RTDB or register this web app).',
    ].join(' ')
  }

  return code ? `${code}: ${message}` : message
}
