import './Hero.css'

const NAV_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contacts', href: '#contact' },
]

function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__overlay" />

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
        <p className="hero__tagline">
          <span className="hero__mask">
            <span className="hero__rise">
              Your glow begins here. Welcome to Lounge8.
            </span>
          </span>
        </p>

        <h1 className="hero__title">
          <span className="hero__mask">
            <span className="hero__rise">Lounge8 Salon</span>
          </span>
        </h1>

        <a href="#book" className="hero__cta-link">
          Book an Appointment
        </a>
      </div>
    </section>
  )
}

export default Hero
