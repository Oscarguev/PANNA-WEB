import React, { useState, useEffect } from 'react';
import { TagIcon } from './Icons';
import { useCartStore } from '../stores/useCartStore';
import { useUIStore } from '../stores/useUIStore';
import { track, EVENTS } from '../analytics';
import { supabase } from '../lib/supabase';
import coffeeBourbon from '../assets/coffee_bourbon.webp';
import coffeeBags from '../assets/coffee_bags.webp';
import cinnamonRoll from '../assets/cinnamon_roll.webp';
import sourdoughToast from '../assets/sourdough_toast.webp';
import sourdoughPizza from '../assets/sourdough_pizza.webp';
import menuDish from '../assets/menu_dish.webp';
import coffeePour from '../assets/coffee_pour.webp';
import chefPlating from '../assets/chef_plating.webp';

// Fallback images por categoría cuando no hay imagen_url
const FALLBACK = {
  cafe:    coffeeBourbon,
  food:    cinnamonRoll,
  merch:   menuDish,
  general: coffeeBags,
};

// Mapeo de nombre → asset local (para productos seeded sin URL)
const SEED_IMAGES = {
  'Bourbon Naranja (Finca El Ángel)':   coffeeBourbon,
  'Heirloom (Finca La Fany)':           coffeeBags,
  'Taza Cerámica Artesanal P&P':        menuDish,
  'Tostada Dulce de Masa Madre':        sourdoughToast,
  'Cinnamon Roll (Pack Familiar)':      cinnamonRoll,
  'Pizza Pesto & Camarón (Pre-orden)':  sourdoughPizza,
};

const BREW_GUIDES = [
  {
    method: 'V60',
    ratio: '1:15 (15g Café / 225g Agua)',
    grind: 'Medio-Fino (Textura sal de mesa)',
    temp: '92°C / 198°F',
    time: '2:45 minutos',
    steps: [
      'Realiza una preinfusión con 45g de agua durante 40 segundos.',
      'Vierte lentamente en círculos concéntricos hasta llegar a 150g a los 1:20 min.',
      'Completa el vertido final hasta 225g en chorro central constante a los 2:00 min.',
      'Permite el drenado total y agita suavemente la taza para oxigenar.',
    ],
  },
  {
    method: 'AeroPress',
    ratio: '1:14 (16g Café / 224g Agua)',
    grind: 'Medio (Textura arena fina)',
    temp: '90°C / 194°F',
    time: '2:00 minutos',
    steps: [
      'Enjuaga el filtro de papel con agua caliente en la tapa de la AeroPress.',
      'Coloca el café molido en la cámara y vierte los 224g de agua caliente rápidamente.',
      'Agita suavemente el café con una espátula durante 10 segundos.',
      'Coloca el émbolo para hacer vacío, espera 1:20 min y presiona suavemente durante 30 segundos.',
    ],
  },
  {
    method: 'Prensa Francesa',
    ratio: '1:14 (20g Café / 280g Agua)',
    grind: 'Grueso (Textura sal gruesa)',
    temp: '94°C / 201°F',
    time: '6:00 minutos (Infusión lenta)',
    steps: [
      'Vierte los 280g de agua caliente directamente sobre el café molido en 10 segundos.',
      'Coloca la tapa sin presionar y permite la infusión total por 4 minutos completos.',
      'Usa una cuchara para romper la costra superficial de café y retira la espuma residual.',
      'Espera 2 minutos adicionales para permitir el asentado de sedimentos y presiona suavemente.',
    ],
  },
];

function getImage(product) {
  if (product.imagen_url) return product.imagen_url;
  if (SEED_IMAGES[product.nombre]) return SEED_IMAGES[product.nombre];
  return FALLBACK[product.categoria] ?? coffeeBourbon;
}

const HOVER_IMAGES = {
  'Bourbon Naranja (Finca El Ángel)':   coffeePour,
  'Heirloom (Finca La Fany)':           coffeePour,
  'Taza Cerámica Artesanal P&P':        coffeePour,
  'Tostada Dulce de Masa Madre':        chefPlating,
  'Cinnamon Roll (Pack Familiar)':      chefPlating,
  'Pizza Pesto & Camarón (Pre-orden)':  chefPlating,
};

function getHoverImage(product) {
  if (product.imagen_hover_url) return product.imagen_hover_url;
  if (HOVER_IMAGES[product.nombre]) return HOVER_IMAGES[product.nombre];
  return product.categoria === 'cafe' ? coffeePour : chefPlating;
}

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="absolute top-3 right-3 z-20 font-body text-[11px] tracking-[0.2em] uppercase font-bold text-white bg-red-600/80 backdrop-blur-md px-2 py-1 rounded border border-red-500/30">
        Agotado
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="absolute top-3 right-3 z-20 font-body text-[11px] tracking-[0.2em] uppercase font-bold text-amber-400 bg-amber-500/10 backdrop-blur-md px-2 py-1 rounded border border-amber-500/30">
        Últimas {stock} uds
      </span>
    );
  }
  return null;
}

export default function Market() {
  const addItem       = useCartStore((state) => state.addItem);
  const showCartToast = useUIStore((state) => state.showCartToast);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeGuide, setActiveGuide] = useState(0);
  const [activeTab, setActiveTab]     = useState('cafe');

  // Cargar productos desde Supabase
  useEffect(() => {
    let active = true;
    setLoading(true);

    supabase
      .from('productos_market')
      .select('*')
      .eq('activo', true)
      .order('nombre')
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) setProductos(data);
        setLoading(false);
      });

    // Suscripción realtime para actualizaciones de stock desde TREES
    const channelId = `market-stock-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'productos_market' },
        (payload) => {
          setProductos((prev) =>
            prev.map((p) =>
              p.id === payload.new.id
                ? { ...p, stock: payload.new.stock, activo: payload.new.activo }
                : p
            ).filter((p) => p.activo)
          );
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const activeProducts = productos.filter((p) =>
    activeTab === 'cafe' ? p.categoria === 'cafe' || p.categoria === 'merch' : p.categoria === 'food'
  );

  const handleAddToBag = (product) => {
    if (product.stock === 0) return;
    addItem({
      id:    product.id,
      title: product.nombre,
      price: parseFloat(product.precio),
      image: getImage(product),
    });
    showCartToast({ title: product.nombre, price: parseFloat(product.precio), image: getImage(product) });
    track(EVENTS.ADD_TO_CART, {
      item_id:       product.id,
      item_name:     product.nombre,
      item_category: product.categoria,
      price:         product.precio,
      source:        'market',
    });
  };

  return (
    <section id="market" className="bg-brand-background py-24 md:py-36 px-6 md:px-16 relative overflow-hidden border-t border-white/[0.02]">
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20">

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto flex flex-col items-center">
          <span className="eyebrow text-center mb-0">
            Boutique & Café de Especialidad
          </span>
          <h2 className="font-display text-brand-textMain font-light tracking-[0.05em] uppercase">
            Specialty Coffee Market
          </h2>
          <div className="w-16 h-[1px] bg-brand-primary/30 mx-auto mt-3" />
          <p className="font-body text-brand-textMuted font-light leading-relaxed pt-2">
            Llévate el aroma de Panna & Pomodoro a casa. Explora nuestro café y repostería artesana recién horneada.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center items-center max-w-md mx-auto p-1 bg-brand-surface/40 border border-white/5 rounded-full relative z-10">
          <button
            onClick={() => setActiveTab('cafe')}
            className={`flex-grow py-3 rounded-full font-body text-[11px] tracking-widest uppercase font-bold transition-all duration-[600ms] ease-high-end ${
              activeTab === 'cafe'
                ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/10'
                : 'text-brand-textMuted hover:text-brand-textMain'
            }`}
          >
            Café & Accesorios
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`flex-grow py-3 rounded-full font-body text-[11px] tracking-widest uppercase font-bold transition-all duration-[600ms] ease-high-end ${
              activeTab === 'food'
                ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/10'
                : 'text-brand-textMuted hover:text-brand-textMain'
            }`}
          >
            Masa Madre & Brunch
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 relative z-10 min-h-[480px]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-brand-surface/25 rounded-[4px] animate-pulse" />
            ))
          ) : activeProducts.length === 0 ? (
            <div className="col-span-3 py-24 text-center">
              <p className="font-body text-xs text-brand-textMuted">
                No hay productos disponibles en esta categoría en este momento.
              </p>
            </div>
          ) : (
            activeProducts.map((product) => {
              const img = getImage(product);
              const agotado = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-[3px] border border-white/[0.03] bg-brand-surface/40 hover:border-brand-primary/20 hover:bg-brand-surface/75 hover:shadow-2xl transition-all duration-700 ease-high-end p-5 relative animate-fade-in ${
                    agotado ? 'opacity-60' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Image Container with alternate hover reveal */}
                    <div className="relative overflow-hidden aspect-[4/3] rounded-[2px] bg-neutral-950 group/img">
                      <span className="absolute top-3 left-3 z-20 font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-primary bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-brand-primary/20">
                        {product.categoria === 'cafe' ? 'Granos de Especialidad'
                          : product.categoria === 'merch' ? 'Apparel & Merch'
                          : product.categoria === 'food' ? 'Horneados'
                          : product.categoria}
                      </span>
                      <StockBadge stock={product.stock} />
                      
                      {/* Primary Image */}
                      <img
                        src={img}
                        alt={product.nombre}
                        className="w-full h-full object-cover absolute inset-0 transform transition-all duration-[1200ms] ease-high-end group-hover:scale-105 group-hover:opacity-0"
                      />
                      
                      {/* Hover Reveal Image */}
                      <img
                        src={getHoverImage(product)}
                        alt={`${product.nombre} detalle`}
                        className="w-full h-full object-cover absolute inset-0 transform scale-105 opacity-0 transition-all duration-[1200ms] ease-high-end group-hover:scale-100 group-hover:opacity-100"
                      />
                      
                      <div className="absolute inset-0 bg-brand-background/25 pointer-events-none z-10" />
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-brand-textMain group-hover:text-brand-primary transition-colors duration-500 font-light tracking-wide leading-snug">
                          {product.nombre}
                        </h3>
                        <span className="price">
                          ${parseFloat(product.precio).toFixed(2)}
                        </span>
                      </div>

                      {product.notas && (
                        <div className="flex items-center space-x-2.5">
                          <TagIcon size={12} className="text-brand-primary/60" />
                          <span className="font-body text-[12px] text-brand-primary tracking-wider uppercase font-semibold">
                            {product.notas}
                          </span>
                        </div>
                      )}

                      <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light pt-2 line-clamp-2">
                        {product.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-6 border-t border-white/5 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="font-body text-[11px] tracking-[0.2em] text-brand-textMuted hover:text-brand-primary uppercase transition-all duration-300 pb-0.5 border-b border-transparent hover:border-brand-primary/40"
                    >
                      Detalles & Origen
                    </button>

                    <button
                      onClick={() => handleAddToBag(product)}
                      disabled={agotado}
                      className={`px-5 py-2.5 font-body tracking-[0.2em] text-[11px] uppercase font-bold transition-all duration-500 rounded-full ${
                        agotado
                          ? 'bg-brand-surface/60 text-brand-textMuted cursor-not-allowed'
                          : 'bg-brand-primary text-black hover:bg-[#ab8b5f]'
                      }`}
                    >
                      {agotado ? 'Agotado' : 'Añadir al Carro'}
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-high-end" />
                </div>
              );
            })
          )}
        </div>

        {/* Brew guides — solo tab café */}
        {activeTab === 'cafe' && (
          <>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent pt-12 animate-fade-in" />
            <div className="bg-brand-surface/20 border border-white/[0.02] p-8 md:p-12 rounded-[2px] shadow-2xl relative animate-fade-in">
              <div className="absolute top-4 bottom-4 left-4 right-4 border border-brand-primary/5 pointer-events-none rounded-[1px]" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-5 text-left space-y-6">
                  <div className="space-y-2">
                    <span className="eyebrow block">Coffee Education</span>
                    <h2 className="font-display text-brand-textMain font-light uppercase tracking-[0.05em]">Guías de Extracción</h2>
                    <div className="w-12 h-[1px] bg-brand-primary/20 mt-2" />
                  </div>
                  <p className="font-body text-small text-brand-textMuted leading-relaxed font-light">
                    La perfección en taza requiere precisión. Nuestros baristas han estandarizado los ratios de agua, moliendas y vertidos de los tres métodos más aclamados.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {BREW_GUIDES.map((guide, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGuide(idx)}
                        className={`px-4 py-2 border rounded-full font-body text-[11px] tracking-widest uppercase font-semibold transition-all duration-500 ${
                          activeGuide === idx
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-white/10 text-brand-textMuted hover:border-white/30 hover:text-brand-textMain'
                        }`}
                      >
                        {guide.method}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-7 bg-brand-background/60 border border-white/5 p-6 md:p-8 rounded-[2px] text-left space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-white/5">
                    {[
                      ['MÉTODO', BREW_GUIDES[activeGuide].method],
                      ['RATIO CAFÉ/AGUA', BREW_GUIDES[activeGuide].ratio],
                      ['MOLIENDA', BREW_GUIDES[activeGuide].grind],
                      ['TIEMPO', BREW_GUIDES[activeGuide].time],
                    ].map(([label, val]) => (
                      <div key={label} className="space-y-1">
                        <div className="text-[11px] font-body tracking-[0.15em] text-brand-textMuted/60 uppercase">{label}</div>
                        <p className="text-[14px] font-body font-medium text-brand-textMain leading-relaxed">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <span className="text-[13px] font-body tracking-[0.25em] text-brand-primary uppercase font-bold block">Paso a Paso</span>
                    <ol className="space-y-3.5">
                      {BREW_GUIDES[activeGuide].steps.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-3.5 text-[14px] text-brand-textMuted leading-relaxed font-light">
                          <span className="font-display italic text-brand-primary font-medium text-sm leading-none pt-0.5">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all duration-500">
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedProduct(null)} />
          <div className="relative z-10 w-full max-w-4xl bg-[#090909] border border-white/10 rounded-[3px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full border border-white/10 hover:border-brand-primary flex items-center justify-center bg-black/60 text-brand-textMain hover:text-brand-primary transition-all duration-300"
            >
              &times;
            </button>
            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[60vh] overflow-hidden bg-black">
              <img src={getImage(selectedProduct)} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6 bg-brand-surface border-t md:border-t-0 md:border-l border-white/[0.04] text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[12px] text-brand-primary tracking-[0.2em] uppercase font-bold">
                    {selectedProduct.categoria}
                  </span>
                  <div className="flex space-x-2">
                    {(selectedProduct.tags || []).map((tg, i) => (
                      <span key={i} className="text-[12px] font-body tracking-wider uppercase font-semibold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-2 py-0.5 rounded-full">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
                <h4 className="font-display text-2xl md:text-3xl text-brand-textMain font-light leading-snug">{selectedProduct.nombre}</h4>
                {selectedProduct.notas && (
                  <div className="flex items-center space-x-2 pb-2">
                    <TagIcon size={12} className="text-brand-primary" />
                    <span className="font-body text-[12px] text-brand-primary tracking-wider uppercase font-bold">{selectedProduct.notas}</span>
                  </div>
                )}
                <div className="w-12 h-[1px] bg-brand-primary/30 mt-2" />
                <p className="font-body text-[14px] text-brand-textMuted leading-relaxed font-light pt-1">{selectedProduct.descripcion}</p>
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="pt-4 space-y-2 border-t border-white/5">
                    <span className="text-[12px] font-body tracking-wider text-brand-textMain font-bold block uppercase">Especificaciones</span>
                    <div className="grid grid-cols-2 gap-3 text-[12px] font-body text-brand-textMuted uppercase tracking-wider font-light">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key} className="space-y-0.5">
                          <span className="text-[12px] text-brand-primary/60 font-semibold block">{key}</span>
                          <span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="font-display italic text-brand-primary text-2xl font-light">
                  ${parseFloat(selectedProduct.precio).toFixed(2)}
                </span>
                <button
                  onClick={() => { handleAddToBag(selectedProduct); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className={`px-6 py-3 font-body tracking-[0.2em] text-[11px] uppercase font-bold transition-all duration-500 rounded-full ${
                    selectedProduct.stock === 0
                      ? 'bg-brand-surface/60 text-brand-textMuted cursor-not-allowed'
                      : 'bg-brand-primary text-black hover:bg-[#ab8b5f]'
                  }`}
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Añadir al Carro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
