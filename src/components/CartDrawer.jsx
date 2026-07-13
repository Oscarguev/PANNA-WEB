import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon, TagIcon, SparklesIcon, AlertTriangleIcon, TrashIcon } from './Icons';
import { track, EVENTS } from '../analytics';
import { useCartStore, selectCartSubtotal } from '../stores/useCartStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useUIStore } from '../stores/useUIStore';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { supabase } from '../lib/supabase';

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
  const [removingItemId, setRemovingItemId] = useState(null);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  const [codigoAlianza, setCodigoAlianza]   = useState('');
  const [alianzaInfo, setAlianzaInfo]       = useState(null);
  const [alianzaError, setAlianzaError]     = useState(null);
  const [validandoAlianza, setValidandoAlianza] = useState(false);

  const drawerRef = useRef(null);
  useFocusTrap(isOpen, onClose, drawerRef);

  // Precios ya incluyen IVA (13%). No se cobra impuesto adicional.
  const shipping = deliveryMode === 'delivery' && subtotal > 0 ? 3.50 : 0.00;
  const preDiscountTotal = subtotal + shipping;
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
        user_email:    userSession?.email || null,
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
    setPendingRemoveId(null);
    onClose();
  };

  const confirmRemove = (id) => {
    const item = cartItems.find(i => i.id === id);
    track(EVENTS.REMOVE_FROM_CART, { item_id: id, item_name: item?.title, price: item?.price });
    setRemovingItemId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingItemId(null);
      setPendingRemoveId(null);
    }, 200);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-base ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={checkoutStep === 'success' ? handleCloseSuccess : onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className={`fixed right-0 top-0 h-full w-full sm:w-[460px] z-50 bg-white border-l border-brand-border shadow-sm transition-transform duration-base ease-out transform flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative z-10 flex flex-col h-full justify-between">

          <div className="p-6 md:p-8 border-b border-brand-border flex items-center justify-between bg-brand-surface">
            <div className="space-y-1 text-left">
              <span className="text-[12px] text-brand-textSubtle">
                {checkoutStep === 'cart' ? 'Paso 1 de 3' : checkoutStep === 'checkout' ? 'Paso 2 de 3' : 'Paso 3 de 3'}
              </span>
              <h2 id="cart-drawer-title" className="font-display text-2xl text-brand-textMain font-light">
                {checkoutStep === 'cart' ? 'Tu selección' : checkoutStep === 'checkout' ? 'Pago del pedido' : 'Pedido completado'}
              </h2>
            </div>

            {checkoutStep !== 'success' && (
              <button
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] border border-brand-border hover:border-brand-primary flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-colors duration-base bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Cerrar bolsa"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {checkoutStep === 'cart' && (
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="py-24 text-center space-y-4">
                  <div className="w-12 h-12 border border-brand-border mx-auto flex items-center justify-center text-brand-textSubtle text-2xl" aria-hidden="true">
                    &empty;
                  </div>
                  <p className="text-[14px] text-brand-textSubtle">
                    Tu bolsa está vacía. Explora nuestro menú o tienda de café.
                  </p>
                  <Link
                    to="/menu"
                    onClick={onClose}
                    className="inline-block text-[13px] text-brand-textMain border-b border-brand-textMain pb-0.5 hover:border-brand-primary hover:text-brand-primary transition-colors duration-base min-h-[44px] leading-[44px]"
                  >
                    Explorar la carta
                  </Link>
                </div>
              ) : (
                <>
                  <div role="radiogroup" aria-label="Modalidad de entrega" className="border-y border-brand-border grid grid-cols-3 text-center">
                    {[
                      { id: 'pickup', label: 'Recoger' },
                      { id: 'delivery', label: 'Domicilio' },
                      { id: 'preorder', label: 'Preordenar' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={deliveryMode === id}
                        onClick={() => {
                          setDeliveryMode(id);
                          if (id === 'preorder') track(EVENTS.PREORDER_SELECT);
                        }}
                        className={`min-h-[44px] py-3 text-[14px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary border-r border-brand-border last:border-r-0 ${
                          deliveryMode === id
                            ? 'text-brand-textMain border-b-2 border-brand-primary -mb-px'
                            : 'text-brand-textSubtle hover:text-brand-textMain'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center justify-between border-b border-brand-border pb-4">
                        <div className="flex items-center space-x-4 text-left">
                          <div className="w-14 h-14 overflow-hidden border border-brand-border bg-brand-placeholder shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-display text-[15px] text-brand-textMain font-normal">{item.title}</h3>
                            <span className="text-[13px] text-brand-textMain tabular-nums block">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-brand-border">
                            <button
                              onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Disminuir cantidad de ${item.title}`}
                              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <span aria-live="polite" className="text-[13px] text-brand-textMain px-3 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Aumentar cantidad de ${item.title}`}
                              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-textMain hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            >
                              +
                            </button>
                          </div>

                          {pendingRemoveId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => confirmRemove(item.id)}
                                disabled={removingItemId === item.id}
                                className="text-[13px] text-white bg-brand-danger hover:bg-rose-700 px-2.5 py-2 min-h-[36px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-danger disabled:opacity-50 inline-flex items-center gap-1"
                                aria-label="Confirmar eliminación"
                              >
                                {removingItemId === item.id ? <Spinner /> : 'Quitar'}
                              </button>
                              <button
                                onClick={() => setPendingRemoveId(null)}
                                className="text-[13px] text-brand-textSubtle hover:text-brand-textMain px-2 py-2 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setPendingRemoveId(item.id)}
                              disabled={isProcessing}
                              className="text-brand-textSubtle hover:text-brand-danger transition-colors duration-base text-[13px] min-h-[44px] px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-danger disabled:opacity-40 inline-flex items-center gap-1"
                              aria-label={`Quitar ${item.title} de la bolsa`}
                            >
                              <TrashIcon size={12} aria-hidden="true" />
                              Quitar
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="flex-grow overflow-y-auto px-6 py-6 space-y-6 text-left relative z-10 scrollbar-thin">

              {deliveryMode === 'delivery' ? (
                <div className="space-y-4">
                  <h3 className="text-[14px] text-brand-textMain border-b border-brand-border pb-2">
                    Detalles del envío
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="checkout-address" className="text-[12px] text-brand-textSubtle">Dirección de domicilio *</label>
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        placeholder="Calle, residencial, número de casa…"
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        className="w-full bg-white border border-brand-border focus:border-brand-primary text-brand-textMain text-[14px] py-3 px-3 min-h-[44px] focus:outline-none transition-colors duration-base placeholder:text-brand-textMuted"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="checkout-phone" className="text-[12px] text-brand-textSubtle">Teléfono de contacto *</label>
                        <input
                          id="checkout-phone"
                          type="tel"
                          required
                          placeholder="Ej: 7794-7885"
                          value={deliveryInfo.phone}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                          className="w-full bg-white border border-brand-border focus:border-brand-primary text-brand-textMain text-[14px] py-3 px-3 min-h-[44px] focus:outline-none transition-colors duration-base placeholder:text-brand-textMuted"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="checkout-time" className="text-[12px] text-brand-textSubtle">Hora sugerida</label>
                        <input
                          id="checkout-time"
                          type="time"
                          value={deliveryInfo.time}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, time: e.target.value })}
                          className="w-full bg-white border border-brand-border focus:border-brand-primary text-brand-textMain text-[14px] py-3 px-3 min-h-[44px] focus:outline-none transition-colors duration-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : deliveryMode === 'pickup' ? (
                <div className="bg-brand-surfaceMuted border border-brand-border p-4 space-y-2 text-left">
                  <p className="text-[13px] text-brand-textSubtle">Información de recogida</p>
                  <p className="text-[14px] text-brand-textMain leading-relaxed">
                    Tu pedido estará listo en barra en un aproximado de 20 a 30 minutos. Por favor presenta tu nombre al barista.
                  </p>
                </div>
              ) : (
                <div className="bg-brand-surfaceMuted border border-brand-border p-4 space-y-3 text-left">
                  <p className="text-[13px] text-brand-textSubtle">Información de preorden</p>
                  <p className="text-[14px] text-brand-textMain leading-relaxed">
                    Tu preorden gastronómica se reservará para tu mesa en la fecha y hora seleccionada.
                  </p>

                  {userSession?.loggedIn && userSession?.reservations && userSession.reservations.length > 0 ? (
                    <div className="space-y-1.5 pt-2 border-t border-brand-border">
                      <label htmlFor="checkout-preorder-res" className="text-[12px] text-brand-textSubtle block">
                        Vincular a tu mesa reservada *
                      </label>
                      <select
                        id="checkout-preorder-res"
                        className="w-full bg-white border border-brand-border text-[14px] px-3 py-3 min-h-[44px] focus:outline-none focus:border-brand-primary text-brand-textMain cursor-pointer"
                      >
                        {userSession.reservations.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.id} — {res.date} a las {res.time} ({res.guests} comensales)
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-brand-border space-y-2">
                      <p className="text-[13px] text-brand-accent leading-relaxed">
                        No tienes una mesa reservada activa en tu cuenta.
                      </p>
                      <Link
                        to="/reservar"
                        onClick={onClose}
                        className="inline-block min-h-[44px] leading-[44px] text-[13px] text-brand-accent border-b border-brand-accent pb-0.5 hover:text-brand-primary hover:border-brand-primary"
                      >
                        Reservar una mesa ahora
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-5 pt-2">
                <div className="space-y-1">
                  <label htmlFor="checkout-name" className="text-[14px] text-brand-textMain border-b border-brand-border pb-2 block">
                    Nombre para el pedido *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    placeholder="Ej: Alejandro Valenzuela"
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value); setFormError(''); }}
                    className="w-full bg-white border border-brand-border focus:border-brand-primary text-brand-textMain text-[14px] py-3 px-3 min-h-[44px] focus:outline-none transition-colors duration-base placeholder:text-brand-textMuted"
                  />
                </div>

                <fieldset className="space-y-3 border-0 p-0 m-0">
                  <legend className="text-[14px] text-brand-textMain border-b border-brand-border pb-2 w-full">
                    Método de pago
                  </legend>
                  <div className="grid grid-cols-2 gap-3 pt-1" role="radiogroup">
                    {[
                      { id: 'efectivo', label: 'Efectivo' },
                      { id: 'tarjeta',  label: 'Tarjeta' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={paymentMethod === id}
                        onClick={() => setPaymentMethod(id)}
                        className={`min-h-[44px] py-3 border text-[14px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                          paymentMethod === id
                            ? 'border-brand-primary text-brand-textMain'
                            : 'border-brand-border text-brand-textMain hover:border-brand-primary/60'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[13px] text-brand-textSubtle">
                    Pago al recoger en caja o al recibir el domicilio.
                  </p>
                </fieldset>
              </div>

              {userSession?.loggedIn && (
                <div className="flex items-center space-x-3 p-3.5 border-l-2 border-brand-primary bg-brand-surfaceMuted">
                  <TagIcon size={16} className="text-brand-primary shrink-0" aria-hidden="true" />
                  <span className="text-[13px] text-brand-textMain leading-relaxed">
                    PANNA Rewards: acumularás aproximadamente +{Math.round(total * 10)} puntos con este pedido.
                  </span>
                </div>
              )}

              <ErrorBox id="checkout-error" message={formError} />

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="min-h-[44px] px-4 text-[13px] text-brand-textSubtle hover:text-brand-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  ← Volver a la bolsa
                </button>
              </div>

            </form>
          )}

          {checkoutStep === 'success' && (
            <div className="flex-grow flex flex-col justify-center items-center p-8 space-y-6 text-center">
              <div className="w-16 h-16 border border-brand-success/60 flex items-center justify-center bg-brand-success/10" aria-hidden="true">
                <SparklesIcon size={24} className="text-brand-success" />
              </div>

              <div className="space-y-2">
                <span className="text-[13px] text-brand-textSubtle">
                  Pedido confirmado
                </span>
                <h2 className="font-display text-2xl text-brand-textMain font-light">
                  Gracias, {nombre}.
                </h2>
              </div>

              <p className="text-[14px] text-brand-textMain leading-relaxed max-w-sm">
                Tu pedido ha sido registrado. Preséntate en caja con tu código o indícalo al barista. Pago: <strong className="text-brand-accent capitalize">{paymentMethod}</strong> al recoger. Tu código de pedido es:
              </p>

              <p className="font-display text-xl text-brand-accent tabular-nums">
                PP-{orderId}
              </p>

              {userSession?.loggedIn && (
                <div className="bg-brand-surface border border-brand-border p-4 max-w-xs space-y-2 text-left">
                  <span className="text-[13px] text-brand-textSubtle block">Resumen de cuenta</span>
                  <p className="text-[13px] text-brand-textMain">
                    Se han acreditado <strong className="text-brand-accent">+{Math.round(total * 10)} puntos</strong> en tu cuenta de PANNA Rewards.
                  </p>
                  {walletDiscount > 0 && (
                    <p className="text-[13px] text-brand-textMain">
                      Crédito PANNA Wallet: <strong>-${walletDiscount.toFixed(2)}</strong>
                    </p>
                  )}
                  {alianzaDescuento > 0 && (
                    <p className="text-[13px] text-brand-textMain">
                      Descuento {alianzaInfo?.alianza_nombre}: <strong>-${alianzaDescuento.toFixed(2)}</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="pt-6 w-full">
                <button
                  onClick={handleCloseSuccess}
                  className="w-full min-h-[48px] py-3 bg-brand-cta text-white text-[14px] transition-colors duration-base hover:bg-brand-ctaHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {checkoutStep !== 'success' && (
            <div className="p-6 md:p-8 bg-brand-surface border-t border-brand-border space-y-6">

              {alianzaInfo ? (
                <div className="flex items-center justify-between px-4 py-3 border border-brand-primary/50 bg-brand-primary/10">
                  <div className="space-y-0.5">
                    <span className="text-[13px] text-brand-accent block">
                      Alianza: {alianzaInfo.alianza_nombre}
                    </span>
                    <span className="text-[13px] text-brand-textMain">
                      {alianzaInfo.miembro_nombre} — <strong className="text-brand-accent">-{alianzaInfo.descuento_porcentaje}%</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => { setAlianzaInfo(null); setCodigoAlianza(''); }}
                    className="min-h-[44px] text-[13px] text-brand-textSubtle hover:text-brand-danger transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-danger px-2"
                    aria-label="Quitar código de alianza aplicado"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="checkout-alianza" className="text-[13px] text-brand-textMain block">
                    Código de carnet empresarial
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="checkout-alianza"
                      type="text"
                      value={codigoAlianza}
                      onChange={(e) => {
                        setCodigoAlianza(e.target.value.toUpperCase());
                        setAlianzaError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && validarCodigoAlianza()}
                      placeholder="Ej: BCIE-00145"
                      className="flex-1 bg-white border border-brand-border focus:border-brand-primary text-brand-textMain text-[14px] py-3 px-3 min-h-[44px] focus:outline-none transition-colors duration-base placeholder:text-brand-textMuted"
                    />
                    <button
                      onClick={validarCodigoAlianza}
                      disabled={validandoAlianza || !codigoAlianza.trim()}
                      className="min-h-[44px] px-4 bg-white border border-brand-border hover:border-brand-primary text-brand-textMain hover:text-brand-primary text-[13px] transition-colors duration-base disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      {validandoAlianza ? <><Spinner /> Validando</> : 'Validar'}
                    </button>
                  </div>
                  <ErrorBox id="alianza-error" message={alianzaError} />
                </div>
              )}

              {userSession?.loggedIn && walletBalance > 0 && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={useWallet}
                  onClick={() => setUseWallet((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 border transition-colors duration-base text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                    useWallet
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-brand-border bg-brand-surfaceMuted hover:border-brand-primary/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[13px] text-brand-accent block">
                      Crédito PANNA Wallet
                    </span>
                    <span className="text-[13px] text-brand-textMain">
                      Disponible: <strong>${walletBalance.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className={`w-9 h-5 transition-colors duration-base flex items-center px-0.5 ${
                    useWallet ? 'bg-brand-primary justify-end' : 'bg-brand-placeholder justify-start'
                  }`}>
                    <span className="sr-only">{useWallet ? 'Activado' : 'Desactivado'}</span>
                    <div className="w-4 h-4 bg-white border border-brand-border" aria-hidden="true" />
                  </div>
                </button>
              )}

              <div className="space-y-2 text-[13px] text-brand-textMain">
                <div className="flex items-center justify-between">
                  <span className="text-brand-textSubtle">Subtotal <span className="text-[11px] text-brand-textSubtle/70">(IVA incluido)</span></span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {deliveryMode === 'delivery' && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-textSubtle">Costo de envío</span>
                    <span className="tabular-nums">${shipping.toFixed(2)}</span>
                  </div>
                )}
                {walletDiscount > 0 && (
                  <div className="flex items-center justify-between text-brand-accent">
                    <span>Crédito wallet aplicado</span>
                    <span className="tabular-nums">-${walletDiscount.toFixed(2)}</span>
                  </div>
                )}
                {alianzaDescuento > 0 && (
                  <div className="flex items-center justify-between text-brand-accent">
                    <span>Descuento {alianzaInfo?.alianza_nombre} ({alianzaInfo?.descuento_porcentaje}%)</span>
                    <span className="tabular-nums">-${alianzaDescuento.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-brand-border my-2" />
                <div className="flex items-center justify-between text-brand-textMain">
                  <span>Total <span className="text-[11px] text-brand-textSubtle/70 font-normal">(IVA incluido)</span></span>
                  <span className="font-display text-2xl text-brand-accent tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={handleStartCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full min-h-[48px] py-3 bg-brand-cta text-white text-[14px] transition-colors duration-base disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-brand-placeholder disabled:text-brand-textSubtle hover:bg-brand-ctaHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  Proceder al pago
                </button>
              ) : (
                <button
                  onClick={handleCheckoutSubmit}
                  disabled={isProcessing}
                  className="w-full min-h-[48px] py-3 bg-brand-cta text-white text-[14px] transition-colors duration-base flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-ctaHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  {isProcessing ? (
                    <><Spinner /> Procesando…</>
                  ) : (
                    <span>
                      {total === 0 ? 'Confirmar pedido (saldo cubierto)' : `Pagar $${total.toFixed(2)}`}
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