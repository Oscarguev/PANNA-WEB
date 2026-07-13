/**
 * ScrollReveal.jsx
 * Wrapper that runs a framer variants sequence once when the element enters
 * the viewport. Triggers at ~15% visibility, runs once per navigation session,
 * respects prefers-reduced-motion (renders plain element when reduced).
 */
import { m, useReducedMotion } from 'framer-motion';
import { fadeIn } from './variants';

export default function ScrollReveal({
  children,
  variants,
  as = 'div',
  className,
  delay = 0,
  amount = 0.15,
  once = true,
  margin = '0px 0px -10% 0px',
  ...rest
}) {
  const reduced = useReducedMotion();
  const v = variants || fadeIn;
  if (reduced) {
    const Tag = as;
    return <Tag className={className} {...rest}>{children}</Tag>;
  }
  const Component = m[as] || m.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      variants={v}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}