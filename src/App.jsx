import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyPage from './pages/PropertyPage'
import Demo2Page from './pages/Demo2Page'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => window.clearTimeout(timer)
    }

    window.scrollTo(0, 0)
    return undefined
  }, [pathname, hash])

  return null
}

function AppShell() {
  const { pathname } = useLocation()
  const isDemo2 = pathname === '/demo-2'

  return (
    <div className={`site${isDemo2 ? ' site--demo-2' : ''}`} id="top">
      <ScrollManager />
      {!isDemo2 ? <Navbar /> : null}
      {isDemo2 ? (
        <Routes>
          <Route path="/demo-2" element={<Demo2Page />} />
        </Routes>
      ) : (
        <>
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:propertyId" element={<PropertyPage />} />
              <Route path="/demo-2" element={<Demo2Page />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
