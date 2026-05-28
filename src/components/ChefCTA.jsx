import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import chefPlating from '../assets/chef_plating.webp';
import { PhoneIcon, MapPinIcon, ClockIcon } from './Icons';
import { useSessionStore } from '../stores/useSessionStore';
import { track, EVENTS } from '../analytics';
import { supabase } from '../lib/supabase';
import { reveal } from '../motion/variants';

export default function ChefCTA() {
  const userSession    = useSessionStore((state) => state);
  const addReservation = useSessionStore((state) => state.addReservationLocal);
  const sumarPuntos    = useSessionStore((state) => state.sumarPuntos);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    zona: 'salon',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (userSession?.loggedIn) {
      setFormData((prev) => ({ ...prev, name: userSession.name }));
    } else {
      setFormData((prev) => ({ ...prev, name: '' }));
    }
  }, [userSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      setSubmitError('Por favor complete nombre, teléfono, fecha y hora para su reserva.');
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
    addReservation(formData);
    sumarPuntos(100); // 100 puntos por reservación


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

  return (
    <m.section
      id="book"
      className="relative w-full py-14 md:py-20 px-6 md:px-16 overflow-hidden bg-brand-background flex flex-col items-center justify-center"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      
      {/* Background image with dramatic cinematic vignette overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={chefPlating}
          alt="Chef Plating Fine Culinary Art"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-20 filter contrast-[1.1] brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-radial-vignette from-transparent via-black/60 to-brand-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-background via-transparent to-brand-background" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Grid: Info + Luxury Form (Two Columns) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left: Dramatic Details & Contact Info (col-span-5) */}
        <div className="lg:col-span-5 text-left space-y-10">
          <div className="space-y-3">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block font-semibold">
              Reserva tu Mesa
            </span>
            <h2 className="font-display text-brand-textMain font-light tracking-[0.02em]">
              Vive la Experiencia <br />
              <span className="italic font-normal text-brand-primary">Panna & Pomodoro</span>
            </h2>
            <div className="w-16 h-[1px] bg-brand-primary/30 mt-3" />
          </div>

          <p className="font-body text-brand-textMuted leading-relaxed font-light">
            Asegura tu lugar en nuestro exclusivo salón. Para mesas mayores a 6 personas o eventos privados, por favor contáctanos directamente por teléfono.
          </p>

          {/* Luxury Vertical Contact Details */}
          <div className="space-y-6 pt-4 text-[12px] font-body tracking-[0.18em] text-brand-textMuted uppercase">
            
            <div className="flex items-start space-x-4 group">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-brand-surface/40 group-hover:border-brand-primary/40 transition-all duration-500">
                <MapPinIcon size={16} className="text-brand-primary/80" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-brand-textMain font-semibold block text-[11px] tracking-widest">DIRECCIÓN</span>
                {/* ✏️ EDITABLE: link de Google Maps — reemplaza con el del local */}
                <a
                  href="https://www.google.com/maps/place/Panna+%26+Pomodoro/@13.7229219,-89.7212373,17z/data=!4m14!1m7!3m6!1s0x8f62b7f35601a705:0x2652f9f63206f77b!2sPanna+%26+Pomodoro!8m2!3d13.7229193!4d-89.7190504!16s%2Fg%2F11f4105vb3!3m5!1s0x8f62b7f35601a705:0x2652f9f63206f77b!8m2!3d13.7229193!4d-89.7190504!16s%2Fg%2F11f4105vb3?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors duration-300 normal-case not-italic leading-relaxed block text-[14px] font-body text-brand-textMuted font-light"
                >
                  {/* ✏️ EDITABLE: dirección física */}
                  Blvd Las Palmeras, CC El Arco<br />Sonsonate, El Salvador
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-brand-surface/40 group-hover:border-brand-primary/40 transition-all duration-500">
                <PhoneIcon size={16} className="text-brand-primary/80" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-brand-textMain font-semibold block text-[11px] tracking-widest">TELÉFONO</span>
                {/* ✏️ EDITABLE: teléfono (formato +503XXXXXXXX) — cambia también en Footer.jsx */}
                <a
                  href="tel:+50324511000"
                  className="hover:text-brand-primary transition-colors duration-300 leading-relaxed block font-light text-[14px] tracking-wider text-brand-textMuted"
                >
                  2451-1000
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-[#0d0d0d] bg-brand-surface/40 group-hover:border-brand-primary/40 transition-all duration-500">
                <ClockIcon size={16} className="text-brand-primary/80" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-brand-textMain font-semibold block text-[11px] tracking-widest">SERVICIO</span>
                <p className="normal-case leading-relaxed font-light text-[14px] tracking-wider text-brand-textMuted">
                  {/* ✏️ EDITABLE: horarios del salón (también en Hero.jsx) */}
                  Dom &mdash; Jue: 7:00 &mdash; 21:00<br />
                  Vie &mdash; Sáb: 7:00 &mdash; 22:00
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Editorial Minimal Form Card (col-span-7) */}
        <div className="lg:col-span-7 w-full">
          <div className="glass-card p-8 md:p-12 rounded-[2px] shadow-2xl relative">
            {/* Fine gold frame edge */}
            <div className="absolute top-4 bottom-4 left-4 right-4 border border-brand-primary/5 pointer-events-none rounded-[1px]" />
            
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-brand-primary/40 mx-auto flex items-center justify-center bg-brand-primary/10">
                  <span className="text-brand-primary text-2xl font-light">&check;</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-brand-primary font-light tracking-wide uppercase">
                  Solicitud Enviada
                </h3>
                <p className="font-body text-xs text-brand-textMuted max-w-sm mx-auto leading-relaxed">
                  Gracias, <strong>{formData.name}</strong>. Hemos recibido tu solicitud para <strong>{formData.guests} personas</strong> el <strong>{formData.date}</strong> a las <strong>{formData.time}</strong> en <strong>{formData.zona === 'exterior' ? 'Zona Exterior' : 'Salón Interno'}</strong>. Te confirmaremos vía telefónica en breve.
                </p>
                {userSession?.loggedIn && (
                  <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/25 px-5 py-2.5 rounded-full">
                    <span className="text-brand-primary text-sm font-bold">+100</span>
                    <span className="font-body text-[11px] tracking-[0.2em] uppercase text-brand-primary font-semibold">
                      puntos PANNA acreditados
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10 text-left">
                <div className="text-center md:text-left space-y-2 mb-8">
                  <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold">
                    Reserva en Línea
                  </span>
                  <h3 className="font-display text-2xl text-brand-textMain font-light uppercase tracking-[0.05em]">
                    Formulario Gastronómico
                  </h3>
                  <div className="w-12 h-[1px] bg-brand-primary/20 mt-2" />
                </div>

                {userSession?.loggedIn && (
                  <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-[2px] flex items-center space-x-2 text-[12px] font-body tracking-wider text-brand-primary uppercase font-semibold text-left">
                    <span className="animate-pulse">●</span>
                    <span>Socio Activo: {userSession.name} ({userSession.level}) &bull; Reserva digital enlazada</span>
                  </div>
                )}

                {/* Line Input 1: Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="Ej. Alejandro Valenzuela"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="Ej. 7123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/20"
                    />
                  </div>
                </div>

                {/* Row Grid: Guests, Date, Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Guests Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="guests" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                      Comensales
                    </label>
                    <select
                      id="guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-[#0d0d0d] border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light"
                    >
                      <option value="1">1 Persona</option>
                      <option value="2">2 Personas</option>
                      <option value="3">3 Personas</option>
                      <option value="4">4 Personas</option>
                      <option value="5">5 Personas</option>
                      <option value="6">6 Personas</option>
                    </select>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                      Fecha de Reserva *
                    </label>
                    <input
                      type="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light"
                    />
                  </div>

                  {/* Time Input */}
                  <div className="space-y-2">
                    <label htmlFor="time" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                      Hora *
                    </label>
                    <input
                      type="time"
                      id="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light"
                    />
                  </div>
                </div>

                {/* Zona */}
                <div className="space-y-2">
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                    Preferencia de Zona
                  </label>
                  <div className="flex gap-3 pt-1">
                    {[
                      { value: 'salon', label: 'Salón Interno' },
                      { value: 'exterior', label: 'Zona Exterior' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, zona: value })}
                        className={`flex-1 py-2 font-body text-[11px] tracking-[0.2em] uppercase font-bold border transition-all duration-300 rounded-full ${
                          formData.zona === value
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-white/10 text-brand-textMuted hover:border-brand-primary/40'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block font-body text-[11px] tracking-[0.2em] uppercase font-bold text-brand-textMain">
                    Notas Especiales o Alergias
                  </label>
                  <input
                    type="text"
                    id="notes"
                    placeholder="Alergia a frutos secos, celebración de aniversario, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 hover:border-brand-primary/50 focus:border-brand-primary text-brand-textMain font-body text-xs py-2 px-1 focus:outline-none transition-colors duration-500 font-light placeholder-white/20"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-6 space-y-3">
                  {submitError && (
                    <p className="text-red-400 text-[12px] font-body tracking-wider text-center">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-brand-primary text-black hover:bg-[#ab8b5f] font-body tracking-[0.25em] text-xs uppercase font-bold transition-all duration-500 rounded-full shadow-lg hover:shadow-brand-primary/20 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {submitting ? 'Enviando...' : 'Confirmar Solicitud de Reserva'}
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
