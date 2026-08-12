import { useEffect, useState } from 'react'
import ComingSoon from './components/ComingSoon.jsx'
import Home from './pages/Home.jsx'
import './App.css'

/**
 * The holding page is the front door. The finished home page stays reachable
 * at ?preview (or #preview) so it can be reviewed before launch — swap the
 * default here when the salon is ready to open.
 */
const isPreview = () =>
  new URLSearchParams(window.location.search).has('preview') ||
  window.location.hash === '#preview'

function App() {
  const [preview, setPreview] = useState(isPreview)

  useEffect(() => {
    // Sticky once on: in-page anchors change the hash, and dropping back to
    // the holding page mid-scroll would be jarring.
    const sync = () => setPreview((current) => current || isPreview())
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  return preview ? <Home /> : <ComingSoon />
}

export default App
