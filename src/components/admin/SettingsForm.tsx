"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/app/actions";
import { Labeled, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Settings } from "@/lib/types";

const initial: FormState = { status: "idle" };

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action] = useActionState(saveSettings, initial);

  return (
    <form action={action} className="grid max-w-[760px] grid-cols-1 gap-5 md:grid-cols-2">
      <Labeled label="Nome da empresa" error={state.errors?.companyName}>
        <input name="companyName" defaultValue={settings.companyName} required className={inputClass} />
      </Labeled>
      <Labeled label="Tagline" error={state.errors?.tagline}>
        <input name="tagline" defaultValue={settings.tagline} required className={inputClass} />
      </Labeled>
      <Labeled label="Email" error={state.errors?.email}>
        <input name="email" type="email" defaultValue={settings.email} required className={inputClass} />
      </Labeled>
      <Labeled label="Telefone" error={state.errors?.phone}>
        <input name="phone" defaultValue={settings.phone} required className={inputClass} />
      </Labeled>

      <div className="md:col-span-2">
        <Labeled label="Morada" error={state.errors?.address}>
          <input name="address" defaultValue={settings.address} required className={inputClass} />
        </Labeled>
      </div>

      <Labeled label="Instagram" error={state.errors?.instagram}>
        <input name="instagram" defaultValue={settings.instagram} className={inputClass} />
      </Labeled>
      <Labeled label="LinkedIn" error={state.errors?.linkedin}>
        <input name="linkedin" defaultValue={settings.linkedin} className={inputClass} />
      </Labeled>

      <div className="md:col-span-2">
        <Labeled
          label="Tempo de resposta"
          hint="Texto apresentado abaixo dos CTA de conversão."
          error={state.errors?.responseTime}
        >
          <input name="responseTime" defaultValue={settings.responseTime} required className={inputClass} />
        </Labeled>
      </div>

      <div className="flex items-center gap-4 md:col-span-2">
        <SubmitButton>Guardar configurações</SubmitButton>
        {state.status === "success" && (
          <span role="status" className="text-[13px] text-[#2f5a3c]">
            {state.message}
          </span>
        )}
        {state.status === "error" && (
          <span role="alert" className="text-[13px] text-[#b23b2e]">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
