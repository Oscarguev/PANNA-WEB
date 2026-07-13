import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useSessionStore } from '../stores/useSessionStore';
import { track, EVENTS } from '../analytics';
import { revealFade } from '../motion/variants';

const QUOTES = [
  {
    name: 'Carlos Mendoza',
    place: 'Santa Ana',
    text: 'La pizza de masa madre con pesto y camarones tiene una elasticidad y unos alvéolos que solo se ven en Nápoles. El maridaje con el sommelier fue perfecto.',
  },
  {
    name: 'Lucía H.',
    place: 'San Salvador',
    text: 'El ritual de vertido V60 con el grano Geisha es una experiencia mística. Una acidez brillante, notas de lemongrass impecables.',
  },
  {
    name: 'Roberto Escalante',
    place: 'Sonsonate',
    text: 'El servicio es impecable y la comida exquisita. La tostada de aguacate con brioche artesanal es de otro planeta. Es el lujo silencioso hecho gastronomía.',
  },
];

const PUNTOS_RESEÑA = 50;

const INITIAL_REVIEWS = [
  { id: 1, name: 'Carlos Mendoza',   comment: QUOTES[0].text, date: '2026-05-24', isMember: true },
  { id: 2, name: 'Lucía H.',         comment: QUOTES[1].text, date: '2026-05-22', isMember: true },
  { id: 3, name: 'Sofía Torres',     comment: 'Los roles de canela son extraordinarios y el brunch de autor delicioso. Recomiendo reservar mesa en la terraza.', date: '2026-05-19', isMember: false },
  { id: 4, name: 'Roberto Escalante', comment: QUOTES[2].text, date: '2026-05-15', isMember: true },
];

export default function CustomerReviews() {
  const userSession  = useSessionStore((state) => state);
  const sumarPuntos  = useSessionStore((state) => state.sumarPuntos);

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('panna_customer_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [formOpen, setFormOpen]       = useState(false);
  const [newRating, setNewRating]     = useState(5);
  const [newComment, setNewComment]   = useState('');
  const [newName, setNewName]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('panna_customer_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Prefill nombre desde la sesión activa cuando el usuario aún no escribió uno.
  useEffect(() => {
    if (userSession?.loggedIn && !newName)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewName(userSession.name);
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
      };
      setReviews((prev) => [review, ...prev]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      if (userSession?.loggedIn) sumarPuntos(PUNTOS_RESEÑA);
      track(EVENTS.REVIEW_PUBLISH, { rating: review.rating, member: review.isMember });
      setNewComment('');
      if (!userSession?.loggedIn) setNewName('');
      setNewRating(5);
      setTimeout(() => { setSubmitSuccess(false); setFormOpen(false); }, 3000);
    }, 1500);
  };

  return (
    <section
      id="reviews"
      className="section bg-brand-background border-t border-brand-border"
    >
      <m.div
        className="container-page space-y-16"
        variants={revealFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >

        <header className="max-w-3xl space-y-6">
          <h2 className="h-section">
            Lo que dice quien ya pasó por acá.
          </h2>
          <button
            onClick={() => setFormOpen((v) => !v)}
            aria-expanded={formOpen}
            aria-controls="review-form"
            className="btn-underline"
          >
            {formOpen ? 'Cerrar' : 'Escribir una reseña'}
          </button>
        </header>

        {/* Editorial quote grid — no stars, no stats, no filters */}
        <div
          id="review-form"
          className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 transition-opacity duration-base ${formOpen ? 'opacity-50' : ''}`}
        >
          {reviews.length === 0 ? (
            <p className="col-span-2 text-brand-textSubtle">Aún no hay reseñas.</p>
          ) : (
            reviews.slice(0, 4).map((rev) => (
              <article key={rev.id} className="space-y-4 border-t border-brand-border pt-6">
                <p className="font-display text-xl md:text-2xl text-brand-textMain font-light leading-snug">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="flex items-baseline gap-3 text-[12px] text-brand-textSubtle">
                  <span className="text-brand-textMain font-medium">
                    {rev.name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time>{new Date(rev.date).toLocaleDateString('es-SV', { year: 'numeric', month: 'long' })}</time>
                </div>
              </article>
            ))
          )}
        </div>

        {formOpen && (
          <div className="border-t border-brand-border pt-10">
            {submitSuccess ? (
              <div className="space-y-2" role="status" aria-live="polite">
                <p className="font-display text-2xl text-brand-textMain">Gracias por escribir.</p>
                {userSession?.loggedIn && (
                  <p className="text-[13px] text-brand-textSubtle">
                    Se te han acreditado +{PUNTOS_RESEÑA} puntos en tu cuenta.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6 max-w-2xl" noValidate>
                <div className="space-y-2">
                  <label htmlFor="rev-name" className="block text-[13px] text-brand-textSubtle">
                    Tu nombre
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    disabled={userSession?.loggedIn}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Cómo quieres aparecer"
                    className="input-line disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="rev-comment" className="block text-[13px] text-brand-textSubtle">
                    Tu reseña
                  </label>
                  <textarea
                    id="rev-comment"
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Cuéntanos lo que viviste"
                    className="input-line resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Publicando…' : 'Publicar reseña'}
                </button>
              </form>
            )}
          </div>
        )}

      </m.div>
    </section>
  );
}