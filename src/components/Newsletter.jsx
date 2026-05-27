import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CloseIcon, SparklesIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import { EASE } from '../motion/variants';

export default function Newsletter() {
  const [visible, setVisible]     = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('panna_newsletter_dismissed')) return;

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.9) setVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('panna_newsletter_dismissed', '1');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    track(EVENTS.NEWSLETTER_SIGNUP, { email_domain: email.split('@')[1] ?? 'unknown' });
    setTimeout(() => dismiss(), 4000);
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <m.div
          className="fixed bottom-[5.5rem] right-6 z-40 w-80 bg-brand-surface border border-white/[0.08] rounded-[4px] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.45, ease: EASE.silk }}
        >
          {/* Gold top line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-primary/60 to-transparent" />

          <div className="p-5 relative">
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-brand-textMuted/50 hover:text-brand-textMain transition-colors duration-300"
              aria-label="Cerrar"
            >
              <CloseIcon size={12} />
            </button>

            {subscribed ? (
              <div className="text-left space-y-2 py-2 animate-fade-in">
                <SparklesIcon size={14} className="text-brand-primary animate-pulse" />
                <p className="font-display text-base text-brand-primary font-light">
                  ¡Bienvenido al club!
                </p>
                <p className="font-body text-[12px] text-brand-textMuted leading-relaxed font-light">
                  Te enviaremos invitaciones a catas secretas y lanzamientos de microlotes.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pr-4">
                <div className="space-y-1">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-primary font-semibold block">
                    Boletín Privado
                  </span>
                  <p className="font-display text-lg text-brand-textMain font-light leading-snug">
                    Club Literario Panna
                  </p>
                  <p className="font-body text-[12px] text-brand-textMuted leading-relaxed font-light pt-0.5">
                    Catas secretas, microlotes exóticos y recetas artesanales. Sin spam.
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-background border border-white/10 focus:border-brand-primary text-brand-textMain font-body text-[12px] py-2.5 px-4 rounded-full focus:outline-none transition-colors duration-500 placeholder-white/20"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-primary text-black hover:bg-[#ab8b5f] font-body tracking-[0.2em] text-[11px] uppercase font-bold transition-all duration-500 rounded-full"
                  >
                    Suscribirse
                  </button>
                </form>
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
