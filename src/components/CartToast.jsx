import { useEffect } from 'react';
import { useUIStore } from '../stores/useUIStore';

export default function CartToast() {
  const toast         = useUIStore((state) => state.cartToast);
  const clearCartToast = useUIStore((state) => state.clearCartToast);
  const openCart      = useUIStore((state) => state.openCart);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearCartToast, 4000);
    return () => clearTimeout(timer);
  }, [toast, clearCartToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-24 right-6 md:right-16 z-50 bg-white border border-brand-primary/40 px-5 py-4 flex items-center gap-4 max-w-sm shadow-sm"
    >
      <div className="w-10 h-10 overflow-hidden border border-brand-border bg-brand-placeholder shrink-0">
        <img src={toast.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="text-left flex-grow">
        <span className="text-[12px] text-brand-textSubtle block">Añadido a la bolsa</span>
        <h4 className="text-[13px] text-brand-textMain truncate max-w-[180px]">{toast.title}</h4>
        <span className="text-[13px] text-brand-accent tabular-nums">${toast.price.toFixed(2)}</span>
      </div>
      <button
        onClick={() => {
          openCart();
          clearCartToast();
        }}
        className="min-h-[44px] px-4 py-3 text-[13px] text-brand-textMain border-b border-brand-textMain hover:border-brand-primary hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Ver bolsa
      </button>
    </div>
  );
}