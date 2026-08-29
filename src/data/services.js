import {
  HourglassIcon,
  RingIcon,
  SparkIcon,
  WaveIcon,
} from '../components/icons.jsx'

/**
 * The public service menu.
 *
 * Treatments, prices, and durations are entered by staff in the admin panel at
 * /admin and read live from /api/services — this file holds only what the
 * admin panel has no concept of: the photography, the icons, and the copy that
 * introduces each category.
 */

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
    image: '/gallery/2V3A4606ARP.jpg',
    listImage: '/gallery/2V3A4606ARP.jpg',
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

/** Display order of the category tabs, and the fallback for an odd category. */
const ORDER = [
  'hair',
  'skin',
  'nails',
  'waxing',
  'massage',
  'bridal',
  'piercing',
]

/**
 * The categories the admin panel offers. Mirrored by CATEGORIES in
 * api/_store.js, which validates what the panel sends.
 */
export const CATEGORY_OPTIONS = ORDER.map((id) => ({
  id,
  name: CATEGORY_META[id].name,
}))

export const categoryName = (id) => CATEGORY_META[id]?.name ?? id

/**
 * Turns the live menu into the categories the services surfaces render. The
 * API already returns services in display order, which is preserved here.
 */
export function buildCatalog(services = []) {
  const byCategory = new Map()

  for (const service of services) {
    const id = CATEGORY_META[service.category] ? service.category : 'skin'
    if (!byCategory.has(id)) byCategory.set(id, [])

    const meta = CATEGORY_META[id]
    byCategory.get(id).push({
      id: service.id,
      name: service.name,
      price: service.price,
      from: Boolean(service.variablePrice),
      durationMin: service.durationMin,
      duration: `${service.durationMin}min`,
      summary: service.summary || meta.blurb,
      // the category blurb reads as filler when it repeats down a menu, so
      // lists show a line only where the service carries its own
      ownSummary: service.summary || '',
      images: [meta.listImage, meta.image],
    })
  }

  const categories = ORDER.filter((id) => byCategory.get(id)?.length).map(
    (id) => {
      const treatments = byCategory.get(id)
      return {
        ...CATEGORY_META[id],
        id,
        count: treatments.length,
        treatments,
      }
    },
  )

  const all = {
    id: 'all',
    name: 'All Services',
    label: 'All',
    Icon: RingIcon,
    count: categories.reduce((sum, category) => sum + category.count, 0),
    listImage: categories[0]?.listImage,
    description: [
      'Every treatment we offer across hair, skin, nails, and body — priced exactly as it is at the till.',
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
