import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminHeader } from "@/components/admin/ui";

export default async function EditarProjeto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <>
      <AdminHeader title={`Editar — ${project.title}`} description="Alterações guardadas refletem-se imediatamente no site." />
      <ProjectForm project={project} />
    </>
  );
}
