import { useEffect, useRef, useState } from 'react'
import Badge from './Badge.jsx'
import './About.css'

function About() {
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
      { threshold: 0.3 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const lineDelay = (i) => ({ transitionDelay: `${i * 0.18}s` })

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about ${visible ? 'is-visible' : ''}`}
    >
      <h2 className="about__title">
        <span className="about__line-mask">
          <span className="about__line" style={lineDelay(0)}>
            We
            <Badge label="About Us" delay={1.6} />
            Help Create
          </span>
        </span>
        <span className="about__line-mask">
          <span className="about__line" style={lineDelay(1)}>
            Moments of Beauty
          </span>
        </span>
        <span className="about__line-mask">
          <span className="about__line" style={lineDelay(2)}>
            For You
            <Badge label="About Us" delay={1.8} />
            And
          </span>
        </span>
        <span className="about__line-mask">
          <span className="about__line" style={lineDelay(3)}>
            Your Glow
            <Badge label="About Us" delay={2} />
          </span>
        </span>
      </h2>

      <p className="about__text">
        Lounge8 is a premium beauty studio for women, offering expert care for
        skin, body, and hair. We provide personalized consultations to select
        treatments that precisely address each client&apos;s individual needs.
      </p>

      <a href="#story" className="about__read-more">
        Read More
      </a>
    </section>
  )
}

export default About
