import { useEffect, useRef, useState } from 'react'
import { ClockIcon, CloseIcon } from './icons.jsx'
import { formatPrice } from '../data/services.js'
import { OPENING_HOURS, formatTime } from '../data/salon.js'
import { PHONE } from '../data/contact.js'
import WhatsAppHandoff from './WhatsAppHandoff.jsx'
import {
  EMPTY_FORM,
  bookingLink,
  bookingMessage,
  sendBooking,
  formatDate,
  today,
  useTimeSlots,
} from '../data/booking.js'
import './TreatmentModal.css'

/** Books the treatment the popup is already showing, so no service picker. */
function TreatmentBooking({ treatment, onDone }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, serviceId: treatment.id })
  const [status, setStatus] = useState('idle') // idle | sent
  const [sent, setSent] = useState(null)

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
    const payload = { ...form, serviceName: treatment.name }
    sendBooking(payload)
    setSent({ link: bookingLink(payload), message: bookingMessage(payload) })
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="modal__done" role="status">
        <p className="modal__done-title">Over to WhatsApp</p>
        <p className="modal__done-text">
          {treatment.name} on {formatDate(form.date)}
          {form.time ? ` at ${formatTime(form.time)}` : ''} — your request is
          written out and waiting in WhatsApp. Nothing is booked until you send
          it.
        </p>
        <WhatsAppHandoff
          link={sent.link}
          message={sent.message}
          onDone={onDone}
        />
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

/**
 * Booking a single treatment. There is deliberately no write-up step in
 * front of this: the menu already carries the name, price, and duration, so
 * an intermediate screen only stood between the client and the form.
 */
function TreatmentModal({ treatment, onClose }) {
  const closeRef = useRef(null)

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
          <img src={treatment.images[0]} alt="" className="modal__image" />
        </div>

        <div className="modal__body">
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

          {treatment.ownSummary && (
            <p className="modal__summary">{treatment.ownSummary}</p>
          )}

          <TreatmentBooking treatment={treatment} onDone={onClose} />
        </div>
      </div>
    </div>
  )
}

export default TreatmentModal
