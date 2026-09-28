import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/db";
import { deleteProjectAction, toggleProjectPublished } from "@/app/actions";
import { AdminHeader, ConfirmButton, EmptyState } from "@/components/admin/ui";

export default async function AdminProjetos() {
  const projects = await getProjects();

  return (
    <>
      <AdminHeader
        title="Projetos"
        description="Adicione, edite, publique ou remova projetos. As alterações refletem-se imediatamente no site."
        action={
          <Link
            href="/admin/projetos/novo"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] text-bone transition-colors hover:bg-[#1f1f1f]"
          >
            Adicionar projeto <span aria-hidden>+</span>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Sem projetos"
          description="Ainda não existe nenhum projeto. Crie o primeiro para o publicar no portfólio."
          action={
            <Link href="/admin/projetos/novo" className="rounded-full bg-ink px-5 py-2.5 text-[13px] text-bone">
              Adicionar projeto
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-5 rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-4 md:flex-row md:items-center"
            >
              <div className="relative h-[92px] w-full shrink-0 overflow-hidden rounded-xl bg-bone-3 md:w-[140px]">
                <Image src={p.cover} alt="" fill sizes="140px" className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="numeral text-[11px] tracking-[0.14em] text-ink/40">{p.index}</span>
                  <h2 className="text-[16px] font-medium tracking-[-0.02em]">{p.title}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                      p.published ? "bg-[#4f7a5c]/18 text-[#2f5a3c]" : "bg-ink/8 text-ink/50"
                    }`}
                  >
                    {p.published ? "Publicado" : "Rascunho"}
                  </span>
                  {p.featured && (
                    <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-[11px] text-ink/55">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="mt-1.5 truncate text-[13px] text-ink/50">
                  {p.category} · {p.location} · {p.year} · {p.status}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/projetos/${p.slug}`}
                  target="_blank"
                  className="rounded-full border border-[rgba(10,10,10,0.18)] px-4 py-2 text-[12.5px] text-ink/65 transition-colors hover:border-ink hover:text-ink"
                >
                  Ver
                </Link>
                <form action={toggleProjectPublished}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-[rgba(10,10,10,0.18)] px-4 py-2 text-[12.5px] text-ink/65 transition-colors hover:border-ink hover:text-ink"
                  >
                    {p.published ? "Despublicar" : "Publicar"}
                  </button>
                </form>
                <Link
                  href={`/admin/projetos/${p.id}`}
                  className="rounded-full bg-ink px-4 py-2 text-[12.5px] text-bone transition-colors hover:bg-[#1f1f1f]"
                >
                  Editar
                </Link>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton message={`Eliminar o projeto “${p.title}”? Esta ação não pode ser revertida.`}>
                    Eliminar
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
