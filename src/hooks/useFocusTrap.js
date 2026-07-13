import { useEffect, useRef, useCallback } from 'react';

/**
 * Focus trap for modals/drawers.
 * - Moves focus to first focusable element on open.
 * - Caps Tab inside the container.
 * - Closes on Escape.
 * - Restores focus to the previously focused element on close.
 */
export function useFocusTrap(isOpen, onClose, containerRef) {
  const previouslyFocused = useRef(null);

  const getFocusable = useCallback(() => {
    if (!containerRef.current) return [];
    const sel = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(containerRef.current.querySelectorAll(sel));
  }, [containerRef]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;

    const focusFirst = () => {
      const els = getFocusable();
      if (els.length) {
        els[0].focus();
      } else if (containerRef.current) {
        containerRef.current.focus();
      }
    };

    const t = setTimeout(focusFirst, 50);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = getFocusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused.current && typeof previouslyFocused.current.focus === 'function') {
        previouslyFocused.current.focus();
      }
    };
  }, [isOpen, onClose, containerRef, getFocusable]);
}