import { groupHours, useSalon } from '../data/salon.js'
import './Footer.css'

const SITE_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '/services' },
  { label: 'Our Story', href: '#story' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Book an Appointment', href: '#book' },
]

/** In-page anchors only work on the home page — elsewhere they need the path. */
const resolve = (href) =>
  href.startsWith('#') && !window.location.pathname.startsWith('/home')
    ? `/home${href}`
    : href

function Footer() {
  // opening hours come from the salon software, never a hardcoded copy
  const { hours } = useSalon()

  return (
    <footer id="contact" className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img
            src="/lounge-8-salon-logo.png"
            alt="Lounge 8 Salon"
            className="brand-logo footer__logo"
          />
          <p className="footer__blurb">
            A premium beauty studio for skin, body, and hair — built as a
            gentle space to reconnect with yourself.
          </p>
        </div>

        <nav className="footer__col">
          <h3 className="footer__heading">Explore</h3>
          <ul>
            {SITE_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={resolve(href)}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h3 className="footer__heading">Opening Hours</h3>
          <ul>
            {groupHours(hours).map(({ key, days, time }) => (
              <li key={key} className="footer__hours-row">
                <span>{days}</span>
                <span className="footer__hours-time">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Get in Touch</h3>
          <ul>
            <li>
              <a href="tel:+923000000000">+92 300 000 0000</a>
            </li>
            <li>
              <a href="mailto:hello@lounge8.com">hello@lounge8.com</a>
            </li>
            <li className="footer__address">Lahore, Pakistan</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Lounge 8 Salon. All rights reserved.</p>
        <a href={resolve('#book')} className="footer__cta">
          Book an Appointment
        </a>
      </div>
    </footer>
  )
}

export default Footer
