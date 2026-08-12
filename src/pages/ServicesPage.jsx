import { useMemo, useState } from 'react'
import Footer from '../components/Footer.jsx'
import TreatmentModal from '../components/TreatmentModal.jsx'
import { ClockIcon } from '../components/icons.jsx'
import { useSalon } from '../data/salon.js'
import { buildCatalog, formatPrice } from '../data/services.js'
import './ServicesPage.css'

function Row({ treatment, onOpen }) {
  return (
    <article className="menu__row">
      <div className="menu__row-main">
        <h3 className="menu__row-name">{treatment.name}</h3>
        <p className="menu__row-meta">
          <span className="menu__row-clock">
            <ClockIcon />
          </span>
          {treatment.duration}
        </p>
      </div>

      <p className="menu__row-price">{formatPrice(treatment)}</p>

      <button type="button" className="menu__row-book" onClick={onOpen}>
        Book
      </button>
    </article>
  )
}

function ServicesPage() {
  const { services, ok } = useSalon()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [openTreatment, setOpenTreatment] = useState(null)

  const { categories } = useMemo(() => buildCatalog(services), [services])

  // searching looks across the whole menu, not just the open category
  const shown = useMemo(() => {
    const term = query.trim().toLowerCase()
    const scoped =
      filter === 'all' || term
        ? categories
        : categories.filter((category) => category.id === filter)

    return scoped
      .map((category) => ({
        ...category,
        treatments: term
          ? category.treatments.filter((treatment) =>
              treatment.name.toLowerCase().includes(term),
            )
          : category.treatments,
      }))
      .filter((category) => category.treatments.length)
  }, [categories, filter, query])

  const total = shown.reduce((sum, category) => sum + category.treatments.length, 0)
  const loading = !ok && !services.length
  const unavailable = ok && !categories.length

  return (
    <div className="menu-page">
      <header className="menu__header">
        <a href="/home" className="menu__logo">
          <img
            src="/lounge-8-salon-logo.png"
            alt="Lounge 8 Salon"
            className="brand-logo"
          />
        </a>

        <nav className="menu__nav">
          <a href="/home">Home</a>
          <a href="/home#gallery">Gallery</a>
          <a href="/home#contact">Contacts</a>
        </nav>

        <a href="/home#book" className="menu__cta">
          Book an Appointment
        </a>
      </header>

      <div className="menu__intro">
        <h1 className="menu__title">Our Services</h1>
        <p className="menu__lead">
          Every treatment we offer, priced exactly as it is at the salon. Tap
          any service to book it — your slot goes straight into our diary.
        </p>

        <div className="menu__controls">
          <input
            type="search"
            className="menu__search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search treatments…"
            aria-label="Search treatments"
          />

          <div className="menu__filters">
            <button
              type="button"
              className={`menu__filter ${filter === 'all' ? 'is-active' : ''}`}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`menu__filter ${
                  filter === category.id ? 'is-active' : ''
                }`}
                aria-pressed={filter === category.id}
                onClick={() => setFilter(category.id)}
              >
                {category.name}
                <span className="menu__filter-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="menu__body">
        {loading && <p className="menu__empty">Loading our menu…</p>}

        {unavailable && (
          <p className="menu__empty">
            Our menu is briefly unavailable. Please call{' '}
            <a href="tel:+923000000000">+92 300 000 0000</a> and we will book
            you in.
          </p>
        )}

        {!loading && !unavailable && !total && (
          <p className="menu__empty">
            Nothing matches “{query}”. Try a different word, or call us and we
            will point you the right way.
          </p>
        )}

        {shown.map((category) => (
          <section key={category.id} className="menu__group">
            <div className="menu__group-head">
              <img
                src={category.image}
                alt=""
                className="menu__group-image"
                loading="lazy"
              />
              <div>
                <h2 className="menu__group-name">{category.name}</h2>
                <p className="menu__group-text">{category.description[0]}</p>
              </div>
            </div>

            <div className="menu__rows">
              {category.treatments.map((treatment) => (
                <Row
                  key={treatment.id}
                  treatment={treatment}
                  onOpen={() => setOpenTreatment(treatment)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />

      {openTreatment && (
        <TreatmentModal
          treatment={openTreatment}
          onClose={() => setOpenTreatment(null)}
        />
      )}
    </div>
  )
}

export default ServicesPage
