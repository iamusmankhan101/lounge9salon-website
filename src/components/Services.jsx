import { useEffect, useMemo, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import CategoryModal from './CategoryModal.jsx'
import TreatmentModal from './TreatmentModal.jsx'
import { buildCatalog } from '../data/services.js'
import { useSalon } from '../data/salon.js'
import { useCarousel } from '../data/carousel.js'
import './Services.css'

function Services() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [openCategory, setOpenCategory] = useState(null)
  const [openTreatment, setOpenTreatment] = useState(null)
  const { services } = useSalon()

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

  // the menu is the salon's live catalogue, curated for public display
  const { categories } = useMemo(() => buildCatalog(services), [services])

  // the popup reads from the live catalogue, so a refresh cannot leave it stale
  const category = categories.find((item) => item.id === openCategory) ?? null
  const { trackRef, page, pages, goTo, next, measure } = useCarousel(
    categories.length,
  )

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`services ${visible ? 'is-visible' : ''}`}
    >
      <h2 className="services__title">
        <span className="services__title-mask">
          <span className="services__title-line">
            Our
            <Badge label="Services" delay={1} />
            Services
          </span>
        </span>
      </h2>

      <div className="services__carousel">
        <div className="services__track" ref={trackRef} onScroll={measure}>
          {categories.map(({ id, name, count, Icon, image }, i) => (
            <button
              key={id}
              type="button"
              className="services__card"
              style={{ transitionDelay: `${0.3 + (i % 3) * 0.15}s` }}
              aria-haspopup="dialog"
              onClick={() => setOpenCategory(id)}
            >
              <img
                src={image}
                alt=""
                className="services__card-image"
                loading="lazy"
              />
              <span className="services__card-info">
                <span>
                  <span className="services__card-name">{name}</span>
                  <span className="services__card-count">
                    {count} service{count === 1 ? '' : 's'}
                  </span>
                </span>
                <span className="services__card-icon">
                  <Icon />
                </span>
              </span>
            </button>
          ))}
        </div>

        {pages > 1 && (
          <div className="services__controls">
            <div className="services__dots">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`services__dot ${i === page ? 'is-active' : ''}`}
                  aria-label={`Go to services page ${i + 1}`}
                  aria-current={i === page}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <button
              type="button"
              className="services__next"
              aria-label="Next services"
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
        )}
      </div>

      <a href="/services" className="services__view-all">
        View All
      </a>

      {category && (
        <CategoryModal
          category={category}
          suspended={Boolean(openTreatment)}
          onOpenTreatment={(treatment, options) =>
            setOpenTreatment({ treatment, book: Boolean(options?.book) })
          }
          onClose={() => setOpenCategory(null)}
        />
      )}

      {openTreatment && (
        <TreatmentModal
          treatment={openTreatment.treatment}
          startBooking={openTreatment.book}
          onClose={() => setOpenTreatment(null)}
        />
      )}
    </section>
  )
}

export default Services
