"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

export function DetailSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.14, 1.06, 1.14]);

  return (
    <section
      ref={ref}
      aria-labelledby="detalhe-title"
      className="on-dark relative isolate flex min-h-[86svh] items-center overflow-hidden bg-ink text-white"
    >
      <motion.div style={{ y, scale }} className="absolute inset-[-14%] -z-10 will-change-transform">
        <Image
          src="/images/detail-macro.webp"
          alt="Macro de encontro entre betão, pedra natural e madeira numa obra MODUS"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/58" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(10,10,10,0.75),transparent_55%)]"
      />

      <div className="shell relative w-full py-[96px] md:py-[128px]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="eyebrow text-white/50"
        >
          02 — Material
        </motion.p>

        <h2
          id="detalhe-title"
          className="display mt-8 max-w-[14ch] text-[clamp(2.6rem,8vw,7.5rem)] text-white"
        >
          {["Detalhes", "fazem a diferença."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
          className="mt-12 max-w-[38ch] md:mt-16 md:ml-auto"
        >
          <p className="text-[18px] leading-[1.5] tracking-[-0.01em] text-white/85 md:text-[22px]">
            Materiais selecionados.
            <br />
            Execução precisa.
            <br />
            Arquitetura pensada ao detalhe.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] text-white/45">
            {["Betão aparente", "Pedra natural", "Madeira maciça", "Vidro estrutural", "Metal", "Acabamento fino"].map(
              (m) => (
                <li key={m} className="border-t border-white/15 pt-2.5">
                  {m}
                </li>
              ),
            )}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
