/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Paleta digital Panna & Pomodoro
          // 75-80% neutros / 15-18% ink-charcoal / 5-7% rojo / 2-4% verde
          // Tonos cálidos (cacao/ámbar sutil) en títulos y dark sections.
          // Fondo crema intacto: #F4F0E8.
          background:   '#F4F0E8',           // canvas principal cálido neutro
          surface:      '#FAF8F3',           // surface elevado (tarjetas, drawers)
          surfaceMuted: '#EFEADF',
          textMain:     '#2A2520',           // ink warm — antes #1E1E1E
          textSubtle:   '#3A342C',           // charcoal warm — antes #353535
          textMuted:    '#6B655C',           // gris medio cálido — antes #6B6B6B
          border:       '#D5CDBF',           // line - separador cálido
          borderStrong: '#E6DFD3',           // stone - borde más visible
          placeholder:  '#A8A096',
          // Acento rojo (5-7% uso) - SOLO acentos
          primary:      '#E1261C',           // rojo digital (CTA filled + decorativo)
          primaryHover: '#B91E17',           // hover CTA
          cta:          '#E1261C',           // alias CTA filled
          ctaHover:     '#B91E17',
          accent:       '#E1261C',           // texto destacado puntual
          accentSoft:   '#B91E17',
          // Acento verde (2-4% uso) - SOLO contextos café/origen/disponibilidad
          success:      '#106D2E',           // verde oscuro AA (5.0:1 sobre canvas)
          successSoft:  '#168A3B',           // verde base - solo decorativo
          successBg:    '#EAF2EC',
          // Estado
          danger:       '#B91E17',           // rojo oscuro errores
          dangerBg:     '#FBE9E7',
          warning:      '#B58A2E',
          warningBg:    '#FAF3E0',
          // Dark mode surfaces (no afectado por manual)
          backgroundDark: '#0a0a0a',
          surfaceDark:    '#171717',
          borderOnDark:   'rgba(244, 240, 232, 0.10)',
          borderOnDarkStrong: 'rgba(244, 240, 232, 0.20)',
          whatsapp: '#25D366',               // KEEP - WhatsApp brand identity
          ink: '#2A2520',                    // alias textMain cálido
          charcoal: '#3A342C',               // alias textSubtle cálido
          canvas: '#F4F0E8',
          stone: '#E6DFD3',
          paper: '#F4F0E8',
        }
      },
      fontFamily: {
        // Cuerpo y UI — Outfit (sustituto libre de Nexa, manual de marca §tipografía).
        // Si en algún momento se licencia Nexa, basta cambiar la primera entrada del stack.
        sans:    ['Outfit', 'Nexa', 'system-ui', '-apple-system', 'sans-serif'],
        // Display editorial — Fraunces. Conserva calidez italiana sin imitar el isologo.
        display: ['"Fraunces"', 'Georgia', 'serif'],
        // Eyebrows / categorías / numeración / microetiquetas.
        // Sistema unificado Outfit (uppercase + tracking + tamaño) para evitar inconsistencias
        // entre el sans del cuerpo y un sistema de microetiquetas separado.
        eyebrow: ['Outfit', 'sans-serif'],
        // Manual de marca §tipografía corporativa — Bebas Neue para el wordmark
        // "Panna & Pomodoro" (la firma del isologo, no se sustituye).
        wordmark: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'hero-desktop': ['4rem', { lineHeight: '1.05' }],
        'hero-mobile':  ['2.5rem', { lineHeight: '1.1' }],
        'h2-desktop':   ['2.25rem', { lineHeight: '1.2' }],
        'h2-mobile':    ['1.625rem', { lineHeight: '1.25' }],
        'h3-desktop':   ['1.375rem', { lineHeight: '1.35' }],
        'h3-mobile':    ['1.125rem', { lineHeight: '1.35' }],
        'body-desktop': ['1.0625rem', { lineHeight: '1.6' }],
        'body-mobile':  ['1rem', { lineHeight: '1.5' }],
        'small':        ['0.8125rem', { lineHeight: '1.45' }],
        'eyebrow':      ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.06em' }],
      },
      maxWidth: {
        'reading': '62ch',
      },
      transitionTimingFunction: {
        'high-end': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        'fast':   '150ms',
        'base':   '250ms',
        'slow':   '450ms',
      },
      letterSpacing: {
        'luxury':      '0.04em',
        'luxury-wide': '0.08em',
        'normal':      '0',
        'tighter':     '-0.02em',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'spin-slow': 'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}