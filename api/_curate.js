/**
 * Turning Salon Central's catalogue into services fit for a public menu.
 *
 * That catalogue is an internal working list: alongside the real treatments it
 * holds one-off deals arranged for named clients, till-only scratch entries,
 * and typos that were never meant for customers. This is the filter between
 * the two — what to leave behind, what to rename, and which of the website's
 * categories each treatment belongs in.
 *
 * It runs once, when a service is imported. After that the service is the
 * salon's own to edit in the admin panel, and nothing here touches it again.
 */

/**
 * Whole categories never imported. "package" is every bespoke deal arranged
 * for a named client ("Rabia pkg", "Khala Naheeda"), so importing it would put
 * customers' names and their bills on a public page.
 */
const HIDDEN_CATEGORIES = ['package']

/** Individual entries that exist for the till, not for customers. */
const HIDDEN_SERVICES = [
  'test',
  'meeting with ashan j',
  'pay back amount',
  'roots application',
  'shampoo + conditioner',
]

/** Anything named like a personal package, wherever it is filed. */
const PRIVATE_NAME = /\bpkg\b|\bpackage\b|\(\s*mother in law\s*\)/i

/** Corrections for names that would look careless on a public menu. */
const RENAMED = {
  'hyaluronic aciad facial': 'Hyaluronic Acid Facial',
  'nail failing': 'Nail Filing',
  'parafin manicure & pedicure': 'Paraffin Manicure & Pedicure',
  'grey steark': 'Grey Streak',
  'protein treament': 'Protein Treatment',
  'nail extention refill': 'Nail Extension Refill',
  'nail coloru application': 'Nail Colour Application',
  'nail removel': 'Nail Removal',
  'ombre"': 'Ombré',
  'simple mani & pedi': 'Simple Manicure & Pedicure',
  'whitening manicure &  pediure': 'Whitening Manicure & Pedicure',
  'boy hair cut (0-13 year old )': "Boys' Haircut (ages 0–13)",
  'full dye application ( only application) dye will be from client':
    'Full Dye Application (client’s own dye)',
  'roots application ( dye will be from client)':
    'Roots Application (client’s own dye)',
  'funky colour ( streak & chunk )': 'Funky Colour (Streaks & Chunks)',
  'with our bleach red balayage': 'Red Balayage',
  'full body waxing (sugar wax )': 'Full Body Waxing (Sugar Wax)',
  'full body waxing ( honey wax)': 'Full Body Waxing (Honey Wax)',
  'living serum': 'Living Serum',
}

/**
 * The software files manicures, massages, and waxing all under "skin", so the
 * public menu re-sorts by treatment name first and only falls back to the
 * software's own category. First match wins.
 */
const ROUTES = [
  { id: 'nails', test: /nail|mani|pedi|french|acrylic|gel|polygel/i },
  { id: 'waxing', test: /wax|thread/i },
  { id: 'skin', test: /facial|face polisher|cleansing|back treatment/i },
  { id: 'massage', test: /massage|body polish|polisher|scrub|spa\b/i },
  { id: 'bridal', test: /bridal|party makeup|makeup/i },
  { id: 'skin', test: /skin/i },
]

/** How the software's own categories map when no name rule matches. */
const FALLBACK_CATEGORY = {
  skin: 'skin',
  hair: 'hair',
  nails: 'nails',
  piercing: 'piercing',
  bridal: 'bridal',
}

const key = (name) => String(name || '').trim().toLowerCase().replace(/\s+/g, ' ')

const MINOR_WORD = /^(with|by|and|or|of|the|for|in|on|only|a)$/i

const titleCase = (name) =>
  name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word, i) =>
      i > 0 && MINOR_WORD.test(word)
        ? word.toLowerCase()
        : word.replace(/^[a-z]/, (letter) => letter.toUpperCase()),
    )
    .join(' ')

/** RENAMED is written by hand, so its keys go through the same normaliser. */
const RENAMES = new Map(
  Object.entries(RENAMED).map(([from, to]) => [key(from), to]),
)

/** Why a service was left behind, in words the admin panel can show. */
function skipReason(service) {
  if (HIDDEN_CATEGORIES.includes(service.category)) {
    return 'a client package — names a customer'
  }
  if (PRIVATE_NAME.test(service.name || '')) {
    return 'named like a personal package'
  }
  if (HIDDEN_SERVICES.includes(key(service.name))) return 'a till-only entry'
  if (!service.isActive) return 'retired in the software'
  if (!(Number(service.price) > 0)) return 'has no price'
  return null
}

const categoryFor = (service) =>
  ROUTES.find((route) => route.test.test(service.name))?.id ??
  FALLBACK_CATEGORY[service.category] ??
  'skin'

/**
 * Splits the software's catalogue into what the website can publish and what
 * it cannot. Returns rows shaped for the services table, each carrying the
 * Salon Central id it came from so a later import can tell it is already in.
 */
export function curate(catalogue = []) {
  const importable = []
  const skipped = []
  const seenOrder = new Map()

  for (const service of catalogue) {
    const reason = skipReason(service)
    if (reason) {
      skipped.push({ name: service.name, reason })
      continue
    }

    const category = categoryFor(service)
    const order = seenOrder.get(category) ?? 0
    seenOrder.set(category, order + 1)

    importable.push({
      source_id: String(service.id),
      name: RENAMES.get(key(service.name)) ?? titleCase(service.name),
      category,
      price: Math.round(Number(service.price)) || 0,
      duration_min: Math.round(Number(service.durationMin)) || 60,
      summary: service.description?.trim() || null,
      from_price: Boolean(service.variablePrice),
      is_active: true,
      sort_order: order,
    })
  }

  return { importable, skipped }
}
