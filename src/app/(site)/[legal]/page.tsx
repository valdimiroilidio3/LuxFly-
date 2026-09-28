import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/lib/site";

type Params = { params: Promise<{ legal: string }> };

const pages = {
  privacidade: {
    title: ["Privacidade."],
    eyebrow: "Política de privacidade",
    lead: "Tratamos os seus dados com o mesmo cuidado com que construímos: apenas o necessário, apenas durante o tempo necessário.",
    sections: [
      {
        h: "Dados que recolhemos",
        p: "Através do formulário de pedido de orçamento recolhemos nome, email, telefone, tipo de projeto, localização, intervalo de orçamento e a mensagem que nos escreve. Não recolhemos categorias especiais de dados.",
      },
      {
        h: "Finalidade",
        p: "Os dados são utilizados exclusivamente para responder ao seu pedido, preparar uma estimativa e manter o histórico da comunicação. Não são vendidos nem partilhados com terceiros para fins comerciais.",
      },
      {
        h: "Conservação",
        p: "Os pedidos são conservados durante 24 meses. Pode solicitar a eliminação antecipada a qualquer momento.",
      },
      {
        h: "Os seus direitos",
        p: `Pode aceder, corrigir, limitar ou eliminar os seus dados escrevendo para ${site.email}. Tem ainda o direito de apresentar reclamação à CNPD.`,
      },
    ],
  },
  cookies: {
    title: ["Cookies."],
    eyebrow: "Política de cookies",
    lead: "Utilizamos o mínimo indispensável para que o site funcione e para perceber, de forma agregada, o que é mais consultado.",
    sections: [
      {
        h: "Cookies essenciais",
        p: "Necessários ao funcionamento do site e à sessão da área reservada. Não podem ser desativados sem comprometer a navegação.",
      },
      {
        h: "Medição de audiência",
        p: "Utilizamos métricas agregadas e anónimas de visitas e desempenho. Não construímos perfis individuais nem fazemos publicidade comportamental.",
      },
      {
        h: "Gestão",
        p: "Pode bloquear ou eliminar cookies nas definições do seu navegador. O site continua funcional, embora algumas preferências deixem de ser memorizadas.",
      },
    ],
  },
  termos: {
    title: ["Termos."],
    eyebrow: "Termos e condições",
    lead: "Condições de utilização deste website e âmbito da informação aqui publicada.",
    sections: [
      {
        h: "Âmbito",
        p: "A informação sobre projetos, prazos e serviços tem carácter informativo. Nenhum conteúdo deste site constitui, por si só, uma proposta contratual vinculativa.",
      },
      {
        h: "Orçamentos",
        p: "As estimativas iniciais resultam de informação fornecida pelo cliente e são confirmadas apenas após visita técnica e projeto. Qualquer valor indicado antes dessa fase é indicativo.",
      },
      {
        h: "Propriedade intelectual",
        p: "Textos, fotografias e desenhos publicados são propriedade da MODUS ou dos respetivos autores e não podem ser reproduzidos sem autorização escrita.",
      },
      {
        h: "Lei aplicável",
        p: "Estes termos regem-se pela lei portuguesa, sendo competente o foro da comarca de Coimbra.",
      },
    ],
  },
} as const;

type LegalKey = keyof typeof pages;

export function generateStaticParams() {
  return Object.keys(pages).map((legal) => ({ legal }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { legal } = await params;
  const page = pages[legal as LegalKey];
  if (!page) return {};
  return {
    title: page.title[0].replace(".", ""),
    description: page.lead,
    alternates: { canonical: `/${legal}` },
  };
}

export default async function LegalPage({ params }: Params) {
  const { legal } = await params;
  const page = pages[legal as LegalKey];
  if (!page) notFound();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={[...page.title]} lead={page.lead} />
      <section className="shell pb-[96px] md:pb-[128px]">
        <div className="max-w-[62ch] border-t border-[rgba(10,10,10,0.18)]">
          {page.sections.map((s) => (
            <article key={s.h} className="border-b border-[rgba(10,10,10,0.12)] py-9">
              <h2 className="text-[18px] font-medium tracking-[-0.02em]">{s.h}</h2>
              <p className="mt-3.5 text-[15px] leading-[1.7] text-ink/60">{s.p}</p>
            </article>
          ))}
          <p className="pt-8 text-[13px] text-ink/40">Última atualização: janeiro de 2026.</p>
        </div>
      </section>
    </>
  );
}
