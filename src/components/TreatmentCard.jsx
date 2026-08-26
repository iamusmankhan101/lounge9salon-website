import { ClockIcon } from './icons.jsx'
import { formatPrice } from '../data/services.js'
import './Services.css'

/** One treatment tile — used in the services grid and inside the category popup. */
function TreatmentCard({ treatment, index = 0, onOpen }) {
  return (
    <article
      className="services__item"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <h4 className="services__item-name">{treatment.name}</h4>

      <p className="services__item-meta">
        <span className="services__item-price">{formatPrice(treatment)}</span>
        <span className="services__item-duration">
          <span className="services__item-clock">
            <ClockIcon />
          </span>
          {treatment.duration}
        </span>
      </p>

      <p className="services__item-summary">{treatment.summary}</p>

      <div className="services__item-actions">
        <button type="button" className="services__book" onClick={onOpen}>
          Book Now
        </button>
        <button type="button" className="services__learn" onClick={onOpen}>
          Learn More
        </button>
      </div>
    </article>
  )
}

export default TreatmentCard
