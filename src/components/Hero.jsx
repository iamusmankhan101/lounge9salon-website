import './Hero.css'

const NAV_LINKS = ['About Us', 'Services', 'Blog', 'Contacts']

function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" />
      <div className="hero__overlay" />

      <header className="hero__nav">
        <a href="#" className="hero__logo">
          LOUNGE<span className="hero__logo-eight">8</span>
        </a>

        <nav className="hero__links">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </nav>

        <a href="#" className="hero__cta-button">
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
        <a href="#" className="hero__cta-link">
          Book an Appointment
        </a>
      </div>

      <h1 className="hero__title">
        <span className="hero__mask">
          <span className="hero__rise">Beauty Salon</span>
        </span>
      </h1>
    </section>
  )
}

export default Hero
