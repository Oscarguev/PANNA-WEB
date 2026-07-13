/* eslint-disable react-hooks/set-state-in-effect */
// Los setState dentro de refresh()/loadUserData() son callbacks async de fetch externo;
  // aquí el lint marca llamadas encadenadas desde useEffect, pero el patrón es legítimo.
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_LABELS = {
  pendiente:  { label: 'Pendiente',  icon: '○' },
  confirmada: { label: 'Confirmada', icon: '✓' },
  finalizada: { label: 'Finalizada', icon: '◆' },
  cancelada:  { label: 'Cancelada',  icon: '✕' },
}

const STATUS_NEXT = { pendiente: 'confirmada', confirmada: 'finalizada', finalizada: 'cancelada', cancelada: 'pendiente' }

const STATUS_TONE = {
  pendiente:  'text-amber-300 border-amber-300/40',
  confirmada: 'text-emerald-300 border-emerald-300/40',
  finalizada: 'text-indigo-300 border-indigo-300/40',
  cancelada:  'text-rose-300 border-rose-300/40',
}

function StatusBadge({ status, onChange, loading }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pendiente
  const tone = STATUS_TONE[status] || STATUS_TONE.pendiente
  return (
    <button
      onClick={onChange}
      disabled={loading}
      aria-label={`Estado: ${s.label}. Clic para cambiar.`}
      className={`px-3 py-1.5 border text-[12px] text-stone-100 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 ${tone}`}
    >
      <span aria-hidden="true">{loading ? '…' : s.icon}</span>
      <span>{loading ? '…' : s.label}</span>
    </button>
  )
}

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function LoginForm({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Credenciales incorrectas.')
    setLoading(false)
    if (!error) onLogin()
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[12px] text-stone-400 block">
            Panna &amp; Pomodoro
          </span>
          <h1 className="font-display text-3xl text-stone-50 font-light">
            Panel de Reservaciones
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="block text-[12px] text-stone-400">
              Correo
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-stone-700 hover:border-stone-500 focus:border-amber-400 text-stone-50 text-sm py-2 px-1 focus:outline-none transition-colors duration-base placeholder:text-stone-600"
              placeholder="admin@pannapomodoro.sv"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-password" className="block text-[12px] text-stone-400">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-stone-700 hover:border-stone-500 focus:border-amber-400 text-stone-50 text-sm py-2 px-1 focus:outline-none transition-colors duration-base placeholder:text-stone-600"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p role="alert" className="text-rose-300 text-[13px] border border-rose-300/40 bg-rose-400/10 px-3 py-2 flex items-start gap-2">
              <span aria-hidden="true">⚠</span><span>{error}</span>
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-50 text-stone-900 text-[14px] hover:bg-amber-100 transition-colors duration-base disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            {loading ? <><Spinner /> Ingresando…</> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [session, setSession]         = useState(null)
  const [reservaciones, setReservas]  = useState([])
  const [loading, setLoading]         = useState(true)
  const [updatingId, setUpdatingId]   = useState(null)
  const [filtro, setFiltro]           = useState('todas')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const fetchReservas = useCallback(async () => {
    const { data } = await supabase
      .from('reservaciones')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })
    return data || []
  }, [])

  const refresh = useCallback(async () => {
     
    setLoading(true);
    const data = await fetchReservas();
     
    setReservas(data);
     
    setLoading(false);
  }, [fetchReservas])

  // Carga inicial de reservas al montar; refresh() gestiona setLoading/setReservas internamente.
   
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    refresh().then(() => { if (cancelled) return; });
    return () => { cancelled = true; };
  }, [session, refresh])

  const cycleStatus = async (id, currentStatus) => {
    const next = STATUS_NEXT[currentStatus] || 'pendiente'
    setUpdatingId(id)
    await supabase.from('reservaciones').update({ estado: next }).eq('id', id)
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: next } : r))
    setUpdatingId(null)
  }

  const handleLogout = () => setShowLogoutConfirm(true)
  const confirmLogout = async () => {
    setShowLogoutConfirm(false)
    await supabase.auth.signOut()
  }

  if (!session) return <LoginForm onLogin={() => {}} />

  const filtradas = filtro === 'todas'
    ? reservaciones
    : reservaciones.filter(r => r.estado === filtro)

  const counts = {
    todas:      reservaciones.length,
    pendiente:  reservaciones.filter(r => r.estado === 'pendiente').length,
    confirmada: reservaciones.filter(r => r.estado === 'confirmada').length,
    cancelada:  reservaciones.filter(r => r.estado === 'cancelada').length,
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50">

      <header className="border-b border-stone-800 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[12px] text-stone-400 block">
            Panna &amp; Pomodoro
          </span>
          <h1 className="font-display text-xl text-stone-50 font-light">
            Reservaciones
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={refresh}
            className="text-[13px] text-stone-400 hover:text-stone-100 transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 px-1 py-1"
          >
            Actualizar
          </button>
          <button
            onClick={handleLogout}
            className="text-[13px] text-stone-400 hover:text-rose-300 transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 px-1 py-1"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="px-6 md:px-12 py-8 space-y-6">

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtros de estado">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              role="tab"
              aria-selected={filtro === key}
              className={`px-4 py-2 min-h-[44px] border text-[13px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                filtro === key
                  ? 'bg-amber-300 text-stone-950 border-amber-300'
                  : 'border-stone-700 text-stone-400 hover:border-stone-500'
              }`}
            >
              {key === 'todas' ? 'Todas' : STATUS_LABELS[key]?.label} · {count}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 text-center text-stone-400 inline-flex items-center justify-center gap-3 w-full">
            <Spinner />
            Cargando reservaciones
          </div>
        ) : filtradas.length === 0 ? (
          <div className="py-24 text-center text-stone-400">
            Sin reservaciones{filtro !== 'todas' ? ` (${filtro})` : ''}.
          </div>
        ) : (
          <div className="overflow-x-auto border border-stone-800">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/40">
                  {['Fecha', 'Hora', 'Nombre', 'Teléfono', 'Zona', 'Comensales', 'Notas', 'Recibida', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 text-[12px] text-stone-400 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-stone-800 hover:bg-stone-900/40 transition-colors duration-base ${i % 2 === 0 ? '' : 'bg-stone-900/20'}`}
                  >
                    <td className="px-4 py-3.5 text-[13px] text-stone-50 whitespace-nowrap">
                      {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-SV', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-stone-50 whitespace-nowrap">
                      {r.hora?.slice(0, 5)}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-stone-50">
                      {r.nombre}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-stone-50 whitespace-nowrap">
                      {r.telefono
                        ? <a href={`https://wa.me/503${r.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline transition-colors duration-base">{r.telefono}</a>
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-stone-300 whitespace-nowrap">
                      {r.zona === 'exterior' ? 'Exterior' : 'Salón'}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-stone-50 text-center">
                      {r.comensales}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-stone-300 max-w-[200px] truncate">
                      {r.notas || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-stone-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString('es-SV', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge
                        status={r.estado}
                        onChange={() => cycleStatus(r.id, r.estado)}
                        loading={updatingId === r.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="bg-stone-950 border border-stone-800 p-6 max-w-sm w-full space-y-4">
            <h2 id="logout-title" className="font-display text-xl text-stone-50 font-light">
              ¿Cerrar sesión?
            </h2>
            <p className="text-sm text-stone-300">
              Tendrás que volver a ingresar para acceder al panel.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 min-h-[44px] border border-stone-700 text-stone-300 hover:text-stone-50 hover:border-stone-500 text-[13px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 min-h-[44px] bg-rose-400/90 text-stone-950 hover:bg-rose-300 text-[13px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
