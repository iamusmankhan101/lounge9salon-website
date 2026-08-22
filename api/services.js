/**
 * GET /api/services
 *
 * The public service menu — the active rows of the services table, as entered
 * in the admin panel. Read server-side so the Supabase service-role key never
 * reaches the browser.
 */

import { config, listServices, toService } from './_store.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!config().ready) {
    console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set')
    return res.status(503).json({ error: 'The menu is not configured yet.' })
  }

  try {
    const rows = await listServices({ activeOnly: true })

    // the menu changes rarely; let the edge hold it briefly
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ services: rows.map(toService) })
  } catch (error) {
    console.error('Could not load services', error)
    return res.status(502).json({ error: 'Could not load services.' })
  }
}
