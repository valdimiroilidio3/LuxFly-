import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Conte-nos o que está a imaginar. Pedido de orçamento sem compromisso — resposta inicial em até 1 dia útil.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title={["Vamos", "conversar."]}
        lead="Conte-nos o que está a imaginar: terreno, programa, prazo e orçamento aproximado. Respondemos com uma primeira leitura de viabilidade — sem compromisso."
      />

      <section id="orcamento" className="shell pb-[96px] md:pb-[128px]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          <aside className="col-span-12 lg:col-span-3">
            <Reveal className="space-y-10">
              <div>
                <h2 className="eyebrow text-ink/40">Email</h2>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-2.5 block text-[15px] transition-colors hover:text-ink/60"
                >
                  {settings.email}
                </a>
              </div>
              <div>
                <h2 className="eyebrow text-ink/40">Telefone</h2>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="mt-2.5 block text-[15px] transition-colors hover:text-ink/60"
                >
                  {settings.phone}
                </a>
              </div>
              <div>
                <h2 className="eyebrow text-ink/40">Atelier</h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink/70">{settings.address}</p>
              </div>
              <div>
                <h2 className="eyebrow text-ink/40">Horário</h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink/70">
                  Segunda a sexta
                  <br />
                  09h00 — 18h00
                </p>
              </div>
              <p className="border-t border-[rgba(10,10,10,0.14)] pt-5 text-[13px] text-ink/45">
                {settings.responseTime}
              </p>
            </Reveal>
          </aside>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <Reveal delay={0.1}>
              <h2 className="display text-[clamp(1.6rem,3.4vw,2.6rem)]">Pedido de orçamento</h2>
              <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-ink/55">
                Quanto mais contexto nos der, mais útil será a nossa primeira resposta.
              </p>
            </Reveal>
            <div className="mt-12">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
