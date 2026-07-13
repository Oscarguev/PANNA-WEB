/* eslint-disable react-refresh/only-export-components */
// Los `lazy()` y el `router` exportado son intencionalmente no-componentes:
// referencias necesarias para React Router. Fast Refresh no aplica aquí.
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import PageLoader from './components/PageLoader'
import LazyRoute from './components/LazyRoute'

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
      { path: 'menu',      element: <LazyRoute Page={MenuPage} /> },
      { path: 'market',    element: <LazyRoute Page={MarketPage} /> },
      { path: 'events',    element: <LazyRoute Page={EventsPage} /> },
      { path: 'club',      element: <LazyRoute Page={ClubPage} /> },
      { path: 'reservar',  element: <LazyRoute Page={ReservarPage} /> },
      { path: 'terminos',  element: <LazyRoute Page={TermsPage} /> },
      { path: 'privacidad', element: <LazyRoute Page={PrivacyPage} /> },
      { path: 'cookies',   element: <LazyRoute Page={CookiesPage} /> },
      { path: '*',         element: <LazyRoute Page={NotFoundPage} /> },
    ],
  },
])