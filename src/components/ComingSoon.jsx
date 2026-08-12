import { useEffect, useState } from 'react'
import './ComingSoon.css'

/** Launch date — ten days out. Set this to the real one before going live. */
const LAUNCH_DATE = new Date('2026-08-22T09:00:00')

const UNITS = ['days', 'hours', 'minutes', 'seconds']

function getRemaining(target) {
  const diff = Math.max(target.getTime() - Date.now(), 0)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

function useCountdown(target) {
  const [remaining, setRemaining] = useState(() => getRemaining(target))

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return remaining
}

function ComingSoon() {
  const remaining = useCountdown(LAUNCH_DATE)
  const [email, setEmail] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    // TODO: connect to a mailing list provider — nothing is sent yet.
    setSignedUp(true)
    setEmail('')
  }

  return (
    <main className="soon">
      <div className="soon__bg" />
      <div className="soon__overlay" />

      <header className="soon__header">
        <p className="soon__logo">
          <img src="/lounge-8-salon-logo.png" alt="Lounge 8 Salon" />
        </p>
        <p className="soon__location">Pakistan</p>
      </header>

      <div className="soon__center">
        <p className="soon__eyebrow">Beauty Salon — Opening Soon</p>

        <h1 className="soon__title">
          <span className="soon__mask">
            <span className="soon__rise">Coming</span>
          </span>
          <span className="soon__mask">
            <span className="soon__rise" style={{ '--delay': '0.15s' }}>
              Soon
            </span>
          </span>
        </h1>

        <p className="soon__tagline">
          Your glow begins here. We are putting the final touches to a space
          built for skin, body, and hair — and for the time you spend on
          yourself.
        </p>

        <ul className="soon__countdown">
          {UNITS.map((unit) => (
            <li key={unit} className="soon__unit">
              <span className="soon__unit-value">
                {String(remaining[unit]).padStart(2, '0')}
              </span>
              <span className="soon__unit-label">{unit}</span>
            </li>
          ))}
        </ul>

        {signedUp ? (
          <p className="soon__thanks" role="status">
            Thank you — we&apos;ll let you know the moment we open.
          </p>
        ) : (
          <form className="soon__form" onSubmit={onSubmit}>
            <label className="soon__field">
              <span className="soon__field-label">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="soon__input"
              />
            </label>
            <button type="submit" className="soon__submit">
              Notify Me
            </button>
          </form>
        )}
      </div>

      <footer className="soon__footer">
        <a href="mailto:hello@lounge8.com" className="soon__contact">
          hello@lounge8.com
        </a>
      </footer>
    </main>
  )
}

export default ComingSoon
