"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { EASE } from "@/components/motion/Reveal";

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,backdrop-filter,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || open
            ? "border-b border-[rgba(10,10,10,0.08)] bg-[rgba(245,242,236,0.82)] backdrop-blur-[20px]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Navegação principal"
          className="shell flex items-center justify-between py-3.5 md:py-4"
        >
          {/* LEFT — marca */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label="MODUS — página inicial"
            >
              <span
                aria-hidden
                className="relative block h-3.5 w-3.5 border border-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45"
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
                    className="group relative block py-1 text-[13px] text-ink/80 transition-colors duration-300 hover:text-ink"
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </motion.ul>

          {/* RIGHT — indicadores + CTA */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
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
              className="hidden items-center gap-2.5 rounded-full border border-ink/25 px-5 py-2.5 text-[12.5px] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink hover:bg-ink hover:text-bone md:inline-flex"
            >
              Falar com a equipa <span aria-hidden>→</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                aria-hidden
                className={`block h-px w-5 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                aria-hidden
                className={`block h-px w-5 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </motion.div>
        </nav>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[85] bg-bone/95 pt-24 backdrop-blur-xl lg:hidden"
          >
            <nav className="shell flex h-full flex-col justify-between pb-12">
              <ul className="flex flex-col">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
                    className="border-b border-[rgba(10,10,10,0.1)]"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display block py-5 text-[clamp(2rem,9vw,3rem)] leading-none"
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
                  className="mt-3 inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-bone"
                >
                  Falar com a equipa <span aria-hidden>→</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
