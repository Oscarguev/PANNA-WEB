import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_LABELS = {
  pendiente:  { label: 'Pendiente',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  confirmada: { label: 'Confirmada', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  finalizada: { label: 'Finalizada', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  cancelada:  { label: 'Cancelada',  color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

const STATUS_NEXT = { pendiente: 'confirmada', confirmada: 'finalizada', finalizada: 'cancelada', cancelada: 'pendiente' }

function StatusBadge({ status, onChange, loading }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pendiente
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`px-3 py-1 rounded-full border text-[11px] font-body tracking-[0.15em] uppercase font-semibold transition-all duration-300 hover:opacity-80 disabled:opacity-40 ${s.color}`}
    >
      {loading ? '...' : s.label}
    </button>
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="font-body text-[11px] tracking-[0.35em] text-brand-primary uppercase font-semibold block">
            Panna & Pomodoro
          </span>
          <h1 className="font-display text-3xl text-brand-textMain font-light uppercase tracking-wide">
            Panel Admin
          </h1>
          <div className="w-10 h-[1px] bg-brand-primary/30 mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-300 font-light placeholder-white/20"
              placeholder="admin@pannapomodoro.sv"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-300 font-light placeholder-white/20"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-red-400 text-[11px] font-body tracking-wider">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-primary text-black font-body tracking-[0.25em] text-[11px] uppercase font-bold rounded-full hover:bg-[#ab8b5f] transition-all duration-500 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const fetchReservas = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reservaciones')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })
    setReservas(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) fetchReservas()
  }, [session, fetchReservas])

  const cycleStatus = async (id, currentStatus) => {
    const next = STATUS_NEXT[currentStatus] || 'pendiente'
    setUpdatingId(id)
    await supabase.from('reservaciones').update({ estado: next }).eq('id', id)
    setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: next } : r))
    setUpdatingId(null)
  }

  const handleLogout = () => supabase.auth.signOut()

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
    <div className="min-h-screen bg-[#050505] text-brand-textMain">

      {/* Header */}
      <div className="border-b border-white/[0.04] px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="font-body text-[11px] tracking-[0.3em] text-brand-primary uppercase font-semibold block">
            Panna & Pomodoro
          </span>
          <h1 className="font-display text-xl text-brand-textMain font-light uppercase tracking-wider">
            Reservaciones
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchReservas}
            className="font-body text-[11px] tracking-[0.2em] uppercase text-brand-textMuted hover:text-brand-primary transition-colors duration-300"
          >
            Actualizar
          </button>
          <button
            onClick={handleLogout}
            className="font-body text-[11px] tracking-[0.2em] uppercase text-brand-textMuted/50 hover:text-red-400 transition-colors duration-300"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 space-y-6">

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`px-4 py-1.5 rounded-full border text-[11px] font-body tracking-[0.15em] uppercase font-semibold transition-all duration-300 ${
                filtro === key
                  ? 'bg-brand-primary text-black border-brand-primary'
                  : 'border-white/10 text-brand-textMuted hover:border-brand-primary/40'
              }`}
            >
              {key === 'todas' ? 'Todas' : STATUS_LABELS[key]?.label} ({count})
            </button>
          ))}
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="py-24 text-center font-body text-[11px] tracking-wider text-brand-textMuted/40 uppercase animate-pulse">
            Cargando reservaciones...
          </div>
        ) : filtradas.length === 0 ? (
          <div className="py-24 text-center font-body text-[11px] tracking-wider text-brand-textMuted/40 uppercase">
            Sin reservaciones {filtro !== 'todas' ? `(${filtro})` : ''}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[4px] border border-white/[0.04]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                  {['Fecha', 'Hora', 'Nombre', 'Teléfono', 'Zona', 'Comensales', 'Notas', 'Recibida', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 font-body text-[11px] tracking-[0.25em] uppercase text-brand-textMuted/60 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200 ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                  >
                    <td className="px-4 py-3.5 font-body text-xs text-brand-textMain whitespace-nowrap">
                      {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-SV', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3.5 font-body text-xs text-brand-textMain whitespace-nowrap">
                      {r.hora?.slice(0, 5)}
                    </td>
                    <td className="px-4 py-3.5 font-body text-xs text-brand-textMain">
                      {r.nombre}
                    </td>
                    <td className="px-4 py-3.5 font-body text-xs text-brand-textMain whitespace-nowrap">
                      {r.telefono
                        ? <a href={`https://wa.me/503${r.telefono.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">{r.telefono}</a>
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5 font-body text-[11px] text-brand-textMuted uppercase tracking-wider whitespace-nowrap">
                      {r.zona === 'exterior' ? 'Exterior' : 'Salón'}
                    </td>
                    <td className="px-4 py-3.5 font-body text-xs text-brand-textMain text-center">
                      {r.comensales}
                    </td>
                    <td className="px-4 py-3.5 font-body text-xs text-brand-textMuted max-w-[200px] truncate">
                      {r.notas || '—'}
                    </td>
                    <td className="px-4 py-3.5 font-body text-[11px] text-brand-textMuted/60 whitespace-nowrap">
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
    </div>
  )
}
