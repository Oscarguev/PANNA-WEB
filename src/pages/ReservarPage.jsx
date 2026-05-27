import ChefCTA from '../components/ChefCTA'

export default function ReservarPage() {
  return (
    <main className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">

      {/* Page Header */}
      <div className="pt-36 pb-12 px-6 md:px-16 text-center border-b border-white/[0.03]">
        <span className="eyebrow justify-center">Panna &amp; Pomodoro</span>
        <h1 className="font-brand text-4xl md:text-6xl text-brand-textMain font-light uppercase tracking-tight mt-2 mb-4">
          Reserva tu Mesa
        </h1>
        <div className="w-16 h-[1px] bg-brand-primary/30 mx-auto mb-6" />
        <p className="font-body text-brand-textMuted font-light text-body-mobile md:text-body-desktop max-w-reading mx-auto">
          Asegura tu lugar en nuestro salón. Confirmamos vía teléfono en menos de 2 horas durante horario de servicio.
        </p>
      </div>

      <ChefCTA />

    </main>
  )
}
