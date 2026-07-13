import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CloseIcon } from './Icons';
import { reveal, revealFade, lightboxBackdrop, lightboxDialog } from '../motion/variants';
import { useFocusTrap } from '../hooks/useFocusTrap';
import coffeeBourbon from '../assets/coffee_bourbon.webp';
import coffeeBags from '../assets/coffee_bags.webp';
import cinnamonRoll from '../assets/cinnamon_roll.webp';
import sourdoughToast from '../assets/sourdough_toast.webp';
import sourdoughPizza from '../assets/sourdough_pizza.webp';

const GALLERY_ITEMS = [
  {
    id: 1,
    image: sourdoughToast,
    category: 'Brunch',
    title: 'Tostada dulce de masa madre',
    aspect: 'col-span-12 md:col-span-8 aspect-[16/9] md:aspect-[16/10]',
    desc: 'Rebanada gruesa de nuestra hogaza artesana, crema de cacahuate natural, fresas frescas, plátano laminado, frutos rojos confitados y granola crujiente.',
  },
  {
    id: 2,
    image: coffeeBourbon,
    category: 'Café',
    title: 'Bourbon Naranja (Finca El Ángel)',
    aspect: 'col-span-6 md:col-span-4 aspect-[3/4]',
    desc: 'Microlote del productor Rafael Silva en Chalchuapa. Proceso natural anaeróbico secado en cama africana con notas a granada y lychee.',
  },
  {
    id: 3,
    image: sourdoughPizza,
    category: 'Masa madre',
    title: 'Pizza pesto y camarón a la piedra',
    aspect: 'col-span-6 md:col-span-4 aspect-[3/4]',
    desc: 'Masa fermentada lentamente durante 48 horas, mozzarella, camarones selectos y un espiral de pesto de albahaca fresca hecho en casa.',
  },
  {
    id: 4,
    image: cinnamonRoll,
    category: 'Repostería',
    title: 'Rol de canela recién horneado',
    aspect: 'col-span-12 md:col-span-8 aspect-[16/9] md:aspect-[16/10]',
    desc: 'Masa hojaldrada tierna horneada diariamente, rellena de canela de Saigón y azúcar morena, servida tibia con un toque de glaseado clásico.',
  },
  {
    id: 5,
    image: coffeeBags,
    category: 'Boutique',
    title: 'Microlotes exclusivos de Panna',
    aspect: 'col-span-6 md:col-span-6 aspect-[4/3] md:aspect-[16/10]',
    desc: 'Nuestra colección de granos de especialidad (Bourbon Naranja y Heirloom) cultivados por productores que conocemos por nombre en Chalchuapa.',
  },
  {
    id: 6,
    image: sourdoughPizza,
    category: 'Horno',
    title: 'Pizza recién horneada a la piedra',
    aspect: 'col-span-6 md:col-span-6 aspect-[4/3] md:aspect-[16/10]',
    desc: 'Masa fermentada 48 horas, estirada a mano y horneada a la piedra. Cada pizza se sirve apenas sale del horno.',
  },
];

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);
  const lightboxRef = useRef(null);

  useFocusTrap(!!activeImage, () => setActiveImage(null), lightboxRef);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (e) => { if (e.key === 'Escape') setActiveImage(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeImage]);

  return (
    <section
      id="gallery"
      aria-label="Galería del restaurante"
      className="section bg-brand-background border-t border-brand-border"
    >
      <div className="container-page">

        <m.header
          className="max-w-3xl mb-12 md:mb-16"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="eyebrow flex items-center gap-3">
            <span className="w-8 h-px bg-brand-textSubtle/60" aria-hidden="true" />
            Galería
          </p>
          <h2 className="h-section">
            Lo que se ve en la mesa.
          </h2>
          <p className="font-sans text-[14px] md:text-[15px] text-brand-textSubtle leading-relaxed mt-5 max-w-reading">
            Una selección de platos, panes y rincones del salón. Tocá cualquier imagen para abrir el detalle.
          </p>
        </m.header>

        <m.div
          className="grid grid-cols-12 gap-4"
          variants={revealFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {GALLERY_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveImage(item)}
              className={`${item.aspect} relative overflow-hidden border border-brand-border bg-brand-placeholder group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary text-left`}
              aria-label={`Ampliar imagen: ${item.title}`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover image-zoom-slow"
              />

              {/* Caption discreto permanente abajo */}
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent px-4 pt-8 pb-3 pointer-events-none">
                <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/85 block mb-1">
                  {item.category}
                </span>
                <h3 className="font-display text-[13px] md:text-[14px] text-white font-normal leading-snug">
                  {item.title}
                </h3>
              </figcaption>
            </button>
          ))}
        </m.div>
      </div>

      {/* Lightbox con AnimatePresence: backdrop fade + dialog scale 0.97→1 */}
      <AnimatePresence>
        {activeImage && (
          <m.div
            key="lightbox"
            variants={lightboxBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          >
            <div
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setActiveImage(null)}
              aria-hidden="true"
            />

            <m.div
              ref={lightboxRef}
              variants={lightboxDialog}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-title"
              tabIndex={-1}
              className="relative z-10 w-full max-w-5xl bg-white border border-brand-border overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-30 min-w-[44px] min-h-[44px] border border-brand-border hover:border-brand-primary flex items-center justify-center bg-white text-brand-textMain hover:text-brand-primary transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Cerrar galería"
              >
                <CloseIcon size={16} />
              </button>

              <div className="w-full md:w-2/3 aspect-[4/3] md:aspect-auto md:h-[70vh] overflow-hidden bg-brand-placeholder">
                <img
                  src={activeImage.image}
                  alt={activeImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/3 p-8 flex flex-col justify-between space-y-6 bg-brand-surfaceMuted border-t md:border-t-0 md:border-l border-brand-border text-left">
                <div className="space-y-4">
                  <span className="eyebrow block">
                    {activeImage.category}
                  </span>

                  <h4 id="lightbox-title" className="font-display text-2xl md:text-3xl text-brand-textMain font-light leading-snug">
                    {activeImage.title}
                  </h4>

                  <p className="font-sans text-[15px] text-brand-textMain leading-relaxed max-w-reading">
                    {activeImage.desc}
                  </p>
                </div>

                <p className="pt-6 border-t border-brand-border text-[13px] text-brand-textSubtle">
                  Panna &amp; Pomodoro · Sonsonate
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}