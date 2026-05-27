export default function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center">
      <div className="space-y-5 text-center">
        <div className="w-8 h-8 rounded-full border border-brand-primary/20 border-t-brand-primary animate-spin mx-auto" />
        <span className="font-body text-[12px] tracking-[0.35em] uppercase text-brand-primary/50 block">
          Panna & Pomodoro
        </span>
      </div>
    </div>
  )
}
