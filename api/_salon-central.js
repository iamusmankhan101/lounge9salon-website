/**
 * Shared plumbing for talking to Salon Central (the salon's own booking
 * software). Files prefixed with "_" are not routed by Vercel.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   SALON_CENTRAL_URL  origin of the Salon Central deployment,
 *                      e.g. https://salon-central.vercel.app
 *   SALON_ID           the salon's id — the `?salon=` value in the "Online
 *                      Booking" link inside the Salon Central sidebar. Not a
 *                      secret (it is in that public URL already), so it falls
 *                      back to Lounge8's own id when unset.
 */

const SALON_CENTRAL = 'https://app.saloncentral.xyz'
const LOUNGE8_SALON_ID = 'user_1782912586384_qfkvcow'

export const config = () => {
  const origin = (process.env.SALON_CENTRAL_URL || SALON_CENTRAL).replace(
    /\/+$/,
    '',
  )
  const salonId = process.env.SALON_ID || LOUNGE8_SALON_ID
  return { origin, salonId, ready: Boolean(origin && salonId) }
}

/** Loads the salon's public services, staff, and settings. */
export async function fetchSalon(origin, salonId) {
  const url = `${origin}/api/public/salon?salonId=${encodeURIComponent(salonId)}`
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) })

  if (!response.ok) {
    throw new Error(`Salon Central returned ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.error || 'Salon Central rejected the request')
  }
  return data
}

/**
 * Mirrors normalizePhone() in Salon Central so a client booking from the
 * website is matched against the same record they already have in the CRM
 * rather than being created a second time.
 */
export function normalizePhone(raw, countryCode = '92') {
  let digits = String(raw || '').replace(/\D/g, '')
  if (digits.startsWith('0')) digits = countryCode + digits.slice(1)
  else if (digits.length === 10 && digits.startsWith('3')) {
    digits = countryCode + digits
  }
  return digits
}

/** "14:30" + 45 → "15:15", clamped to the end of the day. */
export function addMinutes(time, mins) {
  const [h, m] = String(time).split(':').map(Number)
  const total = Math.min(h * 60 + m + mins, 23 * 60 + 59)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
    total % 60,
  ).padStart(2, '0')}`
}
