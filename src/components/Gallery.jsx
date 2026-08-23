import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import './Gallery.css'

const SHOTS = [
  {
    id: 'floor',
    alt: 'The main salon floor, with styling chairs and the portrait wall',
    image: '/WhatsApp%20Image%202026-08-23%20at%2013.13.07.jpeg',
  },
  {
    id: 'stations',
    alt: 'Styling stations along the mirrored wall',
    image: '/WhatsApp%20Image%202026-08-23%20at%2013.13.06%20(1).jpeg',
  },
  {
    id: 'reception',
    alt: 'The reception desk against the brick wall',
    image: '/WhatsApp%20Image%202026-08-23%20at%2013.13.06.jpeg',
  },
  {
    id: 'lounge',
    alt: 'The waiting area, with seating and the retail shelves',
    image: '/WhatsApp%20Image%202026-08-23%20at%2013.13.07%20(1).jpeg',
  },
]

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
      // neighbours that enter together should not fire in unison
      style={{ '--reveal-delay': `${(index % 3) * 0.14}s` }}
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
        {SHOTS.slice(0, 2).map((shot, i) => (
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

        {SHOTS.slice(2).map((shot, i) => (
          <Shot key={shot.id} shot={shot} index={i + 2} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
