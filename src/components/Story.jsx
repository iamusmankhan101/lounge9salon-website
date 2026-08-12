import { useEffect, useRef, useState } from 'react'
import './Story.css'

const STATS = [
  { label: 'Years of Experience', value: 5 },
  { label: 'Team', value: 16 },
  { label: 'Area', value: 465, suffix: ' sq.m.' },
]

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts from zero up to `value` once `active` flips true. */
function CountUp({ value, active, duration = 1600, delay = 0 }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!active) return undefined

    if (prefersReducedMotion()) {
      setShown(value)
      return undefined
    }

    let frame
    let start
    const step = (now) => {
      start ??= now
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setShown(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [active, value, duration, delay])

  return shown
}

function Story() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

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
    <section ref={sectionRef} className={`story ${visible ? 'is-visible' : ''}`}>
      <div className="story__bg" />
      <div className="story__overlay" />

      <div className="story__content">
        <h2 className="story__title">
          <span className="story__mask">
            <span className="story__line">The Story</span>
          </span>
          <span className="story__mask">
            <span className="story__line" style={{ '--delay': '0.15s' }}>
              Of Lounge8
            </span>
          </span>
        </h2>

        <div className="story__text">
          <p>
            Lounge8 was born from a simple belief: beauty is most powerful when
            it reflects how you feel inside.
          </p>
          <p>
            Inspired by nature, light, and the soft rhythm of self-care, our
            studio was created as a gentle space where women could reconnect
            with themselves — not just enhance their appearance.
          </p>
        </div>

        <h3 className="story__stats-label">Lounge8 in Numbers</h3>

        <dl className="story__stats">
          {STATS.map(({ label, value, suffix }, i) => (
            <div key={label} className="story__stat">
              <dt className="story__stat-label">{label}:</dt>
              <dd className="story__stat-value">
                <CountUp active={visible} value={value} delay={600 + i * 150} />
                {suffix}
              </dd>
            </div>
          ))}
        </dl>

        <a href="#" className="story__read-more">
          Read More
        </a>
      </div>
    </section>
  )
}

export default Story
