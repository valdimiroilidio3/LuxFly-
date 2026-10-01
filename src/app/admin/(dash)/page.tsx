import Link from "next/link";
import { getDashboard } from "@/lib/db";
import { Card } from "@/components/admin/ui";

const statusColor: Record<string, string> = {
  Novo: "bg-ink text-bone",
  "Em análise": "bg-[#c8a15a]/20 text-[#7a5c1f]",
  Contactado: "bg-[#4f7a5c]/18 text-[#2f5a3c]",
  Concluído: "bg-ink/8 text-ink/55",
};

export default async function AdminDashboard() {
  const data = await getDashboard();

  const cards = [
    { label: "Pedidos novos", value: data.newQuotes, href: "/admin/orcamentos" },
    { label: "Pedidos este mês", value: data.monthQuotes, href: "/admin/orcamentos" },
    { label: "Projetos ativos", value: data.activeProjects, href: "/admin/projetos" },
    { label: "Projetos publicados", value: data.publishedProjects, href: "/admin/projetos" },
  ];

  return (
    <>
      <header className="mb-10 border-b border-[rgba(10,10,10,0.14)] pb-7">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">Dashboard</h1>
        <p className="mt-2 text-[14px] text-ink/55">
          Visão geral da atividade — pedidos recebidos e estado do portfólio.
        </p>
      </header>

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group">
            <Card className="h-full transition-colors duration-300 group-hover:border-ink/35">
              <span className="numeral block text-[40px] leading-none font-semibold tracking-[-0.05em]">
                {c.value}
              </span>
              <span className="mt-3 block text-[13px] text-ink/55">{c.label}</span>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-[18px] font-medium tracking-[-0.02em]">Pedidos recentes</h2>
          <Link href="/admin/orcamentos" className="text-[13px] text-ink/55 hover:text-ink">
            Ver todos →
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone">
          {data.recentQuotes.length === 0 ? (
            <p className="px-6 py-14 text-center text-[14px] text-ink/45">
              Ainda não há pedidos de orçamento. Assim que um formulário for submetido, aparece aqui.
            </p>
          ) : (
            <table className="w-full text-left text-[13.5px]">
              <thead className="border-b border-[rgba(10,10,10,0.1)] text-[11px] tracking-[0.14em] text-ink/40 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-medium">Nome</th>
                  <th scope="col" className="hidden px-5 py-3.5 font-medium md:table-cell">Tipo</th>
                  <th scope="col" className="hidden px-5 py-3.5 font-medium lg:table-cell">Localização</th>
                  <th scope="col" className="px-5 py-3.5 font-medium">Data</th>
                  <th scope="col" className="px-5 py-3.5 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.recentQuotes.map((q) => (
                  <tr key={q.id} className="border-b border-[rgba(10,10,10,0.07)] last:border-0">
                    <td className="px-5 py-4">
                      <span className="font-medium">{q.name}</span>
                      <span className="block text-[12px] text-ink/45">{q.email}</span>
                    </td>
                    <td className="hidden px-5 py-4 text-ink/65 md:table-cell">{q.projectType}</td>
                    <td className="hidden px-5 py-4 text-ink/65 lg:table-cell">{q.location}</td>
                    <td className="numeral px-5 py-4 text-ink/55">
                      {new Date(q.createdAt).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11.5px] ${statusColor[q.status]}`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-[15px] font-medium">Conteúdo do site</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">
            {data.totalProjects} projetos no total, {data.publishedProjects} publicados. Os projetos
            de demonstração podem ser editados ou eliminados sem afetar o layout.
          </p>
          <Link
            href="/admin/projetos"
            className="pressable mt-5 inline-flex rounded-full border border-[rgba(10,10,10,0.25)] px-4 py-2 text-[12.5px] transition-colors hover:bg-ink hover:text-bone"
          >
            Gerir projetos →
          </Link>
        </Card>
        <Card>
          <h2 className="text-[15px] font-medium">Pedidos de orçamento</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">
            {data.totalQuotes} pedidos recebidos desde o início. Cada pedido guarda contacto,
            tipologia, localização, intervalo de orçamento e mensagem.
          </p>
          <Link
            href="/admin/orcamentos"
            className="pressable mt-5 inline-flex rounded-full border border-[rgba(10,10,10,0.25)] px-4 py-2 text-[12.5px] transition-colors hover:bg-ink hover:text-bone"
          >
            Abrir caixa de entrada →
          </Link>
        </Card>
      </section>
    </>
  );
}
