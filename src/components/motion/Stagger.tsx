'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Children, Fragment, type ReactNode } from 'react';

type Tag = 'div' | 'ul' | 'ol' | 'section' | 'dl';
type ChildTag = 'div' | 'li' | 'span' | 'article';

type Props = {
  children: ReactNode;
  as?: Tag;
  /** Element used to wrap each child. Default 'div'. Use 'li' inside ul/ol. */
  childAs?: ChildTag;
  className?: string;
  /**
   * Per-child className indexed by child position. Useful for variable
   * col-spans on specific children (e.g. a gap-filler placeholder at the
   * end of a grid). Serializable so it can cross the server-component →
   * client-component boundary.
   */
  childClassName?: ReadonlyArray<string | undefined>;
  /** Stagger step in seconds between children. Default 0.08. */
  step?: number;
  /** Initial delay before the first child enters. Default 0. */
  delay?: number;
  /** Distance each child translates up from. Default 18px. */
  y?: number;
  rootMargin?: string;
  once?: boolean;
};

const containerVariants = (step: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: step,
      delayChildren: delay,
    },
  },
});

const childVariants: Variants = {
  hidden: (custom: { y: number }) => ({ opacity: 0, y: custom.y }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  as = 'div',
  childAs = 'div',
  className,
  childClassName,
  step = 0.08,
  delay = 0,
  y = 18,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: Props) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const ChildMotionTag = motion[childAs as keyof typeof motion] as typeof motion.div;

  if (prefersReduced) {
    const Tag = as as 'div';
    return (
      <Tag className={className}>
        {childClassName
          ? Children.map(children, (child, i) => {
              const cls = childClassName[i];
              return cls ? (
                <div key={i} className={cls}>
                  {child}
                </div>
              ) : (
                <Fragment key={i}>{child}</Fragment>
              );
            })
          : children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: rootMargin }}
      variants={containerVariants(step, delay)}
    >
      {Children.map(children, (child, i) => (
        <ChildMotionTag
          key={i}
          className={childClassName?.[i]}
          custom={{ y }}
          variants={childVariants}
        >
          {child}
        </ChildMotionTag>
      ))}
    </MotionTag>
  );
}
