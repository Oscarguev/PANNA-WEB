import React, { useState } from 'react';
import { StarIcon, SparklesIcon, TagIcon } from './Icons';
import { useSessionStore } from '../stores/useSessionStore';
import { useUIStore } from '../stores/useUIStore';

export default function Loyalty() {
  const userSession = useSessionStore((state) => state);
  const openPortal  = useUIStore((state) => state.openPortal);
  const [activeTierInfo, setActiveTierInfo] = useState('sprout'); // seed, sprout, forest

  // Demo user data if not logged in
  const displayUser = userSession?.loggedIn ? userSession : {
    name: 'Alejandro Valenzuela',
    points: 780,
    level: 'Sprout',
    walletBalance: 45.00,
    cardNumber: 'PANNA-MEMBER-9812',
    loggedIn: false
  };

  const tiers = {
    seed: {
      name: "Seed (Semilla)",
      range: "0 &mdash; 499 Puntos",
      perks: [
        "Café espresso gratis en tu cumpleaños.",
        "Prioridad de reserva en nuestra terraza íntima.",
        "Acceso preferente a catas secretas."
      ]
    },
    sprout: {
      name: "Sprout (Brote)",
      range: "500 &mdash; 1499 Puntos",
      perks: [
        "Todos los beneficios de Seed.",
        "10% de descuento automático en granos de café de especialidad.",
        "Bebida de cortesía mensual (Cold brew o Filtrado)."
      ]
    },
    forest: {
      name: "Forest (Bosque)",
      range: "1500+ Puntos",
      perks: [
        "Todos los beneficios de Sprout.",
        "Invitación VIP a la mesa privada del Chef sin costo.",
        "Sourcing privado: degustaciones exclusivas de microlotes exóticos antes de salir al mercado."
      ]
    }
  };

  // Progress Bar percentage calculation
  const getProgressWidth = () => {
    const pts = displayUser.points;
    if (pts < 500) return `${(pts / 500) * 100 * 0.33}%`; // Seed range
    if (pts < 1500) return `${33 + ((pts - 500) / 1000) * 100 * 0.33}%`; // Sprout range
    return `${66 + Math.min(34, ((pts - 1500) / 2000) * 100 * 0.34)}%`; // Forest range
  };

  const [simulatedLoad, setSimulatedLoad] = useState(false);

  const handleSimulatedLoad = () => {
    setSimulatedLoad(true);
    setTimeout(() => {
      setSimulatedLoad(false);
      alert("Simulación: Saldo recargado exitosamente en tu tarjeta digital.");
    }, 1500);
  };

  return (
    <section id="loyalty" className="bg-[#050505] py-14 md:py-20 px-6 md:px-16 relative overflow-hidden border-t border-white/[0.02]">
      {/* Absolute luxury highlights */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none select-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-primary block font-semibold">
            Fidelización & Privilegios
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-brand-textMain font-light tracking-[0.05em] uppercase">
            PANNA Rewards Club
          </h2>
          <p className="font-body text-xs text-brand-textMuted max-w-md mx-auto font-light leading-relaxed">
            Acumula 10 puntos por cada $1 gastado. Desbloquea experiencias y privilegios exclusivos.
          </p>
        </div>

        {/* Core Layout: Wallet Card vs Tiers Details (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Starbucks-like Virtual Wallet Card (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
            
            {/* Virtual Card Glassmorphic Frame */}
            <div className="relative w-full max-w-[360px] aspect-[1.58/1] rounded-[8px] bg-gradient-to-br from-brand-surface/85 to-brand-surfaceMuted/95 p-6 border border-white/10 shadow-2xl relative overflow-hidden group select-none">
              
              {/* Luxury gold glowing line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />
              
              <div className="flex flex-col justify-between h-full relative z-10 text-left">
                {/* Upper row: Brand Logo & Tier Tag */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="font-display text-[11px] tracking-[0.2em] text-brand-textMain uppercase block">PANNA REWARDS</span>
                    <span className="font-body text-[11px] tracking-[0.3em] text-brand-primary uppercase font-bold block">P&P PLATFORM</span>
                  </div>
                  
                  {/* Tier Badge */}
                  <span className="font-body text-[11px] tracking-[0.2em] text-brand-primary border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-1 rounded-full font-bold uppercase">
                    {displayUser.level}
                  </span>
                </div>

                {/* Middle row: Card Chip & Points Balance */}
                <div className="flex justify-between items-center py-2">
                  {/* Micro chip icon */}
                  <div className="w-8 h-6 bg-[#252525] rounded-[4px] border border-white/10 relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-[1px] bg-white/10 absolute top-1/2" />
                    <div className="w-[1px] h-full bg-white/10 absolute left-1/2" />
                  </div>

                  {/* Points display */}
                  <div className="text-right">
                    <span className="text-[11px] font-body tracking-[0.2em] text-brand-textMuted uppercase block">SALDO DE PUNTOS</span>
                    <span className="font-display italic text-2xl text-brand-textMain font-light">{displayUser.points} <span className="text-xs text-brand-primary uppercase not-italic font-semibold tracking-wider">PTS</span></span>
                  </div>
                </div>

                {/* Bottom row: Card Number & Holder Name */}
                <div className="flex justify-between items-end pt-2 border-t border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-body tracking-wider text-brand-textMuted uppercase block">Socio</span>
                    <span className="font-display text-sm text-brand-textMain font-light tracking-wide">{displayUser.name}</span>
                  </div>
                  <span className="font-body text-[11px] tracking-wider text-brand-textMuted/65 font-light">
                    {displayUser.cardNumber}
                  </span>
                </div>
              </div>

              {/* Glass subtle light effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-[2000ms] ease-high-end" />
            </div>

            {/* QR Card Scannable widget for box */}
            <div className="w-full max-w-[360px] bg-brand-surface/40 border border-white/[0.04] p-5 rounded-[4px] space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-[11px] font-body tracking-[0.25em] text-brand-primary uppercase font-bold block">Digital QR Scan</span>
                <span className="text-[11px] font-body text-brand-textMuted font-light block">Escanea en caja para acumular y pagar</span>
              </div>

              {/* Minimal aesthetic QR placeholder */}
              <div className="w-24 h-24 bg-white p-2 rounded-[2px] mx-auto relative flex items-center justify-center shadow-lg group">
                {/* Simulated QR Code Blocks */}
                <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-90">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-transparent" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-transparent" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-transparent" /><div className="bg-black" /><div className="bg-black" /><div className="bg-transparent" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-transparent" /><div className="bg-black" />
                </div>
                {/* Central brand mark logo */}
                <div className="absolute w-5 h-5 bg-[#050505] border border-white/10 rounded-[1px] flex items-center justify-center z-10 shadow-lg">
                  <span className="font-display text-[11px] text-brand-primary uppercase font-bold leading-none">P&P</span>
                </div>
              </div>

              {/* Simulated load points */}
              {!userSession?.loggedIn ? (
                <button
                  onClick={openPortal}
                  className="w-full py-2.5 border border-brand-primary/45 text-brand-primary hover:bg-brand-primary hover:text-black font-body tracking-[0.2em] text-[11px] uppercase transition-all duration-500 rounded-full font-bold bg-transparent"
                >
                  Iniciar Sesión para Activar
                </button>
              ) : (
                <button
                  onClick={handleSimulatedLoad}
                  disabled={simulatedLoad}
                  className="w-full py-2.5 border border-brand-primary/45 text-brand-primary hover:bg-brand-primary hover:text-black font-body tracking-[0.2em] text-[11px] uppercase transition-all duration-500 rounded-full font-bold bg-transparent"
                >
                  {simulatedLoad ? 'Cargando Saldo...' : 'Cargar Saldo Virtual'}
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Tiers Information accordion & progress (col-span-7) */}
          <div className="lg:col-span-7 text-left space-y-6">

            {/* Dynamic Status Progress Bar */}
            <div className="space-y-3 bg-brand-surface/20 border border-white/[0.02] p-4 rounded-[2px] shadow-xl relative">
              <div className="flex justify-between items-center text-[11px] font-body tracking-wider text-brand-textMuted uppercase font-bold">
                <span>Tu Nivel: <strong className="text-brand-primary font-bold">{displayUser.level}</strong></span>
                <span>{displayUser.points} / 1500 PTS</span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-1.5 bg-[#141414] rounded-full overflow-hidden w-full relative">
                <div
                  style={{ width: getProgressWidth() }}
                  className="h-full bg-gradient-to-r from-brand-accent to-brand-primary transition-all duration-1000 ease-high-end rounded-full"
                />
              </div>

              {/* Grid indices */}
              <div className="grid grid-cols-3 text-center text-[11px] font-body tracking-[0.2em] text-brand-textMuted uppercase pt-1">
                <div className="text-left font-semibold">Seed (0 pt)</div>
                <div className="text-center font-semibold">Sprout (500 pts)</div>
                <div className="text-right font-semibold">Forest (1500 pts)</div>
              </div>
            </div>

            {/* Accordion selector of Tiers */}
            <div className="space-y-4">
              <span className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold block">
                Privilegios por Niveles
              </span>

              {/* Tier accordion tabs */}
              <div className="space-y-3">
                {Object.entries(tiers).map(([key, data]) => {
                  const isActive = activeTierInfo === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setActiveTierInfo(key)}
                      className={`border border-white/5 rounded-[2px] transition-all duration-500 cursor-pointer overflow-hidden text-left ${
                        isActive ? 'bg-brand-surface/50 border-brand-primary/25 shadow-xl' : 'bg-brand-surface/20 hover:bg-brand-surface/30'
                      }`}
                    >
                      <div className="p-3 md:p-4 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-display text-base text-brand-textMain font-light">
                            {data.name}
                          </h4>
                          <span
                            className="font-body text-[11px] tracking-widest text-brand-primary uppercase font-bold block"
                            dangerouslySetInnerHTML={{ __html: data.range }}
                          />
                        </div>
                        <div className="text-brand-primary text-xs">
                          {isActive ? '▲' : '▼'}
                        </div>
                      </div>

                      {/* Perks list */}
                      <div
                        className={`transition-all duration-700 ease-high-end ${
                          isActive ? 'max-h-[300px] border-t border-white/5 p-5 bg-[#0a0a0a]' : 'max-h-0 pointer-events-none'
                        }`}
                      >
                        <ul className="space-y-3.5">
                          {data.perks.map((prk, i) => (
                            <li key={i} className="flex items-start space-x-3 text-[14px] text-brand-textMuted font-light leading-relaxed">
                              <StarIcon size={13} className="text-brand-primary/60 mt-1" />
                              <span>{prk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
