import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { PhoneIcon, MapPinIcon, ClockIcon, AlertTriangleIcon } from './Icons';
import { useSessionStore } from '../stores/useSessionStore';
import { track, EVENTS } from '../analytics';
import { supabase } from '../lib/supabase';
import { reveal } from '../motion/variants';

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ChefCTA() {
  const userSession    = useSessionStore((state) => state);
  const addReservation = useSessionStore((state) => state.addReservationLocal);
  const sumarPuntos    = useSessionStore((state) => state.sumarPuntos);
  const formRef        = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    zona: 'salon',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Sincroniza el nombre con la sesión activa.
  useEffect(() => {
    if (userSession?.loggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, name: userSession.name }));
    } else {
      setFormData((prev) => ({ ...prev, name: '' }));
    }
  }, [userSession]);

  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  const validate = (data) => {
    const errs = {};
    if (!data.name?.trim())   errs.name  = 'Ingresa tu nombre completo.';
    if (!data.phone?.trim())  errs.phone = 'Ingresa un teléfono de contacto.';
    else if (!/^[\d\s+\-()]{6,}$/.test(data.phone.trim())) errs.phone = 'Formato de teléfono inválido.';
    if (!data.date)           errs.date  = 'Selecciona la fecha.';
    else if (data.date < today) errs.date = 'La fecha no puede ser en el pasado.';
    if (!data.time)           errs.time  = 'Selecciona la hora.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Grupo grande: redirigir a WhatsApp, no enviar a Supabase.
    if (formData.guests === '12+') {
      const msg = encodeURIComponent('Hola, quiero reservar para 12 o más personas. ¿Me pueden ayudar?');
      window.open(`https://wa.me/50324511000?text=${msg}`, '_blank', 'noopener,noreferrer');
      track(EVENTS.RESERVATION_SUBMIT, { guests: '12+', channel: 'whatsapp' });
      return;
    }
    const errs = validate(formData);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setSubmitError('Revisa los campos marcados.');
      const firstKey = Object.keys(errs)[0];
      const el = formRef.current?.querySelector(`#chef-${firstKey}`);
      if (el) el.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from('reservaciones').insert({
      nombre:     formData.name,
      telefono:   formData.phone,
      comensales: parseInt(formData.guests, 10),
      fecha:      formData.date,
      hora:       formData.time,
      zona:       formData.zona,
      notas:      formData.notes || null,
      cliente_id: userSession?.id || null,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError('No pudimos procesar tu reserva. Intenta de nuevo o llámanos al 2451-1000.');
      return;
    }

    setSubmitted(true);
    setFieldErrors({});
    addReservation(formData);
    sumarPuntos(100);

    track(EVENTS.RESERVATION_SUBMIT, {
      guests: formData.guests,
      date:   formData.date,
      time:   formData.time,
      member: userSession.loggedIn,
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: userSession?.loggedIn ? userSession.name : '',
        phone: '',
        guests: '2',
        date: '',
        time: '',
        zona: 'salon',
        notes: ''
      });
    }, 5000);
  };

  const errorText = "text-[12px] text-brand-danger mt-1";

  return (
    <m.section
      id="book"
      className="section bg-brand-background border-t border-brand-border"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div className="lg:col-span-5 text-left space-y-10">
          <div className="space-y-5">
            <div className="eyebrow flex items-center gap-3">
              <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
              <span>Reserva</span>
            </div>
            <h2 className="h-section">
              Reservar una mesa.
            </h2>
            <p className="font-sans text-[15px] text-brand-textMain leading-relaxed max-w-reading">
              Confirmamos cada reserva por teléfono en menos de 24 horas. Para mesas mayores a 6 personas o eventos privados, contáctanos directamente.
            </p>
          </div>

          <ul className="space-y-6 border-t border-brand-border pt-6">
            <li className="flex items-start gap-4">
              <MapPinIcon size={18} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle">Dirección</p>
                <p>
                  <a
                    href="https://www.google.com/maps/place/Panna+%26+Pomodoro/@13.7229219,-89.7212373,17z/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[14px] text-brand-textMain hover:text-brand-primary transition-colors duration-base leading-relaxed"
                  >
                    Blvd Las Palmeras, CC El Arco<br />Sonsonate, El Salvador
                  </a>
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <PhoneIcon size={18} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle">Teléfono</p>
                <p>
                  <a href="tel:+50324511000" className="font-sans text-[14px] text-brand-textMain hover:text-brand-primary transition-colors duration-base tabular-nums">
                    2451-1000
                  </a>
                </p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <ClockIcon size={18} className="text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-brand-textSubtle">Horario de servicio</p>
                <p className="font-sans text-[14px] text-brand-textMain leading-relaxed tabular-nums">
                  Dom — Jue: 7:00 — 21:00<br />
                  Vie — Sáb: 7:00 — 22:00
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 w-full">
          <div className="border-t border-brand-border pt-10 lg:pt-12">
            {submitted ? (
              <div className="py-16 text-center space-y-6" role="status" aria-live="polite">
                <div className="w-14 h-14 border border-brand-success/60 mx-auto flex items-center justify-center bg-brand-success/10">
                  <span className="text-brand-success text-2xl" aria-hidden="true">✓</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-brand-accent font-light">
                  Solicitud enviada.
                </h3>
                <p className="text-[15px] text-brand-textMain max-w-md mx-auto leading-relaxed">
                  Gracias, <strong>{formData.name}</strong>. Recibimos tu solicitud para <strong>{formData.guests} personas</strong> el <strong>{formData.date}</strong> a las <strong>{formData.time}</strong> en <strong>{formData.zona === 'exterior' ? 'Zona Exterior' : 'Salón Interno'}</strong>. Te confirmamos por teléfono en breve.
                </p>
                {userSession?.loggedIn && (
                  <p className="text-[13px] text-brand-accent">
                    +100 puntos PANNA acreditados.
                  </p>
                )}
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 text-left" noValidate>
                <div className="space-y-3">
                  <h3 className="font-display font-light text-brand-textMain" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)' }}>
                    Cuéntanos cuándo vienes.
                  </h3>
                  <p className="text-[14px] text-brand-textSubtle leading-relaxed max-w-reading">
                    Te contactaremos por teléfono para confirmar tu reserva.
                  </p>
                </div>

                {userSession?.loggedIn && (
                  <p className="text-[13px] text-brand-textMain border-l-2 border-brand-primary pl-3">
                    Sesión activa como {userSession.name} · nivel {userSession.level}.
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="chef-name" className="block text-[13px] text-brand-textSubtle">
                      Nombre completo *
                    </label>
                    <input type="text" id="chef-name" required autoComplete="name" placeholder="Ej. Alejandro Valenzuela"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'chef-name-err' : undefined}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-line aria-[invalid=true]:border-brand-danger aria-[invalid=true]:focus:border-brand-danger"
                    />
                    {fieldErrors.name && <p id="chef-name-err" className={errorText}>{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="chef-phone" className="block text-[13px] text-brand-textSubtle">
                      Teléfono *
                    </label>
                    <input type="tel" id="chef-phone" required autoComplete="tel" inputMode="tel" placeholder="Ej. 7123-4567"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'chef-phone-err' : undefined}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-line aria-[invalid=true]:border-brand-danger aria-[invalid=true]:focus:border-brand-danger"
                    />
                    {fieldErrors.phone && <p id="chef-phone-err" className={errorText}>{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="chef-guests" className="block text-[13px] text-brand-textSubtle">
                      Comensales
                    </label>
                    <select id="chef-guests" value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="input-boxed"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                      ))}
                      <option value="12+">12+ personas</option>
                    </select>
                  </div>

                  {formData.guests === '12+' && (
                    <div className="md:col-span-3 -mt-4 mb-2 flex items-start gap-3 border border-brand-border bg-brand-surface px-4 py-3 text-[13px] text-brand-textMain" role="note">
                      <PhoneIcon size={16} className="text-brand-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <p className="leading-relaxed">
                        Para grupos de más de 12 personas, contáctanos directamente por WhatsApp y te ayudamos a coordinar una experiencia a la medida.
                        {' '}
                        <a
                          href="https://wa.me/50324511000?text=Hola%2C%20quiero%20reservar%20para%2012%20o%20m%C3%A1s%20personas.%20%C2%BFMe%20pueden%20ayudar%3F"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background rounded-sm"
                        >
                          Escríbenos al 2451-1000
                        </a>.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="chef-date" className="block text-[13px] text-brand-textSubtle">
                      Fecha *
                    </label>
                    <input type="date" id="chef-date" required min={today}
                      aria-required="true"
                      aria-invalid={!!fieldErrors.date}
                      aria-describedby={fieldErrors.date ? 'chef-date-err' : undefined}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-line aria-[invalid=true]:border-brand-danger aria-[invalid=true]:focus:border-brand-danger"
                    />
                    {fieldErrors.date && <p id="chef-date-err" className={errorText}>{fieldErrors.date}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="chef-time" className="block text-[13px] text-brand-textSubtle">
                      Hora *
                    </label>
                    <input type="time" id="chef-time" required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.time}
                      aria-describedby={fieldErrors.time ? 'chef-time-err' : undefined}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="input-line aria-[invalid=true]:border-brand-danger aria-[invalid=true]:focus:border-brand-danger"
                    />
                    {fieldErrors.time && <p id="chef-time-err" className={errorText}>{fieldErrors.time}</p>}
                  </div>
                </div>

                <fieldset className="space-y-3 border-0 p-0 m-0">
                  <legend className="block text-[13px] text-brand-textSubtle">
                    Preferencia de zona
                  </legend>
                  <div role="radiogroup" aria-label="Preferencia de zona" className="flex flex-col sm:flex-row gap-3 pt-1">
                    {[
                      { value: 'salon',    label: 'Salón interno' },
                      { value: 'exterior', label: 'Zona exterior' },
                    ].map(({ value, label }) => {
                      const selected = formData.zona === value;
                      return (
                        <label
                          key={value}
                          className={`flex-1 min-h-[48px] py-3 px-4 text-[14px] border cursor-pointer transition-colors duration-base flex items-center justify-center gap-2 ${
                            selected
                              ? 'border-brand-primary bg-brand-primary/5 text-brand-textMain'
                              : 'border-brand-border text-brand-textMain hover:border-brand-primary/60'
                          }`}
                        >
                          <input
                            type="radio"
                            name="chef-zona"
                            value={value}
                            checked={selected}
                            onChange={() => setFormData({ ...formData, zona: value })}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`w-3.5 h-3.5 rounded-full border-2 inline-block shrink-0 ${
                              selected ? 'border-brand-primary bg-brand-primary' : 'border-brand-border'
                            }`}
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <label htmlFor="chef-notes" className="block text-[13px] text-brand-textSubtle">
                    Notas especiales o alergias
                  </label>
                  <textarea
                    id="chef-notes"
                    rows={3}
                    placeholder="Alergias, celebración o solicitud especial"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-line resize-y min-h-[96px]"
                    maxLength={500}
                  />
                  <p className="text-[11px] text-brand-textSubtle">Opcional. Máximo 500 caracteres.</p>
                </div>

                <div className="pt-4 space-y-3">
                  {submitError && (
                    <p role="alert" className="text-[13px] text-brand-danger border border-brand-danger/40 bg-brand-dangerBg px-3 py-2.5 flex items-start gap-2">
                      <AlertTriangleIcon size={14} className="text-brand-danger mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{submitError}</span>
                    </p>
                  )}
                  <p className="text-[12px] text-brand-textSubtle">
                    {formData.guests === '12+'
                      ? 'Te redirigiremos a WhatsApp para coordinar tu reserva con el equipo.'
                      : 'Te contactaremos por teléfono para confirmar tu reserva.'}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed gap-2"
                  >
                    {submitting
                      ? <><Spinner /> Enviando solicitud…</>
                      : formData.guests === '12+'
                        ? 'Solicitar por WhatsApp'
                        : 'Confirmar solicitud'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </m.section>
  );
}