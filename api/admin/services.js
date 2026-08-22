/**
 * /api/admin/services — the service menu, as the admin panel edits it.
 *
 *   GET                every service, active or not
 *   POST               add one
 *   PATCH ?id=…        change one
 *   DELETE ?id=…       remove one
 *
 * Every method is behind the admin session cookie.
 */

import {
  config,
  createService,
  deleteService,
  listServices,
  readBody,
  requireSession,
  toService,
  updateService,
  validateService,
} from '../_store.js'

export default async function handler(req, res) {
  if (!config().ready) {
    console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set')
    return res.status(503).json({ error: 'Supabase is not configured yet.' })
  }
  if (!requireSession(req, res)) return

  const id = req.query?.id

  try {
    if (req.method === 'GET') {
      const rows = await listServices()
      return res.status(200).json({ services: rows.map(toService) })
    }

    if (req.method === 'POST') {
      const body = readBody(req)
      if (!body) return res.status(400).json({ error: 'Malformed request.' })

      const { fields, error } = validateService(body)
      if (error) return res.status(400).json({ error })

      const row = await createService(fields)
      return res.status(201).json({ service: toService(row) })
    }

    if (req.method === 'PATCH') {
      if (!id) return res.status(400).json({ error: 'Which service?' })

      const body = readBody(req)
      if (!body) return res.status(400).json({ error: 'Malformed request.' })

      const { fields, error } = validateService(body, { partial: true })
      if (error) return res.status(400).json({ error })
      if (!Object.keys(fields).length) {
        return res.status(400).json({ error: 'Nothing to change.' })
      }

      const row = await updateService(id, fields)
      if (!row) return res.status(404).json({ error: 'No such service.' })
      return res.status(200).json({ service: toService(row) })
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Which service?' })
      await deleteService(id)
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    console.error(`Admin ${req.method} failed`, error)
    return res.status(502).json({ error: 'Supabase did not accept that.' })
  }
}
