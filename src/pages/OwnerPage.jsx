import Footer from '../components/Footer.jsx'
import {
  EDUCATION,
  EXPERIENCE,
  HIGHLIGHTS,
  OWNER,
  SKILLS,
  SUMMARY,
} from '../data/owner.js'
import './OwnerPage.css'

function OwnerPage() {
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

      <section className="owner__intro">
        <div className="owner__intro-text">
          <p className="owner__eyebrow">{OWNER.role}, Lounge8</p>
          <h1 className="owner__title">{OWNER.name}</h1>

          <div className="owner__lead">
            {SUMMARY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="owner__highlights">
            {HIGHLIGHTS.map(({ value, label }) => (
              <div key={label} className="owner__highlight">
                <dt className="owner__highlight-value">{value}</dt>
                <dd className="owner__highlight-label">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <img
          src={OWNER.photo}
          alt={OWNER.name}
          className="owner__portrait"
        />
      </section>

      <section className="owner__section">
        <h2 className="owner__section-title">Experience</h2>

        <ol className="owner__timeline">
          {EXPERIENCE.map(({ role, org, period }) => (
            <li key={`${role}${org}`} className="owner__entry">
              <p className="owner__entry-period">{period ?? 'Ongoing'}</p>
              <div>
                <h3 className="owner__entry-role">{role}</h3>
                <p className="owner__entry-org">{org}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="owner__section owner__section--split">
        <div>
          <h2 className="owner__section-title">Qualifications</h2>

          <ul className="owner__education">
            {EDUCATION.map(({ qualification, place, year }) => (
              <li key={qualification} className="owner__qualification">
                <div>
                  <p className="owner__qualification-name">{qualification}</p>
                  {place && <p className="owner__qualification-place">{place}</p>}
                </div>
                <p className="owner__qualification-year">{year}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="owner__section-title">Specialisms</h2>

          <ul className="owner__skills">
            {SKILLS.map((skill) => (
              <li key={skill} className="owner__skill">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="owner__closing">
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
