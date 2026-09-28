import { getStats } from "@/lib/db";
import { deleteStatAction } from "@/app/actions";
import { AdminHeader, ConfirmButton } from "@/components/admin/ui";
import { AddStat, StatEditor } from "@/components/admin/StatEditor";

export default async function AdminEstatisticas() {
  const stats = await getStats();

  return (
    <>
      <AdminHeader
        title="Estatísticas"
        description="Números apresentados na secção “Experiência que se mede em detalhes”. Animam com contagem ao entrar no ecrã."
      />

      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.id} className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
            <StatEditor stat={s} />
            <form action={deleteStatAction} className="mt-4 flex justify-end border-t border-[rgba(10,10,10,0.08)] pt-4">
              <input type="hidden" name="id" value={s.id} />
              <ConfirmButton message={`Eliminar o indicador “${s.label}”?`}>Eliminar</ConfirmButton>
            </form>
          </div>
        ))}
        <AddStat />
      </div>
    </>
  );
}
