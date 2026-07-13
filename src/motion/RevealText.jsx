/**
 * RevealText.jsx
 * Editorial line-by-line text reveal. Each line sits inside an overflow-hidden
 * mask; an inner span slides from y:100% to 0. Text remains selectable and
 * screen-reader accessible (no aria-hidden on the readable text).
 *
 * Used for: hero wordmark, manifesto phrases, section titles, editorial H2s.
 * NOT used for: long paragraphs, prices, form fields, buttons, footers.
 */
import { m, useReducedMotion } from 'framer-motion';
import { MOTION, EASE } from './variants';

export default function RevealText({
  children,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = MOTION.stagger.normal,
  duration = MOTION.duration.normal,
}) {
  const reduced = useReducedMotion();
  // Split string by newline. JSX children pass through as a single "line".
  const lines = typeof children === 'string' ? children.split('\n') : [children];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={{ paddingBottom: '0.05em', marginBottom: '-0.05em' }}
        >
          <m.span
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration,
              ease: EASE.silk,
              delay: delay + i * stagger,
            }}
            className="inline-block"
          >
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}