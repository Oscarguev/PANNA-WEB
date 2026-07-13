/**
 * StaggerGroup.jsx
 * Editorial stagger wrapper. Each direct child becomes a staggered fadeUp item.
 * Delay between items: 0.04–0.13s. Mobile auto-reduces. Triggers once per
 * scroll-into-view (does not replay on small scrolls up).
 */
import { Children } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { MOTION, staggerParent, staggerChild } from './variants';

export default function StaggerGroup({
  children,
  stagger = MOTION.stagger.normal,
  delayChildren = 0,
  className,
  amount = 0.15,
  as = 'div',
  itemAs = 'div',
  itemClassName,
  ...rest
}) {
  const reduced = useReducedMotion();
  const parent = staggerParent(reduced ? 0 : stagger, reduced ? 0 : delayChildren);
  const Parent = reduced ? as : m[as] || m.div;

  if (reduced) {
    return <Parent className={className} {...rest}>{children}</Parent>;
  }

  const items = Children.toArray(children);
  const ItemTag = m[itemAs] || m.div;

  return (
    <Parent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={parent}
      {...rest}
    >
      {items.map((child, i) => (
        <ItemTag key={i} className={itemClassName} variants={staggerChild}>
          {child}
        </ItemTag>
      ))}
    </Parent>
  );
}