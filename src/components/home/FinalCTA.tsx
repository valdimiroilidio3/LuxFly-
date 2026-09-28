"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function FinalCTA({ responseTime }: { responseTime: string }) {
  return (
    <section
      aria-labelledby="cta-title"
      className="on-dark relative isolate overflow-hidden bg-ink py-[112px] text-white md:py-[160px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]"
      />
      <div className="shell">
        <h2
          id="cta-title"
          className="display text-[clamp(3.4rem,15vw,13rem)] leading-[0.82] tracking-[-0.06em]"
        >
          {["Vamos", "construir?"].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.3, delay: i * 0.1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="col-span-12 max-w-[34ch] text-[17px] leading-[1.55] text-white/65 md:col-span-5"
          >
            Conte-nos o que está a imaginar.
            <br />
            Nós ajudamos a transformar a ideia em espaço.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="col-span-12 flex flex-col items-start gap-4 md:col-span-6 md:col-start-7 md:items-end"
          >
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <MagneticButton href="/contacto" variant="invert" className="min-w-[230px]">
                Falar com a MODUS
              </MagneticButton>
              <MagneticButton href="/contacto#orcamento" variant="ghost" className="min-w-[230px]">
                Solicitar orçamento
              </MagneticButton>
            </div>
            <p className="mt-2 text-[12.5px] text-white/40">{responseTime}</p>
          </motion.div>
        </div>

        <div className="mt-20 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/12 pt-6 text-[13px] text-white/45 md:mt-28">
          <Link href="mailto:geral@modus.pt" className="transition-colors hover:text-white">
            geral@modus.pt
          </Link>
          <Link href="tel:+351239000000" className="transition-colors hover:text-white">
            +351 239 000 000
          </Link>
          <span>Coimbra · Lisboa · Porto</span>
        </div>
      </div>
    </section>
  );
}
