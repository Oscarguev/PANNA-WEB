import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: '¿Qué son las cookies?',
    body: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus preferencias y mejore su experiencia de navegación.',
  },
  {
    title: 'Cookies esenciales',
    body: 'Utilizamos cookies técnicas estrictamente necesarias para el funcionamiento del sitio, como el mantenimiento de su sesión de usuario (Club PANNA) y el estado del carrito de compras. Estas cookies no pueden desactivarse.',
  },
  {
    title: 'Cookies de preferencias',
    body: 'Almacenamos sus preferencias de navegación de forma local en su dispositivo (localStorage) para recordar datos como su sesión de miembro o los artículos en su carrito entre visitas. No se transmiten a servidores externos.',
  },
  {
    title: 'Cookies de análisis',
    body: 'Podemos utilizar herramientas de análisis para entender cómo los usuarios interactúan con nuestro sitio y así mejorar su contenido. Los datos recopilados son anónimos y agregados; no permiten identificar a usuarios individuales.',
  },
  {
    title: 'Cookies de terceros',
    body: 'Algunos servicios integrados, como mapas de Google o fuentes tipográficas externas, pueden establecer sus propias cookies. Panna & Pomodoro no tiene control sobre estas cookies y le recomendamos revisar las políticas de privacidad de dichos servicios.',
  },
  {
    title: 'Control de cookies',
    body: 'Puede configurar su navegador para bloquear o eliminar cookies en cualquier momento. Sin embargo, deshabilitar las cookies esenciales puede afectar el funcionamiento del sitio, incluyendo el carrito y el inicio de sesión de miembro.',
  },
]

export default function CookiesPage() {
  return (
    <main id="main" className="min-h-screen bg-brand-background pt-36 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-16">

        <header className="space-y-4">
          <div className="flex items-center gap-3 text-[12px] text-brand-textSubtle">
            <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
            <span>Legal · Última actualización, mayo de 2026</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-brand-textMain font-light leading-tight tracking-tighter">
            Política de Cookies
          </h1>
          <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading pt-2">
            Este sitio usa cookies de forma mínima y transparente para ofrecerle la mejor experiencia posible.
          </p>
        </header>

        <ol className="space-y-12 border-t border-brand-border pt-12">
          {SECTIONS.map((s, i) => (
            <li key={s.title} className="space-y-3">
              <span className="text-[12px] text-brand-textSubtle tabular-nums">
                0{i + 1}
              </span>
              <h2 className="font-display text-2xl text-brand-textMain font-normal leading-snug">
                {s.title}
              </h2>
              <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-[13px] text-brand-textMain">
            Más información:{' '}
            <a href="mailto:info@pannapomodoro.sv" className="text-brand-accent hover:underline">
              info@pannapomodoro.sv
            </a>
          </p>
          <Link
            to="/"
            className="text-[13px] text-brand-textMain border-b border-brand-textMain pb-0.5 hover:border-brand-primary hover:text-brand-primary transition-colors duration-base"
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  )
}