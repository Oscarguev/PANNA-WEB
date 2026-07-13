/* eslint-disable react-hooks/set-state-in-effect */
// setState vive dentro de loadUserData() (useCallback async); se invoca desde useEffect
// tras detectar sesión activa. Patrón de sincronización con fuente externa, válido aquí.
import { useState, useRef, useEffect, useCallback } from 'react';
import { useUIStore } from '../stores/useUIStore';
import { useSessionStore } from '../stores/useSessionStore';
import { CloseIcon, AlertTriangleIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import { supabase } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ErrorBox({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[13px] text-brand-danger border border-brand-danger/40 bg-brand-dangerBg px-3 py-2.5 flex items-start gap-2">
      <AlertTriangleIcon size={14} className="text-brand-danger mt-0.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export default function CustomerPortal() {
  const isOpen    = useUIStore((state) => state.portalOpen);
  const openCart  = useUIStore((state) => state.openCart);
  const closePortal = useUIStore((state) => state.closePortal);

  const session       = useSessionStore((state) => state);
  const login         = useSessionStore((state) => state.login);
  const register      = useSessionStore((state) => state.register);
  const logout        = useSessionStore((state) => state.logout);
  const wallet        = session.walletBalance ?? 0;
  const puntos        = session.points ?? 0;

  const [view, setView]                    = useState('login');
  const [email, setEmail]                  = useState('');
  const [password, setPassword]            = useState('');
  const [nombre, setNombre]                = useState('');
  const [telefono, setTelefono]            = useState('');
  const [cumpleanos, setCumpleanos]        = useState('');
  const [authError, setAuthError]          = useState('');
  const [submitting, setSubmitting]        = useState(false);
  const [confirmLogout, setConfirmLogout]  = useState(false);
  const [ordenes, setOrdenes]              = useState([]);
  const [favoritos, setFavoritos]          = useState([]);
  const [loadingPortal, setLoadingPortal]  = useState(false);

  const [tab, setTab] = useState('cuenta');

  const portalRef = useRef(null);
  useFocusTrap(isOpen, closePortal, portalRef);

  const loadUserData = useCallback(async () => {
    setLoadingPortal(true);
    setOrdenes([]);
    setFavoritos([]);
    try {
      const [ordenesRes, favoritosRes] = await Promise.allSettled([
        supabase
          .from('ordenes')
          .select('id, created_at, total, estado, items, metodo_pago')
          .eq('user_email', session.email)
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('favoritos')
          .select('producto_id, productos_market(*)')
          .eq('user_email', session.email)
          .limit(12),
      ]);
      if (ordenesRes.status === 'fulfilled' && ordenesRes.value.data) setOrdenes(ordenesRes.value.data);
      if (favoritosRes.status === 'fulfilled' && favoritosRes.value.data) {
        const flat = favoritosRes.value.data.map((r) => r.productos_market).filter(Boolean);
        setFavoritos(flat);
      }
    } finally {
      setLoadingPortal(false);
    }
  }, [session.email]);

  // Reset de error y confirmación cuando el portal se abre — sincronización con modal.
  useEffect(() => {
    if (!isOpen) return;
     
    setAuthError('');
     
    setConfirmLogout(false);
  }, [isOpen]);

  // Dispara la carga de datos del usuario; loadUserData gestiona sus propios setState async.
   
  useEffect(() => {
    if (isOpen && session.loggedIn) {
      loadUserData();
    }
  }, [isOpen, session.loggedIn, loadUserData]);

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const { ok, error } = await login(email, password);
    setSubmitting(false);
    if (!ok) {
      setAuthError(error || 'Credenciales inválidas.');
      return;
    }
    setEmail(''); setPassword(''); setAuthError('');
    track(EVENTS.LOGIN_SUCCESS);
    setView('cuenta');
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const { ok, error } = await register({ email, password, nombre, telefono, cumpleanos });
    setSubmitting(false);
    if (!ok) {
      setAuthError(error || 'No pudimos crear tu cuenta.');
      return;
    }
    setEmail(''); setPassword(''); setNombre(''); setTelefono(''); setCumpleanos(''); setAuthError('');
    track(EVENTS.REGISTER_SUCCESS);
    setView('cuenta');
  };

  const handleLogoutConfirm = () => {
    logout();
    setConfirmLogout(false);
    setView('login');
    closePortal();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-base ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closePortal}
        aria-hidden="true"
      />
      <div
        ref={portalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-title"
        tabIndex={-1}
        className={`fixed right-0 top-0 h-full w-full sm:w-[480px] z-50 bg-white border-l border-brand-border shadow-sm transition-transform duration-base ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="relative z-10 flex flex-col h-full">

          <header className="p-6 md:p-8 border-b border-brand-border flex items-center justify-between bg-brand-surface">
            <div className="space-y-1 text-left">
              <span className="text-[12px] text-brand-textSubtle">
                {session.loggedIn ? 'Tu cuenta' : view === 'register' ? 'Únete al club' : 'Acceso de socios'}
              </span>
              <h2 id="portal-title" className="font-display text-2xl text-brand-textMain font-light">
                {session.loggedIn ? `Hola, ${(session.userNombre || '').split(' ')[0]}` : view === 'register' ? 'Crear cuenta PANNA' : 'Iniciar sesión'}
              </h2>
            </div>
            <button
              onClick={closePortal}
              className="w-11 h-11 min-w-[44px] min-h-[44px] border border-brand-border hover:border-brand-primary flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-colors duration-base bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="Cerrar portal"
            >
              <CloseIcon size={14} />
            </button>
          </header>

          {!session.loggedIn ? (
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">

              <div className="bg-brand-surfaceMuted border border-brand-border p-4 text-left space-y-1">
                <p className="text-[13px] text-brand-textSubtle">PANNA Rewards</p>
                <p className="text-[14px] text-brand-textMain leading-relaxed">
                  Acumula puntos en cada visita al café y canjéalos por crédito directo en tu próxima factura.
                </p>
              </div>

              {view === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5 text-left" noValidate>
                  <div className="space-y-1">
                    <label htmlFor="login-email" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                      Correo electrónico
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="alejandro@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-boxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="login-password" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                      Contraseña
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-boxed"
                    />
                  </div>

                  <ErrorBox id="login-error" message={authError} />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {submitting ? <><Spinner /> Verificando…</> : 'Iniciar sesión'}
                  </button>

                  <p className="text-[13px] text-center text-brand-textMain">
                    ¿Aún no eres socio?{' '}
                    <button
                      type="button"
                      onClick={() => { setView('register'); setAuthError(''); }}
                      className="text-brand-accent border-b border-brand-accent hover:text-brand-primary hover:border-brand-primary min-h-[44px] inline-flex items-center"
                    >
                      Crear cuenta
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-5 text-left" noValidate>
                  <div className="space-y-1">
                    <label htmlFor="register-nombre" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                      Nombre completo *
                    </label>
                    <input
                      id="register-nombre"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Alejandro Valenzuela"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="input-boxed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="register-email" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                      Correo electrónico *
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-boxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="register-telefono" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                        Teléfono
                      </label>
                      <input
                        id="register-telefono"
                        type="tel"
                        autoComplete="tel"
                        placeholder="7794-7885"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="input-boxed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="register-cumpleanos" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                        Cumpleaños
                      </label>
                      <input
                        id="register-cumpleanos"
                        type="date"
                        autoComplete="bday"
                        value={cumpleanos}
                        onChange={(e) => setCumpleanos(e.target.value)}
                        className="input-boxed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="register-password" className="text-[14px] text-brand-textMain block border-b border-brand-border pb-2">
                      Crea una contraseña *
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="Mín. 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-boxed"
                    />
                  </div>

                  <ErrorBox id="register-error" message={authError} />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {submitting ? <><Spinner /> Creando cuenta…</> : 'Crear mi cuenta'}
                  </button>

                  <p className="text-[13px] text-center text-brand-textMain">
                    ¿Ya eres socio?{' '}
                    <button
                      type="button"
                      onClick={() => { setView('login'); setAuthError(''); }}
                      className="text-brand-accent border-b border-brand-accent hover:text-brand-primary hover:border-brand-primary min-h-[44px] inline-flex items-center"
                    >
                      Iniciar sesión
                    </button>
                  </p>
                </form>
              )}
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-surface border border-brand-border p-4 space-y-1 text-left">
                  <span className="text-[12px] text-brand-textSubtle block">PANNA Wallet</span>
                  <span className="text-2xl font-display text-brand-textMain font-light tabular-nums">${wallet.toFixed(2)}</span>
                </div>
                <div className="bg-brand-surface border border-brand-border p-4 space-y-1 text-left">
                  <span className="text-[12px] text-brand-textSubtle block">Puntos acumulados</span>
                  <span className="text-2xl font-display text-brand-textMain font-light tabular-nums">{puntos}</span>
                </div>
              </div>

              <div role="tablist" aria-label="Secciones de la cuenta" className="flex border-b border-brand-border">
                {[
                  { id: 'cuenta',   label: 'Cuenta' },
                  { id: 'pedidos',  label: 'Pedidos' },
                  { id: 'favoritos',label: 'Favoritos' },
                ].map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    aria-controls={`panel-${t.id}`}
                    id={`tab-${t.id}`}
                    tabIndex={tab === t.id ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    className={`min-h-[44px] px-5 text-[14px] transition-colors duration-base -mb-px border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                      tab === t.id
                        ? 'border-brand-primary text-brand-textMain'
                        : 'border-transparent text-brand-textSubtle hover:text-brand-textMain'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div
                role="tabpanel"
                id="panel-cuenta"
                aria-labelledby="tab-cuenta"
                hidden={tab !== 'cuenta'}
                className="space-y-5 text-left"
              >
                <div className="bg-brand-surfaceMuted border border-brand-border p-4 space-y-3">
                  <p className="text-[13px] text-brand-textSubtle">Datos de membresía</p>
                  <div className="space-y-1">
                    <span className="block text-[13px] text-brand-textMain">{session.userNombre || '—'}</span>
                    <span className="block text-[13px] text-brand-textSubtle break-all">{session.email || '—'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmLogout(true)}
                  className="text-[13px] text-brand-textMain border-b border-brand-textMain pb-0.5 hover:text-brand-danger hover:border-brand-danger min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-danger"
                >
                  Cerrar sesión
                </button>
              </div>

              <div
                role="tabpanel"
                id="panel-pedidos"
                aria-labelledby="tab-pedidos"
                hidden={tab !== 'pedidos'}
                className="space-y-3"
              >
                {loadingPortal ? (
                  <div className="flex items-center justify-center py-10 gap-2 text-[14px] text-brand-textSubtle">
                    <Spinner /> Cargando pedidos…
                  </div>
                ) : ordenes.length === 0 ? (
                  <div className="py-16 text-center space-y-3 border border-dashed border-brand-border">
                    <p className="text-[14px] text-brand-textSubtle">Aún no tienes pedidos registrados.</p>
                    <button
                      onClick={openCart}
                      className="inline-block text-[13px] text-brand-accent border-b border-brand-accent pb-0.5 hover:text-brand-primary hover:border-brand-primary min-h-[44px] inline-flex items-center"
                    >
                      Explorar la carta
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {ordenes.map((o) => (
                      <li key={o.id} className="border border-brand-border bg-brand-surface p-4 space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-brand-textMain font-medium">PP-{o.id?.slice(-8).toUpperCase()}</span>
                          <span className="text-[12px] text-brand-textSubtle">{new Date(o.created_at).toLocaleDateString('es-SV')}</span>
                        </div>
                        <span className="block text-[13px] text-brand-textMain">
                          {Array.isArray(o.items) ? o.items.length : 0} artículo(s) · <strong className="text-brand-accent">${Number(o.total || 0).toFixed(2)}</strong>
                        </span>
                        <span className="block text-[12px] text-brand-textSubtle">Estado: {o.estado}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                role="tabpanel"
                id="panel-favoritos"
                aria-labelledby="tab-favoritos"
                hidden={tab !== 'favoritos'}
                className="space-y-3"
              >
                {loadingPortal ? (
                  <div className="flex items-center justify-center py-10 gap-2 text-[14px] text-brand-textSubtle">
                    <Spinner /> Cargando favoritos…
                  </div>
                ) : favoritos.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-brand-border">
                    <p className="text-[14px] text-brand-textSubtle">Aún no has guardado favoritos.</p>
                  </div>
                ) : (
                  <ul className="grid grid-cols-2 gap-3">
                    {favoritos.map((p) => (
                      <li key={p.id} className="border border-brand-border bg-brand-surface">
                        <img src={p.image} alt="" className="w-full h-24 object-cover bg-brand-placeholder" />
                        <div className="p-3 text-left space-y-0.5">
                          <span className="block text-[13px] font-display text-brand-textMain font-normal">{p.title}</span>
                          <span className="block text-[12px] text-brand-accent tabular-nums">${Number(p.price || 0).toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmLogout && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          aria-describedby="logout-desc"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-brand-border max-w-sm w-full p-6 space-y-4"
          >
            <h3 id="logout-title" className="font-display text-xl text-brand-textMain font-light">
              ¿Cerrar tu sesión?
            </h3>
            <p id="logout-desc" className="text-[14px] text-brand-textMain leading-relaxed">
              Tu sesión activa finalizará. Tus puntos y crédito PANNA Wallet quedan seguros en tu cuenta.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 min-h-[44px] py-3 border border-brand-border text-brand-textMain hover:border-brand-primary text-[14px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 min-h-[44px] py-3 bg-brand-cta text-white hover:bg-brand-ctaHover text-[14px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}