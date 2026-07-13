import ChefCTA from '../components/ChefCTA'

export default function ReservarPage() {
  return (
    <main id="main" className="bg-brand-background min-h-screen">

      <div className="pt-36 pb-16 border-b border-brand-border">
        <div className="container-page max-w-3xl space-y-6">
          <div className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
            <span>Panna &amp; Pomodoro</span>
          </div>
          <h1 className="font-display font-light text-brand-textMain tracking-tight" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}>
            Reservar una mesa.
          </h1>
          <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading">
            Asegura tu lugar en el salón o en la terraza. Confirmamos vía teléfono en menos de 2 horas durante horario de servicio.
          </p>
        </div>
      </div>

      <ChefCTA />

    </main>
  )
}