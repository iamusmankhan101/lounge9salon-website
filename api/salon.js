/**
 * GET /api/salon
 *
 * Feeds the booking form the salon's live service list and opening hours,
 * straight out of Salon Central, so the website can never offer a service the
 * salon has retired. Proxied server-side to keep SALON_ID off the client.
 */

import { config, fetchSalon } from './_salon-central.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { origin, salonId, ready } = config()
  if (!ready) {
    console.error('SALON_CENTRAL_URL / SALON_ID are not set')
    return res.status(503).json({ error: 'Booking is not configured yet.' })
  }

  try {
    const salon = await fetchSalon(origin, salonId)

    const services = (salon.services || [])
      .filter((service) => service.isActive)
      .map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        durationMin: service.durationMin,
        category: service.category,
      }))

    // the form only needs the opening window to build its time slots
    const hours = (salon.settings?.hours || []).map((entry) => ({
      day: entry.day,
      open: entry.open,
      from: entry.from,
      to: entry.to,
    }))

    // services change rarely; let the edge hold them briefly
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json({ services, hours })
  } catch (error) {
    console.error('Could not load salon data', error)
    return res.status(502).json({ error: 'Could not load services.' })
  }
}
