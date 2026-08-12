/**
 * POST /api/book
 *
 * Turns a website booking request into a real appointment in Salon Central by
 * building the Appointment/Client shape its POST /api/public/booking expects
 * (the same payload its own online-booking page sends), which in turn queues
 * the WhatsApp confirmation and the staff group alert.
 *
 * This runs server-side so SALON_ID stays off the client and so the browser
 * never has to make a cross-origin call to the salon software.
 */

import {
  addMinutes,
  config,
  fetchSalon,
  normalizePhone,
} from './_salon-central.js'

const MAX_LENGTH = 500
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/

const clean = (value) =>
  typeof value === 'string' ? value.trim().slice(0, MAX_LENGTH) : ''

const createId = (prefix) => `${prefix}_${Date.now()}`

/** The visitor's IP, so Salon Central rate-limits per customer, not per proxy. */
const visitorIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
  req.headers['x-real-ip'] ||
  ''

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { origin, salonId, ready } = config()
  if (!ready) {
    console.error('SALON_CENTRAL_URL / SALON_ID are not set')
    return res.status(503).json({ error: 'Booking is not configured yet.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Malformed request.' })
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Malformed request.' })
  }

  const input = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    serviceId: clean(body.serviceId),
    serviceName: clean(body.serviceName),
    date: clean(body.date),
    time: clean(body.time),
    notes: clean(body.notes),
  }

  if (!input.name || !input.phone) {
    return res.status(400).json({ error: 'Name and phone are required.' })
  }
  if (input.email && !EMAIL.test(input.email)) {
    return res.status(400).json({ error: 'That email address looks invalid.' })
  }
  if (!DATE.test(input.date)) {
    return res.status(400).json({ error: 'Please choose a date.' })
  }
  if (input.time && !TIME.test(input.time)) {
    return res.status(400).json({ error: 'Please choose a valid time.' })
  }

  const phone = normalizePhone(input.phone)
  if (phone.length < 10) {
    return res.status(400).json({ error: 'That phone number looks invalid.' })
  }

  try {
    const salon = await fetchSalon(origin, salonId)
    const service = (salon.services || []).find(
      (item) => item.id === input.serviceId && item.isActive,
    )

    // An unrecognised service still books — the customer picked "not sure yet",
    // or the catalogue moved on since the page loaded. Staff confirm the detail
    // when they call back, which beats losing the booking outright.
    const durationMin = service?.durationMin || 60
    const startTime = input.time || '10:00'
    const today = new Date().toISOString().split('T')[0]

    const clientId = createId('c')
    const appointment = {
      id: createId('a'),
      clientId,
      clientName: input.name,
      staffId: 'any',
      staffName: 'Any Stylist',
      serviceIds: service ? [service.id] : [],
      serviceNames: [service?.name || input.serviceName || 'To be confirmed'],
      date: input.date,
      startTime,
      endTime: addMinutes(startTime, durationMin),
      status: 'booked',
      totalAmount: service?.price || 0,
      source: 'web',
      notes: input.notes || undefined,
      createdAt: new Date().toISOString(),
    }

    // Salon Central matches this against an existing client by phone and only
    // creates a new record when there is no match.
    const client = {
      id: clientId,
      name: input.name,
      phone,
      email: input.email || undefined,
      gender: 'female',
      tags: ['New'],
      source: 'web',
      createdAt: today,
      totalVisits: 1,
      totalSpend: appointment.totalAmount,
      lastVisitDate: input.date,
      averageRating: 5.0,
    }

    const ip = visitorIp(req)
    const upstream = await fetch(`${origin}/api/public/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ip && { 'x-forwarded-for': ip }),
      },
      body: JSON.stringify({
        salonId,
        appointment,
        client,
        clientPhone: phone,
      }),
      signal: AbortSignal.timeout(15000),
    })

    const result = await upstream.json().catch(() => ({}))

    if (upstream.status === 429) {
      return res.status(429).json({
        error: 'Too many booking attempts. Please try again shortly.',
      })
    }
    if (!upstream.ok || result.ok === false) {
      console.error('Salon Central rejected the booking', {
        status: upstream.status,
        result,
      })
      return res
        .status(502)
        .json({ error: 'The booking system did not accept that request.' })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Salon Central unreachable', error)
    return res
      .status(502)
      .json({ error: 'Could not reach the booking system. Please call us.' })
  }
}
