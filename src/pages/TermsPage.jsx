import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'Reservaciones',
    body: 'Las reservaciones realizadas a través de nuestro sitio web son solicitudes sujetas a confirmación por parte de Panna & Pomodoro. La confirmación se realizará vía telefónica en un plazo no mayor a 2 horas durante horario de servicio. Una reservación no confirmada no garantiza disponibilidad de mesa.',
  },
  {
    title: 'Cancelaciones',
    body: 'Solicitamos un aviso de cancelación con al menos 2 horas de anticipación. La cancelación tardía o la no presentación sin aviso previo podrá restringir futuras reservaciones en línea. Para grupos mayores a 6 personas, el aviso debe ser de al menos 24 horas.',
  },
  {
    title: 'Pedidos en Línea',
    body: 'Los pedidos realizados a través de la Tienda de Café son definitivos una vez confirmado el pago. Los productos son artesanales y su disponibilidad puede variar. Panna & Pomodoro se reserva el derecho de sustituir un artículo agotado por uno de valor equivalente, notificando al cliente.',
  },
  {
    title: 'Precios y Pagos',
    body: 'Todos los precios publicados incluyen IVA y están expresados en dólares estadounidenses (USD). Los precios pueden cambiar sin previo aviso. El pago en línea se procesa a través de plataformas seguras de terceros; Panna & Pomodoro no almacena datos de tarjetas de crédito.',
  },
  {
    title: 'Propiedad Intelectual',
    body: 'Todo el contenido de este sitio —fotografías, logotipos, textos y diseño— es propiedad de Panna & Pomodoro y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización escrita.',
  },
  {
    title: 'Modificaciones',
    body: 'Panna & Pomodoro se reserva el derecho de modificar estos términos en cualquier momento. El uso continuado del sitio después de cualquier cambio constituye la aceptación de los nuevos términos.',
  },
]

export default function TermsPage() {
  return (
    <main id="main" className="min-h-screen bg-brand-background pt-36 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-16">

        <header className="space-y-4">
          <div className="flex items-center gap-3 text-[12px] text-brand-textSubtle">
            <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
            <span>Legal · Última actualización, mayo de 2026</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-brand-textMain font-light leading-tight tracking-tighter">
            Términos de Uso
          </h1>
          <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading pt-2">
            Al utilizar este sitio web o realizar una reservación, usted acepta los siguientes términos y condiciones.
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
            ¿Dudas? Escríbenos a{' '}
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