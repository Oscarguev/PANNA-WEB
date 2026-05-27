import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import PageLoader from './components/PageLoader'

const MenuPage    = lazy(() => import('./pages/MenuPage'))
const MarketPage  = lazy(() => import('./pages/MarketPage'))
const EventsPage  = lazy(() => import('./pages/EventsPage'))
const ClubPage    = lazy(() => import('./pages/ClubPage'))
const ReservarPage  = lazy(() => import('./pages/ReservarPage'))
const AdminPage     = lazy(() => import('./pages/AdminPage'))
const TermsPage     = lazy(() => import('./pages/TermsPage'))
const PrivacyPage   = lazy(() => import('./pages/PrivacyPage'))
const CookiesPage   = lazy(() => import('./pages/CookiesPage'))
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'))

const Lazy = ({ Page }) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,       element: <Home /> },
      { path: 'menu',      element: <Lazy Page={MenuPage} /> },
      { path: 'market',    element: <Lazy Page={MarketPage} /> },
      { path: 'events',    element: <Lazy Page={EventsPage} /> },
      { path: 'club',      element: <Lazy Page={ClubPage} /> },
      { path: 'reservar',  element: <Lazy Page={ReservarPage} /> },
      { path: 'terminos',  element: <Lazy Page={TermsPage} /> },
      { path: 'privacidad', element: <Lazy Page={PrivacyPage} /> },
      { path: 'cookies',   element: <Lazy Page={CookiesPage} /> },
      { path: '*',         element: <Lazy Page={NotFoundPage} /> },
    ],
  },
])
