import { useMemo } from 'react'
import { WHATSAPP } from './contact.js'
import { formatTime } from './salon.js'

/**
 * Everything the two booking surfaces share — the appointment section and the
 * quick form inside a treatment popup — so they cannot drift apart in what
 * they send or which slots they offer.
 *
 * A booking is not stored anywhere: the form composes a message and hands the
 * customer off to WhatsApp with it already written, and the salon confirms the
 * slot in that thread. Nothing is promised to the customer until they do.
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

/** "2026-08-18" as "Tuesday, 18 August" — dates are for reading, not parsing. */
export function formatDate(value) {
  const [y, m, d] = String(value).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
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
 * The request as the salon will read it in WhatsApp — one labelled line per
 * answer, so a member of staff can act on it without asking anything back.
 */
export function bookingMessage({ name, phone, email, serviceName, date, time, notes }) {
  const lines = [
    `Service: ${serviceName || 'Not sure yet'}`,
    date && `Date: ${formatDate(date)}`,
    `Time: ${time ? formatTime(time) : 'First available'}`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    email && `Email: ${email}`,
    notes && `Notes: ${notes}`,
  ].filter(Boolean)

  // the blank line survives the filter above, which would drop it as falsy
  return ['Hi Lounge 8, I would like to book an appointment.', '', ...lines].join(
    '\n',
  )
}

/** wa.me link for a booking, with the message already written. */
export const bookingLink = (payload) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(bookingMessage(payload))}`

/**
 * Hands the booking to WhatsApp. Opens a tab where it can — the site stays put
 * behind it — and navigates in place when a blocker refuses the tab, so the
 * message is never simply lost.
 */
export function sendBooking(payload) {
  const url = bookingLink(payload)
  const tab = window.open(url, '_blank', 'noopener,noreferrer')
  if (!tab) window.location.href = url
}
