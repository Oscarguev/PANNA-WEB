import { m } from 'framer-motion';
import { reveal } from '../motion/variants';

/**
 * FullBleed — bloque fotográfico full-width.
 * Token: --hero-min-height / --hero-max-height define el tamaño.
 */
export default function FullBleed({
  image,
  alt,
  eyebrow,
  caption,
  signature,
  height = 'min(var(--hero-min-height), var(--hero-max-height))',
}) {
  return (
    <section
      aria-label={alt || 'Bloque fotográfico'}
      className="relative w-full overflow-hidden bg-brand-textMain"
      style={{ height }}
    >
      <img
        src={image}
        alt={alt || ''}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradiente inferior para caption */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,18,16,0.10) 0%, rgba(20,18,16,0) 35%, rgba(20,18,16,0.20) 70%, rgba(20,18,16,0.72) 100%)',
        }}
      />

      {/* Caption asimétrico abajo-izquierda */}
      <m.div
        className="container-page relative h-full flex flex-col justify-end pb-12 md:pb-16 text-white"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-3xl space-y-4">
          {eyebrow && (
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/80">
              <span className="w-8 h-px bg-white/70" aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>
          )}
          {caption && (
            <p
              className="font-display font-light leading-[1.04] tracking-tight text-white h-section-on-dark"
              style={{ textShadow: '0 1px 18px rgba(0,0,0,0.55), 0 4px 36px rgba(0,0,0,0.45)' }}
            >
              {caption}
            </p>
          )}
          {signature && (
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/70">
              {signature}
            </p>
          )}
        </div>
      </m.div>
    </section>
  );
}