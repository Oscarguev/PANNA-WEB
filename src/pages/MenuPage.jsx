import { Link } from 'react-router-dom';
import MenuGrid from '../components/MenuGrid';

export default function MenuPage() {
  return (
    <main id="main" className="bg-brand-background overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary pt-28">
      <h1 className="sr-only">Nuestra Carta — Panna &amp; Pomodoro</h1>
      <div className="container-page">
        <p className="text-[13px] text-brand-textSubtle mt-4 mb-2 max-w-reading">
          ¿Buscas café para llevar?{' '}
          <Link to="/market" className="underline underline-offset-2 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background rounded-sm">
            Visita Café &amp; Tienda
          </Link>.
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle/80 mb-8">
          Precios con IVA incluido
        </p>
      </div>
      <MenuGrid />
    </main>
  );
}