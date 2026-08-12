import {
  HourglassIcon,
  RingIcon,
  SparkIcon,
  WaveIcon,
} from '../components/icons.jsx'

/**
 * The public service menu is built from the salon's live Salon Central
 * catalogue rather than a hand-kept copy, so prices and treatments on the
 * website can never drift from the till.
 *
 * That catalogue is an internal working list, though — it also holds one-off
 * client packages, POS scratch entries, and typos that were never meant for
 * customers. Everything below is the thin editorial layer between the two:
 * what to hide, what to rename, and the photography and copy the software has
 * no concept of.
 */

/* ------------------------------------------------------------------ *
 * Curation — the only part that needs editing by hand
 * ------------------------------------------------------------------ */

/**
 * Whole categories kept off the website. "package" is every bespoke deal
 * arranged for a named client ("Rabia pkg", "Khala Naheeda"), so publishing it
 * would put customers' names and their bills on a public page.
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

/* ------------------------------------------------------------------ *
 * Presentation — photography and copy the software does not hold
 * ------------------------------------------------------------------ */

const CATEGORY_META = {
  skin: {
    name: 'Skin & Facials',
    Icon: WaveIcon,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1400&auto=format&fit=crop',
    blurb:
      'A considered facial, tailored to your skin on the day rather than to a fixed menu.',
    description: [
      'Inspired by nature, light, and the soft rhythm of self-care, our skin treatments are designed to restore balance, nourish deeply, and reveal your natural radiance.',
      'Whether you seek a glow before a big event or long-term skin health, each treatment is performed with intention and care.',
    ],
  },
  hair: {
    name: 'Hair',
    Icon: SparkIcon,
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1521783593447-5702b9bfd267?q=80&w=1400&auto=format&fit=crop',
    blurb:
      'Cut, colour, and treatment work by stylists who plan around the hair you actually have.',
    description: [
      'From a precise trim to full balayage, our colour and cutting work starts with a proper consultation — what your hair can hold, and what you will realistically maintain at home.',
      'Colour services are quoted from a starting price, as length and density change the work involved.',
    ],
  },
  nails: {
    name: 'Nails, Mani & Pedi',
    Icon: RingIcon,
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1400&auto=format&fit=crop',
    blurb:
      'Hands and feet, from a simple file and polish to full extensions and art.',
    description: [
      'Manicures, pedicures, gel, acrylic, and nail art — finished properly, with the prep and cuticle work that makes the difference between a set that lasts a week and one that lasts three.',
      'Tools are sterilised between every client, without exception.',
    ],
  },
  waxing: {
    name: 'Waxing & Threading',
    Icon: HourglassIcon,
    image:
      'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1400&auto=format&fit=crop',
    blurb: 'Sugar wax, honey wax, and threading — quick, clean, and unhurried.',
    description: [
      'Sugar and honey wax for the body, threading for the face and brows. Both are done in a private room at a pace that does not rush you.',
      'Full-body pricing varies with coverage, so treat listed prices as a starting point.',
    ],
  },
  massage: {
    name: 'Massage & Body',
    Icon: WaveIcon,
    image:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=1400&auto=format&fit=crop',
    blurb:
      'Pressure, oil, and quiet — the part of the visit that is purely for you.',
    description: [
      'Back, leg, and full-body work, with or without scrubbing and polishing. Tell your therapist where you hold tension and how firm you like it; they will work to that.',
      'Our spa and body treatments pair well with a facial if you would rather make an afternoon of it.',
    ],
  },
  piercing: {
    name: 'Piercing',
    Icon: RingIcon,
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1400&auto=format&fit=crop',
    blurb: 'Ear piercing, done cleanly, with proper aftercare advice.',
    description: [
      'Sterile, single-use equipment and clear aftercare instructions before you leave.',
      'We will talk you through placement and healing time before anything happens.',
    ],
  },
  bridal: {
    name: 'Bridal & Party',
    Icon: SparkIcon,
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1400&auto=format&fit=crop',
    blurb: 'Makeup for the days that get photographed.',
    description: [
      'Party and event makeup built to hold through a long night and to photograph the way it looks in the mirror.',
      'Bridal work is quoted individually — talk to us and we will plan the day around you.',
    ],
  },
}

const ORDER = [
  'hair',
  'skin',
  'nails',
  'waxing',
  'massage',
  'bridal',
  'piercing',
]

/* ------------------------------------------------------------------ *
 * Building the menu
 * ------------------------------------------------------------------ */

const key = (name) => name.trim().toLowerCase().replace(/\s+/g, ' ')

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

const isPublic = (service) =>
  !HIDDEN_CATEGORIES.includes(service.category) &&
  !HIDDEN_SERVICES.includes(key(service.name)) &&
  !PRIVATE_NAME.test(service.name) &&
  service.price > 0

const categoryFor = (service) =>
  ROUTES.find((route) => route.test.test(service.name))?.id ??
  FALLBACK_CATEGORY[service.category] ??
  'skin'

/**
 * Turns the live catalogue into the tabs the services section renders.
 * Same-named services priced differently (four "Blowdry" tiers, say) collapse
 * into one entry quoted from the lowest price.
 */
export function buildCatalog(services = []) {
  const byCategory = new Map()

  for (const service of services) {
    if (!isPublic(service)) continue

    const id = categoryFor(service)
    if (!byCategory.has(id)) byCategory.set(id, new Map())
    const treatments = byCategory.get(id)

    const name = RENAMES.get(key(service.name)) ?? titleCase(service.name)
    const existing = treatments.get(key(name))

    if (existing) {
      // a second price for the same treatment means it is a "from" price
      existing.from = true
      if (service.price < existing.price) existing.price = service.price
      continue
    }

    treatments.set(key(name), {
      id: service.id,
      name,
      price: service.price,
      from: Boolean(service.variablePrice),
      durationMin: service.durationMin,
      duration: `${service.durationMin}min`,
    })
  }

  const categories = ORDER.filter((id) => byCategory.get(id)?.size).map((id) => {
    const meta = CATEGORY_META[id]
    const treatments = [...byCategory.get(id).values()].sort(
      (a, b) => b.price - a.price,
    )

    return {
      ...meta,
      id,
      count: treatments.length,
      treatments: treatments.map((treatment) => ({
        ...treatment,
        summary: meta.blurb,
        images: [meta.listImage, meta.image],
      })),
    }
  })

  const all = {
    id: 'all',
    name: 'All Services',
    label: 'All',
    Icon: RingIcon,
    count: categories.reduce((sum, category) => sum + category.count, 0),
    listImage: categories[0]?.listImage,
    description: [
      'Every treatment we offer across hair, skin, nails, and body — priced exactly as it is at the till, straight from our booking system.',
      'Not sure what you need? Book a consultation and we will shape a plan around your hair and skin rather than sell you a package.',
    ],
    treatments: categories.flatMap((category) => category.treatments),
  }

  return { categories, tabs: [all, ...categories] }
}

/** Prices are in Pakistani rupees, e.g. "PKR 4,000" or "from PKR 1,200". */
export function formatPrice({ price, from }) {
  return `${from ? 'from ' : ''}PKR ${price.toLocaleString('en-US')}`
}
