import { useEffect, useRef, useState } from 'react'
import './Story.css'

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
    <section
      id="story"
      ref={sectionRef}
      className={`story ${visible ? 'is-visible' : ''}`}
    >
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
      </div>
    </section>
  )
}

export default Story
