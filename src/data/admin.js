/**
 * The admin panel's side of /api/admin — signing in, and the four things it
 * does to the service menu.
 *
 * The session lives in an httpOnly cookie, so nothing here handles a token:
 * every call simply carries the cookie, and a 401 means "sign in again",
 * which the panel turns back into its login screen.
 */

/** A rejection the panel answers by showing the login screen again. */
export class SignedOutError extends Error {
  constructor() {
    super('Your session has expired. Please sign in again.')
    this.name = 'SignedOutError'
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    ...(body && { body: JSON.stringify(body) }),
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 401) throw new SignedOutError()
  if (!response.ok) throw new Error(data.error || 'That did not work.')

  return data
}

/* ---------- session ---------- */

export const checkSession = () =>
  request('/api/admin/session')
    .then((data) => Boolean(data.signedIn))
    .catch(() => false)

export const signIn = (password) =>
  fetch('/api/admin/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || 'That did not work.')
    return true
  })

export const signOut = () =>
  request('/api/admin/session', { method: 'DELETE' }).catch(() => {})

/* ---------- the menu ---------- */

/** Every service, inactive ones included — this is the editing view. */
export const fetchServices = () =>
  request('/api/admin/services').then((data) => data.services || [])

/** Adds a service, or saves an existing one when it already has an id. */
export function saveService({ id, ...fields }) {
  return id
    ? request(`/api/admin/services?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: fields,
      }).then((data) => data.service)
    : request('/api/admin/services', { method: 'POST', body: fields }).then(
        (data) => data.service,
      )
}

export const removeService = (id) =>
  request(`/api/admin/services?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

/* ---------- importing from Salon Central ---------- */

/** What the salon software holds, and what importing it would bring in. */
export const previewImport = () => request('/api/admin/import')

/** Brings in every service not already on the menu. */
export const runImport = () => request('/api/admin/import', { method: 'POST' })
