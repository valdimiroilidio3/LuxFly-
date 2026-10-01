"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { site } from "@/lib/site";
import { EASE, SPRING, SPRING_SHEET } from "@/components/motion/Reveal";

/**
 * Projeção de momento da Apple (Designing Fluid Interfaces).
 * Dá o ponto onde o gesto *iria* parar, em vez de usar só a posição de largada.
 */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fechar com Escape — ação de teclado, por isso sem animação de abertura.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Largar o painel: decide pelo destino projetado, não pela distância. */
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = info.offset.y + project(info.velocity.y);
    if (projected < -120) setOpen(false);
  };

  return (
    <>
      <header
        data-scrolled={scrolled || open}
        className={`scroll-edge fixed inset-x-0 top-0 z-[90] transition-[background-color,backdrop-filter] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled || open ? "material-chrome" : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Navegação principal"
          className="shell flex items-center justify-between py-3.5 md:py-4"
        >
          {/* LEFT — marca */}
          <motion.div
            initial={reduced ? false : { opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link
              href="/"
              className="pressable group flex items-center gap-2.5"
              aria-label="MODUS — página inicial"
            >
              <span
                aria-hidden
                className="relative block h-3.5 w-3.5 border border-ink transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] hoverable:group-hover:rotate-45"
              >
                <span className="absolute inset-[3px] bg-ink" />
              </span>
              <span className="text-[15px] font-extrabold tracking-[-0.03em] uppercase">
                Modus
              </span>
            </Link>
          </motion.div>

          {/* CENTER — links */}
          <motion.ul
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          >
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative block py-1 text-[13px] text-ink/80 transition-colors duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-ink"
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        active ? "scale-x-100" : "scale-x-0 hoverable:group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </motion.ul>

          {/* RIGHT — indicadores + CTA */}
          <motion.div
            initial={reduced ? false : { opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="flex items-center gap-4"
          >
            <span className="hidden items-center gap-2 text-[11px] tracking-[0.14em] text-ink/45 uppercase xl:flex">
              <span aria-hidden className="h-1 w-1 rounded-full bg-ink/60" />
              Coimbra · Lisboa · Porto
            </span>
            <span className="hidden items-center gap-1.5 text-[11px] tracking-[0.14em] text-ink/45 uppercase xl:flex">
              <span className="text-ink">PT</span>
              <span aria-hidden>/</span>
              <span>EN</span>
            </span>
            <Link
              href="/contacto"
              className="pressable hidden items-center gap-2.5 rounded-full border border-ink/25 px-5 py-2.5 text-[12.5px] hover:border-ink hover:bg-ink hover:text-bone md:inline-flex"
            >
              Falar com a equipa{" "}
              <span aria-hidden className="arrow">
                →
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="pressable flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                aria-hidden
                className={`block h-px w-5 bg-ink transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                aria-hidden
                className={`block h-px w-5 bg-ink transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </motion.div>
        </nav>
      </header>

      {/* Painel móvel — entra e sai pelo mesmo caminho (consistência espacial)
          e pode ser arrastado para cima para fechar. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(-16px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(-16px)" }}
            transition={reduced ? { duration: 0.2 } : SPRING_SHEET}
            drag={reduced ? false : "y"}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.35, bottom: 0.02 }}
            onDragEnd={onDragEnd}
            className="material-chrome fixed inset-0 z-[85] touch-pan-y pt-24 lg:hidden"
          >
            <nav className="shell flex h-full flex-col justify-between pb-12">
              <ul className="flex flex-col">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, transform: "translateY(12px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ ...SPRING, delay: 0.04 * i }}
                    className="border-b border-[rgba(10,10,10,0.1)]"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="pressable display block py-5 text-[clamp(2rem,9vw,3rem)] leading-none"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 text-[13px] text-ink/60">
                <a href={`mailto:${site.email}`} className="text-ink">
                  {site.email}
                </a>
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
                <Link
                  href="/contacto"
                  onClick={() => setOpen(false)}
                  className="pressable mt-3 inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-bone"
                >
                  Falar com a equipa{" "}
                  <span aria-hidden className="arrow">
                    →
                  </span>
                </Link>
              </div>
              <span aria-hidden className="mt-6 text-center text-[11px] text-ink/30">
                Arraste para cima para fechar
              </span>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
