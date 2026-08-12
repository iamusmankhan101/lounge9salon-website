import { useEffect, useState } from 'react'
import ComingSoon from './components/ComingSoon.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Story from './components/Story.jsx'
import Gallery from './components/Gallery.jsx'
import './App.css'

/**
 * The holding page is the front door. The finished site stays reachable at
 * ?preview (or #preview) so it can be reviewed before launch — swap the
 * default here when the salon is ready to open.
 */
const isPreview = () =>
  new URLSearchParams(window.location.search).has('preview') ||
  window.location.hash === '#preview'

function App() {
  const [preview, setPreview] = useState(isPreview)

  useEffect(() => {
    const sync = () => setPreview(isPreview())
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  if (!preview) return <ComingSoon />

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Story />
      <Gallery />
    </>
  )
}

export default App
