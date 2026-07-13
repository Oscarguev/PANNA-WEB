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
import LuxuryMotionConfig from '../motion/MotionConfig'
import IntroOverlay from '../motion/IntroOverlay'
import { useIntroGate } from '../motion/useIntroGate'
import { EASE, MOTION } from '../motion/variants'
import { supabase } from '../lib/supabase'
import { useSessionStore } from '../stores/useSessionStore'

const Newsletter = lazy(() => import('../components/Newsletter'))

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: MOTION.route.pageOffsetY },
  animate: { opacity: 1, y: 0, transition: { duration: MOTION.route.pageDuration, ease: EASE.silk } },
  exit:    { opacity: 0, y: MOTION.route.pageOffsetYExit, transition: { duration: MOTION.route.pageDuration, ease: EASE.silk } },
}

// Cortina cinematográfica: cortina que cae y se levanta entre páginas.
// position fixed para no afectar layout, pointer-events none para no bloquear.
const CURTAIN_VARIANTS = {
  initial: { scaleY: 1, originY: 0 },
  animate: { scaleY: 0, originY: 0, transition: { duration: MOTION.route.curtainEnter, ease: EASE.editorial, delay: 0.05 } },
  exit:    { scaleY: 1, originY: 0, transition: { duration: MOTION.route.curtainExit, ease: EASE.editorial } },
}

// Curtain cinematográfica: cortina que cae y se levanta entre páginas.
// position fixed para no afectar layout, pointer-events none para no bloquear.

export default function RootLayout() {
  useEffect(() => {
    // Restaura sesión si el usuario ya estaba logueado.
    // Leemos las acciones del store vía getState() para evitar re-suscripciones
    // cada vez que cambie la referencia del store.
    const { loadProfile, logout } = useSessionStore.getState()
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

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  const { pathname } = useLocation()
  const showIntro = useIntroGate()
  usePageView()

  useEffect(() => {
    window.lenis?.scrollTo(0, { immediate: true })
  }, [pathname])

  return (
    <LuxuryMotionConfig>
      <IntroOverlay show={showIntro} />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={pathname} {...PAGE_TRANSITION} className="will-change-opacity">
          <Outlet />
        </m.div>
      </AnimatePresence>
      {/* Cortina cinematográfica sincronizada con cada navegación */}
      <AnimatePresence>
        <m.div
          key={`curtain-${pathname}`}
          aria-hidden="true"
          variants={CURTAIN_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[55] bg-brand-textMain pointer-events-none origin-top"
        />
      </AnimatePresence>
      {/* Grain overlay fijo — textura de papel sutil. pointer-events-none para no bloquear. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[40] pointer-events-none mix-blend-multiply opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: '160px 160px',
        }}
      />
      <Footer />
      <CartDrawer />
      <CustomerPortal />
      <CartToast />
      <WhatsAppButton />
      {pathname === '/' && <Suspense fallback={null}><Newsletter /></Suspense>}
    </LuxuryMotionConfig>
  )
}
