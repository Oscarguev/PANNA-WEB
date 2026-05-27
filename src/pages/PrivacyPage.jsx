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
    <main className="min-h-screen bg-brand-background pt-36 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto space-y-16">

        <div className="space-y-4">
          <span className="font-body text-[11px] tracking-[0.35em] text-brand-primary uppercase font-semibold block">
            Legal
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-brand-textMain font-light tracking-[0.03em] uppercase leading-tight">
            Política de Privacidad
          </h1>
          <div className="w-16 h-[1px] bg-brand-primary/30" />
          <p className="font-body text-xs text-brand-textMuted leading-relaxed font-light pt-2">
            Última actualización: Mayo 2026. En Panna &amp; Pomodoro valoramos su privacidad y nos comprometemos a proteger su información personal.
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
            Contacto:{' '}
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
