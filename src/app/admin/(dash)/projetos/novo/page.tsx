import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminHeader } from "@/components/admin/ui";

export default function NovoProjeto() {
  return (
    <>
      <AdminHeader
        title="Novo projeto"
        description="Preencha os campos e publique quando o conteúdo estiver pronto."
      />
      <ProjectForm />
    </>
  );
}
