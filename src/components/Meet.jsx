import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import { HIGHLIGHTS, OWNER, PORTRAITS } from '../data/owner.js'
import './Meet.css'

/**
 * The owner, introduced on the home page in the slot About Us used to hold.
 * Reads from the same `owner.js` the Story block and /owner page use, so her
 * bio can never say three different things in three places.
 */
function Meet() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  // hover flips on a mouse; the toggle is what makes it work on touch
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`meet ${visible ? 'is-visible' : ''}`}
    >
      <h2 className="meet__title">
        <span className="meet__mask">
          <span className="meet__line">
            The Woman
            <Badge label="About Us" delay={1.4} />
            Behind
          </span>
        </span>
        <span className="meet__mask">
          <span className="meet__line" style={{ '--delay': '0.14s' }}>
            Lounge8
          </span>
        </span>
      </h2>

      <div className="meet__body">
        <figure className="meet__portrait">
          <button
            type="button"
            className={`meet__portrait-frame ${flipped ? 'is-flipped' : ''}`}
            aria-pressed={flipped}
            aria-label={`Show another photo of ${OWNER.name}`}
            onClick={() => setFlipped((f) => !f)}
          >
            <span className="meet__portrait-flipper">
              <span className="meet__portrait-face">
                <img src={OWNER.photo} alt={OWNER.name} />
              </span>
              <span className="meet__portrait-face meet__portrait-face--back">
                <img src={PORTRAITS[0]} alt="" />
              </span>
            </span>
          </button>
        </figure>

        <div className="meet__text">
          <p className="meet__name">{OWNER.name}</p>
          <p className="meet__role">{OWNER.role}</p>
          <span className="meet__rule" aria-hidden="true" />
          <p className="meet__bio">{OWNER.bio}</p>

          <dl className="meet__highlights">
            {HIGHLIGHTS.map(({ value, label }, i) => (
              <div key={label} className="meet__highlight" style={{ '--i': i }}>
                <dt className="meet__highlight-value">{value}</dt>
                <dd className="meet__highlight-label">{label}</dd>
              </div>
            ))}
          </dl>

          <a href="/owner" className="meet__link">
            Read More
          </a>
        </div>
      </div>
    </section>
  )
}

export default Meet
