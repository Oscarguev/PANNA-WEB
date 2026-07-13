import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main id="main" className="min-h-screen bg-brand-background flex items-center justify-center px-6">
      <div className="text-center space-y-12 max-w-lg">

        <span
          aria-hidden="true"
          className="font-display text-[9rem] md:text-[12rem] leading-none text-brand-textSubtle select-none block"
        >
          404
        </span>

        <div className="space-y-4">
          <h1 className="font-display text-3xl md:text-4xl text-brand-textMain font-light leading-tight tracking-tighter">
            Esta página no está en la carta.
          </h1>
          <p className="text-[15px] text-brand-textMain leading-relaxed max-w-sm mx-auto">
            La página que buscas no existe o fue removida. Regresa a la experiencia principal y explora nuestra propuesta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
          <Link
            to="/"
            className="text-[13px] text-brand-textMain border-b border-brand-textMain pb-0.5 hover:border-brand-primary hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Volver al inicio
          </Link>
          <span aria-hidden="true" className="text-brand-textSubtle">·</span>
          <Link
            to="/reservar"
            className="text-[13px] text-brand-textMain border-b border-brand-textMain pb-0.5 hover:border-brand-primary hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Reservar una mesa
          </Link>
        </div>

      </div>
    </main>
  )
}