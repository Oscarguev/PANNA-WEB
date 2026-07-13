/**
 * Manifesto — claim breve del restaurante.
 * Versión "reducida y reposicionada" para restaurante italiano profesional.
 *
 * Texto editorial con line-mask reveal. El eyebrow aparece con fadeUp, el claim
 * se revela por palabras enmascaradas. Respetuoso con prefers-reduced-motion.
 */
import ScrollReveal from '../motion/ScrollReveal';
import RevealText from '../motion/RevealText';
import { fadeUp } from '../motion/variants';

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      aria-label="Manifiesto del restaurante"
      className="bg-brand-background border-y border-brand-border py-14 md:py-20 px-6 md:px-16"
    >
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal as="p" variants={fadeUp} delay={0} className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle mb-4">
          Nuestro manifiesto
        </ScrollReveal>
        <RevealText
          as="p"
          className="font-display font-light leading-[1.15] tracking-tight text-brand-textMain text-balance"
          delay={0.08}
          duration={0.7}
        >
          Cocina italiana contemporánea en Sonsonate, desde 2018.
        </RevealText>
      </div>
    </section>
  );
}