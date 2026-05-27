import { useEffect } from 'react'
import { useUIStore } from '../stores/useUIStore'

export default function CartToast() {
  const toast         = useUIStore((state) => state.cartToast)
  const clearCartToast = useUIStore((state) => state.clearCartToast)
  const openCart      = useUIStore((state) => state.openCart)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(clearCartToast, 4000)
    return () => clearTimeout(timer)
  }, [toast])

  if (!toast) return null

  return (
    <div className="fixed top-24 right-6 md:right-16 z-50 bg-[#0f0f0f]/95 border border-brand-primary/20 backdrop-blur-md px-5 py-4 rounded-[2px] shadow-2xl flex items-center space-x-4 animate-fade-in max-w-sm">
      <div className="w-10 h-10 rounded-[2px] overflow-hidden border border-white/5 bg-neutral-950 flex-shrink-0">
        <img src={toast.image} alt={toast.title} className="w-full h-full object-cover" />
      </div>
      <div className="text-left flex-grow">
        <span className="font-body text-[12px] tracking-[0.25em] text-brand-primary uppercase font-bold block">Añadido a la Bolsa</span>
        <h4 className="font-display text-xs text-brand-textMain font-light truncate max-w-[180px]">{toast.title}</h4>
        <span className="font-body text-[12px] text-brand-textMuted">${toast.price.toFixed(2)}</span>
      </div>
      <button
        onClick={() => {
          openCart()
          clearCartToast()
        }}
        className="px-3.5 py-1.5 bg-brand-primary text-black font-body text-[12px] tracking-wider uppercase font-bold rounded-full hover:bg-[#ab8b5f] transition-all duration-300"
      >
        Ver Bolsa
      </button>
    </div>
  )
}
