import { useState, useEffect } from 'react';
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
import coffeePour from '../assets/coffee_pour.webp';

// Solo assets auténticos Panna. Cero referencias a chef_plating o menu_dish.
const FALLBACK = {
  cafe:    coffeeBourbon,
  food:    cinnamonRoll,
  merch:   coffeeBags,
  general: coffeeBags,
};

const SEED_IMAGES = {
  'Bourbon Naranja (Finca El Ángel)':   coffeeBourbon,
  'Heirloom (Finca La Fany)':           coffeeBags,
  'Taza Cerámica Artesanal P&P':        coffeePour,
  'Tostada Dulce de Masa Madre':        sourdoughToast,
  'Cinnamon Roll (Pack Familiar)':      cinnamonRoll,
  'Pizza Pesto & Camarón (Pre-orden)':  sourdoughPizza,
};

const BREW_GUIDES = [
  {
    method: 'V60',
    ratio: '1:15 (15g café / 225g agua)',
    grind: 'Medio-fino (textura sal de mesa)',
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
    ratio: '1:14 (16g café / 224g agua)',
    grind: 'Medio (textura arena fina)',
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
    ratio: '1:14 (20g café / 280g agua)',
    grind: 'Grueso (textura sal gruesa)',
    temp: '94°C / 201°F',
    time: '6:00 minutos (infusión lenta)',
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

// Hover: usamos el mismo asset (sin chef_plating ni menu_dish ajenos).

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="absolute top-3 right-3 z-20 text-[12px] text-brand-danger bg-white border border-brand-danger/40 px-2 py-1">
        Agotado
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="absolute top-3 right-3 z-20 text-[12px] text-brand-accent bg-white border border-brand-accent/40 px-2 py-1">
        Últimas {stock} uds
      </span>
    );
  }
  return (
    <span className="absolute top-3 right-3 z-20 text-[12px] text-brand-success bg-white border border-brand-success/40 px-2 py-1">
      Disponible
    </span>
  );
}

const CATEGORY_LABELS = {
  cafe:  'Granos de especialidad',
  merch: 'Apparel & merch',
  food:  'Horneados',
};

export default function Market() {
  const addItem       = useCartStore((state) => state.addItem);
  const showCartToast = useUIStore((state) => state.showCartToast);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeGuide, setActiveGuide] = useState(0);
  const [activeTab, setActiveTab]     = useState('cafe');

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <section id="market" className="section bg-brand-background border-t border-brand-border">
      <div className="container-page space-y-16">

        <header className="max-w-2xl mx-auto text-center space-y-4 flex flex-col items-center">
          <div className="eyebrow flex items-center gap-3 justify-center">
            <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
            <span>Boutique &amp; café de especialidad</span>
            <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
          </div>
          <h2 className="h-section text-center">
            Specialty Coffee Market.
          </h2>
          <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading">
            Llévate el aroma de Panna &amp; Pomodoro a casa. Café y repostería artesana recién horneada.
          </p>
        </header>

        <div className="flex justify-center items-center max-w-md mx-auto border-y border-brand-border">
          {[
            { value: 'cafe', label: 'Café & Accesorios' },
            { value: 'food', label: 'Masa madre & brunch' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex-1 min-h-[48px] py-3 text-[14px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                activeTab === value
                  ? 'text-brand-textMain border-b-2 border-brand-primary -mb-px'
                  : 'text-brand-textSubtle hover:text-brand-textMain'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-brand-placeholder animate-pulse" />
            ))
          ) : activeProducts.length === 0 ? (
            <div className="col-span-3 py-24 text-center">
              <p className="text-[14px] text-brand-textSubtle">
                No hay productos disponibles en esta categoría en este momento.
              </p>
            </div>
          ) : (
            activeProducts.map((product, idx) => {
              const img = getImage(product);
              const agotado = product.stock === 0;
              const eager = idx < 3;

              return (
                <article
                  key={product.id}
                  className={`group flex flex-col overflow-hidden bg-white border border-brand-border hover:border-brand-primary/40 transition-[transform,border-color] duration-base hover:-translate-y-1.5 will-change-transform ${
                    agotado ? 'opacity-60' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="relative overflow-hidden aspect-[4/3] bg-brand-placeholder">
                      <span className="absolute top-3 left-3 z-20 text-[12px] text-brand-textMain bg-white border border-brand-border px-2 py-1">
                        {CATEGORY_LABELS[product.categoria] ?? product.categoria}
                      </span>
                      <StockBadge stock={product.stock} />

                      <img
                        src={img}
                        alt={product.nombre}
                        loading={eager ? 'eager' : 'lazy'}
                        fetchPriority={eager ? 'high' : 'auto'}
                        className="image-zoom-slow w-full h-full object-cover absolute inset-0"
                      />
                    </div>

                    <div className="space-y-3 px-5 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-[18px] text-brand-textMain font-normal leading-snug">
                          {product.nombre}
                        </h3>
                        <span className="text-[15px] text-brand-textMain tabular-nums shrink-0">
                          ${parseFloat(product.precio).toFixed(2)}
                        </span>
                      </div>

                      {product.notas && (
                        <div className="flex items-center gap-2">
                          <TagIcon size={12} className="text-brand-success" />
                          <span className="text-[13px] text-brand-success">
                            {product.notas}
                          </span>
                        </div>
                      )}

                      <p className="text-[14px] text-brand-textMain leading-relaxed line-clamp-2">
                        {product.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-4 mt-auto border-t border-brand-border flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="btn-underline"
                    >
                      Detalles &amp; origen
                    </button>

                    <button
                      onClick={() => handleAddToBag(product)}
                      disabled={agotado}
                      className={`btn-primary-sm ${
                        agotado
                          ? 'bg-brand-placeholder text-brand-textSubtle cursor-not-allowed hover:bg-brand-placeholder'
                          : ''
                      }`}
                    >
                      {agotado ? 'Agotado' : 'Añadir al carro'}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {activeTab === 'cafe' && (
          <>
            <div className="border-t border-brand-border pt-8" />
            <div className="bg-white border border-brand-border p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5 text-left space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[12px] text-brand-textSubtle">
                      <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
                      <span>Coffee education</span>
                    </div>
                    <h3 className="h-section">
                      Guías de extracción.
                    </h3>
                  </div>
                  <p className="text-[15px] text-brand-textMain leading-relaxed">
                    La perfección en taza requiere precisión. Nuestros baristas han estandarizado los ratios de agua, moliendas y vertidos de los tres métodos más aclamados.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {BREW_GUIDES.map((guide, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGuide(idx)}
                        className={`min-h-[44px] py-2 px-4 border text-[13px] transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                          activeGuide === idx
                            ? 'border-brand-primary text-brand-textMain'
                            : 'border-brand-border text-brand-textSubtle hover:border-brand-primary hover:text-brand-textMain'
                        }`}
                      >
                        {guide.method}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-7 bg-brand-surfaceMuted border border-brand-border p-6 md:p-8 text-left space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-brand-border">
                    {[
                      ['Método', BREW_GUIDES[activeGuide].method],
                      ['Ratio café/agua', BREW_GUIDES[activeGuide].ratio],
                      ['Molienda', BREW_GUIDES[activeGuide].grind],
                      ['Tiempo', BREW_GUIDES[activeGuide].time],
                    ].map(([label, val]) => (
                      <div key={label} className="space-y-1">
                        <div className="text-[12px] text-brand-textSubtle">{label}</div>
                        <p className="text-[14px] text-brand-textMain leading-relaxed">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <p className="text-[14px] text-brand-textSubtle">Paso a paso</p>
                    <ol className="space-y-3">
                      {BREW_GUIDES[activeGuide].steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[14px] text-brand-textMain leading-relaxed">
                          <span className="text-brand-textSubtle tabular-nums shrink-0">{idx + 1}.</span>
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

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedProduct(null)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-modal-title"
            tabIndex={-1}
            className="relative z-10 w-full max-w-4xl bg-white border border-brand-border overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-30 w-11 h-11 min-w-[44px] min-h-[44px] border border-brand-border hover:border-brand-primary flex items-center justify-center bg-white text-brand-textMain hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary text-xl"
              aria-label="Cerrar detalle de producto"
            >
              &times;
            </button>
            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[60vh] overflow-hidden bg-brand-placeholder">
              <img src={getImage(selectedProduct)} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6 bg-brand-surfaceMuted border-t md:border-t-0 md:border-l border-brand-border text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-brand-accent">
                    {CATEGORY_LABELS[selectedProduct.categoria] ?? selectedProduct.categoria}
                  </span>
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.tags.map((tg, i) => (
                        <span key={i} className="text-[12px] text-brand-accent border border-brand-accent/30 bg-white px-2 py-0.5">
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <h4 id="market-modal-title" className="font-display text-2xl md:text-3xl text-brand-textMain font-light leading-snug">{selectedProduct.nombre}</h4>
                {selectedProduct.notas && (
                  <div className="flex items-center gap-2 pb-2">
                    <TagIcon size={12} className="text-brand-primary" aria-hidden="true" />
                    <span className="text-[14px] text-brand-accent">{selectedProduct.notas}</span>
                  </div>
                )}
                <p className="text-[14px] text-brand-textMain leading-relaxed">{selectedProduct.descripcion}</p>
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="pt-4 space-y-3 border-t border-brand-border">
                    <p className="text-[14px] text-brand-textSubtle">Especificaciones</p>
                    <dl className="grid grid-cols-2 gap-3 text-[13px] text-brand-textMain">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key} className="space-y-0.5">
                          <dt className="text-brand-accent">{key}</dt>
                          <dd className="text-brand-textMain">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-brand-border flex items-center justify-between">
                <span className="font-display text-2xl text-brand-textMain font-light tabular-nums">
                  ${parseFloat(selectedProduct.precio).toFixed(2)}
                </span>
                <button
                  onClick={() => { handleAddToBag(selectedProduct); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className={`btn-primary ${
                    selectedProduct.stock === 0
                      ? 'bg-brand-placeholder text-brand-textSubtle cursor-not-allowed hover:bg-brand-placeholder'
                      : ''
                  }`}
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Añadir al carro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
