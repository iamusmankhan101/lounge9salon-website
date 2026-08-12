import { useMemo } from 'react'

/**
 * Everything the two booking surfaces share — the appointment section and the
 * quick form inside a treatment popup — so they cannot drift apart in what
 * they send or which slots they offer.
 */

export const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  serviceId: '',
  date: '',
  time: '',
  notes: '',
}

export const today = () => new Date().toISOString().split('T')[0]

const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Half-hour starts that still leave room for the treatment before closing. */
function slotsBetween(from, to, durationMin) {
  const end = toMinutes(to)
  const slots = []
  for (let t = toMinutes(from); t + Math.max(durationMin, 30) <= end; t += 30) {
    slots.push(
      `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`,
    )
  }
  return slots
}

/** Bookable start times for a date, following that day's opening hours. */
export function useTimeSlots(date, hours, durationMin = 60) {
  return useMemo(() => {
    if (!date) return { slots: [], closed: false }

    const [y, m, d] = date.split('-').map(Number)
    const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long',
    })
    const day = hours.find((entry) => entry.day === dayName)
    if (!day || !day.open) return { slots: [], closed: Boolean(hours.length) }

    return { slots: slotsBetween(day.from, day.to, durationMin), closed: false }
  }, [date, hours, durationMin])
}

/**
 * Sends the appointment to Salon Central through the site's own proxy.
 * Throws with a message fit to show the customer.
 */
export async function submitBooking(payload) {
  const response = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'We could not send that request.')
  }

  return response.json().catch(() => ({ ok: true }))
}
