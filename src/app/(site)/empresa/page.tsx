import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, ImageReveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { StatsSection } from "@/components/home/StatsSection";
import { DetailSection } from "@/components/home/DetailSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getSettings, getStats, getTestimonials } from "@/lib/db";

export const metadata: Metadata = {
  title: "A empresa",
  description:
    "A MODUS combina arquitetura, engenharia e execução rigorosa para construir casas contemporâneas pensadas para durar.",
  alternates: { canonical: "/empresa" },
};

const principles = [
  {
    index: "01",
    title: "Rigor antes da obra",
    text: "Desenhamos o pormenor construtivo antes de abrir o estaleiro. É mais lento no início e muito mais barato no fim.",
  },
  {
    index: "02",
    title: "Poucas obras em simultâneo",
    text: "Limitamos o número de empreitadas ativas para garantir presença técnica permanente em cada uma.",
  },
  {
    index: "03",
    title: "Custo transparente",
    text: "Orçamento aberto por capítulo, autos de medição claros e aviso antecipado de qualquer desvio.",
  },
  {
    index: "04",
    title: "Materiais que envelhecem bem",
    text: "Preferimos betão, pedra e madeira maciça a soluções que exigem substituição em poucos anos.",
  },
];

export default async function EmpresaPage() {
  const [stats, testimonials, settings] = await Promise.all([
    getStats({ publishedOnly: true }),
    getTestimonials({ publishedOnly: true }),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="01 — A empresa"
        title={["Construímos", "para permanecer."]}
        lead="A MODUS nasce da combinação entre arquitetura, engenharia e execução rigorosa. Criamos espaços pensados para durar, equilibrando estética, funcionalidade e qualidade construtiva."
      />

      <section className="shell pb-[96px] md:pb-[128px]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          <div className="col-span-12 space-y-6 md:col-span-5">
            <Reveal>
              <p className="text-[16px] leading-[1.7] text-ink/70">
                Começámos em 2016 com uma equipa pequena e uma ideia simples: quem desenha deve
                acompanhar quem constrói. Desde então mantivemos arquitetura, engenharia e produção
                dentro da mesma estrutura.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[15px] leading-[1.7] text-ink/55">
                Trabalhamos sobretudo em moradias unifamiliares e reabilitação de qualidade, entre
                Coimbra, Lisboa, Porto e a linha de Cascais. Acompanhamos o cliente desde a análise
                do terreno até à vistoria final — e continuamos disponíveis depois da entrega.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-[15px] leading-[1.7] text-ink/55">
                Não somos a solução mais barata do mercado e não tentamos ser. Somos a equipa que
                explica cada euro do orçamento e entrega aquilo que desenhou.
              </p>
            </Reveal>
          </div>

          <ImageReveal className="col-span-12 md:col-span-6 md:col-start-7">
            <ParallaxImage
              src="/images/proj-aurea.webp"
              alt="Moradia contemporânea construída pela MODUS em Lisboa"
              sizes="(min-width: 768px) 50vw, 100vw"
              strength={12}
              className="aspect-[4/5] w-full"
            />
          </ImageReveal>
        </div>

        <div className="mt-24 md:mt-32">
          <h2 className="display text-[clamp(1.8rem,4vw,3.2rem)]">Como trabalhamos.</h2>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.index} delay={i * 0.07} className="border-t border-[rgba(10,10,10,0.18)] pt-5">
                <span className="numeral text-[12px] tracking-[0.14em] text-ink/35">{p.index}</span>
                <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-ink/55">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DetailSection />
      <StatsSection stats={stats} />
      <TestimonialsSection testimonials={testimonials} />
      <FinalCTA responseTime={settings.responseTime} />
    </>
  );
}
