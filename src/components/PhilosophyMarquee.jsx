/**
 * PhilosophyMarquee — tira editorial de valores del restaurante.
 * Marquee continuo lento. Pausa en hover. La animación la gatea CSS
 * (motion-safe:animate-marquee) que respeta prefers-reduced-motion
 * automáticamente. Cuando ?motion=on está activo en la URL, MotionConfig
 * inyecta un override CSS para forzar la animación.
 *
 * Velocidad: ~60s loop. translateX-only (GPU-accelerated).
 */
import { useMemo } from 'react';

const VALUES = [
  'Reservas por WhatsApp',
  'Masa madre 48 h',
  'Cocina sin prisa',
  'Café de origen',
  'Servicio en barra',
  'Sin menú permanente',
];

export default function PhilosophyMarquee() {
  // Duplicamos la lista para crear loop continuo sin gaps visuales.
  const items = useMemo(() => [...VALUES, ...VALUES], []);

  return (
    <section
      aria-label="Valores del restaurante"
      className="bg-brand-background border-y border-brand-border py-6 overflow-hidden group"
    >
      <div
        className="flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused]"
      >
        {items.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="flex items-center gap-8 px-6 font-sans text-[11px] uppercase tracking-[0.16em] text-brand-textMuted whitespace-nowrap"
          >
            {v}
            <span className="text-brand-textMuted/40" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}