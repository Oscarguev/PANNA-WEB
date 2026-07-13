import { useState } from 'react';
import { m } from 'framer-motion';
import { EASE } from '../motion/variants';
import { track, EVENTS } from '../analytics';

/**
 * NewsletterSection — bloque inline de suscripción al newsletter.
 * Dark, prominent, antes de los testimonios.
 * Stub submission: track + delay. (Mismo patrón que Newsletter drawer.)
 */
function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    track(EVENTS.NEWSLETTER_SIGNUP, { email_domain: email.split('@')[1] ?? 'unknown' });
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section
      id="newsletter"
      aria-label="Suscríbete al newsletter"
      className="section bg-brand-textMain text-brand-background"
    >
      <div className="container-page text-center">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE.silk }}
        >
          <p className="eyebrow-on-dark mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-white/40" aria-hidden="true" />
            Newsletter
            <span className="w-8 h-px bg-white/40" aria-hidden="true" />
          </p>

          <h2 className="h-section-on-dark mb-5" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            Catas y lanzamientos de microlotes, una vez al mes.
          </h2>

          <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-reading mx-auto mb-10">
            Anunciamos nuevos cafés, cenas especiales y lo que llega del horno antes que en cualquier otro lugar. Sin spam, una sola edición mensual.
          </p>

          {submitted ? (
            <p className="font-sans text-[15px] text-white py-4" role="status" aria-live="polite">
              <span className="text-brand-success" aria-hidden="true">✓ </span>
              Listo. Te avisamos cuando llegue la próxima cata.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl mx-auto"
              noValidate
            >
              <label htmlFor="newsletter-email-inline" className="sr-only">Correo electrónico</label>
              <input
                id="newsletter-email-inline"
                type="email"
                required
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-line-on-dark flex-1"
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary-on-dark disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <><Spinner /> Enviando</> : 'Apúntame'}
              </button>
            </form>
          )}

          <p className="font-sans text-[12px] text-white/60 mt-5">
            Te puedes dar de baja en cualquier momento.
          </p>
        </m.div>
      </div>
    </section>
  );
}
