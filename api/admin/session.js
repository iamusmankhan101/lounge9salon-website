/**
 * /api/admin/session — the admin panel's sign-in.
 *
 *   GET     is this browser signed in?
 *   POST    { password } → sets the session cookie
 *   DELETE  signs out
 *
 * The cookie is httpOnly, so the panel can only ever ask *whether* it is
 * signed in; it never handles the token itself.
 */

import {
  clearSession,
  config,
  hasSession,
  issueSession,
  passwordMatches,
  readBody,
} from '../_store.js'

// a wrong password costs a moment, which makes guessing at scale impractical
const PENALTY_MS = 400
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ signedIn: hasSession(req) })
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearSession())
    return res.status(200).json({ signedIn: false })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!config().password) {
    console.error('ADMIN_PASSWORD is not set')
    return res.status(503).json({ error: 'The admin panel is not set up yet.' })
  }

  const body = readBody(req)
  if (!body) return res.status(400).json({ error: 'Malformed request.' })

  if (!passwordMatches(body.password)) {
    await pause(PENALTY_MS)
    return res.status(401).json({ error: 'That password is not right.' })
  }

  res.setHeader('Set-Cookie', issueSession())
  return res.status(200).json({ signedIn: true })
}
