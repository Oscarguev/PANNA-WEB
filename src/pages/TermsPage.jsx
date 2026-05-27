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
    <main className="min-h-screen bg-brand-background pt-36 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-16">

        <div className="space-y-4">
          <span className="font-body text-[11px] tracking-[0.35em] text-brand-primary uppercase font-semibold block">
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-brand-textMain font-light tracking-[0.03em] uppercase leading-tight">
            Términos de Uso
          </h1>
          <div className="w-16 h-[1px] bg-brand-primary/30" />
          <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light pt-2">
            Última actualización: Mayo 2026. Al utilizar este sitio web o realizar una reservación, usted acepta los siguientes términos y condiciones.
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title} className="space-y-3 border-l border-brand-primary/20 pl-6">
              <h2 className="font-body text-[11px] tracking-[0.25em] text-brand-primary uppercase font-bold">
                {s.title}
              </h2>
              <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-body text-[11px] text-brand-textMuted/50">
            ¿Dudas? Escríbenos a{' '}
            <a href="mailto:info@pannapomodoro.sv" className="text-brand-primary hover:underline">
              info@pannapomodoro.sv
            </a>
          </p>
          <Link
            to="/"
            className="font-body text-[11px] tracking-[0.2em] uppercase text-brand-textMuted hover:text-brand-primary transition-colors duration-300"
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  )
}
