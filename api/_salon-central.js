/**
 * Reading the salon's own software, Salon Central, so its existing service
 * catalogue can be pulled into the website's menu rather than retyped.
 * Files prefixed with "_" are not routed by Vercel.
 *
 * This is read-only and one-directional: the website imports services *from*
 * the software and never writes anything back to it. Bookings do not go here
 * — they go to WhatsApp.
 *
 * Environment variables (both optional):
 *   SALON_CENTRAL_URL  origin of the Salon Central deployment
 *   SALON_ID           the salon's id — the `?salon=` value in the "Online
 *                      Booking" link inside the Salon Central sidebar. Not a
 *                      secret (it is in that public URL already), so it falls
 *                      back to Lounge 8's own id when unset.
 */

const SALON_CENTRAL = 'https://app.saloncentral.xyz'
const LOUNGE8_SALON_ID = 'user_1782912586384_qfkvcow'

export const salonConfig = () => ({
  origin: (process.env.SALON_CENTRAL_URL || SALON_CENTRAL).replace(/\/+$/, ''),
  salonId: process.env.SALON_ID || LOUNGE8_SALON_ID,
})

/**
 * The salon's service catalogue.
 *
 * The upstream response also carries staff records and the salon's own
 * appointment book — customer names, phone numbers, and what they paid. None
 * of that is read, stored, or returned here; only `services` is taken.
 */
export async function fetchSalonServices() {
  const { origin, salonId } = salonConfig()
  const url = `${origin}/api/public/salon?salonId=${encodeURIComponent(salonId)}`

  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) {
    throw new Error(`Salon Central returned ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.error || 'Salon Central rejected the request')
  }

  return Array.isArray(data.services) ? data.services : []
}
