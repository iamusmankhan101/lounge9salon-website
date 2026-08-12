import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import TreatmentModal from './TreatmentModal.jsx'
import { ClockIcon } from './icons.jsx'
import { CATEGORIES, TABS } from '../data/services.js'
import './Services.css'

function TreatmentCard({ treatment, index, onOpen }) {
  return (
    <article
      className="services__item"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <h4 className="services__item-name">{treatment.name}</h4>

      <p className="services__item-meta">
        <span className="services__item-price">${treatment.price}</span>
        <span className="services__item-duration">
          <span className="services__item-clock">
            <ClockIcon />
          </span>
          {treatment.duration}
        </span>
      </p>

      <p className="services__item-summary">{treatment.summary}</p>

      <div className="services__item-actions">
        <button type="button" className="services__book" onClick={onOpen}>
          Book Now
        </button>
        <button type="button" className="services__learn" onClick={onOpen}>
          Learn More
        </button>
      </div>
    </article>
  )
}

function Services() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [openTreatment, setOpenTreatment] = useState(null)

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

  const active = TABS.find((tab) => tab.id === activeId)

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

      {active ? (
        <>
          <div className="services__tabs">
            {TABS.map(({ id, name, label, count, Icon, image }) => (
              <button
                key={id}
                type="button"
                className={`services__tab ${id === activeId ? 'is-active' : ''} ${
                  id === 'all' ? 'services__tab--all' : ''
                }`}
                aria-pressed={id === activeId}
                onClick={() => setActiveId(id === activeId ? null : id)}
              >
                {image && id === activeId && (
                  <img src={image} alt="" className="services__tab-image" />
                )}
                <span className="services__tab-info">
                  <span>
                    <span className="services__tab-name">{label ?? name}</span>
                    <span className="services__tab-count">{count} services</span>
                  </span>
                  <span className="services__tab-icon">
                    <Icon />
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="services__detail" key={`detail-${active.id}`}>
            <h3 className="services__detail-name">{active.name}</h3>
            <div className="services__detail-text">
              {active.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="services__list" key={`list-${active.id}`}>
            {active.treatments.slice(0, 4).map((treatment, i) => (
              <TreatmentCard
                key={treatment.name}
                treatment={treatment}
                index={i}
                onOpen={() => setOpenTreatment(treatment)}
              />
            ))}

            <img
              src={active.listImage}
              alt=""
              className="services__list-image"
              loading="lazy"
            />

            <div className="services__list-label">
              <i className="services__list-frame services__list-frame--top" />
              <i className="services__list-frame services__list-frame--bottom" />
              Our Services
            </div>

            {active.treatments.slice(4).map((treatment, i) => (
              <TreatmentCard
                key={treatment.name}
                treatment={treatment}
                index={i + 4}
                onOpen={() => setOpenTreatment(treatment)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="services__grid">
            {CATEGORIES.map(({ id, name, count, Icon, image }, i) => (
              <button
                key={id}
                type="button"
                className="services__card"
                style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
                onClick={() => setActiveId(id)}
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
                      {count} services
                    </span>
                  </span>
                  <span className="services__card-icon">
                    <Icon />
                  </span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="services__view-all"
            onClick={() => setActiveId('all')}
          >
            View All
          </button>
        </>
      )}

      {openTreatment && (
        <TreatmentModal
          treatment={openTreatment}
          onClose={() => setOpenTreatment(null)}
        />
      )}
    </section>
  )
}

export default Services
