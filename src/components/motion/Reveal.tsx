"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

/** Curvas — espelham os tokens CSS em globals.css. */
export const EASE = [0.16, 1, 0.3, 1] as const; // revelações editoriais
export const EASE_OUT = [0.23, 1, 0.32, 1] as const; // entradas/saídas de UI
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const; // movimento no ecrã

/**
 * Molas, pensadas como a Apple as descreve: amortecimento e resposta.
 * Criticamente amortecida por omissão — sem overshoot. O bounce fica
 * reservado para gestos que trouxeram momento (arrasto, flick).
 */
export const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;
export const SPRING_SHEET = { type: "spring", bounce: 0.08, duration: 0.5 } as const;
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

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
      initial={reduced ? { opacity: 0 } : { opacity: 0, transform: `translateY(${y}px)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
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
        initial={{ transform: "translateY(110%)" }}
        whileInView={{ transform: "translateY(0%)" }}
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

/**
 * Stagger curto (30–80 ms). É decorativo: nunca bloqueia interação,
 * porque os elementos continuam clicáveis durante a entrada.
 */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, transform: "translateY(16px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};
