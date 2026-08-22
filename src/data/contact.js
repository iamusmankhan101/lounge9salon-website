/**
 * The salon's own details, in one place — they appear in the footer, the
 * booking panel, the services page, and inside every WhatsApp booking message,
 * and those must never disagree.
 *
 * TODO: replace the placeholder number and address with the real ones. WHATSAPP
 * is the same line in international format with no "+" or spaces, which is the
 * only shape wa.me accepts.
 */

export const PHONE = '+92 300 000 0000'
export const PHONE_HREF = 'tel:+923000000000'
export const WHATSAPP = '923000000000'
export const EMAIL = 'hello@lounge8.com'
export const ADDRESS = 'Lahore, Pakistan'

export const CONTACT = [
  { label: 'Phone', value: PHONE, href: PHONE_HREF },
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'Address', value: ADDRESS },
]
