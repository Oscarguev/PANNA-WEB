import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { PhoneIcon, MapPinIcon, MenuIcon, CloseIcon, CartIcon, UserIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import logo from '../assets/logo.png';
import { useCartStore, selectCartCount } from '../stores/useCartStore';
import { useUIStore } from '../stores/useUIStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useBrandTransform } from '../motion/useBrandTransform';
import { EASE } from '../motion/variants';

export default function Navbar() {
  const cartCount = useCartStore(selectCartCount);
  const openCart = useUIStore((state) => state.openCart);
  const openPortal = useUIStore((state) => state.openPortal);
  const loggedIn = useSessionStore((state) => state.loggedIn);
  const { pathname } = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  const { navBrandOpacity } = useBrandTransform();

  useEffect(() => {
    if (cartCount > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <m.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 py-6 px-6 md:px-16 ${
          isScrolled
            ? 'bg-brand-background/80 backdrop-blur-xl border-b border-white/[0.03] py-4 shadow-2xl'
            : 'bg-transparent'
        }`}
        style={{ opacity: navBrandOpacity }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ── Left: Brand Logo ── */}
          <Link to="/" className="group flex items-center relative z-50">

            {/* Logo — height transitions between full/compact states */}
            <m.img
              src={logo}
              fetchPriority="high"
              alt="Panna & Pomodoro Logo"
              className="object-contain mr-3 mix-blend-screen"
              animate={isScrolled
                ? { height: '1.75rem' }
                : { height: '2rem' }
              }
              initial={{ filter: 'brightness(1.1)' }}
              whileHover={{ rotate: 15, scale: 1.08, filter: 'brightness(1.8) drop-shadow(0 0 10px rgba(255,220,50,0.9))' }}
              whileTap={{ scale: 0.95, filter: 'brightness(2.2) drop-shadow(0 0 18px rgba(255,220,50,1))' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ width: 'auto' }}
            />

            <div className="flex flex-col items-start">
              {/* Brand name — static, no letter-spacing animation */}
              <span className="font-brand text-[13px] md:text-[14px] uppercase text-brand-textMain font-normal tracking-[0.08em] transition-colors duration-500 group-hover:text-brand-primary">
                PANNA &amp; POMODORO
              </span>

              {/* Tagline — opacity only toggle */}
              <AnimatePresence>
                {!isScrolled && (
                  <m.span
                    className="font-body text-[11px] tracking-[0.35em] text-brand-primary uppercase font-bold block pt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    ARTESANAL Y FRESCO
                  </m.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* ── Center: Nav Links (Desktop) ── */}
          {/* ✏️ EDITABLE: links del menú de navegación — cambia el label o el href */}
          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-body tracking-[0.25em] uppercase text-brand-textMuted">
            <a href="/#story" className="luxury-underline hover:text-brand-textMain transition-colors duration-500">
              Historia
            </a>
            <a href="/#experiences" className="luxury-underline hover:text-brand-textMain transition-colors duration-500">
              Experiencias
            </a>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `luxury-underline transition-colors duration-500 ${isActive ? 'text-brand-primary' : 'hover:text-brand-textMain'}`
              }
            >
              Menú
            </NavLink>
            <NavLink
              to="/market"
              className={({ isActive }) =>
                `luxury-underline transition-colors duration-500 ${isActive ? 'text-brand-primary' : 'hover:text-brand-textMain'}`
              }
            >
              Tienda Café
            </NavLink>
            <NavLink
              to="/club"
              className={({ isActive }) =>
                `luxury-underline transition-colors duration-500 ${isActive ? 'text-brand-primary' : 'hover:text-brand-textMain'}`
              }
            >
              Club
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `luxury-underline transition-colors duration-500 ${isActive ? 'text-brand-primary' : 'hover:text-brand-textMain'}`
              }
            >
              Eventos
            </NavLink>
          </div>

          {/* ── Right: Actions (Desktop) ── */}
          <div className="hidden lg:flex items-center space-x-6">

            <button
              onClick={() => { openCart(); track(EVENTS.DRAWER_OPEN, { drawer: 'cart' }); }}
              className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-textMain bg-brand-surface/50 relative transition-all duration-500 ${pulse
                ? 'border-brand-primary/85 scale-110 shadow-lg shadow-brand-primary/10 text-brand-primary'
                : 'hover:border-brand-primary/45 hover:scale-105 hover:text-brand-primary'
                }`}
              aria-label="Ver Carrito"
            >
              <CartIcon size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-primary text-black font-body text-[11px] font-bold flex items-center justify-center border-2 border-brand-background animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { openPortal(); track(EVENTS.DRAWER_OPEN, { drawer: 'portal' }); }}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-brand-primary/45 flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-all duration-300 bg-brand-surface/50 relative"
              aria-label="Mi Cuenta"
            >
              <UserIcon size={16} />
              {loggedIn && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-primary border border-brand-background" />
              )}
            </button>

            <Link
              to="/reservar"
              className="px-6 py-3 border border-brand-primary/35 text-brand-textMain hover:border-brand-primary hover:bg-brand-primary hover:text-black font-body tracking-[0.2em] text-[11px] uppercase transition-all duration-700 rounded-full font-semibold bg-black/30 backdrop-blur-sm"
            >
              Reservar Mesa
            </Link>
          </div>

          {/* ── Mobile: Action Buttons ── */}
          <div className="flex items-center space-x-3.5 lg:hidden relative z-50">
            <button
              onClick={() => { openCart(); track(EVENTS.DRAWER_OPEN, { drawer: 'cart' }); }}
              className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-brand-textMain bg-brand-surface/40 relative transition-all duration-500 ${pulse ? 'border-brand-primary/85 scale-110 text-brand-primary' : ''}`}
              aria-label="Ver Carrito"
            >
              <CartIcon size={14} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-brand-primary text-black font-body text-[11px] font-bold flex items-center justify-center border border-brand-background">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { openPortal(); track(EVENTS.DRAWER_OPEN, { drawer: 'portal' }); }}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-brand-textMain bg-brand-surface/40 relative"
              aria-label="Mi Cuenta"
            >
              <UserIcon size={14} />
              {loggedIn && (
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-brand-primary border border-brand-background" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-brand-textMain bg-brand-surface/40"
              aria-label="Toggle Menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen
                  ? <m.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}><CloseIcon size={16} /></m.div>
                  : <m.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}><MenuIcon size={16} /></m.div>
                }
              </AnimatePresence>
            </button>
          </div>

        </div>
      </m.nav>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            className="fixed inset-0 z-40 bg-brand-background lg:hidden flex flex-col justify-between p-8 pt-32"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.55, ease: EASE.silk }}
          >
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Navigation Links — no stagger */}
            <div className="flex flex-col space-y-5 text-left relative z-10 pl-4 border-l border-brand-primary/20">
              <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block font-semibold mb-1">
                Explora P&amp;P
              </span>

              {[
                { label: 'Nuestra Historia',          href: '/#story',    type: 'anchor' },
                { label: 'Experiencias',               href: '/#experiences', type: 'anchor' },
                { label: 'El Menú del Chef',           href: '/menu',      type: 'link' },
                { label: 'Tienda Specialty Coffee',    href: '/market',    type: 'link' },
                { label: 'Club PANNA Rewards',         href: '/club',      type: 'link' },
                { label: 'Próximos Eventos',           href: '/events',    type: 'link' },
                { label: 'Reservar Mesa',              href: '/reservar',  type: 'link', primary: true },
              ].map((item) => (
                <div key={item.href}>
                  {item.type === 'anchor' ? (
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-display text-2xl font-light hover:text-brand-primary transition-colors duration-300 ${item.primary ? 'text-brand-primary' : 'text-brand-textMain'}`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-display text-2xl font-light hover:text-brand-primary transition-colors duration-300 ${item.primary ? 'text-brand-primary' : 'text-brand-textMain'}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Details */}
            <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">
              <div className="grid grid-cols-1 gap-3 text-[11px] font-body tracking-[0.2em] text-brand-textMuted uppercase">
                <div className="flex items-center space-x-3">
                  <MapPinIcon size={14} className="text-brand-primary" />
                  <span className="leading-relaxed">Blvd Las Palmeras, CC El Arco</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon size={14} className="text-brand-primary" />
                  <a href="tel:+50324511000" className="hover:text-brand-primary transition-all">
                    Llamar: 2451-1000
                  </a>
                </div>
              </div>
              <div className="text-[11px] font-body tracking-[0.25em] text-brand-textMuted/40 uppercase text-left">
                &copy; 2018 Panna &amp; Pomodoro.
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
