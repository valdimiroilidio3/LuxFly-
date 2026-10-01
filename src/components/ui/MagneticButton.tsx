"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

type Variant = "outline" | "solid" | "ghost" | "invert";

/**
 * Botão com atração magnética ao cursor.
 *
 * - O movimento é decorativo, por isso passa por molas: ligar o transform
 *   diretamente à posição do rato parece artificial, falta-lhe inércia.
 * - A pressão tem feedback imediato (scale 0.97 em :active, via .pressable).
 * - Só se move onde o ponteiro é fino; em touch fica estático.
 */
const base =
  "pressable group relative inline-flex items-center justify-between gap-6 rounded-full px-7 py-4 text-[13px] font-medium tracking-[0.01em]";

const variants: Record<Variant, string> = {
  outline:
    "border border-[rgba(10,10,10,0.28)] text-ink hover:bg-ink hover:text-bone hover:border-ink",
  solid: "bg-ink text-bone hover:bg-[#262626]",
  invert: "bg-bone text-ink hover:bg-white",
  ghost:
    "border border-[rgba(255,255,255,0.28)] text-white hover:bg-white hover:text-ink hover:border-white",
};

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  strength?: number;
};

export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "outline",
  className = "",
  disabled,
  ariaLabel,
  strength = 0.24,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mola criticamente amortecida: acompanha sem oscilar.
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  // String de transform completa → composição acelerada por hardware.
  const transform = useTransform(
    [sx, sy],
    ([tx, ty]: number[]) => `translate3d(${tx}px, ${ty}px, 0)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span>{children}</span>
      <span aria-hidden className="arrow">
        →
      </span>
    </>
  );

  const classes = `${base} ${variants[variant]} ${className}`;

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ transform }}
      className="inline-block will-change-transform"
      data-cursor="hover"
    >
      {href ? (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`${classes} disabled:cursor-not-allowed disabled:opacity-45`}
          aria-label={ariaLabel}
        >
          {inner}
        </button>
      )}
    </motion.span>
  );
}
