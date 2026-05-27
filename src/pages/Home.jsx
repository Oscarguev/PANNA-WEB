import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import CredibilityStrip from '../components/CredibilityStrip'
import Story from '../components/Story'
import ExperienceCards from '../components/ExperienceCards'
import Gallery from '../components/Gallery'
import HorizontalShowcase from '../components/HorizontalShowcase'
import SectionSkeleton from '../components/SectionSkeleton'

const CustomerReviews = lazy(() => import('../components/CustomerReviews'))
const ChefCTA         = lazy(() => import('../components/ChefCTA'))

export default function Home() {
  return (
    <main className="bg-brand-background min-h-screen overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      <Hero />
      <CredibilityStrip />
      <Story />
      <ExperienceCards />
      <Gallery />
      <HorizontalShowcase />
      <Suspense fallback={<SectionSkeleton cards={2} />}>
        <ChefCTA />
      </Suspense>
      <Suspense fallback={<SectionSkeleton cards={1} />}>
        <CustomerReviews />
      </Suspense>
    </main>
  )
}
