"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (!testimonials.length) return null;

  const current = testimonials[index];
  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section
      aria-labelledby="testemunhos-title"
      className="border-t border-[rgba(10,10,10,0.1)] py-[96px] md:py-[128px]"
    >
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="testemunhos-title" className="display text-[clamp(2.2rem,5vw,4.2rem)]">
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(10,10,10,0.2)] transition-colors duration-500 hover:bg-ink hover:text-bone"
                >
                  <span aria-hidden>←</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Testemunho seguinte"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(10,10,10,0.2)] transition-colors duration-500 hover:bg-ink hover:text-bone"
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
    </section>
  );
}
