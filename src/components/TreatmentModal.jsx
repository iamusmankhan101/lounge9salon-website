import { useEffect, useRef, useState } from 'react'
import { ClockIcon, CloseIcon, StarIcon } from './icons.jsx'
import { formatPrice } from '../data/services.js'
import { OPENING_HOURS, formatTime } from '../data/salon.js'
import { PHONE, PHONE_HREF } from '../data/contact.js'
import {
  EMPTY_FORM,
  formatDate,
  sendBooking,
  today,
  useTimeSlots,
} from '../data/booking.js'
import './TreatmentModal.css'

/** Books the treatment the popup is already showing, so no service picker. */
function TreatmentBooking({ treatment, onDone }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, serviceId: treatment.id })
  const [status, setStatus] = useState('idle') // idle | sent

  const { slots, closed } = useTimeSlots(
    form.date,
    OPENING_HOURS,
    treatment.durationMin,
  )

  const update = (field) => (event) => {
    const { value } = event.target
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'date' ? { time: '' } : null),
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    sendBooking({ ...form, serviceName: treatment.name })
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="modal__done" role="status">
        <p className="modal__done-title">Over to WhatsApp</p>
        <p className="modal__done-text">
          {treatment.name} on {formatDate(form.date)}
          {form.time ? ` at ${formatTime(form.time)}` : ''} — your request is
          written out and waiting in WhatsApp. Send it and we will confirm the
          slot in that chat, or call us on <a href={PHONE_HREF}>{PHONE}</a>.
        </p>
        <button type="button" className="modal__book" onClick={onDone}>
          Done
        </button>
      </div>
    )
  }

  return (
    <form className="modal__form" onSubmit={onSubmit}>
      <p className="modal__form-title">
        Booking <strong>{treatment.name}</strong>
      </p>

      <label className="modal__field">
        <span>Name</span>
        <input
          type="text"
          required
          value={form.name}
          onChange={update('name')}
          placeholder="Your full name"
        />
      </label>

      <label className="modal__field">
        <span>Phone</span>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={update('phone')}
          placeholder={PHONE}
        />
      </label>

      <label className="modal__field">
        <span>Date</span>
        <input
          type="date"
          required
          min={today()}
          value={form.date}
          onChange={update('date')}
        />
      </label>

      <label className="modal__field">
        <span>Time</span>
        <select
          value={form.time}
          onChange={update('time')}
          disabled={!form.date || closed}
        >
          <option value="">
            {!form.date
              ? 'Pick a date first'
              : closed
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

      <label className="modal__field modal__field--wide">
        <span>Notes</span>
        <textarea
          rows="2"
          value={form.notes}
          onChange={update('notes')}
          placeholder="Anything we should know?"
        />
      </label>

      <button type="submit" className="modal__book">
        Book on WhatsApp
      </button>
    </form>
  )
}

function TreatmentModal({ treatment, onClose }) {
  const closeRef = useRef(null)
  const [booking, setBooking] = useState(false)

  // Close on Escape and hold the page still while the dialog is open.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="modal"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          ref={closeRef}
          type="button"
          className="modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="modal__gallery">
          {treatment.images.map((src) => (
            <img key={src} src={src} alt="" className="modal__image" />
          ))}
        </div>

        <div className="modal__body">
          {treatment.rating && (
            <p className="modal__rating">
              <span className="modal__stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} />
                ))}
              </span>
              {treatment.rating}
            </p>
          )}

          <h3 className="modal__name" id="modal-title">
            {treatment.name}
          </h3>

          <p className="modal__meta">
            <span className="modal__price">{formatPrice(treatment)}</span>
            <span className="modal__duration">
              <span className="modal__clock">
                <ClockIcon />
              </span>
              {treatment.duration}
            </span>
          </p>

          {booking ? (
            <TreatmentBooking treatment={treatment} onDone={onClose} />
          ) : (
            <>
              <p className="modal__summary">{treatment.summary}</p>

              {treatment.idealFor && (
                <>
                  <h4 className="modal__label">Ideal For:</h4>
                  <p className="modal__ideal">{treatment.idealFor}</p>
                </>
              )}

              {treatment.steps?.length > 0 && (
                <>
                  <h4 className="modal__label">What&apos;s Involved:</h4>
                  <ul className="modal__steps">
                    {treatment.steps.map((step) => (
                      <li key={step.name} className="modal__step">
                        <p className="modal__step-name">{step.name}</p>
                        <p className="modal__step-text">{step.text}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <button
                type="button"
                className="modal__book"
                onClick={() => setBooking(true)}
              >
                Book Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TreatmentModal
