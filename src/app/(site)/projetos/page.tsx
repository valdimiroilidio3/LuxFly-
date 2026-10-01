import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { ProjectCard } from "@/components/home/ProjectsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getProjects, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Moradias contemporâneas e obras de reabilitação executadas pela MODUS em Coimbra, Lisboa, Porto e Cascais.",
  alternates: { canonical: "/projetos" },
};

export default async function ProjetosPage() {
  const [projects, settings] = await Promise.all([
    getProjects({ publishedOnly: true }),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Portfólio"
        title={["Projetos."]}
        lead="Espaços que traduzem uma forma diferente de construir. Cada obra parte de um terreno, de um orçamento e de uma forma de viver — nunca de um modelo repetido."
      />

      <section className="shell pb-[96px] md:pb-[128px]">
        {projects.length === 0 ? (
          <div className="border-t border-[rgba(10,10,10,0.14)] py-24 text-center">
            <p className="text-[17px] text-ink/55">Ainda não existem projetos publicados.</p>
            <p className="mt-2 text-[14px] text-ink/40">
              Volte em breve — estamos a preparar o registo fotográfico das obras concluídas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 md:gap-y-24">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                sizes="(min-width: 768px) 46vw, 100vw"
                className={i % 2 === 1 ? "md:mt-[18%]" : ""}
                frameClassName="aspect-[4/3]"
              />
            ))}
          </div>
        )}
      </section>

      <FinalCTA responseTime={settings.responseTime} />
    </>
  );
}
