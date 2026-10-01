"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import { Section } from "@/components/site/Section";
import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (!testimonials.length) return null;

  const current = testimonials[index];
  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <Section labelledBy="testemunhos-title">
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow mb-5 flex items-center gap-3 text-ink/40">
              <span className="numeral">06</span>
              <span aria-hidden className="h-px w-8 bg-current opacity-40" />
              <span>Testemunhos</span>
            </p>
            <h2 id="testemunhos-title" className="title-xl">
              {["Quem constrói", "connosco."].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1.1, delay: i * 0.08, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>

            {testimonials.length > 1 && (
              <div className="mt-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Testemunho anterior"
                  className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(10,10,10,0.2)] transition-colors duration-[180ms] hover:bg-ink hover:text-bone"
                >
                  <span aria-hidden>←</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Testemunho seguinte"
                  className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(10,10,10,0.2)] transition-colors duration-[180ms] hover:bg-ink hover:text-bone"
                >
                  <span aria-hidden>→</span>
                </button>
                <span className="numeral ml-3 text-[12px] text-ink/40">
                  {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: EASE }}
                aria-live="polite"
              >
                <blockquote className="text-[clamp(1.4rem,3.2vw,2.5rem)] leading-[1.24] tracking-[-0.035em] text-ink">
                  “{current.quote}”
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[rgba(10,10,10,0.14)] pt-5 text-[13px]">
                  <span className="font-medium">{current.author}</span>
                  <span className="text-ink/45">{current.role}</span>
                  {current.project && (
                    <span className="text-ink/45">Projeto: {current.project}</span>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
