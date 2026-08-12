import { useEffect, useState } from 'react'

/**
 * Live salon data — services and opening hours — read from Salon Central via
 * the site's own /api/salon proxy, so the website can never advertise hours or
 * treatments that the salon has since changed.
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

/**
 * Shown only if the software cannot be reached — kept in step with what it
 * currently returns so a failed request never contradicts the booking form.
 */
const FALLBACK_HOURS = [
  { day: 'Monday', open: false, from: '11:00', to: '20:00' },
  { day: 'Tuesday', open: true, from: '11:00', to: '20:00' },
  { day: 'Wednesday', open: true, from: '11:00', to: '20:00' },
  { day: 'Thursday', open: true, from: '11:00', to: '20:00' },
  { day: 'Friday', open: true, from: '11:00', to: '20:00' },
  { day: 'Saturday', open: true, from: '11:00', to: '18:00' },
  { day: 'Sunday', open: true, from: '11:00', to: '18:00' },
]

const EMPTY = { services: [], hours: FALLBACK_HOURS, ok: false }

// one request per page load, shared by every component that asks
let pending

function load() {
  pending ??= fetch('/api/salon')
    .then((response) => (response.ok ? response.json() : null))
    .then((data) =>
      data
        ? {
            services: data.services || [],
            hours: data.hours?.length ? data.hours : FALLBACK_HOURS,
            ok: true,
          }
        : EMPTY,
    )
    .catch(() => EMPTY)
  return pending
}

/** Subscribes a component to the salon's live services and hours. */
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
export function groupHours(hours) {
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
export function summarizeHours(hours) {
  const rows = groupHours(hours)
  const open = rows.filter((row) => row.open)
  const closed = rows.filter((row) => !row.open)

  return [
    ...open.map((row) => `${row.shortDays} ${row.time}`),
    ...closed.map((row) => `${row.shortDays} closed`),
  ].join(' · ')
}
