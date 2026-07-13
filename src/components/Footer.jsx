
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, PhoneIcon } from './Icons';
import logo from '../assets/logo.png';

function scrollToTop() {
  // Lenis-aware con fallback nativo. Funciona aunque Lenis no esté cargado.
  if (window.lenis?.scrollTo) {
    window.lenis.scrollTo(0, { duration: 1.1 });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const GROUPS = {
  explorar: [
    { label: 'Carta',         to: '/menu' },
    { label: 'Café & Tienda', to: '/market' },
    { label: 'Eventos',       to: '/events' },
    { label: 'Club PANNA',    to: '/club' },
  ],
  informacion: [
    { label: 'Reservar',   to: '/reservar' },
    { label: 'Términos',   to: '/terminos' },
    { label: 'Privacidad', to: '/privacidad' },
    { label: 'Cookies',    to: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="w-full bg-brand-textMain text-brand-background border-t border-brand-textMain"
      style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom) + 72px)' }}
    >
      <div className="container-page pt-20 md:pt-28 space-y-20">

        {/* Botón volver arriba — Lenis-aware */}
        <button
          type="button"
          onClick={scrollToTop}
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-textMain rounded-sm"
          aria-label="Volver arriba"
        >
          <span aria-hidden="true" className="transition-transform duration-base ease-silk group-hover:-translate-y-0.5">↑</span>
          Volver arriba
        </button>

        {/* Bloque display — nombre grande asimétrico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-8 space-y-6">
            <img
              src={logo}
              alt=""
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
            />
            <p
              className="font-wordmark uppercase leading-[0.94] tracking-[0.01em] text-white"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 6.5rem)' }}
            >
              Panna &amp; Pomodoro
            </p>
            <p className="text-[14px] md:text-[15px] text-white/70 max-w-reading leading-relaxed">
              Un salón pequeño en Boulevard Las Palmeras que se toma en serio lo que sirve.
              Masa madre desde 2018, café trazable, cocina servida en barra.
            </p>
          </div>

          {/* Datos agrupados — retícula asimétrica */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 text-[13px] text-white/85">
            <div className="flex items-start gap-3">
              <MapPinIcon size={16} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="leading-relaxed">
                Boulevard Las Palmeras<br />CC El Arco · Sonsonate
              </span>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon size={16} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="leading-relaxed tabular-nums">
                Lun–Jue 7:00–21:00<br />Vie–Sáb 7:00–22:00<br />Dom 7:00–21:00
              </span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon size={16} className="text-brand-primary shrink-0" aria-hidden="true" />
              <a href="tel:+50324511000" className="hover:text-white transition-colors duration-base tabular-nums">
                2451-1000
              </a>
            </div>
          </div>
        </div>

        {/* Reticula de navegación — tres columnas asimétricas */}
        <nav aria-label="Pie de página" className="grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-white/10 pt-12">
          <div className="md:col-span-5 space-y-4">
            <p className="eyebrow-on-dark">Explorar</p>
            <ul className="space-y-2.5 text-[15px]">
              {GROUPS.explorar.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/90 hover:text-white transition-colors duration-base inline-flex items-center min-h-[40px] luxury-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <p className="eyebrow-on-dark">Información</p>
            <ul className="space-y-2.5 text-[15px]">
              {GROUPS.informacion.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/70 hover:text-white transition-colors duration-base inline-flex items-center min-h-[40px] luxury-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <p className="eyebrow-on-dark">Contacto</p>
            <ul className="space-y-2.5 text-[14px] text-white/85">
              <li>
                <a
                  href="https://wa.me/50324511000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-base inline-flex items-center min-h-[40px] luxury-underline"
                >
                  WhatsApp · 2451-1000
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/panna.pomodoro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-base inline-flex items-center min-h-[40px] luxury-underline"
                >
                  Instagram · @panna.pomodoro
                </a>
              </li>
              <li>
                <Link
                  to="/reservar"
                  className="hover:text-white transition-colors duration-base inline-flex items-center min-h-[40px] luxury-underline"
                >
                  Reservar una mesa
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Pie pequeño */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-8 border-t border-white/10 text-[12px] text-white/55">
          <p>© 2018–2026 Panna &amp; Pomodoro. Todos los derechos reservados.</p>
          <p>Diseñado y horneado en Sonsonate.</p>
        </div>

      </div>
    </footer>
  );
}