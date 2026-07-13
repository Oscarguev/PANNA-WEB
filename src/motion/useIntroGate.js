/**
 * useIntroGate.js
 * Decides whether to show the editorial intro overlay on a fresh session.
 * sessionStorage gate: shown once per tab/session, never on every route change.
 * Resets on full page reload. SSR-safe.
 */
import { useEffect, useState } from 'react';

const KEY = 'panna_intro_seen_v1';

function readGate() {
  if (typeof window === 'undefined') return false;
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function useIntroGate(durationMs = 1400) {
  // Lazy initializer: avoid effects for one-shot setup read from sessionStorage.
  const [show, setShow] = useState(() => !readGate());

  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return show;
}