import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import Manifesto from '../components/Manifesto'
import InfoStrip from '../components/InfoStrip'
import RestaurantIntro from '../components/RestaurantIntro'
import SignatureDishes from '../components/SignatureDishes'
import MenuPreview from '../components/MenuPreview'
import Ambiente from '../components/Ambiente'
import CredibilityStrip from '../components/CredibilityStrip'
import Story from '../components/Story'
import CoffeeAndMarket from '../components/CoffeeAndMarket'
import PhilosophyMarquee from '../components/PhilosophyMarquee'
import SourdoughOrigin from '../components/SourdoughOrigin'
import Gallery from '../components/Gallery'
import NewsletterSection from '../components/NewsletterSection'
import SectionSkeleton from '../components/SectionSkeleton'
import ReserveCTA from '../components/ReserveCTA'
import Location from '../components/Location'

const CustomerReviews = lazy(() => import('../components/CustomerReviews'))
const ChefCTA         = lazy(() => import('../components/ChefCTA'))

/**
 * Home — recorrido del restaurante.
 * 1.  Hero tipográfico (nombre + claim + CTAs)
 * 2.  Manifesto (claim editorial breve — line-mask reveal)
 * 3.  InfoStrip (ubicación · horario · teléfono · reservar)
 * 4.  RestaurantIntro (presentación + KPIs + foto cocina)
 * 5.  SignatureDishes (4 platos destacados read-only)
 * 6.  MenuPreview (3 categorías con precios)
 * 7.  Ambiente (cocina · barra · servicio)
 * 8.  CredibilityStrip (4 datos)
 * 9.  Story (masa madre + pilares)
 * 10. CoffeeAndMarket (café & tienda en bloque dark)
 * 11. PhilosophyMarquee (tira editorial de valores, una vez)
 * 12. SourdoughOrigin (bloque tipográfico sobre la masa madre)
 * 13. Gallery (galería con lightbox)
 * 14. Newsletter (inline, dark)
 * 15. Testimonios (lazy)
 * 16. ChefCTA (reservas — lazy)
 * 17. ReserveCTA (dark cierre conversión)
 * 18. Location (dirección + mapa antes del footer)
 */
export default function Home() {
  return (
    <main id="main" className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      <Hero />
      <Manifesto />
      <InfoStrip />
      <RestaurantIntro />
      <SignatureDishes />
      <MenuPreview />
      <Ambiente />
      <CredibilityStrip />
      <Story />
      <CoffeeAndMarket />
      <PhilosophyMarquee />
      <SourdoughOrigin />
      <Gallery />
      <NewsletterSection />
      <Suspense fallback={<SectionSkeleton cards={1} />}>
        <CustomerReviews />
      </Suspense>
      <Suspense fallback={<SectionSkeleton cards={2} />}>
        <ChefCTA />
      </Suspense>
      <ReserveCTA />
      <Location />
    </main>
  );
}
