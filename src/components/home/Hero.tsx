"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

const HOUSE = "/images/hero-house.png";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Ajusta a palavra gigante à largura exata da viewport.
 * Medir em vez de estimar: as métricas da Inter Black não são conhecidas em
 * build-time e um corpo fixo em vw corta as letras exteriores.
 */
function useFitText(bleedDesktop = 1.06) {
  const ref = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const target = isDesktop ? window.innerWidth * bleedDesktop : parent.clientWidth;

    el.style.fontSize = "100px";
    const natural = el.offsetWidth; // width:max-content → largura real do texto
    if (!natural) return;
    el.style.fontSize = `${(100 * target) / natural}px`;
  }, [bleedDesktop]);

  useIsomorphicLayoutEffect(() => {
    fit();
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [fit]);

  return ref;
}

/**
 * HERO CINEMATOGRÁFICA
 *
 * Desktop: a secção é uma pista de scroll de 185svh com um palco `sticky` de
 * 100svh. Enquanto se percorre a pista, a cena anima sem a página avançar:
 *
 *   palavra  → cresce, sobe devagar (lag) e desvanece por trás da casa
 *   casa     → avança ligeiramente em escala, parallax mais rápido
 *   copy/CTA → saem primeiro, mais perto da câmara
 *
 * Mobile: fluxo normal (tipografia → arquitetura → copy → orçamento), sem
 * sticky, com a mesma hierarquia de entrada.
 */
export function Hero() {
  const track = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const wordRef = useFitText();

  // 0 → topo da hero; 1 → fim da pista de scroll (palco prestes a sair)
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  const no = (v: string) => (reduced ? "0%" : v);

  // Palavra: fica no centro, cresce e desaparece por trás da arquitetura
  const wordScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.42]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", no("14%")]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.55, 0.82], [1, 0.45, 0]);

  // Casa: plano mais próximo — avança e sobe um pouco mais depressa
  const houseScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.1]);
  const houseY = useTransform(scrollYProgress, [0, 1], ["0%", no("-7%")]);

  // Copy e cartão: primeiro plano, saem antes
  const frontY = useTransform(scrollYProgress, [0, 1], ["0%", no("-55%")]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);

  return (
    <section ref={track} aria-labelledby="hero-title" className="relative bg-bone md:h-[185svh]">
      {/* ---------------- Palco ---------------- */}
      <div className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden pt-[100px] pb-10 md:sticky md:top-0 md:block md:h-[100svh] md:min-h-0 md:pt-0 md:pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75%] bg-[radial-gradient(60%_60%_at_50%_68%,rgba(255,255,255,0.72),transparent_70%)]"
        />

        {/* ---------------- Tipografia gigante — centrada no ecrã ---------------- */}
        <motion.div
          style={{ scale: wordScale, y: wordY, opacity: wordOpacity }}
          className="relative z-10 order-1 w-full origin-center will-change-transform md:absolute md:inset-0 md:order-none md:flex md:items-center md:justify-center"
        >
          <div className="w-full px-[var(--shell-x)] md:px-0">
            <h1
              id="hero-title"
              className="display-hero leading-[0.88] text-ink select-none md:leading-[0.78]"
            >
              <span className="sr-only">Construímos espaços para viver.</span>
              <motion.span
                aria-hidden
                className="block"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: "12%" }}
                animate={{ opacity: 1, y: "0%" }}
                transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
              >
                {/* w-max → medição exata; left-1/2 + -translate-x-1/2 centra mesmo a sangrar */}
                <span
                  ref={wordRef}
                  className="block w-max text-[clamp(3.2rem,13.2vw,16rem)] md:relative md:left-1/2 md:-translate-x-1/2"
                >
                  Construí
                  <br className="md:hidden" />
                  mos.
                </span>
              </motion.span>
            </h1>
          </div>
        </motion.div>

        {/* ---------------- Arquitetura — plano da frente ---------------- */}
        <motion.div
          initial={
            reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04, clipPath: "inset(0% 0% 16% 0%)" }
          }
          animate={
            reduced ? { opacity: 1 } : { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
          }
          transition={{ duration: 1.7, delay: 0.85, ease: EASE }}
          className="relative z-20 order-2 -mt-[7vw] w-full will-change-transform md:absolute md:bottom-[5vh] md:left-1/2 md:order-none md:mt-0 md:w-[min(86vw,118svh)] md:-translate-x-1/2 lg:w-[min(74vw,113svh)]"
        >
          <motion.div style={{ y: houseY, scale: houseScale }} className="relative origin-bottom">
            <Image
              src={HOUSE}
              alt="Moradia contemporânea de dois pisos em betão aparente, pedra natural e madeira, com grandes panos de vidro e jardim desenhado"
              width={1400}
              height={768}
              priority
              fetchPriority="high"
              sizes="(min-width: 1200px) 74vw, (min-width: 768px) 86vw, 100vw"
              className="h-auto w-full drop-shadow-[0_50px_70px_rgba(10,10,10,0.15)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-[10%] bottom-[0.5%] -z-10 h-[8%] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(10,10,10,0.22),transparent_72%)] blur-[12px]"
            />
          </motion.div>
        </motion.div>

        {/* ---------------- Copy + CTA secundário (esquerda) ---------------- */}
        <motion.div
          style={{ y: frontY, opacity: frontOpacity }}
          className="relative z-30 order-3 mt-8 max-w-[320px] px-[var(--shell-x)] will-change-transform md:absolute md:top-[124px] md:left-[var(--shell-x)] md:order-none md:mt-0 md:max-w-[290px] md:px-0 xl:top-[140px]"
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.25, ease: EASE }}
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
        </motion.div>

        {/* ---------------- Bloco de orçamento (direita) ---------------- */}
        <motion.div
          style={{ y: frontY, opacity: frontOpacity }}
          className="relative z-30 order-4 mx-[var(--shell-x)] mt-8 will-change-transform md:absolute md:top-[124px] md:right-[var(--shell-x)] md:order-none md:mx-0 md:mt-0 md:w-[310px] xl:top-[140px] xl:w-[330px]"
        >
          <motion.aside
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.45, ease: EASE }}
            aria-labelledby="hero-orcamento"
            className="rounded-[28px] border border-[rgba(10,10,10,0.07)] bg-[rgba(238,234,226,0.72)] p-7 shadow-[0_24px_60px_-32px_rgba(10,10,10,0.22)] backdrop-blur-[14px] md:pb-6 xl:p-8"
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
        </motion.div>

        {/* ---------------- Rodapé do palco ---------------- */}
        <motion.div
          style={{ opacity: frontOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-5 z-30 hidden items-end justify-between px-[var(--shell-x)] lg:flex"
        >
          <span className="eyebrow text-ink/35">Scroll</span>
          <span className="eyebrow text-ink/35">Est. 2016 — Portugal</span>
        </motion.div>
      </div>
    </section>
  );
}
