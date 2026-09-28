import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="relative block h-3.5 w-3.5 border border-ink">
            <span className="absolute inset-[3px] bg-ink" />
          </span>
          <span className="text-[15px] font-extrabold tracking-[-0.03em] uppercase">Modus</span>
        </div>

        <h1 className="display mt-10 text-[clamp(2rem,6vw,3rem)]">Área reservada.</h1>
        <p className="mt-4 text-[14px] leading-relaxed text-ink/55">
          Introduza a palavra-passe de administração para gerir projetos, serviços e pedidos de
          orçamento.
        </p>

        <div className="mt-10">
          <LoginForm />
        </div>

        <p className="mt-8 text-[12px] leading-relaxed text-ink/35">
          Autenticação por sessão assinada. Em produção com Supabase, substituir por Supabase Auth
          (ver <code className="text-ink/50">src/lib/auth.ts</code>).
        </p>
      </div>
    </main>
  );
}
