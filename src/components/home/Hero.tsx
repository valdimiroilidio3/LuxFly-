"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

const HOUSE = "/images/hero-house.png";

/**
 * HERO
 *
 * Uma única composição, reposicionada por breakpoint — a imagem de arquitetura
 * existe uma só vez no DOM (um único LCP, um único download).
 *
 * Mobile (fluxo):   tipografia → arquitetura → copy → orçamento
 * Desktop (camadas): copy e orçamento a flanquear, arquitetura em z-20 à frente
 *                    da palavra gigante ancorada ao fundo do ecrã.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const houseY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-12%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "20%"]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0.18]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-x-clip bg-bone pt-[104px] pb-10 md:block md:pt-0 md:pb-0"
    >
      {/* halo de luz subtil atrás da arquitetura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_60%_at_50%_72%,rgba(255,255,255,0.7),transparent_70%)]"
      />

      {/* ---------------- Tipografia gigante ---------------- */}
      <motion.div
        style={{ y: wordY, opacity: wordOpacity }}
        className="relative z-10 order-1 w-full will-change-transform md:absolute md:bottom-[2.2vh] md:left-0 md:order-none"
      >
        <h1
          id="hero-title"
          className="display-hero px-[var(--shell-x)] text-[clamp(3.4rem,17.5vw,6rem)] text-ink select-none md:w-full md:px-0 md:text-center md:text-[clamp(7rem,15vw,18rem)] md:whitespace-nowrap"
        >
          <span className="sr-only">Construímos espaços para viver.</span>
          <motion.span
            aria-hidden
            className="block"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: "16%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
          >
            Constru
            <br className="md:hidden" />
            ímos.
          </motion.span>
        </h1>
      </motion.div>

      {/* ---------------- Arquitetura (objeto à frente da tipografia) ---------------- */}
      <motion.div
        initial={
          reduced ? { opacity: 0 } : { opacity: 0, scale: 1.03, clipPath: "inset(0% 0% 14% 0%)" }
        }
        animate={
          reduced ? { opacity: 1 } : { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
        }
        transition={{ duration: 1.6, delay: 0.85, ease: EASE }}
        className="relative z-20 order-2 -mt-[6vw] w-full will-change-transform md:absolute md:bottom-[4.5vh] md:left-1/2 md:order-none md:-mt-0 md:w-[72vw] md:max-w-[1180px] md:-translate-x-1/2 lg:w-[64vw]"
      >
        <motion.div style={{ y: houseY }} className="relative">
          <Image
            src={HOUSE}
            alt="Moradia contemporânea de dois pisos em betão aparente, pedra natural e madeira, com grandes panos de vidro e jardim desenhado"
            width={1400}
            height={768}
            priority
            fetchPriority="high"
            sizes="(min-width: 1200px) 64vw, (min-width: 768px) 72vw, 100vw"
            className="h-auto w-full drop-shadow-[0_40px_60px_rgba(10,10,10,0.13)]"
          />
          {/* sombra de contacto com o solo */}
          <div
            aria-hidden
            className="absolute inset-x-[12%] bottom-[1%] -z-10 h-[7%] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(10,10,10,0.18),transparent_72%)] blur-[10px]"
          />
        </motion.div>
      </motion.div>

      {/* ---------------- Copy + CTA secundário (esquerda) ---------------- */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.25, ease: EASE }}
        className="relative z-30 order-3 mt-8 max-w-[320px] px-[var(--shell-x)] md:absolute md:top-[124px] md:left-[var(--shell-x)] md:order-none md:mt-0 md:max-w-[300px] md:px-0 xl:top-[138px]"
      >
        <p className="text-[15px] leading-[1.5] tracking-[-0.01em] text-ink/70 md:text-[16px]">
          Casas contemporâneas
          <br />
          para viver com conforto,
          <br />
          qualidade e personalidade.
        </p>
        <Link
          href="/projetos"
          data-cursor="hover"
          className="group mt-7 inline-flex w-[240px] items-center justify-between rounded-full border border-[rgba(10,10,10,0.28)] px-6 py-3.5 text-[13px] text-ink transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink hover:bg-ink hover:text-bone"
        >
          Ver projetos
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>

      {/* ---------------- Bloco de orçamento (direita) ---------------- */}
      <motion.aside
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 1.45, ease: EASE }}
        aria-labelledby="hero-orcamento"
        className="relative z-30 order-4 mx-[var(--shell-x)] mt-8 rounded-[28px] border border-[rgba(10,10,10,0.07)] bg-[rgba(238,234,226,0.72)] p-7 shadow-[0_24px_60px_-32px_rgba(10,10,10,0.22)] backdrop-blur-[14px] md:absolute md:top-[124px] md:right-[var(--shell-x)] md:order-none md:mx-0 md:mt-0 md:w-[330px] md:p-8 xl:top-[138px]"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink/70" />
          <h2 id="hero-orcamento" className="text-[15px] font-medium tracking-[-0.01em]">
            Orçamento gratuito
          </h2>
        </div>
        <p className="mt-3.5 text-[14px] leading-[1.55] text-ink/60">
          Conte sobre o seu projeto
          <br />
          e receba uma estimativa
          <br />
          inicial.
        </p>
        <Link
          href="/contacto"
          data-cursor="hover"
          className="group mt-6 inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-3.5 text-[13px] text-bone transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1f1f1f]"
        >
          Solicitar agora
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.aside>

      {/* ---------------- Rodapé da hero ---------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="pointer-events-none absolute inset-x-0 bottom-5 z-30 hidden items-end justify-between px-[var(--shell-x)] lg:flex"
      >
        <span className="eyebrow text-ink/35">Scroll</span>
        <span className="eyebrow text-ink/35">Est. 2016 — Portugal</span>
      </motion.div>
    </section>
  );
}
