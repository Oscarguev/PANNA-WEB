import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => set((state) => {
        const exists = state.items.find((i) => i.id === item.id)
        if (exists) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          }
        }
        return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] }
      }),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'panna_cart' }
  )
)

export const selectCartCount = (state) =>
  state.items.reduce((acc, i) => acc + i.quantity, 0)

export const selectCartSubtotal = (state) =>
  state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
