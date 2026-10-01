"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import type { Project } from "@/lib/types";

/**
 * Grelha editorial assimétrica.
 * `place` posiciona na grelha; `ratio` define a proporção da MOLDURA da imagem
 * — nunca do artigo, para a metadata não transbordar da caixa.
 */
const place: Record<Project["span"], string> = {
  wide: "md:col-span-8 md:col-start-1",
  tall: "md:col-span-4 md:col-start-9 md:-mt-[16%]",
  regular: "md:col-span-5 md:col-start-2 md:mt-[8%]",
  offset: "md:col-span-6 md:col-start-7 md:mt-[14%]",
};

const ratio: Record<Project["span"], string> = {
  wide: "aspect-[16/10]",
  tall: "aspect-[3/4]",
  regular: "aspect-[4/3]",
  offset: "aspect-[5/4]",
};

export function ProjectCard({
  project,
  index,
  className = "",
  frameClassName,
  sizes = "(min-width: 768px) 55vw, 100vw",
}: {
  project: Project;
  index: number;
  className?: string;
  frameClassName?: string;
  sizes?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay: (index % 2) * 0.08, ease: EASE }}
      className={className}
    >
      <Link
        href={`/projetos/${project.slug}`}
        data-cursor="hover"
        className="group block"
        aria-label={`Ver projeto ${project.title}, ${project.category}, ${project.location}`}
      >
        <div className="relative">
          <ParallaxImage
            src={project.cover}
            alt={`${project.title} — ${project.category} em ${project.location}`}
            sizes={sizes}
            strength={8}
            overlay
            className={`w-full ${frameClassName ?? ratio[project.span] ?? ratio.regular}`}
            imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />

          <span className="numeral pointer-events-none absolute top-5 left-5 z-10 text-[12px] tracking-[0.14em] text-white/85 mix-blend-difference">
            {project.index}
          </span>

          <span className="pointer-events-none absolute right-5 bottom-5 z-10 translate-y-3 rounded-full bg-bone px-5 py-2.5 text-[12.5px] text-ink opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
            Ver projeto →
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[rgba(10,10,10,0.14)] pt-3.5">
          <h3 className="text-[17px] font-medium tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-[19px]">
            {project.title}
          </h3>
          <p className="text-right text-[12.5px] leading-snug text-ink/50">
            {project.category}
            <br />
            <span className="text-ink/35">
              {project.location} · {project.year}
            </span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <section id="projetos" className="shell py-[96px]">
        <h2 className="display text-[clamp(2.4rem,6vw,5rem)]">Projetos.</h2>
        <p className="mt-6 max-w-md text-[15px] text-ink/55">
          Os projetos estão a ser preparados. Em breve partilhamos aqui as obras concluídas.
        </p>
      </section>
    );
  }

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-title"
      className="relative border-t border-[rgba(10,10,10,0.1)] py-[96px] md:py-[128px]"
    >
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="projetos-title" className="display text-[clamp(2.8rem,9vw,8rem)] text-ink">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: EASE }}
            >
              Projetos.
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="max-w-[34ch] pb-2 text-[15px] leading-relaxed text-ink/60 md:text-right"
          >
            Espaços que traduzem uma forma diferente de construir.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-12 md:gap-y-10">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              className={place[project.span] ?? place.regular}
              sizes={
                project.span === "wide"
                  ? "(min-width: 768px) 66vw, 100vw"
                  : "(min-width: 768px) 40vw, 100vw"
              }
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-20 flex justify-center md:mt-28"
        >
          <Link
            href="/projetos"
            data-cursor="hover"
            className="group inline-flex items-center gap-10 rounded-full border border-[rgba(10,10,10,0.28)] px-8 py-4 text-[13px] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink hover:text-bone"
          >
            Ver todos os projetos
            <span
              aria-hidden
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
