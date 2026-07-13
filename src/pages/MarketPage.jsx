import Market from '../components/Market'

export default function MarketPage() {
  return (
    <main id="main" className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary pt-28">
      <h1 className="sr-only">Tienda de Café — Panna &amp; Pomodoro</h1>
      <Market />
    </main>
  )
}