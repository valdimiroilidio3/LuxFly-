"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/site/Section";
import type { Service } from "@/lib/types";

/**
 * Lista editorial de serviços com pré-visualização a seguir o cursor.
 * Performance: uma única imagem reposicionada por motion values (sem re-render
 * a cada movimento do rato) e desativada em touch / reduced-motion.
 */
export function ServicesSection({ services }: { services: Service[] }) {
  const [active, setActive] = useState<Service | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <Section id="servicos" labelledBy="servicos-title">
      <div className="shell">
        <SectionHeader
          index="03"
          eyebrow="Serviços"
          titleId="servicos-title"
          title="O que fazemos."
          lede="Seis áreas, uma equipa. Do primeiro esboço à manutenção depois da entrega."
        />

        <div
          ref={containerRef}
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          className="relative mt-14 border-t border-[rgba(10,10,10,0.14)] md:mt-20"
        >
          <ul>
            {services.map((service, i) => (
              <motion.li
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: EASE }}
                onMouseEnter={() => setActive(service)}
                className="group border-b border-[rgba(10,10,10,0.14)]"
              >
                <Link
                  href="/servicos"
                  data-cursor="hover"
                  className="grid grid-cols-12 items-center gap-4 py-6 transition-[padding,color] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] md:py-7 md:group-hover:py-11"
                >
                  <span className="numeral col-span-2 text-[12px] tracking-[0.14em] text-ink/35 md:col-span-1">
                    {service.index}
                  </span>
                  <h3 className="col-span-10 text-[clamp(1.5rem,3.4vw,2.6rem)] leading-none font-semibold tracking-[-0.04em] transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] md:col-span-4 md:hoverable:group-hover:translate-x-3">
                    {service.title}
                  </h3>
                  <p className="col-span-11 col-start-3 text-[14px] leading-relaxed text-ink/55 md:col-span-5 md:col-start-auto">
                    {service.description}
                  </p>
                  <span
                    aria-hidden
                    className="col-span-1 hidden justify-self-end text-ink/30 transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] hoverable:group-hover:translate-x-1 group-hover:text-ink md:col-span-2 md:block"
                  >
                    →
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Pré-visualização flutuante (desktop) */}
          {!reduced && (
            <motion.div
              aria-hidden
              style={{ x: sx, y: sy }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden lg:block"
            >
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="relative h-[240px] w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[6px] shadow-[0_30px_60px_-30px_rgba(10,10,10,0.4)]"
                  >
                    <Image
                      src={active.image}
                      alt=""
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </Section>
  );
}
