import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { PhoneIcon, MapPinIcon, MenuIcon, CloseIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import logo from '../assets/logo.png';
import { useCartStore, selectCartCount } from '../stores/useCartStore';
import { useUIStore } from '../stores/useUIStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useFocusTrap } from '../hooks/useFocusTrap';
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
  const [cartaOpen, setCartaOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const cartaTriggerRef = useRef(null);
  const cartaPanelRef = useRef(null);

  useFocusTrap(mobileMenuOpen, () => setMobileMenuOpen(false), mobileMenuRef);

  // Cerrar dropdown Carta: click fuera, tecla Esc
  useEffect(() => {
    if (!cartaOpen) return;
    const onClick = (e) => {
      if (cartaTriggerRef.current?.contains(e.target)) return;
      if (cartaPanelRef.current?.contains(e.target)) return;
      setCartaOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setCartaOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [cartaOpen]);

  // Pulso visual cuando cambia el contador del carrito
  useEffect(() => {
    if (cartCount > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // isScrolled: en lugar de un scroll listener global (banned por perf +
  // banned por taste-skill §5.D), usamos un IntersectionObserver con un
  // sentinel de 40px en el top del documento. Cuando el sentinel deja de
  // estar visible, marcamos scrolled.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none;';
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  // Body scroll lock cuando el menú móvil está abierto (Fase 10).
  // Usa Lenis si está disponible (preserva animación de scroll al cerrar);
  // cae a overflow:hidden directo si Lenis no existe.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    // Lenis expone `isStopped` (getter), NO `classList.contains('lenis-stopped')`.
    // Capturamos el estado real para restaurarlo igual al cerrar.
    const wasStopped = Boolean(window.lenis?.isStopped);
    document.body.style.overflow = 'hidden';
    window.lenis?.stop?.();
    return () => {
      document.body.style.overflow = prev;
      if (!wasStopped) window.lenis?.start?.();
    };
  }, [mobileMenuOpen]);

  const cartaSubcats = [
    { label: 'Entrantes', cat: 'entrantes' },
    { label: 'Pasta',     cat: 'pasta' },
    { label: 'Pizza',     cat: 'pizza' },
    { label: 'Postre',    cat: 'postre' },
  ];

  // Reorden por prioridad visual (P7):
  // Primarios: Carta, Reservar, Ubicación, Nosotros
  // Secundarios: Café, Club, Bolsa, Entrar (en actions)
  const navLinks = [
    { label: 'Carta',     to: '/menu',      hasDropdown: true,  primary: true },
    { label: 'Ubicación', to: '/#location', hasDropdown: false, primary: true, anchor: true },
    { label: 'Nosotros',  to: '/#story',    hasDropdown: false, primary: true, anchor: true },
    { label: 'Café',      to: '/market',    hasDropdown: false, primary: false },
    { label: 'Club',      to: '/club',      hasDropdown: false, primary: false },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-brand-textMain focus:text-brand-background focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:font-bold focus:rounded-full"
      >
        Saltar al contenido principal
      </a>

      {/*
        Header siempre opaco: fondo crema + texto carbón.
        Sin estado transparente: integra visualmente con el hero fotografico
        (que ahora tambien usa el hero del sitio, sin marco rojo).
      */}
      <m.nav
        aria-label="Navegación principal"
        className="fixed top-0 left-0 right-0 z-50 bg-brand-background border-b border-brand-border transition-shadow duration-300"
        style={{
          paddingTop: 'calc(1rem + env(safe-area-inset-top))',
          paddingBottom: '1rem',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
          boxShadow: isScrolled ? '0 2px 24px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 relative z-50">
            <img
              src={logo}
              fetchPriority="high"
              alt=""
              width={40}
              height={40}
              className="object-contain h-9 md:h-10 w-auto"
              style={{ width: 'auto', filter: 'brightness(0) saturate(100%)', opacity: 0.95 }}
            />
            <span className="sr-only">Ir al inicio — Panna y Pomodoro</span>
            <span aria-hidden="true" className="hidden sm:inline font-wordmark uppercase text-[13px] leading-none tracking-[0.02em] text-brand-textMain whitespace-nowrap">
              Panna &amp; Pomodoro
            </span>
          </Link>

          {/* Center: Nav Links */}
          <ul className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-brand-textMain">
            {navLinks.map((link) => (
              <li
                key={link.to + link.label}
                className="relative"
                onMouseEnter={link.hasDropdown ? () => setCartaOpen(true) : undefined}
                onMouseLeave={link.hasDropdown ? () => setCartaOpen(false) : undefined}
              >
                {link.hasDropdown ? (
                  <>
                    <button
                      ref={cartaTriggerRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={cartaOpen}
                      aria-controls="carta-menu"
                      onFocus={() => setCartaOpen(true)}
                      onClick={() => setCartaOpen((v) => !v)}
                      className="group inline-flex items-center gap-1 min-h-[44px] pr-2 transition-colors duration-base hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      <span className="luxury-underline inline-block">{link.label}</span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${cartaOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M2 4 L5 7 L8 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {cartaOpen && (
                        <m.div
                          ref={cartaPanelRef}
                          id="carta-menu"
                          role="menu"
                          aria-label="Subcategorías de carta"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.20, ease: EASE.editorial }}
                          className="absolute top-full left-0 mt-2 min-w-[480px] bg-brand-background border border-brand-border shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-5 z-50"
                        >
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-6">
                            {cartaSubcats.map((sub) => (
                              <Link
                                key={sub.cat}
                                to={`${link.to}?cat=${sub.cat}`}
                                role="menuitem"
                                onClick={() => setCartaOpen(false)}
                                className="min-h-[40px] inline-flex items-center text-[14px] font-normal text-brand-textMain hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary luxury-underline"
                              >
                                {sub.label}
                              </Link>
                            ))}
                            <Link
                              to={link.to}
                              role="menuitem"
                              onClick={() => setCartaOpen(false)}
                              className="col-span-2 mt-2 pt-3 border-t border-brand-border min-h-[40px] inline-flex items-center text-[12px] font-sans uppercase tracking-[0.16em] text-brand-textSubtle hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            >
                              Ver toda la carta
                              <span className="ml-2" aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : link.anchor ? (
                  <a
                    href={link.to}
                    className="inline-flex items-center min-h-[44px] transition-colors duration-base hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <span className="luxury-underline inline-block">{link.label}</span>
                  </a>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `inline-flex items-center min-h-[44px] transition-colors duration-base hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${isActive ? 'text-brand-textMain border-b-2 border-brand-cta pb-0.5' : ''}`
                    }
                  >
                    <span className="luxury-underline inline-block">{link.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 lg:gap-3">
            {/* Secundarios — más discretos */}
            <button
              onClick={() => { openCart(); track(EVENTS.DRAWER_OPEN, { drawer: 'cart' }); }}
              className={`hidden md:inline-flex relative items-center min-h-[44px] text-[12px] font-normal transition-colors duration-base px-2 text-brand-textMuted hover:text-brand-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${pulse ? 'text-brand-accent' : ''}`}
              aria-label={`Bolsa${cartCount > 0 ? `, ${cartCount} ${cartCount === 1 ? 'artículo' : 'artículos'}` : ''}`}
            >
              Bolsa{cartCount > 0 ? ` (${cartCount})` : ''}
            </button>

            <button
              onClick={() => { openPortal(); track(EVENTS.DRAWER_OPEN, { drawer: 'portal' }); }}
              className="hidden md:inline-flex items-center min-h-[44px] gap-2 text-[12px] font-normal text-brand-textMuted hover:text-brand-textMain transition-colors duration-base px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label={`${loggedIn ? 'Cuenta' : 'Entrar'}${loggedIn ? ', sesión activa' : ''}`}
            >
              {loggedIn && <span className="w-1.5 h-1.5 rounded-full bg-brand-success" aria-hidden="true" />}
              {loggedIn ? 'Cuenta' : 'Entrar'}
            </button>

            {/* Primario destacado — focus ring instantáneo (no transition en ring). */}
            <Link
              to="/reservar"
              className="inline-flex items-center min-h-[40px] md:min-h-[44px] text-[12px] md:text-[13px] font-semibold tracking-wide uppercase px-4 md:px-5 py-2 transition-colors duration-base bg-brand-cta text-white hover:bg-brand-ctaHover border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background"
            >
              Reservar
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen
                  ? <m.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><CloseIcon size={18} /></m.span>
                  : <m.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MenuIcon size={18} /></m.span>
                }
              </AnimatePresence>
            </button>
          </div>

        </div>
      </m.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            tabIndex={-1}
            className="fixed inset-0 z-40 bg-brand-background lg:hidden flex flex-col justify-between px-8 pt-28 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE.silk }}
          >
            <ul className="space-y-5 text-left">
              <li>
                <span className="text-[12px] text-brand-textSubtle">Explora</span>
              </li>
              {cartCount > 0 && (
                <li>
                  <button
                    onClick={() => { setMobileMenuOpen(false); openCart(); track(EVENTS.DRAWER_OPEN, { drawer: 'cart' }); }}
                    className="min-h-[44px] inline-flex items-center font-display text-2xl font-light text-brand-textMain hover:text-brand-primary transition-colors duration-base rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background"
                  >
                    Bolsa ({cartCount})
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => { setMobileMenuOpen(false); openPortal(); track(EVENTS.DRAWER_OPEN, { drawer: 'portal' }); }}
                  className="min-h-[44px] inline-flex items-center font-display text-2xl font-light text-brand-textMain hover:text-brand-primary transition-colors duration-base rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background"
                >
                  {loggedIn ? 'Mi cuenta' : 'Iniciar sesión'}
                </button>
              </li>
              {[
                { label: 'Carta',         to: '/menu' },
                { label: 'Ubicación',     to: '/#location' },
                { label: 'Nosotros',      to: '/#story' },
                { label: 'Café & Tienda', to: '/market' },
                { label: 'Club PANNA',    to: '/club' },
                { label: 'Eventos',       to: '/events' },
                { label: 'Reservar mesa', to: '/reservar' },
              ].map((item) => (
                <li key={item.label}>
                  {item.to.startsWith('/#') ? (
                    <a
                      href={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] inline-flex items-center font-display text-2xl font-light text-brand-textMain hover:text-brand-primary transition-colors duration-base rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] inline-flex items-center font-display text-2xl font-light text-brand-textMain hover:text-brand-primary transition-colors duration-base rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="space-y-3 pt-8 border-t border-brand-border text-[13px] text-brand-textMain">
              <div className="flex items-center gap-2">
                <MapPinIcon size={14} className="text-brand-primary shrink-0" aria-hidden="true" />
                <span>Blvd Las Palmeras, CC El Arco</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon size={14} className="text-brand-primary shrink-0" aria-hidden="true" />
                <a href="tel:+50324511000" className="hover:text-brand-primary transition-colors duration-base tabular-nums rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background">
                  2451-1000
                </a>
              </div>
              <p className="text-brand-textSubtle pt-2">© Panna &amp; Pomodoro, 2018.</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
