"use client";

import { useActionState, useState } from "react";
import { saveStat, type FormState } from "@/app/actions";
import { Labeled, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Stat } from "@/lib/types";

const initial: FormState = { status: "idle" };

export function StatEditor({ stat, onDone }: { stat?: Stat; onDone?: () => void }) {
  const [state, action] = useActionState(saveStat, initial);

  return (
    <form action={action} className="grid grid-cols-2 items-end gap-4 md:grid-cols-6">
      {stat && <input type="hidden" name="id" value={stat.id} />}

      <Labeled label="Prefixo">
        <input name="prefix" defaultValue={stat?.prefix ?? ""} placeholder="+" maxLength={3} className={inputClass} />
      </Labeled>
      <Labeled label="Valor" error={state.errors?.value}>
        <input name="value" type="number" min={0} defaultValue={stat?.value ?? 0} required className={inputClass} />
      </Labeled>
      <Labeled label="Sufixo">
        <input name="suffix" defaultValue={stat?.suffix ?? ""} placeholder="%" maxLength={3} className={inputClass} />
      </Labeled>

      <div className="col-span-2">
        <Labeled label="Etiqueta" error={state.errors?.label}>
          <input name="label" defaultValue={stat?.label ?? ""} placeholder="Projetos realizados" required className={inputClass} />
        </Labeled>
      </div>

      <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:justify-end">
        <label className="flex items-center gap-2 text-[12.5px]">
          <input type="checkbox" name="published" defaultChecked={stat?.published ?? true} className="h-4 w-4 accent-[#0a0a0a]" />
          Visível
        </label>
      </div>

      <div className="col-span-2 flex items-center gap-3 md:col-span-6">
        <SubmitButton>{stat ? "Guardar" : "Adicionar"}</SubmitButton>
        {onDone && (
          <button type="button" onClick={onDone} className="text-[13px] text-ink/50 hover:text-ink">
            Cancelar
          </button>
        )}
        {state.status === "success" && (
          <span role="status" className="text-[12.5px] text-[#2f5a3c]">
            {state.message}
          </span>
        )}
        {state.status === "error" && (
          <span role="alert" className="text-[12.5px] text-[#b23b2e]">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

export function AddStat() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-[rgba(10,10,10,0.22)] py-5 text-[13.5px] text-ink/55 transition-colors hover:border-ink hover:text-ink"
      >
        + Adicionar indicador
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
      <h2 className="mb-5 text-[15px] font-medium">Novo indicador</h2>
      <StatEditor onDone={() => setOpen(false)} />
    </div>
  );
}
