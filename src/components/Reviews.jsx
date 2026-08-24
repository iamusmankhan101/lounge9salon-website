import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import { StarIcon } from './icons.jsx'
import { useCarousel } from '../data/carousel.js'
import './Reviews.css'

/**
 * Real reviews from the salon's Google listing, transcribed verbatim.
 *
 * `date` is a month rather than a day: Google shows these as "6 months ago",
 * so the month is the most precise honest reading. Relative wording is not
 * used here because this array is static and would drift out of date.
 *
 * All twelve are five-star, confirmed against the listing by the salon.
 */
const REVIEWS = [
  {
    id: 'fatima-arshad',
    rating: '5.0',
    quote:
      "I got my manicure, pedicure and cleansing done yesterday and loved the service. The staff is super courteous and the whole process was super relaxing. Would definitely come here to try their haircuts too",
    name: 'Fatima Arshad',
    date: 'July 2026',
  },
  {
    id: 'fatima-faizan',
    rating: '5.0',
    quote:
      "Had a great experience at the salon. It was my birthday and they really made my day by pampering me so much \u{1F970} The staff was really welcoming & cooperative. Also, I am in love with the haircut done by Summayiyah \u{1F497}",
    name: 'Fatima Faizan',
    date: 'July 2026',
  },
  {
    id: 'farah-haroon',
    rating: '5.0',
    quote:
      "Great experience! Saamia knows her work well. Hair work is best hair \u2661\u2661\u2661 Highly recommended",
    name: 'Farah Haroon',
    date: 'July 2026',
  },
  {
    id: 'suha-tayyeb',
    rating: '5.0',
    quote:
      "My hair were super frizzy and dry. I had a haircut and hair botox treatment done by Sumaiya and Zainab. The team was extremely sweet and gentle. Sumaiya took her time with the haircut. She kept cooperating until I was satisfied with the process. My hair looks glossy, soft and silky. This was my first time at this salon and am very happy with the service. Thank you team.",
    name: 'Suha Tayyeb',
    date: 'February 2026',
  },
  {
    id: 'schehrzade',
    rating: '5.0',
    quote:
      "I was a walk in client because I googled a hairdresser near me and saw good reviews. I went just for essentially a trim and in a very very fair and professional price the team and the owner were so excellent, they completely redid my look beyond my expectation, respected my concerns, gave me a lot of time, did not try selling or recommending any product or brand which I often avoid salons because of, gave me genuine good hair care advice in ways that required no product, taught me how to set my hair myself and more. I dropped some money there and they had kept it at the reception for me. Very genuine, very knowledgeable, very skilled, and also kind and sincere to clients. I would go again",
    name: 'Schehrzade',
    date: 'January 2026',
  },
  {
    id: 'mariyam-sheikh',
    rating: '5.0',
    quote:
      "If you\u2019ve ever wanted a stylist who just knows and understands what they\u2019re doing, this is exactly who you\u2019ll find here. Ma\u2019am Samia and her staff are extremely passionate about their craft and it surely is visible in the results. I trust them the most when it comes to hair. A hundred percent recommended!",
    name: 'Mariyam Sheikh',
    date: 'December 2025',
  },
  {
    id: 'dua',
    rating: '5.0',
    quote:
      "A special thanks to Mam\u2019s Samia for her professionalism patience and amazing skills she really knows her work and made sure I was satisfied at very step. The staff was also very friendly and welcoming",
    name: 'Dua',
    date: 'December 2025',
  },
  {
    id: 'haniya-abbas',
    rating: '5.0',
    quote:
      "Just got my highlights ( milky ash with a hint of green ) and haircut done by the talented Samia Jee! I\u2019m obsessed with the \u2018Butterfly\u2019 cut she gave me. She did an amazing job and kept my bottom layers long & the staff was so friendly and welcoming as always..",
    name: 'Haniya Abbas',
    date: 'October 2025',
  },
  {
    id: 'saadia-haris',
    rating: '5.0',
    quote:
      "Amazing services, and attention to detail, Samia Ji is a diva, and caters your hair with utmost care and professionalism. Would recommend everyone to try her haircut, you won\u2019t go anywhere else after that!",
    name: 'Saadia Haris',
    date: 'October 2025',
  },
  {
    id: 'ayesha-karamat',
    rating: '5.0',
    quote:
      "Samiya is best in town! Such a talented hairstylist! She\u2019s an artist who truly knows her craft. I walked out feeling amazing, definitely my go-to from now on!",
    name: 'Ayesha Karamat',
    date: 'October 2025',
  },
  {
    id: 'humaira-nadeem',
    rating: '5.0',
    quote:
      "Great service. Samia Khan the owner is a down to earth professional. Extremely happy with my hair colour and cut.",
    name: 'Humaira Nadeem',
    date: 'September 2025',
  },
  {
    id: 'ayeisha-ali',
    rating: '5.0',
    quote:
      "It\u2019s a very warm and cosy place to go to, I usually go for hair treatments, the owner Samiya is a very nice polished women, I would say a strong woman and a woman of substance, the way she talks and carries herself is a true miracle, I really admire her strength.. and she is working very hard and is an expert in her field .",
    name: 'Ayeisha Ali',
    date: '2022',
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
          {/* Google reviews carry no treatment, so it is optional */}
          {[review.treatment, review.date].filter(Boolean).join(', ')}
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
                  40+
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
