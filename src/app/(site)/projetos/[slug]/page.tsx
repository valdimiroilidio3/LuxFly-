import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, ImageReveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getProject, getProjects, getSettings } from "@/lib/db";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects({ publishedOnly: true });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Projeto não encontrado" };

  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      title: `${project.title} — MODUS`,
      description: project.excerpt,
      images: [{ url: project.cover, width: 1200, height: 630, alt: project.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — MODUS`,
      description: project.excerpt,
      images: [project.cover],
    },
  };
}

export default async function ProjetoPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || !project.published) notFound();

  const all = await getProjects({ publishedOnly: true });
  const settings = await getSettings();
  const current = all.findIndex((p) => p.id === project.id);
  const next = all[(current + 1) % all.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    image: `${site.url}${project.cover}`,
    dateCreated: project.year,
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "Organization", name: "MODUS", url: site.url },
  };

  const meta = [
    { label: "Tipologia", value: project.category },
    { label: "Localização", value: project.location },
    { label: "Ano", value: project.year },
    { label: "Área", value: project.area || "—" },
    { label: "Estado", value: project.status || "—" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="shell pt-[152px] md:pt-[200px]">
        <Reveal as="p" className="eyebrow text-ink/40">
          <span className="numeral">{project.index}</span> — Projeto
        </Reveal>
        <h1 className="display mt-7 text-[clamp(2.8rem,10vw,9rem)]">{project.title}</h1>
        <Reveal delay={0.15} className="mt-10 max-w-[54ch]">
          <p className="text-[17px] leading-[1.6] text-ink/65">{project.excerpt}</p>
        </Reveal>
      </header>

      <section className="shell mt-16 md:mt-24">
        <ImageReveal>
          <ParallaxImage
            src={project.cover}
            alt={`${project.title} — vista geral`}
            sizes="100vw"
            strength={9}
            priority
            className="aspect-[16/9] w-full"
          />
        </ImageReveal>
      </section>

      <section className="shell mt-16 md:mt-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <dl className="border-t border-[rgba(10,10,10,0.18)]">
              {meta.map((m) => (
                <div
                  key={m.label}
                  className="flex items-baseline justify-between gap-6 border-b border-[rgba(10,10,10,0.12)] py-4"
                >
                  <dt className="eyebrow text-ink/40">{m.label}</dt>
                  <dd className="text-[14px] text-ink/80">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 space-y-6 md:col-span-7 md:col-start-6">
            {project.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-[16px] leading-[1.7] text-ink/70 md:text-[17px]">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {project.gallery.length > 1 && (
        <section className="shell mt-24 grid grid-cols-12 gap-6 md:mt-32">
          {project.gallery.slice(1).map((src, i) => (
            <ImageReveal
              key={src + i}
              delay={i * 0.06}
              className={i % 2 === 0 ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4 md:mt-16"}
            >
              <ParallaxImage
                src={src}
                alt={`${project.title} — imagem ${i + 2}`}
                sizes="(min-width: 768px) 60vw, 100vw"
                strength={11}
                className={`w-full ${i % 2 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}
              />
            </ImageReveal>
          ))}
        </section>
      )}

      {next && next.id !== project.id && (
        <section className="shell mt-24 border-t border-[rgba(10,10,10,0.14)] py-12 md:mt-32">
          <Link href={`/projetos/${next.slug}`} data-cursor="hover" className="group block">
            <p className="eyebrow text-ink/40">Projeto seguinte</p>
            <div className="mt-5 flex items-end justify-between gap-6">
              <h2 className="display text-[clamp(2rem,6vw,4.5rem)] transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] hoverable:group-hover:translate-x-2">
                {next.title}
              </h2>
              <span aria-hidden className="pb-3 text-[22px] transition-transform duration-[220ms] hoverable:group-hover:translate-x-2">
                →
              </span>
            </div>
          </Link>
        </section>
      )}

      <div className="mt-8">
        <FinalCTA responseTime={settings.responseTime} />
      </div>
    </>
  );
}
