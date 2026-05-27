import { useEffect, lazy, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import Lenis from 'lenis'
import { usePageView } from '../analytics/hooks/usePageView'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import CustomerPortal from '../components/CustomerPortal'
import CartToast from '../components/CartToast'
import WhatsAppButton from '../components/WhatsAppButton'
import CustomCursor from '../components/CustomCursor'
import LuxuryMotionConfig from '../motion/MotionConfig'
import AmbientLayer from '../motion/AmbientLayer'
import { supabase } from '../lib/supabase'
import { useSessionStore } from '../stores/useSessionStore'

const Newsletter = lazy(() => import('../components/Newsletter'))

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
}

export default function RootLayout() {
  const loadProfile = useSessionStore((s) => s.loadProfile)
  const logout      = useSessionStore((s) => s.logout)

  useEffect(() => {
    // Restaura sesión si el usuario ya estaba logueado
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id, data.session.user.email)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') logout()
      if (event === 'SIGNED_IN' && session?.user) {
        loadProfile(session.user.id, session.user.email)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    })

    window.lenis = lenis

    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  const { pathname } = useLocation()
  usePageView()

  useEffect(() => {
    window.lenis?.scrollTo(0, { immediate: true })
  }, [pathname])

  return (
    <LuxuryMotionConfig>
      <AmbientLayer />
      <Navbar />
      <AnimatePresence mode="sync" initial={false}>
        <m.div key={pathname} {...PAGE_TRANSITION}>
          <Outlet />
        </m.div>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <CustomerPortal />
      <CartToast />
      <WhatsAppButton />
      <CustomCursor />
      {pathname === '/' && <Suspense fallback={null}><Newsletter /></Suspense>}
    </LuxuryMotionConfig>
  )
}
