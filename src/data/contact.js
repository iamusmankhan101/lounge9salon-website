/**
 * The salon's own details, in one place — they appear in the footer, the
 * booking panel, the services page, and inside every WhatsApp booking message,
 * and those must never disagree.
 *
 * WHATSAPP is the same line as PHONE in international format with no "+" and
 * no spaces, which is the only shape wa.me accepts — every booking opens a
 * chat with it, so the three must be kept in step.
 *
 * There is deliberately no email here. The one that used to sit in this file
 * was a placeholder that was never a real inbox, and it was published in the
 * booking panel. Add one back only when it is an address someone reads.
 */

export const PHONE = '+92 300 808 5211'
export const PHONE_HREF = 'tel:+923008085211'
export const WHATSAPP = '923008085211'

/** Opens a chat with the salon, no booking attached — the hero's second CTA. */
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP}`

/** Written as it is read aloud, one line per line of the address. */
export const ADDRESS_LINES = [
  '299/1, Street 90, K Block',
  'Phase 1, DHA, Lahore',
]

export const ADDRESS = ADDRESS_LINES.join(', ')

/**
 * Sends people to the address as typed rather than to a pinned place, so it
 * cannot point somewhere the salon is not. Swap for the salon's own Google
 * Business listing link once it has one.
 */
export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ADDRESS}, Pakistan`,
)}`

export const CONTACT = [
  { label: 'Phone', value: PHONE, href: PHONE_HREF },
  { label: 'Address', value: ADDRESS },
]
