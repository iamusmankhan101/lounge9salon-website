import { useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '../data/services.js'
import './Booking.css'

const CONTACT = [
  { label: 'Phone', value: '+92 300 000 0000', href: 'tel:+923000000000' },
  { label: 'Email', value: 'hello@lounge8.com', href: 'mailto:hello@lounge8.com' },
  { label: 'Address', value: 'Lahore, Pakistan' },
  { label: 'Hours', value: 'Mon–Sat 10:00–20:00 · Sun closed' },
]

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  notes: '',
}

function Booking() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [sent, setSent] = useState(false)

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

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const onSubmit = (event) => {
    event.preventDefault()
    // TODO: post to a booking system — nothing is sent anywhere yet.
    setSent(true)
    setForm(EMPTY_FORM)
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
          Tell us what you are after and when suits you. We will confirm your
          slot within one working day — or call us and we will book you in on
          the spot.
        </p>

        <dl className="booking__contact">
          {CONTACT.map(({ label, value, href }) => (
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
        {sent ? (
          <div className="booking__sent" role="status">
            <p className="booking__sent-title">Request received</p>
            <p className="booking__sent-text">
              Thank you — we will be in touch within one working day to confirm
              your appointment.
            </p>
            <button
              type="button"
              className="booking__reset"
              onClick={() => setSent(false)}
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
                placeholder="+92 300 000 0000"
              />
            </label>

            <label className="booking__field">
              <span>Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </label>

            <label className="booking__field">
              <span>Service</span>
              <select required value={form.service} onChange={update('service')}>
                <option value="" disabled>
                  Choose a service
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </label>

            <label className="booking__field">
              <span>Preferred date</span>
              <input type="date" value={form.date} onChange={update('date')} />
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
              Request Appointment
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Booking
