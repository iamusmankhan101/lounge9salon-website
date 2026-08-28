import { WHATSAPP_HREF } from '../data/contact.js'
import './Hero.css'

const NAV_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contacts', href: '#contact' },
]

/**
 * The shot the hero is built around. Swap this one line to change it, but keep
 * the frame vertical with the subject on the right: on desktop the left of the
 * image fades out under the headline, and the top of it is what shows, so
 * anything that matters needs to sit high and right. This crop of the shopfront
 * is cut to those rules — the full-frame original is in photos-original/.
 */
const HERO_IMAGE = '/gallery/2V3A4516ARP-hero.jpg'

function Hero() {
  return (
    <section className="hero">
      <div
        className="hero__media"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />

      <header className="hero__nav">
        <a href="#" className="hero__logo">
          <img
            src="/lounge-8-salon-logo.png"
            alt="Lounge 8 Salon"
            className="brand-logo"
          />
        </a>

        <nav className="hero__links">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a href="#book" className="hero__cta-button">
          Book an Appointment
        </a>
      </header>

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-text">Salon &amp; Beauty Lounge</span>
          <span className="hero__eyebrow-rule" aria-hidden="true" />
        </p>

        <h1 className="hero__title">
          <span className="hero__mask">
            <span className="hero__rise">
              Experience the{' '}
              <span className="hero__accent">
                <em>Art of Hair</em>
              </span>
            </span>
          </span>
          <span className="hero__mask">
            <span className="hero__rise" style={{ '--delay': '0.12s' }}>
              at Lounge 8 Salon
            </span>
          </span>
        </h1>

        <p className="hero__lead">
          Hair, skin, nails, and bridal work in DHA Phase 1, Lahore — planned
          around the hair and skin you actually have, never a fixed menu.
        </p>

        <div className="hero__actions">
          <a href="/services" className="hero__action hero__action--solid">
            Explore Our Services
          </a>
          <a
            href={WHATSAPP_HREF}
            className="hero__action hero__action--ghost"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
