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
          background: '#050505',     // Deep Cinematic Black
          surface: '#0d0d0d',        // Premium Dark Charcoal
          surfaceMuted: '#141414',   // Elegant Gray-Black for cards
          primary: '#c5a880',        // Warm Brushed Gold
          accent: '#9a7f56',         // Deep Antique Gold
          textMain: '#f5f5f3',       // Soft Warm Off-White / Ivory
          textMuted: '#9e9e9a',      // Warm Stone Gray
        }
      },
      fontFamily: {
        brand: ['var(--font-family-brand)', 'serif'],
        display: ['var(--font-family-display)', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'hero-desktop': ['4rem', { lineHeight: '1.1' }],
        'hero-mobile': ['2.5rem', { lineHeight: '1.1' }],
        'h2-desktop': ['2.5rem', { lineHeight: '1.2' }],
        'h2-mobile': ['1.75rem', { lineHeight: '1.2' }],
        'h3-desktop': ['1.5rem', { lineHeight: '1.3' }],
        'h3-mobile': ['1.25rem', { lineHeight: '1.3' }],
        'body-desktop': ['1.125rem', { lineHeight: '1.6' }], // 1.6 de interlineado premium
        'body-mobile': ['1rem', { lineHeight: '1.5' }],
        'small': ['0.875rem', { lineHeight: '1.4' }],
        'eyebrow-desktop': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.3em' }],
        'eyebrow-mobile': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.3em' }],
      },
      maxWidth: {
        'reading': '68ch', // El límite exacto para no cansar la vista en desktop
      },
      transitionTimingFunction: {
        'high-end': 'cubic-bezier(0.2, 0, 0, 1)',
      },
      letterSpacing: {
        'luxury': '0.25em',
        'luxury-wide': '0.4em',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}