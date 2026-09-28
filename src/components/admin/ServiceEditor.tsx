"use client";

import { useActionState, useState } from "react";
import { saveService, type FormState } from "@/app/actions";
import { Labeled, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Service } from "@/lib/types";

const initial: FormState = { status: "idle" };

export function ServiceEditor({
  service,
  onDone,
}: {
  service?: Service;
  onDone?: () => void;
}) {
  const [state, action] = useActionState(saveService, initial);

  return (
    <form action={action} className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {service && <input type="hidden" name="id" value={service.id} />}

      <Labeled label="Número" error={state.errors?.index}>
        <input name="index" defaultValue={service?.index ?? ""} placeholder="07" required className={inputClass} />
      </Labeled>
      <Labeled label="Título" error={state.errors?.title}>
        <input name="title" defaultValue={service?.title ?? ""} placeholder="Consultoria" required className={inputClass} />
      </Labeled>

      <div className="md:col-span-2">
        <Labeled label="Descrição curta" error={state.errors?.description}>
          <input
            name="description"
            defaultValue={service?.description ?? ""}
            placeholder="Frase única, direta, sem jargão."
            required
            className={inputClass}
          />
        </Labeled>
      </div>

      <div className="md:col-span-2">
        <Labeled label="Detalhes" hint="Um ponto por linha — aparece na página de serviços.">
          <textarea
            name="detail"
            rows={3}
            defaultValue={service?.detail.join("\n") ?? ""}
            className={`${inputClass} resize-y`}
          />
        </Labeled>
      </div>

      <div className="md:col-span-2">
        <Labeled label="Imagem" hint="Mostrada na pré-visualização em hover e na página de serviços.">
          <input
            name="image"
            defaultValue={service?.image ?? "/images/detail-macro.webp"}
            required
            className={`${inputClass} font-mono text-[12.5px]`}
          />
        </Labeled>
      </div>

      <div className="flex items-center justify-between gap-4 md:col-span-2">
        <label className="flex items-center gap-3 text-[13.5px]">
          <input
            type="checkbox"
            name="published"
            defaultChecked={service?.published ?? true}
            className="h-4 w-4 accent-[#0a0a0a]"
          />
          Visível no site
        </label>
        <div className="flex items-center gap-3">
          {onDone && (
            <button type="button" onClick={onDone} className="text-[13px] text-ink/50 hover:text-ink">
              Cancelar
            </button>
          )}
          <SubmitButton>{service ? "Guardar" : "Adicionar serviço"}</SubmitButton>
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-[13px] text-[#b23b2e] md:col-span-2">
          {state.message}
        </p>
      )}
    </form>
  );
}

export function ServiceRow({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="numeral text-[11px] tracking-[0.14em] text-ink/40">{service.index}</span>
            <h2 className="text-[16px] font-medium tracking-[-0.02em]">{service.title}</h2>
            {!service.published && (
              <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-[11px] text-ink/50">Oculto</span>
            )}
          </div>
          <p className="mt-1.5 text-[13px] text-ink/50">{service.description}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full border border-[rgba(10,10,10,0.18)] px-4 py-2 text-[12.5px] text-ink/65 transition-colors hover:border-ink hover:text-ink"
        >
          {open ? "Fechar" : "Editar"}
        </button>
      </div>

      {open && (
        <div className="mt-6 border-t border-[rgba(10,10,10,0.1)] pt-6">
          <ServiceEditor service={service} onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

export function AddService() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-[rgba(10,10,10,0.22)] py-5 text-[13.5px] text-ink/55 transition-colors hover:border-ink hover:text-ink"
      >
        + Adicionar serviço
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
      <h2 className="mb-5 text-[15px] font-medium">Novo serviço</h2>
      <ServiceEditor onDone={() => setOpen(false)} />
    </div>
  );
}
