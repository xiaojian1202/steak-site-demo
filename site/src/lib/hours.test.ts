import {describe, expect, it} from 'vitest'
import {formatHoursLine, getOpenStatus, sortedByWeekStartingSunday} from './hours'

describe('getOpenStatus', () => {
  it('reports open when now is within today\'s open/close window', () => {
    const wednesday = [{dayOfWeek: 3, open: '08:00', close: '17:00'}]
    const now = new Date(2026, 8, 9, 10, 30) // Wed Sep 9 2026, 10:30am
    expect(getOpenStatus(wednesday, now).isOpen).toBe(true)
  })

  it('reports closed when now is before today\'s open time', () => {
    const wednesday = [{dayOfWeek: 3, open: '08:00', close: '17:00'}]
    const now = new Date(2026, 8, 9, 6, 0) // Wed Sep 9 2026, 6:00am
    expect(getOpenStatus(wednesday, now).isOpen).toBe(false)
  })

  it('reports closed at the exact close time (close boundary is exclusive)', () => {
    const wednesday = [{dayOfWeek: 3, open: '08:00', close: '17:00'}]
    const now = new Date(2026, 8, 9, 17, 0)
    expect(getOpenStatus(wednesday, now).isOpen).toBe(false)
  })

  it('reports closed when today is explicitly marked closed', () => {
    const wednesday = [{dayOfWeek: 3, closed: true}]
    const now = new Date(2026, 8, 9, 10, 30)
    expect(getOpenStatus(wednesday, now).isOpen).toBe(false)
  })

  it('reports closed when today has no hours entry at all', () => {
    const mondayOnly = [{dayOfWeek: 1, open: '08:00', close: '17:00'}]
    const now = new Date(2026, 8, 9, 10, 30) // Wednesday
    expect(getOpenStatus(mondayOnly, now).isOpen).toBe(false)
  })
})

describe('formatHoursLine', () => {
  it('formats a normal open/close range in 12h time', () => {
    expect(formatHoursLine({dayOfWeek: 3, open: '08:00', close: '17:00'})).toBe(
      'Wednesday: 8AM – 5PM',
    )
  })

  it('formats a closed day', () => {
    expect(formatHoursLine({dayOfWeek: 0, closed: true})).toBe('Sunday: Closed')
  })
})

describe('sortedByWeekStartingSunday', () => {
  it('orders days Sunday through Saturday regardless of input order', () => {
    const hours = [
      {dayOfWeek: 3, open: '08:00', close: '17:00'},
      {dayOfWeek: 0, closed: true},
      {dayOfWeek: 6, open: '09:00', close: '14:00'},
    ]
    expect(sortedByWeekStartingSunday(hours).map((d) => d.dayOfWeek)).toEqual([0, 3, 6])
  })
})
