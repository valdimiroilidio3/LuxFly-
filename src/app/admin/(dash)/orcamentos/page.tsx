import { getQuotes } from "@/lib/db";
import { deleteQuoteAction, updateQuoteStatus } from "@/app/actions";
import { AdminHeader, ConfirmButton, EmptyState } from "@/components/admin/ui";
import { QUOTE_STATUSES } from "@/lib/types";

const statusColor: Record<string, string> = {
  Novo: "bg-ink text-bone",
  "Em análise": "bg-[#c8a15a]/20 text-[#7a5c1f]",
  Contactado: "bg-[#4f7a5c]/18 text-[#2f5a3c]",
  Concluído: "bg-ink/8 text-ink/55",
};

export default async function AdminOrcamentos() {
  const quotes = await getQuotes();
  const counts = QUOTE_STATUSES.map((s) => ({ s, n: quotes.filter((q) => q.status === s).length }));

  return (
    <>
      <AdminHeader
        title="Pedidos de orçamento"
        description="Todos os pedidos submetidos através do formulário de contacto, com o respetivo estado."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {counts.map(({ s, n }) => (
          <span key={s} className={`rounded-full px-3.5 py-1.5 text-[12.5px] ${statusColor[s]}`}>
            {s} · <span className="numeral">{n}</span>
          </span>
        ))}
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          title="Caixa de entrada vazia"
          description="Ainda não foram recebidos pedidos de orçamento. Os novos pedidos aparecem aqui automaticamente."
        />
      ) : (
        <ul className="space-y-3">
          {quotes.map((q) => (
            <li key={q.id} className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-[16px] font-medium tracking-[-0.02em]">{q.name}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${statusColor[q.status]}`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink/55">
                    <a href={`mailto:${q.email}`} className="hover:text-ink">{q.email}</a>
                    <a href={`tel:${q.phone.replace(/\s/g, "")}`} className="hover:text-ink">{q.phone}</a>
                    <span className="numeral">
                      {new Date(q.createdAt).toLocaleString("pt-PT", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <form action={updateQuoteStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={q.id} />
                    <label htmlFor={`status-${q.id}`} className="sr-only">
                      Estado do pedido de {q.name}
                    </label>
                    <select
                      id={`status-${q.id}`}
                      name="status"
                      defaultValue={q.status}
                      className="pressable rounded-full border border-[rgba(10,10,10,0.18)] bg-bone px-3.5 py-2 text-[12.5px] focus:border-ink focus:outline-none"
                    >
                      {QUOTE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="pressable rounded-full bg-ink px-4 py-2 text-[12.5px] text-bone transition-colors hover:bg-[#1f1f1f]"
                    >
                      Atualizar
                    </button>
                  </form>
                  <form action={deleteQuoteAction}>
                    <input type="hidden" name="id" value={q.id} />
                    <ConfirmButton message={`Eliminar o pedido de ${q.name}?`}>Eliminar</ConfirmButton>
                  </form>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[rgba(10,10,10,0.08)] pt-5 text-[13px] md:grid-cols-4">
                <div>
                  <dt className="eyebrow text-ink/40">Tipo</dt>
                  <dd className="mt-1">{q.projectType}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/40">Localização</dt>
                  <dd className="mt-1">{q.location}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="eyebrow text-ink/40">Orçamento</dt>
                  <dd className="mt-1">{q.budget}</dd>
                </div>
                <div className="col-span-2 md:col-span-4">
                  <dt className="eyebrow text-ink/40">Mensagem</dt>
                  <dd className="mt-1.5 max-w-[80ch] leading-relaxed text-ink/70">{q.message}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
