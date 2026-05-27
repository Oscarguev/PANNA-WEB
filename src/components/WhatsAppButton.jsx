import { WhatsAppIcon } from './Icons';

const WA_NUMBER = '50324511000';
const WA_MESSAGE = encodeURIComponent('Hola, me gustaría hacer una reservación en Panna & Pomodoro.');

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-13 h-13 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/30"
      style={{ width: '52px', height: '52px', backgroundColor: '#25D366' }}
    >
      <WhatsAppIcon size={26} className="text-white" />
    </a>
  );
}
