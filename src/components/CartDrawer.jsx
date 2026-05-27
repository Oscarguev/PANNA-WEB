import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, TagIcon, SparklesIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import { useCartStore, selectCartSubtotal } from '../stores/useCartStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useUIStore } from '../stores/useUIStore';
import { supabase } from '../lib/supabase';

export default function CartDrawer() {
  const cartItems      = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem     = useCartStore((state) => state.removeItem);
  const clearCart      = useCartStore((state) => state.clearCart);
  const subtotal       = useCartStore(selectCartSubtotal);

  const userSession    = useSessionStore((state) => state);
  const checkoutSuccess = useSessionStore((state) => state.checkoutSuccess);
  const spendWallet    = useSessionStore((state) => state.spendWallet);

  const isOpen  = useUIStore((state) => state.cartOpen);
  const onClose = useUIStore((state) => state.closeCart);

  const [deliveryMode, setDeliveryMode] = useState('pickup');
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [deliveryInfo, setDeliveryInfo] = useState({ address: '', phone: '', time: '' });
  const [nombre, setNombre] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [formError, setFormError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

  // Alianza estratégica
  const [codigoAlianza, setCodigoAlianza]   = useState('');
  const [alianzaInfo, setAlianzaInfo]       = useState(null); // { alianza_nombre, descuento_porcentaje, miembro_nombre }
  const [alianzaError, setAlianzaError]     = useState(null);
  const [validandoAlianza, setValidandoAlianza] = useState(false);

  const tax = subtotal * 0.13;
  const shipping = deliveryMode === 'delivery' && subtotal > 0 ? 3.50 : 0.00;
  const preDiscountTotal = subtotal + tax + shipping;
  const walletBalance    = userSession?.walletBalance ?? 0;
  const walletDiscount   = useWallet ? Math.min(walletBalance, preDiscountTotal) : 0;
  const alianzaDescuento = alianzaInfo
    ? parseFloat(((preDiscountTotal - walletDiscount) * alianzaInfo.descuento_porcentaje / 100).toFixed(2))
    : 0;
  const total = Math.max(0, preDiscountTotal - walletDiscount - alianzaDescuento);

  const validarCodigoAlianza = async () => {
    if (!codigoAlianza.trim()) return;
    setValidandoAlianza(true);
    setAlianzaError(null);
    setAlianzaInfo(null);

    const { data, error } = await supabase.rpc('validar_codigo_alianza', {
      p_codigo: codigoAlianza.trim().toUpperCase(),
    });

    setValidandoAlianza(false);

    if (error || !data) {
      setAlianzaError('Error al validar el código. Intente de nuevo.');
      return;
    }
    if (!data.valido) {
      setAlianzaError(data.error || 'Código no válido.');
      return;
    }
    setAlianzaInfo(data);
  };

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('checkout');
    track(EVENTS.CHECKOUT_START, {
      item_count: cartItems.length,
      subtotal:   subtotal,
      mode:       deliveryMode,
    });
  };

  const handleCheckoutSubmit = async (e) => {
    e?.preventDefault();
    setFormError('');

    if (!nombre.trim()) {
      setFormError('Por favor ingrese un nombre para el pedido.');
      return;
    }
    if (deliveryMode === 'delivery' && (!deliveryInfo.address || !deliveryInfo.phone)) {
      setFormError('Por favor complete la dirección y teléfono de envío.');
      return;
    }

    setIsProcessing(true);

    const mesa = deliveryMode === 'delivery'
      ? `Domicilio — ${deliveryInfo.address}`
      : deliveryMode === 'preorder' ? 'Pre-orden Web' : 'Para Llevar';

    const { data: ordenData, error: ordenError } = await supabase
      .from('ordenes')
      .insert({
        mesa,
        estado:       'pendiente',
        estado_pago:  'pendiente',
        items:        cartItems.map((i) => ({ id: i.id, nombre: i.title, precio: i.price, cantidad: i.quantity })),
        subtotal,
        total,
        tipo:         deliveryMode === 'delivery' ? 'domicilio' : deliveryMode === 'preorder' ? 'preorden' : 'para_llevar',
        es_para_llevar: deliveryMode !== 'preorder',
        estado_cocina: 'pendiente',
        estado_barra:  'pendiente',
        metodo_pago:   paymentMethod,
        mesero:        nombre,
        sucursal_id:   import.meta.env.VITE_SUCURSAL_ID,
      })
      .select('id')
      .single();

    await Promise.allSettled(
      cartItems.map((item) =>
        supabase.rpc('decrementar_stock_market', { p_producto_id: item.id, p_cantidad: item.quantity })
      )
    );
    if (walletDiscount > 0) await spendWallet(walletDiscount);

    setIsProcessing(false);

    if (ordenError) {
      setFormError('No pudimos procesar tu pedido. Por favor intenta de nuevo o llámanos al 2451-1000.');
      return;
    }

    const pointsEarned = Math.round(total * 10);
    setOrderId(ordenData?.id ? ordenData.id.slice(-8).toUpperCase() : 'PP-WEB');
    setCheckoutStep('success');
    checkoutSuccess({ items: [...cartItems], total, deliveryMode, deliveryInfo: { ...deliveryInfo }, pointsEarned });
    clearCart();
    track(EVENTS.CHECKOUT_COMPLETE, {
      total,
      item_count:    cartItems.length,
      mode:          deliveryMode,
      points_earned: pointsEarned,
      member:        userSession.loggedIn,
    });
  };

  const handleCloseSuccess = () => {
    setCheckoutStep('cart');
    setNombre('');
    setPaymentMethod('efectivo');
    setFormError('');
    setOrderId(null);
    setDeliveryInfo({ address: '', phone: '', time: '' });
    setUseWallet(false);
    setCodigoAlianza('');
    setAlianzaInfo(null);
    setAlianzaError(null);
    onClose();
  };

  return (
    <>
      {/* Background shadow overlay */}
      <div
        className={`fixed inset-0 bg-black/85 backdrop-blur-sm z-50 transition-opacity duration-700 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={checkoutStep === 'success' ? handleCloseSuccess : onClose}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[460px] z-50 bg-[#0c0c0c] border-l border-white/[0.04] shadow-2xl transition-transform duration-[800ms] ease-high-end transform flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Subtle interior gold border contour */}
        <div className="absolute top-4 bottom-4 left-4 right-4 border border-brand-primary/5 pointer-events-none rounded-[1px] z-0" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Header Block */}
          <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold">
                {checkoutStep === 'cart' ? 'Tu Selección' : checkoutStep === 'checkout' ? 'Pasarela Premium' : 'Confirmación'}
              </span>
              <h3 className="font-display text-2xl text-brand-textMain font-light uppercase tracking-wide">
                {checkoutStep === 'cart' ? 'Bolsa Gastronómica' : checkoutStep === 'checkout' ? 'Pago de Experiencia' : 'Pedido Completado'}
              </h3>
            </div>
            
            {/* Close Button */}
            {checkoutStep !== 'success' && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-brand-primary flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-all duration-300 bg-brand-surface/40"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* STEP 1: SHOPPING CART LISTING */}
          {checkoutStep === 'cart' && (
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="py-24 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border border-white/5 mx-auto flex items-center justify-center text-brand-textMuted/40">
                    &empty;
                  </div>
                  <p className="font-body text-xs text-brand-textMuted font-light">
                    Tu bolsa está vacía. Explora nuestro menú o tienda de café.
                  </p>
                </div>
              ) : (
                <>
                  {/* Delivery Mode Toggle */}
                  <div className="bg-brand-surface/50 border border-white/5 p-1 rounded-full grid grid-cols-3 text-center">
                    {['pickup', 'delivery', 'preorder'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                        setDeliveryMode(mode);
                        if (mode === 'preorder') track(EVENTS.PREORDER_SELECT);
                      }}
                        className={`py-2 rounded-full font-body text-[10px] tracking-wider uppercase font-bold transition-all duration-500 ${
                          deliveryMode === mode
                            ? 'bg-brand-primary text-black'
                            : 'text-brand-textMuted hover:text-brand-textMain'
                        }`}
                      >
                        {mode === 'pickup' ? 'Recoger' : mode === 'delivery' ? 'Domicilio' : 'Preordenar'}
                      </button>
                    ))}
                  </div>

                  {/* Cart Items Scroll */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-white/[0.03] pb-4 group"
                      >
                        <div className="flex items-center space-x-4 text-left">
                          {/* Mini Image */}
                          <div className="w-14 h-14 rounded-[2px] overflow-hidden border border-white/5 bg-neutral-950 flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          
                          {/* Title and details */}
                          <div className="space-y-1">
                            <h4 className="font-display text-sm text-brand-textMain font-light">
                              {item.title}
                            </h4>
                            <span className="font-body text-[12px] text-brand-primary tracking-wider uppercase block">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-white/10 rounded-full bg-brand-surface/40 px-2 py-1">
                            <button
                              onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                              className="text-brand-textMuted hover:text-brand-primary px-1.5 text-xs focus:outline-none"
                            >
                              -
                            </button>
                            <span className="font-body text-[12px] text-brand-textMain px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-brand-textMuted hover:text-brand-primary px-1.5 text-xs focus:outline-none"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => {
                            track(EVENTS.REMOVE_FROM_CART, { item_id: item.id, item_name: item.title, price: item.price });
                            removeItem(item.id);
                          }}
                            className="text-brand-textMuted/40 hover:text-brand-primary transition-colors text-[11px] uppercase font-body"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: PREMIUM CHECKOUT PAYMENTS FORM */}
          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="flex-grow overflow-y-auto px-6 py-6 space-y-6 text-left relative z-10 scrollbar-thin">
              
              {/* Delivery / Pickup conditional inputs */}
              {deliveryMode === 'delivery' ? (
                <div className="space-y-4">
                  <h4 className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2">
                    Detalles del Envío
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label htmlFor="address" className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted">Dirección de Domicilio *</label>
                      <input
                        type="text"
                        id="address"
                        required
                        placeholder="Calle, Residencial, Número de casa..."
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="phone" className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted">Teléfono de Contacto *</label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          placeholder="Ej: 7794-7885"
                          value={deliveryInfo.phone}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                          className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="delTime" className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted">Hora Sugerida</label>
                        <input
                          type="time"
                          id="delTime"
                          value={deliveryInfo.time}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, time: e.target.value })}
                          className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : deliveryMode === 'pickup' ? (
                <div className="bg-brand-surface/40 border border-white/[0.03] p-4 rounded-[2px] space-y-2 text-left">
                  <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold block">
                    Información de Recogida
                  </span>
                  <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light">
                    Tu pedido estará listo en barra en un aproximado de 20 a 30 minutos. Por favor presenta tu nombre al barista.
                  </p>
                </div>
              ) : (
                <div className="bg-brand-surface/40 border border-white/[0.03] p-4 rounded-[2px] space-y-3 text-left">
                  <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold block">
                    Información de Preorden
                  </span>
                  <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light">
                    Tu preorden gastronómica se reservará para tu mesa en la fecha y hora seleccionada.
                  </p>

                  {userSession?.loggedIn && userSession?.reservations && userSession.reservations.length > 0 ? (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <label htmlFor="preorderRes" className="font-body text-[11px] tracking-wider uppercase text-brand-primary block font-bold">
                        Vincular a tu Mesa Reservada *
                      </label>
                      <select
                        id="preorderRes"
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-full font-body text-[12px] px-3.5 py-2.5 focus:outline-none focus:border-brand-primary text-brand-textMain font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        {userSession.reservations.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.id} &mdash; {res.date} a las {res.time} ({res.guests} comensales)
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <p className="font-body text-[12px] text-brand-primary uppercase tracking-wider font-semibold leading-relaxed">
                        ⚠️ No tienes una mesa reservada activa en tu cuenta.
                      </p>
                      <Link
                        to="/reservar"
                        onClick={onClose}
                        className="inline-block font-body text-[11px] tracking-widest text-brand-textMain hover:text-brand-primary uppercase font-bold border-b border-brand-primary pb-0.5"
                      >
                        Reservar una Mesa ahora &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Nombre + Método de pago */}
              <div className="space-y-5 pt-2">
                <div className="space-y-1">
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2 block">
                    Nombre para el Pedido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Alejandro Valenzuela"
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value); setFormError(''); }}
                    className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary border-b border-white/5 pb-2 block">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'efectivo', label: 'Efectivo' },
                      { id: 'tarjeta',  label: 'Tarjeta' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={`py-3 rounded-[2px] border text-[11px] font-body tracking-widest uppercase font-bold transition-all duration-300 ${
                          paymentMethod === id
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-white/10 text-brand-textMuted hover:border-brand-primary/40'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="font-body text-[11px] text-brand-textMuted/50 tracking-wider font-light">
                    Pago al recoger en caja o al recibir el domicilio.
                  </p>
                </div>
              </div>

              {/* Award Loyalty notification if logged in */}
              {userSession?.loggedIn && (
                <div className="flex items-center space-x-3 p-3.5 bg-brand-primary/10 border border-brand-primary/20 rounded-[2px]">
                  <TagIcon size={16} className="text-brand-primary" />
                  <span className="font-body text-[12px] text-brand-primary tracking-wider uppercase font-semibold leading-relaxed">
                    PANNA Rewards: Acumularás aproximadamente +{Math.round(total * 10)} puntos con este pedido.
                  </span>
                </div>
              )}

              {formError && (
                <p className="font-body text-[12px] text-red-400 tracking-wider text-center border border-red-400/20 bg-red-400/5 rounded-[2px] p-3">
                  {formError}
                </p>
              )}

              {/* Back to cart */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="font-body text-[11px] tracking-widest uppercase text-brand-textMuted hover:text-brand-textMain"
                >
                  &larr; Volver a la Bolsa de Compras
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION END OF PAYMENT */}
          {checkoutStep === 'success' && (
            <div className="flex-grow flex flex-col justify-center items-center p-8 space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-brand-primary/45 flex items-center justify-center bg-brand-primary/10">
                <SparklesIcon size={24} className="text-brand-primary animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold">
                  Pedido Confirmado
                </span>
                <h3 className="font-display text-2xl text-brand-textMain font-light uppercase tracking-wide">
                  ¡Gracias, {nombre}!
                </h3>
              </div>

              <div className="w-16 h-[1.5px] bg-brand-primary/30 mx-auto" />

              <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light max-w-sm">
                Tu pedido ha sido registrado. Preséntate en caja con tu código o indícalo al barista. Pago: <strong className="text-brand-primary capitalize">{paymentMethod}</strong> al recoger. Tu código de pedido es: <strong className="text-brand-primary tracking-widest block py-2 text-sm">PP-{orderId}</strong>
              </p>
              
              {userSession?.loggedIn && (
                <div className="bg-brand-surface border border-white/[0.04] p-4 rounded-[2px] max-w-xs space-y-2">
                  <span className="font-body text-[11px] tracking-wider text-brand-primary font-semibold uppercase block">Resumen de Cuenta</span>
                  <p className="font-body text-[12px] text-brand-textMain font-light">
                    Se han acreditado <strong>+{Math.round(total * 10)} puntos</strong> en tu cuenta de PANNA Rewards.
                  </p>
                  {walletDiscount > 0 && (
                    <p className="font-body text-[12px] text-brand-primary font-light">
                      Crédito PANNA Wallet: <strong>-${walletDiscount.toFixed(2)}</strong>
                    </p>
                  )}
                  {alianzaDescuento > 0 && (
                    <p className="font-body text-[12px] text-brand-primary font-light">
                      Descuento {alianzaInfo?.alianza_nombre}: <strong>-${alianzaDescuento.toFixed(2)}</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="pt-6 w-full">
                <button
                  onClick={handleCloseSuccess}
                  className="w-full py-4 bg-brand-primary text-black font-body tracking-[0.2em] text-xs uppercase font-bold transition-all duration-500 rounded-full"
                >
                  Entendido & Finalizar
                </button>
              </div>
            </div>
          )}

          {/* Bottom Billing Block */}
          {checkoutStep !== 'success' && (
            <div className="p-6 md:p-8 bg-brand-surface border-t border-white/5 space-y-6">

              {/* Código de carnet alianza */}
              {alianzaInfo ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-[2px] border border-brand-primary/50 bg-brand-primary/10">
                  <div className="space-y-0.5">
                    <span className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary block">
                      Alianza: {alianzaInfo.alianza_nombre}
                    </span>
                    <span className="font-body text-[12px] text-brand-textMuted">
                      {alianzaInfo.miembro_nombre} &bull; <strong className="text-brand-primary">-{alianzaInfo.descuento_porcentaje}%</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => { setAlianzaInfo(null); setCodigoAlianza(''); }}
                    className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted hover:text-red-400 transition-colors"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMuted block">
                    Código de carnet empresarial
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codigoAlianza}
                      onChange={(e) => {
                        setCodigoAlianza(e.target.value.toUpperCase());
                        setAlianzaError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && validarCodigoAlianza()}
                      placeholder="Ej: BCIE-00145"
                      className="flex-1 bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-1.5 px-1 focus:outline-none transition-colors font-light placeholder-white/20 tracking-widest"
                    />
                    <button
                      onClick={validarCodigoAlianza}
                      disabled={validandoAlianza || !codigoAlianza.trim()}
                      className="px-3 py-1 bg-brand-surface border border-white/10 hover:border-brand-primary/50 text-brand-textMuted hover:text-brand-primary font-body text-[11px] tracking-wider uppercase transition-all duration-300 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {validandoAlianza ? '...' : 'Validar'}
                    </button>
                  </div>
                  {alianzaError && (
                    <p className="font-body text-[12px] text-red-400 tracking-wider">{alianzaError}</p>
                  )}
                </div>
              )}

              {/* Wallet toggle — only if logged in and has balance */}
              {userSession?.loggedIn && walletBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setUseWallet((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-[2px] border transition-all duration-300 text-left ${
                    useWallet
                      ? 'border-brand-primary/50 bg-brand-primary/10'
                      : 'border-white/[0.06] bg-brand-surface/40 hover:border-brand-primary/30'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary block">
                      Crédito PANNA Wallet
                    </span>
                    <span className="font-body text-[12px] text-brand-textMuted">
                      Disponible: <strong className="text-brand-textMain">${walletBalance.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className={`w-9 h-5 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                    useWallet ? 'bg-brand-primary justify-end' : 'bg-white/10 justify-start'
                  }`}>
                    <div className="w-4 h-4 rounded-full bg-black/80" />
                  </div>
                </button>
              )}

              {/* Calculations */}
              <div className="space-y-2 font-body text-[12px] text-brand-textMuted uppercase tracking-wider font-light">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="text-brand-textMain font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Impuestos (13% IVA)</span>
                  <span className="text-brand-textMain font-medium">${tax.toFixed(2)}</span>
                </div>
                {deliveryMode === 'delivery' && (
                  <div className="flex items-center justify-between">
                    <span>Costo de Envío</span>
                    <span className="text-brand-textMain font-medium">${shipping.toFixed(2)}</span>
                  </div>
                )}
                {walletDiscount > 0 && (
                  <div className="flex items-center justify-between text-brand-primary">
                    <span>Crédito Wallet Aplicado</span>
                    <span className="font-medium">-${walletDiscount.toFixed(2)}</span>
                  </div>
                )}
                {alianzaDescuento > 0 && (
                  <div className="flex items-center justify-between text-brand-primary">
                    <span>Descuento {alianzaInfo?.alianza_nombre} ({alianzaInfo?.descuento_porcentaje}%)</span>
                    <span className="font-medium">-${alianzaDescuento.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-[1px] bg-white/5 my-2" />
                <div className="flex items-center justify-between text-xs text-brand-textMain font-medium">
                  <span>Total Neto</span>
                  <span className="text-brand-primary italic text-lg font-light">${total.toFixed(2)}</span>
                </div>
              </div>

              {formError && checkoutStep === 'checkout' && (
                <p className="font-body text-[12px] text-red-400 tracking-wider text-center border border-red-400/20 bg-red-400/5 rounded-[2px] p-3">
                  {formError}
                </p>
              )}

              {/* Action Button */}
              {checkoutStep === 'cart' ? (
                <button
                  onClick={handleStartCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full py-4 bg-brand-primary text-black font-body tracking-[0.2em] text-xs uppercase font-bold transition-all duration-500 rounded-full ${
                    cartItems.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#ab8b5f] shadow-lg hover:shadow-brand-primary/10'
                  }`}
                >
                  Proceder al Pago
                </button>
              ) : (
                <button
                  onClick={handleCheckoutSubmit}
                  disabled={isProcessing}
                  className={`w-full py-4 bg-brand-primary text-black font-body tracking-[0.2em] text-xs uppercase font-bold transition-all duration-500 rounded-full flex items-center justify-center space-x-2 ${
                    isProcessing ? 'opacity-70 cursor-wait' : 'hover:bg-[#ab8b5f]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span>Procesando Pago Seguro...</span>
                    </>
                  ) : (
                    <span>
                    {total === 0 ? 'Confirmar Pedido (Saldo Cubierto)' : `Pagar $${total.toFixed(2)}`}
                  </span>
                  )}
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
}
