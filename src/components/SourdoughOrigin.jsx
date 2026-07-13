/**
 * Origen — bloque tipográfico sobre la masa madre.
 * Sin fotografía: pan.webp ya se usa en Hero y RestaurantIntro para evitar
 * la repetición. Esta sección aporta contenido (48h, 5am) en tipografía.
 *
 * Cifras (columna izquierda): reveal fadeUp + stagger por li.
 * Texto editorial (columna derecha): headline con RevealText línea a línea.
 */
import ScrollReveal from '../motion/ScrollReveal';
import RevealText from '../motion/RevealText';
import StaggerGroup from '../motion/StaggerGroup';
import { fadeUp } from '../motion/variants';

export default function ChefPortrait() {
  return (
    <section
      id="origen"
      aria-label="El origen: la masa madre"
      className="section bg-brand-background border-t border-brand-border"
    >
      <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">

        <ScrollReveal
          as="div"
          className="md:col-span-5"
          variants={fadeUp}
          amount={0.3}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="space-y-4">
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle">
              Cifras
            </span>
            <StaggerGroup
              as="ul"
              stagger={0.08}
              delayChildren={0.1}
              itemAs="li"
              className="space-y-6 border-t border-brand-border pt-6"
              amount={0.3}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[3rem] md:text-[4rem] font-extralight leading-none text-brand-textMain tabular-nums">48</span>
                <span className="font-sans text-[13px] uppercase tracking-[0.18em] text-brand-textSubtle">horas<br />de fermentación</span>
              </div>
              <div className="flex items-baseline gap-4 border-t border-brand-border pt-6">
                <span className="font-display text-[3rem] md:text-[4rem] font-extralight leading-none text-brand-textMain tabular-nums">5</span>
                <span className="font-sans text-[13px] uppercase tracking-[0.18em] text-brand-textSubtle">am<br />horno encendido</span>
              </div>
              <div className="flex items-baseline gap-4 border-t border-brand-border pt-6">
                <span className="font-display text-[3rem] md:text-[4rem] font-extralight leading-none text-brand-textMain tabular-nums">2018</span>
                <span className="font-sans text-[13px] uppercase tracking-[0.18em] text-brand-textSubtle">primer<br />horneado</span>
              </div>
            </StaggerGroup>
          </div>
        </ScrollReveal>

        <ScrollReveal
          as="div"
          className="md:col-span-7 space-y-8"
          variants={fadeUp}
          amount={0.3}
          delay={0.10}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
            El origen
          </p>

          <RevealText
            as="h2"
            className="font-display font-light text-brand-textMain leading-[1.12] tracking-tight"
            style={{ fontSize: 'clamp(1.625rem, 2.8vw, 2.5rem)' }}
            delay={0.15}
            duration={0.75}
          >
            Masa madre viva desde el primer día.
          </RevealText>

          <p className="font-sans text-[16px] text-brand-textMain leading-relaxed max-w-reading">
            La hogaza que se sirve hoy empezó a fermentarse hace dos días. Cuarenta y ocho horas entre la harina, el agua, la sal y el horno.
          </p>

          <p className="font-sans text-[15px] text-brand-textSubtle leading-relaxed max-w-reading">
            La misma madre desde 2018, alimentada cada mañana con harina y tiempo. La diferencia se nota al partir el pan: corteza crujiente, miga húmeda, alveolado irregular.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}