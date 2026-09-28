import { getTestimonials } from "@/lib/db";
import { deleteTestimonialAction } from "@/app/actions";
import { AdminHeader, ConfirmButton, EmptyState } from "@/components/admin/ui";
import { AddTestimonial, TestimonialRow } from "@/components/admin/TestimonialEditor";

export default async function AdminTestemunhos() {
  const testimonials = await getTestimonials();

  return (
    <>
      <AdminHeader
        title="Testemunhos"
        description="Palavras de clientes. Publique apenas com autorização expressa de quem as escreveu."
      />

      <div className="space-y-3">
        {testimonials.length === 0 ? (
          <EmptyState
            title="Sem testemunhos"
            description="Ainda não existem testemunhos. A secção deixa de aparecer no site enquanto estiver vazia."
          />
        ) : (
          testimonials.map((t) => (
            <div key={t.id}>
              <TestimonialRow testimonial={t} />
              <form action={deleteTestimonialAction} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={t.id} />
                <ConfirmButton message={`Eliminar o testemunho de ${t.author}?`}>Eliminar</ConfirmButton>
              </form>
            </div>
          ))
        )}
        <AddTestimonial />
      </div>
    </>
  );
}
