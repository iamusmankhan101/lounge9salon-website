/**
 * The salon's own details, in one place — they appear in the footer, the
 * booking panel, the services page, and inside every WhatsApp booking message,
 * and those must never disagree.
 *
 * WHATSAPP is the same line as PHONE in international format with no "+" and
 * no spaces, which is the only shape wa.me accepts — every booking opens a
 * chat with it, so the three must be kept in step.
 *
 * TODO: EMAIL and ADDRESS are still placeholders.
 */

export const PHONE = '+92 300 808 5211'
export const PHONE_HREF = 'tel:+923008085211'
export const WHATSAPP = '923008085211'
export const EMAIL = 'hello@lounge8.com'
export const ADDRESS = 'Lahore, Pakistan'

export const CONTACT = [
  { label: 'Phone', value: PHONE, href: PHONE_HREF },
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'Address', value: ADDRESS },
]
