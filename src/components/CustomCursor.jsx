import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.documentElement.classList.add('custom-cursor');

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let isHovered = false;

    const onMove = (e) => {
      const base = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      dot.style.transform  = base;
      ring.style.transform = isHovered ? `${base} scale(1.7)` : base;
    };

    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], label, select')) {
        isHovered = true;
        ring.style.borderColor = 'rgba(197,168,128,0.8)';
        ring.style.opacity = '0.9';
        dot.style.opacity  = '0';
      }
    };

    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], label, select')) {
        isHovered = false;
        ring.style.borderColor = 'rgba(197,168,128,0.3)';
        ring.style.opacity = '0.55';
        dot.style.opacity  = '1';
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseout',   onOut);

    return () => {
      document.documentElement.classList.remove('custom-cursor');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-brand-primary"
        style={{
          width: '5px', height: '5px',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
          transition: 'opacity 150ms ease',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: '28px', height: '28px',
          border: '1px solid rgba(197,168,128,0.3)',
          opacity: 0.55,
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
          transition: 'transform 90ms linear, border-color 200ms ease, opacity 200ms ease',
        }}
      />
    </>
  );
}
