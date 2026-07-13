/**
 * MotionLink.jsx
 * Editorial text link with luxury-underline animation + optional arrow nudge.
 * Uses CSS-only hover (no JS event handlers) — works on touch devices without
 * hover state, respects prefers-reduced-motion (no transform shifts).
 */
import { Link } from 'react-router-dom';

export default function MotionLink({
  to,
  children,
  className = '',
  withArrow = false,
  external = false,
  ...rest
}) {
  const inner = (
    <>
      <span className="luxury-underline">{children}</span>
      {withArrow && (
        <span
          aria-hidden="true"
          className="ml-1.5 inline-block transition-transform duration-base ease-silk group-hover:translate-x-1 motion-reduce:transform-none"
        >
          →
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={to} className={`group inline-flex items-center ${className}`} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={`group inline-flex items-center ${className}`} {...rest}>
      {inner}
    </Link>
  );
}