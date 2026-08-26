import { useEffect, useRef } from 'react'
import { ClockIcon, CloseIcon } from './icons.jsx'
import { formatPrice } from '../data/services.js'
import './CategoryModal.css'

/** One line of the menu: number, name, dotted leader, price, and a book pill. */
function MenuRow({ treatment, index, onOpen, onBook }) {
  return (
    <li className="menu-row" style={{ animationDelay: `${index * 0.04}s` }}>
      <button
        type="button"
        className="menu-row__open"
        onClick={onOpen}
        aria-label={`Details for ${treatment.name}`}
      >
        <span className="menu-row__number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="menu-row__name">{treatment.name}</span>
        <span className="menu-row__leader" aria-hidden="true" />
        <span className="menu-row__price">{formatPrice(treatment)}</span>

        <span className="menu-row__sub">
          <span className="menu-row__duration">
            <span className="menu-row__clock">
              <ClockIcon />
            </span>
            {treatment.duration}
          </span>
          {treatment.ownSummary && (
            <span className="menu-row__summary">{treatment.ownSummary}</span>
          )}
        </span>
      </button>

      <button type="button" className="menu-row__book" onClick={onBook}>
        Book
      </button>
    </li>
  )
}

/**
 * The popup a service category card opens: the category write-up, then every
 * treatment in it. `suspended` is set while a treatment popup sits on top, so
 * Escape closes that one first instead of both at once.
 */
function CategoryModal({ category, suspended = false, onOpenTreatment, onClose }) {
  const closeRef = useRef(null)

  // hold the page still for as long as the dialog is open
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    if (suspended) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, suspended])

  const { Icon } = category

  return (
    <div
      className="category-modal"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="category-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        <div className="category-modal__head">
          <img
            src={category.image}
            alt=""
            className="category-modal__image"
            loading="lazy"
          />

          <div className="category-modal__intro">
            <p className="category-modal__eyebrow">
              <span className="category-modal__icon" aria-hidden="true">
                <Icon />
              </span>
              {category.count} service{category.count === 1 ? '' : 's'}
            </p>

            <h3 className="category-modal__name" id="category-modal-title">
              {category.name}
            </h3>

            <div className="category-modal__text">
              {category.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="category-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="category-modal__menu">
          {category.treatments.map((treatment, i) => (
            <MenuRow
              key={treatment.id ?? treatment.name}
              treatment={treatment}
              index={i}
              onOpen={() => onOpenTreatment(treatment)}
              onBook={() => onOpenTreatment(treatment, { book: true })}
            />
          ))}
        </ul>

        <p className="category-modal__foot">
          Tap any treatment for what is involved — nothing is confirmed until
          you send the request on WhatsApp.
        </p>
      </div>
    </div>
  )
}

export default CategoryModal
