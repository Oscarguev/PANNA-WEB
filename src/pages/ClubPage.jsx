import Loyalty from '../components/Loyalty'

export default function ClubPage() {
  return (
    <main id="main" className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary pt-28">
      <h1 className="sr-only">Club PANNA Rewards — Programa de Fidelización</h1>
      <Loyalty />
    </main>
  )
}