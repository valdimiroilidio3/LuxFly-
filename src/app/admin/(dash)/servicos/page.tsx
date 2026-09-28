import { getServices } from "@/lib/db";
import { deleteServiceAction } from "@/app/actions";
import { AdminHeader, ConfirmButton, EmptyState } from "@/components/admin/ui";
import { AddService, ServiceRow } from "@/components/admin/ServiceEditor";

export default async function AdminServicos() {
  const services = await getServices();

  return (
    <>
      <AdminHeader
        title="Serviços"
        description="A lista editorial da homepage e a página /servicos são geradas a partir destes registos."
      />

      <div className="space-y-3">
        {services.length === 0 ? (
          <EmptyState title="Sem serviços" description="Adicione o primeiro serviço para o mostrar no site." />
        ) : (
          services.map((s) => (
            <div key={s.id} className="relative">
              <ServiceRow service={s} />
              <form action={deleteServiceAction} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={s.id} />
                <ConfirmButton message={`Eliminar o serviço “${s.title}”?`}>Eliminar</ConfirmButton>
              </form>
            </div>
          ))
        )}
        <AddService />
      </div>
    </>
  );
}
