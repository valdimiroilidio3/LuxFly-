"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE, staggerParent, staggerChild } from "@/components/motion/Reveal";

/**
 * Ritmo de secção partilhado por todo o site.
 *
 * A estrutura é sempre a mesma — índice, eyebrow, título, lede, conteúdo —
 * para que o olhar aprenda o padrão uma vez e depois o preveja. Consistência
 * é o que separa um site com secções de um site com sistema.
 */
export function Section({
  id,
  labelledBy,
  children,
  className = "",
  tone = "bone",
  divider = true,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  tone?: "bone" | "bone-2" | "ink";
  divider?: boolean;
}) {
  const tones = {
    bone: "bg-bone text-ink",
    "bone-2": "bg-bone-2 text-ink",
    ink: "on-dark bg-ink text-bone",
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative ${tones[tone]} ${
        divider ? "border-t border-[rgba(10,10,10,0.1)]" : ""
      } py-[88px] md:py-[120px] xl:py-[152px] ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Cabeçalho de secção. As partes entram escalonadas em 60 ms: cascata
 * suficiente para parecer natural, curta o bastante para não atrasar a leitura.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  titleId,
  align = "split",
  display = false,
  onDark = false,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  titleId?: string;
  align?: "split" | "stack";
  display?: boolean;
  onDark?: boolean;
}) {
  const muted = onDark ? "text-white/45" : "text-ink/40";
  const ledeTone = onDark ? "text-white/60" : "text-ink/60";

  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={
        align === "split"
          ? "flex flex-col justify-between gap-7 md:flex-row md:items-end"
          : "flex flex-col gap-6"
      }
    >
      <div className="max-w-[18ch]">
        {(index || eyebrow) && (
          <motion.div
            variants={staggerChild}
            className={`mb-5 flex items-center gap-3 ${muted}`}
          >
            {index && <span className="numeral eyebrow">{index}</span>}
            {index && eyebrow && <span aria-hidden className="h-px w-8 bg-current opacity-40" />}
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          </motion.div>
        )}

        <motion.h2
          id={titleId}
          variants={staggerChild}
          className={display ? "display text-[clamp(2.6rem,7.5vw,6.5rem)]" : "title-xl"}
        >
          {title}
        </motion.h2>
      </div>

      {lede && (
        <motion.p
          variants={staggerChild}
          className={`body-lg max-w-[36ch] pb-1 ${ledeTone} ${
            align === "split" ? "md:text-right" : ""
          }`}
        >
          {lede}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * Régua fina que marca o fim de uma secção sem o peso de um traço contínuo.
 * Cresce da esquerda quando entra em vista.
 */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ transform: "scaleX(0)" }}
      whileInView={{ transform: "scaleX(1)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE }}
      className={`h-px origin-left bg-[rgba(10,10,10,0.14)] ${className}`}
    />
  );
}
