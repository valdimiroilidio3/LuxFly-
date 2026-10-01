"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/site/Section";
import type { Stat } from "@/lib/types";

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced || value === 0) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className="numeral">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;

  return (
    <Section labelledBy="numeros-title">
      <div className="shell">
        <SectionHeader
          index="05"
          eyebrow="Números"
          titleId="numeros-title"
          title={
            <>
              Experiência que se mede
              <br />
              em detalhes.
            </>
          }
          lede="Obras entregues, equipas fixas e um histórico de prazos cumpridos."
        />

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-24 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              className="border-t border-[rgba(10,10,10,0.18)] pt-5"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="display block text-[clamp(3rem,7vw,6rem)] leading-[0.85] tracking-[-0.06em]">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </span>
                <span className="mt-4 block text-[13.5px] text-ink/55">{stat.label}</span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
