export function formatLocalDateTime(value: string | null): string {
  if (!value) return 'Not available'

  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatDuration(seconds: number | null | undefined): string {
  const totalSeconds = Math.max(0, Math.floor(seconds ?? 0))
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60

  if (minutes === 0) return `${remainingSeconds}s`
  if (remainingSeconds === 0) return `${minutes}m`
  return `${minutes}m ${remainingSeconds}s`
}