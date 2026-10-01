"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Parallax vertical para elementos não-imagem (numerais, blocos de texto).
 * Deslocamento em pixéis, suavizado por spring. Inerte em reduced-motion.
 */
export function ParallaxText({
  children,
  strength = 24,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [strength, -strength],
  );
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.01 });

  return (
    <motion.div ref={ref} style={{ y }} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
