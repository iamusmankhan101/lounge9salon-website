/**
 * /api/admin/import — pulling the salon's existing catalogue out of Salon
 * Central and into the website's own menu.
 *
 *   GET   what the software holds, and what an import would do
 *   POST  bring in everything not already here
 *
 * Import is additive and one-directional. A service already imported is left
 * alone — including any edit the salon has made to it since — so this can be
 * run whenever the software gains something new, without undoing work.
 */

import { curate } from '../_curate.js'
import { fetchSalonServices, salonConfig } from '../_salon-central.js'
import {
  config,
  importServices,
  listServices,
  requireSession,
  toService,
} from '../_store.js'

/** What the software offers, against what the menu already has. */
async function survey() {
  const [catalogue, existing] = await Promise.all([
    fetchSalonServices(),
    listServices(),
  ])

  const alreadyIn = new Set(
    existing.map((row) => row.source_id).filter(Boolean),
  )
  const { importable, skipped } = curate(catalogue)

  return {
    catalogue,
    skipped,
    fresh: importable.filter((row) => !alreadyIn.has(row.source_id)),
    alreadyIn: importable.filter((row) => alreadyIn.has(row.source_id)).length,
  }
}

export default async function handler(req, res) {
  if (!config().ready) {
    console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set')
    return res.status(503).json({ error: 'Supabase is not configured yet.' })
  }
  if (!requireSession(req, res)) return

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const { catalogue, skipped, fresh, alreadyIn } = await survey()

    if (req.method === 'GET') {
      return res.status(200).json({
        source: salonConfig().origin,
        found: catalogue.length,
        alreadyIn,
        skipped,
        // the panel lists these so staff see what they are about to publish
        pending: fresh.map(toService),
      })
    }

    const added = await importServices(fresh)
    return res.status(200).json({
      added: added.length,
      skipped: skipped.length,
      services: added.map(toService),
    })
  } catch (error) {
    console.error('Import from Salon Central failed', error)
    return res
      .status(502)
      .json({ error: 'Could not reach Salon Central. Please try again.' })
  }
}
