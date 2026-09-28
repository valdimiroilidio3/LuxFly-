import Image from "next/image";
import { Reveal, MaskReveal, ImageReveal } from "@/components/motion/Reveal";

const capabilities = ["Construção residencial", "Arquitetura contemporânea", "Gestão de projeto"];

export function CompanySection() {
  return (
    <section
      id="empresa"
      aria-labelledby="empresa-title"
      className="relative border-t border-[rgba(10,10,10,0.1)] py-[96px] md:py-[128px]"
    >
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Número gigante */}
          <div className="col-span-12 md:col-span-2">
            <Reveal>
              <span className="display numeral block text-[clamp(4rem,9vw,8.5rem)] leading-[0.8] text-ink/12">
                01
              </span>
            </Reveal>
          </div>

          {/* Texto */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <h2
              id="empresa-title"
              className="display text-[clamp(2.4rem,5.6vw,5rem)] text-ink"
            >
              <MaskReveal>Construímos</MaskReveal>
              <MaskReveal delay={0.08}>para permanecer.</MaskReveal>
            </h2>

            <Reveal delay={0.15} className="mt-8 max-w-[46ch] space-y-5">
              <p className="text-[16px] leading-[1.65] text-ink/70 md:text-[17px]">
                A MODUS nasce da combinação entre arquitetura, engenharia e execução rigorosa.
                Criamos espaços pensados para durar, equilibrando estética, funcionalidade e
                qualidade construtiva.
              </p>
              <p className="text-[15px] leading-[1.65] text-ink/55">
                Trabalhamos com um número limitado de obras em simultâneo. É essa decisão que nos
                permite estar presentes no estaleiro, discutir cada pormenor construtivo e entregar
                dentro do prazo acordado.
              </p>
            </Reveal>

            <Reveal delay={0.25} className="mt-10">
              <ul className="flex flex-col divide-y divide-[rgba(10,10,10,0.12)] border-y border-[rgba(10,10,10,0.12)]">
                {capabilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between py-3.5 text-[14px] text-ink/75"
                  >
                    {item}
                    <span aria-hidden className="text-ink/25">
                      ✦
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Fotografia vertical */}
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <ImageReveal className="relative aspect-[3/4.2] w-full overflow-hidden bg-bone-2">
              <Image
                src="/images/proj-norte.webp"
                alt="Pormenor de fachada em betão aparente e madeira de uma moradia MODUS"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </ImageReveal>
            <Reveal delay={0.2}>
              <p className="mt-4 flex items-center justify-between text-[12px] tracking-[0.02em] text-ink/45">
                <span>Casa NORTE — Porto</span>
                <span className="numeral">2024</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
