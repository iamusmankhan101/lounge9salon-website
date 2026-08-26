import { useEffect, useRef } from 'react'
import { CloseIcon } from './icons.jsx'
import TreatmentCard from './TreatmentCard.jsx'
import './CategoryModal.css'

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
        <button
          ref={closeRef}
          type="button"
          className="category-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

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
        </div>

        <div className="category-modal__list">
          {category.treatments.map((treatment, i) => (
            <TreatmentCard
              key={treatment.id ?? treatment.name}
              treatment={treatment}
              index={i}
              onOpen={() => onOpenTreatment(treatment)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryModal
