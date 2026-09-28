"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";

const HOUSE = "/images/hero-house.png";

/** useLayoutEffect sem aviso em SSR. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Ajusta a palavra gigante à largura exata da viewport.
 *
 * Medir em vez de estimar: as métricas da Inter Black não são conhecidas em
 * build-time e um `font-size` fixo em vw ou corta as letras exteriores ou deixa
 * margens irregulares. Medimos a largura natural (a linha mais larga, graças a
 * `width: max-content`) e derivamos o corpo exato para o alvo pretendido.
 */
function useFitText(bleedDesktop = 1.025) {
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
    // re-medir quando a Inter terminar de carregar (a fallback tem outra métrica)
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
 * HERO
 *
 * Mobile (fluxo):    tipografia em duas linhas → arquitetura → copy → orçamento
 * Desktop (camadas): copy e orçamento a flanquear; a arquitetura assenta sobre
 *                    a palavra, ocultando-lhe a metade superior — a casa fica à
 *                    frente da tipografia, não por cima de tudo.
 *
 * A imagem existe uma única vez no DOM: um só LCP.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const wordRef = useFitText();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const houseY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-10%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const wordOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0.2]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-x-clip bg-bone pt-[100px] pb-10 md:block md:pt-0 md:pb-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_60%_at_50%_72%,rgba(255,255,255,0.7),transparent_70%)]"
      />

      {/* ---------------- Tipografia gigante ---------------- */}
      <motion.div
        style={{ y: wordY, opacity: wordOpacity }}
        className="relative z-10 order-1 w-full will-change-transform md:absolute md:bottom-[3vh] md:left-0 md:order-none"
      >
        <div className="px-[var(--shell-x)] md:px-0">
          <h1
            id="hero-title"
            className="display-hero leading-[0.88] text-ink select-none md:leading-[0.78]"
          >
            <span className="sr-only">Construímos espaços para viver.</span>
            <motion.span
              aria-hidden
              className="block"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: "14%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
            >
              {/* w-max → a medição devolve a largura real do texto.
                  left-1/2 + -translate-x-1/2 centra mesmo quando excede a viewport. */}
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

      {/* ---------------- Arquitetura (objeto à frente da tipografia) ----------------
          Base a 13.5vh do fundo: a casa assenta a meio da palavra, deixando a
          metade inferior das letras legível de ponta a ponta.
          Largura limitada também em svh para não rebentar em ecrãs baixos. */}
      <motion.div
        initial={
          reduced ? { opacity: 0 } : { opacity: 0, scale: 1.03, clipPath: "inset(0% 0% 14% 0%)" }
        }
        animate={
          reduced ? { opacity: 1 } : { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
        }
        transition={{ duration: 1.6, delay: 0.85, ease: EASE }}
        className="relative z-20 order-2 -mt-[7vw] w-full will-change-transform md:absolute md:bottom-[calc(3vh+6vw)] md:left-1/2 md:order-none md:mt-0 md:w-[min(62vw,90svh)] md:-translate-x-1/2 lg:w-[min(56vw,88svh)]"
      >
        <motion.div style={{ y: houseY }} className="relative">
          <Image
            src={HOUSE}
            alt="Moradia contemporânea de dois pisos em betão aparente, pedra natural e madeira, com grandes panos de vidro e jardim desenhado"
            width={1400}
            height={768}
            priority
            fetchPriority="high"
            sizes="(min-width: 1200px) 56vw, (min-width: 768px) 62vw, 100vw"
            className="h-auto w-full drop-shadow-[0_40px_60px_rgba(10,10,10,0.13)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-[10%] bottom-[0.5%] -z-10 h-[8%] rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(10,10,10,0.22),transparent_72%)] blur-[12px]"
          />
        </motion.div>
      </motion.div>

      {/* ---------------- Copy + CTA secundário (esquerda) ---------------- */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.25, ease: EASE }}
        className="relative z-30 order-3 mt-8 max-w-[320px] px-[var(--shell-x)] md:absolute md:top-[124px] md:left-[var(--shell-x)] md:order-none md:mt-0 md:max-w-[290px] md:px-0 xl:top-[140px]"
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
        className="relative z-30 order-4 mx-[var(--shell-x)] mt-8 rounded-[28px] border border-[rgba(10,10,10,0.07)] bg-[rgba(238,234,226,0.72)] p-7 shadow-[0_24px_60px_-32px_rgba(10,10,10,0.22)] backdrop-blur-[14px] md:absolute md:top-[124px] md:right-[var(--shell-x)] md:order-none md:mx-0 md:mt-0 md:w-[310px] md:p-7 md:pb-6 xl:top-[140px] xl:w-[330px] xl:p-8"
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
