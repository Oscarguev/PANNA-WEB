import { create } from 'zustand'

export const useUIStore = create((set) => ({
  cartOpen: false,
  portalOpen: false,
  cartToast: null,
  newsletterOpen: false,

  openCart:    () => set({ cartOpen: true }),
  closeCart:   () => set({ cartOpen: false }),
  openPortal:  () => set({ portalOpen: true }),
  closePortal: () => set({ portalOpen: false }),

  showCartToast:  (item) => set({ cartToast: item }),
  clearCartToast: () => set({ cartToast: null }),

  setNewsletterOpen: (v) => set({ newsletterOpen: v }),
}))
