import Events from '../components/Events'

export default function EventsPage() {
  return (
    <main id="main" className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary pt-28">
      <h1 className="sr-only">Eventos & Talleres — Panna &amp; Pomodoro</h1>
      <Events />
    </main>
  )
}