export default function PageLoader() {
  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border border-brand-border border-t-brand-primary animate-spin mx-auto" />
        <span className="font-wordmark uppercase text-[13px] tracking-[0.18em] text-brand-textSubtle block">
          Panna &amp; Pomodoro
        </span>
      </div>
    </div>
  );
}