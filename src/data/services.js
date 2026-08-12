import {
  HourglassIcon,
  RingIcon,
  SparkIcon,
  WaveIcon,
} from '../components/icons.jsx'

const RAW_CATEGORIES = [
  {
    id: 'skin',
    name: 'Skin Care',
    count: 24,
    Icon: WaveIcon,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1400&auto=format&fit=crop',
    description: [
      'Inspired by nature, light, and the soft rhythm of self-care, our skin treatments are designed to restore balance, nourish deeply, and reveal your natural radiance.',
      'Whether you seek a glow before a big event or long-term skin health, each treatment is performed with intention and care.',
    ],
    treatments: [
      {
        name: 'The Really Good Facial',
        price: 140,
        duration: '60min',
        rating: 4.9,
        summary:
          'The 60-minute personalized facial that transforms your skin and renews your confidence.',
        idealFor: 'Monthly maintenance and promoting overall skin health',
        steps: [
          {
            name: 'Double Cleanse',
            text: 'Removes makeup, sweat, and dirt, leaving your skin fresh and ready for treatment.',
          },
          {
            name: 'Skin Analysis',
            text: 'Your therapist reads your skin under magnification to shape the rest of the session.',
          },
          {
            name: 'Customized Treatments',
            text: 'The most effective products and techniques are used to address your unique skin concerns.',
          },
        ],
      },
      {
        name: 'Dermaplaning',
        price: 120,
        duration: '60min',
        rating: 4.8,
        summary:
          'Removes dead skin and peach fuzz for a soft, smooth, radiant finish.',
        idealFor: 'Dull texture, peach fuzz, and flawless makeup application',
        steps: [
          {
            name: 'Prep Cleanse',
            text: 'Skin is cleansed and dried completely so the blade glides safely.',
          },
          {
            name: 'Blade Exfoliation',
            text: 'A sterile blade lifts away dead cells and fine vellus hair at a precise angle.',
          },
          {
            name: 'Soothing Mask',
            text: 'A calming mask settles the skin and locks in immediate softness.',
          },
        ],
      },
      {
        name: 'Enzyme Exfoliation',
        price: 110,
        duration: '45min',
        rating: 4.7,
        summary:
          'Manual pore cleansing to remove blackheads, congestion, and impurities.',
        idealFor: 'Congested pores, blackheads, and uneven texture',
        steps: [
          {
            name: 'Warm Steam',
            text: 'Gentle steam softens the surface and opens pores for easier release.',
          },
          {
            name: 'Enzyme Peel',
            text: 'Fruit enzymes dissolve the bonds holding dead skin in place.',
          },
          {
            name: 'Manual Extraction',
            text: 'Careful, controlled extraction clears congestion without trauma.',
          },
        ],
      },
      {
        name: 'High Frequency',
        price: 90,
        duration: '30min',
        rating: 4.8,
        summary:
          'Calms acne, boosts healing, and improves circulation using gentle electrical currents.',
        idealFor: 'Active breakouts and post-blemish healing',
        steps: [
          {
            name: 'Targeted Cleanse',
            text: 'Affected areas are cleared and prepared without stripping the barrier.',
          },
          {
            name: 'High-Frequency Pass',
            text: 'A glass electrode delivers current that reduces bacteria and speeds healing.',
          },
          {
            name: 'Calming Serum',
            text: 'Anti-inflammatory serum settles redness before you leave.',
          },
        ],
      },
      {
        name: 'PureLift Technology',
        price: 160,
        duration: '60min',
        rating: 4.9,
        summary:
          'Microcurrent lifts and tones facial muscles for firmer, younger-looking skin.',
        idealFor: 'Loss of firmness along the jawline and cheekbones',
        steps: [
          {
            name: 'Conductive Prep',
            text: 'A conductive gel is applied so current reaches the muscle evenly.',
          },
          {
            name: 'Microcurrent Lift',
            text: 'Low-level current re-educates facial muscles for visible lift.',
          },
          {
            name: 'Cooling Finish',
            text: 'Chilled globes set the result and reduce any residual warmth.',
          },
        ],
      },
      {
        name: 'Cryo Globe Massage',
        price: 95,
        duration: '30min',
        rating: 4.7,
        summary:
          'Cooling globes reduce puffiness, soothe inflammation, and boost circulation.',
        idealFor: 'Morning puffiness and tired, inflamed skin',
        steps: [
          {
            name: 'Lymphatic Warm-Up',
            text: 'Light drainage strokes open the pathways fluid needs to move through.',
          },
          {
            name: 'Cryo Globe Sculpt',
            text: 'Chilled globes contour the face while calming heat and redness.',
          },
          {
            name: 'Hydration Seal',
            text: 'A humectant layer holds the de-puffed result in place.',
          },
        ],
      },
      {
        name: 'Muscle Tension Relief',
        price: 160,
        duration: '60min',
        rating: 4.8,
        summary:
          'Deep facial massage releases muscle tension and supports skin elasticity.',
        idealFor: 'Jaw clenching, tension headaches, and daily stress',
        steps: [
          {
            name: 'Pressure Point Release',
            text: 'Held points along the jaw and temples begin to let go.',
          },
          {
            name: 'Deep Facial Massage',
            text: 'Sustained work through the masseter and brow relieves stored tension.',
          },
          {
            name: 'Restorative Wrap',
            text: 'A warm wrap closes the session and extends the release.',
          },
        ],
      },
      {
        name: 'LED Light Therapy',
        price: 85,
        duration: '30min',
        rating: 4.6,
        summary:
          'Clinical wavelengths target breakouts and stimulate collagen production.',
        idealFor: 'Breakout-prone skin and early fine lines',
        steps: [
          {
            name: 'Clarifying Cleanse',
            text: 'Skin is cleared so light reaches it without interference.',
          },
          {
            name: 'Wavelength Session',
            text: 'Blue and red light are selected for your concern and layered.',
          },
          {
            name: 'Barrier Repair',
            text: 'A ceramide finish supports the skin through the following days.',
          },
        ],
      },
    ],
  },
  {
    id: 'body',
    name: 'Body Rituals',
    count: 18,
    Icon: HourglassIcon,
    image:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1400&auto=format&fit=crop',
    description: [
      'Slow, deliberate rituals that release tension and reconnect you with your body. Warm oils, considered pressure, and unhurried time in a space built for stillness.',
      'From deep tissue work to restorative wraps, every session is adapted to how you arrive and what you need that day.',
    ],
    treatments: [
      {
        name: 'Deep Tissue Massage',
        price: 150,
        duration: '75min',
        rating: 4.9,
        summary:
          'Firm, sustained pressure that reaches long-held tension in the back and shoulders.',
        idealFor: 'Chronic back and shoulder tension',
        steps: [
          {
            name: 'Consultation',
            text: 'We map where you hold tension and agree on pressure before we start.',
          },
          {
            name: 'Deep Pressure Work',
            text: 'Slow, sustained pressure works through the deeper muscle layers.',
          },
          {
            name: 'Stretch & Release',
            text: 'Assisted stretches lock in the length you have just gained.',
          },
        ],
      },
      {
        name: 'Warm Oil Ritual',
        price: 135,
        duration: '60min',
        rating: 4.8,
        summary:
          'Slow strokes with heated botanical oils to quiet the nervous system.',
        idealFor: 'Stress, poor sleep, and nervous system overload',
        steps: [
          {
            name: 'Oil Selection',
            text: 'You choose from botanical blends warmed to body temperature.',
          },
          {
            name: 'Slow Full-Body Strokes',
            text: 'Unhurried, rhythmic strokes signal the body it is safe to switch off.',
          },
          {
            name: 'Quiet Rest',
            text: 'Ten minutes of stillness before you get up, undisturbed.',
          },
        ],
      },
      {
        name: 'Body Polish & Wrap',
        price: 170,
        duration: '90min',
        rating: 4.8,
        summary:
          'Mineral scrub followed by a nourishing wrap for soft, replenished skin.',
        idealFor: 'Dry, dull skin before an event or holiday',
        steps: [
          {
            name: 'Mineral Scrub',
            text: 'A fine salt and oil polish lifts away rough, dull surface skin.',
          },
          {
            name: 'Nourishing Wrap',
            text: 'A warm wrap drives butters and botanicals deep into the skin.',
          },
          {
            name: 'Hydrating Finish',
            text: 'A closing layer of body cream seals the softness in.',
          },
        ],
      },
      {
        name: 'Lymphatic Drainage',
        price: 145,
        duration: '60min',
        rating: 4.7,
        summary:
          'Light rhythmic technique that reduces fluid retention and leaves you lighter.',
        idealFor: 'Fluid retention, bloating, and heaviness',
        steps: [
          {
            name: 'Dry Brushing',
            text: 'Brief brushing wakes the surface circulation before hands-on work.',
          },
          {
            name: 'Rhythmic Drainage',
            text: 'Feather-light repeated strokes move fluid toward the lymph nodes.',
          },
          {
            name: 'Hydration',
            text: 'Water and herbal tea afterward help the body finish the job.',
          },
        ],
      },
      {
        name: 'Hot Stone Therapy',
        price: 165,
        duration: '75min',
        rating: 4.9,
        summary:
          'Heated basalt stones melt deep muscular tightness without heavy pressure.',
        idealFor: 'Deep tightness when firm pressure feels like too much',
        steps: [
          {
            name: 'Stone Placement',
            text: 'Heated basalt is placed along the spine to begin softening muscle.',
          },
          {
            name: 'Heated Gliding',
            text: 'Stones are worked over the body, carrying heat into tight areas.',
          },
          {
            name: 'Cool Down',
            text: 'A cool cloth and slow return bring your temperature back to baseline.',
          },
        ],
      },
      {
        name: 'Scalp & Shoulder Release',
        price: 80,
        duration: '30min',
        rating: 4.6,
        summary: 'A focused reset for desk-bound shoulders, neck, and scalp.',
        idealFor: 'Desk workers, screen fatigue, and tension headaches',
        steps: [
          {
            name: 'Shoulder Unwind',
            text: 'Focused work across the traps where screen posture collects.',
          },
          {
            name: 'Neck Release',
            text: 'Gentle traction and pressure free the base of the skull.',
          },
          {
            name: 'Scalp Massage',
            text: 'Fingertip work across the scalp finishes the reset.',
          },
        ],
      },
    ],
  },
  {
    id: 'hair',
    name: 'Hair Treatments',
    count: 12,
    Icon: SparkIcon,
    image:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop',
    listImage:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1400&auto=format&fit=crop',
    description: [
      'Precision cutting, tonal colour, and repair treatments led by stylists who read hair before they touch it. Structure, shine, and movement that lasts past the appointment.',
      'We finish every visit with the routine to keep it — honest advice on products and the care your hair actually needs.',
    ],
    treatments: [
      {
        name: 'Precision Cut',
        price: 110,
        duration: '60min',
        rating: 4.9,
        summary:
          'A shape built around your growth pattern, texture, and how you style it at home.',
        idealFor: 'Growing out a shape or starting completely fresh',
        steps: [
          {
            name: 'Consultation',
            text: 'We look at growth pattern, density, and the time you actually have.',
          },
          {
            name: 'Precision Cut',
            text: 'The shape is built section by section, dry-checked as we go.',
          },
          {
            name: 'Styling Lesson',
            text: 'You leave knowing how to recreate it with what you own.',
          },
        ],
      },
      {
        name: 'Tonal Gloss',
        price: 95,
        duration: '45min',
        rating: 4.7,
        summary:
          'Semi-permanent shine and tone correction with no lift and no commitment.',
        idealFor: 'Brassiness and faded colour between appointments',
        steps: [
          {
            name: 'Tone Match',
            text: 'We read your current tone in natural light before mixing.',
          },
          {
            name: 'Gloss Application',
            text: 'A demi-permanent gloss corrects tone without lifting the base.',
          },
          {
            name: 'Shine Seal',
            text: 'An acidic rinse closes the cuticle for maximum reflection.',
          },
        ],
      },
      {
        name: 'Bond Repair Treatment',
        price: 130,
        duration: '60min',
        rating: 4.8,
        summary:
          'Rebuilds internal bonds weakened by colour, heat, and daily wear.',
        idealFor: 'Colour-damaged and heat-stressed hair',
        steps: [
          {
            name: 'Porosity Test',
            text: 'We measure how damaged the hair actually is before choosing strength.',
          },
          {
            name: 'Bond Builder',
            text: 'Active repair is applied and processed under controlled heat.',
          },
          {
            name: 'Sealing Rinse',
            text: 'A pH-balancing rinse locks the rebuilt structure in place.',
          },
        ],
      },
      {
        name: 'Full Balayage',
        price: 260,
        duration: '150min',
        rating: 4.9,
        summary:
          'Hand-painted dimension that grows out softly, with no harsh regrowth line.',
        idealFor: 'Soft dimension with genuinely low upkeep',
        steps: [
          {
            name: 'Placement Map',
            text: 'We plan where light falls on your face before any product is mixed.',
          },
          {
            name: 'Hand Painting',
            text: 'Lightener is painted freehand for a diffused, natural grow-out.',
          },
          {
            name: 'Toning & Finish',
            text: 'A custom toner sets the final shade and the hair is cut in.',
          },
        ],
      },
      {
        name: 'Scalp Detox',
        price: 75,
        duration: '30min',
        rating: 4.6,
        summary:
          'Clears product buildup and rebalances the scalp for healthier growth.',
        idealFor: 'Product buildup, flaking, and oily roots',
        steps: [
          {
            name: 'Clarifying Wash',
            text: 'A deep wash strips residue that regular shampoo leaves behind.',
          },
          {
            name: 'Exfoliating Scrub',
            text: 'A granular scrub clears the follicle without irritating the skin.',
          },
          {
            name: 'Balancing Tonic',
            text: 'A lightweight tonic resets oil production at the root.',
          },
        ],
      },
      {
        name: 'Keratin Smoothing',
        price: 290,
        duration: '120min',
        rating: 4.8,
        summary:
          'Reduces frizz and cuts drying time for months, keeping natural movement.',
        idealFor: 'Frizz, humidity, and long drying times',
        steps: [
          {
            name: 'Clarify & Prep',
            text: 'The cuticle is opened so the treatment can bond evenly.',
          },
          {
            name: 'Keratin Seal',
            text: 'Keratin is worked through in fine sections for consistent results.',
          },
          {
            name: 'Heat Activation',
            text: 'Flat-iron heat locks the smoothing in for up to three months.',
          },
        ],
      },
    ],
  },
]

/** Treatments inherit their category's photos unless they define their own. */
const withTreatmentImages = (category) => ({
  ...category,
  treatments: category.treatments.map((treatment) => ({
    ...treatment,
    images: treatment.images ?? [category.listImage, category.image],
  })),
})

export const CATEGORIES = RAW_CATEGORIES.map(withTreatmentImages)

export const ALL = {
  id: 'all',
  name: 'All Services',
  label: 'All',
  count: CATEGORIES.reduce((sum, category) => sum + category.count, 0),
  Icon: RingIcon,
  listImage: CATEGORIES[0].listImage,
  description: [
    'Fifty-four treatments across skin, body, and hair — built around consultation rather than a menu. We start by understanding your goals, then shape a plan from there.',
    'Every service shares the same standard: expert hands, considered products, and a room designed to let you exhale.',
  ],
  treatments: CATEGORIES.flatMap((category) => category.treatments),
}

export const TABS = [ALL, ...CATEGORIES]
