import { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import { useUIStore } from '../stores/useUIStore';
import { useLocation } from 'react-router-dom';
import { EASE } from '../motion/variants';

const STORAGE_KEY = 'panna_newsletter_dismissed';
const COOLDOWN_DAYS = 7;
const SHOW_DELAY_MS = 22000;          // primera visita: 22s
const SCROLL_THRESHOLD = 0.60;        // solo tras 60% del doc
const SKIP_PATHNAMES = new Set(['/market', '/club', '/reservar', '/admin']);

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function heroOutOfView() {
  const hero = document.getElementById('hero');
  if (!hero) return true;
  const rect = hero.getBoundingClientRect();
  return rect.bottom <= window.innerHeight * 0.6 || window.scrollY > 500;
}

export default function Newsletter() {
  const [visible, setVisible]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [email, setEmail]             = useState('');
  const dialogRef                     = useRef(null);
  const closeBtnRef                   = useRef(null);
  const setNewsletterOpen             = useUIStore((s) => s.setNewsletterOpen);
  const { pathname }                  = useLocation();
  const isHome                        = pathname === '/';

  const dismiss = useCallback(() => {
    setVisible(false);
    setNewsletterOpen(false);
    try {
      const expires = Date.now() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(expires));
    } catch (_) {}
  }, [setNewsletterOpen]);

  const isDismissed = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const expires = Number(raw);
      if (!Number.isFinite(expires)) return false;
      if (Date.now() > expires) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }
      return true;
    } catch (_) { return false; }
  }, []);

  // Decide when to show: timer OR scroll + hero out OR exit-intent (desktop), whichever first
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (SKIP_PATHNAMES.has(pathname)) return;
    if (isDismissed()) return;

    let triggered = false;
    let unsubscribeScroll = () => {};
    let timerId = null;

    const fire = () => {
      if (triggered) return;
      // No mostrar mientras el hero siga visible en home
      if (isHome && !heroOutOfView()) {
        const retry = () => {
          if (heroOutOfView()) {
            fire();
            window.removeEventListener('scroll', retry);
          }
        };
        window.addEventListener('scroll', retry, { passive: true });
        return;
      }
      triggered = true;
      setVisible(true);
      setNewsletterOpen(true);
      unsubscribeScroll();
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('mouseout', onExitIntent);
    };

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;
      if (pct >= SCROLL_THRESHOLD) fire();
    };
    unsubscribeScroll = () => window.removeEventListener('scroll', onScroll);

    // Exit-intent (desktop only): cursor leaves viewport through top edge
    const onExitIntent = (e) => {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024) {
      document.addEventListener('mouseout', onExitIntent);
    }
    timerId = setTimeout(fire, SHOW_DELAY_MS);

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onExitIntent);
    };
  }, [setNewsletterOpen, isHome, pathname, isDismissed]);

  // Escape to close + focus initial
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    // focus close button for keyboard users
    const t = setTimeout(() => closeBtnRef.current?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [visible, dismiss]);

  // Basic focus trap inside dialog
  useEffect(() => {
    if (!visible) return;
    const root = dialogRef.current;
    if (!root) return;
    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = root.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener('keydown', onTab);
    return () => root.removeEventListener('keydown', onTab);
  }, [visible]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    track(EVENTS.NEWSLETTER_SIGNUP, { email_domain: email.split('@')[1] ?? 'unknown' });
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => dismiss(), 4000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-title"
          className="fixed inset-x-4 bottom-4 md:inset-x-auto md:bottom-6 md:right-6 md:w-80 z-50 bg-brand-surface border border-brand-border px-5 py-5 shadow-sm max-w-[calc(100vw-2rem)] md:max-w-none"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: EASE.silk }}
        >
          <button
            ref={closeBtnRef}
            onClick={dismiss}
            className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-textSubtle hover:text-brand-textMain transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label="Cerrar"
          >
            <CloseIcon size={14} />
          </button>

          {submitted ? (
            <p className="text-[14px] text-brand-textMain pt-1 pr-8" id="newsletter-title">
              Listo. Te avisamos cuando llegue la próxima cata.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-1 pr-8">
              <h2 id="newsletter-title" className="text-[14px] text-brand-textMain leading-relaxed font-medium">
                Catas y lanzamientos de microlotes, una vez al mes.
              </h2>
              <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-b border-brand-border py-3 min-h-[44px] text-[15px] text-brand-textMain placeholder:text-brand-textSubtle focus:outline-none focus:border-brand-primary transition-colors duration-base"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center min-h-[44px] gap-2 font-medium text-brand-textMain border-b border-brand-textMain pb-0.5 hover:border-brand-primary hover:text-brand-primary transition-colors duration-base disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {submitting ? <><Spinner /> Enviando</> : 'Apúntame'}
              </button>
            </form>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}