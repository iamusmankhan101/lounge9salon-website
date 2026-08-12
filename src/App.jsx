import { useEffect, useState } from 'react'
import ComingSoon from './components/ComingSoon.jsx'
import Home from './pages/Home.jsx'
import './App.css'

/**
 * The holding page is the front door at "/". The finished home page lives at
 * "/home" so it can be reviewed before launch — swap the default here when
 * the salon is ready to open.
 */
const isHomeRoute = () =>
  window.location.pathname.replace(/\/+$/, '').toLowerCase() === '/home'

function App() {
  const [home, setHome] = useState(isHomeRoute)

  useEffect(() => {
    // keep the view in step with browser back/forward
    const sync = () => setHome(isHomeRoute())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return home ? <Home /> : <ComingSoon />
}

export default App
