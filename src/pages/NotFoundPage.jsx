import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import logo from '../assets/logo.png'
import { EASE } from '../motion/variants'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-brand-background flex items-center justify-center px-6 overflow-hidden relative">

      {/* Ambient orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-accent/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-12 max-w-lg">

        {/* Logo */}
        <m.img
          src={logo}
          alt="Panna & Pomodoro"
          className="h-16 w-auto mx-auto object-contain mix-blend-screen filter brightness-110"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE.silk }}
        />

        {/* 404 number */}
        <m.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE.silk }}
        >
          <span className="font-brand text-[9rem] md:text-[12rem] leading-none text-brand-primary/10 select-none block">
            404
          </span>
          <div className="w-16 h-[1px] bg-brand-primary/30 mx-auto -mt-6" />
        </m.div>

        {/* Text */}
        <m.div
          className="space-y-4 -mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE.silk }}
        >
          <span className="font-body text-[11px] tracking-[0.35em] text-brand-primary uppercase font-semibold block">
            Página no encontrada
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-brand-textMain font-light tracking-[0.03em] uppercase leading-tight">
            Esta mesa no<br />
            <span className="italic font-normal text-brand-primary">está reservada</span>
          </h1>
          <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light max-w-sm mx-auto pt-2">
            La página que buscas no existe o fue removida. Regresa a la experiencia principal y explora nuestra propuesta gastronómica.
          </p>
        </m.div>

        {/* CTAs */}
        <m.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: EASE.editorial }}
        >
          <Link
            to="/"
            className="px-8 py-3.5 bg-brand-primary text-black font-body tracking-[0.25em] text-[11px] uppercase font-bold hover:bg-[#ab8b5f] transition-all duration-500 rounded-full shadow-xl hover:shadow-brand-primary/10 transform hover:-translate-y-0.5"
          >
            Volver al Inicio
          </Link>
          <Link
            to="/reservar"
            className="px-8 py-3.5 border border-white/10 hover:border-brand-primary/40 text-brand-textMuted hover:text-brand-primary font-body tracking-[0.25em] text-[11px] uppercase transition-all duration-500 rounded-full"
          >
            Reservar Mesa
          </Link>
        </m.div>

      </div>
    </main>
  )
}
