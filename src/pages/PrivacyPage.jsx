import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: '¿Qué información recopilamos?',
    body: 'Recopilamos únicamente los datos que usted nos proporciona voluntariamente: nombre, número de comensales, fecha y hora de reservación, y notas especiales. No recopilamos datos de pago directamente; estos son gestionados por plataformas de pago seguras de terceros.',
  },
  {
    title: '¿Para qué usamos sus datos?',
    body: 'Sus datos se utilizan exclusivamente para gestionar su reservación, contactarle vía telefónica para confirmarla, y mejorar nuestro servicio. No vendemos, alquilamos ni compartimos su información personal con terceros con fines comerciales.',
  },
  {
    title: 'Almacenamiento y seguridad',
    body: 'Su información se almacena en servidores seguros gestionados por Supabase, una plataforma con cifrado en tránsito (TLS) y en reposo. Aplicamos control de acceso estricto: solo el equipo de Panna & Pomodoro puede consultar las reservaciones registradas.',
  },
  {
    title: 'Retención de datos',
    body: 'Conservamos los datos de reservaciones durante 12 meses con fines operativos y de análisis de demanda. Transcurrido ese período, los datos son eliminados de forma permanente. Puede solicitar la eliminación anticipada de sus datos escribiéndonos.',
  },
  {
    title: 'Sus derechos',
    body: 'Usted tiene derecho a acceder, corregir o eliminar la información personal que hemos recopilado sobre usted. Para ejercer estos derechos, contáctenos a través del correo electrónico indicado al final de esta página.',
  },
  {
    title: 'Cambios a esta política',
    body: 'Podemos actualizar esta política periódicamente. La fecha de última actualización siempre estará indicada al inicio del documento. Le recomendamos revisarla ocasionalmente.',
  },
]

export default function PrivacyPage() {
  return (
    <main id="main" className="min-h-screen bg-brand-background pt-36 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-16">

        <header className="space-y-4">
          <div className="flex items-center gap-3 text-[12px] text-brand-textSubtle">
            <span className="w-8 h-px bg-brand-textSubtle" aria-hidden="true" />
            <span>Legal · Última actualización, mayo de 2026</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-brand-textMain font-light leading-tight tracking-tighter">
            Política de Privacidad
          </h1>
          <p className="text-[15px] text-brand-textMain leading-relaxed max-w-reading pt-2">
            En Panna &amp; Pomodoro valoramos su privacidad y nos comprometemos a proteger su información personal.
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
            Contacto:{' '}
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
