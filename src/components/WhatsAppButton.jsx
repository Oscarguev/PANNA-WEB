import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WhatsAppIcon } from './Icons';
import { useUIStore } from '../stores/useUIStore';

const WA_NUMBER = '50324511000';

const ROUTE_MESSAGES = {
  '/':          'Hola, quiero información sobre Panna & Pomodoro.',
  '/reservar':  'Hola, quiero reservar una mesa.',
  '/events':    'Hola, quiero información sobre sus eventos.',
  '/menu':      'Hola, tengo una consulta sobre la carta.',
  '/market':    'Hola, tengo una consulta sobre un producto del Market.',
  '/club':      'Hola, quiero saber más sobre Club PANNA.',
};

function messageFor(pathname) {
  if (ROUTE_MESSAGES[pathname]) return ROUTE_MESSAGES[pathname];
  if (pathname.startsWith('/events')) return ROUTE_MESSAGES['/events'];
  if (pathname.startsWith('/market')) return ROUTE_MESSAGES['/market'];
  if (pathname.startsWith('/menu'))   return ROUTE_MESSAGES['/menu'];
  if (pathname.startsWith('/club'))   return ROUTE_MESSAGES['/club'];
  return 'Hola, me gustaría hacer una consulta sobre Panna & Pomodoro.';
}

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const newsletterOpen = useUIStore((s) => s.newsletterOpen);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const isHome = pathname === '/';
  // En rutas distintas a home, el botón debe mostrarse siempre. Esto se
  // deriva — sin setState en el effect — para evitar cascading renders.
  const isVisible = !isHome || scrolledPastHero;

  useEffect(() => {
    if (!isHome) return;

    // En home, mostrar solo cuando el hero ha salido completamente del viewport.
    // IntersectionObserver reemplaza el scroll listener (banned por
    // taste-skill §5.D): un sentinel invisible en el hero bottom-togglea
    // el estado una sola vez.
    const hero = document.getElementById('hero');
    if (!hero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrolledPastHero(true);
      return;
    }

    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;left:0;width:1px;height:1px;pointer-events:none;';
    sentinel.style.top = '70%';
    hero.appendChild(sentinel);

    const io = new IntersectionObserver(
      ([entry]) => {
        setScrolledPastHero(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [isHome]);

  if (newsletterOpen) return null;
  // Evitar overlap con controles del hero en viewports muy estrechos
  if (typeof window !== 'undefined' && window.innerWidth < 400) return null;

  const text = encodeURIComponent(messageFor(pathname));
  const href = `https://wa.me/${WA_NUMBER}?text=${text}`;

  return (
    <aside role="complementary" aria-label="Contacto rápido por WhatsApp">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        className={`fixed left-4 md:left-auto md:right-6 z-30 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
          isVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          width: '52px',
          height: '52px',
          backgroundColor: '#25D366',
          bottom: 'calc(16px + env(safe-area-inset-bottom))',
        }}
      >
        <WhatsAppIcon size={26} className="text-white" />
      </a>
    </aside>
  );
}
