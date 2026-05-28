import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import logo from '../assets/logo.png';
import { InstagramIcon, FacebookIcon, WhatsAppIcon, TikTokIcon, MapPinIcon } from './Icons';
import { reveal } from '../motion/variants';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/[0.03] pt-20 pb-12 px-6 md:px-16 text-left">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Three Columns Grid — single reveal, no stagger */}
        <m.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >

          {/* Column 1: Panna & Pomodoro Identity */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Panna & Pomodoro Logo"
                className="h-8 w-8 object-contain filter brightness-110 mix-blend-screen"
              />
              <div className="space-y-0.5">
                <span className="font-brand text-[14px] tracking-[0.1em] uppercase text-brand-textMain font-normal">
                  PANNA &amp; POMODORO
                </span>
                <span className="font-body text-[11px] tracking-[0.3em] text-brand-primary uppercase font-semibold block pt-0.5">
                  ARTESANAL Y FRESCO
                </span>
              </div>
            </div>

            <p className="font-body text-small text-brand-textMuted leading-relaxed font-light max-w-sm">
              Una experiencia íntima inspirada en la tradición gastronómica italiana. Elevamos ingredientes selectos de la huerta y pan de masa madre horneado a mano diariamente en Sonsonate.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {/* TODO: actualizar con handle real */}
              {/* ✏️ EDITABLE: redes sociales — cambia el href con tu handle real */}
              <a href="https://instagram.com/pannapomodoro.sv" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-brand-primary flex items-center justify-center text-brand-textMuted hover:text-brand-primary bg-brand-surface/40 transition-all duration-300"
                aria-label="Instagram">
                <InstagramIcon size={14} />
              </a>
              <a href="https://facebook.com/pannapomodoro" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-brand-primary flex items-center justify-center text-brand-textMuted hover:text-brand-primary bg-brand-surface/40 transition-all duration-300"
                aria-label="Facebook">
                <FacebookIcon size={14} />
              </a>
              {/* TODO: actualizar con handle real de TikTok */}
              <a href="https://tiktok.com/@pannapomodoro" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-brand-primary flex items-center justify-center text-brand-textMuted hover:text-brand-primary bg-brand-surface/40 transition-all duration-300"
                aria-label="TikTok">
                <TikTokIcon size={14} />
              </a>
              <a href="https://wa.me/50324511000" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-[#25D366] flex items-center justify-center text-brand-textMuted hover:text-[#25D366] bg-brand-surface/40 transition-all duration-300"
                aria-label="WhatsApp">
                <WhatsAppIcon size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Ubicación & Contacto */}
          <div className="space-y-6">
            <h4 className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold border-b border-white/5 pb-2">
              Ubicación &amp; Contacto
            </h4>
            <div className="space-y-4 text-small font-body text-brand-textMuted leading-relaxed font-light">
              <div className="space-y-1">
                <span className="font-body text-brand-textMain font-medium block text-[11px] tracking-wider uppercase">DIRECCIÓN</span>
                <a
                  href="https://www.google.com/maps/place/Panna+%26+Pomodoro/@13.7229219,-89.7212373,17z/data=!4m14!1m7!3m6!1s0x8f62b7f35601a705:0x2652f9f63206f77b!2sPanna+%26+Pomodoro!8m2!3d13.7229193!4d-89.7190504!16s%2Fg%2F11f4105vb3!3m5!1s0x8f62b7f35601a705:0x2652f9f63206f77b!8m2!3d13.7229193!4d-89.7190504!16s%2Fg%2F11f4105vb3?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-all duration-300 flex items-start gap-2 text-[14px] font-body text-brand-textMuted leading-relaxed font-light"
                >
                  <MapPinIcon size={14} className="mt-1 shrink-0 text-brand-primary/60" />
                  {/* ✏️ EDITABLE: dirección (también en ChefCTA.jsx) */}
                  <span>Blvd Las Palmeras, CC El Arco<br />Sonsonate, El Salvador</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="font-body text-brand-textMain font-medium block text-[11px] tracking-wider uppercase">TELÉFONO</span>
                {/* ✏️ EDITABLE: teléfono — cambia también en ChefCTA.jsx */}
                <a
                  href="tel:+50324511000"
                  className="hover:text-brand-primary transition-all duration-300 text-[14px] font-body text-brand-textMuted leading-relaxed font-light tracking-wider"
                >
                  2451-1000
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Horarios & Reservas */}
          <div className="space-y-6">
            <h4 className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold border-b border-white/5 pb-2">
              Horarios &amp; Reservas
            </h4>
            <div className="space-y-4 text-small font-body text-brand-textMuted leading-relaxed font-light">
              <div className="space-y-1">
                <span className="font-body text-brand-textMain font-medium block text-[11px] tracking-wider uppercase">SALÓN PRINCIPAL</span>
                {/* ✏️ EDITABLE: horarios (también en Hero.jsx y ChefCTA.jsx) */}
                <p>Dom &mdash; Jue: 7:00 &mdash; 21:00</p>
                <p>Vie &mdash; Sáb: 7:00 &mdash; 22:00</p>
              </div>

              <div className="space-y-1">
                <span className="font-body text-brand-textMain font-medium block text-[11px] tracking-wider uppercase">POLÍTICA</span>
                <p className="pr-4">
                  Reservaciones en línea disponibles hasta con 2 horas de anticipación.
                </p>
              </div>
            </div>
          </div>

        </m.div>

        {/* Lower copyright bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] font-body tracking-[0.2em] uppercase text-brand-textMuted/45">
          <div className="text-center md:text-left">
            {/* ✏️ EDITABLE: año de copyright */}
            Panna &amp; Pomodoro Group &copy; 2026. Todos los derechos reservados.
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terminos"   className="hover:text-brand-primary transition-all duration-300">Términos de Uso</Link>
            <span className="text-white/5">|</span>
            <Link to="/privacidad" className="hover:text-brand-primary transition-all duration-300">Políticas de Privacidad</Link>
            <span className="text-white/5">|</span>
            <Link to="/cookies"    className="hover:text-brand-primary transition-all duration-300">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
