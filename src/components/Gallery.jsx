import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import { SparkIcon } from './icons.jsx'
import './Gallery.css'

const SHOTS = [
  {
    id: 'interior',
    label: 'Interior',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'relaxation',
    label: 'Relaxation Area',
    image:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'lounge',
    label: 'Lounge Area',
    image:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'hair',
    label: 'Hair Treatments Rooms',
    image:
      'https://images.unsplash.com/photo-1521783593447-5702b9bfd267?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'office',
    label: "The Chief Doctor's Office",
    image:
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'spa',
    label: 'Spa Zone',
    image:
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'treatment',
    label: 'Treatment Room',
    image:
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=1200&auto=format&fit=crop',
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
          alt={shot.label}
          className="gallery__image"
          loading="lazy"
        />
      </span>
      <figcaption className="gallery__caption">
        {shot.label}
        <span className="gallery__mark">
          <SparkIcon />
        </span>
      </figcaption>
    </figure>
  )
}

function Gallery() {
  const [titleRef, titleInView] = useInView(0.6)

  return (
    <section className="gallery">
      <div className="gallery__grid">
        {SHOTS.slice(0, 3).map((shot, i) => (
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

        {SHOTS.slice(3).map((shot, i) => (
          <Shot key={shot.id} shot={shot} index={i + 3} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
