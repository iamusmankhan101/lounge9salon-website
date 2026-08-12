import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import { StarIcon } from './icons.jsx'
import { useCarousel } from '../data/carousel.js'
import './Reviews.css'

const REVIEWS = [
  {
    id: 'mellisa',
    rating: '4.9',
    quote:
      'My favorite stress reliever. There’s nothing like ending the month with a visit to Lounge8. The atmosphere is so calming, the staff are always attentive, and I leave feeling like a new person. If I could come every week, I would!',
    name: 'Mellisa P.',
    treatment: 'Enzyme Exfoliation',
    date: 'Jun 28th, 2025',
  },
  {
    id: 'sophie',
    rating: '4.9',
    quote:
      'My skin has never looked this radiant. One facial at Lounge8 erased the dullness and gave me the confidence to go makeup-free. The care felt truly personal — I’m already booking my next visit.',
    name: 'Sophie L.',
    treatment: 'Glow Revival Facial',
    date: 'Jul 6th, 2025',
  },
  {
    id: 'amira',
    rating: '5.0',
    quote:
      'I came in for a trim and left with the best haircut of my life. They actually listened to what I wanted instead of talking me into something else. Two months later it still falls perfectly.',
    name: 'Amira K.',
    treatment: 'Signature Cut & Style',
    date: 'Aug 2nd, 2025',
  },
  {
    id: 'nadia',
    rating: '4.8',
    quote:
      'The lounge feels like a private retreat in the middle of the city. Quiet, warm, unhurried. My nails have never held up this well, and the head massage alone is worth the visit.',
    name: 'Nadia R.',
    treatment: 'Luxury Manicure',
    date: 'Aug 19th, 2025',
  },
  {
    id: 'yasmin',
    rating: '5.0',
    quote:
      'Six sessions in and the change is undeniable — no filters, no clever lighting. They set honest expectations from day one and then quietly beat them.',
    name: 'Yasmin A.',
    treatment: 'Skin Renewal Program',
    date: 'Sep 11th, 2025',
  },
  {
    id: 'leila',
    rating: '4.9',
    quote:
      'Booked on a whim before a wedding and it turned into a monthly ritual. Every visit ends the same way: I catch myself smiling at my reflection on the way out.',
    name: 'Leila M.',
    treatment: 'Hydrating Glow Ritual',
    date: 'Oct 4th, 2025',
  },
]

function Stars({ rating }) {
  return (
    <div className="review__rating">
      <span className="review__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
      <span className="review__score">{rating}</span>
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <article className="review">
      <Stars rating={review.rating} />

      <p className="review__quote">{review.quote}</p>

      <footer className="review__meta">
        <p className="review__name">{review.name}</p>
        <p className="review__treatment">
          {review.treatment}, {review.date}
        </p>
      </footer>
    </article>
  )
}

function Reviews() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const { trackRef, page, pages, goTo, next, measure } = useCarousel()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className={`reviews ${visible ? 'is-visible' : ''}`}
    >
      <h2 className="reviews__title">
        <span className="reviews__mask">
          <span className="reviews__line">
            Real
            <Badge
              delay={1}
              label={
                <span className="reviews__badge-label">
                  4.9
                  <br />
                  Average Rating
                </span>
              }
            />
            Results
          </span>
        </span>
        <span className="reviews__mask">
          <span className="reviews__line" style={{ '--delay': '0.12s' }}>
            No Filters No Retouching
          </span>
        </span>
        <span className="reviews__mask">
          <span className="reviews__line" style={{ '--delay': '0.24s' }}>
            Just
            <Badge
              delay={1.2}
              label={
                <span className="reviews__badge-label">
                  1 200+
                  <br />
                  Reviews
                </span>
              }
            />
            Real People
          </span>
        </span>
      </h2>

      <div className="reviews__carousel">
        <div className="reviews__track" ref={trackRef} onScroll={measure}>
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="reviews__controls">
          <div className="reviews__dots">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`reviews__dot ${i === page ? 'is-active' : ''}`}
                aria-label={`Go to reviews page ${i + 1}`}
                aria-current={i === page}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="reviews__next"
            aria-label="Next reviews"
            onClick={next}
          >
            <svg viewBox="0 0 48 16" aria-hidden="true">
              <path
                d="M0 8h45M38 1l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Reviews
