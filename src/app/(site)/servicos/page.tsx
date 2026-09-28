import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, ImageReveal } from "@/components/motion/Reveal";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getServices, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Construção, reabilitação, arquitetura, gestão de obra, interiores e consultoria. Uma equipa multidisciplinar do primeiro traço à entrega.",
  alternates: { canonical: "/servicos" },
};

export default async function ServicosPage() {
  const [services, settings] = await Promise.all([
    getServices({ publishedOnly: true }),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Serviços"
        title={["O que", "fazemos."]}
        lead="Trabalhamos as várias fases de um projeto dentro da mesma equipa. Isso reduz intermediários, evita decisões contraditórias e mantém uma única responsabilidade técnica do início ao fim."
      />

      <section className="shell pb-[96px] md:pb-[128px]">
        <div className="border-t border-[rgba(10,10,10,0.18)]">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              delay={(i % 2) * 0.06}
              className="grid grid-cols-12 items-start gap-x-6 gap-y-8 border-b border-[rgba(10,10,10,0.12)] py-12 md:py-16"
            >
              <span className="numeral col-span-2 text-[12px] tracking-[0.14em] text-ink/35 md:col-span-1">
                {service.index}
              </span>

              <div className="col-span-10 md:col-span-4">
                <h2 className="text-[clamp(1.6rem,3.2vw,2.4rem)] leading-none font-semibold tracking-[-0.04em]">
                  {service.title}
                </h2>
                <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink/60">
                  {service.description}
                </p>
                {service.detail.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {service.detail.map((d) => (
                      <li key={d} className="flex gap-3 text-[14px] leading-relaxed text-ink/55">
                        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-ink/30" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <ImageReveal
                delay={0.1}
                className="relative col-span-12 aspect-[16/10] overflow-hidden bg-bone-2 md:col-span-6 md:col-start-7 md:aspect-[16/9]"
              >
                <Image
                  src={service.image}
                  alt={`${service.title} — obra MODUS`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </ImageReveal>
            </Reveal>
          ))}
        </div>
      </section>

      <ProcessSection />
      <FinalCTA responseTime={settings.responseTime} />
    </>
  );
}
