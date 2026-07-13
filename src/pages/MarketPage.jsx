import Market from '../components/Market'

export default function MarketPage() {
  return (
    <main id="main" className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary pt-28">
      <h1 className="sr-only">Tienda de Café — Panna &amp; Pomodoro</h1>
      <div className="container-page">
        <p className="text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle/80 mt-4 mb-0">
          Precios con IVA incluido
        </p>
      </div>
      <Market />
    </main>
  )
}