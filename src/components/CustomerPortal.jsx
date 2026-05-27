import React, { useState, useEffect } from 'react';
import { CloseIcon, UserIcon, StarIcon, TagIcon, ClockIcon, TicketIcon } from './Icons';
import { useSessionStore } from '../stores/useSessionStore';
import { useUIStore } from '../stores/useUIStore';
import { useCartStore } from '../stores/useCartStore';
import { track, identify, EVENTS } from '../analytics';

export default function CustomerPortal() {
  const userSession = useSessionStore((state) => state);
  const login       = useSessionStore((state) => state.login);
  const logout      = useSessionStore((state) => state.logout);
  const register    = useSessionStore((state) => state.register);

  const canjearPuntos = useSessionStore((state) => state.canjearPuntos);
  const isOpen   = useUIStore((state) => state.portalOpen);
  const onClose  = useUIStore((state) => state.closePortal);

  const addItem       = useCartStore((state) => state.addItem);
  const showCartToast = useUIStore((state) => state.showCartToast);

  const [tab, setTab]           = useState('login');
  const [canjeando, setCanjeando]   = useState(false);
  const [canjeMensaje, setCanjeMensaje] = useState(null); // { tipo: 'ok'|'error', texto }
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre]     = useState('');
  const [confirm, setConfirm]   = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError]     = useState(null);

  useEffect(() => {
    if (isOpen) track(EVENTS.DRAWER_OPEN, { drawer: 'portal', logged_in: userSession?.loggedIn ?? false });
  }, [isOpen]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await login(email, password);
      identify(email, { loggedIn: true });
      setEmail(''); setPassword('');
    } catch (err) {
      setAuthError('Email o contraseña incorrectos.');
    }
    setIsLoggingIn(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (password !== confirm) { setAuthError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6)  { setAuthError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setIsLoggingIn(true);
    try {
      await register(email, password, nombre);
      identify(email, { name: nombre, loggedIn: true });
      setEmail(''); setPassword(''); setNombre(''); setConfirm('');
    } catch (err) {
      setAuthError(err.message || 'No se pudo crear la cuenta.');
    }
    setIsLoggingIn(false);
  };

  return (
    <>
      {/* Background shadow overlay */}
      <div
        className={`fixed inset-0 bg-black/85 backdrop-blur-sm z-50 transition-opacity duration-700 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Customer Portal Drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-full sm:w-[460px] z-50 bg-[#0c0c0c] border-r border-white/[0.04] shadow-2xl transition-transform duration-[800ms] ease-high-end transform flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Symmetrical luxury border contour */}
        <div className="absolute top-4 bottom-4 left-4 right-4 border border-brand-primary/5 pointer-events-none rounded-[1px] z-0" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Header Block */}
          <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold">
                {userSession?.loggedIn ? 'Tu Cuenta' : 'Acceso Privado'}
              </span>
              <h3 className="font-display text-2xl text-brand-textMain font-light uppercase tracking-wide">
                {userSession?.loggedIn ? 'Área de Socios' : 'PANNA Rewards'}
              </h3>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 hover:border-brand-primary flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-all duration-300 bg-brand-surface/40"
            >
              <CloseIcon size={14} />
            </button>
          </div>

          {/* DYNAMIC SCENE CONTAINER */}
          <div className="flex-grow overflow-y-auto px-6 py-6 scrollbar-thin">
            
            {/* SCENE A: NOT LOGGED IN */}
            {!userSession?.loggedIn ? (
              <div className="space-y-6 text-left py-4">

                {/* Tabs */}
                <div className="flex border-b border-white/[0.06]">
                  {['login', 'register'].map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setAuthError(null); }}
                      className={`flex-1 py-2.5 font-body text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 border-b-2 -mb-px ${
                        tab === t
                          ? 'border-brand-primary text-brand-primary'
                          : 'border-transparent text-brand-textMuted hover:text-brand-textMain'
                      }`}
                    >
                      {t === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </button>
                  ))}
                </div>

                {tab === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Email *</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Contraseña *</label>
                      <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10" />
                    </div>
                    {authError && <p className="text-red-400 text-[12px] font-body tracking-wider">{authError}</p>}
                    <button type="submit" disabled={isLoggingIn}
                      className="w-full py-4 bg-brand-primary text-black font-body tracking-[0.25em] text-xs uppercase font-bold transition-all duration-500 rounded-full shadow-lg hover:shadow-brand-primary/20 disabled:opacity-50">
                      {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Nombre *</label>
                      <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Email *</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Contraseña *</label>
                      <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Confirmar Contraseña *</label>
                      <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10" />
                    </div>
                    {authError && <p className="text-red-400 text-[12px] font-body tracking-wider">{authError}</p>}
                    <button type="submit" disabled={isLoggingIn}
                      className="w-full py-4 bg-brand-primary text-black font-body tracking-[0.25em] text-xs uppercase font-bold transition-all duration-500 rounded-full shadow-lg hover:shadow-brand-primary/20 disabled:opacity-50">
                      {isLoggingIn ? 'Creando cuenta...' : 'Unirme al Club PANNA'}
                    </button>
                  </form>
                )}

                <p className="font-body text-[12px] text-brand-textMuted/40 text-center leading-relaxed">
                  Al registrarte aceptas nuestros{' '}
                  <a href="/terminos" className="text-brand-primary/60 hover:text-brand-primary transition-colors">Términos de Uso</a>
                  {' '}y{' '}
                  <a href="/privacidad" className="text-brand-primary/60 hover:text-brand-primary transition-colors">Política de Privacidad</a>.
                </p>
              </div>
            ) : (
              
              /* SCENE B: LOGGED IN - LUXURY CRM PROFILE DETAILS */
              <div className="space-y-8 text-left py-2">
                
                {/* Welcome Card Banner */}
                <div className="space-y-1 border-b border-white/5 pb-4">
                  <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase block font-semibold">Buen día,</span>
                  <h4 className="font-display text-3xl text-brand-textMain font-light uppercase tracking-wide">
                    {userSession.name}
                  </h4>
                  <span className="font-body text-[11px] tracking-[0.25em] text-brand-textMuted/60 uppercase font-semibold block pt-1">
                    Miembro del Club desde 2026
                  </span>
                </div>

                {/* Micro Stats panel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-surface/40 border border-white/5 p-4 rounded-[2px] space-y-1 shadow">
                    <span className="text-[12px] font-body tracking-wider text-brand-textMuted uppercase block">Nivel Lealtad</span>
                    <div className="flex items-center space-x-1.5 pt-0.5">
                      <StarIcon size={12} className="text-brand-primary" />
                      <span className="font-display text-base text-brand-textMain uppercase">{userSession.level}</span>
                    </div>
                  </div>
                  <div className="bg-brand-surface/40 border border-white/5 p-4 rounded-[2px] space-y-1 shadow">
                    <span className="text-[12px] font-body tracking-wider text-brand-textMuted uppercase block">Saldo Wallet</span>
                    <span className="font-display text-base text-brand-primary font-medium block pt-0.5">${userSession.walletBalance.toFixed(2)}</span>
                  </div>
                </div>

                {/* Canje de Puntos */}
                <div className="space-y-3 pt-2">
                  <h5 className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2">
                    PANNA Rewards — Canje
                  </h5>

                  {/* Barra de progreso de puntos */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[12px] font-body tracking-wider uppercase">
                      <span className="text-brand-textMuted">{userSession.points} pts</span>
                      <span className="text-brand-textMuted/50">
                        {userSession.points < 500
                          ? `Faltan ${500 - userSession.points} para canjear`
                          : `${Math.floor(userSession.points / 500) * 5} USD disponibles`}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (userSession.points / 1500) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[12px] font-body text-brand-textMuted/40 uppercase tracking-wider">
                      <span>Seed</span><span>Sprout 500</span><span>Forest 1500</span>
                    </div>
                  </div>

                  {/* Opciones de canje */}
                  {userSession.points >= 500 ? (
                    <div className="space-y-2">
                      <p className="font-body text-[12px] text-brand-textMuted font-light">
                        Canjea en bloques de 500 pts — cada bloque = <strong className="text-brand-primary">$5.00</strong> en wallet.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[500, 1000, 1500].filter(n => n <= userSession.points).map(bloque => (
                          <button
                            key={bloque}
                            disabled={canjeando}
                            onClick={async () => {
                              setCanjeando(true)
                              setCanjeMensaje(null)
                              const res = await canjearPuntos(bloque)
                              if (res?.error) {
                                setCanjeMensaje({ tipo: 'error', texto: res.error })
                              } else {
                                setCanjeMensaje({ tipo: 'ok', texto: `+$${res.credito.toFixed(2)} acreditados en tu wallet` })
                              }
                              setCanjeando(false)
                              setTimeout(() => setCanjeMensaje(null), 4000)
                            }}
                            className="px-3 py-1.5 border border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary/10 text-brand-primary font-body text-[11px] tracking-[0.15em] uppercase font-semibold rounded-full transition-all duration-300 disabled:opacity-40"
                          >
                            {bloque} pts → ${(bloque / 100).toFixed(0)}
                          </button>
                        ))}
                      </div>
                      {canjeMensaje && (
                        <p className={`text-[12px] font-body tracking-wider pt-1 ${canjeMensaje.tipo === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                          {canjeMensaje.tipo === 'ok' ? '✓' : '✗'} {canjeMensaje.texto}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-body text-[12px] text-brand-textMuted/50 font-light">
                      Acumula 500 puntos para tu primer canje. Reserva, compra o deja una reseña.
                    </p>
                  )}
                </div>

                {/* Upcoming Table Reservations */}
                <div className="space-y-4 pt-2">
                  <h5 className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2">
                    Mis Reservas de Mesa
                  </h5>

                  <div className="space-y-3">
                    {(!userSession.reservations || userSession.reservations.length === 0) ? (
                      <div className="bg-brand-surface/20 border border-white/[0.02] p-4 rounded-[2px] text-center">
                        <span className="font-body text-[12px] text-brand-textMuted/60 leading-relaxed font-light">
                          No tienes reservas de mesa programadas en este momento.
                        </span>
                      </div>
                    ) : (
                      userSession.reservations.map((res, i) => (
                        <div key={i} className="bg-brand-surface/30 border border-white/[0.03] p-4 rounded-[2px] space-y-3 relative overflow-hidden group">
                          <div className="absolute inset-0 border border-brand-primary/0 group-hover:border-brand-primary/10 transition-all duration-500 rounded-[2px] pointer-events-none" />

                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5 text-left">
                              <span className="font-body text-[12px] text-brand-textMain font-bold uppercase tracking-wider">{res.id}</span>
                              <div className="flex items-center space-x-1.5 text-brand-textMuted/60 pt-1">
                                <TicketIcon size={10} className="text-brand-primary/80" />
                                <span className="font-body text-[12px]">{res.date} a las {res.time}</span>
                              </div>
                            </div>
                            
                            <span className="text-[12px] font-body tracking-widest uppercase px-2.5 py-1 rounded-full font-bold border border-brand-primary/45 text-brand-primary bg-brand-primary/5">
                              {res.status}
                            </span>
                          </div>

                          <div className="text-[12px] font-body text-brand-textMuted font-light leading-relaxed text-left space-y-1">
                            <div>Comensales: <strong>{res.guests} {Number(res.guests) === 1 ? 'persona' : 'personas'}</strong></div>
                            {res.notes && (
                              <div className="text-[12px] italic text-brand-textMuted/70 border-l border-brand-primary/20 pl-2 mt-1">
                                "{res.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Purchase Order History */}
                <div className="space-y-4 pt-2">
                  <h5 className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2">
                    Historial de Pedidos Recientes
                  </h5>

                  <div className="space-y-3">
                    {userSession.orderHistory?.map((ord, i) => (
                      <div key={i} className="bg-brand-surface/30 border border-white/[0.03] p-4 rounded-[2px] space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="font-body text-[12px] text-brand-textMain font-bold">{ord.id}</span>
                            <span className="font-body text-[12px] text-brand-textMuted/60 block">{ord.date}</span>
                          </div>
                          
                          {/* Live Status Badge */}
                          <span className={`text-[12px] font-body tracking-widest uppercase px-2.5 py-1 rounded-full font-bold border ${
                            ord.status === 'En Preparación'
                              ? 'border-brand-primary/40 text-brand-primary bg-brand-primary/5 animate-pulse'
                              : 'border-white/10 text-brand-textMuted'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Items listed */}
                        <div className="text-[12px] font-body text-brand-textMuted font-light leading-relaxed">
                          {ord.items.map((it, idx) => (
                            <div key={idx}>&bull; {it.title} (x{ord.items.length})</div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-[12px] font-body pt-2 border-t border-white/5 uppercase">
                          <span>Total Gastado</span>
                          <span className="text-brand-textMain font-bold">${ord.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Favorites Re-order list */}
                <div className="space-y-4 pt-2">
                  <h5 className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2">
                    Favoritos de Alejandro (Recompra Rápida)
                  </h5>

                  <div className="grid grid-cols-1 gap-3">
                    {userSession.favorites?.map((fav) => (
                      <div key={fav.id} className="flex justify-between items-center bg-brand-surface/40 p-3 rounded-[2px] border border-white/[0.02]">
                        <div className="text-left">
                          <span className="font-display text-sm text-brand-textMain block font-light">{fav.title}</span>
                          <span className="font-body text-[12px] text-brand-primary font-semibold tracking-wider block">${fav.price.toFixed(2)}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            const item = {
                              id: fav.id,
                              title: fav.title,
                              price: fav.price,
                              image: fav.id === 'p1' ? '/src/assets/coffee_pour.webp' : '/src/assets/pan.webp',
                            };
                            addItem(item);
                            showCartToast({ title: item.title, price: item.price, image: item.image });
                          }}
                          className="px-3.5 py-1.5 border border-brand-primary/45 text-brand-primary hover:bg-brand-primary hover:text-black font-body text-[11px] tracking-wider uppercase font-bold rounded-full transition-all duration-300"
                        >
                          Volver a Pedir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Bottom: número de socio + logout */}
          {userSession?.loggedIn && (
            <div className="p-6 md:p-8 border-t border-white/5 bg-brand-surface space-y-3">
              {userSession.numeroSocio && (
                <p className="font-body text-[11px] tracking-[0.2em] text-brand-textMuted/40 uppercase text-center">
                  {userSession.numeroSocio}
                </p>
              )}
              <button
                onClick={logout}
                className="w-full py-3.5 border border-white/10 hover:border-red-400/40 text-brand-textMuted hover:text-red-400 font-body tracking-[0.25em] text-[11px] uppercase font-bold transition-all duration-500 rounded-full"
              >
                Cerrar Sesión
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
