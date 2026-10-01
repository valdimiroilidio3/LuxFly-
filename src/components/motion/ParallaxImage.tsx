"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Imagem com parallax vertical ligado ao scroll.
 *
 * A moldura faz overflow-hidden e a imagem é 130% mais alta, deslocando-se
 * entre -strength% e +strength% à medida que atravessa a viewport — nunca
 * revela bordas vazias. Desligado em prefers-reduced-motion.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  strength = 10,
  priority = false,
  overlay = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  priority?: boolean;
  overlay?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : [`-${strength}%`, `${strength}%`],
  );
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.001 });

  return (
    <div ref={ref} className={`relative overflow-hidden bg-bone-2 ${className}`}>
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
        />
      </motion.div>
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-ink opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-[0.18]"
        />
      )}
    </div>
  );
}
