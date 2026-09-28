import { getSettings } from "@/lib/db";
import { AdminHeader, Card } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { isSupabaseEnabled } from "@/lib/supabase";

export default async function AdminDefinicoes() {
  const settings = await getSettings();

  return (
    <>
      <AdminHeader
        title="Configurações"
        description="Dados de contacto e textos globais utilizados no rodapé, na página de contacto e nas secções de conversão."
      />

      <SettingsForm settings={settings} />

      <section className="mt-12 grid max-w-[760px] gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-[15px] font-medium">Base de dados</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
            {isSupabaseEnabled
              ? "Supabase configurado. As credenciais estão presentes no ambiente."
              : "A correr com o store JSON local. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ligar ao Supabase."}
          </p>
        </Card>
        <Card>
          <h2 className="text-[15px] font-medium">Notificações por email</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
            {process.env.RESEND_API_KEY
              ? "Resend ativo — cada novo pedido é enviado para a caixa configurada."
              : "Resend inativo. Defina RESEND_API_KEY e QUOTES_INBOX para receber os pedidos por email."}
          </p>
        </Card>
      </section>
    </>
  );
}
