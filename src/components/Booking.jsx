import { useEffect, useMemo, useRef, useState } from 'react'
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
  serviceId: '',
  date: '',
  time: '',
  notes: '',
}

const today = () => new Date().toISOString().split('T')[0]

/** Half-hour starts that still leave room for the treatment before closing. */
function timeSlots(from, to, durationMin) {
  const toMinutes = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const end = toMinutes(to)
  const slots = []
  for (
    let t = toMinutes(from);
    t + Math.max(durationMin, 30) <= end;
    t += 30
  ) {
    slots.push(
      `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`,
    )
  }
  return slots
}

function formatTime(value) {
  const [h, m] = value.split(':').map(Number)
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

function Booking() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [catalog, setCatalog] = useState({ services: [], hours: [] })

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

  // live services and opening hours out of the salon's booking software
  useEffect(() => {
    let cancelled = false
    fetch('/api/salon')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && !cancelled) setCatalog(data)
      })
      .catch(() => {
        // the form still submits without a catalogue — staff confirm the detail
      })
    return () => {
      cancelled = true
    }
  }, [])

  const service = catalog.services.find((item) => item.id === form.serviceId)

  // the salon runs 100+ services, so the dropdown groups them by category
  const grouped = useMemo(() => {
    const groups = new Map()
    for (const item of catalog.services) {
      const key = item.category || 'other'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(item)
    }
    return [...groups.entries()]
  }, [catalog.services])

  // the salon is not open the same hours every day, so slots follow the date
  const slots = useMemo(() => {
    if (!form.date) return []
    const [y, m, d] = form.date.split('-').map(Number)
    const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long',
    })
    const hours = catalog.hours.find((entry) => entry.day === dayName)
    if (!hours || !hours.open) return []
    return timeSlots(hours.from, hours.to, service?.durationMin || 60)
  }, [form.date, catalog.hours, service])

  const closedThatDay = Boolean(form.date && catalog.hours.length && !slots.length)

  const update = (field) => (event) => {
    const { value } = event.target
    // a different treatment or day invalidates the slot already picked
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'date' || field === 'serviceId' ? { time: '' } : null),
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serviceName: service?.name || 'Not sure yet',
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'We could not send that request.')
      }

      setStatus('sent')
      setForm(EMPTY_FORM)
    } catch (submitError) {
      // the form keeps its values so nothing typed is lost on a failure
      setStatus('error')
      setError(
        submitError.message ||
          'Something went wrong. Please try again or call us.',
      )
    }
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
          Tell us what you are after and when suits you. Your slot goes straight
          into our diary and we will send a WhatsApp confirmation — or call us
          and we will book you in on the spot.
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
        {status === 'sent' ? (
          <div className="booking__sent" role="status">
            <p className="booking__sent-title">Appointment booked</p>
            <p className="booking__sent-text">
              Thank you — your slot is in the diary and a confirmation is on its
              way to your WhatsApp.
            </p>
            <button
              type="button"
              className="booking__reset"
              onClick={() => setStatus('idle')}
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
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </label>

            <label className="booking__field">
              <span>Service</span>
              <select required value={form.serviceId} onChange={update('serviceId')}>
                <option value="" disabled>
                  {catalog.services.length ? 'Choose a service' : 'Loading services…'}
                </option>
                {grouped.map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                        {item.price
                          ? ` — PKR ${item.price.toLocaleString()}`
                          : ''}
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

            {status === 'error' && (
              <p className="booking__error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="booking__submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Booking…' : 'Book Appointment'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Booking
