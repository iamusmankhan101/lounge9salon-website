import { useEffect, useMemo, useRef, useState } from 'react'
import Footer from '../components/Footer.jsx'
import { useSalon } from '../data/salon.js'
import { CATEGORY_GUIDE, buildCatalog } from '../data/services.js'
import './TreatmentsPage.css'

/** Adds `is-in` the first time a block scrolls into view, then stops watching. */
function useInView(threshold = 0.2) {
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

/**
 * One category: photograph on one side, copy on the other, sides alternating
 * down the page. The treatment count comes from the live menu when it has
 * loaded and is simply omitted when it has not — the copy stands on its own.
 */
function Category({ category, index, count }) {
  const [ref, inView] = useInView(0.25)
  const { Icon, name, blurb, description, image } = category

  return (
    <section
      ref={ref}
      className={`treatments__row ${
        index % 2 ? 'treatments__row--flipped' : ''
      } ${inView ? 'is-in' : ''}`}
    >
      <div className="treatments__media">
        <span className="treatments__frame">
          <img src={image} alt="" loading="lazy" />
        </span>
      </div>

      <div className="treatments__copy">
        <p className="treatments__index">
          <span className="treatments__icon" aria-hidden="true">
            <Icon />
          </span>
          {String(index + 1).padStart(2, '0')}
        </p>

        <h2 className="treatments__name">{name}</h2>
        <p className="treatments__blurb">{blurb}</p>

        {description.map((paragraph) => (
          <p key={paragraph} className="treatments__text">
            {paragraph}
          </p>
        ))}

        <div className="treatments__actions">
          <a href="/services" className="treatments__cta">
            {count ? `See all ${count} treatments` : 'See prices'}
          </a>
          <a href="/home#book" className="treatments__link">
            Book an appointment
          </a>
        </div>
      </div>
    </section>
  )
}

function TreatmentsPage() {
  const { services } = useSalon()
  const [introRef, introIn] = useInView(0)

  // counts are a bonus on top of the static copy, so a failed menu costs nothing
  const counts = useMemo(() => {
    const { categories } = buildCatalog(services)
    return Object.fromEntries(categories.map((c) => [c.id, c.count]))
  }, [services])

  return (
    <div className="treatments-page">
      <header className="treatments__header">
        <a href="/" className="treatments__logo">
          <img
            src="/lounge-8-salon-logo.png"
            alt="Lounge 8 Salon"
            className="brand-logo"
          />
        </a>

        <nav className="treatments__nav">
          <a href="/">Home</a>
          <a href="/services">Price Menu</a>
          <a href="/home#gallery">Gallery</a>
          <a href="/home#contact">Contacts</a>
        </nav>

        <a href="/home#book" className="treatments__header-cta">
          Book an Appointment
        </a>
      </header>

      <section
        ref={introRef}
        className={`treatments__intro ${introIn ? 'is-in' : ''}`}
      >
        <p className="treatments__eyebrow">What we do</p>
        <h1 className="treatments__title">
          <span className="treatments__mask">
            <span className="treatments__rise">Treatments</span>
          </span>
        </h1>
        <p className="treatments__lead">
          Seven kinds of work, all of it built around a consultation rather than
          a package. Read what each involves here — then see exactly what it
          costs on the price menu.
        </p>
      </section>

      {CATEGORY_GUIDE.map((category, i) => (
        <Category
          key={category.id}
          category={category}
          index={i}
          count={counts[category.id]}
        />
      ))}

      <section className="treatments__closing">
        <p className="treatments__closing-text">
          Not sure which you need? Book a consultation and we will shape a plan
          around your hair and skin.
        </p>
        <a href="/home#book" className="treatments__closing-cta">
          Book an Appointment
        </a>
      </section>

      <Footer />
    </div>
  )
}

export default TreatmentsPage
