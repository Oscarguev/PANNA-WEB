import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { SparklesIcon, UserIcon } from './Icons';
import logo from '../assets/logo.png';
import { useSessionStore } from '../stores/useSessionStore';
import { track, EVENTS } from '../analytics';
import { revealFade, EASE } from '../motion/variants';

// ✏️ EDITABLE: puntos que gana el cliente por dejar una reseña
const PUNTOS_RESEÑA = 50;

// ── EDITABLE: Reseñas iniciales que aparecen antes de que lleguen las reales ─
// Estas reseñas se guardan en localStorage del usuario. Puedes cambiarlas,
// agregar más o dejar solo 1-2 para que el resto sea genuino de clientes.
const INITIAL_CUSTOMER_REVIEWS = [
  {
    id: 101,
    name: "Carlos Mendoza",      // ✏️ nombre
    rating: 5,                   // ✏️ estrellas (1-5)
    comment: "La pizza de masa madre con pesto y camarones tiene una elasticidad y alvéolos que solo se ven en Nápoles. El maridaje sugerido por el sommelier fue perfecto. Se nota el respeto al tiempo de fermentación.", // ✏️ comentario
    date: "2026-05-24",          // ✏️ fecha (YYYY-MM-DD)
    isMember: true,              // ✏️ true = muestra badge del club
    level: "Forest"              // ✏️ nivel del club (Seed / Sprout / Forest)
  },
  {
    id: 102,
    name: "Lucía H.",
    rating: 5,
    comment: "El ritual de vertido V60 con el grano Geisha es una experiencia mística. Una acidez brillante, notas de lemongrass impecables. Sin duda alguna, mi lugar favorito en Sonsonate.",
    date: "2026-05-22",
    isMember: true,
    level: "Sprout"
  },
  {
    id: 103,
    name: "Sofía Torres",
    rating: 4,
    comment: "Los roles de canela son extraordinarios y el brunch de autor delicioso. Recomiendo reservar mesa en la terraza, la luz de las velas crea un ambiente verdaderamente íntimo.",
    date: "2026-05-19",
    isMember: false,
    level: ""
  },
  {
    id: 104,
    name: "Roberto Escalante",
    rating: 5,
    comment: "El servicio es impecable y la comida exquisita. La tostada de aguacate con brioche artesanal es de otro planeta. Es el lujo silencioso hecho gastronomía.",
    date: "2026-05-15",
    isMember: true,
    level: "Seed"
  }
];

const maskProps = {
  WebkitMaskSize: 'contain', maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center', maskPosition: 'center',
};

export default function CustomerReviews() {
  const userSession  = useSessionStore((state) => state);
  const sumarPuntos  = useSessionStore((state) => state.sumarPuntos);

  const [customerReviews, setCustomerReviews] = useState(() => {
    const saved = localStorage.getItem('panna_customer_reviews');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_REVIEWS;
  });

  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [formOpen, setFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('panna_customer_reviews', JSON.stringify(customerReviews));
  }, [customerReviews]);

  useEffect(() => {
    if (userSession?.loggedIn && !newName) setNewName(userSession.name);
  }, [userSession, newName]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment || !newName) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const review = {
        id: Date.now(),
        name: newName,
        rating: newRating,
        comment: newComment,
        date: new Date().toISOString().split('T')[0],
        isMember: userSession?.loggedIn || false,
        level: userSession?.loggedIn ? userSession.level : ""
      };
      setCustomerReviews((prev) => [review, ...prev]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      if (userSession?.loggedIn) sumarPuntos(PUNTOS_RESEÑA);
      track(EVENTS.REVIEW_PUBLISH, { rating: review.rating, member: review.isMember, level: review.level || null });
      setNewComment('');
      if (!userSession?.loggedIn) setNewName('');
      setNewRating(5);
      setTimeout(() => { setSubmitSuccess(false); setFormOpen(false); }, 3000);
    }, 1500);
  };

  const averageRating   = (customerReviews.reduce((acc, r) => acc + r.rating, 0) / customerReviews.length).toFixed(1);
  const totalReviews    = customerReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].reduce((acc, s) => {
    acc[s] = customerReviews.filter(r => r.rating === s).length;
    return acc;
  }, {});

  const processedReviews = customerReviews
    .filter((r) => filterRating === 'all' || r.rating === Number(filterRating))
    .sort((a, b) => sortBy === 'recent' ? new Date(b.date) - new Date(a.date) : b.rating - a.rating);

  return (
    <m.section
      id="reviews"
      className="bg-[#050505] py-14 md:py-20 px-6 md:px-16 relative overflow-hidden border-t border-white/[0.02]"
      variants={revealFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block font-semibold">
              Opiniones de Comensales
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-brand-textMain font-light tracking-[0.05em] uppercase">
              Reseñas
            </h2>
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-primary/40 text-brand-primary hover:bg-brand-primary hover:text-black font-body tracking-[0.2em] text-[11px] uppercase font-bold transition-all duration-500 rounded-full bg-transparent self-start md:self-auto"
          >
            <SparklesIcon size={11} />
            <span>{formOpen ? 'Cerrar' : 'Escribir Reseña'}</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Average score */}
          <div className="lg:col-span-3 bg-brand-surface/40 border border-white/[0.04] p-5 rounded-[2px] shadow-xl space-y-3">
            <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold block">
              Puntuación Promedio
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-4xl text-brand-textMain font-light leading-none">{averageRating}</span>
              <span className="font-body text-brand-textMuted text-xs uppercase tracking-wider">/ 5.0</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} style={{
                  width: 16, height: 16,
                  backgroundColor: s <= Math.round(Number(averageRating)) ? '#c5a880' : 'rgba(197,168,128,0.2)',
                  WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})`,
                  ...maskProps,
                }} />
              ))}
            </div>
            <span className="font-body text-[11px] text-brand-textMuted/65 uppercase tracking-wider block">
              {totalReviews} opiniones
            </span>
          </div>

          {/* Rating bars */}
          <div className="lg:col-span-5 bg-brand-surface/40 border border-white/[0.04] p-5 rounded-[2px] shadow-xl flex flex-col justify-center space-y-2.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const pct   = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center text-[11px] font-body uppercase tracking-wider text-brand-textMuted">
                  <span className="w-8 text-left">{stars} ★</span>
                  <div className="flex-grow h-1.5 bg-black/50 rounded-full mx-3 overflow-hidden border border-white/5">
                    <div className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-high-end" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-brand-textMain/80">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="lg:col-span-4 bg-brand-surface/40 border border-white/[0.04] p-5 rounded-[2px] shadow-xl flex flex-col justify-center space-y-4">
            <div className="space-y-1.5">
              <label className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted block font-bold">Filtrar</label>
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-white/10 rounded-full font-body text-[11px] px-4 py-2 focus:outline-none focus:border-brand-primary text-brand-textMain uppercase tracking-wider cursor-pointer">
                <option value="all">Todas</option>
                <option value="5">5 Estrellas</option>
                <option value="4">4 Estrellas</option>
                <option value="3">3 Estrellas</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-body text-[11px] tracking-wider uppercase text-brand-textMuted block font-bold">Ordenar</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#0c0c0c] border border-white/10 rounded-full font-body text-[11px] px-4 py-2 focus:outline-none focus:border-brand-primary text-brand-textMain uppercase tracking-wider cursor-pointer">
                <option value="recent">Más Recientes</option>
                <option value="highest">Mejor Puntuación</option>
              </select>
            </div>
          </div>

        </div>

        {/* Write review form */}
        <div className={`transition-all duration-700 ease-high-end overflow-hidden ${formOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="max-w-3xl mx-auto bg-brand-surface/75 border border-brand-primary/15 p-6 rounded-[2px] shadow-2xl relative">
            <div className="absolute top-3 bottom-3 left-3 right-3 border border-brand-primary/5 pointer-events-none rounded-[1px]" />

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fade-in relative z-10">
                <div className="w-12 h-12 rounded-full border border-brand-primary/30 mx-auto flex items-center justify-center bg-brand-primary/10">
                  <SparklesIcon size={16} className="text-brand-primary animate-pulse" />
                </div>
                <h3 className="font-display text-xl text-brand-primary font-light uppercase tracking-wide">¡Reseña Publicada!</h3>
                <p className="font-body text-xs text-brand-textMuted max-w-sm mx-auto leading-relaxed">
                  Gracias por compartir su experiencia en Panna &amp; Pomodoro.
                </p>
                {userSession?.loggedIn && (
                  <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/25 px-4 py-2 rounded-full">
                    <span className="text-brand-primary text-sm font-bold">+{PUNTOS_RESEÑA}</span>
                    <span className="font-body text-[11px] tracking-[0.2em] uppercase text-brand-primary font-semibold">puntos PANNA</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5 relative z-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="revName" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Nombre *</label>
                    <input type="text" id="revName" required disabled={userSession?.loggedIn}
                      placeholder="Ej: Carlos Mendoza" value={newName} onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10 disabled:opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Calificación *</label>
                    <div className="flex items-center space-x-2 py-1.5">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const isFilled = hoverRating !== null ? s <= hoverRating : s <= newRating;
                        return (
                          <button type="button" key={s} onClick={() => setNewRating(s)}
                            onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(null)}
                            className="focus:outline-none transform hover:scale-125 transition-all duration-300"
                            aria-label={`${s} estrellas`}>
                            <div style={{
                              width: 22, height: 22,
                              backgroundColor: isFilled ? '#c5a880' : 'rgba(197,168,128,0.2)',
                              WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})`,
                              ...maskProps,
                              filter: isFilled ? 'drop-shadow(0 0 6px rgba(197,168,128,0.45))' : 'none',
                            }} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="revComment" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">Comentario *</label>
                  <textarea id="revComment" required rows="3"
                    placeholder="Cuéntenos sobre su experiencia..."
                    value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/10 resize-none" />
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="px-7 py-3 bg-brand-primary text-black font-body tracking-[0.25em] text-[11px] uppercase font-bold hover:bg-[#ab8b5f] transition-all duration-500 rounded-full shadow-xl disabled:opacity-50">
                  {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {processedReviews.length === 0 ? (
            <div className="col-span-2 py-10 text-center bg-brand-surface/20 border border-white/[0.04] rounded-[2px]">
              <p className="font-body text-xs text-brand-textMuted font-light">No hay reseñas con esa calificación.</p>
            </div>
          ) : (
            processedReviews.map((rev) => (
              <div key={rev.id}
                className="bg-brand-surface/40 border border-white/[0.04] hover:border-brand-primary/20 p-5 rounded-[2px] shadow-xl text-left flex flex-col justify-between space-y-4 transition-all duration-500 group">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} style={{
                          width: 14, height: 14,
                          backgroundColor: s <= rev.rating ? '#c5a880' : 'rgba(197,168,128,0.2)',
                          WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})`,
                          ...maskProps,
                        }} />
                      ))}
                    </div>
                    <span className="font-body text-[11px] text-brand-textMuted/60 uppercase tracking-widest">{rev.date}</span>
                  </div>
                  <p className="font-body text-[13px] text-brand-textMuted leading-relaxed font-light italic">"{rev.comment}"</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-brand-surface flex items-center justify-center border border-white/10 group-hover:border-brand-primary/30 transition-colors duration-500">
                      <UserIcon size={12} className="text-brand-textMuted group-hover:text-brand-primary transition-colors duration-500" />
                    </div>
                    <div>
                      <span className="font-body text-xs text-brand-textMain font-medium block">{rev.name}</span>
                      <span className="font-body text-[10px] text-brand-textMuted/55 uppercase tracking-wider">Comensal Verificado</span>
                    </div>
                  </div>
                  {rev.isMember && (
                    <div className="flex items-center space-x-1 bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">
                      <SparklesIcon size={8} className="text-brand-primary" />
                      <span className="font-body text-[10px] text-brand-primary tracking-wider uppercase font-bold">{rev.level || 'Socio'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </m.section>
  );
}
