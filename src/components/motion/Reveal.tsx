"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  once?: boolean;
  amount?: number;
};

/** Entrada base: opacity + translateY, com respeito por prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  y = 28,
  as = "div",
  className,
  once = true,
  amount = 0.25,
}: Props) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: reduced ? 0.3 : duration, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Revelação tipográfica por máscara (clip) — usada em títulos display. */
export function MaskReveal({
  children,
  delay = 0,
  duration = 1.1,
  className,
  once = true,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once, amount: 0.4 }}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Revelação de imagem por clip-path. */
export function ImageReveal({
  children,
  delay = 0,
  duration = 1.4,
  className,
  once = true,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: reduced ? 0.3 : duration, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
