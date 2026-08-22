import { useEffect, useMemo, useRef, useState } from 'react'
import { formatTime, summarizeHours, useSalon } from '../data/salon.js'
import { buildCatalog, formatPrice } from '../data/services.js'
import { CONTACT, PHONE, PHONE_HREF } from '../data/contact.js'
import {
  EMPTY_FORM,
  sendBooking,
  today,
  useTimeSlots,
} from '../data/booking.js'
import './Booking.css'

function Booking() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sent
  const catalog = useSalon()

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

  // the same curated menu the services section shows — never the raw
  // catalogue, which holds private client packages and till-only entries
  const { categories } = useMemo(
    () => buildCatalog(catalog.services),
    [catalog.services],
  )

  const service = useMemo(
    () =>
      categories
        .flatMap((category) => category.treatments)
        .find((treatment) => treatment.id === form.serviceId),
    [categories, form.serviceId],
  )

  const { slots, closed: closedThatDay } = useTimeSlots(
    form.date,
    catalog.hours,
    service?.durationMin,
  )

  const update = (field) => (event) => {
    const { value } = event.target
    // a different treatment or day invalidates the slot already picked
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'date' || field === 'serviceId' ? { time: '' } : null),
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault()

    sendBooking({ ...form, serviceName: service?.name || 'Not sure yet' })

    // the answers stay put: if WhatsApp does not open, or they come back to
    // change something, nothing they typed has to be typed again
    setStatus('sent')
  }

  return (
    <section
      id="book"
      ref={sectionRef}
      className={`booking ${visible ? 'is-visible' : ''}`}
    >
      <div className="booking__intro">
        <h2 className="booking__title">
          <span className="booking__mask">
            <span className="booking__line">Book an</span>
          </span>
          <span className="booking__mask">
            <span className="booking__line" style={{ '--delay': '0.15s' }}>
              Appointment
            </span>
          </span>
        </h2>

        <p className="booking__text">
          Tell us what you are after and when suits you. We will open WhatsApp
          with your request already written — send it and we will confirm the
          slot in that chat, usually within the hour. Or call us and we will
          book you in on the spot.
        </p>

        <dl className="booking__contact">
          {[
            ...CONTACT,
            { label: 'Hours', value: summarizeHours(catalog.hours) },
          ].map(({ label, value, href }) => (
            <div key={label} className="booking__contact-row">
              <dt>{label}</dt>
              <dd>
                {href ? <a href={href}>{value}</a> : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="booking__panel">
        {status === 'sent' ? (
          <div className="booking__sent" role="status">
            <p className="booking__sent-title">Over to WhatsApp</p>
            <p className="booking__sent-text">
              Your request is written out and waiting in WhatsApp — send it and
              we will confirm your slot in that chat. If nothing opened, call us
              on <a href={PHONE_HREF}>{PHONE}</a>.
            </p>
            <button
              type="button"
              className="booking__reset"
              onClick={() => {
                setForm(EMPTY_FORM)
                setStatus('idle')
              }}
            >
              Book another
            </button>
          </div>
        ) : (
          <form className="booking__form" onSubmit={onSubmit}>
            <label className="booking__field">
              <span>Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Your full name"
              />
            </label>

            <label className="booking__field">
              <span>Phone</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={update('phone')}
                placeholder={PHONE}
              />
            </label>

            <label className="booking__field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </label>

            <label className="booking__field">
              <span>Service</span>
              <select required value={form.serviceId} onChange={update('serviceId')}>
                <option value="" disabled>
                  {categories.length ? 'Choose a service' : 'Loading services…'}
                </option>
                {categories.map((category) => (
                  <optgroup key={category.id} label={category.name}>
                    {category.treatments.map((treatment) => (
                      <option key={treatment.id} value={treatment.id}>
                        {treatment.name} — {formatPrice(treatment)}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="unsure">Not sure yet</option>
              </select>
            </label>

            <label className="booking__field">
              <span>Date</span>
              <input
                type="date"
                required
                min={today()}
                value={form.date}
                onChange={update('date')}
              />
            </label>

            <label className="booking__field">
              <span>Time</span>
              <select
                value={form.time}
                onChange={update('time')}
                disabled={!form.date || closedThatDay}
              >
                <option value="">
                  {!form.date
                    ? 'Pick a date first'
                    : closedThatDay
                      ? 'Closed that day'
                      : 'First available'}
                </option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTime(slot)}
                  </option>
                ))}
              </select>
            </label>

            <label className="booking__field booking__field--wide">
              <span>Notes</span>
              <textarea
                rows="3"
                value={form.notes}
                onChange={update('notes')}
                placeholder="Anything we should know before your visit?"
              />
            </label>

            <button type="submit" className="booking__submit">
              Book on WhatsApp
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Booking
