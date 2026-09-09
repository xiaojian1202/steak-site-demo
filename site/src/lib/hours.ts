export type DayHours = {
  dayOfWeek: number
  closed?: boolean
  open?: string
  close?: string
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// Computes open/closed at render time. Times are stored as 24h strings; the
// shop's local wall-clock time is assumed (no timezone conversion — a café
// serves one timezone).
export function getOpenStatus(hours: DayHours[] | undefined, now: Date = new Date()) {
  if (!hours || hours.length === 0) {
    return {isOpen: false, today: null as DayHours | null}
  }

  const today = hours.find((d) => d.dayOfWeek === now.getDay()) ?? null
  if (!today || today.closed || !today.open || !today.close) {
    return {isOpen: false, today}
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const isOpen = nowMinutes >= toMinutes(today.open) && nowMinutes < toMinutes(today.close)
  return {isOpen, today}
}

export function formatHoursLine(day: DayHours): string {
  const name = DAY_NAMES[day.dayOfWeek] ?? ''
  if (day.closed || !day.open || !day.close) return `${name}: Closed`
  return `${name}: ${formatTime(day.open)} – ${formatTime(day.close)}`
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, '0')}${period}`
}

export function sortedByWeekStartingSunday(hours: DayHours[]): DayHours[] {
  return [...hours].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
}
