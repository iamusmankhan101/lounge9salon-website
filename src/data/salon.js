import { useEffect, useState } from 'react'

/**
 * The salon's services and opening hours.
 *
 * Services are the live menu, read from the site's own /api/services route —
 * whatever staff have entered in the admin panel at /admin, and nothing else.
 * Opening hours are not part of that menu, so they live here as plain data;
 * editing them is a code change, which is the right cost for something that
 * changes once a year.
 */

const DAY_ORDER = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const SHORT_DAY = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
}

/** When the salon is open. The booking form builds its slots from this. */
export const OPENING_HOURS = [
  { day: 'Monday', open: false, from: '11:00', to: '20:00' },
  { day: 'Tuesday', open: true, from: '11:00', to: '20:00' },
  { day: 'Wednesday', open: true, from: '11:00', to: '20:00' },
  { day: 'Thursday', open: true, from: '11:00', to: '20:00' },
  { day: 'Friday', open: true, from: '11:00', to: '20:00' },
  { day: 'Saturday', open: true, from: '11:00', to: '18:00' },
  { day: 'Sunday', open: true, from: '11:00', to: '18:00' },
]

const EMPTY = { services: [], hours: OPENING_HOURS, ok: false }

// one request per page load, shared by every component that asks
let pending

function load() {
  pending ??= fetch('/api/services')
    .then((response) => (response.ok ? response.json() : null))
    .then((data) =>
      data
        ? { services: data.services || [], hours: OPENING_HOURS, ok: true }
        : EMPTY,
    )
    .catch(() => EMPTY)
  return pending
}

/** Subscribes a component to the salon's live service menu. */
export function useSalon() {
  const [salon, setSalon] = useState(EMPTY)

  useEffect(() => {
    let cancelled = false
    load().then((data) => {
      if (!cancelled) setSalon(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return salon
}

/** Forgets the cached menu, so the next useSalon() refetches it. */
export const refreshSalon = () => {
  pending = undefined
}

/**
 * 24-hour "14:30" as the clock people actually read it. Whole hours drop the
 * minutes, so an opening time reads "11 AM" rather than "11:00 AM".
 */
export function formatTime(value) {
  const [h, m] = String(value).split(':').map(Number)
  const hour = h % 12 === 0 ? 12 : h % 12
  const suffix = h < 12 ? 'AM' : 'PM'
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`
}

const sameSlot = (a, b) =>
  a.open === b.open && (!a.open || (a.from === b.from && a.to === b.to))

/**
 * Collapses consecutive days that share the same hours into one row, so seven
 * near-identical lines read as "Tuesday – Friday, 11 AM – 8 PM".
 */
export function groupHours(hours = OPENING_HOURS) {
  const ordered = DAY_ORDER.map((day) =>
    hours.find((entry) => entry.day === day),
  ).filter(Boolean)

  const runs = []
  for (const entry of ordered) {
    const last = runs[runs.length - 1]
    if (last && sameSlot(last.entry, entry)) last.days.push(entry.day)
    else runs.push({ entry, days: [entry.day] })
  }

  return runs.map(({ entry, days }) => ({
    key: days[0],
    days:
      days.length === 1 ? days[0] : `${days[0]} – ${days[days.length - 1]}`,
    shortDays:
      days.length === 1
        ? SHORT_DAY[days[0]]
        : `${SHORT_DAY[days[0]]}–${SHORT_DAY[days[days.length - 1]]}`,
    open: entry.open,
    time: entry.open
      ? `${formatTime(entry.from)} – ${formatTime(entry.to)}`
      : 'Closed',
  }))
}

/** One-line summary for tight spots, e.g. "Tue–Fri 11 AM – 8 PM · Mon closed". */
export function summarizeHours(hours = OPENING_HOURS) {
  const rows = groupHours(hours)
  const open = rows.filter((row) => row.open)
  const closed = rows.filter((row) => !row.open)

  return [
    ...open.map((row) => `${row.shortDays} ${row.time}`),
    ...closed.map((row) => `${row.shortDays} closed`),
  ].join(' · ')
}
