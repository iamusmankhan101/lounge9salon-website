import { useEffect, useState } from 'react'
import ComingSoon from './components/ComingSoon.jsx'
import AdminPage from './pages/AdminPage.jsx'
import Home from './pages/Home.jsx'
import OwnerPage from './pages/OwnerPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import './App.css'

/**
 * The holding page is the front door at "/". The finished site lives behind
 * named routes so it can be reviewed before launch — swap the fallback here
 * when the salon is ready to open.
 */
const ROUTES = {
  '/home': Home,
  '/services': ServicesPage,
  '/owner': OwnerPage,
  '/admin': AdminPage,
}

const currentPath = () =>
  window.location.pathname.replace(/\/+$/, '').toLowerCase()

function App() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    // keep the view in step with browser back/forward
    const sync = () => setPath(currentPath())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const Page = ROUTES[path] ?? ComingSoon
  return <Page />
}

export default App
