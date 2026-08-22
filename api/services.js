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

    // The edge holds the menu briefly so a burst of visitors is one query,
    // but never longer than the admin panel promises: a price changed here is
    // on the website within a minute, worst case (30s fresh + 30s stale).
    // stale-while-revalidate is what makes the window long, not s-maxage —
    // keep the two in step with that promise if either is ever changed.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=30')
    return res.status(200).json({ services: rows.map(toService) })
  } catch (error) {
    console.error('Could not load services', error)
    return res.status(502).json({ error: 'Could not load services.' })
  }
}
