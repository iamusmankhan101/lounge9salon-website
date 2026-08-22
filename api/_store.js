/**
 * Shared plumbing for the service menu: Supabase access and the admin session.
 * Files prefixed with "_" are not routed by Vercel.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   SUPABASE_URL               project URL, e.g. https://abcd.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  service-role key — server-side only, never
 *                              expose it to the browser or prefix it VITE_
 *   ADMIN_PASSWORD             the password for /admin
 */

import { createHmac, timingSafeEqual } from 'node:crypto'

const TABLE = 'services'
const SESSION_COOKIE = 'l8_admin'
const SESSION_HOURS = 12

/**
 * Categories a service can be filed under. Mirrors CATEGORY_META in
 * src/data/services.js — the website and the API are separate bundles, so the
 * list cannot be imported across; adding a category means editing both.
 */
export const CATEGORIES = [
  'hair',
  'skin',
  'nails',
  'waxing',
  'massage',
  'bridal',
  'piercing',
]

export const config = () => {
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const password = process.env.ADMIN_PASSWORD || ''
  return { url, key, password, ready: Boolean(url && key) }
}

/* ------------------------------------------------------------------ *
 * Supabase (PostgREST)
 * ------------------------------------------------------------------ */

/**
 * One call against the services table. `query` is the PostgREST query string,
 * `body` turns it into a write. Returns the rows the request asked for.
 */
async function rest(path, { method = 'GET', body, headers } = {}) {
  const { url, key } = config()

  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Supabase ${response.status}: ${detail.slice(0, 300)}`)
  }

  // DELETE and other no-content replies have nothing to parse
  return response.status === 204 ? [] : response.json().catch(() => [])
}

/** The menu in display order. `activeOnly` is what the public site reads. */
export function listServices({ activeOnly = false } = {}) {
  const filter = activeOnly ? '&is_active=eq.true' : ''
  return rest(
    `${TABLE}?select=*${filter}&order=category.asc,sort_order.asc,price.desc`,
  )
}

export async function createService(fields) {
  const [row] = await rest(TABLE, {
    method: 'POST',
    body: fields,
    headers: { Prefer: 'return=representation' },
  })
  return row
}

export async function updateService(id, fields) {
  const [row] = await rest(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: fields,
    headers: { Prefer: 'return=representation' },
  })
  return row
}

export function deleteService(id) {
  return rest(`${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
}

/**
 * Adds a batch of imported services in one round trip. A service already
 * imported is left exactly as it is — source_id is unique, and telling
 * PostgREST to ignore the clash means a second import adds only what is new
 * and never overwrites an edit the salon has since made by hand.
 */
export function importServices(rows) {
  if (!rows.length) return Promise.resolve([])
  return rest(`${TABLE}?on_conflict=source_id`, {
    method: 'POST',
    body: rows,
    headers: { Prefer: 'return=representation,resolution=ignore-duplicates' },
  })
}

/** Database snake_case → the camelCase shape the website already speaks. */
export const toService = (row) => ({
  id: row.id,
  sourceId: row.source_id || null,
  name: row.name,
  category: row.category,
  price: Number(row.price) || 0,
  durationMin: Number(row.duration_min) || 60,
  summary: row.summary || '',
  variablePrice: Boolean(row.from_price),
  isActive: Boolean(row.is_active),
  sortOrder: Number(row.sort_order) || 0,
})

/* ------------------------------------------------------------------ *
 * Admin session
 * ------------------------------------------------------------------ */

const sign = (value, secret) =>
  createHmac('sha256', secret).update(String(value)).digest('hex')

/** Compares without leaking, through length differences, how much matched. */
function sameSecret(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export const passwordMatches = (attempt) => {
  const { password } = config()
  return Boolean(password) && sameSecret(attempt, password)
}

/**
 * A session is its own expiry plus an HMAC of it, keyed by the password —
 * so changing ADMIN_PASSWORD signs every open session out, which is the point
 * of changing it. Nothing is stored server-side.
 */
export function issueSession() {
  const { password } = config()
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000
  const token = `${expires}.${sign(expires, password)}`

  return [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
    `Max-Age=${SESSION_HOURS * 60 * 60}`,
  ].join('; ')
}

export const clearSession = () =>
  `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`

export function hasSession(req) {
  const { password } = config()
  if (!password) return false

  const raw = req.headers.cookie || ''
  const token = raw
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1)

  if (!token) return false

  const [expires, signature] = token.split('.')
  if (!expires || !signature) return false
  if (Number(expires) < Date.now()) return false

  return sameSecret(signature, sign(expires, password))
}

/** Answers the request itself when the caller is not signed in. */
export function requireSession(req, res) {
  if (hasSession(req)) return true
  res.status(401).json({ error: 'Please sign in again.' })
  return false
}

/* ------------------------------------------------------------------ *
 * Request helpers
 * ------------------------------------------------------------------ */

export function readBody(req) {
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return null
    }
  }
  return body && typeof body === 'object' ? body : null
}

const MAX_LENGTH = 500
const clean = (value) =>
  typeof value === 'string' ? value.trim().slice(0, MAX_LENGTH) : ''

/**
 * Validates one service from the admin form. `partial` keeps an edit to just
 * the fields it sent. Returns { fields } or { error } fit to show the admin.
 */
export function validateService(body, { partial = false } = {}) {
  const fields = {}
  const given = (name) => body[name] !== undefined

  if (!partial || given('name')) {
    const name = clean(body.name)
    if (!name) return { error: 'A service needs a name.' }
    fields.name = name
  }

  if (!partial || given('category')) {
    const category = clean(body.category).toLowerCase()
    if (!CATEGORIES.includes(category)) {
      return { error: `Category must be one of: ${CATEGORIES.join(', ')}.` }
    }
    fields.category = category
  }

  if (!partial || given('price')) {
    const price = Math.round(Number(body.price))
    if (!Number.isFinite(price) || price < 0) {
      return { error: 'Price must be a number, in whole rupees.' }
    }
    fields.price = price
  }

  if (!partial || given('durationMin')) {
    const duration = Math.round(Number(body.durationMin))
    if (!Number.isFinite(duration) || duration < 5 || duration > 600) {
      return { error: 'Duration must be between 5 and 600 minutes.' }
    }
    fields.duration_min = duration
  }

  if (given('summary')) fields.summary = clean(body.summary) || null
  if (given('variablePrice')) fields.from_price = Boolean(body.variablePrice)
  if (given('isActive')) fields.is_active = Boolean(body.isActive)
  if (given('sortOrder')) {
    const order = Math.round(Number(body.sortOrder))
    fields.sort_order = Number.isFinite(order) ? order : 0
  }

  return { fields }
}
