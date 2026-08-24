import { useEffect, useState } from 'react'
import AdminPage from './pages/AdminPage.jsx'
import Home from './pages/Home.jsx'
import OwnerPage from './pages/OwnerPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import './App.css'

/**
 * The site is live: "/" serves the home page, and "/home" is kept alongside it
 * because links to that path are already out in the world.
 */
const ROUTES = {
  '': Home,
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

  const Page = ROUTES[path] ?? Home
  return <Page />
}

export default App
