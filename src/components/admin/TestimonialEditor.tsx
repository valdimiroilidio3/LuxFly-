"use client";

import { useActionState, useState } from "react";
import { saveTestimonial, type FormState } from "@/app/actions";
import { Labeled, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Testimonial } from "@/lib/types";

const initial: FormState = { status: "idle" };

function Editor({ testimonial, onDone }: { testimonial?: Testimonial; onDone?: () => void }) {
  const [state, action] = useActionState(saveTestimonial, initial);

  return (
    <form action={action} className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div className="md:col-span-3">
        <Labeled label="Testemunho" error={state.errors?.quote}>
          <textarea
            name="quote"
            rows={3}
            defaultValue={testimonial?.quote ?? ""}
            placeholder="Frase do cliente, sem aspas — são adicionadas automaticamente."
            required
            className={`${inputClass} resize-y`}
          />
        </Labeled>
      </div>

      <Labeled label="Nome" error={state.errors?.author}>
        <input name="author" defaultValue={testimonial?.author ?? ""} required className={inputClass} />
      </Labeled>
      <Labeled label="Qualidade" error={state.errors?.role}>
        <input
          name="role"
          defaultValue={testimonial?.role ?? "Cliente particular"}
          required
          className={inputClass}
        />
      </Labeled>
      <Labeled label="Projeto">
        <input name="project" defaultValue={testimonial?.project ?? ""} placeholder="Casa LUMEN" className={inputClass} />
      </Labeled>

      <div className="flex items-center justify-between gap-4 md:col-span-3">
        <label className="flex items-center gap-3 text-[13.5px]">
          <input
            type="checkbox"
            name="published"
            defaultChecked={testimonial?.published ?? true}
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
          <SubmitButton>{testimonial ? "Guardar" : "Adicionar testemunho"}</SubmitButton>
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-[13px] text-[#b23b2e] md:col-span-3">
          {state.message}
        </p>
      )}
    </form>
  );
}

export function TestimonialRow({ testimonial }: { testimonial: Testimonial }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-[70ch]">
          <p className="text-[15px] leading-relaxed">“{testimonial.quote}”</p>
          <p className="mt-2.5 text-[12.5px] text-ink/45">
            {testimonial.author} · {testimonial.role}
            {testimonial.project ? ` · ${testimonial.project}` : ""}
            {!testimonial.published && " · oculto"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="pressable rounded-full border border-[rgba(10,10,10,0.18)] px-4 py-2 text-[12.5px] text-ink/65 transition-colors hover:border-ink hover:text-ink"
        >
          {open ? "Fechar" : "Editar"}
        </button>
      </div>

      {open && (
        <div className="mt-6 border-t border-[rgba(10,10,10,0.1)] pt-6">
          <Editor testimonial={testimonial} onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

export function AddTestimonial() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pressable w-full rounded-2xl border border-dashed border-[rgba(10,10,10,0.22)] py-5 text-[13.5px] text-ink/55 transition-colors hover:border-ink hover:text-ink"
      >
        + Adicionar testemunho
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-5">
      <h2 className="mb-5 text-[15px] font-medium">Novo testemunho</h2>
      <Editor onDone={() => setOpen(false)} />
    </div>
  );
}
