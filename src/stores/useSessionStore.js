import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const computeTier = (points) => {
  if (points >= 1500) return 'Forest'
  if (points >= 500)  return 'Sprout'
  return 'Seed'
}

const EMPTY = {
  loggedIn:      false,
  id:            null,
  name:          '',
  email:         '',
  points:        0,
  level:         'Seed',
  walletBalance: 0,
  numeroSocio:   '',
  reservations:  [],
  orderHistory:  [],
  favorites:     [],
}

export const useSessionStore = create((set, get) => ({
  ...EMPTY,

  loadProfile: async (userId, email) => {
    const [{ data: perfil }, { data: reservas }] = await Promise.all([
      supabase.from('perfiles').select('*').eq('id', userId).single(),
      supabase
        .from('reservaciones')
        .select('id, fecha, hora, comensales, notas, estado, created_at')
        .eq('cliente_id', userId)
        .order('fecha', { ascending: false })
        .limit(10),
    ])

    if (!perfil) return

    set({
      loggedIn:      true,
      id:            userId,
      name:          perfil.nombre || email.split('@')[0],
      email,
      points:        perfil.puntos ?? 0,
      level:         computeTier(perfil.puntos ?? 0),
      walletBalance: parseFloat(perfil.wallet_balance) || 0,
      numeroSocio:   perfil.numero_socio || '',
      reservations:  reservas || [],
      orderHistory:  [],
      favorites:     [],
    })
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await get().loadProfile(data.user.id, data.user.email)
  },

  register: async (email, password, nombre) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    })
    if (error) throw error
    if (data.user) await get().loadProfile(data.user.id, data.user.email)
  },

  logout: async () => {
    await supabase.auth.signOut()
    set(EMPTY)
  },

  addReservationLocal: (resData) => set((state) => ({
    reservations: [resData, ...state.reservations],
  })),

  canjearPuntos: async (cantidad) => {
    const { loggedIn } = get()
    if (!loggedIn) return { error: 'No autenticado' }

    const { data, error } = await supabase.rpc('canjear_puntos', { p_puntos: cantidad })
    if (error) return { error: error.message }

    set({
      points:        data.puntos,
      level:         data.nivel,
      walletBalance: parseFloat(data.wallet_balance),
    })
    return { credito: data.credito_ganado }
  },

  sumarPuntos: async (cantidad) => {
    const { loggedIn } = get()
    if (!loggedIn) return

    const { data, error } = await supabase.rpc('sumar_puntos', { p_puntos: cantidad })
    if (error || !data) return

    set({ points: data.puntos, level: data.nivel })
  },

  spendWallet: async (monto) => {
    const { loggedIn } = get()
    if (!loggedIn || monto <= 0) return

    const { data, error } = await supabase.rpc('gastar_wallet', { p_monto: monto })
    if (error || !data) return

    set({ walletBalance: parseFloat(data.wallet_balance) })
  },

  checkoutSuccess: ({ pointsEarned }) => {
    get().sumarPuntos(pointsEarned)
  },
}))
