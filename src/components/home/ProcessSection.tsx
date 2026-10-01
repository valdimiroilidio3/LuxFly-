"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/site/Section";
import { processSteps } from "@/lib/seed";

export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="processo" labelledBy="processo-title" tone="bone-2">
      <div className="shell">
        <SectionHeader
          index="04"
          eyebrow="Processo"
          titleId="processo-title"
          title={
            <>
              Do primeiro traço
              <br />à última entrega.
            </>
          }
          lede="Um método com etapas claras — sabe sempre em que ponto está a sua obra."
        />

        <div ref={ref} className="relative mt-16 md:mt-24">
          {/* linha horizontal (desktop) */}
          <div
            aria-hidden
            className="absolute top-[78px] right-0 left-0 hidden h-px bg-[rgba(10,10,10,0.14)] lg:block"
          >
            <motion.div
              style={{ scaleX: reduced ? 1 : lineScale }}
              className="h-full w-full origin-left bg-ink/70"
            />
          </div>
          {/* linha vertical (mobile) */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] w-px bg-[rgba(10,10,10,0.14)] lg:hidden"
          >
            <motion.div
              style={{ scaleY: reduced ? 1 : lineScale }}
              className="h-full w-full origin-top bg-ink/70"
            />
          </div>

          <ol className="grid grid-cols-1 gap-y-10 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-0">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, delay: i * 0.07, ease: EASE }}
                className="group relative pl-10 lg:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute top-2.5 left-0 h-[15px] w-[15px] rounded-full border border-ink/25 bg-bone-2 transition-colors duration-[180ms] group-hover:bg-ink lg:top-[71px] lg:left-0"
                >
                  <span className="absolute inset-[4px] rounded-full bg-ink transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] hoverable:group-hover:scale-[0.3] hoverable:group-hover:opacity-0" />
                </span>

                <span className="numeral display block text-[clamp(2.6rem,4.4vw,4rem)] leading-[0.8] text-ink/15 transition-colors duration-[180ms] group-hover:text-ink/45">
                  {step.index}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold tracking-[0.06em] uppercase lg:mt-[42px]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[13.5px] leading-[1.6] text-ink/55">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
