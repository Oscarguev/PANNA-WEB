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
    <main className="min-h-screen bg-brand-background pt-36 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-16">

        <div className="space-y-4">
          <span className="font-body text-[12px] tracking-[0.35em] text-brand-primary uppercase font-semibold block">
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-brand-textMain font-light tracking-[0.03em] uppercase leading-tight">
            Política de Cookies
          </h1>
          <div className="w-16 h-[1px] bg-brand-primary/30" />
          <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light pt-2">
            Última actualización: Mayo 2026. Este sitio usa cookies de forma mínima y transparente para ofrecerle la mejor experiencia posible.
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title} className="space-y-3 border-l border-brand-primary/20 pl-6">
              <h2 className="font-body text-[12px] tracking-[0.25em] text-brand-primary uppercase font-bold">
                {s.title}
              </h2>
              <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-body text-[12px] text-brand-textMuted/50">
            Más información:{' '}
            <a href="mailto:info@pannapomodoro.sv" className="text-brand-primary hover:underline">
              info@pannapomodoro.sv
            </a>
          </p>
          <Link
            to="/"
            className="font-body text-[12px] tracking-[0.2em] uppercase text-brand-textMuted hover:text-brand-primary transition-colors duration-300"
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  )
}
