import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer.jsx'
import {
  EDUCATION,
  EXPERIENCE,
  HIGHLIGHTS,
  OWNER,
  PORTRAITS,
  SKILLS,
  SUMMARY,
} from '../data/owner.js'
import './OwnerPage.css'

/**
 * Adds `is-in` the first time a block scrolls into view, then stops watching —
 * these reveals play once, so there is nothing to observe afterwards.
 *
 * The intro sits at the top of the page and so fires on mount, which is what
 * gives it its entrance.
 */
function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

/** Staggers list children off their index. */
const step = (i) => ({ '--i': i })

function OwnerPage() {
  const [introRef, introIn] = useInView(0)
  const [experienceRef, experienceIn] = useInView()
  const [detailRef, detailIn] = useInView(0.1)
  const [portraitsRef, portraitsIn] = useInView(0.15)
  const [closingRef, closingIn] = useInView(0.3)

  return (
    <div className="owner-page">
      <header className="owner__header">
        <a href="/home" className="owner__logo">
          <img
            src="/lounge-8-salon-logo.png"
            alt="Lounge 8 Salon"
            className="brand-logo"
          />
        </a>

        <nav className="owner__nav">
          <a href="/home">Home</a>
          <a href="/services">Services</a>
          <a href="/home#gallery">Gallery</a>
          <a href="/home#contact">Contacts</a>
        </nav>

        <a href="/home#book" className="owner__cta">
          Book an Appointment
        </a>
      </header>

      <section
        ref={introRef}
        className={`owner__intro ${introIn ? 'is-in' : ''}`}
      >
        <div className="owner__intro-text">
          <p className="owner__eyebrow">{OWNER.role}, Lounge8</p>

          <h1 className="owner__title">
            <span className="owner__mask">
              <span className="owner__rise">{OWNER.name}</span>
            </span>
          </h1>

          <div className="owner__lead">
            {SUMMARY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="owner__highlights">
            {HIGHLIGHTS.map(({ value, label }, i) => (
              <div key={label} className="owner__highlight" style={step(i)}>
                <dt className="owner__highlight-value">{value}</dt>
                <dd className="owner__highlight-label">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <img src={OWNER.photo} alt={OWNER.name} className="owner__portrait" />
      </section>

      <section
        ref={experienceRef}
        className={`owner__section ${experienceIn ? 'is-in' : ''}`}
      >
        <h2 className="owner__section-title">Experience</h2>

        <ol className="owner__timeline">
          {EXPERIENCE.map(({ role, org, period }, i) => (
            <li
              key={`${role}${org}`}
              className="owner__entry"
              style={step(i)}
            >
              <p className="owner__entry-period">{period ?? 'Ongoing'}</p>
              <div>
                <h3 className="owner__entry-role">{role}</h3>
                <p className="owner__entry-org">{org}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        ref={detailRef}
        className={`owner__section owner__section--split ${
          detailIn ? 'is-in' : ''
        }`}
      >
        <div>
          <h2 className="owner__section-title">Qualifications</h2>

          <ul className="owner__education">
            {EDUCATION.map(({ qualification, place, year }, i) => (
              <li
                key={qualification}
                className="owner__qualification"
                style={step(i)}
              >
                <div>
                  <p className="owner__qualification-name">{qualification}</p>
                  {place && (
                    <p className="owner__qualification-place">{place}</p>
                  )}
                </div>
                <p className="owner__qualification-year">{year}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="owner__section-title">Specialisms</h2>

          <ul className="owner__skills">
            {SKILLS.map((skill, i) => (
              <li key={skill} className="owner__skill" style={step(i)}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div
        ref={portraitsRef}
        className={`owner__portraits ${portraitsIn ? 'is-in' : ''}`}
        // how far one copy runs, so the loop stays right as the list grows
        style={{ '--count': PORTRAITS.length }}
      >
        {/**
         * The track holds the list twice and slides left by exactly one copy
         * before restarting, which reads as an endless band. Both copies are
         * rendered, since the second is what fills the gap the first leaves
         * behind as it exits.
         */}
        <div className="owner__portraits-track">
          {[...PORTRAITS, ...PORTRAITS].map((src, i) => (
            <span
              key={`${src}-${i}`}
              className="owner__portraits-frame"
              // the duplicate copy is scenery, not content
              aria-hidden={i >= PORTRAITS.length ? 'true' : undefined}
            >
              {/* not lazy: a frame that loads as it slides in arrives blank,
                  and the whole band is only a few hundred kilobytes */}
              <img
                src={src}
                alt=""
                decoding="async"
                className="owner__portraits-image"
              />
            </span>
          ))}
        </div>
      </div>

      <section
        ref={closingRef}
        className={`owner__closing ${closingIn ? 'is-in' : ''}`}
      >
        <p className="owner__closing-text">
          Every treatment at Lounge8 starts with a consultation — Samia and her
          team choose what suits you, rather than selling from a list.
        </p>
        <a href="/home#book" className="owner__closing-cta">
          Book an Appointment
        </a>
      </section>

      <Footer />
    </div>
  )
}

export default OwnerPage
