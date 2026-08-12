import { useEffect, useRef } from 'react'
import { ClockIcon, CloseIcon, StarIcon } from './icons.jsx'
import { formatPrice } from '../data/services.js'
import './TreatmentModal.css'

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

          <a href="#book" className="modal__book" onClick={onClose}>
            Book Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default TreatmentModal
