"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type Variant = "outline" | "solid" | "ghost" | "invert";

const base =
  "group relative inline-flex items-center justify-between gap-6 rounded-full px-7 py-4 text-[13px] font-medium tracking-[0.01em] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

const variants: Record<Variant, string> = {
  outline:
    "border border-[rgba(10,10,10,0.28)] text-ink hover:bg-ink hover:text-bone hover:border-ink",
  solid: "bg-ink text-bone hover:bg-[#1f1f1f]",
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
  strength = 0.28,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
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
      <span
        aria-hidden
        className="translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
      >
        →
      </span>
    </>
  );

  const classes = `${base} ${variants[variant]} ${className}`;

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
      data-cursor="hover"
    >
      {href ? (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={`${classes} disabled:cursor-not-allowed disabled:opacity-45`} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
