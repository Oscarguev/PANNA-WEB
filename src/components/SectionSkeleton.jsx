export default function SectionSkeleton({ cards = 3 }) {
  return (
    <div className="w-full py-24 md:py-36 px-6 md:px-16 bg-brand-background border-t border-white/[0.02] animate-pulse">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Eyebrow + heading + divider */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-2 w-20 bg-brand-surface/70 rounded-full" />
          <div className="h-7 w-64 bg-brand-surface/50 rounded" />
          <div className="h-[1px] w-14 bg-brand-surface/50" />
          <div className="space-y-2 w-full max-w-md">
            <div className="h-2 w-full bg-brand-surface/30 rounded-full" />
            <div className="h-2 w-5/6 bg-brand-surface/30 rounded-full mx-auto" />
          </div>
        </div>

        {/* Card placeholders */}
        <div className={`grid grid-cols-1 md:grid-cols-${cards} gap-8 pt-4`}>
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="h-52 bg-brand-surface/25 rounded-[4px]" />
          ))}
        </div>

      </div>
    </div>
  )
}
