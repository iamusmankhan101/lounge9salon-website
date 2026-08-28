import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import './Gallery.css'

/**
 * The tour, in the order you would walk it: in from the street, across the
 * floor, past reception, through the pedicure lounge and the treatment rooms,
 * then back out front.
 *
 * `col` and `offset` only take effect on the desktop grid — the CSS reads them
 * inside its own media query, so a narrow screen falls back to one column.
 */
const SHOTS = [
  {
    id: 'facade',
    alt: 'The Lounge 8 Salon shopfront, lit up at dusk',
    image: '/gallery/2V3A4505ARP.jpg',
    col: '1 / 7',
    ratio: '3 / 4',
  },
  {
    id: 'floor',
    alt: 'The main salon floor, with styling chairs and the portrait wall',
    image: '/gallery/2V3A4543ARP.jpg',
    col: '7 / 13',
    offset: '6rem',
    ratio: '3 / 2',
  },
  {
    id: 'portrait-wall',
    alt: 'The staircase beside the wall of framed black and white portraits',
    image: '/gallery/2V3A4535ARP.jpg',
    col: '1 / 6',
    offset: '-1rem',
    ratio: '4 / 3',
  },
  {
    id: 'floor-side',
    alt: 'Styling chairs looking down the length of the floor',
    image: '/gallery/2V3A4574ARP.jpg',
    col: '6 / 13',
    offset: '6rem',
    ratio: '3 / 2',
  },
  {
    id: 'chair',
    alt: 'A styling chair waiting at its station',
    image: '/gallery/2V3A4549ARP.jpg',
    col: '2 / 6',
    offset: '7rem',
    ratio: '3 / 4',
  },
  {
    id: 'reception',
    alt: 'The reception desk and waiting seats against the brick wall',
    image: '/gallery/2V3A4551ARP.jpg',
    col: '6 / 13',
    ratio: '3 / 2',
  },
  {
    id: 'desk',
    alt: 'The reception desk, with the shelves and clock behind it',
    image: '/gallery/2V3A4556ARP.jpg',
    col: '1 / 7',
    offset: '6rem',
    ratio: '4 / 3',
  },
  {
    id: 'pedicure',
    alt: 'Pedicure chairs in patterned upholstery, side by side',
    image: '/gallery/2V3A4583ARP.jpg',
    col: '7 / 13',
    offset: '-2rem',
    ratio: '4 / 3',
  },
  {
    id: 'loungers',
    alt: 'The pedicure loungers under their pendant lights',
    image: '/gallery/2V3A4590ARP.jpg',
    col: '1 / 5',
    offset: '5rem',
    ratio: '3 / 4',
  },
  {
    id: 'lounge',
    alt: 'The lounge seen from above, seating on one side and chairs on the other',
    image: '/gallery/2V3A4581ARP.jpg',
    col: '5 / 13',
    ratio: '3 / 2',
  },
  {
    id: 'treatment',
    alt: 'The treatment room, two beds made up behind curtains',
    image: '/gallery/2V3A4606ARP.jpg',
    col: '1 / 7',
    offset: '6rem',
    ratio: '3 / 2',
  },
  {
    id: 'private',
    alt: 'The private styling room, with its leather chair and sofa',
    image: '/gallery/2V3A4655ARP.jpg',
    col: '7 / 13',
    offset: '1rem',
    ratio: '3 / 2',
  },
  {
    id: 'facade-angle',
    alt: 'The shopfront from the street, sign glowing above the windows',
    image: '/gallery/2V3A4516ARP.jpg',
    col: '4 / 10',
    offset: '6rem',
    ratio: '3 / 4',
  },
]

/** How many shots sit above the headline. */
const SHOTS_BEFORE_TITLE = 2

/** Reveals an element the first time it scrolls into view. */
function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

function Shot({ shot, index }) {
  const [ref, inView] = useInView()

  return (
    <figure
      ref={ref}
      style={{
        // neighbours that enter together should not fire in unison
        '--reveal-delay': `${(index % 3) * 0.14}s`,
        '--col': shot.col,
        '--offset': shot.offset ?? '0rem',
        '--ratio': shot.ratio,
      }}
      className={`gallery__item gallery__item--${shot.id} ${
        inView ? 'is-in' : ''
      }`}
    >
      <span className="gallery__frame">
        <img
          src={shot.image}
          alt={shot.alt}
          className="gallery__image"
          loading="lazy"
          decoding="async"
        />
      </span>
    </figure>
  )
}

function Gallery() {
  const [titleRef, titleInView] = useInView(0.6)

  return (
    <section id="gallery" className="gallery">
      <div className="gallery__grid">
        {SHOTS.slice(0, SHOTS_BEFORE_TITLE).map((shot, i) => (
          <Shot key={shot.id} shot={shot} index={i} />
        ))}

        <h2
          ref={titleRef}
          className={`gallery__title ${titleInView ? 'is-visible' : ''}`}
        >
          <span className="gallery__title-mask">
            <span className="gallery__title-line">
              Our
              <Badge label="Gallery" delay={0.9} />
              Space
            </span>
          </span>
        </h2>

        {SHOTS.slice(SHOTS_BEFORE_TITLE).map((shot, i) => (
          <Shot
            key={shot.id}
            shot={shot}
            index={i + SHOTS_BEFORE_TITLE}
          />
        ))}
      </div>
    </section>
  )
}

export default Gallery
