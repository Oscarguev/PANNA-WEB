const ITEMS = [
  { label: 'Est. 2018',          sub: 'en Sonsonate' },
  { label: 'Masa madre',         sub: '48 h fermentación' },
  { label: 'Café de origen',     sub: 'microlotes trazables' },
  { label: 'Horneado diario',    sub: 'artesanal' },
];

function Item({ label, sub }) {
  return (
    <div className="flex flex-col items-center text-center sm:flex-row sm:items-baseline sm:gap-2 sm:whitespace-nowrap">
      <span className="font-display text-[14px] sm:text-[16px] md:text-[18px] font-light text-brand-textMain leading-tight sm:leading-none">
        {label}
      </span>
      <span className="text-[11px] sm:text-[12px] md:text-[13px] text-brand-textSubtle leading-tight sm:leading-none sm:whitespace-nowrap">
        {sub}
      </span>
    </div>
  );
}

export default function CredibilityStrip() {
  return (
    <section
      aria-label="Credenciales de la marca"
      className="w-full border-y border-brand-border py-6 md:py-14 bg-brand-background"
    >
      <div className="container-page">
        {/* Mobile (<md): 2x2 grid, sin separadores */}
        <ul className="grid grid-cols-2 gap-x-3 gap-y-4 md:hidden">
          {ITEMS.map((item) => (
            <li key={item.label} className="flex items-center justify-center">
              <Item label={item.label} sub={item.sub} />
            </li>
          ))}
        </ul>

        {/* Desktop (md+): una fila con separadores verticales */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-y-5">
          {ITEMS.map((item, i) => (
            <span key={item.label} className="inline-flex items-center">
              <Item label={item.label} sub={item.sub} />
              {i < ITEMS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="inline-block w-px h-5 bg-brand-border mx-8 md:mx-12 shrink-0"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
